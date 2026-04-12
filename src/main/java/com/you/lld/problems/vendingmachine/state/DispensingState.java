package com.you.lld.problems.vendingmachine.state;

import com.you.lld.problems.vendingmachine.impl.VendingMachineImpl;
import com.you.lld.problems.vendingmachine.model.Money;
import com.you.lld.problems.vendingmachine.model.Product;
import com.you.lld.problems.vendingmachine.model.Slot;

/**
 * Dispensing -- product is being dispensed.
 *
 * FIX: Uses the selected SLOT CODE (not a product-ID search) to dispense
 * from the exact slot the customer chose. This avoids the wrong-slot bug
 * when multiple slots hold the same product.
 */
public class DispensingState implements VendingMachineState {

    private static final DispensingState INSTANCE = new DispensingState();
    private DispensingState() {}
    public static DispensingState getInstance() { return INSTANCE; }

    @Override
    public void insertMoney(VendingMachineImpl machine, Money money) {
        throw new IllegalStateException("Cannot insert money during dispensing");
    }

    @Override
    public Product selectProduct(VendingMachineImpl machine, String slotCode) {
        throw new IllegalStateException("Cannot select product during dispensing");
    }

    @Override
    public Product dispense(VendingMachineImpl machine) {
        Product product = machine.getSelectedProduct();
        String slotCode = machine.getSelectedSlotCode();

        if (product == null || slotCode == null) {
            throw new IllegalStateException("No product selected");
        }

        Slot slot = machine.getSlot(slotCode);
        if (slot == null || slot.isEmpty()) {
            throw new IllegalStateException("Selected slot " + slotCode + " is now empty");
        }

        machine.deductFromBalance(product.getPrice());

        Money change = machine.getCurrentBalance();

        Product dispensed = slot.dispense();

        machine.setLastChange(change);
        machine.resetTransaction();
        machine.setState(IdleState.getInstance());

        if (!change.isZero()) {
            System.out.println("[VendingMachine] Change returned: " + change);
        }

        return dispensed;
    }

    @Override
    public Money cancel(VendingMachineImpl machine) {
        throw new IllegalStateException("Cannot cancel during dispensing");
    }

    @Override
    public String getStateName() { return "DISPENSING"; }
}
