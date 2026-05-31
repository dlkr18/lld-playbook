# atm - Complete Implementation

> Generated from `src/main/java/com/you/lld/problems/atm/` on 2026-05-31. Re-run `python3 scripts/generate-code-md.py atm`.

## Project Structure (8 files)

```
atm/
├── ATMDemo.java
├── ATM.java
├── model/Account.java
├── model/Card.java
├── model/Transaction.java
├── service/BankService.java
├── service/impl/CashDispenser.java
├── service/impl/InMemoryBankService.java
```

## Source Code

### `ATMDemo.java`

<details>
<summary>Click to view ATMDemo.java</summary>

```java
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
```

</details>

### `ATM.java`

<details>
<summary>Click to view ATM.java</summary>

```java
package com.you.lld.problems.atm;

import com.you.lld.problems.atm.model.Card;
import com.you.lld.problems.atm.model.Transaction;
import com.you.lld.problems.atm.service.BankService;
import com.you.lld.problems.atm.service.impl.CashDispenser;

import java.math.BigDecimal;
import java.util.Map;

/**
 * ATM state machine.
 * <p>
 * State pattern: each state (Idle, HasCard, Authenticated) is an inner class
 * implementing the {@link State} interface. Invalid operations for a given
 * state throw IllegalStateException — no silent failures.
 * <p>
 * Transitions:
 * IDLE  →(insertCard)→  HAS_CARD  →(enterPin)→  AUTHENTICATED
 * ↕ (balance/withdraw/deposit)
 * IDLE  ←(ejectCard)←  ←  ←  ←  ←  ←  ←  ←  ←  ←  ←
 */
public final class ATM {

    private final BankService bank;
    private final CashDispenser dispenser;

    private State state;
    private Card currentCard;

    public ATM(BankService bank, CashDispenser dispenser) {
        this.bank = bank;
        this.dispenser = dispenser;
        this.state = new IdleState();
    }

    // ── public API — delegates to current state ──

    public void insertCard(Card card) {
        state.insertCard(this, card);
    }

    public void enterPin(String pin) {
        state.enterPin(this, pin);
    }

    public BigDecimal checkBalance() {
        return state.checkBalance(this);
    }

    public boolean withdraw(BigDecimal amt) {
        return state.withdraw(this, amt);
    }

    public void deposit(BigDecimal amt) {
        state.deposit(this, amt);
    }

    public void ejectCard() {
        state.ejectCard(this);
    }

    public String stateName() {
        return state.name();
    }

    // ── State interface ──

    private interface State {
        String name();

        default void insertCard(ATM atm, Card card) {
            throw new IllegalStateException("cannot insert card in " + name());
        }

        default void enterPin(ATM atm, String pin) {
            throw new IllegalStateException("cannot enter PIN in " + name());
        }

        default BigDecimal checkBalance(ATM atm) {
            throw new IllegalStateException("cannot check balance in " + name());
        }

        default boolean withdraw(ATM atm, BigDecimal amt) {
            throw new IllegalStateException("cannot withdraw in " + name());
        }

        default void deposit(ATM atm, BigDecimal amt) {
            throw new IllegalStateException("cannot deposit in " + name());
        }

        default void ejectCard(ATM atm) {
            throw new IllegalStateException("cannot eject card in " + name());
        }
    }

    // ── Concrete states ──

    private static final class IdleState implements State {
        @Override
        public String name() {
            return "IDLE";
        }

        @Override
        public void insertCard(ATM atm, Card card) {
            if (card == null) throw new IllegalArgumentException("card is null");
            if (!card.isUsable()) throw new IllegalArgumentException("card is expired or blocked");
            atm.currentCard = card;
            atm.state = new HasCardState();
        }
    }

    private static final class HasCardState implements State {
        @Override
        public String name() {
            return "HAS_CARD";
        }

        @Override
        public void enterPin(ATM atm, String pin) {
            boolean ok = atm.bank.authenticate(atm.currentCard.getCardNumber(), pin);
            if (!ok) {
                if (atm.currentCard.isBlocked()) {
                    atm.currentCard = null;
                    atm.state = new IdleState();
                    throw new IllegalStateException("card blocked after too many attempts — ejected");
                }
                throw new IllegalArgumentException("wrong PIN");
            }
            atm.state = new AuthenticatedState();
        }

        @Override
        public void ejectCard(ATM atm) {
            atm.currentCard = null;
            atm.state = new IdleState();
        }
    }

    private static final class AuthenticatedState implements State {
        @Override
        public String name() {
            return "AUTHENTICATED";
        }

        @Override
        public BigDecimal checkBalance(ATM atm) {
            String acct = atm.currentCard.getAccountNumber();
            BigDecimal bal = atm.bank.getBalance(acct);
            atm.recordTxn(acct, Transaction.Type.BALANCE_INQUIRY, BigDecimal.ZERO, bal);
            return bal;
        }

        @Override
        public boolean withdraw(ATM atm, BigDecimal amount) {
            String acct = atm.currentCard.getAccountNumber();

            // 1. Check account has enough funds
            if (!atm.bank.debit(acct, amount)) return false;

            // 2. Check ATM can make exact change — if not, refund
            Map<Integer, Integer> plan = atm.dispenser.tryDispense(amount.intValue());
            if (plan == null) {
                atm.bank.credit(acct, amount);
                throw new IllegalStateException("ATM cannot dispense $" + amount + " (refunded)");
            }

            // 3. Dispense
            atm.dispenser.deduct(plan);
            BigDecimal bal = atm.bank.getBalance(acct);
            atm.recordTxn(acct, Transaction.Type.WITHDRAWAL, amount, bal);
            return true;
        }

        @Override
        public void deposit(ATM atm, BigDecimal amount) {
            String acct = atm.currentCard.getAccountNumber();
            atm.bank.credit(acct, amount);
            BigDecimal bal = atm.bank.getBalance(acct);
            atm.recordTxn(acct, Transaction.Type.DEPOSIT, amount, bal);
        }

        @Override
        public void ejectCard(ATM atm) {
            atm.currentCard = null;
            atm.state = new IdleState();
        }
    }

    // ── helpers ──

    private void recordTxn(String acct, Transaction.Type type, BigDecimal amt, BigDecimal balAfter) {
        // In a full system, the bank service would persist this.
        System.out.println("  [txn] " + type + " $" + amt + " → balance=$" + balAfter);
    }
}
```

</details>

### `model/Account.java`

<details>
<summary>Click to view model/Account.java</summary>

```java
package com.you.lld.problems.atm.model;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

/**
 * Bank account with synchronized balance operations.
 * <p>
 * All money-mutating ops are synchronized on the account instance.
 * getBalance() is also synchronized to guarantee visibility.
 */
public final class Account {

    private final String accountNumber;
    private BigDecimal balance;
    private final List<Transaction> transactions = new ArrayList<>();

    public Account(String accountNumber, BigDecimal initialBalance) {
        this.accountNumber = accountNumber;
        this.balance = initialBalance;
    }

    public synchronized boolean debit(BigDecimal amount) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) return false;
        if (amount.compareTo(balance) > 0) return false;
        balance = balance.subtract(amount);
        return true;
    }

    public synchronized void credit(BigDecimal amount) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) throw new IllegalArgumentException("amount must be positive");
        balance = balance.add(amount);
    }

    public synchronized BigDecimal getBalance() {
        return balance;
    }

    public synchronized void addTransaction(Transaction txn) {
        transactions.add(txn);
    }

    public synchronized List<Transaction> getTransactions() {
        return new ArrayList<>(transactions);
    }

    public String getAccountNumber() {
        return accountNumber;
    }

    @Override
    public String toString() {
        return "Account{" + accountNumber + ", $" + getBalance() + "}";
    }
}
```

</details>

### `model/Card.java`

<details>
<summary>Click to view model/Card.java</summary>

```java
package com.you.lld.problems.atm.model;

import java.time.LocalDate;

/**
 * Debit/credit card with PIN validation and auto-block after 3 failed attempts.
 */
public final class Card {

    private static final int MAX_ATTEMPTS = 3;

    private final String cardNumber;
    private final String accountNumber;
    private final LocalDate expiryDate;
    private String pin;
    private boolean blocked;
    private int failedAttempts;

    public Card(String cardNumber, String pin, String accountNumber, LocalDate expiryDate) {
        this.cardNumber = cardNumber;
        this.pin = pin;
        this.accountNumber = accountNumber;
        this.expiryDate = expiryDate;
    }

    public boolean validatePin(String input) {
        if (blocked) return false;
        if (pin.equals(input)) {
            failedAttempts = 0;
            return true;
        }
        failedAttempts++;
        if (failedAttempts >= MAX_ATTEMPTS) blocked = true;
        return false;
    }

    public void changePin(String oldPin, String newPin) {
        if (!pin.equals(oldPin)) throw new IllegalArgumentException("old PIN incorrect");
        if (newPin == null || newPin.length() < 4) throw new IllegalArgumentException("new PIN too short");
        this.pin = newPin;
    }

    public boolean isExpired() {
        return LocalDate.now().isAfter(expiryDate);
    }

    public boolean isBlocked() {
        return blocked;
    }

    public boolean isUsable() {
        return !blocked && !isExpired();
    }

    public String getCardNumber() {
        return cardNumber;
    }

    public String getAccountNumber() {
        return accountNumber;
    }

    @Override
    public String toString() {
        return "Card{" + cardNumber.substring(cardNumber.length() - 4) + "}";
    }
}
```

</details>

### `model/Transaction.java`

<details>
<summary>Click to view model/Transaction.java</summary>

```java
package com.you.lld.problems.atm.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Immutable record of a completed ATM operation.
 */
public final class Transaction {

    public enum Type {WITHDRAWAL, DEPOSIT, BALANCE_INQUIRY}

    private final String id;
    private final String accountNumber;
    private final Type type;
    private final BigDecimal amount;
    private final BigDecimal balanceAfter;
    private final LocalDateTime timestamp;

    public Transaction(String id, String accountNumber, Type type,
                       BigDecimal amount, BigDecimal balanceAfter) {
        this.id = id;
        this.accountNumber = accountNumber;
        this.type = type;
        this.amount = amount;
        this.balanceAfter = balanceAfter;
        this.timestamp = LocalDateTime.now();
    }

    public String getId() {
        return id;
    }

    public Type getType() {
        return type;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public BigDecimal getBalanceAfter() {
        return balanceAfter;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    @Override
    public String toString() {
        return type + " $" + amount + " → bal=$" + balanceAfter;
    }
}
```

</details>

### `service/BankService.java`

<details>
<summary>Click to view service/BankService.java</summary>

```java
package com.you.lld.problems.atm.service;

import com.you.lld.problems.atm.model.Card;

import java.math.BigDecimal;

/**
 * Backend banking operations that the ATM delegates to.
 *
 * In a real system this would be an RPC call to the bank.
 * Here it's an in-memory impl for the interview.
 */
public interface BankService {

    boolean authenticate(String cardNumber, String pin);

    BigDecimal getBalance(String accountNumber);

    boolean debit(String accountNumber, BigDecimal amount);

    void credit(String accountNumber, BigDecimal amount);

    Card getCard(String cardNumber);
}
```

</details>

### `service/impl/CashDispenser.java`

<details>
<summary>Click to view service/impl/CashDispenser.java</summary>

```java
package com.you.lld.problems.atm.service.impl;

import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.TreeMap;

/**
 * Manages physical cash denominations and dispenses using a greedy algorithm.
 *
 * Greedy: try largest denomination first, use as many as possible, then
 * move to the next. Works correctly when denominations are standard
 * (100, 50, 20, 10). For exotic denominations, you'd need DP — mention
 * verbally if asked.
 */
public final class CashDispenser {

    private final TreeMap<Integer, Integer> stock;

    public CashDispenser(Map<Integer, Integer> initialStock) {
        this.stock = new TreeMap<>(Collections.reverseOrder());
        this.stock.putAll(initialStock);
    }

    /** Default ATM load: 100×50, 50×50, 20×100, 10×100. */
    public static CashDispenser withDefaultStock() {
        Map<Integer, Integer> s = new LinkedHashMap<>();
        s.put(100, 50);
        s.put(50, 50);
        s.put(20, 100);
        s.put(10, 100);
        return new CashDispenser(s);
    }

    /**
     * Try to dispense {@code amount} using available denominations.
     * Returns a denomination→count map on success, or null if not possible.
     * Does NOT modify stock — call {@link #deduct} after confirming the account debit.
     */
    public Map<Integer, Integer> tryDispense(int amount) {
        if (amount <= 0) return null;
        Map<Integer, Integer> plan = new LinkedHashMap<>();
        int remaining = amount;

        for (Map.Entry<Integer, Integer> e : stock.entrySet()) {
            int denom = e.getKey();
            int available = e.getValue();
            int count = Math.min(remaining / denom, available);
            if (count > 0) {
                plan.put(denom, count);
                remaining -= count * denom;
            }
        }
        return remaining == 0 ? plan : null;
    }

    /** Deduct notes after a successful dispense. */
    public void deduct(Map<Integer, Integer> plan) {
        for (Map.Entry<Integer, Integer> e : plan.entrySet()) {
            stock.merge(e.getKey(), -e.getValue(), Integer::sum);
        }
    }

    public int totalCash() {
        return stock.entrySet().stream()
            .mapToInt(e -> e.getKey() * e.getValue())
            .sum();
    }

    @Override
    public String toString() {
        return "CashDispenser{total=$" + totalCash() + ", stock=" + stock + "}";
    }
}
```

</details>

### `service/impl/InMemoryBankService.java`

<details>
<summary>Click to view service/impl/InMemoryBankService.java</summary>

```java
package com.you.lld.problems.atm.service.impl;

import com.you.lld.problems.atm.model.Account;
import com.you.lld.problems.atm.model.Card;
import com.you.lld.problems.atm.service.BankService;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

/** In-memory bank backend for demo / testing. */
public final class InMemoryBankService implements BankService {

    private final Map<String, Card> cards = new HashMap<>();
    private final Map<String, Account> accounts = new HashMap<>();

    public void addCard(Card card)       { cards.put(card.getCardNumber(), card); }
    public void addAccount(Account acct) { accounts.put(acct.getAccountNumber(), acct); }

    @Override
    public boolean authenticate(String cardNumber, String pin) {
        Card card = cards.get(cardNumber);
        return card != null && card.isUsable() && card.validatePin(pin);
    }

    @Override
    public BigDecimal getBalance(String accountNumber) {
        return requireAccount(accountNumber).getBalance();
    }

    @Override
    public boolean debit(String accountNumber, BigDecimal amount) {
        return requireAccount(accountNumber).debit(amount);
    }

    @Override
    public void credit(String accountNumber, BigDecimal amount) {
        requireAccount(accountNumber).credit(amount);
    }

    @Override
    public Card getCard(String cardNumber) {
        return cards.get(cardNumber);
    }

    private Account requireAccount(String accountNumber) {
        Account a = accounts.get(accountNumber);
        if (a == null) throw new IllegalArgumentException("unknown account: " + accountNumber);
        return a;
    }
}
```

</details>

## Run Demo

```bash
mvn -q compile exec:java -Dexec.mainClass="com.you.lld.problems.atm.ATMDemo"
```
