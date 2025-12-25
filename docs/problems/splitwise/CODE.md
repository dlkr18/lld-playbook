# Splitwise - Expense Splitting System 💸

Production-ready **expense splitting** system like Splitwise with **multiple split strategies**, **settlement calculation**, and **BigDecimal precision** for accurate financial calculations.

---

## 🎯 **Core Features**

✅ **Multiple Split Strategies** - Equal, Exact, Percentage, Shares  
✅ **Financial Precision** - BigDecimal for accurate money calculations  
✅ **Remainder Handling** - No money lost in rounding  
✅ **Builder Pattern** - Clean API for expense creation  
✅ **Value Objects** - Type-safe IDs (UserId, ExpenseId, GroupId)  

---

## 💰 **Split Strategies**

| Strategy | Example | Use Case |
|----------|---------|----------|
| **EQUAL** | $100 ÷ 3 = $33.34, $33.33, $33.33 | Restaurant bills |
| **EXACT** | A=$50, B=$30, C=$20 | Pre-agreed amounts |
| **PERCENTAGE** | A=50%, B=30%, C=20% | Proportional income |
| **SHARES** | A=2 shares, B=1, C=1 (2:1:1) | Weighted splitting |

---

## 📦 **Complete Implementation**

Due to length constraints, viewing the complete implementations in your IDE is recommended:

**Core Model Classes** (`src/main/java/com/you/lld/problems/splitwise/model/`):
- `User.java` - User entity with UserId value object
- `Expense.java` - Expense with Builder pattern, supports all split types
- `SplitCalculator.java` - Split calculation algorithms with precision handling

### **Key Implementation Highlights:**

#### **1. User & Identity**
```java
public class User {
    private final UserId id;
    private final String name;
    private final String email;
    // ...
}

class UserId {
    private final String value;
    public static UserId generate() {
        return new UserId(UUID.randomUUID().toString());
    }
}
```

#### **2. Expense with Builder**
```java
Expense expense = Expense.builder()
    .description("Dinner at Restaurant")
    .amount(120.00)
    .paidBy(alice.getId())
    .splitEqually(Arrays.asList(alice.getId(), bob.getId(), charlie.getId()))
    .build();
```

#### **3. Split Calculator - Equal Split**
```java
// $100 split 3 ways = $33.34, $33.33, $33.33
Map<UserId, BigDecimal> splits = 
    SplitCalculator.calculateEqual(
        BigDecimal.valueOf(100.00),
        Arrays.asList(userA, userB, userC)
    );
```

---

## 📝 **Usage Examples**

### **Example 1: Equal Split**

```java
// Create users
User alice = new User("Alice", "alice@example.com");
User bob = new User("Bob", "bob@example.com");
User charlie = new User("Charlie", "charlie@example.com");

// Alice paid $120 for dinner, split equally
Expense dinner = Expense.builder()
    .description("Dinner at Italian Restaurant")
    .amount(120.00)
    .currency("USD")
    .paidBy(alice.getId())
    .splitEqually(Arrays.asList(
        alice.getId(), 
        bob.getId(), 
        charlie.getId()
    ))
    .build();

// Each owes: $40.00
// Bob owes Alice: $40.00
// Charlie owes Alice: $40.00
```

### **Example 2: Percentage Split**

```java
// Split by income percentage
Map<UserId, BigDecimal> percentages = new HashMap<>();
percentages.put(alice.getId(), BigDecimal.valueOf(50));  // 50%
percentages.put(bob.getId(), BigDecimal.valueOf(30));    // 30%
percentages.put(charlie.getId(), BigDecimal.valueOf(20)); // 20%

Expense rent = Expense.builder()
    .description("Monthly Rent")
    .amount(3000.00)
    .paidBy(alice.getId())
    .splitByPercentage(percentages)
    .build();

// Splits: Alice=$1500, Bob=$900, Charlie=$600
```

### **Example 3: Share-Based Split**

```java
// Family dinner - parents pay 2x kids' share
Map<UserId, Integer> shares = new HashMap<>();
shares.put(dad.getId(), 2);      // 2 shares
shares.put(mom.getId(), 2);      // 2 shares
shares.put(kid1.getId(), 1);     // 1 share
shares.put(kid2.getId(), 1);     // 1 share

Expense familyDinner = Expense.builder()
    .description("Family Dinner")
    .amount(180.00)
    .paidBy(dad.getId())
    .splitByShares(shares)
    .build();

// Total shares: 6
// Each share: $30
// Dad=$60, Mom=$60, Kid1=$30, Kid2=$30
```

### **Example 4: Exact Amounts**

```java
// Pre-agreed exact amounts
Map<UserId, BigDecimal> exactSplits = new HashMap<>();
exactSplits.put(alice.getId(), BigDecimal.valueOf(45.00));
exactSplits.put(bob.getId(), BigDecimal.valueOf(35.00));
exactSplits.put(charlie.getId(), BigDecimal.valueOf(20.00));

Expense groceries = Expense.builder()
    .description("Groceries")
    .amount(100.00)
    .paidBy(alice.getId())
    .splitType(SplitType.EXACT)
    .splits(exactSplits)
    .build();
```

---

## 💡 **Split Calculator Deep Dive**

### **1. Equal Split with Rounding**

```java
/**
 * Handles remainder by assigning to first participant.
 * 
 * Example: $100 ÷ 3
 * Base: $100 / 3 = $33.33 (rounded)
 * Total: $33.33 × 3 = $99.99
 * Remainder: $100 - $99.99 = $0.01
 * Result: [$33.34, $33.33, $33.33]
 */
public static Map<UserId, BigDecimal> calculateEqual(
        BigDecimal total, 
        List<UserId> participants) {
    
    BigDecimal share = total.divide(
        BigDecimal.valueOf(participants.size()), 
        2,  // 2 decimal places
        RoundingMode.HALF_UP
    );
    
    BigDecimal remainder = total.subtract(
        share.multiply(BigDecimal.valueOf(participants.size()))
    );
    
    // First participant gets remainder
    splits.put(participants.get(0), share.add(remainder));
    for (int i = 1; i < participants.size(); i++) {
        splits.put(participants.get(i), share);
    }
    
    return splits;
}
```

### **2. Percentage Split with Precision**

```java
/**
 * Last participant gets exact remainder to avoid rounding errors.
 * 
 * Example: $100 split 50%, 30%, 20%
 * A: $100 × 0.50 = $50.00 (assigned)
 * B: $100 × 0.30 = $30.00 (assigned)
 * C: $100 - $50 - $30 = $20.00 (remainder, exact!)
 */
public static Map<UserId, BigDecimal> calculateByPercentage(
        BigDecimal total,
        Map<UserId, BigDecimal> percentages) {
    
    BigDecimal assigned = BigDecimal.ZERO;
    List<UserId> users = new ArrayList<>(percentages.keySet());
    
    for (int i = 0; i < users.size() - 1; i++) {
        BigDecimal share = total.multiply(percentages.get(users.get(i)))
            .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        splits.put(users.get(i), share);
        assigned = assigned.add(share);
    }
    
    // Last user gets exact remainder
    splits.put(users.get(users.size() - 1), total.subtract(assigned));
    
    return splits;
}
```

---

## 🎯 **Settlement Calculation** (Extension)

For **simplifying debts** (who owes whom):

```java
/**
 * Calculates optimal settlements to minimize transactions.
 * 
 * Example:
 * - Alice paid $100, owes $40 → net: +$60
 * - Bob paid $0, owes $40   → net: -$40
 * - Charlie paid $0, owes $40 → net: -$40
 * 
 * Result:
 * - Bob pays Alice $40
 * - Charlie pays Alice $40
 */
public class SettlementCalculator {
    
    public static List<Settlement> calculateSettlements(List<Expense> expenses) {
        // Calculate net balance for each user
        Map<UserId, BigDecimal> balances = calculateBalances(expenses);
        
        // Separate creditors and debtors
        List<Balance> creditors = new ArrayList<>();
        List<Balance> debtors = new ArrayList<>();
        
        for (Map.Entry<UserId, BigDecimal> entry : balances.entrySet()) {
            if (entry.getValue().compareTo(BigDecimal.ZERO) > 0) {
                creditors.add(new Balance(entry.getKey(), entry.getValue()));
            } else if (entry.getValue().compareTo(BigDecimal.ZERO) < 0) {
                debtors.add(new Balance(entry.getKey(), entry.getValue().negate()));
            }
        }
        
        // Greedy matching: largest debtor pays largest creditor
        List<Settlement> settlements = new ArrayList<>();
        int i = 0, j = 0;
        
        while (i < creditors.size() && j < debtors.size()) {
            Balance creditor = creditors.get(i);
            Balance debtor = debtors.get(j);
            
            BigDecimal amount = creditor.amount.min(debtor.amount);
            
            settlements.add(new Settlement(
                debtor.userId,
                creditor.userId,
                amount
            ));
            
            creditor.amount = creditor.amount.subtract(amount);
            debtor.amount = debtor.amount.subtract(amount);
            
            if (creditor.amount.compareTo(BigDecimal.ZERO) == 0) i++;
            if (debtor.amount.compareTo(BigDecimal.ZERO) == 0) j++;
        }
        
        return settlements;
    }
    
    private static Map<UserId, BigDecimal> calculateBalances(List<Expense> expenses) {
        Map<UserId, BigDecimal> balances = new HashMap<>();
        
        for (Expense expense : expenses) {
            // Payer gets credited
            balances.merge(expense.getPaidBy(), expense.getTotalAmount(), BigDecimal::add);
            
            // Participants get debited
            for (Map.Entry<UserId, BigDecimal> split : expense.getSplits().entrySet()) {
                balances.merge(split.getKey(), split.getValue().negate(), BigDecimal::add);
            }
        }
        
        return balances;
    }
}

class Settlement {
    private final UserId from;
    private final UserId to;
    private final BigDecimal amount;
    
    public Settlement(UserId from, UserId to, BigDecimal amount) {
        this.from = from;
        this.to = to;
        this.amount = amount;
    }
    
    @Override
    public String toString() {
        return from + " pays " + to + " $" + amount;
    }
}
```

---

## 🚨 **Common Mistakes to Avoid**

### **1. Using float/double for Money**
```java
// BAD: Precision loss!
double amount = 100.0 / 3;  // 33.333333... → rounding errors

// GOOD: Use BigDecimal
BigDecimal amount = BigDecimal.valueOf(100.0)
    .divide(BigDecimal.valueOf(3), 2, RoundingMode.HALF_UP);
```

### **2. Not Validating Sum**
```java
// BAD: Splits don't sum to total
splits.put(userA, 40.00);
splits.put(userB, 40.00);
// Total is $100 but splits only $80!

// GOOD: Validate in constructor
if (splitSum.compareTo(totalAmount) != 0) {
    throw new IllegalArgumentException("Splits must equal total");
}
```

### **3. Ignoring Remainder**
```java
// BAD: Money lost!
BigDecimal each = total.divide(count, 2, HALF_UP);
// $100 / 3 = $33.33 each
// $33.33 × 3 = $99.99 (lost $0.01!)

// GOOD: Assign remainder
BigDecimal remainder = total.subtract(each.multiply(count));
splits.put(firstUser, each.add(remainder));  // $33.34
```

---

## ⚡ **Performance Characteristics**

| Operation | Time Complexity | Space Complexity |
|-----------|----------------|------------------|
| **Create Expense** | O(N) | O(N) |
| **Equal Split** | O(N) | O(N) |
| **Calculate Settlement** | O(N log N) | O(N) |

Where N = number of participants.

---

## 🔗 **Related Resources**

- [Day 16: Splitwise Complete](week4/day16/README.md) - Full system design
- [BigDecimal Best Practices](foundations/MONEY_HANDLING.md)
- [Builder Pattern](week2/day6/README.md)

---

**Source Code Location**: `src/main/java/com/you/lld/problems/splitwise/`

---

✨ **Accurate expense splitting with proper financial precision!** 💸

