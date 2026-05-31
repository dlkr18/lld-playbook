window.PRACTICE_TOPIC = {
  "id": "binary-search",
  "title": "Binary Search",
  "expected_count": 26,
  "strategy": "<strong>Speed-run:</strong> 90% are first-true on answer space — master the three templates. Filter <em>Must do</em> first.",
  "subtopics": [
    {
      "id": "exact",
      "label": "Exact"
    },
    {
      "id": "first-true",
      "label": "First True"
    },
    {
      "id": "last-true",
      "label": "Last True"
    },
    {
      "id": "rotated",
      "label": "Rotated"
    },
    {
      "id": "answer-space",
      "label": "Answer Space"
    },
    {
      "id": "2d",
      "label": "2D"
    }
  ],
  "questions": [
    {
      "id": "bs-01",
      "title": "Binary Search",
      "lc": 704,
      "importance": "must",
      "subtopic": "exact",
      "difficulty": "Easy",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums, target",
          "out": "index"
        }
      ],
      "approaches": [
        {
          "name": "Classic binary search",
          "time": "O(log n)",
          "space": "O(1)",
          "code": "int search(vector<int>& nums, int target) {\n    int lo = 0, hi = (int)nums.size()-1;\n    while (lo <= hi) {\n        int mid = lo + (hi-lo)/2;\n        if (nums[mid] == target) return mid;\n        if (nums[mid] < target) lo = mid+1; else hi = mid-1;\n    } return -1;\n}"
        }
      ],
      "description": "Given an array of integers `nums` which is sorted in ascending order, and an integer `target`, write a function to search `target` in `nums`. If `target` exists, then return its index. Otherwise, return `-1`.\n\nYou must write an algorithm with `O(log n)` runtime complexity.\n\n \n\nExample 1:\n\nInput: nums = [-1,0,3,5,9,12], target = 9\nOutput: 4\nExplanation: 9 exists in nums and its index is 4\n\nExample 2:\n\nInput: nums = [-1,0,3,5,9,12], target = 2\nOutput: -1\nExplanation: 2 does not exist in nums so return -1\n\n \n\nConstraints:\n\n\t• `1 4`\n• `-104 4`\n• All the integers in `nums` are unique.\n• `nums` is sorted in ascending order.",
      "descriptionHtml": "<p>Given an array of integers <code>nums</code> which is sorted in ascending order, and an integer <code>target</code>, write a function to search <code>target</code> in <code>nums</code>. If <code>target</code> exists, then return its index. Otherwise, return <code>-1</code>.</p>\n\n<p>You must write an algorithm with <code>O(log n)</code> runtime complexity.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [-1,0,3,5,9,12], target = 9\n<strong>Output:</strong> 4\n<strong>Explanation:</strong> 9 exists in nums and its index is 4\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [-1,0,3,5,9,12], target = 2\n<strong>Output:</strong> -1\n<strong>Explanation:</strong> 2 does not exist in nums so return -1\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= nums.length &lt;= 10<sup>4</sup></code></li>\n\t<li><code>-10<sup>4</sup> &lt; nums[i], target &lt; 10<sup>4</sup></code></li>\n\t<li>All the integers in <code>nums</code> are <strong>unique</strong>.</li>\n\t<li><code>nums</code> is sorted in ascending order.</li>\n</ul>\n",
      "lcSlug": "binary-search",
      "summary": "Classic binary search — state invariant, then loop."
    },
    {
      "id": "bs-02",
      "title": "Search Insert Position",
      "lc": 35,
      "importance": "must",
      "subtopic": "first-true",
      "difficulty": "Easy",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums, target",
          "out": "index"
        }
      ],
      "approaches": [
        {
          "name": "Lower bound",
          "time": "O(log n)",
          "space": "O(1)",
          "code": "int searchInsert(vector<int>& nums, int target) {\n    int lo=0, hi=(int)nums.size()-1;\n    while (lo <= hi) {\n        int mid = lo+(hi-lo)/2;\n        if (nums[mid] >= target) hi = mid-1; else lo = mid+1;\n    } return lo;\n}"
        }
      ],
      "description": "Given a sorted array of distinct integers and a target value, return the index if the target is found. If not, return the index where it would be if it were inserted in order.\n\nYou must write an algorithm with `O(log n)` runtime complexity.\n\n \n\nExample 1:\n\nInput: nums = [1,3,5,6], target = 5\nOutput: 2\n\nExample 2:\n\nInput: nums = [1,3,5,6], target = 2\nOutput: 1\n\nExample 3:\n\nInput: nums = [1,3,5,6], target = 7\nOutput: 4\n\n \n\nConstraints:\n\n\t• `1 4`\n• `-104 4`\n• `nums` contains distinct values sorted in ascending order.\n• `-104 4`",
      "descriptionHtml": "<p>Given a sorted array of distinct integers and a target value, return the index if the target is found. If not, return the index where it would be if it were inserted in order.</p>\n\n<p>You must&nbsp;write an algorithm with&nbsp;<code>O(log n)</code> runtime complexity.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [1,3,5,6], target = 5\n<strong>Output:</strong> 2\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [1,3,5,6], target = 2\n<strong>Output:</strong> 1\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [1,3,5,6], target = 7\n<strong>Output:</strong> 4\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= nums.length &lt;= 10<sup>4</sup></code></li>\n\t<li><code>-10<sup>4</sup> &lt;= nums[i] &lt;= 10<sup>4</sup></code></li>\n\t<li><code>nums</code> contains <strong>distinct</strong> values sorted in <strong>ascending</strong> order.</li>\n\t<li><code>-10<sup>4</sup> &lt;= target &lt;= 10<sup>4</sup></code></li>\n</ul>\n",
      "lcSlug": "search-insert-position",
      "summary": "Lower bound — state invariant, then loop."
    },
    {
      "id": "bs-03",
      "title": "Find First and Last Position",
      "lc": 34,
      "importance": "must",
      "subtopic": "first-true",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums, target",
          "out": "[l,r]"
        }
      ],
      "approaches": [
        {
          "name": "Two binary searches",
          "time": "O(log n)",
          "space": "O(1)",
          "code": "vector<int> searchRange(vector<int>& nums, int target) {\n    auto lb = [&](bool first){\n        int lo=0, hi=(int)nums.size()-1, ans=-1;\n        while (lo<=hi) {\n            int mid=lo+(hi-lo)/2;\n            if (nums[mid]==target) { ans=mid; if (first) hi=mid-1; else lo=mid+1; }\n            else if (nums[mid]<target) lo=mid+1; else hi=mid-1;\n        } return ans;\n    };\n    return {lb(true), lb(false)};\n}"
        }
      ],
      "description": "Given an array of integers `nums` sorted in non-decreasing order, find the starting and ending position of a given `target` value.\n\nIf `target` is not found in the array, return `[-1, -1]`.\n\nYou must write an algorithm with `O(log n)` runtime complexity.\n\n \n\nExample 1:\n\nInput: nums = [5,7,7,8,8,10], target = 8\nOutput: [3,4]\n\nExample 2:\n\nInput: nums = [5,7,7,8,8,10], target = 6\nOutput: [-1,-1]\n\nExample 3:\n\nInput: nums = [], target = 0\nOutput: [-1,-1]\n\n \n\nConstraints:\n\n\t• `0 5`\n• `-109 9`\n• `nums` is a non-decreasing array.\n• `-109 9`",
      "descriptionHtml": "<p>Given an array of integers <code>nums</code> sorted in non-decreasing order, find the starting and ending position of a given <code>target</code> value.</p>\n\n<p>If <code>target</code> is not found in the array, return <code>[-1, -1]</code>.</p>\n\n<p>You must&nbsp;write an algorithm with&nbsp;<code>O(log n)</code> runtime complexity.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<pre><strong>Input:</strong> nums = [5,7,7,8,8,10], target = 8\n<strong>Output:</strong> [3,4]\n</pre><p><strong class=\"example\">Example 2:</strong></p>\n<pre><strong>Input:</strong> nums = [5,7,7,8,8,10], target = 6\n<strong>Output:</strong> [-1,-1]\n</pre><p><strong class=\"example\">Example 3:</strong></p>\n<pre><strong>Input:</strong> nums = [], target = 0\n<strong>Output:</strong> [-1,-1]\n</pre>\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>0 &lt;= nums.length &lt;= 10<sup>5</sup></code></li>\n\t<li><code>-10<sup>9</sup>&nbsp;&lt;= nums[i]&nbsp;&lt;= 10<sup>9</sup></code></li>\n\t<li><code>nums</code> is a non-decreasing array.</li>\n\t<li><code>-10<sup>9</sup>&nbsp;&lt;= target&nbsp;&lt;= 10<sup>9</sup></code></li>\n</ul>\n",
      "lcSlug": "find-first-and-last-position-of-element-in-sorted-array",
      "summary": "Two binary searches — state invariant, then loop."
    },
    {
      "id": "bs-04",
      "title": "Search in Rotated Sorted Array",
      "lc": 33,
      "importance": "must",
      "subtopic": "rotated",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums, target",
          "out": "index"
        }
      ],
      "approaches": [
        {
          "name": "BS on rotated half",
          "time": "O(log n)",
          "space": "O(1)",
          "code": "int search(vector<int>& nums, int target) {\n    int lo = 0, hi = (int)nums.size()-1;\n    while (lo <= hi) {\n        int mid = lo + (hi-lo)/2;\n        if (nums[mid] == target) return mid;\n        if (nums[lo] <= nums[mid]) {\n            if (nums[lo] <= target && target < nums[mid]) hi = mid-1; else lo = mid+1;\n        } else {\n            if (nums[mid] < target && target <= nums[hi]) lo = mid+1; else hi = mid-1;\n        }\n    } return -1;\n}"
        }
      ],
      "description": "There is an integer array `nums` sorted in ascending order (with distinct values).\n\nPrior to being passed to your function, `nums` is possibly left rotated at an unknown index `k` (`1 Example 1:\n\nInput: nums = [4,5,6,7,0,1,2], target = 0\nOutput: 4\n\nExample 2:\n\nInput: nums = [4,5,6,7,0,1,2], target = 3\nOutput: -1\n\nExample 3:\n\nInput: nums = [1], target = 0\nOutput: -1\n\n \n\nConstraints:\n\n\t• `1 4 4`\n• All values of `nums` are unique.\n• `nums` is an ascending array that is possibly rotated.\n• `-104 4`",
      "descriptionHtml": "<p>There is an integer array <code>nums</code> sorted in ascending order (with <strong>distinct</strong> values).</p>\n\n<p>Prior to being passed to your function, <code>nums</code> is <strong>possibly left rotated</strong> at an unknown index <code>k</code> (<code>1 &lt;= k &lt; nums.length</code>) such that the resulting array is <code>[nums[k], nums[k+1], ..., nums[n-1], nums[0], nums[1], ..., nums[k-1]]</code> (<strong>0-indexed</strong>). For example, <code>[0,1,2,4,5,6,7]</code> might be left rotated by&nbsp;<code>3</code>&nbsp;indices and become <code>[4,5,6,7,0,1,2]</code>.</p>\n\n<p>Given the array <code>nums</code> <strong>after</strong> the possible rotation and an integer <code>target</code>, return <em>the index of </em><code>target</code><em> if it is in </em><code>nums</code><em>, or </em><code>-1</code><em> if it is not in </em><code>nums</code>.</p>\n\n<p>You must write an algorithm with <code>O(log n)</code> runtime complexity.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<pre><strong>Input:</strong> nums = [4,5,6,7,0,1,2], target = 0\n<strong>Output:</strong> 4\n</pre><p><strong class=\"example\">Example 2:</strong></p>\n<pre><strong>Input:</strong> nums = [4,5,6,7,0,1,2], target = 3\n<strong>Output:</strong> -1\n</pre><p><strong class=\"example\">Example 3:</strong></p>\n<pre><strong>Input:</strong> nums = [1], target = 0\n<strong>Output:</strong> -1\n</pre>\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= nums.length &lt;= 5000</code></li>\n\t<li><code>-10<sup>4</sup> &lt;= nums[i] &lt;= 10<sup>4</sup></code></li>\n\t<li>All values of <code>nums</code> are <strong>unique</strong>.</li>\n\t<li><code>nums</code> is an ascending array that is possibly rotated.</li>\n\t<li><code>-10<sup>4</sup> &lt;= target &lt;= 10<sup>4</sup></code></li>\n</ul>\n",
      "lcSlug": "search-in-rotated-sorted-array",
      "summary": "BS on rotated half — state invariant, then loop."
    },
    {
      "id": "bs-05",
      "title": "Find Minimum in Rotated Array",
      "lc": 153,
      "importance": "must",
      "subtopic": "rotated",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums",
          "out": "min"
        }
      ],
      "approaches": [
        {
          "name": "BS rotated min",
          "time": "O(log n)",
          "space": "O(1)",
          "code": "int findMin(vector<int>& nums) {\n    int lo=0, hi=(int)nums.size()-1;\n    while (lo < hi) {\n        int mid = lo+(hi-lo)/2;\n        if (nums[mid] > nums[hi]) lo = mid+1; else hi = mid;\n    } return nums[lo];\n}"
        }
      ],
      "description": "Suppose an array of length `n` sorted in ascending order is rotated between `1` and `n` times. For example, the array `nums = [0,1,2,4,5,6,7]` might become:\n\n\t• `[4,5,6,7,0,1,2]` if it was rotated `4` times.\n• `[0,1,2,4,5,6,7]` if it was rotated `7` times.\n\nNotice that rotating an array `[a[0], a[1], a[2], ..., a[n-1]]` 1 time results in the array `[a[n-1], a[0], a[1], a[2], ..., a[n-2]]`.\n\nGiven the sorted rotated array `nums` of unique elements, return the minimum element of this array.\n\nYou must write an algorithm that runs in `O(log n) time`.\n\n \n\nExample 1:\n\nInput: nums = [3,4,5,1,2]\nOutput: 1\nExplanation: The original array was [1,2,3,4,5] rotated 3 times.\n\nExample 2:\n\nInput: nums = [4,5,6,7,0,1,2]\nOutput: 0\nExplanation: The original array was [0,1,2,4,5,6,7] and it was rotated 4 times.\n\nExample 3:\n\nInput: nums = [11,13,15,17]\nOutput: 11\nExplanation: The original array was [11,13,15,17] and it was rotated 4 times. \n\n \n\nConstraints:\n\n\t• `n == nums.length`\n• `1",
      "descriptionHtml": "<p>Suppose an array of length <code>n</code> sorted in ascending order is <strong>rotated</strong> between <code>1</code> and <code>n</code> times. For example, the array <code>nums = [0,1,2,4,5,6,7]</code> might become:</p>\n\n<ul>\n\t<li><code>[4,5,6,7,0,1,2]</code> if it was rotated <code>4</code> times.</li>\n\t<li><code>[0,1,2,4,5,6,7]</code> if it was rotated <code>7</code> times.</li>\n</ul>\n\n<p>Notice that <strong>rotating</strong> an array <code>[a[0], a[1], a[2], ..., a[n-1]]</code> 1 time results in the array <code>[a[n-1], a[0], a[1], a[2], ..., a[n-2]]</code>.</p>\n\n<p>Given the sorted rotated array <code>nums</code> of <strong>unique</strong> elements, return <em>the minimum element of this array</em>.</p>\n\n<p>You must write an algorithm that runs in&nbsp;<code>O(log n) time</code>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [3,4,5,1,2]\n<strong>Output:</strong> 1\n<strong>Explanation:</strong> The original array was [1,2,3,4,5] rotated 3 times.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [4,5,6,7,0,1,2]\n<strong>Output:</strong> 0\n<strong>Explanation:</strong> The original array was [0,1,2,4,5,6,7] and it was rotated 4 times.\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [11,13,15,17]\n<strong>Output:</strong> 11\n<strong>Explanation:</strong> The original array was [11,13,15,17] and it was rotated 4 times. \n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>n == nums.length</code></li>\n\t<li><code>1 &lt;= n &lt;= 5000</code></li>\n\t<li><code>-5000 &lt;= nums[i] &lt;= 5000</code></li>\n\t<li>All the integers of <code>nums</code> are <strong>unique</strong>.</li>\n\t<li><code>nums</code> is sorted and rotated between <code>1</code> and <code>n</code> times.</li>\n</ul>\n",
      "lcSlug": "find-minimum-in-rotated-sorted-array",
      "summary": "BS rotated min — state invariant, then loop."
    },
    {
      "id": "bs-06",
      "title": "Koko Eating Bananas",
      "lc": 875,
      "importance": "must",
      "subtopic": "answer-space",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "piles, h",
          "out": "min speed"
        }
      ],
      "approaches": [
        {
          "name": "BS on answer",
          "time": "O(n log m)",
          "space": "O(1)",
          "code": "bool ok(int speed, vector<int>& piles, int h) {\n    long long t = 0;\n    for (int p : piles) t += (p + speed - 1) / speed;\n    return t <= h;\n}\nint minEatingSpeed(vector<int>& piles, int h) {\n    int lo = 1, hi = 1e9, ans = hi;\n    while (lo <= hi) {\n        int mid = lo + (hi-lo)/2;\n        if (ok(mid, piles, h)) { ans = mid; hi = mid-1; } else lo = mid+1;\n    } return ans;\n}"
        }
      ],
      "description": "Koko loves to eat bananas. There are `n` piles of bananas, the `ith` pile has `piles[i]` bananas. The guards have gone and will come back in `h` hours.\n\nKoko can decide her bananas-per-hour eating speed of `k`. Each hour, she chooses some pile of bananas and eats `k` bananas from that pile. If the pile has less than `k` bananas, she eats all of them instead and will not eat any more bananas during this hour.\n\nKoko likes to eat slowly but still wants to finish eating all the bananas before the guards return.\n\nReturn the minimum integer `k` such that she can eat all the bananas within `h` hours.\n\n \n\nExample 1:\n\nInput: piles = [3,6,7,11], h = 8\nOutput: 4\n\nExample 2:\n\nInput: piles = [30,11,23,4,20], h = 5\nOutput: 30\n\nExample 3:\n\nInput: piles = [30,11,23,4,20], h = 6\nOutput: 23\n\n \n\nConstraints:\n\n\t• `1 4`\n• `piles.length 9`\n• `1 9`",
      "descriptionHtml": "<p>Koko loves to eat bananas. There are <code>n</code> piles of bananas, the <code>i<sup>th</sup></code> pile has <code>piles[i]</code> bananas. The guards have gone and will come back in <code>h</code> hours.</p>\n\n<p>Koko can decide her bananas-per-hour eating speed of <code>k</code>. Each hour, she chooses some pile of bananas and eats <code>k</code> bananas from that pile. If the pile has less than <code>k</code> bananas, she eats all of them instead and will not eat any more bananas during this hour.</p>\n\n<p>Koko likes to eat slowly but still wants to finish eating all the bananas before the guards return.</p>\n\n<p>Return <em>the minimum integer</em> <code>k</code> <em>such that she can eat all the bananas within</em> <code>h</code> <em>hours</em>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> piles = [3,6,7,11], h = 8\n<strong>Output:</strong> 4\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> piles = [30,11,23,4,20], h = 5\n<strong>Output:</strong> 30\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> piles = [30,11,23,4,20], h = 6\n<strong>Output:</strong> 23\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= piles.length &lt;= 10<sup>4</sup></code></li>\n\t<li><code>piles.length &lt;= h &lt;= 10<sup>9</sup></code></li>\n\t<li><code>1 &lt;= piles[i] &lt;= 10<sup>9</sup></code></li>\n</ul>\n",
      "lcSlug": "koko-eating-bananas",
      "summary": "Binary search the answer; check feasible(mid) monotonically."
    },
    {
      "id": "bs-07",
      "title": "Capacity To Ship Packages",
      "lc": 1011,
      "importance": "must",
      "subtopic": "answer-space",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "weights, days",
          "out": "capacity"
        }
      ],
      "approaches": [
        {
          "name": "BS capacity",
          "time": "O(n log S)",
          "space": "O(1)",
          "code": "bool ship(vector<int>& w, int days, int cap) {\n    int d=1, cur=0;\n    for (int x: w) { if (x>cap) return false; if (cur+x>cap) { d++; cur=0; } cur+=x; }\n    return d<=days;\n}\nint shipWithinDays(vector<int>& weights, int days) {\n    int lo=*max_element(weights.begin(), weights.end()), hi=accumulate(weights.begin(), weights.end(), 0);\n    while (lo<hi) { int mid=lo+(hi-lo)/2; if (ship(weights,days,mid)) hi=mid; else lo=mid+1; }\n    return lo;\n}"
        }
      ],
      "description": "A conveyor belt has packages that must be shipped from one port to another within `days` days.\n\nThe `ith` package on the conveyor belt has a weight of `weights[i]`. Each day, we load the ship with packages on the conveyor belt (in the order given by `weights`). We may not load more weight than the maximum weight capacity of the ship.\n\nReturn the least weight capacity of the ship that will result in all the packages on the conveyor belt being shipped within `days` days.\n\n \n\nExample 1:\n\nInput: weights = [1,2,3,4,5,6,7,8,9,10], days = 5\nOutput: 15\nExplanation: A ship capacity of 15 is the minimum to ship all the packages in 5 days like this:\n1st day: 1, 2, 3, 4, 5\n2nd day: 6, 7\n3rd day: 8\n4th day: 9\n5th day: 10\n\nNote that the cargo must be shipped in the order given, so using a ship of capacity 14 and splitting the packages into parts like (2, 3, 4, 5), (1, 6, 7), (8), (9), (10) is not allowed.\n\nExample 2:\n\nInput: weights = [3,2,2,4,1,4], days = 3\nOutput: 6\nExplanation: A ship capacity of 6 is the minimum to ship all the packages in 3 days like this:\n1st day: 3, 2\n2nd day: 2, 4\n3rd day: 1, 4\n\nExample 3:\n\nInput: weights = [1,2,3,1,1], days = 4\nOutput: 3\nExplanation:\n1st day: 1\n2nd day: 2\n3rd day: 3\n4th day: 1, 1\n\n \n\nConstraints:\n\n\t• `1 4`\n• `1",
      "descriptionHtml": "<p>A conveyor belt has packages that must be shipped from one port to another within <code>days</code> days.</p>\n\n<p>The <code>i<sup>th</sup></code> package on the conveyor belt has a weight of <code>weights[i]</code>. Each day, we load the ship with packages on the conveyor belt (in the order given by <code>weights</code>). We may not load more weight than the maximum weight capacity of the ship.</p>\n\n<p>Return the least weight capacity of the ship that will result in all the packages on the conveyor belt being shipped within <code>days</code> days.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> weights = [1,2,3,4,5,6,7,8,9,10], days = 5\n<strong>Output:</strong> 15\n<strong>Explanation:</strong> A ship capacity of 15 is the minimum to ship all the packages in 5 days like this:\n1st day: 1, 2, 3, 4, 5\n2nd day: 6, 7\n3rd day: 8\n4th day: 9\n5th day: 10\n\nNote that the cargo must be shipped in the order given, so using a ship of capacity 14 and splitting the packages into parts like (2, 3, 4, 5), (1, 6, 7), (8), (9), (10) is not allowed.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> weights = [3,2,2,4,1,4], days = 3\n<strong>Output:</strong> 6\n<strong>Explanation:</strong> A ship capacity of 6 is the minimum to ship all the packages in 3 days like this:\n1st day: 3, 2\n2nd day: 2, 4\n3rd day: 1, 4\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> weights = [1,2,3,1,1], days = 4\n<strong>Output:</strong> 3\n<strong>Explanation:</strong>\n1st day: 1\n2nd day: 2\n3rd day: 3\n4th day: 1, 1\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= days &lt;= weights.length &lt;= 5 * 10<sup>4</sup></code></li>\n\t<li><code>1 &lt;= weights[i] &lt;= 500</code></li>\n</ul>\n",
      "lcSlug": "capacity-to-ship-packages-within-d-days",
      "summary": "BS capacity — state invariant, then loop."
    },
    {
      "id": "bs-08",
      "title": "Split Array Largest Sum",
      "lc": 410,
      "importance": "should",
      "subtopic": "answer-space",
      "difficulty": "Hard",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums, k",
          "out": "min max sum"
        }
      ],
      "approaches": [
        {
          "name": "BS on answer",
          "time": "O(n log A)",
          "space": "O(1)",
          "code": "int lo=minAns, hi=maxAns;\nwhile (lo<=hi) { int mid=lo+(hi-lo)/2; if (feasible(mid)) { ans=mid; hi=mid-1; } else lo=mid+1; }"
        }
      ],
      "description": "Given an integer array `nums` and an integer `k`, split `nums` into `k` non-empty subarrays such that the largest sum of any subarray is minimized.\n\nReturn the minimized largest sum of the split.\n\nA subarray is a contiguous part of the array.\n\n \n\nExample 1:\n\nInput: nums = [7,2,5,10,8], k = 2\nOutput: 18\nExplanation: There are four ways to split nums into two subarrays.\nThe best way is to split it into [7,2,5] and [10,8], where the largest sum among the two subarrays is only 18.\n\nExample 2:\n\nInput: nums = [1,2,3,4,5], k = 2\nOutput: 9\nExplanation: There are four ways to split nums into two subarrays.\nThe best way is to split it into [1,2,3] and [4,5], where the largest sum among the two subarrays is only 9.\n\n \n\nConstraints:\n\n\t• `1 6`\n• `1",
      "descriptionHtml": "<p>Given an integer array <code>nums</code> and an integer <code>k</code>, split <code>nums</code> into <code>k</code> non-empty subarrays such that the largest sum of any subarray is <strong>minimized</strong>.</p>\n\n<p>Return <em>the minimized largest sum of the split</em>.</p>\n\n<p>A <strong>subarray</strong> is a contiguous part of the array.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [7,2,5,10,8], k = 2\n<strong>Output:</strong> 18\n<strong>Explanation:</strong> There are four ways to split nums into two subarrays.\nThe best way is to split it into [7,2,5] and [10,8], where the largest sum among the two subarrays is only 18.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [1,2,3,4,5], k = 2\n<strong>Output:</strong> 9\n<strong>Explanation:</strong> There are four ways to split nums into two subarrays.\nThe best way is to split it into [1,2,3] and [4,5], where the largest sum among the two subarrays is only 9.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= nums.length &lt;= 1000</code></li>\n\t<li><code>0 &lt;= nums[i] &lt;= 10<sup>6</sup></code></li>\n\t<li><code>1 &lt;= k &lt;= min(50, nums.length)</code></li>\n</ul>\n",
      "lcSlug": "split-array-largest-sum",
      "summary": "Binary search the answer; check feasible(mid) monotonically."
    },
    {
      "id": "bs-09",
      "title": "Sqrt(x)",
      "lc": 69,
      "importance": "should",
      "subtopic": "last-true",
      "difficulty": "Easy",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "x",
          "out": "sqrt"
        }
      ],
      "approaches": [
        {
          "name": "Binary search",
          "time": "O(log x)",
          "space": "O(1)",
          "code": "int mySqrt(int x) {\n    if (x < 2) return x;\n    long lo = 1, hi = x, ans = 0;\n    while (lo <= hi) {\n        long mid = lo + (hi - lo) / 2;\n        if (mid * mid <= x) { ans = mid; lo = mid + 1; } else hi = mid - 1;\n    }\n    return (int)ans;\n}"
        }
      ],
      "description": "Given a non-negative integer `x`, return the square root of `x` rounded down to the nearest integer. The returned integer should be non-negative as well.\n\nYou must not use any built-in exponent function or operator.\n\n\t• For example, do not use `pow(x, 0.5)` in c++ or `x ** 0.5` in python.\n\n \n\nExample 1:\n\nInput: x = 4\nOutput: 2\nExplanation: The square root of 4 is 2, so we return 2.\n\nExample 2:\n\nInput: x = 8\nOutput: 2\nExplanation: The square root of 8 is 2.82842..., and since we round it down to the nearest integer, 2 is returned.\n\n \n\nConstraints:\n\n\t• `0 31 - 1`",
      "descriptionHtml": "<p>Given a non-negative integer <code>x</code>, return <em>the square root of </em><code>x</code><em> rounded down to the nearest integer</em>. The returned integer should be <strong>non-negative</strong> as well.</p>\n\n<p>You <strong>must not use</strong> any built-in exponent function or operator.</p>\n\n<ul>\n\t<li>For example, do not use <code>pow(x, 0.5)</code> in c++ or <code>x ** 0.5</code> in python.</li>\n</ul>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> x = 4\n<strong>Output:</strong> 2\n<strong>Explanation:</strong> The square root of 4 is 2, so we return 2.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> x = 8\n<strong>Output:</strong> 2\n<strong>Explanation:</strong> The square root of 8 is 2.82842..., and since we round it down to the nearest integer, 2 is returned.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>0 &lt;= x &lt;= 2<sup>31</sup> - 1</code></li>\n</ul>\n",
      "lcSlug": "sqrtx",
      "summary": "Binary search — state invariant, then loop."
    },
    {
      "id": "bs-10",
      "title": "Find Peak Element",
      "lc": 162,
      "importance": "should",
      "subtopic": "peak",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums",
          "out": "peak index"
        }
      ],
      "approaches": [
        {
          "name": "Binary search peak",
          "time": "O(log n)",
          "space": "O(1)",
          "code": "int findPeakElement(vector<int>& nums) {\n    int lo = 0, hi = (int)nums.size() - 1;\n    while (lo < hi) {\n        int mid = lo + (hi - lo) / 2;\n        if (nums[mid] < nums[mid+1]) lo = mid + 1; else hi = mid;\n    }\n    return lo;\n}"
        }
      ],
      "description": "A peak element is an element that is strictly greater than its neighbors.\n\nGiven a 0-indexed integer array `nums`, find a peak element, and return its index. If the array contains multiple peaks, return the index to any of the peaks.\n\nYou may imagine that `nums[-1] = nums[n] = -&infin;`. In other words, an element is always considered to be strictly greater than a neighbor that is outside the array.\n\nYou must write an algorithm that runs in `O(log n)` time.\n\n \n\nExample 1:\n\nInput: nums = [1,2,3,1]\nOutput: 2\nExplanation: 3 is a peak element and your function should return the index number 2.\n\nExample 2:\n\nInput: nums = [1,2,1,3,5,6,4]\nOutput: 5\nExplanation: Your function can return either index number 1 where the peak element is 2, or index number 5 where the peak element is 6.\n\n \n\nConstraints:\n\n\t• `1 31 31 - 1`\n• `nums[i] != nums[i + 1]` for all valid `i`.",
      "descriptionHtml": "<p>A peak element is an element that is strictly greater than its neighbors.</p>\n\n<p>Given a <strong>0-indexed</strong> integer array <code>nums</code>, find a peak element, and return its index. If the array contains multiple peaks, return the index to <strong>any of the peaks</strong>.</p>\n\n<p>You may imagine that <code>nums[-1] = nums[n] = -&infin;</code>. In other words, an element is always considered to be strictly greater than a neighbor that is outside the array.</p>\n\n<p>You must write an algorithm that runs in <code>O(log n)</code> time.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [1,2,3,1]\n<strong>Output:</strong> 2\n<strong>Explanation:</strong> 3 is a peak element and your function should return the index number 2.</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [1,2,1,3,5,6,4]\n<strong>Output:</strong> 5\n<strong>Explanation:</strong> Your function can return either index number 1 where the peak element is 2, or index number 5 where the peak element is 6.</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= nums.length &lt;= 1000</code></li>\n\t<li><code>-2<sup>31</sup> &lt;= nums[i] &lt;= 2<sup>31</sup> - 1</code></li>\n\t<li><code>nums[i] != nums[i + 1]</code> for all valid <code>i</code>.</li>\n</ul>\n",
      "lcSlug": "find-peak-element",
      "summary": "Binary search peak — state invariant, then loop."
    },
    {
      "id": "bs-11",
      "title": "Search a 2D Matrix",
      "lc": 74,
      "importance": "must",
      "subtopic": "2d",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "matrix, target",
          "out": "found?"
        }
      ],
      "approaches": [
        {
          "name": "Search 2D matrix",
          "time": "O(log mn)",
          "space": "O(1)",
          "code": "bool searchMatrix(vector<vector<int>>& m, int t) {\n    int lo=0, hi=(int)m.size()*m[0].size()-1;\n    while (lo<=hi) {\n        int mid=lo+(hi-lo)/2, r=mid/m[0].size(), c=mid%m[0].size();\n        if (m[r][c]==t) return true;\n        if (m[r][c]<t) lo=mid+1; else hi=mid-1;\n    } return false;\n}"
        }
      ],
      "description": "You are given an `m x n` integer matrix `matrix` with the following two properties:\n\n\t• Each row is sorted in non-decreasing order.\n• The first integer of each row is greater than the last integer of the previous row.\n\nGiven an integer `target`, return `true` if `target` is in `matrix` or `false` otherwise.\n\nYou must write a solution in `O(log(m * n))` time complexity.\n\n \n\nExample 1:\n\nInput: matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3\nOutput: true\n\nExample 2:\n\nInput: matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 13\nOutput: false\n\n \n\nConstraints:\n\n\t• `m == matrix.length`\n• `n == matrix[i].length`\n• `1 4 4`",
      "descriptionHtml": "<p>You are given an <code>m x n</code> integer matrix <code>matrix</code> with the following two properties:</p>\n\n<ul>\n\t<li>Each row is sorted in non-decreasing order.</li>\n\t<li>The first integer of each row is greater than the last integer of the previous row.</li>\n</ul>\n\n<p>Given an integer <code>target</code>, return <code>true</code> <em>if</em> <code>target</code> <em>is in</em> <code>matrix</code> <em>or</em> <code>false</code> <em>otherwise</em>.</p>\n\n<p>You must write a solution in <code>O(log(m * n))</code> time complexity.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2020/10/05/mat.jpg\" style=\"width: 322px; height: 242px;\" />\n<pre>\n<strong>Input:</strong> matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3\n<strong>Output:</strong> true\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2020/10/05/mat2.jpg\" style=\"width: 322px; height: 242px;\" />\n<pre>\n<strong>Input:</strong> matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 13\n<strong>Output:</strong> false\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>m == matrix.length</code></li>\n\t<li><code>n == matrix[i].length</code></li>\n\t<li><code>1 &lt;= m, n &lt;= 100</code></li>\n\t<li><code>-10<sup>4</sup> &lt;= matrix[i][j], target &lt;= 10<sup>4</sup></code></li>\n</ul>\n",
      "lcSlug": "search-a-2d-matrix",
      "summary": "Search 2D matrix — state invariant, then loop."
    },
    {
      "id": "bs-12",
      "title": "Search a 2D Matrix II",
      "lc": 240,
      "importance": "should",
      "subtopic": "2d",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "matrix, target",
          "out": "found?"
        }
      ],
      "approaches": [
        {
          "name": "Staircase search",
          "time": "O(m+n)",
          "space": "O(1)",
          "code": "bool searchMatrix(vector<vector<int>>& m, int target) {\n    int r = 0, c = (int)m[0].size() - 1;\n    while (r < (int)m.size() && c >= 0) {\n        if (m[r][c] == target) return true;\n        if (m[r][c] > target) c--; else r++;\n    }\n    return false;\n}"
        }
      ],
      "description": "Write an efficient algorithm that searches for a value `target` in an `m x n` integer matrix `matrix`. This matrix has the following properties:\n\n\t• Integers in each row are sorted in ascending from left to right.\n• Integers in each column are sorted in ascending from top to bottom.\n\n \n\nExample 1:\n\nInput: matrix = [[1,4,7,11,15],[2,5,8,12,19],[3,6,9,16,22],[10,13,14,17,24],[18,21,23,26,30]], target = 5\nOutput: true\n\nExample 2:\n\nInput: matrix = [[1,4,7,11,15],[2,5,8,12,19],[3,6,9,16,22],[10,13,14,17,24],[18,21,23,26,30]], target = 20\nOutput: false\n\n \n\nConstraints:\n\n\t• `m == matrix.length`\n• `n == matrix[i].length`\n• `1 9 9`\n• All the integers in each row are sorted in ascending order.\n• All the integers in each column are sorted in ascending order.\n• `-109 9`",
      "descriptionHtml": "<p>Write an efficient algorithm that searches for a value <code>target</code> in an <code>m x n</code> integer matrix <code>matrix</code>. This matrix has the following properties:</p>\n\n<ul>\n\t<li>Integers in each row are sorted in ascending from left to right.</li>\n\t<li>Integers in each column are sorted in ascending from top to bottom.</li>\n</ul>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2020/11/24/searchgrid2.jpg\" style=\"width: 300px; height: 300px;\" />\n<pre>\n<strong>Input:</strong> matrix = [[1,4,7,11,15],[2,5,8,12,19],[3,6,9,16,22],[10,13,14,17,24],[18,21,23,26,30]], target = 5\n<strong>Output:</strong> true\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2020/11/24/searchgrid.jpg\" style=\"width: 300px; height: 300px;\" />\n<pre>\n<strong>Input:</strong> matrix = [[1,4,7,11,15],[2,5,8,12,19],[3,6,9,16,22],[10,13,14,17,24],[18,21,23,26,30]], target = 20\n<strong>Output:</strong> false\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>m == matrix.length</code></li>\n\t<li><code>n == matrix[i].length</code></li>\n\t<li><code>1 &lt;= n, m &lt;= 300</code></li>\n\t<li><code>-10<sup>9</sup> &lt;= matrix[i][j] &lt;= 10<sup>9</sup></code></li>\n\t<li>All the integers in each row are <strong>sorted</strong> in ascending order.</li>\n\t<li>All the integers in each column are <strong>sorted</strong> in ascending order.</li>\n\t<li><code>-10<sup>9</sup> &lt;= target &lt;= 10<sup>9</sup></code></li>\n</ul>\n",
      "lcSlug": "search-a-2d-matrix-ii",
      "summary": "Start top-right (or bottom-left); go left if too big else down."
    },
    {
      "id": "bs-13",
      "title": "Median of Two Sorted Arrays",
      "lc": 4,
      "importance": "must",
      "subtopic": "advanced",
      "difficulty": "Hard",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums1, nums2",
          "out": "median"
        }
      ],
      "approaches": [
        {
          "name": "Median two arrays",
          "time": "O(log min(m,n))",
          "space": "O(1)",
          "code": "double findMedianSortedArrays(vector<int>& A, vector<int>& B) {\n    if (A.size() > B.size()) swap(A,B);\n    int m=A.size(), n=B.size(), lo=0, hi=m;\n    while (lo <= hi) {\n        int i=lo+(hi-lo)/2, j=(m+n+1)/2-i;\n        int Aleft = i? A[i-1]: INT_MIN, Aright = i<m? A[i]: INT_MAX;\n        int Bleft = j? B[j-1]: INT_MIN, Bright = j<n? B[j]: INT_MAX;\n        if (Aleft <= Bright && Bleft <= Aright)\n            return (m+n)%2? max(Aleft,Bleft) : (max(Aleft,Bleft)+min(Aright,Bright))/2.0;\n        if (Aleft > Bright) hi=i-1; else lo=i+1;\n    } return 0;\n}"
        }
      ],
      "description": "Given two sorted arrays `nums1` and `nums2` of size `m` and `n` respectively, return the median of the two sorted arrays.\n\nThe overall run time complexity should be `O(log (m+n))`.\n\n \n\nExample 1:\n\nInput: nums1 = [1,3], nums2 = [2]\nOutput: 2.00000\nExplanation: merged array = [1,2,3] and median is 2.\n\nExample 2:\n\nInput: nums1 = [1,2], nums2 = [3,4]\nOutput: 2.50000\nExplanation: merged array = [1,2,3,4] and median is (2 + 3) / 2 = 2.5.\n\n \n\nConstraints:\n\n\t• `nums1.length == m`\n• `nums2.length == n`\n• `0 6 6`",
      "descriptionHtml": "<p>Given two sorted arrays <code>nums1</code> and <code>nums2</code> of size <code>m</code> and <code>n</code> respectively, return <strong>the median</strong> of the two sorted arrays.</p>\n\n<p>The overall run time complexity should be <code>O(log (m+n))</code>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums1 = [1,3], nums2 = [2]\n<strong>Output:</strong> 2.00000\n<strong>Explanation:</strong> merged array = [1,2,3] and median is 2.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums1 = [1,2], nums2 = [3,4]\n<strong>Output:</strong> 2.50000\n<strong>Explanation:</strong> merged array = [1,2,3,4] and median is (2 + 3) / 2 = 2.5.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>nums1.length == m</code></li>\n\t<li><code>nums2.length == n</code></li>\n\t<li><code>0 &lt;= m &lt;= 1000</code></li>\n\t<li><code>0 &lt;= n &lt;= 1000</code></li>\n\t<li><code>1 &lt;= m + n &lt;= 2000</code></li>\n\t<li><code>-10<sup>6</sup> &lt;= nums1[i], nums2[i] &lt;= 10<sup>6</sup></code></li>\n</ul>\n",
      "lcSlug": "median-of-two-sorted-arrays",
      "summary": "Median two arrays — state invariant, then loop."
    },
    {
      "id": "bs-14",
      "title": "Find K Closest Elements",
      "lc": 658,
      "importance": "should",
      "subtopic": "window",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "arr, k, x",
          "out": "subarray"
        }
      ],
      "approaches": [
        {
          "name": "Two pointers window",
          "time": "O(log k + n)",
          "space": "O(1)",
          "code": "vector<int> findClosestElements(vector<int>& arr, int k, int x) {\n    int lo = 0, hi = (int)arr.size() - k;\n    while (lo < hi) {\n        int mid = lo + (hi - lo) / 2;\n        if (x - arr[mid] > arr[mid + k] - x) lo = mid + 1; else hi = mid;\n    }\n    return vector<int>(arr.begin() + lo, arr.begin() + lo + k);\n}"
        }
      ],
      "description": "Given a sorted integer array `arr`, two integers `k` and `x`, return the `k` closest integers to `x` in the array. The result should also be sorted in ascending order.\n\nAn integer `a` is closer to `x` than an integer `b` if:\n\n\t• `|a - x| \n\n \n\nExample 1:\n\nInput: arr = [1,2,3,4,5], k = 4, x = 3\n\nOutput: [1,2,3,4]\n\nExample 2:\n\nInput: arr = [1,1,2,3,4,5], k = 4, x = -1\n\nOutput: [1,1,2,3]\n\n \n\nConstraints:\n\n\t• `1 4`\n• `arr` is sorted in ascending order.\n• `-104 4`",
      "descriptionHtml": "<p>Given a <strong>sorted</strong> integer array <code>arr</code>, two integers <code>k</code> and <code>x</code>, return the <code>k</code> closest integers to <code>x</code> in the array. The result should also be sorted in ascending order.</p>\n\n<p>An integer <code>a</code> is closer to <code>x</code> than an integer <code>b</code> if:</p>\n\n<ul>\n\t<li><code>|a - x| &lt; |b - x|</code>, or</li>\n\t<li><code>|a - x| == |b - x|</code> and <code>a &lt; b</code></li>\n</ul>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<div class=\"example-block\">\n<p><strong>Input:</strong> <span class=\"example-io\">arr = [1,2,3,4,5], k = 4, x = 3</span></p>\n\n<p><strong>Output:</strong> <span class=\"example-io\">[1,2,3,4]</span></p>\n</div>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<div class=\"example-block\">\n<p><strong>Input:</strong> <span class=\"example-io\">arr = [1,1,2,3,4,5], k = 4, x = -1</span></p>\n\n<p><strong>Output:</strong> <span class=\"example-io\">[1,1,2,3]</span></p>\n</div>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= k &lt;= arr.length</code></li>\n\t<li><code>1 &lt;= arr.length &lt;= 10<sup>4</sup></code></li>\n\t<li><code>arr</code> is sorted in <strong>ascending</strong> order.</li>\n\t<li><code>-10<sup>4</sup> &lt;= arr[i], x &lt;= 10<sup>4</sup></code></li>\n</ul>\n",
      "lcSlug": "find-k-closest-elements",
      "summary": "Two pointers window — state invariant, then loop."
    },
    {
      "id": "bs-15",
      "title": "Kth Missing Positive Number",
      "lc": 1539,
      "importance": "nice",
      "subtopic": "exact",
      "difficulty": "Easy",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "arr, k",
          "out": "number"
        }
      ],
      "approaches": [
        {
          "name": "Missing count BS",
          "time": "O(log n)",
          "space": "O(1)",
          "code": "int findKthPositive(vector<int>& arr, int k) {\n    int lo=0, hi=arr.size();\n    while(lo<hi){ int mid=lo+(hi-lo)/2; if(arr[mid]-mid-1<k) lo=mid+1; else hi=mid; }\n    return lo+k;\n}"
        }
      ],
      "description": "Given an array `arr` of positive integers sorted in a strictly increasing order, and an integer `k`.\n\nReturn the `kth` positive integer that is missing from this array.\n\n \n\nExample 1:\n\nInput: arr = [2,3,4,7,11], k = 5\nOutput: 9\nExplanation: The missing positive integers are [1,5,6,8,9,10,12,13,...]. The 5th missing positive integer is 9.\n\nExample 2:\n\nInput: arr = [1,2,3,4], k = 2\nOutput: 6\nExplanation: The missing positive integers are [5,6,7,...]. The 2nd missing positive integer is 6.\n\n \n\nConstraints:\n\n\t• `1 \n\n \n\nFollow up:\n\nCould you solve this problem in less than O(n) complexity?",
      "descriptionHtml": "<p>Given an array <code>arr</code> of positive integers sorted in a <strong>strictly increasing order</strong>, and an integer <code>k</code>.</p>\n\n<p>Return <em>the</em> <code>k<sup>th</sup></code> <em><strong>positive</strong> integer that is <strong>missing</strong> from this array.</em></p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> arr = [2,3,4,7,11], k = 5\n<strong>Output:</strong> 9\n<strong>Explanation: </strong>The missing positive integers are [1,5,6,8,9,10,12,13,...]. The 5<sup>th</sup>&nbsp;missing positive integer is 9.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> arr = [1,2,3,4], k = 2\n<strong>Output:</strong> 6\n<strong>Explanation: </strong>The missing positive integers are [5,6,7,...]. The 2<sup>nd</sup> missing positive integer is 6.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= arr.length &lt;= 1000</code></li>\n\t<li><code>1 &lt;= arr[i] &lt;= 1000</code></li>\n\t<li><code>1 &lt;= k &lt;= 1000</code></li>\n\t<li><code>arr[i] &lt; arr[j]</code> for <code>1 &lt;= i &lt; j &lt;= arr.length</code></li>\n</ul>\n\n<p>&nbsp;</p>\n<p><strong>Follow up:</strong></p>\n\n<p>Could you solve this problem in less than O(n) complexity?</p>\n",
      "lcSlug": "kth-missing-positive-number",
      "summary": "Missing count BS — state invariant, then loop."
    },
    {
      "id": "bs-16",
      "title": "Single Element in Sorted Array",
      "lc": 540,
      "importance": "should",
      "subtopic": "exact",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums",
          "out": "single"
        }
      ],
      "approaches": [
        {
          "name": "Binary search single",
          "time": "O(log n)",
          "space": "O(1)",
          "code": "int singleNonDuplicate(vector<int>& nums) {\n    int lo = 0, hi = (int)nums.size() - 1;\n    while (lo < hi) {\n        int mid = lo + (hi - lo) / 2;\n        if (mid % 2 == 1) mid--;\n        if (nums[mid] == nums[mid+1]) lo = mid + 2; else hi = mid;\n    }\n    return nums[lo];\n}"
        }
      ],
      "description": "You are given a sorted array consisting of only integers where every element appears exactly twice, except for one element which appears exactly once.\n\nReturn the single element that appears only once.\n\nYour solution must run in `O(log n)` time and `O(1)` space.\n\n \n\nExample 1:\n\nInput: nums = [1,1,2,3,3,4,4,8,8]\nOutput: 2\n\nExample 2:\n\nInput: nums = [3,3,7,7,10,11,11]\nOutput: 10\n\n \n\nConstraints:\n\n\t• `1 5`\n• `0 5`",
      "descriptionHtml": "<p>You are given a sorted array consisting of only integers where every element appears exactly twice, except for one element which appears exactly once.</p>\n\n<p>Return <em>the single element that appears only once</em>.</p>\n\n<p>Your solution must run in <code>O(log n)</code> time and <code>O(1)</code> space.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<pre><strong>Input:</strong> nums = [1,1,2,3,3,4,4,8,8]\n<strong>Output:</strong> 2\n</pre><p><strong class=\"example\">Example 2:</strong></p>\n<pre><strong>Input:</strong> nums = [3,3,7,7,10,11,11]\n<strong>Output:</strong> 10\n</pre>\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= nums.length &lt;= 10<sup>5</sup></code></li>\n\t<li><code>0 &lt;= nums[i] &lt;= 10<sup>5</sup></code></li>\n</ul>\n",
      "lcSlug": "single-element-in-a-sorted-array",
      "summary": "Even/odd index pairing — go left if pair matches else right."
    },
    {
      "id": "bs-17",
      "title": "Search in Rotated Sorted Array II",
      "lc": 81,
      "importance": "nice",
      "subtopic": "rotated",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "duplicates",
          "out": "found?"
        }
      ],
      "approaches": [
        {
          "name": "BS with duplicates",
          "time": "O(log n)",
          "space": "O(1)",
          "code": "bool search(vector<int>& nums, int target) {\n    int lo=0, hi=(int)nums.size()-1;\n    while(lo<=hi){\n        int mid=lo+(hi-lo)/2;\n        if(nums[mid]==target) return true;\n        if(nums[lo]==nums[mid]&&nums[mid]==nums[hi]){ lo++; hi--; continue; }\n        if(nums[lo]<=nums[mid]){ if(nums[lo]<=target&&target<nums[mid]) hi=mid-1; else lo=mid+1; }\n        else { if(nums[mid]<target&&target<=nums[hi]) lo=mid+1; else hi=mid-1; }\n    } return false;\n}"
        }
      ],
      "description": "There is an integer array `nums` sorted in non-decreasing order (not necessarily with distinct values).\n\nBefore being passed to your function, `nums` is rotated at an unknown pivot index `k` (`0 Example 1:\n\nInput: nums = [2,5,6,0,0,1,2], target = 0\nOutput: true\n\nExample 2:\n\nInput: nums = [2,5,6,0,0,1,2], target = 3\nOutput: false\n\n \n\nConstraints:\n\n\t• `1 4 4`\n• `nums` is guaranteed to be rotated at some pivot.\n• `-104 4`\n\n \n\nFollow up: This problem is similar to Search in Rotated Sorted Array, but `nums` may contain duplicates. Would this affect the runtime complexity? How and why?",
      "descriptionHtml": "<p>There is an integer array <code>nums</code> sorted in non-decreasing order (not necessarily with <strong>distinct</strong> values).</p>\n\n<p>Before being passed to your function, <code>nums</code> is <strong>rotated</strong> at an unknown pivot index <code>k</code> (<code>0 &lt;= k &lt; nums.length</code>) such that the resulting array is <code>[nums[k], nums[k+1], ..., nums[n-1], nums[0], nums[1], ..., nums[k-1]]</code> (<strong>0-indexed</strong>). For example, <code>[0,1,2,4,4,4,5,6,6,7]</code> might be rotated at pivot index <code>5</code> and become <code>[4,5,6,6,7,0,1,2,4,4]</code>.</p>\n\n<p>Given the array <code>nums</code> <strong>after</strong> the rotation and an integer <code>target</code>, return <code>true</code><em> if </em><code>target</code><em> is in </em><code>nums</code><em>, or </em><code>false</code><em> if it is not in </em><code>nums</code><em>.</em></p>\n\n<p>You must decrease the overall operation steps as much as possible.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<pre><strong>Input:</strong> nums = [2,5,6,0,0,1,2], target = 0\n<strong>Output:</strong> true\n</pre><p><strong class=\"example\">Example 2:</strong></p>\n<pre><strong>Input:</strong> nums = [2,5,6,0,0,1,2], target = 3\n<strong>Output:</strong> false\n</pre>\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= nums.length &lt;= 5000</code></li>\n\t<li><code>-10<sup>4</sup> &lt;= nums[i] &lt;= 10<sup>4</sup></code></li>\n\t<li><code>nums</code> is guaranteed to be rotated at some pivot.</li>\n\t<li><code>-10<sup>4</sup> &lt;= target &lt;= 10<sup>4</sup></code></li>\n</ul>\n\n<p>&nbsp;</p>\n<p><strong>Follow up:</strong> This problem is similar to&nbsp;<a href=\"/problems/search-in-rotated-sorted-array/description/\" target=\"_blank\">Search in Rotated Sorted Array</a>, but&nbsp;<code>nums</code> may contain <strong>duplicates</strong>. Would this affect the runtime complexity? How and why?</p>\n",
      "lcSlug": "search-in-rotated-sorted-array-ii",
      "summary": "BS with duplicates — state invariant, then loop."
    },
    {
      "id": "bs-18",
      "title": "Minimum Limit of Balls in a Bag",
      "lc": 1760,
      "importance": "nice",
      "subtopic": "answer-space",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums, ops",
          "out": "min max"
        }
      ],
      "approaches": [
        {
          "name": "BS on answer",
          "time": "O(n log A)",
          "space": "O(1)",
          "code": "int lo=minAns, hi=maxAns;\nwhile (lo<=hi) { int mid=lo+(hi-lo)/2; if (feasible(mid)) { ans=mid; hi=mid-1; } else lo=mid+1; }"
        }
      ],
      "description": "You are given an integer array `nums` where the `ith` bag contains `nums[i]` balls. You are also given an integer `maxOperations`.\n\nYou can perform the following operation at most `maxOperations` times:\n\n\t• Take any bag of balls and divide it into two new bags with a positive number of balls.\n\n\t\n\t\t• For example, a bag of `5` balls can become two new bags of `1` and `4` balls, or two new bags of `2` and `3` balls.\n\n\t\n\nYour penalty is the maximum number of balls in a bag. You want to minimize your penalty after the operations.\n\nReturn the minimum possible penalty after performing the operations.\n\n \n\nExample 1:\n\nInput: nums = [9], maxOperations = 2\nOutput: 3\nExplanation: \n- Divide the bag with 9 balls into two bags of sizes 6 and 3. [9] -> [6,3].\n- Divide the bag with 6 balls into two bags of sizes 3 and 3. [6,3] -> [3,3,3].\nThe bag with the most number of balls has 3 balls, so your penalty is 3 and you should return 3.\n\nExample 2:\n\nInput: nums = [2,4,8,2], maxOperations = 4\nOutput: 2\nExplanation:\n- Divide the bag with 8 balls into two bags of sizes 4 and 4. [2,4,8,2] -> [2,4,4,4,2].\n- Divide the bag with 4 balls into two bags of sizes 2 and 2. [2,4,4,4,2] -> [2,2,2,4,4,2].\n- Divide the bag with 4 balls into two bags of sizes 2 and 2. [2,2,2,4,4,2] -> [2,2,2,2,2,4,2].\n- Divide the bag with 4 balls into two bags of sizes 2 and 2. [2,2,2,2,2,4,2] -> [2,2,2,2,2,2,2,2].\nThe bag with the most number of balls has 2 balls, so your penalty is 2, and you should return 2.\n\n \n\nConstraints:\n\n\t• `1 5`\n• `1 9`",
      "descriptionHtml": "<p>You are given an integer array <code>nums</code> where the <code>i<sup>th</sup></code> bag contains <code>nums[i]</code> balls. You are also given an integer <code>maxOperations</code>.</p>\n\n<p>You can perform the following operation at most <code>maxOperations</code> times:</p>\n\n<ul>\n\t<li>Take any bag of balls and divide it into two new bags with a <strong>positive </strong>number of balls.\n\n\t<ul>\n\t\t<li>For example, a bag of <code>5</code> balls can become two new bags of <code>1</code> and <code>4</code> balls, or two new bags of <code>2</code> and <code>3</code> balls.</li>\n\t</ul>\n\t</li>\n</ul>\n\n<p>Your penalty is the <strong>maximum</strong> number of balls in a bag. You want to <strong>minimize</strong> your penalty after the operations.</p>\n\n<p>Return <em>the minimum possible penalty after performing the operations</em>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [9], maxOperations = 2\n<strong>Output:</strong> 3\n<strong>Explanation:</strong> \n- Divide the bag with 9 balls into two bags of sizes 6 and 3. [<strong><u>9</u></strong>] -&gt; [6,3].\n- Divide the bag with 6 balls into two bags of sizes 3 and 3. [<strong><u>6</u></strong>,3] -&gt; [3,3,3].\nThe bag with the most number of balls has 3 balls, so your penalty is 3 and you should return 3.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [2,4,8,2], maxOperations = 4\n<strong>Output:</strong> 2\n<strong>Explanation:</strong>\n- Divide the bag with 8 balls into two bags of sizes 4 and 4. [2,4,<strong><u>8</u></strong>,2] -&gt; [2,4,4,4,2].\n- Divide the bag with 4 balls into two bags of sizes 2 and 2. [2,<strong><u>4</u></strong>,4,4,2] -&gt; [2,2,2,4,4,2].\n- Divide the bag with 4 balls into two bags of sizes 2 and 2. [2,2,2,<strong><u>4</u></strong>,4,2] -&gt; [2,2,2,2,2,4,2].\n- Divide the bag with 4 balls into two bags of sizes 2 and 2. [2,2,2,2,2,<strong><u>4</u></strong>,2] -&gt; [2,2,2,2,2,2,2,2].\nThe bag with the most number of balls has 2 balls, so your penalty is 2, and you should return 2.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= nums.length &lt;= 10<sup>5</sup></code></li>\n\t<li><code>1 &lt;= maxOperations, nums[i] &lt;= 10<sup>9</sup></code></li>\n</ul>\n",
      "lcSlug": "minimum-limit-of-balls-in-a-bag",
      "summary": "Binary search the answer; check feasible(mid) monotonically."
    },
    {
      "id": "bs-19",
      "title": "Maximum Running Time of Computers",
      "lc": 2141,
      "importance": "nice",
      "subtopic": "answer-space",
      "difficulty": "Hard",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "n, batteries",
          "out": "hours"
        }
      ],
      "approaches": [
        {
          "name": "BS on answer",
          "time": "O(n log A)",
          "space": "O(1)",
          "code": "int lo=minAns, hi=maxAns;\nwhile (lo<=hi) { int mid=lo+(hi-lo)/2; if (feasible(mid)) { ans=mid; hi=mid-1; } else lo=mid+1; }"
        }
      ],
      "description": "You have `n` computers. You are given the integer `n` and a 0-indexed integer array `batteries` where the `ith` battery can run a computer for `batteries[i]` minutes. You are interested in running all `n` computers simultaneously using the given batteries.\n\nInitially, you can insert at most one battery into each computer. After that and at any integer time moment, you can remove a battery from a computer and insert another battery any number of times. The inserted battery can be a totally new battery or a battery from another computer. You may assume that the removing and inserting processes take no time.\n\nNote that the batteries cannot be recharged.\n\nReturn the maximum number of minutes you can run all the `n` computers simultaneously.\n\n \n\nExample 1:\n\nInput: n = 2, batteries = [3,3,3]\nOutput: 4\nExplanation: \nInitially, insert battery 0 into the first computer and battery 1 into the second computer.\nAfter two minutes, remove battery 1 from the second computer and insert battery 2 instead. Note that battery 1 can still run for one minute.\nAt the end of the third minute, battery 0 is drained, and you need to remove it from the first computer and insert battery 1 instead.\nBy the end of the fourth minute, battery 1 is also drained, and the first computer is no longer running.\nWe can run the two computers simultaneously for at most 4 minutes, so we return 4.\n\nExample 2:\n\nInput: n = 2, batteries = [1,1,1,1]\nOutput: 2\nExplanation: \nInitially, insert battery 0 into the first computer and battery 2 into the second computer. \nAfter one minute, battery 0 and battery 2 are drained so you need to remove them and insert battery 1 into the first computer and battery 3 into the second computer. \nAfter another minute, battery 1 and battery 3 are also drained so the first and second computers are no longer running.\nWe can run the two computers simultaneously for at most 2 minutes, so we return 2.\n\n \n\nConstraints:\n\n\t• `1 5`\n• `1 9`",
      "descriptionHtml": "<p>You have <code>n</code> computers. You are given the integer <code>n</code> and a <strong>0-indexed</strong> integer array <code>batteries</code> where the <code>i<sup>th</sup></code> battery can <strong>run</strong> a computer for <code>batteries[i]</code> minutes. You are interested in running <strong>all</strong> <code>n</code> computers <strong>simultaneously</strong> using the given batteries.</p>\n\n<p>Initially, you can insert <strong>at most one battery</strong> into each computer. After that and at any integer time moment, you can remove a battery from a computer and insert another battery <strong>any number of times</strong>. The inserted battery can be a totally new battery or a battery from another computer. You may assume that the removing and inserting processes take no time.</p>\n\n<p>Note that the batteries cannot be recharged.</p>\n\n<p>Return <em>the <strong>maximum</strong> number of minutes you can run all the </em><code>n</code><em> computers simultaneously.</em></p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2022/01/06/example1-fit.png\" style=\"width: 762px; height: 150px;\" />\n<pre>\n<strong>Input:</strong> n = 2, batteries = [3,3,3]\n<strong>Output:</strong> 4\n<strong>Explanation:</strong> \nInitially, insert battery 0 into the first computer and battery 1 into the second computer.\nAfter two minutes, remove battery 1 from the second computer and insert battery 2 instead. Note that battery 1 can still run for one minute.\nAt the end of the third minute, battery 0 is drained, and you need to remove it from the first computer and insert battery 1 instead.\nBy the end of the fourth minute, battery 1 is also drained, and the first computer is no longer running.\nWe can run the two computers simultaneously for at most 4 minutes, so we return 4.\n\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2022/01/06/example2.png\" style=\"width: 629px; height: 150px;\" />\n<pre>\n<strong>Input:</strong> n = 2, batteries = [1,1,1,1]\n<strong>Output:</strong> 2\n<strong>Explanation:</strong> \nInitially, insert battery 0 into the first computer and battery 2 into the second computer. \nAfter one minute, battery 0 and battery 2 are drained so you need to remove them and insert battery 1 into the first computer and battery 3 into the second computer. \nAfter another minute, battery 1 and battery 3 are also drained so the first and second computers are no longer running.\nWe can run the two computers simultaneously for at most 2 minutes, so we return 2.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= n &lt;= batteries.length &lt;= 10<sup>5</sup></code></li>\n\t<li><code>1 &lt;= batteries[i] &lt;= 10<sup>9</sup></code></li>\n</ul>\n",
      "lcSlug": "maximum-running-time-of-n-computers",
      "summary": "Binary search the answer; check feasible(mid) monotonically."
    },
    {
      "id": "bs-20",
      "title": "Aggressive Cows",
      "lc": null,
      "importance": "should",
      "subtopic": "answer-space",
      "difficulty": "Hard",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "stalls, cows",
          "out": "max min dist"
        }
      ],
      "approaches": [
        {
          "name": "BS on answer",
          "time": "O(n log A)",
          "space": "O(1)",
          "code": "int lo=minAns, hi=maxAns;\nwhile (lo<=hi) { int mid=lo+(hi-lo)/2; if (feasible(mid)) { ans=mid; hi=mid-1; } else lo=mid+1; }"
        }
      ],
      "description": "Aggressive Cows",
      "summary": "BS on answer"
    },
    {
      "id": "bs-21",
      "title": "Minimum Speed to Arrive on Time",
      "lc": 1870,
      "importance": "nice",
      "subtopic": "answer-space",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "dist, speed, h",
          "out": "min speed"
        }
      ],
      "approaches": [
        {
          "name": "BS on answer",
          "time": "O(n log A)",
          "space": "O(1)",
          "code": "int lo=minAns, hi=maxAns;\nwhile (lo<=hi) { int mid=lo+(hi-lo)/2; if (feasible(mid)) { ans=mid; hi=mid-1; } else lo=mid+1; }"
        }
      ],
      "description": "You are given a floating-point number `hour`, representing the amount of time you have to reach the office. To commute to the office, you must take `n` trains in sequential order. You are also given an integer array `dist` of length `n`, where `dist[i]` describes the distance (in kilometers) of the `ith` train ride.\n\nEach train can only depart at an integer hour, so you may need to wait in between each train ride.\n\n\t• For example, if the `1st` train ride takes `1.5` hours, you must wait for an additional `0.5` hours before you can depart on the `2nd` train ride at the 2 hour mark.\n\nReturn the minimum positive integer speed (in kilometers per hour) that all the trains must travel at for you to reach the office on time, or `-1` if it is impossible to be on time.\n\nTests are generated such that the answer will not exceed `107` and `hour` will have at most two digits after the decimal point.\n\n \n\nExample 1:\n\nInput: dist = [1,3,2], hour = 6\nOutput: 1\nExplanation: At speed 1:\n- The first train ride takes 1/1 = 1 hour.\n- Since we are already at an integer hour, we depart immediately at the 1 hour mark. The second train takes 3/1 = 3 hours.\n- Since we are already at an integer hour, we depart immediately at the 4 hour mark. The third train takes 2/1 = 2 hours.\n- You will arrive at exactly the 6 hour mark.\n\nExample 2:\n\nInput: dist = [1,3,2], hour = 2.7\nOutput: 3\nExplanation: At speed 3:\n- The first train ride takes 1/3 = 0.33333 hours.\n- Since we are not at an integer hour, we wait until the 1 hour mark to depart. The second train ride takes 3/3 = 1 hour.\n- Since we are already at an integer hour, we depart immediately at the 2 hour mark. The third train takes 2/3 = 0.66667 hours.\n- You will arrive at the 2.66667 hour mark.\n\nExample 3:\n\nInput: dist = [1,3,2], hour = 1.9\nOutput: -1\nExplanation: It is impossible because the earliest the third train can depart is at the 2 hour mark.\n\n \n\nConstraints:\n\n\t• `n == dist.length`\n• `1 5`\n• `1 5`\n• `1 9`\n• There will be at most two digits after the decimal point in `hour`.",
      "descriptionHtml": "<p>You are given a floating-point number <code>hour</code>, representing the amount of time you have to reach the office. To commute to the office, you must take <code>n</code> trains in sequential order. You are also given an integer array <code>dist</code> of length <code>n</code>, where <code>dist[i]</code> describes the distance (in kilometers) of the <code>i<sup>th</sup></code> train ride.</p>\n\n<p>Each train can only depart at an integer hour, so you may need to wait in between each train ride.</p>\n\n<ul>\n\t<li>For example, if the <code>1<sup>st</sup></code> train ride takes <code>1.5</code> hours, you must wait for an additional <code>0.5</code> hours before you can depart on the <code>2<sup>nd</sup></code> train ride at the 2 hour mark.</li>\n</ul>\n\n<p>Return <em>the <strong>minimum positive integer</strong> speed <strong>(in kilometers per hour)</strong> that all the trains must travel at for you to reach the office on time, or </em><code>-1</code><em> if it is impossible to be on time</em>.</p>\n\n<p>Tests are generated such that the answer will not exceed <code>10<sup>7</sup></code> and <code>hour</code> will have <strong>at most two digits after the decimal point</strong>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> dist = [1,3,2], hour = 6\n<strong>Output:</strong> 1\n<strong>Explanation: </strong>At speed 1:\n- The first train ride takes 1/1 = 1 hour.\n- Since we are already at an integer hour, we depart immediately at the 1 hour mark. The second train takes 3/1 = 3 hours.\n- Since we are already at an integer hour, we depart immediately at the 4 hour mark. The third train takes 2/1 = 2 hours.\n- You will arrive at exactly the 6 hour mark.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> dist = [1,3,2], hour = 2.7\n<strong>Output:</strong> 3\n<strong>Explanation: </strong>At speed 3:\n- The first train ride takes 1/3 = 0.33333 hours.\n- Since we are not at an integer hour, we wait until the 1 hour mark to depart. The second train ride takes 3/3 = 1 hour.\n- Since we are already at an integer hour, we depart immediately at the 2 hour mark. The third train takes 2/3 = 0.66667 hours.\n- You will arrive at the 2.66667 hour mark.\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> dist = [1,3,2], hour = 1.9\n<strong>Output:</strong> -1\n<strong>Explanation:</strong> It is impossible because the earliest the third train can depart is at the 2 hour mark.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>n == dist.length</code></li>\n\t<li><code>1 &lt;= n &lt;= 10<sup>5</sup></code></li>\n\t<li><code>1 &lt;= dist[i] &lt;= 10<sup>5</sup></code></li>\n\t<li><code>1 &lt;= hour &lt;= 10<sup>9</sup></code></li>\n\t<li>There will be at most two digits after the decimal point in <code>hour</code>.</li>\n</ul>\n",
      "lcSlug": "minimum-speed-to-arrive-on-time",
      "summary": "Binary search the answer; check feasible(mid) monotonically."
    },
    {
      "id": "bs-22",
      "title": "Maximum Value at Given Index",
      "lc": 1802,
      "importance": "nice",
      "subtopic": "answer-space",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "n,index,maxSum",
          "out": "max n"
        }
      ],
      "approaches": [
        {
          "name": "BS on answer",
          "time": "O(n log A)",
          "space": "O(1)",
          "code": "int lo=minAns, hi=maxAns;\nwhile (lo<=hi) { int mid=lo+(hi-lo)/2; if (feasible(mid)) { ans=mid; hi=mid-1; } else lo=mid+1; }"
        }
      ],
      "description": "You are given three positive integers: `n`, `index`, and `maxSum`. You want to construct an array `nums` (0-indexed) that satisfies the following conditions:\n\n\t• `nums.length == n`\n• `nums[i]` is a positive integer where `0 \n\nReturn `nums[index]` of the constructed array.\n\nNote that `abs(x)` equals `x` if `x >= 0`, and `-x` otherwise.\n\n \n\nExample 1:\n\nInput: n = 4, index = 2,  maxSum = 6\nOutput: 2\nExplanation: nums = [1,2,2,1] is one array that satisfies all the conditions.\nThere are no arrays that satisfy all the conditions and have nums[2] == 3, so 2 is the maximum nums[2].\n\nExample 2:\n\nInput: n = 6, index = 1,  maxSum = 10\nOutput: 3\n\n \n\nConstraints:\n\n\t• `1 9`\n• `0",
      "descriptionHtml": "<p>You are given three positive integers:&nbsp;<code>n</code>, <code>index</code>, and <code>maxSum</code>. You want to construct an array <code>nums</code> (<strong>0-indexed</strong>)<strong> </strong>that satisfies the following conditions:</p>\n\n<ul>\n\t<li><code>nums.length == n</code></li>\n\t<li><code>nums[i]</code> is a <strong>positive</strong> integer where <code>0 &lt;= i &lt; n</code>.</li>\n\t<li><code>abs(nums[i] - nums[i+1]) &lt;= 1</code> where <code>0 &lt;= i &lt; n-1</code>.</li>\n\t<li>The sum of all the elements of <code>nums</code> does not exceed <code>maxSum</code>.</li>\n\t<li><code>nums[index]</code> is <strong>maximized</strong>.</li>\n</ul>\n\n<p>Return <code>nums[index]</code><em> of the constructed array</em>.</p>\n\n<p>Note that <code>abs(x)</code> equals <code>x</code> if <code>x &gt;= 0</code>, and <code>-x</code> otherwise.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> n = 4, index = 2,  maxSum = 6\n<strong>Output:</strong> 2\n<strong>Explanation:</strong> nums = [1,2,<u><strong>2</strong></u>,1] is one array that satisfies all the conditions.\nThere are no arrays that satisfy all the conditions and have nums[2] == 3, so 2 is the maximum nums[2].\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> n = 6, index = 1,  maxSum = 10\n<strong>Output:</strong> 3\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= n &lt;= maxSum &lt;= 10<sup>9</sup></code></li>\n\t<li><code>0 &lt;= index &lt; n</code></li>\n</ul>\n",
      "lcSlug": "maximum-value-at-a-given-index-in-a-bounded-array",
      "summary": "Binary search the answer; check feasible(mid) monotonically."
    },
    {
      "id": "bs-23",
      "title": "Minimum Absolute Sum Difference",
      "lc": 1818,
      "importance": "nice",
      "subtopic": "exact",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums1, nums2",
          "out": "min diff"
        }
      ],
      "approaches": [
        {
          "name": "Sort + BS",
          "time": "O(n log n)",
          "space": "O(n)",
          "code": "int minAbsoluteSumDiff(vector<int>& a, vector<int>& b) {\n    const int MOD=1e9+7; vector<int> s=a; sort(s.begin(),s.end());\n    long long sum=0, best=0;\n    for(int i=0;i<(int)a.size();i++){\n        sum=(sum+abs(a[i]-b[i]))%MOD;\n        auto it=lower_bound(s.begin(),s.end(),b[i]);\n        if(it!=s.end()) best=max(best, (long long)abs(a[i]-b[i])-abs(*it-b[i]));\n        if(it!=s.begin()){ --it; best=max(best,(long long)abs(a[i]-b[i])-abs(*it-b[i])); }\n    } return (int)((sum-best+MOD)%MOD);\n}"
        }
      ],
      "description": "You are given two positive integer arrays `nums1` and `nums2`, both of length `n`.\n\nThe absolute sum difference of arrays `nums1` and `nums2` is defined as the sum of `|nums1[i] - nums2[i]|` for each `0 9 + 7`.\n\n`|x|` is defined as:\n\n\t• `x` if `x >= 0`, or\n• `-x` if `x \n\n \n\nExample 1:\n\nInput: nums1 = [1,7,5], nums2 = [2,3,5]\nOutput: 3\nExplanation: There are two possible optimal solutions:\n- Replace the second element with the first: [1,7,5] => [1,1,5], or\n- Replace the second element with the third: [1,7,5] => [1,5,5].\nBoth will yield an absolute sum difference of |1-2| + (|1-3| or |5-3|) + |5-5| = 3.\n\nExample 2:\n\nInput: nums1 = [2,4,6,8,10], nums2 = [2,4,6,8,10]\nOutput: 0\nExplanation: nums1 is equal to nums2 so no replacement is needed. This will result in an \nabsolute sum difference of 0.\n\nExample 3:\n\nInput: nums1 = [1,10,4,4,2,7], nums2 = [9,3,5,1,7,4]\nOutput: 20\nExplanation: Replace the first element with the second: [1,10,4,4,2,7] => [10,10,4,4,2,7].\nThis yields an absolute sum difference of |10-9| + |10-3| + |4-5| + |4-1| + |2-7| + |7-4| = 20\n\n \n\nConstraints:\n\n\t• `n == nums1.length`\n• `n == nums2.length`\n• `1 5`\n• `1 5`",
      "descriptionHtml": "<p>You are given two positive integer arrays <code>nums1</code> and <code>nums2</code>, both of length <code>n</code>.</p>\n\n<p>The <strong>absolute sum difference</strong> of arrays <code>nums1</code> and <code>nums2</code> is defined as the <strong>sum</strong> of <code>|nums1[i] - nums2[i]|</code> for each <code>0 &lt;= i &lt; n</code> (<strong>0-indexed</strong>).</p>\n\n<p>You can replace <strong>at most one</strong> element of <code>nums1</code> with <strong>any</strong> other element in <code>nums1</code> to <strong>minimize</strong> the absolute sum difference.</p>\n\n<p>Return the <em>minimum absolute sum difference <strong>after</strong> replacing at most one<strong> </strong>element in the array <code>nums1</code>.</em> Since the answer may be large, return it <strong>modulo</strong> <code>10<sup>9</sup> + 7</code>.</p>\n\n<p><code>|x|</code> is defined as:</p>\n\n<ul>\n\t<li><code>x</code> if <code>x &gt;= 0</code>, or</li>\n\t<li><code>-x</code> if <code>x &lt; 0</code>.</li>\n</ul>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums1 = [1,7,5], nums2 = [2,3,5]\n<strong>Output:</strong> 3\n<strong>Explanation: </strong>There are two possible optimal solutions:\n- Replace the second element with the first: [1,<u><strong>7</strong></u>,5] =&gt; [1,<u><strong>1</strong></u>,5], or\n- Replace the second element with the third: [1,<u><strong>7</strong></u>,5] =&gt; [1,<u><strong>5</strong></u>,5].\nBoth will yield an absolute sum difference of <code>|1-2| + (|1-3| or |5-3|) + |5-5| = </code>3.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums1 = [2,4,6,8,10], nums2 = [2,4,6,8,10]\n<strong>Output:</strong> 0\n<strong>Explanation: </strong>nums1 is equal to nums2 so no replacement is needed. This will result in an \nabsolute sum difference of 0.\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums1 = [1,10,4,4,2,7], nums2 = [9,3,5,1,7,4]\n<strong>Output:</strong> 20\n<strong>Explanation: </strong>Replace the first element with the second: [<u><strong>1</strong></u>,10,4,4,2,7] =&gt; [<u><strong>10</strong></u>,10,4,4,2,7].\nThis yields an absolute sum difference of <code>|10-9| + |10-3| + |4-5| + |4-1| + |2-7| + |7-4| = 20</code>\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>n == nums1.length</code></li>\n\t<li><code>n == nums2.length</code></li>\n\t<li><code>1 &lt;= n &lt;= 10<sup>5</sup></code></li>\n\t<li><code>1 &lt;= nums1[i], nums2[i] &lt;= 10<sup>5</sup></code></li>\n</ul>\n",
      "lcSlug": "minimum-absolute-sum-difference",
      "summary": "Sort + BS — state invariant, then loop."
    },
    {
      "id": "bs-24",
      "title": "Random Pick with Weight",
      "lc": 528,
      "importance": "should",
      "subtopic": "prefix",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "w",
          "out": "index"
        }
      ],
      "approaches": [
        {
          "name": "Prefix + binary search",
          "time": "O(log n) pick",
          "space": "O(n)",
          "code": "class Solution {\n    vector<int> pre; int total;\npublic:\n    Solution(vector<int>& w) {\n        pre.resize(w.size()); total = 0;\n        for (int i = 0; i < (int)w.size(); i++) total = pre[i] = total + w[i];\n    }\n    int pickIndex() {\n        int r = rand() % total + 1;\n        return lower_bound(pre.begin(), pre.end(), r) - pre.begin();\n    }\n};"
        }
      ],
      "description": "You are given a 0-indexed array of positive integers `w` where `w[i]` describes the weight of the `ith` index.\n\nYou need to implement the function `pickIndex()`, which randomly picks an index in the range `[0, w.length - 1]` (inclusive) and returns it. The probability of picking an index `i` is `w[i] / sum(w)`.\n\n\t• For example, if `w = [1, 3]`, the probability of picking index `0` is `1 / (1 + 3) = 0.25` (i.e., `25%`), and the probability of picking index `1` is `3 / (1 + 3) = 0.75` (i.e., `75%`).\n\n \n\nExample 1:\n\nInput\n[\"Solution\",\"pickIndex\"]\n[[[1]],[]]\nOutput\n[null,0]\n\nExplanation\nSolution solution = new Solution([1]);\nsolution.pickIndex(); // return 0. The only option is to return 0 since there is only one element in w.\n\nExample 2:\n\nInput\n[\"Solution\",\"pickIndex\",\"pickIndex\",\"pickIndex\",\"pickIndex\",\"pickIndex\"]\n[[[1,3]],[],[],[],[],[]]\nOutput\n[null,1,1,1,1,0]\n\nExplanation\nSolution solution = new Solution([1, 3]);\nsolution.pickIndex(); // return 1. It is returning the second element (index = 1) that has a probability of 3/4.\nsolution.pickIndex(); // return 1\nsolution.pickIndex(); // return 1\nsolution.pickIndex(); // return 1\nsolution.pickIndex(); // return 0. It is returning the first element (index = 0) that has a probability of 1/4.\n\nSince this is a randomization problem, multiple answers are allowed.\nAll of the following outputs can be considered correct:\n[null,1,1,1,1,0]\n[null,1,1,1,1,1]\n[null,1,1,1,0,0]\n[null,1,1,1,0,1]\n[null,1,0,1,0,0]\n......\nand so on.\n\n \n\nConstraints:\n\n\t• `1 4`\n• `1 5`\n• `pickIndex` will be called at most `104` times.",
      "descriptionHtml": "<p>You are given a <strong>0-indexed</strong> array of positive integers <code>w</code> where <code>w[i]</code> describes the <strong>weight</strong> of the <code>i<sup>th</sup></code> index.</p>\n\n<p>You need to implement the function <code>pickIndex()</code>, which <strong>randomly</strong> picks an index in the range <code>[0, w.length - 1]</code> (<strong>inclusive</strong>) and returns it. The <strong>probability</strong> of picking an index <code>i</code> is <code>w[i] / sum(w)</code>.</p>\n\n<ul>\n\t<li>For example, if <code>w = [1, 3]</code>, the probability of picking index <code>0</code> is <code>1 / (1 + 3) = 0.25</code> (i.e., <code>25%</code>), and the probability of picking index <code>1</code> is <code>3 / (1 + 3) = 0.75</code> (i.e., <code>75%</code>).</li>\n</ul>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input</strong>\n[&quot;Solution&quot;,&quot;pickIndex&quot;]\n[[[1]],[]]\n<strong>Output</strong>\n[null,0]\n\n<strong>Explanation</strong>\nSolution solution = new Solution([1]);\nsolution.pickIndex(); // return 0. The only option is to return 0 since there is only one element in w.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input</strong>\n[&quot;Solution&quot;,&quot;pickIndex&quot;,&quot;pickIndex&quot;,&quot;pickIndex&quot;,&quot;pickIndex&quot;,&quot;pickIndex&quot;]\n[[[1,3]],[],[],[],[],[]]\n<strong>Output</strong>\n[null,1,1,1,1,0]\n\n<strong>Explanation</strong>\nSolution solution = new Solution([1, 3]);\nsolution.pickIndex(); // return 1. It is returning the second element (index = 1) that has a probability of 3/4.\nsolution.pickIndex(); // return 1\nsolution.pickIndex(); // return 1\nsolution.pickIndex(); // return 1\nsolution.pickIndex(); // return 0. It is returning the first element (index = 0) that has a probability of 1/4.\n\nSince this is a randomization problem, multiple answers are allowed.\nAll of the following outputs can be considered correct:\n[null,1,1,1,1,0]\n[null,1,1,1,1,1]\n[null,1,1,1,0,0]\n[null,1,1,1,0,1]\n[null,1,0,1,0,0]\n......\nand so on.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= w.length &lt;= 10<sup>4</sup></code></li>\n\t<li><code>1 &lt;= w[i] &lt;= 10<sup>5</sup></code></li>\n\t<li><code>pickIndex</code> will be called at most <code>10<sup>4</sup></code> times.</li>\n</ul>\n",
      "lcSlug": "random-pick-with-weight",
      "summary": "Prefix + binary search — Prefix sums + hash map or difference array for range/subarray queries."
    },
    {
      "id": "bs-25",
      "title": "Find Right Interval",
      "lc": 436,
      "importance": "nice",
      "subtopic": "first-true",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "intervals",
          "out": "right intervals"
        }
      ],
      "approaches": [
        {
          "name": "Binary search first true",
          "time": "O(log n)",
          "space": "O(1)",
          "code": "int lo=0, hi=n-1, ans=n;\nwhile (lo<=hi) { int mid=lo+(hi-lo)/2; if (ok(mid)) { ans=mid; hi=mid-1; } else lo=mid+1; }"
        }
      ],
      "description": "You are given an array of `intervals`, where `intervals[i] = [starti, endi]` and each `starti` is unique.\n\nThe right interval for an interval `i` is an interval `j` such that `startj >= endi` and `startj` is minimized. Note that `i` may equal `j`.\n\nReturn an array of right interval indices for each interval `i`. If no right interval exists for interval `i`, then put `-1` at index `i`.\n\n \n\nExample 1:\n\nInput: intervals = [[1,2]]\nOutput: [-1]\nExplanation: There is only one interval in the collection, so it outputs -1.\n\nExample 2:\n\nInput: intervals = [[3,4],[2,3],[1,2]]\nOutput: [-1,0,1]\nExplanation: There is no right interval for [3,4].\nThe right interval for [2,3] is [3,4] since start0 = 3 is the smallest start that is >= end1 = 3.\nThe right interval for [1,2] is [2,3] since start1 = 2 is the smallest start that is >= end2 = 2.\n\nExample 3:\n\nInput: intervals = [[1,4],[2,3],[3,4]]\nOutput: [-1,2,-1]\nExplanation: There is no right interval for [1,4] and [3,4].\nThe right interval for [2,3] is [3,4] since start2 = 3 is the smallest start that is >= end1 = 3.\n\n \n\nConstraints:\n\n\t• `1 4`\n• `intervals[i].length == 2`\n• `-106 i i 6`\n• The start point of each interval is unique.",
      "descriptionHtml": "<p>You are given an array of <code>intervals</code>, where <code>intervals[i] = [start<sub>i</sub>, end<sub>i</sub>]</code> and each <code>start<sub>i</sub></code> is <strong>unique</strong>.</p>\n\n<p>The <strong>right interval</strong> for an interval <code>i</code> is an interval <code>j</code> such that <code>start<sub>j</sub> &gt;= end<sub>i</sub></code> and <code>start<sub>j</sub></code> is <strong>minimized</strong>. Note that <code>i</code> may equal <code>j</code>.</p>\n\n<p>Return <em>an array of <strong>right interval</strong> indices for each interval <code>i</code></em>. If no <strong>right interval</strong> exists for interval <code>i</code>, then put <code>-1</code> at index <code>i</code>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> intervals = [[1,2]]\n<strong>Output:</strong> [-1]\n<strong>Explanation:</strong> There is only one interval in the collection, so it outputs -1.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> intervals = [[3,4],[2,3],[1,2]]\n<strong>Output:</strong> [-1,0,1]\n<strong>Explanation:</strong> There is no right interval for [3,4].\nThe right interval for [2,3] is [3,4] since start<sub>0</sub> = 3 is the smallest start that is &gt;= end<sub>1</sub> = 3.\nThe right interval for [1,2] is [2,3] since start<sub>1</sub> = 2 is the smallest start that is &gt;= end<sub>2</sub> = 2.\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> intervals = [[1,4],[2,3],[3,4]]\n<strong>Output:</strong> [-1,2,-1]\n<strong>Explanation:</strong> There is no right interval for [1,4] and [3,4].\nThe right interval for [2,3] is [3,4] since start<sub>2</sub> = 3 is the smallest start that is &gt;= end<sub>1</sub> = 3.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= intervals.length &lt;= 2 * 10<sup>4</sup></code></li>\n\t<li><code>intervals[i].length == 2</code></li>\n\t<li><code>-10<sup>6</sup> &lt;= start<sub>i</sub> &lt;= end<sub>i</sub> &lt;= 10<sup>6</sup></code></li>\n\t<li>The start point of each interval is <strong>unique</strong>.</li>\n</ul>\n",
      "lcSlug": "find-right-interval",
      "summary": "lo/hi; if ok(mid) save ans, shrink toward first true (hi=mid-1 or lo=mid+1)."
    },
    {
      "id": "bs-26",
      "title": "Maximum Candies Allocated to K Children",
      "lc": 2226,
      "importance": "nice",
      "subtopic": "answer-space",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "candies, k",
          "out": "max per child"
        }
      ],
      "approaches": [
        {
          "name": "BS on answer",
          "time": "O(n log A)",
          "space": "O(1)",
          "code": "int lo=minAns, hi=maxAns;\nwhile (lo<=hi) { int mid=lo+(hi-lo)/2; if (feasible(mid)) { ans=mid; hi=mid-1; } else lo=mid+1; }"
        }
      ],
      "description": "You are given a 0-indexed integer array `candies`. Each element in the array denotes a pile of candies of size `candies[i]`. You can divide each pile into any number of sub piles, but you cannot merge two piles together.\n\nYou are also given an integer `k`. You should allocate piles of candies to `k` children such that each child gets the same number of candies. Each child can be allocated candies from only one pile of candies and some piles of candies may go unused.\n\nReturn the maximum number of candies each child can get.\n\n \n\nExample 1:\n\nInput: candies = [5,8,6], k = 3\nOutput: 5\nExplanation: We can divide candies[1] into 2 piles of size 5 and 3, and candies[2] into 2 piles of size 5 and 1. We now have five piles of candies of sizes 5, 5, 3, 5, and 1. We can allocate the 3 piles of size 5 to 3 children. It can be proven that each child cannot receive more than 5 candies.\n\nExample 2:\n\nInput: candies = [2,5], k = 11\nOutput: 0\nExplanation: There are 11 children but only 7 candies in total, so it is impossible to ensure each child receives at least one candy. Thus, each child gets no candy and the answer is 0.\n\n \n\nConstraints:\n\n\t• `1 5`\n• `1 7`\n• `1 12`",
      "descriptionHtml": "<p>You are given a <strong>0-indexed</strong> integer array <code>candies</code>. Each element in the array denotes a pile of candies of size <code>candies[i]</code>. You can divide each pile into any number of <strong>sub piles</strong>, but you <strong>cannot</strong> merge two piles together.</p>\n\n<p>You are also given an integer <code>k</code>. You should allocate piles of candies to <code>k</code> children such that each child gets the <strong>same</strong> number of candies. Each child can be allocated candies from <strong>only one</strong> pile of candies and some piles of candies may go unused.</p>\n\n<p>Return <em>the <strong>maximum number of candies</strong> each child can get.</em></p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> candies = [5,8,6], k = 3\n<strong>Output:</strong> 5\n<strong>Explanation:</strong> We can divide candies[1] into 2 piles of size 5 and 3, and candies[2] into 2 piles of size 5 and 1. We now have five piles of candies of sizes 5, 5, 3, 5, and 1. We can allocate the 3 piles of size 5 to 3 children. It can be proven that each child cannot receive more than 5 candies.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> candies = [2,5], k = 11\n<strong>Output:</strong> 0\n<strong>Explanation:</strong> There are 11 children but only 7 candies in total, so it is impossible to ensure each child receives at least one candy. Thus, each child gets no candy and the answer is 0.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= candies.length &lt;= 10<sup>5</sup></code></li>\n\t<li><code>1 &lt;= candies[i] &lt;= 10<sup>7</sup></code></li>\n\t<li><code>1 &lt;= k &lt;= 10<sup>12</sup></code></li>\n</ul>\n",
      "lcSlug": "maximum-candies-allocated-to-k-children",
      "summary": "Binary search the answer; check feasible(mid) monotonically."
    }
  ]
};
