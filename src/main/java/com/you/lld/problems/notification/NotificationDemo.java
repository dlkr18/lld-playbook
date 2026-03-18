package com.you.lld.problems.notification;

import com.you.lld.problems.notification.impl.NotificationServiceImpl;
import com.you.lld.problems.notification.model.*;

/**
 * Demo: Notification Service with multi-channel, priority queue, retry mechanism.
 */
public class NotificationDemo {

    public static void main(String[] args) throws InterruptedException {
        System.out.println("=== Notification Service Demo ===\n");

        NotificationServiceImpl service = new NotificationServiceImpl();

        // Send various notifications
        System.out.println("--- Sending notifications ---");
        String id1 = service.sendNotification("user-1", "Your order has shipped!", 
            NotificationChannel.EMAIL, Priority.MEDIUM);
        String id2 = service.sendNotification("user-2", "URGENT: Security alert!", 
            NotificationChannel.SMS, Priority.URGENT);
        String id3 = service.sendNotification("user-1", "New message from Bob", 
            NotificationChannel.PUSH, Priority.LOW);
        String id4 = service.sendNotification("user-3", "Welcome to the platform!", 
            NotificationChannel.IN_APP, Priority.HIGH);

        // Wait for async processing
        System.out.println("\nWaiting for processing...");
        Thread.sleep(2000);

        // Check statuses
        System.out.println("\n--- Notification statuses ---");
        printStatus(service, id1, "Order shipped email");
        printStatus(service, id2, "Security alert SMS");
        printStatus(service, id3, "Push notification");
        printStatus(service, id4, "Welcome in-app");

        // Retry failed notifications
        System.out.println("\n--- Retry failed ---");
        service.retryFailed();
        Thread.sleep(1000);

        System.out.println("\n--- Final statuses ---");
        printStatus(service, id1, "Email");
        printStatus(service, id2, "SMS");
        printStatus(service, id3, "Push");
        printStatus(service, id4, "In-app");

        System.out.println("\n=== Demo complete ===");
        System.exit(0); // Force exit worker threads
    }

    private static void printStatus(NotificationServiceImpl service, String id, String label) {
        Notification n = service.getNotificationStatus(id);
        if (n != null) {
            System.out.println("  " + label + ": " + n.getStatus() + 
                " (retries: " + n.getRetryCount() + ")");
        }
    }
}
