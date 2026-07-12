package com.you.lld.problems.urlshortener.model;

import java.util.Objects;

public class ShortURL {

    private final String code;
    private final String fullUrl;

    public ShortURL(String code, String baseUrl) {
        if (code == null || code.isEmpty()) {
            throw new IllegalArgumentException("Code cannot be null or empty");
        }
        if (baseUrl == null || baseUrl.isEmpty()) {
            throw new IllegalArgumentException("Base URL cannot be null or empty");
        }
        this.code = code;
        this.fullUrl = (baseUrl.endsWith("/") ? baseUrl.substring(0, baseUrl.length() - 1) : baseUrl) + "/" + code;
    }

    public String getCode() {
        return code;
    }

    public String getFullUrl() {
        return fullUrl;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        ShortURL shortURL = (ShortURL) o;
        return code.equals(shortURL.code);
    }

    @Override
    public int hashCode() {
        return Objects.hash(code);
    }

    @Override
    public String toString() {
        return fullUrl;
    }
}
