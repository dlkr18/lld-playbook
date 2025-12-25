package com.you.lld.problems.restaurant;
import com.you.lld.problems.restaurant.api.*;
import com.you.lld.problems.restaurant.impl.*;
import com.you.lld.problems.restaurant.model.*;
public class RestaurantDemo { public static void main(String[] args) { System.out.println("Restaurant Management Demo"); RestaurantService service = new InMemoryRestaurantService(); Order order = service.createOrder("T1"); service.addItemToOrder(order.getOrderId(), new MenuItem("M1","Pasta",15.99)); Bill bill = service.generateBill(order.getOrderId()); System.out.println("Bill Total: $" + bill.getTotal()); } }