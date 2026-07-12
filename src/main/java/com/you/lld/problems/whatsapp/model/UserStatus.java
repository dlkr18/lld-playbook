package com.you.lld.problems.whatsapp.model;

/**
 * Enumeration representing user's online status.
 */
public enum UserStatus {
    ONLINE("Online"),
    OFFLINE("Offline"),
    AWAY("Away");

    private final String displayName;

    UserStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}






