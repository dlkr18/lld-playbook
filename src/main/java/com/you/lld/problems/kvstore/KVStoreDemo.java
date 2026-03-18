package com.you.lld.problems.kvstore;

import com.you.lld.problems.kvstore.impl.InMemoryKVStore;

import java.util.List;

/**
 * Demo: Key-Value Store with TTL, transactions, snapshots, pattern search.
 */
public class KVStoreDemo {

    public static void main(String[] args) throws InterruptedException {
        System.out.println("=== Key-Value Store Demo ===\n");

        InMemoryKVStore store = new InMemoryKVStore();

        // --- Basic CRUD ---
        System.out.println("--- Basic CRUD ---");
        store.put("user:1:name", "Alice");
        store.put("user:1:email", "alice@example.com");
        store.put("user:2:name", "Bob");

        System.out.println("GET user:1:name = " + store.get("user:1:name"));
        System.out.println("EXISTS user:2:name = " + store.exists("user:2:name"));

        store.delete("user:2:name");
        System.out.println("After delete, EXISTS user:2:name = " + store.exists("user:2:name"));

        // --- Pattern search ---
        System.out.println("\n--- Pattern search ---");
        List<String> userKeys = store.keys("user:1");
        System.out.println("Keys matching 'user:1': " + userKeys);

        // --- TTL ---
        System.out.println("\n--- TTL ---");
        store.put("session:abc", "token-xyz", 1); // 1 second TTL
        System.out.println("GET session:abc = " + store.get("session:abc"));
        System.out.println("Sleeping 1.5 seconds...");
        Thread.sleep(1500);
        System.out.println("GET session:abc (after TTL) = " + store.get("session:abc"));

        // --- Transactions ---
        System.out.println("\n--- Transactions ---");
        store.put("balance:alice", "100");
        store.put("balance:bob", "50");

        String txn = store.beginTransaction();
        System.out.println("Begin transaction: " + txn);
        store.put("balance:alice", "80");  // debit alice
        store.put("balance:bob", "70");    // credit bob
        store.commitTransaction(txn);
        System.out.println("After commit: alice=" + store.get("balance:alice") 
            + ", bob=" + store.get("balance:bob"));

        // Transaction with rollback
        String txn2 = store.beginTransaction();
        store.put("balance:alice", "0");
        System.out.println("During txn: alice=" + store.get("balance:alice"));
        store.rollbackTransaction(txn2);
        System.out.println("After rollback: alice=" + store.get("balance:alice"));

        // --- Snapshots ---
        System.out.println("\n--- Snapshots ---");
        String snapId = store.createSnapshot();
        System.out.println("Created snapshot: " + snapId);
        store.put("balance:alice", "999");
        System.out.println("Modified alice to 999");
        store.restoreSnapshot(snapId);
        System.out.println("After restore: alice=" + store.get("balance:alice"));

        System.out.println("\n=== Demo complete ===");
    }
}
