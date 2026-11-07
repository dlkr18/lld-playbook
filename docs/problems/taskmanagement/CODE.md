# taskmanagement - Complete Implementation

> Generated from `src/main/java/com/you/lld/problems/taskmanagement/` on 2026-11-07. Re-run `python3 scripts/generate-code-md.py taskmanagement`.

## Project Structure (12 files)

```
taskmanagement/
├── TaskManagementDemo.java
├── TaskManagement.java
├── model/Comment.java
├── model/Priority.java
├── model/Task.java
├── model/TaskObserver.java
├── model/TaskStatus.java
├── model/Team.java
├── model/User.java
├── model/UserRole.java
├── service/TaskService.java
├── service/impl/InMemoryTaskService.java
```

## Source Code

### `TaskManagementDemo.java`

<details>
<summary>Click to view TaskManagementDemo.java</summary>

```java
package com.you.lld.problems.taskmanagement;

import com.you.lld.problems.taskmanagement.model.Priority;
import com.you.lld.problems.taskmanagement.model.Task;
import com.you.lld.problems.taskmanagement.model.TaskObserver;
import com.you.lld.problems.taskmanagement.model.TaskStatus;

import java.time.LocalDateTime;
import java.util.List;

/**
 * SDE3 demo: Observer on status changes, priority filtering, overdue detection, assignment.
 */
public class TaskManagementDemo {

    public static void main(String[] args) {
        System.out.println("=== Task Management (SDE3) ===\n");
        TaskManagement board = new TaskManagement();

        // 1. Observer on status transitions
        System.out.println("--- 1. Observer (status changes) ---");
        board.addObserver(new TaskObserver() {
            @Override
            public void onTaskStatusChanged(Task task, TaskStatus oldStatus, TaskStatus newStatus) {
                System.out.println("  [notify] " + task.getTitle() + ": " + oldStatus + " -> " + newStatus);
            }
        });

        Task login = board.createTask("Implement login", "JWT auth");
        Task bug = board.createTask("Fix checkout bug", "Cart total wrong");
        Task tests = board.createTask("Write unit tests", "OrderService coverage");

        // 2. Assignment + priority
        System.out.println("\n--- 2. Assignment + priority ---");
        board.assignTask(login.getId(), "alice");
        board.assignTask(bug.getId(), "bob");
        board.assignTask(tests.getId(), "alice");
        board.setPriority(bug.getId(), Priority.CRITICAL);
        board.setPriority(login.getId(), Priority.HIGH);
        System.out.println("Alice tasks: " + board.byAssignee("alice").size());
        System.out.println("Critical: " + bug.getTitle());

        // 3. Due dates + overdue query
        System.out.println("\n--- 3. Overdue detection ---");
        board.setDueDate(bug.getId(), LocalDateTime.now().minusDays(1));
        board.setDueDate(login.getId(), LocalDateTime.now().plusDays(3));
        board.updateStatus(bug.getId(), TaskStatus.IN_PROGRESS);
        for (Task t : board.overdue()) {
            System.out.println("  OVERDUE: " + t.getTitle());
        }

        // 4. Tags + status workflow
        System.out.println("\n--- 4. Tags + workflow ---");
        board.addTag(login.getId(), "backend");
        board.addTag(login.getId(), "auth");
        board.updateStatus(login.getId(), TaskStatus.IN_PROGRESS);
        board.updateStatus(login.getId(), TaskStatus.DONE);
        List<Task> inProgress = board.byStatus(TaskStatus.IN_PROGRESS);
        System.out.println("In-progress count: " + inProgress.size());

        // 5. Error handling — complete already-done task is idempotent
        System.out.println("\n--- 5. State idempotency ---");
        board.updateStatus(login.getId(), TaskStatus.DONE);
        System.out.println("Re-complete login: status=" + login.getStatus());

        System.out.println("\n=== Demo complete ===");
    }
}
```

</details>

### `TaskManagement.java`

<details>
<summary>Click to view TaskManagement.java</summary>

```java
package com.you.lld.problems.taskmanagement;

import com.you.lld.problems.taskmanagement.model.Priority;
import com.you.lld.problems.taskmanagement.model.Task;
import com.you.lld.problems.taskmanagement.model.TaskObserver;
import com.you.lld.problems.taskmanagement.model.TaskStatus;
import com.you.lld.problems.taskmanagement.service.TaskService;
import com.you.lld.problems.taskmanagement.service.impl.InMemoryTaskService;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/** Facade for task boards — CRUD, assignment, filtering, Observer on status changes. */
public class TaskManagement {
    private final TaskService service;

    public TaskManagement() {
        this(new InMemoryTaskService());
    }

    public TaskManagement(TaskService service) {
        this.service = service;
    }

    public void addObserver(TaskObserver observer) {
        if (service instanceof InMemoryTaskService) {
            ((InMemoryTaskService) service).addObserver(observer);
        }
    }

    public Task createTask(String title, String description) {
        return service.createTask(title, description);
    }

    public Optional<Task> getTask(String taskId) {
        return service.getTask(taskId);
    }

    public void assignTask(String taskId, String assigneeId) {
        service.assignTask(taskId, assigneeId);
    }

    public void updateStatus(String taskId, TaskStatus status) {
        service.updateTaskStatus(taskId, status);
    }

    public void setPriority(String taskId, Priority priority) {
        service.updateTaskPriority(taskId, priority);
    }

    public void setDueDate(String taskId, LocalDateTime dueDate) {
        service.setDueDate(taskId, dueDate);
    }

    public void addTag(String taskId, String tag) {
        service.addTag(taskId, tag);
    }

    public List<Task> byAssignee(String assigneeId) {
        return service.getTasksByAssignee(assigneeId);
    }

    public List<Task> byStatus(TaskStatus status) {
        return service.getTasksByStatus(status);
    }

    public List<Task> overdue() {
        return service.getOverdueTasks();
    }

    public boolean deleteTask(String taskId) {
        return service.deleteTask(taskId);
    }
}
```

</details>

### `model/Comment.java`

<details>
<summary>Click to view model/Comment.java</summary>

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

</details>

### `model/Priority.java`

<details>
<summary>Click to view model/Priority.java</summary>

```java
package com.you.lld.problems.taskmanagement.model;

public enum Priority {
    LOW,
    MEDIUM,
    HIGH,
    CRITICAL
}
```

</details>

### `model/Task.java`

<details>
<summary>Click to view model/Task.java</summary>

```java
package com.you.lld.problems.taskmanagement.model;

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
        this.tags = new java.util.concurrent.CopyOnWriteArrayList<>();
        this.createdAt = LocalDateTime.now();
    }
    
    // Getters and setters
    public String getId() { return id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public TaskStatus getStatus() { return status; }
    /**
     * Applies a status change, rejecting transitions the lifecycle forbids.
     *
     * <p>Synchronized because callers read the old status and then write the new
     * one; without the lock two threads can both observe the same "old" value and
     * publish contradictory transition events.
     */
    public synchronized void setStatus(TaskStatus next) {
        if (!this.status.canTransitionTo(next)) {
            throw new IllegalStateException(
                    "Illegal transition " + this.status + " -> " + next
                            + " (allowed: " + this.status.allowedNext() + ")");
        }
        this.status = next;
        if (next == TaskStatus.DONE) {
            this.completedAt = LocalDateTime.now();
        } else {
            // Reopening must clear it — otherwise a TODO task reports a completion
            // time, and every "how long did this take" report is wrong.
            this.completedAt = null;
        }
    }

    /** Reads the status and applies the change atomically; returns the previous value. */
    public synchronized TaskStatus transitionTo(TaskStatus next) {
        TaskStatus previous = this.status;
        setStatus(next);
        return previous;
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

</details>

### `model/TaskObserver.java`

<details>
<summary>Click to view model/TaskObserver.java</summary>

```java
package com.you.lld.problems.taskmanagement.model;

public interface TaskObserver {
    void onTaskStatusChanged(Task task, TaskStatus oldStatus, TaskStatus newStatus);
}
```

</details>

### `model/TaskStatus.java`

<details>
<summary>Click to view model/TaskStatus.java</summary>

```java
package com.you.lld.problems.taskmanagement.model;

import java.util.Collections;
import java.util.EnumSet;
import java.util.Set;

/**
 * Task lifecycle, with the legal transitions declared on the enum itself.
 *
 * <p>Keeping the transition table here rather than as {@code if} checks in the
 * service means every caller — current and future — gets the same rules, and the
 * whole state machine is readable in one place.
 *
 * <pre>
 *   TODO         -> IN_PROGRESS, BLOCKED
 *   IN_PROGRESS  -> IN_REVIEW, DONE, BLOCKED, TODO
 *   IN_REVIEW    -> DONE, IN_PROGRESS (review rejected), BLOCKED
 *   BLOCKED      -> TODO, IN_PROGRESS
 *   DONE         -> TODO (reopen; clears completedAt)
 * </pre>
 *
 * Review is optional: IN_PROGRESS may go straight to DONE, as in most trackers.
 * Any status may transition to itself, so repeated updates are idempotent.
 */
public enum TaskStatus {
    TODO,
    IN_PROGRESS,
    IN_REVIEW,
    BLOCKED,
    DONE;

    private Set<TaskStatus> allowedNext;

    static {
        TODO.allowedNext = EnumSet.of(IN_PROGRESS, BLOCKED);
        // DONE directly from IN_PROGRESS: review is optional, as in most trackers.
        IN_PROGRESS.allowedNext = EnumSet.of(IN_REVIEW, DONE, BLOCKED, TODO);
        IN_REVIEW.allowedNext = EnumSet.of(DONE, IN_PROGRESS, BLOCKED);
        BLOCKED.allowedNext = EnumSet.of(TODO, IN_PROGRESS);
        // DONE is reopenable — real trackers allow it — but only back to TODO, and
        // reopening must clear completedAt (see Task.setStatus).
        DONE.allowedNext = EnumSet.of(TODO);
    }

    /** A no-op transition to the same status is always allowed (idempotent updates). */
    public boolean canTransitionTo(TaskStatus next) {
        return this == next || allowedNext.contains(next);
    }

    public Set<TaskStatus> allowedNext() {
        return Collections.unmodifiableSet(allowedNext);
    }

    public boolean isTerminalish() {
        return this == DONE;
    }
}
```

</details>

### `model/Team.java`

<details>
<summary>Click to view model/Team.java</summary>

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

</details>

### `model/User.java`

<details>
<summary>Click to view model/User.java</summary>

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

</details>

### `model/UserRole.java`

<details>
<summary>Click to view model/UserRole.java</summary>

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

</details>

### `service/TaskService.java`

<details>
<summary>Click to view service/TaskService.java</summary>

```java
package com.you.lld.problems.taskmanagement.service;

import com.you.lld.problems.taskmanagement.model.Task;
import com.you.lld.problems.taskmanagement.model.TaskStatus;
import com.you.lld.problems.taskmanagement.model.Priority;

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

</details>

### `service/impl/InMemoryTaskService.java`

<details>
<summary>Click to view service/impl/InMemoryTaskService.java</summary>

```java
package com.you.lld.problems.taskmanagement.service.impl;

import com.you.lld.problems.taskmanagement.model.Task;
import com.you.lld.problems.taskmanagement.model.TaskStatus;
import com.you.lld.problems.taskmanagement.model.Priority;
import com.you.lld.problems.taskmanagement.model.TaskObserver;
import com.you.lld.problems.taskmanagement.service.TaskService;

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
        this.observers = new java.util.concurrent.CopyOnWriteArrayList<>();
        this.idGenerator = new AtomicLong(0);
    }
    
    public void addObserver(TaskObserver observer) {
        observers.add(observer);
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
        Task task = requireTask(taskId);
        task.setTitle(title);
        task.setDescription(description);
        return task;
    }
    
    @Override
    public boolean deleteTask(String taskId) {
        return tasks.remove(taskId) != null;
    }
    
    @Override
    public void assignTask(String taskId, String assigneeId) {
        requireTask(taskId).setAssigneeId(assigneeId);
    }
    
    @Override
    public void updateTaskStatus(String taskId, TaskStatus newStatus) {
        Task task = requireTask(taskId);
        // Read-then-write must be atomic, or two concurrent transitions both report
        // the same "old" status and observers see a history that never happened.
        TaskStatus oldStatus = task.transitionTo(newStatus);
        if (oldStatus != newStatus) {
            notifyObservers(task, oldStatus, newStatus);
        }
    }
    
    @Override
    public void updateTaskPriority(String taskId, Priority priority) {
        requireTask(taskId).setPriority(priority);
    }
    
    @Override
    public void setDueDate(String taskId, LocalDateTime dueDate) {
        requireTask(taskId).setDueDate(dueDate);
    }
    
    @Override
    public void addTag(String taskId, String tag) {
        requireTask(taskId).addTag(tag);
    }

    /**
     * Every mutator used to be {@code if (task != null) { ... }} — a nonexistent id
     * silently did nothing and reported success. Failing loudly is the whole point
     * of having an id.
     */
    private Task requireTask(String taskId) {
        Task task = tasks.get(taskId);
        if (task == null) {
            throw new NoSuchElementException("Task not found: " + taskId);
        }
        return task;
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
    
    /** COW list: registered once at startup, iterated on every change — no copy needed. */
    private void notifyObservers(Task task, TaskStatus oldStatus, TaskStatus newStatus) {
        for (TaskObserver observer : observers) {
            observer.onTaskStatusChanged(task, oldStatus, newStatus);
        }
    }
}
```

</details>

## Run Demo

```bash
mvn -q compile exec:java -Dexec.mainClass="com.you.lld.problems.taskmanagement.TaskManagementDemo"
```
