package com.you.lld.problems.fooddelivery.model;
import java.util.*;

public class Restaurant {
    private final String restaurantId;
    private String name;
    private Address address;
    private List<MenuItem> menu;
    private RestaurantStatus status;
    private double rating;
    private List<String> cuisineTypes;
    private String phoneNumber;
    private Map<String, Integer> preparationTimes; // menuItemId -> minutes
    
    public Restaurant(String restaurantId, String name, Address address) {
        this.restaurantId = restaurantId;
        this.name = name;
        this.address = address;
        this.menu = new ArrayList<>();
        this.status = RestaurantStatus.OPEN;
        this.rating = 0.0;
        this.cuisineTypes = new ArrayList<>();
        this.preparationTimes = new HashMap<>();
    }
    
    public String getRestaurantId() { return restaurantId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public Address getAddress() { return address; }
    public List<MenuItem> getMenu() { return new ArrayList<>(menu); }
    public void addMenuItem(MenuItem item) { menu.add(item); }
    public void removeMenuItem(String itemId) { 
        menu.removeIf(item -> item.getItemId().equals(itemId)); 
    }
    public RestaurantStatus getStatus() { return status; }
    public void setStatus(RestaurantStatus status) { this.status = status; }
    public double getRating() { return rating; }
    public void setRating(double rating) { this.rating = rating; }
    public List<String> getCuisineTypes() { return new ArrayList<>(cuisineTypes); }
    public void addCuisineType(String cuisine) { cuisineTypes.add(cuisine); }
    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
    public void setPreparationTime(String itemId, int minutes) {
        preparationTimes.put(itemId, minutes);
    }
    public int getPreparationTime(String itemId) {
        return preparationTimes.getOrDefault(itemId, 30);
    }
    public boolean isOpen() { return status == RestaurantStatus.OPEN; }
}
