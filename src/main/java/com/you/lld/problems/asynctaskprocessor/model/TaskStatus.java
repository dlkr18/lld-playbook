package com.you.lld.problems.asynctaskprocessor.model;

/**
 * Lifecycle of a submitted task.
 *
 *   PENDING --(worker picks it up)--> RUNNING --(returns)--> COMPLETED
 *                                             \--(throws)--> FAILED
 *   PENDING --(cancel before it starts)--> CANCELLED
 *
 * A task can only be cancelled while still PENDING — once a worker has started it,
 * cancellation is refused (we don't interrupt running work in v1).
 */
public enum TaskStatus {
    PENDING,
    RUNNING,
    COMPLETED,
    FAILED,
    CANCELLED
}
