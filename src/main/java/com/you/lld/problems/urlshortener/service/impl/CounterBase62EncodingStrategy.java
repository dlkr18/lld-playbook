package com.you.lld.problems.urlshortener.service.impl;

import com.you.lld.problems.urlshortener.service.URLRepository;
import com.you.lld.problems.urlshortener.service.UrlEncodingStrategy;

import java.util.concurrent.atomic.AtomicLong;

/** Counter-based Base62 — predictable, monotonic short codes. */
public class CounterBase62EncodingStrategy implements UrlEncodingStrategy {

    private final AtomicLong counter;
    private final int minLength;
    private final URLRepository repository;

    public CounterBase62EncodingStrategy(URLRepository repository, int minLength) {
        this.repository = repository;
        this.minLength = minLength;
        this.counter = new AtomicLong(1);
    }

    @Override
    public String encode(String longUrl) {
        for (int attempt = 0; attempt < 100; attempt++) {
            String code = Base62Encoder.encode(counter.getAndIncrement(), minLength);
            if (!repository.isShortCodeTaken(code)) {
                return code;
            }
        }
        throw new IllegalStateException("Failed to generate unique counter code");
    }

    @Override
    public String name() {
        return "COUNTER_BASE62";
    }
}
