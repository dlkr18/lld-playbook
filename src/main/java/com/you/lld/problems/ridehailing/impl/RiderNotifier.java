package com.you.lld.problems.ridehailing.impl;

import com.you.lld.problems.ridehailing.api.NotificationService;
import com.you.lld.problems.ridehailing.model.Trip;
import com.you.lld.problems.ridehailing.model.TripObserver;

/**
 * Observer that formats and delivers rider-appropriate notifications
 * when a Trip they're part of changes state.
 * Keeps Rider entity pure (data only) -- SRP.
 */
public class RiderNotifier implements TripObserver {
    private final String riderId;
    private final NotificationService ns;

    public RiderNotifier(String riderId, NotificationService ns) {
        this.riderId = riderId;
        this.ns = ns;
    }

    @Override
    public void update(Trip trip) {
        String msg;
        switch (trip.getStatus()) {
            case ACCEPTED:
                msg = "Driver is on the way! Heading to " + trip.getPickupLocation();
                break;
            case IN_PROGRESS:
                msg = "Trip started. Heading to " + trip.getDropoffLocation();
                break;
            case COMPLETED:
                msg = "Trip completed. Fare: $" + String.format("%.2f", trip.getActualFare());
                break;
            case CANCELLED:
                String feeMsg = trip.getCancellationFee() > 0
                        ? " Fee: $" + String.format("%.2f", trip.getCancellationFee()) : "";
                msg = "Trip cancelled." + feeMsg;
                break;
            default:
                return;
        }
        ns.notify(riderId, msg);
    }
}
