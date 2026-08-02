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
    private final Map<String, String> orderToTable = new ConcurrentHashMap<String, String>();
    /** Per-table bookings ordered by start time — O(log n) overlap check, as in meetingscheduler. */
    private final Map<String, TreeMap<LocalDateTime, Reservation>> bookings =
            new ConcurrentHashMap<String, TreeMap<LocalDateTime, Reservation>>();
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
            if (partySize > table.getCapacity()) {
                throw new IllegalArgumentException("Party size " + partySize
                        + " exceeds table capacity " + table.getCapacity());
            }
            LocalDateTime end = dateTime.plus(Reservation.DEFAULT_SITTING);
            Reservation clash = findOverlap(tableId, dateTime, end);
            if (clash != null) {
                throw new IllegalStateException("Table " + tableId + " is already booked for "
                        + clash.getStartTime() + " - " + clash.getEndTime());
            }

            String resId = "RES-" + reservationCounter.incrementAndGet();
            Reservation res = new Reservation(resId, customerId, tableId, dateTime, partySize);
            reservations.put(resId, res);
            bookingsFor(tableId).put(dateTime, res);
            // Deliberately NOT table.setStatus(RESERVED): status describes the table
            // RIGHT NOW. A booking for next Tuesday must not make it unusable today.
            return res;
        }
    }

    private TreeMap<LocalDateTime, Reservation> bookingsFor(String tableId) {
        TreeMap<LocalDateTime, Reservation> existing = bookings.get(tableId);
        if (existing != null) {
            return existing;
        }
        TreeMap<LocalDateTime, Reservation> created = new TreeMap<LocalDateTime, Reservation>();
        TreeMap<LocalDateTime, Reservation> raced = bookings.putIfAbsent(tableId, created);
        return raced != null ? raced : created;
    }

    /**
     * At most two existing bookings can clash with [start, end): the one starting
     * latest at or before start, and the one starting first at or after it.
     * Both lookups are O(log n) — the "My Calendar I" trick.
     */
    private Reservation findOverlap(String tableId, LocalDateTime start, LocalDateTime end) {
        TreeMap<LocalDateTime, Reservation> byStart = bookings.get(tableId);
        if (byStart == null) {
            return null;
        }
        Map.Entry<LocalDateTime, Reservation> floor = byStart.floorEntry(start);
        if (floor != null && floor.getValue().overlaps(start, end)) {
            return floor.getValue();
        }
        Map.Entry<LocalDateTime, Reservation> ceiling = byStart.ceilingEntry(start);
        if (ceiling != null && ceiling.getValue().overlaps(start, end)) {
            return ceiling.getValue();
        }
        return null;
    }

    /** True if a booking is in force for this table at {@code instant}. */
    private boolean isReservedAt(String tableId, LocalDateTime instant) {
        TreeMap<LocalDateTime, Reservation> byStart = bookings.get(tableId);
        if (byStart == null) {
            return false;
        }
        Map.Entry<LocalDateTime, Reservation> floor = byStart.floorEntry(instant);
        return floor != null && floor.getValue().coversInstant(instant);
    }

    @Override
    public void cancelReservation(String reservationId) {
        Reservation res = reservations.remove(reservationId);
        if (res == null) {
            throw new ReservationNotFoundException("Reservation not found: " + reservationId);
        }
        TreeMap<LocalDateTime, Reservation> byStart = bookings.get(res.getTableId());
        if (byStart != null) {
            byStart.remove(res.getStartTime());
        }
    }

    @Override
    public Table findTable(int partySize) {
        return allocationStrategy.allocate(tables.values(), partySize);
    }

    @Override
    public List<Table> getAvailableTables() {
        LocalDateTime now = LocalDateTime.now();
        List<Table> available = new ArrayList<Table>();
        for (Table t : tables.values()) {
            if (t.getStatus() == TableStatus.AVAILABLE && !isReservedAt(t.getTableId(), now)) {
                available.add(t);
            }
        }
        return available;
    }

    @Override
    public Order createOrder(String tableId) {
        Table table = getTable(tableId);
        synchronized (table) {
            // Without this check a second party could be seated at an occupied table,
            // and tableToOrder.put would overwrite the first order's mapping — leaving
            // that order unbillable and the table never released.
            if (table.getStatus() == TableStatus.OCCUPIED) {
                throw new IllegalStateException("Table " + tableId + " is already occupied by order "
                        + tableToOrder.get(tableId));
            }
            table.setStatus(TableStatus.OCCUPIED);
            String orderId = "ORD-" + orderCounter.incrementAndGet();
            Order order = new Order(orderId);
            orders.put(orderId, order);
            tableToOrder.put(tableId, orderId);
            orderToTable.put(orderId, tableId);
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

        String tableId = orderToTable.remove(orderId);
        if (tableId != null) {
            tableToOrder.remove(tableId);
            Table table = tables.get(tableId);
            if (table != null) {
                synchronized (table) {
                    table.setStatus(TableStatus.AVAILABLE);
                }
            }
        }
        return bill;
    }
}
