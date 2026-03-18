package com.you.lld.problems.stackoverflow;

import com.you.lld.problems.stackoverflow.impl.StackOverflowServiceImpl;
import com.you.lld.problems.stackoverflow.model.*;

import java.util.*;

/**
 * Demo: Stack Overflow with users, Q&A, voting, reputation, search.
 */
public class StackOverflowDemo {

    public static void main(String[] args) {
        System.out.println("=== Stack Overflow Demo ===\n");

        StackOverflowServiceImpl service = new StackOverflowServiceImpl();

        // Register users
        System.out.println("--- Register users ---");
        User alice = service.registerUser("alice_dev", "alice@example.com", "hash1");
        User bob = service.registerUser("bob_coder", "bob@example.com", "hash2");
        User charlie = service.registerUser("charlie_pro", "charlie@example.com", "hash3");
        System.out.println("Registered: " + alice.getUsername() + ", " + bob.getUsername() + ", " + charlie.getUsername());

        // Duplicate username
        try {
            service.registerUser("alice_dev", "other@example.com", "hash");
        } catch (IllegalArgumentException e) {
            System.out.println("Duplicate username blocked: " + e.getMessage());
        }

        // Ask questions
        System.out.println("\n--- Ask questions ---");
        Set<Tag> javaTags = new HashSet<>(Arrays.asList(new Tag("java"), new Tag("concurrency")));
        Question q1 = service.askQuestion(alice.getId().getValue(),
            "How to implement thread-safe cache in Java?",
            "I need a cache that can be safely accessed by multiple threads. What approach should I use?",
            javaTags);
        System.out.println("Q1: " + q1.getTitle() + " [" + q1.getTags() + "]");

        Set<Tag> pyTags = new HashSet<>(Arrays.asList(new Tag("python"), new Tag("data-structures")));
        Question q2 = service.askQuestion(bob.getId().getValue(),
            "What is the difference between list and tuple?",
            "I'm confused about when to use lists versus tuples in Python. What are the key differences?",
            pyTags);
        System.out.println("Q2: " + q2.getTitle());

        // Post answers
        System.out.println("\n--- Post answers ---");
        Answer a1 = service.postAnswer(q1.getId().getValue(), bob.getId().getValue(),
            "Use ConcurrentHashMap for thread-safe caching. It provides excellent concurrent performance. " +
            "For LRU eviction, combine with a ReadWriteLock or use Caffeine library.");
        Answer a2 = service.postAnswer(q1.getId().getValue(), charlie.getId().getValue(),
            "I recommend using Collections.synchronizedMap() for simple cases, or ConcurrentHashMap " +
            "for high-concurrency scenarios. Consider Guava Cache for production use.");
        System.out.println("Posted 2 answers to Q1");

        // Voting
        System.out.println("\n--- Voting ---");
        service.voteQuestion(q1.getId().getValue(), bob.getId().getValue(), VoteType.UPVOTE);
        service.voteQuestion(q1.getId().getValue(), charlie.getId().getValue(), VoteType.UPVOTE);
        System.out.println("Q1 votes: " + q1.getVoteCount());
        System.out.println("Alice reputation: " + alice.getReputation() + " (got 2 upvotes on question)");

        service.voteAnswer(a1.getId().getValue(), alice.getId().getValue(), VoteType.UPVOTE);
        service.voteAnswer(a1.getId().getValue(), charlie.getId().getValue(), VoteType.UPVOTE);
        service.voteAnswer(a2.getId().getValue(), alice.getId().getValue(), VoteType.UPVOTE);
        System.out.println("A1 votes: " + a1.getVoteCount() + ", A2 votes: " + a2.getVoteCount());
        System.out.println("Bob reputation: " + bob.getReputation() + " (got 2 upvotes on answer)");

        // Self-vote prevention
        try {
            service.voteAnswer(a1.getId().getValue(), bob.getId().getValue(), VoteType.UPVOTE);
        } catch (IllegalStateException e) {
            System.out.println("Self-vote blocked: " + e.getMessage());
        }

        // Double vote prevention
        try {
            service.voteAnswer(a1.getId().getValue(), alice.getId().getValue(), VoteType.UPVOTE);
        } catch (IllegalStateException e) {
            System.out.println("Double vote blocked: " + e.getMessage());
        }

        // Accept answer
        System.out.println("\n--- Accept answer ---");
        service.acceptAnswer(q1.getId().getValue(), a1.getId().getValue(), alice.getId().getValue());
        System.out.println("Accepted A1. Bob reputation: " + bob.getReputation() + " (+15 for accepted)");
        System.out.println("A1 accepted: " + a1.isAccepted());

        // Only author can accept
        try {
            service.acceptAnswer(q1.getId().getValue(), a2.getId().getValue(), bob.getId().getValue());
        } catch (IllegalStateException e) {
            System.out.println("Non-author accept blocked: " + e.getMessage());
        }

        // Search
        System.out.println("\n--- Search ---");
        List<Question> results = service.searchQuestions("thread-safe");
        System.out.println("Search 'thread-safe': " + results.size() + " results");
        for (Question q : results) {
            System.out.println("  [" + q.getVoteCount() + " votes] " + q.getTitle());
        }

        List<Question> tagResults = service.getQuestionsByTag("java");
        System.out.println("Tag 'java': " + tagResults.size() + " questions");

        // Get answers sorted (accepted first, then by votes)
        System.out.println("\n--- Answers for Q1 (sorted) ---");
        List<Answer> answersForQ1 = service.getAnswers(q1.getId().getValue());
        for (Answer a : answersForQ1) {
            System.out.println("  [" + a.getVoteCount() + " votes" 
                + (a.isAccepted() ? ", ACCEPTED" : "") + "] " 
                + a.getBody().substring(0, 50) + "...");
        }

        // Close question
        System.out.println("\n--- Close question ---");
        service.closeQuestion(q1.getId().getValue(), alice.getId().getValue());
        System.out.println("Q1 status: " + q1.getStatus());

        // Cannot answer closed question
        try {
            service.postAnswer(q1.getId().getValue(), charlie.getId().getValue(),
                "This is a late answer that should be blocked because the question is closed now.");
        } catch (IllegalStateException e) {
            System.out.println("Answer to closed Q blocked: " + e.getMessage());
        }

        System.out.println("\n=== Demo complete ===");
    }
}
