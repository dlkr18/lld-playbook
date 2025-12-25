package com.you.lld.problems.inventory.model;

public enum OrderStatus {
  CREATED,         // Order placed, payment pending
  PAYMENT_PENDING, // Awaiting payment confirmation
  CONFIRMED,       // Payment successful, inventory reserved
  PICKING,         // Being picked from warehouse
  PACKED,          // Ready for dispatch
  OUT_FOR_DELIVERY,// With delivery partner
  DELIVERED,       // Successfully delivered
  CANCELLED,       // Cancelled by user or system
  FAILED           // Failed due to payment/inventory issues
}
