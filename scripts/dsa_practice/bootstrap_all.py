#!/usr/bin/env python3
"""Build all DSA practice topics from compact specs + snippet library."""
import os
import sys

sys.path.insert(0, os.path.dirname(__file__))

from _compact import mk, build_topic
from snippets import SNIPPETS, get_snippet, CUSTOM_SNIPPETS
from _helpers import write_topic_html, write_topic_js

# (qid, title, lc, imp, sub, diff, cin, cout)
# Code pulled from SNIPPETS[lc] when present; else generic comment block with pattern in sub


def S(qid, title, lc, imp, sub, diff, cin, cout, code=None, note=None):
    if code:
        ap, t, s, c = "Optimal", "O(n)", "O(n)", code
    elif qid in CUSTOM_SNIPPETS:
        ap, t, s, c = CUSTOM_SNIPPETS[qid]
    else:
        ap, t, s, c = get_snippet(lc, sub)
        if c.startswith("// Pattern:") and sub:
            pass  # already has pattern hint
    return mk(qid, title, lc, imp, sub, diff, cin, cout, ap, t, s, c, note=note)


ARRAYS_SPECS = [
    ("arr-01", "Two Sum", 1, "must", "hashmap", "Easy", "nums=[2,7], target=9", "9"),
    ("arr-02", "Group Anagrams", 49, "must", "hashmap", "Medium", "strs=[\"eat\",\"tea\",\"tan\"]", "grouped lists"),
    ("arr-03", "Top K Frequent Elements", 347, "must", "hashmap", "Medium", "nums=[1,1,1,2,2,3], k=2", "[1,2]"),
    ("arr-04", "Longest Consecutive Sequence", 128, "must", "hashset", "Medium", "nums=[100,4,200,1,3,2]", "4"),
    ("arr-05", "Valid Anagram", 242, "must", "counting", "Easy", "s=\"anagram\", t=\"nagaram\"", "true"),
    ("arr-06", "Contains Duplicate", 217, "should", "hashset", "Easy", "nums=[1,2,3,1]", "true"),
    ("arr-07", "Product of Array Except Self", 238, "must", "prefix", "Medium", "nums=[1,2,3,4]", "[24,12,8,6]"),
    ("arr-08", "Encode and Decode Strings", 271, "should", "design", "Medium", "list of strings", "round-trip"),
    ("arr-09", "Subarray Sum Equals K", 560, "must", "prefix", "Medium", "nums=[1,1,1], k=2", "2"),
    ("arr-10", "First Missing Positive", 41, "must", "indexing", "Hard", "nums=[3,4,-1,1]", "2"),
    ("arr-11", "Set Matrix Zeroes", 73, "should", "matrix", "Medium", "matrix with 0", "zero rows/cols"),
    ("arr-12", "Rotate Image", 48, "should", "matrix", "Medium", "90° clockwise", "in-place"),
    ("arr-13", "Spiral Matrix", 54, "should", "matrix", "Medium", "m x n matrix", "spiral order"),
    ("arr-14", "Valid Sudoku", 36, "nice", "hashset", "Medium", "9x9 board", "true/false"),
    ("arr-15", "Insert Delete GetRandom O(1)", 380, "should", "design", "Medium", "randomized set ops", "O(1) avg"),
    ("arr-16", "Contiguous Array", 525, "should", "prefix", "Medium", "0/1 max equal count", "length"),
    ("arr-17", "Subarray Sum Divisible by K", 974, "nice", "prefix", "Medium", "nums, k", "count"),
    ("arr-18", "Find All Anagrams in String", 438, "should", "counting", "Medium", "s, p", "start indices"),
    ("arr-19", "Ransom Note", 383, "nice", "counting", "Easy", "ransomNote, magazine", "true/false"),
    ("arr-20", "Intersection of Two Arrays II", 350, "nice", "hashmap", "Easy", "nums1, nums2", "intersection"),
    ("arr-21", "Happy Number", 202, "nice", "hashset", "Easy", "n=19", "true"),
    ("arr-22", "Isomorphic Strings", 205, "should", "hashmap", "Easy", "s=\"egg\", t=\"add\"", "true"),
    ("arr-23", "Majority Element", 169, "should", "counting", "Easy", "nums", "majority"),
    ("arr-24", "Move Zeroes", 283, "should", "same-dir", "Easy", "nums", "shift zeros"),
    ("arr-25", "Best Time to Buy and Sell Stock", 121, "must", "scan", "Easy", "prices", "max profit"),
    ("arr-26", "Maximum Subarray", 53, "must", "kadane", "Medium", "nums", "max sum"),
    ("arr-27", "Merge Sorted Array", 88, "should", "two-ptr", "Easy", "nums1, m, nums2, n", "merged"),
    ("arr-28", "Next Permutation", 31, "should", "array", "Medium", "nums", "next lexicographic"),
]

PREFIX_SPECS = [
    ("pre-01", "Subarray Sum Equals K", 560, "must", "1d-prefix", "Medium", "nums, k", "count"),
    ("pre-02", "Range Sum Query Immutable", 303, "must", "1d-prefix", "Easy", "nums, queries", "sums"),
    ("pre-03", "Range Sum Query 2D", 304, "should", "2d-prefix", "Medium", "matrix queries", "sums"),
    ("pre-04", "Product Except Self", 238, "must", "prefix", "Medium", "nums", "products"),
    ("pre-05", "Find Pivot Index", 724, "should", "prefix", "Easy", "nums", "pivot index"),
    ("pre-06", "Continuous Subarray Sum", 523, "should", "prefix", "Medium", "nums, k", "true/false"),
    ("pre-07", "Maximum Subarray", 53, "must", "kadane", "Medium", "nums", "max sum"),
    ("pre-08", "Maximum Product Subarray", 152, "must", "prefix", "Medium", "nums", "max product"),
    ("pre-09", "Contiguous Array", 525, "should", "prefix", "Medium", "0/1 array", "max len"),
    ("pre-10", "Subarray Sums Divisible by K", 974, "should", "prefix", "Medium", "nums, k", "count"),
    ("pre-11", "Range Addition II", 598, "nice", "2d-diff", "Easy", "m,n, ops", "max integer"),
    ("pre-12", "Corporate Flight Bookings", 1109, "nice", "diff-array", "Medium", "bookings, n", "seats used"),
    ("pre-13", "Minimum Value to Get Positive Step by Step Sum", 1413, "nice", "prefix", "Easy", "nums", "min start"),
    ("pre-14", "Running Sum of 1d Array", 1480, "nice", "prefix", "Easy", "nums", "running sums"),
    ("pre-15", "Find the Highest Altitude", 1732, "nice", "prefix", "Easy", "gain", "max altitude"),
    ("pre-16", "Number of Ways to Split Array", 2270, "nice", "prefix", "Medium", "nums", "valid splits"),
    ("pre-17", "Maximum Size Subarray Sum Equals k", None, "should", "hashmap", "Medium", "nums, k", "max len"),
    ("pre-18", "Binary Subarrays With Sum", 930, "should", "prefix", "Medium", "nums, goal", "count"),
    ("pre-19", "Shortest Subarray With Sum at Least K", 862, "nice", "prefix", "Hard", "nums, k", "min len"),
    ("pre-20", "Maximum Sum of Two Non-Overlapping Subarrays", 1031, "nice", "prefix", "Medium", "nums, L,M", "max sum"),
    ("pre-21", "Range Sum Query Mutable", 307, "should", "bit", "Medium", "nums, updates", "range sums"),
    ("pre-22", "Count Number of Nice Subarrays", 1248, "should", "prefix", "Medium", "nums, k odd", "count"),
]

TWOPTR_SPECS = [
    ("tp-01", "Two Sum II", 167, "must", "opposite", "Medium", "sorted nums, target", "indices"),
    ("tp-02", "3Sum", 15, "must", "opposite", "Medium", "nums", "triplets"),
    ("tp-03", "Container With Most Water", 11, "must", "opposite", "Medium", "heights", "max area"),
    ("tp-04", "Trapping Rain Water", 42, "must", "opposite", "Hard", "heights", "water"),
    ("tp-05", "Valid Palindrome", 125, "should", "opposite", "Easy", "s", "true/false"),
    ("tp-06", "Remove Duplicates from Sorted Array", 26, "should", "same-dir", "Easy", "nums", "new length"),
    ("tp-07", "Remove Element", 27, "should", "same-dir", "Easy", "nums, val", "new length"),
    ("tp-08", "Move Zeroes", 283, "should", "same-dir", "Easy", "nums", "in-place"),
    ("tp-09", "Sort Colors", 75, "must", "same-dir", "Medium", "nums 0/1/2", "sorted"),
    ("tp-10", "Minimum Window Substring", 76, "must", "variable-window", "Hard", "s, t", "min window"),
    ("tp-11", "Longest Substring Without Repeating", 3, "must", "variable-window", "Medium", "s", "length"),
    ("tp-12", "Longest Repeating Character Replacement", 424, "should", "variable-window", "Medium", "s, k", "length"),
    ("tp-13", "Permutation in String", 567, "should", "fixed-window", "Medium", "s1, s2", "true/false"),
    ("tp-14", "Find All Anagrams in String", 438, "should", "fixed-window", "Medium", "s, p", "indices"),
    ("tp-15", "Max Consecutive Ones III", 1004, "must", "variable-window", "Medium", "nums, k", "max len"),
    ("tp-16", "Subarrays with K Different Integers", 992, "should", "variable-window", "Hard", "nums, k", "count"),
    ("tp-17", "Minimum Size Subarray Sum", 209, "must", "variable-window", "Medium", "nums, target", "min len"),
    ("tp-18", "Maximum Average Subarray I", 643, "should", "fixed-window", "Easy", "nums, k", "max avg"),
    ("tp-19", "Fruit Into Baskets", 904, "should", "variable-window", "Medium", "fruits", "max types"),
    ("tp-20", "3Sum Closest", 16, "should", "opposite", "Medium", "nums, target", "closest sum"),
    ("tp-21", "4Sum", 18, "nice", "opposite", "Medium", "nums, target", "quadruplets"),
    ("tp-22", "Boats to Save People", 881, "should", "opposite", "Medium", "people, limit", "boats"),
    ("tp-23", "Squares of a Sorted Array", 977, "nice", "opposite", "Easy", "nums", "sorted squares"),
    ("tp-24", "Reverse String", 344, "nice", "opposite", "Easy", "s", "reversed"),
    ("tp-25", "Is Subsequence", 392, "should", "same-dir", "Easy", "s, t", "true/false"),
    ("tp-26", "Merge Sorted Array", 88, "should", "opposite", "Easy", "nums1, nums2", "merged"),
    ("tp-27", "Backspace String Compare", 844, "nice", "same-dir", "Easy", "s, t", "equal?"),
    ("tp-28", "Longest Mountain in Array", 845, "nice", "same-dir", "Medium", "arr", "peak length"),
]

BSEARCH_SPECS = [
    ("bs-01", "Binary Search", 704, "must", "exact", "Easy", "nums, target", "index"),
    ("bs-02", "Search Insert Position", 35, "must", "first-true", "Easy", "nums, target", "index"),
    ("bs-03", "Find First and Last Position", 34, "must", "first-true", "Medium", "nums, target", "[l,r]"),
    ("bs-04", "Search in Rotated Sorted Array", 33, "must", "rotated", "Medium", "nums, target", "index"),
    ("bs-05", "Find Minimum in Rotated Array", 153, "must", "rotated", "Medium", "nums", "min"),
    ("bs-06", "Koko Eating Bananas", 875, "must", "answer-space", "Medium", "piles, h", "min speed"),
    ("bs-07", "Capacity To Ship Packages", 1011, "must", "answer-space", "Medium", "weights, days", "capacity"),
    ("bs-08", "Split Array Largest Sum", 410, "should", "answer-space", "Hard", "nums, k", "min max sum"),
    ("bs-09", "Sqrt(x)", 69, "should", "last-true", "Easy", "x", "sqrt"),
    ("bs-10", "Find Peak Element", 162, "should", "peak", "Medium", "nums", "peak index"),
    ("bs-11", "Search a 2D Matrix", 74, "must", "2d", "Medium", "matrix, target", "found?"),
    ("bs-12", "Search a 2D Matrix II", 240, "should", "2d", "Medium", "matrix, target", "found?"),
    ("bs-13", "Median of Two Sorted Arrays", 4, "must", "advanced", "Hard", "nums1, nums2", "median"),
    ("bs-14", "Find K Closest Elements", 658, "should", "window", "Medium", "arr, k, x", "subarray"),
    ("bs-15", "Kth Missing Positive Number", 1539, "nice", "exact", "Easy", "arr, k", "number"),
    ("bs-16", "Single Element in Sorted Array", 540, "should", "exact", "Medium", "nums", "single"),
    ("bs-17", "Search in Rotated Sorted Array II", 81, "nice", "rotated", "Medium", "duplicates", "found?"),
    ("bs-18", "Minimum Limit of Balls in a Bag", 1760, "nice", "answer-space", "Medium", "nums, ops", "min max"),
    ("bs-19", "Maximum Running Time of Computers", 2141, "nice", "answer-space", "Hard", "n, batteries", "hours"),
    ("bs-20", "Aggressive Cows", None, "should", "answer-space", "Hard", "stalls, cows", "max min dist"),
    ("bs-21", "Minimum Speed to Arrive on Time", 1870, "nice", "answer-space", "Medium", "dist, speed, h", "min speed"),
    ("bs-22", "Maximum Value at Given Index", 1802, "nice", "answer-space", "Medium", "n,index,maxSum", "max n"),
    ("bs-23", "Minimum Absolute Sum Difference", 1818, "nice", "exact", "Medium", "nums1, nums2", "min diff"),
    ("bs-24", "Random Pick with Weight", 528, "should", "prefix", "Medium", "w", "index"),
    ("bs-25", "Find Right Interval", 436, "nice", "first-true", "Medium", "intervals", "right intervals"),
    ("bs-26", "Maximum Candies Allocated to K Children", 2226, "nice", "answer-space", "Medium", "candies, k", "max per child"),
]

BACKTRACK_SPECS = [
    ("bt-01", "Subsets", 78, "must", "subsets", "Medium", "nums", "all subsets"),
    ("bt-02", "Subsets II", 90, "must", "subsets", "Medium", "nums with dups", "unique subsets"),
    ("bt-03", "Permutations", 46, "must", "permutations", "Medium", "nums", "all perms"),
    ("bt-04", "Permutations II", 47, "should", "permutations", "Medium", "dups", "unique perms"),
    ("bt-05", "Combinations", 77, "must", "combinations", "Medium", "n, k", "combinations"),
    ("bt-06", "Combination Sum", 39, "must", "combinations", "Medium", "candidates, target", "combos"),
    ("bt-07", "Combination Sum II", 40, "should", "combinations", "Medium", "dups", "combos once"),
    ("bt-08", "Combination Sum III", 216, "nice", "combinations", "Medium", "k, n", "combos sum n"),
    ("bt-09", "Letter Combinations of Phone Number", 17, "should", "string", "Medium", "digits", "strings"),
    ("bt-10", "Generate Parentheses", 22, "must", "string", "Medium", "n pairs", "valid strings"),
    ("bt-11", "Word Search", 79, "must", "grid", "Medium", "board, word", "found?"),
    ("bt-12", "Palindrome Partitioning", 131, "should", "string", "Medium", "s", "partitions"),
    ("bt-13", "Restore IP Addresses", 93, "should", "string", "Medium", "s", "valid IPs"),
    ("bt-14", "N-Queens", 51, "must", "constraint", "Hard", "n", "board configs"),
    ("bt-15", "N-Queens II", 52, "nice", "constraint", "Hard", "n", "count"),
    ("bt-16", "Sudoku Solver", 37, "should", "constraint", "Hard", "board", "solve"),
    ("bt-17", "Word Search II", 212, "must", "grid", "Hard", "board, words", "found words"),
    ("bt-18", "Remove Invalid Parentheses", 301, "nice", "string", "Hard", "s", "min removals"),
    ("bt-19", "Partition to K Equal Sum Subsets", 698, "should", "combinations", "Medium", "nums, k", "true/false"),
    ("bt-20", "Beautiful Arrangement", 526, "nice", "permutations", "Medium", "n", "count"),
    ("bt-21", "Target Sum", 494, "should", "combinations", "Medium", "nums, target", "ways"),
    ("bt-22", "Non-decreasing Subsequences", 491, "nice", "subsets", "Medium", "nums", "subsequences"),
    ("bt-23", "Matchsticks to Square", 473, "nice", "combinations", "Medium", "matchsticks", "square?"),
    ("bt-24", "Gray Code", 89, "nice", "permutations", "Medium", "n", "sequence"),
    ("bt-25", "Factor Combinations", 254, "nice", "combinations", "Medium", "n", "factors"),
    ("bt-26", "Expression Add Operators", 282, "nice", "string", "Hard", "num, target", "expressions"),
    ("bt-27", "Word Pattern II", 291, "nice", "string", "Hard", "pattern, s", "match?"),
    ("bt-28", "Android Unlock Patterns", 351, "nice", "grid", "Medium", "m,n", "count"),
]

GREEDY_SPECS = [
    ("gr-01", "Jump Game", 55, "must", "jump", "Medium", "nums", "can reach end?"),
    ("gr-02", "Jump Game II", 45, "must", "jump", "Medium", "nums", "min jumps"),
    ("gr-03", "Gas Station", 134, "must", "circular", "Medium", "gas, cost", "start index"),
    ("gr-04", "Hand of Straights", 846, "nice", "scheduling", "Medium", "hand, groupSize", "true/false"),
    ("gr-05", "Merge Triplets to Form Target", 1899, "nice", "intervals", "Medium", "triplets, target", "possible?"),
    ("gr-06", "Partition Labels", 763, "must", "intervals", "Medium", "s", "partition sizes"),
    ("gr-07", "Valid Parenthesis String", 678, "should", "greedy", "Medium", "s with *", "valid?"),
    ("gr-08", "Candy", 135, "should", "scan", "Hard", "ratings", "min candies"),
    ("gr-09", "Queue Reconstruction by Height", 406, "should", "sort", "Medium", "people", "reconstructed"),
    ("gr-10", "Task Scheduler", 621, "must", "scheduling", "Medium", "tasks, n", "min intervals"),
    ("gr-11", "Minimum Number of Arrows", 452, "should", "intervals", "Medium", "balloons", "arrows"),
    ("gr-12", "Non-overlapping Intervals", 435, "must", "intervals", "Medium", "intervals", "min removals"),
    ("gr-13", "Largest Number", 179, "should", "sort", "Medium", "nums", "largest concat"),
    ("gr-14", "Assign Cookies", 455, "nice", "two-ptr", "Easy", "g, s", "max content"),
    ("gr-15", "Boats to Save People", 881, "should", "two-ptr", "Medium", "people, limit", "boats"),
    ("gr-16", "Minimum Add to Make Parentheses Valid", 921, "should", "scan", "Medium", "s", "additions"),
    ("gr-17", "Remove K Digits", 402, "should", "monotonic", "Medium", "num, k", "smallest"),
    ("gr-18", "Monotone Increasing Digits", 738, "nice", "greedy", "Medium", "n", "largest monotone"),
    ("gr-19", "Max Increase to Keep City Skyline", 807, "nice", "grid", "Medium", "grid", "sum increases"),
    ("gr-20", "Bag of Tokens", 948, "nice", "two-ptr", "Medium", "tokens, power", "max score"),
    ("gr-21", "Minimum Number of Refueling Stops", 871, "nice", "heap", "Hard", "target, startFuel, stations", "stops"),
    ("gr-22", "Candy Crush", 723, "nice", "simulation", "Medium", "board", "crushed"),
    ("gr-23", "IPO", 502, "nice", "heap", "Hard", "k, w, profits, capital", "max capital"),
    ("gr-24", "Reorganize String", 767, "should", "heap", "Medium", "s", "reorganized"),
]

TREES_SPECS = [
    ("tr-01", "Maximum Depth of Binary Tree", 104, "must", "dfs", "Easy", "root", "depth"),
    ("tr-02", "Diameter of Binary Tree", 543, "must", "dfs", "Easy", "root", "diameter"),
    ("tr-03", "Binary Tree Maximum Path Sum", 124, "must", "dfs", "Hard", "root", "max sum"),
    ("tr-04", "Lowest Common Ancestor", 236, "must", "dfs", "Medium", "root,p,q", "LCA"),
    ("tr-05", "LCA of BST", 235, "must", "bst", "Medium", "root,p,q", "LCA"),
    ("tr-06", "Validate Binary Search Tree", 98, "must", "bst", "Medium", "root", "valid?"),
    ("tr-07", "Kth Smallest in BST", 230, "must", "bst", "Medium", "root,k", "value"),
    ("tr-08", "Serialize and Deserialize BST", 449, "should", "serialize", "Medium", "tree", "round trip"),
    ("tr-09", "Serialize and Deserialize Binary Tree", 297, "must", "serialize", "Hard", "tree", "round trip"),
    ("tr-10", "Binary Tree Right Side View", 199, "should", "bfs", "Medium", "root", "right view"),
    ("tr-11", "Invert Binary Tree", 226, "must", "dfs", "Easy", "root", "inverted"),
    ("tr-12", "Path Sum", 112, "should", "path", "Easy", "root,target", "exists?"),
    ("tr-13", "Path Sum II", 113, "should", "path", "Medium", "root,target", "all paths"),
    ("tr-14", "Construct from Preorder and Inorder", 105, "must", "build", "Medium", "traversals", "tree"),
    ("tr-15", "Construct from Inorder and Postorder", 106, "should", "build", "Medium", "traversals", "tree"),
    ("tr-16", "Symmetric Tree", 101, "should", "dfs", "Easy", "root", "symmetric?"),
    ("tr-17", "Flatten Binary Tree to Linked List", 114, "should", "dfs", "Medium", "root", "flatten"),
    ("tr-18", "Populating Next Right Pointers", 116, "nice", "bfs", "Medium", "perfect tree", "connected"),
    ("tr-19", "Binary Tree Level Order Traversal", 102, "must", "bfs", "Medium", "root", "levels"),
    ("tr-20", "Binary Tree Zigzag Level Order", 103, "should", "bfs", "Medium", "root", "zigzag"),
    ("tr-21", "Same Tree", 100, "should", "dfs", "Easy", "p,q", "same?"),
    ("tr-22", "Subtree of Another Tree", 572, "should", "dfs", "Easy", "root, subRoot", "subtree?"),
    ("tr-23", "Count Good Nodes in Binary Tree", 1448, "nice", "dfs", "Medium", "root", "count"),
    ("tr-24", "Range Sum of BST", 938, "should", "bst", "Easy", "root, L,R", "sum"),
    ("tr-25", "Insert into a BST", 701, "should", "bst", "Medium", "root,val", "root"),
    ("tr-26", "Delete Node in a BST", 450, "should", "bst", "Medium", "root,key", "root"),
    ("tr-27", "Balance a Binary Search Tree", 1382, "nice", "bst", "Medium", "root", "balanced"),
    ("tr-28", "Binary Search Tree Iterator", 173, "should", "bst", "Medium", "root", "iterator"),
    ("tr-29", "Sum Root to Leaf Numbers", 129, "nice", "path", "Medium", "root", "sum"),
    ("tr-30", "Lowest Common Ancestor of Deepest Leaves", 1123, "nice", "dfs", "Medium", "root", "LCA deep"),
    ("tr-31", "All Nodes Distance K in Binary Tree", 863, "should", "bfs", "Medium", "root,target,k", "nodes"),
    ("tr-32", "House Robber III", 337, "must", "tree-dp", "Medium", "root", "max rob"),
    ("tr-33", "Unique Binary Search Trees", 96, "should", "dp", "Medium", "n", "count"),
    ("tr-34", "Recover Binary Search Tree", 99, "nice", "bst", "Medium", "root", "fix"),
    ("tr-35", "Vertical Order Traversal", 987, "nice", "bfs", "Hard", "root", "columns"),
]

LL_SPECS = [
    ("ll-01", "Reverse Linked List", 206, "must", "reverse", "Easy", "head", "reversed"),
    ("ll-02", "Linked List Cycle", 141, "must", "fast-slow", "Easy", "head", "has cycle?"),
    ("ll-03", "Linked List Cycle II", 142, "must", "fast-slow", "Medium", "head", "cycle start"),
    ("ll-04", "Merge Two Sorted Lists", 21, "must", "merge", "Easy", "l1,l2", "merged"),
    ("ll-05", "Remove Nth Node From End", 19, "must", "two-ptr", "Medium", "head,n", "head"),
    ("ll-06", "Reorder List", 143, "should", "reverse", "Medium", "head", "reordered"),
    ("ll-07", "Copy List with Random Pointer", 138, "must", "hashmap", "Medium", "head", "deep copy"),
    ("ll-08", "LRU Cache", 146, "must", "design", "Medium", "capacity", "get/put"),
    ("ll-09", "Merge k Sorted Lists", 23, "must", "merge", "Hard", "lists", "merged"),
    ("ll-10", "Add Two Numbers", 2, "must", "math", "Medium", "l1,l2", "sum list"),
    ("ll-11", "Remove Duplicates from Sorted List", 83, "should", "scan", "Easy", "head", "deduped"),
    ("ll-12", "Remove Duplicates from Sorted List II", 82, "should", "scan", "Medium", "head", "deduped all dups"),
    ("ll-13", "Palindrome Linked List", 234, "should", "reverse", "Easy", "head", "palindrome?"),
    ("ll-14", "Intersection of Two Linked Lists", 160, "must", "two-ptr", "Easy", "a,b", "intersection"),
    ("ll-15", "Swap Nodes in Pairs", 24, "should", "reverse", "Medium", "head", "swapped"),
    ("ll-16", "Reverse Nodes in k-Group", 25, "should", "reverse", "Hard", "head,k", "reversed groups"),
    ("ll-17", "Rotate List", 61, "nice", "two-ptr", "Medium", "head,k", "rotated"),
    ("ll-18", "Partition List", 86, "nice", "two-ptr", "Medium", "head,x", "partitioned"),
    ("ll-19", "Sort List", 148, "should", "merge-sort", "Medium", "head", "sorted"),
    ("ll-20", "Odd Even Linked List", 328, "nice", "two-ptr", "Medium", "head", "reordered"),
    ("ll-21", "Add Two Numbers II", 445, "nice", "stack", "Medium", "l1,l2", "sum"),
    ("ll-22", "Flatten a Multilevel Doubly Linked List", 430, "nice", "dfs", "Medium", "head", "flattened"),
    ("ll-23", "Design Linked List", 707, "nice", "design", "Medium", "ops", "list"),
    ("ll-24", "Convert Sorted List to BST", 109, "nice", "divide", "Medium", "head", "root"),
]

STACK_SPECS = [
    ("st-01", "Valid Parentheses", 20, "must", "basic", "Easy", "s", "valid?"),
    ("st-02", "Min Stack", 155, "must", "design", "Medium", "push/pop/getMin", "O(1) min"),
    ("st-03", "Evaluate Reverse Polish Notation", 150, "must", "expression", "Medium", "tokens", "value"),
    ("st-04", "Daily Temperatures", 739, "must", "monotonic", "Medium", "T", "wait days"),
    ("st-05", "Next Greater Element I", 496, "should", "monotonic", "Easy", "nums1, nums2", "answers"),
    ("st-06", "Next Greater Element II", 503, "should", "monotonic", "Medium", "circular nums", "NGE"),
    ("st-07", "Largest Rectangle in Histogram", 84, "must", "monotonic", "Hard", "heights", "max area"),
    ("st-08", "Maximal Rectangle", 85, "should", "monotonic", "Hard", "matrix", "max rect"),
    ("st-09", "Trapping Rain Water", 42, "must", "monotonic", "Hard", "height", "water"),
    ("st-10", "Basic Calculator", 224, "should", "expression", "Hard", "s", "value"),
    ("st-11", "Basic Calculator II", 227, "should", "expression", "Medium", "s +-*", "value"),
    ("st-12", "Asteroid Collision", 735, "should", "monotonic", "Medium", "asteroids", "survivors"),
    ("st-13", "Remove K Digits", 402, "should", "monotonic", "Medium", "num,k", "smallest"),
    ("st-14", "Sum of Subarray Minimums", 907, "should", "monotonic", "Medium", "arr", "sum mins"),
    ("st-15", "Online Stock Span", 901, "nice", "monotonic", "Medium", "prices stream", "spans"),
    ("st-16", "Decode String", 394, "should", "basic", "Medium", "s", "decoded"),
    ("st-17", "Simplify Path", 71, "nice", "basic", "Medium", "path", "simplified"),
    ("st-18", "Remove All Adjacent Duplicates II", 1209, "nice", "basic", "Medium", "s,k", "result"),
    ("st-19", "132 Pattern", 456, "nice", "monotonic", "Medium", "nums", "pattern?"),
    ("st-20", "Car Fleet", 853, "should", "monotonic", "Medium", "target, position, speed", "fleets"),
    ("st-21", "Validate Stack Sequences", 946, "nice", "basic", "Medium", "pushed, popped", "valid?"),
    ("st-22", "Minimum Remove to Make Valid Parentheses", 1249, "should", "basic", "Medium", "s", "fixed"),
    ("st-23", "Score of Parentheses", 856, "nice", "basic", "Medium", "s", "score"),
    ("st-24", "Longest Valid Parentheses", 32, "should", "monotonic", "Hard", "s", "max len"),
]

HEAPS_SPECS = [
    ("hp-01", "Find Median from Data Stream", 295, "must", "two-heaps", "Hard", "addNum/findMedian", "median"),
    ("hp-02", "Top K Frequent Elements", 347, "must", "top-k", "Medium", "nums,k", "top k"),
    ("hp-03", "Kth Largest Element in Array", 215, "must", "top-k", "Medium", "nums,k", "kth largest"),
    ("hp-04", "K Closest Points to Origin", 973, "should", "top-k", "Medium", "points,k", "closest"),
    ("hp-05", "Merge k Sorted Lists", 23, "must", "merge", "Hard", "lists", "merged"),
    ("hp-06", "Task Scheduler", 621, "must", "scheduling", "Medium", "tasks,n", "min time"),
    ("hp-07", "Meeting Rooms II", 253, "must", "scheduling", "Medium", "intervals", "rooms"),
    ("hp-08", "Reorganize String", 767, "should", "scheduling", "Medium", "s", "reorg"),
    ("hp-09", "Last Stone Weight", 1046, "nice", "heap", "Easy", "stones", "weight"),
    ("hp-10", "Kth Smallest Element in Sorted Matrix", 378, "should", "top-k", "Medium", "matrix,k", "value"),
    ("hp-11", "Find K Pairs with Smallest Sums", 373, "nice", "merge", "Medium", "nums1,nums2,k", "pairs"),
    ("hp-12", "Smallest Range Covering K Lists", 632, "nice", "merge", "Hard", "lists", "range"),
    ("hp-13", "Design Twitter", 355, "nice", "design", "Medium", "follow/tweet/newsfeed", "feed"),
    ("hp-14", "Ugly Number II", 264, "should", "merge", "Medium", "n", "nth ugly"),
    ("hp-15", "Super Ugly Number", 313, "nice", "merge", "Medium", "n, primes", "number"),
    ("hp-16", "IPO", 502, "nice", "scheduling", "Hard", "k,w,...", "max capital"),
    ("hp-17", "Minimum Cost to Hire K Workers", 857, "nice", "top-k", "Hard", "quality,wage,k", "min cost"),
    ("hp-18", "Sliding Window Median", 480, "nice", "two-heaps", "Hard", "nums,k", "medians"),
]

SORTING_SPECS = [
    ("so-01", "Sort an Array", 912, "must", "merge-sort", "Medium", "nums", "sorted"),
    ("so-02", "Kth Largest Element", 215, "must", "quick-select", "Medium", "nums,k", "kth"),
    ("so-03", "Sort Colors", 75, "must", "dutch-flag", "Medium", "nums", "sorted"),
    ("so-04", "Merge Intervals", 56, "should", "sort", "Medium", "intervals", "merged"),
    ("so-05", "Count of Smaller Numbers After Self", 315, "should", "merge-sort", "Hard", "nums", "counts"),
    ("so-06", "Reverse Pairs", 493, "should", "merge-sort", "Hard", "nums", "count"),
    ("so-07", "Sort List", 148, "should", "merge-sort", "Medium", "head", "sorted"),
    ("so-08", "Largest Number", 179, "should", "custom-sort", "Medium", "nums", "string"),
    ("so-09", "H-Index", 274, "nice", "counting", "Medium", "citations", "h-index"),
    ("so-10", "Wiggle Sort II", 324, "nice", "partition", "Medium", "nums", "wiggle"),
    ("so-11", "Maximum Gap", 164, "nice", "bucket", "Medium", "nums", "max gap"),
    ("so-12", "Meeting Rooms", 252, "should", "sort", "Easy", "intervals", "can attend?"),
    ("so-13", "Meeting Rooms II", 253, "should", "sort", "Medium", "intervals", "rooms"),
    ("so-14", "Non-overlapping Intervals", 435, "should", "sort", "Medium", "intervals", "removals"),
    ("so-15", "Insert Interval", 57, "should", "sort", "Medium", "intervals,new", "merged"),
    ("so-16", "Relative Sort Array", 1122, "nice", "counting", "Easy", "arr1,arr2", "relative sort"),
    ("so-17", "Sort Characters By Frequency", 451, "should", "bucket", "Medium", "s", "sorted string"),
    ("so-18", "Custom Sort String", 791, "nice", "counting", "Medium", "order,str", "permutation"),
    ("so-19", "Minimum Number of Arrows", 452, "should", "sort", "Medium", "points", "arrows"),
    ("so-20", "Valid Triangle Number", 611, "nice", "sort", "Medium", "nums", "count"),
]

TRIES_SPECS = [
    ("try-01", "Implement Trie", 208, "must", "trie", "Medium", "insert/search/prefix", "ops"),
    ("try-02", "Design Add and Search Words", 211, "must", "trie", "Medium", "word dict", "search ."),
    ("try-03", "Word Search II", 212, "must", "trie-dfs", "Hard", "board, words", "found"),
    ("try-04", "Replace Words", 648, "should", "trie", "Medium", "dict,sentence", "replaced"),
    ("try-05", "Map Sum Pairs", 677, "nice", "trie", "Medium", "insert/sum", "sum"),
    ("try-06", "Longest Word in Dictionary", 720, "should", "trie", "Medium", "words", "longest"),
    ("try-07", "Search Suggestions System", 1268, "should", "trie", "Medium", "products,searchWord", "suggestions"),
    ("try-08", "Maximum XOR of Two Numbers in Array", 421, "should", "bit-trie", "Medium", "nums", "max xor"),
    ("try-09", "Concatenated Words", 472, "should", "trie-dp", "Hard", "words", "concatenated"),
    ("try-10", "Palindrome Pairs", 336, "nice", "trie", "Hard", "words", "pairs"),
    ("try-11", "Word Break II", 140, "nice", "trie-dp", "Hard", "s, dict", "sentences"),
    ("try-12", "Prefix and Suffix Search", 1506, "nice", "trie", "Hard", "words", "index"),
    ("try-13", "Design Search Autocomplete System", 642, "nice", "trie", "Hard", "sentences", "autocomplete"),
    ("try-14", "Stream of Characters", 1032, "nice", "trie", "Hard", "words stream", "match"),
    ("try-15", "Index Pairs of a String", 1065, "nice", "trie", "Easy", "text, words", "pairs"),
    ("try-16", "K Divisible Elements Subarrays", 2261, "nice", "trie", "Medium", "nums,k,p", "count"),
]

INTERVALS_SPECS = [
    ("iv-01", "Merge Intervals", 56, "must", "merge", "Medium", "intervals", "merged"),
    ("iv-02", "Insert Interval", 57, "must", "merge", "Medium", "intervals,new", "result"),
    ("iv-03", "Non-overlapping Intervals", 435, "must", "greedy", "Medium", "intervals", "removals"),
    ("iv-04", "Meeting Rooms", 252, "must", "sort", "Easy", "intervals", "can attend?"),
    ("iv-05", "Meeting Rooms II", 253, "must", "heap", "Medium", "intervals", "rooms"),
    ("iv-06", "Minimum Interval to Include Each Query", 1851, "nice", "sort", "Hard", "intervals,queries", "answers"),
    ("iv-07", "Employee Free Time", 759, "should", "merge", "Hard", "schedules", "free slots"),
    ("iv-08", "Interval List Intersections", 986, "should", "two-ptr", "Medium", "A,B", "intersections"),
    ("iv-09", "My Calendar I", 729, "should", "design", "Medium", "bookings", "true/false"),
    ("iv-10", "My Calendar II", 731, "nice", "design", "Medium", "bookings", "true/false"),
    ("iv-11", "My Calendar III", 732, "nice", "sweep", "Hard", "bookings", "max overlap"),
    ("iv-12", "Remove Covered Intervals", 1288, "nice", "sort", "Medium", "intervals", "count"),
    ("iv-13", "Data Stream as Disjoint Intervals", 352, "nice", "design", "Hard", "values", "intervals"),
    ("iv-14", "Partition Labels", 763, "should", "greedy", "Medium", "s", "sizes"),
    ("iv-15", "Set Intersection Size At Least Two", 757, "nice", "greedy", "Hard", "intervals", "set size"),
    ("iv-16", "Maximum Number of Events", 1353, "should", "greedy", "Medium", "events", "max attended"),
    ("iv-17", "Car Pooling", 1094, "should", "sweep", "Medium", "trips,capacity", "possible?"),
    ("iv-18", "Minimum Number of Arrows", 452, "should", "greedy", "Medium", "points", "arrows"),
    ("iv-19", "Teemo Attacking", 495, "nice", "merge", "Easy", "timeSeries,duration", "total poison"),
    ("iv-20", "Add Bold Tag in String", 616, "nice", "intervals", "Medium", "s, dict", "bold string"),
]

MATH_SPECS = [
    ("ma-01", "Count Primes", 204, "must", "sieve", "Medium", "n", "count"),
    ("ma-02", "Pow(x, n)", 50, "must", "fast-pow", "Medium", "x,n", "x^n"),
    ("ma-03", "GCD / LCM basics", None, "must", "gcd", "Easy", "a,b", "gcd"),
    ("ma-04", "Excel Sheet Column Title", 168, "nice", "base", "Easy", "n", "title"),
    ("ma-05", "Factorial Trailing Zeroes", 172, "should", "math", "Medium", "n", "zeros"),
    ("ma-06", "Happy Number", 202, "should", "cycle", "Easy", "n", "happy?"),
    ("ma-07", "Max Points on a Line", 149, "should", "geometry", "Hard", "points", "max"),
    ("ma-08", "Pascal's Triangle", 118, "should", "combinatorics", "Easy", "numRows", "triangle"),
    ("ma-09", "Permutation Sequence", 60, "nice", "combinatorics", "Hard", "n,k", "perm"),
    ("ma-10", "Next Permutation", 31, "should", "array", "Medium", "nums", "next"),
    ("ma-11", "Reverse Integer", 7, "should", "overflow", "Medium", "x", "reversed"),
    ("ma-12", "Plus One", 66, "nice", "array", "Easy", "digits", "plus one"),
    ("ma-13", "Multiply Strings", 43, "should", "math", "Medium", "num1,num2", "product"),
    ("ma-14", "Fraction to Recurring Decimal", 166, "nice", "hashmap", "Medium", "numer,denom", "string"),
    ("ma-15", "Valid Square", 593, "nice", "geometry", "Medium", "points", "square?"),
    ("ma-16", "Self Crossing", 335, "nice", "geometry", "Hard", "distance", "cross?"),
    ("ma-17", "Perfect Squares", 279, "should", "dp", "Medium", "n", "min squares"),
    ("ma-18", "Super Pow", 372, "nice", "mod", "Medium", "a,b123", "a^b mod"),
    ("ma-19", "Random Pick with Weight", 528, "should", "prefix", "Medium", "w", "index"),
    ("ma-20", "Nth Magical Number", 878, "nice", "binary-search", "Hard", "n,m", "number"),
]

BIT_SPECS = [
    ("bi-01", "Single Number", 136, "must", "xor", "Easy", "nums", "single"),
    ("bi-02", "Single Number II", 137, "should", "bits", "Medium", "nums", "single"),
    ("bi-03", "Single Number III", 260, "nice", "xor", "Medium", "nums", "two singles"),
    ("bi-04", "Number of 1 Bits", 191, "must", "bits", "Easy", "n", "count"),
    ("bi-05", "Counting Bits", 338, "must", "dp-bits", "Easy", "n", "array"),
    ("bi-06", "Reverse Bits", 190, "should", "bits", "Easy", "n", "reversed"),
    ("bi-07", "Missing Number", 268, "must", "xor", "Easy", "nums", "missing"),
    ("bi-08", "Sum of Two Integers", 371, "should", "bits", "Medium", "a,b", "sum no +/-"),
    ("bi-09", "Gray Code", 89, "nice", "bits", "Medium", "n", "sequence"),
    ("bi-10", "Maximum XOR of Two Numbers", 421, "should", "trie", "Medium", "nums", "max xor"),
    ("bi-11", "Subsets", 78, "should", "bitmask", "Medium", "nums", "subsets"),
    ("bi-12", "Power of Two", 231, "should", "bits", "Easy", "n", "power?"),
    ("bi-13", "Power of Four", 342, "nice", "bits", "Easy", "n", "power?"),
    ("bi-14", "Bitwise AND of Numbers Range", 201, "nice", "bits", "Medium", "left,right", "and"),
    ("bi-15", "UTF-8 Validation", 393, "nice", "bits", "Medium", "data", "valid?"),
    ("bi-16", "Find the Difference", 389, "nice", "xor", "Easy", "s,t", "char"),
    ("bi-17", "Maximum Product of Word Lengths", 318, "nice", "bitmask", "Medium", "words", "max product"),
    ("bi-18", "Total Hamming Distance", 477, "nice", "bits", "Medium", "nums", "distance"),
    ("bi-19", "Repeated DNA Sequences", 187, "nice", "hash", "Medium", "s", "repeated 10-mers"),
    ("bi-20", "Minimum Flips to Make a OR b Equal to c", 1318, "nice", "bits", "Medium", "a,b,c", "flips"),
]

STRINGS_SPECS = [
    ("sr-01", "Longest Palindromic Substring", 5, "must", "expand", "Medium", "s", "substring"),
    ("sr-02", "Valid Palindrome", 125, "should", "two-ptr", "Easy", "s", "valid?"),
    ("sr-03", "Longest Common Prefix", 14, "should", "scan", "Easy", "strs", "prefix"),
    ("sr-04", "Valid Anagram", 242, "must", "count", "Easy", "s,t", "anagram?"),
    ("sr-05", "Group Anagrams", 49, "must", "hash", "Medium", "strs", "groups"),
    ("sr-06", "Minimum Window Substring", 76, "must", "window", "Hard", "s,t", "window"),
    ("sr-07", "Find Index of First Occurrence", 28, "should", "kmp", "Easy", "hay,needle", "index"),
    ("sr-08", "Repeated Substring Pattern", 459, "nice", "kmp", "Easy", "s", "repeat?"),
    ("sr-09", "Implement strStr()", 28, "should", "kmp", "Easy", "hay,needle", "index"),
    ("sr-10", "Zigzag Conversion", 6, "nice", "simulation", "Medium", "s,rows", "zigzag"),
    ("sr-11", "Integer to Roman", 12, "nice", "mapping", "Medium", "num", "roman"),
    ("sr-12", "Roman to Integer", 13, "should", "scan", "Easy", "s", "value"),
    ("sr-13", "Letter Combinations of Phone Number", 17, "should", "backtrack", "Medium", "digits", "combos"),
    ("sr-14", "Generate Parentheses", 22, "should", "backtrack", "Medium", "n", "strings"),
    ("sr-15", "Decode String", 394, "should", "stack", "Medium", "s", "decoded"),
    ("sr-16", "String to Integer (atoi)", 8, "nice", "scan", "Medium", "s", "int"),
    ("sr-17", "Longest Palindromic Subsequence", 516, "should", "dp", "Medium", "s", "length"),
    ("sr-18", "Palindromic Substrings", 647, "should", "expand", "Medium", "s", "count"),
    ("sr-19", "Word Break", 139, "must", "dp", "Medium", "s,dict", "possible?"),
    ("sr-20", "Word Break II", 140, "nice", "backtrack", "Hard", "s,dict", "sentences"),
    ("sr-21", "Edit Distance", 72, "must", "dp", "Medium", "word1,word2", "distance"),
    ("sr-22", "Distinct Subsequences", 115, "nice", "dp", "Hard", "s,t", "count"),
]

DNC_SPECS = [
    ("dc-01", "Pow(x, n)", 50, "must", "divide", "Medium", "x,n", "power"),
    ("dc-02", "Maximum Subarray", 53, "must", "divide", "Medium", "nums", "max sum"),
    ("dc-03", "Sort List", 148, "should", "merge-sort", "Medium", "head", "sorted"),
    ("dc-04", "Count of Smaller After Self", 315, "must", "merge-sort", "Hard", "nums", "counts"),
    ("dc-05", "Reverse Pairs", 493, "should", "merge-sort", "Hard", "nums", "count"),
    ("dc-06", "Count of Range Sum", 327, "should", "merge-sort", "Hard", "nums", "count"),
    ("dc-07", "Median of Two Sorted Arrays", 4, "must", "binary-divide", "Hard", "nums1,nums2", "median"),
    ("dc-08", "Search a 2D Matrix II", 240, "should", "divide", "Medium", "matrix,target", "found?"),
    ("dc-09", "Different Ways to Add Parentheses", 241, "nice", "divide", "Medium", "expression", "results"),
    ("dc-10", "The Skyline Problem", 218, "nice", "divide", "Hard", "buildings", "skyline"),
    ("dc-11", "Construct Quad Tree", 427, "nice", "divide", "Medium", "grid", "tree"),
    ("dc-12", "Merge k Sorted Lists", 23, "should", "divide", "Hard", "lists", "merged"),
    ("dc-13", "Kth Largest in Array", 215, "should", "quickselect", "Medium", "nums,k", "kth"),
    ("dc-14", "Majority Element", 169, "should", "divide", "Easy", "nums", "majority"),
    ("dc-15", "Majority Element II", 229, "nice", "divide", "Medium", "nums", "elements"),
    ("dc-16", "Beautiful Array", 932, "nice", "divide", "Medium", "n", "array"),
    ("dc-17", "Predict the Winner", 486, "nice", "divide", "Medium", "nums", "predict?"),
    ("dc-18", "Burst Balloons", 312, "should", "divide", "Hard", "nums", "max coins"),
]

SEGMENT_SPECS = [
    ("sg-01", "Range Sum Query Mutable", 307, "must", "fenwick", "Medium", "nums, ops", "sums"),
    ("sg-02", "Range Sum Query 2D Mutable", 308, "nice", "2d-bit", "Hard", "matrix", "sums"),
    ("sg-03", "Count of Smaller After Self", 315, "should", "bit", "Hard", "nums", "counts"),
    ("sg-04", "Count of Range Sum", 327, "should", "merge-bit", "Hard", "nums", "count"),
    ("sg-05", "Reverse Pairs", 493, "should", "merge-bit", "Hard", "nums", "count"),
    ("sg-06", "Falling Squares", 699, "nice", "segment", "Hard", "positions", "heights"),
    ("sg-07", "My Calendar III", 732, "nice", "segment", "Hard", "bookings", "max overlap"),
    ("sg-08", "The Skyline Problem", 218, "should", "sweep", "Hard", "buildings", "skyline"),
    ("sg-09", "Range Module", 715, "nice", "segment", "Hard", "track range", "module"),
    ("sg-10", "Count Good Triplets in Array", 2179, "nice", "bit", "Hard", "nums1,nums2", "count"),
    ("sg-11", "Create Sorted Array through Instructions", 1649, "nice", "bit", "Hard", "instructions", "cost"),
    ("sg-12", "Maximum Sum Queries", 2736, "nice", "segment", "Hard", "nums1,nums2,queries", "answers"),
    ("sg-13", "Longest Increasing Subsequence II", 2407, "nice", "segment", "Hard", "nums,k", "LIS len"),
    ("sg-14", "Number of Longest Increasing Subsequence", 673, "should", "bit", "Medium", "nums", "count"),
    ("sg-15", "Range Maximum Query (classic)", None, "must", "segment", "Medium", "arr, queries", "max"),
    ("sg-16", "Lazy Propagation Range Update", None, "should", "lazy", "Hard", "arr, updates", "queries"),
]

TOPIC_SPECS = [
    ("arrays", "Arrays & Hashing", 28, "hashmap,hashset,prefix — filter Must do first.", [
        {"id": "hashmap", "label": "HashMap"}, {"id": "hashset", "label": "HashSet"},
        {"id": "prefix", "label": "Prefix"}, {"id": "counting", "label": "Counting"},
        {"id": "design", "label": "Design"}, {"id": "matrix", "label": "Matrix"},
        {"id": "indexing", "label": "Indexing"}, {"id": "kadane", "label": "Kadane"},
    ], ARRAYS_SPECS),
    ("prefix-sum", "Prefix Sum & Difference Array", 22, "Subarray sum K and range queries — core for arrays.", [
        {"id": "1d-prefix", "label": "1D Prefix"}, {"id": "2d-prefix", "label": "2D Prefix"},
        {"id": "diff-array", "label": "Diff Array"}, {"id": "hashmap", "label": "+ HashMap"},
        {"id": "kadane", "label": "Kadane"}, {"id": "bit", "label": "BIT"},
    ], PREFIX_SPECS),
    ("two-pointers", "Two Pointers & Sliding Window", 28, "Opposite pointers + variable window = most string/array hard problems.", [
        {"id": "opposite", "label": "Opposite"}, {"id": "same-dir", "label": "Same Direction"},
        {"id": "fixed-window", "label": "Fixed Window"}, {"id": "variable-window", "label": "Variable Window"},
    ], TWOPTR_SPECS),
    ("binary-search", "Binary Search", 26, "90% are first-true on answer space — master the three templates.", [
        {"id": "exact", "label": "Exact"}, {"id": "first-true", "label": "First True"},
        {"id": "last-true", "label": "Last True"}, {"id": "rotated", "label": "Rotated"},
        {"id": "answer-space", "label": "Answer Space"}, {"id": "2d", "label": "2D"},
    ], BSEARCH_SPECS),
    ("backtracking", "Backtracking", 28, "One skeleton: choose / explore / unchoose. Prune early.", [
        {"id": "subsets", "label": "Subsets"}, {"id": "permutations", "label": "Permutations"},
        {"id": "combinations", "label": "Combinations"}, {"id": "grid", "label": "Grid"},
        {"id": "constraint", "label": "Constraint"}, {"id": "string", "label": "String"},
    ], BACKTRACK_SPECS),
    ("greedy", "Greedy", 24, "Prove greedy choice + optimal substructure — intervals and jumps first.", [
        {"id": "intervals", "label": "Intervals"}, {"id": "jump", "label": "Jump Game"},
        {"id": "scheduling", "label": "Scheduling"}, {"id": "scan", "label": "Linear Scan"},
        {"id": "heap", "label": "+ Heap"}, {"id": "sort", "label": "Sort"},
    ], GREEDY_SPECS),
    ("trees", "Binary Trees & BST", 35, "DFS postorder for aggregates; BST inorder for sorted order.", [
        {"id": "dfs", "label": "DFS"}, {"id": "bfs", "label": "BFS"}, {"id": "bst", "label": "BST"},
        {"id": "path", "label": "Path"}, {"id": "serialize", "label": "Serialize"}, {"id": "build", "label": "Build"},
    ], TREES_SPECS),
    ("linked-list", "Linked List", 24, "Dummy head + fast/slow covers 80% of LL rounds.", [
        {"id": "reverse", "label": "Reverse"}, {"id": "fast-slow", "label": "Fast/Slow"},
        {"id": "merge", "label": "Merge"}, {"id": "design", "label": "Design"}, {"id": "two-ptr", "label": "Two Ptr"},
    ], LL_SPECS),
    ("stack", "Stack & Monotonic Stack", 24, "Monotonic stack = next greater/smaller in O(n).", [
        {"id": "basic", "label": "Basic Stack"}, {"id": "monotonic", "label": "Monotonic"},
        {"id": "expression", "label": "Expression"}, {"id": "design", "label": "Design"},
    ], STACK_SPECS),
    ("heaps", "Heaps & Priority Queues", 18, "Top-K and two-heaps median — know when heap beats sort.", [
        {"id": "two-heaps", "label": "Two Heaps"}, {"id": "top-k", "label": "Top K"},
        {"id": "scheduling", "label": "Scheduling"}, {"id": "merge", "label": "K-Way Merge"},
    ], HEAPS_SPECS),
    ("sorting", "Sorting & Selection", 20, "Quickselect for Kth; merge sort for inversions; Dutch flag for 3-way.", [
        {"id": "merge-sort", "label": "Merge Sort"}, {"id": "quick-select", "label": "Quick Select"},
        {"id": "dutch-flag", "label": "Dutch Flag"}, {"id": "custom-sort", "label": "Custom Sort"},
        {"id": "counting", "label": "Counting Sort"}, {"id": "sort", "label": "Sort Apps"},
    ], SORTING_SPECS),
    ("tries", "Tries", 16, "Prefix tree for autocomplete, word search II, XOR trie.", [
        {"id": "trie", "label": "Trie"}, {"id": "trie-dfs", "label": "Trie + DFS"},
        {"id": "bit-trie", "label": "Bit Trie"}, {"id": "trie-dp", "label": "Trie + DP"},
    ], TRIES_SPECS),
    ("intervals", "Intervals", 20, "Sort by start/end then merge or sweep — meeting rooms is the template.", [
        {"id": "merge", "label": "Merge"}, {"id": "greedy", "label": "Greedy"},
        {"id": "heap", "label": "Heap"}, {"id": "design", "label": "Design"}, {"id": "sweep", "label": "Sweep Line"},
    ], INTERVALS_SPECS),
    ("math", "Math & Number Theory", 20, "GCD, sieve, fast pow, modular arithmetic.", [
        {"id": "sieve", "label": "Sieve"}, {"id": "gcd", "label": "GCD/LCM"},
        {"id": "fast-pow", "label": "Fast Pow"}, {"id": "combinatorics", "label": "Combinatorics"},
        {"id": "geometry", "label": "Geometry"}, {"id": "mod", "label": "Modular"},
    ], MATH_SPECS),
    ("bit", "Bit Manipulation", 20, "XOR for pairs; bitmask for subsets; Brian Kernighan for bit count.", [
        {"id": "xor", "label": "XOR"}, {"id": "bits", "label": "Bit Ops"},
        {"id": "bitmask", "label": "Bitmask"}, {"id": "dp-bits", "label": "DP + Bits"},
    ], BIT_SPECS),
    ("strings", "String Algorithms", 22, "Sliding window, KMP, palindrome expand, edit distance.", [
        {"id": "expand", "label": "Expand"}, {"id": "window", "label": "Window"},
        {"id": "kmp", "label": "KMP"}, {"id": "dp", "label": "DP"}, {"id": "backtrack", "label": "Backtrack"},
    ], STRINGS_SPECS),
    ("dnc", "Divide & Conquer", 18, "Merge sort side effects (inversions); binary search on answer.", [
        {"id": "divide", "label": "D&C"}, {"id": "merge-sort", "label": "Merge Sort"},
        {"id": "quickselect", "label": "Quick Select"}, {"id": "binary-divide", "label": "Binary D&C"},
    ], DNC_SPECS),
    ("segment", "Segment Tree & BIT", 16, "Fenwick for point update + range sum; segment tree for range max/min.", [
        {"id": "fenwick", "label": "Fenwick BIT"}, {"id": "segment", "label": "Segment Tree"},
        {"id": "lazy", "label": "Lazy Prop"}, {"id": "bit", "label": "BIT Apps"},
    ], SEGMENT_SPECS),
]


def build_questions(specs):
    return [S(*row) for row in specs]


def all_topics():
    topics = []
    for tid, title, count, strategy, subtopics, specs in TOPIC_SPECS:
        qs = build_questions(specs)
        topics.append(build_topic(
            tid, title, count,
            "<strong>Speed-run:</strong> " + strategy + " Filter <em>Must do</em> first.",
            subtopics, qs,
        ))
    return topics


def main():
    from graph_catalog import GRAPH_TOPIC
    from dp_catalog import DP_TOPIC
    topics = [GRAPH_TOPIC, DP_TOPIC] + all_topics()
    for topic in topics:
        n = len(topic["questions"])
        exp = topic.get("expected_count")
        if exp and n != exp:
            raise SystemExit("%s: expected %d got %d" % (topic["id"], exp, n))
        write_topic_js(topic)
        write_topic_html(topic)
        print("%s: %d questions (%d must)" % (
            topic["id"], n, sum(1 for x in topic["questions"] if x["importance"] == "must")))
    print("Total topics:", len(topics))


if __name__ == "__main__":
    main()
