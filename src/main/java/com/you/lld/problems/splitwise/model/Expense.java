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
    
    private void calculateSplits() {
        if (splitType == SplitType.EQUAL) {
            double share = amount / participants.size();
            for (String userId : participants) {
                splits.put(userId, share);
            }
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
