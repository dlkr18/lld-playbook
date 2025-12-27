# taskscheduler - Complete Implementation

## 📁 Project Structure (9 files)

```
taskscheduler/
├── ScheduledTask.java
├── TaskScheduler.java
├── exceptions/SchedulingException.java
├── exceptions/TaskNotFoundException.java
├── model/Priority.java
├── model/Schedule.java
├── model/Task.java
├── model/TaskResult.java
├── model/TaskStatus.java
```

## 📝 Source Code

### 📄 `ScheduledTask.java`

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

### 📄 `TaskScheduler.java`

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

### 📄 `exceptions/SchedulingException.java`

```java
package com.you.lld.problems.taskscheduler.exceptions;
public class SchedulingException extends RuntimeException { public SchedulingException(String m) { super(m); } }```

### 📄 `exceptions/TaskNotFoundException.java`

```java
package com.you.lld.problems.taskscheduler.exceptions;
public class TaskNotFoundException extends RuntimeException { public TaskNotFoundException(String m) { super(m); } }```

### 📄 `model/Priority.java`

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

### 📄 `model/Schedule.java`

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

### 📄 `model/Task.java`

```java
package com.you.lld.problems.taskscheduler.model;
import java.util.*;
public class Task { private String taskId; public Task(String id) { taskId=id; } public String getTaskId() { return taskId; } }```

### 📄 `model/TaskResult.java`

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

### 📄 `model/TaskStatus.java`

```java
package com.you.lld.problems.taskscheduler.model;
public enum TaskStatus { ACTIVE, INACTIVE, PENDING, COMPLETED }```

