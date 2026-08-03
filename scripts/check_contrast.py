#!/usr/bin/env python3
"""Verify every colour pair in docs/theme.css meets WCAG AA.

Floors: 4.5:1 for text, 3:1 for large text and UI boundaries (borders, rails).

Run from the repo root:   python3 scripts/check_contrast.py
Exits non-zero on any failure, so it can gate a commit.
"""
import re
import sys
from pathlib import Path

CSS = Path(__file__).resolve().parent.parent / "docs" / "theme.css"

# (foreground token, background token, floor, label)
PAIRS = [
    ("--text-heading",   "--surface-raised", 4.5, "heading on raised"),
    ("--text-primary",   "--surface-raised", 4.5, "body on raised"),
    ("--text-primary",   "--surface-page",   4.5, "body on page"),
    ("--text-secondary", "--surface-raised", 4.5, "secondary on raised"),
    ("--text-muted",     "--surface-raised", 4.5, "muted on raised"),
    ("--text-muted",     "--surface-sunken", 4.5, "muted on sunken (th label)"),
    ("--accent",         "--surface-raised", 4.5, "link on raised"),
    ("--accent",         "--surface-page",   4.5, "link on page"),
    ("--accent",         "--surface-code",   4.5, "link on code"),
    ("--accent",         "--accent-soft",    4.5, "accent on its soft fill"),
    ("--accent-fg",      "--accent",         4.5, "text on accent fill"),
    ("--border-strong",  "--surface-raised", 3.0, "input border (UI)"),
    ("--syn-base",       "--surface-code",   4.5, "code base"),
    ("--syn-kw",         "--surface-code",   4.5, ".kw"),
    ("--syn-tp",         "--surface-code",   4.5, ".tp"),
    ("--syn-fn",         "--surface-code",   4.5, ".fn"),
    ("--syn-cm",         "--surface-code",   4.5, ".cm"),
    ("--syn-st",         "--surface-code",   4.5, ".st"),
    ("--syn-nr",         "--surface-code",   4.5, ".nr"),
    ("--success",        "--success-soft",   4.5, "success on soft"),
    ("--warn",           "--warn-soft",      4.5, "warn on soft"),
    ("--danger",         "--danger-soft",    4.5, "danger on soft"),
    ("--info",           "--info-soft",      4.5, "info on soft"),
]
for _v in ("lld", "hld", "dsa", "prc", "ai"):
    PAIRS += [
        (f"--v-{_v}-fg", "--surface-raised", 4.5, f"{_v} label on raised"),
        (f"--v-{_v}-fg", f"--v-{_v}-soft",   4.5, f"{_v} label on its chip"),
        (f"--v-{_v}",    "--surface-page",   3.0, f"{_v} rail (UI)"),
    ]


def tokens(css, theme):
    sel = r":root" if theme == "light" else r'\[data-theme="dark"\]'
    m = re.search(sel + r"\s*\{(.*?)\n\}", css, re.S)
    if not m:
        sys.exit(f"could not find the {theme} token block in {CSS}")
    return dict(re.findall(r"(--[\w-]+):\s*([^;]+);", m.group(1)))


def rgb(value):
    value = value.strip()
    if value.startswith("#"):
        h = value[1:]
        if len(h) == 3:
            h = "".join(c * 2 for c in h)
        return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))
    m = re.match(r"rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)", value)
    if m:
        return tuple(int(float(g)) for g in m.groups())
    return None


def luminance(c):
    def channel(v):
        v /= 255
        return v / 12.92 if v <= 0.03928 else ((v + 0.055) / 1.055) ** 2.4
    r, g, b = (channel(x) for x in c)
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def ratio(fg, bg):
    l1, l2 = luminance(rgb(fg)), luminance(rgb(bg))
    hi, lo = max(l1, l2), min(l1, l2)
    return (hi + 0.05) / (lo + 0.05)


def main():
    css = CSS.read_text()
    failures = []
    for theme in ("light", "dark"):
        t = tokens(css, theme)
        print(f"\n=== {theme.upper()} ===")
        for fg, bg, floor, label in PAIRS:
            if fg not in t or bg not in t:
                failures.append(f"{theme}: missing token {fg} or {bg}")
                print(f"  MISSING  {label}")
                continue
            r = ratio(t[fg], t[bg])
            ok = r >= floor
            if not ok:
                failures.append(f"{theme}: {label} is {r:.2f}, needs {floor}")
            print(f"  {'ok  ' if ok else 'FAIL'} {r:5.2f} (>={floor})  {label}")

    print()
    if failures:
        for f in failures:
            print("FAIL:", f)
        print(f"\n{len(failures)} contrast failure(s)")
        return 1
    print(f"all {len(PAIRS) * 2} pairs pass WCAG AA")
    return 0


if __name__ == "__main__":
    sys.exit(main())
