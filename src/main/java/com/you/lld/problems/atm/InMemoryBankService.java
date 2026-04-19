package com.you.lld.problems.atm;

import com.you.lld.problems.atm.model.Account;
import com.you.lld.problems.atm.model.Card;

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
