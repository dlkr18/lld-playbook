package com.you.lld.problems.digitalwallet.service;

/** Thrown when a debit would drive a non-overdraft account below zero. */
public class InsufficientFundsException extends RuntimeException {
    private static final long serialVersionUID = 1L;

    public InsufficientFundsException(String message) {
        super(message);
    }
}
