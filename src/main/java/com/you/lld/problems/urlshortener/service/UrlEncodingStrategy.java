package com.you.lld.problems.urlshortener.service;

public interface UrlEncodingStrategy {

    String encode(String longUrl);

    String name();
}
