package com.you.lld.problems.splitwise;

import com.you.lld.problems.splitwise.model.SplitType;
import com.you.lld.problems.splitwise.service.impl.SplitwiseServiceImpl;
import com.you.lld.problems.splitwise.simplifier.BalanceSimplifier;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class GroupSimplifyScopeTest {

    @Test
    void simplifyCountsOnlyThatGroupsExpenses() {
        SplitwiseServiceImpl service = new SplitwiseServiceImpl();
        String a = service.addUser("A", "a@x.com");
        String b = service.addUser("B", "b@x.com");
        String trip = service.createGroup("Trip", Arrays.asList(a, b));
        String flat = service.createGroup("Flat", Arrays.asList(a, b));

        service.addExpense(trip, "Hotel", new BigDecimal("100"), a, Arrays.asList(a, b), SplitType.EQUAL);
        service.addExpense(flat, "Groceries", new BigDecimal("60"), b, Arrays.asList(a, b), SplitType.EQUAL);

        List<BalanceSimplifier.Transaction> txns = service.simplifyGroupBalances(trip);

        assertEquals(1, txns.size());
        assertEquals(b, txns.get(0).getFrom());
        assertEquals(a, txns.get(0).getTo());
        assertEquals(0, new BigDecimal("50").compareTo(txns.get(0).getAmount()));
    }
}
