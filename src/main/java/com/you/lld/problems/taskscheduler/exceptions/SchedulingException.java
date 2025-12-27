package com.you.lld.problems.taskscheduler.exceptions;

/**
 * Exception thrown when task scheduling fails.
 */
public class SchedulingException extends RuntimeException {
    private final String taskId;
    
    public SchedulingException(String message) {
        super(message);
        this.taskId = null;
    }
    
    public SchedulingException(String message, String taskId) {
        super(message);
        this.taskId = taskId;
    }
    
    public SchedulingException(String message, Throwable cause) {
        super(message, cause);
        this.taskId = null;
    }
    
    public String getTaskId() {
        return taskId;
    }
}
