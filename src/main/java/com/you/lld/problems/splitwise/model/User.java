package com.you.lld.problems.splitwise.model;

import java.util.*;

public class User {
    private final String id;
    private final String name;
    private final String email;
    private final Map<String, Double> balances;
    
    public User(String id, String name, String email) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.balances = new HashMap<>();
    }
    
    public void updateBalance(String otherUserId, double amount) {
        balances.put(otherUserId, balances.getOrDefault(otherUserId, 0.0) + amount);
    }
    
    public Map<String, Double> getBalances() {
        return new HashMap<>(balances);
    }
    
    public String getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    
    @Override
    public String toString() {
        return "User{id='" + id + "', name='" + name + "'}";
    }
}
