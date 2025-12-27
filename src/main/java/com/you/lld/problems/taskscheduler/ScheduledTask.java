package com.you.lld.problems.taskscheduler;

import com.you.lld.problems.taskscheduler.model.Priority;

import java.time.LocalDateTime;

public class ScheduledTask {
    private String id;
    private final String taskId;
    private final Runnable task;
    private LocalDateTime scheduledTime;
    private boolean executed;
    private Priority priority;
    private boolean recurring;
    private long intervalSeconds;
    
    public ScheduledTask(String taskId, Runnable task, LocalDateTime scheduledTime) {
        this.taskId = taskId;
        this.task = task;
        this.scheduledTime = scheduledTime;
        this.executed = false;
        this.priority = Priority.MEDIUM;
        this.recurring = false;
    }
    
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTaskId() { return taskId; }
    public Runnable getTask() { return task; }
    public LocalDateTime getScheduledTime() { return scheduledTime; }
    public void setScheduledTime(LocalDateTime scheduledTime) { this.scheduledTime = scheduledTime; }
    public boolean isExecuted() { return executed; }
    public void markExecuted() { this.executed = true; }
    public Priority getPriority() { return priority; }
    public void setPriority(Priority priority) { this.priority = priority; }
    public boolean isRecurring() { return recurring; }
    public void setRecurring(boolean recurring) { this.recurring = recurring; }
    public long getIntervalSeconds() { return intervalSeconds; }
    public void setIntervalSeconds(long intervalSeconds) { this.intervalSeconds = intervalSeconds; }
    
    public void execute() {
        if (task != null) {
            task.run();
            markExecuted();
        }
    }
}
