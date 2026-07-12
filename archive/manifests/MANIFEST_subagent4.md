# Subagent 4 — Variant A Classic HLD Cheatsheets

Created 5 HTML cheatsheets + 15 hand-drawn whiteboard diagrams.

## HTML files (docs/cheatsheets/hld/)

| File | Topic | Sections |
|---|---|---|
| `twitter-timeline.html` | Twitter / X Timeline | 15 (Req → Core → API → Estimation → Why Hard → Architecture → 7 deep dives → Scaling → Edge → Real-World → 12-Q&A) |
| `whatsapp.html` | WhatsApp / Chat System | 15 (incl. WS Transport, FIFO ordering, Receipts, Presence, Group fan-out, Signal Protocol E2E, Offline) |
| `instagram-feed.html` | Instagram News Feed | 15 (incl. Upload pipeline, Hybrid fan-out, Thumbnails, ABR Reels, Stories, Ranking) |
| `tinyurl.html` | TinyURL / URL Shortener | 15 (incl. 3 keygen strategies, KGS pattern, Redirect hot path, CDN, Click Analytics, Abuse) |
| `top-k-leaderboard.html` | Top-K / Leaderboard / Trending | 15 (incl. Redis ZSET, Flink windows, CMS+heap, Decay score, Player rank, Geo Top-K) |

Each file:
- Inline `<style>` CSS copied verbatim from `uber.html`
- Fixed left nav scroll-spy
- 12 Q&A `<details>` entries per file
- Diagram lightbox snippet appended verbatim before `</body>`
- Cross-links to `../tech/redis.html`, `../tech/kafka.html`, `../tech/cassandra.html`, `../tech/flink.html`, `../tech/elasticsearch.html`, `../concepts/sharding-partitioning.html`, `../concepts/hot-key.html`, `../concepts/websockets-vs-sse.html`, `../stretch/snowflake-id.html`, `../hld/ad-click-aggregator.html`, `../hld/rate-limiter.html`

## Diagrams (docs/cheatsheets/hld/img/)

15 hand-drawn whiteboard-style PNGs (3 per topic):

### twitter-timeline
- `twitter-timeline-hld.png` — main HLD (write path + read path + celebrity branch + ES/Flink/CDN)
- `twitter-timeline-fanout-zoom.png` — push vs pull vs hybrid side-by-side
- `twitter-timeline-ranking-zoom.png` — ML ranking pipeline (candidates → features → model → filter → top-K)

### whatsapp
- `whatsapp-hld.png` — sender → WS gateway → chat actor → message store → recipient queue → recipient + presence + media branches
- `whatsapp-group-fanout-zoom.png` — group message fan-out with per-member ACKs and 3-state machine
- `whatsapp-e2e-zoom.png` — X3DH key agreement + Double Ratchet + group Sender Keys

### instagram-feed
- `instagram-feed-hld.png` — upload pipeline + feed path + Stories/Search/Recommendations branches
- `instagram-reels-zoom.png` — ABR encoding pipeline (raw → encoder workers per rung → HLS → CDN → ABR player)
- `instagram-ranking-zoom.png` — 4-phase ranking (recall → hydration → model → diversity)

### tinyurl
- `tinyurl-hld.png` — create flow with KGS + redirect flow with CDN/Redis/Cassandra + Kafka analytics
- `tinyurl-keygen-zoom.png` — 3 keygen strategies compared + KGS winner panel
- `tinyurl-redirect-zoom.png` — CDN edge POP with hit/miss/expired branches + async analytics

### top-k-leaderboard
- `top-k-leaderboard-hld.png` — ingestion → durable ZSET branch + Flink trending branch + CMS+heap side track
- `top-k-cms-zoom.png` — Count-Min Sketch matrix + min-heap + combined algorithm + error bound
- `top-k-decay-zoom.png` — decay formula + score evolution chart + Reddit Hot example

## Verification

- All 5 HTML files written.
- All 15 PNGs generated via `GenerateImage`, copied via `cp` to `docs/cheatsheets/hld/img/`.
- Each HTML file contains: 15 numbered sections including 11 Variant-A skeleton sections + lightbox + 12 Q&A entries.
- CSS, nav, and lightbox copied verbatim from `uber.html` (lightbox originates from `job-scheduler.html`).
- No index.html edits, no git commits, no folder creation.
