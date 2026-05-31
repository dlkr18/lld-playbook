window.PRACTICE_TOPIC = {
  "id": "arrays",
  "title": "Arrays & Hashing",
  "expected_count": 28,
  "strategy": "<strong>Speed-run:</strong> hashmap,hashset,prefix — filter Must do first. Filter <em>Must do</em> first.",
  "subtopics": [
    {
      "id": "hashmap",
      "label": "HashMap"
    },
    {
      "id": "hashset",
      "label": "HashSet"
    },
    {
      "id": "prefix",
      "label": "Prefix"
    },
    {
      "id": "counting",
      "label": "Counting"
    },
    {
      "id": "design",
      "label": "Design"
    },
    {
      "id": "matrix",
      "label": "Matrix"
    },
    {
      "id": "indexing",
      "label": "Indexing"
    },
    {
      "id": "kadane",
      "label": "Kadane"
    }
  ],
  "questions": [
    {
      "id": "arr-01",
      "title": "Two Sum",
      "lc": 1,
      "importance": "must",
      "subtopic": "hashmap",
      "difficulty": "Easy",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums=[2,7], target=9",
          "out": "9"
        }
      ],
      "approaches": [
        {
          "name": "HashMap complement",
          "time": "O(n)",
          "space": "O(n)",
          "code": "vector<int> twoSum(vector<int>& nums, int target) {\n    unordered_map<int,int> mp;\n    for (int i = 0; i < (int)nums.size(); i++) {\n        if (mp.count(target - nums[i])) return {mp[target-nums[i]], i};\n        mp[nums[i]] = i;\n    } return {};\n}"
        }
      ],
      "description": "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.\n\n \n\nExample 1:\n\nInput: nums = [2,7,11,15], target = 9\nOutput: [0,1]\nExplanation: Because nums[0] + nums[1] == 9, we return [0, 1].\n\nExample 2:\n\nInput: nums = [3,2,4], target = 6\nOutput: [1,2]\n\nExample 3:\n\nInput: nums = [3,3], target = 6\nOutput: [0,1]\n\n \n\nConstraints:\n\n\t• `2 4`\n• `-109 9`\n• `-109 9`\n• Only one valid answer exists.\n\n \nFollow-up: Can you come up with an algorithm that is less than `O(n2)` time complexity?",
      "descriptionHtml": "<p>Given an array of integers <code>nums</code>&nbsp;and an integer <code>target</code>, return <em>indices of the two numbers such that they add up to <code>target</code></em>.</p>\n\n<p>You may assume that each input would have <strong><em>exactly</em> one solution</strong>, and you may not use the <em>same</em> element twice.</p>\n\n<p>You can return the answer in any order.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [2,7,11,15], target = 9\n<strong>Output:</strong> [0,1]\n<strong>Explanation:</strong> Because nums[0] + nums[1] == 9, we return [0, 1].\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [3,2,4], target = 6\n<strong>Output:</strong> [1,2]\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [3,3], target = 6\n<strong>Output:</strong> [0,1]\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>2 &lt;= nums.length &lt;= 10<sup>4</sup></code></li>\n\t<li><code>-10<sup>9</sup> &lt;= nums[i] &lt;= 10<sup>9</sup></code></li>\n\t<li><code>-10<sup>9</sup> &lt;= target &lt;= 10<sup>9</sup></code></li>\n\t<li><strong>Only one valid answer exists.</strong></li>\n</ul>\n\n<p>&nbsp;</p>\n<strong>Follow-up:&nbsp;</strong>Can you come up with an algorithm that is less than <code>O(n<sup>2</sup>)</code><font face=\"monospace\">&nbsp;</font>time complexity?",
      "lcSlug": "two-sum",
      "summary": "One pass: if (target - x) in map → return; else store index of x."
    },
    {
      "id": "arr-02",
      "title": "Group Anagrams",
      "lc": 49,
      "importance": "must",
      "subtopic": "hashmap",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "strs=[\"eat\",\"tea\",\"tan\"]",
          "out": "grouped lists"
        }
      ],
      "approaches": [
        {
          "name": "Sort/freq key grouping",
          "time": "O(nk log k)",
          "space": "O(nk)",
          "code": "vector<vector<string>> groupAnagrams(vector<string>& strs) {\n    unordered_map<string, vector<string>> mp;\n    for (string& s : strs) {\n        string k = s; sort(k.begin(), k.end());\n        mp[k].push_back(s);\n    }\n    vector<vector<string>> ans;\n    for (auto& p : mp) ans.push_back(p.second);\n    return ans;\n}"
        }
      ],
      "description": "Given an array of strings `strs`, group the anagrams together. You can return the answer in any order.\n\n \n\nExample 1:\n\nInput: strs = [\"eat\",\"tea\",\"tan\",\"ate\",\"nat\",\"bat\"]\n\nOutput: [[\"bat\"],[\"nat\",\"tan\"],[\"ate\",\"eat\",\"tea\"]]\n\nExplanation:\n\n\t• There is no string in strs that can be rearranged to form `\"bat\"`.\n• The strings `\"nat\"` and `\"tan\"` are anagrams as they can be rearranged to form each other.\n• The strings `\"ate\"`, `\"eat\"`, and `\"tea\"` are anagrams as they can be rearranged to form each other.\n\nExample 2:\n\nInput: strs = [\"\"]\n\nOutput: [[\"\"]]\n\nExample 3:\n\nInput: strs = [\"a\"]\n\nOutput: [[\"a\"]]\n\n \n\nConstraints:\n\n\t• `1 4`\n• `0",
      "descriptionHtml": "<p>Given an array of strings <code>strs</code>, group the <span data-keyword=\"anagram\">anagrams</span> together. You can return the answer in <strong>any order</strong>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<div class=\"example-block\">\n<p><strong>Input:</strong> <span class=\"example-io\">strs = [&quot;eat&quot;,&quot;tea&quot;,&quot;tan&quot;,&quot;ate&quot;,&quot;nat&quot;,&quot;bat&quot;]</span></p>\n\n<p><strong>Output:</strong> <span class=\"example-io\">[[&quot;bat&quot;],[&quot;nat&quot;,&quot;tan&quot;],[&quot;ate&quot;,&quot;eat&quot;,&quot;tea&quot;]]</span></p>\n\n<p><strong>Explanation:</strong></p>\n\n<ul>\n\t<li>There is no string in strs that can be rearranged to form <code>&quot;bat&quot;</code>.</li>\n\t<li>The strings <code>&quot;nat&quot;</code> and <code>&quot;tan&quot;</code> are anagrams as they can be rearranged to form each other.</li>\n\t<li>The strings <code>&quot;ate&quot;</code>, <code>&quot;eat&quot;</code>, and <code>&quot;tea&quot;</code> are anagrams as they can be rearranged to form each other.</li>\n</ul>\n</div>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<div class=\"example-block\">\n<p><strong>Input:</strong> <span class=\"example-io\">strs = [&quot;&quot;]</span></p>\n\n<p><strong>Output:</strong> <span class=\"example-io\">[[&quot;&quot;]]</span></p>\n</div>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<div class=\"example-block\">\n<p><strong>Input:</strong> <span class=\"example-io\">strs = [&quot;a&quot;]</span></p>\n\n<p><strong>Output:</strong> <span class=\"example-io\">[[&quot;a&quot;]]</span></p>\n</div>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= strs.length &lt;= 10<sup>4</sup></code></li>\n\t<li><code>0 &lt;= strs[i].length &lt;= 100</code></li>\n\t<li><code>strs[i]</code> consists of lowercase English letters.</li>\n</ul>\n",
      "lcSlug": "group-anagrams",
      "summary": "Sort/freq key grouping — Hash map for O(1) lookup while scanning — complements, counts, or indices."
    },
    {
      "id": "arr-03",
      "title": "Top K Frequent Elements",
      "lc": 347,
      "importance": "must",
      "subtopic": "hashmap",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums=[1,1,1,2,2,3], k=2",
          "out": "[1,2]"
        }
      ],
      "approaches": [
        {
          "name": "Bucket sort by freq",
          "time": "O(n)",
          "space": "O(n)",
          "code": "vector<int> topKFrequent(vector<int>& nums, int k) {\n    unordered_map<int,int> freq;\n    for (int x : nums) freq[x]++;\n    vector<vector<int>> buckets(nums.size()+1);\n    for (auto& p : freq) buckets[p.second].push_back(p.first);\n    vector<int> ans;\n    for (int i = (int)buckets.size()-1; i >= 0 && (int)ans.size() < k; i--)\n        for (int x : buckets[i]) { ans.push_back(x); if ((int)ans.size()==k) break; }\n    return ans;\n}"
        }
      ],
      "description": "Given an integer array `nums` and an integer `k`, return the `k` most frequent elements. You may return the answer in any order.\n\n \n\nExample 1:\n\nInput: nums = [1,1,1,2,2,3], k = 2\n\nOutput: [1,2]\n\nExample 2:\n\nInput: nums = [1], k = 1\n\nOutput: [1]\n\nExample 3:\n\nInput: nums = [1,2,1,2,1,2,3,1,3,2], k = 2\n\nOutput: [1,2]\n\n \n\nConstraints:\n\n\t• `1 5`\n• `-104 4`\n• `k` is in the range `[1, the number of unique elements in the array]`.\n• It is guaranteed that the answer is unique.\n\n \n\nFollow up: Your algorithm's time complexity must be better than `O(n log n)`, where n is the array's size.",
      "descriptionHtml": "<p>Given an integer array <code>nums</code> and an integer <code>k</code>, return <em>the</em> <code>k</code> <em>most frequent elements</em>. You may return the answer in <strong>any order</strong>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<div class=\"example-block\">\n<p><strong>Input:</strong> <span class=\"example-io\">nums = [1,1,1,2,2,3], k = 2</span></p>\n\n<p><strong>Output:</strong> <span class=\"example-io\">[1,2]</span></p>\n</div>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<div class=\"example-block\">\n<p><strong>Input:</strong> <span class=\"example-io\">nums = [1], k = 1</span></p>\n\n<p><strong>Output:</strong> <span class=\"example-io\">[1]</span></p>\n</div>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<div class=\"example-block\">\n<p><strong>Input:</strong> <span class=\"example-io\">nums = [1,2,1,2,1,2,3,1,3,2], k = 2</span></p>\n\n<p><strong>Output:</strong> <span class=\"example-io\">[1,2]</span></p>\n</div>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= nums.length &lt;= 10<sup>5</sup></code></li>\n\t<li><code>-10<sup>4</sup> &lt;= nums[i] &lt;= 10<sup>4</sup></code></li>\n\t<li><code>k</code> is in the range <code>[1, the number of unique elements in the array]</code>.</li>\n\t<li>It is <strong>guaranteed</strong> that the answer is <strong>unique</strong>.</li>\n</ul>\n\n<p>&nbsp;</p>\n<p><strong>Follow up:</strong> Your algorithm&#39;s time complexity must be better than <code>O(n log n)</code>, where n is the array&#39;s size.</p>\n",
      "lcSlug": "top-k-frequent-elements",
      "summary": "Freq → bucket index; collect from highest freq buckets."
    },
    {
      "id": "arr-04",
      "title": "Longest Consecutive Sequence",
      "lc": 128,
      "importance": "must",
      "subtopic": "hashset",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums=[100,4,200,1,3,2]",
          "out": "4"
        }
      ],
      "approaches": [
        {
          "name": "HashSet sequence heads",
          "time": "O(n)",
          "space": "O(n)",
          "code": "int longestConsecutive(vector<int>& nums) {\n    unordered_set<int> st(nums.begin(), nums.end());\n    int best = 0;\n    for (int x : st) {\n        if (st.count(x-1)) continue;\n        int len = 1;\n        while (st.count(x+len)) len++;\n        best = max(best, len);\n    } return best;\n}"
        }
      ],
      "description": "Given an unsorted array of integers `nums`, return the length of the longest consecutive elements sequence.\n\nYou must write an algorithm that runs in `O(n)` time.\n\n \n\nExample 1:\n\nInput: nums = [100,4,200,1,3,2]\nOutput: 4\nExplanation: The longest consecutive elements sequence is [1, 2, 3, 4]. Therefore its length is 4.\n\nExample 2:\n\nInput: nums = [0,3,7,2,5,8,4,6,0,1]\nOutput: 9\n\nExample 3:\n\nInput: nums = [1,0,1,2]\nOutput: 3\n\n \n\nConstraints:\n\n\t• `0 5`\n• `-109 9`",
      "descriptionHtml": "<p>Given an unsorted array of integers <code>nums</code>, return <em>the length of the longest consecutive elements sequence.</em></p>\n\n<p>You must write an algorithm that runs in&nbsp;<code>O(n)</code>&nbsp;time.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [100,4,200,1,3,2]\n<strong>Output:</strong> 4\n<strong>Explanation:</strong> The longest consecutive elements sequence is <code>[1, 2, 3, 4]</code>. Therefore its length is 4.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [0,3,7,2,5,8,4,6,0,1]\n<strong>Output:</strong> 9\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [1,0,1,2]\n<strong>Output:</strong> 3\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>0 &lt;= nums.length &lt;= 10<sup>5</sup></code></li>\n\t<li><code>-10<sup>9</sup> &lt;= nums[i] &lt;= 10<sup>9</sup></code></li>\n</ul>\n",
      "lcSlug": "longest-consecutive-sequence",
      "summary": "Only start counting at x if x-1 not in set — O(n) consecutive."
    },
    {
      "id": "arr-05",
      "title": "Valid Anagram",
      "lc": 242,
      "importance": "must",
      "subtopic": "counting",
      "difficulty": "Easy",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "s=\"anagram\", t=\"nagaram\"",
          "out": "true"
        }
      ],
      "approaches": [
        {
          "name": "Freq array",
          "time": "O(n)",
          "space": "O(1)",
          "code": "bool isAnagram(string s, string t) {\n    if (s.size() != t.size()) return false;\n    int c[26] = {};\n    for (char ch : s) c[ch-'a']++;\n    for (char ch : t) if (--c[ch-'a'] < 0) return false;\n    return true;\n}"
        }
      ],
      "description": "Given two strings `s` and `t`, return `true` if `t` is an anagram of `s`, and `false` otherwise.\n\n \n\nExample 1:\n\nInput: s = \"anagram\", t = \"nagaram\"\n\nOutput: true\n\nExample 2:\n\nInput: s = \"rat\", t = \"car\"\n\nOutput: false\n\n \n\nConstraints:\n\n\t• `1 4`\n• `s` and `t` consist of lowercase English letters.\n\n \n\nFollow up: What if the inputs contain Unicode characters? How would you adapt your solution to such a case?",
      "descriptionHtml": "<p>Given two strings <code>s</code> and <code>t</code>, return <code>true</code> if <code>t</code> is an <span data-keyword=\"anagram\">anagram</span> of <code>s</code>, and <code>false</code> otherwise.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<div class=\"example-block\">\n<p><strong>Input:</strong> <span class=\"example-io\">s = &quot;anagram&quot;, t = &quot;nagaram&quot;</span></p>\n\n<p><strong>Output:</strong> <span class=\"example-io\">true</span></p>\n</div>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<div class=\"example-block\">\n<p><strong>Input:</strong> <span class=\"example-io\">s = &quot;rat&quot;, t = &quot;car&quot;</span></p>\n\n<p><strong>Output:</strong> <span class=\"example-io\">false</span></p>\n</div>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= s.length, t.length &lt;= 5 * 10<sup>4</sup></code></li>\n\t<li><code>s</code> and <code>t</code> consist of lowercase English letters.</li>\n</ul>\n\n<p>&nbsp;</p>\n<p><strong>Follow up:</strong> What if the inputs contain Unicode characters? How would you adapt your solution to such a case?</p>\n",
      "lcSlug": "valid-anagram",
      "summary": "Freq array — state invariant, then loop."
    },
    {
      "id": "arr-06",
      "title": "Contains Duplicate",
      "lc": 217,
      "importance": "should",
      "subtopic": "hashset",
      "difficulty": "Easy",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums=[1,2,3,1]",
          "out": "true"
        }
      ],
      "approaches": [
        {
          "name": "HashSet",
          "time": "O(n)",
          "space": "O(n)",
          "code": "bool containsDuplicate(vector<int>& nums) {\n    unordered_set<int> s;\n    for (int x : nums) if (!s.insert(x).second) return true;\n    return false;\n}"
        }
      ],
      "description": "Given an integer array `nums`, return `true` if any value appears at least twice in the array, and return `false` if every element is distinct.\n\n \n\nExample 1:\n\nInput: nums = [1,2,3,1]\n\nOutput: true\n\nExplanation:\n\nThe element 1 occurs at the indices 0 and 3.\n\nExample 2:\n\nInput: nums = [1,2,3,4]\n\nOutput: false\n\nExplanation:\n\nAll elements are distinct.\n\nExample 3:\n\nInput: nums = [1,1,1,3,3,4,3,2,4,2]\n\nOutput: true\n\n \n\nConstraints:\n\n\t• `1 5`\n• `-109 9`",
      "descriptionHtml": "<p>Given an integer array <code>nums</code>, return <code>true</code> if any value appears <strong>at least twice</strong> in the array, and return <code>false</code> if every element is distinct.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<div class=\"example-block\">\n<p><strong>Input:</strong> <span class=\"example-io\">nums = [1,2,3,1]</span></p>\n\n<p><strong>Output:</strong> <span class=\"example-io\">true</span></p>\n\n<p><strong>Explanation:</strong></p>\n\n<p>The element 1 occurs at the indices 0 and 3.</p>\n</div>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<div class=\"example-block\">\n<p><strong>Input:</strong> <span class=\"example-io\">nums = [1,2,3,4]</span></p>\n\n<p><strong>Output:</strong> <span class=\"example-io\">false</span></p>\n\n<p><strong>Explanation:</strong></p>\n\n<p>All elements are distinct.</p>\n</div>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<div class=\"example-block\">\n<p><strong>Input:</strong> <span class=\"example-io\">nums = [1,1,1,3,3,4,3,2,4,2]</span></p>\n\n<p><strong>Output:</strong> <span class=\"example-io\">true</span></p>\n</div>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= nums.length &lt;= 10<sup>5</sup></code></li>\n\t<li><code>-10<sup>9</sup> &lt;= nums[i] &lt;= 10<sup>9</sup></code></li>\n</ul>\n",
      "lcSlug": "contains-duplicate",
      "summary": "HashSet — Hash set for O(1) existence — dedupe, cycle detection, or sequence starts."
    },
    {
      "id": "arr-07",
      "title": "Product of Array Except Self",
      "lc": 238,
      "importance": "must",
      "subtopic": "prefix",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums=[1,2,3,4]",
          "out": "[24,12,8,6]"
        }
      ],
      "approaches": [
        {
          "name": "Prefix/suffix product",
          "time": "O(n)",
          "space": "O(1) out",
          "code": "vector<int> productExceptSelf(vector<int>& nums) {\n    int n = nums.size(); vector<int> ans(n, 1);\n    int p = 1; for (int i = 0; i < n; i++) { ans[i] = p; p *= nums[i]; }\n    p = 1; for (int i = n-1; i >= 0; i--) { ans[i] *= p; p *= nums[i]; }\n    return ans;\n}"
        }
      ],
      "description": "Given an integer array `nums`, return an array `answer` such that `answer[i]` is equal to the product of all the elements of `nums` except `nums[i]`.\n\nThe product of any prefix or suffix of `nums` is guaranteed to fit in a 32-bit integer.\n\nYou must write an algorithm that runs in `O(n)` time and without using the division operation.\n\n \n\nExample 1:\n\nInput: nums = [1,2,3,4]\nOutput: [24,12,8,6]\n\nExample 2:\n\nInput: nums = [-1,1,0,-3,3]\nOutput: [0,0,9,0,0]\n\n \n\nConstraints:\n\n\t• `2 5`\n• `-30 \n\n \n\nFollow up: Can you solve the problem in `O(1)` extra space complexity? (The output array does not count as extra space for space complexity analysis.)",
      "descriptionHtml": "<p>Given an integer array <code>nums</code>, return <em>an array</em> <code>answer</code> <em>such that</em> <code>answer[i]</code> <em>is equal to the product of all the elements of</em> <code>nums</code> <em>except</em> <code>nums[i]</code>.</p>\n\n<p>The product of any prefix or suffix of <code>nums</code> is <strong>guaranteed</strong> to fit in a <strong>32-bit</strong> integer.</p>\n\n<p>You must write an algorithm that runs in&nbsp;<code>O(n)</code>&nbsp;time and without using the division operation.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<pre><strong>Input:</strong> nums = [1,2,3,4]\n<strong>Output:</strong> [24,12,8,6]\n</pre><p><strong class=\"example\">Example 2:</strong></p>\n<pre><strong>Input:</strong> nums = [-1,1,0,-3,3]\n<strong>Output:</strong> [0,0,9,0,0]\n</pre>\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>2 &lt;= nums.length &lt;= 10<sup>5</sup></code></li>\n\t<li><code>-30 &lt;= nums[i] &lt;= 30</code></li>\n\t<li>The input is generated such that <code>answer[i]</code> is <strong>guaranteed</strong> to fit in a <strong>32-bit</strong> integer.</li>\n</ul>\n\n<p>&nbsp;</p>\n<p><strong>Follow up:</strong>&nbsp;Can you solve the problem in <code>O(1)</code>&nbsp;extra&nbsp;space complexity? (The output array <strong>does not</strong> count as extra space for space complexity analysis.)</p>\n",
      "lcSlug": "product-of-array-except-self",
      "summary": "Prefix/suffix product — Prefix sums + hash map or difference array for range/subarray queries."
    },
    {
      "id": "arr-08",
      "title": "Encode and Decode Strings",
      "lc": 271,
      "importance": "should",
      "subtopic": "design",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "list of strings",
          "out": "round-trip"
        }
      ],
      "approaches": [
        {
          "name": "Length prefix",
          "time": "O(n)",
          "space": "O(n)",
          "code": "class Codec {\npublic:\n    string encode(vector<string>& strs) {\n        string out;\n        for (string& s : strs) { out += to_string(s.size()) + \"#\" + s; }\n        return out;\n    }\n    vector<string> decode(string s) {\n        vector<string> ans; int i = 0;\n        while (i < (int)s.size()) {\n            int j = s.find('#', i); int len = stoi(s.substr(i, j-i));\n            ans.push_back(s.substr(j+1, len)); i = j + 1 + len;\n        }\n        return ans;\n    }\n};"
        }
      ],
      "description": "Design an algorithm to encode a list of strings to a string. The encoded string is then sent over the network and is decoded back to the original list of strings.\n\nMachine 1 (sender) has the function:\n\nstring encode(vector strs) {\n  // ... your code\n  return encoded_string;\n}\n\nMachine 2 (receiver) has the function:\n\nvector decode(string s) {\n  //... your code\n  return strs;\n}\n\nSo Machine 1 does:\n\nstring encoded_string = encode(strs);\n\nand Machine 2 does:\n\nvector strs2 = decode(encoded_string);\n\n`strs2` in Machine 2 should be the same as `strs` in Machine 1.\n\nImplement the `encode` and `decode` methods.\n\nYou are not allowed to&nbsp;solve the problem using any serialize methods (such as `eval`).\n\n&nbsp;\n\nExample 1:\n\nInput: dummy_input = [\"Hello\",\"World\"]\nOutput: [\"Hello\",\"World\"]\nExplanation:\nMachine 1:\nCodec encoder = new Codec();\nString msg = encoder.encode(strs);\nMachine 1 ---msg---> Machine 2\n\nMachine 2:\nCodec decoder = new Codec();\nString[] strs = decoder.decode(msg);\n\nExample 2:\n\nInput: dummy_input = [\"\"]\nOutput: [\"\"]\n\n&nbsp;\n\nConstraints:\n\n\t• `1 \n\n&nbsp;\n\nFollow up: Could you write a generalized algorithm to work on any possible set of characters?",
      "descriptionHtml": "<p>Design an algorithm to encode <b>a list of strings</b> to <b>a string</b>. The encoded string is then sent over the network and is decoded back to the original list of strings.</p>\n\n<p>Machine 1 (sender) has the function:</p>\n\n<pre>\nstring encode(vector<string> strs) {\n  // ... your code\n  return encoded_string;\n}</pre>\n\nMachine 2 (receiver) has the function:\n\n<pre>\nvector<string> decode(string s) {\n  //... your code\n  return strs;\n}\n</pre>\n\n<p>So Machine 1 does:</p>\n\n<pre>\nstring encoded_string = encode(strs);\n</pre>\n\n<p>and Machine 2 does:</p>\n\n<pre>\nvector<string> strs2 = decode(encoded_string);\n</pre>\n\n<p><code>strs2</code> in Machine 2 should be the same as <code>strs</code> in Machine 1.</p>\n\n<p>Implement the <code>encode</code> and <code>decode</code> methods.</p>\n\n<p>You are not allowed to&nbsp;solve the problem using any serialize methods (such as <code>eval</code>).</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> dummy_input = [&quot;Hello&quot;,&quot;World&quot;]\n<strong>Output:</strong> [&quot;Hello&quot;,&quot;World&quot;]\n<strong>Explanation:</strong>\nMachine 1:\nCodec encoder = new Codec();\nString msg = encoder.encode(strs);\nMachine 1 ---msg---> Machine 2\n\nMachine 2:\nCodec decoder = new Codec();\nString[] strs = decoder.decode(msg);\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> dummy_input = [&quot;&quot;]\n<strong>Output:</strong> [&quot;&quot;]\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 <= strs.length <= 200</code></li>\n\t<li><code>0 <= strs[i].length <= 200</code></li>\n\t<li><code>strs[i]</code> contains any possible characters out of <code>256</code> valid ASCII characters.</li>\n</ul>\n\n<p>&nbsp;</p>\n<p><strong>Follow up: </strong>Could you write a generalized algorithm to work on any possible set of characters?</p>",
      "lcSlug": "encode-and-decode-strings",
      "summary": "encode: len#str; decode read until # then fixed-length slice."
    },
    {
      "id": "arr-09",
      "title": "Subarray Sum Equals K",
      "lc": 560,
      "importance": "must",
      "subtopic": "prefix",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums=[1,1,1], k=2",
          "out": "2"
        }
      ],
      "approaches": [
        {
          "name": "Prefix + hashmap",
          "time": "O(n)",
          "space": "O(n)",
          "code": "int subarraySum(vector<int>& nums, int k) {\n    unordered_map<int,int> cnt{{0,1}}; int sum = 0, ans = 0;\n    for (int x : nums) {\n        sum += x; ans += cnt[sum-k]; cnt[sum]++;\n    } return ans;\n}"
        }
      ],
      "description": "Given an array of integers `nums` and an integer `k`, return the total number of subarrays whose sum equals to `k`.\n\nA subarray is a contiguous non-empty sequence of elements within an array.\n\n \n\nExample 1:\n\nInput: nums = [1,1,1], k = 2\nOutput: 2\n\nExample 2:\n\nInput: nums = [1,2,3], k = 3\nOutput: 2\n\n \n\nConstraints:\n\n\t• `1 4`\n• `-1000 7 7`",
      "descriptionHtml": "<p>Given an array of integers <code>nums</code> and an integer <code>k</code>, return <em>the total number of subarrays whose sum equals to</em> <code>k</code>.</p>\n\n<p>A subarray is a contiguous <strong>non-empty</strong> sequence of elements within an array.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<pre><strong>Input:</strong> nums = [1,1,1], k = 2\n<strong>Output:</strong> 2\n</pre><p><strong class=\"example\">Example 2:</strong></p>\n<pre><strong>Input:</strong> nums = [1,2,3], k = 3\n<strong>Output:</strong> 2\n</pre>\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= nums.length &lt;= 2 * 10<sup>4</sup></code></li>\n\t<li><code>-1000 &lt;= nums[i] &lt;= 1000</code></li>\n\t<li><code>-10<sup>7</sup> &lt;= k &lt;= 10<sup>7</sup></code></li>\n</ul>\n",
      "lcSlug": "subarray-sum-equals-k",
      "summary": "Prefix sum + map of {sum → count/index} for subarray sum k problems."
    },
    {
      "id": "arr-10",
      "title": "First Missing Positive",
      "lc": 41,
      "importance": "must",
      "subtopic": "indexing",
      "difficulty": "Hard",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums=[3,4,-1,1]",
          "out": "2"
        }
      ],
      "approaches": [
        {
          "name": "Index marking",
          "time": "O(n)",
          "space": "O(1)",
          "code": "int firstMissingPositive(vector<int>& nums) {\n    int n = nums.size();\n    for (int i = 0; i < n; i++)\n        while (nums[i] > 0 && nums[i] <= n && nums[nums[i]-1] != nums[i])\n            swap(nums[i], nums[nums[i]-1]);\n    for (int i = 0; i < n; i++) if (nums[i] != i+1) return i+1;\n    return n+1;\n}"
        }
      ],
      "description": "Given an unsorted integer array `nums`. Return the smallest positive integer that is not present in `nums`.\n\nYou must implement an algorithm that runs in `O(n)` time and uses `O(1)` auxiliary space.\n\n \n\nExample 1:\n\nInput: nums = [1,2,0]\nOutput: 3\nExplanation: The numbers in the range [1,2] are all in the array.\n\nExample 2:\n\nInput: nums = [3,4,-1,1]\nOutput: 2\nExplanation: 1 is in the array but 2 is missing.\n\nExample 3:\n\nInput: nums = [7,8,9,11,12]\nOutput: 1\nExplanation: The smallest positive integer 1 is missing.\n\n \n\nConstraints:\n\n\t• `1 5`\n• `-231 31 - 1`",
      "descriptionHtml": "<p>Given an unsorted integer array <code>nums</code>. Return the <em>smallest positive integer</em> that is <em>not present</em> in <code>nums</code>.</p>\n\n<p>You must implement an algorithm that runs in <code>O(n)</code> time and uses <code>O(1)</code> auxiliary space.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [1,2,0]\n<strong>Output:</strong> 3\n<strong>Explanation:</strong> The numbers in the range [1,2] are all in the array.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [3,4,-1,1]\n<strong>Output:</strong> 2\n<strong>Explanation:</strong> 1 is in the array but 2 is missing.\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [7,8,9,11,12]\n<strong>Output:</strong> 1\n<strong>Explanation:</strong> The smallest positive integer 1 is missing.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= nums.length &lt;= 10<sup>5</sup></code></li>\n\t<li><code>-2<sup>31</sup> &lt;= nums[i] &lt;= 2<sup>31</sup> - 1</code></li>\n</ul>\n",
      "lcSlug": "first-missing-positive",
      "summary": "Index marking — state invariant, then loop."
    },
    {
      "id": "arr-11",
      "title": "Set Matrix Zeroes",
      "lc": 73,
      "importance": "should",
      "subtopic": "matrix",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "matrix with 0",
          "out": "zero rows/cols"
        }
      ],
      "approaches": [
        {
          "name": "Set matrix zeroes",
          "time": "O(mn)",
          "space": "O(1)",
          "code": "void setZeroes(vector<vector<int>>& m) {\n    int m0=1, n0=1;\n    for (int i=0;i<(int)m.size();i++) if (!m[i][0]) m0=0;\n    for (int j=0;j<(int)m[0].size();j++) if (!m[0][j]) n0=0;\n    for (int i=1;i<(int)m.size();i++) for (int j=1;j<(int)m[0].size();j++)\n        if (!m[i][j]) { m[i][0]=0; m[0][j]=0; }\n    for (int i=1;i<(int)m.size();i++) for (int j=1;j<(int)m[0].size();j++)\n        if (!m[i][0] || !m[0][j]) m[i][j]=0;\n    if (!m0) for (int i=0;i<(int)m.size();i++) m[i][0]=0;\n    if (!n0) for (int j=0;j<(int)m[0].size();j++) m[0][j]=0;\n}"
        }
      ],
      "description": "Given an `m x n` integer matrix `matrix`, if an element is `0`, set its entire row and column to `0`'s.\n\nYou must do it in place.\n\n \n\nExample 1:\n\nInput: matrix = [[1,1,1],[1,0,1],[1,1,1]]\nOutput: [[1,0,1],[0,0,0],[1,0,1]]\n\nExample 2:\n\nInput: matrix = [[0,1,2,0],[3,4,5,2],[1,3,1,5]]\nOutput: [[0,0,0,0],[0,4,5,0],[0,3,1,0]]\n\n \n\nConstraints:\n\n\t• `m == matrix.length`\n• `n == matrix[0].length`\n• `1 31 31 - 1`\n\n \n\nFollow up:\n\n\t• A straightforward solution using `O(mn)` space is probably a bad idea.\n• A simple improvement uses `O(m + n)` space, but still not the best solution.\n• Could you devise a constant space solution?",
      "descriptionHtml": "<p>Given an <code>m x n</code> integer matrix <code>matrix</code>, if an element is <code>0</code>, set its entire row and column to <code>0</code>&#39;s.</p>\n\n<p>You must do it <a href=\"https://en.wikipedia.org/wiki/In-place_algorithm\" target=\"_blank\">in place</a>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2020/08/17/mat1.jpg\" style=\"width: 450px; height: 169px;\" />\n<pre>\n<strong>Input:</strong> matrix = [[1,1,1],[1,0,1],[1,1,1]]\n<strong>Output:</strong> [[1,0,1],[0,0,0],[1,0,1]]\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2020/08/17/mat2.jpg\" style=\"width: 450px; height: 137px;\" />\n<pre>\n<strong>Input:</strong> matrix = [[0,1,2,0],[3,4,5,2],[1,3,1,5]]\n<strong>Output:</strong> [[0,0,0,0],[0,4,5,0],[0,3,1,0]]\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>m == matrix.length</code></li>\n\t<li><code>n == matrix[0].length</code></li>\n\t<li><code>1 &lt;= m, n &lt;= 200</code></li>\n\t<li><code>-2<sup>31</sup> &lt;= matrix[i][j] &lt;= 2<sup>31</sup> - 1</code></li>\n</ul>\n\n<p>&nbsp;</p>\n<p><strong>Follow up:</strong></p>\n\n<ul>\n\t<li>A straightforward solution using <code>O(mn)</code> space is probably a bad idea.</li>\n\t<li>A simple improvement uses <code>O(m + n)</code> space, but still not the best solution.</li>\n\t<li>Could you devise a constant space solution?</li>\n</ul>\n",
      "lcSlug": "set-matrix-zeroes",
      "summary": "Set matrix zeroes — state invariant, then loop."
    },
    {
      "id": "arr-12",
      "title": "Rotate Image",
      "lc": 48,
      "importance": "should",
      "subtopic": "matrix",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "90° clockwise",
          "out": "in-place"
        }
      ],
      "approaches": [
        {
          "name": "Rotate matrix",
          "time": "O(n^2)",
          "space": "O(1)",
          "code": "void rotate(vector<vector<int>>& m) {\n    int n=m.size(); reverse(m.begin(), m.end());\n    for (int i=0;i<n;i++) for (int j=i+1;j<n;j++) swap(m[i][j], m[j][i]);\n}"
        }
      ],
      "description": "You are given an `n x n` 2D `matrix` representing an image, rotate the image by 90 degrees (clockwise).\n\nYou have to rotate the image in-place, which means you have to modify the input 2D matrix directly. DO NOT allocate another 2D matrix and do the rotation.\n\n \n\nExample 1:\n\nInput: matrix = [[1,2,3],[4,5,6],[7,8,9]]\nOutput: [[7,4,1],[8,5,2],[9,6,3]]\n\nExample 2:\n\nInput: matrix = [[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]]\nOutput: [[15,13,2,5],[14,3,4,1],[12,6,8,9],[16,7,10,11]]\n\n \n\nConstraints:\n\n\t• `n == matrix.length == matrix[i].length`\n• `1",
      "descriptionHtml": "<p>You are given an <code>n x n</code> 2D <code>matrix</code> representing an image, rotate the image by <strong>90</strong> degrees (clockwise).</p>\n\n<p>You have to rotate the image <a href=\"https://en.wikipedia.org/wiki/In-place_algorithm\" target=\"_blank\"><strong>in-place</strong></a>, which means you have to modify the input 2D matrix directly. <strong>DO NOT</strong> allocate another 2D matrix and do the rotation.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2020/08/28/mat1.jpg\" style=\"width: 500px; height: 188px;\" />\n<pre>\n<strong>Input:</strong> matrix = [[1,2,3],[4,5,6],[7,8,9]]\n<strong>Output:</strong> [[7,4,1],[8,5,2],[9,6,3]]\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2020/08/28/mat2.jpg\" style=\"width: 500px; height: 201px;\" />\n<pre>\n<strong>Input:</strong> matrix = [[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]]\n<strong>Output:</strong> [[15,13,2,5],[14,3,4,1],[12,6,8,9],[16,7,10,11]]\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>n == matrix.length == matrix[i].length</code></li>\n\t<li><code>1 &lt;= n &lt;= 20</code></li>\n\t<li><code>-1000 &lt;= matrix[i][j] &lt;= 1000</code></li>\n</ul>\n",
      "lcSlug": "rotate-image",
      "summary": "Rotate matrix — state invariant, then loop."
    },
    {
      "id": "arr-13",
      "title": "Spiral Matrix",
      "lc": 54,
      "importance": "should",
      "subtopic": "matrix",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "m x n matrix",
          "out": "spiral order"
        }
      ],
      "approaches": [
        {
          "name": "Boundary walk",
          "time": "O(mn)",
          "space": "O(1)",
          "code": "vector<int> spiralOrder(vector<vector<int>>& m) {\n    vector<int> ans;\n    if (m.empty()) return ans;\n    int t = 0, b = (int)m.size()-1, l = 0, r = (int)m[0].size()-1;\n    while (t <= b && l <= r) {\n        for (int c = l; c <= r; c++) ans.push_back(m[t][c]); t++;\n        for (int row = t; row <= b; row++) ans.push_back(m[row][r]); r--;\n        if (t <= b) { for (int c = r; c >= l; c--) ans.push_back(m[b][c]); b--; }\n        if (l <= r) { for (int row = b; row >= t; row--) ans.push_back(m[row][l]); l++; }\n    }\n    return ans;\n}"
        }
      ],
      "description": "Given an `m x n` `matrix`, return all elements of the `matrix` in spiral order.\n\n \n\nExample 1:\n\nInput: matrix = [[1,2,3],[4,5,6],[7,8,9]]\nOutput: [1,2,3,6,9,8,7,4,5]\n\nExample 2:\n\nInput: matrix = [[1,2,3,4],[5,6,7,8],[9,10,11,12]]\nOutput: [1,2,3,4,8,12,11,10,9,5,6,7]\n\n \n\nConstraints:\n\n\t• `m == matrix.length`\n• `n == matrix[i].length`\n• `1",
      "descriptionHtml": "<p>Given an <code>m x n</code> <code>matrix</code>, return <em>all elements of the</em> <code>matrix</code> <em>in spiral order</em>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2020/11/13/spiral1.jpg\" style=\"width: 242px; height: 242px;\" />\n<pre>\n<strong>Input:</strong> matrix = [[1,2,3],[4,5,6],[7,8,9]]\n<strong>Output:</strong> [1,2,3,6,9,8,7,4,5]\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2020/11/13/spiral.jpg\" style=\"width: 322px; height: 242px;\" />\n<pre>\n<strong>Input:</strong> matrix = [[1,2,3,4],[5,6,7,8],[9,10,11,12]]\n<strong>Output:</strong> [1,2,3,4,8,12,11,10,9,5,6,7]\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>m == matrix.length</code></li>\n\t<li><code>n == matrix[i].length</code></li>\n\t<li><code>1 &lt;= m, n &lt;= 10</code></li>\n\t<li><code>-100 &lt;= matrix[i][j] &lt;= 100</code></li>\n</ul>\n",
      "lcSlug": "spiral-matrix",
      "summary": "Boundary walk — state invariant, then loop."
    },
    {
      "id": "arr-14",
      "title": "Valid Sudoku",
      "lc": 36,
      "importance": "nice",
      "subtopic": "hashset",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "9x9 board",
          "out": "true/false"
        }
      ],
      "approaches": [
        {
          "name": "Row/col/box sets",
          "time": "O(1)",
          "space": "O(1)",
          "code": "bool isValidSudoku(vector<vector<char>>& b) {\n    bool row[9][9]={}, col[9][9]={}, box[9][9]={};\n    for (int r=0;r<9;r++) for (int c=0;c<9;c++) {\n        if (b[r][c]=='.') continue;\n        int d=b[r][c]-'1', k=(r/3)*3+c/3;\n        if (row[r][d]||col[c][d]||box[k][d]) return false;\n        row[r][d]=col[c][d]=box[k][d]=true;\n    } return true;\n}"
        }
      ],
      "description": "Determine if a `9 x 9` Sudoku board is valid. Only the filled cells need to be validated according to the following rules:\n\n\t• Each row must contain the digits `1-9` without repetition.\n• Each column must contain the digits `1-9` without repetition.\n• Each of the nine `3 x 3` sub-boxes of the grid must contain the digits `1-9` without repetition.\n\nNote:\n\n\t• A Sudoku board (partially filled) could be valid but is not necessarily solvable.\n• Only the filled cells need to be validated according to the mentioned rules.\n\n \n\nExample 1:\n\nInput: board = \n[[\"5\",\"3\",\".\",\".\",\"7\",\".\",\".\",\".\",\".\"]\n,[\"6\",\".\",\".\",\"1\",\"9\",\"5\",\".\",\".\",\".\"]\n,[\".\",\"9\",\"8\",\".\",\".\",\".\",\".\",\"6\",\".\"]\n,[\"8\",\".\",\".\",\".\",\"6\",\".\",\".\",\".\",\"3\"]\n,[\"4\",\".\",\".\",\"8\",\".\",\"3\",\".\",\".\",\"1\"]\n,[\"7\",\".\",\".\",\".\",\"2\",\".\",\".\",\".\",\"6\"]\n,[\".\",\"6\",\".\",\".\",\".\",\".\",\"2\",\"8\",\".\"]\n,[\".\",\".\",\".\",\"4\",\"1\",\"9\",\".\",\".\",\"5\"]\n,[\".\",\".\",\".\",\".\",\"8\",\".\",\".\",\"7\",\"9\"]]\nOutput: true\n\nExample 2:\n\nInput: board = \n[[\"8\",\"3\",\".\",\".\",\"7\",\".\",\".\",\".\",\".\"]\n,[\"6\",\".\",\".\",\"1\",\"9\",\"5\",\".\",\".\",\".\"]\n,[\".\",\"9\",\"8\",\".\",\".\",\".\",\".\",\"6\",\".\"]\n,[\"8\",\".\",\".\",\".\",\"6\",\".\",\".\",\".\",\"3\"]\n,[\"4\",\".\",\".\",\"8\",\".\",\"3\",\".\",\".\",\"1\"]\n,[\"7\",\".\",\".\",\".\",\"2\",\".\",\".\",\".\",\"6\"]\n,[\".\",\"6\",\".\",\".\",\".\",\".\",\"2\",\"8\",\".\"]\n,[\".\",\".\",\".\",\"4\",\"1\",\"9\",\".\",\".\",\"5\"]\n,[\".\",\".\",\".\",\".\",\"8\",\".\",\".\",\"7\",\"9\"]]\nOutput: false\nExplanation: Same as Example 1, except with the 5 in the top left corner being modified to 8. Since there are two 8's in the top left 3x3 sub-box, it is invalid.\n\n \n\nConstraints:\n\n\t• `board.length == 9`\n• `board[i].length == 9`\n• `board[i][j]` is a digit `1-9` or `'.'`.",
      "descriptionHtml": "<p>Determine if a&nbsp;<code>9 x 9</code> Sudoku board&nbsp;is valid.&nbsp;Only the filled cells need to be validated&nbsp;<strong>according to the following rules</strong>:</p>\n\n<ol>\n\t<li>Each row&nbsp;must contain the&nbsp;digits&nbsp;<code>1-9</code> without repetition.</li>\n\t<li>Each column must contain the digits&nbsp;<code>1-9</code>&nbsp;without repetition.</li>\n\t<li>Each of the nine&nbsp;<code>3 x 3</code> sub-boxes of the grid must contain the digits&nbsp;<code>1-9</code>&nbsp;without repetition.</li>\n</ol>\n\n<p><strong>Note:</strong></p>\n\n<ul>\n\t<li>A Sudoku board (partially filled) could be valid but is not necessarily solvable.</li>\n\t<li>Only the filled cells need to be validated according to the mentioned&nbsp;rules.</li>\n</ul>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img src=\"https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Sudoku-by-L2G-20050714.svg/250px-Sudoku-by-L2G-20050714.svg.png\" style=\"height:250px; width:250px\" />\n<pre>\n<strong>Input:</strong> board = \n[[&quot;5&quot;,&quot;3&quot;,&quot;.&quot;,&quot;.&quot;,&quot;7&quot;,&quot;.&quot;,&quot;.&quot;,&quot;.&quot;,&quot;.&quot;]\n,[&quot;6&quot;,&quot;.&quot;,&quot;.&quot;,&quot;1&quot;,&quot;9&quot;,&quot;5&quot;,&quot;.&quot;,&quot;.&quot;,&quot;.&quot;]\n,[&quot;.&quot;,&quot;9&quot;,&quot;8&quot;,&quot;.&quot;,&quot;.&quot;,&quot;.&quot;,&quot;.&quot;,&quot;6&quot;,&quot;.&quot;]\n,[&quot;8&quot;,&quot;.&quot;,&quot;.&quot;,&quot;.&quot;,&quot;6&quot;,&quot;.&quot;,&quot;.&quot;,&quot;.&quot;,&quot;3&quot;]\n,[&quot;4&quot;,&quot;.&quot;,&quot;.&quot;,&quot;8&quot;,&quot;.&quot;,&quot;3&quot;,&quot;.&quot;,&quot;.&quot;,&quot;1&quot;]\n,[&quot;7&quot;,&quot;.&quot;,&quot;.&quot;,&quot;.&quot;,&quot;2&quot;,&quot;.&quot;,&quot;.&quot;,&quot;.&quot;,&quot;6&quot;]\n,[&quot;.&quot;,&quot;6&quot;,&quot;.&quot;,&quot;.&quot;,&quot;.&quot;,&quot;.&quot;,&quot;2&quot;,&quot;8&quot;,&quot;.&quot;]\n,[&quot;.&quot;,&quot;.&quot;,&quot;.&quot;,&quot;4&quot;,&quot;1&quot;,&quot;9&quot;,&quot;.&quot;,&quot;.&quot;,&quot;5&quot;]\n,[&quot;.&quot;,&quot;.&quot;,&quot;.&quot;,&quot;.&quot;,&quot;8&quot;,&quot;.&quot;,&quot;.&quot;,&quot;7&quot;,&quot;9&quot;]]\n<strong>Output:</strong> true\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> board = \n[[&quot;8&quot;,&quot;3&quot;,&quot;.&quot;,&quot;.&quot;,&quot;7&quot;,&quot;.&quot;,&quot;.&quot;,&quot;.&quot;,&quot;.&quot;]\n,[&quot;6&quot;,&quot;.&quot;,&quot;.&quot;,&quot;1&quot;,&quot;9&quot;,&quot;5&quot;,&quot;.&quot;,&quot;.&quot;,&quot;.&quot;]\n,[&quot;.&quot;,&quot;9&quot;,&quot;8&quot;,&quot;.&quot;,&quot;.&quot;,&quot;.&quot;,&quot;.&quot;,&quot;6&quot;,&quot;.&quot;]\n,[&quot;8&quot;,&quot;.&quot;,&quot;.&quot;,&quot;.&quot;,&quot;6&quot;,&quot;.&quot;,&quot;.&quot;,&quot;.&quot;,&quot;3&quot;]\n,[&quot;4&quot;,&quot;.&quot;,&quot;.&quot;,&quot;8&quot;,&quot;.&quot;,&quot;3&quot;,&quot;.&quot;,&quot;.&quot;,&quot;1&quot;]\n,[&quot;7&quot;,&quot;.&quot;,&quot;.&quot;,&quot;.&quot;,&quot;2&quot;,&quot;.&quot;,&quot;.&quot;,&quot;.&quot;,&quot;6&quot;]\n,[&quot;.&quot;,&quot;6&quot;,&quot;.&quot;,&quot;.&quot;,&quot;.&quot;,&quot;.&quot;,&quot;2&quot;,&quot;8&quot;,&quot;.&quot;]\n,[&quot;.&quot;,&quot;.&quot;,&quot;.&quot;,&quot;4&quot;,&quot;1&quot;,&quot;9&quot;,&quot;.&quot;,&quot;.&quot;,&quot;5&quot;]\n,[&quot;.&quot;,&quot;.&quot;,&quot;.&quot;,&quot;.&quot;,&quot;8&quot;,&quot;.&quot;,&quot;.&quot;,&quot;7&quot;,&quot;9&quot;]]\n<strong>Output:</strong> false\n<strong>Explanation:</strong> Same as Example 1, except with the <strong>5</strong> in the top left corner being modified to <strong>8</strong>. Since there are two 8&#39;s in the top left 3x3 sub-box, it is invalid.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>board.length == 9</code></li>\n\t<li><code>board[i].length == 9</code></li>\n\t<li><code>board[i][j]</code> is a digit <code>1-9</code> or <code>&#39;.&#39;</code>.</li>\n</ul>\n",
      "lcSlug": "valid-sudoku",
      "summary": "Row/col/box sets — Hash set for O(1) existence — dedupe, cycle detection, or sequence starts."
    },
    {
      "id": "arr-15",
      "title": "Insert Delete GetRandom O(1)",
      "lc": 380,
      "importance": "should",
      "subtopic": "design",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "randomized set ops",
          "out": "O(1) avg"
        }
      ],
      "approaches": [
        {
          "name": "HashMap + vector",
          "time": "O(1) avg",
          "space": "O(n)",
          "code": "class RandomizedSet {\n    vector<int> arr; unordered_map<int,int> idx;\npublic:\n    bool insert(int val) {\n        if (idx.count(val)) return false;\n        idx[val] = arr.size(); arr.push_back(val); return true;\n    }\n    bool remove(int val) {\n        if (!idx.count(val)) return false;\n        int i = idx[val], last = arr.back();\n        arr[i] = last; idx[last] = i; arr.pop_back(); idx.erase(val); return true;\n    }\n    int getRandom() { return arr[rand() % arr.size()]; }\n};"
        }
      ],
      "description": "Implement the `RandomizedSet` class:\n\n\t• `RandomizedSet()` Initializes the `RandomizedSet` object.\n• `bool insert(int val)` Inserts an item `val` into the set if not present. Returns `true` if the item was not present, `false` otherwise.\n• `bool remove(int val)` Removes an item `val` from the set if present. Returns `true` if the item was present, `false` otherwise.\n• `int getRandom()` Returns a random element from the current set of elements (it's guaranteed that at least one element exists when this method is called). Each element must have the same probability of being returned.\n\nYou must implement the functions of the class such that each function works in average `O(1)` time complexity.\n\n \n\nExample 1:\n\nInput\n[\"RandomizedSet\", \"insert\", \"remove\", \"insert\", \"getRandom\", \"remove\", \"insert\", \"getRandom\"]\n[[], [1], [2], [2], [], [1], [2], []]\nOutput\n[null, true, false, true, 2, true, false, 2]\n\nExplanation\nRandomizedSet randomizedSet = new RandomizedSet();\nrandomizedSet.insert(1); // Inserts 1 to the set. Returns true as 1 was inserted successfully.\nrandomizedSet.remove(2); // Returns false as 2 does not exist in the set.\nrandomizedSet.insert(2); // Inserts 2 to the set, returns true. Set now contains [1,2].\nrandomizedSet.getRandom(); // getRandom() should return either 1 or 2 randomly.\nrandomizedSet.remove(1); // Removes 1 from the set, returns true. Set now contains [2].\nrandomizedSet.insert(2); // 2 was already in the set, so return false.\nrandomizedSet.getRandom(); // Since 2 is the only number in the set, getRandom() will always return 2.\n\n \n\nConstraints:\n\n\t• `-231 31 - 1`\n• At most `2 * ``105` calls will be made to `insert`, `remove`, and `getRandom`.\n• There will be at least one element in the data structure when `getRandom` is called.",
      "descriptionHtml": "<p>Implement the <code>RandomizedSet</code> class:</p>\n\n<ul>\n\t<li><code>RandomizedSet()</code> Initializes the <code>RandomizedSet</code> object.</li>\n\t<li><code>bool insert(int val)</code> Inserts an item <code>val</code> into the set if not present. Returns <code>true</code> if the item was not present, <code>false</code> otherwise.</li>\n\t<li><code>bool remove(int val)</code> Removes an item <code>val</code> from the set if present. Returns <code>true</code> if the item was present, <code>false</code> otherwise.</li>\n\t<li><code>int getRandom()</code> Returns a random element from the current set of elements (it&#39;s guaranteed that at least one element exists when this method is called). Each element must have the <b>same probability</b> of being returned.</li>\n</ul>\n\n<p>You must implement the functions of the class such that each function works in&nbsp;<strong>average</strong>&nbsp;<code>O(1)</code>&nbsp;time complexity.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input</strong>\n[&quot;RandomizedSet&quot;, &quot;insert&quot;, &quot;remove&quot;, &quot;insert&quot;, &quot;getRandom&quot;, &quot;remove&quot;, &quot;insert&quot;, &quot;getRandom&quot;]\n[[], [1], [2], [2], [], [1], [2], []]\n<strong>Output</strong>\n[null, true, false, true, 2, true, false, 2]\n\n<strong>Explanation</strong>\nRandomizedSet randomizedSet = new RandomizedSet();\nrandomizedSet.insert(1); // Inserts 1 to the set. Returns true as 1 was inserted successfully.\nrandomizedSet.remove(2); // Returns false as 2 does not exist in the set.\nrandomizedSet.insert(2); // Inserts 2 to the set, returns true. Set now contains [1,2].\nrandomizedSet.getRandom(); // getRandom() should return either 1 or 2 randomly.\nrandomizedSet.remove(1); // Removes 1 from the set, returns true. Set now contains [2].\nrandomizedSet.insert(2); // 2 was already in the set, so return false.\nrandomizedSet.getRandom(); // Since 2 is the only number in the set, getRandom() will always return 2.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>-2<sup>31</sup> &lt;= val &lt;= 2<sup>31</sup> - 1</code></li>\n\t<li>At most <code>2 *&nbsp;</code><code>10<sup>5</sup></code> calls will be made to <code>insert</code>, <code>remove</code>, and <code>getRandom</code>.</li>\n\t<li>There will be <strong>at least one</strong> element in the data structure when <code>getRandom</code> is called.</li>\n</ul>\n",
      "lcSlug": "insert-delete-getrandom-o1",
      "summary": "HashMap + vector — Class design with required operation complexities — map + structure."
    },
    {
      "id": "arr-16",
      "title": "Contiguous Array",
      "lc": 525,
      "importance": "should",
      "subtopic": "prefix",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "0/1 max equal count",
          "out": "length"
        }
      ],
      "approaches": [
        {
          "name": "Prefix index map",
          "time": "O(n)",
          "space": "O(n)",
          "code": "int findMaxLength(vector<int>& nums) {\n    unordered_map<int,int> first{{0,-1}}; int sum = 0, ans = 0;\n    for (int i = 0; i < (int)nums.size(); i++) {\n        sum += nums[i] ? 1 : -1;\n        if (first.count(sum)) ans = max(ans, i - first[sum]);\n        else first[sum] = i;\n    }\n    return ans;\n}"
        }
      ],
      "description": "Given a binary array `nums`, return the maximum length of a contiguous subarray with an equal number of `0` and `1`.\n\n \n\nExample 1:\n\nInput: nums = [0,1]\nOutput: 2\nExplanation: [0, 1] is the longest contiguous subarray with an equal number of 0 and 1.\n\nExample 2:\n\nInput: nums = [0,1,0]\nOutput: 2\nExplanation: [0, 1] (or [1, 0]) is a longest contiguous subarray with equal number of 0 and 1.\n\nExample 3:\n\nInput: nums = [0,1,1,1,1,1,0,0,0]\nOutput: 6\nExplanation: [1,1,1,0,0,0] is the longest contiguous subarray with equal number of 0 and 1.\n\n \n\nConstraints:\n\n\t• `1 5`\n• `nums[i]` is either `0` or `1`.",
      "descriptionHtml": "<p>Given a binary array <code>nums</code>, return <em>the maximum length of a contiguous subarray with an equal number of </em><code>0</code><em> and </em><code>1</code>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [0,1]\n<strong>Output:</strong> 2\n<strong>Explanation:</strong> [0, 1] is the longest contiguous subarray with an equal number of 0 and 1.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [0,1,0]\n<strong>Output:</strong> 2\n<strong>Explanation:</strong> [0, 1] (or [1, 0]) is a longest contiguous subarray with equal number of 0 and 1.\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [0,1,1,1,1,1,0,0,0]\n<strong>Output:</strong> 6\n<strong>Explanation:</strong> [1,1,1,0,0,0] is the longest contiguous subarray with equal number of 0 and 1.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= nums.length &lt;= 10<sup>5</sup></code></li>\n\t<li><code>nums[i]</code> is either <code>0</code> or <code>1</code>.</li>\n</ul>\n",
      "lcSlug": "contiguous-array",
      "summary": "Map prefix sum → first index; max len when sum repeats."
    },
    {
      "id": "arr-17",
      "title": "Subarray Sum Divisible by K",
      "lc": 974,
      "importance": "nice",
      "subtopic": "prefix",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums, k",
          "out": "count"
        }
      ],
      "approaches": [
        {
          "name": "Prefix mod counts",
          "time": "O(n)",
          "space": "O(k)",
          "code": "int subarraysDivByK(vector<int>& nums, int k) {\n    unordered_map<int,int> cnt{{0,1}}; int sum=0, ans=0;\n    for (int x: nums) { sum=((sum+x)%k+k)%k; ans+=cnt[sum]++; }\n    return ans;\n}"
        }
      ],
      "description": "Given an integer array `nums` and an integer `k`, return the number of non-empty subarrays that have a sum divisible by `k`.\n\nA subarray is a contiguous part of an array.\n\n \n\nExample 1:\n\nInput: nums = [4,5,0,-2,-3,1], k = 5\nOutput: 7\nExplanation: There are 7 subarrays with a sum divisible by k = 5:\n[4, 5, 0, -2, -3, 1], [5], [5, 0], [5, 0, -2, -3], [0], [0, -2, -3], [-2, -3]\n\nExample 2:\n\nInput: nums = [5], k = 9\nOutput: 0\n\n \n\nConstraints:\n\n\t• `1 4`\n• `-104 4`\n• `2 4`",
      "descriptionHtml": "<p>Given an integer array <code>nums</code> and an integer <code>k</code>, return <em>the number of non-empty <strong>subarrays</strong> that have a sum divisible by </em><code>k</code>.</p>\n\n<p>A <strong>subarray</strong> is a <strong>contiguous</strong> part of an array.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [4,5,0,-2,-3,1], k = 5\n<strong>Output:</strong> 7\n<strong>Explanation:</strong> There are 7 subarrays with a sum divisible by k = 5:\n[4, 5, 0, -2, -3, 1], [5], [5, 0], [5, 0, -2, -3], [0], [0, -2, -3], [-2, -3]\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [5], k = 9\n<strong>Output:</strong> 0\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= nums.length &lt;= 3 * 10<sup>4</sup></code></li>\n\t<li><code>-10<sup>4</sup> &lt;= nums[i] &lt;= 10<sup>4</sup></code></li>\n\t<li><code>2 &lt;= k &lt;= 10<sup>4</sup></code></li>\n</ul>\n",
      "lcSlug": "subarray-sums-divisible-by-k",
      "summary": "Prefix mod counts — Prefix sums + hash map or difference array for range/subarray queries."
    },
    {
      "id": "arr-18",
      "title": "Find All Anagrams in String",
      "lc": 438,
      "importance": "should",
      "subtopic": "counting",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "s, p",
          "out": "start indices"
        }
      ],
      "approaches": [
        {
          "name": "Freq window",
          "time": "O(n)",
          "space": "O(1)",
          "code": "vector<int> findAnagrams(string s, string p) {\n    if (p.size() > s.size()) return {};\n    vector<int> need(26), have(26), ans;\n    for (char ch : p) need[ch-'a']++;\n    for (int i = 0; i < (int)s.size(); i++) {\n        have[s[i]-'a']++;\n        if (i >= (int)p.size()) have[s[i-p.size()]-'a']--;\n        if (i >= (int)p.size()-1 && have == need) ans.push_back(i - (int)p.size() + 1);\n    }\n    return ans;\n}"
        }
      ],
      "description": "Given two strings `s` and `p`, return an array of all the start indices of `p`'s anagrams in `s`. You may return the answer in any order.\n\n \n\nExample 1:\n\nInput: s = \"cbaebabacd\", p = \"abc\"\nOutput: [0,6]\nExplanation:\nThe substring with start index = 0 is \"cba\", which is an anagram of \"abc\".\nThe substring with start index = 6 is \"bac\", which is an anagram of \"abc\".\n\nExample 2:\n\nInput: s = \"abab\", p = \"ab\"\nOutput: [0,1,2]\nExplanation:\nThe substring with start index = 0 is \"ab\", which is an anagram of \"ab\".\nThe substring with start index = 1 is \"ba\", which is an anagram of \"ab\".\nThe substring with start index = 2 is \"ab\", which is an anagram of \"ab\".\n\n \n\nConstraints:\n\n\t• `1 4`\n• `s` and `p` consist of lowercase English letters.",
      "descriptionHtml": "<p>Given two strings <code>s</code> and <code>p</code>, return an array of all the start indices of <code>p</code>&#39;s <span data-keyword=\"anagram\">anagrams</span> in <code>s</code>. You may return the answer in <strong>any order</strong>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> s = &quot;cbaebabacd&quot;, p = &quot;abc&quot;\n<strong>Output:</strong> [0,6]\n<strong>Explanation:</strong>\nThe substring with start index = 0 is &quot;cba&quot;, which is an anagram of &quot;abc&quot;.\nThe substring with start index = 6 is &quot;bac&quot;, which is an anagram of &quot;abc&quot;.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> s = &quot;abab&quot;, p = &quot;ab&quot;\n<strong>Output:</strong> [0,1,2]\n<strong>Explanation:</strong>\nThe substring with start index = 0 is &quot;ab&quot;, which is an anagram of &quot;ab&quot;.\nThe substring with start index = 1 is &quot;ba&quot;, which is an anagram of &quot;ab&quot;.\nThe substring with start index = 2 is &quot;ab&quot;, which is an anagram of &quot;ab&quot;.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= s.length, p.length &lt;= 3 * 10<sup>4</sup></code></li>\n\t<li><code>s</code> and <code>p</code> consist of lowercase English letters.</li>\n</ul>\n",
      "lcSlug": "find-all-anagrams-in-a-string",
      "summary": "Fixed/window size — compare 26-count arrays or sliding counts."
    },
    {
      "id": "arr-19",
      "title": "Ransom Note",
      "lc": 383,
      "importance": "nice",
      "subtopic": "counting",
      "difficulty": "Easy",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "ransomNote, magazine",
          "out": "true/false"
        }
      ],
      "approaches": [
        {
          "name": "Freq count",
          "time": "O(n)",
          "space": "O(1)",
          "code": "bool canConstruct(string ransom, string magazine) {\n    int c[26]={}; for (char ch: magazine) c[ch-'a']++;\n    for (char ch: ransom) if (--c[ch-'a']<0) return false;\n    return true;\n}"
        }
      ],
      "description": "Given two strings `ransomNote` and `magazine`, return `true` if `ransomNote` can be constructed by using the letters from `magazine` and `false` otherwise.\n\nEach letter in `magazine` can only be used once in `ransomNote`.\n\n \n\nExample 1:\n\nInput: ransomNote = \"a\", magazine = \"b\"\nOutput: false\n\nExample 2:\n\nInput: ransomNote = \"aa\", magazine = \"ab\"\nOutput: false\n\nExample 3:\n\nInput: ransomNote = \"aa\", magazine = \"aab\"\nOutput: true\n\n \n\nConstraints:\n\n\t• `1 5`\n• `ransomNote` and `magazine` consist of lowercase English letters.",
      "descriptionHtml": "<p>Given two strings <code>ransomNote</code> and <code>magazine</code>, return <code>true</code><em> if </em><code>ransomNote</code><em> can be constructed by using the letters from </em><code>magazine</code><em> and </em><code>false</code><em> otherwise</em>.</p>\n\n<p>Each letter in <code>magazine</code> can only be used once in <code>ransomNote</code>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<pre><strong>Input:</strong> ransomNote = \"a\", magazine = \"b\"\n<strong>Output:</strong> false\n</pre><p><strong class=\"example\">Example 2:</strong></p>\n<pre><strong>Input:</strong> ransomNote = \"aa\", magazine = \"ab\"\n<strong>Output:</strong> false\n</pre><p><strong class=\"example\">Example 3:</strong></p>\n<pre><strong>Input:</strong> ransomNote = \"aa\", magazine = \"aab\"\n<strong>Output:</strong> true\n</pre>\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= ransomNote.length, magazine.length &lt;= 10<sup>5</sup></code></li>\n\t<li><code>ransomNote</code> and <code>magazine</code> consist of lowercase English letters.</li>\n</ul>\n",
      "lcSlug": "ransom-note",
      "summary": "Freq count — state invariant, then loop."
    },
    {
      "id": "arr-20",
      "title": "Intersection of Two Arrays II",
      "lc": 350,
      "importance": "nice",
      "subtopic": "hashmap",
      "difficulty": "Easy",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums1, nums2",
          "out": "intersection"
        }
      ],
      "approaches": [
        {
          "name": "HashMap counts",
          "time": "O(n)",
          "space": "O(n)",
          "code": "vector<int> intersect(vector<int>& a, vector<int>& b) {\n    unordered_map<int,int> cnt; for (int x:a) cnt[x]++;\n    vector<int> ans; for (int x:b) if (cnt[x]-->0) ans.push_back(x);\n    return ans;\n}"
        }
      ],
      "description": "Given two integer arrays `nums1` and `nums2`, return an array of their intersection. Each element in the result must appear as many times as it shows in both arrays and you may return the result in any order.\n\n \n\nExample 1:\n\nInput: nums1 = [1,2,2,1], nums2 = [2,2]\nOutput: [2,2]\n\nExample 2:\n\nInput: nums1 = [4,9,5], nums2 = [9,4,9,8,4]\nOutput: [4,9]\nExplanation: [9,4] is also accepted.\n\n \n\nConstraints:\n\n\t• `1 \n\n \n\nFollow up:\n\n\t• What if the given array is already sorted? How would you optimize your algorithm?\n• What if `nums1`'s size is small compared to `nums2`'s size? Which algorithm is better?\n• What if elements of `nums2` are stored on disk, and the memory is limited such that you cannot load all elements into the memory at once?",
      "descriptionHtml": "<p>Given two integer arrays <code>nums1</code> and <code>nums2</code>, return <em>an array of their intersection</em>. Each element in the result must appear as many times as it shows in both arrays and you may return the result in <strong>any order</strong>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums1 = [1,2,2,1], nums2 = [2,2]\n<strong>Output:</strong> [2,2]\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums1 = [4,9,5], nums2 = [9,4,9,8,4]\n<strong>Output:</strong> [4,9]\n<strong>Explanation:</strong> [9,4] is also accepted.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= nums1.length, nums2.length &lt;= 1000</code></li>\n\t<li><code>0 &lt;= nums1[i], nums2[i] &lt;= 1000</code></li>\n</ul>\n\n<p>&nbsp;</p>\n<p><strong>Follow up:</strong></p>\n\n<ul>\n\t<li>What if the given array is already sorted? How would you optimize your algorithm?</li>\n\t<li>What if <code>nums1</code>&#39;s size is small compared to <code>nums2</code>&#39;s size? Which algorithm is better?</li>\n\t<li>What if elements of <code>nums2</code> are stored on disk, and the memory is limited such that you cannot load all elements into the memory at once?</li>\n</ul>\n",
      "lcSlug": "intersection-of-two-arrays-ii",
      "summary": "HashMap counts — Hash map for O(1) lookup while scanning — complements, counts, or indices."
    },
    {
      "id": "arr-21",
      "title": "Happy Number",
      "lc": 202,
      "importance": "nice",
      "subtopic": "hashset",
      "difficulty": "Easy",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "n=19",
          "out": "true"
        }
      ],
      "approaches": [
        {
          "name": "Floyd cycle on squares",
          "time": "O(log n)",
          "space": "O(1)",
          "code": "int sqSum(int n){ int s=0; while(n){ s+= (n%10)*(n%10); n/=10; } return s; }\nbool isHappy(int n) {\n    int slow=n, fast=n;\n    do { slow=sqSum(slow); fast=sqSum(sqSum(fast)); } while (slow!=fast);\n    return slow==1;\n}"
        }
      ],
      "description": "Write an algorithm to determine if a number `n` is happy.\n\nA happy number is a number defined by the following process:\n\n\t• Starting with any positive integer, replace the number by the sum of the squares of its digits.\n• Repeat the process until the number equals 1 (where it will stay), or it loops endlessly in a cycle which does not include 1.\n• Those numbers for which this process ends in 1 are happy.\n\nReturn `true` if `n` is a happy number, and `false` if not.\n\n \n\nExample 1:\n\nInput: n = 19\nOutput: true\nExplanation:\n12 + 92 = 82\n82 + 22 = 68\n62 + 82 = 100\n12 + 02 + 02 = 1\n\nExample 2:\n\nInput: n = 2\nOutput: false\n\n \n\nConstraints:\n\n\t• `1 31 - 1`",
      "descriptionHtml": "<p>Write an algorithm to determine if a number <code>n</code> is happy.</p>\n\n<p>A <strong>happy number</strong> is a number defined by the following process:</p>\n\n<ul>\n\t<li>Starting with any positive integer, replace the number by the sum of the squares of its digits.</li>\n\t<li>Repeat the process until the number equals 1 (where it will stay), or it <strong>loops endlessly in a cycle</strong> which does not include 1.</li>\n\t<li>Those numbers for which this process <strong>ends in 1</strong> are happy.</li>\n</ul>\n\n<p>Return <code>true</code> <em>if</em> <code>n</code> <em>is a happy number, and</em> <code>false</code> <em>if not</em>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> n = 19\n<strong>Output:</strong> true\n<strong>Explanation:</strong>\n1<sup>2</sup> + 9<sup>2</sup> = 82\n8<sup>2</sup> + 2<sup>2</sup> = 68\n6<sup>2</sup> + 8<sup>2</sup> = 100\n1<sup>2</sup> + 0<sup>2</sup> + 0<sup>2</sup> = 1\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> n = 2\n<strong>Output:</strong> false\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= n &lt;= 2<sup>31</sup> - 1</code></li>\n</ul>\n",
      "lcSlug": "happy-number",
      "summary": "Floyd cycle on squares — Hash set for O(1) existence — dedupe, cycle detection, or sequence starts."
    },
    {
      "id": "arr-22",
      "title": "Isomorphic Strings",
      "lc": 205,
      "importance": "should",
      "subtopic": "hashmap",
      "difficulty": "Easy",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "s=\"egg\", t=\"add\"",
          "out": "true"
        }
      ],
      "approaches": [
        {
          "name": "Two maps",
          "time": "O(n)",
          "space": "O(1)",
          "code": "bool isIsomorphic(string s, string t) {\n    if (s.size() != t.size()) return false;\n    char ms[256]={}, mt[256]={};\n    for (int i = 0; i < (int)s.size(); i++) {\n        if (ms[(unsigned char)s[i]] != mt[(unsigned char)t[i]]) return false;\n        ms[(unsigned char)s[i]] = t[i]; mt[(unsigned char)t[i]] = s[i];\n    }\n    return true;\n}"
        }
      ],
      "description": "Given two strings `s` and `t`, determine if they are isomorphic.\n\nTwo strings `s` and `t` are isomorphic if the characters in `s` can be replaced to get `t`.\n\nAll occurrences of a character must be replaced with another character while preserving the order of characters. No two characters may map to the same character, but a character may map to itself.\n\n \n\nExample 1:\n\nInput: s = \"egg\", t = \"add\"\n\nOutput: true\n\nExplanation:\n\nThe strings `s` and `t` can be made identical by:\n\n\t• Mapping `'e'` to `'a'`.\n• Mapping `'g'` to `'d'`.\n\nExample 2:\n\nInput: s = \"f11\", t = \"b23\"\n\nOutput: false\n\nExplanation:\n\nThe strings `s` and `t` can not be made identical as `'1'` needs to be mapped to both `'2'` and `'3'`.\n\nExample 3:\n\nInput: s = \"paper\", t = \"title\"\n\nOutput: true\n\n \n\nConstraints:\n\n\t• `1 4`\n• `t.length == s.length`\n• `s` and `t` consist of any valid ascii character.",
      "descriptionHtml": "<p>Given two strings <code>s</code> and <code>t</code>, <em>determine if they are isomorphic</em>.</p>\n\n<p>Two strings <code>s</code> and <code>t</code> are isomorphic if the characters in <code>s</code> can be replaced to get <code>t</code>.</p>\n\n<p>All occurrences of a character must be replaced with another character while preserving the order of characters. No two characters may map to the same character, but a character may map to itself.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<div class=\"example-block\">\n<p><strong>Input:</strong> <span class=\"example-io\">s = &quot;egg&quot;, t = &quot;add&quot;</span></p>\n\n<p><strong>Output:</strong> <span class=\"example-io\">true</span></p>\n\n<p><strong>Explanation:</strong></p>\n\n<p>The strings <code>s</code> and <code>t</code> can be made identical by:</p>\n\n<ul>\n\t<li>Mapping <code>&#39;e&#39;</code> to <code>&#39;a&#39;</code>.</li>\n\t<li>Mapping <code>&#39;g&#39;</code> to <code>&#39;d&#39;</code>.</li>\n</ul>\n</div>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<div class=\"example-block\">\n<p><strong>Input:</strong> <span class=\"example-io\">s = &quot;f11&quot;, t = &quot;b23&quot;</span></p>\n\n<p><strong>Output:</strong> <span class=\"example-io\">false</span></p>\n\n<p><strong>Explanation:</strong></p>\n\n<p>The strings <code>s</code> and <code>t</code> can not be made identical as <code>&#39;1&#39;</code> needs to be mapped to both <code>&#39;2&#39;</code> and <code>&#39;3&#39;</code>.</p>\n</div>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<div class=\"example-block\">\n<p><strong>Input:</strong> <span class=\"example-io\">s = &quot;paper&quot;, t = &quot;title&quot;</span></p>\n\n<p><strong>Output:</strong> <span class=\"example-io\">true</span></p>\n</div>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= s.length &lt;= 5 * 10<sup>4</sup></code></li>\n\t<li><code>t.length == s.length</code></li>\n\t<li><code>s</code> and <code>t</code> consist of any valid ascii character.</li>\n</ul>\n",
      "lcSlug": "isomorphic-strings",
      "summary": "Two maps — Hash map for O(1) lookup while scanning — complements, counts, or indices."
    },
    {
      "id": "arr-23",
      "title": "Majority Element",
      "lc": 169,
      "importance": "should",
      "subtopic": "counting",
      "difficulty": "Easy",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums",
          "out": "majority"
        }
      ],
      "approaches": [
        {
          "name": "Boyer-Moore",
          "time": "O(n)",
          "space": "O(1)",
          "code": "int majorityElement(vector<int>& nums) {\n    int cand=0, cnt=0;\n    for (int x: nums) { if (!cnt) { cand=x; cnt=1; } else cnt += (x==cand? 1:-1); }\n    return cand;\n}"
        }
      ],
      "description": "Given an array `nums` of size `n`, return the majority element.\n\nThe majority element is the element that appears more than `&lfloor;n / 2&rfloor;` times. You may assume that the majority element always exists in the array.\n\n \n\nExample 1:\n\nInput: nums = [3,2,3]\nOutput: 3\n\nExample 2:\n\nInput: nums = [2,2,1,1,1,2,2]\nOutput: 2\n\n \n\nConstraints:\n\n\t• `n == nums.length`\n• `1 4`\n• `-109 9`\n• The input is generated such that a majority element will exist in the array.\n\n \nFollow-up: Could you solve the problem in linear time and in `O(1)` space?",
      "descriptionHtml": "<p>Given an array <code>nums</code> of size <code>n</code>, return <em>the majority element</em>.</p>\n\n<p>The majority element is the element that appears more than <code>&lfloor;n / 2&rfloor;</code> times. You may assume that the majority element always exists in the array.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<pre><strong>Input:</strong> nums = [3,2,3]\n<strong>Output:</strong> 3\n</pre><p><strong class=\"example\">Example 2:</strong></p>\n<pre><strong>Input:</strong> nums = [2,2,1,1,1,2,2]\n<strong>Output:</strong> 2\n</pre>\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>n == nums.length</code></li>\n\t<li><code>1 &lt;= n &lt;= 5 * 10<sup>4</sup></code></li>\n\t<li><code>-10<sup>9</sup> &lt;= nums[i] &lt;= 10<sup>9</sup></code></li>\n\t<li>The input is generated such that a majority element will exist in the array.</li>\n</ul>\n\n<p>&nbsp;</p>\n<strong>Follow-up:</strong> Could you solve the problem in linear time and in <code>O(1)</code> space?",
      "lcSlug": "majority-element",
      "summary": "Boyer-Moore — state invariant, then loop."
    },
    {
      "id": "arr-24",
      "title": "Move Zeroes",
      "lc": 283,
      "importance": "should",
      "subtopic": "same-dir",
      "difficulty": "Easy",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums",
          "out": "shift zeros"
        }
      ],
      "approaches": [
        {
          "name": "Two pointers",
          "time": "O(n)",
          "space": "O(1)",
          "code": "void moveZeroes(vector<int>& nums) {\n    int w = 0;\n    for (int x : nums) if (x) nums[w++] = x;\n    while (w < (int)nums.size()) nums[w++] = 0;\n}"
        }
      ],
      "description": "Given an integer array `nums`, move all `0`'s to the end of it while maintaining the relative order of the non-zero elements.\n\nNote that you must do this in-place without making a copy of the array.\n\n \n\nExample 1:\n\nInput: nums = [0,1,0,3,12]\nOutput: [1,3,12,0,0]\n\nExample 2:\n\nInput: nums = [0]\nOutput: [0]\n\n \n\nConstraints:\n\n\t• `1 4`\n• `-231 31 - 1`\n\n \nFollow up: Could you minimize the total number of operations done?",
      "descriptionHtml": "<p>Given an integer array <code>nums</code>, move all <code>0</code>&#39;s to the end of it while maintaining the relative order of the non-zero elements.</p>\n\n<p><strong>Note</strong> that you must do this in-place without making a copy of the array.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<pre><strong>Input:</strong> nums = [0,1,0,3,12]\n<strong>Output:</strong> [1,3,12,0,0]\n</pre><p><strong class=\"example\">Example 2:</strong></p>\n<pre><strong>Input:</strong> nums = [0]\n<strong>Output:</strong> [0]\n</pre>\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= nums.length &lt;= 10<sup>4</sup></code></li>\n\t<li><code>-2<sup>31</sup> &lt;= nums[i] &lt;= 2<sup>31</sup> - 1</code></li>\n</ul>\n\n<p>&nbsp;</p>\n<strong>Follow up:</strong> Could you minimize the total number of operations done?",
      "lcSlug": "move-zeroes",
      "summary": "Opposite ends or same direction — move based on comparison/invariant."
    },
    {
      "id": "arr-25",
      "title": "Best Time to Buy and Sell Stock",
      "lc": 121,
      "importance": "must",
      "subtopic": "scan",
      "difficulty": "Easy",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "prices",
          "out": "max profit"
        }
      ],
      "approaches": [
        {
          "name": "Stock I",
          "time": "O(n)",
          "space": "O(1)",
          "code": "int maxProfit(vector<int>& p) {\n    int minP=INT_MAX, ans=0;\n    for (int x: p) { minP=min(minP,x); ans=max(ans,x-minP); }\n    return ans;\n}"
        }
      ],
      "description": "You are given an array `prices` where `prices[i]` is the price of a given stock on the `ith` day.\n\nYou want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.\n\nReturn the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return `0`.\n\n \n\nExample 1:\n\nInput: prices = [7,1,5,3,6,4]\nOutput: 5\nExplanation: Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5.\nNote that buying on day 2 and selling on day 1 is not allowed because you must buy before you sell.\n\nExample 2:\n\nInput: prices = [7,6,4,3,1]\nOutput: 0\nExplanation: In this case, no transactions are done and the max profit = 0.\n\n \n\nConstraints:\n\n\t• `1 5`\n• `0 4`",
      "descriptionHtml": "<p>You are given an array <code>prices</code> where <code>prices[i]</code> is the price of a given stock on the <code>i<sup>th</sup></code> day.</p>\n\n<p>You want to maximize your profit by choosing a <strong>single day</strong> to buy one stock and choosing a <strong>different day in the future</strong> to sell that stock.</p>\n\n<p>Return <em>the maximum profit you can achieve from this transaction</em>. If you cannot achieve any profit, return <code>0</code>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> prices = [7,1,5,3,6,4]\n<strong>Output:</strong> 5\n<strong>Explanation:</strong> Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5.\nNote that buying on day 2 and selling on day 1 is not allowed because you must buy before you sell.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> prices = [7,6,4,3,1]\n<strong>Output:</strong> 0\n<strong>Explanation:</strong> In this case, no transactions are done and the max profit = 0.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= prices.length &lt;= 10<sup>5</sup></code></li>\n\t<li><code>0 &lt;= prices[i] &lt;= 10<sup>4</sup></code></li>\n</ul>\n",
      "lcSlug": "best-time-to-buy-and-sell-stock",
      "summary": "Stock I — state invariant, then loop."
    },
    {
      "id": "arr-26",
      "title": "Maximum Subarray",
      "lc": 53,
      "importance": "must",
      "subtopic": "kadane",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums",
          "out": "max sum"
        }
      ],
      "approaches": [
        {
          "name": "Kadane",
          "time": "O(n)",
          "space": "O(1)",
          "code": "int maxSubArray(vector<int>& nums) {\n    int best=nums[0], cur=nums[0];\n    for (int i=1;i<(int)nums.size();i++) { cur=max(nums[i], cur+nums[i]); best=max(best,cur); }\n    return best;\n}"
        }
      ],
      "description": "Given an integer array `nums`, find the subarray with the largest sum, and return its sum.\n\n \n\nExample 1:\n\nInput: nums = [-2,1,-3,4,-1,2,1,-5,4]\nOutput: 6\nExplanation: The subarray [4,-1,2,1] has the largest sum 6.\n\nExample 2:\n\nInput: nums = [1]\nOutput: 1\nExplanation: The subarray [1] has the largest sum 1.\n\nExample 3:\n\nInput: nums = [5,4,-1,7,8]\nOutput: 23\nExplanation: The subarray [5,4,-1,7,8] has the largest sum 23.\n\n \n\nConstraints:\n\n\t• `1 5`\n• `-104 4`\n\n \n\nFollow up: If you have figured out the `O(n)` solution, try coding another solution using the divide and conquer approach, which is more subtle.",
      "descriptionHtml": "<p>Given an integer array <code>nums</code>, find the <span data-keyword=\"subarray-nonempty\">subarray</span> with the largest sum, and return <em>its sum</em>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [-2,1,-3,4,-1,2,1,-5,4]\n<strong>Output:</strong> 6\n<strong>Explanation:</strong> The subarray [4,-1,2,1] has the largest sum 6.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [1]\n<strong>Output:</strong> 1\n<strong>Explanation:</strong> The subarray [1] has the largest sum 1.\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [5,4,-1,7,8]\n<strong>Output:</strong> 23\n<strong>Explanation:</strong> The subarray [5,4,-1,7,8] has the largest sum 23.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= nums.length &lt;= 10<sup>5</sup></code></li>\n\t<li><code>-10<sup>4</sup> &lt;= nums[i] &lt;= 10<sup>4</sup></code></li>\n</ul>\n\n<p>&nbsp;</p>\n<p><strong>Follow up:</strong> If you have figured out the <code>O(n)</code> solution, try coding another solution using the <strong>divide and conquer</strong> approach, which is more subtle.</p>\n",
      "lcSlug": "maximum-subarray",
      "summary": "cur = max(x, cur+x); best = max(best, cur) — one pass max subarray."
    },
    {
      "id": "arr-27",
      "title": "Merge Sorted Array",
      "lc": 88,
      "importance": "should",
      "subtopic": "two-ptr",
      "difficulty": "Easy",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums1, m, nums2, n",
          "out": "merged"
        }
      ],
      "approaches": [
        {
          "name": "Merge from end",
          "time": "O(m+n)",
          "space": "O(1)",
          "code": "void merge(vector<int>& nums1, int m, vector<int>& nums2, int n) {\n    int i = m - 1, j = n - 1, k = m + n - 1;\n    while (j >= 0) nums1[k--] = (i >= 0 && nums1[i] > nums2[j]) ? nums1[i--] : nums2[j--];\n}"
        }
      ],
      "description": "You are given two integer arrays `nums1` and `nums2`, sorted in non-decreasing order, and two integers `m` and `n`, representing the number of elements in `nums1` and `nums2` respectively.\n\nMerge `nums1` and `nums2` into a single array sorted in non-decreasing order.\n\nThe final sorted array should not be returned by the function, but instead be stored inside the array `nums1`. To accommodate this, `nums1` has a length of `m + n`, where the first `m` elements denote the elements that should be merged, and the last `n` elements are set to `0` and should be ignored. `nums2` has a length of `n`.\n\n \n\nExample 1:\n\nInput: nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3\nOutput: [1,2,2,3,5,6]\nExplanation: The arrays we are merging are [1,2,3] and [2,5,6].\nThe result of the merge is [1,2,2,3,5,6] with the underlined elements coming from nums1.\n\nExample 2:\n\nInput: nums1 = [1], m = 1, nums2 = [], n = 0\nOutput: [1]\nExplanation: The arrays we are merging are [1] and [].\nThe result of the merge is [1].\n\nExample 3:\n\nInput: nums1 = [0], m = 0, nums2 = [1], n = 1\nOutput: [1]\nExplanation: The arrays we are merging are [] and [1].\nThe result of the merge is [1].\nNote that because m = 0, there are no elements in nums1. The 0 is only there to ensure the merge result can fit in nums1.\n\n \n\nConstraints:\n\n\t• `nums1.length == m + n`\n• `nums2.length == n`\n• `0 9 9`\n\n \n\nFollow up: Can you come up with an algorithm that runs in `O(m + n)` time?",
      "descriptionHtml": "<p>You are given two integer arrays <code>nums1</code> and <code>nums2</code>, sorted in <strong>non-decreasing order</strong>, and two integers <code>m</code> and <code>n</code>, representing the number of elements in <code>nums1</code> and <code>nums2</code> respectively.</p>\n\n<p><strong>Merge</strong> <code>nums1</code> and <code>nums2</code> into a single array sorted in <strong>non-decreasing order</strong>.</p>\n\n<p>The final sorted array should not be returned by the function, but instead be <em>stored inside the array </em><code>nums1</code>. To accommodate this, <code>nums1</code> has a length of <code>m + n</code>, where the first <code>m</code> elements denote the elements that should be merged, and the last <code>n</code> elements are set to <code>0</code> and should be ignored. <code>nums2</code> has a length of <code>n</code>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3\n<strong>Output:</strong> [1,2,2,3,5,6]\n<strong>Explanation:</strong> The arrays we are merging are [1,2,3] and [2,5,6].\nThe result of the merge is [<u>1</u>,<u>2</u>,2,<u>3</u>,5,6] with the underlined elements coming from nums1.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums1 = [1], m = 1, nums2 = [], n = 0\n<strong>Output:</strong> [1]\n<strong>Explanation:</strong> The arrays we are merging are [1] and [].\nThe result of the merge is [1].\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums1 = [0], m = 0, nums2 = [1], n = 1\n<strong>Output:</strong> [1]\n<strong>Explanation:</strong> The arrays we are merging are [] and [1].\nThe result of the merge is [1].\nNote that because m = 0, there are no elements in nums1. The 0 is only there to ensure the merge result can fit in nums1.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>nums1.length == m + n</code></li>\n\t<li><code>nums2.length == n</code></li>\n\t<li><code>0 &lt;= m, n &lt;= 200</code></li>\n\t<li><code>1 &lt;= m + n &lt;= 200</code></li>\n\t<li><code>-10<sup>9</sup> &lt;= nums1[i], nums2[j] &lt;= 10<sup>9</sup></code></li>\n</ul>\n\n<p>&nbsp;</p>\n<p><strong>Follow up: </strong>Can you come up with an algorithm that runs in <code>O(m + n)</code> time?</p>\n",
      "lcSlug": "merge-sorted-array",
      "summary": "Fill nums1 from back with larger of nums1[i], nums2[j]."
    },
    {
      "id": "arr-28",
      "title": "Next Permutation",
      "lc": 31,
      "importance": "should",
      "subtopic": "array",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums",
          "out": "next lexicographic"
        }
      ],
      "approaches": [
        {
          "name": "Next permutation",
          "time": "O(n)",
          "space": "O(1)",
          "code": "void nextPermutation(vector<int>& nums) {\n    int i=(int)nums.size()-2;\n    while (i>=0 && nums[i]>=nums[i+1]) i--;\n    if (i>=0) { int j=(int)nums.size()-1; while (nums[j]<=nums[i]) j--; swap(nums[i],nums[j]); }\n    reverse(nums.begin()+i+1, nums.end());\n}"
        }
      ],
      "description": "A permutation of an array of integers is an arrangement of its members into a sequence or linear order.\n\n\t• For example, for `arr = [1,2,3]`, the following are all the permutations of `arr`: `[1,2,3], [1,3,2], [2, 1, 3], [2, 3, 1], [3,1,2], [3,2,1]`.\n\nThe next permutation of an array of integers is the next lexicographically greater permutation of its integer. More formally, if all the permutations of the array are sorted in one container according to their lexicographical order, then the next permutation of that array is the permutation that follows it in the sorted container. If such arrangement is not possible, the array must be rearranged as the lowest possible order (i.e., sorted in ascending order).\n\n\t• For example, the next permutation of `arr = [1,2,3]` is `[1,3,2]`.\n• Similarly, the next permutation of `arr = [2,3,1]` is `[3,1,2]`.\n• While the next permutation of `arr = [3,2,1]` is `[1,2,3]` because `[3,2,1]` does not have a lexicographical larger rearrangement.\n\nGiven an array of integers `nums`, find the next permutation of `nums`.\n\nThe replacement must be in place and use only constant extra memory.\n\n \n\nExample 1:\n\nInput: nums = [1,2,3]\nOutput: [1,3,2]\n\nExample 2:\n\nInput: nums = [3,2,1]\nOutput: [1,2,3]\n\nExample 3:\n\nInput: nums = [1,1,5]\nOutput: [1,5,1]\n\n \n\nConstraints:\n\n\t• `1",
      "descriptionHtml": "<p>A <strong>permutation</strong> of an array of integers is an arrangement of its members into a sequence or linear order.</p>\n\n<ul>\n\t<li>For example, for <code>arr = [1,2,3]</code>, the following are all the permutations of <code>arr</code>: <code>[1,2,3], [1,3,2], [2, 1, 3], [2, 3, 1], [3,1,2], [3,2,1]</code>.</li>\n</ul>\n\n<p>The <strong>next permutation</strong> of an array of integers is the next lexicographically greater permutation of its integer. More formally, if all the permutations of the array are sorted in one container according to their lexicographical order, then the <strong>next permutation</strong> of that array is the permutation that follows it in the sorted container. If such arrangement is not possible, the array must be rearranged as the lowest possible order (i.e., sorted in ascending order).</p>\n\n<ul>\n\t<li>For example, the next permutation of <code>arr = [1,2,3]</code> is <code>[1,3,2]</code>.</li>\n\t<li>Similarly, the next permutation of <code>arr = [2,3,1]</code> is <code>[3,1,2]</code>.</li>\n\t<li>While the next permutation of <code>arr = [3,2,1]</code> is <code>[1,2,3]</code> because <code>[3,2,1]</code> does not have a lexicographical larger rearrangement.</li>\n</ul>\n\n<p>Given an array of integers <code>nums</code>, <em>find the next permutation of</em> <code>nums</code>.</p>\n\n<p>The replacement must be <strong><a href=\"http://en.wikipedia.org/wiki/In-place_algorithm\" target=\"_blank\">in place</a></strong> and use only constant extra memory.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [1,2,3]\n<strong>Output:</strong> [1,3,2]\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [3,2,1]\n<strong>Output:</strong> [1,2,3]\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [1,1,5]\n<strong>Output:</strong> [1,5,1]\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= nums.length &lt;= 100</code></li>\n\t<li><code>0 &lt;= nums[i] &lt;= 100</code></li>\n</ul>\n",
      "lcSlug": "next-permutation",
      "summary": "Next permutation — state invariant, then loop."
    }
  ]
};
