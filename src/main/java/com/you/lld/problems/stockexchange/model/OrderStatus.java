package com.you.lld.problems.stockexchange.model;

/**
 * Status of an order.
 */
public enum OrderStatus {
    PENDING,    // Order created but not yet submitted
    OPEN,       // Order submitted and waiting to be filled
    PARTIALLY_FILLED, // Order partially executed
    FILLED,     // Order fully executed
    CANCELLED   // Order cancelled
}
