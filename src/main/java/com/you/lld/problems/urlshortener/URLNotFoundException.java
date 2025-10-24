package com.you.lld.problems.urlshortener;

/**
 * Exception thrown when a short code is not found in the system.
 */
public class URLNotFoundException extends RuntimeException {
    
    public URLNotFoundException(String message) {
        super(message);
    }
    
    public URLNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}

