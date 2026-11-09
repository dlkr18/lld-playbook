#!/usr/bin/env python3
"""Validate deep lessons in scripts/ai_depth/ before a build.

    python3 scripts/check_depth.py              # every lesson
    python3 scripts/check_depth.py rlhf chunking

Checks: loads through build_ai_learning.depth_unit; required sections present;
balanced KaTeX delimiters, no $-maths; enough prose; every <details> has an answer.
"""
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from bs4 import BeautifulSoup  # noqa: E402
from build_ai_learning import DEPTH, depth_unit  # noqa: E402

REQUIRED = ["New words", "The question", "Where people get lost", "Check yourself"]


def check(slug):
    f = DEPTH / f"{slug}.html"
    if not f.exists():
        return [f"missing {f}"]
    raw = f.read_text(encoding="utf-8")
    errs = []
    soup = BeautifulSoup(raw, "html.parser")
    labels = [s["data-label"] for s in soup.find_all("section", attrs={"data-label": True})]
    errs += [f"no section '{r}'" for r in REQUIRED if r not in labels]
    if len(labels) != len(set(labels)):
        errs.append("duplicate section labels")
    if soup.find("script") or soup.find("style"):
        errs.append("no <script>/<style> allowed")
    text = soup.get_text(" ")
    for a, b in (("\\(", "\\)"), ("\\[", "\\]")):
        if text.count(a) != text.count(b):
            errs.append(f"unbalanced {a} {b}: {text.count(a)} vs {text.count(b)}")
    if re.search(r"(?<![\\\w])\$[^$\s][^$]*\$", text.replace("$$", "")) and re.search(r"\$[a-zA-Z\\]", text):
        errs.append("looks like $-delimited maths; use \\( \\) or \\[ \\]")
    words = len(text.split())
    if words < 2000:
        errs.append(f"only {words} words (want 2,000+)")
    qa = soup.find("section", attrs={"data-label": "Check yourself"})
    if qa:
        d = qa.find_all("details")
        if len(d) < 5:
            errs.append(f"only {len(d)} check-yourself questions (want 5+)")
        errs += ["details without <summary> or div.answer" for x in d
                 if not x.find("summary") or not x.find("div", class_="answer")][:1]
    nw = soup.find("section", attrs={"data-label": "New words"})
    if nw and len([tr for tr in nw.find_all("tr") if len(tr.find_all("td")) == 2]) < 6:
        errs.append("New words: want 6+ rows of <tr><td>term</td><td>meaning</td></tr>")
    for a in soup.find_all("a", href=True):
        if not re.fullmatch(r"@@[\w-]+/[\w-]+@@|https?://\S+", a["href"]):
            errs.append(f"bad link {a['href']} (use @@stage/slug@@)")
    try:
        u = depth_unit(slug)
        assert u and u["sections"], "no teaching sections parsed"
    except Exception as e:  # noqa: BLE001
        errs.append(f"depth_unit failed: {e}")
    return errs or [f"ok ({words} words, {len(labels)} sections)"]


if __name__ == "__main__":
    slugs = sys.argv[1:] or sorted(p.stem for p in DEPTH.glob("*.html"))
    bad = 0
    for s in slugs:
        r = check(s)
        bad += not r[0].startswith("ok")
        print(f"{s}: " + "; ".join(r))
    sys.exit(1 if bad else 0)
