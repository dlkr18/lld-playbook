package com.you.lld.problems.inventory.service;

import com.you.lld.problems.inventory.model.*;

import java.util.List;

/**
 * Order orchestration coordinating inventory, payment, and fulfillment.
 */
public interface OrderService {

    Order placeOrder(UserId userId, List<OrderLineItem> items, Address deliveryAddress, PaymentMethod paymentMethod);

    Order confirmPayment(OrderId orderId, String gatewayTransactionId);

    Order cancelOrder(OrderId orderId, String reason);

    Order updateOrderStatus(OrderId orderId, OrderStatus newStatus);

    Order getOrder(OrderId orderId);

    List<Order> getUserOrders(UserId userId, OrderStatus statusFilter);

    boolean checkAvailability(SkuId skuId, long quantity, Address deliveryAddress);

    DeliveryEstimate getDeliveryEstimate(Address deliveryAddress);
}
