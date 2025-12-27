package com.you.lld.problems.taskscheduler.impl;

import com.you.lld.problems.taskscheduler.api.TaskSchedulerService;
import com.you.lld.problems.taskscheduler.model.ScheduledTask;
import com.you.lld.problems.taskscheduler.model.TaskPriority;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

/**
 * Priority-based task scheduler with thread-safe operations.
 */
public class PriorityTaskScheduler implements TaskSchedulerService {
    
    private final Map<String, ScheduledTask> tasks;
    private final PriorityQueue<ScheduledTask> taskQueue;
    private final AtomicLong taskIdGenerator;
    private final ScheduledExecutorService executor;
    private boolean running;
    
    public PriorityTaskScheduler() {
        this.tasks = new ConcurrentHashMap<>();
        this.taskQueue = new PriorityQueue<>(Comparator
            .comparing(ScheduledTask::getScheduledTime)
            .thenComparing(ScheduledTask::getPriority));
        this.taskIdGenerator = new AtomicLong(0);
        this.executor = Executors.newScheduledThreadPool(4);
        this.running = false;
    }
    
    @Override
    public String scheduleTask(ScheduledTask task, LocalDateTime scheduledTime) {
        String taskId = "TASK-" + taskIdGenerator.incrementAndGet();
        task.setScheduledTime(scheduledTime);
        task.setId(taskId);
        
        tasks.put(taskId, task);
        synchronized (taskQueue) {
            taskQueue.offer(task);
        }
        
        return taskId;
    }
    
    @Override
    public String scheduleRecurringTask(ScheduledTask task, LocalDateTime startTime, long intervalSeconds) {
        String taskId = scheduleTask(task, startTime);
        task.setRecurring(true);
        task.setIntervalSeconds(intervalSeconds);
        return taskId;
    }
    
    @Override
    public boolean cancelTask(String taskId) {
        ScheduledTask task = tasks.remove(taskId);
        if (task == null) {
            return false;
        }
        
        synchronized (taskQueue) {
            taskQueue.remove(task);
        }
        
        return true;
    }
    
    @Override
    public int executeDueTasks() {
        LocalDateTime now = LocalDateTime.now();
        List<ScheduledTask> dueTasks = new ArrayList<>();
        
        synchronized (taskQueue) {
            while (!taskQueue.isEmpty() && 
                   !taskQueue.peek().getScheduledTime().isAfter(now)) {
                dueTasks.add(taskQueue.poll());
            }
        }
        
        for (ScheduledTask task : dueTasks) {
            executor.submit(() -> {
                try {
                    task.execute();
                    
                    // Reschedule if recurring
                    if (task.isRecurring()) {
                        LocalDateTime nextTime = now.plusSeconds(task.getIntervalSeconds());
                        task.setScheduledTime(nextTime);
                        synchronized (taskQueue) {
                            taskQueue.offer(task);
                        }
                    } else {
                        tasks.remove(task.getId());
                    }
                } catch (Exception e) {
                    System.err.println("Task execution failed: " + e.getMessage());
                }
            });
        }
        
        return dueTasks.size();
    }
    
    @Override
    public List<ScheduledTask> getAllScheduledTasks() {
        return new ArrayList<>(tasks.values());
    }
    
    @Override
    public List<ScheduledTask> getTasksInRange(LocalDateTime start, LocalDateTime end) {
        return tasks.values().stream()
            .filter(t -> !t.getScheduledTime().isBefore(start) && 
                        !t.getScheduledTime().isAfter(end))
            .collect(Collectors.toList());
    }
    
    @Override
    public boolean updateTaskPriority(String taskId, TaskPriority priority) {
        ScheduledTask task = tasks.get(taskId);
        if (task == null) {
            return false;
        }
        
        synchronized (taskQueue) {
            taskQueue.remove(task);
            task.setPriority(priority);
            taskQueue.offer(task);
        }
        
        return true;
    }
    
    @Override
    public void start() {
        if (running) {
            return;
        }
        
        running = true;
        executor.scheduleAtFixedRate(
            this::executeDueTasks,
            0,
            1,
            TimeUnit.SECONDS
        );
    }
    
    @Override
    public void stop() {
        running = false;
        executor.shutdown();
        try {
            if (!executor.awaitTermination(5, TimeUnit.SECONDS)) {
                executor.shutdownNow();
            }
        } catch (InterruptedException e) {
            executor.shutdownNow();
            Thread.currentThread().interrupt();
        }
    }
}

