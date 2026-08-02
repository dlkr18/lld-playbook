# Cricinfo (live cricket scoring) — SDE2/SDE3 Interview Walkthrough

A full 70–100 minute walkthrough: clarify → requirements → entities →
relationships → patterns (with rationale) → key implementations → follow-ups →
trade-offs.

> The entire question is: **what is the atomic unit of a cricket match?** The
> answer is the **ball**, and every number on a scorecard is derived from the
> sequence of balls. Store the score instead and you have a system that can
> disagree with itself — §7.1.

---

## 1. Clarifying Questions (first 5 minutes)

1. **What granularity of scoring?** Ball-by-ball. A "live score" system that only
   stores a team total can't produce a scorecard, a run rate, a bowler's figures,
   or a commentary feed — all of which are the product.
2. **Which format?** Limited-overs (T20/ODI): two innings, fixed overs per innings.
   Test matches add follow-ons and declarations; I'll note where they attach.
3. **Extras?** Yes, and they matter structurally: **a wide or no-ball does not
   advance the over** and concedes a penalty run. That single rule is why you
   cannot count overs as `balls / 6`.
4. **Are extras credited to the batsman?** No. Byes, leg-byes and wides go to the
   team, not the batsman — which is why individual scores never sum to the team
   total. Worth confirming, because it changes the data model.
5. **When does an innings end?** 10 wickets or the over limit, whichever first.
6. **Can a match end without a winner?** Yes — rain, abandonment. `NO_RESULT` has
   to be representable or the state machine is a lie.
7. **Live consumers?** Many readers while one feed writes. That drives the
   concurrency model.

---

## 2. Functional Requirements

- Register teams and players (with roles).
- Schedule a match; start it; end it with a winner or with no result.
- **Start an innings** with a nominated batting side.
- **Record a delivery**: runs, wicket, delivery type.
- Derive: team score, wickets, overs (`12.4` notation), run rate, extras,
  per-batsman runs, per-bowler wickets.
- Query matches.

## 3. Non-Functional Requirements

- **The scoreboard can never disagree with the balls** — one source of truth.
- **Only a participating team can win**, and the loser is derived, not guessed.
- **Cricket rules enforced structurally**: a wide can't advance the over, a batsman
  can't be out off a wide, an innings can't continue past 10 wickets.
- Safe for one writer (the feed) and many readers (scorecards).
- Services silent — no `System.out` in the service layer.

---

## 4. Core Entities

| Entity | Layer | Internal summary |
|--------|-------|------------------|
| `Ball` | model | **Immutable** atomic scoring event: over, ball-in-over, bowler, batsman, runs, wicket, `DeliveryType`. Validates on construction (no negative runs, no dismissal off a wide). |
| `DeliveryType` | model (enum) | `LEGAL`, `WIDE`, `NO_BALL`, `BYE` — each carrying `countsTowardOver()`, `penaltyRuns()`, `canTakeWicket()`. The rules live on the enum, not in `if` chains. |
| `Innings` | model | Append-only `List<Ball>` for one batting side + the over limit. **Everything is derived**: `getRuns`, `getWickets`, `getLegalBalls`, `getCompletedOvers`, `oversText`, `getRunRate`, `getExtras`, `runsFor(batsman)`, `wicketsFor(bowler)`, `isComplete`. |
| `Match` | model | Two teams, venue, overs-per-innings, `MatchStatus`, up to two `Innings`. Scores are computed from the innings; all mutators `synchronized`. |
| `MatchStatus` | model (enum) | `SCHEDULED → IN_PROGRESS → COMPLETED`. |
| `Team` | model | Squad + win/loss record. |
| `Player` / `PlayerRole` | model | Identity + `BATSMAN` / `BOWLER` / etc. |
| `CricinfoService` | service (interface) | Teams, players, match lifecycle, `startInnings`, `recordBall`. |
| `CricinfoServiceImpl` | service/impl | Registries, id generation, ball numbering. |
| `Cricinfo` | root | Facade. |

---

## 5. Relationships

```
Match ──▶ Innings (1..2) ──▶ Ball (0..n)     append-only, immutable leaves
  │                            │
  └── team1 / team2            └── bowler, batsman  (Player)
```

- A `Match` **owns** its innings; an `Innings` **owns** its balls. Ownership runs
  strictly downward and nothing points back up.
- `Ball` is **immutable**, so the sequence is an event log. Every aggregate above it
  is a fold over that log — which is what makes "the scoreboard agrees with the
  commentary" true by construction rather than by discipline.
- `Match.scoreOf(team)` sums the runs of the innings that team batted, so there is
  no stored score to drift.
- `DeliveryType` is referenced by `Ball` and consulted by `Innings`; the cricket
  rules therefore exist in exactly one place.

---

## 6. Design Patterns (name + why vs alternatives)

- **Event sourcing / derived state.** The pattern that matters here. Balls are the
  events; runs, wickets, overs and player stats are projections. *Alternative:*
  store `team1Score` and `team2Score` and update them — rejected, and §7.1 shows
  the failure: the number becomes whatever the last caller passed.
- **Rules on the enum — `DeliveryType`.** Three cricket rules (`countsTowardOver`,
  `penaltyRuns`, `canTakeWicket`) attached to the value they describe.
  *Alternative:* `if (type == WIDE || type == NO_BALL)` scattered through `Innings`
  — rejected: adding a delivery type would mean hunting every branch. Same
  technique as `taskmanagement`'s transition table.
- **Immutable value object — `Ball`.** A delivery that has been bowled cannot
  change. Immutability is also what makes the many-reader concurrency story easy.
- **Aggregate root — `Match`.** All mutation goes through its monitor, so a reader
  never sees a half-recorded ball.
- **Facade — `Cricinfo`.**
- *(Considered, not forced)* **Observer** for the live feed — push each `Ball` to
  subscribers (commentary, push notifications, scorecard cache). The natural hook is
  `recordBall`, and it's the first thing a real Cricinfo needs.
- *(Considered, rejected)* **State classes** per `MatchStatus`: three states, no
  per-state behaviour beyond legality.

---

## 7. Key Implementation Details

### 7.1 The score was a settable integer, and `Ball` was dead code (the headline)

`Match` held `int team1Score` with:

```java
public void setScore(Team team, int score) { ... this.team1Score = score; }
```

so the "score" was an absolute assignment, not an accumulation:

```
scored 10 then 5, India total = 5   *** absolute setter, not an accumulator ***
```

Worse, `Ball` — the class that models the actual atomic event, with bowler,
batsman, runs and wicket — had **zero references anywhere in the repository**. The
interesting half of the problem had been started and abandoned, leaving a CRUD
shell that could store two integers.

The rebuild inverts the direction of truth. Balls are recorded; everything else is
computed:

```java
public int getRuns() {
    int total = 0;
    for (Ball b : balls) total += b.totalRuns();
    return total;
}
```

There is now no setter for a score, so no caller can put the scoreboard out of step
with the commentary. This is the property worth naming out loud: **derived state
cannot disagree with its source.**

### 7.2 The over is not `balls / 6`

The rule that makes cricket scoring interesting: a wide or no-ball is re-bowled, so
it doesn't advance the over — but it *does* concede a run. Encoding that on the
enum keeps it in one place:

```java
LEGAL  (true,  0, true),
WIDE   (false, 1, false),
NO_BALL(false, 1, false),
BYE    (true,  0, true);
```

and the innings just asks:

```java
public int getLegalBalls() {
    int total = 0;
    for (Ball b : balls) if (b.countsTowardOver()) total++;
    return total;
}
public String oversText() { return getCompletedOvers() + "." + getBallsIntoCurrentOver(); }
```

Verified on a six-delivery sequence containing one wide:

```
India 14/1 (0.5 ov, RR 16.80)
legal balls bowled: 5   (the wide did not advance the over)
```

Six deliveries, five legal, so `0.5` overs — not `1.0`. A naive `balls / 6` reports
the over as complete when a ball is still owed.

The same enum kills a second bug by construction: `Ball`'s constructor rejects a
wicket off a delivery whose type says `canTakeWicket() == false`, so "bowled off a
wide" is unrepresentable rather than merely discouraged.

### 7.3 Extras: why individual scores never sum to the team total

```
Kohli off the bat: 11, extras: 3, Starc wickets: 1
team total 14 = 11 off the bat + 3 extras
```

`runsFor(batsman)` credits only `LEGAL` and `NO_BALL` deliveries — a no-ball can be
hit for four, a wide by definition cannot, and byes were never touched by the bat.
Getting this wrong is subtle because the *team* total stays correct; only the
scorecard's per-player column is wrong, which is exactly the kind of error that
ships. Modelling extras explicitly (`getExtras()`) makes the identity
`team total = Σ batsman runs + extras` checkable.

### 7.4 A team that wasn't playing could win

```java
public void end(Team winner) {
    this.winner = winner;
    winner.recordWin();
    Team loser = (winner == team1) ? team2 : team1;   // no validation
    loser.recordLoss();
}
```

Passing any team recorded a win for it — and because the loser is derived by that
ternary, a **third team winning made team1 the loser** of a match it hadn't lost.
Reproduced: England "won" India vs Australia, and India took the loss.

```java
private void requireParticipant(Team team, String action) {
    if (team == null || (!team.equals(team1) && !team.equals(team2))) {
        throw new IllegalArgumentException(team.getName() + " is not playing in this match, so cannot "
                + action + " it (" + team1.getName() + " v " + team2.getName() + ")");
    }
}
```

The general shape: **a ternary that derives one value from another is only safe if
the input is validated first.** `winner == team1 ? team2 : team1` silently maps
every unexpected input to `team1`. `endWithoutResult()` was also added, because
"COMPLETED with a null winner" needs to be reachable deliberately rather than by
accident.

### 7.5 The `instanceof` downcast in the facade

`updateScore` existed only on the impl, not the interface, so the facade did this:

```java
if (service instanceof CricinfoServiceImpl) {
    ((CricinfoServiceImpl) service).updateScore(matchId, teamId, runs);
}
```

— a silent no-op for any other implementation. A downcast in a facade is always a
symptom: the interface is missing a method it should have. `startInnings` and
`recordBall` are now on `CricinfoService`, and the cast is gone. (The service also
printed to `System.out` on every call; removed, same as `amazon`.)

---

## 8. Likely Follow-ups (with concise answers)

- **Live feed to millions of readers?** Push each `Ball` through an Observer to a
  fan-out layer; readers get a cached projection, not the ball list. Because state
  is derived, the cache is a pure function of the log and can always be rebuilt.
- **Test matches?** Four innings instead of two, no over limit (so `isComplete` is
  wickets-only plus declaration), plus follow-on rules. `Innings` already takes its
  own limit; `Match` would hold a list rather than a pair.
- **Rain / DLS?** `endWithoutResult()` covers abandonment. Duckworth–Lewis is a
  scoring *strategy* over (overs remaining, wickets lost) — a natural Strategy
  interface, and a good answer to "how would you make the result rule pluggable".
- **Correcting a mis-recorded ball?** With an append-only log you don't mutate —
  you append a correction event, or store a per-ball `voided` flag and have the
  projections skip it. Preserves the audit trail, which is what a scoring system
  needs.
- **Player career statistics across matches?** Fold over every innings the player
  appears in — expensive to recompute, so maintain a projection updated on each
  ball, rebuilt from the log if it drifts.
- **Ball numbering comes from the server, not the client.** `recordBall` derives
  over/ball from the innings so far rather than trusting a caller-supplied number —
  otherwise the over count is whatever the client claims.
- **Strike rotation / who is on strike?** Not modelled: odd runs and end-of-over
  swap the striker. A real system tracks both batsmen and the striker, which also
  fixes attributing the *right* batsman to each ball.
- **How would you test it?** A sequence with a wide asserting `0.5` overs and the
  right total; a wicket off a wide throwing; a third team winning throwing; and the
  identity `getRuns() == Σ runsFor(each batsman) + getExtras()` as a property test.

---

## 9. Trade-offs

- **Derived state vs stored totals:** correctness by construction and a free audit
  trail, at the cost of O(balls) per query. A T20 innings is ~130 balls so it's
  irrelevant here; at scale you cache the projection and rebuild from the log — the
  standard event-sourcing trade.
- **Immutable `Ball`:** safe to share with any number of readers and impossible to
  retroactively rewrite, at the cost of needing a correction *event* to fix a
  mistake rather than an in-place edit.
- **Rules on `DeliveryType`:** one place to change, and adding a type (penalty runs,
  dead ball) is a new enum constant. The limit is that it can only express rules
  that are a function of the type alone — anything contextual still needs code.
- **`synchronized` on `Match`:** simple and correct for one writer plus many
  readers; every read of a live match serializes against the feed. A copy-on-write
  snapshot would let readers run lock-free, and is what a real live-scores service
  would do.
- **Fixed two innings:** matches limited-overs cricket and keeps the model small;
  Tests need a list, named in §8.
- **No strike rotation:** the ball records *a* batsman, so per-player figures are
  only as good as the caller's attribution. A real gap, called out rather than
  hidden behind the fact that the totals still add up.
