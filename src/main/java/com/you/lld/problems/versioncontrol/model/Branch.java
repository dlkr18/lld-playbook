package com.you.lld.problems.versioncontrol.model;

public class Branch {
    private final String name;
    private String headCommitId;
    
    public Branch(String name, String headCommitId) {
        this.name = name;
        this.headCommitId = headCommitId;
    }
    
    public void updateHead(String commitId) {
        this.headCommitId = commitId;
    }
    
    public String getName() { return name; }
    public String getHeadCommitId() { return headCommitId; }
    
    @Override
    public String toString() {
        return "Branch{name='" + name + "', head='" + headCommitId + "'}";
    }
}
