package com.you.lld.problems.coffeemachine.service;

import com.you.lld.problems.coffeemachine.model.*;
import java.util.Map;
import java.util.List;

public interface CoffeeMachineService {
    List<Beverage> getMenu();
    Order placeOrder(BeverageType type);
    boolean processPayment(String orderId, Payment payment);

    /** Abandon the selected order without paying. */
    void cancelOrder();
    void refillIngredient(Ingredient ingredient, int amount);
    Map<Ingredient, Integer> checkIngredients();

    /** Current lifecycle state: IDLE, AWAITING_PAYMENT or DISPENSING. */
    String getStateName();
}
