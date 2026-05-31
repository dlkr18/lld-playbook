#!/usr/bin/env python3
"""Compare Java source file counts vs CODE.md walkthrough coverage."""

import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "src/main/java/com/you/lld/problems")
DOCS = os.path.join(ROOT, "docs/problems")


def java_files(slug):
    base = os.path.join(SRC, slug.replace("-", ""))
    if not os.path.isdir(base):
        base = os.path.join(SRC, slug)
    if not os.path.isdir(base):
        return []
    out = []
    for dirpath, _, files in os.walk(base):
        for f in files:
            if f.endswith(".java"):
                rel = os.path.join(dirpath, f)[len(base) + 1:]
                out.append(rel.replace(os.sep, "/"))
    return sorted(out)


def code_md_files(slug):
    path = os.path.join(DOCS, slug, "CODE.md")
    if not os.path.isfile(path):
        return None
    with open(path, encoding="utf-8") as fh:
        text = fh.read()
    return len(re.findall(r"^### `[^`]+`", text, re.MULTILINE))


def has_template_readme(slug):
    path = os.path.join(DOCS, slug, "README.md")
    if not os.path.isfile(path):
        return False
    with open(path, encoding="utf-8") as fh:
        return "class Service {" in fh.read()


def main():
    slugs = sorted(
        d for d in os.listdir(DOCS)
        if os.path.isdir(os.path.join(DOCS, d)) and d not in ("diagrams",)
    )
    stale_code = []
    stale_readme = []
    missing_code = []

    print("| Problem | Java files | CODE.md sections | README template? |")
    print("|---------|------------|------------------|------------------|")
    for slug in slugs:
        jf = java_files(slug)
        if not jf:
            continue
        sections = code_md_files(slug)
        tmpl = has_template_readme(slug)
        sec_str = str(sections) if sections is not None else "—"
        print(f"| {slug} | {len(jf)} | {sec_str} | {'yes' if tmpl else 'no'} |")
        if sections is None:
            missing_code.append(slug)
        elif sections < len(jf):
            stale_code.append((slug, len(jf), sections))
        if tmpl:
            stale_readme.append(slug)

    print("\nSummary:")
    print(f"  Template READMEs (generic diagrams): {len(stale_readme)}")
    print(f"  CODE.md missing: {len(missing_code)}")
    print(f"  CODE.md likely stale (fewer sections than .java files): {len(stale_code)}")
    if stale_code[:5]:
        print("  Examples:", ", ".join(f"{s} ({j}>{c})" for s, j, c in stale_code[:5]))


if __name__ == "__main__":
    main()
