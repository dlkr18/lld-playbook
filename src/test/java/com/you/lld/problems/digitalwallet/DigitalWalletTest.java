package com.you.lld.problems.digitalwallet;

import com.you.lld.problems.digitalwallet.model.Money;
import com.you.lld.problems.digitalwallet.model.Transaction;
import com.you.lld.problems.digitalwallet.model.TransactionStatus;
import com.you.lld.problems.digitalwallet.service.InsufficientFundsException;
import com.you.lld.problems.digitalwallet.service.LimitExceededException;
import com.you.lld.problems.digitalwallet.service.impl.DailyLimitTransferPolicy;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

@DisplayName("Digital Wallet Tests")
class DigitalWalletTest {

    private DigitalWallet wallet;
    private String alice;
    private String bob;

    @BeforeEach
    void setUp() {
        wallet = new DigitalWallet();
        alice = wallet.createAccount("Alice");
        bob = wallet.createAccount("Bob");
    }

    @Test
    @DisplayName("Top-up increases balance")
    void topUpIncreasesBalance() {
        wallet.topUp(alice, Money.of("500.00"));
        assertEquals(Money.of("500.00"), wallet.getBalance(alice));
    }

    @Test
    @DisplayName("Withdraw decreases balance")
    void withdrawDecreasesBalance() {
        wallet.topUp(alice, Money.of("500.00"));
        wallet.withdraw(alice, Money.of("200.00"));
        assertEquals(Money.of("300.00"), wallet.getBalance(alice));
    }

    @Test
    @DisplayName("Over-withdraw is rejected and balance is unchanged")
    void overWithdrawRejected() {
        wallet.topUp(alice, Money.of("100.00"));
        assertThrows(InsufficientFundsException.class,
                () -> wallet.withdraw(alice, Money.of("100.01")));
        assertEquals(Money.of("100.00"), wallet.getBalance(alice));
    }

    @Test
    @DisplayName("Transfer moves funds atomically between accounts")
    void transferMovesFundsAtomically() {
        wallet.topUp(alice, Money.of("300.00"));
        Transaction t = wallet.transfer(alice, bob, Money.of("120.00"));

        assertEquals(TransactionStatus.COMPLETED, t.status());
        assertEquals(Money.of("180.00"), wallet.getBalance(alice));
        assertEquals(Money.of("120.00"), wallet.getBalance(bob));
        // A transfer conserves money between the two wallets.
        assertEquals(Money.of("300.00"), wallet.getBalance(alice).plus(wallet.getBalance(bob)));
    }

    @Test
    @DisplayName("Insufficient-funds transfer leaves BOTH balances unchanged")
    void insufficientFundsTransferLeavesBothUnchanged() {
        wallet.topUp(alice, Money.of("50.00"));
        wallet.topUp(bob, Money.of("10.00"));

        assertThrows(InsufficientFundsException.class,
                () -> wallet.transfer(alice, bob, Money.of("75.00")));

        assertEquals(Money.of("50.00"), wallet.getBalance(alice));
        assertEquals(Money.of("10.00"), wallet.getBalance(bob));

        Transaction failed = wallet.history(alice).get(wallet.history(alice).size() - 1);
        assertEquals(TransactionStatus.FAILED, failed.status());
    }

    @Test
    @DisplayName("Idempotent transfer: same key twice charges exactly once")
    void idempotentTransferChargesOnce() {
        wallet.topUp(alice, Money.of("200.00"));
        String key = "idem-1";

        Transaction first = wallet.transfer(alice, bob, Money.of("70.00"), key);
        Transaction replay = wallet.transfer(alice, bob, Money.of("70.00"), key);

        assertSame(first, replay, "replay must return the original transaction");
        assertEquals(Money.of("130.00"), wallet.getBalance(alice));
        assertEquals(Money.of("70.00"), wallet.getBalance(bob));
    }

    @Test
    @DisplayName("A failed idempotent transfer leaves the key reusable for a genuine retry")
    void failedIdempotentTransferIsRetryable() {
        String key = "idem-retry";
        // First attempt fails: Alice has no money yet.
        assertThrows(InsufficientFundsException.class,
                () -> wallet.transfer(alice, bob, Money.of("40.00"), key));
        // Fund Alice, retry with the SAME key: now it should go through once.
        wallet.topUp(alice, Money.of("100.00"));
        Transaction t = wallet.transfer(alice, bob, Money.of("40.00"), key);
        assertEquals(TransactionStatus.COMPLETED, t.status());
        assertEquals(Money.of("60.00"), wallet.getBalance(alice));
        assertEquals(Money.of("40.00"), wallet.getBalance(bob));
    }

    @Test
    @DisplayName("Ledger always balances to zero and reconciles per account")
    void ledgerBalancesToZero() {
        wallet.topUp(alice, Money.of("500.00"));
        wallet.transfer(alice, bob, Money.of("150.00"));
        wallet.withdraw(bob, Money.of("20.00"));

        assertEquals(Money.ZERO, wallet.totalLedgerBalance());
        assertEquals(wallet.getBalance(alice), wallet.reconciledBalance(alice));
        assertEquals(wallet.getBalance(bob), wallet.reconciledBalance(bob));
    }

    @Test
    @DisplayName("Reversal returns funds and flips original to REVERSED")
    void reversalReturnsFunds() {
        wallet.topUp(alice, Money.of("100.00"));
        Transaction t = wallet.transfer(alice, bob, Money.of("40.00"));
        assertEquals(Money.of("60.00"), wallet.getBalance(alice));

        wallet.reverse(t.id());

        assertEquals(Money.of("100.00"), wallet.getBalance(alice));
        assertEquals(Money.of("0.00"), wallet.getBalance(bob));
        assertEquals(TransactionStatus.REVERSED, wallet.getTransaction(t.id()).status());
        assertEquals(Money.ZERO, wallet.totalLedgerBalance());
    }

    @Test
    @DisplayName("Daily limit policy vetoes an over-limit transfer (Strategy)")
    void dailyLimitPolicyVetoesTransfer() {
        DigitalWallet limited = new DigitalWallet(new DailyLimitTransferPolicy(Money.of("100.00")));
        String a = limited.createAccount("A");
        String b = limited.createAccount("B");
        limited.topUp(a, Money.of("500.00"));

        limited.transfer(a, b, Money.of("60.00"));
        assertThrows(LimitExceededException.class,
                () -> limited.transfer(a, b, Money.of("50.00"))); // 60 + 50 > 100
        // The vetoed transfer moved nothing.
        assertEquals(Money.of("440.00"), limited.getBalance(a));
        assertEquals(Money.of("60.00"), limited.getBalance(b));
    }

    @Test
    @DisplayName("Concurrent transfers conserve total balance with no lost updates")
    void concurrentTransfersConserveBalance() throws InterruptedException {
        final int n = 5;
        final String[] ids = new String[n];
        for (int i = 0; i < n; i++) {
            ids[i] = wallet.createAccount("U" + i);
            wallet.topUp(ids[i], Money.of("1000.00"));
        }
        Money startTotal = Money.of("5000.00");

        final int threads = 8;
        final int perThread = 500;
        ExecutorService pool = Executors.newFixedThreadPool(threads);
        final CountDownLatch start = new CountDownLatch(1);
        final CountDownLatch done = new CountDownLatch(threads);
        final AtomicInteger completed = new AtomicInteger();

        for (int t = 0; t < threads; t++) {
            final long seed = t * 104729L + 1;
            pool.submit(() -> {
                java.util.Random rnd = new java.util.Random(seed);
                try {
                    start.await();
                    for (int i = 0; i < perThread; i++) {
                        int a = rnd.nextInt(n);
                        int b = rnd.nextInt(n);
                        if (a == b) continue;
                        try {
                            wallet.transfer(ids[a], ids[b], Money.of("10.00"));
                            completed.incrementAndGet();
                        } catch (InsufficientFundsException ignored) {
                            // acceptable: source momentarily lacked funds
                        }
                    }
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                } finally {
                    done.countDown();
                }
            });
        }

        start.countDown();
        assertTrue(done.await(30, TimeUnit.SECONDS), "transfers deadlocked / timed out");
        pool.shutdownNow();

        Money endTotal = Money.ZERO;
        for (String id : ids) {
            endTotal = endTotal.plus(wallet.getBalance(id));
            assertFalse(wallet.getBalance(id).isNegative(), "no account may go negative");
        }
        assertEquals(startTotal, endTotal, "total balance must be conserved");
        assertEquals(Money.ZERO, wallet.totalLedgerBalance(), "ledger must net to zero");
        assertTrue(completed.get() > 0, "at least some transfers should have succeeded");
    }

    @Test
    @DisplayName("Self-transfer is rejected")
    void selfTransferRejected() {
        wallet.topUp(alice, Money.of("10.00"));
        assertThrows(IllegalArgumentException.class,
                () -> wallet.transfer(alice, alice, Money.of("5.00")));
    }

    @Test
    @DisplayName("History records every attempt for an account in order")
    void historyRecordsAttempts() {
        wallet.topUp(alice, Money.of("100.00"));
        wallet.transfer(alice, bob, Money.of("30.00"));
        List<Transaction> h = wallet.history(alice);
        assertNotNull(h);
        assertTrue(h.size() >= 2);
        for (int i = 1; i < h.size(); i++) {
            assertTrue(h.get(i - 1).id() < h.get(i).id(), "history must be ordered by id");
        }
    }
}
