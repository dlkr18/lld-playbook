package com.you.lld.examples.day2.solid.srp;

/**
 * BAD EXAMPLE: Violates Single Responsibility Principle
 * 
 * This class has multiple responsibilities:
 * 1. User data management
 * 2. Email sending
 * 3. Password management
 * 4. Reporting
 * 
 * Problems:
 * - Changes to email logic affect user management
 * - Database changes affect reporting
 * - Hard to test individual features
 * - Violates single responsibility
 */
public class UserManagerBad {
    
    // Responsibility 1: User data management
    public void createUser(String name, String email) {
        // validate user data
        // save to database
    }
    
    // Responsibility 2: Email sending
    public void sendWelcomeEmail(User user) {
        // compose email
        // send via SMTP
    }
    
    // Responsibility 3: Password management
    public void resetPassword(User user) {
        // generate new password
        // update database
        // send email
    }
    
    // Responsibility 4: Reporting
    public void generateUserReport() {
        // query database
        // format report
        // save to file
    }
}

