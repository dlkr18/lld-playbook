# splitwise - Complete Implementation

> Generated from `src/main/java/com/you/lld/problems/splitwise/` on 2026-05-31. Re-run `python3 scripts/generate-code-md.py splitwise`.

## Project Structure (9 files)

```
splitwise/
├── SplitwiseDemo.java
├── api/SplitwiseService.java
├── model/Expense.java
├── model/Group.java
├── model/Payment.java
├── model/SplitType.java
├── model/User.java
├── impl/SplitwiseServiceImpl.java
├── simplifier/BalanceSimplifier.java
```

## Source Code

### `SplitwiseDemo.java`

<details>
<summary>Click to view SplitwiseDemo.java</summary>

```java
package com.you.lld.problems.splitwise;

import com.you.lld.problems.splitwise.impl.SplitwiseServiceImpl;
import com.you.lld.problems.splitwise.model.SplitType;
import java.util.*;

public class SplitwiseDemo {
    public static void main(String[] args) {
        System.out.println("💰 Splitwise Demo");
        System.out.println(String.format("%70s", "").replace(" ", "="));
        System.out.println();
        
        SplitwiseServiceImpl service = new SplitwiseServiceImpl();
        
        // Add users
        String alice = service.addUser("Alice", "alice@email.com");
        String bob = service.addUser("Bob", "bob@email.com");
        String charlie = service.addUser("Charlie", "charlie@email.com");
        
        // Create group
        String groupId = service.createGroup("Roommates", Arrays.asList(alice, bob, charlie));
        
        System.out.println();
        
        // Add expenses
        service.addExpense(groupId, "Dinner", 300.0, alice, 
                          Arrays.asList(alice, bob, charlie), SplitType.EQUAL);
        
        service.addExpense(groupId, "Groceries", 150.0, bob,
                          Arrays.asList(alice, bob, charlie), SplitType.EQUAL);
        
        System.out.println();
        System.out.println("Balances for Alice:");
        List<String> aliceSettlements = service.settleBalances(alice);
        for (String settlement : aliceSettlements) {
            System.out.println("  " + settlement);
        }
        
        System.out.println();
        System.out.println("Balances for Bob:");
        List<String> bobSettlements = service.settleBalances(bob);
        for (String settlement : bobSettlements) {
            System.out.println("  " + settlement);
        }
        
        System.out.println("\n✅ Demo complete!");
    }
}
```

</details>

### `api/SplitwiseService.java`

<details>
<summary>Click to view api/SplitwiseService.java</summary>

```java
package com.you.lld.problems.splitwise.api;

import com.you.lld.problems.splitwise.model.*;
import java.util.*;

public interface SplitwiseService {
    String addUser(String name, String email);
    String createGroup(String name, List<String> memberIds);
    String addExpense(String groupId, String description, double amount, 
                     String paidBy, List<String> participants, SplitType splitType);
    Map<String, Double> getUserBalances(String userId);
    List<String> settleBalances(String userId);
}
```

</details>

### `model/Expense.java`

<details>
<summary>Click to view model/Expense.java</summary>

```java
package com.you.lld.problems.splitwise.model;

import java.time.LocalDateTime;
import java.util.*;

public class Expense {
    private final String id;
    private final String description;
    private final double amount;
    private final String paidBy;
    private final List<String> participants;
    private final SplitType splitType;
    private final Map<String, Double> splits;
    private final LocalDateTime createdAt;
    
    private Map<String, Double> exactAmounts;
    private Map<String, Double> percentages;

    public Expense(String id, String description, double amount, String paidBy,
                   List<String> participants, SplitType splitType) {
        this.id = id;
        this.description = description;
        this.amount = amount;
        this.paidBy = paidBy;
        this.participants = new ArrayList<>(participants);
        this.splitType = splitType;
        this.splits = new HashMap<>();
        this.createdAt = LocalDateTime.now();
        calculateSplits();
    }

    /** Constructor for EXACT or PERCENTAGE splits with custom amounts. */
    public Expense(String id, String description, double amount, String paidBy,
                   List<String> participants, SplitType splitType,
                   Map<String, Double> splitDetails) {
        this.id = id;
        this.description = description;
        this.amount = amount;
        this.paidBy = paidBy;
        this.participants = new ArrayList<>(participants);
        this.splitType = splitType;
        this.splits = new HashMap<>();
        this.createdAt = LocalDateTime.now();

        if (splitType == SplitType.EXACT) {
            this.exactAmounts = new HashMap<>(splitDetails);
        } else if (splitType == SplitType.PERCENTAGE) {
            this.percentages = new HashMap<>(splitDetails);
        }
        calculateSplits();
    }

    private void calculateSplits() {
        switch (splitType) {
            case EQUAL:
                double share = amount / participants.size();
                for (String userId : participants) {
                    splits.put(userId, share);
                }
                break;
            case EXACT:
                if (exactAmounts != null) {
                    double total = 0;
                    for (String userId : participants) {
                        double exactAmt = exactAmounts.getOrDefault(userId, 0.0);
                        splits.put(userId, exactAmt);
                        total += exactAmt;
                    }
                    if (Math.abs(total - amount) > 0.01) {
                        throw new IllegalArgumentException(
                            "Exact amounts ($" + total + ") don't add up to total ($" + amount + ")");
                    }
                }
                break;
            case PERCENTAGE:
                if (percentages != null) {
                    double totalPct = 0;
                    for (String userId : participants) {
                        double pct = percentages.getOrDefault(userId, 0.0);
                        splits.put(userId, amount * pct / 100.0);
                        totalPct += pct;
                    }
                    if (Math.abs(totalPct - 100.0) > 0.01) {
                        throw new IllegalArgumentException(
                            "Percentages (" + totalPct + "%) don't add up to 100%");
                    }
                }
                break;
        }
    }
    
    public String getId() { return id; }
    public String getDescription() { return description; }
    public double getAmount() { return amount; }
    public String getPaidBy() { return paidBy; }
    public List<String> getParticipants() { return new ArrayList<>(participants); }
    public Map<String, Double> getSplits() { return new HashMap<>(splits); }
    
    @Override
    public String toString() {
        return "Expense{id='" + id + "', description='" + description + "', amount=" + amount + "}";
    }
}
```

</details>

### `model/Group.java`

<details>
<summary>Click to view model/Group.java</summary>

```java
package com.you.lld.problems.splitwise.model;

import java.util.*;

public class Group {
    private final String id;
    private final String name;
    private final List<String> memberIds;
    private final List<String> expenseIds;
    
    public Group(String id, String name) {
        this.id = id;
        this.name = name;
        this.memberIds = new ArrayList<>();
        this.expenseIds = new ArrayList<>();
    }
    
    public void addMember(String userId) {
        if (!memberIds.contains(userId)) {
            memberIds.add(userId);
        }
    }
    
    public void addExpense(String expenseId) {
        expenseIds.add(expenseId);
    }
    
    public String getId() { return id; }
    public String getName() { return name; }
    public List<String> getMemberIds() { return new ArrayList<>(memberIds); }
    public List<String> getExpenseIds() { return new ArrayList<>(expenseIds); }
    
    @Override
    public String toString() {
        return "Group{id='" + id + "', name='" + name + "', members=" + memberIds.size() + "}";
    }
}
```

</details>

### `model/Payment.java`

<details>
<summary>Click to view model/Payment.java</summary>

```java
package com.you.lld.problems.splitwise.model;

import java.time.LocalDateTime;

public class Payment {
    private final String id;
    private final String payerId;
    private final String payeeId;
    private final double amount;
    private final LocalDateTime timestamp;
    
    public Payment(String id, String payerId, String payeeId, double amount) {
        this.id = id;
        this.payerId = payerId;
        this.payeeId = payeeId;
        this.amount = amount;
        this.timestamp = LocalDateTime.now();
    }
    
    public String getId() { return id; }
    public double getAmount() { return amount; }
}
```

</details>

### `model/SplitType.java`

<details>
<summary>Click to view model/SplitType.java</summary>

```java
package com.you.lld.problems.splitwise.model;

public enum SplitType {
    EQUAL, EXACT, PERCENTAGE
}
```

</details>

### `model/User.java`

<details>
<summary>Click to view model/User.java</summary>

```java
package com.you.lld.problems.splitwise.model;

import java.util.*;

public class User {
    private final String id;
    private final String name;
    private final String email;
    private final Map<String, Double> balances;
    
    public User(String id, String name, String email) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.balances = new HashMap<>();
    }
    
    public void updateBalance(String otherUserId, double amount) {
        balances.put(otherUserId, balances.getOrDefault(otherUserId, 0.0) + amount);
    }
    
    public Map<String, Double> getBalances() {
        return new HashMap<>(balances);
    }
    
    public String getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    
    @Override
    public String toString() {
        return "User{id='" + id + "', name='" + name + "'}";
    }
}
```

</details>

### `impl/SplitwiseServiceImpl.java`

<details>
<summary>Click to view impl/SplitwiseServiceImpl.java</summary>

```java
package com.you.lld.problems.splitwise.impl;

import com.you.lld.problems.splitwise.api.SplitwiseService;
import com.you.lld.problems.splitwise.model.*;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

public class SplitwiseServiceImpl implements SplitwiseService {
    private final Map<String, User> users = new ConcurrentHashMap<>();
    private final Map<String, Group> groups = new ConcurrentHashMap<>();
    private final Map<String, Expense> expenses = new ConcurrentHashMap<>();
    
    @Override
    public String addUser(String name, String email) {
        String userId = UUID.randomUUID().toString();
        User user = new User(userId, name, email);
        users.put(userId, user);
        System.out.println("User added: " + name);
        return userId;
    }
    
    @Override
    public String createGroup(String name, List<String> memberIds) {
        String groupId = UUID.randomUUID().toString();
        Group group = new Group(groupId, name);
        for (String memberId : memberIds) {
            group.addMember(memberId);
        }
        groups.put(groupId, group);
        System.out.println("Group created: " + name);
        return groupId;
    }
    
    @Override
    public String addExpense(String groupId, String description, double amount,
                            String paidBy, List<String> participants, SplitType splitType) {
        return addExpense(groupId, description, amount, paidBy, participants, splitType, null);
    }

    /** Add an expense with custom split details (for EXACT or PERCENTAGE). */
    public String addExpense(String groupId, String description, double amount,
                            String paidBy, List<String> participants, SplitType splitType,
                            Map<String, Double> splitDetails) {
        String expenseId = UUID.randomUUID().toString();
        Expense expense;
        if (splitDetails != null) {
            expense = new Expense(expenseId, description, amount, paidBy, participants, splitType, splitDetails);
        } else {
            expense = new Expense(expenseId, description, amount, paidBy, participants, splitType);
        }
        expenses.put(expenseId, expense);
        
        Group group = groups.get(groupId);
        if (group != null) {
            group.addExpense(expenseId);
        }
        
        updateBalances(expense);
        System.out.println("Expense added: " + description + " - $" + amount);
        return expenseId;
    }

    private synchronized void updateBalances(Expense expense) {
        User payer = users.get(expense.getPaidBy());
        if (payer == null) return;
        
        for (Map.Entry<String, Double> entry : expense.getSplits().entrySet()) {
            String userId = entry.getKey();
            double share = entry.getValue();
            
            if (!userId.equals(expense.getPaidBy())) {
                payer.updateBalance(userId, share);
                User user = users.get(userId);
                if (user != null) {
                    user.updateBalance(expense.getPaidBy(), -share);
                }
            }
        }
    }
    
    @Override
    public Map<String, Double> getUserBalances(String userId) {
        User user = users.get(userId);
        return user != null ? user.getBalances() : Collections.emptyMap();
    }
    
    @Override
    public List<String> settleBalances(String userId) {
        List<String> settlements = new ArrayList<>();
        User user = users.get(userId);
        if (user == null) return settlements;
        
        for (Map.Entry<String, Double> entry : user.getBalances().entrySet()) {
            String otherUserId = entry.getKey();
            double amount = entry.getValue();
            
            if (amount > 0.01) {
                User otherUser = users.get(otherUserId);
                String settlement = otherUser.getName() + " owes you $" + String.format("%.2f", amount);
                settlements.add(settlement);
            } else if (amount < -0.01) {
                User otherUser = users.get(otherUserId);
                String settlement = "You owe " + otherUser.getName() + " $" + String.format("%.2f", -amount);
                settlements.add(settlement);
            }
        }
        
        return settlements;
    }
}
```

</details>

### `simplifier/BalanceSimplifier.java`

<details>
<summary>Click to view simplifier/BalanceSimplifier.java</summary>

```java
package com.you.lld.problems.splitwise.simplifier;

import java.util.*;

public class BalanceSimplifier {
    public static List<Transaction> simplifyBalances(Map<String, Double> balances) {
        List<Transaction> transactions = new ArrayList<>();
        
        List<Map.Entry<String, Double>> sorted = new ArrayList<>(balances.entrySet());
        sorted.sort(Map.Entry.comparingByValue());
        
        int left = 0;
        int right = sorted.size() - 1;
        
        while (left < right) {
            String debtor = sorted.get(left).getKey();
            String creditor = sorted.get(right).getKey();
            double debtAmount = -sorted.get(left).getValue();
            double creditAmount = sorted.get(right).getValue();
            
            double amount = Math.min(debtAmount, creditAmount);
            transactions.add(new Transaction(debtor, creditor, amount));
            
            sorted.get(left).setValue(sorted.get(left).getValue() + amount);
            sorted.get(right).setValue(sorted.get(right).getValue() - amount);
            
            if (Math.abs(sorted.get(left).getValue()) < 0.01) left++;
            if (Math.abs(sorted.get(right).getValue()) < 0.01) right--;
        }
        
        return transactions;
    }
    
    public static class Transaction {
        private final String from;
        private final String to;
        private final double amount;
        
        public Transaction(String from, String to, double amount) {
            this.from = from;
            this.to = to;
            this.amount = amount;
        }
        
        @Override
        public String toString() {
            return from + " pays " + to + ": $" + String.format("%.2f", amount);
        }
    }
}
```

</details>

## Run Demo

```bash
mvn -q compile exec:java -Dexec.mainClass="com.you.lld.problems.splitwise.SplitwiseDemo"
```
