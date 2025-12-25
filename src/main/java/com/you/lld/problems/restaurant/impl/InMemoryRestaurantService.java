package com.you.lld.problems.restaurant.impl;
import com.you.lld.problems.restaurant.api.*;
import com.you.lld.problems.restaurant.model.*;
import java.util.*;
public class InMemoryRestaurantService implements RestaurantService { private Map<String,Table> tables = new HashMap<>(); private Map<String,Order> orders = new HashMap<>(); public Table getTable(String id) { return tables.get(id); } public Reservation makeReservation(String cid, String tid) { return null; } public Order createOrder(String tid) { String id = UUID.randomUUID().toString(); Order o = new Order(id); orders.put(id, o); return o; } public void addItemToOrder(String oid, MenuItem item) { orders.get(oid).addItem(item); } public Bill generateBill(String oid) { return new Bill("B1", 100); } }