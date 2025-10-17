package com.you.lld.examples.day2.solid.srp;

/**
 * GOOD EXAMPLE: Single Responsibility - Email Operations
 * 
 * This class is only responsible for sending emails
 */
public class EmailService {
    
    public void sendWelcomeEmail(User user) {
        // Only responsible for sending emails
        String subject = "Welcome!";
        String body = "Hello " + user.getName() + ", welcome to our platform!";
        sendEmail(user.getEmail(), subject, body);
    }
    
    private void sendEmail(String to, String subject, String body) {
        // Email sending implementation
    }
}

