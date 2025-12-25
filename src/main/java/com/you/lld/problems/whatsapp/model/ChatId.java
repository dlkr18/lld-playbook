package com.you.lld.problems.whatsapp.model;

import java.util.Objects;
import java.util.UUID;

/**
 * Value object representing a unique chat identifier.
 * Immutable and type-safe.
 */
public final class ChatId {
    private final String id;

    private ChatId(String id) {
        if (id == null || id.trim().isEmpty()) {
            throw new IllegalArgumentException("Chat ID cannot be null or empty");
        }
        this.id = id;
    }

    public static ChatId generate() {
        return new ChatId(UUID.randomUUID().toString());
    }

    public static ChatId of(String id) {
        return new ChatId(id);
    }

    public String getValue() {
        return id;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ChatId chatId = (ChatId) o;
        return Objects.equals(id, chatId.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return "ChatId{" + id + '}';
    }
}





