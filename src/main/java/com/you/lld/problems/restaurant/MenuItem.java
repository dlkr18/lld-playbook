package com.you.lld.problems.restaurant;
public class MenuItem {
    private final String itemId;
    private String name;
    private double price;
    private String category;
    
    public MenuItem(String itemId, String name, double price) {
        this.itemId = itemId;
        this.name = name;
        this.price = price;
    }
    
    public String getItemId() { return itemId; }
    public String getName() { return name; }
    public double getPrice() { return price; }
}
