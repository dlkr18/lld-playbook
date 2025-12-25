package com.you.lld.problems.versioncontrol;
public class Branch {
    private final String name;
    private String currentCommitId;
    
    public Branch(String name, String commitId) {
        this.name = name;
        this.currentCommitId = commitId;
    }
    
    public String getName() { return name; }
    public String getCurrentCommitId() { return currentCommitId; }
    public void setCurrentCommitId(String commitId) { this.currentCommitId = commitId; }
}
