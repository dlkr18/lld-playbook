package com.you.lld.problems.urlshortener.service.impl;

import com.you.lld.problems.urlshortener.model.URLMapping;
import com.you.lld.problems.urlshortener.service.URLRepository;

import java.util.concurrent.ConcurrentHashMap;

public class InMemoryURLRepository implements URLRepository {

    private final ConcurrentHashMap<String, URLMapping> shortToLong = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, String> longToShort = new ConcurrentHashMap<>();

    @Override
    public URLMapping findByShortCode(String shortCode) {
        return shortToLong.get(shortCode);
    }

    @Override
    public String findShortCodeByLongUrl(String longUrl) {
        return longToShort.get(longUrl);
    }

    @Override
    public void save(URLMapping mapping) {
        String existing = longToShort.get(mapping.getLongURL());
        if (existing != null && !existing.equals(mapping.getShortCode())) {
            shortToLong.remove(existing);
        }
        shortToLong.put(mapping.getShortCode(), mapping);
        longToShort.put(mapping.getLongURL(), mapping.getShortCode());
    }

    @Override
    public boolean delete(String shortCode) {
        URLMapping removed = shortToLong.remove(shortCode);
        if (removed != null) {
            longToShort.remove(removed.getLongURL());
            return true;
        }
        return false;
    }

    @Override
    public boolean isShortCodeTaken(String shortCode) {
        return shortToLong.containsKey(shortCode);
    }

    @Override
    public int count() {
        return shortToLong.size();
    }
}
