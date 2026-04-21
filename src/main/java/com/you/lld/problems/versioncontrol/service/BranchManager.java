package com.you.lld.problems.versioncontrol.service;

import com.you.lld.problems.versioncontrol.model.Branch;

import java.util.Map;

/**
 * Manages branch CRUD operations.
 *
 * SRP: only responsible for creating, switching, and advancing branches.
 */
public interface BranchManager {

    Branch create(String name, String commitId);

    Branch get(String name);

    boolean exists(String name);

    void advance(String branchName, String commitId);

    Map<String, Branch> getAll();
}
