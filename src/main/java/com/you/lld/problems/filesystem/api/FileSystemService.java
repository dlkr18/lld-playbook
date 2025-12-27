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

