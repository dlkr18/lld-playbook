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
