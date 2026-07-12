# Cricinfo — LLD

Design cricket live scores: teams, squads, match scheduling, live updates, results.

## Package Structure

```
cricinfo/
  model/          Team, Player, Match, Ball, MatchStatus, PlayerRole
  service/        CricinfoService
  service/impl/   CricinfoServiceImpl
  Cricinfo.java   Facade
  CricinfoDemo.java
```

## Design Patterns

| Pattern | Where | Why |
|---------|-------|-----|
| **Facade** | `Cricinfo` | Single API for schedule → start → score → end. |
| **State machine** | `MatchStatus` SCHEDULED → IN_PROGRESS → COMPLETED | Guards invalid transitions. |
| **Observer-ready** | Score updates on Match | Push to subscribers (extend with Observer). |

## Run Demo

```bash
mvn -q compile exec:java -Dexec.mainClass="com.you.lld.problems.cricinfo.CricinfoDemo"
```

## Key Talking Points

- **Match lifecycle guards** — can't start completed match; can't score before start.
- **Ball-by-ball** extendable via `Ball` entity + Observer for live feed.
- **Team aggregate** owns player roster; match references team snapshots.
