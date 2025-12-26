package com.you.lld.problems.loggingframework.model;

import java.util.*;

public class LogContext {
    private final Map<String, String> context = new HashMap<>();
    
    public void put(String key, String value) {
        context.put(key, value);
    }
    
    public String get(String key) {
        return context.get(key);
    }
    
    public Map<String, String> getAll() {
        return new HashMap<>(context);
    }
    
    public void clear() {
        context.clear();
    }
}
