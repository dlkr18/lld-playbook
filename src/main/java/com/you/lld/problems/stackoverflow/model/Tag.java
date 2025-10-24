package com.you.lld.problems.stackoverflow.model;

import java.util.Objects;

/**
 * Represents a tag that can be applied to questions.
 * Value object with immutable name and description.
 */
public class Tag {
    private final String name;
    private final String description;
    
    public Tag(String name, String description) {
        this.name = validateName(name);
        this.description = description;
    }
    
    public Tag(String name) {
        this(name, null);
    }
    
    private String validateName(String name) {
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Tag name cannot be empty");
        }
        String trimmed = name.trim().toLowerCase();
        if (trimmed.length() < 2 || trimmed.length() > 35) {
            throw new IllegalArgumentException("Tag name must be 2-35 characters");
        }
        if (!trimmed.matches("^[a-z0-9-]+$")) {
            throw new IllegalArgumentException("Tag name can only contain lowercase letters, numbers, and hyphens");
        }
        return trimmed;
    }
    
    public String getName() {
        return name;
    }
    
    public String getDescription() {
        return description;
    }
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Tag tag = (Tag) o;
        return name.equals(tag.name);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(name);
    }
    
    @Override
    public String toString() {
        return name;
    }
}

