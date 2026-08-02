# LinkedIn — SDE2/SDE3 Interview Walkthrough

A full 70–100 minute walkthrough: clarify → requirements → entities →
relationships → patterns (with rationale) → key implementations → follow-ups →
trade-offs.

> LinkedIn's distinguishing feature versus a generic social network is that it has
> **two graphs at once**: symmetric connections (consent required) and asymmetric
> follows (no consent). Getting the edge bookkeeping right for both is the whole
> exercise — §7.1 is what happens when one direction is forgotten.

---

## 1. Clarifying Questions (first 5 minutes)

1. **Connections or follows — or both?** Both, and they're different relationships:
   a **connection** is symmetric and needs a request/accept handshake; a **follow**
   is one-directional and needs no consent. I'll model them separately.
2. **Degrees of connection (1st / 2nd / 3rd)?** Yes conceptually — that's the
   product's signature feature — computed by BFS over the connection graph. I'll
   design the storage so it's possible and discuss why it's not computed on the
   request path.
3. **Profile depth?** Experience, education, skills with endorsements. Skills are
   the interesting one because endorsements are a *social signal* that has to be
   hard to game.
4. **Jobs?** Post, search by title/location, close. Applications are a natural
   extension.
5. **Feed?** Posts from connections and followed users, plus public posts,
   newest-first.
6. **Who can endorse a skill?** Anyone except the profile owner, and **once**. If
   self-endorsement or repeat endorsement counts, the number is decoration.
7. **Scale signals?** The follower distribution is extremely skewed (influencers
   with millions). Worth flagging for feed fan-out.

---

## 2. Functional Requirements

- Register users; maintain a profile (headline, experience, education, skills).
- **Connections**: send / accept / reject requests; list connections; no duplicates.
- **Follows**: follow / unfollow; list followers and following.
- Posts with type and visibility; like, comment, share.
- **Feed**: posts from connections + followed users + public, newest first.
- **Jobs**: post, search by title and location, close.
- **Skills**: add, and endorse someone else's skill exactly once.

## 3. Non-Functional Requirements

- **Graph consistency** — every edge written on both sides must be *removed* from
  both sides. A one-sided delete corrupts the graph permanently.
- **Consent is enforced** — only the receiver may accept a connection request.
- **Endorsements are one-per-endorser** and never self-issued.
- No NPEs on optional profile/job fields.
- Feed reads paginated; search extensible to a real index.

---

## 4. Core Entities

| Entity | Layer | Internal summary |
|--------|-------|------------------|
| `User` | model | Profile fields plus **three id sets**: `connectionIds` (symmetric), `followingIds` / `followerIds` (two halves of the asymmetric edge). Holds `Experience`, `Education`, `Skill` lists. |
| `Skill` | model | Name + a **`Set<String> endorserIds`**. `getEndorsements()` is the set's size, so "one endorsement per person" is true by construction rather than by a check someone might forget. |
| `Experience` / `Education` | model | Profile sub-entities with date ranges. |
| `ConnectionRequest` | model | `senderId`, `receiverId`, `RequestStatus`, optional note. The pending edge. |
| `RequestStatus` | model (enum) | `PENDING → ACCEPTED` \| `REJECTED`. |
| `Post` / `PostType` / `PostVisibility` | model | Content, likes (`Set<userId>`), comments, share count. |
| `Comment` | model | Author + text against a post. |
| `Job` / `JobType` / `JobStatus` | model | Company, title, description, location; `ACTIVE → CLOSED`. |
| `LinkedInService` | service (interface) | The contract. |
| `InMemoryLinkedInService` | service/impl | Four registries + the graph bookkeeping. |
| `LinkedIn` | root | Facade. |

---

## 5. Relationships

The two graphs are the design:

```
CONNECTION (symmetric, consent):        FOLLOW (asymmetric, no consent):
  alice.connectionIds  = {bob}            alice.followingIds = {carol}
  bob.connectionIds    = {alice}          carol.followerIds  = {alice}
  ^ same set on both sides                ^ DIFFERENT sets, one edge
```

- A **connection** is one edge stored as the *same* field on both users. Both
  writes must happen, and both deletions must happen.
- A **follow** is one edge stored as *complementary* fields — `followingIds` on one
  side, `followerIds` on the other. This is the easier one to get wrong, because
  the two field names are different and it's tempting to touch only one. (It was.)
- `ConnectionRequest` exists only between intent and consent, then becomes terminal.
- `Skill` **owns** its endorser set; `User` owns its skills. Endorsement is
  therefore an edge from an endorser to a *(user, skill)* pair.
- Ids rather than references throughout — acyclic, serializable, O(1) membership.

---

## 6. Design Patterns (name + why vs alternatives)

- **Facade — `LinkedIn`.** One API over profile, graph, feed, and jobs.
- **Value Object with an invariant — `Skill`.** The endorsement rule lives *inside*
  the entity as a set. *Alternative:* an `int` counter plus a service-level "have
  they already endorsed?" check — rejected: the check can be skipped by any new
  caller, and there's nowhere to record who endorsed.
- **Repository seam — `LinkedInService`.** In-memory now, database later.
- **Guarded state transitions — `ConnectionRequest`.** Terminal statuses; a settled
  request can't be re-answered.
- *(Considered, not forced)* **Strategy** for feed ranking — `socialnetwork` in this
  repo has `FeedAlgorithm` and this one doesn't; if I were unifying them I'd lift
  the same interface here, since "how is the feed ordered" is the most volatile
  rule in either product.
- *(Considered, not forced)* **Observer** for notifications (someone endorsed you,
  someone viewed your profile). No subscriber in scope, so it would be an empty
  extension point.
- *(Considered, rejected)* **State classes** for `RequestStatus` / `JobStatus` —
  two terminal transitions each, no per-state behaviour.

---

## 7. Key Implementation Details

### 7.1 `unfollow` only removed half the edge (the headline)

```java
public void follow(String followerId, String followingId) {
    follower.follow(followingId);          // followingIds += followee
    following.addFollower(followerId);     // followerIds  += follower     <- both sides
}

public void unfollow(String followerId, String followingId) {
    follower.unfollow(followingId);        // followingIds -= followee
    // ...and nothing else                                                <- one side only
}
```

`User` didn't even *have* a `removeFollower` method — the API to undo the second
write was missing entirely, so the bug wasn't a forgotten line, it was a missing
capability. Measured:

```
after follow  : bob.followers=1  alice.following=1
after unfollow: bob.followers=1  alice.following=0     <- asymmetric
*** bob still lists alice as a follower forever ***
```

The consequences compound: follower counts only ever grow, `getFollowers` returns
people who don't follow you, and re-following then unfollowing never repairs it.
There is no self-healing path — the graph is permanently wrong.

The fix is two lines (`removeFollower` on `User`, and calling it), but the
*lesson* is the part worth saying in an interview: **any edge stored redundantly
needs its writes and its deletes to be symmetric, and the safest way to guarantee
that is to have exactly one method that owns each direction.** The
`connectionIds` case is less error-prone precisely because both sides use the
same field name — the asymmetric one is where the mistake hides.

### 7.2 Endorsements as a set, not a counter

`Skill.endorse()` was `endorsements++`. Nobody recorded *who* endorsed, so:

```
alice endorsed her own Java skill 50 times -> endorsements=50
```

Both failures come from the same root: a counter cannot express "one per person".
Changing the representation fixes both at once and needs no validation logic:

```java
private final Set<String> endorserIds = ConcurrentHashMap.newKeySet();

public int getEndorsements()            { return endorserIds.size(); }
public boolean endorse(String endorserId) { return endorserIds.add(endorserId); }   // idempotent
```

Re-endorsing is now a no-op returning `false`, not a `+1`. The service adds the one
rule the set *can't* express — that you may not endorse yourself:

```java
if (userId.equals(endorserId)) throw new IllegalArgumentException("Cannot endorse your own skill");
```

Note the split: **"once per person" is a representation choice; "not yourself" is a
policy check.** Put each where it belongs and neither can be bypassed. The set also
unlocks the product feature the counter couldn't support at all — showing *who*
endorsed you.

### 7.3 `acceptConnection` had no actor

Identical in shape to the friend-request bug in `socialnetwork`: the method took
only a `requestId`, so anyone holding it could accept — including the sender, who
could connect to anybody unilaterally. Reproduced: Alice sent to Bob, Alice
accepted, `connected=true`.

```java
private ConnectionRequest requireRequestFor(String requestId, String responderId, String action) {
    ConnectionRequest request = connectionRequests.get(requestId);
    if (request == null) throw new RequestNotFoundException("Request not found");
    if (!request.getReceiverId().equals(responderId)) {
        throw new IllegalStateException("Only the receiver can " + action + " this connection request");
    }
    return request;
}
```

The general form of this bug: **a mutating method whose signature doesn't identify
the actor cannot be authorized.** If you can't name who is doing it, you can't
check whether they're allowed to. Worth scanning every method signature for this
during a design review — it's a purely mechanical check that catches a whole class
of holes.

### 7.4 A latent NPE in job search

```java
.filter(j -> location == null || j.getLocation().toLowerCase().contains(...))
```

`Job.location` is optional (`postJob` never sets it), so any location-filtered
search over a catalog containing one remote job throws. Fixed by null-checking the
field, not just the argument — the guard was written for the *parameter* being
absent and forgot the *data* could be absent too.

---

## 8. Likely Follow-ups (with concise answers)

- **1st / 2nd / 3rd-degree connections?** BFS from the user over `connectionIds`,
  capped at depth 3. Never on the request path: precompute 2nd-degree sets offline,
  or answer "is X within 2 hops" with a bidirectional BFS which is dramatically
  cheaper than full expansion. Mutual-connection count is the ranking signal.
- **"People you may know"?** 2nd-degree candidates ranked by mutual connections,
  shared employer, and shared school — a batch job, cached per user.
- **Feed at scale?** Same fan-out discussion as any social product: fan-out on
  write for normal users, pull-at-read for influencers, merged. LinkedIn's skew is
  severe enough that the hybrid isn't optional.
- **Connection limits?** LinkedIn caps at 30,000 connections, which is a real
  design constraint — it bounds `connectionIds` and makes degree computation
  tractable. Enforce it in `acceptConnection`.
- **Job applications?** New `Application` entity `(jobId, userId, status, resume)`
  with its own state machine (`APPLIED → SCREENING → INTERVIEW → OFFER/REJECTED`)
  — the same shape as the order lifecycle in `amazon`.
- **Job search at scale?** The current `stream().filter().contains()` is O(jobs)
  with per-job `toLowerCase`. Real answer is an inverted index with facets
  (location, seniority, remote) — and job search is geo + text, so it's a
  filter-then-rank problem, not pure text matching.
- **Profile views / "who viewed your profile"?** An append-only event log with a
  TTL, aggregated for display. Privacy setting decides whether the viewer is named.
- **`sharePost` copies text** (`"Shared: " + content`) rather than referencing the
  original — loses attribution and won't reflect edits. Should store
  `originalPostId`.
- **How would you test it?** The three harnesses from §7: follow→unfollow leaves
  both sides empty; the same endorser 50× counts as 1 and self-endorsement throws;
  the sender cannot accept their own request.

---

## 9. Trade-offs

- **Two separate graphs vs one generic edge table:** models the domain honestly
  (consent vs none) and keeps membership checks O(1); costs three id sets on `User`
  and two code paths in the feed query. A generic `Edge(from, to, type)` table
  would unify them at the cost of losing the compile-time distinction.
- **Redundant edge storage (both sides):** O(1) reads in both directions, at the
  cost of two writes that must stay in sync — and §7.1 is exactly the failure mode.
  A single canonical edge row would make consistency free and reads more expensive.
- **`Set` of endorsers vs a counter:** correct by construction and enables "who
  endorsed you", at the cost of O(endorsers) memory per skill instead of 4 bytes.
  For a signal that exists to be trustworthy, that's not a close call.
- **Ids not references:** acyclic and serializable; costs a map lookup plus a
  null-filter on every traversal.
- **Feed includes all public posts:** matches LinkedIn's actual behaviour (public
  content is discoverable), but combined with a full scan it's O(total posts) per
  load. The behaviour is right; the implementation isn't.
- **No `FeedAlgorithm` strategy here** (unlike `socialnetwork`): less indirection
  today, but ranking changes would touch the service. An inconsistency between two
  sibling problems worth naming rather than defending.
- **In-memory registries, scans everywhere:** right scope for the exercise; every
  `stream().filter()` here is a secondary index or a search cluster in production.
