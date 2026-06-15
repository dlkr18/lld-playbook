package com.you.lld.problems.versioncontrol;

import com.you.lld.problems.versioncontrol.model.Branch;
import com.you.lld.problems.versioncontrol.model.Commit;
import com.you.lld.problems.versioncontrol.model.Diff;
import com.you.lld.problems.versioncontrol.service.BranchManager;
import com.you.lld.problems.versioncontrol.service.CommitStore;
import com.you.lld.problems.versioncontrol.service.MergeStrategy;
import com.you.lld.problems.versioncontrol.service.ObjectStore;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * In-memory version control repository with blob/tree/commit object model.
 */
public final class Repository {

    private final String name;
    private final ObjectStore objectStore;
    private final CommitStore commitStore;
    private final BranchManager branchManager;
    private final MergeStrategy mergeStrategy;

    private String currentBranch;
    private final Map<String, String> workingDirectory = new HashMap<String, String>();
    private int commitCounter;

    public Repository(String name, ObjectStore objectStore, CommitStore commitStore,
                      BranchManager branchManager, MergeStrategy mergeStrategy) {
        this.name = name;
        this.objectStore = objectStore;
        this.commitStore = commitStore;
        this.branchManager = branchManager;
        this.mergeStrategy = mergeStrategy;

        String treeHash = objectStore.storeTree(Collections.<String, String>emptyMap());
        Commit initial = new Commit(
                nextId(), "initial commit", "system",
                Collections.<String>emptyList(), treeHash);
        commitStore.save(initial);
        branchManager.create("main", initial.getId());
        currentBranch = "main";
    }

    public void addFile(String path, String content) {
        if (path == null || content == null) {
            throw new IllegalArgumentException("path and content required");
        }
        workingDirectory.put(path, content);
    }

    public void deleteFile(String path) {
        if (!workingDirectory.containsKey(path)) {
            throw new IllegalArgumentException("file not found: " + path);
        }
        workingDirectory.remove(path);
    }

    public Map<String, String> getWorkingDirectory() {
        return new HashMap<String, String>(workingDirectory);
    }

    public Commit commit(String message, String author) {
        if (message == null || author == null) {
            throw new IllegalArgumentException("message and author required");
        }

        Diff diff = Diff.between(headFiles(), workingDirectory);
        if (diff.isEmpty()) {
            throw new IllegalStateException("nothing to commit");
        }

        String treeHash = objectStore.storeTree(workingDirectory);
        Commit c = new Commit(
                nextId(), message, author,
                Collections.singletonList(head().getId()), treeHash);
        commitStore.save(c);
        branchManager.advance(currentBranch, c.getId());
        return c;
    }

    public List<Commit> log() {
        return commitStore.log(head().getId());
    }

    public Branch createBranch(String branchName) {
        return branchManager.create(branchName, head().getId());
    }

    public void checkout(String branchName) {
        Branch b = branchManager.get(branchName);
        currentBranch = branchName;
        workingDirectory.clear();
        workingDirectory.putAll(commitStore.get(b.getCommitId()).getFiles(objectStore));
    }

    public String getCurrentBranch() {
        return currentBranch;
    }

    public Map<String, Branch> getBranches() {
        return branchManager.getAll();
    }

    public Diff diff(String fromId, String toId) {
        return Diff.between(
                commitStore.get(fromId).getFiles(objectStore),
                commitStore.get(toId).getFiles(objectStore));
    }

    public Diff status() {
        return Diff.between(headFiles(), workingDirectory);
    }

    public Commit merge(String branchName) {
        if (branchName.equals(currentBranch)) {
            throw new IllegalArgumentException("cannot merge branch into itself");
        }

        Branch source = branchManager.get(branchName);
        Commit ourHead = head();
        Commit theirHead = commitStore.get(source.getCommitId());

        Commit result = mergeStrategy.merge(ourHead, theirHead, commitStore, objectStore);

        if (!commitStore.contains(result.getId())) {
            commitStore.save(result);
        }

        branchManager.advance(currentBranch, result.getId());
        workingDirectory.clear();
        workingDirectory.putAll(result.getFiles(objectStore));
        return result;
    }

    public Commit head() {
        return commitStore.get(branchManager.get(currentBranch).getCommitId());
    }

    public ObjectStore getObjectStore() {
        return objectStore;
    }

    private Map<String, String> headFiles() {
        return head().getFiles(objectStore);
    }

    private String nextId() {
        return String.format("c%03d", ++commitCounter);
    }

    @Override
    public String toString() {
        return "Repository{" + name + ", branch=" + currentBranch + ", HEAD=" + head().getId() + "}";
    }
}
