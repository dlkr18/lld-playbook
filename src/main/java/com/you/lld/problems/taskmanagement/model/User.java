package com.you.lld.problems.taskmanagement.model;

import java.time.LocalDateTime;
import java.util.*;

/**
 * Represents a user in the task management system.
 */
public class User {
    private final String id;
    private String username;
    private String email;
    private String fullName;
    private UserRole role;
    private List<String> teamIds;
    private LocalDateTime createdAt;
    private boolean active;
    
    public User(String id, String username, String email) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.role = UserRole.MEMBER;
        this.teamIds = new ArrayList<>();
        this.createdAt = LocalDateTime.now();
        this.active = true;
    }
    
    // Getters
    public String getId() {
        return id;
    }
    
    public String getUsername() {
        return username;
    }
    
    public void setUsername(String username) {
        this.username = username;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getFullName() {
        return fullName;
    }
    
    public void setFullName(String fullName) {
        this.fullName = fullName;
    }
    
    public UserRole getRole() {
        return role;
    }
    
    public void setRole(UserRole role) {
        this.role = role;
    }
    
    public List<String> getTeamIds() {
        return new ArrayList<>(teamIds);
    }
    
    public void addTeam(String teamId) {
        if (!teamIds.contains(teamId)) {
            teamIds.add(teamId);
        }
    }
    
    public void removeTeam(String teamId) {
        teamIds.remove(teamId);
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public boolean isActive() {
        return active;
    }
    
    public void setActive(boolean active) {
        this.active = active;
    }
}


