# Cricinfo

## Problem: Design Cricinfo Live Score System

**Difficulty**: Hard  
**Pattern**: Observer, State Machine  
**Time**: 90-120 min

---

## Key Classes

```java
class Cricinfo {
    private Map<String, Match> matches;
    void updateScore(String matchId, ScoreUpdate update);
    MatchStatus getLiveScore(String matchId);
}

class Match {
    String id;
    Team team1, team2;
    Scorecard scorecard;
}
```

---

**Status**: ✅ Documented
