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
      "description": "You are climbing a staircase. It takes `n` steps to reach the top.\n\nEach time you can either climb `1` or `2` steps. In how many distinct ways can you climb to the top?\n\n \n\nExample 1:\n\nInput: n = 2\nOutput: 2\nExplanation: There are two ways to climb to the top.\n1. 1 step + 1 step\n2. 2 steps\n\nExample 2:\n\nInput: n = 3\nOutput: 3\nExplanation: There are three ways to climb to the top.\n1. 1 step + 1 step + 1 step\n2. 1 step + 2 steps\n3. 2 steps + 1 step\n\n \n\nConstraints:\n\n\t• `1",
      "descriptionHtml": "<p>You are climbing a staircase. It takes <code>n</code> steps to reach the top.</p>\n\n<p>Each time you can either climb <code>1</code> or <code>2</code> steps. In how many distinct ways can you climb to the top?</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> n = 2\n<strong>Output:</strong> 2\n<strong>Explanation:</strong> There are two ways to climb to the top.\n1. 1 step + 1 step\n2. 2 steps\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> n = 3\n<strong>Output:</strong> 3\n<strong>Explanation:</strong> There are three ways to climb to the top.\n1. 1 step + 1 step + 1 step\n2. 1 step + 2 steps\n3. 2 steps + 1 step\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= n &lt;= 45</code></li>\n</ul>\n",
      "lcSlug": "climbing-stairs",
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
      "description": "You are given an integer array `cost` where `cost[i]` is the cost of `ith` step on a staircase. Once you pay the cost, you can either climb one or two steps.\n\nYou can either start from the step with index `0`, or the step with index `1`.\n\nReturn the minimum cost to reach the top of the floor.\n\n \n\nExample 1:\n\nInput: cost = [10,15,20]\nOutput: 15\nExplanation: You will start at index 1.\n- Pay 15 and climb two steps to reach the top.\nThe total cost is 15.\n\nExample 2:\n\nInput: cost = [1,100,1,1,1,100,1,1,100,1]\nOutput: 6\nExplanation: You will start at index 0.\n- Pay 1 and climb two steps to reach index 2.\n- Pay 1 and climb two steps to reach index 4.\n- Pay 1 and climb two steps to reach index 6.\n- Pay 1 and climb one step to reach index 7.\n- Pay 1 and climb two steps to reach index 9.\n- Pay 1 and climb one step to reach the top.\nThe total cost is 6.\n\n \n\nConstraints:\n\n\t• `2",
      "descriptionHtml": "<p>You are given an integer array <code>cost</code> where <code>cost[i]</code> is the cost of <code>i<sup>th</sup></code> step on a staircase. Once you pay the cost, you can either climb one or two steps.</p>\n\n<p>You can either start from the step with index <code>0</code>, or the step with index <code>1</code>.</p>\n\n<p>Return <em>the minimum cost to reach the top of the floor</em>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> cost = [10,<u>15</u>,20]\n<strong>Output:</strong> 15\n<strong>Explanation:</strong> You will start at index 1.\n- Pay 15 and climb two steps to reach the top.\nThe total cost is 15.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> cost = [<u>1</u>,100,<u>1</u>,1,<u>1</u>,100,<u>1</u>,<u>1</u>,100,<u>1</u>]\n<strong>Output:</strong> 6\n<strong>Explanation:</strong> You will start at index 0.\n- Pay 1 and climb two steps to reach index 2.\n- Pay 1 and climb two steps to reach index 4.\n- Pay 1 and climb two steps to reach index 6.\n- Pay 1 and climb one step to reach index 7.\n- Pay 1 and climb two steps to reach index 9.\n- Pay 1 and climb one step to reach the top.\nThe total cost is 6.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>2 &lt;= cost.length &lt;= 1000</code></li>\n\t<li><code>0 &lt;= cost[i] &lt;= 999</code></li>\n</ul>\n",
      "lcSlug": "min-cost-climbing-stairs",
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
      "description": "You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed, the only constraint stopping you from robbing each of them is that adjacent houses have security systems connected and it will automatically contact the police if two adjacent houses were broken into on the same night.\n\nGiven an integer array `nums` representing the amount of money of each house, return the maximum amount of money you can rob tonight without alerting the police.\n\n \n\nExample 1:\n\nInput: nums = [1,2,3,1]\nOutput: 4\nExplanation: Rob house 1 (money = 1) and then rob house 3 (money = 3).\nTotal amount you can rob = 1 + 3 = 4.\n\nExample 2:\n\nInput: nums = [2,7,9,3,1]\nOutput: 12\nExplanation: Rob house 1 (money = 2), rob house 3 (money = 9) and rob house 5 (money = 1).\nTotal amount you can rob = 2 + 9 + 1 = 12.\n\n \n\nConstraints:\n\n\t• `1",
      "descriptionHtml": "<p>You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed, the only constraint stopping you from robbing each of them is that adjacent houses have security systems connected and <b>it will automatically contact the police if two adjacent houses were broken into on the same night</b>.</p>\n\n<p>Given an integer array <code>nums</code> representing the amount of money of each house, return <em>the maximum amount of money you can rob tonight <b>without alerting the police</b></em>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [1,2,3,1]\n<strong>Output:</strong> 4\n<strong>Explanation:</strong> Rob house 1 (money = 1) and then rob house 3 (money = 3).\nTotal amount you can rob = 1 + 3 = 4.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [2,7,9,3,1]\n<strong>Output:</strong> 12\n<strong>Explanation:</strong> Rob house 1 (money = 2), rob house 3 (money = 9) and rob house 5 (money = 1).\nTotal amount you can rob = 2 + 9 + 1 = 12.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= nums.length &lt;= 100</code></li>\n\t<li><code>0 &lt;= nums[i] &lt;= 400</code></li>\n</ul>\n",
      "lcSlug": "house-robber",
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
      "description": "You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed. All houses at this place are arranged in a circle. That means the first house is the neighbor of the last one. Meanwhile, adjacent houses have a security system connected, and it will automatically contact the police if two adjacent houses were broken into on the same night.\n\nGiven an integer array `nums` representing the amount of money of each house, return the maximum amount of money you can rob tonight without alerting the police.\n\n \n\nExample 1:\n\nInput: nums = [2,3,2]\nOutput: 3\nExplanation: You cannot rob house 1 (money = 2) and then rob house 3 (money = 2), because they are adjacent houses.\n\nExample 2:\n\nInput: nums = [1,2,3,1]\nOutput: 4\nExplanation: Rob house 1 (money = 1) and then rob house 3 (money = 3).\nTotal amount you can rob = 1 + 3 = 4.\n\nExample 3:\n\nInput: nums = [1,2,3]\nOutput: 3\n\n \n\nConstraints:\n\n\t• `1",
      "descriptionHtml": "<p>You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed. All houses at this place are <strong>arranged in a circle.</strong> That means the first house is the neighbor of the last one. Meanwhile, adjacent houses have a security system connected, and&nbsp;<b>it will automatically contact the police if two adjacent houses were broken into on the same night</b>.</p>\n\n<p>Given an integer array <code>nums</code> representing the amount of money of each house, return <em>the maximum amount of money you can rob tonight <strong>without alerting the police</strong></em>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [2,3,2]\n<strong>Output:</strong> 3\n<strong>Explanation:</strong> You cannot rob house 1 (money = 2) and then rob house 3 (money = 2), because they are adjacent houses.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [1,2,3,1]\n<strong>Output:</strong> 4\n<strong>Explanation:</strong> Rob house 1 (money = 1) and then rob house 3 (money = 3).\nTotal amount you can rob = 1 + 3 = 4.\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [1,2,3]\n<strong>Output:</strong> 3\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= nums.length &lt;= 100</code></li>\n\t<li><code>0 &lt;= nums[i] &lt;= 1000</code></li>\n</ul>\n",
      "lcSlug": "house-robber-ii",
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
      "description": "You have intercepted a secret message encoded as a string of numbers. The message is decoded via the following mapping:\n\n`\"1\" -> 'A'\n\n\"2\" -> 'B'\n\n...\n\n\"25\" -> 'Y'\n\n\"26\" -> 'Z'`\n\nHowever, while decoding the message, you realize that there are many different ways you can decode the message because some codes are contained in other codes (`\"2\"` and `\"5\"` vs `\"25\"`).\n\nFor example, `\"11106\"` can be decoded into:\n\n\t• `\"AAJF\"` with the grouping `(1, 1, 10, 6)`\n• `\"KJF\"` with the grouping `(11, 10, 6)`\n• The grouping `(1, 11, 06)` is invalid because `\"06\"` is not a valid code (only `\"6\"` is valid).\n\nNote: there may be strings that are impossible to decode.\n\nGiven a string s containing only digits, return the number of ways to decode it. If the entire string cannot be decoded in any valid way, return `0`.\n\nThe test cases are generated so that the answer fits in a 32-bit integer.\n\n \n\nExample 1:\n\nInput: s = \"12\"\n\nOutput: 2\n\nExplanation:\n\n\"12\" could be decoded as \"AB\" (1 2) or \"L\" (12).\n\nExample 2:\n\nInput: s = \"226\"\n\nOutput: 3\n\nExplanation:\n\n\"226\" could be decoded as \"BZ\" (2 26), \"VF\" (22 6), or \"BBF\" (2 2 6).\n\nExample 3:\n\nInput: s = \"06\"\n\nOutput: 0\n\nExplanation:\n\n\"06\" cannot be mapped to \"F\" because of the leading zero (\"6\" is different from \"06\"). In this case, the string is not a valid encoding, so return 0.\n\n \n\nConstraints:\n\n\t• `1",
      "descriptionHtml": "<p>You have intercepted a secret message encoded as a string of numbers. The message is <strong>decoded</strong> via the following mapping:</p>\n\n<p><code>&quot;1&quot; -&gt; &#39;A&#39;<br />\n&quot;2&quot; -&gt; &#39;B&#39;<br />\n...<br />\n&quot;25&quot; -&gt; &#39;Y&#39;<br />\n&quot;26&quot; -&gt; &#39;Z&#39;</code></p>\n\n<p>However, while decoding the message, you realize that there are many different ways you can decode the message because some codes are contained in other codes (<code>&quot;2&quot;</code> and <code>&quot;5&quot;</code> vs <code>&quot;25&quot;</code>).</p>\n\n<p>For example, <code>&quot;11106&quot;</code> can be decoded into:</p>\n\n<ul>\n\t<li><code>&quot;AAJF&quot;</code> with the grouping <code>(1, 1, 10, 6)</code></li>\n\t<li><code>&quot;KJF&quot;</code> with the grouping <code>(11, 10, 6)</code></li>\n\t<li>The grouping <code>(1, 11, 06)</code> is invalid because <code>&quot;06&quot;</code> is not a valid code (only <code>&quot;6&quot;</code> is valid).</li>\n</ul>\n\n<p>Note: there may be strings that are impossible to decode.<br />\n<br />\nGiven a string s containing only digits, return the <strong>number of ways</strong> to <strong>decode</strong> it. If the entire string cannot be decoded in any valid way, return <code>0</code>.</p>\n\n<p>The test cases are generated so that the answer fits in a <strong>32-bit</strong> integer.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<div class=\"example-block\">\n<p><strong>Input:</strong> <span class=\"example-io\">s = &quot;12&quot;</span></p>\n\n<p><strong>Output:</strong> <span class=\"example-io\">2</span></p>\n\n<p><strong>Explanation:</strong></p>\n\n<p>&quot;12&quot; could be decoded as &quot;AB&quot; (1 2) or &quot;L&quot; (12).</p>\n</div>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<div class=\"example-block\">\n<p><strong>Input:</strong> <span class=\"example-io\">s = &quot;226&quot;</span></p>\n\n<p><strong>Output:</strong> <span class=\"example-io\">3</span></p>\n\n<p><strong>Explanation:</strong></p>\n\n<p>&quot;226&quot; could be decoded as &quot;BZ&quot; (2 26), &quot;VF&quot; (22 6), or &quot;BBF&quot; (2 2 6).</p>\n</div>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<div class=\"example-block\">\n<p><strong>Input:</strong> <span class=\"example-io\">s = &quot;06&quot;</span></p>\n\n<p><strong>Output:</strong> <span class=\"example-io\">0</span></p>\n\n<p><strong>Explanation:</strong></p>\n\n<p>&quot;06&quot; cannot be mapped to &quot;F&quot; because of the leading zero (&quot;6&quot; is different from &quot;06&quot;). In this case, the string is not a valid encoding, so return 0.</p>\n</div>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= s.length &lt;= 100</code></li>\n\t<li><code>s</code> contains only digits and may contain leading zero(s).</li>\n</ul>\n",
      "lcSlug": "decode-ways",
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
      "description": "Given a string `s` and a dictionary of strings `wordDict`, return `true` if `s` can be segmented into a space-separated sequence of one or more dictionary words.\n\nNote that the same word in the dictionary may be reused multiple times in the segmentation.\n\n \n\nExample 1:\n\nInput: s = \"leetcode\", wordDict = [\"leet\",\"code\"]\nOutput: true\nExplanation: Return true because \"leetcode\" can be segmented as \"leet code\".\n\nExample 2:\n\nInput: s = \"applepenapple\", wordDict = [\"apple\",\"pen\"]\nOutput: true\nExplanation: Return true because \"applepenapple\" can be segmented as \"apple pen apple\".\nNote that you are allowed to reuse a dictionary word.\n\nExample 3:\n\nInput: s = \"catsandog\", wordDict = [\"cats\",\"dog\",\"sand\",\"and\",\"cat\"]\nOutput: false\n\n \n\nConstraints:\n\n\t• `1",
      "descriptionHtml": "<p>Given a string <code>s</code> and a dictionary of strings <code>wordDict</code>, return <code>true</code> if <code>s</code> can be segmented into a space-separated sequence of one or more dictionary words.</p>\n\n<p><strong>Note</strong> that the same word in the dictionary may be reused multiple times in the segmentation.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> s = &quot;leetcode&quot;, wordDict = [&quot;leet&quot;,&quot;code&quot;]\n<strong>Output:</strong> true\n<strong>Explanation:</strong> Return true because &quot;leetcode&quot; can be segmented as &quot;leet code&quot;.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> s = &quot;applepenapple&quot;, wordDict = [&quot;apple&quot;,&quot;pen&quot;]\n<strong>Output:</strong> true\n<strong>Explanation:</strong> Return true because &quot;applepenapple&quot; can be segmented as &quot;apple pen apple&quot;.\nNote that you are allowed to reuse a dictionary word.\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> s = &quot;catsandog&quot;, wordDict = [&quot;cats&quot;,&quot;dog&quot;,&quot;sand&quot;,&quot;and&quot;,&quot;cat&quot;]\n<strong>Output:</strong> false\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= s.length &lt;= 300</code></li>\n\t<li><code>1 &lt;= wordDict.length &lt;= 1000</code></li>\n\t<li><code>1 &lt;= wordDict[i].length &lt;= 20</code></li>\n\t<li><code>s</code> and <code>wordDict[i]</code> consist of only lowercase English letters.</li>\n\t<li>All the strings of <code>wordDict</code> are <strong>unique</strong>.</li>\n</ul>\n",
      "lcSlug": "word-break",
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
      "description": "You are given an integer array `coins` representing coins of different denominations and an integer `amount` representing a total amount of money.\n\nReturn the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return `-1`.\n\nYou may assume that you have an infinite number of each kind of coin.\n\n \n\nExample 1:\n\nInput: coins = [1,2,5], amount = 11\nOutput: 3\nExplanation: 11 = 5 + 5 + 1\n\nExample 2:\n\nInput: coins = [2], amount = 3\nOutput: -1\n\nExample 3:\n\nInput: coins = [1], amount = 0\nOutput: 0\n\n \n\nConstraints:\n\n\t• `1 31 - 1`\n• `0 4`",
      "descriptionHtml": "<p>You are given an integer array <code>coins</code> representing coins of different denominations and an integer <code>amount</code> representing a total amount of money.</p>\n\n<p>Return <em>the fewest number of coins that you need to make up that amount</em>. If that amount of money cannot be made up by any combination of the coins, return <code>-1</code>.</p>\n\n<p>You may assume that you have an infinite number of each kind of coin.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> coins = [1,2,5], amount = 11\n<strong>Output:</strong> 3\n<strong>Explanation:</strong> 11 = 5 + 5 + 1\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> coins = [2], amount = 3\n<strong>Output:</strong> -1\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> coins = [1], amount = 0\n<strong>Output:</strong> 0\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= coins.length &lt;= 12</code></li>\n\t<li><code>1 &lt;= coins[i] &lt;= 2<sup>31</sup> - 1</code></li>\n\t<li><code>0 &lt;= amount &lt;= 10<sup>4</sup></code></li>\n</ul>\n",
      "lcSlug": "coin-change",
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
      "description": "Given an integer array `nums`, return the length of the longest strictly increasing subsequence.\n\n \n\nExample 1:\n\nInput: nums = [10,9,2,5,3,7,101,18]\nOutput: 4\nExplanation: The longest increasing subsequence is [2,3,7,101], therefore the length is 4.\n\nExample 2:\n\nInput: nums = [0,1,0,3,2,3]\nOutput: 4\n\nExample 3:\n\nInput: nums = [7,7,7,7,7,7,7]\nOutput: 1\n\n \n\nConstraints:\n\n\t• `1 4 4`\n\n \n\nFollow up: Can you come up with an algorithm that runs in `O(n log(n))` time complexity?",
      "descriptionHtml": "<p>Given an integer array <code>nums</code>, return <em>the length of the longest <strong>strictly increasing </strong></em><span data-keyword=\"subsequence-array\"><em><strong>subsequence</strong></em></span>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [10,9,2,5,3,7,101,18]\n<strong>Output:</strong> 4\n<strong>Explanation:</strong> The longest increasing subsequence is [2,3,7,101], therefore the length is 4.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [0,1,0,3,2,3]\n<strong>Output:</strong> 4\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [7,7,7,7,7,7,7]\n<strong>Output:</strong> 1\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= nums.length &lt;= 2500</code></li>\n\t<li><code>-10<sup>4</sup> &lt;= nums[i] &lt;= 10<sup>4</sup></code></li>\n</ul>\n\n<p>&nbsp;</p>\n<p><b>Follow up:</b>&nbsp;Can you come up with an algorithm that runs in&nbsp;<code>O(n log(n))</code> time complexity?</p>\n",
      "lcSlug": "longest-increasing-subsequence",
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
      "description": "Given an integer array `nums`, return `true` if you can partition the array into two subsets such that the sum of the elements in both subsets is equal or `false` otherwise.\n\n \n\nExample 1:\n\nInput: nums = [1,5,11,5]\nOutput: true\nExplanation: The array can be partitioned as [1, 5, 5] and [11].\n\nExample 2:\n\nInput: nums = [1,2,3,5]\nOutput: false\nExplanation: The array cannot be partitioned into equal sum subsets.\n\n \n\nConstraints:\n\n\t• `1",
      "descriptionHtml": "<p>Given an integer array <code>nums</code>, return <code>true</code> <em>if you can partition the array into two subsets such that the sum of the elements in both subsets is equal or </em><code>false</code><em> otherwise</em>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [1,5,11,5]\n<strong>Output:</strong> true\n<strong>Explanation:</strong> The array can be partitioned as [1, 5, 5] and [11].\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [1,2,3,5]\n<strong>Output:</strong> false\n<strong>Explanation:</strong> The array cannot be partitioned into equal sum subsets.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= nums.length &lt;= 200</code></li>\n\t<li><code>1 &lt;= nums[i] &lt;= 100</code></li>\n</ul>\n",
      "lcSlug": "partition-equal-subset-sum",
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
      "description": "Given an integer array `nums`, find the subarray with the largest sum, and return its sum.\n\n \n\nExample 1:\n\nInput: nums = [-2,1,-3,4,-1,2,1,-5,4]\nOutput: 6\nExplanation: The subarray [4,-1,2,1] has the largest sum 6.\n\nExample 2:\n\nInput: nums = [1]\nOutput: 1\nExplanation: The subarray [1] has the largest sum 1.\n\nExample 3:\n\nInput: nums = [5,4,-1,7,8]\nOutput: 23\nExplanation: The subarray [5,4,-1,7,8] has the largest sum 23.\n\n \n\nConstraints:\n\n\t• `1 5`\n• `-104 4`\n\n \n\nFollow up: If you have figured out the `O(n)` solution, try coding another solution using the divide and conquer approach, which is more subtle.",
      "descriptionHtml": "<p>Given an integer array <code>nums</code>, find the <span data-keyword=\"subarray-nonempty\">subarray</span> with the largest sum, and return <em>its sum</em>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [-2,1,-3,4,-1,2,1,-5,4]\n<strong>Output:</strong> 6\n<strong>Explanation:</strong> The subarray [4,-1,2,1] has the largest sum 6.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [1]\n<strong>Output:</strong> 1\n<strong>Explanation:</strong> The subarray [1] has the largest sum 1.\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [5,4,-1,7,8]\n<strong>Output:</strong> 23\n<strong>Explanation:</strong> The subarray [5,4,-1,7,8] has the largest sum 23.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= nums.length &lt;= 10<sup>5</sup></code></li>\n\t<li><code>-10<sup>4</sup> &lt;= nums[i] &lt;= 10<sup>4</sup></code></li>\n</ul>\n\n<p>&nbsp;</p>\n<p><strong>Follow up:</strong> If you have figured out the <code>O(n)</code> solution, try coding another solution using the <strong>divide and conquer</strong> approach, which is more subtle.</p>\n",
      "lcSlug": "maximum-subarray",
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
      "description": "0/1 Knapsack (classic)",
      "summary": "Capacity DP: iterate items, update reachable weights backwards."
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
      "description": "You are given an integer array `nums` and an integer `target`.\n\nYou want to build an expression out of nums by adding one of the symbols `'+'` and `'-'` before each integer in nums and then concatenate all the integers.\n\n\t• For example, if `nums = [2, 1]`, you can add a `'+'` before `2` and a `'-'` before `1` and concatenate them to build the expression `\"+2-1\"`.\n\nReturn the number of different expressions that you can build, which evaluates to `target`.\n\n \n\nExample 1:\n\nInput: nums = [1,1,1,1,1], target = 3\nOutput: 5\nExplanation: There are 5 ways to assign symbols to make the sum of nums be target 3.\n-1 + 1 + 1 + 1 + 1 = 3\n+1 - 1 + 1 + 1 + 1 = 3\n+1 + 1 - 1 + 1 + 1 = 3\n+1 + 1 + 1 - 1 + 1 = 3\n+1 + 1 + 1 + 1 - 1 = 3\n\nExample 2:\n\nInput: nums = [1], target = 1\nOutput: 1\n\n \n\nConstraints:\n\n\t• `1",
      "descriptionHtml": "<p>You are given an integer array <code>nums</code> and an integer <code>target</code>.</p>\n\n<p>You want to build an <strong>expression</strong> out of nums by adding one of the symbols <code>&#39;+&#39;</code> and <code>&#39;-&#39;</code> before each integer in nums and then concatenate all the integers.</p>\n\n<ul>\n\t<li>For example, if <code>nums = [2, 1]</code>, you can add a <code>&#39;+&#39;</code> before <code>2</code> and a <code>&#39;-&#39;</code> before <code>1</code> and concatenate them to build the expression <code>&quot;+2-1&quot;</code>.</li>\n</ul>\n\n<p>Return the number of different <strong>expressions</strong> that you can build, which evaluates to <code>target</code>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [1,1,1,1,1], target = 3\n<strong>Output:</strong> 5\n<strong>Explanation:</strong> There are 5 ways to assign symbols to make the sum of nums be target 3.\n-1 + 1 + 1 + 1 + 1 = 3\n+1 - 1 + 1 + 1 + 1 = 3\n+1 + 1 - 1 + 1 + 1 = 3\n+1 + 1 + 1 - 1 + 1 = 3\n+1 + 1 + 1 + 1 - 1 = 3\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [1], target = 1\n<strong>Output:</strong> 1\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= nums.length &lt;= 20</code></li>\n\t<li><code>0 &lt;= nums[i] &lt;= 1000</code></li>\n\t<li><code>0 &lt;= sum(nums[i]) &lt;= 1000</code></li>\n\t<li><code>-1000 &lt;= target &lt;= 1000</code></li>\n</ul>\n",
      "lcSlug": "target-sum",
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
      "description": "You are given an array of binary strings `strs` and two integers `m` and `n`.\n\nReturn the size of the largest subset of `strs` such that there are at most `m` `0`'s and `n` `1`'s in the subset.\n\nA set `x` is a subset of a set `y` if all elements of `x` are also elements of `y`.\n\n \n\nExample 1:\n\nInput: strs = [\"10\",\"0001\",\"111001\",\"1\",\"0\"], m = 5, n = 3\nOutput: 4\nExplanation: The largest subset with at most 5 0's and 3 1's is {\"10\", \"0001\", \"1\", \"0\"}, so the answer is 4.\nOther valid but smaller subsets include {\"0001\", \"1\"} and {\"10\", \"1\", \"0\"}.\n{\"111001\"} is an invalid subset because it contains 4 1's, greater than the maximum of 3.\n\nExample 2:\n\nInput: strs = [\"10\",\"0\",\"1\"], m = 1, n = 1\nOutput: 2\nExplanation: The largest subset is {\"0\", \"1\"}, so the answer is 2.\n\n \n\nConstraints:\n\n\t• `1",
      "descriptionHtml": "<p>You are given an array of binary strings <code>strs</code> and two integers <code>m</code> and <code>n</code>.</p>\n\n<p>Return <em>the size of the largest subset of <code>strs</code> such that there are <strong>at most</strong> </em><code>m</code><em> </em><code>0</code><em>&#39;s and </em><code>n</code><em> </em><code>1</code><em>&#39;s in the subset</em>.</p>\n\n<p>A set <code>x</code> is a <strong>subset</strong> of a set <code>y</code> if all elements of <code>x</code> are also elements of <code>y</code>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> strs = [&quot;10&quot;,&quot;0001&quot;,&quot;111001&quot;,&quot;1&quot;,&quot;0&quot;], m = 5, n = 3\n<strong>Output:</strong> 4\n<strong>Explanation:</strong> The largest subset with at most 5 0&#39;s and 3 1&#39;s is {&quot;10&quot;, &quot;0001&quot;, &quot;1&quot;, &quot;0&quot;}, so the answer is 4.\nOther valid but smaller subsets include {&quot;0001&quot;, &quot;1&quot;} and {&quot;10&quot;, &quot;1&quot;, &quot;0&quot;}.\n{&quot;111001&quot;} is an invalid subset because it contains 4 1&#39;s, greater than the maximum of 3.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> strs = [&quot;10&quot;,&quot;0&quot;,&quot;1&quot;], m = 1, n = 1\n<strong>Output:</strong> 2\n<b>Explanation:</b> The largest subset is {&quot;0&quot;, &quot;1&quot;}, so the answer is 2.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= strs.length &lt;= 600</code></li>\n\t<li><code>1 &lt;= strs[i].length &lt;= 100</code></li>\n\t<li><code>strs[i]</code> consists only of digits <code>&#39;0&#39;</code> and <code>&#39;1&#39;</code>.</li>\n\t<li><code>1 &lt;= m, n &lt;= 100</code></li>\n</ul>\n",
      "lcSlug": "ones-and-zeroes",
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
      "description": "You are given an array of integers `stones` where `stones[i]` is the weight of the `ith` stone.\n\nWe are playing a game with the stones. On each turn, we choose any two stones and smash them together. Suppose the stones have weights `x` and `y` with `x \n\n\t• If `x == y`, both stones are destroyed, and\n• If `x != y`, the stone of weight `x` is destroyed, and the stone of weight `y` has new weight `y - x`.\n\nAt the end of the game, there is at most one stone left.\n\nReturn the smallest possible weight of the left stone. If there are no stones left, return `0`.\n\n \n\nExample 1:\n\nInput: stones = [2,7,4,1,8,1]\nOutput: 1\nExplanation:\nWe can combine 2 and 4 to get 2, so the array converts to [2,7,1,8,1] then,\nwe can combine 7 and 8 to get 1, so the array converts to [2,1,1,1] then,\nwe can combine 2 and 1 to get 1, so the array converts to [1,1,1] then,\nwe can combine 1 and 1 to get 0, so the array converts to [1], then that's the optimal value.\n\nExample 2:\n\nInput: stones = [31,26,33,21,40]\nOutput: 5\n\n \n\nConstraints:\n\n\t• `1",
      "descriptionHtml": "<p>You are given an array of integers <code>stones</code> where <code>stones[i]</code> is the weight of the <code>i<sup>th</sup></code> stone.</p>\n\n<p>We are playing a game with the stones. On each turn, we choose any two stones and smash them together. Suppose the stones have weights <code>x</code> and <code>y</code> with <code>x &lt;= y</code>. The result of this smash is:</p>\n\n<ul>\n\t<li>If <code>x == y</code>, both stones are destroyed, and</li>\n\t<li>If <code>x != y</code>, the stone of weight <code>x</code> is destroyed, and the stone of weight <code>y</code> has new weight <code>y - x</code>.</li>\n</ul>\n\n<p>At the end of the game, there is <strong>at most one</strong> stone left.</p>\n\n<p>Return <em>the smallest possible weight of the left stone</em>. If there are no stones left, return <code>0</code>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> stones = [2,7,4,1,8,1]\n<strong>Output:</strong> 1\n<strong>Explanation:</strong>\nWe can combine 2 and 4 to get 2, so the array converts to [2,7,1,8,1] then,\nwe can combine 7 and 8 to get 1, so the array converts to [2,1,1,1] then,\nwe can combine 2 and 1 to get 1, so the array converts to [1,1,1] then,\nwe can combine 1 and 1 to get 0, so the array converts to [1], then that&#39;s the optimal value.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> stones = [31,26,33,21,40]\n<strong>Output:</strong> 5\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= stones.length &lt;= 30</code></li>\n\t<li><code>1 &lt;= stones[i] &lt;= 100</code></li>\n</ul>\n",
      "lcSlug": "last-stone-weight-ii",
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
      "description": "You are given an integer array `coins` representing coins of different denominations and an integer `amount` representing a total amount of money.\n\nReturn the number of combinations that make up that amount. If that amount of money cannot be made up by any combination of the coins, return `0`.\n\nYou may assume that you have an infinite number of each kind of coin.\n\nThe answer is guaranteed to fit into a signed 32-bit integer.\n\n \n\nExample 1:\n\nInput: amount = 5, coins = [1,2,5]\nOutput: 4\nExplanation: there are four ways to make up the amount:\n5=5\n5=2+2+1\n5=2+1+1+1\n5=1+1+1+1+1\n\nExample 2:\n\nInput: amount = 3, coins = [2]\nOutput: 0\nExplanation: the amount of 3 cannot be made up just with coins of 2.\n\nExample 3:\n\nInput: amount = 10, coins = [10]\nOutput: 1\n\n \n\nConstraints:\n\n\t• `1",
      "descriptionHtml": "<p>You are given an integer array <code>coins</code> representing coins of different denominations and an integer <code>amount</code> representing a total amount of money.</p>\n\n<p>Return <em>the number of combinations that make up that amount</em>. If that amount of money cannot be made up by any combination of the coins, return <code>0</code>.</p>\n\n<p>You may assume that you have an infinite number of each kind of coin.</p>\n\n<p>The answer is <strong>guaranteed</strong> to fit into a signed <strong>32-bit</strong> integer.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> amount = 5, coins = [1,2,5]\n<strong>Output:</strong> 4\n<strong>Explanation:</strong> there are four ways to make up the amount:\n5=5\n5=2+2+1\n5=2+1+1+1\n5=1+1+1+1+1\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> amount = 3, coins = [2]\n<strong>Output:</strong> 0\n<strong>Explanation:</strong> the amount of 3 cannot be made up just with coins of 2.\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> amount = 10, coins = [10]\n<strong>Output:</strong> 1\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= coins.length &lt;= 300</code></li>\n\t<li><code>1 &lt;= coins[i] &lt;= 5000</code></li>\n\t<li>All the values of <code>coins</code> are <strong>unique</strong>.</li>\n\t<li><code>0 &lt;= amount &lt;= 5000</code></li>\n</ul>\n",
      "lcSlug": "coin-change-ii",
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
      "description": "Given an integer `n`, return the least number of perfect square numbers that sum to `n`.\n\nA perfect square is an integer that is the square of an integer; in other words, it is the product of some integer with itself. For example, `1`, `4`, `9`, and `16` are perfect squares while `3` and `11` are not.\n\n \n\nExample 1:\n\nInput: n = 12\nOutput: 3\nExplanation: 12 = 4 + 4 + 4.\n\nExample 2:\n\nInput: n = 13\nOutput: 2\nExplanation: 13 = 4 + 9.\n\n \n\nConstraints:\n\n\t• `1 4`",
      "descriptionHtml": "<p>Given an integer <code>n</code>, return <em>the least number of perfect square numbers that sum to</em> <code>n</code>.</p>\n\n<p>A <strong>perfect square</strong> is an integer that is the square of an integer; in other words, it is the product of some integer with itself. For example, <code>1</code>, <code>4</code>, <code>9</code>, and <code>16</code> are perfect squares while <code>3</code> and <code>11</code> are not.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> n = 12\n<strong>Output:</strong> 3\n<strong>Explanation:</strong> 12 = 4 + 4 + 4.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> n = 13\n<strong>Output:</strong> 2\n<strong>Explanation:</strong> 13 = 4 + 9.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= n &lt;= 10<sup>4</sup></code></li>\n</ul>\n",
      "lcSlug": "perfect-squares",
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
      "description": "Given an array of distinct integers `nums` and a target integer `target`, return the number of possible combinations that add up to `target`.\n\nThe test cases are generated so that the answer can fit in a 32-bit integer.\n\n \n\nExample 1:\n\nInput: nums = [1,2,3], target = 4\nOutput: 7\nExplanation:\nThe possible combination ways are:\n(1, 1, 1, 1)\n(1, 1, 2)\n(1, 2, 1)\n(1, 3)\n(2, 1, 1)\n(2, 2)\n(3, 1)\nNote that different sequences are counted as different combinations.\n\nExample 2:\n\nInput: nums = [9], target = 3\nOutput: 0\n\n \n\nConstraints:\n\n\t• `1 \n\n \n\nFollow up: What if negative numbers are allowed in the given array? How does it change the problem? What limitation we need to add to the question to allow negative numbers?",
      "descriptionHtml": "<p>Given an array of <strong>distinct</strong> integers <code>nums</code> and a target integer <code>target</code>, return <em>the number of possible combinations that add up to</em>&nbsp;<code>target</code>.</p>\n\n<p>The test cases are generated so that the answer can fit in a <strong>32-bit</strong> integer.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [1,2,3], target = 4\n<strong>Output:</strong> 7\n<strong>Explanation:</strong>\nThe possible combination ways are:\n(1, 1, 1, 1)\n(1, 1, 2)\n(1, 2, 1)\n(1, 3)\n(2, 1, 1)\n(2, 2)\n(3, 1)\nNote that different sequences are counted as different combinations.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [9], target = 3\n<strong>Output:</strong> 0\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= nums.length &lt;= 200</code></li>\n\t<li><code>1 &lt;= nums[i] &lt;= 1000</code></li>\n\t<li>All the elements of <code>nums</code> are <strong>unique</strong>.</li>\n\t<li><code>1 &lt;= target &lt;= 1000</code></li>\n</ul>\n\n<p>&nbsp;</p>\n<p><strong>Follow up:</strong> What if negative numbers are allowed in the given array? How does it change the problem? What limitation we need to add to the question to allow negative numbers?</p>\n",
      "lcSlug": "combination-sum-iv",
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
      "description": "Given an integer array `nums` and an integer `k`, return `true` if it is possible to divide this array into `k` non-empty subsets whose sums are all equal.\n\n \n\nExample 1:\n\nInput: nums = [4,3,2,3,5,2,1], k = 4\nOutput: true\nExplanation: It is possible to divide it into 4 subsets (5), (1, 4), (2,3), (2,3) with equal sums.\n\nExample 2:\n\nInput: nums = [1,2,3,4], k = 3\nOutput: false\n\n \n\nConstraints:\n\n\t• `1 4`\n• The frequency of each element is in the range `[1, 4]`.",
      "descriptionHtml": "<p>Given an integer array <code>nums</code> and an integer <code>k</code>, return <code>true</code> if it is possible to divide this array into <code>k</code> non-empty subsets whose sums are all equal.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [4,3,2,3,5,2,1], k = 4\n<strong>Output:</strong> true\n<strong>Explanation:</strong> It is possible to divide it into 4 subsets (5), (1, 4), (2,3), (2,3) with equal sums.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [1,2,3,4], k = 3\n<strong>Output:</strong> false\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= k &lt;= nums.length &lt;= 16</code></li>\n\t<li><code>1 &lt;= nums[i] &lt;= 10<sup>4</sup></code></li>\n\t<li>The frequency of each element is in the range <code>[1, 4]</code>.</li>\n</ul>\n",
      "lcSlug": "partition-to-k-equal-sum-subsets",
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
      "description": "Given two strings `text1` and `text2`, return the length of their longest common subsequence. If there is no common subsequence, return `0`.\n\nA subsequence of a string is a new string generated from the original string with some characters (can be none) deleted without changing the relative order of the remaining characters.\n\n\t• For example, `\"ace\"` is a subsequence of `\"abcde\"`.\n\nA common subsequence of two strings is a subsequence that is common to both strings.\n\n \n\nExample 1:\n\nInput: text1 = \"abcde\", text2 = \"ace\" \nOutput: 3  \nExplanation: The longest common subsequence is \"ace\" and its length is 3.\n\nExample 2:\n\nInput: text1 = \"abc\", text2 = \"abc\"\nOutput: 3\nExplanation: The longest common subsequence is \"abc\" and its length is 3.\n\nExample 3:\n\nInput: text1 = \"abc\", text2 = \"def\"\nOutput: 0\nExplanation: There is no such common subsequence, so the result is 0.\n\n \n\nConstraints:\n\n\t• `1",
      "descriptionHtml": "<p>Given two strings <code>text1</code> and <code>text2</code>, return <em>the length of their longest <strong>common subsequence</strong>. </em>If there is no <strong>common subsequence</strong>, return <code>0</code>.</p>\n\n<p>A <strong>subsequence</strong> of a string is a new string generated from the original string with some characters (can be none) deleted without changing the relative order of the remaining characters.</p>\n\n<ul>\n\t<li>For example, <code>&quot;ace&quot;</code> is a subsequence of <code>&quot;abcde&quot;</code>.</li>\n</ul>\n\n<p>A <strong>common subsequence</strong> of two strings is a subsequence that is common to both strings.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> text1 = &quot;abcde&quot;, text2 = &quot;ace&quot; \n<strong>Output:</strong> 3  \n<strong>Explanation:</strong> The longest common subsequence is &quot;ace&quot; and its length is 3.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> text1 = &quot;abc&quot;, text2 = &quot;abc&quot;\n<strong>Output:</strong> 3\n<strong>Explanation:</strong> The longest common subsequence is &quot;abc&quot; and its length is 3.\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> text1 = &quot;abc&quot;, text2 = &quot;def&quot;\n<strong>Output:</strong> 0\n<strong>Explanation:</strong> There is no such common subsequence, so the result is 0.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= text1.length, text2.length &lt;= 1000</code></li>\n\t<li><code>text1</code> and <code>text2</code> consist of only lowercase English characters.</li>\n</ul>\n",
      "lcSlug": "longest-common-subsequence",
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
      "description": "Given two strings `word1` and `word2`, return the minimum number of operations required to convert `word1` to `word2`.\n\nYou have the following three operations permitted on a word:\n\n\t• Insert a character\n• Delete a character\n• Replace a character\n\n \n\nExample 1:\n\nInput: word1 = \"horse\", word2 = \"ros\"\nOutput: 3\nExplanation: \nhorse -> rorse (replace 'h' with 'r')\nrorse -> rose (remove 'r')\nrose -> ros (remove 'e')\n\nExample 2:\n\nInput: word1 = \"intention\", word2 = \"execution\"\nOutput: 5\nExplanation: \nintention -> inention (remove 't')\ninention -> enention (replace 'i' with 'e')\nenention -> exention (replace 'n' with 'x')\nexention -> exection (replace 'n' with 'c')\nexection -> execution (insert 'u')\n\n \n\nConstraints:\n\n\t• `0",
      "descriptionHtml": "<p>Given two strings <code>word1</code> and <code>word2</code>, return <em>the minimum number of operations required to convert <code>word1</code> to <code>word2</code></em>.</p>\n\n<p>You have the following three operations permitted on a word:</p>\n\n<ul>\n\t<li>Insert a character</li>\n\t<li>Delete a character</li>\n\t<li>Replace a character</li>\n</ul>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> word1 = &quot;horse&quot;, word2 = &quot;ros&quot;\n<strong>Output:</strong> 3\n<strong>Explanation:</strong> \nhorse -&gt; rorse (replace &#39;h&#39; with &#39;r&#39;)\nrorse -&gt; rose (remove &#39;r&#39;)\nrose -&gt; ros (remove &#39;e&#39;)\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> word1 = &quot;intention&quot;, word2 = &quot;execution&quot;\n<strong>Output:</strong> 5\n<strong>Explanation:</strong> \nintention -&gt; inention (remove &#39;t&#39;)\ninention -&gt; enention (replace &#39;i&#39; with &#39;e&#39;)\nenention -&gt; exention (replace &#39;n&#39; with &#39;x&#39;)\nexention -&gt; exection (replace &#39;n&#39; with &#39;c&#39;)\nexection -&gt; execution (insert &#39;u&#39;)\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>0 &lt;= word1.length, word2.length &lt;= 500</code></li>\n\t<li><code>word1</code> and <code>word2</code> consist of lowercase English letters.</li>\n</ul>\n",
      "lcSlug": "edit-distance",
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
      "description": "Given a string `s`, find the longest palindromic subsequence's length in `s`.\n\nA subsequence is a sequence that can be derived from another sequence by deleting some or no elements without changing the order of the remaining elements.\n\n \n\nExample 1:\n\nInput: s = \"bbbab\"\nOutput: 4\nExplanation: One possible longest palindromic subsequence is \"bbbb\".\n\nExample 2:\n\nInput: s = \"cbbd\"\nOutput: 2\nExplanation: One possible longest palindromic subsequence is \"bb\".\n\n \n\nConstraints:\n\n\t• `1",
      "descriptionHtml": "<p>Given a string <code>s</code>, find <em>the longest palindromic <strong>subsequence</strong>&#39;s length in</em> <code>s</code>.</p>\n\n<p>A <strong>subsequence</strong> is a sequence that can be derived from another sequence by deleting some or no elements without changing the order of the remaining elements.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> s = &quot;bbbab&quot;\n<strong>Output:</strong> 4\n<strong>Explanation:</strong> One possible longest palindromic subsequence is &quot;bbbb&quot;.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> s = &quot;cbbd&quot;\n<strong>Output:</strong> 2\n<strong>Explanation:</strong> One possible longest palindromic subsequence is &quot;bb&quot;.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= s.length &lt;= 1000</code></li>\n\t<li><code>s</code> consists only of lowercase English letters.</li>\n</ul>\n",
      "lcSlug": "longest-palindromic-subsequence",
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
      "description": "Longest Common Substring",
      "summary": "Reset on mismatch"
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
      "description": "Given two strings `word1` and `word2`, return the minimum number of steps required to make `word1` and `word2` the same.\n\nIn one step, you can delete exactly one character in either string.\n\n \n\nExample 1:\n\nInput: word1 = \"sea\", word2 = \"eat\"\nOutput: 2\nExplanation: You need one step to make \"sea\" to \"ea\" and another step to make \"eat\" to \"ea\".\n\nExample 2:\n\nInput: word1 = \"leetcode\", word2 = \"etco\"\nOutput: 4\n\n \n\nConstraints:\n\n\t• `1",
      "descriptionHtml": "<p>Given two strings <code>word1</code> and <code>word2</code>, return <em>the minimum number of <strong>steps</strong> required to make</em> <code>word1</code> <em>and</em> <code>word2</code> <em>the same</em>.</p>\n\n<p>In one <strong>step</strong>, you can delete exactly one character in either string.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> word1 = &quot;sea&quot;, word2 = &quot;eat&quot;\n<strong>Output:</strong> 2\n<strong>Explanation:</strong> You need one step to make &quot;sea&quot; to &quot;ea&quot; and another step to make &quot;eat&quot; to &quot;ea&quot;.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> word1 = &quot;leetcode&quot;, word2 = &quot;etco&quot;\n<strong>Output:</strong> 4\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= word1.length, word2.length &lt;= 500</code></li>\n\t<li><code>word1</code> and <code>word2</code> consist of only lowercase English letters.</li>\n</ul>\n",
      "lcSlug": "delete-operation-for-two-strings",
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
      "description": "Given two strings `s1` and `s2`, return the lowest ASCII sum of deleted characters to make two strings equal.\n\n \n\nExample 1:\n\nInput: s1 = \"sea\", s2 = \"eat\"\nOutput: 231\nExplanation: Deleting \"s\" from \"sea\" adds the ASCII value of \"s\" (115) to the sum.\nDeleting \"t\" from \"eat\" adds 116 to the sum.\nAt the end, both strings are equal, and 115 + 116 = 231 is the minimum sum possible to achieve this.\n\nExample 2:\n\nInput: s1 = \"delete\", s2 = \"leet\"\nOutput: 403\nExplanation: Deleting \"dee\" from \"delete\" to turn the string into \"let\",\nadds 100[d] + 101[e] + 101[e] to the sum.\nDeleting \"e\" from \"leet\" adds 101[e] to the sum.\nAt the end, both strings are equal to \"let\", and the answer is 100+101+101+101 = 403.\nIf instead we turned both strings into \"lee\" or \"eet\", we would get answers of 433 or 417, which are higher.\n\n \n\nConstraints:\n\n\t• `1",
      "descriptionHtml": "<p>Given two strings <code>s1</code> and&nbsp;<code>s2</code>, return <em>the lowest <strong>ASCII</strong> sum of deleted characters to make two strings equal</em>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> s1 = &quot;sea&quot;, s2 = &quot;eat&quot;\n<strong>Output:</strong> 231\n<strong>Explanation:</strong> Deleting &quot;s&quot; from &quot;sea&quot; adds the ASCII value of &quot;s&quot; (115) to the sum.\nDeleting &quot;t&quot; from &quot;eat&quot; adds 116 to the sum.\nAt the end, both strings are equal, and 115 + 116 = 231 is the minimum sum possible to achieve this.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> s1 = &quot;delete&quot;, s2 = &quot;leet&quot;\n<strong>Output:</strong> 403\n<strong>Explanation:</strong> Deleting &quot;dee&quot; from &quot;delete&quot; to turn the string into &quot;let&quot;,\nadds 100[d] + 101[e] + 101[e] to the sum.\nDeleting &quot;e&quot; from &quot;leet&quot; adds 101[e] to the sum.\nAt the end, both strings are equal to &quot;let&quot;, and the answer is 100+101+101+101 = 403.\nIf instead we turned both strings into &quot;lee&quot; or &quot;eet&quot;, we would get answers of 433 or 417, which are higher.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= s1.length, s2.length &lt;= 1000</code></li>\n\t<li><code>s1</code> and <code>s2</code> consist of lowercase English letters.</li>\n</ul>\n",
      "lcSlug": "minimum-ascii-delete-sum-for-two-strings",
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
      "description": "Given two strings `str1` and `str2`, return the shortest string that has both `str1` and `str2` as subsequences. If there are multiple valid strings, return any of them.\n\nA string `s` is a subsequence of string `t` if deleting some number of characters from `t` (possibly `0`) results in the string `s`.\n\n \n\nExample 1:\n\nInput: str1 = \"abac\", str2 = \"cab\"\nOutput: \"cabac\"\nExplanation: \nstr1 = \"abac\" is a subsequence of \"cabac\" because we can delete the first \"c\".\nstr2 = \"cab\" is a subsequence of \"cabac\" because we can delete the last \"ac\".\nThe answer provided is the shortest such string that satisfies these properties.\n\nExample 2:\n\nInput: str1 = \"aaaaaaaa\", str2 = \"aaaaaaaa\"\nOutput: \"aaaaaaaa\"\n\n \n\nConstraints:\n\n\t• `1",
      "descriptionHtml": "<p>Given two strings <code>str1</code> and <code>str2</code>, return <em>the shortest string that has both </em><code>str1</code><em> and </em><code>str2</code><em> as <strong>subsequences</strong></em>. If there are multiple valid strings, return <strong>any</strong> of them.</p>\n\n<p>A string <code>s</code> is a <strong>subsequence</strong> of string <code>t</code> if deleting some number of characters from <code>t</code> (possibly <code>0</code>) results in the string <code>s</code>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> str1 = &quot;abac&quot;, str2 = &quot;cab&quot;\n<strong>Output:</strong> &quot;cabac&quot;\n<strong>Explanation:</strong> \nstr1 = &quot;abac&quot; is a subsequence of &quot;cabac&quot; because we can delete the first &quot;c&quot;.\nstr2 = &quot;cab&quot; is a subsequence of &quot;cabac&quot; because we can delete the last &quot;ac&quot;.\nThe answer provided is the shortest such string that satisfies these properties.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> str1 = &quot;aaaaaaaa&quot;, str2 = &quot;aaaaaaaa&quot;\n<strong>Output:</strong> &quot;aaaaaaaa&quot;\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= str1.length, str2.length &lt;= 1000</code></li>\n\t<li><code>str1</code> and <code>str2</code> consist of lowercase English letters.</li>\n</ul>\n",
      "lcSlug": "shortest-common-supersequence",
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
      "description": "Given two strings s and t, return the number of distinct subsequences of s which equals t.\n\nThe test cases are generated so that the answer fits on a 32-bit signed integer.\n\n \n\nExample 1:\n\nInput: s = \"rabbbit\", t = \"rabbit\"\nOutput: 3\nExplanation:\nAs shown below, there are 3 ways you can generate \"rabbit\" from s.\nrabbbit\nrabbbit\nrabbbit\n\nExample 2:\n\nInput: s = \"babgbag\", t = \"bag\"\nOutput: 5\nExplanation:\nAs shown below, there are 5 ways you can generate \"bag\" from s.\nbabgbag\nbabgbag\nbabgbag\nbabgbag\nbabgbag\n\n \n\nConstraints:\n\n\t• `1",
      "descriptionHtml": "<p>Given two strings s and t, return <i>the number of distinct</i> <b><i>subsequences</i></b><i> of </i>s<i> which equals </i>t.</p>\n\n<p>The test cases are generated so that the answer fits on a 32-bit signed integer.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> s = &quot;rabbbit&quot;, t = &quot;rabbit&quot;\n<strong>Output:</strong> 3\n<strong>Explanation:</strong>\nAs shown below, there are 3 ways you can generate &quot;rabbit&quot; from s.\n<code><strong><u>rabb</u></strong>b<strong><u>it</u></strong></code>\n<code><strong><u>ra</u></strong>b<strong><u>bbit</u></strong></code>\n<code><strong><u>rab</u></strong>b<strong><u>bit</u></strong></code>\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> s = &quot;babgbag&quot;, t = &quot;bag&quot;\n<strong>Output:</strong> 5\n<strong>Explanation:</strong>\nAs shown below, there are 5 ways you can generate &quot;bag&quot; from s.\n<code><strong><u>ba</u></strong>b<u><strong>g</strong></u>bag</code>\n<code><strong><u>ba</u></strong>bgba<strong><u>g</u></strong></code>\n<code><u><strong>b</strong></u>abgb<strong><u>ag</u></strong></code>\n<code>ba<u><strong>b</strong></u>gb<u><strong>ag</strong></u></code>\n<code>babg<strong><u>bag</u></strong></code></pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= s.length, t.length &lt;= 1000</code></li>\n\t<li><code>s</code> and <code>t</code> consist of English letters.</li>\n</ul>\n",
      "lcSlug": "distinct-subsequences",
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
      "description": "There is a robot on an `m x n` grid. The robot is initially located at the top-left corner (i.e., `grid[0][0]`). The robot tries to move to the bottom-right corner (i.e., `grid[m - 1][n - 1]`). The robot can only move either down or right at any point in time.\n\nGiven the two integers `m` and `n`, return the number of possible unique paths that the robot can take to reach the bottom-right corner.\n\nThe test cases are generated so that the answer will be less than or equal to `2 * 109`.\n\n \n\nExample 1:\n\nInput: m = 3, n = 7\nOutput: 28\n\nExample 2:\n\nInput: m = 3, n = 2\nOutput: 3\nExplanation: From the top-left corner, there are a total of 3 ways to reach the bottom-right corner:\n1. Right -> Down -> Down\n2. Down -> Down -> Right\n3. Down -> Right -> Down\n\n \n\nConstraints:\n\n\t• `1",
      "descriptionHtml": "<p>There is a robot on an <code>m x n</code> grid. The robot is initially located at the <strong>top-left corner</strong> (i.e., <code>grid[0][0]</code>). The robot tries to move to the <strong>bottom-right corner</strong> (i.e., <code>grid[m - 1][n - 1]</code>). The robot can only move either down or right at any point in time.</p>\n\n<p>Given the two integers <code>m</code> and <code>n</code>, return <em>the number of possible unique paths that the robot can take to reach the bottom-right corner</em>.</p>\n\n<p>The test cases are generated so that the answer will be less than or equal to <code>2 * 10<sup>9</sup></code>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img src=\"https://assets.leetcode.com/uploads/2018/10/22/robot_maze.png\" style=\"width: 400px; height: 183px;\" />\n<pre>\n<strong>Input:</strong> m = 3, n = 7\n<strong>Output:</strong> 28\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> m = 3, n = 2\n<strong>Output:</strong> 3\n<strong>Explanation:</strong> From the top-left corner, there are a total of 3 ways to reach the bottom-right corner:\n1. Right -&gt; Down -&gt; Down\n2. Down -&gt; Down -&gt; Right\n3. Down -&gt; Right -&gt; Down\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= m, n &lt;= 100</code></li>\n</ul>\n",
      "lcSlug": "unique-paths",
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
      "description": "You are given an `m x n` integer array `grid`. There is a robot initially located at the top-left corner (i.e., `grid[0][0]`). The robot tries to move to the bottom-right corner (i.e., `grid[m - 1][n - 1]`). The robot can only move either down or right at any point in time.\n\nAn obstacle and space are marked as `1` or `0` respectively in `grid`. A path that the robot takes cannot include any square that is an obstacle.\n\nReturn the number of possible unique paths that the robot can take to reach the bottom-right corner.\n\nThe testcases are generated so that the answer will be less than or equal to `2 * 109`.\n\n \n\nExample 1:\n\nInput: obstacleGrid = [[0,0,0],[0,1,0],[0,0,0]]\nOutput: 2\nExplanation: There is one obstacle in the middle of the 3x3 grid above.\nThere are two ways to reach the bottom-right corner:\n1. Right -> Right -> Down -> Down\n2. Down -> Down -> Right -> Right\n\nExample 2:\n\nInput: obstacleGrid = [[0,1],[0,0]]\nOutput: 1\n\n \n\nConstraints:\n\n\t• `m == obstacleGrid.length`\n• `n == obstacleGrid[i].length`\n• `1",
      "descriptionHtml": "<p>You are given an <code>m x n</code> integer array <code>grid</code>. There is a robot initially located at the <b>top-left corner</b> (i.e., <code>grid[0][0]</code>). The robot tries to move to the <strong>bottom-right corner</strong> (i.e., <code>grid[m - 1][n - 1]</code>). The robot can only move either down or right at any point in time.</p>\n\n<p>An obstacle and space are marked as <code>1</code> or <code>0</code> respectively in <code>grid</code>. A path that the robot takes cannot include <strong>any</strong> square that is an obstacle.</p>\n\n<p>Return <em>the number of possible unique paths that the robot can take to reach the bottom-right corner</em>.</p>\n\n<p>The testcases are generated so that the answer will be less than or equal to <code>2 * 10<sup>9</sup></code>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2020/11/04/robot1.jpg\" style=\"width: 242px; height: 242px;\" />\n<pre>\n<strong>Input:</strong> obstacleGrid = [[0,0,0],[0,1,0],[0,0,0]]\n<strong>Output:</strong> 2\n<strong>Explanation:</strong> There is one obstacle in the middle of the 3x3 grid above.\nThere are two ways to reach the bottom-right corner:\n1. Right -&gt; Right -&gt; Down -&gt; Down\n2. Down -&gt; Down -&gt; Right -&gt; Right\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2020/11/04/robot2.jpg\" style=\"width: 162px; height: 162px;\" />\n<pre>\n<strong>Input:</strong> obstacleGrid = [[0,1],[0,0]]\n<strong>Output:</strong> 1\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>m == obstacleGrid.length</code></li>\n\t<li><code>n == obstacleGrid[i].length</code></li>\n\t<li><code>1 &lt;= m, n &lt;= 100</code></li>\n\t<li><code>obstacleGrid[i][j]</code> is <code>0</code> or <code>1</code>.</li>\n</ul>\n",
      "lcSlug": "unique-paths-ii",
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
      "description": "Given a `m x n` `grid` filled with non-negative numbers, find a path from top left to bottom right, which minimizes the sum of all numbers along its path.\n\nNote: You can only move either down or right at any point in time.\n\n \n\nExample 1:\n\nInput: grid = [[1,3,1],[1,5,1],[4,2,1]]\nOutput: 7\nExplanation: Because the path 1 &rarr; 3 &rarr; 1 &rarr; 1 &rarr; 1 minimizes the sum.\n\nExample 2:\n\nInput: grid = [[1,2,3],[4,5,6]]\nOutput: 12\n\n \n\nConstraints:\n\n\t• `m == grid.length`\n• `n == grid[i].length`\n• `1",
      "descriptionHtml": "<p>Given a <code>m x n</code> <code>grid</code> filled with non-negative numbers, find a path from top left to bottom right, which minimizes the sum of all numbers along its path.</p>\n\n<p><strong>Note:</strong> You can only move either down or right at any point in time.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2020/11/05/minpath.jpg\" style=\"width: 242px; height: 242px;\" />\n<pre>\n<strong>Input:</strong> grid = [[1,3,1],[1,5,1],[4,2,1]]\n<strong>Output:</strong> 7\n<strong>Explanation:</strong> Because the path 1 &rarr; 3 &rarr; 1 &rarr; 1 &rarr; 1 minimizes the sum.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> grid = [[1,2,3],[4,5,6]]\n<strong>Output:</strong> 12\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>m == grid.length</code></li>\n\t<li><code>n == grid[i].length</code></li>\n\t<li><code>1 &lt;= m, n &lt;= 200</code></li>\n\t<li><code>0 &lt;= grid[i][j] &lt;= 200</code></li>\n</ul>\n",
      "lcSlug": "minimum-path-sum",
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
      "description": "Given an `m x n` binary `matrix` filled with `0`'s and `1`'s, find the largest square containing only `1`'s and return its area.\n\n \n\nExample 1:\n\nInput: matrix = [[\"1\",\"0\",\"1\",\"0\",\"0\"],[\"1\",\"0\",\"1\",\"1\",\"1\"],[\"1\",\"1\",\"1\",\"1\",\"1\"],[\"1\",\"0\",\"0\",\"1\",\"0\"]]\nOutput: 4\n\nExample 2:\n\nInput: matrix = [[\"0\",\"1\"],[\"1\",\"0\"]]\nOutput: 1\n\nExample 3:\n\nInput: matrix = [[\"0\"]]\nOutput: 0\n\n \n\nConstraints:\n\n\t• `m == matrix.length`\n• `n == matrix[i].length`\n• `1",
      "descriptionHtml": "<p>Given an <code>m x n</code> binary <code>matrix</code> filled with <code>0</code>&#39;s and <code>1</code>&#39;s, <em>find the largest square containing only</em> <code>1</code>&#39;s <em>and return its area</em>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2020/11/26/max1grid.jpg\" style=\"width: 400px; height: 319px;\" />\n<pre>\n<strong>Input:</strong> matrix = [[&quot;1&quot;,&quot;0&quot;,&quot;1&quot;,&quot;0&quot;,&quot;0&quot;],[&quot;1&quot;,&quot;0&quot;,&quot;1&quot;,&quot;1&quot;,&quot;1&quot;],[&quot;1&quot;,&quot;1&quot;,&quot;1&quot;,&quot;1&quot;,&quot;1&quot;],[&quot;1&quot;,&quot;0&quot;,&quot;0&quot;,&quot;1&quot;,&quot;0&quot;]]\n<strong>Output:</strong> 4\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2020/11/26/max2grid.jpg\" style=\"width: 165px; height: 165px;\" />\n<pre>\n<strong>Input:</strong> matrix = [[&quot;0&quot;,&quot;1&quot;],[&quot;1&quot;,&quot;0&quot;]]\n<strong>Output:</strong> 1\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> matrix = [[&quot;0&quot;]]\n<strong>Output:</strong> 0\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>m == matrix.length</code></li>\n\t<li><code>n == matrix[i].length</code></li>\n\t<li><code>1 &lt;= m, n &lt;= 300</code></li>\n\t<li><code>matrix[i][j]</code> is <code>&#39;0&#39;</code> or <code>&#39;1&#39;</code>.</li>\n</ul>\n",
      "lcSlug": "maximal-square",
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
      "description": "Given a `triangle` array, return the minimum path sum from top to bottom.\n\nFor each step, you may move to an adjacent number of the row below. More formally, if you are on index `i` on the current row, you may move to either index `i` or index `i + 1` on the next row.\n\n \n\nExample 1:\n\nInput: triangle = [[2],[3,4],[6,5,7],[4,1,8,3]]\nOutput: 11\nExplanation: The triangle looks like:\n   2\n  3 4\n 6 5 7\n4 1 8 3\nThe minimum path sum from top to bottom is 2 + 3 + 5 + 1 = 11 (underlined above).\n\nExample 2:\n\nInput: triangle = [[-10]]\nOutput: -10\n\n \n\nConstraints:\n\n\t• `1 4 4`\n\n \nFollow up: Could you do this using only `O(n)` extra space, where `n` is the total number of rows in the triangle?",
      "descriptionHtml": "<p>Given a <code>triangle</code> array, return <em>the minimum path sum from top to bottom</em>.</p>\n\n<p>For each step, you may move to an adjacent number of the row below. More formally, if you are on index <code>i</code> on the current row, you may move to either index <code>i</code> or index <code>i + 1</code> on the next row.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> triangle = [[2],[3,4],[6,5,7],[4,1,8,3]]\n<strong>Output:</strong> 11\n<strong>Explanation:</strong> The triangle looks like:\n   <u>2</u>\n  <u>3</u> 4\n 6 <u>5</u> 7\n4 <u>1</u> 8 3\nThe minimum path sum from top to bottom is 2 + 3 + 5 + 1 = 11 (underlined above).\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> triangle = [[-10]]\n<strong>Output:</strong> -10\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= triangle.length &lt;= 200</code></li>\n\t<li><code>triangle[0].length == 1</code></li>\n\t<li><code>triangle[i].length == triangle[i - 1].length + 1</code></li>\n\t<li><code>-10<sup>4</sup> &lt;= triangle[i][j] &lt;= 10<sup>4</sup></code></li>\n</ul>\n\n<p>&nbsp;</p>\n<strong>Follow up:</strong> Could you&nbsp;do this using only <code>O(n)</code> extra space, where <code>n</code> is the total number of rows in the triangle?",
      "lcSlug": "triangle",
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
      "description": "The demons had captured the princess and imprisoned her in the bottom-right corner of a `dungeon`. The `dungeon` consists of `m x n` rooms laid out in a 2D grid. Our valiant knight was initially positioned in the top-left room and must fight his way through `dungeon` to rescue the princess.\n\nThe knight has an initial health point represented by a positive integer. If at any point his health point drops to `0` or below, he dies immediately.\n\nSome of the rooms are guarded by demons (represented by negative integers), so the knight loses health upon entering these rooms; other rooms are either empty (represented as 0) or contain magic orbs that increase the knight's health (represented by positive integers).\n\nTo reach the princess as quickly as possible, the knight decides to move only rightward or downward in each step.\n\nReturn the knight's minimum initial health so that he can rescue the princess.\n\nNote that any room can contain threats or power-ups, even the first room the knight enters and the bottom-right room where the princess is imprisoned.\n\n \n\nExample 1:\n\nInput: dungeon = [[-2,-3,3],[-5,-10,1],[10,30,-5]]\nOutput: 7\nExplanation: The initial health of the knight must be at least 7 if he follows the optimal path: RIGHT-> RIGHT -> DOWN -> DOWN.\n\nExample 2:\n\nInput: dungeon = [[0]]\nOutput: 1\n\n \n\nConstraints:\n\n\t• `m == dungeon.length`\n• `n == dungeon[i].length`\n• `1",
      "descriptionHtml": "<p>The demons had captured the princess and imprisoned her in <strong>the bottom-right corner</strong> of a <code>dungeon</code>. The <code>dungeon</code> consists of <code>m x n</code> rooms laid out in a 2D grid. Our valiant knight was initially positioned in <strong>the top-left room</strong> and must fight his way through <code>dungeon</code> to rescue the princess.</p>\n\n<p>The knight has an initial health point represented by a positive integer. If at any point his health point drops to <code>0</code> or below, he dies immediately.</p>\n\n<p>Some of the rooms are guarded by demons (represented by negative integers), so the knight loses health upon entering these rooms; other rooms are either empty (represented as 0) or contain magic orbs that increase the knight&#39;s health (represented by positive integers).</p>\n\n<p>To reach the princess as quickly as possible, the knight decides to move only <strong>rightward</strong> or <strong>downward</strong> in each step.</p>\n\n<p>Return <em>the knight&#39;s minimum initial health so that he can rescue the princess</em>.</p>\n\n<p><strong>Note</strong> that any room can contain threats or power-ups, even the first room the knight enters and the bottom-right room where the princess is imprisoned.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2021/03/13/dungeon-grid-1.jpg\" style=\"width: 253px; height: 253px;\" />\n<pre>\n<strong>Input:</strong> dungeon = [[-2,-3,3],[-5,-10,1],[10,30,-5]]\n<strong>Output:</strong> 7\n<strong>Explanation:</strong> The initial health of the knight must be at least 7 if he follows the optimal path: RIGHT-&gt; RIGHT -&gt; DOWN -&gt; DOWN.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> dungeon = [[0]]\n<strong>Output:</strong> 1\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>m == dungeon.length</code></li>\n\t<li><code>n == dungeon[i].length</code></li>\n\t<li><code>1 &lt;= m, n &lt;= 200</code></li>\n\t<li><code>-1000 &lt;= dungeon[i][j] &lt;= 1000</code></li>\n</ul>\n",
      "lcSlug": "dungeon-game",
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
      "description": "You are given an `n x n` `grid` representing a field of cherries, each cell is one of three possible integers.\n\n\t• `0` means the cell is empty, so you can pass through,\n• `1` means the cell contains a cherry that you can pick up and pass through, or\n• `-1` means the cell contains a thorn that blocks your way.\n\nReturn the maximum number of cherries you can collect by following the rules below:\n\n\t• Starting at the position `(0, 0)` and reaching `(n - 1, n - 1)` by moving right or down through valid path cells (cells with value `0` or `1`).\n• After reaching `(n - 1, n - 1)`, returning to `(0, 0)` by moving left or up through valid path cells.\n• When passing through a path cell containing a cherry, you pick it up, and the cell becomes an empty cell `0`.\n• If there is no valid path between `(0, 0)` and `(n - 1, n - 1)`, then no cherries can be collected.\n\n \n\nExample 1:\n\nInput: grid = [[0,1,-1],[1,0,-1],[1,1,1]]\nOutput: 5\nExplanation: The player started at (0, 0) and went down, down, right right to reach (2, 2).\n4 cherries were picked up during this single trip, and the matrix becomes [[0,1,-1],[0,0,-1],[0,0,0]].\nThen, the player went left, up, up, left to return home, picking up one more cherry.\nThe total number of cherries picked up is 5, and this is the maximum possible.\n\nExample 2:\n\nInput: grid = [[1,1,-1],[1,-1,1],[-1,1,1]]\nOutput: 0\n\n \n\nConstraints:\n\n\t• `n == grid.length`\n• `n == grid[i].length`\n• `1",
      "descriptionHtml": "<p>You are given an <code>n x n</code> <code>grid</code> representing a field of cherries, each cell is one of three possible integers.</p>\n\n<ul>\n\t<li><code>0</code> means the cell is empty, so you can pass through,</li>\n\t<li><code>1</code> means the cell contains a cherry that you can pick up and pass through, or</li>\n\t<li><code>-1</code> means the cell contains a thorn that blocks your way.</li>\n</ul>\n\n<p>Return <em>the maximum number of cherries you can collect by following the rules below</em>:</p>\n\n<ul>\n\t<li>Starting at the position <code>(0, 0)</code> and reaching <code>(n - 1, n - 1)</code> by moving right or down through valid path cells (cells with value <code>0</code> or <code>1</code>).</li>\n\t<li>After reaching <code>(n - 1, n - 1)</code>, returning to <code>(0, 0)</code> by moving left or up through valid path cells.</li>\n\t<li>When passing through a path cell containing a cherry, you pick it up, and the cell becomes an empty cell <code>0</code>.</li>\n\t<li>If there is no valid path between <code>(0, 0)</code> and <code>(n - 1, n - 1)</code>, then no cherries can be collected.</li>\n</ul>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2020/12/14/grid.jpg\" style=\"width: 242px; height: 242px;\" />\n<pre>\n<strong>Input:</strong> grid = [[0,1,-1],[1,0,-1],[1,1,1]]\n<strong>Output:</strong> 5\n<strong>Explanation:</strong> The player started at (0, 0) and went down, down, right right to reach (2, 2).\n4 cherries were picked up during this single trip, and the matrix becomes [[0,1,-1],[0,0,-1],[0,0,0]].\nThen, the player went left, up, up, left to return home, picking up one more cherry.\nThe total number of cherries picked up is 5, and this is the maximum possible.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> grid = [[1,1,-1],[1,-1,1],[-1,1,1]]\n<strong>Output:</strong> 0\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>n == grid.length</code></li>\n\t<li><code>n == grid[i].length</code></li>\n\t<li><code>1 &lt;= n &lt;= 50</code></li>\n\t<li><code>grid[i][j]</code> is <code>-1</code>, <code>0</code>, or <code>1</code>.</li>\n\t<li><code>grid[0][0] != -1</code></li>\n\t<li><code>grid[n - 1][n - 1] != -1</code></li>\n</ul>\n",
      "lcSlug": "cherry-pickup",
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
      "description": "The thief has found himself a new place for his thievery again. There is only one entrance to this area, called `root`.\n\nBesides the `root`, each house has one and only one parent house. After a tour, the smart thief realized that all houses in this place form a binary tree. It will automatically contact the police if two directly-linked houses were broken into on the same night.\n\nGiven the `root` of the binary tree, return the maximum amount of money the thief can rob without alerting the police.\n\n \n\nExample 1:\n\nInput: root = [3,2,3,null,3,null,1]\nOutput: 7\nExplanation: Maximum amount of money the thief can rob = 3 + 3 + 1 = 7.\n\nExample 2:\n\nInput: root = [3,4,5,1,3,null,1]\nOutput: 9\nExplanation: Maximum amount of money the thief can rob = 4 + 5 = 9.\n\n \n\nConstraints:\n\n\t• The number of nodes in the tree is in the range `[1, 104]`.\n• `0 4`",
      "descriptionHtml": "<p>The thief has found himself a new place for his thievery again. There is only one entrance to this area, called <code>root</code>.</p>\n\n<p>Besides the <code>root</code>, each house has one and only one parent house. After a tour, the smart thief realized that all houses in this place form a binary tree. It will automatically contact the police if <strong>two directly-linked houses were broken into on the same night</strong>.</p>\n\n<p>Given the <code>root</code> of the binary tree, return <em>the maximum amount of money the thief can rob <strong>without alerting the police</strong></em>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2021/03/10/rob1-tree.jpg\" style=\"width: 277px; height: 293px;\" />\n<pre>\n<strong>Input:</strong> root = [3,2,3,null,3,null,1]\n<strong>Output:</strong> 7\n<strong>Explanation:</strong> Maximum amount of money the thief can rob = 3 + 3 + 1 = 7.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2021/03/10/rob2-tree.jpg\" style=\"width: 357px; height: 293px;\" />\n<pre>\n<strong>Input:</strong> root = [3,4,5,1,3,null,1]\n<strong>Output:</strong> 9\n<strong>Explanation:</strong> Maximum amount of money the thief can rob = 4 + 5 = 9.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li>The number of nodes in the tree is in the range <code>[1, 10<sup>4</sup>]</code>.</li>\n\t<li><code>0 &lt;= Node.val &lt;= 10<sup>4</sup></code></li>\n</ul>\n",
      "lcSlug": "house-robber-iii",
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
      "description": "A path in a binary tree is a sequence of nodes where each pair of adjacent nodes in the sequence has an edge connecting them. A node can only appear in the sequence at most once. Note that the path does not need to pass through the root.\n\nThe path sum of a path is the sum of the node's values in the path.\n\nGiven the `root` of a binary tree, return the maximum path sum of any non-empty path.\n\n \n\nExample 1:\n\nInput: root = [1,2,3]\nOutput: 6\nExplanation: The optimal path is 2 -> 1 -> 3 with a path sum of 2 + 1 + 3 = 6.\n\nExample 2:\n\nInput: root = [-10,9,20,null,null,15,7]\nOutput: 42\nExplanation: The optimal path is 15 -> 20 -> 7 with a path sum of 15 + 20 + 7 = 42.\n\n \n\nConstraints:\n\n\t• The number of nodes in the tree is in the range `[1, 3 * 104]`.\n• `-1000",
      "descriptionHtml": "<p>A <strong>path</strong> in a binary tree is a sequence of nodes where each pair of adjacent nodes in the sequence has an edge connecting them. A node can only appear in the sequence <strong>at most once</strong>. Note that the path does not need to pass through the root.</p>\n\n<p>The <strong>path sum</strong> of a path is the sum of the node&#39;s values in the path.</p>\n\n<p>Given the <code>root</code> of a binary tree, return <em>the maximum <strong>path sum</strong> of any <strong>non-empty</strong> path</em>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2020/10/13/exx1.jpg\" style=\"width: 322px; height: 182px;\" />\n<pre>\n<strong>Input:</strong> root = [1,2,3]\n<strong>Output:</strong> 6\n<strong>Explanation:</strong> The optimal path is 2 -&gt; 1 -&gt; 3 with a path sum of 2 + 1 + 3 = 6.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2020/10/13/exx2.jpg\" />\n<pre>\n<strong>Input:</strong> root = [-10,9,20,null,null,15,7]\n<strong>Output:</strong> 42\n<strong>Explanation:</strong> The optimal path is 15 -&gt; 20 -&gt; 7 with a path sum of 15 + 20 + 7 = 42.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li>The number of nodes in the tree is in the range <code>[1, 3 * 10<sup>4</sup>]</code>.</li>\n\t<li><code>-1000 &lt;= Node.val &lt;= 1000</code></li>\n</ul>\n",
      "lcSlug": "binary-tree-maximum-path-sum",
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
      "description": "Given the `root` of a binary tree, return the length of the diameter of the tree.\n\nThe diameter of a binary tree is the length of the longest path between any two nodes in a tree. This path may or may not pass through the `root`.\n\nThe length of a path between two nodes is represented by the number of edges between them.\n\n \n\nExample 1:\n\nInput: root = [1,2,3,4,5]\nOutput: 3\nExplanation: 3 is the length of the path [4,2,1,3] or [5,2,1,3].\n\nExample 2:\n\nInput: root = [1,2]\nOutput: 1\n\n \n\nConstraints:\n\n\t• The number of nodes in the tree is in the range `[1, 104]`.\n• `-100",
      "descriptionHtml": "<p>Given the <code>root</code> of a binary tree, return <em>the length of the <strong>diameter</strong> of the tree</em>.</p>\n\n<p>The <strong>diameter</strong> of a binary tree is the <strong>length</strong> of the longest path between any two nodes in a tree. This path may or may not pass through the <code>root</code>.</p>\n\n<p>The <strong>length</strong> of a path between two nodes is represented by the number of edges between them.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2021/03/06/diamtree.jpg\" style=\"width: 292px; height: 302px;\" />\n<pre>\n<strong>Input:</strong> root = [1,2,3,4,5]\n<strong>Output:</strong> 3\n<strong>Explanation:</strong> 3 is the length of the path [4,2,1,3] or [5,2,1,3].\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> root = [1,2]\n<strong>Output:</strong> 1\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li>The number of nodes in the tree is in the range <code>[1, 10<sup>4</sup>]</code>.</li>\n\t<li><code>-100 &lt;= Node.val &lt;= 100</code></li>\n</ul>\n",
      "lcSlug": "diameter-of-binary-tree",
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
      "description": "Given an integer `n`, return the number of structurally unique BST's (binary search trees) which has exactly `n` nodes of unique values from `1` to `n`.\n\n \n\nExample 1:\n\nInput: n = 3\nOutput: 5\n\nExample 2:\n\nInput: n = 1\nOutput: 1\n\n \n\nConstraints:\n\n\t• `1",
      "descriptionHtml": "<p>Given an integer <code>n</code>, return <em>the number of structurally unique <strong>BST&#39;</strong>s (binary search trees) which has exactly </em><code>n</code><em> nodes of unique values from</em> <code>1</code> <em>to</em> <code>n</code>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2021/01/18/uniquebstn3.jpg\" style=\"width: 600px; height: 148px;\" />\n<pre>\n<strong>Input:</strong> n = 3\n<strong>Output:</strong> 5\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> n = 1\n<strong>Output:</strong> 1\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= n &lt;= 19</code></li>\n</ul>\n",
      "lcSlug": "unique-binary-search-trees",
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
      "description": "Given the `root` of a binary tree, determine if it is a valid binary search tree (BST).\n\nA valid BST is defined as follows:\n\n\t• The left subtree of a node contains only nodes with keys strictly less than the node's key.\n• The right subtree of a node contains only nodes with keys strictly greater than the node's key.\n• Both the left and right subtrees must also be binary search trees.\n\n \n\nExample 1:\n\nInput: root = [2,1,3]\nOutput: true\n\nExample 2:\n\nInput: root = [5,1,4,null,null,3,6]\nOutput: false\nExplanation: The root node's value is 5 but its right child's value is 4.\n\n \n\nConstraints:\n\n\t• The number of nodes in the tree is in the range `[1, 104]`.\n• `-231 31 - 1`",
      "descriptionHtml": "<p>Given the <code>root</code> of a binary tree, <em>determine if it is a valid binary search tree (BST)</em>.</p>\n\n<p>A <strong>valid BST</strong> is defined as follows:</p>\n\n<ul>\n\t<li>The left <span data-keyword=\"subtree\">subtree</span> of a node contains only nodes with keys&nbsp;<strong>strictly less than</strong> the node&#39;s key.</li>\n\t<li>The right subtree of a node contains only nodes with keys <strong>strictly greater than</strong> the node&#39;s key.</li>\n\t<li>Both the left and right subtrees must also be binary search trees.</li>\n</ul>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2020/12/01/tree1.jpg\" style=\"width: 302px; height: 182px;\" />\n<pre>\n<strong>Input:</strong> root = [2,1,3]\n<strong>Output:</strong> true\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2020/12/01/tree2.jpg\" style=\"width: 422px; height: 292px;\" />\n<pre>\n<strong>Input:</strong> root = [5,1,4,null,null,3,6]\n<strong>Output:</strong> false\n<strong>Explanation:</strong> The root node&#39;s value is 5 but its right child&#39;s value is 4.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li>The number of nodes in the tree is in the range <code>[1, 10<sup>4</sup>]</code>.</li>\n\t<li><code>-2<sup>31</sup> &lt;= Node.val &lt;= 2<sup>31</sup> - 1</code></li>\n</ul>\n",
      "lcSlug": "validate-binary-search-tree",
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
      "description": "You are given the `root` of a binary tree. We install cameras on the tree nodes where each camera at a node can monitor its parent, itself, and its immediate children.\n\nReturn the minimum number of cameras needed to monitor all nodes of the tree.\n\n \n\nExample 1:\n\nInput: root = [0,0,null,0,0]\nOutput: 1\nExplanation: One camera is enough to monitor all nodes if placed as shown.\n\nExample 2:\n\nInput: root = [0,0,null,0,null,0,null,null,0]\nOutput: 2\nExplanation: At least two cameras are needed to monitor all nodes of the tree. The above image shows one of the valid configurations of camera placement.\n\n \n\nConstraints:\n\n\t• The number of nodes in the tree is in the range `[1, 1000]`.\n• `Node.val == 0`",
      "descriptionHtml": "<p>You are given the <code>root</code> of a binary tree. We install cameras on the tree nodes where each camera at a node can monitor its parent, itself, and its immediate children.</p>\n\n<p>Return <em>the minimum number of cameras needed to monitor all nodes of the tree</em>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2018/12/29/bst_cameras_01.png\" style=\"width: 138px; height: 163px;\" />\n<pre>\n<strong>Input:</strong> root = [0,0,null,0,0]\n<strong>Output:</strong> 1\n<strong>Explanation:</strong> One camera is enough to monitor all nodes if placed as shown.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2018/12/29/bst_cameras_02.png\" style=\"width: 139px; height: 312px;\" />\n<pre>\n<strong>Input:</strong> root = [0,0,null,0,null,0,null,null,0]\n<strong>Output:</strong> 2\n<strong>Explanation:</strong> At least two cameras are needed to monitor all nodes of the tree. The above image shows one of the valid configurations of camera placement.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li>The number of nodes in the tree is in the range <code>[1, 1000]</code>.</li>\n\t<li><code>Node.val == 0</code></li>\n</ul>\n",
      "lcSlug": "binary-tree-cameras",
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
      "description": "You are given an array `prices` where `prices[i]` is the price of a given stock on the `ith` day.\n\nYou want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.\n\nReturn the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return `0`.\n\n \n\nExample 1:\n\nInput: prices = [7,1,5,3,6,4]\nOutput: 5\nExplanation: Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5.\nNote that buying on day 2 and selling on day 1 is not allowed because you must buy before you sell.\n\nExample 2:\n\nInput: prices = [7,6,4,3,1]\nOutput: 0\nExplanation: In this case, no transactions are done and the max profit = 0.\n\n \n\nConstraints:\n\n\t• `1 5`\n• `0 4`",
      "descriptionHtml": "<p>You are given an array <code>prices</code> where <code>prices[i]</code> is the price of a given stock on the <code>i<sup>th</sup></code> day.</p>\n\n<p>You want to maximize your profit by choosing a <strong>single day</strong> to buy one stock and choosing a <strong>different day in the future</strong> to sell that stock.</p>\n\n<p>Return <em>the maximum profit you can achieve from this transaction</em>. If you cannot achieve any profit, return <code>0</code>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> prices = [7,1,5,3,6,4]\n<strong>Output:</strong> 5\n<strong>Explanation:</strong> Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5.\nNote that buying on day 2 and selling on day 1 is not allowed because you must buy before you sell.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> prices = [7,6,4,3,1]\n<strong>Output:</strong> 0\n<strong>Explanation:</strong> In this case, no transactions are done and the max profit = 0.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= prices.length &lt;= 10<sup>5</sup></code></li>\n\t<li><code>0 &lt;= prices[i] &lt;= 10<sup>4</sup></code></li>\n</ul>\n",
      "lcSlug": "best-time-to-buy-and-sell-stock",
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
      "description": "You are given an integer array `prices` where `prices[i]` is the price of a given stock on the `ith` day.\n\nOn each day, you may decide to buy and/or sell the stock. You can only hold at most one share of the stock at any time. However, you can sell and buy the stock multiple times on the same day, ensuring you never hold more than one share of the stock.\n\nFind and return the maximum profit you can achieve.\n\n \n\nExample 1:\n\nInput: prices = [7,1,5,3,6,4]\nOutput: 7\nExplanation: Buy on day 2 (price = 1) and sell on day 3 (price = 5), profit = 5-1 = 4.\nThen buy on day 4 (price = 3) and sell on day 5 (price = 6), profit = 6-3 = 3.\nTotal profit is 4 + 3 = 7.\n\nExample 2:\n\nInput: prices = [1,2,3,4,5]\nOutput: 4\nExplanation: Buy on day 1 (price = 1) and sell on day 5 (price = 5), profit = 5-1 = 4.\nTotal profit is 4.\n\nExample 3:\n\nInput: prices = [7,6,4,3,1]\nOutput: 0\nExplanation: There is no way to make a positive profit, so we never buy the stock to achieve the maximum profit of 0.\n\n \n\nConstraints:\n\n\t• `1 4`\n• `0 4`",
      "descriptionHtml": "<p>You are given an integer array <code>prices</code> where <code>prices[i]</code> is the price of a given stock on the <code>i<sup>th</sup></code> day.</p>\n\n<p>On each day, you may decide to buy and/or sell the stock. You can only hold <strong>at most one</strong> share of the stock at any time. However, you can sell and buy the stock multiple times on the <strong>same day</strong>, ensuring you never hold more than one share of the stock.</p>\n\n<p>Find and return <em>the <strong>maximum</strong> profit you can achieve</em>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> prices = [7,1,5,3,6,4]\n<strong>Output:</strong> 7\n<strong>Explanation:</strong> Buy on day 2 (price = 1) and sell on day 3 (price = 5), profit = 5-1 = 4.\nThen buy on day 4 (price = 3) and sell on day 5 (price = 6), profit = 6-3 = 3.\nTotal profit is 4 + 3 = 7.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> prices = [1,2,3,4,5]\n<strong>Output:</strong> 4\n<strong>Explanation:</strong> Buy on day 1 (price = 1) and sell on day 5 (price = 5), profit = 5-1 = 4.\nTotal profit is 4.\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> prices = [7,6,4,3,1]\n<strong>Output:</strong> 0\n<strong>Explanation:</strong> There is no way to make a positive profit, so we never buy the stock to achieve the maximum profit of 0.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= prices.length &lt;= 3 * 10<sup>4</sup></code></li>\n\t<li><code>0 &lt;= prices[i] &lt;= 10<sup>4</sup></code></li>\n</ul>\n",
      "lcSlug": "best-time-to-buy-and-sell-stock-ii",
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
      "description": "You are given an array `prices` where `prices[i]` is the price of a given stock on the `ith` day.\n\nFind the maximum profit you can achieve. You may complete at most two transactions.\n\nNote: You may not engage in multiple transactions simultaneously (i.e., you must sell the stock before you buy again).\n\n \n\nExample 1:\n\nInput: prices = [3,3,5,0,0,3,1,4]\nOutput: 6\nExplanation: Buy on day 4 (price = 0) and sell on day 6 (price = 3), profit = 3-0 = 3.\nThen buy on day 7 (price = 1) and sell on day 8 (price = 4), profit = 4-1 = 3.\n\nExample 2:\n\nInput: prices = [1,2,3,4,5]\nOutput: 4\nExplanation: Buy on day 1 (price = 1) and sell on day 5 (price = 5), profit = 5-1 = 4.\nNote that you cannot buy on day 1, buy on day 2 and sell them later, as you are engaging multiple transactions at the same time. You must sell before buying again.\n\nExample 3:\n\nInput: prices = [7,6,4,3,1]\nOutput: 0\nExplanation: In this case, no transaction is done, i.e. max profit = 0.\n\n \n\nConstraints:\n\n\t• `1 5`\n• `0 5`",
      "descriptionHtml": "<p>You are given an array <code>prices</code> where <code>prices[i]</code> is the price of a given stock on the <code>i<sup>th</sup></code> day.</p>\n\n<p>Find the maximum profit you can achieve. You may complete <strong>at most two transactions</strong>.</p>\n\n<p><strong>Note:</strong> You may not engage in multiple transactions simultaneously (i.e., you must sell the stock before you buy again).</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> prices = [3,3,5,0,0,3,1,4]\n<strong>Output:</strong> 6\n<strong>Explanation:</strong> Buy on day 4 (price = 0) and sell on day 6 (price = 3), profit = 3-0 = 3.\nThen buy on day 7 (price = 1) and sell on day 8 (price = 4), profit = 4-1 = 3.</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> prices = [1,2,3,4,5]\n<strong>Output:</strong> 4\n<strong>Explanation:</strong> Buy on day 1 (price = 1) and sell on day 5 (price = 5), profit = 5-1 = 4.\nNote that you cannot buy on day 1, buy on day 2 and sell them later, as you are engaging multiple transactions at the same time. You must sell before buying again.\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> prices = [7,6,4,3,1]\n<strong>Output:</strong> 0\n<strong>Explanation:</strong> In this case, no transaction is done, i.e. max profit = 0.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= prices.length &lt;= 10<sup>5</sup></code></li>\n\t<li><code>0 &lt;= prices[i] &lt;= 10<sup>5</sup></code></li>\n</ul>\n",
      "lcSlug": "best-time-to-buy-and-sell-stock-iii",
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
      "description": "You are given an integer array `prices` where `prices[i]` is the price of a given stock on the `ith` day, and an integer `k`.\n\nFind the maximum profit you can achieve. You may complete at most `k` transactions: i.e. you may buy at most `k` times and sell at most `k` times.\n\nNote: You may not engage in multiple transactions simultaneously (i.e., you must sell the stock before you buy again).\n\n \n\nExample 1:\n\nInput: k = 2, prices = [2,4,1]\nOutput: 2\nExplanation: Buy on day 1 (price = 2) and sell on day 2 (price = 4), profit = 4-2 = 2.\n\nExample 2:\n\nInput: k = 2, prices = [3,2,6,5,0,3]\nOutput: 7\nExplanation: Buy on day 2 (price = 2) and sell on day 3 (price = 6), profit = 6-2 = 4. Then buy on day 5 (price = 0) and sell on day 6 (price = 3), profit = 3-0 = 3.\n\n \n\nConstraints:\n\n\t• `1",
      "descriptionHtml": "<p>You are given an integer array <code>prices</code> where <code>prices[i]</code> is the price of a given stock on the <code>i<sup>th</sup></code> day, and an integer <code>k</code>.</p>\n\n<p>Find the maximum profit you can achieve. You may complete at most <code>k</code> transactions: i.e. you may buy at most <code>k</code> times and sell at most <code>k</code> times.</p>\n\n<p><strong>Note:</strong> You may not engage in multiple transactions simultaneously (i.e., you must sell the stock before you buy again).</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> k = 2, prices = [2,4,1]\n<strong>Output:</strong> 2\n<strong>Explanation:</strong> Buy on day 1 (price = 2) and sell on day 2 (price = 4), profit = 4-2 = 2.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> k = 2, prices = [3,2,6,5,0,3]\n<strong>Output:</strong> 7\n<strong>Explanation:</strong> Buy on day 2 (price = 2) and sell on day 3 (price = 6), profit = 6-2 = 4. Then buy on day 5 (price = 0) and sell on day 6 (price = 3), profit = 3-0 = 3.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= k &lt;= 100</code></li>\n\t<li><code>1 &lt;= prices.length &lt;= 1000</code></li>\n\t<li><code>0 &lt;= prices[i] &lt;= 1000</code></li>\n</ul>\n",
      "lcSlug": "best-time-to-buy-and-sell-stock-iv",
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
      "description": "You are given an array `prices` where `prices[i]` is the price of a given stock on the `ith` day.\n\nFind the maximum profit you can achieve. You may complete as many transactions as you like (i.e., buy one and sell one share of the stock multiple times) with the following restrictions:\n\n\t• After you sell your stock, you cannot buy stock on the next day (i.e., cooldown one day).\n\nNote: You may not engage in multiple transactions simultaneously (i.e., you must sell the stock before you buy again).\n\n \n\nExample 1:\n\nInput: prices = [1,2,3,0,2]\nOutput: 3\nExplanation: transactions = [buy, sell, cooldown, buy, sell]\n\nExample 2:\n\nInput: prices = [1]\nOutput: 0\n\n \n\nConstraints:\n\n\t• `1",
      "descriptionHtml": "<p>You are given an array <code>prices</code> where <code>prices[i]</code> is the price of a given stock on the <code>i<sup>th</sup></code> day.</p>\n\n<p>Find the maximum profit you can achieve. You may complete as many transactions as you like (i.e., buy one and sell one share of the stock multiple times) with the following restrictions:</p>\n\n<ul>\n\t<li>After you sell your stock, you cannot buy stock on the next day (i.e., cooldown one day).</li>\n</ul>\n\n<p><strong>Note:</strong> You may not engage in multiple transactions simultaneously (i.e., you must sell the stock before you buy again).</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> prices = [1,2,3,0,2]\n<strong>Output:</strong> 3\n<strong>Explanation:</strong> transactions = [buy, sell, cooldown, buy, sell]\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> prices = [1]\n<strong>Output:</strong> 0\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= prices.length &lt;= 5000</code></li>\n\t<li><code>0 &lt;= prices[i] &lt;= 1000</code></li>\n</ul>\n",
      "lcSlug": "best-time-to-buy-and-sell-stock-with-cooldown",
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
      "description": "You are given an array `prices` where `prices[i]` is the price of a given stock on the `ith` day, and an integer `fee` representing a transaction fee.\n\nFind the maximum profit you can achieve. You may complete as many transactions as you like, but you need to pay the transaction fee for each transaction.\n\nNote:\n\n\t• You may not engage in multiple transactions simultaneously (i.e., you must sell the stock before you buy again).\n• The transaction fee is only charged once for each stock purchase and sale.\n\n \n\nExample 1:\n\nInput: prices = [1,3,2,8,4,9], fee = 2\nOutput: 8\nExplanation: The maximum profit can be achieved by:\n- Buying at prices[0] = 1\n- Selling at prices[3] = 8\n- Buying at prices[4] = 4\n- Selling at prices[5] = 9\nThe total profit is ((8 - 1) - 2) + ((9 - 4) - 2) = 8.\n\nExample 2:\n\nInput: prices = [1,3,7,5,10,3], fee = 3\nOutput: 6\n\n \n\nConstraints:\n\n\t• `1 4`\n• `1 4`\n• `0 4`",
      "descriptionHtml": "<p>You are given an array <code>prices</code> where <code>prices[i]</code> is the price of a given stock on the <code>i<sup>th</sup></code> day, and an integer <code>fee</code> representing a transaction fee.</p>\n\n<p>Find the maximum profit you can achieve. You may complete as many transactions as you like, but you need to pay the transaction fee for each transaction.</p>\n\n<p><strong>Note:</strong></p>\n\n<ul>\n\t<li>You may not engage in multiple transactions simultaneously (i.e., you must sell the stock before you buy again).</li>\n\t<li>The transaction fee is only charged once for each stock purchase and sale.</li>\n</ul>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> prices = [1,3,2,8,4,9], fee = 2\n<strong>Output:</strong> 8\n<strong>Explanation:</strong> The maximum profit can be achieved by:\n- Buying at prices[0] = 1\n- Selling at prices[3] = 8\n- Buying at prices[4] = 4\n- Selling at prices[5] = 9\nThe total profit is ((8 - 1) - 2) + ((9 - 4) - 2) = 8.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> prices = [1,3,7,5,10,3], fee = 3\n<strong>Output:</strong> 6\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= prices.length &lt;= 5 * 10<sup>4</sup></code></li>\n\t<li><code>1 &lt;= prices[i] &lt; 5 * 10<sup>4</sup></code></li>\n\t<li><code>0 &lt;= fee &lt; 5 * 10<sup>4</sup></code></li>\n</ul>\n",
      "lcSlug": "best-time-to-buy-and-sell-stock-with-transaction-fee",
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
      "description": "You are given `n` balloons, indexed from `0` to `n - 1`. Each balloon is painted with a number on it represented by an array `nums`. You are asked to burst all the balloons.\n\nIf you burst the `ith` balloon, you will get `nums[i - 1] * nums[i] * nums[i + 1]` coins. If `i - 1` or `i + 1` goes out of bounds of the array, then treat it as if there is a balloon with a `1` painted on it.\n\nReturn the maximum coins you can collect by bursting the balloons wisely.\n\n \n\nExample 1:\n\nInput: nums = [3,1,5,8]\nOutput: 167\nExplanation:\nnums = [3,1,5,8] --> [3,5,8] --> [3,8] --> [8] --> []\ncoins =  3*1*5    +   3*5*8   +  1*3*8  + 1*8*1 = 167\n\nExample 2:\n\nInput: nums = [1,5]\nOutput: 10\n\n \n\nConstraints:\n\n\t• `n == nums.length`\n• `1",
      "descriptionHtml": "<p>You are given <code>n</code> balloons, indexed from <code>0</code> to <code>n - 1</code>. Each balloon is painted with a number on it represented by an array <code>nums</code>. You are asked to burst all the balloons.</p>\n\n<p>If you burst the <code>i<sup>th</sup></code> balloon, you will get <code>nums[i - 1] * nums[i] * nums[i + 1]</code> coins. If <code>i - 1</code> or <code>i + 1</code> goes out of bounds of the array, then treat it as if there is a balloon with a <code>1</code> painted on it.</p>\n\n<p>Return <em>the maximum coins you can collect by bursting the balloons wisely</em>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [3,1,5,8]\n<strong>Output:</strong> 167\n<strong>Explanation:</strong>\nnums = [3,1,5,8] --&gt; [3,5,8] --&gt; [3,8] --&gt; [8] --&gt; []\ncoins =  3*1*5    +   3*5*8   +  1*3*8  + 1*8*1 = 167</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [1,5]\n<strong>Output:</strong> 10\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>n == nums.length</code></li>\n\t<li><code>1 &lt;= n &lt;= 300</code></li>\n\t<li><code>0 &lt;= nums[i] &lt;= 100</code></li>\n</ul>\n",
      "lcSlug": "burst-balloons",
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
      "description": "Given a string `s`, partition `s` such that every substring of the partition is a palindrome.\n\nReturn the minimum cuts needed for a palindrome partitioning of `s`.\n\n \n\nExample 1:\n\nInput: s = \"aab\"\nOutput: 1\nExplanation: The palindrome partitioning [\"aa\",\"b\"] could be produced using 1 cut.\n\nExample 2:\n\nInput: s = \"a\"\nOutput: 0\n\nExample 3:\n\nInput: s = \"ab\"\nOutput: 1\n\n \n\nConstraints:\n\n\t• `1",
      "descriptionHtml": "<p>Given a string <code>s</code>, partition <code>s</code> such that every <span data-keyword=\"substring-nonempty\">substring</span> of the partition is a <span data-keyword=\"palindrome-string\">palindrome</span>.</p>\n\n<p>Return <em>the <strong>minimum</strong> cuts needed for a palindrome partitioning of</em> <code>s</code>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> s = &quot;aab&quot;\n<strong>Output:</strong> 1\n<strong>Explanation:</strong> The palindrome partitioning [&quot;aa&quot;,&quot;b&quot;] could be produced using 1 cut.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> s = &quot;a&quot;\n<strong>Output:</strong> 0\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> s = &quot;ab&quot;\n<strong>Output:</strong> 1\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= s.length &lt;= 2000</code></li>\n\t<li><code>s</code> consists of lowercase English letters only.</li>\n</ul>\n",
      "lcSlug": "palindrome-partitioning-ii",
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
      "description": "Given an array `arr` of positive integers, consider all binary trees such that:\n\n\t• Each node has either `0` or `2` children;\n• The values of `arr` correspond to the values of each leaf in an in-order traversal of the tree.\n• The value of each non-leaf node is equal to the product of the largest leaf value in its left and right subtree, respectively.\n\nAmong all possible binary trees considered, return the smallest possible sum of the values of each non-leaf node. It is guaranteed this sum fits into a 32-bit integer.\n\nA node is a leaf if and only if it has zero children.\n\n \n\nExample 1:\n\nInput: arr = [6,2,4]\nOutput: 32\nExplanation: There are two possible trees shown.\nThe first has a non-leaf node sum 36, and the second has non-leaf node sum 32.\n\nExample 2:\n\nInput: arr = [4,11]\nOutput: 44\n\n \n\nConstraints:\n\n\t• `2 31).",
      "descriptionHtml": "<p>Given an array <code>arr</code> of positive integers, consider all binary trees such that:</p>\n\n<ul>\n\t<li>Each node has either <code>0</code> or <code>2</code> children;</li>\n\t<li>The values of <code>arr</code> correspond to the values of each <strong>leaf</strong> in an in-order traversal of the tree.</li>\n\t<li>The value of each non-leaf node is equal to the product of the largest leaf value in its left and right subtree, respectively.</li>\n</ul>\n\n<p>Among all possible binary trees considered, return <em>the smallest possible sum of the values of each non-leaf node</em>. It is guaranteed this sum fits into a <strong>32-bit</strong> integer.</p>\n\n<p>A node is a <strong>leaf</strong> if and only if it has zero children.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2021/08/10/tree1.jpg\" style=\"width: 500px; height: 169px;\" />\n<pre>\n<strong>Input:</strong> arr = [6,2,4]\n<strong>Output:</strong> 32\n<strong>Explanation:</strong> There are two possible trees shown.\nThe first has a non-leaf node sum 36, and the second has non-leaf node sum 32.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2021/08/10/tree2.jpg\" style=\"width: 224px; height: 145px;\" />\n<pre>\n<strong>Input:</strong> arr = [4,11]\n<strong>Output:</strong> 44\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>2 &lt;= arr.length &lt;= 40</code></li>\n\t<li><code>1 &lt;= arr[i] &lt;= 15</code></li>\n\t<li>It is guaranteed that the answer fits into a <strong>32-bit</strong> signed integer (i.e., it is less than 2<sup>31</sup>).</li>\n</ul>\n",
      "lcSlug": "minimum-cost-tree-from-leaf-values",
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
      "description": "Alice and Bob take turns playing a game, with Alice starting first.\n\nThere are `n` stones arranged in a row. On each player's turn, they can remove either the leftmost stone or the rightmost stone from the row and receive points equal to the sum of the remaining stones' values in the row. The winner is the one with the higher score when there are no stones left to remove.\n\nBob found that he will always lose this game (poor Bob, he always loses), so he decided to minimize the score's difference. Alice's goal is to maximize the difference in the score.\n\nGiven an array of integers `stones` where `stones[i]` represents the value of the `ith` stone from the left, return the difference in Alice and Bob's score if they both play optimally.\n\n \n\nExample 1:\n\nInput: stones = [5,3,1,4,2]\nOutput: 6\nExplanation: \n- Alice removes 2 and gets 5 + 3 + 1 + 4 = 13 points. Alice = 13, Bob = 0, stones = [5,3,1,4].\n- Bob removes 5 and gets 3 + 1 + 4 = 8 points. Alice = 13, Bob = 8, stones = [3,1,4].\n- Alice removes 3 and gets 1 + 4 = 5 points. Alice = 18, Bob = 8, stones = [1,4].\n- Bob removes 1 and gets 4 points. Alice = 18, Bob = 12, stones = [4].\n- Alice removes 4 and gets 0 points. Alice = 18, Bob = 12, stones = [].\nThe score difference is 18 - 12 = 6.\n\nExample 2:\n\nInput: stones = [7,90,5,1,100,10,10,2]\nOutput: 122\n\n \n\nConstraints:\n\n\t• `n == stones.length`\n• `2",
      "descriptionHtml": "<p>Alice and Bob take turns playing a game, with <strong>Alice starting first</strong>.</p>\n\n<p>There are <code>n</code> stones arranged in a row. On each player&#39;s turn, they can <strong>remove</strong> either the leftmost stone or the rightmost stone from the row and receive points equal to the <strong>sum</strong> of the remaining stones&#39; values in the row. The winner is the one with the higher score when there are no stones left to remove.</p>\n\n<p>Bob found that he will always lose this game (poor Bob, he always loses), so he decided to <strong>minimize the score&#39;s difference</strong>. Alice&#39;s goal is to <strong>maximize the difference</strong> in the score.</p>\n\n<p>Given an array of integers <code>stones</code> where <code>stones[i]</code> represents the value of the <code>i<sup>th</sup></code> stone <strong>from the left</strong>, return <em>the <strong>difference</strong> in Alice and Bob&#39;s score if they both play <strong>optimally</strong>.</em></p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> stones = [5,3,1,4,2]\n<strong>Output:</strong> 6\n<strong>Explanation:</strong> \n- Alice removes 2 and gets 5 + 3 + 1 + 4 = 13 points. Alice = 13, Bob = 0, stones = [5,3,1,4].\n- Bob removes 5 and gets 3 + 1 + 4 = 8 points. Alice = 13, Bob = 8, stones = [3,1,4].\n- Alice removes 3 and gets 1 + 4 = 5 points. Alice = 18, Bob = 8, stones = [1,4].\n- Bob removes 1 and gets 4 points. Alice = 18, Bob = 12, stones = [4].\n- Alice removes 4 and gets 0 points. Alice = 18, Bob = 12, stones = [].\nThe score difference is 18 - 12 = 6.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> stones = [7,90,5,1,100,10,10,2]\n<strong>Output:</strong> 122</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>n == stones.length</code></li>\n\t<li><code>2 &lt;= n &lt;= 1000</code></li>\n\t<li><code>1 &lt;= stones[i] &lt;= 1000</code></li>\n</ul>\n",
      "lcSlug": "stone-game-vii",
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
      "description": "Traveling Salesman (TSP)",
      "summary": "Held-Karp bitmask DP"
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
      "description": "In the \"100 game\" two players take turns adding, to a running total, any integer from `1` to `10`. The player who first causes the running total to reach or exceed 100 wins.\n\nWhat if we change the game so that players cannot re-use integers?\n\nFor example, two players might take turns drawing from a common pool of numbers from 1 to 15 without replacement until they reach a total >= 100.\n\nGiven two integers `maxChoosableInteger` and `desiredTotal`, return `true` if the first player to move can force a win, otherwise, return `false`. Assume both players play optimally.\n\n \n\nExample 1:\n\nInput: maxChoosableInteger = 10, desiredTotal = 11\nOutput: false\nExplanation:\nNo matter which integer the first player choose, the first player will lose.\nThe first player can choose an integer from 1 up to 10.\nIf the first player choose 1, the second player can only choose integers from 2 up to 10.\nThe second player will win by choosing 10 and get a total = 11, which is >= desiredTotal.\nSame with other integers chosen by the first player, the second player will always win.\n\nExample 2:\n\nInput: maxChoosableInteger = 10, desiredTotal = 0\nOutput: true\n\nExample 3:\n\nInput: maxChoosableInteger = 10, desiredTotal = 1\nOutput: true\n\n \n\nConstraints:\n\n\t• `1",
      "descriptionHtml": "<p>In the &quot;100 game&quot; two players take turns adding, to a running total, any integer from <code>1</code> to <code>10</code>. The player who first causes the running total to <strong>reach or exceed</strong> 100 wins.</p>\n\n<p>What if we change the game so that players <strong>cannot</strong> re-use integers?</p>\n\n<p>For example, two players might take turns drawing from a common pool of numbers from 1 to 15 without replacement until they reach a total &gt;= 100.</p>\n\n<p>Given two integers <code>maxChoosableInteger</code> and <code>desiredTotal</code>, return <code>true</code> if the first player to move can force a win, otherwise, return <code>false</code>. Assume both players play <strong>optimally</strong>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> maxChoosableInteger = 10, desiredTotal = 11\n<strong>Output:</strong> false\n<strong>Explanation:</strong>\nNo matter which integer the first player choose, the first player will lose.\nThe first player can choose an integer from 1 up to 10.\nIf the first player choose 1, the second player can only choose integers from 2 up to 10.\nThe second player will win by choosing 10 and get a total = 11, which is &gt;= desiredTotal.\nSame with other integers chosen by the first player, the second player will always win.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> maxChoosableInteger = 10, desiredTotal = 0\n<strong>Output:</strong> true\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> maxChoosableInteger = 10, desiredTotal = 1\n<strong>Output:</strong> true\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= maxChoosableInteger &lt;= 20</code></li>\n\t<li><code>0 &lt;= desiredTotal &lt;= 300</code></li>\n</ul>\n",
      "lcSlug": "can-i-win",
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
      "description": "Given a string `s` and a dictionary of strings `wordDict`, add spaces in `s` to construct a sentence where each word is a valid dictionary word. Return all such possible sentences in any order.\n\nNote that the same word in the dictionary may be reused multiple times in the segmentation.\n\n \n\nExample 1:\n\nInput: s = \"catsanddog\", wordDict = [\"cat\",\"cats\",\"and\",\"sand\",\"dog\"]\nOutput: [\"cats and dog\",\"cat sand dog\"]\n\nExample 2:\n\nInput: s = \"pineapplepenapple\", wordDict = [\"apple\",\"pen\",\"applepen\",\"pine\",\"pineapple\"]\nOutput: [\"pine apple pen apple\",\"pineapple pen apple\",\"pine applepen apple\"]\nExplanation: Note that you are allowed to reuse a dictionary word.\n\nExample 3:\n\nInput: s = \"catsandog\", wordDict = [\"cats\",\"dog\",\"sand\",\"and\",\"cat\"]\nOutput: []\n\n \n\nConstraints:\n\n\t• `1 5.",
      "descriptionHtml": "<p>Given a string <code>s</code> and a dictionary of strings <code>wordDict</code>, add spaces in <code>s</code> to construct a sentence where each word is a valid dictionary word. Return all such possible sentences in <strong>any order</strong>.</p>\n\n<p><strong>Note</strong> that the same word in the dictionary may be reused multiple times in the segmentation.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> s = &quot;catsanddog&quot;, wordDict = [&quot;cat&quot;,&quot;cats&quot;,&quot;and&quot;,&quot;sand&quot;,&quot;dog&quot;]\n<strong>Output:</strong> [&quot;cats and dog&quot;,&quot;cat sand dog&quot;]\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> s = &quot;pineapplepenapple&quot;, wordDict = [&quot;apple&quot;,&quot;pen&quot;,&quot;applepen&quot;,&quot;pine&quot;,&quot;pineapple&quot;]\n<strong>Output:</strong> [&quot;pine apple pen apple&quot;,&quot;pineapple pen apple&quot;,&quot;pine applepen apple&quot;]\n<strong>Explanation:</strong> Note that you are allowed to reuse a dictionary word.\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> s = &quot;catsandog&quot;, wordDict = [&quot;cats&quot;,&quot;dog&quot;,&quot;sand&quot;,&quot;and&quot;,&quot;cat&quot;]\n<strong>Output:</strong> []\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= s.length &lt;= 20</code></li>\n\t<li><code>1 &lt;= wordDict.length &lt;= 1000</code></li>\n\t<li><code>1 &lt;= wordDict[i].length &lt;= 10</code></li>\n\t<li><code>s</code> and <code>wordDict[i]</code> consist of only lowercase English letters.</li>\n\t<li>All the strings of <code>wordDict</code> are <strong>unique</strong>.</li>\n\t<li>Input is generated in a way that the length of the answer doesn&#39;t exceed&nbsp;10<sup>5</sup>.</li>\n</ul>\n",
      "lcSlug": "word-break-ii",
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
      "description": "Given an input string `s` and a pattern `p`, implement regular expression matching with support for `'.'` and `'*'` where:\n\n\t• `'.'` Matches any single character.​​​​\n• `'*'` Matches zero or more of the preceding element.\n\nReturn a boolean indicating whether the matching covers the entire input string (not partial).\n\n \n\nExample 1:\n\nInput: s = \"aa\", p = \"a\"\nOutput: false\nExplanation: \"a\" does not match the entire string \"aa\".\n\nExample 2:\n\nInput: s = \"aa\", p = \"a*\"\nOutput: true\nExplanation: '*' means zero or more of the preceding element, 'a'. Therefore, by repeating 'a' once, it becomes \"aa\".\n\nExample 3:\n\nInput: s = \"ab\", p = \".*\"\nOutput: true\nExplanation: \".*\" means \"zero or more (*) of any character (.)\".\n\n \n\nConstraints:\n\n\t• `1",
      "descriptionHtml": "<p>Given an input string <code>s</code>&nbsp;and a pattern <code>p</code>, implement regular expression matching with support for <code>&#39;.&#39;</code> and <code>&#39;*&#39;</code> where:</p>\n\n<ul>\n\t<li><code>&#39;.&#39;</code> Matches any single character.​​​​</li>\n\t<li><code>&#39;*&#39;</code> Matches zero or more of the preceding element.</li>\n</ul>\n\n<p>Return a boolean indicating whether the matching covers the entire input string (not partial).</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> s = &quot;aa&quot;, p = &quot;a&quot;\n<strong>Output:</strong> false\n<strong>Explanation:</strong> &quot;a&quot; does not match the entire string &quot;aa&quot;.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> s = &quot;aa&quot;, p = &quot;a*&quot;\n<strong>Output:</strong> true\n<strong>Explanation:</strong> &#39;*&#39; means zero or more of the preceding element, &#39;a&#39;. Therefore, by repeating &#39;a&#39; once, it becomes &quot;aa&quot;.\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> s = &quot;ab&quot;, p = &quot;.*&quot;\n<strong>Output:</strong> true\n<strong>Explanation:</strong> &quot;.*&quot; means &quot;zero or more (*) of any character (.)&quot;.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= s.length&nbsp;&lt;= 20</code></li>\n\t<li><code>1 &lt;= p.length&nbsp;&lt;= 20</code></li>\n\t<li><code>s</code> contains only lowercase English letters.</li>\n\t<li><code>p</code> contains only lowercase English letters, <code>&#39;.&#39;</code>, and&nbsp;<code>&#39;*&#39;</code>.</li>\n\t<li>It is guaranteed for each appearance of the character <code>&#39;*&#39;</code>, there will be a previous valid character to match.</li>\n</ul>\n",
      "lcSlug": "regular-expression-matching",
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
      "description": "Given strings `s1`, `s2`, and `s3`, find whether `s3` is formed by an interleaving of `s1` and `s2`.\n\nAn interleaving of two strings `s` and `t` is a configuration where `s` and `t` are divided into `n` and `m` substrings respectively, such that:\n\n\t• `s = s1 + s2 + ... + sn`\n• `t = t1 + t2 + ... + tm`\n• `|n - m| 1 + t1 + s2 + t2 + s3 + t3 + ...` or `t1 + s1 + t2 + s2 + t3 + s3 + ...`\n\nNote: `a + b` is the concatenation of strings `a` and `b`.\n\n \n\nExample 1:\n\nInput: s1 = \"aabcc\", s2 = \"dbbca\", s3 = \"aadbbcbcac\"\nOutput: true\nExplanation: One way to obtain s3 is:\nSplit s1 into s1 = \"aa\" + \"bc\" + \"c\", and s2 into s2 = \"dbbc\" + \"a\".\nInterleaving the two splits, we get \"aa\" + \"dbbc\" + \"bc\" + \"a\" + \"c\" = \"aadbbcbcac\".\nSince s3 can be obtained by interleaving s1 and s2, we return true.\n\nExample 2:\n\nInput: s1 = \"aabcc\", s2 = \"dbbca\", s3 = \"aadbbbaccc\"\nOutput: false\nExplanation: Notice how it is impossible to interleave s2 with any other string to obtain s3.\n\nExample 3:\n\nInput: s1 = \"\", s2 = \"\", s3 = \"\"\nOutput: true\n\n \n\nConstraints:\n\n\t• `0 \n\n \n\nFollow up: Could you solve it using only `O(s2.length)` additional memory space?",
      "descriptionHtml": "<p>Given strings <code>s1</code>, <code>s2</code>, and <code>s3</code>, find whether <code>s3</code> is formed by an <strong>interleaving</strong> of <code>s1</code> and <code>s2</code>.</p>\n\n<p>An <strong>interleaving</strong> of two strings <code>s</code> and <code>t</code> is a configuration where <code>s</code> and <code>t</code> are divided into <code>n</code> and <code>m</code> <span data-keyword=\"substring-nonempty\">substrings</span> respectively, such that:</p>\n\n<ul>\n\t<li><code>s = s<sub>1</sub> + s<sub>2</sub> + ... + s<sub>n</sub></code></li>\n\t<li><code>t = t<sub>1</sub> + t<sub>2</sub> + ... + t<sub>m</sub></code></li>\n\t<li><code>|n - m| &lt;= 1</code></li>\n\t<li>The <strong>interleaving</strong> is <code>s<sub>1</sub> + t<sub>1</sub> + s<sub>2</sub> + t<sub>2</sub> + s<sub>3</sub> + t<sub>3</sub> + ...</code> or <code>t<sub>1</sub> + s<sub>1</sub> + t<sub>2</sub> + s<sub>2</sub> + t<sub>3</sub> + s<sub>3</sub> + ...</code></li>\n</ul>\n\n<p><strong>Note:</strong> <code>a + b</code> is the concatenation of strings <code>a</code> and <code>b</code>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2020/09/02/interleave.jpg\" style=\"width: 561px; height: 203px;\" />\n<pre>\n<strong>Input:</strong> s1 = &quot;aabcc&quot;, s2 = &quot;dbbca&quot;, s3 = &quot;aadbbcbcac&quot;\n<strong>Output:</strong> true\n<strong>Explanation:</strong> One way to obtain s3 is:\nSplit s1 into s1 = &quot;aa&quot; + &quot;bc&quot; + &quot;c&quot;, and s2 into s2 = &quot;dbbc&quot; + &quot;a&quot;.\nInterleaving the two splits, we get &quot;aa&quot; + &quot;dbbc&quot; + &quot;bc&quot; + &quot;a&quot; + &quot;c&quot; = &quot;aadbbcbcac&quot;.\nSince s3 can be obtained by interleaving s1 and s2, we return true.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> s1 = &quot;aabcc&quot;, s2 = &quot;dbbca&quot;, s3 = &quot;aadbbbaccc&quot;\n<strong>Output:</strong> false\n<strong>Explanation:</strong> Notice how it is impossible to interleave s2 with any other string to obtain s3.\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> s1 = &quot;&quot;, s2 = &quot;&quot;, s3 = &quot;&quot;\n<strong>Output:</strong> true\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>0 &lt;= s1.length, s2.length &lt;= 100</code></li>\n\t<li><code>0 &lt;= s3.length &lt;= 200</code></li>\n\t<li><code>s1</code>, <code>s2</code>, and <code>s3</code> consist of lowercase English letters.</li>\n</ul>\n\n<p>&nbsp;</p>\n<p><strong>Follow up:</strong> Could you solve it using only <code>O(s2.length)</code> additional memory space?</p>\n",
      "lcSlug": "interleaving-string",
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
      "description": "You are given a 0-indexed array of integers `nums` of length `n`. You are initially positioned at index 0.\n\nEach element `nums[i]` represents the maximum length of a forward jump from index `i`. In other words, if you are at index `i`, you can jump to any index `(i + j)` where:\n\n\t• `0 \n\nReturn the minimum number of jumps to reach index `n - 1`. The test cases are generated such that you can reach index `n - 1`.\n\n \n\nExample 1:\n\nInput: nums = [2,3,1,1,4]\nOutput: 2\nExplanation: The minimum number of jumps to reach the last index is 2. Jump 1 step from index 0 to 1, then 3 steps to the last index.\n\nExample 2:\n\nInput: nums = [2,3,0,1,4]\nOutput: 2\n\n \n\nConstraints:\n\n\t• `1 4`\n• `0",
      "descriptionHtml": "<p>You are given a <strong>0-indexed</strong> array of integers <code>nums</code> of length <code>n</code>. You are initially positioned at&nbsp;index 0.</p>\n\n<p>Each element <code>nums[i]</code> represents the maximum length of a forward jump from index <code>i</code>. In other words, if you are at index <code>i</code>, you can jump to any index <code>(i + j)</code>&nbsp;where:</p>\n\n<ul>\n\t<li><code>0 &lt;= j &lt;= nums[i]</code> and</li>\n\t<li><code>i + j &lt; n</code></li>\n</ul>\n\n<p>Return <em>the minimum number of jumps to reach index </em><code>n - 1</code>. The test cases are generated such that you can reach index&nbsp;<code>n - 1</code>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [2,3,1,1,4]\n<strong>Output:</strong> 2\n<strong>Explanation:</strong> The minimum number of jumps to reach the last index is 2. Jump 1 step from index 0 to 1, then 3 steps to the last index.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [2,3,0,1,4]\n<strong>Output:</strong> 2\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= nums.length &lt;= 10<sup>4</sup></code></li>\n\t<li><code>0 &lt;= nums[i] &lt;= 1000</code></li>\n\t<li>It&#39;s guaranteed that you can reach <code>nums[n - 1]</code>.</li>\n</ul>\n",
      "lcSlug": "jump-game-ii",
      "summary": "Greedy BFS layers — 1D DP: define state on index i, transition from i-1 or earlier."
    }
  ]
};
