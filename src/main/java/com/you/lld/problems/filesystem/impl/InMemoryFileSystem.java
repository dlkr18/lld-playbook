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

