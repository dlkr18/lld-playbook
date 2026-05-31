# ai_systems_content.py — TOPICS dict for build_ai_systems_batch.py

def _nav(*items):
    return items

def _tags(*items):
    return items

def _qa(*pairs):
    return list(pairs)

# ── 1. chunking-strategies ──────────────────────────────────────────
TOPICS["chunking-strategies"] = dict(
    title="Chunking Strategies",
    nav="Chunking",
    hero="How to split documents for RAG: fixed-size, recursive, semantic, document-aware, and parent-child indexing. Chunking is the silent killer of retrieval quality — tune it before the reranker.",
    tags=_tags(("512 tok", ""), ("Overlap", " orange"), ("Parent-Child", " green"), ("Semantic", " pink"), ("Recall@5", " blue")),
    main_img="chunking-strategies-main.png",
    main_cap="Five chunking strategies: fixed-size, recursive, semantic, document-aware, and parent-child. Parser routes by mime type; all paths converge on metadata-enriched chunks before embed+index.",
    nav_items=_nav(("01","whatwhy","What & Why"),("01a","concepts","Core Concepts"),("01b","api","API Surface"),("02","whento","When to Use"),("03","architecture","Architecture"),("04","fixed","Fixed & Recursive"),("05","semantic","Semantic"),("06","docaware","Document-Aware"),("07","parentchild","Parent-Child"),("08","tuning","Overlap Tuning"),("09","production","Production & Ops"),("10","shows-up","Where It Shows Up"),("11","pitfalls","Pitfalls"),("12","interview","Interview Q&A")),
    sections=[
        ("whatwhy","01","What & Why", card("<p><strong>Chunking</strong> determines the atomic retrieval unit in RAG. Bad splits cannot be fixed downstream.</p><h3>Functional</h3><ul><li>Split PDF/HTML/Slack/code into searchable units</li><li>Preserve tables, headings, code blocks</li><li>Attach doc_id, section, page, ACL metadata</li><li>Re-chunk on update without orphan vectors</li></ul><h3>Non-functional</h3><ul><li>Deterministic chunk_ids on re-ingest</li><li>Gold passage contained in one chunk &gt;95%</li><li>10K docs/min CPU throughput</li></ul>")),
        ("concepts","01a","Core Concepts", card(tbl([(("th","Term"),("th","Definition"),("th","Gotcha")),(("td","Chunk size"),("td","Target tokens per unit (256–1024)"),("td","Count tokens not chars")),(("td","Overlap"),("td","Shared tokens between neighbors"),("td","10% of chunk_size typical")),(("td","Recursive"),("td","Split on headings then paragraphs"),("td","LangChain default")),(("td","Semantic"),("td","Split when embedding similarity drops"),("td","Extra embed cost")),(("td","Parent-child"),("td","Index small, return large parent"),("td","Sync on delete")),]))),
        ("api","01b","API Surface", card('<pre>POST /v1/chunk/preview\n  body: { doc_id, text, strategy: "recursive", chunk_size: 512, overlap: 50 }\n  -> { chunks: [{ chunk_id, text, token_count, metadata }] }\n\nfrom langchain_text_splitters import RecursiveCharacterTextSplitter\nsplitter = RecursiveCharacterTextSplitter(chunk_size=512, chunk_overlap=50)</pre>')),
        ("whento","02","When to Use / When NOT", card(tbl([(("th","Strategy"),("th","Use When"),("th","Skip When")),(("td","Fixed-size"),("td","Logs, chat exports, MVP"),("td","Structured PDFs")),(("td","Recursive"),("td","Mixed markdown/HTML"),("td","Need table atomicity")),(("td","Semantic"),("td","Long prose, topic shifts"),("td","Latency-sensitive ingest")),(("td","Document-aware"),("td","PDFs, code, reports"),("td","Plain text only")),(("td","Parent-child"),("td","Precision + broad context"),("td","Docs already &lt;512 tok")),]))),
        ("architecture","03","Architecture", card('<pre>Raw Doc -> Parser -> Strategy Router\n  Fixed | Recursive | Doc-aware | Semantic\n       -> Overlap pass -> Metadata enricher\n       -> Optional parent-child linker -> Embed + Index</pre>') + card("<div class='flow'><div class='step' data-num='1'><span class='label'>Parse</span><div class='detail'>OCR PDFs; strip HTML nav.</div></div><div class='step' data-num='2'><span class='label'>Route</span><div class='detail'>Mime-based strategy selection.</div></div><div class='step' data-num='3'><span class='label'>Split</span><div class='detail'>512 tok, 50 overlap; never mid-table.</div></div><div class='step' data-num='4'><span class='label'>Validate</span><div class='detail'>Min/max size; empty filter.</div></div><div class='step' data-num='5'><span class='label'>Index</span><div class='detail'>Upsert by content_hash.</div></div></div>")),
        ("fixed","04","Deep Dive: Fixed & Recursive", card('<pre>splitter = RecursiveCharacterTextSplitter(\n    chunk_size=512, chunk_overlap=50,\n    separators=["\\n## ", "\\n### ", "\\n\\n", "\\n", ". ", " "],\n)\n# Grid search {256,512,768,1024} on golden Recall@5</pre><p>Start <strong>512/50</strong>. Evaluate before tuning embeddings.</p>')),
        ("semantic","05","Deep Dive: Semantic Chunking", diag("chunking-strategies","semantic-zoom","Semantic split at embedding similarity drop threshold") + card("<p>Embed sentences; split when cosine similarity &lt; 0.75. Best for policies and long essays.</p>")),
        ("docaware","06","Deep Dive: Document-Aware", card("<ul><li><strong>PDF:</strong> Unstructured/Docling — tables atomic</li><li><strong>Markdown:</strong> split on ##; prepend heading to each chunk</li><li><strong>Code:</strong> tree-sitter function/class boundaries</li></ul>")),
        ("parentchild","07","Deep Dive: Parent-Child", diag("chunking-strategies","parent-child-zoom","Retrieve child chunk; inject parent section into LLM context") + card("<p>Index 128–256 tok children; store 1024 tok parent in metadata. Retrieve child, pass parent to LLM.</p>")),
        ("tuning","08","Deep Dive: Overlap & Eval", card("<p>Grid search chunk_size × overlap on golden set. Stop when Recall@5 gain &lt;2% for &gt;20% index growth.</p>")),
        ("production","09","Production & Ops", card("<ul><li>Alert on chunk_count 10× median per doc</li><li>Version chunk_strategy in metadata</li><li>Re-chunk via blue/green index swap</li><li>Dashboard: parser failures by mime type</li></ul>")),
        ("shows-up","10","Where It Shows Up", card('<ul><li><a href="rag-end-to-end.html">RAG End-to-End</a></li><li><a href="document-ingestion.html">Document Ingestion</a></li><li><a href="../fundamentals/embeddings-semantic-search.html">Embeddings</a></li><li><a href="hybrid-search.html">Hybrid Search</a></li></ul>')),
        ("pitfalls","11","Common Pitfalls", card("<ul><li>Splitting tables mid-row</li><li>Char-based not token-based sizing</li><li>Tuning reranker before chunk size</li><li>No overlap on step-by-step docs</li><li>Orphan chunks on re-index</li></ul>")),
    ],
    qa=_qa(
        ("Why is chunking the #1 RAG quality lever?", "Retrieval returns indexed units only. Split boundaries and broken tables make gold answers unfindable regardless of reranker quality."),
        ("How do you choose chunk size?", "Start 512/50. Sweep {256,512,768,1024} on golden Recall@5. Document-aware beats brute size tuning for PDFs."),
        ("Explain parent-child indexing.", "Index small children for precision; link to larger parent sections. Retrieve child, inject parent into LLM prompt."),
        ("When use semantic chunking?", "Long narrative with topic shifts. Skip for FAQs and code — extra embed latency."),
        ("How handle code repos?", "AST/tree-sitter splits per function. Metadata: file path, symbol. Never split mid-function."),
        ("What metadata per chunk?", "doc_id, chunk_index, content_hash, section, page, org_id, ACL, strategy_version."),
        ("Re-chunk without downtime?", "Dual-write new version; query filters active version; blue/green index swap after golden eval."),
        ("Fixed vs recursive vs semantic?", "Fixed: logs MVP. Recursive: default markdown. Semantic: long prose. Doc-aware: PDFs/tables."),
        ("Chunking + hybrid search?", "Keep SKUs with explanations for BM25. Prepend headings for dense coherence."),
        ("What is proposition chunking?", "LLM extracts atomic facts per chunk. High precision, 10× ingest cost — legal/medical only."),
        ("How eval chunking?", "Gold passage fully in retrieved chunk (Recall@k). Block deploy if Recall@5 drops >2%."),
        ("SDE3: chunking service for 50 source types?", "Pluggable Chunker per mime. Parser registry. Preview API. Golden-set CI per strategy change. Parent-child optional post-processor."),
    ),
)

# ── 2. hybrid-search ────────────────────────────────────────────────
TOPICS["hybrid-search"] = dict(
    title="Hybrid Search",
    nav="Hybrid Search",
    hero="Combine dense vector search with sparse BM25: parallel retrieval, RRF fusion, metadata pre-filter, and cross-encoder rerank. Neither alone covers enterprise queries.",
    tags=_tags(("Dense+Sparse", ""), ("RRF", " orange"), ("BM25", " green"), ("Pre-filter", " pink"), ("Recall@5", " blue")),
    main_img="hybrid-search-main.png",
    main_cap="Hybrid retrieval architecture: query embed + BM25 tokenize in parallel, RRF merge top-50, cross-encoder rerank to top-5, metadata pre-filter before ANN.",
    nav_items=_nav(("01","whatwhy","What & Why"),("01a","concepts","Core Concepts"),("01b","api","API Surface"),("02","whento","When to Use"),("03","architecture","Architecture"),("04","rrf","RRF Fusion"),("05","weighted","Weighted Fusion"),("06","parallel","Parallel Retrieve"),("07","prefilter","Pre-filter"),("08","routing","Query Routing"),("09","production","Production & Ops"),("10","shows-up","Where It Shows Up"),("11","pitfalls","Pitfalls"),("12","interview","Interview Q&A")),
    sections=[
        ("whatwhy","01","What & Why", card("<p>Dense finds paraphrases; sparse finds exact tokens (SKUs, error codes). Enterprise RAG needs both.</p><h3>NFR</h3><ul><li>Recall@5 &gt;95% on golden set</li><li>Retrieve stage &lt;50ms p99</li><li>Pre-filter by org_id/ACL before ANN</li></ul>")),
        ("concepts","01a","Core Concepts", card(tbl([(("th","Term"),("th","Definition"),("th","Gotcha")),(("td","Bi-encoder"),("td","Separate query/doc embeddings"),("td","Fast but shallow")),(("td","BM25"),("td","Lexical TF-IDF ranking"),("td","Misses paraphrases")),(("td","RRF"),("td","Merge ranks: 1/(k+rank)"),("td","k=60 typical")),(("td","Pre-filter"),("td","Metadata filter before ANN"),("td","Post-filter leaks tenants")),]))),
        ("api","01b","API Surface", card('<pre>POST /v1/search/hybrid\n  { query, org_id, filters, top_k: 50, fusion: "rrf" }\n  -> { results: [{ chunk_id, dense_rank, sparse_rank, rrf_score }] }\n\nretrieval.hybridSearch(q, filters, top_k=50)\nrerank.scorePairs(q, chunks) -> top 5</pre>')),
        ("whento","02","When to Use / When NOT", card(tbl([(("th","Mode"),("th","Use When"),("th","Skip When")),(("td","Hybrid"),("td","Enterprise mixed queries"),("td","Pure conversational FAQ")),(("td","Dense-only"),("td","Paraphrase-heavy, no SKUs"),("td","Legal codes, product IDs")),(("td","Sparse-only"),("td","Exact identifier lookup"),("td","Natural language questions")),]))),
        ("architecture","03","Architecture", card('<pre>Query -> [Embed -> HNSW top-50]  parallel  [BM25 -> ES top-50]\n              -> RRF merge -> Cross-encoder rerank top-5 -> Context</pre>')),
        ("rrf","04","Deep Dive: RRF", diag("hybrid-search","rrf-zoom","RRF score calculation merging dense and sparse rank lists") + card('<pre>score_rrf(d) = sum 1/(k + rank_L(d))  # k=60\n# doc rank 1 dense + rank 8 sparse -> high fused score</pre>')),
        ("weighted","05","Deep Dive: Weighted Fusion", card("<p>score = α·dense + (1-α)·sparse. Tune α on dev set. RRF is more robust when score scales differ.</p>")),
        ("parallel","06","Deep Dive: Parallel Retrieve", card("<p>Fire dense + sparse concurrently (asyncio/gRPC). Merge latency = max(dense, sparse) not sum. Target &lt;40ms combined.</p>")),
        ("prefilter","07","Deep Dive: Pre-filter", diag("hybrid-search","prefilter-zoom","Metadata pre-filter by org_id and ACL before HNSW ANN search") + card("<p>Pinecone namespace, pgvector WHERE, Weaviate tenant filter. Never post-filter after ANN.</p>")),
        ("routing","08","Deep Dive: Query Routing", card("<p>Classifier routes SKU-like queries to sparse-heavy (α=0.3). Conversational to dense-heavy. Saves sparse load on chit-chat.</p>")),
        ("production","09","Production & Ops", card("<ul><li>Trace dense_ms, sparse_ms, fusion_ms separately</li><li>A/B dense-only vs hybrid on Recall@5</li><li>Cache frequent query embeddings</li></ul>")),
        ("shows-up","10","Where It Shows Up", card('<ul><li><a href="rag-end-to-end.html">RAG End-to-End</a></li><li><a href="../tech/vector-databases.html">Vector Databases</a></li><li><a href="../fundamentals/embeddings-semantic-search.html">Embeddings</a></li><li><a href="../../hld/web-search-engine.html">Web Search Engine HLD</a></li></ul>')),
        ("pitfalls","11","Common Pitfalls", card("<ul><li>Dense-only missing 20–35% enterprise queries</li><li>Post-filter ACL after ANN</li><li>Not normalizing query length for BM25</li><li>Skipping rerank after hybrid merge</li></ul>")),
    ],
    qa=_qa(
        ("Why hybrid instead of vector-only?", "Dense misses exact SKUs, error codes, legal citations. Hybrid improves Recall@5 by 20–35% in enterprise evals."),
        ("Explain RRF.", "Reciprocal Rank Fusion: score(d)=Σ 1/(k+rank_L(d)). Robust when dense and sparse scores aren't comparable. k=60 default."),
        ("Dense vs sparse latency?", "Run parallel. p99 merge = max of both (~40ms). Don't sequentialize."),
        ("Pre-filter vs post-filter?", "Pre-filter applies org_id/ACL before ANN. Post-filter retrieves wrong tenants and returns too few results."),
        ("When skip hybrid?", "Pure FAQ chatbot with no proper nouns — dense-only OK. Legal clause lookup — sparse-heavy."),
        ("How tune α in weighted fusion?", "Grid search α∈{0.3,0.5,0.7} on golden set. RRF often beats manual α tuning."),
        ("BM25 index choice?", "Elasticsearch/OpenSearch for scale. Postgres tsvector for small corpora. Same chunk text as vector index."),
        ("How handle multi-tenant?", "Namespace per org or metadata pre-filter. Separate indexes only at 100K+ tenants."),
        ("Rerank after hybrid?", "Always. Hybrid improves recall; cross-encoder improves precision. Retrieve 50, rerank to 5."),
        ("Query routing example?", "Regex/r classifier: if query matches SKU pattern → sparse-heavy. Else dense-heavy."),
        ("Size for 10M chunks?", "HNSW ~120GB + ES ~30GB. 50 ANN shards, 20 ES nodes at 10K QPS with caching."),
        ("SDE3: evolve hybrid search?", "Month 1: RRF baseline + golden eval. Month 3: query router. Month 6: learned sparse-dense fusion. Month 9: domain fine-tuned reranker."),
    ),
)

# ── 3. multi-agent-orchestration ────────────────────────────────────
TOPICS["multi-agent-orchestration"] = dict(
    title="Multi-Agent Orchestration",
    nav="Multi-Agent",
    hero="Coordinate multiple LLM agents: supervisor routing, hierarchical teams, peer handoffs, shared blackboard state. Know when one agent beats many.",
    tags=_tags(("Supervisor", ""), ("Hierarchical", " orange"), ("Handoff", " green"), ("Blackboard", " pink"), ("LangGraph", " blue")),
    main_img="multi-agent-orchestration-main.png",
    main_cap="Multi-agent patterns: supervisor dispatches to specialist agents (research, code, writer), shared state store, message bus, and termination controller.",
    nav_items=_nav(("01","whatwhy","What & Why"),("01a","concepts","Core Concepts"),("01b","api","API Surface"),("02","whento","When to Use"),("03","architecture","Architecture"),("04","supervisor","Supervisor"),("05","hierarchical","Hierarchical"),("06","peer","Peer Handoff"),("07","blackboard","Blackboard"),("08","termination","Termination"),("09","production","Production & Ops"),("10","shows-up","Where It Shows Up"),("11","pitfalls","Pitfalls"),("12","interview","Interview Q&A")),
    sections=[
        ("whatwhy","01","What & Why", card("<p>Complex tasks decompose across specialists. Orchestration defines who talks to whom, shared state, and stop conditions.</p>")),
        ("concepts","01a","Core Concepts", card(tbl([(("th","Term"),("th","Definition"),("th","Gotcha")),(("td","Supervisor"),("td","Router agent assigns subtasks"),("td","Single point of failure")),(("td","Worker agent"),("td","Specialist with tool subset"),("td","Tool sprawl if unbounded")),(("td","Handoff"),("td","Transfer conversation to another agent"),("td","Context loss without summary")),(("td","Blackboard"),("td","Shared mutable state all agents read/write"),("td","Race conditions without locks")),]))),
        ("api","01b","API Surface", card('<pre># LangGraph supervisor pattern\ngraph.add_node("supervisor", supervisor_llm)\ngraph.add_node("researcher", research_agent)\ngraph.add_conditional_edges("supervisor", route_to_worker)\n\n# CrewAI\ncrew = Crew(agents=[researcher, writer], tasks=[t1, t2], process=Process.hierarchical)</pre>')),
        ("whento","02","When to Use / When NOT", card(tbl([(("th","Pattern"),("th","Use When"),("th","Skip When")),(("td","Single agent"),("td","3–5 tool calls suffice"),("td","Always — start here")),(("td","Supervisor"),("td","Distinct specialist roles"),("td","Simple Q&A")),(("td","Peer debate"),("td","High-stakes reasoning"),("td","Latency-sensitive chat")),]))),
        ("architecture","03","Architecture", card('<pre>User -> Supervisor Agent -> [Research | Code | Writer] Workers\n         ^                      |\n         +---- Blackboard State --+</pre>')),
        ("supervisor","04","Deep Dive: Supervisor", diag("multi-agent-orchestration","supervisor-zoom","Supervisor agent routing tasks to researcher, coder, and writer specialists") + card("<p>Supervisor LLM reads goal + blackboard, emits next_worker. Cap routing decisions at 10 to control cost.</p>")),
        ("hierarchical","05","Deep Dive: Hierarchical Teams", card("<p>Manager agent delegates to sub-teams (research sub-crew). CrewAI Process.hierarchical. Depth ≤2 for debuggability.</p>")),
        ("peer","06","Deep Dive: Peer Handoff", diag("multi-agent-orchestration","handoff-zoom","Agent handoff with context summary packet passed between peers") + card("<p>Agent A summarizes scratchpad → handoff packet → Agent B continues. OpenAI Agents SDK handoff pattern.</p>")),
        ("blackboard","07","Deep Dive: Blackboard State", card("<p>Redis/Postgres shared store: findings[], draft, open_questions[]. Versioned writes; LangGraph StateGraph typed dict.</p>")),
        ("termination","08","Deep Dive: Termination", card("<ul><li>Supervisor emits FINISH</li><li>max_agent_calls = 15</li><li>wall_clock timeout 60s</li><li>cost budget $0.50/query</li></ul>")),
        ("production","09","Production & Ops", card("<ul><li>Trace per-agent spans (LangSmith/Langfuse)</li><li>Rate limit inter-agent messages</li><li>HITL on cross-agent destructive actions</li></ul>")),
        ("shows-up","10","Where It Shows Up", card('<ul><li><a href="agent-architectures.html">Agent Architectures</a></li><li><a href="../tech/langgraph.html">LangGraph</a></li><li><a href="production-agent.html">Production Agent</a></li><li><a href="tool-calling-functions.html">Tool Calling</a></li></ul>')),
        ("pitfalls","11","Common Pitfalls", card("<ul><li>Multi-agent for single-tool tasks</li><li>Unbounded supervisor loops</li><li>No handoff summary — context overflow</li><li>Agents with identical tool sets (waste)</li></ul>")),
    ],
    qa=_qa(
        ("When one agent vs multi-agent?", "Start single agent with 3–5 tools. Multi-agent when distinct roles (research/write/code) and parallelizable subtasks justify 2–3× cost."),
        ("Explain supervisor pattern.", "Supervisor LLM routes to worker agents with specialized prompts/tools. Reads shared state; decides next worker or FINISH."),
        ("How prevent infinite agent loops?", "max_iterations, wall timeout, cost cap, supervisor must justify each routing decision in trace."),
        ("Handoff without losing context?", "Structured handoff packet: goal, findings summary, open questions, artifacts. Not raw message history."),
        ("Blackboard vs message passing?", "Blackboard: shared state all read. Message passing: direct agent-to-agent. LangGraph combines both via StateGraph."),
        ("CrewAI vs LangGraph?", "CrewAI: role-based crews, faster prototype. LangGraph: explicit state machine, better production control and HITL."),
        ("Parallel vs sequential agents?", "Parallel when subtasks independent (research 3 sources). Sequential when output feeds next (research → write)."),
        ("How debug multi-agent failures?", "Per-agent trace with inputs/outputs. Replay blackboard state at failure step. Golden trajectories for regression."),
        ("Cost control?", "Cap LLM calls per agent role. Cache research results. Smaller model for supervisor routing."),
        ("Security across agents?", "Each agent gets least-privilege tool allowlist. Supervisor cannot execute tools directly."),
        ("Human-in-the-loop placement?", "Approve before writer sends email; approve supervisor plan for high-risk tasks."),
        ("SDE3: design multi-agent support bot?", "Supervisor + Research (RAG) + Action (ticket API) agents. Blackboard in Redis. HITL on ticket create. Max 12 LLM calls. Fallback to single-agent on timeout."),
    ),
)

# Continue in part 2 for remaining 8 topics
import os as _os
exec(compile(open(_os.path.join(_os.path.dirname(_os.path.abspath(__file__)), "ai_systems_content_p2.py")).read(),
             "ai_systems_content_p2.py", "exec"))
