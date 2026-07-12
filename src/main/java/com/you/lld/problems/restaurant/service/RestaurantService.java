package com.you.lld.problems.restaurant.service;

import com.you.lld.problems.restaurant.model.*;

import java.time.LocalDateTime;
import java.util.List;

public interface RestaurantService {

    void addTable(Table table);

    Table getTable(String tableId);

    Reservation makeReservation(String customerId, String tableId, LocalDateTime dateTime, int partySize);

    void cancelReservation(String reservationId);

    Table findTable(int partySize);

    List<Table> getAvailableTables();

    Order createOrder(String tableId);

    void addItemToOrder(String orderId, MenuItem item);

    void updateOrderStatus(String orderId, OrderStatus status);

    Bill generateBill(String orderId);
}
