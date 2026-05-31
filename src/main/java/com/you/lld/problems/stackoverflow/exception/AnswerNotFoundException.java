package com.you.lld.problems.stackoverflow.exception;

public class AnswerNotFoundException extends StackOverflowException {
    public AnswerNotFoundException(long answerId) {
        super("Answer not found: " + answerId);
    }
}
