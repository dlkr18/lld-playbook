package com.you.lld.problems.urlshortener;

/**
 * Exception thrown when a custom alias is already taken.
 */
public class AliasUnavailableException extends RuntimeException {
    
    public AliasUnavailableException(String message) {
        super(message);
    }
    
    public AliasUnavailableException(String message, Throwable cause) {
        super(message, cause);
    }
}

