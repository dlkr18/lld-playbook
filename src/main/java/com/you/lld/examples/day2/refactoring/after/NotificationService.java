package com.you.lld.examples.day2.refactoring.after;

public class NotificationService {
    public void sendWelcomeNotification(User user) {
        System.out.println("Sending welcome email to: " + user.getEmail());
    }
    
    public void sendWelcomeEmail(User user) {
        sendWelcomeNotification(user);
    }
}
