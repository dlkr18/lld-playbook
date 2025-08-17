package com.you.lld.inventory.api;

import com.you.lld.inventory.model.*;

import java.util.List;

/**
 * Order orchestration service that coordinates inventory, payment, and fulfillment.
 * Handles the complete order lifecycle from placement to delivery.
 */
public interface OrderService {
  
  /**
   * Places an order, validates inventory, creates reservations, and initiates payment.
   * Returns order with CREATED status if successful.
   */
  Order placeOrder(UserId userId, List<OrderLineItem> items, Address deliveryAddress, PaymentMethod paymentMethod);
  
  /**
   * Processes payment and confirms order if successful. Updates inventory reservations.
   */
  Order confirmPayment(OrderId orderId, String gatewayTransactionId);
  
  /**
   * Cancels an order, releases inventory reservations, and initiates refund if needed.
   */
  Order cancelOrder(OrderId orderId, String reason);
  
  /**
   * Updates order status during fulfillment (picking, packing, dispatch, delivery).
   */
  Order updateOrderStatus(OrderId orderId, OrderStatus newStatus);
  
  /**
   * Gets order details including current status and line items.
   */
  Order getOrder(OrderId orderId);
  
  /**
   * Gets all orders for a user with optional status filter.
   */
  List<Order> getUserOrders(UserId userId, OrderStatus statusFilter);
  
  /**
   * Checks product availability at nearest warehouse for given delivery address.
   */
  boolean checkAvailability(SkuId skuId, long quantity, Address deliveryAddress);
  
  /**
   * Gets estimated delivery time for an address based on warehouse proximity.
   */
  DeliveryEstimate getDeliveryEstimate(Address deliveryAddress);
}
