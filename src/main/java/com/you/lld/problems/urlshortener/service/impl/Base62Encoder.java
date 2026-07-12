package com.you.lld.problems.urlshortener.service.impl;

public final class Base62Encoder {

    private static final String BASE62_CHARS =
        "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    private static final int BASE = 62;

    private Base62Encoder() {
    }

    public static String encode(long num) {
        if (num < 0) {
            throw new IllegalArgumentException("Number must be non-negative");
        }
        if (num == 0) {
            return "0";
        }
        StringBuilder result = new StringBuilder();
        long value = num;
        while (value > 0) {
            result.append(BASE62_CHARS.charAt((int) (value % BASE)));
            value /= BASE;
        }
        return result.reverse().toString();
    }

    public static String encode(long num, int minLength) {
        String encoded = encode(num);
        if (encoded.length() >= minLength) {
            return encoded;
        }
        StringBuilder padded = new StringBuilder();
        for (int i = 0; i < minLength - encoded.length(); i++) {
            padded.append('0');
        }
        padded.append(encoded);
        return padded.toString();
    }
}
