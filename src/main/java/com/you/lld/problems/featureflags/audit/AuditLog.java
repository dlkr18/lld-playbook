package com.you.lld.problems.featureflags.audit;

import java.time.LocalDateTime;

public class AuditLog {
    private final String featureId;
    private final String userId;
    private final boolean enabled;
    private final LocalDateTime timestamp;
    
    public AuditLog(String featureId, String userId, boolean enabled) {
        this.featureId = featureId;
        this.userId = userId;
        this.enabled = enabled;
        this.timestamp = LocalDateTime.now();
    }
    
    @Override
    public String toString() {
        return String.format("[%s] Feature %s: %s for user %s",
            timestamp, featureId, enabled ? "ENABLED" : "DISABLED", userId);
    }
}
