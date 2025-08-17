package com.you.lld.inventory.model;

import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

public final class Identifiers {
  private Identifiers() {}

  public static final class SkuId implements Serializable {
    private static final long serialVersionUID = 1L;
    private final String value;
    private SkuId(String value) { this.value = Objects.requireNonNull(value); }
    public static SkuId of(String value) { return new SkuId(value); }
    public static SkuId random() { return new SkuId(UUID.randomUUID().toString()); }
    public String value() { return value; }
    @Override public boolean equals(Object o){
      if(this==o) return true; if(!(o instanceof SkuId)) return false; SkuId that=(SkuId)o; return value.equals(that.value);
    }
    @Override public int hashCode(){ return value.hashCode(); }
    @Override public String toString(){ return value; }
  }

  public static final class WarehouseId implements Serializable {
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

  public static final class ReservationId implements Serializable {
    private static final long serialVersionUID = 1L;
    private final String value;
    private ReservationId(String value) { this.value = Objects.requireNonNull(value); }
    public static ReservationId of(String value) { return new ReservationId(value); }
    public static ReservationId random() { return new ReservationId(UUID.randomUUID().toString()); }
    public String value() { return value; }
    @Override public boolean equals(Object o){
      if(this==o) return true; if(!(o instanceof ReservationId)) return false; ReservationId that=(ReservationId)o; return value.equals(that.value);
    }
    @Override public int hashCode(){ return value.hashCode(); }
    @Override public String toString(){ return value; }
  }
}


