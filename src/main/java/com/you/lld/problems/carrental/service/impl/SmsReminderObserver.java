package com.you.lld.problems.carrental.service.impl;

import com.you.lld.problems.carrental.model.Reservation;
import com.you.lld.problems.carrental.service.ReservationObserver;

/**
 * Sends (here: prints) terse SMS reminders. Only reacts to the two events that
 * warrant a text — booking confirmation and a return reminder at pickup —
 * demonstrating that an observer can subscribe to a subset of the lifecycle via
 * the interface's default methods. Stateless / thread-safe.
 */
public final class SmsReminderObserver implements ReservationObserver {

    @Override
    public void onReserved(Reservation r) {
        System.out.println("  [SMS] Hi " + r.getCustomer().getName() + ", booking "
                + r.getId() + " confirmed for " + r.getPeriod().getPickup() + ".");
    }

    @Override
    public void onPickedUp(Reservation r) {
        System.out.println("  [SMS] Reminder: return " + r.getCar().getLicensePlate()
                + " by " + r.getPeriod().getDropoff() + " to avoid late fees.");
    }
}
