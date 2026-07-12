# INTERVIEW.md — Query DSL / Database Query Abstraction API

Full SDE2/SDE3 machine-coding walkthrough for: **"Write a database queries abstraction API/DSL.
Write request/response schema for the API."**

---

## 0. How to read the question (say this early)

Two deliverables hide in one sentence:

1. **A DSL/library** — a fluent, backend-neutral way to *construct* queries → an immutable **AST**.
2. **A service contract** — the JSON **request/response schema** if this is exposed over the wire.

The unlock: **the JSON filter schema and the in-memory AST are the same recursive shape** (a
Composite tree). Design the AST well and the API schema falls out of it — one design, two
representations.

## 1. Clarifying questions (2–3 minutes, ask before designing)

| Question | Why it matters | Assumed answer |
|---|---|---|
| Read-only queries, or writes too? | Writes change the shape entirely (Command pattern, transactions) | **Reads only**; writes are a follow-up |
| Which capabilities: filter/project/sort/paginate? Aggregations? Joins? | Scope control — joins alone can eat the hour | **Filter+project+sort+page** in v1; aggregations designed-for, joins descoped |
| One backend or pluggable? | "Abstraction" in the title suggests pluggable — confirms the Strategy seam | **Pluggable** (SQL + in-memory reference) |
| Type-safe fields (`Field<T>`) or string field names + schema validation? | Compile-time safety vs API-usable simplicity | **Strings + schema-aware validation** (the API deliverable forces strings anyway) |
| Who calls it — internal services over HTTP? | Confirms error-as-response (not exceptions), limits, versioning | **Internal service API** |

## 2. Requirements

**Functional (v1):**
- Build a query: source, projection, filter tree (AND/OR/NOT over field-op-value leaves),
  multi-key sort, pagination.
- Operators: EQ, NEQ, GT/GTE/LT/LTE, IN/NOT_IN, CONTAINS, STARTS_WITH, BETWEEN, IS_NULL/IS_NOT_NULL.
- Translate the same query to ≥2 backends; execute one end-to-end (in-memory reference).
- Validate: operator arity, unknown source/fields, operator/type compatibility.
- Wire API: request/response envelopes with machine-readable errors.

**Non-functional:**
- **Injection-safe** SQL generation (the #1 probe for this problem).
- **Extensible**: new operator or new backend without touching existing code (Open/Closed).
- **Thread-safe by construction**: immutable queries, stateless executors.
- **Abuse-resistant**: page-size cap, optional totalCount (COUNT can be expensive), timeout budget.

## 3. Core entities

| Class | Layer | What it does internally |
|---|---|---|
| `Condition` | model | Composite interface; single method `accept(visitor)` |
| `Comparison` | model | Leaf: field + `Operator` + values; **arity validated in constructor** |
| `LogicalCondition` / `NotCondition` | model | AND/OR children / negation |
| `Operator` | model | Enum carrying min/max operand counts → arity checked once, centrally |
| `Criteria` | model | Static factories — the vocabulary users type (`eq`, `in`, `and`, …) |
| `Query` + `Builder` | model | Immutable aggregate: source/select/where/sorts/page; fluent builder |
| `Page`, `SortSpec` | model | Offset+limit with `MAX_LIMIT` cap; field+direction |
| `TableSchema` | model | Field→type map for semantic validation |
| `QueryRequest/Response`, `QueryError`, `ExecutionStats` | api | The wire envelopes; errors are a LIST (report everything at once) |
| `ConditionVisitor<T>` | service | Visitor over the AST — one impl per backend concern |
| `QueryTranslator<T>` / `QueryService` | service | Strategy seams: translate vs execute |
| `SqlTranslator` → `SqlStatement` | impl | AST → `SELECT … WHERE … ?` + ordered bind list; identifier whitelist |
| `MongoTranslator` | impl | AST → Mongo find command; exists to prove Open/Closed |
| `PredicateBuilder` | impl | AST → `Predicate<Map<String,Object>>` (Interpreter role) |
| `QueryValidator` | impl | Schema-aware walk collecting ALL errors |
| `InMemoryQueryService` | impl | filter → sort → count → paginate → project; `ConcurrentHashMap` registry |
| `QueryEngine` | root | Facade: register / execute / toSql / toMongo |

## 4. Patterns — and why over alternatives

- **Composite** (`Condition`): filters are recursive by nature. *Alternative rejected:* a flat
  list of conditions AND-ed together — cannot express `(A OR B) AND C`.
- **Builder + static factories** (`Query.Builder`, `Criteria`): fluent construction of an
  immutable object with optional parts. Bonus: `between(f, lo, hi)`'s signature makes
  wrong-arity BETWEEN *unrepresentable* in the fluent path.
- **Visitor** (`ConditionVisitor<T>`): the crux. *Alternatives rejected:*
  - `toSql()` on each node → model coupled to every backend forever; adding Elasticsearch means
    editing every node class.
  - `instanceof` chains in each backend → no compile-time exhaustiveness; adding `NotCondition`
    silently breaks backends. With Visitor, a new node type **fails compilation** in every
    visitor until handled — the compiler finds every impact site.
- **Strategy** (`QueryTranslator`, `QueryService`): backends vary independently of the AST.
- **Interpreter** (`PredicateBuilder`): the in-memory backend *is* the textbook Interpreter —
  name it; interviewers reward knowing that this whole problem is the Interpreter pattern's
  canonical use case.

## 5. Request/response schema (write this on the board)

Request `POST /api/v1/query`:

```json
{
  "requestId": "req-7f3a",
  "source": "deployments",
  "select": ["id", "service", "durationMs"],
  "filter": {
    "and": [
      { "field": "status", "op": "EQ", "value": "FAILED" },
      { "or": [
          { "field": "env", "op": "IN", "values": ["prod", "staging"] },
          { "field": "durationMs", "op": "GT", "value": 30000 }
      ]}
    ]
  },
  "sort": [ { "field": "durationMs", "direction": "DESC" } ],
  "page": { "limit": 20, "offset": 0 },
  "options": { "timeoutMs": 5000, "includeTotalCount": true }
}
```

Response (success / failure):

```json
{ "requestId": "req-7f3a", "status": "SUCCESS",
  "data": { "rows": [ … ], "returnedCount": 20, "totalCount": 133, "hasMore": true },
  "stats": { "rowsScanned": 1200, "elapsedMicros": 2107 } }

{ "requestId": "req-7f3a", "status": "INVALID_QUERY",
  "errors": [ { "code": "UNKNOWN_FIELD", "message": "…", "field": "regoin" } ] }
```

**Schema decisions to narrate:**
- `filter` is **recursive** — a node is either `{field, op, value|values}` or `{and|or|not: …}`.
  It deserializes into the Condition AST by direct recursive descent.
- `value` vs `values`: mirrors operator arity; the server re-validates (never trust the client).
- `requestId`: correlation for logs/tracing/idempotent retries.
- `totalCount` optional: COUNT(*) can cost more than the query — caller opts in.
- Errors: **list** of machine-readable codes with the offending `field` — a UI can highlight the
  exact input; all problems reported in one round-trip.
- Versioning: `/api/v1/` path; additive evolution (new optional fields, new operators) is
  backward-compatible; unknown request fields → reject (fail loud, not silent).
- Pagination: offset in v1; **cursor** is the scale answer (see follow-ups).

## 6. Key implementation details (the 3 an interviewer probes)

**a) Injection defense — two different mechanisms, know the difference:**
- **Values** → bind parameters. The visitor emits `?` and appends the value to an ordered list;
  the malicious classic `x' OR '1'='1` becomes a harmless bind value.
- **Identifiers** (table/field names) → *cannot* be parameterized in SQL, so they're validated
  against a whitelist pattern `[A-Za-z_][A-Za-z0-9_]*` and rejected otherwise.

**b) Two-layer validation:**
- Syntactic (arity, page bounds) → constructor, fail fast: `new Comparison(f, BETWEEN, [5])`
  throws before a request even exists.
- Semantic (unknown field, CONTAINS on a NUMBER) → needs the schema → execution time, collected
  by a validation *visitor*, ALL errors returned together.

**c) In-memory evaluation semantics (state them, don't leave them implicit):**
- Comparison against missing/null field is **false** (SQL-like), except IS_NULL.
- Numeric equality is cross-type (`Integer 5 == Long 5` via `doubleValue()`).
- BETWEEN inclusive both ends; CONTAINS case-sensitive.
- Execution pipeline order matters: filter → sort → **count** → paginate → project
  (count before pagination, projection last so sorting can use unprojected fields).

## 7. Likely follow-ups + answers

- **"Add aggregations (GROUP BY / COUNT / SUM)?"** — Add `groupBy: [fields]` and
  `aggregates: [{fn, field, alias}]` to Query + schema. In-memory: group phase between filter
  and sort; SQL: render `GROUP BY`/aggregate functions. Response rows become group rows. The
  AST/visitor structure is unchanged — it slots in as new Query fields.
- **"Joins?"** — Explicitly descope: joins turn the DSL into a full query language (aliasing,
  join graphs, ambiguity). Offer alternatives: denormalized views registered as sources, or a
  `lookup` stage à la Mongo. Knowing *why not* is the senior answer.
- **"New backend, e.g. Elasticsearch?"** — One new `ConditionVisitor` mapping leaves to term/
  range queries and AND/OR to bool must/should. Zero model changes — `MongoTranslator` is the
  existence proof (~100 lines).
- **"Cursor pagination?"** — Offset skips N rows every page (O(offset)) and drifts under
  concurrent writes. Cursor = opaque token encoding last-seen sort-key values; `WHERE (sortKey,
  id) > (cursor…)` — stable and O(page). Response returns `nextCursor` instead of `hasMore`.
- **"Query cost / abuse control?"** — Already: page cap + optional COUNT. Next: max predicate
  depth/leaf count (reject pathological trees), per-caller rate limits, timeout budget
  (`timeoutMs`) enforced with a bounded executor.
- **"Caching?"** — Immutable Query + deterministic rendering ⇒ the rendered form is a natural
  cache key. Invalidation per-source on write. (Immutability payoff #3.)
- **"Writes?"** — Separate Command hierarchy (`InsertCommand`, `UpdateCommand` reusing the same
  Condition AST for `WHERE`), never bolted onto Query — reads are cacheable/idempotent, writes
  aren't.
- **"Type-safe DSL?"** — `Field<T>` constants (`Fields.AGE.gt(30)`) give compile-time op/type
  checking for Java callers; keep the string form for the wire API. Trade-off: codegen/registry
  maintenance vs earlier error detection.

## 8. Trade-offs made deliberately

| Chose | Over | Because |
|---|---|---|
| String field names + runtime schema validation | `Field<T>` type-safe refs | the wire API needs strings anyway; one mechanism serves both |
| Visitor | polymorphic `toSql()` on nodes | model stays backend-free; compiler-checked exhaustiveness |
| Offset pagination v1 | cursor | 10-minute implementation vs correct-at-scale; named the upgrade path |
| Errors as response payload | exceptions across the API | wire callers can't catch Java exceptions; machine-readable codes |
| `Map<String,Object>` rows | typed row mapping | schema is dynamic by design; typing rows would fight the product |

## 9. 60-minute pacing (machine-coding)

| Time | Do |
|---|---|
| 0–5 | Clarify (§1), state assumptions aloud |
| 5–12 | Sketch AST + the two seams (`ConditionVisitor`, `QueryService`) as comments |
| 12–30 | model/: Operator (arity!), Condition tree, Criteria, Query+Builder |
| 30–45 | One backend end-to-end — **in-memory first** (it demos without a DB), then SqlTranslator |
| 45–55 | Demo main: build → execute → print; injection + validation scenarios |
| 55–60 | Sweep + narrate the request/response JSON (write it as a comment block if time is short) |

**If time collapses:** cut Mongo, cut CONTAINS/STARTS_WITH/BETWEEN (keep EQ/GT/IN), never cut
the runnable demo or the parameterized-SQL point.
