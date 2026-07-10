package com.you.lld.problems.digitalwallet.service.impl;

import com.you.lld.problems.digitalwallet.model.Account;
import com.you.lld.problems.digitalwallet.model.Money;
import com.you.lld.problems.digitalwallet.service.LimitExceededException;
import com.you.lld.problems.digitalwallet.service.TransferPolicy;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

/**
 * Strategy that caps the total amount a single source account may transfer out
 * per calendar day. Accrued usage is tracked per (account, day); a new day
 * resets the running total lazily on first use.
 *
 * <p>Thread-safety: usage accrual guards the per-account counter under a small
 * synchronized block keyed on the account id's interned monitor object.
 */
public final class DailyLimitTransferPolicy implements TransferPolicy {

    private final Money dailyLimit;
    private final ZoneId zone;
    private final ConcurrentMap<String, DayUsage> usage = new ConcurrentHashMap<String, DayUsage>();

    public DailyLimitTransferPolicy(Money dailyLimit) {
        this(dailyLimit, ZoneId.systemDefault());
    }

    public DailyLimitTransferPolicy(Money dailyLimit, ZoneId zone) {
        if (dailyLimit == null || dailyLimit.isNegative()) {
            throw new IllegalArgumentException("dailyLimit must be non-negative");
        }
        this.dailyLimit = dailyLimit;
        this.zone = zone;
    }

    @Override
    public void validate(Account from, Account to, Money amount) {
        LocalDate today = LocalDate.now(zone);
        DayUsage u = usage.get(from.id());
        Money spentToday = (u != null && today.equals(u.day)) ? u.spent : Money.ZERO;
        Money projected = spentToday.plus(amount);
        if (dailyLimit.isLessThan(projected)) {
            throw new LimitExceededException("Daily transfer limit " + dailyLimit
                    + " exceeded for " + from.id() + " (already " + spentToday + ", +" + amount + ")");
        }
    }

    @Override
    public void onCompleted(Account from, Account to, Money amount) {
        LocalDate today = LocalDate.now(zone);
        usage.compute(from.id(), new java.util.function.BiFunction<String, DayUsage, DayUsage>() {
            @Override
            public DayUsage apply(String key, DayUsage current) {
                if (current == null || !today.equals(current.day)) {
                    return new DayUsage(today, amount);
                }
                return new DayUsage(today, current.spent.plus(amount));
            }
        });
    }

    private static final class DayUsage {
        final LocalDate day;
        final Money spent;

        DayUsage(LocalDate day, Money spent) {
            this.day = day;
            this.spent = spent;
        }
    }
}
