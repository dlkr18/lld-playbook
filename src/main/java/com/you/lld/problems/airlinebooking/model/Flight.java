package com.you.lld.problems.airlinebooking.model;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Objects;

/**
 * Immutable scheduled flight: a specific {@link Aircraft} flying from one
 * {@link Airport} to another at a fixed departure/arrival time.
 *
 * <p>The flight is stateless with respect to seat availability — availability is
 * tracked separately per flight in the concurrency layer. This keeps the flight
 * object safely shareable and cache-friendly.
 */
public final class Flight {

    private final String flightNumber;
    private final Airport origin;
    private final Airport destination;
    private final LocalDateTime departure;
    private final LocalDateTime arrival;
    private final Aircraft aircraft;

    public Flight(String flightNumber,
                  Airport origin,
                  Airport destination,
                  LocalDateTime departure,
                  LocalDateTime arrival,
                  Aircraft aircraft) {
        if (flightNumber == null || flightNumber.trim().isEmpty()) {
            throw new IllegalArgumentException("Flight number is required");
        }
        if (origin == null || destination == null) {
            throw new IllegalArgumentException("Origin and destination are required");
        }
        if (origin.equals(destination)) {
            throw new IllegalArgumentException("Origin and destination must differ");
        }
        if (departure == null || arrival == null) {
            throw new IllegalArgumentException("Departure and arrival are required");
        }
        if (!arrival.isAfter(departure)) {
            throw new IllegalArgumentException("Arrival must be after departure");
        }
        if (aircraft == null) {
            throw new IllegalArgumentException("Aircraft is required");
        }
        this.flightNumber = flightNumber.trim().toUpperCase();
        this.origin = origin;
        this.destination = destination;
        this.departure = departure;
        this.arrival = arrival;
        this.aircraft = aircraft;
    }

    public String flightNumber() {
        return flightNumber;
    }

    public Airport origin() {
        return origin;
    }

    public Airport destination() {
        return destination;
    }

    public LocalDateTime departure() {
        return departure;
    }

    public LocalDateTime arrival() {
        return arrival;
    }

    public LocalDate departureDate() {
        return departure.toLocalDate();
    }

    public Aircraft aircraft() {
        return aircraft;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Flight flight = (Flight) o;
        return flightNumber.equals(flight.flightNumber);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(flightNumber);
    }

    @Override
    public String toString() {
        return flightNumber + " " + origin + "->" + destination + " @ " + departure;
    }
}
