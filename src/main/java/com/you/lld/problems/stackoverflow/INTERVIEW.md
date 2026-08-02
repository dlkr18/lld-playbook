# Stack Overflow — SDE2/SDE3 Interview Walkthrough

A full 70–100 minute walkthrough: clarify → requirements → entities →
relationships → patterns (with rationale) → key implementations → follow-ups →
trade-offs.

> Two things get probed hardest here: **vote idempotency** (one voter, one vote,
> changeable) and the **counter arithmetic underneath it**. It is easy to lock the
> first correctly and still lose votes on the second — §7.1 shows exactly that.

---

## 1. Clarifying Questions (first 5 minutes)

1. **Which surface?** The domain: questions, answers, tags, votes, reputation,
   accept. Not auth, not rendering, not the real-time feed.
2. **Vote rules?** One vote per user per post. A voter may **change** their vote
   (up → down) and that must adjust both the score and the author's reputation.
   Re-casting the *same* vote is an error, not a silent no-op — the caller should
   know. No self-voting.
3. **Reputation numbers?** Stack Overflow defaults (+10 upvote, −2 downvote, +15
   accepted). I want these **pluggable**, because "the reputation rules" is the
   thing a product manager changes monthly.
4. **Who can close a question?** The author always; anyone else needs the
   moderation privilege. On the real site that's a reputation threshold.
5. **Search scope?** Keyword over title/body, plus tag lookup, ranked by score.
   Ranking should be swappable (votes now, relevance/recency later).
6. **Accept semantics?** At most one accepted answer per question; accepting a
   second must un-accept the first *and* reverse the reputation. Only the question
   author may accept.
7. **Concurrency?** Yes — this is a read-heavy site with vote storms on popular
   posts. That's where the design earns its keep.

---

## 2. Functional Requirements

- Register users (unique username), suspend users.
- Ask / edit / close questions with 1–5 tags; view count tracked.
- Post answers (not on a closed question); accept at most one, author only.
- Up/downvote questions and answers: one vote per user per post, changeable, no
  self-votes.
- Reputation follows votes and acceptance, and never drops below zero.
- Search by keyword; list by tag; list answers ranked accepted-first then by score.
- Notify listeners on reputation change (badges, audit, email).

## 3. Non-Functional Requirements

- **Vote correctness under contention** — N distinct voters ⇒ score exactly N.
- **Idempotency per (voter, post)** — never double-counted.
- **Unique usernames** even under concurrent signup.
- **O(1)** user/question/answer lookup; **O(1)** tag and answer-list lookup.
- **Extensibility** — reputation rules and ranking are strategies.
- **Authorization enforced server-side**, on every mutating call.

---

## 4. Core Entities

| Entity | Layer | Internal summary |
|--------|-------|------------------|
| `UserId` / `QuestionId` / `AnswerId` | model (VOs) | Typed ids — argument-order mistakes become compile errors. |
| `User` | model | Username, email, hash, `UserStatus`, and an `AtomicInteger reputation` clamped at 0. |
| `Question` | model | Title/body (validated 15–150 / min length), author, tags, `QuestionStatus`, `AtomicInteger` vote and view counters, optional `acceptedAnswerId`. |
| `Answer` | model | Body, `questionId`, author, `AtomicInteger voteCount`, `isAccepted`. |
| `Tag` | model (VO) | **Normalizes in the constructor** — trims, lowercases, validates `^[a-z0-9-]+$`. So `new Tag("Java")` and `new Tag("java")` are equal, and the tag index can't be poisoned by casing. |
| `VoteType` | model (enum) | `UPVOTE(+1)` / `DOWNVOTE(-1)` — the enum carries its own delta, so no `if (type == UP) +1 else -1` anywhere. |
| `QuestionStatus` / `UserStatus` | model (enums) | `OPEN/CLOSED`, `ACTIVE/SUSPENDED`. |
| `ReputationPolicy` | service (interface) | `reputationForVote(VoteType)`, `reputationForAcceptedAnswer()`. |
| `SearchStrategy` | service (interface) | `searchByKeyword(...)`, `sortByVotes(...)`. |
| `ReputationListener` | service (interface) | `onReputationChanged(user, delta, total)`. |
| `StackOverflowService` | service (interface) | The contract. |
| `InMemoryStackOverflowService` | service/impl | Registries, indexes, id generators, and the concurrency model. |
| `StackOverflow` | root | Facade holding the service. |

---

## 5. Relationships

- `InMemoryStackOverflowService` **owns** six indexes, each paying rent:
  `users`, `questions`, `answers` (id → entity);
  `usernameIndex` (lowercased name → id, for uniqueness *and* lookup);
  `tagIndex` (tag → question ids); `answersByQuestion` (question → answer ids);
  `votes` (`"voterId:Q|A:targetId"` → `VoteType`).
- The `votes` map is the **idempotency ledger**: its key encodes the whole "one
  voter, one post" rule, so the rule lives in the key rather than in a scan.
- `Question` **references** its accepted `AnswerId` (not the object) — one owner of
  the relationship, no cycle to keep in sync.
- Policy, strategy, and listeners are **injected**, so the service depends on
  interfaces and never on a concrete rule set.

---

## 6. Design Patterns (name + why vs alternatives)

- **Strategy — `ReputationPolicy`.** The point values are the most-changed rule in
  the system, and an interviewer will ask "what if downvotes cost the voter too?"
  A policy object answers that with a new class. *Alternative:* constants in the
  service — rejected: every rule change edits the orchestrator, and you can't A/B
  two policies.
- **Strategy — `SearchStrategy`.** Ranking by score today, relevance/recency
  tomorrow. Keeps ranking out of the service entirely.
- **Observer — `ReputationListener`** on a `CopyOnWriteArrayList`. Badge awards,
  audit logs, and emails are cross-cutting reactions to one event. COW is the right
  list here: listeners are registered once at startup and read on every vote —
  write-rare, read-heavy, and iteration never needs a lock.
- **Value Object — `Tag`, and the typed ids.** `Tag` normalizing in its constructor
  is the detail worth pointing at: it makes the index key canonical *by
  construction*, so no call site can forget to lowercase.
- **Facade — `StackOverflow`.**
- **Command-ish — the private `VoteTarget` interface.** `voteQuestion` and
  `voteAnswer` differ only in *what* gets the delta, so both hand `castVote` a
  one-method callback and share the entire idempotency algorithm. Without it the
  vote logic would be copy-pasted and would drift.
- *(Considered, rejected)* **State** for `QuestionStatus`. Two states and one
  transition — a state hierarchy would be pure ceremony over a boolean.

---

## 7. Key Implementation Details

### 7.1 The vote lock that protected the wrong thing (the headline)

The original code guarded voting like this:

```java
String voteKey = voterId + ":" + targetType + ":" + targetId;
synchronized (voteKey.intern()) { ... }
```

Two separate problems, and the second is the interesting one.

**(a) Never lock on an interned string.** `String.intern()` returns a JVM-wide
canonical instance. Any unrelated code anywhere in the process that synchronizes
on a string with the same content shares your monitor — invisible contention, and
a deadlock you cannot find by reading your own class. It also lets user-derived
keys accumulate in the pool.

**(b) The lock was per `(voter, target)`, but the counters are per target.**
Two *different* voters on the same question take *different* locks — so they
serialize against nobody, and `voteCount += vote` (a read-modify-write) loses
updates. Measured with 200 distinct voters upvoting one question:

```
before: voteCount=194/200, 195/200, 178/200, 179/200   *** LOST UP TO 22 VOTES ***
        authorRep=1921, 1811, 1771, 1761   (expected 2001)
after : voteCount=200/200 on every trial,  authorRep=2001
```

Note reputation was *worse* than the score — it was corrupted by the same race on
`reputation += points`.

The fix separates the two concerns properly:

```java
int[] reputationDelta = new int[1];
votes.compute(voteKey, (key, existing) -> {          // per-key atomicity, no extra lock
    if (existing == voteType) throw new DuplicateVoteException();
    if (existing != null) {                           // changing vote: undo the old one
        target.apply(-existing.getValue());
        reputationDelta[0] -= reputationPolicy.reputationForVote(existing);
    }
    target.apply(voteType.getValue());
    reputationDelta[0] += reputationPolicy.reputationForVote(voteType);
    return voteType;
});
applyReputation(authorId, reputationDelta[0]);        // listeners fire OUTSIDE the bin lock
```

- **`ConcurrentHashMap.compute` is the right primitive** — it already gives
  atomic read-modify-write *per key*, which is exactly the "one voter, one post"
  scope. No lock object to invent, nothing to clean up.
- **The shared counters became atomics** (`AtomicInteger` for `voteCount`,
  `viewCount`, `reputation`), because their contention scope is the *post*, not the
  vote key. Getting the lock right without this changes nothing.
- **Reputation is applied after `compute` returns**, so a slow `ReputationListener`
  can't stall every other vote hashing to the same bin.

`User.addReputation` needs a CAS loop rather than a plain add because of the floor:

```java
reputation.accumulateAndGet(points, (current, delta) -> Math.max(0, current + delta));
```

A `getAndAdd` then clamp would be two steps and could transiently expose a
negative reputation.

### 7.2 Unique usernames: check-then-act again

```java
if (usernameIndex.containsKey(key)) throw ...;   // both threads pass
usernameIndex.put(key, id);                      // both write
```

32 threads registering `"dupe"` produced **2–4 successful registrations**. The fix
is the same shape as everywhere else — let the map arbitrate:

```java
if (usernameIndex.putIfAbsent(key, id) != null) throw new IllegalArgumentException("Username already taken: " + username);
User user = new User(new UserId(id), username, email, passwordHash);
users.put(id, user);
```

Order matters: **claim the name, then publish the user.** Reversing it would leave
an orphan user reachable by id when the claim loses.

### 7.3 The authorization hole

`closeQuestion(long questionId, long closerId)` accepted `closerId` and never read
it — any user could close any question. An unused parameter that *looks* like an
authorization check is worse than no parameter, because reviewers assume it's
enforced.

```java
if (q.getAuthorId().getValue() != closerId
        && !getUser(closerId).hasReputation(CLOSE_QUESTION_REPUTATION)) {
    throw new IllegalStateException("Closing another user's question requires "
            + CLOSE_QUESTION_REPUTATION + " reputation");
}
```

Author-or-privileged, with the privilege expressed as a reputation threshold —
which is how the real site models moderation power. Worth contrasting with
`editQuestion` and `acceptAnswer`, which are author-only with no escape hatch.

### 7.4 Accept/un-accept is a compound mutation

Accepting a second answer must un-accept the first *and* claw back its +15,
otherwise reputation inflates by one accept every time the author changes their
mind:

```java
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
```

The question is the monitor because the invariant ("at most one accepted answer")
is scoped to the question. Different questions never contend.

---

## 8. Likely Follow-ups (with concise answers)

- **Make it a real database?** `votes` becomes a table with a **unique constraint on
  `(voter_id, target_type, target_id)`** — the same idempotency rule, enforced by
  the engine. Score and reputation become `UPDATE ... SET score = score + ?`, which
  is atomic server-side, so the application locking disappears entirely. That's the
  answer worth giving: *the CAS and the unique index are the same idea at two
  layers.*
- **Denormalized score vs counting votes?** Counting `SELECT count(*)` per render
  is O(votes) on every page view of a hot question. Keep the denormalized counter
  (as here) and reconcile with a periodic job.
- **Search at scale?** The in-memory keyword scan is O(questions). Real answer:
  inverted index (Lucene/Elasticsearch) with the ranking signals as a scoring
  function — which is precisely why `SearchStrategy` is an interface.
- **View counts are a hot write.** `getQuestion` increments views on every read, so
  a popular question is a single-counter hotspot. Batch in-process and flush
  periodically, or shard the counter (`LongAdder`). Also worth noting that a
  side-effecting getter is a smell — a real API would separate `recordView`.
- **Vote fraud / sockpuppets?** Rate-limit per user, require minimum reputation to
  downvote, detect voting rings by graph analysis offline.
- **Reputation recompute?** Because reputation is denormalized, an audit job that
  replays the vote ledger should reproduce it exactly. Keeping `votes` as an
  append-friendly ledger makes that possible.
- **Comments, bounties, edit history, dupe-linking?** All additive: new entity +
  new index. Edit history in particular argues for storing revisions rather than
  mutating `body` in place.
- **How would you test it?** The three harnesses from §7: N distinct voters ⇒ score
  exactly N; N threads on one username ⇒ exactly one success; a non-author close
  ⇒ rejected. These belong as JUnit tests — currently the main gap.

---

## 9. Trade-offs

- **`ConcurrentHashMap.compute` vs an explicit lock map:** compute needs no lock
  objects and can't leak them, but the mapping function runs while the bin is
  locked, so it must stay short — which is exactly why listeners fire outside it.
  A `ConcurrentHashMap<String, Object>` of lock objects would allow long critical
  sections at the cost of unbounded lock growth.
- **Atomic counters vs locking the post:** atomics are cheaper and contention-free
  for a single field, but they only make *individual* operations atomic. Any future
  invariant spanning two fields (e.g. "score and answer-count move together") would
  need a real lock. Said out loud so the choice reads as deliberate.
- **Denormalized score/reputation vs deriving from the vote ledger:** O(1) reads
  and no join, at the cost of two sources of truth that can drift — mitigated by
  the reconcile job in §8.
- **`votes` keyed by a composed string:** compact and index-free, but stringly
  typed; a small `VoteKey` value object would be type-safe at the cost of an
  allocation per vote. Fine at this scale, worth naming.
- **Reputation clamped at 0 rather than allowed negative:** matches the product,
  but means reputation is not a pure sum of its ledger — the reconcile job has to
  replay in order rather than just summing.
- **`getQuestion` increments views:** convenient, but a getter with a side effect,
  and it makes the read path a write path. Called out in §8 rather than hidden.
- **In-memory indexes:** the right scope for the exercise; §8 covers the database
  and search-engine story instead of pretending maps scale.
