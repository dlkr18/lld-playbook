package com.you.lld.problems.vendingmachine.state;

import com.you.lld.problems.vendingmachine.impl.VendingMachineImpl;
import com.you.lld.problems.vendingmachine.model.Money;
import com.you.lld.problems.vendingmachine.model.Product;

/**
 * State interface for the Vending Machine State pattern.
 *
 * Takes VendingMachineImpl (not the interface) as context so states
 * can access internal methods (addToBalance, setState, resetTransaction, etc.)
 * without exposing those methods on the public VendingMachine API.
 */
public interface VendingMachineState {
    void insertMoney(VendingMachineImpl machine, Money money);
    Product selectProduct(VendingMachineImpl machine, String slotCode);
    Product dispense(VendingMachineImpl machine);
    Money cancel(VendingMachineImpl machine);
    String getStateName();
}
