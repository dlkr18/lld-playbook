package com.you.lld.problems.splitwise.model;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

public class User {
    private final String id;
    private final String name;
    private final String email;
    private final Map<String, BigDecimal> balances;

    public User(String id, String name, String email) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.balances = new HashMap<String, BigDecimal>();
    }

    public synchronized void updateBalance(String otherUserId, BigDecimal delta) {
        BigDecimal current = balances.getOrDefault(otherUserId, BigDecimal.ZERO);
        balances.put(otherUserId, current.add(delta));
    }

    public synchronized Map<String, BigDecimal> getBalances() {
        return new HashMap<String, BigDecimal>(balances);
    }

    public String getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }

    @Override
    public String toString() {
        return "User{id='" + id + "', name='" + name + "'}";
    }
}
