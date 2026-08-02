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

