package com.you.lld.inventory;

import com.you.lld.inventory.api.InventoryService;
import com.you.lld.inventory.impl.InMemoryInventoryService;
import com.you.lld.inventory.model.ReservationId;
import com.you.lld.inventory.model.SkuId;
import com.you.lld.inventory.model.StockSnapshot;
import com.you.lld.inventory.model.WarehouseId;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class InventoryServiceTest {

  @Test
  void receive_reserve_commit_release_and_transfer() {
    InventoryService svc = new InMemoryInventoryService();
    SkuId sku = SkuId.of("MILK-1L");
    WarehouseId whA = WarehouseId.of("BLR-A");
    WarehouseId whB = WarehouseId.of("BLR-B");

    svc.receiveStock(sku, whA, 100, "initial");
    StockSnapshot s1 = svc.getStock(sku, whA);
    assertEquals(100, s1.onHand());
    assertEquals(100, s1.available());

    ReservationId r1 = svc.reserve(sku, whA, 30, "order#1");
    StockSnapshot s2 = svc.getStock(sku, whA);
    assertEquals(100, s2.onHand());
    assertEquals(70, s2.available());

    svc.commit(r1, "ship");
    StockSnapshot s3 = svc.getStock(sku, whA);
    assertEquals(70, s3.onHand());
    assertEquals(70, s3.available());

    ReservationId r2 = svc.reserve(sku, whA, 20, "order#2");
    svc.release(r2, "cancel");
    StockSnapshot s4 = svc.getStock(sku, whA);
    assertEquals(70, s4.onHand());
    assertEquals(70, s4.available());

    svc.transfer(sku, whA, whB, 50, "rebal");
    assertEquals(20, svc.getStock(sku, whA).onHand());
    assertEquals(50, svc.getStock(sku, whB).onHand());

    assertThrows(IllegalArgumentException.class, () -> svc.reserve(sku, whA, 25, "excess"));
  }
}


