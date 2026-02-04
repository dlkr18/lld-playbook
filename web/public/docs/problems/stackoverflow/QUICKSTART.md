# Stack Overflow - Quick Start Guide

## 🚀 Running the Demo

### Run the Demonstration

```bash
cd /Users/likhith.r/lld-playbook

# Compile the code
javac -d target/classes \
  src/main/java/com/you/lld/problems/stackoverflow/model/*.java \
  src/main/java/com/you/lld/problems/stackoverflow/*.java

# Run the demo
java -cp target/classes com.you.lld.problems.stackoverflow.StackOverflowDemo
```

**Expected Output:**
```
=== Stack Overflow LLD Demonstration ===

--- User Creation ---
Created user: alice_dev
Initial reputation: 1
Status: ACTIVE

--- Posting a Question ---
Question posted: How to implement thread-safe cache in Java?
Tags: [java, multithreading, concurrency]
Status: OPEN

--- Voting System ---
Initial votes: 0
After voting: Question votes: 3, Answer votes: 4

--- Reputation System ---
New user reputation journey:
Starting: 1 rep
After 3 question upvotes: 31 rep
After accepted answer: 46 rep
After 5 answer upvotes: 96 rep
Final: 94 rep

=== All Demonstrations Completed Successfully! ===
```

## 📖 What's Included

### Core Entities ✅
- **User** - User profiles with reputation system
- **Question** - Questions with title, body, tags, and voting
- **Answer** - Answers with voting and acceptance
- **Tag** - Topic tags for questions
- **Vote** - Upvote/downvote with reputation impact

### Key Features Demonstrated

1. **User Management**
   - Create users with validation
   - Track reputation (starts at 1)
   - User status (Active/Suspended/Deleted)

2. **Question Posting**
   - Title validation (15-150 chars)
   - Body validation (min 30 chars)
   - Tag management (1-5 tags)
   - Question lifecycle (Open/Closed/Deleted)

3. **Answering**
   - Post answers (min 30 chars)
   - Accept best answer (author only)
   - Only one accepted answer per question

4. **Voting System**
   - Upvote: +10 reputation to author
   - Downvote: -2 reputation to author
   - Vote count tracking

5. **Reputation System**
   - Question upvote: +10 rep
   - Answer upvote: +10 rep
   - Accepted answer: +15 rep
   - Downvote: -2 rep
   - Reputation floor at 0 (cannot go negative)

## 💡 Usage Examples

### Creating a User
```java
User alice = new User(
    new UserId(1),
    "alice_dev",           // Username: 3-20 chars, alphanumeric + underscore
    "alice@example.com",   // Valid email
    "hashed_password_123"  // Password hash
);
```

### Posting a Question
```java
Set<Tag> tags = new HashSet<>();
tags.add(new Tag("java"));
tags.add(new Tag("concurrency"));

Question question = new Question(
    new QuestionId(1),
    "How to implement thread-safe cache in Java?",  // 15-150 chars
    "I need to implement a cache that can be safely accessed...",  // Min 30 chars
    alice.getId(),
    tags  // 1-5 tags required
);
```

### Posting an Answer
```java
Answer answer = new Answer(
    new AnswerId(1),
    questionId,
    "For thread-safe caching, I recommend using ConcurrentHashMap...",  // Min 30 chars
    expertUserId
);
```

### Voting
```java
// Upvote
question.applyVote(VoteType.UPVOTE.getValue());  // +1 to vote count
user.addReputation(VoteType.UPVOTE.getReputationChange());  // +10 to reputation

// Downvote
answer.applyVote(VoteType.DOWNVOTE.getValue());  // -1 to vote count
user.addReputation(VoteType.DOWNVOTE.getReputationChange());  // -2 to reputation
```

### Accepting Answer
```java
// Question author accepts answer
question.acceptAnswer(answerId);
answer.markAsAccepted();
answerAuthor.addReputation(15);  // Acceptance bonus
```

## 🎯 Design Highlights

### Domain-Driven Design
- **Aggregates**: User, Question (contains Answers)
- **Entities**: User, Question, Answer
- **Value Objects**: UserId, QuestionId, AnswerId, Tag
- **Enums**: UserStatus, QuestionStatus, VoteType

### Business Rules Enforced

1. **User**
   - Username: 3-20 chars, alphanumeric + underscore
   - Email: Valid format, unique
   - Reputation: Starts at 1, cannot go below 0

2. **Question**
   - Title: 15-150 characters
   - Body: Minimum 30 characters
   - Tags: 1-5 tags required
   - Cannot edit/delete if has accepted answer

3. **Answer**
   - Body: Minimum 30 characters
   - Only one accepted answer per question
   - Cannot accept own answer

4. **Voting**
   - Upvote: +1 vote, +10 reputation
   - Downvote: -1 vote, -2 reputation
   - Cannot vote on own content

### Validation Examples
```java
// ❌ These throw IllegalArgumentException:
new User(id, "ab", email, hash);  // Username too short
new Question(id, "Short", body, author, tags);  // Title too short
new Answer(id, qid, "Too short", author);  // Body too short
new Tag("Invalid Tag!");  // Invalid characters

// ✅ These are valid:
new User(id, "alice_dev", email, hash);
new Question(id, "How to use Java streams?", body, author, tags);
new Answer(id, qid, "You can use streams like this: ...", author);
new Tag("java-8");
```

## 📊 Reputation Calculation

| Action | Reputation Change |
|--------|------------------|
| Question receives upvote | +10 |
| Question receives downvote | -2 |
| Answer receives upvote | +10 |
| Answer receives downvote | -2 |
| Answer is accepted | +15 |
| Accept an answer (asker) | +2 (not implemented in demo) |

## 🏗️ Files Structure

```
src/main/java/com/you/lld/problems/stackoverflow/
├── model/
│   ├── UserId.java           # Type-safe user identifier
│   ├── QuestionId.java       # Type-safe question identifier
│   ├── AnswerId.java         # Type-safe answer identifier
│   ├── User.java             # User entity with reputation
│   ├── Question.java         # Question aggregate root
│   ├── Answer.java           # Answer entity
│   ├── Tag.java              # Tag value object
│   ├── UserStatus.java       # User status enum
│   ├── QuestionStatus.java   # Question status enum
│   └── VoteType.java         # Vote type enum
└── StackOverflowDemo.java    # Complete demonstration

docs/problems/stackoverflow/
├── README.md                 # Complete documentation (10+ pages)
└── QUICKSTART.md            # This file
```

## 🎓 What You'll Learn

By studying this implementation:

1. **Domain-Driven Design**
   - Aggregate design and boundaries
   - Entity vs Value Object distinction
   - Rich domain models with behavior

2. **Business Rule Enforcement**
   - Validation in constructors
   - Invariant protection
   - State machine patterns

3. **Type Safety**
   - Type-safe identifiers prevent ID mixing
   - Enum for constrained values
   - Immutable value objects

4. **Reputation System**
   - Event-driven reputation changes
   - Reputation floor enforcement
   - Different actions, different rewards

## 🚀 Next Steps

1. **Study the Code**: Read through entity implementations
2. **Extend It**: Add Comment, Badge, or Vote tracking entities
3. **Add Services**: Implement QuestionService, AnswerService
4. **Add Persistence**: Create repository interfaces
5. **Add Tests**: Unit test all business rules

## 📚 Documentation

- **[Complete Documentation](README.md)** - Full requirements, diagrams, and ADRs
- **[Main Problems Index](problems/README.md)** - All LLD problems

---

**Ready to ace your LLD interview?** Study this implementation to master domain-driven design! 🚀

