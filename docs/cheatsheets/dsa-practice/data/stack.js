window.PRACTICE_TOPIC = {
  "id": "stack",
  "title": "Stack & Monotonic Stack",
  "expected_count": 24,
  "strategy": "<strong>Speed-run:</strong> Monotonic stack = next greater/smaller in O(n). Filter <em>Must do</em> first.",
  "subtopics": [
    {
      "id": "basic",
      "label": "Basic Stack"
    },
    {
      "id": "monotonic",
      "label": "Monotonic"
    },
    {
      "id": "expression",
      "label": "Expression"
    },
    {
      "id": "design",
      "label": "Design"
    }
  ],
  "questions": [
    {
      "id": "st-01",
      "title": "Valid Parentheses",
      "lc": 20,
      "importance": "must",
      "subtopic": "basic",
      "difficulty": "Easy",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "s",
          "out": "valid?"
        }
      ],
      "approaches": [
        {
          "name": "Stack matching",
          "time": "O(n)",
          "space": "O(n)",
          "code": "bool isValid(string s) {\n    stack<char> st;\n    for (char c : s) {\n        if (c=='('||c=='['||c=='{') st.push(c);\n        else {\n            if (st.empty()) return false;\n            char o = st.top(); st.pop();\n            if ((c==')'&&o!='(')||(c==']'&&o!='[')||(c=='}'&&o!='{')) return false;\n        }\n    } return st.empty();\n}"
        }
      ],
      "description": "Given a string `s` containing just the characters `'('`, `')'`, `'{'`, `'}'`, `'['` and `']'`, determine if the input string is valid.\n\nAn input string is valid if:\n\n\t• Open brackets must be closed by the same type of brackets.\n• Open brackets must be closed in the correct order.\n• Every close bracket has a corresponding open bracket of the same type.\n\n \n\nExample 1:\n\nInput: s = \"()\"\n\nOutput: true\n\nExample 2:\n\nInput: s = \"()[]{}\"\n\nOutput: true\n\nExample 3:\n\nInput: s = \"(]\"\n\nOutput: false\n\nExample 4:\n\nInput: s = \"([])\"\n\nOutput: true\n\nExample 5:\n\nInput: s = \"([)]\"\n\nOutput: false\n\n \n\nConstraints:\n\n\t• `1 4`\n• `s` consists of parentheses only `'()[]{}'`.",
      "descriptionHtml": "<p>Given a string <code>s</code> containing just the characters <code>&#39;(&#39;</code>, <code>&#39;)&#39;</code>, <code>&#39;{&#39;</code>, <code>&#39;}&#39;</code>, <code>&#39;[&#39;</code> and <code>&#39;]&#39;</code>, determine if the input string is valid.</p>\n\n<p>An input string is valid if:</p>\n\n<ol>\n\t<li>Open brackets must be closed by the same type of brackets.</li>\n\t<li>Open brackets must be closed in the correct order.</li>\n\t<li>Every close bracket has a corresponding open bracket of the same type.</li>\n</ol>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<div class=\"example-block\">\n<p><strong>Input:</strong> <span class=\"example-io\">s = &quot;()&quot;</span></p>\n\n<p><strong>Output:</strong> <span class=\"example-io\">true</span></p>\n</div>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<div class=\"example-block\">\n<p><strong>Input:</strong> <span class=\"example-io\">s = &quot;()[]{}&quot;</span></p>\n\n<p><strong>Output:</strong> <span class=\"example-io\">true</span></p>\n</div>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<div class=\"example-block\">\n<p><strong>Input:</strong> <span class=\"example-io\">s = &quot;(]&quot;</span></p>\n\n<p><strong>Output:</strong> <span class=\"example-io\">false</span></p>\n</div>\n\n<p><strong class=\"example\">Example 4:</strong></p>\n\n<div class=\"example-block\">\n<p><strong>Input:</strong> <span class=\"example-io\">s = &quot;([])&quot;</span></p>\n\n<p><strong>Output:</strong> <span class=\"example-io\">true</span></p>\n</div>\n\n<p><strong class=\"example\">Example 5:</strong></p>\n\n<div class=\"example-block\">\n<p><strong>Input:</strong> <span class=\"example-io\">s = &quot;([)]&quot;</span></p>\n\n<p><strong>Output:</strong> <span class=\"example-io\">false</span></p>\n</div>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= s.length &lt;= 10<sup>4</sup></code></li>\n\t<li><code>s</code> consists of parentheses only <code>&#39;()[]{}&#39;</code>.</li>\n</ul>\n",
      "lcSlug": "valid-parentheses",
      "summary": "Push openers; pop on closer; invalid if mismatch or leftover opens."
    },
    {
      "id": "st-02",
      "title": "Min Stack",
      "lc": 155,
      "importance": "must",
      "subtopic": "design",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "push/pop/getMin",
          "out": "O(1) min"
        }
      ],
      "approaches": [
        {
          "name": "Min stack",
          "time": "O(1)",
          "space": "O(n)",
          "code": "class MinStack {\n    stack<pair<int,int>> st;\npublic:\n    void push(int x) { int m=st.empty()? x: min(x,st.top().second); st.push({x,m}); }\n    void pop() { st.pop(); }\n    int top() { return st.top().first; }\n    int getMin() { return st.top().second; }\n};"
        }
      ],
      "description": "Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.\n\nImplement the `MinStack` class:\n\n\t• `MinStack()` initializes the stack object.\n• `void push(int val)` pushes the element `val` onto the stack.\n• `void pop()` removes the element on the top of the stack.\n• `int top()` gets the top element of the stack.\n• `int getMin()` retrieves the minimum element in the stack.\n\nYou must implement a solution with `O(1)` time complexity for each function.\n\n \n\nExample 1:\n\nInput\n[\"MinStack\",\"push\",\"push\",\"push\",\"getMin\",\"pop\",\"top\",\"getMin\"]\n[[],[-2],[0],[-3],[],[],[],[]]\n\nOutput\n[null,null,null,null,-3,null,0,-2]\n\nExplanation\nMinStack minStack = new MinStack();\nminStack.push(-2);\nminStack.push(0);\nminStack.push(-3);\nminStack.getMin(); // return -3\nminStack.pop();\nminStack.top();    // return 0\nminStack.getMin(); // return -2\n\n \n\nConstraints:\n\n\t• `-231 31 - 1`\n• Methods `pop`, `top` and `getMin` operations will always be called on non-empty stacks.\n• At most `3 * 104` calls will be made to `push`, `pop`, `top`, and `getMin`.",
      "descriptionHtml": "<p>Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.</p>\n\n<p>Implement the <code>MinStack</code> class:</p>\n\n<ul>\n\t<li><code>MinStack()</code> initializes the stack object.</li>\n\t<li><code>void push(int val)</code> pushes the element <code>val</code> onto the stack.</li>\n\t<li><code>void pop()</code> removes the element on the top of the stack.</li>\n\t<li><code>int top()</code> gets the top element of the stack.</li>\n\t<li><code>int getMin()</code> retrieves the minimum element in the stack.</li>\n</ul>\n\n<p>You must implement a solution with <code>O(1)</code> time complexity for each function.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input</strong>\n[&quot;MinStack&quot;,&quot;push&quot;,&quot;push&quot;,&quot;push&quot;,&quot;getMin&quot;,&quot;pop&quot;,&quot;top&quot;,&quot;getMin&quot;]\n[[],[-2],[0],[-3],[],[],[],[]]\n\n<strong>Output</strong>\n[null,null,null,null,-3,null,0,-2]\n\n<strong>Explanation</strong>\nMinStack minStack = new MinStack();\nminStack.push(-2);\nminStack.push(0);\nminStack.push(-3);\nminStack.getMin(); // return -3\nminStack.pop();\nminStack.top();    // return 0\nminStack.getMin(); // return -2\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>-2<sup>31</sup> &lt;= val &lt;= 2<sup>31</sup> - 1</code></li>\n\t<li>Methods <code>pop</code>, <code>top</code> and <code>getMin</code> operations will always be called on <strong>non-empty</strong> stacks.</li>\n\t<li>At most <code>3 * 10<sup>4</sup></code> calls will be made to <code>push</code>, <code>pop</code>, <code>top</code>, and <code>getMin</code>.</li>\n</ul>\n",
      "lcSlug": "min-stack",
      "summary": "Min stack — Class design with required operation complexities — map + structure."
    },
    {
      "id": "st-03",
      "title": "Evaluate Reverse Polish Notation",
      "lc": 150,
      "importance": "must",
      "subtopic": "expression",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "tokens",
          "out": "value"
        }
      ],
      "approaches": [
        {
          "name": "Stack eval",
          "time": "O(n)",
          "space": "O(n)",
          "code": "int evalRPN(vector<string>& tokens) {\n    stack<long> st;\n    for (string& t : tokens) {\n        if (t.size() > 1 || isdigit(t[0])) st.push(stol(t));\n        else {\n            long b = st.top(); st.pop(); long a = st.top(); st.pop();\n            if (t == \"+\") st.push(a+b); else if (t == \"-\") st.push(a-b);\n            else if (t == \"*\") st.push(a*b); else st.push(a/b);\n        }\n    }\n    return (int)st.top();\n}"
        }
      ],
      "description": "You are given an array of strings `tokens` that represents an arithmetic expression in a Reverse Polish Notation.\n\nEvaluate the expression. Return an integer that represents the value of the expression.\n\nNote that:\n\n\t• The valid operators are `'+'`, `'-'`, `'*'`, and `'/'`.\n• Each operand may be an integer or another expression.\n• The division between two integers always truncates toward zero.\n• There will not be any division by zero.\n• The input represents a valid arithmetic expression in a reverse polish notation.\n• The answer and all the intermediate calculations can be represented in a 32-bit integer.\n\n \n\nExample 1:\n\nInput: tokens = [\"2\",\"1\",\"+\",\"3\",\"*\"]\nOutput: 9\nExplanation: ((2 + 1) * 3) = 9\n\nExample 2:\n\nInput: tokens = [\"4\",\"13\",\"5\",\"/\",\"+\"]\nOutput: 6\nExplanation: (4 + (13 / 5)) = 6\n\nExample 3:\n\nInput: tokens = [\"10\",\"6\",\"9\",\"3\",\"+\",\"-11\",\"*\",\"/\",\"*\",\"17\",\"+\",\"5\",\"+\"]\nOutput: 22\nExplanation: ((10 * (6 / ((9 + 3) * -11))) + 17) + 5\n= ((10 * (6 / (12 * -11))) + 17) + 5\n= ((10 * (6 / -132)) + 17) + 5\n= ((10 * 0) + 17) + 5\n= (0 + 17) + 5\n= 17 + 5\n= 22\n\n \n\nConstraints:\n\n\t• `1 4`\n• `tokens[i]` is either an operator: `\"+\"`, `\"-\"`, `\"*\"`, or `\"/\"`, or an integer in the range `[-200, 200]`.",
      "descriptionHtml": "<p>You are given an array of strings <code>tokens</code> that represents an arithmetic expression in a <a href=\"http://en.wikipedia.org/wiki/Reverse_Polish_notation\" target=\"_blank\">Reverse Polish Notation</a>.</p>\n\n<p>Evaluate the expression. Return <em>an integer that represents the value of the expression</em>.</p>\n\n<p><strong>Note</strong> that:</p>\n\n<ul>\n\t<li>The valid operators are <code>&#39;+&#39;</code>, <code>&#39;-&#39;</code>, <code>&#39;*&#39;</code>, and <code>&#39;/&#39;</code>.</li>\n\t<li>Each operand may be an integer or another expression.</li>\n\t<li>The division between two integers always <strong>truncates toward zero</strong>.</li>\n\t<li>There will not be any division by zero.</li>\n\t<li>The input represents a valid arithmetic expression in a reverse polish notation.</li>\n\t<li>The answer and all the intermediate calculations can be represented in a <strong>32-bit</strong> integer.</li>\n</ul>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> tokens = [&quot;2&quot;,&quot;1&quot;,&quot;+&quot;,&quot;3&quot;,&quot;*&quot;]\n<strong>Output:</strong> 9\n<strong>Explanation:</strong> ((2 + 1) * 3) = 9\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> tokens = [&quot;4&quot;,&quot;13&quot;,&quot;5&quot;,&quot;/&quot;,&quot;+&quot;]\n<strong>Output:</strong> 6\n<strong>Explanation:</strong> (4 + (13 / 5)) = 6\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> tokens = [&quot;10&quot;,&quot;6&quot;,&quot;9&quot;,&quot;3&quot;,&quot;+&quot;,&quot;-11&quot;,&quot;*&quot;,&quot;/&quot;,&quot;*&quot;,&quot;17&quot;,&quot;+&quot;,&quot;5&quot;,&quot;+&quot;]\n<strong>Output:</strong> 22\n<strong>Explanation:</strong> ((10 * (6 / ((9 + 3) * -11))) + 17) + 5\n= ((10 * (6 / (12 * -11))) + 17) + 5\n= ((10 * (6 / -132)) + 17) + 5\n= ((10 * 0) + 17) + 5\n= (0 + 17) + 5\n= 17 + 5\n= 22\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= tokens.length &lt;= 10<sup>4</sup></code></li>\n\t<li><code>tokens[i]</code> is either an operator: <code>&quot;+&quot;</code>, <code>&quot;-&quot;</code>, <code>&quot;*&quot;</code>, or <code>&quot;/&quot;</code>, or an integer in the range <code>[-200, 200]</code>.</li>\n</ul>\n",
      "lcSlug": "evaluate-reverse-polish-notation",
      "summary": "Numbers push; operator pop b,a compute push."
    },
    {
      "id": "st-04",
      "title": "Daily Temperatures",
      "lc": 739,
      "importance": "must",
      "subtopic": "monotonic",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "T",
          "out": "wait days"
        }
      ],
      "approaches": [
        {
          "name": "Monotonic stack",
          "time": "O(n)",
          "space": "O(n)",
          "code": "vector<int> dailyTemperatures(vector<int>& T) {\n    int n=T.size(); vector<int> ans(n); stack<int> st;\n    for (int i=0;i<n;i++) {\n        while (!st.empty() && T[i] > T[st.top()]) { ans[st.top()] = i-st.top(); st.pop(); }\n        st.push(i);\n    } return ans;\n}"
        }
      ],
      "description": "Given an array of integers `temperatures` represents the daily temperatures, return an array `answer` such that `answer[i]` is the number of days you have to wait after the `ith` day to get a warmer temperature. If there is no future day for which this is possible, keep `answer[i] == 0` instead.\n\n \n\nExample 1:\n\nInput: temperatures = [73,74,75,71,69,72,76,73]\nOutput: [1,1,4,2,1,1,0,0]\n\nExample 2:\n\nInput: temperatures = [30,40,50,60]\nOutput: [1,1,1,0]\n\nExample 3:\n\nInput: temperatures = [30,60,90]\nOutput: [1,1,0]\n\n \n\nConstraints:\n\n\t• `1 5`\n• `30",
      "descriptionHtml": "<p>Given an array of integers <code>temperatures</code> represents the daily temperatures, return <em>an array</em> <code>answer</code> <em>such that</em> <code>answer[i]</code> <em>is the number of days you have to wait after the</em> <code>i<sup>th</sup></code> <em>day to get a warmer temperature</em>. If there is no future day for which this is possible, keep <code>answer[i] == 0</code> instead.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<pre><strong>Input:</strong> temperatures = [73,74,75,71,69,72,76,73]\n<strong>Output:</strong> [1,1,4,2,1,1,0,0]\n</pre><p><strong class=\"example\">Example 2:</strong></p>\n<pre><strong>Input:</strong> temperatures = [30,40,50,60]\n<strong>Output:</strong> [1,1,1,0]\n</pre><p><strong class=\"example\">Example 3:</strong></p>\n<pre><strong>Input:</strong> temperatures = [30,60,90]\n<strong>Output:</strong> [1,1,0]\n</pre>\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;=&nbsp;temperatures.length &lt;= 10<sup>5</sup></code></li>\n\t<li><code>30 &lt;=&nbsp;temperatures[i] &lt;= 100</code></li>\n</ul>\n",
      "lcSlug": "daily-temperatures",
      "summary": "Stack of indices; pop while current violates monotonic property."
    },
    {
      "id": "st-05",
      "title": "Next Greater Element I",
      "lc": 496,
      "importance": "should",
      "subtopic": "monotonic",
      "difficulty": "Easy",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums1, nums2",
          "out": "answers"
        }
      ],
      "approaches": [
        {
          "name": "Next greater",
          "time": "O(n)",
          "space": "O(n)",
          "code": "vector<int> nextGreaterElement(vector<int>& nums1, vector<int>& nums2) {\n    unordered_map<int,int> nge; stack<int> st;\n    for (int x: nums2) { while (!st.empty() && x>st.top()) { nge[st.top()]=x; st.pop(); } st.push(x); }\n    vector<int> ans; for (int x: nums1) ans.push_back(nge.count(x)? nge[x]: -1); return ans;\n}"
        }
      ],
      "description": "The next greater element of some element `x` in an array is the first greater element that is to the right of `x` in the same array.\n\nYou are given two distinct 0-indexed integer arrays `nums1` and `nums2`, where `nums1` is a subset of `nums2`.\n\nFor each `0 Example 1:\n\nInput: nums1 = [4,1,2], nums2 = [1,3,4,2]\nOutput: [-1,3,-1]\nExplanation: The next greater element for each value of nums1 is as follows:\n- 4 is underlined in nums2 = [1,3,4,2]. There is no next greater element, so the answer is -1.\n- 1 is underlined in nums2 = [1,3,4,2]. The next greater element is 3.\n- 2 is underlined in nums2 = [1,3,4,2]. There is no next greater element, so the answer is -1.\n\nExample 2:\n\nInput: nums1 = [2,4], nums2 = [1,2,3,4]\nOutput: [3,-1]\nExplanation: The next greater element for each value of nums1 is as follows:\n- 2 is underlined in nums2 = [1,2,3,4]. The next greater element is 3.\n- 4 is underlined in nums2 = [1,2,3,4]. There is no next greater element, so the answer is -1.\n\n \n\nConstraints:\n\n\t• `1 4`\n• All integers in `nums1` and `nums2` are unique.\n• All the integers of `nums1` also appear in `nums2`.\n\n \nFollow up: Could you find an `O(nums1.length + nums2.length)` solution?",
      "descriptionHtml": "<p>The <strong>next greater element</strong> of some element <code>x</code> in an array is the <strong>first greater</strong> element that is <strong>to the right</strong> of <code>x</code> in the same array.</p>\n\n<p>You are given two <strong>distinct 0-indexed</strong> integer arrays <code>nums1</code> and <code>nums2</code>, where <code>nums1</code> is a subset of <code>nums2</code>.</p>\n\n<p>For each <code>0 &lt;= i &lt; nums1.length</code>, find the index <code>j</code> such that <code>nums1[i] == nums2[j]</code> and determine the <strong>next greater element</strong> of <code>nums2[j]</code> in <code>nums2</code>. If there is no next greater element, then the answer for this query is <code>-1</code>.</p>\n\n<p>Return <em>an array </em><code>ans</code><em> of length </em><code>nums1.length</code><em> such that </em><code>ans[i]</code><em> is the <strong>next greater element</strong> as described above.</em></p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums1 = [4,1,2], nums2 = [1,3,4,2]\n<strong>Output:</strong> [-1,3,-1]\n<strong>Explanation:</strong> The next greater element for each value of nums1 is as follows:\n- 4 is underlined in nums2 = [1,3,<u>4</u>,2]. There is no next greater element, so the answer is -1.\n- 1 is underlined in nums2 = [<u>1</u>,3,4,2]. The next greater element is 3.\n- 2 is underlined in nums2 = [1,3,4,<u>2</u>]. There is no next greater element, so the answer is -1.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums1 = [2,4], nums2 = [1,2,3,4]\n<strong>Output:</strong> [3,-1]\n<strong>Explanation:</strong> The next greater element for each value of nums1 is as follows:\n- 2 is underlined in nums2 = [1,<u>2</u>,3,4]. The next greater element is 3.\n- 4 is underlined in nums2 = [1,2,3,<u>4</u>]. There is no next greater element, so the answer is -1.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= nums1.length &lt;= nums2.length &lt;= 1000</code></li>\n\t<li><code>0 &lt;= nums1[i], nums2[i] &lt;= 10<sup>4</sup></code></li>\n\t<li>All integers in <code>nums1</code> and <code>nums2</code> are <strong>unique</strong>.</li>\n\t<li>All the integers of <code>nums1</code> also appear in <code>nums2</code>.</li>\n</ul>\n\n<p>&nbsp;</p>\n<strong>Follow up:</strong> Could you find an <code>O(nums1.length + nums2.length)</code> solution?",
      "lcSlug": "next-greater-element-i",
      "summary": "Next greater — Monotonic stack/queue maintains increasing/decreasing order of candidates."
    },
    {
      "id": "st-06",
      "title": "Next Greater Element II",
      "lc": 503,
      "importance": "should",
      "subtopic": "monotonic",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "circular nums",
          "out": "NGE"
        }
      ],
      "approaches": [
        {
          "name": "Monotonic stack",
          "time": "O(n)",
          "space": "O(n)",
          "code": "stack<int> st;\nfor (int i=0;i<n;i++) {\n  while (!st.empty() && cond(st.top(), i)) st.pop();\n  st.push(i);\n}"
        }
      ],
      "description": "Given a circular integer array `nums` (i.e., the next element of `nums[nums.length - 1]` is `nums[0]`), return the next greater number for every element in `nums`.\n\nThe next greater number of a number `x` is the first greater number to its traversing-order next in the array, which means you could search circularly to find its next greater number. If it doesn't exist, return `-1` for this number.\n\n \n\nExample 1:\n\nInput: nums = [1,2,1]\nOutput: [2,-1,2]\nExplanation: The first 1's next greater number is 2; \nThe number 2 can't find next greater number. \nThe second 1's next greater number needs to search circularly, which is also 2.\n\nExample 2:\n\nInput: nums = [1,2,3,4,3]\nOutput: [2,3,4,-1,4]\n\n \n\nConstraints:\n\n\t• `1 4`\n• `-109 9`",
      "descriptionHtml": "<p>Given a circular integer array <code>nums</code> (i.e., the next element of <code>nums[nums.length - 1]</code> is <code>nums[0]</code>), return <em>the <strong>next greater number</strong> for every element in</em> <code>nums</code>.</p>\n\n<p>The <strong>next greater number</strong> of a number <code>x</code> is the first greater number to its traversing-order next in the array, which means you could search circularly to find its next greater number. If it doesn&#39;t exist, return <code>-1</code> for this number.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [1,2,1]\n<strong>Output:</strong> [2,-1,2]\nExplanation: The first 1&#39;s next greater number is 2; \nThe number 2 can&#39;t find next greater number. \nThe second 1&#39;s next greater number needs to search circularly, which is also 2.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [1,2,3,4,3]\n<strong>Output:</strong> [2,3,4,-1,4]\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= nums.length &lt;= 10<sup>4</sup></code></li>\n\t<li><code>-10<sup>9</sup> &lt;= nums[i] &lt;= 10<sup>9</sup></code></li>\n</ul>\n",
      "lcSlug": "next-greater-element-ii",
      "summary": "Stack of indices; pop while current violates monotonic property."
    },
    {
      "id": "st-07",
      "title": "Largest Rectangle in Histogram",
      "lc": 84,
      "importance": "must",
      "subtopic": "monotonic",
      "difficulty": "Hard",
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
          "name": "Histogram",
          "time": "O(n)",
          "space": "O(n)",
          "code": "int largestRectangleArea(vector<int>& h) {\n    stack<int> st; int ans=0; h.push_back(0);\n    for (int i=0;i<(int)h.size();i++) {\n        while (!st.empty() && h[i]<h[st.top()]) {\n            int height=h[st.top()]; st.pop();\n            int width = st.empty()? i : i-st.top()-1;\n            ans = max(ans, height*width);\n        } st.push(i);\n    } return ans;\n}"
        }
      ],
      "description": "Given an array of integers `heights` representing the histogram's bar height where the width of each bar is `1`, return the area of the largest rectangle in the histogram.\n\n \n\nExample 1:\n\nInput: heights = [2,1,5,6,2,3]\nOutput: 10\nExplanation: The above is a histogram where width of each bar is 1.\nThe largest rectangle is shown in the red area, which has an area = 10 units.\n\nExample 2:\n\nInput: heights = [2,4]\nOutput: 4\n\n \n\nConstraints:\n\n\t• `1 5`\n• `0 4`",
      "descriptionHtml": "<p>Given an array of integers <code>heights</code> representing the histogram&#39;s bar height where the width of each bar is <code>1</code>, return <em>the area of the largest rectangle in the histogram</em>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2021/01/04/histogram.jpg\" style=\"width: 522px; height: 242px;\" />\n<pre>\n<strong>Input:</strong> heights = [2,1,5,6,2,3]\n<strong>Output:</strong> 10\n<strong>Explanation:</strong> The above is a histogram where width of each bar is 1.\nThe largest rectangle is shown in the red area, which has an area = 10 units.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2021/01/04/histogram-1.jpg\" style=\"width: 202px; height: 362px;\" />\n<pre>\n<strong>Input:</strong> heights = [2,4]\n<strong>Output:</strong> 4\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= heights.length &lt;= 10<sup>5</sup></code></li>\n\t<li><code>0 &lt;= heights[i] &lt;= 10<sup>4</sup></code></li>\n</ul>\n",
      "lcSlug": "largest-rectangle-in-histogram",
      "summary": "Histogram — Monotonic stack/queue maintains increasing/decreasing order of candidates."
    },
    {
      "id": "st-08",
      "title": "Maximal Rectangle",
      "lc": 85,
      "importance": "should",
      "subtopic": "monotonic",
      "difficulty": "Hard",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "matrix",
          "out": "max rect"
        }
      ],
      "approaches": [
        {
          "name": "Monotonic stack",
          "time": "O(n)",
          "space": "O(n)",
          "code": "stack<int> st;\nfor (int i=0;i<n;i++) {\n  while (!st.empty() && cond(st.top(), i)) st.pop();\n  st.push(i);\n}"
        }
      ],
      "description": "Given a `rows x cols` binary `matrix` filled with `0`'s and `1`'s, find the largest rectangle containing only `1`'s and return its area.\n\n \n\nExample 1:\n\nInput: matrix = [[\"1\",\"0\",\"1\",\"0\",\"0\"],[\"1\",\"0\",\"1\",\"1\",\"1\"],[\"1\",\"1\",\"1\",\"1\",\"1\"],[\"1\",\"0\",\"0\",\"1\",\"0\"]]\nOutput: 6\nExplanation: The maximal rectangle is shown in the above picture.\n\nExample 2:\n\nInput: matrix = [[\"0\"]]\nOutput: 0\n\nExample 3:\n\nInput: matrix = [[\"1\"]]\nOutput: 1\n\n \n\nConstraints:\n\n\t• `rows == matrix.length`\n• `cols == matrix[i].length`\n• `1",
      "descriptionHtml": "<p>Given a <code>rows x cols</code>&nbsp;binary <code>matrix</code> filled with <code>0</code>&#39;s and <code>1</code>&#39;s, find the largest rectangle containing only <code>1</code>&#39;s and return <em>its area</em>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2020/09/14/maximal.jpg\" style=\"width: 402px; height: 322px;\" />\n<pre>\n<strong>Input:</strong> matrix = [[&quot;1&quot;,&quot;0&quot;,&quot;1&quot;,&quot;0&quot;,&quot;0&quot;],[&quot;1&quot;,&quot;0&quot;,&quot;1&quot;,&quot;1&quot;,&quot;1&quot;],[&quot;1&quot;,&quot;1&quot;,&quot;1&quot;,&quot;1&quot;,&quot;1&quot;],[&quot;1&quot;,&quot;0&quot;,&quot;0&quot;,&quot;1&quot;,&quot;0&quot;]]\n<strong>Output:</strong> 6\n<strong>Explanation:</strong> The maximal rectangle is shown in the above picture.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> matrix = [[&quot;0&quot;]]\n<strong>Output:</strong> 0\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> matrix = [[&quot;1&quot;]]\n<strong>Output:</strong> 1\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>rows == matrix.length</code></li>\n\t<li><code>cols == matrix[i].length</code></li>\n\t<li><code>1 &lt;= rows, cols &lt;= 200</code></li>\n\t<li><code>matrix[i][j]</code> is <code>&#39;0&#39;</code> or <code>&#39;1&#39;</code>.</li>\n</ul>\n",
      "lcSlug": "maximal-rectangle",
      "summary": "Stack of indices; pop while current violates monotonic property."
    },
    {
      "id": "st-09",
      "title": "Trapping Rain Water",
      "lc": 42,
      "importance": "must",
      "subtopic": "monotonic",
      "difficulty": "Hard",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "height",
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
      "id": "st-10",
      "title": "Basic Calculator",
      "lc": 224,
      "importance": "should",
      "subtopic": "expression",
      "difficulty": "Hard",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "s",
          "out": "value"
        }
      ],
      "approaches": [
        {
          "name": "Stack + sign",
          "time": "O(n)",
          "space": "O(n)",
          "code": "int calculate(string s) {\n    stack<int> st; int num = 0, sign = 1, ans = 0;\n    for (char ch : s) {\n        if (isdigit(ch)) num = num * 10 + (ch - '0');\n        else if (ch == '+' || ch == '-') {\n            ans += sign * num; num = 0;\n            sign = (ch == '+') ? 1 : -1;\n        } else if (ch == '(') { st.push(ans); st.push(sign); ans = 0; sign = 1; }\n        else if (ch == ')') { ans += sign * num; num = 0; ans *= st.top(); st.pop(); ans += st.top(); st.pop(); }\n    }\n    return ans + sign * num;\n}"
        }
      ],
      "description": "Given a string `s` representing a valid expression, implement a basic calculator to evaluate it, and return the result of the evaluation.\n\nNote: You are not allowed to use any built-in function which evaluates strings as mathematical expressions, such as `eval()`.\n\n \n\nExample 1:\n\nInput: s = \"1 + 1\"\nOutput: 2\n\nExample 2:\n\nInput: s = \" 2-1 + 2 \"\nOutput: 3\n\nExample 3:\n\nInput: s = \"(1+(4+5+2)-3)+(6+8)\"\nOutput: 23\n\n \n\nConstraints:\n\n\t• `1 5`\n• `s` consists of digits, `'+'`, `'-'`, `'('`, `')'`, and `' '`.\n• `s` represents a valid expression.\n• `'+'` is not used as a unary operation (i.e., `\"+1\"` and `\"+(2 + 3)\"` is invalid).\n• `'-'` could be used as a unary operation (i.e., `\"-1\"` and `\"-(2 + 3)\"` is valid).\n• There will be no two consecutive operators in the input.\n• Every number and running calculation will fit in a signed 32-bit integer.",
      "descriptionHtml": "<p>Given a string <code>s</code> representing a valid expression, implement a basic calculator to evaluate it, and return <em>the result of the evaluation</em>.</p>\n\n<p><strong>Note:</strong> You are <strong>not</strong> allowed to use any built-in function which evaluates strings as mathematical expressions, such as <code>eval()</code>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> s = &quot;1 + 1&quot;\n<strong>Output:</strong> 2\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> s = &quot; 2-1 + 2 &quot;\n<strong>Output:</strong> 3\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> s = &quot;(1+(4+5+2)-3)+(6+8)&quot;\n<strong>Output:</strong> 23\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= s.length &lt;= 3 * 10<sup>5</sup></code></li>\n\t<li><code>s</code> consists of digits, <code>&#39;+&#39;</code>, <code>&#39;-&#39;</code>, <code>&#39;(&#39;</code>, <code>&#39;)&#39;</code>, and <code>&#39; &#39;</code>.</li>\n\t<li><code>s</code> represents a valid expression.</li>\n\t<li><code>&#39;+&#39;</code> is <strong>not</strong> used as a unary operation (i.e., <code>&quot;+1&quot;</code> and <code>&quot;+(2 + 3)&quot;</code> is invalid).</li>\n\t<li><code>&#39;-&#39;</code> could be used as a unary operation (i.e., <code>&quot;-1&quot;</code> and <code>&quot;-(2 + 3)&quot;</code> is valid).</li>\n\t<li>There will be no two consecutive operators in the input.</li>\n\t<li>Every number and running calculation will fit in a signed 32-bit integer.</li>\n</ul>\n",
      "lcSlug": "basic-calculator",
      "summary": "Track num and sign; '(' push state; ')' pop and combine."
    },
    {
      "id": "st-11",
      "title": "Basic Calculator II",
      "lc": 227,
      "importance": "should",
      "subtopic": "expression",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "s +-*",
          "out": "value"
        }
      ],
      "approaches": [
        {
          "name": "Stack eval",
          "time": "O(n)",
          "space": "O(n)",
          "code": "int calculate(string s) {\n    long cur = 0, prev = 0, ans = 0; char op = '+';\n    for (int i = 0; i <= (int)s.size(); i++) {\n        if (i < (int)s.size() && s[i] == ' ') continue;\n        if (i == (int)s.size() || !isdigit(s[i])) {\n            if (op == '+' || op == '-') { ans += prev; prev = (op == '+') ? cur : -cur; }\n            else if (op == '*') prev *= cur; else prev /= cur;\n            if (i < (int)s.size()) op = s[i]; cur = 0;\n        } else cur = cur * 10 + (s[i] - '0');\n    }\n    return (int)(ans + prev);\n}"
        }
      ],
      "description": "Given a string `s` which represents an expression, evaluate this expression and return its value. \n\nThe integer division should truncate toward zero.\n\nYou may assume that the given expression is always valid. All intermediate results will be in the range of `[-231, 231 - 1]`.\n\nNote: You are not allowed to use any built-in function which evaluates strings as mathematical expressions, such as `eval()`.\n\n \n\nExample 1:\n\nInput: s = \"3+2*2\"\nOutput: 7\n\nExample 2:\n\nInput: s = \" 3/2 \"\nOutput: 1\n\nExample 3:\n\nInput: s = \" 3+5 / 2 \"\nOutput: 5\n\n \n\nConstraints:\n\n\t• `1 5`\n• `s` consists of integers and operators `('+', '-', '*', '/')` separated by some number of spaces.\n• `s` represents a valid expression.\n• All the integers in the expression are non-negative integers in the range `[0, 231 - 1]`.\n• The answer is guaranteed to fit in a 32-bit integer.",
      "descriptionHtml": "<p>Given a string <code>s</code> which represents an expression, <em>evaluate this expression and return its value</em>.&nbsp;</p>\n\n<p>The integer division should truncate toward zero.</p>\n\n<p>You may assume that the given expression is always valid. All intermediate results will be in the range of <code>[-2<sup>31</sup>, 2<sup>31</sup> - 1]</code>.</p>\n\n<p><strong>Note:</strong> You are not allowed to use any built-in function which evaluates strings as mathematical expressions, such as <code>eval()</code>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<pre><strong>Input:</strong> s = \"3+2*2\"\n<strong>Output:</strong> 7\n</pre><p><strong class=\"example\">Example 2:</strong></p>\n<pre><strong>Input:</strong> s = \" 3/2 \"\n<strong>Output:</strong> 1\n</pre><p><strong class=\"example\">Example 3:</strong></p>\n<pre><strong>Input:</strong> s = \" 3+5 / 2 \"\n<strong>Output:</strong> 5\n</pre>\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= s.length &lt;= 3 * 10<sup>5</sup></code></li>\n\t<li><code>s</code> consists of integers and operators <code>(&#39;+&#39;, &#39;-&#39;, &#39;*&#39;, &#39;/&#39;)</code> separated by some number of spaces.</li>\n\t<li><code>s</code> represents <strong>a valid expression</strong>.</li>\n\t<li>All the integers in the expression are non-negative integers in the range <code>[0, 2<sup>31</sup> - 1]</code>.</li>\n\t<li>The answer is <strong>guaranteed</strong> to fit in a <strong>32-bit integer</strong>.</li>\n</ul>\n",
      "lcSlug": "basic-calculator-ii",
      "summary": "Numbers push; operator pop b,a compute push."
    },
    {
      "id": "st-12",
      "title": "Asteroid Collision",
      "lc": 735,
      "importance": "should",
      "subtopic": "monotonic",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "asteroids",
          "out": "survivors"
        }
      ],
      "approaches": [
        {
          "name": "Monotonic stack",
          "time": "O(n)",
          "space": "O(n)",
          "code": "stack<int> st;\nfor (int i=0;i<n;i++) {\n  while (!st.empty() && cond(st.top(), i)) st.pop();\n  st.push(i);\n}"
        }
      ],
      "description": "We are given an array `asteroids` of integers representing asteroids in a row. The indices of the asteroid in the array represent their relative position in space.\n\nFor each asteroid, the absolute value represents its size, and the sign represents its direction (positive meaning right, negative meaning left). Each asteroid moves at the same speed.\n\nFind out the state of the asteroids after all collisions. If two asteroids meet, the smaller one will explode. If both are the same size, both will explode. Two asteroids moving in the same direction will never meet.\n\n \n\nExample 1:\n\nInput: asteroids = [5,10,-5]\nOutput: [5,10]\nExplanation: The 10 and -5 collide resulting in 10. The 5 and 10 never collide.\n\nExample 2:\n\nInput: asteroids = [8,-8]\nOutput: []\nExplanation: The 8 and -8 collide exploding each other.\n\nExample 3:\n\nInput: asteroids = [10,2,-5]\nOutput: [10]\nExplanation: The 2 and -5 collide resulting in -5. The 10 and -5 collide resulting in 10.\n\nExample 4:\n\nInput: asteroids = [3,5,-6,2,-1,4]​​​​​​​\nOutput: [-6,2,4]\nExplanation: The asteroid -6 makes the asteroid 3 and 5 explode, and then continues going left. On the other side, the asteroid 2 makes the asteroid -1 explode and then continues going right, without reaching asteroid 4.\n\n \n\nConstraints:\n\n\t• `2 4`\n• `-1000",
      "descriptionHtml": "<p>We are given an array <code>asteroids</code> of integers representing asteroids in a row. The indices of the asteroid in the array represent their relative position in space.</p>\n\n<p>For each asteroid, the absolute value represents its size, and the sign represents its direction (positive meaning right, negative meaning left). Each asteroid moves at the same speed.</p>\n\n<p>Find out the state of the asteroids after all collisions. If two asteroids meet, the smaller one will explode. If both are the same size, both will explode. Two asteroids moving in the same direction will never meet.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> asteroids = [5,10,-5]\n<strong>Output:</strong> [5,10]\n<strong>Explanation:</strong> The 10 and -5 collide resulting in 10. The 5 and 10 never collide.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> asteroids = [8,-8]\n<strong>Output:</strong> []\n<strong>Explanation:</strong> The 8 and -8 collide exploding each other.\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> asteroids = [10,2,-5]\n<strong>Output:</strong> [10]\n<strong>Explanation:</strong> The 2 and -5 collide resulting in -5. The 10 and -5 collide resulting in 10.\n</pre>\n\n<p><strong class=\"example\">Example 4:</strong></p>\n\n<pre>\n<strong>Input:</strong> asteroids = [3,5,-6,2,-1,4]​​​​​​​\n<strong>Output:</strong> [-6,2,4]\n<strong>Explanation:</strong> The asteroid -6 makes the asteroid 3 and 5 explode, and then continues going left. On the other side, the asteroid 2 makes the asteroid -1 explode and then continues going right, without reaching asteroid 4.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>2 &lt;= asteroids.length &lt;= 10<sup>4</sup></code></li>\n\t<li><code>-1000 &lt;= asteroids[i] &lt;= 1000</code></li>\n\t<li><code>asteroids[i] != 0</code></li>\n</ul>\n",
      "lcSlug": "asteroid-collision",
      "summary": "Stack of indices; pop while current violates monotonic property."
    },
    {
      "id": "st-13",
      "title": "Remove K Digits",
      "lc": 402,
      "importance": "should",
      "subtopic": "monotonic",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "num,k",
          "out": "smallest"
        }
      ],
      "approaches": [
        {
          "name": "Monotonic stack",
          "time": "O(n)",
          "space": "O(n)",
          "code": "stack<int> st;\nfor (int i=0;i<n;i++) {\n  while (!st.empty() && cond(st.top(), i)) st.pop();\n  st.push(i);\n}"
        }
      ],
      "description": "Given string num representing a non-negative integer `num`, and an integer `k`, return the smallest possible integer after removing `k` digits from `num`.\n\n \n\nExample 1:\n\nInput: num = \"1432219\", k = 3\nOutput: \"1219\"\nExplanation: Remove the three digits 4, 3, and 2 to form the new number 1219 which is the smallest.\n\nExample 2:\n\nInput: num = \"10200\", k = 1\nOutput: \"200\"\nExplanation: Remove the leading 1 and the number is 200. Note that the output must not contain leading zeroes.\n\nExample 3:\n\nInput: num = \"10\", k = 2\nOutput: \"0\"\nExplanation: Remove all the digits from the number and it is left with nothing which is 0.\n\n \n\nConstraints:\n\n\t• `1 5`\n• `num` consists of only digits.\n• `num` does not have any leading zeros except for the zero itself.",
      "descriptionHtml": "<p>Given string num representing a non-negative integer <code>num</code>, and an integer <code>k</code>, return <em>the smallest possible integer after removing</em> <code>k</code> <em>digits from</em> <code>num</code>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> num = &quot;1432219&quot;, k = 3\n<strong>Output:</strong> &quot;1219&quot;\n<strong>Explanation:</strong> Remove the three digits 4, 3, and 2 to form the new number 1219 which is the smallest.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> num = &quot;10200&quot;, k = 1\n<strong>Output:</strong> &quot;200&quot;\n<strong>Explanation:</strong> Remove the leading 1 and the number is 200. Note that the output must not contain leading zeroes.\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> num = &quot;10&quot;, k = 2\n<strong>Output:</strong> &quot;0&quot;\n<strong>Explanation:</strong> Remove all the digits from the number and it is left with nothing which is 0.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= k &lt;= num.length &lt;= 10<sup>5</sup></code></li>\n\t<li><code>num</code> consists of only digits.</li>\n\t<li><code>num</code> does not have any leading zeros except for the zero itself.</li>\n</ul>\n",
      "lcSlug": "remove-k-digits",
      "summary": "Stack of indices; pop while current violates monotonic property."
    },
    {
      "id": "st-14",
      "title": "Sum of Subarray Minimums",
      "lc": 907,
      "importance": "should",
      "subtopic": "monotonic",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "arr",
          "out": "sum mins"
        }
      ],
      "approaches": [
        {
          "name": "Monotonic stack",
          "time": "O(n)",
          "space": "O(n)",
          "code": "stack<int> st;\nfor (int i=0;i<n;i++) {\n  while (!st.empty() && cond(st.top(), i)) st.pop();\n  st.push(i);\n}"
        }
      ],
      "description": "Given an array of integers arr, find the sum of `min(b)`, where `b` ranges over every (contiguous) subarray of `arr`. Since the answer may be large, return the answer modulo `109 + 7`.\n\n \n\nExample 1:\n\nInput: arr = [3,1,2,4]\nOutput: 17\nExplanation: \nSubarrays are [3], [1], [2], [4], [3,1], [1,2], [2,4], [3,1,2], [1,2,4], [3,1,2,4]. \nMinimums are 3, 1, 2, 4, 1, 1, 2, 1, 1, 1.\nSum is 17.\n\nExample 2:\n\nInput: arr = [11,81,94,43,3]\nOutput: 444\n\n \n\nConstraints:\n\n\t• `1 4`\n• `1 4`",
      "descriptionHtml": "<p>Given an array of integers arr, find the sum of <code>min(b)</code>, where <code>b</code> ranges over every (contiguous) subarray of <code>arr</code>. Since the answer may be large, return the answer <strong>modulo</strong> <code>10<sup>9</sup> + 7</code>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> arr = [3,1,2,4]\n<strong>Output:</strong> 17\n<strong>Explanation:</strong> \nSubarrays are [3], [1], [2], [4], [3,1], [1,2], [2,4], [3,1,2], [1,2,4], [3,1,2,4]. \nMinimums are 3, 1, 2, 4, 1, 1, 2, 1, 1, 1.\nSum is 17.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> arr = [11,81,94,43,3]\n<strong>Output:</strong> 444\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= arr.length &lt;= 3 * 10<sup>4</sup></code></li>\n\t<li><code>1 &lt;= arr[i] &lt;= 3 * 10<sup>4</sup></code></li>\n</ul>\n",
      "lcSlug": "sum-of-subarray-minimums",
      "summary": "Stack of indices; pop while current violates monotonic property."
    },
    {
      "id": "st-15",
      "title": "Online Stock Span",
      "lc": 901,
      "importance": "nice",
      "subtopic": "monotonic",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "prices stream",
          "out": "spans"
        }
      ],
      "approaches": [
        {
          "name": "Monotonic stack",
          "time": "O(n)",
          "space": "O(n)",
          "code": "stack<int> st;\nfor (int i=0;i<n;i++) {\n  while (!st.empty() && cond(st.top(), i)) st.pop();\n  st.push(i);\n}"
        }
      ],
      "description": "Design an algorithm that collects daily price quotes for some stock and returns the span of that stock's price for the current day.\n\nThe span of the stock's price in one day is the maximum number of consecutive days (starting from that day and going backward) for which the stock price was less than or equal to the price of that day.\n\n\t• For example, if the prices of the stock in the last four days is `[7,2,1,2]` and the price of the stock today is `2`, then the span of today is `4` because starting from today, the price of the stock was less than or equal `2` for `4` consecutive days.\n• Also, if the prices of the stock in the last four days is `[7,34,1,2]` and the price of the stock today is `8`, then the span of today is `3` because starting from today, the price of the stock was less than or equal `8` for `3` consecutive days.\n\nImplement the `StockSpanner` class:\n\n\t• `StockSpanner()` Initializes the object of the class.\n• `int next(int price)` Returns the span of the stock's price given that today's price is `price`.\n\n \n\nExample 1:\n\nInput\n[\"StockSpanner\", \"next\", \"next\", \"next\", \"next\", \"next\", \"next\", \"next\"]\n[[], [100], [80], [60], [70], [60], [75], [85]]\nOutput\n[null, 1, 1, 1, 2, 1, 4, 6]\n\nExplanation\nStockSpanner stockSpanner = new StockSpanner();\nstockSpanner.next(100); // return 1\nstockSpanner.next(80);  // return 1\nstockSpanner.next(60);  // return 1\nstockSpanner.next(70);  // return 2\nstockSpanner.next(60);  // return 1\nstockSpanner.next(75);  // return 4, because the last 4 prices (including today's price of 75) were less than or equal to today's price.\nstockSpanner.next(85);  // return 6\n\n \n\nConstraints:\n\n\t• `1 5`\n• At most `104` calls will be made to `next`.",
      "descriptionHtml": "<p>Design an algorithm that collects daily price quotes for some stock and returns <strong>the span</strong> of that stock&#39;s price for the current day.</p>\n\n<p>The <strong>span</strong> of the stock&#39;s price in one day is the maximum number of consecutive days (starting from that day and going backward) for which the stock price was less than or equal to the price of that day.</p>\n\n<ul>\n\t<li>For example, if the prices of the stock in the last four days is <code>[7,2,1,2]</code> and the price of the stock today is <code>2</code>, then the span of today is <code>4</code> because starting from today, the price of the stock was less than or equal <code>2</code> for <code>4</code> consecutive days.</li>\n\t<li>Also, if the prices of the stock in the last four days is <code>[7,34,1,2]</code> and the price of the stock today is <code>8</code>, then the span of today is <code>3</code> because starting from today, the price of the stock was less than or equal <code>8</code> for <code>3</code> consecutive days.</li>\n</ul>\n\n<p>Implement the <code>StockSpanner</code> class:</p>\n\n<ul>\n\t<li><code>StockSpanner()</code> Initializes the object of the class.</li>\n\t<li><code>int next(int price)</code> Returns the <strong>span</strong> of the stock&#39;s price given that today&#39;s price is <code>price</code>.</li>\n</ul>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input</strong>\n[&quot;StockSpanner&quot;, &quot;next&quot;, &quot;next&quot;, &quot;next&quot;, &quot;next&quot;, &quot;next&quot;, &quot;next&quot;, &quot;next&quot;]\n[[], [100], [80], [60], [70], [60], [75], [85]]\n<strong>Output</strong>\n[null, 1, 1, 1, 2, 1, 4, 6]\n\n<strong>Explanation</strong>\nStockSpanner stockSpanner = new StockSpanner();\nstockSpanner.next(100); // return 1\nstockSpanner.next(80);  // return 1\nstockSpanner.next(60);  // return 1\nstockSpanner.next(70);  // return 2\nstockSpanner.next(60);  // return 1\nstockSpanner.next(75);  // return 4, because the last 4 prices (including today&#39;s price of 75) were less than or equal to today&#39;s price.\nstockSpanner.next(85);  // return 6\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= price &lt;= 10<sup>5</sup></code></li>\n\t<li>At most <code>10<sup>4</sup></code> calls will be made to <code>next</code>.</li>\n</ul>\n",
      "lcSlug": "online-stock-span",
      "summary": "Stack of indices; pop while current violates monotonic property."
    },
    {
      "id": "st-16",
      "title": "Decode String",
      "lc": 394,
      "importance": "should",
      "subtopic": "basic",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "s",
          "out": "decoded"
        }
      ],
      "approaches": [
        {
          "name": "Stack decode",
          "time": "O(n)",
          "space": "O(n)",
          "code": "string decodeString(string s) {\n    stack<int> cnt; stack<string> st; string cur;\n    for (int i = 0; i < (int)s.size(); i++) {\n        if (isdigit(s[i])) {\n            int k = 0; while (i < (int)s.size() && isdigit(s[i])) k = k*10 + (s[i++]-'0'); i--;\n            cnt.push(k); st.push(cur); cur.clear();\n        } else if (s[i] == '[') { /* noop */ }\n        else if (s[i] == ']') {\n            string prev = st.top(); st.pop(); int k = cnt.top(); cnt.pop();\n            string rep; while (k--) rep += cur; cur = prev + rep;\n        } else cur += s[i];\n    }\n    return cur;\n}"
        }
      ],
      "description": "Given an encoded string, return its decoded string.\n\nThe encoding rule is: `k[encoded_string]`, where the `encoded_string` inside the square brackets is being repeated exactly `k` times. Note that `k` is guaranteed to be a positive integer.\n\nYou may assume that the input string is always valid; there are no extra white spaces, square brackets are well-formed, etc. Furthermore, you may assume that the original data does not contain any digits and that digits are only for those repeat numbers, `k`. For example, there will not be input like `3a` or `2[4]`.\n\nThe test cases are generated so that the length of the output will never exceed `105`.\n\n \n\nExample 1:\n\nInput: s = \"3[a]2[bc]\"\nOutput: \"aaabcbc\"\n\nExample 2:\n\nInput: s = \"3[a2[c]]\"\nOutput: \"accaccacc\"\n\nExample 3:\n\nInput: s = \"2[abc]3[cd]ef\"\nOutput: \"abcabccdcdcdef\"\n\n \n\nConstraints:\n\n\t• `1",
      "descriptionHtml": "<p>Given an encoded string, return its decoded string.</p>\n\n<p>The encoding rule is: <code>k[encoded_string]</code>, where the <code>encoded_string</code> inside the square brackets is being repeated exactly <code>k</code> times. Note that <code>k</code> is guaranteed to be a positive integer.</p>\n\n<p>You may assume that the input string is always valid; there are no extra white spaces, square brackets are well-formed, etc. Furthermore, you may assume that the original data does not contain any digits and that digits are only for those repeat numbers, <code>k</code>. For example, there will not be input like <code>3a</code> or <code>2[4]</code>.</p>\n\n<p>The test cases are generated so that the length of the output will never exceed <code>10<sup>5</sup></code>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> s = &quot;3[a]2[bc]&quot;\n<strong>Output:</strong> &quot;aaabcbc&quot;\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> s = &quot;3[a2[c]]&quot;\n<strong>Output:</strong> &quot;accaccacc&quot;\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> s = &quot;2[abc]3[cd]ef&quot;\n<strong>Output:</strong> &quot;abcabccdcdcdef&quot;\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= s.length &lt;= 30</code></li>\n\t<li><code>s</code> consists of lowercase English letters, digits, and square brackets <code>&#39;[]&#39;</code>.</li>\n\t<li><code>s</code> is guaranteed to be <strong>a valid</strong> input.</li>\n\t<li>All the integers in <code>s</code> are in the range <code>[1, 300]</code>.</li>\n</ul>\n",
      "lcSlug": "decode-string",
      "summary": "Stack decode — state invariant, then loop."
    },
    {
      "id": "st-17",
      "title": "Simplify Path",
      "lc": 71,
      "importance": "nice",
      "subtopic": "basic",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "path",
          "out": "simplified"
        }
      ],
      "approaches": [
        {
          "name": "Stack path parse",
          "time": "O(n)",
          "space": "O(n)",
          "code": "string simplifyPath(string path) {\n    stack<string> st; string cur;\n    for(char c: path+='/'){\n        if(c=='/'){ if(cur==\"..\" && !st.empty()) st.pop(); else if(cur!=\".\" && !cur.empty()) st.push(cur); cur.clear(); }\n        else cur+=c;\n    } string ans; if(st.empty()) return \"/\";\n    while(!st.empty()){ ans=\"/\"+st.top()+ans; st.pop(); } return ans;\n}"
        }
      ],
      "description": "You are given an absolute path for a Unix-style file system, which always begins with a slash `'/'`. Your task is to transform this absolute path into its simplified canonical path.\n\nThe rules of a Unix-style file system are as follows:\n\n\t• A single period `'.'` represents the current directory.\n• A double period `'..'` represents the previous/parent directory.\n• Multiple consecutive slashes such as `'//'` and `'///'` are treated as a single slash `'/'`.\n• Any sequence of periods that does not match the rules above should be treated as a valid directory or file name. For example, `'...' `and `'....'` are valid directory or file names.\n\nThe simplified canonical path should follow these rules:\n\n\t• The path must start with a single slash `'/'`.\n• Directories within the path must be separated by exactly one slash `'/'`.\n• The path must not end with a slash `'/'`, unless it is the root directory.\n• The path must not have any single or double periods (`'.'` and `'..'`) used to denote current or parent directories.\n\nReturn the simplified canonical path.\n\n \n\nExample 1:\n\nInput: path = \"/home/\"\n\nOutput: \"/home\"\n\nExplanation:\n\nThe trailing slash should be removed.\n\nExample 2:\n\nInput: path = \"/home//foo/\"\n\nOutput: \"/home/foo\"\n\nExplanation:\n\nMultiple consecutive slashes are replaced by a single one.\n\nExample 3:\n\nInput: path = \"/home/user/Documents/../Pictures\"\n\nOutput: \"/home/user/Pictures\"\n\nExplanation:\n\nA double period `\"..\"` refers to the directory up a level (the parent directory).\n\nExample 4:\n\nInput: path = \"/../\"\n\nOutput: \"/\"\n\nExplanation:\n\nGoing one level up from the root directory is not possible.\n\nExample 5:\n\nInput: path = \"/.../a/../b/c/../d/./\"\n\nOutput: \"/.../b/d\"\n\nExplanation:\n\n`\"...\"` is a valid name for a directory in this problem.\n\n \n\nConstraints:\n\n\t• `1",
      "descriptionHtml": "<p>You are given an <em>absolute</em> path for a Unix-style file system, which always begins with a slash <code>&#39;/&#39;</code>. Your task is to transform this absolute path into its <strong>simplified canonical path</strong>.</p>\n\n<p>The <em>rules</em> of a Unix-style file system are as follows:</p>\n\n<ul>\n\t<li>A single period <code>&#39;.&#39;</code> represents the current directory.</li>\n\t<li>A double period <code>&#39;..&#39;</code> represents the previous/parent directory.</li>\n\t<li>Multiple consecutive slashes such as <code>&#39;//&#39;</code> and <code>&#39;///&#39;</code> are treated as a single slash <code>&#39;/&#39;</code>.</li>\n\t<li>Any sequence of periods that does <strong>not match</strong> the rules above should be treated as a <strong>valid directory or</strong> <strong>file </strong><strong>name</strong>. For example, <code>&#39;...&#39; </code>and <code>&#39;....&#39;</code> are valid directory or file names.</li>\n</ul>\n\n<p>The simplified canonical path should follow these <em>rules</em>:</p>\n\n<ul>\n\t<li>The path must start with a single slash <code>&#39;/&#39;</code>.</li>\n\t<li>Directories within the path must be separated by exactly one slash <code>&#39;/&#39;</code>.</li>\n\t<li>The path must not end with a slash <code>&#39;/&#39;</code>, unless it is the root directory.</li>\n\t<li>The path must not have any single or double periods (<code>&#39;.&#39;</code> and <code>&#39;..&#39;</code>) used to denote current or parent directories.</li>\n</ul>\n\n<p>Return the <strong>simplified canonical path</strong>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<div class=\"example-block\">\n<p><strong>Input:</strong> <span class=\"example-io\">path = &quot;/home/&quot;</span></p>\n\n<p><strong>Output:</strong> <span class=\"example-io\">&quot;/home&quot;</span></p>\n\n<p><strong>Explanation:</strong></p>\n\n<p>The trailing slash should be removed.</p>\n</div>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<div class=\"example-block\">\n<p><strong>Input:</strong> <span class=\"example-io\">path = &quot;/home//foo/&quot;</span></p>\n\n<p><strong>Output:</strong> <span class=\"example-io\">&quot;/home/foo&quot;</span></p>\n\n<p><strong>Explanation:</strong></p>\n\n<p>Multiple consecutive slashes are replaced by a single one.</p>\n</div>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<div class=\"example-block\">\n<p><strong>Input:</strong> <span class=\"example-io\">path = &quot;/home/user/Documents/../Pictures&quot;</span></p>\n\n<p><strong>Output:</strong> <span class=\"example-io\">&quot;/home/user/Pictures&quot;</span></p>\n\n<p><strong>Explanation:</strong></p>\n\n<p>A double period <code>&quot;..&quot;</code> refers to the directory up a level (the parent directory).</p>\n</div>\n\n<p><strong class=\"example\">Example 4:</strong></p>\n\n<div class=\"example-block\">\n<p><strong>Input:</strong> <span class=\"example-io\">path = &quot;/../&quot;</span></p>\n\n<p><strong>Output:</strong> <span class=\"example-io\">&quot;/&quot;</span></p>\n\n<p><strong>Explanation:</strong></p>\n\n<p>Going one level up from the root directory is not possible.</p>\n</div>\n\n<p><strong class=\"example\">Example 5:</strong></p>\n\n<div class=\"example-block\">\n<p><strong>Input:</strong> <span class=\"example-io\">path = &quot;/.../a/../b/c/../d/./&quot;</span></p>\n\n<p><strong>Output:</strong> <span class=\"example-io\">&quot;/.../b/d&quot;</span></p>\n\n<p><strong>Explanation:</strong></p>\n\n<p><code>&quot;...&quot;</code> is a valid name for a directory in this problem.</p>\n</div>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= path.length &lt;= 3000</code></li>\n\t<li><code>path</code> consists of English letters, digits, period <code>&#39;.&#39;</code>, slash <code>&#39;/&#39;</code> or <code>&#39;_&#39;</code>.</li>\n\t<li><code>path</code> is a valid absolute Unix path.</li>\n</ul>\n",
      "lcSlug": "simplify-path",
      "summary": "Stack path parse — state invariant, then loop."
    },
    {
      "id": "st-18",
      "title": "Remove All Adjacent Duplicates II",
      "lc": 1209,
      "importance": "nice",
      "subtopic": "basic",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "s,k",
          "out": "result"
        }
      ],
      "approaches": [
        {
          "name": "Stack remove k",
          "time": "O(n)",
          "space": "O(n)",
          "code": "string removeDuplicates(string s, int k) {\n    vector<pair<char,int>> st;\n    for(char c: s){\n        if(!st.empty() && st.back().first==c){ if(++st.back().second==k) st.pop_back(); }\n        else st.push_back({c,1});\n    } string ans; for(auto& p: st) ans+=string(p.second,p.first); return ans;\n}"
        }
      ],
      "description": "You are given a string `s` and an integer `k`, a `k` duplicate removal consists of choosing `k` adjacent and equal letters from `s` and removing them, causing the left and the right side of the deleted substring to concatenate together.\n\nWe repeatedly make `k` duplicate removals on `s` until we no longer can.\n\nReturn the final string after all such duplicate removals have been made. It is guaranteed that the answer is unique.\n\n \n\nExample 1:\n\nInput: s = \"abcd\", k = 2\nOutput: \"abcd\"\nExplanation: There's nothing to delete.\n\nExample 2:\n\nInput: s = \"deeedbbcccbdaa\", k = 3\nOutput: \"aa\"\nExplanation: \nFirst delete \"eee\" and \"ccc\", get \"ddbbbdaa\"\nThen delete \"bbb\", get \"dddaa\"\nFinally delete \"ddd\", get \"aa\"\n\nExample 3:\n\nInput: s = \"pbbcggttciiippooaais\", k = 2\nOutput: \"ps\"\n\n \n\nConstraints:\n\n\t• `1 5`\n• `2 4`\n• `s` only contains lowercase English letters.",
      "descriptionHtml": "<p>You are given a string <code>s</code> and an integer <code>k</code>, a <code>k</code> <strong>duplicate removal</strong> consists of choosing <code>k</code> adjacent and equal letters from <code>s</code> and removing them, causing the left and the right side of the deleted substring to concatenate together.</p>\n\n<p>We repeatedly make <code>k</code> <strong>duplicate removals</strong> on <code>s</code> until we no longer can.</p>\n\n<p>Return <em>the final string after all such duplicate removals have been made</em>. It is guaranteed that the answer is <strong>unique</strong>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> s = &quot;abcd&quot;, k = 2\n<strong>Output:</strong> &quot;abcd&quot;\n<strong>Explanation: </strong>There&#39;s nothing to delete.</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> s = &quot;deeedbbcccbdaa&quot;, k = 3\n<strong>Output:</strong> &quot;aa&quot;\n<strong>Explanation: \n</strong>First delete &quot;eee&quot; and &quot;ccc&quot;, get &quot;ddbbbdaa&quot;\nThen delete &quot;bbb&quot;, get &quot;dddaa&quot;\nFinally delete &quot;ddd&quot;, get &quot;aa&quot;</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> s = &quot;pbbcggttciiippooaais&quot;, k = 2\n<strong>Output:</strong> &quot;ps&quot;\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= s.length &lt;= 10<sup>5</sup></code></li>\n\t<li><code>2 &lt;= k &lt;= 10<sup>4</sup></code></li>\n\t<li><code>s</code> only contains lowercase English letters.</li>\n</ul>\n",
      "lcSlug": "remove-all-adjacent-duplicates-in-string-ii",
      "summary": "Stack remove k — state invariant, then loop."
    },
    {
      "id": "st-19",
      "title": "132 Pattern",
      "lc": 456,
      "importance": "nice",
      "subtopic": "monotonic",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums",
          "out": "pattern?"
        }
      ],
      "approaches": [
        {
          "name": "Monotonic stack",
          "time": "O(n)",
          "space": "O(n)",
          "code": "stack<int> st;\nfor (int i=0;i<n;i++) {\n  while (!st.empty() && cond(st.top(), i)) st.pop();\n  st.push(i);\n}"
        }
      ],
      "description": "Given an array of `n` integers `nums`, a 132 pattern is a subsequence of three integers `nums[i]`, `nums[j]` and `nums[k]` such that `i Example 1:\n\nInput: nums = [1,2,3,4]\nOutput: false\nExplanation: There is no 132 pattern in the sequence.\n\nExample 2:\n\nInput: nums = [3,1,4,2]\nOutput: true\nExplanation: There is a 132 pattern in the sequence: [1, 4, 2].\n\nExample 3:\n\nInput: nums = [-1,3,2,0]\nOutput: true\nExplanation: There are three 132 patterns in the sequence: [-1, 3, 2], [-1, 3, 0] and [-1, 2, 0].\n\n \n\nConstraints:\n\n\t• `n == nums.length`\n• `1 5`\n• `-109 9`",
      "descriptionHtml": "<p>Given an array of <code>n</code> integers <code>nums</code>, a <strong>132 pattern</strong> is a subsequence of three integers <code>nums[i]</code>, <code>nums[j]</code> and <code>nums[k]</code> such that <code>i &lt; j &lt; k</code> and <code>nums[i] &lt; nums[k] &lt; nums[j]</code>.</p>\n\n<p>Return <code>true</code><em> if there is a <strong>132 pattern</strong> in </em><code>nums</code><em>, otherwise, return </em><code>false</code><em>.</em></p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [1,2,3,4]\n<strong>Output:</strong> false\n<strong>Explanation:</strong> There is no 132 pattern in the sequence.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [3,1,4,2]\n<strong>Output:</strong> true\n<strong>Explanation:</strong> There is a 132 pattern in the sequence: [1, 4, 2].\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [-1,3,2,0]\n<strong>Output:</strong> true\n<strong>Explanation:</strong> There are three 132 patterns in the sequence: [-1, 3, 2], [-1, 3, 0] and [-1, 2, 0].\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>n == nums.length</code></li>\n\t<li><code>1 &lt;= n &lt;= 2 * 10<sup>5</sup></code></li>\n\t<li><code>-10<sup>9</sup> &lt;= nums[i] &lt;= 10<sup>9</sup></code></li>\n</ul>\n",
      "lcSlug": "132-pattern",
      "summary": "Stack of indices; pop while current violates monotonic property."
    },
    {
      "id": "st-20",
      "title": "Car Fleet",
      "lc": 853,
      "importance": "should",
      "subtopic": "monotonic",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "target, position, speed",
          "out": "fleets"
        }
      ],
      "approaches": [
        {
          "name": "Monotonic stack",
          "time": "O(n)",
          "space": "O(n)",
          "code": "stack<int> st;\nfor (int i=0;i<n;i++) {\n  while (!st.empty() && cond(st.top(), i)) st.pop();\n  st.push(i);\n}"
        }
      ],
      "description": "There are `n` cars at given miles away from the starting mile 0, traveling to reach the mile `target`.\n\nYou are given two integer arrays `position` and `speed`, both of length `n`, where `position[i]` is the starting mile of the `ith` car and `speed[i]` is the speed of the `ith` car in miles per hour.\n\nA car cannot pass another car, but it can catch up and then travel next to it at the speed of the slower car.\n\nA car fleet is a single car or a group of cars driving next to each other. The speed of the car fleet is the minimum speed of any car in the fleet.\n\nIf a car catches up to a car fleet at the mile `target`, it will still be considered as part of the car fleet.\n\nReturn the number of car fleets that will arrive at the destination.\n\n \n\nExample 1:\n\nInput: target = 12, position = [10,8,0,5,3], speed = [2,4,1,1,3]\n\nOutput: 3\n\nExplanation:\n\n\t• The cars starting at 10 (speed 2) and 8 (speed 4) become a fleet, meeting each other at 12. The fleet forms at `target`.\n• The car starting at 0 (speed 1) does not catch up to any other car, so it is a fleet by itself.\n• The cars starting at 5 (speed 1) and 3 (speed 3) become a fleet, meeting each other at 6. The fleet moves at speed 1 until it reaches `target`.\n\nExample 2:\n\nInput: target = 10, position = [3], speed = [3]\n\nOutput: 1\n\nExplanation:\nThere is only one car, hence there is only one fleet.\n\nExample 3:\n\nInput: target = 100, position = [0,2,4], speed = [4,2,1]\n\nOutput: 1\n\nExplanation:\n\n\t• The cars starting at 0 (speed 4) and 2 (speed 2) become a fleet, meeting each other at 4. The car starting at 4 (speed 1) travels to 5.\n• Then, the fleet at 4 (speed 2) and the car at position 5 (speed 1) become one fleet, meeting each other at 6. The fleet moves at speed 1 until it reaches `target`.\n\n \n\nConstraints:\n\n\t• `n == position.length == speed.length`\n• `1 5`\n• `0 6`\n• `0 6`",
      "descriptionHtml": "<p>There are <code>n</code> cars at given miles away from the starting mile 0, traveling to reach the mile <code>target</code>.</p>\n\n<p>You are given two integer arrays&nbsp;<code>position</code> and <code>speed</code>, both of length <code>n</code>, where <code>position[i]</code> is the starting mile of the <code>i<sup>th</sup></code> car and <code>speed[i]</code> is the speed of the <code>i<sup>th</sup></code> car in miles per hour.</p>\n\n<p>A car cannot pass another car, but it can catch up and then travel next to it at the speed of the slower car.</p>\n\n<p>A <strong>car fleet</strong> is a single car or a group of cars driving next to each other. The speed of the car fleet is the <strong>minimum</strong> speed of any car in the fleet.</p>\n\n<p>If a car catches up to a car fleet at the mile <code>target</code>, it will still be considered as part of the car fleet.</p>\n\n<p>Return the number of car fleets that will arrive at the destination.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<div class=\"example-block\">\n<p><strong>Input:</strong> <span class=\"example-io\">target = 12, position = [10,8,0,5,3], speed = [2,4,1,1,3]</span></p>\n\n<p><strong>Output:</strong> <span class=\"example-io\">3</span></p>\n\n<p><strong>Explanation:</strong></p>\n\n<ul>\n\t<li>The cars starting at 10 (speed 2) and 8 (speed 4) become a fleet, meeting each other at 12. The fleet forms at <code>target</code>.</li>\n\t<li>The car starting at 0 (speed 1) does not catch up to any other car, so it is a fleet by itself.</li>\n\t<li>The cars starting at 5 (speed 1) and 3 (speed 3) become a fleet, meeting each other at 6. The fleet moves at speed 1 until it reaches <code>target</code>.</li>\n</ul>\n</div>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<div class=\"example-block\">\n<p><strong>Input:</strong> <span class=\"example-io\">target = 10, position = [3], speed = [3]</span></p>\n\n<p><strong>Output:</strong> <span class=\"example-io\">1</span></p>\n\n<p><strong>Explanation:</strong></p>\nThere is only one car, hence there is only one fleet.</div>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<div class=\"example-block\">\n<p><strong>Input:</strong> <span class=\"example-io\">target = 100, position = [0,2,4], speed = [4,2,1]</span></p>\n\n<p><strong>Output:</strong> <span class=\"example-io\">1</span></p>\n\n<p><strong>Explanation:</strong></p>\n\n<ul>\n\t<li>The cars starting at 0 (speed 4) and 2 (speed 2) become a fleet, meeting each other at 4. The car starting at 4 (speed 1) travels to 5.</li>\n\t<li>Then, the fleet at 4 (speed 2) and the car at position 5 (speed 1) become one fleet, meeting each other at 6. The fleet moves at speed 1 until it reaches <code>target</code>.</li>\n</ul>\n</div>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>n == position.length == speed.length</code></li>\n\t<li><code>1 &lt;= n &lt;= 10<sup>5</sup></code></li>\n\t<li><code>0 &lt; target &lt;= 10<sup>6</sup></code></li>\n\t<li><code>0 &lt;= position[i] &lt; target</code></li>\n\t<li>All the values of <code>position</code> are <strong>unique</strong>.</li>\n\t<li><code>0 &lt; speed[i] &lt;= 10<sup>6</sup></code></li>\n</ul>\n",
      "lcSlug": "car-fleet",
      "summary": "Stack of indices; pop while current violates monotonic property."
    },
    {
      "id": "st-21",
      "title": "Validate Stack Sequences",
      "lc": 946,
      "importance": "nice",
      "subtopic": "basic",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "pushed, popped",
          "out": "valid?"
        }
      ],
      "approaches": [
        {
          "name": "Greedy match stack",
          "time": "O(n)",
          "space": "O(n)",
          "code": "bool validateStackSequences(vector<int>& pushed, vector<int>& popped) {\n    stack<int> st; int j=0;\n    for(int x: pushed){\n        st.push(x);\n        while(!st.empty() && st.top()==popped[j]){ st.pop(); j++; }\n    } return j==(int)popped.size();\n}"
        }
      ],
      "description": "Given two integer arrays `pushed` and `popped` each with distinct values, return `true` if this could have been the result of a sequence of push and pop operations on an initially empty stack, or `false` otherwise.\n\n \n\nExample 1:\n\nInput: pushed = [1,2,3,4,5], popped = [4,5,3,2,1]\nOutput: true\nExplanation: We might do the following sequence:\npush(1), push(2), push(3), push(4),\npop() -> 4,\npush(5),\npop() -> 5, pop() -> 3, pop() -> 2, pop() -> 1\n\nExample 2:\n\nInput: pushed = [1,2,3,4,5], popped = [4,3,5,1,2]\nOutput: false\nExplanation: 1 cannot be popped before 2.\n\n \n\nConstraints:\n\n\t• `1",
      "descriptionHtml": "<p>Given two integer arrays <code>pushed</code> and <code>popped</code> each with distinct values, return <code>true</code><em> if this could have been the result of a sequence of push and pop operations on an initially empty stack, or </em><code>false</code><em> otherwise.</em></p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> pushed = [1,2,3,4,5], popped = [4,5,3,2,1]\n<strong>Output:</strong> true\n<strong>Explanation:</strong> We might do the following sequence:\npush(1), push(2), push(3), push(4),\npop() -&gt; 4,\npush(5),\npop() -&gt; 5, pop() -&gt; 3, pop() -&gt; 2, pop() -&gt; 1\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> pushed = [1,2,3,4,5], popped = [4,3,5,1,2]\n<strong>Output:</strong> false\n<strong>Explanation:</strong> 1 cannot be popped before 2.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= pushed.length &lt;= 1000</code></li>\n\t<li><code>0 &lt;= pushed[i] &lt;= 1000</code></li>\n\t<li>All the elements of <code>pushed</code> are <strong>unique</strong>.</li>\n\t<li><code>popped.length == pushed.length</code></li>\n\t<li><code>popped</code> is a permutation of <code>pushed</code>.</li>\n</ul>\n",
      "lcSlug": "validate-stack-sequences",
      "summary": "Greedy match stack — state invariant, then loop."
    },
    {
      "id": "st-22",
      "title": "Minimum Remove to Make Valid Parentheses",
      "lc": 1249,
      "importance": "should",
      "subtopic": "basic",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "s",
          "out": "fixed"
        }
      ],
      "approaches": [
        {
          "name": "Stack remove",
          "time": "O(n)",
          "space": "O(n)",
          "code": "string minRemoveToMakeValid(string s) {\n    string t; vector<int> st;\n    for (int i = 0; i < (int)s.size(); i++) {\n        if (s[i] == '(') { st.push_back(t.size()); t += s[i]; }\n        else if (s[i] == ')') {\n            if (!st.empty()) { st.pop_back(); t += s[i]; }\n        } else t += s[i];\n    }\n    while (!st.empty()) { t.erase(st.back(), 1); st.pop_back(); }\n    return t;\n}"
        }
      ],
      "description": "Given a string s of `'('` , `')'` and lowercase English characters.\n\nYour task is to remove the minimum number of parentheses ( `'('` or `')'`, in any positions ) so that the resulting parentheses string is valid and return any valid string.\n\nFormally, a parentheses string is valid if and only if:\n\n\t• It is the empty string, contains only lowercase characters, or\n• It can be written as `AB` (`A` concatenated with `B`), where `A` and `B` are valid strings, or\n• It can be written as `(A)`, where `A` is a valid string.\n\n \n\nExample 1:\n\nInput: s = \"lee(t(c)o)de)\"\nOutput: \"lee(t(c)o)de\"\nExplanation: \"lee(t(co)de)\" , \"lee(t(c)ode)\" would also be accepted.\n\nExample 2:\n\nInput: s = \"a)b(c)d\"\nOutput: \"ab(c)d\"\n\nExample 3:\n\nInput: s = \"))((\"\nOutput: \"\"\nExplanation: An empty string is also valid.\n\n \n\nConstraints:\n\n\t• `1 5`\n• `s[i]` is either `'('` , `')'`, or lowercase English letter.",
      "descriptionHtml": "<p>Given a string <font face=\"monospace\">s</font> of <code>&#39;(&#39;</code> , <code>&#39;)&#39;</code> and lowercase English characters.</p>\n\n<p>Your task is to remove the minimum number of parentheses ( <code>&#39;(&#39;</code> or <code>&#39;)&#39;</code>, in any positions ) so that the resulting <em>parentheses string</em> is valid and return <strong>any</strong> valid string.</p>\n\n<p>Formally, a <em>parentheses string</em> is valid if and only if:</p>\n\n<ul>\n\t<li>It is the empty string, contains only lowercase characters, or</li>\n\t<li>It can be written as <code>AB</code> (<code>A</code> concatenated with <code>B</code>), where <code>A</code> and <code>B</code> are valid strings, or</li>\n\t<li>It can be written as <code>(A)</code>, where <code>A</code> is a valid string.</li>\n</ul>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> s = &quot;lee(t(c)o)de)&quot;\n<strong>Output:</strong> &quot;lee(t(c)o)de&quot;\n<strong>Explanation:</strong> &quot;lee(t(co)de)&quot; , &quot;lee(t(c)ode)&quot; would also be accepted.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> s = &quot;a)b(c)d&quot;\n<strong>Output:</strong> &quot;ab(c)d&quot;\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> s = &quot;))((&quot;\n<strong>Output:</strong> &quot;&quot;\n<strong>Explanation:</strong> An empty string is also valid.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= s.length &lt;= 10<sup>5</sup></code></li>\n\t<li><code>s[i]</code> is either&nbsp;<code>&#39;(&#39;</code> , <code>&#39;)&#39;</code>, or lowercase English letter.</li>\n</ul>\n",
      "lcSlug": "minimum-remove-to-make-valid-parentheses",
      "summary": "Stack remove — state invariant, then loop."
    },
    {
      "id": "st-23",
      "title": "Score of Parentheses",
      "lc": 856,
      "importance": "nice",
      "subtopic": "basic",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "s",
          "out": "score"
        }
      ],
      "approaches": [
        {
          "name": "Stack score",
          "time": "O(n)",
          "space": "O(n)",
          "code": "int scoreOfParentheses(string s) {\n    stack<int> st; st.push(0);\n    for(char c: s){\n        if(c=='(') st.push(0);\n        else { int v=st.top(); st.pop(); st.top()+=max(1,2*v); }\n    } return st.top();\n}"
        }
      ],
      "description": "Given a balanced parentheses string `s`, return the score of the string.\n\nThe score of a balanced parentheses string is based on the following rule:\n\n\t• `\"()\"` has score `1`.\n• `AB` has score `A + B`, where `A` and `B` are balanced parentheses strings.\n• `(A)` has score `2 * A`, where `A` is a balanced parentheses string.\n\n \n\nExample 1:\n\nInput: s = \"()\"\nOutput: 1\n\nExample 2:\n\nInput: s = \"(())\"\nOutput: 2\n\nExample 3:\n\nInput: s = \"()()\"\nOutput: 2\n\n \n\nConstraints:\n\n\t• `2",
      "descriptionHtml": "<p>Given a balanced parentheses string <code>s</code>, return <em>the <strong>score</strong> of the string</em>.</p>\n\n<p>The <strong>score</strong> of a balanced parentheses string is based on the following rule:</p>\n\n<ul>\n\t<li><code>&quot;()&quot;</code> has score <code>1</code>.</li>\n\t<li><code>AB</code> has score <code>A + B</code>, where <code>A</code> and <code>B</code> are balanced parentheses strings.</li>\n\t<li><code>(A)</code> has score <code>2 * A</code>, where <code>A</code> is a balanced parentheses string.</li>\n</ul>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> s = &quot;()&quot;\n<strong>Output:</strong> 1\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> s = &quot;(())&quot;\n<strong>Output:</strong> 2\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> s = &quot;()()&quot;\n<strong>Output:</strong> 2\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>2 &lt;= s.length &lt;= 50</code></li>\n\t<li><code>s</code> consists of only <code>&#39;(&#39;</code> and <code>&#39;)&#39;</code>.</li>\n\t<li><code>s</code> is a balanced parentheses string.</li>\n</ul>\n",
      "lcSlug": "score-of-parentheses",
      "summary": "Stack score — state invariant, then loop."
    },
    {
      "id": "st-24",
      "title": "Longest Valid Parentheses",
      "lc": 32,
      "importance": "should",
      "subtopic": "monotonic",
      "difficulty": "Hard",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "s",
          "out": "max len"
        }
      ],
      "approaches": [
        {
          "name": "Monotonic stack",
          "time": "O(n)",
          "space": "O(n)",
          "code": "stack<int> st;\nfor (int i=0;i<n;i++) {\n  while (!st.empty() && cond(st.top(), i)) st.pop();\n  st.push(i);\n}"
        }
      ],
      "description": "Given a string containing just the characters `'('` and `')'`, return the length of the longest valid (well-formed) parentheses substring.\n\n \n\nExample 1:\n\nInput: s = \"(()\"\nOutput: 2\nExplanation: The longest valid parentheses substring is \"()\".\n\nExample 2:\n\nInput: s = \")()())\"\nOutput: 4\nExplanation: The longest valid parentheses substring is \"()()\".\n\nExample 3:\n\nInput: s = \"\"\nOutput: 0\n\n \n\nConstraints:\n\n\t• `0 4`\n• `s[i]` is `'('`, or `')'`.",
      "descriptionHtml": "<p>Given a string containing just the characters <code>&#39;(&#39;</code> and <code>&#39;)&#39;</code>, return <em>the length of the longest valid (well-formed) parentheses </em><span data-keyword=\"substring-nonempty\"><em>substring</em></span>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> s = &quot;(()&quot;\n<strong>Output:</strong> 2\n<strong>Explanation:</strong> The longest valid parentheses substring is &quot;()&quot;.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> s = &quot;)()())&quot;\n<strong>Output:</strong> 4\n<strong>Explanation:</strong> The longest valid parentheses substring is &quot;()()&quot;.\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> s = &quot;&quot;\n<strong>Output:</strong> 0\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>0 &lt;= s.length &lt;= 3 * 10<sup>4</sup></code></li>\n\t<li><code>s[i]</code> is <code>&#39;(&#39;</code>, or <code>&#39;)&#39;</code>.</li>\n</ul>\n",
      "lcSlug": "longest-valid-parentheses",
      "summary": "Stack of indices; pop while current violates monotonic property."
    }
  ]
};
