package com.you.lld.problems.filesystem;

import com.you.lld.problems.filesystem.exceptions.DirectoryNotEmptyException;
import com.you.lld.problems.filesystem.exceptions.FileAlreadyExistsException;
import com.you.lld.problems.filesystem.exceptions.FileNotFoundException;
import com.you.lld.problems.filesystem.impl.InMemoryFileSystem;

import java.util.List;
import java.util.Optional;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

/**
 * End-to-end demo of In-Memory File System exercising:
 *
 *   1. Composite -- DirectoryEntry holds FileEntry/DirectoryEntry children
 *   2. ReadWriteLock -- concurrent reads, exclusive writes
 *   3. Path normalization -- ".", "..", double slashes
 *   4. Recursive operations -- deep copy, recursive size
 *   5. Error handling -- FileNotFoundException, DirectoryNotEmptyException, FileAlreadyExistsException
 */
public class FileSystemDemo {

    public static void main(String[] args) throws InterruptedException {
        System.out.println("========================================");
        System.out.println("  In-Memory File System -- Full LLD Demo");
        System.out.println("========================================\n");

        InMemoryFileSystem fs = new InMemoryFileSystem();

        demoCreateAndList(fs);
        demoReadAndWrite(fs);
        demoCopyAndMove(fs);
        demoRecursiveSize(fs);
        demoPathNormalization(fs);
        demoErrorHandling(fs);
        demoConcurrentAccess(fs);

        System.out.println("========================================");
        System.out.println("  All demos completed.");
        System.out.println("========================================");
    }

    // ──────────── Demo 1: Create directories and files ────────────

    private static void demoCreateAndList(InMemoryFileSystem fs) {
        System.out.println("--- Demo 1: Create & List (Composite tree) ---\n");

        fs.createDirectory("/home");
        fs.createDirectory("/home/alice");
        fs.createDirectory("/home/bob");
        fs.createDirectory("/tmp");

        fs.createFile("/home/alice/readme.txt", "Hello from Alice!");
        fs.createFile("/home/alice/notes.txt", "Some notes here.");
        fs.createFile("/home/bob/data.csv", "name,age\nBob,30");
        fs.createFile("/tmp/temp.log", "Log entry 1\nLog entry 2");

        System.out.println("ls /          : " + fs.listDirectory("/"));
        System.out.println("ls /home      : " + fs.listDirectory("/home"));
        System.out.println("ls /home/alice: " + fs.listDirectory("/home/alice"));
        System.out.println("ls /home/bob  : " + fs.listDirectory("/home/bob"));
        System.out.println();
    }

    // ──────────── Demo 2: Read and Write ────────────

    private static void demoReadAndWrite(InMemoryFileSystem fs) {
        System.out.println("--- Demo 2: Read & Write ---\n");

        Optional<String> content = fs.readFile("/home/alice/readme.txt");
        System.out.println("cat /home/alice/readme.txt: " + content.orElse("NOT FOUND"));

        fs.writeFile("/home/alice/readme.txt", "Updated content!");
        System.out.println("After write: " + fs.readFile("/home/alice/readme.txt").orElse(""));
        System.out.println();
    }

    // ──────────── Demo 3: Copy (deep) and Move ────────────

    private static void demoCopyAndMove(InMemoryFileSystem fs) {
        System.out.println("--- Demo 3: Copy (deep) & Move ---\n");

        // Copy a file
        fs.copy("/home/alice/readme.txt", "/tmp/readme_backup.txt");
        System.out.println("cp file -> /tmp/readme_backup.txt: "
            + fs.readFile("/tmp/readme_backup.txt").orElse("FAIL"));

        // Deep copy a directory (recursive)
        fs.copy("/home/alice", "/tmp/alice_copy");
        System.out.println("cp -r /home/alice -> /tmp/alice_copy");
        System.out.println("ls /tmp/alice_copy: " + fs.listDirectory("/tmp/alice_copy"));
        System.out.println("cat /tmp/alice_copy/notes.txt: "
            + fs.readFile("/tmp/alice_copy/notes.txt").orElse("FAIL"));

        // Move a file
        fs.move("/home/alice/notes.txt", "/home/bob/notes.txt");
        System.out.println("mv notes.txt alice -> bob");
        System.out.println("exists /home/alice/notes.txt: " + fs.exists("/home/alice/notes.txt"));
        System.out.println("exists /home/bob/notes.txt:   " + fs.exists("/home/bob/notes.txt"));
        System.out.println();
    }

    // ──────────── Demo 4: Recursive size ────────────

    private static void demoRecursiveSize(InMemoryFileSystem fs) {
        System.out.println("--- Demo 4: Recursive Size (Composite) ---\n");

        System.out.println("size /tmp/temp.log    : " + fs.getFileSize("/tmp/temp.log") + " bytes");
        System.out.println("size /home (recursive): " + fs.getFileSize("/home") + " bytes");
        System.out.println("size /tmp  (recursive): " + fs.getFileSize("/tmp") + " bytes");
        System.out.println();
    }

    // ──────────── Demo 5: Path normalization ────────────

    private static void demoPathNormalization(InMemoryFileSystem fs) {
        System.out.println("--- Demo 5: Path Normalization ---\n");

        System.out.println("/home/alice/./readme.txt exists: "
            + fs.exists("/home/alice/./readme.txt"));
        System.out.println("/home/bob/../alice/readme.txt exists: "
            + fs.exists("/home/bob/../alice/readme.txt"));
        System.out.println("//home///alice//readme.txt exists: "
            + fs.exists("//home///alice//readme.txt"));
        System.out.println();
    }

    // ──────────── Demo 6: Error handling ────────────

    private static void demoErrorHandling(InMemoryFileSystem fs) {
        System.out.println("--- Demo 6: Error Handling ---\n");

        try {
            fs.createFile("/nonexistent/foo.txt", "data");
        } catch (FileNotFoundException e) {
            System.out.println("FileNotFoundException: " + e.getMessage());
        }

        try {
            fs.createFile("/home/alice/readme.txt", "duplicate");
        } catch (FileAlreadyExistsException e) {
            System.out.println("FileAlreadyExistsException: " + e.getMessage());
        }

        try {
            fs.delete("/home/bob");
        } catch (DirectoryNotEmptyException e) {
            System.out.println("DirectoryNotEmptyException: " + e.getMessage());
        }

        boolean rootDeleted = fs.delete("/");
        System.out.println("Cannot delete root: " + !rootDeleted);
        System.out.println();
    }

    // ──────────── Demo 7: Concurrent access ────────────

    private static void demoConcurrentAccess(InMemoryFileSystem fs) throws InterruptedException {
        System.out.println("--- Demo 7: Concurrent Access (ReadWriteLock) ---\n");

        fs.createDirectory("/concurrent");
        ExecutorService exec = Executors.newFixedThreadPool(4);

        for (int i = 0; i < 10; i++) {
            final int idx = i;
            exec.submit(() -> {
                fs.createFile("/concurrent/file_" + idx + ".txt", "content " + idx);
            });
        }

        exec.shutdown();
        exec.awaitTermination(5, TimeUnit.SECONDS);

        List<String> files = fs.listDirectory("/concurrent");
        System.out.println("Created " + files.size() + " files concurrently: " + files);
        System.out.println();
    }
}
