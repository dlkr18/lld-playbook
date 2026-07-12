# Subagent 3 Manifest — Variant B Tech Deep-Dive Cheatsheets

Owner: subagent 3
Variant: B (tech deep-dive)
Status: complete

## HTML files created

All under `docs/cheatsheets/tech/`:

| # | File | Title |
|---|------|-------|
| 1 | `elasticsearch.html` | Elasticsearch / OpenSearch Deep Dive |
| 2 | `flink-spark-streaming.html` | Flink & Spark Streaming Deep Dive |
| 3 | `zookeeper-etcd.html` | ZooKeeper / etcd Deep Dive |
| 4 | `grpc-protobuf.html` | gRPC / Protobuf Deep Dive |
| 5 | `websocket-sse-longpoll.html` | WebSocket / SSE / Long-Polling Deep Dive |
| 6 | `cdn.html` | CDN Deep Dive |

Each file:
- Uses the verbatim CSS block copied from `docs/cheatsheets/hld/distributed-message-queue.html`.
- Follows Variant B skeleton: 01 Identity, 01a Core Concepts, 01b API/Wire Surface, 02 When to Use, 03 Architecture, 04+ Deep Dives, Operational, Usage Patterns (back-links to A cheatsheets), Alternatives, Interview Q&A.
- Contains 10–12 expandable `<details>` Q&A entries with an SDE-2 vs SDE-3 differentiation row at the end.
- Includes the lightbox snippet (auto-injected style + script) verbatim from `job-scheduler.html` before `</body>`.
- Cross-links use relative `../hld/...html` paths.

## Diagrams generated and copied

All under `docs/cheatsheets/tech/img/` (also cached at `~/.cursor/projects/Users-likhith-r-lld-playbook/assets/`). Hand-drawn whiteboard style, white background, dark ink, colored highlights, sticky-note callouts.

| # | File | Topic |
|---|------|-------|
| 1 | `elasticsearch-hld.png` | Elasticsearch cluster: master / data / ingest / coordinating nodes with shards |
| 2 | `elasticsearch-invertedindex-zoom.png` | Analyzer → term dictionary (FST) → posting lists → BM25 scoring |
| 3 | `flink-spark-streaming-hld.png` | Flink pipeline: sources → keyBy → window → state → sinks; JobManager + TaskManagers + RocksDB; checkpoint barriers; Flink vs Spark legend |
| 4 | `flink-spark-streaming-watermark-zoom.png` | Event-time vs processing-time, watermark advance, tumbling windows firing, late-data handling |
| 5 | `zookeeper-etcd-hld.png` | 5-node ensemble (1 leader + 4 followers), write quorum flow, znode/key tree with ephemeral nodes |
| 6 | `zookeeper-etcd-leaderelection-zoom.png` | Ephemeral+sequential nodes under `/election`, predecessor-watch, leader crash → next promoted |
| 7 | `grpc-protobuf-hld.png` | Proto schema → stub generation, HTTP/2 single connection with multiplexed streams, 4 streaming modes, end-to-end call |
| 8 | `grpc-protobuf-wireformat-zoom.png` | Sample .proto, byte-by-byte wire encoding of fields, varint + ZigZag, safe-evolution rules |
| 9 | `websocket-sse-longpoll-hld.png` | Side-by-side timing diagrams for Polling / Long-Poll / SSE / WebSocket + comparison table |
| 10 | `websocket-sse-longpoll-reconnect-zoom.png` | WS reconnect-with-resume sequence: seq numbers, last_seq in localStorage, server ring buffer, heartbeat |
| 11 | `cdn-hld.png` | World map with POPs, mid-tier caches + origin shields + origin, anycast routing, edge compute panel |
| 12 | `cdn-cachekey-zoom.png` | Cache key construction (included vs excluded), Vary trap, surrogate-key purge flow across POPs |

## Notes

- No `index.html` edits made (per instructions).
- No git commits made.
- No folder creation beyond `docs/cheatsheets/tech/img/` (which already existed).
- Images copied with `cp` from the assets directory; not embedded via Write.
- Each Q&A section uses 11–12 questions, with SDE-2/SDE-3 differentiation as the closer.
