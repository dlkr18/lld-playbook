package com.you.lld.problems.fooddelivery.impl;

import com.you.lld.problems.fooddelivery.api.*;
import com.you.lld.problems.fooddelivery.model.*;
import com.you.lld.problems.fooddelivery.exceptions.*;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

public class InMemoryFoodDeliveryService implements FoodDeliveryService {
    private final Map<String, Restaurant> restaurants;
    private final Map<String, Customer> customers;
    private final Map<String, Order> orders;
    private final Map<String, DeliveryPartner> deliveryPartners;

    public InMemoryFoodDeliveryService() {
        this.restaurants = new HashMap<>();
        this.customers = new HashMap<>();
        this.orders = new HashMap<>();
        this.deliveryPartners = new HashMap<>();
    }

    @Override
    public Restaurant registerRestaurant(String name, Address address) {
        String id = UUID.randomUUID().toString();
        Restaurant restaurant = new Restaurant(id, name, address);
        restaurants.put(id, restaurant);
        return restaurant;
    }

    @Override
    public Restaurant getRestaurant(String restaurantId) {
        Restaurant restaurant = restaurants.get(restaurantId);
        if (restaurant == null) {
            throw new RestaurantNotFoundException("Restaurant not found: " + restaurantId);
        }
        return restaurant;
    }

    @Override
    public List<Restaurant> searchRestaurants(String query, Address location, double radiusKm) {
        return restaurants.values().stream()
                .filter(Restaurant::isOpen)
                .filter(r -> query == null || r.getName().toLowerCase().contains(query.toLowerCase()))
                .filter(r -> location == null || r.getAddress().distanceTo(location) <= radiusKm)
                .sorted((a, b) -> Double.compare(b.getRating(), a.getRating()))
                .collect(Collectors.toList());
    }

    @Override
    public void updateRestaurantStatus(String restaurantId, RestaurantStatus status) {
        Restaurant restaurant = getRestaurant(restaurantId);
        restaurant.setStatus(status);
    }

    @Override
    public void addMenuItem(String restaurantId, MenuItem item) {
        Restaurant restaurant = getRestaurant(restaurantId);
        restaurant.addMenuItem(item);
    }

    @Override
    public void removeMenuItem(String restaurantId, String itemId) {
        Restaurant restaurant = getRestaurant(restaurantId);
        restaurant.removeMenuItem(itemId);
    }

    @Override
    public void updateMenuItemAvailability(String restaurantId, String itemId, boolean available) {
        Restaurant restaurant = getRestaurant(restaurantId);
        restaurant.getMenu().stream()
                .filter(item -> item.getItemId().equals(itemId))
                .findFirst()
                .ifPresent(item -> item.setAvailable(available));
    }

    @Override
    public Customer registerCustomer(String name, String email, String phone) {
        String id = UUID.randomUUID().toString();
        Customer customer = new Customer(id, name, email, phone);
        customers.put(id, customer);
        return customer;
    }

    @Override
    public Customer getCustomer(String customerId) {
        Customer customer = customers.get(customerId);
        if (customer == null) {
            throw new CustomerNotFoundException("Customer not found: " + customerId);
        }
        return customer;
    }

    @Override
    public Order placeOrder(String customerId, String restaurantId,
                            List<OrderItem> items, Address deliveryAddress) {
        Customer customer = getCustomer(customerId);
        Restaurant restaurant = getRestaurant(restaurantId);

        if (!restaurant.isOpen()) {
            throw new RestaurantClosedException("Restaurant is not accepting orders");
        }

        String orderId = UUID.randomUUID().toString();
        Order order = new Order(orderId, customerId, restaurantId, deliveryAddress);

        for (OrderItem item : items) {
            order.addItem(item);
        }

        order.setEstimatedDeliveryTime(LocalDateTime.now().plusMinutes(45));
        orders.put(orderId, order);
        customer.addOrderToHistory(orderId);

        return order;
    }

    @Override
    public Order getOrder(String orderId) {
        Order order = orders.get(orderId);
        if (order == null) {
            throw new OrderNotFoundException("Order not found: " + orderId);
        }
        return order;
    }

    @Override
    public List<Order> getCustomerOrders(String customerId) {
        return orders.values().stream()
                .filter(o -> o.getCustomerId().equals(customerId))
                .sorted((a, b) -> b.getOrderedAt().compareTo(a.getOrderedAt()))
                .collect(Collectors.toList());
    }

    @Override
    public List<Order> getRestaurantOrders(String restaurantId) {
        return orders.values().stream()
                .filter(o -> o.getRestaurantId().equals(restaurantId))
                .sorted((a, b) -> b.getOrderedAt().compareTo(a.getOrderedAt()))
                .collect(Collectors.toList());
    }

    @Override
    public void updateOrderStatus(String orderId, OrderStatus status) {
        Order order = getOrder(orderId);
        order.setStatus(status);
        if (status == OrderStatus.DELIVERED) {
            order.setActualDeliveryTime(LocalDateTime.now());
        }
    }

    @Override
    public void cancelOrder(String orderId) {
        Order order = getOrder(orderId);
        if (order.getStatus() == OrderStatus.DELIVERED) {
            throw new InvalidOperationException("Cannot cancel delivered order");
        }
        order.setStatus(OrderStatus.CANCELLED);
    }

    @Override
    public DeliveryPartner registerDeliveryPartner(String name, String phone) {
        String id = UUID.randomUUID().toString();
        DeliveryPartner partner = new DeliveryPartner(id, name, phone);
        deliveryPartners.put(id, partner);
        return partner;
    }

    @Override
    public void assignDeliveryPartner(String orderId, String partnerId) {
        Order order = getOrder(orderId);
        DeliveryPartner partner = deliveryPartners.get(partnerId);
        if (partner == null) {
            throw new PartnerNotFoundException("Partner not found");
        }
        if (!partner.isAvailable()) {
            throw new PartnerNotAvailableException("Partner is not available");
        }

        order.setDeliveryPartnerId(partnerId);
        partner.setStatus(PartnerStatus.BUSY);
        partner.setCurrentOrderId(orderId);
    }

    @Override
    public List<DeliveryPartner> getAvailablePartners(Address location) {
        return deliveryPartners.values().stream()
                .filter(DeliveryPartner::isAvailable)
                .collect(Collectors.toList());
    }

    @Override
    public void updatePartnerLocation(String partnerId, Address location) {
        DeliveryPartner partner = deliveryPartners.get(partnerId);
        if (partner != null) {
            partner.setCurrentLocation(location);
        }
    }
}
