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
