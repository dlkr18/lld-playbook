window.PRACTICE_TOPIC = {
  "id": "backtracking",
  "title": "Backtracking",
  "expected_count": 28,
  "strategy": "<strong>Speed-run:</strong> One skeleton: choose / explore / unchoose. Prune early. Filter <em>Must do</em> first.",
  "subtopics": [
    {
      "id": "subsets",
      "label": "Subsets"
    },
    {
      "id": "permutations",
      "label": "Permutations"
    },
    {
      "id": "combinations",
      "label": "Combinations"
    },
    {
      "id": "grid",
      "label": "Grid"
    },
    {
      "id": "constraint",
      "label": "Constraint"
    },
    {
      "id": "string",
      "label": "String"
    }
  ],
  "questions": [
    {
      "id": "bt-01",
      "title": "Subsets",
      "lc": 78,
      "importance": "must",
      "subtopic": "subsets",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums",
          "out": "all subsets"
        }
      ],
      "approaches": [
        {
          "name": "Backtrack subsets",
          "time": "O(n*2^n)",
          "space": "O(n)",
          "code": "void dfs(int i, vector<int>& nums, vector<int>& cur, vector<vector<int>>& ans) {\n    if (i == (int)nums.size()) { ans.push_back(cur); return; }\n    dfs(i+1, nums, cur, ans);\n    cur.push_back(nums[i]); dfs(i+1, nums, cur, ans); cur.pop_back();\n}\nvector<vector<int>> subsets(vector<int>& nums) {\n    vector<vector<int>> ans; vector<int> cur; dfs(0, nums, cur, ans); return ans;\n}"
        }
      ],
      "description": "Given input per constraints, solve: Subsets.",
      "summary": "dfs(i): skip i or pick i — save when i==n."
    },
    {
      "id": "bt-02",
      "title": "Subsets II",
      "lc": 90,
      "importance": "must",
      "subtopic": "subsets",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums with dups",
          "out": "unique subsets"
        }
      ],
      "approaches": [
        {
          "name": "Subsets II",
          "time": "O(n*2^n)",
          "space": "O(n)",
          "code": "void dfs(int i, vector<int>& nums, vector<int>& path, vector<vector<int>>& ans) {\n    if (i==(int)nums.size()) { ans.push_back(path); return; }\n    dfs(i+1,nums,path,ans);\n    path.push_back(nums[i]); dfs(i+1,nums,path,ans); path.pop_back();\n    while (i+1<(int)nums.size() && nums[i+1]==nums[i]) i++;\n}\nvector<vector<int>> subsetsWithDup(vector<int>& nums) {\n    sort(nums.begin(), nums.end()); vector<vector<int>> ans; vector<int> path;\n    dfs(0,nums,path,ans); return ans;\n}"
        }
      ],
      "description": "Given input per constraints, solve: Subsets II.",
      "summary": "Subsets II — state invariant, then loop."
    },
    {
      "id": "bt-03",
      "title": "Permutations",
      "lc": 46,
      "importance": "must",
      "subtopic": "permutations",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums",
          "out": "all perms"
        }
      ],
      "approaches": [
        {
          "name": "Backtrack permutations",
          "time": "O(n*n!)",
          "space": "O(n)",
          "code": "void dfs(vector<int>& nums, vector<int>& path, vector<int>& used, vector<vector<int>>& ans) {\n    if ((int)path.size() == (int)nums.size()) { ans.push_back(path); return; }\n    for (int i = 0; i < (int)nums.size(); i++) if (!used[i]) {\n        used[i]=1; path.push_back(nums[i]); dfs(nums, path, used, ans);\n        path.pop_back(); used[i]=0;\n    }\n}\nvector<vector<int>> permute(vector<int>& nums) {\n    vector<vector<int>> ans; vector<int> path, used(nums.size());\n    dfs(nums, path, used, ans); return ans;\n}"
        }
      ],
      "description": "Return all permutations of distinct integers.",
      "summary": "Pick unused element, recurse, unpick — save at full path."
    },
    {
      "id": "bt-04",
      "title": "Permutations II",
      "lc": 47,
      "importance": "should",
      "subtopic": "permutations",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "dups",
          "out": "unique perms"
        }
      ],
      "approaches": [
        {
          "name": "Permutations II",
          "time": "O(n*n!)",
          "space": "O(n)",
          "code": "void dfs(vector<int>& nums, vector<int>& path, vector<int>& used, vector<vector<int>>& ans) {\n    if ((int)path.size()==(int)nums.size()) { ans.push_back(path); return; }\n    for (int i=0;i<(int)nums.size();i++) {\n        if (used[i] || (i && nums[i]==nums[i-1] && !used[i-1])) continue;\n        used[i]=1; path.push_back(nums[i]); dfs(nums,path,used,ans); path.pop_back(); used[i]=0;\n    }\n}\nvector<vector<int>> permuteUnique(vector<int>& nums) {\n    sort(nums.begin(), nums.end()); vector<vector<int>> ans; vector<int> path, used(nums.size());\n    dfs(nums,path,used,ans); return ans;\n}"
        }
      ],
      "description": "Given input per constraints, solve: Permutations II.",
      "summary": "Permutations II — state invariant, then loop."
    },
    {
      "id": "bt-05",
      "title": "Combinations",
      "lc": 77,
      "importance": "must",
      "subtopic": "combinations",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "n, k",
          "out": "combinations"
        }
      ],
      "approaches": [
        {
          "name": "Backtrack nCk",
          "time": "O(k*C(n,k))",
          "space": "O(k)",
          "code": "void dfs(int start, int k, int n, vector<int>& path, vector<vector<int>>& ans) {\n    if ((int)path.size()==k) { ans.push_back(path); return; }\n    for (int i=start; i<=n; i++) { path.push_back(i); dfs(i+1,k,n,path,ans); path.pop_back(); }\n}\nvector<vector<int>> combine(int n, int k) {\n    vector<vector<int>> ans; vector<int> path; dfs(1,k,n,path,ans); return ans;\n}"
        }
      ],
      "description": "Given input per constraints, solve: Combinations.",
      "summary": "Backtrack nCk — state invariant, then loop."
    },
    {
      "id": "bt-06",
      "title": "Combination Sum",
      "lc": 39,
      "importance": "must",
      "subtopic": "combinations",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "candidates, target",
          "out": "combos"
        }
      ],
      "approaches": [
        {
          "name": "Backtrack combo",
          "time": "O(2^t)",
          "space": "O(t)",
          "code": "void dfs(int i, int rem, vector<int>& cand, vector<int>& path, vector<vector<int>>& ans) {\n    if (!rem) { ans.push_back(path); return; }\n    if (i==(int)cand.size()) return;\n    dfs(i+1, rem, cand, path, ans);\n    if (cand[i] <= rem) { path.push_back(cand[i]); dfs(i, rem-cand[i], cand, path, ans); path.pop_back(); }\n}\nvector<vector<int>> combinationSum(vector<int>& candidates, int target) {\n    vector<vector<int>> ans; vector<int> path; dfs(0,target,candidates,path,ans); return ans;\n}"
        }
      ],
      "description": "Find all unique combinations where candidates sum to target (reuse allowed).",
      "summary": "Backtrack combo — state invariant, then loop."
    },
    {
      "id": "bt-07",
      "title": "Combination Sum II",
      "lc": 40,
      "importance": "should",
      "subtopic": "combinations",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "dups",
          "out": "combos once"
        }
      ],
      "approaches": [
        {
          "name": "Sort + backtrack",
          "time": "O(2^n)",
          "space": "O(n)",
          "code": "vector<vector<int>> combinationSum2(vector<int>& c, int target) {\n    sort(c.begin(), c.end());\n    vector<vector<int>> ans, cur;\n    function<void(int,int)> dfs = [&](int i, int rem) {\n        if (rem == 0) { ans.push_back(cur); return; }\n        for (int j = i; j < (int)c.size(); j++) {\n            if (j > i && c[j] == c[j-1]) continue;\n            if (c[j] > rem) break;\n            cur.push_back(c[j]); dfs(j+1, rem-c[j]); cur.pop_back();\n        }\n    };\n    dfs(0, target); return ans;\n}"
        }
      ],
      "description": "Combination sum with each candidate used once; no duplicate combos.",
      "summary": "Sort + backtrack — state invariant, then loop."
    },
    {
      "id": "bt-08",
      "title": "Combination Sum III",
      "lc": 216,
      "importance": "nice",
      "subtopic": "combinations",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "k, n",
          "out": "combos sum n"
        }
      ],
      "approaches": [
        {
          "name": "Backtrack k numbers sum n",
          "time": "O(C(n,k))",
          "space": "O(k)",
          "code": "void dfs(int start,int k,int rem,vector<int>& path,vector<vector<int>>& ans){\n    if(!rem && !k){ ans.push_back(path); return; }\n    if(k<=0||rem<=0||start>9) return;\n    for(int i=start;i<=9;i++) if(i<=rem){ path.push_back(i); dfs(i+1,k-1,rem-i,path,ans); path.pop_back(); }\n}\nvector<vector<int>> combinationSum3(int k,int n){ vector<vector<int>> ans; vector<int> p; dfs(1,k,n,p,ans); return ans; }"
        }
      ],
      "description": "Given input per constraints, solve: Combination Sum III.",
      "summary": "Backtrack k numbers sum n — state invariant, then loop."
    },
    {
      "id": "bt-09",
      "title": "Letter Combinations of Phone Number",
      "lc": 17,
      "importance": "should",
      "subtopic": "string",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "digits",
          "out": "strings"
        }
      ],
      "approaches": [
        {
          "name": "Phone backtrack",
          "time": "O(4^n)",
          "space": "O(n)",
          "code": "void dfs(string& digits, int i, string& path, vector<string>& ans, vector<string>& map) {\n    if (i==(int)digits.size()) { ans.push_back(path); return; }\n    for (char c : map[digits[i]-'2']) { path.push_back(c); dfs(digits,i+1,path,ans,map); path.pop_back(); }\n}\nvector<string> letterCombinations(string digits) {\n    if (digits.empty()) return {};\n    vector<string> map={\"\",\"\",\"abc\",\"def\",\"ghi\",\"jkl\",\"mno\",\"pqrs\",\"tuv\",\"wxyz\"}, ans, path;\n    dfs(digits,0,path,ans,map); return ans;\n}"
        }
      ],
      "description": "Given input per constraints, solve: Letter Combinations of Phone Number.",
      "summary": "Phone backtrack — state invariant, then loop."
    },
    {
      "id": "bt-10",
      "title": "Generate Parentheses",
      "lc": 22,
      "importance": "must",
      "subtopic": "string",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "n pairs",
          "out": "valid strings"
        }
      ],
      "approaches": [
        {
          "name": "Backtrack parens",
          "time": "O(4^n/sqrt n)",
          "space": "O(n)",
          "code": "void dfs(string& cur, int open, int close, int n, vector<string>& ans) {\n    if ((int)cur.size()==2*n) { ans.push_back(cur); return; }\n    if (open<n) { cur+='('; dfs(cur,open+1,close,n,ans); cur.pop_back(); }\n    if (close<open) { cur+=')'; dfs(cur,open,close+1,n,ans); cur.pop_back(); }\n}\nvector<string> generateParenthesis(int n) {\n    vector<string> ans; string cur; dfs(cur,0,0,n,ans); return ans;\n}"
        }
      ],
      "description": "Given input per constraints, solve: Generate Parentheses.",
      "summary": "Backtrack parens — state invariant, then loop."
    },
    {
      "id": "bt-11",
      "title": "Word Search",
      "lc": 79,
      "importance": "must",
      "subtopic": "grid",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "board, word",
          "out": "found?"
        }
      ],
      "approaches": [
        {
          "name": "Grid DFS backtrack",
          "time": "O(mn*4^L)",
          "space": "O(L)",
          "code": "bool dfs(vector<vector<char>>& b, string& w, int i, int j, int k) {\n    if (k==(int)w.size()) return true;\n    if (i<0||j<0||i>=(int)b.size()||j>=(int)b[0].size()||b[i][j]!=w[k]) return false;\n    char tmp=b[i][j]; b[i][j]='#';\n    bool ok = dfs(b,w,i+1,j,k+1)||dfs(b,w,i-1,j,k+1)||dfs(b,w,i,j+1,k+1)||dfs(b,w,i,j-1,k+1);\n    b[i][j]=tmp; return ok;\n}\nbool exist(vector<vector<char>>& board, string word) {\n    for (int i=0;i<(int)board.size();i++) for (int j=0;j<(int)board[0].size();j++)\n        if (dfs(board,word,i,j,0)) return true;\n    return false;\n}"
        }
      ],
      "description": "Given board and word, return true if word exists by adjacent cell paths.",
      "summary": "Grid DFS backtrack — 2D DP on grid — often row-by-row or with rolling array."
    },
    {
      "id": "bt-12",
      "title": "Palindrome Partitioning",
      "lc": 131,
      "importance": "should",
      "subtopic": "string",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "s",
          "out": "partitions"
        }
      ],
      "approaches": [
        {
          "name": "Backtrack + pal check",
          "time": "O(n*2^n)",
          "space": "O(n)",
          "code": "vector<vector<string>> partition(string s) {\n    vector<vector<string>> ans; vector<string> path;\n    function<bool(int,int)> pal = [&](int l, int r) {\n        while (l < r) if (s[l++] != s[r--]) return false; return true;\n    };\n    function<void(int)> dfs = [&](int i) {\n        if (i == (int)s.size()) { ans.push_back(path); return; }\n        for (int j = i; j < (int)s.size(); j++)\n            if (pal(i, j)) { path.push_back(s.substr(i, j-i+1)); dfs(j+1); path.pop_back(); }\n    };\n    dfs(0); return ans;\n}"
        }
      ],
      "description": "Given input per constraints, solve: Palindrome Partitioning.",
      "summary": "Backtrack + pal check — state invariant, then loop."
    },
    {
      "id": "bt-13",
      "title": "Restore IP Addresses",
      "lc": 93,
      "importance": "should",
      "subtopic": "string",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "s",
          "out": "valid IPs"
        }
      ],
      "approaches": [
        {
          "name": "Backtracking",
          "time": "O(3^4)",
          "space": "O(1)",
          "code": "vector<string> restoreIpAddresses(string s) {\n    vector<string> ans;\n    function<void(int,int,string)> dfs = [&](int i, int parts, string cur) {\n        if (parts == 4 && i == (int)s.size()) { ans.push_back(cur); return; }\n        if (parts == 4 || i >= (int)s.size()) return;\n        for (int len = 1; len <= 3 && i + len <= (int)s.size(); len++) {\n            string seg = s.substr(i, len);\n            if ((seg.size() > 1 && seg[0] == '0') || stoi(seg) > 255) break;\n            dfs(i + len, parts + 1, cur.empty() ? seg : cur + \".\" + seg);\n        }\n    };\n    dfs(0, 0, \"\"); return ans;\n}"
        }
      ],
      "description": "Return all valid IP addresses from digit string.",
      "summary": "Backtracking — state invariant, then loop."
    },
    {
      "id": "bt-14",
      "title": "N-Queens",
      "lc": 51,
      "importance": "must",
      "subtopic": "constraint",
      "difficulty": "Hard",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "n",
          "out": "board configs"
        }
      ],
      "approaches": [
        {
          "name": "N-Queens",
          "time": "O(n!)",
          "space": "O(n)",
          "code": "bool ok(int r, int c, vector<int>& cols, vector<int>& diag1, vector<int>& diag2) {\n    return !cols[c] && !diag1[r-c+n] && !diag2[r+c];\n}\nvoid dfs(int r, int n, vector<int>& cols, vector<int>& d1, vector<int>& d2, vector<string>& cur, vector<vector<string>>& ans) {\n    if (r==n) { ans.push_back(cur); return; }\n    for (int c=0;c<n;c++) if (ok(r,c,cols,d1,d2)) {\n        cols[c]=d1[r-c+n]=d2[r+c]=1;\n        cur[r][c]='Q'; dfs(r+1,n,cols,d1,d2,cur,ans); cur[r][c]='.';\n        cols[c]=d1[r-c+n]=d2[r+c]=0;\n    }\n}\nvector<vector<string>> solveNQueens(int n) {\n    vector<vector<string>> ans; vector<string> cur(n,string(n,'.'));\n    vector<int> cols(n), d1(2*n), d2(2*n); dfs(0,n,cols,d1,d2,cur,ans); return ans;\n}"
        }
      ],
      "description": "Place n queens on n×n board so none attack each other.",
      "summary": "N-Queens — state invariant, then loop."
    },
    {
      "id": "bt-15",
      "title": "N-Queens II",
      "lc": 52,
      "importance": "nice",
      "subtopic": "constraint",
      "difficulty": "Hard",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "n",
          "out": "count"
        }
      ],
      "approaches": [
        {
          "name": "N-Queens count",
          "time": "O(n!)",
          "space": "O(n)",
          "code": "int solveNQueens(int n) {\n    int ans=0; vector<int> cols(n), d1(2*n), d2(2*n);\n    function<void(int)> dfs=[&](int r){\n        if(r==n){ ans++; return; }\n        for(int c=0;c<n;c++) if(!cols[c]&&!d1[r-c+n]&&!d2[r+c]){\n            cols[c]=d1[r-c+n]=d2[r+c]=1; dfs(r+1);\n            cols[c]=d1[r-c+n]=d2[r+c]=0;\n        }\n    }; dfs(0); return ans;\n}"
        }
      ],
      "description": "Given input per constraints, solve: N-Queens II.",
      "summary": "N-Queens count — state invariant, then loop."
    },
    {
      "id": "bt-16",
      "title": "Sudoku Solver",
      "lc": 37,
      "importance": "should",
      "subtopic": "constraint",
      "difficulty": "Hard",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "board",
          "out": "solve"
        }
      ],
      "approaches": [
        {
          "name": "Backtracking",
          "time": "O(9^81)",
          "space": "O(81)",
          "code": "bool sudokuSolve(vector<vector<char>>& b) {\n    for (int r = 0; r < 9; r++) for (int c = 0; c < 9; c++) if (b[r][c] == '.') {\n        for (char d = '1'; d <= '9'; d++) {\n            if (ok(b, r, c, d)) { b[r][c] = d; if (sudokuSolve(b)) return true; b[r][c] = '.'; }\n        }\n        return false;\n    }\n    return true;\n}\nbool ok(vector<vector<char>>& b, int r, int c, char d) {\n    for (int i = 0; i < 9; i++)\n        if (b[r][i] == d || b[i][c] == d || b[r/3*3+i/3][c/3*3+i%3] == d) return false;\n    return true;\n}"
        }
      ],
      "description": "Fill empty cells to complete valid 9×9 Sudoku.",
      "summary": "Backtracking — state invariant, then loop."
    },
    {
      "id": "bt-17",
      "title": "Word Search II",
      "lc": 212,
      "importance": "must",
      "subtopic": "grid",
      "difficulty": "Hard",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "board, words",
          "out": "found words"
        }
      ],
      "approaches": [
        {
          "name": "Trie + backtrack",
          "time": "O(mn*4^L)",
          "space": "O(n)",
          "code": "struct TrieNode { TrieNode* c[26]{}; string w; };\nclass Solution {\n    TrieNode* root = new TrieNode();\n    void ins(string& w) {\n        TrieNode* u = root;\n        for (char ch : w) { int i = ch-'a'; if (!u->c[i]) u->c[i] = new TrieNode(); u = u->c[i]; }\n        u->w = w;\n    }\n    void dfs(vector<vector<char>>& b, int r, int c, TrieNode* u, vector<string>& ans) {\n        if (!u->w.empty()) { ans.push_back(u->w); u->w.clear(); }\n        if (r < 0 || c < 0 || r >= (int)b.size() || c >= (int)b[0].size()) return;\n        char ch = b[r][c]; if (ch == '#') return;\n        int i = ch-'a'; if (!u->c[i]) return;\n        b[r][c] = '#'; dfs(b, r+1, c, u->c[i], ans); dfs(b, r-1, c, u->c[i], ans);\n        dfs(b, r, c+1, u->c[i], ans); dfs(b, r, c-1, u->c[i], ans); b[r][c] = ch;\n    }\npublic:\n    vector<string> findWords(vector<vector<char>>& board, vector<string>& words) {\n        for (string& w : words) ins(w);\n        vector<string> ans;\n        for (int r = 0; r < (int)board.size(); r++)\n            for (int c = 0; c < (int)board[0].size(); c++) dfs(board, r, c, root, ans);\n        return ans;\n    }\n};"
        }
      ],
      "description": "Find all words from list that exist on board (Trie + DFS).",
      "summary": "Trie + backtrack — 2D DP on grid — often row-by-row or with rolling array."
    },
    {
      "id": "bt-18",
      "title": "Remove Invalid Parentheses",
      "lc": 301,
      "importance": "nice",
      "subtopic": "string",
      "difficulty": "Hard",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "s",
          "out": "min removals"
        }
      ],
      "approaches": [
        {
          "name": "BFS min removals",
          "time": "O(2^n)",
          "space": "O(n)",
          "code": "vector<string> removeInvalidParentheses(string s) {\n    auto valid=[&](const string& t){\n        int bal=0; for(char c:t){ if(c=='(') bal++; else if(c==')'&&--bal<0) return false; } return bal==0;\n    };\n    unordered_set<string> seen; queue<string> q; q.push(s); seen.insert(s);\n    vector<string> ans; bool found=false;\n    while(!q.empty()){\n        int sz=q.size();\n        while(sz--){\n            string cur=q.front(); q.pop();\n            if(valid(cur)){ ans.push_back(cur); found=true; continue; }\n            if(found) continue;\n            for(int i=0;i<(int)cur.size();i++) if(cur[i]=='('||cur[i]==')'){\n                string nxt=cur.substr(0,i)+cur.substr(i+1);\n                if(!seen.count(nxt)){ seen.insert(nxt); q.push(nxt); }\n            }\n        } if(found) break;\n    } return ans;\n}"
        }
      ],
      "description": "Given input per constraints, solve: Remove Invalid Parentheses.",
      "summary": "BFS min removals — state invariant, then loop."
    },
    {
      "id": "bt-19",
      "title": "Partition to K Equal Sum Subsets",
      "lc": 698,
      "importance": "should",
      "subtopic": "combinations",
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
          "name": "Backtrack + prune",
          "time": "O(n*2^n)",
          "space": "O(n)",
          "code": "bool canPartitionKSubsets(vector<int>& nums, int k) {\n    int sum = accumulate(nums.begin(), nums.end(), 0);\n    if (sum % k) return false;\n    int target = sum / k;\n    sort(nums.begin(), nums.end(), greater<int>());\n    vector<int> buckets(k, 0);\n    function<bool(int)> dfs = [&](int i) {\n        if (i == (int)nums.size()) return true;\n        for (int b = 0; b < k; b++) {\n            if (b && buckets[b] == buckets[b-1]) continue;\n            if (buckets[b] + nums[i] > target) continue;\n            buckets[b] += nums[i];\n            if (dfs(i+1)) return true;\n            buckets[b] -= nums[i];\n        }\n        return false;\n    };\n    return dfs(0);\n}"
        }
      ],
      "description": "Given input per constraints, solve: Partition to K Equal Sum Subsets.",
      "summary": "Sort desc; skip equal buckets; prune when bucket sum exceeds target."
    },
    {
      "id": "bt-20",
      "title": "Beautiful Arrangement",
      "lc": 526,
      "importance": "nice",
      "subtopic": "permutations",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "n",
          "out": "count"
        }
      ],
      "approaches": [
        {
          "name": "Backtracking perms",
          "time": "O(n*n!)",
          "space": "O(n)",
          "code": "void dfs() {\n  if (path.size()==n) { save; return; }\n  for unused i: pick, dfs, unpick;\n}"
        }
      ],
      "description": "Given input per constraints, solve: Beautiful Arrangement.",
      "summary": "Backtracking perms — state invariant, then loop."
    },
    {
      "id": "bt-21",
      "title": "Target Sum",
      "lc": 494,
      "importance": "should",
      "subtopic": "combinations",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums, target",
          "out": "ways"
        }
      ],
      "approaches": [
        {
          "name": "Subset sum DP",
          "time": "O(n*sum)",
          "space": "O(sum)",
          "code": "int findTargetSumWays(vector<int>& nums, int target) {\n    int sum = accumulate(nums.begin(), nums.end(), 0);\n    if ((target + sum) % 2 || abs(target) > sum) return 0;\n    int need = (target + sum) / 2;\n    vector<int> dp(need+1, 0); dp[0] = 1;\n    for (int x : nums)\n        for (int s = need; s >= x; s--) dp[s] += dp[s-x];\n    return dp[need];\n}"
        }
      ],
      "description": "Assign +/- to nums to reach target; count ways.",
      "summary": "0/1 knapsack: iterate amounts backwards to avoid reuse."
    },
    {
      "id": "bt-22",
      "title": "Non-decreasing Subsequences",
      "lc": 491,
      "importance": "nice",
      "subtopic": "subsets",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums",
          "out": "subsequences"
        }
      ],
      "approaches": [
        {
          "name": "Backtracking subsets",
          "time": "O(n*2^n)",
          "space": "O(n)",
          "code": "void dfs(int i) {\n  if (i==n) { save; return; }\n  dfs(i+1); pick i; dfs(i+1); unpick;\n}"
        }
      ],
      "description": "Given input per constraints, solve: Non-decreasing Subsequences.",
      "summary": "Backtracking subsets — state invariant, then loop."
    },
    {
      "id": "bt-23",
      "title": "Matchsticks to Square",
      "lc": 473,
      "importance": "nice",
      "subtopic": "combinations",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "matchsticks",
          "out": "square?"
        }
      ],
      "approaches": [
        {
          "name": "Subset sum partition",
          "time": "O(4^n)",
          "space": "O(n)",
          "code": "bool canPartition(vector<int>& m){\n    int sum=accumulate(m.begin(),m.end(),0); if(sum%4) return false;\n    int side=sum/4; sort(m.rbegin(),m.rend());\n    vector<int> sides(4);\n    function<bool(int)> dfs=[&](int i){\n        if(i==(int)m.size()) return true;\n        for(int k=0;k<4;k++){\n            if(sides[k]+m[i]>side) continue;\n            sides[k]+=m[i]; if(dfs(i+1)) return true; sides[k]-=m[i];\n            if(!sides[k]) break;\n        } return false;\n    }; return dfs(0);\n}"
        }
      ],
      "description": "Given input per constraints, solve: Matchsticks to Square.",
      "summary": "Subset sum partition — state invariant, then loop."
    },
    {
      "id": "bt-24",
      "title": "Gray Code",
      "lc": 89,
      "importance": "nice",
      "subtopic": "permutations",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "n",
          "out": "sequence"
        }
      ],
      "approaches": [
        {
          "name": "Gray code",
          "time": "O(2^n)",
          "space": "O(1)",
          "code": "vector<int> grayCode(int n) {\n    vector<int> ans; for(int i=0;i<(1<<n);i++) ans.push_back(i^(i>>1)); return ans;\n}"
        }
      ],
      "description": "Given input per constraints, solve: Gray Code.",
      "summary": "Gray code — state invariant, then loop."
    },
    {
      "id": "bt-25",
      "title": "Factor Combinations",
      "lc": 254,
      "importance": "nice",
      "subtopic": "combinations",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "n",
          "out": "factors"
        }
      ],
      "approaches": [
        {
          "name": "Backtrack factors",
          "time": "O(2^sqrt n)",
          "space": "O(log n)",
          "code": "void dfs(int start,int n,vector<int>& path,vector<vector<int>>& ans){\n    if(n==1 && !path.empty()){ ans.push_back(path); return; }\n    for(int i=start;i*i<=n;i++) if(n%i==0){\n        path.push_back(i); dfs(i,n/i,path,ans); path.pop_back();\n        if(i==1) break;\n    }\n    if(n>=start){ path.push_back(n); ans.push_back(path); path.pop_back(); }\n}\nvector<vector<int>> getFactors(int n){ vector<vector<int>> ans; vector<int> p; dfs(2,n,p,ans); return ans; }"
        }
      ],
      "description": "Given input per constraints, solve: Factor Combinations.",
      "summary": "Backtrack factors — state invariant, then loop."
    },
    {
      "id": "bt-26",
      "title": "Expression Add Operators",
      "lc": 282,
      "importance": "nice",
      "subtopic": "string",
      "difficulty": "Hard",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "num, target",
          "out": "expressions"
        }
      ],
      "approaches": [
        {
          "name": "Backtrack ops",
          "time": "O(4^n)",
          "space": "O(n)",
          "code": "void dfs(string& num,int i,long long cur,long long prev,string& path,vector<string>& ans,int target){\n    if(i==(int)num.size()){ if(cur==target) ans.push_back(path); return; }\n    for(int j=i;j<(int)num.size();j++){\n        if(j>i && num[i]=='0') break;\n        long long v=stoll(num.substr(i,j-i+1));\n        if(i==0){ path=to_string(v); dfs(num,j+1,v,v,path,ans,target); }\n        else{\n            path+='+'; path+=to_string(v); dfs(num,j+1,cur+v,v,path,ans,target); path.pop_back(); path.pop_back(); path.pop_back(); path.pop_back();\n            path+='-'; path+=to_string(v); dfs(num,j+1,cur-v,-v,path,ans,target); path.pop_back(); path.pop_back(); path.pop_back(); path.pop_back();\n            path+='*'; path+=to_string(v); dfs(num,j+1,cur-prev+prev*v,prev*v,path,ans,target); path.pop_back(); path.pop_back(); path.pop_back(); path.pop_back();\n        }\n    }\n}\nvector<string> addOperators(string num,int target){ vector<string> ans,path; dfs(num,0,0,0,path,ans,target); return ans; }"
        }
      ],
      "description": "Given input per constraints, solve: Expression Add Operators.",
      "summary": "Backtrack ops — state invariant, then loop."
    },
    {
      "id": "bt-27",
      "title": "Word Pattern II",
      "lc": 291,
      "importance": "nice",
      "subtopic": "string",
      "difficulty": "Hard",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "pattern, s",
          "out": "match?"
        }
      ],
      "approaches": [
        {
          "name": "Backtrack pattern map",
          "time": "O(n^m)",
          "space": "O(n)",
          "code": "bool match(string& pattern, string& s, int i, int j, unordered_map<char,string>& p2s, unordered_map<string,char>& s2p){\n    if(i==(int)pattern.size()) return j==(int)s.size();\n    char pc=pattern[i];\n    if(p2s.count(pc)){\n        string w=p2s[pc]; if(s.compare(j,w.size())!=0) return false;\n        return match(pattern,s,i+1,j+w.size(),p2s,s2p);\n    }\n    for(int k=j;k<(int)s.size();k++){\n        string w=s.substr(j,k-j+1);\n        if(s2p.count(w)) continue;\n        p2s[pc]=w; s2p[w]=pc;\n        if(match(pattern,s,i+1,k+1,p2s,s2p)) return true;\n        p2s.erase(pc); s2p.erase(w);\n    } return false;\n}\nbool wordPatternMatch(string pattern,string s){ unordered_map<char,string> a; unordered_map<string,char> b; return match(pattern,s,0,0,a,b); }"
        }
      ],
      "description": "Given input per constraints, solve: Word Pattern II.",
      "summary": "Backtrack pattern map — state invariant, then loop."
    },
    {
      "id": "bt-28",
      "title": "Android Unlock Patterns",
      "lc": 351,
      "importance": "nice",
      "subtopic": "grid",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "m,n",
          "out": "count"
        }
      ],
      "approaches": [
        {
          "name": "DFS + jump table",
          "time": "O(9!)",
          "space": "O(1)",
          "code": "int numberOfPatterns(int m, int n) {\n    int jump[10][10]={};\n    jump[1][3]=jump[3][1]=2; jump[1][7]=jump[7][1]=4; jump[3][9]=jump[9][3]=6;\n    jump[7][9]=jump[9][7]=8; jump[1][9]=jump[9][1]=jump[3][7]=jump[7][3]=5;\n    jump[2][8]=jump[8][2]=5; jump[4][6]=jump[6][4]=5;\n    int ans=0;\n    function<void(int,int,int)> dfs=[&](int len,int last,int mask){\n        if(len>=m) ans++;\n        if(len==n) return;\n        for(int d=1;d<=9;d++){\n            int j = last? jump[last][d] : 0;\n            if((!last || (!j || (mask&(1<<j)))) && !(mask&(1<<d)))\n                dfs(len+1,d,mask|(1<<d));\n        }\n    };\n    dfs(0,0,0); return ans;\n}"
        }
      ],
      "description": "Given input per constraints, solve: Android Unlock Patterns.",
      "summary": "DFS + jump table — 2D DP on grid — often row-by-row or with rolling array."
    }
  ]
};
