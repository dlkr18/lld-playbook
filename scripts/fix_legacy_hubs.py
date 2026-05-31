#!/usr/bin/env python3
"""Fix legacy hub index pages: valid HTML, shared.css only, consistent layout."""

import os
import re

ROOT = os.path.join(os.path.dirname(__file__), '..', 'docs', 'cheatsheets')
ROOT = os.path.abspath(ROOT)

HUBS = {
    'dsa/index.html': {
        'theme': 'theme-dsa',
        'breadcrumbs': '<div class="breadcrumbs"><a href="../index.html">Cheat Sheets</a><span>/</span> DSA</div>',
        'header': '''  <header class="page-header">
    <h1>Data Structures &amp; <span>Algorithms</span></h1>
    <p class="subtitle">Topic-wise quick reference with templates, patterns, and complexity analysis.</p>
    <div class="stats"><span class="stat"><strong>23</strong> topics</span></div>
  </header>
  <div class="section">''',
        'old_header_pattern': r'<h1>DSA.*?</a>\s*\n\s*<div class="grid">',
    },
    'hld/index.html': {
        'theme': 'theme-hld',
        'remove_back': True,
        'header_class': True,
    },
    'concepts/index.html': {
        'theme': 'theme-hld',
        'breadcrumbs': '<div class="breadcrumbs"><a href="../index.html">Cheat Sheets</a><span>/</span><a href="../hld/hub.html">HLD</a><span>/</span> Concepts</div>',
        'remove_back': True,
        'header_class': True,
    },
    'tech/index.html': {
        'theme': 'theme-hld',
        'breadcrumbs': '<div class="breadcrumbs"><a href="../index.html">Cheat Sheets</a><span>/</span><a href="../hld/hub.html">HLD</a><span>/</span> Tech</div>',
        'remove_back': True,
        'header_class': True,
    },
    'stretch/index.html': {
        'theme': 'theme-hld',
        'breadcrumbs': '<div class="breadcrumbs"><a href="../index.html">Cheat Sheets</a><span>/</span><a href="../hld/hub.html">HLD</a><span>/</span> Stretch</div>',
        'remove_back': True,
        'header_class': True,
    },
}


def fix_hub(rel, cfg):
    path = os.path.join(ROOT, rel)
    with open(path, 'r', encoding='utf-8') as f:
        html = f.read()

    # strip inline styles — shared.css is source of truth
    html = re.sub(r'<style>.*?</style>\s*', '', html, count=1, flags=re.DOTALL)

    # ensure fonts + shared.css in head
    if 'shared.css' not in html:
        html = html.replace(
            '</title>',
            '</title>\n<link rel="preconnect" href="https://fonts.googleapis.com">\n'
            '<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">\n'
            '<link rel="stylesheet" href="../shared.css">',
            1,
        )

    # close head / open body before nav
    theme = cfg['theme']
    if '</head>' not in html:
        html = html.replace(
            '<nav class="site-nav">',
            '</head>\n<body class="' + theme + '">\n<nav class="site-nav">',
            1,
        )
    elif '<body' not in html:
        html = html.replace('</head>', '</head>\n<body class="' + theme + '">', 1)

    # body class
    html = re.sub(r'<body(?:\s+class="[^"]*")?\s*>', '<body class="' + theme + '">', html, count=1)

    if 'old_header_pattern' in cfg:
        html = re.sub(
            cfg['old_header_pattern'],
            cfg['breadcrumbs'] + '\n' + cfg['header'] + '\n    <div class="grid">',
            html,
            count=1,
            flags=re.DOTALL,
        )
        # close section + container before script
        html = re.sub(
            r'\n</div>\s*\n<script src="../hub.js"',
            '\n    </div>\n  </div>\n</div>\n<script src="../hub.js"',
            html,
            count=1,
        )

    if cfg.get('breadcrumbs') and cfg.get('breadcrumbs') not in html:
        html = html.replace('<div class="container">', '<div class="container">\n' + cfg['breadcrumbs'], 1)

    if cfg.get('header_class'):
        html = html.replace('<header>', '<header class="page-header">', 1)

    if cfg.get('remove_back'):
        html = re.sub(r'\s*<a href="[^"]*" class="back">[^<]*</a>\s*', '\n', html)

    # hld/index duplicate breadcrumbs cleanup
    html = html.replace(
        '<a href="hub.html" class="back">&larr; HLD Hub</a>',
        '',
    )

    if 'hub.js' not in html:
        html = html.replace('</body>', '<script src="../hub.js" defer></script>\n</body>')

    with open(path, 'w', encoding='utf-8') as f:
        f.write(html)
    print('Fixed', rel)


def main():
    for rel, cfg in HUBS.items():
        fix_hub(rel, cfg)


if __name__ == '__main__':
    main()
