package com.you.lld.problems.stackoverflow.model;

/**
 * Represents the lifecycle status of a question.
 */
public enum QuestionStatus {
    /**
     * Question is open and accepting answers.
     */
    OPEN,
    
    /**
     * Question has been closed by author or moderators.
     * No new answers can be posted, but voting and comments still allowed.
     */
    CLOSED,
    
    /**
     * Question has been deleted.
     */
    DELETED
}

