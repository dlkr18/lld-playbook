package com.you.lld.examples.day2.refactoring.after;

import java.util.UUID;

/**
 * GOOD EXAMPLE: Refactored User Service
 * 
 * Follows SOLID principles:
 * - Single Responsibility: Only handles user business logic
 * - Dependency Inversion: Depends on abstractions (interfaces)
 * - Open/Closed: Can extend without modification
 * 
 * Follows GRASP principles:
 * - Information Expert: Uses user data appropriately
 * - Low Coupling: Minimal dependencies on abstractions
 * - High Cohesion: All methods serve user management
 */
public class UserService {
    private final UserRepository userRepository;
    private final UserValidator userValidator;
    private final PasswordService passwordService;
    private final NotificationService notificationService;
    
    public UserService(UserRepository userRepository, 
                      UserValidator userValidator,
                      PasswordService passwordService,
                      NotificationService notificationService) {
        this.userRepository = userRepository;
        this.userValidator = userValidator;
        this.passwordService = passwordService;
        this.notificationService = notificationService;
    }
    
    public User createUser(String name, String email, String password) {
        userValidator.validateUserCreation(name, email, password);
        
        if (userRepository.existsByEmail(email)) {
            throw new BusinessException("User with this email already exists");
        }
        
        String hashedPassword = passwordService.hashPassword(password);
        User user = new User(generateId(), name, email, hashedPassword);
        
        User savedUser = userRepository.save(user);
        notificationService.sendWelcomeNotification(savedUser);
        
        return savedUser;
    }
    
    public User findById(String id) {
        return userRepository.findById(id);
    }
    
    private String generateId() {
        return UUID.randomUUID().toString();
    }
}

