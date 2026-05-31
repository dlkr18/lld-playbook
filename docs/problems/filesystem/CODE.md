# filesystem - Complete Implementation

> Generated from `src/main/java/com/you/lld/problems/filesystem/` on 2026-05-31. Re-run `python3 scripts/generate-code-md.py filesystem`.

## Project Structure (9 files)

```
filesystem/
├── FileSystemDemo.java
├── api/FileSystemService.java
├── model/DirectoryEntry.java
├── model/FileEntry.java
├── model/FileSystemEntry.java
├── impl/InMemoryFileSystem.java
├── exceptions/DirectoryNotEmptyException.java
├── exceptions/FileAlreadyExistsException.java
├── exceptions/FileNotFoundException.java
```

## Source Code

### `FileSystemDemo.java`

<details>
<summary>Click to view FileSystemDemo.java</summary>

```java
package com.you.lld.problems.filesystem;

import com.you.lld.problems.filesystem.exceptions.DirectoryNotEmptyException;
import com.you.lld.problems.filesystem.exceptions.FileAlreadyExistsException;
import com.you.lld.problems.filesystem.exceptions.FileNotFoundException;
import com.you.lld.problems.filesystem.impl.InMemoryFileSystem;

import java.util.List;
import java.util.Optional;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

/**
 * End-to-end demo of In-Memory File System exercising:
 *
 *   1. Composite -- DirectoryEntry holds FileEntry/DirectoryEntry children
 *   2. ReadWriteLock -- concurrent reads, exclusive writes
 *   3. Path normalization -- ".", "..", double slashes
 *   4. Recursive operations -- deep copy, recursive size
 *   5. Error handling -- FileNotFoundException, DirectoryNotEmptyException, FileAlreadyExistsException
 */
public class FileSystemDemo {

    public static void main(String[] args) throws InterruptedException {
        System.out.println("========================================");
        System.out.println("  In-Memory File System -- Full LLD Demo");
        System.out.println("========================================\n");

        InMemoryFileSystem fs = new InMemoryFileSystem();

        demoCreateAndList(fs);
        demoReadAndWrite(fs);
        demoCopyAndMove(fs);
        demoRecursiveSize(fs);
        demoPathNormalization(fs);
        demoErrorHandling(fs);
        demoConcurrentAccess(fs);

        System.out.println("========================================");
        System.out.println("  All demos completed.");
        System.out.println("========================================");
    }

    // ──────────── Demo 1: Create directories and files ────────────

    private static void demoCreateAndList(InMemoryFileSystem fs) {
        System.out.println("--- Demo 1: Create & List (Composite tree) ---\n");

        fs.createDirectory("/home");
        fs.createDirectory("/home/alice");
        fs.createDirectory("/home/bob");
        fs.createDirectory("/tmp");

        fs.createFile("/home/alice/readme.txt", "Hello from Alice!");
        fs.createFile("/home/alice/notes.txt", "Some notes here.");
        fs.createFile("/home/bob/data.csv", "name,age\nBob,30");
        fs.createFile("/tmp/temp.log", "Log entry 1\nLog entry 2");

        System.out.println("ls /          : " + fs.listDirectory("/"));
        System.out.println("ls /home      : " + fs.listDirectory("/home"));
        System.out.println("ls /home/alice: " + fs.listDirectory("/home/alice"));
        System.out.println("ls /home/bob  : " + fs.listDirectory("/home/bob"));
        System.out.println();
    }

    // ──────────── Demo 2: Read and Write ────────────

    private static void demoReadAndWrite(InMemoryFileSystem fs) {
        System.out.println("--- Demo 2: Read & Write ---\n");

        Optional<String> content = fs.readFile("/home/alice/readme.txt");
        System.out.println("cat /home/alice/readme.txt: " + content.orElse("NOT FOUND"));

        fs.writeFile("/home/alice/readme.txt", "Updated content!");
        System.out.println("After write: " + fs.readFile("/home/alice/readme.txt").orElse(""));
        System.out.println();
    }

    // ──────────── Demo 3: Copy (deep) and Move ────────────

    private static void demoCopyAndMove(InMemoryFileSystem fs) {
        System.out.println("--- Demo 3: Copy (deep) & Move ---\n");

        // Copy a file
        fs.copy("/home/alice/readme.txt", "/tmp/readme_backup.txt");
        System.out.println("cp file -> /tmp/readme_backup.txt: "
            + fs.readFile("/tmp/readme_backup.txt").orElse("FAIL"));

        // Deep copy a directory (recursive)
        fs.copy("/home/alice", "/tmp/alice_copy");
        System.out.println("cp -r /home/alice -> /tmp/alice_copy");
        System.out.println("ls /tmp/alice_copy: " + fs.listDirectory("/tmp/alice_copy"));
        System.out.println("cat /tmp/alice_copy/notes.txt: "
            + fs.readFile("/tmp/alice_copy/notes.txt").orElse("FAIL"));

        // Move a file
        fs.move("/home/alice/notes.txt", "/home/bob/notes.txt");
        System.out.println("mv notes.txt alice -> bob");
        System.out.println("exists /home/alice/notes.txt: " + fs.exists("/home/alice/notes.txt"));
        System.out.println("exists /home/bob/notes.txt:   " + fs.exists("/home/bob/notes.txt"));
        System.out.println();
    }

    // ──────────── Demo 4: Recursive size ────────────

    private static void demoRecursiveSize(InMemoryFileSystem fs) {
        System.out.println("--- Demo 4: Recursive Size (Composite) ---\n");

        System.out.println("size /tmp/temp.log    : " + fs.getFileSize("/tmp/temp.log") + " bytes");
        System.out.println("size /home (recursive): " + fs.getFileSize("/home") + " bytes");
        System.out.println("size /tmp  (recursive): " + fs.getFileSize("/tmp") + " bytes");
        System.out.println();
    }

    // ──────────── Demo 5: Path normalization ────────────

    private static void demoPathNormalization(InMemoryFileSystem fs) {
        System.out.println("--- Demo 5: Path Normalization ---\n");

        System.out.println("/home/alice/./readme.txt exists: "
            + fs.exists("/home/alice/./readme.txt"));
        System.out.println("/home/bob/../alice/readme.txt exists: "
            + fs.exists("/home/bob/../alice/readme.txt"));
        System.out.println("//home///alice//readme.txt exists: "
            + fs.exists("//home///alice//readme.txt"));
        System.out.println();
    }

    // ──────────── Demo 6: Error handling ────────────

    private static void demoErrorHandling(InMemoryFileSystem fs) {
        System.out.println("--- Demo 6: Error Handling ---\n");

        try {
            fs.createFile("/nonexistent/foo.txt", "data");
        } catch (FileNotFoundException e) {
            System.out.println("FileNotFoundException: " + e.getMessage());
        }

        try {
            fs.createFile("/home/alice/readme.txt", "duplicate");
        } catch (FileAlreadyExistsException e) {
            System.out.println("FileAlreadyExistsException: " + e.getMessage());
        }

        try {
            fs.delete("/home/bob");
        } catch (DirectoryNotEmptyException e) {
            System.out.println("DirectoryNotEmptyException: " + e.getMessage());
        }

        boolean rootDeleted = fs.delete("/");
        System.out.println("Cannot delete root: " + !rootDeleted);
        System.out.println();
    }

    // ──────────── Demo 7: Concurrent access ────────────

    private static void demoConcurrentAccess(InMemoryFileSystem fs) throws InterruptedException {
        System.out.println("--- Demo 7: Concurrent Access (ReadWriteLock) ---\n");

        fs.createDirectory("/concurrent");
        ExecutorService exec = Executors.newFixedThreadPool(4);

        for (int i = 0; i < 10; i++) {
            final int idx = i;
            exec.submit(() -> {
                fs.createFile("/concurrent/file_" + idx + ".txt", "content " + idx);
            });
        }

        exec.shutdown();
        exec.awaitTermination(5, TimeUnit.SECONDS);

        List<String> files = fs.listDirectory("/concurrent");
        System.out.println("Created " + files.size() + " files concurrently: " + files);
        System.out.println();
    }
}
```

</details>

### `api/FileSystemService.java`

<details>
<summary>Click to view api/FileSystemService.java</summary>

```java
package com.you.lld.problems.filesystem.api;

import java.util.List;
import java.util.Optional;

/**
 * Service interface for in-memory file system operations.
 * Supports directories, files, and Unix-style path navigation.
 */
public interface FileSystemService {

    boolean createFile(String path, String content);
    boolean createDirectory(String path);

    Optional<String> readFile(String path);
    boolean writeFile(String path, String content);

    boolean delete(String path);

    List<String> listDirectory(String path);

    boolean move(String sourcePath, String destPath);
    boolean copy(String sourcePath, String destPath);

    boolean exists(String path);
    boolean isDirectory(String path);
    long getFileSize(String path);
}
```

</details>

### `model/DirectoryEntry.java`

<details>
<summary>Click to view model/DirectoryEntry.java</summary>

```java
package com.you.lld.problems.filesystem.model;

import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Composite pattern -- composite node.
 * Holds an ordered map of child name → FileSystemEntry (files or sub-directories).
 *
 * Children are stored in insertion order (LinkedHashMap) for predictable listing.
 * All mutation goes through add/remove so modifiedAt is updated.
 */
public class DirectoryEntry extends FileSystemEntry {

    private final Map<String, FileSystemEntry> children = new LinkedHashMap<>();

    public DirectoryEntry(String name) {
        super(name);
    }

    public void addChild(FileSystemEntry child) {
        children.put(child.getName(), child);
        touch();
    }

    public void removeChild(String name) {
        children.remove(name);
        touch();
    }

    public FileSystemEntry getChild(String name) {
        return children.get(name);
    }

    public boolean hasChild(String name) {
        return children.containsKey(name);
    }

    public boolean isEmpty() {
        return children.isEmpty();
    }

    public List<String> listChildNames() {
        return children.keySet().stream().collect(Collectors.toList());
    }

    public Map<String, FileSystemEntry> getChildren() {
        return Collections.unmodifiableMap(children);
    }

    @Override
    public boolean isDirectory() { return true; }

    @Override
    public long size() {
        return children.values().stream().mapToLong(FileSystemEntry::size).sum();
    }

    /**
     * Deep copy for recursive copy operations.
     */
    public DirectoryEntry deepCopy(String newName) {
        DirectoryEntry copy = new DirectoryEntry(newName);
        for (Map.Entry<String, FileSystemEntry> e : children.entrySet()) {
            if (e.getValue() instanceof FileEntry) {
                copy.addChild(((FileEntry) e.getValue()).deepCopy(e.getKey()));
            } else if (e.getValue() instanceof DirectoryEntry) {
                copy.addChild(((DirectoryEntry) e.getValue()).deepCopy(e.getKey()));
            }
        }
        return copy;
    }
}
```

</details>

### `model/FileEntry.java`

<details>
<summary>Click to view model/FileEntry.java</summary>

```java
package com.you.lld.problems.filesystem.model;

/**
 * Composite pattern -- leaf.
 * Represents a file with string content.
 */
public class FileEntry extends FileSystemEntry {

    private String content;

    public FileEntry(String name, String content) {
        super(name);
        this.content = content != null ? content : "";
    }

    public String getContent() { return content; }

    public void setContent(String content) {
        this.content = content != null ? content : "";
        touch();
    }

    @Override
    public boolean isDirectory() { return false; }

    @Override
    public long size() { return content.length(); }

    /**
     * Deep copy for copy operations.
     */
    public FileEntry deepCopy(String newName) {
        return new FileEntry(newName, this.content);
    }
}
```

</details>

### `model/FileSystemEntry.java`

<details>
<summary>Click to view model/FileSystemEntry.java</summary>

```java
package com.you.lld.problems.filesystem.model;

import java.time.LocalDateTime;

/**
 * Composite pattern -- abstract component.
 *
 * Both FileEntry (leaf) and DirectoryEntry (composite) extend this.
 * Holds shared metadata: name, timestamps.
 * The parent reference is NOT stored here to avoid circular navigation;
 * the tree is navigated downward from root, and the InMemoryFileSystem
 * resolves paths by walking the tree.
 */
public abstract class FileSystemEntry {

    private final String name;
    private final LocalDateTime createdAt;
    private LocalDateTime modifiedAt;

    protected FileSystemEntry(String name) {
        this.name = name;
        this.createdAt = LocalDateTime.now();
        this.modifiedAt = this.createdAt;
    }

    public String getName()              { return name; }
    public LocalDateTime getCreatedAt()  { return createdAt; }
    public LocalDateTime getModifiedAt() { return modifiedAt; }

    protected void touch() { this.modifiedAt = LocalDateTime.now(); }

    public abstract boolean isDirectory();

    /**
     * Size in bytes.
     * FileEntry: content length. DirectoryEntry: sum of children (recursive).
     */
    public abstract long size();

    @Override
    public String toString() {
        return (isDirectory() ? "DIR " : "FILE ") + name;
    }
}
```

</details>

### `impl/InMemoryFileSystem.java`

<details>
<summary>Click to view impl/InMemoryFileSystem.java</summary>

```java
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
```

</details>

### `exceptions/DirectoryNotEmptyException.java`

<details>
<summary>Click to view exceptions/DirectoryNotEmptyException.java</summary>

```java
package com.you.lld.problems.filesystem.exceptions;

/**
 * Exception thrown when attempting to delete a non-empty directory.
 */
public class DirectoryNotEmptyException extends RuntimeException {
    public DirectoryNotEmptyException(String message) {
        super(message);
    }
}
```

</details>

### `exceptions/FileAlreadyExistsException.java`

<details>
<summary>Click to view exceptions/FileAlreadyExistsException.java</summary>

```java
package com.you.lld.problems.filesystem.exceptions;

public class FileAlreadyExistsException extends RuntimeException {
    public FileAlreadyExistsException(String message) {
        super(message);
    }
}
```

</details>

### `exceptions/FileNotFoundException.java`

<details>
<summary>Click to view exceptions/FileNotFoundException.java</summary>

```java
package com.you.lld.problems.filesystem.exceptions;
public class FileNotFoundException extends RuntimeException { public FileNotFoundException(String m) { super(m); } }
```

</details>

## Run Demo

```bash
mvn -q compile exec:java -Dexec.mainClass="com.you.lld.problems.filesystem.FileSystemDemo"
```
