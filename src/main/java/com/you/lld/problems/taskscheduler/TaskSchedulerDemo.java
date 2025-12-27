package com.you.lld.problems.taskscheduler;

import com.you.lld.problems.taskscheduler.api.TaskSchedulerService;
import com.you.lld.problems.taskscheduler.impl.PriorityTaskScheduler;
import com.you.lld.problems.taskscheduler.model.Priority;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Demonstration of Task Scheduler capabilities.
 * 
 * Features demonstrated:
 * 1. One-time task scheduling
 * 2. Recurring task scheduling
 * 3. Priority-based execution
 * 4. Task cancellation
 * 5. Priority updates
 * 6. Time range queries
 */
public class TaskSchedulerDemo {
    
    public static void main(String[] args) throws InterruptedException {
        System.out.println("=== Task Scheduler Demo ===\n");
        
        TaskSchedulerService scheduler = new PriorityTaskScheduler();
        
        // Demo 1: Schedule one-time tasks with different priorities
        demonstrateOneTimeTasks(scheduler);
        
        // Demo 2: Schedule recurring tasks
        demonstrateRecurringTasks(scheduler);
        
        // Demo 3: Priority updates
        demonstratePriorityUpdates(scheduler);
        
        // Demo 4: Task cancellation
        demonstrateCancellation(scheduler);
        
        // Demo 5: Query tasks in time range
        demonstrateTimeRangeQuery(scheduler);
        
        // Start the scheduler
        scheduler.start();
        
        // Let it run for a bit
        System.out.println("\n⏳ Scheduler running... (waiting 10 seconds)");
        Thread.sleep(10000);
        
        // Stop the scheduler
        scheduler.stop();
        System.out.println("\n✅ Scheduler stopped");
    }
    
    private static void demonstrateOneTimeTasks(TaskSchedulerService scheduler) {
        System.out.println("1️⃣  ONE-TIME TASKS");
        System.out.println("==================");
        
        LocalDateTime now = LocalDateTime.now();
        
        // High priority task (executes in 2 seconds)
        ScheduledTask highPriorityTask = new ScheduledTask(
            "TASK-HIGH",
            () -> System.out.println("🔴 HIGH priority task executed at " + LocalDateTime.now()),
            now.plusSeconds(2)
        );
        highPriorityTask.setPriority(Priority.HIGH);
        String taskId1 = scheduler.scheduleTask(highPriorityTask, now.plusSeconds(2));
        System.out.println("✅ Scheduled HIGH priority task: " + taskId1);
        
        // Low priority task (also at 2 seconds, but should execute after HIGH)
        ScheduledTask lowPriorityTask = new ScheduledTask(
            "TASK-LOW",
            () -> System.out.println("🟢 LOW priority task executed at " + LocalDateTime.now()),
            now.plusSeconds(2)
        );
        lowPriorityTask.setPriority(Priority.LOW);
        String taskId2 = scheduler.scheduleTask(lowPriorityTask, now.plusSeconds(2));
        System.out.println("✅ Scheduled LOW priority task: " + taskId2);
        
        // Critical task (executes in 5 seconds)
        ScheduledTask criticalTask = new ScheduledTask(
            "TASK-CRITICAL",
            () -> System.out.println("🔥 CRITICAL task executed at " + LocalDateTime.now()),
            now.plusSeconds(5)
        );
        criticalTask.setPriority(Priority.CRITICAL);
        String taskId3 = scheduler.scheduleTask(criticalTask, now.plusSeconds(5));
        System.out.println("✅ Scheduled CRITICAL task: " + taskId3);
        
        System.out.println();
    }
    
    private static void demonstrateRecurringTasks(TaskSchedulerService scheduler) {
        System.out.println("2️⃣  RECURRING TASKS");
        System.out.println("===================");
        
        LocalDateTime now = LocalDateTime.now();
        
        // Recurring task every 3 seconds
        ScheduledTask recurringTask = new ScheduledTask(
            "TASK-RECURRING",
            () -> System.out.println("🔄 Recurring task executed at " + LocalDateTime.now()),
            now.plusSeconds(1)
        );
        String taskId = scheduler.scheduleRecurringTask(recurringTask, now.plusSeconds(1), 3);
        System.out.println("✅ Scheduled recurring task (every 3s): " + taskId);
        System.out.println();
    }
    
    private static void demonstratePriorityUpdates(TaskSchedulerService scheduler) {
        System.out.println("3️⃣  PRIORITY UPDATES");
        System.out.println("====================");
        
        LocalDateTime now = LocalDateTime.now();
        
        ScheduledTask task = new ScheduledTask(
            "TASK-UPDATE",
            () -> System.out.println("📝 Updated priority task executed"),
            now.plusSeconds(7)
        );
        task.setPriority(Priority.LOW);
        String taskId = scheduler.scheduleTask(task, now.plusSeconds(7));
        System.out.println("✅ Scheduled task with LOW priority: " + taskId);
        
        // Update to HIGH priority
        boolean updated = scheduler.updateTaskPriority(taskId, Priority.HIGH);
        System.out.println("✅ Updated task to HIGH priority: " + updated);
        System.out.println();
    }
    
    private static void demonstrateCancellation(TaskSchedulerService scheduler) {
        System.out.println("4️⃣  TASK CANCELLATION");
        System.out.println("=====================");
        
        LocalDateTime now = LocalDateTime.now();
        
        ScheduledTask task = new ScheduledTask(
            "TASK-CANCEL",
            () -> System.out.println("❌ This should NOT execute (cancelled)"),
            now.plusSeconds(20)
        );
        String taskId = scheduler.scheduleTask(task, now.plusSeconds(20));
        System.out.println("✅ Scheduled task: " + taskId);
        
        // Cancel it immediately
        boolean cancelled = scheduler.cancelTask(taskId);
        System.out.println("✅ Cancelled task: " + cancelled);
        System.out.println();
    }
    
    private static void demonstrateTimeRangeQuery(TaskSchedulerService scheduler) {
        System.out.println("5️⃣  TIME RANGE QUERY");
        System.out.println("====================");
        
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime start = now;
        LocalDateTime end = now.plusSeconds(10);
        
        List<ScheduledTask> tasksInRange = scheduler.getTasksInRange(start, end);
        System.out.println("📊 Tasks scheduled in next 10 seconds: " + tasksInRange.size());
        
        for (ScheduledTask task : tasksInRange) {
            System.out.println("   - " + task.getTaskId() + 
                             " (Priority: " + task.getPriority() + 
                             ", Time: " + task.getScheduledTime() + ")");
        }
        
        System.out.println();
    }
}
