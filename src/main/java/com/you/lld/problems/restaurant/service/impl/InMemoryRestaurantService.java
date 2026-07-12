package com.you.lld.problems.restaurant.service.impl;

import com.you.lld.problems.restaurant.exceptions.*;
import com.you.lld.problems.restaurant.model.*;
import com.you.lld.problems.restaurant.service.RestaurantService;
import com.you.lld.problems.restaurant.service.TableAllocationStrategy;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

/**
 * Thread-safe restaurant: best-fit table allocation, order state machine, reservations.
 */
public final class InMemoryRestaurantService implements RestaurantService {

    private final Map<String, Table> tables = new ConcurrentHashMap<String, Table>();
    private final Map<String, Reservation> reservations = new ConcurrentHashMap<String, Reservation>();
    private final Map<String, Order> orders = new ConcurrentHashMap<String, Order>();
    private final Map<String, String> tableToOrder = new ConcurrentHashMap<String, String>();
    private final TableAllocationStrategy allocationStrategy;
    private final AtomicLong reservationCounter = new AtomicLong(0);
    private final AtomicLong orderCounter = new AtomicLong(0);
    private final AtomicLong billCounter = new AtomicLong(0);

    public InMemoryRestaurantService() {
        this(new BestFitTableAllocation());
    }

    public InMemoryRestaurantService(TableAllocationStrategy allocationStrategy) {
        this.allocationStrategy = allocationStrategy;
    }

    @Override
    public void addTable(Table table) {
        if (table == null) {
            throw new IllegalArgumentException("Table cannot be null");
        }
        tables.put(table.getTableId(), table);
    }

    @Override
    public Table getTable(String tableId) {
        Table table = tables.get(tableId);
        if (table == null) {
            throw new TableNotFoundException("Table not found: " + tableId);
        }
        return table;
    }

    @Override
    public Reservation makeReservation(String customerId, String tableId,
                                       LocalDateTime dateTime, int partySize) {
        if (customerId == null) {
            throw new IllegalArgumentException("Customer ID required");
        }
        Table table = getTable(tableId);
        synchronized (table) {
            if (table.getStatus() != TableStatus.AVAILABLE) {
                throw new IllegalStateException("Table " + tableId + " is not available ("
                        + table.getStatus() + ")");
            }
            if (partySize > table.getCapacity()) {
                throw new IllegalArgumentException("Party size " + partySize
                        + " exceeds table capacity " + table.getCapacity());
            }
            String resId = "RES-" + reservationCounter.incrementAndGet();
            Reservation res = new Reservation(resId, customerId, tableId, dateTime, partySize);
            reservations.put(resId, res);
            table.setStatus(TableStatus.RESERVED);
            return res;
        }
    }

    @Override
    public void cancelReservation(String reservationId) {
        Reservation res = reservations.get(reservationId);
        if (res == null) {
            throw new ReservationNotFoundException("Reservation not found: " + reservationId);
        }
        Table table = tables.get(res.getTableId());
        if (table != null) {
            synchronized (table) {
                if (table.getStatus() == TableStatus.RESERVED) {
                    table.setStatus(TableStatus.AVAILABLE);
                }
            }
        }
        reservations.remove(reservationId);
    }

    @Override
    public Table findTable(int partySize) {
        return allocationStrategy.allocate(tables.values(), partySize);
    }

    @Override
    public List<Table> getAvailableTables() {
        List<Table> available = new ArrayList<Table>();
        for (Table t : tables.values()) {
            if (t.getStatus() == TableStatus.AVAILABLE) {
                available.add(t);
            }
        }
        return available;
    }

    @Override
    public Order createOrder(String tableId) {
        Table table = getTable(tableId);
        synchronized (table) {
            table.setStatus(TableStatus.OCCUPIED);
            String orderId = "ORD-" + orderCounter.incrementAndGet();
            Order order = new Order(orderId);
            orders.put(orderId, order);
            tableToOrder.put(tableId, orderId);
            return order;
        }
    }

    @Override
    public void addItemToOrder(String orderId, MenuItem item) {
        Order order = orders.get(orderId);
        if (order == null) {
            throw new OrderNotFoundException("Order not found: " + orderId);
        }
        order.addItem(item);
    }

    @Override
    public void updateOrderStatus(String orderId, OrderStatus status) {
        Order order = orders.get(orderId);
        if (order == null) {
            throw new OrderNotFoundException("Order not found: " + orderId);
        }
        order.transitionTo(status);
    }

    @Override
    public Bill generateBill(String orderId) {
        Order order = orders.get(orderId);
        if (order == null) {
            throw new OrderNotFoundException("Order not found: " + orderId);
        }
        if (order.getStatus() != OrderStatus.SERVED) {
            throw new IllegalStateException("Bill only after SERVED; current=" + order.getStatus());
        }

        double subtotal = 0;
        for (MenuItem item : order.getItems()) {
            subtotal += item.getPrice();
        }

        String billId = "BILL-" + billCounter.incrementAndGet();
        Bill bill = new Bill(billId, subtotal);
        order.transitionTo(OrderStatus.PAID);

        for (Map.Entry<String, String> entry : tableToOrder.entrySet()) {
            if (entry.getValue().equals(orderId)) {
                Table table = tables.get(entry.getKey());
                if (table != null) {
                    synchronized (table) {
                        table.setStatus(TableStatus.AVAILABLE);
                    }
                }
                tableToOrder.remove(entry.getKey());
                break;
            }
        }
        return bill;
    }
}
