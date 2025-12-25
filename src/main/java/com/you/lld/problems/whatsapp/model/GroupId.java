package com.you.lld.problems.whatsapp.model;

import java.util.Objects;
import java.util.UUID;

/**
 * Value object representing a unique group identifier.
 * Immutable and type-safe.
 */
public final class GroupId {
    private final String id;

    private GroupId(String id) {
        if (id == null || id.trim().isEmpty()) {
            throw new IllegalArgumentException("Group ID cannot be null or empty");
        }
        this.id = id;
    }

    public static GroupId generate() {
        return new GroupId(UUID.randomUUID().toString());
    }

    public static GroupId of(String id) {
        return new GroupId(id);
    }

    public String getValue() {
        return id;
    }

    public ChatId toChatId() {
        return ChatId.of(id);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        GroupId groupId = (GroupId) o;
        return Objects.equals(id, groupId.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return "GroupId{" + id + '}';
    }
}





