package com.you.lld.problems.urlshortener.service;

import com.you.lld.problems.urlshortener.model.Analytics;
import com.you.lld.problems.urlshortener.model.ShortURL;

public interface URLShortenerService {

    ShortURL shorten(String longUrl);

    ShortURL shorten(String longUrl, String customAlias);

    String resolve(String shortCode);

    Analytics getAnalytics(String shortCode);

    boolean delete(String shortCode);

    int totalUrls();
}
