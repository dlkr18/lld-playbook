package com.you.lld.problems.bookmyshow.cache;

import com.you.lld.problems.bookmyshow.model.Movie;

import java.time.Duration;
import java.time.Instant;
import java.util.*;

/**
 * LRU Cache for Movie entities with TTL support.
 * Movies change rarely, so we can cache them aggressively.
 * 
 * Thread-safe implementation using LinkedHashMap with access order.
 */
public class MovieCache {
    
    private final int maxSize;
    private final Duration ttl;
    private final Map<String, CacheEntry> cache;
    
    public static class CacheEntry {
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
        
        // LinkedHashMap with access order for efficient LRU
        this.cache = Collections.synchronizedMap(
            new LinkedHashMap<String, CacheEntry>(maxSize + 1, 0.75f, true) {
                @Override
                protected boolean removeEldestEntry(Map.Entry<String, CacheEntry> eldest) {
                    return size() > maxSize;
                }
            }
        );
    }
    
    /**
     * Get movie from cache.
     */
    public Optional<Movie> get(String movieId) {
        synchronized (cache) {
            CacheEntry entry = cache.get(movieId);
            
            if (entry == null) {
                return Optional.empty();
            }
            
            // Check if expired
            if (entry.isExpired(ttl)) {
                cache.remove(movieId);
                return Optional.empty();
            }
            
            // LinkedHashMap automatically updates access order on get()
            return Optional.of(entry.movie);
        }
    }
    
    /**
     * Put movie in cache.
     */
    public void put(String movieId, Movie movie) {
        synchronized (cache) {
            cache.put(movieId, new CacheEntry(movie));
            // LinkedHashMap automatically handles LRU eviction
        }
    }
    
    /**
     * Invalidate cache entry.
     */
    public void invalidate(String movieId) {
        synchronized (cache) {
            cache.remove(movieId);
        }
    }
    
    /**
     * Clear entire cache.
     */
    public void clear() {
        synchronized (cache) {
            cache.clear();
        }
    }
    
    /**
     * Get cache statistics.
     */
    public Map<String, Object> getStats() {
        synchronized (cache) {
            Map<String, Object> stats = new HashMap<>();
            stats.put("size", cache.size());
            stats.put("maxSize", maxSize);
            stats.put("ttl", ttl.toMinutes() + " minutes");
            
            // Count expired entries
            long expiredCount = cache.values().stream()
                .filter(entry -> entry.isExpired(ttl))
                .count();
            stats.put("expiredEntries", expiredCount);
            
            return stats;
        }
    }
    
    /**
     * Remove expired entries (manual cleanup).
     */
    public int cleanupExpired() {
        synchronized (cache) {
            List<String> expiredKeys = new ArrayList<>();
            
            for (Map.Entry<String, CacheEntry> entry : cache.entrySet()) {
                if (entry.getValue().isExpired(ttl)) {
                    expiredKeys.add(entry.getKey());
                }
            }
            
            expiredKeys.forEach(cache::remove);
            return expiredKeys.size();
        }
    }
}
