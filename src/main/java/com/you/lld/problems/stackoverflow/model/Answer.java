package com.you.lld.problems.stackoverflow.model;

import java.time.LocalDateTime;
import java.util.Objects;

/**
 * Represents an answer to a question.
 * 
 * <p>Entity within the Question aggregate. Contains answer content and metadata.
 * Tracks acceptance status and vote count.
 * 
 * <p>Key invariants:
 * <ul>
 *   <li>Body must be at least 30 characters</li>
 *   <li>Only one answer can be accepted per question</li>
 *   <li>Cannot accept own answer</li>
 * </ul>
 */
public class Answer {
    private final AnswerId id;
    private final QuestionId questionId;
    private String body;
    private final UserId authorId;
    private int voteCount;
    private boolean isAccepted;
    private final LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    /**
     * Creates a new answer.
     * 
     * @param id unique answer identifier
     * @param questionId the question being answered
     * @param body answer body (min 30 chars)
     * @param authorId answer author
     */
    public Answer(AnswerId id, QuestionId questionId, String body, UserId authorId) {
        this.id = Objects.requireNonNull(id, "AnswerId cannot be null");
        this.questionId = Objects.requireNonNull(questionId, "QuestionId cannot be null");
        this.body = validateBody(body);
        this.authorId = Objects.requireNonNull(authorId, "Author ID cannot be null");
        this.voteCount = 0;
        this.isAccepted = false;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    /**
     * Edits the answer body.
     * 
     * @param newBody new answer body
     */
    public void edit(String newBody) {
        this.body = validateBody(newBody);
        this.updatedAt = LocalDateTime.now();
    }
    
    /**
     * Marks this answer as accepted.
     * 
     * @throws IllegalStateException if already accepted
     */
    public void markAsAccepted() {
        if (isAccepted) {
            throw new IllegalStateException("Answer is already accepted");
        }
        this.isAccepted = true;
        this.updatedAt = LocalDateTime.now();
    }
    
    /**
     * Unmarks this answer as accepted.
     */
    public void unmarkAsAccepted() {
        this.isAccepted = false;
        this.updatedAt = LocalDateTime.now();
    }
    
    /**
     * Applies a vote to the answer.
     * 
     * @param vote vote value (+1 for upvote, -1 for downvote)
     */
    public void applyVote(int vote) {
        this.voteCount += vote;
        this.updatedAt = LocalDateTime.now();
    }
    
    private String validateBody(String body) {
        if (body == null || body.trim().isEmpty()) {
            throw new IllegalArgumentException("Answer body cannot be empty");
        }
        String trimmed = body.trim();
        if (trimmed.length() < 30) {
            throw new IllegalArgumentException("Answer body must be at least 30 characters");
        }
        return trimmed;
    }
    
    // Getters
    
    public AnswerId getId() {
        return id;
    }
    
    public QuestionId getQuestionId() {
        return questionId;
    }
    
    public String getBody() {
        return body;
    }
    
    public UserId getAuthorId() {
        return authorId;
    }
    
    public int getVoteCount() {
        return voteCount;
    }
    
    public boolean isAccepted() {
        return isAccepted;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Answer answer = (Answer) o;
        return id.equals(answer.id);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
    
    @Override
    public String toString() {
        return "Answer{" +
                "id=" + id +
                ", questionId=" + questionId +
                ", votes=" + voteCount +
                ", accepted=" + isAccepted +
                '}';
    }
}

