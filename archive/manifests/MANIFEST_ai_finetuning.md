# Subagent — Fine-Tuning (LoRA / QLoRA) Systems Cheatsheet

## HTML file created

- `/Users/likhith.r/lld-playbook/docs/cheatsheets/ai/systems/fine-tuning-lora.html` — **Fine-Tuning (LoRA / QLoRA)** (AI Systems): when to fine-tune vs RAG vs long context, LoRA/QLoRA mechanics, PEFT methods, dataset requirements, eval before deploy, HuggingFace/Axolotl training patterns, production ops.

## Diagrams generated

| File | Location | Purpose |
|------|----------|---------|
| `fine-tuning-lora-main.png` | `docs/cheatsheets/ai/systems/img/` | End-to-end pipeline: data prep → LoRA training → eval gate → deploy |
| `fine-tuning-lora-lora-zoom.png` | `docs/cheatsheets/ai/systems/img/` | LoRA low-rank adapter mechanics (W + BA) |
| `fine-tuning-lora-decision-zoom.png` | `docs/cheatsheets/ai/systems/img/` | Decision tree: fine-tune vs RAG vs long context |

## Section checklist (12 nav items)

| # | Section | Status |
|---|---------|--------|
| 01 | What & Why (problem, functional + non-functional reqs) | ✅ |
| 01a | Core Concepts (LoRA, QLoRA, PEFT, rank, target modules, adapter merge, dynamic LoRA, SFT, catastrophic forgetting, training/serving skew) | ✅ |
| 01b | API Surface (HF PEFT, Axolotl YAML, vLLM serve/LoRA slots) | ✅ |
| 02 | When to Use / When NOT (decision table + decision diagram) | ✅ |
| 03 | Architecture (ASCII pipeline + numbered flow steps) | ✅ |
| 04 | LoRA & QLoRA Deep Dive (hyperparam guide, QLoRA vs fp16) | ✅ |
| 05 | PEFT Methods Compared (LoRA, QLoRA, DoRA, Prefix, IA³, Full FT) | ✅ |
| 06 | Dataset Requirements (size guidelines, prep checklist, JSONL example) | ✅ |
| 07 | HuggingFace & Axolotl Training Patterns (SFTTrainer, multi-GPU, Axolotl vs HF) | ✅ |
| 08 | Eval Before Deploy (5-step eval harness, CI gate script) | ✅ |
| 09 | Production & Ops (registry, multi-tenant LoRA, A/B, rollback, drift) | ✅ |
| 10 | Where It Shows Up (cross-links) | ✅ |
| 11 | Common Pitfalls (8 pitfalls) | ✅ |
| 12 | Interview Q&A (12 `<details>` entries incl. SDE2 vs SDE3 row) | ✅ |

## Cross-links included

- Fundamentals: `../fundamentals/pretraining-sft-rlhf.html`, `../fundamentals/evaluation-metrics.html`
- Systems: `rag-end-to-end.html`, `eval-harness.html`, `rlhf-dpo-pipeline.html`, `chatbot-rag-system.html`
- Tech: `../tech/model-serving-vllm.html`

## Hero tags

LoRA · QLoRA · PEFT · Eval Gate · Axolotl

## Python config snippets

- HuggingFace PEFT `LoraConfig` + QLoRA 4-bit load
- Axolotl YAML config (full production pattern)
- vLLM dynamic LoRA serve
- TRL `SFTTrainer` + `SFTConfig`
- Golden-set eval gate script sketch

## Conventions followed

- CSS inline with `--accent: #a855f7` (AI purple vertical)
- Lightbox snippet copied verbatim from `job-scheduler.html`
- Skeleton follows `AI_TEMPLATE.md` Variant AI (01 → 01a → 01b → 02 → 03 → deep dives → Production → Where → Pitfalls → Q&A)
- Python 3.10+ snippets with type hints (AI vertical convention)

## Not done / out of scope

- Did NOT edit `systems/index.html` or master AI index (per instructions)
- Did NOT commit or push
- Did NOT touch Java source
