# Day 16 Exercises: Splitwise Clone 📝

---

## 🎯 **Exercise 1: Core Domain Models**

### **Task**
Design and implement the core domain models for expense splitting:

### **Required Classes**
```java
public class User {
    private UserId id;
    private String name;
    private Email email;
    private PhoneNumber phone;
}

public class Group {
    private GroupId id;
    private String name;
    private Set<UserId> members;
    private List<ExpenseId> expenses;
}

public class Expense {
    private ExpenseId id;
    private String description;
    private Money totalAmount;
    private UserId paidBy;
    private Instant createdAt;
    private SplitType splitType;
    private Map<UserId, Money> splits;
}

public enum SplitType {
    EQUAL,      // Split equally among all participants
    EXACT,      // Exact amounts specified
    PERCENTAGE, // Percentage-based split
    SHARES      // Share-based split (e.g., 2:1:1)
}
```

### **Validation Rules**
1. Expense total must equal sum of splits
2. All split participants must be group members
3. Percentages must sum to 100%
4. At least 2 participants in any expense

---

## 🎯 **Exercise 2: Split Calculation Engine**

### **Task**
Implement different split calculation strategies:

### **Interface**
```java
public interface SplitCalculator {
    Map<UserId, Money> calculateSplits(Money total, SplitRequest request);
}

public class SplitRequest {
    private List<UserId> participants;
    private Map<UserId, BigDecimal> weights; // For shares/percentage
    private Map<UserId, Money> exactAmounts; // For exact split
}
```

### **Test Cases**
```java
// Equal split: $100 among 3 people
// Expected: $33.34, $33.33, $33.33 (handles rounding)

// Percentage split: $100 with 50%, 30%, 20%
// Expected: $50.00, $30.00, $20.00

// Shares split: $100 with shares 2:1:1
// Expected: $50.00, $25.00, $25.00

// Exact split: $100 with $60, $40
// Expected: $60.00, $40.00 (must validate sum)
```

### **Rounding Rules**
- Round to 2 decimal places
- Assign remainder to first participant
- Never lose or gain money in splits

---

## 🎯 **Exercise 3: Balance Calculator**

### **Task**
Calculate balances between users across all expenses:

### **Interface**
```java
public interface BalanceService {
    /**
     * Get balance for a user (positive = owed to them)
     */
    Money getUserBalance(UserId userId);
    
    /**
     * Get balance between two users
     */
    Money getBalanceBetween(UserId user1, UserId user2);
    
    /**
     * Get all balances for a user
     */
    Map<UserId, Money> getAllBalances(UserId userId);
    
    /**
     * Get group balances
     */
    GroupBalances getGroupBalances(GroupId groupId);
}
```

### **Example**
```
Expense 1: Alice paid $60, split equally (Alice, Bob, Carol)
  - Alice owes: -$40 (paid $60, should pay $20)
  - Bob owes: +$20
  - Carol owes: +$20

Expense 2: Bob paid $30, split equally (Alice, Bob)
  - Alice owes: +$15
  - Bob owes: -$15

Net Balances:
  - Alice: -$25 (is owed $25)
  - Bob: +$5 (owes $5)
  - Carol: +$20 (owes $20)
```

---

## 🎯 **Exercise 4: Settlement/Simplification**

### **Task**
Implement debt simplification to minimize transactions:

### **Problem**
Given: A owes B $10, B owes C $10, C owes A $5
Naive: 3 transactions
Simplified: A pays C $5, A pays B $5 (2 transactions)

### **Interface**
```java
public interface SettlementService {
    /**
     * Calculate minimum transactions to settle all debts.
     */
    List<Settlement> calculateSettlements(GroupId groupId);
    
    /**
     * Suggest settlement between two users.
     */
    Optional<Settlement> suggestSettlement(UserId from, UserId to);
}

public class Settlement {
    private UserId from;
    private UserId to;
    private Money amount;
    private SettlementStatus status;
}
```

### **Algorithm Options**
1. **Greedy**: Match largest creditor with largest debtor
2. **Graph-based**: Find minimum edge cover
3. **Optimal**: NP-hard, use approximation for large groups

### **Test Case**
```
Input: A→B: $40, B→C: $20, C→A: $10, D→B: $30

Step 1: Calculate net balances
  A: -$30 (creditor)
  B: +$10 (debtor)
  C: +$10 (debtor)
  D: +$30 (debtor)

Step 2: Simplify (Greedy)
  D pays A: $30
  B pays A: $0 (already settled by others)
  C pays... 

Output: Minimum transactions to settle
```

---

## 🎯 **Exercise 5: Expense Service API**

### **Task**
Design a complete ExpenseService with CRUD operations:

### **Interface**
```java
public interface ExpenseService {
    
    // Create
    ExpenseId addExpense(AddExpenseCommand command);
    
    // Read
    Expense getExpense(ExpenseId id);
    List<Expense> getGroupExpenses(GroupId groupId);
    List<Expense> getUserExpenses(UserId userId);
    
    // Update
    void updateExpense(UpdateExpenseCommand command);
    
    // Delete
    void deleteExpense(ExpenseId id);
    
    // Queries
    ExpenseSummary getExpenseSummary(GroupId groupId, DateRange range);
    List<Expense> searchExpenses(ExpenseSearchCriteria criteria);
}

@Builder
public class AddExpenseCommand {
    private String description;
    private Money amount;
    private UserId paidBy;
    private GroupId groupId;
    private SplitType splitType;
    private Map<UserId, BigDecimal> splitDetails;
}
```

### **Business Rules**
1. Only group members can add expenses
2. Only expense creator or payer can edit/delete
3. Settled expenses cannot be modified
4. Audit trail for all changes

---

## 🎯 **Exercise 6: Activity Feed**

### **Task**
Implement an activity feed for tracking all group activities:

### **Events**
```java
public sealed interface ExpenseEvent {
    record ExpenseAdded(ExpenseId id, UserId addedBy, Instant at) implements ExpenseEvent {}
    record ExpenseUpdated(ExpenseId id, UserId updatedBy, List<Change> changes) implements ExpenseEvent {}
    record ExpenseDeleted(ExpenseId id, UserId deletedBy) implements ExpenseEvent {}
    record SettlementRecorded(Settlement settlement) implements ExpenseEvent {}
    record MemberAdded(GroupId group, UserId member) implements ExpenseEvent {}
    record MemberRemoved(GroupId group, UserId member) implements ExpenseEvent {}
}
```

### **Requirements**
1. Store events with timestamps
2. Support pagination
3. Filter by group/user/date range
4. Real-time notifications (optional)

---

## 🏋️ **Advanced Challenges**

### **Challenge 1: Recurring Expenses**
```java
RecurringExpense expense = RecurringExpense.builder()
    .baseExpense(baseExpense)
    .frequency(Frequency.MONTHLY)
    .startDate(LocalDate.now())
    .endDate(LocalDate.now().plusYears(1))
    .build();

// Auto-generate expenses on schedule
```

### **Challenge 2: Multi-Currency Support**
```java
// Expense in EUR, group default USD
Expense expense = Expense.builder()
    .amount(Money.euros(100))
    .exchangeRate(ExchangeRate.of(EUR, USD, 1.1))
    .build();

// Calculate splits in original + converted currency
```

### **Challenge 3: Expense Categories & Analytics**
```java
ExpenseAnalytics analytics = analyticsService.analyze(groupId, DateRange.lastMonth());

// Category breakdown
analytics.getByCategory();
// {FOOD: $500, RENT: $2000, UTILITIES: $200}

// Per-person spending
analytics.getPerPersonSpending();
// {Alice: $1000, Bob: $900, Carol: $800}

// Trends
analytics.getMonthlyTrend();
```

---

## 📊 **Grading Rubric**

| Criteria | Points |
|----------|--------|
| **Domain Modeling** - Clean entities and value objects | 20 |
| **Split Logic** - Correct calculations with rounding | 25 |
| **Settlement Algorithm** - Efficient debt simplification | 25 |
| **API Design** - Clean, intuitive service interfaces | 15 |
| **Concurrency** - Thread-safe operations | 15 |

---

**Solutions**: [EXERCISE_SOLUTIONS.md](week4/day16/EXERCISE_SOLUTIONS.md)
