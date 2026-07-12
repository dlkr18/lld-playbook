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
