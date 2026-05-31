#!/usr/bin/env python3
"""Build 9 missing AI fundamentals cheatsheets."""
import os
import re

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
OUT = os.path.join(ROOT, "docs/cheatsheets/ai/fundamentals")
REF = open(os.path.join(OUT, "llm-fundamentals.html"), encoding="utf-8").read()

CSS = re.search(r"<style>(.*?)</style>", REF, re.S).group(1)
LB = REF[REF.index("<!-- ===== diagram lightbox") :]


def page(title, nav, hero, tags, main_img, main_cap, sections, nav_items, qa):
    tags_html = "".join(f'<span class="tag{t}">{x}</span>' for x, t in tags)
    nav_html = "".join(
        f'<a href="#{i}"><span class="num">{n}</span> {l}</a>' for n, i, l in nav_items
    )
    sec_html = "".join(
        f'<section id="{i}"><h2>{n} &mdash; {h}</h2>{b}</section>' for i, n, h, b in sections
    )
    qa_html = "".join(
        f"<details><summary>{q}</summary><div class=\"answer\">{a}</div></details>"
        for q, a in qa
    )
    return (
        f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{title} -- AI Cheat Sheet</title>
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
  <a href="index.html" style="color:var(--accent2);margin-bottom:16px;">&larr; All Fundamentals</a>
  {nav_html}
</nav>
<div class="main">
<div class="hero">
  <h1>{title} <span>// Fundamentals</span></h1>
  <p>{hero}</p>
  <div class="tags">{tags_html}</div>
</div>
<div class="diagram"><img src="img/{main_img}" alt="{title} overview"></div>
<p class="diagram-caption">{main_cap}</p>
{sec_html}
<section id="interview"><h2>12 &mdash; Interview Q&amp;A</h2>{qa_html}</section>
</div>
"""
        + LB
        + "\n</body>\n</html>"
    )


def card(html, hl=False):
    return f'<div class="{"card highlight" if hl else "card"}">{html}</div>'


def tbl(rows):
    return (
        "<table>"
        + "".join(
            "<tr>"
            + "".join(f"<{t}>{c}</{t}>" for t, c in r)
            + "</tr>"
            for r in rows
        )
        + "</table>"
    )


def diag(img, cap):
    return (
        f'<div class="diagram"><img src="img/{img}" alt="{cap}"></div>'
        f'<p class="diagram-caption">{cap}</p>'
    )


TOPICS = {}
_content_dir = os.path.dirname(__file__)
exec(
    compile(
        open(os.path.join(_content_dir, "ai_fundamentals_content.py"), encoding="utf-8").read(),
        "ai_fundamentals_content.py",
        "exec",
    )
)

if __name__ == "__main__":
    for slug, cfg in TOPICS.items():
        path = os.path.join(OUT, slug + ".html")
        with open(path, "w", encoding="utf-8") as f:
            f.write(page(**cfg))
        print("Wrote", path)
