package com.you.lld.problems.ministore.model.exceptions;

/** Base for all domain errors in the mini-store. Unchecked to keep the demo/API clean. */
public class StoreException extends RuntimeException {
    public StoreException(String message) { super(message); }
}
