window.PRACTICE_TOPIC = {
  "id": "oa-supplement",
  "title": "OA Supplement",
  "expected_count": 32,
  "strategy": "<strong>Non-LC must-know:</strong> GFG classics, Striver gaps, and company-OA twists — one curated variant per pattern where LeetCode sheets stop short. <ul><li>Start with <em>Must do</em> (prefix-hash + sliding-window variants)</li><li>Pair with <a href=\"topics/prefix-sum.html\">Prefix Sum</a> and <a href=\"topics/two-pointers.html\">Two Pointers</a> for LC overlap</li><li>~10 min each — these show up in OA even when not in NeetCode 150</li></ul>",
  "subtopics": [
    {
      "id": "prefix-hash",
      "label": "Prefix + Hash"
    },
    {
      "id": "sliding-window",
      "label": "Sliding Window"
    },
    {
      "id": "binary-search",
      "label": "Binary Search"
    },
    {
      "id": "greedy",
      "label": "Greedy"
    },
    {
      "id": "intervals",
      "label": "Intervals / Sweep"
    },
    {
      "id": "heap",
      "label": "Heap"
    },
    {
      "id": "graph-bfs",
      "label": "Grid BFS"
    },
    {
      "id": "stack",
      "label": "Stack / KMP"
    },
    {
      "id": "backtracking",
      "label": "Backtracking"
    },
    {
      "id": "math",
      "label": "Math / Floyd"
    },
    {
      "id": "array-scan",
      "label": "Array Scan"
    }
  ],
  "questions": [
    {
      "id": "oa-01",
      "title": "Equal 0/1/2 Substring Count",
      "lc": null,
      "importance": "must",
      "subtopic": "prefix-hash",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "string of 0,1,2",
          "out": "count of valid substrings",
          "note": "Source: GFG — OA supplement (not always in NeetCode 150)"
        }
      ],
      "approaches": [
        {
          "name": "Prefix diff pair",
          "time": "O(n)",
          "space": "O(n)",
          "code": "long long countEqual012(string s) {\n    long long z = 0, o = 0, t = 0, ans = 0;\n    const long long SHIFT = 1000003LL;\n    unordered_map<long long, long long> freq;\n    freq[0] = 1;\n    for (char c : s) {\n        if (c == '0') z++;\n        else if (c == '1') o++;\n        else t++;\n        long long key = (z - o) * SHIFT + (z - t);\n        ans += freq[key];\n        freq[key]++;\n    }\n    return ans;\n}"
        }
      ],
      "description": "Count substrings of a binary string with equal number of 0s, 1s, and 2s. GFG classic — prefix difference hashing, not sliding window.",
      "summary": "Track (count0−count1, count0−count2) as a key; each matching prior prefix adds one valid substring."
    },
    {
      "id": "oa-02",
      "title": "Equal a/b/c Substring Count",
      "lc": null,
      "importance": "must",
      "subtopic": "prefix-hash",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "string of a,b,c",
          "out": "count of valid substrings",
          "note": "Source: GFG — OA supplement (not always in NeetCode 150)"
        }
      ],
      "approaches": [
        {
          "name": "Prefix diff pair",
          "time": "O(n)",
          "space": "O(n)",
          "code": "long long countEqualABC(string s) {\n    long long a = 0, b = 0, c = 0, ans = 0;\n    const long long SHIFT = 1000003LL;\n    unordered_map<long long, long long> freq;\n    freq[0] = 1;\n    for (char ch : s) {\n        if (ch == 'a') a++;\n        else if (ch == 'b') b++;\n        else c++;\n        long long key = (a - b) * SHIFT + (b - c);\n        ans += freq[key];\n        freq[key]++;\n    }\n    return ans;\n}"
        }
      ],
      "description": "Count substrings of a string over {a,b,c} with equal counts of each letter. Same prefix-hash trick as the 0/1/2 variant.",
      "summary": "Use two independent balance maps encoded as one hash key; O(n) single pass."
    },
    {
      "id": "oa-03",
      "title": "Substrings With All a, b, c",
      "lc": null,
      "importance": "must",
      "subtopic": "sliding-window",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "lowercase a–c only",
          "out": "count substrings with each char ≥1",
          "note": "Source: GFG — OA supplement (not always in NeetCode 150)"
        }
      ],
      "approaches": [
        {
          "name": "Sliding window shrink",
          "time": "O(n)",
          "space": "O(1)",
          "code": "long long substringsAllThree(string s) {\n    int n = s.size(), cnt[3] = {0}, l = 0;\n    long long ans = 0;\n    for (int r = 0; r < n; r++) {\n        cnt[s[r] - 'a']++;\n        while (cnt[0] > 0 && cnt[1] > 0 && cnt[2] > 0) {\n            ans += n - r;\n            cnt[s[l] - 'a']--;\n            l++;\n        }\n    }\n    return ans;\n}"
        }
      ],
      "description": "Count substrings that contain at least one 'a', one 'b', and one 'c'. Different from anagram/equal-count windows — you need presence, not balance.",
      "summary": "Expand right until all three appear; each valid left shrink adds (n−r) substrings ending at r."
    },
    {
      "id": "oa-04",
      "title": "Count Subarrays Equal 0 and 1",
      "lc": null,
      "importance": "must",
      "subtopic": "prefix-hash",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "binary array",
          "out": "count (525 asks max length)",
          "note": "Source: GFG/OA — OA supplement (not always in NeetCode 150)"
        }
      ],
      "approaches": [
        {
          "name": "Prefix balance map",
          "time": "O(n)",
          "space": "O(n)",
          "code": "long long countEqual01(vector<int>& nums) {\n    long long bal = 0, ans = 0;\n    unordered_map<long long, long long> freq;\n    freq[0] = 1;\n    for (int x : nums) {\n        bal += x ? 1 : -1;\n        ans += freq[bal];\n        freq[bal]++;\n    }\n    return ans;\n}"
        }
      ],
      "description": "Count contiguous subarrays with equal number of 0s and 1s (binary array). LC 525 asks for max length; OA often asks for count.",
      "summary": "Treat 0 as −1; count prefix balances in a hash map."
    },
    {
      "id": "oa-05",
      "title": "Longest Subarray Sum Zero",
      "lc": null,
      "importance": "must",
      "subtopic": "prefix-hash",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "int array",
          "out": "max length",
          "note": "Source: GFG — OA supplement (not always in NeetCode 150)"
        }
      ],
      "approaches": [
        {
          "name": "Prefix sum earliest index",
          "time": "O(n)",
          "space": "O(n)",
          "code": "int maxLenZeroSum(vector<int>& nums) {\n    unordered_map<long long, int> first;\n    first[0] = -1;\n    long long sum = 0;\n    int ans = 0;\n    for (int i = 0; i < (int)nums.size(); i++) {\n        sum += nums[i];\n        if (first.count(sum)) ans = max(ans, i - first[sum]);\n        else first[sum] = i;\n    }\n    return ans;\n}"
        }
      ],
      "description": "Length of the longest subarray with sum exactly zero. GFG / OA array staple.",
      "summary": "Store earliest index per prefix sum; farthest equal sums give max length."
    },
    {
      "id": "oa-06",
      "title": "Aggressive Cows (Max Min Dist)",
      "lc": null,
      "importance": "should",
      "subtopic": "binary-search",
      "difficulty": "Hard",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "sorted stalls, C cows",
          "out": "maximum minimum distance",
          "note": "Source: SPOJ/GFG — OA supplement (not always in NeetCode 150)"
        }
      ],
      "approaches": [
        {
          "name": "Binary search on answer",
          "time": "O(n log range)",
          "space": "O(1)",
          "code": "bool canPlace(vector<int>& stalls, int cows, int dist) {\n    int placed = 1, last = stalls[0];\n    for (int i = 1; i < (int)stalls.size(); i++) {\n        if (stalls[i] - last >= dist) {\n            placed++;\n            last = stalls[i];\n        }\n    }\n    return placed >= cows;\n}\nint aggressiveCows(vector<int>& stalls, int cows) {\n    sort(stalls.begin(), stalls.end());\n    int lo = 1, hi = stalls.back() - stalls[0], ans = 0;\n    while (lo <= hi) {\n        int mid = lo + (hi - lo) / 2;\n        if (canPlace(stalls, cows, mid)) { ans = mid; lo = mid + 1; }\n        else hi = mid - 1;\n    }\n    return ans;\n}"
        }
      ],
      "description": "Aggressive Cows (SPOJ/GFG): place C cows in N sorted stalls to maximize minimum distance.",
      "summary": "Binary search the answer; greedy feasibility places cows as early as possible."
    },
    {
      "id": "oa-07",
      "title": "Job Sequencing with Deadlines",
      "lc": null,
      "importance": "should",
      "subtopic": "greedy",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "jobs with deadline, profit",
          "out": "max profit",
          "note": "Source: GFG — OA supplement (not always in NeetCode 150)"
        }
      ],
      "approaches": [
        {
          "name": "Sort by deadline + DSU",
          "time": "O(n log n)",
          "space": "O(n)",
          "code": "int jobSequencing(vector<pair<int,int>>& jobs) {\n    sort(jobs.begin(), jobs.end(), [](auto& a, auto& b) {\n        return a.second > b.second;\n    });\n    int maxDay = 0;\n    for (auto& j : jobs) maxDay = max(maxDay, j.first);\n    vector<int> slot(maxDay + 1, -1);\n    int profit = 0;\n    for (auto& j : jobs) {\n        for (int d = min(j.first, maxDay); d >= 1; d--) {\n            if (slot[d] == -1) { slot[d] = 1; profit += j.second; break; }\n        }\n    }\n    return profit;\n}"
        }
      ],
      "description": "Job Sequencing with Deadlines — maximize profit scheduling one job per day.",
      "summary": "Sort by profit; assign each job to latest free slot before its deadline."
    },
    {
      "id": "oa-08",
      "title": "Minimum Platforms",
      "lc": null,
      "importance": "must",
      "subtopic": "intervals",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "arrival & departure arrays",
          "out": "min platforms",
          "note": "Source: GFG/OA — OA supplement (not always in NeetCode 150)"
        }
      ],
      "approaches": [
        {
          "name": "Sweep line events",
          "time": "O(n log n)",
          "space": "O(n)",
          "code": "int findPlatform(vector<int>& arr, vector<int>& dep) {\n    vector<pair<int,int>> ev;\n    for (int t : arr) ev.push_back({t, 1});\n    for (int t : dep) ev.push_back({t, -1});\n    sort(ev.begin(), ev.end());\n    int cur = 0, ans = 0;\n    for (auto& e : ev) {\n        cur += e.second;\n        ans = max(ans, cur);\n    }\n    return ans;\n}"
        }
      ],
      "description": "Minimum Platforms — max simultaneous trains given arrival/departure times.",
      "summary": "Event sweep: +1 at arrival, −1 at departure; track running max."
    },
    {
      "id": "oa-09",
      "title": "Missing and Repeating Number",
      "lc": null,
      "importance": "must",
      "subtopic": "math",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "1..n with one missing, one duplicate",
          "out": "both values",
          "note": "Source: GFG — OA supplement (not always in NeetCode 150)"
        }
      ],
      "approaches": [
        {
          "name": "XOR + math",
          "time": "O(n)",
          "space": "O(1)",
          "code": "pair<int,int> missingRepeating(vector<int>& nums) {\n    int n = nums.size();\n    long long s = 0, s2 = 0;\n    for (int x : nums) { s += x; s2 += 1LL * x * x; }\n    long long sn = 1LL * n * (n + 1) / 2;\n    long long sn2 = 1LL * n * (n + 1) * (2LL * n + 1) / 6;\n    long long diff = s - sn;\n    long long sumBoth = (s2 - sn2) / diff;\n    int repeating = (int)((sumBoth + diff) / 2);\n    int missing = (int)((sumBoth - diff) / 2);\n    return {missing, repeating};\n}"
        }
      ],
      "description": "Find the missing and repeating number in 1..n (exactly one of each). GFG OA favorite.",
      "summary": "Sum and sum-of-squares give repeating−missing; solve for both values."
    },
    {
      "id": "oa-10",
      "title": "Max Circular Subarray Sum",
      "lc": null,
      "importance": "should",
      "subtopic": "array-scan",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "circular int array",
          "out": "max subarray sum",
          "note": "Source: GFG/LC918 — OA supplement (not always in NeetCode 150)"
        }
      ],
      "approaches": [
        {
          "name": "Kadane + wrap",
          "time": "O(n)",
          "space": "O(1)",
          "code": "int maxCircularSum(vector<int>& nums) {\n    int total = 0, maxSum = nums[0], minSum = nums[0], curMax = 0, curMin = 0;\n    for (int x : nums) {\n        total += x;\n        curMax = max(x, curMax + x);\n        curMin = min(x, curMin + x);\n        maxSum = max(maxSum, curMax);\n        minSum = min(minSum, curMin);\n    }\n    return total == minSum ? maxSum : max(maxSum, total - minSum);\n}"
        }
      ],
      "description": "Maximum subarray sum in a circular array (wrap-around allowed).",
      "summary": "Either best non-wrap Kadane or total−min subarray (unless all negative)."
    },
    {
      "id": "oa-11",
      "title": "Connect N Ropes (Min Cost)",
      "lc": null,
      "importance": "should",
      "subtopic": "heap",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "rope lengths",
          "out": "min merge cost",
          "note": "Source: GFG — OA supplement (not always in NeetCode 150)"
        }
      ],
      "approaches": [
        {
          "name": "Min heap merge",
          "time": "O(n log n)",
          "space": "O(n)",
          "code": "int connectRopes(vector<int>& ropes) {\n    priority_queue<int, vector<int>, greater<int>> pq(ropes.begin(), ropes.end());\n    int cost = 0;\n    while (pq.size() > 1) {\n        int a = pq.top(); pq.pop();\n        int b = pq.top(); pq.pop();\n        cost += a + b;\n        pq.push(a + b);\n    }\n    return cost;\n}"
        }
      ],
      "description": "Connect N ropes with minimum total cost — always merge two smallest (GFG heap).",
      "summary": "Min-heap; each merge cost is sum of two extracted lengths."
    },
    {
      "id": "oa-12",
      "title": "Celebrity Problem",
      "lc": null,
      "importance": "nice",
      "subtopic": "array-scan",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "knows matrix n×n",
          "out": "celebrity index or −1",
          "note": "Source: GFG — OA supplement (not always in NeetCode 150)"
        }
      ],
      "approaches": [
        {
          "name": "Elimination",
          "time": "O(n)",
          "space": "O(n)",
          "code": "int celebrity(vector<vector<int>>& knows) {\n    int n = knows.size(), cand = 0;\n    for (int i = 1; i < n; i++)\n        if (knows[cand][i]) cand = i;\n    for (int i = 0; i < n; i++) {\n        if (i == cand) continue;\n        if (knows[cand][i] || !knows[i][cand]) return -1;\n    }\n    return cand;\n}"
        }
      ],
      "description": "Celebrity Problem — person known by all but knows nobody. Matrix knows[i][j]=1 if i knows j.",
      "summary": "Elimination finds candidate in O(n); verify row/column in O(n)."
    },
    {
      "id": "oa-13",
      "title": "Rat in a Maze",
      "lc": null,
      "importance": "should",
      "subtopic": "backtracking",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "0/1 grid",
          "out": "path exists down/right",
          "note": "Source: GFG — OA supplement (not always in NeetCode 150)"
        }
      ],
      "approaches": [
        {
          "name": "Backtrack grid",
          "time": "O(4^nm)",
          "space": "O(nm)",
          "code": "bool dfsMaze(vector<vector<int>>& g, int r, int c) {\n    int n = g.size(), m = g[0].size();\n    if (r < 0 || c < 0 || r >= n || c >= m || g[r][c] == 0) return false;\n    if (r == n - 1 && c == m - 1) return true;\n    g[r][c] = 0;\n    bool ok = dfsMaze(g, r + 1, c) || dfsMaze(g, r, c + 1);\n    g[r][c] = 1;\n    return ok;\n}\nbool ratInMaze(vector<vector<int>>& maze) {\n    return dfsMaze(maze, 0, 0);\n}"
        }
      ],
      "description": "Rat in a Maze — can a rat reach bottom-right moving only down/right on 0/1 grid?",
      "summary": "DFS/backtrack with temporary marking; classic OA recursion test."
    },
    {
      "id": "oa-14",
      "title": "Josephus Problem",
      "lc": null,
      "importance": "nice",
      "subtopic": "math",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "n people, step k",
          "out": "survivor label 1..n",
          "note": "Source: GFG/OA — OA supplement (not always in NeetCode 150)"
        }
      ],
      "approaches": [
        {
          "name": "Recurrence",
          "time": "O(n)",
          "space": "O(1)",
          "code": "int josephus(int n, int k) {\n    int ans = 0;\n    for (int i = 2; i <= n; i++)\n        ans = (ans + k) % i;\n    return ans + 1;\n}"
        }
      ],
      "description": "Josephus problem: n people in circle, eliminate every k-th until one remains. Return survivor label.",
      "summary": "Iterative recurrence ans = (ans + k) % i avoids simulation."
    },
    {
      "id": "oa-15",
      "title": "Count Pairs With Sum (Sorted)",
      "lc": null,
      "importance": "should",
      "subtopic": "array-scan",
      "difficulty": "Easy",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "sorted array, target",
          "out": "pair count",
          "note": "Source: GFG — OA supplement (not always in NeetCode 150)"
        }
      ],
      "approaches": [
        {
          "name": "Two pointers",
          "time": "O(n)",
          "space": "O(1)",
          "code": "int countPairsSum(vector<int>& arr, int target) {\n    sort(arr.begin(), arr.end());\n    int l = 0, r = arr.size() - 1, ans = 0;\n    while (l < r) {\n        int s = arr[l] + arr[r];\n        if (s == target) {\n            if (arr[l] == arr[r]) {\n                long long c = r - l + 1;\n                ans += (int)(c * (c - 1) / 2);\n                break;\n            }\n            int lc = 1, rc = 1;\n            while (l + 1 < r && arr[l] == arr[l + 1]) l++, lc++;\n            while (r - 1 > l && arr[r] == arr[r - 1]) r--, rc++;\n            ans += lc * rc;\n            l++; r--;\n        } else if (s < target) l++;\n        else r--;\n    }\n    return ans;\n}"
        }
      ],
      "description": "Count pairs in a sorted array with sum equal to target (duplicates allowed).",
      "summary": "Two pointers; on match count equal-value runs on both sides."
    },
    {
      "id": "oa-16",
      "title": "Trapping Rain Water II (2D)",
      "lc": null,
      "importance": "nice",
      "subtopic": "heap",
      "difficulty": "Hard",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "2D height map",
          "out": "trapped water volume",
          "note": "Source: LC407/GFG — OA supplement (not always in NeetCode 150)"
        }
      ],
      "approaches": [
        {
          "name": "Min heap BFS",
          "time": "O(mn log mn)",
          "space": "O(mn)",
          "code": "int trapRainWater2(vector<vector<int>>& h) {\n    int n = h.size(), m = h[0].size();\n    if (n == 0) return 0;\n    priority_queue<array<int,3>, vector<array<int,3>>, greater<array<int,3>>> pq;\n    vector<vector<bool>> vis(n, vector<bool>(m, false));\n    for (int i = 0; i < n; i++)\n        for (int j = 0; j < m; j++)\n            if (i == 0 || j == 0 || i == n - 1 || j == m - 1) {\n                pq.push({h[i][j], i, j});\n                vis[i][j] = true;\n            }\n    int dr[4] = {1,-1,0,0}, dc[4] = {0,0,1,-1}, ans = 0, wall = 0;\n    while (!pq.empty()) {\n        auto cur = pq.top(); pq.pop();\n        wall = max(wall, cur[0]);\n        for (int k = 0; k < 4; k++) {\n            int r = cur[1] + dr[k], c = cur[2] + dc[k];\n            if (r < 0 || c < 0 || r >= n || c >= m || vis[r][c]) continue;\n            vis[r][c] = true;\n            if (h[r][c] < wall) ans += wall - h[r][c];\n            pq.push({h[r][c], r, c});\n        }\n    }\n    return ans;\n}"
        }
      ],
      "description": "Trapping Rain Water II — 2D elevation map; water trapped above interior cells.",
      "summary": "Min-heap BFS from border; expand inward maintaining wall height."
    },
    {
      "id": "oa-17",
      "title": "Max in Every Window Size K",
      "lc": null,
      "importance": "must",
      "subtopic": "sliding-window",
      "difficulty": "Hard",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "array, window k",
          "out": "max per window",
          "note": "Source: GFG/LC239 — OA supplement (not always in NeetCode 150)"
        }
      ],
      "approaches": [
        {
          "name": "Deque window max",
          "time": "O(n)",
          "space": "O(k)",
          "code": "vector<int> maxSlidingWindow(vector<int>& nums, int k) {\n    deque<int> dq;\n    vector<int> ans;\n    for (int i = 0; i < (int)nums.size(); i++) {\n        while (!dq.empty() && dq.front() <= i - k) dq.pop_front();\n        while (!dq.empty() && nums[dq.back()] <= nums[i]) dq.pop_back();\n        dq.push_back(i);\n        if (i >= k - 1) ans.push_back(nums[dq.front()]);\n    }\n    return ans;\n}"
        }
      ],
      "description": "Maximum of all subarrays of size k (GFG sliding window). Same idea as LC 239.",
      "summary": "Monotonic deque stores indices of decreasing values in current window."
    },
    {
      "id": "oa-18",
      "title": "Equilibrium Index",
      "lc": null,
      "importance": "should",
      "subtopic": "array-scan",
      "difficulty": "Easy",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "int array",
          "out": "index or −1",
          "note": "Source: GFG — OA supplement (not always in NeetCode 150)"
        }
      ],
      "approaches": [
        {
          "name": "Prefix totals",
          "time": "O(n)",
          "space": "O(1)",
          "code": "int equilibriumIndex(vector<int>& nums) {\n    long long total = 0;\n    for (int x : nums) total += x;\n    long long left = 0;\n    for (int i = 0; i < (int)nums.size(); i++) {\n        if (left == total - left - nums[i]) return i;\n        left += nums[i];\n    }\n    return -1;\n}"
        }
      ],
      "description": "Equilibrium index — position where left sum equals right sum.",
      "summary": "Single pass: running left sum vs remaining total."
    },
    {
      "id": "oa-19",
      "title": "Leaders in Array",
      "lc": null,
      "importance": "nice",
      "subtopic": "array-scan",
      "difficulty": "Easy",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "int array",
          "out": "leader elements",
          "note": "Source: GFG — OA supplement (not always in NeetCode 150)"
        }
      ],
      "approaches": [
        {
          "name": "Right scan leaders",
          "time": "O(n)",
          "space": "O(1)",
          "code": "vector<int> leaders(vector<int>& nums) {\n    vector<int> ans;\n    int mx = INT_MIN;\n    for (int i = nums.size() - 1; i >= 0; i--) {\n        if (nums[i] >= mx) { ans.push_back(nums[i]); mx = nums[i]; }\n    }\n    reverse(ans.begin(), ans.end());\n    return ans;\n}"
        }
      ],
      "description": "Leaders in an array — elements greater than all elements to their right.",
      "summary": "Scan right-to-left tracking running maximum."
    },
    {
      "id": "oa-20",
      "title": "Minimum Jumps to End",
      "lc": null,
      "importance": "should",
      "subtopic": "greedy",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "non-negative jumps",
          "out": "min jumps",
          "note": "Source: GFG/LC45 — OA supplement (not always in NeetCode 150)"
        }
      ],
      "approaches": [
        {
          "name": "Greedy reach",
          "time": "O(n)",
          "space": "O(1)",
          "code": "int minJumps(vector<int>& arr) {\n    int n = arr.size();\n    if (n <= 1) return 0;\n    int jumps = 0, curEnd = 0, farthest = 0;\n    for (int i = 0; i < n - 1; i++) {\n        farthest = max(farthest, i + arr[i]);\n        if (i == curEnd) {\n            jumps++;\n            curEnd = farthest;\n        }\n    }\n    return jumps;\n}"
        }
      ],
      "description": "Minimum jumps to reach end of array (each element is max jump from that index).",
      "summary": "Greedy layers: extend reachable range; jump when current layer ends."
    },
    {
      "id": "oa-21",
      "title": "Next Smaller Element",
      "lc": null,
      "importance": "should",
      "subtopic": "stack",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "int array",
          "out": "NSE per index",
          "note": "Source: GFG — OA supplement (not always in NeetCode 150)"
        }
      ],
      "approaches": [
        {
          "name": "Monotonic stack",
          "time": "O(n)",
          "space": "O(n)",
          "code": "vector<int> nextSmaller(vector<int>& nums) {\n    int n = nums.size();\n    vector<int> ans(n, -1);\n    stack<int> st;\n    for (int i = 0; i < n; i++) {\n        while (!st.empty() && nums[st.top()] > nums[i]) {\n            ans[st.top()] = nums[i];\n            st.pop();\n        }\n        st.push(i);\n    }\n    return ans;\n}"
        }
      ],
      "description": "Next Smaller Element for each array position (NSE). Monotonic stack variant.",
      "summary": "Stack of indices; pop while current is smaller than stack top."
    },
    {
      "id": "oa-22",
      "title": "Max Non-Overlapping Meetings",
      "lc": null,
      "importance": "should",
      "subtopic": "intervals",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "start/end intervals",
          "out": "max count",
          "note": "Source: GFG — OA supplement (not always in NeetCode 150)"
        }
      ],
      "approaches": [
        {
          "name": "Merge intervals variant",
          "time": "O(n log n)",
          "space": "O(n)",
          "code": "int maxMeetings(vector<vector<int>>& intervals) {\n    vector<pair<int,int>> v;\n    for (auto& in : intervals) v.push_back({in[0], in[1]});\n    sort(v.begin(), v.end(), [](auto& a, auto& b) { return a.second < b.second; });\n    int end = INT_MIN, count = 0;\n    for (auto& p : v)\n        if (p.first >= end) { count++; end = p.second; }\n    return count;\n}"
        }
      ],
      "description": "Maximum meetings in one room (non-overlapping intervals, count not min rooms).",
      "summary": "Activity selection: sort by end time, greedy pick compatible meetings."
    },
    {
      "id": "oa-23",
      "title": "Max Absolute Subarray Sum",
      "lc": null,
      "importance": "nice",
      "subtopic": "array-scan",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "int array",
          "out": "max |subarray sum|",
          "note": "Source: GFG/LC1749 — OA supplement (not always in NeetCode 150)"
        }
      ],
      "approaches": [
        {
          "name": "Kadence variant",
          "time": "O(n)",
          "space": "O(1)",
          "code": "int maxAbsoluteSum(vector<int>& nums) {\n    int pos = 0, neg = 0, best = 0;\n    for (int x : nums) {\n        pos = max(x, pos + x);\n        neg = min(x, neg + x);\n        best = max(best, max(pos, -neg));\n    }\n    return best;\n}"
        }
      ],
      "description": "Maximum absolute sum of any subarray (mix of positive and negative Kadane).",
      "summary": "Track both max prefix and min prefix subarray sums."
    },
    {
      "id": "oa-24",
      "title": "Decode String (k[...])",
      "lc": null,
      "importance": "should",
      "subtopic": "stack",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nested brackets",
          "out": "decoded string",
          "note": "Source: GFG/LC394 — OA supplement (not always in NeetCode 150)"
        }
      ],
      "approaches": [
        {
          "name": "Stack decode",
          "time": "O(n)",
          "space": "O(n)",
          "code": "string decodeString(string s) {\n    string cur;\n    stack<int> cnt;\n    stack<string> prev;\n    int k = 0;\n    for (char c : s) {\n        if (isdigit(c)) k = k * 10 + (c - '0');\n        else if (c == '[') {\n            cnt.push(k); prev.push(cur); cur.clear(); k = 0;\n        } else if (c == ']') {\n            string rep = cur;\n            cur = prev.top(); prev.pop();\n            int times = cnt.top(); cnt.pop();\n            while (times--) cur += rep;\n        } else cur.push_back(c);\n    }\n    return cur;\n}"
        }
      ],
      "description": "Decode string k[encoded] — nested brackets with repeat counts (GFG stack).",
      "summary": "Stack previous strings and repeat counts; expand on closing bracket."
    },
    {
      "id": "oa-25",
      "title": "Sort 0s, 1s, and 2s",
      "lc": null,
      "importance": "must",
      "subtopic": "array-scan",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "array of 0/1/2",
          "out": "sorted in-place",
          "note": "Source: GFG/LC75 — OA supplement (not always in NeetCode 150)"
        }
      ],
      "approaches": [
        {
          "name": "Two pointers partition",
          "time": "O(n)",
          "space": "O(1)",
          "code": "void sort012(vector<int>& a) {\n    int lo = 0, mid = 0, hi = (int)a.size() - 1;\n    while (mid <= hi) {\n        if (a[mid] == 0) swap(a[lo++], a[mid++]);\n        else if (a[mid] == 1) mid++;\n        else swap(a[mid], a[hi--]);\n    }\n}"
        }
      ],
      "description": "Sort array of 0s, 1s, and 2s in-place (Dutch National Flag). GFG before LC 75.",
      "summary": "Three pointers: lo/mid/hi partition in one pass."
    },
    {
      "id": "oa-26",
      "title": "Rotate Array by K",
      "lc": null,
      "importance": "should",
      "subtopic": "array-scan",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "array, k",
          "out": "rotate right in-place",
          "note": "Source: GFG/LC189 — OA supplement (not always in NeetCode 150)"
        }
      ],
      "approaches": [
        {
          "name": "Rotate reversal",
          "time": "O(n)",
          "space": "O(1)",
          "code": "void rotateArray(vector<int>& nums, int k) {\n    int n = nums.size();\n    k %= n;\n    reverse(nums.begin(), nums.end());\n    reverse(nums.begin(), nums.begin() + k);\n    reverse(nums.begin() + k, nums.end());\n}"
        }
      ],
      "description": "Rotate array right by k steps in-place (GFG array rotation).",
      "summary": "Reverse whole array, then reverse first k and remainder."
    },
    {
      "id": "oa-27",
      "title": "strstr / KMP Search",
      "lc": null,
      "importance": "nice",
      "subtopic": "stack",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "haystack, needle",
          "out": "first index or −1",
          "note": "Source: GFG/LC28 — OA supplement (not always in NeetCode 150)"
        }
      ],
      "approaches": [
        {
          "name": "KMP prefix",
          "time": "O(n+m)",
          "space": "O(n)",
          "code": "vector<int> buildLps(string p) {\n    vector<int> lps(p.size(), 0);\n    for (int i = 1, len = 0; i < (int)p.size(); ) {\n        if (p[i] == p[len]) lps[i++] = ++len;\n        else if (len) len = lps[len - 1];\n        else lps[i++] = 0;\n    }\n    return lps;\n}\nint strStr(string hay, string needle) {\n    if (needle.empty()) return 0;\n    vector<int> lps = buildLps(needle);\n    for (int i = 0, j = 0; i < (int)hay.size(); ) {\n        if (hay[i] == needle[j]) { i++; j++; if (j == (int)needle.size()) return i - j; }\n        else if (j) j = lps[j - 1];\n        else i++;\n    }\n    return -1;\n}"
        }
      ],
      "description": "Implement strstr / find first occurrence using KMP (GFG string matching).",
      "summary": "Build LPS prefix table; never backtrack in haystack."
    },
    {
      "id": "oa-28",
      "title": "Merge Sorted Arrays In-Place",
      "lc": null,
      "importance": "should",
      "subtopic": "array-scan",
      "difficulty": "Easy",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums1 with space, nums2",
          "out": "merged nums1",
          "note": "Source: GFG/LC88 — OA supplement (not always in NeetCode 150)"
        }
      ],
      "approaches": [
        {
          "name": "Merge two sorted",
          "time": "O(n+m)",
          "space": "O(1)",
          "code": "void mergeSorted(vector<int>& a, int m, vector<int>& b, int n) {\n    int i = m - 1, j = n - 1, w = m + n - 1;\n    while (j >= 0) {\n        if (i >= 0 && a[i] > b[j]) a[w--] = a[i--];\n        else a[w--] = b[j--];\n    }\n}"
        }
      ],
      "description": "Merge two sorted arrays in-place when first array has trailing space (GFG merge).",
      "summary": "Fill from the end comparing largest elements."
    },
    {
      "id": "oa-29",
      "title": "Rotten Oranges (BFS)",
      "lc": null,
      "importance": "must",
      "subtopic": "graph-bfs",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "grid 0/1/2",
          "out": "minutes or −1",
          "note": "Source: GFG/LC994 — OA supplement (not always in NeetCode 150)"
        }
      ],
      "approaches": [
        {
          "name": "BFS layers",
          "time": "O(mn)",
          "space": "O(mn)",
          "code": "int orangesRotting(vector<vector<int>>& grid) {\n    int n = grid.size(), m = grid[0].size(), fresh = 0, mins = 0;\n    queue<pair<int,int>> q;\n    for (int i = 0; i < n; i++)\n        for (int j = 0; j < m; j++)\n            if (grid[i][j] == 2) q.push({i,j});\n            else if (grid[i][j] == 1) fresh++;\n    int dr[4] = {1,-1,0,0}, dc[4] = {0,0,1,-1};\n    while (!q.empty() && fresh > 0) {\n        int sz = q.size();\n        while (sz--) {\n            auto p = q.front(); q.pop();\n            for (int k = 0; k < 4; k++) {\n                int r = p.first + dr[k], c = p.second + dc[k];\n                if (r < 0 || c < 0 || r >= n || c >= m || grid[r][c] != 1) continue;\n                grid[r][c] = 2; fresh--; q.push({r,c});\n            }\n        }\n        mins++;\n    }\n    return fresh == 0 ? mins : -1;\n}"
        }
      ],
      "description": "Rotten Oranges — minutes until all fresh oranges rot (4-direction BFS).",
      "summary": "Multi-source BFS layer by layer; return −1 if fresh remain."
    },
    {
      "id": "oa-30",
      "title": "Find Duplicate (Floyd)",
      "lc": null,
      "importance": "should",
      "subtopic": "math",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "n+1 nums in 1..n",
          "out": "duplicate value",
          "note": "Source: GFG/LC287 — OA supplement (not always in NeetCode 150)"
        }
      ],
      "approaches": [
        {
          "name": "Floyd cycle",
          "time": "O(n)",
          "space": "O(1)",
          "code": "int findDuplicate(vector<int>& nums) {\n    int slow = nums[0], fast = nums[0];\n    do { slow = nums[slow]; fast = nums[nums[fast]]; } while (slow != fast);\n    slow = nums[0];\n    while (slow != fast) { slow = nums[slow]; fast = nums[fast]; }\n    return slow;\n}"
        }
      ],
      "description": "Find duplicate in array of n+1 integers in [1,n] without modifying much (Floyd cycle).",
      "summary": "Phase 1 find intersection; phase 2 find entrance = duplicate."
    },
    {
      "id": "oa-31",
      "title": "Count Inversions",
      "lc": null,
      "importance": "should",
      "subtopic": "array-scan",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "permutation",
          "out": "inversion count",
          "note": "Source: GFG — OA supplement (not always in NeetCode 150)"
        }
      ],
      "approaches": [
        {
          "name": "Merge sort count",
          "time": "O(n log n)",
          "space": "O(n)",
          "code": "long long mergeCount(vector<int>& a, int l, int r) {\n    if (l >= r) return 0;\n    int m = l + (r - l) / 2;\n    long long inv = mergeCount(a, l, m) + mergeCount(a, m + 1, r);\n    vector<int> tmp;\n    int i = l, j = m + 1;\n    while (i <= m && j <= r) {\n        if (a[i] <= a[j]) tmp.push_back(a[i++]);\n        else { inv += m - i + 1; tmp.push_back(a[j++]); }\n    }\n    while (i <= m) tmp.push_back(a[i++]);\n    while (j <= r) tmp.push_back(a[j++]);\n    for (int k = l; k <= r; k++) a[k] = tmp[k - l];\n    return inv;\n}\nlong long inversionCount(vector<int>& nums) {\n    return mergeCount(nums, 0, (int)nums.size() - 1);\n}"
        }
      ],
      "description": "Count inversions in an array (merge sort / GFG divide-and-conquer).",
      "summary": "Standard merge step adds inversions when right element is smaller."
    },
    {
      "id": "oa-32",
      "title": "Longest Palindromic Substring",
      "lc": null,
      "importance": "should",
      "subtopic": "array-scan",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "string",
          "out": "max palindrome length",
          "note": "Source: GFG/LC5 — OA supplement (not always in NeetCode 150)"
        }
      ],
      "approaches": [
        {
          "name": "Expand centers",
          "time": "O(n^2)",
          "space": "O(1)",
          "code": "int longestPalindrome(string s) {\n    int best = 0;\n    auto expand = [&](int l, int r) {\n        while (l >= 0 && r < (int)s.size() && s[l] == s[r]) l--, r++;\n        best = max(best, r - l - 1);\n    };\n    for (int i = 0; i < (int)s.size(); i++) {\n        expand(i, i);\n        expand(i, i + 1);\n    }\n    return best;\n}"
        }
      ],
      "description": "Longest palindromic substring length (expand around center). GFG before LC 5.",
      "summary": "Check odd and even centers; track best span."
    }
  ]
};
