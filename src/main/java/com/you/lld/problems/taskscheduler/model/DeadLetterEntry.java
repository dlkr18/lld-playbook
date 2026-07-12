package com.you.lld.problems.taskscheduler.model;

import java.time.LocalDateTime;

/** Entry in the dead-letter queue after retries are exhausted. */
public final class DeadLetterEntry {
    private final String taskId;
    private final String taskName;
    private final String failureReason;
    private final int attempts;
    private final LocalDateTime deadLetteredAt;

    public DeadLetterEntry(String taskId, String taskName, String failureReason, int attempts) {
        this.taskId = taskId;
        this.taskName = taskName;
        this.failureReason = failureReason;
        this.attempts = attempts;
        this.deadLetteredAt = LocalDateTime.now();
    }

    public String getTaskId() {
        return taskId;
    }

    public String getTaskName() {
        return taskName;
    }

    public String getFailureReason() {
        return failureReason;
    }

    public int getAttempts() {
        return attempts;
    }

    public LocalDateTime getDeadLetteredAt() {
        return deadLetteredAt;
    }

    @Override
    public String toString() {
        return taskId + " (" + taskName + ") after " + attempts + " attempts: " + failureReason;
    }
}
