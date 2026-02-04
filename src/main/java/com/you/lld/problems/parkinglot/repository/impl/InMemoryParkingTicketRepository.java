package com.you.lld.problems.parkinglot.repository.impl;

import com.you.lld.problems.parkinglot.model.ParkingTicket;
import com.you.lld.problems.parkinglot.model.VehicleType;
import com.you.lld.problems.parkinglot.repository.ParkingTicketRepository;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

/**
 * In-memory implementation of ParkingTicketRepository.
 */
public class InMemoryParkingTicketRepository implements ParkingTicketRepository {
    
    private final Map<String, ParkingTicket> tickets = new ConcurrentHashMap<>();
    
    @Override
    public ParkingTicket save(ParkingTicket ticket) {
        tickets.put(ticket.getId(), ticket);
        return ticket;
    }
    
    @Override
    public Optional<ParkingTicket> findById(String ticketId) {
        return Optional.ofNullable(tickets.get(ticketId));
    }
    
    @Override
    public List<ParkingTicket> findActiveTickets() {
        return tickets.values().stream()
            .filter(t -> t.getExitTime() == null)
            .collect(Collectors.toList());
    }
    
    @Override
    public List<ParkingTicket> findByVehicleType(VehicleType type) {
        return tickets.values().stream()
            .filter(t -> t.getVehicle().getVehicleType() == type)
            .collect(Collectors.toList());
    }
    
    @Override
    public List<ParkingTicket> findByDateRange(LocalDateTime start, LocalDateTime end) {
        return tickets.values().stream()
            .filter(t -> !t.getEntryTime().isBefore(start) && 
                        !t.getEntryTime().isAfter(end))
            .collect(Collectors.toList());
    }
    
    @Override
    public Optional<ParkingTicket> findBySpaceId(String spaceId) {
        return tickets.values().stream()
            .filter(t -> t.getSpace().getId().equals(spaceId))
            .filter(t -> t.getExitTime() == null) // Only active
            .findFirst();
    }
    
    @Override
    public List<ParkingTicket> findLongDurationParking(LocalDateTime threshold) {
        return tickets.values().stream()
            .filter(t -> t.getExitTime() == null)
            .filter(t -> t.getEntryTime().isBefore(threshold))
            .collect(Collectors.toList());
    }
    
    @Override
    public void delete(String ticketId) {
        tickets.remove(ticketId);
    }
    
    @Override
    public double getTotalRevenue(LocalDateTime start, LocalDateTime end) {
        return tickets.values().stream()
            .filter(t -> t.getExitTime() != null)
            .filter(t -> !t.getExitTime().isBefore(start) && 
                        !t.getExitTime().isAfter(end))
            .mapToDouble(t -> t.getPayment() != null ? 
                t.getPayment().getAmount().toBigDecimal().doubleValue() : 0.0)
            .sum();
    }
    
    @Override
    public long countByVehicleType(VehicleType type) {
        return tickets.values().stream()
            .filter(t -> t.getVehicle().getVehicleType() == type)
            .filter(t -> t.getExitTime() == null)
            .count();
    }
    
    @Override
    public boolean isVehicleParked(String licensePlate) {
        return tickets.values().stream()
            .anyMatch(t -> t.getVehicle().getLicensePlate().equals(licensePlate) &&
                          t.getExitTime() == null);
    }
}
