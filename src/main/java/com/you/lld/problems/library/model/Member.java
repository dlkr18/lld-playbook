package com.you.lld.problems.library.model;

import java.time.LocalDate;
import java.util.*;

/**
 * Library account -- can be a LIBRARIAN (admin) or MEMBER (borrower).
 * Tracks borrowed item barcodes (not ISBNs) and outstanding fines.
 */
public class Member {
    private final String id;
    private final String name;
    private final String email;
    private final AccountType accountType;
    private final LocalDate memberSince;
    private final Set<String> borrowedBarcodes; // barcode set
    private final int maxBooksAllowed;
    private double totalFinesOwed;

    public static final int DEFAULT_MAX_BOOKS = 5;

    public Member(String id, String name, String email) {
        this(id, name, email, AccountType.MEMBER, DEFAULT_MAX_BOOKS);
    }

    public Member(String id, String name, String email, AccountType accountType) {
        this(id, name, email, accountType, DEFAULT_MAX_BOOKS);
    }

    public Member(String id, String name, String email, AccountType accountType, int maxBooks) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.accountType = accountType;
        this.memberSince = LocalDate.now();
        this.borrowedBarcodes = new HashSet<>();
        this.maxBooksAllowed = maxBooks;
        this.totalFinesOwed = 0.0;
    }

    public boolean canBorrow() {
        return borrowedBarcodes.size() < maxBooksAllowed && totalFinesOwed == 0.0;
    }

    public void addBorrowedItem(String barcode) { borrowedBarcodes.add(barcode); }
    public void removeBorrowedItem(String barcode) { borrowedBarcodes.remove(barcode); }
    public boolean hasBorrowed(String barcode) { return borrowedBarcodes.contains(barcode); }

    public void chargeFine(double amount) { this.totalFinesOwed += amount; }
    public void payFine(double amount) {
        this.totalFinesOwed = Math.max(0, this.totalFinesOwed - amount);
    }

    public boolean isLibrarian() { return accountType == AccountType.LIBRARIAN; }
    public boolean isMember() { return accountType == AccountType.MEMBER; }

    public String getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public AccountType getAccountType() { return accountType; }
    public LocalDate getMemberSince() { return memberSince; }
    public Set<String> getBorrowedBarcodes() { return Collections.unmodifiableSet(borrowedBarcodes); }
    public int getBorrowedCount() { return borrowedBarcodes.size(); }
    public int getMaxBooksAllowed() { return maxBooksAllowed; }
    public double getTotalFinesOwed() { return totalFinesOwed; }

    @Override
    public String toString() {
        return name + " [" + accountType + "] (ID: " + id + ") - borrowed: "
                + borrowedBarcodes.size() + "/" + maxBooksAllowed
                + (totalFinesOwed > 0 ? ", fines: $" + String.format("%.2f", totalFinesOwed) : "");
    }
}
