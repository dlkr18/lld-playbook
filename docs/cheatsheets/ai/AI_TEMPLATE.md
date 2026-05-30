# AI Cheatsheet Template & Structure

Canonical structure for the **AI / LLMs / Agents** vertical at `docs/cheatsheets/ai/`.
Mirrors the HLD playbook: interview depth + production patterns + Python snippets.

---

## Folder layout

```
docs/cheatsheets/ai/
├── AI_TEMPLATE.md          ← this file
├── index.html              ← meta hub (4 sub-categories)
├── fundamentals/           ← transformers, tokens, prompt eng, eval
├── tech/                   ← LangGraph, CrewAI, vector DBs, APIs
├── systems/                ← RAG, agents, fine-tuning pipelines, production
└── stretch/                ← MCP, multimodal, MoE, GraphRAG
```

Each sub-folder has its own `index.html` + `img/` for diagrams.

---

## Master section skeleton (Variant AI)

Numbering matches HLD for consistency:

```
01   What & Why                    (problem statement + where it sits in the stack)
01a  Core Concepts                 (vocabulary table: term → definition → gotcha)
01b  API / Interface Surface       (OpenAI-style, LangChain, or framework APIs)
02   When to Use / When NOT        (decision table with alternatives)
03   Architecture                  (main whiteboard diagram + ASCII overview)
04+  Deep Dives                    (4–8 sections — the interview-defining material)
N-3  Production & Ops              (monitoring, cost, latency, failure modes)
N-2  Where It Shows Up             (links to other AI + HLD cheatsheets)
N-1  Common Pitfalls               (training/serving skew, prompt injection, etc.)
N    Interview Q&A                 (10–12 expandable <details>)
```

### Section purpose

| # | Section | Purpose |
|---|---|---|
| 01 | **What & Why** | Pin scope; functional + non-functional for AI systems. |
| 01a | **Core Concepts** | Vocabulary an interviewer expects (embeddings, context window, etc.). |
| 01b | **API Surface** | The contracts: chat completions, tool schemas, retrieval APIs. |
| 02 | **When to Use** | Decision matrix vs alternatives (RAG vs fine-tune vs long context). |
| 03 | **Architecture** | Main diagram — the "draw it on the whiteboard" answer. |
| 04+ | **Deep Dives** | Chunking, agent loops, LoRA config, vector index tuning, etc. |
| N-3 | **Production & Ops** | Cost/latency, observability, guardrails, HITL. |
| N-2 | **Where It Shows Up** | Cross-links to HLD (Instagram ranking) and other AI sheets. |
| N-1 | **Pitfalls** | Hallucination, prompt injection, eval leakage, data drift. |
| N | **Interview Q&A** | 10–12 follow-ups with numbers and specific tool names. |

---

## Diagram convention

Every cheatsheet ships **1–3 whiteboard-style diagrams**:

| File pattern | Where | What |
|---|---|---|
| `img/{slug}-main.png` | After hero, before section 01 | Dense architecture overview |
| `img/{slug}-{concept}-zoom.png` | Inside deep dive | Hot path or data flow zoom |
| `img/{slug}-{concept2}-zoom.png` | Second deep dive | State machine, pipeline stage |

**Style:** white background, hand-drawn ink, colored boxes (purple `#a855f7` accent for AI vertical), numbered flows, sticky-note callouts with latency/cost numbers.

Use `<div class="diagram"><img ...></div>` + lightbox from `job-scheduler.html`.

---

## HTML conventions

- Self-contained `.html` per topic
- Inline `<style>` — copy CSS block from `ai/fundamentals/llm-fundamentals.html` (once written) or `hld/uber.html`
- `--accent: #a855f7` (purple) for AI vertical
- Hero tag: `// AI` or `// Fundamentals` / `// Tech` / `// Systems`
- Python code in `<pre><code>` — **Python 3.10+** (type hints ok; this vertical is not Java 8)
- Cross-links: relative `../tech/langgraph.html`, `../../hld/twitter-timeline.html`

### Q&A entry

```html
<details>
  <summary>When would you fine-tune vs RAG vs long context?</summary>
  <div class="answer">RAG when knowledge changes frequently and you need citations.
  Fine-tune when you need consistent style/format or domain vocabulary.
  Long context (128K+) when doc fits once and latency budget allows. Most production systems combine RAG + small fine-tune.</div>
</details>
```

---

## Full topic catalog (45)

### Fundamentals (12)
| Slug | Title |
|---|---|
| `llm-fundamentals` | LLM Fundamentals |
| `transformers-attention` | Transformers & Attention |
| `tokenization-context` | Tokenization & Context Window |
| `pretraining-sft-rlhf` | Pre-training, SFT & RLHF |
| `prompt-engineering` | Prompt Engineering |
| `embeddings-semantic-search` | Embeddings & Semantic Search |
| `evaluation-metrics` | Evaluation Metrics |
| `hallucination-grounding` | Hallucination & Grounding |
| `ai-safety-guardrails` | AI Safety & Guardrails |
| `cost-latency-tradeoffs` | Cost & Latency Tradeoffs |
| `ai-system-design-patterns` | AI System Design Patterns |
| `context-window-kv-cache` | Context Window & KV Cache |

### Tech (14)
| Slug | Title |
|---|---|
| `openai-api-patterns` | OpenAI / Anthropic API Patterns |
| `langchain` | LangChain |
| `langgraph` | LangGraph |
| `crewai` | CrewAI |
| `llamaindex` | LlamaIndex |
| `vector-databases` | Vector Databases (Overview) |
| `pinecone` | Pinecone |
| `weaviate` | Weaviate |
| `pgvector` | pgvector |
| `chroma` | Chroma |
| `embedding-models` | Embedding Models |
| `rerankers` | Rerankers |
| `model-serving-vllm` | Model Serving (vLLM / Ollama) |
| `llm-observability` | LLM Observability |

### Systems (14)
| Slug | Title |
|---|---|
| `rag-end-to-end` | RAG End-to-End |
| `chunking-strategies` | Chunking Strategies |
| `hybrid-search` | Hybrid Search |
| `agent-architectures` | Agent Architectures |
| `multi-agent-orchestration` | Multi-Agent Orchestration |
| `tool-calling-functions` | Tool Calling & Functions |
| `agent-memory` | Agent Memory |
| `fine-tuning-lora` | Fine-Tuning (LoRA / QLoRA) |
| `rlhf-dpo-pipeline` | RLHF & DPO Pipeline |
| `eval-harness` | Eval Harness & Golden Sets |
| `production-agent` | Production Agent (HITL) |
| `semantic-cache` | Semantic Cache |
| `document-ingestion` | Document Ingestion Pipeline |
| `chatbot-rag-system` | Chatbot with RAG (System Design) |

### Stretch (5)
| Slug | Title |
|---|---|
| `mcp-protocol` | MCP Protocol |
| `multimodal-llms` | Multimodal LLMs |
| `mixture-of-experts` | Mixture of Experts |
| `agentic-graphrag` | Agentic RAG & GraphRAG |
| `constitutional-ai-redteam` | Constitutional AI & Red-Teaming |

---

## Phase rollout

| Phase | Topics | Priority |
|---|---|---|
| **1 — Core spine** | llm-fundamentals, prompt-engineering, embeddings, rag-end-to-end, langgraph, vector-databases, agent-architectures, fine-tuning-lora | Highest ROI |
| **2 — Tech stack** | langchain, crewai, llamaindex, pinecone, pgvector, embedding-models, openai-api-patterns, model-serving-vllm | Builder essentials |
| **3 — Systems depth** | chunking, hybrid-search, multi-agent, tool-calling, eval-harness, production-agent, chatbot-rag-system | Interview system design |
| **4 — Fundamentals + stretch** | remaining fundamentals + stretch topics | Complete the vertical |

---

## Cross-linking

- AI **systems** link **up** to HLD (e.g. RAG → `../../hld/web-search-engine.html`)
- AI **tech** links **down** to fundamentals (vector DB → embeddings primer)
- AI **fundamentals** links **out** to tech and systems usage

---

## Workflow

1. Outline against skeleton; pick 4–8 deep dives.
2. Generate diagrams via `GenerateImage` (main + 2 zooms).
3. Copy CSS from reference AI sheet; append lightbox verbatim.
4. Register on category `index.html` + bump counts.
5. Commit `master`; sync `github-pages-deploy` worktree.
