window.PRACTICE_TOPIC = {
  "id": "dnc",
  "title": "Divide & Conquer",
  "expected_count": 18,
  "strategy": "<strong>Speed-run:</strong> Merge sort side effects (inversions); binary search on answer. Filter <em>Must do</em> first.",
  "subtopics": [
    {
      "id": "divide",
      "label": "D&C"
    },
    {
      "id": "merge-sort",
      "label": "Merge Sort"
    },
    {
      "id": "quickselect",
      "label": "Quick Select"
    },
    {
      "id": "binary-divide",
      "label": "Binary D&C"
    }
  ],
  "questions": [
    {
      "id": "dc-01",
      "title": "Pow(x, n)",
      "lc": 50,
      "importance": "must",
      "subtopic": "divide",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "x,n",
          "out": "power"
        }
      ],
      "approaches": [
        {
          "name": "Fast pow",
          "time": "O(log n)",
          "space": "O(1)",
          "code": "double myPow(double x, int n) {\n    long long N = n; if (N < 0) { x = 1/x; N = -N; }\n    double ans = 1, cur = x;\n    while (N) { if (N&1) ans *= cur; cur *= cur; N >>= 1; }\n    return ans;\n}"
        }
      ],
      "description": "Implement pow(x, n), which calculates `x` raised to the power `n` (i.e., `xn`).\n\n \n\nExample 1:\n\nInput: x = 2.00000, n = 10\nOutput: 1024.00000\n\nExample 2:\n\nInput: x = 2.10000, n = 3\nOutput: 9.26100\n\nExample 3:\n\nInput: x = 2.00000, n = -2\nOutput: 0.25000\nExplanation: 2-2 = 1/22 = 1/4 = 0.25\n\n \n\nConstraints:\n\n\t• `-100.0 31 31-1`\n• `n` is an integer.\n• Either `x` is not zero or `n > 0`.\n• `-104 n 4`",
      "descriptionHtml": "<p>Implement <a href=\"http://www.cplusplus.com/reference/valarray/pow/\" target=\"_blank\">pow(x, n)</a>, which calculates <code>x</code> raised to the power <code>n</code> (i.e., <code>x<sup>n</sup></code>).</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> x = 2.00000, n = 10\n<strong>Output:</strong> 1024.00000\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> x = 2.10000, n = 3\n<strong>Output:</strong> 9.26100\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> x = 2.00000, n = -2\n<strong>Output:</strong> 0.25000\n<strong>Explanation:</strong> 2<sup>-2</sup> = 1/2<sup>2</sup> = 1/4 = 0.25\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>-100.0 &lt; x &lt; 100.0</code></li>\n\t<li><code>-2<sup>31</sup> &lt;= n &lt;= 2<sup>31</sup>-1</code></li>\n\t<li><code>n</code> is an integer.</li>\n\t<li>Either <code>x</code> is not zero or <code>n &gt; 0</code>.</li>\n\t<li><code>-10<sup>4</sup> &lt;= x<sup>n</sup> &lt;= 10<sup>4</sup></code></li>\n</ul>\n",
      "lcSlug": "powx-n",
      "summary": "Fast pow — state invariant, then loop."
    },
    {
      "id": "dc-02",
      "title": "Maximum Subarray",
      "lc": 53,
      "importance": "must",
      "subtopic": "divide",
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
      "id": "dc-03",
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
      "id": "dc-04",
      "title": "Count of Smaller After Self",
      "lc": 315,
      "importance": "must",
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
      "id": "dc-05",
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
      "id": "dc-06",
      "title": "Count of Range Sum",
      "lc": 327,
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
          "name": "Merge sort count",
          "time": "O(n log n)",
          "space": "O(n)",
          "code": "int countRangeSum(vector<int>& nums, int lower, int upper) {\n    long ans = 0; vector<long> pre(nums.size()+1, 0);\n    for (int i = 0; i < (int)nums.size(); i++) pre[i+1] = pre[i] + nums[i];\n    function<void(int,int)> sortMerge = [&](int l, int r) {\n        if (l >= r) return;\n        int m = l + (r-l)/2; sortMerge(l,m); sortMerge(m+1,r);\n        int j = m+1, k = m+1;\n        for (int i = l; i <= m; i++) {\n            while (j <= r && pre[j]-pre[i] < lower) j++;\n            while (k <= r && pre[k]-pre[i] <= upper) k++;\n            ans += k - j;\n        }\n        inplace_merge(pre.begin()+l, pre.begin()+m+1, pre.begin()+r+1);\n    };\n    sortMerge(0, (int)pre.size()-1); return (int)ans;\n}"
        }
      ],
      "description": "Given an integer array `nums` and two integers `lower` and `upper`, return the number of range sums that lie in `[lower, upper]` inclusive.\n\nRange sum `S(i, j)` is defined as the sum of the elements in `nums` between indices `i` and `j` inclusive, where `i Example 1:\n\nInput: nums = [-2,5,-1], lower = -2, upper = 2\nOutput: 3\nExplanation: The three ranges are: [0,0], [2,2], and [0,2] and their respective sums are: -2, -1, 2.\n\nExample 2:\n\nInput: nums = [0], lower = 0, upper = 0\nOutput: 1\n\n \n\nConstraints:\n\n\t• `1 5`\n• `-231 31 - 1`\n• `-105 5`\n• The answer is guaranteed to fit in a 32-bit integer.",
      "descriptionHtml": "<p>Given an integer array <code>nums</code> and two integers <code>lower</code> and <code>upper</code>, return <em>the number of range sums that lie in</em> <code>[lower, upper]</code> <em>inclusive</em>.</p>\n\n<p>Range sum <code>S(i, j)</code> is defined as the sum of the elements in <code>nums</code> between indices <code>i</code> and <code>j</code> inclusive, where <code>i &lt;= j</code>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [-2,5,-1], lower = -2, upper = 2\n<strong>Output:</strong> 3\n<strong>Explanation:</strong> The three ranges are: [0,0], [2,2], and [0,2] and their respective sums are: -2, -1, 2.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [0], lower = 0, upper = 0\n<strong>Output:</strong> 1\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= nums.length &lt;= 10<sup>5</sup></code></li>\n\t<li><code>-2<sup>31</sup> &lt;= nums[i] &lt;= 2<sup>31</sup> - 1</code></li>\n\t<li><code>-10<sup>5</sup> &lt;= lower &lt;= upper &lt;= 10<sup>5</sup></code></li>\n\t<li>The answer is <strong>guaranteed</strong> to fit in a <strong>32-bit</strong> integer.</li>\n</ul>\n",
      "lcSlug": "count-of-range-sum",
      "summary": "Merge step counts cross inversions / valid pairs before merge."
    },
    {
      "id": "dc-07",
      "title": "Median of Two Sorted Arrays",
      "lc": 4,
      "importance": "must",
      "subtopic": "binary-divide",
      "difficulty": "Hard",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums1,nums2",
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
      "id": "dc-08",
      "title": "Search a 2D Matrix II",
      "lc": 240,
      "importance": "should",
      "subtopic": "divide",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "matrix,target",
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
      "id": "dc-09",
      "title": "Different Ways to Add Parentheses",
      "lc": 241,
      "importance": "nice",
      "subtopic": "divide",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "expression",
          "out": "results"
        }
      ],
      "approaches": [
        {
          "name": "Recursion + memo",
          "time": "O(4^n)",
          "space": "O(n)",
          "code": "vector<int> diffWaysToCompute(string exp) {\n    vector<int> ans;\n    for(int i=0;i<(int)exp.size();i++){\n        if(exp[i]=='+'||exp[i]=='-'||exp[i]=='*'){\n            auto L=diffWaysToCompute(exp.substr(0,i));\n            auto R=diffWaysToCompute(exp.substr(i+1));\n            for(int a:L) for(int b:R){\n                if(exp[i]=='+') ans.push_back(a+b);\n                else if(exp[i]=='-') ans.push_back(a-b);\n                else ans.push_back(a*b);\n            }\n        }\n    }\n    if(ans.empty()) ans.push_back(stoi(exp));\n    return ans;\n}"
        }
      ],
      "description": "Given a string `expression` of numbers and operators, return all possible results from computing all the different possible ways to group numbers and operators. You may return the answer in any order.\n\nThe test cases are generated such that the output values fit in a 32-bit integer and the number of different results does not exceed `104`.\n\n \n\nExample 1:\n\nInput: expression = \"2-1-1\"\nOutput: [0,2]\nExplanation:\n((2-1)-1) = 0 \n(2-(1-1)) = 2\n\nExample 2:\n\nInput: expression = \"2*3-4*5\"\nOutput: [-34,-14,-10,-10,10]\nExplanation:\n(2*(3-(4*5))) = -34 \n((2*3)-(4*5)) = -14 \n((2*(3-4))*5) = -10 \n(2*((3-4)*5)) = -10 \n(((2*3)-4)*5) = 10\n\n \n\nConstraints:\n\n\t• `1",
      "descriptionHtml": "<p>Given a string <code>expression</code> of numbers and operators, return <em>all possible results from computing all the different possible ways to group numbers and operators</em>. You may return the answer in <strong>any order</strong>.</p>\n\n<p>The test cases are generated such that the output values fit in a 32-bit integer and the number of different results does not exceed <code>10<sup>4</sup></code>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> expression = &quot;2-1-1&quot;\n<strong>Output:</strong> [0,2]\n<strong>Explanation:</strong>\n((2-1)-1) = 0 \n(2-(1-1)) = 2\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> expression = &quot;2*3-4*5&quot;\n<strong>Output:</strong> [-34,-14,-10,-10,10]\n<strong>Explanation:</strong>\n(2*(3-(4*5))) = -34 \n((2*3)-(4*5)) = -14 \n((2*(3-4))*5) = -10 \n(2*((3-4)*5)) = -10 \n(((2*3)-4)*5) = 10\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= expression.length &lt;= 20</code></li>\n\t<li><code>expression</code> consists of digits and the operator <code>&#39;+&#39;</code>, <code>&#39;-&#39;</code>, and <code>&#39;*&#39;</code>.</li>\n\t<li>All the integer values in the input expression are in the range <code>[0, 99]</code>.</li>\n\t<li>The integer values in the input expression do not have a leading <code>&#39;-&#39;</code> or <code>&#39;+&#39;</code> denoting the sign.</li>\n</ul>\n",
      "lcSlug": "different-ways-to-add-parentheses",
      "summary": "Recursion + memo — state invariant, then loop."
    },
    {
      "id": "dc-10",
      "title": "The Skyline Problem",
      "lc": 218,
      "importance": "nice",
      "subtopic": "divide",
      "difficulty": "Hard",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "buildings",
          "out": "skyline"
        }
      ],
      "approaches": [
        {
          "name": "Sweep line + multiset",
          "time": "O(n log n)",
          "space": "O(n)",
          "code": "vector<vector<int>> getSkyline(vector<vector<int>>& b) {\n    vector<pair<long long,int>> ev;\n    for(auto& x:b){ ev.push_back({x[0],-x[2]}); ev.push_back({x[1],x[2]}); }\n    sort(ev.begin(), ev.end());\n    multiset<int> hs={0}; map<int,int> cnt; vector<vector<int>> ans;\n    auto add=[&](int h){ if(++cnt[h]==1) hs.insert(h); };\n    auto rem=[&](int h){ if(--cnt[h]==0){ hs.erase(hs.find(h)); cnt.erase(h); } };\n    long long prev=0;\n    for(auto& e:ev){\n        if(e.second<0) add(-e.second); else rem(e.second);\n        long long cur=*hs.rbegin();\n        if(cur!=prev){ ans.push_back({(int)e.first,(int)cur}); prev=cur; }\n    } return ans;\n}"
        }
      ],
      "description": "A city's skyline is the outer contour of the silhouette formed by all the buildings in that city when viewed from a distance. Given the locations and heights of all the buildings, return the skyline formed by these buildings collectively.\n\nThe geometric information of each building is given in the array `buildings` where `buildings[i] = [lefti, righti, heighti]`:\n\n\t• `lefti` is the x coordinate of the left edge of the `ith` building.\n• `righti` is the x coordinate of the right edge of the `ith` building.\n• `heighti` is the height of the `ith` building.\n\nYou may assume all buildings are perfect rectangles grounded on an absolutely flat surface at height `0`.\n\nThe skyline should be represented as a list of \"key points\" sorted by their x-coordinate in the form `[[x1,y1],[x2,y2],...]`. Each key point is the left endpoint of some horizontal segment in the skyline except the last point in the list, which always has a y-coordinate `0` and is used to mark the skyline's termination where the rightmost building ends. Any ground between the leftmost and rightmost buildings should be part of the skyline's contour.\n\nNote: There must be no consecutive horizontal lines of equal height in the output skyline. For instance, `[...,[2 3],[4 5],[7 5],[11 5],[12 7],...]` is not acceptable; the three lines of height 5 should be merged into one in the final output as such: `[...,[2 3],[4 5],[12 7],...]`\n\n \n\nExample 1:\n\nInput: buildings = [[2,9,10],[3,7,15],[5,12,12],[15,20,10],[19,24,8]]\nOutput: [[2,10],[3,15],[7,12],[12,0],[15,10],[20,8],[24,0]]\nExplanation:\nFigure A shows the buildings of the input.\nFigure B shows the skyline formed by those buildings. The red points in figure B represent the key points in the output list.\n\nExample 2:\n\nInput: buildings = [[0,2,3],[2,5,3]]\nOutput: [[0,3],[5,0]]\n\n \n\nConstraints:\n\n\t• `1 4`\n• `0 i i 31 - 1`\n• `1 i 31 - 1`\n• `buildings` is sorted by `lefti` in non-decreasing order.",
      "descriptionHtml": "<p>A city&#39;s <strong>skyline</strong> is the outer contour of the silhouette formed by all the buildings in that city when viewed from a distance. Given the locations and heights of all the buildings, return <em>the <strong>skyline</strong> formed by these buildings collectively</em>.</p>\n\n<p>The geometric information of each building is given in the array <code>buildings</code> where <code>buildings[i] = [left<sub>i</sub>, right<sub>i</sub>, height<sub>i</sub>]</code>:</p>\n\n<ul>\n\t<li><code>left<sub>i</sub></code> is the x coordinate of the left edge of the <code>i<sup>th</sup></code> building.</li>\n\t<li><code>right<sub>i</sub></code> is the x coordinate of the right edge of the <code>i<sup>th</sup></code> building.</li>\n\t<li><code>height<sub>i</sub></code> is the height of the <code>i<sup>th</sup></code> building.</li>\n</ul>\n\n<p>You may assume all buildings are perfect rectangles grounded on an absolutely flat surface at height <code>0</code>.</p>\n\n<p>The <strong>skyline</strong> should be represented as a list of &quot;key points&quot; <strong>sorted by their x-coordinate</strong> in the form <code>[[x<sub>1</sub>,y<sub>1</sub>],[x<sub>2</sub>,y<sub>2</sub>],...]</code>. Each key point is the left endpoint of some horizontal segment in the skyline except the last point in the list, which always has a y-coordinate <code>0</code> and is used to mark the skyline&#39;s termination where the rightmost building ends. Any ground between the leftmost and rightmost buildings should be part of the skyline&#39;s contour.</p>\n\n<p><b>Note:</b> There must be no consecutive horizontal lines of equal height in the output skyline. For instance, <code>[...,[2 3],[4 5],[7 5],[11 5],[12 7],...]</code> is not acceptable; the three lines of height 5 should be merged into one in the final output as such: <code>[...,[2 3],[4 5],[12 7],...]</code></p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2020/12/01/merged.jpg\" style=\"width: 800px; height: 331px;\" />\n<pre>\n<strong>Input:</strong> buildings = [[2,9,10],[3,7,15],[5,12,12],[15,20,10],[19,24,8]]\n<strong>Output:</strong> [[2,10],[3,15],[7,12],[12,0],[15,10],[20,8],[24,0]]\n<strong>Explanation:</strong>\nFigure A shows the buildings of the input.\nFigure B shows the skyline formed by those buildings. The red points in figure B represent the key points in the output list.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> buildings = [[0,2,3],[2,5,3]]\n<strong>Output:</strong> [[0,3],[5,0]]\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= buildings.length &lt;= 10<sup>4</sup></code></li>\n\t<li><code>0 &lt;= left<sub>i</sub> &lt; right<sub>i</sub> &lt;= 2<sup>31</sup> - 1</code></li>\n\t<li><code>1 &lt;= height<sub>i</sub> &lt;= 2<sup>31</sup> - 1</code></li>\n\t<li><code>buildings</code> is sorted by <code>left<sub>i</sub></code> in&nbsp;non-decreasing order.</li>\n</ul>\n",
      "lcSlug": "the-skyline-problem",
      "summary": "Sweep line + multiset — state invariant, then loop."
    },
    {
      "id": "dc-11",
      "title": "Construct Quad Tree",
      "lc": 427,
      "importance": "nice",
      "subtopic": "divide",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "grid",
          "out": "tree"
        }
      ],
      "approaches": [
        {
          "name": "Quadtree divide",
          "time": "O(n)",
          "space": "O(log n)",
          "code": "class Node{ public: bool val; bool isLeaf; Node* topLeft,*topRight,*bottomLeft,*bottomRight;\n    Node(bool v,bool leaf):val(v),isLeaf(leaf),topLeft(nullptr),topRight(nullptr),bottomLeft(nullptr),bottomRight(nullptr){}\n    Node(){}\n};\nNode* build(vector<vector<int>>& g,int x,int y,int len){\n    if(len==1) return new Node(g[x][y],true);\n    int h=len/2;\n    auto tl=build(g,x,y,h), tr=build(g,x,y+h,h), bl=build(g,x+h,y,h), br=build(g,x+h,y+h,h);\n    if(tl->isLeaf&&tr->isLeaf&&bl->isLeaf&&br->isLeaf && tl->val==tr->val&&tr->val==bl->val&&bl->val==br->val)\n        return new Node(tl->val,true);\n    Node* root=new Node(false,false);\n    root->topLeft=tl; root->topRight=tr; root->bottomLeft=bl; root->bottomRight=br;\n    return root;\n}\nNode* construct(vector<vector<int>>& grid){ if(grid.empty()) return nullptr; return build(grid,0,0,grid.size()); }"
        }
      ],
      "description": "Given a `n * n` matrix `grid` of `0's` and `1's` only. We want to represent `grid` with a Quad-Tree.\n\nReturn the root of the Quad-Tree representing `grid`.\n\nA Quad-Tree is a tree data structure in which each internal node has exactly four children. Besides, each node has two attributes:\n\n\t• `val`: True if the node represents a grid of 1's or False if the node represents a grid of 0's. Notice that you can assign the `val` to True or False when `isLeaf` is False, and both are accepted in the answer.\n• `isLeaf`: True if the node is a leaf node on the tree or False if the node has four children.\n\nclass Node {\n    public boolean val;\n    public boolean isLeaf;\n    public Node topLeft;\n    public Node topRight;\n    public Node bottomLeft;\n    public Node bottomRight;\n}\n\nWe can construct a Quad-Tree from a two-dimensional area using the following steps:\n\n\t• If the current grid has the same value (i.e all `1's` or all `0's`) set `isLeaf` True and set `val` to the value of the grid and set the four children to Null and stop.\n• If the current grid has different values, set `isLeaf` to False and set `val` to any value and divide the current grid into four sub-grids as shown in the photo.\n• Recurse for each of the children with the proper sub-grid.\n\nIf you want to know more about the Quad-Tree, you can refer to the wiki.\n\nQuad-Tree format:\n\nYou don't need to read this section for solving the problem. This is only if you want to understand the output format here. The output represents the serialized format of a Quad-Tree using level order traversal, where `null` signifies a path terminator where no node exists below.\n\nIt is very similar to the serialization of the binary tree. The only difference is that the node is represented as a list `[isLeaf, val]`.\n\nIf the value of `isLeaf` or `val` is True we represent it as 1 in the list `[isLeaf, val]` and if the value of `isLeaf` or `val` is False we represent it as 0.\n\n \n\nExample 1:\n\nInput: grid = [[0,1],[1,0]]\nOutput: [[0,1],[1,0],[1,1],[1,1],[1,0]]\nExplanation: The explanation of this example is shown below:\nNotice that 0 represents False and 1 represents True in the photo representing the Quad-Tree.\n\nExample 2:\n\nInput: grid = [[1,1,1,1,0,0,0,0],[1,1,1,1,0,0,0,0],[1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1],[1,1,1,1,0,0,0,0],[1,1,1,1,0,0,0,0],[1,1,1,1,0,0,0,0],[1,1,1,1,0,0,0,0]]\nOutput: [[0,1],[1,1],[0,1],[1,1],[1,0],null,null,null,null,[1,0],[1,0],[1,1],[1,1]]\nExplanation: All values in the grid are not the same. We divide the grid into four sub-grids.\nThe topLeft, bottomLeft and bottomRight each has the same value.\nThe topRight have different values so we divide it into 4 sub-grids where each has the same value.\nExplanation is shown in the photo below:\n\n \n\nConstraints:\n\n\t• `n == grid.length == grid[i].length`\n• `n == 2x` where `0",
      "descriptionHtml": "<p>Given a <code>n * n</code> matrix <code>grid</code> of <code>0&#39;s</code> and <code>1&#39;s</code> only. We want to represent <code>grid</code> with a Quad-Tree.</p>\n\n<p>Return <em>the root of the Quad-Tree representing </em><code>grid</code>.</p>\n\n<p>A Quad-Tree is a tree data structure in which each internal node has exactly four children. Besides, each node has two attributes:</p>\n\n<ul>\n\t<li><code>val</code>: True if the node represents a grid of 1&#39;s or False if the node represents a grid of 0&#39;s. Notice that you can assign the <code>val</code> to True or False when <code>isLeaf</code> is False, and both are accepted in the answer.</li>\n\t<li><code>isLeaf</code>: True if the node is a leaf node on the tree or False if the node has four children.</li>\n</ul>\n\n<pre>\nclass Node {\n    public boolean val;\n    public boolean isLeaf;\n    public Node topLeft;\n    public Node topRight;\n    public Node bottomLeft;\n    public Node bottomRight;\n}</pre>\n\n<p>We can construct a Quad-Tree from a two-dimensional area using the following steps:</p>\n\n<ol>\n\t<li>If the current grid has the same value (i.e all <code>1&#39;s</code> or all <code>0&#39;s</code>) set <code>isLeaf</code> True and set <code>val</code> to the value of the grid and set the four children to Null and stop.</li>\n\t<li>If the current grid has different values, set <code>isLeaf</code> to False and set <code>val</code> to any value and divide the current grid into four sub-grids as shown in the photo.</li>\n\t<li>Recurse for each of the children with the proper sub-grid.</li>\n</ol>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2020/02/11/new_top.png\" style=\"width: 777px; height: 181px;\" />\n<p>If you want to know more about the Quad-Tree, you can refer to the <a href=\"https://en.wikipedia.org/wiki/Quadtree\">wiki</a>.</p>\n\n<p><strong>Quad-Tree format:</strong></p>\n\n<p>You don&#39;t need to read this section for solving the problem. This is only if you want to understand the output format here. The output represents the serialized format of a Quad-Tree using level order traversal, where <code>null</code> signifies a path terminator where no node exists below.</p>\n\n<p>It is very similar to the serialization of the binary tree. The only difference is that the node is represented as a list <code>[isLeaf, val]</code>.</p>\n\n<p>If the value of <code>isLeaf</code> or <code>val</code> is True we represent it as <strong>1</strong> in the list <code>[isLeaf, val]</code> and if the value of <code>isLeaf</code> or <code>val</code> is False we represent it as <strong>0</strong>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2020/02/11/grid1.png\" style=\"width: 777px; height: 99px;\" />\n<pre>\n<strong>Input:</strong> grid = [[0,1],[1,0]]\n<strong>Output:</strong> [[0,1],[1,0],[1,1],[1,1],[1,0]]\n<strong>Explanation:</strong> The explanation of this example is shown below:\nNotice that 0 represents False and 1 represents True in the photo representing the Quad-Tree.\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2020/02/12/e1tree.png\" style=\"width: 777px; height: 186px;\" />\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<p><img alt=\"\" src=\"https://assets.leetcode.com/uploads/2020/02/12/e2mat.png\" style=\"width: 777px; height: 343px;\" /></p>\n\n<pre>\n<strong>Input:</strong> grid = [[1,1,1,1,0,0,0,0],[1,1,1,1,0,0,0,0],[1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1],[1,1,1,1,0,0,0,0],[1,1,1,1,0,0,0,0],[1,1,1,1,0,0,0,0],[1,1,1,1,0,0,0,0]]\n<strong>Output:</strong> [[0,1],[1,1],[0,1],[1,1],[1,0],null,null,null,null,[1,0],[1,0],[1,1],[1,1]]\n<strong>Explanation:</strong> All values in the grid are not the same. We divide the grid into four sub-grids.\nThe topLeft, bottomLeft and bottomRight each has the same value.\nThe topRight have different values so we divide it into 4 sub-grids where each has the same value.\nExplanation is shown in the photo below:\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2020/02/12/e2tree.png\" style=\"width: 777px; height: 328px;\" />\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>n == grid.length == grid[i].length</code></li>\n\t<li><code>n == 2<sup>x</sup></code> where <code>0 &lt;= x &lt;= 6</code></li>\n</ul>\n",
      "lcSlug": "construct-quad-tree",
      "summary": "Quadtree divide — state invariant, then loop."
    },
    {
      "id": "dc-12",
      "title": "Merge k Sorted Lists",
      "lc": 23,
      "importance": "should",
      "subtopic": "divide",
      "difficulty": "Hard",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "lists",
          "out": "merged"
        }
      ],
      "approaches": [
        {
          "name": "Merge k lists",
          "time": "O(N log k)",
          "space": "O(k)",
          "code": "ListNode* mergeKLists(vector<ListNode*>& lists) {\n    auto cmp = [](ListNode* a, ListNode* b){ return a->val > b->val; };\n    priority_queue<ListNode*, vector<ListNode*>, decltype(cmp)> pq(cmp);\n    for (auto h: lists) if (h) pq.push(h);\n    ListNode dummy, *tail=&dummy;\n    while (!pq.empty()) { auto u=pq.top(); pq.pop(); tail->next=u; tail=u; if (u->next) pq.push(u->next); }\n    return dummy.next;\n}"
        }
      ],
      "description": "You are given an array of `k` linked-lists `lists`, each linked-list is sorted in ascending order.\n\nMerge all the linked-lists into one sorted linked-list and return it.\n\n \n\nExample 1:\n\nInput: lists = [[1,4,5],[1,3,4],[2,6]]\nOutput: [1,1,2,3,4,4,5,6]\nExplanation: The linked-lists are:\n[\n  1->4->5,\n  1->3->4,\n  2->6\n]\nmerging them into one sorted linked list:\n1->1->2->3->4->4->5->6\n\nExample 2:\n\nInput: lists = []\nOutput: []\n\nExample 3:\n\nInput: lists = [[]]\nOutput: []\n\n \n\nConstraints:\n\n\t• `k == lists.length`\n• `0 4`\n• `0 4 4`\n• `lists[i]` is sorted in ascending order.\n• The sum of `lists[i].length` will not exceed `104`.",
      "descriptionHtml": "<p>You are given an array of <code>k</code> linked-lists <code>lists</code>, each linked-list is sorted in ascending order.</p>\n\n<p><em>Merge all the linked-lists into one sorted linked-list and return it.</em></p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> lists = [[1,4,5],[1,3,4],[2,6]]\n<strong>Output:</strong> [1,1,2,3,4,4,5,6]\n<strong>Explanation:</strong> The linked-lists are:\n[\n  1-&gt;4-&gt;5,\n  1-&gt;3-&gt;4,\n  2-&gt;6\n]\nmerging them into one sorted linked list:\n1-&gt;1-&gt;2-&gt;3-&gt;4-&gt;4-&gt;5-&gt;6\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> lists = []\n<strong>Output:</strong> []\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> lists = [[]]\n<strong>Output:</strong> []\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>k == lists.length</code></li>\n\t<li><code>0 &lt;= k &lt;= 10<sup>4</sup></code></li>\n\t<li><code>0 &lt;= lists[i].length &lt;= 500</code></li>\n\t<li><code>-10<sup>4</sup> &lt;= lists[i][j] &lt;= 10<sup>4</sup></code></li>\n\t<li><code>lists[i]</code> is sorted in <strong>ascending order</strong>.</li>\n\t<li>The sum of <code>lists[i].length</code> will not exceed <code>10<sup>4</sup></code>.</li>\n</ul>\n",
      "lcSlug": "merge-k-sorted-lists",
      "summary": "Merge k lists — state invariant, then loop."
    },
    {
      "id": "dc-13",
      "title": "Kth Largest in Array",
      "lc": 215,
      "importance": "should",
      "subtopic": "quickselect",
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
      "id": "dc-14",
      "title": "Majority Element",
      "lc": 169,
      "importance": "should",
      "subtopic": "divide",
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
      "id": "dc-15",
      "title": "Majority Element II",
      "lc": 229,
      "importance": "nice",
      "subtopic": "divide",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums",
          "out": "elements"
        }
      ],
      "approaches": [
        {
          "name": "Boyer-Moore general",
          "time": "O(n)",
          "space": "O(1)",
          "code": "vector<int> majorityElement(vector<int>& nums) {\n    int c1=0,c2=0,v1=0,v2=0;\n    for(int x:nums){\n        if(x==v1) c1++; else if(x==v2) c2++;\n        else if(!c1){ v1=x; c1=1; }\n        else if(!c2){ v2=x; c2=1; }\n        else { c1--; c2--; }\n    }\n    c1=c2=0; for(int x:nums){ if(x==v1) c1++; else if(x==v2) c2++; }\n    vector<int> ans; int n=nums.size();\n    if(c1>n/3) ans.push_back(v1); if(c2>n/3) ans.push_back(v2);\n    return ans;\n}"
        }
      ],
      "description": "Given an integer array of size `n`, find all elements that appear more than `&lfloor; n/3 &rfloor;` times.\n\n \n\nExample 1:\n\nInput: nums = [3,2,3]\nOutput: [3]\n\nExample 2:\n\nInput: nums = [1]\nOutput: [1]\n\nExample 3:\n\nInput: nums = [1,2]\nOutput: [1,2]\n\n \n\nConstraints:\n\n\t• `1 4`\n• `-109 9`\n\n \n\nFollow up: Could you solve the problem in linear time and in `O(1)` space?",
      "descriptionHtml": "<p>Given an integer array of size <code>n</code>, find all elements that appear more than <code>&lfloor; n/3 &rfloor;</code> times.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [3,2,3]\n<strong>Output:</strong> [3]\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [1]\n<strong>Output:</strong> [1]\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [1,2]\n<strong>Output:</strong> [1,2]\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= nums.length &lt;= 5 * 10<sup>4</sup></code></li>\n\t<li><code>-10<sup>9</sup> &lt;= nums[i] &lt;= 10<sup>9</sup></code></li>\n</ul>\n\n<p>&nbsp;</p>\n<p><strong>Follow up:</strong> Could you solve the problem in linear time and in <code>O(1)</code> space?</p>\n",
      "lcSlug": "majority-element-ii",
      "summary": "Boyer-Moore general — state invariant, then loop."
    },
    {
      "id": "dc-16",
      "title": "Beautiful Array",
      "lc": 932,
      "importance": "nice",
      "subtopic": "divide",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "n",
          "out": "array"
        }
      ],
      "approaches": [
        {
          "name": "Divide construct",
          "time": "O(n)",
          "space": "O(n)",
          "code": "vector<int> beautifulArray(int n) {\n    vector<int> ans={1};\n    while((int)ans.size()<n){\n        vector<int> nxt;\n        for(int x:ans){ if(2*x-1<=n) nxt.push_back(2*x-1); }\n        for(int x:ans){ if(2*x<=n) nxt.push_back(2*x); }\n        ans.swap(nxt);\n    } return ans;\n}"
        }
      ],
      "description": "An array `nums` of length `n` is beautiful if:\n\n\t• `nums` is a permutation of the integers in the range `[1, n]`.\n• For every `0 \n\nGiven the integer `n`, return any beautiful array `nums` of length `n`. There will be at least one valid answer for the given `n`.\n\n \n\nExample 1:\n\nInput: n = 4\nOutput: [2,1,4,3]\n\nExample 2:\n\nInput: n = 5\nOutput: [3,1,2,5,4]\n\n \n\nConstraints:\n\n\t• `1",
      "descriptionHtml": "<p>An array <code>nums</code> of length <code>n</code> is <strong>beautiful</strong> if:</p>\n\n<ul>\n\t<li><code>nums</code> is a permutation of the integers in the range <code>[1, n]</code>.</li>\n\t<li>For every <code>0 &lt;= i &lt; j &lt; n</code>, there is no index <code>k</code> with <code>i &lt; k &lt; j</code> where <code>2 * nums[k] == nums[i] + nums[j]</code>.</li>\n</ul>\n\n<p>Given the integer <code>n</code>, return <em>any <strong>beautiful</strong> array </em><code>nums</code><em> of length </em><code>n</code>. There will be at least one valid answer for the given <code>n</code>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<pre><strong>Input:</strong> n = 4\n<strong>Output:</strong> [2,1,4,3]\n</pre><p><strong class=\"example\">Example 2:</strong></p>\n<pre><strong>Input:</strong> n = 5\n<strong>Output:</strong> [3,1,2,5,4]\n</pre>\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= n &lt;= 1000</code></li>\n</ul>\n",
      "lcSlug": "beautiful-array",
      "summary": "Divide construct — state invariant, then loop."
    },
    {
      "id": "dc-17",
      "title": "Predict the Winner",
      "lc": 486,
      "importance": "nice",
      "subtopic": "divide",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums",
          "out": "predict?"
        }
      ],
      "approaches": [
        {
          "name": "Minimax DP",
          "time": "O(n^2)",
          "space": "O(n)",
          "code": "bool PredictTheWinner(vector<int>& nums) {\n    int n=nums.size(); vector<vector<int>> dp(n, vector<int>(n));\n    for(int i=0;i<n;i++) dp[i][i]=nums[i];\n    for(int len=2; len<=n; len++)\n        for(int l=0; l+len-1<n; l++){\n            int r=l+len-1;\n            dp[l][r]=max(nums[l]-dp[l+1][r], nums[r]-dp[l][r-1]);\n        }\n    return dp[0][n-1]>=0;\n}"
        }
      ],
      "description": "You are given an integer array `nums`. Two players are playing a game with this array: player 1 and player 2.\n\nPlayer 1 and player 2 take turns, with player 1 starting first. Both players start the game with a score of `0`. At each turn, the player takes one of the numbers from either end of the array (i.e., `nums[0]` or `nums[nums.length - 1]`) which reduces the size of the array by `1`. The player adds the chosen number to their score. The game ends when there are no more elements in the array.\n\nReturn `true` if Player 1 can win the game. If the scores of both players are equal, then player 1 is still the winner, and you should also return `true`. You may assume that both players are playing optimally.\n\n \n\nExample 1:\n\nInput: nums = [1,5,2]\nOutput: false\nExplanation: Initially, player 1 can choose between 1 and 2. \nIf he chooses 2 (or 1), then player 2 can choose from 1 (or 2) and 5. If player 2 chooses 5, then player 1 will be left with 1 (or 2). \nSo, final score of player 1 is 1 + 2 = 3, and player 2 is 5. \nHence, player 1 will never be the winner and you need to return false.\n\nExample 2:\n\nInput: nums = [1,5,233,7]\nOutput: true\nExplanation: Player 1 first chooses 1. Then player 2 has to choose between 5 and 7. No matter which number player 2 choose, player 1 can choose 233.\nFinally, player 1 has more score (234) than player 2 (12), so you need to return True representing player1 can win.\n\n \n\nConstraints:\n\n\t• `1 7`",
      "descriptionHtml": "<p>You are given an integer array <code>nums</code>. Two players are playing a game with this array: player 1 and player 2.</p>\n\n<p>Player 1 and player 2 take turns, with player 1 starting first. Both players start the game with a score of <code>0</code>. At each turn, the player takes one of the numbers from either end of the array (i.e., <code>nums[0]</code> or <code>nums[nums.length - 1]</code>) which reduces the size of the array by <code>1</code>. The player adds the chosen number to their score. The game ends when there are no more elements in the array.</p>\n\n<p>Return <code>true</code> if Player 1 can win the game. If the scores of both players are equal, then player 1 is still the winner, and you should also return <code>true</code>. You may assume that both players are playing optimally.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [1,5,2]\n<strong>Output:</strong> false\n<strong>Explanation:</strong> Initially, player 1 can choose between 1 and 2. \nIf he chooses 2 (or 1), then player 2 can choose from 1 (or 2) and 5. If player 2 chooses 5, then player 1 will be left with 1 (or 2). \nSo, final score of player 1 is 1 + 2 = 3, and player 2 is 5. \nHence, player 1 will never be the winner and you need to return false.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [1,5,233,7]\n<strong>Output:</strong> true\n<strong>Explanation:</strong> Player 1 first chooses 1. Then player 2 has to choose between 5 and 7. No matter which number player 2 choose, player 1 can choose 233.\nFinally, player 1 has more score (234) than player 2 (12), so you need to return True representing player1 can win.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= nums.length &lt;= 20</code></li>\n\t<li><code>0 &lt;= nums[i] &lt;= 10<sup>7</sup></code></li>\n</ul>\n",
      "lcSlug": "predict-the-winner",
      "summary": "Minimax DP — state invariant, then loop."
    },
    {
      "id": "dc-18",
      "title": "Burst Balloons",
      "lc": 312,
      "importance": "should",
      "subtopic": "divide",
      "difficulty": "Hard",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums",
          "out": "max coins"
        }
      ],
      "approaches": [
        {
          "name": "Interval DP",
          "time": "O(n^3)",
          "space": "O(n^2)",
          "code": "int maxCoins(vector<int>& nums) {\n    nums.insert(nums.begin(), 1); nums.push_back(1);\n    int n = nums.size(); vector<vector<int>> dp(n, vector<int>(n, 0));\n    for (int len = 3; len <= n; len++)\n        for (int l = 0; l + len - 1 < n; l++) {\n            int r = l + len - 1;\n            for (int k = l+1; k < r; k++)\n                dp[l][r] = max(dp[l][r], dp[l][k] + dp[k][r] + nums[l]*nums[k]*nums[r]);\n        }\n    return dp[0][n-1];\n}"
        }
      ],
      "description": "You are given `n` balloons, indexed from `0` to `n - 1`. Each balloon is painted with a number on it represented by an array `nums`. You are asked to burst all the balloons.\n\nIf you burst the `ith` balloon, you will get `nums[i - 1] * nums[i] * nums[i + 1]` coins. If `i - 1` or `i + 1` goes out of bounds of the array, then treat it as if there is a balloon with a `1` painted on it.\n\nReturn the maximum coins you can collect by bursting the balloons wisely.\n\n \n\nExample 1:\n\nInput: nums = [3,1,5,8]\nOutput: 167\nExplanation:\nnums = [3,1,5,8] --> [3,5,8] --> [3,8] --> [8] --> []\ncoins =  3*1*5    +   3*5*8   +  1*3*8  + 1*8*1 = 167\n\nExample 2:\n\nInput: nums = [1,5]\nOutput: 10\n\n \n\nConstraints:\n\n\t• `n == nums.length`\n• `1",
      "descriptionHtml": "<p>You are given <code>n</code> balloons, indexed from <code>0</code> to <code>n - 1</code>. Each balloon is painted with a number on it represented by an array <code>nums</code>. You are asked to burst all the balloons.</p>\n\n<p>If you burst the <code>i<sup>th</sup></code> balloon, you will get <code>nums[i - 1] * nums[i] * nums[i + 1]</code> coins. If <code>i - 1</code> or <code>i + 1</code> goes out of bounds of the array, then treat it as if there is a balloon with a <code>1</code> painted on it.</p>\n\n<p>Return <em>the maximum coins you can collect by bursting the balloons wisely</em>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [3,1,5,8]\n<strong>Output:</strong> 167\n<strong>Explanation:</strong>\nnums = [3,1,5,8] --&gt; [3,5,8] --&gt; [3,8] --&gt; [8] --&gt; []\ncoins =  3*1*5    +   3*5*8   +  1*3*8  + 1*8*1 = 167</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [1,5]\n<strong>Output:</strong> 10\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>n == nums.length</code></li>\n\t<li><code>1 &lt;= n &lt;= 300</code></li>\n\t<li><code>0 &lt;= nums[i] &lt;= 100</code></li>\n</ul>\n",
      "lcSlug": "burst-balloons",
      "summary": "dp[l][r] over subintervals — try split k, combine subproblems."
    }
  ]
};
