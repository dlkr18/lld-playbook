package com.you.lld.problems.fooddelivery;

import com.you.lld.problems.fooddelivery.api.FoodDeliveryService;
import com.you.lld.problems.fooddelivery.exceptions.InvalidOperationException;
import com.you.lld.problems.fooddelivery.impl.ConsoleNotificationService;
import com.you.lld.problems.fooddelivery.impl.InMemoryFoodDeliveryService;
import com.you.lld.problems.fooddelivery.model.*;

import java.util.ArrayList;
import java.util.List;

/**
 * End-to-end demo of Food Delivery System exercising:
 *
 *   1. State    -- Order lifecycle: Placed -> Confirmed -> Preparing -> Ready ->
 *                  OutForDelivery -> Delivered (+ cancellation guards)
 *   2. Observer -- OrderNotifier fires per-stakeholder notifications on every transition
 *   3. Menu validation -- placeOrder verifies items/availability/price from restaurant menu
 *   4. Partner lifecycle -- BUSY on assignment, AVAILABLE on delivery/cancel
 *   5. Concurrency -- synchronized(order) per-order, synchronized(partner)
 */
public class FoodDeliveryDemo {

    public static void main(String[] args) {
        System.out.println("========================================");
        System.out.println("  Food Delivery System -- Full LLD Demo");
        System.out.println("========================================\n");

        FoodDeliveryService service = new InMemoryFoodDeliveryService(new ConsoleNotificationService());

        Restaurant restaurant = setupRestaurant(service);
        Customer customer = setupCustomer(service);
        DeliveryPartner partner = setupPartner(service);

        demoHappyPath(service, restaurant, customer, partner);
        demoCancellation(service, restaurant, customer, partner);
        demoStateGuards(service, restaurant, customer);
        demoMenuValidation(service, restaurant, customer);
        demoSearch(service, customer);

        System.out.println("========================================");
        System.out.println("  All demos completed.");
        System.out.println("========================================");
    }

    // ──────────── Setup ────────────

    private static Restaurant setupRestaurant(FoodDeliveryService service) {
        Address addr = new Address("123 Main St", "NYC", "NY", "10001");
        addr.setLatitude(40.7128);
        addr.setLongitude(-74.0060);
        Restaurant r = service.registerRestaurant("Pizza Palace", addr);

        MenuItem pizza = new MenuItem("ITEM001", "Margherita Pizza", 12.99);
        pizza.setCategory("Pizza");
        pizza.setVegetarian(true);
        service.addMenuItem(r.getRestaurantId(), pizza);

        MenuItem pasta = new MenuItem("ITEM002", "Alfredo Pasta", 10.99);
        pasta.setCategory("Pasta");
        service.addMenuItem(r.getRestaurantId(), pasta);

        MenuItem salad = new MenuItem("ITEM003", "Caesar Salad", 8.50);
        salad.setCategory("Salad");
        salad.setAvailable(false);
        service.addMenuItem(r.getRestaurantId(), salad);

        r.setRating(4.5);
        System.out.println("[Setup] Restaurant: " + r.getName() + " (3 menu items)\n");
        return r;
    }

    private static Customer setupCustomer(FoodDeliveryService service) {
        Customer c = service.registerCustomer("John Doe", "john@example.com", "555-0100");
        Address deliveryAddr = new Address("456 Park Ave", "NYC", "NY", "10002");
        deliveryAddr.setLatitude(40.7589);
        deliveryAddr.setLongitude(-73.9851);
        c.addAddress(deliveryAddr);
        System.out.println("[Setup] Customer: " + c.getName());
        return c;
    }

    private static DeliveryPartner setupPartner(FoodDeliveryService service) {
        DeliveryPartner p = service.registerDeliveryPartner("Mike Wilson", "555-0200");
        p.setVehicleNumber("ABC123");
        Address loc = new Address("789 Broadway", "NYC", "NY", "10003");
        loc.setLatitude(40.7300);
        loc.setLongitude(-73.9950);
        service.updatePartnerLocation(p.getPartnerId(), loc);
        System.out.println("[Setup] Partner: " + p.getName() + "\n");
        return p;
    }

    // ──────────── Demo 1: Happy path ────────────

    private static void demoHappyPath(FoodDeliveryService service,
                                       Restaurant restaurant, Customer customer,
                                       DeliveryPartner partner) {
        System.out.println("--- Demo 1: Happy Path (State: Placed -> Delivered) ---\n");

        List<OrderItem> items = new ArrayList<>();
        items.add(new OrderItem("ITEM001", "Margherita Pizza", 12.99, 2));
        items.add(new OrderItem("ITEM002", "Alfredo Pasta", 10.99, 1));

        Order order = service.placeOrder(customer.getCustomerId(),
            restaurant.getRestaurantId(), items, customer.getAddresses().get(0));
        System.out.println("Order: " + order + "\n");

        service.assignDeliveryPartner(order.getOrderId(), partner.getPartnerId());
        System.out.println("Partner assigned: " + partner.getName()
            + " (status: " + partner.getStatus() + ")\n");

        service.updateOrderStatus(order.getOrderId(), OrderStatus.CONFIRMED);
        service.updateOrderStatus(order.getOrderId(), OrderStatus.PREPARING);
        service.updateOrderStatus(order.getOrderId(), OrderStatus.READY_FOR_PICKUP);
        service.updateOrderStatus(order.getOrderId(), OrderStatus.OUT_FOR_DELIVERY);
        service.updateOrderStatus(order.getOrderId(), OrderStatus.DELIVERED);

        System.out.println("\nFinal status: " + order.getStatus());
        System.out.println("Partner status after delivery: " + partner.getStatus());
        System.out.println();
    }

    // ──────────── Demo 2: Cancellation ────────────

    private static void demoCancellation(FoodDeliveryService service,
                                          Restaurant restaurant, Customer customer,
                                          DeliveryPartner partner) {
        System.out.println("--- Demo 2: Cancellation (State: Placed -> Cancelled) ---\n");

        List<OrderItem> items = new ArrayList<>();
        items.add(new OrderItem("ITEM001", "Margherita Pizza", 12.99, 1));

        Order order = service.placeOrder(customer.getCustomerId(),
            restaurant.getRestaurantId(), items, customer.getAddresses().get(0));

        service.assignDeliveryPartner(order.getOrderId(), partner.getPartnerId());
        System.out.println("Partner status before cancel: " + partner.getStatus());

        service.cancelOrder(order.getOrderId());
        System.out.println("Order status: " + order.getStatus());
        System.out.println("Partner released: " + partner.getStatus());
        System.out.println();
    }

    // ──────────── Demo 3: State guards ────────────

    private static void demoStateGuards(FoodDeliveryService service,
                                         Restaurant restaurant, Customer customer) {
        System.out.println("--- Demo 3: State Pattern Guards ---\n");

        List<OrderItem> items = new ArrayList<>();
        items.add(new OrderItem("ITEM002", "Alfredo Pasta", 10.99, 1));

        Order order = service.placeOrder(customer.getCustomerId(),
            restaurant.getRestaurantId(), items, customer.getAddresses().get(0));

        try {
            service.updateOrderStatus(order.getOrderId(), OrderStatus.PREPARING);
        } catch (IllegalStateException e) {
            System.out.println("Skip CONFIRMED blocked: " + e.getMessage());
        }

        service.updateOrderStatus(order.getOrderId(), OrderStatus.CONFIRMED);
        service.updateOrderStatus(order.getOrderId(), OrderStatus.PREPARING);
        service.updateOrderStatus(order.getOrderId(), OrderStatus.READY_FOR_PICKUP);

        try {
            service.cancelOrder(order.getOrderId());
        } catch (IllegalStateException e) {
            System.out.println("Cancel after READY blocked: " + e.getMessage());
        }

        service.updateOrderStatus(order.getOrderId(), OrderStatus.OUT_FOR_DELIVERY);
        service.updateOrderStatus(order.getOrderId(), OrderStatus.DELIVERED);

        try {
            service.cancelOrder(order.getOrderId());
        } catch (IllegalStateException e) {
            System.out.println("Cancel after DELIVERED blocked: " + e.getMessage());
        }
        System.out.println();
    }

    // ──────────── Demo 4: Menu validation ────────────

    private static void demoMenuValidation(FoodDeliveryService service,
                                            Restaurant restaurant, Customer customer) {
        System.out.println("--- Demo 4: Menu Validation ---\n");

        try {
            List<OrderItem> bad = new ArrayList<>();
            bad.add(new OrderItem("ITEM999", "Nonexistent", 99.99, 1));
            service.placeOrder(customer.getCustomerId(),
                restaurant.getRestaurantId(), bad, customer.getAddresses().get(0));
        } catch (InvalidOperationException e) {
            System.out.println("Invalid item blocked: " + e.getMessage());
        }

        try {
            List<OrderItem> unavailable = new ArrayList<>();
            unavailable.add(new OrderItem("ITEM003", "Caesar Salad", 8.50, 1));
            service.placeOrder(customer.getCustomerId(),
                restaurant.getRestaurantId(), unavailable, customer.getAddresses().get(0));
        } catch (InvalidOperationException e) {
            System.out.println("Unavailable item blocked: " + e.getMessage());
        }
        System.out.println();
    }

    // ──────────── Demo 5: Search ────────────

    private static void demoSearch(FoodDeliveryService service, Customer customer) {
        System.out.println("--- Demo 5: Restaurant Search ---\n");

        Address loc = customer.getAddresses().get(0);
        List<Restaurant> nearby = service.searchRestaurants("pizza", loc, 10.0);
        System.out.println("Found " + nearby.size() + " restaurant(s) matching 'pizza' within 10km");
        nearby.forEach(r -> System.out.println("  - " + r.getName()
            + " (rating: " + r.getRating() + ")"));

        List<Restaurant> all = service.searchRestaurants(null, null, 0);
        System.out.println("All open restaurants: " + all.size());
        System.out.println();
    }
}
