#!/usr/bin/env python3
"""Generate expanded AI tech cheatsheets batch A (4 files, SDE3 quality)."""
import os
import re

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
OUT = os.path.join(ROOT, "docs/cheatsheets/ai/tech")
LANGGRAPH = os.path.join(OUT, "langgraph.html")

CSS = re.search(r"<style>(.*?)</style>", open(LANGGRAPH).read(), re.S).group(1)
LB = open(LANGGRAPH).read()
LB = LB[LB.index("<!-- ===== diagram lightbox") :]


def page(title, nav, hero, tags, main_img, main_cap, sections, nav_items, qa, interview_num="12"):
    tags_html = "".join(f'<span class="tag{t}">{x}</span>' for x, t in tags)
    nav_html = "".join(
        f'  <a href="#{i}"><span class="num">{n}</span> {l}</a>\n' for n, i, l in nav_items
    )
    sec_html = "".join(
        f'<section id="{i}">\n  <h2>{n} &mdash; {h}</h2>\n{b}\n</section>\n\n\n'
        for i, n, h, b in sections
    )
    qa_html = "\n\n  ".join(
        f'<details>\n    <summary>{q}</summary>\n    <div class="answer">{a}</div>\n  </details>'
        for q, a in qa
    )
    return (
        f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{title} -- AI Tech Cheat Sheet</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
{CSS}
</style>
</head>
<body>
<nav class="nav">
  <h2>{nav}</h2>
  <a href="index.html" style="color:var(--accent2);margin-bottom:16px;">&larr; AI Tech</a>
{nav_html}</nav>
<div class="main">
<div class="hero">
  <h1>{title} <span>// AI Tech</span></h1>
  <p>{hero}</p>
  <div class="tags">{tags_html}</div>
</div>

<div class="diagram">
  <img src="img/{main_img}" alt="{title} architecture overview">
</div>
<p class="diagram-caption">{main_cap}</p>

{sec_html}<section id="interview">
  <h2>{interview_num} &mdash; Interview Q&amp;A</h2>

  {qa_html}
</section>

</div>
{LB}
"""
    )


def card(html, hl=False):
    c = "card highlight" if hl else "card"
    return f'  <div class="{c}">\n{html}\n  </div>'


def tbl(rows):
    body = "".join(
        f"      <tr>{''.join(f'<{t}>{c}</{t}>' for t, c in r)}</tr>\n" for r in rows
    )
    return f"    <table>\n{body}    </table>"


def diag(slug, name, cap):
    return (
        f'  <div class="diagram">\n'
        f'    <img src="img/{slug}-{name}.png" alt="{cap}">\n'
        f"  </div>\n"
        f'  <p class="diagram-caption">{cap}</p>\n'
    )


def flow(*steps):
    items = "".join(
        f'    <div class="step" data-num="{n}"><span class="label">{label}</span>'
        f'<div class="detail">{detail}</div></div>\n'
        for n, label, detail in steps
    )
    return f'    <div class="flow">\n{items}    </div>'


# ── Expanded topics ─────────────────────────────────────────────────

OPENAI = dict(
    title="OpenAI / Anthropic API Patterns",
    nav="API Patterns",
    hero="Production patterns for chat completions, streaming SSE, structured JSON output, tool/function calling, embeddings, batch API, retries, and multi-provider fallbacks. The API layer every RAG and agent stack builds on.",
    tags=[
        ("Chat Completions", ""),
        ("Streaming", " orange"),
        ("Tool Calling", " green"),
        ("Structured Output", " pink"),
        ("Retries", " purple"),
    ],
    main_img="openai-api-patterns-main.png",
    main_cap="Request flow: client &rarr; auth + rate limit &rarr; chat.completions (stream or JSON) &rarr; optional tool loop &rarr; response. Typical latency: 200&ndash;800 ms TTFT streaming; Batch API ~50% cost discount for offline jobs.",
    nav_items=[
        ("01", "what", "What &amp; Why"),
        ("01a", "concepts", "Core Concepts"),
        ("01b", "api", "API Surface"),
        ("02", "when", "When to Use"),
        ("03", "architecture", "Architecture"),
        ("04", "streaming", "Streaming"),
        ("05", "structured", "Structured Output"),
        ("06", "tools", "Tool Calling"),
        ("07", "embeddings", "Embeddings API"),
        ("08", "batch", "Batch &amp; Retries"),
        ("09", "production", "Production &amp; Ops"),
        ("10", "where", "Where It Shows Up"),
        ("11", "pitfalls", "Pitfalls"),
        ("12", "interview", "Interview Q&amp;A"),
    ],
    sections=[
        (
            "what",
            "01",
            "What &amp; Why",
            card(
                "<p><strong>Problem:</strong> LLM apps need a stable contract for chat, tools, embeddings, and structured data &mdash; with streaming UX, cost control, and provider failover. Raw HTTP to OpenAI/Anthropic is the foundation; frameworks like <a href=\"langchain.html\">LangChain</a> wrap these calls.</p>"
                "<h3>Functional</h3><ul>"
                "<li>Multi-turn chat with system/user/assistant/tool messages</li>"
                "<li>Stream tokens to UI (SSE) for perceived low latency</li>"
                "<li>Force JSON / Pydantic schema via structured outputs</li>"
                "<li>Native tool calling loop (model proposes &rarr; you execute &rarr; feed results back)</li>"
                "<li>Embeddings for RAG ingest and query (same model both sides)</li>"
                "<li>Batch API for offline bulk jobs at reduced cost</li></ul>"
                "<h3>Non-Functional</h3><ul>"
                "<li><strong>Retries</strong> &mdash; exponential backoff on 429/5xx; honor <code>Retry-After</code></li>"
                "<li><strong>Observability</strong> &mdash; log <code>usage</code> tokens, model, latency_ms, trace_id</li>"
                "<li><strong>Latency</strong> &mdash; TTFT &lt;500 ms for gpt-4o-mini class; total time scales with output tokens</li>"
                "<li><strong>Security</strong> &mdash; API keys server-side only; never in browser bundles</li></ul>"
                "<blockquote><strong>Position in stack:</strong> Below orchestration (<a href=\"langgraph.html\">LangGraph</a>, <a href=\"crewai.html\">CrewAI</a>) and above vector storage (<a href=\"vector-databases.html\">Vector Databases</a>). Token and context fundamentals: <a href=\"../fundamentals/llm-fundamentals.html\">LLM Fundamentals</a>.</blockquote>"
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
                            ("td", "<code>messages[]</code> in &rarr; assistant message out"),
                            ("td", "Not the legacy Completions API (single prompt string)"),
                        ),
                        (
                            ("td", "<strong>Messages API</strong>"),
                            ("td", "Anthropic equivalent; <code>system</code> param separate"),
                            ("td", "Content blocks array; tool_use / tool_result blocks"),
                        ),
                        (
                            ("td", "<strong>TTFT</strong>"),
                            ("td", "Time to first token in streaming mode"),
                            ("td", "User-perceived latency; log separately from total duration"),
                        ),
                        (
                            ("td", "<strong>Tool call</strong>"),
                            ("td", "Model emits function name + JSON args in assistant message"),
                            ("td", "You execute; return <code>tool</code> role messages with <code>tool_call_id</code>"),
                        ),
                        (
                            ("td", "<strong>Structured output</strong>"),
                            ("td", "<code>response_format</code> json_schema or Pydantic parse"),
                            ("td", "Still validate server-side &mdash; models can drift on edge cases"),
                        ),
                        (
                            ("td", "<strong>Batch API</strong>"),
                            ("td", "Async file-based jobs, ~50% cheaper than realtime"),
                            ("td", "24h SLA; not for user-facing chat"),
                        ),
                        (
                            ("td", "<strong>finish_reason</strong>"),
                            ("td", "<code>stop</code>, <code>length</code>, <code>tool_calls</code>, <code>content_filter</code>"),
                            ("td", "<code>length</code> means truncated &mdash; retry or warn user"),
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
                "<p>OpenAI Python SDK v1+ uses a unified client. Always log <code>response.usage</code> for cost attribution.</p>"
                "<pre>from openai import OpenAI\nclient = OpenAI()  # OPENAI_API_KEY env\n\nresp = client.chat.completions.create(\n    model=\"gpt-4o-mini\",\n    messages=[\n        {\"role\": \"system\", \"content\": \"You are a helpful assistant.\"},\n        {\"role\": \"user\", \"content\": \"Summarize RAG in 3 bullets.\"},\n    ],\n    temperature=0.2,\n    max_tokens=512,\n)\nprint(resp.choices[0].message.content)\nprint(resp.usage.prompt_tokens, resp.usage.completion_tokens)</pre>"
                "<h3>Anthropic Messages API</h3>"
                "<pre>import anthropic\ncl = anthropic.Anthropic()\nmsg = cl.messages.create(\n    model=\"claude-sonnet-4-20250514\",\n    max_tokens=1024,\n    system=\"Answer concisely from provided context only.\",\n    messages=[{\"role\": \"user\", \"content\": \"Hello\"}],\n)\n# msg.content[0].text</pre>"
                + tbl(
                    [
                        (("th", "Method / Param"), ("th", "Purpose")),
                        (("td", "<code>chat.completions.create</code>"), ("td", "Sync chat; blocking until complete")),
                        (("td", "<code>stream=True</code>"), ("td", "SSE chunks; iterate for token UX")),
                        (("td", "<code>tools=[...]</code>"), ("td", "Function schemas for native tool calling")),
                        (("td", "<code>response_format</code>"), ("td", "JSON mode or strict json_schema")),
                        (("td", "<code>embeddings.create</code>"), ("td", "Batch text &rarr; vectors for RAG")),
                        (("td", "<code>invoke(Command(resume=...), config)</code>"), ("td", "Continue after interrupt")),
                    ]
                )
                + "<h3>Quick reference: message roles</h3>"
                + tbl(
                    [
                        (("th", "Role"), ("th", "When"), ("th", "Notes")),
                        (("td", "system"), ("td", "Instructions, persona"), ("td", "Keep stable; version tag in metadata")),
                        (("td", "user"), ("td", "End-user input"), ("td", "Treat as untrusted; delimit injected docs")),
                        (("td", "assistant"), ("td", "Model output"), ("td", "May include tool_calls array")),
                        (("td", "tool"), ("td", "Function result"), ("td", "Must include tool_call_id matching request")),
                    ]
                )
            ),
        ),
        (
            "when",
            "02",
            "When to Use / When NOT",
            card(
                tbl(
                    [
                        (("th", "Pattern"), ("th", "Use direct API?"), ("th", "Alternative")),
                        (
                            ("td", "Full control, any language"),
                            ("td", "<strong>Yes</strong>"),
                            ("td", "<a href=\"langchain.html\">LangChain</a> Runnable wrappers"),
                        ),
                        (
                            ("td", "Streaming chat UX"),
                            ("td", "<strong>Yes</strong> &mdash; <code>stream=True</code>"),
                            ("td", "Blocking only for batch/cron"),
                        ),
                        (
                            ("td", "Structured routing JSON"),
                            ("td", "<strong>Yes</strong> &mdash; Pydantic parse"),
                            ("td", "Regex on free text (fragile)"),
                        ),
                        (
                            ("td", "Multi-step agent with HITL"),
                            ("td", "<strong>Maybe</strong> &mdash; raw tool loop works"),
                            ("td", "<a href=\"langgraph.html\">LangGraph</a> for checkpointing"),
                        ),
                        (
                            ("td", "Nightly eval / bulk embed"),
                            ("td", "<strong>Yes</strong> &mdash; Batch API"),
                            ("td", "Realtime completions (expensive)"),
                        ),
                        (
                            ("td", "Simple fixed RAG chain"),
                            ("td", "<strong>Maybe</strong>"),
                            ("td", "LCEL or <a href=\"llamaindex.html\">LlamaIndex</a> query engine"),
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
                "<pre>                    +------------------+\n                    |   Client / UI    |\n                    +--------+---------+\n                             |\n                             v\n                    +------------------+\n                    |  API Gateway     |\n                    |  auth, rate limit|\n                    +--------+---------+\n                             |\n                             v\n                    +------------------+\n                    |   LLM Proxy      |\n                    | retry, fallback  |\n                    +--------+---------+\n              +--------------+--------------+\n              v              v              v\n        OpenAI         Anthropic      Azure OpenAI\n              \\              |              /\n               +-------------+-------------+\n                             v\n                    +------------------+\n                    | Observability    |\n                    | tokens, trace_id |\n                    +------------------+</pre>"
                + flow(
                    (
                        "1",
                        "Validate",
                        "Sanitize messages; inject system prompt version tag; cap history length.",
                    ),
                    (
                        "2",
                        "Call",
                        "Stream or block; set timeout 60&ndash;120s; attach request_id for support.",
                    ),
                    (
                        "3",
                        "Tool loop",
                        "If tool_calls: validate args, execute idempotently, append tool messages, recall (max 5&ndash;10 iter).",
                    ),
                    (
                        "4",
                        "Log",
                        "Record usage, model, latency_ms, finish_reason; emit to <a href=\"llm-observability.html\">observability</a> stack.",
                    ),
                ),
                hl=True,
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
                "<p>Streaming improves <strong>TTFT</strong> (time to first token). Users see progress immediately; total generation time is unchanged. Always handle edge cases in the stream loop.</p>"
                "<pre>stream = client.chat.completions.create(\n    model=\"gpt-4o-mini\",\n    messages=messages,\n    stream=True,\n)\nfor chunk in stream:\n    choice = chunk.choices[0]\n    delta = choice.delta.content\n    if delta:\n        yield delta  # forward as SSE event to browser\n    if choice.finish_reason:\n        # stop | length | tool_calls | content_filter\n        handle_finish(choice.finish_reason)</pre>"
                "<h3>FastAPI SSE bridge</h3>"
                "<pre>from fastapi.responses import StreamingResponse\n\nasync def token_stream():\n    for delta in openai_stream():\n        yield f\"data: {json.dumps({'token': delta})}\\n\\n\"\n\nreturn StreamingResponse(token_stream(), media_type=\"text/event-stream\")</pre>"
                "<ul>"
                "<li>Stream tool-call argument fragments; buffer until JSON complete before execute</li>"
                "<li>On <code>finish_reason=length</code>, offer &ldquo;continue&rdquo; or truncate gracefully</li>"
                "<li>Log TTFT separately from total latency for SLO dashboards</li></ul>"
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
                "<p>Use structured output for intent routing, entity extraction, and API response shaping. Constrained decoding raises valid-JSON rate vs prompt-only &ldquo;return JSON&rdquo;.</p>"
                "<pre>from pydantic import BaseModel, Field\n\nclass Route(BaseModel):\n    intent: str = Field(description=\"support | billing | sales\")\n    confidence: float\n    needs_human: bool\n\nresp = client.beta.chat.completions.parse(\n    model=\"gpt-4o-mini\",\n    messages=[{\"role\": \"user\", \"content\": user_text}],\n    response_format=Route,\n)\nroute: Route = resp.choices[0].message.parsed\n# Always: route.model_validate(...) or try/except on None</pre>"
                "<h3>json_schema mode (strict)</h3>"
                "<pre>response_format={\n    \"type\": \"json_schema\",\n    \"json_schema\": {\n        \"name\": \"route\",\n        \"strict\": True,\n        \"schema\": Route.model_json_schema(),\n    },\n}</pre>"
                "<blockquote><strong>Interview tip:</strong> Structured output reduces parse failures but is not a substitute for server-side validation and authorization checks on extracted fields.</blockquote>"
            ),
        ),
        (
            "tools",
            "06",
            "Deep Dive: Tool Calling",
            card(
                "<p>Tool calling lets the model request side effects (search, SQL, APIs). You remain in control: the model proposes; your code executes. Orchestration layer: <a href=\"langgraph.html\">LangGraph</a> ToolNode; framework wrapper: <a href=\"langchain.html\">LangChain</a> <code>bind_tools</code>.</p>"
                "<pre>tools = [{\n  \"type\": \"function\",\n  \"function\": {\n    \"name\": \"search_kb\",\n    \"description\": \"Search internal knowledge base by semantic query\",\n    \"parameters\": {\n      \"type\": \"object\",\n      \"properties\": {\n        \"query\": {\"type\": \"string\"},\n        \"top_k\": {\"type\": \"integer\", \"default\": 5},\n      },\n      \"required\": [\"query\"],\n    },\n  },\n}]\n\nmessages = [{\"role\": \"user\", \"content\": \"Refund policy?\"}]\nwhile True:\n    resp = client.chat.completions.create(\n        model=\"gpt-4o-mini\", messages=messages, tools=tools)\n    msg = resp.choices[0].message\n    if not msg.tool_calls:\n        break\n    messages.append(msg)\n    for tc in msg.tool_calls:\n        result = run_tool(tc.function.name, json.loads(tc.function.arguments))\n        messages.append({\n            \"role\": \"tool\",\n            \"tool_call_id\": tc.id,\n            \"content\": json.dumps(result),\n        })</pre>"
                "<p>See <a href=\"../systems/tool-calling-functions.html\">Tool Calling &amp; Functions</a> for schema design, allowlists, and security. For graph-level control use <a href=\"langgraph.html\">LangGraph</a> <code>ToolNode</code> + HITL interrupts.</p>"
            )
            + card(
                "<h3>Complete runnable tool loop</h3>"
                "<pre>import json\nfrom openai import OpenAI\n\nclient = OpenAI()\nTOOLS = [{\"type\": \"function\", \"function\": {\n    \"name\": \"get_weather\", \"description\": \"Get weather for a city\",\n    \"parameters\": {\"type\": \"object\", \"properties\": {\n        \"city\": {\"type\": \"string\"}}, \"required\": [\"city\"]}}}]\n\ndef get_weather(city: str) -> dict:\n    return {\"city\": city, \"temp_f\": 72, \"conditions\": \"sunny\"}\n\nDISPATCH = {\"get_weather\": lambda args: get_weather(args[\"city\"])}\n\ndef run_agent(user_msg: str, max_rounds: int = 8) -> str:\n    messages = [{\"role\": \"user\", \"content\": user_msg}]\n    for _ in range(max_rounds):\n        resp = client.chat.completions.create(\n            model=\"gpt-4o-mini\", messages=messages, tools=TOOLS)\n        msg = resp.choices[0].message\n        if not msg.tool_calls:\n            return msg.content or \"\"\n        messages.append(msg.model_dump(exclude_none=True))\n        for tc in msg.tool_calls:\n            args = json.loads(tc.function.arguments)\n            result = DISPATCH[tc.function.name](args)\n            messages.append({\"role\": \"tool\", \"tool_call_id\": tc.id,\n                             \"content\": json.dumps(result)})\n    raise RuntimeError(\"max tool rounds exceeded\")</pre>"
                "<blockquote><strong>Interview tip:</strong> Dispatch table + schema validation + max rounds is the minimum production pattern. Add idempotency keys for mutating tools.</blockquote>",
                hl=True,
            ),
        ),
        (
            "embeddings",
            "07",
            "Deep Dive: Embeddings API",
            card(
                "<pre>emb = client.embeddings.create(\n    model=\"text-embedding-3-small\",\n    input=[\"chunk one\", \"chunk two\"],  # batch in one call\n    dimensions=1536,  # optional Matryoshka truncation\n)\nvectors = [d.embedding for d in emb.data]</pre>"
                "<ul>"
                "<li><strong>Same model</strong> at ingest and query &mdash; never mix vector spaces</li>"
                "<li>Batch array input to reduce HTTP round trips; respect token limits per request</li>"
                "<li>Store vectors in <a href=\"vector-databases.html\">vector DB</a>; see <a href=\"embedding-models.html\">Embedding Models</a> for model selection</li>"
                "<li>Cache hot query embeddings (TTL 5&ndash;60 min) keyed by question hash</li></ul>"
            ),
        ),
        (
            "batch",
            "08",
            "Deep Dive: Batch API &amp; Retries",
            card(
                "<h3>Retries (429 / 5xx)</h3>"
                "<pre>import time, random\n\ndef call_with_retry(fn, max_attempts=5):\n    for attempt in range(max_attempts):\n        try:\n            return fn()\n        except RateLimitError as e:\n            wait = (2 ** attempt) + random.uniform(0, 1)\n            retry_after = getattr(e, \"retry_after\", None)\n            time.sleep(retry_after or wait)</pre>"
                "<h3>Batch API workflow</h3>"
                "<ol>"
                "<li>Build JSONL: one request per line (<code>custom_id</code>, <code>method</code>, <code>url</code>, <code>body</code>)</li>"
                "<li>Upload file &rarr; create batch job &rarr; poll status</li>"
                "<li>Download results JSONL; map <code>custom_id</code> back to eval cases</li></ol>"
                "<p><strong>Multi-provider:</strong> abstract behind LiteLLM or a thin router; fallback gpt-4o &rarr; claude-sonnet on outage. Log which provider served each request.</p>"
                "<pre># LiteLLM router example\nimport litellm\n\nresp = litellm.completion(\n    model=\"gpt-4o-mini\",\n    messages=messages,\n    fallbacks=[\"claude-sonnet-4-20250514\", \"gpt-4o\"],\n    num_retries=3,\n    timeout=90,\n)</pre>"
                "<h3>Anthropic tool loop (content blocks)</h3>"
                "<pre>import anthropic\ncl = anthropic.Anthropic()\nresp = cl.messages.create(\n    model=\"claude-sonnet-4-20250514\",\n    max_tokens=1024,\n    tools=anthropic_tools,\n    messages=[{\"role\": \"user\", \"content\": \"Weather in NYC?\"}],\n)\n# Handle resp.content blocks: text vs tool_use vs tool_result</pre>"
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
                        (("td", "Cost"), ("td", "Log tokens &times; price table; mini model for routing; cache system prompts")),
                        (("td", "Rate limits"), ("td", "Per-tenant token bucket; queue overflow; Batch for offline")),
                        (("td", "Secrets"), ("td", "Vault / env; rotate keys; never client-side")),
                        (("td", "Timeouts"), ("td", "60&ndash;120s on completions; shorter on routing calls")),
                        (("td", "Observability"), ("td", "<a href=\"llm-observability.html\">LLM Observability</a> &mdash; trace_id on every call")),
                        (("td", "Safety"), ("td", "Content filters; output validation; <a href=\"../fundamentals/ai-safety-guardrails.html\">AI Safety</a>")),
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
                "<li><a href=\"langchain.html\">LangChain</a> &mdash; <code>ChatOpenAI</code> wraps chat completions</li>"
                "<li><a href=\"langgraph.html\">LangGraph</a> &mdash; LLM nodes call same API inside graph</li>"
                "<li><a href=\"../systems/chatbot-rag-system.html\">Chatbot RAG System</a> &mdash; embed + generate calls</li>"
                "<li><a href=\"../systems/rag-end-to-end.html\">RAG End-to-End</a> &mdash; retrieval + synthesis</li>"
                "<li><a href=\"embedding-models.html\">Embedding Models</a> &mdash; model choice and metrics</li>"
                "<li><a href=\"../fundamentals/prompt-engineering.html\">Prompt Engineering</a> &mdash; message and system prompt design</li>"
                "<li><a href=\"../fundamentals/cost-latency-tradeoffs.html\">Cost &amp; Latency Tradeoffs</a> &mdash; when to stream vs batch</li>"
                "</ul>"
            ),
        ),
        (
            "pitfalls",
            "11",
            "Common Pitfalls",
            card(
                "<ul>"
                "<li><strong>No retry on 429</strong> &mdash; thundering herd after rate limit clears</li>"
                "<li><strong>Trusting structured JSON blindly</strong> &mdash; always Pydantic-validate server-side</li>"
                "<li><strong>API keys in frontend</strong> &mdash; use backend proxy exclusively</li>"
                "<li><strong>Ignoring <code>finish_reason=length</code></strong> &mdash; truncated JSON or cut-off answers</li>"
                "<li><strong>Mixing Chat Completions with legacy Completion API</strong> &mdash; different message shapes</li>"
                "<li><strong>No timeout</strong> &mdash; hung connections block worker threads</li>"
                "<li><strong>Unbounded tool loop</strong> &mdash; cap iterations; detect repeated identical tool calls</li>"
                "<li><strong>Full history every call without trimming</strong> &mdash; context overflow and cost blow-up</li>"
                "</ul>"
            ),
        ),
    ],
    qa=[
        (
            "Chat Completions vs Assistants API?",
            "Chat Completions is stateless &mdash; you send full message history each call (or manage history yourself). Assistants/Threads store state server-side with built-in file search and code interpreter. Most production RAG/agents use Chat Completions + your own retrieval (<a href=\"vector-databases.html\">vector DB</a>) and <a href=\"langgraph.html\">LangGraph</a> for durable agent state.",
        ),
        (
            "How do you implement streaming to a web UI?",
            "OpenAI <code>stream=True</code> yields SSE chunks. Your FastAPI route returns <code>StreamingResponse</code> mapping <code>delta.content</code> to client events. Track <code>finish_reason</code>; on <code>tool_calls</code>, switch UI to tool-approval mode. Measure TTFT separately from total latency.",
        ),
        (
            "Explain the tool calling loop.",
            "1) Send messages + tool schemas. 2) If assistant message has <code>tool_calls</code>, validate and execute each function. 3) Append <code>tool</code> role messages with results and matching <code>tool_call_id</code>. 4) Call model again until no tool_calls. Cap at 5&ndash;10 iterations; log each round trip.",
        ),
        (
            "Structured output vs prompt-only JSON?",
            "Structured output (<code>json_schema</code> / Pydantic parse) constrains decoding &mdash; higher valid-json rate (~95%+ vs ~85% on complex schemas). Still validate with Pydantic server-side. Prompt-only &ldquo;return JSON&rdquo; fails more on nested schemas.",
        ),
        (
            "How handle rate limits (429)?",
            "Exponential backoff with jitter; honor <code>Retry-After</code> header; per-tenant token bucket; queue non-urgent requests; use Batch API for offline work; multi-key pool only if provider ToS allows.",
        ),
        (
            "OpenAI vs Anthropic message format differences?",
            "OpenAI: <code>system</code> as role or field; tool messages with <code>tool_call_id</code>. Anthropic: separate <code>system</code> param; content blocks array; <code>tool_use</code>/<code>tool_result</code> blocks. Abstract behind a thin adapter or LiteLLM for multi-provider apps.",
        ),
        (
            "When use Batch API?",
            "Nightly eval runs, bulk classification, embedding millions of chunks overnight. ~50% cost discount; up to 24h completion window. Not for user-facing chat latency requirements.",
        ),
        (
            "How log cost per request?",
            "Record <code>response.usage</code> (prompt_tokens, completion_tokens) &times; model price table. Attach user_id, feature, trace_id. Alert on anomalies; aggregate by team for chargeback.",
        ),
        (
            "Azure OpenAI vs OpenAI direct?",
            "Azure: enterprise VPC, private endpoints, regional deployment names, Microsoft billing. Same API shape with different <code>base_url</code> and <code>api-version</code> query param. Use for data residency requirements.",
        ),
        (
            "How prevent prompt injection via user content?",
            "Separate system from user; delimit untrusted docs with clear markers; output validation; tool allowlists; never execute model-generated code without sandbox. See <a href=\"../fundamentals/prompt-engineering.html\">Prompt Engineering</a> and <a href=\"../fundamentals/ai-safety-guardrails.html\">AI Safety</a>.",
        ),
        (
            "Embeddings: one string vs array input?",
            "Array input batches in one HTTP call &mdash; fewer round trips. Respect max tokens per request; chunk long texts before embed. Same embedding model at ingest and query.",
        ),
        (
            "SDE3: design LLM gateway for 50 microservices.",
            "Central proxy: mTLS auth, rate limits per service, model routing (cheap for classify, premium for generate), retry/fallback across providers, prompt registry with version tags, unified logging to <a href=\"llm-observability.html\">observability</a>, semantic cache for identical embed requests, budget caps and alerts per team. Stateless workers; no API keys in microservices &mdash; only gateway holds secrets.",
        ),
    ],
)

# Due to length, LANGCHAIN/CREWAI/LLAMAINDEX defined in part 2
exec(open(os.path.join(os.path.dirname(__file__), "generate_ai_tech_batch_a_p2.py")).read())

if __name__ == "__main__":
    for slug, cfg in BATCH_A_TOPICS.items():
        path = os.path.join(OUT, slug + ".html")
        with open(path, "w", encoding="utf-8") as f:
            f.write(page(**cfg))
        lines = open(path).read().count("\n") + 1
        print("Wrote %s (%d lines)" % (path, lines))
