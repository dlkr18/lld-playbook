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
      "description": "Given a string `s`, return the longest palindromic substring in `s`.\n\n \n\nExample 1:\n\nInput: s = \"babad\"\nOutput: \"bab\"\nExplanation: \"aba\" is also a valid answer.\n\nExample 2:\n\nInput: s = \"cbbd\"\nOutput: \"bb\"\n\n \n\nConstraints:\n\n\t• `1",
      "descriptionHtml": "<p>Given a string <code>s</code>, return <em>the longest</em> <span data-keyword=\"palindromic-string\"><em>palindromic</em></span> <span data-keyword=\"substring-nonempty\"><em>substring</em></span> in <code>s</code>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> s = &quot;babad&quot;\n<strong>Output:</strong> &quot;bab&quot;\n<strong>Explanation:</strong> &quot;aba&quot; is also a valid answer.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> s = &quot;cbbd&quot;\n<strong>Output:</strong> &quot;bb&quot;\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= s.length &lt;= 1000</code></li>\n\t<li><code>s</code> consist of only digits and English letters.</li>\n</ul>\n",
      "lcSlug": "longest-palindromic-substring",
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
      "description": "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.\n\nGiven a string `s`, return `true` if it is a palindrome, or `false` otherwise.\n\n \n\nExample 1:\n\nInput: s = \"A man, a plan, a canal: Panama\"\nOutput: true\nExplanation: \"amanaplanacanalpanama\" is a palindrome.\n\nExample 2:\n\nInput: s = \"race a car\"\nOutput: false\nExplanation: \"raceacar\" is not a palindrome.\n\nExample 3:\n\nInput: s = \" \"\nOutput: true\nExplanation: s is an empty string \"\" after removing non-alphanumeric characters.\nSince an empty string reads the same forward and backward, it is a palindrome.\n\n \n\nConstraints:\n\n\t• `1 5`\n• `s` consists only of printable ASCII characters.",
      "descriptionHtml": "<p>A phrase is a <strong>palindrome</strong> if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.</p>\n\n<p>Given a string <code>s</code>, return <code>true</code><em> if it is a <strong>palindrome</strong>, or </em><code>false</code><em> otherwise</em>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> s = &quot;A man, a plan, a canal: Panama&quot;\n<strong>Output:</strong> true\n<strong>Explanation:</strong> &quot;amanaplanacanalpanama&quot; is a palindrome.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> s = &quot;race a car&quot;\n<strong>Output:</strong> false\n<strong>Explanation:</strong> &quot;raceacar&quot; is not a palindrome.\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> s = &quot; &quot;\n<strong>Output:</strong> true\n<strong>Explanation:</strong> s is an empty string &quot;&quot; after removing non-alphanumeric characters.\nSince an empty string reads the same forward and backward, it is a palindrome.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= s.length &lt;= 2 * 10<sup>5</sup></code></li>\n\t<li><code>s</code> consists only of printable ASCII characters.</li>\n</ul>\n",
      "lcSlug": "valid-palindrome",
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
      "description": "Write a function to find the longest common prefix string amongst an array of strings.\n\nIf there is no common prefix, return an empty string `\"\"`.\n\n \n\nExample 1:\n\nInput: strs = [\"flower\",\"flow\",\"flight\"]\nOutput: \"fl\"\n\nExample 2:\n\nInput: strs = [\"dog\",\"racecar\",\"car\"]\nOutput: \"\"\nExplanation: There is no common prefix among the input strings.\n\n \n\nConstraints:\n\n\t• `1",
      "descriptionHtml": "<p>Write a function to find the longest common prefix string amongst an array of strings.</p>\n\n<p>If there is no common prefix, return an empty string <code>&quot;&quot;</code>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> strs = [&quot;flower&quot;,&quot;flow&quot;,&quot;flight&quot;]\n<strong>Output:</strong> &quot;fl&quot;\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> strs = [&quot;dog&quot;,&quot;racecar&quot;,&quot;car&quot;]\n<strong>Output:</strong> &quot;&quot;\n<strong>Explanation:</strong> There is no common prefix among the input strings.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= strs.length &lt;= 200</code></li>\n\t<li><code>0 &lt;= strs[i].length &lt;= 200</code></li>\n\t<li><code>strs[i]</code> consists of only lowercase English letters if it is non-empty.</li>\n</ul>\n",
      "lcSlug": "longest-common-prefix",
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
      "description": "Given two strings `s` and `t`, return `true` if `t` is an anagram of `s`, and `false` otherwise.\n\n \n\nExample 1:\n\nInput: s = \"anagram\", t = \"nagaram\"\n\nOutput: true\n\nExample 2:\n\nInput: s = \"rat\", t = \"car\"\n\nOutput: false\n\n \n\nConstraints:\n\n\t• `1 4`\n• `s` and `t` consist of lowercase English letters.\n\n \n\nFollow up: What if the inputs contain Unicode characters? How would you adapt your solution to such a case?",
      "descriptionHtml": "<p>Given two strings <code>s</code> and <code>t</code>, return <code>true</code> if <code>t</code> is an <span data-keyword=\"anagram\">anagram</span> of <code>s</code>, and <code>false</code> otherwise.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<div class=\"example-block\">\n<p><strong>Input:</strong> <span class=\"example-io\">s = &quot;anagram&quot;, t = &quot;nagaram&quot;</span></p>\n\n<p><strong>Output:</strong> <span class=\"example-io\">true</span></p>\n</div>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<div class=\"example-block\">\n<p><strong>Input:</strong> <span class=\"example-io\">s = &quot;rat&quot;, t = &quot;car&quot;</span></p>\n\n<p><strong>Output:</strong> <span class=\"example-io\">false</span></p>\n</div>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= s.length, t.length &lt;= 5 * 10<sup>4</sup></code></li>\n\t<li><code>s</code> and <code>t</code> consist of lowercase English letters.</li>\n</ul>\n\n<p>&nbsp;</p>\n<p><strong>Follow up:</strong> What if the inputs contain Unicode characters? How would you adapt your solution to such a case?</p>\n",
      "lcSlug": "valid-anagram",
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
      "description": "Given an array of strings `strs`, group the anagrams together. You can return the answer in any order.\n\n \n\nExample 1:\n\nInput: strs = [\"eat\",\"tea\",\"tan\",\"ate\",\"nat\",\"bat\"]\n\nOutput: [[\"bat\"],[\"nat\",\"tan\"],[\"ate\",\"eat\",\"tea\"]]\n\nExplanation:\n\n\t• There is no string in strs that can be rearranged to form `\"bat\"`.\n• The strings `\"nat\"` and `\"tan\"` are anagrams as they can be rearranged to form each other.\n• The strings `\"ate\"`, `\"eat\"`, and `\"tea\"` are anagrams as they can be rearranged to form each other.\n\nExample 2:\n\nInput: strs = [\"\"]\n\nOutput: [[\"\"]]\n\nExample 3:\n\nInput: strs = [\"a\"]\n\nOutput: [[\"a\"]]\n\n \n\nConstraints:\n\n\t• `1 4`\n• `0",
      "descriptionHtml": "<p>Given an array of strings <code>strs</code>, group the <span data-keyword=\"anagram\">anagrams</span> together. You can return the answer in <strong>any order</strong>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<div class=\"example-block\">\n<p><strong>Input:</strong> <span class=\"example-io\">strs = [&quot;eat&quot;,&quot;tea&quot;,&quot;tan&quot;,&quot;ate&quot;,&quot;nat&quot;,&quot;bat&quot;]</span></p>\n\n<p><strong>Output:</strong> <span class=\"example-io\">[[&quot;bat&quot;],[&quot;nat&quot;,&quot;tan&quot;],[&quot;ate&quot;,&quot;eat&quot;,&quot;tea&quot;]]</span></p>\n\n<p><strong>Explanation:</strong></p>\n\n<ul>\n\t<li>There is no string in strs that can be rearranged to form <code>&quot;bat&quot;</code>.</li>\n\t<li>The strings <code>&quot;nat&quot;</code> and <code>&quot;tan&quot;</code> are anagrams as they can be rearranged to form each other.</li>\n\t<li>The strings <code>&quot;ate&quot;</code>, <code>&quot;eat&quot;</code>, and <code>&quot;tea&quot;</code> are anagrams as they can be rearranged to form each other.</li>\n</ul>\n</div>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<div class=\"example-block\">\n<p><strong>Input:</strong> <span class=\"example-io\">strs = [&quot;&quot;]</span></p>\n\n<p><strong>Output:</strong> <span class=\"example-io\">[[&quot;&quot;]]</span></p>\n</div>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<div class=\"example-block\">\n<p><strong>Input:</strong> <span class=\"example-io\">strs = [&quot;a&quot;]</span></p>\n\n<p><strong>Output:</strong> <span class=\"example-io\">[[&quot;a&quot;]]</span></p>\n</div>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= strs.length &lt;= 10<sup>4</sup></code></li>\n\t<li><code>0 &lt;= strs[i].length &lt;= 100</code></li>\n\t<li><code>strs[i]</code> consists of lowercase English letters.</li>\n</ul>\n",
      "lcSlug": "group-anagrams",
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
      "description": "Given two strings `s` and `t` of lengths `m` and `n` respectively, return the minimum window substring of `s` such that every character in `t` (including duplicates) is included in the window. If there is no such substring, return the empty string `\"\"`.\n\nThe testcases will be generated such that the answer is unique.\n\n \n\nExample 1:\n\nInput: s = \"ADOBECODEBANC\", t = \"ABC\"\nOutput: \"BANC\"\nExplanation: The minimum window substring \"BANC\" includes 'A', 'B', and 'C' from string t.\n\nExample 2:\n\nInput: s = \"a\", t = \"a\"\nOutput: \"a\"\nExplanation: The entire string s is the minimum window.\n\nExample 3:\n\nInput: s = \"a\", t = \"aa\"\nOutput: \"\"\nExplanation: Both 'a's from t must be included in the window.\nSince the largest window of s only has one 'a', return empty string.\n\n \n\nConstraints:\n\n\t• `m == s.length`\n• `n == t.length`\n• `1 5`\n• `s` and `t` consist of uppercase and lowercase English letters.\n\n \n\nFollow up: Could you find an algorithm that runs in `O(m + n)` time?",
      "descriptionHtml": "<p>Given two strings <code>s</code> and <code>t</code> of lengths <code>m</code> and <code>n</code> respectively, return <em>the <strong>minimum window</strong></em> <span data-keyword=\"substring-nonempty\"><strong><em>substring</em></strong></span><em> of </em><code>s</code><em> such that every character in </em><code>t</code><em> (<strong>including duplicates</strong>) is included in the window</em>. If there is no such substring, return <em>the empty string </em><code>&quot;&quot;</code>.</p>\n\n<p>The testcases will be generated such that the answer is <strong>unique</strong>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> s = &quot;ADOBECODEBANC&quot;, t = &quot;ABC&quot;\n<strong>Output:</strong> &quot;BANC&quot;\n<strong>Explanation:</strong> The minimum window substring &quot;BANC&quot; includes &#39;A&#39;, &#39;B&#39;, and &#39;C&#39; from string t.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> s = &quot;a&quot;, t = &quot;a&quot;\n<strong>Output:</strong> &quot;a&quot;\n<strong>Explanation:</strong> The entire string s is the minimum window.\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> s = &quot;a&quot;, t = &quot;aa&quot;\n<strong>Output:</strong> &quot;&quot;\n<strong>Explanation:</strong> Both &#39;a&#39;s from t must be included in the window.\nSince the largest window of s only has one &#39;a&#39;, return empty string.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>m == s.length</code></li>\n\t<li><code>n == t.length</code></li>\n\t<li><code>1 &lt;= m, n &lt;= 10<sup>5</sup></code></li>\n\t<li><code>s</code> and <code>t</code> consist of uppercase and lowercase English letters.</li>\n</ul>\n\n<p>&nbsp;</p>\n<p><strong>Follow up:</strong> Could you find an algorithm that runs in <code>O(m + n)</code> time?</p>\n",
      "lcSlug": "minimum-window-substring",
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
      "description": "Given two strings `needle` and `haystack`, return the index of the first occurrence of `needle` in `haystack`, or `-1` if `needle` is not part of `haystack`.\n\n \n\nExample 1:\n\nInput: haystack = \"sadbutsad\", needle = \"sad\"\nOutput: 0\nExplanation: \"sad\" occurs at index 0 and 6.\nThe first occurrence is at index 0, so we return 0.\n\nExample 2:\n\nInput: haystack = \"leetcode\", needle = \"leeto\"\nOutput: -1\nExplanation: \"leeto\" did not occur in \"leetcode\", so we return -1.\n\n \n\nConstraints:\n\n\t• `1 4`\n• `haystack` and `needle` consist of only lowercase English characters.",
      "descriptionHtml": "<p>Given two strings <code>needle</code> and <code>haystack</code>, return the index of the first occurrence of <code>needle</code> in <code>haystack</code>, or <code>-1</code> if <code>needle</code> is not part of <code>haystack</code>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> haystack = &quot;sadbutsad&quot;, needle = &quot;sad&quot;\n<strong>Output:</strong> 0\n<strong>Explanation:</strong> &quot;sad&quot; occurs at index 0 and 6.\nThe first occurrence is at index 0, so we return 0.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> haystack = &quot;leetcode&quot;, needle = &quot;leeto&quot;\n<strong>Output:</strong> -1\n<strong>Explanation:</strong> &quot;leeto&quot; did not occur in &quot;leetcode&quot;, so we return -1.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= haystack.length, needle.length &lt;= 10<sup>4</sup></code></li>\n\t<li><code>haystack</code> and <code>needle</code> consist of only lowercase English characters.</li>\n</ul>\n",
      "lcSlug": "find-the-index-of-the-first-occurrence-in-a-string",
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
      "description": "Given a string `s`, check if it can be constructed by taking a substring of it and appending multiple copies of the substring together.\n\n \n\nExample 1:\n\nInput: s = \"abab\"\nOutput: true\nExplanation: It is the substring \"ab\" twice.\n\nExample 2:\n\nInput: s = \"aba\"\nOutput: false\n\nExample 3:\n\nInput: s = \"abcabcabcabc\"\nOutput: true\nExplanation: It is the substring \"abc\" four times or the substring \"abcabc\" twice.\n\n \n\nConstraints:\n\n\t• `1 4`\n• `s` consists of lowercase English letters.",
      "descriptionHtml": "<p>Given a string <code>s</code>, check if it can be constructed by taking a substring of it and appending multiple copies of the substring together.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> s = &quot;abab&quot;\n<strong>Output:</strong> true\n<strong>Explanation:</strong> It is the substring &quot;ab&quot; twice.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> s = &quot;aba&quot;\n<strong>Output:</strong> false\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> s = &quot;abcabcabcabc&quot;\n<strong>Output:</strong> true\n<strong>Explanation:</strong> It is the substring &quot;abc&quot; four times or the substring &quot;abcabc&quot; twice.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= s.length &lt;= 10<sup>4</sup></code></li>\n\t<li><code>s</code> consists of lowercase English letters.</li>\n</ul>\n",
      "lcSlug": "repeated-substring-pattern",
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
      "description": "Given two strings `needle` and `haystack`, return the index of the first occurrence of `needle` in `haystack`, or `-1` if `needle` is not part of `haystack`.\n\n \n\nExample 1:\n\nInput: haystack = \"sadbutsad\", needle = \"sad\"\nOutput: 0\nExplanation: \"sad\" occurs at index 0 and 6.\nThe first occurrence is at index 0, so we return 0.\n\nExample 2:\n\nInput: haystack = \"leetcode\", needle = \"leeto\"\nOutput: -1\nExplanation: \"leeto\" did not occur in \"leetcode\", so we return -1.\n\n \n\nConstraints:\n\n\t• `1 4`\n• `haystack` and `needle` consist of only lowercase English characters.",
      "descriptionHtml": "<p>Given two strings <code>needle</code> and <code>haystack</code>, return the index of the first occurrence of <code>needle</code> in <code>haystack</code>, or <code>-1</code> if <code>needle</code> is not part of <code>haystack</code>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> haystack = &quot;sadbutsad&quot;, needle = &quot;sad&quot;\n<strong>Output:</strong> 0\n<strong>Explanation:</strong> &quot;sad&quot; occurs at index 0 and 6.\nThe first occurrence is at index 0, so we return 0.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> haystack = &quot;leetcode&quot;, needle = &quot;leeto&quot;\n<strong>Output:</strong> -1\n<strong>Explanation:</strong> &quot;leeto&quot; did not occur in &quot;leetcode&quot;, so we return -1.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= haystack.length, needle.length &lt;= 10<sup>4</sup></code></li>\n\t<li><code>haystack</code> and <code>needle</code> consist of only lowercase English characters.</li>\n</ul>\n",
      "lcSlug": "find-the-index-of-the-first-occurrence-in-a-string",
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
      "description": "The string `\"PAYPALISHIRING\"` is written in a zigzag pattern on a given number of rows like this: (you may want to display this pattern in a fixed font for better legibility)\n\nP   A   H   N\nA P L S I I G\nY   I   R\n\nAnd then read line by line: `\"PAHNAPLSIIGYIR\"`\n\nWrite the code that will take a string and make this conversion given a number of rows:\n\nstring convert(string s, int numRows);\n\n \n\nExample 1:\n\nInput: s = \"PAYPALISHIRING\", numRows = 3\nOutput: \"PAHNAPLSIIGYIR\"\n\nExample 2:\n\nInput: s = \"PAYPALISHIRING\", numRows = 4\nOutput: \"PINALSIGYAHRPI\"\nExplanation:\nP     I    N\nA   L S  I G\nY A   H R\nP     I\n\nExample 3:\n\nInput: s = \"A\", numRows = 1\nOutput: \"A\"\n\n \n\nConstraints:\n\n\t• `1",
      "descriptionHtml": "<p>The string <code>&quot;PAYPALISHIRING&quot;</code> is written in a zigzag pattern on a given number of rows like this: (you may want to display this pattern in a fixed font for better legibility)</p>\n\n<pre>\nP   A   H   N\nA P L S I I G\nY   I   R\n</pre>\n\n<p>And then read line by line: <code>&quot;PAHNAPLSIIGYIR&quot;</code></p>\n\n<p>Write the code that will take a string and make this conversion given a number of rows:</p>\n\n<pre>\nstring convert(string s, int numRows);\n</pre>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> s = &quot;PAYPALISHIRING&quot;, numRows = 3\n<strong>Output:</strong> &quot;PAHNAPLSIIGYIR&quot;\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> s = &quot;PAYPALISHIRING&quot;, numRows = 4\n<strong>Output:</strong> &quot;PINALSIGYAHRPI&quot;\n<strong>Explanation:</strong>\nP     I    N\nA   L S  I G\nY A   H R\nP     I\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> s = &quot;A&quot;, numRows = 1\n<strong>Output:</strong> &quot;A&quot;\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= s.length &lt;= 1000</code></li>\n\t<li><code>s</code> consists of English letters (lower-case and upper-case), <code>&#39;,&#39;</code> and <code>&#39;.&#39;</code>.</li>\n\t<li><code>1 &lt;= numRows &lt;= 1000</code></li>\n</ul>\n",
      "lcSlug": "zigzag-conversion",
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
      "description": "Seven different symbols represent Roman numerals with the following values:\n\n\t\n\t\t\n\t\t\tSymbol\n\t\t\tValue\n\t\t\n\t\n\t\n\t\t\n\t\t\tI\n\t\t\t1\n\t\t\n\t\t\n\t\t\tV\n\t\t\t5\n\t\t\n\t\t\n\t\t\tX\n\t\t\t10\n\t\t\n\t\t\n\t\t\tL\n\t\t\t50\n\t\t\n\t\t\n\t\t\tC\n\t\t\t100\n\t\t\n\t\t\n\t\t\tD\n\t\t\t500\n\t\t\n\t\t\n\t\t\tM\n\t\t\t1000\n\t\t\n\t\n\nRoman numerals are formed by appending the conversions of decimal place values from highest to lowest. Converting a decimal place value into a Roman numeral has the following rules:\n\n\t• If the value does not start with 4 or 9, select the symbol of the maximal value that can be subtracted from the input, append that symbol to the result, subtract its value, and convert the remainder to a Roman numeral.\n• If the value starts with 4 or 9 use the subtractive form representing one symbol subtracted from the following symbol, for example, 4 is 1 (`I`) less than 5 (`V`): `IV` and 9 is 1 (`I`) less than 10 (`X`): `IX`. Only the following subtractive forms are used: 4 (`IV`), 9 (`IX`), 40 (`XL`), 90 (`XC`), 400 (`CD`) and 900 (`CM`).\n• Only powers of 10 (`I`, `X`, `C`, `M`) can be appended consecutively at most 3 times to represent multiples of 10. You cannot append 5 (`V`), 50 (`L`), or 500 (`D`) multiple times. If you need to append a symbol 4 times use the subtractive form.\n\nGiven an integer, convert it to a Roman numeral.\n\n \n\nExample 1:\n\nInput: num = 3749\n\nOutput: \"MMMDCCXLIX\"\n\nExplanation:\n\n3000 = MMM as 1000 (M) + 1000 (M) + 1000 (M)\n 700 = DCC as 500 (D) + 100 (C) + 100 (C)\n  40 = XL as 10 (X) less of 50 (L)\n   9 = IX as 1 (I) less of 10 (X)\nNote: 49 is not 1 (I) less of 50 (L) because the conversion is based on decimal places\n\nExample 2:\n\nInput: num = 58\n\nOutput: \"LVIII\"\n\nExplanation:\n\n50 = L\n 8 = VIII\n\nExample 3:\n\nInput: num = 1994\n\nOutput: \"MCMXCIV\"\n\nExplanation:\n\n1000 = M\n 900 = CM\n  90 = XC\n   4 = IV\n\n \n\nConstraints:\n\n\t• `1",
      "descriptionHtml": "<p>Seven different symbols represent Roman numerals with the following values:</p>\n\n<table>\n\t<thead>\n\t\t<tr>\n\t\t\t<th>Symbol</th>\n\t\t\t<th>Value</th>\n\t\t</tr>\n\t</thead>\n\t<tbody>\n\t\t<tr>\n\t\t\t<td>I</td>\n\t\t\t<td>1</td>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<td>V</td>\n\t\t\t<td>5</td>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<td>X</td>\n\t\t\t<td>10</td>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<td>L</td>\n\t\t\t<td>50</td>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<td>C</td>\n\t\t\t<td>100</td>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<td>D</td>\n\t\t\t<td>500</td>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<td>M</td>\n\t\t\t<td>1000</td>\n\t\t</tr>\n\t</tbody>\n</table>\n\n<p>Roman numerals are formed by appending&nbsp;the conversions of&nbsp;decimal place values&nbsp;from highest to lowest. Converting a decimal place value into a Roman numeral has the following rules:</p>\n\n<ul>\n\t<li>If the value does not start with 4 or&nbsp;9, select the symbol of the maximal value that can be subtracted from the input, append that symbol to the result, subtract its value, and convert the remainder to a Roman numeral.</li>\n\t<li>If the value starts with 4 or 9 use the&nbsp;<strong>subtractive form</strong>&nbsp;representing&nbsp;one symbol subtracted from the following symbol, for example,&nbsp;4 is 1 (<code>I</code>) less than 5 (<code>V</code>): <code>IV</code>&nbsp;and 9 is 1 (<code>I</code>) less than 10 (<code>X</code>): <code>IX</code>.&nbsp;Only the following subtractive forms are used: 4 (<code>IV</code>), 9 (<code>IX</code>),&nbsp;40 (<code>XL</code>), 90 (<code>XC</code>), 400 (<code>CD</code>) and 900 (<code>CM</code>).</li>\n\t<li>Only powers of 10 (<code>I</code>, <code>X</code>, <code>C</code>, <code>M</code>) can be appended consecutively at most 3 times to represent multiples of 10. You cannot append 5&nbsp;(<code>V</code>), 50 (<code>L</code>), or 500 (<code>D</code>) multiple times. If you need to append a symbol&nbsp;4 times&nbsp;use the <strong>subtractive form</strong>.</li>\n</ul>\n\n<p>Given an integer, convert it to a Roman numeral.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<div class=\"example-block\">\n<p><strong>Input:</strong> <span class=\"example-io\">num = 3749</span></p>\n\n<p><strong>Output:</strong> <span class=\"example-io\">&quot;MMMDCCXLIX&quot;</span></p>\n\n<p><strong>Explanation:</strong></p>\n\n<pre>\n3000 = MMM as 1000 (M) + 1000 (M) + 1000 (M)\n 700 = DCC as 500 (D) + 100 (C) + 100 (C)\n  40 = XL as 10 (X) less of 50 (L)\n   9 = IX as 1 (I) less of 10 (X)\nNote: 49 is not 1 (I) less of 50 (L) because the conversion is based on decimal places\n</pre>\n</div>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<div class=\"example-block\">\n<p><strong>Input:</strong> <span class=\"example-io\">num = 58</span></p>\n\n<p><strong>Output:</strong> <span class=\"example-io\">&quot;LVIII&quot;</span></p>\n\n<p><strong>Explanation:</strong></p>\n\n<pre>\n50 = L\n 8 = VIII\n</pre>\n</div>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<div class=\"example-block\">\n<p><strong>Input:</strong> <span class=\"example-io\">num = 1994</span></p>\n\n<p><strong>Output:</strong> <span class=\"example-io\">&quot;MCMXCIV&quot;</span></p>\n\n<p><strong>Explanation:</strong></p>\n\n<pre>\n1000 = M\n 900 = CM\n  90 = XC\n   4 = IV\n</pre>\n</div>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= num &lt;= 3999</code></li>\n</ul>\n",
      "lcSlug": "integer-to-roman",
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
      "description": "Roman numerals are represented by seven different symbols: `I`, `V`, `X`, `L`, `C`, `D` and `M`.\n\nSymbol       Value\nI             1\nV             5\nX             10\nL             50\nC             100\nD             500\nM             1000\n\nFor example, `2` is written as `II` in Roman numeral, just two ones added together. `12` is written as `XII`, which is simply `X + II`. The number `27` is written as `XXVII`, which is `XX + V + II`.\n\nRoman numerals are usually written largest to smallest from left to right. However, the numeral for four is not `IIII`. Instead, the number four is written as `IV`. Because the one is before the five we subtract it making four. The same principle applies to the number nine, which is written as `IX`. There are six instances where subtraction is used:\n\n\t• `I` can be placed before `V` (5) and `X` (10) to make 4 and 9. \n• `X` can be placed before `L` (50) and `C` (100) to make 40 and 90. \n• `C` can be placed before `D` (500) and `M` (1000) to make 400 and 900.\n\nGiven a roman numeral, convert it to an integer.\n\n \n\nExample 1:\n\nInput: s = \"III\"\nOutput: 3\nExplanation: III = 3.\n\nExample 2:\n\nInput: s = \"LVIII\"\nOutput: 58\nExplanation: L = 50, V= 5, III = 3.\n\nExample 3:\n\nInput: s = \"MCMXCIV\"\nOutput: 1994\nExplanation: M = 1000, CM = 900, XC = 90 and IV = 4.\n\n \n\nConstraints:\n\n\t• `1",
      "descriptionHtml": "<p>Roman numerals are represented by seven different symbols:&nbsp;<code>I</code>, <code>V</code>, <code>X</code>, <code>L</code>, <code>C</code>, <code>D</code> and <code>M</code>.</p>\n\n<pre>\n<strong>Symbol</strong>       <strong>Value</strong>\nI             1\nV             5\nX             10\nL             50\nC             100\nD             500\nM             1000</pre>\n\n<p>For example,&nbsp;<code>2</code> is written as <code>II</code>&nbsp;in Roman numeral, just two ones added together. <code>12</code> is written as&nbsp;<code>XII</code>, which is simply <code>X + II</code>. The number <code>27</code> is written as <code>XXVII</code>, which is <code>XX + V + II</code>.</p>\n\n<p>Roman numerals are usually written largest to smallest from left to right. However, the numeral for four is not <code>IIII</code>. Instead, the number four is written as <code>IV</code>. Because the one is before the five we subtract it making four. The same principle applies to the number nine, which is written as <code>IX</code>. There are six instances where subtraction is used:</p>\n\n<ul>\n\t<li><code>I</code> can be placed before <code>V</code> (5) and <code>X</code> (10) to make 4 and 9.&nbsp;</li>\n\t<li><code>X</code> can be placed before <code>L</code> (50) and <code>C</code> (100) to make 40 and 90.&nbsp;</li>\n\t<li><code>C</code> can be placed before <code>D</code> (500) and <code>M</code> (1000) to make 400 and 900.</li>\n</ul>\n\n<p>Given a roman numeral, convert it to an integer.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> s = &quot;III&quot;\n<strong>Output:</strong> 3\n<strong>Explanation:</strong> III = 3.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> s = &quot;LVIII&quot;\n<strong>Output:</strong> 58\n<strong>Explanation:</strong> L = 50, V= 5, III = 3.\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> s = &quot;MCMXCIV&quot;\n<strong>Output:</strong> 1994\n<strong>Explanation:</strong> M = 1000, CM = 900, XC = 90 and IV = 4.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= s.length &lt;= 15</code></li>\n\t<li><code>s</code> contains only&nbsp;the characters <code>(&#39;I&#39;, &#39;V&#39;, &#39;X&#39;, &#39;L&#39;, &#39;C&#39;, &#39;D&#39;, &#39;M&#39;)</code>.</li>\n\t<li>It is <strong>guaranteed</strong>&nbsp;that <code>s</code> is a valid roman numeral in the range <code>[1, 3999]</code>.</li>\n</ul>\n",
      "lcSlug": "roman-to-integer",
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
      "description": "Given a string containing digits from `2-9` inclusive, return all possible letter combinations that the number could represent. Return the answer in any order.\n\nA mapping of digits to letters (just like on the telephone buttons) is given below. Note that 1 does not map to any letters.\n\n \n\nExample 1:\n\nInput: digits = \"23\"\nOutput: [\"ad\",\"ae\",\"af\",\"bd\",\"be\",\"bf\",\"cd\",\"ce\",\"cf\"]\n\nExample 2:\n\nInput: digits = \"2\"\nOutput: [\"a\",\"b\",\"c\"]\n\n \n\nConstraints:\n\n\t• `1",
      "descriptionHtml": "<p>Given a string containing digits from <code>2-9</code> inclusive, return all possible letter combinations that the number could represent. Return the answer in <strong>any order</strong>.</p>\n\n<p>A mapping of digits to letters (just like on the telephone buttons) is given below. Note that 1 does not map to any letters.</p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2022/03/15/1200px-telephone-keypad2svg.png\" style=\"width: 300px; height: 243px;\" />\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> digits = &quot;23&quot;\n<strong>Output:</strong> [&quot;ad&quot;,&quot;ae&quot;,&quot;af&quot;,&quot;bd&quot;,&quot;be&quot;,&quot;bf&quot;,&quot;cd&quot;,&quot;ce&quot;,&quot;cf&quot;]\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> digits = &quot;2&quot;\n<strong>Output:</strong> [&quot;a&quot;,&quot;b&quot;,&quot;c&quot;]\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= digits.length &lt;= 4</code></li>\n\t<li><code>digits[i]</code> is a digit in the range <code>[&#39;2&#39;, &#39;9&#39;]</code>.</li>\n</ul>\n",
      "lcSlug": "letter-combinations-of-a-phone-number",
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
      "description": "Given `n` pairs of parentheses, write a function to generate all combinations of well-formed parentheses.\n\n \n\nExample 1:\n\nInput: n = 3\nOutput: [\"((()))\",\"(()())\",\"(())()\",\"()(())\",\"()()()\"]\n\nExample 2:\n\nInput: n = 1\nOutput: [\"()\"]\n\n \n\nConstraints:\n\n\t• `1",
      "descriptionHtml": "<p>Given <code>n</code> pairs of parentheses, write a function to <em>generate all combinations of well-formed parentheses</em>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<pre><strong>Input:</strong> n = 3\n<strong>Output:</strong> [\"((()))\",\"(()())\",\"(())()\",\"()(())\",\"()()()\"]\n</pre><p><strong class=\"example\">Example 2:</strong></p>\n<pre><strong>Input:</strong> n = 1\n<strong>Output:</strong> [\"()\"]\n</pre>\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= n &lt;= 8</code></li>\n</ul>\n",
      "lcSlug": "generate-parentheses",
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
      "description": "Given an encoded string, return its decoded string.\n\nThe encoding rule is: `k[encoded_string]`, where the `encoded_string` inside the square brackets is being repeated exactly `k` times. Note that `k` is guaranteed to be a positive integer.\n\nYou may assume that the input string is always valid; there are no extra white spaces, square brackets are well-formed, etc. Furthermore, you may assume that the original data does not contain any digits and that digits are only for those repeat numbers, `k`. For example, there will not be input like `3a` or `2[4]`.\n\nThe test cases are generated so that the length of the output will never exceed `105`.\n\n \n\nExample 1:\n\nInput: s = \"3[a]2[bc]\"\nOutput: \"aaabcbc\"\n\nExample 2:\n\nInput: s = \"3[a2[c]]\"\nOutput: \"accaccacc\"\n\nExample 3:\n\nInput: s = \"2[abc]3[cd]ef\"\nOutput: \"abcabccdcdcdef\"\n\n \n\nConstraints:\n\n\t• `1",
      "descriptionHtml": "<p>Given an encoded string, return its decoded string.</p>\n\n<p>The encoding rule is: <code>k[encoded_string]</code>, where the <code>encoded_string</code> inside the square brackets is being repeated exactly <code>k</code> times. Note that <code>k</code> is guaranteed to be a positive integer.</p>\n\n<p>You may assume that the input string is always valid; there are no extra white spaces, square brackets are well-formed, etc. Furthermore, you may assume that the original data does not contain any digits and that digits are only for those repeat numbers, <code>k</code>. For example, there will not be input like <code>3a</code> or <code>2[4]</code>.</p>\n\n<p>The test cases are generated so that the length of the output will never exceed <code>10<sup>5</sup></code>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> s = &quot;3[a]2[bc]&quot;\n<strong>Output:</strong> &quot;aaabcbc&quot;\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> s = &quot;3[a2[c]]&quot;\n<strong>Output:</strong> &quot;accaccacc&quot;\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> s = &quot;2[abc]3[cd]ef&quot;\n<strong>Output:</strong> &quot;abcabccdcdcdef&quot;\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= s.length &lt;= 30</code></li>\n\t<li><code>s</code> consists of lowercase English letters, digits, and square brackets <code>&#39;[]&#39;</code>.</li>\n\t<li><code>s</code> is guaranteed to be <strong>a valid</strong> input.</li>\n\t<li>All the integers in <code>s</code> are in the range <code>[1, 300]</code>.</li>\n</ul>\n",
      "lcSlug": "decode-string",
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
      "description": "Implement the `myAtoi(string s)` function, which converts a string to a 32-bit signed integer.\n\nThe algorithm for `myAtoi(string s)` is as follows:\n\n\t• Whitespace: Ignore any leading whitespace (`\" \"`).\n• Signedness: Determine the sign by checking if the next character is `'-'` or `'+'`, assuming positivity if neither present.\n• Conversion: Read the integer by skipping leading zeros until a non-digit character is encountered or the end of the string is reached. If no digits were read, then the result is 0.\n• Rounding: If the integer is out of the 32-bit signed integer range `[-231, 231 - 1]`, then round the integer to remain in the range. Specifically, integers less than `-231` should be rounded to `-231`, and integers greater than `231 - 1` should be rounded to `231 - 1`.\n\nReturn the integer as the final result.\n\n \n\nExample 1:\n\nInput: s = \"42\"\n\nOutput: 42\n\nExplanation:\n\nThe underlined characters are what is read in and the caret is the current reader position.\nStep 1: \"42\" (no characters read because there is no leading whitespace)\n         ^\nStep 2: \"42\" (no characters read because there is neither a '-' nor '+')\n         ^\nStep 3: \"42\" (\"42\" is read in)\n           ^\n\nExample 2:\n\nInput: s = \" -042\"\n\nOutput: -42\n\nExplanation:\n\nStep 1: \"   -042\" (leading whitespace is read and ignored)\n            ^\nStep 2: \"   -042\" ('-' is read, so the result should be negative)\n             ^\nStep 3: \"   -042\" (\"042\" is read in, leading zeros ignored in the result)\n               ^\n\nExample 3:\n\nInput: s = \"1337c0d3\"\n\nOutput: 1337\n\nExplanation:\n\nStep 1: \"1337c0d3\" (no characters read because there is no leading whitespace)\n         ^\nStep 2: \"1337c0d3\" (no characters read because there is neither a '-' nor '+')\n         ^\nStep 3: \"1337c0d3\" (\"1337\" is read in; reading stops because the next character is a non-digit)\n             ^\n\nExample 4:\n\nInput: s = \"0-1\"\n\nOutput: 0\n\nExplanation:\n\nStep 1: \"0-1\" (no characters read because there is no leading whitespace)\n         ^\nStep 2: \"0-1\" (no characters read because there is neither a '-' nor '+')\n         ^\nStep 3: \"0-1\" (\"0\" is read in; reading stops because the next character is a non-digit)\n          ^\n\nExample 5:\n\nInput: s = \"words and 987\"\n\nOutput: 0\n\nExplanation:\n\nReading stops at the first non-digit character 'w'.\n\n \n\nConstraints:\n\n\t• `0",
      "descriptionHtml": "<p>Implement the <code>myAtoi(string s)</code> function, which converts a string to a 32-bit signed integer.</p>\n\n<p>The algorithm for <code>myAtoi(string s)</code> is as follows:</p>\n\n<ol>\n\t<li><strong>Whitespace</strong>: Ignore any leading whitespace (<code>&quot; &quot;</code>).</li>\n\t<li><strong>Signedness</strong>: Determine the sign by checking if the next character is <code>&#39;-&#39;</code> or <code>&#39;+&#39;</code>, assuming positivity if neither present.</li>\n\t<li><strong>Conversion</strong>: Read the integer by skipping leading zeros&nbsp;until a non-digit character is encountered or the end of the string is reached. If no digits were read, then the result is 0.</li>\n\t<li><strong>Rounding</strong>: If the integer is out of the 32-bit signed integer range <code>[-2<sup>31</sup>, 2<sup>31</sup> - 1]</code>, then round the integer to remain in the range. Specifically, integers less than <code>-2<sup>31</sup></code> should be rounded to <code>-2<sup>31</sup></code>, and integers greater than <code>2<sup>31</sup> - 1</code> should be rounded to <code>2<sup>31</sup> - 1</code>.</li>\n</ol>\n\n<p>Return the integer as the final result.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<div class=\"example-block\">\n<p><strong>Input:</strong> <span class=\"example-io\">s = &quot;42&quot;</span></p>\n\n<p><strong>Output:</strong> <span class=\"example-io\">42</span></p>\n\n<p><strong>Explanation:</strong></p>\n\n<pre>\nThe underlined characters are what is read in and the caret is the current reader position.\nStep 1: &quot;42&quot; (no characters read because there is no leading whitespace)\n         ^\nStep 2: &quot;42&quot; (no characters read because there is neither a &#39;-&#39; nor &#39;+&#39;)\n         ^\nStep 3: &quot;<u>42</u>&quot; (&quot;42&quot; is read in)\n           ^\n</pre>\n</div>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<div class=\"example-block\">\n<p><strong>Input:</strong> <span class=\"example-io\">s = &quot; -042&quot;</span></p>\n\n<p><strong>Output:</strong> <span class=\"example-io\">-42</span></p>\n\n<p><strong>Explanation:</strong></p>\n\n<pre>\nStep 1: &quot;<u>   </u>-042&quot; (leading whitespace is read and ignored)\n            ^\nStep 2: &quot;   <u>-</u>042&quot; (&#39;-&#39; is read, so the result should be negative)\n             ^\nStep 3: &quot;   -<u>042</u>&quot; (&quot;042&quot; is read in, leading zeros ignored in the result)\n               ^\n</pre>\n</div>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<div class=\"example-block\">\n<p><strong>Input:</strong> <span class=\"example-io\">s = &quot;1337c0d3&quot;</span></p>\n\n<p><strong>Output:</strong> <span class=\"example-io\">1337</span></p>\n\n<p><strong>Explanation:</strong></p>\n\n<pre>\nStep 1: &quot;1337c0d3&quot; (no characters read because there is no leading whitespace)\n         ^\nStep 2: &quot;1337c0d3&quot; (no characters read because there is neither a &#39;-&#39; nor &#39;+&#39;)\n         ^\nStep 3: &quot;<u>1337</u>c0d3&quot; (&quot;1337&quot; is read in; reading stops because the next character is a non-digit)\n             ^\n</pre>\n</div>\n\n<p><strong class=\"example\">Example 4:</strong></p>\n\n<div class=\"example-block\">\n<p><strong>Input:</strong> <span class=\"example-io\">s = &quot;0-1&quot;</span></p>\n\n<p><strong>Output:</strong> <span class=\"example-io\">0</span></p>\n\n<p><strong>Explanation:</strong></p>\n\n<pre>\nStep 1: &quot;0-1&quot; (no characters read because there is no leading whitespace)\n         ^\nStep 2: &quot;0-1&quot; (no characters read because there is neither a &#39;-&#39; nor &#39;+&#39;)\n         ^\nStep 3: &quot;<u>0</u>-1&quot; (&quot;0&quot; is read in; reading stops because the next character is a non-digit)\n          ^\n</pre>\n</div>\n\n<p><strong class=\"example\">Example 5:</strong></p>\n\n<div class=\"example-block\">\n<p><strong>Input:</strong> <span class=\"example-io\">s = &quot;words and 987&quot;</span></p>\n\n<p><strong>Output:</strong> <span class=\"example-io\">0</span></p>\n\n<p><strong>Explanation:</strong></p>\n\n<p>Reading stops at the first non-digit character &#39;w&#39;.</p>\n</div>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>0 &lt;= s.length &lt;= 200</code></li>\n\t<li><code>s</code> consists of English letters (lower-case and upper-case), digits (<code>0-9</code>), <code>&#39; &#39;</code>, <code>&#39;+&#39;</code>, <code>&#39;-&#39;</code>, and <code>&#39;.&#39;</code>.</li>\n</ul>\n",
      "lcSlug": "string-to-integer-atoi",
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
      "description": "Given a string `s`, find the longest palindromic subsequence's length in `s`.\n\nA subsequence is a sequence that can be derived from another sequence by deleting some or no elements without changing the order of the remaining elements.\n\n \n\nExample 1:\n\nInput: s = \"bbbab\"\nOutput: 4\nExplanation: One possible longest palindromic subsequence is \"bbbb\".\n\nExample 2:\n\nInput: s = \"cbbd\"\nOutput: 2\nExplanation: One possible longest palindromic subsequence is \"bb\".\n\n \n\nConstraints:\n\n\t• `1",
      "descriptionHtml": "<p>Given a string <code>s</code>, find <em>the longest palindromic <strong>subsequence</strong>&#39;s length in</em> <code>s</code>.</p>\n\n<p>A <strong>subsequence</strong> is a sequence that can be derived from another sequence by deleting some or no elements without changing the order of the remaining elements.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> s = &quot;bbbab&quot;\n<strong>Output:</strong> 4\n<strong>Explanation:</strong> One possible longest palindromic subsequence is &quot;bbbb&quot;.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> s = &quot;cbbd&quot;\n<strong>Output:</strong> 2\n<strong>Explanation:</strong> One possible longest palindromic subsequence is &quot;bb&quot;.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= s.length &lt;= 1000</code></li>\n\t<li><code>s</code> consists only of lowercase English letters.</li>\n</ul>\n",
      "lcSlug": "longest-palindromic-subsequence",
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
      "description": "Given a string `s`, return the number of palindromic substrings in it.\n\nA string is a palindrome when it reads the same backward as forward.\n\nA substring is a contiguous sequence of characters within the string.\n\n \n\nExample 1:\n\nInput: s = \"abc\"\nOutput: 3\nExplanation: Three palindromic strings: \"a\", \"b\", \"c\".\n\nExample 2:\n\nInput: s = \"aaa\"\nOutput: 6\nExplanation: Six palindromic strings: \"a\", \"a\", \"a\", \"aa\", \"aa\", \"aaa\".\n\n \n\nConstraints:\n\n\t• `1",
      "descriptionHtml": "<p>Given a string <code>s</code>, return <em>the number of <strong>palindromic substrings</strong> in it</em>.</p>\n\n<p>A string is a <strong>palindrome</strong> when it reads the same backward as forward.</p>\n\n<p>A <strong>substring</strong> is a contiguous sequence of characters within the string.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> s = &quot;abc&quot;\n<strong>Output:</strong> 3\n<strong>Explanation:</strong> Three palindromic strings: &quot;a&quot;, &quot;b&quot;, &quot;c&quot;.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> s = &quot;aaa&quot;\n<strong>Output:</strong> 6\n<strong>Explanation:</strong> Six palindromic strings: &quot;a&quot;, &quot;a&quot;, &quot;a&quot;, &quot;aa&quot;, &quot;aa&quot;, &quot;aaa&quot;.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= s.length &lt;= 1000</code></li>\n\t<li><code>s</code> consists of lowercase English letters.</li>\n</ul>\n",
      "lcSlug": "palindromic-substrings",
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
      "description": "Given a string `s` and a dictionary of strings `wordDict`, return `true` if `s` can be segmented into a space-separated sequence of one or more dictionary words.\n\nNote that the same word in the dictionary may be reused multiple times in the segmentation.\n\n \n\nExample 1:\n\nInput: s = \"leetcode\", wordDict = [\"leet\",\"code\"]\nOutput: true\nExplanation: Return true because \"leetcode\" can be segmented as \"leet code\".\n\nExample 2:\n\nInput: s = \"applepenapple\", wordDict = [\"apple\",\"pen\"]\nOutput: true\nExplanation: Return true because \"applepenapple\" can be segmented as \"apple pen apple\".\nNote that you are allowed to reuse a dictionary word.\n\nExample 3:\n\nInput: s = \"catsandog\", wordDict = [\"cats\",\"dog\",\"sand\",\"and\",\"cat\"]\nOutput: false\n\n \n\nConstraints:\n\n\t• `1",
      "descriptionHtml": "<p>Given a string <code>s</code> and a dictionary of strings <code>wordDict</code>, return <code>true</code> if <code>s</code> can be segmented into a space-separated sequence of one or more dictionary words.</p>\n\n<p><strong>Note</strong> that the same word in the dictionary may be reused multiple times in the segmentation.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> s = &quot;leetcode&quot;, wordDict = [&quot;leet&quot;,&quot;code&quot;]\n<strong>Output:</strong> true\n<strong>Explanation:</strong> Return true because &quot;leetcode&quot; can be segmented as &quot;leet code&quot;.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> s = &quot;applepenapple&quot;, wordDict = [&quot;apple&quot;,&quot;pen&quot;]\n<strong>Output:</strong> true\n<strong>Explanation:</strong> Return true because &quot;applepenapple&quot; can be segmented as &quot;apple pen apple&quot;.\nNote that you are allowed to reuse a dictionary word.\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> s = &quot;catsandog&quot;, wordDict = [&quot;cats&quot;,&quot;dog&quot;,&quot;sand&quot;,&quot;and&quot;,&quot;cat&quot;]\n<strong>Output:</strong> false\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= s.length &lt;= 300</code></li>\n\t<li><code>1 &lt;= wordDict.length &lt;= 1000</code></li>\n\t<li><code>1 &lt;= wordDict[i].length &lt;= 20</code></li>\n\t<li><code>s</code> and <code>wordDict[i]</code> consist of only lowercase English letters.</li>\n\t<li>All the strings of <code>wordDict</code> are <strong>unique</strong>.</li>\n</ul>\n",
      "lcSlug": "word-break",
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
      "description": "Given a string `s` and a dictionary of strings `wordDict`, add spaces in `s` to construct a sentence where each word is a valid dictionary word. Return all such possible sentences in any order.\n\nNote that the same word in the dictionary may be reused multiple times in the segmentation.\n\n \n\nExample 1:\n\nInput: s = \"catsanddog\", wordDict = [\"cat\",\"cats\",\"and\",\"sand\",\"dog\"]\nOutput: [\"cats and dog\",\"cat sand dog\"]\n\nExample 2:\n\nInput: s = \"pineapplepenapple\", wordDict = [\"apple\",\"pen\",\"applepen\",\"pine\",\"pineapple\"]\nOutput: [\"pine apple pen apple\",\"pineapple pen apple\",\"pine applepen apple\"]\nExplanation: Note that you are allowed to reuse a dictionary word.\n\nExample 3:\n\nInput: s = \"catsandog\", wordDict = [\"cats\",\"dog\",\"sand\",\"and\",\"cat\"]\nOutput: []\n\n \n\nConstraints:\n\n\t• `1 5.",
      "descriptionHtml": "<p>Given a string <code>s</code> and a dictionary of strings <code>wordDict</code>, add spaces in <code>s</code> to construct a sentence where each word is a valid dictionary word. Return all such possible sentences in <strong>any order</strong>.</p>\n\n<p><strong>Note</strong> that the same word in the dictionary may be reused multiple times in the segmentation.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> s = &quot;catsanddog&quot;, wordDict = [&quot;cat&quot;,&quot;cats&quot;,&quot;and&quot;,&quot;sand&quot;,&quot;dog&quot;]\n<strong>Output:</strong> [&quot;cats and dog&quot;,&quot;cat sand dog&quot;]\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> s = &quot;pineapplepenapple&quot;, wordDict = [&quot;apple&quot;,&quot;pen&quot;,&quot;applepen&quot;,&quot;pine&quot;,&quot;pineapple&quot;]\n<strong>Output:</strong> [&quot;pine apple pen apple&quot;,&quot;pineapple pen apple&quot;,&quot;pine applepen apple&quot;]\n<strong>Explanation:</strong> Note that you are allowed to reuse a dictionary word.\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> s = &quot;catsandog&quot;, wordDict = [&quot;cats&quot;,&quot;dog&quot;,&quot;sand&quot;,&quot;and&quot;,&quot;cat&quot;]\n<strong>Output:</strong> []\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= s.length &lt;= 20</code></li>\n\t<li><code>1 &lt;= wordDict.length &lt;= 1000</code></li>\n\t<li><code>1 &lt;= wordDict[i].length &lt;= 10</code></li>\n\t<li><code>s</code> and <code>wordDict[i]</code> consist of only lowercase English letters.</li>\n\t<li>All the strings of <code>wordDict</code> are <strong>unique</strong>.</li>\n\t<li>Input is generated in a way that the length of the answer doesn&#39;t exceed&nbsp;10<sup>5</sup>.</li>\n</ul>\n",
      "lcSlug": "word-break-ii",
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
      "description": "Given two strings `word1` and `word2`, return the minimum number of operations required to convert `word1` to `word2`.\n\nYou have the following three operations permitted on a word:\n\n\t• Insert a character\n• Delete a character\n• Replace a character\n\n \n\nExample 1:\n\nInput: word1 = \"horse\", word2 = \"ros\"\nOutput: 3\nExplanation: \nhorse -> rorse (replace 'h' with 'r')\nrorse -> rose (remove 'r')\nrose -> ros (remove 'e')\n\nExample 2:\n\nInput: word1 = \"intention\", word2 = \"execution\"\nOutput: 5\nExplanation: \nintention -> inention (remove 't')\ninention -> enention (replace 'i' with 'e')\nenention -> exention (replace 'n' with 'x')\nexention -> exection (replace 'n' with 'c')\nexection -> execution (insert 'u')\n\n \n\nConstraints:\n\n\t• `0",
      "descriptionHtml": "<p>Given two strings <code>word1</code> and <code>word2</code>, return <em>the minimum number of operations required to convert <code>word1</code> to <code>word2</code></em>.</p>\n\n<p>You have the following three operations permitted on a word:</p>\n\n<ul>\n\t<li>Insert a character</li>\n\t<li>Delete a character</li>\n\t<li>Replace a character</li>\n</ul>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> word1 = &quot;horse&quot;, word2 = &quot;ros&quot;\n<strong>Output:</strong> 3\n<strong>Explanation:</strong> \nhorse -&gt; rorse (replace &#39;h&#39; with &#39;r&#39;)\nrorse -&gt; rose (remove &#39;r&#39;)\nrose -&gt; ros (remove &#39;e&#39;)\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> word1 = &quot;intention&quot;, word2 = &quot;execution&quot;\n<strong>Output:</strong> 5\n<strong>Explanation:</strong> \nintention -&gt; inention (remove &#39;t&#39;)\ninention -&gt; enention (replace &#39;i&#39; with &#39;e&#39;)\nenention -&gt; exention (replace &#39;n&#39; with &#39;x&#39;)\nexention -&gt; exection (replace &#39;n&#39; with &#39;c&#39;)\nexection -&gt; execution (insert &#39;u&#39;)\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>0 &lt;= word1.length, word2.length &lt;= 500</code></li>\n\t<li><code>word1</code> and <code>word2</code> consist of lowercase English letters.</li>\n</ul>\n",
      "lcSlug": "edit-distance",
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
      "description": "Given two strings s and t, return the number of distinct subsequences of s which equals t.\n\nThe test cases are generated so that the answer fits on a 32-bit signed integer.\n\n \n\nExample 1:\n\nInput: s = \"rabbbit\", t = \"rabbit\"\nOutput: 3\nExplanation:\nAs shown below, there are 3 ways you can generate \"rabbit\" from s.\nrabbbit\nrabbbit\nrabbbit\n\nExample 2:\n\nInput: s = \"babgbag\", t = \"bag\"\nOutput: 5\nExplanation:\nAs shown below, there are 5 ways you can generate \"bag\" from s.\nbabgbag\nbabgbag\nbabgbag\nbabgbag\nbabgbag\n\n \n\nConstraints:\n\n\t• `1",
      "descriptionHtml": "<p>Given two strings s and t, return <i>the number of distinct</i> <b><i>subsequences</i></b><i> of </i>s<i> which equals </i>t.</p>\n\n<p>The test cases are generated so that the answer fits on a 32-bit signed integer.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> s = &quot;rabbbit&quot;, t = &quot;rabbit&quot;\n<strong>Output:</strong> 3\n<strong>Explanation:</strong>\nAs shown below, there are 3 ways you can generate &quot;rabbit&quot; from s.\n<code><strong><u>rabb</u></strong>b<strong><u>it</u></strong></code>\n<code><strong><u>ra</u></strong>b<strong><u>bbit</u></strong></code>\n<code><strong><u>rab</u></strong>b<strong><u>bit</u></strong></code>\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> s = &quot;babgbag&quot;, t = &quot;bag&quot;\n<strong>Output:</strong> 5\n<strong>Explanation:</strong>\nAs shown below, there are 5 ways you can generate &quot;bag&quot; from s.\n<code><strong><u>ba</u></strong>b<u><strong>g</strong></u>bag</code>\n<code><strong><u>ba</u></strong>bgba<strong><u>g</u></strong></code>\n<code><u><strong>b</strong></u>abgb<strong><u>ag</u></strong></code>\n<code>ba<u><strong>b</strong></u>gb<u><strong>ag</strong></u></code>\n<code>babg<strong><u>bag</u></strong></code></pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= s.length, t.length &lt;= 1000</code></li>\n\t<li><code>s</code> and <code>t</code> consist of English letters.</li>\n</ul>\n",
      "lcSlug": "distinct-subsequences",
      "summary": "DP count — state invariant, then loop."
    }
  ]
};
