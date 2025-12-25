package com.you.lld.problems.whatsapp.model;

/**
 * Enumeration representing types of chats.
 */
public enum ChatType {
    DIRECT("Direct Chat"),
    GROUP("Group Chat");

    private final String displayName;

    ChatType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}




