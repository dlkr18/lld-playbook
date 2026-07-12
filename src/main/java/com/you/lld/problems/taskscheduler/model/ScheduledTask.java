package com.you.lld.problems.taskscheduler.model;

import java.time.LocalDateTime;

/** A runnable unit scheduled for future execution. */
public class ScheduledTask implements Comparable<ScheduledTask> {
    private String id;
    private final String name;
    private final Runnable action;
    private LocalDateTime scheduledTime;
    private Priority priority;
    private boolean recurring;
    private long intervalSeconds;
    private int attemptCount;
    private int maxRetries;
    private volatile boolean cancelled;

    public ScheduledTask(String name, Runnable action, LocalDateTime scheduledTime) {
        this.name = name;
        this.action = action;
        this.scheduledTime = scheduledTime;
        this.priority = Priority.MEDIUM;
        this.maxRetries = 3;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public String getTaskId() {
        return name;
    }

    public Runnable getAction() {
        return action;
    }

    public Runnable getTask() {
        return action;
    }

    public LocalDateTime getScheduledTime() {
        return scheduledTime;
    }

    public void setScheduledTime(LocalDateTime scheduledTime) {
        this.scheduledTime = scheduledTime;
    }

    public Priority getPriority() {
        return priority;
    }

    public void setPriority(Priority priority) {
        this.priority = priority;
    }

    public boolean isRecurring() {
        return recurring;
    }

    public void setRecurring(boolean recurring) {
        this.recurring = recurring;
    }

    public long getIntervalSeconds() {
        return intervalSeconds;
    }

    public void setIntervalSeconds(long intervalSeconds) {
        this.intervalSeconds = intervalSeconds;
    }

    public int getAttemptCount() {
        return attemptCount;
    }

    public void incrementAttemptCount() {
        this.attemptCount++;
    }

    public int getMaxRetries() {
        return maxRetries;
    }

    public void setMaxRetries(int maxRetries) {
        this.maxRetries = maxRetries;
    }

    public boolean isCancelled() {
        return cancelled;
    }

    public void cancel() {
        this.cancelled = true;
    }

    public boolean canRetry() {
        return attemptCount < maxRetries;
    }

    public void execute() {
        if (action != null) {
            action.run();
        }
    }

    @Override
    public int compareTo(ScheduledTask other) {
        int timeCompare = scheduledTime.compareTo(other.scheduledTime);
        if (timeCompare != 0) {
            return timeCompare;
        }
        return Integer.compare(other.priority.getLevel(), priority.getLevel());
    }
}
