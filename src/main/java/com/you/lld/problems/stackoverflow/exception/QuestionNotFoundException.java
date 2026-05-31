package com.you.lld.problems.stackoverflow.exception;

public class QuestionNotFoundException extends StackOverflowException {
    public QuestionNotFoundException(long questionId) {
        super("Question not found: " + questionId);
    }
}
