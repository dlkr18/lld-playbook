package com.you.lld.problems.airlinebooking.service;

import com.you.lld.problems.airlinebooking.model.Airport;
import com.you.lld.problems.airlinebooking.model.Flight;

import java.time.LocalDate;
import java.util.List;

/**
 * Read-side concern: register flights and search them by route and date.
 */
public interface FlightSearchService {

    /** Registers a flight so it becomes searchable. */
    void addFlight(Flight flight);

    /**
     * Finds flights departing from {@code origin} to {@code destination} on
     * {@code date}. Never returns {@code null}.
     */
    List<Flight> search(Airport origin, Airport destination, LocalDate date);

    /** Looks up a registered flight by its number, or {@code null} if unknown. */
    Flight findByNumber(String flightNumber);
}
