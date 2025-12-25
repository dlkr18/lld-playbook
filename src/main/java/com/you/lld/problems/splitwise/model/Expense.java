package com.you.lld.problems.splitwise.model;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.*;

/**
 * Represents an expense that is split among participants.
 */
public class Expense {
    
    private final ExpenseId id;
    private final String description;
    private final BigDecimal totalAmount;
    private final String currency;
    private final UserId paidBy;
    private final Instant createdAt;
    private final SplitType splitType;
    private final Map<UserId, BigDecimal> splits;
    private final GroupId groupId;
    
    private Expense(Builder builder) {
        this.id = ExpenseId.generate();
        this.description = builder.description;
        this.totalAmount = builder.totalAmount;
        this.currency = builder.currency;
        this.paidBy = builder.paidBy;
        this.createdAt = Instant.now();
        this.splitType = builder.splitType;
        this.splits = new HashMap<>(builder.splits);
        this.groupId = builder.groupId;
        
        validate();
    }
    
    private void validate() {
        if (description == null || description.trim().isEmpty()) {
            throw new IllegalArgumentException("Description cannot be empty");
        }
        if (totalAmount == null || totalAmount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Amount must be positive");
        }
        if (splits.isEmpty()) {
            throw new IllegalArgumentException("At least one participant required");
        }
        
        // Verify splits sum to total
        BigDecimal splitSum = splits.values().stream()
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        if (splitSum.compareTo(totalAmount) != 0) {
            throw new IllegalArgumentException(
                "Splits sum (" + splitSum + ") must equal total (" + totalAmount + ")");
        }
    }
    
    // Getters
    public ExpenseId getId() { return id; }
    public String getDescription() { return description; }
    public BigDecimal getTotalAmount() { return totalAmount; }
    public String getCurrency() { return currency; }
    public UserId getPaidBy() { return paidBy; }
    public Instant getCreatedAt() { return createdAt; }
    public SplitType getSplitType() { return splitType; }
    public Map<UserId, BigDecimal> getSplits() { return new HashMap<>(splits); }
    public GroupId getGroupId() { return groupId; }
    
    public BigDecimal getShareFor(UserId userId) {
        return splits.getOrDefault(userId, BigDecimal.ZERO);
    }
    
    public Set<UserId> getParticipants() {
        return new HashSet<>(splits.keySet());
    }
    
    public static Builder builder() {
        return new Builder();
    }
    
    public static class Builder {
        private String description;
        private BigDecimal totalAmount;
        private String currency = "USD";
        private UserId paidBy;
        private SplitType splitType = SplitType.EQUAL;
        private Map<UserId, BigDecimal> splits = new HashMap<>();
        private GroupId groupId;
        
        public Builder description(String description) {
            this.description = description;
            return this;
        }
        
        public Builder amount(BigDecimal amount) {
            this.totalAmount = amount;
            return this;
        }
        
        public Builder amount(double amount) {
            this.totalAmount = BigDecimal.valueOf(amount);
            return this;
        }
        
        public Builder currency(String currency) {
            this.currency = currency;
            return this;
        }
        
        public Builder paidBy(UserId userId) {
            this.paidBy = userId;
            return this;
        }
        
        public Builder splitType(SplitType splitType) {
            this.splitType = splitType;
            return this;
        }
        
        public Builder splits(Map<UserId, BigDecimal> splits) {
            this.splits = new HashMap<>(splits);
            return this;
        }
        
        public Builder addSplit(UserId userId, BigDecimal amount) {
            this.splits.put(userId, amount);
            return this;
        }
        
        public Builder groupId(GroupId groupId) {
            this.groupId = groupId;
            return this;
        }
        
        /**
         * Calculate equal splits among participants.
         */
        public Builder splitEqually(List<UserId> participants) {
            this.splitType = SplitType.EQUAL;
            this.splits = SplitCalculator.calculateEqual(totalAmount, participants);
            return this;
        }
        
        /**
         * Calculate percentage-based splits.
         */
        public Builder splitByPercentage(Map<UserId, BigDecimal> percentages) {
            this.splitType = SplitType.PERCENTAGE;
            this.splits = SplitCalculator.calculateByPercentage(totalAmount, percentages);
            return this;
        }
        
        /**
         * Calculate share-based splits.
         */
        public Builder splitByShares(Map<UserId, Integer> shares) {
            this.splitType = SplitType.SHARES;
            this.splits = SplitCalculator.calculateByShares(totalAmount, shares);
            return this;
        }
        
        public Expense build() {
            return new Expense(this);
        }
    }
}

/**
 * Value object for Expense ID.
 */
class ExpenseId {
    
    private final String value;
    
    private ExpenseId(String value) {
        this.value = value;
    }
    
    public static ExpenseId generate() {
        return new ExpenseId(UUID.randomUUID().toString());
    }
    
    public static ExpenseId of(String value) {
        return new ExpenseId(value);
    }
    
    public String getValue() { return value; }
    
    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (!(obj instanceof ExpenseId)) return false;
        return value.equals(((ExpenseId) obj).value);
    }
    
    @Override
    public int hashCode() { return value.hashCode(); }
    
    @Override
    public String toString() { return value; }
}

/**
 * Value object for Group ID.
 */
class GroupId {
    
    private final String value;
    
    private GroupId(String value) {
        this.value = value;
    }
    
    public static GroupId generate() {
        return new GroupId(UUID.randomUUID().toString());
    }
    
    public static GroupId of(String value) {
        return new GroupId(value);
    }
    
    public String getValue() { return value; }
    
    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (!(obj instanceof GroupId)) return false;
        return value.equals(((GroupId) obj).value);
    }
    
    @Override
    public int hashCode() { return value.hashCode(); }
    
    @Override
    public String toString() { return value; }
}

/**
 * Types of expense splitting.
 */
enum SplitType {
    EQUAL,      // Split equally among all participants
    EXACT,      // Exact amounts specified
    PERCENTAGE, // Percentage-based split
    SHARES      // Share-based split (e.g., 2:1:1)
}
