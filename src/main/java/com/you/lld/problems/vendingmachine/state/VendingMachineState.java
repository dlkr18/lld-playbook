package com.you.lld.problems.vendingmachine.state;

import com.you.lld.problems.vendingmachine.api.VendingMachine;
import com.you.lld.problems.vendingmachine.model.Money;
import com.you.lld.problems.vendingmachine.model.Product;

/**
 * State interface for the Vending Machine state pattern.
 * Each state handles operations differently based on the current machine state.
 */
public interface VendingMachineState {
    
    /**
     * Handle money insertion in this state.
     * @param machine The vending machine context
     * @param money The money being inserted
     */
    void insertMoney(VendingMachine machine, Money money);
    
    /**
     * Handle product selection in this state.
     * @param machine The vending machine context
     * @param slotCode The code of the selected slot
     * @return The selected product, or null if selection failed
     */
    Product selectProduct(VendingMachine machine, String slotCode);
    
    /**
     * Handle product dispensing in this state.
     * @param machine The vending machine context
     * @return The dispensed product, or null if dispensing failed
     */
    Product dispense(VendingMachine machine);
    
    /**
     * Handle transaction cancellation in this state.
     * @param machine The vending machine context
     * @return The refunded money
     */
    Money cancel(VendingMachine machine);
    
    /**
     * Get the name of this state for debugging/logging.
     * @return State name
     */
    String getStateName();
}
