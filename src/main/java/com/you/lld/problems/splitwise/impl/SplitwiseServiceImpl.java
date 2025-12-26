package com.you.lld.problems.splitwise.impl;

import com.you.lld.problems.splitwise.api.SplitwiseService;
import com.you.lld.problems.splitwise.model.*;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

public class SplitwiseServiceImpl implements SplitwiseService {
    private final Map<String, User> users = new ConcurrentHashMap<>();
    private final Map<String, Group> groups = new ConcurrentHashMap<>();
    private final Map<String, Expense> expenses = new ConcurrentHashMap<>();
    
    @Override
    public String addUser(String name, String email) {
        String userId = UUID.randomUUID().toString();
        User user = new User(userId, name, email);
        users.put(userId, user);
        System.out.println("User added: " + name);
        return userId;
    }
    
    @Override
    public String createGroup(String name, List<String> memberIds) {
        String groupId = UUID.randomUUID().toString();
        Group group = new Group(groupId, name);
        for (String memberId : memberIds) {
            group.addMember(memberId);
        }
        groups.put(groupId, group);
        System.out.println("Group created: " + name);
        return groupId;
    }
    
    @Override
    public String addExpense(String groupId, String description, double amount,
                            String paidBy, List<String> participants, SplitType splitType) {
        String expenseId = UUID.randomUUID().toString();
        Expense expense = new Expense(expenseId, description, amount, paidBy, participants, splitType);
        expenses.put(expenseId, expense);
        
        Group group = groups.get(groupId);
        if (group != null) {
            group.addExpense(expenseId);
        }
        
        updateBalances(expense);
        System.out.println("Expense added: " + description + " - $" + amount);
        return expenseId;
    }
    
    private void updateBalances(Expense expense) {
        User payer = users.get(expense.getPaidBy());
        if (payer == null) return;
        
        for (Map.Entry<String, Double> entry : expense.getSplits().entrySet()) {
            String userId = entry.getKey();
            double share = entry.getValue();
            
            if (!userId.equals(expense.getPaidBy())) {
                payer.updateBalance(userId, share);
                User user = users.get(userId);
                if (user != null) {
                    user.updateBalance(expense.getPaidBy(), -share);
                }
            }
        }
    }
    
    @Override
    public Map<String, Double> getUserBalances(String userId) {
        User user = users.get(userId);
        return user != null ? user.getBalances() : Collections.emptyMap();
    }
    
    @Override
    public List<String> settleBalances(String userId) {
        List<String> settlements = new ArrayList<>();
        User user = users.get(userId);
        if (user == null) return settlements;
        
        for (Map.Entry<String, Double> entry : user.getBalances().entrySet()) {
            String otherUserId = entry.getKey();
            double amount = entry.getValue();
            
            if (amount > 0.01) {
                User otherUser = users.get(otherUserId);
                String settlement = otherUser.getName() + " owes you $" + String.format("%.2f", amount);
                settlements.add(settlement);
            } else if (amount < -0.01) {
                User otherUser = users.get(otherUserId);
                String settlement = "You owe " + otherUser.getName() + " $" + String.format("%.2f", -amount);
                settlements.add(settlement);
            }
        }
        
        return settlements;
    }
}
