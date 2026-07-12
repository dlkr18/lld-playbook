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
