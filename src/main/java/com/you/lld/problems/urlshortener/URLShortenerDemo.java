package com.you.lld.problems.urlshortener;

/**
 * Demo: URL Shortener with Base62 encoding, custom aliases, analytics, thread safety.
 */
public class URLShortenerDemo {

    public static void main(String[] args) {
        System.out.println("=== URL Shortener Demo ===\n");

        URLShortenerService service = new URLShortenerService("https://short.ly");

        // --- Scenario 1: Basic shortening ---
        System.out.println("--- Scenario 1: Shorten URLs ---");
        ShortURL s1 = service.shortenURL("https://www.google.com/search?q=java+lld");
        System.out.println("Google search: " + s1.getFullUrl());

        ShortURL s2 = service.shortenURL("https://www.example.com/very/long/path/to/resource?param=value");
        System.out.println("Example: " + s2.getFullUrl());

        System.out.println("Total URLs: " + service.getTotalURLs());

        // --- Scenario 2: Idempotent ---
        System.out.println("\n--- Scenario 2: Same URL returns same short code ---");
        ShortURL s1Again = service.shortenURL("https://www.google.com/search?q=java+lld");
        System.out.println("Same URL again: " + s1Again.getFullUrl());
        System.out.println("Codes match: " + s1.getCode().equals(s1Again.getCode()));

        // --- Scenario 3: Custom alias ---
        System.out.println("\n--- Scenario 3: Custom alias ---");
        ShortURL custom = service.shortenURL("https://github.com/myrepo", "myrepo");
        System.out.println("Custom: " + custom.getFullUrl());

        // --- Scenario 4: Redirect (getLongURL) ---
        System.out.println("\n--- Scenario 4: Redirect ---");
        String original = service.getLongURL(s1.getCode());
        System.out.println("Redirect: " + s1.getCode() + " -> " + original);

        // Access multiple times for analytics
        for (int i = 0; i < 5; i++) {
            service.getLongURL(s1.getCode());
        }
        Analytics stats = service.getAnalytics(s1.getCode());
        System.out.println("Analytics: accessCount=" + stats.getAccessCount()
            + ", created=" + stats.getCreatedAt());

        // --- Scenario 5: Invalid URL ---
        System.out.println("\n--- Scenario 5: Error handling ---");
        try {
            service.shortenURL("not-a-url");
        } catch (IllegalArgumentException e) {
            System.out.println("Invalid URL: " + e.getMessage());
        }

        try {
            service.getLongURL("nonexistent");
        } catch (URLNotFoundException e) {
            System.out.println("Not found: " + e.getMessage());
        }

        // Alias conflict
        try {
            service.shortenURL("https://another.com", "myrepo");
        } catch (AliasUnavailableException e) {
            System.out.println("Alias taken: " + e.getMessage());
        }

        // --- Scenario 6: Delete ---
        System.out.println("\n--- Scenario 6: Delete URL ---");
        System.out.println("URLs before: " + service.getTotalURLs());
        boolean deleted = service.deleteURL(s2.getCode());
        System.out.println("Deleted: " + deleted);
        System.out.println("URLs after: " + service.getTotalURLs());

        // --- Scenario 7: Thread safety ---
        System.out.println("\n--- Scenario 7: Concurrent shortening ---");
        Thread[] threads = new Thread[10];
        for (int i = 0; i < 10; i++) {
            final int idx = i;
            threads[i] = new Thread(() -> {
                ShortURL url = service.shortenURL("https://example.com/thread-" + idx);
                System.out.println("  Thread-" + idx + ": " + url.getCode());
            });
        }
        for (Thread t : threads) t.start();
        for (Thread t : threads) {
            try { t.join(); } catch (InterruptedException ignored) {}
        }
        System.out.println("Total URLs: " + service.getTotalURLs());

        System.out.println("\n=== Demo complete ===");
    }
}
