package com.you.lld.problems.fooddelivery.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

/**
 * Order entity with State pattern + Observer pattern.
 *
 * State pattern: delegates confirm/prepare/ready/pickUp/deliver/cancel to its OrderState.
 *     States validate transitions; side effects (partner release) handled by service.
 *
 * Observer pattern: registered OrderObservers notified on every state change.
 *     Notification formatting lives in OrderNotifier (SRP), not here.
 */
public class Order {

    private final String orderId;
    private final String customerId;
    private final String restaurantId;
    private final Address deliveryAddress;
    private final List<OrderItem> items;
    private final LocalDateTime orderedAt;

    private OrderState state;
    private String deliveryPartnerId;
    private double subtotal;
    private double deliveryFee;
    private double tax;
    private double totalAmount;
    private LocalDateTime estimatedDeliveryTime;
    private LocalDateTime actualDeliveryTime;
    private String specialInstructions;

    private final List<OrderObserver> observers = new CopyOnWriteArrayList<>();

    public Order(String orderId, String customerId, String restaurantId, Address deliveryAddress) {
        this.orderId = orderId;
        this.customerId = customerId;
        this.restaurantId = restaurantId;
        this.deliveryAddress = deliveryAddress;
        this.items = new ArrayList<>();
        this.orderedAt = LocalDateTime.now();
        this.state = PlacedOrderState.INSTANCE;
    }

    // ─── State transitions (delegate to current state) ────────────────

    public void confirm()       { this.state = this.state.confirm(this);        notifyObservers(); }
    public void startPreparing(){ this.state = this.state.startPreparing(this); notifyObservers(); }
    public void markReady()     { this.state = this.state.markReady(this);      notifyObservers(); }
    public void pickUp()        { this.state = this.state.pickUp(this);         notifyObservers(); }

    public void deliver() {
        this.state = this.state.deliver(this);
        this.actualDeliveryTime = LocalDateTime.now();
        notifyObservers();
    }

    public void cancel() {
        this.state = this.state.cancel(this);
        notifyObservers();
    }

    // ─── Observer ─────────────────────────────────────────────────────

    public void addObserver(OrderObserver observer)    { observers.add(observer); }
    public void removeObserver(OrderObserver observer)  { observers.remove(observer); }

    private void notifyObservers() {
        for (OrderObserver o : observers) { o.update(this); }
    }

    // ─── Items & pricing ──────────────────────────────────────────────

    public void addItem(OrderItem item) {
        items.add(item);
        recalculate();
    }

    void recalculate() {
        this.subtotal = items.stream().mapToDouble(OrderItem::getTotal).sum();
        this.deliveryFee = subtotal > 50 ? 0 : 5.0;
        this.tax = subtotal * 0.08;
        this.totalAmount = subtotal + deliveryFee + tax;
    }

    // ─── Getters ──────────────────────────────────────────────────────

    public String getOrderId()                  { return orderId; }
    public String getCustomerId()               { return customerId; }
    public String getRestaurantId()             { return restaurantId; }
    public List<OrderItem> getItems()           { return Collections.unmodifiableList(items); }
    public OrderStatus getStatus()              { return state.getStatus(); }
    public String getDeliveryPartnerId()        { return deliveryPartnerId; }
    public Address getDeliveryAddress()         { return deliveryAddress; }
    public double getSubtotal()                 { return subtotal; }
    public double getDeliveryFee()              { return deliveryFee; }
    public double getTax()                      { return tax; }
    public double getTotalAmount()              { return totalAmount; }
    public LocalDateTime getOrderedAt()         { return orderedAt; }
    public LocalDateTime getEstimatedDeliveryTime() { return estimatedDeliveryTime; }
    public LocalDateTime getActualDeliveryTime()    { return actualDeliveryTime; }
    public String getSpecialInstructions()      { return specialInstructions; }

    // ─── Setters used by service layer ────────────────────────────────

    public void setDeliveryPartnerId(String id) { this.deliveryPartnerId = id; }
    public void setEstimatedDeliveryTime(LocalDateTime t) { this.estimatedDeliveryTime = t; }
    public void setSpecialInstructions(String s) { this.specialInstructions = s; }

    @Override
    public String toString() {
        return "Order{id='" + orderId + "', status=" + getStatus()
            + ", items=" + items.size()
            + ", total=$" + String.format("%.2f", totalAmount) + '}';
    }
}
