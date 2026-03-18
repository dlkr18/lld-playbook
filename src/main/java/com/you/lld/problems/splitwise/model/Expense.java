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
