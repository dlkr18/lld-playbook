# stackoverflow - Complete Implementation

> Generated from `src/main/java/com/you/lld/problems/stackoverflow/` on 2026-05-31. Re-run `python3 scripts/generate-code-md.py stackoverflow`.

## Project Structure (26 files)

```
stackoverflow/
├── StackOverflowDemo.java
├── StackOverflow.java
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
├── service/ReputationListener.java
├── service/ReputationPolicy.java
├── service/SearchStrategy.java
├── service/StackOverflowService.java
├── service/impl/InMemoryStackOverflowService.java
├── service/impl/LoggingReputationListener.java
├── service/impl/StackOverflowReputationPolicy.java
├── service/impl/VoteScoreSearchStrategy.java
├── exception/AnswerNotFoundException.java
├── exception/DuplicateVoteException.java
├── exception/QuestionNotFoundException.java
├── exception/SelfVoteException.java
├── exception/StackOverflowException.java
├── exception/UserNotFoundException.java
```

## Source Code

### `StackOverflowDemo.java`

<details>
<summary>Click to view StackOverflowDemo.java</summary>

```java
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
```

</details>

### `StackOverflow.java`

<details>
<summary>Click to view StackOverflow.java</summary>

```java
package com.you.lld.problems.stackoverflow;

import com.you.lld.problems.stackoverflow.service.StackOverflowService;
import com.you.lld.problems.stackoverflow.service.impl.InMemoryStackOverflowService;

/**
 * Facade entry point for the Stack Overflow Q&amp;A system.
 */
public class StackOverflow {

    private final StackOverflowService service;

    public StackOverflow() {
        this(new InMemoryStackOverflowService());
    }

    public StackOverflow(StackOverflowService service) {
        this.service = service;
    }

    public StackOverflowService service() {
        return service;
    }
}
```

</details>

### `model/Answer.java`

<details>
<summary>Click to view model/Answer.java</summary>

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

</details>

### `model/AnswerId.java`

<details>
<summary>Click to view model/AnswerId.java</summary>

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

</details>

### `model/Question.java`

<details>
<summary>Click to view model/Question.java</summary>

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

</details>

### `model/QuestionId.java`

<details>
<summary>Click to view model/QuestionId.java</summary>

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

</details>

### `model/QuestionStatus.java`

<details>
<summary>Click to view model/QuestionStatus.java</summary>

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

</details>

### `model/Tag.java`

<details>
<summary>Click to view model/Tag.java</summary>

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

</details>

### `model/User.java`

<details>
<summary>Click to view model/User.java</summary>

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

</details>

### `model/UserId.java`

<details>
<summary>Click to view model/UserId.java</summary>

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

</details>

### `model/UserStatus.java`

<details>
<summary>Click to view model/UserStatus.java</summary>

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

</details>

### `model/VoteType.java`

<details>
<summary>Click to view model/VoteType.java</summary>

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

</details>

### `service/ReputationListener.java`

<details>
<summary>Click to view service/ReputationListener.java</summary>

```java
package com.you.lld.problems.stackoverflow.service;

import com.you.lld.problems.stackoverflow.model.User;

/**
 * Observer — notified when a user's reputation changes (badges, notifications).
 */
public interface ReputationListener {

    void onReputationChanged(User user, int delta, int newTotal);
}
```

</details>

### `service/ReputationPolicy.java`

<details>
<summary>Click to view service/ReputationPolicy.java</summary>

```java
package com.you.lld.problems.stackoverflow.service;

import com.you.lld.problems.stackoverflow.model.VoteType;

/**
 * Strategy for reputation changes — pluggable rules (Stack Overflow defaults).
 */
public interface ReputationPolicy {

    int reputationForVote(VoteType voteType);

    int reputationForAcceptedAnswer();
}
```

</details>

### `service/SearchStrategy.java`

<details>
<summary>Click to view service/SearchStrategy.java</summary>

```java
package com.you.lld.problems.stackoverflow.service;

import com.you.lld.problems.stackoverflow.model.Question;

import java.util.Collection;
import java.util.List;

/**
 * Strategy for filtering and ranking questions in search/browse.
 */
public interface SearchStrategy {

    List<Question> searchByKeyword(Collection<Question> questions, String keyword);

    List<Question> sortByVotes(List<Question> questions);
}
```

</details>

### `service/StackOverflowService.java`

<details>
<summary>Click to view service/StackOverflowService.java</summary>

```java
package com.you.lld.problems.stackoverflow.service;

import com.you.lld.problems.stackoverflow.model.*;

import java.util.List;
import java.util.Set;

public interface StackOverflowService {

    User registerUser(String username, String email, String passwordHash);

    User getUser(long userId);

    User getUserByUsername(String username);

    void suspendUser(long userId);

    Question askQuestion(long authorId, String title, String body, Set<Tag> tags);

    Question getQuestion(long questionId);

    void editQuestion(long questionId, long editorId, String newTitle, String newBody);

    void closeQuestion(long questionId, long closerId);

    Answer postAnswer(long questionId, long authorId, String body);

    void acceptAnswer(long questionId, long answerId, long acceptorId);

    void voteQuestion(long questionId, long voterId, VoteType voteType);

    void voteAnswer(long answerId, long voterId, VoteType voteType);

    List<Question> searchQuestions(String keyword);

    List<Question> getQuestionsByTag(String tagName);

    List<Answer> getAnswers(long questionId);

    void addReputationListener(ReputationListener listener);
}
```

</details>

### `service/impl/InMemoryStackOverflowService.java`

<details>
<summary>Click to view service/impl/InMemoryStackOverflowService.java</summary>

```java
package com.you.lld.problems.stackoverflow.service.impl;

import com.you.lld.problems.stackoverflow.exception.*;
import com.you.lld.problems.stackoverflow.model.*;
import com.you.lld.problems.stackoverflow.service.ReputationListener;
import com.you.lld.problems.stackoverflow.service.ReputationPolicy;
import com.you.lld.problems.stackoverflow.service.SearchStrategy;
import com.you.lld.problems.stackoverflow.service.StackOverflowService;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

/**
 * Thread-safe in-memory Stack Overflow service.
 * ConcurrentHashMap stores + synchronized vote keys for idempotent voting.
 */
public class InMemoryStackOverflowService implements StackOverflowService {

    private final Map<Long, User> users = new ConcurrentHashMap<Long, User>();
    private final Map<Long, Question> questions = new ConcurrentHashMap<Long, Question>();
    private final Map<Long, Answer> answers = new ConcurrentHashMap<Long, Answer>();
    private final Map<String, Long> usernameIndex = new ConcurrentHashMap<String, Long>();
    private final Map<String, Set<Long>> tagIndex = new ConcurrentHashMap<String, Set<Long>>();
    private final Map<String, VoteType> votes = new ConcurrentHashMap<String, VoteType>();

    private final AtomicLong userIdGen = new AtomicLong(0);
    private final AtomicLong questionIdGen = new AtomicLong(0);
    private final AtomicLong answerIdGen = new AtomicLong(0);

    private final ReputationPolicy reputationPolicy;
    private final SearchStrategy searchStrategy;
    private final List<ReputationListener> reputationListeners = new CopyOnWriteArrayList<ReputationListener>();

    public InMemoryStackOverflowService() {
        this(new StackOverflowReputationPolicy(), new VoteScoreSearchStrategy());
    }

    public InMemoryStackOverflowService(ReputationPolicy reputationPolicy, SearchStrategy searchStrategy) {
        this.reputationPolicy = reputationPolicy;
        this.searchStrategy = searchStrategy;
    }

    @Override
    public void addReputationListener(ReputationListener listener) {
        if (listener != null) {
            reputationListeners.add(listener);
        }
    }

    @Override
    public User registerUser(String username, String email, String passwordHash) {
        String key = username.toLowerCase();
        if (usernameIndex.containsKey(key)) {
            throw new IllegalArgumentException("Username already taken: " + username);
        }
        long id = userIdGen.incrementAndGet();
        User user = new User(new UserId(id), username, email, passwordHash);
        users.put(id, user);
        usernameIndex.put(key, id);
        return user;
    }

    @Override
    public User getUser(long userId) {
        User user = users.get(userId);
        if (user == null) {
            throw new UserNotFoundException(userId);
        }
        return user;
    }

    @Override
    public User getUserByUsername(String username) {
        Long id = usernameIndex.get(username.toLowerCase());
        if (id == null) {
            throw new IllegalArgumentException("Username not found: " + username);
        }
        return getUser(id);
    }

    @Override
    public void suspendUser(long userId) {
        getUser(userId).suspend();
    }

    @Override
    public Question askQuestion(long authorId, String title, String body, Set<Tag> tags) {
        User author = getUser(authorId);
        if (!author.isActive()) {
            throw new IllegalStateException("Suspended users cannot ask questions");
        }
        long qId = questionIdGen.incrementAndGet();
        Question question = new Question(new QuestionId(qId), title, body, author.getId(), tags);
        questions.put(qId, question);
        for (Tag tag : tags) {
            tagIndex.computeIfAbsent(tag.getName(), k -> ConcurrentHashMap.newKeySet()).add(qId);
        }
        return question;
    }

    @Override
    public Question getQuestion(long questionId) {
        Question q = questions.get(questionId);
        if (q == null) {
            throw new QuestionNotFoundException(questionId);
        }
        q.incrementViews();
        return q;
    }

    @Override
    public void editQuestion(long questionId, long editorId, String newTitle, String newBody) {
        Question q = questions.get(questionId);
        if (q == null) {
            throw new QuestionNotFoundException(questionId);
        }
        if (q.getAuthorId().getValue() != editorId) {
            throw new IllegalStateException("Only the author can edit this question");
        }
        q.edit(newTitle, newBody);
    }

    @Override
    public void closeQuestion(long questionId, long closerId) {
        Question q = questions.get(questionId);
        if (q == null) {
            throw new QuestionNotFoundException(questionId);
        }
        q.close();
    }

    @Override
    public Answer postAnswer(long questionId, long authorId, String body) {
        Question q = questions.get(questionId);
        if (q == null) {
            throw new QuestionNotFoundException(questionId);
        }
        if (!q.isOpen()) {
            throw new IllegalStateException("Cannot answer a closed question");
        }
        User author = getUser(authorId);
        if (!author.isActive()) {
            throw new IllegalStateException("Suspended users cannot post answers");
        }
        long aId = answerIdGen.incrementAndGet();
        Answer answer = new Answer(new AnswerId(aId), q.getId(), body, author.getId());
        answers.put(aId, answer);
        return answer;
    }

    @Override
    public void acceptAnswer(long questionId, long answerId, long acceptorId) {
        Question q = questions.get(questionId);
        if (q == null) {
            throw new QuestionNotFoundException(questionId);
        }
        if (q.getAuthorId().getValue() != acceptorId) {
            throw new IllegalStateException("Only question author can accept answers");
        }
        Answer a = answers.get(answerId);
        if (a == null) {
            throw new AnswerNotFoundException(answerId);
        }
        if (a.getQuestionId().getValue() != questionId) {
            throw new IllegalArgumentException("Answer does not belong to this question");
        }

        synchronized (q) {
            q.getAcceptedAnswerId().ifPresent(prevId -> {
                Answer prev = answers.get(prevId.getValue());
                if (prev != null) {
                    prev.unmarkAsAccepted();
                    applyReputation(prev.getAuthorId().getValue(), -reputationPolicy.reputationForAcceptedAnswer());
                }
            });
            q.acceptAnswer(a.getId());
            a.markAsAccepted();
            applyReputation(a.getAuthorId().getValue(), reputationPolicy.reputationForAcceptedAnswer());
        }
    }

    @Override
    public void voteQuestion(long questionId, long voterId, VoteType voteType) {
        Question q = questions.get(questionId);
        if (q == null) {
            throw new QuestionNotFoundException(questionId);
        }
        if (q.getAuthorId().getValue() == voterId) {
            throw new SelfVoteException();
        }
        castVote(voterId, "Q", questionId, voteType, q.getAuthorId().getValue(),
                new VoteTarget() {
                    public void apply(int delta) {
                        q.applyVote(delta);
                    }
                });
    }

    @Override
    public void voteAnswer(long answerId, long voterId, VoteType voteType) {
        Answer a = answers.get(answerId);
        if (a == null) {
            throw new AnswerNotFoundException(answerId);
        }
        if (a.getAuthorId().getValue() == voterId) {
            throw new SelfVoteException();
        }
        castVote(voterId, "A", answerId, voteType, a.getAuthorId().getValue(),
                new VoteTarget() {
                    public void apply(int delta) {
                        a.applyVote(delta);
                    }
                });
    }

    private interface VoteTarget {
        void apply(int delta);
    }

    private void castVote(long voterId, String targetType, long targetId, VoteType voteType,
                          long authorId, VoteTarget target) {
        String voteKey = voterId + ":" + targetType + ":" + targetId;
        synchronized (voteKey.intern()) {
            VoteType existing = votes.get(voteKey);
            if (existing == voteType) {
                throw new DuplicateVoteException();
            }
            if (existing != null) {
                target.apply(-existing.getValue());
                applyReputation(authorId, -reputationPolicy.reputationForVote(existing));
            }
            target.apply(voteType.getValue());
            votes.put(voteKey, voteType);
            applyReputation(authorId, reputationPolicy.reputationForVote(voteType));
        }
    }

    private void applyReputation(long userId, int delta) {
        if (delta == 0) {
            return;
        }
        User author = users.get(userId);
        if (author == null) {
            return;
        }
        author.addReputation(delta);
        for (ReputationListener listener : reputationListeners) {
            listener.onReputationChanged(author, delta, author.getReputation());
        }
    }

    @Override
    public List<Question> searchQuestions(String keyword) {
        return searchStrategy.searchByKeyword(questions.values(), keyword);
    }

    @Override
    public List<Question> getQuestionsByTag(String tagName) {
        Set<Long> ids = tagIndex.get(tagName.toLowerCase());
        if (ids == null) {
            return Collections.emptyList();
        }
        List<Question> list = ids.stream()
                .map(questions::get)
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
        return searchStrategy.sortByVotes(list);
    }

    @Override
    public List<Answer> getAnswers(long questionId) {
        return answers.values().stream()
                .filter(a -> a.getQuestionId().getValue() == questionId)
                .sorted(new Comparator<Answer>() {
                    @Override
                    public int compare(Answer a, Answer b) {
                        if (a.isAccepted() && !b.isAccepted()) {
                            return -1;
                        }
                        if (!a.isAccepted() && b.isAccepted()) {
                            return 1;
                        }
                        return Integer.compare(b.getVoteCount(), a.getVoteCount());
                    }
                })
                .collect(Collectors.toList());
    }
}
```

</details>

### `service/impl/LoggingReputationListener.java`

<details>
<summary>Click to view service/impl/LoggingReputationListener.java</summary>

```java
package com.you.lld.problems.stackoverflow.service.impl;

import com.you.lld.problems.stackoverflow.model.User;
import com.you.lld.problems.stackoverflow.service.ReputationListener;

/**
 * Logs reputation milestones — demonstrates Observer on reputation events.
 */
public class LoggingReputationListener implements ReputationListener {

    @Override
    public void onReputationChanged(User user, int delta, int newTotal) {
        System.out.println("  [rep] " + user.getUsername() + " " + formatDelta(delta)
                + " -> " + newTotal + badgeNote(newTotal));
    }

    private static String formatDelta(int delta) {
        return delta >= 0 ? ("+" + delta) : String.valueOf(delta);
    }

    private static String badgeNote(int total) {
        if (total >= 1000) {
            return " (gold-tier rep)";
        }
        if (total >= 100) {
            return " (silver-tier rep)";
        }
        if (total >= 10) {
            return " (bronze-tier rep)";
        }
        return "";
    }
}
```

</details>

### `service/impl/StackOverflowReputationPolicy.java`

<details>
<summary>Click to view service/impl/StackOverflowReputationPolicy.java</summary>

```java
package com.you.lld.problems.stackoverflow.service.impl;

import com.you.lld.problems.stackoverflow.model.VoteType;
import com.you.lld.problems.stackoverflow.service.ReputationPolicy;

public class StackOverflowReputationPolicy implements ReputationPolicy {

    @Override
    public int reputationForVote(VoteType voteType) {
        return voteType.getReputationChange();
    }

    @Override
    public int reputationForAcceptedAnswer() {
        return 15;
    }
}
```

</details>

### `service/impl/VoteScoreSearchStrategy.java`

<details>
<summary>Click to view service/impl/VoteScoreSearchStrategy.java</summary>

```java
package com.you.lld.problems.stackoverflow.service.impl;

import com.you.lld.problems.stackoverflow.model.Question;
import com.you.lld.problems.stackoverflow.service.SearchStrategy;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

public class VoteScoreSearchStrategy implements SearchStrategy {

    @Override
    public List<Question> searchByKeyword(Collection<Question> questions, String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return sortByVotes(new ArrayList<Question>(questions));
        }
        String lower = keyword.toLowerCase().trim();
        List<Question> matched = new ArrayList<Question>();
        for (Question q : questions) {
            if (q.getTitle().toLowerCase().contains(lower)
                    || q.getBody().toLowerCase().contains(lower)) {
                matched.add(q);
            }
        }
        return sortByVotes(matched);
    }

    @Override
    public List<Question> sortByVotes(List<Question> questions) {
        return questions.stream()
                .sorted(Comparator.comparingInt(Question::getVoteCount).reversed())
                .collect(Collectors.toList());
    }
}
```

</details>

### `exception/AnswerNotFoundException.java`

<details>
<summary>Click to view exception/AnswerNotFoundException.java</summary>

```java
package com.you.lld.problems.stackoverflow.exception;

public class AnswerNotFoundException extends StackOverflowException {
    public AnswerNotFoundException(long answerId) {
        super("Answer not found: " + answerId);
    }
}
```

</details>

### `exception/DuplicateVoteException.java`

<details>
<summary>Click to view exception/DuplicateVoteException.java</summary>

```java
package com.you.lld.problems.stackoverflow.exception;

public class DuplicateVoteException extends StackOverflowException {
    public DuplicateVoteException() {
        super("Already voted with this vote type");
    }
}
```

</details>

### `exception/QuestionNotFoundException.java`

<details>
<summary>Click to view exception/QuestionNotFoundException.java</summary>

```java
package com.you.lld.problems.stackoverflow.exception;

public class QuestionNotFoundException extends StackOverflowException {
    public QuestionNotFoundException(long questionId) {
        super("Question not found: " + questionId);
    }
}
```

</details>

### `exception/SelfVoteException.java`

<details>
<summary>Click to view exception/SelfVoteException.java</summary>

```java
package com.you.lld.problems.stackoverflow.exception;

public class SelfVoteException extends StackOverflowException {
    public SelfVoteException() {
        super("Cannot vote on your own content");
    }
}
```

</details>

### `exception/StackOverflowException.java`

<details>
<summary>Click to view exception/StackOverflowException.java</summary>

```java
package com.you.lld.problems.stackoverflow.exception;

public class StackOverflowException extends RuntimeException {
    public StackOverflowException(String message) {
        super(message);
    }
}
```

</details>

### `exception/UserNotFoundException.java`

<details>
<summary>Click to view exception/UserNotFoundException.java</summary>

```java
package com.you.lld.problems.stackoverflow.exception;

public class UserNotFoundException extends StackOverflowException {
    public UserNotFoundException(long userId) {
        super("User not found: " + userId);
    }
}
```

</details>

## Run Demo

```bash
mvn -q compile exec:java -Dexec.mainClass="com.you.lld.problems.stackoverflow.StackOverflowDemo"
```
