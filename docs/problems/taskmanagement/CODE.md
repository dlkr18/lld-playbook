# taskmanagement - Complete Implementation

## 📁 Project Structure (6 files)

```
taskmanagement/
├── Demo.java
├── Priority.java
├── Task.java
├── TaskBoard.java
├── TaskObserver.java
├── TaskStatus.java
```

## 📝 Source Code

### 📄 `Demo.java`

```java
package com.you.lld.problems.taskmanagement;
public class Demo { public static void main(String[] args) { System.out.println("Task Management"); } }```

### 📄 `Priority.java`

```java
package com.you.lld.problems.taskmanagement;

public enum Priority {
    LOW,
    MEDIUM,
    HIGH,
    CRITICAL
}
```

### 📄 `Task.java`

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

### 📄 `TaskBoard.java`

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

### 📄 `TaskObserver.java`

```java
package com.you.lld.problems.taskmanagement;

public interface TaskObserver {
    void onTaskStatusChanged(Task task, TaskStatus oldStatus, TaskStatus newStatus);
}
```

### 📄 `TaskStatus.java`

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

