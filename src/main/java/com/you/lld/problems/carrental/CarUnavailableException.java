package com.you.lld.problems.carrental;

/**
 * Thrown when a car cannot be reserved for the requested window — either it is
 * not in service, or an overlapping reservation already exists. Unchecked so the
 * happy path stays clean; callers that race for the same car catch this to learn
 * they lost.
 */
public class CarUnavailableException extends RuntimeException {

    public CarUnavailableException(String message) {
        super(message);
    }
}
