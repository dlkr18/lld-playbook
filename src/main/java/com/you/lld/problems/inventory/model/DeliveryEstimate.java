package com.you.lld.problems.inventory.model;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Objects;

/**
 * Delivery time estimate based on warehouse proximity and logistics capacity.
 */
public final class DeliveryEstimate implements Serializable {
  private static final long serialVersionUID = 1L;
  
  private final WarehouseId nearestWarehouse;
  private final LocalDateTime earliestDelivery;
  private final LocalDateTime latestDelivery;
  private final int distanceKm;
  private final boolean expressAvailable;
  
  public DeliveryEstimate(WarehouseId nearestWarehouse, LocalDateTime earliestDelivery,
                         LocalDateTime latestDelivery, int distanceKm, boolean expressAvailable) {
    this.nearestWarehouse = Objects.requireNonNull(nearestWarehouse);
    this.earliestDelivery = Objects.requireNonNull(earliestDelivery);
    this.latestDelivery = Objects.requireNonNull(latestDelivery);
    this.distanceKm = distanceKm;
    this.expressAvailable = expressAvailable;
  }
  
  public WarehouseId nearestWarehouse() { return nearestWarehouse; }
  public LocalDateTime earliestDelivery() { return earliestDelivery; }
  public LocalDateTime latestDelivery() { return latestDelivery; }
  public int distanceKm() { return distanceKm; }
  public boolean isExpressAvailable() { return expressAvailable; }
  
  @Override
  public String toString() {
    return "DeliveryEstimate{" +
      "nearestWarehouse=" + nearestWarehouse +
      ", earliestDelivery=" + earliestDelivery +
      ", latestDelivery=" + latestDelivery +
      ", distanceKm=" + distanceKm +
      ", expressAvailable=" + expressAvailable +
      '}';
  }
}
