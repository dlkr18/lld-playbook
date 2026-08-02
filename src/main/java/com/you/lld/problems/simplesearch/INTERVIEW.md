# Simple Search (inverted index + TF-IDF) — SDE2/SDE3 Interview Walkthrough

A full 70–100 minute walkthrough: clarify → requirements → entities →
relationships → patterns (with rationale) → key implementations → follow-ups →
trade-offs.

> The TF-IDF maths here was already right. What was wrong is a classic: **a
> loop-invariant computed inside the loop.** IDF depends only on the term, but was
> recomputed per candidate document — via a call that copies the entire posting
> list. One query on 8,000 documents took 862 ms; it now takes 8 ms (§7.2).

---

## 1. Clarifying Questions (first 5 minutes)

1. **What kind of query?** Bag-of-words OR: match any term, rank by relevance. Phrase
   queries (`"design patterns"` in order) need positional postings — a different index.
2. **What ranks results?** TF-IDF as the default, pluggable. Real engines use BM25;
   worth naming since TF-IDF is the teaching version of the same idea.
3. **Corpus size and update rate?** In-memory here. Whether the index is
   read-mostly or continuously updated decides the concurrency design.
4. **Stemming, stopwords, synonyms?** Not implemented. Important that tokenization
   is one shared rule regardless (§7.3).
5. **Pagination?** Yes — offset/limit, and it must be stable.
6. **What's an update?** Re-index: remove the old postings entirely, then add. A
   partial update leaves stale terms pointing at the document.
7. **Do we need the matched snippet/highlighting?** Out of scope; needs positions.

---

## 2. Functional Requirements

- Index a document (`id`, `title`, `content`); reject a duplicate id.
- Remove a document, purging it from every posting list.
- Update = full re-index.
- Search: tokenize the query, union the posting lists, rank, paginate.
- Swap ranking strategy at runtime.

## 3. Non-Functional Requirements

- Lookup by term **O(1)**; query cost proportional to matching documents, **not to
  the corpus**.
- Query and indexing must tokenize **identically**.
- A query sees one consistent snapshot of the index.
- Removing a document leaves no dangling postings.

---

## 4. Core Entities

| Entity | Layer | Internal summary |
|--------|-------|------------------|
| `Document` | model | `id`, `title`, `content`, `fullText()`. |
| `SearchResult` | model | `Document` + `score`. |
| `InvertedIndex` | service (interface) | `indexDocument`, `removeDocument`, `lookup(term)`, `getTermFrequencies(docId)`, `getDocumentCount`, `getDocument`. |
| `InMemoryInvertedIndex` | service/impl | Three maps: `postings` (term → docId → tf), `documents` (id → doc), `docTermFreq` (docId → term → tf). Owns **the** tokenizer. |
| `RankingStrategy` | service (interface) | `rank(queryTerms, candidateIds, index, offset, limit)`. |
| `TfIdfRankingStrategy` | service/impl | Normalized TF × smoothed IDF. |
| `MatchCountRankingStrategy` | service/impl | Count of distinct query terms present — the naive baseline to contrast against. |
| `SearchEngine` / `InvertedIndexSearchEngine` | service | Tokenize → union candidates → delegate ranking. |
| `SimpleSearch` | root | Facade. |

---

## 5. Relationships

- `InvertedIndexSearchEngine` **has-a** `InvertedIndex` and a `RankingStrategy`; it
  owns the *query pipeline*, not the scoring.
- `InMemoryInvertedIndex` maintains **three mutually-derived maps**. `docTermFreq` is
  what makes `removeDocument` O(terms in doc) rather than a scan of every posting
  list — the reverse index of the inverted index.
- The **`postings` map stores term frequency in the value**
  (`term → {docId → tf}`), so scoring needs no document re-parse.
- `RankingStrategy` receives the `InvertedIndex` itself, so a strategy can ask for
  whatever corpus statistics it needs (df, N, tf) rather than being handed a
  fixed pre-computed bundle.

---

## 6. Design Patterns (name + why vs alternatives)

- **Strategy — `RankingStrategy`.** Relevance is the thing that changes: TF-IDF →
  BM25 → learned ranking. Passing the index in (rather than pre-computed scores)
  keeps the strategy genuinely free to define relevance.
- **Repository / interface seam — `InvertedIndex`.** In-memory today; Lucene or a
  database tomorrow is a new implementation, not a rewrite.
- **Facade — `SimpleSearch`.**
- **Inverted index (the data structure is the design).** Turning
  "which documents contain this term" into an O(1) map lookup is the entire idea.
  *Alternative:* scan every document per query — O(corpus × doc length), which is
  what the index exists to avoid, and ironically what §7.2's bug reintroduced.
- *(Considered, not built)* **Decorator for tokenization** — a `StemmingTokenizer`
  wrapping a base tokenizer is the clean way to add stemming/stopwords, and is the
  natural extension point now that there's exactly one tokenizer to wrap (§7.3).

---

## 7. Key Implementation Details

### 7.1 The index layout, and why there are three maps

```java
Map<String, Map<String, Integer>> postings;     // term  -> docId -> termFrequency
Map<String, Document>             documents;    // docId -> document
Map<String, Map<String, Integer>> docTermFreq;  // docId -> term  -> termFrequency
```

`postings` and `docTermFreq` hold the same facts in opposite directions, which
looks redundant until you write `removeDocument`. With `docTermFreq` you know
exactly which posting lists mention the document — O(terms in doc). Without it,
purging requires walking **every** posting list in the corpus. The duplication buys
an asymptotic improvement on deletion, and both are written in one place so they
can't drift.

Deletion also prunes emptied posting lists (`if (docs.isEmpty()) postings.remove(term)`),
so the term vocabulary doesn't grow monotonically as documents come and go.

### 7.2 A loop-invariant inside the loop (the headline)

```java
for (String docId : candidateDocIds) {
    ...
    for (String term : queryTerms) {
        int df = index.lookup(term).size();        // <-- per document, per term
        double idf = Math.log((totalDocs + 1.0) / (df + 1)) + 1.0;
        score += normalizedTf * idf;
    }
}
```

IDF is a property of **the term and the corpus** — it is identical for every
document in the loop. Worse, `lookup(term)` doesn't just read a size; it builds
`new HashSet<>(docs.keySet())`, copying the term's entire posting list. For a
common term the posting list *is* the corpus, so a single-term query copied an
N-element set N times.

Measured, one query term matching every document:

| corpus | before | after |
|---|---|---|
| 2,000 docs | 94 ms | 5 ms |
| 4,000 docs | 230 ms | 10 ms |
| 8,000 docs | **862 ms** | **8 ms** |

Doubling the corpus roughly **3.7×**'d the time — textbook quadratic. The whole
point of an inverted index is that query cost scales with matches, not with corpus
size; this bug quietly restored the linear scan it exists to eliminate.

The fix is to hoist:

```java
Map<String, Double> idfByTerm = new HashMap<String, Double>();
for (String term : queryTerms) {
    int df = index.lookup(term).size();
    idfByTerm.put(term, Math.log((totalDocs + 1.0) / (df + 1)) + 1.0);
}
```

Scores are bit-for-bit unchanged (0.731 / 0.200 / 0.143 before and after) — this is
purely the same computation performed once.

`MatchCountRankingStrategy` had the same shape: `index.getTermFrequencies(docId)` —
which copies the document's whole term map — was called **once per query term** per
document instead of once per document.

**The general lesson worth stating:** an accessor that looks like a cheap getter
(`lookup`, `getTermFrequencies`) but returns a defensive copy is the ideal
camouflage for this bug. The defensive copies are correct; calling them in the
wrong place is what costs two orders of magnitude.

### 7.3 One tokenizer, not two

Indexing used a private `tokenize(text)`; querying used a static `tokenizeQuery(query)`.
Both lowercased and split on `\W+` — two implementations of a rule that **must** be
identical. If they ever diverged (someone adds stemming to one), queries would
silently stop matching documents that plainly contain the word, with no error
anywhere.

Now there is one `tokenize`, and the query path and term-counting path both call it.
This is also the seam where a stemming/stopword decorator would attach — worth
noting that the refactor is what makes that extension safe.

### 7.4 TF-IDF, and why the smoothing is there

```java
double normalizedTf = (double) tf / Math.max(1, docLength);
double idf = Math.log((double) (totalDocs + 1) / (df + 1)) + 1.0;
```

- **TF is normalized by document length**, or long documents win everything simply
  by containing more words.
- **IDF is smoothed** (`+1` on both numerator and denominator, `+1.0` on the result).
  The `df + 1` avoids division by zero; the trailing `+1.0` keeps IDF positive so a
  term appearing in *every* document contributes a small positive amount rather than
  zero or negative. Without it, `log(N/N) = 0` silently erases a term from scoring.
- `Math.max(1, docLength)` guards the empty document.

Verified behaviourally rather than by inspection — searching `rust programming`
across three documents ranks the one containing the rare term first (0.731), above
documents matching only the common term (0.200, 0.143).

### 7.5 A query needs one consistent snapshot

Every `InMemoryInvertedIndex` method was `synchronized`, but `search` was not — and
a query is a *composite* of many index calls: `lookup` per term, then `getDocument`
and `getTermFrequencies` per candidate. There was no data race, but a concurrent
`removeDocument` could retire a document between it being chosen as a candidate and
being scored, and `getDocumentCount()` could change mid-ranking so that IDFs
computed early and late in the same query used different values of N.

`search` is now `synchronized`, and `rankingStrategy` is `volatile` with a
synchronized setter since it's swappable at runtime.

**Per-method synchronization does not compose.** Making every method atomic
individually says nothing about a sequence of them — a distinction worth being
explicit about, because "all my methods are synchronized" is a very common
misreading of what thread-safe means.

---

## 8. Likely Follow-ups (with concise answers)

- **BM25 instead of TF-IDF?** Same inputs (tf, df, N, doc length), different formula
  — a saturating TF term (`k1`) and length normalization against the *average*
  document (`b`). It's a new `RankingStrategy` and nothing else changes, which is a
  good demonstration that the seam is in the right place.
- **AND queries / phrase search?** AND is an intersection of posting lists instead
  of a union — intersect smallest-first. Phrases need **positional** postings
  (`term → docId → [positions]`), then verify adjacency.
- **Top-k without sorting everything?** Currently every matching document is scored
  and sorted. A bounded min-heap of size `offset + limit` is O(n log k). Real engines
  go further with WAND / block-max to skip documents that cannot enter the top-k.
- **Pagination stability?** Offset pagination re-scores everything and shifts if the
  index changes between pages. Real systems use a search-after cursor on
  `(score, docId)`.
- **Scaling out?** Shard by document, scatter-gather, merge top-k. The catch worth
  raising: **IDF is corpus-global**, so each shard computing its own IDF gives
  inconsistent scores — hence a periodically broadcast global df, or accepting the
  approximation.
- **Concurrency at read scale?** `ReadWriteLock`, or a copy-on-write index swapped
  atomically — search is read-dominated and shouldn't serialize behind indexing.
- **Stemming, stopwords, synonyms?** Decorators over the single tokenizer from §7.3.
  Stopwords especially interact with IDF: a term in every document already scores
  near-nothing, so removing them is a performance optimization more than a relevance
  one.
- **How would you test it?** The two harnesses used here: assert the rare term
  outranks the common one (relevance), and time a single-term query across growing
  corpus sizes to catch a re-introduction of the quadratic behaviour.

---

## 9. Trade-offs

- **`docTermFreq` duplicating `postings`:** roughly doubles index memory to make
  deletion O(terms in doc) instead of O(vocabulary). Right trade for a mutable index;
  a write-once index wouldn't need it.
- **Defensive copies from `lookup`/`getTermFrequencies`:** callers can't corrupt the
  index, at the cost of allocation per call — and §7.2 is the cautionary tale about
  what that costs when called in the wrong place. Returning unmodifiable views would
  keep the safety without the copy.
- **Scoring every match then sorting:** simple and exact, O(n log n) in matches.
  A heap or WAND is the answer at scale, at the cost of complexity.
- **`synchronized` on the whole query:** correct and simple; serializes searches
  against each other, which is the wrong shape for a read-dominated workload (§8).
- **TF-IDF over BM25:** the teaching choice — easier to derive at a whiteboard, and
  every term of it is explicable. BM25 is strictly better in practice.
- **Bag-of-words:** no phrases, no positions, no highlighting. Positional postings
  cost significantly more memory, so it's the right default for the exercise and the
  first thing to add for a real one.
