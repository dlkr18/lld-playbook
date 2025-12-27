# In-Memory File System

## Overview
Unix-like file system supporting directories, files, paths, and basic operations (ls, mkdir, touch, rm).

## Key Operations
```java
public void mkdir(String path) {
    String[] parts = path.split("/");
    Directory current = root;
    
    for (String part : parts) {
        if (part.isEmpty()) continue;
        if (!current.hasChild(part)) {
            current.addChild(part, new Directory(part));
        }
        current = (Directory) current.getChild(part);
    }
}

public void touch(String path) {
    String[] parts = path.split("/");
    String filename = parts[parts.length - 1];
    String dirPath = path.substring(0, path.lastIndexOf('/'));
    
    Directory dir = navigateTo(dirPath);
    dir.addChild(filename, new File(filename));
}
```

## Source Code
📄 **[View Complete Source Code](/problems/filesystem/CODE)**
