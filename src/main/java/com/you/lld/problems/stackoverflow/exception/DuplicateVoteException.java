package com.you.lld.problems.stackoverflow.exception;

public class DuplicateVoteException extends StackOverflowException {
    public DuplicateVoteException() {
        super("Already voted with this vote type");
    }
}
