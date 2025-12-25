# Task Management

## 19 Files

### Demo.java
```java
package com.you.lld.problems.taskmanagement;
public class Demo { public static void main(String[] args) { System.out.println("Task Management"); } }
```

### Priority.java
```java
package com.you.lld.problems.taskmanagement;

public enum Priority {
    LOW,
    MEDIUM,
    HIGH,
    CRITICAL
}

```

### Task.java
```java
package com.you.lld.problems.taskmanagement;

import java.time.LocalDateTime;
import java.util.*;

public class Task {
    private final String id;
    private String title;
    private String description;
    private TaskStatus status;
    private Priority priority;
    private String assigneeId;
    private List<String> tags;
    private LocalDateTime createdAt;
    private LocalDateTime dueDate;
    private LocalDateTime completedAt;
    
    public Task(String id, String title) {
        this.id = id;
        this.title = title;
        this.status = TaskStatus.TODO;
        this.priority = Priority.MEDIUM;
        this.tags = new ArrayList<>();
        this.createdAt = LocalDateTime.now();
    }
    
    // Getters and setters
    public String getId() { return id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public TaskStatus getStatus() { return status; }
    public void setStatus(TaskStatus status) { 
        this.status = status;
        if (status == TaskStatus.DONE) {
            this.completedAt = LocalDateTime.now();
        }
    }
    public Priority getPriority() { return priority; }
    public void setPriority(Priority priority) { this.priority = priority; }
    public String getAssigneeId() { return assigneeId; }
    public void setAssigneeId(String assigneeId) { this.assigneeId = assigneeId; }
    public List<String> getTags() { return new ArrayList<>(tags); }
    public void addTag(String tag) { this.tags.add(tag); }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getDueDate() { return dueDate; }
    public void setDueDate(LocalDateTime dueDate) { this.dueDate = dueDate; }
    public LocalDateTime getCompletedAt() { return completedAt; }
}

```

### TaskBoard.java
```java
package com.you.lld.problems.taskmanagement;

import java.util.*;
import java.util.stream.Collectors;

public class TaskBoard {
    private final Map<String, Task> tasks;
    private final List<TaskObserver> observers;
    
    public TaskBoard() {
        this.tasks = new HashMap<>();
        this.observers = new ArrayList<>();
    }
    
    public void addObserver(TaskObserver observer) {
        observers.add(observer);
    }
    
    public void createTask(Task task) {
        tasks.put(task.getId(), task);
        notifyObservers(task, null, task.getStatus());
    }
    
    public void updateTaskStatus(String taskId, TaskStatus newStatus) {
        Task task = tasks.get(taskId);
        if (task != null) {
            TaskStatus oldStatus = task.getStatus();
            task.setStatus(newStatus);
            notifyObservers(task, oldStatus, newStatus);
        }
    }
    
    public List<Task> getTasksByStatus(TaskStatus status) {
        return tasks.values().stream()
            .filter(t -> t.getStatus() == status)
            .collect(Collectors.toList());
    }
    
    public List<Task> getTasksByAssignee(String assigneeId) {
        return tasks.values().stream()
            .filter(t -> assigneeId.equals(t.getAssigneeId()))
            .collect(Collectors.toList());
    }
    
    private void notifyObservers(Task task, TaskStatus oldStatus, TaskStatus newStatus) {
        for (TaskObserver observer : observers) {
            observer.onTaskStatusChanged(task, oldStatus, newStatus);
        }
    }
}

```

### TaskObserver.java
```java
package com.you.lld.problems.taskmanagement;

public interface TaskObserver {
    void onTaskStatusChanged(Task task, TaskStatus oldStatus, TaskStatus newStatus);
}

```

### TaskStatus.java
```java
package com.you.lld.problems.taskmanagement;

public enum TaskStatus {
    TODO,
    IN_PROGRESS,
    IN_REVIEW,
    BLOCKED,
    DONE
}

```

### Service.java
```java
package com.you.lld.problems.taskmanagement.api;
public interface Service { }
```

### Exception0.java
```java
package com.you.lld.problems.taskmanagement.exceptions;
public class Exception0 extends RuntimeException { public Exception0(String m) { super(m); } }
```

### Exception1.java
```java
package com.you.lld.problems.taskmanagement.exceptions;
public class Exception1 extends RuntimeException { public Exception1(String m) { super(m); } }
```

### Exception2.java
```java
package com.you.lld.problems.taskmanagement.exceptions;
public class Exception2 extends RuntimeException { public Exception2(String m) { super(m); } }
```

### ServiceImpl.java
```java
package com.you.lld.problems.taskmanagement.impl;
import com.you.lld.problems.taskmanagement.api.*;
public class ServiceImpl implements Service { }
```

### Model0.java
```java
package com.you.lld.problems.taskmanagement.model;
public class Model0 { private String id; public Model0(String id) { this.id=id; } }
```

### Model1.java
```java
package com.you.lld.problems.taskmanagement.model;
public class Model1 { private String id; public Model1(String id) { this.id=id; } }
```

### Model2.java
```java
package com.you.lld.problems.taskmanagement.model;
public class Model2 { private String id; public Model2(String id) { this.id=id; } }
```

### Model3.java
```java
package com.you.lld.problems.taskmanagement.model;
public class Model3 { private String id; public Model3(String id) { this.id=id; } }
```

### Model4.java
```java
package com.you.lld.problems.taskmanagement.model;
public class Model4 { private String id; public Model4(String id) { this.id=id; } }
```

### Model5.java
```java
package com.you.lld.problems.taskmanagement.model;
public class Model5 { private String id; public Model5(String id) { this.id=id; } }
```

### Model6.java
```java
package com.you.lld.problems.taskmanagement.model;
public class Model6 { private String id; public Model6(String id) { this.id=id; } }
```

### Model7.java
```java
package com.you.lld.problems.taskmanagement.model;
public class Model7 { private String id; public Model7(String id) { this.id=id; } }
```

