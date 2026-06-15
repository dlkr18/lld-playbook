# Social Network — LLD

Design Facebook-like network: friends, feed algorithm, posts, messaging.

## Package Structure

```
socialnetwork/
  model/          User, Post, FriendRequest, Message, Notification
  service/        SocialNetworkService, FeedAlgorithm, NotificationService
  service/impl/   InMemorySocialNetworkService, ChronologicalFeedAlgorithm
  SocialNetwork.java   Facade
  SocialNetworkDemo.java
```

## Design Patterns

| Pattern | Where | Why |
|---------|-------|-----|
| **Strategy** | `FeedAlgorithm` + `ChronologicalFeedAlgorithm` | Swap ranking (engagement, ML) without touching post storage. |
| **Observer** | `NotificationService` on like/comment/friend events | Decouple feed from push/email channels. |
| **Facade** | `SocialNetwork` | Interview entry point. |

## Run Demo

```bash
mvn -q compile exec:java -Dexec.mainClass="com.you.lld.problems.socialnetwork.SocialNetworkDemo"
```

## Key Talking Points

- **Friend vs follow** — mutual accept required for friends; follow is asymmetric.
- **Feed Strategy** injectable — chronological default; discuss ranking alternatives.
- **Post visibility** — PUBLIC vs FRIENDS_ONLY enforced at read time.
