#!/usr/bin/env python3
"""Inject sheet-shell and hub.js into cheatsheet HTML files."""

import os
import re

ROOT = os.path.join(os.path.dirname(__file__), '..', 'docs', 'cheatsheets')
ROOT = os.path.abspath(ROOT)

HUB_PAGES = {
    'index.html': 'theme-hld',
    'lld/index.html': 'theme-lld',
    'hld/hub.html': 'theme-hld',
    'hld/index.html': 'theme-hld',
    'dsa/index.html': 'theme-dsa',
    'ai/index.html': 'theme-ai',
    'ai/fundamentals/index.html': 'theme-ai',
    'ai/tech/index.html': 'theme-ai',
    'ai/systems/index.html': 'theme-ai',
    'ai/stretch/index.html': 'theme-ai',
    'concepts/index.html': 'theme-hld',
    'tech/index.html': 'theme-hld',
    'stretch/index.html': 'theme-hld',
}

SHELL_CSS = '<link rel="stylesheet" href="{root}sheet-shell.css">'
SHELL_JS = '<script src="{root}sheet-shell.js" defer></script>'
HUB_JS = '<script src="{root}hub.js" defer></script>'


def depth(rel_path):
    parts = rel_path.split('/')
    return max(0, len(parts) - 1)


def root_prefix(rel_path):
    d = depth(rel_path)
    return '../' * d if d else './'


def is_sheet(rel_path):
    if rel_path in HUB_PAGES:
        return False
    if rel_path.endswith('/index.html'):
        return False
    if rel_path == 'index.html':
        return False
    full = os.path.join(ROOT, rel_path)
    if not os.path.isfile(full):
        return False
    with open(full, 'r', encoding='utf-8') as f:
        content = f.read()
    return 'class="nav"' in content and 'shared.css' not in content


def patch_file(rel_path, mode):
    full = os.path.join(ROOT, rel_path)
    with open(full, 'r', encoding='utf-8') as f:
        html = f.read()

    root = root_prefix(rel_path)
    changed = False

    if mode == 'sheet':
        css_tag = SHELL_CSS.format(root=root)
        js_tag = SHELL_JS.format(root=root)
        if 'sheet-shell.css' not in html:
            html = html.replace('</head>', css_tag + '\n' + js_tag + '\n</head>', 1)
            changed = True
    elif mode == 'hub':
        js_tag = HUB_JS.format(root=root)
        theme = HUB_PAGES.get(rel_path, '')
        if theme and ('class="' + theme + '"') not in html and ('class="container"') in html:
            html = html.replace('<body>', '<body class="' + theme + '">', 1)
            if '<body class="' + theme + '">' not in html:
                html = re.sub(r'<body(\s[^>]*)?>', '<body class="' + theme + r'\1">', html, count=1)
            changed = True
        if 'hub.js' not in html:
            html = html.replace('</body>', js_tag + '\n</body>', 1)
            changed = True
        # strip noisy per-card gradient overrides
        html = re.sub(r'\n<style>\.card\{position:relative[^<]*</style>', '', html)
        html = re.sub(r'\n<style>\.sub-card:hover\{border-color:[^<]*</style>', '', html)

    if changed:
        with open(full, 'w', encoding='utf-8') as f:
            f.write(html)
    return changed


def main():
    sheet_count = hub_count = 0
    for dirpath, _, filenames in os.walk(ROOT):
        for fn in filenames:
            if not fn.endswith('.html'):
                continue
            rel = os.path.relpath(os.path.join(dirpath, fn), ROOT).replace('\\', '/')
            if rel in HUB_PAGES:
                if patch_file(rel, 'hub'):
                    hub_count += 1
            elif is_sheet(rel):
                if patch_file(rel, 'sheet'):
                    sheet_count += 1
    print('Patched %d sheet pages, %d hub pages' % (sheet_count, hub_count))


if __name__ == '__main__':
    main()
