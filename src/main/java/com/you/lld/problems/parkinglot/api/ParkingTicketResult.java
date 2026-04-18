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
