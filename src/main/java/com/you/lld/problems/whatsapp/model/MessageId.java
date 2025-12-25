package com.you.lld.problems.whatsapp.model;

import java.util.Objects;
import java.util.UUID;

/**
 * Value object representing a unique message identifier.
 * Immutable and type-safe.
 */
public final class MessageId {
    private final String id;

    private MessageId(String id) {
        if (id == null || id.trim().isEmpty()) {
            throw new IllegalArgumentException("Message ID cannot be null or empty");
        }
        this.id = id;
    }

    public static MessageId generate() {
        return new MessageId(UUID.randomUUID().toString());
    }

    public static MessageId of(String id) {
        return new MessageId(id);
    }

    public String getValue() {
        return id;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        MessageId messageId = (MessageId) o;
        return Objects.equals(id, messageId.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return "MessageId{" + id + '}';
    }
}





