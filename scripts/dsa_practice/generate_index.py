#!/usr/bin/env python3
"""Regenerate dsa-practice/index.html from HUB_META + live topic stats."""
import os
import json
from _compact import HUB_META

ROOT = os.path.join(os.path.dirname(__file__), "..", "..")
OUT = os.path.join(ROOT, "docs", "cheatsheets", "dsa-practice", "index.html")
DATA = os.path.join(ROOT, "docs", "cheatsheets", "dsa-practice", "data")


def load_stats(tid):
    path = os.path.join(DATA, tid + ".js")
    if not os.path.isfile(path):
        return None
    with open(path, "r", encoding="utf-8") as f:
        raw = f.read().replace("window.PRACTICE_TOPIC = ", "").rstrip(";\n")
        topic = json.loads(raw)
    qs = topic["questions"]
    must = sum(1 for x in qs if x["importance"] == "must")
    return len(qs), must


def card(tid, title, css, desc, count, must, blurb):
    return """
      <a href="topics/{tid}.html" class="card {css} practice-card">
        <h3>{title}</h3>
        <p>{desc}</p>
        <div class="tags">
          <span class="tag green">{count} questions</span>
          <span class="tag must-count">{must} must-do</span>
          <span class="tag">C++ solutions</span>
        </div>
        <div class="q-count">{blurb}</div>
      </a>""".format(
        tid=tid, title=title, css=css, desc=desc, count=count, must=must, blurb=blurb
    )


def main():
    cards = []
    total_q = 0
    for tid, title, css, _exp, blurb, desc in HUB_META:
        stats = load_stats(tid)
        if not stats:
            continue
        count, must = stats
        total_q += count
        cards.append(card(tid, title, css, desc, count, must, blurb))

    html = (
        INDEX_TEMPLATE.replace("{{TOTAL}}", str(total_q))
        .replace("{{TOPIC_COUNT}}", str(len(cards)))
        .replace("{{CARDS}}", "\n".join(cards))
    )
    with open(OUT, "w", encoding="utf-8") as f:
        f.write(html)
    print("Wrote %s (%d topics, %d questions)" % (OUT, len(cards), total_q))


INDEX_TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>DSA Practice — Speed-Run Question Banks</title>
<script>(function(){var t="dark";try{var s=localStorage.getItem("playbook-theme");if(s==="light"||s==="dark")t=s;else if(matchMedia("(prefers-color-scheme: light)").matches)t="light";}catch(e){}document.documentElement.setAttribute("data-theme",t);})();</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../shared.css">
<link rel="stylesheet" href="practice.css">
</head>
<body class="theme-practice">
<nav class="site-nav">
  <div class="site-nav-inner">
    <a href="../index.html" class="brand">Interview <span>Playbook</span></a>
    <a href="../lld/index.html" class="pill lld">LLD</a>
    <a href="../hld/hub.html" class="pill hld">HLD</a>
    <a href="../dsa/index.html" class="pill dsa">DSA Ref</a>
    <a href="index.html" class="pill practice active">DSA Practice</a>
    <a href="../ai/index.html" class="pill ai">AI</a>
    <span class="spacer"></span>
    <a href="../../" class="back-link">&larr; Playbook</a>
  </div>
</nav>
<div class="container">
  <div class="breadcrumbs"><a href="../index.html">Cheat Sheets</a><span>/</span> DSA Practice</div>
  <header class="page-header">
    <h1>DSA <span>Practice</span></h1>
    <p class="subtitle">Every DSA cheat sheet topic — constraints, examples, optimal C++ with TC/SC, importance tags. Tick progress as you go.</p>
    <div class="stats">
      <span class="stat"><strong>{{TOTAL}}</strong> questions</span>
      <span class="stat">{{TOPIC_COUNT}} topics</span>
      <span class="stat">Filter Must do / pattern</span>
    </div>
  </header>
  <div class="speed-run-banner">
    <strong>How to use:</strong> Pick a topic matching the <a href="../dsa/index.html">DSA reference sheet</a> you studied.
    Filter <em>Must do</em> first, ~10 min per question. Progress saves in your browser.
  </div>
  <div class="section">
    <h2 class="practice-section-title">All topics</h2>
    <div class="grid">
{{CARDS}}
    </div>
  </div>
</div>
<script src="../../theme.js"></script>
<script src="../hub.js" defer></script>
</body></html>
"""

if __name__ == "__main__":
    main()
