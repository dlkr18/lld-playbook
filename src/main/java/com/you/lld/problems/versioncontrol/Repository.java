package com.you.lld.problems.versioncontrol;

import com.you.lld.problems.versioncontrol.model.Branch;
import com.you.lld.problems.versioncontrol.model.Commit;
import com.you.lld.problems.versioncontrol.model.Diff;
import com.you.lld.problems.versioncontrol.service.BranchManager;
import com.you.lld.problems.versioncontrol.service.CommitStore;
import com.you.lld.problems.versioncontrol.service.MergeStrategy;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * In-memory version control repository (simplified Git).
 *
 * Orchestrator only — delegates to:
 *   - CommitStore   : storing/retrieving commits
 *   - BranchManager : branch CRUD
 *   - MergeStrategy : merge algorithm (pluggable)
 *
 * Owns the working directory (current editing session) and the
 * "current branch" pointer (which branch is checked out).
 */
public final class Repository {

    private final String name;
    private final CommitStore commitStore;
    private final BranchManager branchManager;
    private final MergeStrategy mergeStrategy;

    private String currentBranch;
    private final Map<String, String> workingDirectory = new HashMap<>();
    private int commitCounter;

    public Repository(String name, CommitStore commitStore,
                      BranchManager branchManager, MergeStrategy mergeStrategy) {
        this.name = name;
        this.commitStore = commitStore;
        this.branchManager = branchManager;
        this.mergeStrategy = mergeStrategy;

        Commit initial = new Commit(
            nextId(), "initial commit", "system",
            Collections.<String>emptyList(),
            Collections.<String, String>emptyMap()
        );
        commitStore.save(initial);
        branchManager.create("main", initial.getId());
        currentBranch = "main";
    }

    // ── working directory ──

    public void addFile(String path, String content) {
        if (path == null || content == null) throw new IllegalArgumentException("path and content required");
        workingDirectory.put(path, content);
    }

    public void deleteFile(String path) {
        if (!workingDirectory.containsKey(path)) throw new IllegalArgumentException("file not found: " + path);
        workingDirectory.remove(path);
    }

    public Map<String, String> getWorkingDirectory() { return new HashMap<>(workingDirectory); }

    // ── commit ──

    public Commit commit(String message, String author) {
        if (message == null || author == null) throw new IllegalArgumentException("message and author required");

        Diff diff = Diff.between(head().getFiles(), workingDirectory);
        if (diff.isEmpty()) throw new IllegalStateException("nothing to commit");

        Commit c = new Commit(
            nextId(), message, author,
            Collections.singletonList(head().getId()),
            new HashMap<>(workingDirectory)
        );
        commitStore.save(c);
        branchManager.advance(currentBranch, c.getId());
        return c;
    }

    // ── log ──

    public List<Commit> log() {
        return commitStore.log(head().getId());
    }

    // ── branching ──

    public Branch createBranch(String branchName) {
        return branchManager.create(branchName, head().getId());
    }

    public void checkout(String branchName) {
        Branch b = branchManager.get(branchName);
        currentBranch = branchName;
        workingDirectory.clear();
        workingDirectory.putAll(commitStore.get(b.getCommitId()).getFiles());
    }

    public String getCurrentBranch() { return currentBranch; }

    public Map<String, Branch> getBranches() { return branchManager.getAll(); }

    // ── diff ──

    public Diff diff(String fromId, String toId) {
        return Diff.between(commitStore.get(fromId).getFiles(), commitStore.get(toId).getFiles());
    }

    public Diff status() {
        return Diff.between(head().getFiles(), workingDirectory);
    }

    // ── merge ──

    public Commit merge(String branchName) {
        if (branchName.equals(currentBranch)) throw new IllegalArgumentException("cannot merge branch into itself");

        Branch source = branchManager.get(branchName);
        Commit ourHead = head();
        Commit theirHead = commitStore.get(source.getCommitId());

        Commit result = mergeStrategy.merge(ourHead, theirHead, commitStore);

        // If merge created a new commit, save it
        if (!commitStore.contains(result.getId())) {
            commitStore.save(result);
        }

        branchManager.advance(currentBranch, result.getId());
        workingDirectory.clear();
        workingDirectory.putAll(result.getFiles());
        return result;
    }

    // ── helpers ──

    public Commit head() {
        return commitStore.get(branchManager.get(currentBranch).getCommitId());
    }

    private String nextId() { return String.format("c%03d", ++commitCounter); }

    @Override
    public String toString() { return "Repository{" + name + ", branch=" + currentBranch + ", HEAD=" + head().getId() + "}"; }
}
