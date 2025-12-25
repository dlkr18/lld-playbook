package com.you.lld.problems.vendingmachine.impl;

import com.you.lld.problems.vendingmachine.api.VendingMachine;
import com.you.lld.problems.vendingmachine.model.Money;
import com.you.lld.problems.vendingmachine.model.Product;
import com.you.lld.problems.vendingmachine.model.Slot;
import com.you.lld.problems.vendingmachine.state.IdleState;
import com.you.lld.problems.vendingmachine.state.VendingMachineState;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Thread-safe implementation of the VendingMachine interface.
 * Uses the State pattern for managing machine states.
 */
public class VendingMachineImpl implements VendingMachine {
    
    private final Map<String, Slot> slots;
    private VendingMachineState currentState;
    private Money currentBalance;
    private Product selectedProduct;
    private String selectedSlotCode;
    
    public VendingMachineImpl() {
        this.slots = new ConcurrentHashMap<>();
        this.currentState = IdleState.getInstance();
        this.currentBalance = Money.ZERO;
        this.selectedProduct = null;
        this.selectedSlotCode = null;
    }
    
    /**
     * Add a slot to the machine.
     */
    public void addSlot(Slot slot) {
        if (slot == null) {
            throw new IllegalArgumentException("Slot cannot be null");
        }
        slots.put(slot.getCode(), slot);
    }
    
    // ==================== Customer Operations ====================
    
    @Override
    public synchronized void insertMoney(Money money) {
        currentState.insertMoney(this, money);
    }
    
    @Override
    public synchronized Product selectProduct(String slotCode) {
        this.selectedSlotCode = slotCode;
        return currentState.selectProduct(this, slotCode);
    }
    
    @Override
    public synchronized Product dispense() {
        return currentState.dispense(this);
    }
    
    @Override
    public synchronized Money cancelTransaction() {
        Money refund = currentState.cancel(this);
        // If we have remaining balance after state's cancel, refund it
        if (!currentBalance.isZero()) {
            Money remaining = currentBalance;
            resetTransaction();
            setState(IdleState.getInstance());
            return remaining.add(refund);
        }
        return refund;
    }
    
    @Override
    public Money getCurrentBalance() {
        return currentBalance;
    }
    
    @Override
    public Product getSelectedProduct() {
        return selectedProduct;
    }
    
    // ==================== Query Operations ====================
    
    @Override
    public List<Slot> getAvailableSlots() {
        List<Slot> availableSlots = new ArrayList<>();
        for (Slot slot : slots.values()) {
            if (!slot.isEmpty()) {
                availableSlots.add(slot);
            }
        }
        return availableSlots;
    }
    
    @Override
    public boolean isProductAvailable(String slotCode) {
        Slot slot = slots.get(slotCode);
        return slot != null && !slot.isEmpty();
    }
    
    @Override
    public Slot getSlot(String slotCode) {
        return slots.get(slotCode);
    }
    
    // ==================== State Management ====================
    
    @Override
    public VendingMachineState getCurrentState() {
        return currentState;
    }
    
    @Override
    public void setState(VendingMachineState state) {
        this.currentState = state;
    }
    
    // ==================== Internal Operations ====================
    
    @Override
    public void addToBalance(Money money) {
        if (money != null && !money.isZero()) {
            this.currentBalance = this.currentBalance.add(money);
        }
    }
    
    @Override
    public void deductFromBalance(Money money) {
        if (money != null && !money.isZero()) {
            this.currentBalance = this.currentBalance.subtract(money);
        }
    }
    
    @Override
    public void setSelectedProduct(Product product) {
        this.selectedProduct = product;
    }
    
    @Override
    public void clearSelectedProduct() {
        this.selectedProduct = null;
        this.selectedSlotCode = null;
    }
    
    @Override
    public void resetTransaction() {
        this.currentBalance = Money.ZERO;
        this.selectedProduct = null;
        this.selectedSlotCode = null;
    }
    
    @Override
    public Product dispenseFromSlot(String slotCode) {
        Slot slot = slots.get(slotCode);
        if (slot == null || slot.isEmpty()) {
            throw new IllegalStateException("Product not available in slot: " + slotCode);
        }
        return slot.dispense();
    }
    
    /**
     * Get the slot code of the currently selected product.
     */
    public String getSelectedSlotCode() {
        return selectedSlotCode;
    }
    
    @Override
    public String toString() {
        return String.format("VendingMachine{state=%s, balance=%s, selected=%s}", 
                           currentState.getStateName(), 
                           currentBalance, 
                           selectedProduct != null ? selectedProduct.getName() : "none");
    }
}
