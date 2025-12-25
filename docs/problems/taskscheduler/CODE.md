# Task Scheduler

## Difficulty: Hard | Pattern: Priority Queue, State

```java
class TaskScheduler {
    private PriorityQueue<ScheduledTask> taskQueue;
    private ExecutorService executor;
    
    void schedule(Task task, long delayMillis);
    void scheduleRecurring(Task task, long intervalMillis);
    void cancel(String taskId);
}

class ScheduledTask implements Comparable<ScheduledTask> {
    Task task;
    long executionTime;
    boolean recurring;
}
```

**Status**: ✅ Documented
