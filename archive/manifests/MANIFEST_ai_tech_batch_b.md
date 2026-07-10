# AI Tech Batch B — Vector DB Deep Dives (Pinecone, Weaviate, pgvector, Chroma)

Completed mid-batch vector database cheatsheets to SDE3 quality (~500 lines each), matching `vector-databases.html` style with lightbox from `job-scheduler.html`.

## HTML files expanded

| File | Lines | Title |
|------|-------|-------|
| `docs/cheatsheets/ai/tech/pinecone.html` | ~500 | Pinecone — managed serverless vector DB |
| `docs/cheatsheets/ai/tech/weaviate.html` | ~500 | Weaviate — hybrid BM25+vector, GraphQL |
| `docs/cheatsheets/ai/tech/pgvector.html` | ~500 | pgvector — Postgres extension |
| `docs/cheatsheets/ai/tech/chroma.html` | ~500 | Chroma — embedded dev vector store |

## Diagrams generated (12 PNGs)

All under `docs/cheatsheets/ai/tech/img/`:

| Topic | main | zoom-1 | zoom-2 |
|-------|------|--------|--------|
| **pinecone** | `pinecone-main.png` | `pinecone-serverless-zoom.png` | `pinecone-metadata-zoom.png` |
| **weaviate** | `weaviate-main.png` | `weaviate-hybrid-zoom.png` | `weaviate-graphql-zoom.png` |
| **pgvector** | `pgvector-main.png` | `pgvector-hnsw-zoom.png` | `pgvector-sql-zoom.png` |
| **chroma** | `chroma-main.png` | `chroma-collections-zoom.png` | `chroma-embed-zoom.png` |

## Section checklist (all four sheets)

| # | Section | pinecone | weaviate | pgvector | chroma |
|---|---------|----------|----------|----------|--------|
| 01 | What & Why (functional + non-functional) | ✅ | ✅ | ✅ | ✅ |
| 01a | Core Concepts (vocabulary table) | ✅ | ✅ | ✅ | ✅ |
| 01b | API / Interface Surface (code samples) | ✅ | ✅ | ✅ | ✅ |
| 02 | When to Use / When NOT | ✅ | ✅ | ✅ | ✅ |
| 03 | Architecture (flow + ASCII) | ✅ | ✅ | ✅ | ✅ |
| 04 | Deep dive #1 + zoom diagram | Serverless | Hybrid | HNSW | Collections |
| 05 | Deep dive #2 + zoom diagram | Metadata | GraphQL | SQL | Embed fn |
| 06–08 | Topic-specific + compare / graduation | Hybrid, lifecycle, compare | Multi-tenant, modules, compare | IVFFlat, hybrid FTS, compare | Client, integrate, graduation |
| 09 | Production & Ops | ✅ | ✅ | ✅ | ✅ |
| 10 | Where It Shows Up | ✅ | ✅ | ✅ | ✅ |
| 11 | Common Pitfalls | ✅ | ✅ | ✅ | ✅ |
| 12 | Interview Q&A (12 `<details>`) | ✅ | ✅ | ✅ | ✅ |

## Cross-links

Each sheet links to:

- **Sibling vector DBs:** `pinecone.html`, `weaviate.html`, `pgvector.html`, `chroma.html`
- **Overview:** `vector-databases.html` (HNSW, IVF, metadata, hybrid, compare table)
- **Systems:** `../systems/rag-end-to-end.html`, `../systems/hybrid-search.html`, `../systems/chunking-strategies.html`
- **Related tech:** `embedding-models.html`, `rerankers.html`, `langchain.html`, `llamaindex.html`

## Conventions followed

- `--accent: #a855f7` (AI vertical purple); links `--accent2: #38bdf8`
- Inline `<style>` matching `vector-databases.html`
- Diagram lightbox copied from `docs/cheatsheets/hld/job-scheduler.html` (click-to-zoom, Escape close)
- Python/SQL/GraphQL snippets in `<pre>` blocks
- Fixed duplicate `</body></html>` tags from stub files

## Not done / out of scope

- Did NOT edit `tech/index.html` or AI master index
- Did NOT commit or push
- Did NOT touch Java source
