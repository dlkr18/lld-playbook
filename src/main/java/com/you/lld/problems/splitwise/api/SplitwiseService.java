package com.you.lld.problems.splitwise.api;

import com.you.lld.problems.splitwise.model.*;
import java.util.*;

public interface SplitwiseService {
    String addUser(String name, String email);
    String createGroup(String name, List<String> memberIds);
    String addExpense(String groupId, String description, double amount, 
                     String paidBy, List<String> participants, SplitType splitType);
    Map<String, Double> getUserBalances(String userId);
    List<String> settleBalances(String userId);
}
