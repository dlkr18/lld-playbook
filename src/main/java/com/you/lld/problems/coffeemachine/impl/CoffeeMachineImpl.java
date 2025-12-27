package com.you.lld.problems.coffeemachine.impl;

import com.you.lld.problems.coffeemachine.api.CoffeeMachine;
import com.you.lld.problems.coffeemachine.model.*;
import java.math.BigDecimal;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

public class CoffeeMachineImpl implements CoffeeMachine {
    private final IngredientContainer container;
    private final Map<BeverageType, Beverage> menu;
    private final Map<String, Order> orders;
    
    public CoffeeMachineImpl() {
        this.container = new IngredientContainer();
        this.menu = new HashMap<>();
        this.orders = new ConcurrentHashMap<>();
        initializeMenu();
    }
    
    private void initializeMenu() {
        Map<Ingredient, Integer> espressoRecipe = new HashMap<>();
        espressoRecipe.put(Ingredient.COFFEE, 20);
        espressoRecipe.put(Ingredient.WATER, 30);
        menu.put(BeverageType.ESPRESSO, 
                new Beverage(BeverageType.ESPRESSO, "Espresso", new BigDecimal("2.50"), espressoRecipe));
        
        Map<Ingredient, Integer> latteRecipe = new HashMap<>();
        latteRecipe.put(Ingredient.COFFEE, 20);
        latteRecipe.put(Ingredient.MILK, 100);
        latteRecipe.put(Ingredient.WATER, 30);
        menu.put(BeverageType.LATTE, 
                new Beverage(BeverageType.LATTE, "Latte", new BigDecimal("3.50"), latteRecipe));
        
        Map<Ingredient, Integer> cappuccinoRecipe = new HashMap<>();
        cappuccinoRecipe.put(Ingredient.COFFEE, 20);
        cappuccinoRecipe.put(Ingredient.MILK, 80);
        cappuccinoRecipe.put(Ingredient.WATER, 30);
        menu.put(BeverageType.CAPPUCCINO, 
                new Beverage(BeverageType.CAPPUCCINO, "Cappuccino", new BigDecimal("3.00"), cappuccinoRecipe));
    }
    
    @Override
    public List<Beverage> getMenu() {
        return new ArrayList<>(menu.values());
    }
    
    @Override
    public Order placeOrder(BeverageType type) {
        Beverage beverage = menu.get(type);
        if (beverage == null) {
            throw new IllegalArgumentException("Beverage not available");
        }
        
        String orderId = UUID.randomUUID().toString();
        Order order = new Order(orderId, beverage);
        
        if (container.hasIngredients(beverage.getRecipe())) {
            if (container.consume(beverage.getRecipe())) {
                order.complete();
                System.out.println("Order placed: " + beverage.getName());
            } else {
                order.fail();
                System.out.println("Failed to prepare: " + beverage.getName());
            }
        } else {
            order.fail();
            System.out.println("Insufficient ingredients for: " + beverage.getName());
        }
        
        orders.put(orderId, order);
        return order;
    }
    
    @Override
    public boolean processPayment(String orderId, Payment payment) {
        Order order = orders.get(orderId);
        if (order == null) {
            return false;
        }
        
        if (payment.getAmount().compareTo(order.getBeverage().getPrice()) >= 0) {
            System.out.println("Payment processed: $" + payment.getAmount());
            return true;
        }
        return false;
    }
    
    @Override
    public void refillIngredient(Ingredient ingredient, int amount) {
        container.refill(ingredient, amount);
        System.out.println("Refilled " + ingredient + ": +" + amount);
    }
    
    @Override
    public Map<Ingredient, Integer> checkIngredients() {
        return container.getAllQuantities();
    }
}
