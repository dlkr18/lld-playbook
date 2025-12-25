package com.you.lld.problems.vendingmachine.api;

import com.you.lld.problems.vendingmachine.model.Money;
import com.you.lld.problems.vendingmachine.model.Product;
import com.you.lld.problems.vendingmachine.model.Slot;
import com.you.lld.problems.vendingmachine.state.VendingMachineState;

import java.util.List;

/**
 * Vending Machine API interface.
 * Defines the contract for vending machine operations.
 */
public interface VendingMachine {
    
    // ==================== Customer Operations ====================
    
    /**
     * Insert money into the machine.
     * @param money The money to insert
     */
    void insertMoney(Money money);
    
    /**
     * Select a product by slot code.
     * @param slotCode The code of the slot (e.g., "A1", "B2")
     * @return The selected product
     * @throws IllegalStateException if product unavailable or insufficient funds
     */
    Product selectProduct(String slotCode);
    
    /**
     * Dispense the selected product.
     * @return The dispensed product
     * @throws IllegalStateException if no product selected or machine not ready
     */
    Product dispense();
    
    /**
     * Cancel the current transaction and get refund.
     * @return The refunded money
     */
    Money cancelTransaction();
    
    /**
     * Get current balance in the machine.
     * @return Current balance
     */
    Money getCurrentBalance();
    
    /**
     * Get the currently selected product.
     * @return Selected product, or null if none selected
     */
    Product getSelectedProduct();
    
    // ==================== Query Operations ====================
    
    /**
     * Get all available products.
     * @return List of available products with quantities
     */
    List<Slot> getAvailableSlots();
    
    /**
     * Check if a specific slot has product available.
     * @param slotCode The slot code
     * @return true if product is available
     */
    boolean isProductAvailable(String slotCode);
    
    /**
     * Get product information for a slot.
     * @param slotCode The slot code
     * @return The slot information
     */
    Slot getSlot(String slotCode);
    
    // ==================== State Management ====================
    
    /**
     * Get the current state of the machine.
     * @return Current state
     */
    VendingMachineState getCurrentState();
    
    /**
     * Set the machine state (used by state implementations).
     * @param state New state
     */
    void setState(VendingMachineState state);
    
    // ==================== Internal Operations (for State pattern) ====================
    
    /**
     * Add money to the current balance.
     * @param money Money to add
     */
    void addToBalance(Money money);
    
    /**
     * Deduct money from the current balance.
     * @param money Money to deduct
     */
    void deductFromBalance(Money money);
    
    /**
     * Set the selected product.
     * @param product Product to select
     */
    void setSelectedProduct(Product product);
    
    /**
     * Clear the selected product.
     */
    void clearSelectedProduct();
    
    /**
     * Reset the transaction (clear balance and selection).
     */
    void resetTransaction();
    
    /**
     * Dispense product from a slot.
     * @param slotCode The slot code
     * @return The dispensed product
     */
    Product dispenseFromSlot(String slotCode);
}
