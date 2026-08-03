#!/usr/bin/env python3
"""Strip the legacy inline <style> blocks (and duplicated lightbox <script>)
from the hand-authored cheat sheets.

Everything those blocks provided now lives in theme.css + sheet-shell.css,
which sheet-shell.css pulls in via @import — so no <link> edits are needed.

Safety: refuses to touch a file whose <style> tags are not the plain, balanced,
attribute-free form the audit verified across all 351 occurrences, and asserts
the structural invariants sheet-shell.js depends on both before and after.

Usage:
  python3 scripts/strip_sheet_css.py --check <paths...>   # report only
  python3 scripts/strip_sheet_css.py --apply <paths...>   # rewrite in place
"""
import argparse
import re
import sys
from pathlib import Path

STYLE = re.compile(r'[ \t]*<style>(.*?)</style>\n?', re.S)
# the lightbox IIFE duplicated across 162 sheets; sheet-shell.js owns it now
LIGHTBOX_JS = re.compile(
    r'[ \t]*<script>\s*\(function\(\)\s*\{[^\0]*?getElementById\([\'"]lightbox[\'"]\)'
    r'[^\0]*?\}\)\(\);\s*</script>\n?', re.S)
MERMAID_TAG = re.compile(r'[ \t]*<script[^>]*\bmermaid[^>]*></script>\n?')


def invariants(html):
    """The structural facts sheet-shell.js and the lightbox depend on."""
    return {
        'nav': len(re.findall(r'<nav class="nav">', html)),
        'nav_h2': len(re.findall(r'<nav class="nav">.*?<h2', html, re.S)),
        'anchors': len(re.findall(r'href="#', html)),
        'sections': len(re.findall(r'<section id=', html)),
        'diagrams': len(re.findall(r'class="diagram"', html)),
        'captions': len(re.findall(r'class="diagram-caption"', html)),
        # the six frozen syntax classes must survive untouched
        'syn': sum(len(re.findall(r'class="%s"' % c, html)) for c in
                   ('kw', 'tp', 'fn', 'cm', 'st', 'nr')),
        'lightbox_markup': len(re.findall(r'id="lightbox"', html)),
    }


def caption_adjacency_ok(html):
    """Every .diagram must be immediately followed by its .diagram-caption:
    the lightbox reads diag.nextElementSibling."""
    for m in re.finditer(r'<div class="diagram">.*?</div>\s*', html, re.S):
        tail = html[m.end():m.end() + 120]
        if 'diagram-caption' not in tail:
            return False
    return True


def unsafe_reason(html):
    if html.count('<style') != html.count('<style>'):
        return 'a <style> tag carries attributes'
    if html.count('<style>') != html.count('</style>'):
        return 'unbalanced <style> tags'
    if '&lt;style' in html:
        return 'escaped <style> in content'
    if 'sheet-shell.css' not in html:
        return 'does not load sheet-shell.css'
    return None


def process(path, apply):
    src = path.read_text(encoding='utf-8')
    reason = unsafe_reason(src)
    if reason:
        return {'file': str(path), 'skipped': reason}

    before = invariants(src)
    out = src

    n_style = len(STYLE.findall(out))
    out = STYLE.sub('', out)

    n_lb = len(LIGHTBOX_JS.findall(out))
    out = LIGHTBOX_JS.sub('', out)

    # mermaid CDN is dead weight on sheets with no .mermaid block
    n_merm = 0
    if 'class="mermaid"' not in out:
        n_merm = len(MERMAID_TAG.findall(out))
        out = MERMAID_TAG.sub('', out)

    after = invariants(out)
    if before != after:
        diff = {k: (before[k], after[k]) for k in before if before[k] != after[k]}
        return {'file': str(path), 'skipped': f'invariants changed: {diff}'}
    if not caption_adjacency_ok(out):
        return {'file': str(path), 'skipped': 'diagram/caption adjacency broken'}

    if apply and out != src:
        path.write_text(out, encoding='utf-8')

    return {'file': str(path), 'style': n_style, 'lightbox': n_lb,
            'mermaid': n_merm, 'saved': len(src) - len(out)}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--apply', action='store_true')
    ap.add_argument('paths', nargs='+')
    a = ap.parse_args()

    files = []
    for p in a.paths:
        pp = Path(p)
        files.extend(sorted(pp.rglob('*.html')) if pp.is_dir() else [pp])

    ok, skipped, saved, styles, lbs, merms = 0, [], 0, 0, 0, 0
    for f in files:
        r = process(f, a.apply)
        if 'skipped' in r:
            skipped.append(r)
        else:
            ok += 1
            saved += r['saved']
            styles += r['style']
            lbs += r['lightbox']
            merms += r['mermaid']

    print(f"{'APPLIED' if a.apply else 'CHECK'}: {ok} file(s) ok, {len(skipped)} skipped")
    print(f"  <style> blocks removed : {styles}")
    print(f"  lightbox <script>      : {lbs}")
    print(f"  dead mermaid <script>  : {merms}")
    print(f"  bytes                  : {saved:,}")
    for s in skipped:
        print(f"  SKIP {s['file']}: {s['skipped']}")
    return 1 if skipped else 0


if __name__ == '__main__':
    sys.exit(main())
