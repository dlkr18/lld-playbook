# splitwise - Complete Implementation

> Generated from `src/main/java/com/you/lld/problems/splitwise/` on 2026-11-09. Re-run `python3 scripts/generate-code-md.py splitwise`.

## Project Structure (15 files)

```
splitwise/
├── SplitwiseDemo.java
├── Splitwise.java
├── model/Expense.java
├── model/Group.java
├── model/Payment.java
├── model/SplitType.java
├── model/User.java
├── service/SplitStrategy.java
├── service/SplitwiseService.java
├── service/impl/EqualSplitStrategy.java
├── service/impl/ExactSplitStrategy.java
├── service/impl/PercentageSplitStrategy.java
├── service/impl/SplitStrategyFactory.java
├── service/impl/SplitwiseServiceImpl.java
├── simplifier/BalanceSimplifier.java
```

## Source Code

### `SplitwiseDemo.java`

<details>
<summary>Click to view SplitwiseDemo.java</summary>

```java
package com.you.lld.problems.splitwise;

import com.you.lld.problems.splitwise.model.SplitType;
import com.you.lld.problems.splitwise.service.impl.SplitwiseServiceImpl;
import com.you.lld.problems.splitwise.simplifier.BalanceSimplifier;
import java.math.BigDecimal;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class SplitwiseDemo {
    public static void main(String[] args) {
        System.out.println("=== Splitwise Demo ===\n");
        SplitwiseServiceImpl service = new SplitwiseServiceImpl();

        demoEqualSplit(service);
        demoExactSplit(service);
        demoPercentageSplit(service);
        demoSimplify(service);
        demoBigDecimalPrecision(service);

        System.out.println("\n=== Demo complete ===");
    }

    private static void demoEqualSplit(SplitwiseServiceImpl service) {
        System.out.println("--- 1. Equal split in a group ---");
        String alice = service.addUser("Alice", "alice@email.com");
        String bob = service.addUser("Bob", "bob@email.com");
        String charlie = service.addUser("Charlie", "charlie@email.com");
        String group = service.createGroup("Roommates", Arrays.asList(alice, bob, charlie));
        service.addExpense(group, "Dinner", new BigDecimal("300.00"), alice,
                Arrays.asList(alice, bob, charlie), SplitType.EQUAL);
        printSettlements(service, alice, "Alice");
    }

    private static void demoExactSplit(SplitwiseServiceImpl service) {
        System.out.println("\n--- 2. Exact split (custom amounts) ---");
        String dana = service.addUser("Dana", "dana@email.com");
        String eve = service.addUser("Eve", "eve@email.com");
        String frank = service.addUser("Frank", "frank@email.com");
        String trip = service.createGroup("Trip", Arrays.asList(dana, eve, frank));
        Map<String, BigDecimal> exact = new HashMap<String, BigDecimal>();
        exact.put(dana, new BigDecimal("120.00"));
        exact.put(eve, new BigDecimal("80.00"));
        exact.put(frank, new BigDecimal("50.00"));
        service.addExpense(trip, "Hotel", new BigDecimal("250.00"), dana,
                Arrays.asList(dana, eve, frank), SplitType.EXACT, exact);
        printSettlements(service, eve, "Eve");
    }

    private static void demoPercentageSplit(SplitwiseServiceImpl service) {
        System.out.println("\n--- 3. Percentage split ---");
        String g1 = service.addUser("Grace", "g@email.com");
        String g2 = service.addUser("Heidi", "h@email.com");
        String office = service.createGroup("Office lunch", Arrays.asList(g1, g2));
        Map<String, BigDecimal> pct = new HashMap<String, BigDecimal>();
        pct.put(g1, new BigDecimal("60"));
        pct.put(g2, new BigDecimal("40"));
        service.addExpense(office, "Catering", new BigDecimal("100.00"), g1,
                Arrays.asList(g1, g2), SplitType.PERCENTAGE, pct);
        printSettlements(service, g2, "Heidi");
    }

    private static void demoSimplify(SplitwiseServiceImpl service) {
        System.out.println("\n--- 4. Balance simplification (min transactions) ---");
        String a = service.addUser("A", "a@x.com");
        String b = service.addUser("B", "b@x.com");
        String c = service.addUser("C", "c@x.com");
        String g = service.createGroup("Triangle", Arrays.asList(a, b, c));
        service.addExpense(g, "Rent", new BigDecimal("900.00"), a, Arrays.asList(a, b, c), SplitType.EQUAL);
        service.addExpense(g, "Utilities", new BigDecimal("150.00"), b, Arrays.asList(a, b, c), SplitType.EQUAL);
        List<BalanceSimplifier.Transaction> txns = service.simplifyGroupBalances(g);
        for (BalanceSimplifier.Transaction t : txns) {
            System.out.println("  " + formatTxn(service, t));
        }
    }

    private static void demoBigDecimalPrecision(SplitwiseServiceImpl service) {
        System.out.println("\n--- 5. BigDecimal — no float drift ---");
        String u1 = service.addUser("U1", "u1@x.com");
        String u2 = service.addUser("U2", "u2@x.com");
        String u3 = service.addUser("U3", "u3@x.com");
        String g = service.createGroup("Penny test", Arrays.asList(u1, u2, u3));
        service.addExpense(g, "Coffee", new BigDecimal("10.00"), u1,
                Arrays.asList(u1, u2, u3), SplitType.EQUAL);
        System.out.println("  $10 / 3 — shares stored as BigDecimal, not 3.333333...");
        printSettlements(service, u2, "U2");
    }

    private static void printSettlements(SplitwiseServiceImpl service, String userId, String label) {
        System.out.println("  Settlements for " + label + ":");
        for (String line : service.settleBalances(userId)) {
            System.out.println("    " + line);
        }
    }

    private static String formatTxn(SplitwiseServiceImpl service, BalanceSimplifier.Transaction t) {
        String from = service.getUser(t.getFrom()).getName();
        String to = service.getUser(t.getTo()).getName();
        return from + " pays " + to + ": $" + t.getAmount().setScale(2, BigDecimal.ROUND_HALF_UP);
    }
}
```

</details>

### `Splitwise.java`

<details>
<summary>Click to view Splitwise.java</summary>

```java
package com.you.lld.problems.splitwise;

import com.you.lld.problems.splitwise.model.SplitType;
import com.you.lld.problems.splitwise.service.SplitwiseService;
import com.you.lld.problems.splitwise.service.impl.SplitwiseServiceImpl;
import com.you.lld.problems.splitwise.simplifier.BalanceSimplifier;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

/** Facade for expense sharing — delegates to {@link SplitwiseService}. */
public class Splitwise {
    private final SplitwiseService service;

    public Splitwise() {
        this(new SplitwiseServiceImpl());
    }

    public Splitwise(SplitwiseService service) {
        this.service = service;
    }

    public String addUser(String name, String email) {
        return service.addUser(name, email);
    }

    public String createGroup(String name, List<String> memberIds) {
        return service.createGroup(name, memberIds);
    }

    public String addEqualExpense(String groupId, String description, BigDecimal amount,
                                  String paidBy, List<String> participants) {
        return service.addExpense(groupId, description, amount, paidBy, participants, SplitType.EQUAL);
    }

    public String addExpense(String groupId, String description, BigDecimal amount,
                             String paidBy, List<String> participants, SplitType splitType,
                             Map<String, BigDecimal> splitDetails) {
        return service.addExpense(groupId, description, amount, paidBy, participants, splitType, splitDetails);
    }

    public Map<String, BigDecimal> getUserBalances(String userId) {
        return service.getUserBalances(userId);
    }

    public List<String> settleBalances(String userId) {
        return service.settleBalances(userId);
    }

    public List<BalanceSimplifier.Transaction> simplifyGroup(String groupId) {
        return service.simplifyGroupBalances(groupId);
    }
}
```

</details>

### `model/Expense.java`

<details>
<summary>Click to view model/Expense.java</summary>

```java
package com.you.lld.problems.splitwise.model;

import com.you.lld.problems.splitwise.service.SplitStrategy;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Expense {
    private final String id;
    private final String description;
    private final BigDecimal amount;
    private final String paidBy;
    private final List<String> participants;
    private final SplitType splitType;
    private final Map<String, BigDecimal> splits;
    private final LocalDateTime createdAt;

    public Expense(String id, String description, BigDecimal amount, String paidBy,
                   List<String> participants, SplitType splitType, SplitStrategy strategy,
                   Map<String, BigDecimal> splitDetails) {
        this.id = id;
        this.description = description;
        this.amount = amount;
        this.paidBy = paidBy;
        this.participants = new ArrayList<String>(participants);
        this.splitType = splitType;
        this.createdAt = LocalDateTime.now();
        this.splits = strategy.compute(amount, participants, splitDetails);
    }

    public String getId() { return id; }
    public String getDescription() { return description; }
    public BigDecimal getAmount() { return amount; }
    public String getPaidBy() { return paidBy; }
    public List<String> getParticipants() { return new ArrayList<String>(participants); }
    public SplitType getSplitType() { return splitType; }
    public Map<String, BigDecimal> getSplits() { return new HashMap<String, BigDecimal>(splits); }

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

import java.math.BigDecimal;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

public class User {
    private final String id;
    private final String name;
    private final String email;
    private final Map<String, BigDecimal> balances;

    public User(String id, String name, String email) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.balances = new HashMap<String, BigDecimal>();
    }

    public synchronized void updateBalance(String otherUserId, BigDecimal delta) {
        BigDecimal current = balances.getOrDefault(otherUserId, BigDecimal.ZERO);
        balances.put(otherUserId, current.add(delta));
    }

    public synchronized Map<String, BigDecimal> getBalances() {
        return new HashMap<String, BigDecimal>(balances);
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

### `service/SplitStrategy.java`

<details>
<summary>Click to view service/SplitStrategy.java</summary>

```java
package com.you.lld.problems.splitwise.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

/** Strategy for computing per-user shares of an expense. */
public interface SplitStrategy {
    Map<String, BigDecimal> compute(BigDecimal total, List<String> participants, Map<String, BigDecimal> details);
}
```

</details>

### `service/SplitwiseService.java`

<details>
<summary>Click to view service/SplitwiseService.java</summary>

```java
package com.you.lld.problems.splitwise.service;

import com.you.lld.problems.splitwise.model.SplitType;
import com.you.lld.problems.splitwise.simplifier.BalanceSimplifier;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public interface SplitwiseService {
    String addUser(String name, String email);
    String createGroup(String name, List<String> memberIds);
    String addExpense(String groupId, String description, BigDecimal amount,
                      String paidBy, List<String> participants, SplitType splitType);
    String addExpense(String groupId, String description, BigDecimal amount,
                      String paidBy, List<String> participants, SplitType splitType,
                      Map<String, BigDecimal> splitDetails);
    Map<String, BigDecimal> getUserBalances(String userId);
    List<String> settleBalances(String userId);
    List<BalanceSimplifier.Transaction> simplifyGroupBalances(String groupId);
}
```

</details>

### `service/impl/EqualSplitStrategy.java`

<details>
<summary>Click to view service/impl/EqualSplitStrategy.java</summary>

```java
package com.you.lld.problems.splitwise.service.impl;

import com.you.lld.problems.splitwise.service.SplitStrategy;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class EqualSplitStrategy implements SplitStrategy {
    @Override
    public Map<String, BigDecimal> compute(BigDecimal total, List<String> participants, Map<String, BigDecimal> details) {
        if (participants == null || participants.isEmpty()) {
            throw new IllegalArgumentException("At least one participant required");
        }
        int n = participants.size();
        BigDecimal base = total.divide(BigDecimal.valueOf(n), 2, RoundingMode.HALF_EVEN);
        BigDecimal allocated = base.multiply(BigDecimal.valueOf(n));
        BigDecimal remainder = total.subtract(allocated);

        Map<String, BigDecimal> splits = new HashMap<String, BigDecimal>();
        for (int i = 0; i < n; i++) {
            BigDecimal share = base;
            if (i == 0 && remainder.compareTo(BigDecimal.ZERO) != 0) {
                share = share.add(remainder);
            }
            splits.put(participants.get(i), share);
        }
        return splits;
    }
}
```

</details>

### `service/impl/ExactSplitStrategy.java`

<details>
<summary>Click to view service/impl/ExactSplitStrategy.java</summary>

```java
package com.you.lld.problems.splitwise.service.impl;

import com.you.lld.problems.splitwise.service.SplitStrategy;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ExactSplitStrategy implements SplitStrategy {
    @Override
    public Map<String, BigDecimal> compute(BigDecimal total, List<String> participants, Map<String, BigDecimal> details) {
        if (details == null || details.isEmpty()) {
            throw new IllegalArgumentException("Exact split requires amount per participant");
        }
        BigDecimal sum = BigDecimal.ZERO;
        Map<String, BigDecimal> splits = new HashMap<String, BigDecimal>();
        for (String userId : participants) {
            BigDecimal amt = details.getOrDefault(userId, BigDecimal.ZERO);
            splits.put(userId, amt);
            sum = sum.add(amt);
        }
        if (sum.compareTo(total) != 0) {
            throw new IllegalArgumentException("Exact amounts (" + sum + ") must equal total (" + total + ")");
        }
        return splits;
    }
}
```

</details>

### `service/impl/PercentageSplitStrategy.java`

<details>
<summary>Click to view service/impl/PercentageSplitStrategy.java</summary>

```java
package com.you.lld.problems.splitwise.service.impl;

import com.you.lld.problems.splitwise.service.SplitStrategy;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class PercentageSplitStrategy implements SplitStrategy {
    @Override
    public Map<String, BigDecimal> compute(BigDecimal total, List<String> participants, Map<String, BigDecimal> details) {
        if (details == null || details.isEmpty()) {
            throw new IllegalArgumentException("Percentage split requires percent per participant");
        }
        BigDecimal pctSum = BigDecimal.ZERO;
        Map<String, BigDecimal> splits = new HashMap<String, BigDecimal>();
        for (String userId : participants) {
            BigDecimal pct = details.getOrDefault(userId, BigDecimal.ZERO);
            pctSum = pctSum.add(pct);
            BigDecimal share = total.multiply(pct).divide(new BigDecimal("100"), 2, RoundingMode.HALF_EVEN);
            splits.put(userId, share);
        }
        if (pctSum.compareTo(new BigDecimal("100")) != 0) {
            throw new IllegalArgumentException("Percentages must sum to 100, got " + pctSum);
        }
        return splits;
    }
}
```

</details>

### `service/impl/SplitStrategyFactory.java`

<details>
<summary>Click to view service/impl/SplitStrategyFactory.java</summary>

```java
package com.you.lld.problems.splitwise.service.impl;

import com.you.lld.problems.splitwise.model.SplitType;
import com.you.lld.problems.splitwise.service.SplitStrategy;

public final class SplitStrategyFactory {
    private SplitStrategyFactory() {}

    public static SplitStrategy forType(SplitType type) {
        switch (type) {
            case EQUAL:
                return new EqualSplitStrategy();
            case EXACT:
                return new ExactSplitStrategy();
            case PERCENTAGE:
                return new PercentageSplitStrategy();
            default:
                throw new IllegalArgumentException("Unsupported split type: " + type);
        }
    }
}
```

</details>

### `service/impl/SplitwiseServiceImpl.java`

<details>
<summary>Click to view service/impl/SplitwiseServiceImpl.java</summary>

```java
package com.you.lld.problems.splitwise.service.impl;

import com.you.lld.problems.splitwise.model.Expense;
import com.you.lld.problems.splitwise.model.Group;
import com.you.lld.problems.splitwise.model.SplitType;
import com.you.lld.problems.splitwise.model.User;
import com.you.lld.problems.splitwise.service.SplitStrategy;
import com.you.lld.problems.splitwise.service.SplitwiseService;
import com.you.lld.problems.splitwise.simplifier.BalanceSimplifier;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

public class SplitwiseServiceImpl implements SplitwiseService {
    private final Map<String, User> users = new ConcurrentHashMap<String, User>();
    private final Map<String, Group> groups = new ConcurrentHashMap<String, Group>();
    private final Map<String, Expense> expenses = new ConcurrentHashMap<String, Expense>();

    @Override
    public String addUser(String name, String email) {
        String userId = UUID.randomUUID().toString();
        users.put(userId, new User(userId, name, email));
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
        return groupId;
    }

    @Override
    public String addExpense(String groupId, String description, BigDecimal amount,
                             String paidBy, List<String> participants, SplitType splitType) {
        return addExpense(groupId, description, amount, paidBy, participants, splitType, null);
    }

    @Override
    public String addExpense(String groupId, String description, BigDecimal amount,
                             String paidBy, List<String> participants, SplitType splitType,
                             Map<String, BigDecimal> splitDetails) {
        SplitStrategy strategy = SplitStrategyFactory.forType(splitType);
        String expenseId = UUID.randomUUID().toString();
        Expense expense = new Expense(expenseId, description, amount, paidBy, participants,
                splitType, strategy, splitDetails);
        expenses.put(expenseId, expense);

        Group group = groups.get(groupId);
        if (group != null) {
            group.addExpense(expenseId);
        }
        applyExpense(expense);
        return expenseId;
    }

    private synchronized void applyExpense(Expense expense) {
        User payer = users.get(expense.getPaidBy());
        if (payer == null) {
            throw new IllegalArgumentException("Unknown payer: " + expense.getPaidBy());
        }
        for (Map.Entry<String, BigDecimal> entry : expense.getSplits().entrySet()) {
            String userId = entry.getKey();
            BigDecimal share = entry.getValue();
            if (userId.equals(expense.getPaidBy())) {
                continue;
            }
            payer.updateBalance(userId, share);
            User participant = users.get(userId);
            if (participant != null) {
                participant.updateBalance(expense.getPaidBy(), share.negate());
            }
        }
    }

    @Override
    public Map<String, BigDecimal> getUserBalances(String userId) {
        User user = users.get(userId);
        return user != null ? user.getBalances() : Collections.<String, BigDecimal>emptyMap();
    }

    @Override
    public List<String> settleBalances(String userId) {
        List<String> settlements = new ArrayList<String>();
        User user = users.get(userId);
        if (user == null) {
            return settlements;
        }
        BigDecimal epsilon = new BigDecimal("0.01");
        for (Map.Entry<String, BigDecimal> entry : user.getBalances().entrySet()) {
            User other = users.get(entry.getKey());
            if (other == null) {
                continue;
            }
            BigDecimal amount = entry.getValue();
            if (amount.compareTo(epsilon) > 0) {
                settlements.add(other.getName() + " owes you $" + amount.setScale(2, BigDecimal.ROUND_HALF_UP));
            } else if (amount.compareTo(epsilon.negate()) < 0) {
                settlements.add("You owe " + other.getName() + " $" + amount.negate().setScale(2, BigDecimal.ROUND_HALF_UP));
            }
        }
        return settlements;
    }

    @Override
    public List<BalanceSimplifier.Transaction> simplifyGroupBalances(String groupId) {
        Group group = groups.get(groupId);
        if (group == null) {
            return Collections.emptyList();
        }
        // Net position from this group's expenses only. A user's overall balance
        // also includes other groups, which must not leak into this group's settlement.
        Map<String, BigDecimal> net = new HashMap<String, BigDecimal>();
        for (String memberId : group.getMemberIds()) {
            net.put(memberId, BigDecimal.ZERO);
        }
        for (String expenseId : group.getExpenseIds()) {
            Expense expense = expenses.get(expenseId);
            if (expense == null) {
                continue;
            }
            String payer = expense.getPaidBy();
            for (Map.Entry<String, BigDecimal> split : expense.getSplits().entrySet()) {
                if (split.getKey().equals(payer)) {
                    continue;
                }
                addTo(net, payer, split.getValue());
                addTo(net, split.getKey(), split.getValue().negate());
            }
        }
        return BalanceSimplifier.simplifyBalances(net);
    }

    private static void addTo(Map<String, BigDecimal> net, String userId, BigDecimal amount) {
        BigDecimal current = net.get(userId);
        net.put(userId, current == null ? amount : current.add(amount));
    }

    public User getUser(String userId) {
        return users.get(userId);
    }
}
```

</details>

### `simplifier/BalanceSimplifier.java`

<details>
<summary>Click to view simplifier/BalanceSimplifier.java</summary>

```java
package com.you.lld.problems.splitwise.simplifier;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Map;

/** Greedy two-pointer debt simplification — minimize number of settlements. */
public final class BalanceSimplifier {
    private static final BigDecimal EPS = new BigDecimal("0.01");

    private BalanceSimplifier() {}

    public static List<Transaction> simplifyBalances(Map<String, BigDecimal> netBalances) {
        List<BalanceEntry> entries = new ArrayList<BalanceEntry>();
        for (Map.Entry<String, BigDecimal> e : netBalances.entrySet()) {
            if (e.getValue().abs().compareTo(EPS) >= 0) {
                entries.add(new BalanceEntry(e.getKey(), e.getValue()));
            }
        }
        Collections.sort(entries, new Comparator<BalanceEntry>() {
            @Override
            public int compare(BalanceEntry a, BalanceEntry b) {
                return a.amount.compareTo(b.amount);
            }
        });

        List<Transaction> transactions = new ArrayList<Transaction>();
        int left = 0;
        int right = entries.size() - 1;
        while (left < right) {
            BalanceEntry debtor = entries.get(left);
            BalanceEntry creditor = entries.get(right);
            BigDecimal amount = debtor.amount.abs().min(creditor.amount);
            transactions.add(new Transaction(debtor.userId, creditor.userId, amount));
            debtor.amount = debtor.amount.add(amount);
            creditor.amount = creditor.amount.subtract(amount);
            if (debtor.amount.abs().compareTo(EPS) < 0) left++;
            if (creditor.amount.abs().compareTo(EPS) < 0) right--;
        }
        return transactions;
    }

    private static final class BalanceEntry {
        private final String userId;
        private BigDecimal amount;

        BalanceEntry(String userId, BigDecimal amount) {
            this.userId = userId;
            this.amount = amount;
        }
    }

    public static final class Transaction {
        private final String from;
        private final String to;
        private final BigDecimal amount;

        public Transaction(String from, String to, BigDecimal amount) {
            this.from = from;
            this.to = to;
            this.amount = amount;
        }

        public String getFrom() { return from; }
        public String getTo() { return to; }
        public BigDecimal getAmount() { return amount; }

        @Override
        public String toString() {
            return from + " pays " + to + ": $" + amount.setScale(2, BigDecimal.ROUND_HALF_UP);
        }
    }
}
```

</details>

## Run Demo

```bash
mvn -q compile exec:java -Dexec.mainClass="com.you.lld.problems.splitwise.SplitwiseDemo"
```
