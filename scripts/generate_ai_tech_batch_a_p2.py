# Part 2: langchain, crewai, llamaindex expanded topics for generate_ai_tech_batch_a.py

LANGCHAIN = dict(
    title="LangChain",
    nav="LangChain",
    hero="Composable LLM framework: runnables (LCEL pipe), prompts, retrievers, tools, memory, and callbacks. The component layer most orchestrators (LangGraph, LlamaIndex integrations) build on.",
    tags=[
        ("LCEL", ""),
        ("Runnable", " orange"),
        ("Retrievers", " green"),
        ("Tools", " pink"),
        ("Callbacks", " purple"),
    ],
    main_img="langchain-main.png",
    main_cap="LangChain stack: Prompt | ChatModel | OutputParser as LCEL chain; retriever feeds context from <a href=\"vector-databases.html\">vector DB</a>; tools bound via <code>bind_tools</code>; callbacks &rarr; LangSmith traces.",
    nav_items=[
        ("01", "what", "What &amp; Why"),
        ("01a", "concepts", "Core Concepts"),
        ("01b", "api", "API Surface"),
        ("02", "when", "When to Use"),
        ("03", "architecture", "Architecture"),
        ("04", "lcel", "LCEL"),
        ("05", "retrievers", "Retrievers"),
        ("06", "tools", "Tools"),
        ("07", "memory", "Memory"),
        ("08", "callbacks", "Callbacks"),
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
                "<p><strong>Problem:</strong> LLM apps repeat the same glue: prompt templates, model wrappers, output parsers, retriever wiring, tool schemas, and tracing hooks. LangChain standardizes these as composable <code>Runnable</code> objects.</p>"
                "<h3>Functional</h3><ul>"
                "<li>Compose prompts, models, parsers with LCEL pipe operator</li>"
                "<li>Integrate vector stores as retrievers for RAG pipelines</li>"
                "<li>Bind tools to chat models; feed into LangGraph ToolNode</li>"
                "<li>Stream, batch, and async invoke uniformly across steps</li></ul>"
                "<h3>Non-Functional</h3><ul>"
                "<li><strong>Modularity</strong> &mdash; swap OpenAI for Anthropic by changing one Runnable</li>"
                "<li><strong>Observability</strong> &mdash; callbacks + LangSmith tracing</li>"
                "<li><strong>Maintainability</strong> &mdash; explicit chains beat opaque agent helpers</li>"
                "<li><strong>Version risk</strong> &mdash; pin packages; test on upgrade</li></ul>"
                "<blockquote><strong>Position in stack:</strong> LangChain = components. <a href=\"langgraph.html\">LangGraph</a> = orchestration with cycles and checkpointing. <a href=\"llamaindex.html\">LlamaIndex</a> overlaps on RAG indexing. API layer: <a href=\"openai-api-patterns.html\">OpenAI API Patterns</a>.</blockquote>"
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
                            ("td", "<strong>Runnable</strong>"),
                            ("td", "Unit with invoke/stream/batch/async variants"),
                            ("td", "Nearly everything in LC is a Runnable"),
                        ),
                        (
                            ("td", "<strong>LCEL</strong>"),
                            ("td", "LangChain Expression Language: <code>a | b | c</code>"),
                            ("td", "DAG only &mdash; no cycles (use LangGraph for loops)"),
                        ),
                        (
                            ("td", "<strong>Retriever</strong>"),
                            ("td", "<code>invoke(query) &rarr; documents</code> Runnable"),
                            ("td", "Wraps VectorStore; adds MMR, compression, multi-query"),
                        ),
                        (
                            ("td", "<strong>VectorStore</strong>"),
                            ("td", "Storage + similarity_search API"),
                            ("td", "Chroma, Pinecone, pgvector integrations"),
                        ),
                        (
                            ("td", "<strong>Tool</strong>"),
                            ("td", "<code>@tool</code> decorated function + JSON schema"),
                            ("td", "Description text strongly affects routing"),
                        ),
                        (
                            ("td", "<strong>Callback</strong>"),
                            ("td", "Hooks on chain/LLM/tool lifecycle events"),
                            ("td", "LangSmith auto-registers when configured"),
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
                "<pre>from langchain_openai import ChatOpenAI\nfrom langchain_core.prompts import ChatPromptTemplate\nfrom langchain_core.output_parsers import StrOutputParser\nfrom langchain_core.runnables import RunnablePassthrough\n\nprompt = ChatPromptTemplate.from_messages([\n    (\"system\", \"Answer only from context:\\n{context}\"),\n    (\"human\", \"{question}\"),\n])\nllm = ChatOpenAI(model=\"gpt-4o-mini\", temperature=0)\n\nchain = prompt | llm | StrOutputParser()\n\n# RAG-style input wiring\nrag_chain = {\n    \"context\": retriever | format_docs,\n    \"question\": RunnablePassthrough(),\n} | chain\n\nanswer = rag_chain.invoke(\"What is our refund policy?\")</pre>"
                + tbl(
                    [
                        (("th", "Method"), ("th", "Purpose")),
                        (("td", "<code>invoke(input)</code>"), ("td", "Sync single run")),
                        (("td", "<code>ainvoke(input)</code>"), ("td", "Async for FastAPI")),
                        (("td", "<code>stream(input)</code>"), ("td", "Partial outputs per step")),
                        (("td", "<code>batch([...])</code>"), ("td", "Parallel batch where supported")),
                        (("td", "<code>with_config(tags=[...])</code>"), ("td", "Trace metadata for LangSmith")),
                    ]
                )
                + "<h3>Runnable interface cheat sheet</h3>"
                + tbl(
                    [
                        (("th", "Input type"), ("th", "Example chain"), ("th", "Output")),
                        (("td", "dict"), ("td", "RAG chain with context + question keys"), ("td", "str or dict")),
                        (("td", "str"), ("td", "prompt | llm | StrOutputParser()"), ("td", "str")),
                        (("td", "Message list"), ("td", "ChatModel only"), ("td", "AIMessage")),
                        (("td", "Documents"), ("td", "retriever | format_docs"), ("td", "str context block")),
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
                        (("th", "Case"), ("th", "LangChain?"), ("th", "Alternative")),
                        (
                            ("td", "Simple RAG chain (retrieve &rarr; generate)"),
                            ("td", "<strong>Yes</strong>"),
                            ("td", "<a href=\"llamaindex.html\">LlamaIndex</a> QueryEngine"),
                        ),
                        (
                            ("td", "ReAct agent with tool loop"),
                            ("td", "<strong>Maybe</strong>"),
                            ("td", "<a href=\"langgraph.html\">LangGraph</a> for control + HITL"),
                        ),
                        (
                            ("td", "Role-based multi-agent crew"),
                            ("td", "<strong>Maybe</strong>"),
                            ("td", "<a href=\"crewai.html\">CrewAI</a>"),
                        ),
                        (
                            ("td", "One-shot completion, no retrieval"),
                            ("td", "<strong>Maybe</strong>"),
                            ("td", "<a href=\"openai-api-patterns.html\">Direct API</a> simpler"),
                        ),
                        (
                            ("td", "Complex ingestion + citations"),
                            ("td", "<strong>Maybe</strong>"),
                            ("td", "LlamaIndex indexing focus"),
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
                "<pre>User Query\n    |\n    +---> Retriever -----> format_docs --+\n    |         (Vector DB)                 |\n    +---> RunnablePassthrough (question) -+--> Prompt Template\n                                              |\n                                              v\n                                         ChatModel (OpenAI)\n                                              |\n                                              v\n                                         OutputParser --> Answer</pre>"
                "<pre>Package map (2025):\n  langchain-core    Runnable, LCEL, prompts, parsers\n  langchain-openai  ChatOpenAI, OpenAIEmbeddings\n  langchain-chroma  Chroma vector store integration\n  langgraph         Stateful graphs (separate package)\n  langsmith         Tracing UI (SaaS)</pre>"
                + flow(
                    (
                        "1",
                        "Ingest (offline)",
                        "Load docs &rarr; chunk &rarr; embed &rarr; VectorStore. See <a href=\"../systems/document-ingestion.html\">Document Ingestion</a>.",
                    ),
                    (
                        "2",
                        "Retrieve",
                        "Retriever returns top-k chunks; optional reranker (<a href=\"rerankers.html\">Rerankers</a>).",
                    ),
                    (
                        "3",
                        "Generate",
                        "Prompt + LLM + parser; stream if needed.",
                    ),
                    (
                        "4",
                        "Observe",
                        "Callbacks &rarr; LangSmith; log latency and token usage.",
                    ),
                ),
                hl=True,
            ),
        ),
        (
            "lcel",
            "04",
            "Deep Dive: LCEL",
            diag(
                "langchain",
                "lcel-zoom",
                "LCEL pipe: prompt | model | parser with parallel RunnableParallel branches for context and question.",
            )
            + card(
                "<p>LCEL composes Runnables with <code>|</code>. Each step&rsquo;s output becomes the next step&rsquo;s input (with dict merging for parallel branches).</p>"
                "<pre>from langchain_core.runnables import RunnableParallel, RunnableLambda\n\nchain = RunnableParallel(\n    context=retriever | format_docs,\n    question=RunnablePassthrough(),\n) | prompt | llm | StrOutputParser()\n\n# Fallbacks and retries\nrobust_llm = ChatOpenAI(model=\"gpt-4o-mini\").with_fallbacks([\n    ChatOpenAI(model=\"gpt-4o\"),\n])\nchain_with_retry = prompt | robust_llm.with_retry(stop_after_attempt=3) | parser</pre>"
                "<ul>"
                "<li><code>RunnableLambda</code> for custom Python transforms</li>"
                "<li><code>astream_events</code> for fine-grained token streaming in UI</li>"
                "<li>LCEL chains are DAGs &mdash; agent loops need <a href=\"langgraph.html\">LangGraph</a></li></ul>"
            )
            + card(
                "<h3>Full RAG chain (copy-paste starter)</h3>"
                "<pre>from langchain_openai import ChatOpenAI, OpenAIEmbeddings\nfrom langchain_chroma import Chroma\nfrom langchain_core.prompts import ChatPromptTemplate\nfrom langchain_core.output_parsers import StrOutputParser\nfrom langchain_core.runnables import RunnablePassthrough\nfrom langchain_text_splitters import RecursiveCharacterTextSplitter\n\ndef format_docs(docs):\n    return \"\\n\\n\".join(d.page_content for d in docs)\n\nsplitter = RecursiveCharacterTextSplitter(chunk_size=512, chunk_overlap=50)\nchunks = splitter.split_documents(raw_docs)\n\nvectorstore = Chroma.from_documents(\n    chunks, OpenAIEmbeddings(model=\"text-embedding-3-small\"))\nretriever = vectorstore.as_retriever(search_kwargs={\"k\": 12})\n\nprompt = ChatPromptTemplate.from_messages([\n    (\"system\", \"Answer from context only. Cite sources.\\n{context}\"),\n    (\"human\", \"{question}\"),\n])\nchain = (\n    {\"context\": retriever | format_docs, \"question\": RunnablePassthrough()}\n    | prompt | ChatOpenAI(model=\"gpt-4o-mini\") | StrOutputParser()\n)\nprint(chain.invoke(\"Refund policy for EU?\"))</pre>"
                "<p>Swap Chroma for <a href=\"vector-databases.html\">Pinecone/pgvector</a> in production. Add <a href=\"rerankers.html\">reranker</a> between retriever and prompt for better precision.</p>",
                hl=True,
            ),
        ),
        (
            "retrievers",
            "05",
            "Deep Dive: Retrievers",
            card(
                "<pre>from langchain_chroma import Chroma\nfrom langchain_openai import OpenAIEmbeddings\n\nvectorstore = Chroma.from_documents(\n    documents=chunks,\n    embedding=OpenAIEmbeddings(model=\"text-embedding-3-small\"),\n    collection_name=\"kb_v1\",\n)\nretriever = vectorstore.as_retriever(\n    search_type=\"mmr\",\n    search_kwargs={\"k\": 20, \"fetch_k\": 50},\n)</pre>"
                "<h3>Retriever wrappers</h3><ul>"
                "<li><strong>MultiQueryRetriever</strong> &mdash; LLM expands query variants; improves recall</li>"
                "<li><strong>ContextualCompressionRetriever</strong> &mdash; rerank/filter chunks before prompt</li>"
                "<li><strong>EnsembleRetriever</strong> &mdash; BM25 + vector fusion</li></ul>"
                "<p>Production: external <a href=\"vector-databases.html\">vector DB</a> (Pinecone, pgvector), not in-process Chroma. Hybrid patterns: <a href=\"../systems/hybrid-search.html\">Hybrid Search</a>.</p>"
                "<pre>from langchain.retrievers import EnsembleRetriever\nfrom langchain_community.retrievers import BM25Retriever\n\nbm25 = BM25Retriever.from_documents(chunks)\nbm25.k = 20\nvector_retriever = vectorstore.as_retriever(search_kwargs={\"k\": 20})\n\nhybrid = EnsembleRetriever(\n    retrievers=[bm25, vector_retriever],\n    weights=[0.4, 0.6],\n)\n# Retrieve 20-30 candidates -> cross-encoder rerank -> top 5 to prompt</pre>"
            ),
        ),
        (
            "tools",
            "06",
            "Deep Dive: Tools",
            diag(
                "langchain",
                "tools-zoom",
                "bind_tools on ChatModel: model emits tool_calls, ToolNode executes, results fed back until END.",
            )
            + card(
                "<pre>from langchain_core.tools import tool\n\n@tool\ndef search_kb(query: str) -> str:\n    \"\"\"Search internal knowledge base.\"\"\"\n    return kb.search(query)\n\nllm_with_tools = ChatOpenAI(model=\"gpt-4o-mini\").bind_tools([search_kb])\n\n# In LangGraph:\nfrom langgraph.prebuilt import ToolNode\ntool_node = ToolNode([search_kb])</pre>"
                "<p>Tool descriptions are part of the prompt the model sees &mdash; write them like API docs. Validate args before side effects. See <a href=\"../systems/tool-calling-functions.html\">Tool Calling &amp; Functions</a>.</p>"
            ),
        ),
        (
            "memory",
            "07",
            "Deep Dive: Memory",
            card(
                "<p>Legacy: <code>ConversationBufferWindowMemory</code>, <code>ChatMessageHistory</code>. Production pattern: <strong>don&rsquo;t use in-process memory</strong> in serverless or multi-worker APIs.</p>"
                "<pre># Production: external session store\nhistory = load_messages_from_postgres(session_id)\nchain.invoke(\n    {\"question\": q, \"chat_history\": history},\n    config={\"configurable\": {\"session_id\": session_id}},\n)</pre>"
                "<ul>"
                "<li>Pass message list explicitly in invoke input or LangGraph state</li>"
                "<li>Trim history to last N turns or token budget (<a href=\"../fundamentals/context-window-kv-cache.html\">Context Window</a>)</li>"
                "<li>Agent memory patterns: <a href=\"../systems/agent-memory.html\">Agent Memory</a></li></ul>"
            ),
        ),
        (
            "callbacks",
            "08",
            "Deep Dive: Callbacks",
            card(
                "<pre># LangSmith (set env vars)\n# LANGCHAIN_TRACING_V2=true\n# LANGCHAIN_API_KEY=...\n# LANGCHAIN_PROJECT=prod-rag\n\nchain.invoke(input, config={\"tags\": [\"prod\", \"rag-v2\"], \"metadata\": {\"tenant\": \"acme\"}})</pre>"
                "<p>Custom <code>BaseCallbackHandler</code> for token counts, latency histograms, and PII redaction in logs. Integrates with <a href=\"llm-observability.html\">LLM Observability</a> stacks.</p>"
                "<pre>from langchain_core.callbacks import BaseCallbackHandler\nimport time\n\nclass MetricsHandler(BaseCallbackHandler):\n    def __init__(self):\n        self.start = None\n    def on_llm_start(self, serialized, prompts, **kwargs):\n        self.start = time.time()\n    def on_llm_end(self, response, **kwargs):\n        latency_ms = (time.time() - self.start) * 1000\n        usage = response.llm_output.get(\"token_usage\", {})\n        log_metric(\"llm.latency_ms\", latency_ms, usage)\n\nchain.invoke(input, config={\"callbacks\": [MetricsHandler()]})</pre>"
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
                        (("td", "Versions"), ("td", "Pin langchain-core, langchain-openai; CI golden tests")),
                        (("td", "Agents"), ("td", "Explicit LangGraph graphs over magic agents")),
                        (("td", "Eval"), ("td", "LangSmith datasets; regression on prompt changes")),
                        (("td", "Secrets"), ("td", "Env vars; never commit API keys")),
                        (("td", "Performance"), ("td", "Async ainvoke; batch embed separately")),
                        (("td", "Package layout"), ("td", "<code>langchain-core</code> (runnables), <code>langchain-openai</code>, integration packages per vector DB")),
                        (("td", "Deprecation"), ("td", "Avoid LLMChain, ConversationChain; use LCEL")),
                    ]
                )
                + "<h3>Upgrade checklist</h3><ol>"
                "<li>Run golden prompt eval before/after bump</li>"
                "<li>Check import path changes in changelog</li>"
                "<li>Verify async paths still use ainvoke</li>"
                "<li>Re-run LangSmith comparison on sample production traces</li></ol>"
            ),
        ),
        (
            "where",
            "10",
            "Where It Shows Up",
            card(
                "<ul>"
                "<li><a href=\"langgraph.html\">LangGraph</a> &mdash; nodes call LC runnables and ToolNode</li>"
                "<li><a href=\"llamaindex.html\">LlamaIndex</a> &mdash; overlapping RAG scope; can interop</li>"
                "<li><a href=\"crewai.html\">CrewAI</a> &mdash; uses LangChain LLM/tool wrappers</li>"
                "<li><a href=\"../systems/rag-end-to-end.html\">RAG End-to-End</a> &mdash; reference architecture</li>"
                "<li><a href=\"../systems/chatbot-rag-system.html\">Chatbot RAG System</a> &mdash; production chat patterns</li>"
                "<li><a href=\"openai-api-patterns.html\">OpenAI API Patterns</a> &mdash; underlying chat API</li>"
                "<li><a href=\"../fundamentals/prompt-engineering.html\">Prompt Engineering</a> &mdash; template design</li>"
                "<li><a href=\"../fundamentals/embeddings-semantic-search.html\">Embeddings &amp; Semantic Search</a> &mdash; retriever theory</li>"
                "<li><a href=\"../systems/eval-harness.html\">Eval Harness</a> &mdash; regression on chain changes</li>"
                "</ul>"
            ),
        ),
        (
            "pitfalls",
            "11",
            "Common Pitfalls",
            card(
                "<ul>"
                "<li><strong><code>create_react_agent</code> black box</strong> &mdash; hard to debug loops; use LangGraph</li>"
                "<li><strong>Deprecated APIs in old tutorials</strong> &mdash; LLMChain, old import paths</li>"
                "<li><strong>Memory in serverless</strong> &mdash; lost between requests; use external store</li>"
                "<li><strong>Retriever k too small</strong> &mdash; recall suffers before reranker sees candidates</li>"
                "<li><strong>No fallbacks</strong> &mdash; single model failure takes down feature</li>"
                "<li><strong>Mixing sync invoke in async FastAPI</strong> &mdash; blocks event loop; use ainvoke</li>"
                "</ul>"
            )
            + card(
                "<h3>LangChain vs alternatives (decision matrix)</h3>"
                + tbl(
                    [
                        (("th", "Need"), ("th", "Pick")),
                        (("td", "DAG RAG chain"), ("td", "LangChain LCEL")),
                        (("td", "Citation-first indexing"), ("td", "<a href=\"llamaindex.html\">LlamaIndex</a>")),
                        (("td", "Agent loop + HITL"), ("td", "<a href=\"langgraph.html\">LangGraph</a>")),
                        (("td", "Role-based crew demo"), ("td", "<a href=\"crewai.html\">CrewAI</a>")),
                        (("td", "Minimal deps"), ("td", "<a href=\"openai-api-patterns.html\">Direct API</a>")),
                    ]
                ),
            ),
        ),
    ],
    qa=[
        (
            "What is LCEL?",
            "LangChain Expression Language: compose Runnables with the <code>|</code> operator. Example: <code>prompt | model | parser</code>. Supports sync/async/stream/batch uniformly across all steps. Parallel branches via <code>RunnableParallel</code>.",
        ),
        (
            "LangChain vs LangGraph?",
            "LangChain = components and DAG-shaped chains. LangGraph = stateful graph with cycles, checkpointing, HITL interrupts. Use both: LC models/tools inside LangGraph nodes. See <a href=\"langgraph.html\">LangGraph</a> sheet.",
        ),
        (
            "How wire a vector DB retriever?",
            "<code>VectorStore.from_documents</code> + <code>as_retriever(search_kwargs={\"k\": 20})</code>. In chain: <code>{\"context\": retriever | format_docs, \"question\": RunnablePassthrough()}</code>. Backing store: <a href=\"vector-databases.html\">Vector Databases</a>.",
        ),
        (
            "What are callbacks for?",
            "Hooks on chain start/end, LLM start/end, tool invocations. LangSmith uses them for tracing; custom handlers for metrics and cost logging.",
        ),
        (
            "Is LangChain still relevant in 2025?",
            "Yes as a component library (<code>langchain-core</code>, integrations). Less as opaque end-to-end agents. Teams combine lc-core + langgraph + direct API where simpler.",
        ),
        (
            "How handle streaming in LCEL?",
            "<code>chain.stream(input)</code> yields partial dicts per step. For token-level stream use <code>astream_events</code> v2 API filtering on chat model events.",
        ),
        (
            "Retriever vs VectorStore?",
            "VectorStore = storage + <code>similarity_search</code>. Retriever = Runnable interface for chains, with wrappers (MMR, multi-query, compression). Always use retriever in LCEL chains.",
        ),
        (
            "Tool binding best practice?",
            "Clear descriptions, minimal parameters, validate args before side effects. <code>bind_tools</code> on model; execute in controlled ToolNode or custom executor with allowlists.",
        ),
        (
            "Memory in production?",
            "External store (Redis/Postgres) keyed by session_id; pass messages in state &mdash; not ConversationChain in-memory. Trim to token budget.",
        ),
        (
            "Version churn risk?",
            "Pin langchain-core, langchain-openai; integration tests on golden prompts; avoid deprecated chains; read migration guides on upgrade.",
        ),
        (
            "LangChain vs LlamaIndex?",
            "LangChain: general orchestration + tools + broad integrations. LlamaIndex: indexing, query engines, citation-first RAG. Overlap on RAG; many teams use LI for ingest/query + LC/LangGraph for agent layer.",
        ),
        (
            "SDE3: standardize LangChain across 10 teams?",
            "Internal template repo: LCEL RAG chain, LangGraph agent skeleton, shared retriever factory pointing to central <a href=\"vector-databases.html\">vector DB</a>, LangSmith project per env, banned patterns list (deprecated agents, in-process memory), golden eval suite in CI, and documented upgrade playbook.",
        ),
    ],
)

CREWAI = dict(
    title="CrewAI",
    nav="CrewAI",
    hero="Role-based multi-agent framework: Agents with backstory, Tasks with expected output, Crew orchestration (sequential, hierarchical). Fast path from idea to research-style agent teams.",
    tags=[
        ("Agents", ""),
        ("Tasks", " orange"),
        ("Crew", " green"),
        ("Hierarchical", " pink"),
        ("Delegation", " purple"),
    ],
    main_img="crewai-main.png",
    main_cap="CrewAI flow: define Agents (role, goal, tools) &rarr; Tasks (description, agent, context) &rarr; Crew(process=sequential|hierarchical) &rarr; kickoff() &rarr; consolidated output.",
    nav_items=[
        ("01", "what", "What &amp; Why"),
        ("01a", "concepts", "Core Concepts"),
        ("01b", "api", "API Surface"),
        ("02", "when", "When to Use"),
        ("03", "architecture", "Architecture"),
        ("04", "agents", "Agents"),
        ("05", "tasks", "Tasks"),
        ("06", "process", "Process Types"),
        ("07", "tools", "Tools"),
        ("08", "vsgraph", "vs LangGraph"),
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
                "<p><strong>Problem:</strong> Multi-step workflows (research &rarr; analyze &rarr; write) map naturally to <em>roles</em>, but hand-rolling LangGraph nodes for every demo is slow. CrewAI offers declarative Agents, Tasks, and Crew processes.</p>"
                "<h3>Functional</h3><ul>"
                "<li>Define agents with role, goal, backstory, and tool subsets</li>"
                "<li>Chain tasks with explicit dependencies via <code>context=[prior_task]</code></li>"
                "<li>Sequential or hierarchical (manager delegates) execution</li>"
                "<li><code>kickoff(inputs={...})</code> runs full workflow and returns consolidated output</li></ul>"
                "<h3>Non-Functional</h3><ul>"
                "<li><strong>Cost</strong> &mdash; multiple LLM calls per crew run; cap tasks and delegation</li>"
                "<li><strong>Control</strong> &mdash; less fine-grained than LangGraph for HITL and audit</li>"
                "<li><strong>Speed to prototype</strong> &mdash; excellent for research/report pipelines</li></ul>"
                "<blockquote>Production systems needing approval gates often migrate to <a href=\"langgraph.html\">LangGraph</a>. CrewAI sits above <a href=\"openai-api-patterns.html\">LLM APIs</a> and often uses <a href=\"langchain.html\">LangChain</a> tool wrappers. Multi-agent patterns: <a href=\"../systems/multi-agent-orchestration.html\">Multi-Agent Orchestration</a>.</blockquote>"
            )
            + card(
                "<h3>When crews beat single agents</h3>"
                "<ul>"
                "<li>Output requires distinct <em>expert personas</em> (legal vs technical vs executive tone)</li>"
                "<li>Pipeline has 3+ stages with different tool sets per stage</li>"
                "<li>Research tasks benefit from verbose backstory-driven thoroughness</li>"
                "<li>You need a demo in hours, not days of graph engineering</li></ul>"
                "<h3>When to skip CrewAI</h3>"
                "<ul>"
                "<li>Single retrieval + answer (use LCEL or <a href=\"llamaindex.html\">LlamaIndex</a>)</li>"
                "<li>Hard compliance gates on each tool call (use LangGraph HITL)</li>"
                "<li>Sub-100ms routing (no LLM orchestrator)</li></ul>",
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
                            ("td", "<strong>Agent</strong>"),
                            ("td", "role + goal + backstory + tools + LLM"),
                            ("td", "Backstory strongly shapes tone and thoroughness"),
                        ),
                        (
                            ("td", "<strong>Task</strong>"),
                            ("td", "description + expected_output + assigned agent"),
                            ("td", "<code>context=[task1]</code> injects prior task output"),
                        ),
                        (
                            ("td", "<strong>Crew</strong>"),
                            ("td", "agents + tasks + process + optional manager"),
                            ("td", "<code>kickoff()</code> is synchronous by default"),
                        ),
                        (
                            ("td", "<strong>Process</strong>"),
                            ("td", "sequential | hierarchical | consensual"),
                            ("td", "Hierarchical requires <code>manager_llm</code>"),
                        ),
                        (
                            ("td", "<strong>Delegation</strong>"),
                            ("td", "Agent asks another agent for help"),
                            ("td", "<code>allow_delegation=True</code> increases cost unpredictably"),
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
                "<pre>from crewai import Agent, Task, Crew, Process\nfrom crewai.tools import tool\n\n@tool\ndef web_search(query: str) -> str:\n    \"\"\"Search the web for current information.\"\"\"\n    return search_api(query)\n\nresearcher = Agent(\n    role=\"Senior Researcher\",\n    goal=\"Find accurate, cited facts on {topic}\",\n    backstory=\"You are a meticulous analyst who verifies sources.\",\n    tools=[web_search],\n    verbose=True,\n)\nwriter = Agent(\n    role=\"Technical Writer\",\n    goal=\"Produce clear markdown reports\",\n    backstory=\"You translate research into executive summaries.\",\n)\n\nt1 = Task(\n    description=\"Research {topic}. Include 5+ bullet facts.\",\n    expected_output=\"Bullet list of verified facts with sources\",\n    agent=researcher,\n)\nt2 = Task(\n    description=\"Write a 500-word report from research.\",\n    expected_output=\"Markdown report with headings\",\n    agent=writer,\n    context=[t1],\n)\n\ncrew = Crew(\n    agents=[researcher, writer],\n    tasks=[t1, t2],\n    process=Process.sequential,\n    verbose=True,\n)\nresult = crew.kickoff(inputs={\"topic\": \"RAG trends 2025\"})\nprint(result.raw)</pre>"
                + "<h3>Crew configuration knobs</h3>"
                + tbl(
                    [
                        (("th", "Parameter"), ("th", "Effect")),
                        (("td", "<code>verbose=True</code>"), ("td", "Print intermediate agent reasoning to stdout")),
                        (("td", "<code>memory=True</code>"), ("td", "Short-term memory within kickoff (not cross-session)")),
                        (("td", "<code>max_rpm</code>"), ("td", "Rate limit LLM requests per minute")),
                        (("td", "<code>share_crew</code>"), ("td", "Allow agents to see each other's task context")),
                        (("td", "<code>planning=True</code>"), ("td", "Optional planner step before tasks (extra LLM call)")),
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
                        (("th", "Case"), ("th", "CrewAI?"), ("th", "Alternative")),
                        (
                            ("td", "Research report crew (3&ndash;5 roles)"),
                            ("td", "<strong>Yes</strong>"),
                            ("td", "Manual LangGraph subgraphs"),
                        ),
                        (
                            ("td", "Content pipeline prototype"),
                            ("td", "<strong>Yes</strong>"),
                            ("td", "Custom scripts"),
                        ),
                        (
                            ("td", "Production support bot with HITL"),
                            ("td", "<strong>No</strong>"),
                            ("td", "<a href=\"langgraph.html\">LangGraph</a> + interrupts"),
                        ),
                        (
                            ("td", "Single tool-calling agent"),
                            ("td", "<strong>No</strong>"),
                            ("td", "One ReAct agent sufficient"),
                        ),
                        (
                            ("td", "Strict per-step audit trail"),
                            ("td", "<strong>Maybe</strong>"),
                            ("td", "LangGraph checkpoint history"),
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
                "<pre>Inputs (topic, params)\n        |\n        v\n   +---------+\n   |  Crew   |\n   +----+----+\n        |\n   +----+----+----+----+\n   v    v    v    v\n Task1 Task2 Task3 ...  (each bound to one Agent)\n   |      |\n   v      v\n Agent A  Agent B  (LLM + tools + backstory)\n        |\n        v\n  Consolidated Output (result.raw)</pre>"
                "<pre>Cost model (typical research crew):\n  Task 1 (research + search tool)  ~ 3-8 LLM calls\n  Task 2 (analysis)                ~ 2-4 LLM calls\n  Task 3 (writing)                 ~ 2-3 LLM calls\n  Hierarchical manager overhead    ~ 1-2 LLM calls per task\n  Total                            ~ 10-20 LLM calls per kickoff()</pre>"
                + flow(
                    (
                        "1",
                        "Define agents",
                        "Role, goal, backstory, tools per persona.",
                    ),
                    (
                        "2",
                        "Define tasks",
                        "Description, expected_output, agent, context deps.",
                    ),
                    (
                        "3",
                        "Assemble crew",
                        "Pick Process.sequential or hierarchical + manager_llm.",
                    ),
                    (
                        "4",
                        "kickoff",
                        "Run all tasks; collect final output; log per-task traces.",
                    ),
                ),
                hl=True,
            ),
        ),
        (
            "agents",
            "04",
            "Deep Dive: Agents",
            diag(
                "crewai",
                "agents-zoom",
                "Agent cards: role, goal, backstory, tools, allow_delegation flag.",
            )
            + card(
                "<p>Each agent is an LLM persona with optional tools. <strong>Backstory</strong> acts as a soft system prompt &mdash; invest time writing it.</p>"
                "<ul>"
                "<li>Assign <strong>least-privilege tools</strong> per agent (researcher gets search, writer gets none)</li>"
                "<li><code>allow_delegation=True</code> lets agent spawn sub-requests to peers &mdash; use sparingly</li>"
                "<li><code>max_iter</code> / RPM limits on underlying LLM to cap runaway loops</li>"
                "<li>Local models via OpenAI-compatible endpoint (<a href=\"model-serving-vllm.html\">vLLM</a>)</li></ul>"
                + tbl(
                    [
                        (("th", "Agent field"), ("th", "Purpose"), ("th", "Tip")),
                        (("td", "role"), ("td", "Short job title for the agent"), ("td", "Shown in logs and traces")),
                        (("td", "goal"), ("td", "Measurable objective"), ("td", "Can include {input} placeholders")),
                        (("td", "backstory"), ("td", "Persona and constraints"), ("td", "Strongest behavior lever")),
                        (("td", "tools"), ("td", "Allowed capabilities"), ("td", "Least privilege per agent")),
                        (("td", "allow_delegation"), ("td", "Can ask peer agents"), ("td", "Default False in prod")),
                    ]
                )
            ),
        ),
        (
            "tasks",
            "05",
            "Deep Dive: Tasks",
            card(
                "<p><code>expected_output</code> acts as an implicit rubric the agent optimizes toward &mdash; always specify format and length.</p>"
                "<pre>t_research = Task(\n    description=\"Research {product}. Focus on pricing and competitors.\",\n    expected_output=\"JSON: {facts: [], sources: []}\",\n    agent=researcher,\n)\nt_write = Task(\n    description=\"Draft blog post from research.\",\n    expected_output=\"800-word markdown with H2 sections\",\n    agent=writer,\n    context=[t_research],  # prior output injected\n    async_execution=False,\n)</pre>"
                "<ul>"
                "<li><code>async_execution=True</code> on independent tasks for parallelism</li>"
                "<li>Output of context tasks appended to prompt automatically</li>"
                "<li>Use structured expected_output (JSON schema description) for downstream parsing</li></ul>"
            ),
        ),
        (
            "process",
            "06",
            "Deep Dive: Process Types",
            diag(
                "crewai",
                "process-zoom",
                "Sequential vs hierarchical: manager agent routes tasks to researcher and writer.",
            )
            + card(
                "<h3>Sequential</h3><p>Tasks run in list order. Predictable, easy to debug. Default for pipelines.</p>"
                "<h3>Hierarchical</h3><p>Manager LLM delegates tasks to worker agents dynamically. More flexible, less predictable, higher cost.</p>"
                "<pre>crew = Crew(\n    agents=[researcher, writer, editor],\n    tasks=[t1, t2, t3],\n    process=Process.hierarchical,\n    manager_llm=ChatOpenAI(model=\"gpt-4o-mini\"),\n)</pre>"
                "<blockquote>Cap total tasks at 5&ndash;8 for cost control. Log manager decisions for post-hoc debugging.</blockquote>"
            )
            + card(
                "<h3>Full hierarchical crew example</h3>"
                "<pre>from crewai import Agent, Task, Crew, Process\nfrom langchain_openai import ChatOpenAI\n\nmanager_llm = ChatOpenAI(model=\"gpt-4o-mini\", temperature=0)\n\nresearcher = Agent(role=\"Researcher\", goal=\"Gather facts\", backstory=\"Thorough analyst.\", tools=[search_tool])\nanalyst = Agent(role=\"Analyst\", goal=\"Synthesize insights\", backstory=\"Pattern finder.\")\nwriter = Agent(role=\"Writer\", goal=\"Draft report\", backstory=\"Clear technical writer.\")\n\nt_research = Task(description=\"Research {topic}\", expected_output=\"10 bullet facts\", agent=researcher)\nt_analysis = Task(description=\"Identify 3 themes\", expected_output=\"Theme list + rationale\", agent=analyst, context=[t_research])\nt_draft = Task(description=\"Write executive summary\", expected_output=\"400-word markdown\", agent=writer, context=[t_analysis])\n\ncrew = Crew(\n    agents=[researcher, analyst, writer],\n    tasks=[t_research, t_analysis, t_draft],\n    process=Process.hierarchical,\n    manager_llm=manager_llm,\n    verbose=True,\n)\nprint(crew.kickoff(inputs={\"topic\": \"enterprise RAG\"}).raw)</pre>",
                hl=True,
            ),
        ),
        (
            "tools",
            "07",
            "Deep Dive: Tools",
            card(
                "<p>CrewAI tools wrap LangChain tools or custom functions with descriptions. Same security model as any agent framework.</p>"
                "<ul>"
                "<li>Validate JSON args before API calls or SQL</li>"
                "<li>Read-only tools by default; HITL on writes (publish, delete, charge)</li>"
                "<li>RAG tool can wrap <a href=\"llamaindex.html\">LlamaIndex</a> query engine or <a href=\"langchain.html\">LangChain</a> retriever</li></ul>"
                "<p>Deep dive: <a href=\"../systems/tool-calling-functions.html\">Tool Calling &amp; Functions</a>.</p>"
            ),
        ),
        (
            "vsgraph",
            "08",
            "CrewAI vs LangGraph",
            card(
                tbl(
                    [
                        (("th", "Dimension"), ("th", "CrewAI"), ("th", "LangGraph")),
                        (("td", "Abstraction"), ("td", "High &mdash; roles/tasks"), ("td", "Low &mdash; nodes/edges/state")),
                        (("td", "HITL"), ("td", "Limited"), ("td", "<code>interrupt_before</code> + Command")),
                        (("td", "Checkpoint"), ("td", "Basic"), ("td", "Postgres durable per thread")),
                        (("td", "Routing"), ("td", "Process enum + manager"), ("td", "Conditional edges in code")),
                        (("td", "Best for"), ("td", "Research crews, demos"), ("td", "Production agents, approvals")),
                    ]
                )
                + "<blockquote>Many teams prototype in CrewAI, then reimplement critical paths in <a href=\"langgraph.html\">LangGraph</a> for production. See <a href=\"../systems/multi-agent-orchestration.html\">Multi-Agent Orchestration</a>.</blockquote>"
            )
            + card(
                "<h3>CrewAI + RAG integration pattern</h3>"
                "<pre>from crewai.tools import tool\nfrom llama_index.core import VectorStoreIndex\n\nindex = VectorStoreIndex.from_vector_store(existing_store)\nengine = index.as_query_engine(similarity_top_k=8)\n\n@tool\ndef search_internal_kb(query: str) -> str:\n    \"\"\"Search company knowledge base for policies and docs.\"\"\"\n    return str(engine.query(query))\n\nresearcher = Agent(\n    role=\"Researcher\",\n    goal=\"Find authoritative internal answers\",\n    backstory=\"You prefer internal docs over the open web.\",\n    tools=[search_internal_kb],\n)</pre>"
                "<p>Combines <a href=\"llamaindex.html\">LlamaIndex</a> retrieval with CrewAI role orchestration. For customer-facing chat with HITL, wrap in LangGraph instead.</p>",
                hl=True,
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
                        (("td", "Logging"), ("td", "Full crew output + per-task intermediate results")),
                        (("td", "Timeouts"), ("td", "Wrap kickoff() with wall-clock timeout")),
                        (("td", "Cost"), ("td", "Cheaper model for manager; disable delegation unless needed")),
                        (("td", "Eval"), ("td", "Golden inputs; LLM-as-judge on expected_output rubric")),
                        (("td", "Migration"), ("td", "LangGraph when need HITL, audit, custom routing")),
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
                "<li><a href=\"../systems/multi-agent-orchestration.html\">Multi-Agent Orchestration</a> &mdash; crew vs supervisor patterns</li>"
                "<li><a href=\"../systems/agent-architectures.html\">Agent Architectures</a> &mdash; role-based teams</li>"
                "<li><a href=\"langgraph.html\">LangGraph</a> &mdash; production alternative</li>"
                "<li><a href=\"langchain.html\">LangChain</a> &mdash; underlying LLM/tool integrations</li>"
                "<li><a href=\"../fundamentals/ai-system-design-patterns.html\">AI System Design Patterns</a> &mdash; when multi-agent helps</li>"
                "<li><a href=\"../systems/production-agent.html\">Production Agent</a> &mdash; HITL requirements</li>"
                "<li><a href=\"../fundamentals/cost-latency-tradeoffs.html\">Cost &amp; Latency Tradeoffs</a> &mdash; crew cost model</li>"
                "<li><a href=\"openai-api-patterns.html\">OpenAI API Patterns</a> &mdash; underlying LLM calls</li>"
                "</ul>"
            ),
        ),
        (
            "pitfalls",
            "11",
            "Common Pitfalls",
            card(
                "<ul>"
                "<li><strong>Crew for 2-step tasks</strong> &mdash; overkill; use single agent or LCEL chain</li>"
                "<li><strong>Unbounded delegation loops</strong> &mdash; agents ping-pong questions</li>"
                "<li><strong>Identical tools on all agents</strong> &mdash; violates least privilege</li>"
                "<li><strong>Vague expected_output</strong> &mdash; inconsistent format across runs</li>"
                "<li><strong>No timeout on kickoff()</strong> &mdash; hung crew blocks worker</li>"
                "<li><strong>Skipping eval</strong> &mdash; backstory changes silently degrade quality</li>"
                "<li><strong>Manager model too weak</strong> &mdash; bad delegation in hierarchical mode</li>"
                "<li><strong>No structured expected_output</strong> &mdash; downstream parsing breaks</li>"
                "</ul>"
            )
            + card(
                "<h3>Debugging checklist</h3><ol>"
                "<li>Run with <code>verbose=True</code> on agents and crew</li>"
                "<li>Log each task output before next task consumes it</li>"
                "<li>Compare sequential vs hierarchical on same golden input</li>"
                "<li>Isolate one agent/task pair to spot bad backstory or tool schema</li>"
                "<li>Measure token usage per task in LangSmith or custom callback</li></ol>",
            ),
        ),
    ],
    qa=[
        (
            "What is CrewAI optimized for?",
            "Role-based multi-step workflows: research &rarr; analyze &rarr; write. Declarative agents/tasks faster than hand-rolling <a href=\"langgraph.html\">LangGraph</a> for demos and internal tools.",
        ),
        (
            "Explain Agent vs Task.",
            "Agent = persona + capabilities (tools, LLM). Task = unit of work with description and expected_output assigned to one agent. Tasks depend on prior outputs via <code>context=[prior_task]</code>.",
        ),
        (
            "Sequential vs hierarchical process?",
            "Sequential runs tasks in fixed list order. Hierarchical adds a manager agent that delegates tasks to workers dynamically &mdash; more flexible, less predictable, higher token cost.",
        ),
        (
            "How control cost?",
            "Limit agents and tools; cap kickoff timeout; use cheaper model for manager; disable <code>allow_delegation</code> unless needed; cache research outputs; max 5&ndash;8 tasks per crew.",
        ),
        (
            "CrewAI vs AutoGen?",
            "CrewAI: structured roles/tasks, simpler API. AutoGen: conversational group-chat agents. Both offer less production control than LangGraph for HITL and checkpointing.",
        ),
        (
            "Can CrewAI use local models?",
            "Yes via LangChain LLM wrappers pointing at Ollama or vLLM OpenAI-compatible endpoint. See <a href=\"model-serving-vllm.html\">Model Serving</a>.",
        ),
        (
            "How test crew output quality?",
            "Golden inputs with rubric matching expected_output; LLM-as-judge; human review sample; regression CI when prompt/backstory changes.",
        ),
        (
            "Tool security?",
            "Same as any agent: least privilege, validate JSON args, no arbitrary code exec without sandbox. See <a href=\"../systems/tool-calling-functions.html\">Tool Calling</a>.",
        ),
        (
            "When migrate to LangGraph?",
            "Need HITL approval, durable checkpoint across days, custom routing logic, strict audit of each step, or subgraph reuse across products.",
        ),
        (
            "Memory across kickoffs?",
            "Pass prior result in inputs dict or external DB; CrewAI doesn&rsquo;t replace session store for user chat. For chat memory see <a href=\"../systems/agent-memory.html\">Agent Memory</a>.",
        ),
        (
            "Parallel tasks?",
            "<code>async_execution=True</code> on tasks without context dependency &mdash; runs in parallel where safe. Tasks with <code>context=[...]</code> stay sequential.",
        ),
        (
            "SDE3: design content pipeline with CrewAI.",
            "Researcher (web + RAG tool on <a href=\"vector-databases.html\">vector DB</a>) &rarr; Fact-checker &rarr; Writer &rarr; Editor tasks; sequential process; hierarchical manager optional for retry on failed fact-check; output to CMS API; add LangGraph HITL gate before publish if Crew insufficient for compliance.",
        ),
    ],
)

LLAMAINDEX = dict(
    title="LlamaIndex",
    nav="LlamaIndex",
    hero="Data framework for LLM apps: document loaders, node parsers, indices (vector, tree, keyword), query engines, and agents. Strongest when ingestion + retrieval complexity dominates.",
    tags=[
        ("Index", ""),
        ("Query Engine", " orange"),
        ("Nodes", " green"),
        ("Agents", " pink"),
        ("Ingestion", " purple"),
    ],
    main_img="llamaindex-main.png",
    main_cap="LlamaIndex pipeline: load documents &rarr; parse to Nodes &rarr; build VectorStoreIndex &rarr; QueryEngine (retriever + synthesizer) &rarr; response with source_nodes citations.",
    nav_items=[
        ("01", "what", "What &amp; Why"),
        ("01a", "concepts", "Core Concepts"),
        ("01b", "api", "API Surface"),
        ("02", "when", "When to Use"),
        ("03", "architecture", "Architecture"),
        ("04", "index", "Indices"),
        ("05", "query", "Query Engine"),
        ("06", "ingest", "Ingestion"),
        ("07", "agents", "Agents"),
        ("08", "vschain", "vs LangChain"),
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
                "<p><strong>Problem:</strong> RAG apps spend most engineering time on getting data <em>in</em> (loaders, chunking, metadata) and querying it <em>out</em> (retrieval, synthesis, citations) &mdash; not on prompt wording alone.</p>"
                "<h3>Functional</h3><ul>"
                "<li>100+ document loaders (PDF, Notion, SQL, APIs)</li>"
                "<li>Parse documents into <strong>Nodes</strong> (chunks + metadata)</li>"
                "<li>Build <strong>Indices</strong> backed by <a href=\"vector-databases.html\">vector stores</a></li>"
                "<li><strong>QueryEngine</strong> retrieve + synthesize with <code>source_nodes</code> for citations</li></ul>"
                "<h3>Non-Functional</h3><ul>"
                "<li>Persist indices to disk or managed vector DB</li>"
                "<li>IngestionPipeline for parallel extract/embed at scale</li>"
                "<li>Eval recall via source_nodes on golden queries</li></ul>"
                "<blockquote>For agent orchestration with HITL prefer <a href=\"langgraph.html\">LangGraph</a> wrapping a LlamaIndex retriever as a tool. Embeddings via <a href=\"openai-api-patterns.html\">OpenAI API</a> or <a href=\"embedding-models.html\">Embedding Models</a>.</blockquote>"
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
                            ("td", "<strong>Document</strong>"),
                            ("td", "Loaded file or record with text + metadata"),
                            ("td", "Not yet chunked for embedding"),
                        ),
                        (
                            ("td", "<strong>Node</strong>"),
                            ("td", "Chunk + metadata &mdash; smallest indexed unit"),
                            ("td", "What gets embedded and retrieved"),
                        ),
                        (
                            ("td", "<strong>Index</strong>"),
                            ("td", "Data structure over nodes (VectorStoreIndex common)"),
                            ("td", "Wrong chunk size hurts recall more than prompt tuning"),
                        ),
                        (
                            ("td", "<strong>QueryEngine</strong>"),
                            ("td", "query &rarr; retriever &rarr; response synthesizer"),
                            ("td", "Returns <code>response.source_nodes</code> for citations"),
                        ),
                        (
                            ("td", "<strong>StorageContext</strong>"),
                            ("td", "docstore + vector store + index store"),
                            ("td", "Persist together for consistent reload"),
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
                "<pre>from llama_index.core import VectorStoreIndex, SimpleDirectoryReader, Settings\nfrom llama_index.embeddings.openai import OpenAIEmbedding\nfrom llama_index.llms.openai import OpenAI\n\nSettings.embed_model = OpenAIEmbedding(model=\"text-embedding-3-small\")\nSettings.llm = OpenAI(model=\"gpt-4o-mini\")\n\ndocs = SimpleDirectoryReader(\"./data\").load_data()\nindex = VectorStoreIndex.from_documents(docs)\n\nengine = index.as_query_engine(similarity_top_k=10)\nresponse = engine.query(\"What is our refund policy?\")\nprint(response)\nfor node in response.source_nodes:\n    print(node.score, node.metadata)</pre>"
                + tbl(
                    [
                        (("th", "API"), ("th", "Purpose")),
                        (("td", "<code>from_documents</code>"), ("td", "Ingest + embed + index in one call")),
                        (("td", "<code>as_query_engine</code>"), ("td", "Retriever + synthesizer bundle")),
                        (("td", "<code>as_retriever</code>"), ("td", "Use in LangChain/LangGraph chains")),
                        (("td", "<code>storage_context.persist</code>"), ("td", "Save local index to disk")),
                    ]
                )
                + "<h3>Settings singleton</h3>"
                "<p><code>Settings.embed_model</code> and <code>Settings.llm</code> apply globally unless overridden per index/query. Set once at app startup; inject test doubles in unit tests.</p>"
                "<pre>from llama_index.core import Settings\nSettings.chunk_size = 512\nSettings.chunk_overlap = 50\nSettings.embed_model = OpenAIEmbedding(model=\"text-embedding-3-small\")\nSettings.llm = OpenAI(model=\"gpt-4o-mini\", temperature=0.1)</pre>"
            ),
        ),
        (
            "when",
            "02",
            "When to Use / When NOT",
            card(
                tbl(
                    [
                        (("th", "Case"), ("th", "LlamaIndex?"), ("th", "Alternative")),
                        (
                            ("td", "Complex multi-source ingestion"),
                            ("td", "<strong>Yes</strong>"),
                            ("td", "Custom ETL pipeline"),
                        ),
                        (
                            ("td", "Citation-first enterprise RAG"),
                            ("td", "<strong>Yes</strong>"),
                            ("td", "Hand-rolled retriever + prompt"),
                        ),
                        (
                            ("td", "Simple 3-step LCEL chain"),
                            ("td", "<strong>Maybe not</strong>"),
                            ("td", "<a href=\"langchain.html\">LangChain</a> sufficient"),
                        ),
                        (
                            ("td", "Stateful agent + HITL"),
                            ("td", "<strong>No</strong> alone"),
                            ("td", "<a href=\"langgraph.html\">LangGraph</a>"),
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
                "<pre>  Sources (PDF, Notion, SQL)\n           |\n           v\n      +----------+\n      |  Reader  |\n      +-----+----+\n            v\n      +----------+\n      |NodeParser|  chunk_size / overlap\n      +-----+----+\n            v\n      +----------+\n      | Embedder |\n      +-----+----+\n            v\n      +--------------+\n      | VectorStore  |  Pinecone / pgvector / Chroma\n      +------+-------+\n             v\n      +--------------+\n      | QueryEngine  |  top_k -> synthesizer -> answer\n      +--------------+</pre>"
                "<pre>Eval loop (recommended):\n  golden_questions.jsonl\n    -> engine.query(q)\n    -> check expected doc_id in source_nodes[:5]\n    -> track recall@5 weekly\n    -> block deploy if recall drops &gt; 5%</pre>"
                + flow(
                    (
                        "1",
                        "Load",
                        "SimpleDirectoryReader or LlamaHub connector.",
                    ),
                    (
                        "2",
                        "Parse",
                        "SentenceSplitter / SemanticSplitter &mdash; <a href=\"../systems/chunking-strategies.html\">Chunking Strategies</a>.",
                    ),
                    (
                        "3",
                        "Index",
                        "VectorStoreIndex &rarr; external <a href=\"vector-databases.html\">vector DB</a> in prod.",
                    ),
                    (
                        "4",
                        "Query",
                        "Retrieve top_k &rarr; optional rerank &rarr; synthesize with citations.",
                    ),
                ),
                hl=True,
            ),
        ),
        (
            "index",
            "04",
            "Deep Dive: Indices",
            diag(
                "llamaindex",
                "index-zoom",
                "VectorStoreIndex backed by Pinecone/pgvector/Chroma with docstore for full text.",
            )
            + card(
                "<h3>Index types</h3><ul>"
                "<li><strong>VectorStoreIndex</strong> &mdash; production default; ANN over embeddings</li>"
                "<li><strong>SummaryIndex</strong> &mdash; sequential summarization over all nodes</li>"
                "<li><strong>TreeIndex</strong> &mdash; hierarchical query over tree of summaries</li>"
                "<li><strong>KnowledgeGraphIndex</strong> &mdash; entity/relation extraction</li></ul>"
                "<pre>from llama_index.vector_stores.pinecone import PineconeVectorStore\n\nvector_store = PineconeVectorStore(pinecone_index=pinecone_index)\nindex = VectorStoreIndex.from_vector_store(vector_store)</pre>"
                "<p>Attach existing managed index instead of rebuilding on every deploy.</p>"
                + tbl(
                    [
                        (("th", "Index type"), ("th", "Best for"), ("th", "Production?")),
                        (("td", "VectorStoreIndex"), ("td", "Semantic search over chunks"), ("td", "Yes — default")),
                        (("td", "SummaryIndex"), ("td", "Summarize-all-then-query"), ("td", "Small corpora only")),
                        (("td", "TreeIndex"), ("td", "Hierarchical QA"), ("td", "Niche")),
                        (("td", "KnowledgeGraphIndex"), ("td", "Entity/relation queries"), ("td", "Experimental")),
                    ]
                )
            )
            + card(
                "<h3>Production: attach Pinecone index</h3>"
                "<pre>import os\nfrom pinecone import Pinecone\nfrom llama_index.core import VectorStoreIndex, StorageContext\nfrom llama_index.vector_stores.pinecone import PineconeVectorStore\n\npc = Pinecone(api_key=os.environ[\"PINECONE_API_KEY\"])\npinecone_index = pc.Index(\"rag-prod-v1\")\n\nvector_store = PineconeVectorStore(pinecone_index=pinecone_index)\nstorage_context = StorageContext.from_defaults(vector_store=vector_store)\n\nindex = VectorStoreIndex.from_vector_store(\n    vector_store, storage_context=storage_context)\n\n# Query with tenant filter via MetadataFilters\nfrom llama_index.core.vector_stores import MetadataFilters, ExactMatchFilter\nfilters = MetadataFilters(filters=[ExactMatchFilter(key=\"tenant_id\", value=\"acme\")])\nengine = index.as_query_engine(similarity_top_k=15, filters=filters)</pre>"
                "<p>See <a href=\"pinecone.html\">Pinecone</a> and <a href=\"vector-databases.html\">Vector Databases</a> for namespace and metadata filter design.</p>",
                hl=True,
            ),
        ),
        (
            "query",
            "05",
            "Deep Dive: Query Engine",
            diag(
                "llamaindex",
                "query-zoom",
                "Query engine: retriever top_k=20, postprocessor, compact/refine synthesizer modes.",
            )
            + card(
                "<pre>from llama_index.core.postprocessor import SimilarityPostprocessor\n\nengine = index.as_query_engine(\n    similarity_top_k=20,\n    node_postprocessors=[SimilarityPostprocessor(similarity_cutoff=0.7)],\n    response_mode=\"compact\",  # or refine, tree_summarize\n)\nresponse = engine.query(\"Refund policy for EU customers?\")</pre>"
                "<h3>Response modes</h3><ul>"
                "<li><strong>compact</strong> &mdash; single prompt with all chunks (fast)</li>"
                "<li><strong>refine</strong> &mdash; iterative refinement per chunk (slow, thorough)</li>"
                "<li><strong>tree_summarize</strong> &mdash; hierarchical merge for long contexts</li></ul>"
                "<p>Add <a href=\"rerankers.html\">reranker</a> after retrieval for better precision.</p>"
                "<pre>from llama_index.core.retrievers import QueryFusionRetriever\nfrom llama_index.retrievers.bm25 import BM25Retriever\n\nvector_retriever = index.as_retriever(similarity_top_k=20)\nbm25_retriever = BM25Retriever.from_defaults(docstore=index.docstore, similarity_top_k=20)\n\nfusion_retriever = QueryFusionRetriever(\n    retrievers=[vector_retriever, bm25_retriever],\n    similarity_top_k=20,\n    num_queries=1,\n    mode=\"reciprocal_rerank\",\n)\n\nengine = RetrieverQueryEngine.from_args(\n    retriever=fusion_retriever,\n    node_postprocessors=[SimilarityPostprocessor(similarity_cutoff=0.7)],\n)</pre>"
            ),
        ),
        (
            "ingest",
            "06",
            "Deep Dive: Ingestion",
            card(
                "<pre>from llama_index.core.ingestion import IngestionPipeline\nfrom llama_index.core.node_parser import SentenceSplitter\n\npipeline = IngestionPipeline(\n    transformations=[\n        SentenceSplitter(chunk_size=512, chunk_overlap=50),\n        Settings.embed_model,\n    ],\n    vector_store=vector_store,\n)\nnodes = pipeline.run(documents=docs, show_progress=True)</pre>"
                "<p>LlamaHub: 100+ loaders (Notion, Slack, Google Drive). Coordinate with <a href=\"../systems/document-ingestion.html\">Document Ingestion</a> system design for scheduling, dedup, and PII handling.</p>"
            ),
        ),
        (
            "agents",
            "07",
            "Deep Dive: Agents",
            card(
                "<pre>query_engine_tool = QueryEngineTool.from_defaults(\n    query_engine=engine,\n    name=\"company_kb\",\n    description=\"Search internal policy documents\",\n)\n# OpenAIAgent or ReActAgent with query_engine_tools</pre>"
                "<p>LlamaIndex agents combine tools + query engines. For production control (HITL, checkpointing) wrap retriever in <a href=\"langgraph.html\">LangGraph</a> tool node instead.</p>"
                "<pre>from llama_index.core.agent import ReActAgent\nfrom llama_index.core.tools import QueryEngineTool\n\nqe_tool = QueryEngineTool.from_defaults(\n    query_engine=engine,\n    name=\"policy_kb\",\n    description=\"Internal HR and refund policies\",\n)\nagent = ReActAgent.from_tools([qe_tool], llm=Settings.llm, verbose=True)\nresponse = agent.chat(\"Can EU customers get refunds after 30 days?\")</pre>"
                "<h3>ChatEngine for multi-turn</h3>"
                "<pre>chat_engine = index.as_chat_engine(chat_mode=\"condense_question\")\nresponse = chat_engine.chat(\"What about enterprise plans?\")\n# condense_question rewrites follow-up using history before retrieve</pre>"
                "<p>For durable session state in production, prefer explicit history store + query engine per turn (<a href=\"../systems/agent-memory.html\">Agent Memory</a>).</p>"
            ),
        ),
        (
            "vschain",
            "08",
            "LlamaIndex vs LangChain",
            card(
                tbl(
                    [
                        (("th", "Dimension"), ("th", "LlamaIndex"), ("th", "LangChain")),
                        (("td", "Focus"), ("td", "Indexing, query, citations"), ("td", "General chains, tools, agents")),
                        (("td", "Ingestion"), ("td", "First-class loaders + pipelines"), ("td", "Document loaders + text splitters")),
                        (("td", "Query API"), ("td", "QueryEngine with source_nodes"), ("td", "Retriever + LCEL chain")),
                        (("td", "Agents"), ("td", "Built-in ReAct agents"), ("td", "LangGraph recommended for prod")),
                        (("td", "Combine"), ("td", "LI retriever in LC/LG chain"), ("td", "Best of both common")),
                    ]
                )
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
                        (("td", "Storage"), ("td", "Persist to <a href=\"pinecone.html\">Pinecone</a> / pgvector, not local disk")),
                        (("td", "Versioning"), ("td", "Embed model version in index/namespace name")),
                        (("td", "Eval"), ("td", "Golden queries on source_nodes recall@k")),
                        (("td", "Scale"), ("td", "IngestionPipeline async; batch embed")),
                        (("td", "Multi-tenant"), ("td", "Metadata filters on tenant_id at query time")),
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
                "<li><a href=\"../systems/rag-end-to-end.html\">RAG End-to-End</a> &mdash; full pipeline reference</li>"
                "<li><a href=\"../systems/chatbot-rag-system.html\">Chatbot RAG System</a> &mdash; production chat</li>"
                "<li><a href=\"vector-databases.html\">Vector Databases</a> &mdash; storage layer</li>"
                "<li><a href=\"../systems/chunking-strategies.html\">Chunking Strategies</a> &mdash; node parser tuning</li>"
                "<li><a href=\"../systems/hybrid-search.html\">Hybrid Search</a> &mdash; QueryFusionRetriever</li>"
                "<li><a href=\"langchain.html\">LangChain</a> &mdash; orchestration layer</li>"
                "<li><a href=\"../fundamentals/embeddings-semantic-search.html\">Embeddings &amp; Semantic Search</a> &mdash; theory</li>"
                "<li><a href=\"openai-api-patterns.html\">OpenAI API Patterns</a> &mdash; embed + LLM calls</li>"
                "<li><a href=\"../systems/eval-harness.html\">Eval Harness</a> &mdash; source_nodes recall tests</li>"
                "</ul>"
            ),
        ),
        (
            "pitfalls",
            "11",
            "Common Pitfalls",
            card(
                "<ul>"
                "<li><strong>Default chunk size wrong</strong> for your docs &mdash; eval before prod</li>"
                "<li><strong>Not persisting index</strong> &mdash; rebuild every deploy wastes time and money</li>"
                "<li><strong>Ignoring source_nodes</strong> in eval &mdash; answer quality can hide bad retrieval</li>"
                "<li><strong>Mixing embedding models</strong> in same index &mdash; never do this</li>"
                "<li><strong>refine mode at scale</strong> &mdash; too many LLM calls; prefer compact + rerank</li>"
                "<li><strong>Skipping metadata filters</strong> &mdash; cross-tenant leakage in multi-tenant SaaS</li>"
                "</ul>"
            )
            + card(
                "<h3>Re-index playbook</h3><ol>"
                "<li>Create new namespace/collection with embed version suffix (e.g. <code>_e3small_v2</code>)</li>"
                "<li>Run IngestionPipeline on full corpus into new namespace</li>"
                "<li>Eval recall@5 on golden set against new index</li>"
                "<li>Blue/green switch query engine config in app</li>"
                "<li>Delete old namespace after 7-day rollback window</li></ol>"
                "<p>Coordinate with <a href=\"../systems/document-ingestion.html\">Document Ingestion</a> jobs for scheduled refresh.</p>",
            ),
        ),
    ],
    qa=[
        (
            "Node vs Document?",
            "Document = loaded file or record. Node = parsed chunk(s) with metadata &mdash; the unit that gets embedded, stored, and retrieved.",
        ),
        (
            "VectorStoreIndex vs loading vector DB directly?",
            "VectorStoreIndex wraps vector store + docstore + index struct. Use <code>from_vector_store()</code> to attach existing Pinecone/pgvector without re-embedding.",
        ),
        (
            "How get citations?",
            "<code>response.source_nodes</code> lists retrieved nodes with scores and metadata. Pass file/page refs to UI; log for eval harness.",
        ),
        (
            "Query engine vs chat engine?",
            "QueryEngine: single Q&amp;A turn. ChatEngine: multi-turn with memory. Production chat often uses custom history store + query engine per turn.",
        ),
        (
            "LlamaIndex vs LangChain for RAG?",
            "LI stronger out-of-box for ingestion, query engines, and citations. LC more flexible for general orchestration. Common pattern: LI for index + LC/<a href=\"langgraph.html\">LangGraph</a> for agent layer.",
        ),
        (
            "Persist index?",
            "<code>storage_context.persist()</code> to local disk for dev; write to managed vector DB for prod. Namespace/index name includes embed model version.",
        ),
        (
            "Custom node parser?",
            "<code>SentenceSplitter</code> with chunk_size/overlap; <code>SemanticSplitter</code> for embedding-based splits. Match <a href=\"../systems/chunking-strategies.html\">chunking</a> eval results.",
        ),
        (
            "Hybrid search in LlamaIndex?",
            "<code>QueryFusionRetriever</code> combines multiple retrievers; add BM25 via Elasticsearch retriever + vector retriever + reciprocal rank fusion.",
        ),
        (
            "Agents in LlamaIndex?",
            "OpenAIAgent / ReActAgent with query_engine_tools. Prefer <a href=\"langgraph.html\">LangGraph</a> when you need HITL, checkpointing, and explicit routing.",
        ),
        (
            "Embedding model change?",
            "Full re-index required; new collection/namespace name; never mix vectors from different models in one index.",
        ),
        (
            "Production scale?",
            "IngestionPipeline with async workers; batch embed API (<a href=\"openai-api-patterns.html\">Batch API</a>); external vector DB; stateless query engine microservice; metadata filters per tenant.",
        ),
        (
            "SDE3: LlamaIndex for enterprise doc RAG?",
            "IngestionPipeline: Notion+SharePoint loaders &rarr; semantic chunk &rarr; Pinecone namespace per tenant &rarr; QueryEngine with metadata filters &rarr; <a href=\"rerankers.html\">reranker</a> &rarr; <a href=\"langgraph.html\">LangGraph</a> agent wrapper with HITL; golden eval on source node recall@5; blue/green re-index on embed model bump.",
        ),
    ],
)

BATCH_A_TOPICS = {
    "openai-api-patterns": OPENAI,
    "langchain": LANGCHAIN,
    "crewai": CREWAI,
    "llamaindex": LLAMAINDEX,
}
