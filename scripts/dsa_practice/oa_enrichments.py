# Hand-authored descriptions for OA / GFG classics (no LC fetch).

OA_QID_OVERRIDES = {
    "oa-01": (
        "Count substrings of a binary string with equal number of 0s, 1s, and 2s. "
        "GFG classic — prefix difference hashing, not sliding window.",
        "Track (count0−count1, count0−count2) as a key; each matching prior prefix adds one valid substring.",
    ),
    "oa-02": (
        "Count substrings of a string over {a,b,c} with equal counts of each letter. "
        "Same prefix-hash trick as the 0/1/2 variant.",
        "Use two independent balance maps encoded as one hash key; O(n) single pass.",
    ),
    "oa-03": (
        "Count substrings that contain at least one 'a', one 'b', and one 'c'. "
        "Different from anagram/equal-count windows — you need presence, not balance.",
        "Expand right until all three appear; each valid left shrink adds (n−r) substrings ending at r.",
    ),
    "oa-04": (
        "Count contiguous subarrays with equal number of 0s and 1s (binary array). "
        "LC 525 asks for max length; OA often asks for count.",
        "Treat 0 as −1; count prefix balances in a hash map.",
    ),
    "oa-05": (
        "Length of the longest subarray with sum exactly zero. GFG / OA array staple.",
        "Store earliest index per prefix sum; farthest equal sums give max length.",
    ),
    "oa-06": (
        "Aggressive Cows (SPOJ/GFG): place C cows in N sorted stalls to maximize minimum distance.",
        "Binary search the answer; greedy feasibility places cows as early as possible.",
    ),
    "oa-07": (
        "Job Sequencing with Deadlines — maximize profit scheduling one job per day.",
        "Sort by profit; assign each job to latest free slot before its deadline.",
    ),
    "oa-08": (
        "Minimum Platforms — max simultaneous trains given arrival/departure times.",
        "Event sweep: +1 at arrival, −1 at departure; track running max.",
    ),
    "oa-09": (
        "Find the missing and repeating number in 1..n (exactly one of each). GFG OA favorite.",
        "Sum and sum-of-squares give repeating−missing; solve for both values.",
    ),
    "oa-10": (
        "Maximum subarray sum in a circular array (wrap-around allowed).",
        "Either best non-wrap Kadane or total−min subarray (unless all negative).",
    ),
    "oa-11": (
        "Connect N ropes with minimum total cost — always merge two smallest (GFG heap).",
        "Min-heap; each merge cost is sum of two extracted lengths.",
    ),
    "oa-12": (
        "Celebrity Problem — person known by all but knows nobody. Matrix knows[i][j]=1 if i knows j.",
        "Elimination finds candidate in O(n); verify row/column in O(n).",
    ),
    "oa-13": (
        "Rat in a Maze — can a rat reach bottom-right moving only down/right on 0/1 grid?",
        "DFS/backtrack with temporary marking; classic OA recursion test.",
    ),
    "oa-14": (
        "Josephus problem: n people in circle, eliminate every k-th until one remains. Return survivor label.",
        "Iterative recurrence ans = (ans + k) % i avoids simulation.",
    ),
    "oa-15": (
        "Count pairs in a sorted array with sum equal to target (duplicates allowed).",
        "Two pointers; on match count equal-value runs on both sides.",
    ),
    "oa-16": (
        "Trapping Rain Water II — 2D elevation map; water trapped above interior cells.",
        "Min-heap BFS from border; expand inward maintaining wall height.",
    ),
    "oa-17": (
        "Maximum of all subarrays of size k (GFG sliding window). Same idea as LC 239.",
        "Monotonic deque stores indices of decreasing values in current window.",
    ),
    "oa-18": (
        "Equilibrium index — position where left sum equals right sum.",
        "Single pass: running left sum vs remaining total.",
    ),
    "oa-19": (
        "Leaders in an array — elements greater than all elements to their right.",
        "Scan right-to-left tracking running maximum.",
    ),
    "oa-20": (
        "Minimum jumps to reach end of array (each element is max jump from that index).",
        "Greedy layers: extend reachable range; jump when current layer ends.",
    ),
    "oa-21": (
        "Next Smaller Element for each array position (NSE). Monotonic stack variant.",
        "Stack of indices; pop while current is smaller than stack top.",
    ),
    "oa-22": (
        "Maximum meetings in one room (non-overlapping intervals, count not min rooms).",
        "Activity selection: sort by end time, greedy pick compatible meetings.",
    ),
    "oa-23": (
        "Maximum absolute sum of any subarray (mix of positive and negative Kadane).",
        "Track both max prefix and min prefix subarray sums.",
    ),
    "oa-24": (
        "Decode string k[encoded] — nested brackets with repeat counts (GFG stack).",
        "Stack previous strings and repeat counts; expand on closing bracket.",
    ),
    "oa-25": (
        "Sort array of 0s, 1s, and 2s in-place (Dutch National Flag). GFG before LC 75.",
        "Three pointers: lo/mid/hi partition in one pass.",
    ),
    "oa-26": (
        "Rotate array right by k steps in-place (GFG array rotation).",
        "Reverse whole array, then reverse first k and remainder.",
    ),
    "oa-27": (
        "Implement strstr / find first occurrence using KMP (GFG string matching).",
        "Build LPS prefix table; never backtrack in haystack.",
    ),
    "oa-28": (
        "Merge two sorted arrays in-place when first array has trailing space (GFG merge).",
        "Fill from the end comparing largest elements.",
    ),
    "oa-29": (
        "Rotten Oranges — minutes until all fresh oranges rot (4-direction BFS).",
        "Multi-source BFS layer by layer; return −1 if fresh remain.",
    ),
    "oa-30": (
        "Find duplicate in array of n+1 integers in [1,n] without modifying much (Floyd cycle).",
        "Phase 1 find intersection; phase 2 find entrance = duplicate.",
    ),
    "oa-31": (
        "Count inversions in an array (merge sort / GFG divide-and-conquer).",
        "Standard merge step adds inversions when right element is smaller.",
    ),
    "oa-32": (
        "Longest palindromic substring length (expand around center). GFG before LC 5.",
        "Check odd and even centers; track best span.",
    ),
}

OA_SUBTOPIC_SUMMARIES = {
    "prefix-hash": "Prefix balance / sum hashing — GFG equal-count substring family and zero-sum subarrays.",
    "sliding-window": "Window variants OA tests: presence vs equal counts, deque max-in-window.",
    "binary-search": "Answer-space binary search on sorted or monotonic feasibility.",
    "greedy": "Deadlines, activity selection, jump games — classic GFG greedy.",
    "intervals": "Platform / meeting sweep lines and non-overlapping scheduling.",
    "heap": "K-way merge costs and 2D rain trapping with priority queue.",
    "graph-bfs": "Grid BFS layers — rotten oranges and similar OA graph templates.",
    "stack": "Monotonic stack, bracket decode, KMP — string/array stack patterns.",
    "backtracking": "Grid path existence — rat in maze and recursion hygiene.",
    "math": "Josephus, missing/repeating — formula and XOR/math tricks.",
    "array-scan": "Equilibrium, leaders, rotation — linear scans interviewers still ask.",
}
