window.PRACTICE_TOPIC = {
  "id": "heaps",
  "title": "Heaps & Priority Queues",
  "expected_count": 18,
  "strategy": "<strong>Speed-run:</strong> Top-K and two-heaps median — know when heap beats sort. Filter <em>Must do</em> first.",
  "subtopics": [
    {
      "id": "two-heaps",
      "label": "Two Heaps"
    },
    {
      "id": "top-k",
      "label": "Top K"
    },
    {
      "id": "scheduling",
      "label": "Scheduling"
    },
    {
      "id": "merge",
      "label": "K-Way Merge"
    }
  ],
  "questions": [
    {
      "id": "hp-01",
      "title": "Find Median from Data Stream",
      "lc": 295,
      "importance": "must",
      "subtopic": "two-heaps",
      "difficulty": "Hard",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "addNum/findMedian",
          "out": "median"
        }
      ],
      "approaches": [
        {
          "name": "Two heaps median",
          "time": "O(log n)",
          "space": "O(n)",
          "code": "class MedianFinder {\n    priority_queue<int> lo;\n    priority_queue<int, vector<int>, greater<int>> hi;\npublic:\n    void addNum(int num) {\n        lo.push(num); hi.push(lo.top()); lo.pop();\n        if (hi.size() > lo.size()) { lo.push(hi.top()); hi.pop(); }\n    }\n    double findMedian() {\n        return lo.size() > hi.size() ? lo.top() : (lo.top() + hi.top()) / 2.0;\n    }\n};"
        }
      ],
      "description": "The median is the middle value in an ordered integer list. If the size of the list is even, there is no middle value, and the median is the mean of the two middle values.\n\n\t• For example, for `arr = [2,3,4]`, the median is `3`.\n• For example, for `arr = [2,3]`, the median is `(2 + 3) / 2 = 2.5`.\n\nImplement the MedianFinder class:\n\n\t• `MedianFinder()` initializes the `MedianFinder` object.\n• `void addNum(int num)` adds the integer `num` from the data stream to the data structure.\n• `double findMedian()` returns the median of all elements so far. Answers within `10-5` of the actual answer will be accepted.\n\n \n\nExample 1:\n\nInput\n[\"MedianFinder\", \"addNum\", \"addNum\", \"findMedian\", \"addNum\", \"findMedian\"]\n[[], [1], [2], [], [3], []]\nOutput\n[null, null, null, 1.5, null, 2.0]\n\nExplanation\nMedianFinder medianFinder = new MedianFinder();\nmedianFinder.addNum(1);    // arr = [1]\nmedianFinder.addNum(2);    // arr = [1, 2]\nmedianFinder.findMedian(); // return 1.5 (i.e., (1 + 2) / 2)\nmedianFinder.addNum(3);    // arr[1, 2, 3]\nmedianFinder.findMedian(); // return 2.0\n\n \n\nConstraints:\n\n\t• `-105 5`\n• There will be at least one element in the data structure before calling `findMedian`.\n• At most `5 * 104` calls will be made to `addNum` and `findMedian`.\n\n \n\nFollow up:\n\n\t• If all integer numbers from the stream are in the range `[0, 100]`, how would you optimize your solution?\n• If `99%` of all integer numbers from the stream are in the range `[0, 100]`, how would you optimize your solution?",
      "descriptionHtml": "<p>The <strong>median</strong> is the middle value in an ordered integer list. If the size of the list is even, there is no middle value, and the median is the mean of the two middle values.</p>\n\n<ul>\n\t<li>For example, for <code>arr = [2,3,4]</code>, the median is <code>3</code>.</li>\n\t<li>For example, for <code>arr = [2,3]</code>, the median is <code>(2 + 3) / 2 = 2.5</code>.</li>\n</ul>\n\n<p>Implement the MedianFinder class:</p>\n\n<ul>\n\t<li><code>MedianFinder()</code> initializes the <code>MedianFinder</code> object.</li>\n\t<li><code>void addNum(int num)</code> adds the integer <code>num</code> from the data stream to the data structure.</li>\n\t<li><code>double findMedian()</code> returns the median of all elements so far. Answers within <code>10<sup>-5</sup></code> of the actual answer will be accepted.</li>\n</ul>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input</strong>\n[&quot;MedianFinder&quot;, &quot;addNum&quot;, &quot;addNum&quot;, &quot;findMedian&quot;, &quot;addNum&quot;, &quot;findMedian&quot;]\n[[], [1], [2], [], [3], []]\n<strong>Output</strong>\n[null, null, null, 1.5, null, 2.0]\n\n<strong>Explanation</strong>\nMedianFinder medianFinder = new MedianFinder();\nmedianFinder.addNum(1);    // arr = [1]\nmedianFinder.addNum(2);    // arr = [1, 2]\nmedianFinder.findMedian(); // return 1.5 (i.e., (1 + 2) / 2)\nmedianFinder.addNum(3);    // arr[1, 2, 3]\nmedianFinder.findMedian(); // return 2.0\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>-10<sup>5</sup> &lt;= num &lt;= 10<sup>5</sup></code></li>\n\t<li>There will be at least one element in the data structure before calling <code>findMedian</code>.</li>\n\t<li>At most <code>5 * 10<sup>4</sup></code> calls will be made to <code>addNum</code> and <code>findMedian</code>.</li>\n</ul>\n\n<p>&nbsp;</p>\n<p><strong>Follow up:</strong></p>\n\n<ul>\n\t<li>If all integer numbers from the stream are in the range <code>[0, 100]</code>, how would you optimize your solution?</li>\n\t<li>If <code>99%</code> of all integer numbers from the stream are in the range <code>[0, 100]</code>, how would you optimize your solution?</li>\n</ul>\n",
      "lcSlug": "find-median-from-data-stream",
      "summary": "Two heaps median — state invariant, then loop."
    },
    {
      "id": "hp-02",
      "title": "Top K Frequent Elements",
      "lc": 347,
      "importance": "must",
      "subtopic": "top-k",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums,k",
          "out": "top k"
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
      "id": "hp-03",
      "title": "Kth Largest Element in Array",
      "lc": 215,
      "importance": "must",
      "subtopic": "top-k",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums,k",
          "out": "kth largest"
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
      "id": "hp-04",
      "title": "K Closest Points to Origin",
      "lc": 973,
      "importance": "should",
      "subtopic": "top-k",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "points,k",
          "out": "closest"
        }
      ],
      "approaches": [
        {
          "name": "K closest points",
          "time": "O(n log k)",
          "space": "O(k)",
          "code": "vector<vector<int>> kClosest(vector<vector<int>>& pts, int k) {\n    priority_queue<vector<int>> pq;\n    for (auto& p: pts) {\n        int d=p[0]*p[0]+p[1]*p[1];\n        pq.push({d,p[0],p[1]});\n        if ((int)pq.size()>k) pq.pop();\n    }\n    vector<vector<int>> ans;\n    while (!pq.empty()) { auto t=pq.top(); pq.pop(); ans.push_back({t[1],t[2]}); }\n    return ans;\n}"
        }
      ],
      "description": "Given an array of `points` where `points[i] = [xi, yi]` represents a point on the X-Y plane and an integer `k`, return the `k` closest points to the origin `(0, 0)`.\n\nThe distance between two points on the X-Y plane is the Euclidean distance (i.e., `&radic;(x1 - x2)2 + (y1 - y2)2`).\n\nYou may return the answer in any order. The answer is guaranteed to be unique (except for the order that it is in).\n\n \n\nExample 1:\n\nInput: points = [[1,3],[-2,2]], k = 1\nOutput: [[-2,2]]\nExplanation:\nThe distance between (1, 3) and the origin is sqrt(10).\nThe distance between (-2, 2) and the origin is sqrt(8).\nSince sqrt(8) Example 2:\n\nInput: points = [[3,3],[5,-1],[-2,4]], k = 2\nOutput: [[3,3],[-2,4]]\nExplanation: The answer [[-2,4],[3,3]] would also be accepted.\n\n \n\nConstraints:\n\n\t• `1 4`\n• `-104 i, yi 4`",
      "descriptionHtml": "<p>Given an array of <code>points</code> where <code>points[i] = [x<sub>i</sub>, y<sub>i</sub>]</code> represents a point on the <strong>X-Y</strong> plane and an integer <code>k</code>, return the <code>k</code> closest points to the origin <code>(0, 0)</code>.</p>\n\n<p>The distance between two points on the <strong>X-Y</strong> plane is the Euclidean distance (i.e., <code>&radic;(x<sub>1</sub> - x<sub>2</sub>)<sup>2</sup> + (y<sub>1</sub> - y<sub>2</sub>)<sup>2</sup></code>).</p>\n\n<p>You may return the answer in <strong>any order</strong>. The answer is <strong>guaranteed</strong> to be <strong>unique</strong> (except for the order that it is in).</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2021/03/03/closestplane1.jpg\" style=\"width: 400px; height: 400px;\" />\n<pre>\n<strong>Input:</strong> points = [[1,3],[-2,2]], k = 1\n<strong>Output:</strong> [[-2,2]]\n<strong>Explanation:</strong>\nThe distance between (1, 3) and the origin is sqrt(10).\nThe distance between (-2, 2) and the origin is sqrt(8).\nSince sqrt(8) &lt; sqrt(10), (-2, 2) is closer to the origin.\nWe only want the closest k = 1 points from the origin, so the answer is just [[-2,2]].\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> points = [[3,3],[5,-1],[-2,4]], k = 2\n<strong>Output:</strong> [[3,3],[-2,4]]\n<strong>Explanation:</strong> The answer [[-2,4],[3,3]] would also be accepted.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= k &lt;= points.length &lt;= 10<sup>4</sup></code></li>\n\t<li><code>-10<sup>4</sup> &lt;= x<sub>i</sub>, y<sub>i</sub> &lt;= 10<sup>4</sup></code></li>\n</ul>\n",
      "lcSlug": "k-closest-points-to-origin",
      "summary": "K closest points — state invariant, then loop."
    },
    {
      "id": "hp-05",
      "title": "Merge k Sorted Lists",
      "lc": 23,
      "importance": "must",
      "subtopic": "merge",
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
      "id": "hp-06",
      "title": "Task Scheduler",
      "lc": 621,
      "importance": "must",
      "subtopic": "scheduling",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "tasks,n",
          "out": "min time"
        }
      ],
      "approaches": [
        {
          "name": "Task scheduler",
          "time": "O(n)",
          "space": "O(1)",
          "code": "int leastInterval(vector<char>& tasks, int n) {\n    int cnt[26]={}; for (char c: tasks) cnt[c-'A']++;\n    int mx=*max_element(cnt,cnt+26), same=0;\n    for (int x: cnt) if (x==mx) same++;\n    return max((int)tasks.size(), (mx-1)*(n+1)+same);\n}"
        }
      ],
      "description": "You are given an array of CPU `tasks`, each labeled with a letter from A to Z, and a number `n`. Each CPU interval can be idle or allow the completion of one task. Tasks can be completed in any order, but there's a constraint: there has to be a gap of at least `n` intervals between two tasks with the same label.\n\nReturn the minimum number of CPU intervals required to complete all tasks.\n\n \n\nExample 1:\n\nInput: tasks = [\"A\",\"A\",\"A\",\"B\",\"B\",\"B\"], n = 2\n\nOutput: 8\n\nExplanation: A possible sequence is: A -> B -> idle -> A -> B -> idle -> A -> B.\n\nAfter completing task A, you must wait two intervals before doing A again. The same applies to task B. In the 3rd interval, neither A nor B can be done, so you idle. By the 4th interval, you can do A again as 2 intervals have passed.\n\nExample 2:\n\nInput: tasks = [\"A\",\"C\",\"A\",\"B\",\"D\",\"B\"], n = 1\n\nOutput: 6\n\nExplanation: A possible sequence is: A -> B -> C -> D -> A -> B.\n\nWith a cooling interval of 1, you can repeat a task after just one other task.\n\nExample 3:\n\nInput: tasks = [\"A\",\"A\",\"A\", \"B\",\"B\",\"B\"], n = 3\n\nOutput: 10\n\nExplanation: A possible sequence is: A -> B -> idle -> idle -> A -> B -> idle -> idle -> A -> B.\n\nThere are only two types of tasks, A and B, which need to be separated by 3 intervals. This leads to idling twice between repetitions of these tasks.\n\n \n\nConstraints:\n\n\t• `1 4`\n• `tasks[i]` is an uppercase English letter.\n• `0",
      "descriptionHtml": "<p>You are given an array of CPU <code>tasks</code>, each labeled with a letter from A to Z, and a number <code>n</code>. Each CPU interval can be idle or allow the completion of one task. Tasks can be completed in any order, but there&#39;s a constraint: there has to be a gap of <strong>at least</strong> <code>n</code> intervals between two tasks with the same label.</p>\n\n<p>Return the <strong>minimum</strong> number of CPU intervals required to complete all tasks.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<div class=\"example-block\" style=\"\n    border-color: var(--border-tertiary);\n    border-left-width: 2px;\n    color: var(--text-secondary);\n    font-size: .875rem;\n    margin-bottom: 1rem;\n    margin-top: 1rem;\n    overflow: visible;\n    padding-left: 1rem;\n\">\n<p><strong>Input:</strong> <span class=\"example-io\" style=\"\n    font-family: Menlo,sans-serif;\n    font-size: 0.85rem;\n\">tasks = [&quot;A&quot;,&quot;A&quot;,&quot;A&quot;,&quot;B&quot;,&quot;B&quot;,&quot;B&quot;], n = 2</span></p>\n\n<p><strong>Output:</strong> <span class=\"example-io\" style=\"\nfont-family: Menlo,sans-serif;\nfont-size: 0.85rem;\n\">8</span></p>\n\n<p><strong>Explanation:</strong> A possible sequence is: A -&gt; B -&gt; idle -&gt; A -&gt; B -&gt; idle -&gt; A -&gt; B.</p>\n\n<p>After completing task A, you must wait two intervals before doing A again. The same applies to task B. In the 3<sup>rd</sup> interval, neither A nor B can be done, so you idle. By the 4<sup>th</sup> interval, you can do A again as 2 intervals have passed.</p>\n</div>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<div class=\"example-block\" style=\"\n    border-color: var(--border-tertiary);\n    border-left-width: 2px;\n    color: var(--text-secondary);\n    font-size: .875rem;\n    margin-bottom: 1rem;\n    margin-top: 1rem;\n    overflow: visible;\n    padding-left: 1rem;\n\">\n<p><strong>Input:</strong> <span class=\"example-io\" style=\"\n    font-family: Menlo,sans-serif;\n    font-size: 0.85rem;\n\">tasks = [&quot;A&quot;,&quot;C&quot;,&quot;A&quot;,&quot;B&quot;,&quot;D&quot;,&quot;B&quot;], n = 1</span></p>\n\n<p><strong>Output:</strong> <span class=\"example-io\" style=\"\n    font-family: Menlo,sans-serif;\n    font-size: 0.85rem;\n\">6</span></p>\n\n<p><strong>Explanation:</strong> A possible sequence is: A -&gt; B -&gt; C -&gt; D -&gt; A -&gt; B.</p>\n\n<p>With a cooling interval of 1, you can repeat a task after just one other task.</p>\n</div>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<div class=\"example-block\" style=\"\n    border-color: var(--border-tertiary);\n    border-left-width: 2px;\n    color: var(--text-secondary);\n    font-size: .875rem;\n    margin-bottom: 1rem;\n    margin-top: 1rem;\n    overflow: visible;\n    padding-left: 1rem;\n\">\n<p><strong>Input:</strong> <span class=\"example-io\" style=\"\n    font-family: Menlo,sans-serif;\n    font-size: 0.85rem;\n\">tasks = [&quot;A&quot;,&quot;A&quot;,&quot;A&quot;, &quot;B&quot;,&quot;B&quot;,&quot;B&quot;], n = 3</span></p>\n\n<p><strong>Output:</strong> <span class=\"example-io\" style=\"\n    font-family: Menlo,sans-serif;\n    font-size: 0.85rem;\n\">10</span></p>\n\n<p><strong>Explanation:</strong> A possible sequence is: A -&gt; B -&gt; idle -&gt; idle -&gt; A -&gt; B -&gt; idle -&gt; idle -&gt; A -&gt; B.</p>\n\n<p>There are only two types of tasks, A and B, which need to be separated by 3 intervals. This leads to idling twice between repetitions of these tasks.</p>\n</div>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= tasks.length &lt;= 10<sup>4</sup></code></li>\n\t<li><code>tasks[i]</code> is an uppercase English letter.</li>\n\t<li><code>0 &lt;= n &lt;= 100</code></li>\n</ul>\n",
      "lcSlug": "task-scheduler",
      "summary": "Task scheduler — state invariant, then loop."
    },
    {
      "id": "hp-07",
      "title": "Meeting Rooms II",
      "lc": 253,
      "importance": "must",
      "subtopic": "scheduling",
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
      "id": "hp-08",
      "title": "Reorganize String",
      "lc": 767,
      "importance": "should",
      "subtopic": "scheduling",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "s",
          "out": "reorg"
        }
      ],
      "approaches": [
        {
          "name": "Max heap rearrange",
          "time": "O(n log k)",
          "space": "O(k)",
          "code": "string reorganizeString(string s) {\n    int cnt[26] = {}; for (char ch : s) cnt[ch-'a']++;\n    priority_queue<pair<int,char>> pq;\n    for (int i = 0; i < 26; i++) if (cnt[i]) pq.push({cnt[i], char('a'+i)});\n    string ans;\n    while (!pq.empty()) {\n        auto top = pq.top(); pq.pop();\n        int f = top.first; char ch = top.second;\n        if (!ans.empty() && ans.back() == ch) {\n            if (pq.empty()) return \"\";\n            auto top2 = pq.top(); pq.pop();\n            ans += top2.second;\n            if (--top2.first) pq.push(top2);\n            pq.push({f, ch});\n        } else { ans += ch; if (--f) pq.push({f, ch}); }\n    }\n    return ans;\n}"
        }
      ],
      "description": "Given a string `s`, rearrange the characters of `s` so that any two adjacent characters are not the same.\n\nReturn any possible rearrangement of `s` or return `\"\"` if not possible.\n\n \n\nExample 1:\n\nInput: s = \"aab\"\nOutput: \"aba\"\n\nExample 2:\n\nInput: s = \"aaab\"\nOutput: \"\"\n\n \n\nConstraints:\n\n\t• `1",
      "descriptionHtml": "<p>Given a string <code>s</code>, rearrange the characters of <code>s</code> so that any two adjacent characters are not the same.</p>\n\n<p>Return <em>any possible rearrangement of</em> <code>s</code> <em>or return</em> <code>&quot;&quot;</code> <em>if not possible</em>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<pre><strong>Input:</strong> s = \"aab\"\n<strong>Output:</strong> \"aba\"\n</pre><p><strong class=\"example\">Example 2:</strong></p>\n<pre><strong>Input:</strong> s = \"aaab\"\n<strong>Output:</strong> \"\"\n</pre>\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= s.length &lt;= 500</code></li>\n\t<li><code>s</code> consists of lowercase English letters.</li>\n</ul>\n",
      "lcSlug": "reorganize-string",
      "summary": "Always place most frequent char; swap if same as last or fail."
    },
    {
      "id": "hp-09",
      "title": "Last Stone Weight",
      "lc": 1046,
      "importance": "nice",
      "subtopic": "heap",
      "difficulty": "Easy",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "stones",
          "out": "weight"
        }
      ],
      "approaches": [
        {
          "name": "Max heap simulation",
          "time": "O(n log n)",
          "space": "O(n)",
          "code": "int lastStoneWeight(vector<int>& stones) {\n    priority_queue<int> pq(stones.begin(), stones.end());\n    while(pq.size()>1){ int a=pq.top(); pq.pop(); int b=pq.top(); pq.pop(); if(a!=b) pq.push(a-b); }\n    return pq.empty()? 0: pq.top();\n}"
        }
      ],
      "description": "You are given an array of integers `stones` where `stones[i]` is the weight of the `ith` stone.\n\nWe are playing a game with the stones. On each turn, we choose the heaviest two stones and smash them together. Suppose the heaviest two stones have weights `x` and `y` with `x \n\n\t• If `x == y`, both stones are destroyed, and\n• If `x != y`, the stone of weight `x` is destroyed, and the stone of weight `y` has new weight `y - x`.\n\nAt the end of the game, there is at most one stone left.\n\nReturn the weight of the last remaining stone. If there are no stones left, return `0`.\n\n \n\nExample 1:\n\nInput: stones = [2,7,4,1,8,1]\nOutput: 1\nExplanation: \nWe combine 7 and 8 to get 1 so the array converts to [2,4,1,1,1] then,\nwe combine 2 and 4 to get 2 so the array converts to [2,1,1,1] then,\nwe combine 2 and 1 to get 1 so the array converts to [1,1,1] then,\nwe combine 1 and 1 to get 0 so the array converts to [1] then that's the value of the last stone.\n\nExample 2:\n\nInput: stones = [1]\nOutput: 1\n\n \n\nConstraints:\n\n\t• `1",
      "descriptionHtml": "<p>You are given an array of integers <code>stones</code> where <code>stones[i]</code> is the weight of the <code>i<sup>th</sup></code> stone.</p>\n\n<p>We are playing a game with the stones. On each turn, we choose the <strong>heaviest two stones</strong> and smash them together. Suppose the heaviest two stones have weights <code>x</code> and <code>y</code> with <code>x &lt;= y</code>. The result of this smash is:</p>\n\n<ul>\n\t<li>If <code>x == y</code>, both stones are destroyed, and</li>\n\t<li>If <code>x != y</code>, the stone of weight <code>x</code> is destroyed, and the stone of weight <code>y</code> has new weight <code>y - x</code>.</li>\n</ul>\n\n<p>At the end of the game, there is <strong>at most one</strong> stone left.</p>\n\n<p>Return <em>the weight of the last remaining stone</em>. If there are no stones left, return <code>0</code>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> stones = [2,7,4,1,8,1]\n<strong>Output:</strong> 1\n<strong>Explanation:</strong> \nWe combine 7 and 8 to get 1 so the array converts to [2,4,1,1,1] then,\nwe combine 2 and 4 to get 2 so the array converts to [2,1,1,1] then,\nwe combine 2 and 1 to get 1 so the array converts to [1,1,1] then,\nwe combine 1 and 1 to get 0 so the array converts to [1] then that&#39;s the value of the last stone.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> stones = [1]\n<strong>Output:</strong> 1\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= stones.length &lt;= 30</code></li>\n\t<li><code>1 &lt;= stones[i] &lt;= 1000</code></li>\n</ul>\n",
      "lcSlug": "last-stone-weight",
      "summary": "Max heap simulation — Priority queue for top-K, merging streams, or greedy scheduling."
    },
    {
      "id": "hp-10",
      "title": "Kth Smallest Element in Sorted Matrix",
      "lc": 378,
      "importance": "should",
      "subtopic": "top-k",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "matrix,k",
          "out": "value"
        }
      ],
      "approaches": [
        {
          "name": "Kth in matrix",
          "time": "O(k log n)",
          "space": "O(n)",
          "code": "int kthSmallest(vector<vector<int>>& m, int k) {\n    priority_queue<vector<int>, vector<vector<int>>, greater<>> pq;\n    for (int i=0;i<(int)m.size();i++) pq.push({m[i][0],i,0});\n    while (true) {\n        auto t=pq.top(); pq.pop();\n        if (--k==0) return t[0];\n        if (t[2]+1<(int)m[t[1]].size()) pq.push({m[t[1]][t[2]+1], t[1], t[2]+1});\n    }\n}"
        }
      ],
      "description": "Given an `n x n` `matrix` where each of the rows and columns is sorted in ascending order, return the `kth` smallest element in the matrix.\n\nNote that it is the `kth` smallest element in the sorted order, not the `kth` distinct element.\n\nYou must find a solution with a memory complexity better than `O(n2)`.\n\n \n\nExample 1:\n\nInput: matrix = [[1,5,9],[10,11,13],[12,13,15]], k = 8\nOutput: 13\nExplanation: The elements in the matrix are [1,5,9,10,11,12,13,13,15], and the 8th smallest number is 13\n\nExample 2:\n\nInput: matrix = [[-5]], k = 1\nOutput: -5\n\n \n\nConstraints:\n\n\t• `n == matrix.length == matrix[i].length`\n• `1 9 9`\n• All the rows and columns of `matrix` are guaranteed to be sorted in non-decreasing order.\n• `1 2`\n\n \n\nFollow up:\n\n\t• Could you solve the problem with a constant memory (i.e., `O(1)` memory complexity)?\n• Could you solve the problem in `O(n)` time complexity? The solution may be too advanced for an interview but you may find reading this paper fun.",
      "descriptionHtml": "<p>Given an <code>n x n</code> <code>matrix</code> where each of the rows and columns is sorted in ascending order, return <em>the</em> <code>k<sup>th</sup></code> <em>smallest element in the matrix</em>.</p>\n\n<p>Note that it is the <code>k<sup>th</sup></code> smallest element <strong>in the sorted order</strong>, not the <code>k<sup>th</sup></code> <strong>distinct</strong> element.</p>\n\n<p>You must find a solution with a memory complexity better than <code>O(n<sup>2</sup>)</code>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> matrix = [[1,5,9],[10,11,13],[12,13,15]], k = 8\n<strong>Output:</strong> 13\n<strong>Explanation:</strong> The elements in the matrix are [1,5,9,10,11,12,13,<u><strong>13</strong></u>,15], and the 8<sup>th</sup> smallest number is 13\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> matrix = [[-5]], k = 1\n<strong>Output:</strong> -5\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>n == matrix.length == matrix[i].length</code></li>\n\t<li><code>1 &lt;= n &lt;= 300</code></li>\n\t<li><code>-10<sup>9</sup> &lt;= matrix[i][j] &lt;= 10<sup>9</sup></code></li>\n\t<li>All the rows and columns of <code>matrix</code> are <strong>guaranteed</strong> to be sorted in <strong>non-decreasing order</strong>.</li>\n\t<li><code>1 &lt;= k &lt;= n<sup>2</sup></code></li>\n</ul>\n\n<p>&nbsp;</p>\n<p><strong>Follow up:</strong></p>\n\n<ul>\n\t<li>Could you solve the problem with a constant memory (i.e., <code>O(1)</code> memory complexity)?</li>\n\t<li>Could you solve the problem in <code>O(n)</code> time complexity? The solution may be too advanced for an interview but you may find reading <a href=\"http://www.cse.yorku.ca/~andy/pubs/X+Y.pdf\" target=\"_blank\">this paper</a> fun.</li>\n</ul>\n",
      "lcSlug": "kth-smallest-element-in-a-sorted-matrix",
      "summary": "Kth in matrix — state invariant, then loop."
    },
    {
      "id": "hp-11",
      "title": "Find K Pairs with Smallest Sums",
      "lc": 373,
      "importance": "nice",
      "subtopic": "merge",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums1,nums2,k",
          "out": "pairs"
        }
      ],
      "approaches": [
        {
          "name": "Merge sorted",
          "time": "O(n)",
          "space": "O(1)",
          "code": "ListNode dummy; ListNode* tail=&dummy;\nwhile (a&&b) { attach smaller; move tail; }"
        }
      ],
      "description": "You are given two integer arrays `nums1` and `nums2` sorted in non-decreasing order and an integer `k`.\n\nDefine a pair `(u, v)` which consists of one element from the first array and one element from the second array.\n\nReturn the `k` pairs `(u1, v1), (u2, v2), ..., (uk, vk)` with the smallest sums.\n\n \n\nExample 1:\n\nInput: nums1 = [1,7,11], nums2 = [2,4,6], k = 3\nOutput: [[1,2],[1,4],[1,6]]\nExplanation: The first 3 pairs are returned from the sequence: [1,2],[1,4],[1,6],[7,2],[7,4],[11,2],[7,6],[11,4],[11,6]\n\nExample 2:\n\nInput: nums1 = [1,1,2], nums2 = [1,2,3], k = 2\nOutput: [[1,1],[1,1]]\nExplanation: The first 2 pairs are returned from the sequence: [1,1],[1,1],[1,2],[2,1],[1,2],[2,2],[1,3],[1,3],[2,3]\n\n \n\nConstraints:\n\n\t• `1 5`\n• `-109 9`\n• `nums1` and `nums2` both are sorted in non-decreasing order.\n• `1 4`\n• `k",
      "descriptionHtml": "<p>You are given two integer arrays <code>nums1</code> and <code>nums2</code> sorted in <strong>non-decreasing&nbsp;order</strong> and an integer <code>k</code>.</p>\n\n<p>Define a pair <code>(u, v)</code> which consists of one element from the first array and one element from the second array.</p>\n\n<p>Return <em>the</em> <code>k</code> <em>pairs</em> <code>(u<sub>1</sub>, v<sub>1</sub>), (u<sub>2</sub>, v<sub>2</sub>), ..., (u<sub>k</sub>, v<sub>k</sub>)</code> <em>with the smallest sums</em>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums1 = [1,7,11], nums2 = [2,4,6], k = 3\n<strong>Output:</strong> [[1,2],[1,4],[1,6]]\n<strong>Explanation:</strong> The first 3 pairs are returned from the sequence: [1,2],[1,4],[1,6],[7,2],[7,4],[11,2],[7,6],[11,4],[11,6]\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums1 = [1,1,2], nums2 = [1,2,3], k = 2\n<strong>Output:</strong> [[1,1],[1,1]]\n<strong>Explanation:</strong> The first 2 pairs are returned from the sequence: [1,1],[1,1],[1,2],[2,1],[1,2],[2,2],[1,3],[1,3],[2,3]\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= nums1.length, nums2.length &lt;= 10<sup>5</sup></code></li>\n\t<li><code>-10<sup>9</sup> &lt;= nums1[i], nums2[i] &lt;= 10<sup>9</sup></code></li>\n\t<li><code>nums1</code> and <code>nums2</code> both are sorted in <strong>non-decreasing order</strong>.</li>\n\t<li><code>1 &lt;= k &lt;= 10<sup>4</sup></code></li>\n\t<li><code>k &lt;=&nbsp;nums1.length *&nbsp;nums2.length</code></li>\n</ul>\n",
      "lcSlug": "find-k-pairs-with-smallest-sums",
      "summary": "Merge sorted — state invariant, then loop."
    },
    {
      "id": "hp-12",
      "title": "Smallest Range Covering K Lists",
      "lc": 632,
      "importance": "nice",
      "subtopic": "merge",
      "difficulty": "Hard",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "lists",
          "out": "range"
        }
      ],
      "approaches": [
        {
          "name": "Merge sorted",
          "time": "O(n)",
          "space": "O(1)",
          "code": "ListNode dummy; ListNode* tail=&dummy;\nwhile (a&&b) { attach smaller; move tail; }"
        }
      ],
      "description": "You have `k` lists of sorted integers in non-decreasing order. Find the smallest range that includes at least one number from each of the `k` lists.\n\nWe define the range `[a, b]` is smaller than range `[c, d]` if `b - a Example 1:\n\nInput: nums = [[4,10,15,24,26],[0,9,12,20],[5,18,22,30]]\nOutput: [20,24]\nExplanation: \nList 1: [4, 10, 15, 24,26], 24 is in range [20,24].\nList 2: [0, 9, 12, 20], 20 is in range [20,24].\nList 3: [5, 18, 22, 30], 22 is in range [20,24].\n\nExample 2:\n\nInput: nums = [[1,2,3],[1,2,3],[1,2,3]]\nOutput: [1,1]\n\n \n\nConstraints:\n\n\t• `nums.length == k`\n• `1 5 5`\n• `nums[i]` is sorted in non-decreasing order.",
      "descriptionHtml": "<p>You have <code>k</code> lists of sorted integers in <strong>non-decreasing&nbsp;order</strong>. Find the <b>smallest</b> range that includes at least one number from each of the <code>k</code> lists.</p>\n\n<p>We define the range <code>[a, b]</code> is smaller than range <code>[c, d]</code> if <code>b - a &lt; d - c</code> <strong>or</strong> <code>a &lt; c</code> if <code>b - a == d - c</code>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [[4,10,15,24,26],[0,9,12,20],[5,18,22,30]]\n<strong>Output:</strong> [20,24]\n<strong>Explanation: </strong>\nList 1: [4, 10, 15, 24,26], 24 is in range [20,24].\nList 2: [0, 9, 12, 20], 20 is in range [20,24].\nList 3: [5, 18, 22, 30], 22 is in range [20,24].\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [[1,2,3],[1,2,3],[1,2,3]]\n<strong>Output:</strong> [1,1]\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>nums.length == k</code></li>\n\t<li><code>1 &lt;= k &lt;= 3500</code></li>\n\t<li><code>1 &lt;= nums[i].length &lt;= 50</code></li>\n\t<li><code>-10<sup>5</sup> &lt;= nums[i][j] &lt;= 10<sup>5</sup></code></li>\n\t<li><code>nums[i]</code>&nbsp;is sorted in <strong>non-decreasing</strong> order.</li>\n</ul>\n",
      "lcSlug": "smallest-range-covering-elements-from-k-lists",
      "summary": "Merge sorted — state invariant, then loop."
    },
    {
      "id": "hp-13",
      "title": "Design Twitter",
      "lc": 355,
      "importance": "nice",
      "subtopic": "design",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "follow/tweet/newsfeed",
          "out": "feed"
        }
      ],
      "approaches": [
        {
          "name": "Hash + heap per user",
          "time": "O(log n) per op",
          "space": "O(n)",
          "code": "class Twitter {\n    struct Tweet{ int time,id; };\n    int timer=0; unordered_map<int,vector<Tweet>> posts;\n    unordered_map<int,unordered_set<int>> follows;\npublic:\n    void postTweet(int userId,int tweetId){ posts[userId].push_back({timer++,tweetId}); }\n    vector<int> getNewsFeed(int userId){\n        priority_queue<pair<int,int>> pq;\n        follows[userId].insert(userId);\n        for(int uid:follows[userId]){\n            auto& v=posts[uid];\n            if(!v.empty()) pq.push({v.back().time, uid});\n        }\n        vector<int> ans;\n        while(!pq.empty() && (int)ans.size()<10){\n            auto [t,uid]=pq.top(); pq.pop();\n            ans.push_back(posts[uid].back().id);\n            posts[uid].pop_back();\n            if(!posts[uid].empty()) pq.push({posts[uid].back().time, uid});\n        } return ans;\n    }\n    void follow(int a,int b){ follows[a].insert(b); }\n    void unfollow(int a,int b){ follows[a].erase(b); }\n};"
        }
      ],
      "description": "Design a simplified version of Twitter where users can post tweets, follow/unfollow another user, and is able to see the `10` most recent tweets in the user's news feed.\n\nImplement the `Twitter` class:\n\n\t• `Twitter()` Initializes your twitter object.\n• `void postTweet(int userId, int tweetId)` Composes a new tweet with ID `tweetId` by the user `userId`. Each call to this function will be made with a unique `tweetId`.\n• `List getNewsFeed(int userId)` Retrieves the `10` most recent tweet IDs in the user's news feed. Each item in the news feed must be posted by users who the user followed or by the user themself. Tweets must be ordered from most recent to least recent.\n• `void follow(int followerId, int followeeId)` The user with ID `followerId` started following the user with ID `followeeId`.\n• `void unfollow(int followerId, int followeeId)` The user with ID `followerId` started unfollowing the user with ID `followeeId`.\n\n \n\nExample 1:\n\nInput\n[\"Twitter\", \"postTweet\", \"getNewsFeed\", \"follow\", \"postTweet\", \"getNewsFeed\", \"unfollow\", \"getNewsFeed\"]\n[[], [1, 5], [1], [1, 2], [2, 6], [1], [1, 2], [1]]\nOutput\n[null, null, [5], null, null, [6, 5], null, [5]]\n\nExplanation\nTwitter twitter = new Twitter();\ntwitter.postTweet(1, 5); // User 1 posts a new tweet (id = 5).\ntwitter.getNewsFeed(1);  // User 1's news feed should return a list with 1 tweet id -> [5]. return [5]\ntwitter.follow(1, 2);    // User 1 follows user 2.\ntwitter.postTweet(2, 6); // User 2 posts a new tweet (id = 6).\ntwitter.getNewsFeed(1);  // User 1's news feed should return a list with 2 tweet ids -> [6, 5]. Tweet id 6 should precede tweet id 5 because it is posted after tweet id 5.\ntwitter.unfollow(1, 2);  // User 1 unfollows user 2.\ntwitter.getNewsFeed(1);  // User 1's news feed should return a list with 1 tweet id -> [5], since user 1 is no longer following user 2.\n\n \n\nConstraints:\n\n\t• `1 4`\n• All the tweets have unique IDs.\n• At most `3 * 104` calls will be made to `postTweet`, `getNewsFeed`, `follow`, and `unfollow`.\n• A user cannot follow himself.",
      "descriptionHtml": "<p>Design a simplified version of Twitter where users can post tweets, follow/unfollow another user, and is able to see the <code>10</code> most recent tweets in the user&#39;s news feed.</p>\n\n<p>Implement the <code>Twitter</code> class:</p>\n\n<ul>\n\t<li><code>Twitter()</code> Initializes your twitter object.</li>\n\t<li><code>void postTweet(int userId, int tweetId)</code> Composes a new tweet with ID <code>tweetId</code> by the user <code>userId</code>. Each call to this function will be made with a unique <code>tweetId</code>.</li>\n\t<li><code>List&lt;Integer&gt; getNewsFeed(int userId)</code> Retrieves the <code>10</code> most recent tweet IDs in the user&#39;s news feed. Each item in the news feed must be posted by users who the user followed or by the user themself. Tweets must be <strong>ordered from most recent to least recent</strong>.</li>\n\t<li><code>void follow(int followerId, int followeeId)</code> The user with ID <code>followerId</code> started following the user with ID <code>followeeId</code>.</li>\n\t<li><code>void unfollow(int followerId, int followeeId)</code> The user with ID <code>followerId</code> started unfollowing the user with ID <code>followeeId</code>.</li>\n</ul>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input</strong>\n[&quot;Twitter&quot;, &quot;postTweet&quot;, &quot;getNewsFeed&quot;, &quot;follow&quot;, &quot;postTweet&quot;, &quot;getNewsFeed&quot;, &quot;unfollow&quot;, &quot;getNewsFeed&quot;]\n[[], [1, 5], [1], [1, 2], [2, 6], [1], [1, 2], [1]]\n<strong>Output</strong>\n[null, null, [5], null, null, [6, 5], null, [5]]\n\n<strong>Explanation</strong>\nTwitter twitter = new Twitter();\ntwitter.postTweet(1, 5); // User 1 posts a new tweet (id = 5).\ntwitter.getNewsFeed(1);  // User 1&#39;s news feed should return a list with 1 tweet id -&gt; [5]. return [5]\ntwitter.follow(1, 2);    // User 1 follows user 2.\ntwitter.postTweet(2, 6); // User 2 posts a new tweet (id = 6).\ntwitter.getNewsFeed(1);  // User 1&#39;s news feed should return a list with 2 tweet ids -&gt; [6, 5]. Tweet id 6 should precede tweet id 5 because it is posted after tweet id 5.\ntwitter.unfollow(1, 2);  // User 1 unfollows user 2.\ntwitter.getNewsFeed(1);  // User 1&#39;s news feed should return a list with 1 tweet id -&gt; [5], since user 1 is no longer following user 2.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= userId, followerId, followeeId &lt;= 500</code></li>\n\t<li><code>0 &lt;= tweetId &lt;= 10<sup>4</sup></code></li>\n\t<li>All the tweets have <strong>unique</strong> IDs.</li>\n\t<li>At most <code>3 * 10<sup>4</sup></code> calls will be made to <code>postTweet</code>, <code>getNewsFeed</code>, <code>follow</code>, and <code>unfollow</code>.</li>\n\t<li>A user cannot follow himself.</li>\n</ul>\n",
      "lcSlug": "design-twitter",
      "summary": "Hash + heap per user — Class design with required operation complexities — map + structure."
    },
    {
      "id": "hp-14",
      "title": "Ugly Number II",
      "lc": 264,
      "importance": "should",
      "subtopic": "merge",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "n",
          "out": "nth ugly"
        }
      ],
      "approaches": [
        {
          "name": "Merge sorted",
          "time": "O(n)",
          "space": "O(1)",
          "code": "ListNode dummy; ListNode* tail=&dummy;\nwhile (a&&b) { attach smaller; move tail; }"
        }
      ],
      "description": "An ugly number is a positive integer whose prime factors are limited to `2`, `3`, and `5`.\n\nGiven an integer `n`, return the `nth` ugly number.\n\n \n\nExample 1:\n\nInput: n = 10\nOutput: 12\nExplanation: [1, 2, 3, 4, 5, 6, 8, 9, 10, 12] is the sequence of the first 10 ugly numbers.\n\nExample 2:\n\nInput: n = 1\nOutput: 1\nExplanation: 1 has no prime factors, therefore all of its prime factors are limited to 2, 3, and 5.\n\n \n\nConstraints:\n\n\t• `1",
      "descriptionHtml": "<p>An <strong>ugly number</strong> is a positive integer whose prime factors are limited to <code>2</code>, <code>3</code>, and <code>5</code>.</p>\n\n<p>Given an integer <code>n</code>, return <em>the</em> <code>n<sup>th</sup></code> <em><strong>ugly number</strong></em>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> n = 10\n<strong>Output:</strong> 12\n<strong>Explanation:</strong> [1, 2, 3, 4, 5, 6, 8, 9, 10, 12] is the sequence of the first 10 ugly numbers.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> n = 1\n<strong>Output:</strong> 1\n<strong>Explanation:</strong> 1 has no prime factors, therefore all of its prime factors are limited to 2, 3, and 5.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= n &lt;= 1690</code></li>\n</ul>\n",
      "lcSlug": "ugly-number-ii",
      "summary": "Merge sorted — state invariant, then loop."
    },
    {
      "id": "hp-15",
      "title": "Super Ugly Number",
      "lc": 313,
      "importance": "nice",
      "subtopic": "merge",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "n, primes",
          "out": "number"
        }
      ],
      "approaches": [
        {
          "name": "Merge sorted",
          "time": "O(n)",
          "space": "O(1)",
          "code": "ListNode dummy; ListNode* tail=&dummy;\nwhile (a&&b) { attach smaller; move tail; }"
        }
      ],
      "description": "A super ugly number is a positive integer whose prime factors are in the array `primes`.\n\nGiven an integer `n` and an array of integers `primes`, return the `nth` super ugly number.\n\nThe `nth` super ugly number is guaranteed to fit in a 32-bit signed integer.\n\n \n\nExample 1:\n\nInput: n = 12, primes = [2,7,13,19]\nOutput: 32\nExplanation: [1,2,4,7,8,13,14,16,19,26,28,32] is the sequence of the first 12 super ugly numbers given primes = [2,7,13,19].\n\nExample 2:\n\nInput: n = 1, primes = [2,3,5]\nOutput: 1\nExplanation: 1 has no prime factors, therefore all of its prime factors are in the array primes = [2,3,5].\n\n \n\nConstraints:\n\n\t• `1 5`\n• `1",
      "descriptionHtml": "<p>A <strong>super ugly number</strong> is a positive integer whose prime factors are in the array <code>primes</code>.</p>\n\n<p>Given an integer <code>n</code> and an array of integers <code>primes</code>, return <em>the</em> <code>n<sup>th</sup></code> <em><strong>super ugly number</strong></em>.</p>\n\n<p>The <code>n<sup>th</sup></code> <strong>super ugly number</strong> is <strong>guaranteed</strong> to fit in a <strong>32-bit</strong> signed integer.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> n = 12, primes = [2,7,13,19]\n<strong>Output:</strong> 32\n<strong>Explanation:</strong> [1,2,4,7,8,13,14,16,19,26,28,32] is the sequence of the first 12 super ugly numbers given primes = [2,7,13,19].\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> n = 1, primes = [2,3,5]\n<strong>Output:</strong> 1\n<strong>Explanation:</strong> 1 has no prime factors, therefore all of its prime factors are in the array primes = [2,3,5].\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= n &lt;= 10<sup>5</sup></code></li>\n\t<li><code>1 &lt;= primes.length &lt;= 100</code></li>\n\t<li><code>2 &lt;= primes[i] &lt;= 1000</code></li>\n\t<li><code>primes[i]</code> is <strong>guaranteed</strong> to be a prime number.</li>\n\t<li>All the values of <code>primes</code> are <strong>unique</strong> and sorted in <strong>ascending order</strong>.</li>\n</ul>\n",
      "lcSlug": "super-ugly-number",
      "summary": "Merge sorted — state invariant, then loop."
    },
    {
      "id": "hp-16",
      "title": "IPO",
      "lc": 502,
      "importance": "nice",
      "subtopic": "scheduling",
      "difficulty": "Hard",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "k,w,...",
          "out": "max capital"
        }
      ],
      "approaches": [
        {
          "name": "Heap greedy",
          "time": "O(n log n)",
          "space": "O(n)",
          "code": "int findMaximizedCapital(int k, int w, vector<int>& profits, vector<int>& capital) {\n    int n=profits.size(); vector<pair<int,int>> projects(n);\n    for(int i=0;i<n;i++) projects[i]={capital[i],profits[i]};\n    sort(projects.begin(), projects.end());\n    priority_queue<int> pq; int i=0;\n    while(k--){\n        while(i<n && projects[i].first<=w) pq.push(projects[i++].second);\n        if(pq.empty()) break;\n        w+=pq.top(); pq.pop();\n    } return w;\n}"
        }
      ],
      "description": "Suppose LeetCode will start its IPO soon. In order to sell a good price of its shares to Venture Capital, LeetCode would like to work on some projects to increase its capital before the IPO. Since it has limited resources, it can only finish at most `k` distinct projects before the IPO. Help LeetCode design the best way to maximize its total capital after finishing at most `k` distinct projects.\n\nYou are given `n` projects where the `ith` project has a pure profit `profits[i]` and a minimum capital of `capital[i]` is needed to start it.\n\nInitially, you have `w` capital. When you finish a project, you will obtain its pure profit and the profit will be added to your total capital.\n\nPick a list of at most `k` distinct projects from given projects to maximize your final capital, and return the final maximized capital.\n\nThe answer is guaranteed to fit in a 32-bit signed integer.\n\n \n\nExample 1:\n\nInput: k = 2, w = 0, profits = [1,2,3], capital = [0,1,1]\nOutput: 4\nExplanation: Since your initial capital is 0, you can only start the project indexed 0.\nAfter finishing it you will obtain profit 1 and your capital becomes 1.\nWith capital 1, you can either start the project indexed 1 or the project indexed 2.\nSince you can choose at most 2 projects, you need to finish the project indexed 2 to get the maximum capital.\nTherefore, output the final maximized capital, which is 0 + 1 + 3 = 4.\n\nExample 2:\n\nInput: k = 3, w = 0, profits = [1,2,3], capital = [0,1,2]\nOutput: 6\n\n \n\nConstraints:\n\n\t• `1 5`\n• `0 9`\n• `n == profits.length`\n• `n == capital.length`\n• `1 5`\n• `0 4`\n• `0 9`",
      "descriptionHtml": "<p>Suppose LeetCode will start its <strong>IPO</strong> soon. In order to sell a good price of its shares to Venture Capital, LeetCode would like to work on some projects to increase its capital before the <strong>IPO</strong>. Since it has limited resources, it can only finish at most <code>k</code> distinct projects before the <strong>IPO</strong>. Help LeetCode design the best way to maximize its total capital after finishing at most <code>k</code> distinct projects.</p>\n\n<p>You are given <code>n</code> projects where the <code>i<sup>th</sup></code> project has a pure profit <code>profits[i]</code> and a minimum capital of <code>capital[i]</code> is needed to start it.</p>\n\n<p>Initially, you have <code>w</code> capital. When you finish a project, you will obtain its pure profit and the profit will be added to your total capital.</p>\n\n<p>Pick a list of <strong>at most</strong> <code>k</code> distinct projects from given projects to <strong>maximize your final capital</strong>, and return <em>the final maximized capital</em>.</p>\n\n<p>The answer is guaranteed to fit in a 32-bit signed integer.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> k = 2, w = 0, profits = [1,2,3], capital = [0,1,1]\n<strong>Output:</strong> 4\n<strong>Explanation:</strong> Since your initial capital is 0, you can only start the project indexed 0.\nAfter finishing it you will obtain profit 1 and your capital becomes 1.\nWith capital 1, you can either start the project indexed 1 or the project indexed 2.\nSince you can choose at most 2 projects, you need to finish the project indexed 2 to get the maximum capital.\nTherefore, output the final maximized capital, which is 0 + 1 + 3 = 4.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> k = 3, w = 0, profits = [1,2,3], capital = [0,1,2]\n<strong>Output:</strong> 6\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= k &lt;= 10<sup>5</sup></code></li>\n\t<li><code>0 &lt;= w &lt;= 10<sup>9</sup></code></li>\n\t<li><code>n == profits.length</code></li>\n\t<li><code>n == capital.length</code></li>\n\t<li><code>1 &lt;= n &lt;= 10<sup>5</sup></code></li>\n\t<li><code>0 &lt;= profits[i] &lt;= 10<sup>4</sup></code></li>\n\t<li><code>0 &lt;= capital[i] &lt;= 10<sup>9</sup></code></li>\n</ul>\n",
      "lcSlug": "ipo",
      "summary": "Heap greedy — Priority queue for top-K, merging streams, or greedy scheduling."
    },
    {
      "id": "hp-17",
      "title": "Minimum Cost to Hire K Workers",
      "lc": 857,
      "importance": "nice",
      "subtopic": "top-k",
      "difficulty": "Hard",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "quality,wage,k",
          "out": "min cost"
        }
      ],
      "approaches": [
        {
          "name": "Sort ratio + heap",
          "time": "O(n log n)",
          "space": "O(n)",
          "code": "double mincostToHireWorkers(vector<int>& quality, vector<int>& wage, int k) {\n    int n=quality.size(); vector<pair<double,int>> workers(n);\n    for(int i=0;i<n;i++) workers[i]={(double)wage[i]/quality[i], quality[i]};\n    sort(workers.begin(), workers.end());\n    priority_queue<int> pq; int sumQ=0; double ans=1e18;\n    for(auto& [ratio,q]: workers){\n        pq.push(q); sumQ+=q;\n        if((int)pq.size()>k){ sumQ-=pq.top(); pq.pop(); }\n        if((int)pq.size()==k) ans=min(ans, ratio*sumQ);\n    } return ans;\n}"
        }
      ],
      "description": "There are `n` workers. You are given two integer arrays `quality` and `wage` where `quality[i]` is the quality of the `ith` worker and `wage[i]` is the minimum wage expectation for the `ith` worker.\n\nWe want to hire exactly `k` workers to form a paid group. To hire a group of `k` workers, we must pay them according to the following rules:\n\n\t• Every worker in the paid group must be paid at least their minimum wage expectation.\n• In the group, each worker's pay must be directly proportional to their quality. This means if a worker&rsquo;s quality is double that of another worker in the group, then they must be paid twice as much as the other worker.\n\nGiven the integer `k`, return the least amount of money needed to form a paid group satisfying the above conditions. Answers within `10-5` of the actual answer will be accepted.\n\n \n\nExample 1:\n\nInput: quality = [10,20,5], wage = [70,50,30], k = 2\nOutput: 105.00000\nExplanation: We pay 70 to 0th worker and 35 to 2nd worker.\n\nExample 2:\n\nInput: quality = [3,1,10,10,1], wage = [4,8,2,2,7], k = 3\nOutput: 30.66667\nExplanation: We pay 4 to 0th worker, 13.33333 to 2nd and 3rd workers separately.\n\n \n\nConstraints:\n\n\t• `n == quality.length == wage.length`\n• `1 4`\n• `1 4`",
      "descriptionHtml": "<p>There are <code>n</code> workers. You are given two integer arrays <code>quality</code> and <code>wage</code> where <code>quality[i]</code> is the quality of the <code>i<sup>th</sup></code> worker and <code>wage[i]</code> is the minimum wage expectation for the <code>i<sup>th</sup></code> worker.</p>\n\n<p>We want to hire exactly <code>k</code> workers to form a <strong>paid group</strong>. To hire a group of <code>k</code> workers, we must pay them according to the following rules:</p>\n\n<ol>\n\t<li>Every worker in the paid group must be paid at least their minimum wage expectation.</li>\n\t<li>In the group, each worker&#39;s pay must be directly proportional to their quality. This means if a worker&rsquo;s quality is double that of another worker in the group, then they must be paid twice as much as the other worker.</li>\n</ol>\n\n<p>Given the integer <code>k</code>, return <em>the least amount of money needed to form a paid group satisfying the above conditions</em>. Answers within <code>10<sup>-5</sup></code> of the actual answer will be accepted.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> quality = [10,20,5], wage = [70,50,30], k = 2\n<strong>Output:</strong> 105.00000\n<strong>Explanation:</strong> We pay 70 to 0<sup>th</sup> worker and 35 to 2<sup>nd</sup> worker.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> quality = [3,1,10,10,1], wage = [4,8,2,2,7], k = 3\n<strong>Output:</strong> 30.66667\n<strong>Explanation:</strong> We pay 4 to 0<sup>th</sup> worker, 13.33333 to 2<sup>nd</sup> and 3<sup>rd</sup> workers separately.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>n == quality.length == wage.length</code></li>\n\t<li><code>1 &lt;= k &lt;= n &lt;= 10<sup>4</sup></code></li>\n\t<li><code>1 &lt;= quality[i], wage[i] &lt;= 10<sup>4</sup></code></li>\n</ul>\n",
      "lcSlug": "minimum-cost-to-hire-k-workers",
      "summary": "Sort ratio + heap — state invariant, then loop."
    },
    {
      "id": "hp-18",
      "title": "Sliding Window Median",
      "lc": 480,
      "importance": "nice",
      "subtopic": "two-heaps",
      "difficulty": "Hard",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums,k",
          "out": "medians"
        }
      ],
      "approaches": [
        {
          "name": "Two heaps window",
          "time": "O(n log k)",
          "space": "O(k)",
          "code": "vector<double> medianSlidingWindow(vector<int>& nums, int k) {\n    multiset<int> lo, hi;\n    auto rebalance=[&](){\n        while((int)lo.size()>(k+1)/2){ hi.insert(*lo.rbegin()); lo.erase(prev(lo.end())); }\n        while((int)lo.size()<(k+1)/2){ lo.insert(*hi.begin()); hi.erase(hi.begin()); }\n    };\n    vector<double> ans;\n    for(int i=0;i<(int)nums.size();i++){\n        if(i>=k){ int out=nums[i-k]; if(lo.count(out)) lo.erase(lo.find(out)); else hi.erase(hi.find(out)); }\n        if(lo.empty()||nums[i]<=*lo.rbegin()) lo.insert(nums[i]); else hi.insert(nums[i]);\n        rebalance();\n        if(i>=k-1) ans.push_back(k%2? *lo.rbegin() : ((long long)*lo.rbegin()+*hi.begin())/2.0);\n    } return ans;\n}"
        }
      ],
      "description": "The median is the middle value in an ordered integer list. If the size of the list is even, there is no middle value. So the median is the mean of the two middle values.\n\n\t• For examples, if `arr = [2,3,4]`, the median is `3`.\n• For examples, if `arr = [1,2,3,4]`, the median is `(2 + 3) / 2 = 2.5`.\n\nYou are given an integer array `nums` and an integer `k`. There is a sliding window of size `k` which is moving from the very left of the array to the very right. You can only see the `k` numbers in the window. Each time the sliding window moves right by one position.\n\nReturn the median array for each window in the original array. Answers within `10-5` of the actual value will be accepted.\n\n \n\nExample 1:\n\nInput: nums = [1,3,-1,-3,5,3,6,7], k = 3\nOutput: [1.00000,-1.00000,-1.00000,3.00000,5.00000,6.00000]\nExplanation: \nWindow position                Median\n---------------                -----\n[1  3  -1] -3  5  3  6  7        1\n 1 [3  -1  -3] 5  3  6  7       -1\n 1  3 [-1  -3  5] 3  6  7       -1\n 1  3  -1 [-3  5  3] 6  7        3\n 1  3  -1  -3 [5  3  6] 7        5\n 1  3  -1  -3  5 [3  6  7]       6\n\nExample 2:\n\nInput: nums = [1,2,3,4,2,3,1,4,2], k = 3\nOutput: [2.00000,3.00000,3.00000,3.00000,2.00000,3.00000,2.00000]\n\n \n\nConstraints:\n\n\t• `1 5`\n• `-231 31 - 1`",
      "descriptionHtml": "<p>The <strong>median</strong> is the middle value in an ordered integer list. If the size of the list is even, there is no middle value. So the median is the mean of the two middle values.</p>\n\n<ul>\n\t<li>For examples, if <code>arr = [2,<u>3</u>,4]</code>, the median is <code>3</code>.</li>\n\t<li>For examples, if <code>arr = [1,<u>2,3</u>,4]</code>, the median is <code>(2 + 3) / 2 = 2.5</code>.</li>\n</ul>\n\n<p>You are given an integer array <code>nums</code> and an integer <code>k</code>. There is a sliding window of size <code>k</code> which is moving from the very left of the array to the very right. You can only see the <code>k</code> numbers in the window. Each time the sliding window moves right by one position.</p>\n\n<p>Return <em>the median array for each window in the original array</em>. Answers within <code>10<sup>-5</sup></code> of the actual value will be accepted.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [1,3,-1,-3,5,3,6,7], k = 3\n<strong>Output:</strong> [1.00000,-1.00000,-1.00000,3.00000,5.00000,6.00000]\n<strong>Explanation:</strong> \nWindow position                Median\n---------------                -----\n[<strong>1  3  -1</strong>] -3  5  3  6  7        1\n 1 [<strong>3  -1  -3</strong>] 5  3  6  7       -1\n 1  3 [<strong>-1  -3  5</strong>] 3  6  7       -1\n 1  3  -1 [<strong>-3  5  3</strong>] 6  7        3\n 1  3  -1  -3 [<strong>5  3  6</strong>] 7        5\n 1  3  -1  -3  5 [<strong>3  6  7</strong>]       6\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [1,2,3,4,2,3,1,4,2], k = 3\n<strong>Output:</strong> [2.00000,3.00000,3.00000,3.00000,2.00000,3.00000,2.00000]\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= k &lt;= nums.length &lt;= 10<sup>5</sup></code></li>\n\t<li><code>-2<sup>31</sup> &lt;= nums[i] &lt;= 2<sup>31</sup> - 1</code></li>\n</ul>\n",
      "lcSlug": "sliding-window-median",
      "summary": "Two heaps window — state invariant, then loop."
    }
  ]
};
