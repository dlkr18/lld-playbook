package com.you.lld.problems.vendingmachine;

import com.you.lld.problems.vendingmachine.impl.VendingMachineImpl;
import com.you.lld.problems.vendingmachine.model.*;

/**
 * End-to-end demo of the Vending Machine exercising:
 *
 *   1. State pattern -- Idle -> HasMoney -> ProductSelected -> Dispensing -> Idle
 *   2. State guards -- insert before select, select before dispense, etc.
 *   3. Change handling -- overpayment returned automatically
 *   4. Insufficient funds -- rejected at selection
 *   5. Cancel & refund -- full balance returned in any state
 *   6. Empty slot -- rejected when stock runs out
 *   7. Concurrent thread safety -- synchronized customer operations
 *   8. Encapsulation -- VendingMachine interface hides internal state methods
 */
public class VendingMachineDemo {

    public static void main(String[] args) {
        System.out.println("========================================");
        System.out.println("  Vending Machine -- Full LLD Demo");
        System.out.println("========================================\n");

        VendingMachineImpl machine = setupMachine();

        demoSuccessfulPurchase(machine);
        demoChangeReturn(machine);
        demoInsufficientFunds(machine);
        demoCancelAndRefund(machine);
        demoEmptySlot(machine);
        demoStateGuards(machine);
        demoConcurrency(machine);

        System.out.println("========================================");
        System.out.println("  All demos completed.");
        System.out.println("========================================");
    }

    private static VendingMachineImpl setupMachine() {
        VendingMachineImpl machine = new VendingMachineImpl();

        Product coke   = new Product("P1", "Coca-Cola",     Money.dollars(1.50), ProductCategory.BEVERAGES);
        Product chips  = new Product("P2", "Lay's Chips",   Money.dollars(1.25), ProductCategory.SNACKS);
        Product water  = new Product("P3", "Spring Water",  Money.dollars(1.00), ProductCategory.BEVERAGES);
        Product snickers = new Product("P4", "Snickers Bar", Money.dollars(1.75), ProductCategory.CANDY);

        machine.addSlot(new Slot("A1", coke,     5, 10));
        machine.addSlot(new Slot("A2", chips,    3, 10));
        machine.addSlot(new Slot("B1", water,    8, 10));
        machine.addSlot(new Slot("B2", snickers, 2, 10));

        System.out.println("[Setup] Stocked 4 slots:");
        for (Slot s : machine.getAvailableSlots()) {
            System.out.println("  " + s);
        }
        System.out.println();
        return machine;
    }

    // ──────────── Demo 1: Exact-amount purchase ────────────

    private static void demoSuccessfulPurchase(VendingMachineImpl machine) {
        System.out.println("--- Demo 1: Successful Purchase (Coke $1.50, exact) ---\n");

        machine.insertMoney(Money.DOLLAR);
        System.out.println("Inserted $1.00 -> balance: " + machine.getCurrentBalance()
            + " | state: " + machine.getStateName());

        machine.insertMoney(Money.QUARTER);
        machine.insertMoney(Money.QUARTER);
        System.out.println("Inserted 2 quarters -> balance: " + machine.getCurrentBalance());

        Product selected = machine.selectProduct("A1");
        System.out.println("Selected: " + selected.getName()
            + " | state: " + machine.getStateName());

        Product dispensed = machine.dispense();
        System.out.println("Dispensed: " + dispensed.getName()
            + " | change: " + machine.getLastChange()
            + " | state: " + machine.getStateName());
        System.out.println();
    }

    // ──────────── Demo 2: Overpayment → change ────────────

    private static void demoChangeReturn(VendingMachineImpl machine) {
        System.out.println("--- Demo 2: Overpayment & Change (Water $1.00, pay $2.00) ---\n");

        machine.insertMoney(Money.DOLLAR);
        machine.insertMoney(Money.DOLLAR);
        machine.selectProduct("B1");
        Product p = machine.dispense();
        System.out.println("Dispensed: " + p.getName()
            + " | change returned: " + machine.getLastChange());
        System.out.println();
    }

    // ──────────── Demo 3: Insufficient funds ────────────

    private static void demoInsufficientFunds(VendingMachineImpl machine) {
        System.out.println("--- Demo 3: Insufficient Funds (Snickers $1.75, insert $1.00) ---\n");

        machine.insertMoney(Money.DOLLAR);
        try {
            machine.selectProduct("B2");
        } catch (IllegalStateException e) {
            System.out.println("Blocked: " + e.getMessage());
        }
        machine.cancelTransaction();
        System.out.println("Refunded, state: " + machine.getStateName());
        System.out.println();
    }

    // ──────────── Demo 4: Cancel and refund ────────────

    private static void demoCancelAndRefund(VendingMachineImpl machine) {
        System.out.println("--- Demo 4: Cancel & Refund ---\n");

        machine.insertMoney(Money.DOLLAR);
        machine.insertMoney(Money.QUARTER);
        System.out.println("Balance: " + machine.getCurrentBalance());

        Money refund = machine.cancelTransaction();
        System.out.println("Refund: " + refund + " | state: " + machine.getStateName());
        System.out.println();
    }

    // ──────────── Demo 5: Buy until empty ────────────

    private static void demoEmptySlot(VendingMachineImpl machine) {
        System.out.println("--- Demo 5: Buy Until Empty (Snickers, qty=2) ---\n");

        for (int i = 1; i <= 3; i++) {
            try {
                machine.insertMoney(Money.DOLLAR);
                machine.insertMoney(Money.DOLLAR);
                machine.selectProduct("B2");
                Product p = machine.dispense();
                System.out.println("  Purchase " + i + ": " + p.getName());
            } catch (IllegalStateException e) {
                System.out.println("  Purchase " + i + " failed: " + e.getMessage());
                machine.cancelTransaction();
            }
        }
        System.out.println("Slot B2 available: " + machine.isProductAvailable("B2"));
        System.out.println();
    }

    // ──────────── Demo 6: State guards ────────────

    private static void demoStateGuards(VendingMachineImpl machine) {
        System.out.println("--- Demo 6: State Pattern Guards ---\n");

        try {
            machine.selectProduct("A1");
        } catch (IllegalStateException e) {
            System.out.println("Select without money: " + e.getMessage());
        }

        try {
            machine.dispense();
        } catch (IllegalStateException e) {
            System.out.println("Dispense without money: " + e.getMessage());
        }

        machine.insertMoney(Money.DOLLAR);
        try {
            machine.dispense();
        } catch (IllegalStateException e) {
            System.out.println("Dispense without select: " + e.getMessage());
        }
        machine.cancelTransaction();
        System.out.println();
    }

    // ──────────── Demo 7: Concurrent purchases ────────────

    private static void demoConcurrency(VendingMachineImpl machine) {
        System.out.println("--- Demo 7: Concurrent Purchases (synchronized) ---\n");

        machine.getSlot("B1").refill(
            new Product("P3", "Spring Water", Money.dollars(1.00), ProductCategory.BEVERAGES), 5);

        Thread[] threads = new Thread[5];
        for (int i = 0; i < 5; i++) {
            final int idx = i;
            threads[i] = new Thread(() -> {
                try {
                    machine.insertMoney(Money.DOLLAR);
                    machine.selectProduct("B1");
                    Product p = machine.dispense();
                    System.out.println("  Thread-" + idx + " dispensed: " + p.getName());
                } catch (Exception e) {
                    System.out.println("  Thread-" + idx + " failed: " + e.getMessage());
                    try { machine.cancelTransaction(); } catch (Exception ignored) {}
                }
            });
        }
        for (Thread t : threads) t.start();
        for (Thread t : threads) {
            try { t.join(); } catch (InterruptedException ignored) {}
        }
        System.out.println("Water remaining: " + machine.getSlot("B1").getQuantity());
        System.out.println();
    }
}
