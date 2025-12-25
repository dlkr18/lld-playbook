package com.you.lld.problems.fooddelivery;
import com.you.lld.problems.fooddelivery.api.*;
import com.you.lld.problems.fooddelivery.impl.*;
import com.you.lld.problems.fooddelivery.model.*;
import java.util.*;

public class FoodDeliveryDemo {
    public static void main(String[] args) {
        System.out.println("=== Food Delivery System Demo ===\n");
        
        FoodDeliveryService service = new InMemoryFoodDeliveryService();
        
        // Register Restaurant
        Address restaurantAddr = new Address("123 Main St", "NYC", "NY", "10001");
        restaurantAddr.setLatitude(40.7128);
        restaurantAddr.setLongitude(-74.0060);
        Restaurant restaurant = service.registerRestaurant("Pizza Palace", restaurantAddr);
        System.out.println("✅ Restaurant registered: " + restaurant.getName());
        
        // Add Menu Items
        MenuItem pizza = new MenuItem("ITEM001", "Margherita Pizza", 12.99);
        pizza.setCategory("Pizza");
        pizza.setVegetarian(true);
        service.addMenuItem(restaurant.getRestaurantId(), pizza);
        
        MenuItem pasta = new MenuItem("ITEM002", "Alfredo Pasta", 10.99);
        pasta.setCategory("Pasta");
        service.addMenuItem(restaurant.getRestaurantId(), pasta);
        
        System.out.println("✅ Menu items added: " + restaurant.getMenu().size());
        
        // Register Customer
        Customer customer = service.registerCustomer("John Doe", "john@example.com", "555-0100");
        Address deliveryAddr = new Address("456 Park Ave", "NYC", "NY", "10002");
        deliveryAddr.setLatitude(40.7589);
        deliveryAddr.setLongitude(-73.9851);
        customer.addAddress(deliveryAddr);
        System.out.println("✅ Customer registered: " + customer.getName());
        
        // Place Order
        List<OrderItem> items = new ArrayList<>();
        items.add(new OrderItem("ITEM001", pizza.getName(), pizza.getPrice(), 2));
        items.add(new OrderItem("ITEM002", pasta.getName(), pasta.getPrice(), 1));
        
        Order order = service.placeOrder(
            customer.getCustomerId(),
            restaurant.getRestaurantId(),
            items,
            deliveryAddr
        );
        
        System.out.println("\n✅ Order placed successfully!");
        System.out.println("   Order ID: " + order.getOrderId());
        System.out.println("   Status: " + order.getStatus());
        System.out.println("   Items: " + order.getItems().size());
        System.out.println("   Total: $" + String.format("%.2f", order.getTotalAmount()));
        
        // Register Delivery Partner
        DeliveryPartner partner = service.registerDeliveryPartner("Mike Wilson", "555-0200");
        partner.setVehicleNumber("ABC123");
        System.out.println("\n✅ Delivery partner registered: " + partner.getName());
        
        // Assign Partner
        service.assignDeliveryPartner(order.getOrderId(), partner.getPartnerId());
        System.out.println("✅ Partner assigned to order");
        
        // Update Order Status
        service.updateOrderStatus(order.getOrderId(), OrderStatus.PREPARING);
        System.out.println("✅ Order status: PREPARING");
        
        service.updateOrderStatus(order.getOrderId(), OrderStatus.OUT_FOR_DELIVERY);
        System.out.println("✅ Order status: OUT_FOR_DELIVERY");
        
        service.updateOrderStatus(order.getOrderId(), OrderStatus.DELIVERED);
        System.out.println("✅ Order status: DELIVERED");
        
        // Search Restaurants
        List<Restaurant> nearby = service.searchRestaurants("pizza", deliveryAddr, 10.0);
        System.out.println("\n🔍 Found " + nearby.size() + " restaurants nearby");
        
        System.out.println("\n✅ Demo completed successfully!");
    }
}
