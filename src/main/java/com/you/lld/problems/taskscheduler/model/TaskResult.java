package com.you.lld.problems.taskscheduler.model;

import java.time.LocalDateTime;

/**
 * Represents the result of a task execution.
 */
public class TaskResult {
    private final String taskId;
    private final TaskStatus status;
    private final LocalDateTime executedAt;
    private final String result;
    private final String errorMessage;
    private final long executionTimeMs;
    
    public TaskResult(String taskId, TaskStatus status, LocalDateTime executedAt) {
        this.taskId = taskId;
        this.status = status;
        this.executedAt = executedAt;
        this.result = null;
        this.errorMessage = null;
        this.executionTimeMs = 0;
    }
    
    public TaskResult(String taskId, TaskStatus status, LocalDateTime executedAt, 
                     String result, String errorMessage, long executionTimeMs) {
        this.taskId = taskId;
        this.status = status;
        this.executedAt = executedAt;
        this.result = result;
        this.errorMessage = errorMessage;
        this.executionTimeMs = executionTimeMs;
    }
    
    public String getTaskId() { return taskId; }
    public TaskStatus getStatus() { return status; }
    public LocalDateTime getExecutedAt() { return executedAt; }
    public String getResult() { return result; }
    public String getErrorMessage() { return errorMessage; }
    public long getExecutionTimeMs() { return executionTimeMs; }
    
    public boolean isSuccess() {
        return status == TaskStatus.COMPLETED;
    }
    
    @Override
    public String toString() {
        return "TaskResult{taskId='" + taskId + "', status=" + status + 
               ", executedAt=" + executedAt + ", executionTime=" + executionTimeMs + "ms}";
    }
}
