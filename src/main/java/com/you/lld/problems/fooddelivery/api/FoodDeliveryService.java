package com.you.lld.problems.fooddelivery.api;

import com.you.lld.problems.fooddelivery.model.*;

import java.util.List;

public interface FoodDeliveryService {
    // Restaurant Management
    Restaurant registerRestaurant(String name, Address address);

    Restaurant getRestaurant(String restaurantId);

    List<Restaurant> searchRestaurants(String query, Address location, double radiusKm);

    void updateRestaurantStatus(String restaurantId, RestaurantStatus status);

    // Menu Management
    void addMenuItem(String restaurantId, MenuItem item);

    void removeMenuItem(String restaurantId, String itemId);

    void updateMenuItemAvailability(String restaurantId, String itemId, boolean available);

    // Customer Management
    Customer registerCustomer(String name, String email, String phone);

    Customer getCustomer(String customerId);

    // Order Management
    Order placeOrder(String customerId, String restaurantId, List<OrderItem> items, Address deliveryAddress);

    Order getOrder(String orderId);

    List<Order> getCustomerOrders(String customerId);

    List<Order> getRestaurantOrders(String restaurantId);

    void updateOrderStatus(String orderId, OrderStatus status);

    void cancelOrder(String orderId);

    // Delivery Partner Management
    DeliveryPartner registerDeliveryPartner(String name, String phone);

    void assignDeliveryPartner(String orderId, String partnerId);

    List<DeliveryPartner> getAvailablePartners(Address location);

    void updatePartnerLocation(String partnerId, Address location);
}
