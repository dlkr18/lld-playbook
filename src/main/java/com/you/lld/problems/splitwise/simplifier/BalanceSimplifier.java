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
