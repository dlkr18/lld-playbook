# Stack Overflow (Q&A Platform)

Interview-ready LLD for a Stack Overflow–style Q&A system: users, questions, answers, voting, reputation, search, and acceptance.

## Run

```bash
mvn -q compile exec:java -Dexec.mainClass="com.you.lld.problems.stackoverflow.StackOverflowDemo"
```

## Package structure

```
stackoverflow/
  model/          User, Question, Answer, Tag, VoteType, *Id value objects
  service/        StackOverflowService, ReputationPolicy, SearchStrategy, ReputationListener
  service/impl/   InMemoryStackOverflowService, policies, LoggingReputationListener
  exception/      UserNotFoundException, DuplicateVoteException, SelfVoteException, ...
  StackOverflow.java       Facade
  StackOverflowDemo.java   6-scenario demo
```

## Patterns

| Pattern | Where | Why |
|---------|-------|-----|
| Aggregate Root | `User`, `Question` | Enforce invariants at domain boundary |
| Value Object | `Tag`, `*Id` | Immutable, equality by value |
| Strategy | `SearchStrategy`, `ReputationPolicy` | Swap ranking / rep rules |
| Observer | `ReputationListener` | Badge hooks, notifications |
| Repository (in-memory) | `ConcurrentHashMap` indexes | O(1) lookup by id, username, tag |

## Key Talking Points

- **Aggregate root** — `Question` owns lifecycle invariants (close blocks answers, single accept).
- **Value object IDs** — `UserId`, `QuestionId`, `AnswerId` prevent primitive obsession.
- **Vote idempotency** — composite key `voter:type:target` with synchronized intern; switch vote adjusts rep delta.
- **Strategy** — swap `SearchStrategy` / `ReputationPolicy` for different ranking or rep rules.
- **Observer** — `ReputationListener` hooks badges and notifications without coupling to vote logic.
