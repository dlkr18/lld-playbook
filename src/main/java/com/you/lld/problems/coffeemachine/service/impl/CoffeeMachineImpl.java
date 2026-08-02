package com.you.lld.problems.coffeemachine.service.impl;

import com.you.lld.problems.coffeemachine.model.*;
import com.you.lld.problems.coffeemachine.service.CoffeeMachineService;
import com.you.lld.problems.coffeemachine.state.CoffeeMachineState;
import com.you.lld.problems.coffeemachine.state.DispensingState;
import com.you.lld.problems.coffeemachine.state.IdleState;

import java.math.BigDecimal;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Coffee machine driven by a real State machine:
 * {@code IDLE -> AWAITING_PAYMENT -> DISPENSING -> IDLE}.
 *
 * <p>Money is taken <b>before</b> ingredients are consumed, and any path that fails
 * after taking money refunds all of it.
 */
public class CoffeeMachineImpl implements CoffeeMachineService {
    private final IngredientContainer container;
    private final Map<BeverageType, Beverage> menu;
    private final Map<String, Order> orders;
    private CoffeeMachineState state;
    private String currentOrderId;

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

    @Override
    public synchronized String getStateName() {
        return state.getStateName();
    }

    public Beverage getBeverage(BeverageType type) {
        return menu.get(type);
    }

    /**
     * Step 1 — selection. Verifies the beverage can be made, but consumes nothing.
     *
     * <p>Stock is checked here so the customer is told "out of milk" before paying
     * rather than after. It is only a check, not a reservation: with a single-order
     * machine the AWAITING_PAYMENT state already excludes a second order, so nothing
     * can drain the hopper in between.
     */
    public Order doSelect(Beverage beverage) {
        if (!container.hasIngredients(beverage.getRecipe())) {
            throw new IllegalStateException("Out of ingredients for " + beverage.getName());
        }
        String orderId = UUID.randomUUID().toString();
        Order order = new Order(orderId, beverage);
        orders.put(orderId, order);
        currentOrderId = orderId;
        return order;
    }

    /**
     * Step 2 — take the money, then make the drink.
     *
     * <p>This is the ordering the previous version had backwards: it consumed
     * ingredients and marked the order COMPLETED during {@code placeOrder}, then
     * compared the payment afterwards and discarded the result. Underpaying got you
     * a free drink; overpaying kept the difference.
     */
    public boolean doPayAndDispense(String orderId, Payment payment) {
        Order order = orders.get(orderId);
        if (order == null || !orderId.equals(currentOrderId)) {
            throw new IllegalArgumentException("Not the order awaiting payment: " + orderId);
        }
        BigDecimal price = order.getBeverage().getPrice();
        BigDecimal paid = payment.getAmount();

        if (paid.compareTo(price) < 0) {
            // Insufficient: refund everything, make nothing, keep the hopper intact.
            order.recordPayment(BigDecimal.ZERO, paid);
            order.fail();
            finishOrder();
            return false;
        }

        setState(DispensingState.getInstance());
        try {
            if (!container.consume(order.getBeverage().getRecipe())) {
                // Ran dry between selection and payment: full refund, never a
                // half-charge. Every path that takes money must return it.
                order.recordPayment(BigDecimal.ZERO, paid);
                order.fail();
                return false;
            }
            order.markDispensing();
            order.recordPayment(price, paid.subtract(price));
            order.complete();
            return true;
        } finally {
            finishOrder();
        }
    }

    /** Abandon the selection. Nothing was taken, so there is nothing to refund. */
    public void doCancel() {
        Order order = currentOrderId == null ? null : orders.get(currentOrderId);
        if (order != null) {
            order.fail();
        }
        finishOrder();
    }

    private void finishOrder() {
        currentOrderId = null;
        setState(IdleState.getInstance());
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
    public synchronized void cancelOrder() {
        state.cancelOrder(this);
    }

    public synchronized Order getOrder(String orderId) {
        return orders.get(orderId);
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
