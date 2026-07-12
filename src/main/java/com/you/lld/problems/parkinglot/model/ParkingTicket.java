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
