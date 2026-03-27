package com.you.lld.problems.library.model;

import java.time.LocalDateTime;

/**
 * A member's request to borrow a book when all copies are currently unavailable.
 * Reservations are queued per ISBN and fulfilled FIFO on return.
 */
public class Reservation {
    private final String id;
    private final String memberId;
    private final String isbn;
    private final LocalDateTime createdAt;
    private ReservationStatus status;

    public Reservation(String id, String memberId, String isbn) {
        this.id = id;
        this.memberId = memberId;
        this.isbn = isbn;
        this.createdAt = LocalDateTime.now();
        this.status = ReservationStatus.WAITING;
    }

    public String getId() { return id; }
    public String getMemberId() { return memberId; }
    public String getIsbn() { return isbn; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public ReservationStatus getStatus() { return status; }
    public void setStatus(ReservationStatus status) { this.status = status; }

    @Override
    public String toString() {
        return "Reservation[" + id + ", member=" + memberId
                + ", isbn=" + isbn + ", status=" + status + "]";
    }
}
