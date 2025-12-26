package com.you.lld.problems.atm;

import java.util.Map;

public class ATM {
    private ATMState state;
    private Card currentCard;
    private CashDispenser cashDispenser;
    
    public ATM() {
        this.state = ATMState.IDLE;
        this.cashDispenser = new CashDispenser();
    }
    
    public boolean insertCard(Card card) {
        if (state != ATMState.IDLE) {
            return false;
        }
        this.currentCard = card;
        this.state = ATMState.CARD_INSERTED;
        return true;
    }
    
    public boolean enterPIN(String pin) {
        if (state != ATMState.CARD_INSERTED) {
            return false;
        }
        if (currentCard.validatePin(pin)) {
            state = ATMState.PIN_ENTERED;
            return true;
        }
        return false;
    }
    
    public boolean withdraw(double amount) {
        if (state != ATMState.PIN_ENTERED) {
            return false;
        }
        if (cashDispenser.canDispense(amount)) {
            Map<Integer, Integer> dispensed = cashDispenser.dispenseCash(amount);
            if (dispensed != null) {
                state = ATMState.CASH_DISPENSED;
                return true;
            }
        }
        return false;
    }
    
    public void ejectCard() {
        this.currentCard = null;
        this.state = ATMState.IDLE;
    }
}
