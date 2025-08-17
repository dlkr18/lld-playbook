package com.you.lld.inventory.model;

import com.you.lld.common.Money;

import java.io.Serializable;
import java.util.Objects;

/**
 * Product catalog entry with pricing, categorization, and inventory details.
 */
public final class Product implements Serializable {
  private static final long serialVersionUID = 1L;
  
  private final SkuId skuId;
  private final String name;
  private final String description;
  private final CategoryId categoryId;
  private final Money unitPrice;
  private final String brand;
  private final ProductStatus status;
  private final boolean perishable;
  private final Integer shelfLifeDays; // null if not perishable
  
  public Product(SkuId skuId, String name, String description, CategoryId categoryId, 
                 Money unitPrice, String brand, ProductStatus status, boolean perishable, Integer shelfLifeDays) {
    this.skuId = Objects.requireNonNull(skuId);
    this.name = Objects.requireNonNull(name);
    this.description = Objects.requireNonNull(description);
    this.categoryId = Objects.requireNonNull(categoryId);
    this.unitPrice = Objects.requireNonNull(unitPrice);
    this.brand = Objects.requireNonNull(brand);
    this.status = Objects.requireNonNull(status);
    this.perishable = perishable;
    this.shelfLifeDays = perishable ? Objects.requireNonNull(shelfLifeDays) : shelfLifeDays;
  }
  
  public SkuId skuId() { return skuId; }
  public String name() { return name; }
  public String description() { return description; }
  public CategoryId categoryId() { return categoryId; }
  public Money unitPrice() { return unitPrice; }
  public String brand() { return brand; }
  public ProductStatus status() { return status; }
  public boolean isPerishable() { return perishable; }
  public Integer shelfLifeDays() { return shelfLifeDays; }
  
  public boolean isActive() { return status == ProductStatus.ACTIVE; }
  
  @Override
  public String toString() {
    return "Product{" +
      "skuId=" + skuId +
      ", name='" + name + '\'' +
      ", unitPrice=" + unitPrice +
      ", status=" + status +
      '}';
  }
}
