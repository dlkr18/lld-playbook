package com.you.lld.problems.whatsapp.model;

/**
 * Enumeration representing message delivery status.
 * Follows WhatsApp's status progression: SENT → DELIVERED → READ
 */
public enum MessageStatus {
    SENT("Sent", "✓"),           // Single tick
    DELIVERED("Delivered", "✓✓"), // Double tick
    READ("Read", "✓✓"),          // Blue ticks
    DELETED("Deleted", "🗑");    // Deleted message

    private final String displayName;
    private final String symbol;

    MessageStatus(String displayName, String symbol) {
        this.displayName = displayName;
        this.symbol = symbol;
    }

    public String getDisplayName() {
        return displayName;
    }

    public String getSymbol() {
        return symbol;
    }

    public boolean canTransitionTo(MessageStatus newStatus) {
        if (this == DELETED) {
            return false; // Cannot transition from deleted
        }
        
        if (newStatus == DELETED) {
            return true; // Can always delete
        }
        
        // Normal progression: SENT -> DELIVERED -> READ
        return newStatus.ordinal() > this.ordinal();
    }
}





