package com.you.lld.problems.splitwise.service;

import com.you.lld.problems.splitwise.model.SplitType;
import com.you.lld.problems.splitwise.simplifier.BalanceSimplifier;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public interface SplitwiseService {
    String addUser(String name, String email);
    String createGroup(String name, List<String> memberIds);
    String addExpense(String groupId, String description, BigDecimal amount,
                      String paidBy, List<String> participants, SplitType splitType);
    String addExpense(String groupId, String description, BigDecimal amount,
                      String paidBy, List<String> participants, SplitType splitType,
                      Map<String, BigDecimal> splitDetails);
    Map<String, BigDecimal> getUserBalances(String userId);
    List<String> settleBalances(String userId);
    List<BalanceSimplifier.Transaction> simplifyGroupBalances(String groupId);
}
