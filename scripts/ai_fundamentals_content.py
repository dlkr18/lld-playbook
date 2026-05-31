# ai_fundamentals_content.py — TOPICS for build_ai_fundamentals_batch.py

def _nav(*items):
    return items


def _tags(*items):
    return items


def _qa(*pairs):
    return list(pairs)


LINKS = {
    "llm": '<a href="llm-fundamentals.html">LLM Fundamentals</a>',
    "prompt": '<a href="prompt-engineering.html">Prompt Engineering</a>',
    "embed": '<a href="embeddings-semantic-search.html">Embeddings &amp; Semantic Search</a>',
    "transformers": '<a href="transformers-attention.html">Transformers &amp; Attention</a>',
    "token": '<a href="tokenization-context.html">Tokenization &amp; Context</a>',
    "pretrain": '<a href="pretraining-sft-rlhf.html">Pre-training, SFT &amp; RLHF</a>',
    "eval": '<a href="evaluation-metrics.html">Evaluation Metrics</a>',
    "halluc": '<a href="hallucination-grounding.html">Hallucination &amp; Grounding</a>',
    "safety": '<a href="ai-safety-guardrails.html">AI Safety &amp; Guardrails</a>',
    "cost": '<a href="cost-latency-tradeoffs.html">Cost &amp; Latency Tradeoffs</a>',
    "patterns": '<a href="ai-system-design-patterns.html">AI System Design Patterns</a>',
    "kv": '<a href="context-window-kv-cache.html">Context Window &amp; KV Cache</a>',
    "rag": '<a href="../systems/rag-end-to-end.html">RAG End-to-End</a>',
    "rlhf_sys": '<a href="../systems/rlhf-dpo-pipeline.html">RLHF &amp; DPO Pipeline</a>',
    "lora": '<a href="../systems/fine-tuning-lora.html">Fine-Tuning (LoRA)</a>',
    "eval_h": '<a href="../systems/eval-harness.html">Eval Harness</a>',
    "agent": '<a href="../systems/agent-architectures.html">Agent Architectures</a>',
    "prod_agent": '<a href="../systems/production-agent.html">Production Agent</a>',
    "vllm": '<a href="../tech/model-serving-vllm.html">Model Serving (vLLM)</a>',
    "langgraph": '<a href="../tech/langgraph.html">LangGraph</a>',
    "const": '<a href="../stretch/constitutional-ai-redteam.html">Constitutional AI</a>',
    "search": '<a href="../../hld/web-search-engine.html">Web Search Engine</a>',
}

# ── 1. transformers-attention ─────────────────────────────────────
TOPICS["transformers-attention"] = dict(
    title="Transformers & Attention",
    nav="Transformers",
    hero="Causal self-attention, multi-head projections, RoPE positional encoding, and the decoder-only stack that powers GPT, Llama, and Claude. The whiteboard mechanism interviewers expect before RAG or agents.",
    tags=_tags(
        ("Self-Attention", ""),
        ("Multi-Head", " orange"),
        ("RoPE", " green"),
        ("Causal Mask", " pink"),
    ),
    main_img="transformers-attention-main.png",
    main_cap="Decoder-only transformer: embeddings + positional encoding feed stacked blocks of causal self-attention and FFN; output logits drive autoregressive next-token prediction.",
    nav_items=_nav(
        ("01", "whatwhy", "What & Why"),
        ("01a", "concepts", "Core Concepts"),
        ("01b", "api", "API Surface"),
        ("02", "whento", "When to Use"),
        ("03", "architecture", "Architecture"),
        ("04", "selfattn", "Self-Attention"),
        ("05", "multihead", "Multi-Head"),
        ("06", "positional", "Positional Encoding"),
        ("07", "ffn", "FFN & Residuals"),
        ("08", "complexity", "Complexity"),
        ("09", "production", "Production & Ops"),
        ("10", "shows-up", "Where It Shows Up"),
        ("11", "pitfalls", "Pitfalls"),
        ("12", "interview", "Interview Q&A"),
    ),
    sections=[
        (
            "whatwhy",
            "01",
            "What & Why",
            card(
                "<p>The <strong>transformer</strong> (Vaswani et al., 2017) replaced recurrence with <strong>self-attention</strong>: each token attends to others in parallel. Modern chat LLMs use <strong>decoder-only</strong> stacks with a <strong>causal mask</strong> so generation stays left-to-right.</p>"
                "<h3>Functional</h3><ul><li>Map token sequence to next-token logits</li>"
                "<li>Capture long-range dependencies without RNN vanishing gradients</li>"
                "<li>Parallelize prefill across prompt tokens on GPU</li></ul>"
                "<h3>Non-functional</h3><ul><li>Attention cost O(n&sup2;) in sequence length n (naive)</li>"
                "<li>Memory scales with layers &times; heads &times; seq_len (KV cache)</li></ul>"
                f"<blockquote>See {LINKS['llm']} for the full training&rarr;inference story; this sheet is the <strong>mechanism</strong>.</blockquote>"
            ),
        ),
        (
            "concepts",
            "01a",
            "Core Concepts",
            card(
                tbl(
                    [
                        (("th", "Term"), ("th", "Definition"), ("th", "Gotcha")),
                        (
                            ("td", "Self-attention"),
                            ("td", "Q,K,V from same sequence; weighted sum of values"),
                            ("td", "Not cross-attention (encoder-decoder)"),
                        ),
                        (
                            ("td", "Scaled dot-product"),
                            ("td", "softmax(QK<sup>T</sup>/&radic;d<sub>k</sub>)V"),
                            ("td", "Scaling prevents softmax saturation"),
                        ),
                        (
                            ("td", "Causal mask"),
                            ("td", "Position i cannot attend to j &gt; i"),
                            ("td", "Required for autoregressive LM"),
                        ),
                        (
                            ("td", "Multi-head"),
                            ("td", "h parallel attention subspaces, concat + project"),
                            ("td", "d_model = h &times; d_head typically"),
                        ),
                        (
                            ("td", "RoPE"),
                            ("td", "Rotary positional encoding in Q,K"),
                            ("td", "Llama/Mistral default; better length extrapolation"),
                        ),
                        (
                            ("td", "FFN"),
                            ("td", "Two linear layers with activation (SwiGLU)"),
                            ("td", "~2/3 of model parameters"),
                        ),
                        (
                            ("td", "FlashAttention"),
                            ("td", "IO-aware fused attention kernels"),
                            ("td", "Same math, less HBM traffic"),
                        ),
                    ]
                )
            ),
        ),
        (
            "api",
            "01b",
            "API Surface (PyTorch / HuggingFace mental model)",
            card(
                '<pre>import torch\nimport torch.nn.functional as F\n\ndef scaled_dot_product_attention(q, k, v, mask=None):\n    scores = torch.matmul(q, k.transpose(-2, -1)) / (q.size(-1) ** 0.5)\n    if mask is not None:\n        scores = scores.masked_fill(mask == 0, float("-inf"))\n    weights = F.softmax(scores, dim=-1)\n    return torch.matmul(weights, v)\n\n# HF: model = AutoModelForCausalLM.from_pretrained("meta-llama/Llama-3-8B")\n# outputs = model(input_ids, use_cache=True)  # returns past_key_values</pre>'
                "<p>Production apps rarely implement attention directly &mdash; but interviews ask you to derive QKV and explain causal masking.</p>"
            ),
        ),
        (
            "whento",
            "02",
            "When to Use / When NOT",
            card(
                tbl(
                    [
                        (("th", "Architecture"), ("th", "Use When"), ("th", "Alternative")),
                        (
                            ("td", "Decoder-only (GPT)"),
                            ("td", "General chat, code, agents"),
                            ("td", "Encoder-only for embeddings"),
                        ),
                        (
                            ("td", "Encoder-decoder (T5)"),
                            ("td", "Fixed source&rarr;target (translation)"),
                            ("td", "Decoder-only + prompt for chat"),
                        ),
                        (
                            ("td", "Encoder-only (BERT)"),
                            ("td", "Classification, embeddings"),
                            ("td", "Not for open-ended generation"),
                        ),
                        (
                            ("td", "Sparse attention"),
                            ("td", "Very long context (&gt;32K)"),
                            ("td", "Full attention + KV optimizations"),
                        ),
                    ]
                )
            ),
        ),
        (
            "architecture",
            "03",
            "Architecture",
            card(
                '<pre>Token IDs -> Embedding + PosEnc\n  -> [Block] x L:\n       x -> LN -> Multi-Head Causal Attention -> +residual\n       -> LN -> FFN (up -> act -> down) -> +residual\n  -> LN -> Linear(d_model, vocab) -> logits</pre>',
                hl=True,
            )
            + card(
                "<div class='flow'>"
                "<div class='step' data-num='1'><span class='label'>Embed</span><div class='detail'>Token + position info.</div></div>"
                "<div class='step' data-num='2'><span class='label'>Attend</span><div class='detail'>Causal self-attention per layer.</div></div>"
                "<div class='step' data-num='3'><span class='label'>FFN</span><div class='detail'>Per-token MLP transformation.</div></div>"
                "<div class='step' data-num='4'><span class='label'>Project</span><div class='detail'>Vocab-sized logits; sample next token.</div></div>"
                "</div>"
            ),
        ),
        (
            "selfattn",
            "04",
            "Deep Dive: Self-Attention",
            diag(
                "transformers-attention-self-attention-zoom.png",
                "Scaled dot-product self-attention with causal mask preventing future token peeking.",
            )
            + card(
                "<p>Each token produces Query, Key, Value via learned linear maps. Attention weights = softmax of dot products; output = weighted sum of Values. <strong>Causal mask</strong> sets future positions to &minus;&infin; before softmax.</p>"
            ),
        ),
        (
            "multihead",
            "05",
            "Deep Dive: Multi-Head Attention",
            diag(
                "transformers-attention-multihead-zoom.png",
                "Parallel attention heads capture syntactic, semantic, and positional relations; outputs concatenated and projected.",
            )
            + card(
                "<p>Heads specialize (some track syntax, some coreference). Split d_model into h heads of dimension d_head = d_model/h. Output = Concat(head<sub>1</sub>,&hellip;)W<sub>O</sub>.</p>"
            ),
        ),
        (
            "positional",
            "06",
            "Deep Dive: Positional Encoding (RoPE)",
            card(
                "<p><strong>RoPE</strong> rotates Q and K vectors by position-dependent angles. Relative position emerges in dot products; extrapolates better than absolute sinusoidal encodings. Used in Llama 3, Mistral, Qwen.</p>"
                "<p><strong>ALiBi</strong> (alternative): additive bias by distance &mdash; simpler extrapolation, less common in newest stacks.</p>"
            ),
        ),
        (
            "ffn",
            "07",
            "Deep Dive: FFN & Residual Connections",
            card(
                "<p>FFN: Linear(d &rarr; 4d) &rarr; GELU/SwiGLU &rarr; Linear(4d &rarr; d). Residual connections + LayerNorm (Pre-LN in modern stacks) stabilize deep training (32&ndash;80+ layers).</p>"
            ),
        ),
        (
            "complexity",
            "08",
            "Deep Dive: Complexity & Optimizations",
            card(
                "<ul><li><strong>Naive attention:</strong> O(n&sup2;d) time, O(n&sup2;) memory for n tokens</li>"
                "<li><strong>KV cache:</strong> O(n) memory per layer at decode; see "
                + LINKS["kv"]
                + "</li>"
                "<li><strong>FlashAttention:</strong> tiled computation, recomputes in SRAM</li>"
                "<li><strong>GQA/MQA:</strong> share K/V heads across Q heads &mdash; fewer KV bytes</li></ul>"
            ),
        ),
        (
            "production",
            "09",
            "Production & Ops",
            card(
                "<ul><li>Serving uses fused kernels (FlashAttention-2, cuDNN)</li>"
                "<li>Tensor parallel splits heads/layers across GPUs</li>"
                "<li>Monitor KV cache memory per request in "
                + LINKS["vllm"]
                + "</li>"
                "<li>Quantization (INT4) shrinks weight memory, not attention FLOPs</li></ul>"
            ),
        ),
        (
            "shows-up",
            "10",
            "Where It Shows Up",
            card(
                "<ul>"
                f"<li>{LINKS['llm']} &mdash; decoder-only stack overview</li>"
                f"<li>{LINKS['kv']} &mdash; KV cache inference memory</li>"
                f"<li>{LINKS['token']} &mdash; tokens fed into embeddings</li>"
                f"<li>{LINKS['pretrain']} &mdash; training these weights</li>"
                f"<li>{LINKS['vllm']} &mdash; PagedAttention serving</li>"
                f"<li>{LINKS['rag']} &mdash; attention over retrieved context</li>"
                f"<li>{LINKS['search']} &mdash; ranking + LLM synthesis</li>"
                "</ul>"
            ),
        ),
        (
            "pitfalls",
            "11",
            "Common Pitfalls",
            card(
                "<ul><li>Confusing encoder-only BERT with generative decoder-only</li>"
                "<li>Ignoring causal mask in hand-rolled attention bugs</li>"
                "<li>Assuming O(n) attention without sparse methods or cache</li>"
                "<li>Forgetting FFN dominates parameter count</li>"
                "<li>Mixing absolute vs RoPE when extrapolating context</li></ul>"
            ),
        ),
    ],
    qa=_qa(
        (
            "Explain self-attention in one minute.",
            "Each token builds Q,K,V vectors. Scores = Q&middot;K scaled by &radic;d<sub>k</sub>; softmax yields weights; output = weighted sum of V. Causal mask zeroes future keys so token t only sees &le;t. Parallel over sequence during prefill.",
        ),
        (
            "Why multi-head instead of one big attention?",
            "Multiple subspaces let the model attend to different relation types simultaneously (syntax, coreference, position). Single head would need much larger d to capture same diversity.",
        ),
        (
            "What is the causal mask and why?",
            "Upper-triangular mask sets attention to future tokens to &minus;&infin;. Without it, token t could peek at t+1 and break autoregressive training/generation.",
        ),
        (
            "Decoder-only vs encoder-decoder?",
            "Decoder-only: one stack, prompt as prefix, generate continuation &mdash; GPT/Llama. Encoder-decoder: bidirectional encoder over source, decoder cross-attends &mdash; T5 translation. Chat standardized on decoder-only + instruction formatting.",
        ),
        (
            "What is RoPE?",
            "Rotary Position Embedding: rotate Q/K by position-dependent angles so dot products encode relative distance. Better length extrapolation than fixed sinusoidal positions.",
        ),
        (
            "Attention complexity at 128K context?",
            "Prefill: O(n&sup2;) per layer naive. KV cache stores n keys/values per layer for decode. Mitigations: FlashAttention, sliding window (Mistral), sparse patterns, GQA to shrink KV.",
        ),
        (
            "What is FlashAttention?",
            "IO-aware algorithm tiling QKV blocks in GPU SRAM, fusing softmax with matmuls. Same output as naive attention, 2&ndash;4&times; faster, less HBM bandwidth &mdash; critical at long context.",
        ),
        (
            "GQA vs MHA?",
            "Multi-Head Attention: unique K/V per head. Grouped-Query: groups of Q heads share one K/V head. Fewer KV bytes &rarr; faster decode, slightly lower quality. Llama 3 uses GQA.",
        ),
        (
            "Where do most parameters live?",
            "FFN layers (~2/3): up/down projections often 4&times; hidden dim. Attention projections are smaller fraction at scale.",
        ),
        (
            "How does attention relate to RAG?",
            "Retrieved chunks become prompt tokens; every layer's attention connects query tokens to chunk tokens. Long irrelevant chunks dilute attention &mdash; rerank and trim matter.",
        ),
        (
            "Draw one transformer block.",
            "Input &rarr; LayerNorm &rarr; Multi-Head Causal Self-Attention &rarr; add residual &rarr; LayerNorm &rarr; FFN (up, act, down) &rarr; add residual &rarr; output to next block.",
        ),
        (
            "SDE3: what separates a strong transformers answer?",
            "Derives scaled dot-product, explains causal mask, multi-head split, RoPE vs absolute, O(n&sup2;) prefill + KV cache decode, names FlashAttention/GQA, ties to "
            + LINKS["vllm"]
            + " serving constraints.",
        ),
    ),
)

# ── 2. tokenization-context ───────────────────────────────────────
TOPICS["tokenization-context"] = dict(
    title="Tokenization & Context Window",
    nav="Tokenization",
    hero="BPE and byte-level tokenizers, counting tokens with tiktoken, context budget math, and truncation strategies that prevent silent prompt overflow in production.",
    tags=_tags(
        ("BPE", ""),
        ("tiktoken", " orange"),
        ("Context Budget", " green"),
        ("Truncation", " pink"),
    ),
    main_img="tokenization-context-main.png",
    main_cap="Raw text flows through normalization and BPE tokenization into token IDs that share a fixed context budget with the model completion.",
    nav_items=_nav(
        ("01", "whatwhy", "What & Why"),
        ("01a", "concepts", "Core Concepts"),
        ("01b", "api", "API Surface"),
        ("02", "whento", "When to Use"),
        ("03", "architecture", "Architecture"),
        ("04", "bpe", "BPE Deep Dive"),
        ("05", "counting", "Counting Tokens"),
        ("06", "truncation", "Truncation"),
        ("07", "special", "Special Tokens"),
        ("08", "multilingual", "Multilingual"),
        ("09", "production", "Production & Ops"),
        ("10", "shows-up", "Where It Shows Up"),
        ("11", "pitfalls", "Pitfalls"),
        ("12", "interview", "Interview Q&A"),
    ),
    sections=[
        (
            "whatwhy",
            "01",
            "What & Why",
            card(
                "<p>LLMs operate on <strong>token IDs</strong>, not characters. Tokenization determines cost, latency, context fit, and whether your prompt silently truncates. Mis-counting tokens is a top production bug.</p>"
                f"<blockquote>Context limits and KV memory are covered in {LINKS['kv']}; this sheet is <strong>getting text into IDs safely</strong>.</blockquote>"
            ),
        ),
        (
            "concepts",
            "01a",
            "Core Concepts",
            card(
                tbl(
                    [
                        (("th", "Term"), ("th", "Definition"), ("th", "Gotcha")),
                        (
                            ("td", "BPE"),
                            ("td", "Byte-Pair Encoding merges frequent pairs"),
                            ("td", "Vocab 50K&ndash;200K typical"),
                        ),
                        (
                            ("td", "Byte-level"),
                            ("td", "UTF-8 bytes as base alphabet"),
                            ("td", "No UNK for rare Unicode"),
                        ),
                        (
                            ("td", "Context window"),
                            ("td", "Max prompt + completion tokens"),
                            ("td", "Shared budget, not prompt-only"),
                        ),
                        (
                            ("td", "tiktoken"),
                            ("td", "OpenAI-compatible fast BPE counter"),
                            ("td", "Model-specific encodings"),
                        ),
                        (
                            ("td", "Special tokens"),
                            ("td", "&lt;|im_start|&gt;, &lt;|endoftext|&gt;, tool markers"),
                            ("td", "Counted in budget"),
                        ),
                    ]
                )
            ),
        ),
        (
            "api",
            "01b",
            "API Surface",
            card(
                '<pre>import tiktoken\n\nenc = tiktoken.encoding_for_model("gpt-4o")\ntokens = enc.encode("Hello, world!")\nprint(len(tokens))  # billable count\n\ntext = enc.decode(tokens[:50])  # partial decode\n\n# HuggingFace\ntokenizer = AutoTokenizer.from_pretrained("meta-llama/Llama-3-8B")\nids = tokenizer("Hello", add_special_tokens=True)["input_ids"]</pre>'
            ),
        ),
        (
            "whento",
            "02",
            "When to Use / When NOT",
            card(
                tbl(
                    [
                        (("th", "Strategy"), ("th", "Use When"), ("th", "Skip When")),
                        (
                            ("td", "Pre-count in app"),
                            ("td", "Every user-facing feature"),
                            ("td", "Never skip in prod"),
                        ),
                        (
                            ("td", "Summarize history"),
                            ("td", "Long chat threads"),
                            ("td", "Single-shot Q&amp;A"),
                        ),
                        (
                            ("td", "RAG chunks"),
                            ("td", "Large corpora"),
                            ("td", "Whole doc fits in window"),
                        ),
                        (
                            ("td", "Char-based limits"),
                            ("td", "Quick UI estimate only"),
                            ("td", "Billing or hard limits"),
                        ),
                    ]
                )
            ),
        ),
        (
            "architecture",
            "03",
            "Architecture",
            card(
                '<pre>User text -> Unicode normalize -> BPE merge table -> token IDs\n  -> budget check (prompt + max_completion &lt;= limit)\n  -> truncate | summarize | retrieve | reject</pre>',
                hl=True,
            ),
        ),
        (
            "bpe",
            "04",
            "Deep Dive: BPE Tokenization",
            diag(
                "tokenization-context-bpe-zoom.png",
                "BPE iteratively merges frequent byte or character pairs into subword vocabulary entries.",
            )
            + card(
                "<p>Start with byte/char vocab; merge most frequent adjacent pairs until vocab size reached. Common words become single tokens; rare words split into subwords. GPT-4 uses cl100k_base; Llama 3 uses its own SentencePiece table.</p>"
            ),
        ),
        (
            "counting",
            "05",
            "Deep Dive: Counting & Budgeting",
            card(
                '<pre>def fits(prompt_ids: list[int], max_out: int, limit: int) -> bool:\n    return len(prompt_ids) + max_out <= limit\n\n# Always reserve completion headroom\nPROMPT_BUDGET = 120_000  # for 128K model with 8K output</pre>'
                "<p>Rule: ~4 characters per token for English (rough). Code and JSON are denser. Always count with the <strong>same tokenizer as the model</strong>.</p>"
            ),
        ),
        (
            "truncation",
            "06",
            "Deep Dive: Truncation Strategies",
            diag(
                "tokenization-context-truncation-zoom.png",
                "Head, tail, middle-out, and summarize-then-inject strategies for fitting context budget.",
            )
            + card(
                "<ul><li><strong>Head:</strong> keep system + recent user (drops old history)</li>"
                "<li><strong>Middle-out:</strong> keep start + end of long docs</li>"
                "<li><strong>Summarize:</strong> LLM compresses old turns</li>"
                "<li><strong>RAG:</strong> retrieve top-k chunks instead of full doc</li></ul>"
            ),
        ),
        (
            "special",
            "07",
            "Deep Dive: Special Tokens",
            card(
                "<p>Chat templates insert role markers (&lt;|im_start|&gt;user). Tool calls add JSON blobs. Each counts toward budget. Use <code>tokenizer.apply_chat_template</code> for exact counts.</p>"
            ),
        ),
        (
            "multilingual",
            "08",
            "Deep Dive: Multilingual & Code",
            card(
                "<p>Non-Latin scripts often use more tokens per character. Code tokenizes densely (symbols are separate tokens). Budget 1.5&ndash;2&times; for CJK vs English prose.</p>"
            ),
        ),
        (
            "production",
            "09",
            "Production & Ops",
            card(
                "<ul><li>Reject or trim before API call &mdash; avoid 400 context errors</li>"
                "<li>Log token counts per request for cost dashboards</li>"
                "<li>Version tokenizer with model deployment</li>"
                "<li>See "
                + LINKS["cost"]
                + " for $/token impact</li></ul>"
            ),
        ),
        (
            "shows-up",
            "10",
            "Where It Shows Up",
            card(
                "<ul>"
                f"<li>{LINKS['llm']} &mdash; tokens as LM input</li>"
                f"<li>{LINKS['kv']} &mdash; seq_len from token count</li>"
                f"<li>{LINKS['prompt']} &mdash; few-shot eats context</li>"
                f"<li>{LINKS['rag']} &mdash; chunk sizing in tokens</li>"
                f"<li>{LINKS['cost']} &mdash; billing per token</li>"
                "</ul>"
            ),
        ),
        (
            "pitfalls",
            "11",
            "Common Pitfalls",
            card(
                "<ul><li>Char-length limits instead of token counts</li>"
                "<li>Forgetting completion tokens in budget</li>"
                "<li>Wrong tokenizer for model version</li>"
                "<li>Silent API truncation without warning</li>"
                "<li>Not counting tool/schema overhead</li></ul>"
            ),
        ),
    ],
    qa=_qa(
        (
            "What is a token?",
            "A subword unit from the model vocabulary (BPE/SentencePiece). Text maps to a sequence of integer IDs. ~4 chars/token English average; varies by language and content type.",
        ),
        (
            "How does BPE work?",
            "Iteratively merge most frequent adjacent symbol pairs into new vocab entries until target size. Common words become single tokens; rare words split into subwords.",
        ),
        (
            "Why token counts differ across models?",
            "Each model has its own merge table and vocab. Same string &rarr; different ID sequences and lengths. Never reuse OpenAI counts for Llama.",
        ),
        (
            "How do you count tokens in production?",
            "tiktoken for OpenAI; HuggingFace tokenizer for open models. Count after chat template application including system prompt and tools.",
        ),
        (
            "prompt_tokens + max_tokens vs context window?",
            "Sum must not exceed model limit (e.g. 128K). If prompt is 125K, only 3K left for completion. Reserve headroom explicitly.",
        ),
        (
            "Best truncation for chat history?",
            "Summarize oldest turns or sliding window of last N tokens. Keep system prompt + recent user messages. Never drop safety instructions.",
        ),
        (
            "Middle-out truncation?",
            "Keep document beginning (title, abstract) and end (conclusion) when middle is less critical. Useful for long reports before RAG is available.",
        ),
        (
            "Special tokens in budget?",
            "Yes. Chat markers, BOS/EOS, tool call wrappers all count. apply_chat_template gives accurate count.",
        ),
        (
            "Code vs prose token density?",
            "Code often uses more tokens per line (punctuation, identifiers split). Budget higher for code review features.",
        ),
        (
            "What happens on context overflow?",
            "API 400 error or provider-side truncation (dangerous). App should pre-validate and fail gracefully with user message.",
        ),
        (
            "Tokenization and training-serving skew?",
            "Offline eval must use same tokenizer version as production API. Vocab changes break reproducibility.",
        ),
        (
            "SDE3: design context management for 200K chat app?",
            "Pre-count with model tokenizer; tiered memory (summary + last K turns); RAG for docs; reject with clear UX above threshold; log p95 prompt size; tie to "
            + LINKS["cost"]
            + " routing.",
        ),
    ),
)

# ── 3. pretraining-sft-rlhf ─────────────────────────────────────────
TOPICS["pretraining-sft-rlhf"] = dict(
    title="Pre-training, SFT & RLHF",
    nav="Alignment",
    hero="The three-stage pipeline from internet-scale pre-training through supervised fine-tuning to preference alignment (RLHF/DPO) that turns a base model into a helpful chat assistant.",
    tags=_tags(("Pre-train", ""), ("SFT", " orange"), ("RLHF", " green"), ("DPO", " pink")),
    main_img="pretraining-sft-rlhf-main.png",
    main_cap="Corpus pre-training learns next-token prediction; SFT teaches instruction format; RLHF/DPO aligns outputs with human preferences before production deployment.",
    nav_items=_nav(
        ("01", "whatwhy", "What & Why"), ("01a", "concepts", "Core Concepts"), ("01b", "api", "API Surface"),
        ("02", "whento", "When to Use"), ("03", "architecture", "Architecture"), ("04", "pretrain", "Pre-training"),
        ("05", "sft", "SFT"), ("06", "rlhf", "RLHF & DPO"), ("07", "data", "Data Quality"),
        ("08", "lora", "LoRA SFT"), ("09", "production", "Production & Ops"), ("10", "shows-up", "Where It Shows Up"),
        ("11", "pitfalls", "Pitfalls"), ("12", "interview", "Interview Q&A"),
    ),
    sections=[
        ("whatwhy", "01", "What & Why", card("<p><strong>Pre-training</strong> learns language from raw text. <strong>SFT</strong> teaches chat format. <strong>RLHF/DPO</strong> aligns with human preferences (helpful, harmless, honest).</p>" + f"<blockquote>System pipeline detail: {LINKS['rlhf_sys']}. Cheap adaptation: {LINKS['lora']}.</blockquote>")),
        ("concepts", "01a", "Core Concepts", card(tbl([(("th","Term"),("th","Definition"),("th","Gotcha")),(("td","Pre-training"),("td","Next-token CE on massive corpus"),("td","Stale facts; not your private data")),(("td","SFT"),("td","Supervised instruction-response pairs"),("td","Quality &gt; quantity")),(("td","RLHF"),("td","Reward model + PPO policy optimization"),("td","Complex; KL to base")),(("td","DPO"),("td","Direct preference optimization"),("td","Simpler than PPO")),(("td","Chinchilla"),("td","Optimal tokens per parameter"),("td","Most apps don't pre-train")),(("td","Alignment tax"),("td","Capability tradeoff post-RLHF"),("td","May refuse valid tasks"))]))),
        ("api", "01b", "API Surface", card('<pre># HuggingFace TRL — SFT\nfrom trl import SFTTrainer\n# trainer = SFTTrainer(model, train_dataset=..., peft_config=lora_config)\n\n# DPO\nfrom trl import DPOTrainer\n# pairs: {prompt, chosen, rejected}</pre>')),
        ("whento", "02", "When to Use / When NOT", card(tbl([(("th","Stage"),("th","You"),("th","Skip")),(("td","Pre-train"),("td","Foundation lab only"),("td","Product teams")),(("td","SFT"),("td","Custom tone/format"),("td","Prompt fixes enough")),(("td","RLHF"),("td","Safety-critical deploy"),("td","Internal tools only")),(("td","DPO"),("td","Preference data available"),("td","No ranking labels"))]))),
        ("architecture", "03", "Architecture", card('<pre>Corpus -> Pre-train (weeks, $M) -> Base checkpoint\n  -> SFT JSONL (instruction, response) -> Instruct model\n  -> Preference pairs -> RM + PPO OR DPO -> Aligned model -> API</pre>', hl=True)),
        ("pretrain", "04", "Deep Dive: Pre-training", card("<p>Self-supervised next-token prediction on web, books, code. Compute-heavy (Chinchilla: ~20 tokens/param). Output: base model that completes text but doesn't follow instructions well.</p>")),
        ("sft", "05", "Deep Dive: SFT", diag("pretraining-sft-rlhf-sft-zoom.png", "SFT trains on instruction-response pairs with loss on assistant tokens only.") + card("<p>10K&ndash;100K high-quality pairs. Mask user tokens in loss. Teaches markdown, tool syntax, refusal templates. Risk: overfit narrow demo style.</p>")),
        ("rlhf", "06", "Deep Dive: RLHF & DPO", diag("pretraining-sft-rlhf-rlhf-zoom.png", "RLHF: reward model from rankings + PPO with KL penalty. DPO: direct preference loss without explicit RM.") + card("<p><strong>RLHF:</strong> human ranks A vs B &rarr; train reward model &rarr; PPO optimizes policy with KL to prevent collapse. <strong>DPO:</strong> optimize preference likelihood directly &mdash; stable, widely adopted.</p>")),
        ("data", "07", "Deep Dive: Data Quality", card("<p>Poisoned or biased SFT data propagates to production. Filter PII, toxic pairs, benchmark leakage. Human review on edge cases. Version datasets like code.</p>")),
        ("lora", "08", "Deep Dive: LoRA for SFT", card(f"<p>Low-rank adapters train 0.1&ndash;1% of params on consumer GPUs. See {LINKS['lora']} for QLoRA, rank selection, merge vs adapter serving.</p>")),
        ("production", "09", "Production & Ops", card("<ul><li>Most products consume aligned API models</li><li>Track base model version + alignment stage</li><li>Eval before/after SFT on golden set</li><li>Rollback checkpoint if regression</li></ul>")),
        ("shows-up", "10", "Where It Shows Up", card("<ul>" + f"<li>{LINKS['llm']}</li><li>{LINKS['rlhf_sys']}</li><li>{LINKS['lora']}</li><li>{LINKS['const']}</li><li>{LINKS['eval']}</li><li>{LINKS['safety']}</li></ul>")),
        ("pitfalls", "11", "Common Pitfalls", card("<ul><li>Benchmark examples in SFT data (eval leakage)</li><li>Skipping SFT and expecting base model to chat</li><li>RLHF without KL &rarr; gibberish reward hacking</li><li>Assuming fine-tune injects fresh facts (use RAG)</li></ul>")),
    ],
    qa=_qa(
        ("Explain pre-training vs SFT vs RLHF.", "Pre-train: next-token on raw text, learns language. SFT: supervised pairs teach instruction following. RLHF/DPO: optimize human preferences for helpfulness/safety."),
        ("What is DPO vs RLHF?", "RLHF trains reward model then PPO policy optimization with KL penalty. DPO directly optimizes preference pairs without explicit RM &mdash; simpler, stable."),
        ("Why not skip SFT?", "Base models don't follow instructions or chat format reliably. SFT is the cheapest alignment step with biggest UX jump."),
        ("Chinchilla optimal training?", "~20 tokens per parameter for compute-optimal pre-training. Product teams rarely pre-train; consume APIs."),
        ("Can SFT replace RAG?", "No. SFT teaches style/format, not fresh facts. RAG injects knowledge at inference."),
        ("What is KL penalty in RLHF?", "Keeps policy close to reference model during PPO. Without KL, model hacks reward with nonsense."),
        ("LoRA SFT when?", "Custom tone, domain format, budget constraints. Full fine-tune for large behavior shifts with big data."),
        ("Alignment tax?", "Post-RLHF models may score lower on some benchmarks but safer in chat. Trade capability for controllability."),
        ("How evaluate SFT?", "Golden instruction set, human side-by-side, automated rubrics. Compare to base before deploy."),
        ("Constitutional AI?", "AI-generated critiques guide preference data. Anthropic lineage; see " + LINKS['const'] + "."),
        ("Who trains frontier models?", "Labs with 1000s of GPUs. Apps use OpenAI/Anthropic/Meta weights."),
        ("SDE3: design alignment for enterprise bot?", "Start API model + " + LINKS['prompt'] + ". Add LoRA SFT on approved Q&A pairs. RAG for facts. Output guardrails from " + LINKS['safety'] + ". Eval harness gates releases."),
    ),
)

# ── 4. evaluation-metrics ───────────────────────────────────────────
TOPICS["evaluation-metrics"] = dict(
    title="Evaluation Metrics",
    nav="Eval Metrics",
    hero="Automatic metrics, benchmark suites, LLM-as-judge, human eval, and production KPIs for measuring LLM quality without fooling yourself with leaky benchmarks.",
    tags=_tags(("LLM-as-Judge", ""), ("MMLU", " orange"), ("Faithfulness", " green"), ("Golden Set", " pink")),
    main_img="evaluation-metrics-main.png",
    main_cap="Evaluation spans automatic scores, public benchmarks, LLM judges, human side-by-side, and live production metrics — no single number captures chat quality.",
    nav_items=_nav(
        ("01", "whatwhy", "What & Why"), ("01a", "concepts", "Core Concepts"), ("01b", "api", "API Surface"),
        ("02", "whento", "When to Use"), ("03", "architecture", "Architecture"), ("04", "auto", "Automatic Metrics"),
        ("05", "benchmarks", "Benchmarks"), ("06", "judge", "LLM-as-Judge"), ("07", "human", "Human Eval"),
        ("08", "prod", "Production Metrics"), ("09", "production", "Production & Ops"), ("10", "shows-up", "Where It Shows Up"),
        ("11", "pitfalls", "Pitfalls"), ("12", "interview", "Interview Q&A"),
    ),
    sections=[
        ("whatwhy", "01", "What & Why", card("<p>LLM output is high-dimensional. You need <strong>task-specific metrics</strong>, held-out golden sets, and human calibration. Wrong metrics optimize for benchmarks, not users.</p>" + f"<blockquote>Production eval harness: {LINKS['eval_h']}.</blockquote>")),
        ("concepts", "01a", "Core Concepts", card(tbl([(("th","Term"),("th","Definition"),("th","Gotcha")),(("td","Perplexity"),("td","exp(avg NLL); LM quality"),("td","Weak post-RLHF chat signal")),(("td","BLEU/ROUGE"),("td","N-gram overlap"),("td","Poor for paraphrase")),(("td","pass@k"),("td","Code: any of k samples passes tests"),("td","HumanEval standard")),(("td","LLM-as-judge"),("td","Strong model scores weak model"),("td","Position bias")),(("td","Faithfulness"),("td","Answer supported by context"),("td","Critical for RAG")),(("td","Eval leakage"),("td","Benchmark in training data"),("td","Inflated scores"))]))),
        ("api", "01b", "API Surface", card('<pre># ragas faithfulness example\nfrom ragas.metrics import faithfulness\n# score = faithfulness(question, answer, contexts)\n\n# OpenAI judge\njudge_prompt = """Rate faithfulness 1-5. Context: {ctx}\\nAnswer: {ans}"""</pre>')),
        ("whento", "02", "When to Use / When NOT", card(tbl([(("th","Metric"),("th","Use"),("th","Skip")),(("td","BLEU/ROUGE"),("td","Summarization baseline"),("td","Open-ended chat")),(("td","LLM judge"),("td","Scale + rubrics"),("td","High-stakes without human cal")),(("td","MMLU"),("td","Knowledge probe"),("td","Product-specific tasks")),(("td","Human ELO"),("td","Model selection"),("td","Daily CI (too slow)"))]))),
        ("architecture", "03", "Architecture", card('<pre>Golden set -> {Automatic, Benchmark, LLM-judge, Human} -> Dashboard\n  -> CI gate (block if faithfulness drops >2%)\n  -> Production: thumbs, escalation rate, latency</pre>', hl=True)),
        ("auto", "04", "Deep Dive: Automatic Metrics", card("<p>Exact match for classification. JSON schema validation for structured output. Embedding cosine for semantic similarity. Cheap but shallow for open text.</p>")),
        ("benchmarks", "05", "Deep Dive: Benchmark Suites", diag("evaluation-metrics-benchmark-zoom.png", "MMLU, HumanEval, GSM8K, MT-Bench — public probes with contamination risk.") + card("<p><strong>MMLU:</strong> multi-domain MCQ. <strong>HumanEval:</strong> Python pass@k. <strong>GSM8K:</strong> grade-school math. Use as directional, not sole KPI.</p>")),
        ("judge", "06", "Deep Dive: LLM-as-Judge", diag("evaluation-metrics-llm-judge-zoom.png", "Judge model scores candidate answers on rubric dimensions with chain-of-thought reasoning.") + card("<p>G-Eval style: rubric + CoT before score. Mitigate position bias by swapping A/B order. Calibrate against human labels monthly.</p>")),
        ("human", "07", "Deep Dive: Human Evaluation", card("<p>Side-by-side preference (ELO). Task-specific rubrics. 50&ndash;200 prompts minimum for model comparison. Gold standard for high-stakes.</p>")),
        ("prod", "08", "Deep Dive: Production Metrics", card("<ul><li>User thumbs up/down rate</li><li>Escalation to human support</li><li>Faithfulness on sampled RAG traces</li><li>Hallucination report rate</li></ul>")),
        ("production", "09", "Production & Ops", card("<ul><li>Nightly eval on golden set in CI</li><li>Alert on score regression &gt;2%</li><li>Store prompt/response for audit</li><li>A/B new prompt versions</li></ul>")),
        ("shows-up", "10", "Where It Shows Up", card("<ul>" + f"<li>{LINKS['eval_h']}</li><li>{LINKS['halluc']}</li><li>{LINKS['rag']}</li><li>{LINKS['prompt']}</li><li>{LINKS['pretrain']}</li></ul>")),
        ("pitfalls", "11", "Common Pitfalls", card("<ul><li>Optimizing BLEU for chat</li><li>Benchmark contamination in SFT data</li><li>Judge model same as candidate</li><li>No held-out golden set</li><li>Single metric dashboards</li></ul>")),
    ],
    qa=_qa(
        ("Why perplexity insufficient for chat?", "Measures language modeling on raw text; RLHF changes distribution. Low perplexity ≠ helpful or safe assistant."),
        ("Explain pass@k.", "Generate k code samples; success if any passes unit tests. HumanEval reports pass@1 and pass@10."),
        ("LLM-as-judge pitfalls?", "Position bias, leniency, self-preference if same model. Fix: swap order, use stronger judge, calibrate to humans."),
        ("Faithfulness vs relevance?", "Relevance: chunk matches question. Faithfulness: answer supported by chunk. RAG needs both."),
        ("What is eval leakage?", "Benchmark examples appeared in pre-training or SFT. Scores inflated. Hold out custom golden sets."),
        ("Minimum golden set size?", "50 tasks for smoke; 200+ for model swap decisions. Cover edge cases and failure modes."),
        ("Production metrics beyond accuracy?", "Latency, cost/request, escalation rate, citation click-through, user retention."),
        ("When human eval required?", "Medical, legal, financial advice; model launch decisions; calibrating LLM judges."),
        ("Compare two prompt versions?", "Same golden set, paired outputs, LLM judge + human sample, statistical significance on win rate."),
        ("RAG eval metrics?", "Context precision/recall, answer faithfulness, answer relevance (RAGAS framework)."),
        ("CI gate example?", "Block deploy if faithfulness &lt;0.85 or JSON parse rate &lt;99% on golden set."),
        ("SDE3: eval strategy for RAG bot?", "200-query golden set with labeled passages; nightly RAGAS + human spot check; LLM judge calibrated monthly; production sample 1% for audit; tie to " + LINKS['halluc'] + " abstention thresholds."),
    ),
)

# ── 5. hallucination-grounding ──────────────────────────────────────
TOPICS["hallucination-grounding"] = dict(
    title="Hallucination & Grounding",
    nav="Grounding",
    hero="Why LLMs confabulate fluent falsehoods, and production patterns — RAG, citations, faithfulness checks, and abstention — to ground answers in verifiable sources.",
    tags=_tags(("Hallucination", ""), ("RAG", " orange"), ("Citations", " green"), ("Abstention", " pink")),
    main_img="hallucination-grounding-main.png",
    main_cap="Ungrounded generation produces confident errors; grounded pipelines retrieve evidence, require citations, and abstain when retrieval confidence is low.",
    nav_items=_nav(
        ("01", "whatwhy", "What & Why"), ("01a", "concepts", "Core Concepts"), ("01b", "api", "API Surface"),
        ("02", "whento", "When to Use"), ("03", "architecture", "Architecture"), ("04", "why", "Why Hallucinate"),
        ("05", "rag", "RAG Grounding"), ("06", "citations", "Citations"), ("07", "abstain", "Abstention"),
        ("08", "faith", "Faithfulness Checks"), ("09", "production", "Production & Ops"), ("10", "shows-up", "Where It Shows Up"),
        ("11", "pitfalls", "Pitfalls"), ("12", "interview", "Interview Q&A"),
    ),
    sections=[
        ("whatwhy", "01", "What & Why", card("<p><strong>Hallucination</strong> = fluent output not supported by facts or context. Fundamental to generative LMs (they optimize plausibility, not truth). Mitigate with retrieval, tools, and abstention — not bigger models alone.</p>")),
        ("concepts", "01a", "Core Concepts", card(tbl([(("th","Term"),("th","Definition"),("th","Gotcha")),(("td","Hallucination"),("td","False but confident claim"),("td","Not always factual errors")),(("td","Grounding"),("td","Tie answer to source evidence"),("td","RAG + citations")),(("td","Faithfulness"),("td","Answer entailed by context"),("td","Eval with LLM judge")),(("td","Abstention"),("td","Decline when uncertain"),("td","Better than wrong")),(("td","Confabulation"),("td","Fabricated citations/names"),("td","Common in legal/medical"))]))),
        ("api", "01b", "API Surface", card("<pre>system = &quot;&quot;&quot;Answer ONLY from context. Cite [chunk_id].\nIf insufficient, say I don't know.&quot;&quot;&quot;\n# Post-check: faithfulness_score(answer, chunks) &gt;= 0.8</pre>")),
        ("whento", "02", "When to Use / When NOT", card(tbl([(("th","Pattern"),("th","Use"),("th","Skip")),(("td","RAG + cite"),("td","Factual Q&A"),("td","Creative writing")),(("td","Tool lookup"),("td","Live data (stock, weather)"),("td","Static FAQ")),(("td","Abstention"),("td","Low retrieval score"),("td","Always-answer UX")),(("td","Fine-tune only"),("td","Style"),("td","Fresh facts"))]))),
        ("architecture", "03", "Architecture", card('<pre>Query -> Retrieve top-k -> Rerank -> Prompt with chunks\n  -> LLM (cite-only instruction) -> Faithfulness check -> User</pre>', hl=True)),
        ("why", "04", "Deep Dive: Why Models Hallucinate", card("<p>Training on internet text with errors; next-token objective rewards plausible continuations; no built-in fact verifier; parametric memory is stale and incomplete.</p>")),
        ("rag", "05", "Deep Dive: RAG Grounding", diag("hallucination-grounding-rag-zoom.png", "Retrieve, rerank, inject chunks with IDs; LLM must cite sources.") + card(f"<p>See {LINKS['rag']} for full pipeline. Hybrid search + reranker improves chunk quality. Low recall = guaranteed hallucination.</p>")),
        ("citations", "06", "Deep Dive: Citations & Attribution", card("<p>Require [doc_id:chunk] in output. UI links to source spans. Post-validate cited IDs exist in retrieved set. Penalize uncited factual claims in eval.</p>")),
        ("abstain", "07", "Deep Dive: Abstention", diag("hallucination-grounding-abstention-zoom.png", "Threshold on retrieval score triggers 'I don't know' instead of guessing.") + card("<p>Set min similarity score (e.g. 0.72). Secondary LLM: 'Can you answer from context only?' Tune on golden set for precision/recall tradeoff.</p>")),
        ("faith", "08", "Deep Dive: Faithfulness Checks", card(f"<p>LLM-as-judge or NLI model compares answer to chunks. Block or regenerate if score low. See {LINKS['eval']} and {LINKS['eval_h']}.</p>")),
        ("production", "09", "Production & Ops", card("<ul><li>Sample 1% traces for human audit</li><li>Track abstention rate (too high = bad retrieval)</li><li>User report hallucination button</li><li>Log retrieval scores with answers</li></ul>")),
        ("shows-up", "10", "Where It Shows Up", card("<ul>" + f"<li>{LINKS['rag']}</li><li>{LINKS['eval']}</li><li>{LINKS['prompt']}</li><li>{LINKS['safety']}</li><li>{LINKS['search']}</li><li>{LINKS['patterns']}</li></ul>")),
        ("pitfalls", "11", "Common Pitfalls", card("<ul><li>Believing bigger model won't hallucinate</li><li>RAG with bad chunks (garbage in)</li><li>No citation enforcement</li><li>Penalizing abstention in metrics</li><li>Prompt injection in retrieved docs</li></ul>")),
    ],
    qa=_qa(
        ("What is hallucination?", "Model generates plausible but false or unsupported content. Root cause: LM objective is probability, not truth."),
        ("Can RLHF eliminate hallucination?", "Reduces some errors; does not fix stale parametric memory. RAG/tools still required for facts."),
        ("RAG vs fine-tune for facts?", "RAG injects fresh evidence at inference. Fine-tune bakes in training-time facts (stale). Prefer RAG for changing knowledge."),
        ("Citation enforcement?", "System prompt + post-parse validate chunk IDs + faithfulness judge. UI shows source links."),
        ("When should model abstain?", "Retrieval score below threshold, faithfulness check fails, or self-check cannot answer from context."),
        ("Faithfulness vs hallucination rate?", "Faithfulness measures support from provided context; hallucination often means wrong vs world knowledge."),
        ("Tool use for grounding?", "Calculator, SQL, search API return verifiable results. Agent verifies before stating numbers."),
        ("Detect hallucination in prod?", "Sample LLM judge, user reports, contradiction checks, compare to knowledge graph."),
        ("Prompt 'don't hallucinate'?", "Weak alone. Structure + retrieval + validation beats pleading."),
        ("Legal/medical risk?", "Mandatory RAG from approved corpus, abstention, human review, audit logs, disclaimers."),
        ("Retrieval failure modes?", "Wrong chunk retrieved → grounded but wrong answer. Fix with hybrid search + reranker."),
        ("SDE3: zero-hallucination support bot?", "Approved KB only; hybrid+RAG; cite-or-abstain prompt; faithfulness gate; escalation queue; eval 200 golden; monitor abstention and false-positive rate."),
    ),
)

# ── 6. ai-safety-guardrails ───────────────────────────────────────────
TOPICS["ai-safety-guardrails"] = dict(
    title="AI Safety & Guardrails",
    nav="Safety",
    hero="Defense-in-depth for LLM apps: input filtering, system policies, output validation, PII handling, jailbreak detection, and human-in-the-loop for high-risk paths.",
    tags=_tags(("Guardrails", ""), ("Jailbreak", " orange"), ("PII", " green"), ("NeMo", " pink")),
    main_img="ai-safety-guardrails-main.png",
    main_cap="Layered safety: sanitize input, enforce system policy in the LLM, validate output, and route edge cases to human review before users see responses.",
    nav_items=_nav(
        ("01", "whatwhy", "What & Why"), ("01a", "concepts", "Core Concepts"), ("01b", "api", "API Surface"),
        ("02", "whento", "When to Use"), ("03", "architecture", "Architecture"), ("04", "input", "Input Guardrails"),
        ("05", "output", "Output Guardrails"), ("06", "pii", "PII & Privacy"), ("07", "jailbreak", "Jailbreak Defense"),
        ("08", "hitl", "Human-in-the-Loop"), ("09", "production", "Production & Ops"), ("10", "shows-up", "Where It Shows Up"),
        ("11", "pitfalls", "Pitfalls"), ("12", "interview", "Interview Q&A"),
    ),
    sections=[
        ("whatwhy", "01", "What & Why", card("<p>Aligned base models reduce harm but <strong>app-level guardrails</strong> enforce your policy: block jailbreaks, redact PII, validate JSON, refuse out-of-scope topics. Fail closed on high-risk domains.</p>" + f"<blockquote>Red-teaming: {LINKS['const']}.</blockquote>")),
        ("concepts", "01a", "Core Concepts", card(tbl([(("th","Term"),("th","Definition"),("th","Gotcha")),(("td","Guardrails"),("td","Programmatic safety layers around LLM"),("td","Not just system prompt")),(("td","Jailbreak"),("td","Bypass safety via clever prompt"),("td","Evolving arms race")),(("td","Llama Guard"),("td","Classifier for unsafe I/O"),("td","Latency add ~20ms")),(("td","NeMo Guardrails"),("td","Colang policy DSL"),("td","NVIDIA ecosystem")),(("td","Fail closed"),("td","Block on classifier error"),("td","Better than leak"))]))),
        ("api", "01b", "API Surface", card('<pre># NeMo Guardrails colang snippet\n# define user ask chemistry\n# define bot refuse chemistry\n# define flow\n#   user ask chemistry\n#   bot refuse chemistry</pre>')),
        ("whento", "02", "When to Use / When NOT", card(tbl([(("th","Control"),("th","Use"),("th","Skip")),(("td","Input classifier"),("td","Public-facing chat"),("td","Internal dev tools")),(("td","Output schema"),("td","Structured API"),("td","Free-form creative")),(("td","HITL"),("td","Finance/health"),("td","Low-risk FAQ")),(("td","Topic blocklist"),("td","Regulated industries"),("td","General assistant"))]))),
        ("architecture", "03", "Architecture", card('<pre>User -> Input filter -> LLM (+ system policy) -> Output filter -> User\n              | jailbreak              | toxicity/PII/schema\n              v                          v\n         Block / sanitize            Regenerate / block</pre>', hl=True)),
        ("input", "04", "Deep Dive: Input Guardrails", diag("ai-safety-guardrails-input-zoom.png", "Jailbreak detection, PII redaction, and injection scanning on user and RAG content.") + card("<p>Classify jailbreak attempts. Strip/mask PII before logging. Scan retrieved docs for injection ('ignore instructions'). Separate trusted system from untrusted user content.</p>")),
        ("output", "05", "Deep Dive: Output Guardrails", diag("ai-safety-guardrails-output-zoom.png", "Toxicity scoring, schema validation, streaming cutoffs, and topic blocklists on model output.") + card("<p>JSON schema validation; toxicity threshold; block regex (API keys, SSN patterns); streaming token filter.</p>")),
        ("pii", "06", "Deep Dive: PII & Privacy", card("<p>Detect emails, phones, SSN with NER/regex. Redact before logs and third-party APIs. Regional compliance (GDPR delete, data residency).</p>")),
        ("jailbreak", "07", "Deep Dive: Jailbreak Defense", card("<p>Layer: classifier, prompt hardening, retrieval isolation, output refusal patterns. Red-team regularly. Never trust 'ignore previous instructions' in user docs.</p>")),
        ("hitl", "08", "Deep Dive: Human-in-the-Loop", card(f"<p>Queue low-confidence or high-risk outputs for human approval. See {LINKS['prod_agent']}.</p>")),
        ("production", "09", "Production & Ops", card("<ul><li>Log all guardrail triggers (no raw PII)</li><li>Weekly red-team sprint</li><li>Version guardrail models with LLM</li><li>Incident runbook for bypass reports</li></ul>")),
        ("shows-up", "10", "Where It Shows Up", card("<ul>" + f"<li>{LINKS['prompt']}</li><li>{LINKS['halluc']}</li><li>{LINKS['const']}</li><li>{LINKS['prod_agent']}</li><li>{LINKS['pretrain']}</li></ul>")),
        ("pitfalls", "11", "Common Pitfalls", card("<ul><li>Relying only on model refusals</li><li>Logging full prompts with PII</li><li>No red-teaming after prompt changes</li><li>Guardrails only on output not input</li><li>False sense from single-turn tests</li></ul>")),
    ],
    qa=_qa(
        ("Guardrails vs alignment?", "Alignment (RLHF) shapes base model behavior. Guardrails are app-specific programmatic filters — you control both layers."),
        ("Defense in depth?", "Input classify + system prompt + output validate + HITL. No single layer catches all jailbreaks."),
        ("Prompt injection from RAG?", "Untrusted docs in prompt. Mitigate: delimiters, instruction hierarchy, scan docs, never execute doc instructions."),
        ("Llama Guard use case?", "Lightweight classifier on input/output for violence, hate, etc. before/after LLM call."),
        ("Fail open vs closed?", "High-risk domains: fail closed (block if classifier uncertain). Low-risk: may fail open with logging."),
        ("PII in logs?", "Redact before logging. Use trace IDs not content. Compliance audits need policy not raw chats."),
        ("Streaming guardrails?", "Buffer tokens; run toxicity on windows; cut stream and replace with safe message."),
        ("NeMo Guardrails?", "Colang DSL for flows (if user X then bot Y). Good for deterministic policy paths."),
        ("Red-teaming frequency?", "After every major prompt/model change; continuous automated adversarial suite in CI."),
        ("Regulated industry pattern?", "Allowlist topics, approved KB only, mandatory disclaimers, HITL, audit trail."),
        ("Can guardrails block legitimate use?", "Yes — tune thresholds; offer escalation path; monitor false positive rate."),
        ("SDE3: safety architecture for customer chat?", "Input jailbreak classifier; isolated system prompt; RAG injection guards; output schema+toxicity; PII redaction; sample human review; tie to " + LINKS['eval'] + " safety golden set."),
    ),
)

# ── 7. cost-latency-tradeoffs ─────────────────────────────────────────
TOPICS["cost-latency-tradeoffs"] = dict(
    title="Cost & Latency Tradeoffs",
    nav="Cost/Latency",
    hero="Token economics, TTFT vs tokens/sec, model routing cascades, caching, quantization, and batch APIs — how to hit latency SLOs without bankrupting the feature.",
    tags=_tags(("$/1M tokens", ""), ("TTFT", " orange"), ("Routing", " green"), ("Semantic Cache", " pink")),
    main_img="cost-latency-tradeoffs-main.png",
    main_cap="Quality, cost, and latency form a triangle: model routing, prompt compression, caching, and quantization move you along the edges.",
    nav_items=_nav(
        ("01", "whatwhy", "What & Why"), ("01a", "concepts", "Core Concepts"), ("01b", "api", "API Surface"),
        ("02", "whento", "When to Use"), ("03", "architecture", "Architecture"), ("04", "pricing", "Token Pricing"),
        ("05", "latency", "Latency Breakdown"), ("06", "routing", "Model Routing"), ("07", "cache", "Caching"),
        ("08", "quantize", "Quantization"), ("09", "production", "Production & Ops"), ("10", "shows-up", "Where It Shows Up"),
        ("11", "pitfalls", "Pitfalls"), ("12", "interview", "Interview Q&A"),
    ),
    sections=[
        ("whatwhy", "01", "What & Why", card("<p>LLM features bill per token and wait per GPU second. <strong>TTFT</strong> (time-to-first-token) drives perceived speed; <strong>tokens/sec</strong> drives total wait. Cost scales with model tier, context length, and traffic.</p>" + f"<blockquote>Semantic cache systems: <a href='../systems/semantic-cache.html'>Semantic Cache</a>.</blockquote>")),
        ("concepts", "01a", "Core Concepts", card(tbl([(("th","Term"),("th","Definition"),("th","Gotcha")),(("td","TTFT"),("td","Time until first streamed token"),("td","Prefill-dominated")),(("td","Tokens/sec"),("td","Decode throughput"),("td","Memory bandwidth bound")),(("td","$/1M tokens"),("td","Input + output priced separately"),("td","Output often 2-4× input")),(("td","Model cascade"),("td","Cheap model first, escalate if needed"),("td","Log escalation rate")),(("td","Batch API"),("td","50% discount, 24h SLA"),("td","Offline jobs only"))]))),
        ("api", "01b", "API Surface", card('<pre># Cost estimate\nprompt_toks = 2000\ncompletion_toks = 500\nprice_in, price_out = 0.15, 0.60  # gpt-4o-mini per 1M\ncost = (prompt_toks * price_in + completion_toks * price_out) / 1e6</pre>')),
        ("whento", "02", "When to Use / When NOT", card(tbl([(("th","Tactic"),("th","Use"),("th","Skip")),(("td","gpt-4o-mini router"),("td","High volume mixed queries"),("td","All queries need frontier")),(("td","Prompt cache"),("td","Repeated system prompts"),("td","Unique prompts every call")),(("td","INT4 quant"),("td","Self-host 70B"),("td","API-only small team")),(("td","Batch API"),("td","Nightly summarization"),("td","Interactive chat"))]))),
        ("architecture", "03", "Architecture", card('<pre>Request -> Router (mini vs frontier) -> [Cache hit?] -> LLM\n  -> Stream SSE -> usage{prompt,completion}_tokens -> billing</pre>', hl=True)),
        ("pricing", "04", "Deep Dive: Token Pricing", card("<p>Example (order-of-magnitude): gpt-4o-mini $0.15/$0.60 per 1M in/out; gpt-4o ~$2.50/$10. Long system prompts + RAG chunks dominate input cost. Always set max_tokens.</p>")),
        ("latency", "05", "Deep Dive: Latency Breakdown", card(f"<p><strong>Prefill:</strong> parallel over prompt &rarr; TTFT. <strong>Decode:</strong> serial tokens &rarr; total time. See {LINKS['kv']} for memory effects. Streaming improves UX without reducing total time.</p>")),
        ("routing", "06", "Deep Dive: Model Routing", diag("cost-latency-tradeoffs-routing-zoom.png", "Cascade: classify query complexity, route 80% to mini model, escalate hard queries to frontier.") + card("<p>Router: heuristic (token length, keywords) or small classifier LLM. Track quality regression on escalated vs non-escalated buckets.</p>")),
        ("cache", "07", "Deep Dive: Caching", diag("cost-latency-tradeoffs-cache-zoom.png", "Exact prompt hash cache and semantic embedding cache for near-duplicate queries.") + card("<p>OpenAI automatic prompt caching on repeated prefixes. Semantic cache: embed query, return cached answer if similarity &gt;0.95 with TTL.</p>")),
        ("quantize", "08", "Deep Dive: Quantization & Self-Host", card(f"<p>AWQ/GPTQ INT4 fits 70B on 2×80GB. Trade ~1-3% quality for 2× throughput. See {LINKS['vllm']} for serving economics break-even vs API.</p>")),
        ("production", "09", "Production & Ops", card("<ul><li>Dashboard: cost/request, p50/p99 TTFT, tokens/request</li><li>Budget alerts per feature flag</li><li>A/B quality on routed tiers</li><li>Batch offline workloads</li></ul>")),
        ("shows-up", "10", "Where It Shows Up", card("<ul>" + f"<li>{LINKS['llm']}</li><li>{LINKS['kv']}</li><li>{LINKS['token']}</li><li>{LINKS['patterns']}</li><li>{LINKS['vllm']}</li><li><a href='../systems/semantic-cache.html'>Semantic Cache</a></li></ul>")),
        ("pitfalls", "11", "Common Pitfalls", card("<ul><li>No max_tokens cap</li><li>Frontier model for all traffic</li><li>Ignoring input token cost of RAG</li><li>Cache without invalidation on KB update</li><li>Optimizing tokens/sec but not TTFT</li></ul>")),
    ],
    qa=_qa(
        ("Estimate cost for 1M requests/day?", "Count avg prompt P and completion C tokens. Cost ≈ R×(P×price_in+C×price_out)/1e6. Add 30% for retries and system overhead."),
        ("TTFT vs total latency?", "TTFT = prefill (prompt processing). Users feel TTFT >500ms. Total = TTFT + (tokens/tok_per_sec). Long answers hurt total even if TTFT OK."),
        ("When self-host beats API?", "When monthly inference spend exceeds GPU+ML ops cost AND quantized model quality suffices. Often >$50K/mo at 70B scale."),
        ("Model routing example?", "Classify intent: FAQ → mini; complex reasoning → frontier. Log escalation rate and quality delta."),
        ("Prompt compression?", "Summarize chat history, trim tool outputs, remove redundant RAG chunks. Saves input $ and TTFT."),
        ("Batch API when?", "Non-interactive: nightly reports, bulk classification. 50% cheaper, 24h window."),
        ("Semantic cache risks?", "Stale answers after KB update; false matches. Set TTL, invalidate on doc version bump."),
        ("Quantization quality impact?", "INT4 AWQ often <2% regression on benchmarks; validate on your golden set."),
        ("Streaming and cost?", "Streaming doesn't reduce tokens billed; improves perceived latency only."),
        ("What drives decode slowness?", "Memory bandwidth reading KV cache; batch size; model size. GQA reduces KV bytes."),
        ("Cost of long context?", "Linear in input tokens for $; quadratic prefill compute without sparse attention."),
        ("SDE3: cut LLM spend 60%?", "Router to mini; prompt cache; compress history; semantic cache FAQ; batch offline jobs; rerank top-3 not top-20; monitor quality weekly on golden set."),
    ),
)

# ── 8. ai-system-design-patterns ──────────────────────────────────────
TOPICS["ai-system-design-patterns"] = dict(
    title="AI System Design Patterns",
    nav="AI Patterns",
    hero="Reusable architecture patterns for production AI: RAG, agent loops, routers, map-reduce, human-in-the-loop, and model cascades — when to compose each.",
    tags=_tags(("RAG", ""), ("Agent Loop", " orange"), ("Router", " green"), ("Map-Reduce", " pink")),
    main_img="ai-system-design-patterns-main.png",
    main_cap="Production AI composes patterns around the LLM primitive: retrieval for facts, agents for tools, routers for cost, map-reduce for long docs.",
    nav_items=_nav(
        ("01", "whatwhy", "What & Why"), ("01a", "concepts", "Core Concepts"), ("01b", "api", "API Surface"),
        ("02", "whento", "When to Use"), ("03", "architecture", "Architecture"), ("04", "rag", "RAG Pattern"),
        ("05", "agent", "Agent Loop"), ("06", "router", "Router & Cascade"), ("07", "mapreduce", "Map-Reduce"),
        ("08", "hitl", "Human-in-the-Loop"), ("09", "production", "Production & Ops"), ("10", "shows-up", "Where It Shows Up"),
        ("11", "pitfalls", "Pitfalls"), ("12", "interview", "Interview Q&A"),
    ),
    sections=[
        ("whatwhy", "01", "What & Why", card("<p>Interview system design for AI is <strong>composing patterns</strong> around next-token prediction — not drawing one box labeled 'GPT'. Pick RAG vs fine-tune vs agent based on requirements.</p>")),
        ("concepts", "01a", "Core Concepts", card(tbl([(("th","Pattern"),("th","Purpose"),("th","Gotcha")),(("td","RAG"),("td","Ground in external KB"),("td","Retrieval quality is bottleneck")),(("td","Agent loop"),("td","Plan, tool, observe, repeat"),("td","Runaway loops without max steps")),(("td","Router"),("td","Pick model/tool by intent"),("td","Misroute hurts quality")),(("td","Map-reduce"),("td","Summarize long docs in chunks"),("td","Loses cross-chunk refs")),(("td","HITL"),("td","Human approves high-risk"),("td","Latency + ops cost"))]))),
        ("api", "01b", "API Surface", card('<pre># LangGraph agent sketch\ngraph.add_node("plan", planner)\ngraph.add_node("tool", tool_executor)\ngraph.add_edge("plan", "tool")\ngraph.add_conditional_edges("tool", should_continue)</pre>')),
        ("whento", "02", "When to Use / When NOT", card(tbl([(("th","Need"),("th","Pattern"),("th","Avoid")),(("td","Fresh facts"),("td","RAG"),("td","Fine-tune alone")),(("td","API actions"),("td","Agent + tools"),("td","Plain completion")),(("td","100-page doc"),("td","Map-reduce or RAG"),("td","Single prompt")),(("td","Cost at scale"),("td","Router cascade"),("td","One frontier model"))]))),
        ("architecture", "03", "Architecture", card('<pre>Client -> API Gateway -> [Router] -> Pattern orchestrator\n  RAG | Agent | Map-Reduce | Direct LLM\n  -> Guardrails -> Response</pre>', hl=True)),
        ("rag", "04", "Deep Dive: RAG Pattern", diag("ai-system-design-patterns-rag-finetune-zoom.png", "Decision matrix: RAG for changing facts, fine-tune for style, long context when doc fits once, agents when tools needed.") + card(f"<p>Retrieve &rarr; rerank &rarr; inject &rarr; generate &rarr; cite. See {LINKS['rag']}.</p>")),
        ("agent", "05", "Deep Dive: Agent Loop", diag("ai-system-design-patterns-agent-loop-zoom.png", "Plan → tool call → observe result → reflect until done or max iterations.") + card(f"<p>State machine with max 5-10 steps. See {LINKS['agent']} and {LINKS['langgraph']}.</p>")),
        ("router", "06", "Deep Dive: Router & Model Cascade", card(f"<p>Intent classifier routes to specialist prompts, tools, or model tiers. See {LINKS['cost']}.</p>")),
        ("mapreduce", "07", "Deep Dive: Map-Reduce for Long Context", card("<p>Chunk document, map (summarize/extract per chunk), reduce (merge). Use when doc exceeds context and full RAG index not ready.</p>")),
        ("hitl", "08", "Deep Dive: Human-in-the-Loop", card(f"<p>Queue for approval on low confidence or regulated outputs. {LINKS['prod_agent']}.</p>")),
        ("production", "09", "Production & Ops", card("<ul><li>Start simplest pattern that meets requirements</li><li>Observability per pattern stage</li><li>Feature flags to swap patterns</li><li>Golden eval per pattern change</li></ul>")),
        ("shows-up", "10", "Where It Shows Up", card("<ul>" + f"<li>{LINKS['rag']}</li><li>{LINKS['agent']}</li><li>{LINKS['langgraph']}</li><li>{LINKS['cost']}</li><li>{LINKS['halluc']}</li><li><a href='../systems/chatbot-rag-system.html'>Chatbot with RAG</a></li><li>{LINKS['search']}</li></ul>")),
        ("pitfalls", "11", "Common Pitfalls", card("<ul><li>Agent when single RAG call suffices</li><li>Map-reduce losing global context</li><li>No max steps on agent loops</li><li>Over-engineering before baseline eval</li><li>Mixing patterns without clear ownership</li></ul>")),
    ],
    qa=_qa(
        ("RAG vs fine-tune vs long context?", "RAG: changing KB, citations. Fine-tune: fixed style/format. Long context: single doc fits once, no index ops. Most prod: RAG + small SFT."),
        ("When use an agent?", "Multi-step tasks needing tools (search, SQL, code exec). Not for simple FAQ with good retrieval."),
        ("Draw a RAG system.", "Ingest/chunk/embed/index; query embed/search/rerank; prompt with chunks; LLM answer with citations; faithfulness check."),
        ("Agent loop components?", "Planner LLM, tool registry, executor, memory/state, termination condition, max iterations."),
        ("Router pattern?", "Classify query → route to model tier, specialist agent, or workflow. Log decisions for eval."),
        ("Map-reduce when?", "Doc too long for context, no vector index yet. Parallel chunk summaries then merge."),
        ("HITL when?", "Regulated domains, financial approvals, low model confidence, user-facing irreversible actions."),
        ("Anti-pattern: LLM everywhere?", "Use code/rules for deterministic logic; LLM for language flexibility only."),
        ("How compose RAG + agent?", "Agent decides when to retrieve; retrieval tool in loop; cite sources in final answer."),
        ("System design interview flow?", "Clarify FR/NFR → pick pattern → draw data flow → discuss failure modes → cost/latency → eval plan."),
        ("MVP vs scale?", "MVP: direct LLM or simple RAG. Scale: hybrid search, reranker, router, cache, observability."),
        ("SDE3: design support chatbot?", "RAG on KB + hybrid search; router for billing vs tech; agent with ticket API tool; guardrails; HITL for refunds; eval golden 200; " + LINKS['cost'] + " routing to mini for L1."),
    ),
)

# ── 9. context-window-kv-cache ────────────────────────────────────────
TOPICS["context-window-kv-cache"] = dict(
    title="Context Window & KV Cache",
    nav="KV Cache",
    hero="How context limits, prefill vs decode, KV cache memory growth, GQA, and PagedAttention determine latency, cost, and max concurrent users on GPU inference.",
    tags=_tags(("KV Cache", ""), ("Prefill", " orange"), ("PagedAttention", " green"), ("128K", " pink")),
    main_img="context-window-kv-cache-main.png",
    main_cap="Prompt tokens fill the context budget during prefill while KV cache grows per layer; decode appends one token at a time reusing cached keys and values.",
    nav_items=_nav(
        ("01", "whatwhy", "What & Why"), ("01a", "concepts", "Core Concepts"), ("01b", "api", "API Surface"),
        ("02", "whento", "When to Use"), ("03", "architecture", "Architecture"), ("04", "window", "Context Window"),
        ("05", "kvcache", "KV Cache"), ("06", "prefill", "Prefill vs Decode"), ("07", "paged", "PagedAttention"),
        ("08", "gqa", "GQA / MQA"), ("09", "production", "Production & Ops"), ("10", "shows-up", "Where It Shows Up"),
        ("11", "pitfalls", "Pitfalls"), ("12", "interview", "Interview Q&A"),
    ),
    sections=[
        ("whatwhy", "01", "What & Why", card("<p><strong>Context window</strong> caps prompt+completion tokens. <strong>KV cache</strong> stores per-layer key/value tensors for prior tokens so decode doesn't recompute full attention. Dominates GPU memory at long context and high concurrency.</p>" + f"<blockquote>Token counting: {LINKS['token']}. Serving: {LINKS['vllm']}.</blockquote>")),
        ("concepts", "01a", "Core Concepts", card(tbl([(("th","Term"),("th","Definition"),("th","Gotcha")),(("td","Context window"),("td","Max total tokens in/out"),("td","Shared budget")),(("td","KV cache"),("td","Stored K,V per layer per token"),("td","Grows linearly with seq")),(("td","Prefill"),("td","Process prompt in parallel"),("td","Sets TTFT")),(("td","Decode"),("td","One token per step"),("td","Memory bandwidth bound")),(("td","PagedAttention"),("td","Paged KV blocks in vLLM"),("td","Reduces fragmentation")),(("td","GQA"),("td","Grouped-query attention"),("td","Fewer KV heads"))]))),
        ("api", "01b", "API Surface", card('<pre># HuggingFace generate with cache\noutputs = model.generate(\n    input_ids,\n    max_new_tokens=256,\n    use_cache=True,  # KV cache enabled\n)\n# past_key_values returned for incremental decode</pre>')),
        ("whento", "02", "When to Use / When NOT", card(tbl([(("th","Tactic"),("th","Use"),("th","Skip")),(("td","Long doc Q&A"),("td","200K context model OR RAG"),("td","Stuff 500 pages raw")),(("td","KV cache"),("td","Always at decode"),("td","Training (recompute activations")),(("td","PagedAttention"),("td","Multi-tenant serving"),("td","Single-request local")),(("td","Prompt caching API"),("td","Repeated system prefix"),("td","Unique prompts"))]))),
        ("architecture", "03", "Architecture", card('<pre>Prefill: all prompt tokens -> fill KV[layer, 0:prompt_len]\nDecode step t: compute Q_t; attend K,V[0:t]; append KV_t; sample token</pre>', hl=True)),
        ("window", "04", "Deep Dive: Context Window", card("<p>Models advertise 128K, 200K, 1M — check effective quality at extreme lengths (needle tests). Long context costs linear $ and super-linear prefill compute. RAG often cheaper than 1M stuffing.</p>")),
        ("kvcache", "05", "Deep Dive: KV Cache Mechanics", diag("context-window-kv-cache-kv-zoom.png", "Per layer: cache K and V for all prior tokens; new token only computes Q and attends to cached K/V.") + card("<p>Without cache, each decode step recomputes attention over full history — O(n²) per step catastrophe.</p>")),
        ("prefill", "06", "Deep Dive: Prefill vs Decode", card("<p><strong>Prefill:</strong> compute-bound matmuls over prompt length → TTFT.<br><strong>Decode:</strong> memory-bound KV reads → tokens/sec. Long prompts hurt TTFT; long answers hurt total time and KV size.</p>")),
        ("paged", "07", "Deep Dive: PagedAttention", diag("context-window-kv-cache-paged-zoom.png", "vLLM allocates KV cache in non-contiguous pages like OS virtual memory; enables continuous batching.") + card(f"<p>See {LINKS['vllm']}. 2-4× throughput vs naive static batching.</p>")),
        ("gqa", "08", "Deep Dive: GQA / MQA", card("<p>Share K/V heads across query head groups. Cuts KV memory 4-8× with minimal quality loss. Llama 3, Mistral use GQA for long-context serving economics.</p>")),
        ("production", "09", "Production & Ops", card("<ul><li>Cap max context per tier</li><li>Monitor KV memory utilization on GPU</li><li>Continuous batching for throughput</li><li>Truncate with " + LINKS['token'] + " before API</li></ul>")),
        ("shows-up", "10", "Where It Shows Up", card("<ul>" + f"<li>{LINKS['llm']}</li><li>{LINKS['transformers']}</li><li>{LINKS['token']}</li><li>{LINKS['cost']}</li><li>{LINKS['vllm']}</li><li>{LINKS['rag']}</li></ul>")),
        ("pitfalls", "11", "Common Pitfalls", card("<ul><li>Assuming 128K means fast 128K prefill</li><li>Ignoring KV memory at high concurrency</li><li>Disabling cache in custom inference</li><li>Stuffing context instead of RAG</li><li>Not reserving completion token headroom</li></ul>")),
    ],
    qa=_qa(
        ("What is KV cache?", "Per transformer layer, store Key and Value tensors for each prior token. Decode step only computes new token Q and attends to cached K/V."),
        ("KV cache memory formula?", "Roughly 2 × num_layers × seq_len × num_kv_heads × head_dim × bytes_per_param. GQA reduces num_kv_heads."),
        ("Prefill vs decode latency?", "Prefill parallel over prompt → dominates TTFT. Decode serial one token/step → dominates total generation time and tokens/sec."),
        ("Why long context is expensive?", "Input tokens billed linearly; prefill compute ~O(n²) naive; KV memory grows O(n) blocking concurrent requests on same GPU."),
        ("PagedAttention benefit?", "Non-contiguous KV storage reduces fragmentation; continuous batching packs many sequences; higher GPU utilization."),
        ("GQA vs MHA for serving?", "GQA shares KV heads → smaller cache → more concurrent users / faster decode. Standard in modern open models."),
        ("Context window vs usable context?", "Model may accept 128K but quality degrades; needle-in-haystack tests show drop-off. RAG retrieves relevant subset."),
        ("OpenAI prompt caching?", "Automatic discount on repeated long input prefixes (system prompt). Reduces $ not KV on your side for API users."),
        ("When disable KV cache?", "Almost never at inference. Training recomputes activations for memory during backprop."),
        ("128K prompt on 80GB GPU?", "KV cache may exceed memory at batch>1; need tensor parallel, shorter batch, or quantization."),
        ("Relate to RAG?", "RAG keeps prompt shorter with relevant chunks only — saves $, TTFT, and KV memory vs full doc in context."),
        ("SDE3: serve 500 concurrent chat users?", "vLLM continuous batching + PagedAttention; GQA model; cap history tokens; summarize old turns; tensor parallel if 70B; monitor KV utilization; route long docs to RAG not raw context."),
    ),
)
