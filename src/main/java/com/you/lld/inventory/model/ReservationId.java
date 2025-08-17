package com.you.lld.inventory.model;

import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

public final class ReservationId implements Serializable {
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


