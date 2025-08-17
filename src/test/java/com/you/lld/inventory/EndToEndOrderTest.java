package com.you.lld.inventory;

import com.you.lld.common.Money;
import com.you.lld.inventory.api.InventoryService;
import com.you.lld.inventory.api.OrderService;
import com.you.lld.inventory.impl.InMemoryInventoryService;
import com.you.lld.inventory.impl.InMemoryOrderService;
import com.you.lld.inventory.model.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Currency;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * End-to-end test covering complete order flow: user -> product -> inventory -> payment -> fulfillment.
 */
public class EndToEndOrderTest {
  
  private InventoryService inventoryService;
  private InMemoryOrderService orderService;
  private Currency inr;
  
  @BeforeEach
  void setup() {
    inventoryService = new InMemoryInventoryService();
    orderService = new InMemoryOrderService(inventoryService);
    inr = Currency.getInstance("INR");
    
    setupTestData();
  }
  
  private void setupTestData() {
    // Create warehouses and stock
    SkuId milk = SkuId.of("MILK-1L");
    SkuId bread = SkuId.of("BREAD-WHOLE-WHEAT");
    WarehouseId blrA = WarehouseId.of("BLR-A");
    
    inventoryService.receiveStock(milk, blrA, 100, "initial_stock");
    inventoryService.receiveStock(bread, blrA, 50, "initial_stock");
    
    // Create products
    Product milkProduct = new Product(
      milk, "Amul Milk 1L", "Fresh full cream milk", CategoryId.of("DAIRY"),
      Money.ofMinor(6000, inr), "Amul", ProductStatus.ACTIVE, true, 3
    );
    Product breadProduct = new Product(
      bread, "Whole Wheat Bread", "Healthy whole wheat bread", CategoryId.of("BAKERY"),
      Money.ofMinor(4500, inr), "Britannia", ProductStatus.ACTIVE, false, null
    );
    
    orderService.addProduct(milkProduct);
    orderService.addProduct(breadProduct);
    
    // Create user
    Address address = new Address(
      "123 MG Road", "Near Forum Mall", "Bangalore", "Karnataka", "560001", "India",
      12.9716, 77.5946, true
    );
    User user = new User(
      UserId.of("user123"), "john@example.com", "John Doe", "+91-9876543210",
      Arrays.asList(address), UserStatus.ACTIVE, LocalDateTime.now()
    );
    
    orderService.addUser(user);
  }
  
  @Test
  void completeOrderFlow_placeConfirmDeliver() {
    UserId userId = UserId.of("user123");
    SkuId milk = SkuId.of("MILK-1L");
    SkuId bread = SkuId.of("BREAD-WHOLE-WHEAT");
    
    // Check availability
    Address deliveryAddress = new Address(
      "456 Brigade Road", null, "Bangalore", "Karnataka", "560025", "India",
      12.9716, 77.5946, false
    );
    
    assertTrue(orderService.checkAvailability(milk, 2, deliveryAddress));
    assertTrue(orderService.checkAvailability(bread, 1, deliveryAddress));
    
    // Create order items
    List<OrderLineItem> items = Arrays.asList(
      new OrderLineItem(milk, "Amul Milk 1L", 2, Money.ofMinor(6000, inr), null),
      new OrderLineItem(bread, "Whole Wheat Bread", 1, Money.ofMinor(4500, inr), null)
    );
    
    // Place order
    Order order = orderService.placeOrder(userId, items, deliveryAddress, PaymentMethod.UPI);
    assertEquals(OrderStatus.CREATED, order.status());
    assertEquals(Money.ofMinor(16500, inr), order.subtotal()); // 60 + 45
    assertTrue(order.total().compareTo(order.subtotal()) > 0); // includes delivery + tax
    
    // Confirm payment
    Order confirmedOrder = orderService.confirmPayment(order.orderId(), "gateway_txn_123");
    assertEquals(order.orderId(), confirmedOrder.orderId());
    assertEquals(OrderStatus.CONFIRMED, confirmedOrder.status());
    
    // Verify inventory reservations
    for (OrderLineItem item : confirmedOrder.lineItems()) {
      assertTrue(item.isReserved(), "Item should be reserved: " + item.skuId());
    }
    
    // Check reduced availability
    assertEquals(98, inventoryService.getStock(milk, WarehouseId.of("BLR-A")).available());
    assertEquals(49, inventoryService.getStock(bread, WarehouseId.of("BLR-A")).available());
    
    // Update order through fulfillment stages
    Order pickingOrder = orderService.updateOrderStatus(order.orderId(), OrderStatus.PICKING);
    assertEquals(OrderStatus.PICKING, pickingOrder.status());
    
    Order packedOrder = orderService.updateOrderStatus(order.orderId(), OrderStatus.PACKED);
    assertEquals(OrderStatus.PACKED, packedOrder.status());
    
    Order deliveredOrder = orderService.updateOrderStatus(order.orderId(), OrderStatus.DELIVERED);
    assertEquals(OrderStatus.DELIVERED, deliveredOrder.status());
    
    // Verify inventory committed (on-hand reduced)
    assertEquals(98, inventoryService.getStock(milk, WarehouseId.of("BLR-A")).onHand());
    assertEquals(49, inventoryService.getStock(bread, WarehouseId.of("BLR-A")).onHand());
    
    // Verify user orders
    List<Order> userOrders = orderService.getUserOrders(userId, null);
    assertEquals(1, userOrders.size());
    assertEquals(OrderStatus.DELIVERED, userOrders.get(0).status());
  }
  
  @Test
  void orderCancellation_releasesInventory() {
    UserId userId = UserId.of("user123");
    SkuId milk = SkuId.of("MILK-1L");
    
    List<OrderLineItem> items = Arrays.asList(
      new OrderLineItem(milk, "Amul Milk 1L", 5, Money.ofMinor(6000, inr), null)
    );
    
    Address deliveryAddress = new Address(
      "789 Koramangala", null, "Bangalore", "Karnataka", "560034", "India",
      12.9352, 77.6245, false
    );
    
    // Place and confirm order
    Order order = orderService.placeOrder(userId, items, deliveryAddress, PaymentMethod.CREDIT_CARD);
    Order confirmedOrder = orderService.confirmPayment(order.orderId(), "gateway_txn_456");
    
    // Verify reservation
    assertEquals(95, inventoryService.getStock(milk, WarehouseId.of("BLR-A")).available());
    
    // Cancel order
    Order cancelledOrder = orderService.cancelOrder(order.orderId(), "user_requested");
    assertEquals(OrderStatus.CANCELLED, cancelledOrder.status());
    
    // Verify inventory released
    assertEquals(100, inventoryService.getStock(milk, WarehouseId.of("BLR-A")).available());
  }
  
  @Test
  void insufficientInventory_failsOrder() {
    UserId userId = UserId.of("user123");
    SkuId milk = SkuId.of("MILK-1L");
    
    List<OrderLineItem> items = Arrays.asList(
      new OrderLineItem(milk, "Amul Milk 1L", 150, Money.ofMinor(6000, inr), null) // More than available
    );
    
    Address deliveryAddress = new Address(
      "999 Test Address", null, "Bangalore", "Karnataka", "560001", "India",
      12.9716, 77.5946, false
    );
    
    Order order = orderService.placeOrder(userId, items, deliveryAddress, PaymentMethod.UPI);
    
    // Payment confirmation should fail due to insufficient inventory
    assertThrows(IllegalStateException.class, () -> 
      orderService.confirmPayment(order.orderId(), "gateway_txn_789")
    );
  }
}
