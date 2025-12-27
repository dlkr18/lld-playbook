package com.you.lld.problems.filesystem.exceptions;

/**
 * Exception thrown when attempting to delete a non-empty directory.
 */
public class DirectoryNotEmptyException extends RuntimeException {
    public DirectoryNotEmptyException(String message) {
        super(message);
    }
}


