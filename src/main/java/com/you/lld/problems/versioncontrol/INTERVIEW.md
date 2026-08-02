# Version Control (Git) — SDE2/SDE3 Interview Walkthrough

A full 70–100 minute walkthrough: clarify → requirements → entities →
relationships → patterns (with rationale) → key implementations → follow-ups →
trade-offs.

> This question is really "do you understand git's data model?" The answer that
> scores is: **content-addressed immutable objects + a DAG of commits + branches
> that are just movable pointers.** Everything else follows from that.

---

## 1. Clarifying Questions (first 5 minutes)

1. **Which git am I building?** The object model and the porcelain around it —
   add, commit, branch, checkout, log, diff, merge. Not the network protocol, not
   the index/staging area as a separate layer, not packfiles.
2. **Staging area?** I'll collapse it: the working directory *is* what gets
   committed. Real git's index is a third state between working tree and HEAD, and
   I'll say where it would slot in.
3. **File contents — text only?** Text, compared whole-file. Line-level diffing is
   an orthogonal algorithm (Myers) that I'll name but not implement.
4. **Merge semantics?** Fast-forward when possible; otherwise a **3-way merge**
   against the merge base. Conflicts abort the merge — I won't write conflict
   markers into files.
5. **What must never happen?** Losing committed history, and silently destroying
   uncommitted work. Both are data loss, and the second one is the trap here.
6. **Single user or concurrent?** Single-threaded. A repository is a
   single-user-at-a-time structure; I'll state that rather than sprinkle locks.
7. **Persistence?** In-memory. The object store is the part that maps cleanly onto
   `.git/objects` on disk.

---

## 2. Functional Requirements

- Track files in a working directory: `addFile`, `deleteFile`.
- `commit(message, author)` — snapshot the working directory; refuse an empty commit.
- `log()` — walk commit history from HEAD.
- `createBranch` / `checkout` — branch as a movable pointer.
- `diff(fromId, toId)` and `status()` (HEAD vs working directory).
- `merge(branch)` — fast-forward or 3-way; conflicts abort.
- Content-addressed storage: identical content stored once.

## 3. Non-Functional Requirements

- **Immutable history** — a commit, once made, never changes.
- **Deduplication** — the same file content across commits/branches stores one blob.
- **No silent data loss** — operations that would clobber uncommitted work must refuse.
- **O(1)** object lookup by hash; history walks proportional to the DAG.
- **Pluggable merge** — the merge algorithm is the part most likely to change.

---

## 4. Core Entities

| Entity | Layer | Internal summary |
|--------|-------|------------------|
| `Blob` | model | Immutable file **content**, keyed by `sha1(content)`. Knows nothing about its path — that's what makes dedup work. |
| `Tree` | model | Immutable `Map<path, blobHash>` — a directory snapshot. Also content-hashed, so two identical snapshots collapse to one tree. |
| `Commit` | model | Immutable: `id`, `message`, `author`, `parentIds` (a **list** — 2 parents means a merge), `treeHash`. `getFiles(objectStore)` resolves the whole snapshot. |
| `Branch` | model | A **name + a commit id**. That's the entire concept: branches are pointers, and `advanceTo` moves one. |
| `Diff` | model | `Diff.between(mapA, mapB)` → ADD / MODIFY / DELETE per path. Used for both `status()` and `diff()`. |
| `ObjectStore` | service | Content-addressed store for blobs and trees. `storeTree` writes every blob and returns the tree hash. |
| `CommitStore` | service (interface) | Save/get commits, `log(fromId)`, and `isAncestor(a, b)` — the DAG reachability primitive. |
| `BranchManager` | service (interface) | Named pointers; rejects duplicate branch names. |
| `MergeBaseFinder` | service | BFS for the lowest common ancestor of two commits. |
| `MergeStrategy` | service (interface) | `merge(ourHead, theirHead, commitStore, objectStore)`. |
| `SimpleMerge` | service/impl | Fast-forward detection + 3-way merge + conflict detection. |
| `Repository` | root | HEAD, current branch, working directory, and the porcelain commands. |
| `VersionControl` | root | Wires the default implementations. |

---

## 5. Relationships

The object model is a **layered content-addressed graph**, and drawing it is worth
60 seconds of whiteboard time:

```
Branch("main") ──▶ Commit c003 ──▶ Tree(hash) ──▶ Blob(hash) = "file content"
                      │                    └────▶ Blob(hash)
                      ▼ parentIds
                   Commit c002 ──▶ Tree(hash) ──▶ (same Blob, shared)
```

- A `Branch` **points to** one `Commit`. Nothing points *to* a branch — that's why
  creating one is O(1) and deleting one loses no history.
- A `Commit` **points to** its parents (1 normally, 2 for a merge, 0 for the root)
  and to exactly one `Tree`.
- A `Tree` **points to** `Blob`s by hash. Two commits that didn't change a file
  point at the *same* blob — that is the entire deduplication story.
- `Repository` **owns** the mutable state: `currentBranch`, `workingDirectory`,
  and the id counter. Everything reachable from a `Commit` is immutable.
- Arrows only ever point **backwards in time**. A commit cannot know its children,
  which is why `log` walks parents and why history is append-only.

---

## 6. Design Patterns (name + why vs alternatives)

- **Content-addressed storage / value objects — `Blob`, `Tree`.** The hash *is*
  the identity, so equality, deduplication, and integrity checking are the same
  operation. *Alternative:* store files per commit with generated ids — rejected:
  no dedup, and no way to tell whether two snapshots are the same.
- **Strategy — `MergeStrategy`.** Merge is the algorithm most likely to change
  (ours/theirs, recursive, octopus, rebase). Behind an interface, `SimpleMerge` is
  swappable without touching `Repository`. *Alternative:* merge logic inside
  `Repository` — rejected: it's the single most complex algorithm here and it
  deserves isolation for testing.
- **Repository/Store seams — `CommitStore`, `BranchManager`, `ObjectStore`.**
  In-memory now, filesystem later. `Repository` is constructor-injected with all
  four collaborators, so the whole thing is testable with fakes.
- **Facade — `Repository`.** The porcelain (`commit`, `checkout`, `merge`) over the
  plumbing (object store, commit store, branch manager) — which is exactly how git
  itself is described.
- **Composite (implicitly) — `Tree`.** Flattened to `path → blob` here; real git
  nests trees within trees, which is the true Composite. Worth naming the
  simplification.
- *(Considered, rejected)* **Memento** for snapshots. A `Commit` *is* a memento,
  but calling it that adds nothing — the domain word is better.

---

## 7. Key Implementation Details

### 7.1 Checkout and merge silently destroyed uncommitted work (the headline)

`checkout` did this:

```java
currentBranch = branchName;
workingDirectory.clear();                       // <-- everything uncommitted, gone
workingDirectory.putAll(commitStore.get(b.getCommitId()).getFiles(objectStore));
```

Measured:

```
working dir before checkout: [URGENT.txt, README.md]
status (uncommitted): DIRTY
working dir after checkout : [README.md]
*** SILENT DATA LOSS: uncommitted file destroyed by checkout ***
```

`merge` had the same hole — it also ends with `workingDirectory.clear()`.

This is worse than a crash, because nothing tells the user. Git's entire design
around this is a refusal: *"Your local changes to the following files would be
overwritten by checkout."* The fix is to make the precondition explicit:

```java
private void requireCleanWorkingDirectory(String operation) {
    Diff pending = status();
    if (!pending.isEmpty()) {
        throw new IllegalStateException("cannot " + operation
                + ": uncommitted changes would be overwritten " + pending
                + " — commit or discardChanges() first");
    }
}
```

called from both `checkout` and `merge`, plus an explicit `discardChanges()` so the
user has a *deliberate* way to throw work away. The asymmetry is the point:
destroying work must be something you ask for, never something that happens to you.

Note `status()` already existed and computed exactly the needed answer — the guard
is three lines because the diff machinery was already right. That's usually the
shape of these bugs: the information was available, nobody consulted it.

### 7.2 Content addressing is what makes branching cheap

```java
public String storeTree(Map<String, String> files) {
    Map<String, String> pathToBlob = new HashMap<>();
    for (Map.Entry<String, String> entry : files.entrySet()) {
        pathToBlob.put(entry.getKey(), storeBlob(entry.getValue()));   // sha1(content)
    }
    Tree tree = new Tree(pathToBlob);
    trees.put(tree.getHash(), tree);
    return tree.getHash();
}
```

`storeBlob` is idempotent: storing identical content twice writes the same key. So
a 10-commit history of a 100-file project where each commit changes one file stores
109 blobs, not 1000. Creating a branch stores **nothing at all** — it's a new name
pointing at an existing commit id.

The interview line: *"a branch is 40 bytes."*

### 7.3 Fast-forward vs 3-way merge

```java
if (store.isAncestor(ourId, theirId)) return theirHead;        // fast-forward
if (store.isAncestor(theirId, ourId)) throw new IllegalStateException("already up to date");
```

- If our tip is an **ancestor** of theirs, we've made no divergent commits — just
  move the pointer. No merge commit, no new objects.
- If theirs is an ancestor of ours, their work is already contained in our history
  — "already up to date". (This case previously fell through to the 3-way path and
  fabricated a pointless merge commit whose tree equalled ours.)
- Otherwise the branches diverged, so we need the **merge base** — the lowest
  common ancestor — and a 3-way comparison per path:

| ours vs theirs | ours vs base | result |
|---|---|---|
| same | — | take either (both made the same change) |
| differ | ours == base | take **theirs** (only they changed it) |
| differ | theirs == base | take **ours** (only we changed it) |
| differ | both differ from base | **conflict** |

`null` is a legitimate value in that table — it means "file absent" — which is how
add/delete are handled without a special case. A file we deleted and they didn't
touch: `ours == null`, `theirs == base` → take ours → stays deleted. Correct.

The merge commit is the only object with **two parents**, which is precisely what
makes history a DAG rather than a list.

### 7.4 The merge base search, and its honest limitation

```java
Set<String> ancestorsOfA = collectAncestors(store, commitA);
// BFS outward from B, first hit that is also an ancestor of A wins
```

BFS from B returns the common ancestor **fewest hops from B**. For linear history
with occasional merges — the shape of virtually every real repository — that is the
lowest common ancestor.

It is not exactly correct for **criss-cross merges** (two branches that merged each
other in both directions), where there can be multiple minimal common ancestors and
BFS hop-count picks an arbitrary one. Real git's `recursive` strategy handles this
by merging the candidate bases together and using the result as a virtual base.
I'd state this limitation unprompted rather than let an interviewer find it — and
it's a one-class change behind `MergeStrategy` if they want it.

---

## 8. Likely Follow-ups (with concise answers)

- **Add the staging area.** A third map between working directory and HEAD:
  `add` moves working → index, `commit` snapshots the *index*, `status` reports two
  diffs (index vs HEAD = "staged", working vs index = "unstaged"). `Diff.between`
  already does both — it's a new field and a rewired `commit`.
- **Commit ids should be hashes.** They're a sequential counter (`c001`) here,
  while blobs and trees are properly content-addressed. Real git hashes
  `tree + parents + author + message`, which is what makes history tamper-evident:
  changing an old commit changes its hash and therefore every descendant's. The
  counter also means two `Repository` instances sharing a `CommitStore` would
  collide. Worth fixing before calling the store "content-addressed" without
  qualification.
- **Line-level diff and conflict markers?** Myers diff for the line algorithm, and
  a conflicted merge writes `<<<<<<< ours / ======= / >>>>>>> theirs` into the file
  and leaves the merge in progress rather than aborting. `Diff` becomes per-hunk
  rather than per-file.
- **Persist to disk.** `ObjectStore` maps directly to `.git/objects/ab/cdef…`
  (first two hex chars as the directory). Branches become files in `.git/refs/heads/`
  containing a commit id. `HEAD` becomes a file containing `ref: refs/heads/main`.
  The design already matches the layout.
- **Rebase?** Replay each commit's *diff* onto a new base, creating new commits with
  new ids. That's why rebasing rewrites history and why you don't do it to shared
  branches. It's another `MergeStrategy`-shaped thing.
- **Garbage collection.** Objects unreachable from any branch (or reflog) can be
  collected — mark-and-sweep from the branch roots. Needed once branch deletion
  exists.
- **Concurrency?** Deliberately absent: `ObjectStore` and `InMemoryBranchManager`
  use plain `HashMap`, and `commitCounter` is a plain `int`. A repository is a
  single-user structure and real git uses **file locks** (`index.lock`) rather than
  in-process synchronization. If this became a server, the lock belongs per
  repository, around the ref update.
- **How would you test it?** The two harnesses from §7.1 (dirty checkout, dirty
  merge must both refuse), plus: identical content across two commits produces one
  blob; fast-forward creates no merge commit; the 3-way table above, one test per
  row.

---

## 9. Trade-offs

- **Whole-file blobs vs line-level deltas:** simple, and dedup still works at file
  granularity. Real git also stores whole objects and only deltas inside packfiles
  — so this is the right first cut, but a one-line change to a large file costs a
  full copy.
- **Flat `path → blob` tree vs nested trees:** far simpler to read and diff, but
  loses git's ability to share an *entire unchanged subdirectory* as one object, and
  makes a rename of a deep directory rewrite every path.
- **Working directory as the index (no staging area):** one less concept for a
  90-minute design, at the cost of not modelling partial commits — arguably git's
  single most-used feature.
- **Sequential commit ids vs content hashes:** readable in a demo (`c001`, `c002`),
  but gives up tamper-evidence and cross-repo identity. Named in §8 as the thing
  I'd fix first.
- **Merge conflicts abort vs conflict markers:** abort keeps the working directory
  in a known-good state and needs no "merge in progress" state to model; it also
  means the user gets no help resolving.
- **BFS merge base:** correct for realistic histories, arbitrary under criss-cross.
  Called out rather than hidden.
- **No concurrency control:** matches the single-user domain and avoids locks that
  would suggest a safety the design doesn't have. Stated as a decision, not an
  oversight.
