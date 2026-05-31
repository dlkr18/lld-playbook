#!/usr/bin/env python3
"""Normalize Mermaid classDiagram blocks so Mermaid v9/v10 can parse them."""

import os
import re

ROOT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "docs")
BLOCK = re.compile(r"```mermaid\n([\s\S]*?)```", re.MULTILINE)


def sanitize_class_line(line: str) -> str:
    raw = line
    t = line.strip()

    # structural / relationship lines — leave alone
    if not t:
        return line
    if t in ("{", "}"):
        return line
    if t.startswith("classDiagram") or t.startswith("stateDiagram") or t.startswith("sequenceDiagram"):
        return line
    if t.startswith("flowchart") or t.startswith("graph "):
        return line
    if "-->" in t or "..>" in t or "..|>" in t or "<|--" in t or "<|.." in t:
        return line
    if t.startswith("class ") and "{" in t:
        return line
    if t.startswith("<<") and t.endswith(">>"):
        return line
    if t.startswith("note ") or t.startswith("participant ") or t.startswith("state "):
        return line

    # member or method line inside a class
    indent = line[: len(line) - len(line.lstrip())]

    # stereotypes on own line inside class body
    if t.startswith("<<") and t.endswith(">>"):
        return line

    # Java / UML generics: Set~UserId~, Optional~V~, Map~K,V~
    line = re.sub(r"~([^~\n]+)~", r" \1", line)

    # arrays
    line = re.sub(r"(\w+)\[\[\]", r"\1Grid", line)
    line = re.sub(r"(\w+)\[\]", r"\1Array", line)
    line = re.sub(r"\[[^\]]*\]", "", line)

    # angle generics List<Foo> — strip inner
    line = re.sub(r"<[^>]+>", "", line)

    # multi-arg methods: +foo(A, B) Ret -> +foo() Ret
    def simplify_parens(m):
        inner = m.group(1)
        if "," in inner or "[" in inner or inner.count(" ") > 2:
            return "()"
        return m.group(0)

    line = re.sub(r"\(([^)]*)\)", simplify_parens, line)

    # drop trailing return types with spaces that confuse parser on short methods
    # keep simple token return types
    line = re.sub(r"\)\s+(\w+)\s+(\w+)", r") \2", line)  # rare cleanup

    # collapse double spaces
    line = re.sub(r"  +", " ", line)

    return indent + line.strip() + ("\n" if raw.endswith("\n") else "")


def sanitize_block(block: str) -> str:
    if block.strip().startswith("classDiagram"):
        return "\n".join(sanitize_class_line(ln) for ln in block.splitlines())
    return block


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

    new_text = BLOCK.sub(repl, text)
    if changed:
        with open(path, "w", encoding="utf-8") as fh:
            fh.write(new_text)
    return changed


def main():
    targets = [os.path.join(ROOT, "problems")]
    count = 0
    for base in targets:
        for dirpath, _, files in os.walk(base):
            for name in files:
                if not name.endswith((".md", ".mmd")):
                    continue
                path = os.path.join(dirpath, name)
                if fix_file(path):
                    print("fixed", os.path.relpath(path, ROOT))
                    count += 1
    print(f"Done: {count} files")


if __name__ == "__main__":
    main()
