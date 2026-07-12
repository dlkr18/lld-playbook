# Subagent — Vector Databases (Overview) AI Tech Cheatsheet

## HTML file created

- `/Users/likhith.r/lld-playbook/docs/cheatsheets/ai/tech/vector-databases.html` — **Vector Databases (Overview)** per `AI_TEMPLATE.md` Variant AI skeleton.

## Diagrams generated

| File | Location | Purpose |
|------|----------|---------|
| `vector-databases-main.png` | `docs/cheatsheets/ai/tech/img/` | RAG retrieval stack (embed → index → query → filter → hybrid → rerank → LLM) |
| `vector-databases-hnsw-zoom.png` | `docs/cheatsheets/ai/tech/img/` | HNSW layered graph search path + M/ef_search callouts |
| `vector-databases-compare-zoom.png` | `docs/cheatsheets/ai/tech/img/` | Pinecone vs pgvector vs Weaviate vs Chroma decision columns |

## Section checklist

| # | Section | Status |
|---|---------|--------|
| 01 | What & Why | ✅ |
| 01a | Core Concepts (vocabulary table) | ✅ |
| 01b | API / Interface Surface (upsert, query, pgvector SQL) | ✅ |
| 02 | When to Use / When NOT | ✅ |
| 03 | Architecture (flow + ASCII) | ✅ |
| 04 | HNSW deep dive + zoom diagram | ✅ |
| 05 | IVF / IVFFlat | ✅ |
| 06 | Metadata filtering (pre vs post) | ✅ |
| 07 | Hybrid search overview | ✅ |
| 08 | Comparison table + when to pick + zoom diagram | ✅ |
| 09 | Production & Ops | ✅ |
| 10 | Where It Shows Up | ✅ |
| 11 | Common Pitfalls | ✅ |
| 12 | Interview Q&A (12 `<details>`) | ✅ |

## Cross-links included

- Tech: `pinecone.html`, `pgvector.html`, `weaviate.html`, `chroma.html`, `embedding-models.html`, `rerankers.html`
- Fundamentals: `../fundamentals/embeddings-semantic-search.html`
- Systems: `../systems/rag-end-to-end.html`, `../systems/chunking-strategies.html`, `../systems/hybrid-search.html` (stub when published)
- HLD: `../../hld/web-search-engine.html`

## Hero tags

HNSW · IVF · Metadata Filter · Hybrid Search · ANN Recall

## Conventions followed

- `--accent: #a855f7` (AI vertical purple)
- Inline `<style>` + lightbox copied from `job-scheduler.html`
- Python 3.10+ snippets in `<pre><code>`
- `AI_TEMPLATE.md` master skeleton (01 → deep dives → production → where → pitfalls → Q&A)

## Not done / out of scope

- Did NOT edit `tech/index.html` or AI master index (per instructions)
- Did NOT commit or push
- Did NOT touch Java source
