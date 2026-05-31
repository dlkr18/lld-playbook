window.PRACTICE_TOPIC = {
  "id": "intervals",
  "title": "Intervals",
  "expected_count": 20,
  "strategy": "<strong>Speed-run:</strong> Sort by start/end then merge or sweep — meeting rooms is the template. Filter <em>Must do</em> first.",
  "subtopics": [
    {
      "id": "merge",
      "label": "Merge"
    },
    {
      "id": "greedy",
      "label": "Greedy"
    },
    {
      "id": "heap",
      "label": "Heap"
    },
    {
      "id": "design",
      "label": "Design"
    },
    {
      "id": "sweep",
      "label": "Sweep Line"
    }
  ],
  "questions": [
    {
      "id": "iv-01",
      "title": "Merge Intervals",
      "lc": 56,
      "importance": "must",
      "subtopic": "merge",
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
      "id": "iv-02",
      "title": "Insert Interval",
      "lc": 57,
      "importance": "must",
      "subtopic": "merge",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "intervals,new",
          "out": "result"
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
      "id": "iv-03",
      "title": "Non-overlapping Intervals",
      "lc": 435,
      "importance": "must",
      "subtopic": "greedy",
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
      "id": "iv-04",
      "title": "Meeting Rooms",
      "lc": 252,
      "importance": "must",
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
      "id": "iv-05",
      "title": "Meeting Rooms II",
      "lc": 253,
      "importance": "must",
      "subtopic": "heap",
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
      "id": "iv-06",
      "title": "Minimum Interval to Include Each Query",
      "lc": 1851,
      "importance": "nice",
      "subtopic": "sort",
      "difficulty": "Hard",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "intervals,queries",
          "out": "answers"
        }
      ],
      "approaches": [
        {
          "name": "Sort + check query",
          "time": "O(n log n + q log n)",
          "space": "O(n)",
          "code": "vector<int> minInterval(vector<vector<int>>& iv, vector<int>& queries) {\n    sort(iv.begin(), iv.end());\n    vector<pair<int,int>> qs; for(int i=0;i<(int)queries.size();i++) qs.push_back({queries[i],i});\n    sort(qs.begin(), qs.end());\n    priority_queue<pair<int,int>, vector<pair<int,int>>, greater<>> pq;\n    vector<int> ans(queries.size(), -1); int j=0;\n    for(auto& [q,idx]: qs){\n        while(j<(int)iv.size() && iv[j][0]<=q) pq.push({iv[j][1]-iv[j][0]+1, iv[j][1]});\n        while(!pq.empty() && pq.top().second<q) pq.pop();\n        if(!pq.empty()) ans[idx]=pq.top().first;\n    } return ans;\n}"
        }
      ],
      "description": "You are given a 2D integer array `intervals`, where `intervals[i] = [lefti, righti]` describes the `ith` interval starting at `lefti` and ending at `righti` (inclusive). The size of an interval is defined as the number of integers it contains, or more formally `righti - lefti + 1`.\n\nYou are also given an integer array `queries`. The answer to the `jth` query is the size of the smallest interval `i` such that `lefti i`. If no such interval exists, the answer is `-1`.\n\nReturn an array containing the answers to the queries.\n\n \n\nExample 1:\n\nInput: intervals = [[1,4],[2,4],[3,6],[4,4]], queries = [2,3,4,5]\nOutput: [3,3,1,4]\nExplanation: The queries are processed as follows:\n- Query = 2: The interval [2,4] is the smallest interval containing 2. The answer is 4 - 2 + 1 = 3.\n- Query = 3: The interval [2,4] is the smallest interval containing 3. The answer is 4 - 2 + 1 = 3.\n- Query = 4: The interval [4,4] is the smallest interval containing 4. The answer is 4 - 4 + 1 = 1.\n- Query = 5: The interval [3,6] is the smallest interval containing 5. The answer is 6 - 3 + 1 = 4.\n\nExample 2:\n\nInput: intervals = [[2,3],[2,5],[1,8],[20,25]], queries = [2,19,5,22]\nOutput: [2,-1,4,6]\nExplanation: The queries are processed as follows:\n- Query = 2: The interval [2,3] is the smallest interval containing 2. The answer is 3 - 2 + 1 = 2.\n- Query = 19: None of the intervals contain 19. The answer is -1.\n- Query = 5: The interval [2,5] is the smallest interval containing 5. The answer is 5 - 2 + 1 = 4.\n- Query = 22: The interval [20,25] is the smallest interval containing 22. The answer is 25 - 20 + 1 = 6.\n\n \n\nConstraints:\n\n\t• `1 5`\n• `1 5`\n• `intervals[i].length == 2`\n• `1 i i 7`\n• `1 7`",
      "descriptionHtml": "<p>You are given a 2D integer array <code>intervals</code>, where <code>intervals[i] = [left<sub>i</sub>, right<sub>i</sub>]</code> describes the <code>i<sup>th</sup></code> interval starting at <code>left<sub>i</sub></code> and ending at <code>right<sub>i</sub></code> <strong>(inclusive)</strong>. The <strong>size</strong> of an interval is defined as the number of integers it contains, or more formally <code>right<sub>i</sub> - left<sub>i</sub> + 1</code>.</p>\n\n<p>You are also given an integer array <code>queries</code>. The answer to the <code>j<sup>th</sup></code> query is the <strong>size of the smallest interval</strong> <code>i</code> such that <code>left<sub>i</sub> &lt;= queries[j] &lt;= right<sub>i</sub></code>. If no such interval exists, the answer is <code>-1</code>.</p>\n\n<p>Return <em>an array containing the answers to the queries</em>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> intervals = [[1,4],[2,4],[3,6],[4,4]], queries = [2,3,4,5]\n<strong>Output:</strong> [3,3,1,4]\n<strong>Explanation:</strong> The queries are processed as follows:\n- Query = 2: The interval [2,4] is the smallest interval containing 2. The answer is 4 - 2 + 1 = 3.\n- Query = 3: The interval [2,4] is the smallest interval containing 3. The answer is 4 - 2 + 1 = 3.\n- Query = 4: The interval [4,4] is the smallest interval containing 4. The answer is 4 - 4 + 1 = 1.\n- Query = 5: The interval [3,6] is the smallest interval containing 5. The answer is 6 - 3 + 1 = 4.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> intervals = [[2,3],[2,5],[1,8],[20,25]], queries = [2,19,5,22]\n<strong>Output:</strong> [2,-1,4,6]\n<strong>Explanation:</strong> The queries are processed as follows:\n- Query = 2: The interval [2,3] is the smallest interval containing 2. The answer is 3 - 2 + 1 = 2.\n- Query = 19: None of the intervals contain 19. The answer is -1.\n- Query = 5: The interval [2,5] is the smallest interval containing 5. The answer is 5 - 2 + 1 = 4.\n- Query = 22: The interval [20,25] is the smallest interval containing 22. The answer is 25 - 20 + 1 = 6.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= intervals.length &lt;= 10<sup>5</sup></code></li>\n\t<li><code>1 &lt;= queries.length &lt;= 10<sup>5</sup></code></li>\n\t<li><code>intervals[i].length == 2</code></li>\n\t<li><code>1 &lt;= left<sub>i</sub> &lt;= right<sub>i</sub> &lt;= 10<sup>7</sup></code></li>\n\t<li><code>1 &lt;= queries[j] &lt;= 10<sup>7</sup></code></li>\n</ul>\n",
      "lcSlug": "minimum-interval-to-include-each-query",
      "summary": "Sort + check query — state invariant, then loop."
    },
    {
      "id": "iv-07",
      "title": "Employee Free Time",
      "lc": 759,
      "importance": "should",
      "subtopic": "merge",
      "difficulty": "Hard",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "schedules",
          "out": "free slots"
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
      "description": "We are given a list `schedule` of employees, which represents the working time for each employee.\n\nEach employee has a list of non-overlapping `Intervals`, and these intervals are in sorted order.\n\nReturn the list of finite intervals representing common, positive-length free time for all employees, also in sorted order.\n\n(Even though we are representing `Intervals` in the form `[x, y]`, the objects inside are `Intervals`, not lists or arrays. For example, `schedule[0][0].start = 1`, `schedule[0][0].end = 2`, and `schedule[0][0][0]` is not defined).&nbsp; Also, we wouldn't include intervals like [5, 5] in our answer, as they have zero length.\n\n&nbsp;\n\nExample 1:\n\nInput: schedule = [[[1,2],[5,6]],[[1,3]],[[4,10]]]\nOutput: [[3,4]]\nExplanation: There are a total of three employees, and all common\nfree time intervals would be [-inf, 1], [3, 4], [10, inf].\nWe discard any intervals that contain inf as they aren't finite.\n\nExample 2:\n\nInput: schedule = [[[1,3],[6,7]],[[2,4]],[[2,5],[9,12]]]\nOutput: [[5,6],[7,9]]\n\n&nbsp;\n\nConstraints:\n\n\t• `1",
      "descriptionHtml": "<p>We are given a list <code>schedule</code> of employees, which represents the working time for each employee.</p>\n\n<p>Each employee has a list of non-overlapping <code>Intervals</code>, and these intervals are in sorted order.</p>\n\n<p>Return the list of finite intervals representing <b>common, positive-length free time</b> for <i>all</i> employees, also in sorted order.</p>\n\n<p>(Even though we are representing <code>Intervals</code> in the form <code>[x, y]</code>, the objects inside are <code>Intervals</code>, not lists or arrays. For example, <code>schedule[0][0].start = 1</code>, <code>schedule[0][0].end = 2</code>, and <code>schedule[0][0][0]</code> is not defined).&nbsp; Also, we wouldn&#39;t include intervals like [5, 5] in our answer, as they have zero length.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> schedule = [[[1,2],[5,6]],[[1,3]],[[4,10]]]\n<strong>Output:</strong> [[3,4]]\n<strong>Explanation:</strong> There are a total of three employees, and all common\nfree time intervals would be [-inf, 1], [3, 4], [10, inf].\nWe discard any intervals that contain inf as they aren&#39;t finite.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> schedule = [[[1,3],[6,7]],[[2,4]],[[2,5],[9,12]]]\n<strong>Output:</strong> [[5,6],[7,9]]\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 <= schedule.length , schedule[i].length <= 50</code></li>\n\t<li><code>0 <= schedule[i].start < schedule[i].end <= 10^8</code></li>\n</ul>",
      "lcSlug": "employee-free-time",
      "summary": "Merge sorted — state invariant, then loop."
    },
    {
      "id": "iv-08",
      "title": "Interval List Intersections",
      "lc": 986,
      "importance": "should",
      "subtopic": "two-ptr",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "A,B",
          "out": "intersections"
        }
      ],
      "approaches": [
        {
          "name": "Two pointers merge",
          "time": "O(n+m)",
          "space": "O(1)",
          "code": "vector<vector<int>> intervalIntersection(vector<vector<int>>& a, vector<vector<int>>& b) {\n    vector<vector<int>> ans; int i = 0, j = 0;\n    while (i < (int)a.size() && j < (int)b.size()) {\n        int lo = max(a[i][0], b[j][0]), hi = min(a[i][1], b[j][1]);\n        if (lo <= hi) ans.push_back({lo, hi});\n        if (a[i][1] < b[j][1]) i++; else j++;\n    }\n    return ans;\n}"
        }
      ],
      "description": "You are given two lists of closed intervals, `firstList` and `secondList`, where `firstList[i] = [starti, endi]` and `secondList[j] = [startj, endj]`. Each list of intervals is pairwise disjoint and in sorted order.\n\nReturn the intersection of these two interval lists.\n\nA closed interval `[a, b]` (with `a Example 1:\n\nInput: firstList = [[0,2],[5,10],[13,23],[24,25]], secondList = [[1,5],[8,12],[15,24],[25,26]]\nOutput: [[1,2],[5,5],[8,10],[15,23],[24,24],[25,25]]\n\nExample 2:\n\nInput: firstList = [[1,3],[5,9]], secondList = []\nOutput: []\n\n \n\nConstraints:\n\n\t• `0 = 1`\n• `0 i i 9`\n• `endi i+1`\n• `0 j j 9 `\n• `endj j+1`",
      "descriptionHtml": "<p>You are given two lists of closed intervals, <code>firstList</code> and <code>secondList</code>, where <code>firstList[i] = [start<sub>i</sub>, end<sub>i</sub>]</code> and <code>secondList[j] = [start<sub>j</sub>, end<sub>j</sub>]</code>. Each list of intervals is pairwise <strong>disjoint</strong> and in <strong>sorted order</strong>.</p>\n\n<p>Return <em>the intersection of these two interval lists</em>.</p>\n\n<p>A <strong>closed interval</strong> <code>[a, b]</code> (with <code>a &lt;= b</code>) denotes the set of real numbers <code>x</code> with <code>a &lt;= x &lt;= b</code>.</p>\n\n<p>The <strong>intersection</strong> of two closed intervals is a set of real numbers that are either empty or represented as a closed interval. For example, the intersection of <code>[1, 3]</code> and <code>[2, 4]</code> is <code>[2, 3]</code>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2019/01/30/interval1.png\" style=\"width: 700px; height: 194px;\" />\n<pre>\n<strong>Input:</strong> firstList = [[0,2],[5,10],[13,23],[24,25]], secondList = [[1,5],[8,12],[15,24],[25,26]]\n<strong>Output:</strong> [[1,2],[5,5],[8,10],[15,23],[24,24],[25,25]]\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> firstList = [[1,3],[5,9]], secondList = []\n<strong>Output:</strong> []\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>0 &lt;= firstList.length, secondList.length &lt;= 1000</code></li>\n\t<li><code>firstList.length + secondList.length &gt;= 1</code></li>\n\t<li><code>0 &lt;= start<sub>i</sub> &lt; end<sub>i</sub> &lt;= 10<sup>9</sup></code></li>\n\t<li><code>end<sub>i</sub> &lt; start<sub>i+1</sub></code></li>\n\t<li><code>0 &lt;= start<sub>j</sub> &lt; end<sub>j</sub> &lt;= 10<sup>9</sup> </code></li>\n\t<li><code>end<sub>j</sub> &lt; start<sub>j+1</sub></code></li>\n</ul>\n",
      "lcSlug": "interval-list-intersections",
      "summary": "Merge two sorted sequences by comparing fronts."
    },
    {
      "id": "iv-09",
      "title": "My Calendar I",
      "lc": 729,
      "importance": "should",
      "subtopic": "design",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "bookings",
          "out": "true/false"
        }
      ],
      "approaches": [
        {
          "name": "Sorted list overlap",
          "time": "O(n^2)",
          "space": "O(n)",
          "code": "class MyCalendar {\n    vector<pair<int,int>> ev;\npublic:\n    bool book(int start, int end) {\n        for (auto& p : ev) if (max(p.first, start) < min(p.second, end)) return false;\n        ev.push_back({start, end}); return true;\n    }\n};"
        }
      ],
      "description": "You are implementing a program to use as your calendar. We can add a new event if adding the event will not cause a double booking.\n\nA double booking happens when two events have some non-empty intersection (i.e., some moment is common to both events.).\n\nThe event can be represented as a pair of integers `startTime` and `endTime` that represents a booking on the half-open interval `[startTime, endTime)`, the range of real numbers `x` such that `startTime \n\n\t• `MyCalendar()` Initializes the calendar object.\n• `boolean book(int startTime, int endTime)` Returns `true` if the event can be added to the calendar successfully without causing a double booking. Otherwise, return `false` and do not add the event to the calendar.\n\n \n\nExample 1:\n\nInput\n[\"MyCalendar\", \"book\", \"book\", \"book\"]\n[[], [10, 20], [15, 25], [20, 30]]\nOutput\n[null, true, false, true]\n\nExplanation\nMyCalendar myCalendar = new MyCalendar();\nmyCalendar.book(10, 20); // return True\nmyCalendar.book(15, 25); // return False, It can not be booked because time 15 is already booked by another event.\nmyCalendar.book(20, 30); // return True, The event can be booked, as the first event takes every time less than 20, but not including 20.\n\n \n\nConstraints:\n\n\t• `0 9`\n• At most `1000` calls will be made to `book`.",
      "descriptionHtml": "<p>You are implementing a program to use as your calendar. We can add a new event if adding the event will not cause a <strong>double booking</strong>.</p>\n\n<p>A <strong>double booking</strong> happens when two events have some non-empty intersection (i.e., some moment is common to both events.).</p>\n\n<p>The event can be represented as a pair of integers <code>startTime</code> and <code>endTime</code> that represents a booking on the half-open interval <code>[startTime, endTime)</code>, the range of real numbers <code>x</code> such that <code>startTime &lt;= x &lt; endTime</code>.</p>\n\n<p>Implement the <code>MyCalendar</code> class:</p>\n\n<ul>\n\t<li><code>MyCalendar()</code> Initializes the calendar object.</li>\n\t<li><code>boolean book(int startTime, int endTime)</code> Returns <code>true</code> if the event can be added to the calendar successfully without causing a <strong>double booking</strong>. Otherwise, return <code>false</code> and do not add the event to the calendar.</li>\n</ul>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input</strong>\n[&quot;MyCalendar&quot;, &quot;book&quot;, &quot;book&quot;, &quot;book&quot;]\n[[], [10, 20], [15, 25], [20, 30]]\n<strong>Output</strong>\n[null, true, false, true]\n\n<strong>Explanation</strong>\nMyCalendar myCalendar = new MyCalendar();\nmyCalendar.book(10, 20); // return True\nmyCalendar.book(15, 25); // return False, It can not be booked because time 15 is already booked by another event.\nmyCalendar.book(20, 30); // return True, The event can be booked, as the first event takes every time less than 20, but not including 20.</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>0 &lt;= start &lt; end &lt;= 10<sup>9</sup></code></li>\n\t<li>At most <code>1000</code> calls will be made to <code>book</code>.</li>\n</ul>\n",
      "lcSlug": "my-calendar-i",
      "summary": "Sorted list overlap — Class design with required operation complexities — map + structure."
    },
    {
      "id": "iv-10",
      "title": "My Calendar II",
      "lc": 731,
      "importance": "nice",
      "subtopic": "design",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "bookings",
          "out": "true/false"
        }
      ],
      "approaches": [
        {
          "name": "Map overlap counts",
          "time": "O(n log n)",
          "space": "O(n)",
          "code": "class MyCalendarTwo {\n    map<int,int> timeline;\n    void add(int s,int e){ timeline[s]++; timeline[e]--; }\npublic:\n    bool book(int start,int end){\n        add(start,end);\n        int cur=0;\n        for(auto& [t,d]: timeline){\n            cur+=d;\n            if(cur>=3){ add(start,end); timeline[start]--; timeline[end]++; return false; }\n        } return true;\n    }\n};"
        }
      ],
      "description": "You are implementing a program to use as your calendar. We can add a new event if adding the event will not cause a triple booking.\n\nA triple booking happens when three events have some non-empty intersection (i.e., some moment is common to all the three events.).\n\nThe event can be represented as a pair of integers `startTime` and `endTime` that represents a booking on the half-open interval `[startTime, endTime)`, the range of real numbers `x` such that `startTime \n\n\t• `MyCalendarTwo()` Initializes the calendar object.\n• `boolean book(int startTime, int endTime)` Returns `true` if the event can be added to the calendar successfully without causing a triple booking. Otherwise, return `false` and do not add the event to the calendar.\n\n \n\nExample 1:\n\nInput\n[\"MyCalendarTwo\", \"book\", \"book\", \"book\", \"book\", \"book\", \"book\"]\n[[], [10, 20], [50, 60], [10, 40], [5, 15], [5, 10], [25, 55]]\nOutput\n[null, true, true, true, false, true, true]\n\nExplanation\nMyCalendarTwo myCalendarTwo = new MyCalendarTwo();\nmyCalendarTwo.book(10, 20); // return True, The event can be booked. \nmyCalendarTwo.book(50, 60); // return True, The event can be booked. \nmyCalendarTwo.book(10, 40); // return True, The event can be double booked. \nmyCalendarTwo.book(5, 15);  // return False, The event cannot be booked, because it would result in a triple booking.\nmyCalendarTwo.book(5, 10); // return True, The event can be booked, as it does not use time 10 which is already double booked.\nmyCalendarTwo.book(25, 55); // return True, The event can be booked, as the time in [25, 40) will be double booked with the third event, the time [40, 50) will be single booked, and the time [50, 55) will be double booked with the second event.\n\n \n\nConstraints:\n\n\t• `0 9`\n• At most `1000` calls will be made to `book`.",
      "descriptionHtml": "<p>You are implementing a program to use as your calendar. We can add a new event if adding the event will not cause a <strong>triple booking</strong>.</p>\n\n<p>A <strong>triple booking</strong> happens when three events have some non-empty intersection (i.e., some moment is common to all the three events.).</p>\n\n<p>The event can be represented as a pair of integers <code>startTime</code> and <code>endTime</code> that represents a booking on the half-open interval <code>[startTime, endTime)</code>, the range of real numbers <code>x</code> such that <code>startTime &lt;= x &lt; endTime</code>.</p>\n\n<p>Implement the <code>MyCalendarTwo</code> class:</p>\n\n<ul>\n\t<li><code>MyCalendarTwo()</code> Initializes the calendar object.</li>\n\t<li><code>boolean book(int startTime, int endTime)</code> Returns <code>true</code> if the event can be added to the calendar successfully without causing a <strong>triple booking</strong>. Otherwise, return <code>false</code> and do not add the event to the calendar.</li>\n</ul>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input</strong>\n[&quot;MyCalendarTwo&quot;, &quot;book&quot;, &quot;book&quot;, &quot;book&quot;, &quot;book&quot;, &quot;book&quot;, &quot;book&quot;]\n[[], [10, 20], [50, 60], [10, 40], [5, 15], [5, 10], [25, 55]]\n<strong>Output</strong>\n[null, true, true, true, false, true, true]\n\n<strong>Explanation</strong>\nMyCalendarTwo myCalendarTwo = new MyCalendarTwo();\nmyCalendarTwo.book(10, 20); // return True, The event can be booked. \nmyCalendarTwo.book(50, 60); // return True, The event can be booked. \nmyCalendarTwo.book(10, 40); // return True, The event can be double booked. \nmyCalendarTwo.book(5, 15);  // return False, The event cannot be booked, because it would result in a triple booking.\nmyCalendarTwo.book(5, 10); // return True, The event can be booked, as it does not use time 10 which is already double booked.\nmyCalendarTwo.book(25, 55); // return True, The event can be booked, as the time in [25, 40) will be double booked with the third event, the time [40, 50) will be single booked, and the time [50, 55) will be double booked with the second event.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>0 &lt;= start &lt; end &lt;= 10<sup>9</sup></code></li>\n\t<li>At most <code>1000</code> calls will be made to <code>book</code>.</li>\n</ul>\n",
      "lcSlug": "my-calendar-ii",
      "summary": "Map overlap counts — Class design with required operation complexities — map + structure."
    },
    {
      "id": "iv-11",
      "title": "My Calendar III",
      "lc": 732,
      "importance": "nice",
      "subtopic": "sweep",
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
      "id": "iv-12",
      "title": "Remove Covered Intervals",
      "lc": 1288,
      "importance": "nice",
      "subtopic": "sort",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "intervals",
          "out": "count"
        }
      ],
      "approaches": [
        {
          "name": "Sort by end",
          "time": "O(n log n)",
          "space": "O(1)",
          "code": "int removeCoveredIntervals(vector<vector<int>>& iv) {\n    sort(iv.begin(), iv.end(), [](auto& a, auto& b){ return a[0]==b[0]? a[1]>b[1]: a[0]<b[0]; });\n    int ans=0, end=-1;\n    for(auto& x: iv) if(x[1]>end){ ans++; end=x[1]; }\n    return ans;\n}"
        }
      ],
      "description": "Given an array `intervals` where `intervals[i] = [li, ri]` represent the interval `[li, ri)`, remove all intervals that are covered by another interval in the list.\n\nThe interval `[a, b)` is covered by the interval `[c, d)` if and only if `c Example 1:\n\nInput: intervals = [[1,4],[3,6],[2,8]]\nOutput: 2\nExplanation: Interval [3,6] is covered by [2,8], therefore it is removed.\n\nExample 2:\n\nInput: intervals = [[1,4],[2,3]]\nOutput: 1\n\n \n\nConstraints:\n\n\t• `1 i i 5`\n• All the given intervals are unique.",
      "descriptionHtml": "<p>Given an array <code>intervals</code> where <code>intervals[i] = [l<sub>i</sub>, r<sub>i</sub>]</code> represent the interval <code>[l<sub>i</sub>, r<sub>i</sub>)</code>, remove all intervals that are covered by another interval in the list.</p>\n\n<p>The interval <code>[a, b)</code> is covered by the interval <code>[c, d)</code> if and only if <code>c &lt;= a</code> and <code>b &lt;= d</code>.</p>\n\n<p>Return <em>the number of remaining intervals</em>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> intervals = [[1,4],[3,6],[2,8]]\n<strong>Output:</strong> 2\n<strong>Explanation:</strong> Interval [3,6] is covered by [2,8], therefore it is removed.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> intervals = [[1,4],[2,3]]\n<strong>Output:</strong> 1\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= intervals.length &lt;= 1000</code></li>\n\t<li><code>intervals[i].length == 2</code></li>\n\t<li><code>0 &lt;= l<sub>i</sub> &lt; r<sub>i</sub> &lt;= 10<sup>5</sup></code></li>\n\t<li>All the given intervals are <strong>unique</strong>.</li>\n</ul>\n",
      "lcSlug": "remove-covered-intervals",
      "summary": "Sort by end — state invariant, then loop."
    },
    {
      "id": "iv-13",
      "title": "Data Stream as Disjoint Intervals",
      "lc": 352,
      "importance": "nice",
      "subtopic": "design",
      "difficulty": "Hard",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "values",
          "out": "intervals"
        }
      ],
      "approaches": [
        {
          "name": "Ordered set intervals",
          "time": "O(n log n)",
          "space": "O(n)",
          "code": "class SummaryRanges {\n    set<int> vals;\npublic:\n    void addNum(int value){ vals.insert(value); }\n    vector<vector<int>> getIntervals(){\n        vector<vector<int>> ans; if(vals.empty()) return ans;\n        int start=*vals.begin(), prev=start;\n        for(int x: vals){\n            if(x>prev+1){ ans.push_back({start,prev}); start=x; }\n            prev=x;\n        } ans.push_back({start,prev}); return ans;\n    }\n};"
        }
      ],
      "description": "Given a data stream input of non-negative integers `a1, a2, ..., an`, summarize the numbers seen so far as a list of disjoint intervals.\n\nImplement the `SummaryRanges` class:\n\n\t• `SummaryRanges()` Initializes the object with an empty stream.\n• `void addNum(int value)` Adds the integer `value` to the stream.\n• `int[][] getIntervals()` Returns a summary of the integers in the stream currently as a list of disjoint intervals `[starti, endi]`. The answer should be sorted by `starti`.\n\n \n\nExample 1:\n\nInput\n[\"SummaryRanges\", \"addNum\", \"getIntervals\", \"addNum\", \"getIntervals\", \"addNum\", \"getIntervals\", \"addNum\", \"getIntervals\", \"addNum\", \"getIntervals\"]\n[[], [1], [], [3], [], [7], [], [2], [], [6], []]\nOutput\n[null, null, [[1, 1]], null, [[1, 1], [3, 3]], null, [[1, 1], [3, 3], [7, 7]], null, [[1, 3], [7, 7]], null, [[1, 3], [6, 7]]]\n\nExplanation\nSummaryRanges summaryRanges = new SummaryRanges();\nsummaryRanges.addNum(1);      // arr = [1]\nsummaryRanges.getIntervals(); // return [[1, 1]]\nsummaryRanges.addNum(3);      // arr = [1, 3]\nsummaryRanges.getIntervals(); // return [[1, 1], [3, 3]]\nsummaryRanges.addNum(7);      // arr = [1, 3, 7]\nsummaryRanges.getIntervals(); // return [[1, 1], [3, 3], [7, 7]]\nsummaryRanges.addNum(2);      // arr = [1, 2, 3, 7]\nsummaryRanges.getIntervals(); // return [[1, 3], [7, 7]]\nsummaryRanges.addNum(6);      // arr = [1, 2, 3, 6, 7]\nsummaryRanges.getIntervals(); // return [[1, 3], [6, 7]]\n\n \n\nConstraints:\n\n\t• `0 4`\n• At most `3 * 104` calls will be made to `addNum` and `getIntervals`.\n• At most `102` calls will be made to `getIntervals`.\n\n \n\nFollow up: What if there are lots of merges and the number of disjoint intervals is small compared to the size of the data stream?",
      "descriptionHtml": "<p>Given a data stream input of non-negative integers <code>a<sub>1</sub>, a<sub>2</sub>, ..., a<sub>n</sub></code>, summarize the numbers seen so far as a list of disjoint intervals.</p>\n\n<p>Implement the <code>SummaryRanges</code> class:</p>\n\n<ul>\n\t<li><code>SummaryRanges()</code> Initializes the object with an empty stream.</li>\n\t<li><code>void addNum(int value)</code> Adds the integer <code>value</code> to the stream.</li>\n\t<li><code>int[][] getIntervals()</code> Returns a summary of the integers in the stream currently as a list of disjoint intervals <code>[start<sub>i</sub>, end<sub>i</sub>]</code>. The answer should be sorted by <code>start<sub>i</sub></code>.</li>\n</ul>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input</strong>\n[&quot;SummaryRanges&quot;, &quot;addNum&quot;, &quot;getIntervals&quot;, &quot;addNum&quot;, &quot;getIntervals&quot;, &quot;addNum&quot;, &quot;getIntervals&quot;, &quot;addNum&quot;, &quot;getIntervals&quot;, &quot;addNum&quot;, &quot;getIntervals&quot;]\n[[], [1], [], [3], [], [7], [], [2], [], [6], []]\n<strong>Output</strong>\n[null, null, [[1, 1]], null, [[1, 1], [3, 3]], null, [[1, 1], [3, 3], [7, 7]], null, [[1, 3], [7, 7]], null, [[1, 3], [6, 7]]]\n\n<strong>Explanation</strong>\nSummaryRanges summaryRanges = new SummaryRanges();\nsummaryRanges.addNum(1);      // arr = [1]\nsummaryRanges.getIntervals(); // return [[1, 1]]\nsummaryRanges.addNum(3);      // arr = [1, 3]\nsummaryRanges.getIntervals(); // return [[1, 1], [3, 3]]\nsummaryRanges.addNum(7);      // arr = [1, 3, 7]\nsummaryRanges.getIntervals(); // return [[1, 1], [3, 3], [7, 7]]\nsummaryRanges.addNum(2);      // arr = [1, 2, 3, 7]\nsummaryRanges.getIntervals(); // return [[1, 3], [7, 7]]\nsummaryRanges.addNum(6);      // arr = [1, 2, 3, 6, 7]\nsummaryRanges.getIntervals(); // return [[1, 3], [6, 7]]\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>0 &lt;= value &lt;= 10<sup>4</sup></code></li>\n\t<li>At most <code>3 * 10<sup>4</sup></code> calls will be made to <code>addNum</code> and <code>getIntervals</code>.</li>\n\t<li>At most <code>10<sup>2</sup></code>&nbsp;calls will be made to&nbsp;<code>getIntervals</code>.</li>\n</ul>\n\n<p>&nbsp;</p>\n<p><strong>Follow up:</strong> What if there are lots of merges and the number of disjoint intervals is small compared to the size of the data stream?</p>\n",
      "lcSlug": "data-stream-as-disjoint-intervals",
      "summary": "Ordered set intervals — Class design with required operation complexities — map + structure."
    },
    {
      "id": "iv-14",
      "title": "Partition Labels",
      "lc": 763,
      "importance": "should",
      "subtopic": "greedy",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "s",
          "out": "sizes"
        }
      ],
      "approaches": [
        {
          "name": "Partition labels",
          "time": "O(n)",
          "space": "O(1)",
          "code": "vector<int> partitionLabels(string s) {\n    int last[26]; for (int i=0;i<(int)s.size();i++) last[s[i]-'a']=i;\n    vector<int> ans; int start=0, end=0;\n    for (int i=0;i<(int)s.size();i++) {\n        end=max(end, last[s[i]-'a']);\n        if (i==end) { ans.push_back(end-start+1); start=i+1; }\n    } return ans;\n}"
        }
      ],
      "description": "You are given a string `s`. We want to partition the string into as many parts as possible so that each letter appears in at most one part. For example, the string `\"ababcc\"` can be partitioned into `[\"abab\", \"cc\"]`, but partitions such as `[\"aba\", \"bcc\"]` or `[\"ab\", \"ab\", \"cc\"]` are invalid.\n\nNote that the partition is done so that after concatenating all the parts in order, the resultant string should be `s`.\n\nReturn a list of integers representing the size of these parts.\n\n \n\nExample 1:\n\nInput: s = \"ababcbacadefegdehijhklij\"\nOutput: [9,7,8]\nExplanation:\nThe partition is \"ababcbaca\", \"defegde\", \"hijhklij\".\nThis is a partition so that each letter appears in at most one part.\nA partition like \"ababcbacadefegde\", \"hijhklij\" is incorrect, because it splits s into less parts.\n\nExample 2:\n\nInput: s = \"eccbbbbdec\"\nOutput: [10]\n\n \n\nConstraints:\n\n\t• `1",
      "descriptionHtml": "<p>You are given a string <code>s</code>. We want to partition the string into as many parts as possible so that each letter appears in at most one part. For example, the string <code>&quot;ababcc&quot;</code> can be partitioned into <code>[&quot;abab&quot;, &quot;cc&quot;]</code>, but partitions such as <code>[&quot;aba&quot;, &quot;bcc&quot;]</code> or <code>[&quot;ab&quot;, &quot;ab&quot;, &quot;cc&quot;]</code> are invalid.</p>\n\n<p>Note that the partition is done so that after concatenating all the parts in order, the resultant string should be <code>s</code>.</p>\n\n<p>Return <em>a list of integers representing the size of these parts</em>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> s = &quot;ababcbacadefegdehijhklij&quot;\n<strong>Output:</strong> [9,7,8]\n<strong>Explanation:</strong>\nThe partition is &quot;ababcbaca&quot;, &quot;defegde&quot;, &quot;hijhklij&quot;.\nThis is a partition so that each letter appears in at most one part.\nA partition like &quot;ababcbacadefegde&quot;, &quot;hijhklij&quot; is incorrect, because it splits s into less parts.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> s = &quot;eccbbbbdec&quot;\n<strong>Output:</strong> [10]\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= s.length &lt;= 500</code></li>\n\t<li><code>s</code> consists of lowercase English letters.</li>\n</ul>\n",
      "lcSlug": "partition-labels",
      "summary": "Partition labels — Sort intervals; merge, sweep line, or greedy by end time."
    },
    {
      "id": "iv-15",
      "title": "Set Intersection Size At Least Two",
      "lc": 757,
      "importance": "nice",
      "subtopic": "greedy",
      "difficulty": "Hard",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "intervals",
          "out": "set size"
        }
      ],
      "approaches": [
        {
          "name": "Greedy cover",
          "time": "O(n log n)",
          "space": "O(1)",
          "code": "int intersectionSizeTwo(vector<vector<int>>& intervals) {\n    sort(intervals.begin(), intervals.end(), [](auto& a, auto& b){\n        return a[1]==b[1]? a[0]>b[0]: a[1]<b[1];\n    });\n    int ans=0, a=-1, b=-1;\n    for(auto& iv: intervals){\n        if(iv[0]>a && iv[0]>b){ a=iv[1]-1; b=iv[1]; ans+=2; }\n        else if(iv[0]>a){ a=b; b=iv[1]; ans++; }\n    } return ans;\n}"
        }
      ],
      "description": "You are given a 2D integer array `intervals` where `intervals[i] = [starti, endi]` represents all the integers from `starti` to `endi` inclusively.\n\nA containing set is an array `nums` where each interval from `intervals` has at least two integers in `nums`.\n\n\t• For example, if `intervals = [[1,3], [3,7], [8,9]]`, then `[1,2,4,7,8,9]` and `[2,3,4,8,9]` are containing sets.\n\nReturn the minimum possible size of a containing set.\n\n \n\nExample 1:\n\nInput: intervals = [[1,3],[3,7],[8,9]]\nOutput: 5\nExplanation: let nums = [2, 3, 4, 8, 9].\nIt can be shown that there cannot be any containing array of size 4.\n\nExample 2:\n\nInput: intervals = [[1,3],[1,4],[2,5],[3,5]]\nOutput: 3\nExplanation: let nums = [2, 3, 4].\nIt can be shown that there cannot be any containing array of size 2.\n\nExample 3:\n\nInput: intervals = [[1,2],[2,3],[2,4],[4,5]]\nOutput: 5\nExplanation: let nums = [1, 2, 3, 4, 5].\nIt can be shown that there cannot be any containing array of size 4.\n\n \n\nConstraints:\n\n\t• `1 i i 8`",
      "descriptionHtml": "<p>You are given a 2D integer array <code>intervals</code> where <code>intervals[i] = [start<sub>i</sub>, end<sub>i</sub>]</code> represents all the integers from <code>start<sub>i</sub></code> to <code>end<sub>i</sub></code> inclusively.</p>\n\n<p>A <strong>containing set</strong> is an array <code>nums</code> where each interval from <code>intervals</code> has <strong>at least two</strong> integers in <code>nums</code>.</p>\n\n<ul>\n\t<li>For example, if <code>intervals = [[1,3], [3,7], [8,9]]</code>, then <code>[1,2,4,7,8,9]</code> and <code>[2,3,4,8,9]</code> are <strong>containing sets</strong>.</li>\n</ul>\n\n<p>Return <em>the minimum possible size of a containing set</em>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> intervals = [[1,3],[3,7],[8,9]]\n<strong>Output:</strong> 5\n<strong>Explanation:</strong> let nums = [2, 3, 4, 8, 9].\nIt can be shown that there cannot be any containing array of size 4.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> intervals = [[1,3],[1,4],[2,5],[3,5]]\n<strong>Output:</strong> 3\n<strong>Explanation:</strong> let nums = [2, 3, 4].\nIt can be shown that there cannot be any containing array of size 2.\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> intervals = [[1,2],[2,3],[2,4],[4,5]]\n<strong>Output:</strong> 5\n<strong>Explanation:</strong> let nums = [1, 2, 3, 4, 5].\nIt can be shown that there cannot be any containing array of size 4.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= intervals.length &lt;= 3000</code></li>\n\t<li><code>intervals[i].length == 2</code></li>\n\t<li><code>0 &lt;= start<sub>i</sub> &lt; end<sub>i</sub> &lt;= 10<sup>8</sup></code></li>\n</ul>\n",
      "lcSlug": "set-intersection-size-at-least-two",
      "summary": "Greedy cover — Local optimal choice leads global optimum — often after sorting."
    },
    {
      "id": "iv-16",
      "title": "Maximum Number of Events",
      "lc": 1353,
      "importance": "should",
      "subtopic": "greedy",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "events",
          "out": "max attended"
        }
      ],
      "approaches": [
        {
          "name": "Sort + heap",
          "time": "O(n log n)",
          "space": "O(n)",
          "code": "int maxEvents(vector<vector<int>>& events) {\n    sort(events.begin(), events.end());\n    priority_queue<int, vector<int>, greater<int>> pq;\n    int i = 0, n = events.size(), day = 0, ans = 0;\n    while (i < n || !pq.empty()) {\n        if (pq.empty()) day = events[i][0];\n        while (i < n && events[i][0] <= day) pq.push(events[i][1]), i++;\n        pq.pop(); ans++;\n        while (!pq.empty() && pq.top() < day) pq.pop();\n        day++;\n    }\n    return ans;\n}"
        }
      ],
      "description": "You are given an array of `events` where `events[i] = [startDayi, endDayi]`. Every event `i` starts at `startDayi` and ends at `endDayi`.\n\nYou can attend an event `i` at any day `d` where `startDayi i`. You can only attend one event at any time `d`.\n\nReturn the maximum number of events you can attend.\n\n \n\nExample 1:\n\nInput: events = [[1,2],[2,3],[3,4]]\nOutput: 3\nExplanation: You can attend all the three events.\nOne way to attend them all is as shown.\nAttend the first event on day 1.\nAttend the second event on day 2.\nAttend the third event on day 3.\n\nExample 2:\n\nInput: events= [[1,2],[2,3],[3,4],[1,2]]\nOutput: 4\n\n \n\nConstraints:\n\n\t• `1 5`\n• `events[i].length == 2`\n• `1 i i 5`",
      "descriptionHtml": "<p>You are given an array of <code>events</code> where <code>events[i] = [startDay<sub>i</sub>, endDay<sub>i</sub>]</code>. Every event <code>i</code> starts at <code>startDay<sub>i</sub></code><sub> </sub>and ends at <code>endDay<sub>i</sub></code>.</p>\n\n<p>You can attend an event <code>i</code> at any day <code>d</code> where <code>startDay<sub>i</sub> &lt;= d &lt;= endDay<sub>i</sub></code>. You can only attend one event at any time <code>d</code>.</p>\n\n<p>Return <em>the maximum number of events you can attend</em>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2020/02/05/e1.png\" style=\"width: 400px; height: 267px;\" />\n<pre>\n<strong>Input:</strong> events = [[1,2],[2,3],[3,4]]\n<strong>Output:</strong> 3\n<strong>Explanation:</strong> You can attend all the three events.\nOne way to attend them all is as shown.\nAttend the first event on day 1.\nAttend the second event on day 2.\nAttend the third event on day 3.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> events= [[1,2],[2,3],[3,4],[1,2]]\n<strong>Output:</strong> 4\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= events.length &lt;= 10<sup>5</sup></code></li>\n\t<li><code>events[i].length == 2</code></li>\n\t<li><code>1 &lt;= startDay<sub>i</sub> &lt;= endDay<sub>i</sub> &lt;= 10<sup>5</sup></code></li>\n</ul>\n",
      "lcSlug": "maximum-number-of-events-that-can-be-attended",
      "summary": "Sort events by day; min-heap of end days — pop expired, attend one per day."
    },
    {
      "id": "iv-17",
      "title": "Car Pooling",
      "lc": 1094,
      "importance": "should",
      "subtopic": "sweep",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "trips,capacity",
          "out": "possible?"
        }
      ],
      "approaches": [
        {
          "name": "Diff array",
          "time": "O(n)",
          "space": "O(n)",
          "code": "bool carPooling(vector<vector<int>>& trips, int capacity) {\n    vector<int> diff(1001, 0);\n    for (auto& t : trips) { diff[t[1]] += t[0]; diff[t[2]] -= t[0]; }\n    int cur = 0;\n    for (int i = 0; i <= 1000; i++) { cur += diff[i]; if (cur > capacity) return false; }\n    return true;\n}"
        }
      ],
      "description": "There is a car with `capacity` empty seats. The vehicle only drives east (i.e., it cannot turn around and drive west).\n\nYou are given the integer `capacity` and an array `trips` where `trips[i] = [numPassengersi, fromi, toi]` indicates that the `ith` trip has `numPassengersi` passengers and the locations to pick them up and drop them off are `fromi` and `toi` respectively. The locations are given as the number of kilometers due east from the car's initial location.\n\nReturn `true` if it is possible to pick up and drop off all passengers for all the given trips, or `false` otherwise.\n\n \n\nExample 1:\n\nInput: trips = [[2,1,5],[3,3,7]], capacity = 4\nOutput: false\n\nExample 2:\n\nInput: trips = [[2,1,5],[3,3,7]], capacity = 5\nOutput: true\n\n \n\nConstraints:\n\n\t• `1 i i i 5`",
      "descriptionHtml": "<p>There is a car with <code>capacity</code> empty seats. The vehicle only drives east (i.e., it cannot turn around and drive west).</p>\n\n<p>You are given the integer <code>capacity</code> and an array <code>trips</code> where <code>trips[i] = [numPassengers<sub>i</sub>, from<sub>i</sub>, to<sub>i</sub>]</code> indicates that the <code>i<sup>th</sup></code> trip has <code>numPassengers<sub>i</sub></code> passengers and the locations to pick them up and drop them off are <code>from<sub>i</sub></code> and <code>to<sub>i</sub></code> respectively. The locations are given as the number of kilometers due east from the car&#39;s initial location.</p>\n\n<p>Return <code>true</code><em> if it is possible to pick up and drop off all passengers for all the given trips, or </em><code>false</code><em> otherwise</em>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> trips = [[2,1,5],[3,3,7]], capacity = 4\n<strong>Output:</strong> false\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> trips = [[2,1,5],[3,3,7]], capacity = 5\n<strong>Output:</strong> true\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= trips.length &lt;= 1000</code></li>\n\t<li><code>trips[i].length == 3</code></li>\n\t<li><code>1 &lt;= numPassengers<sub>i</sub> &lt;= 100</code></li>\n\t<li><code>0 &lt;= from<sub>i</sub> &lt; to<sub>i</sub> &lt;= 1000</code></li>\n\t<li><code>1 &lt;= capacity &lt;= 10<sup>5</sup></code></li>\n</ul>\n",
      "lcSlug": "car-pooling",
      "summary": "range [l,r] += v → diff[l]+=v, diff[r+1]-=v; prefix to rebuild."
    },
    {
      "id": "iv-18",
      "title": "Minimum Number of Arrows",
      "lc": 452,
      "importance": "should",
      "subtopic": "greedy",
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
      "id": "iv-19",
      "title": "Teemo Attacking",
      "lc": 495,
      "importance": "nice",
      "subtopic": "merge",
      "difficulty": "Easy",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "timeSeries,duration",
          "out": "total poison"
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
      "description": "Our hero Teemo is attacking an enemy Ashe with poison attacks! When Teemo attacks Ashe, Ashe gets poisoned for a exactly `duration` seconds. More formally, an attack at second `t` will mean Ashe is poisoned during the inclusive time interval `[t, t + duration - 1]`. If Teemo attacks again before the poison effect ends, the timer for it is reset, and the poison effect will end `duration` seconds after the new attack.\n\nYou are given a non-decreasing integer array `timeSeries`, where `timeSeries[i]` denotes that Teemo attacks Ashe at second `timeSeries[i]`, and an integer `duration`.\n\nReturn the total number of seconds that Ashe is poisoned.\n\n \n\nExample 1:\n\nInput: timeSeries = [1,4], duration = 2\nOutput: 4\nExplanation: Teemo's attacks on Ashe go as follows:\n- At second 1, Teemo attacks, and Ashe is poisoned for seconds 1 and 2.\n- At second 4, Teemo attacks, and Ashe is poisoned for seconds 4 and 5.\nAshe is poisoned for seconds 1, 2, 4, and 5, which is 4 seconds in total.\n\nExample 2:\n\nInput: timeSeries = [1,2], duration = 2\nOutput: 3\nExplanation: Teemo's attacks on Ashe go as follows:\n- At second 1, Teemo attacks, and Ashe is poisoned for seconds 1 and 2.\n- At second 2 however, Teemo attacks again and resets the poison timer. Ashe is poisoned for seconds 2 and 3.\nAshe is poisoned for seconds 1, 2, and 3, which is 3 seconds in total.\n\n \n\nConstraints:\n\n\t• `1 4`\n• `0 7`\n• `timeSeries` is sorted in non-decreasing order.",
      "descriptionHtml": "<p>Our hero Teemo is attacking an enemy Ashe with poison attacks! When Teemo attacks Ashe, Ashe gets poisoned for a exactly <code>duration</code> seconds. More formally, an attack at second <code>t</code> will mean Ashe is poisoned during the <strong>inclusive</strong> time interval <code>[t, t + duration - 1]</code>. If Teemo attacks again <strong>before</strong> the poison effect ends, the timer for it is <strong>reset</strong>, and the poison effect will end <code>duration</code> seconds after the new attack.</p>\n\n<p>You are given a <strong>non-decreasing</strong> integer array <code>timeSeries</code>, where <code>timeSeries[i]</code> denotes that Teemo attacks Ashe at second <code>timeSeries[i]</code>, and an integer <code>duration</code>.</p>\n\n<p>Return <em>the <strong>total</strong> number of seconds that Ashe is poisoned</em>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> timeSeries = [1,4], duration = 2\n<strong>Output:</strong> 4\n<strong>Explanation:</strong> Teemo&#39;s attacks on Ashe go as follows:\n- At second 1, Teemo attacks, and Ashe is poisoned for seconds 1 and 2.\n- At second 4, Teemo attacks, and Ashe is poisoned for seconds 4 and 5.\nAshe is poisoned for seconds 1, 2, 4, and 5, which is 4 seconds in total.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> timeSeries = [1,2], duration = 2\n<strong>Output:</strong> 3\n<strong>Explanation:</strong> Teemo&#39;s attacks on Ashe go as follows:\n- At second 1, Teemo attacks, and Ashe is poisoned for seconds 1 and 2.\n- At second 2 however, Teemo attacks again and resets the poison timer. Ashe is poisoned for seconds 2 and 3.\nAshe is poisoned for seconds 1, 2, and 3, which is 3 seconds in total.</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= timeSeries.length &lt;= 10<sup>4</sup></code></li>\n\t<li><code>0 &lt;= timeSeries[i], duration &lt;= 10<sup>7</sup></code></li>\n\t<li><code>timeSeries</code> is sorted in <strong>non-decreasing</strong> order.</li>\n</ul>\n",
      "lcSlug": "teemo-attacking",
      "summary": "Merge sorted — state invariant, then loop."
    },
    {
      "id": "iv-20",
      "title": "Add Bold Tag in String",
      "lc": 616,
      "importance": "nice",
      "subtopic": "intervals",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "s, dict",
          "out": "bold string"
        }
      ],
      "approaches": [
        {
          "name": "Interval merge bold",
          "time": "O(n*m)",
          "space": "O(n)",
          "code": "string addBoldTag(string s, vector<string>& dict) {\n    vector<bool> bold(s.size());\n    for(auto& w: dict) for(size_t i=s.find(w); i!=string::npos; i=s.find(w,i+1))\n        fill(bold.begin()+i, bold.begin()+i+w.size(), true);\n    string ans; bool open=false;\n    for(int i=0;i<(int)s.size();i++){\n        if(bold[i]&&!open){ ans+=\"<b>\"; open=true; }\n        if(!bold[i]&&open){ ans+=\"</b>\"; open=false; }\n        ans+=s[i];\n    } if(open) ans+=\"</b>\"; return ans;\n}"
        }
      ],
      "description": "You are given a string `s` and an array of strings `words`.\n\nYou should add a closed pair of bold tag `` and `` to wrap the substrings in `s` that exist in `words`.\n\n\t• If two such substrings overlap, you should wrap them together with only one pair of closed bold-tag.\n• If two substrings wrapped by bold tags are consecutive, you should combine them.\n\nReturn `s` after adding the bold tags.\n\n&nbsp;\n\nExample 1:\n\nInput: s = \"abcxyz123\", words = [\"abc\",\"123\"]\nOutput: \"abcxyz123\"\nExplanation: The two strings of words are substrings of s as following: \"abcxyz123\".\nWe add  before each substring and  after each substring.\n\nExample 2:\n\nInput: s = \"aaabbb\", words = [\"aa\",\"b\"]\nOutput: \"aaabbb\"\nExplanation: \n\"aa\" appears as a substring two times: \"aaabbb\" and \"aaabbb\".\n\"b\" appears as a substring three times: \"aaabbb\", \"aaabbb\", and \"aaabbb\".\nWe add  before each substring and  after each substring: \"aaabbb\".\nSince the first two 's overlap, we merge them: \"aaabbb\".\nSince now the four 's are consecutive, we merge them: \"aaabbb\".\n\n&nbsp;\n\nConstraints:\n\n\t• `1 \n\n&nbsp;\n\nNote: This question is the same as 758. Bold Words in String.",
      "descriptionHtml": "<p>You are given a string <code>s</code> and an array of strings <code>words</code>.</p>\n\n<p>You should add a closed pair of bold tag <code><b></code> and <code></b></code> to wrap the substrings in <code>s</code> that exist in <code>words</code>.</p>\n\n<ul>\n\t<li>If two such substrings overlap, you should wrap them together with only one pair of closed bold-tag.</li>\n\t<li>If two substrings wrapped by bold tags are consecutive, you should combine them.</li>\n</ul>\n\n<p>Return <code>s</code> <em>after adding the bold tags</em>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> s = &quot;abcxyz123&quot;, words = [&quot;abc&quot;,&quot;123&quot;]\n<strong>Output:</strong> &quot;<b>abc</b>xyz<b>123</b>&quot;\n<strong>Explanation:</strong> The two strings of words are substrings of s as following: &quot;<u>abc</u>xyz<u>123</u>&quot;.\nWe add <b> before each substring and </b> after each substring.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> s = &quot;aaabbb&quot;, words = [&quot;aa&quot;,&quot;b&quot;]\n<strong>Output:</strong> &quot;<b>aaabbb</b>&quot;\n<strong>Explanation:</strong> \n&quot;aa&quot; appears as a substring two times: &quot;<u>aa</u>abbb&quot; and &quot;a<u>aa</u>bbb&quot;.\n&quot;b&quot; appears as a substring three times: &quot;aaa<u>b</u>bb&quot;, &quot;aaab<u>b</u>b&quot;, and &quot;aaabb<u>b</u>&quot;.\nWe add <b> before each substring and </b> after each substring: &quot;<b>a<b>a</b>a</b><b>b</b><b>b</b><b>b</b>&quot;.\nSince the first two <b>&#39;s overlap, we merge them: &quot;<b>aaa</b><b>b</b><b>b</b><b>b</b>&quot;.\nSince now the four <b>&#39;s are consecutive, we merge them: &quot;<b>aaabbb</b>&quot;.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 <= s.length <= 1000</code></li>\n\t<li><code>0 <= words.length <= 100</code></li>\n\t<li><code>1 <= words[i].length <= 1000</code></li>\n\t<li><code>s</code> and <code>words[i]</code> consist of English letters and digits.</li>\n\t<li>All the values of <code>words</code> are <strong>unique</strong>.</li>\n</ul>\n\n<p>&nbsp;</p>\n<p><strong>Note:</strong> This question is the same as <a href=\"https://leetcode.com/problems/bold-words-in-string/description/\" target=\"_blank\">758. Bold Words in String</a>.</p>",
      "lcSlug": "add-bold-tag-in-string",
      "summary": "Interval merge bold — Sort intervals; merge, sweep line, or greedy by end time."
    }
  ]
};
