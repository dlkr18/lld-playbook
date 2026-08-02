# Autocomplete / Typeahead — SDE2/SDE3 Interview Walkthrough

A full 70–100 minute walkthrough: clarify → requirements → entities →
relationships → patterns (with rationale) → key implementations → follow-ups →
trade-offs.

> The defect here is one an interviewer would love: the code has a clean
> `RankingStrategy` seam, and then **prunes the candidates by frequency before the
> strategy ever runs**. The pattern is present and structurally defeated — §7.1.

---

## 1. Clarifying Questions (first 5 minutes)

1. **Prefix matching only, or fuzzy/typo tolerance?** Prefix here. Fuzzy matching
   changes the structure entirely (BK-tree, or a trie walked with an edit-distance
   budget) — worth naming so it's clearly a scoping decision, not an oversight.
2. **What ranks the results?** Frequency is the obvious default, but real typeahead
   blends recency, personalization and prefix-length. So ranking must be pluggable
   — and, critically, must actually get to decide (§7.1).
3. **How big is the corpus, and how hot is the read path?** Typeahead is
   read-dominated and latency-critical: a keystroke budget is single-digit
   milliseconds. That drives caching and where the work happens.
4. **Case sensitivity?** Normalize to lowercase on both insert and query.
5. **Empty prefix?** Should return global top-k, not nothing.
6. **Deletion / updates?** Yes — words fall out of the corpus, frequencies change.
7. **Multi-word phrases?** Supported as literal strings here; genuine multi-token
   matching is a search problem, not a trie problem.

---

## 2. Functional Requirements

- `addWord(word, frequency)` — repeated adds accumulate frequency.
- `removeWord(word)` — returns whether the word was actually there.
- `contains(word)`.
- `getSuggestions(prefix, limit)` — top-`limit` completions, ranked.
- Empty prefix returns global top-`limit`.
- Case-insensitive throughout.
- Pluggable ranking, swappable at runtime.

## 3. Non-Functional Requirements

- Prefix lookup **O(p)** in the prefix length, independent of corpus size.
- **The ranking strategy must actually determine the result set** — not merely
  reorder survivors of a different filter.
- Thread-safe for concurrent reads and writes.
- Deleting a word must not damage words that share its prefix.

---

## 4. Core Entities

| Entity | Layer | Internal summary |
|--------|-------|------------------|
| `TrieNode` | model | `Map<Character, TrieNode> children`, `isEndOfWord`, the stored `word`, and an accumulated `frequency`. Storing the full word at terminal nodes trades a little memory for not having to rebuild strings during traversal. |
| `Suggestion` | model | `word`, `frequency`, and a `score` — the separation matters: frequency is data, score is the strategy's opinion. |
| `RankingStrategy` | service (interface) | `rank(prefix, candidates, limit)`. List-level, so a strategy can dedupe or diversify, not just sort. |
| `FrequencyRankingStrategy` | service/impl | Straight frequency order. |
| `PrefixBoostRankingStrategy` | service/impl | Doubles the score of a completion whose length equals the prefix — i.e. an exact match ranks above longer completions. |
| `AutocompleteService` | service (interface) | The contract. |
| `TrieBasedAutocomplete` | service/impl | The trie, traversal, collection, delegation to the strategy. |
| `Autocomplete` | root | Facade. |

---

## 5. Relationships

- `TrieBasedAutocomplete` **owns** the root `TrieNode`; nodes own their children —
  a pure tree, no back-pointers.
- The service **delegates all ordering** to a `RankingStrategy`. After the fix it
  hands over *every* candidate in the subtree, so the strategy has full authority.
- `Suggestion` is the boundary object between the trie (which knows frequency) and
  the strategy (which assigns score).
- A word lives at exactly one node; **prefixes are shared**, which is the whole
  point of the structure — and the reason deletion needs care (§7.2).

---

## 6. Design Patterns (name + why vs alternatives)

- **Strategy — `RankingStrategy`.** Ranking is the part of typeahead that changes
  constantly (frequency → recency → personalized → ML-scored). *Alternative:* a
  comparator parameter — rejected, because real ranking is list-level: dedup, and
  "don't show three results from the same domain" can't be expressed as a pairwise
  compare. §7.1 is the cautionary tale about having this seam and not honouring it.
- **Trie (prefix tree).** The data structure *is* the design. Lookup is O(p) in the
  prefix, not O(n) in the corpus, and shared prefixes are stored once.
  *Alternative:* a sorted list with binary search for the prefix range — simpler and
  genuinely competitive for a static corpus, but poor for incremental updates.
  A **ternary search tree** trades some speed for much less memory than a 26-way map.
- **Facade — `Autocomplete`.**
- *(Considered, rejected)* **Caching decorator** over `getSuggestions`. It's the
  right production move — prefix→results is extremely cacheable — but with no
  eviction requirement stated it would be an unrequested layer. Named in §8.

---

## 7. Key Implementation Details

### 7.1 The Strategy pattern, structurally defeated (the headline)

`getSuggestions` collected candidates into a **min-heap keyed on raw frequency**,
capped at `limit`, and only then called the strategy:

```java
PriorityQueue<Suggestion> topK = new PriorityQueue<>( (a,b) -> Integer.compare(a.getFrequency(), b.getFrequency()) );
collectCandidates(node, topK, limit);              // <-- keeps top `limit` BY FREQUENCY
return rankingStrategy.rank(normalized, new ArrayList<>(topK), limit);
```

So the strategy could only reorder words that had already survived a *different*
ranking. Any word the strategy would have promoted was gone before it was consulted.

Demonstrated with `PrefixBoostRankingStrategy`, whose stated job is to make an exact
prefix match win:

```
words: car=60 (boosted x2 = 120), cards=100, cargo=90
getSuggestions("car", 2) = [cards (score=100), cargo (score=90)]
*** car is ABSENT: the min-heap evicted it by raw frequency before
    PrefixBoostRankingStrategy ever ran, so the boost cannot win ***
```

`car` should have ranked **first** at a boosted score of 120. Instead it wasn't in
the output at all. The pattern was present, the seam was clean, and the behaviour
was exactly as if no strategy existed.

The fix hands the strategy everything:

```java
List<Suggestion> candidates = new ArrayList<Suggestion>();
collectCandidates(node, candidates);
return rankingStrategy.rank(normalized, candidates, limit);
```

```
getSuggestions("car", 2) = [car (freq=60, score=120.00), cards (freq=100, score=100.00)]
```

**The general rule worth stating out loud: pruning before scoring is only valid when
the prune key *is* the score.** Top-k by frequency then re-rank is a legitimate
optimization — it's how real search works — but only as an explicit *recall* stage
with a much larger cut-off than the final limit, and never with `limit` itself.

### 7.2 Deletion in a trie, and a return value answering the wrong question

The recursive `remove` returns "may this node be pruned" — correct for the recursion,
which needs to know whether to detach the child:

```java
boolean shouldDeleteChild = remove(child, word, index + 1);
if (shouldDeleteChild) node.getChildren().remove(ch);
return !node.isEndOfWord() && node.getChildren().isEmpty();
```

But `removeWord` returned that value directly to the caller — and "may this node be
pruned" is not "was the word removed". Removing `car` while `cards` exists prunes
nothing, because the `r` node still has children:

```
removeWord("car") returned false, contains("car") now false
*** returned false though the word WAS removed ***
```

A caller checking the return value would retry, log an error, or report failure on a
successful delete. Fixed by asking the right question first:

```java
TrieNode node = findNode(normalized);
boolean existed = node != null && node.isEndOfWord();
if (existed) remove(root, normalized, 0);
return existed;
```

The pruning logic itself was correct and is untouched — it only detaches nodes that
are neither a word end nor a prefix of a surviving word, which is exactly what
protects `cards` when `car` goes.

### 7.3 Why terminal nodes store the whole word

Each end-of-word node keeps its `word` string. The alternative is to rebuild it by
accumulating characters during the DFS. Storing it costs memory but keeps
`collectCandidates` trivial and avoids `StringBuilder` churn on the hot read path —
a reasonable trade for a read-dominated structure, and worth flagging as a
deliberate choice rather than an accident.

### 7.4 Thread-safety

All mutating and reading service methods are `synchronized`, so the trie is safe.
`rankingStrategy` is now `volatile` and its setter `synchronized` — it's swappable at
runtime, and without that a reader thread could hold a stale reference indefinitely.

This is the coarse-but-correct choice. Since the read path dominates, a
`ReadWriteLock` would be the natural upgrade, and is noted in §9.

---

## 8. Likely Follow-ups (with concise answers)

- **Top-k without walking the whole subtree?** Precompute and cache the top-k *at
  every node* (the classic optimization) — then `getSuggestions` is O(p) with no DFS
  at all. Cost: memory, and every insert must update the cached lists up the path.
  This is the answer the question is fishing for once the naive version works.
- **Then how does a pluggable strategy survive caching?** It doesn't, cleanly —
  cached top-k bakes in one ranking. Real systems cache a *recall set* (say top 100
  by a static prior) and apply the dynamic strategy on top. Which is exactly §7.1's
  distinction between a recall stage and a ranking stage, done deliberately.
- **Personalization?** The strategy signature already takes the prefix; add a user
  context and the per-user signals become another `RankingStrategy`. Per-user tries
  don't scale — blend a global trie with a small per-user one.
- **Typo tolerance?** Walk the trie with an edit-distance budget, pruning branches
  whose distance already exceeds it, or use a BK-tree. Substantially different code.
- **Memory at scale?** A `HashMap` per node is heavy. Options: ternary search tree,
  array-of-26 for known alphabets, or a **radix/PATRICIA trie** that collapses
  single-child chains — a big win on real vocabularies where long unique suffixes are
  common.
- **Distribution?** Shard by first character or prefix hash; each shard returns its
  top-k and a coordinator merges. Merging top-k lists is a heap over shard heads.
- **Concurrency at read scale?** `ReadWriteLock`, or a copy-on-write immutable trie
  swapped atomically on update — readers then need no lock at all, which is what a
  latency-critical typeahead would actually do.
- **How would you test it?** The two harnesses used here: a word that only wins
  *after* the strategy's boost (proves ranking isn't pre-empted), and deleting a word
  that is a prefix of a surviving word (proves both the pruning and the return value).

---

## 9. Trade-offs

- **Collecting the full subtree vs a bounded heap:** correctness over memory. A
  one-character prefix on a large corpus now materializes many candidates. The
  principled fix isn't to restore the frequency cull — it's a score-aware recall cap
  (top-N with N ≫ limit) or per-node cached top-k. The old code took the memory win
  and silently paid for it in wrong answers.
- **Trie vs sorted array:** O(p) lookup and cheap incremental updates, against
  significantly higher memory per node. For a static corpus, binary search over a
  sorted array is simpler and faster.
- **Storing the word at terminal nodes:** faster reads, more memory.
- **List-level `rank` vs a comparator:** expressive enough for dedup and diversity,
  at the cost of every strategy having to handle sorting and truncation itself.
- **`synchronized` everywhere:** simple and correct; serializes the read-dominated
  path, which is the wrong shape for typeahead at scale (§8).
- **Frequency accumulates on repeated `addWord`:** makes ingesting a stream of usage
  events natural, but means there's no way to *set* a frequency — only add to it. A
  real corpus loader would want both.
