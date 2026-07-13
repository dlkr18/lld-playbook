package com.you.lld.problems.ministore.model;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * A placed order — always for a single store. Status is a small state machine: it is
 * born PENDING and moves to exactly one terminal state; illegal transitions throw, so
 * a confirmed order can never be silently re-cancelled or double-confirmed.
 */
public final class Order {

    private final String id;
    private final String storeId;
    private final String customerId;
    private final List<OrderLine> lines;
    private final Money total;
    private OrderStatus status;
    private String transactionId;   // set on confirmation

    public Order(String id, String storeId, String customerId, List<OrderLine> lines, Money total) {
        this.id = id;
        this.storeId = storeId;
        this.customerId = customerId;
        this.lines = Collections.unmodifiableList(new ArrayList<OrderLine>(lines));
        this.total = total;
        this.status = OrderStatus.PENDING;
    }

    public void confirm(String transactionId) {
        if (status != OrderStatus.PENDING) {
            throw new IllegalStateException("cannot confirm an order in state " + status);
        }
        this.transactionId = transactionId;
        this.status = OrderStatus.CONFIRMED;
    }

    public void cancel() {
        if (status == OrderStatus.CONFIRMED) {
            throw new IllegalStateException("cannot cancel a CONFIRMED order");
        }
        this.status = OrderStatus.CANCELLED;
    }

    public String id() { return id; }
    public String storeId() { return storeId; }
    public String customerId() { return customerId; }
    public List<OrderLine> lines() { return lines; }
    public Money total() { return total; }
    public OrderStatus status() { return status; }
    public String transactionId() { return transactionId; }

    @Override
    public String toString() {
        return "Order{" + id + ", store=" + storeId + ", " + status + ", total=" + total
            + ", lines=" + lines.size() + (transactionId != null ? ", txn=" + transactionId : "") + "}";
    }
}
