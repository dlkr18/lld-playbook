package com.you.lld.problems.inventory;

import com.you.lld.problems.inventory.service.InventoryService;
import com.you.lld.problems.inventory.service.OrderService;
import com.you.lld.problems.inventory.service.impl.InMemoryInventoryService;
import com.you.lld.problems.inventory.service.impl.InMemoryOrderService;

/**
 * Facade for multi-warehouse inventory and order orchestration.
 */
public final class Inventory {

    private final InventoryService inventoryService;
    private final OrderService orderService;

    public Inventory() {
        this.inventoryService = new InMemoryInventoryService();
        this.orderService = new InMemoryOrderService(inventoryService);
    }

    public Inventory(InventoryService inventoryService, OrderService orderService) {
        this.inventoryService = inventoryService;
        this.orderService = orderService;
    }

    public InventoryService inventory() {
        return inventoryService;
    }

    public OrderService orders() {
        return orderService;
    }
}
