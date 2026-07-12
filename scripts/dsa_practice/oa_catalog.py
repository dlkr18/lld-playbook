"""OA Supplement — curated GFG / company-OA classics not always in NeetCode 150."""

from _compact import mk
from snippets_oa import CUSTOM_SNIPPETS

# (qid, title, lc, imp, sub, diff, cin, cout, source)
OA_SPECS = [
    ("oa-01", "Equal 0/1/2 Substring Count", None, "must", "prefix-hash", "Medium",
     "string of 0,1,2", "count of valid substrings", "GFG"),
    ("oa-02", "Equal a/b/c Substring Count", None, "must", "prefix-hash", "Medium",
     "string of a,b,c", "count of valid substrings", "GFG"),
    ("oa-03", "Substrings With All a, b, c", None, "must", "sliding-window", "Medium",
     "lowercase a–c only", "count substrings with each char ≥1", "GFG"),
    ("oa-04", "Count Subarrays Equal 0 and 1", None, "must", "prefix-hash", "Medium",
     "binary array", "count (525 asks max length)", "GFG/OA"),
    ("oa-05", "Longest Subarray Sum Zero", None, "must", "prefix-hash", "Medium",
     "int array", "max length", "GFG"),
    ("oa-06", "Aggressive Cows (Max Min Dist)", None, "should", "binary-search", "Hard",
     "sorted stalls, C cows", "maximum minimum distance", "SPOJ/GFG"),
    ("oa-07", "Job Sequencing with Deadlines", None, "should", "greedy", "Medium",
     "jobs with deadline, profit", "max profit", "GFG"),
    ("oa-08", "Minimum Platforms", None, "must", "intervals", "Medium",
     "arrival & departure arrays", "min platforms", "GFG/OA"),
    ("oa-09", "Missing and Repeating Number", None, "must", "math", "Medium",
     "1..n with one missing, one duplicate", "both values", "GFG"),
    ("oa-10", "Max Circular Subarray Sum", None, "should", "array-scan", "Medium",
     "circular int array", "max subarray sum", "GFG/LC918"),
    ("oa-11", "Connect N Ropes (Min Cost)", None, "should", "heap", "Medium",
     "rope lengths", "min merge cost", "GFG"),
    ("oa-12", "Celebrity Problem", None, "nice", "array-scan", "Medium",
     "knows matrix n×n", "celebrity index or −1", "GFG"),
    ("oa-13", "Rat in a Maze", None, "should", "backtracking", "Medium",
     "0/1 grid", "path exists down/right", "GFG"),
    ("oa-14", "Josephus Problem", None, "nice", "math", "Medium",
     "n people, step k", "survivor label 1..n", "GFG/OA"),
    ("oa-15", "Count Pairs With Sum (Sorted)", None, "should", "array-scan", "Easy",
     "sorted array, target", "pair count", "GFG"),
    ("oa-16", "Trapping Rain Water II (2D)", None, "nice", "heap", "Hard",
     "2D height map", "trapped water volume", "LC407/GFG"),
    ("oa-17", "Max in Every Window Size K", None, "must", "sliding-window", "Hard",
     "array, window k", "max per window", "GFG/LC239"),
    ("oa-18", "Equilibrium Index", None, "should", "array-scan", "Easy",
     "int array", "index or −1", "GFG"),
    ("oa-19", "Leaders in Array", None, "nice", "array-scan", "Easy",
     "int array", "leader elements", "GFG"),
    ("oa-20", "Minimum Jumps to End", None, "should", "greedy", "Medium",
     "non-negative jumps", "min jumps", "GFG/LC45"),
    ("oa-21", "Next Smaller Element", None, "should", "stack", "Medium",
     "int array", "NSE per index", "GFG"),
    ("oa-22", "Max Non-Overlapping Meetings", None, "should", "intervals", "Medium",
     "start/end intervals", "max count", "GFG"),
    ("oa-23", "Max Absolute Subarray Sum", None, "nice", "array-scan", "Medium",
     "int array", "max |subarray sum|", "GFG/LC1749"),
    ("oa-24", "Decode String (k[...])", None, "should", "stack", "Medium",
     "nested brackets", "decoded string", "GFG/LC394"),
    ("oa-25", "Sort 0s, 1s, and 2s", None, "must", "array-scan", "Medium",
     "array of 0/1/2", "sorted in-place", "GFG/LC75"),
    ("oa-26", "Rotate Array by K", None, "should", "array-scan", "Medium",
     "array, k", "rotate right in-place", "GFG/LC189"),
    ("oa-27", "strstr / KMP Search", None, "nice", "stack", "Medium",
     "haystack, needle", "first index or −1", "GFG/LC28"),
    ("oa-28", "Merge Sorted Arrays In-Place", None, "should", "array-scan", "Easy",
     "nums1 with space, nums2", "merged nums1", "GFG/LC88"),
    ("oa-29", "Rotten Oranges (BFS)", None, "must", "graph-bfs", "Medium",
     "grid 0/1/2", "minutes or −1", "GFG/LC994"),
    ("oa-30", "Find Duplicate (Floyd)", None, "should", "math", "Medium",
     "n+1 nums in 1..n", "duplicate value", "GFG/LC287"),
    ("oa-31", "Count Inversions", None, "should", "array-scan", "Medium",
     "permutation", "inversion count", "GFG"),
    ("oa-32", "Longest Palindromic Substring", None, "should", "array-scan", "Medium",
     "string", "max palindrome length", "GFG/LC5"),
]


def _build_questions():
    qs = []
    for row in OA_SPECS:
        qid, title, lc, imp, sub, diff, cin, cout = row[:8]
        source = row[8] if len(row) > 8 else "OA"
        ap, t, s, c = CUSTOM_SNIPPETS[qid]
        note = "Source: %s — OA supplement (not always in NeetCode 150)" % source
        qs.append(mk(qid, title, lc, imp, sub, diff, cin, cout, ap, t, s, c, note=note))
    return qs


OA_QUESTIONS = _build_questions()
assert len(OA_QUESTIONS) == 32, len(OA_QUESTIONS)

OA_TOPIC = {
    "id": "oa-supplement",
    "title": "OA Supplement",
    "expected_count": 32,
    "strategy": (
        "<strong>Non-LC must-know:</strong> GFG classics, Striver gaps, and company-OA twists — "
        "one curated variant per pattern where LeetCode sheets stop short. "
        "<ul><li>Start with <em>Must do</em> (prefix-hash + sliding-window variants)</li>"
        "<li>Pair with <a href=\"topics/prefix-sum.html\">Prefix Sum</a> and "
        "<a href=\"topics/two-pointers.html\">Two Pointers</a> for LC overlap</li>"
        "<li>~10 min each — these show up in OA even when not in NeetCode 150</li></ul>"
    ),
    "subtopics": [
        {"id": "prefix-hash", "label": "Prefix + Hash"},
        {"id": "sliding-window", "label": "Sliding Window"},
        {"id": "binary-search", "label": "Binary Search"},
        {"id": "greedy", "label": "Greedy"},
        {"id": "intervals", "label": "Intervals / Sweep"},
        {"id": "heap", "label": "Heap"},
        {"id": "graph-bfs", "label": "Grid BFS"},
        {"id": "stack", "label": "Stack / KMP"},
        {"id": "backtracking", "label": "Backtracking"},
        {"id": "math", "label": "Math / Floyd"},
        {"id": "array-scan", "label": "Array Scan"},
    ],
    "questions": OA_QUESTIONS,
}
