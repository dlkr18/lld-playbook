package com.you.lld.problems.filesystem.impl;

import com.you.lld.problems.filesystem.api.FileSystemService;
import com.you.lld.problems.filesystem.exceptions.DirectoryNotEmptyException;
import com.you.lld.problems.filesystem.exceptions.FileAlreadyExistsException;
import com.you.lld.problems.filesystem.exceptions.FileNotFoundException;
import com.you.lld.problems.filesystem.model.DirectoryEntry;
import com.you.lld.problems.filesystem.model.FileEntry;
import com.you.lld.problems.filesystem.model.FileSystemEntry;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.locks.ReadWriteLock;
import java.util.concurrent.locks.ReentrantReadWriteLock;

/**
 * Thread-safe in-memory file system built on the Composite pattern.
 *
 * Patterns:
 *   Composite  -- FileSystemEntry → FileEntry (leaf) / DirectoryEntry (composite)
 *   ReadWriteLock -- multiple concurrent readers, exclusive writer
 *
 * Tree structure:
 *   root (DirectoryEntry "/")
 *     └── home (DirectoryEntry)
 *           ├── alice (DirectoryEntry)
 *           │     └── readme.txt (FileEntry)
 *           └── bob (DirectoryEntry)
 *
 * Path resolution walks the tree from root by splitting the normalized path
 * into segments and descending through DirectoryEntry children.
 * No flat map -- the tree IS the data structure.
 */
public class InMemoryFileSystem implements FileSystemService {

    private final DirectoryEntry root = new DirectoryEntry("/");
    private final ReadWriteLock lock = new ReentrantReadWriteLock();

    // ======================== Create ========================

    @Override
    public boolean createFile(String path, String content) {
        String[] parsed = parseParentAndName(path);
        String parentPath = parsed[0];
        String name = parsed[1];

        lock.writeLock().lock();
        try {
            DirectoryEntry parent = resolveDirectory(parentPath);
            if (parent.hasChild(name)) {
                throw new FileAlreadyExistsException("Already exists: " + normalizePath(path));
            }
            parent.addChild(new FileEntry(name, content));
            return true;
        } finally {
            lock.writeLock().unlock();
        }
    }

    @Override
    public boolean createDirectory(String path) {
        String[] parsed = parseParentAndName(path);
        String parentPath = parsed[0];
        String name = parsed[1];

        lock.writeLock().lock();
        try {
            DirectoryEntry parent = resolveDirectory(parentPath);
            if (parent.hasChild(name)) {
                throw new FileAlreadyExistsException("Already exists: " + normalizePath(path));
            }
            parent.addChild(new DirectoryEntry(name));
            return true;
        } finally {
            lock.writeLock().unlock();
        }
    }

    // ======================== Read / Write ========================

    @Override
    public Optional<String> readFile(String path) {
        lock.readLock().lock();
        try {
            FileSystemEntry entry = resolve(normalizePath(path));
            if (entry == null || entry.isDirectory()) return Optional.empty();
            return Optional.of(((FileEntry) entry).getContent());
        } finally {
            lock.readLock().unlock();
        }
    }

    @Override
    public boolean writeFile(String path, String content) {
        lock.writeLock().lock();
        try {
            FileSystemEntry entry = resolve(normalizePath(path));
            if (entry == null || entry.isDirectory()) return false;
            ((FileEntry) entry).setContent(content);
            return true;
        } finally {
            lock.writeLock().unlock();
        }
    }

    // ======================== Delete ========================

    @Override
    public boolean delete(String path) {
        path = normalizePath(path);
        if ("/".equals(path)) return false;

        String[] parsed = parseParentAndName(path);
        String parentPath = parsed[0];
        String name = parsed[1];

        lock.writeLock().lock();
        try {
            DirectoryEntry parent = resolveDirectory(parentPath);
            FileSystemEntry child = parent.getChild(name);
            if (child == null) return false;

            if (child.isDirectory() && !((DirectoryEntry) child).isEmpty()) {
                throw new DirectoryNotEmptyException("Directory is not empty: " + path);
            }
            parent.removeChild(name);
            return true;
        } finally {
            lock.writeLock().unlock();
        }
    }

    // ======================== List ========================

    @Override
    public List<String> listDirectory(String path) {
        lock.readLock().lock();
        try {
            FileSystemEntry entry = resolve(normalizePath(path));
            if (entry == null || !entry.isDirectory()) return Collections.emptyList();
            return ((DirectoryEntry) entry).listChildNames();
        } finally {
            lock.readLock().unlock();
        }
    }

    // ======================== Move / Copy ========================

    /**
     * Move a file or directory (including all descendants) to a new location.
     * Atomic under write lock: detach from source parent, attach to dest parent.
     */
    @Override
    public boolean move(String sourcePath, String destPath) {
        sourcePath = normalizePath(sourcePath);
        destPath = normalizePath(destPath);
        if ("/".equals(sourcePath)) return false;

        String[] srcParsed = parseParentAndName(sourcePath);
        String[] dstParsed = parseParentAndName(destPath);

        lock.writeLock().lock();
        try {
            DirectoryEntry srcParent = resolveDirectory(srcParsed[0]);
            FileSystemEntry srcEntry = srcParent.getChild(srcParsed[1]);
            if (srcEntry == null) throw new FileNotFoundException("Source not found: " + sourcePath);

            if (srcEntry.isDirectory() && destPath.startsWith(sourcePath + "/")) {
                throw new IllegalArgumentException("Cannot move directory into itself");
            }

            DirectoryEntry dstParent = resolveDirectory(dstParsed[0]);
            if (dstParent.hasChild(dstParsed[1])) {
                throw new FileAlreadyExistsException("Destination already exists: " + destPath);
            }

            srcParent.removeChild(srcParsed[1]);

            FileSystemEntry moved = rebuildWithName(srcEntry, dstParsed[1]);
            dstParent.addChild(moved);
            return true;
        } finally {
            lock.writeLock().unlock();
        }
    }

    /**
     * Deep copy a file or directory (including all descendants) to a new location.
     */
    @Override
    public boolean copy(String sourcePath, String destPath) {
        sourcePath = normalizePath(sourcePath);
        destPath = normalizePath(destPath);

        String[] dstParsed = parseParentAndName(destPath);

        lock.writeLock().lock();
        try {
            FileSystemEntry srcEntry = resolve(sourcePath);
            if (srcEntry == null) throw new FileNotFoundException("Source not found: " + sourcePath);

            DirectoryEntry dstParent = resolveDirectory(dstParsed[0]);
            if (dstParent.hasChild(dstParsed[1])) {
                throw new FileAlreadyExistsException("Destination already exists: " + destPath);
            }

            FileSystemEntry copied;
            if (srcEntry instanceof FileEntry) {
                copied = ((FileEntry) srcEntry).deepCopy(dstParsed[1]);
            } else {
                copied = ((DirectoryEntry) srcEntry).deepCopy(dstParsed[1]);
            }
            dstParent.addChild(copied);
            return true;
        } finally {
            lock.writeLock().unlock();
        }
    }

    // ======================== Queries ========================

    @Override
    public boolean exists(String path) {
        lock.readLock().lock();
        try {
            return resolve(normalizePath(path)) != null;
        } finally {
            lock.readLock().unlock();
        }
    }

    @Override
    public boolean isDirectory(String path) {
        lock.readLock().lock();
        try {
            FileSystemEntry entry = resolve(normalizePath(path));
            return entry != null && entry.isDirectory();
        } finally {
            lock.readLock().unlock();
        }
    }

    @Override
    public long getFileSize(String path) {
        lock.readLock().lock();
        try {
            FileSystemEntry entry = resolve(normalizePath(path));
            if (entry == null) return -1;
            return entry.size();
        } finally {
            lock.readLock().unlock();
        }
    }

    // ======================== Internals ========================

    /**
     * Walk the Composite tree from root to resolve a normalized absolute path.
     * Returns null if any segment is missing.
     */
    private FileSystemEntry resolve(String normalizedPath) {
        if ("/".equals(normalizedPath)) return root;

        String[] segments = normalizedPath.substring(1).split("/");
        FileSystemEntry current = root;

        for (String seg : segments) {
            if (!(current instanceof DirectoryEntry)) return null;
            current = ((DirectoryEntry) current).getChild(seg);
            if (current == null) return null;
        }
        return current;
    }

    /**
     * Resolve a path that must be an existing directory; throws FileNotFoundException otherwise.
     */
    private DirectoryEntry resolveDirectory(String normalizedPath) {
        FileSystemEntry entry = resolve(normalizedPath);
        if (entry == null) {
            throw new FileNotFoundException("Directory not found: " + normalizedPath);
        }
        if (!entry.isDirectory()) {
            throw new FileNotFoundException("Not a directory: " + normalizedPath);
        }
        return (DirectoryEntry) entry;
    }

    /**
     * Rebuild entry with a new name (for move where the leaf name changes).
     * Files are shallow-copied (content shared); directories keep their children.
     */
    private FileSystemEntry rebuildWithName(FileSystemEntry entry, String newName) {
        if (entry instanceof FileEntry) {
            return new FileEntry(newName, ((FileEntry) entry).getContent());
        }
        DirectoryEntry oldDir = (DirectoryEntry) entry;
        DirectoryEntry newDir = new DirectoryEntry(newName);
        for (FileSystemEntry child : oldDir.getChildren().values()) {
            newDir.addChild(child);
        }
        return newDir;
    }

    // ======================== Path utilities ========================

    String normalizePath(String path) {
        if (path == null || path.isEmpty()) return "/";
        path = path.replaceAll("/+", "/");
        if (path.length() > 1 && path.endsWith("/")) {
            path = path.substring(0, path.length() - 1);
        }

        String[] parts = path.split("/");
        List<String> segments = new ArrayList<>();
        for (String part : parts) {
            if (part.isEmpty() || ".".equals(part)) continue;
            if ("..".equals(part)) {
                if (!segments.isEmpty()) segments.remove(segments.size() - 1);
            } else {
                segments.add(part);
            }
        }
        if (segments.isEmpty()) return "/";
        return "/" + String.join("/", segments);
    }

    /**
     * Split a path into [parentNormalized, childName].
     */
    private String[] parseParentAndName(String path) {
        String normalized = normalizePath(path);
        if ("/".equals(normalized)) {
            throw new IllegalArgumentException("Cannot parse parent of root");
        }
        int lastSlash = normalized.lastIndexOf('/');
        String parentPath = lastSlash == 0 ? "/" : normalized.substring(0, lastSlash);
        String name = normalized.substring(lastSlash + 1);
        return new String[]{parentPath, name};
    }
}
