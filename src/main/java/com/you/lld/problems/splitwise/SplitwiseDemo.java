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
