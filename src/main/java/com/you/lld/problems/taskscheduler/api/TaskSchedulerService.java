package com.you.lld.problems.taskscheduler.api;

import com.you.lld.problems.taskscheduler.ScheduledTask;
import com.you.lld.problems.taskscheduler.model.Priority;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Service interface for task scheduling system.
 * Supports scheduling, priority-based execution, and task lifecycle management.
 */
public interface TaskSchedulerService {
    
    /**
     * Schedules a task for execution at a specific time.
     * 
     * @param task Task to schedule
     * @param scheduledTime When to execute the task
     * @return Scheduled task ID
     */
    String scheduleTask(ScheduledTask task, LocalDateTime scheduledTime);
    
    /**
     * Schedules a recurring task.
     * 
     * @param task Task to schedule
     * @param startTime When to start
     * @param intervalSeconds Interval between executions in seconds
     * @return Scheduled task ID
     */
    String scheduleRecurringTask(ScheduledTask task, LocalDateTime startTime, long intervalSeconds);
    
    /**
     * Cancels a scheduled task.
     * 
     * @param taskId Task ID to cancel
     * @return true if cancelled successfully
     */
    boolean cancelTask(String taskId);
    
    /**
     * Executes all tasks that are due.
     * 
     * @return Number of tasks executed
     */
    int executeDueTasks();
    
    /**
     * Gets all scheduled tasks.
     * 
     * @return List of scheduled tasks
     */
    List<ScheduledTask> getAllScheduledTasks();
    
    /**
     * Gets tasks scheduled for a specific time range.
     * 
     * @param start Start time
     * @param end End time
     * @return List of scheduled tasks in range
     */
    List<ScheduledTask> getTasksInRange(LocalDateTime start, LocalDateTime end);
    
    /**
     * Updates the priority of a task.
     * 
     * @param taskId Task ID
     * @param priority New priority
     * @return true if updated successfully
     */
    boolean updateTaskPriority(String taskId, Priority priority);
    
    /**
     * Starts the scheduler to automatically execute due tasks.
     */
    void start();
    
    /**
     * Stops the scheduler.
     */
    void stop();
}

