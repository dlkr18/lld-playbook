package com.you.lld.problems.restaurant;

import com.you.lld.problems.restaurant.model.*;
import com.you.lld.problems.restaurant.service.RestaurantService;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Interview-style demo: reservations, best-fit allocation, order state machine, billing.
 */
public class RestaurantDemo {

    private static Order servedOrder;

    public static void main(String[] args) {
        System.out.println("=== Restaurant Management Demo ===\n");

        Restaurant app = new Restaurant();
        RestaurantService service = app.service();

        service.addTable(new Table("T1", 2));
        service.addTable(new Table("T2", 4));
        service.addTable(new Table("T3", 6));
        service.addTable(new Table("T4", 8));

        demoReservations(service);
        demoBestFitAllocation(service);
        demoOrderLifecycle(service);
        demoBillingAndTableRelease(service);
        demoInvalidTransitions(service);

        System.out.println("\n=== Demo complete ===");
    }

    private static void demoReservations(RestaurantService service) {
        System.out.println("--- Demo 1: Reservations ---");
        Reservation res = service.makeReservation("cust-1", "T2",
                LocalDateTime.now().plusHours(2), 3);
        System.out.println("Reserved " + res.getTableId() + ": " + res.getReservationId());
        System.out.println("T2 status: " + service.getTable("T2").getStatus());

        try {
            service.makeReservation("cust-2", "T2", LocalDateTime.now().plusHours(3), 2);
        } catch (IllegalStateException e) {
            System.out.println("Double-reserve blocked: " + e.getMessage());
        }

        service.cancelReservation(res.getReservationId());
        System.out.println("After cancel, T2: " + service.getTable("T2").getStatus());
        System.out.println();
    }

    private static void demoBestFitAllocation(RestaurantService service) {
        System.out.println("--- Demo 2: Best-fit table allocation ---");
        Table best = service.findTable(5);
        System.out.println("Party of 5 → " + (best != null
                ? best.getTableId() + " (" + best.getCapacity() + " seats)"
                : "none"));
        Table tight = service.findTable(2);
        System.out.println("Party of 2 → " + tight.getTableId() + " (smallest fit, not T4)");
        System.out.println();
    }

    private static void demoOrderLifecycle(RestaurantService service) {
        System.out.println("--- Demo 3: Order state machine ---");
        servedOrder = service.createOrder("T3");
        service.addItemToOrder(servedOrder.getOrderId(), new MenuItem("M1", "Margherita Pizza", 12.99));
        service.addItemToOrder(servedOrder.getOrderId(), new MenuItem("M2", "Caesar Salad", 8.99));
        System.out.println("Created order " + servedOrder.getOrderId() + ", status=" + servedOrder.getStatus());

        service.updateOrderStatus(servedOrder.getOrderId(), OrderStatus.PREPARING);
        service.updateOrderStatus(servedOrder.getOrderId(), OrderStatus.READY);
        service.updateOrderStatus(servedOrder.getOrderId(), OrderStatus.SERVED);
        System.out.println("Kitchen flow → " + servedOrder.getStatus());
        System.out.println();
    }

    private static void demoBillingAndTableRelease(RestaurantService service) {
        System.out.println("--- Demo 4: Billing & table release ---");
        Bill bill = service.generateBill(servedOrder.getOrderId());
        System.out.println("Bill total (10% tax): $" + String.format("%.2f", bill.getTotal()));
        System.out.println("Order → " + servedOrder.getStatus() + ", T3 → "
                + service.getTable("T3").getStatus());

        List<Table> available = service.getAvailableTables();
        System.out.println("Available tables: " + available.size());
        System.out.println();
    }

    private static void demoInvalidTransitions(RestaurantService service) {
        System.out.println("--- Demo 5: Invalid transition guard ---");
        Order order = service.createOrder("T1");
        try {
            service.updateOrderStatus(order.getOrderId(), OrderStatus.PAID);
        } catch (IllegalStateException e) {
            System.out.println("Skip-to-PAID blocked: " + e.getMessage());
        }
        try {
            service.generateBill(order.getOrderId());
        } catch (IllegalStateException e) {
            System.out.println("Bill-before-SERVED blocked: " + e.getMessage());
        }
        System.out.println();
    }
}
