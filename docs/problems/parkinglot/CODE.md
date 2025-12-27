# parkinglot - Complete Implementation

## 📁 Project Structure (20 files)

```
parkinglot/
├── api/ParkingService.java
├── api/PaymentProcessor.java
├── api/PricingStrategy.java
├── api/SpaceAllocationStrategy.java
├── api/exceptions/InvalidTicketException.java
├── api/exceptions/InvalidVehicleException.java
├── api/exceptions/ParkingException.java
├── api/exceptions/ParkingFullException.java
├── api/exceptions/PaymentFailedException.java
├── api/exceptions/PaymentProcessingException.java
├── api/exceptions/RefundException.java
├── model/OccupancyReport.java
├── model/ParkingSpace.java
├── model/ParkingTicket.java
├── model/Payment.java
├── model/PaymentMethod.java
├── model/PaymentStatus.java
├── model/SpaceType.java
├── model/Vehicle.java
├── model/VehicleType.java
```

## 📝 Source Code

### 📄 `api/ParkingService.java`

```java
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
```

### 📄 `api/PaymentProcessor.java`

```java
package com.you.lld.problems.parkinglot.api;

import com.you.lld.problems.parkinglot.model.Payment;
import com.you.lld.problems.parkinglot.model.PaymentMethod;
import com.you.lld.problems.parkinglot.api.exceptions.PaymentProcessingException;
import com.you.lld.problems.parkinglot.api.exceptions.RefundException;
import com.you.lld.common.Money;

/**
 * Interface for processing payments through different gateways.
 * Supports multiple payment methods and handles transaction lifecycle.
 */
public interface PaymentProcessor {
  
  /**
   * Processes a payment transaction.
   * 
   * @param payment payment details including amount and method
   * @return true if payment successful, false otherwise
   * @throws PaymentProcessingException if payment processing fails
   */
  boolean processPayment(Payment payment) throws PaymentProcessingException;
  
  /**
   * Initiates a refund for a previous payment.
   * 
   * @param payment original payment to refund
   * @return true if refund successful, false otherwise
   * @throws RefundException if refund processing fails
   */
  boolean refundPayment(Payment payment) throws RefundException;
  
  /**
   * Checks if a payment method is supported.
   * 
   * @param paymentMethod payment method to check
   * @return true if supported, false otherwise
   */
  boolean supportsPaymentMethod(PaymentMethod paymentMethod);
  
  /**
   * Gets transaction fee for a payment method and amount.
   * 
   * @param amount transaction amount
   * @param paymentMethod payment method
   * @return transaction fee
   */
  Money getTransactionFee(Money amount, PaymentMethod paymentMethod);
}
```

### 📄 `api/PricingStrategy.java`

```java
package com.you.lld.problems.parkinglot.api;

import com.you.lld.problems.parkinglot.model.ParkingTicket;
import com.you.lld.common.Money;

/**
 * Strategy interface for different pricing models.
 * Allows pluggable pricing algorithms (hourly, flat rate, dynamic, etc.).
 */
public interface PricingStrategy {
  
  /**
   * Calculates parking fee based on ticket details.
   * 
   * @param ticket parking ticket with entry/exit times and vehicle details
   * @return calculated parking fee
   * @throws IllegalArgumentException if ticket data is insufficient
   */
  Money calculateFee(ParkingTicket ticket);
  
  /**
   * Returns a description of this pricing strategy.
   * 
   * @return human-readable strategy description
   */
  String getDescription();
}
```

### 📄 `api/SpaceAllocationStrategy.java`

```java
package com.you.lld.problems.parkinglot.api;

import com.you.lld.problems.parkinglot.model.ParkingSpace;
import com.you.lld.problems.parkinglot.model.VehicleType;
import java.util.List;
import java.util.Optional;

/**
 * Strategy interface for different space allocation algorithms.
 * Allows pluggable allocation logic (nearest to entrance, by floor, etc.).
 */
public interface SpaceAllocationStrategy {
  
  /**
   * Selects the best available parking space for a vehicle type.
   * 
   * @param availableSpaces list of currently available spaces
   * @param vehicleType type of vehicle requesting parking
   * @return optimal parking space if available, empty otherwise
   */
  Optional<ParkingSpace> selectSpace(List<ParkingSpace> availableSpaces, VehicleType vehicleType);
  
  /**
   * Returns a description of this allocation strategy.
   * 
   * @return human-readable strategy description
   */
  String getDescription();
}
```

### 📄 `api/exceptions/InvalidTicketException.java`

```java
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
```

### 📄 `api/exceptions/InvalidVehicleException.java`

```java
package com.you.lld.problems.parkinglot.api.exceptions;

/**
 * Thrown when vehicle data is invalid or incomplete.
 */
public class InvalidVehicleException extends ParkingException {
  
  public InvalidVehicleException(String message) {
    super("INVALID_VEHICLE", message);
  }
  
  public InvalidVehicleException(String message, Throwable cause) {
    super("INVALID_VEHICLE", message, cause);
  }
}
```

### 📄 `api/exceptions/ParkingException.java`

```java
package com.you.lld.problems.parkinglot.api.exceptions;

/**
 * Base exception for all parking-related business logic violations.
 * Provides structured error handling with error codes.
 */
public abstract class ParkingException extends Exception {
  private final String errorCode;
  
  protected ParkingException(String errorCode, String message) {
    super(message);
    this.errorCode = errorCode;
  }
  
  protected ParkingException(String errorCode, String message, Throwable cause) {
    super(message, cause);
    this.errorCode = errorCode;
  }
  
  public String getErrorCode() {
    return errorCode;
  }
}
```

### 📄 `api/exceptions/ParkingFullException.java`

```java
package com.you.lld.problems.parkinglot.api.exceptions;

import com.you.lld.problems.parkinglot.model.VehicleType;

/**
 * Thrown when no suitable parking space is available for a vehicle.
 */
public class ParkingFullException extends ParkingException {
  
  public ParkingFullException(VehicleType vehicleType) {
    super("PARKING_FULL", "No available parking space for vehicle type: " + vehicleType);
  }
}
```

### 📄 `api/exceptions/PaymentFailedException.java`

```java
package com.you.lld.problems.parkinglot.api.exceptions;

/**
 * Thrown when payment processing fails due to insufficient funds, 
 * network issues, or other payment gateway problems.
 */
public class PaymentFailedException extends ParkingException {
  
  public PaymentFailedException(String reason) {
    super("PAYMENT_FAILED", "Payment processing failed: " + reason);
  }
  
  public PaymentFailedException(String reason, Throwable cause) {
    super("PAYMENT_FAILED", "Payment processing failed: " + reason, cause);
  }
}
```

### 📄 `api/exceptions/PaymentProcessingException.java`

```java
package com.you.lld.problems.parkinglot.api.exceptions;

/**
 * Thrown when payment processing encounters technical issues.
 */
public class PaymentProcessingException extends Exception {
  
  public PaymentProcessingException(String message) {
    super(message);
  }
  
  public PaymentProcessingException(String message, Throwable cause) {
    super(message, cause);
  }
}
```

### 📄 `api/exceptions/RefundException.java`

```java
package com.you.lld.problems.parkinglot.api.exceptions;

/**
 * Thrown when refund processing fails.
 */
public class RefundException extends Exception {
  
  public RefundException(String message) {
    super(message);
  }
  
  public RefundException(String message, Throwable cause) {
    super(message, cause);
  }
}
```

### 📄 `model/OccupancyReport.java`

```java
package com.you.lld.problems.parkinglot.model;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

/**
 * Represents current occupancy statistics for the parking lot.
 */
public final class OccupancyReport implements Serializable {
  private static final long serialVersionUID = 1L;
  
  private final LocalDateTime timestamp;
  private final int totalSpaces;
  private final int occupiedSpaces;
  private final Map<SpaceType, Integer> availableByType;
  private final Map<SpaceType, Integer> occupiedByType;
  
  public OccupancyReport(LocalDateTime timestamp, int totalSpaces, int occupiedSpaces,
                        Map<SpaceType, Integer> availableByType, Map<SpaceType, Integer> occupiedByType) {
    this.timestamp = Objects.requireNonNull(timestamp);
    this.totalSpaces = totalSpaces;
    this.occupiedSpaces = occupiedSpaces;
    this.availableByType = new HashMap<>(availableByType);
    this.occupiedByType = new HashMap<>(occupiedByType);
    
    if (totalSpaces < 0 || occupiedSpaces < 0) {
      throw new IllegalArgumentException("Space counts cannot be negative");
    }
    if (occupiedSpaces > totalSpaces) {
      throw new IllegalArgumentException("Occupied spaces cannot exceed total spaces");
    }
  }
  
  public LocalDateTime getTimestamp() { return timestamp; }
  public int getTotalSpaces() { return totalSpaces; }
  public int getOccupiedSpaces() { return occupiedSpaces; }
  public int getAvailableSpaces() { return totalSpaces - occupiedSpaces; }
  public double getOccupancyRate() { return totalSpaces > 0 ? (double) occupiedSpaces / totalSpaces : 0.0; }
  
  public Map<SpaceType, Integer> getAvailableByType() { return availableByType; }
  public Map<SpaceType, Integer> getOccupiedByType() { return occupiedByType; }
  
  public int getAvailableSpaces(SpaceType spaceType) {
    return availableByType.getOrDefault(spaceType, 0);
  }
  
  public int getOccupiedSpaces(SpaceType spaceType) {
    return occupiedByType.getOrDefault(spaceType, 0);
  }
  
  @Override
  public String toString() {
    return "OccupancyReport{" +
      "timestamp=" + timestamp +
      ", totalSpaces=" + totalSpaces +
      ", occupiedSpaces=" + occupiedSpaces +
      ", occupancyRate=" + String.format("%.1f%%", getOccupancyRate() * 100) +
      ", availableByType=" + availableByType +
      '}';
  }
}
```

### 📄 `model/ParkingSpace.java`

```java
package com.you.lld.problems.parkinglot.model;

import java.io.Serializable;
import java.util.Objects;

/**
 * Represents an individual parking space with its type, availability, and current occupant.
 */
public final class ParkingSpace implements Serializable {
  private static final long serialVersionUID = 1L;
  
  private final String spaceId;
  private final SpaceType spaceType;
  private final int floorNumber;
  private boolean isOccupied;
  private Vehicle currentVehicle;
  
  public ParkingSpace(String spaceId, SpaceType spaceType, int floorNumber) {
    this.spaceId = Objects.requireNonNull(spaceId, "Space ID cannot be null");
    this.spaceType = Objects.requireNonNull(spaceType, "Space type cannot be null");
    this.floorNumber = floorNumber;
    this.isOccupied = false;
    this.currentVehicle = null;
    
    if (spaceId.trim().isEmpty()) {
      throw new IllegalArgumentException("Space ID cannot be empty");
    }
    if (floorNumber < 0) {
      throw new IllegalArgumentException("Floor number cannot be negative");
    }
  }
  
  /**
   * Attempts to park a vehicle in this space.
   * @param vehicle the vehicle to park
   * @return true if successful, false if space is occupied or incompatible
   */
  public synchronized boolean occupy(Vehicle vehicle) {
    if (isOccupied || !canFit(vehicle.getVehicleType())) {
      return false;
    }
    
    this.isOccupied = true;
    this.currentVehicle = vehicle;
    return true;
  }
  
  /**
   * Removes the vehicle from this space.
   * @return the vehicle that was parked, or null if space was empty
   */
  public synchronized Vehicle vacate() {
    if (!isOccupied) {
      return null;
    }
    
    Vehicle vehicle = this.currentVehicle;
    this.isOccupied = false;
    this.currentVehicle = null;
    return vehicle;
  }
  
  /**
   * Checks if this space can accommodate a vehicle type.
   */
  public boolean canFit(VehicleType vehicleType) {
    // Disabled spaces require disabled permit
    if (spaceType == SpaceType.DISABLED) {
      return false; // This will be checked at a higher level with permit info
    }
    
    return spaceType.canAccommodate(vehicleType);
  }
  
  /**
   * Checks if this space can accommodate a vehicle with disabled permit consideration.
   */
  public boolean canFit(Vehicle vehicle) {
    if (spaceType == SpaceType.DISABLED) {
      return vehicle.hasDisabledPermit() && spaceType.canAccommodate(vehicle.getVehicleType());
    }
    
    return spaceType.canAccommodate(vehicle.getVehicleType());
  }
  
  public String getSpaceId() { return spaceId; }
  public SpaceType getSpaceType() { return spaceType; }
  public int getFloorNumber() { return floorNumber; }
  public boolean isOccupied() { return isOccupied; }
  public boolean isAvailable() { return !isOccupied; }
  public Vehicle getCurrentVehicle() { return currentVehicle; }
  
  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (!(o instanceof ParkingSpace)) return false;
    ParkingSpace that = (ParkingSpace) o;
    return spaceId.equals(that.spaceId);
  }
  
  @Override
  public int hashCode() {
    return Objects.hash(spaceId);
  }
  
  @Override
  public String toString() {
    return "ParkingSpace{" +
      "spaceId='" + spaceId + '\'' +
      ", spaceType=" + spaceType +
      ", floorNumber=" + floorNumber +
      ", isOccupied=" + isOccupied +
      '}';
  }
}
```

### 📄 `model/ParkingTicket.java`

```java
package com.you.lld.problems.parkinglot.model;

import java.io.Serializable;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Objects;

/**
 * Represents a parking ticket issued when a vehicle enters the parking lot.
 */
public final class ParkingTicket implements Serializable {
  private static final long serialVersionUID = 1L;
  
  private final String ticketId;
  private final Vehicle vehicle;
  private final ParkingSpace parkingSpace;
  private final LocalDateTime entryTime;
  private LocalDateTime exitTime;
  private boolean isActive;
  
  public ParkingTicket(String ticketId, Vehicle vehicle, ParkingSpace parkingSpace, LocalDateTime entryTime) {
    this.ticketId = Objects.requireNonNull(ticketId, "Ticket ID cannot be null");
    this.vehicle = Objects.requireNonNull(vehicle, "Vehicle cannot be null");
    this.parkingSpace = Objects.requireNonNull(parkingSpace, "Parking space cannot be null");
    this.entryTime = Objects.requireNonNull(entryTime, "Entry time cannot be null");
    this.exitTime = null;
    this.isActive = true;
    
    if (ticketId.trim().isEmpty()) {
      throw new IllegalArgumentException("Ticket ID cannot be empty");
    }
  }
  
  /**
   * Marks the ticket as exited with the given exit time.
   */
  public void markExit(LocalDateTime exitTime) {
    if (!isActive) {
      throw new IllegalStateException("Ticket is already inactive");
    }
    if (exitTime.isBefore(entryTime)) {
      throw new IllegalArgumentException("Exit time cannot be before entry time");
    }
    
    this.exitTime = exitTime;
    this.isActive = false;
  }
  
  /**
   * Calculates the duration of parking.
   * If not yet exited, calculates duration up to now.
   */
  public Duration calculateDuration() {
    LocalDateTime endTime = exitTime != null ? exitTime : LocalDateTime.now();
    return Duration.between(entryTime, endTime);
  }
  
  /**
   * Checks if this ticket is valid for exit processing.
   */
  public boolean isValid() {
    return isActive && exitTime == null;
  }
  
  public String getTicketId() { return ticketId; }
  public Vehicle getVehicle() { return vehicle; }
  public ParkingSpace getParkingSpace() { return parkingSpace; }
  public LocalDateTime getEntryTime() { return entryTime; }
  public LocalDateTime getExitTime() { return exitTime; }
  public boolean isActive() { return isActive; }
  
  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (!(o instanceof ParkingTicket)) return false;
    ParkingTicket that = (ParkingTicket) o;
    return ticketId.equals(that.ticketId);
  }
  
  @Override
  public int hashCode() {
    return Objects.hash(ticketId);
  }
  
  @Override
  public String toString() {
    return "ParkingTicket{" +
      "ticketId='" + ticketId + '\'' +
      ", vehicle=" + vehicle +
      ", spaceId='" + parkingSpace.getSpaceId() + '\'' +
      ", entryTime=" + entryTime +
      ", exitTime=" + exitTime +
      ", isActive=" + isActive +
      '}';
  }
}
```

### 📄 `model/Payment.java`

```java
package com.you.lld.problems.parkinglot.model;

import com.you.lld.common.Money;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Objects;

/**
 * Represents a payment transaction for parking fees.
 */
public final class Payment implements Serializable {
  private static final long serialVersionUID = 1L;
  
  private final String paymentId;
  private final ParkingTicket ticket;
  private final Money amount;
  private final PaymentMethod paymentMethod;
  private PaymentStatus status;
  private final LocalDateTime timestamp;
  private String transactionReference;
  
  public Payment(String paymentId, ParkingTicket ticket, Money amount, PaymentMethod paymentMethod) {
    this.paymentId = Objects.requireNonNull(paymentId, "Payment ID cannot be null");
    this.ticket = Objects.requireNonNull(ticket, "Parking ticket cannot be null");
    this.amount = Objects.requireNonNull(amount, "Amount cannot be null");
    this.paymentMethod = Objects.requireNonNull(paymentMethod, "Payment method cannot be null");
    this.status = PaymentStatus.PENDING;
    this.timestamp = LocalDateTime.now();
    
    if (paymentId.trim().isEmpty()) {
      throw new IllegalArgumentException("Payment ID cannot be empty");
    }
    if (amount.isNegative()) {
      throw new IllegalArgumentException("Payment amount cannot be negative");
    }
  }
  
  /**
   * Marks this payment as successfully processed.
   */
  public void markCompleted(String transactionReference) {
    if (status.isTerminal()) {
      throw new IllegalStateException("Payment is already in terminal state: " + status);
    }
    
    this.status = PaymentStatus.COMPLETED;
    this.transactionReference = transactionReference;
  }
  
  /**
   * Marks this payment as failed.
   */
  public void markFailed() {
    if (status.isTerminal()) {
      throw new IllegalStateException("Payment is already in terminal state: " + status);
    }
    
    this.status = PaymentStatus.FAILED;
  }
  
  /**
   * Marks this payment as refunded.
   */
  public void markRefunded(String refundReference) {
    if (status != PaymentStatus.COMPLETED) {
      throw new IllegalStateException("Can only refund completed payments");
    }
    
    this.status = PaymentStatus.REFUNDED;
    this.transactionReference = refundReference;
  }
  
  public String getPaymentId() { return paymentId; }
  public ParkingTicket getTicket() { return ticket; }
  public Money getAmount() { return amount; }
  public PaymentMethod getPaymentMethod() { return paymentMethod; }
  public PaymentStatus getStatus() { return status; }
  public LocalDateTime getTimestamp() { return timestamp; }
  public String getTransactionReference() { return transactionReference; }
  
  public boolean isSuccessful() { return status == PaymentStatus.COMPLETED; }
  
  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (!(o instanceof Payment)) return false;
    Payment payment = (Payment) o;
    return paymentId.equals(payment.paymentId);
  }
  
  @Override
  public int hashCode() {
    return Objects.hash(paymentId);
  }
  
  @Override
  public String toString() {
    return "Payment{" +
      "paymentId='" + paymentId + '\'' +
      ", ticketId='" + ticket.getTicketId() + '\'' +
      ", amount=" + amount +
      ", paymentMethod=" + paymentMethod +
      ", status=" + status +
      ", timestamp=" + timestamp +
      '}';
  }
}
```

### 📄 `model/PaymentMethod.java`

```java
package com.you.lld.problems.parkinglot.model;

/**
 * Enumeration of supported payment methods.
 */
public enum PaymentMethod {
  CASH("Cash Payment"),
  CREDIT_CARD("Credit Card"),
  DEBIT_CARD("Debit Card"),
  MOBILE_PAYMENT("Mobile Payment (UPI/Wallet)");
  
  private final String displayName;
  
  PaymentMethod(String displayName) {
    this.displayName = displayName;
  }
  
  public String getDisplayName() {
    return displayName;
  }
}
```

### 📄 `model/PaymentStatus.java`

```java
package com.you.lld.problems.parkinglot.model;

/**
 * Enumeration of payment transaction states.
 */
public enum PaymentStatus {
  PENDING("Payment initiated, awaiting confirmation"),
  COMPLETED("Payment successfully processed"),
  FAILED("Payment processing failed"),
  REFUNDED("Payment has been refunded"),
  CANCELLED("Payment cancelled by user");
  
  private final String description;
  
  PaymentStatus(String description) {
    this.description = description;
  }
  
  public String getDescription() {
    return description;
  }
  
  public boolean isTerminal() {
    return this == COMPLETED || this == FAILED || this == REFUNDED || this == CANCELLED;
  }
}
```

### 📄 `model/SpaceType.java`

```java
package com.you.lld.problems.parkinglot.model;

/**
 * Enumeration of parking space types with their capacity and vehicle compatibility.
 */
public enum SpaceType {
  MOTORCYCLE(1, "Motorcycle spaces"),
  COMPACT(2, "Compact car spaces"),
  LARGE(4, "Large vehicle spaces"),
  DISABLED(2, "Disabled-accessible spaces");
  
  private final int capacity;
  private final String description;
  
  SpaceType(int capacity, String description) {
    this.capacity = capacity;
    this.description = description;
  }
  
  /**
   * Returns the capacity rating for this space type.
   * Used to determine vehicle compatibility.
   */
  public int getCapacity() {
    return capacity;
  }
  
  /**
   * Returns human-readable description of this space type.
   */
  public String getDescription() {
    return description;
  }
  
  /**
   * Checks if this space type can accommodate a vehicle type.
   */
  public boolean canAccommodate(VehicleType vehicleType) {
    return this.capacity >= vehicleType.getSizeCategory();
  }
}
```

### 📄 `model/Vehicle.java`

```java
package com.you.lld.problems.parkinglot.model;

import java.io.Serializable;
import java.util.Objects;

/**
 * Represents a vehicle with its identifying information and parking requirements.
 */
public final class Vehicle implements Serializable {
  private static final long serialVersionUID = 1L;
  
  private final String licenseNumber;
  private final VehicleType vehicleType;
  private final boolean hasDisabledPermit;
  
  public Vehicle(String licenseNumber, VehicleType vehicleType, boolean hasDisabledPermit) {
    this.licenseNumber = Objects.requireNonNull(licenseNumber, "License number cannot be null");
    this.vehicleType = Objects.requireNonNull(vehicleType, "Vehicle type cannot be null");
    this.hasDisabledPermit = hasDisabledPermit;
    
    if (licenseNumber.trim().isEmpty()) {
      throw new IllegalArgumentException("License number cannot be empty");
    }
  }
  
  public Vehicle(String licenseNumber, VehicleType vehicleType) {
    this(licenseNumber, vehicleType, false);
  }
  
  public String getLicenseNumber() { return licenseNumber; }
  public VehicleType getVehicleType() { return vehicleType; }
  public boolean hasDisabledPermit() { return hasDisabledPermit; }
  
  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (!(o instanceof Vehicle)) return false;
    Vehicle vehicle = (Vehicle) o;
    return licenseNumber.equals(vehicle.licenseNumber);
  }
  
  @Override
  public int hashCode() {
    return Objects.hash(licenseNumber);
  }
  
  @Override
  public String toString() {
    return "Vehicle{" +
      "licenseNumber='" + licenseNumber + '\'' +
      ", vehicleType=" + vehicleType +
      ", hasDisabledPermit=" + hasDisabledPermit +
      '}';
  }
}
```

### 📄 `model/VehicleType.java`

```java
package com.you.lld.problems.parkinglot.model;

/**
 * Enumeration of supported vehicle types with their space requirements.
 */
public enum VehicleType {
  MOTORCYCLE(1),
  CAR(2), 
  TRUCK(3),
  BUS(4);
  
  private final int sizeCategory;
  
  VehicleType(int sizeCategory) {
    this.sizeCategory = sizeCategory;
  }
  
  /**
   * Returns the size category for space allocation logic.
   * Higher numbers require larger spaces.
   */
  public int getSizeCategory() {
    return sizeCategory;
  }
}
```

