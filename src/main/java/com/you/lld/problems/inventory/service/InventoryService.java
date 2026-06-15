package com.you.lld.problems.inventory.service;

import com.you.lld.problems.inventory.model.ReservationId;
import com.you.lld.problems.inventory.model.SkuId;
import com.you.lld.problems.inventory.model.StockSnapshot;
import com.you.lld.problems.inventory.model.WarehouseId;

/**
 * Inventory management: receive, reserve, release, commit, adjust, transfer.
 * Quantities are non-negative; invalid operations throw IllegalArgumentException.
 */
public interface InventoryService {

    void receiveStock(SkuId skuId, WarehouseId warehouseId, long quantity, String reason);

    ReservationId reserve(SkuId skuId, WarehouseId warehouseId, long quantity, String reference);

    void release(ReservationId reservationId, String reason);

    void commit(ReservationId reservationId, String reason);

    void adjust(SkuId skuId, WarehouseId warehouseId, long delta, String reason);

    void transfer(SkuId skuId, WarehouseId from, WarehouseId to, long quantity, String reason);

    StockSnapshot getStock(SkuId skuId, WarehouseId warehouseId);
}
