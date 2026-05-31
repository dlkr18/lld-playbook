#!/usr/bin/env python3
"""Fix common Mermaid classDiagram syntax that breaks v10 (brackets, generics)."""

import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DOCS = os.path.join(ROOT, "docs")


def sanitize_block(block: str) -> str:
    lines = []
    for line in block.splitlines():
        if line.strip().startswith("classDiagram") or line.strip().startswith("class "):
            lines.append(line)
            continue
        if "-->" in line or "..>" in line or "..|>" in line:
            lines.append(line)
            continue
        # class member lines
        line = re.sub(r"(\w+)\[\[\]", r"\1Grid", line)
        line = re.sub(r"(\w+)\[\]", r"\1Array", line)
        line = re.sub(r"Optional~([^~]+)~", r"Optional \1", line)
        line = re.sub(r"Optional\[([^\]]+)\]", r"Optional \1", line)
        line = re.sub(r"List~([^~]+)~", r"List \1", line)
        line = line.replace("String[]", "StringArray")
        lines.append(line)
    return "\n".join(lines)


def fix_file(path: str) -> bool:
    with open(path, encoding="utf-8") as fh:
        text = fh.read()
    changed = False

    def repl(m):
        nonlocal changed
        inner = m.group(1)
        fixed = sanitize_block(inner)
        if fixed != inner:
            changed = True
        return "```mermaid\n" + fixed + "\n```"

    new_text = re.sub(r"```mermaid\n([\s\S]*?)```", repl, text)
    if changed:
        with open(path, "w", encoding="utf-8") as fh:
            fh.write(new_text)
    return changed


def main():
    count = 0
    for dirpath, _, files in os.walk(DOCS):
        for name in files:
            if not name.endswith((".md", ".mmd")):
                continue
            path = os.path.join(dirpath, name)
            if fix_file(path):
                print("fixed", os.path.relpath(path, ROOT))
                count += 1
    print(f"Done: {count} files updated")


if __name__ == "__main__":
    main()
