# Subagent — AI Tech Cheatsheets Batch C (handoff)

## HTML files created / expanded (~400–470 lines each, SDE3 quality)

| File | Lines | Topic |
|------|-------|-------|
| `docs/cheatsheets/ai/tech/embedding-models.html` | ~467 | OpenAI text-embedding-3, Cohere embed-v3, BGE/E5, Matryoshka, metrics, eval, full pipeline example |
| `docs/cheatsheets/ai/tech/rerankers.html` | ~424 | Two-stage retrieve→rerank, cross-encoder, Cohere/bge-reranker, latency budget, full RAG example |
| `docs/cheatsheets/ai/tech/model-serving-vllm.html` | ~418 | vLLM PagedAttention, Ollama dev stack, quantization, GPU sizing, OpenAI-compat client example |
| `docs/cheatsheets/ai/tech/llm-observability.html` | ~446 | LangSmith patterns, Langfuse, OTel, cost/eval dashboards, full instrumentation example |

## PNG files created (12) in `docs/cheatsheets/ai/tech/img/`

### embedding-models
- `embedding-models-main.png` — Text → tokenizer → bi-encoder → L2 normalize → vector DB cosine search
- `embedding-models-models-zoom.png` — Model comparison table (OpenAI 3-small/large, Cohere v3, BGE)
- `embedding-models-metric-zoom.png` — Cosine vs L2 vs dot product (normalized vectors)

### rerankers
- `rerankers-main.png` — Two-stage: ANN top_k=50 → cross-encoder rerank → top 5 → LLM
- `rerankers-crossencoder-zoom.png` — Cross-encoder joint attention on query+passage pair
- `rerankers-pipeline-zoom.png` — Pipeline tuning k=50, top_n=5, latency budget

### model-serving-vllm
- `model-serving-vllm-main.png` — vLLM OpenAI API → scheduler → PagedAttention → GPU workers
- `model-serving-vllm-vllm-zoom.png` — PagedAttention KV blocks + continuous batching
- `model-serving-vllm-ollama-zoom.png` — Ollama pull/Modelfile/serve local stack

### llm-observability
- `llm-observability-main.png` — SDK → trace collector → storage → dashboard → eval CI
- `llm-observability-tracing-zoom.png` — RAG trace waterfall (embed → retrieve → rerank → LLM)
- `llm-observability-eval-zoom.png` — Dashboard: tokens, cost, latency, eval score trends

Source assets generated via GenerateImage; copied to `docs/cheatsheets/ai/tech/img/`.

## Build scripts (optional regen)

- `scripts/ai_tech_batch_c_content.py` — SDE3 section content for all 4 topics
- `scripts/build_ai_tech_batch_c.py` — HTML generator (CSS/lightbox from `langgraph.html`)

```bash
python3 scripts/build_ai_tech_batch_c.py
```

## Structure notes

- Follows **Variant AI** skeleton: 01 What & Why (functional + non-functional) → 01a Concepts → 01b API → 02 When → 03 Architecture (ASCII + flow) → 04–08 Deep dives → 09 Full Example → 10 Production → 11 Where → 12 Pitfalls → 13 Interview Q&A (12 entries; last is SDE3)
- CSS: purple accent `--accent: #a855f7`; layout matches `langgraph.html`
- Lightbox: diagram zoom snippet from `langgraph.html`

## Cross-links included

- `vector-databases.html` — embed metric match, ANN index, rerank input
- `../systems/rag-end-to-end.html` — full pipeline context
- `llm-observability.html` / **LangSmith patterns** — tracing, datasets, evaluators, `@traceable`, projects per env
- Also: `rerankers.html`, `embedding-models.html`, `model-serving-vllm.html`, `langgraph.html`, `openai-api-patterns.html`, `../systems/eval-harness.html`, `../systems/hybrid-search.html`, `../fundamentals/embeddings-semantic-search.html`

## Not done / out of scope

- Did **NOT** touch any `index.html` (per instructions)
- Did **NOT** commit to git (per instructions)

## How to preview

```bash
open docs/cheatsheets/ai/tech/embedding-models.html
open docs/cheatsheets/ai/tech/rerankers.html
open docs/cheatsheets/ai/tech/model-serving-vllm.html
open docs/cheatsheets/ai/tech/llm-observability.html
```
