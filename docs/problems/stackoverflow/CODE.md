# Stack Overflow - Q&A Platform 💬

Production-ready **question and answer platform** similar to Stack Overflow with **voting**, **reputation system**, **tags**, **search**, and **moderation**. Comprehensive community platform design.

---

## 🎯 **Core Features**

✅ **Q&A System** - Questions, answers, comments  
✅ **Voting System** - Upvote/downvote with reputation  
✅ **Reputation System** - Gamification and privileges  
✅ **Tag System** - Categorization and search  
✅ **Search & Filter** - Full-text search by tags/keywords  
✅ **Moderation** - Flags, edits, close votes  
✅ **Badges & Achievements** - User recognition  

---

## 💻 **Implementation Overview**

**Source Code Location**: `src/main/java/com/you/lld/problems/stackoverflow/` (11 Java files)

View complete implementations in your IDE for:
- Question/Answer entities
- Voting and reputation logic
- Tag system and search
- User profiles and badges
- Moderation workflows

---

## 📚 **Key Components**

### **1. Content Hierarchy**

```
User
 └── Question
      ├── Tags
      ├── Votes
      ├── Answer (accepted/unaccepted)
      │    ├── Votes
      │    └── Comments
      └── Comments
```

### **2. Reputation System**

| Action | Reputation Change |
|--------|-------------------|
| Question upvoted | +5 |
| Question downvoted | -2 |
| Answer upvoted | +10 |
| Answer downvoted | -2 |
| Answer accepted | +15 |
| Accept an answer | +2 |

### **3. Tag System**

```java
public class Tag {
    private final String name;
    private final String description;
    private int questionCount;
    private int followerCount;
    
    // Tag trending score calculation
    public double getTrendingScore() {
        return (questionCount * 0.7) + (followerCount * 0.3);
    }
}
```

---

## 📝 **Usage Examples**

### **Example 1: Ask Question**

```java
StackOverflowService service = new StackOverflowService();

Question question = service.askQuestion(
    userId,
    "How to implement LRU Cache in Java?",
    "I need to implement an LRU cache with O(1) operations...",
    Arrays.asList("java", "data-structures", "caching")
);
```

### **Example 2: Answer & Vote**

```java
// Post answer
Answer answer = service.postAnswer(
    questionId,
    userId,
    "You can use HashMap + Doubly Linked List..."
);

// Upvote answer
service.voteAnswer(answerId, userId, VoteType.UPVOTE);

// Accept answer
service.acceptAnswer(answerId, questionAuthorId);
```

### **Example 3: Search**

```java
// Search by tags
List<Question> javaQuestions = service.searchByTags(
    Arrays.asList("java", "concurrency")
);

// Full-text search
List<Question> results = service.search("thread safety");

// Filter by answered/unanswered
List<Question> unanswered = service.getUnanswered(10);
```

---

## 🎯 **Design Patterns**

- **Observer**: Notify followers of new answers
- **Strategy**: Different sorting algorithms (votes, recent, trending)
- **Factory**: Create different content types (Question, Answer, Comment)
- **Repository**: Data access abstraction

---

## 🔗 **Related Resources**

- [Day 9: Repository Pattern](week2/day9/README.md)
- [Search Implementation](problems/search/CODE.md)

---

**View Full Implementation**: `src/main/java/com/you/lld/problems/stackoverflow/`

---

✨ **Complete Q&A platform with reputation and moderation!** 💬

