# Task Management — LLD

Design a task board: CRUD, assignment, priority/tags, overdue queries, Observer on status changes.

## Package Structure

```
taskmanagement/
  model/          Task, TaskStatus, Priority, TaskObserver, User, Team, Comment
  service/        TaskService
  service/impl/   InMemoryTaskService (ConcurrentHashMap + Observer)
  TaskManagement.java   Facade
  TaskManagementDemo.java
```

## Design Patterns

| Pattern | Where | Why |
|---------|-------|-----|
| **Observer** | `TaskObserver` + `InMemoryTaskService` | Notify assignees/dashboard on status transitions without coupling UI. |
| **Facade** | `TaskManagement` | Interview entry point hiding service wiring. |

## Run Demo

```bash
mvn -q compile exec:java -Dexec.mainClass="com.you.lld.problems.taskmanagement.TaskManagementDemo"
```

## Key Talking Points

- **ConcurrentHashMap** for task registry; synchronized observer list copy-on-notify.
- **Overdue query** filters `dueDate < now` AND status ≠ DONE.
- **Status workflow** — TODO → IN_PROGRESS → DONE; Observer fires on every transition.
