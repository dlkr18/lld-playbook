window.PRACTICE_TOPIC = {
  "id": "segment",
  "title": "Segment Tree & BIT",
  "expected_count": 16,
  "strategy": "<strong>Speed-run:</strong> Fenwick for point update + range sum; segment tree for range max/min. Filter <em>Must do</em> first.",
  "subtopics": [
    {
      "id": "fenwick",
      "label": "Fenwick BIT"
    },
    {
      "id": "segment",
      "label": "Segment Tree"
    },
    {
      "id": "lazy",
      "label": "Lazy Prop"
    },
    {
      "id": "bit",
      "label": "BIT Apps"
    }
  ],
  "questions": [
    {
      "id": "sg-01",
      "title": "Range Sum Query Mutable",
      "lc": 307,
      "importance": "must",
      "subtopic": "fenwick",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums, ops",
          "out": "sums"
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
      "id": "sg-02",
      "title": "Range Sum Query 2D Mutable",
      "lc": 308,
      "importance": "nice",
      "subtopic": "2d-bit",
      "difficulty": "Hard",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "matrix",
          "out": "sums"
        }
      ],
      "approaches": [
        {
          "name": "2D Fenwick",
          "time": "O(log mn)",
          "space": "O(mn)",
          "code": "class NumMatrix {\n    vector<vector<int>> bit, mat; int m,n;\n    void add(int i,int j,int d){ for(int x=i+1;x<=m;x+=x&-x) for(int y=j+1;y<=n;y+=y&-y) bit[x][y]+=d; }\n    int sum(int i,int j){ int s=0; for(int x=i+1;x>0;x-=x&-x) for(int y=j+1;y>0;y-=y&-y) s+=bit[x][y]; return s; }\npublic:\n    NumMatrix(vector<vector<int>>& matrix): mat(matrix){\n        m=matrix.size(); n=m?matrix[0].size():0; bit.assign(m+1, vector<int>(n+1));\n        for(int i=0;i<m;i++) for(int j=0;j<n;j++) add(i,j,matrix[i][j]);\n    }\n    void update(int row,int col,int val){ add(row,col,val-mat[row][col]); mat[row][col]=val; }\n    int sumRegion(int r1,int c1,int r2,int c2){ return sum(r2,c2)-sum(r1-1,c2)-sum(r2,c1-1)+sum(r1-1,c1-1); }\n};"
        }
      ],
      "description": "Given a 2D matrix `matrix`, handle multiple queries of the following types:\n\n\t• Update the value of a cell in `matrix`.\n• Calculate the sum of the elements of `matrix` inside the rectangle defined by its upper left corner `(row1, col1)` and lower right corner `(row2, col2)`.\n\nImplement the NumMatrix class:\n\n\t• `NumMatrix(int[][] matrix)` Initializes the object with the integer matrix `matrix`.\n• `void update(int row, int col, int val)` Updates the value of `matrix[row][col]` to be `val`.\n• `int sumRegion(int row1, int col1, int row2, int col2)` Returns the sum of the elements of `matrix` inside the rectangle defined by its upper left corner `(row1, col1)` and lower right corner `(row2, col2)`.\n\n&nbsp;\n\nExample 1:\n\nInput\n[\"NumMatrix\", \"sumRegion\", \"update\", \"sumRegion\"]\n[[[[3, 0, 1, 4, 2], [5, 6, 3, 2, 1], [1, 2, 0, 1, 5], [4, 1, 0, 1, 7], [1, 0, 3, 0, 5]]], [2, 1, 4, 3], [3, 2, 2], [2, 1, 4, 3]]\nOutput\n[null, 8, null, 10]\n\nExplanation\nNumMatrix numMatrix = new NumMatrix([[3, 0, 1, 4, 2], [5, 6, 3, 2, 1], [1, 2, 0, 1, 5], [4, 1, 0, 1, 7], [1, 0, 3, 0, 5]]);\nnumMatrix.sumRegion(2, 1, 4, 3); // return 8 (i.e. sum of the left red rectangle)\nnumMatrix.update(3, 2, 2); // matrix changes from left image to right image\nnumMatrix.sumRegion(2, 1, 4, 3); // return 10 (i.e. sum of the right red rectangle)\n\n&nbsp;\n\nConstraints:\n\n\t• `m == matrix.length`\n• `n == matrix[i].length`\n• `1",
      "descriptionHtml": "<p>Given a 2D matrix <code>matrix</code>, handle multiple queries of the following types:</p>\n\n<ol>\n\t<li><strong>Update</strong> the value of a cell in <code>matrix</code>.</li>\n\t<li>Calculate the <strong>sum</strong> of the elements of <code>matrix</code> inside the rectangle defined by its <strong>upper left corner</strong> <code>(row1, col1)</code> and <strong>lower right corner</strong> <code>(row2, col2)</code>.</li>\n</ol>\n\n<p>Implement the NumMatrix class:</p>\n\n<ul>\n\t<li><code>NumMatrix(int[][] matrix)</code> Initializes the object with the integer matrix <code>matrix</code>.</li>\n\t<li><code>void update(int row, int col, int val)</code> <strong>Updates</strong> the value of <code>matrix[row][col]</code> to be <code>val</code>.</li>\n\t<li><code>int sumRegion(int row1, int col1, int row2, int col2)</code> Returns the <strong>sum</strong> of the elements of <code>matrix</code> inside the rectangle defined by its <strong>upper left corner</strong> <code>(row1, col1)</code> and <strong>lower right corner</strong> <code>(row2, col2)</code>.</li>\n</ul>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://fastly.jsdelivr.net/gh/doocs/leetcode@main/solution/0300-0399/0308.Range%20Sum%20Query%202D%20-%20Mutable/images/summut-grid.jpg\" style=\"width: 500px; height: 222px;\" />\n<pre>\n<strong>Input</strong>\n[&quot;NumMatrix&quot;, &quot;sumRegion&quot;, &quot;update&quot;, &quot;sumRegion&quot;]\n[[[[3, 0, 1, 4, 2], [5, 6, 3, 2, 1], [1, 2, 0, 1, 5], [4, 1, 0, 1, 7], [1, 0, 3, 0, 5]]], [2, 1, 4, 3], [3, 2, 2], [2, 1, 4, 3]]\n<strong>Output</strong>\n[null, 8, null, 10]\n\n<strong>Explanation</strong>\nNumMatrix numMatrix = new NumMatrix([[3, 0, 1, 4, 2], [5, 6, 3, 2, 1], [1, 2, 0, 1, 5], [4, 1, 0, 1, 7], [1, 0, 3, 0, 5]]);\nnumMatrix.sumRegion(2, 1, 4, 3); // return 8 (i.e. sum of the left red rectangle)\nnumMatrix.update(3, 2, 2); // matrix changes from left image to right image\nnumMatrix.sumRegion(2, 1, 4, 3); // return 10 (i.e. sum of the right red rectangle)\n\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>m == matrix.length</code></li>\n\t<li><code>n == matrix[i].length</code></li>\n\t<li><code>1 <= m, n <= 200</code></li>\n\t<li><code>-1000 <= matrix[i][j] <= 1000</code></li>\n\t<li><code>0 <= row < m</code></li>\n\t<li><code>0 <= col < n</code></li>\n\t<li><code>-1000 <= val <= 1000</code></li>\n\t<li><code>0 <= row1 <= row2 < m</code></li>\n\t<li><code>0 <= col1 <= col2 < n</code></li>\n\t<li>At most <code>5000</code> calls will be made to <code>sumRegion</code> and <code>update</code>.</li>\n</ul>",
      "lcSlug": "range-sum-query-2d-mutable",
      "summary": "2D Fenwick — state invariant, then loop."
    },
    {
      "id": "sg-03",
      "title": "Count of Smaller After Self",
      "lc": 315,
      "importance": "should",
      "subtopic": "bit",
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
      "id": "sg-04",
      "title": "Count of Range Sum",
      "lc": 327,
      "importance": "should",
      "subtopic": "merge-bit",
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
      "id": "sg-05",
      "title": "Reverse Pairs",
      "lc": 493,
      "importance": "should",
      "subtopic": "merge-bit",
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
      "id": "sg-06",
      "title": "Falling Squares",
      "lc": 699,
      "importance": "nice",
      "subtopic": "segment",
      "difficulty": "Hard",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "positions",
          "out": "heights"
        }
      ],
      "approaches": [
        {
          "name": "Sweep + map heights",
          "time": "O(n log n)",
          "space": "O(n)",
          "code": "vector<int> fallingSquares(vector<vector<int>>& positions) {\n    map<int,int> height; height[0]=0; vector<int> ans; int cur=0;\n    for(auto& p: positions){\n        int l=p[0], r=p[0]+p[1];\n        int mx=0; auto it=height.lower_bound(l);\n        if(it!=height.begin()) mx=max(mx, prev(it)->second);\n        for(; it!=height.end() && it->first<r; it=height.erase(it)) mx=max(mx,it->second);\n        height[l]=height[r]=mx+p[1];\n        cur=max(cur,mx+p[1]); ans.push_back(cur);\n    } return ans;\n}"
        }
      ],
      "description": "There are several squares being dropped onto the X-axis of a 2D plane.\n\nYou are given a 2D integer array `positions` where `positions[i] = [lefti, sideLengthi]` represents the `ith` square with a side length of `sideLengthi` that is dropped with its left edge aligned with X-coordinate `lefti`.\n\nEach square is dropped one at a time from a height above any landed squares. It then falls downward (negative Y direction) until it either lands on the top side of another square or on the X-axis. A square brushing the left/right side of another square does not count as landing on it. Once it lands, it freezes in place and cannot be moved.\n\nAfter each square is dropped, you must record the height of the current tallest stack of squares.\n\nReturn an integer array `ans` where `ans[i]` represents the height described above after dropping the `ith` square.\n\n \n\nExample 1:\n\nInput: positions = [[1,2],[2,3],[6,1]]\nOutput: [2,5,5]\nExplanation:\nAfter the first drop, the tallest stack is square 1 with a height of 2.\nAfter the second drop, the tallest stack is squares 1 and 2 with a height of 5.\nAfter the third drop, the tallest stack is still squares 1 and 2 with a height of 5.\nThus, we return an answer of [2, 5, 5].\n\nExample 2:\n\nInput: positions = [[100,100],[200,100]]\nOutput: [100,100]\nExplanation:\nAfter the first drop, the tallest stack is square 1 with a height of 100.\nAfter the second drop, the tallest stack is either square 1 or square 2, both with heights of 100.\nThus, we return an answer of [100, 100].\nNote that square 2 only brushes the right side of square 1, which does not count as landing on it.\n\n \n\nConstraints:\n\n\t• `1 i 8`\n• `1 i 6`",
      "descriptionHtml": "<p>There are several squares being dropped onto the X-axis of a 2D plane.</p>\n\n<p>You are given a 2D integer array <code>positions</code> where <code>positions[i] = [left<sub>i</sub>, sideLength<sub>i</sub>]</code> represents the <code>i<sup>th</sup></code> square with a side length of <code>sideLength<sub>i</sub></code> that is dropped with its left edge aligned with X-coordinate <code>left<sub>i</sub></code>.</p>\n\n<p>Each square is dropped one at a time from a height above any landed squares. It then falls downward (negative Y direction) until it either lands <strong>on the top side of another square</strong> or <strong>on the X-axis</strong>. A square brushing the left/right side of another square does not count as landing on it. Once it lands, it freezes in place and cannot be moved.</p>\n\n<p>After each square is dropped, you must record the <strong>height of the current tallest stack of squares</strong>.</p>\n\n<p>Return <em>an integer array </em><code>ans</code><em> where </em><code>ans[i]</code><em> represents the height described above after dropping the </em><code>i<sup>th</sup></code><em> square</em>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2021/04/28/fallingsq1-plane.jpg\" style=\"width: 500px; height: 505px;\" />\n<pre>\n<strong>Input:</strong> positions = [[1,2],[2,3],[6,1]]\n<strong>Output:</strong> [2,5,5]\n<strong>Explanation:</strong>\nAfter the first drop, the tallest stack is square 1 with a height of 2.\nAfter the second drop, the tallest stack is squares 1 and 2 with a height of 5.\nAfter the third drop, the tallest stack is still squares 1 and 2 with a height of 5.\nThus, we return an answer of [2, 5, 5].\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> positions = [[100,100],[200,100]]\n<strong>Output:</strong> [100,100]\n<strong>Explanation:</strong>\nAfter the first drop, the tallest stack is square 1 with a height of 100.\nAfter the second drop, the tallest stack is either square 1 or square 2, both with heights of 100.\nThus, we return an answer of [100, 100].\nNote that square 2 only brushes the right side of square 1, which does not count as landing on it.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= positions.length &lt;= 1000</code></li>\n\t<li><code>1 &lt;= left<sub>i</sub> &lt;= 10<sup>8</sup></code></li>\n\t<li><code>1 &lt;= sideLength<sub>i</sub> &lt;= 10<sup>6</sup></code></li>\n</ul>\n",
      "lcSlug": "falling-squares",
      "summary": "Coordinate compress x; track active heights per column sweep."
    },
    {
      "id": "sg-07",
      "title": "My Calendar III",
      "lc": 732,
      "importance": "nice",
      "subtopic": "segment",
      "difficulty": "Hard",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "bookings",
          "out": "max overlap"
        }
      ],
      "approaches": [
        {
          "name": "Segment tree max overlap",
          "time": "O(n log n)",
          "space": "O(n)",
          "code": "class MyCalendarThree {\n    map<int,int> diff;\n    void add(int s,int e){ diff[s]++; diff[e]--; }\npublic:\n    int book(int start,int end){\n        add(start,end); int cur=0, best=0;\n        for(auto& [_,d]: diff){ cur+=d; best=max(best,cur); }\n        return best;\n    }\n};"
        }
      ],
      "description": "A `k`-booking happens when `k` events have some non-empty intersection (i.e., there is some time that is common to all `k` events.)\n\nYou are given some events `[startTime, endTime)`, after each given event, return an integer `k` representing the maximum `k`-booking between all the previous events.\n\nImplement the `MyCalendarThree` class:\n\n\t• `MyCalendarThree()` Initializes the object.\n• `int book(int startTime, int endTime)` Returns an integer `k` representing the largest integer such that there exists a `k`-booking in the calendar.\n\n \n\nExample 1:\n\nInput\n[\"MyCalendarThree\", \"book\", \"book\", \"book\", \"book\", \"book\", \"book\"]\n[[], [10, 20], [50, 60], [10, 40], [5, 15], [5, 10], [25, 55]]\nOutput\n[null, 1, 1, 2, 3, 3, 3]\n\nExplanation\nMyCalendarThree myCalendarThree = new MyCalendarThree();\nmyCalendarThree.book(10, 20); // return 1\nmyCalendarThree.book(50, 60); // return 1\nmyCalendarThree.book(10, 40); // return 2\nmyCalendarThree.book(5, 15); // return 3\nmyCalendarThree.book(5, 10); // return 3\nmyCalendarThree.book(25, 55); // return 3\n\n \n\nConstraints:\n\n\t• `0 9`\n• At most `400` calls will be made to `book`.",
      "descriptionHtml": "<p>A <code>k</code>-booking happens when <code>k</code> events have some non-empty intersection (i.e., there is some time that is common to all <code>k</code> events.)</p>\n\n<p>You are given some events <code>[startTime, endTime)</code>, after each given event, return an integer <code>k</code> representing the maximum <code>k</code>-booking between all the previous events.</p>\n\n<p>Implement the <code>MyCalendarThree</code> class:</p>\n\n<ul>\n\t<li><code>MyCalendarThree()</code> Initializes the object.</li>\n\t<li><code>int book(int startTime, int endTime)</code> Returns an integer <code>k</code> representing the largest integer such that there exists a <code>k</code>-booking in the calendar.</li>\n</ul>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input</strong>\n[&quot;MyCalendarThree&quot;, &quot;book&quot;, &quot;book&quot;, &quot;book&quot;, &quot;book&quot;, &quot;book&quot;, &quot;book&quot;]\n[[], [10, 20], [50, 60], [10, 40], [5, 15], [5, 10], [25, 55]]\n<strong>Output</strong>\n[null, 1, 1, 2, 3, 3, 3]\n\n<strong>Explanation</strong>\nMyCalendarThree myCalendarThree = new MyCalendarThree();\nmyCalendarThree.book(10, 20); // return 1\nmyCalendarThree.book(50, 60); // return 1\nmyCalendarThree.book(10, 40); // return 2\nmyCalendarThree.book(5, 15); // return 3\nmyCalendarThree.book(5, 10); // return 3\nmyCalendarThree.book(25, 55); // return 3\n\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>0 &lt;= startTime &lt; endTime &lt;= 10<sup>9</sup></code></li>\n\t<li>At most <code>400</code> calls will be made to <code>book</code>.</li>\n</ul>\n",
      "lcSlug": "my-calendar-iii",
      "summary": "Segment tree max overlap — state invariant, then loop."
    },
    {
      "id": "sg-08",
      "title": "The Skyline Problem",
      "lc": 218,
      "importance": "should",
      "subtopic": "sweep",
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
      "id": "sg-09",
      "title": "Range Module",
      "lc": 715,
      "importance": "nice",
      "subtopic": "segment",
      "difficulty": "Hard",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "track range",
          "out": "module"
        }
      ],
      "approaches": [
        {
          "name": "Ordered map ranges",
          "time": "O(n log n)",
          "space": "O(n)",
          "code": "class RangeModule {\n    map<int,int> ranges; // start -> end\npublic:\n    void addRange(int left,int right){\n        auto it=ranges.upper_bound(left);\n        if(it!=ranges.begin()){ auto prev=prev(it); if(prev->second>=left){ left=prev->first; right=max(right,prev->second); ranges.erase(prev); } }\n        while(it!=ranges.end() && it->first<=right){ right=max(right,it->second); it=ranges.erase(it); }\n        ranges[left]=right;\n    }\n    bool queryRange(int left,int right){\n        auto it=ranges.upper_bound(left); if(it==ranges.begin()) return false;\n        return prev(it)->second>=right;\n    }\n    void removeRange(int left,int right){\n        auto it=ranges.upper_bound(left);\n        if(it!=ranges.begin()){ auto prevIt=prev(it); if(prevIt->second>left){ if(prevIt->second>right) ranges[right]=prevIt->second; ranges[prevIt->first]=left; } }\n        while(it!=ranges.end() && it->first<right){ auto nxt=next(it); if(it->second>right) ranges[right]=it->second; it=ranges.erase(it); if(nxt==it) break; }\n    }\n};"
        }
      ],
      "description": "A Range Module is a module that tracks ranges of numbers. Design a data structure to track the ranges represented as half-open intervals and query about them.\n\nA half-open interval `[left, right)` denotes all the real numbers `x` where `left \n\n\t• `RangeModule()` Initializes the object of the data structure.\n• `void addRange(int left, int right)` Adds the half-open interval `[left, right)`, tracking every real number in that interval. Adding an interval that partially overlaps with currently tracked numbers should add any numbers in the interval `[left, right)` that are not already tracked.\n• `boolean queryRange(int left, int right)` Returns `true` if every real number in the interval `[left, right)` is currently being tracked, and `false` otherwise.\n• `void removeRange(int left, int right)` Stops tracking every real number currently being tracked in the half-open interval `[left, right)`.\n\n \n\nExample 1:\n\nInput\n[\"RangeModule\", \"addRange\", \"removeRange\", \"queryRange\", \"queryRange\", \"queryRange\"]\n[[], [10, 20], [14, 16], [10, 14], [13, 15], [16, 17]]\nOutput\n[null, null, null, true, false, true]\n\nExplanation\nRangeModule rangeModule = new RangeModule();\nrangeModule.addRange(10, 20);\nrangeModule.removeRange(14, 16);\nrangeModule.queryRange(10, 14); // return True,(Every number in [10, 14) is being tracked)\nrangeModule.queryRange(13, 15); // return False,(Numbers like 14, 14.03, 14.17 in [13, 15) are not being tracked)\nrangeModule.queryRange(16, 17); // return True, (The number 16 in [16, 17) is still being tracked, despite the remove operation)\n\n \n\nConstraints:\n\n\t• `1 9`\n• At most `104` calls will be made to `addRange`, `queryRange`, and `removeRange`.",
      "descriptionHtml": "<p>A Range Module is a module that tracks ranges of numbers. Design a data structure to track the ranges represented as <strong>half-open intervals</strong> and query about them.</p>\n\n<p>A <strong>half-open interval</strong> <code>[left, right)</code> denotes all the real numbers <code>x</code> where <code>left &lt;= x &lt; right</code>.</p>\n\n<p>Implement the <code>RangeModule</code> class:</p>\n\n<ul>\n\t<li><code>RangeModule()</code> Initializes the object of the data structure.</li>\n\t<li><code>void addRange(int left, int right)</code> Adds the <strong>half-open interval</strong> <code>[left, right)</code>, tracking every real number in that interval. Adding an interval that partially overlaps with currently tracked numbers should add any numbers in the interval <code>[left, right)</code> that are not already tracked.</li>\n\t<li><code>boolean queryRange(int left, int right)</code> Returns <code>true</code> if every real number in the interval <code>[left, right)</code> is currently being tracked, and <code>false</code> otherwise.</li>\n\t<li><code>void removeRange(int left, int right)</code> Stops tracking every real number currently being tracked in the <strong>half-open interval</strong> <code>[left, right)</code>.</li>\n</ul>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input</strong>\n[&quot;RangeModule&quot;, &quot;addRange&quot;, &quot;removeRange&quot;, &quot;queryRange&quot;, &quot;queryRange&quot;, &quot;queryRange&quot;]\n[[], [10, 20], [14, 16], [10, 14], [13, 15], [16, 17]]\n<strong>Output</strong>\n[null, null, null, true, false, true]\n\n<strong>Explanation</strong>\nRangeModule rangeModule = new RangeModule();\nrangeModule.addRange(10, 20);\nrangeModule.removeRange(14, 16);\nrangeModule.queryRange(10, 14); // return True,(Every number in [10, 14) is being tracked)\nrangeModule.queryRange(13, 15); // return False,(Numbers like 14, 14.03, 14.17 in [13, 15) are not being tracked)\nrangeModule.queryRange(16, 17); // return True, (The number 16 in [16, 17) is still being tracked, despite the remove operation)\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= left &lt; right &lt;= 10<sup>9</sup></code></li>\n\t<li>At most <code>10<sup>4</sup></code> calls will be made to <code>addRange</code>, <code>queryRange</code>, and <code>removeRange</code>.</li>\n</ul>\n",
      "lcSlug": "range-module",
      "summary": "Ordered map ranges — Segment tree or BIT for range query/update in O(log n)."
    },
    {
      "id": "sg-10",
      "title": "Count Good Triplets in Array",
      "lc": 2179,
      "importance": "nice",
      "subtopic": "bit",
      "difficulty": "Hard",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums1,nums2",
          "out": "count"
        }
      ],
      "approaches": [
        {
          "name": "Map + BIT",
          "time": "O(n log n)",
          "space": "O(n)",
          "code": "long long goodTriplets(vector<int>& nums1, vector<int>& nums2) {\n    int n=nums1.size(); vector<int> pos(n+1), bit(n+2);\n    auto add=[&](int i){ for(++i;i<=n+1;i+=i&-i) bit[i]++; };\n    auto sum=[&](int i){ int s=0; for(++i;i>0;i-=i&-i) s+=bit[i]; return s; };\n    for(int i=0;i<n;i++) pos[nums2[i]]=i+1;\n    long long ans=0, left=0;\n    for(int x: nums1){\n        int p=pos[x];\n        long long less=sum(p-1), greater=left-less;\n        ans += less*(n-p-(left-less));\n        add(p); left++;\n    } return ans;\n}"
        }
      ],
      "description": "You are given two 0-indexed arrays `nums1` and `nums2` of length `n`, both of which are permutations of `[0, 1, ..., n - 1]`.\n\nA good triplet is a set of `3` distinct values which are present in increasing order by position both in `nums1` and `nums2`. In other words, if we consider `pos1v` as the index of the value `v` in `nums1` and `pos2v` as the index of the value `v` in `nums2`, then a good triplet will be a set `(x, y, z)` where `0 x y z` and `pos2x y z`.\n\nReturn the total number of good triplets.\n\n \n\nExample 1:\n\nInput: nums1 = [2,0,1,3], nums2 = [0,1,2,3]\nOutput: 1\nExplanation: \nThere are 4 triplets (x,y,z) such that pos1x Example 2:\n\nInput: nums1 = [4,0,1,3,2], nums2 = [4,1,0,2,3]\nOutput: 4\nExplanation: The 4 good triplets are (4,0,3), (4,0,2), (4,1,3), and (4,1,2).\n\n \n\nConstraints:\n\n\t• `n == nums1.length == nums2.length`\n• `3 5`\n• `0",
      "descriptionHtml": "<p>You are given two <strong>0-indexed</strong> arrays <code>nums1</code> and <code>nums2</code> of length <code>n</code>, both of which are <strong>permutations</strong> of <code>[0, 1, ..., n - 1]</code>.</p>\n\n<p>A <strong>good triplet</strong> is a set of <code>3</code> <strong>distinct</strong> values which are present in <strong>increasing order</strong> by position both in <code>nums1</code> and <code>nums2</code>. In other words, if we consider <code>pos1<sub>v</sub></code> as the index of the value <code>v</code> in <code>nums1</code> and <code>pos2<sub>v</sub></code> as the index of the value <code>v</code> in <code>nums2</code>, then a good triplet will be a set <code>(x, y, z)</code> where <code>0 &lt;= x, y, z &lt;= n - 1</code>, such that <code>pos1<sub>x</sub> &lt; pos1<sub>y</sub> &lt; pos1<sub>z</sub></code> and <code>pos2<sub>x</sub> &lt; pos2<sub>y</sub> &lt; pos2<sub>z</sub></code>.</p>\n\n<p>Return <em>the <strong>total number</strong> of good triplets</em>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums1 = [2,0,1,3], nums2 = [0,1,2,3]\n<strong>Output:</strong> 1\n<strong>Explanation:</strong> \nThere are 4 triplets (x,y,z) such that pos1<sub>x</sub> &lt; pos1<sub>y</sub> &lt; pos1<sub>z</sub>. They are (2,0,1), (2,0,3), (2,1,3), and (0,1,3). \nOut of those triplets, only the triplet (0,1,3) satisfies pos2<sub>x</sub> &lt; pos2<sub>y</sub> &lt; pos2<sub>z</sub>. Hence, there is only 1 good triplet.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums1 = [4,0,1,3,2], nums2 = [4,1,0,2,3]\n<strong>Output:</strong> 4\n<strong>Explanation:</strong> The 4 good triplets are (4,0,3), (4,0,2), (4,1,3), and (4,1,2).\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>n == nums1.length == nums2.length</code></li>\n\t<li><code>3 &lt;= n &lt;= 10<sup>5</sup></code></li>\n\t<li><code>0 &lt;= nums1[i], nums2[i] &lt;= n - 1</code></li>\n\t<li><code>nums1</code> and <code>nums2</code> are permutations of <code>[0, 1, ..., n - 1]</code>.</li>\n</ul>\n",
      "lcSlug": "count-good-triplets-in-an-array",
      "summary": "Map + BIT — Bit tricks: XOR pairs, masks, or count bits mod k."
    },
    {
      "id": "sg-11",
      "title": "Create Sorted Array through Instructions",
      "lc": 1649,
      "importance": "nice",
      "subtopic": "bit",
      "difficulty": "Hard",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "instructions",
          "out": "cost"
        }
      ],
      "approaches": [
        {
          "name": "BIT inversion cost",
          "time": "O(n log n)",
          "space": "O(n)",
          "code": "int createSortedArray(vector<int>& instructions) {\n    const int MOD=1e9+7; vector<int> bit(100002);\n    auto add=[&](int i,int v){ for(++i;i<(int)bit.size();i+=i&-i) bit[i]+=v; };\n    auto sum=[&](int i){ int s=0; for(++i;i>0;i-=i&-i) s+=bit[i]; return s; };\n    long long cost=0;\n    for(int x: instructions){\n        long long less=sum(x-1), greater=sum(100000)-sum(x);\n        cost=(cost+min(less,greater))%MOD; add(x,1);\n    } return (int)cost;\n}"
        }
      ],
      "description": "Given an integer array `instructions`, you are asked to create a sorted array from the elements in `instructions`. You start with an empty container `nums`. For each element from left to right in `instructions`, insert it into `nums`. The cost of each insertion is the minimum of the following:\r\n\r\n\r\n\t• The number of elements currently in `nums` that are strictly less than `instructions[i]`.\n• The number of elements currently in `nums` that are strictly greater than `instructions[i]`.\n\r\n\r\nFor example, if inserting element `3` into `nums = [1,2,3,5]`, the cost of insertion is `min(2, 1)` (elements `1` and `2` are less than `3`, element `5` is greater than `3`) and `nums` will become `[1,2,3,3,5]`.\n\nReturn the total cost to insert all elements from `instructions` into `nums`. Since the answer may be large, return it modulo `109 + 7`\n\n \n\nExample 1:\r\n\r\n\n\r\nInput: instructions = [1,5,6,2]\r\nOutput: 1\r\nExplanation: Begin with nums = [].\r\nInsert 1 with cost min(0, 0) = 0, now nums = [1].\r\nInsert 5 with cost min(1, 0) = 0, now nums = [1,5].\r\nInsert 6 with cost min(2, 0) = 0, now nums = [1,5,6].\r\nInsert 2 with cost min(1, 2) = 1, now nums = [1,2,5,6].\r\nThe total cost is 0 + 0 + 0 + 1 = 1.\n\r\n\r\nExample 2:\r\n\r\n\n\r\nInput: instructions = [1,2,3,6,5,4]\r\nOutput: 3\r\nExplanation: Begin with nums = [].\r\nInsert 1 with cost min(0, 0) = 0, now nums = [1].\r\nInsert 2 with cost min(1, 0) = 0, now nums = [1,2].\r\nInsert 3 with cost min(2, 0) = 0, now nums = [1,2,3].\r\nInsert 6 with cost min(3, 0) = 0, now nums = [1,2,3,6].\r\nInsert 5 with cost min(3, 1) = 1, now nums = [1,2,3,5,6].\r\nInsert 4 with cost min(3, 2) = 2, now nums = [1,2,3,4,5,6].\r\nThe total cost is 0 + 0 + 0 + 0 + 1 + 2 = 3.\r\n\n\r\n\r\nExample 3:\r\n\r\n\n\r\nInput: instructions = [1,3,3,3,2,4,2,1,2]\r\nOutput: 4\r\nExplanation: Begin with nums = [].\r\nInsert 1 with cost min(0, 0) = 0, now nums = [1].\r\nInsert 3 with cost min(1, 0) = 0, now nums = [1,3].\r\nInsert 3 with cost min(1, 0) = 0, now nums = [1,3,3].\r\nInsert 3 with cost min(1, 0) = 0, now nums = [1,3,3,3].\r\nInsert 2 with cost min(1, 3) = 1, now nums = [1,2,3,3,3].\r\nInsert 4 with cost min(5, 0) = 0, now nums = [1,2,3,3,3,4].\r\n​​​​​​​Insert 2 with cost min(1, 4) = 1, now nums = [1,2,2,3,3,3,4].\r\n​​​​​​​Insert 1 with cost min(0, 6) = 0, now nums = [1,1,2,2,3,3,3,4].\r\n​​​​​​​Insert 2 with cost min(2, 4) = 2, now nums = [1,1,2,2,2,3,3,3,4].\r\nThe total cost is 0 + 0 + 0 + 0 + 1 + 0 + 1 + 0 + 2 = 4.\r\n\n\r\n\r\n \n\nConstraints:\r\n\r\n\r\n\t• `1 5`\n• `1 5`",
      "descriptionHtml": "<p>Given an integer array <code>instructions</code>, you are asked to create a sorted array from the elements in <code>instructions</code>. You start with an empty container <code>nums</code>. For each element from <strong>left to right</strong> in <code>instructions</code>, insert it into <code>nums</code>. The <strong>cost</strong> of each insertion is the <b>minimum</b> of the following:</p>\r\n\r\n<ul>\r\n\t<li>The number of elements currently in <code>nums</code> that are <strong>strictly less than</strong> <code>instructions[i]</code>.</li>\r\n\t<li>The number of elements currently in <code>nums</code> that are <strong>strictly greater than</strong> <code>instructions[i]</code>.</li>\r\n</ul>\r\n\r\n<p>For example, if inserting element <code>3</code> into <code>nums = [1,2,3,5]</code>, the <strong>cost</strong> of insertion is <code>min(2, 1)</code> (elements <code>1</code> and <code>2</code> are less than <code>3</code>, element <code>5</code> is greater than <code>3</code>) and <code>nums</code> will become <code>[1,2,3,3,5]</code>.</p>\r\n\r\n<p>Return <em>the <strong>total cost</strong> to insert all elements from </em><code>instructions</code><em> into </em><code>nums</code>. Since the answer may be large, return it <strong>modulo</strong> <code>10<sup>9</sup> + 7</code></p>\r\n\r\n<p>&nbsp;</p>\r\n<p><strong class=\"example\">Example 1:</strong></p>\r\n\r\n<pre>\r\n<strong>Input:</strong> instructions = [1,5,6,2]\r\n<strong>Output:</strong> 1\r\n<strong>Explanation:</strong> Begin with nums = [].\r\nInsert 1 with cost min(0, 0) = 0, now nums = [1].\r\nInsert 5 with cost min(1, 0) = 0, now nums = [1,5].\r\nInsert 6 with cost min(2, 0) = 0, now nums = [1,5,6].\r\nInsert 2 with cost min(1, 2) = 1, now nums = [1,2,5,6].\r\nThe total cost is 0 + 0 + 0 + 1 = 1.</pre>\r\n\r\n<p><strong class=\"example\">Example 2:</strong></p>\r\n\r\n<pre>\r\n<strong>Input:</strong> instructions = [1,2,3,6,5,4]\r\n<strong>Output:</strong> 3\r\n<strong>Explanation:</strong> Begin with nums = [].\r\nInsert 1 with cost min(0, 0) = 0, now nums = [1].\r\nInsert 2 with cost min(1, 0) = 0, now nums = [1,2].\r\nInsert 3 with cost min(2, 0) = 0, now nums = [1,2,3].\r\nInsert 6 with cost min(3, 0) = 0, now nums = [1,2,3,6].\r\nInsert 5 with cost min(3, 1) = 1, now nums = [1,2,3,5,6].\r\nInsert 4 with cost min(3, 2) = 2, now nums = [1,2,3,4,5,6].\r\nThe total cost is 0 + 0 + 0 + 0 + 1 + 2 = 3.\r\n</pre>\r\n\r\n<p><strong class=\"example\">Example 3:</strong></p>\r\n\r\n<pre>\r\n<strong>Input:</strong> instructions = [1,3,3,3,2,4,2,1,2]\r\n<strong>Output:</strong> 4\r\n<strong>Explanation:</strong> Begin with nums = [].\r\nInsert 1 with cost min(0, 0) = 0, now nums = [1].\r\nInsert 3 with cost min(1, 0) = 0, now nums = [1,3].\r\nInsert 3 with cost min(1, 0) = 0, now nums = [1,3,3].\r\nInsert 3 with cost min(1, 0) = 0, now nums = [1,3,3,3].\r\nInsert 2 with cost min(1, 3) = 1, now nums = [1,2,3,3,3].\r\nInsert 4 with cost min(5, 0) = 0, now nums = [1,2,3,3,3,4].\r\n​​​​​​​Insert 2 with cost min(1, 4) = 1, now nums = [1,2,2,3,3,3,4].\r\n​​​​​​​Insert 1 with cost min(0, 6) = 0, now nums = [1,1,2,2,3,3,3,4].\r\n​​​​​​​Insert 2 with cost min(2, 4) = 2, now nums = [1,1,2,2,2,3,3,3,4].\r\nThe total cost is 0 + 0 + 0 + 0 + 1 + 0 + 1 + 0 + 2 = 4.\r\n</pre>\r\n\r\n<p>&nbsp;</p>\r\n<p><strong>Constraints:</strong></p>\r\n\r\n<ul>\r\n\t<li><code>1 &lt;= instructions.length &lt;= 10<sup>5</sup></code></li>\r\n\t<li><code>1 &lt;= instructions[i] &lt;= 10<sup>5</sup></code></li>\r\n</ul>",
      "lcSlug": "create-sorted-array-through-instructions",
      "summary": "BIT inversion cost — Bit tricks: XOR pairs, masks, or count bits mod k."
    },
    {
      "id": "sg-12",
      "title": "Maximum Sum Queries",
      "lc": 2736,
      "importance": "nice",
      "subtopic": "segment",
      "difficulty": "Hard",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums1,nums2,queries",
          "out": "answers"
        }
      ],
      "approaches": [
        {
          "name": "Sort + multiset",
          "time": "O((n+q) log n)",
          "space": "O(n)",
          "code": "vector<int> maximumSumQueries(vector<int>& nums1, vector<int>& nums2, vector<vector<int>>& queries) {\n    int n=nums1.size(), m=queries.size();\n    vector<tuple<int,int,int,int>> qs(m);\n    for(int i=0;i<m;i++) qs[i]={queries[i][0],queries[i][1],i,0};\n    sort(qs.begin(), qs.end(), greater<>());\n    vector<pair<int,int>> pts(n);\n    for(int i=0;i<n;i++) pts[i]={nums1[i],nums2[i]};\n    sort(pts.begin(), pts.end(), greater<>());\n    multiset<int> best; vector<int> ans(m,-1); int j=0;\n    for(auto& [x,y,idx,_]: qs){\n        while(j<n && pts[j].first>=x){ best.insert(pts[j].first+pts[j].second); j++; }\n        auto it=best.lower_bound(y);\n        if(it!=best.end()) ans[idx]=*it;\n    } return ans;\n}"
        }
      ],
      "description": "You are given two 0-indexed integer arrays `nums1` and `nums2`, each of length `n`, and a 1-indexed 2D array `queries` where `queries[i] = [xi, yi]`.\n\nFor the `ith` query, find the maximum value of `nums1[j] + nums2[j]` among all indices `j` `(0 = xi` and `nums2[j] >= yi`, or -1 if there is no `j` satisfying the constraints.\n\nReturn an array `answer` where `answer[i]` is the answer to the `ith` query.\n\n \n\nExample 1:\n\nInput: nums1 = [4,3,1,2], nums2 = [2,4,9,5], queries = [[4,1],[1,3],[2,5]]\nOutput: [6,10,7]\nExplanation: \nFor the 1st query xi = 4 and yi = 1, we can select index j = 0 since nums1[j] >= 4 and nums2[j] >= 1. The sum nums1[j] + nums2[j] is 6, and we can show that 6 is the maximum we can obtain.\n\nFor the 2nd query xi = 1 and yi = 3, we can select index j = 2 since nums1[j] >= 1 and nums2[j] >= 3. The sum nums1[j] + nums2[j] is 10, and we can show that 10 is the maximum we can obtain. \n\nFor the 3rd query xi = 2 and yi = 5, we can select index j = 3 since nums1[j] >= 2 and nums2[j] >= 5. The sum nums1[j] + nums2[j] is 7, and we can show that 7 is the maximum we can obtain.\n\nTherefore, we return [6,10,7].\n\nExample 2:\n\nInput: nums1 = [3,2,5], nums2 = [2,3,4], queries = [[4,4],[3,2],[1,1]]\nOutput: [9,9,9]\nExplanation: For this example, we can use index j = 2 for all the queries since it satisfies the constraints for each query.\n\nExample 3:\n\nInput: nums1 = [2,1], nums2 = [2,3], queries = [[3,3]]\nOutput: [-1]\nExplanation: There is one query in this example with xi = 3 and yi = 3. For every index, j, either nums1[j]  \n\nConstraints:\n\n\t• `nums1.length == nums2.length` \n• `n == nums1.length `\n• `1 5`\n• `1 9 `\n• `1 5`\n• `queries[i].length == 2`\n• `xi == queries[i][1]`\n• `yi == queries[i][2]`\n• `1 i, yi 9`",
      "descriptionHtml": "<p>You are given two <strong>0-indexed</strong> integer arrays <code>nums1</code> and <code>nums2</code>, each of length <code>n</code>, and a <strong>1-indexed 2D array</strong> <code>queries</code> where <code>queries[i] = [x<sub>i</sub>, y<sub>i</sub>]</code>.</p>\n\n<p>For the <code>i<sup>th</sup></code> query, find the <strong>maximum value</strong> of <code>nums1[j] + nums2[j]</code> among all indices <code>j</code> <code>(0 &lt;= j &lt; n)</code>, where <code>nums1[j] &gt;= x<sub>i</sub></code> and <code>nums2[j] &gt;= y<sub>i</sub></code>, or <strong>-1</strong> if there is no <code>j</code> satisfying the constraints.</p>\n\n<p>Return <em>an array </em><code>answer</code><em> where </em><code>answer[i]</code><em> is the answer to the </em><code>i<sup>th</sup></code><em> query.</em></p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums1 = [4,3,1,2], nums2 = [2,4,9,5], queries = [[4,1],[1,3],[2,5]]\n<strong>Output:</strong> [6,10,7]\n<strong>Explanation:</strong> \nFor the 1st query <code node=\"[object Object]\">x<sub>i</sub> = 4</code>&nbsp;and&nbsp;<code node=\"[object Object]\">y<sub>i</sub> = 1</code>, we can select index&nbsp;<code node=\"[object Object]\">j = 0</code>&nbsp;since&nbsp;<code node=\"[object Object]\">nums1[j] &gt;= 4</code>&nbsp;and&nbsp;<code node=\"[object Object]\">nums2[j] &gt;= 1</code>. The sum&nbsp;<code node=\"[object Object]\">nums1[j] + nums2[j]</code>&nbsp;is 6, and we can show that 6 is the maximum we can obtain.\n\nFor the 2nd query <code node=\"[object Object]\">x<sub>i</sub> = 1</code>&nbsp;and&nbsp;<code node=\"[object Object]\">y<sub>i</sub> = 3</code>, we can select index&nbsp;<code node=\"[object Object]\">j = 2</code>&nbsp;since&nbsp;<code node=\"[object Object]\">nums1[j] &gt;= 1</code>&nbsp;and&nbsp;<code node=\"[object Object]\">nums2[j] &gt;= 3</code>. The sum&nbsp;<code node=\"[object Object]\">nums1[j] + nums2[j]</code>&nbsp;is 10, and we can show that 10 is the maximum we can obtain. \n\nFor the 3rd query <code node=\"[object Object]\">x<sub>i</sub> = 2</code>&nbsp;and&nbsp;<code node=\"[object Object]\">y<sub>i</sub> = 5</code>, we can select index&nbsp;<code node=\"[object Object]\">j = 3</code>&nbsp;since&nbsp;<code node=\"[object Object]\">nums1[j] &gt;= 2</code>&nbsp;and&nbsp;<code node=\"[object Object]\">nums2[j] &gt;= 5</code>. The sum&nbsp;<code node=\"[object Object]\">nums1[j] + nums2[j]</code>&nbsp;is 7, and we can show that 7 is the maximum we can obtain.\n\nTherefore, we return&nbsp;<code node=\"[object Object]\">[6,10,7]</code>.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums1 = [3,2,5], nums2 = [2,3,4], queries = [[4,4],[3,2],[1,1]]\n<strong>Output:</strong> [9,9,9]\n<strong>Explanation:</strong> For this example, we can use index&nbsp;<code node=\"[object Object]\">j = 2</code>&nbsp;for all the queries since it satisfies the constraints for each query.\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums1 = [2,1], nums2 = [2,3], queries = [[3,3]]\n<strong>Output:</strong> [-1]\n<strong>Explanation:</strong> There is one query in this example with <code node=\"[object Object]\">x<sub>i</sub></code> = 3 and <code node=\"[object Object]\">y<sub>i</sub></code> = 3. For every index, j, either nums1[j] &lt; <code node=\"[object Object]\">x<sub>i</sub></code> or nums2[j] &lt; <code node=\"[object Object]\">y<sub>i</sub></code>. Hence, there is no solution. \n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>nums1.length == nums2.length</code>&nbsp;</li>\n\t<li><code>n ==&nbsp;nums1.length&nbsp;</code></li>\n\t<li><code>1 &lt;= n &lt;= 10<sup>5</sup></code></li>\n\t<li><code>1 &lt;= nums1[i], nums2[i] &lt;= 10<sup>9</sup>&nbsp;</code></li>\n\t<li><code>1 &lt;= queries.length &lt;= 10<sup>5</sup></code></li>\n\t<li><code>queries[i].length ==&nbsp;2</code></li>\n\t<li><code>x<sub>i</sub>&nbsp;== queries[i][1]</code></li>\n\t<li><code>y<sub>i</sub> == queries[i][2]</code></li>\n\t<li><code>1 &lt;= x<sub>i</sub>, y<sub>i</sub> &lt;= 10<sup>9</sup></code></li>\n</ul>\n",
      "lcSlug": "maximum-sum-queries",
      "summary": "Sort + multiset — Segment tree or BIT for range query/update in O(log n)."
    },
    {
      "id": "sg-13",
      "title": "Longest Increasing Subsequence II",
      "lc": 2407,
      "importance": "nice",
      "subtopic": "segment",
      "difficulty": "Hard",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums,k",
          "out": "LIS len"
        }
      ],
      "approaches": [
        {
          "name": "Segment tree DP",
          "time": "O(n log V)",
          "space": "O(V)",
          "code": "int lengthOfLIS(vector<int>& nums, int k) {\n    int best=0; map<int,int> bit;\n    auto update=[&](int key,int val){\n        for(auto it=bit.lower_bound(key); it!=bit.end(); ++it){\n            if(it->second>=val) break;\n            it->second=val;\n        }\n        bit[key]=max(bit[key], val);\n        best=max(best,val);\n    };\n    for(int x: nums){\n        int cur=1;\n        auto it=bit.upper_bound(x-k);\n        if(it!=bit.begin()){ --it; cur=it->second+1; }\n        update(x,cur);\n    } return best;\n}"
        }
      ],
      "description": "You are given an integer array `nums` and an integer `k`.\n\nFind the longest subsequence of `nums` that meets the following requirements:\n\n\t• The subsequence is strictly increasing and\n• The difference between adjacent elements in the subsequence is at most `k`.\n\nReturn the length of the longest subsequence that meets the requirements.\n\nA subsequence is an array that can be derived from another array by deleting some or no elements without changing the order of the remaining elements.\n\n \n\nExample 1:\n\nInput: nums = [4,2,1,4,3,4,5,8,15], k = 3\nOutput: 5\nExplanation:\nThe longest subsequence that meets the requirements is [1,3,4,5,8].\nThe subsequence has a length of 5, so we return 5.\nNote that the subsequence [1,3,4,5,8,15] does not meet the requirements because 15 - 8 = 7 is larger than 3.\n\nExample 2:\n\nInput: nums = [7,4,5,1,8,12,4,7], k = 5\nOutput: 4\nExplanation:\nThe longest subsequence that meets the requirements is [4,5,8,12].\nThe subsequence has a length of 4, so we return 4.\n\nExample 3:\n\nInput: nums = [1,5], k = 1\nOutput: 1\nExplanation:\nThe longest subsequence that meets the requirements is [1].\nThe subsequence has a length of 1, so we return 1.\n\n \n\nConstraints:\n\n\t• `1 5`\n• `1 5`",
      "descriptionHtml": "<p>You are given an integer array <code>nums</code> and an integer <code>k</code>.</p>\n\n<p>Find the longest subsequence of <code>nums</code> that meets the following requirements:</p>\n\n<ul>\n\t<li>The subsequence is <strong>strictly increasing</strong> and</li>\n\t<li>The difference between adjacent elements in the subsequence is <strong>at most</strong> <code>k</code>.</li>\n</ul>\n\n<p>Return<em> the length of the <strong>longest</strong> <strong>subsequence</strong> that meets the requirements.</em></p>\n\n<p>A <strong>subsequence</strong> is an array that can be derived from another array by deleting some or no elements without changing the order of the remaining elements.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [4,2,1,4,3,4,5,8,15], k = 3\n<strong>Output:</strong> 5\n<strong>Explanation:</strong>\nThe longest subsequence that meets the requirements is [1,3,4,5,8].\nThe subsequence has a length of 5, so we return 5.\nNote that the subsequence [1,3,4,5,8,15] does not meet the requirements because 15 - 8 = 7 is larger than 3.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [7,4,5,1,8,12,4,7], k = 5\n<strong>Output:</strong> 4\n<strong>Explanation:</strong>\nThe longest subsequence that meets the requirements is [4,5,8,12].\nThe subsequence has a length of 4, so we return 4.\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [1,5], k = 1\n<strong>Output:</strong> 1\n<strong>Explanation:</strong>\nThe longest subsequence that meets the requirements is [1].\nThe subsequence has a length of 1, so we return 1.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= nums.length &lt;= 10<sup>5</sup></code></li>\n\t<li><code>1 &lt;= nums[i], k &lt;= 10<sup>5</sup></code></li>\n</ul>\n",
      "lcSlug": "longest-increasing-subsequence-ii",
      "summary": "Segment tree DP — Segment tree or BIT for range query/update in O(log n)."
    },
    {
      "id": "sg-14",
      "title": "Number of Longest Increasing Subsequence",
      "lc": 673,
      "importance": "should",
      "subtopic": "bit",
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
          "name": "LIS count DP",
          "time": "O(n^2)",
          "space": "O(n)",
          "code": "int findNumberOfLIS(vector<int>& nums) {\n    int n = nums.size(); vector<int> len(n,1), cnt(n,1);\n    for (int i = 0; i < n; i++)\n        for (int j = 0; j < i; j++)\n            if (nums[j] < nums[i]) {\n                if (len[j]+1 > len[i]) { len[i] = len[j]+1; cnt[i] = cnt[j]; }\n                else if (len[j]+1 == len[i]) cnt[i] += cnt[j];\n            }\n    int best = *max_element(len.begin(), len.end()), ans = 0;\n    for (int i = 0; i < n; i++) if (len[i] == best) ans += cnt[i];\n    return ans;\n}"
        }
      ],
      "description": "Given an integer array `nums`, return the number of longest increasing subsequences.\n\nNotice that the sequence has to be strictly increasing.\n\n \n\nExample 1:\n\nInput: nums = [1,3,5,4,7]\nOutput: 2\nExplanation: The two longest increasing subsequences are [1, 3, 4, 7] and [1, 3, 5, 7].\n\nExample 2:\n\nInput: nums = [2,2,2,2,2]\nOutput: 5\nExplanation: The length of the longest increasing subsequence is 1, and there are 5 increasing subsequences of length 1, so output 5.\n\n \n\nConstraints:\n\n\t• `1 6 6`\n• The answer is guaranteed to fit inside a 32-bit integer.",
      "descriptionHtml": "<p>Given an integer array&nbsp;<code>nums</code>, return <em>the number of longest increasing subsequences.</em></p>\n\n<p><strong>Notice</strong> that the sequence has to be <strong>strictly</strong> increasing.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [1,3,5,4,7]\n<strong>Output:</strong> 2\n<strong>Explanation:</strong> The two longest increasing subsequences are [1, 3, 4, 7] and [1, 3, 5, 7].\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [2,2,2,2,2]\n<strong>Output:</strong> 5\n<strong>Explanation:</strong> The length of the longest increasing subsequence is 1, and there are 5 increasing subsequences of length 1, so output 5.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= nums.length &lt;= 2000</code></li>\n\t<li><code>-10<sup>6</sup> &lt;= nums[i] &lt;= 10<sup>6</sup></code></li>\n\t<li>The answer is guaranteed to fit inside a 32-bit integer.</li>\n</ul>\n",
      "lcSlug": "number-of-longest-increasing-subsequence",
      "summary": "LIS count DP — Bit tricks: XOR pairs, masks, or count bits mod k."
    },
    {
      "id": "sg-15",
      "title": "Range Maximum Query (classic)",
      "lc": null,
      "importance": "must",
      "subtopic": "segment",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "arr, queries",
          "out": "max"
        }
      ],
      "approaches": [
        {
          "name": "Segment tree RMQ",
          "time": "O(log n) query",
          "space": "O(n)",
          "code": "class SegTree {\n    int n; vector<int> tree;\n    void build(vector<int>& a, int node, int l, int r) {\n        if (l == r) { tree[node] = a[l]; return; }\n        int m = (l + r) / 2;\n        build(a, node*2, l, m); build(a, node*2+1, m+1, r);\n        tree[node] = max(tree[node*2], tree[node*2+1]);\n    }\n    int query(int node, int l, int r, int ql, int qr) {\n        if (qr < l || r < ql) return INT_MIN;\n        if (ql <= l && r <= qr) return tree[node];\n        int m = (l + r) / 2;\n        return max(query(node*2, l, m, ql, qr), query(node*2+1, m+1, r, ql, qr));\n    }\npublic:\n    SegTree(vector<int>& a) {\n        n = a.size(); tree.assign(4*n, INT_MIN);\n        if (n) build(a, 1, 0, n-1);\n    }\n    int queryMax(int l, int r) { return query(1, 0, n-1, l, r); }\n};"
        }
      ],
      "description": "Given a static array, answer range maximum queries on [l,r] efficiently.",
      "summary": "Segment tree build once; queryMax(l,r) walks O(log n) nodes."
    },
    {
      "id": "sg-16",
      "title": "Lazy Propagation Range Update",
      "lc": null,
      "importance": "should",
      "subtopic": "lazy",
      "difficulty": "Hard",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "arr, updates",
          "out": "queries"
        }
      ],
      "approaches": [
        {
          "name": "Lazy segtree",
          "time": "O(log n)",
          "space": "O(n)",
          "code": "class LazySeg {\n    int n; vector<long long> sum, lazy;\n    void push(int node, int l, int r) {\n        if (!lazy[node]) return;\n        sum[node] += lazy[node] * (r - l + 1);\n        if (l != r) { lazy[node*2] += lazy[node]; lazy[node*2+1] += lazy[node]; }\n        lazy[node] = 0;\n    }\n    void update(int node, int l, int r, int ql, int qr, long v) {\n        push(node, l, r);\n        if (qr < l || r < ql) return;\n        if (ql <= l && r <= qr) { lazy[node] += v; push(node, l, r); return; }\n        int m = (l + r) / 2;\n        update(node*2, l, m, ql, qr, v); update(node*2+1, m+1, r, ql, qr, v);\n        push(node*2, l, m); push(node*2+1, m+1, r);\n        sum[node] = sum[node*2] + sum[node*2+1];\n    }\n    long query(int node, int l, int r, int ql, int qr) {\n        push(node, l, r);\n        if (qr < l || r < ql) return 0;\n        if (ql <= l && r <= qr) return sum[node];\n        int m = (l + r) / 2;\n        return query(node*2, l, m, ql, qr) + query(node*2+1, m+1, r, ql, qr);\n    }\npublic:\n    LazySeg(vector<int>& a) {\n        n = a.size(); sum.assign(4*n, 0); lazy.assign(4*n, 0);\n        for (int i = 0; i < n; i++) update(1, 0, n-1, i, i, a[i]);\n    }\n    void rangeAdd(int l, int r, int v) { update(1, 0, n-1, l, r, v); }\n    long rangeSum(int l, int r) { return query(1, 0, n-1, l, r); }\n};"
        }
      ],
      "description": "Support range add updates and range sum queries on an array.",
      "summary": "Lazy propagation: push pending add to children before querying/updating."
    }
  ]
};
