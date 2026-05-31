#!/usr/bin/env python3
"""Extract and scan all mermaid blocks for syntax that breaks Mermaid v10."""

import os
import re

ROOT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "docs")
BLOCK = re.compile(r"```mermaid\n([\s\S]*?)```", re.MULTILINE)

RISKY = [
    (r"\[\[", "double bracket"),
    (r"\[\]", "array bracket"),
    (r"Optional~", "optional tilde"),
    (r"List~", "list tilde"),
    (r"Map~", "map tilde"),
    (r"Set~", "set tilde"),
    (r"<", "angle bracket"),
    (r">", "angle bracket"),
    (r"@", "annotation"),
    (r"#", "hash"),
    (r"\{", "brace in member"),
    (r"\}", "brace in member"),
]


def scan(path: str, block: str, idx: int) -> list[str]:
    issues = []
    rel = os.path.relpath(path, ROOT)
    for i, line in enumerate(block.splitlines(), 1):
        t = line.strip()
        if not t or t.startswith("classDiagram") or t.startswith("stateDiagram"):
            continue
        if "-->" in t or "..>" in t or "..|>" in t:
            continue
        if t.startswith("class ") and "{" in t:
            continue
        if t in ("```",):
            continue
        for pat, name in RISKY:
            if re.search(pat, line):
                issues.append(f"{rel} block#{idx} L{i}: {name} -> {t[:80]}")
                break
    return issues


def main():
    all_issues = []
    n_blocks = 0
    for dirpath, _, files in os.walk(ROOT):
        for name in files:
            if not name.endswith((".md", ".mmd")):
                continue
            path = os.path.join(dirpath, name)
            with open(path, encoding="utf-8") as fh:
                text = fh.read()
            for idx, block in enumerate(BLOCK.findall(text), 1):
                n_blocks += 1
                all_issues.extend(scan(path, block, idx))
    print(f"Scanned {n_blocks} mermaid blocks")
    print(f"Found {len(all_issues)} risky lines\n")
    for issue in all_issues[:40]:
        print(issue)
    if len(all_issues) > 40:
        print(f"... and {len(all_issues) - 40} more")


if __name__ == "__main__":
    main()
