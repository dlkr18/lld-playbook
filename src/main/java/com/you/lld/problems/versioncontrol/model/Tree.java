package com.you.lld.problems.versioncontrol.model;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.TreeMap;

/**
 * Tree object mapping file paths to blob hashes (flat namespace).
 */
public final class Tree {

    private final String hash;
    private final Map<String, String> entries;

    public Tree(Map<String, String> pathToBlobHash) {
        Map<String, String> sorted = new TreeMap<String, String>(pathToBlobHash);
        this.entries = Collections.unmodifiableMap(new HashMap<String, String>(sorted));
        this.hash = digest("tree", sorted);
    }

    public String getHash() {
        return hash;
    }

    public Map<String, String> getEntries() {
        return entries;
    }

    static String digest(String prefix, Map<String, String> sorted) {
        StringBuilder canonical = new StringBuilder(prefix);
        for (Map.Entry<String, String> e : sorted.entrySet()) {
            canonical.append(e.getKey()).append('\0').append(e.getValue()).append('\n');
        }
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-1");
            byte[] bytes = md.digest(canonical.toString().getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            for (byte b : bytes) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-1 unavailable", e);
        }
    }
}
