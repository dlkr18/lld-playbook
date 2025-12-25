package com.you.lld.problems.whatsapp.model;

/**
 * Enumeration representing participant roles in a group.
 */
public enum ParticipantRole {
    ADMIN("Admin"),
    MEMBER("Member");

    private final String displayName;

    ParticipantRole(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    public boolean canManageGroup() {
        return this == ADMIN;
    }

    public boolean canAddMembers() {
        return this == ADMIN;
    }

    public boolean canRemoveMembers() {
        return this == ADMIN;
    }
}





