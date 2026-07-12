package com.you.lld.problems.carrental.service.impl;

import com.you.lld.problems.carrental.model.Reservation;
import com.you.lld.problems.carrental.service.ReservationObserver;

/**
 * Sends (here: prints) email confirmations and receipts. Stands in for an email
 * gateway. Stateless, so a single instance is safe to share across threads.
 */
public final class EmailNotificationObserver implements ReservationObserver {

    @Override
    public void onReserved(Reservation r) {
        System.out.println("  [EMAIL -> " + r.getCustomer().getEmail() + "] Booking confirmed: "
                + r.getCar() + " for " + r.getPeriod() + " (est. " + r.getBaseCost() + ")");
    }

    @Override
    public void onPickedUp(Reservation r) {
        System.out.println("  [EMAIL -> " + r.getCustomer().getEmail() + "] Rental started for "
                + r.getCar() + ". Please return by " + r.getPeriod().getDropoff() + ".");
    }

    @Override
    public void onReturned(Reservation r) {
        System.out.println("  [EMAIL -> " + r.getCustomer().getEmail() + "] Thanks! Final charges: "
                + r.getCharges());
    }

    @Override
    public void onCancelled(Reservation r) {
        System.out.println("  [EMAIL -> " + r.getCustomer().getEmail() + "] Booking " + r.getId()
                + " cancelled.");
    }
}
