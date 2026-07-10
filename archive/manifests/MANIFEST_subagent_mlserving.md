# Subagent — ML Serving & Feature Store Stretch Cheatsheet

## HTML file created

- `/Users/likhith.r/lld-playbook/docs/cheatsheets/stretch/ml-serving-feature-store.html` — **ML Serving & Feature Store** (Variant D stretch, tech deep-dive lean): feature store identity, online/offline stores, model serving (Triton/TF Serving), training/serving skew, point-in-time joins, freshness/TTL, model registry, Feast vs Tecton vs in-house.

## Image used (pre-existing, not regenerated)

- `docs/cheatsheets/stretch/img/ml-serving-stack.png` — main diagram after hero (training pipeline → feature store → model registry → serving)

## Section checklist (~12 nav items)

| # | Section | Status |
|---|---------|--------|
| 01 | Identity (ML serving + feature store in the stack) | ✅ |
| 01a | Core Concepts (Feature, Feature Group, Model Version, Serving Graph, Online/Offline, Skew) | ✅ |
| 01b | API / Surface (get_online_features, get_historical_features, materialize, Triton gRPC) | ✅ |
| 02 | When to Use / When NOT to Use (decision table + Feast vs Tecton vs in-house) | ✅ |
| 03 | Architecture (6-step flow + main diagram) | ✅ |
| 04 | Online Feature Store (Redis/Dynamo, point-in-time correctness at serve time) | ✅ |
| 05 | Offline Feature Store (warehouse/Parquet, backfill, ASOF join) | ✅ |
| 06 | Model Serving (Triton/TF Serving/TorchServe, A/B, canary, GPU autoscaling) | ✅ |
| 07 | Training/Serving Skew & Point-in-Time Joins (#1 pitfall) | ✅ |
| 08 | Feature Freshness & TTL (Flink → online store streaming) | ✅ |
| 09 | Model Registry & Versioning (MLflow, rollback, shadow mode) | ✅ |
| 10 | Where It Shows Up (instagram-feed, ad-click-aggregator, twitter-timeline) | ✅ |
| 11 | Interview Q&A (12 `<details>` entries incl. SDE2 vs SDE3 row) | ✅ |

## Cross-links included

- Tech: `../tech/flink-spark-streaming.html`, `../tech/redis.html`, `../tech/kafka.html`
- Concepts: `../concepts/caching.html`
- HLD: `../hld/instagram-feed.html`, `../hld/ad-click-aggregator.html`, `../hld/twitter-timeline.html`

## Hero tags

Feature Store · Triton · Point-in-Time · Training Skew · Online/Offline

## Conventions followed

- CSS `<style>` block copied from `gossip-protocols.html` / `kafka.html` (shared design tokens)
- Lightbox snippet (style + `#lightbox` div + IIFE) copied verbatim from `job-scheduler.html` before `</body>`
- Skeleton follows `HLD_TEMPLATE.md` Variant B/D (Identity → Concepts → API → When → Architecture → deep dives → Where → Q&A)

## Not done / out of scope

- Did NOT edit `stretch/index.html` or master index (per instructions)
- Did NOT commit or push
- Did NOT generate new images or zoom PNGs
- Did NOT touch Java source
