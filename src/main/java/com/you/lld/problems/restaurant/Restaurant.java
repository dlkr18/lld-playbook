package com.you.lld.problems.restaurant;
import java.util.*;

public class Restaurant {
    private final Map<String, Table> tables;
    private final Map<String, MenuItem> menu;
    private final Map<String, List<MenuItem>> orders; // tableId -> items
    
    public Restaurant() {
        this.tables = new HashMap<>();
        this.menu = new HashMap<>();
        this.orders = new HashMap<>();
    }
    
    public void addTable(Table table) {
        tables.put(table.getTableId(), table);
    }
    
    public void addMenuItem(MenuItem item) {
        menu.put(item.getItemId(), item);
    }
    
    public boolean reserveTable(String tableId) {
        Table table = tables.get(tableId);
        if (table != null && table.getStatus() == Table.TableStatus.AVAILABLE) {
            table.setStatus(Table.TableStatus.RESERVED);
            return true;
        }
        return false;
    }
    
    public void placeOrder(String tableId, List<String> itemIds) {
        List<MenuItem> orderItems = new ArrayList<>();
        for (String itemId : itemIds) {
            MenuItem item = menu.get(itemId);
            if (item != null) {
                orderItems.add(item);
            }
        }
        orders.put(tableId, orderItems);
    }
    
    public double calculateBill(String tableId) {
        List<MenuItem> orderItems = orders.get(tableId);
        if (orderItems == null) return 0;
        return orderItems.stream().mapToDouble(MenuItem::getPrice).sum();
    }
}
