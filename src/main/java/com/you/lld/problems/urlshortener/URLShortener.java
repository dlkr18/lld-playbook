package com.you.lld.problems.urlshortener;

import com.you.lld.problems.urlshortener.model.Analytics;
import com.you.lld.problems.urlshortener.model.ShortURL;
import com.you.lld.problems.urlshortener.service.URLRepository;
import com.you.lld.problems.urlshortener.service.URLShortenerService;
import com.you.lld.problems.urlshortener.service.UrlEncodingStrategy;
import com.you.lld.problems.urlshortener.service.impl.CounterBase62EncodingStrategy;
import com.you.lld.problems.urlshortener.service.impl.HashBase62EncodingStrategy;
import com.you.lld.problems.urlshortener.service.impl.InMemoryURLRepository;
import com.you.lld.problems.urlshortener.service.impl.URLShortenerServiceImpl;

/** Facade — wire repository + encoding strategy at construction time. */
public class URLShortener {

    public enum EncodingMode {
        COUNTER, HASH
    }

    private final URLShortenerService service;

    public URLShortener(String baseUrl) {
        this(baseUrl, EncodingMode.COUNTER);
    }

    public URLShortener(String baseUrl, EncodingMode mode) {
        URLRepository repo = new InMemoryURLRepository();
        UrlEncodingStrategy strategy = mode == EncodingMode.HASH
            ? new HashBase62EncodingStrategy(repo, 6)
            : new CounterBase62EncodingStrategy(repo, 6);
        this.service = new URLShortenerServiceImpl(baseUrl, repo, strategy);
    }

    public URLShortener(URLShortenerService service) {
        this.service = service;
    }

    public ShortURL shorten(String longUrl) {
        return service.shorten(longUrl);
    }

    public ShortURL shorten(String longUrl, String alias) {
        return service.shorten(longUrl, alias);
    }

    public String resolve(String shortCode) {
        return service.resolve(shortCode);
    }

    public Analytics analytics(String shortCode) {
        return service.getAnalytics(shortCode);
    }

    public boolean delete(String shortCode) {
        return service.delete(shortCode);
    }

    public int totalUrls() {
        return service.totalUrls();
    }

    public URLShortenerService unwrap() {
        return service;
    }
}
