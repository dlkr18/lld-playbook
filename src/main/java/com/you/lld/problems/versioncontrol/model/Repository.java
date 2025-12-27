package com.you.lld.problems.versioncontrol.model;

import java.util.*;

public class Repository {
    private final String name;
    private final Map<String, Branch> branches;
    private String currentBranch;
    
    public Repository(String name) {
        this.name = name;
        this.branches = new HashMap<>();
        this.currentBranch = "main";
        branches.put("main", new Branch("main", null));
    }
    
    public void createBranch(String name, String fromCommitId) {
        branches.put(name, new Branch(name, fromCommitId));
    }
    
    public void switchBranch(String name) {
        if (branches.containsKey(name)) {
            this.currentBranch = name;
        }
    }
    
    public Branch getCurrentBranch() {
        return branches.get(currentBranch);
    }
    
    public String getName() { return name; }
    public Map<String, Branch> getBranches() { return new HashMap<>(branches); }
}
