package com.you.lld.problems.vendingmachine.state;

import com.you.lld.problems.vendingmachine.impl.VendingMachineImpl;
import com.you.lld.problems.vendingmachine.model.Money;
import com.you.lld.problems.vendingmachine.model.Product;
import com.you.lld.problems.vendingmachine.model.Slot;

/**
 * HasMoney -- money inserted, waiting for product selection.
 */
public class HasMoneyState implements VendingMachineState {

    private static final HasMoneyState INSTANCE = new HasMoneyState();
    private HasMoneyState() {}
    public static HasMoneyState getInstance() { return INSTANCE; }

    @Override
    public void insertMoney(VendingMachineImpl machine, Money money) {
        if (money == null || money.isZero()) {
            throw new IllegalArgumentException("Money amount must be positive");
        }
        machine.addToBalance(money);
    }

    @Override
    public Product selectProduct(VendingMachineImpl machine, String slotCode) {
        if (slotCode == null || slotCode.trim().isEmpty()) {
            throw new IllegalArgumentException("Slot code cannot be empty");
        }

        Slot slot = machine.getSlot(slotCode);
        if (slot == null || slot.isEmpty()) {
            throw new IllegalStateException("Product not available in slot: " + slotCode);
        }

        Product product = slot.getProduct();
        if (machine.getCurrentBalance().isLessThan(product.getPrice())) {
            throw new IllegalStateException(
                String.format("Insufficient funds. Price: %s, Balance: %s",
                    product.getPrice(), machine.getCurrentBalance()));
        }

        machine.setSelectedProduct(product);
        machine.setSelectedSlotCode(slotCode);
        machine.setState(ProductSelectedState.getInstance());
        return product;
    }

    @Override
    public Product dispense(VendingMachineImpl machine) {
        throw new IllegalStateException("Please select a product first");
    }

    @Override
    public Money cancel(VendingMachineImpl machine) {
        Money refund = machine.getCurrentBalance();
        machine.resetTransaction();
        machine.setState(IdleState.getInstance());
        return refund;
    }

    @Override
    public String getStateName() { return "HAS_MONEY"; }
}
