package com.you.lld.examples.day2.refactoring.after;

/**
 * GOOD EXAMPLE: Domain Entity
 * 
 * Follows SOLID principles:
 * - Single Responsibility: Represents user data and behavior
 * - Open/Closed: Can extend without modification
 * 
 * Follows GRASP principles:
 * - Information Expert: Knows its own data
 * - High Cohesion: All methods relate to user concept
 * 
 * Design characteristics:
 * - Immutable: Cannot be changed after creation
 * - Value semantics: Equality based on content
 * - Domain-focused: Represents business concept
 */
public class User {
    private final String id;
    private final String name;
    private final String email;
    private final String hashedPassword;
    
    public User(String id, String name, String email, String hashedPassword) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.hashedPassword = hashedPassword;
    }
    
    // Getters only - immutable
    public String getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getHashedPassword() { return hashedPassword; }
    
    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        User user = (User) obj;
        return id.equals(user.id);
    }
    
    @Override
    public int hashCode() {
        return id.hashCode();
    }
    
    @Override
    public String toString() {
        return "User{id='" + id + "', name='" + name + "', email='" + email + "'}";
    }
}

