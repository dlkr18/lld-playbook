package com.you.lld.problems.versioncontrol.service.impl;

import com.you.lld.problems.versioncontrol.model.Branch;
import com.you.lld.problems.versioncontrol.service.BranchManager;

import java.util.HashMap;
import java.util.Map;

/** HashMap-backed branch manager. */
public final class InMemoryBranchManager implements BranchManager {

    private final Map<String, Branch> branches = new HashMap<>();

    @Override
    public Branch create(String name, String commitId) {
        if (branches.containsKey(name)) throw new IllegalArgumentException("branch exists: " + name);
        Branch b = new Branch(name, commitId);
        branches.put(name, b);
        return b;
    }

    @Override
    public Branch get(String name) {
        Branch b = branches.get(name);
        if (b == null) throw new IllegalArgumentException("unknown branch: " + name);
        return b;
    }

    @Override
    public boolean exists(String name) {
        return branches.containsKey(name);
    }

    @Override
    public void advance(String branchName, String commitId) {
        get(branchName).advanceTo(commitId);
    }

    @Override
    public Map<String, Branch> getAll() {
        return new HashMap<>(branches);
    }
}
