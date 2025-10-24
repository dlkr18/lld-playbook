package com.you.lld.problems.urlshortener;

import java.net.MalformedURLException;
import java.net.URL;

/**
 * Utility class for URL validation and normalization.
 * 
 * <p>Validates URLs according to common web standards and normalizes
 * them for consistent storage and comparison.
 */
public class URLValidator {
    
    private static final int MAX_URL_LENGTH = 2048;
    private static final int MIN_URL_LENGTH = 10; // http://a.b
    
    /**
     * Validates if a URL is well-formed and acceptable.
     * 
     * @param url the URL to validate
     * @return true if valid, false otherwise
     */
    public static boolean isValid(String url) {
        if (url == null || url.trim().isEmpty()) {
            return false;
        }
        
        String trimmed = url.trim();
        
        // Check length
        if (trimmed.length() < MIN_URL_LENGTH || trimmed.length() > MAX_URL_LENGTH) {
            return false;
        }
        
        // Must start with http:// or https://
        if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
            return false;
        }
        
        // Try to parse as URL
        try {
            URL parsedUrl = new URL(trimmed);
            String host = parsedUrl.getHost();
            
            // Host must not be empty and must contain at least one dot
            if (host == null || host.isEmpty() || !host.contains(".")) {
                return false;
            }
            
            return true;
        } catch (MalformedURLException e) {
            return false;
        }
    }
    
    /**
     * Normalizes a URL for consistent storage.
     * 
     * <p>Normalization includes:
     * <ul>
     *   <li>Trim whitespace</li>
     *   <li>Convert domain to lowercase</li>
     *   <li>Remove trailing slash (except for root path)</li>
     *   <li>Remove default ports (80 for HTTP, 443 for HTTPS)</li>
     * </ul>
     * 
     * @param url the URL to normalize
     * @return normalized URL
     * @throws IllegalArgumentException if URL is invalid
     */
    public static String normalize(String url) {
        if (!isValid(url)) {
            throw new IllegalArgumentException("Invalid URL: " + url);
        }
        
        try {
            URL parsedUrl = new URL(url.trim());
            
            String protocol = parsedUrl.getProtocol().toLowerCase();
            String host = parsedUrl.getHost().toLowerCase();
            int port = parsedUrl.getPort();
            String path = parsedUrl.getPath();
            String query = parsedUrl.getQuery();
            
            // Remove default ports
            if ((protocol.equals("http") && port == 80) || 
                (protocol.equals("https") && port == 443)) {
                port = -1;
            }
            
            // Remove trailing slash from path (but keep it for root)
            if (path.length() > 1 && path.endsWith("/")) {
                path = path.substring(0, path.length() - 1);
            }
            
            // Reconstruct URL
            StringBuilder normalized = new StringBuilder();
            normalized.append(protocol).append("://").append(host);
            
            if (port != -1) {
                normalized.append(":").append(port);
            }
            
            if (path.isEmpty()) {
                normalized.append("/");
            } else {
                normalized.append(path);
            }
            
            if (query != null && !query.isEmpty()) {
                normalized.append("?").append(query);
            }
            
            return normalized.toString();
        } catch (MalformedURLException e) {
            throw new IllegalArgumentException("Invalid URL: " + url, e);
        }
    }
    
    /**
     * Validates if a custom alias is acceptable.
     * 
     * <p>Valid alias must:
     * <ul>
     *   <li>Be 4-8 characters long</li>
     *   <li>Contain only alphanumeric characters [a-zA-Z0-9]</li>
     *   <li>Not be a reserved keyword</li>
     * </ul>
     * 
     * @param alias the alias to validate
     * @return true if valid, false otherwise
     */
    public static boolean isValidAlias(String alias) {
        if (alias == null || alias.isEmpty()) {
            return false;
        }
        
        // Length check
        if (alias.length() < 4 || alias.length() > 8) {
            return false;
        }
        
        // Alphanumeric only
        if (!alias.matches("^[a-zA-Z0-9]+$")) {
            return false;
        }
        
        // Not a reserved keyword
        if (isReservedKeyword(alias.toLowerCase())) {
            return false;
        }
        
        return true;
    }
    
    private static boolean isReservedKeyword(String alias) {
        String[] reserved = {
            "admin", "api", "www", "ftp", "mail",
            "create", "delete", "update", "stats", "analytics",
            "help", "about", "terms", "privacy", "contact",
            "login", "signup", "logout", "settings", "account"
        };
        
        for (String keyword : reserved) {
            if (keyword.equals(alias)) {
                return true;
            }
        }
        
        return false;
    }
}

