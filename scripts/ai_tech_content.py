# ai_tech_content.py — TOPICS for generate_ai_tech_batch.py

def _nav(*items):
    return items


def _tags(*items):
    return items


def _qa(*pairs):
    return list(pairs)


# ── 1. openai-api-patterns ──────────────────────────────────────────
TOPICS["openai-api-patterns"] = dict(
    title="OpenAI / Anthropic API Patterns",
    nav="API Patterns",
    hero="Production patterns for chat completions, streaming SSE, structured JSON output, tool/function calling, embeddings, batch API, retries, and multi-provider fallbacks. The API layer every RAG and agent stack builds on.",
    tags=_tags(
        ("Chat Completions", ""),
        ("Streaming", " orange"),
        ("Tool Calling", " green"),
        ("Structured Output", " pink"),
        ("Retries", " purple"),
    ),
    main_img="openai-api-patterns-main.png",
    main_cap="Request flow: client → auth + rate limit → chat.completions (stream or JSON) → optional tool loop → response. Typical latency: 200–800 ms TTFT streaming; batch API 50% cost discount for offline jobs.",
    nav_items=_nav(
        ("01", "what", "What & Why"),
        ("01a", "concepts", "Core Concepts"),
        ("01b", "api", "API Surface"),
        ("02", "when", "When to Use"),
        ("03", "architecture", "Architecture"),
        ("04", "streaming", "Streaming"),
        ("05", "structured", "Structured Output"),
        ("06", "tools", "Tool Calling"),
        ("07", "embeddings", "Embeddings API"),
        ("08", "batch", "Batch & Retries"),
        ("09", "production", "Production & Ops"),
        ("10", "where", "Where It Shows Up"),
        ("11", "pitfalls", "Pitfalls"),
        ("12", "interview", "Interview Q&A"),
    ),
    sections=[
        (
            "what",
            "01",
            "What &amp; Why",
            card(
                "<p><strong>Problem:</strong> LLM apps need a stable contract for chat, tools, embeddings, and structured data — with streaming UX, cost control, and provider failover.</p>"
                "<h3>Functional</h3><ul>"
                "<li>Multi-turn chat with system/user/assistant/tool messages</li>"
                "<li>Stream tokens to UI (SSE)</li>"
                "<li>Force JSON / Pydantic schema via structured outputs</li>"
                "<li>Native tool calling loop (model proposes → you execute → feed results back)</li>"
                "<li>Embeddings for RAG ingest and query</li></ul>"
                "<h3>Non-Functional</h3><ul>"
                "<li>Retries with exponential backoff on 429/5xx</li>"
                "<li>Token/cost logging per request</li>"
                "<li>Latency: TTFT &lt;500 ms for gpt-4o-mini class models</li></ul>"
                "<blockquote>See also <a href=\"../fundamentals/llm-fundamentals.html\">LLM Fundamentals</a> for tokens and context; this sheet is the <em>integration</em> layer.</blockquote>"
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
                            ("td", "<strong>Chat Completions</strong>"),
                            ("td", "messages[] in → assistant message out"),
                            ("td", "Not the legacy Completions API (prompt string)"),
                        ),
                        (
                            ("td", "<strong>TTFT</strong>"),
                            ("td", "Time to first token in streaming"),
                            ("td", "User-perceived latency; log separately from total"),
                        ),
                        (
                            ("td", "<strong>Tool call</strong>"),
                            ("td", "Model emits function name + JSON args"),
                            ("td", "You execute; return tool role messages"),
                        ),
                        (
                            ("td", "<strong>Structured output</strong>"),
                            ("td", "response_format json_schema / Pydantic"),
                            ("td", "Still validate server-side — models can drift"),
                        ),
                        (
                            ("td", "<strong>Batch API</strong>"),
                            ("td", "Async file-based jobs, ~50% cheaper"),
                            ("td", "24h SLA; not for online chat"),
                        ),
                    ]
                )
            ),
        ),
        (
            "api",
            "01b",
            "API / Interface Surface",
            card(
                '<pre>from openai import OpenAI\nclient = OpenAI()\n\nresp = client.chat.completions.create(\n    model="gpt-4o-mini",\n    messages=[\n        {"role": "system", "content": "You are a helpful assistant."},\n        {"role": "user", "content": "Summarize RAG in 3 bullets."},\n    ],\n    temperature=0.2,\n    max_tokens=512,\n)\nprint(resp.choices[0].message.content)\nprint(resp.usage.total_tokens)  # cost logging</pre>'
                "<h3>Anthropic (Messages API)</h3>"
                '<pre>import anthropic\ncl = anthropic.Anthropic()\nmsg = cl.messages.create(\n    model="claude-sonnet-4-20250514",\n    max_tokens=1024,\n    system="...",\n    messages=[{"role": "user", "content": "Hello"}],\n)</pre>'
            ),
        ),
        (
            "when",
            "02",
            "When to Use / When NOT",
            card(
                tbl(
                    [
                        (("th", "Pattern"), ("th", "Use"), ("th", "Alternative")),
                        (
                            ("td", "Direct API"),
                            ("td", "Full control, any language"),
                            ("td", "<a href=\"langchain.html\">LangChain</a> for chains/agents"),
                        ),
                        (
                            ("td", "Streaming"),
                            ("td", "Chat UX, long answers"),
                            ("td", "Blocking invoke for batch only"),
                        ),
                        (
                            ("td", "Structured output"),
                            ("td", "Extract fields, routing JSON"),
                            ("td", "Regex parse (fragile)"),
                        ),
                        (
                            ("td", "Batch API"),
                            ("td", "Nightly eval, bulk embed"),
                            ("td", "Realtime chat completions"),
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
                '<pre>Client App\n  -> API Gateway (auth, rate limit, request_id)\n  -> LLM Proxy (retry, fallback provider, cache)\n  -> OpenAI / Anthropic / Azure OpenAI\n  -> Observability (tokens, latency, trace_id)</pre>'
                "<div class='flow'>"
                "<div class='step' data-num='1'><span class='label'>Request</span><div class='detail'>Validate messages; inject system prompt version tag.</div></div>"
                "<div class='step' data-num='2'><span class='label'>Call</span><div class='detail'>Stream or block; timeout 60–120s.</div></div>"
                "<div class='step' data-num='3'><span class='label'>Tool loop</span><div class='detail'>If tool_calls: execute idempotently; append tool messages; recall.</div></div>"
                "<div class='step' data-num='4'><span class='label'>Log</span><div class='detail'>usage.prompt_tokens, completion_tokens, model, latency_ms.</div></div>"
                "</div>"
            ),
        ),
        (
            "streaming",
            "04",
            "Deep Dive: Streaming",
            diag(
                "openai-api-patterns",
                "streaming-zoom",
                "SSE streaming: client receives delta chunks until finish_reason stop; map to WebSocket/SSE for UI.",
            )
            + card(
                '<pre>stream = client.chat.completions.create(..., stream=True)\nfor chunk in stream:\n    delta = chunk.choices[0].delta.content\n    if delta:\n        yield delta  # SSE to browser\n# Handle finish_reason: stop | tool_calls | length</pre>'
                "<p>Always handle <code>finish_reason=length</code> (truncation) and stream tool call argument fragments.</p>"
            ),
        ),
        (
            "structured",
            "05",
            "Deep Dive: Structured Output",
            diag(
                "openai-api-patterns",
                "structured-zoom",
                "JSON schema / Pydantic structured output: model constrained to valid object shape for routing and extraction.",
            )
            + card(
                '<pre>from pydantic import BaseModel\n\nclass Route(BaseModel):\n    intent: str\n    confidence: float\n\nresp = client.beta.chat.completions.parse(\n    model="gpt-4o-mini",\n    messages=[...],\n    response_format=Route,\n)\nroute: Route = resp.choices[0].message.parsed</pre>'
            ),
        ),
        (
            "tools",
            "06",
            "Deep Dive: Tool Calling",
            card(
                '<pre>tools = [{\n  "type": "function",\n  "function": {\n    "name": "search_kb",\n    "description": "Search internal knowledge base",\n    "parameters": {\n      "type": "object",\n      "properties": {"query": {"type": "string"}},\n      "required": ["query"],\n    },\n  },\n}]\n# Loop: completion -> if tool_calls -> run -> append tool results -> completion</pre>'
                "<p>See <a href=\"../systems/tool-calling-functions.html\">Tool Calling &amp; Functions</a> for schema design and security.</p>"
            ),
        ),
        (
            "embeddings",
            "07",
            "Deep Dive: Embeddings API",
            card(
                '<pre>emb = client.embeddings.create(\n    model="text-embedding-3-small",\n    input=["chunk one", "chunk two"],\n    dimensions=1536,  # optional Matryoshka\n)\nvectors = [d.embedding for d in emb.data]</pre>'
                "<p>Batch up to model limit; same model at ingest and query. Link: <a href=\"embedding-models.html\">Embedding Models</a>.</p>"
            ),
        ),
        (
            "batch",
            "08",
            "Deep Dive: Batch API &amp; Retries",
            card(
                "<p><strong>Retries:</strong> exponential backoff + jitter on 429/500/503; respect <code>Retry-After</code>. Max 3–5 attempts.</p>"
                "<p><strong>Batch:</strong> upload JSONL of requests → poll job → download results. Ideal for eval harness and bulk embedding.</p>"
                "<p><strong>Multi-provider:</strong> abstract behind LiteLLM or custom router; fallback gpt-4o → claude on outage.</p>"
            ),
        ),
        (
            "production",
            "09",
            "Production &amp; Ops",
            card(
                tbl(
                    [
                        (("th", "Concern"), ("th", "Practice")),
                        (
                            ("td", "Cost"),
                            ("td", "Log tokens; cache system prompts; use mini models for routing"),
                        ),
                        (
                            ("td", "Rate limits"),
                            ("td", "Token bucket per tenant; queue overflow"),
                        ),
                        (
                            ("td", "Secrets"),
                            ("td", "API keys in vault; never client-side"),
                        ),
                        (
                            ("td", "Observability"),
                            ("td", "<a href=\"llm-observability.html\">LLM Observability</a> — trace every call"),
                        ),
                    ]
                )
            ),
        ),
        (
            "where",
            "10",
            "Where It Shows Up",
            card(
                "<ul>"
                "<li><a href=\"langchain.html\">LangChain</a> — wraps these APIs in runnables</li>"
                "<li><a href=\"../systems/rag-end-to-end.html\">RAG End-to-End</a> — embed + generate calls</li>"
                "<li><a href=\"embedding-models.html\">Embedding Models</a> — model choice</li>"
                "<li><a href=\"llm-observability.html\">LLM Observability</a> — traces and cost</li>"
                "<li><a href=\"../fundamentals/prompt-engineering.html\">Prompt Engineering</a> — message design</li>"
                "</ul>"
            ),
        ),
        (
            "pitfalls",
            "11",
            "Common Pitfalls",
            card(
                "<ul>"
                "<li>No retry on 429 — thundering herd after rate limit</li>"
                "<li>Trusting structured JSON without Pydantic validation</li>"
                "<li>Exposing API keys in frontend</li>"
                "<li>Ignoring <code>finish_reason=length</code> — truncated JSON</li>"
                "<li>Mixing Chat Completions with legacy Completion API</li>"
                "<li>No timeout — hung connections block workers</li>"
                "</ul>"
            ),
        ),
    ],
    qa=_qa(
        (
            "Chat Completions vs Assistants API?",
            "Chat Completions is stateless — you send full message history each call (or manage history yourself). Assistants/Threads store state server-side with file search and code interpreter. Most production RAG/agents use Chat Completions + your own retrieval and <a href=\"langgraph.html\">LangGraph</a> for state.",
        ),
        (
            "How do you implement streaming to a web UI?",
            "OpenAI <code>stream=True</code> yields SSE chunks. Your FastAPI route returns <code>StreamingResponse</code> mapping delta.content to client events. Track finish_reason; on tool_calls, switch UI to tool-approval mode.",
        ),
        (
            "Explain the tool calling loop.",
            "1) Send messages + tool schemas. 2) If assistant message has tool_calls, execute each function (validate args). 3) Append tool role messages with results. 4) Call model again until no tool_calls. Cap iterations at 5–10.",
        ),
        (
            "Structured output vs prompt-only JSON?",
            "Structured output (json_schema / Pydantic) constrains decoding — higher valid-json rate. Still validate with Pydantic server-side. Prompt-only 'return JSON' fails ~5–15% on complex schemas.",
        ),
        (
            "How handle rate limits (429)?",
            "Exponential backoff with jitter; honor Retry-After header; per-tenant token bucket; queue non-urgent requests; consider Batch API for offline work; multi-key pool only if ToS allows.",
        ),
        (
            "OpenAI vs Anthropic message format differences?",
            "OpenAI: system as role or separate field; tool messages with tool_call_id. Anthropic: system param separate; content blocks array; tool_use/tool_result blocks. Abstract behind a thin adapter or LiteLLM.",
        ),
        (
            "When use Batch API?",
            "Nightly eval runs, bulk classification, embedding 1M chunks overnight. 50% cost discount; 24h completion window. Not for user-facing chat.",
        ),
        (
            "How log cost per request?",
            "Record response.usage (prompt_tokens, completion_tokens) × model price table. Attach user_id, feature, trace_id. Alert on anomalies.",
        ),
        (
            "Azure OpenAI vs OpenAI direct?",
            "Azure: enterprise VPC, private endpoints, regional deployment names, Microsoft billing. Same API shape with different base_url and api-version query param.",
        ),
        (
            "How prevent prompt injection via user content?",
            "Separate system from user; delimit untrusted docs; output validation; tool allowlists; never execute model-generated code without sandbox. See <a href=\"../fundamentals/prompt-engineering.html\">Prompt Engineering</a>.",
        ),
        (
            "Embeddings: one string vs array input?",
            "Array input batches in one HTTP call — fewer round trips. Respect max tokens per request; chunk long texts before embed.",
        ),
        (
            "SDE3: design LLM gateway for 50 microservices.",
            "Central proxy: auth (mTLS), rate limits per service, model routing, retry/fallback, prompt registry version tags, unified logging to <a href=\"llm-observability.html\">observability</a> stack, cache for identical embed requests, budget caps per team.",
        ),
    ),
)

# Load remaining 11 topics from part 2
import os as _os

exec(
    compile(
        open(
            _os.path.join(_os.path.dirname(_os.path.abspath(__file__)), "ai_tech_content_p2.py")
        ).read(),
        "ai_tech_content_p2.py",
        "exec",
    )
)
