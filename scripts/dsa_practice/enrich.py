"""Add description + summary (memory hook) to each practice question."""
from enrichments_data import TITLE_DESCRIPTIONS, APPROACH_SUMMARIES, QID_OVERRIDES, SUBTOPIC_SUMMARIES


def enrich_question(q):
    q = dict(q)
    qid = q.get("id", "")
    title = q.get("title", "")
    lc = q.get("lc")
    sub = q.get("subtopic", "")
    approaches = q.get("approaches") or []
    primary = approaches[0].get("name", "") if approaches else ""

    if qid in QID_OVERRIDES:
        desc, summ = QID_OVERRIDES[qid]
    else:
        desc = TITLE_DESCRIPTIONS.get(title)
        if not desc and lc:
            desc = TITLE_DESCRIPTIONS.get("LC%d" % lc)
        if not desc:
            desc = _fallback_description(title, sub)

        summ = APPROACH_SUMMARIES.get(primary)
        if not summ and lc:
            summ = APPROACH_SUMMARIES.get("LC%d" % lc)
        if not summ:
            summ = SUBTOPIC_SUMMARIES.get(sub)
        if not summ:
            summ = _fallback_summary(primary, sub)

    q["description"] = desc
    q["summary"] = summ
    return q


def enrich_topic(topic):
    topic = dict(topic)
    topic["questions"] = [enrich_question(q) for q in topic["questions"]]
    return topic


def _fallback_description(title, subtopic):
    if subtopic:
        return "%s — read constraints and examples, then pick the %s pattern." % (title, subtopic.replace("-", " "))
    return "%s — implement the optimal solution within the given constraints." % title


def _fallback_summary(approach_name, subtopic):
    if approach_name and subtopic:
        return "%s (%s pattern)." % (approach_name, subtopic.replace("-", " "))
    if approach_name:
        return "%s — state the invariant before coding." % approach_name
    return "Identify the core invariant, then implement in one clean pass."
