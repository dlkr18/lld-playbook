package com.you.lld.problems.stackoverflow.model;

import java.time.LocalDateTime;
import java.util.*;

/**
 * Represents a question posted by a user.
 * 
 * <p>Aggregate Root for the Question aggregate. Contains the question content,
 * metadata, and manages the collection of answers. Enforces business rules
 * around question lifecycle, answer acceptance, and voting.
 * 
 * <p>Key invariants:
 * <ul>
 *   <li>Title must be 15-150 characters</li>
 *   <li>Body must be at least 30 characters</li>
 *   <li>Must have 1-5 tags</li>
 *   <li>Only author can accept answer</li>
 *   <li>Can only accept one answer</li>
 *   <li>Cannot accept answer if question is closed</li>
 * </ul>
 */
public class Question {
    private final QuestionId id;
    private String title;
    private String body;
    private final UserId authorId;
    private final Set<Tag> tags;
    private int voteCount;
    private int viewCount;
    private QuestionStatus status;
    private AnswerId acceptedAnswerId;
    private final LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    /**
     * Creates a new question.
     * 
     * @param id unique question identifier
     * @param title question title (15-150 chars)
     * @param body question body (min 30 chars)
     * @param authorId question author
     * @param tags list of tags (1-5 tags)
     */
    public Question(QuestionId id, String title, String body, UserId authorId, Set<Tag> tags) {
        this.id = Objects.requireNonNull(id, "QuestionId cannot be null");
        this.title = validateTitle(title);
        this.body = validateBody(body);
        this.authorId = Objects.requireNonNull(authorId, "Author ID cannot be null");
        this.tags = validateTags(tags);
        this.voteCount = 0;
        this.viewCount = 0;
        this.status = QuestionStatus.OPEN;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    /**
     * Edits the question title and body.
     * Only allowed if question is not closed.
     * 
     * @param newTitle new title
     * @param newBody new body
     * @throws IllegalStateException if question is closed or deleted
     */
    public void edit(String newTitle, String newBody) {
        if (status != QuestionStatus.OPEN) {
            throw new IllegalStateException("Cannot edit closed or deleted question");
        }
        this.title = validateTitle(newTitle);
        this.body = validateBody(newBody);
        this.updatedAt = LocalDateTime.now();
    }
    
    /**
     * Accepts an answer as the best answer.
     * 
     * @param answerId the answer to accept
     * @throws IllegalStateException if question is closed
     */
    public void acceptAnswer(AnswerId answerId) {
        if (status == QuestionStatus.CLOSED) {
            throw new IllegalStateException("Cannot accept answer on closed question");
        }
        this.acceptedAnswerId = answerId;
        this.updatedAt = LocalDateTime.now();
    }
    
    /**
     * Unaccepts the currently accepted answer.
     */
    public void unacceptAnswer() {
        this.acceptedAnswerId = null;
        this.updatedAt = LocalDateTime.now();
    }
    
    /**
     * Applies a vote to the question.
     * 
     * @param vote vote value (+1 for upvote, -1 for downvote)
     */
    public void applyVote(int vote) {
        this.voteCount += vote;
        this.updatedAt = LocalDateTime.now();
    }
    
    /**
     * Increments the view count.
     */
    public void incrementViews() {
        this.viewCount++;
    }
    
    /**
     * Closes the question.
     */
    public void close() {
        this.status = QuestionStatus.CLOSED;
        this.updatedAt = LocalDateTime.now();
    }
    
    /**
     * Checks if the question has an accepted answer.
     */
    public boolean hasAcceptedAnswer() {
        return acceptedAnswerId != null;
    }
    
    /**
     * Checks if the question is open.
     */
    public boolean isOpen() {
        return status == QuestionStatus.OPEN;
    }
    
    private String validateTitle(String title) {
        if (title == null || title.trim().isEmpty()) {
            throw new IllegalArgumentException("Title cannot be empty");
        }
        String trimmed = title.trim();
        if (trimmed.length() < 15 || trimmed.length() > 150) {
            throw new IllegalArgumentException("Title must be 15-150 characters");
        }
        return trimmed;
    }
    
    private String validateBody(String body) {
        if (body == null || body.trim().isEmpty()) {
            throw new IllegalArgumentException("Body cannot be empty");
        }
        String trimmed = body.trim();
        if (trimmed.length() < 30) {
            throw new IllegalArgumentException("Body must be at least 30 characters");
        }
        return trimmed;
    }
    
    private Set<Tag> validateTags(Set<Tag> tags) {
        if (tags == null || tags.isEmpty()) {
            throw new IllegalArgumentException("Question must have at least one tag");
        }
        if (tags.size() > 5) {
            throw new IllegalArgumentException("Question cannot have more than 5 tags");
        }
        return new HashSet<>(tags);
    }
    
    // Getters
    
    public QuestionId getId() {
        return id;
    }
    
    public String getTitle() {
        return title;
    }
    
    public String getBody() {
        return body;
    }
    
    public UserId getAuthorId() {
        return authorId;
    }
    
    public Set<Tag> getTags() {
        return Collections.unmodifiableSet(tags);
    }
    
    public int getVoteCount() {
        return voteCount;
    }
    
    public int getViewCount() {
        return viewCount;
    }
    
    public QuestionStatus getStatus() {
        return status;
    }
    
    public Optional<AnswerId> getAcceptedAnswerId() {
        return Optional.ofNullable(acceptedAnswerId);
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
        Question question = (Question) o;
        return id.equals(question.id);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
    
    @Override
    public String toString() {
        return "Question{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", votes=" + voteCount +
                ", status=" + status +
                '}';
    }
}

