package com.you.lld.problems.filesystem.api;

import java.util.List;
import java.util.Optional;

/**
 * Service interface for in-memory file system operations.
 * Supports directories, files, and Unix-style path navigation.
 */
public interface FileSystemService {

    boolean createFile(String path, String content);
    boolean createDirectory(String path);

    Optional<String> readFile(String path);
    boolean writeFile(String path, String content);

    boolean delete(String path);

    List<String> listDirectory(String path);

    boolean move(String sourcePath, String destPath);
    boolean copy(String sourcePath, String destPath);

    boolean exists(String path);
    boolean isDirectory(String path);
    long getFileSize(String path);
}
