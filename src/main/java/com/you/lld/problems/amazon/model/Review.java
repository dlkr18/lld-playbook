package com.you.lld.problems.amazon.model;

import java.time.LocalDateTime;

public class Review {
    private final String id;
    private final String productId;
    private final String userId;
    private final String userName;
    private final int rating;
    private final String title;
    private final String content;
    private final LocalDateTime createdAt;
    private int helpfulCount;
    private boolean verified;
    
    public Review(String id, String productId, String userId, String userName,
                  int rating, String title, String content) {
        if (rating < 1 || rating > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5");
        }
        
        this.id = id;
        this.productId = productId;
        this.userId = userId;
        this.userName = userName;
        this.rating = rating;
        this.title = title;
        this.content = content;
        this.createdAt = LocalDateTime.now();
        this.helpfulCount = 0;
        this.verified = false;
    }
    
    public void markVerified() {
        this.verified = true;
    }
    
    public void incrementHelpful() {
        this.helpfulCount++;
    }
    
    public String getId() { return id; }
    public String getProductId() { return productId; }
    public String getUserId() { return userId; }
    public String getUserName() { return userName; }
    public int getRating() { return rating; }
    public String getTitle() { return title; }
    public String getContent() { return content; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public int getHelpfulCount() { return helpfulCount; }
    public boolean isVerified() { return verified; }
    
    @Override
    public String toString() {
        return "Review{id='" + id + "', rating=" + rating + ", verified=" + verified + 
               ", helpful=" + helpfulCount + "}";
    }
}
