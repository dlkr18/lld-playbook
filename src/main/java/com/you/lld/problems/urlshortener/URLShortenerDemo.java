package com.you.lld.problems.urlshortener;

import com.you.lld.problems.urlshortener.model.AliasUnavailableException;
import com.you.lld.problems.urlshortener.model.Analytics;
import com.you.lld.problems.urlshortener.model.ShortURL;
import com.you.lld.problems.urlshortener.model.URLNotFoundException;

public class URLShortenerDemo {

    public static void main(String[] args) {
        System.out.println("=== URL Shortener Demo ===\n");

        URLShortener counterService = new URLShortener("https://short.ly", URLShortener.EncodingMode.COUNTER);

        System.out.println("--- Scenario 1: Counter-based shortening ---");
        ShortURL s1 = counterService.shorten("https://www.google.com/search?q=java+lld");
        System.out.println("Short: " + s1.getFullUrl());
        ShortURL s2 = counterService.shorten("https://www.example.com/very/long/path");
        System.out.println("Short: " + s2.getFullUrl());

        System.out.println("\n--- Scenario 2: Idempotent (same URL → same code) ---");
        ShortURL again = counterService.shorten("https://www.google.com/search?q=java+lld");
        System.out.println("Codes match: " + s1.getCode().equals(again.getCode()));

        System.out.println("\n--- Scenario 3: Custom alias ---");
        ShortURL custom = counterService.shorten("https://github.com/myrepo", "myrepo");
        System.out.println("Custom: " + custom.getFullUrl());

        System.out.println("\n--- Scenario 4: Hash-based encoding strategy ---");
        URLShortener hashService = new URLShortener("https://h.ly", URLShortener.EncodingMode.HASH);
        ShortURL h1 = hashService.shorten("https://docs.oracle.com/javase/8/docs/api/");
        ShortURL h2 = hashService.shorten("https://maven.apache.org/guides/");
        System.out.println("Hash codes: " + h1.getCode() + ", " + h2.getCode());

        System.out.println("\n--- Scenario 5: Resolve + analytics + errors ---");
        for (int i = 0; i < 3; i++) {
            counterService.resolve(s1.getCode());
        }
        Analytics stats = counterService.analytics(s1.getCode());
        System.out.println("Access count: " + stats.getAccessCount());

        try {
            counterService.shorten("not-a-url");
        } catch (IllegalArgumentException e) {
            System.out.println("Invalid URL caught: " + e.getMessage());
        }
        try {
            counterService.shorten("https://other.com", "myrepo");
        } catch (AliasUnavailableException e) {
            System.out.println("Alias conflict: " + e.getMessage());
        }
        try {
            counterService.resolve("missing");
        } catch (URLNotFoundException e) {
            System.out.println("Not found: " + e.getMessage());
        }

        System.out.println("\n=== Demo complete ===");
    }
}
