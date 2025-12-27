# filesystem - Complete Implementation

## 📁 Project Structure (10 files)

```
filesystem/
├── FileNode.java
├── FileSystem.java
├── exceptions/AccessDeniedException.java
├── exceptions/DiskFullException.java
├── exceptions/FileNotFoundException.java
├── model/Directory.java
├── model/File.java
├── model/FileMetadata.java
├── model/FileType.java
├── model/Permission.java
```

## 📝 Source Code

### 📄 `FileNode.java`

```java
package com.you.lld.problems.filesystem;
import java.time.LocalDateTime;

public class FileNode {
    private final String name;
    private boolean isDirectory;
    private String content;
    private LocalDateTime created;
    
    public FileNode(String name, boolean isDirectory) {
        this.name = name;
        this.isDirectory = isDirectory;
        this.content = "";
        this.created = LocalDateTime.now();
    }
    
    public String getName() { return name; }
    public boolean isDirectory() { return isDirectory; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
}
```

### 📄 `FileSystem.java`

```java
package com.you.lld.problems.filesystem;
import java.util.*;

public class FileSystem {
    private final Map<String, FileNode> files; // path -> node
    
    public FileSystem() {
        this.files = new HashMap<>();
        files.put("/", new FileNode("/", true));
    }
    
    public boolean createFile(String path, String content) {
        if (files.containsKey(path)) return false;
        FileNode file = new FileNode(getFileName(path), false);
        file.setContent(content);
        files.put(path, file);
        return true;
    }
    
    public boolean createDirectory(String path) {
        if (files.containsKey(path)) return false;
        files.put(path, new FileNode(getFileName(path), true));
        return true;
    }
    
    public String readFile(String path) {
        FileNode node = files.get(path);
        return node != null && !node.isDirectory() ? node.getContent() : null;
    }
    
    public List<String> listDirectory(String path) {
        List<String> contents = new ArrayList<>();
        for (String filePath : files.keySet()) {
            if (filePath.startsWith(path) && !filePath.equals(path)) {
                contents.add(filePath);
            }
        }
        return contents;
    }
    
    private String getFileName(String path) {
        return path.substring(path.lastIndexOf('/') + 1);
    }
}
```

### 📄 `exceptions/AccessDeniedException.java`

```java
package com.you.lld.problems.filesystem.exceptions;
public class AccessDeniedException extends RuntimeException { public AccessDeniedException(String m) { super(m); } }```

### 📄 `exceptions/DiskFullException.java`

```java
package com.you.lld.problems.filesystem.exceptions;
public class DiskFullException extends RuntimeException { public DiskFullException(String m) { super(m); } }```

### 📄 `exceptions/FileNotFoundException.java`

```java
package com.you.lld.problems.filesystem.exceptions;
public class FileNotFoundException extends RuntimeException { public FileNotFoundException(String m) { super(m); } }```

### 📄 `model/Directory.java`

```java
package com.you.lld.problems.filesystem.model;
import java.util.*;
public
class Directory  {
    private String directoryId;
    public Directory(String id)  {
        directoryId=id;
    }
    public String getDirectoryId()  {
        return directoryId;
    }
}
```

### 📄 `model/File.java`

```java
package com.you.lld.problems.filesystem.model;
import java.util.*;
public class File { private String fileId; public File(String id) { fileId=id; } public String getFileId() { return fileId; } }```

### 📄 `model/FileMetadata.java`

```java
package com.you.lld.problems.filesystem.model;
import java.util.*;
public
class FileMetadata  {
    private String filemetadataId;
    public FileMetadata(String id)  {
        filemetadataId=id;
    }
    public String getFileMetadataId()  {
        return filemetadataId;
    }
}
```

### 📄 `model/FileType.java`

```java
package com.you.lld.problems.filesystem.model;
public enum FileType { ACTIVE, INACTIVE, PENDING, COMPLETED }```

### 📄 `model/Permission.java`

```java
package com.you.lld.problems.filesystem.model;
import java.util.*;
public
class Permission  {
    private String permissionId;
    public Permission(String id)  {
        permissionId=id;
    }
    public String getPermissionId()  {
        return permissionId;
    }
}
```

