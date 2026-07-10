package com.you.lld.problems.digitalwallet;

import com.you.lld.problems.digitalwallet.model.LedgerEntry;
import com.you.lld.problems.digitalwallet.model.Money;
import com.you.lld.problems.digitalwallet.model.Transaction;
import com.you.lld.problems.digitalwallet.service.InsufficientFundsException;
import com.you.lld.problems.digitalwallet.service.impl.DailyLimitTransferPolicy;
import com.you.lld.problems.digitalwallet.service.impl.LoggingTransactionObserver;

import java.util.List;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * Interview-style walkthrough. Each scenario proves exactly one design point.
 *
 * Run: mvn -q compile exec:java \
 *   -Dexec.mainClass="com.you.lld.problems.digitalwallet.DigitalWalletDemo"
 */
public final class DigitalWalletDemo {

    public static void main(String[] args) throws Exception {
        // A daily transfer limit demonstrates the Strategy policy.
        DigitalWallet wallet = new DigitalWallet(new DailyLimitTransferPolicy(Money.of("10000.00")));
        // Observer: push a notification on every terminal transaction.
        wallet.registerObserver(new LoggingTransactionObserver("PUSH"));

        String alice = wallet.createAccount("Alice");
        String bob = wallet.createAccount("Bob");

        scenario1TopUpAndWithdraw(wallet, alice);
        scenario2AtomicTransfer(wallet, alice, bob);
        scenario3InsufficientFunds(wallet, alice, bob);
        scenario4Idempotency(wallet, alice, bob);
        scenario5Reversal(wallet, alice, bob);
        scenario6DoubleEntryLedger(wallet, alice, bob);
        scenario7ConcurrentTransfers();
    }

    private static void scenario1TopUpAndWithdraw(DigitalWallet wallet, String alice) {
        header("1. Top-up credits, withdraw debits (BigDecimal money, funds check)");
        wallet.topUp(alice, Money.of("500.00"));
        System.out.println("  Alice after top-up 500.00 : " + wallet.getBalance(alice));
        wallet.withdraw(alice, Money.of("120.50"));
        System.out.println("  Alice after withdraw 120.50: " + wallet.getBalance(alice));
    }

    private static void scenario2AtomicTransfer(DigitalWallet wallet, String alice, String bob) {
        header("2. P2P transfer moves funds atomically (debit A + credit B)");
        wallet.topUp(bob, Money.of("50.00"));
        System.out.println("  before: Alice=" + wallet.getBalance(alice) + " Bob=" + wallet.getBalance(bob));
        wallet.transfer(alice, bob, Money.of("100.00"));
        System.out.println("  after : Alice=" + wallet.getBalance(alice) + " Bob=" + wallet.getBalance(bob));
    }

    private static void scenario3InsufficientFunds(DigitalWallet wallet, String alice, String bob) {
        header("3. Insufficient-funds transfer is rejected; both balances untouched");
        Money aliceBefore = wallet.getBalance(alice);
        Money bobBefore = wallet.getBalance(bob);
        try {
            wallet.transfer(alice, bob, Money.of("5000.00")); // under daily limit, over balance
        } catch (InsufficientFundsException ex) {
            System.out.println("  rejected: " + ex.getMessage());
        }
        System.out.println("  unchanged: Alice=" + wallet.getBalance(alice)
                + " (was " + aliceBefore + ")  Bob=" + wallet.getBalance(bob) + " (was " + bobBefore + ")");
    }

    private static void scenario4Idempotency(DigitalWallet wallet, String alice, String bob) {
        header("4. Idempotent transfer: same key twice => charged once");
        String key = "order-4242";
        Transaction first = wallet.transfer(alice, bob, Money.of("30.00"), key);
        Money aliceMid = wallet.getBalance(alice);
        Transaction replay = wallet.transfer(alice, bob, Money.of("30.00"), key); // retry (network glitch)
        System.out.println("  first txn id=" + first.id() + "  replay txn id=" + replay.id()
                + "  (same object: " + (first == replay) + ")");
        System.out.println("  Alice charged once: balance still " + wallet.getBalance(alice)
                + " == " + aliceMid);
    }

    private static void scenario5Reversal(DigitalWallet wallet, String alice, String bob) {
        header("5. Reversal: COMPLETED -> REVERSED via a compensating movement (State)");
        Money bobBefore = wallet.getBalance(bob);
        Transaction t = wallet.transfer(alice, bob, Money.of("25.00"));
        System.out.println("  transferred 25.00, Bob=" + wallet.getBalance(bob) + " txn " + t.status());
        wallet.reverse(t.id());
        System.out.println("  after reverse, Bob=" + wallet.getBalance(bob) + " (was " + bobBefore + ")"
                + "  original now " + wallet.getTransaction(t.id()).status());
    }

    private static void scenario6DoubleEntryLedger(DigitalWallet wallet, String alice, String bob) {
        header("6. Double-entry ledger always nets to zero");
        System.out.println("  Alice ledger entries:");
        for (LedgerEntry e : wallet.ledgerEntries(alice)) {
            System.out.println("    " + e);
        }
        System.out.println("  Alice reconciled balance = " + wallet.reconciledBalance(alice)
                + "  (live = " + wallet.getBalance(alice) + ")");
        System.out.println("  TOTAL LEDGER BALANCE      = " + wallet.totalLedgerBalance() + "  <-- always 0");
    }

    private static void scenario7ConcurrentTransfers() throws InterruptedException {
        header("7. Concurrency: many random transfers conserve total balance (no deadlock)");
        final DigitalWallet wallet = new DigitalWallet();
        final int n = 6;
        final String[] ids = new String[n];
        for (int i = 0; i < n; i++) {
            ids[i] = wallet.createAccount("User" + i);
            wallet.topUp(ids[i], Money.of("1000.00"));
        }
        Money startTotal = totalUserBalance(wallet, ids);

        int threads = 8, perThread = 400;
        ExecutorService pool = Executors.newFixedThreadPool(threads);
        final CountDownLatch done = new CountDownLatch(threads);
        for (int t = 0; t < threads; t++) {
            final long seed = t * 7919L + 13;
            pool.submit(new Runnable() {
                @Override
                public void run() {
                    java.util.Random rnd = new java.util.Random(seed);
                    try {
                        for (int i = 0; i < perThread; i++) {
                            int a = rnd.nextInt(n), b = rnd.nextInt(n);
                            if (a == b) continue;
                            try {
                                wallet.transfer(ids[a], ids[b], Money.of("10.00"));
                            } catch (InsufficientFundsException ignored) {
                                // expected sometimes; funds simply weren't there
                            }
                        }
                    } finally {
                        done.countDown();
                    }
                }
            });
        }
        done.await();
        pool.shutdown();

        Money endTotal = totalUserBalance(wallet, ids);
        System.out.println("  start total = " + startTotal + "   end total = " + endTotal
                + "   conserved: " + startTotal.equals(endTotal));
        System.out.println("  total ledger balance = " + wallet.totalLedgerBalance() + "  <-- still 0");
    }

    private static Money totalUserBalance(DigitalWallet wallet, String[] ids) {
        Money sum = Money.ZERO;
        for (String id : ids) {
            sum = sum.plus(wallet.getBalance(id));
        }
        return sum;
    }

    private static void header(String title) {
        System.out.println();
        System.out.println("=== " + title + " ===");
    }
}
