package com.you.lld.problems.stackoverflow.model;

/**
 * Represents the status of a user account.
 */
public enum UserStatus {
    /**
     * User account is active and in good standing.
     */
    ACTIVE,
    
    /**
     * User account is temporarily suspended due to violations.
     */
    SUSPENDED,
    
    /**
     * User account has been permanently deleted.
     */
    DELETED
}

