# Day 16: Splitwise - Expense Sharing 💰

**Focus**: Design an expense-sharing system with precision, graph-based settlements, and concurrency handling.

---

## 🎯 **Learning Objectives**

By the end of Day 16, you will:
- **Handle** precise financial calculations
- **Implement** graph-based debt simplification
- **Design** concurrent expense operations
- **Build** a complete expense-sharing system

---

## 📚 **Requirements**

### **Functional**
- Add users and groups
- Create expenses (equal, exact, percentage split)
- View balances between users
- Simplify debts across a group
- Settle balances

### **Non-Functional**
- Precision: No floating-point errors
- Consistency: Concurrent expense handling
- Performance: Fast balance queries

---

## 🏗️ **Core Models**

```java
public class User {
    private final UserId id;
    private final String name;
    private final Email email;
    private final String phone;
}

public class Group {
    private final GroupId id;
    private final String name;
    private final List<UserId> members;
    private final Instant createdAt;
}

public class Expense {
    private final ExpenseId id;
    private final String description;
    private final Money totalAmount;
    private final UserId paidBy;
    private final List<Split> splits;
    private final ExpenseType type;
    private final GroupId groupId;  // Optional
    private final Instant createdAt;
    
    public enum ExpenseType {
        EQUAL, EXACT, PERCENTAGE
    }
}

public abstract class Split {
    protected final UserId userId;
    protected Money amount;
    
    public abstract void calculateAmount(Money totalAmount, int totalParticipants);
}

public class EqualSplit extends Split {
    @Override
    public void calculateAmount(Money totalAmount, int totalParticipants) {
        // Use BigDecimal for precise division
        BigDecimal share = totalAmount.getAmount()
            .divide(BigDecimal.valueOf(totalParticipants), 2, RoundingMode.HALF_UP);
        this.amount = Money.of(share, totalAmount.getCurrency());
    }
}

public class ExactSplit extends Split {
    public ExactSplit(UserId userId, Money amount) {
        this.userId = userId;
        this.amount = amount;
    }
    
    @Override
    public void calculateAmount(Money totalAmount, int totalParticipants) {
        // Amount already set
    }
}

public class PercentageSplit extends Split {
    private final BigDecimal percentage;
    
    @Override
    public void calculateAmount(Money totalAmount, int totalParticipants) {
        this.amount = totalAmount.percentage(percentage);
    }
}
```

---

## 💸 **Balance Tracking**

```java
public class BalanceSheet {
    
    // Map: user1 -> user2 -> amount (user1 owes user2)
    private final Map<UserId, Map<UserId, Money>> balances;
    private final ReentrantReadWriteLock lock;
    
    public BalanceSheet() {
        this.balances = new ConcurrentHashMap<>();
        this.lock = new ReentrantReadWriteLock();
    }
    
    public void recordExpense(Expense expense) {
        lock.writeLock().lock();
        try {
            UserId paidBy = expense.getPaidBy();
            
            for (Split split : expense.getSplits()) {
                if (!split.getUserId().equals(paidBy)) {
                    // split.user owes paidBy
                    addBalance(split.getUserId(), paidBy, split.getAmount());
                }
            }
        } finally {
            lock.writeLock().unlock();
        }
    }
    
    private void addBalance(UserId from, UserId to, Money amount) {
        // Check if reverse balance exists
        Money reverseBalance = getBalance(to, from);
        
        if (reverseBalance.isGreaterThan(Money.ZERO)) {
            // Net the balances
            if (reverseBalance.isGreaterThanOrEqual(amount)) {
                setBalance(to, from, reverseBalance.subtract(amount));
            } else {
                setBalance(to, from, Money.ZERO);
                setBalance(from, to, amount.subtract(reverseBalance));
            }
        } else {
            Money current = getBalance(from, to);
            setBalance(from, to, current.add(amount));
        }
    }
    
    public Money getBalance(UserId from, UserId to) {
        lock.readLock().lock();
        try {
            return balances
                .getOrDefault(from, Collections.emptyMap())
                .getOrDefault(to, Money.ZERO);
        } finally {
            lock.readLock().unlock();
        }
    }
    
    public Map<UserId, Money> getBalancesForUser(UserId userId) {
        lock.readLock().lock();
        try {
            Map<UserId, Money> result = new HashMap<>();
            
            // What user owes others
            Map<UserId, Money> owes = balances.getOrDefault(userId, Collections.emptyMap());
            for (Map.Entry<UserId, Money> entry : owes.entrySet()) {
                result.merge(entry.getKey(), entry.getValue().negate(), Money::add);
            }
            
            // What others owe user
            for (Map.Entry<UserId, Map<UserId, Money>> outer : balances.entrySet()) {
                if (!outer.getKey().equals(userId)) {
                    Money owed = outer.getValue().getOrDefault(userId, Money.ZERO);
                    if (!owed.isZero()) {
                        result.merge(outer.getKey(), owed, Money::add);
                    }
                }
            }
            
            return result;
        } finally {
            lock.readLock().unlock();
        }
    }
}
```

---

## 🔄 **Debt Simplification (Graph Algorithm)**

```java
public class DebtSimplifier {
    
    /**
     * Simplify debts using greedy algorithm.
     * Minimizes number of transactions.
     */
    public List<Settlement> simplifyDebts(Map<UserId, Money> netBalances) {
        List<Settlement> settlements = new ArrayList<>();
        
        // Separate into creditors and debtors
        PriorityQueue<UserBalance> creditors = new PriorityQueue<>(
            Comparator.comparing(ub -> ub.amount, Comparator.reverseOrder())
        );
        PriorityQueue<UserBalance> debtors = new PriorityQueue<>(
            Comparator.comparing(ub -> ub.amount)
        );
        
        for (Map.Entry<UserId, Money> entry : netBalances.entrySet()) {
            if (entry.getValue().isPositive()) {
                creditors.add(new UserBalance(entry.getKey(), entry.getValue()));
            } else if (entry.getValue().isNegative()) {
                debtors.add(new UserBalance(entry.getKey(), entry.getValue().negate()));
            }
        }
        
        // Match creditors with debtors
        while (!creditors.isEmpty() && !debtors.isEmpty()) {
            UserBalance creditor = creditors.poll();
            UserBalance debtor = debtors.poll();
            
            Money transferAmount = creditor.amount.min(debtor.amount);
            
            settlements.add(new Settlement(
                debtor.userId, 
                creditor.userId, 
                transferAmount
            ));
            
            // Update remaining balances
            Money creditorRemaining = creditor.amount.subtract(transferAmount);
            Money debtorRemaining = debtor.amount.subtract(transferAmount);
            
            if (!creditorRemaining.isZero()) {
                creditors.add(new UserBalance(creditor.userId, creditorRemaining));
            }
            if (!debtorRemaining.isZero()) {
                debtors.add(new UserBalance(debtor.userId, debtorRemaining));
            }
        }
        
        return settlements;
    }
    
    private static class UserBalance {
        UserId userId;
        Money amount;
        
        UserBalance(UserId userId, Money amount) {
            this.userId = userId;
            this.amount = amount;
        }
    }
}

public class Settlement {
    private final UserId from;
    private final UserId to;
    private final Money amount;
    
    // "from" should pay "amount" to "to"
}
```

---

## 📋 **Expense Service**

```java
public interface ExpenseService {
    
    Expense createExpense(CreateExpenseRequest request);
    
    Expense getExpense(ExpenseId id);
    
    List<Expense> getExpensesByGroup(GroupId groupId);
    
    List<Expense> getExpensesByUser(UserId userId);
    
    Map<UserId, Money> getBalances(UserId userId);
    
    List<Settlement> getSimplifiedSettlements(GroupId groupId);
    
    void settleBalance(UserId from, UserId to, Money amount);
}

public class CreateExpenseRequest {
    private String description;
    private Money totalAmount;
    private UserId paidBy;
    private List<SplitRequest> splits;
    private ExpenseType type;
    private GroupId groupId;
    
    public void validate() {
        // Validate total matches sum of splits (for EXACT)
        if (type == ExpenseType.EXACT) {
            Money sum = splits.stream()
                .map(SplitRequest::getAmount)
                .reduce(Money.ZERO, Money::add);
            
            if (!sum.equals(totalAmount)) {
                throw new ValidationException("Split amounts don't match total");
            }
        }
        
        // Validate percentages sum to 100 (for PERCENTAGE)
        if (type == ExpenseType.PERCENTAGE) {
            BigDecimal sum = splits.stream()
                .map(SplitRequest::getPercentage)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
            
            if (sum.compareTo(BigDecimal.valueOf(100)) != 0) {
                throw new ValidationException("Percentages must sum to 100");
            }
        }
    }
}
```

---

## 🎯 **Best Practices**

1. **Precision**: Use `BigDecimal` for all money calculations
2. **Atomicity**: Use transactions for expense operations
3. **Validation**: Verify splits equal total amount
4. **Simplification**: Minimize transactions for settlements
5. **Audit Trail**: Keep history of all expenses and settlements

---

**Next**: [Day 17 - Chess Game](week4/day17/README.md) →
