# Bloom Filter — SDE2/SDE3 Interview Walkthrough

A full 70–100 minute walkthrough: clarify → requirements → entities →
relationships → patterns (with rationale) → key implementations → follow-ups →
trade-offs.

> Unusually for this playbook, the **logic here was already correct** — the FP
> rate hits its target, there are no false negatives, and the locking is sound.
> The defect was honesty: a class called `MurmurHashStrategy` that wasn't
> MurmurHash, and it was measurably the weaker for it (§7.2).

---

## 1. Clarifying Questions (first 5 minutes)

1. **What's the filter protecting?** The classic use is skipping an expensive
   lookup — a disk seek, an S3 GET, a DB query. That framing sets the whole
   cost model: a false positive costs one wasted lookup, a false negative costs
   *correctness*.
2. **So which error is acceptable?** False positives yes, false negatives never.
   That asymmetry is the entire design, and it's why there's no `remove()`.
3. **How many elements, and what FP rate?** Both are inputs — `m` and `k` are
   *derived* from them, not guessed.
4. **Do we need deletion?** If yes, this is the wrong structure — you need a
   counting bloom filter. Worth saying before writing code.
5. **Do we need to know how many distinct items are in it?** Bloom filters can't
   tell you; that's HyperLogLog. Adjacent structure, different question.
6. **Concurrency?** Assume many readers plus writers.
7. **Must hashes match another system?** If the filter is ever serialized and read
   by a different language, the hash must be byte-defined — this matters and is
   easy to miss (§7.2).

---

## 2. Functional Requirements

- Construct from `(expectedElements n, falsePositiveRate p)`, deriving `m` and `k`.
- `add(element)`, `mightContain(element)`, `clear()`.
- Report `m`, `k`, element count, and an estimated current FP rate.
- Pluggable hash function.

## 3. Non-Functional Requirements

- **Never a false negative** — the one hard guarantee.
- Measured FP rate must actually meet the configured target.
- `add`/`mightContain` in **O(k)** time, **O(m) bits** of space, independent of
  element size.
- Thread-safe for concurrent readers and writers.
- Hash must be uniform and well-avalanched, or the FP rate silently degrades.

---

## 4. Core Entities

| Entity | Layer | Internal summary |
|--------|-------|------------------|
| `BloomFilterConfig` | model | Takes `(n, p)`, computes `m = -n·ln p / (ln 2)²` and `k = (m/n)·ln 2`. Validates `n > 0` and `p ∈ (0,1)`. The maths lives here and nowhere else. |
| `HashStrategy` | service (interface) | `int hash(String element, int seed, int bitArraySize)` — one method, so a lambda is a valid implementation. |
| `MurmurHashStrategy` | service/impl | MurmurHash3 x86_32 mixing over UTF-16 code units. |
| `FnvHashStrategy` | service/impl | Genuine FNV-1a (offset basis `2166136261`, prime `16777619`, xor-then-multiply). |
| `BitArrayBloomFilter` | service/impl | `BitSet` + `k` + the add/query loops. All access `synchronized`. |
| `BloomFilter` | root | Facade with static factories and `murmur()` / `fnv()` helpers. |

---

## 5. Relationships

- `BloomFilter` **wraps** a `BitArrayBloomFilter`, which **has-a** `HashStrategy`
  and a `BloomFilterConfig`-derived `m`/`k`.
- **`BloomFilterConfig` is the only place the sizing formulas appear**, so `m` and
  `k` can't drift out of agreement with the requested `p`.
- The k bit positions come from **seeding one hash function k times**, not from
  double hashing — see §7.3.
- Nothing stores the elements. That's the point: space is `O(m)` bits regardless of
  how large the inserted strings are.

---

## 6. Design Patterns (name + why vs alternatives)

- **Strategy — `HashStrategy`.** Hash choice is a genuine axis of variation (speed
  vs distribution vs cross-system compatibility), and making it pluggable is what
  let me *measure* the old implementation against the new one in §7.2. A
  single-method interface, so implementations can be lambdas.
- **Facade — `BloomFilter`.** Hides the config/bitset/strategy assembly behind
  `BloomFilter.create(n, p)`.
- **Derived configuration — `BloomFilterConfig`.** `m` and `k` are computed, never
  passed in. *Alternative:* let callers supply `m` and `k` directly — rejected as
  the default, because the whole value proposition is "tell me your error budget
  and I'll size it". (A power-user constructor is a reasonable follow-up.)
- *(Considered, rejected)* **Decorator for thread-safety**, à la the `lrucache`
  problem's `ConcurrentCache`. Here the critical sections are two tiny loops and
  every method needs the lock, so a wrapper would add a layer without removing a
  decision.
- *(Considered, rejected)* **Template Method** for the hash functions: FNV and
  Murmur share no meaningful skeleton beyond "loop over chars", and forcing one
  would obscure both.

---

## 7. Key Implementation Details

### 7.1 The maths, and why it's in one place

```java
private static int optimalBitArraySize(int n, double p) {
    double m = (-n * Math.log(p)) / (Math.log(2) * Math.log(2));   // m = -n ln p / (ln2)^2
    return Math.max(1, (int) Math.ceil(m));
}
private static int optimalHashFunctionCount(int m, int n) {
    double k = ((double) m / n) * Math.log(2);                      // k = (m/n) ln 2
    return Math.max(1, (int) Math.round(k));
}
```

Both are worth being able to derive at a whiteboard, and the intuition matters more
than the algebra: **`k` trades two opposing effects.** More hash functions make a
false positive require more coincidences — but they also set more bits per insert,
filling the array faster. The optimum is where the array ends up half full, which
is exactly `k = (m/n) ln 2`.

Verified against the target rather than asserted — 10,000 elements, 200,000 probes
for non-members:

| target | measured (Murmur) | measured (FNV) | m | k |
|---|---|---|---|---|
| 0.010 | 0.00988 | 0.01065 | 95,851 | 7 |
| 0.001 | 0.00102 | 0.00096 | 143,776 | 10 |

And the guarantee that actually matters: **0 false negatives** across 5,000
round-trips.

### 7.2 The hash function was lying (the headline)

`MurmurHashStrategy` computed:

```java
int hash = seed;
for (int i = 0; i < element.length(); i++) {
    hash = 31 * hash + element.charAt(i);
    hash ^= (hash >>> 16);
}
```

That is Java's `String.hashCode` with an xor-shift bolted on — **not MurmurHash by
any definition**. The filter still worked, which is exactly why this kind of defect
survives: nothing fails, the quality just quietly degrades.

Replaced with MurmurHash3's real x86_32 mixing (rotate/multiply body constants
`0xcc9e2d51`/`0x1b873593`, plus the standard avalanche finalizer). Measured
side by side:

| | avalanche (1 input bit flipped → % output bits changed) | χ² uniformity over 1000 buckets |
|---|---|---|
| old `31x + xor-shift` | **34.1%** — weak | χ²=686, **z = −7.0** — non-uniform |
| MurmurHash3 (now) | **50.1%** — ideal | χ²=998, z = −0.03 — uniform |
| FNV-1a | 46.1% | χ²=1029, z = +0.68 |

Ideal avalanche is 50%: one input bit flipped should flip each output bit with
probability ½. At 34% the old function left input structure visible in the output,
and the χ² z-score of −7 says the bucket distribution had detectable structure. The
end-to-end effect was small but real — the 1% filter measured 0.0108 before and
0.0099 after.

**The honesty point I'd make in an interview:** naming a class after an algorithm it
doesn't implement is worse than using a simple hash and saying so. The first
question any interviewer asks about `MurmurHashStrategy` is "walk me through
MurmurHash", and the answer would have been "it isn't one".

One caveat I documented rather than glossed: this consumes UTF-16 `char`s two at a
time, so it is **not byte-compatible with reference MurmurHash3** over UTF-8. For a
self-contained filter that's irrelevant, but it would break the moment the filter's
bits are shared with another system — so it's stated in the class doc.

### 7.3 k positions: seeded hashing, not double hashing

The class doc claimed "k independent hash positions via **double hashing**". It
isn't — double hashing is `h(i) = h1 + i·h2`, computing two hashes and combining
them. This calls one hash function with k different seeds.

Both are standard and both are fine; the doc was simply describing different code.
I fixed the comment rather than the code, because seeded hashing keeps
`HashStrategy` a single-method interface, and measured seed independence to
confirm it's sound: across k=7 seeds, the duplicate-position rate is **0.0000%**
for Murmur.

Worth knowing the trade: double hashing computes 2 hashes instead of k, so it's
faster for large k — the Kirsch–Mitzenmacher result showing this costs no
asymptotic accuracy is the thing to cite if asked.

### 7.4 Why there is no `remove()`

A bit set by "apple" is very likely also set by some other key. Clearing it on
delete would make that other key report absent — a **false negative**, breaking the
only guarantee the structure offers. This is now stated in the class doc, because
"why can't I delete" is the single most common bloom filter interview question.

The answer if deletion is required: a **counting bloom filter**, replacing each bit
with a small counter (typically 4 bits) that increments on add and decrements on
remove. Costs 4× the space and reintroduces counter-overflow as a concern.

### 7.5 Thread-safety, including the reads

`add`, `mightContain` and `clear` were `synchronized`; `getElementCount()` and
`estimatedFalsePositiveRate()` were not. Both touch state that writers mutate —
`elementCount` is a plain `int`, and `estimatedFalsePositiveRate()` calls
`bits.cardinality()` while another thread may be inside `bits.set()`. `BitSet` is
explicitly not thread-safe, so that reader isn't merely stale, it can observe a
torn array mid-resize. Both are now `synchronized`.

The general rule worth stating: **synchronizing only the mutators is a half-fix.**
A lock has to be held by *every* access to the guarded state, readers included, or
it guarantees nothing.

### 7.6 `positiveMod`, not `Math.abs`

```java
static int positiveMod(int hash, int size) {
    int mod = hash % size;
    return mod < 0 ? mod + size : mod;
}
```

Java's `%` keeps the sign of the dividend, so a negative hash yields a negative
index and an `IndexOutOfBoundsException`. The tempting fix, `Math.abs(hash) % size`,
is subtly wrong: `Math.abs(Integer.MIN_VALUE)` is *still negative* (two's complement
has no positive counterpart), so it fails for exactly one input in 2³² — the kind of
bug that surfaces once a month in production. This codebase gets it right, and it's
worth pointing at deliberately.

---

## 8. Likely Follow-ups (with concise answers)

- **What if you exceed `n`?** The FP rate degrades smoothly past the target — it
  doesn't break, it just gets noisier. `estimatedFalsePositiveRate()` reports the
  *observed* fill, so you can alarm on it. The fix is a **scalable bloom filter**:
  chain progressively larger filters, query all, insert into the newest.
- **Why the empirical FP estimate over the formula?** `(bitsSet/m)^k` reflects what
  the filter actually holds. Feed the same key a million times and the a-priori
  `(1 - e^(-kn/m))^k` predicts saturation while the array is nearly empty; the
  empirical form tells the truth.
- **Distributed / shared filter?** The bit array is a commutative, idempotent CRDT
  under OR — two replicas merge by bitwise OR with no coordination. That's a strong
  answer and it falls out of never clearing bits.
- **Counting distinct elements?** Wrong structure — HyperLogLog. Bloom answers
  membership, not cardinality.
- **Persisting it?** Serialize the bit array plus `(m, k, hash id)`. The hash
  identity must be part of the format, which is precisely why §7.2's UTF-16 caveat
  matters.
- **Cache the k hashes?** For `mightContain` on a hot key, yes — but the k
  positions are cheap and the real cost is the memory random-access pattern.
  Blocked bloom filters keep all k bits within one cache line and are much faster
  in practice.
- **Better modern alternatives?** **Cuckoo filters** and **XOR filters**: similar
  space, and cuckoo supports deletion. Naming them shows awareness that the bloom
  filter is the 1970 answer, not the current one.
- **How would you test it?** Exactly the harnesses used here: assert zero false
  negatives over the inserted set (the guarantee), assert the measured FP rate is
  within tolerance of the target (the contract), and χ²/avalanche on the hash (the
  thing that silently degrades both).

---

## 9. Trade-offs

- **Space vs accuracy:** the entire dial. `m = -n ln p / (ln 2)²` — a 1% filter costs
  ~9.6 bits per element, 0.1% costs ~14.4, regardless of how big the elements are.
  Storing 10,000 URLs exactly would take megabytes; this takes 12 KB.
- **No deletion:** the price of the "no false negatives" guarantee. Counting bloom
  filters buy it back for 4× space.
- **`synchronized` on everything:** correct and trivial to reason about, but it
  serializes readers against each other when reads dominate. A `ReadWriteLock`, or
  striping the `BitSet` into segments with per-segment locks, would scale better —
  and an atomic `long[]` with CAS would let `add` be lock-free entirely, since
  setting bits is idempotent and commutative.
- **Seeded hashing over double hashing:** keeps `HashStrategy` one method, at k
  hash computations instead of 2. For large k, double hashing wins.
- **UTF-16 hashing:** fast (no encoding step) and fine in-process; not portable
  across systems. Documented rather than silently accepted.
- **Empirical FP estimate:** honest about the filter's real state, but it costs an
  `O(m)` `cardinality()` scan — fine for reporting, not for a hot path.
