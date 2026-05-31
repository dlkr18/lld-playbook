#!/usr/bin/env python3
"""Generate 9 AI fundamentals cheatsheets from topic configs."""
import os

ROOT = os.path.join(os.path.dirname(__file__), "..", "docs", "cheatsheets", "ai", "fundamentals")
REF = os.path.join(ROOT, "llm-fundamentals.html")

with open(REF) as f:
    ref = f.read()
CSS = ref[ref.index("<style>") + 7 : ref.index("</style>")]
LIGHTBOX = ref[ref.index("<!-- ===== diagram lightbox") :]

SIBLINGS = [
    ("llm-fundamentals.html", "LLM Fundamentals"),
    ("prompt-engineering.html", "Prompt Engineering"),
    ("embeddings-semantic-search.html", "Embeddings & Semantic Search"),
    ("transformers-attention.html", "Transformers & Attention"),
    ("tokenization-context.html", "Tokenization & Context"),
    ("pretraining-sft-rlhf.html", "Pre-training, SFT & RLHF"),
    ("evaluation-metrics.html", "Evaluation Metrics"),
    ("hallucination-grounding.html", "Hallucination & Grounding"),
    ("ai-safety-guardrails.html", "AI Safety & Guardrails"),
    ("cost-latency-tradeoffs.html", "Cost & Latency Tradeoffs"),
    ("ai-system-design-patterns.html", "AI System Design Patterns"),
    ("context-window-kv-cache.html", "Context Window & KV Cache"),
]

TECH = [
    ("../tech/langgraph.html", "LangGraph"),
    ("../tech/vector-databases.html", "Vector Databases"),
    ("../tech/model-serving-vllm.html", "Model Serving (vLLM)"),
]
SYSTEMS = [
    ("../systems/rag-end-to-end.html", "RAG End-to-End"),
    ("../systems/agent-architectures.html", "Agent Architectures"),
    ("../systems/fine-tuning-lora.html", "Fine-Tuning (LoRA)"),
]

def sibling_links(exclude_slug):
    lines = []
    for href, label in SIBLINGS:
        if href.replace(".html", "") == exclude_slug:
            continue
        lines.append('      <li><a href="%s">%s</a></li>' % (href, label))
    return "\n".join(lines)

def tech_links():
    return "\n".join('      <li><a href="%s">%s</a></li>' % (h, l) for h, l in TECH)

def systems_links():
    return "\n".join('      <li><a href="%s">%s</a></li>' % (h, l) for h, l in SYSTEMS)

def qa_block(items):
    out = []
    for q, a in items:
        out.append("  <details>\n    <summary>%s</summary>\n    <div class=\"answer\">%s</div>\n  </details>" % (q, a))
    return "\n\n".join(out)

def diagram(img, alt):
    return '<div class="diagram">\n  <img src="img/%s" alt="%s">\n</div>' % (img, alt)

def page(cfg):
    slug = cfg["slug"]
    nav = "\n".join('  <a href="#%s"><span class="num">%s</span> %s</a>' % (i, n, l) for i, n, l in cfg["nav"])
    tags = "\n".join('    <span class="tag%s">%s</span>' % ((" " + c) if c else "", t) for t, c in cfg["tags"])
    zooms = ""
    for z in cfg.get("zooms", []):
        if isinstance(z, dict):
            img, alt, cap = z["img"], z["alt"], z["cap"]
        else:
            img, alt, cap = z[0], z[1], z[2]
        zooms += diagram(img, alt) + '\n<p class="diagram-caption">%s</p>\n' % cap
    shows = sibling_links(slug)
    qas = qa_block(cfg["qa"])
    body = cfg["body"]
    return """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>%(title)s -- AI Cheat Sheet</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
%(css)s
</style>
</head>
<body>
<nav class="nav">
  <h2>%(nav_short)s</h2>
  <a href="index.html" style="color:var(--accent2);margin-bottom:16px;">&larr; All Fundamentals</a>
%(nav)s
</nav>
<div class="main">
<div class="hero">
  <h1>%(title)s <span>// Fundamentals</span></h1>
  <p>%(hero_p)s</p>
  <div class="tags">
%(tags)s
  </div>
</div>

%(main_diagram)s
<p class="diagram-caption">%(main_cap)s</p>

%(body)s

%(zooms)s

<section id="production">
  <h2>09 &mdash; Production &amp; Ops</h2>
  %(production)s
</section>

<section id="shows-up">
  <h2>10 &mdash; Where It Shows Up</h2>
  <div class="card"><h3>AI vertical</h3>
    <ul>
%(shows)s
    </ul>
  </div>
  <div class="card"><h3>Tech &amp; systems</h3>
    <ul>
%(tech)s
%(systems)s
    </ul>
  </div>
</section>

<section id="pitfalls">
  <h2>11 &mdash; Common Pitfalls</h2>
  <div class="card"><ul>
%(pitfalls)s
  </ul></div>
</section>

<section id="interview">
  <h2>12 &mdash; Interview Q&amp;A</h2>

%(qas)s
</section>

</div>

%(lightbox)s

</body>
</html>""" % dict(
        title=cfg["title"],
        css=CSS,
        nav_short=cfg["nav_short"],
        nav=nav,
        hero_p=cfg["hero"],
        tags=tags,
        main_diagram=diagram("%s-main.png" % slug, cfg["title"]),
        main_cap=cfg["main_cap"],
        body=body,
        zooms=zooms,
        production=cfg.get("production", cfg.get("prod", "")),
        shows=shows,
        tech=tech_links(),
        systems=systems_links(),
        pitfalls=cfg.get("pitfalls", cfg.get("pit", "")),
        qas=qas,
        lightbox=LIGHTBOX,
    )


exec(open(os.path.join(os.path.dirname(__file__), "topics_fundamentals_batch.py")).read())

for t in TOPICS:
    path = os.path.join(ROOT, t["slug"] + ".html")
    with open(path, "w") as f:
        f.write(page(t))
    print("wrote", path, os.path.getsize(path))
