package com.you.lld.problems.stackoverflow.model;

import java.time.LocalDateTime;
import java.util.Objects;

/**
 * Represents a user in the Stack Overflow system.
 * 
 * <p>Aggregate Root for User aggregate. Contains user profile information,
 * reputation, and status. Enforces business rules around username, email,
 * and reputation.
 * 
 * <p>Key invariants:
 * <ul>
 *   <li>Username must be unique and 3-20 characters</li>
 *   <li>Email must be unique and valid format</li>
 *   <li>Reputation cannot be negative</li>
 *   <li>Reputation starts at 1</li>
 * </ul>
 */
public class User {
    private final UserId id;
    private String username;
    private String email;
    private String passwordHash;
    private int reputation;
    private final LocalDateTime createdAt;
    private UserStatus status;
    
    /**
     * Creates a new user.
     * 
     * @param id unique user identifier
     * @param username username (3-20 characters)
     * @param email valid email address
     * @param passwordHash hashed password
     */
    public User(UserId id, String username, String email, String passwordHash) {
        this.id = Objects.requireNonNull(id, "UserId cannot be null");
        this.username = validateUsername(username);
        this.email = validateEmail(email);
        this.passwordHash = Objects.requireNonNull(passwordHash, "Password hash cannot be null");
        this.reputation = 1; // All users start with 1 reputation
        this.createdAt = LocalDateTime.now();
        this.status = UserStatus.ACTIVE;
    }
    
    /**
     * Adds reputation points to the user.
     * 
     * @param points reputation points to add (can be negative)
     */
    public void addReputation(int points) {
        int newReputation = this.reputation + points;
        if (newReputation < 0) {
            this.reputation = 0; // Reputation cannot go below 0
        } else {
            this.reputation = newReputation;
        }
    }
    
    /**
     * Checks if user has sufficient reputation for an action.
     * 
     * @param required required reputation
     * @return true if user has enough reputation
     */
    public boolean hasReputation(int required) {
        return this.reputation >= required;
    }
    
    /**
     * Suspends the user account.
     */
    public void suspend() {
        this.status = UserStatus.SUSPENDED;
    }
    
    /**
     * Activates the user account.
     */
    public void activate() {
        this.status = UserStatus.ACTIVE;
    }
    
    /**
     * Checks if user is active.
     */
    public boolean isActive() {
        return this.status == UserStatus.ACTIVE;
    }
    
    private String validateUsername(String username) {
        if (username == null || username.trim().isEmpty()) {
            throw new IllegalArgumentException("Username cannot be empty");
        }
        String trimmed = username.trim();
        if (trimmed.length() < 3 || trimmed.length() > 20) {
            throw new IllegalArgumentException("Username must be 3-20 characters");
        }
        if (!trimmed.matches("^[a-zA-Z0-9_]+$")) {
            throw new IllegalArgumentException("Username can only contain letters, numbers, and underscores");
        }
        return trimmed;
    }
    
    private String validateEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            throw new IllegalArgumentException("Email cannot be empty");
        }
        String trimmed = email.trim().toLowerCase();
        if (!trimmed.matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
            throw new IllegalArgumentException("Invalid email format");
        }
        return trimmed;
    }
    
    // Getters
    
    public UserId getId() {
        return id;
    }
    
    public String getUsername() {
        return username;
    }
    
    public String getEmail() {
        return email;
    }
    
    public int getReputation() {
        return reputation;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public UserStatus getStatus() {
        return status;
    }
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        User user = (User) o;
        return id.equals(user.id);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
    
    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", username='" + username + '\'' +
                ", reputation=" + reputation +
                ", status=" + status +
                '}';
    }
}

