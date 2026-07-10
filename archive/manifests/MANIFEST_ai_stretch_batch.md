# Subagent — AI Stretch Batch (5 cheatsheets)

Handoff for all **Stretch** topics under `docs/cheatsheets/ai/stretch/`. Per `docs/cheatsheets/ai/AI_TEMPLATE.md`: full Variant AI skeleton, 12 Interview Q&A each, 3 whiteboard diagrams each, purple CSS from `llm-fundamentals.html`, lightbox from `job-scheduler.html`.

---

## HTML files created (5)

| File | Title | Hero tag |
|---|---|---|
| `docs/cheatsheets/ai/stretch/mcp-protocol.html` | MCP Protocol | // Stretch |
| `docs/cheatsheets/ai/stretch/multimodal-llms.html` | Multimodal LLMs | // Stretch |
| `docs/cheatsheets/ai/stretch/mixture-of-experts.html` | Mixture of Experts | // Stretch |
| `docs/cheatsheets/ai/stretch/agentic-graphrag.html` | Agentic RAG & GraphRAG | // Stretch |
| `docs/cheatsheets/ai/stretch/constitutional-ai-redteam.html` | Constitutional AI & Red-Teaming | // Stretch |

Each sheet includes: 01 What & Why, 01a Core Concepts (table), 01b API Surface, 02 When to Use, 03 Architecture, 4–8 deep dives, Production & Ops, Where It Shows Up, Pitfalls, 12 expandable Q&A.

Nav back link: `stretch/index.html` (index **not** edited).

---

## PNG files created (15) in `docs/cheatsheets/ai/stretch/img/`

### mcp-protocol
- `mcp-protocol-main.png` — Host / client / server topology (hero)
- `mcp-protocol-transport-zoom.png` — JSON-RPC initialize + stdio/SSE (§04)
- `mcp-protocol-resources-zoom.png` — Resources vs tools discovery (§05)

### multimodal-llms
- `multimodal-llms-main.png` — Encoders → fusion → decoder (hero)
- `multimodal-llms-vision-zoom.png` — ViT patch token fusion (§04)
- `multimodal-llms-audio-zoom.png` — Audio cascade vs native (§06)

### mixture-of-experts
- `mixture-of-experts-main.png` — Router + expert FFN layer (hero)
- `mixture-of-experts-routing-zoom.png` — Top-k gating + load balance (§04)
- `mixture-of-experts-serving-zoom.png` — Expert parallelism / all-to-all (§07)

### agentic-graphrag
- `agentic-graphrag-main.png` — Dual vector + graph index (hero)
- `agentic-graphrag-graph-zoom.png` — Community reports / Leiden (§04)
- `agentic-graphrag-agent-zoom.png` — Agentic retrieval loop (§05)

### constitutional-ai-redteam
- `constitutional-ai-redteam-main.png` — CAI + red-team overview (hero)
- `constitutional-ai-redteam-critique-zoom.png` — Self-critique / revision (§05)
- `constitutional-ai-redteam-redteam-zoom.png` — Adversarial testing loop (§07)

Source assets generated via `GenerateImage`; copied from `/Users/likhith.r/.cursor/projects/Users-likhith-r-lld-playbook/assets/` into `img/`.

---

## Structure notes

- **CSS:** inline `<style>` with `--accent: #a855f7` (matches `fundamentals/llm-fundamentals.html`).
- **Lightbox:** style + `#lightbox` div + IIFE copied verbatim from `docs/cheatsheets/hld/job-scheduler.html` before `</body>` on each sheet.
- **Python:** 3.10+ snippets in `<pre><code>` where applicable.
- **Cross-links:** `../fundamentals/`, `../tech/`, `../systems/`, `../../hld/` (existing sheets + catalog paths for not-yet-built topics).

---

## Not done / out of scope

- Did **NOT** edit `stretch/index.html` or any hub counts (per instructions).
- Did **NOT** commit to git (per instructions).
