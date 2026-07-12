# AI Tech Cheatsheets — Final Batch (12 topics)

Completed all missing **Tech** vertical cheatsheets under `docs/cheatsheets/ai/tech/`.

## HTML files created (12)

| File | Title |
|------|-------|
| `openai-api-patterns.html` | OpenAI / Anthropic API Patterns |
| `langchain.html` | LangChain |
| `crewai.html` | CrewAI |
| `llamaindex.html` | LlamaIndex |
| `pinecone.html` | Pinecone |
| `weaviate.html` | Weaviate |
| `pgvector.html` | pgvector |
| `chroma.html` | Chroma |
| `embedding-models.html` | Embedding Models |
| `rerankers.html` | Rerankers |
| `model-serving-vllm.html` | Model Serving (vLLM / Ollama) |
| `llm-observability.html` | LLM Observability |

**Already existed (unchanged):** `langgraph.html`, `vector-databases.html`

## Diagrams generated (36 new PNGs)

Each topic: `{slug}-main.png` + 2 `{slug}-{concept}-zoom.png` in `docs/cheatsheets/ai/tech/img/`.

| Slug | main | zoom 1 | zoom 2 |
|------|------|--------|--------|
| `openai-api-patterns` | main | streaming-zoom | structured-zoom |
| `langchain` | main | lcel-zoom | tools-zoom |
| `crewai` | main | agents-zoom | process-zoom |
| `llamaindex` | main | index-zoom | query-zoom |
| `pinecone` | main | serverless-zoom | metadata-zoom |
| `weaviate` | main | hybrid-zoom | graphql-zoom |
| `pgvector` | main | hnsw-zoom | sql-zoom |
| `chroma` | main | collections-zoom | embed-zoom |
| `embedding-models` | main | models-zoom | metric-zoom |
| `rerankers` | main | crossencoder-zoom | pipeline-zoom |
| `model-serving-vllm` | main | vllm-zoom | ollama-zoom |
| `llm-observability` | main | tracing-zoom | eval-zoom |

**Style:** white background, hand-drawn ink, purple `#a855f7` accent, numbered flows, latency/cost sticky notes (per `AI_TEMPLATE.md`).

## Section checklist (all 12 sheets)

| # | Section | Status |
|---|---------|--------|
| 01 | What & Why | ✅ |
| 01a | Core Concepts (vocabulary table) | ✅ |
| 01b | API / Interface Surface | ✅ |
| 02 | When to Use / When NOT | ✅ |
| 03 | Architecture | ✅ |
| 04–08+ | Deep Dives (4–8 per topic) | ✅ |
| N-3 | Production & Ops | ✅ |
| N-2 | Where It Shows Up | ✅ |
| N-1 | Common Pitfalls | ✅ |
| N | Interview Q&A (12 `<details>`) | ✅ |

## Conventions followed

- **Template:** `docs/cheatsheets/ai/AI_TEMPLATE.md` Variant AI skeleton
- **Style reference:** `langgraph.html`, `vector-databases.html`
- **CSS:** `--accent: #a855f7`; inline `<style>` from LangGraph reference
- **Lightbox:** diagram zoom copied verbatim from `docs/cheatsheets/hld/job-scheduler.html`
- **Python snippets:** Python 3.10+ in `<pre><code>`
- **Cross-links:** relative links across tech / systems / fundamentals / HLD

## Generator scripts (for regeneration)

- `scripts/generate_ai_tech_batch.py` — HTML builder
- `scripts/ai_tech_content.py` — topic 1 + loader
- `scripts/ai_tech_content_p2.py` — topics 2–6
- `scripts/ai_tech_content_p3.py` — topics 7–12

```bash
python3 scripts/generate_ai_tech_batch.py
```

## Cross-link graph (high level)

- **API layer:** `openai-api-patterns` → `langchain`, `embedding-models`, `llm-observability`
- **Orchestration:** `langchain` ↔ `langgraph`, `crewai`, `llamaindex`
- **Vector stores:** `vector-databases` → `pinecone`, `weaviate`, `pgvector`, `chroma`
- **Retrieval stack:** `embedding-models` → `rerankers` → `../systems/rag-end-to-end.html`
- **Serving / ops:** `model-serving-vllm`, `llm-observability`

## Not done / out of scope (per instructions)

- Did **NOT** edit `tech/index.html` or AI master `index.html`
- Did **NOT** commit or push
- Did **NOT** touch Java source

## Preview

```bash
open docs/cheatsheets/ai/tech/openai-api-patterns.html
# or any of the 12 new files
```

## Tech vertical status

**14 / 14** topics in catalog now have HTML:

openai-api-patterns, langchain, langgraph, crewai, llamaindex, vector-databases, pinecone, weaviate, pgvector, chroma, embedding-models, rerankers, model-serving-vllm, llm-observability ✅
