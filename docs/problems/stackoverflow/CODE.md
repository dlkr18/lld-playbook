# stackoverflow - Complete Implementation

## 📁 Project Structure (11 files)

```
stackoverflow/
├── StackOverflowDemo.java
├── model/Answer.java
├── model/AnswerId.java
├── model/Question.java
├── model/QuestionId.java
├── model/QuestionStatus.java
├── model/Tag.java
├── model/User.java
├── model/UserId.java
├── model/UserStatus.java
├── model/VoteType.java
```

## 📝 Source Code

### 📄 `StackOverflowDemo.java`

```java
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

```

### 📄 `model/Answer.java`

```java
package com.you.lld.problems.stackoverflow.model;

import java.time.LocalDateTime;
import java.util.Objects;

/**
 * Represents an answer to a question.
 * 
 * <p>Entity within the Question aggregate. Contains answer content and metadata.
 * Tracks acceptance status and vote count.
 * 
 * <p>Key invariants:
 * <ul>
 *   <li>Body must be at least 30 characters</li>
 *   <li>Only one answer can be accepted per question</li>
 *   <li>Cannot accept own answer</li>
 * </ul>
 */
public class Answer {
    private final AnswerId id;
    private final QuestionId questionId;
    private String body;
    private final UserId authorId;
    private int voteCount;
    private boolean isAccepted;
    private final LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    /**
     * Creates a new answer.
     * 
     * @param id unique answer identifier
     * @param questionId the question being answered
     * @param body answer body (min 30 chars)
     * @param authorId answer author
     */
    public Answer(AnswerId id, QuestionId questionId, String body, UserId authorId) {
        this.id = Objects.requireNonNull(id, "AnswerId cannot be null");
        this.questionId = Objects.requireNonNull(questionId, "QuestionId cannot be null");
        this.body = validateBody(body);
        this.authorId = Objects.requireNonNull(authorId, "Author ID cannot be null");
        this.voteCount = 0;
        this.isAccepted = false;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    /**
     * Edits the answer body.
     * 
     * @param newBody new answer body
     */
    public void edit(String newBody) {
        this.body = validateBody(newBody);
        this.updatedAt = LocalDateTime.now();
    }
    
    /**
     * Marks this answer as accepted.
     * 
     * @throws IllegalStateException if already accepted
     */
    public void markAsAccepted() {
        if (isAccepted) {
            throw new IllegalStateException("Answer is already accepted");
        }
        this.isAccepted = true;
        this.updatedAt = LocalDateTime.now();
    }
    
    /**
     * Unmarks this answer as accepted.
     */
    public void unmarkAsAccepted() {
        this.isAccepted = false;
        this.updatedAt = LocalDateTime.now();
    }
    
    /**
     * Applies a vote to the answer.
     * 
     * @param vote vote value (+1 for upvote, -1 for downvote)
     */
    public void applyVote(int vote) {
        this.voteCount += vote;
        this.updatedAt = LocalDateTime.now();
    }
    
    private String validateBody(String body) {
        if (body == null || body.trim().isEmpty()) {
            throw new IllegalArgumentException("Answer body cannot be empty");
        }
        String trimmed = body.trim();
        if (trimmed.length() < 30) {
            throw new IllegalArgumentException("Answer body must be at least 30 characters");
        }
        return trimmed;
    }
    
    // Getters
    
    public AnswerId getId() {
        return id;
    }
    
    public QuestionId getQuestionId() {
        return questionId;
    }
    
    public String getBody() {
        return body;
    }
    
    public UserId getAuthorId() {
        return authorId;
    }
    
    public int getVoteCount() {
        return voteCount;
    }
    
    public boolean isAccepted() {
        return isAccepted;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Answer answer = (Answer) o;
        return id.equals(answer.id);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
    
    @Override
    public String toString() {
        return "Answer{" +
                "id=" + id +
                ", questionId=" + questionId +
                ", votes=" + voteCount +
                ", accepted=" + isAccepted +
                '}';
    }
}

```

### 📄 `model/AnswerId.java`

```java
package com.you.lld.problems.stackoverflow.model;

import java.util.Objects;

/**
 * Type-safe identifier for Answer entity.
 */
public final class AnswerId {
    private final long value;
    
    public AnswerId(long value) {
        if (value <= 0) {
            throw new IllegalArgumentException("AnswerId must be positive");
        }
        this.value = value;
    }
    
    public long getValue() {
        return value;
    }
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        AnswerId answerId = (AnswerId) o;
        return value == answerId.value;
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(value);
    }
    
    @Override
    public String toString() {
        return "AnswerId{" + value + '}';
    }
}

```

### 📄 `model/Question.java`

```java
package com.you.lld.problems.stackoverflow.model;

import java.time.LocalDateTime;
import java.util.*;

/**
 * Represents a question posted by a user.
 * 
 * <p>Aggregate Root for the Question aggregate. Contains the question content,
 * metadata, and manages the collection of answers. Enforces business rules
 * around question lifecycle, answer acceptance, and voting.
 * 
 * <p>Key invariants:
 * <ul>
 *   <li>Title must be 15-150 characters</li>
 *   <li>Body must be at least 30 characters</li>
 *   <li>Must have 1-5 tags</li>
 *   <li>Only author can accept answer</li>
 *   <li>Can only accept one answer</li>
 *   <li>Cannot accept answer if question is closed</li>
 * </ul>
 */
public class Question {
    private final QuestionId id;
    private String title;
    private String body;
    private final UserId authorId;
    private final Set<Tag> tags;
    private int voteCount;
    private int viewCount;
    private QuestionStatus status;
    private AnswerId acceptedAnswerId;
    private final LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    /**
     * Creates a new question.
     * 
     * @param id unique question identifier
     * @param title question title (15-150 chars)
     * @param body question body (min 30 chars)
     * @param authorId question author
     * @param tags list of tags (1-5 tags)
     */
    public Question(QuestionId id, String title, String body, UserId authorId, Set<Tag> tags) {
        this.id = Objects.requireNonNull(id, "QuestionId cannot be null");
        this.title = validateTitle(title);
        this.body = validateBody(body);
        this.authorId = Objects.requireNonNull(authorId, "Author ID cannot be null");
        this.tags = validateTags(tags);
        this.voteCount = 0;
        this.viewCount = 0;
        this.status = QuestionStatus.OPEN;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    /**
     * Edits the question title and body.
     * Only allowed if question is not closed.
     * 
     * @param newTitle new title
     * @param newBody new body
     * @throws IllegalStateException if question is closed or deleted
     */
    public void edit(String newTitle, String newBody) {
        if (status != QuestionStatus.OPEN) {
            throw new IllegalStateException("Cannot edit closed or deleted question");
        }
        this.title = validateTitle(newTitle);
        this.body = validateBody(newBody);
        this.updatedAt = LocalDateTime.now();
    }
    
    /**
     * Accepts an answer as the best answer.
     * 
     * @param answerId the answer to accept
     * @throws IllegalStateException if question is closed
     */
    public void acceptAnswer(AnswerId answerId) {
        if (status == QuestionStatus.CLOSED) {
            throw new IllegalStateException("Cannot accept answer on closed question");
        }
        this.acceptedAnswerId = answerId;
        this.updatedAt = LocalDateTime.now();
    }
    
    /**
     * Unaccepts the currently accepted answer.
     */
    public void unacceptAnswer() {
        this.acceptedAnswerId = null;
        this.updatedAt = LocalDateTime.now();
    }
    
    /**
     * Applies a vote to the question.
     * 
     * @param vote vote value (+1 for upvote, -1 for downvote)
     */
    public void applyVote(int vote) {
        this.voteCount += vote;
        this.updatedAt = LocalDateTime.now();
    }
    
    /**
     * Increments the view count.
     */
    public void incrementViews() {
        this.viewCount++;
    }
    
    /**
     * Closes the question.
     */
    public void close() {
        this.status = QuestionStatus.CLOSED;
        this.updatedAt = LocalDateTime.now();
    }
    
    /**
     * Checks if the question has an accepted answer.
     */
    public boolean hasAcceptedAnswer() {
        return acceptedAnswerId != null;
    }
    
    /**
     * Checks if the question is open.
     */
    public boolean isOpen() {
        return status == QuestionStatus.OPEN;
    }
    
    private String validateTitle(String title) {
        if (title == null || title.trim().isEmpty()) {
            throw new IllegalArgumentException("Title cannot be empty");
        }
        String trimmed = title.trim();
        if (trimmed.length() < 15 || trimmed.length() > 150) {
            throw new IllegalArgumentException("Title must be 15-150 characters");
        }
        return trimmed;
    }
    
    private String validateBody(String body) {
        if (body == null || body.trim().isEmpty()) {
            throw new IllegalArgumentException("Body cannot be empty");
        }
        String trimmed = body.trim();
        if (trimmed.length() < 30) {
            throw new IllegalArgumentException("Body must be at least 30 characters");
        }
        return trimmed;
    }
    
    private Set<Tag> validateTags(Set<Tag> tags) {
        if (tags == null || tags.isEmpty()) {
            throw new IllegalArgumentException("Question must have at least one tag");
        }
        if (tags.size() > 5) {
            throw new IllegalArgumentException("Question cannot have more than 5 tags");
        }
        return new HashSet<>(tags);
    }
    
    // Getters
    
    public QuestionId getId() {
        return id;
    }
    
    public String getTitle() {
        return title;
    }
    
    public String getBody() {
        return body;
    }
    
    public UserId getAuthorId() {
        return authorId;
    }
    
    public Set<Tag> getTags() {
        return Collections.unmodifiableSet(tags);
    }
    
    public int getVoteCount() {
        return voteCount;
    }
    
    public int getViewCount() {
        return viewCount;
    }
    
    public QuestionStatus getStatus() {
        return status;
    }
    
    public Optional<AnswerId> getAcceptedAnswerId() {
        return Optional.ofNullable(acceptedAnswerId);
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Question question = (Question) o;
        return id.equals(question.id);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
    
    @Override
    public String toString() {
        return "Question{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", votes=" + voteCount +
                ", status=" + status +
                '}';
    }
}

```

### 📄 `model/QuestionId.java`

```java
package com.you.lld.problems.stackoverflow.model;

import java.util.Objects;

/**
 * Type-safe identifier for Question entity.
 */
public final class QuestionId {
    private final long value;
    
    public QuestionId(long value) {
        if (value <= 0) {
            throw new IllegalArgumentException("QuestionId must be positive");
        }
        this.value = value;
    }
    
    public long getValue() {
        return value;
    }
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        QuestionId that = (QuestionId) o;
        return value == that.value;
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(value);
    }
    
    @Override
    public String toString() {
        return "QuestionId{" + value + '}';
    }
}

```

### 📄 `model/QuestionStatus.java`

```java
package com.you.lld.problems.stackoverflow.model;

/**
 * Represents the lifecycle status of a question.
 */
public enum QuestionStatus {
    /**
     * Question is open and accepting answers.
     */
    OPEN,
    
    /**
     * Question has been closed by author or moderators.
     * No new answers can be posted, but voting and comments still allowed.
     */
    CLOSED,
    
    /**
     * Question has been deleted.
     */
    DELETED
}

```

### 📄 `model/Tag.java`

```java
package com.you.lld.problems.stackoverflow.model;

import java.util.Objects;

/**
 * Represents a tag that can be applied to questions.
 * Value object with immutable name and description.
 */
public class Tag {
    private final String name;
    private final String description;
    
    public Tag(String name, String description) {
        this.name = validateName(name);
        this.description = description;
    }
    
    public Tag(String name) {
        this(name, null);
    }
    
    private String validateName(String name) {
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Tag name cannot be empty");
        }
        String trimmed = name.trim().toLowerCase();
        if (trimmed.length() < 2 || trimmed.length() > 35) {
            throw new IllegalArgumentException("Tag name must be 2-35 characters");
        }
        if (!trimmed.matches("^[a-z0-9-]+$")) {
            throw new IllegalArgumentException("Tag name can only contain lowercase letters, numbers, and hyphens");
        }
        return trimmed;
    }
    
    public String getName() {
        return name;
    }
    
    public String getDescription() {
        return description;
    }
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Tag tag = (Tag) o;
        return name.equals(tag.name);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(name);
    }
    
    @Override
    public String toString() {
        return name;
    }
}

```

### 📄 `model/User.java`

```java
package com.you.lld.problems.stackoverflow.model;

import java.time.LocalDateTime;
import java.util.Objects;

/**
 * Represents a user in the Stack Overflow system.
 * 
 * <p>Aggregate Root for User aggregate. Contains user profile information,
 * reputation, and status. Enforces business rules around username, email,
 * and reputation.
 * 
 * <p>Key invariants:
 * <ul>
 *   <li>Username must be unique and 3-20 characters</li>
 *   <li>Email must be unique and valid format</li>
 *   <li>Reputation cannot be negative</li>
 *   <li>Reputation starts at 1</li>
 * </ul>
 */
public class User {
    private final UserId id;
    private String username;
    private String email;
    private String passwordHash;
    private int reputation;
    private final LocalDateTime createdAt;
    private UserStatus status;
    
    /**
     * Creates a new user.
     * 
     * @param id unique user identifier
     * @param username username (3-20 characters)
     * @param email valid email address
     * @param passwordHash hashed password
     */
    public User(UserId id, String username, String email, String passwordHash) {
        this.id = Objects.requireNonNull(id, "UserId cannot be null");
        this.username = validateUsername(username);
        this.email = validateEmail(email);
        this.passwordHash = Objects.requireNonNull(passwordHash, "Password hash cannot be null");
        this.reputation = 1; // All users start with 1 reputation
        this.createdAt = LocalDateTime.now();
        this.status = UserStatus.ACTIVE;
    }
    
    /**
     * Adds reputation points to the user.
     * 
     * @param points reputation points to add (can be negative)
     */
    public void addReputation(int points) {
        int newReputation = this.reputation + points;
        if (newReputation < 0) {
            this.reputation = 0; // Reputation cannot go below 0
        } else {
            this.reputation = newReputation;
        }
    }
    
    /**
     * Checks if user has sufficient reputation for an action.
     * 
     * @param required required reputation
     * @return true if user has enough reputation
     */
    public boolean hasReputation(int required) {
        return this.reputation >= required;
    }
    
    /**
     * Suspends the user account.
     */
    public void suspend() {
        this.status = UserStatus.SUSPENDED;
    }
    
    /**
     * Activates the user account.
     */
    public void activate() {
        this.status = UserStatus.ACTIVE;
    }
    
    /**
     * Checks if user is active.
     */
    public boolean isActive() {
        return this.status == UserStatus.ACTIVE;
    }
    
    private String validateUsername(String username) {
        if (username == null || username.trim().isEmpty()) {
            throw new IllegalArgumentException("Username cannot be empty");
        }
        String trimmed = username.trim();
        if (trimmed.length() < 3 || trimmed.length() > 20) {
            throw new IllegalArgumentException("Username must be 3-20 characters");
        }
        if (!trimmed.matches("^[a-zA-Z0-9_]+$")) {
            throw new IllegalArgumentException("Username can only contain letters, numbers, and underscores");
        }
        return trimmed;
    }
    
    private String validateEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            throw new IllegalArgumentException("Email cannot be empty");
        }
        String trimmed = email.trim().toLowerCase();
        if (!trimmed.matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
            throw new IllegalArgumentException("Invalid email format");
        }
        return trimmed;
    }
    
    // Getters
    
    public UserId getId() {
        return id;
    }
    
    public String getUsername() {
        return username;
    }
    
    public String getEmail() {
        return email;
    }
    
    public int getReputation() {
        return reputation;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public UserStatus getStatus() {
        return status;
    }
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        User user = (User) o;
        return id.equals(user.id);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
    
    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", username='" + username + '\'' +
                ", reputation=" + reputation +
                ", status=" + status +
                '}';
    }
}

```

### 📄 `model/UserId.java`

```java
package com.you.lld.problems.stackoverflow.model;

import java.util.Objects;

/**
 * Type-safe identifier for User entity.
 * Immutable value object that prevents mixing IDs of different entity types.
 */
public final class UserId {
    private final long value;
    
    public UserId(long value) {
        if (value <= 0) {
            throw new IllegalArgumentException("UserId must be positive");
        }
        this.value = value;
    }
    
    public long getValue() {
        return value;
    }
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        UserId userId = (UserId) o;
        return value == userId.value;
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(value);
    }
    
    @Override
    public String toString() {
        return "UserId{" + value + '}';
    }
}

```

### 📄 `model/UserStatus.java`

```java
package com.you.lld.problems.stackoverflow.model;

/**
 * Represents the status of a user account.
 */
public enum UserStatus {
    /**
     * User account is active and in good standing.
     */
    ACTIVE,
    
    /**
     * User account is temporarily suspended due to violations.
     */
    SUSPENDED,
    
    /**
     * User account has been permanently deleted.
     */
    DELETED
}

```

### 📄 `model/VoteType.java`

```java
package com.you.lld.problems.stackoverflow.model;

/**
 * Type of vote that can be cast on content.
 */
public enum VoteType {
    /**
     * Positive vote indicating quality or usefulness.
     * Increases reputation by 10 points.
     */
    UPVOTE(+1, 10),
    
    /**
     * Negative vote indicating poor quality.
     * Decreases reputation by 2 points.
     */
    DOWNVOTE(-1, -2);
    
    private final int value;
    private final int reputationChange;
    
    VoteType(int value, int reputationChange) {
        this.value = value;
        this.reputationChange = reputationChange;
    }
    
    /**
     * Returns the numeric value of the vote (+1 or -1).
     */
    public int getValue() {
        return value;
    }
    
    /**
     * Returns the reputation change caused by this vote type.
     */
    public int getReputationChange() {
        return reputationChange;
    }
}

```

