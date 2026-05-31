window.PRACTICE_TOPIC = {
  "id": "prefix-sum",
  "title": "Prefix Sum & Difference Array",
  "expected_count": 22,
  "strategy": "<strong>Speed-run:</strong> Subarray sum K and range queries — core for arrays. Filter <em>Must do</em> first.",
  "subtopics": [
    {
      "id": "1d-prefix",
      "label": "1D Prefix"
    },
    {
      "id": "2d-prefix",
      "label": "2D Prefix"
    },
    {
      "id": "diff-array",
      "label": "Diff Array"
    },
    {
      "id": "hashmap",
      "label": "+ HashMap"
    },
    {
      "id": "kadane",
      "label": "Kadane"
    },
    {
      "id": "bit",
      "label": "BIT"
    }
  ],
  "questions": [
    {
      "id": "pre-01",
      "title": "Subarray Sum Equals K",
      "lc": 560,
      "importance": "must",
      "subtopic": "1d-prefix",
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
      "id": "pre-02",
      "title": "Range Sum Query Immutable",
      "lc": 303,
      "importance": "must",
      "subtopic": "1d-prefix",
      "difficulty": "Easy",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums, queries",
          "out": "sums"
        }
      ],
      "approaches": [
        {
          "name": "Prefix sum",
          "time": "O(1) query",
          "space": "O(n)",
          "code": "class NumArray {\n    vector<int> pre;\npublic:\n    NumArray(vector<int>& nums) {\n        pre.resize(nums.size()+1);\n        for (int i = 0; i < (int)nums.size(); i++) pre[i+1] = pre[i] + nums[i];\n    }\n    int sumRange(int l, int r) { return pre[r+1] - pre[l]; }\n};"
        }
      ],
      "description": "Given an integer array `nums`, handle multiple queries of the following type:\n\n\t• Calculate the sum of the elements of `nums` between indices `left` and `right` inclusive where `left \n\nImplement the `NumArray` class:\n\n\t• `NumArray(int[] nums)` Initializes the object with the integer array `nums`.\n• `int sumRange(int left, int right)` Returns the sum of the elements of `nums` between indices `left` and `right` inclusive (i.e. `nums[left] + nums[left + 1] + ... + nums[right]`).\n\n \n\nExample 1:\n\nInput\n[\"NumArray\", \"sumRange\", \"sumRange\", \"sumRange\"]\n[[[-2, 0, 3, -5, 2, -1]], [0, 2], [2, 5], [0, 5]]\nOutput\n[null, 1, -1, -3]\n\nExplanation\nNumArray numArray = new NumArray([-2, 0, 3, -5, 2, -1]);\nnumArray.sumRange(0, 2); // return (-2) + 0 + 3 = 1\nnumArray.sumRange(2, 5); // return 3 + (-5) + 2 + (-1) = -1\nnumArray.sumRange(0, 5); // return (-2) + 0 + 3 + (-5) + 2 + (-1) = -3\n\n \n\nConstraints:\n\n\t• `1 4`\n• `-105 5`\n• `0 4` calls will be made to `sumRange`.",
      "descriptionHtml": "<p>Given an integer array <code>nums</code>, handle multiple queries of the following type:</p>\n\n<ol>\n\t<li>Calculate the <strong>sum</strong> of the elements of <code>nums</code> between indices <code>left</code> and <code>right</code> <strong>inclusive</strong> where <code>left &lt;= right</code>.</li>\n</ol>\n\n<p>Implement the <code>NumArray</code> class:</p>\n\n<ul>\n\t<li><code>NumArray(int[] nums)</code> Initializes the object with the integer array <code>nums</code>.</li>\n\t<li><code>int sumRange(int left, int right)</code> Returns the <strong>sum</strong> of the elements of <code>nums</code> between indices <code>left</code> and <code>right</code> <strong>inclusive</strong> (i.e. <code>nums[left] + nums[left + 1] + ... + nums[right]</code>).</li>\n</ul>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input</strong>\n[&quot;NumArray&quot;, &quot;sumRange&quot;, &quot;sumRange&quot;, &quot;sumRange&quot;]\n[[[-2, 0, 3, -5, 2, -1]], [0, 2], [2, 5], [0, 5]]\n<strong>Output</strong>\n[null, 1, -1, -3]\n\n<strong>Explanation</strong>\nNumArray numArray = new NumArray([-2, 0, 3, -5, 2, -1]);\nnumArray.sumRange(0, 2); // return (-2) + 0 + 3 = 1\nnumArray.sumRange(2, 5); // return 3 + (-5) + 2 + (-1) = -1\nnumArray.sumRange(0, 5); // return (-2) + 0 + 3 + (-5) + 2 + (-1) = -3\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= nums.length &lt;= 10<sup>4</sup></code></li>\n\t<li><code>-10<sup>5</sup> &lt;= nums[i] &lt;= 10<sup>5</sup></code></li>\n\t<li><code>0 &lt;= left &lt;= right &lt; nums.length</code></li>\n\t<li>At most <code>10<sup>4</sup></code> calls will be made to <code>sumRange</code>.</li>\n</ul>\n",
      "lcSlug": "range-sum-query-immutable",
      "summary": "Prefix sum — state invariant, then loop."
    },
    {
      "id": "pre-03",
      "title": "Range Sum Query 2D",
      "lc": 304,
      "importance": "should",
      "subtopic": "2d-prefix",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "matrix queries",
          "out": "sums"
        }
      ],
      "approaches": [
        {
          "name": "2D prefix",
          "time": "O(1) query",
          "space": "O(mn)",
          "code": "class NumMatrix {\n    vector<vector<int>> pre;\npublic:\n    NumMatrix(vector<vector<int>>& matrix) {\n        int m = matrix.size(), n = m ? matrix[0].size() : 0;\n        pre.assign(m+1, vector<int>(n+1, 0));\n        for (int i = 0; i < m; i++)\n            for (int j = 0; j < n; j++)\n                pre[i+1][j+1] = matrix[i][j] + pre[i][j+1] + pre[i+1][j] - pre[i][j];\n    }\n    int sumRegion(int r1, int c1, int r2, int c2) {\n        return pre[r2+1][c2+1] - pre[r1][c2+1] - pre[r2+1][c1] + pre[r1][c1];\n    }\n};"
        }
      ],
      "description": "Given a 2D matrix `matrix`, handle multiple queries of the following type:\n\n\t• Calculate the sum of the elements of `matrix` inside the rectangle defined by its upper left corner `(row1, col1)` and lower right corner `(row2, col2)`.\n\nImplement the `NumMatrix` class:\n\n\t• `NumMatrix(int[][] matrix)` Initializes the object with the integer matrix `matrix`.\n• `int sumRegion(int row1, int col1, int row2, int col2)` Returns the sum of the elements of `matrix` inside the rectangle defined by its upper left corner `(row1, col1)` and lower right corner `(row2, col2)`.\n\nYou must design an algorithm where `sumRegion` works on `O(1)` time complexity.\n\n \n\nExample 1:\n\nInput\n[\"NumMatrix\", \"sumRegion\", \"sumRegion\", \"sumRegion\"]\n[[[[3, 0, 1, 4, 2], [5, 6, 3, 2, 1], [1, 2, 0, 1, 5], [4, 1, 0, 1, 7], [1, 0, 3, 0, 5]]], [2, 1, 4, 3], [1, 1, 2, 2], [1, 2, 2, 4]]\nOutput\n[null, 8, 11, 12]\n\nExplanation\nNumMatrix numMatrix = new NumMatrix([[3, 0, 1, 4, 2], [5, 6, 3, 2, 1], [1, 2, 0, 1, 5], [4, 1, 0, 1, 7], [1, 0, 3, 0, 5]]);\nnumMatrix.sumRegion(2, 1, 4, 3); // return 8 (i.e sum of the red rectangle)\nnumMatrix.sumRegion(1, 1, 2, 2); // return 11 (i.e sum of the green rectangle)\nnumMatrix.sumRegion(1, 2, 2, 4); // return 12 (i.e sum of the blue rectangle)\n\n \n\nConstraints:\n\n\t• `m == matrix.length`\n• `n == matrix[i].length`\n• `1 4 4`\n• `0 4` calls will be made to `sumRegion`.",
      "descriptionHtml": "<p>Given a 2D matrix <code>matrix</code>, handle multiple queries of the following type:</p>\n\n<ul>\n\t<li>Calculate the <strong>sum</strong> of the elements of <code>matrix</code> inside the rectangle defined by its <strong>upper left corner</strong> <code>(row1, col1)</code> and <strong>lower right corner</strong> <code>(row2, col2)</code>.</li>\n</ul>\n\n<p>Implement the <code>NumMatrix</code> class:</p>\n\n<ul>\n\t<li><code>NumMatrix(int[][] matrix)</code> Initializes the object with the integer matrix <code>matrix</code>.</li>\n\t<li><code>int sumRegion(int row1, int col1, int row2, int col2)</code> Returns the <strong>sum</strong> of the elements of <code>matrix</code> inside the rectangle defined by its <strong>upper left corner</strong> <code>(row1, col1)</code> and <strong>lower right corner</strong> <code>(row2, col2)</code>.</li>\n</ul>\n\n<p>You must design an algorithm where <code>sumRegion</code> works on <code>O(1)</code> time complexity.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2021/03/14/sum-grid.jpg\" style=\"width: 415px; height: 415px;\" />\n<pre>\n<strong>Input</strong>\n[&quot;NumMatrix&quot;, &quot;sumRegion&quot;, &quot;sumRegion&quot;, &quot;sumRegion&quot;]\n[[[[3, 0, 1, 4, 2], [5, 6, 3, 2, 1], [1, 2, 0, 1, 5], [4, 1, 0, 1, 7], [1, 0, 3, 0, 5]]], [2, 1, 4, 3], [1, 1, 2, 2], [1, 2, 2, 4]]\n<strong>Output</strong>\n[null, 8, 11, 12]\n\n<strong>Explanation</strong>\nNumMatrix numMatrix = new NumMatrix([[3, 0, 1, 4, 2], [5, 6, 3, 2, 1], [1, 2, 0, 1, 5], [4, 1, 0, 1, 7], [1, 0, 3, 0, 5]]);\nnumMatrix.sumRegion(2, 1, 4, 3); // return 8 (i.e sum of the red rectangle)\nnumMatrix.sumRegion(1, 1, 2, 2); // return 11 (i.e sum of the green rectangle)\nnumMatrix.sumRegion(1, 2, 2, 4); // return 12 (i.e sum of the blue rectangle)\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>m == matrix.length</code></li>\n\t<li><code>n == matrix[i].length</code></li>\n\t<li><code>1 &lt;= m, n &lt;= 200</code></li>\n\t<li><code>-10<sup>4</sup> &lt;= matrix[i][j] &lt;= 10<sup>4</sup></code></li>\n\t<li><code>0 &lt;= row1 &lt;= row2 &lt; m</code></li>\n\t<li><code>0 &lt;= col1 &lt;= col2 &lt; n</code></li>\n\t<li>At most <code>10<sup>4</sup></code> calls will be made to <code>sumRegion</code>.</li>\n</ul>\n",
      "lcSlug": "range-sum-query-2d-immutable",
      "summary": "pre[i+1][j+1] = sum of rectangle — O(1) range query."
    },
    {
      "id": "pre-04",
      "title": "Product Except Self",
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
          "in": "nums",
          "out": "products"
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
      "id": "pre-05",
      "title": "Find Pivot Index",
      "lc": 724,
      "importance": "should",
      "subtopic": "prefix",
      "difficulty": "Easy",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums",
          "out": "pivot index"
        }
      ],
      "approaches": [
        {
          "name": "Prefix balance",
          "time": "O(n)",
          "space": "O(1)",
          "code": "int pivotIndex(vector<int>& nums) {\n    int total = accumulate(nums.begin(), nums.end(), 0), left = 0;\n    for (int i = 0; i < (int)nums.size(); i++) {\n        if (left == total - left - nums[i]) return i;\n        left += nums[i];\n    }\n    return -1;\n}"
        }
      ],
      "description": "Given an array of integers `nums`, calculate the pivot index of this array.\n\nThe pivot index is the index where the sum of all the numbers strictly to the left of the index is equal to the sum of all the numbers strictly to the index's right.\n\nIf the index is on the left edge of the array, then the left sum is `0` because there are no elements to the left. This also applies to the right edge of the array.\n\nReturn the leftmost pivot index. If no such index exists, return `-1`.\n\n \n\nExample 1:\n\nInput: nums = [1,7,3,6,5,6]\nOutput: 3\nExplanation:\nThe pivot index is 3.\nLeft sum = nums[0] + nums[1] + nums[2] = 1 + 7 + 3 = 11\nRight sum = nums[4] + nums[5] = 5 + 6 = 11\n\nExample 2:\n\nInput: nums = [1,2,3]\nOutput: -1\nExplanation:\nThere is no index that satisfies the conditions in the problem statement.\n\nExample 3:\n\nInput: nums = [2,1,-1]\nOutput: 0\nExplanation:\nThe pivot index is 0.\nLeft sum = 0 (no elements to the left of index 0)\nRight sum = nums[1] + nums[2] = 1 + -1 = 0\n\n \n\nConstraints:\n\n\t• `1 4`\n• `-1000 \n\n \n\nNote: This question is the same as 1991: https://leetcode.com/problems/find-the-middle-index-in-array/",
      "descriptionHtml": "<p>Given an array of integers <code>nums</code>, calculate the <strong>pivot index</strong> of this array.</p>\n\n<p>The <strong>pivot index</strong> is the index where the sum of all the numbers <strong>strictly</strong> to the left of the index is equal to the sum of all the numbers <strong>strictly</strong> to the index&#39;s right.</p>\n\n<p>If the index is on the left edge of the array, then the left sum is <code>0</code> because there are no elements to the left. This also applies to the right edge of the array.</p>\n\n<p>Return <em>the <strong>leftmost pivot index</strong></em>. If no such index exists, return <code>-1</code>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [1,7,3,6,5,6]\n<strong>Output:</strong> 3\n<strong>Explanation:</strong>\nThe pivot index is 3.\nLeft sum = nums[0] + nums[1] + nums[2] = 1 + 7 + 3 = 11\nRight sum = nums[4] + nums[5] = 5 + 6 = 11\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [1,2,3]\n<strong>Output:</strong> -1\n<strong>Explanation:</strong>\nThere is no index that satisfies the conditions in the problem statement.</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [2,1,-1]\n<strong>Output:</strong> 0\n<strong>Explanation:</strong>\nThe pivot index is 0.\nLeft sum = 0 (no elements to the left of index 0)\nRight sum = nums[1] + nums[2] = 1 + -1 = 0\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= nums.length &lt;= 10<sup>4</sup></code></li>\n\t<li><code>-1000 &lt;= nums[i] &lt;= 1000</code></li>\n</ul>\n\n<p>&nbsp;</p>\n<p><strong>Note:</strong> This question is the same as&nbsp;1991:&nbsp;<a href=\"https://leetcode.com/problems/find-the-middle-index-in-array/\" target=\"_blank\">https://leetcode.com/problems/find-the-middle-index-in-array/</a></p>\n",
      "lcSlug": "find-pivot-index",
      "summary": "Prefix balance — Prefix sums + hash map or difference array for range/subarray queries."
    },
    {
      "id": "pre-06",
      "title": "Continuous Subarray Sum",
      "lc": 523,
      "importance": "should",
      "subtopic": "prefix",
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
          "name": "Prefix mod map",
          "time": "O(n)",
          "space": "O(n)",
          "code": "bool checkSubarraySum(vector<int>& nums, int k) {\n    unordered_map<int,int> mp{{0,-1}}; int sum = 0;\n    for (int i = 0; i < (int)nums.size(); i++) {\n        sum += nums[i];\n        int rem = k ? sum % k : sum;\n        if (mp.count(rem)) { if (i - mp[rem] >= 2) return true; }\n        else mp[rem] = i;\n    }\n    return false;\n}"
        }
      ],
      "description": "Given an integer array nums and an integer k, return `true` if `nums` has a good subarray or `false` otherwise.\n\nA good subarray is a subarray where:\n\n\t• its length is at least two, and\n• the sum of the elements of the subarray is a multiple of `k`.\n\nNote that:\n\n\t• A subarray is a contiguous part of the array.\n• An integer `x` is a multiple of `k` if there exists an integer `n` such that `x = n * k`. `0` is always a multiple of `k`.\n\n \n\nExample 1:\n\nInput: nums = [23,2,4,6,7], k = 6\nOutput: true\nExplanation: [2, 4] is a continuous subarray of size 2 whose elements sum up to 6.\n\nExample 2:\n\nInput: nums = [23,2,6,4,7], k = 6\nOutput: true\nExplanation: [23, 2, 6, 4, 7] is an continuous subarray of size 5 whose elements sum up to 42.\n42 is a multiple of 6 because 42 = 7 * 6 and 7 is an integer.\n\nExample 3:\n\nInput: nums = [23,2,6,4,7], k = 13\nOutput: false\n\n \n\nConstraints:\n\n\t• `1 5`\n• `0 9`\n• `0 31 - 1`\n• `1 31 - 1`",
      "descriptionHtml": "<p>Given an integer array nums and an integer k, return <code>true</code> <em>if </em><code>nums</code><em> has a <strong>good subarray</strong> or </em><code>false</code><em> otherwise</em>.</p>\n\n<p>A <strong>good subarray</strong> is a subarray where:</p>\n\n<ul>\n\t<li>its length is <strong>at least two</strong>, and</li>\n\t<li>the sum of the elements of the subarray is a multiple of <code>k</code>.</li>\n</ul>\n\n<p><strong>Note</strong> that:</p>\n\n<ul>\n\t<li>A <strong>subarray</strong> is a contiguous part of the array.</li>\n\t<li>An integer <code>x</code> is a multiple of <code>k</code> if there exists an integer <code>n</code> such that <code>x = n * k</code>. <code>0</code> is <strong>always</strong> a multiple of <code>k</code>.</li>\n</ul>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [23,<u>2,4</u>,6,7], k = 6\n<strong>Output:</strong> true\n<strong>Explanation:</strong> [2, 4] is a continuous subarray of size 2 whose elements sum up to 6.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [<u>23,2,6,4,7</u>], k = 6\n<strong>Output:</strong> true\n<strong>Explanation:</strong> [23, 2, 6, 4, 7] is an continuous subarray of size 5 whose elements sum up to 42.\n42 is a multiple of 6 because 42 = 7 * 6 and 7 is an integer.\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [23,2,6,4,7], k = 13\n<strong>Output:</strong> false\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= nums.length &lt;= 10<sup>5</sup></code></li>\n\t<li><code>0 &lt;= nums[i] &lt;= 10<sup>9</sup></code></li>\n\t<li><code>0 &lt;= sum(nums[i]) &lt;= 2<sup>31</sup> - 1</code></li>\n\t<li><code>1 &lt;= k &lt;= 2<sup>31</sup> - 1</code></li>\n</ul>\n",
      "lcSlug": "continuous-subarray-sum",
      "summary": "Map remainder → earliest index; len = i - first[rem]."
    },
    {
      "id": "pre-07",
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
      "id": "pre-08",
      "title": "Maximum Product Subarray",
      "lc": 152,
      "importance": "must",
      "subtopic": "prefix",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums",
          "out": "max product"
        }
      ],
      "approaches": [
        {
          "name": "Max product subarray",
          "time": "O(n)",
          "space": "O(1)",
          "code": "int maxProduct(vector<int>& nums) {\n    int best=nums[0], curMax=nums[0], curMin=nums[0];\n    for (int i=1;i<(int)nums.size();i++) {\n        if (nums[i]<0) swap(curMax, curMin);\n        curMax=max(nums[i], curMax*nums[i]); curMin=min(nums[i], curMin*nums[i]);\n        best=max(best, curMax);\n    } return best;\n}"
        }
      ],
      "description": "Given an integer array `nums`, find a subarray that has the largest product, and return the product.\n\nThe test cases are generated so that the answer will fit in a 32-bit integer.\n\nNote that the product of an array with a single element is the value of that element.\n\n \n\nExample 1:\n\nInput: nums = [2,3,-2,4]\nOutput: 6\nExplanation: [2,3] has the largest product 6.\n\nExample 2:\n\nInput: nums = [-2,0,-1]\nOutput: 0\nExplanation: The result cannot be 2, because [-2,-1] is not a subarray.\n\n \n\nConstraints:\n\n\t• `1 4`\n• `-10",
      "descriptionHtml": "<p>Given an integer array <code>nums</code>, find a <span data-keyword=\"subarray-nonempty\">subarray</span> that has the largest product, and return <em>the product</em>.</p>\n\n<p>The test cases are generated so that the answer will fit in a <strong>32-bit</strong> integer.</p>\n\n<p><strong>Note</strong> that the product of an array with a single element is the value of that element.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [2,3,-2,4]\n<strong>Output:</strong> 6\n<strong>Explanation:</strong> [2,3] has the largest product 6.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [-2,0,-1]\n<strong>Output:</strong> 0\n<strong>Explanation:</strong> The result cannot be 2, because [-2,-1] is not a subarray.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= nums.length &lt;= 2 * 10<sup>4</sup></code></li>\n\t<li><code>-10 &lt;= nums[i] &lt;= 10</code></li>\n\t<li>The product of any subarray of <code>nums</code> is <strong>guaranteed</strong> to fit in a <strong>32-bit</strong> integer.</li>\n</ul>\n",
      "lcSlug": "maximum-product-subarray",
      "summary": "Max product subarray — Prefix sums + hash map or difference array for range/subarray queries."
    },
    {
      "id": "pre-09",
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
          "in": "0/1 array",
          "out": "max len"
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
      "id": "pre-10",
      "title": "Subarray Sums Divisible by K",
      "lc": 974,
      "importance": "should",
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
      "id": "pre-11",
      "title": "Range Addition II",
      "lc": 598,
      "importance": "nice",
      "subtopic": "2d-diff",
      "difficulty": "Easy",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "m,n, ops",
          "out": "max integer"
        }
      ],
      "approaches": [
        {
          "name": "Min dimension guess",
          "time": "O(max(m,n))",
          "space": "O(1)",
          "code": "int maxCount(int m, int n, vector<vector<int>>& ops) {\n    int minM=m, minN=n;\n    for(auto& o: ops){ minM=min(minM,o[0]); minN=min(minN,o[1]); }\n    return minM*minN;\n}"
        }
      ],
      "description": "You are given an `m x n` matrix `M` initialized with all `0`'s and an array of operations `ops`, where `ops[i] = [ai, bi]` means `M[x][y]` should be incremented by one for all `0 i` and `0 i`.\n\nCount and return the number of maximum integers in the matrix after performing all the operations.\n\n \n\nExample 1:\n\nInput: m = 3, n = 3, ops = [[2,2],[3,3]]\nOutput: 4\nExplanation: The maximum integer in M is 2, and there are four of it in M. So return 4.\n\nExample 2:\n\nInput: m = 3, n = 3, ops = [[2,2],[3,3],[3,3],[3,3],[2,2],[3,3],[3,3],[3,3],[2,2],[3,3],[3,3],[3,3]]\nOutput: 4\n\nExample 3:\n\nInput: m = 3, n = 3, ops = []\nOutput: 9\n\n \n\nConstraints:\n\n\t• `1 4`\n• `0 4`\n• `ops[i].length == 2`\n• `1 i i",
      "descriptionHtml": "<p>You are given an <code>m x n</code> matrix <code>M</code> initialized with all <code>0</code>&#39;s and an array of operations <code>ops</code>, where <code>ops[i] = [a<sub>i</sub>, b<sub>i</sub>]</code> means <code>M[x][y]</code> should be incremented by one for all <code>0 &lt;= x &lt; a<sub>i</sub></code> and <code>0 &lt;= y &lt; b<sub>i</sub></code>.</p>\n\n<p>Count and return <em>the number of maximum integers in the matrix after performing all the operations</em>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2020/10/02/ex1.jpg\" style=\"width: 750px; height: 176px;\" />\n<pre>\n<strong>Input:</strong> m = 3, n = 3, ops = [[2,2],[3,3]]\n<strong>Output:</strong> 4\n<strong>Explanation:</strong> The maximum integer in M is 2, and there are four of it in M. So return 4.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> m = 3, n = 3, ops = [[2,2],[3,3],[3,3],[3,3],[2,2],[3,3],[3,3],[3,3],[2,2],[3,3],[3,3],[3,3]]\n<strong>Output:</strong> 4\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> m = 3, n = 3, ops = []\n<strong>Output:</strong> 9\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= m, n &lt;= 4 * 10<sup>4</sup></code></li>\n\t<li><code>0 &lt;= ops.length &lt;= 10<sup>4</sup></code></li>\n\t<li><code>ops[i].length == 2</code></li>\n\t<li><code>1 &lt;= a<sub>i</sub> &lt;= m</code></li>\n\t<li><code>1 &lt;= b<sub>i</sub> &lt;= n</code></li>\n</ul>\n",
      "lcSlug": "range-addition-ii",
      "summary": "Min dimension guess — state invariant, then loop."
    },
    {
      "id": "pre-12",
      "title": "Corporate Flight Bookings",
      "lc": 1109,
      "importance": "nice",
      "subtopic": "diff-array",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "bookings, n",
          "out": "seats used"
        }
      ],
      "approaches": [
        {
          "name": "Difference array",
          "time": "O(n)",
          "space": "O(n)",
          "code": "vector<int> corpFlightBookings(vector<vector<int>>& bookings, int n) {\n    vector<int> diff(n+1);\n    for(auto& b: bookings){ diff[b[0]-1]+=b[2]; diff[b[1]]-=b[2]; }\n    vector<int> ans(n); int cur=0;\n    for(int i=0;i<n;i++){ cur+=diff[i]; ans[i]=cur; }\n    return ans;\n}"
        }
      ],
      "description": "There are `n` flights that are labeled from `1` to `n`.\n\nYou are given an array of flight bookings `bookings`, where `bookings[i] = [firsti, lasti, seatsi]` represents a booking for flights `firsti` through `lasti` (inclusive) with `seatsi` seats reserved for each flight in the range.\n\nReturn an array `answer` of length `n`, where `answer[i]` is the total number of seats reserved for flight `i`.\n\n \n\nExample 1:\n\nInput: bookings = [[1,2,10],[2,3,20],[2,5,25]], n = 5\nOutput: [10,55,45,25,25]\nExplanation:\nFlight labels:        1   2   3   4   5\nBooking 1 reserved:  10  10\nBooking 2 reserved:      20  20\nBooking 3 reserved:      25  25  25  25\nTotal seats:         10  55  45  25  25\nHence, answer = [10,55,45,25,25]\n\nExample 2:\n\nInput: bookings = [[1,2,10],[2,2,15]], n = 2\nOutput: [10,25]\nExplanation:\nFlight labels:        1   2\nBooking 1 reserved:  10  10\nBooking 2 reserved:      15\nTotal seats:         10  25\nHence, answer = [10,25]\n\n \n\nConstraints:\n\n\t• `1 4`\n• `1 4`\n• `bookings[i].length == 3`\n• `1 i i i 4`",
      "descriptionHtml": "<p>There are <code>n</code> flights that are labeled from <code>1</code> to <code>n</code>.</p>\n\n<p>You are given an array of flight bookings <code>bookings</code>, where <code>bookings[i] = [first<sub>i</sub>, last<sub>i</sub>, seats<sub>i</sub>]</code> represents a booking for flights <code>first<sub>i</sub></code> through <code>last<sub>i</sub></code> (<strong>inclusive</strong>) with <code>seats<sub>i</sub></code> seats reserved for <strong>each flight</strong> in the range.</p>\n\n<p>Return <em>an array </em><code>answer</code><em> of length </em><code>n</code><em>, where </em><code>answer[i]</code><em> is the total number of seats reserved for flight </em><code>i</code>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> bookings = [[1,2,10],[2,3,20],[2,5,25]], n = 5\n<strong>Output:</strong> [10,55,45,25,25]\n<strong>Explanation:</strong>\nFlight labels:        1   2   3   4   5\nBooking 1 reserved:  10  10\nBooking 2 reserved:      20  20\nBooking 3 reserved:      25  25  25  25\nTotal seats:         10  55  45  25  25\nHence, answer = [10,55,45,25,25]\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> bookings = [[1,2,10],[2,2,15]], n = 2\n<strong>Output:</strong> [10,25]\n<strong>Explanation:</strong>\nFlight labels:        1   2\nBooking 1 reserved:  10  10\nBooking 2 reserved:      15\nTotal seats:         10  25\nHence, answer = [10,25]\n\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= n &lt;= 2 * 10<sup>4</sup></code></li>\n\t<li><code>1 &lt;= bookings.length &lt;= 2 * 10<sup>4</sup></code></li>\n\t<li><code>bookings[i].length == 3</code></li>\n\t<li><code>1 &lt;= first<sub>i</sub> &lt;= last<sub>i</sub> &lt;= n</code></li>\n\t<li><code>1 &lt;= seats<sub>i</sub> &lt;= 10<sup>4</sup></code></li>\n</ul>\n",
      "lcSlug": "corporate-flight-bookings",
      "summary": "Difference array — state invariant, then loop."
    },
    {
      "id": "pre-13",
      "title": "Minimum Value to Get Positive Step by Step Sum",
      "lc": 1413,
      "importance": "nice",
      "subtopic": "prefix",
      "difficulty": "Easy",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums",
          "out": "min start"
        }
      ],
      "approaches": [
        {
          "name": "Prefix min",
          "time": "O(n)",
          "space": "O(1)",
          "code": "int minStartValue(vector<int>& nums) {\n    int sum=0, minSum=0;\n    for(int x: nums){ sum+=x; minSum=min(minSum,sum); }\n    return 1-minSum;\n}"
        }
      ],
      "description": "Given an array of integers `nums`, you start with an initial positive value startValue.\n\nIn each iteration, you calculate the step by step sum of startValue plus elements in `nums` (from left to right).\n\nReturn the minimum positive value of startValue such that the step by step sum is never less than 1.\n\n \n\nExample 1:\n\nInput: nums = [-3,2,-3,4,2]\nOutput: 5\nExplanation: If you choose startValue = 4, in the third iteration your step by step sum is less than 1.\nstep by step sum\nstartValue = 4 | startValue = 5 | nums\n  (4 -3 ) = 1  | (5 -3 ) = 2    |  -3\n  (1 +2 ) = 3  | (2 +2 ) = 4    |   2\n  (3 -3 ) = 0  | (4 -3 ) = 1    |  -3\n  (0 +4 ) = 4  | (1 +4 ) = 5    |   4\n  (4 +2 ) = 6  | (5 +2 ) = 7    |   2\n\nExample 2:\n\nInput: nums = [1,2]\nOutput: 1\nExplanation: Minimum start value should be positive. \n\nExample 3:\n\nInput: nums = [1,-2,-3]\nOutput: 5\n\n \n\nConstraints:\n\n\t• `1",
      "descriptionHtml": "<p>Given an array of integers&nbsp;<code>nums</code>, you start with an initial <strong>positive</strong> value <em>startValue</em><em>.</em></p>\n\n<p>In each iteration, you calculate the step by step sum of <em>startValue</em>&nbsp;plus&nbsp;elements in <code>nums</code>&nbsp;(from left to right).</p>\n\n<p>Return the minimum <strong>positive</strong> value of&nbsp;<em>startValue</em> such that the step by step sum is never less than 1.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [-3,2,-3,4,2]\n<strong>Output:</strong> 5\n<strong>Explanation: </strong>If you choose startValue = 4, in the third iteration your step by step sum is less than 1.\n<strong>step by step sum</strong>\n<strong>startValue = 4 | startValue = 5 | nums</strong>\n  (4 <strong>-3</strong> ) = 1  | (5 <strong>-3</strong> ) = 2    |  -3\n  (1 <strong>+2</strong> ) = 3  | (2 <strong>+2</strong> ) = 4    |   2\n  (3 <strong>-3</strong> ) = 0  | (4 <strong>-3</strong> ) = 1    |  -3\n  (0 <strong>+4</strong> ) = 4  | (1 <strong>+4</strong> ) = 5    |   4\n  (4 <strong>+2</strong> ) = 6  | (5 <strong>+2</strong> ) = 7    |   2\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [1,2]\n<strong>Output:</strong> 1\n<strong>Explanation:</strong> Minimum start value should be positive. \n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [1,-2,-3]\n<strong>Output:</strong> 5\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= nums.length &lt;= 100</code></li>\n\t<li><code>-100 &lt;= nums[i] &lt;= 100</code></li>\n</ul>\n",
      "lcSlug": "minimum-value-to-get-positive-step-by-step-sum",
      "summary": "Prefix min — Prefix sums + hash map or difference array for range/subarray queries."
    },
    {
      "id": "pre-14",
      "title": "Running Sum of 1d Array",
      "lc": 1480,
      "importance": "nice",
      "subtopic": "prefix",
      "difficulty": "Easy",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums",
          "out": "running sums"
        }
      ],
      "approaches": [
        {
          "name": "Prefix running",
          "time": "O(n)",
          "space": "O(1)",
          "code": "vector<int> runningSum(vector<int>& nums) {\n    for(int i=1;i<(int)nums.size();i++) nums[i]+=nums[i-1];\n    return nums;\n}"
        }
      ],
      "description": "Given an array `nums`. We define a running sum of an array as `runningSum[i] = sum(nums[0]&hellip;nums[i])`.\n\nReturn the running sum of `nums`.\n\n \n\nExample 1:\n\nInput: nums = [1,2,3,4]\nOutput: [1,3,6,10]\nExplanation: Running sum is obtained as follows: [1, 1+2, 1+2+3, 1+2+3+4].\n\nExample 2:\n\nInput: nums = [1,1,1,1,1]\nOutput: [1,2,3,4,5]\nExplanation: Running sum is obtained as follows: [1, 1+1, 1+1+1, 1+1+1+1, 1+1+1+1+1].\n\nExample 3:\n\nInput: nums = [3,1,2,10,1]\nOutput: [3,4,6,16,17]\n\n \n\nConstraints:\n\n\t• `1",
      "descriptionHtml": "<p>Given an array <code>nums</code>. We define a running sum of an array as&nbsp;<code>runningSum[i] = sum(nums[0]&hellip;nums[i])</code>.</p>\n\n<p>Return the running sum of <code>nums</code>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [1,2,3,4]\n<strong>Output:</strong> [1,3,6,10]\n<strong>Explanation:</strong> Running sum is obtained as follows: [1, 1+2, 1+2+3, 1+2+3+4].</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [1,1,1,1,1]\n<strong>Output:</strong> [1,2,3,4,5]\n<strong>Explanation:</strong> Running sum is obtained as follows: [1, 1+1, 1+1+1, 1+1+1+1, 1+1+1+1+1].</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [3,1,2,10,1]\n<strong>Output:</strong> [3,4,6,16,17]\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= nums.length &lt;= 1000</code></li>\n\t<li><code>-10^6&nbsp;&lt;= nums[i] &lt;=&nbsp;10^6</code></li>\n</ul>\n",
      "lcSlug": "running-sum-of-1d-array",
      "summary": "Prefix running — Prefix sums + hash map or difference array for range/subarray queries."
    },
    {
      "id": "pre-15",
      "title": "Find the Highest Altitude",
      "lc": 1732,
      "importance": "nice",
      "subtopic": "prefix",
      "difficulty": "Easy",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "gain",
          "out": "max altitude"
        }
      ],
      "approaches": [
        {
          "name": "Prefix max altitude",
          "time": "O(n)",
          "space": "O(1)",
          "code": "int largestAltitude(vector<int>& gain) {\n    int cur=0, best=0; for(int x: gain){ cur+=x; best=max(best,cur); } return best;\n}"
        }
      ],
      "description": "There is a biker going on a road trip. The road trip consists of `n + 1` points at different altitudes. The biker starts his trip on point `0` with altitude equal `0`.\n\nYou are given an integer array `gain` of length `n` where `gain[i]` is the net gain in altitude between points `i`​​​​​​ and `i + 1` for all (`0 Example 1:\n\nInput: gain = [-5,1,5,0,-7]\nOutput: 1\nExplanation: The altitudes are [0,-5,-4,1,1,-6]. The highest is 1.\n\nExample 2:\n\nInput: gain = [-4,-3,-2,-1,4,3,2]\nOutput: 0\nExplanation: The altitudes are [0,-4,-7,-9,-10,-6,-3,-1]. The highest is 0.\n\n \n\nConstraints:\n\n\t• `n == gain.length`\n• `1",
      "descriptionHtml": "<p>There is a biker going on a road trip. The road trip consists of <code>n + 1</code> points at different altitudes. The biker starts his trip on point <code>0</code> with altitude equal <code>0</code>.</p>\n\n<p>You are given an integer array <code>gain</code> of length <code>n</code> where <code>gain[i]</code> is the <strong>net gain in altitude</strong> between points <code>i</code>​​​​​​ and <code>i + 1</code> for all (<code>0 &lt;= i &lt; n)</code>. Return <em>the <strong>highest altitude</strong> of a point.</em></p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> gain = [-5,1,5,0,-7]\n<strong>Output:</strong> 1\n<strong>Explanation:</strong> The altitudes are [0,-5,-4,1,1,-6]. The highest is 1.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> gain = [-4,-3,-2,-1,4,3,2]\n<strong>Output:</strong> 0\n<strong>Explanation:</strong> The altitudes are [0,-4,-7,-9,-10,-6,-3,-1]. The highest is 0.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>n == gain.length</code></li>\n\t<li><code>1 &lt;= n &lt;= 100</code></li>\n\t<li><code>-100 &lt;= gain[i] &lt;= 100</code></li>\n</ul>\n",
      "lcSlug": "find-the-highest-altitude",
      "summary": "Prefix max altitude — Prefix sums + hash map or difference array for range/subarray queries."
    },
    {
      "id": "pre-16",
      "title": "Number of Ways to Split Array",
      "lc": 2270,
      "importance": "nice",
      "subtopic": "prefix",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums",
          "out": "valid splits"
        }
      ],
      "approaches": [
        {
          "name": "Prefix split count",
          "time": "O(n)",
          "space": "O(1)",
          "code": "int waysToSplitArray(vector<int>& nums) {\n    long long total=accumulate(nums.begin(), nums.end(), 0LL), left=0; int ans=0;\n    for(int i=0;i<(int)nums.size()-1;i++){ left+=nums[i]; if(left>=total-left) ans++; }\n    return ans;\n}"
        }
      ],
      "description": "You are given a 0-indexed integer array `nums` of length `n`.\n\n`nums` contains a valid split at index `i` if the following are true:\n\n\t• The sum of the first `i + 1` elements is greater than or equal to the sum of the last `n - i - 1` elements.\n• There is at least one element to the right of `i`. That is, `0 \n\nReturn the number of valid splits in `nums`.\n\n \n\nExample 1:\n\nInput: nums = [10,4,-8,7]\nOutput: 2\nExplanation: \nThere are three ways of splitting nums into two non-empty parts:\n- Split nums at index 0. Then, the first part is [10], and its sum is 10. The second part is [4,-8,7], and its sum is 3. Since 10 >= 3, i = 0 is a valid split.\n- Split nums at index 1. Then, the first part is [10,4], and its sum is 14. The second part is [-8,7], and its sum is -1. Since 14 >= -1, i = 1 is a valid split.\n- Split nums at index 2. Then, the first part is [10,4,-8], and its sum is 6. The second part is [7], and its sum is 7. Since 6 Example 2:\n\nInput: nums = [2,3,1,0]\nOutput: 2\nExplanation: \nThere are two valid splits in nums:\n- Split nums at index 1. Then, the first part is [2,3], and its sum is 5. The second part is [1,0], and its sum is 1. Since 5 >= 1, i = 1 is a valid split. \n- Split nums at index 2. Then, the first part is [2,3,1], and its sum is 6. The second part is [0], and its sum is 0. Since 6 >= 0, i = 2 is a valid split.\n\n \n\nConstraints:\n\n\t• `2 5`\n• `-105 5`",
      "descriptionHtml": "<p>You are given a <strong>0-indexed</strong> integer array <code>nums</code> of length <code>n</code>.</p>\n\n<p><code>nums</code> contains a <strong>valid split</strong> at index <code>i</code> if the following are true:</p>\n\n<ul>\n\t<li>The sum of the first <code>i + 1</code> elements is <strong>greater than or equal to</strong> the sum of the last <code>n - i - 1</code> elements.</li>\n\t<li>There is <strong>at least one</strong> element to the right of <code>i</code>. That is, <code>0 &lt;= i &lt; n - 1</code>.</li>\n</ul>\n\n<p>Return <em>the number of <strong>valid splits</strong> in</em> <code>nums</code>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [10,4,-8,7]\n<strong>Output:</strong> 2\n<strong>Explanation:</strong> \nThere are three ways of splitting nums into two non-empty parts:\n- Split nums at index 0. Then, the first part is [10], and its sum is 10. The second part is [4,-8,7], and its sum is 3. Since 10 &gt;= 3, i = 0 is a valid split.\n- Split nums at index 1. Then, the first part is [10,4], and its sum is 14. The second part is [-8,7], and its sum is -1. Since 14 &gt;= -1, i = 1 is a valid split.\n- Split nums at index 2. Then, the first part is [10,4,-8], and its sum is 6. The second part is [7], and its sum is 7. Since 6 &lt; 7, i = 2 is not a valid split.\nThus, the number of valid splits in nums is 2.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [2,3,1,0]\n<strong>Output:</strong> 2\n<strong>Explanation:</strong> \nThere are two valid splits in nums:\n- Split nums at index 1. Then, the first part is [2,3], and its sum is 5. The second part is [1,0], and its sum is 1. Since 5 &gt;= 1, i = 1 is a valid split. \n- Split nums at index 2. Then, the first part is [2,3,1], and its sum is 6. The second part is [0], and its sum is 0. Since 6 &gt;= 0, i = 2 is a valid split.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>2 &lt;= nums.length &lt;= 10<sup>5</sup></code></li>\n\t<li><code>-10<sup>5</sup> &lt;= nums[i] &lt;= 10<sup>5</sup></code></li>\n</ul>\n",
      "lcSlug": "number-of-ways-to-split-array",
      "summary": "Prefix split count — Prefix sums + hash map or difference array for range/subarray queries."
    },
    {
      "id": "pre-17",
      "title": "Maximum Size Subarray Sum Equals k",
      "lc": null,
      "importance": "should",
      "subtopic": "hashmap",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums, k",
          "out": "max len"
        }
      ],
      "approaches": [
        {
          "name": "Prefix + hashmap",
          "time": "O(n)",
          "space": "O(n)",
          "code": "int maxSubArrayLen(vector<int>& nums, int k) {\n    unordered_map<long long,int> first{{0,-1}};\n    long long sum = 0; int ans = 0;\n    for (int i = 0; i < (int)nums.size(); i++) {\n        sum += nums[i];\n        if (first.count(sum - k)) ans = max(ans, i - first[sum - k]);\n        if (!first.count(sum)) first[sum] = i;\n    }\n    return ans;\n}"
        }
      ],
      "description": "Given an integer array and k, return the maximum length of a subarray whose sum equals k.",
      "summary": "Prefix sum + earliest index map: if prefix-k seen, update max length."
    },
    {
      "id": "pre-18",
      "title": "Binary Subarrays With Sum",
      "lc": 930,
      "importance": "should",
      "subtopic": "prefix",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums, goal",
          "out": "count"
        }
      ],
      "approaches": [
        {
          "name": "Prefix mod counts",
          "time": "O(n)",
          "space": "O(n)",
          "code": "int numSubarraysWithSum(vector<int>& nums, int goal) {\n    auto atMost = [&](int g) {\n        if (g < 0) return 0;\n        long ans = 0; int l = 0, sum = 0;\n        for (int r = 0; r < (int)nums.size(); r++) {\n            sum += nums[r];\n            while (sum > g) sum -= nums[l++];\n            ans += r - l + 1;\n        }\n        return ans;\n    };\n    return (int)(atMost(goal) - atMost(goal - 1));\n}"
        }
      ],
      "description": "Given a binary array `nums` and an integer `goal`, return the number of non-empty subarrays with a sum `goal`.\n\nA subarray is a contiguous part of the array.\n\n \n\nExample 1:\n\nInput: nums = [1,0,1,0,1], goal = 2\nOutput: 4\nExplanation: The 4 subarrays are bolded and underlined below:\n[1,0,1,0,1]\n[1,0,1,0,1]\n[1,0,1,0,1]\n[1,0,1,0,1]\n\nExample 2:\n\nInput: nums = [0,0,0,0,0], goal = 0\nOutput: 15\n\n \n\nConstraints:\n\n\t• `1 4`\n• `nums[i]` is either `0` or `1`.\n• `0",
      "descriptionHtml": "<p>Given a binary array <code>nums</code> and an integer <code>goal</code>, return <em>the number of non-empty <strong>subarrays</strong> with a sum</em> <code>goal</code>.</p>\n\n<p>A <strong>subarray</strong> is a contiguous part of the array.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [1,0,1,0,1], goal = 2\n<strong>Output:</strong> 4\n<strong>Explanation:</strong> The 4 subarrays are bolded and underlined below:\n[<u><strong>1,0,1</strong></u>,0,1]\n[<u><strong>1,0,1,0</strong></u>,1]\n[1,<u><strong>0,1,0,1</strong></u>]\n[1,0,<u><strong>1,0,1</strong></u>]\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [0,0,0,0,0], goal = 0\n<strong>Output:</strong> 15\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= nums.length &lt;= 3 * 10<sup>4</sup></code></li>\n\t<li><code>nums[i]</code> is either <code>0</code> or <code>1</code>.</li>\n\t<li><code>0 &lt;= goal &lt;= nums.length</code></li>\n</ul>\n",
      "lcSlug": "binary-subarrays-with-sum",
      "summary": "Prefix mod counts — Prefix sums + hash map or difference array for range/subarray queries."
    },
    {
      "id": "pre-19",
      "title": "Shortest Subarray With Sum at Least K",
      "lc": 862,
      "importance": "nice",
      "subtopic": "prefix",
      "difficulty": "Hard",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums, k",
          "out": "min len"
        }
      ],
      "approaches": [
        {
          "name": "Deque + prefix",
          "time": "O(n)",
          "space": "O(n)",
          "code": "int shortestSubarray(vector<int>& nums, int k) {\n    int n=nums.size(); vector<long long> pre(n+1);\n    for(int i=0;i<n;i++) pre[i+1]=pre[i]+nums[i];\n    deque<int> dq; int ans=n+1;\n    for(int i=0;i<=n;i++){\n        while(!dq.empty() && pre[i]-pre[dq.front()]>=k){ ans=min(ans,i-dq.front()); dq.pop_front(); }\n        while(!dq.empty() && pre[i]<=pre[dq.back()]) dq.pop_back();\n        dq.push_back(i);\n    } return ans<=n? ans: -1;\n}"
        }
      ],
      "description": "Given an integer array `nums` and an integer `k`, return the length of the shortest non-empty subarray of `nums` with a sum of at least `k`. If there is no such subarray, return `-1`.\n\nA subarray is a contiguous part of an array.\n\n \n\nExample 1:\n\nInput: nums = [1], k = 1\nOutput: 1\n\nExample 2:\n\nInput: nums = [1,2], k = 4\nOutput: -1\n\nExample 3:\n\nInput: nums = [2,-1,2], k = 3\nOutput: 3\n\n \n\nConstraints:\n\n\t• `1 5`\n• `-105 5`\n• `1 9`",
      "descriptionHtml": "<p>Given an integer array <code>nums</code> and an integer <code>k</code>, return <em>the length of the shortest non-empty <strong>subarray</strong> of </em><code>nums</code><em> with a sum of at least </em><code>k</code>. If there is no such <strong>subarray</strong>, return <code>-1</code>.</p>\n\n<p>A <strong>subarray</strong> is a <strong>contiguous</strong> part of an array.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<pre><strong>Input:</strong> nums = [1], k = 1\n<strong>Output:</strong> 1\n</pre><p><strong class=\"example\">Example 2:</strong></p>\n<pre><strong>Input:</strong> nums = [1,2], k = 4\n<strong>Output:</strong> -1\n</pre><p><strong class=\"example\">Example 3:</strong></p>\n<pre><strong>Input:</strong> nums = [2,-1,2], k = 3\n<strong>Output:</strong> 3\n</pre>\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= nums.length &lt;= 10<sup>5</sup></code></li>\n\t<li><code>-10<sup>5</sup> &lt;= nums[i] &lt;= 10<sup>5</sup></code></li>\n\t<li><code>1 &lt;= k &lt;= 10<sup>9</sup></code></li>\n</ul>\n",
      "lcSlug": "shortest-subarray-with-sum-at-least-k",
      "summary": "Deque + prefix — Prefix sums + hash map or difference array for range/subarray queries."
    },
    {
      "id": "pre-20",
      "title": "Maximum Sum of Two Non-Overlapping Subarrays",
      "lc": 1031,
      "importance": "nice",
      "subtopic": "prefix",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums, L,M",
          "out": "max sum"
        }
      ],
      "approaches": [
        {
          "name": "Prefix + two windows",
          "time": "O(n)",
          "space": "O(n)",
          "code": "int maxSumTwoNoOverlap(vector<int>& nums, int firstLen, int secondLen) {\n    int n=nums.size(); vector<int> pre(n+1);\n    for(int i=0;i<n;i++) pre[i+1]=pre[i]+nums[i];\n    auto best=[&](int L,int M){\n        int ans=0, bestL=0;\n        for(int i=L;i<=n-M;i++){\n            bestL=max(bestL, pre[i]-pre[i-L]);\n            ans=max(ans, bestL + pre[i+M]-pre[i]);\n        } return ans;\n    };\n    return max(best(firstLen,secondLen), best(secondLen,firstLen));\n}"
        }
      ],
      "description": "Given an integer array `nums` and two integers `firstLen` and `secondLen`, return the maximum sum of elements in two non-overlapping subarrays with lengths `firstLen` and `secondLen`.\n\nThe array with length `firstLen` could occur before or after the array with length `secondLen`, but they have to be non-overlapping.\n\nA subarray is a contiguous part of an array.\n\n \n\nExample 1:\n\nInput: nums = [0,6,5,2,2,5,1,9,4], firstLen = 1, secondLen = 2\nOutput: 20\nExplanation: One choice of subarrays is [9] with length 1, and [6,5] with length 2.\n\nExample 2:\n\nInput: nums = [3,8,1,3,2,1,8,9,0], firstLen = 3, secondLen = 2\nOutput: 29\nExplanation: One choice of subarrays is [3,8,1] with length 3, and [8,9] with length 2.\n\nExample 3:\n\nInput: nums = [2,1,5,6,0,9,5,0,3,8], firstLen = 4, secondLen = 3\nOutput: 31\nExplanation: One choice of subarrays is [5,6,0,9] with length 4, and [0,3,8] with length 3.\n\n \n\nConstraints:\n\n\t• `1",
      "descriptionHtml": "<p>Given an integer array <code>nums</code> and two integers <code>firstLen</code> and <code>secondLen</code>, return <em>the maximum sum of elements in two non-overlapping <strong>subarrays</strong> with lengths </em><code>firstLen</code><em> and </em><code>secondLen</code>.</p>\n\n<p>The array with length <code>firstLen</code> could occur before or after the array with length <code>secondLen</code>, but they have to be non-overlapping.</p>\n\n<p>A <strong>subarray</strong> is a <strong>contiguous</strong> part of an array.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [0,6,5,2,2,5,1,9,4], firstLen = 1, secondLen = 2\n<strong>Output:</strong> 20\n<strong>Explanation:</strong> One choice of subarrays is [9] with length 1, and [6,5] with length 2.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [3,8,1,3,2,1,8,9,0], firstLen = 3, secondLen = 2\n<strong>Output:</strong> 29\n<strong>Explanation:</strong> One choice of subarrays is [3,8,1] with length 3, and [8,9] with length 2.\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [2,1,5,6,0,9,5,0,3,8], firstLen = 4, secondLen = 3\n<strong>Output:</strong> 31\n<strong>Explanation:</strong> One choice of subarrays is [5,6,0,9] with length 4, and [0,3,8] with length 3.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= firstLen, secondLen &lt;= 1000</code></li>\n\t<li><code>2 &lt;= firstLen + secondLen &lt;= 1000</code></li>\n\t<li><code>firstLen + secondLen &lt;= nums.length &lt;= 1000</code></li>\n\t<li><code>0 &lt;= nums[i] &lt;= 1000</code></li>\n</ul>\n",
      "lcSlug": "maximum-sum-of-two-non-overlapping-subarrays",
      "summary": "Prefix + two windows — Prefix sums + hash map or difference array for range/subarray queries."
    },
    {
      "id": "pre-21",
      "title": "Range Sum Query Mutable",
      "lc": 307,
      "importance": "should",
      "subtopic": "bit",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums, updates",
          "out": "range sums"
        }
      ],
      "approaches": [
        {
          "name": "Fenwick tree",
          "time": "O(log n)",
          "space": "O(n)",
          "code": "class NumArray {\n    vector<int> bit; int n;\n    void add(int i, int d) { for (++i; i <= n; i += i&-i) bit[i] += d; }\n    int sum(int i) { int s = 0; for (++i; i > 0; i -= i&-i) s += bit[i]; return s; }\npublic:\n    NumArray(vector<int>& nums) : n(nums.size()), bit(n+1) {\n        for (int i = 0; i < n; i++) add(i, nums[i]);\n    }\n    void update(int index, int val) { add(index, val - sum(index) + sum(index-1)); }\n    int sumRange(int l, int r) { return sum(r) - sum(l-1); }\n};"
        }
      ],
      "description": "Given an integer array `nums`, handle multiple queries of the following types:\n\n\t• Update the value of an element in `nums`.\n• Calculate the sum of the elements of `nums` between indices `left` and `right` inclusive where `left \n\nImplement the `NumArray` class:\n\n\t• `NumArray(int[] nums)` Initializes the object with the integer array `nums`.\n• `void update(int index, int val)` Updates the value of `nums[index]` to be `val`.\n• `int sumRange(int left, int right)` Returns the sum of the elements of `nums` between indices `left` and `right` inclusive (i.e. `nums[left] + nums[left + 1] + ... + nums[right]`).\n\n \n\nExample 1:\n\nInput\n[\"NumArray\", \"sumRange\", \"update\", \"sumRange\"]\n[[[1, 3, 5]], [0, 2], [1, 2], [0, 2]]\nOutput\n[null, 9, null, 8]\n\nExplanation\nNumArray numArray = new NumArray([1, 3, 5]);\nnumArray.sumRange(0, 2); // return 1 + 3 + 5 = 9\nnumArray.update(1, 2);   // nums = [1, 2, 5]\nnumArray.sumRange(0, 2); // return 1 + 2 + 5 = 8\n\n \n\nConstraints:\n\n\t• `1 4`\n• `-100 4` calls will be made to `update` and `sumRange`.",
      "descriptionHtml": "<p>Given an integer array <code>nums</code>, handle multiple queries of the following types:</p>\n\n<ol>\n\t<li><strong>Update</strong> the value of an element in <code>nums</code>.</li>\n\t<li>Calculate the <strong>sum</strong> of the elements of <code>nums</code> between indices <code>left</code> and <code>right</code> <strong>inclusive</strong> where <code>left &lt;= right</code>.</li>\n</ol>\n\n<p>Implement the <code>NumArray</code> class:</p>\n\n<ul>\n\t<li><code>NumArray(int[] nums)</code> Initializes the object with the integer array <code>nums</code>.</li>\n\t<li><code>void update(int index, int val)</code> <strong>Updates</strong> the value of <code>nums[index]</code> to be <code>val</code>.</li>\n\t<li><code>int sumRange(int left, int right)</code> Returns the <strong>sum</strong> of the elements of <code>nums</code> between indices <code>left</code> and <code>right</code> <strong>inclusive</strong> (i.e. <code>nums[left] + nums[left + 1] + ... + nums[right]</code>).</li>\n</ul>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input</strong>\n[&quot;NumArray&quot;, &quot;sumRange&quot;, &quot;update&quot;, &quot;sumRange&quot;]\n[[[1, 3, 5]], [0, 2], [1, 2], [0, 2]]\n<strong>Output</strong>\n[null, 9, null, 8]\n\n<strong>Explanation</strong>\nNumArray numArray = new NumArray([1, 3, 5]);\nnumArray.sumRange(0, 2); // return 1 + 3 + 5 = 9\nnumArray.update(1, 2);   // nums = [1, 2, 5]\nnumArray.sumRange(0, 2); // return 1 + 2 + 5 = 8\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= nums.length &lt;= 3 * 10<sup>4</sup></code></li>\n\t<li><code>-100 &lt;= nums[i] &lt;= 100</code></li>\n\t<li><code>0 &lt;= index &lt; nums.length</code></li>\n\t<li><code>-100 &lt;= val &lt;= 100</code></li>\n\t<li><code>0 &lt;= left &lt;= right &lt; nums.length</code></li>\n\t<li>At most <code>3 * 10<sup>4</sup></code> calls will be made to <code>update</code> and <code>sumRange</code>.</li>\n</ul>\n",
      "lcSlug": "range-sum-query-mutable",
      "summary": "add(i,v): i+=i&-i; sum(i): i-=i&-i — point update + prefix sum."
    },
    {
      "id": "pre-22",
      "title": "Count Number of Nice Subarrays",
      "lc": 1248,
      "importance": "should",
      "subtopic": "prefix",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums, k odd",
          "out": "count"
        }
      ],
      "approaches": [
        {
          "name": "Prefix mod parity",
          "time": "O(n)",
          "space": "O(n)",
          "code": "int numberOfSubarrays(vector<int>& nums, int k) {\n    unordered_map<int,int> cnt{{0,1}}; int pref = 0, ans = 0;\n    for (int x : nums) {\n        pref ^= x & 1;\n        ans += cnt[pref ^ (k & 1)];\n        cnt[pref]++;\n    }\n    return ans;\n}"
        }
      ],
      "description": "Given an array of integers `nums` and an integer `k`. A continuous subarray is called nice if there are `k` odd numbers on it.\n\nReturn the number of nice sub-arrays.\n\n \n\nExample 1:\n\nInput: nums = [1,1,2,1,1], k = 3\nOutput: 2\nExplanation: The only sub-arrays with 3 odd numbers are [1,1,2,1] and [1,2,1,1].\n\nExample 2:\n\nInput: nums = [2,4,6], k = 1\nOutput: 0\nExplanation: There are no odd numbers in the array.\n\nExample 3:\n\nInput: nums = [2,2,2,1,2,2,1,2,2,2], k = 2\nOutput: 16\n\n \n\nConstraints:\n\n\t• `1",
      "descriptionHtml": "<p>Given an array of integers <code>nums</code> and an integer <code>k</code>. A continuous subarray is called <strong>nice</strong> if there are <code>k</code> odd numbers on it.</p>\n\n<p>Return <em>the number of <strong>nice</strong> sub-arrays</em>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [1,1,2,1,1], k = 3\n<strong>Output:</strong> 2\n<strong>Explanation:</strong> The only sub-arrays with 3 odd numbers are [1,1,2,1] and [1,2,1,1].\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [2,4,6], k = 1\n<strong>Output:</strong> 0\n<strong>Explanation:</strong> There are no odd numbers in the array.\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [2,2,2,1,2,2,1,2,2,2], k = 2\n<strong>Output:</strong> 16\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= nums.length &lt;= 50000</code></li>\n\t<li><code>1 &lt;= nums[i] &lt;= 10^5</code></li>\n\t<li><code>1 &lt;= k &lt;= nums.length</code></li>\n</ul>\n",
      "lcSlug": "count-number-of-nice-subarrays",
      "summary": "Prefix mod parity — Prefix sums + hash map or difference array for range/subarray queries."
    }
  ]
};
