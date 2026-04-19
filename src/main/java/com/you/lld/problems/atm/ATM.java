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
