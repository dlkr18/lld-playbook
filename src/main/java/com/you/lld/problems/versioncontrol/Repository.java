package com.you.lld.problems.versioncontrol;

import com.you.lld.problems.versioncontrol.model.Branch;
import com.you.lld.problems.versioncontrol.model.Commit;
import com.you.lld.problems.versioncontrol.model.Diff;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * In-memory version control repository (simplified Git).
 *
 * Data model:
 *   commits          : Map<id, Commit>        — the object store
 *   branches         : Map<name, Branch>      — named pointers to commits
 *   currentBranch    : which branch is checked out
 *   workingDirectory : Map<path, content>     — files being edited (not yet committed)
 *
 * Key operations: init, addFile, commit, log, branch, checkout, diff, merge.
 *
 * Merge supports:
 *   - Fast-forward: target is ancestor of source → just move pointer
 *   - Simple merge: create a merge commit combining both snapshots,
 *     detecting conflicts (same file changed differently in both branches)
 */
public final class Repository {

    private final String name;
    private final Map<String, Commit> commits = new HashMap<>();
    private final Map<String, Branch> branches = new HashMap<>();
    private String currentBranch;
    private final Map<String, String> workingDirectory = new HashMap<>();

    private int commitCounter = 0;

    public Repository(String name) {
        this.name = name;

        Commit initial = new Commit(
            nextId(), "initial commit", "system",
            Collections.<String>emptyList(),
            Collections.<String, String>emptyMap()
        );
        commits.put(initial.getId(), initial);

        Branch main = new Branch("main", initial.getId());
        branches.put("main", main);
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

    public Map<String, String> getWorkingDirectory() {
        return new HashMap<>(workingDirectory);
    }

    // ── commit ──

    public Commit commit(String message, String author) {
        if (message == null || author == null) throw new IllegalArgumentException("message and author required");
        String headId = head().getId();

        Diff diff = Diff.between(head().getFiles(), workingDirectory);
        if (diff.isEmpty()) throw new IllegalStateException("nothing to commit");

        Commit c = new Commit(
            nextId(), message, author,
            Collections.singletonList(headId),
            new HashMap<>(workingDirectory)
        );
        commits.put(c.getId(), c);
        branches.get(currentBranch).advanceTo(c.getId());
        return c;
    }

    // ── log (walk parent chain from HEAD) ──

    public List<Commit> log() {
        List<Commit> history = new ArrayList<>();
        Commit cur = head();
        while (cur != null) {
            history.add(cur);
            List<String> parents = cur.getParentIds();
            cur = parents.isEmpty() ? null : commits.get(parents.get(0));
        }
        return history;
    }

    // ── branching ──

    public Branch createBranch(String branchName) {
        if (branches.containsKey(branchName)) throw new IllegalArgumentException("branch exists: " + branchName);
        Branch b = new Branch(branchName, head().getId());
        branches.put(branchName, b);
        return b;
    }

    public void checkout(String branchName) {
        Branch b = branches.get(branchName);
        if (b == null) throw new IllegalArgumentException("unknown branch: " + branchName);
        currentBranch = branchName;
        workingDirectory.clear();
        workingDirectory.putAll(commits.get(b.getCommitId()).getFiles());
    }

    public String getCurrentBranch() { return currentBranch; }

    public Map<String, Branch> getBranches() { return new HashMap<>(branches); }

    // ── diff ──

    public Diff diff(String fromId, String toId) {
        Commit from = requireCommit(fromId);
        Commit to = requireCommit(toId);
        return Diff.between(from.getFiles(), to.getFiles());
    }

    /** Diff working directory against HEAD. */
    public Diff status() {
        return Diff.between(head().getFiles(), workingDirectory);
    }

    // ── merge ──

    /**
     * Merge the given branch into the current branch.
     *
     * Fast-forward: if current HEAD is an ancestor of source → just move pointer.
     * Otherwise:    create a merge commit combining both file snapshots.
     *               Conflicts (same file, different content) are reported.
     *
     * Returns the resulting commit (either the fast-forwarded or the new merge commit).
     */
    public Commit merge(String branchName) {
        Branch source = branches.get(branchName);
        if (source == null) throw new IllegalArgumentException("unknown branch: " + branchName);
        if (branchName.equals(currentBranch)) throw new IllegalArgumentException("cannot merge branch into itself");

        String ourId = head().getId();
        String theirId = source.getCommitId();

        if (ourId.equals(theirId)) throw new IllegalStateException("already up to date");

        // Fast-forward: our HEAD is an ancestor of theirs
        if (isAncestor(ourId, theirId)) {
            branches.get(currentBranch).advanceTo(theirId);
            workingDirectory.clear();
            workingDirectory.putAll(commits.get(theirId).getFiles());
            return commits.get(theirId);
        }

        // Merge: combine file snapshots, detect conflicts
        Map<String, String> ourFiles = head().getFiles();
        Map<String, String> theirFiles = commits.get(theirId).getFiles();
        Map<String, String> merged = new HashMap<>(ourFiles);

        List<String> conflicts = new ArrayList<>();
        for (Map.Entry<String, String> e : theirFiles.entrySet()) {
            String path = e.getKey();
            String theirContent = e.getValue();
            if (ourFiles.containsKey(path) && !ourFiles.get(path).equals(theirContent)) {
                conflicts.add(path);
            } else {
                merged.put(path, theirContent);
            }
        }

        if (!conflicts.isEmpty()) {
            throw new IllegalStateException("merge conflict in: " + conflicts);
        }

        List<String> parents = new ArrayList<>();
        parents.add(ourId);
        parents.add(theirId);

        Commit mergeCommit = new Commit(
            nextId(), "merge " + branchName + " into " + currentBranch, "system",
            parents, merged
        );
        commits.put(mergeCommit.getId(), mergeCommit);
        branches.get(currentBranch).advanceTo(mergeCommit.getId());
        workingDirectory.clear();
        workingDirectory.putAll(merged);
        return mergeCommit;
    }

    // ── helpers ──

    public Commit head() {
        return commits.get(branches.get(currentBranch).getCommitId());
    }

    /** Walk parent chain from descendant looking for ancestorId. */
    private boolean isAncestor(String ancestorId, String descendantId) {
        Set<String> visited = new HashSet<>();
        List<String> queue = new ArrayList<>();
        queue.add(descendantId);

        while (!queue.isEmpty()) {
            String id = queue.remove(queue.size() - 1);
            if (id.equals(ancestorId)) return true;
            if (!visited.add(id)) continue;
            Commit c = commits.get(id);
            if (c != null) queue.addAll(c.getParentIds());
        }
        return false;
    }

    private Commit requireCommit(String id) {
        Commit c = commits.get(id);
        if (c == null) throw new IllegalArgumentException("unknown commit: " + id);
        return c;
    }

    private String nextId() {
        return String.format("c%03d", ++commitCounter);
    }

    @Override
    public String toString() { return "Repository{" + name + ", branch=" + currentBranch + ", HEAD=" + head().getId() + "}"; }
}
