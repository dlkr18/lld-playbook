package com.you.lld.problems.versioncontrol.impl;

import com.you.lld.problems.versioncontrol.api.VersionControl;
import com.you.lld.problems.versioncontrol.model.*;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

public class VersionControlImpl implements VersionControl {
    private final Map<String, Repository> repositories = new ConcurrentHashMap<>();
    private final Map<String, Map<String, Commit>> commits = new ConcurrentHashMap<>();
    
    @Override
    public void createRepository(String name) {
        repositories.put(name, new Repository(name));
        commits.put(name, new ConcurrentHashMap<>());
        System.out.println("Repository created: " + name);
    }
    
    @Override
    public String commit(String repoName, String message, String author) {
        Repository repo = repositories.get(repoName);
        if (repo == null) return null;
        
        Branch currentBranch = repo.getCurrentBranch();
        String commitId = UUID.randomUUID().toString().substring(0, 8);
        
        Commit commit = new Commit(
            commitId, message, author, 
            currentBranch.getHeadCommitId(), 
            new HashMap<>()
        );
        
        commits.get(repoName).put(commitId, commit);
        currentBranch.updateHead(commitId);
        
        System.out.println("Commit created: " + commitId + " - " + message);
        return commitId;
    }
    
    @Override
    public void createBranch(String repoName, String branchName) {
        Repository repo = repositories.get(repoName);
        if (repo != null) {
            String headCommit = repo.getCurrentBranch().getHeadCommitId();
            repo.createBranch(branchName, headCommit);
            System.out.println("Branch created: " + branchName);
        }
    }
    
    @Override
    public void switchBranch(String repoName, String branchName) {
        Repository repo = repositories.get(repoName);
        if (repo != null) {
            repo.switchBranch(branchName);
            System.out.println("Switched to branch: " + branchName);
        }
    }
    
    @Override
    public List<Commit> getHistory(String repoName) {
        Map<String, Commit> repoCommits = commits.get(repoName);
        return repoCommits != null ? new ArrayList<>(repoCommits.values()) : 
                                     Collections.emptyList();
    }
    
    @Override
    public Commit getCommit(String repoName, String commitId) {
        Map<String, Commit> repoCommits = commits.get(repoName);
        return repoCommits != null ? repoCommits.get(commitId) : null;
    }
}
