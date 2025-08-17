package com.you.lld.inventory.model;

import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

public final class PaymentId implements Serializable {
  private static final long serialVersionUID = 1L;
  private final String value;
  
  private PaymentId(String value) { 
    this.value = Objects.requireNonNull(value); 
  }
  
  public static PaymentId of(String value) { 
    return new PaymentId(value); 
  }
  
  public static PaymentId random() { 
    return new PaymentId(UUID.randomUUID().toString()); 
  }
  
  public String value() { 
    return value; 
  }
  
  @Override 
  public boolean equals(Object o){
    if(this==o) return true; 
    if(!(o instanceof PaymentId)) return false; 
    PaymentId that=(PaymentId)o; 
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
