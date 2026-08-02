package com.you.lld.problems.taskmanagement.model;

import java.time.LocalDateTime;
import java.util.*;

public class Task {
    private final String id;
    private String title;
    private String description;
    private TaskStatus status;
    private Priority priority;
    private String assigneeId;
    private List<String> tags;
    private LocalDateTime createdAt;
    private LocalDateTime dueDate;
    private LocalDateTime completedAt;
    
    public Task(String id, String title) {
        this.id = id;
        this.title = title;
        this.status = TaskStatus.TODO;
        this.priority = Priority.MEDIUM;
        this.tags = new java.util.concurrent.CopyOnWriteArrayList<>();
        this.createdAt = LocalDateTime.now();
    }
    
    // Getters and setters
    public String getId() { return id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public TaskStatus getStatus() { return status; }
    /**
     * Applies a status change, rejecting transitions the lifecycle forbids.
     *
     * <p>Synchronized because callers read the old status and then write the new
     * one; without the lock two threads can both observe the same "old" value and
     * publish contradictory transition events.
     */
    public synchronized void setStatus(TaskStatus next) {
        if (!this.status.canTransitionTo(next)) {
            throw new IllegalStateException(
                    "Illegal transition " + this.status + " -> " + next
                            + " (allowed: " + this.status.allowedNext() + ")");
        }
        this.status = next;
        if (next == TaskStatus.DONE) {
            this.completedAt = LocalDateTime.now();
        } else {
            // Reopening must clear it — otherwise a TODO task reports a completion
            // time, and every "how long did this take" report is wrong.
            this.completedAt = null;
        }
    }

    /** Reads the status and applies the change atomically; returns the previous value. */
    public synchronized TaskStatus transitionTo(TaskStatus next) {
        TaskStatus previous = this.status;
        setStatus(next);
        return previous;
    }
    public Priority getPriority() { return priority; }
    public void setPriority(Priority priority) { this.priority = priority; }
    public String getAssigneeId() { return assigneeId; }
    public void setAssigneeId(String assigneeId) { this.assigneeId = assigneeId; }
    public List<String> getTags() { return new ArrayList<>(tags); }
    public void addTag(String tag) { this.tags.add(tag); }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getDueDate() { return dueDate; }
    public void setDueDate(LocalDateTime dueDate) { this.dueDate = dueDate; }
    public LocalDateTime getCompletedAt() { return completedAt; }
}
