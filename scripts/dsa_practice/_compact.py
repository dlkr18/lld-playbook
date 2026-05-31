from _helpers import q, ex, approach


def mk(qid, title, lc, imp, sub, diff, cin, cout, ap_name, time, space, code, note=None, constraints=None):
    cons = constraints or [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale",
    ]
    return q(
        qid, title, lc, imp, sub, diff, cons,
        [ex(cin, cout, note)],
        [approach(ap_name, time, space, code)],
    )


def build_topic(tid, title, expected, strategy, subtopics, questions):
    assert len(questions) == expected, "%s: got %d want %d" % (tid, len(questions), expected)
    return {
        "id": tid,
        "title": title,
        "expected_count": expected,
        "strategy": strategy,
        "subtopics": subtopics,
        "questions": questions,
    }


HUB_META = [
    ("graph", "Graph", "graph", "45", "BFS/DFS, topo, shortest path, UF, MST",
     "Multi-source BFS, topo sort, Dijkstra, union-find, MST — unified graph bank."),
    ("dp", "Dynamic Programming", "dp", "55", "1D, knapsack, LCS, grid, stock",
     "1D, knapsack, LCS/LIS, grid, tree, stock, interval, bitmask DP."),
    ("arrays", "Arrays & Hashing", "arr", "28", "HashMap, HashSet, prefix tricks",
     "Two Sum, anagrams, top-K, consecutive sequence, product except self."),
    ("prefix-sum", "Prefix Sum", "prefix", "22", "1D/2D prefix, subarray sum K",
     "Subarray sum K, range queries, difference array, prefix + hashmap."),
    ("two-pointers", "Two Pointers & Sliding Window", "twoptr", "28", "Opposite, same-dir, variable window",
     "3Sum, container water, min window substring, max consecutive ones III."),
    ("binary-search", "Binary Search", "bsearch", "26", "Exact, first-true, answer space",
     "Rotated array, Koko bananas, ship packages, median of two arrays."),
    ("backtracking", "Backtracking", "backtrack", "28", "Subsets, perms, grid search",
     "Subsets, permutations, N-Queens, Sudoku, word search, combination sum."),
    ("trees", "Binary Trees & BST", "tree", "35", "DFS, BFS, BST, serialize",
     "LCA, diameter, validate BST, serialize, level order, path sum."),
    ("linked-list", "Linked List", "ll", "24", "Fast/slow, reverse, merge",
     "Reverse, cycle detection, merge K lists, LRU cache, reorder list."),
    ("stack", "Stack & Monotonic Stack", "stk", "24", "Monotonic, histogram, RPN",
     "Valid parens, daily temperatures, histogram, trapping rain water."),
    ("heaps", "Heaps & Priority Queues", "heap", "18", "Two heaps, top-K, scheduling",
     "Median stream, top K frequent, merge K lists, meeting rooms II."),
    ("sorting", "Sorting & Selection", "sort", "20", "Quick select, merge sort, Dutch flag",
     "Kth largest, sort colors, merge intervals, count smaller after self."),
    ("tries", "Tries", "trie", "16", "Prefix tree, word search II",
     "Implement trie, add/search words, word search II, XOR trie."),
    ("intervals", "Intervals", "intv", "20", "Merge, sweep line, meeting rooms",
     "Merge intervals, meeting rooms, non-overlapping, calendar design."),
    ("math", "Math & Number Theory", "math", "20", "GCD, sieve, modular arithmetic",
     "Sieve, fast pow, GCD, trailing zeros, happy number."),
    ("bit", "Bit Manipulation", "bit", "20", "XOR, bitmask, bit tricks",
     "Single number, counting bits, missing number, sum without +/-."),
    ("greedy", "Greedy", "greedy", "24", "Intervals, jump game, scheduling",
     "Jump game, gas station, task scheduler, partition labels."),
    ("strings", "String Algorithms", "str", "22", "KMP, palindrome, anagram",
     "Longest palindrome, min window, edit distance, word break."),
    ("dnc", "Divide & Conquer", "dnc", "18", "Merge sort apps, quick select",
     "Pow(x,n), merge sort inversions, median two arrays, skyline."),
    ("segment", "Segment Tree & BIT", "seg", "16", "Fenwick, lazy propagation",
     "Range sum mutable, count smaller, falling squares, lazy propagation."),
]
