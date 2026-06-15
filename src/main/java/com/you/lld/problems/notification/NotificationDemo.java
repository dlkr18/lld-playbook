package com.you.lld.problems.notification;

import com.you.lld.problems.notification.model.NotificationChannel;
import com.you.lld.problems.notification.model.Priority;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class NotificationDemo {

    public static void main(String[] args) throws InterruptedException {
        System.out.println("=== Notification Service Demo ===\n");
        NotificationGateway gateway = new NotificationGateway();

        // 1. Single-channel send with priority queue
        System.out.println("--- Scenario 1: Priority queue (URGENT before LOW) ---");
        String lowId = gateway.send("user-1", "Newsletter digest", NotificationChannel.EMAIL, Priority.LOW);
        String urgentId = gateway.send("user-2", "Payment failed!", NotificationChannel.SMS, Priority.URGENT);
        Thread.sleep(800);
        printStatus(gateway, urgentId, "Urgent SMS");
        printStatus(gateway, lowId, "Low email");

        // 2. Template method + templated message
        System.out.println("\n--- Scenario 2: Template rendering ---");
        Map<String, String> vars = new HashMap<>();
        vars.put("name", "Alice");
        vars.put("orderId", "ORD-42");
        String tplId = gateway.sendTemplated("user-1", "order-shipped", vars,
            NotificationChannel.EMAIL, Priority.MEDIUM);
        Thread.sleep(500);
        printStatus(gateway, tplId, "Templated email");

        // 3. Composite multi-channel fan-out
        System.out.println("\n--- Scenario 3: Multi-channel (Composite fan-out) ---");
        List<NotificationChannel> channels = Arrays.asList(
            NotificationChannel.EMAIL, NotificationChannel.SMS, NotificationChannel.PUSH);
        List<String> batchIds = gateway.sendMultiChannel("user-3",
            "Your password was changed", channels, Priority.HIGH);
        Thread.sleep(1000);
        System.out.println("  Fan-out count: " + batchIds.size());

        // 4. Retry with exponential backoff
        System.out.println("\n--- Scenario 4: Retry failed with backoff ---");
        gateway.retryFailed();
        Thread.sleep(1500);

        // 5. Status inspection
        System.out.println("\n--- Scenario 5: Final statuses ---");
        for (String id : batchIds) {
            com.you.lld.problems.notification.model.Notification n = gateway.getStatus(id);
            if (n != null) {
                System.out.println("  " + n.getChannel() + ": " + n.getStatus()
                    + " (retries=" + n.getRetryCount() + ")");
            }
        }

        gateway.shutdown();
        System.out.println("\n=== Demo complete ===");
    }

    private static void printStatus(NotificationGateway gateway, String id, String label) {
        com.you.lld.problems.notification.model.Notification n = gateway.getStatus(id);
        if (n != null) {
            System.out.println("  " + label + ": " + n.getStatus());
        }
    }
}
