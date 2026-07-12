package com.you.lld.problems.airlinebooking.service.impl;

import com.you.lld.problems.airlinebooking.model.Airport;
import com.you.lld.problems.airlinebooking.model.Flight;
import com.you.lld.problems.airlinebooking.service.FlightSearchService;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

/**
 * In-memory flight catalog. Backed by a {@link ConcurrentHashMap} keyed by
 * flight number so registration and search are safe under concurrent access.
 *
 * <p>Search is a linear scan filtered by origin, destination and departure date
 * — adequate for an interview-scale catalog; a production system would index by
 * {@code (origin, destination, date)}.
 */
public final class InMemoryFlightSearchService implements FlightSearchService {

    private final ConcurrentMap<String, Flight> flights = new ConcurrentHashMap<String, Flight>();

    @Override
    public void addFlight(Flight flight) {
        if (flight == null) {
            throw new IllegalArgumentException("Flight is required");
        }
        Flight existing = flights.putIfAbsent(flight.flightNumber(), flight);
        if (existing != null) {
            throw new IllegalArgumentException("Flight already registered: " + flight.flightNumber());
        }
    }

    @Override
    public List<Flight> search(Airport origin, Airport destination, LocalDate date) {
        if (origin == null || destination == null || date == null) {
            throw new IllegalArgumentException("Origin, destination and date are required");
        }
        List<Flight> matches = new ArrayList<Flight>();
        for (Flight flight : flights.values()) {
            if (flight.origin().equals(origin)
                    && flight.destination().equals(destination)
                    && flight.departureDate().equals(date)) {
                matches.add(flight);
            }
        }
        return matches;
    }

    @Override
    public Flight findByNumber(String flightNumber) {
        if (flightNumber == null) {
            return null;
        }
        return flights.get(flightNumber.trim().toUpperCase());
    }
}
