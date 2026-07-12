package com.you.lld.problems.taskscheduler.service;

import com.you.lld.problems.taskscheduler.model.DeadLetterEntry;
import com.you.lld.problems.taskscheduler.model.Priority;
import com.you.lld.problems.taskscheduler.model.ScheduledTask;

import java.time.LocalDateTime;
import java.util.List;

public interface TaskSchedulerService {
    String scheduleTask(ScheduledTask task, LocalDateTime scheduledTime);
    String scheduleRecurringTask(ScheduledTask task, LocalDateTime startTime, long intervalSeconds);
    boolean cancelTask(String taskId);
    int executeDueTasks();
    List<ScheduledTask> getAllScheduledTasks();
    List<ScheduledTask> getTasksInRange(LocalDateTime start, LocalDateTime end);
    boolean updateTaskPriority(String taskId, Priority priority);
    List<DeadLetterEntry> getDeadLetterQueue();
    void start();
    void stop();
}
