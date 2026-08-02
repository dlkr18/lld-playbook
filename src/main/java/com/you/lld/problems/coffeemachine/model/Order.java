package com.you.lld.problems.coffeemachine.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * One purchase: selected beverage, what was paid, what is owed back.
 *
 * <p>An order now records {@code amountPaid} and {@code changeDue}. Previously
 * payment was compared against the price and the result thrown away — so an
 * overpayment was simply kept, and a failed payment left an order that had already
 * been marked COMPLETED.
 */
public class Order {

    private final String id;
    private final Beverage beverage;
    private final LocalDateTime orderTime;
    private OrderStatus status;
    private BigDecimal amountPaid = BigDecimal.ZERO;
    private BigDecimal changeDue = BigDecimal.ZERO;

    public Order(String id, Beverage beverage) {
        this.id = id;
        this.beverage = beverage;
        this.orderTime = LocalDateTime.now();
        this.status = OrderStatus.PENDING;
    }

    public void markDispensing() {
        this.status = OrderStatus.IN_PROGRESS;
    }

    public void complete() {
        this.status = OrderStatus.COMPLETED;
    }

    public void fail() {
        this.status = OrderStatus.FAILED;
    }

    public void recordPayment(BigDecimal paid, BigDecimal change) {
        this.amountPaid = paid;
        this.changeDue = change;
    }

    public String getId() {
        return id;
    }

    public Beverage getBeverage() {
        return beverage;
    }

    public OrderStatus getStatus() {
        return status;
    }

    public LocalDateTime getOrderTime() {
        return orderTime;
    }

    public BigDecimal getAmountPaid() {
        return amountPaid;
    }

    /** Change owed to the customer — also the refund amount when an order fails. */
    public BigDecimal getChangeDue() {
        return changeDue;
    }

    @Override
    public String toString() {
        return "Order{id='" + id + "', beverage=" + beverage.getName() + ", status=" + status
                + ", paid=" + amountPaid + ", change=" + changeDue + "}";
    }
}
