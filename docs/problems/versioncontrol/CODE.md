# versioncontrol - Complete Implementation

> Generated from `src/main/java/com/you/lld/problems/versioncontrol/` on 2026-05-31. Re-run `python3 scripts/generate-code-md.py versioncontrol`.

## Project Structure (11 files)

```
versioncontrol/
├── VersionControlDemo.java
├── Repository.java
├── model/Branch.java
├── model/Commit.java
├── model/Diff.java
├── service/BranchManager.java
├── service/CommitStore.java
├── service/MergeStrategy.java
├── service/impl/InMemoryBranchManager.java
├── service/impl/InMemoryCommitStore.java
├── service/impl/SimpleMerge.java
```

## Source Code

### `VersionControlDemo.java`

<details>
<summary>Click to view VersionControlDemo.java</summary>

```java
package com.you.lld.problems.versioncontrol;

import com.you.lld.problems.versioncontrol.model.Commit;
import com.you.lld.problems.versioncontrol.model.Diff;
import com.you.lld.problems.versioncontrol.service.impl.InMemoryBranchManager;
import com.you.lld.problems.versioncontrol.service.impl.InMemoryCommitStore;
import com.you.lld.problems.versioncontrol.service.impl.SimpleMerge;

/**
 * Interview walkthrough — one scenario per design point.
 *
 *  1. Basic flow       — addFile → commit → log (parent chain walk)
 *  2. Branching        — create branch, diverge, checkout restores working dir
 *  3. Fast-forward     — merge when main hasn't moved since branch point
 *  4. Diff + status    — compare commits, working dir vs HEAD
 *  5. Merge conflict   — same file changed differently in two branches
 */
public class VersionControlDemo {

    public static void main(String[] args) {
        Repository repo = createRepo("my-project");

        basicFlow(repo);
        branching(repo);
        fastForwardMerge(repo);
        diffAndStatus(repo);
        mergeConflict();

        System.out.println("\n=== done ===");
    }

    private static void basicFlow(Repository repo) {
        System.out.println("\n── 1. Basic flow: addFile → commit → log ──");
        repo.addFile("README.md", "# My Project");
        Commit c1 = repo.commit("add readme", "alice");
        System.out.println("  committed: " + c1);

        repo.addFile("src/Main.java", "public class Main {}");
        Commit c2 = repo.commit("add main class", "alice");
        System.out.println("  committed: " + c2);

        System.out.println("  log:");
        for (Commit c : repo.log()) System.out.println("    " + c);
    }

    private static void branching(Repository repo) {
        System.out.println("\n── 2. Branching — branch = pointer to a commit ──");
        repo.createBranch("feature");
        repo.checkout("feature");
        System.out.println("  on branch: " + repo.getCurrentBranch());

        repo.addFile("feature.txt", "new feature");
        Commit c3 = repo.commit("add feature", "bob");
        System.out.println("  committed on feature: " + c3);

        repo.checkout("main");
        System.out.println("  back on main, files: " + repo.getWorkingDirectory().keySet());
        System.out.println("  feature.txt is gone — it only exists on the feature branch");
    }

    private static void fastForwardMerge(Repository repo) {
        System.out.println("\n── 3. Fast-forward merge ──");
        System.out.println("  main HEAD: " + repo.head().getId() + "  feature HEAD: " + repo.getBranches().get("feature"));
        System.out.println("  main hasn't moved since branch point → fast-forward");

        Commit merged = repo.merge("feature");
        System.out.println("  after merge, main HEAD: " + repo.head().getId());
        System.out.println("  files: " + repo.getWorkingDirectory().keySet());
    }

    private static void diffAndStatus(Repository repo) {
        System.out.println("\n── 4. Diff + status ──");

        Diff d = repo.diff("c001", repo.head().getId());
        System.out.println("  diff(initial → HEAD):");
        System.out.println("  " + d);

        repo.addFile("notes.txt", "some notes");
        System.out.println("  status (uncommitted):");
        System.out.println("  " + repo.status());
        repo.commit("add notes", "alice");
    }

    private static void mergeConflict() {
        System.out.println("\n── 5. Merge conflict ──");
        Repository repo = createRepo("conflict-demo");

        repo.addFile("shared.txt", "original content");
        repo.commit("add shared file", "alice");

        repo.createBranch("branch-a");
        repo.checkout("branch-a");
        repo.addFile("shared.txt", "alice's version");
        repo.commit("alice edits shared", "alice");

        repo.checkout("main");
        repo.addFile("shared.txt", "bob's version");
        repo.commit("bob edits shared", "bob");

        try {
            repo.merge("branch-a");
        } catch (IllegalStateException e) {
            System.out.println("  " + e.getMessage());
        }
    }

    private static Repository createRepo(String name) {
        return new Repository(name, new InMemoryCommitStore(), new InMemoryBranchManager(), new SimpleMerge());
    }
}
```

</details>

### `Repository.java`

<details>
<summary>Click to view Repository.java</summary>

```java
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
```

</details>

### `model/Branch.java`

<details>
<summary>Click to view model/Branch.java</summary>

```java
package com.you.lld.problems.versioncontrol.model;

/**
 * A branch is just a named, movable pointer to a commit.
 *
 * This is Git's core insight: branches are cheap because they're
 * just a 40-byte pointer, not a copy of the codebase.
 */
public final class Branch {

    private final String name;
    private String commitId;

    public Branch(String name, String commitId) {
        this.name = name;
        this.commitId = commitId;
    }

    public String getName()     { return name; }
    public String getCommitId() { return commitId; }

    public void advanceTo(String commitId) { this.commitId = commitId; }

    @Override
    public String toString() { return name + " → " + commitId; }
}
```

</details>

### `model/Commit.java`

<details>
<summary>Click to view model/Commit.java</summary>

```java
package com.you.lld.problems.versioncontrol.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Immutable snapshot of the repository at a point in time.
 *
 * Mirrors Git's commit object:
 *   - id        : unique identifier (short hash for readability)
 *   - parentIds : usually 1; merge commits have 2
 *   - files     : FULL snapshot of all files (not a delta)
 *
 * Storing full snapshots is simpler than deltas and is what Git actually
 * does internally (each commit points to a tree with the full state).
 */
public final class Commit {

    private final String id;
    private final String message;
    private final String author;
    private final LocalDateTime timestamp;
    private final List<String> parentIds;
    private final Map<String, String> files;

    public Commit(String id, String message, String author,
                  List<String> parentIds, Map<String, String> files) {
        this.id = id;
        this.message = message;
        this.author = author;
        this.timestamp = LocalDateTime.now();
        this.parentIds = Collections.unmodifiableList(new ArrayList<>(parentIds));
        this.files = Collections.unmodifiableMap(new HashMap<>(files));
    }

    public String getId()                { return id; }
    public String getMessage()           { return message; }
    public String getAuthor()            { return author; }
    public LocalDateTime getTimestamp()   { return timestamp; }
    public List<String> getParentIds()   { return parentIds; }
    public Map<String, String> getFiles(){ return files; }

    @Override
    public String toString() {
        String parents = parentIds.isEmpty() ? "" : " parent=" + parentIds;
        return id + " " + message + " (" + author + ")" + parents;
    }
}
```

</details>

### `model/Diff.java`

<details>
<summary>Click to view model/Diff.java</summary>

```java
package com.you.lld.problems.versioncontrol.model;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

/**
 * Difference between two file snapshots.
 * <p>
 * Computed by comparing the file maps of two commits. Each entry
 * describes one file that was added, modified, or deleted.
 */
public final class Diff {

    public enum ChangeType {ADD, MODIFY, DELETE}

    public static final class Change {
        private final String path;
        private final ChangeType type;

        public Change(String path, ChangeType type) {
            this.path = path;
            this.type = type;
        }

        public String getPath() {
            return path;
        }

        public ChangeType getType() {
            return type;
        }

        @Override
        public String toString() {
            return type + " " + path;
        }
    }

    private final List<Change> changes;

    private Diff(List<Change> changes) {
        this.changes = Collections.unmodifiableList(changes);
    }

    public List<Change> getChanges() {
        return changes;
    }

    public boolean isEmpty() {
        return changes.isEmpty();
    }

    /**
     * Compare two file snapshots and produce a Diff.
     */
    public static Diff between(Map<String, String> from, Map<String, String> to) {
        List<Change> changes = new ArrayList<>();

        for (Map.Entry<String, String> e : to.entrySet()) {
            String path = e.getKey();
            if (!from.containsKey(path)) {
                changes.add(new Change(path, ChangeType.ADD));
            } else if (!from.get(path).equals(e.getValue())) {
                changes.add(new Change(path, ChangeType.MODIFY));
            }
        }

        for (String path : from.keySet()) {
            if (!to.containsKey(path)) {
                changes.add(new Change(path, ChangeType.DELETE));
            }
        }

        return new Diff(changes);
    }

    @Override
    public String toString() {
        if (changes.isEmpty()) return "(no changes)";
        StringBuilder sb = new StringBuilder();
        for (Change c : changes) {
            sb.append("  ").append(c).append("\n");
        }
        return sb.toString().trim();
    }
}
```

</details>

### `service/BranchManager.java`

<details>
<summary>Click to view service/BranchManager.java</summary>

```java
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
```

</details>

### `service/CommitStore.java`

<details>
<summary>Click to view service/CommitStore.java</summary>

```java
package com.you.lld.problems.versioncontrol.service;

import com.you.lld.problems.versioncontrol.model.Commit;

import java.util.List;
import java.util.Map;

/**
 * Object store for commits.
 *
 * SRP: only responsible for storing and retrieving commits.
 * DIP: Repository depends on this interface, not on a concrete HashMap.
 */
public interface CommitStore {

    void save(Commit commit);

    Commit get(String commitId);

    boolean contains(String commitId);

    /** Walk first-parent chain from the given commit back to root. */
    List<Commit> log(String fromCommitId);

    /** Check if ancestorId is reachable from descendantId by walking parents. */
    boolean isAncestor(String ancestorId, String descendantId);
}
```

</details>

### `service/MergeStrategy.java`

<details>
<summary>Click to view service/MergeStrategy.java</summary>

```java
package com.you.lld.problems.versioncontrol.service;

import com.you.lld.problems.versioncontrol.model.Commit;

import java.util.Map;

/**
 * Strategy for merging two branches.
 *
 * Implementations decide HOW to combine divergent histories:
 *   - SimpleMerge: fast-forward if possible, otherwise merge commit with conflict detection
 *   - (future) RebaseMerge: replay commits on top of target
 *   - (future) SquashMerge: collapse all source commits into one
 *
 * OCP: adding a new merge strategy = new class, no changes to Repository.
 */
public interface MergeStrategy {

    /**
     * Merge source commit into the current branch.
     *
     * @param ourHead    current branch's HEAD commit
     * @param theirHead  source branch's HEAD commit
     * @param commitStore read access to all commits (for ancestor checks)
     * @return the resulting commit (either theirHead for fast-forward, or a new merge commit)
     * @throws IllegalStateException if there are conflicts
     */
    Commit merge(Commit ourHead, Commit theirHead, CommitStore commitStore);
}
```

</details>

### `service/impl/InMemoryBranchManager.java`

<details>
<summary>Click to view service/impl/InMemoryBranchManager.java</summary>

```java
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
```

</details>

### `service/impl/InMemoryCommitStore.java`

<details>
<summary>Click to view service/impl/InMemoryCommitStore.java</summary>

```java
package com.you.lld.problems.versioncontrol.service.impl;

import com.you.lld.problems.versioncontrol.model.Commit;
import com.you.lld.problems.versioncontrol.service.CommitStore;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

/** HashMap-backed commit store. */
public final class InMemoryCommitStore implements CommitStore {

    private final Map<String, Commit> commits = new HashMap<>();

    @Override
    public void save(Commit commit) {
        commits.put(commit.getId(), commit);
    }

    @Override
    public Commit get(String commitId) {
        Commit c = commits.get(commitId);
        if (c == null) throw new IllegalArgumentException("unknown commit: " + commitId);
        return c;
    }

    @Override
    public boolean contains(String commitId) {
        return commits.containsKey(commitId);
    }

    @Override
    public List<Commit> log(String fromCommitId) {
        List<Commit> history = new ArrayList<>();
        Commit cur = commits.get(fromCommitId);
        while (cur != null) {
            history.add(cur);
            List<String> parents = cur.getParentIds();
            cur = parents.isEmpty() ? null : commits.get(parents.get(0));
        }
        return history;
    }

    @Override
    public boolean isAncestor(String ancestorId, String descendantId) {
        Set<String> visited = new HashSet<>();
        List<String> stack = new ArrayList<>();
        stack.add(descendantId);

        while (!stack.isEmpty()) {
            String id = stack.remove(stack.size() - 1);
            if (id.equals(ancestorId)) return true;
            if (!visited.add(id)) continue;
            Commit c = commits.get(id);
            if (c != null) stack.addAll(c.getParentIds());
        }
        return false;
    }
}
```

</details>

### `service/impl/SimpleMerge.java`

<details>
<summary>Click to view service/impl/SimpleMerge.java</summary>

```java
package com.you.lld.problems.versioncontrol.service.impl;

import com.you.lld.problems.versioncontrol.model.Commit;
import com.you.lld.problems.versioncontrol.service.CommitStore;
import com.you.lld.problems.versioncontrol.service.MergeStrategy;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Default merge strategy: fast-forward when possible, otherwise
 * create a merge commit with conflict detection.
 *
 * Fast-forward: our HEAD is an ancestor of theirs → just return their commit
 *               (caller advances the branch pointer).
 *
 * Merge commit: combine both file snapshots. If the same file was changed
 *               differently in both branches → conflict (throw with paths).
 */
public final class SimpleMerge implements MergeStrategy {

    private int mergeCounter;

    @Override
    public Commit merge(Commit ourHead, Commit theirHead, CommitStore store) {
        String ourId = ourHead.getId();
        String theirId = theirHead.getId();

        if (ourId.equals(theirId)) {
            throw new IllegalStateException("already up to date");
        }

        // Fast-forward
        if (store.isAncestor(ourId, theirId)) {
            return theirHead;
        }

        // Merge commit
        Map<String, String> ourFiles = ourHead.getFiles();
        Map<String, String> theirFiles = theirHead.getFiles();
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

        return new Commit(nextMergeId(), "merge", "system", parents, merged);
    }

    private String nextMergeId() {
        return String.format("m%03d", ++mergeCounter);
    }
}
```

</details>

## Run Demo

```bash
mvn -q compile exec:java -Dexec.mainClass="com.you.lld.problems.versioncontrol.VersionControlDemo"
```
