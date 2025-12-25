package com.you.lld.problems.vendingmachine.model;

/**
 * Categories of products available in the vending machine.
 */
public enum ProductCategory {
    SNACKS("Snacks", "Chips, cookies, candy"),
    BEVERAGES("Beverages", "Sodas, water, juice"),
    CANDY("Candy", "Chocolate, gum, mints"),
    HEALTHY("Healthy", "Granola bars, fruit, nuts"),
    COFFEE("Coffee", "Hot coffee and tea"),
    FRESH("Fresh", "Sandwiches, salads");
    
    private final String displayName;
    private final String description;
    
    ProductCategory(String displayName, String description) {
        this.displayName = displayName;
        this.description = description;
    }
    
    public String getDisplayName() {
        return displayName;
    }
    
    public String getDescription() {
        return description;
    }
}
