package com.you.lld.problems.auction.model;

public class Item {
    private final String id;
    private String name;
    private String description;
    private String category;
    private String sellerId;
    
    public Item(String id, String name, String description, String category, String sellerId) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.category = category;
        this.sellerId = sellerId;
    }
    
    public String getId() { return id; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public String getCategory() { return category; }
    public String getSellerId() { return sellerId; }
    
    @Override
    public String toString() {
        return "Item{id='" + id + "', name='" + name + "', category='" + category + "'}";
    }
}
