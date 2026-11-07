# taskscheduler - Complete Implementation

> Generated from `src/main/java/com/you/lld/problems/taskscheduler/` on 2026-11-07. Re-run `python3 scripts/generate-code-md.py taskscheduler`.

## Project Structure (13 files)

```
taskscheduler/
├── TaskSchedulerDemo.java
├── TaskScheduler.java
├── model/DeadLetterEntry.java
├── model/Priority.java
├── model/Schedule.java
├── model/ScheduledTask.java
├── model/Task.java
├── model/TaskResult.java
├── model/TaskStatus.java
├── service/TaskSchedulerService.java
├── service/impl/PriorityTaskScheduler.java
├── exceptions/SchedulingException.java
├── exceptions/TaskNotFoundException.java
```

## Source Code

### `TaskSchedulerDemo.java`

<details>
<summary>Click to view TaskSchedulerDemo.java</summary>

```java
package com.you.lld.problems.taskscheduler;

import com.you.lld.problems.taskscheduler.model.Priority;
import com.you.lld.problems.taskscheduler.model.ScheduledTask;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Demo: delayed tasks, priority queue, retry/DLQ, thread pool.
 */
public class TaskSchedulerDemo {

    public static void main(String[] args) throws InterruptedException {
        System.out.println("=== Task Scheduler Demo ===\n");

        TaskScheduler scheduler = new TaskScheduler();
        LocalDateTime now = LocalDateTime.now();

        System.out.println("--- Scenario 1: Priority at same time ---");
        scheduler.schedule(task("HIGH", Priority.HIGH, "HIGH priority"), now.plusSeconds(2));
        scheduler.schedule(task("LOW", Priority.LOW, "LOW priority"), now.plusSeconds(2));

        System.out.println("--- Scenario 2: Recurring task ---");
        scheduler.scheduleRecurring(
                task("RECUR", Priority.MEDIUM, "Recurring tick"),
                now.plusSeconds(1),
                3);

        System.out.println("--- Scenario 3: Priority update ---");
        String updatable = scheduler.schedule(
                task("UPDATE", Priority.LOW, "Priority bump"),
                now.plusSeconds(6));
        scheduler.updatePriority(updatable, Priority.CRITICAL);
        System.out.println("Bumped " + updatable + " to CRITICAL");

        System.out.println("--- Scenario 4: Cancellation ---");
        String doomed = scheduler.schedule(
                task("CANCEL", Priority.MEDIUM, "Should not run"),
                now.plusSeconds(20));
        System.out.println("Cancelled: " + scheduler.cancel(doomed));

        System.out.println("--- Scenario 5: Retry then DLQ ---");
        ScheduledTask flaky = new ScheduledTask("FLAKY", new Runnable() {
            private int calls;

            @Override
            public void run() {
                calls++;
                throw new RuntimeException("simulated failure #" + calls);
            }
        }, now.plusSeconds(3));
        flaky.setMaxRetries(2);
        scheduler.schedule(flaky, now.plusSeconds(3));

        List<ScheduledTask> upcoming = scheduler.tasksInRange(now, now.plusSeconds(10));
        System.out.println("Tasks in next 10s: " + upcoming.size());

        scheduler.start();
        System.out.println("\nScheduler running (8 seconds)...");
        Thread.sleep(8000);
        scheduler.stop();

        System.out.println("Dead-letter queue: " + scheduler.deadLetters().size());
        for (int i = 0; i < scheduler.deadLetters().size(); i++) {
            System.out.println("  " + scheduler.deadLetters().get(i));
        }
        System.out.println("\n=== Demo complete ===");
    }

    private static ScheduledTask task(String name, Priority priority, final String message) {
        ScheduledTask task = new ScheduledTask(name, () -> System.out.println(message + " at " + LocalDateTime.now()), LocalDateTime.now());
        task.setPriority(priority);
        return task;
    }
}
```

</details>

### `TaskScheduler.java`

<details>
<summary>Click to view TaskScheduler.java</summary>

```java
package com.you.lld.problems.taskscheduler;

import com.you.lld.problems.taskscheduler.model.DeadLetterEntry;
import com.you.lld.problems.taskscheduler.model.Priority;
import com.you.lld.problems.taskscheduler.model.ScheduledTask;
import com.you.lld.problems.taskscheduler.service.TaskSchedulerService;
import com.you.lld.problems.taskscheduler.service.impl.PriorityTaskScheduler;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Facade for delayed, priority-based task scheduling.
 */
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
```

</details>

### `model/DeadLetterEntry.java`

<details>
<summary>Click to view model/DeadLetterEntry.java</summary>

```java
package com.you.lld.problems.taskscheduler.model;

import java.time.LocalDateTime;

/**
 * Entry in the dead-letter queue after retries are exhausted.
 */
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
```

</details>

### `model/Priority.java`

<details>
<summary>Click to view model/Priority.java</summary>

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

### `model/Schedule.java`

<details>
<summary>Click to view model/Schedule.java</summary>

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

### `model/ScheduledTask.java`

<details>
<summary>Click to view model/ScheduledTask.java</summary>

```java
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
```

</details>

### `model/Task.java`

<details>
<summary>Click to view model/Task.java</summary>

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

### `model/TaskResult.java`

<details>
<summary>Click to view model/TaskResult.java</summary>

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

### `model/TaskStatus.java`

<details>
<summary>Click to view model/TaskStatus.java</summary>

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

### `service/TaskSchedulerService.java`

<details>
<summary>Click to view service/TaskSchedulerService.java</summary>

```java
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
```

</details>

### `service/impl/PriorityTaskScheduler.java`

<details>
<summary>Click to view service/impl/PriorityTaskScheduler.java</summary>

```java
package com.you.lld.problems.taskscheduler.service.impl;

import com.you.lld.problems.taskscheduler.model.DeadLetterEntry;
import com.you.lld.problems.taskscheduler.model.Priority;
import com.you.lld.problems.taskscheduler.model.ScheduledTask;
import com.you.lld.problems.taskscheduler.service.TaskSchedulerService;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.PriorityQueue;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicLong;

/**
 * Priority-queue scheduler with delayed execution, thread pool, retry, and DLQ.
 */
public class PriorityTaskScheduler implements TaskSchedulerService {

    private final Map<String, ScheduledTask> tasks = new ConcurrentHashMap<String, ScheduledTask>();
    private final PriorityQueue<ScheduledTask> taskQueue = new PriorityQueue<ScheduledTask>();
    private final List<DeadLetterEntry> deadLetterQueue = new ArrayList<DeadLetterEntry>();
    private final AtomicLong taskIdGenerator = new AtomicLong(0);
    private final ScheduledExecutorService poller;
    private final ExecutorService workerPool;
    private volatile boolean running;

    public PriorityTaskScheduler() {
        this(4);
    }

    public PriorityTaskScheduler(int workerThreads) {
        this.poller = Executors.newSingleThreadScheduledExecutor();
        this.workerPool = Executors.newFixedThreadPool(workerThreads);
    }

    @Override
    public String scheduleTask(ScheduledTask task, LocalDateTime scheduledTime) {
        String taskId = "TASK-" + taskIdGenerator.incrementAndGet();
        task.setId(taskId);
        task.setScheduledTime(scheduledTime);
        tasks.put(taskId, task);
        synchronized (taskQueue) {
            taskQueue.offer(task);
        }
        return taskId;
    }

    @Override
    public String scheduleRecurringTask(ScheduledTask task, LocalDateTime startTime, long intervalSeconds) {
        task.setRecurring(true);
        task.setIntervalSeconds(intervalSeconds);
        return scheduleTask(task, startTime);
    }

    @Override
    public boolean cancelTask(String taskId) {
        ScheduledTask task = tasks.get(taskId);
        if (task == null) {
            return false;
        }
        task.cancel();
        tasks.remove(taskId);
        synchronized (taskQueue) {
            taskQueue.remove(task);
        }
        return true;
    }

    @Override
    public int executeDueTasks() {
        LocalDateTime now = LocalDateTime.now();
        List<ScheduledTask> dueTasks = new ArrayList<ScheduledTask>();

        synchronized (taskQueue) {
            while (!taskQueue.isEmpty() && !taskQueue.peek().getScheduledTime().isAfter(now)) {
                ScheduledTask next = taskQueue.poll();
                if (!next.isCancelled()) {
                    dueTasks.add(next);
                }
            }
        }

        for (final ScheduledTask task : dueTasks) {
            workerPool.submit(() -> runTask(task, now));
        }
        return dueTasks.size();
    }

    private void runTask(ScheduledTask task, LocalDateTime executionTime) {
        if (task.isCancelled()) {
            return;
        }
        try {
            task.execute();
            if (task.isRecurring()) {
                task.setScheduledTime(executionTime.plusSeconds(task.getIntervalSeconds()));
                synchronized (taskQueue) {
                    taskQueue.offer(task);
                }
            } else {
                tasks.remove(task.getId());
            }
        } catch (Exception e) {
            task.incrementAttemptCount();
            if (task.canRetry()) {
                task.setScheduledTime(LocalDateTime.now().plusSeconds(1));
                synchronized (taskQueue) {
                    taskQueue.offer(task);
                }
                System.err.println("Retry " + task.getAttemptCount() + "/" + task.getMaxRetries()
                        + " for " + task.getId() + ": " + e.getMessage());
            } else {
                tasks.remove(task.getId());
                synchronized (deadLetterQueue) {
                    deadLetterQueue.add(new DeadLetterEntry(
                            task.getId(), task.getName(), e.getMessage(), task.getAttemptCount()));
                }
                System.err.println("DLQ: " + task.getId() + " — " + e.getMessage());
            }
        }
    }

    @Override
    public List<ScheduledTask> getAllScheduledTasks() {
        return new ArrayList<ScheduledTask>(tasks.values());
    }

    @Override
    public List<ScheduledTask> getTasksInRange(LocalDateTime start, LocalDateTime end) {
        List<ScheduledTask> result = new ArrayList<ScheduledTask>();
        for (ScheduledTask task : tasks.values()) {
            LocalDateTime time = task.getScheduledTime();
            if (!time.isBefore(start) && !time.isAfter(end)) {
                result.add(task);
            }
        }
        return result;
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
    public List<DeadLetterEntry> getDeadLetterQueue() {
        synchronized (deadLetterQueue) {
            return new ArrayList<DeadLetterEntry>(deadLetterQueue);
        }
    }

    @Override
    public void start() {
        if (running) {
            return;
        }
        running = true;
        poller.scheduleAtFixedRate(() -> executeDueTasks(), 0, 1, TimeUnit.SECONDS);
    }

    @Override
    public void stop() {
        running = false;
        poller.shutdown();
        workerPool.shutdown();
        try {
            if (!workerPool.awaitTermination(5, TimeUnit.SECONDS)) {
                workerPool.shutdownNow();
            }
        } catch (InterruptedException e) {
            workerPool.shutdownNow();
            Thread.currentThread().interrupt();
        }
    }
}
```

</details>

### `exceptions/SchedulingException.java`

<details>
<summary>Click to view exceptions/SchedulingException.java</summary>

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

### `exceptions/TaskNotFoundException.java`

<details>
<summary>Click to view exceptions/TaskNotFoundException.java</summary>

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

## Run Demo

```bash
mvn -q compile exec:java -Dexec.mainClass="com.you.lld.problems.taskscheduler.TaskSchedulerDemo"
```
