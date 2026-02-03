package com.you.lld.problems.bookmyshow.repository.impl;

import com.you.lld.problems.bookmyshow.model.Booking;
import com.you.lld.problems.bookmyshow.model.BookingStatus;
import com.you.lld.problems.bookmyshow.repository.BookingRepository;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

/**
 * In-memory implementation of BookingRepository.
 * For production, replace with JPA/JDBC/NoSQL implementation.
 */
public class InMemoryBookingRepository implements BookingRepository {
    
    private final Map<String, Booking> bookings = new ConcurrentHashMap<>();
    
    @Override
    public Booking save(Booking booking) {
        bookings.put(booking.getId(), booking);
        return booking;
    }
    
    @Override
    public Optional<Booking> findById(String bookingId) {
        return Optional.ofNullable(bookings.get(bookingId));
    }
    
    @Override
    public List<Booking> findByUserId(String userId) {
        return bookings.values().stream()
            .filter(b -> b.getUserId().equals(userId))
            .sorted(Comparator.comparing(Booking::getBookingTime).reversed())
            .collect(Collectors.toList());
    }
    
    @Override
    public List<Booking> findByShowId(String showId) {
        return bookings.values().stream()
            .filter(b -> b.getShowId().equals(showId))
            .collect(Collectors.toList());
    }
    
    @Override
    public List<Booking> findByStatus(BookingStatus status) {
        return bookings.values().stream()
            .filter(b -> b.getStatus() == status)
            .collect(Collectors.toList());
    }
    
    @Override
    public List<Booking> findByDateRange(LocalDateTime start, LocalDateTime end) {
        return bookings.values().stream()
            .filter(b -> !b.getBookingTime().isBefore(start) && 
                        !b.getBookingTime().isAfter(end))
            .collect(Collectors.toList());
    }
    
    @Override
    public List<Booking> findExpiredPendingBookings(LocalDateTime expiryThreshold) {
        return bookings.values().stream()
            .filter(b -> b.getStatus() == BookingStatus.PENDING)
            .filter(b -> b.getBookingTime().isBefore(expiryThreshold))
            .collect(Collectors.toList());
    }
    
    @Override
    public void delete(String bookingId) {
        bookings.remove(bookingId);
    }
    
    @Override
    public double getTotalRevenue(LocalDateTime start, LocalDateTime end) {
        return bookings.values().stream()
            .filter(b -> b.getStatus() == BookingStatus.CONFIRMED)
            .filter(b -> !b.getBookingTime().isBefore(start) && 
                        !b.getBookingTime().isAfter(end))
            .mapToDouble(Booking::getTotalAmount)
            .sum();
    }
    
    @Override
    public long countByStatus(BookingStatus status) {
        return bookings.values().stream()
            .filter(b -> b.getStatus() == status)
            .count();
    }
    
    @Override
    public boolean hasActiveBookingForShow(String userId, String showId) {
        return bookings.values().stream()
            .anyMatch(b -> b.getUserId().equals(userId) &&
                          b.getShowId().equals(showId) &&
                          (b.getStatus() == BookingStatus.CONFIRMED || 
                           b.getStatus() == BookingStatus.PENDING));
    }
}
