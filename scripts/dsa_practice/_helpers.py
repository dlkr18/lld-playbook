# Shared helpers for DSA Practice catalog generation.
import json
import os

ROOT = os.path.join(os.path.dirname(__file__), "..", "..")
OUT_DIR = os.path.join(ROOT, "docs", "cheatsheets", "dsa-practice", "data")
TOPICS_DIR = os.path.join(ROOT, "docs", "cheatsheets", "dsa-practice", "topics")
QUESTIONS_DIR = os.path.join(ROOT, "docs", "cheatsheets", "dsa-practice", "q")


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


def write_question_pages(topic):
    """Generate one static HTML page per question."""
    os.makedirs(QUESTIONS_DIR, exist_ok=True)
    topic_id = topic["id"]
    topic_title = topic["title"]
    for q in topic["questions"]:
        qid = q["id"]
        path = os.path.join(QUESTIONS_DIR, qid + ".html")
        lc_link = ""
        if q.get("lc") and q.get("lcSlug"):
            lc_link = (
                '<a class="lc-external" href="https://leetcode.com/problems/%s/" '
                'target="_blank" rel="noopener">Open on LeetCode ↗</a>' % q["lcSlug"]
            )
        elif q.get("lc"):
            lc_link = '<span class="lc-external">LC %s</span>' % q["lc"]
        html = QUESTION_HTML.format(
            qid=qid,
            topic_id=topic_id,
            topic_title=topic_title,
            title=q["title"],
            lc_num=q.get("lc") or "",
            lc_link=lc_link,
            data_js="../data/" + topic_id + ".js",
        )
        with open(path, "w", encoding="utf-8") as f:
            f.write(html)
    return QUESTIONS_DIR


QUESTION_HTML = """<!DOCTYPE html>
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
<body class="theme-practice question-page">
<nav class="site-nav">
  <div class="site-nav-inner">
    <a href="../../index.html" class="brand">Interview <span>Playbook</span></a>
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
  <div class="breadcrumbs">
    <a href="../../index.html">Cheat Sheets</a><span>/</span>
    <a href="../index.html">DSA Practice</a><span>/</span>
    <a href="../topics/{topic_id}.html">{topic_title}</a><span>/</span>
    <span>{title}</span>
  </div>
  <article class="question-detail" data-question-id="{qid}">
    <header class="question-detail-header">
      <label class="q-check q-check-standalone">
        <input type="checkbox" class="done-cb" data-id="{qid}">
        <span class="q-title-main">{title}</span>
      </label>
      <div class="question-detail-meta"></div>
      {lc_link}
    </header>
    <div class="question-detail-body"></div>
  </article>
</div>
<script>window.PRACTICE_QUESTION_ID = "{qid}";</script>
<script src="../../../theme.js"></script>
<script src="{data_js}"></script>
<script src="../question-page.js"></script>
</body></html>
"""


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
    <a href="../../index.html" class="brand">Interview <span>Playbook</span></a>
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
<script src="../question-page.js"></script>
<script src="{data_js}"></script>
<script src="../practice-core.js"></script>
</body></html>
"""
