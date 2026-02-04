# versioncontrol - Complete Implementation

## 📁 Project Structure (10 files)

```
versioncontrol/
├── Branch.java
├── Commit.java
├── Demo.java
├── VersionControl.java
├── VersionControlDemo.java
├── api/VersionControl.java
├── impl/VersionControlImpl.java
├── model/Branch.java
├── model/Commit.java
├── model/Repository.java
```

## 📝 Source Code

### 📄 `Branch.java`

<details>
<summary>📄 Click to view Branch.java</summary>

```java
package com.you.lld.problems.versioncontrol;
public class Branch {
    private final String name;
    private String currentCommitId;
    
    public Branch(String name, String commitId) {
        this.name = name;
        this.currentCommitId = commitId;
    }
    
    public String getName() { return name; }
    public String getCurrentCommitId() { return currentCommitId; }
    public void setCurrentCommitId(String commitId) { this.currentCommitId = commitId; }
}
```

</details>

### 📄 `Commit.java`

<details>
<summary>📄 Click to view Commit.java</summary>

```java
package com.you.lld.problems.versioncontrol;
import java.time.LocalDateTime;
import java.util.*;

public class Commit {
    private final String commitId;
    private final String message;
    private final String author;
    private final LocalDateTime timestamp;
    private final Map<String, String> files; // filename -> content
    private String parentCommitId;
    
    public Commit(String commitId, String message, String author, Map<String, String> files) {
        this.commitId = commitId;
        this.message = message;
        this.author = author;
        this.files = new HashMap<>(files);
        this.timestamp = LocalDateTime.now();
    }
    
    public String getCommitId() { return commitId; }
    public String getMessage() { return message; }
    public Map<String, String> getFiles() { return new HashMap<>(files); }
    public void setParentCommitId(String parentId) { this.parentCommitId = parentId; }
}
```

</details>

### 📄 `Demo.java`

<details>
<summary>📄 Click to view Demo.java</summary>

```java
package com.you.lld.problems.versioncontrol;
public class Demo { public static void main(String[] args) { System.out.println("Version Control"); } }```

</details>

### 📄 `VersionControl.java`

<details>
<summary>📄 Click to view VersionControl.java</summary>

```java
package com.you.lld.problems.versioncontrol;
import java.util.*;

public class VersionControl {
    private final Map<String, Commit> commits;
    private final Map<String, Branch> branches;
    private Branch currentBranch;
    
    public VersionControl() {
        this.commits = new HashMap<>();
        this.branches = new HashMap<>();
        
        // Create initial commit and master branch
        Commit initialCommit = new Commit("init", "Initial commit", "system", new HashMap<>());
        commits.put(initialCommit.getCommitId(), initialCommit);
        
        Branch master = new Branch("master", initialCommit.getCommitId());
        branches.put("master", master);
        currentBranch = master;
    }
    
    public String commit(String message, String author, Map<String, String> files) {
        String commitId = UUID.randomUUID().toString();
        Commit commit = new Commit(commitId, message, author, files);
        commit.setParentCommitId(currentBranch.getCurrentCommitId());
        commits.put(commitId, commit);
        currentBranch.setCurrentCommitId(commitId);
        return commitId;
    }
    
    public void createBranch(String branchName) {
        String currentCommitId = currentBranch.getCurrentCommitId();
        branches.put(branchName, new Branch(branchName, currentCommitId));
    }
    
    public void checkout(String branchName) {
        Branch branch = branches.get(branchName);
        if (branch != null) {
            currentBranch = branch;
        }
    }
}
```

</details>

### 📄 `VersionControlDemo.java`

<details>
<summary>📄 Click to view VersionControlDemo.java</summary>

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

### 📄 `api/VersionControl.java`

<details>
<summary>📄 Click to view api/VersionControl.java</summary>

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

### 📄 `impl/VersionControlImpl.java`

<details>
<summary>📄 Click to view impl/VersionControlImpl.java</summary>

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

### 📄 `model/Branch.java`

<details>
<summary>📄 Click to view model/Branch.java</summary>

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

### 📄 `model/Commit.java`

<details>
<summary>📄 Click to view model/Commit.java</summary>

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

### 📄 `model/Repository.java`

<details>
<summary>📄 Click to view model/Repository.java</summary>

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

