package com.you.lld.problems.urlshortener.service;

import com.you.lld.problems.urlshortener.model.Analytics;
import com.you.lld.problems.urlshortener.model.ShortURL;
import com.you.lld.problems.urlshortener.model.URLMapping;

public interface URLRepository {

    URLMapping findByShortCode(String shortCode);

    String findShortCodeByLongUrl(String longUrl);

    void save(URLMapping mapping);

    boolean delete(String shortCode);

    boolean isShortCodeTaken(String shortCode);

    int count();
}
