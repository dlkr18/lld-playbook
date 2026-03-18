package com.you.lld.problems.restaurant;

import com.you.lld.problems.restaurant.impl.InMemoryRestaurantService;
import com.you.lld.problems.restaurant.model.*;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Demo: Restaurant Management with tables, reservations, ordering, billing.
 */
public class RestaurantDemo {

    public static void main(String[] args) {
        System.out.println("=== Restaurant Management Demo ===\n");

        InMemoryRestaurantService service = new InMemoryRestaurantService();

        // Setup tables
        service.addTable(new Table("T1", 2));
        service.addTable(new Table("T2", 4));
        service.addTable(new Table("T3", 6));
        service.addTable(new Table("T4", 8));
        System.out.println("Added 4 tables (2, 4, 6, 8 seats)");

        // --- Reservations ---
        System.out.println("\n--- Reservations ---");
        Reservation res1 = service.makeReservation("cust-1", "T2",
            LocalDateTime.now().plusHours(2), 3);
        System.out.println("Reserved " + res1.getTableId() + ": " + res1.getReservationId());
        System.out.println("Table T2 status: " + service.getTable("T2").getStatus());

        // Try to reserve occupied table
        try {
            service.makeReservation("cust-2", "T2", LocalDateTime.now().plusHours(3), 2);
        } catch (IllegalStateException e) {
            System.out.println("Double-reserve blocked: " + e.getMessage());
        }

        // Cancel reservation
        service.cancelReservation(res1.getReservationId());
        System.out.println("Cancelled reservation, T2 status: " + service.getTable("T2").getStatus());

        // --- Find best table ---
        System.out.println("\n--- Find table ---");
        Table best = service.findTable(5);
        System.out.println("Best table for party of 5: " + (best != null ? best.getTableId() + " (" + best.getCapacity() + " seats)" : "none"));

        // --- Ordering ---
        System.out.println("\n--- Ordering ---");
        Order order = service.createOrder("T3");
        System.out.println("Order created: " + order.getOrderId());
        System.out.println("Table T3 status: " + service.getTable("T3").getStatus());

        service.addItemToOrder(order.getOrderId(), new MenuItem("M1", "Margherita Pizza", 12.99));
        service.addItemToOrder(order.getOrderId(), new MenuItem("M2", "Caesar Salad", 8.99));
        service.addItemToOrder(order.getOrderId(), new MenuItem("M3", "Tiramisu", 7.99));
        service.addItemToOrder(order.getOrderId(), new MenuItem("M4", "Sparkling Water", 3.50));
        System.out.println("Added 4 items");

        // Kitchen workflow
        service.updateOrderStatus(order.getOrderId(), OrderStatus.PREPARING);
        System.out.println("Order status: " + order.getStatus());
        service.updateOrderStatus(order.getOrderId(), OrderStatus.READY);
        service.updateOrderStatus(order.getOrderId(), OrderStatus.SERVED);

        // --- Billing ---
        System.out.println("\n--- Billing ---");
        Bill bill = service.generateBill(order.getOrderId());
        System.out.println("Bill total (incl 10% tax): $" + String.format("%.2f", bill.getTotal()));
        System.out.println("Order status: " + order.getStatus());
        System.out.println("Table T3 status: " + service.getTable("T3").getStatus());

        // --- Available tables ---
        System.out.println("\n--- Available tables ---");
        List<Table> available = service.getAvailableTables();
        System.out.println("Available: " + available.size() + " tables");
        for (Table t : available) {
            System.out.println("  " + t.getTableId() + " (" + t.getCapacity() + " seats)");
        }

        System.out.println("\n=== Demo complete ===");
    }
}
