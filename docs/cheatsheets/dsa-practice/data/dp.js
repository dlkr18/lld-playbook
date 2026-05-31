window.PRACTICE_TOPIC = {
  "id": "dp",
  "title": "Dynamic Programming",
  "expected_count": 55,
  "strategy": "<strong>Speed-run priority:</strong> Filter <em>Must do</em> first — ~20 core questions covering 1D, knapsack, LCS, grid, tree, and stock. Those alone cover ~85% of DP interviews. <ul><li>~10 min per question max</li><li>Identify pattern before coding (1D / knapsack / LCS / grid / interval / bitmask)</li><li>Always state recurrence + base case out loud</li></ul>",
  "subtopics": [
    {
      "id": "1d",
      "label": "1D DP"
    },
    {
      "id": "knapsack",
      "label": "Knapsack"
    },
    {
      "id": "lcs",
      "label": "LCS / Strings"
    },
    {
      "id": "grid",
      "label": "Grid DP"
    },
    {
      "id": "tree",
      "label": "Tree DP"
    },
    {
      "id": "stock",
      "label": "Stock"
    },
    {
      "id": "interval",
      "label": "Interval DP"
    },
    {
      "id": "bitmask",
      "label": "Bitmask"
    },
    {
      "id": "misc",
      "label": "Misc Hard"
    }
  ],
  "questions": [
    {
      "id": "dp-001",
      "title": "Climbing Stairs",
      "lc": 70,
      "importance": "must",
      "subtopic": "1d",
      "difficulty": "Easy",
      "constraints": [
        "1 <= n <= 45"
      ],
      "examples": [
        {
          "in": "n = 3",
          "out": "3",
          "note": "1+1+1, 1+2, 2+1"
        }
      ],
      "approaches": [
        {
          "name": "Fibonacci tabulation",
          "time": "O(n)",
          "space": "O(1)",
          "code": "int climbStairs(int n) {\n    if (n <= 2) return n;\n    int a = 1, b = 2;\n    for (int i = 3; i <= n; i++) { int c = a + b; a = b; b = c; }\n    return b;\n}"
        }
      ],
      "description": "Count distinct ways to climb n stairs taking 1 or 2 steps.",
      "summary": "Fibonacci tabulation — 1D DP: define state on index i, transition from i-1 or earlier."
    },
    {
      "id": "dp-002",
      "title": "Min Cost Climbing Stairs",
      "lc": 746,
      "importance": "must",
      "subtopic": "1d",
      "difficulty": "Easy",
      "constraints": [
        "2 <= cost.length <= 1000"
      ],
      "examples": [
        {
          "in": "cost = [10,15,20]",
          "out": "15"
        }
      ],
      "approaches": [
        {
          "name": "1D DP from end",
          "time": "O(n)",
          "space": "O(1)",
          "code": "int minCostClimbingStairs(vector<int>& cost) {\n    int n = cost.size(), a = 0, b = 0;\n    for (int i = 2; i <= n; i++) {\n        int c = min(a + cost[i-2], b + cost[i-1]);\n        a = b; b = c;\n    } return b;\n}"
        }
      ],
      "description": "Given input per constraints, solve: Min Cost Climbing Stairs.",
      "summary": "1D DP from end — 1D DP: define state on index i, transition from i-1 or earlier."
    },
    {
      "id": "dp-003",
      "title": "House Robber",
      "lc": 198,
      "importance": "must",
      "subtopic": "1d",
      "difficulty": "Medium",
      "constraints": [
        "1 <= nums.length <= 100"
      ],
      "examples": [
        {
          "in": "nums = [2,7,9,3,1]",
          "out": "12"
        }
      ],
      "approaches": [
        {
          "name": "Take / skip adjacent",
          "time": "O(n)",
          "space": "O(1)",
          "code": "int rob(vector<int>& nums) {\n    int prev2 = 0, prev1 = 0;\n    for (int x : nums) {\n        int cur = max(prev1, prev2 + x);\n        prev2 = prev1; prev1 = cur;\n    } return prev1;\n}"
        }
      ],
      "description": "Rob non-adjacent houses for maximum money without alerting police.",
      "summary": "Take / skip adjacent — 1D DP: define state on index i, transition from i-1 or earlier."
    },
    {
      "id": "dp-004",
      "title": "House Robber II",
      "lc": 213,
      "importance": "must",
      "subtopic": "1d",
      "difficulty": "Medium",
      "constraints": [
        "circular street — first and last adjacent"
      ],
      "examples": [
        {
          "in": "nums = [2,3,2]",
          "out": "3"
        }
      ],
      "approaches": [
        {
          "name": "Rob [0..n-2] and [1..n-1]",
          "time": "O(n)",
          "space": "O(1)",
          "code": "int robRange(vector<int>& nums, int l, int r) {\n    int a = 0, b = 0;\n    for (int i = l; i <= r; i++) { int c = max(b, a + nums[i]); a = b; b = c; }\n    return b;\n}\nint rob(vector<int>& nums) {\n    int n = nums.size();\n    if (n == 1) return nums[0];\n    return max(robRange(nums, 0, n-2), robRange(nums, 1, n-1));\n}"
        }
      ],
      "description": "Given input per constraints, solve: House Robber II.",
      "summary": "Rob [0..n-2] and [1..n-1] — 1D DP: define state on index i, transition from i-1 or earlier."
    },
    {
      "id": "dp-005",
      "title": "Decode Ways",
      "lc": 91,
      "importance": "must",
      "subtopic": "1d",
      "difficulty": "Medium",
      "constraints": [
        "s contains digits only",
        "no leading zeros in pairs"
      ],
      "examples": [
        {
          "in": "s = \"226\"",
          "out": "3"
        }
      ],
      "approaches": [
        {
          "name": "DP like climbing stairs",
          "time": "O(n)",
          "space": "O(1)",
          "code": "int numDecodings(string s) {\n    if (s.empty() || s[0]=='0') return 0;\n    int n = s.size(), prev2 = 1, prev1 = 1;\n    for (int i = 1; i < n; i++) {\n        int cur = 0;\n        if (s[i] != '0') cur = prev1;\n        int two = (s[i-1]-'0')*10 + (s[i]-'0');\n        if (two >= 10 && two <= 26) cur += prev2;\n        prev2 = prev1; prev1 = cur;\n    } return prev1;\n}"
        }
      ],
      "description": "Count ways to decode a digit string into letters (A=1..Z=26).",
      "summary": "DP like climbing stairs — 1D DP: define state on index i, transition from i-1 or earlier."
    },
    {
      "id": "dp-006",
      "title": "Word Break",
      "lc": 139,
      "importance": "must",
      "subtopic": "1d",
      "difficulty": "Medium",
      "constraints": [
        "1 <= s.length <= 300",
        "dictionary words reused"
      ],
      "examples": [
        {
          "in": "s=\"leetcode\", wordDict=[\"leet\",\"code\"]",
          "out": "true"
        }
      ],
      "approaches": [
        {
          "name": "dp[i] = prefix breakable",
          "time": "O(n^2 + nk)",
          "space": "O(n)",
          "code": "bool wordBreak(string s, vector<string>& wordDict) {\n    unordered_set<string> dict(wordDict.begin(), wordDict.end());\n    int n = s.size(); vector<bool> dp(n+1); dp[0] = true;\n    for (int i = 1; i <= n; i++)\n        for (int j = 0; j < i; j++)\n            if (dp[j] && dict.count(s.substr(j, i-j))) { dp[i] = true; break; }\n    return dp[n];\n}"
        }
      ],
      "description": "Return true if string can be segmented into dictionary words.",
      "summary": "dp[i] = prefix breakable — 1D DP: define state on index i, transition from i-1 or earlier."
    },
    {
      "id": "dp-007",
      "title": "Coin Change",
      "lc": 322,
      "importance": "must",
      "subtopic": "1d",
      "difficulty": "Medium",
      "constraints": [
        "unbounded coin supply"
      ],
      "examples": [
        {
          "in": "coins=[1,2,5], amount=11",
          "out": "3"
        }
      ],
      "approaches": [
        {
          "name": "Unbounded knapsack 1D",
          "time": "O(n*amount)",
          "space": "O(amount)",
          "code": "int coinChange(vector<int>& coins, int amount) {\n    vector<int> dp(amount+1, amount+1); dp[0] = 0;\n    for (int a = 1; a <= amount; a++)\n        for (int c : coins) if (c <= a) dp[a] = min(dp[a], dp[a-c]+1);\n    return dp[amount] > amount ? -1 : dp[amount];\n}"
        }
      ],
      "description": "Return fewest coins needed to make amount, or -1 if impossible.",
      "summary": "for coin in coins: for s in 1..target: dp[s] = min/max from dp[s-coin]."
    },
    {
      "id": "dp-008",
      "title": "Longest Increasing Subsequence",
      "lc": 300,
      "importance": "must",
      "subtopic": "1d",
      "difficulty": "Medium",
      "constraints": [
        "O(n log n) expected in interviews"
      ],
      "examples": [
        {
          "in": "nums = [10,9,2,5,3,7,101,18]",
          "out": "4"
        }
      ],
      "approaches": [
        {
          "name": "Patience sorting + lower_bound",
          "time": "O(n log n)",
          "space": "O(n)",
          "code": "int lengthOfLIS(vector<int>& nums) {\n    vector<int> tails;\n    for (int x : nums) {\n        auto it = lower_bound(tails.begin(), tails.end(), x);\n        if (it == tails.end()) tails.push_back(x);\n        else *it = x;\n    } return tails.size();\n}"
        },
        {
          "name": "O(n^2) DP",
          "time": "O(n^2)",
          "space": "O(n)",
          "code": "int lengthOfLIS(vector<int>& nums) {\n    int n = nums.size(), ans = 1; vector<int> dp(n, 1);\n    for (int i = 1; i < n; i++)\n        for (int j = 0; j < i; j++)\n            if (nums[j] < nums[i]) dp[i] = max(dp[i], dp[j]+1);\n    for (int x : dp) ans = max(ans, x);\n    return ans;\n}"
        }
      ],
      "description": "Return length of longest strictly increasing subsequence.",
      "summary": "LIS: piles of tails; lower_bound for each card."
    },
    {
      "id": "dp-009",
      "title": "Partition Equal Subset Sum",
      "lc": 416,
      "importance": "must",
      "subtopic": "1d",
      "difficulty": "Medium",
      "constraints": [
        "0/1 knapsack to target sum/2"
      ],
      "examples": [
        {
          "in": "nums = [1,5,11,5]",
          "out": "true"
        }
      ],
      "approaches": [
        {
          "name": "Subset sum DP",
          "time": "O(n*sum)",
          "space": "O(sum)",
          "code": "bool canPartition(vector<int>& nums) {\n    int sum = accumulate(nums.begin(), nums.end(), 0);\n    if (sum % 2) return false;\n    int target = sum/2; vector<bool> dp(target+1); dp[0] = true;\n    for (int x : nums)\n        for (int j = target; j >= x; j--)\n            dp[j] |= dp[j-x];\n    return dp[target];\n}"
        }
      ],
      "description": "Given input per constraints, solve: Partition Equal Subset Sum.",
      "summary": "0/1 knapsack: iterate amounts backwards to avoid reuse."
    },
    {
      "id": "dp-010",
      "title": "Maximum Subarray (Kadane)",
      "lc": 53,
      "importance": "must",
      "subtopic": "1d",
      "difficulty": "Medium",
      "constraints": [
        "at least one element"
      ],
      "examples": [
        {
          "in": "nums = [-2,1,-3,4,-1,2,1,-5,4]",
          "out": "6"
        }
      ],
      "approaches": [
        {
          "name": "Kadane's algorithm",
          "time": "O(n)",
          "space": "O(1)",
          "code": "int maxSubArray(vector<int>& nums) {\n    int best = nums[0], cur = nums[0];\n    for (int i = 1; i < (int)nums.size(); i++) {\n        cur = max(nums[i], cur + nums[i]);\n        best = max(best, cur);\n    } return best;\n}"
        }
      ],
      "description": "Compute the maximum subarray (kadane) over the given input per constraints.",
      "summary": "Kadane's algorithm — 1D DP: define state on index i, transition from i-1 or earlier."
    },
    {
      "id": "dp-011",
      "title": "0/1 Knapsack (classic)",
      "lc": null,
      "importance": "must",
      "subtopic": "knapsack",
      "difficulty": "Medium",
      "constraints": [
        "n items, capacity W",
        "each item once"
      ],
      "examples": [
        {
          "in": "weights=[1,3,4,5], values=[1,4,5,7], W=7",
          "out": "9"
        }
      ],
      "approaches": [
        {
          "name": "2D → 1D rolling",
          "time": "O(nW)",
          "space": "O(W)",
          "code": "int knapsack01(vector<int>& wt, vector<int>& val, int W) {\n    vector<int> dp(W+1);\n    for (int i = 0; i < (int)wt.size(); i++)\n        for (int w = W; w >= wt[i]; w--)\n            dp[w] = max(dp[w], dp[w-wt[i]] + val[i]);\n    return dp[W];\n}"
        }
      ],
      "description": "Given input per constraints, solve: 0/1 Knapsack (classic).",
      "summary": "2D → 1D rolling — Capacity DP: iterate items, update reachable weights backwards."
    },
    {
      "id": "dp-012",
      "title": "Target Sum",
      "lc": 494,
      "importance": "must",
      "subtopic": "knapsack",
      "difficulty": "Medium",
      "constraints": [
        "assign +/- to reach target"
      ],
      "examples": [
        {
          "in": "nums=[1,1,1,1,1], target=3",
          "out": "5"
        }
      ],
      "approaches": [
        {
          "name": "Subset sum count",
          "time": "O(n*sum)",
          "space": "O(sum)",
          "code": "int findTargetSumWays(vector<int>& nums, int target) {\n    int sum = accumulate(nums.begin(), nums.end(), 0);\n    if ((target + sum) % 2 || abs(target) > sum) return 0;\n    int t = (target + sum)/2;\n    vector<int> dp(t+1); dp[0] = 1;\n    for (int x : nums)\n        for (int j = t; j >= x; j--)\n            dp[j] += dp[j-x];\n    return dp[t];\n}"
        }
      ],
      "description": "Assign +/- to nums to reach target; count ways.",
      "summary": "Subset sum count — Capacity DP: iterate items, update reachable weights backwards."
    },
    {
      "id": "dp-013",
      "title": "Ones and Zeroes",
      "lc": 474,
      "importance": "should",
      "subtopic": "knapsack",
      "difficulty": "Medium",
      "constraints": [
        "2D knapsack: m zeros, n ones"
      ],
      "examples": [
        {
          "in": "strs=[\"10\",\"0001\"], m=1, n=1",
          "out": "2"
        }
      ],
      "approaches": [
        {
          "name": "2D capacity DP",
          "time": "O(Lmn)",
          "space": "O(mn)",
          "code": "int findMaxForm(vector<string>& strs, int m, int n) {\n    vector<vector<int>> dp(m+1, vector<int>(n+1));\n    for (auto& s : strs) {\n        int z = count(s.begin(), s.end(), '0'), o = s.size()-z;\n        for (int i = m; i >= z; i--)\n            for (int j = n; j >= o; j--)\n                dp[i][j] = max(dp[i][j], dp[i-z][j-o]+1);\n    } return dp[m][n];\n}"
        }
      ],
      "description": "Given input per constraints, solve: Ones and Zeroes.",
      "summary": "2D capacity DP — Capacity DP: iterate items, update reachable weights backwards."
    },
    {
      "id": "dp-014",
      "title": "Last Stone Weight II",
      "lc": 1049,
      "importance": "should",
      "subtopic": "knapsack",
      "difficulty": "Medium",
      "constraints": [
        "partition stones min diff"
      ],
      "examples": [
        {
          "in": "stones = [2,7,4,1,8,1]",
          "out": "1"
        }
      ],
      "approaches": [
        {
          "name": "Subset sum closest to half",
          "time": "O(n*sum)",
          "space": "O(sum)",
          "code": "int lastStoneWeightII(vector<int>& stones) {\n    int sum = accumulate(stones.begin(), stones.end(), 0);\n    vector<bool> dp(sum/2+1); dp[0] = true;\n    for (int x : stones)\n        for (int j = sum/2; j >= x; j--) dp[j] |= dp[j-x];\n    for (int s = sum/2; s >= 0; s--) if (dp[s]) return sum - 2*s;\n    return 0;\n}"
        }
      ],
      "description": "Given input per constraints, solve: Last Stone Weight II.",
      "summary": "Subset sum closest to half — Capacity DP: iterate items, update reachable weights backwards."
    },
    {
      "id": "dp-015",
      "title": "Coin Change II",
      "lc": 518,
      "importance": "must",
      "subtopic": "knapsack",
      "difficulty": "Medium",
      "constraints": [
        "count combinations",
        "unbounded"
      ],
      "examples": [
        {
          "in": "amount=5, coins=[1,2,5]",
          "out": "4"
        }
      ],
      "approaches": [
        {
          "name": "Unbounded count DP",
          "time": "O(n*amount)",
          "space": "O(amount)",
          "code": "int change(int amount, vector<int>& coins) {\n    vector<long long> dp(amount+1); dp[0] = 1;\n    for (int c : coins)\n        for (int a = c; a <= amount; a++)\n            dp[a] += dp[a-c];\n    return (int)dp[amount];\n}"
        }
      ],
      "description": "Given input per constraints, solve: Coin Change II.",
      "summary": "Unbounded count DP — Capacity DP: iterate items, update reachable weights backwards."
    },
    {
      "id": "dp-016",
      "title": "Perfect Squares",
      "lc": 279,
      "importance": "should",
      "subtopic": "knapsack",
      "difficulty": "Medium",
      "constraints": [
        "min squares summing to n"
      ],
      "examples": [
        {
          "in": "n = 12",
          "out": "3 (4+4+4)"
        }
      ],
      "approaches": [
        {
          "name": "Unbounded min DP",
          "time": "O(n sqrt n)",
          "space": "O(n)",
          "code": "int numSquares(int n) {\n    vector<int> dp(n+1, n);\n    dp[0] = 0;\n    for (int i = 1; i <= n; i++)\n        for (int j = 1; j*j <= i; j++)\n            dp[i] = min(dp[i], dp[i-j*j]+1);\n    return dp[n];\n}"
        }
      ],
      "description": "Given input per constraints, solve: Perfect Squares.",
      "summary": "Unbounded min DP — Capacity DP: iterate items, update reachable weights backwards."
    },
    {
      "id": "dp-017",
      "title": "Combination Sum IV",
      "lc": 377,
      "importance": "should",
      "subtopic": "knapsack",
      "difficulty": "Medium",
      "constraints": [
        "order matters — permutations"
      ],
      "examples": [
        {
          "in": "nums=[1,2,3], target=4",
          "out": "7"
        }
      ],
      "approaches": [
        {
          "name": "Permutation DP",
          "time": "O(n*target)",
          "space": "O(target)",
          "code": "int combinationSum4(vector<int>& nums, int target) {\n    vector<unsigned> dp(target+1); dp[0] = 1;\n    for (int t = 1; t <= target; t++)\n        for (int x : nums) if (x <= t) dp[t] += dp[t-x];\n    return dp[target];\n}"
        }
      ],
      "description": "Given input per constraints, solve: Combination Sum IV.",
      "summary": "Permutation DP — Capacity DP: iterate items, update reachable weights backwards."
    },
    {
      "id": "dp-018",
      "title": "Partition to K Equal Sum Subsets",
      "lc": 698,
      "importance": "should",
      "subtopic": "knapsack",
      "difficulty": "Medium",
      "constraints": [
        "k equal-sum groups"
      ],
      "examples": [
        {
          "in": "nums=[4,3,2,3,5,2,1], k=4",
          "out": "true"
        }
      ],
      "approaches": [
        {
          "name": "Backtracking + bitmask/pruning",
          "time": "O(k*2^n)",
          "space": "O(n)",
          "code": "bool canPartitionKSubsets(vector<int>& nums, int k) {\n    int sum = accumulate(nums.begin(), nums.end(), 0);\n    if (sum % k) return false;\n    int target = sum/k; sort(nums.rbegin(), nums.rend());\n    vector<bool> used(nums.size());\n    function<bool(int,int,int)> dfs = [&](int start, int groups, int cur) {\n        if (groups == k-1) return true;\n        if (cur == target) return dfs(0, groups+1, 0);\n        for (int i = start; i < (int)nums.size(); i++) {\n            if (used[i] || cur+nums[i] > target) continue;\n            used[i] = true;\n            if (dfs(i+1, groups, cur+nums[i])) return true;\n            used[i] = false;\n            if (!cur) break;\n        } return false;\n    };\n    return dfs(0, 0, 0);\n}"
        }
      ],
      "description": "Given input per constraints, solve: Partition to K Equal Sum Subsets.",
      "summary": "Backtracking + bitmask/pruning — Capacity DP: iterate items, update reachable weights backwards."
    },
    {
      "id": "dp-019",
      "title": "Longest Common Subsequence",
      "lc": 1143,
      "importance": "must",
      "subtopic": "lcs",
      "difficulty": "Medium",
      "constraints": [
        "subsequence not substring"
      ],
      "examples": [
        {
          "in": "text1=\"abcde\", text2=\"ace\"",
          "out": "3"
        }
      ],
      "approaches": [
        {
          "name": "2D tabulation",
          "time": "O(mn)",
          "space": "O(min(m,n))",
          "code": "int longestCommonSubsequence(string a, string b) {\n    int m=a.size(), n=b.size();\n    vector<int> prev(n+1), cur(n+1);\n    for (int i = 1; i <= m; i++) {\n        for (int j = 1; j <= n; j++)\n            cur[j] = (a[i-1]==b[j-1]) ? prev[j-1]+1 : max(prev[j], cur[j]);\n        prev.swap(cur);\n    } return prev[n];\n}"
        }
      ],
      "description": "Return length of longest common subsequence of two strings.",
      "summary": "Fill table on smaller subproblems first; answer at dp[n][m]."
    },
    {
      "id": "dp-020",
      "title": "Edit Distance",
      "lc": 72,
      "importance": "must",
      "subtopic": "lcs",
      "difficulty": "Medium",
      "constraints": [
        "insert, delete, replace cost 1"
      ],
      "examples": [
        {
          "in": "word1=\"horse\", word2=\"ros\"",
          "out": "3"
        }
      ],
      "approaches": [
        {
          "name": "Levenshtein DP",
          "time": "O(mn)",
          "space": "O(min(m,n))",
          "code": "int minDistance(string s1, string s2) {\n    int m=s1.size(), n=s2.size();\n    vector<int> prev(n+1), cur(n+1);\n    iota(prev.begin(), prev.end(), 0);\n    for (int i = 1; i <= m; i++) {\n        cur[0] = i;\n        for (int j = 1; j <= n; j++)\n            if (s1[i-1]==s2[j-1]) cur[j] = prev[j-1];\n            else cur[j] = 1 + min({prev[j], cur[j-1], prev[j-1]});\n        prev.swap(cur);\n    } return prev[n];\n}"
        }
      ],
      "description": "Minimum operations (insert/delete/replace) to convert word1 to word2.",
      "summary": "Levenshtein DP — state invariant, then loop."
    },
    {
      "id": "dp-021",
      "title": "Longest Palindromic Subsequence",
      "lc": 516,
      "importance": "must",
      "subtopic": "lcs",
      "difficulty": "Medium",
      "constraints": [
        "LCS(s, reverse(s))"
      ],
      "examples": [
        {
          "in": "s = \"bbbab\"",
          "out": "4"
        }
      ],
      "approaches": [
        {
          "name": "Interval DP on string",
          "time": "O(n^2)",
          "space": "O(n^2)",
          "code": "int longestPalindromeSubseq(string s) {\n    int n=s.size(); vector<vector<int>> dp(n, vector<int>(n));\n    for (int i=n-1;i>=0;i--){\n        dp[i][i]=1;\n        for (int j=i+1;j<n;j++)\n            dp[i][j] = (s[i]==s[j]) ? dp[i+1][j-1]+2 : max(dp[i+1][j], dp[i][j-1]);\n    } return dp[0][n-1];\n}"
        }
      ],
      "description": "Length of longest palindromic subsequence.",
      "summary": "Interval DP on string — state invariant, then loop."
    },
    {
      "id": "dp-022",
      "title": "Longest Common Substring",
      "lc": null,
      "importance": "should",
      "subtopic": "lcs",
      "difficulty": "Medium",
      "constraints": [
        "contiguous match only"
      ],
      "examples": [
        {
          "in": "s1=\"abcde\", s2=\"abfce\"",
          "out": "3 (abc)"
        }
      ],
      "approaches": [
        {
          "name": "Reset on mismatch",
          "time": "O(mn)",
          "space": "O(n)",
          "code": "int longestCommonSubstring(string a, string b) {\n    int m=a.size(), n=b.size(), best=0;\n    vector<int> prev(n+1), cur(n+1);\n    for (int i=1;i<=m;i++){\n        for (int j=1;j<=n;j++)\n            cur[j] = (a[i-1]==b[j-1]) ? prev[j-1]+1 : 0;\n        best = max(best, *max_element(cur.begin(), cur.end()));\n        prev.swap(cur);\n    } return best;\n}"
        }
      ],
      "description": "Compute the longest common substring over the given input per constraints.",
      "summary": "Reset on mismatch — state invariant, then loop."
    },
    {
      "id": "dp-023",
      "title": "Delete Operation for Two Strings",
      "lc": 583,
      "importance": "should",
      "subtopic": "lcs",
      "difficulty": "Medium",
      "constraints": [
        "min deletions to equal"
      ],
      "examples": [
        {
          "in": "s=\"sea\", t=\"eat\"",
          "out": "2"
        }
      ],
      "approaches": [
        {
          "name": "m + n - 2*LCS",
          "time": "O(mn)",
          "space": "O(n)",
          "code": "int minDistance(string s, string t) {\n    int m=s.size(), n=t.size();\n    vector<int> prev(n+1), cur(n+1);\n    for (int i=1;i<=m;i++){\n        for (int j=1;j<=n;j++)\n            cur[j]=(s[i-1]==t[j-1])?prev[j-1]+1:max(prev[j],cur[j]);\n        prev.swap(cur);\n    } return m+n-2*prev[n];\n}"
        }
      ],
      "description": "Given input per constraints, solve: Delete Operation for Two Strings.",
      "summary": "m + n - 2*LCS — state invariant, then loop."
    },
    {
      "id": "dp-024",
      "title": "Minimum ASCII Delete Sum",
      "lc": 712,
      "importance": "nice",
      "subtopic": "lcs",
      "difficulty": "Medium",
      "constraints": [
        "delete cost = ASCII"
      ],
      "examples": [
        {
          "in": "s1=\"sea\", s2=\"eat\"",
          "out": "231"
        }
      ],
      "approaches": [
        {
          "name": "Edit distance with char costs",
          "time": "O(mn)",
          "space": "O(n)",
          "code": "int minimumDeleteSum(string s1, string s2) {\n    int m=s1.size(), n=s2.size();\n    vector<int> prev(n+1), cur(n+1);\n    for (int j=1;j<=n;j++) prev[j]=prev[j-1]+s2[j-1];\n    for (int i=1;i<=m;i++){\n        cur[0]=prev[0]+s1[i-1];\n        for (int j=1;j<=n;j++)\n            if (s1[i-1]==s2[j-1]) cur[j]=prev[j-1];\n            else cur[j]=min(prev[j]+s1[i-1], cur[j-1]+s2[j-1]);\n        prev.swap(cur);\n    } return prev[n];\n}"
        }
      ],
      "description": "Compute the minimum ascii delete sum over the given input per constraints.",
      "summary": "Edit distance with char costs — state invariant, then loop."
    },
    {
      "id": "dp-025",
      "title": "Shortest Common Supersequence",
      "lc": 1092,
      "importance": "should",
      "subtopic": "lcs",
      "difficulty": "Hard",
      "constraints": [
        "shortest string containing both"
      ],
      "examples": [
        {
          "in": "str1=\"abac\", str2=\"cab\"",
          "out": "cabac"
        }
      ],
      "approaches": [
        {
          "name": "Build from LCS",
          "time": "O(mn)",
          "space": "O(mn)",
          "code": "string shortestCommonSupersequence(string a, string b) {\n    int m=a.size(), n=b.size();\n    vector<vector<int>> dp(m+1, vector<int>(n+1));\n    for(int i=1;i<=m;i++) for(int j=1;j<=n;j++)\n        dp[i][j]=(a[i-1]==b[j-1])?dp[i-1][j-1]+1:max(dp[i-1][j],dp[i][j-1]);\n    string ans; int i=m,j=n;\n    while(i&&j){\n        if(a[i-1]==b[j-1]){ ans+=a[i-1]; i--; j--; }\n        else if(dp[i-1][j]>=dp[i][j-1]) i--; else j--;\n    } while(i--) ans+=a[i]; while(j--) ans+=b[j];\n    reverse(ans.begin(), ans.end()); return ans;\n}"
        }
      ],
      "description": "Compute the shortest common supersequence over the given input per constraints.",
      "summary": "Build from LCS — state invariant, then loop."
    },
    {
      "id": "dp-026",
      "title": "Distinct Subsequences",
      "lc": 115,
      "importance": "should",
      "subtopic": "lcs",
      "difficulty": "Hard",
      "constraints": [
        "count t subseqs in s"
      ],
      "examples": [
        {
          "in": "s=\"rabbbit\", t=\"rabbit\"",
          "out": "3"
        }
      ],
      "approaches": [
        {
          "name": "2D count DP",
          "time": "O(mn)",
          "space": "O(n)",
          "code": "int numDistinct(string s, string t) {\n    int m=s.size(), n=t.size();\n    vector<unsigned long long> prev(n+1), cur(n+1); prev[0]=1;\n    for(int i=1;i<=m;i++){\n        cur[0]=1;\n        for(int j=1;j<=n;j++)\n            cur[j]=prev[j]+(s[i-1]==t[j-1]?prev[j-1]:0);\n        prev.swap(cur);\n    } return (int)prev[n];\n}"
        }
      ],
      "description": "Given input per constraints, solve: Distinct Subsequences.",
      "summary": "2D count DP — state invariant, then loop."
    },
    {
      "id": "dp-027",
      "title": "Unique Paths",
      "lc": 62,
      "importance": "must",
      "subtopic": "grid",
      "difficulty": "Medium",
      "constraints": [
        "only right/down moves"
      ],
      "examples": [
        {
          "in": "m=3, n=7",
          "out": "28"
        }
      ],
      "approaches": [
        {
          "name": "2D combinatorics DP",
          "time": "O(mn)",
          "space": "O(n)",
          "code": "int uniquePaths(int m, int n) {\n    vector<int> dp(n, 1);\n    for (int i = 1; i < m; i++)\n        for (int j = 1; j < n; j++)\n            dp[j] += dp[j-1];\n    return dp[n-1];\n}"
        }
      ],
      "description": "Count paths from top-left to bottom-right moving only right/down.",
      "summary": "2D combinatorics DP — 2D DP on grid — often row-by-row or with rolling array."
    },
    {
      "id": "dp-028",
      "title": "Unique Paths II",
      "lc": 63,
      "importance": "must",
      "subtopic": "grid",
      "difficulty": "Medium",
      "constraints": [
        "obstacles block cells"
      ],
      "examples": [
        {
          "in": "grid with 0/1",
          "out": "2"
        }
      ],
      "approaches": [
        {
          "name": "Grid DP skip obstacles",
          "time": "O(mn)",
          "space": "O(n)",
          "code": "int uniquePathsWithObstacles(vector<vector<int>>& g) {\n    int m=g.size(), n=g[0].size();\n    if (g[0][0]||g[m-1][n-1]) return 0;\n    vector<long long> dp(n); dp[0]=1;\n    for(int i=0;i<m;i++){\n        for(int j=0;j<n;j++){\n            if(g[i][j]) dp[j]=0;\n            else if(j) dp[j]+=dp[j-1];\n        }\n    } return (int)dp[n-1];\n}"
        }
      ],
      "description": "Given input per constraints, solve: Unique Paths II.",
      "summary": "Grid DP skip obstacles — 2D DP on grid — often row-by-row or with rolling array."
    },
    {
      "id": "dp-029",
      "title": "Minimum Path Sum",
      "lc": 64,
      "importance": "must",
      "subtopic": "grid",
      "difficulty": "Medium",
      "constraints": [
        "non-negative grid"
      ],
      "examples": [
        {
          "in": "grid=[[1,3,1],[1,5,1]]",
          "out": "7"
        }
      ],
      "approaches": [
        {
          "name": "In-place or rolling row",
          "time": "O(mn)",
          "space": "O(1) in-place",
          "code": "int minPathSum(vector<vector<int>>& grid) {\n    int m=grid.size(), n=grid[0].size();\n    for(int i=0;i<m;i++) for(int j=0;j<n;j++){\n        if(i==0&&j==0) continue;\n        int up=i?grid[i-1][j]:INT_MAX, left=j?grid[i][j-1]:INT_MAX;\n        grid[i][j]+=min(up,left);\n    } return grid[m-1][n-1];\n}"
        }
      ],
      "description": "Find path from top-left to bottom-right with minimum sum on grid.",
      "summary": "In-place or rolling row — 2D DP on grid — often row-by-row or with rolling array."
    },
    {
      "id": "dp-030",
      "title": "Maximal Square",
      "lc": 221,
      "importance": "must",
      "subtopic": "grid",
      "difficulty": "Medium",
      "constraints": [
        "largest 1-square"
      ],
      "examples": [
        {
          "in": "matrix of 0/1",
          "out": "1"
        }
      ],
      "approaches": [
        {
          "name": "dp[i][j] = side length",
          "time": "O(mn)",
          "space": "O(n)",
          "code": "int maximalSquare(vector<vector<char>>& matrix) {\n    int m=matrix.size(), n=m?matrix[0].size():0, best=0;\n    vector<int> prev(n+1), cur(n+1);\n    for(int i=1;i<=m;i++){\n        for(int j=1;j<=n;j++){\n            if(matrix[i-1][j-1]=='1'){\n                cur[j]=1+min({prev[j],cur[j-1],prev[j-1]});\n                best=max(best,cur[j]);\n            } else cur[j]=0;\n        } prev.swap(cur);\n    } return best*best;\n}"
        }
      ],
      "description": "Given input per constraints, solve: Maximal Square.",
      "summary": "dp[i][j] = side length — 2D DP on grid — often row-by-row or with rolling array."
    },
    {
      "id": "dp-031",
      "title": "Triangle",
      "lc": 120,
      "importance": "should",
      "subtopic": "grid",
      "difficulty": "Medium",
      "constraints": [
        "min path top to bottom"
      ],
      "examples": [
        {
          "in": "triangle=[[2],[3,4]]",
          "out": "5"
        }
      ],
      "approaches": [
        {
          "name": "Bottom-up 1D",
          "time": "O(n^2)",
          "space": "O(n)",
          "code": "int minimumTotal(vector<vector<int>>& t) {\n    vector<int> dp = t.back();\n    for (int i = (int)t.size()-2; i >= 0; i--)\n        for (int j = 0; j <= i; j++)\n            dp[j] = t[i][j] + min(dp[j], dp[j+1]);\n    return dp[0];\n}"
        }
      ],
      "description": "Given input per constraints, solve: Triangle.",
      "summary": "Bottom-up 1D — 2D DP on grid — often row-by-row or with rolling array."
    },
    {
      "id": "dp-032",
      "title": "Dungeon Game",
      "lc": 174,
      "importance": "should",
      "subtopic": "grid",
      "difficulty": "Hard",
      "constraints": [
        "min initial health"
      ],
      "examples": [
        {
          "in": "negative/positive rooms",
          "out": "7"
        }
      ],
      "approaches": [
        {
          "name": "Reverse grid DP",
          "time": "O(mn)",
          "space": "O(n)",
          "code": "int calculateMinimumHP(vector<vector<int>>& d) {\n    int m=d.size(), n=d[0].size();\n    vector<int> dp(n+1, INT_MAX); dp[n-1]=1;\n    for(int i=m-1;i>=0;i--)\n        for(int j=n-1;j>=0;j--){\n            int need = min(dp[j], dp[j+1]) - d[i][j];\n            dp[j] = max(1, need);\n        }\n    return dp[0];\n}"
        }
      ],
      "description": "Given input per constraints, solve: Dungeon Game.",
      "summary": "Reverse grid DP — 2D DP on grid — often row-by-row or with rolling array."
    },
    {
      "id": "dp-033",
      "title": "Cherry Pickup",
      "lc": 741,
      "importance": "nice",
      "subtopic": "grid",
      "difficulty": "Hard",
      "constraints": [
        "two paths same grid"
      ],
      "examples": [
        {
          "in": "grid with cherries/thorns",
          "out": "max cherries"
        }
      ],
      "approaches": [
        {
          "name": "DP on (r1,c1,r2,c2)",
          "time": "O(n^4)",
          "space": "O(n^4)",
          "code": "int cherryPickup(vector<vector<int>>& grid) {\n    int n=grid.size(); if(grid[0][0]<0||grid[n-1][n-1]<0) return 0;\n    vector<vector<vector<vector<int>>>> dp(n, vector<vector<vector<int>>>(n, vector<vector<int>>(n, vector<int>(n, INT_MIN))));\n    dp[0][0][0][0]=grid[0][0];\n    for(int r1=0;r1<n;r1++) for(int c1=0;c1<n;c1++)\n    for(int r2=0;r2<n;r2++) for(int c2=0;c2<n;c2++){\n        if(grid[r1][c1]<0||grid[r2][c2]<0) continue;\n        if(r1==0&&c1==0&&r2==0&&c2==0) continue;\n        int best=INT_MIN, gain=grid[r1][c1];\n        if(r1!=r2||c1!=c2) gain+=grid[r2][c2];\n        if(r1) best=max(best, dp[r1-1][c1][r2-1][c2]);\n        if(c1) best=max(best, dp[r1][c1-1][r2][c2-1]);\n        if(r1&&c1) best=max(best, dp[r1-1][c1-1][r2-1][c2-1]);\n        if(r1&&c2) best=max(best, dp[r1-1][c1][r2-1][c2-1]);\n        if(c1&&r2) best=max(best, dp[r1][c1-1][r2-1][c2]);\n        if(c1&&c2) best=max(best, dp[r1][c1-1][r2][c2-1]);\n        if(r2) best=max(best, dp[r1][c1][r2-1][c2]);\n        if(c2) best=max(best, dp[r1][c1][r2][c2-1]);\n        if(r2&&c2) best=max(best, dp[r1][c1][r2-1][c2-1]);\n        if(best!=INT_MIN) dp[r1][c1][r2][c2]=best+gain;\n    }\n    return max(0, dp[n-1][n-1][n-1][n-1]);\n}"
        }
      ],
      "description": "Given input per constraints, solve: Cherry Pickup.",
      "summary": "DP on (r1,c1,r2,c2) — 2D DP on grid — often row-by-row or with rolling array."
    },
    {
      "id": "dp-034",
      "title": "House Robber III",
      "lc": 337,
      "importance": "must",
      "subtopic": "tree",
      "difficulty": "Medium",
      "constraints": [
        "binary tree, no adjacent"
      ],
      "examples": [
        {
          "in": "tree [3,2,3,null,3,null,1]",
          "out": "7"
        }
      ],
      "approaches": [
        {
          "name": "Post-order (rob, skip)",
          "time": "O(n)",
          "space": "O(h)",
          "code": "pair<int,int> dfs(TreeNode* u) {\n    if (!u) return {0,0};\n    auto L = dfs(u->left), R = dfs(u->right);\n    int rob = u->val + L.second + R.second;\n    int skip = max(L.first,L.second) + max(R.first,R.second);\n    return {rob, skip};\n}\nint rob(TreeNode* root) {\n    auto p = dfs(root); return max(p.first, p.second);\n}"
        }
      ],
      "description": "Maximum robbed amount on binary tree without robbing parent and child together.",
      "summary": "Post-order (rob, skip) — Tree recursion: combine results from left/right subtrees."
    },
    {
      "id": "dp-035",
      "title": "Binary Tree Maximum Path Sum",
      "lc": 124,
      "importance": "must",
      "subtopic": "tree",
      "difficulty": "Hard",
      "constraints": [
        "path any nodes"
      ],
      "examples": [
        {
          "in": "tree with negatives",
          "out": "6"
        }
      ],
      "approaches": [
        {
          "name": "Gain from each node",
          "time": "O(n)",
          "space": "O(h)",
          "code": "int ans = INT_MIN;\nint gain(TreeNode* u) {\n    if (!u) return 0;\n    int l = max(0, gain(u->left)), r = max(0, gain(u->right));\n    ans = max(ans, u->val + l + r);\n    return u->val + max(l, r);\n}\nint maxPathSum(TreeNode* root) { gain(root); return ans; }"
        }
      ],
      "description": "Maximum path sum where path may start/end anywhere.",
      "summary": "Gain from each node — Tree recursion: combine results from left/right subtrees."
    },
    {
      "id": "dp-036",
      "title": "Diameter of Binary Tree",
      "lc": 543,
      "importance": "should",
      "subtopic": "tree",
      "difficulty": "Easy",
      "constraints": [
        "longest path edges"
      ],
      "examples": [
        {
          "in": "root=[1,2,3,4,5]",
          "out": "3"
        }
      ],
      "approaches": [
        {
          "name": "Height DP",
          "time": "O(n)",
          "space": "O(h)",
          "code": "int diam = 0;\nint height(TreeNode* u) {\n    if (!u) return 0;\n    int l = height(u->left), r = height(u->right);\n    diam = max(diam, l + r);\n    return 1 + max(l, r);\n}\nint diameterOfBinaryTree(TreeNode* root) { height(root); return diam; }"
        }
      ],
      "description": "Length of longest path between any two nodes in tree.",
      "summary": "Postorder: ans = max(left+right), return max(left,right)+1."
    },
    {
      "id": "dp-037",
      "title": "Unique Binary Search Trees",
      "lc": 96,
      "importance": "should",
      "subtopic": "tree",
      "difficulty": "Medium",
      "constraints": [
        "count BSTs with 1..n"
      ],
      "examples": [
        {
          "in": "n = 3",
          "out": "5"
        }
      ],
      "approaches": [
        {
          "name": "Catalan DP",
          "time": "O(n^2)",
          "space": "O(n)",
          "code": "int numTrees(int n) {\n    vector<int> dp(n+1); dp[0]=dp[1]=1;\n    for(int nodes=2; nodes<=n; nodes++)\n        for(int root=1; root<=nodes; root++)\n            dp[nodes]+=dp[root-1]*dp[nodes-root];\n    return dp[n];\n}"
        }
      ],
      "description": "Given input per constraints, solve: Unique Binary Search Trees.",
      "summary": "dp[n] += dp[i-1]*dp[n-i] for each root i — count BST structures."
    },
    {
      "id": "dp-038",
      "title": "Validate BST (DP count)",
      "lc": 98,
      "importance": "nice",
      "subtopic": "tree",
      "difficulty": "Medium",
      "constraints": [
        "inorder or min/max range"
      ],
      "examples": [
        {
          "in": "root=[2,1,3]",
          "out": "true"
        }
      ],
      "approaches": [
        {
          "name": "Range validation DFS",
          "time": "O(n)",
          "space": "O(h)",
          "code": "bool isValidBST(TreeNode* root, long long lo=LLONG_MIN, long long hi=LLONG_MAX) {\n    if (!root) return true;\n    if (root->val <= lo || root->val >= hi) return false;\n    return isValidBST(root->left, lo, root->val) &&\n           isValidBST(root->right, root->val, hi);\n}"
        }
      ],
      "description": "Given input per constraints, solve: Validate BST (DP count).",
      "summary": "Range validation DFS — Tree recursion: combine results from left/right subtrees."
    },
    {
      "id": "dp-039",
      "title": "Binary Tree Cameras",
      "lc": 968,
      "importance": "nice",
      "subtopic": "tree",
      "difficulty": "Hard",
      "constraints": [
        "min cameras cover all"
      ],
      "examples": [
        {
          "in": "tree nodes",
          "out": "1 camera min"
        }
      ],
      "approaches": [
        {
          "name": "Greedy post-order states",
          "time": "O(n)",
          "space": "O(h)",
          "code": "enum State { UNWATCHED=0, WATCHED=1, HAS_CAMERA=2 };\npair<int,int> dfs(TreeNode* u) {\n    if (!u) return {0, WATCHED};\n    auto L=dfs(u->left), R=dfs(u->right);\n    if (L.second==UNWATCHED || R.second==UNWATCHED)\n        return {L.first+R.first+1, HAS_CAMERA};\n    if (L.second==HAS_CAMERA || R.second==HAS_CAMERA)\n        return {L.first+R.first, WATCHED};\n    return {L.first+R.first, UNWATCHED};\n}\nint minCameraCover(TreeNode* root) {\n    auto p=dfs(root); return p.first + (p.second==UNWATCHED);\n}"
        }
      ],
      "description": "Given input per constraints, solve: Binary Tree Cameras.",
      "summary": "Greedy post-order states — Tree recursion: combine results from left/right subtrees."
    },
    {
      "id": "dp-040",
      "title": "Best Time to Buy and Sell Stock",
      "lc": 121,
      "importance": "must",
      "subtopic": "stock",
      "difficulty": "Easy",
      "constraints": [
        "one transaction"
      ],
      "examples": [
        {
          "in": "prices=[7,1,5,3,6,4]",
          "out": "5"
        }
      ],
      "approaches": [
        {
          "name": "Track min price",
          "time": "O(n)",
          "space": "O(1)",
          "code": "int maxProfit(vector<int>& prices) {\n    int minP=INT_MAX, ans=0;\n    for (int p : prices) { minP=min(minP,p); ans=max(ans,p-minP); }\n    return ans;\n}"
        }
      ],
      "description": "Maximum profit from one buy and one sell.",
      "summary": "Track min price — state invariant, then loop."
    },
    {
      "id": "dp-041",
      "title": "Best Time II (unlimited)",
      "lc": 122,
      "importance": "must",
      "subtopic": "stock",
      "difficulty": "Medium",
      "constraints": [
        "any number of trades"
      ],
      "examples": [
        {
          "in": "prices=[7,1,5,3,6,4]",
          "out": "7"
        }
      ],
      "approaches": [
        {
          "name": "Sum all uphill",
          "time": "O(n)",
          "space": "O(1)",
          "code": "int maxProfit(vector<int>& prices) {\n    int ans=0;\n    for(int i=1;i<(int)prices.size();i++)\n        if(prices[i]>prices[i-1]) ans+=prices[i]-prices[i-1];\n    return ans;\n}"
        }
      ],
      "description": "Given input per constraints, solve: Best Time II (unlimited).",
      "summary": "Sum all uphill — state invariant, then loop."
    },
    {
      "id": "dp-042",
      "title": "Best Time III (max 2 trades)",
      "lc": 123,
      "importance": "must",
      "subtopic": "stock",
      "difficulty": "Hard",
      "constraints": [
        "at most 2 transactions"
      ],
      "examples": [
        {
          "in": "prices array",
          "out": "max profit"
        }
      ],
      "approaches": [
        {
          "name": "State machine DP",
          "time": "O(n)",
          "space": "O(1)",
          "code": "int maxProfit(vector<int>& prices) {\n    int buy1=INT_MIN, sell1=0, buy2=INT_MIN, sell2=0;\n    for(int p:prices){\n        buy1=max(buy1,-p);\n        sell1=max(sell1,buy1+p);\n        buy2=max(buy2,sell1-p);\n        sell2=max(sell2,buy2+p);\n    } return sell2;\n}"
        }
      ],
      "description": "Given input per constraints, solve: Best Time III (max 2 trades).",
      "summary": "dp[day][hold/cash] — transition buy/sell/rest per rules."
    },
    {
      "id": "dp-043",
      "title": "Best Time IV (max k trades)",
      "lc": 188,
      "importance": "must",
      "subtopic": "stock",
      "difficulty": "Hard",
      "constraints": [
        "at most k transactions"
      ],
      "examples": [
        {
          "in": "k=2, prices",
          "out": "profit"
        }
      ],
      "approaches": [
        {
          "name": "DP[k][n] or optimized",
          "time": "O(nk)",
          "space": "O(k)",
          "code": "int maxProfit(int k, vector<int>& prices) {\n    int n=prices.size(); if(!n||!k) return 0;\n    if(k>=n/2){ int ans=0; for(int i=1;i<n;i++) if(prices[i]>prices[i-1]) ans+=prices[i]-prices[i-1]; return ans; }\n    vector<int> buy(k+1, INT_MIN), sell(k+1);\n    for(int p:prices)\n        for(int j=1;j<=k;j++){\n            buy[j]=max(buy[j], sell[j-1]-p);\n            sell[j]=max(sell[j], buy[j]+p);\n        }\n    return sell[k];\n}"
        }
      ],
      "description": "Given input per constraints, solve: Best Time IV (max k trades).",
      "summary": "DP[k][n] or optimized — state invariant, then loop."
    },
    {
      "id": "dp-044",
      "title": "Best Time with Cooldown",
      "lc": 309,
      "importance": "must",
      "subtopic": "stock",
      "difficulty": "Medium",
      "constraints": [
        "sell then 1-day cooldown"
      ],
      "examples": [
        {
          "in": "prices",
          "out": "max profit"
        }
      ],
      "approaches": [
        {
          "name": "3-state DP",
          "time": "O(n)",
          "space": "O(1)",
          "code": "int maxProfit(vector<int>& prices) {\n    int hold=INT_MIN, sold=0, rest=0;\n    for(int p:prices){\n        int prevSold=sold;\n        sold=hold+p;\n        hold=max(hold, rest-p);\n        rest=max(rest, prevSold);\n    } return max(rest,sold);\n}"
        }
      ],
      "description": "Given input per constraints, solve: Best Time with Cooldown.",
      "summary": "3-state DP — state invariant, then loop."
    },
    {
      "id": "dp-045",
      "title": "Best Time with Transaction Fee",
      "lc": 714,
      "importance": "should",
      "subtopic": "stock",
      "difficulty": "Medium",
      "constraints": [
        "fee per transaction"
      ],
      "examples": [
        {
          "in": "prices, fee=2",
          "out": "profit"
        }
      ],
      "approaches": [
        {
          "name": "Cash vs hold DP",
          "time": "O(n)",
          "space": "O(1)",
          "code": "int maxProfit(vector<int>& prices, int fee) {\n    long cash=0, hold=INT_MIN;\n    for(int p:prices){\n        cash=max(cash, hold+p-fee);\n        hold=max(hold, cash-p);\n    } return (int)cash;\n}"
        }
      ],
      "description": "Given input per constraints, solve: Best Time with Transaction Fee.",
      "summary": "Cash vs hold DP — state invariant, then loop."
    },
    {
      "id": "dp-046",
      "title": "Burst Balloons",
      "lc": 312,
      "importance": "must",
      "subtopic": "interval",
      "difficulty": "Hard",
      "constraints": [
        "last balloon to burst"
      ],
      "examples": [
        {
          "in": "nums=[3,1,5,8]",
          "out": "167"
        }
      ],
      "approaches": [
        {
          "name": "Interval DP",
          "time": "O(n^3)",
          "space": "O(n^2)",
          "code": "int maxCoins(vector<int>& nums) {\n    nums.insert(nums.begin(),1); nums.push_back(1);\n    int n=nums.size(); vector<vector<int>> dp(n, vector<int>(n));\n    for(int len=3; len<=n; len++)\n        for(int l=0; l+len-1<n; l++){\n            int r=l+len-1;\n            for(int k=l+1;k<r;k++)\n                dp[l][r]=max(dp[l][r], dp[l][k]+dp[k][r]+nums[l]*nums[k]*nums[r]);\n        }\n    return dp[0][n-1];\n}"
        }
      ],
      "description": "Burst balloons to maximize coins collected.",
      "summary": "dp[l][r] over subintervals — try split k, combine subproblems."
    },
    {
      "id": "dp-047",
      "title": "Palindrome Partitioning II",
      "lc": 132,
      "importance": "should",
      "subtopic": "interval",
      "difficulty": "Hard",
      "constraints": [
        "min cuts for palindrome parts"
      ],
      "examples": [
        {
          "in": "s=\"aab\"",
          "out": "1"
        }
      ],
      "approaches": [
        {
          "name": "DP + palindrome precompute",
          "time": "O(n^2)",
          "space": "O(n^2)",
          "code": "int minCut(string s) {\n    int n=s.size(); vector<vector<bool>> pal(n, vector<bool>(n,true));\n    for(int i=n-1;i>=0;i--)\n        for(int j=i+1;j<n;j++)\n            pal[i][j]=(s[i]==s[j])&&pal[i+1][j-1];\n    vector<int> dp(n,n);\n    for(int i=0;i<n;i++){\n        if(pal[0][i]) dp[i]=0;\n        else for(int j=1;j<=i;j++)\n            if(pal[j][i]) dp[i]=min(dp[i], dp[j-1]+1);\n    } return dp[n-1];\n}"
        }
      ],
      "description": "Given input per constraints, solve: Palindrome Partitioning II.",
      "summary": "DP + palindrome precompute — state invariant, then loop."
    },
    {
      "id": "dp-048",
      "title": "Minimum Cost Tree From Leaf Values",
      "lc": 1130,
      "importance": "nice",
      "subtopic": "interval",
      "difficulty": "Medium",
      "constraints": [
        "merge leaves bottom-up"
      ],
      "examples": [
        {
          "in": "arr leaf values",
          "out": "min non-leaf sum"
        }
      ],
      "approaches": [
        {
          "name": "Interval DP",
          "time": "O(n^3)",
          "space": "O(n^2)",
          "code": "int mctFromLeafValues(vector<int>& arr) {\n    int n=arr.size(); vector<vector<int>> dp(n, vector<int>(n)), mx(n, vector<int>(n));\n    for(int i=0;i<n;i++){ mx[i][i]=arr[i]; dp[i][i]=0; }\n    for(int len=2; len<=n; len++)\n        for(int l=0; l+len-1<n; l++){\n            int r=l+len-1; dp[l][r]=INT_MAX;\n            for(int k=l;k<r;k++)\n                dp[l][r]=min(dp[l][r], dp[l][k]+dp[k+1][r]+mx[l][k]*mx[k+1][r]);\n            mx[l][r]=max(mx[l][r-1], arr[r]);\n        }\n    return dp[0][n-1];\n}"
        }
      ],
      "description": "Compute the minimum cost tree from leaf values over the given input per constraints.",
      "summary": "dp[l][r] over subintervals — try split k, combine subproblems."
    },
    {
      "id": "dp-049",
      "title": "Stone Game VII",
      "lc": 1690,
      "importance": "nice",
      "subtopic": "interval",
      "difficulty": "Medium",
      "constraints": [
        "two players optimal"
      ],
      "examples": [
        {
          "in": "stones array",
          "out": "score difference"
        }
      ],
      "approaches": [
        {
          "name": "Interval DP game",
          "time": "O(n^2)",
          "space": "O(n^2)",
          "code": "int stoneGameVII(vector<int>& stones) {\n    int n=stones.size(); vector<int> pre(n+1);\n    for(int i=0;i<n;i++) pre[i+1]=pre[i]+stones[i];\n    vector<vector<int>> dp(n, vector<int>(n));\n    for(int len=2; len<=n; len++)\n        for(int l=0; l+len-1<n; l++){\n            int r=l+len-1;\n            dp[l][r]=max(pre[r+1]-pre[l+1]-dp[l+1][r], pre[r]-pre[l]-dp[l][r-1]);\n        }\n    return dp[0][n-1];\n}"
        }
      ],
      "description": "Given input per constraints, solve: Stone Game VII.",
      "summary": "Interval DP game — state invariant, then loop."
    },
    {
      "id": "dp-050",
      "title": "Traveling Salesman (TSP)",
      "lc": null,
      "importance": "should",
      "subtopic": "bitmask",
      "difficulty": "Hard",
      "constraints": [
        "n <= 12 typical"
      ],
      "examples": [
        {
          "in": "dist matrix",
          "out": "min tour cost"
        }
      ],
      "approaches": [
        {
          "name": "Held-Karp bitmask DP",
          "time": "O(n^2 2^n)",
          "space": "O(n 2^n)",
          "code": "int tsp(vector<vector<int>>& dist) {\n    int n=dist.size(), ALL=(1<<n)-1;\n    vector<vector<int>> dp(1<<n, vector<int>(n, INT_MAX/2));\n    dp[1][0]=0;\n    for(int mask=1; mask<=ALL; mask++)\n        for(int u=0; u<n; u++) if(mask&(1<<u))\n            for(int v=0; v<n; v++) if(!(mask&(1<<v)))\n                dp[mask|(1<<v)][v]=min(dp[mask|(1<<v)][v], dp[mask][u]+dist[u][v]);\n    int ans=INT_MAX;\n    for(int v=1; v<n; v++) ans=min(ans, dp[ALL][v]+dist[v][0]);\n    return ans;\n}"
        }
      ],
      "description": "Given input per constraints, solve: Traveling Salesman (TSP).",
      "summary": "Held-Karp bitmask DP — state invariant, then loop."
    },
    {
      "id": "dp-051",
      "title": "Can I Win",
      "lc": 464,
      "importance": "should",
      "subtopic": "bitmask",
      "difficulty": "Medium",
      "constraints": [
        "pick 1..max, reach target"
      ],
      "examples": [
        {
          "in": "maxChoosableInteger=10, desiredTotal=11",
          "out": "false"
        }
      ],
      "approaches": [
        {
          "name": "Memo on used bitmask",
          "time": "O(2^n * n)",
          "space": "O(2^n)",
          "code": "bool canIWin(int maxVal, int total) {\n    if (total==0) return true;\n    long long sum = (long long)maxVal*(maxVal+1)/2;\n    if (sum < total) return false;\n    vector<int> memo(1<<maxVal, -1);\n    function<bool(int,int)> dfs=[&](int mask, int rem){\n        if(memo[mask]!=-1) return memo[mask];\n        for(int i=0;i<maxVal;i++) if(!(mask&(1<<i))){\n            int pick=i+1;\n            if(pick>=rem) return memo[mask]=1;\n            if(!dfs(mask|(1<<i), rem-pick)) return memo[mask]=1;\n        } return memo[mask]=0;\n    };\n    return dfs(0,total);\n}"
        }
      ],
      "description": "Given input per constraints, solve: Can I Win.",
      "summary": "Memo on used bitmask — state invariant, then loop."
    },
    {
      "id": "dp-053",
      "title": "Word Break II",
      "lc": 140,
      "importance": "should",
      "subtopic": "misc",
      "difficulty": "Hard",
      "constraints": [
        "return all sentences"
      ],
      "examples": [
        {
          "in": "s=\"catsanddog\"",
          "out": "list of splits"
        }
      ],
      "approaches": [
        {
          "name": "DP reachability + backtrack",
          "time": "O(2^n) output",
          "space": "O(n)",
          "code": "void bt(const string& s, int i, vector<string>& path, vector<string>& ans, vector<bool>& ok, unordered_set<string>& dict) {\n    if (i == (int)s.size()) { ans.push_back(\"\"); for (int j=0;j<(int)path.size();j++) ans.back() += (j?\" \":\"\")+path[j]; return; }\n    for (int j=i; j<(int)s.size(); j++) {\n        string w = s.substr(i, j-i+1);\n        if (!dict.count(w) || !ok[j+1]) continue;\n        path.push_back(w); bt(s, j+1, path, ans, ok, dict); path.pop_back();\n    }\n}\nvector<string> wordBreak(string s, vector<string>& wordDict) {\n    unordered_set<string> dict(wordDict.begin(), wordDict.end());\n    int n=s.size(); vector<bool> ok(n+1); ok[n]=true;\n    for(int i=n-1;i>=0;i--)\n        for(int j=i;j<n;j++) if(dict.count(s.substr(i,j-i+1))&&ok[j+1]){ ok[i]=true; break; }\n    vector<string> ans, path; if(ok[0]) bt(s,0,path,ans,ok,dict); return ans;\n}"
        }
      ],
      "description": "Given input per constraints, solve: Word Break II.",
      "summary": "DP reachability + backtrack — state invariant, then loop."
    },
    {
      "id": "dp-054",
      "title": "Regular Expression Matching",
      "lc": 10,
      "importance": "must",
      "subtopic": "misc",
      "difficulty": "Hard",
      "constraints": [
        ". matches any, * repeats prev"
      ],
      "examples": [
        {
          "in": "s=\"aa\", p=\"a*\"",
          "out": "true"
        }
      ],
      "approaches": [
        {
          "name": "2D DP",
          "time": "O(mn)",
          "space": "O(n)",
          "code": "bool isMatch(string s, string p) {\n    int m=s.size(), n=p.size();\n    vector<vector<bool>> dp(m+1, vector<bool>(n+1));\n    dp[0][0]=true;\n    for(int j=2;j<=n;j+=2) if(p[j-1]=='*') dp[0][j]=dp[0][j-2];\n    for(int i=1;i<=m;i++)\n        for(int j=1;j<=n;j++)\n            if(p[j-1]=='*'){\n                dp[i][j]=dp[i][j-2];\n                if(p[j-2]=='.'||p[j-2]==s[i-1]) dp[i][j]|=dp[i-1][j];\n            } else if(p[j-1]=='.'||p[j-1]==s[i-1])\n                dp[i][j]=dp[i-1][j-1];\n    return dp[m][n];\n}"
        }
      ],
      "description": "Implement regex matching with '.' and '*'.",
      "summary": "2D DP — state invariant, then loop."
    },
    {
      "id": "dp-055",
      "title": "Interleaving String",
      "lc": 97,
      "importance": "should",
      "subtopic": "misc",
      "difficulty": "Medium",
      "constraints": [
        "s3 interleave of s1,s2"
      ],
      "examples": [
        {
          "in": "s1=\"aabcc\", s2=\"dbbca\", s3=\"aadbbcbcac\"",
          "out": "true"
        }
      ],
      "approaches": [
        {
          "name": "2D boolean DP",
          "time": "O(mn)",
          "space": "O(n)",
          "code": "bool isInterleave(string s1, string s2, string s3) {\n    int m=s1.size(), n=s2.size();\n    if((int)s3.size()!=m+n) return false;\n    vector<bool> prev(n+1), cur(n+1);\n    prev[0]=true;\n    for(int j=1;j<=n;j++) prev[j]=prev[j-1]&&s2[j-1]==s3[j-1];\n    for(int i=1;i<=m;i++){\n        cur[0]=prev[0]&&s1[i-1]==s3[i-1];\n        for(int j=1;j<=n;j++)\n            cur[j]=(prev[j]&&s1[i-1]==s3[i+j-1])||(cur[j-1]&&s2[j-1]==s3[i+j-1]);\n        prev.swap(cur);\n    } return prev[n];\n}"
        }
      ],
      "description": "Given input per constraints, solve: Interleaving String.",
      "summary": "2D boolean DP — state invariant, then loop."
    },
    {
      "id": "dp-052",
      "title": "Jump Game II",
      "lc": 45,
      "importance": "must",
      "subtopic": "1d",
      "difficulty": "Medium",
      "constraints": [
        "minimum jumps to end"
      ],
      "examples": [
        {
          "in": "nums=[2,3,1,1,4]",
          "out": "2"
        }
      ],
      "approaches": [
        {
          "name": "Greedy BFS layers",
          "time": "O(n)",
          "space": "O(1)",
          "code": "int jump(vector<int>& nums) {\n    int n=nums.size(), jumps=0, curEnd=0, farthest=0;\n    for(int i=0;i<n-1;i++){\n        farthest=max(farthest,i+nums[i]);\n        if(i==curEnd){ jumps++; curEnd=farthest; }\n    } return jumps;\n}"
        }
      ],
      "description": "Minimum jumps to reach last index.",
      "summary": "Greedy BFS layers — 1D DP: define state on index i, transition from i-1 or earlier."
    }
  ]
};
