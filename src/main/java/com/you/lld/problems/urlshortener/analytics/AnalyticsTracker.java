package com.you.lld.problems.urlshortener.analytics;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

public class AnalyticsTracker {
    private final Map<String, Integer> clickCounts = new ConcurrentHashMap<>();
    private final Map<String, Set<String>> uniqueVisitors = new ConcurrentHashMap<>();
    
    public void trackClick(String shortUrl, String ipAddress) {
        clickCounts.merge(shortUrl, 1, Integer::sum);
        uniqueVisitors.computeIfAbsent(shortUrl, k -> ConcurrentHashMap.newKeySet()).add(ipAddress);
    }
    
    public int getClickCount(String shortUrl) {
        return clickCounts.getOrDefault(shortUrl, 0);
    }
    
    public int getUniqueVisitors(String shortUrl) {
        Set<String> visitors = uniqueVisitors.get(shortUrl);
        return visitors != null ? visitors.size() : 0;
    }
    
    public Map<String, Integer> getTopUrls(int limit) {
        return clickCounts.entrySet().stream()
            .sorted(Map.Entry.<String, Integer>comparingByValue().reversed())
            .limit(limit)
            .collect(java.util.stream.Collectors.toMap(
                Map.Entry::getKey, 
                Map.Entry::getValue,
                (e1, e2) -> e1,
                LinkedHashMap::new
            ));
    }
}
