package com.you.lld.problems.vendingmachine.state;

import com.you.lld.problems.vendingmachine.api.VendingMachine;
import com.you.lld.problems.vendingmachine.model.Money;
import com.you.lld.problems.vendingmachine.model.Product;
import com.you.lld.problems.vendingmachine.model.Slot;

/**
 * Dispensing state - product is being dispensed.
 */
public class DispensingState implements VendingMachineState {
    
    private static final DispensingState INSTANCE = new DispensingState();
    
    private DispensingState() {}
    
    public static DispensingState getInstance() {
        return INSTANCE;
    }
    
    @Override
    public void insertMoney(VendingMachine machine, Money money) {
        throw new IllegalStateException("Cannot insert money during dispensing");
    }
    
    @Override
    public Product selectProduct(VendingMachine machine, String slotCode) {
        throw new IllegalStateException("Cannot select product during dispensing");
    }
    
    @Override
    public Product dispense(VendingMachine machine) {
        Product selectedProduct = machine.getSelectedProduct();
        if (selectedProduct == null) {
            throw new IllegalStateException("No product selected");
        }
        
        // Find the slot with this product and dispense
        for (Slot slot : machine.getAvailableSlots()) {
            if (slot.getProduct() != null && 
                slot.getProduct().getId().equals(selectedProduct.getId())) {
                
                // Deduct price from balance
                machine.deductFromBalance(selectedProduct.getPrice());
                
                // Dispense product from slot
                Product dispensed = machine.dispenseFromSlot(slot.getCode());
                
                // Reset transaction and return to idle
                machine.resetTransaction();
                machine.setState(IdleState.getInstance());
                
                return dispensed;
            }
        }
        
        throw new IllegalStateException("Selected product no longer available");
    }
    
    @Override
    public Money cancel(VendingMachine machine) {
        throw new IllegalStateException("Cannot cancel during dispensing");
    }
    
    @Override
    public String getStateName() {
        return "DISPENSING";
    }
}
