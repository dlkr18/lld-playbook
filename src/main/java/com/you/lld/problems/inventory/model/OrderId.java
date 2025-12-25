package com.you.lld.problems.inventory.model;

import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

public final class OrderId implements Serializable {
  private static final long serialVersionUID = 1L;
  private final String value;
  
  private OrderId(String value) { 
    this.value = Objects.requireNonNull(value); 
  }
  
  public static OrderId of(String value) { 
    return new OrderId(value); 
  }
  
  public static OrderId random() { 
    return new OrderId(UUID.randomUUID().toString()); 
  }
  
  public String value() { 
    return value; 
  }
  
  @Override 
  public boolean equals(Object o){
    if(this==o) return true; 
    if(!(o instanceof OrderId)) return false; 
    OrderId that=(OrderId)o; 
    return value.equals(that.value);
  }
  
  @Override 
  public int hashCode(){ 
    return value.hashCode(); 
  }
  
  @Override 
  public String toString(){ 
    return value; 
  }
}
