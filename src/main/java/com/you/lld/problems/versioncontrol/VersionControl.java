package com.you.lld.problems.versioncontrol;
import java.util.*;

public class VersionControl {
    private final Map<String, Commit> commits;
    private final Map<String, Branch> branches;
    private Branch currentBranch;
    
    public VersionControl() {
        this.commits = new HashMap<>();
        this.branches = new HashMap<>();
        
        // Create initial commit and master branch
        Commit initialCommit = new Commit("init", "Initial commit", "system", new HashMap<>());
        commits.put(initialCommit.getCommitId(), initialCommit);
        
        Branch master = new Branch("master", initialCommit.getCommitId());
        branches.put("master", master);
        currentBranch = master;
    }
    
    public String commit(String message, String author, Map<String, String> files) {
        String commitId = UUID.randomUUID().toString();
        Commit commit = new Commit(commitId, message, author, files);
        commit.setParentCommitId(currentBranch.getCurrentCommitId());
        commits.put(commitId, commit);
        currentBranch.setCurrentCommitId(commitId);
        return commitId;
    }
    
    public void createBranch(String branchName) {
        String currentCommitId = currentBranch.getCurrentCommitId();
        branches.put(branchName, new Branch(branchName, currentCommitId));
    }
    
    public void checkout(String branchName) {
        Branch branch = branches.get(branchName);
        if (branch != null) {
            currentBranch = branch;
        }
    }
}
