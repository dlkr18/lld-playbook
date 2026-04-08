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
