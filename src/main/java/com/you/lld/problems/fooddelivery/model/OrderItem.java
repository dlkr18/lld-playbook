package com.you.lld.problems.fooddelivery.model;
public class OrderItem {
    private final String menuItemId;
    private String itemName;
    private double price;
    private int quantity;
    private String customization;
    
    public OrderItem(String menuItemId, String itemName, double price, int quantity) {
        this.menuItemId = menuItemId;
        this.itemName = itemName;
        this.price = price;
        this.quantity = quantity;
    }
    
    public String getMenuItemId() { return menuItemId; }
    public String getItemName() { return itemName; }
    public double getPrice() { return price; }
    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }
    public String getCustomization() { return customization; }
    public void setCustomization(String customization) { this.customization = customization; }
    public double getTotal() { return price * quantity; }
}
