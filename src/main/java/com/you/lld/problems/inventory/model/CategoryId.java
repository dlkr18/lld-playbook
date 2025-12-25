package com.you.lld.problems.inventory.model;

import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

public final class CategoryId implements Serializable {
  private static final long serialVersionUID = 1L;
  private final String value;
  
  private CategoryId(String value) { 
    this.value = Objects.requireNonNull(value); 
  }
  
  public static CategoryId of(String value) { 
    return new CategoryId(value); 
  }
  
  public static CategoryId random() { 
    return new CategoryId(UUID.randomUUID().toString()); 
  }
  
  public String value() { 
    return value; 
  }
  
  @Override 
  public boolean equals(Object o){
    if(this==o) return true; 
    if(!(o instanceof CategoryId)) return false; 
    CategoryId that=(CategoryId)o; 
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
