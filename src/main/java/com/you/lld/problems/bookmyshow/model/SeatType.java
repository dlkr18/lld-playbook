package com.you.lld.problems.bookmyshow.model;

public enum SeatType {
    REGULAR(100.0),
    PREMIUM(200.0),
    VIP(300.0),
    RECLINER(500.0);

    private final double basePrice;

    SeatType(double basePrice) {
        this.basePrice = basePrice;
    }

    public double getBasePrice() {
        return basePrice;
    }
}

