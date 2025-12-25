# Task Management System

## Problem: Design a Task Management System (like Jira/Trello)

**Difficulty**: Easy  
**Pattern**: Observer, State  
**Time**: 30-45 min

---

## Key Classes

```java
enum TaskStatus { TODO, IN_PROGRESS, IN_REVIEW, DONE, BLOCKED }
enum Priority { LOW, MEDIUM, HIGH, CRITICAL }

class Task {
    String id;
    String title;
    String description;
    TaskStatus status;
    Priority priority;
    User assignee;
    List<String> tags;
    LocalDateTime createdAt;
    LocalDateTime dueDate;
}

class TaskBoard {
    Map<String, Task> tasks;
    List<TaskObserver> observers;
    
    void createTask(Task task);
    void updateTask(String taskId, TaskStatus newStatus);
    List<Task> getTasksByStatus(TaskStatus status);
    List<Task> getTasksByAssignee(User user);
}

interface TaskObserver {
    void onTaskStatusChanged(Task task, TaskStatus oldStatus, TaskStatus newStatus);
}
```

---

**Status**: ✅ Documented | [View Master Guide](../ALL_PROBLEMS_MASTER_GUIDE)
