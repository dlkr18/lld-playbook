package com.you.lld.problems.filesystem;

import com.you.lld.problems.filesystem.impl.InMemoryFileSystem;

import java.util.List;
import java.util.Optional;

/**
 * Demo: In-memory File System with directories, files, copy, move, delete.
 */
public class FileSystemDemo {

    public static void main(String[] args) {
        System.out.println("=== In-Memory File System Demo ===\n");

        InMemoryFileSystem fs = new InMemoryFileSystem();

        // Create directories
        System.out.println("--- Creating directories ---");
        fs.createDirectory("/home");
        fs.createDirectory("/home/alice");
        fs.createDirectory("/home/bob");
        fs.createDirectory("/tmp");
        System.out.println("Directories created: /home, /home/alice, /home/bob, /tmp");

        // Create files
        System.out.println("\n--- Creating files ---");
        fs.createFile("/home/alice/readme.txt", "Hello from Alice!");
        fs.createFile("/home/alice/notes.txt", "Some notes here.");
        fs.createFile("/home/bob/data.csv", "name,age\nBob,30");
        fs.createFile("/tmp/temp.log", "Log entry 1\nLog entry 2");

        // Read files
        System.out.println("\n--- Reading files ---");
        Optional<String> content = fs.readFile("/home/alice/readme.txt");
        System.out.println("/home/alice/readme.txt: " + content.orElse("NOT FOUND"));

        // List directory
        System.out.println("\n--- List /home ---");
        List<String> homeContents = fs.listDirectory("/home");
        for (String item : homeContents) {
            System.out.println("  " + item);
        }

        System.out.println("\n--- List /home/alice ---");
        List<String> aliceContents = fs.listDirectory("/home/alice");
        for (String item : aliceContents) {
            System.out.println("  " + item);
        }

        // Write (overwrite)
        System.out.println("\n--- Write/overwrite ---");
        fs.writeFile("/home/alice/readme.txt", "Updated content!");
        System.out.println("After write: " + fs.readFile("/home/alice/readme.txt").orElse(""));

        // Copy
        System.out.println("\n--- Copy ---");
        fs.copy("/home/alice/readme.txt", "/tmp/readme_backup.txt");
        System.out.println("Copied to /tmp/readme_backup.txt: " + 
            fs.readFile("/tmp/readme_backup.txt").orElse("FAILED"));

        // Move
        System.out.println("\n--- Move ---");
        fs.move("/home/alice/notes.txt", "/home/bob/notes.txt");
        System.out.println("Moved notes.txt from alice to bob");
        System.out.println("Exists /home/alice/notes.txt: " + fs.exists("/home/alice/notes.txt"));
        System.out.println("Exists /home/bob/notes.txt: " + fs.exists("/home/bob/notes.txt"));

        // File size
        System.out.println("\n--- File size ---");
        System.out.println("/tmp/temp.log size: " + fs.getFileSize("/tmp/temp.log") + " bytes");

        // Is directory
        System.out.println("\n--- Type checking ---");
        System.out.println("/home is directory: " + fs.isDirectory("/home"));
        System.out.println("/tmp/temp.log is directory: " + fs.isDirectory("/tmp/temp.log"));

        // Delete
        System.out.println("\n--- Delete ---");
        fs.delete("/tmp/temp.log");
        System.out.println("Deleted /tmp/temp.log, exists: " + fs.exists("/tmp/temp.log"));

        System.out.println("\n=== Demo complete ===");
    }
}
