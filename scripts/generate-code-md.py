#!/usr/bin/env python3
"""
Regenerate docs/problems/<slug>/CODE.md from Java sources under src/main/java.

Usage:
  python3 scripts/generate-code-md.py              # all problems
  python3 scripts/generate-code-md.py tictactoe parkinglot
"""

from __future__ import annotations

import os
import re
import sys
from datetime import date

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC_ROOT = os.path.join(ROOT, "src/main/java/com/you/lld/problems")
DOCS_ROOT = os.path.join(ROOT, "docs/problems")

# docs folder name -> Java package folder name
DOC_TO_SRC = {
    "loggingframework": "logging",
    "lru-cache": "lrucache",
    "url-shortener": "urlshortener",
    "search": None,
}

SKIP_DOC_DIRS = {"diagrams"}


def resolve_src_slug(doc_slug: str) -> str | None:
    if doc_slug in DOC_TO_SRC:
        return DOC_TO_SRC[doc_slug]
    src = os.path.join(SRC_ROOT, doc_slug)
    if os.path.isdir(src):
        return doc_slug
    alt = doc_slug.replace("-", "")
    if os.path.isdir(os.path.join(SRC_ROOT, alt)):
        return alt
    return None


def collect_java_files(src_slug: str) -> list[str]:
    base = os.path.join(SRC_ROOT, src_slug)
    files: list[str] = []
    for dirpath, _, names in os.walk(base):
        for name in names:
            if name.endswith(".java"):
                rel = os.path.join(dirpath, name)[len(base) + 1 :]
                files.append(rel.replace(os.sep, "/"))
    return files


def file_sort_key(rel: str) -> tuple:
    name = os.path.basename(rel)
    if name.endswith("Demo.java"):
        return (0, rel)
    depth = rel.count("/")
    if depth == 0:
        return (1, rel)
    top = rel.split("/")[0]
    order = {"api": 2, "model": 3, "service": 4, "exception": 5, "impl": 6, "appender": 6,
             "formatter": 6, "filter": 6}
    return (order.get(top, 7), rel)


def build_tree(paths: list[str], root_name: str) -> str:
    lines = [f"{root_name}/"]
    for rel in paths:
        lines.append(f"├── {rel}")
    return "\n".join(lines)


def find_demo_main_class(src_slug: str, paths: list[str]) -> str | None:
    for rel in paths:
        if not rel.endswith("Demo.java"):
            continue
        path = os.path.join(SRC_ROOT, src_slug, rel.replace("/", os.sep))
        with open(path, encoding="utf-8") as fh:
            text = fh.read()
        m = re.search(r"package\s+([\w.]+);", text)
        cls = os.path.basename(rel)[:-5]
        if m:
            return f"{m.group(1)}.{cls}"
    return None


def read_java(src_slug: str, rel: str) -> str:
    path = os.path.join(SRC_ROOT, src_slug, rel.replace("/", os.sep))
    with open(path, encoding="utf-8") as fh:
        return fh.read().rstrip() + "\n"


def generate_code_md(doc_slug: str, src_slug: str) -> str:
    paths = sorted(collect_java_files(src_slug), key=file_sort_key)
    if not paths:
        raise ValueError(f"No Java files for {src_slug}")

    demo_cmd = find_demo_main_class(src_slug, paths)

    parts = [
        f"# {doc_slug} - Complete Implementation",
        "",
        f"> Generated from `src/main/java/com/you/lld/problems/{src_slug}/` "
        f"on {date.today().isoformat()}. Re-run `python3 scripts/generate-code-md.py {doc_slug}`.",
        "",
        f"## Project Structure ({len(paths)} files)",
        "",
        "```",
        build_tree(paths, src_slug),
        "```",
        "",
        "## Source Code",
        "",
    ]

    for rel in paths:
        content = read_java(src_slug, rel)
        parts.extend([
            f"### `{rel}`",
            "",
            "<details>",
            f"<summary>Click to view {rel}</summary>",
            "",
            "```java",
            content.rstrip("\n"),
            "```",
            "",
            "</details>",
            "",
        ])

    if demo_cmd:
        parts.extend([
            "## Run Demo",
            "",
            "```bash",
            f'mvn -q compile exec:java -Dexec.mainClass="{demo_cmd}"',
            "```",
            "",
        ])

    return "\n".join(parts)


def all_doc_slugs() -> list[str]:
    return sorted(
        d
        for d in os.listdir(DOCS_ROOT)
        if os.path.isdir(os.path.join(DOCS_ROOT, d)) and d not in SKIP_DOC_DIRS
    )


def main(argv: list[str]) -> int:
    targets = argv[1:] if len(argv) > 1 else all_doc_slugs()
    ok, skipped, failed = 0, 0, 0

    for doc_slug in targets:
        src_slug = resolve_src_slug(doc_slug)
        if not src_slug:
            print(f"SKIP {doc_slug}: no Java source")
            skipped += 1
            continue
        try:
            md = generate_code_md(doc_slug, src_slug)
            out = os.path.join(DOCS_ROOT, doc_slug, "CODE.md")
            os.makedirs(os.path.dirname(out), exist_ok=True)
            with open(out, "w", encoding="utf-8") as fh:
                fh.write(md)
            n = len(collect_java_files(src_slug))
            print(f"OK   {doc_slug} <- {src_slug} ({n} files)")
            ok += 1
        except Exception as exc:
            print(f"FAIL {doc_slug}: {exc}")
            failed += 1

    print(f"\nDone: {ok} generated, {skipped} skipped, {failed} failed")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
