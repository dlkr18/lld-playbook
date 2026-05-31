#!/usr/bin/env python3
"""Generate enrichments_data.py with descriptions and memory-hook summaries."""
import json
import glob
import os

ROOT = os.path.join(os.path.dirname(__file__), "..", "..")
DATA = os.path.join(ROOT, "docs", "cheatsheets", "dsa-practice", "data")

# Memory hooks keyed by primary approach name (what you recall in 3 seconds)
APPROACH_SUMMARIES = {
    "HashMap complement": "One pass: if (target - x) in map → return; else store index of x.",
    "BFS flood fill": "Unvisited land? BFS/DFS sink entire component, count++.",
    "DFS flood fill": "Same as BFS — recursive/stack DFS marks whole island before next scan.",
    "Two pointers greedy": "Move the pointer at the shorter line inward — that's the only way to maybe increase area.",
    "Sliding window": "Expand right; while invalid, shrink left — track best window length/sum.",
    "Variable window": "Expand r; while window invalid, shrink l — O(n) because each index enters/exits once.",
    "Kadane": "cur = max(x, cur+x); best = max(best, cur) — one pass max subarray.",
    "Prefix + hashmap": "Prefix sum + map of {sum → count/index} for subarray sum k problems.",
    "Binary search first true": "lo/hi; if ok(mid) save ans, shrink toward first true (hi=mid-1 or lo=mid+1).",
    "BS on answer": "Binary search the answer; check feasible(mid) monotonically.",
    "Union-Find": "Find root with path compression; union by rank — components in near O(1).",
    "Kahn's BFS topo": "In-degree queue: pop u, push neighbors when in-degree hits 0.",
    "Dijkstra min-heap": "Min-heap of (dist, node); relax edges; skip stale heap entries.",
    "Monotonic stack": "Stack of indices; pop while current violates monotonic property.",
    "Backtrack subsets": "dfs(i): skip i or pick i — save when i==n.",
    "Backtrack permutations": "Pick unused element, recurse, unpick — save at full path.",
    "Interval DP": "dp[l][r] over subintervals — try split k, combine subproblems.",
    "2D tabulation": "Fill table on smaller subproblems first; answer at dp[n][m].",
    "1D rolling": "Only need previous row/layer — reuse one array, iterate backwards if needed.",
    "Trie insert/search": "Walk char edges; mark end — prefix queries in O(L).",
    "Fenwick tree": "add(i,v): i+=i&-i; sum(i): i-=i&-i — point update + prefix sum.",
    "XOR trick": "a^a=0, a^0=a — XOR all cancels pairs, leaves singleton.",
    "Merge sort count": "Merge step counts cross inversions / valid pairs before merge.",
    "atMost trick": "Count subarrays with ≤K distinct = atMost(K) - atMost(K-1).",
    "Two pointers": "Opposite ends or same direction — move based on comparison/invariant.",
    "HashSet sequence heads": "Only start counting at x if x-1 not in set — O(n) consecutive.",
    "Bucket sort by freq": "Freq → bucket index; collect from highest freq buckets.",
    "Sort + two pointers": "Sort first; l/r or fixed i + two pointers on rest.",
    "Greedy farthest": "Track farthest reachable index; jump when i hits current end.",
    "Stack matching": "Push openers; pop on closer; invalid if mismatch or leftover opens.",
    "BFS on implicit graph": "Queue states; mark visited; expand neighbors level by level.",
    "DFS + memoization": "Return cached dfs(state) — top-down DP on graph/grid.",
    "Patience sorting + lower_bound": "LIS: piles of tails; lower_bound for each card.",
    "Unbounded knapsack 1D": "for coin in coins: for s in 1..target: dp[s] = min/max from dp[s-coin].",
    "Subset sum DP": "0/1 knapsack: iterate amounts backwards to avoid reuse.",
    "State machine DP": "dp[day][hold/cash] — transition buy/sell/rest per rules.",
    "Post-order tree DP": "Return (withRoot, withoutRoot) or gain to parent from each subtree.",
    "LCA DFS": "If u==p or q or null return u; merge left/right — if both non-null, u is LCA.",
    "Merge lists": "Dummy tail; attach smaller head; advance — O(n+m).",
    "Floyd cycle": "Slow/fast meet → reset slow to head → advance both until meet at cycle start.",
    "HashMap + DLL": "Map key→list iterator; splice to front on get/put; evict back.",
    "Expand center": "For each center, expand while palindrome — covers odd/even lengths.",
    "Diff array": "range [l,r] += v → diff[l]+=v, diff[r+1]-=v; prefix to rebuild.",
    "Grade-school multiply": "Multiply digit-by-digit into int array; handle carry.",
    "Staircase search": "Start top-right (or bottom-left); go left if too big else down.",
    "Length prefix": "encode: len#str; decode read until # then fixed-length slice.",
    "Bit count mod 3": "ones/twos bits track mod-3 count without division.",
    "Merge from end": "Fill nums1 from back with larger of nums1[i], nums2[j].",
    "Skip dup runs": "If head duplicates, skip whole run; else advance prev.",
    "Catalan DP": "dp[n] += dp[i-1]*dp[n-i] for each root i — count BST structures.",
    "Mirror DFS": "Left subtree must mirror right — compare (a.left, b.right) pairs.",
    "Recursive partition": "Pick root from preorder; split inorder into left/right ranges.",
    "Morris / reverse": "Rightmost of left subtree links to current; flatten to right skew.",
    "Two pass candy": "Left→right if rating up; right→left bump if neighbor lower.",
    "GCD slope map": "Normalize dx,dy by gcd; count points per slope + duplicates.",
    "Stack eval": "Numbers push; operator pop b,a compute push.",
    "Stack + sign": "Track num and sign; '(' push state; ')' pop and combine.",
    "Preorder + markers": "Serialize with null markers; queue rebuild recursively.",
    "2D prefix": "pre[i+1][j+1] = sum of rectangle — O(1) range query.",
    "Burst Balloons": "dp[l][r] = max over last balloon k in (l,r): left*nums[k]*right + subs.",
    "XOR add": "Add without +: xor sum, carry = (a&b)<<1, repeat until carry 0.",
    "RandomizedSet": "Vector + index map — swap-with-last for O(1) delete.",
    "Sort + insert": "Sort by height desc, insert at index p[i] — reconstruct queue.",
    "Greedy arrows": "Sort by end; shoot at end, skip overlapping — min arrows.",
    "Freq window": "Fixed/window size — compare 26-count arrays or sliding counts.",
    "Same tree check": "Same structure and values — DFS compare or serialize compare.",
    "BST delete": "Find node; replace with inorder succ or move left subtree up.",
    "Prefix mod map": "Map remainder → earliest index; len = i - first[rem].",
    "Prefix index map": "Map prefix sum → first index; max len when sum repeats.",
    "Binary search single": "Even/odd index pairing — go left if pair matches else right.",
    "Height DP": "Postorder: ans = max(left+right), return max(left,right)+1.",
    "Fixed window": "Sum first k; slide: add nums[r], subtract nums[l].",
    "Two scans": "Low/high balance for '(' — '*' can be +1, -1, or 0.",
    "Backtrack + prune": "Sort desc; skip equal buckets; prune when bucket sum exceeds target.",
    "Balance scan": "Track balance; extra ')' needed when balance would go negative.",
    "Two pointers merge": "Merge two sorted sequences by comparing fronts.",
    "Sort + heap": "Sort events by day; min-heap of end days — pop expired, attend one per day.",
    "Max heap rearrange": "Always place most frequent char; swap if same as last or fail.",
    "Sweep + map heights": "Coordinate compress x; track active heights per column sweep.",
    "Euclidean GCD": "while(b){ swap a%=b } — lcm = a/gcd* b.",
    "Segment tree RMQ": "Build tree; query max on [l,r] in O(log n).",
    "Lazy segtree": "Push lazy tag on descent; range add + range sum query.",
}

SUBTOPIC_SUMMARIES = {
    "hashmap": "Hash map for O(1) lookup while scanning — complements, counts, or indices.",
    "hashset": "Hash set for O(1) existence — dedupe, cycle detection, or sequence starts.",
    "bfs-dfs": "Graph/grid traversal: mark visited, queue or stack, process neighbors.",
    "topo": "Directed acyclic graph ordering — Kahn BFS or DFS postorder reverse.",
    "shortest-path": "Weighted graph: Dijkstra (non-neg), Bellman-Ford, or 0-1 BFS.",
    "union-find": "Disjoint set: find with path compression, union by rank/size.",
    "mst": "Minimum spanning tree: Kruskal sort edges + UF, or Prim with heap.",
    "variable-window": "Sliding window: expand right, shrink left while invalid.",
    "opposite": "Two pointers from both ends moving inward based on sum/compare.",
    "prefix": "Prefix sums + hash map or difference array for range/subarray queries.",
    "1d": "1D DP: define state on index i, transition from i-1 or earlier.",
    "knapsack": "Capacity DP: iterate items, update reachable weights backwards.",
    "grid": "2D DP on grid — often row-by-row or with rolling array.",
    "tree": "Tree recursion: combine results from left/right subtrees.",
    "monotonic": "Monotonic stack/queue maintains increasing/decreasing order of candidates.",
    "trie": "Prefix tree for strings, autocomplete, or bitwise XOR walks.",
    "bit": "Bit tricks: XOR pairs, masks, or count bits mod k.",
    "greedy": "Local optimal choice leads global optimum — often after sorting.",
    "binary-search": "Halve search space on sorted data or monotonic feasibility.",
    "backtracking": "Build solution incrementally; undo when constraint violated.",
    "linked-list": "Pointer manipulation: dummy head, fast/slow, or reverse in place.",
    "stack": "LIFO for parsing, matching, or monotonic next-greater patterns.",
    "heap": "Priority queue for top-K, merging streams, or greedy scheduling.",
    "intervals": "Sort intervals; merge, sweep line, or greedy by end time.",
    "segment": "Segment tree or BIT for range query/update in O(log n).",
    "math": "Number theory, combinatorics, or arithmetic simulation.",
    "strings": "String scan, KMP, palindrome expand, or character frequency.",
    "design": "Class design with required operation complexities — map + structure.",
}

QID_OVERRIDES = {
    "ma-03": (
        "Given two integers a and b, compute gcd(a,b) and lcm(a,b).",
        "Euclidean gcd: while(b) a%=b swap; lcm = a/gcd * b.",
    ),
    "pre-17": (
        "Given an integer array and k, return the maximum length of a subarray whose sum equals k.",
        "Prefix sum + earliest index map: if prefix-k seen, update max length.",
    ),
    "sg-15": (
        "Given a static array, answer range maximum queries on [l,r] efficiently.",
        "Segment tree build once; queryMax(l,r) walks O(log n) nodes.",
    ),
    "sg-16": (
        "Support range add updates and range sum queries on an array.",
        "Lazy propagation: push pending add to children before querying/updating.",
    ),
}

# LeetCode-style one-line problem statements keyed by exact title
TITLE_DESCRIPTIONS = {}


def _desc(title, text):
    TITLE_DESCRIPTIONS[title] = text


def _build_title_descriptions():
    pairs = [
        ("Two Sum", "Given an integer array nums and target, return indices of two distinct elements that sum to target."),
        ("Number of Islands", "Given a 2D grid of '0' and '1', count the number of islands (4-connected components of '1')."),
        ("Group Anagrams", "Group strings that are anagrams of each other."),
        ("Longest Substring Without Repeating Characters", "Return the length of the longest substring without repeating characters."),
        ("Container With Most Water", "Given heights, pick two lines forming a container with maximum area."),
        ("3Sum", "Return all unique triplets in nums that sum to zero."),
        ("Trapping Rain Water", "Given elevation bars, compute total trapped rainwater after raining."),
        ("Maximum Subarray", "Find the contiguous subarray with the largest sum."),
        ("Merge Intervals", "Merge all overlapping intervals."),
        ("Course Schedule", "Given prerequisites, return true if you can finish all courses (no cycle)."),
        ("Word Search", "Given board and word, return true if word exists by adjacent cell paths."),
        ("LRU Cache", "Design LRU cache with get/put in O(1) average time."),
        ("Serialize and Deserialize Binary Tree", "Design codec to convert binary tree to string and back."),
        ("Coin Change", "Return fewest coins needed to make amount, or -1 if impossible."),
        ("Longest Increasing Subsequence", "Return length of longest strictly increasing subsequence."),
        ("House Robber", "Rob non-adjacent houses for maximum money without alerting police."),
        ("Climbing Stairs", "Count distinct ways to climb n stairs taking 1 or 2 steps."),
        ("Decode Ways", "Count ways to decode a digit string into letters (A=1..Z=26)."),
        ("Word Break", "Return true if string can be segmented into dictionary words."),
        ("Unique Paths", "Count paths from top-left to bottom-right moving only right/down."),
        ("Minimum Path Sum", "Find path from top-left to bottom-right with minimum sum on grid."),
        ("Edit Distance", "Minimum operations (insert/delete/replace) to convert word1 to word2."),
        ("Longest Common Subsequence", "Return length of longest common subsequence of two strings."),
        ("Regular Expression Matching", "Implement regex matching with '.' and '*'."),
        ("Median of Two Sorted Arrays", "Find median of two sorted arrays in O(log(m+n))."),
        ("Valid Parentheses", "Return true if brackets are opened and closed in valid order."),
        ("Merge k Sorted Lists", "Merge k sorted linked lists into one sorted list."),
        ("Reverse Linked List", "Reverse a singly linked list in O(1) extra space."),
        ("Linked List Cycle", "Return true if linked list has a cycle."),
        ("Add Two Numbers", "Add two numbers represented as linked lists (digits reversed)."),
        ("Implement Trie (Prefix Tree)", "Implement trie with insert, search, and startsWith."),
        ("Number of Connected Components in an Undirected Graph", "Count connected components in an undirected graph."),
        ("Graph Valid Tree", "Given n nodes and edges, return true if edges form a valid tree."),
        ("Network Delay Time", "Time for signal from node k to reach all nodes in weighted directed graph."),
        ("Cheapest Flights Within K Stops", "Cheapest price from src to dst with at most k stops."),
        ("Rotting Oranges", "Minutes until no fresh orange remains; 4-direction spread from rotten."),
        ("Pacific Atlantic Water Flow", "Cells from which water can reach both Pacific and Atlantic oceans."),
        ("Evaluate Reverse Polish Notation", "Evaluate arithmetic expression in reverse Polish notation."),
        ("Basic Calculator", "Evaluate string expression with +, -, parentheses."),
        ("Spiral Matrix", "Return all matrix elements in spiral order."),
        ("Rotate Image", "Rotate n×n matrix 90 degrees clockwise in-place."),
        ("Set Matrix Zeroes", "If cell is 0, set its entire row and column to 0."),
        ("First Missing Positive", "Find smallest missing positive integer in O(n) time, O(1) space."),
        ("Product of Array Except Self", "Return array where output[i] is product of all nums except nums[i]."),
        ("Subarray Sum Equals K", "Count contiguous subarrays whose sum equals k."),
        ("Top K Frequent Elements", "Return k most frequent elements."),
        ("Kth Largest Element in an Array", "Find the kth largest element in unsorted array."),
        ("Find Median from Data Stream", "Design structure supporting addNum and findMedian."),
        ("Min Stack", "Design stack supporting push, pop, top, and getMin in O(1)."),
        ("Daily Temperatures", "For each day, days until a warmer temperature."),
        ("Largest Rectangle in Histogram", "Area of largest rectangle in histogram."),
        ("Task Scheduler", "Minimum time to finish tasks with cooldown n between same task."),
        ("Meeting Rooms II", "Minimum conference rooms required for all meetings."),
        ("Non-overlapping Intervals", "Minimum intervals to remove so rest don't overlap."),
        ("Jump Game", "Return true if you can reach last index from first."),
        ("Jump Game II", "Minimum jumps to reach last index."),
        ("Gas Station", "Starting gas station index to complete circular route, or -1."),
        ("Partition Labels", "Split string into parts so each letter appears in at most one part."),
        ("Best Time to Buy and Sell Stock", "Maximum profit from one buy and one sell."),
        ("Binary Tree Maximum Path Sum", "Maximum path sum where path may start/end anywhere."),
        ("Lowest Common Ancestor of a Binary Tree", "Find LCA of two nodes in binary tree."),
        ("Validate Binary Search Tree", "Return true if tree is valid BST."),
        ("Binary Tree Level Order Traversal", "Return level-order traversal as list of lists."),
        ("Construct Binary Tree from Preorder and Inorder Traversal", "Build tree from preorder and inorder arrays."),
        ("Diameter of Binary Tree", "Length of longest path between any two nodes in tree."),
        ("House Robber III", "Maximum robbed amount on binary tree without robbing parent and child together."),
        ("Path Sum", "Return true if tree has root-to-leaf path with given sum."),
        ("Path Sum II", "Return all root-to-leaf paths where sum equals target."),
        ("Same Tree", "Return true if two binary trees are identical."),
        ("Symmetric Tree", "Return true if tree is mirror of itself."),
        ("Invert Binary Tree", "Invert/mirror a binary tree."),
        ("Maximum Depth of Binary Tree", "Return maximum depth of binary tree."),
        ("Subtree of Another Tree", "Return true if subRoot is subtree of root."),
        ("Insert into a Binary Search Tree", "Insert value into BST and return root."),
        ("Delete Node in a Binary Search Tree", "Delete node with given key from BST."),
        ("Kth Smallest Element in a BST", "Return kth smallest value in BST."),
        ("Range Sum of BST", "Sum values of all nodes with value in [low, high]."),
        ("Encode and Decode Strings", "Design algorithm to encode list of strings to single string and decode back."),
        ("Insert Delete GetRandom O(1)", "Design set supporting insert, remove, and getRandom in average O(1)."),
        ("Contiguous Array", "Max length of contiguous subarray with equal number of 0 and 1."),
        ("Find All Anagrams in a String", "Return start indices of all anagrams of p in s."),
        ("Permutation in String", "Return true if s2 contains permutation of s1."),
        ("Minimum Window Substring", "Smallest substring of s containing all characters of t."),
        ("Longest Repeating Character Replacement", "Longest substring containing same letter after at most k replacements."),
        ("Subarrays with K Different Integers", "Count subarrays with exactly k distinct integers."),
        ("Fruit Into Baskets", "Longest subarray containing at most two distinct values."),
        ("Move Zeroes", "Move all zeros to end while maintaining relative order of non-zeros."),
        ("Remove Element", "Remove all instances of val in-place, return new length."),
        ("Merge Sorted Array", "Merge nums2 into nums1 as one sorted array in-place."),
        ("Remove Duplicates from Sorted List", "Delete duplicates from sorted linked list."),
        ("Remove Duplicates from Sorted List II", "Delete all nodes that have duplicate numbers."),
        ("Combination Sum", "Find all unique combinations where candidates sum to target (reuse allowed)."),
        ("Combination Sum II", "Combination sum with each candidate used once; no duplicate combos."),
        ("Permutations", "Return all permutations of distinct integers."),
        ("N-Queens", "Place n queens on n×n board so none attack each other."),
        ("Sudoku Solver", "Fill empty cells to complete valid 9×9 Sudoku."),
        ("Word Search II", "Find all words from list that exist on board (Trie + DFS)."),
        ("Restore IP Addresses", "Return all valid IP addresses from digit string."),
        ("Target Sum", "Assign +/- to nums to reach target; count ways."),
        ("Sqrt(x)", "Return integer square root of non-negative x."),
        ("Find Peak Element", "Find index of peak element (greater than neighbors)."),
        ("Search a 2D Matrix II", "Search target in row/col sorted matrix."),
        ("Find K Closest Elements", "Return k closest elements to x in sorted array."),
        ("Single Element in a Sorted Array", "Every element appears twice except one — find it."),
        ("Random Pick with Weight", "Pick index with probability proportional to weight."),
        ("Reverse Integer", "Reverse digits of 32-bit signed integer; return 0 on overflow."),
        ("Multiply Strings", "Multiply two non-negative integers given as strings."),
        ("Pascal's Triangle", "Return first numRows of Pascal's triangle."),
        ("Max Points on a Line", "Maximum number of points lying on same straight line."),
        ("Factorial Trailing Zeroes", "Count trailing zeroes in n!."),
        ("Single Number II", "Every element appears three times except one — find it."),
        ("Sum of Two Integers", "Add two integers without using + or - operators."),
        ("Power of Two", "Return true if n is power of two."),
        ("Power of Four", "Return true if n is power of four."),
        ("Reverse Pairs", "Count pairs i<j where nums[i] > 2*nums[j]."),
        ("Count of Range Sum", "Count range sums in [lower, upper]."),
        ("Burst Balloons", "Burst balloons to maximize coins collected."),
        ("Valid Parenthesis String", "String with '(', ')' and '*' — can '*' be any bracket?"),
        ("Candy", "Minimum candies so each child has more than lower-rated neighbors if rating higher."),
        ("Queue Reconstruction by Height", "Reconstruct queue from people sorted by height and index."),
        ("Minimum Number of Arrows to Burst Balloons", "Minimum arrows to burst all balloons on number line."),
        ("Boats to Save People", "Minimum boats to carry people with weight limit per boat."),
        ("Minimum Add to Make Parentheses Valid", "Minimum '(' or ')' inserts to make string valid."),
        ("Reorganize String", "Rearrange string so no two adjacent chars are same, or return empty."),
        ("Interval List Intersections", "Intersection of two lists of closed intervals."),
        ("My Calendar I", "Design calendar supporting book(start,end) without double booking."),
        ("Car Pooling", "Return true if all trips can be completed without exceeding capacity."),
        ("Maximum Number of Events That Can Be Attended", "Maximum events one person can attend (one per day)."),
        ("Range Sum Query - Immutable", "Design array with sumRange(left,right) query."),
        ("Range Sum Query 2D - Immutable", "Design 2D matrix with sumRegion query."),
        ("Find Pivot Index", "Index where sum left equals sum right, or -1."),
        ("Continuous Subarray Sum", "True if subarray length ≥2 sums to multiple of k."),
        ("Binary Subarrays With Sum", "Count subarrays with sum equal to goal."),
        ("Count Number of Nice Subarrays", "Subarrays with exactly k odd numbers."),
        ("Sort Characters By Frequency", "Return string sorted by character frequency descending."),
        ("Longest Palindromic Subsequence", "Length of longest palindromic subsequence."),
        ("Palindromic Substrings", "Count palindromic substrings in string."),
        ("Longest Common Prefix", "Longest common prefix among array of strings."),
        ("Roman to Integer", "Convert Roman numeral string to integer."),
        ("Find the Index of the First Occurrence in a String", "Return index of first occurrence of needle in haystack."),
        ("Decode String", "Decode k[encoded_string] patterns in string."),
        ("Isomorphic Strings", "True if characters in s can map one-to-one to t preserving order."),
        ("Maximum XOR of Two Numbers in an Array", "Maximum XOR of any two numbers in array."),
        ("Concatenated Words", "Find words formed by concatenating other words in dictionary."),
        ("GCD / LCM basics", "Compute greatest common divisor and least common multiple."),
        ("Maximum Size Subarray Sum Equals k", "Maximum length subarray with sum exactly k."),
        ("Range Maximum Query (classic)", "Answer range max queries on static array."),
        ("Lazy Propagation Range Update", "Range add updates with range sum queries."),
    ]
    for title, text in pairs:
        _desc(title, text)


def _auto_descriptions_from_data():
    """Fill missing titles with a readable one-liner from title text."""
    for path in sorted(glob.glob(os.path.join(DATA, "*.js"))):
        raw = open(path, encoding="utf-8").read()
        raw = raw.replace("window.PRACTICE_TOPIC = ", "").rstrip(";\n")
        topic = json.loads(raw)
        for q in topic["questions"]:
            title = q["title"]
            if title in TITLE_DESCRIPTIONS:
                continue
            lc = q.get("lc")
            sub = q.get("subtopic", "")
            if lc:
                TITLE_DESCRIPTIONS["LC%d" % lc] = TITLE_DESCRIPTIONS.get("LC%d" % lc) or (
                    "LC %d — %s (%s)." % (lc, title, sub.replace("-", " ") if sub else "optimal pattern")
                )
            lower = title.lower()
            if lower.startswith("find ") or lower.startswith("search "):
                TITLE_DESCRIPTIONS[title] = "%s — return the required index, count, or boolean." % title
            elif lower.startswith("minimum ") or lower.startswith("maximum ") or lower.startswith("longest ") or lower.startswith("shortest "):
                TITLE_DESCRIPTIONS[title] = "Compute the %s over the given input per constraints." % title.lower()
            elif lower.startswith("count "):
                TITLE_DESCRIPTIONS[title] = "%s — return the total count satisfying the problem rules." % title
            elif "design" in lower or title.startswith("Implement"):
                TITLE_DESCRIPTIONS[title] = "%s — meet required time/space for each operation." % title
            else:
                TITLE_DESCRIPTIONS[title] = "Given input per constraints, solve: %s." % title


def _auto_approach_summaries_from_data():
    for path in sorted(glob.glob(os.path.join(DATA, "*.js"))):
        raw = open(path, encoding="utf-8").read()
        raw = raw.replace("window.PRACTICE_TOPIC = ", "").rstrip(";\n")
        topic = json.loads(raw)
        for q in topic["questions"]:
            approaches = q.get("approaches") or []
            if not approaches:
                continue
            name = approaches[0].get("name", "")
            if not name or name in APPROACH_SUMMARIES:
                continue
            sub = q.get("subtopic", "")
            hook = SUBTOPIC_SUMMARIES.get(sub, "")
            APPROACH_SUMMARIES[name] = ("%s — %s" % (name, hook)) if hook else ("%s — state invariant, then loop." % name)


def write_output():
    _build_title_descriptions()
    _auto_descriptions_from_data()
    _auto_approach_summaries_from_data()
    out = os.path.join(os.path.dirname(__file__), "enrichments_data.py")
    with open(out, "w", encoding="utf-8") as f:
        f.write('"""Auto-generated descriptions and memory hooks — run build_enrichments_data.py to refresh."""\n\n')
        f.write("TITLE_DESCRIPTIONS = ")
        f.write(repr(TITLE_DESCRIPTIONS))
        f.write("\n\nAPPROACH_SUMMARIES = ")
        f.write(repr(APPROACH_SUMMARIES))
        f.write("\n\nSUBTOPIC_SUMMARIES = ")
        f.write(repr(SUBTOPIC_SUMMARIES))
        f.write("\n\nQID_OVERRIDES = ")
        f.write(repr(QID_OVERRIDES))
        f.write("\n")
    print("Wrote", out, "titles:", len(TITLE_DESCRIPTIONS), "approaches:", len(APPROACH_SUMMARIES))


if __name__ == "__main__":
    write_output()
