package com.you.lld.problems.taskscheduler.service.impl;

import com.you.lld.problems.taskscheduler.model.DeadLetterEntry;
import com.you.lld.problems.taskscheduler.model.Priority;
import com.you.lld.problems.taskscheduler.model.ScheduledTask;
import com.you.lld.problems.taskscheduler.service.TaskSchedulerService;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.PriorityQueue;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicLong;

/**
 * Priority-queue scheduler with delayed execution, thread pool, retry, and DLQ.
 */
public class PriorityTaskScheduler implements TaskSchedulerService {

    private final Map<String, ScheduledTask> tasks = new ConcurrentHashMap<String, ScheduledTask>();
    private final PriorityQueue<ScheduledTask> taskQueue = new PriorityQueue<ScheduledTask>();
    private final List<DeadLetterEntry> deadLetterQueue = new ArrayList<DeadLetterEntry>();
    private final AtomicLong taskIdGenerator = new AtomicLong(0);
    private final ScheduledExecutorService poller;
    private final ExecutorService workerPool;
    private volatile boolean running;

    public PriorityTaskScheduler() {
        this(4);
    }

    public PriorityTaskScheduler(int workerThreads) {
        this.poller = Executors.newSingleThreadScheduledExecutor();
        this.workerPool = Executors.newFixedThreadPool(workerThreads);
    }

    @Override
    public String scheduleTask(ScheduledTask task, LocalDateTime scheduledTime) {
        String taskId = "TASK-" + taskIdGenerator.incrementAndGet();
        task.setId(taskId);
        task.setScheduledTime(scheduledTime);
        tasks.put(taskId, task);
        synchronized (taskQueue) {
            taskQueue.offer(task);
        }
        return taskId;
    }

    @Override
    public String scheduleRecurringTask(ScheduledTask task, LocalDateTime startTime, long intervalSeconds) {
        task.setRecurring(true);
        task.setIntervalSeconds(intervalSeconds);
        return scheduleTask(task, startTime);
    }

    @Override
    public boolean cancelTask(String taskId) {
        ScheduledTask task = tasks.get(taskId);
        if (task == null) {
            return false;
        }
        task.cancel();
        tasks.remove(taskId);
        synchronized (taskQueue) {
            taskQueue.remove(task);
        }
        return true;
    }

    @Override
    public int executeDueTasks() {
        LocalDateTime now = LocalDateTime.now();
        List<ScheduledTask> dueTasks = new ArrayList<ScheduledTask>();

        synchronized (taskQueue) {
            while (!taskQueue.isEmpty() && !taskQueue.peek().getScheduledTime().isAfter(now)) {
                ScheduledTask next = taskQueue.poll();
                if (!next.isCancelled()) {
                    dueTasks.add(next);
                }
            }
        }

        for (final ScheduledTask task : dueTasks) {
            workerPool.submit(new Runnable() {
                @Override
                public void run() {
                    runTask(task, now);
                }
            });
        }
        return dueTasks.size();
    }

    private void runTask(ScheduledTask task, LocalDateTime executionTime) {
        if (task.isCancelled()) {
            return;
        }
        try {
            task.execute();
            if (task.isRecurring()) {
                task.setScheduledTime(executionTime.plusSeconds(task.getIntervalSeconds()));
                synchronized (taskQueue) {
                    taskQueue.offer(task);
                }
            } else {
                tasks.remove(task.getId());
            }
        } catch (Exception e) {
            task.incrementAttemptCount();
            if (task.canRetry()) {
                task.setScheduledTime(LocalDateTime.now().plusSeconds(1));
                synchronized (taskQueue) {
                    taskQueue.offer(task);
                }
                System.err.println("Retry " + task.getAttemptCount() + "/" + task.getMaxRetries()
                        + " for " + task.getId() + ": " + e.getMessage());
            } else {
                tasks.remove(task.getId());
                synchronized (deadLetterQueue) {
                    deadLetterQueue.add(new DeadLetterEntry(
                            task.getId(), task.getName(), e.getMessage(), task.getAttemptCount()));
                }
                System.err.println("DLQ: " + task.getId() + " — " + e.getMessage());
            }
        }
    }

    @Override
    public List<ScheduledTask> getAllScheduledTasks() {
        return new ArrayList<ScheduledTask>(tasks.values());
    }

    @Override
    public List<ScheduledTask> getTasksInRange(LocalDateTime start, LocalDateTime end) {
        List<ScheduledTask> result = new ArrayList<ScheduledTask>();
        for (ScheduledTask task : tasks.values()) {
            LocalDateTime time = task.getScheduledTime();
            if (!time.isBefore(start) && !time.isAfter(end)) {
                result.add(task);
            }
        }
        return result;
    }

    @Override
    public boolean updateTaskPriority(String taskId, Priority priority) {
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
    public List<DeadLetterEntry> getDeadLetterQueue() {
        synchronized (deadLetterQueue) {
            return new ArrayList<DeadLetterEntry>(deadLetterQueue);
        }
    }

    @Override
    public void start() {
        if (running) {
            return;
        }
        running = true;
        poller.scheduleAtFixedRate(new Runnable() {
            @Override
            public void run() {
                executeDueTasks();
            }
        }, 0, 1, TimeUnit.SECONDS);
    }

    @Override
    public void stop() {
        running = false;
        poller.shutdown();
        workerPool.shutdown();
        try {
            if (!workerPool.awaitTermination(5, TimeUnit.SECONDS)) {
                workerPool.shutdownNow();
            }
        } catch (InterruptedException e) {
            workerPool.shutdownNow();
            Thread.currentThread().interrupt();
        }
    }
}
