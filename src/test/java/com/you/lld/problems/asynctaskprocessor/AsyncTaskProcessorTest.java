package com.you.lld.problems.asynctaskprocessor;

import com.you.lld.problems.asynctaskprocessor.model.TaskExecutionException;
import com.you.lld.problems.asynctaskprocessor.model.TaskStatus;
import com.you.lld.problems.asynctaskprocessor.service.TaskHandle;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.concurrent.CancellationException;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.CyclicBarrier;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicInteger;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class AsyncTaskProcessorTest {

    private AsyncTaskProcessor processor;

    @BeforeEach
    void setUp() { processor = new AsyncTaskProcessor(3); }

    @AfterEach
    void tearDown() { processor.shutdown(); }

    // ── PART 1: async ────────────────────────────────────────────────────────

    @Test
    void submitReturnsResultThroughHandle() throws Exception {
        TaskHandle<Integer> h = processor.submit("sum", () -> 2 + 3);
        assertEquals(5, h.get());
        assertEquals(TaskStatus.COMPLETED, h.status());
        assertTrue(h.isDone());
    }

    @Test
    void failureSurfacesAsTaskExecutionException() {
        TaskHandle<String> h = processor.submit("boom", () -> { throw new IllegalStateException("x"); });
        assertThrows(TaskExecutionException.class, h::get);
        assertEquals(TaskStatus.FAILED, h.status());
    }

    @Test
    void pendingTaskCanBeCancelledAndNeverRuns() throws Exception {
        AsyncTaskProcessor single = new AsyncTaskProcessor(1);
        try {
            CountDownLatch gate = new CountDownLatch(1);
            single.submit("gate", () -> { gate.await(); return null; });   // occupies the 1 worker
            AtomicBoolean ran = new AtomicBoolean(false);
            TaskHandle<Void> queued = single.submit("queued", () -> { ran.set(true); return null; });

            assertTrue(queued.cancel());
            assertEquals(TaskStatus.CANCELLED, queued.status());
            assertThrows(CancellationException.class, queued::get);

            gate.countDown();                        // release the worker
            Thread.sleep(100);
            assertFalse(ran.get(), "cancelled task must never execute");
        } finally {
            single.shutdown();
        }
    }

    @Test
    void completedTaskCannotBeCancelled() throws Exception {
        TaskHandle<Integer> h = processor.submit("quick", () -> 1);
        h.get();
        assertFalse(h.cancel());
        assertEquals(TaskStatus.COMPLETED, h.status());
    }

    @Test
    void workersRunTasksConcurrently() throws Exception {
        // 3 tasks that all must meet at a barrier — only possible if they run in parallel
        CyclicBarrier barrier = new CyclicBarrier(3);
        CountDownLatch done = new CountDownLatch(3);
        for (int i = 0; i < 3; i++) {
            processor.submit("c" + i, () -> { barrier.await(); done.countDown(); return null; });
        }
        assertTrue(done.await(2, TimeUnit.SECONDS), "3 tasks should run concurrently on a pool of 3");
    }

    @Test
    void submittingAfterShutdownIsRejected() {
        processor.shutdown();
        assertThrows(IllegalStateException.class, () -> processor.submit("x", () -> 1));
    }

    // ── PART 2: scheduling ─────────────────────────────────────────────────────

    @Test
    void scheduleAfterRunsOnce() throws Exception {
        CountDownLatch ran = new CountDownLatch(1);
        processor.scheduleAfter("later", ran::countDown, 40);
        assertTrue(ran.await(1, TimeUnit.SECONDS));
    }

    @Test
    void fixedRateRepeatsThenCancelStops() throws Exception {
        AtomicInteger ticks = new AtomicInteger();
        TaskHandle<Void> h = processor.scheduleAtFixedRate("beat", ticks::incrementAndGet, 20, 30);
        Thread.sleep(200);
        h.cancel();
        int atCancel = ticks.get();
        assertTrue(atCancel >= 2, "should have ticked multiple times, was " + atCancel);
        assertEquals(TaskStatus.CANCELLED, h.status());
        Thread.sleep(120);
        assertEquals(atCancel, ticks.get(), "no ticks after cancel");
    }

    @Test
    void earlierScheduledTaskFiresBeforeLaterOne() throws Exception {
        StringBuilder order = new StringBuilder();
        CountDownLatch both = new CountDownLatch(2);
        // schedule the LATER one first, to prove ordering is by time not insertion
        processor.scheduleAfter("late", () -> { synchronized (order) { order.append("L"); } both.countDown(); }, 150);
        processor.scheduleAfter("early", () -> { synchronized (order) { order.append("E"); } both.countDown(); }, 40);
        assertTrue(both.await(2, TimeUnit.SECONDS));
        assertEquals("EL", order.toString());
    }

    @Test
    void shutdownDrainsQueuedWork() throws Exception {
        AsyncTaskProcessor single = new AsyncTaskProcessor(1);
        AtomicInteger completed = new AtomicInteger();
        for (int i = 0; i < 5; i++) {
            single.submit("t" + i, () -> { Thread.sleep(20); completed.incrementAndGet(); return null; });
        }
        single.shutdown();   // graceful — must finish all 5 queued tasks before returning
        assertEquals(5, completed.get());
    }
}
