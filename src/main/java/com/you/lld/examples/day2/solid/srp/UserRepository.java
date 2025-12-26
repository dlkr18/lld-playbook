package com.you.lld.examples.day2.solid.srp;

/**
 * Repository interface for User persistence
 * Following SRP - only responsible for data access
 */
public interface UserRepository {
    void save(User user);
    User findByEmail(String email);
}

