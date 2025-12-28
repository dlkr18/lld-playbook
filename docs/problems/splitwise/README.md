# Splitwise - Expense Sharing System

## Overview
A comprehensive expense splitting application for managing shared expenses among groups, roommates, and friends. Implements multiple split strategies (equal, exact, percentage), settlement optimization using graph algorithms, and balance simplification for minimizing transactions between users.

**Difficulty:** Medium-Hard  
**Domain:** Financial Systems, Graph Algorithms  
**Interview Frequency:** High (Splitwise, Venmo, PayPal, fintech companies)

## Requirements

### Functional Requirements
1. **User Management**
   - Register/login users
   - User profiles
   - Friends management
   - User balances

2. **Group Management**
   - Create groups
   - Add/remove members
   - Group types (trip, apartment, couple, etc.)
   - Group settings

3. **Expense Management**
   - Add expenses
   - Split expenses (equal, exact, percentage)
   - Expense categories
   - Expense attachments (receipts)
   - Expense comments

4. **Split Strategies**
   - **Equal Split:** Divide equally among all
   - **Exact Split:** Specify exact amounts
   - **Percentage Split:** Split by percentages
   - **Share Split:** Split by shares (1:2:3)
   - **Adjustment:** Custom adjustments

5. **Balance Calculation**
   - User-to-user balances
   - Group balances
   - Overall balances
   - Balance simplification

6. **Settlement**
   - Record payments
   - Settle up between users
   - Optimize settlements (minimize transactions)
   - Payment history

7. **Notifications**
   - Expense added
   - Payment received
   - Reminder to settle

### Non-Functional Requirements
1. **Performance**
   - Balance calculation: < 100ms
   - Settlement optimization: < 500ms
   - Support 10K+ users per group

2. **Consistency**
   - Accurate balance tracking
   - Double-entry bookkeeping
   - No money lost/created

3. **Availability**
   - 99.9% uptime
   - Real-time balance updates


## Class Diagram

![Splitwise Class Diagram](diagrams/class-diagram.png)

## System Architecture

```
┌────────────────────────────────────────────────┐
│           User Interface                        │
│   (Mobile App, Web App)                        │
└────────────────┬───────────────────────────────┘
                 │
     ┌───────────▼────────────┐
     │    Expense API         │
     │  - Add expense         │
     │  - Split expense       │
     │  - Settle payment      │
     └────────────┬───────────┘
                  │
     ┌────────────┼────────────┐
     │            │            │
┌────▼─────┐ ┌───▼──────┐ ┌──▼────────┐
│ Expense  │ │ Balance  │ │Settlement │
│ Service  │ │ Service  │ │ Service   │
│          │ │          │ │           │
│ -Create  │ │ -Calculate│ │-Optimize  │
│ -Split   │ │ -Update  │ │-Record    │
└────┬─────┘ └───┬──────┘ └──┬────────┘
     │           │            │
┌────▼───────────▼────────────▼─────┐
│         Database                   │
│  - Expenses                        │
│  - Users                           │
│  - Groups                          │
│  - Balances                        │
└────────────────────────────────────┘
```

## Core Data Model

### 1. User
```java
public class User {
    private UserId id;
    private String name;
    private String email;
    private String phoneNumber;
    private String profilePicture;
    private Money totalBalance; // Net balance across all groups
    private List<UserId> friends;
    private LocalDateTime createdAt;
    
    public Money getBalanceWith(UserId otherUser) {
        // Calculate net balance with specific user
        return balanceService.getBalance(this.id, otherUser);
    }
}
```

### 2. Group
```java
public class Group {
    private GroupId id;
    private String name;
    private GroupType type;
    private List<UserId> members;
    private UserId createdBy;
    private LocalDateTime createdAt;
    private boolean isActive;
    
    public void addMember(UserId userId) {
        if (!members.contains(userId)) {
            members.add(userId);
        }
    }
    
    public void removeMember(UserId userId) {
        members.remove(userId);
    }
    
    public boolean isMember(UserId userId) {
        return members.contains(userId);
    }
}

enum GroupType {
    APARTMENT,
    TRIP,
    COUPLE,
    FRIENDS,
    OTHER
}
```

### 3. Expense
```java
public class Expense {
    private ExpenseId id;
    private String description;
    private Money amount;
    private UserId paidBy;
    private GroupId groupId;
    private ExpenseCategory category;
    private LocalDateTime date;
    private List<Split> splits;
    private String notes;
    private String receiptUrl;
    private LocalDateTime createdAt;
    
    public void validate() {
        // Ensure splits sum to total amount
        Money totalSplit = splits.stream()
            .map(Split::getAmount)
            .reduce(Money.ZERO, Money::add);
        
        if (!totalSplit.equals(amount)) {
            throw new InvalidSplitException("Splits must sum to total amount");
        }
    }
    
    public List<Transaction> generateTransactions() {
        List<Transaction> transactions = new ArrayList<>();
        
        for (Split split : splits) {
            if (!split.getUserId().equals(paidBy)) {
                // User owes payer
                transactions.add(new Transaction(
                    split.getUserId(),  // from
                    paidBy,             // to
                    split.getAmount()   // amount
                ));
            }
        }
        
        return transactions;
    }
}

enum ExpenseCategory {
    FOOD,
    ENTERTAINMENT,
    UTILITIES,
    RENT,
    TRANSPORT,
    SHOPPING,
    OTHER
}
```

### 4. Split
```java
public abstract class Split {
    protected UserId userId;
    protected Money amount;
    
    public abstract Money calculate(Money totalAmount, int totalShares);
}

class EqualSplit extends Split {
    public Money calculate(Money totalAmount, int totalParticipants) {
        return totalAmount.divide(totalParticipants);
    }
}

class ExactSplit extends Split {
    public ExactSplit(UserId userId, Money amount) {
        this.userId = userId;
        this.amount = amount;
    }
    
    public Money calculate(Money totalAmount, int totalShares) {
        return amount; // Already specified
    }
}

class PercentageSplit extends Split {
    private double percentage; // 0.0 to 1.0
    
    public Money calculate(Money totalAmount, int totalShares) {
        return totalAmount.multiply(percentage);
    }
}

class ShareSplit extends Split {
    private int shares;
    
    public Money calculate(Money totalAmount, int totalShares) {
        return totalAmount.multiply(shares).divide(totalShares);
    }
}
```

### 5. Balance
```java
public class Balance {
    private UserId user1;
    private UserId user2;
    private Money amount; // Positive: user1 owes user2, Negative: user2 owes user1
    private LocalDateTime lastUpdated;
    
    public void update(Money delta) {
        this.amount = this.amount.add(delta);
        this.lastUpdated = LocalDateTime.now();
    }
    
    public boolean isSettled() {
        return amount.isZero();
    }
    
    public UserId getCreditor() {
        return amount.isPositive() ? user2 : user1;
    }
    
    public UserId getDebtor() {
        return amount.isPositive() ? user1 : user2;
    }
    
    public Money getAbsoluteAmount() {
        return amount.abs();
    }
}
```

### 6. Settlement
```java
public class Settlement {
    private SettlementId id;
    private UserId payer;
    private UserId receiver;
    private Money amount;
    private GroupId groupId;
    private LocalDateTime settledAt;
    private String notes;
    
    public List<Balance> getAffectedBalances() {
        // Returns balances that this settlement affects
        return List.of(new Balance(payer, receiver, amount.negate()));
    }
}
```

## Key Algorithms

### 1. Expense Split Calculation
```java
public class ExpenseSplitter {
    
    public List<Split> splitEqually(Money totalAmount, List<UserId> participants) {
        Money amountPerPerson = totalAmount.divide(participants.size());
        
        return participants.stream()
            .map(userId -> new ExactSplit(userId, amountPerPerson))
            .collect(Collectors.toList());
    }
    
    public List<Split> splitByPercentage(Money totalAmount, 
                                        Map<UserId, Double> percentages) {
        // Validate percentages sum to 100%
        double total = percentages.values().stream()
            .mapToDouble(Double::doubleValue)
            .sum();
        
        if (Math.abs(total - 1.0) > 0.001) {
            throw new InvalidSplitException("Percentages must sum to 100%");
        }
        
        List<Split> splits = new ArrayList<>();
        Money allocated = Money.ZERO;
        
        // Calculate splits
        for (Map.Entry<UserId, Double> entry : percentages.entrySet()) {
            Money amount = totalAmount.multiply(entry.getValue());
            splits.add(new ExactSplit(entry.getKey(), amount));
            allocated = allocated.add(amount);
        }
        
        // Handle rounding - allocate remaining to first person
        Money remaining = totalAmount.subtract(allocated);
        if (!remaining.isZero()) {
            Split firstSplit = splits.get(0);
            splits.set(0, new ExactSplit(
                firstSplit.getUserId(),
                firstSplit.getAmount().add(remaining)
            ));
        }
        
        return splits;
    }
    
    public List<Split> splitByShares(Money totalAmount, 
                                    Map<UserId, Integer> shares) {
        int totalShares = shares.values().stream()
            .mapToInt(Integer::intValue)
            .sum();
        
        List<Split> splits = new ArrayList<>();
        Money allocated = Money.ZERO;
        
        for (Map.Entry<UserId, Integer> entry : shares.entrySet()) {
            Money amount = totalAmount
                .multiply(entry.getValue())
                .divide(totalShares);
            splits.add(new ExactSplit(entry.getKey(), amount));
            allocated = allocated.add(amount);
        }
        
        // Handle rounding
        Money remaining = totalAmount.subtract(allocated);
        if (!remaining.isZero()) {
            Split firstSplit = splits.get(0);
            splits.set(0, new ExactSplit(
                firstSplit.getUserId(),
                firstSplit.getAmount().add(remaining)
            ));
        }
        
        return splits;
    }
}
```

### 2. Balance Calculation & Update
```java
public class BalanceService {
    private final Map<UserPair, Balance> balances;
    
    public void updateBalances(Expense expense) {
        UserId payer = expense.getPaidBy();
        
        for (Split split : expense.getSplits()) {
            UserId participant = split.getUserId();
            
            if (participant.equals(payer)) {
                continue; // Payer doesn't owe themselves
            }
            
            // Participant owes payer
            UserPair pair = new UserPair(participant, payer);
            Balance balance = balances.computeIfAbsent(pair, 
                k -> new Balance(participant, payer, Money.ZERO));
            
            balance.update(split.getAmount());
        }
    }
    
    public Map<UserId, Money> getGroupBalances(GroupId groupId) {
        Group group = groupService.getGroup(groupId);
        Map<UserId, Money> balances = new HashMap<>();
        
        // Initialize all members with zero balance
        for (UserId member : group.getMembers()) {
            balances.put(member, Money.ZERO);
        }
        
        // Calculate net balance for each member
        for (Map.Entry<UserPair, Balance> entry : this.balances.entrySet()) {
            UserPair pair = entry.getKey();
            Balance balance = entry.getValue();
            
            if (!group.isMember(pair.getUser1()) || 
                !group.isMember(pair.getUser2())) {
                continue;
            }
            
            // Update balances
            balances.merge(pair.getUser1(), balance.getAmount().negate(), Money::add);
            balances.merge(pair.getUser2(), balance.getAmount(), Money::add);
        }
        
        return balances;
    }
    
    public Money getBalance(UserId user1, UserId user2) {
        UserPair pair = new UserPair(user1, user2);
        Balance balance = balances.get(pair);
        
        if (balance == null) {
            return Money.ZERO;
        }
        
        // Return from user1's perspective
        if (balance.getUser1().equals(user1)) {
            return balance.getAmount();
        } else {
            return balance.getAmount().negate();
        }
    }
}

class UserPair {
    private final UserId user1;
    private final UserId user2;
    
    public UserPair(UserId a, UserId b) {
        // Ensure consistent ordering
        if (a.compareTo(b) < 0) {
            this.user1 = a;
            this.user2 = b;
        } else {
            this.user1 = b;
            this.user2 = a;
        }
    }
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof UserPair)) return false;
        UserPair that = (UserPair) o;
        return user1.equals(that.user1) && user2.equals(that.user2);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(user1, user2);
    }
}
```

### 3. Settlement Optimization (Minimize Transactions)
```java
public class SettlementOptimizer {
    
    public List<Transaction> optimizeSettlements(Map<UserId, Money> balances) {
        // Separate debtors and creditors
        List<UserBalance> debtors = new ArrayList<>();
        List<UserBalance> creditors = new ArrayList<>();
        
        for (Map.Entry<UserId, Money> entry : balances.entrySet()) {
            Money balance = entry.getValue();
            
            if (balance.isNegative()) {
                // User owes money
                debtors.add(new UserBalance(entry.getKey(), balance.abs()));
            } else if (balance.isPositive()) {
                // User is owed money
                creditors.add(new UserBalance(entry.getKey(), balance));
            }
        }
        
        // Sort by amount (largest first)
        debtors.sort(Comparator.comparing(UserBalance::getAmount).reversed());
        creditors.sort(Comparator.comparing(UserBalance::getAmount).reversed());
        
        List<Transaction> transactions = new ArrayList<>();
        
        int i = 0, j = 0;
        
        while (i < debtors.size() && j < creditors.size()) {
            UserBalance debtor = debtors.get(i);
            UserBalance creditor = creditors.get(j);
            
            Money amount = debtor.getAmount().min(creditor.getAmount());
            
            transactions.add(new Transaction(
                debtor.getUserId(),
                creditor.getUserId(),
                amount
            ));
            
            debtor.reduce(amount);
            creditor.reduce(amount);
            
            if (debtor.getAmount().isZero()) {
                i++;
            }
            if (creditor.getAmount().isZero()) {
                j++;
            }
        }
        
        return transactions;
    }
}

class UserBalance {
    private UserId userId;
    private Money amount;
    
    public void reduce(Money delta) {
        this.amount = this.amount.subtract(delta);
    }
}

class Transaction {
    private UserId from;
    private UserId to;
    private Money amount;
    
    public Transaction(UserId from, UserId to, Money amount) {
        this.from = from;
        this.to = to;
        this.amount = amount;
    }
}
```

**Optimization Example:**
```
Before Optimization:
- Alice owes Bob $10
- Alice owes Charlie $10
- Bob owes Charlie $10

Transactions needed: 3

After Optimization:
- Alice owes Charlie $20
- Bob owes Charlie $10

Transactions needed: 2 (reduced by 33%)

Algorithm:
1. Calculate net balance for each user
2. Separate into debtors and creditors
3. Match largest debtor with largest creditor
4. Minimize number of transactions
```

### 4. Graph-based Settlement (Advanced)
```java
public class GraphBasedSettlement {
    
    public List<Transaction> simplifyDebts(Map<UserId, Money> balances) {
        // Build directed graph of debts
        Graph<UserId, Money> debtGraph = buildDebtGraph(balances);
        
        // Find and eliminate cycles (circular debts)
        eliminateCycles(debtGraph);
        
        // Simplify remaining debts
        return simplifyRemainingDebts(debtGraph);
    }
    
    private void eliminateCycles(Graph<UserId, Money> graph) {
        // Find cycles using DFS
        for (UserId user : graph.getNodes()) {
            List<UserId> cycle = findCycle(graph, user, new HashSet<>(), new ArrayList<>());
            
            if (cycle != null && !cycle.isEmpty()) {
                // Find minimum debt in cycle
                Money minDebt = findMinDebtInCycle(graph, cycle);
                
                // Reduce all debts in cycle by minimum
                for (int i = 0; i < cycle.size(); i++) {
                    UserId from = cycle.get(i);
                    UserId to = cycle.get((i + 1) % cycle.size());
                    
                    Money currentDebt = graph.getEdge(from, to);
                    Money newDebt = currentDebt.subtract(minDebt);
                    
                    if (newDebt.isZero()) {
                        graph.removeEdge(from, to);
                    } else {
                        graph.setEdge(from, to, newDebt);
                    }
                }
            }
        }
    }
}
```

### 5. Expense Recording with Double-Entry
```java
public class ExpenseService {
    
    public Expense addExpense(ExpenseRequest request) {
        // 1. Validate expense
        validateExpense(request);
        
        // 2. Create expense
        Expense expense = Expense.builder()
            .description(request.getDescription())
            .amount(request.getAmount())
            .paidBy(request.getPaidBy())
            .groupId(request.getGroupId())
            .category(request.getCategory())
            .date(LocalDateTime.now())
            .splits(request.getSplits())
            .build();
        
        // 3. Validate splits sum to total
        expense.validate();
        
        // 4. Save expense
        expenseRepository.save(expense);
        
        // 5. Update balances (double-entry bookkeeping)
        updateBalances(expense);
        
        // 6. Notify participants
        notifyParticipants(expense);
        
        return expense;
    }
    
    private void updateBalances(Expense expense) {
        UserId payer = expense.getPaidBy();
        
        for (Split split : expense.getSplits()) {
            if (split.getUserId().equals(payer)) {
                continue;
            }
            
            // Create two entries (double-entry)
            // 1. Debtor owes creditor
            balanceService.addTransaction(
                split.getUserId(),  // from (debtor)
                payer,              // to (creditor)
                split.getAmount()
            );
            
            // 2. Creditor is owed by debtor (mirror entry)
            balanceService.addTransaction(
                payer,              // from (creditor)
                split.getUserId(),  // to (debtor)
                split.getAmount().negate()
            );
        }
    }
}
```

## Design Patterns

### 1. Strategy Pattern (Split Strategies)
```java
interface SplitStrategy {
    List<Split> split(Money amount, List<UserId> participants, Map<UserId, Object> params);
}

class EqualSplitStrategy implements SplitStrategy {
    public List<Split> split(Money amount, List<UserId> participants, Map<UserId, Object> params) {
        Money perPerson = amount.divide(participants.size());
        return participants.stream()
            .map(id -> new ExactSplit(id, perPerson))
            .collect(Collectors.toList());
    }
}

class PercentageSplitStrategy implements SplitStrategy {
    public List<Split> split(Money amount, List<UserId> participants, Map<UserId, Object> params) {
        // Use percentages from params
    }
}
```

### 2. Builder Pattern (Expense Creation)
```java
Expense expense = Expense.builder()
    .description("Dinner at restaurant")
    .amount(Money.of(120, "USD"))
    .paidBy(userId1)
    .groupId(groupId)
    .category(ExpenseCategory.FOOD)
    .addSplit(new ExactSplit(userId1, Money.of(40, "USD")))
    .addSplit(new ExactSplit(userId2, Money.of(40, "USD")))
    .addSplit(new ExactSplit(userId3, Money.of(40, "USD")))
    .build();
```

### 3. Observer Pattern (Balance Updates)
```java
interface BalanceObserver {
    void onBalanceUpdated(UserId user1, UserId user2, Money newBalance);
}

class NotificationObserver implements BalanceObserver {
    public void onBalanceUpdated(UserId user1, UserId user2, Money newBalance) {
        notificationService.notifyBalanceChange(user1, user2, newBalance);
    }
}
```

## Source Code

📄 **[View Complete Source Code](/problems/splitwise/CODE)**

**Key Files:**
- [`ExpenseService.java`](/problems/splitwise/CODE#expenseservicejava) - Expense management
- [`BalanceService.java`](/problems/splitwise/CODE#balanceservicejava) - Balance calculation
- [`SettlementOptimizer.java`](/problems/splitwise/CODE#settlementoptimizerjava) - Transaction minimization
- [`ExpenseSplitter.java`](/problems/splitwise/CODE#expensesplitterjava) - Split strategies

**Total Lines of Code:** ~900 lines

## Usage Example

```java
// Initialize Splitwise
SplitwiseSystem splitwise = new SplitwiseSystem();

// Create users
User alice = splitwise.createUser("Alice");
User bob = splitwise.createUser("Bob");
User charlie = splitwise.createUser("Charlie");

// Create group
Group group = splitwise.createGroup("Apartment", 
    List.of(alice.getId(), bob.getId(), charlie.getId()));

// Add expense (equal split)
Expense expense1 = splitwise.addExpense(ExpenseRequest.builder()
    .description("Groceries")
    .amount(Money.of(90, "USD"))
    .paidBy(alice.getId())
    .groupId(group.getId())
    .splitType(SplitType.EQUAL)
    .participants(List.of(alice.getId(), bob.getId(), charlie.getId()))
    .build());

// Add expense (exact split)
Expense expense2 = splitwise.addExpense(ExpenseRequest.builder()
    .description("Dinner")
    .amount(Money.of(120, "USD"))
    .paidBy(bob.getId())
    .groupId(group.getId())
    .splitType(SplitType.EXACT)
    .exactSplits(Map.of(
        alice.getId(), Money.of(40, "USD"),
        bob.getId(), Money.of(50, "USD"),
        charlie.getId(), Money.of(30, "USD")
    ))
    .build());

// Get balances
Map<UserId, Money> balances = splitwise.getGroupBalances(group.getId());

// Optimize settlements
List<Transaction> settlements = splitwise.optimizeSettlements(group.getId());
for (Transaction t : settlements) {
    System.out.println(t.getFrom().getName() + " pays " + 
        t.getTo().getName() + " " + t.getAmount());
}

// Record settlement
splitwise.recordSettlement(alice.getId(), bob.getId(), Money.of(30, "USD"));
```

## Common Interview Questions

### System Design Questions

1. **How do you minimize number of transactions in group settlement?**
   - Calculate net balance for each user
   - Separate debtors and creditors
   - Match largest debtor with largest creditor
   - Use greedy algorithm: O(N log N)

2. **How do you handle currency conversion?**
   - Store amounts in base currency
   - Convert at display time using latest rates
   - Track original currency for receipts
   - Handle rounding carefully

3. **How do you ensure balances are always accurate?**
   - Double-entry bookkeeping
   - Validate splits sum to total
   - Atomic balance updates (transactions)
   - Periodic reconciliation

4. **How do you handle deleted expenses?**
   - Soft delete (mark as deleted)
   - Reverse balance updates
   - Keep audit trail
   - Recalculate group balances

### Coding Questions

1. **Split expense equally**
   ```java
   List<Split> splitEqually(Money amount, List<UserId> users) {
       Money perPerson = amount.divide(users.size());
       return users.stream()
           .map(id -> new ExactSplit(id, perPerson))
           .collect(Collectors.toList());
   }
   ```

2. **Calculate net balance**
   ```java
   Money getNetBalance(UserId user, List<Balance> balances) {
       return balances.stream()
           .filter(b -> b.involves(user))
           .map(b -> b.getAmountFor(user))
           .reduce(Money.ZERO, Money::add);
   }
   ```

3. **Optimize settlements**
   ```java
   List<Transaction> optimize(Map<UserId, Money> balances) {
       // Greedy: match largest debtor with largest creditor
   }
   ```

### Algorithm Questions
1. **Time complexity of settlement optimization?** → O(N log N) for sorting
2. **How to find circular debts?** → DFS cycle detection: O(V + E)
3. **Minimum transactions needed?** → At most N-1 where N = users

## Trade-offs & Design Decisions

### 1. Real-time vs Batch Balance Updates
**Real-time:** Immediate, more expensive  
**Batch:** Delayed, efficient

**Decision:** Real-time (better UX)

### 2. Settlement Optimization vs Simplicity
**Optimized:** Fewer transactions, complex  
**Simple:** Direct payments, more transactions

**Decision:** Optimized (better for users)

### 3. Strong vs Eventual Consistency
**Strong:** Always accurate, slower  
**Eventual:** Fast, temporarily inconsistent

**Decision:** Strong (money is sensitive)

### 4. Group vs Peer-to-peer
**Group:** Easier to manage shared expenses  
**P2P:** Simpler model

**Decision:** Both (groups for shared, P2P for loans)

## Key Takeaways

### What Interviewers Look For
1. ✅ **Split strategies** implementation
2. ✅ **Balance calculation** algorithm
3. ✅ **Settlement optimization** (minimize transactions)
4. ✅ **Double-entry bookkeeping**
5. ✅ **Graph algorithms** for debt cycles
6. ✅ **Consistency** guarantees

### Common Mistakes to Avoid
1. ❌ Splits not summing to total
2. ❌ Not optimizing settlements
3. ❌ Floating point precision errors
4. ❌ Not handling currency conversion
5. ❌ Missing audit trail
6. ❌ Incorrect balance calculation

### Production-Ready Checklist
- [x] Multiple split strategies
- [x] Balance calculation
- [x] Settlement optimization
- [x] Group management
- [ ] Currency conversion
- [ ] Receipt uploads
- [ ] Payment integration
- [ ] Notifications
- [ ] Analytics
- [ ] Export data

---

## Related Problems
- 💳 **Payment Gateway** - Payment processing
- 🏦 **Banking System** - Double-entry bookkeeping
- 📊 **Accounting** - Financial records
- 🤝 **P2P Lending** - User-to-user transactions

## References
- Splitwise Architecture: Expense sharing at scale
- Graph Algorithms: Cycle detection, shortest paths
- Double-Entry Bookkeeping: Accounting principles
- Greedy Algorithms: Settlement optimization

---

*Production-ready expense sharing system with settlement optimization, multiple split strategies, and graph-based debt simplification. Essential for fintech interviews.*
