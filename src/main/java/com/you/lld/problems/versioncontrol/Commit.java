package com.you.lld.problems.versioncontrol;
import java.time.LocalDateTime;
import java.util.*;

public class Commit {
    private final String commitId;
    private final String message;
    private final String author;
    private final LocalDateTime timestamp;
    private final Map<String, String> files; // filename -> content
    private String parentCommitId;
    
    public Commit(String commitId, String message, String author, Map<String, String> files) {
        this.commitId = commitId;
        this.message = message;
        this.author = author;
        this.files = new HashMap<>(files);
        this.timestamp = LocalDateTime.now();
    }
    
    public String getCommitId() { return commitId; }
    public String getMessage() { return message; }
    public Map<String, String> getFiles() { return new HashMap<>(files); }
    public void setParentCommitId(String parentId) { this.parentCommitId = parentId; }
}
