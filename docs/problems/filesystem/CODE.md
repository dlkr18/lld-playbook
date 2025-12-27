# Source Code

This page contains the complete source code for this problem.

## 📁 Directory Structure

```
├── FileNode.java
├── FileSystem.java
├── api/FileSystemService.java
├── exceptions/AccessDeniedException.java
├── exceptions/DirectoryNotEmptyException.java
├── exceptions/DiskFullException.java
├── exceptions/FileNotFoundException.java
├── impl/InMemoryFileSystem.java
├── model/Directory.java
├── model/File.java
├── model/FileMetadata.java
├── model/FileType.java
├── model/Permission.java
```

<details>
<summary>📄 <strong>FileNode.java</strong> - Click to expand</summary>

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

</details>

<details>
<summary>📄 <strong>FileSystem.java</strong> - Click to expand</summary>

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

</details>

<details>
<summary>📄 <strong>api/FileSystemService.java</strong> - Click to expand</summary>

```java
package com.you.lld.problems.filesystem.api;

import com.you.lld.problems.filesystem.FileNode;

import java.util.List;
import java.util.Optional;

/**
 * Service interface for in-memory file system operations.
 * Supports directories, files, and path-based navigation.
 */
public interface FileSystemService {
    
    /**
     * Creates a new file at the specified path with content.
     * 
     * @param path Full path to the file
     * @param content File content
     * @return true if created successfully
     */
    boolean createFile(String path, String content);
    
    /**
     * Creates a new directory at the specified path.
     * 
     * @param path Full path to the directory
     * @return true if created successfully
     */
    boolean createDirectory(String path);
    
    /**
     * Reads the content of a file.
     * 
     * @param path Full path to the file
     * @return Optional containing file content if exists
     */
    Optional<String> readFile(String path);
    
    /**
     * Writes content to an existing file.
     * 
     * @param path Full path to the file
     * @param content New content
     * @return true if written successfully
     */
    boolean writeFile(String path, String content);
    
    /**
     * Deletes a file or directory.
     * 
     * @param path Full path to delete
     * @return true if deleted successfully
     */
    boolean delete(String path);
    
    /**
     * Lists all files and directories in a directory.
     * 
     * @param path Directory path
     * @return List of file/directory names
     */
    List<String> listDirectory(String path);
    
    /**
     * Moves a file or directory to a new location.
     * 
     * @param sourcePath Source path
     * @param destPath Destination path
     * @return true if moved successfully
     */
    boolean move(String sourcePath, String destPath);
    
    /**
     * Copies a file or directory to a new location.
     * 
     * @param sourcePath Source path
     * @param destPath Destination path
     * @return true if copied successfully
     */
    boolean copy(String sourcePath, String destPath);
    
    /**
     * Checks if a path exists.
     * 
     * @param path Path to check
     * @return true if exists
     */
    boolean exists(String path);
    
    /**
     * Checks if a path is a directory.
     * 
     * @param path Path to check
     * @return true if is directory
     */
    boolean isDirectory(String path);
    
    /**
     * Gets the size of a file in bytes.
     * 
     * @param path File path
     * @return File size, or -1 if not found
     */
    long getFileSize(String path);
}


```

</details>

<details>
<summary>📄 <strong>exceptions/AccessDeniedException.java</strong> - Click to expand</summary>

```java
package com.you.lld.problems.filesystem.exceptions;
public class AccessDeniedException extends RuntimeException { public AccessDeniedException(String m) { super(m); } }```

</details>

<details>
<summary>📄 <strong>exceptions/DirectoryNotEmptyException.java</strong> - Click to expand</summary>

```java
package com.you.lld.problems.filesystem.exceptions;

/**
 * Exception thrown when attempting to delete a non-empty directory.
 */
public class DirectoryNotEmptyException extends RuntimeException {
    public DirectoryNotEmptyException(String message) {
        super(message);
    }
}


```

</details>

<details>
<summary>📄 <strong>exceptions/DiskFullException.java</strong> - Click to expand</summary>

```java
package com.you.lld.problems.filesystem.exceptions;
public class DiskFullException extends RuntimeException { public DiskFullException(String m) { super(m); } }```

</details>

<details>
<summary>📄 <strong>exceptions/FileNotFoundException.java</strong> - Click to expand</summary>

```java
package com.you.lld.problems.filesystem.exceptions;
public class FileNotFoundException extends RuntimeException { public FileNotFoundException(String m) { super(m); } }```

</details>

<details>
<summary>📄 <strong>impl/InMemoryFileSystem.java</strong> - Click to expand</summary>

```java
package com.you.lld.problems.filesystem.impl;

import com.you.lld.problems.filesystem.FileNode;
import com.you.lld.problems.filesystem.api.FileSystemService;
import com.you.lld.problems.filesystem.exceptions.FileNotFoundException;
import com.you.lld.problems.filesystem.exceptions.DirectoryNotEmptyException;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Thread-safe in-memory file system implementation.
 */
public class InMemoryFileSystem implements FileSystemService {
    
    private final Map<String, FileNode> files;
    private final Map<String, Set<String>> directories; // path -> children paths
    
    public InMemoryFileSystem() {
        this.files = new ConcurrentHashMap<>();
        this.directories = new ConcurrentHashMap<>();
        files.put("/", new FileNode("/", true));
        directories.put("/", ConcurrentHashMap.newKeySet());
    }
    
    @Override
    public boolean createFile(String path, String content) {
        if (files.containsKey(path)) {
            return false;
        }
        
        String fileName = getFileName(path);
        FileNode file = new FileNode(fileName, false);
        file.setContent(content);
        files.put(path, file);
        
        String parentPath = getParentPath(path);
        directories.computeIfAbsent(parentPath, k -> ConcurrentHashMap.newKeySet()).add(path);
        
        return true;
    }
    
    @Override
    public boolean createDirectory(String path) {
        if (files.containsKey(path)) {
            return false;
        }
        
        String dirName = getFileName(path);
        FileNode dir = new FileNode(dirName, true);
        files.put(path, dir);
        directories.put(path, ConcurrentHashMap.newKeySet());
        
        String parentPath = getParentPath(path);
        directories.computeIfAbsent(parentPath, k -> ConcurrentHashMap.newKeySet()).add(path);
        
        return true;
    }
    
    @Override
    public Optional<String> readFile(String path) {
        FileNode file = files.get(path);
        if (file == null || file.isDirectory()) {
            return Optional.empty();
        }
        return Optional.ofNullable(file.getContent());
    }
    
    @Override
    public boolean writeFile(String path, String content) {
        FileNode file = files.get(path);
        if (file == null || file.isDirectory()) {
            return false;
        }
        file.setContent(content);
        return true;
    }
    
    @Override
    public boolean delete(String path) {
        if ("/".equals(path)) {
            return false; // Cannot delete root
        }
        
        FileNode node = files.get(path);
        if (node == null) {
            return false;
        }
        
        if (node.isDirectory()) {
            Set<String> children = directories.get(path);
            if (children != null && !children.isEmpty()) {
                throw new DirectoryNotEmptyException("Directory is not empty: " + path);
            }
            directories.remove(path);
        }
        
        files.remove(path);
        
        String parentPath = getParentPath(path);
        Set<String> siblings = directories.get(parentPath);
        if (siblings != null) {
            siblings.remove(path);
        }
        
        return true;
    }
    
    @Override
    public List<String> listDirectory(String path) {
        if (!files.containsKey(path) || !files.get(path).isDirectory()) {
            return new ArrayList<>();
        }
        
        Set<String> children = directories.get(path);
        if (children == null) {
            return new ArrayList<>();
        }
        
        List<String> result = new ArrayList<>();
        for (String childPath : children) {
            result.add(getFileName(childPath));
        }
        return result;
    }
    
    @Override
    public boolean move(String sourcePath, String destPath) {
        if (!files.containsKey(sourcePath) || files.containsKey(destPath)) {
            return false;
        }
        
        FileNode node = files.remove(sourcePath);
        files.put(destPath, node);
        
        // Update parent directories
        String sourceParent = getParentPath(sourcePath);
        String destParent = getParentPath(destPath);
        
        Set<String> sourceChildren = directories.get(sourceParent);
        if (sourceChildren != null) {
            sourceChildren.remove(sourcePath);
        }
        
        directories.computeIfAbsent(destParent, k -> ConcurrentHashMap.newKeySet()).add(destPath);
        
        return true;
    }
    
    @Override
    public boolean copy(String sourcePath, String destPath) {
        FileNode sourceNode = files.get(sourcePath);
        if (sourceNode == null || files.containsKey(destPath)) {
            return false;
        }
        
        String fileName = getFileName(destPath);
        FileNode newNode = new FileNode(fileName, sourceNode.isDirectory());
        if (!sourceNode.isDirectory()) {
            newNode.setContent(sourceNode.getContent());
        }
        files.put(destPath, newNode);
        
        String destParent = getParentPath(destPath);
        directories.computeIfAbsent(destParent, k -> ConcurrentHashMap.newKeySet()).add(destPath);
        
        return true;
    }
    
    @Override
    public boolean exists(String path) {
        return files.containsKey(path);
    }
    
    @Override
    public boolean isDirectory(String path) {
        FileNode node = files.get(path);
        return node != null && node.isDirectory();
    }
    
    @Override
    public long getFileSize(String path) {
        FileNode node = files.get(path);
        if (node == null || node.isDirectory()) {
            return -1;
        }
        String content = node.getContent();
        return content != null ? content.length() : 0;
    }
    
    private String getFileName(String path) {
        if ("/".equals(path)) {
            return "/";
        }
        int lastSlash = path.lastIndexOf('/');
        return path.substring(lastSlash + 1);
    }
    
    private String getParentPath(String path) {
        if ("/".equals(path)) {
            return null;
        }
        int lastSlash = path.lastIndexOf('/');
        if (lastSlash == 0) {
            return "/";
        }
        return path.substring(0, lastSlash);
    }
}


```

</details>

<details>
<summary>📄 <strong>model/Directory.java</strong> - Click to expand</summary>

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

</details>

<details>
<summary>📄 <strong>model/File.java</strong> - Click to expand</summary>

```java
package com.you.lld.problems.filesystem.model;
import java.util.*;
public class File { private String fileId; public File(String id) { fileId=id; } public String getFileId() { return fileId; } }```

</details>

<details>
<summary>📄 <strong>model/FileMetadata.java</strong> - Click to expand</summary>

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

</details>

<details>
<summary>📄 <strong>model/FileType.java</strong> - Click to expand</summary>

```java
package com.you.lld.problems.filesystem.model;
public enum FileType { ACTIVE, INACTIVE, PENDING, COMPLETED }```

</details>

<details>
<summary>📄 <strong>model/Permission.java</strong> - Click to expand</summary>

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

</details>

