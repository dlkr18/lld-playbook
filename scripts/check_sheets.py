#!/usr/bin/env python3
"""Guard the cheat-sheet contract. Run before committing a new or edited sheet.

    python3 scripts/check_sheets.py            # all sheets
    python3 scripts/check_sheets.py <paths...> # just these

Checks, in order of how badly each one bites:

  1. no inline <style>            — 1.3 MB of it was removed; do not regrow it
  2. no lightbox <style>/<script> — sheet-shell.js owns the lightbox
  3. sheet-shell.css is linked    — it @imports theme.css, so it is the only one
  4. nav.nav + <h2> + anchors     — sheet-shell.js bails without them and the
                                    page loses topbar, TOC, scroll-spy, accent
  5. every TOC anchor has a section[id], and vice versa
  6. .diagram-caption immediately follows .diagram (lightbox reads
     nextElementSibling)
  7. no class in the markup is left unstyled by theme/sheet-shell/shared

Exits non-zero on any failure.
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SHEETS_DIR = ROOT / "docs" / "cheatsheets"
CSS_FILES = [
    ROOT / "docs" / "theme.css",
    SHEETS_DIR / "sheet-shell.css",
    SHEETS_DIR / "shared.css",
]
# kept deliberately: their inline blocks are @media print rules
ALLOWED_INLINE = {"machine-coding-kit.html", "concurrency-kit.html"}


def defined_classes():
    css = "".join(f.read_text() for f in CSS_FILES)
    css = re.sub(r"/\*.*?\*/", "", css, flags=re.S)
    return set(re.findall(r"\.([a-zA-Z][\w-]*)", css))


def check(path, defined):
    s = path.read_text(encoding="utf-8")
    # HTML comments are documentation, not markup — the template's own contract
    # notes contain example hrefs that would otherwise read as dead links.
    s = re.sub(r"<!--.*?-->", "", s, flags=re.S)
    name = path.name
    errs = []

    inline = re.findall(r"<style>(.*?)</style>", s, re.S)
    if inline and name not in ALLOWED_INLINE:
        errs.append(f"{len(inline)} inline <style> block(s) — styling belongs in sheet-shell.css")

    if re.search(r"<script>[^\0]*?getElementById\(['\"]lightbox['\"]", s):
        errs.append("inline lightbox <script> — sheet-shell.js owns it")

    if "sheet-shell.css" not in s:
        errs.append("does not link sheet-shell.css")

    nav = re.search(r'<nav class="nav">(.*?)</nav>', s, re.S)
    if not nav:
        errs.append('no <nav class="nav"> — sheet-shell.js will bail')
    else:
        if "<h2" not in nav.group(1):
            errs.append("nav.nav has no <h2> — sheet-shell.js will bail")
        # One direction only. A dead TOC link is a bug; an extra section is
        # not — deep-dive zooms are deliberately nested under a numbered
        # section and left out of the rail.
        anchors = set(re.findall(r'href="#([^"]+)"', nav.group(1)))
        ids = set(re.findall(r'<section id="([^"]+)"', s)) | set(re.findall(r'\bid="([^"]+)"', s))
        for a in sorted(anchors - ids):
            errs.append(f'TOC links #{a} but nothing has that id')

    for m in re.finditer(r'<div class="diagram">.*?</div>\s*', s, re.S):
        if "diagram-caption" not in s[m.end():m.end() + 120]:
            errs.append("a .diagram is not immediately followed by .diagram-caption")
            break

    own = set(re.findall(r"\.([a-zA-Z][\w-]*)", " ".join(inline)))
    orphans = sorted({c for m in re.finditer(r'class="([^"]+)"', s)
                      for c in m.group(1).split()
                      if c not in defined and c not in own})
    if orphans:
        errs.append("unstyled class(es): " + ", ".join("." + c for c in orphans[:8]))

    return errs


def main():
    args = sys.argv[1:]
    if args:
        files = [Path(a) for a in args]
    else:
        files = [f for f in sorted(SHEETS_DIR.rglob("*.html"))
                 if "sheet-shell.css" in f.read_text(encoding="utf-8")]

    defined = defined_classes()
    failed = 0
    for f in files:
        errs = check(f, defined)
        if errs:
            failed += 1
            print(f"FAIL {f.relative_to(ROOT)}")
            for e in errs:
                print(f"       {e}")

    print(f"\n{len(files)} sheet(s) checked, {failed} failing")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
