package com.you.lld.problems.urlshortener.service.impl;

import com.you.lld.problems.urlshortener.model.AliasUnavailableException;
import com.you.lld.problems.urlshortener.model.Analytics;
import com.you.lld.problems.urlshortener.model.ShortURL;
import com.you.lld.problems.urlshortener.model.URLMapping;
import com.you.lld.problems.urlshortener.model.URLNotFoundException;
import com.you.lld.problems.urlshortener.service.URLRepository;
import com.you.lld.problems.urlshortener.service.URLShortenerService;
import com.you.lld.problems.urlshortener.service.UrlEncodingStrategy;

public class URLShortenerServiceImpl implements URLShortenerService {

    private final URLRepository repository;
    private final UrlEncodingStrategy encodingStrategy;
    private final String baseUrl;

    public URLShortenerServiceImpl(String baseUrl, URLRepository repository, UrlEncodingStrategy encodingStrategy) {
        if (baseUrl == null || baseUrl.trim().isEmpty()) {
            throw new IllegalArgumentException("baseUrl required");
        }
        this.baseUrl = baseUrl.endsWith("/") ? baseUrl.substring(0, baseUrl.length() - 1) : baseUrl;
        this.repository = repository;
        this.encodingStrategy = encodingStrategy;
    }

    @Override
    public ShortURL shorten(String longUrl) {
        String normalized = URLValidator.normalize(longUrl);
        String existing = repository.findShortCodeByLongUrl(normalized);
        if (existing != null) {
            return new ShortURL(existing, baseUrl);
        }
        String code = encodingStrategy.encode(normalized);
        URLMapping mapping = new URLMapping(code, normalized);
        repository.save(mapping);
        return new ShortURL(code, baseUrl);
    }

    @Override
    public ShortURL shorten(String longUrl, String customAlias) {
        if (!URLValidator.isValid(longUrl)) {
            throw new IllegalArgumentException("Invalid URL: " + longUrl);
        }
        if (!URLValidator.isValidAlias(customAlias)) {
            throw new IllegalArgumentException("Invalid alias: " + customAlias);
        }
        if (repository.isShortCodeTaken(customAlias)) {
            throw new AliasUnavailableException("Alias '" + customAlias + "' is already taken");
        }
        String normalized = URLValidator.normalize(longUrl);
        URLMapping mapping = new URLMapping(customAlias, normalized);
        repository.save(mapping);
        return new ShortURL(customAlias, baseUrl);
    }

    @Override
    public String resolve(String shortCode) {
        URLMapping mapping = repository.findByShortCode(shortCode);
        if (mapping == null) {
            throw new URLNotFoundException("Short code not found: " + shortCode);
        }
        mapping.recordAccess();
        return mapping.getLongURL();
    }

    @Override
    public Analytics getAnalytics(String shortCode) {
        URLMapping mapping = repository.findByShortCode(shortCode);
        if (mapping == null) {
            throw new URLNotFoundException("Short code not found: " + shortCode);
        }
        return mapping.getAnalytics();
    }

    @Override
    public boolean delete(String shortCode) {
        return repository.delete(shortCode);
    }

    @Override
    public int totalUrls() {
        return repository.count();
    }
}
