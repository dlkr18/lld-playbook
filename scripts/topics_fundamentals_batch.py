# Topic configs for gen_ai_fundamentals_batch — body HTML per sheet

TOPICS = [
{
  "slug": "transformers-attention",
  "title": "Transformers &amp; Attention",
  "nav_short": "Attention",
  "hero": "The mechanism inside every GPT-style LLM: causal self-attention lets each token attend to prior positions; multi-head attention learns parallel relational features; RoPE encodes position. Master this before RAG, agents, or serving.",
  "tags": [("Self-Attention","orange"),("Multi-Head",""),("RoPE","green"),("Causal Mask","pink")],
  "main_cap": "Decoder-only stack: embeddings + positional encoding, repeated transformer blocks (attention + FFN), LM head outputs logits per position.",
  "nav": [("whatwhy","01","What &amp; Why"),("concepts","01a","Core Concepts"),("api","01b","API Surface"),("whento","02","When to Use"),("architecture","03","Architecture"),("scaled","04","Scaled Dot-Product"),("multihead","05","Multi-Head"),("rope","06","RoPE &amp; Positions"),("complexity","07","Complexity"),("flash","08","Flash Attention"),("production","09","Production"),("shows-up","10","Where It Shows Up"),("pitfalls","11","Pitfalls"),("interview","12","Interview Q&amp;A")],
  "zooms": [("transformers-attention-scaled-zoom.png","Scaled dot-product attention","QK^T / sqrt(d_k), causal mask, softmax, multiply V."),("transformers-attention-multihead-zoom.png","Multi-head attention","h parallel heads, concat, output projection W_O.")],
  "body": """
<section id="whatwhy"><h2>01 &mdash; What &amp; Why</h2>
<div class="card"><p><strong>Transformers</strong> (Vaswani et al., 2017) replaced RNNs for sequence modeling with <strong>attention</strong>: each position builds a representation from a weighted mix of all other positions. Chat LLMs use <strong>decoder-only</strong> stacks with <strong>causal masking</strong> so generation never peeks at future tokens.</p>
<h3>Functional requirements</h3><ul><li>Map token sequence to contextual representations</li><li>Support variable-length sequences up to context limit</li><li>Enable parallel training across sequence positions</li></ul>
<h3>Non-functional</h3><ul><li>Memory O(n&sup2;) naive attention per layer</li><li>Compute dominated by attention + FFN matmuls at scale</li></ul>
<blockquote><strong>Interview anchor:</strong> Attention is <em>where</em> the model decides what prior context matters for the current token.</blockquote></div></section>
<section id="concepts"><h2>01a &mdash; Core Concepts</h2>
<div class="card"><table>
<tr><th>Term</th><th>Definition</th><th>Gotcha</th></tr>
<tr><td><strong>Query / Key / Value</strong></td><td>Linear projections of hidden state; attention weights = softmax(QK^T/&radic;d)</td><td>Same X, different W_Q, W_K, W_V per head</td></tr>
<tr><td><strong>Causal mask</strong></td><td>Set attention to &minus;&infin; for j &gt; i</td><td>Required for autoregressive generation</td></tr>
<tr><td><strong>Multi-head</strong></td><td>h independent attention subspaces</td><td>Head count trades expressivity vs memory</td></tr>
<tr><td><strong>RoPE</strong></td><td>Rotary position embedding on Q,K</td><td>Better length extrapolation than absolute sinusoidal</td></tr>
<tr><td><strong>FFN</strong></td><td>Two linear layers with activation (SwiGLU)</td><td>~2/3 of transformer parameters</td></tr>
<tr><td><strong>LayerNorm</strong></td><td>Stabilize activations pre-subblock</td><td>Pre-LN vs Post-LN affects training stability</td></tr>
<tr><td><strong>Residual</strong></td><td>x + sublayer(x) enables deep stacks</td><td>96+ layers in frontier models</td></tr>
<tr><td><strong>Flash Attention</strong></td><td>IO-aware tiled attention</td><td>Same math, less HBM traffic</td></tr>
</table></div></section>
<section id="api"><h2>01b &mdash; API Surface</h2>
<div class="card"><p>Frameworks hide attention; inspect shapes with PyTorch + Hugging Face.</p>
<pre>from transformers import AutoModelForCausalLM
import torch

model = AutoModelForCausalLM.from_pretrained("meta-llama/Llama-3.2-1B")
inputs = model.tokenizer("Attention maps context.", return_tensors="pt")
with torch.no_grad():
    out = model(**inputs, output_attentions=True)
# out.attentions: tuple of (batch, heads, seq, seq) per layer</pre>
<p>Use <code>output_attentions=True</code> for interpretability demos; disable in production (memory heavy).</p></div></section>
<section id="whento"><h2>02 &mdash; When to Use / When NOT</h2>
<div class="card"><table>
<tr><th>Architecture</th><th>Use when</th><th>Alternative</th></tr>
<tr><td>Decoder-only (GPT, Llama)</td><td>General LM, chat, code</td><td>Encoder-only for embeddings only</td></tr>
<tr><td>Encoder-decoder (T5)</td><td>Fixed source&rarr;target (translation)</td><td>Decoder-only + prompt formatting</td></tr>
<tr><td>Encoder-only (BERT)</td><td>Classification, embeddings</td><td>Not for open-ended generation</td></tr>
<tr><td>Sparse / linear attention</td><td>Very long context, memory bound</td><td>Standard attention + KV cache + chunking</td></tr>
</table></div></section>
<section id="architecture"><h2>03 &mdash; Architecture</h2>
<div class="card highlight"><pre>tokens ──► Embed + RoPE ──► [Block]×L ──► LM head ──► logits
Block: x → LN → MHA(causal) → +x → LN → FFN → +x</pre>
<div class="flow">
<div class="step" data-num="1"><span class="label">Embed</span><div class="detail">Token IDs → d_model vectors</div></div>
<div class="step" data-num="2"><span class="label">Attention</span><div class="detail">Mix prior context per position</div></div>
<div class="step" data-num="3"><span class="label">FFN</span><div class="detail">Per-token nonlinearity, widen then project</div></div>
<div class="step" data-num="4"><span class="label">Repeat L layers</span><div class="detail">Depth = compositional reasoning capacity</div></div>
</div></div></section>
<section id="scaled"><h2>04 &mdash; Deep Dive: Scaled Dot-Product Attention</h2>
<div class="card"><pre>Attention(Q,K,V) = softmax(QK^T / sqrt(d_k) + mask) V</pre>
<ul><li>Scaling prevents softmax saturation when d_k is large</li><li>Causal mask: upper triangle &minus;&infin; before softmax</li><li>Output at position i is weighted sum of V_j for j &le; i</li></ul></div></section>
<section id="multihead"><h2>05 &mdash; Deep Dive: Multi-Head Attention</h2>
<div class="card"><p>Split d_model into h heads of dimension d_k = d_model/h. Each head learns different relation types (syntax, coreference, long-range).</p>
<pre># Conceptual: concat(head_1,...,head_h) @ W_O</pre></div></section>
<section id="rope"><h2>06 &mdash; Deep Dive: RoPE</h2>
<div class="card"><p>Rotary embeddings multiply Q and K by position-dependent rotations in 2D subspaces. Relative position bias emerges in QK^T. Used in Llama, Mistral, Qwen.</p></div></section>
<section id="complexity"><h2>07 &mdash; Deep Dive: Complexity</h2>
<div class="card"><table>
<tr><th>Component</th><th>Time</th><th>Memory</th></tr>
<tr><td>Attention (naive)</td><td>O(n&sup2; &middot; d)</td><td>O(n&sup2;) attention matrix if materialized</td></tr>
<tr><td>FFN</td><td>O(n &middot; d&sup2;)</td><td>O(n &middot; d)</td></tr>
<tr><td>KV cache (inference)</td><td>O(n) per step</td><td>O(L &middot; n &middot; d) per sequence</td></tr>
</table></div></section>
<section id="flash"><h2>08 &mdash; Deep Dive: Flash Attention</h2>
<div class="card"><p>Tiles Q,K,V blocks in SRAM to avoid writing full n&times;n attention matrix to HBM. Critical for training long sequences and inference prefill at scale.</p></div></section>
""",
  "prod": '<div class="card"><ul><li>Disable <code>output_attentions</code> in prod</li><li>Monitor GPU memory vs context length</li><li>Use FlashAttention-2 kernels in vLLM/TGI</li><li>Quantization (AWQ) reduces weight memory, not KV growth</li></ul></div>',
  "pit": '<li><strong>O(n&sup2;) surprise</strong> &mdash; 200K context needs sparse methods or sliding window</li><li><strong>Confusing encoder vs decoder</strong> &mdash; BERT cannot generate</li><li><strong>Attention maps &ne; explanation</strong> &mdash; heads are not reliably interpretable</li><li><strong>Ignoring KV cache</strong> &mdash; inference cost explodes without it</li>',
  "qa": [
    ("Explain self-attention in one sentence.", "Each token computes compatibility scores with all prior tokens (Q&middot;K), normalizes to weights, and takes a weighted sum of their value vectors V to produce a context-aware representation."),
    ("Why divide by sqrt(d_k)?", "Dot products grow with dimension; unscaled softmax becomes peaked (near one-hot), hurting gradient flow. Dividing by sqrt(d_k) keeps variance stable."),
    ("What does the causal mask enforce?", "Position i cannot attend to positions j &gt; i, preserving autoregressive factorization P(x_t | x_{&lt;t}). Required for training and inference on the same objective."),
    ("Decoder-only vs encoder-decoder?", "Decoder-only: single stack, prompt as prefix, generate continuation. Encoder-decoder: bidirectional encoder over source, decoder cross-attends for seq2seq. Chat products standardized decoder-only."),
    ("What is multi-head attention for?", "Parallel subspaces capture different relationship types; increasing heads increases capacity but also memory bandwidth per layer."),
    ("How does RoPE differ from absolute positional embeddings?", "RoPE encodes relative position in the rotation of Q/K pairs; often extrapolates to longer sequences better than learned absolute position tables."),
    ("Why is attention O(n&sup2;) and why does it matter?", "Each of n positions attends to up to n keys; for long context this dominates compute and memory. Mitigations: FlashAttention, sparse patterns, sliding window, linear attention approximations."),
    ("What is Flash Attention?", "An IO-efficient implementation that computes attention in tiles without materializing the full n&times;n matrix in GPU HBM&mdash;same result, faster and less memory."),
    ("How many parameters are in FFN vs attention?", "Typically ~2/3 in FFN (large up/down projections) and ~1/3 in attention projections across the model; exact split varies by architecture (e.g., SwiGLU)."),
    ("Can you visualize attention in production?", "Possible via output_attentions for debugging; too expensive at scale. Use offline notebooks on small inputs instead."),
    ("How does attention relate to KV cache?", "During decode, prior K and V tensors are cached per layer; only the new token's Q interacts with all cached K,V&mdash;avoids recomputing prior keys/values."),
    ("SDE2 vs SDE3: strong transformers answer?", "SDE2: defines Q,K,V and mentions GPT. SDE3: writes scaled dot-product equation, causal mask rationale, multi-head + RoPE, O(n&sup2;) implications, FlashAttention, ties to KV cache and inference economics."),
  ],
},
{
  "slug": "tokenization-context",
  "title": "Tokenization &amp; Context Window",
  "nav_short": "Tokens",
  "hero": "Text becomes subword token IDs before any transformer sees it. BPE merges drive vocabulary; context window caps prompt+completion; miscounting tokens is the #1 production billing and overflow bug.",
  "tags": [("BPE","orange"),("tiktoken",""),("Context Window","green"),("Truncation","pink")],
  "main_cap": "Raw text through tokenizer to ID sequence, budget check against model limit, then prefill into the LM.",
  "nav": [("whatwhy","01","What &amp; Why"),("concepts","01a","Core Concepts"),("api","01b","API Surface"),("whento","02","When to Use"),("architecture","03","Architecture"),("bpe","04","BPE Deep Dive"),("counting","05","Token Counting"),("truncation","06","Truncation Strategies"),("multilingual","07","Multilingual"),("special","08","Special Tokens"),("production","09","Production"),("shows-up","10","Where It Shows Up"),("pitfalls","11","Pitfalls"),("interview","12","Interview Q&amp;A")],
  "zooms": [("tokenization-context-bpe-zoom.png","BPE merges","Byte-pair merge table builds subword vocabulary."),("tokenization-context-budget-zoom.png","Context budget","prompt_tokens + completion_tokens must fit model max.")],
  "body": """<section id="whatwhy"><h2>01 &mdash; What &amp; Why</h2><div class="card"><p><strong>Tokenization</strong> maps Unicode text to integer IDs from a fixed vocabulary (32K&ndash;256K). The <strong>context window</strong> is the maximum tokens the model can attend to in one forward pass. Every API bill and overflow error starts here.</p></div></section>
<section id="concepts"><h2>01a &mdash; Core Concepts</h2><div class="card"><table>
<tr><th>Term</th><th>Definition</th><th>Gotcha</th></tr>
<tr><td><strong>BPE</strong></td><td>Iteratively merge frequent byte pairs</td><td>Different tokenizer = different token count for same string</td></tr>
<tr><td><strong>cl100k_base</strong></td><td>GPT-4 family BPE encoding</td><td>Use matching tiktoken encoding for counts</td></tr>
<tr><td><strong>Special tokens</strong></td><td>&lt;|endoftext|&gt;, tool markers, pad</td><td>Reserved IDs; don't appear in user text raw</td></tr>
<tr><td><strong>Context window</strong></td><td>Max input + output tokens</td><td>128K advertised &ne; cheap at full length</td></tr>
<tr><td><strong>Chars/token</strong></td><td>~4 English, ~2 CJK rough avg</td><td>Code and JSON are token-expensive</td></tr>
</table></div></section>
<section id="api"><h2>01b &mdash; API Surface</h2><div class="card"><pre>import tiktoken

enc = tiktoken.encoding_for_model("gpt-4o")
text = "How many tokens is this?"
ids = enc.encode(text)
print(len(ids), ids[:10])

# Anthropic: client.messages.count_tokens(...)
# HF: tokenizer.encode(text, add_special_tokens=True)</pre></div></section>
<section id="whento"><h2>02 &mdash; When to Use / When NOT</h2><div class="card"><table>
<tr><th>Approach</th><th>Use</th><th>Alternative</th></tr>
<tr><td>Pre-count tokens client-side</td><td>Always before large prompts</td><td>Hope API 400 error (bad UX)</td></tr>
<tr><td>Truncate middle of long chat</td><td>Keep system + recent turns</td><td>Summarize history instead</td></tr>
<tr><td>Character-based chunking for RAG</td><td>Quick prototype</td><td>Token-aware chunking for boundary quality</td></tr>
</table></div></section>
<section id="architecture"><h2>03 &mdash; Architecture</h2><div class="card highlight"><pre>text ──► Normalizer (NFC) ──► BPE encode ──► [id_1..id_n]
       ──► if n + max_completion &gt; limit: truncate / summarize / reject
       ──► prefill(ids) ──► decode loop</pre></div></section>
<section id="bpe"><h2>04 &mdash; Deep Dive: BPE</h2><div class="card"><p>Start with bytes; repeatedly merge most frequent adjacent pair until vocabulary size reached. "unhappiness" may become ["un","happiness"] depending on training corpus.</p></div></section>
<section id="counting"><h2>05 &mdash; Deep Dive: Token Counting</h2><div class="card"><pre>def estimate_cost(prompt: str, model: str, max_out: int) -> int:
    enc = tiktoken.encoding_for_model(model)
    p = len(enc.encode(prompt))
    return p + max_out  # check against model limit</pre></div></section>
<section id="truncation"><h2>06 &mdash; Deep Dive: Truncation</h2><div class="card"><ul><li><strong>Head+tail:</strong> keep system prompt + last K turns</li><li><strong>Summarize:</strong> compress middle history with cheap model</li><li><strong>Map-reduce:</strong> chunk docs, partial answers, merge</li></ul></div></section>
<section id="multilingual"><h2>07 &mdash; Multilingual</h2><div class="card"><p>CJK and emoji often consume more tokens per character than English. Always benchmark tokenizer on target locales.</p></div></section>
<section id="special"><h2>08 &mdash; Special Tokens</h2><div class="card"><p>Chat templates insert role tokens (&lt;|im_start|&gt;user). Tool calling adds schema tokens. Changing template between train and serve causes skew.</p></div></section>""",
  "prod": '<div class="card"><ul><li>Cache token counts per document hash</li><li>Alert when p95 prompt &gt; 80% of window</li><li>Log tokenizer version with each request</li></ul></div>',
  "pit": '<li><strong>Assuming chars &asymp; tokens</strong> for billing</li><li><strong>Wrong encoding</strong> for model family</li><li><strong>Silent truncation</strong> dropping system instructions</li><li><strong>Pasting huge PDFs</strong> without chunking</li>',
  "qa": [
    ("What is a token?", "A subword unit from the model vocabulary, produced by BPE or similar. Models operate on token IDs, not raw characters."),
    ("Why do token counts differ across models?", "Each model trains its own tokenizer/vocabulary on different corpora; identical English sentences can differ by 10&ndash;30% in length."),
    ("How do you count tokens for OpenAI?", "Use tiktoken with encoding_for_model() matching the deployment; include system prompt, tools JSON, and message overhead."),
    ("What happens when you exceed the context window?", "API returns 400 context_length_exceeded; fix by truncating, summarizing, smaller retrieval k, or larger-window model."),
    ("BPE vs WordPiece vs SentencePiece?", "All subword schemes; BPE common in GPT, SentencePiece in Llama (handles bytes, no UNK). Interview: pick one, explain merge training."),
    ("Why is code token-expensive?", "Rare symbols and indentation split into many tokens; 500 lines can be 8K+ tokens."),
    ("How to truncate chat history safely?", "Never drop system prompt; summarize or drop middle turns; keep last user message intact."),
    ("Token-aware chunking for RAG?", "Chunk by 256&ndash;512 tokens with overlap 32&ndash;64 tokens using same embedding tokenizer family."),
    ("What are special tokens?", "Reserved IDs for boundaries, roles, padding; injected by chat template, not user-typed text."),
    ("Context window vs max_tokens?", "Window = total budget; max_tokens caps only completion side. Need prompt_tokens + max_tokens &le; limit."),
    ("How does tokenizer affect multilingual apps?", "Measure tokens per locale; CJK may halve effective context; consider locale-specific models."),
    ("SDE3 tokenization answer?", "Explains BPE, shows tiktoken code, ties to billing and overflow mitigations, mentions train-serve template skew."),
  ],
},
{
  "slug": "pretraining-sft-rlhf",
  "title": "Pre-training, SFT &amp; RLHF",
  "nav_short": "Alignment",
  "hero": "Three-stage pipeline behind ChatGPT-class models: self-supervised pre-training learns language, SFT teaches instructions, RLHF/DPO aligns with human preferences. Know costs, data, and when product teams should NOT train.",
  "tags": [("Pre-training","orange"),("SFT","green"),("RLHF","pink"),("DPO","purple")],
  "main_cap": "Corpus &rarr; base LM &rarr; instruction tuning &rarr; preference optimization &rarr; deployed chat model.",
  "nav": [("whatwhy","01","What &amp; Why"),("concepts","01a","Core Concepts"),("api","01b","API Surface"),("whento","02","When to Use"),("architecture","03","Architecture"),("pretrain","04","Pre-training"),("sft","05","SFT"),("rlhf","06","RLHF / DPO"),("data","07","Data Quality"),("lora","08","LoRA at Scale"),("production","09","Production"),("shows-up","10","Where It Shows Up"),("pitfalls","11","Pitfalls"),("interview","12","Interview Q&amp;A")],
  "zooms": [("pretraining-sft-rlhf-sft-zoom.png","SFT stage","Supervised instruction-response pairs; loss on assistant tokens."),("pretraining-sft-rlhf-rlhf-zoom.png","RLHF / DPO","Preference pairs optimize policy toward human rankings.")],
  "body": """<section id="whatwhy"><h2>01 &mdash; What &amp; Why</h2><div class="card"><p>Consumers interact with <strong>aligned</strong> models, not raw pre-training checkpoints. Understanding the pipeline explains capabilities, refusals, and when <a href="../systems/fine-tuning-lora.html">LoRA fine-tune</a> is enough.</p></div></section>
<section id="concepts"><h2>01a &mdash; Core Concepts</h2><div class="card"><table>
<tr><th>Stage</th><th>Data</th><th>Outcome</th></tr>
<tr><td>Pre-training</td><td>Web-scale text</td><td>Base LM, next-token prediction</td></tr>
<tr><td>SFT</td><td>Instruction/response pairs</td><td>Chat format, helpfulness</td></tr>
<tr><td>RLHF</td><td>Human rankings A &gt; B</td><td>Policy aligned to preferences</td></tr>
<tr><td>DPO</td><td>Same preferences</td><td>Direct preference loss, no reward model</td></tr>
</table></div></section>
<section id="api"><h2>01b &mdash; API Surface</h2><div class="card"><pre># Hugging Face TRL — SFT example sketch
from trl import SFTTrainer
from transformers import TrainingArguments

trainer = SFTTrainer(
    model=model,
    train_dataset=dataset,  # {"messages": [...]}
    args=TrainingArguments(output_dir="./sft", num_train_epochs=1),
)
trainer.train()</pre></div></section>
<section id="whento"><h2>02 &mdash; When to Use / When NOT</h2><div class="card"><table>
<tr><th>Goal</th><th>Approach</th></tr>
<tr><td>Domain style/format</td><td>SFT or LoRA SFT</td></tr>
<tr><td>Fresh facts</td><td>RAG, not pre-training</td></tr>
<tr><td>Safety tone</td><td>RLHF/DPO or guardrails</td></tr>
<tr><td>Frontier general intelligence</td><td>Only hyperscalers pre-train</td></tr>
</table></div></section>
<section id="architecture"><h2>03 &mdash; Architecture</h2><div class="card highlight"><pre>Corpus ──► Pre-train (CE loss) ──► Base
Base + instructions ──► SFT ──► Chat model
Chat + preferences ──► RLHF/DPO ──► Aligned</pre></div></section>
<section id="pretrain"><h2>04 &mdash; Pre-training</h2><div class="card"><p>Predict next token on trillions of tokens; Chinchilla-optimal tradeoff between model size N and data D for compute C. See <a href="llm-fundamentals.html">LLM Fundamentals</a> scaling section.</p></div></section>
<section id="sft"><h2>05 &mdash; Deep Dive: SFT</h2><div class="card"><p>Supervised loss only on assistant tokens; mask user tokens. Quality &gt; quantity: 10K curated pairs can beat 1M noisy.</p></div></section>
<section id="rlhf"><h2>06 &mdash; Deep Dive: RLHF / DPO</h2><div class="card"><p><strong>RLHF:</strong> train reward model on comparisons, PPO fine-tunes policy. <strong>DPO:</strong> simpler offline loss from preferred/dispreferred pairs. Both reduce toxicity; may reduce some raw benchmarks.</p></div></section>
<section id="data"><h2>07 &mdash; Data Quality</h2><div class="card"><ul><li>Filter PII, toxic, duplicate</li><li>Eval leakage: never benchmark items in train</li><li>Version datasets with DVC/Hub</li></ul></div></section>
<section id="lora"><h2>08 &mdash; LoRA at Scale</h2><div class="card"><p>Product teams fine-tune adapters on open weights instead of full RLHF. See <a href="../systems/fine-tuning-lora.html">Fine-Tuning LoRA</a>.</p></div></section>""",
  "prod": '<div class="card"><ul><li>Track dataset version per deployment</li><li>Human eval before promoting fine-tune</li><li>GPU budget: full fine-tune vs LoRA decision matrix</li></ul></div>',
  "pit": '<li><strong>Training on benchmark tests</strong></li><li><strong>Expecting SFT to inject facts</strong></li><li><strong>RLHF overfitting narrow raters</strong></li><li><strong>Underestimating pre-train cost</strong></li>',
  "qa": [
    ("What does pre-training teach?", "Language modeling: grammar, reasoning patterns, broad world knowledge with cutoff; not your private docs or latest events."),
    ("What does SFT add?", "Instruction following, chat template, helpful tone; learns format more than new facts."),
    ("RLHF vs DPO?", "RLHF: reward model + PPO. DPO: direct preference optimization, simpler, no online RL loop. Both use ranked responses."),
    ("Why not pre-train your own 70B?", "Millions of GPU-hours and data ops; APIs + LoRA cover 99% of products."),
    ("When is LoRA enough?", "Style, classification format, tool-use patterns on open weights; not for teaching millions of new facts."),
    ("What is eval leakage?", "Benchmark examples in training data inflate scores; hold out golden sets strictly."),
    ("How does DPO loss work (intuition)?", "Increase likelihood of preferred completion vs dispreferred under reference model KL constraint."),
    ("What data for SFT?", "High-quality (instruction, ideal response) pairs; diverse tasks; human-reviewed for production."),
    ("Does RLHF improve math?", "Sometimes; can also make model more cautious. Tool use + verification often beats alignment alone."),
    ("Chinchilla in one line?", "For fixed compute, balance model size and training tokens; many models were under-trained on data."),
    ("How long to fine-tune 7B LoRA?", "Hours on 1&ndash;4 A100s for 10K&ndash;100K examples; depends on seq length and rank."),
    ("SDE3 alignment pipeline answer?", "Names three stages, data types, costs, when RAG beats fine-tune, mentions DPO as modern RLHF alternative."),
  ],
},
{
  "slug": "evaluation-metrics",
  "title": "Evaluation Metrics",
  "nav_short": "Eval",
  "hero": "Measure whether LLM outputs are good: automatic n-gram and embedding metrics for regression, LLM-as-judge for nuance, human golden sets for launch gates. Bad evals ship hallucinations to production.",
  "tags": [("BLEU","orange"),("LLM-as-Judge","green"),("Golden Set","pink"),("Faithfulness","")],
  "main_cap": "Model outputs flow through automatic metrics, judge models, and human review before release.",
  "nav": [("whatwhy","01","What &amp; Why"),("concepts","01a","Core Concepts"),("api","01b","API Surface"),("whento","02","When to Use"),("architecture","03","Architecture"),("auto","04","Automatic Metrics"),("judge","05","LLM-as-Judge"),("human","06","Human Eval"),("ragas","07","RAG Metrics"),("regression","08","Regression Suites"),("production","09","Production"),("shows-up","10","Where It Shows Up"),("pitfalls","11","Pitfalls"),("interview","12","Interview Q&amp;A")],
  "zooms": [("evaluation-metrics-auto-zoom.png","Automatic metrics","BLEU, ROUGE, BERTScore tradeoffs."),("evaluation-metrics-judge-zoom.png","LLM-as-judge","Rubric-based scoring with calibration.")],
  "body": """<section id="whatwhy"><h2>01 &mdash; What &amp; Why</h2><div class="card"><p>Generative outputs need <strong>task-specific evaluation</strong>. Perplexity measures modeling; chat quality needs correctness, faithfulness, helpfulness, and safety dimensions.</p></div></section>
<section id="concepts"><h2>01a &mdash; Core Concepts</h2><div class="card"><table>
<tr><th>Metric</th><th>Measures</th><th>Limitation</th></tr>
<tr><td>BLEU/ROUGE</td><td>n-gram overlap to reference</td><td>Penalizes valid paraphrases</td></tr>
<tr><td>BERTScore</td><td>Embedding similarity</td><td>Correlates better, still not faithfulness</td></tr>
<tr><td>Exact match / F1</td><td>QA span match</td><td>Needs gold answers</td></tr>
<tr><td>LLM-as-judge</td><td>Rubric score 1&ndash;5</td><td>Bias toward judge model vendor</td></tr>
<tr><td>Human eval</td><td>Gold standard</td><td>Slow, expensive</td></tr>
</table></div></section>
<section id="api"><h2>01b &mdash; API Surface</h2><div class="card"><pre>from ragas import evaluate
from ragas.metrics import faithfulness, answer_relevancy
from datasets import Dataset

ds = Dataset.from_dict({"question": [...], "answer": [...], "contexts": [...]})
result = evaluate(ds, metrics=[faithfulness, answer_relevancy])</pre></div></section>
<section id="whento"><h2>02 &mdash; When to Use</h2><div class="card"><table>
<tr><th>Need</th><th>Metric</th></tr>
<tr><td>CI regression on summarization</td><td>ROUGE-L + spot human</td></tr>
<tr><td>RAG faithfulness</td><td>RAGAS faithfulness, citation check</td></tr>
<tr><td>Open-ended quality</td><td>LLM judge + human sample</td></tr>
</table></div></section>
<section id="architecture"><h2>03 &mdash; Architecture</h2><div class="card highlight"><pre>Prompt set (golden) ──► Run candidate model ──► Outputs
    ├── Automatic metrics (batch)
    ├── LLM judge (rubric)
    └── Human review (sample) ──► Pass/fail gate</pre></div></section>
<section id="auto"><h2>04 &mdash; Automatic Metrics</h2><div class="card"><p>Use for <strong>regression detection</strong>, not absolute quality. Pair with delta thresholds vs baseline model.</p></div></section>
<section id="judge"><h2>05 &mdash; LLM-as-Judge</h2><div class="card"><pre>JUDGE_PROMPT = '''Score faithfulness 1-5.
Context: {context}
Answer: {answer}
Return JSON: {"score": int, "reason": str}'''</pre><p>Calibrate judge against 50&ndash;100 human-labeled examples before trusting scores.</p></div></section>
<section id="human"><h2>06 &mdash; Human Eval</h2><div class="card"><p>Inter-annotator agreement (Cohen's kappa); blind A/B between model versions; stratify by language and domain.</p></div></section>
<section id="ragas"><h2>07 &mdash; RAG Metrics</h2><div class="card"><p>Faithfulness: answer supported by context. Answer relevancy: addresses question. Context precision/recall for retrieval quality.</p></div></section>
<section id="regression"><h2>08 &mdash; Regression Suites</h2><div class="card"><p>Version prompts + model + retrieval together. Block deploy if faithfulness drops &gt;2% on golden set.</p></div></section>""",
  "prod": '<div class="card"><ul><li>Nightly eval job on staging model</li><li>Store traces with Langfuse for failure analysis</li><li>Track metric drift week over week</li></ul></div>',
  "pit": '<li><strong>Optimizing BLEU alone</strong></li><li><strong>Judge same model as candidate</strong></li><li><strong>Leaky golden set in training</strong></li><li><strong>No stratified slices</strong> (language, domain)</li>',
  "qa": [
    ("Why is perplexity insufficient for chat eval?", "Perplexity measures token prediction on corpus; aligned chat quality includes safety, instruction following, and factuality not captured."),
    ("When use BLEU vs BERTScore?", "BLEU for machine translation baselines; BERTScore when paraphrase is valid. Both weak for RAG faithfulness."),
    ("What is LLM-as-judge?", "A strong model scores outputs via rubric; cheap at scale; calibrate against humans."),
    ("RAGAS faithfulness?", "Checks if answer claims are entailed by retrieved context; core RAG metric."),
    ("How big should a golden set be?", "200&ndash;500 diverse prompts for CI; 50&ndash;100 human-labeled for judge calibration."),
    ("How to detect eval leakage?", "Hash benchmark items; forbid overlap in fine-tune corpora; hold out frozen test set."),
    ("A/B testing LLMs in prod?", "Shadow traffic, human review sample, automatic guardrails; metric: task success rate not just thumbs up."),
    ("Exact match for QA?", "Compare normalized answer string to gold; good for closed-domain FAQ bots."),
    ("What is inter-annotator agreement?", "Measure labeler consistency; low kappa means rubric is ambiguous."),
    ("Regression vs absolute eval?", "Regression: did we get worse vs last release? Absolute: is it good enough to ship?"),
    ("How to eval tool-using agents?", "Task success rate, steps to completion, tool call accuracy, cost per success."),
    ("SDE3 eval answer?", "Layers automatic + judge + human, names RAGAS faithfulness, golden set hygiene, production regression gates."),
  ],
},
{
  "slug": "hallucination-grounding",
  "title": "Hallucination &amp; Grounding",
  "nav_short": "Grounding",
  "hero": "LLMs generate fluent falsehoods by design. Ground answers in retrieved evidence, require citations, abstain when confidence is low, and verify with judges before user-facing release.",
  "tags": [("Hallucination","pink"),("RAG","green"),("Citations","orange"),("Abstention","")],
  "main_cap": "Query &rarr; retrieve evidence &rarr; constrained generation with citations &rarr; verification or abstain.",
  "nav": [("whatwhy","01","What &amp; Why"),("concepts","01a","Core Concepts"),("api","01b","API Surface"),("whento","02","When to Use"),("architecture","03","Architecture"),("types","04","Hallucination Types"),("rag","05","RAG Grounding"),("citations","06","Citations"),("abstain","07","Abstention"),("verify","08","Verification"),("production","09","Production"),("shows-up","10","Where It Shows Up"),("pitfalls","11","Pitfalls"),("interview","12","Interview Q&amp;A")],
  "zooms": [("hallucination-grounding-rag-zoom.png","RAG grounding","Chunks in prompt with IDs; answer must cite sources."),("hallucination-grounding-abstain-zoom.png","Abstention","Low retrieval score triggers I don't know path.")],
  "body": """<section id="whatwhy"><h2>01 &mdash; What &amp; Why</h2><div class="card"><p><strong>Hallucination</strong> is confident text not supported by facts or context. Mitigation is systems design: <a href="../systems/rag-end-to-end.html">RAG</a>, tools, abstention, and verification&mdash;not temperature alone.</p></div></section>
<section id="concepts"><h2>01a &mdash; Core Concepts</h2><div class="card"><table>
<tr><th>Type</th><th>Example</th><th>Mitigation</th></tr>
<tr><td>Intrinsic</td><td>Contradicts provided context</td><td>Faithfulness prompt, cite chunks</td></tr>
<tr><td>Extrinsic</td><td>Invents facts not in context</td><td>RAG + retrieval threshold</td></tr>
<tr><td>Reasoning</td><td>Wrong multi-step logic</td><td>CoT + tool verify</td></tr>
</table></div></section>
<section id="api"><h2>01b &mdash; API Surface</h2><div class="card"><pre>SYSTEM = '''Answer ONLY from provided context.
Cite as [1], [2]. If insufficient, say I do not know.
Context:
[1] {chunk_1}
[2] {chunk_2}'''</pre></div></section>
<section id="whento"><h2>02 &mdash; When to Use</h2><div class="card"><table>
<tr><th>Technique</th><th>When</th></tr>
<tr><td>RAG</td><td>Private or changing knowledge</td></tr>
<tr><td>Tool lookup (SQL, API)</td><td>Structured ground truth</td></tr>
<tr><td>Abstention</td><td>Support, legal, medical</td></tr>
</table></div></section>
<section id="architecture"><h2>03 &mdash; Architecture</h2><div class="card highlight"><pre>Query ──► Retriever ──► top-k chunks ──► Prompt + citations
              │                              │
              └── score &lt; τ ──► abstain      └──► LLM answer ──► faithfulness judge</pre></div></section>
<section id="types"><h2>04 &mdash; Hallucination Types</h2><div class="card"><p>Intrinsic vs extrinsic distinction drives which layer to fix (prompt vs retrieval vs model).</p></div></section>
<section id="rag"><h2>05 &mdash; RAG Grounding</h2><div class="card"><p>Hybrid search + rerank; inject only top passages; see <a href="embeddings-semantic-search.html">Embeddings</a>.</p></div></section>
<section id="citations"><h2>06 &mdash; Citations</h2><div class="card"><p>Force inline [n] references; post-check that cited chunk entails each claim (NLI model or judge).</p></div></section>
<section id="abstain"><h2>07 &mdash; Abstention</h2><div class="card"><p>If max retrieval score &lt; threshold or judge faithfulness &lt; 3/5, return safe fallback and escalate to human.</p></div></section>
<section id="verify"><h2>08 &mdash; Verification</h2><div class="card"><pre># Self-check pass
verify = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[{"role":"user","content": f"List unsupported claims in: {answer}"}],
)</pre></div></section>""",
  "prod": '<div class="card"><ul><li>Log retrieval scores with each answer</li><li>Human review low-confidence queue</li><li>Track hallucination rate on golden adversarial set</li></ul></div>',
  "pit": '<li><strong>Long context without retrieval</strong></li><li><strong>No citation enforcement</strong></li><li><strong>Trusting model confidence</strong></li><li><strong>Poisoned RAG documents</strong> (indirect injection)</li>',
  "qa": [
    ("Why do LLMs hallucinate?", "Training optimizes plausible continuation, not truth; no built-in fact checker unless grounded externally."),
    ("RAG vs fine-tune for facts?", "RAG for changing/private facts with citations; fine-tune for style and format, not primary knowledge injection."),
    ("Intrinsic vs extrinsic hallucination?", "Intrinsic contradicts given context; extrinsic invents beyond context. Different fixes: prompt vs retrieval."),
    ("How do citations help?", "Force model to anchor claims to chunk IDs; enables automated entailment checks and user verification."),
    ("When should a bot abstain?", "Low retrieval score, policy-sensitive domain, or failed verification pass."),
    ("What is faithfulness?", "Answer supported by provided evidence; measured by RAGAS or NLI models."),
    ("Does temperature 0 eliminate hallucinations?", "No; reduces randomness but model can still state false facts deterministically."),
    ("Tool use for grounding?", "SQL/API returns ground truth; model narrates results—excellent for numeric/tabular facts."),
    ("How to eval hallucination rate?", "Golden adversarial questions with known answers; human or judge labels unsupported claims."),
    ("Indirect injection in RAG?", "Malicious doc says ignore instructions; mitigate with doc auth, sanitization, separate system channel."),
    ("Map-reduce hallucination risk?", "Partial summaries can drift; verify final merge against sources."),
    ("SDE3 grounding answer?", "System diagram with RAG+abstain+verify, cites faithfulness metrics, knows temperature alone fails."),
  ],
},
{
  "slug": "ai-safety-guardrails",
  "title": "AI Safety &amp; Guardrails",
  "nav_short": "Safety",
  "hero": "Layered defenses around LLMs: input classification, policy prompts, output moderation, PII handling, and human-in-the-loop for high-risk flows. Alignment reduces harm; guardrails enforce product policy.",
  "tags": [("Moderation","orange"),("PII","pink"),("Injection","green"),("HITL","purple")],
  "main_cap": "Defense in depth from user input through model to validated output and optional human review.",
  "nav": [("whatwhy","01","What &amp; Why"),("concepts","01a","Core Concepts"),("api","01b","API Surface"),("whento","02","When to Use"),("architecture","03","Architecture"),("input","04","Input Guards"),("output","05","Output Guards"),("pii","06","PII &amp; Privacy"),("injection","07","Prompt Injection"),("hitl","08","HITL"),("production","09","Production"),("shows-up","10","Where It Shows Up"),("pitfalls","11","Pitfalls"),("interview","12","Interview Q&amp;A")],
  "zooms": [("ai-safety-guardrails-input-zoom.png","Input guardrails","Classifiers, PII scan, policy filters before LLM."),("ai-safety-guardrails-output-zoom.png","Output guardrails","Moderation API, schema validation, refusal templates.")],
  "body": """<section id="whatwhy"><h2>01 &mdash; What &amp; Why</h2><div class="card"><p><strong>AI safety</strong> spans model alignment (training) and <strong>guardrails</strong> (application). Products need both: aligned models still leak PII, follow injected instructions, or violate brand policy without runtime controls.</p></div></section>
<section id="concepts"><h2>01a &mdash; Core Concepts</h2><div class="card"><table>
<tr><th>Layer</th><th>Tool examples</th><th>Purpose</th></tr>
<tr><td>Input moderation</td><td>OpenAI Moderation, Llama Guard</td><td>Block policy violations pre-LLM</td></tr>
<tr><td>Output moderation</td><td>Same + custom classifiers</td><td>Filter toxic or off-brand text</td></tr>
<tr><td>PII redaction</td><td>Presidio, cloud DLP</td><td>Prevent leaking secrets</td></tr>
<tr><td>Prompt injection defense</td><td>Delimiters, instruction hierarchy</td><td>Reduce override attacks</td></tr>
<tr><td>HITL</td><td>Review queue</td><td>High-stakes approvals</td></tr>
</table></div></section>
<section id="api"><h2>01b &mdash; API Surface</h2><div class="card"><pre>from openai import OpenAI
client = OpenAI()
mod = client.moderations.create(input=user_text)
if mod.results[0].flagged:
    raise PolicyViolation("blocked")</pre></div></section>
<section id="whento"><h2>02 &mdash; When to Use</h2><div class="card"><table>
<tr><th>Risk</th><th>Control</th></tr>
<tr><td>User-generated prompts to agent</td><td>Input + tool sandbox</td></tr>
<tr><td>Medical/legal advice</td><td>Disclaimers + HITL + abstain</td></tr>
<tr><td>Enterprise data</td><td>PII scan + VPC + audit logs</td></tr>
</table></div></section>
<section id="architecture"><h2>03 &mdash; Architecture</h2><div class="card highlight"><pre>User ──► Input filter ──► LLM (+ tools in sandbox) ──► Output filter ──► User
            │                      │                         │
            └── block              └── allowlist tools       └── HITL queue</pre></div></section>
<section id="input"><h2>04 &mdash; Input Guardrails</h2><div class="card"><p>Classify jailbreak attempts; rate-limit; block known attack patterns. See <a href="prompt-engineering.html">Prompt Engineering</a> injection section.</p></div></section>
<section id="output"><h2>05 &mdash; Output Guardrails</h2><div class="card"><p>Schema validation for JSON; regex for banned phrases; second-pass moderation model.</p></div></section>
<section id="pii"><h2>06 &mdash; PII</h2><div class="card"><p>Redact before sending to third-party API; log retention policies; regional data residency.</p></div></section>
<section id="injection"><h2>07 &mdash; Prompt Injection</h2><div class="card"><p>Separate system from user with delimiters; never execute instructions from RAG body; tool permissions least privilege.</p></div></section>
<section id="hitl"><h2>08 &mdash; HITL</h2><div class="card"><p>Route low-confidence or high-impact actions to human reviewers; <a href="../tech/langgraph.html">LangGraph</a> interrupt patterns.</p></div></section>""",
  "prod": '<div class="card"><ul><li>Audit log all blocked/flagged events</li><li>Red team quarterly on injection</li><li>Version guardrail policies like code</li></ul></div>',
  "pit": '<li><strong>System prompt as only defense</strong></li><li><strong>No tool sandbox</strong></li><li><strong>Logging raw PII</strong></li><li><strong>Ignoring indirect injection via RAG</strong></li>',
  "qa": [
    ("Alignment vs guardrails?", "Alignment is training-time preference; guardrails are runtime filters and policy enforcement. Both needed."),
    ("What does OpenAI Moderation API do?", "Classifies hate, harassment, self-harm, etc.; use on input and/or output before display."),
    ("How to defend prompt injection?", "Instruction hierarchy, delimiter fencing, sanitize RAG, least-privilege tools, output validation—not one silver bullet."),
    ("What is indirect injection?", "Malicious content in retrieved docs or emails instructs model to exfiltrate data; treat untrusted text as data not instructions."),
    ("When is HITL required?", "Financial transactions, medical diagnoses, legal commitments, irreversible agent actions."),
    ("PII before LLM API?", "Scan/redact; use enterprise agreements; consider self-host for residency."),
    ("Llama Guard vs Moderation API?", "Open-source classifier you host vs managed API; trade ops burden vs velocity."),
    ("Can guardrails block legitimate use?", "Yes—tune thresholds, allow appeals, monitor false positive rate by locale."),
    ("Tool sandbox for agents?", "Read-only FS, network allowlist, timeout, no secrets in env visible to model."),
    ("Constitutional AI (brief)?", "Anthropic training approach: model critiques/revises against principles; related to alignment not runtime guards."),
    ("Red teaming LLM apps?", "Automated attack suites + manual jailbreak attempts on staging before launch."),
    ("SDE3 safety answer?", "Draws layered diagram, names injection types, PII, HITL, ties to LangGraph interrupts, doesn't claim system prompt is enough."),
  ],
},
{
  "slug": "cost-latency-tradeoffs",
  "title": "Cost &amp; Latency Tradeoffs",
  "nav_short": "Cost/Latency",
  "hero": "Every LLM feature is a three-way tradeoff: quality, latency (TTFT + tokens/sec), and cost ($/1M tokens + GPU). Model routing, caching, batching, and quantization are how production teams ship profitably.",
  "tags": [("TTFT","orange"),("Token Pricing","green"),("Routing","pink"),("Batch API","purple")],
  "main_cap": "Prefill sets time-to-first-token; decode sets throughput; pricing multiplies by token counts and model tier.",
  "nav": [("whatwhy","01","What &amp; Why"),("concepts","01a","Core Concepts"),("api","01b","API Surface"),("whento","02","When to Use"),("architecture","03","Architecture"),("prefill","04","Prefill vs Decode"),("pricing","05","Token Pricing"),("routing","06","Model Routing"),("cache","07","Caching"),("quantize","08","Quantization"),("production","09","Production"),("shows-up","10","Where It Shows Up"),("pitfalls","11","Pitfalls"),("interview","12","Interview Q&amp;A")],
  "zooms": [("cost-latency-tradeoffs-prefill-zoom.png","Prefill vs decode","Parallel prompt processing vs serial token generation."),("cost-latency-tradeoffs-pricing-zoom.png","Pricing formula","Requests times input/output token rates.")],
  "body": """<section id="whatwhy"><h2>01 &mdash; What &amp; Why</h2><div class="card"><p>LLM products fail commercially when <strong>p95 latency</strong> or <strong>unit economics</strong> are ignored. Engineers must estimate $/request and size GPU pools before launch.</p></div></section>
<section id="concepts"><h2>01a &mdash; Core Concepts</h2><div class="card"><table>
<tr><th>Term</th><th>Definition</th><th>Gotcha</th></tr>
<tr><td><strong>TTFT</strong></td><td>Time to first token after request</td><td>Dominated by prefill length</td></tr>
<tr><td><strong>TPS</strong></td><td>Output tokens per second</td><td>Decode-bound; batching helps</td></tr>
<tr><td><strong>Price in/out</strong></td><td>$/1M input vs output tokens</td><td>Output often 2&ndash;4&times; input price</td></tr>
<tr><td><strong>Continuous batching</strong></td><td>Mix prefill/decode in GPU queue</td><td>vLLM core feature</td></tr>
</table></div></section>
<section id="api"><h2>01b &mdash; API Surface</h2><div class="card"><pre>import tiktoken

def estimate_usd(prompt: str, completion_tokens: int,
                 price_in: float = 0.15, price_out: float = 0.60) -> float:
    enc = tiktoken.encoding_for_model("gpt-4o-mini")
    p = len(enc.encode(prompt))
    return (p * price_in + completion_tokens * price_out) / 1_000_000</pre></div></section>
<section id="whento"><h2>02 &mdash; When to Use</h2><div class="card"><table>
<tr><th>Technique</th><th>When</th></tr>
<tr><td>gpt-4o-mini router</td><td>Easy queries, classification</td></tr>
<tr><td>Batch API</td><td>Offline eval, enrichment (24h SLA)</td></tr>
<tr><td>Self-host Llama</td><td>High volume, data residency</td></tr>
<tr><td>Semantic cache</td><td>Repeated similar questions</td></tr>
</table></div></section>
<section id="architecture"><h2>03 &mdash; Architecture</h2><div class="card highlight"><pre>Request ──► Router (mini vs frontier) ──► GPU pool
                │                              ├── prefill (prompt len)
                │                              └── decode (output len)
                └── cache hit ──► skip LLM ($0)</pre></div></section>
<section id="prefill"><h2>04 &mdash; Prefill vs Decode</h2><div class="card"><p>Long RAG contexts hurt TTFT; long answers hurt total latency and bill. See <a href="context-window-kv-cache.html">KV Cache</a>.</p></div></section>
<section id="pricing"><h2>05 &mdash; Token Pricing</h2><div class="card"><p>Example: 1M req/day, P=2000, C=500, gpt-4o-mini &asymp; $300 in + $300 out / day order-of-magnitude. Add 30% buffer for retries and tools.</p></div></section>
<section id="routing"><h2>06 &mdash; Model Routing</h2><div class="card"><pre>def pick_model(msg: str) -> str:
    if len(msg) &lt; 200 and not needs_tools(msg):
        return "gpt-4o-mini"
    return "gpt-4o"</pre></div></section>
<section id="cache"><h2>07 &mdash; Caching</h2><div class="card"><p>OpenAI prompt caching for repeated prefixes; semantic cache for near-duplicate queries in support bots.</p></div></section>
<section id="quantize"><h2>08 &mdash; Quantization</h2><div class="card"><p>AWQ/GPTQ INT4 cuts memory 4&times;; small quality drop; improves $/token self-hosted.</p></div></section>""",
  "prod": '<div class="card"><ul><li>Dashboard: p50/p95 TTFT, TPS, $/successful task</li><li>Budget alerts per feature flag</li><li>Load test with production prompt distribution</li></ul></div>',
  "pit": '<li><strong>Using frontier model for all traffic</strong></li><li><strong>Ignoring output token price</strong></li><li><strong>No max_tokens cap</strong></li><li><strong>Skipping load test at full context</strong></li>',
  "qa": [
    ("What dominates TTFT?", "Prefill processing all prompt tokens in parallel; grows with context length and model size."),
    ("What dominates total latency for long answers?", "Decode: serial token generation; tokens/sec limited by memory bandwidth and batch size."),
    ("How to estimate monthly LLM cost?", "R requests * (P * price_in + C * price_out) / 1e6; measure P,C from logs; add retries/tools buffer."),
    ("When self-host vs API?", "When volume makes GPU OpEx cheaper than API and quantized quality suffices; else API wins early."),
    ("What is continuous batching?", "Scheduler mixes sequences at different decode stages on same GPU to raise utilization."),
    ("Batch API tradeoff?", "~50% cheaper, 24h turnaround—good for offline jobs not interactive chat."),
    ("Model routing example?", "Mini classifies intent; frontier only for complex reasoning or tool-heavy plans."),
    ("Does long context always cost linearly?", "Input tokens billed linearly; compute can be superlinear without sparse attention / efficient kernels."),
    ("Quantization cost impact?", "Fewer GPUs serve same QPS; may need quality eval before swap."),
    ("Prompt caching savings?", "Repeated system+RAG prefix hits cache—pay reduced rate on cached input tokens (provider-specific)."),
    ("p95 vs p50 latency?", "Product SLAs use p95; optimize tail with smaller models, shorter prompts, regional edge."),
    ("SDE3 cost/latency answer?", "Splits prefill/decode, gives $ formula with numbers, routing+caching+quantization levers, ties to KV memory."),
  ],
},
{
  "slug": "ai-system-design-patterns",
  "title": "AI System Design Patterns",
  "nav_short": "Patterns",
  "hero": "Reusable architectures for production AI: RAG Q&amp;A, ReAct agents, model routers, semantic cache, map-reduce over docs, and eval-gated deploy pipelines—the SDE3 system design vocabulary.",
  "tags": [("RAG","green"),("Agent","orange"),("Router","pink"),("Map-Reduce","purple")],
  "main_cap": "Pattern catalog connecting fundamentals to tech (LangGraph, vector DB) and systems (RAG, agents).",
  "nav": [("whatwhy","01","What &amp; Why"),("concepts","01a","Core Concepts"),("api","01b","API Surface"),("whento","02","When to Use"),("architecture","03","Architecture"),("rag","04","RAG Pattern"),("agent","05","Agent Pattern"),("router","06","Router Pattern"),("cache","07","Semantic Cache"),("mapreduce","08","Map-Reduce"),("production","09","Production"),("shows-up","10","Where It Shows Up"),("pitfalls","11","Pitfalls"),("interview","12","Interview Q&amp;A")],
  "zooms": [("ai-system-design-patterns-rag-zoom.png","RAG pattern","Ingest, index, retrieve, rerank, generate."),("ai-system-design-patterns-agent-zoom.png","Agent pattern","Plan, tool call, observe loop.")],
  "body": """<section id="whatwhy"><h2>01 &mdash; What &amp; Why</h2><div class="card"><p>Interview system design for AI products expects named <strong>patterns</strong> with tradeoffs, not a single LLM box. This sheet maps patterns to when they apply and what to draw on the whiteboard.</p></div></section>
<section id="concepts"><h2>01a &mdash; Core Concepts</h2><div class="card"><table>
<tr><th>Pattern</th><th>Problem solved</th></tr>
<tr><td>RAG</td><td>Grounded answers from private corpus</td></tr>
<tr><td>Tool-using agent</td><td>Actions + fresh data (API, SQL)</td></tr>
<tr><td>Model router</td><td>Cost/latency vs quality</td></tr>
<tr><td>Semantic cache</td><td>Duplicate query cost</td></tr>
<tr><td>Map-reduce</td><td>Corpus larger than context</td></tr>
</table></div></section>
<section id="api"><h2>01b &mdash; API Surface</h2><div class="card"><pre># LangGraph-style agent edge (conceptual)
graph.add_node("plan", plan_node)
graph.add_node("tools", tool_node)
graph.add_conditional_edges("plan", should_continue, {"tools": "tools", END: END})</pre></div></section>
<section id="whento"><h2>02 &mdash; When to Use</h2><div class="card"><table>
<tr><th>Requirement</th><th>Pattern</th></tr>
<tr><td>FAQ over docs</td><td>RAG + citations</td></tr>
<tr><td>Book flight / query DB</td><td>Agent + tools</td></tr>
<tr><td>1000-page PDF Q&amp;A</td><td>Map-reduce + RAG</td></tr>
<tr><td>High QPS support</td><td>Router + semantic cache</td></tr>
</table></div></section>
<section id="architecture"><h2>03 &mdash; Architecture</h2><div class="card highlight"><pre>[Client] ──► API ──► Router ──┬──► RAG pipeline ──► LLM
                               ├──► Agent (LangGraph) ──► tools
                               └──► Cache hit ──► response</pre></div></section>
<section id="rag"><h2>04 &mdash; RAG Pattern</h2><div class="card"><p>Ingest &rarr; chunk &rarr; embed &rarr; index &rarr; retrieve &rarr; rerank &rarr; generate. See <a href="../systems/rag-end-to-end.html">RAG End-to-End</a> and <a href="../tech/vector-databases.html">Vector DBs</a>.</p></div></section>
<section id="agent"><h2>05 &mdash; Agent Pattern</h2><div class="card"><p>ReAct loop: reason &rarr; act (tool) &rarr; observe until stop. See <a href="../systems/agent-architectures.html">Agent Architectures</a>.</p></div></section>
<section id="router"><h2>06 &mdash; Router Pattern</h2><div class="card"><p>Cheap classifier or heuristic routes to mini vs frontier model; can save 80%+ cost on homogeneous traffic.</p></div></section>
<section id="cache"><h2>07 &mdash; Semantic Cache</h2><div class="card"><p>Embed query; if cosine &gt; 0.95 to prior query, return cached answer. Great for support macros.</p></div></section>
<section id="mapreduce"><h2>08 &mdash; Map-Reduce &amp; Eval Gate</h2><div class="card"><p>Map: summarize chunks in parallel; Reduce: merge with final LLM call. Handles corpuses beyond context window.</p>
<p><strong>Eval gate:</strong> golden set regression in CI; block deploy if faithfulness or task success drops. See <a href="evaluation-metrics.html">Evaluation Metrics</a>.</p></div></section>""",
  "prod": '<div class="card"><ul><li>Compose patterns: RAG inside agent tools</li><li>Feature flags per pattern path</li><li>Per-pattern SLO and cost dashboards</li></ul></div>',
  "pit": '<li><strong>Agent when RAG suffices</strong></li><li><strong>No eval gate on prompt changes</strong></li><li><strong>Monolithic prompt for map-reduce</strong></li><li><strong>Cache stale answers after doc update</strong></li>',
  "qa": [
    ("Most common production AI pattern?", "RAG for knowledge bots; router + mini model for cost; agents only when tools/actions required."),
    ("RAG vs agent?", "RAG: retrieve then answer. Agent: multi-step reasoning with tool side effects. Combine: agent retrieves via tool."),
    ("When map-reduce?", "Document too large for one context; parallel partial summaries then merge."),
    ("Semantic cache risks?", "Stale answers after KB update; invalidate on doc version bump; threshold tuning."),
    ("Model router design?", "Classifier on intent/complexity; log misroutes; shadow frontier on sample for quality audit."),
    ("Draw a support bot architecture?", "Ingress &rarr; moderation &rarr; cache &rarr; router &rarr; RAG (retrieve+rerank) &rarr; LLM with citations &rarr; output guard &rarr; user."),
    ("How does eval gate fit CI?", "On PR: run golden prompts vs baseline; fail if metric delta exceeds threshold."),
    ("Tool sandbox in agents?", "Allowlist APIs, read-only DB role, timeouts—part of system design not optional."),
    ("HITL in agent flows?", "Interrupt before irreversible tool; human approves in LangGraph checkpoint."),
    ("Hybrid search in RAG?", "BM25 + vector fusion improves recall for rare entity names."),
    ("Fine-tune vs RAG vs long context?", "RAG for changing facts; long context if doc fits once; fine-tune for style/format."),
    ("SDE3 AI system design?", "Names 3+ patterns, draws boxes with data flows, states NFRs (latency, cost, safety), quantifies $/request, mentions eval gate and fallbacks."),
  ],
},
{
  "slug": "context-window-kv-cache",
  "title": "Context Window &amp; KV Cache",
  "nav_short": "KV Cache",
  "hero": "Context window is the attention budget; KV cache is how inference makes autoregressive decoding affordable. Understand prefill/decode, memory growth, PagedAttention, and long-context mitigations.",
  "tags": [("KV Cache","green"),("Prefill","orange"),("PagedAttention","pink"),("Long Context","")],
  "main_cap": "Each generated token appends to per-layer K and V tensors; PagedAttention allocates GPU blocks efficiently across batched requests.",
  "nav": [("whatwhy","01","What &amp; Why"),("concepts","01a","Core Concepts"),("api","01b","API Surface"),("whento","02","When to Use"),("architecture","03","Architecture"),("kvcache","04","KV Cache Mechanics"),("prefill","05","Prefill Phase"),("decode","06","Decode Phase"),("memory","07","Memory Growth"),("paged","08","PagedAttention"),("production","09","Production"),("shows-up","10","Where It Shows Up"),("pitfalls","11","Pitfalls"),("interview","12","Interview Q&amp;A")],
  "zooms": [("context-window-kv-cache-kv-zoom.png","KV cache tensors","Per-layer K and V for all prior positions."),("context-window-kv-cache-paged-zoom.png","PagedAttention","Non-contiguous GPU blocks per sequence.")],
  "body": """<section id="whatwhy"><h2>01 &mdash; What &amp; Why</h2><div class="card"><p>Without <strong>KV cache</strong>, each new token would recompute attention over the entire history at O(n&sup2;) per step. Cache stores prior keys/values so decode is O(n) per step in sequence length. <strong>Context window</strong> caps n.</p></div></section>
<section id="concepts"><h2>01a &mdash; Core Concepts</h2><div class="card"><table>
<tr><th>Term</th><th>Definition</th><th>Gotcha</th></tr>
<tr><td><strong>KV cache</strong></td><td>Stored K,V per layer for past tokens</td><td>Memory scales O(L * n * d)</td></tr>
<tr><td><strong>Prefill</strong></td><td>Process prompt tokens in parallel</td><td>Fills cache, sets TTFT</td></tr>
<tr><td><strong>Decode</strong></td><td>One new token per step</td><td>Appends to cache each step</td></tr>
<tr><td><strong>PagedAttention</strong></td><td>Block-allocated KV memory (vLLM)</td><td>Reduces fragmentation in batching</td></tr>
</table></div></section>
<section id="api"><h2>01b &mdash; API Surface</h2><div class="card"><pre># vLLM server — OpenAI-compatible; manages KV internally
# Client sets max_tokens; server batches with paged KV blocks

from openai import OpenAI
client = OpenAI(base_url="http://localhost:8000/v1", api_key="x")
client.chat.completions.create(model="meta-llama/Llama-3.2-8B",
    messages=[{"role":"user","content":"Long context..."}],
    max_tokens=256)</pre></div></section>
<section id="whento"><h2>02 &mdash; When to Use</h2><div class="card"><table>
<tr><th>Problem</th><th>Approach</th></tr>
<tr><td>GPU OOM on long chats</td><td>Truncate, summarize, or smaller model</td></tr>
<tr><td>Many concurrent users</td><td>vLLM + PagedAttention</td></tr>
<tr><td>Need 1M tokens</td><td>Sparse attention / special models (rare)</td></tr>
</table></div></section>
<section id="architecture"><h2>03 &mdash; Architecture</h2><div class="card highlight"><pre>Prefill: tokens[1..n] ──► fill KV[1..n] per layer
Decode: token[n+1] ──► attend KV[1..n] ──► append KV[n+1] ──► repeat</pre></div></section>
<section id="kvcache"><h2>04 &mdash; KV Cache Mechanics</h2><div class="card"><p>For each layer, cache tensors shape roughly (batch, heads, seq_len, head_dim). New token only computes Q,K,V for itself; attends all cached K,V.</p></div></section>
<section id="prefill"><h2>05 &mdash; Prefill Phase</h2><div class="card"><p>Parallel over prompt positions; compute-intensive; dominates TTFT for RAG with large contexts.</p></div></section>
<section id="decode"><h2>06 &mdash; Decode Phase</h2><div class="card"><p>Serial steps; memory-bandwidth bound; TPS improves with batching multiple sequences.</p></div></section>
<section id="memory"><h2>07 &mdash; Memory Growth</h2><div class="card"><p>KV memory &asymp; 2 * num_layers * seq_len * hidden * bytes_per_param. 128K context on 70B can exceed single GPU without offloading.</p></div></section>
<section id="paged"><h2>08 &mdash; PagedAttention &amp; Long Context</h2><div class="card"><p>Allocates KV in non-contiguous blocks like OS virtual memory; vLLM achieves higher batch utilization.</p>
<ul><li>RoPE scaling (NTK, YaRN) for extended positions</li><li>Sliding window attention (Mistral) bounds KV size</li><li>Prefer retrieval over stuffing entire corpus</li></ul></div></section>""",
  "prod": '<div class="card"><ul><li>Cap max context per tier in API gateway</li><li>Monitor KV memory per replica</li><li>Use vLLM metrics: cache usage, batch size</li></ul></div>',
  "pit": '<li><strong>Assuming 128K is practical at full fill</strong></li><li><strong>No KV-aware capacity planning</strong></li><li><strong>Re-prefill entire history every turn</strong> when cache could persist</li><li><strong>Confusing context limit with affordable context</strong></li>',
  "qa": [
    ("What is stored in KV cache?", "Per transformer layer: key and value projections for each prior token position, so new queries attend without recomputation."),
    ("Prefill vs decode?", "Prefill processes all prompt tokens at once (parallel). Decode generates one token at a time (serial), appending to cache each step."),
    ("Why does KV memory matter?", "Serves many long conversations concurrently; OOM kills replicas; drives $/GPU-hour economics."),
    ("What is PagedAttention?", "vLLM block-based KV allocation reducing fragmentation when batching variable-length sequences."),
    ("How does context window relate to KV?", "Window is max seq_len n; KV size grows linearly with n per layer until cap hit."),
    ("Why is long RAG context expensive?", "Large prefill + large KV for entire session; hurts TTFT, memory, and input token bill."),
    ("Multi-turn chat optimization?", "Reuse cached prefix if platform supports session KV; else summarize old turns."),
    ("Sliding window attention?", "Each token only attends last W positions; bounds KV memory; used in Mistral variants."),
    ("RoPE scaling for longer context?", "Interpolation/extrapolation tricks extend positions beyond training length with some quality loss."),
    ("When to retrieve vs stuff context?", "Retrieve top-k when corpus huge; stuffing only when total tokens affordable."),
    ("Speculative decoding relation?", "Draft model proposes tokens; target verifies—speeds decode, separate from KV but same serving stack."),
    ("SDE3 KV cache answer?", "Explains prefill/decode, KV growth formula intuition, PagedAttention, ties to cost/latency and RAG prompt sizing."),
  ],
},
]
