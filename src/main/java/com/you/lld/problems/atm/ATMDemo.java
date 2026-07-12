package com.you.lld.problems.atm;

import com.you.lld.problems.atm.model.Account;
import com.you.lld.problems.atm.model.Card;
import com.you.lld.problems.atm.service.impl.CashDispenser;
import com.you.lld.problems.atm.service.impl.InMemoryBankService;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Interview walkthrough — one scenario per design point.
 *
 *  1. Happy path — full session: balance → withdraw → deposit → eject
 *  2. Wrong PIN  — retry succeeds, 3 fails → card blocked (State transition)
 *  3. Insufficient funds — account has less than requested
 *  4. ATM cash limits — dispenser cannot make exact change
 */
public class ATMDemo {

    public static void main(String[] args) {
        InMemoryBankService bank = setupBank();
        CashDispenser dispenser = CashDispenser.withDefaultStock();
        ATM atm = new ATM(bank, dispenser);

        happyPath(atm);
        wrongPinAndBlock(atm, bank);
        insufficientFunds(atm, bank);
        dispenserLimit(atm, bank);

        System.out.println("\n=== done ===");
    }

    private static void happyPath(ATM atm) {
        System.out.println("\n── 1. Happy path ──");
        Card card = getCard("4111");
        atm.insertCard(card);
        System.out.println("  state: " + atm.stateName());

        atm.enterPin("1234");
        System.out.println("  state: " + atm.stateName());

        System.out.println("  balance: $" + atm.checkBalance());
        System.out.println("  withdraw $200: " + atm.withdraw(new BigDecimal("200")));
        atm.deposit(new BigDecimal("50"));
        System.out.println("  balance: $" + atm.checkBalance());

        atm.ejectCard();
        System.out.println("  state: " + atm.stateName());
    }

    private static void wrongPinAndBlock(ATM atm, InMemoryBankService bank) {
        System.out.println("\n── 2. Wrong PIN → card block ──");
        Card card = getCard("4222");
        atm.insertCard(card);

        safe("wrong PIN 1", () -> atm.enterPin("0000"));
        safe("wrong PIN 2", () -> atm.enterPin("0000"));
        safe("wrong PIN 3", () -> atm.enterPin("0000"));

        System.out.println("  card blocked: " + card.isBlocked());
        System.out.println("  state: " + atm.stateName());
    }

    private static void insufficientFunds(ATM atm, InMemoryBankService bank) {
        System.out.println("\n── 3. Insufficient funds ──");
        Card card = getCard("4111");
        atm.insertCard(card);
        atm.enterPin("1234");

        System.out.println("  withdraw $999999: " + atm.withdraw(new BigDecimal("999999")));
        System.out.println("  balance unchanged: $" + atm.checkBalance());

        atm.ejectCard();
    }

    private static void dispenserLimit(ATM atm, InMemoryBankService bank) {
        System.out.println("\n── 4. ATM cannot make exact change ──");
        Card card = getCard("4111");
        atm.insertCard(card);
        atm.enterPin("1234");

        safe("withdraw $7", () -> atm.withdraw(new BigDecimal("7")));

        atm.ejectCard();
    }

    // ── setup ──

    private static final Card CARD_1 = new Card("4111", "1234", "ACC001", LocalDate.now().plusYears(2));
    private static final Card CARD_2 = new Card("4222", "5678", "ACC002", LocalDate.now().plusYears(2));

    private static Card getCard(String number) {
        if ("4111".equals(number)) return CARD_1;
        if ("4222".equals(number)) return CARD_2;
        throw new IllegalArgumentException("unknown card");
    }

    private static InMemoryBankService setupBank() {
        InMemoryBankService bank = new InMemoryBankService();
        bank.addAccount(new Account("ACC001", new BigDecimal("1000.00")));
        bank.addAccount(new Account("ACC002", new BigDecimal("500.00")));
        bank.addCard(CARD_1);
        bank.addCard(CARD_2);
        return bank;
    }

    private static void safe(String label, Runnable r) {
        try {
            r.run();
        } catch (Exception e) {
            System.out.println("  " + label + " → " + e.getMessage());
        }
    }
}
