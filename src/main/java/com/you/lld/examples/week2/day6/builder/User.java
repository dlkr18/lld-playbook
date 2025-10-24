package com.you.lld.examples.week2.day6.builder;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

/**
 * User class demonstrating the Builder pattern.
 * 
 * This example shows how to handle:
 * - Required fields (name, email)
 * - Optional fields (age, phone, address, preferences)
 * - Validation during building
 * - Immutable result object
 * - Fluent API design
 */
public final class User {
    // Required fields
    private final String name;
    private final String email;
    
    // Optional fields
    private final Integer age;
    private final String phone;
    private final String address;
    private final List<String> preferences;
    private final boolean isActive;
    private final LocalDateTime createdAt;
    
    // Private constructor - only accessible through Builder
    private User(Builder builder) {
        this.name = builder.name;
        this.email = builder.email;
        this.age = builder.age;
        this.phone = builder.phone;
        this.address = builder.address;
        this.preferences = builder.preferences != null ? 
            new ArrayList<>(builder.preferences) : new ArrayList<>();
        this.isActive = builder.isActive;
        this.createdAt = builder.createdAt != null ? 
            builder.createdAt : LocalDateTime.now();
    }
    
    // Static method to create builder
    public static Builder builder() {
        return new Builder();
    }
    
    // Getters only - immutable object
    public String getName() { return name; }
    public String getEmail() { return email; }
    public Integer getAge() { return age; }
    public String getPhone() { return phone; }
    public String getAddress() { return address; }
    public List<String> getPreferences() { return new ArrayList<>(preferences); }
    public boolean isActive() { return isActive; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    
    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        User user = (User) obj;
        return isActive == user.isActive &&
               Objects.equals(name, user.name) &&
               Objects.equals(email, user.email) &&
               Objects.equals(age, user.age) &&
               Objects.equals(phone, user.phone) &&
               Objects.equals(address, user.address) &&
               Objects.equals(preferences, user.preferences) &&
               Objects.equals(createdAt, user.createdAt);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(name, email, age, phone, address, preferences, isActive, createdAt);
    }
    
    @Override
    public String toString() {
        return "User{" +
               "name='" + name + '\'' +
               ", email='" + email + '\'' +
               ", age=" + age +
               ", phone='" + phone + '\'' +
               ", address='" + address + '\'' +
               ", preferences=" + preferences +
               ", isActive=" + isActive +
               ", createdAt=" + createdAt +
               '}';
    }
    
    /**
     * Builder class for User construction.
     * Implements fluent interface pattern for readable object creation.
     */
    public static class Builder {
        // Required fields
        private String name;
        private String email;
        
        // Optional fields with default values
        private Integer age;
        private String phone;
        private String address;
        private List<String> preferences;
        private boolean isActive = true; // Default to active
        private LocalDateTime createdAt;
        
        // Private constructor to prevent external instantiation
        private Builder() {}
        
        // Required field setters
        public Builder name(String name) {
            this.name = name;
            return this;
        }
        
        public Builder email(String email) {
            this.email = email;
            return this;
        }
        
        // Optional field setters
        public Builder age(Integer age) {
            this.age = age;
            return this;
        }
        
        public Builder phone(String phone) {
            this.phone = phone;
            return this;
        }
        
        public Builder address(String address) {
            this.address = address;
            return this;
        }
        
        public Builder preferences(List<String> preferences) {
            this.preferences = preferences;
            return this;
        }
        
        public Builder addPreference(String preference) {
            if (this.preferences == null) {
                this.preferences = new ArrayList<>();
            }
            this.preferences.add(preference);
            return this;
        }
        
        public Builder isActive(boolean isActive) {
            this.isActive = isActive;
            return this;
        }
        
        public Builder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }
        
        /**
         * Build the User object with validation.
         * @return Immutable User instance
         * @throws IllegalStateException if required fields are missing or invalid
         */
        public User build() {
            validate();
            return new User(this);
        }
        
        /**
         * Validate builder state before creating User.
         * This is where business rules and constraints are enforced.
         */
        private void validate() {
            if (name == null || name.trim().isEmpty()) {
                throw new IllegalStateException("Name is required and cannot be empty");
            }
            
            if (email == null || email.trim().isEmpty()) {
                throw new IllegalStateException("Email is required and cannot be empty");
            }
            
            // Basic email validation
            if (!email.contains("@") || !email.contains(".")) {
                throw new IllegalStateException("Email must be in valid format");
            }
            
            // Age validation if provided
            if (age != null && (age < 0 || age > 150)) {
                throw new IllegalStateException("Age must be between 0 and 150");
            }
            
            // Phone validation if provided
            if (phone != null && phone.trim().length() < 10) {
                throw new IllegalStateException("Phone number must be at least 10 digits");
            }
        }
    }
}
