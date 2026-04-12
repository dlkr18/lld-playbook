package com.you.lld.problems.vendingmachine.api;

import com.you.lld.problems.vendingmachine.model.Money;
import com.you.lld.problems.vendingmachine.model.Product;
import com.you.lld.problems.vendingmachine.model.Slot;

import java.util.List;

/**
 * Public API for the Vending Machine.
 *
 * Contains ONLY customer-facing and query operations.
 * Internal methods (setState, addToBalance, resetTransaction, etc.)
 * live on VendingMachineImpl and are accessed directly by State classes.
 * This keeps the public contract clean -- callers cannot break invariants.
 */
public interface VendingMachine {

    void insertMoney(Money money);
    Product selectProduct(String slotCode);
    Product dispense();
    Money cancelTransaction();

    Money getCurrentBalance();
    Product getSelectedProduct();
    String getStateName();

    List<Slot> getAvailableSlots();
    boolean isProductAvailable(String slotCode);
    Slot getSlot(String slotCode);
}
