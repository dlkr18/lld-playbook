package com.you.lld.inventory.impl;

import com.you.lld.common.Money;
import com.you.lld.inventory.api.InventoryService;
import com.you.lld.inventory.api.OrderService;
import com.you.lld.inventory.model.*;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

/**
 * In-memory implementation orchestrating inventory, payments, and order fulfillment.
 * Simulates realistic e-commerce flows with proper error handling.
 */
public final class InMemoryOrderService implements OrderService {
  
  private final InventoryService inventoryService;
  private final ConcurrentHashMap<OrderId, Order> orders = new ConcurrentHashMap<>();
  private final ConcurrentHashMap<PaymentId, Payment> payments = new ConcurrentHashMap<>();
  private final ConcurrentHashMap<UserId, User> users = new ConcurrentHashMap<>();
  private final ConcurrentHashMap<SkuId, Product> products = new ConcurrentHashMap<>();
  private final List<WarehouseId> warehouses = Arrays.asList(
    WarehouseId.of("BLR-A"), WarehouseId.of("BLR-B"), WarehouseId.of("MUM-A"), WarehouseId.of("DEL-A")
  );
  
  public InMemoryOrderService(InventoryService inventoryService) {
    this.inventoryService = Objects.requireNonNull(inventoryService);
  }
  
  // For testing - add users and products
  public void addUser(User user) { users.put(user.userId(), user); }
  public void addProduct(Product product) { products.put(product.skuId(), product); }
  
  @Override
  public Order placeOrder(UserId userId, List<OrderLineItem> items, Address deliveryAddress, PaymentMethod paymentMethod) {
    User user = users.get(userId);
    if (user == null || !user.isActive()) {
      throw new IllegalArgumentException("Invalid or inactive user");
    }
    
    if (items.isEmpty()) {
      throw new IllegalArgumentException("Order must have at least one item");
    }
    
    // Validate all products exist and are active
    for (OrderLineItem item : items) {
      Product product = products.get(item.skuId());
      if (product == null || !product.isActive()) {
        throw new IllegalArgumentException("Product not available: " + item.skuId());
      }
    }
    
    // Find nearest warehouse
    WarehouseId nearestWarehouse = findNearestWarehouse(deliveryAddress);
    
    // Calculate totals
    Money subtotal = items.stream()
      .map(OrderLineItem::lineTotal)
      .reduce(Money.ofMinor(0, items.get(0).unitPrice().currency()), Money::plus);
    
    Money deliveryFee = calculateDeliveryFee(deliveryAddress, subtotal);
    Money taxes = subtotal.percent(1800); // 18% GST
    Money total = subtotal.plus(deliveryFee).plus(taxes);
    
    OrderId orderId = OrderId.random();
    Order order = new Order(
      orderId, userId, items, deliveryAddress, OrderStatus.CREATED,
      subtotal, deliveryFee, taxes, total,
      LocalDateTime.now(), calculateDeliveryTime(deliveryAddress), nearestWarehouse
    );
    
    orders.put(orderId, order);
    return order;
  }
  
  @Override
  public Order confirmPayment(OrderId orderId, String gatewayTransactionId) {
    Order order = orders.get(orderId);
    if (order == null) {
      throw new IllegalArgumentException("Order not found");
    }
    
    if (order.status() != OrderStatus.CREATED) {
      throw new IllegalStateException("Order not in CREATED state");
    }
    
    try {
      // Reserve inventory for all items
      List<OrderLineItem> reservedItems = new ArrayList<>();
      for (OrderLineItem item : order.lineItems()) {
        ReservationId reservationId = inventoryService.reserve(
          item.skuId(), order.assignedWarehouse(), item.quantity(), "order:" + orderId
        );
        reservedItems.add(item.withReservation(reservationId));
      }
      
      // Create payment record
      PaymentId paymentId = PaymentId.random();
      Payment payment = new Payment(
        paymentId, orderId, order.userId(), order.total(),
        PaymentMethod.UPI, PaymentStatus.SUCCESS, gatewayTransactionId,
        LocalDateTime.now(), LocalDateTime.now()
      );
      payments.put(paymentId, payment);
      
      // Update order with reservations and confirmed status
      Order confirmedOrder = new Order(
        order.orderId(), order.userId(), reservedItems, order.deliveryAddress(),
        OrderStatus.CONFIRMED, order.subtotal(), order.deliveryFee(), order.taxes(), order.total(),
        order.createdAt(), order.expectedDeliveryAt(), order.assignedWarehouse()
      );
      
      orders.put(orderId, confirmedOrder);
      return confirmedOrder;
      
    } catch (IllegalArgumentException e) {
      // Insufficient inventory - mark order as failed
      Order failedOrder = new Order(
        order.orderId(), order.userId(), order.lineItems(), order.deliveryAddress(),
        OrderStatus.FAILED, order.subtotal(), order.deliveryFee(), order.taxes(), order.total(),
        order.createdAt(), order.expectedDeliveryAt(), order.assignedWarehouse()
      );
      orders.put(orderId, failedOrder);
      throw new IllegalStateException("Insufficient inventory for order: " + e.getMessage());
    }
  }
  
  @Override
  public Order cancelOrder(OrderId orderId, String reason) {
    Order order = orders.get(orderId);
    if (order == null) {
      throw new IllegalArgumentException("Order not found");
    }
    
    // Release any reservations
    for (OrderLineItem item : order.lineItems()) {
      if (item.isReserved()) {
        inventoryService.release(item.reservationId(), "order_cancelled:" + reason);
      }
    }
    
    Order cancelledOrder = new Order(
      order.orderId(), order.userId(), order.lineItems(), order.deliveryAddress(),
      OrderStatus.CANCELLED, order.subtotal(), order.deliveryFee(), order.taxes(), order.total(),
      order.createdAt(), order.expectedDeliveryAt(), order.assignedWarehouse()
    );
    
    orders.put(orderId, cancelledOrder);
    return cancelledOrder;
  }
  
  @Override
  public Order updateOrderStatus(OrderId orderId, OrderStatus newStatus) {
    Order order = orders.get(orderId);
    if (order == null) {
      throw new IllegalArgumentException("Order not found");
    }
    
    // For DELIVERED status, commit all reservations
    if (newStatus == OrderStatus.DELIVERED) {
      for (OrderLineItem item : order.lineItems()) {
        if (item.isReserved()) {
          inventoryService.commit(item.reservationId(), "order_delivered");
        }
      }
    }
    
    Order updatedOrder = new Order(
      order.orderId(), order.userId(), order.lineItems(), order.deliveryAddress(),
      newStatus, order.subtotal(), order.deliveryFee(), order.taxes(), order.total(),
      order.createdAt(), order.expectedDeliveryAt(), order.assignedWarehouse()
    );
    
    orders.put(orderId, updatedOrder);
    return updatedOrder;
  }
  
  @Override
  public Order getOrder(OrderId orderId) {
    Order order = orders.get(orderId);
    if (order == null) {
      throw new IllegalArgumentException("Order not found");
    }
    return order;
  }
  
  @Override
  public List<Order> getUserOrders(UserId userId, OrderStatus statusFilter) {
    return orders.values().stream()
      .filter(order -> order.userId().equals(userId))
      .filter(order -> statusFilter == null || order.status() == statusFilter)
      .sorted((o1, o2) -> o2.createdAt().compareTo(o1.createdAt())) // newest first
      .collect(Collectors.toList());
  }
  
  @Override
  public boolean checkAvailability(SkuId skuId, long quantity, Address deliveryAddress) {
    WarehouseId nearestWarehouse = findNearestWarehouse(deliveryAddress);
    try {
      StockSnapshot stock = inventoryService.getStock(skuId, nearestWarehouse);
      return stock.available() >= quantity;
    } catch (Exception e) {
      return false;
    }
  }
  
  @Override
  public DeliveryEstimate getDeliveryEstimate(Address deliveryAddress) {
    WarehouseId nearest = findNearestWarehouse(deliveryAddress);
    LocalDateTime now = LocalDateTime.now();
    LocalDateTime earliest = now.plusHours(2); // Express delivery
    LocalDateTime latest = now.plusDays(1); // Standard delivery
    
    return new DeliveryEstimate(nearest, earliest, latest, 15, true);
  }
  
  private WarehouseId findNearestWarehouse(Address address) {
    // Simplified: just return first warehouse
    // In real system, would use geospatial queries
    return warehouses.get(0);
  }
  
  private Money calculateDeliveryFee(Address address, Money subtotal) {
    // Free delivery above ₹500
    if (subtotal.compareTo(Money.ofMinor(50000, subtotal.currency())) >= 0) {
      return Money.ofMinor(0, subtotal.currency());
    }
    return Money.ofMinor(4000, subtotal.currency()); // ₹40 delivery fee
  }
  
  private LocalDateTime calculateDeliveryTime(Address address) {
    return LocalDateTime.now().plusHours(4); // 4-hour delivery window
  }
}
