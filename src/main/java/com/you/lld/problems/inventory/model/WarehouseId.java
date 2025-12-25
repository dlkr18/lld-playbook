package com.you.lld.problems.inventory.model;

import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

public final class WarehouseId implements Serializable {
  private static final long serialVersionUID = 1L;
  private final String value;
  private WarehouseId(String value) { this.value = Objects.requireNonNull(value); }
  public static WarehouseId of(String value) { return new WarehouseId(value); }
  public static WarehouseId random() { return new WarehouseId(UUID.randomUUID().toString()); }
  public String value() { return value; }
  @Override public boolean equals(Object o){
    if(this==o) return true; if(!(o instanceof WarehouseId)) return false; WarehouseId that=(WarehouseId)o; return value.equals(that.value);
  }
  @Override public int hashCode(){ return value.hashCode(); }
  @Override public String toString(){ return value; }
}


