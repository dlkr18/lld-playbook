package com.you.lld.problems.bookmyshow.model;

public class Seat {
    private final String id;
    private final String seatNumber;
    private final SeatType type;
    private final double price;

    public Seat(String id, String seatNumber, SeatType type, double price) {
        this.id = id;
        this.seatNumber = seatNumber;
        this.type = type;
        this.price = price;
    }

    public String getId() { return id; }
    public String getSeatNumber() { return seatNumber; }
    public SeatType getType() { return type; }
    public double getPrice() { return price; }

    @Override
    public String toString() {
        return "Seat{" +
                "id='" + id + '\'' +
                ", seatNumber='" + seatNumber + '\'' +
                ", type=" + type +
                ", price=" + price +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Seat seat = (Seat) o;
        return id.equals(seat.id);
    }

    @Override
    public int hashCode() {
        return id.hashCode();
    }
}


