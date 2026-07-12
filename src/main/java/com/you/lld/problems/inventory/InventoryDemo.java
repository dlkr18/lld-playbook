package com.you.lld.problems.inventory;

import com.you.lld.problems.inventory.model.*;
import com.you.lld.problems.inventory.service.InventoryService;

import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Interview-style demo: multi-warehouse Reserve-Commit-Release lifecycle.
 */
public class InventoryDemo {

    public static void main(String[] args) throws InterruptedException {
        System.out.println("=== Inventory Management Demo ===\n");

        Inventory app = new Inventory();
        InventoryService service = app.inventory();

        SkuId laptop = SkuId.of("SKU-LAPTOP-001");
        SkuId phone = SkuId.of("SKU-PHONE-001");
        WarehouseId whEast = WarehouseId.of("WH-EAST");
        WarehouseId whWest = WarehouseId.of("WH-WEST");

        demoMultiWarehouseReceive(service, laptop, phone, whEast, whWest);
        demoReserveCommitRelease(service, laptop, whEast);
        demoInterWarehouseTransfer(service, laptop, whEast, whWest);
        demoCycleCountAdjust(service, phone, whEast);
        demoConcurrentReservations(service, laptop, whWest);

        System.out.println("\n=== Demo complete ===");
    }

    private static void demoMultiWarehouseReceive(InventoryService service, SkuId laptop, SkuId phone,
                                                    WarehouseId whEast, WarehouseId whWest) {
        System.out.println("--- Demo 1: Multi-warehouse receive ---");
        service.receiveStock(laptop, whEast, 100, "Initial stock");
        service.receiveStock(phone, whEast, 200, "Initial stock");
        service.receiveStock(laptop, whWest, 50, "Initial stock");
        System.out.println("Laptop@East: " + service.getStock(laptop, whEast));
        System.out.println("Phone@East:  " + service.getStock(phone, whEast));
        System.out.println("Laptop@West: " + service.getStock(laptop, whWest));
        System.out.println();
    }

    private static void demoReserveCommitRelease(InventoryService service, SkuId laptop, WarehouseId whEast) {
        System.out.println("--- Demo 2: Reserve → Commit / Release ---");
        ReservationId ship = service.reserve(laptop, whEast, 10, "Order-1001");
        ReservationId cancel = service.reserve(laptop, whEast, 5, "Order-1002");
        System.out.println("After reserve: " + service.getStock(laptop, whEast));

        service.commit(ship, "Shipped Order-1001");
        service.release(cancel, "Order-1002 cancelled");
        System.out.println("After commit+release: " + service.getStock(laptop, whEast));
        System.out.println();
    }

    private static void demoInterWarehouseTransfer(InventoryService service, SkuId laptop,
                                                   WarehouseId whEast, WarehouseId whWest) {
        System.out.println("--- Demo 3: Inter-warehouse transfer ---");
        System.out.println("Before: East=" + service.getStock(laptop, whEast)
                + ", West=" + service.getStock(laptop, whWest));
        service.transfer(laptop, whEast, whWest, 20, "Rebalance");
        System.out.println("After:  East=" + service.getStock(laptop, whEast)
                + ", West=" + service.getStock(laptop, whWest));
        System.out.println();
    }

    private static void demoCycleCountAdjust(InventoryService service, SkuId phone, WarehouseId whEast) {
        System.out.println("--- Demo 4: Cycle-count adjust (shrinkage) ---");
        service.adjust(phone, whEast, -5, "Shrinkage detected");
        System.out.println("Phone@East after adjust: " + service.getStock(phone, whEast));

        try {
            service.reserve(phone, whEast, 10000, "Impossible");
        } catch (IllegalArgumentException e) {
            System.out.println("Over-reserve blocked: " + e.getMessage());
        }
        System.out.println();
    }

    private static void demoConcurrentReservations(InventoryService service, SkuId laptop,
                                                   WarehouseId whWest) throws InterruptedException {
        System.out.println("--- Demo 5: Concurrent reservations (thread-safety) ---");
        StockSnapshot before = service.getStock(laptop, whWest);
        int threads = 10;
        int qtyEach = 2;
        ExecutorService pool = Executors.newFixedThreadPool(threads);
        CountDownLatch start = new CountDownLatch(1);
        CountDownLatch done = new CountDownLatch(threads);
        AtomicInteger successes = new AtomicInteger(0);
        AtomicInteger failures = new AtomicInteger(0);

        for (int i = 0; i < threads; i++) {
            final int n = i;
            pool.submit(new Runnable() {
                @Override
                public void run() {
                    try {
                        start.await();
                        service.reserve(laptop, whWest, qtyEach, "concurrent-" + n);
                        successes.incrementAndGet();
                    } catch (Exception e) {
                        failures.incrementAndGet();
                    } finally {
                        done.countDown();
                    }
                }
            });
        }
        start.countDown();
        done.await();
        pool.shutdown();

        StockSnapshot after = service.getStock(laptop, whWest);
        System.out.println("Before: " + before + " | After: " + after);
        System.out.println("Successes=" + successes.get() + ", failures=" + failures.get()
                + " (reserved never exceeds on-hand)");
        System.out.println();
    }
}
