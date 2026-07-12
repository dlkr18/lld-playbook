package com.you.lld.problems.splitwise.service.impl;

import com.you.lld.problems.splitwise.model.Expense;
import com.you.lld.problems.splitwise.model.Group;
import com.you.lld.problems.splitwise.model.SplitType;
import com.you.lld.problems.splitwise.model.User;
import com.you.lld.problems.splitwise.service.SplitStrategy;
import com.you.lld.problems.splitwise.service.SplitwiseService;
import com.you.lld.problems.splitwise.simplifier.BalanceSimplifier;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

public class SplitwiseServiceImpl implements SplitwiseService {
    private final Map<String, User> users = new ConcurrentHashMap<String, User>();
    private final Map<String, Group> groups = new ConcurrentHashMap<String, Group>();
    private final Map<String, Expense> expenses = new ConcurrentHashMap<String, Expense>();

    @Override
    public String addUser(String name, String email) {
        String userId = UUID.randomUUID().toString();
        users.put(userId, new User(userId, name, email));
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
        return groupId;
    }

    @Override
    public String addExpense(String groupId, String description, BigDecimal amount,
                             String paidBy, List<String> participants, SplitType splitType) {
        return addExpense(groupId, description, amount, paidBy, participants, splitType, null);
    }

    @Override
    public String addExpense(String groupId, String description, BigDecimal amount,
                             String paidBy, List<String> participants, SplitType splitType,
                             Map<String, BigDecimal> splitDetails) {
        SplitStrategy strategy = SplitStrategyFactory.forType(splitType);
        String expenseId = UUID.randomUUID().toString();
        Expense expense = new Expense(expenseId, description, amount, paidBy, participants,
                splitType, strategy, splitDetails);
        expenses.put(expenseId, expense);

        Group group = groups.get(groupId);
        if (group != null) {
            group.addExpense(expenseId);
        }
        applyExpense(expense);
        return expenseId;
    }

    private synchronized void applyExpense(Expense expense) {
        User payer = users.get(expense.getPaidBy());
        if (payer == null) {
            throw new IllegalArgumentException("Unknown payer: " + expense.getPaidBy());
        }
        for (Map.Entry<String, BigDecimal> entry : expense.getSplits().entrySet()) {
            String userId = entry.getKey();
            BigDecimal share = entry.getValue();
            if (userId.equals(expense.getPaidBy())) {
                continue;
            }
            payer.updateBalance(userId, share);
            User participant = users.get(userId);
            if (participant != null) {
                participant.updateBalance(expense.getPaidBy(), share.negate());
            }
        }
    }

    @Override
    public Map<String, BigDecimal> getUserBalances(String userId) {
        User user = users.get(userId);
        return user != null ? user.getBalances() : Collections.<String, BigDecimal>emptyMap();
    }

    @Override
    public List<String> settleBalances(String userId) {
        List<String> settlements = new ArrayList<String>();
        User user = users.get(userId);
        if (user == null) {
            return settlements;
        }
        BigDecimal epsilon = new BigDecimal("0.01");
        for (Map.Entry<String, BigDecimal> entry : user.getBalances().entrySet()) {
            User other = users.get(entry.getKey());
            if (other == null) {
                continue;
            }
            BigDecimal amount = entry.getValue();
            if (amount.compareTo(epsilon) > 0) {
                settlements.add(other.getName() + " owes you $" + amount.setScale(2, BigDecimal.ROUND_HALF_UP));
            } else if (amount.compareTo(epsilon.negate()) < 0) {
                settlements.add("You owe " + other.getName() + " $" + amount.negate().setScale(2, BigDecimal.ROUND_HALF_UP));
            }
        }
        return settlements;
    }

    @Override
    public List<BalanceSimplifier.Transaction> simplifyGroupBalances(String groupId) {
        Group group = groups.get(groupId);
        if (group == null) {
            return Collections.emptyList();
        }
        Map<String, BigDecimal> net = new HashMap<String, BigDecimal>();
        for (String memberId : group.getMemberIds()) {
            net.put(memberId, computeNetBalance(memberId));
        }
        return BalanceSimplifier.simplifyBalances(net);
    }

    private BigDecimal computeNetBalance(String userId) {
        BigDecimal net = BigDecimal.ZERO;
        for (Map.Entry<String, BigDecimal> e : getUserBalances(userId).entrySet()) {
            net = net.add(e.getValue());
        }
        return net;
    }

    public User getUser(String userId) {
        return users.get(userId);
    }
}
