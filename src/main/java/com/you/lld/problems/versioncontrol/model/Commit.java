package com.you.lld.problems.versioncontrol.model;

import java.time.LocalDateTime;
import java.util.*;

public class Commit {
    private final String id;
    private final String message;
    private final String author;
    private final LocalDateTime timestamp;
    private final String parentId;
    private final Map<String, String> files;
    
    public Commit(String id, String message, String author, String parentId, 
                  Map<String, String> files) {
        this.id = id;
        this.message = message;
        this.author = author;
        this.timestamp = LocalDateTime.now();
        this.parentId = parentId;
        this.files = new HashMap<>(files);
    }
    
    public String getId() { return id; }
    public String getMessage() { return message; }
    public String getParentId() { return parentId; }
    public Map<String, String> getFiles() { return new HashMap<>(files); }
    
    @Override
    public String toString() {
        return "Commit{id='" + id + "', message='" + message + "', author='" + 
               author + "', time=" + timestamp + "}";
    }
}
