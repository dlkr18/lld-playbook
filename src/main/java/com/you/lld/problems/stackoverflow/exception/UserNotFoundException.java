package com.you.lld.problems.stackoverflow.exception;

public class UserNotFoundException extends StackOverflowException {
    public UserNotFoundException(long userId) {
        super("User not found: " + userId);
    }
}
