package com.you.lld.problems.parkinglot.api;

import com.you.lld.problems.parkinglot.model.*;
import com.you.lld.problems.parkinglot.api.exceptions.*;
import com.you.lld.common.Money;

/**
 * Main parking service interface handling vehicle entry, exit, and payment processing.
 * Follows single responsibility principle - coordinates parking operations.
 */
public interface ParkingService {
  
  /**
   * Allows a vehicle to enter the parking lot.
   * Finds available space, assigns it, and generates a parking ticket.
   * 
   * @param vehicle the vehicle requesting entry
   * @return parking ticket for the assigned space
   * @throws ParkingFullException if no suitable space is available
   * @throws InvalidVehicleException if vehicle data is invalid
   */
  ParkingTicket enterVehicle(Vehicle vehicle) throws ParkingFullException, InvalidVehicleException;
  
  /**
   * Processes vehicle exit with payment.
   * Calculates parking fee, processes payment, and frees the space.
   * 
   * @param ticketId unique ticket identifier
   * @param paymentMethod preferred payment method
   * @return payment receipt
   * @throws InvalidTicketException if ticket is invalid or expired
   * @throws PaymentFailedException if payment processing fails
   */
  Payment exitVehicle(String ticketId, PaymentMethod paymentMethod) 
    throws InvalidTicketException, PaymentFailedException;
  
  /**
   * Calculates parking fee for a given ticket without processing payment.
   * Useful for displaying fee before payment.
   * 
   * @param ticketId unique ticket identifier
   * @return calculated parking fee
   * @throws InvalidTicketException if ticket is invalid
   */
  Money calculateParkingFee(String ticketId) throws InvalidTicketException;
  
  /**
   * Checks availability for a specific vehicle type.
   * 
   * @param vehicleType type of vehicle
   * @return true if space is available, false otherwise
   */
  boolean checkAvailability(VehicleType vehicleType);
  
  /**
   * Retrieves current occupancy statistics.
   * 
   * @return occupancy report with space utilization details
   */
  OccupancyReport getOccupancyReport();
}
