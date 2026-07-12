# Source Code

This page contains the complete source code for this problem.

## 📁 Directory Structure

```
├── Demo.java
├── Priority.java
├── Task.java
├── TaskBoard.java
├── TaskObserver.java
├── TaskStatus.java
├── api/TaskService.java
├── impl/InMemoryTaskService.java
├── model/Comment.java
├── model/Team.java
├── model/User.java
├── model/UserRole.java
```

## Demo.java

```java
package com.you.lld.problems.taskmanagement;
public class Demo { public static void main(String[] args) { System.out.println("Task Management"); } }```

## Priority.java

```java
package com.you.lld.problems.taskmanagement;

public enum Priority {
    LOW,
    MEDIUM,
    HIGH,
    CRITICAL
}
```

## Task.java

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

## TaskBoard.java

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

## TaskObserver.java

```java
package com.you.lld.problems.taskmanagement;

public interface TaskObserver {
    void onTaskStatusChanged(Task task, TaskStatus oldStatus, TaskStatus newStatus);
}
```

## TaskStatus.java

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

## TaskService.java

```java
package com.you.lld.problems.taskmanagement.api;

import com.you.lld.problems.taskmanagement.Task;
import com.you.lld.problems.taskmanagement.TaskStatus;
import com.you.lld.problems.taskmanagement.Priority;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Service interface for managing tasks in the task management system.
 * Provides CRUD operations and advanced querying capabilities.
 */
public interface TaskService {
    
    /**
     * Creates a new task with the given title and description.
     * 
     * @param title Task title
     * @param description Task description
     * @return Created task
     */
    Task createTask(String title, String description);
    
    /**
     * Retrieves a task by its ID.
     * 
     * @param taskId Task identifier
     * @return Optional containing the task if found
     */
    Optional<Task> getTask(String taskId);
    
    /**
     * Updates an existing task's properties.
     * 
     * @param taskId Task identifier
     * @param title New title
     * @param description New description
     * @return Updated task
     */
    Task updateTask(String taskId, String title, String description);
    
    /**
     * Deletes a task by its ID.
     * 
     * @param taskId Task identifier
     * @return true if deleted successfully
     */
    boolean deleteTask(String taskId);
    
    /**
     * Assigns a task to a user.
     * 
     * @param taskId Task identifier
     * @param assigneeId User identifier
     */
    void assignTask(String taskId, String assigneeId);
    
    /**
     * Changes the status of a task.
     * 
     * @param taskId Task identifier
     * @param newStatus New status to set
     */
    void updateTaskStatus(String taskId, TaskStatus newStatus);
    
    /**
     * Changes the priority of a task.
     * 
     * @param taskId Task identifier
     * @param priority New priority level
     */
    void updateTaskPriority(String taskId, Priority priority);
    
    /**
     * Sets a due date for the task.
     * 
     * @param taskId Task identifier
     * @param dueDate Due date to set
     */
    void setDueDate(String taskId, LocalDateTime dueDate);
    
    /**
     * Adds a tag to a task.
     * 
     * @param taskId Task identifier
     * @param tag Tag to add
     */
    void addTag(String taskId, String tag);
    
    /**
     * Retrieves all tasks with a specific status.
     * 
     * @param status Status to filter by
     * @return List of matching tasks
     */
    List<Task> getTasksByStatus(TaskStatus status);
    
    /**
     * Retrieves all tasks assigned to a specific user.
     * 
     * @param assigneeId User identifier
     * @return List of assigned tasks
     */
    List<Task> getTasksByAssignee(String assigneeId);
    
    /**
     * Retrieves all tasks with a specific priority.
     * 
     * @param priority Priority level to filter by
     * @return List of matching tasks
     */
    List<Task> getTasksByPriority(Priority priority);
    
    /**
     * Retrieves all tasks with a specific tag.
     * 
     * @param tag Tag to search for
     * @return List of matching tasks
     */
    List<Task> getTasksByTag(String tag);
    
    /**
     * Retrieves all overdue tasks.
     * 
     * @return List of overdue tasks
     */
    List<Task> getOverdueTasks();
    
    /**
     * Retrieves all tasks created within a date range.
     * 
     * @param start Start date
     * @param end End date
     * @return List of tasks created in range
     */
    List<Task> getTasksCreatedBetween(LocalDateTime start, LocalDateTime end);
}

```

## InMemoryTaskService.java

```java
package com.you.lld.problems.taskmanagement.impl;

import com.you.lld.problems.taskmanagement.Task;
import com.you.lld.problems.taskmanagement.TaskStatus;
import com.you.lld.problems.taskmanagement.Priority;
import com.you.lld.problems.taskmanagement.TaskObserver;
import com.you.lld.problems.taskmanagement.api.TaskService;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

/**
 * Thread-safe in-memory implementation of TaskService.
 * Uses ConcurrentHashMap for concurrent access.
 */
public class InMemoryTaskService implements TaskService {
    
    private final Map<String, Task> tasks;
    private final List<TaskObserver> observers;
    private final AtomicLong idGenerator;
    
    public InMemoryTaskService() {
        this.tasks = new ConcurrentHashMap<>();
        this.observers = new ArrayList<>();
        this.idGenerator = new AtomicLong(0);
    }
    
    public void addObserver(TaskObserver observer) {
        synchronized (observers) {
            observers.add(observer);
        }
    }
    
    @Override
    public Task createTask(String title, String description) {
        String taskId = "TASK-" + idGenerator.incrementAndGet();
        Task task = new Task(taskId, title);
        task.setDescription(description);
        tasks.put(taskId, task);
        notifyObservers(task, null, task.getStatus());
        return task;
    }
    
    @Override
    public Optional<Task> getTask(String taskId) {
        return Optional.ofNullable(tasks.get(taskId));
    }
    
    @Override
    public Task updateTask(String taskId, String title, String description) {
        Task task = tasks.get(taskId);
        if (task != null) {
            task.setTitle(title);
            task.setDescription(description);
        }
        return task;
    }
    
    @Override
    public boolean deleteTask(String taskId) {
        return tasks.remove(taskId) != null;
    }
    
    @Override
    public void assignTask(String taskId, String assigneeId) {
        Task task = tasks.get(taskId);
        if (task != null) {
            task.setAssigneeId(assigneeId);
        }
    }
    
    @Override
    public void updateTaskStatus(String taskId, TaskStatus newStatus) {
        Task task = tasks.get(taskId);
        if (task != null) {
            TaskStatus oldStatus = task.getStatus();
            task.setStatus(newStatus);
            notifyObservers(task, oldStatus, newStatus);
        }
    }
    
    @Override
    public void updateTaskPriority(String taskId, Priority priority) {
        Task task = tasks.get(taskId);
        if (task != null) {
            task.setPriority(priority);
        }
    }
    
    @Override
    public void setDueDate(String taskId, LocalDateTime dueDate) {
        Task task = tasks.get(taskId);
        if (task != null) {
            task.setDueDate(dueDate);
        }
    }
    
    @Override
    public void addTag(String taskId, String tag) {
        Task task = tasks.get(taskId);
        if (task != null) {
            task.addTag(tag);
        }
    }
    
    @Override
    public List<Task> getTasksByStatus(TaskStatus status) {
        return tasks.values().stream()
                .filter(t -> t.getStatus() == status)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<Task> getTasksByAssignee(String assigneeId) {
        return tasks.values().stream()
                .filter(t -> assigneeId.equals(t.getAssigneeId()))
                .collect(Collectors.toList());
    }
    
    @Override
    public List<Task> getTasksByPriority(Priority priority) {
        return tasks.values().stream()
                .filter(t -> t.getPriority() == priority)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<Task> getTasksByTag(String tag) {
        return tasks.values().stream()
                .filter(t -> t.getTags().contains(tag))
                .collect(Collectors.toList());
    }
    
    @Override
    public List<Task> getOverdueTasks() {
        LocalDateTime now = LocalDateTime.now();
        return tasks.values().stream()
                .filter(t -> t.getDueDate() != null && t.getDueDate().isBefore(now))
                .filter(t -> t.getStatus() != TaskStatus.DONE)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<Task> getTasksCreatedBetween(LocalDateTime start, LocalDateTime end) {
        return tasks.values().stream()
                .filter(t -> !t.getCreatedAt().isBefore(start) && !t.getCreatedAt().isAfter(end))
                .collect(Collectors.toList());
    }
    
    private void notifyObservers(Task task, TaskStatus oldStatus, TaskStatus newStatus) {
        List<TaskObserver> observersCopy;
        synchronized (observers) {
            observersCopy = new ArrayList<>(observers);
        }
        for (TaskObserver observer : observersCopy) {
            observer.onTaskStatusChanged(task, oldStatus, newStatus);
        }
    }
}

```

## Comment.java

```java
package com.you.lld.problems.taskmanagement.model;

import java.time.LocalDateTime;

/**
 * Represents a comment on a task.
 */
public class Comment {
    private final String id;
    private final String taskId;
    private final String authorId;
    private String content;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public Comment(String id, String taskId, String authorId, String content) {
        this.id = id;
        this.taskId = taskId;
        this.authorId = authorId;
        this.content = content;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    public String getId() {
        return id;
    }
    
    public String getTaskId() {
        return taskId;
    }
    
    public String getAuthorId() {
        return authorId;
    }
    
    public String getContent() {
        return content;
    }
    
    public void setContent(String content) {
        this.content = content;
        this.updatedAt = LocalDateTime.now();
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public boolean isEdited() {
        return !createdAt.equals(updatedAt);
    }
}

```

## Team.java

```java
package com.you.lld.problems.taskmanagement.model;

import java.time.LocalDateTime;
import java.util.*;

/**
 * Represents a team of users working on related tasks.
 */
public class Team {
    private final String id;
    private String name;
    private String description;
    private Set<String> memberIds;
    private String managerId;
    private LocalDateTime createdAt;
    
    public Team(String id, String name) {
        this.id = id;
        this.name = name;
        this.memberIds = new HashSet<>();
        this.createdAt = LocalDateTime.now();
    }
    
    public String getId() {
        return id;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public Set<String> getMemberIds() {
        return new HashSet<>(memberIds);
    }
    
    public void addMember(String userId) {
        memberIds.add(userId);
    }
    
    public void removeMember(String userId) {
        memberIds.remove(userId);
        if (userId.equals(managerId)) {
            managerId = null;
        }
    }
    
    public String getManagerId() {
        return managerId;
    }
    
    public void setManagerId(String managerId) {
        if (memberIds.contains(managerId)) {
            this.managerId = managerId;
        }
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public int getMemberCount() {
        return memberIds.size();
    }
}

```

## User.java

```java
package com.you.lld.problems.taskmanagement.model;

import java.time.LocalDateTime;
import java.util.*;

/**
 * Represents a user in the task management system.
 */
public class User {
    private final String id;
    private String username;
    private String email;
    private String fullName;
    private UserRole role;
    private List<String> teamIds;
    private LocalDateTime createdAt;
    private boolean active;
    
    public User(String id, String username, String email) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.role = UserRole.MEMBER;
        this.teamIds = new ArrayList<>();
        this.createdAt = LocalDateTime.now();
        this.active = true;
    }
    
    // Getters
    public String getId() {
        return id;
    }
    
    public String getUsername() {
        return username;
    }
    
    public void setUsername(String username) {
        this.username = username;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getFullName() {
        return fullName;
    }
    
    public void setFullName(String fullName) {
        this.fullName = fullName;
    }
    
    public UserRole getRole() {
        return role;
    }
    
    public void setRole(UserRole role) {
        this.role = role;
    }
    
    public List<String> getTeamIds() {
        return new ArrayList<>(teamIds);
    }
    
    public void addTeam(String teamId) {
        if (!teamIds.contains(teamId)) {
            teamIds.add(teamId);
        }
    }
    
    public void removeTeam(String teamId) {
        teamIds.remove(teamId);
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public boolean isActive() {
        return active;
    }
    
    public void setActive(boolean active) {
        this.active = active;
    }
}

```

## UserRole.java

```java
package com.you.lld.problems.taskmanagement.model;

/**
 * Roles that can be assigned to users in the task management system.
 */
public enum UserRole {
    ADMIN,      // Full system access, user management
    MANAGER,    // Team management, task assignment
    MEMBER,     // Regular user, can create and work on tasks
    VIEWER      // Read-only access
}

```

