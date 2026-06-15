package com.you.lld.problems.coffeemachine;

import com.you.lld.problems.coffeemachine.model.Beverage;
import com.you.lld.problems.coffeemachine.model.BeverageType;
import com.you.lld.problems.coffeemachine.model.Ingredient;
import com.you.lld.problems.coffeemachine.model.Order;
import com.you.lld.problems.coffeemachine.model.Payment;
import com.you.lld.problems.coffeemachine.service.CoffeeMachineService;
import com.you.lld.problems.coffeemachine.service.impl.CoffeeMachineImpl;

import java.util.List;
import java.util.Map;

/** Facade for coffee vending — State pattern (Idle/Dispensing), atomic ingredient consumption. */
public class CoffeeMachine {
    private final CoffeeMachineService service;

    public CoffeeMachine() {
        this(new CoffeeMachineImpl());
    }

    public CoffeeMachine(CoffeeMachineService service) {
        this.service = service;
    }

    public List<Beverage> getMenu() {
        return service.getMenu();
    }

    public Order placeOrder(BeverageType type) {
        return service.placeOrder(type);
    }

    public boolean processPayment(String orderId, Payment payment) {
        return service.processPayment(orderId, payment);
    }

    public void refillIngredient(Ingredient ingredient, int amount) {
        service.refillIngredient(ingredient, amount);
    }

    public Map<Ingredient, Integer> checkIngredients() {
        return service.checkIngredients();
    }

    public String getStateName() {
        if (service instanceof CoffeeMachineImpl) {
            return ((CoffeeMachineImpl) service).getStateName();
        }
        return "UNKNOWN";
    }
}
