window.PRACTICE_TOPIC = {
  "id": "backtracking",
  "title": "Backtracking",
  "expected_count": 28,
  "strategy": "<strong>Speed-run:</strong> One skeleton: choose / explore / unchoose. Prune early. Filter <em>Must do</em> first.",
  "subtopics": [
    {
      "id": "subsets",
      "label": "Subsets"
    },
    {
      "id": "permutations",
      "label": "Permutations"
    },
    {
      "id": "combinations",
      "label": "Combinations"
    },
    {
      "id": "grid",
      "label": "Grid"
    },
    {
      "id": "constraint",
      "label": "Constraint"
    },
    {
      "id": "string",
      "label": "String"
    }
  ],
  "questions": [
    {
      "id": "bt-01",
      "title": "Subsets",
      "lc": 78,
      "importance": "must",
      "subtopic": "subsets",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums",
          "out": "all subsets"
        }
      ],
      "approaches": [
        {
          "name": "Backtrack subsets",
          "time": "O(n*2^n)",
          "space": "O(n)",
          "code": "void dfs(int i, vector<int>& nums, vector<int>& cur, vector<vector<int>>& ans) {\n    if (i == (int)nums.size()) { ans.push_back(cur); return; }\n    dfs(i+1, nums, cur, ans);\n    cur.push_back(nums[i]); dfs(i+1, nums, cur, ans); cur.pop_back();\n}\nvector<vector<int>> subsets(vector<int>& nums) {\n    vector<vector<int>> ans; vector<int> cur; dfs(0, nums, cur, ans); return ans;\n}"
        }
      ],
      "description": "Given an integer array `nums` of unique elements, return all possible subsets (the power set).\n\nThe solution set must not contain duplicate subsets. Return the solution in any order.\n\n \n\nExample 1:\n\nInput: nums = [1,2,3]\nOutput: [[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]\n\nExample 2:\n\nInput: nums = [0]\nOutput: [[],[0]]\n\n \n\nConstraints:\n\n\t• `1",
      "descriptionHtml": "<p>Given an integer array <code>nums</code> of <strong>unique</strong> elements, return <em>all possible</em> <span data-keyword=\"subset\"><em>subsets</em></span> <em>(the power set)</em>.</p>\n\n<p>The solution set <strong>must not</strong> contain duplicate subsets. Return the solution in <strong>any order</strong>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [1,2,3]\n<strong>Output:</strong> [[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [0]\n<strong>Output:</strong> [[],[0]]\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= nums.length &lt;= 10</code></li>\n\t<li><code>-10 &lt;= nums[i] &lt;= 10</code></li>\n\t<li>All the numbers of&nbsp;<code>nums</code> are <strong>unique</strong>.</li>\n</ul>\n",
      "lcSlug": "subsets",
      "summary": "dfs(i): skip i or pick i — save when i==n."
    },
    {
      "id": "bt-02",
      "title": "Subsets II",
      "lc": 90,
      "importance": "must",
      "subtopic": "subsets",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums with dups",
          "out": "unique subsets"
        }
      ],
      "approaches": [
        {
          "name": "Subsets II",
          "time": "O(n*2^n)",
          "space": "O(n)",
          "code": "void dfs(int i, vector<int>& nums, vector<int>& path, vector<vector<int>>& ans) {\n    if (i==(int)nums.size()) { ans.push_back(path); return; }\n    dfs(i+1,nums,path,ans);\n    path.push_back(nums[i]); dfs(i+1,nums,path,ans); path.pop_back();\n    while (i+1<(int)nums.size() && nums[i+1]==nums[i]) i++;\n}\nvector<vector<int>> subsetsWithDup(vector<int>& nums) {\n    sort(nums.begin(), nums.end()); vector<vector<int>> ans; vector<int> path;\n    dfs(0,nums,path,ans); return ans;\n}"
        }
      ],
      "description": "Given an integer array `nums` that may contain duplicates, return all possible subsets (the power set).\n\nThe solution set must not contain duplicate subsets. Return the solution in any order.\n\n \n\nExample 1:\n\nInput: nums = [1,2,2]\nOutput: [[],[1],[1,2],[1,2,2],[2],[2,2]]\n\nExample 2:\n\nInput: nums = [0]\nOutput: [[],[0]]\n\n \n\nConstraints:\n\n\t• `1",
      "descriptionHtml": "<p>Given an integer array <code>nums</code> that may contain duplicates, return <em>all possible</em> <span data-keyword=\"subset\"><em>subsets</em></span><em> (the power set)</em>.</p>\n\n<p>The solution set <strong>must not</strong> contain duplicate subsets. Return the solution in <strong>any order</strong>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<pre><strong>Input:</strong> nums = [1,2,2]\n<strong>Output:</strong> [[],[1],[1,2],[1,2,2],[2],[2,2]]\n</pre><p><strong class=\"example\">Example 2:</strong></p>\n<pre><strong>Input:</strong> nums = [0]\n<strong>Output:</strong> [[],[0]]\n</pre>\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= nums.length &lt;= 10</code></li>\n\t<li><code>-10 &lt;= nums[i] &lt;= 10</code></li>\n</ul>\n",
      "lcSlug": "subsets-ii",
      "summary": "Subsets II — state invariant, then loop."
    },
    {
      "id": "bt-03",
      "title": "Permutations",
      "lc": 46,
      "importance": "must",
      "subtopic": "permutations",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums",
          "out": "all perms"
        }
      ],
      "approaches": [
        {
          "name": "Backtrack permutations",
          "time": "O(n*n!)",
          "space": "O(n)",
          "code": "void dfs(vector<int>& nums, vector<int>& path, vector<int>& used, vector<vector<int>>& ans) {\n    if ((int)path.size() == (int)nums.size()) { ans.push_back(path); return; }\n    for (int i = 0; i < (int)nums.size(); i++) if (!used[i]) {\n        used[i]=1; path.push_back(nums[i]); dfs(nums, path, used, ans);\n        path.pop_back(); used[i]=0;\n    }\n}\nvector<vector<int>> permute(vector<int>& nums) {\n    vector<vector<int>> ans; vector<int> path, used(nums.size());\n    dfs(nums, path, used, ans); return ans;\n}"
        }
      ],
      "description": "Given an array `nums` of distinct integers, return all the possible permutations. You can return the answer in any order.\n\n \n\nExample 1:\n\nInput: nums = [1,2,3]\nOutput: [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]\n\nExample 2:\n\nInput: nums = [0,1]\nOutput: [[0,1],[1,0]]\n\nExample 3:\n\nInput: nums = [1]\nOutput: [[1]]\n\n \n\nConstraints:\n\n\t• `1",
      "descriptionHtml": "<p>Given an array <code>nums</code> of distinct integers, return all the possible <span data-keyword=\"permutation-array\">permutations</span>. You can return the answer in <strong>any order</strong>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<pre><strong>Input:</strong> nums = [1,2,3]\n<strong>Output:</strong> [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]\n</pre><p><strong class=\"example\">Example 2:</strong></p>\n<pre><strong>Input:</strong> nums = [0,1]\n<strong>Output:</strong> [[0,1],[1,0]]\n</pre><p><strong class=\"example\">Example 3:</strong></p>\n<pre><strong>Input:</strong> nums = [1]\n<strong>Output:</strong> [[1]]\n</pre>\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= nums.length &lt;= 6</code></li>\n\t<li><code>-10 &lt;= nums[i] &lt;= 10</code></li>\n\t<li>All the integers of <code>nums</code> are <strong>unique</strong>.</li>\n</ul>\n",
      "lcSlug": "permutations",
      "summary": "Pick unused element, recurse, unpick — save at full path."
    },
    {
      "id": "bt-04",
      "title": "Permutations II",
      "lc": 47,
      "importance": "should",
      "subtopic": "permutations",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "dups",
          "out": "unique perms"
        }
      ],
      "approaches": [
        {
          "name": "Permutations II",
          "time": "O(n*n!)",
          "space": "O(n)",
          "code": "void dfs(vector<int>& nums, vector<int>& path, vector<int>& used, vector<vector<int>>& ans) {\n    if ((int)path.size()==(int)nums.size()) { ans.push_back(path); return; }\n    for (int i=0;i<(int)nums.size();i++) {\n        if (used[i] || (i && nums[i]==nums[i-1] && !used[i-1])) continue;\n        used[i]=1; path.push_back(nums[i]); dfs(nums,path,used,ans); path.pop_back(); used[i]=0;\n    }\n}\nvector<vector<int>> permuteUnique(vector<int>& nums) {\n    sort(nums.begin(), nums.end()); vector<vector<int>> ans; vector<int> path, used(nums.size());\n    dfs(nums,path,used,ans); return ans;\n}"
        }
      ],
      "description": "Given a collection of numbers, `nums`, that might contain duplicates, return all possible unique permutations in any order.\n\n \n\nExample 1:\n\nInput: nums = [1,1,2]\nOutput:\n[[1,1,2],\n [1,2,1],\n [2,1,1]]\n\nExample 2:\n\nInput: nums = [1,2,3]\nOutput: [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]\n\n \n\nConstraints:\n\n\t• `1",
      "descriptionHtml": "<p>Given a collection of numbers, <code>nums</code>,&nbsp;that might contain duplicates, return <em>all possible unique permutations <strong>in any order</strong>.</em></p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [1,1,2]\n<strong>Output:</strong>\n[[1,1,2],\n [1,2,1],\n [2,1,1]]\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [1,2,3]\n<strong>Output:</strong> [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= nums.length &lt;= 8</code></li>\n\t<li><code>-10 &lt;= nums[i] &lt;= 10</code></li>\n</ul>\n",
      "lcSlug": "permutations-ii",
      "summary": "Permutations II — state invariant, then loop."
    },
    {
      "id": "bt-05",
      "title": "Combinations",
      "lc": 77,
      "importance": "must",
      "subtopic": "combinations",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "n, k",
          "out": "combinations"
        }
      ],
      "approaches": [
        {
          "name": "Backtrack nCk",
          "time": "O(k*C(n,k))",
          "space": "O(k)",
          "code": "void dfs(int start, int k, int n, vector<int>& path, vector<vector<int>>& ans) {\n    if ((int)path.size()==k) { ans.push_back(path); return; }\n    for (int i=start; i<=n; i++) { path.push_back(i); dfs(i+1,k,n,path,ans); path.pop_back(); }\n}\nvector<vector<int>> combine(int n, int k) {\n    vector<vector<int>> ans; vector<int> path; dfs(1,k,n,path,ans); return ans;\n}"
        }
      ],
      "description": "Given two integers `n` and `k`, return all possible combinations of `k` numbers chosen from the range `[1, n]`.\n\nYou may return the answer in any order.\n\n \n\nExample 1:\n\nInput: n = 4, k = 2\nOutput: [[1,2],[1,3],[1,4],[2,3],[2,4],[3,4]]\nExplanation: There are 4 choose 2 = 6 total combinations.\nNote that combinations are unordered, i.e., [1,2] and [2,1] are considered to be the same combination.\n\nExample 2:\n\nInput: n = 1, k = 1\nOutput: [[1]]\nExplanation: There is 1 choose 1 = 1 total combination.\n\n \n\nConstraints:\n\n\t• `1",
      "descriptionHtml": "<p>Given two integers <code>n</code> and <code>k</code>, return <em>all possible combinations of</em> <code>k</code> <em>numbers chosen from the range</em> <code>[1, n]</code>.</p>\n\n<p>You may return the answer in <strong>any order</strong>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> n = 4, k = 2\n<strong>Output:</strong> [[1,2],[1,3],[1,4],[2,3],[2,4],[3,4]]\n<strong>Explanation:</strong> There are 4 choose 2 = 6 total combinations.\nNote that combinations are unordered, i.e., [1,2] and [2,1] are considered to be the same combination.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> n = 1, k = 1\n<strong>Output:</strong> [[1]]\n<strong>Explanation:</strong> There is 1 choose 1 = 1 total combination.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= n &lt;= 20</code></li>\n\t<li><code>1 &lt;= k &lt;= n</code></li>\n</ul>\n",
      "lcSlug": "combinations",
      "summary": "Backtrack nCk — state invariant, then loop."
    },
    {
      "id": "bt-06",
      "title": "Combination Sum",
      "lc": 39,
      "importance": "must",
      "subtopic": "combinations",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "candidates, target",
          "out": "combos"
        }
      ],
      "approaches": [
        {
          "name": "Backtrack combo",
          "time": "O(2^t)",
          "space": "O(t)",
          "code": "void dfs(int i, int rem, vector<int>& cand, vector<int>& path, vector<vector<int>>& ans) {\n    if (!rem) { ans.push_back(path); return; }\n    if (i==(int)cand.size()) return;\n    dfs(i+1, rem, cand, path, ans);\n    if (cand[i] <= rem) { path.push_back(cand[i]); dfs(i, rem-cand[i], cand, path, ans); path.pop_back(); }\n}\nvector<vector<int>> combinationSum(vector<int>& candidates, int target) {\n    vector<vector<int>> ans; vector<int> path; dfs(0,target,candidates,path,ans); return ans;\n}"
        }
      ],
      "description": "Given an array of distinct integers `candidates` and a target integer `target`, return a list of all unique combinations of `candidates` where the chosen numbers sum to `target`. You may return the combinations in any order.\n\nThe same number may be chosen from `candidates` an unlimited number of times. Two combinations are unique if the frequency of at least one of the chosen numbers is different.\n\nThe test cases are generated such that the number of unique combinations that sum up to `target` is less than `150` combinations for the given input.\n\n \n\nExample 1:\n\nInput: candidates = [2,3,6,7], target = 7\nOutput: [[2,2,3],[7]]\nExplanation:\n2 and 3 are candidates, and 2 + 2 + 3 = 7. Note that 2 can be used multiple times.\n7 is a candidate, and 7 = 7.\nThese are the only two combinations.\n\nExample 2:\n\nInput: candidates = [2,3,5], target = 8\nOutput: [[2,2,2,2],[2,3,3],[3,5]]\n\nExample 3:\n\nInput: candidates = [2], target = 1\nOutput: []\n\n \n\nConstraints:\n\n\t• `1",
      "descriptionHtml": "<p>Given an array of <strong>distinct</strong> integers <code>candidates</code> and a target integer <code>target</code>, return <em>a list of all <strong>unique combinations</strong> of </em><code>candidates</code><em> where the chosen numbers sum to </em><code>target</code><em>.</em> You may return the combinations in <strong>any order</strong>.</p>\n\n<p>The <strong>same</strong> number may be chosen from <code>candidates</code> an <strong>unlimited number of times</strong>. Two combinations are unique if the <span data-keyword=\"frequency-array\">frequency</span> of at least one of the chosen numbers is different.</p>\n\n<p>The test cases are generated such that the number of unique combinations that sum up to <code>target</code> is less than <code>150</code> combinations for the given input.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> candidates = [2,3,6,7], target = 7\n<strong>Output:</strong> [[2,2,3],[7]]\n<strong>Explanation:</strong>\n2 and 3 are candidates, and 2 + 2 + 3 = 7. Note that 2 can be used multiple times.\n7 is a candidate, and 7 = 7.\nThese are the only two combinations.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> candidates = [2,3,5], target = 8\n<strong>Output:</strong> [[2,2,2,2],[2,3,3],[3,5]]\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> candidates = [2], target = 1\n<strong>Output:</strong> []\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= candidates.length &lt;= 30</code></li>\n\t<li><code>2 &lt;= candidates[i] &lt;= 40</code></li>\n\t<li>All elements of <code>candidates</code> are <strong>distinct</strong>.</li>\n\t<li><code>1 &lt;= target &lt;= 40</code></li>\n</ul>\n",
      "lcSlug": "combination-sum",
      "summary": "Backtrack combo — state invariant, then loop."
    },
    {
      "id": "bt-07",
      "title": "Combination Sum II",
      "lc": 40,
      "importance": "should",
      "subtopic": "combinations",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "dups",
          "out": "combos once"
        }
      ],
      "approaches": [
        {
          "name": "Sort + backtrack",
          "time": "O(2^n)",
          "space": "O(n)",
          "code": "vector<vector<int>> combinationSum2(vector<int>& c, int target) {\n    sort(c.begin(), c.end());\n    vector<vector<int>> ans, cur;\n    function<void(int,int)> dfs = [&](int i, int rem) {\n        if (rem == 0) { ans.push_back(cur); return; }\n        for (int j = i; j < (int)c.size(); j++) {\n            if (j > i && c[j] == c[j-1]) continue;\n            if (c[j] > rem) break;\n            cur.push_back(c[j]); dfs(j+1, rem-c[j]); cur.pop_back();\n        }\n    };\n    dfs(0, target); return ans;\n}"
        }
      ],
      "description": "Given a collection of candidate numbers (`candidates`) and a target number (`target`), find all unique combinations in `candidates` where the candidate numbers sum to `target`.\n\nEach number in `candidates` may only be used once in the combination.\n\nNote: The solution set must not contain duplicate combinations.\n\n \n\nExample 1:\n\nInput: candidates = [10,1,2,7,6,1,5], target = 8\nOutput: \n[\n[1,1,6],\n[1,2,5],\n[1,7],\n[2,6]\n]\n\nExample 2:\n\nInput: candidates = [2,5,2,1,2], target = 5\nOutput: \n[\n[1,2,2],\n[5]\n]\n\n \n\nConstraints:\n\n\t• `1",
      "descriptionHtml": "<p>Given a collection of candidate numbers (<code>candidates</code>) and a target number (<code>target</code>), find all unique combinations in <code>candidates</code>&nbsp;where the candidate numbers sum to <code>target</code>.</p>\n\n<p>Each number in <code>candidates</code>&nbsp;may only be used <strong>once</strong> in the combination.</p>\n\n<p><strong>Note:</strong>&nbsp;The solution set must not contain duplicate combinations.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> candidates = [10,1,2,7,6,1,5], target = 8\n<strong>Output:</strong> \n[\n[1,1,6],\n[1,2,5],\n[1,7],\n[2,6]\n]\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> candidates = [2,5,2,1,2], target = 5\n<strong>Output:</strong> \n[\n[1,2,2],\n[5]\n]\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;=&nbsp;candidates.length &lt;= 100</code></li>\n\t<li><code>1 &lt;=&nbsp;candidates[i] &lt;= 50</code></li>\n\t<li><code>1 &lt;= target &lt;= 30</code></li>\n</ul>\n",
      "lcSlug": "combination-sum-ii",
      "summary": "Sort + backtrack — state invariant, then loop."
    },
    {
      "id": "bt-08",
      "title": "Combination Sum III",
      "lc": 216,
      "importance": "nice",
      "subtopic": "combinations",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "k, n",
          "out": "combos sum n"
        }
      ],
      "approaches": [
        {
          "name": "Backtrack k numbers sum n",
          "time": "O(C(n,k))",
          "space": "O(k)",
          "code": "void dfs(int start,int k,int rem,vector<int>& path,vector<vector<int>>& ans){\n    if(!rem && !k){ ans.push_back(path); return; }\n    if(k<=0||rem<=0||start>9) return;\n    for(int i=start;i<=9;i++) if(i<=rem){ path.push_back(i); dfs(i+1,k-1,rem-i,path,ans); path.pop_back(); }\n}\nvector<vector<int>> combinationSum3(int k,int n){ vector<vector<int>> ans; vector<int> p; dfs(1,k,n,p,ans); return ans; }"
        }
      ],
      "description": "Find all valid combinations of `k` numbers that sum up to `n` such that the following conditions are true:\n\n\t• Only numbers `1` through `9` are used.\n• Each number is used at most once.\n\nReturn a list of all possible valid combinations. The list must not contain the same combination twice, and the combinations may be returned in any order.\n\n \n\nExample 1:\n\nInput: k = 3, n = 7\nOutput: [[1,2,4]]\nExplanation:\n1 + 2 + 4 = 7\nThere are no other valid combinations.\n\nExample 2:\n\nInput: k = 3, n = 9\nOutput: [[1,2,6],[1,3,5],[2,3,4]]\nExplanation:\n1 + 2 + 6 = 9\n1 + 3 + 5 = 9\n2 + 3 + 4 = 9\nThere are no other valid combinations.\n\nExample 3:\n\nInput: k = 4, n = 1\nOutput: []\nExplanation: There are no valid combinations.\nUsing 4 different numbers in the range [1,9], the smallest sum we can get is 1+2+3+4 = 10 and since 10 > 1, there are no valid combination.\n\n \n\nConstraints:\n\n\t• `2",
      "descriptionHtml": "<p>Find all valid combinations of <code>k</code> numbers that sum up to <code>n</code> such that the following conditions are true:</p>\n\n<ul>\n\t<li>Only numbers <code>1</code> through <code>9</code> are used.</li>\n\t<li>Each number is used <strong>at most once</strong>.</li>\n</ul>\n\n<p>Return <em>a list of all possible valid combinations</em>. The list must not contain the same combination twice, and the combinations may be returned in any order.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> k = 3, n = 7\n<strong>Output:</strong> [[1,2,4]]\n<strong>Explanation:</strong>\n1 + 2 + 4 = 7\nThere are no other valid combinations.</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> k = 3, n = 9\n<strong>Output:</strong> [[1,2,6],[1,3,5],[2,3,4]]\n<strong>Explanation:</strong>\n1 + 2 + 6 = 9\n1 + 3 + 5 = 9\n2 + 3 + 4 = 9\nThere are no other valid combinations.\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> k = 4, n = 1\n<strong>Output:</strong> []\n<strong>Explanation:</strong> There are no valid combinations.\nUsing 4 different numbers in the range [1,9], the smallest sum we can get is 1+2+3+4 = 10 and since 10 &gt; 1, there are no valid combination.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>2 &lt;= k &lt;= 9</code></li>\n\t<li><code>1 &lt;= n &lt;= 60</code></li>\n</ul>\n",
      "lcSlug": "combination-sum-iii",
      "summary": "Backtrack k numbers sum n — state invariant, then loop."
    },
    {
      "id": "bt-09",
      "title": "Letter Combinations of Phone Number",
      "lc": 17,
      "importance": "should",
      "subtopic": "string",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "digits",
          "out": "strings"
        }
      ],
      "approaches": [
        {
          "name": "Phone backtrack",
          "time": "O(4^n)",
          "space": "O(n)",
          "code": "void dfs(string& digits, int i, string& path, vector<string>& ans, vector<string>& map) {\n    if (i==(int)digits.size()) { ans.push_back(path); return; }\n    for (char c : map[digits[i]-'2']) { path.push_back(c); dfs(digits,i+1,path,ans,map); path.pop_back(); }\n}\nvector<string> letterCombinations(string digits) {\n    if (digits.empty()) return {};\n    vector<string> map={\"\",\"\",\"abc\",\"def\",\"ghi\",\"jkl\",\"mno\",\"pqrs\",\"tuv\",\"wxyz\"}, ans, path;\n    dfs(digits,0,path,ans,map); return ans;\n}"
        }
      ],
      "description": "Given a string containing digits from `2-9` inclusive, return all possible letter combinations that the number could represent. Return the answer in any order.\n\nA mapping of digits to letters (just like on the telephone buttons) is given below. Note that 1 does not map to any letters.\n\n \n\nExample 1:\n\nInput: digits = \"23\"\nOutput: [\"ad\",\"ae\",\"af\",\"bd\",\"be\",\"bf\",\"cd\",\"ce\",\"cf\"]\n\nExample 2:\n\nInput: digits = \"2\"\nOutput: [\"a\",\"b\",\"c\"]\n\n \n\nConstraints:\n\n\t• `1",
      "descriptionHtml": "<p>Given a string containing digits from <code>2-9</code> inclusive, return all possible letter combinations that the number could represent. Return the answer in <strong>any order</strong>.</p>\n\n<p>A mapping of digits to letters (just like on the telephone buttons) is given below. Note that 1 does not map to any letters.</p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2022/03/15/1200px-telephone-keypad2svg.png\" style=\"width: 300px; height: 243px;\" />\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> digits = &quot;23&quot;\n<strong>Output:</strong> [&quot;ad&quot;,&quot;ae&quot;,&quot;af&quot;,&quot;bd&quot;,&quot;be&quot;,&quot;bf&quot;,&quot;cd&quot;,&quot;ce&quot;,&quot;cf&quot;]\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> digits = &quot;2&quot;\n<strong>Output:</strong> [&quot;a&quot;,&quot;b&quot;,&quot;c&quot;]\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= digits.length &lt;= 4</code></li>\n\t<li><code>digits[i]</code> is a digit in the range <code>[&#39;2&#39;, &#39;9&#39;]</code>.</li>\n</ul>\n",
      "lcSlug": "letter-combinations-of-a-phone-number",
      "summary": "Phone backtrack — state invariant, then loop."
    },
    {
      "id": "bt-10",
      "title": "Generate Parentheses",
      "lc": 22,
      "importance": "must",
      "subtopic": "string",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "n pairs",
          "out": "valid strings"
        }
      ],
      "approaches": [
        {
          "name": "Backtrack parens",
          "time": "O(4^n/sqrt n)",
          "space": "O(n)",
          "code": "void dfs(string& cur, int open, int close, int n, vector<string>& ans) {\n    if ((int)cur.size()==2*n) { ans.push_back(cur); return; }\n    if (open<n) { cur+='('; dfs(cur,open+1,close,n,ans); cur.pop_back(); }\n    if (close<open) { cur+=')'; dfs(cur,open,close+1,n,ans); cur.pop_back(); }\n}\nvector<string> generateParenthesis(int n) {\n    vector<string> ans; string cur; dfs(cur,0,0,n,ans); return ans;\n}"
        }
      ],
      "description": "Given `n` pairs of parentheses, write a function to generate all combinations of well-formed parentheses.\n\n \n\nExample 1:\n\nInput: n = 3\nOutput: [\"((()))\",\"(()())\",\"(())()\",\"()(())\",\"()()()\"]\n\nExample 2:\n\nInput: n = 1\nOutput: [\"()\"]\n\n \n\nConstraints:\n\n\t• `1",
      "descriptionHtml": "<p>Given <code>n</code> pairs of parentheses, write a function to <em>generate all combinations of well-formed parentheses</em>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<pre><strong>Input:</strong> n = 3\n<strong>Output:</strong> [\"((()))\",\"(()())\",\"(())()\",\"()(())\",\"()()()\"]\n</pre><p><strong class=\"example\">Example 2:</strong></p>\n<pre><strong>Input:</strong> n = 1\n<strong>Output:</strong> [\"()\"]\n</pre>\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= n &lt;= 8</code></li>\n</ul>\n",
      "lcSlug": "generate-parentheses",
      "summary": "Backtrack parens — state invariant, then loop."
    },
    {
      "id": "bt-11",
      "title": "Word Search",
      "lc": 79,
      "importance": "must",
      "subtopic": "grid",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "board, word",
          "out": "found?"
        }
      ],
      "approaches": [
        {
          "name": "Grid DFS backtrack",
          "time": "O(mn*4^L)",
          "space": "O(L)",
          "code": "bool dfs(vector<vector<char>>& b, string& w, int i, int j, int k) {\n    if (k==(int)w.size()) return true;\n    if (i<0||j<0||i>=(int)b.size()||j>=(int)b[0].size()||b[i][j]!=w[k]) return false;\n    char tmp=b[i][j]; b[i][j]='#';\n    bool ok = dfs(b,w,i+1,j,k+1)||dfs(b,w,i-1,j,k+1)||dfs(b,w,i,j+1,k+1)||dfs(b,w,i,j-1,k+1);\n    b[i][j]=tmp; return ok;\n}\nbool exist(vector<vector<char>>& board, string word) {\n    for (int i=0;i<(int)board.size();i++) for (int j=0;j<(int)board[0].size();j++)\n        if (dfs(board,word,i,j,0)) return true;\n    return false;\n}"
        }
      ],
      "description": "Given an `m x n` grid of characters `board` and a string `word`, return `true` if `word` exists in the grid.\n\nThe word can be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring. The same letter cell may not be used more than once.\n\n \n\nExample 1:\n\nInput: board = [[\"A\",\"B\",\"C\",\"E\"],[\"S\",\"F\",\"C\",\"S\"],[\"A\",\"D\",\"E\",\"E\"]], word = \"ABCCED\"\nOutput: true\n\nExample 2:\n\nInput: board = [[\"A\",\"B\",\"C\",\"E\"],[\"S\",\"F\",\"C\",\"S\"],[\"A\",\"D\",\"E\",\"E\"]], word = \"SEE\"\nOutput: true\n\nExample 3:\n\nInput: board = [[\"A\",\"B\",\"C\",\"E\"],[\"S\",\"F\",\"C\",\"S\"],[\"A\",\"D\",\"E\",\"E\"]], word = \"ABCB\"\nOutput: false\n\n \n\nConstraints:\n\n\t• `m == board.length`\n• `n = board[i].length`\n• `1 \n\n \n\nFollow up: Could you use search pruning to make your solution faster with a larger `board`?",
      "descriptionHtml": "<p>Given an <code>m x n</code> grid of characters <code>board</code> and a string <code>word</code>, return <code>true</code> <em>if</em> <code>word</code> <em>exists in the grid</em>.</p>\n\n<p>The word can be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring. The same letter cell may not be used more than once.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2020/11/04/word2.jpg\" style=\"width: 322px; height: 242px;\" />\n<pre>\n<strong>Input:</strong> board = [[&quot;A&quot;,&quot;B&quot;,&quot;C&quot;,&quot;E&quot;],[&quot;S&quot;,&quot;F&quot;,&quot;C&quot;,&quot;S&quot;],[&quot;A&quot;,&quot;D&quot;,&quot;E&quot;,&quot;E&quot;]], word = &quot;ABCCED&quot;\n<strong>Output:</strong> true\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2020/11/04/word-1.jpg\" style=\"width: 322px; height: 242px;\" />\n<pre>\n<strong>Input:</strong> board = [[&quot;A&quot;,&quot;B&quot;,&quot;C&quot;,&quot;E&quot;],[&quot;S&quot;,&quot;F&quot;,&quot;C&quot;,&quot;S&quot;],[&quot;A&quot;,&quot;D&quot;,&quot;E&quot;,&quot;E&quot;]], word = &quot;SEE&quot;\n<strong>Output:</strong> true\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2020/10/15/word3.jpg\" style=\"width: 322px; height: 242px;\" />\n<pre>\n<strong>Input:</strong> board = [[&quot;A&quot;,&quot;B&quot;,&quot;C&quot;,&quot;E&quot;],[&quot;S&quot;,&quot;F&quot;,&quot;C&quot;,&quot;S&quot;],[&quot;A&quot;,&quot;D&quot;,&quot;E&quot;,&quot;E&quot;]], word = &quot;ABCB&quot;\n<strong>Output:</strong> false\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>m == board.length</code></li>\n\t<li><code>n = board[i].length</code></li>\n\t<li><code>1 &lt;= m, n &lt;= 6</code></li>\n\t<li><code>1 &lt;= word.length &lt;= 15</code></li>\n\t<li><code>board</code> and <code>word</code> consists of only lowercase and uppercase English letters.</li>\n</ul>\n\n<p>&nbsp;</p>\n<p><strong>Follow up:</strong> Could you use search pruning to make your solution faster with a larger <code>board</code>?</p>\n",
      "lcSlug": "word-search",
      "summary": "Grid DFS backtrack — 2D DP on grid — often row-by-row or with rolling array."
    },
    {
      "id": "bt-12",
      "title": "Palindrome Partitioning",
      "lc": 131,
      "importance": "should",
      "subtopic": "string",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "s",
          "out": "partitions"
        }
      ],
      "approaches": [
        {
          "name": "Backtrack + pal check",
          "time": "O(n*2^n)",
          "space": "O(n)",
          "code": "vector<vector<string>> partition(string s) {\n    vector<vector<string>> ans; vector<string> path;\n    function<bool(int,int)> pal = [&](int l, int r) {\n        while (l < r) if (s[l++] != s[r--]) return false; return true;\n    };\n    function<void(int)> dfs = [&](int i) {\n        if (i == (int)s.size()) { ans.push_back(path); return; }\n        for (int j = i; j < (int)s.size(); j++)\n            if (pal(i, j)) { path.push_back(s.substr(i, j-i+1)); dfs(j+1); path.pop_back(); }\n    };\n    dfs(0); return ans;\n}"
        }
      ],
      "description": "Given a string `s`, partition `s` such that every substring of the partition is a palindrome. Return all possible palindrome partitioning of `s`.\n\n \n\nExample 1:\n\nInput: s = \"aab\"\nOutput: [[\"a\",\"a\",\"b\"],[\"aa\",\"b\"]]\n\nExample 2:\n\nInput: s = \"a\"\nOutput: [[\"a\"]]\n\n \n\nConstraints:\n\n\t• `1",
      "descriptionHtml": "<p>Given a string <code>s</code>, partition <code>s</code> such that every <span data-keyword=\"substring-nonempty\">substring</span> of the partition is a <span data-keyword=\"palindrome-string\"><strong>palindrome</strong></span>. Return <em>all possible palindrome partitioning of </em><code>s</code>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<pre><strong>Input:</strong> s = \"aab\"\n<strong>Output:</strong> [[\"a\",\"a\",\"b\"],[\"aa\",\"b\"]]\n</pre><p><strong class=\"example\">Example 2:</strong></p>\n<pre><strong>Input:</strong> s = \"a\"\n<strong>Output:</strong> [[\"a\"]]\n</pre>\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= s.length &lt;= 16</code></li>\n\t<li><code>s</code> contains only lowercase English letters.</li>\n</ul>\n",
      "lcSlug": "palindrome-partitioning",
      "summary": "Backtrack + pal check — state invariant, then loop."
    },
    {
      "id": "bt-13",
      "title": "Restore IP Addresses",
      "lc": 93,
      "importance": "should",
      "subtopic": "string",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "s",
          "out": "valid IPs"
        }
      ],
      "approaches": [
        {
          "name": "Backtracking",
          "time": "O(3^4)",
          "space": "O(1)",
          "code": "vector<string> restoreIpAddresses(string s) {\n    vector<string> ans;\n    function<void(int,int,string)> dfs = [&](int i, int parts, string cur) {\n        if (parts == 4 && i == (int)s.size()) { ans.push_back(cur); return; }\n        if (parts == 4 || i >= (int)s.size()) return;\n        for (int len = 1; len <= 3 && i + len <= (int)s.size(); len++) {\n            string seg = s.substr(i, len);\n            if ((seg.size() > 1 && seg[0] == '0') || stoi(seg) > 255) break;\n            dfs(i + len, parts + 1, cur.empty() ? seg : cur + \".\" + seg);\n        }\n    };\n    dfs(0, 0, \"\"); return ans;\n}"
        }
      ],
      "description": "A valid IP address consists of exactly four integers separated by single dots. Each integer is between `0` and `255` (inclusive) and cannot have leading zeros.\n\n\t• For example, `\"0.1.2.201\"` and `\"192.168.1.1\"` are valid IP addresses, but `\"0.011.255.245\"`, `\"192.168.1.312\"` and `\"192.168@1.1\"` are invalid IP addresses.\n\nGiven a string `s` containing only digits, return all possible valid IP addresses that can be formed by inserting dots into `s`. You are not allowed to reorder or remove any digits in `s`. You may return the valid IP addresses in any order.\n\n \n\nExample 1:\n\nInput: s = \"25525511135\"\nOutput: [\"255.255.11.135\",\"255.255.111.35\"]\n\nExample 2:\n\nInput: s = \"0000\"\nOutput: [\"0.0.0.0\"]\n\nExample 3:\n\nInput: s = \"101023\"\nOutput: [\"1.0.10.23\",\"1.0.102.3\",\"10.1.0.23\",\"10.10.2.3\",\"101.0.2.3\"]\n\n \n\nConstraints:\n\n\t• `1",
      "descriptionHtml": "<p>A <strong>valid IP address</strong> consists of exactly four integers separated by single dots. Each integer is between <code>0</code> and <code>255</code> (<strong>inclusive</strong>) and cannot have leading zeros.</p>\n\n<ul>\n\t<li>For example, <code>&quot;0.1.2.201&quot;</code> and <code>&quot;192.168.1.1&quot;</code> are <strong>valid</strong> IP addresses, but <code>&quot;0.011.255.245&quot;</code>, <code>&quot;192.168.1.312&quot;</code> and <code>&quot;192.168@1.1&quot;</code> are <strong>invalid</strong> IP addresses.</li>\n</ul>\n\n<p>Given a string <code>s</code> containing only digits, return <em>all possible valid IP addresses that can be formed by inserting dots into </em><code>s</code>. You are <strong>not</strong> allowed to reorder or remove any digits in <code>s</code>. You may return the valid IP addresses in <strong>any</strong> order.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> s = &quot;25525511135&quot;\n<strong>Output:</strong> [&quot;255.255.11.135&quot;,&quot;255.255.111.35&quot;]\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> s = &quot;0000&quot;\n<strong>Output:</strong> [&quot;0.0.0.0&quot;]\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> s = &quot;101023&quot;\n<strong>Output:</strong> [&quot;1.0.10.23&quot;,&quot;1.0.102.3&quot;,&quot;10.1.0.23&quot;,&quot;10.10.2.3&quot;,&quot;101.0.2.3&quot;]\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= s.length &lt;= 20</code></li>\n\t<li><code>s</code> consists of digits only.</li>\n</ul>\n",
      "lcSlug": "restore-ip-addresses",
      "summary": "Backtracking — state invariant, then loop."
    },
    {
      "id": "bt-14",
      "title": "N-Queens",
      "lc": 51,
      "importance": "must",
      "subtopic": "constraint",
      "difficulty": "Hard",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "n",
          "out": "board configs"
        }
      ],
      "approaches": [
        {
          "name": "N-Queens",
          "time": "O(n!)",
          "space": "O(n)",
          "code": "bool ok(int r, int c, vector<int>& cols, vector<int>& diag1, vector<int>& diag2) {\n    return !cols[c] && !diag1[r-c+n] && !diag2[r+c];\n}\nvoid dfs(int r, int n, vector<int>& cols, vector<int>& d1, vector<int>& d2, vector<string>& cur, vector<vector<string>>& ans) {\n    if (r==n) { ans.push_back(cur); return; }\n    for (int c=0;c<n;c++) if (ok(r,c,cols,d1,d2)) {\n        cols[c]=d1[r-c+n]=d2[r+c]=1;\n        cur[r][c]='Q'; dfs(r+1,n,cols,d1,d2,cur,ans); cur[r][c]='.';\n        cols[c]=d1[r-c+n]=d2[r+c]=0;\n    }\n}\nvector<vector<string>> solveNQueens(int n) {\n    vector<vector<string>> ans; vector<string> cur(n,string(n,'.'));\n    vector<int> cols(n), d1(2*n), d2(2*n); dfs(0,n,cols,d1,d2,cur,ans); return ans;\n}"
        }
      ],
      "description": "The n-queens puzzle is the problem of placing `n` queens on an `n x n` chessboard such that no two queens attack each other.\n\nGiven an integer `n`, return all distinct solutions to the n-queens puzzle. You may return the answer in any order.\n\nEach solution contains a distinct board configuration of the n-queens' placement, where `'Q'` and `'.'` both indicate a queen and an empty space, respectively.\n\n \n\nExample 1:\n\nInput: n = 4\nOutput: [[\".Q..\",\"...Q\",\"Q...\",\"..Q.\"],[\"..Q.\",\"Q...\",\"...Q\",\".Q..\"]]\nExplanation: There exist two distinct solutions to the 4-queens puzzle as shown above\n\nExample 2:\n\nInput: n = 1\nOutput: [[\"Q\"]]\n\n \n\nConstraints:\n\n\t• `1",
      "descriptionHtml": "<p>The <strong>n-queens</strong> puzzle is the problem of placing <code>n</code> queens on an <code>n x n</code> chessboard such that no two queens attack each other.</p>\n\n<p>Given an integer <code>n</code>, return <em>all distinct solutions to the <strong>n-queens puzzle</strong></em>. You may return the answer in <strong>any order</strong>.</p>\n\n<p>Each solution contains a distinct board configuration of the n-queens&#39; placement, where <code>&#39;Q&#39;</code> and <code>&#39;.&#39;</code> both indicate a queen and an empty space, respectively.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2020/11/13/queens.jpg\" style=\"width: 600px; height: 268px;\" />\n<pre>\n<strong>Input:</strong> n = 4\n<strong>Output:</strong> [[&quot;.Q..&quot;,&quot;...Q&quot;,&quot;Q...&quot;,&quot;..Q.&quot;],[&quot;..Q.&quot;,&quot;Q...&quot;,&quot;...Q&quot;,&quot;.Q..&quot;]]\n<strong>Explanation:</strong> There exist two distinct solutions to the 4-queens puzzle as shown above\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> n = 1\n<strong>Output:</strong> [[&quot;Q&quot;]]\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= n &lt;= 9</code></li>\n</ul>\n",
      "lcSlug": "n-queens",
      "summary": "N-Queens — state invariant, then loop."
    },
    {
      "id": "bt-15",
      "title": "N-Queens II",
      "lc": 52,
      "importance": "nice",
      "subtopic": "constraint",
      "difficulty": "Hard",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "n",
          "out": "count"
        }
      ],
      "approaches": [
        {
          "name": "N-Queens count",
          "time": "O(n!)",
          "space": "O(n)",
          "code": "int solveNQueens(int n) {\n    int ans=0; vector<int> cols(n), d1(2*n), d2(2*n);\n    function<void(int)> dfs=[&](int r){\n        if(r==n){ ans++; return; }\n        for(int c=0;c<n;c++) if(!cols[c]&&!d1[r-c+n]&&!d2[r+c]){\n            cols[c]=d1[r-c+n]=d2[r+c]=1; dfs(r+1);\n            cols[c]=d1[r-c+n]=d2[r+c]=0;\n        }\n    }; dfs(0); return ans;\n}"
        }
      ],
      "description": "The n-queens puzzle is the problem of placing `n` queens on an `n x n` chessboard such that no two queens attack each other.\n\nGiven an integer `n`, return the number of distinct solutions to the n-queens puzzle.\n\n \n\nExample 1:\n\nInput: n = 4\nOutput: 2\nExplanation: There are two distinct solutions to the 4-queens puzzle as shown.\n\nExample 2:\n\nInput: n = 1\nOutput: 1\n\n \n\nConstraints:\n\n\t• `1",
      "descriptionHtml": "<p>The <strong>n-queens</strong> puzzle is the problem of placing <code>n</code> queens on an <code>n x n</code> chessboard such that no two queens attack each other.</p>\n\n<p>Given an integer <code>n</code>, return <em>the number of distinct solutions to the&nbsp;<strong>n-queens puzzle</strong></em>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2020/11/13/queens.jpg\" style=\"width: 600px; height: 268px;\" />\n<pre>\n<strong>Input:</strong> n = 4\n<strong>Output:</strong> 2\n<strong>Explanation:</strong> There are two distinct solutions to the 4-queens puzzle as shown.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> n = 1\n<strong>Output:</strong> 1\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= n &lt;= 9</code></li>\n</ul>\n",
      "lcSlug": "n-queens-ii",
      "summary": "N-Queens count — state invariant, then loop."
    },
    {
      "id": "bt-16",
      "title": "Sudoku Solver",
      "lc": 37,
      "importance": "should",
      "subtopic": "constraint",
      "difficulty": "Hard",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "board",
          "out": "solve"
        }
      ],
      "approaches": [
        {
          "name": "Backtracking",
          "time": "O(9^81)",
          "space": "O(81)",
          "code": "bool sudokuSolve(vector<vector<char>>& b) {\n    for (int r = 0; r < 9; r++) for (int c = 0; c < 9; c++) if (b[r][c] == '.') {\n        for (char d = '1'; d <= '9'; d++) {\n            if (ok(b, r, c, d)) { b[r][c] = d; if (sudokuSolve(b)) return true; b[r][c] = '.'; }\n        }\n        return false;\n    }\n    return true;\n}\nbool ok(vector<vector<char>>& b, int r, int c, char d) {\n    for (int i = 0; i < 9; i++)\n        if (b[r][i] == d || b[i][c] == d || b[r/3*3+i/3][c/3*3+i%3] == d) return false;\n    return true;\n}"
        }
      ],
      "description": "Write a program to solve a Sudoku puzzle by filling the empty cells.\n\nA sudoku solution must satisfy all of the following rules:\n\n\t• Each of the digits `1-9` must occur exactly once in each row.\n• Each of the digits `1-9` must occur exactly once in each column.\n• Each of the digits `1-9` must occur exactly once in each of the 9 `3x3` sub-boxes of the grid.\n\nThe `'.'` character indicates empty cells.\n\n \n\nExample 1:\n\nInput: board = [[\"5\",\"3\",\".\",\".\",\"7\",\".\",\".\",\".\",\".\"],[\"6\",\".\",\".\",\"1\",\"9\",\"5\",\".\",\".\",\".\"],[\".\",\"9\",\"8\",\".\",\".\",\".\",\".\",\"6\",\".\"],[\"8\",\".\",\".\",\".\",\"6\",\".\",\".\",\".\",\"3\"],[\"4\",\".\",\".\",\"8\",\".\",\"3\",\".\",\".\",\"1\"],[\"7\",\".\",\".\",\".\",\"2\",\".\",\".\",\".\",\"6\"],[\".\",\"6\",\".\",\".\",\".\",\".\",\"2\",\"8\",\".\"],[\".\",\".\",\".\",\"4\",\"1\",\"9\",\".\",\".\",\"5\"],[\".\",\".\",\".\",\".\",\"8\",\".\",\".\",\"7\",\"9\"]]\nOutput: [[\"5\",\"3\",\"4\",\"6\",\"7\",\"8\",\"9\",\"1\",\"2\"],[\"6\",\"7\",\"2\",\"1\",\"9\",\"5\",\"3\",\"4\",\"8\"],[\"1\",\"9\",\"8\",\"3\",\"4\",\"2\",\"5\",\"6\",\"7\"],[\"8\",\"5\",\"9\",\"7\",\"6\",\"1\",\"4\",\"2\",\"3\"],[\"4\",\"2\",\"6\",\"8\",\"5\",\"3\",\"7\",\"9\",\"1\"],[\"7\",\"1\",\"3\",\"9\",\"2\",\"4\",\"8\",\"5\",\"6\"],[\"9\",\"6\",\"1\",\"5\",\"3\",\"7\",\"2\",\"8\",\"4\"],[\"2\",\"8\",\"7\",\"4\",\"1\",\"9\",\"6\",\"3\",\"5\"],[\"3\",\"4\",\"5\",\"2\",\"8\",\"6\",\"1\",\"7\",\"9\"]]\nExplanation: The input board is shown above and the only valid solution is shown below:\n\n \n\nConstraints:\n\n\t• `board.length == 9`\n• `board[i].length == 9`\n• `board[i][j]` is a digit or `'.'`.\n• It is guaranteed that the input board has only one solution.",
      "descriptionHtml": "<p>Write a program to solve a Sudoku puzzle by filling the empty cells.</p>\n\n<p>A sudoku solution must satisfy <strong>all of the following rules</strong>:</p>\n\n<ol>\n\t<li>Each of the digits <code>1-9</code> must occur exactly once in each row.</li>\n\t<li>Each of the digits <code>1-9</code> must occur exactly once in each column.</li>\n\t<li>Each of the digits <code>1-9</code> must occur exactly once in each of the 9 <code>3x3</code> sub-boxes of the grid.</li>\n</ol>\n\n<p>The <code>&#39;.&#39;</code> character indicates empty cells.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img src=\"https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Sudoku-by-L2G-20050714.svg/250px-Sudoku-by-L2G-20050714.svg.png\" style=\"height:250px; width:250px\" />\n<pre>\n<strong>Input:</strong> board = [[&quot;5&quot;,&quot;3&quot;,&quot;.&quot;,&quot;.&quot;,&quot;7&quot;,&quot;.&quot;,&quot;.&quot;,&quot;.&quot;,&quot;.&quot;],[&quot;6&quot;,&quot;.&quot;,&quot;.&quot;,&quot;1&quot;,&quot;9&quot;,&quot;5&quot;,&quot;.&quot;,&quot;.&quot;,&quot;.&quot;],[&quot;.&quot;,&quot;9&quot;,&quot;8&quot;,&quot;.&quot;,&quot;.&quot;,&quot;.&quot;,&quot;.&quot;,&quot;6&quot;,&quot;.&quot;],[&quot;8&quot;,&quot;.&quot;,&quot;.&quot;,&quot;.&quot;,&quot;6&quot;,&quot;.&quot;,&quot;.&quot;,&quot;.&quot;,&quot;3&quot;],[&quot;4&quot;,&quot;.&quot;,&quot;.&quot;,&quot;8&quot;,&quot;.&quot;,&quot;3&quot;,&quot;.&quot;,&quot;.&quot;,&quot;1&quot;],[&quot;7&quot;,&quot;.&quot;,&quot;.&quot;,&quot;.&quot;,&quot;2&quot;,&quot;.&quot;,&quot;.&quot;,&quot;.&quot;,&quot;6&quot;],[&quot;.&quot;,&quot;6&quot;,&quot;.&quot;,&quot;.&quot;,&quot;.&quot;,&quot;.&quot;,&quot;2&quot;,&quot;8&quot;,&quot;.&quot;],[&quot;.&quot;,&quot;.&quot;,&quot;.&quot;,&quot;4&quot;,&quot;1&quot;,&quot;9&quot;,&quot;.&quot;,&quot;.&quot;,&quot;5&quot;],[&quot;.&quot;,&quot;.&quot;,&quot;.&quot;,&quot;.&quot;,&quot;8&quot;,&quot;.&quot;,&quot;.&quot;,&quot;7&quot;,&quot;9&quot;]]\n<strong>Output:</strong> [[&quot;5&quot;,&quot;3&quot;,&quot;4&quot;,&quot;6&quot;,&quot;7&quot;,&quot;8&quot;,&quot;9&quot;,&quot;1&quot;,&quot;2&quot;],[&quot;6&quot;,&quot;7&quot;,&quot;2&quot;,&quot;1&quot;,&quot;9&quot;,&quot;5&quot;,&quot;3&quot;,&quot;4&quot;,&quot;8&quot;],[&quot;1&quot;,&quot;9&quot;,&quot;8&quot;,&quot;3&quot;,&quot;4&quot;,&quot;2&quot;,&quot;5&quot;,&quot;6&quot;,&quot;7&quot;],[&quot;8&quot;,&quot;5&quot;,&quot;9&quot;,&quot;7&quot;,&quot;6&quot;,&quot;1&quot;,&quot;4&quot;,&quot;2&quot;,&quot;3&quot;],[&quot;4&quot;,&quot;2&quot;,&quot;6&quot;,&quot;8&quot;,&quot;5&quot;,&quot;3&quot;,&quot;7&quot;,&quot;9&quot;,&quot;1&quot;],[&quot;7&quot;,&quot;1&quot;,&quot;3&quot;,&quot;9&quot;,&quot;2&quot;,&quot;4&quot;,&quot;8&quot;,&quot;5&quot;,&quot;6&quot;],[&quot;9&quot;,&quot;6&quot;,&quot;1&quot;,&quot;5&quot;,&quot;3&quot;,&quot;7&quot;,&quot;2&quot;,&quot;8&quot;,&quot;4&quot;],[&quot;2&quot;,&quot;8&quot;,&quot;7&quot;,&quot;4&quot;,&quot;1&quot;,&quot;9&quot;,&quot;6&quot;,&quot;3&quot;,&quot;5&quot;],[&quot;3&quot;,&quot;4&quot;,&quot;5&quot;,&quot;2&quot;,&quot;8&quot;,&quot;6&quot;,&quot;1&quot;,&quot;7&quot;,&quot;9&quot;]]\n<strong>Explanation:</strong>&nbsp;The input board is shown above and the only valid solution is shown below:\n\n<img src=\"https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Sudoku-by-L2G-20050714_solution.svg/250px-Sudoku-by-L2G-20050714_solution.svg.png\" style=\"height:250px; width:250px\" />\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>board.length == 9</code></li>\n\t<li><code>board[i].length == 9</code></li>\n\t<li><code>board[i][j]</code> is a digit or <code>&#39;.&#39;</code>.</li>\n\t<li>It is <strong>guaranteed</strong> that the input board has only one solution.</li>\n</ul>\n",
      "lcSlug": "sudoku-solver",
      "summary": "Backtracking — state invariant, then loop."
    },
    {
      "id": "bt-17",
      "title": "Word Search II",
      "lc": 212,
      "importance": "must",
      "subtopic": "grid",
      "difficulty": "Hard",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "board, words",
          "out": "found words"
        }
      ],
      "approaches": [
        {
          "name": "Trie + backtrack",
          "time": "O(mn*4^L)",
          "space": "O(n)",
          "code": "struct TrieNode { TrieNode* c[26]{}; string w; };\nclass Solution {\n    TrieNode* root = new TrieNode();\n    void ins(string& w) {\n        TrieNode* u = root;\n        for (char ch : w) { int i = ch-'a'; if (!u->c[i]) u->c[i] = new TrieNode(); u = u->c[i]; }\n        u->w = w;\n    }\n    void dfs(vector<vector<char>>& b, int r, int c, TrieNode* u, vector<string>& ans) {\n        if (!u->w.empty()) { ans.push_back(u->w); u->w.clear(); }\n        if (r < 0 || c < 0 || r >= (int)b.size() || c >= (int)b[0].size()) return;\n        char ch = b[r][c]; if (ch == '#') return;\n        int i = ch-'a'; if (!u->c[i]) return;\n        b[r][c] = '#'; dfs(b, r+1, c, u->c[i], ans); dfs(b, r-1, c, u->c[i], ans);\n        dfs(b, r, c+1, u->c[i], ans); dfs(b, r, c-1, u->c[i], ans); b[r][c] = ch;\n    }\npublic:\n    vector<string> findWords(vector<vector<char>>& board, vector<string>& words) {\n        for (string& w : words) ins(w);\n        vector<string> ans;\n        for (int r = 0; r < (int)board.size(); r++)\n            for (int c = 0; c < (int)board[0].size(); c++) dfs(board, r, c, root, ans);\n        return ans;\n    }\n};"
        }
      ],
      "description": "Given an `m x n` `board` of characters and a list of strings `words`, return all words on the board.\n\nEach word must be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring. The same letter cell may not be used more than once in a word.\n\n \n\nExample 1:\n\nInput: board = [[\"o\",\"a\",\"a\",\"n\"],[\"e\",\"t\",\"a\",\"e\"],[\"i\",\"h\",\"k\",\"r\"],[\"i\",\"f\",\"l\",\"v\"]], words = [\"oath\",\"pea\",\"eat\",\"rain\"]\nOutput: [\"eat\",\"oath\"]\n\nExample 2:\n\nInput: board = [[\"a\",\"b\"],[\"c\",\"d\"]], words = [\"abcb\"]\nOutput: []\n\n \n\nConstraints:\n\n\t• `m == board.length`\n• `n == board[i].length`\n• `1 4`\n• `1",
      "descriptionHtml": "<p>Given an <code>m x n</code> <code>board</code>&nbsp;of characters and a list of strings <code>words</code>, return <em>all words on the board</em>.</p>\n\n<p>Each word must be constructed from letters of sequentially adjacent cells, where <strong>adjacent cells</strong> are horizontally or vertically neighboring. The same letter cell may not be used more than once in a word.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2020/11/07/search1.jpg\" style=\"width: 322px; height: 322px;\" />\n<pre>\n<strong>Input:</strong> board = [[&quot;o&quot;,&quot;a&quot;,&quot;a&quot;,&quot;n&quot;],[&quot;e&quot;,&quot;t&quot;,&quot;a&quot;,&quot;e&quot;],[&quot;i&quot;,&quot;h&quot;,&quot;k&quot;,&quot;r&quot;],[&quot;i&quot;,&quot;f&quot;,&quot;l&quot;,&quot;v&quot;]], words = [&quot;oath&quot;,&quot;pea&quot;,&quot;eat&quot;,&quot;rain&quot;]\n<strong>Output:</strong> [&quot;eat&quot;,&quot;oath&quot;]\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2020/11/07/search2.jpg\" style=\"width: 162px; height: 162px;\" />\n<pre>\n<strong>Input:</strong> board = [[&quot;a&quot;,&quot;b&quot;],[&quot;c&quot;,&quot;d&quot;]], words = [&quot;abcb&quot;]\n<strong>Output:</strong> []\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>m == board.length</code></li>\n\t<li><code>n == board[i].length</code></li>\n\t<li><code>1 &lt;= m, n &lt;= 12</code></li>\n\t<li><code>board[i][j]</code> is a lowercase English letter.</li>\n\t<li><code>1 &lt;= words.length &lt;= 3 * 10<sup>4</sup></code></li>\n\t<li><code>1 &lt;= words[i].length &lt;= 10</code></li>\n\t<li><code>words[i]</code> consists of lowercase English letters.</li>\n\t<li>All the strings of <code>words</code> are unique.</li>\n</ul>\n",
      "lcSlug": "word-search-ii",
      "summary": "Trie + backtrack — 2D DP on grid — often row-by-row or with rolling array."
    },
    {
      "id": "bt-18",
      "title": "Remove Invalid Parentheses",
      "lc": 301,
      "importance": "nice",
      "subtopic": "string",
      "difficulty": "Hard",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "s",
          "out": "min removals"
        }
      ],
      "approaches": [
        {
          "name": "BFS min removals",
          "time": "O(2^n)",
          "space": "O(n)",
          "code": "vector<string> removeInvalidParentheses(string s) {\n    auto valid=[&](const string& t){\n        int bal=0; for(char c:t){ if(c=='(') bal++; else if(c==')'&&--bal<0) return false; } return bal==0;\n    };\n    unordered_set<string> seen; queue<string> q; q.push(s); seen.insert(s);\n    vector<string> ans; bool found=false;\n    while(!q.empty()){\n        int sz=q.size();\n        while(sz--){\n            string cur=q.front(); q.pop();\n            if(valid(cur)){ ans.push_back(cur); found=true; continue; }\n            if(found) continue;\n            for(int i=0;i<(int)cur.size();i++) if(cur[i]=='('||cur[i]==')'){\n                string nxt=cur.substr(0,i)+cur.substr(i+1);\n                if(!seen.count(nxt)){ seen.insert(nxt); q.push(nxt); }\n            }\n        } if(found) break;\n    } return ans;\n}"
        }
      ],
      "description": "Given a string `s` that contains parentheses and letters, remove the minimum number of invalid parentheses to make the input string valid.\n\nReturn a list of unique strings that are valid with the minimum number of removals. You may return the answer in any order.\n\n \n\nExample 1:\n\nInput: s = \"()())()\"\nOutput: [\"(())()\",\"()()()\"]\n\nExample 2:\n\nInput: s = \"(a)())()\"\nOutput: [\"(a())()\",\"(a)()()\"]\n\nExample 3:\n\nInput: s = \")(\"\nOutput: [\"\"]\n\n \n\nConstraints:\n\n\t• `1",
      "descriptionHtml": "<p>Given a string <code>s</code> that contains parentheses and letters, remove the minimum number of invalid parentheses to make the input string valid.</p>\n\n<p>Return <em>a list of <strong>unique strings</strong> that are valid with the minimum number of removals</em>. You may return the answer in <strong>any order</strong>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> s = &quot;()())()&quot;\n<strong>Output:</strong> [&quot;(())()&quot;,&quot;()()()&quot;]\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> s = &quot;(a)())()&quot;\n<strong>Output:</strong> [&quot;(a())()&quot;,&quot;(a)()()&quot;]\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> s = &quot;)(&quot;\n<strong>Output:</strong> [&quot;&quot;]\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= s.length &lt;= 25</code></li>\n\t<li><code>s</code> consists of lowercase English letters and parentheses <code>&#39;(&#39;</code> and <code>&#39;)&#39;</code>.</li>\n\t<li>There will be at most <code>20</code> parentheses in <code>s</code>.</li>\n</ul>\n",
      "lcSlug": "remove-invalid-parentheses",
      "summary": "BFS min removals — state invariant, then loop."
    },
    {
      "id": "bt-19",
      "title": "Partition to K Equal Sum Subsets",
      "lc": 698,
      "importance": "should",
      "subtopic": "combinations",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums, k",
          "out": "true/false"
        }
      ],
      "approaches": [
        {
          "name": "Backtrack + prune",
          "time": "O(n*2^n)",
          "space": "O(n)",
          "code": "bool canPartitionKSubsets(vector<int>& nums, int k) {\n    int sum = accumulate(nums.begin(), nums.end(), 0);\n    if (sum % k) return false;\n    int target = sum / k;\n    sort(nums.begin(), nums.end(), greater<int>());\n    vector<int> buckets(k, 0);\n    function<bool(int)> dfs = [&](int i) {\n        if (i == (int)nums.size()) return true;\n        for (int b = 0; b < k; b++) {\n            if (b && buckets[b] == buckets[b-1]) continue;\n            if (buckets[b] + nums[i] > target) continue;\n            buckets[b] += nums[i];\n            if (dfs(i+1)) return true;\n            buckets[b] -= nums[i];\n        }\n        return false;\n    };\n    return dfs(0);\n}"
        }
      ],
      "description": "Given an integer array `nums` and an integer `k`, return `true` if it is possible to divide this array into `k` non-empty subsets whose sums are all equal.\n\n \n\nExample 1:\n\nInput: nums = [4,3,2,3,5,2,1], k = 4\nOutput: true\nExplanation: It is possible to divide it into 4 subsets (5), (1, 4), (2,3), (2,3) with equal sums.\n\nExample 2:\n\nInput: nums = [1,2,3,4], k = 3\nOutput: false\n\n \n\nConstraints:\n\n\t• `1 4`\n• The frequency of each element is in the range `[1, 4]`.",
      "descriptionHtml": "<p>Given an integer array <code>nums</code> and an integer <code>k</code>, return <code>true</code> if it is possible to divide this array into <code>k</code> non-empty subsets whose sums are all equal.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [4,3,2,3,5,2,1], k = 4\n<strong>Output:</strong> true\n<strong>Explanation:</strong> It is possible to divide it into 4 subsets (5), (1, 4), (2,3), (2,3) with equal sums.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [1,2,3,4], k = 3\n<strong>Output:</strong> false\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= k &lt;= nums.length &lt;= 16</code></li>\n\t<li><code>1 &lt;= nums[i] &lt;= 10<sup>4</sup></code></li>\n\t<li>The frequency of each element is in the range <code>[1, 4]</code>.</li>\n</ul>\n",
      "lcSlug": "partition-to-k-equal-sum-subsets",
      "summary": "Sort desc; skip equal buckets; prune when bucket sum exceeds target."
    },
    {
      "id": "bt-20",
      "title": "Beautiful Arrangement",
      "lc": 526,
      "importance": "nice",
      "subtopic": "permutations",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "n",
          "out": "count"
        }
      ],
      "approaches": [
        {
          "name": "Backtracking perms",
          "time": "O(n*n!)",
          "space": "O(n)",
          "code": "void dfs() {\n  if (path.size()==n) { save; return; }\n  for unused i: pick, dfs, unpick;\n}"
        }
      ],
      "description": "Suppose you have `n` integers labeled `1` through `n`. A permutation of those `n` integers `perm` (1-indexed) is considered a beautiful arrangement if for every `i` (`1 \n\n\t• `perm[i]` is divisible by `i`.\n• `i` is divisible by `perm[i]`.\n\nGiven an integer `n`, return the number of the beautiful arrangements that you can construct.\n\n \n\nExample 1:\n\nInput: n = 2\nOutput: 2\nExplanation: \nThe first beautiful arrangement is [1,2]:\n    - perm[1] = 1 is divisible by i = 1\n    - perm[2] = 2 is divisible by i = 2\nThe second beautiful arrangement is [2,1]:\n    - perm[1] = 2 is divisible by i = 1\n    - i = 2 is divisible by perm[2] = 1\n\nExample 2:\n\nInput: n = 1\nOutput: 1\n\n \n\nConstraints:\n\n\t• `1",
      "descriptionHtml": "<p>Suppose you have <code>n</code> integers labeled <code>1</code> through <code>n</code>. A permutation of those <code>n</code> integers <code>perm</code> (<strong>1-indexed</strong>) is considered a <strong>beautiful arrangement</strong> if for every <code>i</code> (<code>1 &lt;= i &lt;= n</code>), <strong>either</strong> of the following is true:</p>\n\n<ul>\n\t<li><code>perm[i]</code> is divisible by <code>i</code>.</li>\n\t<li><code>i</code> is divisible by <code>perm[i]</code>.</li>\n</ul>\n\n<p>Given an integer <code>n</code>, return <em>the <strong>number</strong> of the <strong>beautiful arrangements</strong> that you can construct</em>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> n = 2\n<strong>Output:</strong> 2\n<b>Explanation:</b> \nThe first beautiful arrangement is [1,2]:\n    - perm[1] = 1 is divisible by i = 1\n    - perm[2] = 2 is divisible by i = 2\nThe second beautiful arrangement is [2,1]:\n    - perm[1] = 2 is divisible by i = 1\n    - i = 2 is divisible by perm[2] = 1\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> n = 1\n<strong>Output:</strong> 1\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= n &lt;= 15</code></li>\n</ul>\n",
      "lcSlug": "beautiful-arrangement",
      "summary": "Backtracking perms — state invariant, then loop."
    },
    {
      "id": "bt-21",
      "title": "Target Sum",
      "lc": 494,
      "importance": "should",
      "subtopic": "combinations",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums, target",
          "out": "ways"
        }
      ],
      "approaches": [
        {
          "name": "Subset sum DP",
          "time": "O(n*sum)",
          "space": "O(sum)",
          "code": "int findTargetSumWays(vector<int>& nums, int target) {\n    int sum = accumulate(nums.begin(), nums.end(), 0);\n    if ((target + sum) % 2 || abs(target) > sum) return 0;\n    int need = (target + sum) / 2;\n    vector<int> dp(need+1, 0); dp[0] = 1;\n    for (int x : nums)\n        for (int s = need; s >= x; s--) dp[s] += dp[s-x];\n    return dp[need];\n}"
        }
      ],
      "description": "You are given an integer array `nums` and an integer `target`.\n\nYou want to build an expression out of nums by adding one of the symbols `'+'` and `'-'` before each integer in nums and then concatenate all the integers.\n\n\t• For example, if `nums = [2, 1]`, you can add a `'+'` before `2` and a `'-'` before `1` and concatenate them to build the expression `\"+2-1\"`.\n\nReturn the number of different expressions that you can build, which evaluates to `target`.\n\n \n\nExample 1:\n\nInput: nums = [1,1,1,1,1], target = 3\nOutput: 5\nExplanation: There are 5 ways to assign symbols to make the sum of nums be target 3.\n-1 + 1 + 1 + 1 + 1 = 3\n+1 - 1 + 1 + 1 + 1 = 3\n+1 + 1 - 1 + 1 + 1 = 3\n+1 + 1 + 1 - 1 + 1 = 3\n+1 + 1 + 1 + 1 - 1 = 3\n\nExample 2:\n\nInput: nums = [1], target = 1\nOutput: 1\n\n \n\nConstraints:\n\n\t• `1",
      "descriptionHtml": "<p>You are given an integer array <code>nums</code> and an integer <code>target</code>.</p>\n\n<p>You want to build an <strong>expression</strong> out of nums by adding one of the symbols <code>&#39;+&#39;</code> and <code>&#39;-&#39;</code> before each integer in nums and then concatenate all the integers.</p>\n\n<ul>\n\t<li>For example, if <code>nums = [2, 1]</code>, you can add a <code>&#39;+&#39;</code> before <code>2</code> and a <code>&#39;-&#39;</code> before <code>1</code> and concatenate them to build the expression <code>&quot;+2-1&quot;</code>.</li>\n</ul>\n\n<p>Return the number of different <strong>expressions</strong> that you can build, which evaluates to <code>target</code>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [1,1,1,1,1], target = 3\n<strong>Output:</strong> 5\n<strong>Explanation:</strong> There are 5 ways to assign symbols to make the sum of nums be target 3.\n-1 + 1 + 1 + 1 + 1 = 3\n+1 - 1 + 1 + 1 + 1 = 3\n+1 + 1 - 1 + 1 + 1 = 3\n+1 + 1 + 1 - 1 + 1 = 3\n+1 + 1 + 1 + 1 - 1 = 3\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [1], target = 1\n<strong>Output:</strong> 1\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= nums.length &lt;= 20</code></li>\n\t<li><code>0 &lt;= nums[i] &lt;= 1000</code></li>\n\t<li><code>0 &lt;= sum(nums[i]) &lt;= 1000</code></li>\n\t<li><code>-1000 &lt;= target &lt;= 1000</code></li>\n</ul>\n",
      "lcSlug": "target-sum",
      "summary": "0/1 knapsack: iterate amounts backwards to avoid reuse."
    },
    {
      "id": "bt-22",
      "title": "Non-decreasing Subsequences",
      "lc": 491,
      "importance": "nice",
      "subtopic": "subsets",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums",
          "out": "subsequences"
        }
      ],
      "approaches": [
        {
          "name": "Backtracking subsets",
          "time": "O(n*2^n)",
          "space": "O(n)",
          "code": "void dfs(int i) {\n  if (i==n) { save; return; }\n  dfs(i+1); pick i; dfs(i+1); unpick;\n}"
        }
      ],
      "description": "Given an integer array `nums`, return all the different possible non-decreasing subsequences of the given array with at least two elements. You may return the answer in any order.\n\n \n\nExample 1:\n\nInput: nums = [4,6,7,7]\nOutput: [[4,6],[4,6,7],[4,6,7,7],[4,7],[4,7,7],[6,7],[6,7,7],[7,7]]\n\nExample 2:\n\nInput: nums = [4,4,3,2,1]\nOutput: [[4,4]]\n\n \n\nConstraints:\n\n\t• `1",
      "descriptionHtml": "<p>Given an integer array <code>nums</code>, return <em>all the different possible non-decreasing subsequences of the given array with at least two elements</em>. You may return the answer in <strong>any order</strong>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [4,6,7,7]\n<strong>Output:</strong> [[4,6],[4,6,7],[4,6,7,7],[4,7],[4,7,7],[6,7],[6,7,7],[7,7]]\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [4,4,3,2,1]\n<strong>Output:</strong> [[4,4]]\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= nums.length &lt;= 15</code></li>\n\t<li><code>-100 &lt;= nums[i] &lt;= 100</code></li>\n</ul>\n",
      "lcSlug": "non-decreasing-subsequences",
      "summary": "Backtracking subsets — state invariant, then loop."
    },
    {
      "id": "bt-23",
      "title": "Matchsticks to Square",
      "lc": 473,
      "importance": "nice",
      "subtopic": "combinations",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "matchsticks",
          "out": "square?"
        }
      ],
      "approaches": [
        {
          "name": "Subset sum partition",
          "time": "O(4^n)",
          "space": "O(n)",
          "code": "bool canPartition(vector<int>& m){\n    int sum=accumulate(m.begin(),m.end(),0); if(sum%4) return false;\n    int side=sum/4; sort(m.rbegin(),m.rend());\n    vector<int> sides(4);\n    function<bool(int)> dfs=[&](int i){\n        if(i==(int)m.size()) return true;\n        for(int k=0;k<4;k++){\n            if(sides[k]+m[i]>side) continue;\n            sides[k]+=m[i]; if(dfs(i+1)) return true; sides[k]-=m[i];\n            if(!sides[k]) break;\n        } return false;\n    }; return dfs(0);\n}"
        }
      ],
      "description": "You are given an integer array `matchsticks` where `matchsticks[i]` is the length of the `ith` matchstick. You want to use all the matchsticks to make one square. You should not break any stick, but you can link them up, and each matchstick must be used exactly one time.\n\nReturn `true` if you can make this square and `false` otherwise.\n\n \n\nExample 1:\n\nInput: matchsticks = [1,1,2,2,2]\nOutput: true\nExplanation: You can form a square with length 2, one side of the square came two sticks with length 1.\n\nExample 2:\n\nInput: matchsticks = [3,3,3,3,4]\nOutput: false\nExplanation: You cannot find a way to form a square with all the matchsticks.\n\n \n\nConstraints:\n\n\t• `1 8`",
      "descriptionHtml": "<p>You are given an integer array <code>matchsticks</code> where <code>matchsticks[i]</code> is the length of the <code>i<sup>th</sup></code> matchstick. You want to use <strong>all the matchsticks</strong> to make one square. You <strong>should not break</strong> any stick, but you can link them up, and each matchstick must be used <strong>exactly one time</strong>.</p>\n\n<p>Return <code>true</code> if you can make this square and <code>false</code> otherwise.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2021/04/09/matchsticks1-grid.jpg\" style=\"width: 253px; height: 253px;\" />\n<pre>\n<strong>Input:</strong> matchsticks = [1,1,2,2,2]\n<strong>Output:</strong> true\n<strong>Explanation:</strong> You can form a square with length 2, one side of the square came two sticks with length 1.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> matchsticks = [3,3,3,3,4]\n<strong>Output:</strong> false\n<strong>Explanation:</strong> You cannot find a way to form a square with all the matchsticks.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= matchsticks.length &lt;= 15</code></li>\n\t<li><code>1 &lt;= matchsticks[i] &lt;= 10<sup>8</sup></code></li>\n</ul>\n",
      "lcSlug": "matchsticks-to-square",
      "summary": "Subset sum partition — state invariant, then loop."
    },
    {
      "id": "bt-24",
      "title": "Gray Code",
      "lc": 89,
      "importance": "nice",
      "subtopic": "permutations",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "n",
          "out": "sequence"
        }
      ],
      "approaches": [
        {
          "name": "Gray code",
          "time": "O(2^n)",
          "space": "O(1)",
          "code": "vector<int> grayCode(int n) {\n    vector<int> ans; for(int i=0;i<(1<<n);i++) ans.push_back(i^(i>>1)); return ans;\n}"
        }
      ],
      "description": "An n-bit gray code sequence is a sequence of `2n` integers where:\n\n\t• Every integer is in the inclusive range `[0, 2n - 1]`,\n• The first integer is `0`,\n• An integer appears no more than once in the sequence,\n• The binary representation of every pair of adjacent integers differs by exactly one bit, and\n• The binary representation of the first and last integers differs by exactly one bit.\n\nGiven an integer `n`, return any valid n-bit gray code sequence.\n\n \n\nExample 1:\n\nInput: n = 2\nOutput: [0,1,3,2]\nExplanation:\nThe binary representation of [0,1,3,2] is [00,01,11,10].\n- 00 and 01 differ by one bit\n- 01 and 11 differ by one bit\n- 11 and 10 differ by one bit\n- 10 and 00 differ by one bit\n[0,2,3,1] is also a valid gray code sequence, whose binary representation is [00,10,11,01].\n- 00 and 10 differ by one bit\n- 10 and 11 differ by one bit\n- 11 and 01 differ by one bit\n- 01 and 00 differ by one bit\n\nExample 2:\n\nInput: n = 1\nOutput: [0,1]\n\n \n\nConstraints:\n\n\t• `1",
      "descriptionHtml": "<p>An <strong>n-bit gray code sequence</strong> is a sequence of <code>2<sup>n</sup></code> integers where:</p>\n\n<ul>\n\t<li>Every integer is in the <strong>inclusive</strong> range <code>[0, 2<sup>n</sup> - 1]</code>,</li>\n\t<li>The first integer is <code>0</code>,</li>\n\t<li>An integer appears <strong>no more than once</strong> in the sequence,</li>\n\t<li>The binary representation of every pair of <strong>adjacent</strong> integers differs by <strong>exactly one bit</strong>, and</li>\n\t<li>The binary representation of the <strong>first</strong> and <strong>last</strong> integers differs by <strong>exactly one bit</strong>.</li>\n</ul>\n\n<p>Given an integer <code>n</code>, return <em>any valid <strong>n-bit gray code sequence</strong></em>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> n = 2\n<strong>Output:</strong> [0,1,3,2]\n<strong>Explanation:</strong>\nThe binary representation of [0,1,3,2] is [00,01,11,10].\n- 0<u>0</u> and 0<u>1</u> differ by one bit\n- <u>0</u>1 and <u>1</u>1 differ by one bit\n- 1<u>1</u> and 1<u>0</u> differ by one bit\n- <u>1</u>0 and <u>0</u>0 differ by one bit\n[0,2,3,1] is also a valid gray code sequence, whose binary representation is [00,10,11,01].\n- <u>0</u>0 and <u>1</u>0 differ by one bit\n- 1<u>0</u> and 1<u>1</u> differ by one bit\n- <u>1</u>1 and <u>0</u>1 differ by one bit\n- 0<u>1</u> and 0<u>0</u> differ by one bit\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> n = 1\n<strong>Output:</strong> [0,1]\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= n &lt;= 16</code></li>\n</ul>\n",
      "lcSlug": "gray-code",
      "summary": "Gray code — state invariant, then loop."
    },
    {
      "id": "bt-25",
      "title": "Factor Combinations",
      "lc": 254,
      "importance": "nice",
      "subtopic": "combinations",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "n",
          "out": "factors"
        }
      ],
      "approaches": [
        {
          "name": "Backtrack factors",
          "time": "O(2^sqrt n)",
          "space": "O(log n)",
          "code": "void dfs(int start,int n,vector<int>& path,vector<vector<int>>& ans){\n    if(n==1 && !path.empty()){ ans.push_back(path); return; }\n    for(int i=start;i*i<=n;i++) if(n%i==0){\n        path.push_back(i); dfs(i,n/i,path,ans); path.pop_back();\n        if(i==1) break;\n    }\n    if(n>=start){ path.push_back(n); ans.push_back(path); path.pop_back(); }\n}\nvector<vector<int>> getFactors(int n){ vector<vector<int>> ans; vector<int> p; dfs(2,n,p,ans); return ans; }"
        }
      ],
      "description": "Numbers can be regarded as the product of their factors.\n\n\t• For example, `8 = 2 x 2 x 2 = 2 x 4`.\n\nGiven an integer `n`, return all possible combinations of its factors. You may return the answer in any order.\n\nNote that the factors should be in the range `[2, n - 1]`.\n\n&nbsp;\n\nExample 1:\n\nInput: n = 1\nOutput: []\n\nExample 2:\n\nInput: n = 12\nOutput: [[2,6],[3,4],[2,2,3]]\n\nExample 3:\n\nInput: n = 37\nOutput: []\n\n&nbsp;\n\nConstraints:\n\n\t• `1 7`",
      "descriptionHtml": "<p>Numbers can be regarded as the product of their factors.</p>\n\n<ul>\n\t<li>For example, <code>8 = 2 x 2 x 2 = 2 x 4</code>.</li>\n</ul>\n\n<p>Given an integer <code>n</code>, return <em>all possible combinations of its factors</em>. You may return the answer in <strong>any order</strong>.</p>\n\n<p><strong>Note</strong> that the factors should be in the range <code>[2, n - 1]</code>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> n = 1\n<strong>Output:</strong> []\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> n = 12\n<strong>Output:</strong> [[2,6],[3,4],[2,2,3]]\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> n = 37\n<strong>Output:</strong> []\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 <= n <= 10<sup>7</sup></code></li>\n</ul>",
      "lcSlug": "factor-combinations",
      "summary": "Backtrack factors — state invariant, then loop."
    },
    {
      "id": "bt-26",
      "title": "Expression Add Operators",
      "lc": 282,
      "importance": "nice",
      "subtopic": "string",
      "difficulty": "Hard",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "num, target",
          "out": "expressions"
        }
      ],
      "approaches": [
        {
          "name": "Backtrack ops",
          "time": "O(4^n)",
          "space": "O(n)",
          "code": "void dfs(string& num,int i,long long cur,long long prev,string& path,vector<string>& ans,int target){\n    if(i==(int)num.size()){ if(cur==target) ans.push_back(path); return; }\n    for(int j=i;j<(int)num.size();j++){\n        if(j>i && num[i]=='0') break;\n        long long v=stoll(num.substr(i,j-i+1));\n        if(i==0){ path=to_string(v); dfs(num,j+1,v,v,path,ans,target); }\n        else{\n            path+='+'; path+=to_string(v); dfs(num,j+1,cur+v,v,path,ans,target); path.pop_back(); path.pop_back(); path.pop_back(); path.pop_back();\n            path+='-'; path+=to_string(v); dfs(num,j+1,cur-v,-v,path,ans,target); path.pop_back(); path.pop_back(); path.pop_back(); path.pop_back();\n            path+='*'; path+=to_string(v); dfs(num,j+1,cur-prev+prev*v,prev*v,path,ans,target); path.pop_back(); path.pop_back(); path.pop_back(); path.pop_back();\n        }\n    }\n}\nvector<string> addOperators(string num,int target){ vector<string> ans,path; dfs(num,0,0,0,path,ans,target); return ans; }"
        }
      ],
      "description": "Given a string `num` that contains only digits and an integer `target`, return all possibilities to insert the binary operators `'+'`, `'-'`, and/or `'*'` between the digits of `num` so that the resultant expression evaluates to the `target` value.\n\nNote that operands in the returned expressions should not contain leading zeros.\n\nNote that a number can contain multiple digits.\n\n \n\nExample 1:\n\nInput: num = \"123\", target = 6\nOutput: [\"1*2*3\",\"1+2+3\"]\nExplanation: Both \"1*2*3\" and \"1+2+3\" evaluate to 6.\n\nExample 2:\n\nInput: num = \"232\", target = 8\nOutput: [\"2*3+2\",\"2+3*2\"]\nExplanation: Both \"2*3+2\" and \"2+3*2\" evaluate to 8.\n\nExample 3:\n\nInput: num = \"3456237490\", target = 9191\nOutput: []\nExplanation: There are no expressions that can be created from \"3456237490\" to evaluate to 9191.\n\n \n\nConstraints:\n\n\t• `1 31 31 - 1`",
      "descriptionHtml": "<p>Given a string <code>num</code> that contains only digits and an integer <code>target</code>, return <em><strong>all possibilities</strong> to insert the binary operators </em><code>&#39;+&#39;</code><em>, </em><code>&#39;-&#39;</code><em>, and/or </em><code>&#39;*&#39;</code><em> between the digits of </em><code>num</code><em> so that the resultant expression evaluates to the </em><code>target</code><em> value</em>.</p>\n\n<p>Note that operands in the returned expressions <strong>should not</strong> contain leading zeros.</p>\n\n<p><strong>Note</strong> that a number can contain multiple digits.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> num = &quot;123&quot;, target = 6\n<strong>Output:</strong> [&quot;1*2*3&quot;,&quot;1+2+3&quot;]\n<strong>Explanation:</strong> Both &quot;1*2*3&quot; and &quot;1+2+3&quot; evaluate to 6.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> num = &quot;232&quot;, target = 8\n<strong>Output:</strong> [&quot;2*3+2&quot;,&quot;2+3*2&quot;]\n<strong>Explanation:</strong> Both &quot;2*3+2&quot; and &quot;2+3*2&quot; evaluate to 8.\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> num = &quot;3456237490&quot;, target = 9191\n<strong>Output:</strong> []\n<strong>Explanation:</strong> There are no expressions that can be created from &quot;3456237490&quot; to evaluate to 9191.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= num.length &lt;= 10</code></li>\n\t<li><code>num</code> consists of only digits.</li>\n\t<li><code>-2<sup>31</sup> &lt;= target &lt;= 2<sup>31</sup> - 1</code></li>\n</ul>\n",
      "lcSlug": "expression-add-operators",
      "summary": "Backtrack ops — state invariant, then loop."
    },
    {
      "id": "bt-27",
      "title": "Word Pattern II",
      "lc": 291,
      "importance": "nice",
      "subtopic": "string",
      "difficulty": "Hard",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "pattern, s",
          "out": "match?"
        }
      ],
      "approaches": [
        {
          "name": "Backtrack pattern map",
          "time": "O(n^m)",
          "space": "O(n)",
          "code": "bool match(string& pattern, string& s, int i, int j, unordered_map<char,string>& p2s, unordered_map<string,char>& s2p){\n    if(i==(int)pattern.size()) return j==(int)s.size();\n    char pc=pattern[i];\n    if(p2s.count(pc)){\n        string w=p2s[pc]; if(s.compare(j,w.size())!=0) return false;\n        return match(pattern,s,i+1,j+w.size(),p2s,s2p);\n    }\n    for(int k=j;k<(int)s.size();k++){\n        string w=s.substr(j,k-j+1);\n        if(s2p.count(w)) continue;\n        p2s[pc]=w; s2p[w]=pc;\n        if(match(pattern,s,i+1,k+1,p2s,s2p)) return true;\n        p2s.erase(pc); s2p.erase(w);\n    } return false;\n}\nbool wordPatternMatch(string pattern,string s){ unordered_map<char,string> a; unordered_map<string,char> b; return match(pattern,s,0,0,a,b); }"
        }
      ],
      "description": "Given a `pattern` and a string `s`, return `true` if `s` matches the `pattern`.\n\nA string `s` matches a `pattern` if there is some bijective mapping of single characters to non-empty strings such that if each character in `pattern` is replaced by the string it maps to, then the resulting string is `s`. A bijective mapping means that no two characters map to the same string, and no character maps to two different strings.\n\n&nbsp;\n\nExample 1:\n\nInput: pattern = \"abab\", s = \"redblueredblue\"\nOutput: true\nExplanation: One possible mapping is as follows:\n'a' -> \"red\"\n'b' -> \"blue\"\n\nExample 2:\n\nInput: pattern = \"aaaa\", s = \"asdasdasdasd\"\nOutput: true\nExplanation: One possible mapping is as follows:\n'a' -> \"asd\"\n\nExample 3:\n\nInput: pattern = \"aabb\", s = \"xyzabcxzyabc\"\nOutput: false\n\n&nbsp;\n\nConstraints:\n\n\t• `1",
      "descriptionHtml": "<p>Given a <code>pattern</code> and a string <code>s</code>, return <code>true</code><em> if </em><code>s</code><em> <strong>matches</strong> the </em><code>pattern</code><em>.</em></p>\n\n<p>A string <code>s</code> <b>matches</b> a <code>pattern</code> if there is some <strong>bijective mapping</strong> of single characters to <strong>non-empty</strong> strings such that if each character in <code>pattern</code> is replaced by the string it maps to, then the resulting string is <code>s</code>. A <strong>bijective mapping</strong> means that no two characters map to the same string, and no character maps to two different strings.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> pattern = &quot;abab&quot;, s = &quot;redblueredblue&quot;\n<strong>Output:</strong> true\n<strong>Explanation:</strong> One possible mapping is as follows:\n&#39;a&#39; -> &quot;red&quot;\n&#39;b&#39; -> &quot;blue&quot;</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> pattern = &quot;aaaa&quot;, s = &quot;asdasdasdasd&quot;\n<strong>Output:</strong> true\n<strong>Explanation:</strong> One possible mapping is as follows:\n&#39;a&#39; -> &quot;asd&quot;\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> pattern = &quot;aabb&quot;, s = &quot;xyzabcxzyabc&quot;\n<strong>Output:</strong> false\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 <= pattern.length, s.length <= 20</code></li>\n\t<li><code>pattern</code> and <code>s</code> consist of only lowercase English letters.</li>\n</ul>",
      "lcSlug": "word-pattern-ii",
      "summary": "Backtrack pattern map — state invariant, then loop."
    },
    {
      "id": "bt-28",
      "title": "Android Unlock Patterns",
      "lc": 351,
      "importance": "nice",
      "subtopic": "grid",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "m,n",
          "out": "count"
        }
      ],
      "approaches": [
        {
          "name": "DFS + jump table",
          "time": "O(9!)",
          "space": "O(1)",
          "code": "int numberOfPatterns(int m, int n) {\n    int jump[10][10]={};\n    jump[1][3]=jump[3][1]=2; jump[1][7]=jump[7][1]=4; jump[3][9]=jump[9][3]=6;\n    jump[7][9]=jump[9][7]=8; jump[1][9]=jump[9][1]=jump[3][7]=jump[7][3]=5;\n    jump[2][8]=jump[8][2]=5; jump[4][6]=jump[6][4]=5;\n    int ans=0;\n    function<void(int,int,int)> dfs=[&](int len,int last,int mask){\n        if(len>=m) ans++;\n        if(len==n) return;\n        for(int d=1;d<=9;d++){\n            int j = last? jump[last][d] : 0;\n            if((!last || (!j || (mask&(1<<j)))) && !(mask&(1<<d)))\n                dfs(len+1,d,mask|(1<<d));\n        }\n    };\n    dfs(0,0,0); return ans;\n}"
        }
      ],
      "description": "Android devices have a special lock screen with a `3 x 3` grid of dots. Users can set an \"unlock pattern\" by connecting the dots in a specific sequence, forming a series of joined line segments where each segment's endpoints are two consecutive dots in the sequence. A sequence of `k` dots is a valid unlock pattern if both of the following are true:\n\n\t• All the dots in the sequence are distinct.\n• If the line segment connecting two consecutive dots in the sequence passes through the center of any other dot, the other dot must have previously appeared in the sequence. No jumps through the center non-selected dots are allowed.\n\t\n\t\t• For example, connecting dots `2` and `9` without dots `5` or `6` appearing beforehand is valid because the line from dot `2` to dot `9` does not pass through the center of either dot `5` or `6`.\n• However, connecting dots `1` and `3` without dot `2` appearing beforehand is invalid because the line from dot `1` to dot `3` passes through the center of dot `2`.\n\n\t\n\nHere are some example valid and invalid unlock patterns:\n\n\t• The 1st pattern `[4,1,3,6]` is invalid because the line connecting dots `1` and `3` pass through dot `2`, but dot `2` did not previously appear in the sequence.\n• The 2nd pattern `[4,1,9,2]` is invalid because the line connecting dots `1` and `9` pass through dot `5`, but dot `5` did not previously appear in the sequence.\n• The 3rd pattern `[2,4,1,3,6]` is valid because it follows the conditions. The line connecting dots `1` and `3` meets the condition because dot `2` previously appeared in the sequence.\n• The 4th pattern `[6,5,4,1,9,2]` is valid because it follows the conditions. The line connecting dots `1` and `9` meets the condition because dot `5` previously appeared in the sequence.\n\nGiven two integers `m` and `n`, return the number of unique and valid unlock patterns of the Android grid lock screen that consist of at least `m` keys and at most `n` keys.\n\nTwo unlock patterns are considered unique if there is a dot in one sequence that is not in the other, or the order of the dots is different.\n\n&nbsp;\n\nExample 1:\n\nInput: m = 1, n = 1\nOutput: 9\n\nExample 2:\n\nInput: m = 1, n = 2\nOutput: 65\n\n&nbsp;\n\nConstraints:\n\n\t• `1",
      "descriptionHtml": "<p>Android devices have a special lock screen with a <code>3 x 3</code> grid of dots. Users can set an &quot;unlock pattern&quot; by connecting the dots in a specific sequence, forming a series of joined line segments where each segment&#39;s endpoints are two consecutive dots in the sequence. A sequence of <code>k</code> dots is a <strong>valid</strong> unlock pattern if both of the following are true:</p>\n\n<ul>\n\t<li>All the dots in the sequence are <strong>distinct</strong>.</li>\n\t<li>If the line segment connecting two consecutive dots in the sequence passes through the <strong>center</strong> of any other dot, the other dot <strong>must have previously appeared</strong> in the sequence. No jumps through the center non-selected dots are allowed.\n\t<ul>\n\t\t<li>For example, connecting dots <code>2</code> and <code>9</code> without dots <code>5</code> or <code>6</code> appearing beforehand is valid because the line from dot <code>2</code> to dot <code>9</code> does not pass through the center of either dot <code>5</code> or <code>6</code>.</li>\n\t\t<li>However, connecting dots <code>1</code> and <code>3</code> without dot <code>2</code> appearing beforehand is invalid because the line from dot <code>1</code> to dot <code>3</code> passes through the center of dot <code>2</code>.</li>\n\t</ul>\n\t</li>\n</ul>\n\n<p>Here are some example valid and invalid unlock patterns:</p>\n\n<p><img src=\"https://fastly.jsdelivr.net/gh/doocs/leetcode@main/solution/0300-0399/0351.Android%20Unlock%20Patterns/images/android-unlock.png\" style=\"width: 418px; height: 128px;\" /></p>\n\n<ul>\n\t<li>The 1st pattern <code>[4,1,3,6]</code> is invalid because the line connecting dots <code>1</code> and <code>3</code> pass through dot <code>2</code>, but dot <code>2</code> did not previously appear in the sequence.</li>\n\t<li>The 2nd pattern <code>[4,1,9,2]</code> is invalid because the line connecting dots <code>1</code> and <code>9</code> pass through dot <code>5</code>, but dot <code>5</code> did not previously appear in the sequence.</li>\n\t<li>The 3rd pattern <code>[2,4,1,3,6]</code> is valid because it follows the conditions. The line connecting dots <code>1</code> and <code>3</code> meets the condition because dot <code>2</code> previously appeared in the sequence.</li>\n\t<li>The 4th pattern <code>[6,5,4,1,9,2]</code> is valid because it follows the conditions. The line connecting dots <code>1</code> and <code>9</code> meets the condition because dot <code>5</code> previously appeared in the sequence.</li>\n</ul>\n\n<p>Given two integers <code>m</code> and <code>n</code>, return <em>the <strong>number of unique and valid unlock patterns</strong> of the Android grid lock screen that consist of <strong>at least</strong> </em><code>m</code><em> keys and <strong>at most</strong> </em><code>n</code><em> keys.</em></p>\n\n<p>Two unlock patterns are considered <strong>unique</strong> if there is a dot in one sequence that is not in the other, or the order of the dots is different.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> m = 1, n = 1\n<strong>Output:</strong> 9\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> m = 1, n = 2\n<strong>Output:</strong> 65\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 <= m, n <= 9</code></li>\n</ul>",
      "lcSlug": "android-unlock-patterns",
      "summary": "DFS + jump table — 2D DP on grid — often row-by-row or with rolling array."
    }
  ]
};
