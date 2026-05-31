"""Add exact LeetCode description + memory hook summary to each question."""
import json
import os

from enrichments_data import APPROACH_SUMMARIES, QID_OVERRIDES, SUBTOPIC_SUMMARIES

_LC_CACHE = None
_LC_PATH = os.path.join(os.path.dirname(__file__), "lc_descriptions.json")


def _lc_descriptions():
    global _LC_CACHE
    if _LC_CACHE is None:
        with open(_LC_PATH, encoding="utf-8") as f:
            _LC_CACHE = json.load(f)
    return _LC_CACHE


def enrich_question(q):
    q = dict(q)
    qid = q.get("id", "")
    lc = q.get("lc")
    sub = q.get("subtopic", "")
    approaches = q.get("approaches") or []
    primary = approaches[0].get("name", "") if approaches else ""

    desc_html = None
    lc_slug = None

    if qid in QID_OVERRIDES:
        desc, summ = QID_OVERRIDES[qid]
    elif lc and str(lc) in _lc_descriptions():
        entry = _lc_descriptions()[str(lc)]
        desc = entry["contentText"]
        desc_html = entry["contentHtml"]
        lc_slug = entry.get("titleSlug")
        summ = _summary_for(q, primary, sub, lc)
    elif lc:
        raise ValueError("Missing LeetCode description for LC %s (%s). Run fetch_lc_descriptions.py." % (lc, q.get("title")))
    else:
        desc, summ = QID_OVERRIDES.get(qid, (None, None))
        if not desc:
            desc, summ = _custom_fallback(q, primary, sub)

    q["description"] = desc
    if desc_html:
        q["descriptionHtml"] = desc_html
    if lc_slug:
        q["lcSlug"] = lc_slug
    q["summary"] = summ
    return q


def _summary_for(q, primary, sub, lc):
    summ = APPROACH_SUMMARIES.get(primary)
    if not summ:
        summ = APPROACH_SUMMARIES.get("LC%d" % lc)
    if not summ:
        summ = SUBTOPIC_SUMMARIES.get(sub)
    if not summ and primary:
        summ = "%s — state the invariant, then code." % primary
    return summ or "Identify the core invariant, then implement in one clean pass."


def _custom_fallback(q, primary, sub):
    title = q.get("title", "Problem")
    desc = QID_OVERRIDES.get(q.get("id", ""), (None, None))[0]
    if not desc:
        desc = title
    summ = SUBTOPIC_SUMMARIES.get(sub) or primary
    return desc, summ


def enrich_topic(topic):
    topic = dict(topic)
    topic["questions"] = [enrich_question(q) for q in topic["questions"]]
    return topic
