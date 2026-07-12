# Subagent 2 Manifest — Variant B Tech Deep-Dive Cheatsheets

Owner: Subagent 2
Date: 2026-05-20
Scope: 4 Variant B (tech deep-dive) cheatsheets + 8 hand-drawn whiteboard diagrams.

## HTML files created

| Path | Topic |
|---|---|
| `docs/cheatsheets/tech/kafka.html` | Kafka Deep Dive |
| `docs/cheatsheets/tech/redis.html` | Redis Deep Dive |
| `docs/cheatsheets/tech/postgres.html` | PostgreSQL Deep Dive |
| `docs/cheatsheets/tech/cassandra-dynamodb.html` | Cassandra / DynamoDB Deep Dive |

Each file:
- Uses Variant B structure (Identity → Core Concepts → API / Wire Surface → When To Use → Architecture → 4–8 Deep Dives → Operational → Usage Patterns → Alternatives → Interview Q&A).
- Copies the CSS `<style>` block, nav layout, and section/card/table/pre/blockquote/details patterns verbatim from `docs/cheatsheets/hld/distributed-message-queue.html`.
- Includes the diagram lightbox snippet (CSS + script) verbatim from `docs/cheatsheets/hld/job-scheduler.html` before `</body>`.
- 12 Q&A entries per file.
- Cross-links the "Usage patterns" section to existing Variant A cheatsheets via `<a href="../hld/*.html">`.

## Diagrams generated (PNG)

All generated via `GenerateImage` (hand-drawn whiteboard style), saved by the tool to `~/.cursor/projects/Users-likhith-r-lld-playbook/assets/` and then `cp`'d into `docs/cheatsheets/tech/img/`.

| Path | What it shows |
|---|---|
| `docs/cheatsheets/tech/img/kafka-architecture.png` | Full cluster: brokers, partitions, leader/follower, ISR, HW/LEO, KRaft controller quorum, producer + consumer group, segment files |
| `docs/cheatsheets/tech/img/kafka-exactly-once-zoom.png` | Idempotent producer + transactions + read_committed consumer; worked consume-transform-produce example |
| `docs/cheatsheets/tech/img/redis-architecture.png` | Single-threaded event loop, data structure menu, RDB+AOF persistence, Cluster ring with hash slots, Sentinel |
| `docs/cheatsheets/tech/img/redis-usecases-zoom.png` | Use-case map: Uber GEO, FB Live ZSET, rate limiter Lua, autocomplete, payment SETNX, notification pub/sub vs Streams, job scheduler HASH, LangCache vector |
| `docs/cheatsheets/tech/img/postgres-architecture.png` | Postmaster + backend processes, shared buffers, WAL writer, background workers, index family, replication paths |
| `docs/cheatsheets/tech/img/postgres-mvcc-zoom.png` | xmin/xmax visibility, tuple version chain, snapshot visibility rules, dead-tuple bloat, VACUUM, HOT update |
| `docs/cheatsheets/tech/img/cassandra-dynamodb-architecture.png` | P2P ring with vnodes, write/read paths (LSM), anti-entropy with Merkle trees, DynamoDB cousin panel |
| `docs/cheatsheets/tech/img/cassandra-consistency-zoom.png` | R+W>N matrix, worked QUORUM example with read repair, LOCAL_QUORUM, LWT cost |

## Skips / notes

- Did **not** touch any `index.html` (per instructions — separate task).
- Did **not** create the `tech/` or `tech/img/` directories — they already existed.
- Did **not** commit to git (per instructions).
- Lightbox + CSS snippets used verbatim from the reference files; if those reference files are updated later, the four new files will need a parallel update (or factor into a shared partial).
