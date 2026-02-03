package com.you.lld.problems.parkinglot.impl;

import com.you.lld.common.Money;
import com.you.lld.problems.parkinglot.api.*;
import com.you.lld.problems.parkinglot.api.exceptions.*;
import com.you.lld.problems.parkinglot.model.*;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

/**
 * In-memory implementation of ParkingService.
 * Thread-safe implementation using concurrent data structures.
 */
public class InMemoryParkingService implements ParkingService {
  
  private final Map<String, ParkingSpace> allSpaces;
  private final Map<String, ParkingTicket> activeTickets;
  private final Map<String, ParkingTicket> completedTickets;
  private final PricingStrategy pricingStrategy;
  private final SpaceAllocationStrategy allocationStrategy;
  private final PaymentProcessor paymentProcessor;
  private final AtomicLong ticketCounter;
  private final AtomicLong paymentCounter;
  
  public InMemoryParkingService(
      List<ParkingSpace> parkingSpaces,
      PricingStrategy pricingStrategy,
      SpaceAllocationStrategy allocationStrategy,
      PaymentProcessor paymentProcessor) {
    
    this.allSpaces = new ConcurrentHashMap<>();
    this.activeTickets = new ConcurrentHashMap<>();
    this.completedTickets = new ConcurrentHashMap<>();
    this.pricingStrategy = Objects.requireNonNull(pricingStrategy, "Pricing strategy cannot be null");
    this.allocationStrategy = Objects.requireNonNull(allocationStrategy, "Allocation strategy cannot be null");
    this.paymentProcessor = Objects.requireNonNull(paymentProcessor, "Payment processor cannot be null");
    this.ticketCounter = new AtomicLong(1);
    this.paymentCounter = new AtomicLong(1);
    
    // Initialize parking spaces
    if (parkingSpaces == null || parkingSpaces.isEmpty()) {
      throw new IllegalArgumentException("Parking spaces list cannot be null or empty");
    }
    
    for (ParkingSpace space : parkingSpaces) {
      this.allSpaces.put(space.getSpaceId(), space);
    }
  }
  
  @Override
  public ParkingTicket enterVehicle(Vehicle vehicle) throws ParkingFullException, InvalidVehicleException {
    // Validate vehicle
    if (vehicle == null) {
      throw new InvalidVehicleException("Vehicle cannot be null");
    }
    
    if (vehicle.getLicenseNumber() == null || vehicle.getLicenseNumber().trim().isEmpty()) {
      throw new InvalidVehicleException("Vehicle license number cannot be empty");
    }
    
    // Check if vehicle is already parked
    boolean alreadyParked = activeTickets.values().stream()
        .anyMatch(ticket -> ticket.getVehicle().getLicenseNumber().equals(vehicle.getLicenseNumber()));
    
    if (alreadyParked) {
      throw new InvalidVehicleException("Vehicle " + vehicle.getLicenseNumber() + " is already parked");
    }
    
    // Find available spaces
    List<ParkingSpace> availableSpaces = allSpaces.values().stream()
        .filter(space -> !space.isOccupied() && space.canFit(vehicle))
        .collect(Collectors.toList());
    
    if (availableSpaces.isEmpty()) {
      throw new ParkingFullException(vehicle.getVehicleType());
    }
    
    // Use allocation strategy to select best space
    Optional<ParkingSpace> selectedSpace = allocationStrategy.selectSpace(availableSpaces, vehicle.getVehicleType());
    
    if (!selectedSpace.isPresent()) {
      throw new ParkingFullException(vehicle.getVehicleType());
    }
    
    ParkingSpace space = selectedSpace.get();
    
    // Occupy the space
    synchronized (space) {
      if (!space.occupy(vehicle)) {
        throw new ParkingFullException(vehicle.getVehicleType());
      }
    }
    
    // Generate ticket
    String ticketId = generateTicketId();
    ParkingTicket ticket = new ParkingTicket(ticketId, vehicle, space, LocalDateTime.now());
    activeTickets.put(ticketId, ticket);
    
    return ticket;
  }
  
  @Override
  public Payment exitVehicle(String ticketId, PaymentMethod paymentMethod) 
      throws InvalidTicketException, PaymentFailedException {
    
    // Validate ticket
    if (ticketId == null || ticketId.trim().isEmpty()) {
      throw new InvalidTicketException("Ticket ID cannot be empty");
    }
    
    ParkingTicket ticket = activeTickets.get(ticketId);
    if (ticket == null) {
      throw new InvalidTicketException("Invalid or expired ticket: " + ticketId);
    }
    
    if (!ticket.isValid()) {
      throw new InvalidTicketException("Ticket is not valid for exit: " + ticketId);
    }
    
    // Calculate parking fee
    Money parkingFee = pricingStrategy.calculateFee(ticket);
    
    // Create payment
    String paymentId = generatePaymentId();
    Payment payment = new Payment(paymentId, ticket, parkingFee, paymentMethod);
    
    // Process payment
    try {
      boolean paymentSuccess = paymentProcessor.processPayment(payment);
      
      if (!paymentSuccess) {
        payment.markFailed();
        throw new PaymentFailedException("Payment processing failed for ticket: " + ticketId);
      }
      
      payment.markCompleted("TXN-" + System.currentTimeMillis());
      
    } catch (PaymentProcessingException e) {
      payment.markFailed();
      throw new PaymentFailedException("Payment processing error: " + e.getMessage(), e);
    }
    
    // Mark ticket as exited
    ticket.markExit(LocalDateTime.now());
    
    // Vacate parking space
    ParkingSpace space = ticket.getParkingSpace();
    synchronized (space) {
      space.vacate();
    }
    
    // Move ticket to completed
    activeTickets.remove(ticketId);
    completedTickets.put(ticketId, ticket);
    
    return payment;
  }
  
  @Override
  public Money calculateParkingFee(String ticketId) throws InvalidTicketException {
    if (ticketId == null || ticketId.trim().isEmpty()) {
      throw new InvalidTicketException("Ticket ID cannot be empty");
    }
    
    ParkingTicket ticket = activeTickets.get(ticketId);
    if (ticket == null) {
      throw new InvalidTicketException("Invalid or expired ticket: " + ticketId);
    }
    
    return pricingStrategy.calculateFee(ticket);
  }
  
  @Override
  public boolean checkAvailability(VehicleType vehicleType) {
    if (vehicleType == null) {
      return false;
    }
    
    return allSpaces.values().stream()
        .anyMatch(space -> !space.isOccupied() && space.canFit(vehicleType));
  }
  
  @Override
  public OccupancyReport getOccupancyReport() {
    LocalDateTime timestamp = LocalDateTime.now();
    int totalSpaces = allSpaces.size();
    int occupiedSpaces = (int) allSpaces.values().stream()
        .filter(ParkingSpace::isOccupied)
        .count();
    
    Map<SpaceType, Integer> availableByType = new HashMap<>();
    Map<SpaceType, Integer> occupiedByType = new HashMap<>();
    
    for (SpaceType spaceType : SpaceType.values()) {
      int available = (int) allSpaces.values().stream()
          .filter(space -> space.getSpaceType() == spaceType && !space.isOccupied())
          .count();
      
      int occupied = (int) allSpaces.values().stream()
          .filter(space -> space.getSpaceType() == spaceType && space.isOccupied())
          .count();
      
      availableByType.put(spaceType, available);
      occupiedByType.put(spaceType, occupied);
    }
    
    return new OccupancyReport(timestamp, totalSpaces, occupiedSpaces, availableByType, occupiedByType);
  }
  
  /**
   * Adds a new parking space to the lot.
   * Useful for administrative operations.
   */
  public void addParkingSpace(ParkingSpace space) {
    if (space == null) {
      throw new IllegalArgumentException("Parking space cannot be null");
    }
    
    if (allSpaces.containsKey(space.getSpaceId())) {
      throw new IllegalArgumentException("Parking space already exists: " + space.getSpaceId());
    }
    
    allSpaces.put(space.getSpaceId(), space);
  }
  
  /**
   * Removes a parking space from the lot.
   * Only allowed if the space is not currently occupied.
   */
  public void removeParkingSpace(String spaceId) {
    if (spaceId == null || spaceId.trim().isEmpty()) {
      throw new IllegalArgumentException("Space ID cannot be empty");
    }
    
    ParkingSpace space = allSpaces.get(spaceId);
    if (space == null) {
      throw new IllegalArgumentException("Parking space not found: " + spaceId);
    }
    
    if (space.isOccupied()) {
      throw new IllegalStateException("Cannot remove occupied parking space: " + spaceId);
    }
    
    allSpaces.remove(spaceId);
  }
  
  /**
   * Gets a parking ticket by ticket ID (active or completed).
   */
  public Optional<ParkingTicket> getTicket(String ticketId) {
    ParkingTicket ticket = activeTickets.get(ticketId);
    if (ticket != null) {
      return Optional.of(ticket);
    }
    
    return Optional.ofNullable(completedTickets.get(ticketId));
  }
  
  /**
   * Gets all currently active tickets.
   */
  public List<ParkingTicket> getActiveTickets() {
    return new ArrayList<>(activeTickets.values());
  }
  
  private String generateTicketId() {
    return "TICKET-" + String.format("%08d", ticketCounter.getAndIncrement());
  }
  
  private String generatePaymentId() {
    return "PAY-" + String.format("%08d", paymentCounter.getAndIncrement());
  }
}
