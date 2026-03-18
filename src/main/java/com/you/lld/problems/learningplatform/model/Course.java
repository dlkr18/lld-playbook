package com.you.lld.problems.learningplatform.model;

import java.time.LocalDateTime;
import java.util.*;

/**
 * Represents a course in the learning platform.
 */
public class Course {
    private final String id;
    private String title;
    private String description;
    private String instructorId;
    private List<Lesson> lessons;
    private LocalDateTime createdAt;
    private int maxCapacity; // -1 means unlimited
    
    public Course(String id, String title) {
        this.id = id;
        this.title = title;
        this.lessons = new ArrayList<>();
        this.createdAt = LocalDateTime.now();
        this.maxCapacity = -1; // unlimited by default
    }
    
    public String getId() {
        return id;
    }
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public String getInstructorId() {
        return instructorId;
    }
    
    public void setInstructorId(String instructorId) {
        this.instructorId = instructorId;
    }
    
    public List<Lesson> getLessons() {
        return new ArrayList<>(lessons);
    }
    
    public void addLesson(Lesson lesson) {
        lessons.add(lesson);
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public int getMaxCapacity() {
        return maxCapacity;
    }
    
    public void setMaxCapacity(int maxCapacity) {
        this.maxCapacity = maxCapacity;
    }
}
