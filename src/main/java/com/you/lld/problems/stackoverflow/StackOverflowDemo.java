package com.you.lld.problems.stackoverflow;

import com.you.lld.problems.stackoverflow.model.*;

import java.util.HashSet;
import java.util.Set;

/**
 * Demonstration of the Stack Overflow Low-Level Design.
 * 
 * <p>Shows the core Q&A workflow:
 * <ul>
 *   <li>User registration and reputation</li>
 *   <li>Asking questions with tags</li>
 *   <li>Posting answers</li>
 *   <li>Voting on questions and answers</li>
 *   <li>Accepting best answer</li>
 *   <li>Reputation calculations</li>
 * </ul>
 */
public class StackOverflowDemo {
    
    public static void main(String[] args) {
        System.out.println("=== Stack Overflow LLD Demonstration ===\n");
        
        demoUserCreation();
        demoQuestionPosting();
        demoAnswering();
        demoVoting();
        demoReputationSystem();
        
        System.out.println("\n=== All Demonstrations Completed Successfully! ===");
    }
    
    private static void demoUserCreation() {
        System.out.println("--- User Creation ---");
        
        User alice = new User(
            new UserId(1),
            "alice_dev",
            "alice@example.com",
            "hashed_password_123"
        );
        
        System.out.println("Created user: " + alice.getUsername());
        System.out.println("Initial reputation: " + alice.getReputation());
        System.out.println("Status: " + alice.getStatus());
        System.out.println("Active: " + alice.isActive());
        System.out.println();
    }
    
    private static void demoQuestionPosting() {
        System.out.println("--- Posting a Question ---");
        
        User bob = new User(
            new UserId(2),
            "bob_coder",
            "bob@example.com",
            "hashed_password_456"
        );
        
        // Create tags
        Set<Tag> tags = new HashSet<>();
        tags.add(new Tag("java"));
        tags.add(new Tag("concurrency"));
        tags.add(new Tag("multithreading"));
        
        // Post a question
        Question question = new Question(
            new QuestionId(1),
            "How to implement thread-safe cache in Java?",
            "I need to implement a cache that can be safely accessed by multiple threads. " +
            "What's the best approach? Should I use synchronized blocks or ReadWriteLock?",
            bob.getId(),
            tags
        );
        
        System.out.println("Question posted: " + question.getTitle());
        System.out.println("Tags: " + question.getTags());
        System.out.println("Status: " + question.getStatus());
        System.out.println("Vote count: " + question.getVoteCount());
        System.out.println("Is open: " + question.isOpen());
        System.out.println();
    }
    
    private static void demoAnswering() {
        System.out.println("--- Posting Answers ---");
        
        User expert = new User(
            new UserId(3),
            "java_expert",
            "expert@example.com",
            "hashed_password_789"
        );
        
        QuestionId questionId = new QuestionId(1);
        
        // Post an answer
        Answer answer = new Answer(
            new AnswerId(1),
            questionId,
            "For thread-safe caching, I recommend using ConcurrentHashMap combined with " +
            "ReadWriteLock if you need LRU eviction. ConcurrentHashMap provides excellent " +
            "concurrent performance for basic operations. For more complex caching scenarios, " +
            "consider using Caffeine or Guava cache libraries which handle thread-safety for you.",
            expert.getId()
        );
        
        System.out.println("Answer posted by: " + expert.getUsername());
        System.out.println("Answer length: " + answer.getBody().length() + " characters");
        System.out.println("Is accepted: " + answer.isAccepted());
        System.out.println("Vote count: " + answer.getVoteCount());
        System.out.println();
    }
    
    private static void demoVoting() {
        System.out.println("--- Voting System ---");
        
        // Create question and answer
        Set<Tag> tags = new HashSet<>();
        tags.add(new Tag("python"));
        
        Question question = new Question(
            new QuestionId(2),
            "What is the difference between list and tuple in Python?",
            "I'm new to Python and confused about when to use lists versus tuples. " +
            "What are the main differences and when should I use each one?",
            new UserId(4),
            tags
        );
        
        Answer answer = new Answer(
            new AnswerId(2),
            question.getId(),
            "The main difference is that lists are mutable (can be changed) while tuples are " +
            "immutable (cannot be changed after creation). Use lists when you need to modify " +
            "the collection, and tuples when you want to ensure the data stays constant.",
            new UserId(5)
        );
        
        System.out.println("Initial votes:");
        System.out.println("Question votes: " + question.getVoteCount());
        System.out.println("Answer votes: " + answer.getVoteCount());
        
        // Apply upvotes
        question.applyVote(VoteType.UPVOTE.getValue());
        question.applyVote(VoteType.UPVOTE.getValue());
        question.applyVote(VoteType.UPVOTE.getValue());
        
        answer.applyVote(VoteType.UPVOTE.getValue());
        answer.applyVote(VoteType.UPVOTE.getValue());
        answer.applyVote(VoteType.UPVOTE.getValue());
        answer.applyVote(VoteType.UPVOTE.getValue());
        answer.applyVote(VoteType.UPVOTE.getValue());
        
        // Apply a downvote
        answer.applyVote(VoteType.DOWNVOTE.getValue());
        
        System.out.println("\nAfter voting:");
        System.out.println("Question votes: " + question.getVoteCount() + " (3 upvotes)");
        System.out.println("Answer votes: " + answer.getVoteCount() + " (5 upvotes, 1 downvote)");
        System.out.println();
    }
    
    private static void demoReputationSystem() {
        System.out.println("--- Reputation System ---");
        
        User newUser = new User(
            new UserId(6),
            "newbie",
            "newbie@example.com",
            "hashed_password_000"
        );
        
        System.out.println("New user: " + newUser.getUsername());
        System.out.println("Starting reputation: " + newUser.getReputation());
        
        // User asks a good question (gets 3 upvotes)
        System.out.println("\nAsked a question that received 3 upvotes:");
        newUser.addReputation(VoteType.UPVOTE.getReputationChange());
        newUser.addReputation(VoteType.UPVOTE.getReputationChange());
        newUser.addReputation(VoteType.UPVOTE.getReputationChange());
        System.out.println("Reputation: " + newUser.getReputation() + " (+30 points)");
        
        // User posts an answer that gets accepted
        System.out.println("\nPosted an answer that was accepted:");
        newUser.addReputation(15); // Accepted answer bonus
        System.out.println("Reputation: " + newUser.getReputation() + " (+15 for acceptance)");
        
        // Answer gets 5 upvotes
        System.out.println("\nAnswer received 5 upvotes:");
        for (int i = 0; i < 5; i++) {
            newUser.addReputation(VoteType.UPVOTE.getReputationChange());
        }
        System.out.println("Reputation: " + newUser.getReputation() + " (+50 points)");
        
        // Answer gets 1 downvote
        System.out.println("\nAnswer received 1 downvote:");
        newUser.addReputation(VoteType.DOWNVOTE.getReputationChange());
        System.out.println("Reputation: " + newUser.getReputation() + " (-2 points)");
        
        System.out.println("\nFinal reputation: " + newUser.getReputation());
        System.out.println("Has 100+ reputation: " + newUser.hasReputation(100));
        System.out.println("Has 1000+ reputation: " + newUser.hasReputation(1000));
        
        // Demo reputation floor (cannot go below 0)
        System.out.println("\n--- Reputation Floor ---");
        User testUser = new User(
            new UserId(7),
            "test_user",
            "test@example.com",
            "hash"
        );
        System.out.println("Test user reputation: " + testUser.getReputation());
        testUser.addReputation(-1000); // Try to go negative
        System.out.println("After -1000 points: " + testUser.getReputation() + " (cannot go below 0)");
        
        // Demo question acceptance workflow
        System.out.println("\n--- Answer Acceptance Workflow ---");
        
        Set<Tag> tags = new HashSet<>();
        tags.add(new Tag("javascript"));
        
        User questionAuthor = new User(new UserId(8), "questioner", "q@example.com", "hash");
        User answerAuthor = new User(new UserId(9), "answerer", "a@example.com", "hash");
        
        Question q = new Question(
            new QuestionId(3),
            "How do JavaScript closures work?",
            "I've heard about closures in JavaScript but I don't understand how they work. " +
            "Can someone explain with a simple example?",
            questionAuthor.getId(),
            tags
        );
        
        Answer a = new Answer(
            new AnswerId(3),
            q.getId(),
            "A closure is a function that has access to variables in its outer scope, " +
            "even after the outer function has returned. Here's an example: function outer() { " +
            "let count = 0; return function inner() { return ++count; }; } " +
            "The inner function 'closes over' the count variable.",
            answerAuthor.getId()
        );
        
        System.out.println("Question: " + q.getTitle());
        System.out.println("Has accepted answer: " + q.hasAcceptedAnswer());
        
        // Accept the answer
        q.acceptAnswer(a.getId());
        a.markAsAccepted();
        
        System.out.println("Answer accepted!");
        System.out.println("Question has accepted answer: " + q.hasAcceptedAnswer());
        System.out.println("Answer is accepted: " + a.isAccepted());
        
        // Award reputation to answerer
        answerAuthor.addReputation(15); // Acceptance bonus
        System.out.println("Answerer reputation: " + answerAuthor.getReputation() + " (earned +15 for accepted answer)");
        
        System.out.println();
    }
}

