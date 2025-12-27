package com.you.lld.problems.coffeemachine.model;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

public class IngredientContainer {
    private final Map<Ingredient, Integer> quantities;
    private final Map<Ingredient, Integer> maxCapacity;
    
    public IngredientContainer() {
        this.quantities = new ConcurrentHashMap<>();
        this.maxCapacity = new ConcurrentHashMap<>();
        initialize();
    }
    
    private void initialize() {
        for (Ingredient ingredient : Ingredient.values()) {
            quantities.put(ingredient, 500);
            maxCapacity.put(ingredient, 1000);
        }
    }
    
    public synchronized boolean hasIngredients(Map<Ingredient, Integer> required) {
        for (Map.Entry<Ingredient, Integer> entry : required.entrySet()) {
            if (quantities.getOrDefault(entry.getKey(), 0) < entry.getValue()) {
                return false;
            }
        }
        return true;
    }
    
    public synchronized boolean consume(Map<Ingredient, Integer> required) {
        if (!hasIngredients(required)) {
            return false;
        }
        
        for (Map.Entry<Ingredient, Integer> entry : required.entrySet()) {
            Ingredient ingredient = entry.getKey();
            int current = quantities.get(ingredient);
            quantities.put(ingredient, current - entry.getValue());
        }
        return true;
    }
    
    public synchronized void refill(Ingredient ingredient, int amount) {
        int current = quantities.getOrDefault(ingredient, 0);
        int max = maxCapacity.get(ingredient);
        quantities.put(ingredient, Math.min(current + amount, max));
    }
    
    public int getQuantity(Ingredient ingredient) {
        return quantities.getOrDefault(ingredient, 0);
    }
    
    public Map<Ingredient, Integer> getAllQuantities() {
        return new HashMap<>(quantities);
    }
}
