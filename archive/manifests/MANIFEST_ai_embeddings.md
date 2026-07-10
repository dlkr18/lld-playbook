# AI Embeddings & Semantic Search Cheatsheet (handoff)

## HTML file created (1)

- `/Users/likhith.r/lld-playbook/docs/cheatsheets/ai/fundamentals/embeddings-semantic-search.html` — Embeddings & Semantic Search: dense vectors, cosine similarity, L2 normalization, bi-encoders vs cross-encoders, embedding model selection (OpenAI/Cohere/BGE), semantic search pipeline, production ops, 12 interview Q&A.

## PNG files created (3) in `ai/fundamentals/img/`

- `embeddings-semantic-search-main.png` — End-to-end semantic search pipeline (ingest → embed → vector DB → ANN → rerank).
- `embeddings-model-zoom.png` — Bi-encoder vs cross-encoder comparison + model selection table (OpenAI/Cohere/BGE).
- `embeddings-search-zoom.png` — Query-path zoom: preprocess → embed → normalize → ANN with filters → rerank → results.

Source images at `/Users/likhith.r/.cursor/projects/Users-likhith-r-lld-playbook/assets/`; copied via `cp` to `docs/cheatsheets/ai/fundamentals/img/`.

## Structure notes

- Follows Variant AI skeleton from `AI_TEMPLATE.md`: 01 What & Why → 01a Core Concepts → 01b API Surface → 02 When to Use → 03 Architecture → 04–08 Deep Dives → 09 Production & Ops → 10 Where It Shows Up → 11 Pitfalls → 12 Q&A (12 entries; final answer is SDE3 system-design).
- CSS `<style>` block copied from `hld/uber.html` with purple accent `--accent: #a855f7` and matching tag/hover/blockquote rgba values.
- Lightbox snippet (style + `#lightbox` div + IIFE) copied verbatim from `job-scheduler.html` before `</body>`.
- Cross-links: `../tech/vector-databases.html`, `../systems/rag-end-to-end.html`, plus related tech/systems sheets and one HLD link.

## Topics covered

| Topic | Section |
|---|---|
| Dense vectors | §04 |
| Cosine similarity | §05 |
| L2 normalization | §05 |
| Bi-encoders vs cross-encoders | §06 |
| Model selection (OpenAI/Cohere/BGE) | §07 |
| Semantic search pipeline | §08 |
| Hybrid search / RRF | §08 |
| Production ops (re-embed, monitoring) | §09 |

## Not done / out of scope

- Did NOT touch any `index.html` (per instructions).
- Did NOT commit to git (per instructions).
