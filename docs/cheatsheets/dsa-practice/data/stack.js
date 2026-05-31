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
      "description": "Return true if brackets are opened and closed in valid order.",
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
      "description": "Design stack supporting push, pop, top, and getMin in O(1).",
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
      "description": "Evaluate arithmetic expression in reverse Polish notation.",
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
      "description": "For each day, days until a warmer temperature.",
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
      "description": "Given input per constraints, solve: Next Greater Element I.",
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
      "description": "Given input per constraints, solve: Next Greater Element II.",
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
      "description": "Area of largest rectangle in histogram.",
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
      "description": "Given input per constraints, solve: Maximal Rectangle.",
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
      "description": "Given elevation bars, compute total trapped rainwater after raining.",
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
      "description": "Evaluate string expression with +, -, parentheses.",
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
      "description": "Given input per constraints, solve: Basic Calculator II.",
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
      "description": "Given input per constraints, solve: Asteroid Collision.",
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
      "description": "Given input per constraints, solve: Remove K Digits.",
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
      "description": "Given input per constraints, solve: Sum of Subarray Minimums.",
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
      "description": "Given input per constraints, solve: Online Stock Span.",
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
      "description": "Decode k[encoded_string] patterns in string.",
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
      "description": "Given input per constraints, solve: Simplify Path.",
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
      "description": "Given input per constraints, solve: Remove All Adjacent Duplicates II.",
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
      "description": "Given input per constraints, solve: 132 Pattern.",
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
      "description": "Given input per constraints, solve: Car Fleet.",
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
      "description": "Given input per constraints, solve: Validate Stack Sequences.",
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
      "description": "Compute the minimum remove to make valid parentheses over the given input per constraints.",
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
      "description": "Given input per constraints, solve: Score of Parentheses.",
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
      "description": "Compute the longest valid parentheses over the given input per constraints.",
      "summary": "Stack of indices; pop while current violates monotonic property."
    }
  ]
};
