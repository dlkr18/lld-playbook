package com.you.lld.problems.inventory.model;

import java.io.Serializable;
import java.util.Objects;

/**
 * Delivery address with geolocation for warehouse routing.
 */
public final class Address implements Serializable {
  private static final long serialVersionUID = 1L;
  
  private final String line1;
  private final String line2;
  private final String city;
  private final String state;
  private final String pincode;
  private final String country;
  private final double latitude;
  private final double longitude;
  private final boolean isDefault;
  
  public Address(String line1, String line2, String city, String state, String pincode, 
                 String country, double latitude, double longitude, boolean isDefault) {
    this.line1 = Objects.requireNonNull(line1);
    this.line2 = line2; // can be null
    this.city = Objects.requireNonNull(city);
    this.state = Objects.requireNonNull(state);
    this.pincode = Objects.requireNonNull(pincode);
    this.country = Objects.requireNonNull(country);
    this.latitude = latitude;
    this.longitude = longitude;
    this.isDefault = isDefault;
  }
  
  public String line1() { return line1; }
  public String line2() { return line2; }
  public String city() { return city; }
  public String state() { return state; }
  public String pincode() { return pincode; }
  public String country() { return country; }
  public double latitude() { return latitude; }
  public double longitude() { return longitude; }
  public boolean isDefault() { return isDefault; }
  
  @Override
  public String toString() {
    return line1 + (line2 != null ? ", " + line2 : "") + ", " + city + ", " + state + " " + pincode;
  }
}
