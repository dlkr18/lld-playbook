window.PRACTICE_TOPIC = {
  "id": "sorting",
  "title": "Sorting & Selection",
  "expected_count": 20,
  "strategy": "<strong>Speed-run:</strong> Quickselect for Kth; merge sort for inversions; Dutch flag for 3-way. Filter <em>Must do</em> first.",
  "subtopics": [
    {
      "id": "merge-sort",
      "label": "Merge Sort"
    },
    {
      "id": "quick-select",
      "label": "Quick Select"
    },
    {
      "id": "dutch-flag",
      "label": "Dutch Flag"
    },
    {
      "id": "custom-sort",
      "label": "Custom Sort"
    },
    {
      "id": "counting",
      "label": "Counting Sort"
    },
    {
      "id": "sort",
      "label": "Sort Apps"
    }
  ],
  "questions": [
    {
      "id": "so-01",
      "title": "Sort an Array",
      "lc": 912,
      "importance": "must",
      "subtopic": "merge-sort",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums",
          "out": "sorted"
        }
      ],
      "approaches": [
        {
          "name": "Merge sort",
          "time": "O(n log n)",
          "space": "O(n)",
          "code": "void ms(vector<int>& a, int l, int r, vector<int>& tmp) {\n    if (l>=r) return; int mid=l+(r-l)/2; ms(a,l,mid,tmp); ms(a,mid+1,r,tmp);\n    int i=l,j=mid+1,k=l; while(i<=mid&&j<=r) tmp[k++]= a[i]<=a[j]? a[i++]: a[j++];\n    while(i<=mid) tmp[k++]=a[i++]; while(j<=r) tmp[k++]=a[j++];\n    for (int t=l;t<=r;t++) a[t]=tmp[t];\n}\nvector<int> sortArray(vector<int>& nums) { vector<int> tmp(nums.size()); ms(nums,0,(int)nums.size()-1,tmp); return nums; }"
        }
      ],
      "description": "Given an array of integers `nums`, sort the array in ascending order and return it.\n\nYou must solve the problem without using any built-in functions in `O(nlog(n))` time complexity and with the smallest space complexity possible.\n\n \n\nExample 1:\n\nInput: nums = [5,2,3,1]\nOutput: [1,2,3,5]\nExplanation: After sorting the array, the positions of some numbers are not changed (for example, 2 and 3), while the positions of other numbers are changed (for example, 1 and 5).\n\nExample 2:\n\nInput: nums = [5,1,1,2,0,0]\nOutput: [0,0,1,1,2,5]\nExplanation: Note that the values of nums are not necessarily unique.\n\n \n\nConstraints:\n\n\t• `1 4`\n• `-5 * 104 4`",
      "descriptionHtml": "<p>Given an array of integers <code>nums</code>, sort the array in ascending order and return it.</p>\n\n<p>You must solve the problem <strong>without using any built-in</strong> functions in <code>O(nlog(n))</code> time complexity and with the smallest space complexity possible.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [5,2,3,1]\n<strong>Output:</strong> [1,2,3,5]\n<strong>Explanation:</strong> After sorting the array, the positions of some numbers are not changed (for example, 2 and 3), while the positions of other numbers are changed (for example, 1 and 5).\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [5,1,1,2,0,0]\n<strong>Output:</strong> [0,0,1,1,2,5]\n<strong>Explanation:</strong> Note that the values of nums are not necessarily unique.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= nums.length &lt;= 5 * 10<sup>4</sup></code></li>\n\t<li><code>-5 * 10<sup>4</sup> &lt;= nums[i] &lt;= 5 * 10<sup>4</sup></code></li>\n</ul>\n",
      "lcSlug": "sort-an-array",
      "summary": "Merge sort — state invariant, then loop."
    },
    {
      "id": "so-02",
      "title": "Kth Largest Element",
      "lc": 215,
      "importance": "must",
      "subtopic": "quick-select",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums,k",
          "out": "kth"
        }
      ],
      "approaches": [
        {
          "name": "Quickselect",
          "time": "O(n) avg",
          "space": "O(1)",
          "code": "int findKthLargest(vector<int>& nums, int k) {\n    int n = nums.size(), need = n-k;\n    int lo = 0, hi = n-1;\n    while (true) {\n        int p = lo + (hi-lo)/2, i = lo, j = hi;\n        swap(nums[p], nums[hi]);\n        int pivot = nums[hi], store = lo;\n        for (int t = lo; t < hi; t++) if (nums[t] < pivot) swap(nums[t], nums[store++]);\n        swap(nums[store], nums[hi]);\n        if (store == need) return nums[store];\n        if (store < need) lo = store+1; else hi = store-1;\n    }\n}"
        }
      ],
      "description": "Given an integer array `nums` and an integer `k`, return the `kth` largest element in the array.\n\nNote that it is the `kth` largest element in the sorted order, not the `kth` distinct element.\n\nCan you solve it without sorting?\n\n \n\nExample 1:\n\nInput: nums = [3,2,1,5,6,4], k = 2\nOutput: 5\n\nExample 2:\n\nInput: nums = [3,2,3,1,2,4,5,5,6], k = 4\nOutput: 4\n\n \n\nConstraints:\n\n\t• `1 5`\n• `-104 4`",
      "descriptionHtml": "<p>Given an integer array <code>nums</code> and an integer <code>k</code>, return <em>the</em> <code>k<sup>th</sup></code> <em>largest element in the array</em>.</p>\n\n<p>Note that it is the <code>k<sup>th</sup></code> largest element in the sorted order, not the <code>k<sup>th</sup></code> distinct element.</p>\n\n<p>Can you solve it without sorting?</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<pre><strong>Input:</strong> nums = [3,2,1,5,6,4], k = 2\n<strong>Output:</strong> 5\n</pre><p><strong class=\"example\">Example 2:</strong></p>\n<pre><strong>Input:</strong> nums = [3,2,3,1,2,4,5,5,6], k = 4\n<strong>Output:</strong> 4\n</pre>\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= k &lt;= nums.length &lt;= 10<sup>5</sup></code></li>\n\t<li><code>-10<sup>4</sup> &lt;= nums[i] &lt;= 10<sup>4</sup></code></li>\n</ul>\n",
      "lcSlug": "kth-largest-element-in-an-array",
      "summary": "Quickselect — state invariant, then loop."
    },
    {
      "id": "so-03",
      "title": "Sort Colors",
      "lc": 75,
      "importance": "must",
      "subtopic": "dutch-flag",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums",
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
      "id": "so-04",
      "title": "Merge Intervals",
      "lc": 56,
      "importance": "should",
      "subtopic": "sort",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "intervals",
          "out": "merged"
        }
      ],
      "approaches": [
        {
          "name": "Sort + merge",
          "time": "O(n log n)",
          "space": "O(n)",
          "code": "vector<vector<int>> merge(vector<vector<int>>& intervals) {\n    sort(intervals.begin(), intervals.end());\n    vector<vector<int>> ans;\n    for (auto& iv : intervals) {\n        if (ans.empty() || ans.back()[1] < iv[0]) ans.push_back(iv);\n        else ans.back()[1] = max(ans.back()[1], iv[1]);\n    } return ans;\n}"
        }
      ],
      "description": "Given an array of `intervals` where `intervals[i] = [starti, endi]`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.\n\n \n\nExample 1:\n\nInput: intervals = [[1,3],[2,6],[8,10],[15,18]]\nOutput: [[1,6],[8,10],[15,18]]\nExplanation: Since intervals [1,3] and [2,6] overlap, merge them into [1,6].\n\nExample 2:\n\nInput: intervals = [[1,4],[4,5]]\nOutput: [[1,5]]\nExplanation: Intervals [1,4] and [4,5] are considered overlapping.\n\nExample 3:\n\nInput: intervals = [[4,7],[1,4]]\nOutput: [[1,7]]\nExplanation: Intervals [1,4] and [4,7] are considered overlapping.\n\n \n\nConstraints:\n\n\t• `1 4`\n• `intervals[i].length == 2`\n• `0 i i 4`",
      "descriptionHtml": "<p>Given an array&nbsp;of <code>intervals</code>&nbsp;where <code>intervals[i] = [start<sub>i</sub>, end<sub>i</sub>]</code>, merge all overlapping intervals, and return <em>an array of the non-overlapping intervals that cover all the intervals in the input</em>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> intervals = [[1,3],[2,6],[8,10],[15,18]]\n<strong>Output:</strong> [[1,6],[8,10],[15,18]]\n<strong>Explanation:</strong> Since intervals [1,3] and [2,6] overlap, merge them into [1,6].\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> intervals = [[1,4],[4,5]]\n<strong>Output:</strong> [[1,5]]\n<strong>Explanation:</strong> Intervals [1,4] and [4,5] are considered overlapping.\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> intervals = [[4,7],[1,4]]\n<strong>Output:</strong> [[1,7]]\n<strong>Explanation:</strong> Intervals [1,4] and [4,7] are considered overlapping.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= intervals.length &lt;= 10<sup>4</sup></code></li>\n\t<li><code>intervals[i].length == 2</code></li>\n\t<li><code>0 &lt;= start<sub>i</sub> &lt;= end<sub>i</sub> &lt;= 10<sup>4</sup></code></li>\n</ul>\n",
      "lcSlug": "merge-intervals",
      "summary": "Sort + merge — state invariant, then loop."
    },
    {
      "id": "so-05",
      "title": "Count of Smaller Numbers After Self",
      "lc": 315,
      "importance": "should",
      "subtopic": "merge-sort",
      "difficulty": "Hard",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums",
          "out": "counts"
        }
      ],
      "approaches": [
        {
          "name": "Merge sort count",
          "time": "O(n log n)",
          "space": "O(n)",
          "code": "void mergeCount(vector<int>& nums, int l, int r, vector<int>& tmp, vector<int>& ans) {\n    if (l>=r) return; int mid=l+(r-l)/2; mergeCount(nums,l,mid,tmp,ans); mergeCount(nums,mid+1,r,tmp,ans);\n    int i=l,j=mid+1,k=l; while(i<=mid&&j<=r){ if(nums[i]<=nums[j]) tmp[k++]=nums[i++]; else { ans[i]+=r-j+1; tmp[k++]=nums[j++]; } }\n    while(i<=mid) tmp[k++]=nums[i++]; while(j<=r) tmp[k++]=nums[j++];\n    for(int t=l;t<=r;t++) nums[t]=tmp[t];\n}\nvector<int> countSmaller(vector<int>& nums) {\n    vector<int> ans(nums.size()), tmp(nums.size()); mergeCount(nums,0,(int)nums.size()-1,tmp,ans); return ans;\n}"
        }
      ],
      "description": "Given an integer array `nums`, return an integer array `counts` where `counts[i]` is the number of smaller elements to the right of `nums[i]`.\n\n \n\nExample 1:\n\nInput: nums = [5,2,6,1]\nOutput: [2,1,1,0]\nExplanation:\nTo the right of 5 there are 2 smaller elements (2 and 1).\nTo the right of 2 there is only 1 smaller element (1).\nTo the right of 6 there is 1 smaller element (1).\nTo the right of 1 there is 0 smaller element.\n\nExample 2:\n\nInput: nums = [-1]\nOutput: [0]\n\nExample 3:\n\nInput: nums = [-1,-1]\nOutput: [0,0]\n\n \n\nConstraints:\n\n\t• `1 5`\n• `-104 4`",
      "descriptionHtml": "<p>Given an integer array <code>nums</code>, return<em> an integer array </em><code>counts</code><em> where </em><code>counts[i]</code><em> is the number of smaller elements to the right of </em><code>nums[i]</code>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [5,2,6,1]\n<strong>Output:</strong> [2,1,1,0]\n<strong>Explanation:</strong>\nTo the right of 5 there are <b>2</b> smaller elements (2 and 1).\nTo the right of 2 there is only <b>1</b> smaller element (1).\nTo the right of 6 there is <b>1</b> smaller element (1).\nTo the right of 1 there is <b>0</b> smaller element.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [-1]\n<strong>Output:</strong> [0]\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [-1,-1]\n<strong>Output:</strong> [0,0]\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= nums.length &lt;= 10<sup>5</sup></code></li>\n\t<li><code>-10<sup>4</sup> &lt;= nums[i] &lt;= 10<sup>4</sup></code></li>\n</ul>\n",
      "lcSlug": "count-of-smaller-numbers-after-self",
      "summary": "Merge step counts cross inversions / valid pairs before merge."
    },
    {
      "id": "so-06",
      "title": "Reverse Pairs",
      "lc": 493,
      "importance": "should",
      "subtopic": "merge-sort",
      "difficulty": "Hard",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums",
          "out": "count"
        }
      ],
      "approaches": [
        {
          "name": "Merge sort inv",
          "time": "O(n log n)",
          "space": "O(n)",
          "code": "int reversePairs(vector<int>& nums) {\n    long ans = 0;\n    function<void(int,int)> sortMerge = [&](int l, int r) {\n        if (l >= r) return;\n        int m = l + (r-l)/2; sortMerge(l,m); sortMerge(m+1,r);\n        int j = m+1;\n        for (int i = l; i <= m; i++) {\n            while (j <= r && (long)nums[i] > 2LL*nums[j]) j++;\n            ans += j - (m+1);\n        }\n        inplace_merge(nums.begin()+l, nums.begin()+m+1, nums.begin()+r+1);\n    };\n    sortMerge(0, (int)nums.size()-1); return (int)ans;\n}"
        }
      ],
      "description": "Given an integer array `nums`, return the number of reverse pairs in the array.\n\nA reverse pair is a pair `(i, j)` where:\n\n\t• `0  2 * nums[j]`.\n\n \n\nExample 1:\n\nInput: nums = [1,3,2,3,1]\nOutput: 2\nExplanation: The reverse pairs are:\n(1, 4) --> nums[1] = 3, nums[4] = 1, 3 > 2 * 1\n(3, 4) --> nums[3] = 3, nums[4] = 1, 3 > 2 * 1\n\nExample 2:\n\nInput: nums = [2,4,3,5,1]\nOutput: 3\nExplanation: The reverse pairs are:\n(1, 4) --> nums[1] = 4, nums[4] = 1, 4 > 2 * 1\n(2, 4) --> nums[2] = 3, nums[4] = 1, 3 > 2 * 1\n(3, 4) --> nums[3] = 5, nums[4] = 1, 5 > 2 * 1\n\n \n\nConstraints:\n\n\t• `1 4`\n• `-231 31 - 1`",
      "descriptionHtml": "<p>Given an integer array <code>nums</code>, return <em>the number of <strong>reverse pairs</strong> in the array</em>.</p>\n\n<p>A <strong>reverse pair</strong> is a pair <code>(i, j)</code> where:</p>\n\n<ul>\n\t<li><code>0 &lt;= i &lt; j &lt; nums.length</code> and</li>\n\t<li><code>nums[i] &gt; 2 * nums[j]</code>.</li>\n</ul>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [1,3,2,3,1]\n<strong>Output:</strong> 2\n<strong>Explanation:</strong> The reverse pairs are:\n(1, 4) --&gt; nums[1] = 3, nums[4] = 1, 3 &gt; 2 * 1\n(3, 4) --&gt; nums[3] = 3, nums[4] = 1, 3 &gt; 2 * 1\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [2,4,3,5,1]\n<strong>Output:</strong> 3\n<strong>Explanation:</strong> The reverse pairs are:\n(1, 4) --&gt; nums[1] = 4, nums[4] = 1, 4 &gt; 2 * 1\n(2, 4) --&gt; nums[2] = 3, nums[4] = 1, 3 &gt; 2 * 1\n(3, 4) --&gt; nums[3] = 5, nums[4] = 1, 5 &gt; 2 * 1\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= nums.length &lt;= 5 * 10<sup>4</sup></code></li>\n\t<li><code>-2<sup>31</sup> &lt;= nums[i] &lt;= 2<sup>31</sup> - 1</code></li>\n</ul>\n",
      "lcSlug": "reverse-pairs",
      "summary": "Merge sort inv — state invariant, then loop."
    },
    {
      "id": "so-07",
      "title": "Sort List",
      "lc": 148,
      "importance": "should",
      "subtopic": "merge-sort",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "head",
          "out": "sorted"
        }
      ],
      "approaches": [
        {
          "name": "Merge sort list",
          "time": "O(n log n)",
          "space": "O(log n)",
          "code": "ListNode* sortList(ListNode* head) {\n    if (!head || !head->next) return head;\n    ListNode *slow=head, *fast=head, *prev=nullptr;\n    while (fast && fast->next) { prev=slow; slow=slow->next; fast=fast->next->next; }\n    prev->next=nullptr;\n    ListNode* a=sortList(head); ListNode* b=sortList(slow);\n    ListNode dummy, *tail=&dummy;\n    while (a&&b) { if (a->val<=b->val){tail->next=a;a=a->next;} else {tail->next=b;b=b->next;} tail=tail->next; }\n    tail->next=a?a:b; return dummy.next;\n}"
        }
      ],
      "description": "Given the `head` of a linked list, return the list after sorting it in ascending order.\n\n \n\nExample 1:\n\nInput: head = [4,2,1,3]\nOutput: [1,2,3,4]\n\nExample 2:\n\nInput: head = [-1,5,3,4,0]\nOutput: [-1,0,3,4,5]\n\nExample 3:\n\nInput: head = []\nOutput: []\n\n \n\nConstraints:\n\n\t• The number of nodes in the list is in the range `[0, 5 * 104]`.\n• `-105 5`\n\n \n\nFollow up: Can you sort the linked list in `O(n logn)` time and `O(1)` memory (i.e. constant space)?",
      "descriptionHtml": "<p>Given the <code>head</code> of a linked list, return <em>the list after sorting it in <strong>ascending order</strong></em>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2020/09/14/sort_list_1.jpg\" style=\"width: 450px; height: 194px;\" />\n<pre>\n<strong>Input:</strong> head = [4,2,1,3]\n<strong>Output:</strong> [1,2,3,4]\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2020/09/14/sort_list_2.jpg\" style=\"width: 550px; height: 184px;\" />\n<pre>\n<strong>Input:</strong> head = [-1,5,3,4,0]\n<strong>Output:</strong> [-1,0,3,4,5]\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> head = []\n<strong>Output:</strong> []\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li>The number of nodes in the list is in the range <code>[0, 5 * 10<sup>4</sup>]</code>.</li>\n\t<li><code>-10<sup>5</sup> &lt;= Node.val &lt;= 10<sup>5</sup></code></li>\n</ul>\n\n<p>&nbsp;</p>\n<p><strong>Follow up:</strong> Can you sort the linked list in <code>O(n logn)</code> time and <code>O(1)</code> memory (i.e. constant space)?</p>\n",
      "lcSlug": "sort-list",
      "summary": "Merge sort list — state invariant, then loop."
    },
    {
      "id": "so-08",
      "title": "Largest Number",
      "lc": 179,
      "importance": "should",
      "subtopic": "custom-sort",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums",
          "out": "string"
        }
      ],
      "approaches": [
        {
          "name": "Largest number",
          "time": "O(n log n)",
          "space": "O(n)",
          "code": "string largestNumber(vector<int>& nums) {\n    vector<string> s; for (int x: nums) s.push_back(to_string(x));\n    sort(s.begin(), s.end(), [](string& a, string& b){ return a+b > b+a; });\n    if (s[0]==\"0\") return \"0\";\n    string ans; for (auto& x: s) ans+=x; return ans;\n}"
        }
      ],
      "description": "Given a list of non-negative integers `nums`, arrange them such that they form the largest number and return it.\n\nSince the result may be very large, so you need to return a string instead of an integer.\n\n \n\nExample 1:\n\nInput: nums = [10,2]\nOutput: \"210\"\n\nExample 2:\n\nInput: nums = [3,30,34,5,9]\nOutput: \"9534330\"\n\n \n\nConstraints:\n\n\t• `1 9`",
      "descriptionHtml": "<p>Given a list of non-negative integers <code>nums</code>, arrange them such that they form the largest number and return it.</p>\n\n<p>Since the result may be very large, so you need to return a string instead of an integer.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [10,2]\n<strong>Output:</strong> &quot;210&quot;\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [3,30,34,5,9]\n<strong>Output:</strong> &quot;9534330&quot;\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= nums.length &lt;= 100</code></li>\n\t<li><code>0 &lt;= nums[i] &lt;= 10<sup>9</sup></code></li>\n</ul>\n",
      "lcSlug": "largest-number",
      "summary": "Largest number — state invariant, then loop."
    },
    {
      "id": "so-09",
      "title": "H-Index",
      "lc": 274,
      "importance": "nice",
      "subtopic": "counting",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "citations",
          "out": "h-index"
        }
      ],
      "approaches": [
        {
          "name": "Counting buckets",
          "time": "O(n)",
          "space": "O(n)",
          "code": "int hIndex(vector<int>& citations) {\n    int n=citations.size(); vector<int> cnt(n+1);\n    for(int c: citations) cnt[min(c,n)]++;\n    int sum=0;\n    for(int h=n;h>=0;h--){ sum+=cnt[h]; if(sum>=h) return h; }\n    return 0;\n}"
        }
      ],
      "description": "Given an array of integers `citations` where `citations[i]` is the number of citations a researcher received for their `ith` paper, return the researcher's h-index.\n\nAccording to the definition of h-index on Wikipedia: The h-index is defined as the maximum value of `h` such that the given researcher has published at least `h` papers that have each been cited at least `h` times.\n\n \n\nExample 1:\n\nInput: citations = [3,0,6,1,5]\nOutput: 3\nExplanation: [3,0,6,1,5] means the researcher has 5 papers in total and each of them had received 3, 0, 6, 1, 5 citations respectively.\nSince the researcher has 3 papers with at least 3 citations each and the remaining two with no more than 3 citations each, their h-index is 3.\n\nExample 2:\n\nInput: citations = [1,3,1]\nOutput: 1\n\n \n\nConstraints:\n\n\t• `n == citations.length`\n• `1",
      "descriptionHtml": "<p>Given an array of integers <code>citations</code> where <code>citations[i]</code> is the number of citations a researcher received for their <code>i<sup>th</sup></code> paper, return <em>the researcher&#39;s h-index</em>.</p>\n\n<p>According to the <a href=\"https://en.wikipedia.org/wiki/H-index\" target=\"_blank\">definition of h-index on Wikipedia</a>: The h-index is defined as the maximum value of <code>h</code> such that the given researcher has published at least <code>h</code> papers that have each been cited at least <code>h</code> times.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> citations = [3,0,6,1,5]\n<strong>Output:</strong> 3\n<strong>Explanation:</strong> [3,0,6,1,5] means the researcher has 5 papers in total and each of them had received 3, 0, 6, 1, 5 citations respectively.\nSince the researcher has 3 papers with at least 3 citations each and the remaining two with no more than 3 citations each, their h-index is 3.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> citations = [1,3,1]\n<strong>Output:</strong> 1\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>n == citations.length</code></li>\n\t<li><code>1 &lt;= n &lt;= 5000</code></li>\n\t<li><code>0 &lt;= citations[i] &lt;= 1000</code></li>\n</ul>\n",
      "lcSlug": "h-index",
      "summary": "Counting buckets — state invariant, then loop."
    },
    {
      "id": "so-10",
      "title": "Wiggle Sort II",
      "lc": 324,
      "importance": "nice",
      "subtopic": "partition",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums",
          "out": "wiggle"
        }
      ],
      "approaches": [
        {
          "name": "Virtual indexing",
          "time": "O(n)",
          "space": "O(1)",
          "code": "void wiggleSort(vector<int>& nums) {\n    int n=nums.size(); auto at=[&](int i){ return nums[(1+2*i)%(n|1)]; };\n    for(int i=0;i<n;i++){\n        int target=i;\n        for(int j=i;j<n;j++) if(at(j)>at(target)) target=j;\n        swap(nums[(1+2*i)%(n|1)], nums[(1+2*target)%(n|1)]);\n    }\n}"
        }
      ],
      "description": "Given an integer array `nums`, reorder it such that `nums[0]  nums[2] Example 1:\n\nInput: nums = [1,5,1,1,6,4]\nOutput: [1,6,1,5,1,4]\nExplanation: [1,4,1,5,1,6] is also accepted.\n\nExample 2:\n\nInput: nums = [1,3,2,2,3,1]\nOutput: [2,3,1,3,1,2]\n\n \n\nConstraints:\n\n\t• `1 4`\n• `0 \n\n \nFollow Up: Can you do it in `O(n)` time and/or in-place with `O(1)` extra space?",
      "descriptionHtml": "<p>Given an integer array <code>nums</code>, reorder it such that <code>nums[0] &lt; nums[1] &gt; nums[2] &lt; nums[3]...</code>.</p>\n\n<p>You may assume the input array always has a valid answer.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [1,5,1,1,6,4]\n<strong>Output:</strong> [1,6,1,5,1,4]\n<strong>Explanation:</strong> [1,4,1,5,1,6] is also accepted.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [1,3,2,2,3,1]\n<strong>Output:</strong> [2,3,1,3,1,2]\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= nums.length &lt;= 5 * 10<sup>4</sup></code></li>\n\t<li><code>0 &lt;= nums[i] &lt;= 5000</code></li>\n\t<li>It is guaranteed that there will be an answer for the given input <code>nums</code>.</li>\n</ul>\n\n<p>&nbsp;</p>\n<strong>Follow Up:</strong> Can you do it in <code>O(n)</code> time and/or <strong>in-place</strong> with <code>O(1)</code> extra space?",
      "lcSlug": "wiggle-sort-ii",
      "summary": "Virtual indexing — state invariant, then loop."
    },
    {
      "id": "so-11",
      "title": "Maximum Gap",
      "lc": 164,
      "importance": "nice",
      "subtopic": "bucket",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums",
          "out": "max gap"
        }
      ],
      "approaches": [
        {
          "name": "Bucket sort radix",
          "time": "O(n)",
          "space": "O(n)",
          "code": "int maximumGap(vector<int>& nums) {\n    if(nums.size()<2) return 0;\n    int mn=*min_element(nums.begin(), nums.end()), mx=*max_element(nums.begin(), nums.end());\n    int bucketSize=max(1,(mx-mn)/((int)nums.size()-1));\n    int bucketCount=(mx-mn)/bucketSize+1;\n    vector<pair<int,int>> buckets(bucketCount,{INT_MAX,INT_MIN});\n    for(int x: nums){\n        int idx=(x-mn)/bucketSize;\n        buckets[idx].first=min(buckets[idx].first,x);\n        buckets[idx].second=max(buckets[idx].second,x);\n    }\n    int ans=0, prev=buckets[0].second;\n    for(int i=1;i<bucketCount;i++){\n        if(buckets[i].first==INT_MAX) continue;\n        ans=max(ans, buckets[i].first-prev);\n        prev=buckets[i].second;\n    } return ans;\n}"
        }
      ],
      "description": "Given an integer array `nums`, return the maximum difference between two successive elements in its sorted form. If the array contains less than two elements, return `0`.\n\nYou must write an algorithm that runs in linear time and uses linear extra space.\n\n \n\nExample 1:\n\nInput: nums = [3,6,9,1]\nOutput: 3\nExplanation: The sorted form of the array is [1,3,6,9], either (3,6) or (6,9) has the maximum difference 3.\n\nExample 2:\n\nInput: nums = [10]\nOutput: 0\nExplanation: The array contains less than 2 elements, therefore return 0.\n\n \n\nConstraints:\n\n\t• `1 5`\n• `0 9`",
      "descriptionHtml": "<p>Given an integer array <code>nums</code>, return <em>the maximum difference between two successive elements in its sorted form</em>. If the array contains less than two elements, return <code>0</code>.</p>\n\n<p>You must write an algorithm that runs in linear time and uses linear extra space.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [3,6,9,1]\n<strong>Output:</strong> 3\n<strong>Explanation:</strong> The sorted form of the array is [1,3,6,9], either (3,6) or (6,9) has the maximum difference 3.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [10]\n<strong>Output:</strong> 0\n<strong>Explanation:</strong> The array contains less than 2 elements, therefore return 0.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= nums.length &lt;= 10<sup>5</sup></code></li>\n\t<li><code>0 &lt;= nums[i] &lt;= 10<sup>9</sup></code></li>\n</ul>\n",
      "lcSlug": "maximum-gap",
      "summary": "Bucket sort radix — state invariant, then loop."
    },
    {
      "id": "so-12",
      "title": "Meeting Rooms",
      "lc": 252,
      "importance": "should",
      "subtopic": "sort",
      "difficulty": "Easy",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "intervals",
          "out": "can attend?"
        }
      ],
      "approaches": [
        {
          "name": "Meeting rooms I",
          "time": "O(n log n)",
          "space": "O(1)",
          "code": "bool canAttendMeetings(vector<vector<int>>& iv) {\n    sort(iv.begin(), iv.end());\n    for (int i=1;i<(int)iv.size();i++) if (iv[i][0]<iv[i-1][1]) return false;\n    return true;\n}"
        }
      ],
      "description": "Given an array of meeting time `intervals`&nbsp;where `intervals[i] = [starti, endi]`, determine if a person could attend all meetings.\n\n&nbsp;\n\nExample 1:\n\nInput: intervals = [[0,30],[5,10],[15,20]]\nOutput: false\n\nExample 2:\n\nInput: intervals = [[7,10],[2,4]]\nOutput: true\n\n&nbsp;\n\nConstraints:\n\n\t• `0 4`\n• `intervals[i].length == 2`\n• `0 i i 6`",
      "descriptionHtml": "<p>Given an array of meeting time <code>intervals</code>&nbsp;where <code>intervals[i] = [start<sub>i</sub>, end<sub>i</sub>]</code>, determine if a person could attend all meetings.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<pre><strong>Input:</strong> intervals = [[0,30],[5,10],[15,20]]\n<strong>Output:</strong> false\n</pre><p><strong class=\"example\">Example 2:</strong></p>\n<pre><strong>Input:</strong> intervals = [[7,10],[2,4]]\n<strong>Output:</strong> true\n</pre>\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>0 <= intervals.length <= 10<sup>4</sup></code></li>\n\t<li><code>intervals[i].length == 2</code></li>\n\t<li><code>0 <= start<sub>i</sub> <&nbsp;end<sub>i</sub> <= 10<sup>6</sup></code></li>\n</ul>",
      "lcSlug": "meeting-rooms",
      "summary": "Meeting rooms I — state invariant, then loop."
    },
    {
      "id": "so-13",
      "title": "Meeting Rooms II",
      "lc": 253,
      "importance": "should",
      "subtopic": "sort",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "intervals",
          "out": "rooms"
        }
      ],
      "approaches": [
        {
          "name": "Meeting rooms II",
          "time": "O(n log n)",
          "space": "O(n)",
          "code": "int minMeetingRooms(vector<vector<int>>& iv) {\n    vector<int> start, end;\n    for (auto& x: iv) { start.push_back(x[0]); end.push_back(x[1]); }\n    sort(start.begin(), start.end()); sort(end.begin(), end.end());\n    int rooms=0, e=0;\n    for (int s: start) { if (s < end[e]) rooms++; else e++; }\n    return rooms;\n}"
        }
      ],
      "description": "Given an array of meeting time intervals `intervals` where `intervals[i] = [starti, endi]`, return the minimum number of conference rooms required.\n\n&nbsp;\n\nExample 1:\n\nInput: intervals = [[0,30],[5,10],[15,20]]\nOutput: 2\n\nExample 2:\n\nInput: intervals = [[7,10],[2,4]]\nOutput: 1\n\n&nbsp;\n\nConstraints:\n\n\t• `1 4`\n• `0 i i 6`",
      "descriptionHtml": "<p>Given an array of meeting time intervals <code>intervals</code> where <code>intervals[i] = [start<sub>i</sub>, end<sub>i</sub>]</code>, return <em>the minimum number of conference rooms required</em>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<pre><strong>Input:</strong> intervals = [[0,30],[5,10],[15,20]]\n<strong>Output:</strong> 2\n</pre><p><strong class=\"example\">Example 2:</strong></p>\n<pre><strong>Input:</strong> intervals = [[7,10],[2,4]]\n<strong>Output:</strong> 1\n</pre>\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 <=&nbsp;intervals.length <= 10<sup>4</sup></code></li>\n\t<li><code>0 <= start<sub>i</sub> < end<sub>i</sub> <= 10<sup>6</sup></code></li>\n</ul>",
      "lcSlug": "meeting-rooms-ii",
      "summary": "Meeting rooms II — state invariant, then loop."
    },
    {
      "id": "so-14",
      "title": "Non-overlapping Intervals",
      "lc": 435,
      "importance": "should",
      "subtopic": "sort",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "intervals",
          "out": "removals"
        }
      ],
      "approaches": [
        {
          "name": "Non-overlapping",
          "time": "O(n log n)",
          "space": "O(1)",
          "code": "int eraseOverlapIntervals(vector<vector<int>>& iv) {\n    sort(iv.begin(), iv.end(), [](auto& a, auto& b){ return a[1]<b[1]; });\n    int end=INT_MIN, removed=0;\n    for (auto& x: iv) if (x[0] < end) removed++; else end=x[1];\n    return removed;\n}"
        }
      ],
      "description": "Given an array of intervals `intervals` where `intervals[i] = [starti, endi]`, return the minimum number of intervals you need to remove to make the rest of the intervals non-overlapping.\n\nNote that intervals which only touch at a point are non-overlapping. For example, `[1, 2]` and `[2, 3]` are non-overlapping.\n\n \n\nExample 1:\n\nInput: intervals = [[1,2],[2,3],[3,4],[1,3]]\nOutput: 1\nExplanation: [1,3] can be removed and the rest of the intervals are non-overlapping.\n\nExample 2:\n\nInput: intervals = [[1,2],[1,2],[1,2]]\nOutput: 2\nExplanation: You need to remove two [1,2] to make the rest of the intervals non-overlapping.\n\nExample 3:\n\nInput: intervals = [[1,2],[2,3]]\nOutput: 0\nExplanation: You don't need to remove any of the intervals since they're already non-overlapping.\n\n \n\nConstraints:\n\n\t• `1 5`\n• `intervals[i].length == 2`\n• `-5 * 104 i i 4`",
      "descriptionHtml": "<p>Given an array of intervals <code>intervals</code> where <code>intervals[i] = [start<sub>i</sub>, end<sub>i</sub>]</code>, return <em>the minimum number of intervals you need to remove to make the rest of the intervals non-overlapping</em>.</p>\n\n<p><strong>Note</strong> that intervals which only touch at a point are <strong>non-overlapping</strong>. For example, <code>[1, 2]</code> and <code>[2, 3]</code> are non-overlapping.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> intervals = [[1,2],[2,3],[3,4],[1,3]]\n<strong>Output:</strong> 1\n<strong>Explanation:</strong> [1,3] can be removed and the rest of the intervals are non-overlapping.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> intervals = [[1,2],[1,2],[1,2]]\n<strong>Output:</strong> 2\n<strong>Explanation:</strong> You need to remove two [1,2] to make the rest of the intervals non-overlapping.\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> intervals = [[1,2],[2,3]]\n<strong>Output:</strong> 0\n<strong>Explanation:</strong> You don&#39;t need to remove any of the intervals since they&#39;re already non-overlapping.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= intervals.length &lt;= 10<sup>5</sup></code></li>\n\t<li><code>intervals[i].length == 2</code></li>\n\t<li><code>-5 * 10<sup>4</sup> &lt;= start<sub>i</sub> &lt; end<sub>i</sub> &lt;= 5 * 10<sup>4</sup></code></li>\n</ul>\n",
      "lcSlug": "non-overlapping-intervals",
      "summary": "Non-overlapping — Sort intervals; merge, sweep line, or greedy by end time."
    },
    {
      "id": "so-15",
      "title": "Insert Interval",
      "lc": 57,
      "importance": "should",
      "subtopic": "sort",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "intervals,new",
          "out": "merged"
        }
      ],
      "approaches": [
        {
          "name": "Insert interval",
          "time": "O(n)",
          "space": "O(n)",
          "code": "vector<vector<int>> insert(vector<vector<int>>& iv, vector<int>& nw) {\n    vector<vector<int>> ans; int i=0, n=iv.size();\n    while (i<n && iv[i][1]<nw[0]) ans.push_back(iv[i++]);\n    while (i<n && iv[i][0]<=nw[1]) { nw[0]=min(nw[0],iv[i][0]); nw[1]=max(nw[1],iv[i][1]); i++; }\n    ans.push_back(nw);\n    while (i<n) ans.push_back(iv[i++]); return ans;\n}"
        }
      ],
      "description": "You are given an array of non-overlapping intervals `intervals` where `intervals[i] = [starti, endi]` represent the start and the end of the `ith` interval and `intervals` is sorted in ascending order by `starti`. You are also given an interval `newInterval = [start, end]` that represents the start and end of another interval.\n\nInsert `newInterval` into `intervals` such that `intervals` is still sorted in ascending order by `starti` and `intervals` still does not have any overlapping intervals (merge overlapping intervals if necessary).\n\nReturn `intervals` after the insertion.\n\nNote that you don't need to modify `intervals` in-place. You can make a new array and return it.\n\n \n\nExample 1:\n\nInput: intervals = [[1,3],[6,9]], newInterval = [2,5]\nOutput: [[1,5],[6,9]]\n\nExample 2:\n\nInput: intervals = [[1,2],[3,5],[6,7],[8,10],[12,16]], newInterval = [4,8]\nOutput: [[1,2],[3,10],[12,16]]\nExplanation: Because the new interval [4,8] overlaps with [3,5],[6,7],[8,10].\n\n \n\nConstraints:\n\n\t• `0 4`\n• `intervals[i].length == 2`\n• `0 i i 5`\n• `intervals` is sorted by `starti` in ascending order.\n• `newInterval.length == 2`\n• `0 5`",
      "descriptionHtml": "<p>You are given an array of non-overlapping intervals <code>intervals</code> where <code>intervals[i] = [start<sub>i</sub>, end<sub>i</sub>]</code> represent the start and the end of the <code>i<sup>th</sup></code> interval and <code>intervals</code> is sorted in ascending order by <code>start<sub>i</sub></code>. You are also given an interval <code>newInterval = [start, end]</code> that represents the start and end of another interval.</p>\n\n<p>Insert <code>newInterval</code> into <code>intervals</code> such that <code>intervals</code> is still sorted in ascending order by <code>start<sub>i</sub></code> and <code>intervals</code> still does not have any overlapping intervals (merge overlapping intervals if necessary).</p>\n\n<p>Return <code>intervals</code><em> after the insertion</em>.</p>\n\n<p><strong>Note</strong> that you don&#39;t need to modify <code>intervals</code> in-place. You can make a new array and return it.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> intervals = [[1,3],[6,9]], newInterval = [2,5]\n<strong>Output:</strong> [[1,5],[6,9]]\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> intervals = [[1,2],[3,5],[6,7],[8,10],[12,16]], newInterval = [4,8]\n<strong>Output:</strong> [[1,2],[3,10],[12,16]]\n<strong>Explanation:</strong> Because the new interval [4,8] overlaps with [3,5],[6,7],[8,10].\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>0 &lt;= intervals.length &lt;= 10<sup>4</sup></code></li>\n\t<li><code>intervals[i].length == 2</code></li>\n\t<li><code>0 &lt;= start<sub>i</sub> &lt;= end<sub>i</sub> &lt;= 10<sup>5</sup></code></li>\n\t<li><code>intervals</code> is sorted by <code>start<sub>i</sub></code> in <strong>ascending</strong> order.</li>\n\t<li><code>newInterval.length == 2</code></li>\n\t<li><code>0 &lt;= start &lt;= end &lt;= 10<sup>5</sup></code></li>\n</ul>\n",
      "lcSlug": "insert-interval",
      "summary": "Insert interval — state invariant, then loop."
    },
    {
      "id": "so-16",
      "title": "Relative Sort Array",
      "lc": 1122,
      "importance": "nice",
      "subtopic": "counting",
      "difficulty": "Easy",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "arr1,arr2",
          "out": "relative sort"
        }
      ],
      "approaches": [
        {
          "name": "Counting relative sort",
          "time": "O(n+m)",
          "space": "O(m)",
          "code": "vector<int> relativeSortArray(vector<int>& arr1, vector<int>& arr2) {\n    map<int,int> order; for(int i=0;i<(int)arr2.size();i++) order[arr2[i]]=i;\n    vector<int> cnt(1001), extra;\n    for(int x: arr1) if(order.count(x)) cnt[x]++; else extra.push_back(x);\n    sort(extra.begin(), extra.end());\n    vector<int> ans; int ei=0;\n    for(int x: arr2) while(cnt[x]--) ans.push_back(x);\n    for(int x: extra) ans.push_back(x);\n    return ans;\n}"
        }
      ],
      "description": "Given two arrays `arr1` and `arr2`, the elements of `arr2` are distinct, and all elements in `arr2` are also in `arr1`.\n\nSort the elements of `arr1` such that the relative ordering of items in `arr1` are the same as in `arr2`. Elements that do not appear in `arr2` should be placed at the end of `arr1` in ascending order.\n\n \n\nExample 1:\n\nInput: arr1 = [2,3,1,3,2,4,6,7,9,2,19], arr2 = [2,1,4,3,9,6]\nOutput: [2,2,2,1,4,3,3,9,6,7,19]\n\nExample 2:\n\nInput: arr1 = [28,6,22,8,44,17], arr2 = [22,28,8,6]\nOutput: [22,28,8,6,17,44]\n\n \n\nConstraints:\n\n\t• `1",
      "descriptionHtml": "<p>Given two arrays <code>arr1</code> and <code>arr2</code>, the elements of <code>arr2</code> are distinct, and all elements in <code>arr2</code> are also in <code>arr1</code>.</p>\n\n<p>Sort the elements of <code>arr1</code> such that the relative ordering of items in <code>arr1</code> are the same as in <code>arr2</code>. Elements that do not appear in <code>arr2</code> should be placed at the end of <code>arr1</code> in <strong>ascending</strong> order.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> arr1 = [2,3,1,3,2,4,6,7,9,2,19], arr2 = [2,1,4,3,9,6]\n<strong>Output:</strong> [2,2,2,1,4,3,3,9,6,7,19]\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> arr1 = [28,6,22,8,44,17], arr2 = [22,28,8,6]\n<strong>Output:</strong> [22,28,8,6,17,44]\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= arr1.length, arr2.length &lt;= 1000</code></li>\n\t<li><code>0 &lt;= arr1[i], arr2[i] &lt;= 1000</code></li>\n\t<li>All the elements of <code>arr2</code> are <strong>distinct</strong>.</li>\n\t<li>Each&nbsp;<code>arr2[i]</code> is in <code>arr1</code>.</li>\n</ul>\n",
      "lcSlug": "relative-sort-array",
      "summary": "Counting relative sort — state invariant, then loop."
    },
    {
      "id": "so-17",
      "title": "Sort Characters By Frequency",
      "lc": 451,
      "importance": "should",
      "subtopic": "bucket",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "s",
          "out": "sorted string"
        }
      ],
      "approaches": [
        {
          "name": "Bucket sort freq",
          "time": "O(n)",
          "space": "O(n)",
          "code": "string frequencySort(string s) {\n    int cnt[256] = {};\n    for (char ch : s) cnt[(unsigned char)ch]++;\n    vector<string> buckets(s.size()+1);\n    for (int i = 0; i < 256; i++) if (cnt[i]) buckets[cnt[i]] += string(cnt[i], (char)i);\n    string ans;\n    for (int f = s.size(); f >= 1; f--) ans += buckets[f];\n    return ans;\n}"
        }
      ],
      "description": "Given a string `s`, sort it in decreasing order based on the frequency of the characters. The frequency of a character is the number of times it appears in the string.\n\nReturn the sorted string. If there are multiple answers, return any of them.\n\n \n\nExample 1:\n\nInput: s = \"tree\"\nOutput: \"eert\"\nExplanation: 'e' appears twice while 'r' and 't' both appear once.\nSo 'e' must appear before both 'r' and 't'. Therefore \"eetr\" is also a valid answer.\n\nExample 2:\n\nInput: s = \"cccaaa\"\nOutput: \"aaaccc\"\nExplanation: Both 'c' and 'a' appear three times, so both \"cccaaa\" and \"aaaccc\" are valid answers.\nNote that \"cacaca\" is incorrect, as the same characters must be together.\n\nExample 3:\n\nInput: s = \"Aabb\"\nOutput: \"bbAa\"\nExplanation: \"bbaA\" is also a valid answer, but \"Aabb\" is incorrect.\nNote that 'A' and 'a' are treated as two different characters.\n\n \n\nConstraints:\n\n\t• `1 5`\n• `s` consists of uppercase and lowercase English letters and digits.",
      "descriptionHtml": "<p>Given a string <code>s</code>, sort it in <strong>decreasing order</strong> based on the <strong>frequency</strong> of the characters. The <strong>frequency</strong> of a character is the number of times it appears in the string.</p>\n\n<p>Return <em>the sorted string</em>. If there are multiple answers, return <em>any of them</em>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> s = &quot;tree&quot;\n<strong>Output:</strong> &quot;eert&quot;\n<strong>Explanation:</strong> &#39;e&#39; appears twice while &#39;r&#39; and &#39;t&#39; both appear once.\nSo &#39;e&#39; must appear before both &#39;r&#39; and &#39;t&#39;. Therefore &quot;eetr&quot; is also a valid answer.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> s = &quot;cccaaa&quot;\n<strong>Output:</strong> &quot;aaaccc&quot;\n<strong>Explanation:</strong> Both &#39;c&#39; and &#39;a&#39; appear three times, so both &quot;cccaaa&quot; and &quot;aaaccc&quot; are valid answers.\nNote that &quot;cacaca&quot; is incorrect, as the same characters must be together.\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> s = &quot;Aabb&quot;\n<strong>Output:</strong> &quot;bbAa&quot;\n<strong>Explanation:</strong> &quot;bbaA&quot; is also a valid answer, but &quot;Aabb&quot; is incorrect.\nNote that &#39;A&#39; and &#39;a&#39; are treated as two different characters.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= s.length &lt;= 5 * 10<sup>5</sup></code></li>\n\t<li><code>s</code> consists of uppercase and lowercase English letters and digits.</li>\n</ul>\n",
      "lcSlug": "sort-characters-by-frequency",
      "summary": "Bucket sort freq — state invariant, then loop."
    },
    {
      "id": "so-18",
      "title": "Custom Sort String",
      "lc": 791,
      "importance": "nice",
      "subtopic": "counting",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "order,str",
          "out": "permutation"
        }
      ],
      "approaches": [
        {
          "name": "Order map",
          "time": "O(n)",
          "space": "O(1)",
          "code": "string customSortString(string order, string s) {\n    int rank[26]={}; for(int i=0;i<(int)order.size();i++) rank[order[i]-'a']=i+1;\n    sort(s.begin(), s.end(), [&](char a,char b){ return rank[a-'a']<rank[b-'a']; });\n    return s;\n}"
        }
      ],
      "description": "You are given two strings `order` and `s`. All the characters of `order` are unique and were sorted in some custom order previously.\n\nPermute the characters of `s` so that they match the order that `order` was sorted. More specifically, if a character `x` occurs before a character `y` in `order`, then `x` should occur before `y` in the permuted string.\n\nReturn any permutation of `s` that satisfies this property.\n\n \n\nExample 1:\n\nInput:   order = \"cba\", s = \"abcd\" \n\nOutput:   \"cbad\" \n\nExplanation:  `\"a\"`, `\"b\"`, `\"c\"` appear in order, so the order of `\"a\"`, `\"b\"`, `\"c\"` should be `\"c\"`, `\"b\"`, and `\"a\"`.\n\nSince `\"d\"` does not appear in `order`, it can be at any position in the returned string. `\"dcba\"`, `\"cdba\"`, `\"cbda\"` are also valid outputs.\n\nExample 2:\n\nInput:   order = \"bcafg\", s = \"abcd\" \n\nOutput:   \"bcad\" \n\nExplanation:  The characters `\"b\"`, `\"c\"`, and `\"a\"` from `order` dictate the order for the characters in `s`. The character `\"d\"` in `s` does not appear in `order`, so its position is flexible.\n\nFollowing the order of appearance in `order`, `\"b\"`, `\"c\"`, and `\"a\"` from `s` should be arranged as `\"b\"`, `\"c\"`, `\"a\"`. `\"d\"` can be placed at any position since it's not in order. The output `\"bcad\"` correctly follows this rule. Other arrangements like `\"dbca\"` or `\"bcda\"` would also be valid, as long as `\"b\"`, `\"c\"`, `\"a\"` maintain their order.\n\n \n\nConstraints:\n\n\t• `1",
      "descriptionHtml": "<p>You are given two strings <code>order</code> and <code>s</code>. All the characters of <code>order</code> are <strong>unique</strong> and were sorted in some custom order previously.</p>\n\n<p>Permute the characters of <code>s</code> so that they match the order that <code>order</code> was sorted. More specifically, if a character <code>x</code> occurs before a character <code>y</code> in <code>order</code>, then <code>x</code> should occur before <code>y</code> in the permuted string.</p>\n\n<p>Return <em>any permutation of </em><code>s</code><em> that satisfies this property</em>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<div class=\"example-block\" style=\"border-color: var(--border-tertiary); border-left-width: 2px; color: var(--text-secondary); font-size: .875rem; margin-bottom: 1rem; margin-top: 1rem; overflow: visible; padding-left: 1rem;\">\n<p><strong>Input: </strong> <span class=\"example-io\" style=\"font-family: Menlo,sans-serif; font-size: 0.85rem;\"> order = &quot;cba&quot;, s = &quot;abcd&quot; </span></p>\n\n<p><strong>Output: </strong> <span class=\"example-io\" style=\"font-family: Menlo,sans-serif; font-size: 0.85rem;\"> &quot;cbad&quot; </span></p>\n\n<p><strong>Explanation: </strong> <code>&quot;a&quot;</code>, <code>&quot;b&quot;</code>, <code>&quot;c&quot;</code> appear in order, so the order of <code>&quot;a&quot;</code>, <code>&quot;b&quot;</code>, <code>&quot;c&quot;</code> should be <code>&quot;c&quot;</code>, <code>&quot;b&quot;</code>, and <code>&quot;a&quot;</code>.</p>\n\n<p>Since <code>&quot;d&quot;</code> does not appear in <code>order</code>, it can be at any position in the returned string. <code>&quot;dcba&quot;</code>, <code>&quot;cdba&quot;</code>, <code>&quot;cbda&quot;</code> are also valid outputs.</p>\n</div>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<div class=\"example-block\" style=\"border-color: var(--border-tertiary); border-left-width: 2px; color: var(--text-secondary); font-size: .875rem; margin-bottom: 1rem; margin-top: 1rem; overflow: visible; padding-left: 1rem;\">\n<p><strong>Input: </strong> <span class=\"example-io\" style=\"font-family: Menlo,sans-serif; font-size: 0.85rem;\"> order = &quot;bcafg&quot;, s = &quot;abcd&quot; </span></p>\n\n<p><strong>Output: </strong> <span class=\"example-io\" style=\"font-family: Menlo,sans-serif; font-size: 0.85rem;\"> &quot;bcad&quot; </span></p>\n\n<p><strong>Explanation: </strong> The characters <code>&quot;b&quot;</code>, <code>&quot;c&quot;</code>, and <code>&quot;a&quot;</code> from <code>order</code> dictate the order for the characters in <code>s</code>. The character <code>&quot;d&quot;</code> in <code>s</code> does not appear in <code>order</code>, so its position is flexible.</p>\n\n<p>Following the order of appearance in <code>order</code>, <code>&quot;b&quot;</code>, <code>&quot;c&quot;</code>, and <code>&quot;a&quot;</code> from <code>s</code> should be arranged as <code>&quot;b&quot;</code>, <code>&quot;c&quot;</code>, <code>&quot;a&quot;</code>. <code>&quot;d&quot;</code> can be placed at any position since it&#39;s not in order. The output <code>&quot;bcad&quot;</code> correctly follows this rule. Other arrangements like <code>&quot;dbca&quot;</code> or <code>&quot;bcda&quot;</code> would also be valid, as long as <code>&quot;b&quot;</code>, <code>&quot;c&quot;</code>, <code>&quot;a&quot;</code> maintain their order.</p>\n</div>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= order.length &lt;= 26</code></li>\n\t<li><code>1 &lt;= s.length &lt;= 200</code></li>\n\t<li><code>order</code> and <code>s</code> consist of lowercase English letters.</li>\n\t<li>All the characters of <code>order</code> are <strong>unique</strong>.</li>\n</ul>\n",
      "lcSlug": "custom-sort-string",
      "summary": "Order map — state invariant, then loop."
    },
    {
      "id": "so-19",
      "title": "Minimum Number of Arrows",
      "lc": 452,
      "importance": "should",
      "subtopic": "sort",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "points",
          "out": "arrows"
        }
      ],
      "approaches": [
        {
          "name": "Greedy arrows",
          "time": "O(n log n)",
          "space": "O(1)",
          "code": "int findMinArrowShots(vector<vector<int>>& points) {\n    sort(points.begin(), points.end(), [](auto& a, auto& b){ return a[1] < b[1]; });\n    int ans = 0; long end = LLONG_MIN;\n    for (auto& p : points) {\n        if (p[0] > end) { ans++; end = p[1]; }\n    }\n    return ans;\n}"
        }
      ],
      "description": "There are some spherical balloons taped onto a flat wall that represents the XY-plane. The balloons are represented as a 2D integer array `points` where `points[i] = [xstart, xend]` denotes a balloon whose horizontal diameter stretches between `xstart` and `xend`. You do not know the exact y-coordinates of the balloons.\n\nArrows can be shot up directly vertically (in the positive y-direction) from different points along the x-axis. A balloon with `xstart` and `xend` is burst by an arrow shot at `x` if `xstart end`. There is no limit to the number of arrows that can be shot. A shot arrow keeps traveling up infinitely, bursting any balloons in its path.\n\nGiven the array `points`, return the minimum number of arrows that must be shot to burst all balloons.\n\n \n\nExample 1:\n\nInput: points = [[10,16],[2,8],[1,6],[7,12]]\nOutput: 2\nExplanation: The balloons can be burst by 2 arrows:\n- Shoot an arrow at x = 6, bursting the balloons [2,8] and [1,6].\n- Shoot an arrow at x = 11, bursting the balloons [10,16] and [7,12].\n\nExample 2:\n\nInput: points = [[1,2],[3,4],[5,6],[7,8]]\nOutput: 4\nExplanation: One arrow needs to be shot for each balloon for a total of 4 arrows.\n\nExample 3:\n\nInput: points = [[1,2],[2,3],[3,4],[4,5]]\nOutput: 2\nExplanation: The balloons can be burst by 2 arrows:\n- Shoot an arrow at x = 2, bursting the balloons [1,2] and [2,3].\n- Shoot an arrow at x = 4, bursting the balloons [3,4] and [4,5].\n\n \n\nConstraints:\n\n\t• `1 5`\n• `points[i].length == 2`\n• `-231 start end 31 - 1`",
      "descriptionHtml": "<p>There are some spherical balloons taped onto a flat wall that represents the XY-plane. The balloons are represented as a 2D integer array <code>points</code> where <code>points[i] = [x<sub>start</sub>, x<sub>end</sub>]</code> denotes a balloon whose <strong>horizontal diameter</strong> stretches between <code>x<sub>start</sub></code> and <code>x<sub>end</sub></code>. You do not know the exact y-coordinates of the balloons.</p>\n\n<p>Arrows can be shot up <strong>directly vertically</strong> (in the positive y-direction) from different points along the x-axis. A balloon with <code>x<sub>start</sub></code> and <code>x<sub>end</sub></code> is <strong>burst</strong> by an arrow shot at <code>x</code> if <code>x<sub>start</sub> &lt;= x &lt;= x<sub>end</sub></code>. There is <strong>no limit</strong> to the number of arrows that can be shot. A shot arrow keeps traveling up infinitely, bursting any balloons in its path.</p>\n\n<p>Given the array <code>points</code>, return <em>the <strong>minimum</strong> number of arrows that must be shot to burst all balloons</em>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> points = [[10,16],[2,8],[1,6],[7,12]]\n<strong>Output:</strong> 2\n<strong>Explanation:</strong> The balloons can be burst by 2 arrows:\n- Shoot an arrow at x = 6, bursting the balloons [2,8] and [1,6].\n- Shoot an arrow at x = 11, bursting the balloons [10,16] and [7,12].\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> points = [[1,2],[3,4],[5,6],[7,8]]\n<strong>Output:</strong> 4\n<strong>Explanation:</strong> One arrow needs to be shot for each balloon for a total of 4 arrows.\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> points = [[1,2],[2,3],[3,4],[4,5]]\n<strong>Output:</strong> 2\n<strong>Explanation:</strong> The balloons can be burst by 2 arrows:\n- Shoot an arrow at x = 2, bursting the balloons [1,2] and [2,3].\n- Shoot an arrow at x = 4, bursting the balloons [3,4] and [4,5].\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= points.length &lt;= 10<sup>5</sup></code></li>\n\t<li><code>points[i].length == 2</code></li>\n\t<li><code>-2<sup>31</sup> &lt;= x<sub>start</sub> &lt; x<sub>end</sub> &lt;= 2<sup>31</sup> - 1</code></li>\n</ul>\n",
      "lcSlug": "minimum-number-of-arrows-to-burst-balloons",
      "summary": "Sort by end; shoot at end, skip overlapping — min arrows."
    },
    {
      "id": "so-20",
      "title": "Valid Triangle Number",
      "lc": 611,
      "importance": "nice",
      "subtopic": "sort",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums",
          "out": "count"
        }
      ],
      "approaches": [
        {
          "name": "Sort + two pointers",
          "time": "O(n^2)",
          "space": "O(1)",
          "code": "int triangleNumber(vector<int>& nums) {\n    sort(nums.begin(), nums.end()); int ans=0;\n    for(int i=0;i<(int)nums.size();i++){\n        int l=0, r=i-1;\n        while(l<r) if(nums[l]+nums[r]>nums[i]){ ans+=r-l; l++; } else r--;\n    } return ans;\n}"
        }
      ],
      "description": "Given an integer array `nums`, return the number of triplets chosen from the array that can make triangles if we take them as side lengths of a triangle.\n\n \n\nExample 1:\n\nInput: nums = [2,2,3,4]\nOutput: 3\nExplanation: Valid combinations are: \n2,3,4 (using the first 2)\n2,3,4 (using the second 2)\n2,2,3\n\nExample 2:\n\nInput: nums = [4,2,3,4]\nOutput: 4\n\n \n\nConstraints:\n\n\t• `1",
      "descriptionHtml": "<p>Given an integer array <code>nums</code>, return <em>the number of triplets chosen from the array that can make triangles if we take them as side lengths of a triangle</em>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [2,2,3,4]\n<strong>Output:</strong> 3\n<strong>Explanation:</strong> Valid combinations are: \n2,3,4 (using the first 2)\n2,3,4 (using the second 2)\n2,2,3\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [4,2,3,4]\n<strong>Output:</strong> 4\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= nums.length &lt;= 1000</code></li>\n\t<li><code>0 &lt;= nums[i] &lt;= 1000</code></li>\n</ul>\n",
      "lcSlug": "valid-triangle-number",
      "summary": "Sort first; l/r or fixed i + two pointers on rest."
    }
  ]
};
