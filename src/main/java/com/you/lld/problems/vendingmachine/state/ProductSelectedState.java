package com.you.lld.problems.vendingmachine.state;

import com.you.lld.problems.vendingmachine.api.VendingMachine;
import com.you.lld.problems.vendingmachine.model.Money;
import com.you.lld.problems.vendingmachine.model.Product;
import com.you.lld.problems.vendingmachine.model.Slot;

/**
 * ProductSelected state - product has been selected, ready to dispense.
 */
public class ProductSelectedState implements VendingMachineState {
    
    private static final ProductSelectedState INSTANCE = new ProductSelectedState();
    
    private ProductSelectedState() {}
    
    public static ProductSelectedState getInstance() {
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
        // Allow changing product selection
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
        return product;
    }
    
    @Override
    public Product dispense(VendingMachine machine) {
        Product selectedProduct = machine.getSelectedProduct();
        if (selectedProduct == null) {
            throw new IllegalStateException("No product selected");
        }
        
        machine.setState(DispensingState.getInstance());
        return machine.getCurrentState().dispense(machine);
    }
    
    @Override
    public Money cancel(VendingMachine machine) {
        machine.clearSelectedProduct();
        machine.setState(HasMoneyState.getInstance());
        return Money.ZERO; // No refund, just go back to HasMoney state
    }
    
    @Override
    public String getStateName() {
        return "PRODUCT_SELECTED";
    }
}
