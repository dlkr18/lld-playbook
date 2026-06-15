package com.you.lld.problems.splitwise;

import com.you.lld.problems.splitwise.model.SplitType;
import com.you.lld.problems.splitwise.service.SplitwiseService;
import com.you.lld.problems.splitwise.service.impl.SplitwiseServiceImpl;
import com.you.lld.problems.splitwise.simplifier.BalanceSimplifier;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

/** Facade for expense sharing — delegates to {@link SplitwiseService}. */
public class Splitwise {
    private final SplitwiseService service;

    public Splitwise() {
        this(new SplitwiseServiceImpl());
    }

    public Splitwise(SplitwiseService service) {
        this.service = service;
    }

    public String addUser(String name, String email) {
        return service.addUser(name, email);
    }

    public String createGroup(String name, List<String> memberIds) {
        return service.createGroup(name, memberIds);
    }

    public String addEqualExpense(String groupId, String description, BigDecimal amount,
                                  String paidBy, List<String> participants) {
        return service.addExpense(groupId, description, amount, paidBy, participants, SplitType.EQUAL);
    }

    public String addExpense(String groupId, String description, BigDecimal amount,
                             String paidBy, List<String> participants, SplitType splitType,
                             Map<String, BigDecimal> splitDetails) {
        return service.addExpense(groupId, description, amount, paidBy, participants, splitType, splitDetails);
    }

    public Map<String, BigDecimal> getUserBalances(String userId) {
        return service.getUserBalances(userId);
    }

    public List<String> settleBalances(String userId) {
        return service.settleBalances(userId);
    }

    public List<BalanceSimplifier.Transaction> simplifyGroup(String groupId) {
        return service.simplifyGroupBalances(groupId);
    }
}
