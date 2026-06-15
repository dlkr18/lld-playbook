package com.you.lld.problems.urlshortener.service.impl;

import java.net.MalformedURLException;
import java.net.URL;

public final class URLValidator {

    private static final int MAX_URL_LENGTH = 2048;
    private static final int MIN_URL_LENGTH = 10;

    private URLValidator() {
    }

    public static boolean isValid(String url) {
        if (url == null || url.trim().isEmpty()) {
            return false;
        }
        String trimmed = url.trim();
        if (trimmed.length() < MIN_URL_LENGTH || trimmed.length() > MAX_URL_LENGTH) {
            return false;
        }
        if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
            return false;
        }
        try {
            URL parsed = new URL(trimmed);
            String host = parsed.getHost();
            return host != null && !host.isEmpty() && host.contains(".");
        } catch (MalformedURLException e) {
            return false;
        }
    }

    public static String normalize(String url) {
        if (!isValid(url)) {
            throw new IllegalArgumentException("Invalid URL: " + url);
        }
        try {
            URL parsed = new URL(url.trim());
            String protocol = parsed.getProtocol().toLowerCase();
            String host = parsed.getHost().toLowerCase();
            int port = parsed.getPort();
            String path = parsed.getPath();
            String query = parsed.getQuery();

            if ((protocol.equals("http") && port == 80) || (protocol.equals("https") && port == 443)) {
                port = -1;
            }
            if (path.length() > 1 && path.endsWith("/")) {
                path = path.substring(0, path.length() - 1);
            }

            StringBuilder normalized = new StringBuilder();
            normalized.append(protocol).append("://").append(host);
            if (port != -1) {
                normalized.append(":").append(port);
            }
            normalized.append(path.isEmpty() ? "/" : path);
            if (query != null && !query.isEmpty()) {
                normalized.append("?").append(query);
            }
            return normalized.toString();
        } catch (MalformedURLException e) {
            throw new IllegalArgumentException("Invalid URL: " + url, e);
        }
    }

    public static boolean isValidAlias(String alias) {
        if (alias == null || alias.isEmpty()) {
            return false;
        }
        if (alias.length() < 4 || alias.length() > 8) {
            return false;
        }
        if (!alias.matches("^[a-zA-Z0-9]+$")) {
            return false;
        }
        return !isReserved(alias.toLowerCase());
    }

    private static boolean isReserved(String alias) {
        String[] reserved = {"admin", "api", "www", "login", "stats"};
        for (String keyword : reserved) {
            if (keyword.equals(alias)) {
                return true;
            }
        }
        return false;
    }
}
