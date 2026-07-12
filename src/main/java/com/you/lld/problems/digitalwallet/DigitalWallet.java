package com.you.lld.problems.digitalwallet;

import com.you.lld.problems.digitalwallet.model.Account;
import com.you.lld.problems.digitalwallet.model.LedgerEntry;
import com.you.lld.problems.digitalwallet.model.Money;
import com.you.lld.problems.digitalwallet.model.Transaction;
import com.you.lld.problems.digitalwallet.service.AccountService;
import com.you.lld.problems.digitalwallet.service.LedgerService;
import com.you.lld.problems.digitalwallet.service.TransactionObserver;
import com.you.lld.problems.digitalwallet.service.TransactionService;
import com.you.lld.problems.digitalwallet.service.TransferPolicy;
import com.you.lld.problems.digitalwallet.service.impl.DefaultTransactionService;
import com.you.lld.problems.digitalwallet.service.impl.InMemoryAccountService;
import com.you.lld.problems.digitalwallet.service.impl.InMemoryLedgerService;
import com.you.lld.problems.digitalwallet.service.impl.UnlimitedTransferPolicy;

import java.util.List;

/**
 * Facade / orchestrator — the single object an interviewer sees first.
 *
 * <p>It wires the account registry, the double-entry ledger and the transaction
 * engine, owns the special "system cash" account (the external-world counterparty
 * for every top-up and withdrawal), and exposes a small, task-focused API.
 *
 * <p>Design highlights surfaced through this facade:
 * <ul>
 *   <li><b>Double-entry ledger</b> — every operation is a balanced DEBIT/CREDIT
 *       pair; {@link #totalLedgerBalance()} is always zero.</li>
 *   <li><b>Atomic, deadlock-free transfers</b> — see {@link DefaultTransactionService}.</li>
 *   <li><b>Idempotent transfers</b> — {@link #transfer(String, String, Money, String)}.</li>
 *   <li><b>Strategy / Observer / Command / State</b> pluggable throughout.</li>
 * </ul>
 */
public final class DigitalWallet {

    /** Well-known id of the external-world cash account (overdraft-enabled). */
    public static final String SYSTEM_ACCOUNT_ID = "SYSTEM";

    private final AccountService accountService;
    private final LedgerService ledgerService;
    private final TransactionService transactionService;
    private final Account systemAccount;

    public DigitalWallet() {
        this(new UnlimitedTransferPolicy());
    }

    public DigitalWallet(TransferPolicy transferPolicy) {
        this.accountService = new InMemoryAccountService();
        this.ledgerService = new InMemoryLedgerService();
        this.systemAccount = new Account(SYSTEM_ACCOUNT_ID, "SYSTEM_CASH", true);
        this.transactionService =
                new DefaultTransactionService(accountService, ledgerService, transferPolicy, systemAccount);
    }

    // ----- accounts ------------------------------------------------------------

    public String createAccount(String ownerName) {
        return accountService.createAccount(ownerName).id();
    }

    public Money getBalance(String accountId) {
        return accountService.getBalance(accountId);
    }

    // ----- money movement ------------------------------------------------------

    public Transaction topUp(String accountId, Money amount) {
        return transactionService.topUp(accountId, amount);
    }

    public Transaction withdraw(String accountId, Money amount) {
        return transactionService.withdraw(accountId, amount);
    }

    public Transaction transfer(String fromAccountId, String toAccountId, Money amount) {
        return transactionService.transfer(fromAccountId, toAccountId, amount);
    }

    public Transaction transfer(String fromAccountId, String toAccountId, Money amount, String idempotencyKey) {
        return transactionService.transfer(fromAccountId, toAccountId, amount, idempotencyKey);
    }

    public Transaction reverse(long transactionId) {
        return transactionService.reverse(transactionId);
    }

    // ----- queries -------------------------------------------------------------

    public List<Transaction> history(String accountId) {
        return transactionService.history(accountId);
    }

    public Transaction getTransaction(long transactionId) {
        return transactionService.getTransaction(transactionId);
    }

    public List<LedgerEntry> ledgerEntries(String accountId) {
        return ledgerService.entriesFor(accountId);
    }

    /** Signed sum across the entire ledger. Invariant: always {@link Money#ZERO}. */
    public Money totalLedgerBalance() {
        return ledgerService.totalBalance();
    }

    /** Signed sum of one account's ledger entries — must match its live balance. */
    public Money reconciledBalance(String accountId) {
        return ledgerService.reconciledBalance(accountId);
    }

    public Money systemBalance() {
        return systemAccount.balance();
    }

    // ----- observers -----------------------------------------------------------

    public void registerObserver(TransactionObserver observer) {
        transactionService.registerObserver(observer);
    }
}
