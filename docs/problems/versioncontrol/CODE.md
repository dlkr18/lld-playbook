# Version Control

## 21 Files

### Branch.java
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

### Commit.java
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

### Demo.java
```java
package com.you.lld.problems.versioncontrol;
public class Demo { public static void main(String[] args) { System.out.println("Version Control"); } }
```

### VersionControl.java
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

### Service.java
```java
package com.you.lld.problems.versioncontrol.api;
public interface Service { }
```

### Exception0.java
```java
package com.you.lld.problems.versioncontrol.exceptions;
public class Exception0 extends RuntimeException { public Exception0(String m) { super(m); } }
```

### Exception1.java
```java
package com.you.lld.problems.versioncontrol.exceptions;
public class Exception1 extends RuntimeException { public Exception1(String m) { super(m); } }
```

### Exception2.java
```java
package com.you.lld.problems.versioncontrol.exceptions;
public class Exception2 extends RuntimeException { public Exception2(String m) { super(m); } }
```

### ServiceImpl.java
```java
package com.you.lld.problems.versioncontrol.impl;
import com.you.lld.problems.versioncontrol.api.*;
public class ServiceImpl implements Service { }
```

### Model0.java
```java
package com.you.lld.problems.versioncontrol.model;
public class Model0 { private String id; public Model0(String id) { this.id=id; } }
```

### Model1.java
```java
package com.you.lld.problems.versioncontrol.model;
public class Model1 { private String id; public Model1(String id) { this.id=id; } }
```

### Model10.java
```java
package com.you.lld.problems.versioncontrol.model;
public class Model10 { private String id; public Model10(String id) { this.id=id; } }
```

### Model11.java
```java
package com.you.lld.problems.versioncontrol.model;
public class Model11 { private String id; public Model11(String id) { this.id=id; } }
```

### Model2.java
```java
package com.you.lld.problems.versioncontrol.model;
public class Model2 { private String id; public Model2(String id) { this.id=id; } }
```

### Model3.java
```java
package com.you.lld.problems.versioncontrol.model;
public class Model3 { private String id; public Model3(String id) { this.id=id; } }
```

### Model4.java
```java
package com.you.lld.problems.versioncontrol.model;
public class Model4 { private String id; public Model4(String id) { this.id=id; } }
```

### Model5.java
```java
package com.you.lld.problems.versioncontrol.model;
public class Model5 { private String id; public Model5(String id) { this.id=id; } }
```

### Model6.java
```java
package com.you.lld.problems.versioncontrol.model;
public class Model6 { private String id; public Model6(String id) { this.id=id; } }
```

### Model7.java
```java
package com.you.lld.problems.versioncontrol.model;
public class Model7 { private String id; public Model7(String id) { this.id=id; } }
```

### Model8.java
```java
package com.you.lld.problems.versioncontrol.model;
public class Model8 { private String id; public Model8(String id) { this.id=id; } }
```

### Model9.java
```java
package com.you.lld.problems.versioncontrol.model;
public class Model9 { private String id; public Model9(String id) { this.id=id; } }
```

