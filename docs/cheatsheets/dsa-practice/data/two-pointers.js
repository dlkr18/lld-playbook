window.PRACTICE_TOPIC = {
  "id": "two-pointers",
  "title": "Two Pointers & Sliding Window",
  "expected_count": 28,
  "strategy": "<strong>Speed-run:</strong> Opposite pointers + variable window = most string/array hard problems. Filter <em>Must do</em> first.",
  "subtopics": [
    {
      "id": "opposite",
      "label": "Opposite"
    },
    {
      "id": "same-dir",
      "label": "Same Direction"
    },
    {
      "id": "fixed-window",
      "label": "Fixed Window"
    },
    {
      "id": "variable-window",
      "label": "Variable Window"
    }
  ],
  "questions": [
    {
      "id": "tp-01",
      "title": "Two Sum II",
      "lc": 167,
      "importance": "must",
      "subtopic": "opposite",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "sorted nums, target",
          "out": "indices"
        }
      ],
      "approaches": [
        {
          "name": "Two pointers",
          "time": "O(n)",
          "space": "O(1)",
          "code": "vector<int> twoSum(vector<int>& nums, int target) {\n    int l = 0, r = (int)nums.size()-1;\n    while (l < r) {\n        int s = nums[l]+nums[r];\n        if (s == target) return {l+1,r+1};\n        if (s < target) l++; else r--;\n    } return {};\n}"
        }
      ],
      "description": "Given a 1-indexed array of integers `numbers` that is already sorted in non-decreasing order, find two numbers such that they add up to a specific `target` number. Let these two numbers be `numbers[index1]` and `numbers[index2]` where `1 1 2 1` and `index2`, each incremented by one, as an integer array `[index1, index2]` of length 2.\n\nThe tests are generated such that there is exactly one solution. You may not use the same element twice.\n\nYour solution must use only constant extra space.\n\n \n\nExample 1:\n\nInput: numbers = [2,7,11,15], target = 9\nOutput: [1,2]\nExplanation: The sum of 2 and 7 is 9. Therefore, index1 = 1, index2 = 2. We return [1, 2].\n\nExample 2:\n\nInput: numbers = [2,3,4], target = 6\nOutput: [1,3]\nExplanation: The sum of 2 and 4 is 6. Therefore index1 = 1, index2 = 3. We return [1, 3].\n\nExample 3:\n\nInput: numbers = [-1,0], target = -1\nOutput: [1,2]\nExplanation: The sum of -1 and 0 is -1. Therefore index1 = 1, index2 = 2. We return [1, 2].\n\n \n\nConstraints:\n\n\t• `2 4`\n• `-1000",
      "descriptionHtml": "<p>Given a <strong>1-indexed</strong> array of integers <code>numbers</code> that is already <strong><em>sorted in non-decreasing order</em></strong>, find two numbers such that they add up to a specific <code>target</code> number. Let these two numbers be <code>numbers[index<sub>1</sub>]</code> and <code>numbers[index<sub>2</sub>]</code> where <code>1 &lt;= index<sub>1</sub> &lt; index<sub>2</sub> &lt;= numbers.length</code>.</p>\n\n<p>Return<em> the indices of the two numbers&nbsp;</em><code>index<sub>1</sub></code><em> and </em><code>index<sub>2</sub></code><em>, <strong>each incremented by one,</strong> as an integer array </em><code>[index<sub>1</sub>, index<sub>2</sub>]</code><em> of length 2.</em></p>\n\n<p>The tests are generated such that there is <strong>exactly one solution</strong>. You <strong>may not</strong> use the same element twice.</p>\n\n<p>Your solution must use only constant extra space.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> numbers = [<u>2</u>,<u>7</u>,11,15], target = 9\n<strong>Output:</strong> [1,2]\n<strong>Explanation:</strong> The sum of 2 and 7 is 9. Therefore, index<sub>1</sub> = 1, index<sub>2</sub> = 2. We return [1, 2].\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> numbers = [<u>2</u>,3,<u>4</u>], target = 6\n<strong>Output:</strong> [1,3]\n<strong>Explanation:</strong> The sum of 2 and 4 is 6. Therefore index<sub>1</sub> = 1, index<sub>2</sub> = 3. We return [1, 3].\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> numbers = [<u>-1</u>,<u>0</u>], target = -1\n<strong>Output:</strong> [1,2]\n<strong>Explanation:</strong> The sum of -1 and 0 is -1. Therefore index<sub>1</sub> = 1, index<sub>2</sub> = 2. We return [1, 2].\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>2 &lt;= numbers.length &lt;= 3 * 10<sup>4</sup></code></li>\n\t<li><code>-1000 &lt;= numbers[i] &lt;= 1000</code></li>\n\t<li><code>numbers</code> is sorted in <strong>non-decreasing order</strong>.</li>\n\t<li><code>-1000 &lt;= target &lt;= 1000</code></li>\n\t<li>The tests are generated such that there is <strong>exactly one solution</strong>.</li>\n</ul>\n",
      "lcSlug": "two-sum-ii-input-array-is-sorted",
      "summary": "Opposite ends or same direction — move based on comparison/invariant."
    },
    {
      "id": "tp-02",
      "title": "3Sum",
      "lc": 15,
      "importance": "must",
      "subtopic": "opposite",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums",
          "out": "triplets"
        }
      ],
      "approaches": [
        {
          "name": "Sort + two pointers",
          "time": "O(n^2)",
          "space": "O(1)",
          "code": "vector<vector<int>> threeSum(vector<int>& nums) {\n    sort(nums.begin(), nums.end()); vector<vector<int>> ans;\n    for (int i = 0; i < (int)nums.size(); i++) {\n        if (i && nums[i]==nums[i-1]) continue;\n        int l = i+1, r = (int)nums.size()-1;\n        while (l < r) {\n            int s = nums[i]+nums[l]+nums[r];\n            if (!s) { ans.push_back({nums[i],nums[l],nums[r]});\n                while (l<r && nums[l]==nums[l+1]) l++;\n                while (l<r && nums[r]==nums[r-1]) r--;\n                l++; r--;\n            } else if (s < 0) l++; else r--;\n        }\n    } return ans;\n}"
        }
      ],
      "description": "Given an integer array nums, return all the triplets `[nums[i], nums[j], nums[k]]` such that `i != j`, `i != k`, and `j != k`, and `nums[i] + nums[j] + nums[k] == 0`.\n\nNotice that the solution set must not contain duplicate triplets.\n\n \n\nExample 1:\n\nInput: nums = [-1,0,1,2,-1,-4]\nOutput: [[-1,-1,2],[-1,0,1]]\nExplanation: \nnums[0] + nums[1] + nums[2] = (-1) + 0 + 1 = 0.\nnums[1] + nums[2] + nums[4] = 0 + 1 + (-1) = 0.\nnums[0] + nums[3] + nums[4] = (-1) + 2 + (-1) = 0.\nThe distinct triplets are [-1,0,1] and [-1,-1,2].\nNotice that the order of the output and the order of the triplets does not matter.\n\nExample 2:\n\nInput: nums = [0,1,1]\nOutput: []\nExplanation: The only possible triplet does not sum up to 0.\n\nExample 3:\n\nInput: nums = [0,0,0]\nOutput: [[0,0,0]]\nExplanation: The only possible triplet sums up to 0.\n\n \n\nConstraints:\n\n\t• `3 5 5`",
      "descriptionHtml": "<p>Given an integer array nums, return all the triplets <code>[nums[i], nums[j], nums[k]]</code> such that <code>i != j</code>, <code>i != k</code>, and <code>j != k</code>, and <code>nums[i] + nums[j] + nums[k] == 0</code>.</p>\n\n<p>Notice that the solution set must not contain duplicate triplets.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [-1,0,1,2,-1,-4]\n<strong>Output:</strong> [[-1,-1,2],[-1,0,1]]\n<strong>Explanation:</strong> \nnums[0] + nums[1] + nums[2] = (-1) + 0 + 1 = 0.\nnums[1] + nums[2] + nums[4] = 0 + 1 + (-1) = 0.\nnums[0] + nums[3] + nums[4] = (-1) + 2 + (-1) = 0.\nThe distinct triplets are [-1,0,1] and [-1,-1,2].\nNotice that the order of the output and the order of the triplets does not matter.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [0,1,1]\n<strong>Output:</strong> []\n<strong>Explanation:</strong> The only possible triplet does not sum up to 0.\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [0,0,0]\n<strong>Output:</strong> [[0,0,0]]\n<strong>Explanation:</strong> The only possible triplet sums up to 0.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>3 &lt;= nums.length &lt;= 3000</code></li>\n\t<li><code>-10<sup>5</sup> &lt;= nums[i] &lt;= 10<sup>5</sup></code></li>\n</ul>\n",
      "lcSlug": "3sum",
      "summary": "Sort first; l/r or fixed i + two pointers on rest."
    },
    {
      "id": "tp-03",
      "title": "Container With Most Water",
      "lc": 11,
      "importance": "must",
      "subtopic": "opposite",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "heights",
          "out": "max area"
        }
      ],
      "approaches": [
        {
          "name": "Two pointers greedy",
          "time": "O(n)",
          "space": "O(1)",
          "code": "int maxArea(vector<int>& h) {\n    int l = 0, r = (int)h.size()-1, ans = 0;\n    while (l < r) {\n        ans = max(ans, min(h[l], h[r]) * (r-l));\n        if (h[l] < h[r]) l++; else r--;\n    } return ans;\n}"
        }
      ],
      "description": "You are given an integer array `height` of length `n`. There are `n` vertical lines drawn such that the two endpoints of the `ith` line are `(i, 0)` and `(i, height[i])`.\n\nFind two lines that together with the x-axis form a container, such that the container contains the most water.\n\nReturn the maximum amount of water a container can store.\n\nNotice that you may not slant the container.\n\n \n\nExample 1:\n\nInput: height = [1,8,6,2,5,4,8,3,7]\nOutput: 49\nExplanation: The above vertical lines are represented by array [1,8,6,2,5,4,8,3,7]. In this case, the max area of water (blue section) the container can contain is 49.\n\nExample 2:\n\nInput: height = [1,1]\nOutput: 1\n\n \n\nConstraints:\n\n\t• `n == height.length`\n• `2 5`\n• `0 4`",
      "descriptionHtml": "<p>You are given an integer array <code>height</code> of length <code>n</code>. There are <code>n</code> vertical lines drawn such that the two endpoints of the <code>i<sup>th</sup></code> line are <code>(i, 0)</code> and <code>(i, height[i])</code>.</p>\n\n<p>Find two lines that together with the x-axis form a container, such that the container contains the most water.</p>\n\n<p>Return <em>the maximum amount of water a container can store</em>.</p>\n\n<p><strong>Notice</strong> that you may not slant the container.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://s3-lc-upload.s3.amazonaws.com/uploads/2018/07/17/question_11.jpg\" style=\"width: 600px; height: 287px;\" />\n<pre>\n<strong>Input:</strong> height = [1,8,6,2,5,4,8,3,7]\n<strong>Output:</strong> 49\n<strong>Explanation:</strong> The above vertical lines are represented by array [1,8,6,2,5,4,8,3,7]. In this case, the max area of water (blue section) the container can contain is 49.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> height = [1,1]\n<strong>Output:</strong> 1\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>n == height.length</code></li>\n\t<li><code>2 &lt;= n &lt;= 10<sup>5</sup></code></li>\n\t<li><code>0 &lt;= height[i] &lt;= 10<sup>4</sup></code></li>\n</ul>\n",
      "lcSlug": "container-with-most-water",
      "summary": "Move the pointer at the shorter line inward — that's the only way to maybe increase area."
    },
    {
      "id": "tp-04",
      "title": "Trapping Rain Water",
      "lc": 42,
      "importance": "must",
      "subtopic": "opposite",
      "difficulty": "Hard",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "heights",
          "out": "water"
        }
      ],
      "approaches": [
        {
          "name": "Two pointers",
          "time": "O(n)",
          "space": "O(1)",
          "code": "int trap(vector<int>& h) {\n    int l = 0, r = (int)h.size() - 1, lm = 0, rm = 0, ans = 0;\n    while (l < r) {\n        if (h[l] < h[r]) { lm = max(lm, h[l]); ans += lm - h[l]; l++; }\n        else { rm = max(rm, h[r]); ans += rm - h[r]; r--; }\n    }\n    return ans;\n}"
        }
      ],
      "description": "Given `n` non-negative integers representing an elevation map where the width of each bar is `1`, compute how much water it can trap after raining.\n\n \n\nExample 1:\n\nInput: height = [0,1,0,2,1,0,1,3,2,1,2,1]\nOutput: 6\nExplanation: The above elevation map (black section) is represented by array [0,1,0,2,1,0,1,3,2,1,2,1]. In this case, 6 units of rain water (blue section) are being trapped.\n\nExample 2:\n\nInput: height = [4,2,0,3,2,5]\nOutput: 9\n\n \n\nConstraints:\n\n\t• `n == height.length`\n• `1 4`\n• `0 5`",
      "descriptionHtml": "<p>Given <code>n</code> non-negative integers representing an elevation map where the width of each bar is <code>1</code>, compute how much water it can trap after raining.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img src=\"https://assets.leetcode.com/uploads/2018/10/22/rainwatertrap.png\" style=\"width: 412px; height: 161px;\" />\n<pre>\n<strong>Input:</strong> height = [0,1,0,2,1,0,1,3,2,1,2,1]\n<strong>Output:</strong> 6\n<strong>Explanation:</strong> The above elevation map (black section) is represented by array [0,1,0,2,1,0,1,3,2,1,2,1]. In this case, 6 units of rain water (blue section) are being trapped.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> height = [4,2,0,3,2,5]\n<strong>Output:</strong> 9\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>n == height.length</code></li>\n\t<li><code>1 &lt;= n &lt;= 2 * 10<sup>4</sup></code></li>\n\t<li><code>0 &lt;= height[i] &lt;= 10<sup>5</sup></code></li>\n</ul>\n",
      "lcSlug": "trapping-rain-water",
      "summary": "Opposite ends or same direction — move based on comparison/invariant."
    },
    {
      "id": "tp-05",
      "title": "Valid Palindrome",
      "lc": 125,
      "importance": "should",
      "subtopic": "opposite",
      "difficulty": "Easy",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "s",
          "out": "true/false"
        }
      ],
      "approaches": [
        {
          "name": "Two pointers",
          "time": "O(n)",
          "space": "O(1)",
          "code": "bool isPalindrome(string s) {\n    int l=0, r=(int)s.size()-1;\n    while (l < r) {\n        while (l<r && !isalnum(s[l])) l++;\n        while (l<r && !isalnum(s[r])) r--;\n        if (tolower(s[l]) != tolower(s[r])) return false;\n        l++; r--;\n    } return true;\n}"
        }
      ],
      "description": "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.\n\nGiven a string `s`, return `true` if it is a palindrome, or `false` otherwise.\n\n \n\nExample 1:\n\nInput: s = \"A man, a plan, a canal: Panama\"\nOutput: true\nExplanation: \"amanaplanacanalpanama\" is a palindrome.\n\nExample 2:\n\nInput: s = \"race a car\"\nOutput: false\nExplanation: \"raceacar\" is not a palindrome.\n\nExample 3:\n\nInput: s = \" \"\nOutput: true\nExplanation: s is an empty string \"\" after removing non-alphanumeric characters.\nSince an empty string reads the same forward and backward, it is a palindrome.\n\n \n\nConstraints:\n\n\t• `1 5`\n• `s` consists only of printable ASCII characters.",
      "descriptionHtml": "<p>A phrase is a <strong>palindrome</strong> if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.</p>\n\n<p>Given a string <code>s</code>, return <code>true</code><em> if it is a <strong>palindrome</strong>, or </em><code>false</code><em> otherwise</em>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> s = &quot;A man, a plan, a canal: Panama&quot;\n<strong>Output:</strong> true\n<strong>Explanation:</strong> &quot;amanaplanacanalpanama&quot; is a palindrome.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> s = &quot;race a car&quot;\n<strong>Output:</strong> false\n<strong>Explanation:</strong> &quot;raceacar&quot; is not a palindrome.\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> s = &quot; &quot;\n<strong>Output:</strong> true\n<strong>Explanation:</strong> s is an empty string &quot;&quot; after removing non-alphanumeric characters.\nSince an empty string reads the same forward and backward, it is a palindrome.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= s.length &lt;= 2 * 10<sup>5</sup></code></li>\n\t<li><code>s</code> consists only of printable ASCII characters.</li>\n</ul>\n",
      "lcSlug": "valid-palindrome",
      "summary": "Opposite ends or same direction — move based on comparison/invariant."
    },
    {
      "id": "tp-06",
      "title": "Remove Duplicates from Sorted Array",
      "lc": 26,
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
          "out": "new length"
        }
      ],
      "approaches": [
        {
          "name": "Same direction",
          "time": "O(n)",
          "space": "O(1)",
          "code": "int removeDuplicates(vector<int>& nums) {\n    if (nums.empty()) return 0;\n    int w = 1;\n    for (int i=1; i<(int)nums.size(); i++)\n        if (nums[i] != nums[i-1]) nums[w++] = nums[i];\n    return w;\n}"
        }
      ],
      "description": "Given an integer array `nums` sorted in non-decreasing order, remove the duplicates in-place such that each unique element appears only once. The relative order of the elements should be kept the same.\n\nConsider the number of unique elements in `nums` to be `k​​​​​​​`​​​​​​​. After removing duplicates, return the number of unique elements `k`.\n\nThe first `k` elements of `nums` should contain the unique numbers in sorted order. The remaining elements beyond index `k - 1` can be ignored.\n\nCustom Judge:\n\nThe judge will test your solution with the following code:\n\nint[] nums = [...]; // Input array\nint[] expectedNums = [...]; // The expected answer with correct length\n\nint k = removeDuplicates(nums); // Calls your implementation\n\nassert k == expectedNums.length;\nfor (int i = 0; i If all assertions pass, then your solution will be accepted.\n\n \n\nExample 1:\n\nInput: nums = [1,1,2]\nOutput: 2, nums = [1,2,_]\nExplanation: Your function should return k = 2, with the first two elements of nums being 1 and 2 respectively.\nIt does not matter what you leave beyond the returned k (hence they are underscores).\n\nExample 2:\n\nInput: nums = [0,0,1,1,1,2,2,3,3,4]\nOutput: 5, nums = [0,1,2,3,4,_,_,_,_,_]\nExplanation: Your function should return k = 5, with the first five elements of nums being 0, 1, 2, 3, and 4 respectively.\nIt does not matter what you leave beyond the returned k (hence they are underscores).\n\n \n\nConstraints:\n\n\t• `1 4`\n• `-100",
      "descriptionHtml": "<p>Given an integer array <code>nums</code> sorted in <strong>non-decreasing order</strong>, remove the duplicates <a href=\"https://en.wikipedia.org/wiki/In-place_algorithm\" target=\"_blank\"><strong>in-place</strong></a> such that each unique element appears only <strong>once</strong>. The <strong>relative order</strong> of the elements should be kept the <strong>same</strong>.</p>\n\n<p>Consider the number of <em>unique elements</em> in&nbsp;<code>nums</code> to be <code>k<strong>​​​​​​​</strong></code>​​​​​​​. <meta charset=\"UTF-8\" />After removing duplicates, return the number of unique elements&nbsp;<code>k</code>.</p>\n\n<p><meta charset=\"UTF-8\" />The first&nbsp;<code>k</code>&nbsp;elements of&nbsp;<code>nums</code>&nbsp;should contain the unique numbers in <strong>sorted order</strong>. The remaining elements beyond index&nbsp;<code>k - 1</code>&nbsp;can be ignored.</p>\n\n<p><strong>Custom Judge:</strong></p>\n\n<p>The judge will test your solution with the following code:</p>\n\n<pre>\nint[] nums = [...]; // Input array\nint[] expectedNums = [...]; // The expected answer with correct length\n\nint k = removeDuplicates(nums); // Calls your implementation\n\nassert k == expectedNums.length;\nfor (int i = 0; i &lt; k; i++) {\n    assert nums[i] == expectedNums[i];\n}\n</pre>\n\n<p>If all assertions pass, then your solution will be <strong>accepted</strong>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [1,1,2]\n<strong>Output:</strong> 2, nums = [1,2,_]\n<strong>Explanation:</strong> Your function should return k = 2, with the first two elements of nums being 1 and 2 respectively.\nIt does not matter what you leave beyond the returned k (hence they are underscores).\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [0,0,1,1,1,2,2,3,3,4]\n<strong>Output:</strong> 5, nums = [0,1,2,3,4,_,_,_,_,_]\n<strong>Explanation:</strong> Your function should return k = 5, with the first five elements of nums being 0, 1, 2, 3, and 4 respectively.\nIt does not matter what you leave beyond the returned k (hence they are underscores).\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= nums.length &lt;= 3 * 10<sup>4</sup></code></li>\n\t<li><code>-100 &lt;= nums[i] &lt;= 100</code></li>\n\t<li><code>nums</code> is sorted in <strong>non-decreasing</strong> order.</li>\n</ul>\n",
      "lcSlug": "remove-duplicates-from-sorted-array",
      "summary": "Same direction — state invariant, then loop."
    },
    {
      "id": "tp-07",
      "title": "Remove Element",
      "lc": 27,
      "importance": "should",
      "subtopic": "same-dir",
      "difficulty": "Easy",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums, val",
          "out": "new length"
        }
      ],
      "approaches": [
        {
          "name": "Two pointers",
          "time": "O(n)",
          "space": "O(1)",
          "code": "int removeElement(vector<int>& nums, int val) {\n    int w = 0;\n    for (int x : nums) if (x != val) nums[w++] = x;\n    return w;\n}"
        }
      ],
      "description": "Given an integer array `nums` and an integer `val`, remove all occurrences of `val` in `nums` in-place. The order of the elements may be changed. Then return the number of elements in `nums` which are not equal to `val`.\n\nConsider the number of elements in `nums` which are not equal to `val` be `k`, to get accepted, you need to do the following things:\n\n\t• Change the array `nums` such that the first `k` elements of `nums` contain the elements which are not equal to `val`. The remaining elements of `nums` are not important as well as the size of `nums`.\n• Return `k`.\n\nCustom Judge:\n\nThe judge will test your solution with the following code:\n\nint[] nums = [...]; // Input array\nint val = ...; // Value to remove\nint[] expectedNums = [...]; // The expected answer with correct length.\n                            // It is sorted with no values equaling val.\n\nint k = removeElement(nums, val); // Calls your implementation\n\nassert k == expectedNums.length;\nsort(nums, 0, k); // Sort the first k elements of nums\nfor (int i = 0; i If all assertions pass, then your solution will be accepted.\n\n \n\nExample 1:\n\nInput: nums = [3,2,2,3], val = 3\nOutput: 2, nums = [2,2,_,_]\nExplanation: Your function should return k = 2, with the first two elements of nums being 2.\nIt does not matter what you leave beyond the returned k (hence they are underscores).\n\nExample 2:\n\nInput: nums = [0,1,2,2,3,0,4,2], val = 2\nOutput: 5, nums = [0,1,4,0,3,_,_,_]\nExplanation: Your function should return k = 5, with the first five elements of nums containing 0, 0, 1, 3, and 4.\nNote that the five elements can be returned in any order.\nIt does not matter what you leave beyond the returned k (hence they are underscores).\n\n \n\nConstraints:\n\n\t• `0",
      "descriptionHtml": "<p>Given an integer array <code>nums</code> and an integer <code>val</code>, remove all occurrences of <code>val</code> in <code>nums</code> <a href=\"https://en.wikipedia.org/wiki/In-place_algorithm\" target=\"_blank\"><strong>in-place</strong></a>. The order of the elements may be changed. Then return <em>the number of elements in </em><code>nums</code><em> which are not equal to </em><code>val</code>.</p>\n\n<p>Consider the number of elements in <code>nums</code> which are not equal to <code>val</code> be <code>k</code>, to get accepted, you need to do the following things:</p>\n\n<ul>\n\t<li>Change the array <code>nums</code> such that the first <code>k</code> elements of <code>nums</code> contain the elements which are not equal to <code>val</code>. The remaining elements of <code>nums</code> are not important as well as the size of <code>nums</code>.</li>\n\t<li>Return <code>k</code>.</li>\n</ul>\n\n<p><strong>Custom Judge:</strong></p>\n\n<p>The judge will test your solution with the following code:</p>\n\n<pre>\nint[] nums = [...]; // Input array\nint val = ...; // Value to remove\nint[] expectedNums = [...]; // The expected answer with correct length.\n                            // It is sorted with no values equaling val.\n\nint k = removeElement(nums, val); // Calls your implementation\n\nassert k == expectedNums.length;\nsort(nums, 0, k); // Sort the first k elements of nums\nfor (int i = 0; i &lt; actualLength; i++) {\n    assert nums[i] == expectedNums[i];\n}\n</pre>\n\n<p>If all assertions pass, then your solution will be <strong>accepted</strong>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [3,2,2,3], val = 3\n<strong>Output:</strong> 2, nums = [2,2,_,_]\n<strong>Explanation:</strong> Your function should return k = 2, with the first two elements of nums being 2.\nIt does not matter what you leave beyond the returned k (hence they are underscores).\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [0,1,2,2,3,0,4,2], val = 2\n<strong>Output:</strong> 5, nums = [0,1,4,0,3,_,_,_]\n<strong>Explanation:</strong> Your function should return k = 5, with the first five elements of nums containing 0, 0, 1, 3, and 4.\nNote that the five elements can be returned in any order.\nIt does not matter what you leave beyond the returned k (hence they are underscores).\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>0 &lt;= nums.length &lt;= 100</code></li>\n\t<li><code>0 &lt;= nums[i] &lt;= 50</code></li>\n\t<li><code>0 &lt;= val &lt;= 100</code></li>\n</ul>\n",
      "lcSlug": "remove-element",
      "summary": "Opposite ends or same direction — move based on comparison/invariant."
    },
    {
      "id": "tp-08",
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
          "out": "in-place"
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
      "id": "tp-09",
      "title": "Sort Colors",
      "lc": 75,
      "importance": "must",
      "subtopic": "same-dir",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums 0/1/2",
          "out": "sorted"
        }
      ],
      "approaches": [
        {
          "name": "Dutch flag",
          "time": "O(n)",
          "space": "O(1)",
          "code": "void sortColors(vector<int>& nums) {\n    int lo=0, mid=0, hi=(int)nums.size()-1;\n    while (mid <= hi) {\n        if (!nums[mid]) swap(nums[lo++], nums[mid++]);\n        else if (nums[mid]==2) swap(nums[mid], nums[hi--]);\n        else mid++;\n    }\n}"
        }
      ],
      "description": "Given an array `nums` with `n` objects colored red, white, or blue, sort them in-place so that objects of the same color are adjacent, with the colors in the order red, white, and blue.\n\nWe will use the integers `0`, `1`, and `2` to represent the color red, white, and blue, respectively.\n\nYou must solve this problem without using the library's sort function.\n\n \n\nExample 1:\n\nInput: nums = [2,0,2,1,1,0]\nOutput: [0,0,1,1,2,2]\n\nExample 2:\n\nInput: nums = [2,0,1]\nOutput: [0,1,2]\n\n \n\nConstraints:\n\n\t• `n == nums.length`\n• `1 \n\n \n\nFollow up: Could you come up with a one-pass algorithm using only constant extra space?",
      "descriptionHtml": "<p>Given an array <code>nums</code> with <code>n</code> objects colored red, white, or blue, sort them <strong><a href=\"https://en.wikipedia.org/wiki/In-place_algorithm\" target=\"_blank\">in-place</a> </strong>so that objects of the same color are adjacent, with the colors in the order red, white, and blue.</p>\n\n<p>We will use the integers <code>0</code>, <code>1</code>, and <code>2</code> to represent the color red, white, and blue, respectively.</p>\n\n<p>You must solve this problem without using the library&#39;s sort function.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [2,0,2,1,1,0]\n<strong>Output:</strong> [0,0,1,1,2,2]\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [2,0,1]\n<strong>Output:</strong> [0,1,2]\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>n == nums.length</code></li>\n\t<li><code>1 &lt;= n &lt;= 300</code></li>\n\t<li><code>nums[i]</code> is either <code>0</code>, <code>1</code>, or <code>2</code>.</li>\n</ul>\n\n<p>&nbsp;</p>\n<p><strong>Follow up:</strong>&nbsp;Could you come up with a one-pass algorithm using only&nbsp;constant extra space?</p>\n",
      "lcSlug": "sort-colors",
      "summary": "Dutch flag — state invariant, then loop."
    },
    {
      "id": "tp-10",
      "title": "Minimum Window Substring",
      "lc": 76,
      "importance": "must",
      "subtopic": "variable-window",
      "difficulty": "Hard",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "s, t",
          "out": "min window"
        }
      ],
      "approaches": [
        {
          "name": "Variable window",
          "time": "O(n)",
          "space": "O(1)",
          "code": "string minWindow(string s, string t) {\n    vector<int> need(128), have(128);\n    for (char c : t) need[c]++;\n    int req = (int)t.size(), formed = 0, bestL = 0, bestLen = INT_MAX;\n    for (int l = 0, r = 0; r < (int)s.size(); r++) {\n        if (++have[s[r]] <= need[s[r]]) formed++;\n        while (formed == req) {\n            if (r-l+1 < bestLen) { bestLen = r-l+1; bestL = l; }\n            if (--have[s[l]] < need[s[l]]) formed--;\n            l++;\n        }\n    } return bestLen == INT_MAX ? \"\" : s.substr(bestL, bestLen);\n}"
        }
      ],
      "description": "Given two strings `s` and `t` of lengths `m` and `n` respectively, return the minimum window substring of `s` such that every character in `t` (including duplicates) is included in the window. If there is no such substring, return the empty string `\"\"`.\n\nThe testcases will be generated such that the answer is unique.\n\n \n\nExample 1:\n\nInput: s = \"ADOBECODEBANC\", t = \"ABC\"\nOutput: \"BANC\"\nExplanation: The minimum window substring \"BANC\" includes 'A', 'B', and 'C' from string t.\n\nExample 2:\n\nInput: s = \"a\", t = \"a\"\nOutput: \"a\"\nExplanation: The entire string s is the minimum window.\n\nExample 3:\n\nInput: s = \"a\", t = \"aa\"\nOutput: \"\"\nExplanation: Both 'a's from t must be included in the window.\nSince the largest window of s only has one 'a', return empty string.\n\n \n\nConstraints:\n\n\t• `m == s.length`\n• `n == t.length`\n• `1 5`\n• `s` and `t` consist of uppercase and lowercase English letters.\n\n \n\nFollow up: Could you find an algorithm that runs in `O(m + n)` time?",
      "descriptionHtml": "<p>Given two strings <code>s</code> and <code>t</code> of lengths <code>m</code> and <code>n</code> respectively, return <em>the <strong>minimum window</strong></em> <span data-keyword=\"substring-nonempty\"><strong><em>substring</em></strong></span><em> of </em><code>s</code><em> such that every character in </em><code>t</code><em> (<strong>including duplicates</strong>) is included in the window</em>. If there is no such substring, return <em>the empty string </em><code>&quot;&quot;</code>.</p>\n\n<p>The testcases will be generated such that the answer is <strong>unique</strong>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> s = &quot;ADOBECODEBANC&quot;, t = &quot;ABC&quot;\n<strong>Output:</strong> &quot;BANC&quot;\n<strong>Explanation:</strong> The minimum window substring &quot;BANC&quot; includes &#39;A&#39;, &#39;B&#39;, and &#39;C&#39; from string t.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> s = &quot;a&quot;, t = &quot;a&quot;\n<strong>Output:</strong> &quot;a&quot;\n<strong>Explanation:</strong> The entire string s is the minimum window.\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> s = &quot;a&quot;, t = &quot;aa&quot;\n<strong>Output:</strong> &quot;&quot;\n<strong>Explanation:</strong> Both &#39;a&#39;s from t must be included in the window.\nSince the largest window of s only has one &#39;a&#39;, return empty string.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>m == s.length</code></li>\n\t<li><code>n == t.length</code></li>\n\t<li><code>1 &lt;= m, n &lt;= 10<sup>5</sup></code></li>\n\t<li><code>s</code> and <code>t</code> consist of uppercase and lowercase English letters.</li>\n</ul>\n\n<p>&nbsp;</p>\n<p><strong>Follow up:</strong> Could you find an algorithm that runs in <code>O(m + n)</code> time?</p>\n",
      "lcSlug": "minimum-window-substring",
      "summary": "Expand r; while window invalid, shrink l — O(n) because each index enters/exits once."
    },
    {
      "id": "tp-11",
      "title": "Longest Substring Without Repeating",
      "lc": 3,
      "importance": "must",
      "subtopic": "variable-window",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "s",
          "out": "length"
        }
      ],
      "approaches": [
        {
          "name": "Window + last index",
          "time": "O(n)",
          "space": "O(1)",
          "code": "int lengthOfLongestSubstring(string s) {\n    int last[128]; fill(last, last+128, -1);\n    int l = 0, ans = 0;\n    for (int r = 0; r < (int)s.size(); r++) {\n        if (last[s[r]] >= l) l = last[s[r]] + 1;\n        last[s[r]] = r; ans = max(ans, r-l+1);\n    } return ans;\n}"
        }
      ],
      "description": "Given a string `s`, find the length of the longest substring without duplicate characters.\n\n \n\nExample 1:\n\nInput: s = \"abcabcbb\"\nOutput: 3\nExplanation: The answer is \"abc\", with the length of 3. Note that \"bca\" and \"cab\" are also correct answers.\n\nExample 2:\n\nInput: s = \"bbbbb\"\nOutput: 1\nExplanation: The answer is \"b\", with the length of 1.\n\nExample 3:\n\nInput: s = \"pwwkew\"\nOutput: 3\nExplanation: The answer is \"wke\", with the length of 3.\nNotice that the answer must be a substring, \"pwke\" is a subsequence and not a substring.\n\n \n\nConstraints:\n\n\t• `0 4`\n• `s` consists of English letters, digits, symbols and spaces.",
      "descriptionHtml": "<p>Given a string <code>s</code>, find the length of the <strong>longest</strong> <span data-keyword=\"substring-nonempty\"><strong>substring</strong></span> without duplicate characters.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> s = &quot;abcabcbb&quot;\n<strong>Output:</strong> 3\n<strong>Explanation:</strong> The answer is &quot;abc&quot;, with the length of 3. Note that <code>&quot;bca&quot;</code> and <code>&quot;cab&quot;</code> are also correct answers.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> s = &quot;bbbbb&quot;\n<strong>Output:</strong> 1\n<strong>Explanation:</strong> The answer is &quot;b&quot;, with the length of 1.\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> s = &quot;pwwkew&quot;\n<strong>Output:</strong> 3\n<strong>Explanation:</strong> The answer is &quot;wke&quot;, with the length of 3.\nNotice that the answer must be a substring, &quot;pwke&quot; is a subsequence and not a substring.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>0 &lt;= s.length &lt;= 5 * 10<sup>4</sup></code></li>\n\t<li><code>s</code> consists of English letters, digits, symbols and spaces.</li>\n</ul>\n",
      "lcSlug": "longest-substring-without-repeating-characters",
      "summary": "Window + last index — Sliding window: expand right, shrink left while invalid."
    },
    {
      "id": "tp-12",
      "title": "Longest Repeating Character Replacement",
      "lc": 424,
      "importance": "should",
      "subtopic": "variable-window",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "s, k",
          "out": "length"
        }
      ],
      "approaches": [
        {
          "name": "Sliding window",
          "time": "O(n)",
          "space": "O(1)",
          "code": "int characterReplacement(string s, int k) {\n    int cnt[26]={}, l=0, maxf=0, ans=0;\n    for (int r=0; r<(int)s.size(); r++) {\n        maxf = max(maxf, ++cnt[s[r]-'a']);\n        while (r-l+1 - maxf > k) cnt[s[l++]-'a']--;\n        ans = max(ans, r-l+1);\n    } return ans;\n}"
        }
      ],
      "description": "You are given a string `s` and an integer `k`. You can choose any character of the string and change it to any other uppercase English character. You can perform this operation at most `k` times.\n\nReturn the length of the longest substring containing the same letter you can get after performing the above operations.\n\n \n\nExample 1:\n\nInput: s = \"ABAB\", k = 2\nOutput: 4\nExplanation: Replace the two 'A's with two 'B's or vice versa.\n\nExample 2:\n\nInput: s = \"AABABBA\", k = 1\nOutput: 4\nExplanation: Replace the one 'A' in the middle with 'B' and form \"AABBBBA\".\nThe substring \"BBBB\" has the longest repeating letters, which is 4.\nThere may exists other ways to achieve this answer too.\n\n \n\nConstraints:\n\n\t• `1 5`\n• `s` consists of only uppercase English letters.\n• `0",
      "descriptionHtml": "<p>You are given a string <code>s</code> and an integer <code>k</code>. You can choose any character of the string and change it to any other uppercase English character. You can perform this operation at most <code>k</code> times.</p>\n\n<p>Return <em>the length of the longest substring containing the same letter you can get after performing the above operations</em>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> s = &quot;ABAB&quot;, k = 2\n<strong>Output:</strong> 4\n<strong>Explanation:</strong> Replace the two &#39;A&#39;s with two &#39;B&#39;s or vice versa.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> s = &quot;AABABBA&quot;, k = 1\n<strong>Output:</strong> 4\n<strong>Explanation:</strong> Replace the one &#39;A&#39; in the middle with &#39;B&#39; and form &quot;AABBBBA&quot;.\nThe substring &quot;BBBB&quot; has the longest repeating letters, which is 4.\nThere may exists other ways to achieve this answer too.</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= s.length &lt;= 10<sup>5</sup></code></li>\n\t<li><code>s</code> consists of only uppercase English letters.</li>\n\t<li><code>0 &lt;= k &lt;= s.length</code></li>\n</ul>\n",
      "lcSlug": "longest-repeating-character-replacement",
      "summary": "Expand right; while invalid, shrink left — track best window length/sum."
    },
    {
      "id": "tp-13",
      "title": "Permutation in String",
      "lc": 567,
      "importance": "should",
      "subtopic": "fixed-window",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "s1, s2",
          "out": "true/false"
        }
      ],
      "approaches": [
        {
          "name": "Freq window",
          "time": "O(n)",
          "space": "O(1)",
          "code": "bool checkInclusion(string s1, string s2) {\n    if (s1.size() > s2.size()) return false;\n    vector<int> a(26), b(26);\n    for (int i = 0; i < (int)s1.size(); i++) { a[s1[i]-'a']++; b[s2[i]-'a']++; }\n    if (a == b) return true;\n    for (int i = s1.size(); i < (int)s2.size(); i++) {\n        b[s2[i]-'a']++; b[s2[i-s1.size()]-'a']--;\n        if (a == b) return true;\n    }\n    return false;\n}"
        }
      ],
      "description": "Given two strings `s1` and `s2`, return `true` if `s2` contains a permutation of `s1`, or `false` otherwise.\n\nIn other words, return `true` if one of `s1`'s permutations is the substring of `s2`.\n\n \n\nExample 1:\n\nInput: s1 = \"ab\", s2 = \"eidbaooo\"\nOutput: true\nExplanation: s2 contains one permutation of s1 (\"ba\").\n\nExample 2:\n\nInput: s1 = \"ab\", s2 = \"eidboaoo\"\nOutput: false\n\n \n\nConstraints:\n\n\t• `1 4`\n• `s1` and `s2` consist of lowercase English letters.",
      "descriptionHtml": "<p>Given two strings <code>s1</code> and <code>s2</code>, return <code>true</code> if <code>s2</code> contains a <span data-keyword=\"permutation-string\">permutation</span> of <code>s1</code>, or <code>false</code> otherwise.</p>\n\n<p>In other words, return <code>true</code> if one of <code>s1</code>&#39;s permutations is the substring of <code>s2</code>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> s1 = &quot;ab&quot;, s2 = &quot;eidbaooo&quot;\n<strong>Output:</strong> true\n<strong>Explanation:</strong> s2 contains one permutation of s1 (&quot;ba&quot;).\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> s1 = &quot;ab&quot;, s2 = &quot;eidboaoo&quot;\n<strong>Output:</strong> false\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= s1.length, s2.length &lt;= 10<sup>4</sup></code></li>\n\t<li><code>s1</code> and <code>s2</code> consist of lowercase English letters.</li>\n</ul>\n",
      "lcSlug": "permutation-in-string",
      "summary": "Fixed/window size — compare 26-count arrays or sliding counts."
    },
    {
      "id": "tp-14",
      "title": "Find All Anagrams in String",
      "lc": 438,
      "importance": "should",
      "subtopic": "fixed-window",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "s, p",
          "out": "indices"
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
      "id": "tp-15",
      "title": "Max Consecutive Ones III",
      "lc": 1004,
      "importance": "must",
      "subtopic": "variable-window",
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
          "name": "Sliding window",
          "time": "O(n)",
          "space": "O(1)",
          "code": "int longestOnes(vector<int>& nums, int k) {\n    int l=0, zeros=0, ans=0;\n    for (int r=0; r<(int)nums.size(); r++) {\n        if (!nums[r]) zeros++;\n        while (zeros > k) { if (!nums[l]) zeros--; l++; }\n        ans = max(ans, r-l+1);\n    } return ans;\n}"
        }
      ],
      "description": "Given a binary array `nums` and an integer `k`, return the maximum number of consecutive `1`'s in the array if you can flip at most `k` `0`'s.\n\n \n\nExample 1:\n\nInput: nums = [1,1,1,0,0,0,1,1,1,1,0], k = 2\nOutput: 6\nExplanation: [1,1,1,0,0,1,1,1,1,1,1]\nBolded numbers were flipped from 0 to 1. The longest subarray is underlined.\n\nExample 2:\n\nInput: nums = [0,0,1,1,0,0,1,1,1,0,1,1,0,0,0,1,1,1,1], k = 3\nOutput: 10\nExplanation: [0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1]\nBolded numbers were flipped from 0 to 1. The longest subarray is underlined.\n\n \n\nConstraints:\n\n\t• `1 5`\n• `nums[i]` is either `0` or `1`.\n• `0",
      "descriptionHtml": "<p>Given a binary array <code>nums</code> and an integer <code>k</code>, return <em>the maximum number of consecutive </em><code>1</code><em>&#39;s in the array if you can flip at most</em> <code>k</code> <code>0</code>&#39;s.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [1,1,1,0,0,0,1,1,1,1,0], k = 2\n<strong>Output:</strong> 6\n<strong>Explanation:</strong> [1,1,1,0,0,<u><strong>1</strong>,1,1,1,1,<strong>1</strong></u>]\nBolded numbers were flipped from 0 to 1. The longest subarray is underlined.</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [0,0,1,1,0,0,1,1,1,0,1,1,0,0,0,1,1,1,1], k = 3\n<strong>Output:</strong> 10\n<strong>Explanation:</strong> [0,0,<u>1,1,<strong>1</strong>,<strong>1</strong>,1,1,1,<strong>1</strong>,1,1</u>,0,0,0,1,1,1,1]\nBolded numbers were flipped from 0 to 1. The longest subarray is underlined.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= nums.length &lt;= 10<sup>5</sup></code></li>\n\t<li><code>nums[i]</code> is either <code>0</code> or <code>1</code>.</li>\n\t<li><code>0 &lt;= k &lt;= nums.length</code></li>\n</ul>\n",
      "lcSlug": "max-consecutive-ones-iii",
      "summary": "Expand right; while invalid, shrink left — track best window length/sum."
    },
    {
      "id": "tp-16",
      "title": "Subarrays with K Different Integers",
      "lc": 992,
      "importance": "should",
      "subtopic": "variable-window",
      "difficulty": "Hard",
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
          "name": "atMost trick",
          "time": "O(n)",
          "space": "O(k)",
          "code": "int subarraysWithKDistinct(vector<int>& nums, int k) {\n    auto atMost = [&](int x) {\n        unordered_map<int,int> cnt; int l = 0, ans = 0;\n        for (int r = 0; r < (int)nums.size(); r++) {\n            cnt[nums[r]]++;\n            while ((int)cnt.size() > x) { if (--cnt[nums[l]] == 0) cnt.erase(nums[l]); l++; }\n            ans += r - l + 1;\n        }\n        return ans;\n    };\n    return atMost(k) - atMost(k-1);\n}"
        }
      ],
      "description": "Given an integer array `nums` and an integer `k`, return the number of good subarrays of `nums`.\n\nA good array is an array where the number of different integers in that array is exactly `k`.\n\n\t• For example, `[1,2,3,1,2]` has `3` different integers: `1`, `2`, and `3`.\n\nA subarray is a contiguous part of an array.\n\n \n\nExample 1:\n\nInput: nums = [1,2,1,2,3], k = 2\nOutput: 7\nExplanation: Subarrays formed with exactly 2 different integers: [1,2], [2,1], [1,2], [2,3], [1,2,1], [2,1,2], [1,2,1,2]\n\nExample 2:\n\nInput: nums = [1,2,1,3,4], k = 3\nOutput: 3\nExplanation: Subarrays formed with exactly 3 different integers: [1,2,1,3], [2,1,3], [1,3,4].\n\n \n\nConstraints:\n\n\t• `1 4`\n• `1",
      "descriptionHtml": "<p>Given an integer array <code>nums</code> and an integer <code>k</code>, return <em>the number of <strong>good subarrays</strong> of </em><code>nums</code>.</p>\n\n<p>A <strong>good array</strong> is an array where the number of different integers in that array is exactly <code>k</code>.</p>\n\n<ul>\n\t<li>For example, <code>[1,2,3,1,2]</code> has <code>3</code> different integers: <code>1</code>, <code>2</code>, and <code>3</code>.</li>\n</ul>\n\n<p>A <strong>subarray</strong> is a <strong>contiguous</strong> part of an array.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [1,2,1,2,3], k = 2\n<strong>Output:</strong> 7\n<strong>Explanation:</strong> Subarrays formed with exactly 2 different integers: [1,2], [2,1], [1,2], [2,3], [1,2,1], [2,1,2], [1,2,1,2]\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [1,2,1,3,4], k = 3\n<strong>Output:</strong> 3\n<strong>Explanation:</strong> Subarrays formed with exactly 3 different integers: [1,2,1,3], [2,1,3], [1,3,4].\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= nums.length &lt;= 2 * 10<sup>4</sup></code></li>\n\t<li><code>1 &lt;= nums[i], k &lt;= nums.length</code></li>\n</ul>\n",
      "lcSlug": "subarrays-with-k-different-integers",
      "summary": "Count subarrays with ≤K distinct = atMost(K) - atMost(K-1)."
    },
    {
      "id": "tp-17",
      "title": "Minimum Size Subarray Sum",
      "lc": 209,
      "importance": "must",
      "subtopic": "variable-window",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums, target",
          "out": "min len"
        }
      ],
      "approaches": [
        {
          "name": "Sliding window",
          "time": "O(n)",
          "space": "O(1)",
          "code": "int minSubArrayLen(int target, vector<int>& nums) {\n    int l=0, sum=0, ans=INT_MAX;\n    for (int r=0; r<(int)nums.size(); r++) {\n        sum += nums[r];\n        while (sum >= target) { ans=min(ans,r-l+1); sum -= nums[l++]; }\n    } return ans==INT_MAX?0:ans;\n}"
        }
      ],
      "description": "Given an array of positive integers `nums` and a positive integer `target`, return the minimal length of a subarray whose sum is greater than or equal to `target`. If there is no such subarray, return `0` instead.\n\n \n\nExample 1:\n\nInput: target = 7, nums = [2,3,1,2,4,3]\nOutput: 2\nExplanation: The subarray [4,3] has the minimal length under the problem constraint.\n\nExample 2:\n\nInput: target = 4, nums = [1,4,4]\nOutput: 1\n\nExample 3:\n\nInput: target = 11, nums = [1,1,1,1,1,1,1,1]\nOutput: 0\n\n \n\nConstraints:\n\n\t• `1 9`\n• `1 5`\n• `1 4`\n\n \nFollow up: If you have figured out the `O(n)` solution, try coding another solution of which the time complexity is `O(n log(n))`.",
      "descriptionHtml": "<p>Given an array of positive integers <code>nums</code> and a positive integer <code>target</code>, return <em>the <strong>minimal length</strong> of a </em><span data-keyword=\"subarray-nonempty\"><em>subarray</em></span><em> whose sum is greater than or equal to</em> <code>target</code>. If there is no such subarray, return <code>0</code> instead.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> target = 7, nums = [2,3,1,2,4,3]\n<strong>Output:</strong> 2\n<strong>Explanation:</strong> The subarray [4,3] has the minimal length under the problem constraint.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> target = 4, nums = [1,4,4]\n<strong>Output:</strong> 1\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> target = 11, nums = [1,1,1,1,1,1,1,1]\n<strong>Output:</strong> 0\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= target &lt;= 10<sup>9</sup></code></li>\n\t<li><code>1 &lt;= nums.length &lt;= 10<sup>5</sup></code></li>\n\t<li><code>1 &lt;= nums[i] &lt;= 10<sup>4</sup></code></li>\n</ul>\n\n<p>&nbsp;</p>\n<strong>Follow up:</strong> If you have figured out the <code>O(n)</code> solution, try coding another solution of which the time complexity is <code>O(n log(n))</code>.",
      "lcSlug": "minimum-size-subarray-sum",
      "summary": "Expand right; while invalid, shrink left — track best window length/sum."
    },
    {
      "id": "tp-18",
      "title": "Maximum Average Subarray I",
      "lc": 643,
      "importance": "should",
      "subtopic": "fixed-window",
      "difficulty": "Easy",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums, k",
          "out": "max avg"
        }
      ],
      "approaches": [
        {
          "name": "Fixed window",
          "time": "O(n)",
          "space": "O(1)",
          "code": "double findMaxAverage(vector<int>& nums, int k) {\n    int sum = 0;\n    for (int i = 0; i < k; i++) sum += nums[i];\n    int best = sum;\n    for (int i = k; i < (int)nums.size(); i++) { sum += nums[i] - nums[i-k]; best = max(best, sum); }\n    return (double)best / k;\n}"
        }
      ],
      "description": "You are given an integer array `nums` consisting of `n` elements, and an integer `k`.\n\nFind a contiguous subarray whose length is equal to `k` that has the maximum average value and return this value. Any answer with a calculation error less than `10-5` will be accepted.\n\n \n\nExample 1:\n\nInput: nums = [1,12,-5,-6,50,3], k = 4\nOutput: 12.75000\nExplanation: Maximum average is (12 - 5 - 6 + 50) / 4 = 51 / 4 = 12.75\n\nExample 2:\n\nInput: nums = [5], k = 1\nOutput: 5.00000\n\n \n\nConstraints:\n\n\t• `n == nums.length`\n• `1 5`\n• `-104 4`",
      "descriptionHtml": "<p>You are given an integer array <code>nums</code> consisting of <code>n</code> elements, and an integer <code>k</code>.</p>\n\n<p>Find a contiguous subarray whose <strong>length is equal to</strong> <code>k</code> that has the maximum average value and return <em>this value</em>. Any answer with a calculation error less than <code>10<sup>-5</sup></code> will be accepted.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [1,12,-5,-6,50,3], k = 4\n<strong>Output:</strong> 12.75000\n<strong>Explanation:</strong> Maximum average is (12 - 5 - 6 + 50) / 4 = 51 / 4 = 12.75\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [5], k = 1\n<strong>Output:</strong> 5.00000\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>n == nums.length</code></li>\n\t<li><code>1 &lt;= k &lt;= n &lt;= 10<sup>5</sup></code></li>\n\t<li><code>-10<sup>4</sup> &lt;= nums[i] &lt;= 10<sup>4</sup></code></li>\n</ul>\n",
      "lcSlug": "maximum-average-subarray-i",
      "summary": "Sum first k; slide: add nums[r], subtract nums[l]."
    },
    {
      "id": "tp-19",
      "title": "Fruit Into Baskets",
      "lc": 904,
      "importance": "should",
      "subtopic": "variable-window",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "fruits",
          "out": "max types"
        }
      ],
      "approaches": [
        {
          "name": "Sliding window",
          "time": "O(n)",
          "space": "O(1)",
          "code": "int totalFruit(vector<int>& fruits) {\n    unordered_map<int,int> cnt; int l = 0, ans = 0;\n    for (int r = 0; r < (int)fruits.size(); r++) {\n        cnt[fruits[r]]++;\n        while ((int)cnt.size() > 2) { cnt[fruits[l]]--; if (!cnt[fruits[l]]) cnt.erase(fruits[l]); l++; }\n        ans = max(ans, r - l + 1);\n    }\n    return ans;\n}"
        }
      ],
      "description": "You are visiting a farm that has a single row of fruit trees arranged from left to right. The trees are represented by an integer array `fruits` where `fruits[i]` is the type of fruit the `ith` tree produces.\n\nYou want to collect as much fruit as possible. However, the owner has some strict rules that you must follow:\n\n\t• You only have two baskets, and each basket can only hold a single type of fruit. There is no limit on the amount of fruit each basket can hold.\n• Starting from any tree of your choice, you must pick exactly one fruit from every tree (including the start tree) while moving to the right. The picked fruits must fit in one of your baskets.\n• Once you reach a tree with fruit that cannot fit in your baskets, you must stop.\n\nGiven the integer array `fruits`, return the maximum number of fruits you can pick.\n\n \n\nExample 1:\n\nInput: fruits = [1,2,1]\nOutput: 3\nExplanation: We can pick from all 3 trees.\n\nExample 2:\n\nInput: fruits = [0,1,2,2]\nOutput: 3\nExplanation: We can pick from trees [1,2,2].\nIf we had started at the first tree, we would only pick from trees [0,1].\n\nExample 3:\n\nInput: fruits = [1,2,3,2,2]\nOutput: 4\nExplanation: We can pick from trees [2,3,2,2].\nIf we had started at the first tree, we would only pick from trees [1,2].\n\n \n\nConstraints:\n\n\t• `1 5`\n• `0",
      "descriptionHtml": "<p>You are visiting a farm that has a single row of fruit trees arranged from left to right. The trees are represented by an integer array <code>fruits</code> where <code>fruits[i]</code> is the <strong>type</strong> of fruit the <code>i<sup>th</sup></code> tree produces.</p>\n\n<p>You want to collect as much fruit as possible. However, the owner has some strict rules that you must follow:</p>\n\n<ul>\n\t<li>You only have <strong>two</strong> baskets, and each basket can only hold a <strong>single type</strong> of fruit. There is no limit on the amount of fruit each basket can hold.</li>\n\t<li>Starting from any tree of your choice, you must pick <strong>exactly one fruit</strong> from <strong>every</strong> tree (including the start tree) while moving to the right. The picked fruits must fit in one of your baskets.</li>\n\t<li>Once you reach a tree with fruit that cannot fit in your baskets, you must stop.</li>\n</ul>\n\n<p>Given the integer array <code>fruits</code>, return <em>the <strong>maximum</strong> number of fruits you can pick</em>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> fruits = [<u>1,2,1</u>]\n<strong>Output:</strong> 3\n<strong>Explanation:</strong> We can pick from all 3 trees.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> fruits = [0,<u>1,2,2</u>]\n<strong>Output:</strong> 3\n<strong>Explanation:</strong> We can pick from trees [1,2,2].\nIf we had started at the first tree, we would only pick from trees [0,1].\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> fruits = [1,<u>2,3,2,2</u>]\n<strong>Output:</strong> 4\n<strong>Explanation:</strong> We can pick from trees [2,3,2,2].\nIf we had started at the first tree, we would only pick from trees [1,2].\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= fruits.length &lt;= 10<sup>5</sup></code></li>\n\t<li><code>0 &lt;= fruits[i] &lt; fruits.length</code></li>\n</ul>\n",
      "lcSlug": "fruit-into-baskets",
      "summary": "Expand right; while invalid, shrink left — track best window length/sum."
    },
    {
      "id": "tp-20",
      "title": "3Sum Closest",
      "lc": 16,
      "importance": "should",
      "subtopic": "opposite",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums, target",
          "out": "closest sum"
        }
      ],
      "approaches": [
        {
          "name": "Sort + two pointers",
          "time": "O(n^2)",
          "space": "O(1)",
          "code": "int threeSumClosest(vector<int>& nums, int target) {\n    sort(nums.begin(), nums.end());\n    int ans = nums[0] + nums[1] + nums[2];\n    for (int i = 0; i < (int)nums.size(); i++) {\n        int l = i + 1, r = (int)nums.size() - 1;\n        while (l < r) {\n            int s = nums[i] + nums[l] + nums[r];\n            if (abs(s - target) < abs(ans - target)) ans = s;\n            if (s < target) l++; else r--;\n        }\n    }\n    return ans;\n}"
        }
      ],
      "description": "Given an integer array `nums` of length `n` and an integer `target`, find three integers at distinct indices in `nums` such that the sum is closest to `target`.\n\nReturn the sum of the three integers.\n\nYou may assume that each input would have exactly one solution.\n\n \n\nExample 1:\n\nInput: nums = [-1,2,1,-4], target = 1\nOutput: 2\nExplanation: The sum that is closest to the target is 2. (-1 + 2 + 1 = 2).\n\nExample 2:\n\nInput: nums = [0,0,0], target = 1\nOutput: 0\nExplanation: The sum that is closest to the target is 0. (0 + 0 + 0 = 0).\n\n \n\nConstraints:\n\n\t• `3 4 4`",
      "descriptionHtml": "<p>Given an integer array <code>nums</code> of length <code>n</code> and an integer <code>target</code>, find three integers at <strong>distinct indices</strong> in <code>nums</code> such that the sum is closest to <code>target</code>.</p>\n\n<p>Return <em>the sum of the three integers</em>.</p>\n\n<p>You may assume that each input would have exactly one solution.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [-1,2,1,-4], target = 1\n<strong>Output:</strong> 2\n<strong>Explanation:</strong> The sum that is closest to the target is 2. (-1 + 2 + 1 = 2).\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [0,0,0], target = 1\n<strong>Output:</strong> 0\n<strong>Explanation:</strong> The sum that is closest to the target is 0. (0 + 0 + 0 = 0).\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>3 &lt;= nums.length &lt;= 500</code></li>\n\t<li><code>-1000 &lt;= nums[i] &lt;= 1000</code></li>\n\t<li><code>-10<sup>4</sup> &lt;= target &lt;= 10<sup>4</sup></code></li>\n</ul>\n",
      "lcSlug": "3sum-closest",
      "summary": "Sort first; l/r or fixed i + two pointers on rest."
    },
    {
      "id": "tp-21",
      "title": "4Sum",
      "lc": 18,
      "importance": "nice",
      "subtopic": "opposite",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums, target",
          "out": "quadruplets"
        }
      ],
      "approaches": [
        {
          "name": "Sort + two pointers",
          "time": "O(n^3)",
          "space": "O(1)",
          "code": "vector<vector<int>> fourSum(vector<int>& nums, int target) {\n    sort(nums.begin(), nums.end()); vector<vector<int>> ans; int n=nums.size();\n    for(int i=0;i<n;i++){\n        if(i && nums[i]==nums[i-1]) continue;\n        for(int j=i+1;j<n;j++){\n            if(j>i+1 && nums[j]==nums[j-1]) continue;\n            long long t=(long long)target-nums[i]-nums[j];\n            int l=j+1, r=n-1;\n            while(l<r){\n                long long s=nums[l]+nums[r];\n                if(s==t){ ans.push_back({nums[i],nums[j],nums[l],nums[r]}); while(l<r&&nums[l]==nums[l+1]) l++; while(l<r&&nums[r]==nums[r-1]) r--; l++; r--; }\n                else if(s<t) l++; else r--;\n            }\n        }\n    } return ans;\n}"
        }
      ],
      "description": "Given an array `nums` of `n` integers, return an array of all the unique quadruplets `[nums[a], nums[b], nums[c], nums[d]]` such that:\n\n\t• `0 \n\nYou may return the answer in any order.\n\n \n\nExample 1:\n\nInput: nums = [1,0,-1,0,-2,2], target = 0\nOutput: [[-2,-1,1,2],[-2,0,0,2],[-1,0,0,1]]\n\nExample 2:\n\nInput: nums = [2,2,2,2,2], target = 8\nOutput: [[2,2,2,2]]\n\n \n\nConstraints:\n\n\t• `1 9 9`\n• `-109 9`",
      "descriptionHtml": "<p>Given an array <code>nums</code> of <code>n</code> integers, return <em>an array of all the <strong>unique</strong> quadruplets</em> <code>[nums[a], nums[b], nums[c], nums[d]]</code> such that:</p>\n\n<ul>\n\t<li><code>0 &lt;= a, b, c, d&nbsp;&lt; n</code></li>\n\t<li><code>a</code>, <code>b</code>, <code>c</code>, and <code>d</code> are <strong>distinct</strong>.</li>\n\t<li><code>nums[a] + nums[b] + nums[c] + nums[d] == target</code></li>\n</ul>\n\n<p>You may return the answer in <strong>any order</strong>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [1,0,-1,0,-2,2], target = 0\n<strong>Output:</strong> [[-2,-1,1,2],[-2,0,0,2],[-1,0,0,1]]\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [2,2,2,2,2], target = 8\n<strong>Output:</strong> [[2,2,2,2]]\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= nums.length &lt;= 200</code></li>\n\t<li><code>-10<sup>9</sup> &lt;= nums[i] &lt;= 10<sup>9</sup></code></li>\n\t<li><code>-10<sup>9</sup> &lt;= target &lt;= 10<sup>9</sup></code></li>\n</ul>\n",
      "lcSlug": "4sum",
      "summary": "Sort first; l/r or fixed i + two pointers on rest."
    },
    {
      "id": "tp-22",
      "title": "Boats to Save People",
      "lc": 881,
      "importance": "should",
      "subtopic": "opposite",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "people, limit",
          "out": "boats"
        }
      ],
      "approaches": [
        {
          "name": "Two pointers",
          "time": "O(n log n)",
          "space": "O(1)",
          "code": "int numRescueBoats(vector<int>& people, int limit) {\n    sort(people.begin(), people.end());\n    int l = 0, r = (int)people.size()-1, ans = 0;\n    while (l <= r) {\n        ans++;\n        if (people[l] + people[r] <= limit) l++;\n        r--;\n    }\n    return ans;\n}"
        }
      ],
      "description": "You are given an array `people` where `people[i]` is the weight of the `ith` person, and an infinite number of boats where each boat can carry a maximum weight of `limit`. Each boat carries at most two people at the same time, provided the sum of the weight of those people is at most `limit`.\n\nReturn the minimum number of boats to carry every given person.\n\n \n\nExample 1:\n\nInput: people = [1,2], limit = 3\nOutput: 1\nExplanation: 1 boat (1, 2)\n\nExample 2:\n\nInput: people = [3,2,2,1], limit = 3\nOutput: 3\nExplanation: 3 boats (1, 2), (2) and (3)\n\nExample 3:\n\nInput: people = [3,5,3,4], limit = 5\nOutput: 4\nExplanation: 4 boats (3), (3), (4), (5)\n\n \n\nConstraints:\n\n\t• `1 4`\n• `1 4`",
      "descriptionHtml": "<p>You are given an array <code>people</code> where <code>people[i]</code> is the weight of the <code>i<sup>th</sup></code> person, and an <strong>infinite number of boats</strong> where each boat can carry a maximum weight of <code>limit</code>. Each boat carries at most two people at the same time, provided the sum of the weight of those people is at most <code>limit</code>.</p>\n\n<p>Return <em>the minimum number of boats to carry every given person</em>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> people = [1,2], limit = 3\n<strong>Output:</strong> 1\n<strong>Explanation:</strong> 1 boat (1, 2)\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> people = [3,2,2,1], limit = 3\n<strong>Output:</strong> 3\n<strong>Explanation:</strong> 3 boats (1, 2), (2) and (3)\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> people = [3,5,3,4], limit = 5\n<strong>Output:</strong> 4\n<strong>Explanation:</strong> 4 boats (3), (3), (4), (5)\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= people.length &lt;= 5 * 10<sup>4</sup></code></li>\n\t<li><code>1 &lt;= people[i] &lt;= limit &lt;= 3 * 10<sup>4</sup></code></li>\n</ul>\n",
      "lcSlug": "boats-to-save-people",
      "summary": "Opposite ends or same direction — move based on comparison/invariant."
    },
    {
      "id": "tp-23",
      "title": "Squares of a Sorted Array",
      "lc": 977,
      "importance": "nice",
      "subtopic": "opposite",
      "difficulty": "Easy",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums",
          "out": "sorted squares"
        }
      ],
      "approaches": [
        {
          "name": "Two pointers merge",
          "time": "O(n)",
          "space": "O(n)",
          "code": "vector<int> sortedSquares(vector<int>& nums) {\n    int n=nums.size(); vector<int> ans(n);\n    int l=0, r=n-1, k=n-1;\n    while(l<=r){ int a=nums[l]*nums[l], b=nums[r]*nums[r]; if(a>b){ ans[k--]=a; l++; } else { ans[k--]=b; r--; } }\n    return ans;\n}"
        }
      ],
      "description": "Given an integer array `nums` sorted in non-decreasing order, return an array of the squares of each number sorted in non-decreasing order.\n\n \n\nExample 1:\n\nInput: nums = [-4,-1,0,3,10]\nOutput: [0,1,9,16,100]\nExplanation: After squaring, the array becomes [16,1,0,9,100].\nAfter sorting, it becomes [0,1,9,16,100].\n\nExample 2:\n\nInput: nums = [-7,-3,2,3,11]\nOutput: [4,9,9,49,121]\n\n \n\nConstraints:\n\n\t• `1 104`\n• `-104 4`\n• `nums` is sorted in non-decreasing order.\n\n \nFollow up: Squaring each element and sorting the new array is very trivial, could you find an `O(n)` solution using a different approach?",
      "descriptionHtml": "<p>Given an integer array <code>nums</code> sorted in <strong>non-decreasing</strong> order, return <em>an array of <strong>the squares of each number</strong> sorted in non-decreasing order</em>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [-4,-1,0,3,10]\n<strong>Output:</strong> [0,1,9,16,100]\n<strong>Explanation:</strong> After squaring, the array becomes [16,1,0,9,100].\nAfter sorting, it becomes [0,1,9,16,100].\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [-7,-3,2,3,11]\n<strong>Output:</strong> [4,9,9,49,121]\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code><span>1 &lt;= nums.length &lt;= </span>10<sup>4</sup></code></li>\n\t<li><code>-10<sup>4</sup> &lt;= nums[i] &lt;= 10<sup>4</sup></code></li>\n\t<li><code>nums</code> is sorted in <strong>non-decreasing</strong> order.</li>\n</ul>\n\n<p>&nbsp;</p>\n<strong>Follow up:</strong> Squaring each element and sorting the new array is very trivial, could you find an <code>O(n)</code> solution using a different approach?",
      "lcSlug": "squares-of-a-sorted-array",
      "summary": "Merge two sorted sequences by comparing fronts."
    },
    {
      "id": "tp-24",
      "title": "Reverse String",
      "lc": 344,
      "importance": "nice",
      "subtopic": "opposite",
      "difficulty": "Easy",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "s",
          "out": "reversed"
        }
      ],
      "approaches": [
        {
          "name": "Reverse inplace",
          "time": "O(n)",
          "space": "O(1)",
          "code": "void reverseString(vector<char>& s) {\n    for(int l=0,r=(int)s.size()-1;l<r;l++,r--) swap(s[l],s[r]);\n}"
        }
      ],
      "description": "Write a function that reverses a string. The input string is given as an array of characters `s`.\n\nYou must do this by modifying the input array in-place with `O(1)` extra memory.\n\n \n\nExample 1:\n\nInput: s = [\"h\",\"e\",\"l\",\"l\",\"o\"]\nOutput: [\"o\",\"l\",\"l\",\"e\",\"h\"]\n\nExample 2:\n\nInput: s = [\"H\",\"a\",\"n\",\"n\",\"a\",\"h\"]\nOutput: [\"h\",\"a\",\"n\",\"n\",\"a\",\"H\"]\n\n \n\nConstraints:\n\n\t• `1 5`\n• `s[i]` is a printable ascii character.",
      "descriptionHtml": "<p>Write a function that reverses a string. The input string is given as an array of characters <code>s</code>.</p>\n\n<p>You must do this by modifying the input array <a href=\"https://en.wikipedia.org/wiki/In-place_algorithm\" target=\"_blank\">in-place</a> with <code>O(1)</code> extra memory.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<pre><strong>Input:</strong> s = [\"h\",\"e\",\"l\",\"l\",\"o\"]\n<strong>Output:</strong> [\"o\",\"l\",\"l\",\"e\",\"h\"]\n</pre><p><strong class=\"example\">Example 2:</strong></p>\n<pre><strong>Input:</strong> s = [\"H\",\"a\",\"n\",\"n\",\"a\",\"h\"]\n<strong>Output:</strong> [\"h\",\"a\",\"n\",\"n\",\"a\",\"H\"]\n</pre>\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= s.length &lt;= 10<sup>5</sup></code></li>\n\t<li><code>s[i]</code> is a <a href=\"https://en.wikipedia.org/wiki/ASCII#Printable_characters\" target=\"_blank\">printable ascii character</a>.</li>\n</ul>\n",
      "lcSlug": "reverse-string",
      "summary": "Reverse inplace — Two pointers from both ends moving inward based on sum/compare."
    },
    {
      "id": "tp-25",
      "title": "Is Subsequence",
      "lc": 392,
      "importance": "should",
      "subtopic": "same-dir",
      "difficulty": "Easy",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "s, t",
          "out": "true/false"
        }
      ],
      "approaches": [
        {
          "name": "Two pointers",
          "time": "O(n)",
          "space": "O(1)",
          "code": "bool isSubsequence(string s, string t) {\n    int i = 0;\n    for (char ch : t) if (i < (int)s.size() && s[i] == ch) i++;\n    return i == (int)s.size();\n}"
        }
      ],
      "description": "Given two strings `s` and `t`, return `true` if `s` is a subsequence of `t`, or `false` otherwise.\n\nA subsequence of a string is a new string that is formed from the original string by deleting some (can be none) of the characters without disturbing the relative positions of the remaining characters. (i.e., `\"ace\"` is a subsequence of `\"abcde\"` while `\"aec\"` is not).\n\n \n\nExample 1:\n\nInput: s = \"abc\", t = \"ahbgdc\"\nOutput: true\n\nExample 2:\n\nInput: s = \"axc\", t = \"ahbgdc\"\nOutput: false\n\n \n\nConstraints:\n\n\t• `0 4`\n• `s` and `t` consist only of lowercase English letters.\n\n \nFollow up: Suppose there are lots of incoming `s`, say `s1, s2, ..., sk` where `k >= 109`, and you want to check one by one to see if `t` has its subsequence. In this scenario, how would you change your code?",
      "descriptionHtml": "<p>Given two strings <code>s</code> and <code>t</code>, return <code>true</code><em> if </em><code>s</code><em> is a <strong>subsequence</strong> of </em><code>t</code><em>, or </em><code>false</code><em> otherwise</em>.</p>\n\n<p>A <strong>subsequence</strong> of a string is a new string that is formed from the original string by deleting some (can be none) of the characters without disturbing the relative positions of the remaining characters. (i.e., <code>&quot;ace&quot;</code> is a subsequence of <code>&quot;<u>a</u>b<u>c</u>d<u>e</u>&quot;</code> while <code>&quot;aec&quot;</code> is not).</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<pre><strong>Input:</strong> s = \"abc\", t = \"ahbgdc\"\n<strong>Output:</strong> true\n</pre><p><strong class=\"example\">Example 2:</strong></p>\n<pre><strong>Input:</strong> s = \"axc\", t = \"ahbgdc\"\n<strong>Output:</strong> false\n</pre>\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>0 &lt;= s.length &lt;= 100</code></li>\n\t<li><code>0 &lt;= t.length &lt;= 10<sup>4</sup></code></li>\n\t<li><code>s</code> and <code>t</code> consist only of lowercase English letters.</li>\n</ul>\n\n<p>&nbsp;</p>\n<strong>Follow up:</strong> Suppose there are lots of incoming <code>s</code>, say <code>s<sub>1</sub>, s<sub>2</sub>, ..., s<sub>k</sub></code> where <code>k &gt;= 10<sup>9</sup></code>, and you want to check one by one to see if <code>t</code> has its subsequence. In this scenario, how would you change your code?",
      "lcSlug": "is-subsequence",
      "summary": "Opposite ends or same direction — move based on comparison/invariant."
    },
    {
      "id": "tp-26",
      "title": "Merge Sorted Array",
      "lc": 88,
      "importance": "should",
      "subtopic": "opposite",
      "difficulty": "Easy",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums1, nums2",
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
      "id": "tp-27",
      "title": "Backspace String Compare",
      "lc": 844,
      "importance": "nice",
      "subtopic": "same-dir",
      "difficulty": "Easy",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "s, t",
          "out": "equal?"
        }
      ],
      "approaches": [
        {
          "name": "Two pointers backspace",
          "time": "O(n)",
          "space": "O(1)",
          "code": "bool backspaceCompare(string s, string t) {\n    int i=(int)s.size()-1, j=(int)t.size()-1, skipS=0, skipT=0;\n    while(i>=0||j>=0){\n        while(i>=0){ if(s[i]=='#'){ skipS++; i--; } else if(skipS){ skipS--; i--; } else break; }\n        while(j>=0){ if(t[j]=='#'){ skipT++; j--; } else if(skipT){ skipT--; j--; } else break; }\n        if(i>=0 && j>=0 && s[i]!=t[j]) return false;\n        if((i>=0)!=(j>=0)) return false;\n        i--; j--;\n    } return true;\n}"
        }
      ],
      "description": "Given two strings `s` and `t`, return `true` if they are equal when both are typed into empty text editors. `'#'` means a backspace character.\n\nNote that after backspacing an empty text, the text will continue empty.\n\n \n\nExample 1:\n\nInput: s = \"ab#c\", t = \"ad#c\"\nOutput: true\nExplanation: Both s and t become \"ac\".\n\nExample 2:\n\nInput: s = \"ab##\", t = \"c#d#\"\nOutput: true\nExplanation: Both s and t become \"\".\n\nExample 3:\n\nInput: s = \"a#c\", t = \"b\"\nOutput: false\nExplanation: s becomes \"c\" while t becomes \"b\".\n\n \n\nConstraints:\n\n\t• `1 `\n• `s` and `t` only contain lowercase letters and `'#'` characters.\n\n \n\nFollow up: Can you solve it in `O(n)` time and `O(1)` space?",
      "descriptionHtml": "<p>Given two strings <code>s</code> and <code>t</code>, return <code>true</code> <em>if they are equal when both are typed into empty text editors</em>. <code>&#39;#&#39;</code> means a backspace character.</p>\n\n<p>Note that after backspacing an empty text, the text will continue empty.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> s = &quot;ab#c&quot;, t = &quot;ad#c&quot;\n<strong>Output:</strong> true\n<strong>Explanation:</strong> Both s and t become &quot;ac&quot;.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> s = &quot;ab##&quot;, t = &quot;c#d#&quot;\n<strong>Output:</strong> true\n<strong>Explanation:</strong> Both s and t become &quot;&quot;.\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> s = &quot;a#c&quot;, t = &quot;b&quot;\n<strong>Output:</strong> false\n<strong>Explanation:</strong> s becomes &quot;c&quot; while t becomes &quot;b&quot;.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code><span>1 &lt;= s.length, t.length &lt;= 200</span></code></li>\n\t<li><span><code>s</code> and <code>t</code> only contain lowercase letters and <code>&#39;#&#39;</code> characters.</span></li>\n</ul>\n\n<p>&nbsp;</p>\n<p><strong>Follow up:</strong> Can you solve it in <code>O(n)</code> time and <code>O(1)</code> space?</p>\n",
      "lcSlug": "backspace-string-compare",
      "summary": "Two pointers backspace — state invariant, then loop."
    },
    {
      "id": "tp-28",
      "title": "Longest Mountain in Array",
      "lc": 845,
      "importance": "nice",
      "subtopic": "same-dir",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "arr",
          "out": "peak length"
        }
      ],
      "approaches": [
        {
          "name": "Scan peak extend",
          "time": "O(n)",
          "space": "O(1)",
          "code": "int longestMountain(vector<int>& arr) {\n    int n=arr.size(), ans=0;\n    for(int i=1;i+1<n;i++){\n        if(arr[i-1]<arr[i] && arr[i]>arr[i+1]){\n            int l=i-1, r=i+1;\n            while(l>0 && arr[l-1]<arr[l]) l--;\n            while(r+1<n && arr[r+1]<arr[r]) r++;\n            ans=max(ans, r-l+1);\n        }\n    } return ans;\n}"
        }
      ],
      "description": "You may recall that an array `arr` is a mountain array if and only if:\n\n\t• `arr.length >= 3`\n• There exists some index `i` (0-indexed) with `0 \n\t\t• `arr[0]  arr[i + 1] > ... > arr[arr.length - 1]`\n\n\t\n\nGiven an integer array `arr`, return the length of the longest subarray, which is a mountain. Return `0` if there is no mountain subarray.\n\n \n\nExample 1:\n\nInput: arr = [2,1,4,7,3,2,5]\nOutput: 5\nExplanation: The largest mountain is [1,4,7,3,2] which has length 5.\n\nExample 2:\n\nInput: arr = [2,2,2]\nOutput: 0\nExplanation: There is no mountain.\n\n \n\nConstraints:\n\n\t• `1 4`\n• `0 4`\n\n \n\nFollow up:\n\n\t• Can you solve it using only one pass?\n• Can you solve it in `O(1)` space?",
      "descriptionHtml": "<p>You may recall that an array <code>arr</code> is a <strong>mountain array</strong> if and only if:</p>\n\n<ul>\n\t<li><code>arr.length &gt;= 3</code></li>\n\t<li>There exists some index <code>i</code> (<strong>0-indexed</strong>) with <code>0 &lt; i &lt; arr.length - 1</code> such that:\n\t<ul>\n\t\t<li><code>arr[0] &lt; arr[1] &lt; ... &lt; arr[i - 1] &lt; arr[i]</code></li>\n\t\t<li><code>arr[i] &gt; arr[i + 1] &gt; ... &gt; arr[arr.length - 1]</code></li>\n\t</ul>\n\t</li>\n</ul>\n\n<p>Given an integer array <code>arr</code>, return <em>the length of the longest subarray, which is a mountain</em>. Return <code>0</code> if there is no mountain subarray.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> arr = [2,1,4,7,3,2,5]\n<strong>Output:</strong> 5\n<strong>Explanation:</strong> The largest mountain is [1,4,7,3,2] which has length 5.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> arr = [2,2,2]\n<strong>Output:</strong> 0\n<strong>Explanation:</strong> There is no mountain.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= arr.length &lt;= 10<sup>4</sup></code></li>\n\t<li><code>0 &lt;= arr[i] &lt;= 10<sup>4</sup></code></li>\n</ul>\n\n<p>&nbsp;</p>\n<p><strong>Follow up:</strong></p>\n\n<ul>\n\t<li>Can you solve it using only one pass?</li>\n\t<li>Can you solve it in <code>O(1)</code> space?</li>\n</ul>\n",
      "lcSlug": "longest-mountain-in-array",
      "summary": "Scan peak extend — state invariant, then loop."
    }
  ]
};
