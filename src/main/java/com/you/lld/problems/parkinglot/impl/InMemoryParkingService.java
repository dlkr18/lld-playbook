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
