package com.you.lld.problems.library.model;

public enum BookStatus {
    AVAILABLE,
    BORROWED,
    RESERVED,  // held for a member who placed a reservation
    LOST,
    MAINTENANCE
}
