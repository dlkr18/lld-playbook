package com.you.lld.problems.fooddelivery;
import java.util.*;

public class FoodDeliverySystem {
    private final Map<String, Restaurant> restaurants;
    private final Map<String, DeliveryOrder> orders;
    
    public FoodDeliverySystem() {
        this.restaurants = new HashMap<>();
        this.orders = new HashMap<>();
    }
    
    public void addRestaurant(Restaurant restaurant) {
        restaurants.put(restaurant.getRestaurantId(), restaurant);
    }
    
    public String placeOrder(DeliveryOrder order) {
        orders.put(order.getOrderId(), order);
        return order.getOrderId();
    }
    
    public void updateOrderStatus(String orderId, DeliveryOrder.OrderStatus status) {
        DeliveryOrder order = orders.get(orderId);
        if (order != null) {
            order.setStatus(status);
        }
    }
}
