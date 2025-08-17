package com.you.lld.inventory.api;

import com.you.lld.inventory.model.ReservationId;
import com.you.lld.inventory.model.SkuId;
import com.you.lld.inventory.model.StockSnapshot;
import com.you.lld.inventory.model.WarehouseId;

/**
 * Inventory management API for core flows: receive, reserve, release, commit, adjust and transfer.
 * Quantities are non-negative. Invalid operations throw IllegalArgumentException.
 */
public interface InventoryService {
  /**
   * Increases on-hand quantity for a SKU at a warehouse.
   */
  void receiveStock(SkuId skuId, WarehouseId warehouseId, long quantity, String reason);

  /**
   * Creates a reservation that holds quantity from availability. Returns an id to later commit or release.
   */
  ReservationId reserve(SkuId skuId, WarehouseId warehouseId, long quantity, String reference);

  /**
   * Cancels a reservation, returning held quantity to availability.
   */
  void release(ReservationId reservationId, String reason);

  /**
   * Commits a reservation (e.g., when picked/shipped), deducting from on-hand and releasing the hold.
   */
  void commit(ReservationId reservationId, String reason);

  /**
   * Adjusts on-hand by a positive or negative delta (e.g., shrinkage, cycle count). Cannot drop below reserved.
   */
  void adjust(SkuId skuId, WarehouseId warehouseId, long delta, String reason);

  /**
   * Atomically moves available quantity between warehouses. Fails if not enough available at source.
   */
  void transfer(SkuId skuId, WarehouseId from, WarehouseId to, long quantity, String reason);

  /**
   * Returns current quantities for a SKU at a warehouse.
   */
  StockSnapshot getStock(SkuId skuId, WarehouseId warehouseId);
}


