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
    
    public Course(String id, String title) {
        this.id = id;
        this.title = title;
        this.lessons = new ArrayList<>();
        this.createdAt = LocalDateTime.now();
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
}
