# Shared helpers for DSA Practice catalog generation.
import json
import os

ROOT = os.path.join(os.path.dirname(__file__), "..", "..")
OUT_DIR = os.path.join(ROOT, "docs", "cheatsheets", "dsa-practice", "data")
TOPICS_DIR = os.path.join(ROOT, "docs", "cheatsheets", "dsa-practice", "topics")


def q(qid, title, lc, importance, subtopic, difficulty, constraints, examples, approaches):
    return {
        "id": qid,
        "title": title,
        "lc": lc,
        "importance": importance,
        "subtopic": subtopic,
        "difficulty": difficulty,
        "constraints": constraints,
        "examples": examples,
        "approaches": approaches,
    }


def ex(inp, out, note=None):
    d = {"in": inp, "out": out}
    if note:
        d["note"] = note
    return d


def approach(name, time_c, space_c, code):
    return {"name": name, "time": time_c, "space": space_c, "code": code.strip()}


def write_topic_js(topic):
    os.makedirs(OUT_DIR, exist_ok=True)
    path = os.path.join(OUT_DIR, topic["id"] + ".js")
    payload = json.dumps(topic, indent=2, ensure_ascii=False)
    with open(path, "w", encoding="utf-8") as f:
        f.write("window.PRACTICE_TOPIC = ")
        f.write(payload)
        f.write(";\n")
    return path


def write_topic_html(topic):
    os.makedirs(TOPICS_DIR, exist_ok=True)
    path = os.path.join(TOPICS_DIR, topic["id"] + ".html")
    must = sum(1 for x in topic["questions"] if x["importance"] == "must")
    html = TOPIC_HTML.format(
        id=topic["id"],
        title=topic["title"],
        count=len(topic["questions"]),
        must=must,
        strategy=topic.get("strategy", ""),
        data_js="../data/" + topic["id"] + ".js",
    )
    with open(path, "w", encoding="utf-8") as f:
        f.write(html)
    return path


TOPIC_HTML = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{title} — DSA Practice</title>
<script>(function(){{var t="dark";try{{var s=localStorage.getItem("playbook-theme");if(s==="light"||s==="dark")t=s;else if(matchMedia("(prefers-color-scheme: light)").matches)t="light";}}catch(e){{}}document.documentElement.setAttribute("data-theme",t);}})();</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../../shared.css">
<link rel="stylesheet" href="../practice.css">
</head>
<body class="theme-practice">
<nav class="site-nav">
  <div class="site-nav-inner">
    <a href="../../index.html" class="brand">LLD <span>Playbook</span></a>
    <a href="../../lld/index.html" class="pill lld">LLD</a>
    <a href="../../hld/hub.html" class="pill hld">HLD</a>
    <a href="../../dsa/index.html" class="pill dsa">DSA Ref</a>
    <a href="../index.html" class="pill practice active">DSA Practice</a>
    <a href="../../ai/index.html" class="pill ai">AI</a>
    <span class="spacer"></span>
    <a href="../../../" class="back-link">&larr; Playbook</a>
  </div>
</nav>
<div class="container">
  <div class="breadcrumbs"><a href="../../index.html">Cheat Sheets</a><span>/</span><a href="../index.html">DSA Practice</a><span>/</span> {title}</div>
  <header class="page-header">
    <h1>{title}</h1>
    <p class="subtitle">Speed-run checklist — tick as you go. Filter by pattern or importance.</p>
    <div class="stats">
      <span class="stat"><strong>{count}</strong> questions</span>
      <span class="stat"><strong>{must}</strong> must-do</span>
      <span class="stat practice-progress"></span>
    </div>
  </header>
  <div class="speed-run-banner">{strategy}</div>
  <div class="practice-toolbar">
    <div class="practice-toolbar-inner">
      <span class="practice-progress">0 / {count} done</span>
      <input type="search" class="practice-search" placeholder="Search title or LC…" aria-label="Search questions">
      <div class="filter-group importance">
        <span class="filter-label">Importance</span>
        <button type="button" class="filter-btn importance active" data-value="all">All</button>
        <button type="button" class="filter-btn importance must" data-value="must">Must do</button>
        <button type="button" class="filter-btn importance should" data-value="should">Should do</button>
        <button type="button" class="filter-btn importance nice" data-value="nice">Nice to have</button>
      </div>
      <div class="filter-group subtopic">
        <span class="filter-label">Pattern</span>
        <button type="button" class="filter-btn subtopic active" data-value="all">All</button>
      </div>
    </div>
  </div>
  <div class="practice-list"></div>
</div>
<script src="../../../theme.js"></script>
<script src="{data_js}"></script>
<script src="../practice-core.js"></script>
</body></html>
"""
