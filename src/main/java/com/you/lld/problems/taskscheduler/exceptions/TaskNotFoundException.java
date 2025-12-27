package com.you.lld.problems.taskscheduler.exceptions;

/**
 * Exception thrown when a task with given ID is not found.
 */
public class TaskNotFoundException extends SchedulingException {
    
    public TaskNotFoundException(String taskId) {
        super("Task not found: " + taskId, taskId);
    }
    
    public TaskNotFoundException(String taskId, String message) {
        super(message, taskId);
    }
}
