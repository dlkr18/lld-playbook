package com.you.lld.problems.taskscheduler.model;

import java.time.LocalDateTime;
import java.util.Objects;

/**
 * Represents a task that can be scheduled for execution.
 */
public class Task {
    private final String taskId;
    private final String name;
    private final String description;
    private final Runnable action;
    private final LocalDateTime createdAt;
    
    public Task(String taskId, String name, Runnable action) {
        this.taskId = Objects.requireNonNull(taskId, "Task ID cannot be null");
        this.name = Objects.requireNonNull(name, "Task name cannot be null");
        this.action = Objects.requireNonNull(action, "Task action cannot be null");
        this.description = "";
        this.createdAt = LocalDateTime.now();
    }
    
    public Task(String taskId, String name, String description, Runnable action) {
        this.taskId = Objects.requireNonNull(taskId, "Task ID cannot be null");
        this.name = Objects.requireNonNull(name, "Task name cannot be null");
        this.description = description;
        this.action = Objects.requireNonNull(action, "Task action cannot be null");
        this.createdAt = LocalDateTime.now();
    }
    
    public String getTaskId() { return taskId; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public Runnable getAction() { return action; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Task task = (Task) o;
        return taskId.equals(task.taskId);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(taskId);
    }
    
    @Override
    public String toString() {
        return "Task{taskId='" + taskId + "', name='" + name + "', createdAt=" + createdAt + '}';
    }
}
