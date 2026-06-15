package com.you.lld.problems.urlshortener.model;

public class URLNotFoundException extends RuntimeException {

    public URLNotFoundException(String message) {
        super(message);
    }
}
