# ai_tech_batch_c_content.py — expanded SDE3 content for batch C

def card(html, hl=False):
    c = "card highlight" if hl else "card"
    return f'<div class="{c}">{html}</div>'


def diag(slug, name, cap):
    return (
        f'<div class="diagram"><img src="img/{slug}-{name}.png" alt="{cap}"></div>'
        f'<p class="diagram-caption">{cap}</p>'
    )


def flow(steps):
    inner = "".join(
        f'<div class="step" data-num="{n}"><span class="label">{label}</span>'
        f'<div class="detail">{detail}</div></div>'
        for n, label, detail in steps
    )
    return f'<div class="flow">{inner}</div>'


TOPICS = {}

# ═══════════════════════════════════════════════════════════════════
# 1. embedding-models
# ═══════════════════════════════════════════════════════════════════
TOPICS["embedding-models"] = dict(
    title="Embedding Models",
    nav="Embeddings",
    hero="Choose and deploy text embedding models for RAG: OpenAI text-embedding-3, Cohere embed-v3, open-source BGE/E5, Matryoshka dimension truncation, cosine vs dot-product metrics, and golden-set eval before you commit to an index in your vector database.",
    tags=[
        ("text-embedding-3", ""),
        ("BGE", " orange"),
        ("Cosine", " green"),
        ("Matryoshka", " pink"),
        ("MTEB", " purple"),
    ],
    main_img="embedding-models-main.png",
    main_cap="Embedding pipeline: text &rarr; tokenizer &rarr; bi-encoder transformer &rarr; L2-normalized vector (384&ndash;3072 dim) &rarr; cosine similarity in <a href=\"vector-databases.html\">vector DB</a>. Same model at ingest and query; version tag in index namespace.",
    nav_items=[
        ("01", "what", "What & Why"),
        ("01a", "concepts", "Core Concepts"),
        ("01b", "api", "API Surface"),
        ("02", "when", "When to Use"),
        ("03", "architecture", "Architecture"),
        ("04", "models", "Model Comparison"),
        ("05", "metric", "Distance Metric"),
        ("06", "matryoshka", "Matryoshka"),
        ("07", "opensource", "Open Source"),
        ("08", "eval", "Eval"),
        ("09", "example", "Full Pipeline Example"),
        ("10", "production", "Production & Ops"),
        ("11", "where", "Where It Shows Up"),
        ("12", "pitfalls", "Pitfalls"),
        ("13", "interview", "Interview Q&A"),
    ],
    interview_num="13",
    sections=[
        (
            "what",
            "01",
            "What &amp; Why",
            card(
                """<p><strong>Embedding models</strong> convert text into dense vectors so semantic similarity becomes geometry: nearby vectors = related meaning. In <a href="../systems/rag-end-to-end.html">RAG end-to-end</a> pipelines, the embedding model sets the <em>recall ceiling</em> before chunking tuning, hybrid search, or <a href="rerankers.html">rerankers</a> can help. Wrong model, wrong metric, or mismatched ingest/query models waste all downstream work.</p>
    <h3>Functional requirements</h3>
    <ul>
      <li>Embed document chunks at ingest with stable IDs and model version metadata</li>
      <li>Embed queries at search time with the same model (or asymmetric pair for Cohere)</li>
      <li>Support batch ingest (64&ndash;256 texts/GPU batch) and low-latency single-query embed</li>
      <li>Truncate dimensions (Matryoshka) when storage cost matters</li>
      <li>Version and migrate: re-embed entire corpus on model bump</li>
    </ul>
    <h3>Non-functional requirements</h3>
    <ul>
      <li><strong>Quality:</strong> recall@5 &ge; target on domain golden set (not MTEB alone)</li>
      <li><strong>Latency:</strong> query embed &lt; 30 ms p99 (API or warm GPU worker)</li>
      <li><strong>Cost:</strong> $/1M tokens for hosted; GPU $/hour for self-host at scale</li>
      <li><strong>Consistency:</strong> L2 normalization pipeline matches vector DB distance ops</li>
      <li><strong>Compliance:</strong> air-gap option (BGE/E5 on TEI) when data cannot leave VPC</li>
    </ul>
    <blockquote><strong>Prerequisite:</strong> <a href="../fundamentals/embeddings-semantic-search.html">Embeddings &amp; Semantic Search</a> fundamentals. Vectors land in <a href="vector-databases.html">Vector Databases</a> &mdash; pick model first, index second.</blockquote>"""
            ),
        ),
        (
            "concepts",
            "01a",
            "Core Concepts",
            card(
                """<table>
      <tr><th>Term</th><th>Definition</th><th>Gotcha</th></tr>
      <tr><td><strong>Bi-encoder</strong></td><td>Single forward pass embeds query and doc independently</td><td>Fast ANN retrieval; not a reranker</td></tr>
      <tr><td><strong>Cross-encoder</strong></td><td>Joint model on [query, passage] pair</td><td>Accurate but O(pairs) &mdash; see <a href="rerankers.html">Rerankers</a></td></tr>
      <tr><td><strong>MTEB</strong></td><td>Massive Text Embedding Benchmark leaderboard</td><td>Your legal/medical domain may differ wildly</td></tr>
      <tr><td><strong>Matryoshka</strong></td><td>Embeddings trained so first k dims stay useful when truncated</td><td>OpenAI v3 <code>dimensions=512</code> param</td></tr>
      <tr><td><strong>L2 normalization</strong></td><td>Scale vector to unit length</td><td>Dot product = cosine when normalized</td></tr>
      <tr><td><strong>Asymmetric embed</strong></td><td>Different input_type for query vs document (Cohere)</td><td>Must set correctly at ingest vs query</td></tr>
      <tr><td><strong>Context length</strong></td><td>Max tokens per embed call (512&ndash;8192)</td><td>Chunk long docs first; never embed whole PDF</td></tr>
      <tr><td><strong>Model version</strong></td><td>Tag in vector metadata (e.g. <code>embed_v3_small</code>)</td><td>Mixing versions in one index breaks search</td></tr>
    </table>"""
            ),
        ),
        (
            "api",
            "01b",
            "API / Interface Surface",
            card(
                """<pre># OpenAI — default SaaS choice
from openai import OpenAI
client = OpenAI()
resp = client.embeddings.create(
    model="text-embedding-3-small",
    input=["Refund policy within 30 days", "How do I return an item?"],
    dimensions=512,  # Matryoshka truncate from 1536
)
vec = resp.data[0].embedding  # list[float], 512 dims

# Cohere — asymmetric query/doc types
import cohere
co = cohere.Client()
doc_vecs = co.embed(
    texts=chunks, model="embed-english-v3.0", input_type="search_document"
).embeddings
query_vec = co.embed(
    texts=[question], model="embed-english-v3.0", input_type="search_query"
).embeddings[0]

# Local — sentence-transformers (BGE)
from sentence_transformers import SentenceTransformer
model = SentenceTransformer("BAAI/bge-small-en-v1.5")
vecs = model.encode(texts, normalize_embeddings=True, batch_size=64)</pre>
    <table>
      <tr><th>API</th><th>Key params</th><th>Output</th></tr>
      <tr><td>OpenAI <code>embeddings.create</code></td><td><code>model</code>, <code>input</code>, <code>dimensions</code></td><td><code>data[].embedding</code> float[]</td></tr>
      <tr><td>Cohere <code>embed</code></td><td><code>input_type</code>, <code>model</code></td><td><code>embeddings</code> float[][]</td></tr>
      <tr><td>sentence-transformers</td><td><code>normalize_embeddings=True</code></td><td>numpy / torch tensor</td></tr>
      <tr><td>TEI (HuggingFace)</td><td>HTTP <code>/embed</code> batch</td><td>Production GPU batching for BGE/E5</td></tr>
    </table>"""
            ),
        ),
        (
            "when",
            "02",
            "When to Use / When NOT",
            card(
                """<table>
      <tr><th>Model / approach</th><th>Use when</th><th>Skip when</th></tr>
      <tr><td><code>text-embedding-3-small</code></td><td>Default SaaS RAG; best $/quality hosted</td><td>Air-gapped VPC, no external API</td></tr>
      <tr><td><code>text-embedding-3-large</code></td><td>Hard retrieval sets; small recall gap vs small</td><td>Cost/storage sensitive; small &lt; 3% lift on eval</td></tr>
      <tr><td>Cohere <code>embed-v3</code></td><td>Multilingual 100+ langs; asymmetric embed</td><td>English-only + already on OpenAI stack</td></tr>
      <tr><td>BGE / E5 self-host</td><td>Billions of tokens; data residency; fine-tune path</td><td>No GPU ops team; low volume (&lt;1M embeds/mo)</td></tr>
      <tr><td>Matryoshka 512-dim</td><td>Index RAM cost high; recall loss &lt; 2% on eval</td><td>Recall-critical legal/medical without validation</td></tr>
    </table>"""
            ),
        ),
        (
            "architecture",
            "03",
            "Architecture",
            card(
                """<pre>                    +------------------+
                    |  Ingest worker   |
                    |  (chunk + embed) |
                    +--------+---------+
                             | batch 64-256
                             v
                    +------------------+
                    |  Embed service   |
                    |  OpenAI / TEI    |
                    +--------+---------+
                             | vectors + embed_model tag
                             v
                    +------------------+
                    |  Vector DB       |
                    |  (ANN index)     |
                    +--------+---------+
                             ^
     Query embed (cached) ---+
                    +------------------+
                    |  Query path      |
                    |  hash(q)->vec TTL|
                    +------------------+</pre>"""
                + flow(
                    [
                        (
                            "1",
                            "Pick model",
                            "Golden-set recall@5 on 3 candidates; lock model + dim + metric",
                        ),
                        (
                            "2",
                            "Ingest",
                            "Chunk docs &rarr; embed with search_document &rarr; upsert to <a href=\"vector-databases.html\">vector DB</a> with metadata",
                        ),
                        (
                            "3",
                            "Query",
                            "Embed question (search_query) &rarr; ANN top_k &rarr; optional <a href=\"rerankers.html\">rerank</a>",
                        ),
                        (
                            "4",
                            "Cache",
                            "TTL cache query vectors by hash(question); invalidate on model change",
                        ),
                        (
                            "5",
                            "Migrate",
                            "New namespace or table per model version; dual-write then cutover",
                        ),
                    ]
                ),
            ),
        ),
        (
            "models",
            "04",
            "Model Comparison",
            diag(
                "embedding-models",
                "models-zoom",
                "Comparison: OpenAI 3-small, 3-large, Cohere embed-v3, BGE-small &mdash; dimensions, $/1M tokens, MTEB retrieval score, typical latency.",
            )
            + card(
                """<table>
      <tr><th>Model</th><th>Dim</th><th>Cost / notes</th><th>When to pick</th></tr>
      <tr><td>text-embedding-3-small</td><td>1536 (512 trunc OK)</td><td>~$0.02 / 1M tokens</td><td>Default prod RAG</td></tr>
      <tr><td>text-embedding-3-large</td><td>3072</td><td>~2&times; small cost + storage</td><td>Hard queries after small fails eval</td></tr>
      <tr><td>embed-english-v3.0</td><td>1024</td><td>Cohere pricing; asymmetric</td><td>Multilingual or Cohere rerank stack</td></tr>
      <tr><td>bge-small-en-v1.5</td><td>384</td><td>Self-host GPU/CPU</td><td>Air-gap, edge, cost at scale</td></tr>
      <tr><td>bge-large-en-v1.5</td><td>1024</td><td>Heavier GPU</td><td>Best OSS English recall</td></tr>
      <tr><td>multilingual-e5-large</td><td>1024</td><td>Self-host</td><td>50+ languages without Cohere</td></tr>
    </table>
    <blockquote><strong>Rule:</strong> Never pick from MTEB alone. Run 50&ndash;100 golden queries from your corpus through recall@5 before re-indexing millions of chunks.</blockquote>"""
            ),
        ),
        (
            "metric",
            "05",
            "Distance Metric",
            diag(
                "embedding-models",
                "metric-zoom",
                "Cosine vs L2 vs dot product: L2-normalized vectors make inner product equal to cosine; match pgvector <code>vector_cosine_ops</code> or Pinecone metric to your pipeline.",
            )
            + card(
                """<table>
      <tr><th>Metric</th><th>When</th><th>Index setting</th></tr>
      <tr><td>Cosine distance</td><td>OpenAI models; normalized OSS</td><td>pgvector <code>&lt;=&gt;</code>; Pinecone cosine</td></tr>
      <tr><td>Inner product (dot)</td><td>Normalized vectors (same as cosine)</td><td>pgvector <code>&lt;#&gt;</code> with normalized vecs</td></tr>
      <tr><td>L2 (Euclidean)</td><td>Some legacy models unnormalized</td><td>pgvector <code>&lt;-&gt;</code>; rarely default for text</td></tr>
    </table>
<pre># Always normalize OSS embeddings before upsert
import numpy as np
v = model.encode(text, normalize_embeddings=True)
# OR manually: v = v / np.linalg.norm(v)</pre>
    <p>Mismatch (cosine index + unnormalized vectors) silently degrades recall. Log embed pipeline hash in <a href="llm-observability.html">LLM observability</a> traces for debugging.</p>"""
            ),
        ),
        (
            "matryoshka",
            "06",
            "Matryoshka Representation Learning",
            card(
                """<p>OpenAI <code>text-embedding-3-*</code> supports <code>dimensions</code> parameter: truncate 1536 &rarr; 512 with ~1&ndash;3% recall loss on many general tasks. Validate on <em>your</em> golden set before committing.</p>
<pre>client.embeddings.create(
    model="text-embedding-3-small",
    input=texts,
    dimensions=512,  # stores 512-dim; still trained as Matryoshka
)</pre>
    <ul>
      <li><strong>Storage savings:</strong> 512/1536 &asymp; 67% less RAM in HNSW index</li>
      <li><strong>Same API:</strong> no model swap; only dimension param changes</li>
      <li><strong>Re-index required:</strong> changing dimensions = new vectors for all chunks</li>
      <li><strong>OSS Matryoshka:</strong> nomic-embed, some E5 variants; check model card</li>
    </ul>"""
            ),
        ),
        (
            "opensource",
            "07",
            "Open Source &amp; Self-Host",
            card(
                """<p>Deploy BGE, E5, GTE via <strong>Text Embeddings Inference (TEI)</strong> on GPU &mdash; not vLLM (LLM-only). See <a href="model-serving-vllm.html">Model Serving</a> for LLM stack; TEI is the embed analogue.</p>
<pre># TEI Docker — batch embed server
docker run --gpus all -p 8080:80 \\
  ghcr.io/huggingface/text-embeddings-inference:latest \\
  --model-id BAAI/bge-small-en-v1.5

# HTTP embed
curl http://localhost:8080/embed -d '{"inputs": ["hello world"]}'</pre>
    <ul>
      <li><strong>Fine-tune:</strong> LoRA on query-doc pairs only with 10K+ labeled pairs; re-eval vs bigger off-shelf first</li>
      <li><strong>Quantization:</strong> int8 embed models exist; verify recall on golden set</li>
      <li><strong>Observability:</strong> log batch size, GPU util, p99 embed latency per tenant</li>
    </ul>"""
            ),
        ),
        (
            "eval",
            "08",
            "Eval Before You Index",
            card(
                """<p>Compare 2&ndash;3 embedding models on the same chunk set and golden queries before full re-index. Tie to <a href="../systems/eval-harness.html">Eval Harness</a> CI and <a href="llm-observability.html">LangSmith eval datasets</a>.</p>
<pre># Pseudo-eval loop
for model in ["text-embedding-3-small", "bge-small-en-v1.5"]:
    index_golden_corpus(model)
    scores = [recall_at_k(q, gold_doc_ids, k=5) for q in golden_queries]
    print(model, np.mean(scores))</pre>
    <table>
      <tr><th>Metric</th><th>Measures</th><th>Target</th></tr>
      <tr><td>recall@5</td><td>Gold doc in top 5 ANN results</td><td>&ge; 0.85 domain-dependent</td></tr>
      <tr><td>nDCG@10</td><td>Ranked list quality</td><td>Compare before/after model swap</td></tr>
      <tr><td>Latency p99</td><td>Query embed + ANN</td><td>&lt; 50 ms total retrieve stage</td></tr>
    </table>"""
            ),
        ),
        (
            "example",
            "09",
            "Full Pipeline Example",
            card(
                """<p>End-to-end embed + upsert + query against a vector store. Swap Pinecone for <a href="vector-databases.html">pgvector</a> with the same vectors.</p>""",
                hl=True,
            )
            + card(
                """<pre>""" + """from openai import OpenAI
import hashlib

client = OpenAI()
EMBED_MODEL = "text-embedding-3-small"
DIMENSIONS = 512
NAMESPACE = "support_kb_v2"

def embed_texts(texts, input_type=None):
    # input_type ignored for OpenAI; use for Cohere
    resp = client.embeddings.create(
        model=EMBED_MODEL,
        input=texts,
        dimensions=DIMENSIONS,
    )
    return [d.embedding for d in resp.data]

def ingest_chunks(chunks):
    \"\"\"chunks: list of {id, text, metadata}\"\"\"
    vectors = embed_texts([c["text"] for c in chunks])
    upserts = []
    for c, vec in zip(chunks, vectors):
        upserts.append({
            "id": c["id"],
            "values": vec,
            "metadata": {
                **c.get("metadata", {}),
                "embed_model": EMBED_MODEL,
                "embed_dim": DIMENSIONS,
            },
        })
    vector_db.upsert(namespace=NAMESPACE, vectors=upserts)

def search(query, top_k=20):
    cache_key = hashlib.sha256(
        (query.strip().lower() + EMBED_MODEL).encode()
    ).hexdigest()
    q_vec = redis.get(cache_key)
    if q_vec is None:
        q_vec = embed_texts([query])[0]
        redis.setex(cache_key, 3600, q_vec)
    hits = vector_db.query(
        namespace=NAMESPACE,
        vector=q_vec,
        top_k=top_k,
        include_metadata=True,
    )
    return hits

# Golden eval before prod
golden = [("How do I refund?", "doc-refund-policy")]
for q, gold_id in golden:
    hits = search(q, top_k=5)
    ids = [h.id for h in hits]
    print(q, gold_id in ids, ids[:3])</pre>
    <p>Log every search in <a href="llm-observability.html">LangSmith</a> with <code>embed_model</code>, <code>namespace</code>, and hit IDs. Run reranker on hits before LLM per <a href="rerankers.html">Rerankers</a> sheet.</p>"""
            ),
        ),
        (
            "production",
            "10",
            "Production &amp; Ops",
            card(
                """<table>
      <tr><th>Concern</th><th>Practice</th></tr>
      <tr><td>Versioning</td><td>Metadata <code>embed_model=text-embedding-3-small-v1</code> on every vector</td></tr>
      <tr><td>Rate limits</td><td>Queue ingest; exponential backoff on OpenAI 429</td></tr>
      <tr><td>Batching</td><td>64&ndash;256 texts per GPU batch (TEI); 2048 inputs/OpenAI call max</td></tr>
      <tr><td>Cache</td><td>Query embed cache 5&ndash;60 min TTL; key = hash(normalized question + model)</td></tr>
      <tr><td>Migration</td><td>Blue/green namespace; re-embed async; flip router when recall validated</td></tr>
      <tr><td>Cost</td><td>Track tokens per tenant in <a href="llm-observability.html">observability</a> dashboard</td></tr>
    </table>"""
            ),
        ),
        (
            "where",
            "11",
            "Where It Shows Up",
            card(
                """<ul>
      <li><a href="vector-databases.html">Vector Databases</a> &mdash; ANN index stores embed output; metric must match</li>
      <li><a href="../systems/rag-end-to-end.html">RAG End-to-End</a> &mdash; ingest embed + query embed are bookends of retrieval</li>
      <li><a href="rerankers.html">Rerankers</a> &mdash; fix embed recall first; rerank adds precision on top</li>
      <li><a href="openai-api-patterns.html">OpenAI API Patterns</a> &mdash; batching, retries, <code>dimensions</code> param</li>
      <li><a href="llm-observability.html">LLM Observability</a> &mdash; LangSmith traces embed latency and model version per request</li>
    </ul>"""
            ),
        ),
        (
            "pitfalls",
            "12",
            "Common Pitfalls",
            card(
                """<ul>
      <li><strong>Cohere input_type mismatch</strong> &mdash; <code>search_document</code> at ingest, <code>search_query</code> at query; swapping kills recall</li>
      <li><strong>Skip normalization on OSS</strong> &mdash; upsert raw BGE vectors into cosine index</li>
      <li><strong>Embed whole documents</strong> &mdash; exceed 512&ndash;8K token limit; chunk first per <a href="../systems/rag-end-to-end.html">RAG</a> guide</li>
      <li><strong>Re-rank before fixing embed</strong> &mdash; reranker cannot recover missing gold doc from ANN</li>
      <li><strong>Mix model versions in one index</strong> &mdash; query with v3, docs embedded with ada-002</li>
      <li><strong>Trust MTEB only</strong> &mdash; legal/medical/domain jargon needs custom golden set</li>
      <li><strong>No embed_model in metadata</strong> &mdash; impossible to debug which index generation failed</li>
    </ul>"""
            ),
        ),
    ],
    qa=[
        (
            "How do you pick an embedding model for production RAG?",
            "Start with text-embedding-3-small or bge-small-en; build 50&ndash;100 golden query&rarr;doc pairs; measure recall@5 on your chunked corpus; upgrade to large or bge-large only if below target. Factor cost (API $/1M tokens vs GPU ops), latency, and air-gap requirements.",
        ),
        (
            "OpenAI text-embedding-3-small vs large?",
            "Large gives ~3&ndash;5% recall lift on hard retrieval benchmarks at ~2&times; cost and storage. A/B on your golden set; many teams stay on small + reranker for better ROI than large alone.",
        ),
        (
            "What is Matryoshka and when use it?",
            "Embeddings trained so prefix dimensions remain semantically useful. OpenAI v3 <code>dimensions=512</code> truncates from 1536 with small recall trade for ~67% index RAM savings. Always validate on domain eval before prod.",
        ),
        (
            "Cosine vs dot product vs L2?",
            "For L2-normalized vectors, cosine and dot product rank identically. Use the metric your index expects: pgvector <code>vector_cosine_ops</code> for OpenAI-style. L2 only if model docs specify unnormalized Euclidean.",
        ),
        (
            "Explain Cohere asymmetric embedding.",
            "<code>input_type=search_document</code> at ingest optimizes passages for retrieval; <code>search_query</code> at query time optimizes questions. Same model, different heads &mdash; mixing types is a common production bug.",
        ),
        (
            "When self-host vs OpenAI embeddings?",
            "Self-host (BGE/E5 + TEI) when: data cannot leave VPC, embed volume &gt; ~500M tokens/month (cost crossover), or you need fine-tuning. OpenAI when: small team, fast start, moderate volume, no GPU ops.",
        ),
        (
            "Should you fine-tune embedding models?",
            "Rare. Needs 10K+ query&ndash;passage relevance labels. Try bigger off-shelf + better chunking + reranker first. Fine-tune only when domain vocabulary is extreme (internal codes, clinical ontologies) and labels exist.",
        ),
        (
            "How handle multilingual embeddings?",
            "Cohere embed-multilingual-v3 or multilingual-e5-large; eval recall per language slice (not English-only golden set). Match reranker language model to embed stack.",
        ),
        (
            "How cache query embeddings?",
            "Key = SHA256(normalize(question) + embed_model_version). TTL 5&ndash;60 min in Redis. Invalidate all keys on model migration. Do not cache document embeddings at query time (static in index).",
        ),
        (
            "What to log in observability for embed path?",
            "Model name, dimensions, latency ms, input token count, cache hit/miss, vector DB namespace. LangSmith: wrap embed call in span; tag <code>embed_model</code> for regression compares across deploys.",
        ),
        (
            "How migrate embedding model with zero downtime?",
            "Dual-write to new namespace (v2) with new model; backfill async; run eval on v2; flip read router to v2; deprecate v1 after TTL. Never in-place overwrite mixed vectors.",
        ),
        (
            "SDE3: Design a company-wide embedding platform.",
            "Central embed API (OpenAI + TEI backends); model registry with approved versions; batch GPU workers for ingest; versioned Pinecone/pgvector namespaces; automatic re-index job on model bump; per-team cost allocation; golden eval gate in CI; query cache layer; <a href=\"llm-observability.html\">LangSmith</a> traces on every call. Consumers never pick models ad hoc.",
        ),
    ],
)

# ═══════════════════════════════════════════════════════════════════
# 2. rerankers
# ═══════════════════════════════════════════════════════════════════
TOPICS["rerankers"] = dict(
    title="Rerankers",
    nav="Rerankers",
    hero="Two-stage retrieval for production RAG: bi-encoder pulls top-50 from your vector database fast, cross-encoder reranker scores query-passage pairs with joint attention, then top-5 chunks go to the LLM. Standard +15&ndash;25% nDCG precision boost after ANN recall.",
    tags=[
        ("Cross-Encoder", ""),
        ("Two-Stage", " orange"),
        ("Cohere", " green"),
        ("bge-reranker", " pink"),
        ("Latency", " purple"),
    ],
    main_img="rerankers-main.png",
    main_cap="Two-stage pipeline: <a href=\"vector-databases.html\">vector DB</a> top_k=50 (~20 ms) &rarr; cross-encoder rerank (~50&ndash;80 ms for 50 pairs) &rarr; top 5 chunks to LLM. Typical +15&ndash;25% nDCG vs bi-encoder alone in <a href=\"../systems/rag-end-to-end.html\">RAG</a> stacks.",
    nav_items=[
        ("01", "what", "What & Why"),
        ("01a", "concepts", "Core Concepts"),
        ("01b", "api", "API Surface"),
        ("02", "when", "When to Use"),
        ("03", "architecture", "Architecture"),
        ("04", "cross", "Cross-Encoder"),
        ("05", "models", "Models"),
        ("06", "pipeline", "Pipeline Tuning"),
        ("07", "latency", "Latency"),
        ("08", "compare", "Hosted vs Local"),
        ("09", "example", "Full RAG Retrieve Example"),
        ("10", "production", "Production & Ops"),
        ("11", "where", "Where It Shows Up"),
        ("12", "pitfalls", "Pitfalls"),
        ("13", "interview", "Interview Q&A"),
    ],
    interview_num="13",
    sections=[
        (
            "what",
            "01",
            "What &amp; Why",
            card(
                """<p><strong>Rerankers</strong> solve the precision gap left by bi-encoder retrieval. Embeddings compare query and document vectors independently &mdash; fast but shallow. <strong>Cross-encoders</strong> run one transformer over the concatenated [query, passage] pair with full cross-attention &mdash; accurate but O(n) at query time. Industry standard: retrieve wide (k=50), rerank narrow (n=5).</p>
    <h3>Functional requirements</h3>
    <ul>
      <li>Accept query + list of candidate passage texts (from ANN or hybrid fusion)</li>
      <li>Return relevance scores and top_n ranked passages</li>
      <li>Support batch scoring of pairs on GPU for latency</li>
      <li>Optional score threshold to drop irrelevant chunks (reduce hallucination)</li>
      <li>Fallback to ANN order on timeout</li>
    </ul>
    <h3>Non-functional requirements</h3>
    <ul>
      <li><strong>Latency:</strong> retrieve + rerank &lt; 150 ms p99 for interactive RAG</li>
      <li><strong>Quality:</strong> +10&ndash;25% nDCG@5 vs ANN-only on golden set</li>
      <li><strong>Availability:</strong> degrade gracefully if reranker down</li>
      <li><strong>Language:</strong> match reranker to query corpus language</li>
    </ul>
    <blockquote><strong>Stack position:</strong> After <a href="embedding-models.html">embedding</a> + <a href="vector-databases.html">vector DB</a> (+ optional hybrid). Before LLM prompt assembly in <a href="../systems/rag-end-to-end.html">RAG end-to-end</a>.</blockquote>"""
            ),
        ),
        (
            "concepts",
            "01a",
            "Core Concepts",
            card(
                """<table>
      <tr><th>Term</th><th>Definition</th><th>Gotcha</th></tr>
      <tr><td><strong>Bi-encoder</strong></td><td>Separate query/doc embeddings; cosine ANN</td><td>Retrieval stage only; see <a href="embedding-models.html">Embedding Models</a></td></tr>
      <tr><td><strong>Cross-encoder</strong></td><td>Single model on [query, passage]</td><td>Cannot pre-index doc side</td></tr>
      <tr><td><strong>retrieve_k</strong></td><td>ANN candidates before rerank (20&ndash;100)</td><td>Too low = miss gold doc; too high = latency</td></tr>
      <tr><td><strong>rerank_n</strong></td><td>Passages passed to LLM (3&ndash;8)</td><td>More context = higher LLM cost/latency</td></tr>
      <tr><td><strong>nDCG@k</strong></td><td>Normalized discounted cumulative gain</td><td>Primary offline metric for rerank A/B</td></tr>
      <tr><td><strong>Score threshold</strong></td><td>Drop passages below e.g. 0.3</td><td>Reduces noise; may over-filter short queries</td></tr>
      <tr><td><strong>Lite rerank</strong></td><td>ms-marco-MiniLM on CPU</td><td>Dev only; not prod p99 at k=50</td></tr>
    </table>"""
            ),
        ),
        (
            "api",
            "01b",
            "API / Interface Surface",
            card(
                """<pre># Cohere Rerank — hosted, zero GPU ops
import cohere
co = cohere.Client()
result = co.rerank(
    model="rerank-english-v3.0",
    query=user_question,
    documents=passage_texts,  # top_k from vector DB
    top_n=5,
    return_documents=True,
)
for hit in result.results:
    print(hit.index, hit.relevance_score, hit.document.text)

# Local cross-encoder — bge-reranker on GPU
from sentence_transformers import CrossEncoder
ce = CrossEncoder("BAAI/bge-reranker-v2-m3", max_length=512)
pairs = [[query, p] for p in passages]
scores = ce.predict(pairs, batch_size=32)
ranked = sorted(zip(passages, scores), key=lambda x: -x[1])[:5]</pre>
    <table>
      <tr><th>API</th><th>Input</th><th>Output</th></tr>
      <tr><td>Cohere <code>rerank</code></td><td><code>query</code>, <code>documents[]</code>, <code>top_n</code></td><td><code>results[].relevance_score</code>, <code>index</code></td></tr>
      <tr><td>CrossEncoder <code>predict</code></td><td>List of [query, doc] pairs</td><td>Float scores per pair</td></tr>
      <tr><td>Jina / Voyage rerank API</td><td>Same shape as Cohere</td><td>Hosted alternative</td></tr>
    </table>"""
            ),
        ),
        (
            "when",
            "02",
            "When to Use / When NOT",
            card(
                """<table>
      <tr><th>Scenario</th><th>Rerank?</th><th>Alternative</th></tr>
      <tr><td>Production RAG Q&amp;A</td><td><strong>Yes</strong> &mdash; default stack</td><td>Only if hard &lt;100 ms SLA</td></tr>
      <tr><td>After hybrid BM25+vector</td><td><strong>Yes</strong> &mdash; hybrid fixes recall; rerank fixes precision</td><td>Skipping rerank leaves fused-list noise</td></tr>
      <tr><td>Tiny corpus (&lt;500 docs)</td><td><strong>Maybe</strong></td><td>Full cross-encoder scan acceptable</td></tr>
      <tr><td>Sub-100 ms total retrieve SLA</td><td><strong>No / lite</strong></td><td>Bi-encoder only; smaller k</td></tr>
      <tr><td>Batch offline indexing</td><td><strong>No</strong></td><td>Rerank is query-time only</td></tr>
    </table>"""
            ),
        ),
        (
            "architecture",
            "03",
            "Architecture",
            card(
                """<pre>  User Query
      |
      v
 +----------+     +----------------+     +-------------+     +-----+
 |  Embed   | --> |  Vector DB     | --> |  Reranker   | --> | LLM |
 |  query   |     |  top_k=50      |     |  top_n=5    |     |     |
 +----------+     +----------------+     +-------------+     +-----+
      ^                    |                     |
      |                    | hybrid optional     | scores logged
      +--------------------+---------------------+
              <a href="../systems/rag-end-to-end.html">RAG orchestrator</a></pre>"""
                + flow(
                    [
                        (
                            "1",
                            "Retrieve",
                            "ANN top_k=50 from <a href=\"vector-databases.html\">vector DB</a> (or hybrid fused list)",
                        ),
                        (
                            "2",
                            "Rerank",
                            "Batch score 50 query-passage pairs; sort by score; take top_n=5",
                        ),
                        (
                            "3",
                            "Filter",
                            "Drop scores &lt; threshold; if empty fallback to ANN top-3",
                        ),
                        (
                            "4",
                            "Prompt",
                            "Inject ranked chunks into context window; cite chunk IDs in trace",
                        ),
                        (
                            "5",
                            "Observe",
                            "Log rerank scores + order in <a href=\"llm-observability.html\">LangSmith</a> span",
                        ),
                    ]
                ),
            ),
        ),
        (
            "cross",
            "04",
            "Cross-Encoder Deep Dive",
            diag(
                "rerankers",
                "crossencoder-zoom",
                "Cross-encoder joint attention on [query, passage] token sequence; outputs single relevance score 0&ndash;1. Cannot pre-compute document representations.",
            )
            + card(
                """<p>Bi-encoder: <code>sim(embed(q), embed(d))</code> &mdash; dot product of independent vectors. Cross-encoder: <code>score(q, d) = softmax(Transformer([CLS] q [SEP] d))</code> &mdash; every query token attends to every doc token.</p>
    <ul>
      <li><strong>Why slower:</strong> 50 passages = 50 forward passes (batched on GPU)</li>
      <li><strong>Why better:</strong> Captures term overlap, negation, entity match bi-encoder misses</li>
      <li><strong>Max length:</strong> typically 512 tokens combined; truncate long chunks with head+tail</li>
    </ul>
    <blockquote><strong>Interview one-liner:</strong> Retrieve with bi-encoder (indexable); rerank with cross-encoder (query-time). Never scan full corpus with cross-encoder.</blockquote>"""
            ),
        ),
        (
            "models",
            "05",
            "Model Comparison",
            card(
                """<table>
      <tr><th>Model</th><th>Host</th><th>Language</th><th>Notes</th></tr>
      <tr><td>Cohere rerank-english-v3.0</td><td>API</td><td>English</td><td>Zero ops; ~100&ndash;200 ms for 50 docs</td></tr>
      <tr><td>Cohere rerank-multilingual-v3.0</td><td>API</td><td>100+ langs</td><td>Match embed-multilingual stack</td></tr>
      <tr><td>bge-reranker-v2-m3</td><td>Self GPU</td><td>Multilingual</td><td>Best OSS; batch on A10</td></tr>
      <tr><td>ms-marco-MiniLM-L-6-v2</td><td>CPU/GPU</td><td>English</td><td>Fast dev; weaker on hard sets</td></tr>
    </table>"""
            ),
        ),
        (
            "pipeline",
            "06",
            "Pipeline Tuning",
            diag(
                "rerankers",
                "pipeline-zoom",
                "Pipeline tuning: sweep retrieve_k &isin; {20, 50, 100} and rerank_n &isin; {3, 5, 8}; plot nDCG@5 vs total latency; sweet spot often k=50, n=5 under 120 ms budget.",
            )
            + card(
                """<pre># Grid search on golden set (offline)
for k in [20, 50, 100]:
    for n in [3, 5, 8]:
        ndcg = eval_pipeline(retrieve_k=k, rerank_n=n)
        lat = measure_p99_latency(k, n)
        print(k, n, ndcg, lat)</pre>
    <ul>
      <li>If recall@50 low on eval &rarr; increase k or fix <a href="embedding-models.html">embeddings</a>/chunking first</li>
      <li>If latency high &rarr; decrease k or GPU batch tune; consider Cohere vs local</li>
      <li>Diminishing returns above k=50 for most corpora &lt;10M chunks</li>
    </ul>"""
            ),
        ),
        (
            "latency",
            "07",
            "Latency Budget",
            card(
                """<table>
      <tr><th>Stage</th><th>Typical p99</th><th>Knobs</th></tr>
      <tr><td>Query embed</td><td>10&ndash;30 ms</td><td>Cache query vector</td></tr>
      <tr><td>Vector ANN k=50</td><td>15&ndash;40 ms</td><td>HNSW ef_search; warm index</td></tr>
      <tr><td>Cross-encoder 50 pairs GPU</td><td>50&ndash;80 ms</td><td>batch_size=32; A10/L4</td></tr>
      <tr><td>Cohere rerank API</td><td>100&ndash;200 ms</td><td>Network; reduce k</td></tr>
      <tr><td><strong>Total retrieve stage</strong></td><td><strong>&lt;150 ms</strong></td><td>Profile per component in traces</td></tr>
    </table>"""
            ),
        ),
        (
            "compare",
            "08",
            "Hosted vs Self-Host",
            card(
                """<table>
      <tr><th></th><th>Cohere / Jina API</th><th>bge-reranker GPU</th></tr>
      <tr><td>Ops</td><td>Zero</td><td>K8s GPU pool, model load</td></tr>
      <tr><td>Cost at low QPS</td><td>Cheaper</td><td>GPU always-on expensive</td></tr>
      <tr><td>Cost at high QPS</td><td>Per-call adds up</td><td>Fixed GPU $/hour wins</td></tr>
      <tr><td>Air-gap</td><td>No</td><td>Yes</td></tr>
      <tr><td>Latency</td><td>Network overhead</td><td>In-VPC 50&ndash;80 ms</td></tr>
    </table>"""
            ),
        ),
        (
            "example",
            "09",
            "Full RAG Retrieve Example",
            card(
                """<p>Complete retrieve + rerank stage wired into a RAG orchestrator. Traces each step for <a href="llm-observability.html">LangSmith</a>.</p>""",
                hl=True,
            )
            + card(
                """<pre>""" + """import cohere
from openai import OpenAI
from langsmith import traceable

co = cohere.Client()
oai = OpenAI()
RETRIEVE_K = 50
RERANK_N = 5
SCORE_FLOOR = 0.28

@traceable(name="retrieve_and_rerank")
def retrieve_and_rerank(query: str, namespace: str):
    # 1) Embed query (same model as ingest — see embedding-models sheet)
    q_vec = oai.embeddings.create(
        model="text-embedding-3-small",
        input=[query],
        dimensions=512,
    ).data[0].embedding

    # 2) ANN from vector DB
    ann = vector_db.query(
        namespace=namespace,
        vector=q_vec,
        top_k=RETRIEVE_K,
        include_metadata=True,
    )
    passages = [h.metadata["text"] for h in ann.matches]

    # 3) Cross-encoder rerank
    reranked = co.rerank(
        model="rerank-english-v3.0",
        query=query,
        documents=passages,
        top_n=RERANK_N,
    )

    # 4) Score threshold — drop irrelevant chunks
    results = []
    for hit in reranked.results:
        if hit.relevance_score >= SCORE_FLOOR:
            results.append({
                "text": passages[hit.index],
                "score": hit.relevance_score,
                "chunk_id": ann.matches[hit.index].id,
            })

    if not results:
        # Fallback: ANN top-3 if rerank filters everything
        results = [{"text": passages[i], "score": None} for i in range(3)]

    return results</pre>"""
            ),
        ),
        (
            "production",
            "10",
            "Production &amp; Ops",
            card(
                """<table>
      <tr><th>Concern</th><th>Practice</th></tr>
      <tr><td>Fallback</td><td>On reranker timeout &gt;200 ms return ANN top-5; alert SRE</td></tr>
      <tr><td>Logging</td><td>Log all 50 scores + final order; detect drift (mean score drop)</td></tr>
      <tr><td>A/B</td><td>Shadow new reranker model; compare nDCG on sampled traffic</td></tr>
      <tr><td>Tracing</td><td>LangSmith span <code>rerank</code> with input indices + scores output</td></tr>
      <tr><td>Autoscale</td><td>GPU HPA on queue depth; min replicas &gt;0 (cold start ~30s)</td></tr>
    </table>"""
            ),
        ),
        (
            "where",
            "11",
            "Where It Shows Up",
            card(
                """<ul>
      <li><a href="vector-databases.html">Vector Databases</a> &mdash; rerank follows ANN top_k</li>
      <li><a href="../systems/rag-end-to-end.html">RAG End-to-End</a> &mdash; standard stage 3 after retrieve</li>
      <li><a href="../systems/hybrid-search.html">Hybrid Search</a> &mdash; rerank the fused BM25+vector list</li>
      <li><a href="embedding-models.html">Embedding Models</a> &mdash; fix bi-encoder recall before tuning rerank k</li>
      <li><a href="llm-observability.html">LLM Observability</a> &mdash; LangSmith rerank span with scores for debug</li>
    </ul>"""
            ),
        ),
        (
            "pitfalls",
            "12",
            "Common Pitfalls",
            card(
                """<ul>
      <li><strong>Rerank 200+ passages</strong> &mdash; GPU/API timeout; cap k at 50&ndash;100</li>
      <li><strong>Skip rerank because hybrid exists</strong> &mdash; hybrid improves recall, not final precision</li>
      <li><strong>Wrong language model</strong> &mdash; English reranker on multilingual queries</li>
      <li><strong>No fallback</strong> &mdash; reranker outage blocks entire RAG path</li>
      <li><strong>Ignore score threshold</strong> &mdash; passing irrelevant chunk #5 causes hallucination</li>
      <li><strong>Truncate query not passage</strong> &mdash; cross-encoder max_length applies to pair</li>
    </ul>"""
            ),
        ),
    ],
    qa=[
        (
            "Bi-encoder vs cross-encoder?",
            "Bi-encoder embeds query and doc separately for fast ANN. Cross-encoder jointly models the pair for accurate relevance scoring. Use bi-encoder to retrieve top_k, cross-encoder to rerank to top_n.",
        ),
        (
            "Why not use only cross-encoder for retrieval?",
            "Cross-encoder cannot pre-compute document vectors &mdash; each query requires O(corpus) forward passes. Two-stage retrieve-then-rerank is the industry standard at scale.",
        ),
        (
            "How many candidates should you rerank?",
            "Start retrieve_k=50, rerank_n=5. Increase k if recall@50 is low on golden eval. Decrease k if p99 latency exceeds budget. Sweep offline before prod.",
        ),
        (
            "Cohere rerank vs bge-reranker-v2-m3?",
            "Cohere: hosted, easy, network latency. bge: self-host on GPU, air-gap, cheaper at high QPS. Same API shape; pick on ops and compliance.",
        ),
        (
            "Does rerank help after hybrid search?",
            "Yes. Hybrid fusion improves recall (keyword + semantic). Rerank re-orders the fused list for precision. Always rerank the final candidate list.",
        ),
        (
            "What score threshold to use?",
            "Start 0.25&ndash;0.35 on cross-encoder logits; tune on golden set to balance empty-context vs noise. Log filtered count in observability.",
        ),
        (
            "How measure rerank lift?",
            "nDCG@5 and MRR on golden set: compare ANN-only vs ANN+rerank. Expect +10&ndash;25% nDCG on typical enterprise corpora.",
        ),
        (
            "Latency budget for interactive RAG?",
            "Target retrieve+rerank &lt;150 ms p99. Batch cross-encoder pairs; profile embed, ANN, rerank separately in LangSmith waterfall.",
        ),
        (
            "Fine-tune a reranker?",
            "With click/logs query-passage relevance pairs. Smaller lift than fixing chunking/embeddings; advanced optimization after baseline stack works.",
        ),
        (
            "Failure fallback strategy?",
            "Timeout rerank at 200 ms &rarr; return ANN top-5 in original order &rarr; alert &rarr; degrade banner optional. Never fail closed on reranker alone.",
        ),
        (
            "Multilingual rerank setup?",
            "bge-reranker-v2-m3 or Cohere rerank-multilingual-v3. Match to <a href=\"embedding-models.html\">embedding model</a> language coverage.",
        ),
        (
            "SDE3: Design a rerank microservice.",
            "Stateless GPU pods behind gRPC/REST; batch endpoint accepts query + passages[]; returns scored indices; SLO 80 ms p99 for k=50; autoscale on queue depth; no caching (query-specific); shadow deploy new model versions; LangSmith trace integration; fallback flag in response metadata.",
        ),
    ],
)

# ═══════════════════════════════════════════════════════════════════
# 3. model-serving-vllm
# ═══════════════════════════════════════════════════════════════════
TOPICS["model-serving-vllm"] = dict(
    title="Model Serving (vLLM / Ollama)",
    nav="vLLM / Ollama",
    hero="Serve open-weight LLMs locally: vLLM for production GPU throughput (PagedAttention, continuous batching, OpenAI-compatible API), Ollama for laptop dev and quick pulls, quantization (AWQ/GPTQ), GPU sizing, and hybrid routing with cloud APIs.",
    tags=[
        ("vLLM", ""),
        ("Ollama", " orange"),
        ("PagedAttention", " green"),
        ("Quantization", " pink"),
        ("OpenAI API", " purple"),
    ],
    main_img="model-serving-vllm-main.png",
    main_cap="vLLM serving: OpenAI-compatible <code>/v1/chat/completions</code> &rarr; scheduler &rarr; PagedAttention KV cache &rarr; GPU workers. 5&ndash;20&times; throughput vs naive HuggingFace <code>generate</code> on same hardware for <a href=\"../systems/rag-end-to-end.html\">RAG</a> and agent workloads.",
    nav_items=[
        ("01", "what", "What & Why"),
        ("01a", "concepts", "Core Concepts"),
        ("01b", "api", "API Surface"),
        ("02", "when", "When to Use"),
        ("03", "architecture", "Architecture"),
        ("04", "vllm", "vLLM Deep Dive"),
        ("05", "ollama", "Ollama Deep Dive"),
        ("06", "quant", "Quantization"),
        ("07", "gpu", "GPU Sizing"),
        ("08", "compare", "vLLM vs Ollama"),
        ("09", "example", "Full Client Example"),
        ("10", "production", "Production & Ops"),
        ("11", "where", "Where It Shows Up"),
        ("12", "pitfalls", "Pitfalls"),
        ("13", "interview", "Interview Q&A"),
    ],
    interview_num="13",
    sections=[
        (
            "what",
            "01",
            "What &amp; Why",
            card(
                """<p>Self-host Llama, Mistral, Qwen when <strong>data residency</strong>, <strong>cost at scale</strong>, or <strong>predictable latency</strong> beat closed APIs. <strong>vLLM</strong> is the production inference engine; <strong>Ollama</strong> is the developer UX layer for local iteration. Both expose OpenAI-shaped APIs so LangChain/LangGraph code swaps with a <code>base_url</code> change.</p>
    <h3>Functional requirements</h3>
    <ul>
      <li>Chat completions with streaming tokens</li>
      <li>Concurrent requests with batching (not one-at-a-time)</li>
      <li>Tool calling / JSON mode for agent graphs</li>
      <li>Configurable context length and temperature per model</li>
      <li>Embeddings served separately via TEI (not vLLM)</li>
    </ul>
    <h3>Non-functional requirements</h3>
    <ul>
      <li><strong>Throughput:</strong> maximize tokens/sec per GPU via continuous batching</li>
      <li><strong>Memory:</strong> fit model weights + KV cache in VRAM (quantization helps)</li>
      <li><strong>Latency:</strong> TTFT &lt; 500 ms; streaming for UX</li>
      <li><strong>Availability:</strong> health checks, rolling deploy, queue depth autoscale</li>
    </ul>
    <blockquote><strong>Not for embeddings:</strong> use TEI for <a href="embedding-models.html">embedding models</a>. vLLM is LLM generation only.</blockquote>"""
            ),
        ),
        (
            "concepts",
            "01a",
            "Core Concepts",
            card(
                """<table>
      <tr><th>Term</th><th>Definition</th><th>Gotcha</th></tr>
      <tr><td><strong>PagedAttention</strong></td><td>KV cache stored in non-contiguous fixed blocks</td><td>vLLM core; reduces fragmentation</td></tr>
      <tr><td><strong>Continuous batching</strong></td><td>Add/remove requests mid-forward-pass</td><td>vs static batching in naive HF</td></tr>
      <tr><td><strong>Prefix caching</strong></td><td>Reuse KV blocks for identical prompt prefixes</td><td>Big win for shared RAG system prompts</td></tr>
      <tr><td><strong>AWQ / GPTQ</strong></td><td>4-bit weight quantization</td><td>~1&ndash;3% quality loss; 4&times; memory savings</td></tr>
      <tr><td><strong>Tensor parallel (TP)</strong></td><td>Split layers across GPUs</td><td><code>--tensor-parallel-size 2</code> for 70B</td></tr>
      <tr><td><strong>OpenAI compat</strong></td><td><code>/v1/chat/completions</code> schema</td><td>Point SDK <code>base_url</code> at vLLM</td></tr>
      <tr><td><strong>Modelfile</strong></td><td>Ollama config for system prompt + params</td><td>Dev convenience; not prod multi-tenant</td></tr>
    </table>"""
            ),
        ),
        (
            "api",
            "01b",
            "API / Interface Surface",
            card(
                """<pre># Start vLLM OpenAI server
python -m vllm.entrypoints.openai.api_server \\
  --model meta-llama/Llama-3.1-8B-Instruct \\
  --tensor-parallel-size 1 \\
  --gpu-memory-utilization 0.9 \\
  --max-model-len 8192 \\
  --enable-prefix-caching

# Client — identical to OpenAI SDK
from openai import OpenAI
client = OpenAI(base_url="http://gpu-host:8000/v1", api_key="dummy")
stream = client.chat.completions.create(
    model="meta-llama/Llama-3.1-8B-Instruct",
    messages=[{"role": "user", "content": "Summarize RAG in 3 bullets"}],
    stream=True,
)

# Ollama — local dev
# ollama pull llama3.1
# ollama run llama3.1
# curl http://localhost:11434/api/chat -d '{"model":"llama3.1","messages":[...]}'</pre>
    <table>
      <tr><th>Endpoint</th><th>Engine</th><th>Use</th></tr>
      <tr><td><code>/v1/chat/completions</code></td><td>vLLM, Ollama</td><td>Chat + agents</td></tr>
      <tr><td><code>/v1/completions</code></td><td>vLLM</td><td>Legacy completion</td></tr>
      <tr><td><code>/v1/models</code></td><td>vLLM</td><td>Health / model list</td></tr>
      <tr><td><code>/embed</code></td><td>TEI</td><td>Embeddings (separate service)</td></tr>
    </table>"""
            ),
        ),
        (
            "when",
            "02",
            "When to Use / When NOT",
            card(
                """<table>
      <tr><th>Case</th><th>Self-host?</th><th>Alternative</th></tr>
      <tr><td>Data cannot leave VPC</td><td><strong>vLLM</strong></td><td>Azure OpenAI private</td></tr>
      <tr><td>Laptop prototype / demo</td><td><strong>Ollama</strong></td><td>OpenAI API for speed</td></tr>
      <tr><td>High QPS, 8B&ndash;70B open models</td><td><strong>vLLM cluster</strong></td><td>Closed API $/token at scale</td></tr>
      <tr><td>Frontier reasoning (GPT-4o, o1)</td><td><strong>No</strong></td><td>Cloud API still wins quality</td></tr>
      <tr><td>Hybrid router</td><td><strong>vLLM + OpenAI</strong></td><td>Easy queries local; hard to cloud</td></tr>
    </table>"""
            ),
        ),
        (
            "architecture",
            "03",
            "Architecture",
            card(
                """<pre>          +------------------+
          |  API Gateway     |
          |  (auth, routing) |
          +--------+---------+
                   |
       +-----------+-----------+
       v                       v
+-------------+         +-------------+
| vLLM rep 1  |         | vLLM rep 2  |
| GPU A10     |         | GPU A10     |
+------+------+         +------+------+
       |                       |
       +-----------+-----------+
                   v
          +------------------+
          |  Model weights   |
          |  + KV cache RAM  |
          +------------------+</pre>"""
                + flow(
                    [
                        (
                            "1",
                            "Route",
                            "Gateway picks model + GPU pool; optional cloud fallback",
                        ),
                        (
                            "2",
                            "Schedule",
                            "vLLM continuous batching merges concurrent requests",
                        ),
                        (
                            "3",
                            "Generate",
                            "PagedAttention KV blocks; stream tokens to client",
                        ),
                        (
                            "4",
                            "Observe",
                            "Log tokens/sec, queue depth, TTFT in <a href=\"llm-observability.html\">LangSmith</a>",
                        ),
                    ]
                ),
            ),
        ),
        (
            "vllm",
            "04",
            "vLLM Deep Dive",
            diag(
                "model-serving-vllm",
                "vllm-zoom",
                "PagedAttention: KV cache split into fixed-size blocks with block table (like OS virtual memory); continuous batching scheduler adds new requests without waiting for batch completion.",
            )
            + card(
                """<p>Key flags for production <a href="../systems/rag-end-to-end.html">RAG</a>:</p>
<pre>--enable-prefix-caching     # shared system prompts
--max-model-len 8192        # cap KV RAM; lower if OOM
--gpu-memory-utilization 0.9
--tensor-parallel-size 2    # 70B across 2 GPUs
--quantization awq          # 4-bit weights</pre>
    <ul>
      <li><strong>Prefix caching:</strong> identical RAG system prompt + tool defs cached across users</li>
      <li><strong>Speculative decoding:</strong> draft model + verify (advanced latency win)</li>
      <li><strong>Structured output:</strong> guided JSON for tool calls</li>
    </ul>"""
            ),
        ),
        (
            "ollama",
            "05",
            "Ollama Deep Dive",
            diag(
                "model-serving-vllm",
                "ollama-zoom",
                "Ollama stack: ollama pull &rarr; Modelfile (SYSTEM, PARAMETER temperature) &rarr; ollama serve :11434 &rarr; REST /api/chat. Single-user GPU; not multi-tenant production.",
            )
            + card(
                """<pre># Modelfile example
FROM llama3.1
SYSTEM You are a helpful support bot. Cite sources.
PARAMETER temperature 0.2
PARAMETER num_ctx 8192

# ollama create support-bot -f Modelfile
# ollama run support-bot</pre>
    <p>Use Ollama for: local LangGraph dev, CI smoke tests, sales demos. Do <em>not</em> use for multi-tenant SaaS prod &mdash; no HA, queue, or autoscale story.</p>"""
            ),
        ),
        (
            "quant",
            "06",
            "Quantization",
            card(
                """<table>
      <tr><th>Method</th><th>Bits</th><th>VRAM (8B)</th><th>Quality</th></tr>
      <tr><td>FP16</td><td>16</td><td>~16 GB</td><td>Baseline</td></tr>
      <tr><td>AWQ / GPTQ</td><td>4</td><td>~5&ndash;6 GB</td><td>~1&ndash;3% task loss</td></tr>
      <tr><td>FP8</td><td>8</td><td>~8 GB</td><td>Minimal loss on H100</td></tr>
    </table>
    <p>Always benchmark on your eval harness before prod quant deploy. Perplexity alone is insufficient &mdash; run golden RAG/agent tasks.</p>"""
            ),
        ),
        (
            "gpu",
            "07",
            "GPU Sizing",
            card(
                """<table>
      <tr><th>Model</th><th>Precision</th><th>GPU</th><th>Notes</th></tr>
      <tr><td>Llama-3-8B</td><td>FP16</td><td>1&times; A10/L4 24GB</td><td>Headroom for KV cache</td></tr>
      <tr><td>Llama-3-8B</td><td>AWQ 4-bit</td><td>1&times; T4 16GB</td><td>More concurrent users</td></tr>
      <tr><td>Llama-3-70B</td><td>AWQ</td><td>2&times; A100 80GB (TP=2)</td><td>tensor parallel required</td></tr>
    </table>
    <p>KV cache RAM scales with <code>max_model_len &times; concurrent_requests</code>. OOM usually from context too long, not weights.</p>"""
            ),
        ),
        (
            "compare",
            "08",
            "vLLM vs Ollama",
            card(
                """<table>
      <tr><th>Dimension</th><th>vLLM</th><th>Ollama</th></tr>
      <tr><td>Target</td><td>Production GPU cluster</td><td>Local dev / demo</td></tr>
      <tr><td>Throughput</td><td>Very high (continuous batch)</td><td>Moderate (single user)</td></tr>
      <tr><td>Setup</td><td>Docker/K8s, flags tuning</td><td><code>ollama pull</code></td></tr>
      <tr><td>Multi-tenant</td><td>Yes with LB + replicas</td><td>No</td></tr>
      <tr><td>OpenAI API</td><td>Full compat</td><td>Similar /api/chat</td></tr>
      <tr><td>Observability</td><td>Prometheus metrics</td><td>Minimal</td></tr>
    </table>"""
            ),
        ),
        (
            "example",
            "09",
            "Full Client Example",
            card(
                """<p>Point LangChain / OpenAI SDK at vLLM for a RAG generation node. Embeddings still go to OpenAI or TEI per <a href="embedding-models.html">Embedding Models</a>.</p>""",
                hl=True,
            )
            + card(
                """<pre>""" + """from openai import OpenAI
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, SystemMessage

# Direct OpenAI SDK against vLLM
vllm = OpenAI(base_url="http://gpu-cluster:8000/v1", api_key="dummy")

def generate_answer(query: str, context_chunks: list[str]) -> str:
    context = "\\n\\n".join(f"[{i+1}] {c}" for i, c in enumerate(context_chunks))
    resp = vllm.chat.completions.create(
        model="meta-llama/Llama-3.1-8B-Instruct",
        messages=[
            {"role": "system", "content": "Answer using only the context. Cite [n]."},
            {"role": "user", "content": f"Context:\\n{context}\\n\\nQuestion: {query}"},
        ],
        temperature=0.2,
        max_tokens=512,
        stream=False,
    )
    return resp.choices[0].message.content

# LangChain — same base_url swap for LangGraph nodes
llm = ChatOpenAI(
    model="meta-llama/Llama-3.1-8B-Instruct",
    openai_api_base="http://gpu-cluster:8000/v1",
    openai_api_key="dummy",
    temperature=0.2,
)

# Ollama dev equivalent
# llm = ChatOpenAI(model="llama3.1", openai_api_base="http://localhost:11434/v1", ...)</pre>
    <p>Enable prefix caching on vLLM when system prompt + tool defs are identical across users. Monitor TTFT and tokens/sec in <a href="llm-observability.html">LangSmith</a>.</p>"""
            ),
        ),
        (
            "production",
            "10",
            "Production &amp; Ops",
            card(
                """<table>
      <tr><th>Concern</th><th>Practice</th></tr>
      <tr><td>Health</td><td><code>GET /v1/models</code>; readiness when model loaded</td></tr>
      <tr><td>Autoscale</td><td>HPA on GPU queue depth + p99 TTFT; min replicas &gt;0</td></tr>
      <tr><td>Deploy</td><td>Rolling drain; warm model load ~1&ndash;3 min</td></tr>
      <tr><td>Routing</td><td>Gateway: easy &rarr; local 8B; hard &rarr; GPT-4o cloud</td></tr>
      <tr><td>Tracing</td><td>LangSmith: log model name, tokens, latency per request</td></tr>
      <tr><td>Security</td><td>Network isolate GPU nodes; no public ingress</td></tr>
    </table>"""
            ),
        ),
        (
            "where",
            "11",
            "Where It Shows Up",
            card(
                """<ul>
      <li><a href="openai-api-patterns.html">OpenAI API Patterns</a> &mdash; same SDK with <code>base_url</code> swap</li>
      <li><a href="embedding-models.html">Embedding Models</a> &mdash; TEI for embed; vLLM for generate</li>
      <li><a href="langgraph.html">LangGraph</a> &mdash; ChatOpenAI pointed at vLLM for agent loops</li>
      <li><a href="../systems/rag-end-to-end.html">RAG End-to-End</a> &mdash; generation node after retrieve+rerank</li>
      <li><a href="llm-observability.html">LLM Observability</a> &mdash; token/cost/latency per model replica</li>
    </ul>"""
            ),
        ),
        (
            "pitfalls",
            "12",
            "Common Pitfalls",
            card(
                """<ul>
      <li><strong>Ollama in prod multi-tenant</strong> &mdash; no SLO, queue, or HA story</li>
      <li><strong>OOM from max-model-len too high</strong> &mdash; lower len or reduce concurrent requests</li>
      <li><strong>No batching / single-thread HF</strong> &mdash; 5&ndash;20&times; throughput left on table</li>
      <li><strong>vLLM for embeddings</strong> &mdash; use TEI instead</li>
      <li><strong>Skip quant eval</strong> &mdash; deploy AWQ without task benchmark</li>
      <li><strong>Cold start on scale-to-zero</strong> &mdash; first request 60s+ model load</li>
    </ul>"""
            ),
        ),
    ],
    qa=[
        (
            "vLLM vs HuggingFace generate?",
            "vLLM adds PagedAttention + continuous batching for 5&ndash;20&times; throughput on concurrent requests. HF generate is fine for single-request notebooks, not prod serving.",
        ),
        (
            "What is PagedAttention?",
            "KV cache stored in non-contiguous fixed blocks with a block table, like OS virtual memory. Reduces fragmentation so more concurrent requests fit in GPU RAM.",
        ),
        (
            "When use Ollama vs vLLM?",
            "Ollama: laptop dev, demos, Modelfile experiments. vLLM: production K8s GPU pool with autoscale, prefix caching, and OpenAI gateway routing.",
        ),
        (
            "Why OpenAI-compatible API?",
            "Point LangChain/LangGraph/OpenAI SDK at vLLM with base_url &mdash; zero application code change for self-host migration or hybrid routing.",
        ),
        (
            "Quantization trade-offs?",
            "AWQ/GPTQ 4-bit: ~4&times; memory savings, ~1&ndash;3% quality drop on tasks. Benchmark on your RAG/agent eval before prod.",
        ),
        (
            "GPU for Llama-3-8B?",
            "1&times; A10/L4 24GB FP16; or 1&times; T4 16GB with AWQ. Reserve headroom for KV cache at target concurrent users.",
        ),
        (
            "Tensor parallel when?",
            "When single GPU VRAM insufficient for model weights + KV &mdash; e.g. 70B AWQ on 2&times; A100 with tensor-parallel-size 2.",
        ),
        (
            "Prefix caching for RAG?",
            "vLLM reuses KV blocks for identical prompt prefixes. Shared system prompt + tool definitions across users saves compute on every request.",
        ),
        (
            "When still use OpenAI cloud?",
            "Frontier reasoning, zero ops, burst beyond GPU capacity. Hybrid router sends easy queries to local 8B, hard to GPT-4o.",
        ),
        (
            "Embed serving stack?",
            "Text Embeddings Inference (TEI) for BGE/E5 batch GPU &mdash; not vLLM. See <a href=\"embedding-models.html\">Embedding Models</a>.",
        ),
        (
            "Autoscale vLLM on K8s?",
            "HPA on custom metric queue_depth or tokens/sec backlog; min replicas &gt;0 to avoid cold start; GPU node pool separate from CPU.",
        ),
        (
            "SDE3: private LLM platform?",
            "vLLM on K8s GPU pool; model registry (Llama/Mistral/Qwen versions); OpenAI-compatible gateway with auth; quant pipeline AWQ; A/B model versions; cost per token chargeback; fallback to cloud API; LangSmith tracing; prefix cache for RAG system prompts.",
        ),
    ],
)

# ═══════════════════════════════════════════════════════════════════
# 4. llm-observability
# ═══════════════════════════════════════════════════════════════════
TOPICS["llm-observability"] = dict(
    title="LLM Observability",
    nav="Observability",
    hero="Trace, evaluate, and debug LLM applications: LangSmith tracing patterns, Langfuse, OpenTelemetry GenAI spans, token and cost tracking, golden-set eval CI, online feedback loops, and production dashboards for RAG and agents.",
    tags=[
        ("LangSmith", ""),
        ("Langfuse", " orange"),
        ("Traces", " green"),
        ("Eval", " pink"),
        ("Cost", " purple"),
    ],
    main_img="llm-observability-main.png",
    main_cap="Observability stack: SDK wraps LLM / retriever / tool calls &rarr; trace spans (latency, tokens, I/O) &rarr; dashboard + alerts &rarr; <a href=\"../systems/eval-harness.html\">eval harness</a> regression gate on every deploy.",
    nav_items=[
        ("01", "what", "What & Why"),
        ("01a", "concepts", "Core Concepts"),
        ("01b", "api", "API Surface"),
        ("02", "when", "When to Use"),
        ("03", "architecture", "Architecture"),
        ("04", "tracing", "Tracing & LangSmith"),
        ("05", "cost", "Cost Tracking"),
        ("06", "eval", "Eval Harness"),
        ("07", "feedback", "Online Feedback"),
        ("08", "tools", "Tools Compare"),
        ("09", "example", "Full Instrumentation Example"),
        ("10", "production", "Production & Ops"),
        ("11", "where", "Where It Shows Up"),
        ("12", "pitfalls", "Pitfalls"),
        ("13", "interview", "Interview Q&A"),
    ],
    interview_num="13",
    sections=[
        (
            "what",
            "01",
            "What &amp; Why",
            card(
                """<p>LLM apps fail <strong>silently</strong>: wrong retrieval, prompt drift, tool loops, partial answers that look fine. Traditional APM misses prompt inputs, chunk IDs, and token costs. <strong>LLM observability</strong> = traces (what happened step-by-step), evals (is quality still good), metrics (cost/latency per tenant). Required before any prod <a href="../systems/rag-end-to-end.html">RAG</a> or <a href="langgraph.html">LangGraph</a> agent launch.</p>
    <h3>Functional requirements</h3>
    <ul>
      <li>Trace tree per user request: embed, retrieve, rerank, LLM, tools</li>
      <li>Capture inputs/outputs with PII redaction policy</li>
      <li>Aggregate token usage and $ cost per model/feature/tenant</li>
      <li>Run golden-set eval on CI deploy; block if score drops &gt;5%</li>
      <li>Collect online feedback (thumbs down) into review queue</li>
    </ul>
    <h3>Non-functional requirements</h3>
    <ul>
      <li><strong>Overhead:</strong> &lt;5% latency added by tracing SDK</li>
      <li><strong>Retention:</strong> 30&ndash;90 days traces; PII scrubbed at ingest</li>
      <li><strong>Scale:</strong> sample success traces at high QPS; 100% errors</li>
      <li><strong>Privacy:</strong> GDPR delete by user_id; no secrets in spans</li>
    </ul>"""
            ),
        ),
        (
            "concepts",
            "01a",
            "Core Concepts",
            card(
                """<table>
      <tr><th>Term</th><th>Definition</th><th>Gotcha</th></tr>
      <tr><td><strong>Trace</strong></td><td>Tree of spans for one end-user request</td><td>Must include retrieval + LLM + tools</td></tr>
      <tr><td><strong>Span</strong></td><td>Single operation with start/end, I/O, metadata</td><td>Tag prompt_version, model, tenant</td></tr>
      <tr><td><strong>Run (LangSmith)</strong></td><td>One invocation logged to LangSmith</td><td>Auto for LangChain/LangGraph with env vars</td></tr>
      <tr><td><strong>Golden set</strong></td><td>Labeled Q&amp;A for regression eval</td><td>Update quarterly from prod failures</td></tr>
      <tr><td><strong>LLM-as-judge</strong></td><td>Model grades answer vs reference</td><td>Fast but biased; calibrate with humans</td></tr>
      <tr><td><strong>Feedback loop</strong></td><td>Thumbs down &rarr; dataset &rarr; eval / fine-tune</td><td>Close loop or quality stagnates</td></tr>
      <tr><td><strong>Sample rate</strong></td><td>Fraction of success traces stored</td><td>100% errors; 5&ndash;20% success at scale</td></tr>
    </table>"""
            ),
        ),
        (
            "api",
            "01b",
            "API / Interface Surface",
            card(
                """<pre># LangSmith — auto-trace LangChain / LangGraph
import os
os.environ["LANGCHAIN_TRACING_V2"] = "true"
os.environ["LANGCHAIN_API_KEY"] = "lsv2_..."
os.environ["LANGCHAIN_PROJECT"] = "rag-prod"

# Manual run logging
from langsmith import traceable

@traceable(name="rag_pipeline", metadata={"tenant": "acme"})
def answer(query: str) -> str:
    docs = retrieve(query)   # child span auto
    return generate(query, docs)

# Langfuse decorator
from langfuse.decorators import observe, langfuse_context

@observe()
def rag_pipeline(query: str):
    langfuse_context.update_current_trace(user_id="hash-123")
    ...

# OpenTelemetry custom span
with tracer.start_as_current_span("rerank") as span:
    span.set_attribute("gen_ai.request.model", "bge-reranker")
    span.set_attribute("retrieve.k", 50)
    results = reranker.rank(query, docs)</pre>"""
            ),
        ),
        (
            "when",
            "02",
            "When to Use / When NOT",
            card(
                """<table>
      <tr><th>Case</th><th>Obs stack?</th><th>Minimum</th></tr>
      <tr><td>Prod RAG or agent</td><td><strong>Required</strong></td><td>Langfuse or LangSmith + golden CI</td></tr>
      <tr><td>Staging / load test</td><td><strong>Yes</strong></td><td>Trace + cost dashboard</td></tr>
      <tr><td>One-off notebook</td><td><strong>Optional</strong></td><td>Print debugging OK</td></tr>
      <tr><td>Batch offline eval only</td><td><strong>Eval harness</strong></td><td>No live tracing needed</td></tr>
    </table>"""
            ),
        ),
        (
            "architecture",
            "03",
            "Architecture",
            card(
                """<pre>  App (FastAPI / LC / LangGraph)
           |
           v
    +-------------+
    |  OTel / SDK |  LangSmith / Langfuse client
    +------+------+
           |
           v
    +-------------+
    |  Collector  |  batch export
    +------+------+
           |
     +-----+-----+
     v           v
+---------+  +---------+
| Storage |  |   UI    |  traces, prompts, datasets
| CH/PG   |  |Dashboard|
+---------+  +---------+
     |
     v
+---------+
| Eval CI |  golden set on deploy
+---------+</pre>"""
                + flow(
                    [
                        (
                            "1",
                            "Instrument",
                            "Wrap retrieve, rerank, LLM, tools in spans",
                        ),
                        (
                            "2",
                            "Export",
                            "Batch traces to LangSmith/Langfuse/OTel collector",
                        ),
                        (
                            "3",
                            "Dashboard",
                            "Cost, latency p99, error rate per tenant",
                        ),
                        (
                            "4",
                            "Alert",
                            "Eval drop &gt;5%, cost 2&times; daily, p99 spike",
                        ),
                        (
                            "5",
                            "Feedback",
                            "Thumbs down &rarr; human review &rarr; golden set",
                        ),
                    ]
                ),
            ),
        ),
        (
            "tracing",
            "04",
            "Tracing &amp; LangSmith Patterns",
            diag(
                "llm-observability",
                "tracing-zoom",
                "Trace waterfall: root span RAG request 850 ms &rarr; embed 15 ms &rarr; vector DB 25 ms &rarr; rerank 65 ms &rarr; LLM generate 720 ms (prompt=2400, completion=180 tokens).",
            )
            + card(
                """<h3>LangSmith patterns for RAG</h3>
    <ul>
      <li><strong>Project per env:</strong> <code>rag-dev</code>, <code>rag-staging</code>, <code>rag-prod</code></li>
      <li><strong>Metadata tags:</strong> <code>tenant_id</code>, <code>prompt_version</code>, <code>embed_model</code>, <code>chunk_ids</code></li>
      <li><strong>Datasets:</strong> upload golden Q&amp;A; run evaluators on every PR</li>
      <li><strong>Evaluators:</strong> correctness (LLM judge), recall@k (custom), latency threshold</li>
      <li><strong>LangGraph:</strong> each node name appears as span &mdash; map to graph diagram</li>
    </ul>
<pre># LangSmith eval on dataset
from langsmith.evaluation import evaluate

def correctness(run, example):
    return llm_judge(run.outputs["answer"], example.outputs["reference"])

evaluate(
    answer,  # your pipeline
    data="golden-rag-v3",
    evaluators=[correctness],
    experiment_prefix="deploy-2026-05-30",
)</pre>
    <blockquote>LangSmith is deepest integrated with LangChain/LangGraph. Langfuse offers OSS self-host for cost-sensitive scale. Both support OpenTelemetry export.</blockquote>"""
            ),
        ),
        (
            "cost",
            "05",
            "Cost Tracking",
            diag(
                "llm-observability",
                "eval-zoom",
                "Dashboard panels: tokens in/out per model, daily cost USD, p99 latency trend, eval score over deploys (drop on bad deploy, recovery after rollback).",
            )
            + card(
                """<pre># Per-span cost attribution
prompt_tokens = usage.prompt_tokens
completion_tokens = usage.completion_tokens
cost_usd = (
    prompt_tokens * PRICE[model]["input"]
    + completion_tokens * PRICE[model]["output"]
)
span.set_attribute("gen_ai.usage.cost_usd", cost_usd)
span.set_attribute("tenant_id", tenant)</pre>
    <table>
      <tr><th>Metric</th><th>Alert threshold</th></tr>
      <tr><td>Daily spend per tenant</td><td>2&times; 7-day moving average</td></tr>
      <tr><td>Tokens per successful answer</td><td>Spike &gt;50% (prompt bloat)</td></tr>
      <tr><td>Retrieve+LLM cost ratio</td><td>LLM &gt;90% &mdash; tune chunk count</td></tr>
    </table>"""
            ),
        ),
        (
            "eval",
            "06",
            "Eval Harness Integration",
            card(
                """<p>Connect live traces to offline eval. See <a href="../systems/eval-harness.html">Eval Harness</a> for full CI design.</p>
    <ul>
      <li><strong>Golden 50&ndash;100 questions</strong> with reference answers and gold doc IDs</li>
      <li><strong>Blocking CI:</strong> deploy fails if recall@5 or correctness drops &gt;5%</li>
      <li><strong>LLM-as-judge:</strong> fast regression signal; calibrate 10% with human labels</li>
      <li><strong>Latency regression:</strong> p99 retrieve+generate &lt; SLA on synthetic load</li>
      <li><strong>Compare experiments:</strong> LangSmith side-by-side two prompt versions</li>
    </ul>
<pre># Minimal CI gate (pseudo)
score = run_golden_eval(pipeline, "golden-v3")
assert score["recall_at_5"] >= BASELINE * 0.95
assert score["correctness"] >= BASELINE * 0.95</pre>"""
            ),
        ),
        (
            "feedback",
            "07",
            "Online Feedback Loop",
            card(
                """<pre>User thumbs down + optional correction
        |
        v
  Review queue (human)
        |
   +----+----+
   v         v
Golden set   Fine-tune dataset
update       (advanced)</pre>
    <ul>
      <li>Store <code>trace_id</code> on every UI response for support tickets</li>
      <li>Link feedback to LangSmith run URL for instant replay</li>
      <li>Weekly triage: add failure modes to golden set</li>
    </ul>"""
            ),
        ),
        (
            "tools",
            "08",
            "Tools Comparison",
            card(
                """<table>
      <tr><th>Tool</th><th>Strength</th><th>Best for</th></tr>
      <tr><td><strong>LangSmith</strong></td><td>LangChain/LangGraph native, datasets, evaluators</td><td>LC/LG shops; hosted convenience</td></tr>
      <tr><td><strong>Langfuse</strong></td><td>OSS, self-host, prompt versioning, cost</td><td>Cost at scale; data residency</td></tr>
      <tr><td><strong>Arize Phoenix</strong></td><td>Embedding viz, retrieval cluster debug</td><td>RAG retrieval quality debug</td></tr>
      <tr><td><strong>Helicone</strong></td><td>OpenAI proxy logging, cost gateway</td><td>Quick cost wrap on API calls</td></tr>
      <tr><td><strong>OpenTelemetry</strong></td><td>Vendor-neutral spans; Datadog/Jaeger export</td><td>Unified APM + LLM spans</td></tr>
    </table>"""
            ),
        ),
        (
            "example",
            "09",
            "Full Instrumentation Example",
            card(
                """<p>Instrument a RAG pipeline with LangSmith patterns: nested spans, metadata tags, and eval-ready outputs.</p>""",
                hl=True,
            )
            + card(
                """<pre>""" + """import os
import uuid
from langsmith import traceable
from langsmith.run_helpers import get_current_run_tree

os.environ["LANGCHAIN_TRACING_V2"] = "true"
os.environ["LANGCHAIN_PROJECT"] = "rag-prod"

@traceable(name="rag_answer", metadata={"pipeline": "v3"})
def rag_answer(query: str, tenant_id: str) -> dict:
    trace_id = str(uuid.uuid4())
    run = get_current_run_tree()
    if run:
        run.extra = {"tenant_id": tenant_id, "trace_id": trace_id}

    chunks = retrieve(query)          # child span: embed + vector DB
    ranked = rerank(query, chunks)    # child span: scores logged
    answer = generate(query, ranked)  # child span: tokens + model

    return {
        "answer": answer,
        "trace_id": trace_id,
        "chunk_ids": [c["id"] for c in ranked],
    }

# Attach feedback from UI
# langsmith_client.create_feedback(run_id, key="user_score", score=0)

# CI eval (blocking deploy)
# evaluate(rag_answer, data="golden-rag-v3", evaluators=[correctness])</pre>
    <p>Store <code>trace_id</code> on every API response. Support tickets link directly to LangSmith run replay. Feed thumbs-down into golden dataset per <a href="../systems/eval-harness.html">Eval Harness</a>.</p>"""
            ),
        ),
        (
            "production",
            "10",
            "Production &amp; Ops",
            card(
                """<table>
      <tr><th>Concern</th><th>Practice</th></tr>
      <tr><td>PII</td><td>Regex scrub emails/SSN; hash user_id; never log API keys</td></tr>
      <tr><td>Sampling</td><td>100% errors + 10% success; always aggregate metrics</td></tr>
      <tr><td>Retention</td><td>30 days traces; GDPR delete API</td></tr>
      <tr><td>Alerts</td><td>Eval drop, error spike, cost anomaly, p99 latency</td></tr>
      <tr><td>Incident</td><td>trace_id in tickets; rollback on eval gate failure</td></tr>
    </table>"""
            ),
        ),
        (
            "where",
            "11",
            "Where It Shows Up",
            card(
                """<ul>
      <li><a href="../systems/rag-end-to-end.html">RAG End-to-End</a> &mdash; trace every retrieve &rarr; rerank &rarr; generate stage</li>
      <li><a href="vector-databases.html">Vector Databases</a> &mdash; log chunk IDs + ANN scores in retrieval span</li>
      <li><a href="langgraph.html">LangGraph</a> &mdash; per-node spans + checkpoint metadata</li>
      <li><a href="openai-api-patterns.html">OpenAI API Patterns</a> &mdash; token usage + retry logging</li>
      <li><a href="../systems/eval-harness.html">Eval Harness</a> &mdash; CI golden set fed from prod failures</li>
      <li><a href="../systems/production-agent.html">Production Agent</a> &mdash; tool loop detection, HITL audit trail</li>
    </ul>"""
            ),
        ),
        (
            "pitfalls",
            "12",
            "Common Pitfalls",
            card(
                """<ul>
      <li><strong>Log full prompts with PII/secrets</strong> &mdash; scrub at SDK boundary</li>
      <li><strong>No eval CI</strong> &mdash; silent regressions on prompt/model deploy</li>
      <li><strong>Traces without retrieval spans</strong> &mdash; cannot debug RAG misses</li>
      <li><strong>LangSmith only in prod</strong> &mdash; staging should mirror for pre-release eval</li>
      <li><strong>Ignore cost metrics</strong> &mdash; prompt bloat discovered at invoice time</li>
      <li><strong>No trace_id in UI</strong> &mdash; support cannot replay failures</li>
    </ul>"""
            ),
        ),
    ],
    qa=[
        (
            "What should you trace in a RAG pipeline?",
            "Query text (redacted), embed model + latency, vector DB namespace, chunk IDs + ANN scores, rerank order + scores, prompt template version, LLM model + tokens + output, total latency per stage, user feedback linkage.",
        ),
        (
            "LangSmith vs Langfuse?",
            "LangSmith: best LangChain/LangGraph integration, hosted datasets/evaluators, fastest LC setup. Langfuse: open-source self-host, prompt management, lower cost at high trace volume. Many teams use Langfuse prod + LangSmith dev.",
        ),
        (
            "Key LangSmith patterns for production?",
            "Separate projects per env; tag tenant_id and prompt_version on every run; golden datasets with CI evaluators; link traces to feedback; use evaluate() on deploy; LangGraph node names as span names for loop debug.",
        ),
        (
            "OpenTelemetry for LLMs?",
            "Emerging GenAI semantic conventions: gen_ai.request.model, gen_ai.usage tokens, gen_ai.usage.cost_usd. Export to Datadog/Jaeger alongside traditional APM.",
        ),
        (
            "How track LLM cost per tenant?",
            "Log prompt/completion tokens per span; multiply by model price table; aggregate by tenant_id tag daily. Alert on 2× burn vs baseline.",
        ),
        (
            "Golden set size and update cadence?",
            "Start 50&ndash;100 labeled Q&A. Grow from prod thumbs-down weekly. Re-run full eval on every deploy; block if score drops &gt;5%.",
        ),
        (
            "LLM-as-judge pitfalls?",
            "Judge model favors verbose answers and own style. Calibrate 10&ndash;20% with human labels. Use rubric in judge prompt; don&rsquo;t trust alone for compliance.",
        ),
        (
            "Debug bad retrieval with traces?",
            "Span shows chunk IDs and scores &mdash; fetch text from docstore; check embed_model version tag; compare score distribution vs historical; verify query embed cache not stale.",
        ),
        (
            "PII handling in traces?",
            "Scrub regex at SDK; hash user_id; truncate long prompts in storage; 30-day retention; GDPR delete endpoint by user hash.",
        ),
        (
            "Sampling strategy at 10K QPS?",
            "100% error traces; 5&ndash;10% success sample; 100% aggregate metrics (latency histogram, token counters) in Prometheus regardless of trace sample.",
        ),
        (
            "Agent loop observability?",
            "One span per tool call in LangGraph; alert if same tool+args repeated &gt;3 times; max_steps counter on trace root; link to <a href=\"langgraph.html\">LangGraph</a> checkpoint id.",
        ),
        (
            "SDE3: company AI observability platform?",
            "Unified OTel schema; Langfuse self-host for traces; LangSmith for LC eval datasets; golden CI gate blocking deploy; cost chargeback dashboard per tenant; feedback&rarr;dataset pipeline; PII scrub tier; on-call runbook linking trace_id to rollback; integrate with <a href=\"../systems/rag-end-to-end.html\">RAG</a> and agent SLOs.",
        ),
    ],
)
