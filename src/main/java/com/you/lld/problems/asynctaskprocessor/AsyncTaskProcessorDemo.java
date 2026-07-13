package com.you.lld.problems.asynctaskprocessor;

import com.you.lld.problems.asynctaskprocessor.model.TaskExecutionException;
import com.you.lld.problems.asynctaskprocessor.service.TaskHandle;

import java.time.Instant;
import java.util.concurrent.CancellationException;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Demo of the async task processor and its scheduling extension:
 *   PART 1 (async):   submit -> TaskHandle (future); get result; failure; cancel; parallelism
 *   PART 2 (schedule): after a delay; at an instant; fixed-rate repeating (then cancel)
 */
public class AsyncTaskProcessorDemo {

    public static void main(String[] args) throws Exception {
        AsyncTaskProcessor processor = new AsyncTaskProcessor(3);
        try {
            partOneAsync(processor);
            partTwoScheduling(processor);
        } finally {
            processor.shutdown();
            System.out.println("\n[shutdown] scheduler + workers stopped cleanly");
        }
        System.out.println("\n=== demo complete ===");
    }

    private static void partOneAsync(AsyncTaskProcessor p) throws Exception {
        header("PART 1 — async submit + TaskHandle (future)");

        TaskHandle<Integer> sum = p.submit("sum", () -> {
            Thread.sleep(120);                 // pretend it's slow
            return 2 + 3;
        });
        System.out.println("   submitted 'sum' — status right away: " + sum.status() + " (caller did NOT block)");
        System.out.println("   sum.get() = " + sum.get() + "  (now " + sum.status() + ")");

        header("failure surfaces through get()");
        TaskHandle<String> boom = p.submit("boom", () -> { throw new IllegalStateException("kaboom"); });
        try { boom.get(); }
        catch (TaskExecutionException e) { System.out.println("   caught: " + e.getMessage() + " (status " + boom.status() + ")"); }

        header("cancel a task before it starts");
        // flood the 3 workers so this one waits in the queue, then cancel it
        for (int i = 0; i < 6; i++) p.submit("filler-" + i, () -> { Thread.sleep(80); return null; });
        TaskHandle<Void> late = p.submit("late", () -> { System.out.println("   late ran (unexpected)"); return null; });
        boolean cancelled = late.cancel();
        System.out.println("   late.cancel() = " + cancelled + " -> status " + late.status());
        try { late.get(); } catch (CancellationException e) { System.out.println("   get() threw CancellationException as expected"); }

        header("parallelism — 3 workers run concurrently");
        AtomicInteger peak = new AtomicInteger();
        AtomicInteger active = new AtomicInteger();
        for (int i = 0; i < 6; i++) {
            p.submit("par-" + i, () -> {
                int now = active.incrementAndGet();
                peak.accumulateAndGet(now, Math::max);
                Thread.sleep(60);
                active.decrementAndGet();
                return null;
            });
        }
        Thread.sleep(300);
        System.out.println("   peak concurrent tasks observed: " + peak.get() + "  (pool size 3)");
    }

    private static void partTwoScheduling(AsyncTaskProcessor p) throws Exception {
        header("PART 2 — scheduleAfter (run once, later)");
        long t0 = System.currentTimeMillis();
        p.scheduleAfter("delayed", () ->
            System.out.println("   'delayed' fired at +" + (System.currentTimeMillis() - t0) + "ms"), 150);
        System.out.println("   scheduled 'delayed' for +150ms (caller returns immediately)");

        header("scheduleAt (run once, at a specific instant)");
        Instant when = Instant.now().plusMillis(250);
        p.scheduleAt("at-instant", () ->
            System.out.println("   'at-instant' fired at +" + (System.currentTimeMillis() - t0) + "ms"), when);
        System.out.println("   scheduled 'at-instant' for " + when);

        header("scheduleAtFixedRate (repeat every 100ms, then cancel)");
        AtomicInteger ticks = new AtomicInteger();
        TaskHandle<Void> ticker = p.scheduleAtFixedRate("heartbeat", () -> {
            int n = ticks.incrementAndGet();
            System.out.println("   heartbeat tick #" + n + " at +" + (System.currentTimeMillis() - t0) + "ms");
        }, 100, 100);

        Thread.sleep(550);                 // let ~5 ticks fire
        ticker.cancel();
        System.out.println("   cancelled heartbeat after " + ticks.get() + " ticks -> status " + ticker.status());
        Thread.sleep(200);
        System.out.println("   ticks after cancel (should be unchanged): " + ticks.get());
    }

    private static void header(String msg) {
        System.out.println();
        System.out.println("-- " + msg + " --");
    }
}
