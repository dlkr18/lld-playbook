package com.you.lld.problems.taskscheduler;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.*;

public class TaskScheduler {
    private final PriorityQueue<ScheduledTask> taskQueue;
    private final ExecutorService executor;
    private final ScheduledExecutorService scheduler;
    
    public TaskScheduler() {
        this.taskQueue = new PriorityQueue<>(
            Comparator.comparing(ScheduledTask::getScheduledTime)
        );
        this.executor = Executors.newFixedThreadPool(4);
        this.scheduler = Executors.newScheduledThreadPool(1);
        startScheduler();
    }
    
    public void scheduleTask(ScheduledTask task) {
        synchronized (taskQueue) {
            taskQueue.offer(task);
        }
    }
    
    private void startScheduler() {
        scheduler.scheduleAtFixedRate(() -> {
            LocalDateTime now = LocalDateTime.now();
            synchronized (taskQueue) {
                while (!taskQueue.isEmpty() && 
                       !taskQueue.peek().getScheduledTime().isAfter(now)) {
                    ScheduledTask task = taskQueue.poll();
                    if (!task.isExecuted()) {
                        executor.submit(() -> {
                            task.getTask().run();
                            task.markExecuted();
                        });
                    }
                }
            }
        }, 0, 1, TimeUnit.SECONDS);
    }
    
    public void shutdown() {
        executor.shutdown();
        scheduler.shutdown();
    }
}
