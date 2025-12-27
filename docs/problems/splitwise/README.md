# Splitwise - Expense Sharing

## Overview
Expense sharing application for splitting bills among friends with multiple split strategies, debt simplification, and settlement tracking.

**Difficulty:** Medium-Hard  
**Interview Frequency:** High (Splitwise, payment apps)

## Key Algorithms

### Equal Split
```java
public void addExpense(String paidBy, double amount, List<String> participants) {
    double perPerson = amount / participants.size();
    for (String user : participants) {
        if (!user.equals(paidBy)) {
            balances.merge(user + "->" + paidBy, perPerson, Double::sum);
        }
    }
}
```

### Debt Simplification (Greedy)
```java
public List<Transaction> simplifyDebts(Map<String, Double> balances) {
    List<String> creditors = new ArrayList<>();
    List<String> debtors = new ArrayList<>();
    
    for (Map.Entry<String, Double> e : balances.entrySet()) {
        if (e.getValue() > 0) creditors.add(e.getKey());
        else if (e.getValue() < 0) debtors.add(e.getKey());
    }
    
    List<Transaction> simplified = new ArrayList<>();
    int i = 0, j = 0;
    
    while (i < creditors.size() && j < debtors.size()) {
        double credit = balances.get(creditors.get(i));
        double debt = -balances.get(debtors.get(j));
        double amount = Math.min(credit, debt);
        
        simplified.add(new Transaction(debtors.get(j), creditors.get(i), amount));
        
        balances.put(creditors.get(i), credit - amount);
        balances.put(debtors.get(j), -(debt - amount));
        
        if (credit == amount) i++;
        if (debt == amount) j++;
    }
    
    return simplified;
}
```

**Time Complexity:** O(N²) worst case, O(N) with simplification  
**Space Complexity:** O(N)

## Split Strategies
- **Equal**: Split equally among all
- **Exact**: Specific amounts for each
- **Percentage**: Split by percentage
- **Shares**: Split by shares (e.g., 2:3:1)

## Source Code
📄 **[View Complete Source Code](/problems/splitwise/CODE)**

*Expense sharing with debt simplification algorithms.*
