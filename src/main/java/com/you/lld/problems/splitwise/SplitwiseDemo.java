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
