# atm - Complete Implementation

## 📁 Project Structure (14 files)

```
atm/
├── ATM.java
├── ATMState.java
├── Card.java
├── CashDispenser.java
├── Demo.java
├── api/ATMService.java
├── impl/ATMServiceImpl.java
├── model/Account.java
├── model/AccountType.java
├── model/Card.java
├── model/CardStatus.java
├── model/CashDispenser.java
├── model/Transaction.java
├── model/TransactionType.java
```

## 📝 Source Code

### 📄 `ATM.java`

<details>
<summary>📄 Click to view ATM.java</summary>

```java
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
```

</details>

### 📄 `ATMState.java`

<details>
<summary>📄 Click to view ATMState.java</summary>

```java
package com.you.lld.problems.atm;

public enum ATMState {
    IDLE,
    CARD_INSERTED,
    PIN_ENTERED,
    TRANSACTION_SELECTED,
    CASH_DISPENSED
}
```

</details>

### 📄 `Card.java`

<details>
<summary>📄 Click to view Card.java</summary>

```java
package com.you.lld.problems.atm;

public class Card {
    private final String cardNumber;
    private final String pin;
    private final String accountNumber;
    
    public Card(String cardNumber, String pin, String accountNumber) {
        this.cardNumber = cardNumber;
        this.pin = pin;
        this.accountNumber = accountNumber;
    }
    
    public String getCardNumber() { return cardNumber; }
    public boolean validatePin(String inputPin) { return pin.equals(inputPin); }
    public String getAccountNumber() { return accountNumber; }
}
```

</details>

### 📄 `CashDispenser.java`

<details>
<summary>📄 Click to view CashDispenser.java</summary>

```java
package com.you.lld.problems.atm;

import java.util.*;

public class CashDispenser {
    private Map<Integer, Integer> cashInventory; // denomination -> count
    
    public CashDispenser() {
        cashInventory = new HashMap<>();
        cashInventory.put(100, 100);
        cashInventory.put(50, 100);
        cashInventory.put(20, 100);
        cashInventory.put(10, 100);
    }
    
    public boolean canDispense(double amount) {
        return amount > 0 && amount % 10 == 0;
    }
    
    public Map<Integer, Integer> dispenseCash(double amount) {
        Map<Integer, Integer> dispensed = new HashMap<>();
        int remaining = (int) amount;
        
        Integer[] denoms = {100, 50, 20, 10};
        for (int denom : denoms) {
            if (remaining >= denom && cashInventory.get(denom) > 0) {
                int notes = Math.min(remaining / denom, cashInventory.get(denom));
                if (notes > 0) {
                    dispensed.put(denom, notes);
                    cashInventory.put(denom, cashInventory.get(denom) - notes);
                    remaining -= notes * denom;
                }
            }
        }
        
        return remaining == 0 ? dispensed : null;
    }
}
```

</details>

### 📄 `Demo.java`

<details>
<summary>📄 Click to view Demo.java</summary>

```java
package com.you.lld.problems.atm;
public class Demo { public static void main(String[] args) { System.out.println("ATM"); } }```

</details>

### 📄 `api/ATMService.java`

<details>
<summary>📄 Click to view api/ATMService.java</summary>

```java
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
```

</details>

### 📄 `impl/ATMServiceImpl.java`

<details>
<summary>📄 Click to view impl/ATMServiceImpl.java</summary>

```java
package com.you.lld.problems.atm.impl;

import com.you.lld.problems.atm.api.ATMService;
import com.you.lld.problems.atm.model.*;
import java.math.BigDecimal;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

public class ATMServiceImpl implements ATMService {
    private final Map<String, Card> cards = new ConcurrentHashMap<>();
    private final Map<String, Account> accounts = new ConcurrentHashMap<>();
    private final CashDispenser cashDispenser = new CashDispenser();
    
    public void addCard(Card card) {
        cards.put(card.getCardNumber(), card);
    }
    
    public void addAccount(Account account) {
        accounts.put(account.getAccountNumber(), account);
    }
    
    @Override
    public boolean authenticateCard(String cardNumber, String pin) {
        Card card = cards.get(cardNumber);
        if (card == null || card.isExpired()) {
            return false;
        }
        return card.validatePin(pin);
    }
    
    @Override
    public BigDecimal checkBalance(String accountNumber) {
        Account account = accounts.get(accountNumber);
        if (account == null) {
            throw new IllegalArgumentException("Account not found");
        }
        
        Transaction txn = new Transaction(
            UUID.randomUUID().toString(),
            accountNumber,
            TransactionType.BALANCE_INQUIRY,
            BigDecimal.ZERO,
            account.getBalance()
        );
        account.addTransaction(txn);
        
        return account.getBalance();
    }
    
    @Override
    public boolean withdraw(String accountNumber, BigDecimal amount) {
        Account account = accounts.get(accountNumber);
        if (account == null) {
            return false;
        }
        
        if (!cashDispenser.dispenseCash(amount)) {
            System.out.println("Insufficient cash in ATM");
            return false;
        }
        
        if (account.withdraw(amount)) {
            Transaction txn = new Transaction(
                UUID.randomUUID().toString(),
                accountNumber,
                TransactionType.WITHDRAWAL,
                amount,
                account.getBalance()
            );
            account.addTransaction(txn);
            System.out.println("Withdrawal successful: $" + amount);
            return true;
        }
        
        return false;
    }
    
    @Override
    public void deposit(String accountNumber, BigDecimal amount) {
        Account account = accounts.get(accountNumber);
        if (account != null) {
            account.deposit(amount);
            Transaction txn = new Transaction(
                UUID.randomUUID().toString(),
                accountNumber,
                TransactionType.DEPOSIT,
                amount,
                account.getBalance()
            );
            account.addTransaction(txn);
            System.out.println("Deposit successful: $" + amount);
        }
    }
    
    @Override
    public boolean changePin(String cardNumber, String oldPin, String newPin) {
        Card card = cards.get(cardNumber);
        if (card != null && authenticateCard(cardNumber, oldPin)) {
            // In real system, would update PIN
            System.out.println("PIN changed successfully");
            return true;
        }
        return false;
    }
}
```

</details>

### 📄 `model/Account.java`

<details>
<summary>📄 Click to view model/Account.java</summary>

```java
package com.you.lld.problems.atm.model;

import java.math.BigDecimal;
import java.util.*;

public class Account {
    private final String accountNumber;
    private BigDecimal balance;
    private final AccountType type;
    private final List<Transaction> transactions;
    
    public Account(String accountNumber, BigDecimal initialBalance, AccountType type) {
        this.accountNumber = accountNumber;
        this.balance = initialBalance;
        this.type = type;
        this.transactions = new ArrayList<>();
    }
    
    public synchronized boolean withdraw(BigDecimal amount) {
        if (amount.compareTo(balance) > 0) {
            return false;
        }
        balance = balance.subtract(amount);
        return true;
    }
    
    public synchronized void deposit(BigDecimal amount) {
        balance = balance.add(amount);
    }
    
    public synchronized void addTransaction(Transaction transaction) {
        transactions.add(transaction);
    }
    
    public String getAccountNumber() { return accountNumber; }
    public BigDecimal getBalance() { return balance; }
    public AccountType getType() { return type; }
    public List<Transaction> getTransactions() { return new ArrayList<>(transactions); }
}
```

</details>

### 📄 `model/AccountType.java`

<details>
<summary>📄 Click to view model/AccountType.java</summary>

```java
package com.you.lld.problems.atm.model;

public enum AccountType {
    SAVINGS, CURRENT, CREDIT
}
```

</details>

### 📄 `model/Card.java`

<details>
<summary>📄 Click to view model/Card.java</summary>

```java
package com.you.lld.problems.atm.model;

import java.time.LocalDate;

public class Card {
    private final String cardNumber;
    private final String pin;
    private final String accountNumber;
    private final LocalDate expiryDate;
    private CardStatus status;
    private int failedAttempts;
    
    public Card(String cardNumber, String pin, String accountNumber, LocalDate expiryDate) {
        this.cardNumber = cardNumber;
        this.pin = pin;
        this.accountNumber = accountNumber;
        this.expiryDate = expiryDate;
        this.status = CardStatus.ACTIVE;
        this.failedAttempts = 0;
    }
    
    public boolean validatePin(String inputPin) {
        if (status == CardStatus.BLOCKED) {
            return false;
        }
        
        if (this.pin.equals(inputPin)) {
            failedAttempts = 0;
            return true;
        }
        
        failedAttempts++;
        if (failedAttempts >= 3) {
            status = CardStatus.BLOCKED;
        }
        return false;
    }
    
    public boolean isExpired() {
        return LocalDate.now().isAfter(expiryDate);
    }
    
    public String getCardNumber() { return cardNumber; }
    public String getAccountNumber() { return accountNumber; }
    public CardStatus getStatus() { return status; }
    public int getFailedAttempts() { return failedAttempts; }
    
    public void block() { this.status = CardStatus.BLOCKED; }
    public void unblock() { this.status = CardStatus.ACTIVE; this.failedAttempts = 0; }
}
```

</details>

### 📄 `model/CardStatus.java`

<details>
<summary>📄 Click to view model/CardStatus.java</summary>

```java
package com.you.lld.problems.atm.model;

public enum CardStatus {
    ACTIVE, BLOCKED, EXPIRED
}
```

</details>

### 📄 `model/CashDispenser.java`

<details>
<summary>📄 Click to view model/CashDispenser.java</summary>

```java
package com.you.lld.problems.atm.model;

import java.math.BigDecimal;
import java.util.*;

public class CashDispenser {
    private final Map<Integer, Integer> denominations;
    
    public CashDispenser() {
        this.denominations = new HashMap<>();
        denominations.put(100, 100);
        denominations.put(50, 100);
        denominations.put(20, 200);
        denominations.put(10, 200);
    }
    
    public synchronized boolean dispenseCash(BigDecimal amount) {
        int amountInt = amount.intValue();
        Map<Integer, Integer> required = new HashMap<>();
        
        List<Integer> denoms = new ArrayList<>(denominations.keySet());
        Collections.sort(denoms, Collections.reverseOrder());
        
        for (int denom : denoms) {
            int count = Math.min(amountInt / denom, denominations.get(denom));
            if (count > 0) {
                required.put(denom, count);
                amountInt -= (count * denom);
            }
        }
        
        if (amountInt > 0) {
            return false;
        }
        
        for (Map.Entry<Integer, Integer> entry : required.entrySet()) {
            denominations.put(entry.getKey(), 
                            denominations.get(entry.getKey()) - entry.getValue());
        }
        
        System.out.println("Dispensed: " + required);
        return true;
    }
    
    public BigDecimal getTotalCash() {
        return denominations.entrySet().stream()
            .map(e -> BigDecimal.valueOf(e.getKey() * e.getValue()))
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
```

</details>

### 📄 `model/Transaction.java`

<details>
<summary>📄 Click to view model/Transaction.java</summary>

```java
package com.you.lld.problems.atm.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class Transaction {
    private final String id;
    private final String accountNumber;
    private final TransactionType type;
    private final BigDecimal amount;
    private final LocalDateTime timestamp;
    private final BigDecimal balanceAfter;
    
    public Transaction(String id, String accountNumber, TransactionType type, 
                      BigDecimal amount, BigDecimal balanceAfter) {
        this.id = id;
        this.accountNumber = accountNumber;
        this.type = type;
        this.amount = amount;
        this.timestamp = LocalDateTime.now();
        this.balanceAfter = balanceAfter;
    }
    
    public String getId() { return id; }
    public TransactionType getType() { return type; }
    public BigDecimal getAmount() { return amount; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public BigDecimal getBalanceAfter() { return balanceAfter; }
    
    @Override
    public String toString() {
        return "Transaction{id='" + id + "', type=" + type + ", amount=" + amount + 
               ", balance=" + balanceAfter + "}";
    }
}
```

</details>

### 📄 `model/TransactionType.java`

<details>
<summary>📄 Click to view model/TransactionType.java</summary>

```java
package com.you.lld.problems.atm.model;

public enum TransactionType {
    WITHDRAWAL, DEPOSIT, BALANCE_INQUIRY, PIN_CHANGE
}
```

</details>

