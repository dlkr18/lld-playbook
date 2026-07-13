package com.you.lld.problems.ministore.model;

/**
 * Order lifecycle. PENDING is the transient state during placement (inventory deducted,
 * awaiting payment); it resolves to exactly one terminal state.
 *
 *   PENDING --(payment approved)--> CONFIRMED
 *   PENDING --(payment declined)--> CANCELLED   (inventory rolled back)
 */
public enum OrderStatus {
    PENDING,
    CONFIRMED,
    CANCELLED
}
