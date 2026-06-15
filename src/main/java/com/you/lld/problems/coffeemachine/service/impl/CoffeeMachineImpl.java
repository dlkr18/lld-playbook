package com.you.lld.problems.coffeemachine.service.impl;

import com.you.lld.problems.coffeemachine.model.*;
import com.you.lld.problems.coffeemachine.service.CoffeeMachineService;
import com.you.lld.problems.coffeemachine.state.CoffeeMachineState;
import com.you.lld.problems.coffeemachine.state.IdleState;

import java.math.BigDecimal;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Coffee machine with State pattern (Idle/Dispensing) and atomic ingredient consumption.
 */
public class CoffeeMachineImpl implements CoffeeMachineService {
    private final IngredientContainer container;
    private final Map<BeverageType, Beverage> menu;
    private final Map<String, Order> orders;
    private CoffeeMachineState state;

    public CoffeeMachineImpl() {
        this.container = new IngredientContainer();
        this.menu = new HashMap<BeverageType, Beverage>();
        this.orders = new ConcurrentHashMap<String, Order>();
        this.state = IdleState.getInstance();
        initializeMenu();
    }

    private void initializeMenu() {
        Map<Ingredient, Integer> espressoRecipe = new HashMap<Ingredient, Integer>();
        espressoRecipe.put(Ingredient.COFFEE, 20);
        espressoRecipe.put(Ingredient.WATER, 30);
        menu.put(BeverageType.ESPRESSO,
                new Beverage(BeverageType.ESPRESSO, "Espresso", new BigDecimal("2.50"), espressoRecipe));

        Map<Ingredient, Integer> latteRecipe = new HashMap<Ingredient, Integer>();
        latteRecipe.put(Ingredient.COFFEE, 20);
        latteRecipe.put(Ingredient.MILK, 100);
        latteRecipe.put(Ingredient.WATER, 30);
        menu.put(BeverageType.LATTE,
                new Beverage(BeverageType.LATTE, "Latte", new BigDecimal("3.50"), latteRecipe));

        Map<Ingredient, Integer> cappuccinoRecipe = new HashMap<Ingredient, Integer>();
        cappuccinoRecipe.put(Ingredient.COFFEE, 20);
        cappuccinoRecipe.put(Ingredient.MILK, 80);
        cappuccinoRecipe.put(Ingredient.WATER, 30);
        menu.put(BeverageType.CAPPUCCINO,
                new Beverage(BeverageType.CAPPUCCINO, "Cappuccino", new BigDecimal("3.00"), cappuccinoRecipe));
    }

    public synchronized void setState(CoffeeMachineState newState) {
        this.state = newState;
    }

    public String getStateName() {
        return state.getStateName();
    }

    public Beverage getBeverage(BeverageType type) {
        return menu.get(type);
    }

    public Order brewOrder(Beverage beverage) {
        String orderId = UUID.randomUUID().toString();
        Order order = new Order(orderId, beverage);
        if (container.consume(beverage.getRecipe())) {
            order.complete();
        } else {
            order.fail();
        }
        orders.put(orderId, order);
        return order;
    }

    public boolean doProcessPayment(String orderId, Payment payment) {
        Order order = orders.get(orderId);
        if (order == null) {
            return false;
        }
        return payment.getAmount().compareTo(order.getBeverage().getPrice()) >= 0;
    }

    @Override
    public List<Beverage> getMenu() {
        return new ArrayList<Beverage>(menu.values());
    }

    @Override
    public synchronized Order placeOrder(BeverageType type) {
        return state.placeOrder(this, type);
    }

    @Override
    public synchronized boolean processPayment(String orderId, Payment payment) {
        return state.processPayment(this, orderId, payment);
    }

    @Override
    public void refillIngredient(Ingredient ingredient, int amount) {
        container.refill(ingredient, amount);
    }

    @Override
    public Map<Ingredient, Integer> checkIngredients() {
        return container.getAllQuantities();
    }
}
