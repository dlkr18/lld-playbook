package com.you.lld.problems.atm.impl;

import com.you.lld.problems.atm.api.ATMService;
import com.you.lld.problems.atm.model.*;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Demo: ATM flow using service + model (LLD style).
 */
public class ATMDemo {

    public static void main(String[] args) {
        System.out.println("=== ATM System Demo (LLD) ===\n");

        // 1. Create accounts and cards
        Account account1 = new Account("ACC001", new BigDecimal("1000.00"), AccountType.SAVINGS);
        Card card1 = new Card("4111111111111111", "1234", "ACC001", LocalDate.now().plusYears(2));

        Account account2 = new Account("ACC002", new BigDecimal("500.00"), AccountType.CURRENT);
        Card card2 = new Card("4222222222222222", "5678", "ACC002", LocalDate.now().plusYears(2));

        // 2. Create service and register data
        ATMServiceImpl serviceImpl = new ATMServiceImpl();
        serviceImpl.addAccount(account1);
        serviceImpl.addAccount(account2);
        serviceImpl.addCard(card1);
        serviceImpl.addCard(card2);

        ATMService service = serviceImpl;

        // 3. Use ATM (state machine)
        ATM atm = new ATM(service);

        System.out.println("--- Session 1: Card 1 ---");
        System.out.println("Insert card: " + atm.insertCard(card1));
        System.out.println("Enter PIN: " + atm.enterPin("1234"));
        System.out.println("Balance: $" + atm.checkBalance());
        System.out.println("Withdraw $200: " + atm.withdraw(new BigDecimal("200")));
        System.out.println("Balance after withdraw: $" + atm.checkBalance());
        atm.deposit(new BigDecimal("50"));
        System.out.println("Deposit $50. Balance: $" + atm.checkBalance());
        atm.ejectCard();
        System.out.println("Card ejected. State: " + atm.getState() + "\n");

        System.out.println("--- Session 2: Card 2 ---");
        System.out.println("Insert card: " + atm.insertCard(card2));
        System.out.println("Wrong PIN: " + atm.enterPin("0000"));
        System.out.println("Correct PIN: " + atm.enterPin("5678"));
        System.out.println("Balance: $" + atm.checkBalance());
        System.out.println("Withdraw $100: " + atm.withdraw(new BigDecimal("100")));
        atm.ejectCard();
        System.out.println("Card ejected.\n");

        System.out.println("--- Direct service usage (no ATM machine) ---");
        System.out.println("Balance ACC001: $" + service.checkBalance("ACC001"));
        System.out.println("Balance ACC002: $" + service.checkBalance("ACC002"));

        System.out.println("\n=== Demo complete ===");
    }
}
