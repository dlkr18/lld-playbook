window.PRACTICE_TOPIC = {
  "id": "tries",
  "title": "Tries",
  "expected_count": 16,
  "strategy": "<strong>Speed-run:</strong> Prefix tree for autocomplete, word search II, XOR trie. Filter <em>Must do</em> first.",
  "subtopics": [
    {
      "id": "trie",
      "label": "Trie"
    },
    {
      "id": "trie-dfs",
      "label": "Trie + DFS"
    },
    {
      "id": "bit-trie",
      "label": "Bit Trie"
    },
    {
      "id": "trie-dp",
      "label": "Trie + DP"
    }
  ],
  "questions": [
    {
      "id": "try-01",
      "title": "Implement Trie",
      "lc": 208,
      "importance": "must",
      "subtopic": "trie",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "insert/search/prefix",
          "out": "ops"
        }
      ],
      "approaches": [
        {
          "name": "Trie insert/search",
          "time": "O(m)",
          "space": "O(n*m)",
          "code": "class Trie {\n    Trie* ch[26]{}; bool end = false;\npublic:\n    void insert(string w) {\n        Trie* node = this;\n        for (char c : w) { int i = c-'a'; if (!node->ch[i]) node->ch[i] = new Trie(); node = node->ch[i]; }\n        node->end = true;\n    }\n    bool search(string w) { return find(w, true); }\n    bool startsWith(string p) { return find(p, false); }\n    bool find(string& w, bool full) {\n        Trie* node = this;\n        for (char c : w) { int i = c-'a'; if (!node->ch[i]) return false; node = node->ch[i]; }\n        return !full || node->end;\n    }\n};"
        }
      ],
      "description": "Implement Trie — meet required time/space for each operation.",
      "summary": "Walk char edges; mark end — prefix queries in O(L)."
    },
    {
      "id": "try-02",
      "title": "Design Add and Search Words",
      "lc": 211,
      "importance": "must",
      "subtopic": "trie",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "word dict",
          "out": "search ."
        }
      ],
      "approaches": [
        {
          "name": "Trie with dot",
          "time": "O(m)",
          "space": "O(n)",
          "code": "class WordDictionary {\n    struct Node { Node* c[26]{}; bool end=false; } *root=new Node();\n    bool dfs(string& w, int i, Node* node) {\n        if (i==(int)w.size()) return node->end;\n        if (w[i]=='.') { for (auto* ch: node->c) if (ch && dfs(w,i+1,ch)) return true; return false; }\n        int k=w[i]-'a'; return node->c[k] && dfs(w,i+1,node->c[k]);\n    }\npublic:\n    void addWord(string word) { Node* n=root; for (char ch: word){ int k=ch-'a'; if(!n->c[k]) n->c[k]=new Node(); n=n->c[k]; } n->end=true; }\n    bool search(string word) { return dfs(word,0,root); }\n};"
        }
      ],
      "description": "Design Add and Search Words — meet required time/space for each operation.",
      "summary": "Trie with dot — Prefix tree for strings, autocomplete, or bitwise XOR walks."
    },
    {
      "id": "try-03",
      "title": "Word Search II",
      "lc": 212,
      "importance": "must",
      "subtopic": "trie-dfs",
      "difficulty": "Hard",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "board, words",
          "out": "found"
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
      "id": "try-04",
      "title": "Replace Words",
      "lc": 648,
      "importance": "should",
      "subtopic": "trie",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "dict,sentence",
          "out": "replaced"
        }
      ],
      "approaches": [
        {
          "name": "Trie",
          "time": "O(m)",
          "space": "O(n*m)",
          "code": "struct Node { Node* c[26]{}; bool end; };\n// insert/search by walking characters"
        }
      ],
      "description": "Given input per constraints, solve: Replace Words.",
      "summary": "Trie — Prefix tree for strings, autocomplete, or bitwise XOR walks."
    },
    {
      "id": "try-05",
      "title": "Map Sum Pairs",
      "lc": 677,
      "importance": "nice",
      "subtopic": "trie",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "insert/sum",
          "out": "sum"
        }
      ],
      "approaches": [
        {
          "name": "Trie",
          "time": "O(m)",
          "space": "O(n*m)",
          "code": "struct Node { Node* c[26]{}; bool end; };\n// insert/search by walking characters"
        }
      ],
      "description": "Given input per constraints, solve: Map Sum Pairs.",
      "summary": "Trie — Prefix tree for strings, autocomplete, or bitwise XOR walks."
    },
    {
      "id": "try-06",
      "title": "Longest Word in Dictionary",
      "lc": 720,
      "importance": "should",
      "subtopic": "trie",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "words",
          "out": "longest"
        }
      ],
      "approaches": [
        {
          "name": "Trie",
          "time": "O(m)",
          "space": "O(n*m)",
          "code": "struct Node { Node* c[26]{}; bool end; };\n// insert/search by walking characters"
        }
      ],
      "description": "Compute the longest word in dictionary over the given input per constraints.",
      "summary": "Trie — Prefix tree for strings, autocomplete, or bitwise XOR walks."
    },
    {
      "id": "try-07",
      "title": "Search Suggestions System",
      "lc": 1268,
      "importance": "should",
      "subtopic": "trie",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "products,searchWord",
          "out": "suggestions"
        }
      ],
      "approaches": [
        {
          "name": "Trie",
          "time": "O(m)",
          "space": "O(n*m)",
          "code": "struct Node { Node* c[26]{}; bool end; };\n// insert/search by walking characters"
        }
      ],
      "description": "Search Suggestions System — return the required index, count, or boolean.",
      "summary": "Trie — Prefix tree for strings, autocomplete, or bitwise XOR walks."
    },
    {
      "id": "try-08",
      "title": "Maximum XOR of Two Numbers in Array",
      "lc": 421,
      "importance": "should",
      "subtopic": "bit-trie",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums",
          "out": "max xor"
        }
      ],
      "approaches": [
        {
          "name": "Trie bits",
          "time": "O(n*32)",
          "space": "O(n)",
          "code": "class TrieNode { public: TrieNode* c[2]{}; };\nclass Solution {\n    TrieNode* root = new TrieNode();\n    void ins(int x) {\n        TrieNode* u = root;\n        for (int i = 31; i >= 0; i--) {\n            int b = (x >> i) & 1;\n            if (!u->c[b]) u->c[b] = new TrieNode();\n            u = u->c[b];\n        }\n    }\n    int best(int x) {\n        TrieNode* u = root; int ans = 0;\n        for (int i = 31; i >= 0; i--) {\n            int b = (x >> i) & 1, want = 1 - b;\n            if (u->c[want]) { ans |= 1 << i; u = u->c[want]; }\n            else u = u->c[b];\n        }\n        return ans;\n    }\npublic:\n    int findMaximumXOR(vector<int>& nums) {\n        int ans = 0; for (int x : nums) { ins(x); ans = max(ans, best(x)); }\n        return ans;\n    }\n};"
        }
      ],
      "description": "Compute the maximum xor of two numbers in array over the given input per constraints.",
      "summary": "Trie bits — Prefix tree for strings, autocomplete, or bitwise XOR walks."
    },
    {
      "id": "try-09",
      "title": "Concatenated Words",
      "lc": 472,
      "importance": "should",
      "subtopic": "trie-dp",
      "difficulty": "Hard",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "words",
          "out": "concatenated"
        }
      ],
      "approaches": [
        {
          "name": "Trie + DP",
          "time": "O(n*L^2)",
          "space": "O(n)",
          "code": "vector<string> findAllConcatenatedWordsInADict(vector<string>& words) {\n    sort(words.begin(), words.end(), [](string& a, string& b){ return a.size() < b.size(); });\n    unordered_set<string> dict; vector<string> ans;\n    for (string& w : words) {\n        if (w.empty()) continue;\n        int n = w.size(); vector<char> dp(n+1, 0); dp[0] = 1;\n        for (int i = 1; i <= n; i++)\n            for (int j = max(0, i-20); j < i; j++)\n                if (dp[j] && dict.count(w.substr(j, i-j))) { dp[i] = 1; break; }\n        if (dp[n]) ans.push_back(w);\n        dict.insert(w);\n    }\n    return ans;\n}"
        }
      ],
      "description": "Find words formed by concatenating other words in dictionary.",
      "summary": "Trie + DP — state invariant, then loop."
    },
    {
      "id": "try-10",
      "title": "Palindrome Pairs",
      "lc": 336,
      "importance": "nice",
      "subtopic": "trie",
      "difficulty": "Hard",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "words",
          "out": "pairs"
        }
      ],
      "approaches": [
        {
          "name": "Trie",
          "time": "O(m)",
          "space": "O(n*m)",
          "code": "struct Node { Node* c[26]{}; bool end; };\n// insert/search by walking characters"
        }
      ],
      "description": "Given input per constraints, solve: Palindrome Pairs.",
      "summary": "Trie — Prefix tree for strings, autocomplete, or bitwise XOR walks."
    },
    {
      "id": "try-11",
      "title": "Word Break II",
      "lc": 140,
      "importance": "nice",
      "subtopic": "trie-dp",
      "difficulty": "Hard",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "s, dict",
          "out": "sentences"
        }
      ],
      "approaches": [
        {
          "name": "DP + backtrack",
          "time": "O(2^n)",
          "space": "O(n)",
          "code": "void bt(string& s,int i,vector<string>& path,vector<string>& ans,unordered_set<string>& dict,vector<bool>& ok){\n    if(i==(int)s.size()){ ans.push_back(\"\"); for(int j=0;j<(int)path.size();j++) ans.back()+=(j?\" \":\"\")+path[j]; return; }\n    for(int j=i;j<(int)s.size();j++) if(ok[j+1]&&dict.count(s.substr(i,j-i+1))){\n        path.push_back(s.substr(i,j-i+1)); bt(s,j+1,path,ans,dict,ok); path.pop_back();\n    }\n}\nvector<string> wordBreak(string s, vector<string>& wordDict){\n    unordered_set<string> dict(wordDict.begin(),wordDict.end());\n    int n=s.size(); vector<bool> ok(n+1); ok[n]=true;\n    for(int i=n-1;i>=0;i--) for(int j=i;j<n;j++) if(dict.count(s.substr(i,j-i+1))&&ok[j+1]){ ok[i]=true; break; }\n    vector<string> ans,path; if(ok[0]) bt(s,0,path,ans,dict,ok); return ans;\n}"
        }
      ],
      "description": "Given input per constraints, solve: Word Break II.",
      "summary": "DP + backtrack — state invariant, then loop."
    },
    {
      "id": "try-12",
      "title": "Prefix and Suffix Search",
      "lc": 1506,
      "importance": "nice",
      "subtopic": "trie",
      "difficulty": "Hard",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "words",
          "out": "index"
        }
      ],
      "approaches": [
        {
          "name": "Trie",
          "time": "O(m)",
          "space": "O(n*m)",
          "code": "struct Node { Node* c[26]{}; bool end; };\n// insert/search by walking characters"
        }
      ],
      "description": "Given input per constraints, solve: Prefix and Suffix Search.",
      "summary": "Trie — Prefix tree for strings, autocomplete, or bitwise XOR walks."
    },
    {
      "id": "try-13",
      "title": "Design Search Autocomplete System",
      "lc": 642,
      "importance": "nice",
      "subtopic": "trie",
      "difficulty": "Hard",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "sentences",
          "out": "autocomplete"
        }
      ],
      "approaches": [
        {
          "name": "Trie",
          "time": "O(m)",
          "space": "O(n*m)",
          "code": "struct Node { Node* c[26]{}; bool end; };\n// insert/search by walking characters"
        }
      ],
      "description": "Design Search Autocomplete System — meet required time/space for each operation.",
      "summary": "Trie — Prefix tree for strings, autocomplete, or bitwise XOR walks."
    },
    {
      "id": "try-14",
      "title": "Stream of Characters",
      "lc": 1032,
      "importance": "nice",
      "subtopic": "trie",
      "difficulty": "Hard",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "words stream",
          "out": "match"
        }
      ],
      "approaches": [
        {
          "name": "Trie",
          "time": "O(m)",
          "space": "O(n*m)",
          "code": "struct Node { Node* c[26]{}; bool end; };\n// insert/search by walking characters"
        }
      ],
      "description": "Given input per constraints, solve: Stream of Characters.",
      "summary": "Trie — Prefix tree for strings, autocomplete, or bitwise XOR walks."
    },
    {
      "id": "try-15",
      "title": "Index Pairs of a String",
      "lc": 1065,
      "importance": "nice",
      "subtopic": "trie",
      "difficulty": "Easy",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "text, words",
          "out": "pairs"
        }
      ],
      "approaches": [
        {
          "name": "Trie",
          "time": "O(m)",
          "space": "O(n*m)",
          "code": "struct Node { Node* c[26]{}; bool end; };\n// insert/search by walking characters"
        }
      ],
      "description": "Given input per constraints, solve: Index Pairs of a String.",
      "summary": "Trie — Prefix tree for strings, autocomplete, or bitwise XOR walks."
    },
    {
      "id": "try-16",
      "title": "K Divisible Elements Subarrays",
      "lc": 2261,
      "importance": "nice",
      "subtopic": "trie",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums,k,p",
          "out": "count"
        }
      ],
      "approaches": [
        {
          "name": "Trie",
          "time": "O(m)",
          "space": "O(n*m)",
          "code": "struct Node { Node* c[26]{}; bool end; };\n// insert/search by walking characters"
        }
      ],
      "description": "Given input per constraints, solve: K Divisible Elements Subarrays.",
      "summary": "Trie — Prefix tree for strings, autocomplete, or bitwise XOR walks."
    }
  ]
};
