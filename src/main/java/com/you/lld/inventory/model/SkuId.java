package com.you.lld.inventory.model;

import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

public final class SkuId implements Serializable {
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


