package com.you.lld.problems.whatsapp.model;

/**
 * Enumeration representing types of messages.
 */
public enum MessageType {
    TEXT("Text"),
    IMAGE("Image"),
    VIDEO("Video"),
    AUDIO("Audio"),
    DOCUMENT("Document"),
    LOCATION("Location"),
    CONTACT("Contact");

    private final String displayName;

    MessageType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    public boolean isMedia() {
        return this == IMAGE || this == VIDEO || this == AUDIO || this == DOCUMENT;
    }
}





