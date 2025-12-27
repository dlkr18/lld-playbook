package com.you.lld.problems.taskscheduler.model;

import java.time.LocalDateTime;

/**
 * Represents a task scheduling configuration.
 */
public class Schedule {
    private final ScheduleType type;
    private final long intervalSeconds;
    private final LocalDateTime startTime;
    private final LocalDateTime endTime;
    
    public Schedule(ScheduleType type, long intervalSeconds, LocalDateTime startTime) {
        this.type = type;
        this.intervalSeconds = intervalSeconds;
        this.startTime = startTime;
        this.endTime = null;
    }
    
    public Schedule(ScheduleType type, long intervalSeconds, 
                   LocalDateTime startTime, LocalDateTime endTime) {
        this.type = type;
        this.intervalSeconds = intervalSeconds;
        this.startTime = startTime;
        this.endTime = endTime;
    }
    
    public boolean isRecurring() {
        return type == ScheduleType.RECURRING;
    }
    
    public LocalDateTime getNextExecutionTime(LocalDateTime current) {
        if (!isRecurring()) {
            return startTime;
        }
        return current.plusSeconds(intervalSeconds);
    }
    
    public ScheduleType getType() { return type; }
    public long getIntervalSeconds() { return intervalSeconds; }
    public LocalDateTime getStartTime() { return startTime; }
    public LocalDateTime getEndTime() { return endTime; }
}

enum ScheduleType {
    ONE_TIME,
    RECURRING
}
