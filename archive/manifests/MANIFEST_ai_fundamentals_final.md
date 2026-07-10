# AI Fundamentals Batch (9 sheets) — Handoff Manifest

## HTML files created (9)

All under `docs/cheatsheets/ai/fundamentals/`:

| Slug | Title | Lines | Q&A | Diagrams |
|---|---|---:|---:|---:|
| `transformers-attention.html` | Transformers & Attention | ~139 | 12 | 3 |
| `tokenization-context.html` | Tokenization & Context Window | ~140 | 12 | 3 |
| `pretraining-sft-rlhf.html` | Pre-training, SFT & RLHF | ~132 | 12 | 3 |
| `evaluation-metrics.html` | Evaluation Metrics | ~131 | 12 | 3 |
| `hallucination-grounding.html` | Hallucination & Grounding | ~127 | 12 | 3 |
| `ai-safety-guardrails.html` | AI Safety & Guardrails | ~132 | 12 | 3 |
| `cost-latency-tradeoffs.html` | Cost & Latency Tradeoffs | ~129 | 12 | 3 |
| `ai-system-design-patterns.html` | AI System Design Patterns | ~130 | 12 | 3 |
| `context-window-kv-cache.html` | Context Window & KV Cache | ~131 | 12 | 3 |

## PNG files created (27) in `docs/cheatsheets/ai/fundamentals/img/`

### transformers-attention
- `transformers-attention-main.png`
- `transformers-attention-self-attention-zoom.png`
- `transformers-attention-multihead-zoom.png`

### tokenization-context
- `tokenization-context-main.png`
- `tokenization-context-bpe-zoom.png`
- `tokenization-context-truncation-zoom.png`

### pretraining-sft-rlhf
- `pretraining-sft-rlhf-main.png`
- `pretraining-sft-rlhf-sft-zoom.png`
- `pretraining-sft-rlhf-rlhf-zoom.png`

### evaluation-metrics
- `evaluation-metrics-main.png`
- `evaluation-metrics-llm-judge-zoom.png`
- `evaluation-metrics-benchmark-zoom.png`

### hallucination-grounding
- `hallucination-grounding-main.png`
- `hallucination-grounding-rag-zoom.png`
- `hallucination-grounding-abstention-zoom.png`

### ai-safety-guardrails
- `ai-safety-guardrails-main.png`
- `ai-safety-guardrails-input-zoom.png`
- `ai-safety-guardrails-output-zoom.png`

### cost-latency-tradeoffs
- `cost-latency-tradeoffs-main.png`
- `cost-latency-tradeoffs-routing-zoom.png`
- `cost-latency-tradeoffs-cache-zoom.png`

### ai-system-design-patterns
- `ai-system-design-patterns-main.png`
- `ai-system-design-patterns-rag-finetune-zoom.png`
- `ai-system-design-patterns-agent-loop-zoom.png`

### context-window-kv-cache
- `context-window-kv-cache-main.png`
- `context-window-kv-cache-kv-zoom.png`
- `context-window-kv-cache-paged-zoom.png`

Source images generated via `GenerateImage`; copied from `/Users/likhith.r/.cursor/projects/Users-likhith-r-lld-playbook/assets/`.

## Build scripts

- `scripts/ai_fundamentals_content.py` — topic content (sections, Q&A, cross-links)
- `scripts/build_ai_fundamentals_batch.py` — HTML renderer (CSS/lightbox from `llm-fundamentals.html`)

Regenerate: `python3 scripts/build_ai_fundamentals_batch.py`

## Structure notes

- Follows `AI_TEMPLATE.md` Variant AI skeleton: 01 What & Why → 01a Core Concepts → 01b API Surface → 02 When to Use → 03 Architecture → 04–08+ Deep Dives → Production & Ops → Where It Shows Up → Pitfalls → 12 Interview Q&A.
- CSS copied from `llm-fundamentals.html` (`--accent: #a855f7`).
- Lightbox snippet copied verbatim from `llm-fundamentals.html` / `job-scheduler.html`.
- Cross-links among all 12 fundamentals sheets plus `../systems/*`, `../tech/*`, `../stretch/*`, `../../hld/*`.

## Pre-existing fundamentals (unchanged)

- `llm-fundamentals.html`
- `prompt-engineering.html`
- `embeddings-semantic-search.html`

## Not done / out of scope

- Did **NOT** touch any `index.html` (per instructions).
- Did **NOT** commit to git (per instructions).
