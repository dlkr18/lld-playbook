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
 * Thread-safe Vending Machine implementation using the State pattern.
 *
 * Patterns:
 *   State -- 4 singleton states (Idle, HasMoney, ProductSelected, Dispensing)
 *            manage transitions and validate operations.
 *
 * Encapsulation:
 *   VendingMachine interface = public customer/query API only.
 *   Internal methods (addToBalance, setState, resetTransaction, etc.)
 *   are public on this class but NOT on the interface, so only State
 *   classes (which take VendingMachineImpl as context) can access them.
 *
 * Concurrency:
 *   All customer operations (insertMoney, selectProduct, dispense, cancelTransaction)
 *   are synchronized on this instance. Slot.dispense/refill are independently synchronized.
 */
public class VendingMachineImpl implements VendingMachine {

    private final Map<String, Slot> slots = new ConcurrentHashMap<>();
    private VendingMachineState currentState;
    private Money currentBalance;
    private Product selectedProduct;
    private String selectedSlotCode;
    private Money lastChange;

    public VendingMachineImpl() {
        this.currentState = IdleState.getInstance();
        this.currentBalance = Money.ZERO;
        this.lastChange = Money.ZERO;
    }

    // ======================== Public customer API ========================

    @Override
    public synchronized void insertMoney(Money money) {
        currentState.insertMoney(this, money);
    }

    @Override
    public synchronized Product selectProduct(String slotCode) {
        return currentState.selectProduct(this, slotCode);
    }

    @Override
    public synchronized Product dispense() {
        return currentState.dispense(this);
    }

    @Override
    public synchronized Money cancelTransaction() {
        Money refund = currentState.cancel(this);
        if (!currentBalance.isZero()) {
            Money remaining = currentBalance;
            resetTransaction();
            setState(IdleState.getInstance());
            return remaining.add(refund);
        }
        return refund;
    }

    @Override
    public synchronized Money getCurrentBalance() { return currentBalance; }

    @Override
    public synchronized Product getSelectedProduct() { return selectedProduct; }

    @Override
    public synchronized String getStateName() { return currentState.getStateName(); }

    // ======================== Query API ========================

    @Override
    public List<Slot> getAvailableSlots() {
        List<Slot> available = new ArrayList<>();
        for (Slot slot : slots.values()) {
            if (!slot.isEmpty()) available.add(slot);
        }
        return available;
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

    // ======================== Admin ========================

    public void addSlot(Slot slot) {
        if (slot == null) throw new IllegalArgumentException("Slot cannot be null");
        slots.put(slot.getCode(), slot);
    }

    // ======================== Internal (for State classes) ========================

    public void setState(VendingMachineState state) { this.currentState = state; }
    public VendingMachineState getState()            { return currentState; }

    public void addToBalance(Money money) {
        if (money != null && !money.isZero()) {
            this.currentBalance = this.currentBalance.add(money);
        }
    }

    public void deductFromBalance(Money money) {
        if (money != null && !money.isZero()) {
            this.currentBalance = this.currentBalance.subtract(money);
        }
    }

    public void setSelectedProduct(Product product) { this.selectedProduct = product; }

    public String getSelectedSlotCode() { return selectedSlotCode; }
    public void setSelectedSlotCode(String code) { this.selectedSlotCode = code; }

    public void setLastChange(Money change) { this.lastChange = change; }
    public Money getLastChange() { return lastChange; }

    public void resetTransaction() {
        this.currentBalance = Money.ZERO;
        this.selectedProduct = null;
        this.selectedSlotCode = null;
    }

    @Override
    public String toString() {
        return String.format("VendingMachine{state=%s, balance=%s, selected=%s}",
            currentState.getStateName(), currentBalance,
            selectedProduct != null ? selectedProduct.getName() : "none");
    }
}
