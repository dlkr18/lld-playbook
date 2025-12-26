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
