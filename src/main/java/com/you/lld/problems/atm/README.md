# ATM System - LLD

Plain **Low-Level Design** for an ATM: interfaces, domain model, and in-memory service. No framework (no Spring Boot, REST, or DTOs).

## Structure

```
atm/
├── api/
│   └── ATMService.java          # authenticateCard, checkBalance, withdraw, deposit, changePin
├── model/
│   ├── Account.java             # balance, withdraw, deposit, transaction history
│   ├── Card.java                # cardNumber, pin validation, expiry, block after 3 fails
│   ├── CashDispenser.java       # denominations, dispenseCash(BigDecimal)
│   ├── Transaction.java        # id, type, amount, balanceAfter
│   ├── ATMState.java            # IDLE, CARD_INSERTED, PIN_ENTERED, ...
│   ├── AccountType.java         # SAVINGS, CURRENT, CREDIT
│   ├── CardStatus.java          # ACTIVE, BLOCKED, EXPIRED
│   └── TransactionType.java     # WITHDRAWAL, DEPOSIT, BALANCE_INQUIRY, PIN_CHANGE
└── impl/
    ├── ATMServiceImpl.java     # In-memory cards/accounts, uses CashDispenser
    ├── ATM.java                 # State machine: insertCard → enterPin → operations → ejectCard
    └── ATMDemo.java             # Demo using service + model
```

## Flow

1. **With ATM (state machine):** Insert card → Enter PIN → Check balance / Withdraw / Deposit / Change PIN → Eject card.
2. **Direct service:** Call `ATMService.checkBalance(accountNumber)`, `withdraw(accountNumber, amount)`, etc., after authenticating with `authenticateCard(cardNumber, pin)`.

## Design notes

- **Card:** PIN validation, 3 failed attempts → block; expiry check.
- **Account:** Thread-safe withdraw/deposit; transaction log.
- **CashDispenser:** Denomination inventory (e.g. 100, 50, 20, 10); dispense reduces inventory.
- **ATM:** Holds current card and state; delegates all operations to `ATMService`.

## Run demo

```bash
mvn compile exec:java -Dexec.mainClass="com.you.lld.problems.atm.impl.ATMDemo"
```
