package com.you.lld.problems.taskscheduler;

import com.you.lld.problems.taskscheduler.model.DeadLetterEntry;
import com.you.lld.problems.taskscheduler.model.Priority;
import com.you.lld.problems.taskscheduler.model.ScheduledTask;
import com.you.lld.problems.taskscheduler.service.TaskSchedulerService;
import com.you.lld.problems.taskscheduler.service.impl.PriorityTaskScheduler;

import java.time.LocalDateTime;
import java.util.List;

/** Facade for delayed, priority-based task scheduling. */
public final class TaskScheduler {
    private final TaskSchedulerService service;

    public TaskScheduler() {
        this(new PriorityTaskScheduler());
    }

    public TaskScheduler(TaskSchedulerService service) {
        this.service = service;
    }

    public String schedule(ScheduledTask task, LocalDateTime when) {
        return service.scheduleTask(task, when);
    }

    public String scheduleRecurring(ScheduledTask task, LocalDateTime start, long intervalSeconds) {
        return service.scheduleRecurringTask(task, start, intervalSeconds);
    }

    public boolean cancel(String taskId) {
        return service.cancelTask(taskId);
    }

    public boolean updatePriority(String taskId, Priority priority) {
        return service.updateTaskPriority(taskId, priority);
    }

    public List<ScheduledTask> tasksInRange(LocalDateTime start, LocalDateTime end) {
        return service.getTasksInRange(start, end);
    }

    public List<DeadLetterEntry> deadLetters() {
        return service.getDeadLetterQueue();
    }

    public void start() {
        service.start();
    }

    public void stop() {
        service.stop();
    }

    public TaskSchedulerService unwrap() {
        return service;
    }
}
