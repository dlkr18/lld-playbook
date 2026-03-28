package com.you.lld.problems.ridehailing.impl;

import com.you.lld.problems.ridehailing.api.NotificationService;
import com.you.lld.problems.ridehailing.model.Trip;
import com.you.lld.problems.ridehailing.model.TripObserver;

/**
 * Observer that formats and delivers driver-appropriate notifications
 * when a Trip they've accepted changes state.
 * Keeps Driver entity pure (data only) -- SRP.
 */
public class DriverNotifier implements TripObserver {
    private final String driverId;
    private final NotificationService ns;

    public DriverNotifier(String driverId, NotificationService ns) {
        this.driverId = driverId;
        this.ns = ns;
    }

    @Override
    public void update(Trip trip) {
        String msg;
        switch (trip.getStatus()) {
            case IN_PROGRESS:
                msg = "Trip " + trip.getTripId() + " started. Navigate to "
                        + trip.getDropoffLocation();
                break;
            case COMPLETED:
                msg = "Trip " + trip.getTripId() + " completed. Earnings: $"
                        + String.format("%.2f", trip.getActualFare());
                break;
            case CANCELLED:
                msg = "Trip " + trip.getTripId() + " cancelled by "
                        + (driverId.equals(trip.getCancelledBy()) ? "you" : "rider") + ".";
                break;
            default:
                return;
        }
        ns.notify(driverId, msg);
    }
}
