package com.you.lld.problems.fooddelivery.model;

import java.util.*;

public class Customer {
    private final String customerId;
    private String name;
    private String email;
    private String phone;
    private List<Address> addresses;
    private List<String> orderHistory;

    public Customer(String customerId, String name, String email, String phone) {
        this.customerId = customerId;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.addresses = new ArrayList<>();
        this.orderHistory = new ArrayList<>();
    }

    public String getCustomerId() {
        return customerId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public List<Address> getAddresses() {
        return new ArrayList<>(addresses);
    }

    public void addAddress(Address address) {
        addresses.add(address);
    }

    public List<String> getOrderHistory() {
        return new ArrayList<>(orderHistory);
    }

    public void addOrderToHistory(String orderId) {
        orderHistory.add(orderId);
    }
}
