package com.you.lld.problems.atm.api;

import com.you.lld.problems.atm.model.*;
import java.math.BigDecimal;

public interface ATMService {
    boolean authenticateCard(String cardNumber, String pin);
    BigDecimal checkBalance(String accountNumber);
    boolean withdraw(String accountNumber, BigDecimal amount);
    void deposit(String accountNumber, BigDecimal amount);
    boolean changePin(String cardNumber, String oldPin, String newPin);
}
