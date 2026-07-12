package com.you.lld.problems.digitalwallet.service.impl;

import com.you.lld.problems.digitalwallet.model.Account;
import com.you.lld.problems.digitalwallet.model.LedgerEntry;
import com.you.lld.problems.digitalwallet.model.Money;
import com.you.lld.problems.digitalwallet.model.Transaction;
import com.you.lld.problems.digitalwallet.model.TransactionType;
import com.you.lld.problems.digitalwallet.service.AccountService;
import com.you.lld.problems.digitalwallet.service.InsufficientFundsException;
import com.you.lld.problems.digitalwallet.service.LedgerService;
import com.you.lld.problems.digitalwallet.service.TransactionObserver;
import com.you.lld.problems.digitalwallet.service.TransactionService;
import com.you.lld.problems.digitalwallet.service.TransferPolicy;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.atomic.AtomicLong;
import java.util.concurrent.locks.ReentrantLock;

/**
 * The engine. Every public operation is realised by a {@link com.you.lld.problems.digitalwallet.service.WalletCommand}
 * whose {@link #performMovement} core does the one thing that matters: move money
 * between two accounts atomically and deadlock-free, then append the balanced
 * ledger pair.
 *
 * <h3>Deadlock-free atomic transfer</h3>
 * A transfer must debit A and credit B as one indivisible step. Locking A then B
 * in one thread while another locks B then A is the classic deadlock. We avoid it
 * by always acquiring the two accounts' locks in a single <em>global order</em> —
 * ascending account id — regardless of transfer direction. See {@link #lockOrdered}.
 *
 * <h3>Idempotency</h3>
 * A transfer carrying an idempotency key executes at most once: the very first
 * call for a key runs under {@code ConcurrentHashMap.computeIfAbsent} and caches
 * its resulting transaction; every replay returns that same transaction without
 * moving funds again.
 */
public final class DefaultTransactionService implements TransactionService {

    private final AccountService accountService;
    private final LedgerService ledgerService;
    private final TransferPolicy transferPolicy;
    private final Account systemAccount;

    private final AtomicLong txnIdSeq = new AtomicLong(0);
    private final ConcurrentMap<Long, Transaction> transactions = new ConcurrentHashMap<Long, Transaction>();
    private final ConcurrentMap<String, Transaction> idempotencyStore = new ConcurrentHashMap<String, Transaction>();
    private final List<TransactionObserver> observers = new CopyOnWriteArrayList<TransactionObserver>();

    public DefaultTransactionService(AccountService accountService, LedgerService ledgerService,
                                     TransferPolicy transferPolicy, Account systemAccount) {
        this.accountService = accountService;
        this.ledgerService = ledgerService;
        this.transferPolicy = transferPolicy;
        this.systemAccount = systemAccount;
    }

    // ----- public API (each backed by a command) -------------------------------

    @Override
    public Transaction topUp(String accountId, Money amount) {
        Account target = accountService.getAccount(accountId);
        return new TopUpCommand(this, systemAccount, target, amount).execute();
    }

    @Override
    public Transaction withdraw(String accountId, Money amount) {
        Account target = accountService.getAccount(accountId);
        return new WithdrawCommand(this, target, systemAccount, amount).execute();
    }

    @Override
    public Transaction transfer(String fromAccountId, String toAccountId, Money amount) {
        return transfer(fromAccountId, toAccountId, amount, null);
    }

    @Override
    public Transaction transfer(String fromAccountId, String toAccountId, Money amount, String idempotencyKey) {
        final Account from = accountService.getAccount(fromAccountId);
        final Account to = accountService.getAccount(toAccountId);
        if (from.id().equals(to.id())) {
            throw new IllegalArgumentException("Cannot transfer to the same account: " + fromAccountId);
        }
        final String key = (idempotencyKey == null || idempotencyKey.trim().isEmpty()) ? null : idempotencyKey;
        if (key == null) {
            return new TransferCommand(this, transferPolicy, from, to, amount, null).execute();
        }
        // Fast path: already seen.
        Transaction existing = idempotencyStore.get(key);
        if (existing != null) {
            return existing;
        }
        // Execute-at-most-once. If the transfer throws (e.g. insufficient funds),
        // computeIfAbsent stores nothing, leaving the key free for a genuine retry.
        return idempotencyStore.computeIfAbsent(key, new java.util.function.Function<String, Transaction>() {
            @Override
            public Transaction apply(String k) {
                return new TransferCommand(DefaultTransactionService.this, transferPolicy, from, to, amount, k).execute();
            }
        });
    }

    @Override
    public Transaction reverse(long transactionId) {
        Transaction original = getTransaction(transactionId);
        return new ReversalCommand(this, original).execute();
    }

    @Override
    public List<Transaction> history(String accountId) {
        List<Transaction> out = new ArrayList<Transaction>();
        for (Transaction t : transactions.values()) {
            if (t.fromAccountId().equals(accountId) || t.toAccountId().equals(accountId)) {
                out.add(t);
            }
        }
        Collections.sort(out, new Comparator<Transaction>() {
            @Override
            public int compare(Transaction a, Transaction b) {
                return Long.compare(a.id(), b.id());
            }
        });
        return out;
    }

    @Override
    public Transaction getTransaction(long transactionId) {
        Transaction t = transactions.get(transactionId);
        if (t == null) {
            throw new IllegalArgumentException("No such transaction: " + transactionId);
        }
        return t;
    }

    @Override
    public void registerObserver(TransactionObserver observer) {
        observers.add(observer);
    }

    Account systemAccount() {
        return systemAccount;
    }

    /** Resolve a user account via the registry (used by reversal). */
    Account accountFor(String accountId) {
        return accountService.getAccount(accountId);
    }

    // ----- movement core (package-private, used by commands) --------------------

    /**
     * Atomically move {@code amount} from {@code from} to {@code to}, recording a
     * balanced ledger pair. All-or-nothing: if the source lacks funds nothing is
     * mutated. Locks are taken in global id order to stay deadlock-free.
     */
    Transaction performMovement(TransactionType type, Account from, Account to, Money amount, String idempotencyKey) {
        Transaction txn = new Transaction(txnIdSeq.incrementAndGet(), type, from.id(), to.id(), amount, idempotencyKey);
        transactions.put(txn.id(), txn);

        ReentrantLock firstLock = lower(from, to).lock();
        ReentrantLock secondLock = higher(from, to).lock();
        firstLock.lock();
        secondLock.lock();
        try {
            if (!from.allowsOverdraft() && from.balance().isLessThan(amount)) {
                throw new InsufficientFundsException("Insufficient funds in " + from.id()
                        + ": balance=" + from.balance() + " required=" + amount);
            }
            from.debit(amount);   // both locks held → indivisible
            to.credit(amount);
            List<LedgerEntry> pair = ledgerService.record(txn.id(), from.id(), to.id(), amount);
            txn.markCompleted(pair);
        } catch (RuntimeException ex) {
            txn.markFailed(ex.getMessage());
            notifyObservers(txn);
            throw ex;
        } finally {
            secondLock.unlock();
            firstLock.unlock();
        }
        notifyObservers(txn);
        return txn;
    }

    void notifyObservers(Transaction txn) {
        for (TransactionObserver o : observers) {
            o.onTransaction(txn);
        }
    }

    private static Account lower(Account a, Account b) {
        return a.id().compareTo(b.id()) <= 0 ? a : b;
    }

    private static Account higher(Account a, Account b) {
        return a.id().compareTo(b.id()) <= 0 ? b : a;
    }
}
