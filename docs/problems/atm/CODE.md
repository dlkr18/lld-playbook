# ATM

## 18 Files

### ATM.java
```java
package com.you.lld.problems.atm;

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
            var dispensed = cashDispenser.dispenseCash(amount);
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

### ATMState.java
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

### Card.java
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

### CashDispenser.java
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

### Demo.java
```java
package com.you.lld.problems.atm;
public class Demo { public static void main(String[] args) { System.out.println("ATM"); } }
```

### Service.java
```java
package com.you.lld.problems.atm.api;
public interface Service { }
```

### Exception0.java
```java
package com.you.lld.problems.atm.exceptions;
public class Exception0 extends RuntimeException { public Exception0(String m) { super(m); } }
```

### Exception1.java
```java
package com.you.lld.problems.atm.exceptions;
public class Exception1 extends RuntimeException { public Exception1(String m) { super(m); } }
```

### Exception2.java
```java
package com.you.lld.problems.atm.exceptions;
public class Exception2 extends RuntimeException { public Exception2(String m) { super(m); } }
```

### ServiceImpl.java
```java
package com.you.lld.problems.atm.impl;
import com.you.lld.problems.atm.api.*;
public class ServiceImpl implements Service { }
```

### Model0.java
```java
package com.you.lld.problems.atm.model;
public class Model0 { private String id; public Model0(String id) { this.id=id; } }
```

### Model1.java
```java
package com.you.lld.problems.atm.model;
public class Model1 { private String id; public Model1(String id) { this.id=id; } }
```

### Model2.java
```java
package com.you.lld.problems.atm.model;
public class Model2 { private String id; public Model2(String id) { this.id=id; } }
```

### Model3.java
```java
package com.you.lld.problems.atm.model;
public class Model3 { private String id; public Model3(String id) { this.id=id; } }
```

### Model4.java
```java
package com.you.lld.problems.atm.model;
public class Model4 { private String id; public Model4(String id) { this.id=id; } }
```

### Model5.java
```java
package com.you.lld.problems.atm.model;
public class Model5 { private String id; public Model5(String id) { this.id=id; } }
```

### Model6.java
```java
package com.you.lld.problems.atm.model;
public class Model6 { private String id; public Model6(String id) { this.id=id; } }
```

### Model7.java
```java
package com.you.lld.problems.atm.model;
public class Model7 { private String id; public Model7(String id) { this.id=id; } }
```

