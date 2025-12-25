package com.you.lld.problems.fooddelivery;
import java.util.*;

public class Restaurant {
    private final String restaurantId;
    private String name;
    private String location;
    private List<String> menuItems;
    
    public Restaurant(String restaurantId, String name, String location) {
        this.restaurantId = restaurantId;
        this.name = name;
        this.location = location;
        this.menuItems = new ArrayList<>();
    }
    
    public String getRestaurantId() { return restaurantId; }
    public String getName() { return name; }
    public String getLocation() { return location; }
}
