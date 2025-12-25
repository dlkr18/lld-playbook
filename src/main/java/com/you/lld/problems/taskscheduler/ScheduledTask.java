package com.you.lld.problems.taskscheduler;
import java.time.LocalDateTime;

public class ScheduledTask {
    private final String taskId;
    private final Runnable task;
    private final LocalDateTime scheduledTime;
    private boolean executed;
    
    public ScheduledTask(String taskId, Runnable task, LocalDateTime scheduledTime) {
        this.taskId = taskId;
        this.task = task;
        this.scheduledTime = scheduledTime;
        this.executed = false;
    }
    
    public String getTaskId() { return taskId; }
    public Runnable getTask() { return task; }
    public LocalDateTime getScheduledTime() { return scheduledTime; }
    public boolean isExecuted() { return executed; }
    public void markExecuted() { this.executed = true; }
}
