# Spotify / Music Streaming — SDE2/SDE3 Interview Walkthrough

A full 70–100 minute walkthrough: clarify → requirements → entities →
relationships → patterns (with rationale) → key implementations → follow-ups →
trade-offs.

> Most of this problem is straightforward modelling. The one genuinely tricky
> piece is the **playback queue with shuffle and repeat** — because shuffle means
> holding two orderings of the same list at once, and §7.1 is what goes wrong when
> one of them goes stale.

---

## 1. Clarifying Questions (first 5 minutes)

1. **Client or server?** The playback domain — queue, session, playlists, catalog.
   Not audio decoding, not CDN delivery, not DRM.
2. **What exactly does shuffle do?** The question worth asking, because there are
   two different answers: shuffle the *whole* queue (including songs you already
   played), or shuffle only the *upcoming* songs. And critically — **turning
   shuffle off must restore the original order**, which means keeping both orderings.
3. **Repeat modes?** `NONE`, `ONE` (loop current track), `ALL` (loop the queue).
   `ONE` interacts with `next()` in a way worth stating: `next()` returns the *same*
   song rather than advancing.
4. **Can the user queue a song while shuffle is on?** Yes — and this is where the
   two-ordering design usually breaks.
5. **Subscription tiers?** FREE vs PREMIUM gate skips, ads, offline. I'll model the
   tier and note where the gate belongs.
6. **Playlist collaboration / ownership?** Single owner for the core; collaborative
   playlists are a follow-up.
7. **Sessions per user?** One active playback session per user in this scope.

---

## 2. Functional Requirements

- Catalog: songs, albums, artists, genres.
- Playlists: create, add/remove songs, list.
- **Playback queue**: add songs, `next` / `previous`, `jumpTo`.
- **Shuffle**: toggle on/off, restoring the original order on off.
- **Repeat**: `NONE` / `ONE` / `ALL`.
- Playback session with `PlaybackState` (playing/paused/stopped).
- Search the catalog; subscription tiers.

## 3. Non-Functional Requirements

- **No song is ever lost from the queue** — including across a shuffle toggle.
- **Shuffle is uniform** — a correct Fisher-Yates, not a biased hand-rolled swap loop.
- **The currently-playing song survives** a shuffle toggle; the music doesn't jump.
- Navigation is O(1); shuffle is O(n).

---

## 4. Core Entities

| Entity | Layer | Internal summary |
|--------|-------|------------------|
| `Song` | model | Id, title, artist, album, duration, `Genre`. Validated on construction (non-empty title, positive duration). |
| `Album` / `Artist` / `Genre` | model | Catalog structure. |
| `SongId` / `AlbumId` / `ArtistId` / `PlaylistId` / `UserId` | model (VOs) | Typed ids with value equality. |
| `Playlist` | model | Owner + ordered song list. |
| `PlaybackQueue` | model | **The heart of the problem**: `queue` (current play order), `originalOrder` (canonical insertion order), `currentIndex`, `shuffleEnabled`, `repeatMode`. |
| `RepeatMode` | model (enum) | `NONE`, `ONE`, `ALL`. |
| `PlaybackState` | model (enum) | Playing / paused / stopped. |
| `PlaybackSession` | model | Ties a user to a queue and a state. |
| `SubscriptionTier` | model (enum) | FREE / PREMIUM. |
| `User` | model | Identity + tier + playlists. |
| `PlaybackService` | service/impl | Orchestrates sessions and queue operations. |
| `Spotify` | root | Facade. |

---

## 5. Relationships

The queue holds **two views of the same songs**, and understanding that is the
whole design:

```
originalOrder : [s1, s2, s3, s4, s5]     <- canonical, insertion order
queue         : [s3, s1, s5, s2, s4]     <- current play order (shuffled)
currentIndex  :      ^ index into `queue`, never into originalOrder
```

- `queue` is what `next()` / `previous()` walk. `currentIndex` indexes **it**.
- `originalOrder` exists solely so shuffle can be *undone*.
- **Both must be updated on every add.** The invariant is that `originalOrder`
  always contains exactly the same set of songs as `queue`, differing only in order.
  Break that and un-shuffling destroys data (§7.1).
- `PlaybackSession` **has-a** `PlaybackQueue`; `User` **has** playlists;
  `Playlist` **references** `Song`s.

---

## 6. Design Patterns (name + why vs alternatives)

- **Two-list ordering (canonical + view).** Not a GoF pattern, but the design
  decision the interviewer is probing. *Alternative:* store a shuffled **index
  permutation** rather than a second song list — arguably better, since there's
  then only one list of songs and no way for the two to diverge. Worth naming as
  the more robust variant.
- **Strategy (latent) — `RepeatMode`.** Currently an enum with `if` branches in
  `next()`. With a third or fourth mode (smart shuffle, autoplay-radio) it becomes
  a `NextTrackStrategy`. Today the enum is simpler and I'd keep it.
- **Value Object — the typed ids**, so `getSong(albumId)` can't compile.
- **Facade — `Spotify`.**
- *(Considered, not forced)* **State** for `PlaybackState`. Play/pause/stop have
  transition rules but no per-state behaviour beyond them — an enum plus guards is
  enough, same call as `taskmanagement` and unlike `auction`.
- *(Considered, not forced)* **Observer** for "now playing" listeners and scrobbling
  — the natural hook, no subscriber in scope.

---

## 7. Key Implementation Details

### 7.1 Songs queued during shuffle were destroyed (the headline)

`originalOrder` was captured **only at the moment shuffle was switched on**:

```java
if (enabled) {
    originalOrder = new ArrayList<>(queue);   // snapshot, then never updated
    ...
} else {
    queue.clear();
    queue.addAll(originalOrder);              // anything added since is gone
}
```

Meanwhile `addSong` appended to `queue` alone. So the two lists diverged the moment
a user queued a track while shuffle was on — and un-shuffling silently deleted it:

```
queue before shuffle : [s1, s2, s3]
after shuffle on     : [s1, s3, s2]
after adding s4, s5  : [s1, s3, s2, s4, s5]  (size=5)
after shuffle off    : [s1, s2, s3]          (size=3)
*** SONGS QUEUED DURING SHUFFLE ARE SILENTLY DESTROYED ***
```

Queueing a song and then toggling shuffle is an entirely ordinary sequence, so this
is a real user-facing data loss, not a corner case.

The fix is to stop treating `originalOrder` as a snapshot and treat it as **the
canonical list, maintained on every mutation**:

```java
public void addSong(Song song) {
    queue.add(song);
    originalOrder.add(song);   // both views, always
    if (currentIndex == -1) currentIndex = 0;
}
```

Shuffle-on then has nothing to capture — `originalOrder` is already correct — and
shuffle-off restores all five songs.

The deeper lesson, and the thing to say out loud: **any time you hold two
representations of the same data, every mutation path must touch both, and the one
you *read from less often* is the one that goes stale.** `originalOrder` is only
read when shuffle is turned off, which is exactly why nobody noticed. The
structurally safer design is the alternative from §6 — keep one list of songs plus
a permutation of indices, so there's only one place songs can live and divergence
is impossible by construction.

### 7.2 Shuffle: Fisher-Yates, and keeping the music playing

```java
for (int i = queue.size() - 1; i > 0; i--) {
    int j = random.nextInt(i + 1);     // j in [0, i] — inclusive is what makes it uniform
    Collections.swap(queue, i, j);
}
```

This is the correct Fisher-Yates. The classic wrong version uses
`random.nextInt(queue.size())` for `j`, which produces a **biased** distribution
(n^n equally likely paths mapping onto n! permutations — they can't divide evenly).
An interviewer may well ask why the bound is `i + 1`; the answer is that element `i`
must be able to stay put.

Then the current song is swapped to the front and `currentIndex` reset to 0, so
playback continues uninterrupted rather than jumping to whatever landed at the
cursor. Verified: a track playing before the toggle is still playing after it, in
both directions.

Worth naming as a deliberate simplification: this shuffles the **entire** queue,
including already-played songs, and collapses the history by moving the cursor to 0.
Spotify shuffles only the *upcoming* portion and preserves what you already heard.
Fixing that means shuffling `queue.subList(currentIndex + 1, size)` and leaving the
prefix intact.

### 7.3 `next()` and the repeat modes

```java
if (repeatMode == RepeatMode.ONE) return getCurrentSong();      // don't advance
if (currentIndex < queue.size() - 1) return queue.get(++currentIndex);
if (repeatMode == RepeatMode.ALL) { currentIndex = 0; return queue.get(0); }
return null;                                                    // NONE: queue exhausted
```

Three behaviours from one method, in priority order. Two details worth defending:

- **`ONE` short-circuits before the bounds check**, so it works at the end of the
  queue too.
- **`hasNext()` returns `true` unconditionally under `ONE` or `ALL`** — correct,
  because both loop forever. Any caller that auto-advances in a `while (hasNext())`
  loop will therefore spin forever, which is right for a music player but a trap
  for a batch consumer. The contract needs stating.

`previous()` is deliberately *not* symmetric: at index 0 with `NONE` it returns the
current song rather than `null`, matching how a real player's back button behaves.

---

## 8. Likely Follow-ups (with concise answers)

- **Shuffle only the upcoming songs?** As in §7.2 — shuffle the sublist after the
  cursor. Keeps history intact, which is what users actually expect from the back
  button.
- **Why not `Collections.shuffle`?** It *is* Fisher-Yates internally and would be
  the right lazy answer. Hand-rolling it here is defensible only because the
  interview is partly about knowing the algorithm; in production, use the stdlib.
- **Reproducible shuffle across devices?** Seed the `Random` with a per-session seed
  and store it. Then any device can reconstruct the same order from
  `(playlist, seed)` without syncing the whole permutation — the argument for the
  index-permutation design in §6.
- **FREE vs PREMIUM gating?** `SubscriptionTier` exists but gates nothing.
  Skip limits (6/hour), shuffle-only playback, and ad insertion belong at the
  service boundary, not in `PlaybackQueue` — the queue shouldn't know about billing.
- **Thread safety?** `PlaybackQueue` is entirely unsynchronized. That's defensible
  for one session driven by one UI thread, but it needs saying rather than assuming
  — if a "add to queue" API call and a "next track" event can race, every mutator
  needs the session's monitor.
- **Playlist at scale (10k songs)?** The list is fine; the problem is loading it.
  Paginate, and make the queue lazy — hold playlist id + cursor rather than
  materializing every `Song`.
- **Recommendations / autoplay radio?** A `NextTrackStrategy` behind `next()` that
  can synthesize songs when the queue is exhausted, instead of returning `null`.
- **Offline / caching?** Out of scope, but it's an LRU eviction problem — the
  `lrucache` problem in this repo composes directly.
- **How would you test it?** The §7.1 sequence as a regression (add during shuffle,
  toggle off, assert size and contents), the current-song-survives-toggle case both
  directions, each repeat mode's `next()` at the queue boundary, and a
  chi-squared-ish sanity check that shuffle isn't obviously biased.

---

## 9. Trade-offs

- **Two song lists vs one list + index permutation:** the current design is easy to
  read but has two places songs can live, which is precisely what caused §7.1. The
  permutation design makes divergence structurally impossible and enables the
  reproducible-shuffle feature — I'd take it in a rewrite and say so.
- **Shuffling the whole queue vs only upcoming:** simpler, and loses listening
  history. Wrong for the product, right for a 90-minute exercise, stated explicitly.
- **`RepeatMode` enum with branches vs Strategy:** three modes and ~6 lines of
  branching is below the threshold where polymorphism pays. Names the threshold
  rather than reflexively applying the pattern.
- **`getQueue()` returns an unmodifiable view, not a copy:** cheap and prevents
  external mutation, but the view reflects later internal changes — a caller holding
  it across a shuffle sees the order change under them. A copy would be safer and
  O(n).
- **No synchronization:** matches the single-session domain; genuinely wrong the
  moment queue mutations arrive from more than one thread. Called out in §8 rather
  than left implicit.
- **`previous()` asymmetric with `next()`:** matches real player behaviour at the
  cost of an API that doesn't read symmetrically. Deliberate, and worth the comment
  it now carries.
