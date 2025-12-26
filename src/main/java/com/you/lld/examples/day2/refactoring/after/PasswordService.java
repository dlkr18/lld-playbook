package com.you.lld.examples.day2.refactoring.after;

public class PasswordService {
    public String hashPassword(String password) {
        // Simple hash simulation (in real app, use BCrypt)
        return "hashed_" + password;
    }
    
    public void resetPassword(User user) {
        // Password reset logic
    }
}
