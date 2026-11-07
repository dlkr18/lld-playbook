# versioncontrol - Complete Implementation

> Generated from `src/main/java/com/you/lld/problems/versioncontrol/` on 2026-11-07. Re-run `python3 scripts/generate-code-md.py versioncontrol`.

## Project Structure (16 files)

```
versioncontrol/
├── VersionControlDemo.java
├── Repository.java
├── VersionControl.java
├── model/Blob.java
├── model/Branch.java
├── model/Commit.java
├── model/Diff.java
├── model/Tree.java
├── service/BranchManager.java
├── service/CommitStore.java
├── service/MergeBaseFinder.java
├── service/MergeStrategy.java
├── service/ObjectStore.java
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
        return new VersionControl(name).getRepository();
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

    /**
     * Switches to {@code branchName}, replacing the working directory with that
     * branch's tip.
     *
     * <p>Refuses if the working directory is dirty. Overwriting uncommitted work is
     * silent, unrecoverable data loss — git says "Your local changes would be
     * overwritten by checkout" for exactly this reason. Commit or discard first.
     */
    public void checkout(String branchName) {
        Branch b = branchManager.get(branchName);
        requireCleanWorkingDirectory("checkout");
        currentBranch = branchName;
        workingDirectory.clear();
        workingDirectory.putAll(commitStore.get(b.getCommitId()).getFiles(objectStore));
    }

    /** Discards uncommitted changes, restoring the working directory to HEAD. */
    public void discardChanges() {
        workingDirectory.clear();
        workingDirectory.putAll(headFiles());
    }

    private void requireCleanWorkingDirectory(String operation) {
        Diff pending = status();
        if (!pending.isEmpty()) {
            throw new IllegalStateException(
                    "cannot " + operation + ": uncommitted changes would be overwritten "
                            + pending + " — commit or discardChanges() first");
        }
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
        requireCleanWorkingDirectory("merge");
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
```

</details>

### `VersionControl.java`

<details>
<summary>Click to view VersionControl.java</summary>

```java
package com.you.lld.problems.versioncontrol;

import com.you.lld.problems.versioncontrol.service.impl.InMemoryBranchManager;
import com.you.lld.problems.versioncontrol.service.impl.InMemoryCommitStore;
import com.you.lld.problems.versioncontrol.service.impl.SimpleMerge;
import com.you.lld.problems.versioncontrol.service.ObjectStore;

public final class VersionControl {

    private final Repository repository;

    public VersionControl(String name) {
        this.repository = new Repository(
                name,
                new ObjectStore(),
                new InMemoryCommitStore(),
                new InMemoryBranchManager(),
                new SimpleMerge());
    }

    public Repository getRepository() {
        return repository;
    }
}
```

</details>

### `model/Blob.java`

<details>
<summary>Click to view model/Blob.java</summary>

```java
package com.you.lld.problems.versioncontrol.model;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

/**
 * Content-addressed blob — immutable file contents.
 */
public final class Blob {

    private final String hash;
    private final String content;

    public Blob(String content) {
        this.content = content;
        this.hash = sha1(content);
    }

    public String getHash() {
        return hash;
    }

    public String getContent() {
        return content;
    }

    private static String sha1(String content) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-1");
            byte[] bytes = digest.digest(content.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            for (byte b : bytes) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-1 unavailable", e);
        }
    }
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
 * Immutable commit pointing to a tree hash in the object store (Git-like DAG node).
 */
public final class Commit {

    private final String id;
    private final String message;
    private final String author;
    private final LocalDateTime timestamp;
    private final List<String> parentIds;
    private final String treeHash;

    public Commit(String id, String message, String author,
                  List<String> parentIds, String treeHash) {
        this.id = id;
        this.message = message;
        this.author = author;
        this.timestamp = LocalDateTime.now();
        this.parentIds = Collections.unmodifiableList(new ArrayList<String>(parentIds));
        this.treeHash = treeHash;
    }

    public String getId() {
        return id;
    }

    public String getMessage() {
        return message;
    }

    public String getAuthor() {
        return author;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public List<String> getParentIds() {
        return parentIds;
    }

    public String getTreeHash() {
        return treeHash;
    }

    /**
     * Resolved file snapshot via object store (blob/tree indirection).
     */
    public Map<String, String> getFiles(com.you.lld.problems.versioncontrol.service.ObjectStore store) {
        return new HashMap<String, String>(store.resolveFiles(treeHash));
    }

    @Override
    public String toString() {
        String parents = parentIds.isEmpty() ? "" : " parent=" + parentIds;
        return id + " " + message + " (" + author + ")" + parents + " tree=" + treeHash.substring(0, 8);
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

### `model/Tree.java`

<details>
<summary>Click to view model/Tree.java</summary>

```java
package com.you.lld.problems.versioncontrol.model;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.TreeMap;

/**
 * Tree object mapping file paths to blob hashes (flat namespace).
 */
public final class Tree {

    private final String hash;
    private final Map<String, String> entries;

    public Tree(Map<String, String> pathToBlobHash) {
        Map<String, String> sorted = new TreeMap<String, String>(pathToBlobHash);
        this.entries = Collections.unmodifiableMap(new HashMap<String, String>(sorted));
        this.hash = digest("tree", sorted);
    }

    public String getHash() {
        return hash;
    }

    public Map<String, String> getEntries() {
        return entries;
    }

    static String digest(String prefix, Map<String, String> sorted) {
        StringBuilder canonical = new StringBuilder(prefix);
        for (Map.Entry<String, String> e : sorted.entrySet()) {
            canonical.append(e.getKey()).append('\0').append(e.getValue()).append('\n');
        }
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-1");
            byte[] bytes = md.digest(canonical.toString().getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            for (byte b : bytes) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-1 unavailable", e);
        }
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

### `service/MergeBaseFinder.java`

<details>
<summary>Click to view service/MergeBaseFinder.java</summary>

```java
package com.you.lld.problems.versioncontrol.service;

import com.you.lld.problems.versioncontrol.model.Commit;
import java.util.ArrayDeque;
import java.util.HashSet;
import java.util.Queue;
import java.util.Set;

/**
 * Finds lowest common ancestor (merge base) on the commit DAG.
 */
public final class MergeBaseFinder {

    private MergeBaseFinder() {
    }

    public static String findMergeBase(CommitStore store, String commitA, String commitB) {
        Set<String> ancestorsOfA = collectAncestors(store, commitA);
        Queue<String> queue = new ArrayDeque<String>();
        Set<String> visited = new HashSet<String>();
        queue.add(commitB);
        while (!queue.isEmpty()) {
            String id = queue.remove();
            if (ancestorsOfA.contains(id)) {
                return id;
            }
            if (!visited.add(id)) {
                continue;
            }
            Commit commit = store.get(id);
            for (String parent : commit.getParentIds()) {
                queue.add(parent);
            }
        }
        return null;
    }

    private static Set<String> collectAncestors(CommitStore store, String startId) {
        Set<String> ancestors = new HashSet<String>();
        Queue<String> queue = new ArrayDeque<String>();
        queue.add(startId);
        while (!queue.isEmpty()) {
            String id = queue.remove();
            if (!ancestors.add(id)) {
                continue;
            }
            for (String parent : store.get(id).getParentIds()) {
                queue.add(parent);
            }
        }
        return ancestors;
    }
}
```

</details>

### `service/MergeStrategy.java`

<details>
<summary>Click to view service/MergeStrategy.java</summary>

```java
package com.you.lld.problems.versioncontrol.service;

import com.you.lld.problems.versioncontrol.model.Commit;

public interface MergeStrategy {

    Commit merge(Commit ourHead, Commit theirHead, CommitStore store, ObjectStore objectStore);
}
```

</details>

### `service/ObjectStore.java`

<details>
<summary>Click to view service/ObjectStore.java</summary>

```java
package com.you.lld.problems.versioncontrol.service;

import com.you.lld.problems.versioncontrol.model.Blob;
import com.you.lld.problems.versioncontrol.model.Tree;
import java.util.HashMap;
import java.util.Map;

/**
 * Content-addressed object store for blobs and trees.
 */
public final class ObjectStore {

    private final Map<String, Blob> blobs = new HashMap<String, Blob>();
    private final Map<String, Tree> trees = new HashMap<String, Tree>();

    public String storeBlob(String content) {
        Blob blob = new Blob(content);
        blobs.put(blob.getHash(), blob);
        return blob.getHash();
    }

    public String storeTree(Map<String, String> files) {
        Map<String, String> pathToBlob = new HashMap<String, String>();
        for (Map.Entry<String, String> entry : files.entrySet()) {
            pathToBlob.put(entry.getKey(), storeBlob(entry.getValue()));
        }
        Tree tree = new Tree(pathToBlob);
        trees.put(tree.getHash(), tree);
        return tree.getHash();
    }

    public Map<String, String> resolveFiles(String treeHash) {
        Tree tree = trees.get(treeHash);
        if (tree == null) {
            throw new IllegalArgumentException("unknown tree: " + treeHash);
        }
        Map<String, String> files = new HashMap<String, String>();
        for (Map.Entry<String, String> entry : tree.getEntries().entrySet()) {
            Blob blob = blobs.get(entry.getValue());
            if (blob == null) {
                throw new IllegalStateException("missing blob for " + entry.getKey());
            }
            files.put(entry.getKey(), blob.getContent());
        }
        return files;
    }

    public Blob getBlob(String hash) {
        return blobs.get(hash);
    }

    public Tree getTree(String hash) {
        return trees.get(hash);
    }
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
import com.you.lld.problems.versioncontrol.service.MergeBaseFinder;
import com.you.lld.problems.versioncontrol.service.MergeStrategy;
import com.you.lld.problems.versioncontrol.service.ObjectStore;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Fast-forward when possible; otherwise 3-way merge using merge-base (LCA).
 */
public final class SimpleMerge implements MergeStrategy {

    private int mergeCounter;

    @Override
    public Commit merge(Commit ourHead, Commit theirHead, CommitStore store, ObjectStore objectStore) {
        String ourId = ourHead.getId();
        String theirId = theirHead.getId();

        if (ourId.equals(theirId)) {
            throw new IllegalStateException("already up to date");
        }

        if (store.isAncestor(ourId, theirId)) {
            return theirHead;   // fast-forward: our tip is already behind theirs
        }
        if (store.isAncestor(theirId, ourId)) {
            throw new IllegalStateException("already up to date");   // theirs is already merged in
        }

        String baseId = MergeBaseFinder.findMergeBase(store, ourId, theirId);
        Map<String, String> baseFiles = baseId == null
                ? new HashMap<String, String>()
                : store.get(baseId).getFiles(objectStore);
        Map<String, String> ourFiles = ourHead.getFiles(objectStore);
        Map<String, String> theirFiles = theirHead.getFiles(objectStore);

        Set<String> allPaths = new HashSet<String>();
        allPaths.addAll(baseFiles.keySet());
        allPaths.addAll(ourFiles.keySet());
        allPaths.addAll(theirFiles.keySet());

        Map<String, String> merged = new HashMap<String, String>();
        List<String> conflicts = new ArrayList<String>();

        for (String path : allPaths) {
            String base = baseFiles.get(path);
            String ours = ourFiles.get(path);
            String theirs = theirFiles.get(path);

            if (equals(ours, theirs)) {
                if (ours != null) {
                    merged.put(path, ours);
                }
            } else if (equals(ours, base)) {
                if (theirs != null) {
                    merged.put(path, theirs);
                }
            } else if (equals(theirs, base)) {
                if (ours != null) {
                    merged.put(path, ours);
                }
            } else {
                conflicts.add(path);
            }
        }

        if (!conflicts.isEmpty()) {
            throw new IllegalStateException("merge conflict in: " + conflicts);
        }

        List<String> parents = new ArrayList<String>();
        parents.add(ourId);
        parents.add(theirId);
        String treeHash = objectStore.storeTree(merged);
        return new Commit(nextMergeId(), "merge", "system", parents, treeHash);
    }

    private boolean equals(String a, String b) {
        if (a == null && b == null) {
            return true;
        }
        if (a == null || b == null) {
            return false;
        }
        return a.equals(b);
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
