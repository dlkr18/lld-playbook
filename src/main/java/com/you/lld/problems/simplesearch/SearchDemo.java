package com.you.lld.problems.simplesearch;

import com.you.lld.problems.simplesearch.impl.InvertedIndexSearchEngine;
import com.you.lld.problems.simplesearch.model.Document;
import com.you.lld.problems.simplesearch.model.SearchResult;

import java.util.List;

/**
 * Demo: Search Engine with inverted index, relevance scoring, pagination.
 */
public class SearchDemo {

    public static void main(String[] args) {
        System.out.println("=== Simple Search Engine Demo ===\n");

        InvertedIndexSearchEngine engine = new InvertedIndexSearchEngine();

        // Index documents
        System.out.println("--- Indexing documents ---");
        engine.indexDocument(new Document("d1", "Java Design Patterns",
            "Design patterns in Java including singleton, factory, observer, strategy and decorator patterns"));
        engine.indexDocument(new Document("d2", "Data Structures in Java",
            "Arrays, linked lists, trees, graphs, hash maps and priority queues in Java"));
        engine.indexDocument(new Document("d3", "Spring Boot Tutorial",
            "Building REST APIs with Spring Boot framework including dependency injection"));
        engine.indexDocument(new Document("d4", "System Design Basics",
            "Load balancing, caching, database sharding and microservices architecture"));
        engine.indexDocument(new Document("d5", "Java Concurrency",
            "Threads, locks, concurrent collections, executors and CompletableFuture in Java"));
        System.out.println("Indexed " + engine.getDocumentCount() + " documents");

        // Search
        System.out.println("\n--- Search: 'java' ---");
        List<SearchResult> results = engine.search("java");
        for (SearchResult r : results) {
            System.out.printf("  [%.2f] %s%n", r.getScore(), r.getDocument().getTitle());
        }

        System.out.println("\n--- Search: 'design patterns' ---");
        results = engine.search("design patterns");
        for (SearchResult r : results) {
            System.out.printf("  [%.2f] %s%n", r.getScore(), r.getDocument().getTitle());
        }

        System.out.println("\n--- Search: 'spring' ---");
        results = engine.search("spring");
        for (SearchResult r : results) {
            System.out.printf("  [%.2f] %s%n", r.getScore(), r.getDocument().getTitle());
        }

        // Pagination
        System.out.println("\n--- Pagination: 'java', limit=2, offset=0 ---");
        results = engine.search("java", 2, 0);
        System.out.println("Page 1: " + results.size() + " results");
        for (SearchResult r : results) {
            System.out.printf("  [%.2f] %s%n", r.getScore(), r.getDocument().getTitle());
        }

        results = engine.search("java", 2, 2);
        System.out.println("Page 2: " + results.size() + " results");
        for (SearchResult r : results) {
            System.out.printf("  [%.2f] %s%n", r.getScore(), r.getDocument().getTitle());
        }

        // Update document
        System.out.println("\n--- Update document ---");
        engine.updateDocument(new Document("d3", "Spring Boot Advanced",
            "Advanced Spring Boot with Java microservices, security, and testing"));
        results = engine.search("spring java");
        for (SearchResult r : results) {
            System.out.printf("  [%.2f] %s%n", r.getScore(), r.getDocument().getTitle());
        }

        // Remove document
        System.out.println("\n--- Remove document ---");
        engine.removeDocument("d4");
        System.out.println("Documents: " + engine.getDocumentCount());

        // No results
        System.out.println("\n--- Search: 'kubernetes' (no match) ---");
        results = engine.search("kubernetes");
        System.out.println("Results: " + results.size());

        System.out.println("\n=== Demo complete ===");
    }
}
