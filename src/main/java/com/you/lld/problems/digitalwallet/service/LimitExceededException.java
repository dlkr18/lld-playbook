package com.you.lld.problems.digitalwallet.service;

/** Thrown by a {@link TransferPolicy} when a transfer breaches a configured limit. */
public class LimitExceededException extends RuntimeException {
    private static final long serialVersionUID = 1L;

    public LimitExceededException(String message) {
        super(message);
    }
}
