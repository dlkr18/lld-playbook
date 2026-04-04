package com.you.lld.problems.bookmyshow.model;

import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

/**
 * Booking entity with State pattern + Observer pattern.
 *
 * State pattern: Booking delegates confirm/cancel/expire to its BookingState.
 *     State objects validate transitions and set internal fields; side effects
 *     (seat release, refund) are handled by the service layer.
 *
 * Observer pattern: Registered BookingObservers are notified on every state change.
 *     Notification formatting lives in BookingNotifier (SRP), not here.
 */
public class Booking {
    private final String id;
    private final String userId;
    private final String showId;
    private final List<Seat> seats;
    private final double totalAmount;
    private final LocalDateTime bookingTime;

    private BookingState state;
    private Payment payment;
    private LocalDateTime confirmedAt;
    private LocalDateTime cancelledAt;

    private final List<BookingObserver> observers = new CopyOnWriteArrayList<>();

    public Booking(String id, String userId, String showId, List<Seat> seats,
                   double totalAmount, LocalDateTime bookingTime) {
        this.id = id;
        this.userId = userId;
        this.showId = showId;
        this.seats = seats;
        this.totalAmount = totalAmount;
        this.bookingTime = bookingTime;
        this.state = PendingState.INSTANCE;
    }

    // ─── State transitions (delegate to current state) ────────────────

    public void confirm(Payment payment) {
        this.state = this.state.confirm(this, payment);
        notifyObservers();
    }

    public void cancel() {
        this.state = this.state.cancel(this);
        notifyObservers();
    }

    public void expire() {
        this.state = this.state.expire(this);
        notifyObservers();
    }

    // ─── Observer ─────────────────────────────────────────────────────

    public void addObserver(BookingObserver observer) {
        observers.add(observer);
    }

    public void removeObserver(BookingObserver observer) {
        observers.remove(observer);
    }

    private void notifyObservers() {
        for (BookingObserver o : observers) {
            o.update(this);
        }
    }

    // ─── Package-private setters for State objects ────────────────────

    void setPaymentInternal(Payment payment)            { this.payment = payment; }
    void setConfirmedAtInternal(LocalDateTime at)        { this.confirmedAt = at; }
    void setCancelledAtInternal(LocalDateTime at)        { this.cancelledAt = at; }

    // ─── Getters ──────────────────────────────────────────────────────

    public String getId()                { return id; }
    public String getUserId()            { return userId; }
    public String getShowId()            { return showId; }
    public List<Seat> getSeats()         { return seats; }
    public double getTotalAmount()       { return totalAmount; }
    public LocalDateTime getBookingTime(){ return bookingTime; }
    public BookingStatus getStatus()     { return state.getStatus(); }
    public Payment getPayment()          { return payment; }
    public LocalDateTime getConfirmedAt(){ return confirmedAt; }
    public LocalDateTime getCancelledAt(){ return cancelledAt; }

    @Override
    public String toString() {
        return "Booking{id='" + id + "', showId='" + showId +
                "', seats=" + seats.size() +
                ", amount=" + String.format("%.2f", totalAmount) +
                ", status=" + getStatus() + '}';
    }
}
