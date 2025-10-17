package com.you.lld.examples.day2.solid.srp;

/**
 * GOOD EXAMPLE: Follows Single Responsibility Principle
 * 
 * This class has a single responsibility: User business logic
 * 
 * Benefits:
 * - Each class has one reason to change
 * - Easy to test and maintain
 * - Changes are isolated
 * - Clear responsibilities
 */
public class UserService {
    private UserRepository userRepository;
    private EmailService emailService;
    
    public UserService(UserRepository userRepository, EmailService emailService) {
        this.userRepository = userRepository;
        this.emailService = emailService;
    }
    
    public void createUser(String name, String email) {
        User user = new User(name, email);
        userRepository.save(user);
        emailService.sendWelcomeEmail(user);  // Delegate to email service
    }
}

