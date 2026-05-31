# parkinglot - Complete Implementation

> Generated from `src/main/java/com/you/lld/problems/parkinglot/` on 2026-05-31. Re-run `python3 scripts/generate-code-md.py parkinglot`.

## Project Structure (32 files)

```
parkinglot/
├── impl/ParkingLotDemo.java
├── api/ParkingEventListener.java
├── api/ParkingService.java
├── api/ParkingTicketResult.java
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
├── model/Floor.java
├── model/OccupancyReport.java
├── model/ParkingLot.java
├── model/ParkingSpace.java
├── model/ParkingTicket.java
├── model/Payment.java
├── model/PaymentMethod.java
├── model/PaymentStatus.java
├── model/SpaceType.java
├── model/Vehicle.java
├── model/VehicleType.java
├── impl/FirstAvailableAllocationStrategy.java
├── impl/FlatRatePricingStrategy.java
├── impl/HourlyPricingStrategy.java
├── impl/InMemoryParkingService.java
├── impl/LoggingEventListener.java
├── impl/NearestSpaceAllocationStrategy.java
├── impl/SimplePaymentProcessor.java
```

## Source Code

### `impl/ParkingLotDemo.java`

<details>
<summary>Click to view impl/ParkingLotDemo.java</summary>

```java
package com.you.lld.problems.parkinglot.impl;

import com.you.lld.common.Money;
import com.you.lld.problems.parkinglot.api.ParkingService;
import com.you.lld.problems.parkinglot.api.ParkingTicketResult;
import com.you.lld.problems.parkinglot.api.exceptions.InvalidTicketException;
import com.you.lld.problems.parkinglot.api.exceptions.InvalidVehicleException;
import com.you.lld.problems.parkinglot.api.exceptions.ParkingFullException;
import com.you.lld.problems.parkinglot.api.exceptions.PaymentFailedException;
import com.you.lld.problems.parkinglot.model.Floor;
import com.you.lld.problems.parkinglot.model.OccupancyReport;
import com.you.lld.problems.parkinglot.model.ParkingLot;
import com.you.lld.problems.parkinglot.model.ParkingSpace;
import com.you.lld.problems.parkinglot.model.Payment;
import com.you.lld.problems.parkinglot.model.PaymentMethod;
import com.you.lld.problems.parkinglot.model.SpaceType;
import com.you.lld.problems.parkinglot.model.Vehicle;
import com.you.lld.problems.parkinglot.model.VehicleType;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Currency;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * End-to-end demo covering every feature of the overhauled parking lot:
 *   1. Lot composite (Lot -> Floor -> Space) construction
 *   2. Strategy plug-in (Hourly pricing, Nearest allocation)
 *   3. Observer (LoggingEventListener)
 *   4. Regular + disabled-permit entry with correct allocation
 *   5. Swappable strategies (switch to FirstAvailable + FlatRate mid-demo)
 *   6. Exit + payment flow with all payment methods
 *   7. Error handling (already-parked, invalid ticket, full lot)
 *   8. Concurrent entries hitting CAS allocation
 */
public class ParkingLotDemo {

    public static void main(String[] args) throws Exception {
        header("Parking Lot — full demo");

        // ── Scenario 1: build the lot composite ─────────────────────────────
        header("1. Build ParkingLot -> Floor -> Space");
        ParkingLot lot = buildSmallLot();
        System.out.println("   lot '" + lot.getName() + "' has " + lot.getFloors().size()
            + " floors, " + lot.totalSpaces() + " spaces total");

        // ── Scenario 2: service with Hourly + Nearest ───────────────────────
        header("2. Wire service with Hourly pricing + Nearest allocation");
        HourlyPricingStrategy hourly = new HourlyPricingStrategy();
        NearestSpaceAllocationStrategy nearest = new NearestSpaceAllocationStrategy();
        SimplePaymentProcessor payments = new SimplePaymentProcessor();

        ParkingService service = new InMemoryParkingService(lot, hourly, nearest, payments);
        service.addEventListener(new LoggingEventListener());
        System.out.println("   pricing:    " + hourly.getDescription());
        System.out.println("   allocation: " + nearest.getDescription());

        reportOccupancy(service.getOccupancyReport());

        // ── Scenario 3: park a mix of vehicles ──────────────────────────────
        header("3. Park vehicles of each type");
        Vehicle bike   = new Vehicle("KA-01-MC-1", VehicleType.MOTORCYCLE);
        Vehicle car    = new Vehicle("KA-02-CR-1", VehicleType.CAR);
        Vehicle suv    = new Vehicle("KA-02-CR-2", VehicleType.CAR);
        Vehicle truck  = new Vehicle("KA-03-TR-1", VehicleType.TRUCK);
        Vehicle access = new Vehicle("KA-04-DS-1", VehicleType.CAR, true);

        ParkingTicketResult t1 = service.enterVehicle(bike);
        ParkingTicketResult t2 = service.enterVehicle(car);
        ParkingTicketResult t3 = service.enterVehicle(access);
        ParkingTicketResult t4 = service.enterVehicle(truck);
        ParkingTicketResult t5 = service.enterVehicle(suv);

        System.out.println();
        System.out.println("   assigned spaces:");
        System.out.println("     bike   -> " + t1.getSpaceId());
        System.out.println("     car    -> " + t2.getSpaceId());
        System.out.println("     access -> " + t3.getSpaceId() + "  (disabled permit; should land in a DISABLED space)");
        System.out.println("     truck  -> " + t4.getSpaceId() + "  (only LARGE compatible)");
        System.out.println("     suv    -> " + t5.getSpaceId());
        reportOccupancy(service.getOccupancyReport());

        // ── Scenario 4: fee preview ────────────────────────────────────────
        header("4. Fee preview (grace period is 15m; short stays are free)");
        System.out.println("   bike  fee preview: " + service.calculateParkingFee(t1.getTicketId()));
        System.out.println("   car   fee preview: " + service.calculateParkingFee(t2.getTicketId()));
        System.out.println("   truck fee preview: " + service.calculateParkingFee(t4.getTicketId()));

        // ── Scenario 5: exit + different payment methods ────────────────────
        header("5. Exit vehicles with different payment methods");
        Payment p1 = service.exitVehicle(t1.getTicketId(), PaymentMethod.MOBILE_PAYMENT);
        Payment p2 = service.exitVehicle(t2.getTicketId(), PaymentMethod.CREDIT_CARD);
        Payment p3 = service.exitVehicle(t3.getTicketId(), PaymentMethod.DEBIT_CARD);
        System.out.println();
        System.out.println("   payments issued: " + p1.getPaymentId() + ", " + p2.getPaymentId() + ", " + p3.getPaymentId());

        // ── Scenario 6: swap in FlatRate + FirstAvailable strategies ────────
        header("6. Swap to FlatRate pricing + FirstAvailable allocation on a fresh lot");
        Map<VehicleType, Money> dailyRates = new HashMap<>();
        Currency usd = Currency.getInstance("USD");
        dailyRates.put(VehicleType.MOTORCYCLE, Money.of(new BigDecimal("8.00"),  usd));
        dailyRates.put(VehicleType.CAR,        Money.of(new BigDecimal("15.00"), usd));
        dailyRates.put(VehicleType.TRUCK,      Money.of(new BigDecimal("25.00"), usd));
        dailyRates.put(VehicleType.BUS,        Money.of(new BigDecimal("35.00"), usd));

        ParkingLot lot2 = buildSmallLot();
        ParkingService alt = new InMemoryParkingService(
            lot2,
            new FlatRatePricingStrategy(dailyRates),
            new FirstAvailableAllocationStrategy(),
            new SimplePaymentProcessor()
        );
        alt.addEventListener(new LoggingEventListener());

        ParkingTicketResult at = alt.enterVehicle(new Vehicle("TN-07-FL-1", VehicleType.CAR));
        System.out.println("   flat-rate fee preview: " + alt.calculateParkingFee(at.getTicketId()));
        alt.exitVehicle(at.getTicketId(), PaymentMethod.CASH);

        // ── Scenario 7: error handling ──────────────────────────────────────
        header("7. Error handling");
        safe("already-parked",  () -> service.enterVehicle(truck));
        safe("invalid ticket",  () -> service.exitVehicle("BOGUS-ID", PaymentMethod.CASH));
        safe("bad vehicle",     () -> service.enterVehicle(new Vehicle("   ", VehicleType.CAR)));

        header("8. Fill until full, then prove ParkingFullException fires");
        fillUntilFull(service);

        // ── Scenario 9: concurrent entries ──────────────────────────────────
        header("9. Concurrent entries (CAS allocation)");
        concurrentEntries();

        System.out.println();
        System.out.println("=== demo complete ===");
    }

    private static ParkingLot buildSmallLot() {
        List<Floor> floors = new ArrayList<>();
        floors.add(floor(0, 2, 3, 1, 1));
        floors.add(floor(1, 1, 4, 2, 0));
        floors.add(floor(2, 1, 2, 1, 0));
        return new ParkingLot("LOT-001", "Airport Terminal 1", floors);
    }

    private static Floor floor(int num, int motos, int compacts, int larges, int disableds) {
        List<ParkingSpace> s = new ArrayList<>();
        for (int i = 1; i <= motos;     i++) s.add(new ParkingSpace("F" + num + "-MC-" + i, SpaceType.MOTORCYCLE, num));
        for (int i = 1; i <= compacts;  i++) s.add(new ParkingSpace("F" + num + "-C-"  + i, SpaceType.COMPACT,    num));
        for (int i = 1; i <= larges;    i++) s.add(new ParkingSpace("F" + num + "-L-"  + i, SpaceType.LARGE,      num));
        for (int i = 1; i <= disableds; i++) s.add(new ParkingSpace("F" + num + "-D-"  + i, SpaceType.DISABLED,   num));
        return new Floor(num, s);
    }

    private static void reportOccupancy(OccupancyReport r) {
        System.out.println();
        System.out.println("   occupancy: " + r.getOccupiedSpaces() + "/" + r.getTotalSpaces()
            + "  (" + String.format("%.0f%%", r.getOccupancyRate() * 100) + " full)");
        for (SpaceType t : SpaceType.values()) {
            int avail = r.getAvailableSpaces(t);
            int occ   = r.getOccupiedSpaces(t);
            if (avail + occ > 0) {
                System.out.println("     " + t + ": " + occ + " occupied / " + (avail + occ) + " total");
            }
        }
    }

    private static void fillUntilFull(ParkingService service) {
        int n = 0;
        while (true) {
            try {
                Vehicle v = new Vehicle("FILL-" + n, VehicleType.CAR);
                service.enterVehicle(v);
                n++;
            } catch (ParkingFullException e) {
                System.out.println("   filled " + n + " additional cars, then: " + e.getMessage());
                return;
            } catch (InvalidVehicleException e) {
                n++;
            }
        }
    }

    private static void concurrentEntries() throws InterruptedException {
        ParkingLot lot = buildSmallLot();
        ParkingService svc = new InMemoryParkingService(
            lot,
            new HourlyPricingStrategy(),
            new NearestSpaceAllocationStrategy(),
            new SimplePaymentProcessor()
        );

        int threads = 20;
        CountDownLatch start = new CountDownLatch(1);
        CountDownLatch done  = new CountDownLatch(threads);
        AtomicInteger parked = new AtomicInteger();
        AtomicInteger full   = new AtomicInteger();

        for (int i = 0; i < threads; i++) {
            final int id = i;
            new Thread(() -> {
                try {
                    start.await();
                    svc.enterVehicle(new Vehicle("CON-" + id, VehicleType.CAR));
                    parked.incrementAndGet();
                } catch (ParkingFullException e) {
                    full.incrementAndGet();
                } catch (Exception ignored) {
                } finally {
                    done.countDown();
                }
            }, "entry-" + id).start();
        }

        start.countDown();
        done.await();
        System.out.println("   launched " + threads + " threads: parked=" + parked.get()
            + " rejected=" + full.get());
        System.out.println("   lot occupancy now: " + svc.getOccupancyReport().getOccupiedSpaces()
            + "/" + svc.getOccupancyReport().getTotalSpaces());
        System.out.println("   (parked count should exactly equal occupied count)");
    }

    private static void header(String msg) {
        System.out.println();
        System.out.println("── " + msg + " ──");
    }

    @FunctionalInterface
    private interface ThrowingRunnable { void run() throws Exception; }

    private static void safe(String label, ThrowingRunnable r) {
        try {
            r.run();
            System.out.println("   " + label + ": (no exception — unexpected)");
        } catch (ParkingFullException | InvalidTicketException | InvalidVehicleException | PaymentFailedException e) {
            System.out.println("   " + label + " -> " + e.getClass().getSimpleName() + ": " + e.getMessage());
        } catch (Exception e) {
            System.out.println("   " + label + " -> " + e.getClass().getSimpleName() + ": " + e.getMessage());
        }
    }
}
```

</details>

### `api/ParkingEventListener.java`

<details>
<summary>Click to view api/ParkingEventListener.java</summary>

```java
package com.you.lld.problems.parkinglot.api;

import com.you.lld.problems.parkinglot.model.ParkingTicket;
import com.you.lld.problems.parkinglot.model.Payment;
import com.you.lld.problems.parkinglot.model.Vehicle;
import com.you.lld.problems.parkinglot.model.VehicleType;

/**
 * Observer hook for parking lifecycle events.
 *
 * The service fans out to every registered listener on state transitions.
 * Default methods allow listeners to override only what they care about.
 *
 * Listeners should be non-blocking — the service iterates synchronously.
 * Heavy work should be pushed onto the listener's own executor.
 */
public interface ParkingEventListener {

    default void onVehicleEntered(ParkingTicket ticket) {}

    default void onVehicleExited(ParkingTicket ticket, Payment payment) {}

    /** Fired when allocation fails because no compatible space is available. */
    default void onLotFull(Vehicle vehicle, VehicleType vehicleType) {}
}
```

</details>

### `api/ParkingService.java`

<details>
<summary>Click to view api/ParkingService.java</summary>

```java
package com.you.lld.problems.parkinglot.api;

import com.you.lld.common.Money;
import com.you.lld.problems.parkinglot.api.exceptions.InvalidTicketException;
import com.you.lld.problems.parkinglot.api.exceptions.InvalidVehicleException;
import com.you.lld.problems.parkinglot.api.exceptions.ParkingFullException;
import com.you.lld.problems.parkinglot.api.exceptions.PaymentFailedException;
import com.you.lld.problems.parkinglot.model.OccupancyReport;
import com.you.lld.problems.parkinglot.model.Payment;
import com.you.lld.problems.parkinglot.model.PaymentMethod;
import com.you.lld.problems.parkinglot.model.Vehicle;

/**
 * Core facade for the parking lot system.
 *
 * Orchestrates:
 *   - Vehicle entry    (allocation strategy -> atomic claim -> issue ticket)
 *   - Fee calculation  (pricing strategy)
 *   - Vehicle exit     (calc fee -> process payment -> release space -> close ticket)
 *   - Availability + occupancy reporting
 *   - Event listener registration for external observers
 *
 * Errors use the checked ParkingException hierarchy so callers must either
 * handle them explicitly or propagate them — consistent with the business
 * rules of a real-world parking system.
 */
public interface ParkingService {

    /**
     * Allocate a space and issue a ticket.
     * @throws ParkingFullException    if no compatible space is available
     * @throws InvalidVehicleException if the vehicle is null, has no license, or is already inside
     */
    ParkingTicketResult enterVehicle(Vehicle vehicle)
        throws ParkingFullException, InvalidVehicleException;

    /**
     * Calculate fee (pricing strategy) and process payment; vacate on success.
     * @throws InvalidTicketException  if the ticket is unknown or already closed
     * @throws PaymentFailedException  if the payment gateway rejects
     */
    Payment exitVehicle(String ticketId, PaymentMethod paymentMethod)
        throws InvalidTicketException, PaymentFailedException;

    /** Read-only fee preview using the current pricing strategy. */
    Money calculateParkingFee(String ticketId) throws InvalidTicketException;

    /** True if at least one compatible-and-unoccupied space exists for this vehicle. */
    boolean checkAvailability(Vehicle vehicle);

    /** Snapshot of current lot occupancy. */
    OccupancyReport getOccupancyReport();

    /** Register an observer. Listeners are invoked synchronously in registration order. */
    void addEventListener(ParkingEventListener listener);

    /** Remove a previously registered listener. No-op if not registered. */
    void removeEventListener(ParkingEventListener listener);
}
```

</details>

### `api/ParkingTicketResult.java`

<details>
<summary>Click to view api/ParkingTicketResult.java</summary>

```java
package com.you.lld.problems.parkinglot.api;

import com.you.lld.problems.parkinglot.model.ParkingTicket;

/**
 * Thin wrapper around ParkingTicket returned from enterVehicle().
 *
 * Exists so the public API can evolve (add fields like predicted fee,
 * QR code, barrier-gate command, etc.) without breaking callers that
 * only need the ticket.
 */
public final class ParkingTicketResult {

    private final ParkingTicket ticket;

    public ParkingTicketResult(ParkingTicket ticket) {
        this.ticket = ticket;
    }

    public ParkingTicket getTicket()  { return ticket; }
    public String getTicketId()       { return ticket.getTicketId(); }
    public String getSpaceId()        { return ticket.getParkingSpace().getSpaceId(); }

    @Override public String toString() { return "ParkingTicketResult{" + ticket + "}"; }
}
```

</details>

### `api/PaymentProcessor.java`

<details>
<summary>Click to view api/PaymentProcessor.java</summary>

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

### `api/PricingStrategy.java`

<details>
<summary>Click to view api/PricingStrategy.java</summary>

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

### `api/SpaceAllocationStrategy.java`

<details>
<summary>Click to view api/SpaceAllocationStrategy.java</summary>

```java
package com.you.lld.problems.parkinglot.api;

import com.you.lld.problems.parkinglot.model.ParkingSpace;
import com.you.lld.problems.parkinglot.model.Vehicle;

import java.util.List;
import java.util.Optional;

/**
 * Strategy for picking one ParkingSpace from the set currently available
 * and compatible with a given Vehicle.
 *
 * The service pre-filters to compatible-and-available spaces so the strategy
 * only decides policy — not validity. Strategies MUST NOT mutate space state;
 * the service performs the atomic claim via ParkingSpace.tryOccupy().
 *
 * Takes the full Vehicle (not just VehicleType) so a strategy can use
 * attributes like hasDisabledPermit() for preference.
 */
public interface SpaceAllocationStrategy {

    Optional<ParkingSpace> selectSpace(List<ParkingSpace> availableSpaces, Vehicle vehicle);

    String getDescription();
}
```

</details>

### `api/exceptions/InvalidTicketException.java`

<details>
<summary>Click to view api/exceptions/InvalidTicketException.java</summary>

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

### `api/exceptions/InvalidVehicleException.java`

<details>
<summary>Click to view api/exceptions/InvalidVehicleException.java</summary>

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

### `api/exceptions/ParkingException.java`

<details>
<summary>Click to view api/exceptions/ParkingException.java</summary>

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

### `api/exceptions/ParkingFullException.java`

<details>
<summary>Click to view api/exceptions/ParkingFullException.java</summary>

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

### `api/exceptions/PaymentFailedException.java`

<details>
<summary>Click to view api/exceptions/PaymentFailedException.java</summary>

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

### `api/exceptions/PaymentProcessingException.java`

<details>
<summary>Click to view api/exceptions/PaymentProcessingException.java</summary>

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

### `api/exceptions/RefundException.java`

<details>
<summary>Click to view api/exceptions/RefundException.java</summary>

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

### `model/Floor.java`

<details>
<summary>Click to view model/Floor.java</summary>

```java
package com.you.lld.problems.parkinglot.model;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

/**
 * A single floor of the parking lot — owns a fixed set of ParkingSpaces.
 *
 * The space list is immutable after construction (no runtime resize).
 * Per-space occupancy mutates, but that's inside ParkingSpace.
 */
public final class Floor {

    private final int floorNumber;
    private final List<ParkingSpace> spaces;

    public Floor(int floorNumber, List<ParkingSpace> spaces) {
        if (floorNumber < 0)
            throw new IllegalArgumentException("floorNumber must be >= 0");
        Objects.requireNonNull(spaces, "spaces");
        for (ParkingSpace s : spaces) {
            if (s.getFloorNumber() != floorNumber) {
                throw new IllegalArgumentException(
                    "space " + s.getSpaceId() + " is on floor " + s.getFloorNumber() +
                    " but added to floor " + floorNumber);
            }
        }
        this.floorNumber = floorNumber;
        this.spaces = Collections.unmodifiableList(new ArrayList<>(spaces));
    }

    public int getFloorNumber() { return floorNumber; }
    public List<ParkingSpace> getSpaces() { return spaces; }

    public int size() { return spaces.size(); }

    public List<ParkingSpace> availableFor(Vehicle vehicle) {
        return spaces.stream()
            .filter(s -> s.isAvailable() && s.canAccept(vehicle))
            .collect(Collectors.toList());
    }

    public long occupiedCount() {
        return spaces.stream().filter(ParkingSpace::isOccupied).count();
    }
}
```

</details>

### `model/OccupancyReport.java`

<details>
<summary>Click to view model/OccupancyReport.java</summary>

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

### `model/ParkingLot.java`

<details>
<summary>Click to view model/ParkingLot.java</summary>

```java
package com.you.lld.problems.parkinglot.model;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

/**
 * Composite root: ParkingLot -> Floor -> ParkingSpace.
 *
 * The lot's structure (floors, spaces) is fixed after construction; only
 * occupancy state on individual spaces is mutable.
 *
 * Query helpers here are read-only and never mutate state — the Service
 * decides what to do with the returned candidates.
 */
public final class ParkingLot {

    private final String lotId;
    private final String name;
    private final List<Floor> floors;
    private final List<ParkingSpace> allSpaces;

    public ParkingLot(String lotId, String name, List<Floor> floors) {
        if (lotId == null || lotId.trim().isEmpty())
            throw new IllegalArgumentException("lotId required");
        if (name == null || name.trim().isEmpty())
            throw new IllegalArgumentException("name required");
        Objects.requireNonNull(floors, "floors");
        if (floors.isEmpty())
            throw new IllegalArgumentException("lot must have at least one floor");
        this.lotId = lotId;
        this.name = name;
        this.floors = Collections.unmodifiableList(new ArrayList<>(floors));

        List<ParkingSpace> flat = new ArrayList<>();
        for (Floor f : floors) flat.addAll(f.getSpaces());
        this.allSpaces = Collections.unmodifiableList(flat);
    }

    public String getLotId()           { return lotId; }
    public String getName()            { return name; }
    public List<Floor> getFloors()     { return floors; }
    public List<ParkingSpace> getAllSpaces() { return allSpaces; }
    public int totalSpaces()           { return allSpaces.size(); }

    /** All spaces across all floors currently available for this vehicle. */
    public List<ParkingSpace> availableFor(Vehicle vehicle) {
        return allSpaces.stream()
            .filter(s -> s.isAvailable() && s.canAccept(vehicle))
            .collect(Collectors.toList());
    }

    public long occupiedCount() {
        return allSpaces.stream().filter(ParkingSpace::isOccupied).count();
    }
}
```

</details>

### `model/ParkingSpace.java`

<details>
<summary>Click to view model/ParkingSpace.java</summary>

```java
package com.you.lld.problems.parkinglot.model;

import java.util.Objects;
import java.util.concurrent.atomic.AtomicBoolean;

/**
 * Individual parking space.
 *
 * Concurrency model:
 *   - occupied is an AtomicBoolean.
 *   - tryOccupy() uses compareAndSet() so only ONE thread wins when multiple
 *     threads race to claim the same space. No locks on the hot path.
 *   - currentVehicle is volatile; readers see the latest vehicle after a
 *     successful claim; cleared on vacate().
 *
 * Compatibility rules:
 *   - canPhysicallyFit(VehicleType) — pure size check, ignores permits.
 *   - canAccept(Vehicle)            — full rules: size + permit for DISABLED.
 *
 * Only canAccept(Vehicle) should be used to gate an actual park attempt.
 */
public final class ParkingSpace {

    private final String spaceId;
    private final SpaceType spaceType;
    private final int floorNumber;
    private final AtomicBoolean occupied = new AtomicBoolean(false);
    private volatile Vehicle currentVehicle;

    public ParkingSpace(String spaceId, SpaceType spaceType, int floorNumber) {
        if (spaceId == null || spaceId.trim().isEmpty())
            throw new IllegalArgumentException("spaceId required");
        if (floorNumber < 0)
            throw new IllegalArgumentException("floorNumber must be >= 0");
        this.spaceId = spaceId;
        this.spaceType = Objects.requireNonNull(spaceType, "spaceType");
        this.floorNumber = floorNumber;
    }

    /**
     * Atomic claim. Returns true if this thread won the race.
     * Called by the service after allocation strategy selects this space.
     */
    public boolean tryOccupy(Vehicle vehicle) {
        Objects.requireNonNull(vehicle, "vehicle");
        if (!canAccept(vehicle)) return false;
        if (occupied.compareAndSet(false, true)) {
            this.currentVehicle = vehicle;
            return true;
        }
        return false;
    }

    /** Release the space. Safe to call when already free (no-op). */
    public Vehicle vacate() {
        Vehicle v = this.currentVehicle;
        this.currentVehicle = null;
        occupied.set(false);
        return v;
    }

    /** Size-only check: can this space's dimensions hold this vehicle type? */
    public boolean canPhysicallyFit(VehicleType type) {
        return spaceType.canAccommodate(type);
    }

    /** Full rules: physical fit AND permit check for DISABLED spaces. */
    public boolean canAccept(Vehicle vehicle) {
        if (vehicle == null) return false;
        if (!canPhysicallyFit(vehicle.getVehicleType())) return false;
        if (spaceType == SpaceType.DISABLED && !vehicle.hasDisabledPermit()) return false;
        return true;
    }

    public String getSpaceId()       { return spaceId; }
    public SpaceType getSpaceType()  { return spaceType; }
    public int getFloorNumber()      { return floorNumber; }
    public boolean isOccupied()      { return occupied.get(); }
    public boolean isAvailable()     { return !occupied.get(); }
    public Vehicle getCurrentVehicle() { return currentVehicle; }

    @Override public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ParkingSpace)) return false;
        return spaceId.equals(((ParkingSpace) o).spaceId);
    }
    @Override public int hashCode() { return spaceId.hashCode(); }
    @Override public String toString() {
        return "ParkingSpace{" + spaceId + "," + spaceType + ",floor=" + floorNumber +
               ",occupied=" + isOccupied() + "}";
    }
}
```

</details>

### `model/ParkingTicket.java`

<details>
<summary>Click to view model/ParkingTicket.java</summary>

```java
package com.you.lld.problems.parkinglot.model;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Objects;

/**
 * Issued when a vehicle enters; closed when the vehicle exits.
 *
 * Lifecycle (status):
 *   ACTIVE --exit()--> CLOSED
 *   ACTIVE --cancel()--> CANCELLED
 *
 * Only the service should call exit()/cancel(). Keep these as plain methods
 * here rather than a full State pattern — the state machine is tiny.
 */
public final class ParkingTicket {

    public enum Status { ACTIVE, CLOSED, CANCELLED }

    private final String ticketId;
    private final Vehicle vehicle;
    private final ParkingSpace parkingSpace;
    private final LocalDateTime entryTime;
    private volatile LocalDateTime exitTime;
    private volatile Status status = Status.ACTIVE;

    public ParkingTicket(String ticketId, Vehicle vehicle, ParkingSpace space, LocalDateTime entryTime) {
        if (ticketId == null || ticketId.trim().isEmpty())
            throw new IllegalArgumentException("ticketId required");
        this.ticketId = ticketId;
        this.vehicle = Objects.requireNonNull(vehicle, "vehicle");
        this.parkingSpace = Objects.requireNonNull(space, "parkingSpace");
        this.entryTime = Objects.requireNonNull(entryTime, "entryTime");
    }

    public synchronized void markExit(LocalDateTime exitTime) {
        if (status != Status.ACTIVE)
            throw new IllegalStateException("ticket " + ticketId + " is " + status);
        if (exitTime.isBefore(entryTime))
            throw new IllegalArgumentException("exit time is before entry time");
        this.exitTime = exitTime;
        this.status = Status.CLOSED;
    }

    public synchronized void markCancelled() {
        if (status != Status.ACTIVE)
            throw new IllegalStateException("ticket " + ticketId + " is " + status);
        this.status = Status.CANCELLED;
    }

    /** Duration between entry and (exitTime OR now). */
    public Duration duration() {
        LocalDateTime end = (exitTime != null) ? exitTime : LocalDateTime.now();
        return Duration.between(entryTime, end);
    }

    public boolean isActive() { return status == Status.ACTIVE; }

    public String getTicketId()             { return ticketId; }
    public Vehicle getVehicle()             { return vehicle; }
    public ParkingSpace getParkingSpace()   { return parkingSpace; }
    public LocalDateTime getEntryTime()     { return entryTime; }
    public LocalDateTime getExitTime()      { return exitTime; }
    public Status getStatus()               { return status; }

    @Override public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ParkingTicket)) return false;
        return ticketId.equals(((ParkingTicket) o).ticketId);
    }
    @Override public int hashCode() { return ticketId.hashCode(); }
    @Override public String toString() {
        return "ParkingTicket{" + ticketId + ",vehicle=" + vehicle.getLicenseNumber() +
               ",space=" + parkingSpace.getSpaceId() + ",status=" + status + "}";
    }
}
```

</details>

### `model/Payment.java`

<details>
<summary>Click to view model/Payment.java</summary>

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

### `model/PaymentMethod.java`

<details>
<summary>Click to view model/PaymentMethod.java</summary>

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

### `model/PaymentStatus.java`

<details>
<summary>Click to view model/PaymentStatus.java</summary>

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

### `model/SpaceType.java`

<details>
<summary>Click to view model/SpaceType.java</summary>

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

### `model/Vehicle.java`

<details>
<summary>Click to view model/Vehicle.java</summary>

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

### `model/VehicleType.java`

<details>
<summary>Click to view model/VehicleType.java</summary>

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

### `impl/FirstAvailableAllocationStrategy.java`

<details>
<summary>Click to view impl/FirstAvailableAllocationStrategy.java</summary>

```java
package com.you.lld.problems.parkinglot.impl;

import com.you.lld.problems.parkinglot.api.SpaceAllocationStrategy;
import com.you.lld.problems.parkinglot.model.ParkingSpace;
import com.you.lld.problems.parkinglot.model.SpaceType;
import com.you.lld.problems.parkinglot.model.Vehicle;

import java.util.List;
import java.util.Optional;

/**
 * Simple strategy: pick the first space in the provided list.
 *
 * Useful when the caller has already sorted/filtered the candidates
 * or when you don't want smart fitting — e.g., valets who park wherever.
 *
 * Still respects the disabled-permit reservation: disabled vehicles
 * prefer DISABLED spaces; regular vehicles skip DISABLED spaces
 * (the service already filtered using ParkingSpace.canAccept).
 */
public class FirstAvailableAllocationStrategy implements SpaceAllocationStrategy {

    @Override
    public Optional<ParkingSpace> selectSpace(List<ParkingSpace> availableSpaces, Vehicle vehicle) {
        if (availableSpaces == null || availableSpaces.isEmpty() || vehicle == null) {
            return Optional.empty();
        }
        if (vehicle.hasDisabledPermit()) {
            Optional<ParkingSpace> reserved = availableSpaces.stream()
                .filter(s -> s.getSpaceType() == SpaceType.DISABLED)
                .findFirst();
            if (reserved.isPresent()) return reserved;
        }
        return Optional.of(availableSpaces.get(0));
    }

    @Override
    public String getDescription() {
        return "First-available allocation: picks the first compatible space in iteration order.";
    }
}
```

</details>

### `impl/FlatRatePricingStrategy.java`

<details>
<summary>Click to view impl/FlatRatePricingStrategy.java</summary>

```java
package com.you.lld.problems.parkinglot.impl;

import com.you.lld.common.Money;
import com.you.lld.problems.parkinglot.api.PricingStrategy;
import com.you.lld.problems.parkinglot.model.ParkingTicket;
import com.you.lld.problems.parkinglot.model.VehicleType;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

/**
 * Day-pass pricing: one flat fee per calendar day, per vehicle type.
 *
 * Duration of 0..24h = 1 day; 24..48h = 2 days; etc.
 * Good example of an alternative Strategy with completely different math
 * from HourlyPricingStrategy while satisfying the same interface.
 */
public class FlatRatePricingStrategy implements PricingStrategy {

    private final Map<VehicleType, Money> dailyRates;

    public FlatRatePricingStrategy(Map<VehicleType, Money> dailyRates) {
        Objects.requireNonNull(dailyRates, "dailyRates");
        for (VehicleType t : VehicleType.values()) {
            if (!dailyRates.containsKey(t)) {
                throw new IllegalArgumentException("missing daily rate for " + t);
            }
        }
        this.dailyRates = new HashMap<>(dailyRates);
    }

    @Override
    public Money calculateFee(ParkingTicket ticket) {
        Objects.requireNonNull(ticket, "ticket");
        long hours = ticket.duration().toHours();
        long days = Math.max(1, (hours + 23) / 24);
        Money rate = dailyRates.get(ticket.getVehicle().getVehicleType());
        return rate.times(days);
    }

    @Override
    public String getDescription() {
        return "Flat daily-rate pricing: one rate per 24h period per vehicle type.";
    }
}
```

</details>

### `impl/HourlyPricingStrategy.java`

<details>
<summary>Click to view impl/HourlyPricingStrategy.java</summary>

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
 * Per-hour pricing with per-vehicle-type rates, a grace period, and a floor.
 *
 * Rules:
 *   - Duration <= gracePeriod              -> FREE
 *   - Otherwise: round UP to full hours
 *                fee = hourlyRate * hours
 *                fee = max(fee, minimumCharge)
 *
 * Rounding up reflects how real lots bill ("1h 5m = 2 hours"); switch to
 * a different rounding rule if the business prefers.
 */
public class HourlyPricingStrategy implements PricingStrategy {

    private final Map<VehicleType, Money> hourlyRates;
    private final Money minimumCharge;
    private final Duration gracePeriod;
    private final Currency currency;

    public HourlyPricingStrategy() {
        this(Currency.getInstance("USD"));
    }

    public HourlyPricingStrategy(Currency currency) {
        this.currency = Objects.requireNonNull(currency, "currency");
        this.hourlyRates = new HashMap<>();
        this.hourlyRates.put(VehicleType.MOTORCYCLE, Money.of(new BigDecimal("10.00"), currency));
        this.hourlyRates.put(VehicleType.CAR,        Money.of(new BigDecimal("20.00"), currency));
        this.hourlyRates.put(VehicleType.TRUCK,      Money.of(new BigDecimal("40.00"), currency));
        this.hourlyRates.put(VehicleType.BUS,        Money.of(new BigDecimal("50.00"), currency));
        this.minimumCharge = Money.of(new BigDecimal("5.00"), currency);
        this.gracePeriod   = Duration.ofMinutes(15);
    }

    public HourlyPricingStrategy(Map<VehicleType, Money> hourlyRates,
                                 Money minimumCharge,
                                 Duration gracePeriod,
                                 Currency currency) {
        this.currency      = Objects.requireNonNull(currency, "currency");
        this.hourlyRates   = new HashMap<>(Objects.requireNonNull(hourlyRates, "hourlyRates"));
        this.minimumCharge = Objects.requireNonNull(minimumCharge, "minimumCharge");
        this.gracePeriod   = Objects.requireNonNull(gracePeriod, "gracePeriod");

        for (VehicleType type : VehicleType.values()) {
            if (!this.hourlyRates.containsKey(type)) {
                throw new IllegalArgumentException("missing hourly rate for " + type);
            }
        }
    }

    @Override
    public Money calculateFee(ParkingTicket ticket) {
        Objects.requireNonNull(ticket, "ticket");
        Duration d = ticket.duration();

        if (d.compareTo(gracePeriod) <= 0) {
            return Money.ofMinor(0, currency);
        }

        VehicleType type = ticket.getVehicle().getVehicleType();
        Money rate = hourlyRates.get(type);
        if (rate == null) {
            throw new IllegalStateException("no hourly rate configured for " + type);
        }

        long minutes = d.toMinutes();
        long hours = (minutes + 59) / 60;
        Money total = rate.times(hours);

        return total.compareTo(minimumCharge) < 0 ? minimumCharge : total;
    }

    @Override
    public String getDescription() {
        return "Hourly pricing (grace=" + gracePeriod.toMinutes() + "m, min=" + minimumCharge + ")";
    }

    public Money getHourlyRate(VehicleType type) { return hourlyRates.get(type); }
    public Money getMinimumCharge()              { return minimumCharge; }
    public Duration getGracePeriod()             { return gracePeriod; }
}
```

</details>

### `impl/InMemoryParkingService.java`

<details>
<summary>Click to view impl/InMemoryParkingService.java</summary>

```java
package com.you.lld.problems.parkinglot.impl;

import com.you.lld.common.Money;
import com.you.lld.problems.parkinglot.api.ParkingEventListener;
import com.you.lld.problems.parkinglot.api.ParkingService;
import com.you.lld.problems.parkinglot.api.ParkingTicketResult;
import com.you.lld.problems.parkinglot.api.PaymentProcessor;
import com.you.lld.problems.parkinglot.api.PricingStrategy;
import com.you.lld.problems.parkinglot.api.SpaceAllocationStrategy;
import com.you.lld.problems.parkinglot.api.exceptions.InvalidTicketException;
import com.you.lld.problems.parkinglot.api.exceptions.InvalidVehicleException;
import com.you.lld.problems.parkinglot.api.exceptions.ParkingFullException;
import com.you.lld.problems.parkinglot.api.exceptions.PaymentFailedException;
import com.you.lld.problems.parkinglot.api.exceptions.PaymentProcessingException;
import com.you.lld.problems.parkinglot.model.OccupancyReport;
import com.you.lld.problems.parkinglot.model.ParkingLot;
import com.you.lld.problems.parkinglot.model.ParkingSpace;
import com.you.lld.problems.parkinglot.model.ParkingTicket;
import com.you.lld.problems.parkinglot.model.Payment;
import com.you.lld.problems.parkinglot.model.PaymentMethod;
import com.you.lld.problems.parkinglot.model.SpaceType;
import com.you.lld.problems.parkinglot.model.Vehicle;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.atomic.AtomicLong;

/**
 * In-memory coordinator for the parking lot.
 *
 * Concurrency:
 *   - allocation uses a CAS retry loop on ParkingSpace.tryOccupy()
 *   - the license-plate -> activeTicket map uses putIfAbsent so two threads
 *     entering the same vehicle at once cannot both succeed
 *   - ConcurrentHashMap for ticket books; CopyOnWriteArrayList for listeners
 *
 * Exit flow is fail-safe: the space is only vacated AFTER the payment
 * succeeds. If payment throws, the vehicle is still "parked" in the system.
 */
public class InMemoryParkingService implements ParkingService {

    private static final int MAX_ALLOCATION_RETRIES = 8;

    private final ParkingLot lot;
    private final PricingStrategy pricing;
    private final SpaceAllocationStrategy allocation;
    private final PaymentProcessor paymentProcessor;

    private final Map<String, ParkingTicket> activeTickets    = new ConcurrentHashMap<>();
    private final Map<String, ParkingTicket> closedTickets    = new ConcurrentHashMap<>();
    private final Map<String, String> plateToActiveTicketId   = new ConcurrentHashMap<>();
    private final List<ParkingEventListener> listeners        = new CopyOnWriteArrayList<>();

    private final AtomicLong ticketCounter  = new AtomicLong(1);
    private final AtomicLong paymentCounter = new AtomicLong(1);

    public InMemoryParkingService(ParkingLot lot,
                                  PricingStrategy pricing,
                                  SpaceAllocationStrategy allocation,
                                  PaymentProcessor paymentProcessor) {
        this.lot              = Objects.requireNonNull(lot, "lot");
        this.pricing          = Objects.requireNonNull(pricing, "pricing");
        this.allocation       = Objects.requireNonNull(allocation, "allocation");
        this.paymentProcessor = Objects.requireNonNull(paymentProcessor, "paymentProcessor");
    }

    @Override
    public ParkingTicketResult enterVehicle(Vehicle vehicle)
            throws ParkingFullException, InvalidVehicleException {
        validateVehicle(vehicle);

        if (plateToActiveTicketId.containsKey(vehicle.getLicenseNumber())) {
            throw new InvalidVehicleException("vehicle already inside: " + vehicle.getLicenseNumber());
        }

        ParkingSpace claimed = claimSpaceFor(vehicle);
        if (claimed == null) {
            fire(l -> l.onLotFull(vehicle, vehicle.getVehicleType()));
            throw new ParkingFullException(vehicle.getVehicleType());
        }

        String ticketId = nextTicketId();
        ParkingTicket ticket = new ParkingTicket(ticketId, vehicle, claimed, LocalDateTime.now());

        String previous = plateToActiveTicketId.putIfAbsent(vehicle.getLicenseNumber(), ticketId);
        if (previous != null) {
            claimed.vacate();
            throw new InvalidVehicleException("vehicle already inside: " + vehicle.getLicenseNumber());
        }

        activeTickets.put(ticketId, ticket);
        fire(l -> l.onVehicleEntered(ticket));
        return new ParkingTicketResult(ticket);
    }

    private ParkingSpace claimSpaceFor(Vehicle vehicle) {
        for (int attempt = 0; attempt < MAX_ALLOCATION_RETRIES; attempt++) {
            List<ParkingSpace> candidates = lot.availableFor(vehicle);
            if (candidates.isEmpty()) return null;

            Optional<ParkingSpace> chosen = allocation.selectSpace(candidates, vehicle);
            if (!chosen.isPresent()) return null;

            if (chosen.get().tryOccupy(vehicle)) {
                return chosen.get();
            }
        }
        return null;
    }

    @Override
    public Payment exitVehicle(String ticketId, PaymentMethod paymentMethod)
            throws InvalidTicketException, PaymentFailedException {

        ParkingTicket ticket = requireActiveTicket(ticketId);

        Payment payment;
        synchronized (ticket) {
            if (!ticket.isActive()) {
                throw new InvalidTicketException(ticketId, "already closed");
            }
            Money fee = pricing.calculateFee(ticket);
            String paymentId = nextPaymentId();
            payment = new Payment(paymentId, ticket, fee, paymentMethod);

            try {
                boolean ok = paymentProcessor.processPayment(payment);
                if (!ok) {
                    payment.markFailed();
                    throw new PaymentFailedException("payment declined for " + ticketId);
                }
                payment.markCompleted("TXN-" + System.currentTimeMillis());
            } catch (PaymentProcessingException e) {
                payment.markFailed();
                throw new PaymentFailedException(e.getMessage(), e);
            }

            ticket.markExit(LocalDateTime.now());
            ticket.getParkingSpace().vacate();
            activeTickets.remove(ticketId);
            closedTickets.put(ticketId, ticket);
            plateToActiveTicketId.remove(ticket.getVehicle().getLicenseNumber());
        }

        final Payment published = payment;
        fire(l -> l.onVehicleExited(ticket, published));
        return payment;
    }

    @Override
    public Money calculateParkingFee(String ticketId) throws InvalidTicketException {
        ParkingTicket ticket = requireActiveTicket(ticketId);
        return pricing.calculateFee(ticket);
    }

    @Override
    public boolean checkAvailability(Vehicle vehicle) {
        if (vehicle == null) return false;
        return !lot.availableFor(vehicle).isEmpty();
    }

    @Override
    public OccupancyReport getOccupancyReport() {
        LocalDateTime ts = LocalDateTime.now();
        int total    = lot.totalSpaces();
        int occupied = (int) lot.occupiedCount();

        Map<SpaceType, Integer> availableByType = new HashMap<>();
        Map<SpaceType, Integer> occupiedByType  = new HashMap<>();
        for (SpaceType t : SpaceType.values()) {
            availableByType.put(t, 0);
            occupiedByType.put(t, 0);
        }
        for (ParkingSpace s : lot.getAllSpaces()) {
            SpaceType t = s.getSpaceType();
            if (s.isOccupied()) occupiedByType.merge(t, 1, Integer::sum);
            else                availableByType.merge(t, 1, Integer::sum);
        }

        return new OccupancyReport(ts, total, occupied, availableByType, occupiedByType);
    }

    @Override
    public void addEventListener(ParkingEventListener listener) {
        if (listener != null) listeners.add(listener);
    }

    @Override
    public void removeEventListener(ParkingEventListener listener) {
        listeners.remove(listener);
    }

    public Optional<ParkingTicket> getTicket(String ticketId) {
        ParkingTicket t = activeTickets.get(ticketId);
        return t != null ? Optional.of(t) : Optional.ofNullable(closedTickets.get(ticketId));
    }

    private void validateVehicle(Vehicle v) throws InvalidVehicleException {
        if (v == null) throw new InvalidVehicleException("vehicle is null");
        if (v.getLicenseNumber() == null || v.getLicenseNumber().trim().isEmpty()) {
            throw new InvalidVehicleException("license number is empty");
        }
    }

    private ParkingTicket requireActiveTicket(String ticketId) throws InvalidTicketException {
        if (ticketId == null || ticketId.trim().isEmpty()) {
            throw new InvalidTicketException("", "ticketId is empty");
        }
        ParkingTicket t = activeTickets.get(ticketId);
        if (t == null) throw new InvalidTicketException(ticketId);
        return t;
    }

    private void fire(java.util.function.Consumer<ParkingEventListener> event) {
        for (ParkingEventListener l : listeners) {
            try {
                event.accept(l);
            } catch (Exception e) {
                System.err.println("[ParkingService] listener " + l + " threw: " + e.getMessage());
            }
        }
    }

    private String nextTicketId()  { return String.format("TKT-%08d", ticketCounter.getAndIncrement()); }
    private String nextPaymentId() { return String.format("PAY-%08d", paymentCounter.getAndIncrement()); }
}
```

</details>

### `impl/LoggingEventListener.java`

<details>
<summary>Click to view impl/LoggingEventListener.java</summary>

```java
package com.you.lld.problems.parkinglot.impl;

import com.you.lld.problems.parkinglot.api.ParkingEventListener;
import com.you.lld.problems.parkinglot.model.ParkingTicket;
import com.you.lld.problems.parkinglot.model.Payment;
import com.you.lld.problems.parkinglot.model.Vehicle;
import com.you.lld.problems.parkinglot.model.VehicleType;

/**
 * Audit-style listener that prints every lifecycle event.
 * Useful for demos and debugging; in prod you'd replace with a metrics/logging sink.
 */
public class LoggingEventListener implements ParkingEventListener {

    @Override
    public void onVehicleEntered(ParkingTicket ticket) {
        System.out.println("[event] entered: " + ticket.getVehicle().getLicenseNumber()
            + " -> " + ticket.getParkingSpace().getSpaceId()
            + " (ticket " + ticket.getTicketId() + ")");
    }

    @Override
    public void onVehicleExited(ParkingTicket ticket, Payment payment) {
        System.out.println("[event] exited: " + ticket.getVehicle().getLicenseNumber()
            + " from " + ticket.getParkingSpace().getSpaceId()
            + " paid " + payment.getAmount()
            + " via " + payment.getPaymentMethod());
    }

    @Override
    public void onLotFull(Vehicle vehicle, VehicleType vehicleType) {
        System.out.println("[event] lot full for vehicle type " + vehicleType
            + " (vehicle " + (vehicle != null ? vehicle.getLicenseNumber() : "?") + ")");
    }
}
```

</details>

### `impl/NearestSpaceAllocationStrategy.java`

<details>
<summary>Click to view impl/NearestSpaceAllocationStrategy.java</summary>

```java
package com.you.lld.problems.parkinglot.impl;

import com.you.lld.problems.parkinglot.api.SpaceAllocationStrategy;
import com.you.lld.problems.parkinglot.model.ParkingSpace;
import com.you.lld.problems.parkinglot.model.SpaceType;
import com.you.lld.problems.parkinglot.model.Vehicle;
import com.you.lld.problems.parkinglot.model.VehicleType;

import java.util.Arrays;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Allocation strategy that picks the smallest-compatible space on the lowest floor.
 *
 * Per-vehicle-type preference list (tried in order):
 *   MOTORCYCLE  -> MOTORCYCLE, COMPACT, LARGE
 *   CAR         -> COMPACT, LARGE
 *   TRUCK / BUS -> LARGE
 *
 * Disabled-permit holders get DISABLED prepended to their list so they
 * always prefer reserved spaces over general ones.
 *
 * Tie-break within a space-type bucket: lowest floorNumber, then spaceId.
 */
public class NearestSpaceAllocationStrategy implements SpaceAllocationStrategy {

    private static final Map<VehicleType, List<SpaceType>> PREFERENCE;

    static {
        PREFERENCE = new HashMap<>();
        PREFERENCE.put(VehicleType.MOTORCYCLE,
            Arrays.asList(SpaceType.MOTORCYCLE, SpaceType.COMPACT, SpaceType.LARGE));
        PREFERENCE.put(VehicleType.CAR,
            Arrays.asList(SpaceType.COMPACT, SpaceType.LARGE));
        PREFERENCE.put(VehicleType.TRUCK,
            Arrays.asList(SpaceType.LARGE));
        PREFERENCE.put(VehicleType.BUS,
            Arrays.asList(SpaceType.LARGE));
    }

    @Override
    public Optional<ParkingSpace> selectSpace(List<ParkingSpace> availableSpaces, Vehicle vehicle) {
        if (availableSpaces == null || availableSpaces.isEmpty() || vehicle == null) {
            return Optional.empty();
        }

        List<SpaceType> prefs = PREFERENCE.get(vehicle.getVehicleType());
        if (prefs == null) return Optional.empty();

        if (vehicle.hasDisabledPermit()) {
            Optional<ParkingSpace> reserved = pickFromType(availableSpaces, SpaceType.DISABLED);
            if (reserved.isPresent()) return reserved;
        }

        for (SpaceType preferred : prefs) {
            Optional<ParkingSpace> picked = pickFromType(availableSpaces, preferred);
            if (picked.isPresent()) return picked;
        }
        return Optional.empty();
    }

    private Optional<ParkingSpace> pickFromType(List<ParkingSpace> spaces, SpaceType type) {
        return spaces.stream()
            .filter(s -> s.getSpaceType() == type)
            .min(Comparator.comparingInt(ParkingSpace::getFloorNumber)
                .thenComparing(ParkingSpace::getSpaceId));
    }

    @Override
    public String getDescription() {
        return "Nearest-fit allocation: smallest compatible space, lowest floor. " +
               "Disabled-permit vehicles get DISABLED spaces first.";
    }
}
```

</details>

### `impl/SimplePaymentProcessor.java`

<details>
<summary>Click to view impl/SimplePaymentProcessor.java</summary>

```java
package com.you.lld.problems.parkinglot.impl;

import com.you.lld.common.Money;
import com.you.lld.problems.parkinglot.api.PaymentProcessor;
import com.you.lld.problems.parkinglot.api.exceptions.PaymentProcessingException;
import com.you.lld.problems.parkinglot.api.exceptions.RefundException;
import com.you.lld.problems.parkinglot.model.Payment;
import com.you.lld.problems.parkinglot.model.PaymentMethod;

import java.math.BigDecimal;
import java.util.EnumSet;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

/**
 * In-memory simulation of a payment gateway.
 *
 * Records every processed payment so refunds can verify the original txn
 * exists. In production this would wrap Stripe / Razorpay / Adyen SDKs.
 *
 * Thread-safe: supportedMethods is immutable after construction;
 * processedPayments is a ConcurrentHashMap.
 */
public class SimplePaymentProcessor implements PaymentProcessor {

    private final Set<PaymentMethod> supportedMethods;
    private final Map<PaymentMethod, BigDecimal> transactionFeeRates;
    private final Map<String, Payment> processedPayments = new ConcurrentHashMap<>();

    public SimplePaymentProcessor() {
        this.supportedMethods = EnumSet.allOf(PaymentMethod.class);
        this.transactionFeeRates = new HashMap<>();
        this.transactionFeeRates.put(PaymentMethod.CASH, BigDecimal.ZERO);
        this.transactionFeeRates.put(PaymentMethod.CREDIT_CARD, new BigDecimal("0.025"));
        this.transactionFeeRates.put(PaymentMethod.DEBIT_CARD, new BigDecimal("0.015"));
        this.transactionFeeRates.put(PaymentMethod.MOBILE_PAYMENT, new BigDecimal("0.020"));
    }

    public SimplePaymentProcessor(Set<PaymentMethod> supportedMethods,
                                  Map<PaymentMethod, BigDecimal> transactionFeeRates) {
        Objects.requireNonNull(supportedMethods, "supportedMethods");
        Objects.requireNonNull(transactionFeeRates, "transactionFeeRates");
        if (supportedMethods.isEmpty())
            throw new IllegalArgumentException("at least one supported method required");
        this.supportedMethods = EnumSet.copyOf(supportedMethods);
        this.transactionFeeRates = new HashMap<>(transactionFeeRates);
    }

    @Override
    public boolean processPayment(Payment payment) throws PaymentProcessingException {
        Objects.requireNonNull(payment, "payment");
        if (!supportsPaymentMethod(payment.getPaymentMethod())) {
            throw new PaymentProcessingException("unsupported payment method: " + payment.getPaymentMethod());
        }
        if (payment.getAmount() == null || payment.getAmount().isNegative()) {
            throw new PaymentProcessingException("invalid amount");
        }
        processedPayments.put(payment.getPaymentId(), payment);
        return true;
    }

    @Override
    public boolean refundPayment(Payment payment) throws RefundException {
        Objects.requireNonNull(payment, "payment");
        if (!processedPayments.containsKey(payment.getPaymentId())) {
            throw new RefundException("payment not found: " + payment.getPaymentId());
        }
        if (!payment.isSuccessful()) {
            throw new RefundException("can only refund COMPLETED payments; was " + payment.getStatus());
        }
        return true;
    }

    @Override
    public boolean supportsPaymentMethod(PaymentMethod paymentMethod) {
        return paymentMethod != null && supportedMethods.contains(paymentMethod);
    }

    @Override
    public Money getTransactionFee(Money amount, PaymentMethod paymentMethod) {
        Objects.requireNonNull(amount, "amount");
        Objects.requireNonNull(paymentMethod, "paymentMethod");
        if (!supportsPaymentMethod(paymentMethod)) {
            return Money.ofMinor(0, amount.currency());
        }
        BigDecimal rate = transactionFeeRates.getOrDefault(paymentMethod, BigDecimal.ZERO);
        int basisPoints = rate.multiply(new BigDecimal("10000")).intValue();
        return amount.percent(basisPoints);
    }

    public Set<PaymentMethod> getSupportedMethods() {
        return EnumSet.copyOf(supportedMethods);
    }

    public int getProcessedPaymentCount() {
        return processedPayments.size();
    }
}
```

</details>

## Run Demo

```bash
mvn -q compile exec:java -Dexec.mainClass="com.you.lld.problems.parkinglot.impl.ParkingLotDemo"
```
