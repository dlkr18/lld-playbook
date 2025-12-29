# Version Control System - Complete Source Code

## 📦 Package Structure

```
versioncontrol/
├── model/
│   ├── Commit.java
│   ├── Branch.java
│   └── Repository.java
├── api/
│   └── VersionControl.java
├── impl/
│   └── VersionControlImpl.java
└── VersionControlDemo.java
```

**Total Files:** 6

---

## 📄 Source Files

### 📁 api/

#### `VersionControl.java`

<details>
<summary>📄 Click to view source code</summary>

```java
package com.you.lld.problems.versioncontrol.api;

import com.you.lld.problems.versioncontrol.model.*;
import java.util.List;

public interface VersionControl {
    void createRepository(String name);
    String commit(String repoName, String message, String author);
    void createBranch(String repoName, String branchName);
    void switchBranch(String repoName, String branchName);
    List<Commit> getHistory(String repoName);
    Commit getCommit(String repoName, String commitId);
}

```
</details>

### 📁 impl/

#### `VersionControlImpl.java`

<details>
<summary>📄 Click to view source code</summary>

```java
package com.you.lld.problems.versioncontrol.impl;

import com.you.lld.problems.versioncontrol.api.VersionControl;
import com.you.lld.problems.versioncontrol.model.*;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

public class VersionControlImpl implements VersionControl {
    private final Map<String, Repository> repositories = new ConcurrentHashMap<>();
    private final Map<String, Map<String, Commit>> commits = new ConcurrentHashMap<>();
    
    @Override
    public void createRepository(String name) {
        repositories.put(name, new Repository(name));
        commits.put(name, new ConcurrentHashMap<>());
        System.out.println("Repository created: " + name);
    }
    
    @Override
    public String commit(String repoName, String message, String author) {
        Repository repo = repositories.get(repoName);
        if (repo == null) return null;
        
        Branch currentBranch = repo.getCurrentBranch();
        String commitId = UUID.randomUUID().toString().substring(0, 8);
        
        Commit commit = new Commit(
            commitId, message, author, 
            currentBranch.getHeadCommitId(), 
            new HashMap<>()
        );
        
        commits.get(repoName).put(commitId, commit);
        currentBranch.updateHead(commitId);
        
        System.out.println("Commit created: " + commitId + " - " + message);
        return commitId;
    }
    
    @Override
    public void createBranch(String repoName, String branchName) {
        Repository repo = repositories.get(repoName);
        if (repo != null) {
            String headCommit = repo.getCurrentBranch().getHeadCommitId();
            repo.createBranch(branchName, headCommit);
            System.out.println("Branch created: " + branchName);
        }
    }
    
    @Override
    public void switchBranch(String repoName, String branchName) {
        Repository repo = repositories.get(repoName);
        if (repo != null) {
            repo.switchBranch(branchName);
            System.out.println("Switched to branch: " + branchName);
        }
    }
    
    @Override
    public List<Commit> getHistory(String repoName) {
        Map<String, Commit> repoCommits = commits.get(repoName);
        return repoCommits != null ? new ArrayList<>(repoCommits.values()) : 
                                     Collections.emptyList();
    }
    
    @Override
    public Commit getCommit(String repoName, String commitId) {
        Map<String, Commit> repoCommits = commits.get(repoName);
        return repoCommits != null ? repoCommits.get(commitId) : null;
    }
}

```
</details>

### 📁 model/

#### `Branch.java`

<details>
<summary>📄 Click to view source code</summary>

```java
package com.you.lld.problems.versioncontrol.model;

public class Branch {
    private final String name;
    private String headCommitId;
    
    public Branch(String name, String headCommitId) {
        this.name = name;
        this.headCommitId = headCommitId;
    }
    
    public void updateHead(String commitId) {
        this.headCommitId = commitId;
    }
    
    public String getName() { return name; }
    public String getHeadCommitId() { return headCommitId; }
    
    @Override
    public String toString() {
        return "Branch{name='" + name + "', head='" + headCommitId + "'}";
    }
}

```
</details>

#### `Commit.java`

<details>
<summary>📄 Click to view source code</summary>

```java
package com.you.lld.problems.versioncontrol.model;

import java.time.LocalDateTime;
import java.util.*;

public class Commit {
    private final String id;
    private final String message;
    private final String author;
    private final LocalDateTime timestamp;
    private final String parentId;
    private final Map<String, String> files;
    
    public Commit(String id, String message, String author, String parentId, 
                  Map<String, String> files) {
        this.id = id;
        this.message = message;
        this.author = author;
        this.timestamp = LocalDateTime.now();
        this.parentId = parentId;
        this.files = new HashMap<>(files);
    }
    
    public String getId() { return id; }
    public String getMessage() { return message; }
    public String getParentId() { return parentId; }
    public Map<String, String> getFiles() { return new HashMap<>(files); }
    
    @Override
    public String toString() {
        return "Commit{id='" + id + "', message='" + message + "', author='" + 
               author + "', time=" + timestamp + "}";
    }
}

```
</details>

#### `Repository.java`

<details>
<summary>📄 Click to view source code</summary>

```java
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

```
</details>

### 📦 Root Package

#### `VersionControlDemo.java`

<details>
<summary>📄 Click to view source code</summary>

```java
package com.you.lld.problems.versioncontrol;

import com.you.lld.problems.versioncontrol.impl.VersionControlImpl;

public class VersionControlDemo {
    public static void main(String[] args) {
        System.out.println("📚 Version Control System Demo");
        System.out.println("==================================================================");
        System.out.println();
        
        VersionControlImpl vcs = new VersionControlImpl();
        
        vcs.createRepository("my-project");
        
        System.out.println();
        vcs.commit("my-project", "Initial commit", "Alice");
        vcs.commit("my-project", "Add feature", "Bob");
        
        System.out.println();
        vcs.createBranch("my-project", "feature-branch");
        vcs.switchBranch("my-project", "feature-branch");
        vcs.commit("my-project", "Work on feature", "Alice");
        
        System.out.println();
        System.out.println("Commit history:");
        vcs.getHistory("my-project").forEach(System.out::println);
        
        System.out.println("\n✅ Demo complete!");
    }
}

```
</details>

---

## 🚀 How to Run

### Compile
```bash
javac -d out src/main/java/com/you/lld/problems/versioncontrol/**/*.java
```

### Run Demo
```bash
java -cp out com.you.lld.problems.versioncontrol.VersionControlDemo
```

---

## 💡 Key Features

✅ **Repository Management**: Create and manage multiple repositories  
✅ **Commit Tracking**: Immutable commits with parent tracking  
✅ **Branch Support**: Create and switch branches  
✅ **History Navigation**: View complete commit history  
✅ **Thread-Safe**: ConcurrentHashMap for concurrent access  
✅ **Clean Architecture**: Separation of concerns with layers  

---

**[← Back to Version Control README](README.md)**
