# Social Network (Facebook-style) — SDE2/SDE3 Interview Walkthrough

A full 70–100 minute walkthrough: clarify → requirements → entities →
relationships → patterns (with rationale) → key implementations → follow-ups →
trade-offs.

> Two things separate a good answer from a feature list: **how the newsfeed is
> built** (fan-out on read vs write) and **whether the safety features actually
> enforce anything**. §7.1 is the second one going wrong.

---

## 1. Clarifying Questions (first 5 minutes)

1. **Which social graph — symmetric or asymmetric?** Both, and that's deliberate:
   **friends** are bidirectional (Facebook) and require a request/accept
   handshake; **follows** are unidirectional (Twitter) and need no consent. They
   are genuinely different relationships and I'll model them separately rather
   than force one into the other.
2. **Feed composition?** Posts from friends and followed users, newest first,
   subject to per-post visibility. The ranking algorithm must be swappable —
   chronological today, engagement-ranked later.
3. **Post visibility?** `PUBLIC` / `FRIENDS_ONLY` / `PRIVATE`.
4. **Blocking — what does it actually do?** This is the question I'd insist on
   pinning down: blocking must stop messages, friend requests, likes, comments,
   and hide content **in both directions**. A stored flag nobody reads is not a
   block.
5. **Scale?** Design for the single-node model but be explicit about where
   fan-out-on-write and the celebrity problem enter.
6. **Messaging?** Simple 1:1 conversations. Group chat is the `whatsapp` problem
   in this repo, not this one.
7. **Comment nesting?** One level of replies. Arbitrary nesting is a Composite and
   I'll say so.

---

## 2. Functional Requirements

- Users: create, update, search, delete.
- **Friends**: send / accept / reject requests, list friends, remove.
- **Follow**: follow, unfollow, list followers/following.
- **Block**: enforced across every interaction path, both directions.
- Posts with visibility, edit, delete, share; likes; comments and replies.
- **Newsfeed**: relevant posts, ranked by a pluggable algorithm, paginated.
- Notifications for friend requests, follows, likes, comments.
- 1:1 messaging.

## 3. Non-Functional Requirements

- **Authorization on every mutating call** — the actor must be identified and checked.
- **Blocking is a safety feature**, so it must be enforced, not merely recorded.
- **No lost messages** under concurrent sends.
- Feed reads bounded and paginated.
- Feed ranking swappable without touching the service (OCP).

---

## 4. Core Entities

| Entity | Layer | Internal summary |
|--------|-------|------------------|
| `User` | model | Identity plus **four distinct id sets**: `friendIds` (symmetric), `followingIds` / `followerIds` (asymmetric, two sides of one edge), `blockedIds`. Storing ids not references keeps the object graph acyclic and serializable. |
| `Post` | model | Author, content, `PostVisibility`, `likedBy` set, comments, share count. |
| `PostVisibility` | model (enum) | `PUBLIC` / `FRIENDS_ONLY` / `PRIVATE`. |
| `Comment` | model | `postId`, author, content, `likedBy`, one level of `replies`. |
| `FriendRequest` | model | `senderId`, `receiverId`, `FriendRequestStatus`, timestamps. Guards its own transitions — a settled request cannot be re-answered. |
| `FriendRequestStatus` | model (enum) | `PENDING → ACCEPTED` \| `REJECTED`, both terminal. |
| `Message` / `MessageStatus` | model | 1:1 message with a derived `conversationId`. |
| `Notification` / `NotificationType` | model | Targeted at a user, read/unread. |
| `Feed` | model | Page of posts for a viewer. |
| `FeedAlgorithm` | service (interface) | `generateFeed(user, candidatePosts, limit)`. |
| `ChronologicalFeedAlgorithm` | service/impl | Newest-first. |
| `NotificationService` | service (interface) | Fire-and-forget lifecycle hooks. |
| `SocialNetworkService` | service (interface) | The contract. |
| `InMemorySocialNetworkService` | service/impl | Registries + authorization + the feed query. |
| `SocialNetwork` | root | Facade. |

---

## 5. Relationships

- **Friendship is one edge stored twice.** `accept` writes `sender.addFriend(receiver)`
  *and* `receiver.addFriend(sender)`. The invariant "friendship is symmetric" is
  maintained by convention, and every mutation path must honour both sides —
  `removeFriend` and `blockUser` do. This duplication is the price of O(1)
  "are we friends?" from either side.
- **Follow is one edge stored twice as well**, but *asymmetrically*:
  `follower.followingIds` and `followee.followerIds`. Two sets, one relationship,
  so both "who do I follow" and "who follows me" are O(1).
- A `FriendRequest` is a **pending edge** — the handshake object that exists only
  between intent and consent.
- `conversations` is keyed by a **canonical sorted pair** (`min_max`), so
  `(a,b)` and `(b,a)` resolve to the same thread — the same trick as `whatsapp`'s
  direct-chat index.
- `Post` **references** its author by id and **contains** its comments.

---

## 6. Design Patterns (name + why vs alternatives)

- **Strategy — `FeedAlgorithm`.** Feed ranking is the single most-changed
  algorithm in any social product (chronological → engagement → ML-ranked).
  Behind an interface, the service hands it candidates and stays out of the
  ranking business. *Alternative:* sorting inline in `getNewsfeed` — rejected: it
  welds the product's most volatile logic into the orchestrator.
- **Observer — `NotificationService`.** Likes, comments, follows and friend
  requests all need to notify someone. Keeping that behind a service means the
  interaction paths don't grow notification code. *Alternative:* build
  `Notification` objects inline at each call site — rejected: four call sites that
  drift.
- **Facade — `SocialNetwork`.**
- **Canonical-key Value Object — the conversation id.** Sorting the pair makes the
  key order-independent by construction.
- *(Considered, not forced)* **Composite** for arbitrarily nested comment threads.
  With one level of replies a `List<Comment>` inside `Comment` is enough; true
  nesting is where Composite earns its place, and I'd name that as the trigger.
- *(Considered, rejected)* **State** for `FriendRequestStatus`. Two terminal
  transitions with no per-state behaviour — a guard method beats four classes.

---

## 7. Key Implementation Details

### 7.1 Blocking was stored and never read (the headline)

`blockUser` recorded the block and removed the friendship. Nothing else in the
system ever consulted `blockedIds`. Measured against the real service:

```
victim blocked harasser: true
  *** blocked user CAN still send messages ***
  *** blocked user CAN still send friend requests ***
  *** blocked user CAN still like the victim's posts ***
```

This is the worst class of bug in the file: the feature *appears* to work — the
API exists, the state is stored, `isBlocked` returns `true` — while providing zero
protection. A user who blocks someone believes they are safe and is not.

The fix is a single choke point, applied on every interaction path:

```java
private void requireNotBlocked(String actorId, String targetId, String action) {
    User actor = getUser(actorId);
    User target = getUser(targetId);
    if (target.isBlocked(actorId) || actor.isBlocked(targetId)) {
        throw new UnauthorizedException("Cannot " + action + ": blocked");
    }
}
```

Two design points worth stating out loud:

- **The check is symmetric.** If *either* party blocked the other, the interaction
  fails. Checking only `target.isBlocked(actor)` would let the blocker keep poking
  the person they blocked, which is not what "block" means to a user.
- **It's called from `sendMessage`, `sendFriendRequest`, `likePost`,
  `commentOnPost`**, and `isVisibleToUser` short-circuits on a block *before*
  evaluating visibility — so a block beats even `PUBLIC`. One helper, five call
  sites; the enforcement can't drift because there's one implementation of the rule.

### 7.2 `acceptFriendRequest` didn't know who was accepting

```java
public void acceptFriendRequest(String requestId) {   // no actor!
    request.accept();
    sender.addFriend(receiver.getUserId());
    receiver.addFriend(sender.getUserId());
}
```

Anyone holding a request id could accept it — **including the sender**, who could
therefore befriend anybody unilaterally. Reproduced: Alice sent a request to Bob,
Alice accepted it, and the two became friends without Bob's involvement.

A consent handshake with no actor parameter isn't a handshake. The signature had
to change:

```java
private FriendRequest requireRequestFor(String requestId, String responderId, String action) {
    FriendRequest request = friendRequests.get(requestId);
    if (request == null) throw new InvalidRequestException("Friend request not found");
    if (!request.getReceiverId().equals(responderId)) {
        throw new UnauthorizedException("Only the receiver can " + action + " this friend request");
    }
    return request;
}
```

`FriendRequest` also gained its own guard, because "answer once" is an invariant of
the entity rather than of the service:

```java
private void requirePending(String action) {
    if (status != FriendRequestStatus.PENDING) {
        throw new IllegalStateException("cannot " + action + " a request that is already " + status);
    }
}
```

Previously a REJECTED request could be re-accepted, flipping a settled decision.
**Where a check lives matters:** the actor check is authorization and belongs in
the service; the lifecycle check is an invariant and belongs on the entity, so no
future caller can skip it.

### 7.3 Conversation messages were lost

`conversations.computeIfAbsent(id, k -> new ArrayList<>()).add(message)` — the
outer map is concurrent, the inner list is not. Measured, 32 threads × 50 messages:

```
before: 1498/1600, 1474/1600, 1470/1600   (~8% dropped)
after : 1600/1600 on every trial
```

Switched to `CopyOnWriteArrayList`, and `getConversation` now returns a defensive
copy instead of handing callers the live internal list. COW is the right choice
*here* — unlike the per-chat history in `whatsapp`, a 1:1 conversation in this
model is read far more often than written, and the read path benefits from
lock-free iteration. Worth contrasting the two explicitly: same-looking problem,
different access pattern, different structure.

### 7.4 The newsfeed is fan-out on read — and that's the discussion

```java
List<Post> candidates = posts.values().stream()
    .filter(p -> isVisibleToUser(p, user))
    .collect(Collectors.toList());
return feedAlgorithm.generateFeed(user, candidates, limit);
```

This scans **every post in the system** on every feed load — O(total posts), which
is the one thing a social network absolutely cannot do at scale. I'd raise this
before being asked, because the trade-off is the interesting part:

- **Fan-out on read (this):** cheap writes, expensive reads. A post is stored once.
  Correct, simple, and hopeless past a few thousand posts.
- **Fan-out on write:** on publish, push the post id into each follower's
  precomputed feed list. Reads become O(limit). Writes become O(followers) — and
  for a celebrity with 50M followers that write is catastrophic.
- **The hybrid everyone actually ships:** fan-out on write for normal users;
  celebrities are *pulled* at read time and merged into the precomputed feed. It's
  worth naming that this hybrid exists specifically because neither pure strategy
  survives the follower distribution.

The `FeedAlgorithm` seam means the ranking swap is free; the fan-out change is a
storage change, which is the more expensive one.

---

## 8. Likely Follow-ups (with concise answers)

- **How do you store the graph at scale?** Adjacency lists in a wide-column store
  (`user_id → follower_ids`), or a dedicated graph database if traversals go deeper
  than one hop. "Friends of friends" is where a relational schema starts hurting.
- **Friend-of-friend / people you may know?** BFS to depth 2 from the user,
  ranked by mutual-friend count. Precomputed offline — never on the request path.
- **`deleteUser` leaves dangling references.** It removes the user and their posts,
  but their id survives in every friend's `friendIds`, in comments, notifications,
  and pending requests. Either cascade (expensive, and destroys others' comment
  threads) or **tombstone** the user and render "Deleted User" — which is what real
  products do, and it keeps referential integrity trivially.
- **Duplicate friend requests both directions?** The current duplicate check is a
  scan and only looks one way, so A→B and B→A can both be pending. Canonical pair
  key (same trick as the conversation id) plus auto-accept on the reverse request.
- **`sharePost` copies the text.** `"Shared: " + content` loses attribution and
  won't reflect an edit to the original. A share should be a post that *references*
  `originalPostId` — a one-field change with much better semantics.
- **Rate limiting / spam?** Cap requests and posts per user per window — the
  `ratelimiter` problem in this repo drops straight in.
- **Notification fan-out for a viral post?** Don't notify 1M likers individually —
  aggregate ("Alice and 999 others liked your post") and batch.
- **How would you test it?** The three harnesses from §7: a blocked user must fail
  on every interaction path; the sender must not be able to accept their own
  request; N threads sending to one conversation must produce exactly N messages.

---

## 9. Trade-offs

- **Ids in sets vs object references:** avoids cycles, keeps entities serializable,
  and makes "is X my friend" O(1); costs a lookup and a null-check on every
  traversal, visible in the `.map(users::get).filter(Objects::nonNull)` idiom.
- **Symmetric friendship stored twice:** O(1) reads from either side, at the cost
  of two writes that must both succeed. Not atomic here — a crash between the two
  `addFriend` calls leaves a half-friendship. A real system writes both sides in
  one transaction.
- **Separate friend and follow graphs:** models the domain honestly (consent vs no
  consent) instead of forcing one abstraction, at the cost of four id sets on
  `User` and two code paths for "whose posts do I see".
- **`CopyOnWriteArrayList` for conversations:** lock-free reads, O(n) copy per
  write. Right for 1:1 threads, wrong for a high-volume group chat — the opposite
  call from `whatsapp`, deliberately.
- **Fan-out on read:** simplest correct thing, and completely unscalable. Named in
  §7.4 rather than presented as adequate.
- **One level of comment replies:** avoids a Composite and unbounded recursion in
  rendering, at the cost of not modelling real threads.
- **In-memory registries with `stream().filter()` everywhere:** fine for the
  exercise; every one of those scans is a secondary index in a real system.
