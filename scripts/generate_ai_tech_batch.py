#!/usr/bin/env python3
"""Generate 12 AI tech cheatsheet HTML files."""
import os
import re

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
OUT = os.path.join(ROOT, "docs/cheatsheets/ai/tech")

CSS = open(os.path.join(OUT, "langgraph.html")).read()
CSS = re.search(r"<style>(.*?)</style>", CSS, re.S).group(1)

LB = open(os.path.join(OUT, "langgraph.html")).read()
LB = LB[LB.index("<!-- ===== diagram lightbox"):]


def page(title, nav, hero, tags, main_img, main_cap, sections, nav_items, qa):
    tags_html = "".join(f'<span class="tag{t}">{x}</span>' for x, t in tags)
    nav_html = "".join(
        f'<a href="#{i}"><span class="num">{n}</span> {l}</a>' for n, i, l in nav_items
    )
    sec_html = "".join(
        f'<section id="{i}"><h2>{n} &mdash; {h}</h2>{b}</section>'
        for i, n, h, b in sections
    )
    qa_html = "".join(
        f'<details><summary>{q}</summary><div class="answer">{a}</div></details>'
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
        + """
</style>
</head>
<body>
"""
        + f"""
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
<section id="interview"><h2>{nav_items[-1][0]} &mdash; Interview Q&amp;A</h2>{qa_html}</section>
</div>
"""
        + LB
        + "\n</body>\n</html>"
    )


def card(html, hl=False):
    c = "card highlight" if hl else "card"
    return f'<div class="{c}">{html}</div>'


def tbl(rows):
    return (
        "<table>"
        + "".join(
            f"<tr>{''.join(f'<{t}>{c}</{t}>' for t, c in r)}</tr>" for r in rows
        )
        + "</table>"
    )


def diag(slug, name, cap):
    return (
        f'<div class="diagram"><img src="img/{slug}-{name}.png" alt="{cap}"></div>'
        f'<p class="diagram-caption">{cap}</p>'
    )


TOPICS = {}
_content_dir = os.path.dirname(__file__)
exec(
    compile(
        open(os.path.join(_content_dir, "ai_tech_content.py")).read(),
        "ai_tech_content.py",
        "exec",
    )
)

if __name__ == "__main__":
    for slug, cfg in TOPICS.items():
        p = os.path.join(OUT, slug + ".html")
        with open(p, "w", encoding="utf-8") as f:
            f.write(page(**cfg))
        print("Wrote", p)
