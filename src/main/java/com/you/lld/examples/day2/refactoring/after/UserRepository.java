package com.you.lld.examples.day2.refactoring.after;

/**
 * GOOD EXAMPLE: Repository Interface
 * 
 * Follows SOLID principles:
 * - Interface Segregation: Focused interface for user data access
 * - Dependency Inversion: Abstraction for data access
 * 
 * Follows GRASP principles:
 * - Pure Fabrication: Artificial class for data access concerns
 * - Low Coupling: Interface reduces coupling to specific implementations
 * 
 * Benefits:
 * - Easy to test with mock implementations
 * - Can switch between different data stores
 * - Clear contract for user data operations
 */
public interface UserRepository {
    User save(User user);
    User findById(String id);
    User findByEmail(String email);
    boolean existsByEmail(String email);
    void delete(String id);
}

