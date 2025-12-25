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
