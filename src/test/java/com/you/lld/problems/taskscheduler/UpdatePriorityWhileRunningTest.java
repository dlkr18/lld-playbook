package com.you.lld.problems.taskscheduler;

import com.you.lld.problems.taskscheduler.model.Priority;
import com.you.lld.problems.taskscheduler.model.ScheduledTask;
import com.you.lld.problems.taskscheduler.service.impl.PriorityTaskScheduler;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

import static org.junit.jupiter.api.Assertions.*;

class UpdatePriorityWhileRunningTest {

    @Test
    void changingPriorityOfARunningTaskDoesNotQueueItAgain() throws Exception {
        PriorityTaskScheduler scheduler = new PriorityTaskScheduler(2);
        final CountDownLatch started = new CountDownLatch(1);
        final CountDownLatch release = new CountDownLatch(1);
        final AtomicInteger runs = new AtomicInteger();
        ScheduledTask task = new ScheduledTask("report", () -> {
            runs.incrementAndGet();
            started.countDown();
            try {
                release.await(5, TimeUnit.SECONDS);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }, LocalDateTime.now());
        try {
            String id = scheduler.scheduleTask(task, LocalDateTime.now().minusSeconds(1));
            assertEquals(1, scheduler.executeDueTasks());
            assertTrue(started.await(2, TimeUnit.SECONDS));

            assertTrue(scheduler.updateTaskPriority(id, Priority.HIGH));
            assertEquals(0, scheduler.executeDueTasks(), "running task was put back in the queue");
        } finally {
            release.countDown();
            scheduler.stop();
        }
        assertEquals(1, runs.get());
    }
}
