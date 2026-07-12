# Subagent — AI Fundamentals Batch (9 cheatsheets)

## HTML files created

All under `docs/cheatsheets/ai/fundamentals/`:

| # | File | Title |
|---|------|-------|
| 1 | `transformers-attention.html` | Transformers & Attention |
| 2 | `tokenization-context.html` | Tokenization & Context Window |
| 3 | `pretraining-sft-rlhf.html` | Pre-training, SFT & RLHF |
| 4 | `evaluation-metrics.html` | Evaluation Metrics |
| 5 | `hallucination-grounding.html` | Hallucination & Grounding |
| 6 | `ai-safety-guardrails.html` | AI Safety & Guardrails |
| 7 | `cost-latency-tradeoffs.html` | Cost & Latency Tradeoffs |
| 8 | `ai-system-design-patterns.html` | AI System Design Patterns |
| 9 | `context-window-kv-cache.html` | Context Window & KV Cache |

Each sheet follows `docs/cheatsheets/ai/AI_TEMPLATE.md`: sections 01–12 (What & Why, Core Concepts, API Surface, When to Use, Architecture, deep dives 04–08, Production, Where It Shows Up, Pitfalls, Interview Q&A with **12** `<details>` items).

## PNG diagrams (27 total) in `docs/cheatsheets/ai/fundamentals/img/`

| Slug | Main | Zoom 1 | Zoom 2 |
|------|------|--------|--------|
| `transformers-attention` | `transformers-attention-main.png` | `transformers-attention-scaled-zoom.png` | `transformers-attention-multihead-zoom.png` |
| `tokenization-context` | `tokenization-context-main.png` | `tokenization-context-bpe-zoom.png` | `tokenization-context-budget-zoom.png` |
| `pretraining-sft-rlhf` | `pretraining-sft-rlhf-main.png` | `pretraining-sft-rlhf-sft-zoom.png` | `pretraining-sft-rlhf-rlhf-zoom.png` |
| `evaluation-metrics` | `evaluation-metrics-main.png` | `evaluation-metrics-auto-zoom.png` | `evaluation-metrics-judge-zoom.png` |
| `hallucination-grounding` | `hallucination-grounding-main.png` | `hallucination-grounding-rag-zoom.png` | `hallucination-grounding-abstain-zoom.png` |
| `ai-safety-guardrails` | `ai-safety-guardrails-main.png` | `ai-safety-guardrails-input-zoom.png` | `ai-safety-guardrails-output-zoom.png` |
| `cost-latency-tradeoffs` | `cost-latency-tradeoffs-main.png` | `cost-latency-tradeoffs-prefill-zoom.png` | `cost-latency-tradeoffs-pricing-zoom.png` |
| `ai-system-design-patterns` | `ai-system-design-patterns-main.png` | `ai-system-design-patterns-rag-zoom.png` | `ai-system-design-patterns-agent-zoom.png` |
| `context-window-kv-cache` | `context-window-kv-cache-main.png` | `context-window-kv-cache-kv-zoom.png` | `context-window-kv-cache-paged-zoom.png` |

Style: whiteboard, white background, purple accent `#a855f7`. Source assets generated via `GenerateImage`; copied from `.cursor/projects/.../assets/` into `img/`.

## Structure notes

- CSS: copied from `llm-fundamentals.html` (`--accent: #a855f7`).
- Lightbox: verbatim from `docs/cheatsheets/hld/job-scheduler.html` (via `llm-fundamentals.html` tail).
- Nav: `&larr; All Fundamentals` → `index.html`.
- Cross-links: all 12 fundamentals siblings + `../tech/langgraph.html`, `vector-databases.html` + `../systems/rag-end-to-end.html`, `agent-architectures.html`, `fine-tuning-lora.html`.
- Generator: `scripts/gen_ai_fundamentals_batch.py` + `scripts/topics_fundamentals_batch.py` (re-run with `python3 -B scripts/gen_ai_fundamentals_batch.py` to regenerate).

## Skipped (already existed)

- `llm-fundamentals.html`
- `prompt-engineering.html`
- `embeddings-semantic-search.html`

## Not done (per instructions)

- Did **not** edit `fundamentals/index.html`.
- Did **not** commit to git.

## Fundamentals catalog status

All **12** fundamentals topics from `AI_TEMPLATE.md` now have HTML cheatsheets (3 prior + 9 this batch).
