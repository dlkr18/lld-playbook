window.PRACTICE_TOPIC = {
  "id": "strings",
  "title": "String Algorithms",
  "expected_count": 22,
  "strategy": "<strong>Speed-run:</strong> Sliding window, KMP, palindrome expand, edit distance. Filter <em>Must do</em> first.",
  "subtopics": [
    {
      "id": "expand",
      "label": "Expand"
    },
    {
      "id": "window",
      "label": "Window"
    },
    {
      "id": "kmp",
      "label": "KMP"
    },
    {
      "id": "dp",
      "label": "DP"
    },
    {
      "id": "backtrack",
      "label": "Backtrack"
    }
  ],
  "questions": [
    {
      "id": "sr-01",
      "title": "Longest Palindromic Substring",
      "lc": 5,
      "importance": "must",
      "subtopic": "expand",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "s",
          "out": "substring"
        }
      ],
      "approaches": [
        {
          "name": "Expand center",
          "time": "O(n^2)",
          "space": "O(1)",
          "code": "string longestPalindrome(string s) {\n    int bestL=0, bestLen=0;\n    auto expand = [&](int l,int r){\n        while (l>=0 && r<(int)s.size() && s[l]==s[r]) { l--; r++; }\n        if (r-l-1 > bestLen) { bestLen=r-l-1; bestL=l+1; }\n    };\n    for (int i=0;i<(int)s.size();i++) { expand(i,i); expand(i,i+1); }\n    return s.substr(bestL, bestLen);\n}"
        }
      ],
      "description": "Compute the longest palindromic substring over the given input per constraints.",
      "summary": "For each center, expand while palindrome — covers odd/even lengths."
    },
    {
      "id": "sr-02",
      "title": "Valid Palindrome",
      "lc": 125,
      "importance": "should",
      "subtopic": "two-ptr",
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
          "name": "Two pointers",
          "time": "O(n)",
          "space": "O(1)",
          "code": "bool isPalindrome(string s) {\n    int l=0, r=(int)s.size()-1;\n    while (l < r) {\n        while (l<r && !isalnum(s[l])) l++;\n        while (l<r && !isalnum(s[r])) r--;\n        if (tolower(s[l]) != tolower(s[r])) return false;\n        l++; r--;\n    } return true;\n}"
        }
      ],
      "description": "Given input per constraints, solve: Valid Palindrome.",
      "summary": "Opposite ends or same direction — move based on comparison/invariant."
    },
    {
      "id": "sr-03",
      "title": "Longest Common Prefix",
      "lc": 14,
      "importance": "should",
      "subtopic": "scan",
      "difficulty": "Easy",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "strs",
          "out": "prefix"
        }
      ],
      "approaches": [
        {
          "name": "Vertical scan",
          "time": "O(S)",
          "space": "O(1)",
          "code": "string longestCommonPrefix(vector<string>& strs) {\n    if (strs.empty()) return \"\";\n    for (int i = 0; ; i++) {\n        for (string& s : strs) {\n            if (i == (int)s.size() || (i && s[i] != strs[0][i])) return strs[0].substr(0, i);\n        }\n    }\n}"
        }
      ],
      "description": "Longest common prefix among array of strings.",
      "summary": "Vertical scan — state invariant, then loop."
    },
    {
      "id": "sr-04",
      "title": "Valid Anagram",
      "lc": 242,
      "importance": "must",
      "subtopic": "count",
      "difficulty": "Easy",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "s,t",
          "out": "anagram?"
        }
      ],
      "approaches": [
        {
          "name": "Freq array",
          "time": "O(n)",
          "space": "O(1)",
          "code": "bool isAnagram(string s, string t) {\n    if (s.size() != t.size()) return false;\n    int c[26] = {};\n    for (char ch : s) c[ch-'a']++;\n    for (char ch : t) if (--c[ch-'a'] < 0) return false;\n    return true;\n}"
        }
      ],
      "description": "Given input per constraints, solve: Valid Anagram.",
      "summary": "Freq array — state invariant, then loop."
    },
    {
      "id": "sr-05",
      "title": "Group Anagrams",
      "lc": 49,
      "importance": "must",
      "subtopic": "hash",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "strs",
          "out": "groups"
        }
      ],
      "approaches": [
        {
          "name": "Sort/freq key grouping",
          "time": "O(nk log k)",
          "space": "O(nk)",
          "code": "vector<vector<string>> groupAnagrams(vector<string>& strs) {\n    unordered_map<string, vector<string>> mp;\n    for (string& s : strs) {\n        string k = s; sort(k.begin(), k.end());\n        mp[k].push_back(s);\n    }\n    vector<vector<string>> ans;\n    for (auto& p : mp) ans.push_back(p.second);\n    return ans;\n}"
        }
      ],
      "description": "Group strings that are anagrams of each other.",
      "summary": "Sort/freq key grouping — Hash map for O(1) lookup while scanning — complements, counts, or indices."
    },
    {
      "id": "sr-06",
      "title": "Minimum Window Substring",
      "lc": 76,
      "importance": "must",
      "subtopic": "window",
      "difficulty": "Hard",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "s,t",
          "out": "window"
        }
      ],
      "approaches": [
        {
          "name": "Variable window",
          "time": "O(n)",
          "space": "O(1)",
          "code": "string minWindow(string s, string t) {\n    vector<int> need(128), have(128);\n    for (char c : t) need[c]++;\n    int req = (int)t.size(), formed = 0, bestL = 0, bestLen = INT_MAX;\n    for (int l = 0, r = 0; r < (int)s.size(); r++) {\n        if (++have[s[r]] <= need[s[r]]) formed++;\n        while (formed == req) {\n            if (r-l+1 < bestLen) { bestLen = r-l+1; bestL = l; }\n            if (--have[s[l]] < need[s[l]]) formed--;\n            l++;\n        }\n    } return bestLen == INT_MAX ? \"\" : s.substr(bestL, bestLen);\n}"
        }
      ],
      "description": "Smallest substring of s containing all characters of t.",
      "summary": "Expand r; while window invalid, shrink l — O(n) because each index enters/exits once."
    },
    {
      "id": "sr-07",
      "title": "Find Index of First Occurrence",
      "lc": 28,
      "importance": "should",
      "subtopic": "kmp",
      "difficulty": "Easy",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "hay,needle",
          "out": "index"
        }
      ],
      "approaches": [
        {
          "name": "KMP / brute",
          "time": "O(n+m)",
          "space": "O(m)",
          "code": "int strStr(string haystack, string needle) {\n    if (needle.empty()) return 0;\n    int n = haystack.size(), m = needle.size();\n    vector<int> lps(m, 0);\n    for (int i = 1, len = 0; i < m; ) {\n        if (needle[i] == needle[len]) lps[i++] = ++len;\n        else if (len) len = lps[len - 1];\n        else lps[i++] = 0;\n    }\n    for (int i = 0, j = 0; i < n; ) {\n        if (haystack[i] == needle[j]) { i++; j++; if (j == m) return i - m; }\n        else if (j) j = lps[j - 1];\n        else i++;\n    }\n    return -1;\n}"
        }
      ],
      "description": "Find Index of First Occurrence — return the required index, count, or boolean.",
      "summary": "KMP / brute — state invariant, then loop."
    },
    {
      "id": "sr-08",
      "title": "Repeated Substring Pattern",
      "lc": 459,
      "importance": "nice",
      "subtopic": "kmp",
      "difficulty": "Easy",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "s",
          "out": "repeat?"
        }
      ],
      "approaches": [
        {
          "name": "KMP prefix",
          "time": "O(n)",
          "space": "O(n)",
          "code": "bool repeatedSubstringPattern(string s) {\n    int n=s.size(); vector<int> lps(n);\n    for(int i=1,len=0;i<n;){\n        if(s[i]==s[len]) lps[i++]=++len;\n        else if(len) len=lps[len-1]; else lps[i++]=0;\n    } int len=lps[n-1]; return len>0 && n%(n-len)==0;\n}"
        }
      ],
      "description": "Given input per constraints, solve: Repeated Substring Pattern.",
      "summary": "KMP prefix — state invariant, then loop."
    },
    {
      "id": "sr-09",
      "title": "Implement strStr()",
      "lc": 28,
      "importance": "should",
      "subtopic": "kmp",
      "difficulty": "Easy",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "hay,needle",
          "out": "index"
        }
      ],
      "approaches": [
        {
          "name": "KMP / brute",
          "time": "O(n+m)",
          "space": "O(m)",
          "code": "int strStr(string haystack, string needle) {\n    if (needle.empty()) return 0;\n    int n = haystack.size(), m = needle.size();\n    vector<int> lps(m, 0);\n    for (int i = 1, len = 0; i < m; ) {\n        if (needle[i] == needle[len]) lps[i++] = ++len;\n        else if (len) len = lps[len - 1];\n        else lps[i++] = 0;\n    }\n    for (int i = 0, j = 0; i < n; ) {\n        if (haystack[i] == needle[j]) { i++; j++; if (j == m) return i - m; }\n        else if (j) j = lps[j - 1];\n        else i++;\n    }\n    return -1;\n}"
        }
      ],
      "description": "Implement strStr() — meet required time/space for each operation.",
      "summary": "KMP / brute — state invariant, then loop."
    },
    {
      "id": "sr-10",
      "title": "Zigzag Conversion",
      "lc": 6,
      "importance": "nice",
      "subtopic": "simulation",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "s,rows",
          "out": "zigzag"
        }
      ],
      "approaches": [
        {
          "name": "Simulate rows",
          "time": "O(n)",
          "space": "O(n)",
          "code": "string convert(string s, int numRows) {\n    if(numRows==1) return s;\n    vector<string> rows(numRows); int r=0, dir=-1;\n    for(char c: s){ rows[r]+=c; if(r==0||r==numRows-1) dir*=-1; r+=dir; }\n    string ans; for(auto& row: rows) ans+=row; return ans;\n}"
        }
      ],
      "description": "Given input per constraints, solve: Zigzag Conversion.",
      "summary": "Simulate rows — state invariant, then loop."
    },
    {
      "id": "sr-11",
      "title": "Integer to Roman",
      "lc": 12,
      "importance": "nice",
      "subtopic": "mapping",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "num",
          "out": "roman"
        }
      ],
      "approaches": [
        {
          "name": "Greedy subtract",
          "time": "O(1)",
          "space": "O(1)",
          "code": "string intToRoman(int num) {\n    vector<pair<int,string>> v={{1000,\"M\"},{900,\"CM\"},{500,\"D\"},{400,\"CD\"},{100,\"C\"},{90,\"XC\"},{50,\"L\"},{40,\"XL\"},{10,\"X\"},{9,\"IX\"},{5,\"V\"},{4,\"IV\"},{1,\"I\"}};\n    string ans; for(auto& [val,sym]: v) while(num>=val){ ans+=sym; num-=val; } return ans;\n}"
        }
      ],
      "description": "Given input per constraints, solve: Integer to Roman.",
      "summary": "Greedy subtract — state invariant, then loop."
    },
    {
      "id": "sr-12",
      "title": "Roman to Integer",
      "lc": 13,
      "importance": "should",
      "subtopic": "scan",
      "difficulty": "Easy",
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
          "name": "Left-to-right",
          "time": "O(n)",
          "space": "O(1)",
          "code": "int romanToInt(string s) {\n    unordered_map<char,int> m{{'I',1},{'V',5},{'X',10},{'L',50},{'C',100},{'D',500},{'M',1000}};\n    int ans = 0;\n    for (int i = 0; i < (int)s.size(); i++) {\n        if (i + 1 < (int)s.size() && m[s[i]] < m[s[i+1]]) ans -= m[s[i]];\n        else ans += m[s[i]];\n    }\n    return ans;\n}"
        }
      ],
      "description": "Convert Roman numeral string to integer.",
      "summary": "Left-to-right — state invariant, then loop."
    },
    {
      "id": "sr-13",
      "title": "Letter Combinations of Phone Number",
      "lc": 17,
      "importance": "should",
      "subtopic": "backtrack",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "digits",
          "out": "combos"
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
      "id": "sr-14",
      "title": "Generate Parentheses",
      "lc": 22,
      "importance": "should",
      "subtopic": "backtrack",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "n",
          "out": "strings"
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
      "id": "sr-15",
      "title": "Decode String",
      "lc": 394,
      "importance": "should",
      "subtopic": "stack",
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
      "id": "sr-16",
      "title": "String to Integer (atoi)",
      "lc": 8,
      "importance": "nice",
      "subtopic": "scan",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "s",
          "out": "int"
        }
      ],
      "approaches": [
        {
          "name": "Scan atoi",
          "time": "O(n)",
          "space": "O(1)",
          "code": "int myAtoi(string s) {\n    int i=0,n=s.size(), sign=1; long long ans=0;\n    while(i<n && isspace(s[i])) i++;\n    if(i<n && (s[i]=='+'||s[i]=='-')) sign = s[i++]=='-'? -1: 1;\n    while(i<n && isdigit(s[i])){\n        ans=ans*10+(s[i++]-'0');\n        if(sign*ans>INT_MAX) return INT_MAX;\n        if(sign*ans<INT_MIN) return INT_MIN;\n    } return (int)(sign*ans);\n}"
        }
      ],
      "description": "Given input per constraints, solve: String to Integer (atoi).",
      "summary": "Scan atoi — state invariant, then loop."
    },
    {
      "id": "sr-17",
      "title": "Longest Palindromic Subsequence",
      "lc": 516,
      "importance": "should",
      "subtopic": "dp",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "s",
          "out": "length"
        }
      ],
      "approaches": [
        {
          "name": "Interval DP",
          "time": "O(n^2)",
          "space": "O(n^2)",
          "code": "int longestPalindromeSubseq(string s) {\n    int n = s.size(); vector<vector<int>> dp(n, vector<int>(n, 0));\n    for (int i = 0; i < n; i++) dp[i][i] = 1;\n    for (int len = 2; len <= n; len++)\n        for (int l = 0; l + len - 1 < n; l++) {\n            int r = l + len - 1;\n            if (s[l] == s[r]) dp[l][r] = dp[l+1][r-1] + 2;\n            else dp[l][r] = max(dp[l+1][r], dp[l][r-1]);\n        }\n    return dp[0][n-1];\n}"
        }
      ],
      "description": "Length of longest palindromic subsequence.",
      "summary": "dp[l][r] over subintervals — try split k, combine subproblems."
    },
    {
      "id": "sr-18",
      "title": "Palindromic Substrings",
      "lc": 647,
      "importance": "should",
      "subtopic": "expand",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "s",
          "out": "count"
        }
      ],
      "approaches": [
        {
          "name": "Expand center",
          "time": "O(n^2)",
          "space": "O(1)",
          "code": "int countSubstrings(string s) {\n    int n = s.size(), ans = 0;\n    auto expand = [&](int l, int r) {\n        while (l >= 0 && r < n && s[l] == s[r]) { ans++; l--; r++; }\n    };\n    for (int i = 0; i < n; i++) { expand(i,i); expand(i,i+1); }\n    return ans;\n}"
        }
      ],
      "description": "Count palindromic substrings in string.",
      "summary": "For each center, expand while palindrome — covers odd/even lengths."
    },
    {
      "id": "sr-19",
      "title": "Word Break",
      "lc": 139,
      "importance": "must",
      "subtopic": "dp",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "s,dict",
          "out": "possible?"
        }
      ],
      "approaches": [
        {
          "name": "Word break DP",
          "time": "O(n^2)",
          "space": "O(n)",
          "code": "bool wordBreak(string s, vector<string>& wordDict) {\n    unordered_set<string> dict(wordDict.begin(), wordDict.end());\n    int n=s.size(); vector<bool> dp(n+1); dp[0]=true;\n    for (int i=1;i<=n;i++) for (int j=0;j<i;j++)\n        if (dp[j] && dict.count(s.substr(j,i-j))) { dp[i]=true; break; }\n    return dp[n];\n}"
        }
      ],
      "description": "Return true if string can be segmented into dictionary words.",
      "summary": "Word break DP — state invariant, then loop."
    },
    {
      "id": "sr-20",
      "title": "Word Break II",
      "lc": 140,
      "importance": "nice",
      "subtopic": "backtrack",
      "difficulty": "Hard",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "s,dict",
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
      "id": "sr-21",
      "title": "Edit Distance",
      "lc": 72,
      "importance": "must",
      "subtopic": "dp",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "word1,word2",
          "out": "distance"
        }
      ],
      "approaches": [
        {
          "name": "Edit distance",
          "time": "O(mn)",
          "space": "O(n)",
          "code": "int minDistance(string a, string b) {\n    int m=a.size(), n=b.size(); vector<int> prev(n+1), cur(n+1);\n    iota(prev.begin(), prev.end(), 0);\n    for (int i=1;i<=m;i++) {\n        cur[0]=i;\n        for (int j=1;j<=n;j++)\n            cur[j]= a[i-1]==b[j-1]? prev[j-1] : 1+min({prev[j],cur[j-1],prev[j-1]});\n        prev.swap(cur);\n    } return prev[n];\n}"
        }
      ],
      "description": "Minimum operations (insert/delete/replace) to convert word1 to word2.",
      "summary": "Edit distance — state invariant, then loop."
    },
    {
      "id": "sr-22",
      "title": "Distinct Subsequences",
      "lc": 115,
      "importance": "nice",
      "subtopic": "dp",
      "difficulty": "Hard",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "s,t",
          "out": "count"
        }
      ],
      "approaches": [
        {
          "name": "DP count",
          "time": "O(mn)",
          "space": "O(n)",
          "code": "int numDistinct(string s, string t) {\n    int m=s.size(), n=t.size(); vector<unsigned long long> dp(n+1); dp[0]=1;\n    for(int i=1;i<=m;i++) for(int j=n;j>=1;j--)\n        if(s[i-1]==t[j-1]) dp[j]+=dp[j-1];\n    return (int)dp[n];\n}"
        }
      ],
      "description": "Given input per constraints, solve: Distinct Subsequences.",
      "summary": "DP count — state invariant, then loop."
    }
  ]
};
