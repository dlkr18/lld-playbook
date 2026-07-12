# Subagent — Agent Architectures Cheatsheet (handoff)

## HTML files created (1)

- `/Users/likhith.r/lld-playbook/docs/cheatsheets/ai/systems/agent-architectures.html` — Agent Architectures: ReAct, Plan-and-Execute, Reflexion, tool-use loop, termination conditions, agent vs chain vs workflow decision table, production ops, 12 Q&A.

## PNG files created (3) in `docs/cheatsheets/ai/systems/img/`

- `agent-architectures-main.png` — Five patterns side by side: chain, ReAct, Plan-and-Execute, Reflexion, multi-agent supervisor.
- `agent-architectures-react-zoom.png` — ReAct loop: Thought → Action → Observation cycle with example.
- `agent-architectures-plan-zoom.png` — Plan-and-Execute two-phase: Planner → Executor loop with replanning.

All images also exist at `/Users/likhith.r/.cursor/projects/Users-likhith-r-lld-playbook/assets/` (source) and were copied via `cp`.

## Structure notes

- Follows AI_TEMPLATE.md Variant AI skeleton: 01 What & Why → 01a Core Concepts → 01b API Surface → 02 When to Use (agent/chain/workflow table) → 03 Architecture → 04–08 Deep Dives (ReAct, Plan-and-Execute, Reflexion, Tool-Use Loop, Termination) → 09 Production & Ops → 10 Where It Shows Up → 11 Pitfalls → 12 Q&A (12 entries, SDE3 probe as final answer).
- CSS adapted from HLD cheatsheets with `--accent: #a855f7` (purple) for AI vertical.
- Lightbox snippet (style + `#lightbox` div + IIFE) copied from `job-scheduler.html`.
- Cross-links: `../tech/langgraph.html`, `../tech/crewai.html`, `tool-calling-functions.html`, `../../hld/job-scheduler.html`, plus `multi-agent-orchestration.html`, `production-agent.html`, `rag-end-to-end.html`.

## Not done / out of scope

- Did NOT touch any index.html (per instructions).
- Did NOT commit to git (per instructions).
