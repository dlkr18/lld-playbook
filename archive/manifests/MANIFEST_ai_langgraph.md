# Subagent — LangGraph AI Tech Cheatsheet (handoff)

## HTML file created

- `/Users/likhith.r/lld-playbook/docs/cheatsheets/ai/tech/langgraph.html` — LangGraph: StateGraph, nodes/edges, reducers, checkpointing (Memory/Postgres), human-in-the-loop (`interrupt_before`, `Command(resume)`), cyclic ReAct loops, vs LangChain, full Python agent example, production ops, 12 interview Q&A.

## PNG files created (3) in `docs/cheatsheets/ai/tech/img/`

- `langgraph-main.png` — Architecture overview: START → agent → conditional → tools → loop → END; compile + checkpointer.
- `langgraph-state-zoom.png` — State channels, `TypedDict`, `add_messages` reducer, partial node updates.
- `langgraph-hitl-zoom.png` — Interrupt before tools, checkpoint pause, human review, `Command(resume)`.

Source assets also at `/Users/likhith.r/.cursor/projects/Users-likhith-r-lld-playbook/assets/` (copied via `cp`).

## Structure notes

- Follows **Variant AI** skeleton from `docs/cheatsheets/ai/AI_TEMPLATE.md`: 01 What & Why → 01a Concepts → 01b API → 02 When → 03 Architecture → 04–10 Deep dives → 11 Production → 12 Where → 13 Pitfalls → 14 Q&A (12 entries; last is SDE3 system-design).
- CSS: purple accent `--accent: #a855f7` (AI vertical); layout matches HLD sheets (nav + hero + sections).
- Lightbox: diagram zoom snippet copied from `docs/cheatsheets/hld/job-scheduler.html` (style + `#lightbox` + IIFE).
- Cross-links (relative):
  - `../systems/agent-architectures.html`
  - `../fundamentals/prompt-engineering.html`
  - `crewai.html` (marked *coming soon* in prose)
  - Plus optional links to `rag-end-to-end.html`, `production-agent.html`, `llm-observability.html` in “Where It Shows Up”.

## Not done / out of scope

- Did **NOT** touch any `index.html` (per instructions).
- Did **NOT** commit to git (per instructions).
- Linked sheets (`agent-architectures.html`, `prompt-engineering.html`, `crewai.html`) may not exist yet — hrefs are in place for when they land.

## How to preview

Open in browser or serve locally:

```bash
open /Users/likhith.r/lld-playbook/docs/cheatsheets/ai/tech/langgraph.html
```
