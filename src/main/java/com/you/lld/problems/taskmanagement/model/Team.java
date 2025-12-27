package com.you.lld.problems.taskmanagement.model;

import java.time.LocalDateTime;
import java.util.*;

/**
 * Represents a team of users working on related tasks.
 */
public class Team {
    private final String id;
    private String name;
    private String description;
    private Set<String> memberIds;
    private String managerId;
    private LocalDateTime createdAt;
    
    public Team(String id, String name) {
        this.id = id;
        this.name = name;
        this.memberIds = new HashSet<>();
        this.createdAt = LocalDateTime.now();
    }
    
    public String getId() {
        return id;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public Set<String> getMemberIds() {
        return new HashSet<>(memberIds);
    }
    
    public void addMember(String userId) {
        memberIds.add(userId);
    }
    
    public void removeMember(String userId) {
        memberIds.remove(userId);
        if (userId.equals(managerId)) {
            managerId = null;
        }
    }
    
    public String getManagerId() {
        return managerId;
    }
    
    public void setManagerId(String managerId) {
        if (memberIds.contains(managerId)) {
            this.managerId = managerId;
        }
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public int getMemberCount() {
        return memberIds.size();
    }
}


