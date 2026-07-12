# Subagent — RAG End-to-End AI Cheatsheet (handoff)

## HTML file created (1)

- `/Users/likhith.r/lld-playbook/docs/cheatsheets/ai/systems/rag-end-to-end.html` — RAG End-to-End: full pipeline (ingest → chunk → embed → index → retrieve → rerank → generate), core concepts table, API design, estimation (1M docs / 10K QPS), architecture + ASCII flow, 5 deep dives (chunking, hybrid retrieval, reranking, citations/grounding, eval metrics), production/ops, cross-links, pitfalls, 12 Q&A entries.

## PNG files created (3) in `ai/systems/img/`

- `rag-end-to-end-main.png` — Dense end-to-end architecture: offline ingest + online query path with numbered steps and latency callouts.
- `rag-end-to-end-retrieval-zoom.png` — Query-time hot path: rewrite → parallel dense ANN + BM25 → RRF → cross-encoder rerank → context assembly → citation-aware generation.
- `rag-end-to-end-ingest-zoom.png` — Offline ingest: sources → Kafka → parse → chunk → embed workers → dual-write vector + sparse indexes.

Source images at `/Users/likhith.r/.cursor/projects/Users-likhith-r-lld-playbook/assets/`; copied to `docs/cheatsheets/ai/systems/img/`.

## Structure notes

- Follows `AI_TEMPLATE.md` Variant AI skeleton: 01 What & Why → 01a Core Concepts → 01b API → 02 When to Use → 03 Architecture → 03a Estimation → 04–08 Deep Dives → 09 Production → 10 Where It Shows Up → 11 Pitfalls → 12 Q&A (12 entries).
- CSS derived from `hld/uber.html` with purple AI accent `--accent: #a855f7` and matching tag/hover/blockquote rgba values.
- Lightbox snippet (style + `#lightbox` div + IIFE) copied verbatim from `job-scheduler.html` before `</body>`.
- Cross-links (relative):
  - `../../hld/web-search-engine.html`
  - `../tech/vector-databases.html`
  - `../fundamentals/embeddings-semantic-search.html`

## Not done / out of scope

- Did NOT touch any `index.html` (per instructions).
- Did NOT commit to git (per instructions).
