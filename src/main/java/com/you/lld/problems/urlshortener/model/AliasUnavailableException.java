package com.you.lld.problems.urlshortener.model;

public class AliasUnavailableException extends RuntimeException {

    public AliasUnavailableException(String message) {
        super(message);
    }
}
