package com.you.lld.problems.inventory.model;

import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

public final class UserId implements Serializable {
  private static final long serialVersionUID = 1L;
  private final String value;
  
  private UserId(String value) { 
    this.value = Objects.requireNonNull(value); 
  }
  
  public static UserId of(String value) { 
    return new UserId(value); 
  }
  
  public static UserId random() { 
    return new UserId(UUID.randomUUID().toString()); 
  }
  
  public String value() { 
    return value; 
  }
  
  @Override 
  public boolean equals(Object o){
    if(this==o) return true; 
    if(!(o instanceof UserId)) return false; 
    UserId that=(UserId)o; 
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
