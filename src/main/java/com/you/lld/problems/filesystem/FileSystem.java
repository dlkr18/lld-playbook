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
