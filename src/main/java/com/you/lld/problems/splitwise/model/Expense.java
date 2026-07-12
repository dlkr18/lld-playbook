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
