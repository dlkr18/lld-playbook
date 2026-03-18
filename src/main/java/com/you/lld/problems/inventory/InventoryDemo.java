package com.you.lld.problems.inventory;

import com.you.lld.problems.inventory.impl.InMemoryInventoryService;
import com.you.lld.problems.inventory.model.*;

/**
 * Demo: Inventory management with receive, reserve, commit, transfer, adjust.
 */
public class InventoryDemo {

    public static void main(String[] args) {
        System.out.println("=== Inventory Management Demo ===\n");

        InMemoryInventoryService service = new InMemoryInventoryService();

        SkuId laptop = SkuId.of("SKU-LAPTOP-001");
        SkuId phone = SkuId.of("SKU-PHONE-001");
        WarehouseId wh1 = WarehouseId.of("WH-EAST");
        WarehouseId wh2 = WarehouseId.of("WH-WEST");

        // --- Receive stock ---
        System.out.println("--- Receive stock ---");
        service.receiveStock(laptop, wh1, 100, "Initial stock");
        service.receiveStock(phone, wh1, 200, "Initial stock");
        service.receiveStock(laptop, wh2, 50, "Initial stock");
        System.out.println("Laptop@East: " + service.getStock(laptop, wh1));
        System.out.println("Phone@East: " + service.getStock(phone, wh1));
        System.out.println("Laptop@West: " + service.getStock(laptop, wh2));

        // --- Reserve ---
        System.out.println("\n--- Reserve stock ---");
        ReservationId res1 = service.reserve(laptop, wh1, 10, "Order-1001");
        ReservationId res2 = service.reserve(laptop, wh1, 5, "Order-1002");
        System.out.println("Reserved 10 laptops: " + res1);
        System.out.println("Reserved 5 laptops: " + res2);
        System.out.println("Laptop@East: " + service.getStock(laptop, wh1));

        // --- Commit (ship order) ---
        System.out.println("\n--- Commit reservation (order shipped) ---");
        service.commit(res1, "Shipped Order-1001");
        System.out.println("After commit: " + service.getStock(laptop, wh1));

        // --- Release (cancel order) ---
        System.out.println("\n--- Release reservation (order cancelled) ---");
        service.release(res2, "Order-1002 cancelled");
        System.out.println("After release: " + service.getStock(laptop, wh1));

        // --- Transfer between warehouses ---
        System.out.println("\n--- Transfer ---");
        System.out.println("Before: East=" + service.getStock(laptop, wh1) 
            + ", West=" + service.getStock(laptop, wh2));
        service.transfer(laptop, wh1, wh2, 20, "Rebalance inventory");
        System.out.println("After:  East=" + service.getStock(laptop, wh1) 
            + ", West=" + service.getStock(laptop, wh2));

        // --- Adjust (cycle count) ---
        System.out.println("\n--- Adjust (shrinkage) ---");
        service.adjust(phone, wh1, -5, "Shrinkage detected");
        System.out.println("Phone@East after adjust: " + service.getStock(phone, wh1));

        // --- Error: over-reserve ---
        System.out.println("\n--- Error handling ---");
        try {
            service.reserve(laptop, wh2, 1000, "Impossible order");
        } catch (IllegalArgumentException e) {
            System.out.println("Over-reserve: " + e.getMessage());
        }

        System.out.println("\n=== Demo complete ===");
    }
}
