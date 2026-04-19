package com.you.lld.problems.atm;

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
