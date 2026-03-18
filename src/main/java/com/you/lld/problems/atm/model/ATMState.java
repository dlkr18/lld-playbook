package com.you.lld.problems.atm.model;

/**
 * States of the ATM during a session.
 */
public enum ATMState {
    IDLE,
    CARD_INSERTED,
    PIN_ENTERED,
    TRANSACTION_SELECTED,
    CASH_DISPENSED
}
