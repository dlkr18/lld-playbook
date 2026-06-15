# Vending Machine — LLD

Coin/bill handling, product selection, change dispensing via State pattern.

## Patterns

| Pattern | Why |
|---------|-----|
| **State** | Idle → HasMoney → ProductSelected → Dispensing |

## Run

```bash
mvn -q compile exec:java -Dexec.mainClass="com.you.lld.problems.vendingmachine.VendingMachineDemo"
```

## Key Detail

BigDecimal for money; invalid actions throw from state objects.
