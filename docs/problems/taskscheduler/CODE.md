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

<details>
<summary>📄 <strong>ScheduledTask.java</strong> - Click to expand</summary>

```java
package com.you.lld.problems.taskscheduler;

import com.you.lld.problems.taskscheduler.model.Priority;

import java.time.LocalDateTime;

public class ScheduledTask {
    private String id;
    private final String taskId;
    private final Runnable task;
    private LocalDateTime scheduledTime;
    private boolean executed;
    private Priority priority;
    private boolean recurring;
    private long intervalSeconds;
    
    public ScheduledTask(String taskId, Runnable task, LocalDateTime scheduledTime) {
        this.taskId = taskId;
        this.task = task;
        this.scheduledTime = scheduledTime;
        this.executed = false;
        this.priority = Priority.MEDIUM;
        this.recurring = false;
    }
    
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTaskId() { return taskId; }
    public Runnable getTask() { return task; }
    public LocalDateTime getScheduledTime() { return scheduledTime; }
    public void setScheduledTime(LocalDateTime scheduledTime) { this.scheduledTime = scheduledTime; }
    public boolean isExecuted() { return executed; }
    public void markExecuted() { this.executed = true; }
    public Priority getPriority() { return priority; }
    public void setPriority(Priority priority) { this.priority = priority; }
    public boolean isRecurring() { return recurring; }
    public void setRecurring(boolean recurring) { this.recurring = recurring; }
    public long getIntervalSeconds() { return intervalSeconds; }
    public void setIntervalSeconds(long intervalSeconds) { this.intervalSeconds = intervalSeconds; }
    
    public void execute() {
        if (task != null) {
            task.run();
            markExecuted();
        }
    }
}
```

</details>

<details>
<summary>📄 <strong>TaskScheduler.java</strong> - Click to expand</summary>

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

</details>

<details>
<summary>📄 <strong>api/TaskSchedulerService.java</strong> - Click to expand</summary>

```java
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

```

</details>

<details>
<summary>📄 <strong>exceptions/SchedulingException.java</strong> - Click to expand</summary>

```java
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
```

</details>

<details>
<summary>📄 <strong>exceptions/TaskNotFoundException.java</strong> - Click to expand</summary>

```java
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
```

</details>

<details>
<summary>📄 <strong>impl/PriorityTaskScheduler.java</strong> - Click to expand</summary>

```java
package com.you.lld.problems.taskscheduler.impl;

import com.you.lld.problems.taskscheduler.api.TaskSchedulerService;
import com.you.lld.problems.taskscheduler.ScheduledTask;
import com.you.lld.problems.taskscheduler.model.Priority;

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
        this.taskQueue = new PriorityQueue<>((a, b) -> {
            int timeCompare = a.getScheduledTime().compareTo(b.getScheduledTime());
            if (timeCompare != 0) return timeCompare;
            return a.getPriority().compareTo(b.getPriority());
        });
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
    public boolean updateTaskPriority(String taskId, Priority priority) {
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

</details>

<details>
<summary>📄 <strong>model/Priority.java</strong> - Click to expand</summary>

```java
package com.you.lld.problems.taskscheduler.model;

/**
 * Task priority levels.
 */
public enum Priority {
    LOW(1),
    MEDIUM(2),
    HIGH(3),
    CRITICAL(4);
    
    private final int level;
    
    Priority(int level) {
        this.level = level;
    }
    
    public int getLevel() {
        return level;
    }
}
```

</details>

<details>
<summary>📄 <strong>model/Schedule.java</strong> - Click to expand</summary>

```java
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
```

</details>

<details>
<summary>📄 <strong>model/Task.java</strong> - Click to expand</summary>

```java
package com.you.lld.problems.taskscheduler.model;

import java.time.LocalDateTime;
import java.util.Objects;

/**
 * Represents a task that can be scheduled for execution.
 */
public class Task {
    private final String taskId;
    private final String name;
    private final String description;
    private final Runnable action;
    private final LocalDateTime createdAt;
    
    public Task(String taskId, String name, Runnable action) {
        this.taskId = Objects.requireNonNull(taskId, "Task ID cannot be null");
        this.name = Objects.requireNonNull(name, "Task name cannot be null");
        this.action = Objects.requireNonNull(action, "Task action cannot be null");
        this.description = "";
        this.createdAt = LocalDateTime.now();
    }
    
    public Task(String taskId, String name, String description, Runnable action) {
        this.taskId = Objects.requireNonNull(taskId, "Task ID cannot be null");
        this.name = Objects.requireNonNull(name, "Task name cannot be null");
        this.description = description;
        this.action = Objects.requireNonNull(action, "Task action cannot be null");
        this.createdAt = LocalDateTime.now();
    }
    
    public String getTaskId() { return taskId; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public Runnable getAction() { return action; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Task task = (Task) o;
        return taskId.equals(task.taskId);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(taskId);
    }
    
    @Override
    public String toString() {
        return "Task{taskId='" + taskId + "', name='" + name + "', createdAt=" + createdAt + '}';
    }
}
```

</details>

<details>
<summary>📄 <strong>model/TaskResult.java</strong> - Click to expand</summary>

```java
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
```

</details>

<details>
<summary>📄 <strong>model/TaskStatus.java</strong> - Click to expand</summary>

```java
package com.you.lld.problems.taskscheduler.model;

/**
 * Status of a task in its lifecycle.
 */
public enum TaskStatus {
    SCHEDULED,   // Task is scheduled but not yet due
    RUNNING,     // Task is currently executing
    COMPLETED,   // Task completed successfully
    FAILED,      // Task execution failed
    CANCELLED    // Task was cancelled before execution
}
```

</details>

