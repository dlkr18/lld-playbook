package com.you.lld.problems.versioncontrol.model;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

/**
 * Content-addressed blob — immutable file contents.
 */
public final class Blob {

    private final String hash;
    private final String content;

    public Blob(String content) {
        this.content = content;
        this.hash = sha1(content);
    }

    public String getHash() {
        return hash;
    }

    public String getContent() {
        return content;
    }

    private static String sha1(String content) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-1");
            byte[] bytes = digest.digest(content.getBytes(StandardCharsets.UTF_8));
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
