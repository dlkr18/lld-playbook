# parkinglot - Complete Implementation

## 📁 Project Structure (25 files)

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
├── impl/HourlyPricingStrategy.java
├── impl/InMemoryParkingService.java
├── impl/NearestSpaceAllocationStrategy.java
├── impl/ParkingLotDemo.java
├── impl/SimplePaymentProcessor.java
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

<details>
<summary>📄 Click to view api/ParkingService.java</summary>

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

</details>

### 📄 `api/PaymentProcessor.java`

<details>
<summary>📄 Click to view api/PaymentProcessor.java</summary>

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

</details>

### 📄 `api/PricingStrategy.java`

<details>
<summary>📄 Click to view api/PricingStrategy.java</summary>

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

</details>

### 📄 `api/SpaceAllocationStrategy.java`

<details>
<summary>📄 Click to view api/SpaceAllocationStrategy.java</summary>

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

</details>

### 📄 `api/exceptions/InvalidTicketException.java`

<details>
<summary>📄 Click to view api/exceptions/InvalidTicketException.java</summary>

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

</details>

### 📄 `api/exceptions/InvalidVehicleException.java`

<details>
<summary>📄 Click to view api/exceptions/InvalidVehicleException.java</summary>

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

</details>

### 📄 `api/exceptions/ParkingException.java`

<details>
<summary>📄 Click to view api/exceptions/ParkingException.java</summary>

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

</details>

### 📄 `api/exceptions/ParkingFullException.java`

<details>
<summary>📄 Click to view api/exceptions/ParkingFullException.java</summary>

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

</details>

### 📄 `api/exceptions/PaymentFailedException.java`

<details>
<summary>📄 Click to view api/exceptions/PaymentFailedException.java</summary>

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

</details>

### 📄 `api/exceptions/PaymentProcessingException.java`

<details>
<summary>📄 Click to view api/exceptions/PaymentProcessingException.java</summary>

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

</details>

### 📄 `api/exceptions/RefundException.java`

<details>
<summary>📄 Click to view api/exceptions/RefundException.java</summary>

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

</details>

### 📄 `impl/HourlyPricingStrategy.java`

<details>
<summary>📄 Click to view impl/HourlyPricingStrategy.java</summary>

```java
package com.you.lld.problems.parkinglot.impl;

import com.you.lld.common.Money;
import com.you.lld.problems.parkinglot.api.PricingStrategy;
import com.you.lld.problems.parkinglot.model.ParkingTicket;
import com.you.lld.problems.parkinglot.model.VehicleType;

import java.math.BigDecimal;
import java.time.Duration;
import java.util.Currency;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

/**
 * Hourly pricing strategy with different rates per vehicle type.
 * Implements time-based pricing with minimum charge and hourly increments.
 */
public class HourlyPricingStrategy implements PricingStrategy {
  
  private final Map<VehicleType, Money> hourlyRates;
  private final Money minimumCharge;
  private final Duration gracePeriod;
  private final Currency currency;
  
  /**
   * Creates a pricing strategy with default rates in USD.
   */
  public HourlyPricingStrategy() {
    this(Currency.getInstance("USD"));
  }
  
  /**
   * Creates a pricing strategy with default rates in specified currency.
   */
  public HourlyPricingStrategy(Currency currency) {
    this.currency = Objects.requireNonNull(currency, "Currency cannot be null");
    this.hourlyRates = new HashMap<>();
    this.hourlyRates.put(VehicleType.MOTORCYCLE, Money.of(new BigDecimal("10.00"), currency));
    this.hourlyRates.put(VehicleType.CAR, Money.of(new BigDecimal("20.00"), currency));
    this.hourlyRates.put(VehicleType.TRUCK, Money.of(new BigDecimal("40.00"), currency));
    this.hourlyRates.put(VehicleType.BUS, Money.of(new BigDecimal("50.00"), currency));
    this.minimumCharge = Money.of(new BigDecimal("5.00"), currency);
    this.gracePeriod = Duration.ofMinutes(15);
  }
  
  /**
   * Creates a pricing strategy with custom rates.
   */
  public HourlyPricingStrategy(Map<VehicleType, Money> hourlyRates, Money minimumCharge, Duration gracePeriod, Currency currency) {
    this.currency = Objects.requireNonNull(currency, "Currency cannot be null");
    this.hourlyRates = new HashMap<>(Objects.requireNonNull(hourlyRates, "Hourly rates cannot be null"));
    this.minimumCharge = Objects.requireNonNull(minimumCharge, "Minimum charge cannot be null");
    this.gracePeriod = Objects.requireNonNull(gracePeriod, "Grace period cannot be null");
    
    // Validate that all vehicle types have rates
    for (VehicleType type : VehicleType.values()) {
      if (!this.hourlyRates.containsKey(type)) {
        throw new IllegalArgumentException("Missing hourly rate for vehicle type: " + type);
      }
    }
  }
  
  @Override
  public Money calculateFee(ParkingTicket ticket) {
    Objects.requireNonNull(ticket, "Parking ticket cannot be null");
    
    Duration parkingDuration = ticket.calculateDuration();
    
    // Apply grace period - free if within grace period
    if (parkingDuration.compareTo(gracePeriod) <= 0) {
      return Money.ofMinor(0, currency);
    }
    
    VehicleType vehicleType = ticket.getVehicle().getVehicleType();
    Money hourlyRate = hourlyRates.get(vehicleType);
    
    if (hourlyRate == null) {
      throw new IllegalArgumentException("No hourly rate configured for vehicle type: " + vehicleType);
    }
    
    // Calculate hours (round up partial hours)
    long minutes = parkingDuration.toMinutes();
    long hours = (minutes + 59) / 60; // Round up to next hour
    
    // Calculate total fee
    Money totalFee = hourlyRate.times(hours);
    
    // Apply minimum charge
    if (totalFee.compareTo(minimumCharge) < 0) {
      return minimumCharge;
    }
    
    return totalFee;
  }
  
  @Override
  public String getDescription() {
    return "Hourly pricing strategy with grace period of " + gracePeriod.toMinutes() + " minutes";
  }
  
  /**
   * Gets the hourly rate for a specific vehicle type.
   */
  public Money getHourlyRate(VehicleType vehicleType) {
    return hourlyRates.get(vehicleType);
  }
  
  /**
   * Gets the minimum charge applied.
   */
  public Money getMinimumCharge() {
    return minimumCharge;
  }
  
  /**
   * Gets the grace period duration.
   */
  public Duration getGracePeriod() {
    return gracePeriod;
  }
}

```

</details>

### 📄 `impl/InMemoryParkingService.java`

<details>
<summary>📄 Click to view impl/InMemoryParkingService.java</summary>

```java
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

```

</details>

### 📄 `impl/NearestSpaceAllocationStrategy.java`

<details>
<summary>📄 Click to view impl/NearestSpaceAllocationStrategy.java</summary>

```java
package com.you.lld.problems.parkinglot.impl;

import com.you.lld.problems.parkinglot.api.SpaceAllocationStrategy;
import com.you.lld.problems.parkinglot.model.ParkingSpace;
import com.you.lld.problems.parkinglot.model.SpaceType;
import com.you.lld.problems.parkinglot.model.VehicleType;

import java.util.*;

/**
 * Space allocation strategy that selects the nearest available space.
 * Prioritizes lower floor numbers and optimal space type for the vehicle.
 */
public class NearestSpaceAllocationStrategy implements SpaceAllocationStrategy {
  
  private static final Map<VehicleType, List<SpaceType>> SPACE_PRIORITY;
  
  static {
    SPACE_PRIORITY = new HashMap<>();
    
    // Motorcycles prefer motorcycle spaces, then compact, then large
    SPACE_PRIORITY.put(VehicleType.MOTORCYCLE, Arrays.asList(
        SpaceType.MOTORCYCLE, SpaceType.COMPACT, SpaceType.LARGE
    ));
    
    // Cars prefer compact spaces, then large
    SPACE_PRIORITY.put(VehicleType.CAR, Arrays.asList(
        SpaceType.COMPACT, SpaceType.LARGE
    ));
    
    // Trucks and buses need large spaces only
    SPACE_PRIORITY.put(VehicleType.TRUCK, Collections.singletonList(SpaceType.LARGE));
    SPACE_PRIORITY.put(VehicleType.BUS, Collections.singletonList(SpaceType.LARGE));
  }
  
  @Override
  public Optional<ParkingSpace> selectSpace(List<ParkingSpace> availableSpaces, VehicleType vehicleType) {
    if (availableSpaces == null || availableSpaces.isEmpty()) {
      return Optional.empty();
    }
    
    if (vehicleType == null) {
      return Optional.empty();
    }
    
    List<SpaceType> preferredTypes = SPACE_PRIORITY.get(vehicleType);
    if (preferredTypes == null) {
      return Optional.empty();
    }
    
    // Try to find space in order of preference
    for (SpaceType preferredType : preferredTypes) {
      Optional<ParkingSpace> space = findNearestSpaceOfType(availableSpaces, preferredType);
      if (space.isPresent()) {
        return space;
      }
    }
    
    // Fallback: return any available space that can fit the vehicle
    return availableSpaces.stream()
        .filter(space -> space.canFit(vehicleType))
        .min(Comparator.comparingInt(ParkingSpace::getFloorNumber)
            .thenComparing(ParkingSpace::getSpaceId));
  }
  
  /**
   * Finds the nearest (lowest floor) space of a specific type.
   */
  private Optional<ParkingSpace> findNearestSpaceOfType(List<ParkingSpace> spaces, SpaceType spaceType) {
    return spaces.stream()
        .filter(space -> space.getSpaceType() == spaceType)
        .min(Comparator.comparingInt(ParkingSpace::getFloorNumber)
            .thenComparing(ParkingSpace::getSpaceId));
  }
  
  @Override
  public String getDescription() {
    return "Nearest space allocation strategy - prioritizes lower floors and optimal space types";
  }
}

```

</details>

### 📄 `impl/ParkingLotDemo.java`

<details>
<summary>📄 Click to view impl/ParkingLotDemo.java</summary>

```java
package com.you.lld.problems.parkinglot.impl;

import com.you.lld.common.Money;
import com.you.lld.problems.parkinglot.api.ParkingService;
import com.you.lld.problems.parkinglot.api.exceptions.*;
import com.you.lld.problems.parkinglot.model.*;

import java.util.ArrayList;
import java.util.List;

/**
 * Demonstration of the parking lot system with complete implementation.
 * Shows vehicle entry, parking, payment, and exit flow.
 */
public class ParkingLotDemo {
  
  public static void main(String[] args) {
    System.out.println("=== Parking Lot System Demo ===\n");
    
    // Step 1: Initialize parking lot with spaces
    System.out.println("1. Initializing parking lot...");
    List<ParkingSpace> parkingSpaces = createParkingSpaces();
    System.out.println("   Created " + parkingSpaces.size() + " parking spaces across 3 floors\n");
    
    // Step 2: Create parking service with strategies
    System.out.println("2. Setting up parking service with strategies...");
    HourlyPricingStrategy pricingStrategy = new HourlyPricingStrategy();
    NearestSpaceAllocationStrategy allocationStrategy = new NearestSpaceAllocationStrategy();
    SimplePaymentProcessor paymentProcessor = new SimplePaymentProcessor();
    
    ParkingService parkingService = new InMemoryParkingService(
        parkingSpaces, 
        pricingStrategy, 
        allocationStrategy, 
        paymentProcessor
    );
    System.out.println("   Service initialized with:");
    System.out.println("   - " + pricingStrategy.getDescription());
    System.out.println("   - " + allocationStrategy.getDescription() + "\n");
    
    // Step 3: Check initial occupancy
    System.out.println("3. Initial Occupancy Report:");
    displayOccupancyReport(parkingService.getOccupancyReport());
    
    // Step 4: Park some vehicles
    System.out.println("\n4. Parking vehicles...");
    
    try {
      // Park a motorcycle
      Vehicle motorcycle = new Vehicle("MH-01-1234", VehicleType.MOTORCYCLE);
      ParkingTicket ticket1 = parkingService.enterVehicle(motorcycle);
      System.out.println("   ✓ Motorcycle parked: " + ticket1.getTicketId() + 
          " at space " + ticket1.getParkingSpace().getSpaceId());
      
      // Park a car
      Vehicle car = new Vehicle("MH-02-5678", VehicleType.CAR);
      ParkingTicket ticket2 = parkingService.enterVehicle(car);
      System.out.println("   ✓ Car parked: " + ticket2.getTicketId() + 
          " at space " + ticket2.getParkingSpace().getSpaceId());
      
      // Park a car with disabled permit
      Vehicle disabledCar = new Vehicle("MH-03-9999", VehicleType.CAR, true);
      ParkingTicket ticket3 = parkingService.enterVehicle(disabledCar);
      System.out.println("   ✓ Car with disabled permit parked: " + ticket3.getTicketId() + 
          " at space " + ticket3.getParkingSpace().getSpaceId());
      
      // Park a truck
      Vehicle truck = new Vehicle("MH-04-7777", VehicleType.TRUCK);
      ParkingTicket ticket4 = parkingService.enterVehicle(truck);
      System.out.println("   ✓ Truck parked: " + ticket4.getTicketId() + 
          " at space " + ticket4.getParkingSpace().getSpaceId());
      
      // Step 5: Check updated occupancy
      System.out.println("\n5. Updated Occupancy Report:");
      displayOccupancyReport(parkingService.getOccupancyReport());
      
      // Step 6: Simulate some time passing (in real scenario)
      System.out.println("\n6. Simulating parking duration...");
      Thread.sleep(1000); // Simulate 1 second (in real scenario, this would be hours)
      System.out.println("   Vehicles have been parked for some time\n");
      
      // Step 7: Calculate fees
      System.out.println("7. Calculating parking fees:");
      Money fee1 = parkingService.calculateParkingFee(ticket1.getTicketId());
      System.out.println("   Motorcycle (" + ticket1.getTicketId() + "): " + fee1);
      
      Money fee2 = parkingService.calculateParkingFee(ticket2.getTicketId());
      System.out.println("   Car (" + ticket2.getTicketId() + "): " + fee2);
      
      Money fee4 = parkingService.calculateParkingFee(ticket4.getTicketId());
      System.out.println("   Truck (" + ticket4.getTicketId() + "): " + fee4);
      
      // Step 8: Process exits
      System.out.println("\n8. Processing vehicle exits:");
      
      // Exit motorcycle with credit card payment
      Payment payment1 = parkingService.exitVehicle(ticket1.getTicketId(), PaymentMethod.CREDIT_CARD);
      System.out.println("   ✓ Motorcycle exited:");
      System.out.println("     Payment ID: " + payment1.getPaymentId());
      System.out.println("     Amount: " + payment1.getAmount());
      System.out.println("     Method: " + payment1.getPaymentMethod().getDisplayName());
      System.out.println("     Status: " + payment1.getStatus());
      
      // Exit car with cash payment
      Payment payment2 = parkingService.exitVehicle(ticket2.getTicketId(), PaymentMethod.CASH);
      System.out.println("   ✓ Car exited:");
      System.out.println("     Payment ID: " + payment2.getPaymentId());
      System.out.println("     Amount: " + payment2.getAmount());
      System.out.println("     Method: " + payment2.getPaymentMethod().getDisplayName());
      System.out.println("     Status: " + payment2.getStatus());
      
      // Step 9: Final occupancy
      System.out.println("\n9. Final Occupancy Report:");
      displayOccupancyReport(parkingService.getOccupancyReport());
      
      // Step 10: Demonstrate error handling
      System.out.println("\n10. Demonstrating error handling:");
      
      try {
        // Try to park already parked vehicle
        parkingService.enterVehicle(disabledCar);
      } catch (InvalidVehicleException e) {
        System.out.println("   ✓ Caught expected error: " + e.getMessage());
      }
      
      try {
        // Try to exit with invalid ticket
        parkingService.exitVehicle("INVALID-TICKET", PaymentMethod.CASH);
      } catch (InvalidTicketException e) {
        System.out.println("   ✓ Caught expected error: " + e.getMessage());
      }
      
      try {
        // Try to calculate fee for exited vehicle
        parkingService.calculateParkingFee(ticket1.getTicketId());
      } catch (InvalidTicketException e) {
        System.out.println("   ✓ Caught expected error: " + e.getMessage());
      }
      
      System.out.println("\n=== Demo completed successfully! ===");
      
    } catch (ParkingException | InterruptedException e) {
      System.err.println("Error during demo: " + e.getMessage());
      e.printStackTrace();
    }
  }
  
  /**
   * Creates a sample parking lot with multiple floors and space types.
   */
  private static List<ParkingSpace> createParkingSpaces() {
    List<ParkingSpace> spaces = new ArrayList<>();
    
    // Floor 0 (Ground floor) - 10 spaces
    for (int i = 1; i <= 3; i++) {
      spaces.add(new ParkingSpace("F0-MC-" + i, SpaceType.MOTORCYCLE, 0));
    }
    for (int i = 1; i <= 4; i++) {
      spaces.add(new ParkingSpace("F0-C-" + i, SpaceType.COMPACT, 0));
    }
    for (int i = 1; i <= 2; i++) {
      spaces.add(new ParkingSpace("F0-L-" + i, SpaceType.LARGE, 0));
    }
    spaces.add(new ParkingSpace("F0-D-1", SpaceType.DISABLED, 0));
    
    // Floor 1 - 10 spaces
    for (int i = 1; i <= 2; i++) {
      spaces.add(new ParkingSpace("F1-MC-" + i, SpaceType.MOTORCYCLE, 1));
    }
    for (int i = 1; i <= 5; i++) {
      spaces.add(new ParkingSpace("F1-C-" + i, SpaceType.COMPACT, 1));
    }
    for (int i = 1; i <= 2; i++) {
      spaces.add(new ParkingSpace("F1-L-" + i, SpaceType.LARGE, 1));
    }
    spaces.add(new ParkingSpace("F1-D-1", SpaceType.DISABLED, 1));
    
    // Floor 2 - 10 spaces
    for (int i = 1; i <= 2; i++) {
      spaces.add(new ParkingSpace("F2-MC-" + i, SpaceType.MOTORCYCLE, 2));
    }
    for (int i = 1; i <= 4; i++) {
      spaces.add(new ParkingSpace("F2-C-" + i, SpaceType.COMPACT, 2));
    }
    for (int i = 1; i <= 3; i++) {
      spaces.add(new ParkingSpace("F2-L-" + i, SpaceType.LARGE, 2));
    }
    spaces.add(new ParkingSpace("F2-D-1", SpaceType.DISABLED, 2));
    
    return spaces;
  }
  
  /**
   * Displays occupancy report in a readable format.
   */
  private static void displayOccupancyReport(OccupancyReport report) {
    System.out.println("   Timestamp: " + report.getTimestamp());
    System.out.println("   Total Spaces: " + report.getTotalSpaces());
    System.out.println("   Occupied: " + report.getOccupiedSpaces());
    System.out.println("   Available: " + report.getAvailableSpaces());
    System.out.println("   Occupancy Rate: " + String.format("%.1f%%", report.getOccupancyRate() * 100));
    System.out.println("   By Space Type:");
    
    for (SpaceType type : SpaceType.values()) {
      int available = report.getAvailableSpaces(type);
      int occupied = report.getOccupiedSpaces(type);
      System.out.println("     " + type + ": " + available + " available, " + occupied + " occupied");
    }
  }
}

```

</details>

### 📄 `impl/SimplePaymentProcessor.java`

<details>
<summary>📄 Click to view impl/SimplePaymentProcessor.java</summary>

```java
package com.you.lld.problems.parkinglot.impl;

import com.you.lld.common.Money;
import com.you.lld.problems.parkinglot.api.PaymentProcessor;
import com.you.lld.problems.parkinglot.api.exceptions.PaymentProcessingException;
import com.you.lld.problems.parkinglot.api.exceptions.RefundException;
import com.you.lld.problems.parkinglot.model.Payment;
import com.you.lld.problems.parkinglot.model.PaymentMethod;

import java.math.BigDecimal;
import java.util.*;

/**
 * Simple in-memory payment processor implementation.
 * In production, this would integrate with actual payment gateways.
 */
public class SimplePaymentProcessor implements PaymentProcessor {
  
  private final Set<PaymentMethod> supportedMethods;
  private final Map<PaymentMethod, BigDecimal> transactionFeeRates;
  private final Map<String, Payment> processedPayments;
  
  public SimplePaymentProcessor() {
    this.supportedMethods = EnumSet.allOf(PaymentMethod.class);
    this.transactionFeeRates = new HashMap<>();
    
    // Default transaction fee rates
    this.transactionFeeRates.put(PaymentMethod.CASH, BigDecimal.ZERO);
    this.transactionFeeRates.put(PaymentMethod.CREDIT_CARD, new BigDecimal("0.025")); // 2.5%
    this.transactionFeeRates.put(PaymentMethod.DEBIT_CARD, new BigDecimal("0.015")); // 1.5%
    this.transactionFeeRates.put(PaymentMethod.MOBILE_PAYMENT, new BigDecimal("0.02")); // 2%
    
    this.processedPayments = new HashMap<>();
  }
  
  /**
   * Creates a payment processor with custom supported methods and fee rates.
   */
  public SimplePaymentProcessor(Set<PaymentMethod> supportedMethods, 
                                Map<PaymentMethod, BigDecimal> transactionFeeRates) {
    this.supportedMethods = EnumSet.copyOf(Objects.requireNonNull(supportedMethods));
    this.transactionFeeRates = new HashMap<>(Objects.requireNonNull(transactionFeeRates));
    this.processedPayments = new HashMap<>();
    
    if (supportedMethods.isEmpty()) {
      throw new IllegalArgumentException("At least one payment method must be supported");
    }
  }
  
  @Override
  public boolean processPayment(Payment payment) throws PaymentProcessingException {
    Objects.requireNonNull(payment, "Payment cannot be null");
    
    // Validate payment method is supported
    if (!supportsPaymentMethod(payment.getPaymentMethod())) {
      throw new PaymentProcessingException(
          "Payment method not supported: " + payment.getPaymentMethod()
      );
    }
    
    // Validate payment amount
    if (payment.getAmount() == null || payment.getAmount().isNegative()) {
      throw new PaymentProcessingException("Invalid payment amount");
    }
    
    // Simulate payment processing
    try {
      // In a real system, this would:
      // 1. Connect to payment gateway
      // 2. Process the transaction
      // 3. Handle authentication (3DS, OTP, etc.)
      // 4. Verify funds availability
      // 5. Complete the transaction
      
      // For simulation, we'll add a small delay
      Thread.sleep(100); // Simulate network call
      
      // Store successful payment
      processedPayments.put(payment.getPaymentId(), payment);
      
      return true;
      
    } catch (InterruptedException e) {
      Thread.currentThread().interrupt();
      throw new PaymentProcessingException("Payment processing interrupted", e);
    } catch (Exception e) {
      throw new PaymentProcessingException("Payment processing failed: " + e.getMessage(), e);
    }
  }
  
  @Override
  public boolean refundPayment(Payment payment) throws RefundException {
    Objects.requireNonNull(payment, "Payment cannot be null");
    
    // Verify payment was processed by this processor
    if (!processedPayments.containsKey(payment.getPaymentId())) {
      throw new RefundException("Payment not found in system: " + payment.getPaymentId());
    }
    
    // Verify payment is in completed state
    if (!payment.isSuccessful()) {
      throw new RefundException("Can only refund completed payments");
    }
    
    try {
      // In a real system, this would:
      // 1. Connect to payment gateway
      // 2. Initiate refund transaction
      // 3. Verify refund eligibility
      // 4. Process the refund
      // 5. Update transaction status
      
      // For simulation, we'll add a small delay
      Thread.sleep(100);
      
      return true;
      
    } catch (InterruptedException e) {
      Thread.currentThread().interrupt();
      throw new RefundException("Refund processing interrupted", e);
    } catch (Exception e) {
      throw new RefundException("Refund processing failed: " + e.getMessage(), e);
    }
  }
  
  @Override
  public boolean supportsPaymentMethod(PaymentMethod paymentMethod) {
    return paymentMethod != null && supportedMethods.contains(paymentMethod);
  }
  
  @Override
  public Money getTransactionFee(Money amount, PaymentMethod paymentMethod) {
    Objects.requireNonNull(amount, "Amount cannot be null");
    Objects.requireNonNull(paymentMethod, "Payment method cannot be null");
    
    if (!supportsPaymentMethod(paymentMethod)) {
      return Money.ofMinor(0, amount.currency());
    }
    
    BigDecimal feeRate = transactionFeeRates.getOrDefault(paymentMethod, BigDecimal.ZERO);
    // Convert percentage to basis points (e.g., 0.025 = 2.5% = 250 basis points)
    int basisPoints = feeRate.multiply(new BigDecimal("10000")).intValue();
    return amount.percent(basisPoints);
  }
  
  /**
   * Gets all supported payment methods.
   */
  public Set<PaymentMethod> getSupportedMethods() {
    return EnumSet.copyOf(supportedMethods);
  }
  
  /**
   * Gets the transaction fee rate for a payment method.
   */
  public BigDecimal getTransactionFeeRate(PaymentMethod paymentMethod) {
    return transactionFeeRates.getOrDefault(paymentMethod, BigDecimal.ZERO);
  }
  
  /**
   * Gets count of successfully processed payments.
   */
  public int getProcessedPaymentCount() {
    return processedPayments.size();
  }
}

```

</details>

### 📄 `model/OccupancyReport.java`

<details>
<summary>📄 Click to view model/OccupancyReport.java</summary>

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

</details>

### 📄 `model/ParkingSpace.java`

<details>
<summary>📄 Click to view model/ParkingSpace.java</summary>

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

</details>

### 📄 `model/ParkingTicket.java`

<details>
<summary>📄 Click to view model/ParkingTicket.java</summary>

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

</details>

### 📄 `model/Payment.java`

<details>
<summary>📄 Click to view model/Payment.java</summary>

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

</details>

### 📄 `model/PaymentMethod.java`

<details>
<summary>📄 Click to view model/PaymentMethod.java</summary>

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

</details>

### 📄 `model/PaymentStatus.java`

<details>
<summary>📄 Click to view model/PaymentStatus.java</summary>

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

</details>

### 📄 `model/SpaceType.java`

<details>
<summary>📄 Click to view model/SpaceType.java</summary>

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

</details>

### 📄 `model/Vehicle.java`

<details>
<summary>📄 Click to view model/Vehicle.java</summary>

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

</details>

### 📄 `model/VehicleType.java`

<details>
<summary>📄 Click to view model/VehicleType.java</summary>

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

</details>
