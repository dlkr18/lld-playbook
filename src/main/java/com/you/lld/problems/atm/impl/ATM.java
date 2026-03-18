package com.you.lld.problems.atm.impl;

import com.you.lld.problems.atm.api.ATMService;
import com.you.lld.problems.atm.model.ATMState;
import com.you.lld.problems.atm.model.Card;

import java.math.BigDecimal;

/**
 * ATM machine: state machine that delegates to ATMService.
 * User inserts card → enters PIN → performs operations → ejects card.
 */
public class ATM {
    private ATMState state = ATMState.IDLE;
    private Card currentCard;
    private final ATMService service;

    public ATM(ATMService service) {
        this.service = service;
    }

    public boolean insertCard(Card card) {
        if (state != ATMState.IDLE) {
            return false;
        }
        if (card == null || card.isExpired()) {
            return false;
        }
        this.currentCard = card;
        this.state = ATMState.CARD_INSERTED;
        return true;
    }

    public boolean enterPin(String pin) {
        if (state != ATMState.CARD_INSERTED || currentCard == null) {
            return false;
        }
        if (service.authenticateCard(currentCard.getCardNumber(), pin)) {
            this.state = ATMState.PIN_ENTERED;
            return true;
        }
        return false;
    }

    public BigDecimal checkBalance() {
        if (state != ATMState.PIN_ENTERED || currentCard == null) {
            return null;
        }
        return service.checkBalance(currentCard.getAccountNumber());
    }

    public boolean withdraw(BigDecimal amount) {
        if (state != ATMState.PIN_ENTERED || currentCard == null) {
            return false;
        }
        return service.withdraw(currentCard.getAccountNumber(), amount);
    }

    public void deposit(BigDecimal amount) {
        if (state != ATMState.PIN_ENTERED || currentCard == null) {
            return;
        }
        service.deposit(currentCard.getAccountNumber(), amount);
    }

    public boolean changePin(String oldPin, String newPin) {
        if (state != ATMState.PIN_ENTERED || currentCard == null) {
            return false;
        }
        return service.changePin(currentCard.getCardNumber(), oldPin, newPin);
    }

    public void ejectCard() {
        this.currentCard = null;
        this.state = ATMState.IDLE;
    }

    public ATMState getState() {
        return state;
    }
}
