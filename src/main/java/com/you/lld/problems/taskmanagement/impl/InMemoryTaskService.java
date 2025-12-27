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

