package com.you.lld.problems.vendingmachine.state;

import com.you.lld.problems.vendingmachine.api.VendingMachine;
import com.you.lld.problems.vendingmachine.model.Money;
import com.you.lld.problems.vendingmachine.model.Product;
import com.you.lld.problems.vendingmachine.model.Slot;

/**
 * HasMoney state - money has been inserted, waiting for product selection.
 */
public class HasMoneyState implements VendingMachineState {
    
    private static final HasMoneyState INSTANCE = new HasMoneyState();
    
    private HasMoneyState() {}
    
    public static HasMoneyState getInstance() {
        return INSTANCE;
    }
    
    @Override
    public void insertMoney(VendingMachine machine, Money money) {
        if (money == null || money.isZero()) {
            throw new IllegalArgumentException("Money amount must be positive");
        }
        machine.addToBalance(money);
    }
    
    @Override
    public Product selectProduct(VendingMachine machine, String slotCode) {
        if (slotCode == null || slotCode.trim().isEmpty()) {
            throw new IllegalArgumentException("Slot code cannot be empty");
        }
        
        Slot slot = machine.getSlot(slotCode);
        if (slot == null || slot.isEmpty()) {
            throw new IllegalStateException("Product not available in slot: " + slotCode);
        }
        
        Product product = slot.getProduct();
        Money price = product.getPrice();
        Money balance = machine.getCurrentBalance();
        
        if (balance.isLessThan(price)) {
            throw new IllegalStateException(
                String.format("Insufficient funds. Price: %s, Balance: %s", price, balance)
            );
        }
        
        machine.setSelectedProduct(product);
        machine.setState(ProductSelectedState.getInstance());
        return product;
    }
    
    @Override
    public Product dispense(VendingMachine machine) {
        throw new IllegalStateException("Please select a product first");
    }
    
    @Override
    public Money cancel(VendingMachine machine) {
        Money refund = machine.getCurrentBalance();
        machine.resetTransaction();
        machine.setState(IdleState.getInstance());
        return refund;
    }
    
    @Override
    public String getStateName() {
        return "HAS_MONEY";
    }
}
