package com.you.lld.problems.stackoverflow.exception;

public class SelfVoteException extends StackOverflowException {
    public SelfVoteException() {
        super("Cannot vote on your own content");
    }
}
