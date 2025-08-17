package com.you.lld.inventory.impl;

import com.you.lld.inventory.api.InventoryService;
import com.you.lld.inventory.model.ReservationId;
import com.you.lld.inventory.model.SkuId;
import com.you.lld.inventory.model.StockSnapshot;
import com.you.lld.inventory.model.WarehouseId;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Thread-safe in-memory implementation with per-(sku,warehouse) locks.
 * Suitable for unit testing and demos; not for production scale.
 */
public final class InMemoryInventoryService implements InventoryService {

  private static final class Key {
    final SkuId skuId; final WarehouseId warehouseId;
    Key(SkuId s, WarehouseId w){ this.skuId = s; this.warehouseId = w; }
    @Override public boolean equals(Object o){
      if(this==o) return true; if(!(o instanceof Key)) return false; Key k=(Key)o; return skuId.equals(k.skuId) && warehouseId.equals(k.warehouseId);
    }
    @Override public int hashCode(){ return Objects.hash(skuId, warehouseId); }
  }

  private static final class Reservation {
    final ReservationId id; final SkuId skuId; final WarehouseId warehouseId; final long quantity;
    Reservation(ReservationId id, SkuId skuId, WarehouseId warehouseId, long quantity){
      this.id=id; this.skuId=skuId; this.warehouseId=warehouseId; this.quantity=quantity;
    }
  }

  private static final class Entry {
    long onHand; long reserved; final Object lock = new Object();
  }

  private final ConcurrentHashMap<Key, Entry> entries = new ConcurrentHashMap<>();
  private final ConcurrentHashMap<ReservationId, Reservation> reservations = new ConcurrentHashMap<>();

  private Entry getEntry(SkuId skuId, WarehouseId warehouseId){
    return entries.computeIfAbsent(new Key(skuId, warehouseId), k -> new Entry());
  }

  private static void requirePositive(long quantity){
    if(quantity <= 0) throw new IllegalArgumentException("Quantity must be positive");
  }

  @Override
  public void receiveStock(SkuId skuId, WarehouseId warehouseId, long quantity, String reason) {
    Objects.requireNonNull(skuId); Objects.requireNonNull(warehouseId);
    requirePositive(quantity);
    Entry e = getEntry(skuId, warehouseId);
    synchronized (e.lock) {
      e.onHand = Math.addExact(e.onHand, quantity);
    }
  }

  @Override
  public ReservationId reserve(SkuId skuId, WarehouseId warehouseId, long quantity, String reference) {
    Objects.requireNonNull(skuId); Objects.requireNonNull(warehouseId);
    requirePositive(quantity);
    Entry e = getEntry(skuId, warehouseId);
    synchronized (e.lock) {
      long available = e.onHand - e.reserved;
      if (available < quantity) throw new IllegalArgumentException("Insufficient available");
      e.reserved = Math.addExact(e.reserved, quantity);
      ReservationId id = ReservationId.random();
      reservations.put(id, new Reservation(id, skuId, warehouseId, quantity));
      return id;
    }
  }

  @Override
  public void release(ReservationId reservationId, String reason) {
    Objects.requireNonNull(reservationId);
    Reservation r = reservations.remove(reservationId);
    if (r == null) throw new IllegalArgumentException("Unknown reservation");
    Entry e = getEntry(r.skuId, r.warehouseId);
    synchronized (e.lock) {
      if (e.reserved < r.quantity) throw new IllegalStateException("Reserved underflow");
      e.reserved -= r.quantity;
    }
  }

  @Override
  public void commit(ReservationId reservationId, String reason) {
    Objects.requireNonNull(reservationId);
    Reservation r = reservations.remove(reservationId);
    if (r == null) throw new IllegalArgumentException("Unknown reservation");
    Entry e = getEntry(r.skuId, r.warehouseId);
    synchronized (e.lock) {
      if (e.reserved < r.quantity) throw new IllegalStateException("Reserved underflow");
      e.reserved -= r.quantity;
      if (e.onHand < r.quantity) throw new IllegalStateException("On-hand underflow");
      e.onHand -= r.quantity;
    }
  }

  @Override
  public void adjust(SkuId skuId, WarehouseId warehouseId, long delta, String reason) {
    Objects.requireNonNull(skuId); Objects.requireNonNull(warehouseId);
    Entry e = getEntry(skuId, warehouseId);
    synchronized (e.lock) {
      long newOnHand = e.onHand + delta;
      if (newOnHand < e.reserved) throw new IllegalArgumentException("Adjustment would violate reserved <= onHand");
      if (newOnHand < 0) throw new IllegalArgumentException("On-hand cannot be negative");
      e.onHand = newOnHand;
    }
  }

  @Override
  public void transfer(SkuId skuId, WarehouseId from, WarehouseId to, long quantity, String reason) {
    Objects.requireNonNull(skuId); Objects.requireNonNull(from); Objects.requireNonNull(to);
    if (from.equals(to)) return;
    requirePositive(quantity);

    // Lock ordering to avoid deadlocks: lock the "smaller" key first by string compare
    Entry src = getEntry(skuId, from);
    Entry dst = getEntry(skuId, to);
    Object firstLock = src.lock;
    Object secondLock = dst.lock;
    if (System.identityHashCode(firstLock) > System.identityHashCode(secondLock)) {
      Object tmp = firstLock; firstLock = secondLock; secondLock = tmp;
    }
    synchronized (firstLock) {
      synchronized (secondLock) {
        long available = src.onHand - src.reserved;
        if (available < quantity) throw new IllegalArgumentException("Insufficient available at source");
        src.onHand -= quantity;
        dst.onHand = Math.addExact(dst.onHand, quantity);
      }
    }
  }

  @Override
  public StockSnapshot getStock(SkuId skuId, WarehouseId warehouseId) {
    Entry e = getEntry(skuId, warehouseId);
    synchronized (e.lock) {
      return new StockSnapshot(e.onHand, e.reserved);
    }
  }
}


