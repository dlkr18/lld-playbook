# AI Tech Batch A — Handoff Manifest

Batch A completes four stub AI tech cheatsheets to SDE3 quality (expanded sections, Python snippets, 12 interview Q&A each, diagram lightbox from `langgraph.html`).

## HTML files updated

| File | Lines | Sections |
|------|-------|----------|
| `docs/cheatsheets/ai/tech/openai-api-patterns.html` | ~532 | What & Why → API → Streaming → Structured → Tools → Embeddings → Batch/Retries → Production → 12 Q&A |
| `docs/cheatsheets/ai/tech/langchain.html` | ~493 | LCEL → Retrievers → Tools → Memory → Callbacks → full RAG example → 12 Q&A |
| `docs/cheatsheets/ai/tech/crewai.html` | ~481 | Agents → Tasks → Process → vs LangGraph → RAG integration → 12 Q&A |
| `docs/cheatsheets/ai/tech/llamaindex.html` | ~475 | Indices → Query Engine → Ingestion → Agents → hybrid fusion → 12 Q&A |

## PNG diagrams created (12) in `docs/cheatsheets/ai/tech/img/`

Whiteboard style, purple accent (`#a855f7`):

### openai-api-patterns
- `openai-api-patterns-main.png` — API gateway → LLM proxy → providers → observability
- `openai-api-patterns-streaming-zoom.png` — SSE delta chunks, TTFT, finish_reason
- `openai-api-patterns-structured-zoom.png` — JSON schema / Pydantic constrained output

### langchain
- `langchain-main.png` — Prompt | Model | Parser stack + retriever/tools/callbacks
- `langchain-lcel-zoom.png` — RunnableParallel + pipe chain
- `langchain-tools-zoom.png` — bind_tools → ToolNode loop

### crewai
- `crewai-main.png` — Agents → Tasks → Crew kickoff flow
- `crewai-agents-zoom.png` — Agent cards (role, goal, backstory, tools)
- `crewai-process-zoom.png` — Sequential vs hierarchical manager delegation

### llamaindex
- `llamaindex-main.png` — Load → Nodes → Index → QueryEngine pipeline
- `llamaindex-index-zoom.png` — VectorStore + docstore + index store layers
- `llamaindex-query-zoom.png` — Retriever → postprocessor → synthesizer modes

Source assets also at `/Users/likhith.r/.cursor/projects/Users-likhith-r-lld-playbook/assets/` (copied via `cp`).

## Generator scripts (regenerate batch)

```bash
python3 scripts/generate_ai_tech_batch_a.py
```

- `scripts/generate_ai_tech_batch_a.py` — page builder + OpenAI topic
- `scripts/generate_ai_tech_batch_a_p2.py` — LangChain, CrewAI, LlamaIndex topics

CSS and diagram lightbox copied from `docs/cheatsheets/ai/tech/langgraph.html`.

## Cross-links included

- **Tech:** `vector-databases.html`, `langgraph.html`, `embedding-models.html`, `llm-observability.html`, `rerankers.html`, `pinecone.html`, `model-serving-vllm.html`
- **Systems:** `../systems/rag-end-to-end.html`, `tool-calling-functions.html`, `multi-agent-orchestration.html`, `agent-architectures.html`, `document-ingestion.html`, `chunking-strategies.html`, `hybrid-search.html`, `chatbot-rag-system.html`, `production-agent.html`, `agent-memory.html`, `eval-harness.html`
- **Fundamentals:** `../fundamentals/llm-fundamentals.html`, `prompt-engineering.html`, `embeddings-semantic-search.html`, `cost-latency-tradeoffs.html`, `ai-safety-guardrails.html`, `ai-system-design-patterns.html`

## Not done / out of scope

- Did **NOT** update `docs/cheatsheets/ai/tech/index.html` (per instructions)
- Did **NOT** commit to git (per instructions)

## Preview

```bash
open docs/cheatsheets/ai/tech/openai-api-patterns.html
open docs/cheatsheets/ai/tech/langchain.html
open docs/cheatsheets/ai/tech/crewai.html
open docs/cheatsheets/ai/tech/llamaindex.html
```
