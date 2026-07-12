package com.you.lld.problems.taskscheduler;

import com.you.lld.problems.taskscheduler.model.Priority;
import com.you.lld.problems.taskscheduler.model.ScheduledTask;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Demo: delayed tasks, priority queue, retry/DLQ, thread pool.
 */
public class TaskSchedulerDemo {

    public static void main(String[] args) throws InterruptedException {
        System.out.println("=== Task Scheduler Demo ===\n");

        TaskScheduler scheduler = new TaskScheduler();
        LocalDateTime now = LocalDateTime.now();

        System.out.println("--- Scenario 1: Priority at same time ---");
        scheduler.schedule(task("HIGH", Priority.HIGH, "HIGH priority"), now.plusSeconds(2));
        scheduler.schedule(task("LOW", Priority.LOW, "LOW priority"), now.plusSeconds(2));

        System.out.println("--- Scenario 2: Recurring task ---");
        scheduler.scheduleRecurring(
                task("RECUR", Priority.MEDIUM, "Recurring tick"),
                now.plusSeconds(1),
                3);

        System.out.println("--- Scenario 3: Priority update ---");
        String updatable = scheduler.schedule(
                task("UPDATE", Priority.LOW, "Priority bump"),
                now.plusSeconds(6));
        scheduler.updatePriority(updatable, Priority.CRITICAL);
        System.out.println("Bumped " + updatable + " to CRITICAL");

        System.out.println("--- Scenario 4: Cancellation ---");
        String doomed = scheduler.schedule(
                task("CANCEL", Priority.MEDIUM, "Should not run"),
                now.plusSeconds(20));
        System.out.println("Cancelled: " + scheduler.cancel(doomed));

        System.out.println("--- Scenario 5: Retry then DLQ ---");
        ScheduledTask flaky = new ScheduledTask("FLAKY", new Runnable() {
            private int calls;

            @Override
            public void run() {
                calls++;
                throw new RuntimeException("simulated failure #" + calls);
            }
        }, now.plusSeconds(3));
        flaky.setMaxRetries(2);
        scheduler.schedule(flaky, now.plusSeconds(3));

        List<ScheduledTask> upcoming = scheduler.tasksInRange(now, now.plusSeconds(10));
        System.out.println("Tasks in next 10s: " + upcoming.size());

        scheduler.start();
        System.out.println("\nScheduler running (8 seconds)...");
        Thread.sleep(8000);
        scheduler.stop();

        System.out.println("Dead-letter queue: " + scheduler.deadLetters().size());
        for (int i = 0; i < scheduler.deadLetters().size(); i++) {
            System.out.println("  " + scheduler.deadLetters().get(i));
        }
        System.out.println("\n=== Demo complete ===");
    }

    private static ScheduledTask task(String name, Priority priority, final String message) {
        ScheduledTask task = new ScheduledTask(name, new Runnable() {
            @Override
            public void run() {
                System.out.println(message + " at " + LocalDateTime.now());
            }
        }, LocalDateTime.now());
        task.setPriority(priority);
        return task;
    }
}
