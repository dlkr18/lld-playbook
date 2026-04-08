package com.you.lld.problems.fooddelivery.impl;

import com.you.lld.problems.fooddelivery.api.FoodDeliveryService;
import com.you.lld.problems.fooddelivery.api.NotificationService;
import com.you.lld.problems.fooddelivery.exceptions.*;
import com.you.lld.problems.fooddelivery.model.*;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

/**
 * In-memory Food Delivery Service implementation.
 *
 * Patterns:
 *   State    -- Order lifecycle via OrderState (7 states, validated transitions)
 *   Observer -- OrderObserver / OrderNotifier (customer + restaurant + partner)
 *               Notified on every state change. SRP: no notification logic in entities.
 *
 * Concurrency:
 *   - ConcurrentHashMap for all stores
 *   - synchronized(order) for per-order state transitions
 *   - synchronized(partner) for partner assignment/release
 *
 * Key fixes vs original:
 *   - placeOrder validates items against restaurant menu (existence, availability, price)
 *   - Partner is released back to AVAILABLE when order is DELIVERED or CANCELLED
 *   - updateOrderStatus replaced by named transition methods via State pattern
 */
public class InMemoryFoodDeliveryService implements FoodDeliveryService {

    private final Map<String, Restaurant> restaurants = new ConcurrentHashMap<>();
    private final Map<String, Customer> customers = new ConcurrentHashMap<>();
    private final Map<String, Order> orders = new ConcurrentHashMap<>();
    private final Map<String, DeliveryPartner> deliveryPartners = new ConcurrentHashMap<>();

    private final NotificationService notificationService;

    public InMemoryFoodDeliveryService(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    // ======================== Restaurant ========================

    @Override
    public Restaurant registerRestaurant(String name, Address address) {
        String id = UUID.randomUUID().toString();
        Restaurant restaurant = new Restaurant(id, name, address);
        restaurants.put(id, restaurant);
        return restaurant;
    }

    @Override
    public Restaurant getRestaurant(String restaurantId) {
        Restaurant r = restaurants.get(restaurantId);
        if (r == null) throw new RestaurantNotFoundException("Restaurant not found: " + restaurantId);
        return r;
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
        getRestaurant(restaurantId).setStatus(status);
    }

    // ======================== Menu ========================

    @Override
    public void addMenuItem(String restaurantId, MenuItem item) {
        getRestaurant(restaurantId).addMenuItem(item);
    }

    @Override
    public void removeMenuItem(String restaurantId, String itemId) {
        getRestaurant(restaurantId).removeMenuItem(itemId);
    }

    @Override
    public void updateMenuItemAvailability(String restaurantId, String itemId, boolean available) {
        Restaurant r = getRestaurant(restaurantId);
        r.getMenu().stream()
            .filter(item -> item.getItemId().equals(itemId))
            .findFirst()
            .ifPresent(item -> item.setAvailable(available));
    }

    // ======================== Customer ========================

    @Override
    public Customer registerCustomer(String name, String email, String phone) {
        String id = UUID.randomUUID().toString();
        Customer customer = new Customer(id, name, email, phone);
        customers.put(id, customer);
        return customer;
    }

    @Override
    public Customer getCustomer(String customerId) {
        Customer c = customers.get(customerId);
        if (c == null) throw new CustomerNotFoundException("Customer not found: " + customerId);
        return c;
    }

    // ======================== Order lifecycle ========================

    /**
     * Place an order. Validates every OrderItem against the restaurant menu:
     * - item must exist
     * - item must be available
     * - price is taken from menu (not trusted from caller)
     *
     * Registers customer and restaurant OrderNotifiers (Observer pattern).
     */
    @Override
    public Order placeOrder(String customerId, String restaurantId,
                            List<OrderItem> items, Address deliveryAddress) {
        Customer customer = getCustomer(customerId);
        Restaurant restaurant = getRestaurant(restaurantId);

        if (!restaurant.isOpen()) {
            throw new RestaurantClosedException("Restaurant is not accepting orders");
        }
        if (items == null || items.isEmpty()) {
            throw new InvalidOperationException("Order must have at least one item");
        }

        Map<String, MenuItem> menuMap = new HashMap<>();
        for (MenuItem mi : restaurant.getMenu()) {
            menuMap.put(mi.getItemId(), mi);
        }

        String orderId = UUID.randomUUID().toString();
        Order order = new Order(orderId, customerId, restaurantId, deliveryAddress);

        for (OrderItem oi : items) {
            MenuItem menuItem = menuMap.get(oi.getMenuItemId());
            if (menuItem == null) {
                throw new InvalidOperationException("Menu item not found: " + oi.getMenuItemId());
            }
            if (!menuItem.isAvailable()) {
                throw new InvalidOperationException("Menu item not available: " + menuItem.getName());
            }
            order.addItem(new OrderItem(menuItem.getItemId(), menuItem.getName(),
                                        menuItem.getPrice(), oi.getQuantity()));
        }

        order.setEstimatedDeliveryTime(LocalDateTime.now().plusMinutes(45));

        order.addObserver(new OrderNotifier(customerId, "Customer", notificationService));
        order.addObserver(new OrderNotifier(restaurantId, "Restaurant", notificationService));

        orders.put(orderId, order);
        customer.addOrderToHistory(orderId);

        System.out.println("[FoodDelivery] Order placed: " + orderId
            + " | Items: " + order.getItems().size()
            + " | Total: $" + String.format("%.2f", order.getTotalAmount()));
        return order;
    }

    @Override
    public Order getOrder(String orderId) {
        Order o = orders.get(orderId);
        if (o == null) throw new OrderNotFoundException("Order not found: " + orderId);
        return o;
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

    /**
     * Named state transitions via State pattern.
     * Each transition is synchronized on the order for per-order concurrency.
     * On DELIVERED/CANCELLED: releases the delivery partner back to AVAILABLE.
     */
    @Override
    public void updateOrderStatus(String orderId, OrderStatus status) {
        Order order = getOrder(orderId);
        synchronized (order) {
            switch (status) {
                case CONFIRMED:        order.confirm();        break;
                case PREPARING:        order.startPreparing(); break;
                case READY_FOR_PICKUP: order.markReady();      break;
                case OUT_FOR_DELIVERY: order.pickUp();         break;
                case DELIVERED:        order.deliver();        releasePartner(order); break;
                default:
                    throw new InvalidOperationException("Use cancelOrder() to cancel");
            }
        }
    }

    @Override
    public void cancelOrder(String orderId) {
        Order order = getOrder(orderId);
        synchronized (order) {
            order.cancel();
            releasePartner(order);
        }
    }

    // ======================== Delivery Partner ========================

    @Override
    public DeliveryPartner registerDeliveryPartner(String name, String phone) {
        String id = UUID.randomUUID().toString();
        DeliveryPartner partner = new DeliveryPartner(id, name, phone);
        deliveryPartners.put(id, partner);
        return partner;
    }

    /**
     * Assign a delivery partner to an order.
     * Synchronized on partner to prevent double-assignment.
     * Registers a PartnerOrderNotifier (Observer) on the order.
     */
    @Override
    public void assignDeliveryPartner(String orderId, String partnerId) {
        Order order = getOrder(orderId);
        DeliveryPartner partner = deliveryPartners.get(partnerId);
        if (partner == null) throw new PartnerNotFoundException("Partner not found: " + partnerId);

        synchronized (partner) {
            if (!partner.isAvailable()) {
                throw new PartnerNotAvailableException("Partner " + partnerId + " is not available");
            }
            order.setDeliveryPartnerId(partnerId);
            partner.setStatus(PartnerStatus.BUSY);
            partner.setCurrentOrderId(orderId);

            order.addObserver(new OrderNotifier(partnerId, "DeliveryPartner", notificationService));
        }
    }

    @Override
    public List<DeliveryPartner> getAvailablePartners(Address location) {
        return deliveryPartners.values().stream()
            .filter(DeliveryPartner::isAvailable)
            .filter(p -> location == null || p.getCurrentLocation() == null
                || p.getCurrentLocation().distanceTo(location) <= 10.0)
            .collect(Collectors.toList());
    }

    @Override
    public void updatePartnerLocation(String partnerId, Address location) {
        DeliveryPartner partner = deliveryPartners.get(partnerId);
        if (partner == null) throw new PartnerNotFoundException("Partner not found: " + partnerId);
        partner.setCurrentLocation(location);
    }

    // ======================== Internal ========================

    private void releasePartner(Order order) {
        String partnerId = order.getDeliveryPartnerId();
        if (partnerId == null) return;
        DeliveryPartner partner = deliveryPartners.get(partnerId);
        if (partner != null) {
            synchronized (partner) {
                partner.setStatus(PartnerStatus.AVAILABLE);
                partner.setCurrentOrderId(null);
            }
        }
    }
}
