#!/usr/bin/env python3
"""Build SDE3-quality AI tech cheatsheets batch C (4 topics)."""
import os
import re

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
OUT = os.path.join(ROOT, "docs/cheatsheets/ai/tech")

CSS = open(os.path.join(OUT, "langgraph.html")).read()
CSS = re.search(r"<style>(.*?)</style>", CSS, re.S).group(1)

LB = open(os.path.join(OUT, "langgraph.html")).read()
LB = LB[LB.index("<!-- ===== diagram lightbox") :]


def page(title, nav, hero, tags, main_img, main_cap, sections, nav_items, qa, interview_num="12"):
    tags_html = "".join(f'<span class="tag{t}">{x}</span>' for x, t in tags)
    nav_html = "".join(
        f'<a href="#{i}"><span class="num">{n}</span> {l}</a>' for n, i, l in nav_items
    )
    sec_html = "".join(
        f'\n<section id="{i}">\n  <h2>{n} &mdash; {h}</h2>\n  {b}\n</section>\n'
        for i, n, h, b in sections
    )
    qa_html = "".join(
        f'\n  <details>\n    <summary>{q}</summary>\n    <div class="answer">{a}</div>\n  </details>\n'
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
"""
        + CSS
        + f"""
</style>
</head>
<body>
<nav class="nav">
  <h2>{nav}</h2>
  <a href="index.html" style="color:var(--accent2);margin-bottom:16px;">&larr; AI Tech</a>
  {nav_html}
</nav>
<div class="main">
<div class="hero">
  <h1>{title} <span>// AI Tech</span></h1>
  <p>{hero}</p>
  <div class="tags">{tags_html}</div>
</div>
<div class="diagram"><img src="img/{main_img}" alt="{title} architecture"></div>
<p class="diagram-caption">{main_cap}</p>
{sec_html}
<section id="interview"><h2>{interview_num} &mdash; Interview Q&amp;A</h2>{qa_html}</section>
</div>
"""
        + LB
    )


exec(
    compile(
        open(os.path.join(os.path.dirname(__file__), "ai_tech_batch_c_content.py")).read(),
        "ai_tech_batch_c_content.py",
        "exec",
    )
)

for slug, topic in TOPICS.items():
    path = os.path.join(OUT, slug + ".html")
    html = page(**topic)
    with open(path, "w") as f:
        f.write(html)
    lines = html.count("\n") + 1
    print(f"Wrote {path} ({lines} lines)")
