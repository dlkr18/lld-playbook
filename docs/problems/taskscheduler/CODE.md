# Source Code

This page contains the complete source code for this problem.

## 📁 Directory Structure

```
├── ScheduledTask.java
├── TaskScheduler.java
├── api/TaskSchedulerService.java
├── exceptions/SchedulingException.java
├── exceptions/TaskNotFoundException.java
├── impl/PriorityTaskScheduler.java
├── model/Priority.java
├── model/Schedule.java
├── model/Task.java
├── model/TaskResult.java
├── model/TaskStatus.java
```

## ScheduledTask.java

```java
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
```

## TaskScheduler.java

```java
package com.you.lld.problems.taskscheduler;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.*;

public class TaskScheduler {
    private final PriorityQueue<ScheduledTask> taskQueue;
    private final ExecutorService executor;
    private final ScheduledExecutorService scheduler;
    
    public TaskScheduler() {
        this.taskQueue = new PriorityQueue<>(
            Comparator.comparing(ScheduledTask::getScheduledTime)
        );
        this.executor = Executors.newFixedThreadPool(4);
        this.scheduler = Executors.newScheduledThreadPool(1);
        startScheduler();
    }
    
    public void scheduleTask(ScheduledTask task) {
        synchronized (taskQueue) {
            taskQueue.offer(task);
        }
    }
    
    private void startScheduler() {
        scheduler.scheduleAtFixedRate(() -> {
            LocalDateTime now = LocalDateTime.now();
            synchronized (taskQueue) {
                while (!taskQueue.isEmpty() && 
                       !taskQueue.peek().getScheduledTime().isAfter(now)) {
                    ScheduledTask task = taskQueue.poll();
                    if (!task.isExecuted()) {
                        executor.submit(() -> {
                            task.getTask().run();
                            task.markExecuted();
                        });
                    }
                }
            }
        }, 0, 1, TimeUnit.SECONDS);
    }
    
    public void shutdown() {
        executor.shutdown();
        scheduler.shutdown();
    }
}
```

## TaskSchedulerService.java

```java
package com.you.lld.problems.taskscheduler.api;

import com.you.lld.problems.taskscheduler.model.ScheduledTask;
import com.you.lld.problems.taskscheduler.model.TaskPriority;

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
    boolean updateTaskPriority(String taskId, TaskPriority priority);
    
    /**
     * Starts the scheduler to automatically execute due tasks.
     */
    void start();
    
    /**
     * Stops the scheduler.
     */
    void stop();
}

```

## SchedulingException.java

```java
package com.you.lld.problems.taskscheduler.exceptions;
public class SchedulingException extends RuntimeException { public SchedulingException(String m) { super(m); } }```

## TaskNotFoundException.java

```java
package com.you.lld.problems.taskscheduler.exceptions;
public class TaskNotFoundException extends RuntimeException { public TaskNotFoundException(String m) { super(m); } }```

## PriorityTaskScheduler.java

```java
package com.you.lld.problems.taskscheduler.impl;

import com.you.lld.problems.taskscheduler.api.TaskSchedulerService;
import com.you.lld.problems.taskscheduler.model.ScheduledTask;
import com.you.lld.problems.taskscheduler.model.TaskPriority;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

/**
 * Priority-based task scheduler with thread-safe operations.
 */
public class PriorityTaskScheduler implements TaskSchedulerService {
    
    private final Map<String, ScheduledTask> tasks;
    private final PriorityQueue<ScheduledTask> taskQueue;
    private final AtomicLong taskIdGenerator;
    private final ScheduledExecutorService executor;
    private boolean running;
    
    public PriorityTaskScheduler() {
        this.tasks = new ConcurrentHashMap<>();
        this.taskQueue = new PriorityQueue<>(Comparator
            .comparing(ScheduledTask::getScheduledTime)
            .thenComparing(ScheduledTask::getPriority));
        this.taskIdGenerator = new AtomicLong(0);
        this.executor = Executors.newScheduledThreadPool(4);
        this.running = false;
    }
    
    @Override
    public String scheduleTask(ScheduledTask task, LocalDateTime scheduledTime) {
        String taskId = "TASK-" + taskIdGenerator.incrementAndGet();
        task.setScheduledTime(scheduledTime);
        task.setId(taskId);
        
        tasks.put(taskId, task);
        synchronized (taskQueue) {
            taskQueue.offer(task);
        }
        
        return taskId;
    }
    
    @Override
    public String scheduleRecurringTask(ScheduledTask task, LocalDateTime startTime, long intervalSeconds) {
        String taskId = scheduleTask(task, startTime);
        task.setRecurring(true);
        task.setIntervalSeconds(intervalSeconds);
        return taskId;
    }
    
    @Override
    public boolean cancelTask(String taskId) {
        ScheduledTask task = tasks.remove(taskId);
        if (task == null) {
            return false;
        }
        
        synchronized (taskQueue) {
            taskQueue.remove(task);
        }
        
        return true;
    }
    
    @Override
    public int executeDueTasks() {
        LocalDateTime now = LocalDateTime.now();
        List<ScheduledTask> dueTasks = new ArrayList<>();
        
        synchronized (taskQueue) {
            while (!taskQueue.isEmpty() && 
                   !taskQueue.peek().getScheduledTime().isAfter(now)) {
                dueTasks.add(taskQueue.poll());
            }
        }
        
        for (ScheduledTask task : dueTasks) {
            executor.submit(() -> {
                try {
                    task.execute();
                    
                    // Reschedule if recurring
                    if (task.isRecurring()) {
                        LocalDateTime nextTime = now.plusSeconds(task.getIntervalSeconds());
                        task.setScheduledTime(nextTime);
                        synchronized (taskQueue) {
                            taskQueue.offer(task);
                        }
                    } else {
                        tasks.remove(task.getId());
                    }
                } catch (Exception e) {
                    System.err.println("Task execution failed: " + e.getMessage());
                }
            });
        }
        
        return dueTasks.size();
    }
    
    @Override
    public List<ScheduledTask> getAllScheduledTasks() {
        return new ArrayList<>(tasks.values());
    }
    
    @Override
    public List<ScheduledTask> getTasksInRange(LocalDateTime start, LocalDateTime end) {
        return tasks.values().stream()
            .filter(t -> !t.getScheduledTime().isBefore(start) && 
                        !t.getScheduledTime().isAfter(end))
            .collect(Collectors.toList());
    }
    
    @Override
    public boolean updateTaskPriority(String taskId, TaskPriority priority) {
        ScheduledTask task = tasks.get(taskId);
        if (task == null) {
            return false;
        }
        
        synchronized (taskQueue) {
            taskQueue.remove(task);
            task.setPriority(priority);
            taskQueue.offer(task);
        }
        
        return true;
    }
    
    @Override
    public void start() {
        if (running) {
            return;
        }
        
        running = true;
        executor.scheduleAtFixedRate(
            this::executeDueTasks,
            0,
            1,
            TimeUnit.SECONDS
        );
    }
    
    @Override
    public void stop() {
        running = false;
        executor.shutdown();
        try {
            if (!executor.awaitTermination(5, TimeUnit.SECONDS)) {
                executor.shutdownNow();
            }
        } catch (InterruptedException e) {
            executor.shutdownNow();
            Thread.currentThread().interrupt();
        }
    }
}

```

## Priority.java

```java
package com.you.lld.problems.taskscheduler.model;
import java.util.*;
public
class Priority  {
    private String priorityId;
    public Priority(String id)  {
        priorityId=id;
    }
    public String getPriorityId()  {
        return priorityId;
    }
}
```

## Schedule.java

```java
package com.you.lld.problems.taskscheduler.model;
import java.util.*;
public
class Schedule  {
    private String scheduleId;
    public Schedule(String id)  {
        scheduleId=id;
    }
    public String getScheduleId()  {
        return scheduleId;
    }
}
```

## Task.java

```java
package com.you.lld.problems.taskscheduler.model;
import java.util.*;
public class Task { private String taskId; public Task(String id) { taskId=id; } public String getTaskId() { return taskId; } }```

## TaskResult.java

```java
package com.you.lld.problems.taskscheduler.model;
import java.util.*;
public
class TaskResult  {
    private String taskresultId;
    public TaskResult(String id)  {
        taskresultId=id;
    }
    public String getTaskResultId()  {
        return taskresultId;
    }
}
```

## TaskStatus.java

```java
package com.you.lld.problems.taskscheduler.model;
public enum TaskStatus { ACTIVE, INACTIVE, PENDING, COMPLETED }```

