#!/usr/bin/env python3
"""Fill premium (paid-only) LC descriptions from doocs/leetcode README_EN.md."""
import json
import os
import re
import time
import urllib.parse
import urllib.request

OUT = os.path.join(os.path.dirname(__file__), "lc_descriptions.json")
RAW = "https://raw.githubusercontent.com/doocs/leetcode/main"

# doocs folder title when it differs from LeetCode API title
DOOCS_TITLE_OVERRIDE = {
    323: "Number of Connected Components in an Undirected Graph",
    1168: "Optimize Water Distribution in a Village",
}


def http_get(url):
    req = urllib.request.Request(url, headers={"User-Agent": "lld-playbook/1.0"})
    with urllib.request.urlopen(req, timeout=60) as resp:
        return resp.read().decode("utf-8")


def html_to_text(html):
    if not html:
        return ""
    text = html
    text = re.sub(r"<br\s*/?>", "\n", text, flags=re.I)
    text = re.sub(r"</p>\s*<p>", "\n\n", text, flags=re.I)
    text = re.sub(r"</li>\s*", "\n", text, flags=re.I)
    text = re.sub(r"<li>", "• ", text, flags=re.I)
    text = re.sub(r"<pre>(.*?)</pre>", lambda m: "\n" + strip_tags(m.group(1)) + "\n", text, flags=re.I | re.S)
    text = re.sub(r"<code>(.*?)</code>", r"`\1`", text, flags=re.I | re.S)
    text = re.sub(r"<strong>(.*?)</strong>", r"\1", text, flags=re.I | re.S)
    text = re.sub(r"<b>(.*?)</b>", r"\1", text, flags=re.I | re.S)
    text = re.sub(r"&#39;", "'", text)
    text = re.sub(r"&quot;", '"', text)
    text = re.sub(r"&lt;", "<", text)
    text = re.sub(r"&gt;", ">", text)
    text = strip_tags(text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def strip_tags(s):
    return re.sub(r"<[^>]+>", "", s)


def bucket_for(lc):
    if lc <= 99:
        return "0001-0099"
    lo = (lc // 100) * 100
    return "%04d-%04d" % (lo, lo + 99)


def doocs_readme_url(lc, title):
    folder_title = DOOCS_TITLE_OVERRIDE.get(lc, title)
    path = "solution/%s/%04d.%s/README_EN.md" % (bucket_for(lc), lc, folder_title)
    return RAW + "/" + "/".join(urllib.parse.quote(part, safe="") for part in path.split("/"))


def extract_description(md):
    m = re.search(r"<!-- description:start -->(.*?)<!-- description:end -->", md, re.S)
    if not m:
        return None, None
    html = m.group(1).strip()
    html = html.replace("&lt;", "<").replace("&gt;", ">").replace("&amp;", "&")
    return html, html_to_text(html)


def main():
    data = json.load(open(OUT, encoding="utf-8"))
    empty = [int(k) for k, v in data.items() if not v.get("contentHtml")]
    if not empty:
        print("No empty descriptions.")
        return
    print("Filling %d premium descriptions from doocs…" % len(empty))
    for lc in empty:
        meta = data.get(str(lc), {})
        title = meta.get("title", "")
        url = doocs_readme_url(lc, title)
        try:
            md = http_get(url)
            html, text = extract_description(md)
            if not html:
                print("  WARN: no block LC %d" % lc)
                continue
            data[str(lc)]["contentHtml"] = html
            data[str(lc)]["contentText"] = text
            print("  OK LC %d" % lc)
        except Exception as e:
            print("  ERR LC %d (%s): %s" % (lc, title, e))
        time.sleep(0.12)
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print("Updated", OUT)


if __name__ == "__main__":
    main()
