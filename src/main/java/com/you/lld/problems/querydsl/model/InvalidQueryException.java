package com.you.lld.problems.querydsl.model;

/** Thrown when a query is structurally invalid at construction/translation time. */
public class InvalidQueryException extends RuntimeException {
    public InvalidQueryException(String message) {
        super(message);
    }
}
