# Subagent — LLM Fundamentals AI Cheatsheet (handoff)

## HTML file created

- `/Users/likhith.r/lld-playbook/docs/cheatsheets/ai/fundamentals/llm-fundamentals.html` — Variant AI cheatsheet per `docs/cheatsheets/ai/AI_TEMPLATE.md`: 01 What & Why, 01a Core Concepts (table), 01b API Surface (OpenAI chat completions + Python), 02 When to Use, 03 Architecture, deep dives (decoder-only, scaling laws, inference vs training, model families GPT/Claude/Llama, temperature/top-p), Production & Ops, Where It Shows Up, Pitfalls, 12 Interview Q&A.

## PNG files created (3) in `docs/cheatsheets/ai/fundamentals/img/`

- `llm-fundamentals-main.png` — Training → alignment → inference API overview (hero, before section 01).
- `llm-fundamentals-inference-zoom.png` — Autoregressive decode + KV cache hot path (section 06).
- `llm-fundamentals-scaling-zoom.png` — Chinchilla / scaling laws compute tradeoff (section 05).

Source assets also at `/Users/likhith.r/.cursor/projects/Users-likhith-r-lld-playbook/assets/`; copied via `cp` into `img/`.

## Structure notes

- Hero: **LLM Fundamentals // Fundamentals**; tags: GPT, Scaling Laws, Inference, Tokens.
- CSS `<style>` copied from `docs/cheatsheets/hld/uber.html` with `--accent: #a855f7` and purple-tinted tag/hover/blockquote rgba values.
- Lightbox snippet (style + `#lightbox` div + IIFE) copied verbatim from `docs/cheatsheets/hld/job-scheduler.html` before `</body>`.
- Nav back link: `fundamentals/index.html` (did not edit index).
- Cross-links: `../tech/` (openai-api-patterns, model-serving-vllm, llm-observability, etc.), `../../hld/` (web-search-engine, notification-system, instagram-feed, google-docs, whatsapp), sibling fundamentals sheets.
- Python 3 snippets in `<pre><code>` (OpenAI client, sampling pseudo-code, model routing).

## Not done / out of scope

- Did NOT edit `fundamentals/index.html` or any other index (per instructions).
- Did NOT commit to git (per instructions).
- Linked tech/systems sheets are catalog entries (many `coming-soon` on hub); links are relative paths for future sheets.
