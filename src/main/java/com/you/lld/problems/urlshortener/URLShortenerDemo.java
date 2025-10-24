package com.you.lld.problems.urlshortener;

/**
 * Demonstration of the URL Shortener Low-Level Design.
 * 
 * <p>Shows all core features:
 * <ul>
 *   <li>URL shortening with automatic code generation</li>
 *   <li>Custom alias support</li>
 *   <li>URL redirection</li>
 *   <li>Analytics tracking</li>
 *   <li>Duplicate URL handling</li>
 *   <li>Error handling</li>
 * </ul>
 */
public class URLShortenerDemo {
    
    public static void main(String[] args) {
        System.out.println("=== URL Shortener LLD Demonstration ===\n");
        
        demoBasicShortening();
        demoCustomAlias();
        demoRedirection();
        demoAnalytics();
        demoDuplicateURLs();
        demoBase62Encoding();
        demoErrorHandling();
        
        System.out.println("\n=== All Demonstrations Completed Successfully! ===");
    }
    
    private static void demoBasicShortening() {
        System.out.println("--- Basic URL Shortening ---");
        
        URLShortenerService service = new URLShortenerService("https://short.ly");
        
        String longURL = "https://www.example.com/very/long/url/path/to/resource?param1=value1&param2=value2";
        ShortURL shortURL = service.shortenURL(longURL);
        
        System.out.println("Long URL: " + longURL);
        System.out.println("Short URL: " + shortURL.getFullUrl());
        System.out.println("Short Code: " + shortURL.getCode());
        System.out.println("Total URLs: " + service.getTotalURLs());
        System.out.println();
    }
    
    private static void demoCustomAlias() {
        System.out.println("--- Custom Alias ---");
        
        URLShortenerService service = new URLShortenerService("https://short.ly");
        
        String longURL = "https://github.com/user/awesome-project";
        String customAlias = "github";
        
        ShortURL shortURL = service.shortenURL(longURL, customAlias);
        
        System.out.println("Long URL: " + longURL);
        System.out.println("Custom Alias: " + customAlias);
        System.out.println("Short URL: " + shortURL.getFullUrl());
        System.out.println("Is 'github' available: " + service.isAvailable("github"));
        System.out.println();
    }
    
    private static void demoRedirection() {
        System.out.println("--- URL Redirection ---");
        
        URLShortenerService service = new URLShortenerService("https://short.ly");
        
        // Shorten URL
        String longURL = "https://www.wikipedia.org/wiki/URL_shortening";
        ShortURL shortURL = service.shortenURL(longURL);
        
        System.out.println("Created: " + shortURL.getFullUrl() + " -> " + longURL);
        
        // Redirect (retrieve long URL)
        String retrievedURL = service.getLongURL(shortURL.getCode());
        System.out.println("Retrieved: " + retrievedURL);
        System.out.println("Match: " + retrievedURL.equals(URLValidator.normalize(longURL)));
        System.out.println();
    }
    
    private static void demoAnalytics() {
        System.out.println("--- Analytics Tracking ---");
        
        URLShortenerService service = new URLShortenerService("https://short.ly");
        
        String longURL = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
        ShortURL shortURL = service.shortenURL(longURL);
        
        System.out.println("Short URL created: " + shortURL.getFullUrl());
        
        // Simulate multiple accesses
        System.out.println("\nSimulating 10 clicks...");
        for (int i = 0; i < 10; i++) {
            service.getLongURL(shortURL.getCode());
        }
        
        // Get analytics
        Analytics analytics = service.getAnalytics(shortURL.getCode());
        System.out.println("\nAnalytics:");
        System.out.println("  Access Count: " + analytics.getAccessCount());
        System.out.println("  Created At: " + analytics.getCreatedAt());
        System.out.println("  Last Accessed: " + analytics.getLastAccessedAt());
        System.out.println();
    }
    
    private static void demoDuplicateURLs() {
        System.out.println("--- Duplicate URL Handling ---");
        
        URLShortenerService service = new URLShortenerService("https://short.ly");
        
        String url = "https://www.google.com/search?q=url+shortener";
        
        // First shortening
        ShortURL shortURL1 = service.shortenURL(url);
        System.out.println("First shortening: " + shortURL1.getFullUrl());
        
        // Second shortening of same URL
        ShortURL shortURL2 = service.shortenURL(url);
        System.out.println("Second shortening: " + shortURL2.getFullUrl());
        
        // Should return same short code
        System.out.println("Same short code: " + shortURL1.getCode().equals(shortURL2.getCode()));
        System.out.println("Total URLs (should be 1): " + service.getTotalURLs());
        System.out.println();
    }
    
    private static void demoBase62Encoding() {
        System.out.println("--- Base62 Encoding Examples ---");
        
        System.out.println("Number -> Base62:");
        long[] numbers = {1, 10, 62, 100, 1000, 10000, 123456};
        for (long num : numbers) {
            String encoded = Base62Encoder.encode(num);
            long decoded = Base62Encoder.decode(encoded);
            System.out.println("  " + num + " -> " + encoded + " -> " + decoded);
        }
        
        System.out.println("\nPadded encoding (6 characters):");
        for (long num : new long[]{1, 10, 100}) {
            String padded = Base62Encoder.encode(num, 6);
            System.out.println("  " + num + " -> " + padded + " (length: " + padded.length() + ")");
        }
        
        System.out.println("\nURL Space:");
        System.out.println("  6 characters: " + String.format("%,d", (long)Math.pow(62, 6)) + " possible URLs");
        System.out.println("  7 characters: " + String.format("%,d", (long)Math.pow(62, 7)) + " possible URLs");
        System.out.println("  8 characters: " + String.format("%,d", (long)Math.pow(62, 8)) + " possible URLs");
        System.out.println();
    }
    
    private static void demoErrorHandling() {
        System.out.println("--- Error Handling ---");
        
        URLShortenerService service = new URLShortenerService("https://short.ly");
        
        // Invalid URL
        System.out.println("1. Invalid URL:");
        try {
            service.shortenURL("not a valid url");
            System.out.println("  ERROR: Should have thrown exception");
        } catch (IllegalArgumentException e) {
            System.out.println("  ✓ Caught: " + e.getMessage());
        }
        
        // Invalid custom alias
        System.out.println("\n2. Invalid custom alias (too short):");
        try {
            service.shortenURL("https://example.com", "ab");
            System.out.println("  ERROR: Should have thrown exception");
        } catch (IllegalArgumentException e) {
            System.out.println("  ✓ Caught: " + e.getMessage());
        }
        
        // Reserved keyword
        System.out.println("\n3. Reserved keyword:");
        try {
            service.shortenURL("https://example.com", "admin");
            System.out.println("  ERROR: Should have thrown exception");
        } catch (IllegalArgumentException e) {
            System.out.println("  ✓ Caught: " + e.getMessage());
        }
        
        // Alias already taken
        System.out.println("\n4. Alias already taken:");
        try {
            service.shortenURL("https://example.com/first", "test123");
            service.shortenURL("https://example.com/second", "test123");
            System.out.println("  ERROR: Should have thrown exception");
        } catch (AliasUnavailableException e) {
            System.out.println("  ✓ Caught: " + e.getMessage());
        }
        
        // Non-existent short code
        System.out.println("\n5. Non-existent short code:");
        try {
            service.getLongURL("nonexistent");
            System.out.println("  ERROR: Should have thrown exception");
        } catch (URLNotFoundException e) {
            System.out.println("  ✓ Caught: " + e.getMessage());
        }
        
        // URL too long
        System.out.println("\n6. URL too long:");
        try {
            StringBuilder longURL = new StringBuilder("https://example.com/");
            for (int i = 0; i < 3000; i++) {
                longURL.append("a");
            }
            service.shortenURL(longURL.toString());
            System.out.println("  ERROR: Should have thrown exception");
        } catch (IllegalArgumentException e) {
            System.out.println("  ✓ Caught: URL too long");
        }
        
        System.out.println();
    }
}

