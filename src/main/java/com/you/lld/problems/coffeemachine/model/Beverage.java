package com.you.lld.problems.coffeemachine.model;

import java.math.BigDecimal;
import java.util.Map;

public class Beverage {
    private final BeverageType type;
    private final String name;
    private final BigDecimal price;
    private final Map<Ingredient, Integer> recipe;
    
    public Beverage(BeverageType type, String name, BigDecimal price, Map<Ingredient, Integer> recipe) {
        this.type = type;
        this.name = name;
        this.price = price;
        this.recipe = recipe;
    }
    
    public BeverageType getType() { return type; }
    public String getName() { return name; }
    public BigDecimal getPrice() { return price; }
    public Map<Ingredient, Integer> getRecipe() { return recipe; }
    
    @Override
    public String toString() {
        return name + " - $" + price;
    }
}
