package com.you.lld.problems.filesystem;
import java.time.LocalDateTime;

public class FileNode {
    private final String name;
    private boolean isDirectory;
    private String content;
    private LocalDateTime created;
    
    public FileNode(String name, boolean isDirectory) {
        this.name = name;
        this.isDirectory = isDirectory;
        this.content = "";
        this.created = LocalDateTime.now();
    }
    
    public String getName() { return name; }
    public boolean isDirectory() { return isDirectory; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
}
