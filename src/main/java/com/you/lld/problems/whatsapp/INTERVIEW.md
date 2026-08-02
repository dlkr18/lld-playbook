# WhatsApp / Chat Messenger — SDE2/SDE3 Interview Walkthrough

A full 70–100 minute walkthrough: clarify → requirements → entities →
relationships → patterns (with rationale) → key implementations → follow-ups →
trade-offs.

> The trap in this problem is that `ConcurrentHashMap` on the registries *looks*
> thread-safe while the thing that actually gets hammered — the per-chat message
> list — is a bare `ArrayList`. Section 7.1 shows the measured message loss.

---

## 1. Clarifying Questions (first 5 minutes)

1. **Scope: which surface?** The server-side domain model — chats, messages,
   delivery/read receipts, group admin. Not the transport (WebSocket/XMPP), not
   the mobile client, not E2E crypto. I'll name where each attaches.
2. **Direct and group, or just group?** Both, and I want them behind **one `Chat`
   abstraction** so the service never branches on chat type to send a message.
3. **Delivery semantics?** WhatsApp's three states: sent (server has it),
   delivered (recipient device has it), read (recipient opened it). In a group
   these are **per participant**, not a single flag — that drives the data model.
4. **Ordering guarantee?** Per-chat ordering. Global ordering across chats is
   neither needed nor achievable cheaply.
5. **History size?** Unbounded in principle, so reads must paginate; I won't
   design an API that returns "all messages" as the only option.
6. **Concurrency?** Yes, and it's the heart of the problem — many senders per
   chat, many chats in parallel. That's the invariant I'll defend.
7. **Retention / deletion?** Soft delete (tombstone) so "This message was deleted"
   can render and receipts stay consistent. Not a hard purge.
8. **Out of scope but named:** E2E encryption, media storage/CDN, multi-device
   sync, presence fan-out at scale.

---

## 2. Functional Requirements

- Register users; track online/offline status and last-seen.
- Create a **direct chat** (idempotent per user pair) and a **group chat**.
- Send, reply to, and forward messages; soft-delete by the sender only.
- Per-user **delivered** and **read** receipts; unread counts per chat.
- Group admin: add/remove participants, promote/demote admins, leave, edit metadata.
- Star/unstar messages; list starred; search within a chat.
- Typing indicators.
- List a user's chats, most-recently-active first.

## 3. Non-Functional Requirements

- **No lost messages under concurrent sends** — the hard invariant.
- **Exactly one direct chat per user pair**, even under concurrent creation.
- **Per-chat parallelism**: two different chats must never contend on one lock.
- **O(1)** chat/message/user lookup; paginated history reads.
- **Authorization enforced server-side** — only admins mutate the group, only the
  sender deletes their message.

---

## 4. Core Entities

| Entity | Layer | Internal summary |
|--------|-------|------------------|
| `UserId` / `ChatId` / `GroupId` / `MessageId` / `PhoneNumber` | model (VOs) | Typed ids instead of bare `String`. Makes `sendMessage(chatId, userId, …)` impossible to call with the arguments swapped — a compile error rather than a runtime mystery. `GroupId.toChatId()` gives a group its stable chat identity. |
| `User` | model | Identity + `UserStatus` + `lastSeen` + blocked set. |
| `Message` | model | Immutable core (`id`, `senderId`, `content`, `timestamp`, `repliedToId`, `forwardedFromId`) plus mutable receipt state: `deliveredTo` / `readBy` as `Map<UserId, LocalDateTime>`, `status`, `isStarred`, `isDeleted`. Built via a **Builder** because the optional fields (reply/forward/type) would otherwise be a 7-arg constructor. |
| `MessageContent` | model (VO) | Text and/or `Attachment`; `getText()` returns `Optional`. |
| `MessageStatus` | model (enum) | `SENT → DELIVERED → READ`, plus `DELETED`. |
| `Chat` | model (interface) | The polymorphic seam: `addMessage`, `getMessages(limit, offset)`, `getParticipants`, `isParticipant`, `getUnreadCount`, `getDisplayName(forUser)`. |
| `DirectChat` | model | Two `UserId`s, message list, per-user `lastReadAt`. `addMessage` auto-marks delivered to the other party. |
| `GroupChat` | model | `Map<UserId, Participant>` with roles, message list, mutable metadata. |
| `Participant` / `ParticipantRole` | model | Membership + `ADMIN`/`MEMBER`, plus joined-at. |
| `UserService` / `ChatService` | service (interfaces) | Two concerns, two interfaces — identity vs conversation. |
| `InMemoryUserService` / `InMemoryChatService` | service/impl | Registries + the locking discipline. |
| `WhatsApp` | root | Facade over both services; the narrow API a client actually calls. |

---

## 5. Relationships

- `WhatsApp` **has-a** `UserService` and a `ChatService` (both constructor-injected).
- `DirectChat` and `GroupChat` both **implement** `Chat` — so `sendMessage` is
  `chat.addMessage(m)` with no `instanceof`, no `switch (chatType)`.
- `InMemoryChatService` **owns** five indexes, each earning its place:
  `chats` (id → chat), `groups` (groupId → group), `userChats` (user → their chat
  ids), `messages` (id → message, for id-addressed ops like star/delete),
  `directChatIndex` (canonical user-pair key → chat id), `starredMessages`,
  `typingUsers`.
- A `Message` is reachable **two ways** — from its chat's ordered list and from the
  global `messages` map. Same object, not a copy, so a receipt applied via
  `markRead(messageId, …)` is visible through the chat's list.
- `Chat` **owns** its messages; the chat object is the concurrency unit.

---

## 6. Design Patterns (name + why vs alternatives)

- **Strategy / polymorphic Composite — `Chat`.** Direct and group chats differ in
  participants, display name, and delivery fan-out, but the service treats them
  uniformly. *Alternative:* one `Chat` class with a `type` enum and branches
  everywhere — rejected: every new chat kind (broadcast, channel) would edit every
  method.
- **Builder — `Message.Builder`.** Messages have 3 required and 4 optional fields
  (reply-to, forwarded-from, type, timestamp). Telescoping constructors would be
  unreadable and easy to mis-order. *Alternative:* setters on a mutable message —
  rejected: the identity fields should be final.
- **Value Object — the typed ids.** Cheap, and they eliminate a whole class of
  argument-order bugs.
- **Facade — `WhatsApp`.** Hides two services behind the handful of operations a
  client needs.
- **Repository-ish service seam — `ChatService`/`UserService` interfaces.** Swapping
  the in-memory impl for a database-backed one is a new class.
- *(Considered, not forced)* **Observer** for push notifications and presence
  fan-out. It's the correct pattern the moment a transport exists — the hook is
  `addMessage` — but with no subscriber in scope it would be an empty interface,
  so I name it rather than build it.
- *(Considered, rejected)* **State** for `MessageStatus`. The transitions are a
  linear `SENT → DELIVERED → READ` monotone with no per-state behaviour worth
  polymorphism; `updateOverallStatus()` derives it from the receipt maps in three
  lines. State classes would be ceremony.

---

## 7. Key Implementation Details

### 7.1 The thread-safety that wasn't (the headline)

The service was annotated *"Thread-safe using ConcurrentHashMap"*. The registries
were indeed concurrent — but `sendMessage` ends in `chat.addMessage(message)`, and
inside `DirectChat` the message list was a plain `ArrayList`. `ArrayList.add`
under concurrency loses writes: two threads read the same `size`, both write index
`n`, one overwrites the other.

Measured — 32 threads × 50 messages into one chat, expecting 1600:

```
trial 1: expected=1600 actual=1537  *** LOST 63 MESSAGES ***
trial 3: expected=1600 actual=1451  *** LOST 149 MESSAGES ***
trial 5: expected=1600 actual=1327  *** LOST 273 MESSAGES ***
```

A messenger silently dropping 4–17% of messages. The fix makes **the chat object
its own monitor** — every method touching the list is `synchronized`:

```java
public synchronized void addMessage(Message message) { ... messages.add(message); ... }
public synchronized List<Message> getMessages() { return new ArrayList<>(messages); }
public synchronized int getUnreadCount(UserId userId) { ... }
```

After: `1600/1600` on every trial.

**Why this lock and not something else** — the question an interviewer will ask:

- **`CopyOnWriteArrayList`?** Wrong shape. A chat is append-heavy and grows
  unbounded; COW copies the whole array on *every* send. Correct for the *typing
  set* and for refund-style short lists, wrong for message history.
- **`Collections.synchronizedList`?** Makes each `add` atomic but not the compound
  reads — `getUnreadCount` streams the list, `getMessages(limit, offset)` takes a
  `subList`. Those need the lock held across the whole operation, so I'd be
  writing `synchronized (list) { ... }` anyway.
- **A global service lock?** Correct but serializes *every* chat in the system
  behind one monitor. The chat is the natural sharding unit — locking per chat
  gives full parallelism across chats, which is the actual workload.

`Message`'s receipt maps got the same treatment: `deliveredTo`/`readBy` are now
`ConcurrentHashMap`, `status`/`isStarred`/`isDeleted` are `volatile`, and
`markDelivered`/`markRead` are `synchronized` because each does a put **plus** a
`updateOverallStatus()` recompute — a compound action.

### 7.2 Exactly one direct chat per pair

`createDirectChat` was check-then-act: search for an existing chat, and if absent,
create one. Two concurrent callers both search, both miss, both create.

Measured — 32 threads creating the chat for the same pair (half calling
`(a,b)`, half `(b,a)`):

```
before: distinct chats created = 32, 10, 11, 11, 6   *** DUPLICATE CHATS ***
after : distinct chats created = 1,  1,  1,  1,  1   OK
```

The fix is a canonical key plus an atomic claim:

```java
private static String directChatKey(UserId a, UserId b) {
    String x = a.getValue(), y = b.getValue();
    return x.compareTo(y) <= 0 ? x + "|" + y : y + "|" + x;   // order-independent
}

DirectChat candidate = new DirectChat(user1, user2);
ChatId winner = directChatIndex.putIfAbsent(pairKey, candidate.getId());
if (winner != null) return winner;      // lost the race — discard our candidate
```

Two points worth making out loud: the key is **sorted** so `(a,b)` and `(b,a)`
collide as they must, and the loser simply drops its candidate — it was never
published to any index, so there is nothing to clean up. This also replaced an
O(chats-per-user) linear scan with an O(1) lookup.

### 7.3 Per-participant receipts, not a single flag

A group message isn't "delivered" — it's delivered *to Bob* and read *by Carol*.
So `Message` carries two maps rather than two booleans:

```java
private final Map<UserId, LocalDateTime> deliveredTo;
private final Map<UserId, LocalDateTime> readBy;

private void updateOverallStatus() {
    if (!readBy.isEmpty())            status = MessageStatus.READ;
    else if (!deliveredTo.isEmpty())  status = MessageStatus.DELIVERED;
}
```

The rolled-up `status` is a **derived convenience** for the sender's single-tick /
double-tick UI; the maps are the truth. Note the semantics this encodes: the
group summary goes to READ when *anyone* has read it. WhatsApp's actual rule for
the blue double-tick is *everyone*, which would be
`readBy.keySet().containsAll(participants minus sender)` — a one-line change, and
exactly the kind of requirement I'd confirm in clarification rather than assume.

Unread counts are computed from a per-user `lastReadAt` watermark rather than by
counting individual receipts — O(messages since watermark) instead of maintaining a
counter that can drift.

### 7.4 Authorization lives in the service, invariants in the model

Every group mutation checks the requester first:

```java
if (!group.isAdmin(requesterId)) throw new IllegalArgumentException("Only admins can add participants");
```

and `removeParticipant` refuses self-removal so there is one code path for leaving
(`leaveGroup`), which also garbage-collects an emptied group. Meanwhile the model
enforces its own invariants regardless of caller — `DirectChat` rejects a chat with
yourself, and `addMessage` rejects a non-participant sender. Model invariants are
not defensive duplication of the service check; they're what keeps the object
valid if a second caller appears.

---

## 8. Likely Follow-ups (with concise answers)

- **How do messages actually reach the device?** The domain model ends at
  `addMessage`; a transport layer (WebSocket per connected device) subscribes.
  Offline users get a per-device queue drained on reconnect — which is exactly
  where an **Observer** on the chat plugs in.
- **Ordering across devices?** Server-assigned per-chat sequence number, not client
  timestamps — clocks disagree. Clients sort by sequence and use the timestamp only
  for display.
- **Scaling past one box?** Shard by `chatId` (all of a chat's state, including its
  lock, on one owner node) — the per-chat monitor becomes single-node-per-chat by
  construction. `userChats` becomes a secondary index; message history moves to a
  wide-column store keyed `(chat_id, sequence)`, which is append-optimized and
  gives cheap pagination.
- **Unbounded message list in memory?** Today `getMessages()` copies the whole
  list. Cap the in-memory tail (last N), page older history from storage, and keep
  `getMessages(limit, offset)` as the only API the client uses.
- **Typing indicators leak.** `typingUsers` has no TTL — a client that disconnects
  mid-type stays "typing" forever. Real fix: store a timestamp and expire after
  ~5s, or have the client re-assert every few seconds. Named because it's a real
  hole, not because anyone asked.
- **E2E encryption?** `MessageContent` becomes an opaque ciphertext blob; the
  server keeps routing and receipts but cannot search — so `searchMessages` moves
  to the client. Worth saying that server-side search and E2E are fundamentally in
  tension.
- **Blocked users?** Currently tracked on `User` but not enforced in `sendMessage` —
  the check belongs at the top of the send path for direct chats.
- **How would you test it?** Exactly the two harnesses in §7.1/§7.2: a
  `CountDownLatch` start gate, N threads, then assert the invariant (message count
  exact, distinct chats == 1). Both belong in the repo as JUnit tests, which is the
  main gap left here.

---

## 9. Trade-offs

- **`synchronized` on the chat vs lock-free structures:** simple, obviously
  correct, and the contention unit matches the domain. Cost: sends to one very
  busy group serialize. If that group is a bottleneck, the answer is an
  append-only log per chat with a single writer thread, not finer locks.
- **Mutable `Message` vs immutable + event log:** receipts mutate a shared object,
  which is compact but means a message's state is a snapshot rather than a history.
  An append-only `MessageEvent` log would give audit and replay; heavier than a
  90-minute design warrants.
- **Two lookup paths for a message (chat list + `messages` map):** O(1)
  id-addressed operations (star, delete, receipt), at the cost of two structures to
  keep consistent. Mitigated by storing the *same object*, never a copy.
- **Soft delete (tombstone) vs hard delete:** keeps ordering and receipts coherent
  and matches product behaviour ("This message was deleted"), at the cost of never
  reclaiming the row.
- **Derived rolled-up `MessageStatus`:** cheap for the sender's tick UI, but it
  encodes an "any participant" rule that differs from WhatsApp's "all participants"
  blue tick. A requirement to confirm, not a detail to guess.
- **`getUserChats` sorts on every call:** O(n log n) per call, fine for a few
  hundred chats. A maintained "recent chats" ordering (updated on send) would be
  O(1) reads at the cost of another structure to keep in sync.
- **In-memory everything:** the right scope for the exercise; §8 covers the shard
  and storage story rather than pretending the maps are a database.
