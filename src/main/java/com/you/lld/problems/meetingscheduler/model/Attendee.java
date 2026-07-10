package com.you.lld.problems.meetingscheduler.model;

/**
 * Immutable person invited to a meeting. Kept deliberately thin: the entity
 * carries no notification logic (that lives behind {@code BookingObserver},
 * honouring SRP).
 */
public final class Attendee {

    private final String id;
    private final String name;
    private final String email;

    public Attendee(String id, String name, String email) {
        if (id == null || id.trim().isEmpty()) {
            throw new IllegalArgumentException("attendee id must not be blank");
        }
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("attendee name must not be blank");
        }
        if (email == null || email.trim().isEmpty()) {
            throw new IllegalArgumentException("attendee email must not be blank");
        }
        this.id = id;
        this.name = name;
        this.email = email;
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        return id.equals(((Attendee) o).id);
    }

    @Override
    public int hashCode() {
        return id.hashCode();
    }

    @Override
    public String toString() {
        return name + " <" + email + ">";
    }
}
