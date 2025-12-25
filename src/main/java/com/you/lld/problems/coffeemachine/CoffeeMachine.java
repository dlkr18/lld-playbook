package com.you.lld.problems.coffeemachine;
import java.util.*;

public class CoffeeMachine {
    private final Map<Ingredient, Integer> inventory;
    private final Map<Beverage, Map<Ingredient, Integer>> recipes;
    
    public CoffeeMachine() {
        this.inventory = new HashMap<>();
        this.recipes = new HashMap<>();
        initializeInventory();
        initializeRecipes();
    }
    
    private void initializeInventory() {
        inventory.put(Ingredient.COFFEE, 100);
        inventory.put(Ingredient.MILK, 100);
        inventory.put(Ingredient.WATER, 100);
        inventory.put(Ingredient.SUGAR, 100);
    }
    
    private void initializeRecipes() {
        Map<Ingredient, Integer> espresso = new HashMap<>();
        espresso.put(Ingredient.COFFEE, 1);
        espresso.put(Ingredient.WATER, 1);
        recipes.put(Beverage.ESPRESSO, espresso);
        
        Map<Ingredient, Integer> latte = new HashMap<>();
        latte.put(Ingredient.COFFEE, 1);
        latte.put(Ingredient.MILK, 2);
        latte.put(Ingredient.WATER, 1);
        recipes.put(Beverage.LATTE, latte);
    }
    
    public boolean makeBeverage(Beverage beverage) {
        Map<Ingredient, Integer> recipe = recipes.get(beverage);
        if (recipe == null) return false;
        
        // Check ingredients
        for (Map.Entry<Ingredient, Integer> entry : recipe.entrySet()) {
            if (inventory.getOrDefault(entry.getKey(), 0) < entry.getValue()) {
                return false;
            }
        }
        
        // Deduct ingredients
        for (Map.Entry<Ingredient, Integer> entry : recipe.entrySet()) {
            inventory.put(entry.getKey(), inventory.get(entry.getKey()) - entry.getValue());
        }
        
        return true;
    }
    
    public void refill(Ingredient ingredient, int amount) {
        inventory.put(ingredient, inventory.getOrDefault(ingredient, 0) + amount);
    }
}
