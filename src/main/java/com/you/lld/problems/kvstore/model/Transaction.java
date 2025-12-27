package com.you.lld.problems.kvstore.model;

import java.util.*;

public class Transaction {
    private final String id;
    private final Map<String, String> changes;
    private boolean committed;
    
    public Transaction(String id) {
        this.id = id;
        this.changes = new HashMap<>();
        this.committed = false;
    }
    
    public void put(String key, String value) {
        changes.put(key, value);
    }
    
    public void commit() {
        this.committed = true;
    }
    
    public void rollback() {
        changes.clear();
    }
    
    public String getId() { return id; }
    public Map<String, String> getChanges() { return new HashMap<>(changes); }
    public boolean isCommitted() { return committed; }
}
