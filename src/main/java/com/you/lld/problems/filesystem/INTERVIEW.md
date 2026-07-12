# File System — SDE2/SDE3 Interview Walkthrough

**Problem:** Design an in-memory file system with files/directories, path normalization, and concurrent read/write access.

---

## 1. Clarifying Questions

- Node types? (File and directory implementing common interface.)
- Path format? (Unix-style `/` separated; normalize `.` and `..`.)
- Operations? (mkdir, createFile, read, write, delete, list.)
- Concurrency? (Multiple readers OR single writer — `ReadWriteLock`.)
- Max file size? (Unbounded in-memory `byte[]` for demo.)
- Symlinks? (Out of scope.)
- Permissions? (Extension — owner read/write.)

---

## 2. Functional Requirements

1. **mkdir** — create directory path; fail if exists.
2. **createFile** — create or overwrite file at path.
3. **readFile** — return content bytes.
4. **writeFile** — replace or append content.
5. **delete** — remove file or empty directory.
6. **list** — children of directory.
7. **exists / isDirectory** — path metadata queries.

---

## 3. Non-Functional Requirements

| Area | Target |
|------|--------|
| **Concurrency** | `ReadWriteLock` — concurrent reads, exclusive writes |
| **Correctness** | Path normalization prevents traversal bugs |
| **Extensibility** | `FileSystemService` interface for alternate backends |
| **Structure** | Composite tree — uniform treatment of nodes |

---

## 4. Core Entities

| Class | Layer | Purpose | Internal Summary |
|-------|-------|---------|------------------|
| `FileSystemEntry` | model | Node interface | getName, isDirectory, list |
| `FileEntry` | model | File leaf | byte[] content |
| `DirectoryEntry` | model | Composite | Map name → child entry |
| `FileSystemService` | service | API | CRUD + list operations |
| `InMemoryFileSystem` | impl | Tree root | `/` root + lock + path resolver |

---

## 5. Relationships

- `InMemoryFileSystem` **owns** root `DirectoryEntry`.
- `DirectoryEntry` **contains** child `FileSystemEntry` map.
- `FileEntry` **leaf** — no children.
- All mutations **acquire** write lock; reads **acquire** read lock.

---

## 6. Design Patterns

| Pattern | Why over alternatives |
|---------|----------------------|
| **Composite** (`FileSystemEntry`) | Uniform list/delete traversal for files and dirs |
| **ReadWriteLock** | vs synchronized — allows parallel reads |

---

## 7. Key Implementation Details

### 7.1 Path normalization

Split on `/`, skip empty and `.`, pop on `..` with root clamp — prevents escape above root.

### 7.2 Composite traversal

`resolve(path)` walks from root directory following child map keys segment by segment.

### 7.3 Delete directory

Only if `list().isEmpty()` — else `DirectoryNotEmptyException`.

---

## 8. Likely Follow-Up Q&A

**Q: Copy-on-write for read performance?**  
A: Immutable snapshots for readFile while write creates new version — extension.

**Q: Large files?**  
A: Chunked storage or spill to disk — not in-memory byte[].

**Q: Watch/notify on changes?**  
A: Observer on directory register inotify-style API.

**Q: Atomic rename?**  
A: Write lock; move entry between parent maps in one critical section.

**Q: Permissions?**  
A: ACL on each entry checked before op.

**Q: Distributed FS?**  
A: Metadata server + chunk servers — very different scale.

**Q: Soft delete / trash?**  
A: Tombstone flag + delayed purge job.

---

## 9. Trade-offs & Alternatives

| Choice | Trade-off |
|--------|-----------|
| In-memory tree | Fast; RAM bound |
| ReadWriteLock | Good read ratio; writer starvation possible (fair lock option) |
| No symlink | Simpler; less POSIX complete |
| Whole-file read/write | Simple API; streaming for large files |

**Demo:** `mvn -q compile exec:java -Dexec.mainClass="com.you.lld.problems.filesystem.FileSystemDemo"`
