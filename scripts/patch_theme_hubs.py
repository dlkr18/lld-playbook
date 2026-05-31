#!/usr/bin/env python3
"""Add theme.js to cheatsheet hub pages."""

import os
import re

ROOT = os.path.join(os.path.dirname(__file__), '..', 'docs', 'cheatsheets')
ROOT = os.path.abspath(ROOT)

HUBS = [
    'index.html',
    'lld/index.html',
    'hld/hub.html',
    'hld/index.html',
    'dsa/index.html',
    'ai/index.html',
    'ai/fundamentals/index.html',
    'ai/tech/index.html',
    'ai/systems/index.html',
    'ai/stretch/index.html',
    'concepts/index.html',
    'tech/index.html',
    'stretch/index.html',
]

FLASH = '''<script>(function(){var t="dark";try{var s=localStorage.getItem("playbook-theme");if(s==="light"||s==="dark")t=s;else if(matchMedia("(prefers-color-scheme: light)").matches)t="light";}catch(e){}document.documentElement.setAttribute("data-theme",t);})();</script>'''


def depth(rel):
    return rel.count('/')


def patch(rel):
    path = os.path.join(ROOT, rel)
    with open(path, 'r', encoding='utf-8') as f:
        html = f.read()
    changed = False
    d = depth(rel)
    theme_src = '../' * (d + 1) + 'theme.js'

    if 'data-theme' not in html.split('</head>')[0]:
        html = html.replace('</head>', FLASH + '\n</head>', 1)
        changed = True

    if 'theme.js' not in html:
        html = html.replace('</body>', '<script src="' + theme_src + '"></script>\n</body>', 1)
        changed = True

    if changed:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(html)
        print('patched', rel)


def main():
    for rel in HUBS:
        patch(rel)


if __name__ == '__main__':
    main()
