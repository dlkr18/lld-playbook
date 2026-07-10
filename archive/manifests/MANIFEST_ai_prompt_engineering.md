# AI Prompt Engineering Cheatsheet — Handoff Manifest

## HTML file created

- `/Users/likhith.r/lld-playbook/docs/cheatsheets/ai/fundamentals/prompt-engineering.html` — Prompt Engineering: zero/few-shot, chain-of-thought, system prompts, structured output (JSON mode), prompt templates, prompt injection defense, eval prompts, production ops, 12 Q&A.

## PNG files created (3) in `docs/cheatsheets/ai/fundamentals/img/`

- `prompt-engineering-main.png` — End-to-end prompt pipeline: system prompt → few-shot → user query → LLM → CoT → JSON validation → guardrails.
- `prompt-engineering-cot-zoom.png` — CoT deep dive: zero-shot CoT, few-shot CoT, self-consistency voting.
- `prompt-engineering-injection-zoom.png` — Injection attack vectors vs defense-in-depth layers.

Source images also at `/Users/likhith.r/.cursor/projects/Users-likhith-r-lld-playbook/assets/` and copied via `cp`.

## Structure notes

- Follows AI_TEMPLATE.md Variant AI skeleton: 01 What & Why → 01a Core Concepts → 01b API Surface → 02 When to Use → 03 Architecture → 04–10 Deep Dives → 11 Production & Ops → 12 Where It Shows Up → 13 Pitfalls → 14 Q&A (12 entries, SDE3 probe as final answer).
- CSS `<style>` block copied from `hld/uber.html` with `--accent: #a855f7` (purple AI vertical).
- Lightbox snippet (style + `#lightbox` div + IIFE) copied verbatim from `hld/job-scheduler.html` before `</body>`.
- Cross-links: `llm-fundamentals.html`, `../systems/rag-end-to-end.html`, `../tech/langgraph.html` plus secondary links to hallucination-grounding, ai-safety-guardrails, eval-harness, agent-architectures, tool-calling-functions, fine-tuning-lora, cost-latency-tradeoffs.

## Deep dive sections (7)

1. Zero-Shot & Few-Shot (dynamic example selection)
2. Chain-of-Thought (zero-shot, few-shot, self-consistency)
3. System Prompts (anatomy, design principles)
4. Structured Output / JSON Mode (Pydantic, retry pattern)
5. Prompt Templates (YAML versioning, Jinja2 assembly)
6. Prompt Injection Defense (attack types, 6 defense layers)
7. Eval Prompts (LLM-as-judge, golden sets, CI gates)

## Not done / out of scope

- Did NOT touch any index.html (per instructions).
- Did NOT commit to git (per instructions).
