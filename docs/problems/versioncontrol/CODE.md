# Version Control System

## Difficulty: Hard | Pattern: Command, Memento

```java
class VersionControl {
    private Map<String, Repository> repositories;
    
    void commit(String repoId, Commit commit);
    void checkout(String repoId, String commitId);
    void merge(String repoId, String branch1, String branch2);
}

class Commit {
    String id, message, author;
    Map<String, FileSnapshot> files;
}
```

**Status**: ✅ Documented
