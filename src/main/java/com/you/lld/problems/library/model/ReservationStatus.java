package com.you.lld.problems.library.model;

public enum ReservationStatus {
    WAITING,     // in queue, no copy available yet
    FULFILLED,   // a copy became available, member was notified
    CANCELLED,   // member cancelled the reservation
    EXPIRED      // member didn't pick up within the grace period
}
