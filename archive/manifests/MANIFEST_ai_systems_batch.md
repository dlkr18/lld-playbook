# Subagent — AI Systems Batch Cheatsheets (handoff)

## HTML files created (11)

All under `docs/cheatsheets/ai/systems/`:

| File | Title | Deep dives |
|---|---|---|
| `chunking-strategies.html` | Chunking Strategies | Fixed/recursive, semantic, document-aware, parent-child, overlap tuning |
| `hybrid-search.html` | Hybrid Search | RRF fusion, weighted fusion, parallel retrieve, pre-filter, query routing |
| `multi-agent-orchestration.html` | Multi-Agent Orchestration | Supervisor, hierarchical, peer handoff, blackboard, termination |
| `tool-calling-functions.html` | Tool Calling & Functions | Schema design, registry, sandbox, errors, parallel tools |
| `agent-memory.html` | Agent Memory | Scratchpad, long-term vector, episodic, consolidation, retrieval |
| `rlhf-dpo-pipeline.html` | RLHF & DPO Pipeline | SFT baseline, reward model, DPO, PPO/RLHF, alignment eval |
| `eval-harness.html` | Eval Harness & Golden Sets | Golden sets, retrieval/gen metrics, LLM judge, CI gate |
| `production-agent.html` | Production Agent (HITL) | HITL, guardrails, tracing, cost caps, graceful degrade |
| `semantic-cache.html` | Semantic Cache | Threshold tuning, TTL, invalidation, two-tier, multi-tenant |
| `document-ingestion.html` | Document Ingestion Pipeline | Parse/OCR, dedup/CDC, queue design, embed workers, freshness |
| `chatbot-rag-system.html` | Chatbot with RAG (System Design) | **HLD depth**: FR/NFR, entities, API, estimation (1M docs/10K QPS), chat path, RAG integration, memory, agents |

Skipped (pre-existing): `rag-end-to-end.html`, `agent-architectures.html`, `fine-tuning-lora.html`

## PNG files created (33) in `docs/cheatsheets/ai/systems/img/`

3 diagrams per topic (main + 2 zoom):

- `chunking-strategies-main.png`, `chunking-strategies-semantic-zoom.png`, `chunking-strategies-parent-child-zoom.png`
- `hybrid-search-main.png`, `hybrid-search-rrf-zoom.png`, `hybrid-search-prefilter-zoom.png`
- `multi-agent-orchestration-main.png`, `multi-agent-orchestration-supervisor-zoom.png`, `multi-agent-orchestration-handoff-zoom.png`
- `tool-calling-functions-main.png`, `tool-calling-functions-schema-zoom.png`, `tool-calling-functions-loop-zoom.png`
- `agent-memory-main.png`, `agent-memory-vector-zoom.png`, `agent-memory-consolidation-zoom.png`
- `rlhf-dpo-pipeline-main.png`, `rlhf-dpo-pipeline-reward-zoom.png`, `rlhf-dpo-pipeline-dpo-zoom.png`
- `eval-harness-main.png`, `eval-harness-golden-zoom.png`, `eval-harness-judge-zoom.png`
- `production-agent-main.png`, `production-agent-hitl-zoom.png`, `production-agent-trace-zoom.png`
- `semantic-cache-main.png`, `semantic-cache-threshold-zoom.png`, `semantic-cache-invalidation-zoom.png`
- `document-ingestion-main.png`, `document-ingestion-parse-zoom.png`, `document-ingestion-queue-zoom.png`
- `chatbot-rag-system-main.png`, `chatbot-rag-system-architecture-zoom.png`, `chatbot-rag-system-entities-zoom.png`

Source images at `/Users/likhith.r/.cursor/projects/Users-likhith-r-lld-playbook/assets/`; copied to `docs/cheatsheets/ai/systems/img/`.

## Structure notes

- Follows `AI_TEMPLATE.md` Variant AI skeleton per file: 01 What & Why → 01a Core Concepts → 01b API → 02 When to Use → 03 Architecture → 04–08 Deep Dives → 09 Production → 10 Where It Shows Up → 11 Pitfalls → 12 Q&A (**12 entries each**).
- `chatbot-rag-system.html` adds **03a Estimation** and **04 Core Entities** for HLD-style interview depth (requirements, entities, API, architecture).
- CSS from `rag-end-to-end.html` with purple AI accent `--accent: #a855f7`.
- Lightbox snippet copied verbatim from `job-scheduler.html` / `rag-end-to-end.html`.
- Cross-links to `../tech/` (langgraph, vector-databases), `../fundamentals/` (embeddings, prompt-engineering, llm-fundamentals), `../../hld/` (web-search-engine, job-scheduler), and sibling systems sheets.

## Generator scripts (for regeneration)

- `scripts/build_ai_systems_batch.py` — HTML builder
- `scripts/ai_systems_content.py` + `scripts/ai_systems_content_p2.py` — topic content

Run: `python3 scripts/build_ai_systems_batch.py`

## Verification

```
11 files × 14 sections (15 for chatbot-rag-system with 03a)
11 files × 12 Q&A entries
11 files × 3 diagrams
11 files × lightbox + purple accent
0 missing image references
```

## Not done / out of scope

- Did NOT touch any `index.html` (per instructions).
- Did NOT commit to git (per instructions).
