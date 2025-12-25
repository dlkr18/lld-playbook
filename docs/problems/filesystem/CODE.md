# In-Memory File System

## Difficulty: Hard | Pattern: Composite, Command

```java
class FileSystem {
    private Directory root;
    
    void mkdir(String path);
    void createFile(String path, String content);
    String readFile(String path);
}

interface FileSystemNode {
    String getName();
    boolean isDirectory();
}
```

**Status**: ✅ Documented
