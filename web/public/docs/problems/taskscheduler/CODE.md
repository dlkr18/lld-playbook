# Source Code

This page contains the complete source code for this problem.

## 📁 Directory Structure

```
├── ScheduledTask.java
├── TaskSchedulerDemo.java
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
<summary>📄 <strong>TaskSchedulerDemo.java</strong> - Click to expand</summary>

```java
package com.you.lld.problems.taskscheduler;

import com.you.lld.problems.taskscheduler.api.TaskSchedulerService;
import com.you.lld.problems.taskscheduler.impl.PriorityTaskScheduler;
import com.you.lld.problems.taskscheduler.model.Priority;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Demonstration of Task Scheduler capabilities.
 * 
 * Features demonstrated:
 * 1. One-time task scheduling
 * 2. Recurring task scheduling
 * 3. Priority-based execution
 * 4. Task cancellation
 * 5. Priority updates
 * 6. Time range queries
 */
public class TaskSchedulerDemo {
    
    public static void main(String[] args) throws InterruptedException {
        System.out.println("=== Task Scheduler Demo ===\n");
        
        TaskSchedulerService scheduler = new PriorityTaskScheduler();
        
        // Demo 1: Schedule one-time tasks with different priorities
        demonstrateOneTimeTasks(scheduler);
        
        // Demo 2: Schedule recurring tasks
        demonstrateRecurringTasks(scheduler);
        
        // Demo 3: Priority updates
        demonstratePriorityUpdates(scheduler);
        
        // Demo 4: Task cancellation
        demonstrateCancellation(scheduler);
        
        // Demo 5: Query tasks in time range
        demonstrateTimeRangeQuery(scheduler);
        
        // Start the scheduler
        scheduler.start();
        
        // Let it run for a bit
        System.out.println("\n⏳ Scheduler running... (waiting 10 seconds)");
        Thread.sleep(10000);
        
        // Stop the scheduler
        scheduler.stop();
        System.out.println("\n✅ Scheduler stopped");
    }
    
    private static void demonstrateOneTimeTasks(TaskSchedulerService scheduler) {
        System.out.println("1️⃣  ONE-TIME TASKS");
        System.out.println("==================");
        
        LocalDateTime now = LocalDateTime.now();
        
        // High priority task (executes in 2 seconds)
        ScheduledTask highPriorityTask = new ScheduledTask(
            "TASK-HIGH",
            () -> System.out.println("🔴 HIGH priority task executed at " + LocalDateTime.now()),
            now.plusSeconds(2)
        );
        highPriorityTask.setPriority(Priority.HIGH);
        String taskId1 = scheduler.scheduleTask(highPriorityTask, now.plusSeconds(2));
        System.out.println("✅ Scheduled HIGH priority task: " + taskId1);
        
        // Low priority task (also at 2 seconds, but should execute after HIGH)
        ScheduledTask lowPriorityTask = new ScheduledTask(
            "TASK-LOW",
            () -> System.out.println("🟢 LOW priority task executed at " + LocalDateTime.now()),
            now.plusSeconds(2)
        );
        lowPriorityTask.setPriority(Priority.LOW);
        String taskId2 = scheduler.scheduleTask(lowPriorityTask, now.plusSeconds(2));
        System.out.println("✅ Scheduled LOW priority task: " + taskId2);
        
        // Critical task (executes in 5 seconds)
        ScheduledTask criticalTask = new ScheduledTask(
            "TASK-CRITICAL",
            () -> System.out.println("🔥 CRITICAL task executed at " + LocalDateTime.now()),
            now.plusSeconds(5)
        );
        criticalTask.setPriority(Priority.CRITICAL);
        String taskId3 = scheduler.scheduleTask(criticalTask, now.plusSeconds(5));
        System.out.println("✅ Scheduled CRITICAL task: " + taskId3);
        
        System.out.println();
    }
    
    private static void demonstrateRecurringTasks(TaskSchedulerService scheduler) {
        System.out.println("2️⃣  RECURRING TASKS");
        System.out.println("===================");
        
        LocalDateTime now = LocalDateTime.now();
        
        // Recurring task every 3 seconds
        ScheduledTask recurringTask = new ScheduledTask(
            "TASK-RECURRING",
            () -> System.out.println("🔄 Recurring task executed at " + LocalDateTime.now()),
            now.plusSeconds(1)
        );
        String taskId = scheduler.scheduleRecurringTask(recurringTask, now.plusSeconds(1), 3);
        System.out.println("✅ Scheduled recurring task (every 3s): " + taskId);
        System.out.println();
    }
    
    private static void demonstratePriorityUpdates(TaskSchedulerService scheduler) {
        System.out.println("3️⃣  PRIORITY UPDATES");
        System.out.println("====================");
        
        LocalDateTime now = LocalDateTime.now();
        
        ScheduledTask task = new ScheduledTask(
            "TASK-UPDATE",
            () -> System.out.println("📝 Updated priority task executed"),
            now.plusSeconds(7)
        );
        task.setPriority(Priority.LOW);
        String taskId = scheduler.scheduleTask(task, now.plusSeconds(7));
        System.out.println("✅ Scheduled task with LOW priority: " + taskId);
        
        // Update to HIGH priority
        boolean updated = scheduler.updateTaskPriority(taskId, Priority.HIGH);
        System.out.println("✅ Updated task to HIGH priority: " + updated);
        System.out.println();
    }
    
    private static void demonstrateCancellation(TaskSchedulerService scheduler) {
        System.out.println("4️⃣  TASK CANCELLATION");
        System.out.println("=====================");
        
        LocalDateTime now = LocalDateTime.now();
        
        ScheduledTask task = new ScheduledTask(
            "TASK-CANCEL",
            () -> System.out.println("❌ This should NOT execute (cancelled)"),
            now.plusSeconds(20)
        );
        String taskId = scheduler.scheduleTask(task, now.plusSeconds(20));
        System.out.println("✅ Scheduled task: " + taskId);
        
        // Cancel it immediately
        boolean cancelled = scheduler.cancelTask(taskId);
        System.out.println("✅ Cancelled task: " + cancelled);
        System.out.println();
    }
    
    private static void demonstrateTimeRangeQuery(TaskSchedulerService scheduler) {
        System.out.println("5️⃣  TIME RANGE QUERY");
        System.out.println("====================");
        
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime start = now;
        LocalDateTime end = now.plusSeconds(10);
        
        List<ScheduledTask> tasksInRange = scheduler.getTasksInRange(start, end);
        System.out.println("📊 Tasks scheduled in next 10 seconds: " + tasksInRange.size());
        
        for (ScheduledTask task : tasksInRange) {
            System.out.println("   - " + task.getTaskId() + 
                             " (Priority: " + task.getPriority() + 
                             ", Time: " + task.getScheduledTime() + ")");
        }
        
        System.out.println();
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

