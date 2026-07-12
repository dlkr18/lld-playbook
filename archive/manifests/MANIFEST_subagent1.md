# Subagent 1 — Variant C Concept Primers (handoff)

## HTML files created (5)

- `/Users/likhith.r/lld-playbook/docs/cheatsheets/concepts/sharding-partitioning.html` — Sharding & Partitioning: hash/range/directory/consistent-hash/geo, partition-key picking, hot keys, online resharding (dual-write + backfill), cross-shard queries, co-location.
- `/Users/likhith.r/lld-playbook/docs/cheatsheets/concepts/replication.html` — Replication Strategies: single-leader / multi-leader / leaderless, sync vs async vs semi-sync, failover + split-brain + fencing tokens, replication lag anomalies, W+R>N quorums, LWW/vector-clocks/CRDTs, cross-region patterns.
- `/Users/likhith.r/lld-playbook/docs/cheatsheets/concepts/caching.html` — Caching Patterns: cache-aside / read-through / write-through / write-behind / refresh-ahead, invalidation strategies + the classic race, stampede + thundering herd, penetration / breakdown / avalanche, multi-tier hierarchy, hot-key isolation.
- `/Users/likhith.r/lld-playbook/docs/cheatsheets/concepts/cap-pacelc.html` — CAP & PACELC: AP/CP/CA, 2-of-3 myth, PACELC quadrants, classification of ~14 real systems, tunable consistency (Cassandra/Dynamo/Mongo), mapping to consistency models.
- `/Users/likhith.r/lld-playbook/docs/cheatsheets/concepts/consistency-models.html` — Consistency Models: full ladder (strict-serializable → linearizable → sequential → serializable → SI → causal → session guarantees → eventual), linearizable-vs-serializable trap, causal via vector clocks, SQL isolation mapping, implementation per level.

## PNG files created (5) in `concepts/img/`

- `sharding-partitioning-main.png` — 4 sharding approaches side by side with example keys.
- `replication-main.png` — 3 topologies (single-leader / multi-leader / leaderless) with write/read arrows.
- `caching-main.png` — 4 sequence diagrams (cache-aside, read-through, write-through, write-behind).
- `cap-pacelc-main.png` — PACELC decision tree + 2x2 grid plotting 8 real systems.
- `consistency-models-main.png` — Consistency ladder staircase from linearizable to eventual.

All images also exist at `/Users/likhith.r/.cursor/projects/Users-likhith-r-lld-playbook/assets/` (source) and were copied via `cp`.

## Structure notes

- Each file follows the Variant C skeleton from `HLD_TEMPLATE.md §11`: 01 Problem → 01a Vocabulary → 02 Approaches → 03 Diagrams → 04+ Deep Dives → N-2 Where It Shows Up → N-1 Probes → N Q&A (10–12 entries with SDE2-vs-SDE3 row as the final answer).
- CSS `<style>` block copied verbatim from `consistent-hashing.html` line 10.
- Lightbox snippet (style + `#lightbox` div + IIFE) copied verbatim from `job-scheduler.html` before `</body>`.
- All "Where It Shows Up" sections use plain relative links like `<a href="../hld/uber.html">`, `<a href="../tech/kafka.html">`, `<a href="consistency-models.html">` to enable cross-linking.

## Not done / out of scope

- Did NOT touch any index.html (per instructions).
- Did NOT commit to git (per instructions).
- Did NOT generate the optional zoom-in diagrams — each file has the single main diagram only, as specified in the brief.
- All 5 topics completed end-to-end. Nothing skipped.
