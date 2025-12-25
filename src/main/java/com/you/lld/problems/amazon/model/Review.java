package com.you.lld.problems.amazon.model;
import java.time.LocalDateTime;

public class Review {
    private final String reviewId;
    private final String productId;
    private final String userId;
    private int rating; // 1-5
    private String title;
    private String comment;
    private boolean verified;
    private int helpfulCount;
    private LocalDateTime createdAt;
    
    public Review(String reviewId, String productId, String userId, int rating) {
        if (rating < 1 || rating > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5");
        }
        this.reviewId = reviewId;
        this.productId = productId;
        this.userId = userId;
        this.rating = rating;
        this.verified = false;
        this.helpfulCount = 0;
        this.createdAt = LocalDateTime.now();
    }
    
    public String getReviewId() { return reviewId; }
    public String getProductId() { return productId; }
    public String getUserId() { return userId; }
    public int getRating() { return rating; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }
    public boolean isVerified() { return verified; }
    public void markAsVerified() { this.verified = true; }
    public int getHelpfulCount() { return helpfulCount; }
    public void incrementHelpful() { this.helpfulCount++; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
