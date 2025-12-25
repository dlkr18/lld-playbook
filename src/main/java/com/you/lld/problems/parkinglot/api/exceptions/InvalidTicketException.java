package com.you.lld.problems.parkinglot.api.exceptions;

/**
 * Thrown when an invalid, expired, or non-existent ticket is presented.
 */
public class InvalidTicketException extends ParkingException {
  
  public InvalidTicketException(String ticketId) {
    super("INVALID_TICKET", "Invalid or expired ticket: " + ticketId);
  }
  
  public InvalidTicketException(String ticketId, String reason) {
    super("INVALID_TICKET", "Invalid ticket " + ticketId + ": " + reason);
  }
}
