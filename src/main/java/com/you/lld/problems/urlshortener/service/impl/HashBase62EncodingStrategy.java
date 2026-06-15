package com.you.lld.problems.urlshortener.service.impl;

import com.you.lld.problems.urlshortener.service.URLRepository;
import com.you.lld.problems.urlshortener.service.UrlEncodingStrategy;

/** Hash-based Base62 — deterministic per URL; linear probing on collision. */
public class HashBase62EncodingStrategy implements UrlEncodingStrategy {

    private final int minLength;
    private final URLRepository repository;

    public HashBase62EncodingStrategy(URLRepository repository, int minLength) {
        this.repository = repository;
        this.minLength = minLength;
    }

    @Override
    public String encode(String longUrl) {
        long hash = Math.abs(longUrl.hashCode());
        for (int probe = 0; probe < 100; probe++) {
            String code = Base62Encoder.encode(hash + probe, minLength);
            if (!repository.isShortCodeTaken(code)) {
                return code;
            }
        }
        throw new IllegalStateException("Hash collision probe limit exceeded for: " + longUrl);
    }

    @Override
    public String name() {
        return "HASH_BASE62";
    }
}
