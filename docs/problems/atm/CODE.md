# ATM System

## Problem: Design an ATM Machine

**Difficulty**: Medium  
**Pattern**: State, Chain of Responsibility  
**Time**: 45-60 min

---

## Key Classes

```java
enum ATMState { IDLE, CARD_INSERTED, PIN_ENTERED, AUTHENTICATED }

class ATM {
    private ATMState state;
    private CardReader cardReader;
    private CashDispenser cashDispenser;
    private BankingService bankingService;
    
    void insertCard(Card card);
    boolean enterPIN(String pin);
    void selectTransaction(TransactionType type);
    CashWithdrawalResult withdraw(double amount);
}

class CashDispenser {
    Map<Denomination, Integer> cashInventory;
    
    List<Note> dispenseCash(double amount) {
        // Chain of Responsibility for denomination selection
    }
}

enum Denomination { HUNDRED(100), FIFTY(50), TWENTY(20), TEN(10) }
```

---

**Status**: ✅ Documented | [View Master Guide](../ALL_PROBLEMS_MASTER_GUIDE)
