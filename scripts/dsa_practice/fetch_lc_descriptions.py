#!/usr/bin/env python3
"""Fetch exact LeetCode problem statements via public GraphQL API."""
import json
import os
import re
import time
import urllib.request

OUT = os.path.join(os.path.dirname(__file__), "lc_descriptions.json")
GRAPHQL = "https://leetcode.com/graphql"
HEADERS = {
    "Content-Type": "application/json",
    "User-Agent": "lld-playbook-dsa-practice/1.0",
    "Referer": "https://leetcode.com",
}

LIST_QUERY = """
query problemsetQuestionList($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {
  problemsetQuestionList: questionList(
    categorySlug: $categorySlug
    limit: $limit
    skip: $skip
    filters: $filters
  ) {
    totalNum
    questions: data {
      questionFrontendId
      titleSlug
      title
    }
  }
}
"""

DETAIL_QUERY = """
query questionData($titleSlug: String!) {
  question(titleSlug: $titleSlug) {
    title
    titleSlug
    content
  }
}
"""


def gql(operation_name, query, variables=None):
    body = json.dumps({
        "operationName": operation_name,
        "query": query,
        "variables": variables or {},
    }).encode("utf-8")
    req = urllib.request.Request(GRAPHQL, data=body, headers=HEADERS, method="POST")
    with urllib.request.urlopen(req, timeout=90) as resp:
        data = json.loads(resp.read().decode("utf-8"))
    if "errors" in data:
        raise RuntimeError(data["errors"])
    return data["data"]


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
    text = re.sub(r"<em>(.*?)</em>", r"\1", text, flags=re.I | re.S)
    text = re.sub(r"&#39;", "'", text)
    text = re.sub(r"&quot;", '"', text)
    text = re.sub(r"&lt;", "<", text)
    text = re.sub(r"&gt;", ">", text)
    text = re.sub(r"&nbsp;", " ", text)
    text = strip_tags(text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def strip_tags(s):
    return re.sub(r"<[^>]+>", "", s)


def load_needed_lc():
    root = os.path.join(os.path.dirname(__file__), "..", "..")
    data_dir = os.path.join(root, "docs", "cheatsheets", "dsa-practice", "data")
    needed = set()
    for fname in os.listdir(data_dir):
        if not fname.endswith(".js"):
            continue
        raw = open(os.path.join(data_dir, fname), encoding="utf-8").read()
        raw = raw.replace("window.PRACTICE_TOPIC = ", "").rstrip(";\n")
        topic = json.loads(raw)
        for qq in topic["questions"]:
            if qq.get("lc"):
                needed.add(int(qq["lc"]))
    return needed


def fetch_slug_map():
    print("Fetching LeetCode slug index…")
    by_id = {}
    skip = 0
    page = 100
    total = None
    while total is None or skip < total:
        data = gql("problemsetQuestionList", LIST_QUERY, {
            "categorySlug": "",
            "skip": skip,
            "limit": page,
            "filters": {},
        })
        block = data["problemsetQuestionList"]
        total = block["totalNum"]
        batch = block["questions"]
        if not batch:
            break
        for q in batch:
            try:
                num = int(q["questionFrontendId"])
            except (TypeError, ValueError):
                continue
            by_id[num] = {"titleSlug": q["titleSlug"], "title": q["title"]}
        skip += len(batch)
        print("  …%d / %d" % (skip, total))
        if len(batch) < page:
            break
    print("  indexed %d problems" % len(by_id))
    return by_id


def fetch_all(force=False):
    needed = load_needed_lc()
    by_id = fetch_slug_map()
    existing = {}
    if os.path.isfile(OUT) and not force:
        existing = json.load(open(OUT, encoding="utf-8"))

    result = dict(existing)
    todo = sorted(needed) if force else sorted(needed - {int(k) for k in result.keys()})
    print("Fetching %d LC descriptions (%d cached)" % (len(todo), len(result)))

    for i, lc in enumerate(todo):
        meta = by_id.get(lc)
        if not meta:
            print("  WARN: LC %d not in index" % lc)
            continue
        slug = meta["titleSlug"]
        try:
            d = gql("questionData", DETAIL_QUERY, {"titleSlug": slug})
            q = d["question"]
            content = q["content"] or ""
            result[str(lc)] = {
                "titleSlug": q.get("titleSlug") or slug,
                "title": q.get("title") or meta["title"],
                "contentHtml": content,
                "contentText": html_to_text(content),
            }
            if (i + 1) % 20 == 0 or i + 1 == len(todo):
                print("  %d/%d (LC %d)" % (i + 1, len(todo), lc))
                with open(OUT, "w", encoding="utf-8") as f:
                    json.dump(result, f, ensure_ascii=False)
            time.sleep(0.28)
        except Exception as e:
            print("  ERR LC %d (%s): %s" % (lc, slug, e))
            time.sleep(0.8)

    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(result, f, indent=2, ensure_ascii=False)
    print("Wrote %s (%d entries)" % (OUT, len(result)))
    still = sorted(needed - {int(k) for k in result.keys()})
    if still:
        print("Missing:", still)


if __name__ == "__main__":
    import sys
    fetch_all(force="--force" in sys.argv)
