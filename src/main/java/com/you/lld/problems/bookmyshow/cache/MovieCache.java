package com.you.lld.problems.bookmyshow.cache;

import com.you.lld.problems.bookmyshow.model.Movie;

import java.time.Duration;
import java.time.Instant;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * LRU Cache for Movie entities.
 * Movies change rarely, so we can cache them aggressively.
 */
public class MovieCache {
    
    private final int maxSize;
    private final Duration ttl;
    private final Map<String, CacheEntry> cache;
    private final LinkedList<String> accessOrder; // For LRU
    
    private static class CacheEntry {
        final Movie movie;
        final Instant timestamp;
        
        CacheEntry(Movie movie) {
            this.movie = movie;
            this.timestamp = Instant.now();
        }
        
        boolean isExpired(Duration ttl) {
            return Duration.between(timestamp, Instant.now()).compareTo(ttl) > 0;
        }
    }
    
    public MovieCache(int maxSize, Duration ttl) {
        this.maxSize = maxSize;
        this.ttl = ttl;
        this.cache = new ConcurrentHashMap<>();
        this.accessOrder = new LinkedList<>();
    }
    
    /**
     * Get movie from cache.
     */
    public synchronized Optional<Movie> get(String movieId) {
        CacheEntry entry = cache.get(movieId);
        
        if (entry == null) {
            return Optional.empty();
        }
        
        // Check if expired
        if (entry.isExpired(ttl)) {
            cache.remove(movieId);
            accessOrder.remove(movieId);
            return Optional.empty();
        }
        
        // Update LRU order
        accessOrder.remove(movieId);
        accessOrder.addFirst(movieId);
        
        return Optional.of(entry.movie);
    }
    
    /**
     * Put movie in cache.
     */
    public synchronized void put(String movieId, Movie movie) {
        // If already exists, update and move to front
        if (cache.containsKey(movieId)) {
            cache.put(movieId, new CacheEntry(movie));
            accessOrder.remove(movieId);
            accessOrder.addFirst(movieId);
            return;
        }
        
        // If cache is full, evict LRU
        if (cache.size() >= maxSize) {
            String lru = accessOrder.removeLast();
            cache.remove(lru);
        }
        
        // Add new entry
        cache.put(movieId, new CacheEntry(movie));
        accessOrder.addFirst(movieId);
    }
    
    /**
     * Invalidate cache entry.
     */
    public synchronized void invalidate(String movieId) {
        cache.remove(movieId);
        accessOrder.remove(movieId);
    }
    
    /**
     * Clear entire cache.
     */
    public synchronized void clear() {
        cache.clear();
        accessOrder.clear();
    }
    
    /**
     * Get cache statistics.
     */
    public synchronized Map<String, Object> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("size", cache.size());
        stats.put("maxSize", maxSize);
        stats.put("ttl", ttl.toMinutes() + " minutes");
        return stats;
    }
}
