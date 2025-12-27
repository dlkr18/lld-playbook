package com.you.lld.problems.autocomplete.cache;

import com.you.lld.problems.autocomplete.model.Suggestion;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

public class SuggestionCache {
    private final Map<String, List<Suggestion>> cache = new ConcurrentHashMap<>();
    private final int maxSize;
    
    public SuggestionCache(int maxSize) {
        this.maxSize = maxSize;
    }
    
    public void put(String prefix, List<Suggestion> suggestions) {
        if (cache.size() >= maxSize) {
            String firstKey = cache.keySet().iterator().next();
            cache.remove(firstKey);
        }
        cache.put(prefix, suggestions);
    }
    
    public List<Suggestion> get(String prefix) {
        return cache.get(prefix);
    }
    
    public void clear() {
        cache.clear();
    }
}
