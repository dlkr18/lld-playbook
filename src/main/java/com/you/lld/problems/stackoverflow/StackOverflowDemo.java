package com.you.lld.problems.stackoverflow;

import com.you.lld.problems.stackoverflow.exception.DuplicateVoteException;
import com.you.lld.problems.stackoverflow.exception.SelfVoteException;
import com.you.lld.problems.stackoverflow.exception.StackOverflowException;
import com.you.lld.problems.stackoverflow.model.*;
import com.you.lld.problems.stackoverflow.service.StackOverflowService;
import com.you.lld.problems.stackoverflow.service.impl.InMemoryStackOverflowService;
import com.you.lld.problems.stackoverflow.service.impl.LoggingReputationListener;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Interview-style demo for Stack Overflow LLD.
 */
public class StackOverflowDemo {

    public static void main(String[] args) {
        System.out.println("========================================");
        System.out.println("  Stack Overflow Q&A -- LLD Demo");
        System.out.println("========================================\n");

        StackOverflow app = new StackOverflow();
        StackOverflowService service = app.service();
        service.addReputationListener(new LoggingReputationListener());

        demoRegistration(service);
        demoQuestionsAndAnswers(service);
        demoVoting(service);
        demoAcceptAnswer(service);
        demoSearchAndTags(service);
        demoCloseAndGuardrails(service);

        System.out.println("========================================");
        System.out.println("  All demos completed.");
        System.out.println("========================================");
    }

    private static User alice;
    private static User bob;
    private static User charlie;
    private static Question q1;
    private static Answer a1;
    private static Answer a2;

    private static void demoRegistration(StackOverflowService service) {
        System.out.println("--- Demo 1: User Registration ---\n");
        alice = service.registerUser("alice_dev", "alice@example.com", "hash1");
        bob = service.registerUser("bob_coder", "bob@example.com", "hash2");
        charlie = service.registerUser("charlie_pro", "charlie@example.com", "hash3");
        System.out.println("Registered: " + alice.getUsername() + ", " + bob.getUsername()
                + ", " + charlie.getUsername());

        try {
            service.registerUser("alice_dev", "dup@example.com", "x");
        } catch (IllegalArgumentException e) {
            System.out.println("Duplicate username blocked: " + e.getMessage());
        }
        System.out.println();
    }

    private static void demoQuestionsAndAnswers(StackOverflowService service) {
        System.out.println("--- Demo 2: Questions & Answers ---\n");
        Set<Tag> javaTags = new HashSet<Tag>(Arrays.asList(new Tag("java"), new Tag("concurrency")));
        q1 = service.askQuestion(alice.getId().getValue(),
                "How to implement thread-safe cache in Java?",
                "I need a cache safely accessed by multiple threads. What approach should I use?",
                javaTags);
        System.out.println("Q1: " + q1.getTitle() + " tags=" + q1.getTags());

        Set<Tag> pyTags = new HashSet<Tag>(Arrays.asList(new Tag("python"), new Tag("data-structures")));
        Question q2 = service.askQuestion(bob.getId().getValue(),
                "What is the difference between list and tuple?",
                "When should I use Python lists versus tuples in production code?",
                pyTags);
        System.out.println("Q2: " + q2.getTitle());

        a1 = service.postAnswer(q1.getId().getValue(), bob.getId().getValue(),
                "Use ConcurrentHashMap for thread-safe caching with excellent concurrent read performance.");
        a2 = service.postAnswer(q1.getId().getValue(), charlie.getId().getValue(),
                "Consider Caffeine or Guava Cache for production LRU/TTL eviction with metrics.");
        System.out.println("Posted answers: " + service.getAnswers(q1.getId().getValue()).size() + " on Q1\n");
    }

    private static void demoVoting(StackOverflowService service) {
        System.out.println("--- Demo 3: Voting & Reputation ---\n");
        service.voteQuestion(q1.getId().getValue(), bob.getId().getValue(), VoteType.UPVOTE);
        service.voteQuestion(q1.getId().getValue(), charlie.getId().getValue(), VoteType.UPVOTE);
        service.voteAnswer(a1.getId().getValue(), alice.getId().getValue(), VoteType.UPVOTE);
        service.voteAnswer(a1.getId().getValue(), charlie.getId().getValue(), VoteType.UPVOTE);
        System.out.println("Q1 votes=" + q1.getVoteCount() + ", A1 votes=" + a1.getVoteCount());

        expect(SelfVoteException.class, "Self-vote", new Runnable() {
            public void run() {
                service.voteAnswer(a1.getId().getValue(), bob.getId().getValue(), VoteType.UPVOTE);
            }
        });
        expect(DuplicateVoteException.class, "Double vote", new Runnable() {
            public void run() {
                service.voteAnswer(a1.getId().getValue(), alice.getId().getValue(), VoteType.UPVOTE);
            }
        });

        service.voteAnswer(a1.getId().getValue(), alice.getId().getValue(), VoteType.DOWNVOTE);
        System.out.println("Alice switched vote to DOWN on A1 -> votes=" + a1.getVoteCount()
                + ", bob rep=" + bob.getReputation());
        System.out.println();
    }

    private static void demoAcceptAnswer(StackOverflowService service) {
        System.out.println("--- Demo 4: Accept Answer ---\n");
        service.voteAnswer(a1.getId().getValue(), alice.getId().getValue(), VoteType.UPVOTE);
        service.acceptAnswer(q1.getId().getValue(), a1.getId().getValue(), alice.getId().getValue());
        System.out.println("Accepted A1. Bob reputation=" + bob.getReputation());
        expect(IllegalStateException.class, "Non-author accept", new Runnable() {
            public void run() {
                service.acceptAnswer(q1.getId().getValue(), a2.getId().getValue(), bob.getId().getValue());
            }
        });
        System.out.println();
    }

    private static void demoSearchAndTags(StackOverflowService service) {
        System.out.println("--- Demo 5: Search & Tags ---\n");
        List<Question> keywordHits = service.searchQuestions("thread-safe");
        System.out.println("Search 'thread-safe': " + keywordHits.size() + " hit(s)");
        for (Question q : keywordHits) {
            System.out.println("  [" + q.getVoteCount() + "] " + q.getTitle());
        }
        List<Question> javaTagged = service.getQuestionsByTag("java");
        System.out.println("Tag 'java': " + javaTagged.size() + " question(s)\n");
    }

    private static void demoCloseAndGuardrails(StackOverflowService service) {
        System.out.println("--- Demo 6: Close Question ---\n");
        service.closeQuestion(q1.getId().getValue(), alice.getId().getValue());
        System.out.println("Q1 status: " + q1.getStatus());
        expect(IllegalStateException.class, "Answer closed Q", new Runnable() {
            public void run() {
                service.postAnswer(q1.getId().getValue(), charlie.getId().getValue(),
                        "Late answer should fail because question is closed.");
            }
        });
        System.out.println();
    }

    private static void expect(Class<? extends Throwable> type, String label, Runnable action) {
        try {
            action.run();
            System.out.println("FAIL: expected " + type.getSimpleName() + " for " + label);
        } catch (Throwable e) {
            if (type.isInstance(e)) {
                System.out.println(label + " blocked: " + e.getMessage());
            } else {
                throw new RuntimeException("Unexpected exception for " + label, e);
            }
        }
    }
}
