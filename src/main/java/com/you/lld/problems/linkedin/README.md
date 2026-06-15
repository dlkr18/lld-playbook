# LinkedIn — LLD

Design professional network: profiles, connections, feed, jobs.

## Package Structure

```
linkedin/
  model/          User, Post, Job, ConnectionRequest, Experience, Skill
  service/        LinkedInService
  service/impl/   InMemoryLinkedInService
  LinkedIn.java   Facade
  LinkedInDemo.java
```

## Design Patterns

| Pattern | Where | Why |
|---------|-------|-----|
| **Facade** | `LinkedIn` | Wraps connection + feed + job APIs for interview walkthrough. |
| **Graph modeling** | Connection requests + accepted edges | Mutual connections vs one-way follow (if extended). |

## Run Demo

```bash
mvn -q compile exec:java -Dexec.mainClass="com.you.lld.problems.linkedin.LinkedInDemo"
```

## Key Talking Points

- **Connection request workflow** — PENDING → ACCEPTED/REJECTED before feed visibility.
- **Feed** from 1st-degree connections' posts, chronological.
- **Job search** by keyword + optional location filter.
