package com.you.lld.problems.vendingmachine.state;

import com.you.lld.problems.vendingmachine.impl.VendingMachineImpl;
import com.you.lld.problems.vendingmachine.model.Money;
import com.you.lld.problems.vendingmachine.model.Product;
import com.you.lld.problems.vendingmachine.model.Slot;

/**
 * ProductSelected -- product chosen, ready to dispense.
 * User can re-select, add more money, cancel, or dispense.
 */
public class ProductSelectedState implements VendingMachineState {

    private static final ProductSelectedState INSTANCE = new ProductSelectedState();
    private ProductSelectedState() {}
    public static ProductSelectedState getInstance() { return INSTANCE; }

    @Override
    public void insertMoney(VendingMachineImpl machine, Money money) {
        if (money == null || money.isZero()) {
            throw new IllegalArgumentException("Money amount must be positive");
        }
        machine.addToBalance(money);
    }

    @Override
    public Product selectProduct(VendingMachineImpl machine, String slotCode) {
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
        return product;
    }

    @Override
    public Product dispense(VendingMachineImpl machine) {
        Product product = machine.getSelectedProduct();
        if (product == null) {
            throw new IllegalStateException("No product selected");
        }
        machine.setState(DispensingState.getInstance());
        return machine.getState().dispense(machine);
    }

    @Override
    public Money cancel(VendingMachineImpl machine) {
        Money refund = machine.getCurrentBalance();
        machine.resetTransaction();
        machine.setState(IdleState.getInstance());
        return refund;
    }

    @Override
    public String getStateName() { return "PRODUCT_SELECTED"; }
}
