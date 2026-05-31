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
      "description": "A trie (pronounced as \"try\") or prefix tree is a tree data structure used to efficiently store and retrieve keys in a dataset of strings. There are various applications of this data structure, such as autocomplete and spellchecker.\n\nImplement the Trie class:\n\n\t• `Trie()` Initializes the trie object.\n• `void insert(String word)` Inserts the string `word` into the trie.\n• `boolean search(String word)` Returns `true` if the string `word` is in the trie (i.e., was inserted before), and `false` otherwise.\n• `boolean startsWith(String prefix)` Returns `true` if there is a previously inserted string `word` that has the prefix `prefix`, and `false` otherwise.\n\n \n\nExample 1:\n\nInput\n[\"Trie\", \"insert\", \"search\", \"search\", \"startsWith\", \"insert\", \"search\"]\n[[], [\"apple\"], [\"apple\"], [\"app\"], [\"app\"], [\"app\"], [\"app\"]]\nOutput\n[null, null, true, false, true, null, true]\n\nExplanation\nTrie trie = new Trie();\ntrie.insert(\"apple\");\ntrie.search(\"apple\");   // return True\ntrie.search(\"app\");     // return False\ntrie.startsWith(\"app\"); // return True\ntrie.insert(\"app\");\ntrie.search(\"app\");     // return True\n\n \n\nConstraints:\n\n\t• `1 4` calls in total will be made to `insert`, `search`, and `startsWith`.",
      "descriptionHtml": "<p>A <a href=\"https://en.wikipedia.org/wiki/Trie\" target=\"_blank\"><strong>trie</strong></a> (pronounced as &quot;try&quot;) or <strong>prefix tree</strong> is a tree data structure used to efficiently store and retrieve keys in a dataset of strings. There are various applications of this data structure, such as autocomplete and spellchecker.</p>\n\n<p>Implement the Trie class:</p>\n\n<ul>\n\t<li><code>Trie()</code> Initializes the trie object.</li>\n\t<li><code>void insert(String word)</code> Inserts the string <code>word</code> into the trie.</li>\n\t<li><code>boolean search(String word)</code> Returns <code>true</code> if the string <code>word</code> is in the trie (i.e., was inserted before), and <code>false</code> otherwise.</li>\n\t<li><code>boolean startsWith(String prefix)</code> Returns <code>true</code> if there is a previously inserted string <code>word</code> that has the prefix <code>prefix</code>, and <code>false</code> otherwise.</li>\n</ul>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input</strong>\n[&quot;Trie&quot;, &quot;insert&quot;, &quot;search&quot;, &quot;search&quot;, &quot;startsWith&quot;, &quot;insert&quot;, &quot;search&quot;]\n[[], [&quot;apple&quot;], [&quot;apple&quot;], [&quot;app&quot;], [&quot;app&quot;], [&quot;app&quot;], [&quot;app&quot;]]\n<strong>Output</strong>\n[null, null, true, false, true, null, true]\n\n<strong>Explanation</strong>\nTrie trie = new Trie();\ntrie.insert(&quot;apple&quot;);\ntrie.search(&quot;apple&quot;);   // return True\ntrie.search(&quot;app&quot;);     // return False\ntrie.startsWith(&quot;app&quot;); // return True\ntrie.insert(&quot;app&quot;);\ntrie.search(&quot;app&quot;);     // return True\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= word.length, prefix.length &lt;= 2000</code></li>\n\t<li><code>word</code> and <code>prefix</code> consist only of lowercase English letters.</li>\n\t<li>At most <code>3 * 10<sup>4</sup></code> calls <strong>in total</strong> will be made to <code>insert</code>, <code>search</code>, and <code>startsWith</code>.</li>\n</ul>\n",
      "lcSlug": "implement-trie-prefix-tree",
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
      "description": "Design a data structure that supports adding new words and finding if a string matches any previously added string.\n\nImplement the `WordDictionary` class:\n\n\t• `WordDictionary()` Initializes the object.\n• `void addWord(word)` Adds `word` to the data structure, it can be matched later.\n• `bool search(word)` Returns `true` if there is any string in the data structure that matches `word` or `false` otherwise. `word` may contain dots `'.'` where dots can be matched with any letter.\n\n \n\nExample:\n\nInput\n[\"WordDictionary\",\"addWord\",\"addWord\",\"addWord\",\"search\",\"search\",\"search\",\"search\"]\n[[],[\"bad\"],[\"dad\"],[\"mad\"],[\"pad\"],[\"bad\"],[\".ad\"],[\"b..\"]]\nOutput\n[null,null,null,null,false,true,true,true]\n\nExplanation\nWordDictionary wordDictionary = new WordDictionary();\nwordDictionary.addWord(\"bad\");\nwordDictionary.addWord(\"dad\");\nwordDictionary.addWord(\"mad\");\nwordDictionary.search(\"pad\"); // return False\nwordDictionary.search(\"bad\"); // return True\nwordDictionary.search(\".ad\"); // return True\nwordDictionary.search(\"b..\"); // return True\n\n \n\nConstraints:\n\n\t• `1 4` calls will be made to `addWord` and `search`.",
      "descriptionHtml": "<p>Design a data structure that supports adding new words and finding if a string matches any previously added string.</p>\n\n<p>Implement the <code>WordDictionary</code> class:</p>\n\n<ul>\n\t<li><code>WordDictionary()</code>&nbsp;Initializes the object.</li>\n\t<li><code>void addWord(word)</code> Adds <code>word</code> to the data structure, it can be matched later.</li>\n\t<li><code>bool search(word)</code>&nbsp;Returns <code>true</code> if there is any string in the data structure that matches <code>word</code>&nbsp;or <code>false</code> otherwise. <code>word</code> may contain dots <code>&#39;.&#39;</code> where dots can be matched with any letter.</li>\n</ul>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example:</strong></p>\n\n<pre>\n<strong>Input</strong>\n[&quot;WordDictionary&quot;,&quot;addWord&quot;,&quot;addWord&quot;,&quot;addWord&quot;,&quot;search&quot;,&quot;search&quot;,&quot;search&quot;,&quot;search&quot;]\n[[],[&quot;bad&quot;],[&quot;dad&quot;],[&quot;mad&quot;],[&quot;pad&quot;],[&quot;bad&quot;],[&quot;.ad&quot;],[&quot;b..&quot;]]\n<strong>Output</strong>\n[null,null,null,null,false,true,true,true]\n\n<strong>Explanation</strong>\nWordDictionary wordDictionary = new WordDictionary();\nwordDictionary.addWord(&quot;bad&quot;);\nwordDictionary.addWord(&quot;dad&quot;);\nwordDictionary.addWord(&quot;mad&quot;);\nwordDictionary.search(&quot;pad&quot;); // return False\nwordDictionary.search(&quot;bad&quot;); // return True\nwordDictionary.search(&quot;.ad&quot;); // return True\nwordDictionary.search(&quot;b..&quot;); // return True\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= word.length &lt;= 25</code></li>\n\t<li><code>word</code> in <code>addWord</code> consists of lowercase English letters.</li>\n\t<li><code>word</code> in <code>search</code> consist of <code>&#39;.&#39;</code> or lowercase English letters.</li>\n\t<li>There will be at most <code>2</code> dots in <code>word</code> for <code>search</code> queries.</li>\n\t<li>At most <code>10<sup>4</sup></code> calls will be made to <code>addWord</code> and <code>search</code>.</li>\n</ul>\n",
      "lcSlug": "design-add-and-search-words-data-structure",
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
      "description": "Given an `m x n` `board` of characters and a list of strings `words`, return all words on the board.\n\nEach word must be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring. The same letter cell may not be used more than once in a word.\n\n \n\nExample 1:\n\nInput: board = [[\"o\",\"a\",\"a\",\"n\"],[\"e\",\"t\",\"a\",\"e\"],[\"i\",\"h\",\"k\",\"r\"],[\"i\",\"f\",\"l\",\"v\"]], words = [\"oath\",\"pea\",\"eat\",\"rain\"]\nOutput: [\"eat\",\"oath\"]\n\nExample 2:\n\nInput: board = [[\"a\",\"b\"],[\"c\",\"d\"]], words = [\"abcb\"]\nOutput: []\n\n \n\nConstraints:\n\n\t• `m == board.length`\n• `n == board[i].length`\n• `1 4`\n• `1",
      "descriptionHtml": "<p>Given an <code>m x n</code> <code>board</code>&nbsp;of characters and a list of strings <code>words</code>, return <em>all words on the board</em>.</p>\n\n<p>Each word must be constructed from letters of sequentially adjacent cells, where <strong>adjacent cells</strong> are horizontally or vertically neighboring. The same letter cell may not be used more than once in a word.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2020/11/07/search1.jpg\" style=\"width: 322px; height: 322px;\" />\n<pre>\n<strong>Input:</strong> board = [[&quot;o&quot;,&quot;a&quot;,&quot;a&quot;,&quot;n&quot;],[&quot;e&quot;,&quot;t&quot;,&quot;a&quot;,&quot;e&quot;],[&quot;i&quot;,&quot;h&quot;,&quot;k&quot;,&quot;r&quot;],[&quot;i&quot;,&quot;f&quot;,&quot;l&quot;,&quot;v&quot;]], words = [&quot;oath&quot;,&quot;pea&quot;,&quot;eat&quot;,&quot;rain&quot;]\n<strong>Output:</strong> [&quot;eat&quot;,&quot;oath&quot;]\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2020/11/07/search2.jpg\" style=\"width: 162px; height: 162px;\" />\n<pre>\n<strong>Input:</strong> board = [[&quot;a&quot;,&quot;b&quot;],[&quot;c&quot;,&quot;d&quot;]], words = [&quot;abcb&quot;]\n<strong>Output:</strong> []\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>m == board.length</code></li>\n\t<li><code>n == board[i].length</code></li>\n\t<li><code>1 &lt;= m, n &lt;= 12</code></li>\n\t<li><code>board[i][j]</code> is a lowercase English letter.</li>\n\t<li><code>1 &lt;= words.length &lt;= 3 * 10<sup>4</sup></code></li>\n\t<li><code>1 &lt;= words[i].length &lt;= 10</code></li>\n\t<li><code>words[i]</code> consists of lowercase English letters.</li>\n\t<li>All the strings of <code>words</code> are unique.</li>\n</ul>\n",
      "lcSlug": "word-search-ii",
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
      "description": "In English, we have a concept called root, which can be followed by some other word to form another longer word - let's call this word derivative. For example, when the root `\"help\"` is followed by the word `\"ful\"`, we can form a derivative `\"helpful\"`.\n\nGiven a `dictionary` consisting of many roots and a `sentence` consisting of words separated by spaces, replace all the derivatives in the sentence with the root forming it. If a derivative can be replaced by more than one root, replace it with the root that has the shortest length.\n\nReturn the `sentence` after the replacement.\n\n \n\nExample 1:\n\nInput: dictionary = [\"cat\",\"bat\",\"rat\"], sentence = \"the cattle was rattled by the battery\"\nOutput: \"the cat was rat by the bat\"\n\nExample 2:\n\nInput: dictionary = [\"a\",\"b\",\"c\"], sentence = \"aadsfasf absbs bbab cadsfafs\"\nOutput: \"a a b c\"\n\n \n\nConstraints:\n\n\t• `1 6`\n• `sentence` consists of only lower-case letters and spaces.\n• The number of words in `sentence` is in the range `[1, 1000]`\n• The length of each word in `sentence` is in the range `[1, 1000]`\n• Every two consecutive words in `sentence` will be separated by exactly one space.\n• `sentence` does not have leading or trailing spaces.",
      "descriptionHtml": "<p>In English, we have a concept called <strong>root</strong>, which can be followed by some other word to form another longer word - let&#39;s call this word <strong>derivative</strong>. For example, when the <strong>root</strong> <code>&quot;help&quot;</code> is followed by the word <code>&quot;ful&quot;</code>, we can form a derivative <code>&quot;helpful&quot;</code>.</p>\n\n<p>Given a <code>dictionary</code> consisting of many <strong>roots</strong> and a <code>sentence</code> consisting of words separated by spaces, replace all the derivatives in the sentence with the <strong>root</strong> forming it. If a derivative can be replaced by more than one <strong>root</strong>, replace it with the <strong>root</strong> that has <strong>the shortest length</strong>.</p>\n\n<p>Return <em>the <code>sentence</code></em> after the replacement.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> dictionary = [&quot;cat&quot;,&quot;bat&quot;,&quot;rat&quot;], sentence = &quot;the cattle was rattled by the battery&quot;\n<strong>Output:</strong> &quot;the cat was rat by the bat&quot;\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> dictionary = [&quot;a&quot;,&quot;b&quot;,&quot;c&quot;], sentence = &quot;aadsfasf absbs bbab cadsfafs&quot;\n<strong>Output:</strong> &quot;a a b c&quot;\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= dictionary.length &lt;= 1000</code></li>\n\t<li><code>1 &lt;= dictionary[i].length &lt;= 100</code></li>\n\t<li><code>dictionary[i]</code> consists of only lower-case letters.</li>\n\t<li><code>1 &lt;= sentence.length &lt;= 10<sup>6</sup></code></li>\n\t<li><code>sentence</code> consists of only lower-case letters and spaces.</li>\n\t<li>The number of words in <code>sentence</code> is in the range <code>[1, 1000]</code></li>\n\t<li>The length of each word in <code>sentence</code> is in the range <code>[1, 1000]</code></li>\n\t<li>Every two consecutive words in <code>sentence</code> will be separated by exactly one space.</li>\n\t<li><code>sentence</code> does not have leading or trailing spaces.</li>\n</ul>\n",
      "lcSlug": "replace-words",
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
      "description": "Design a map that allows you to do the following:\n\n\t• Maps a string key to a given value.\n• Returns the sum of the values that have a key with a prefix equal to a given string.\n\nImplement the `MapSum` class:\n\n\t• `MapSum()` Initializes the `MapSum` object.\n• `void insert(String key, int val)` Inserts the `key-val` pair into the map. If the `key` already existed, the original `key-value` pair will be overridden to the new one.\n• `int sum(string prefix)` Returns the sum of all the pairs' value whose `key` starts with the `prefix`.\n\n \n\nExample 1:\n\nInput\n[\"MapSum\", \"insert\", \"sum\", \"insert\", \"sum\"]\n[[], [\"apple\", 3], [\"ap\"], [\"app\", 2], [\"ap\"]]\nOutput\n[null, null, 3, null, 5]\n\nExplanation\nMapSum mapSum = new MapSum();\nmapSum.insert(\"apple\", 3);  \nmapSum.sum(\"ap\");           // return 3 (apple = 3)\nmapSum.insert(\"app\", 2);    \nmapSum.sum(\"ap\");           // return 5 (apple + app = 3 + 2 = 5)\n\n \n\nConstraints:\n\n\t• `1",
      "descriptionHtml": "<p>Design a map that allows you to do the following:</p>\n\n<ul>\n\t<li>Maps a string key to a given value.</li>\n\t<li>Returns the sum of the values that have a key with a prefix equal to a given string.</li>\n</ul>\n\n<p>Implement the <code>MapSum</code> class:</p>\n\n<ul>\n\t<li><code>MapSum()</code> Initializes the <code>MapSum</code> object.</li>\n\t<li><code>void insert(String key, int val)</code> Inserts the <code>key-val</code> pair into the map. If the <code>key</code> already existed, the original <code>key-value</code> pair will be overridden to the new one.</li>\n\t<li><code>int sum(string prefix)</code> Returns the sum of all the pairs&#39; value whose <code>key</code> starts with the <code>prefix</code>.</li>\n</ul>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input</strong>\n[&quot;MapSum&quot;, &quot;insert&quot;, &quot;sum&quot;, &quot;insert&quot;, &quot;sum&quot;]\n[[], [&quot;apple&quot;, 3], [&quot;ap&quot;], [&quot;app&quot;, 2], [&quot;ap&quot;]]\n<strong>Output</strong>\n[null, null, 3, null, 5]\n\n<strong>Explanation</strong>\nMapSum mapSum = new MapSum();\nmapSum.insert(&quot;apple&quot;, 3);  \nmapSum.sum(&quot;ap&quot;);           // return 3 (<u>ap</u>ple = 3)\nmapSum.insert(&quot;app&quot;, 2);    \nmapSum.sum(&quot;ap&quot;);           // return 5 (<u>ap</u>ple + <u>ap</u>p = 3 + 2 = 5)\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= key.length, prefix.length &lt;= 50</code></li>\n\t<li><code>key</code> and <code>prefix</code> consist of only lowercase English letters.</li>\n\t<li><code>1 &lt;= val &lt;= 1000</code></li>\n\t<li>At most <code>50</code> calls will be made to <code>insert</code> and <code>sum</code>.</li>\n</ul>\n",
      "lcSlug": "map-sum-pairs",
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
      "description": "Given an array of strings `words` representing an English Dictionary, return the longest word in `words` that can be built one character at a time by other words in `words`.\n\nIf there is more than one possible answer, return the longest word with the smallest lexicographical order. If there is no answer, return the empty string.\n\nNote that the word should be built from left to right with each additional character being added to the end of a previous word. \n\n \n\nExample 1:\n\nInput: words = [\"w\",\"wo\",\"wor\",\"worl\",\"world\"]\nOutput: \"world\"\nExplanation: The word \"world\" can be built one character at a time by \"w\", \"wo\", \"wor\", and \"worl\".\n\nExample 2:\n\nInput: words = [\"a\",\"banana\",\"app\",\"appl\",\"ap\",\"apply\",\"apple\"]\nOutput: \"apple\"\nExplanation: Both \"apply\" and \"apple\" can be built from other words in the dictionary. However, \"apple\" is lexicographically smaller than \"apply\".\n\n \n\nConstraints:\n\n\t• `1",
      "descriptionHtml": "<p>Given an array of strings <code>words</code> representing an English Dictionary, return <em>the longest word in</em> <code>words</code> <em>that can be built one character at a time by other words in</em> <code>words</code>.</p>\n\n<p>If there is more than one possible answer, return the longest word with the smallest lexicographical order. If there is no answer, return the empty string.</p>\n\n<p>Note that the word should be built from left to right with each additional character being added to the end of a previous word.&nbsp;</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> words = [&quot;w&quot;,&quot;wo&quot;,&quot;wor&quot;,&quot;worl&quot;,&quot;world&quot;]\n<strong>Output:</strong> &quot;world&quot;\n<strong>Explanation:</strong> The word &quot;world&quot; can be built one character at a time by &quot;w&quot;, &quot;wo&quot;, &quot;wor&quot;, and &quot;worl&quot;.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> words = [&quot;a&quot;,&quot;banana&quot;,&quot;app&quot;,&quot;appl&quot;,&quot;ap&quot;,&quot;apply&quot;,&quot;apple&quot;]\n<strong>Output:</strong> &quot;apple&quot;\n<strong>Explanation:</strong> Both &quot;apply&quot; and &quot;apple&quot; can be built from other words in the dictionary. However, &quot;apple&quot; is lexicographically smaller than &quot;apply&quot;.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= words.length &lt;= 1000</code></li>\n\t<li><code>1 &lt;= words[i].length &lt;= 30</code></li>\n\t<li><code>words[i]</code> consists of lowercase English letters.</li>\n</ul>\n",
      "lcSlug": "longest-word-in-dictionary",
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
      "description": "You are given an array of strings `products` and a string `searchWord`.\n\nDesign a system that suggests at most three product names from `products` after each character of `searchWord` is typed. Suggested products should have common prefix with `searchWord`. If there are more than three products with a common prefix return the three lexicographically minimums products.\n\nReturn a list of lists of the suggested products after each character of `searchWord` is typed.\n\n \n\nExample 1:\n\nInput: products = [\"mobile\",\"mouse\",\"moneypot\",\"monitor\",\"mousepad\"], searchWord = \"mouse\"\nOutput: [[\"mobile\",\"moneypot\",\"monitor\"],[\"mobile\",\"moneypot\",\"monitor\"],[\"mouse\",\"mousepad\"],[\"mouse\",\"mousepad\"],[\"mouse\",\"mousepad\"]]\nExplanation: products sorted lexicographically = [\"mobile\",\"moneypot\",\"monitor\",\"mouse\",\"mousepad\"].\nAfter typing m and mo all products match and we show user [\"mobile\",\"moneypot\",\"monitor\"].\nAfter typing mou, mous and mouse the system suggests [\"mouse\",\"mousepad\"].\n\nExample 2:\n\nInput: products = [\"havana\"], searchWord = \"havana\"\nOutput: [[\"havana\"],[\"havana\"],[\"havana\"],[\"havana\"],[\"havana\"],[\"havana\"]]\nExplanation: The only word \"havana\" will be always suggested while typing the search word.\n\n \n\nConstraints:\n\n\t• `1 4`\n• All the strings of `products` are unique.\n• `products[i]` consists of lowercase English letters.\n• `1",
      "descriptionHtml": "<p>You are given an array of strings <code>products</code> and a string <code>searchWord</code>.</p>\n\n<p>Design a system that suggests at most three product names from <code>products</code> after each character of <code>searchWord</code> is typed. Suggested products should have common prefix with <code>searchWord</code>. If there are more than three products with a common prefix return the three lexicographically minimums products.</p>\n\n<p>Return <em>a list of lists of the suggested products after each character of </em><code>searchWord</code><em> is typed</em>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> products = [&quot;mobile&quot;,&quot;mouse&quot;,&quot;moneypot&quot;,&quot;monitor&quot;,&quot;mousepad&quot;], searchWord = &quot;mouse&quot;\n<strong>Output:</strong> [[&quot;mobile&quot;,&quot;moneypot&quot;,&quot;monitor&quot;],[&quot;mobile&quot;,&quot;moneypot&quot;,&quot;monitor&quot;],[&quot;mouse&quot;,&quot;mousepad&quot;],[&quot;mouse&quot;,&quot;mousepad&quot;],[&quot;mouse&quot;,&quot;mousepad&quot;]]\n<strong>Explanation:</strong> products sorted lexicographically = [&quot;mobile&quot;,&quot;moneypot&quot;,&quot;monitor&quot;,&quot;mouse&quot;,&quot;mousepad&quot;].\nAfter typing m and mo all products match and we show user [&quot;mobile&quot;,&quot;moneypot&quot;,&quot;monitor&quot;].\nAfter typing mou, mous and mouse the system suggests [&quot;mouse&quot;,&quot;mousepad&quot;].\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> products = [&quot;havana&quot;], searchWord = &quot;havana&quot;\n<strong>Output:</strong> [[&quot;havana&quot;],[&quot;havana&quot;],[&quot;havana&quot;],[&quot;havana&quot;],[&quot;havana&quot;],[&quot;havana&quot;]]\n<strong>Explanation:</strong> The only word &quot;havana&quot; will be always suggested while typing the search word.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= products.length &lt;= 1000</code></li>\n\t<li><code>1 &lt;= products[i].length &lt;= 3000</code></li>\n\t<li><code>1 &lt;= sum(products[i].length) &lt;= 2 * 10<sup>4</sup></code></li>\n\t<li>All the strings of <code>products</code> are <strong>unique</strong>.</li>\n\t<li><code>products[i]</code> consists of lowercase English letters.</li>\n\t<li><code>1 &lt;= searchWord.length &lt;= 1000</code></li>\n\t<li><code>searchWord</code> consists of lowercase English letters.</li>\n</ul>\n",
      "lcSlug": "search-suggestions-system",
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
      "description": "Given an integer array `nums`, return the maximum result of `nums[i] XOR nums[j]`, where `0 Example 1:\n\nInput: nums = [3,10,5,25,2,8]\nOutput: 28\nExplanation: The maximum result is 5 XOR 25 = 28.\n\nExample 2:\n\nInput: nums = [14,70,53,83,49,91,36,80,92,51,66,70]\nOutput: 127\n\n \n\nConstraints:\n\n\t• `1 5`\n• `0 31 - 1`",
      "descriptionHtml": "<p>Given an integer array <code>nums</code>, return <em>the maximum result of </em><code>nums[i] XOR nums[j]</code>, where <code>0 &lt;= i &lt;= j &lt; n</code>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [3,10,5,25,2,8]\n<strong>Output:</strong> 28\n<strong>Explanation:</strong> The maximum result is 5 XOR 25 = 28.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [14,70,53,83,49,91,36,80,92,51,66,70]\n<strong>Output:</strong> 127\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= nums.length &lt;= 2 * 10<sup>5</sup></code></li>\n\t<li><code>0 &lt;= nums[i] &lt;= 2<sup>31</sup> - 1</code></li>\n</ul>\n",
      "lcSlug": "maximum-xor-of-two-numbers-in-an-array",
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
      "description": "Given an array of strings `words` (without duplicates), return all the concatenated words in the given list of `words`.\n\nA concatenated word is defined as a string that is comprised entirely of at least two shorter words (not necessarily distinct) in the given array.\n\n \n\nExample 1:\n\nInput: words = [\"cat\",\"cats\",\"catsdogcats\",\"dog\",\"dogcatsdog\",\"hippopotamuses\",\"rat\",\"ratcatdogcat\"]\nOutput: [\"catsdogcats\",\"dogcatsdog\",\"ratcatdogcat\"]\nExplanation: \"catsdogcats\" can be concatenated by \"cats\", \"dog\" and \"cats\"; \n\"dogcatsdog\" can be concatenated by \"dog\", \"cats\" and \"dog\"; \n\"ratcatdogcat\" can be concatenated by \"rat\", \"cat\", \"dog\" and \"cat\".\n\nExample 2:\n\nInput: words = [\"cat\",\"dog\",\"catdog\"]\nOutput: [\"catdog\"]\n\n \n\nConstraints:\n\n\t• `1 4`\n• `1 5`",
      "descriptionHtml": "<p>Given an array of strings <code>words</code> (<strong>without duplicates</strong>), return <em>all the <strong>concatenated words</strong> in the given list of</em> <code>words</code>.</p>\n\n<p>A <strong>concatenated word</strong> is defined as a string that is comprised entirely of at least two shorter words (not necessarily distinct)&nbsp;in the given array.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> words = [&quot;cat&quot;,&quot;cats&quot;,&quot;catsdogcats&quot;,&quot;dog&quot;,&quot;dogcatsdog&quot;,&quot;hippopotamuses&quot;,&quot;rat&quot;,&quot;ratcatdogcat&quot;]\n<strong>Output:</strong> [&quot;catsdogcats&quot;,&quot;dogcatsdog&quot;,&quot;ratcatdogcat&quot;]\n<strong>Explanation:</strong> &quot;catsdogcats&quot; can be concatenated by &quot;cats&quot;, &quot;dog&quot; and &quot;cats&quot;; \n&quot;dogcatsdog&quot; can be concatenated by &quot;dog&quot;, &quot;cats&quot; and &quot;dog&quot;; \n&quot;ratcatdogcat&quot; can be concatenated by &quot;rat&quot;, &quot;cat&quot;, &quot;dog&quot; and &quot;cat&quot;.</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> words = [&quot;cat&quot;,&quot;dog&quot;,&quot;catdog&quot;]\n<strong>Output:</strong> [&quot;catdog&quot;]\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= words.length &lt;= 10<sup>4</sup></code></li>\n\t<li><code>1 &lt;= words[i].length &lt;= 30</code></li>\n\t<li><code>words[i]</code> consists of only lowercase English letters.</li>\n\t<li>All the strings of <code>words</code> are <strong>unique</strong>.</li>\n\t<li><code>1 &lt;= sum(words[i].length) &lt;= 10<sup>5</sup></code></li>\n</ul>\n",
      "lcSlug": "concatenated-words",
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
      "description": "You are given a 0-indexed array of unique strings `words`.\n\nA palindrome pair is a pair of integers `(i, j)` such that:\n\n\t• `0 palindrome.\n\nReturn an array of all the palindrome pairs of `words`.\n\nYou must write an algorithm with `O(sum of words[i].length)` runtime complexity.\n\n \n\nExample 1:\n\nInput: words = [\"abcd\",\"dcba\",\"lls\",\"s\",\"sssll\"]\nOutput: [[0,1],[1,0],[3,2],[2,4]]\nExplanation: The palindromes are [\"abcddcba\",\"dcbaabcd\",\"slls\",\"llssssll\"]\n\nExample 2:\n\nInput: words = [\"bat\",\"tab\",\"cat\"]\nOutput: [[0,1],[1,0]]\nExplanation: The palindromes are [\"battab\",\"tabbat\"]\n\nExample 3:\n\nInput: words = [\"a\",\"\"]\nOutput: [[0,1],[1,0]]\nExplanation: The palindromes are [\"a\",\"a\"]\n\n \n\nConstraints:\n\n\t• `1",
      "descriptionHtml": "<p>You are given a <strong>0-indexed</strong> array of <strong>unique</strong> strings <code>words</code>.</p>\n\n<p>A <strong>palindrome pair</strong> is a pair of integers <code>(i, j)</code> such that:</p>\n\n<ul>\n\t<li><code>0 &lt;= i, j &lt; words.length</code>,</li>\n\t<li><code>i != j</code>, and</li>\n\t<li><code>words[i] + words[j]</code> (the concatenation of the two strings) is a <span data-keyword=\"palindrome-string\">palindrome</span>.</li>\n</ul>\n\n<p>Return <em>an array of all the <strong>palindrome pairs</strong> of </em><code>words</code>.</p>\n\n<p>You must write an algorithm with&nbsp;<code>O(sum of words[i].length)</code>&nbsp;runtime complexity.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> words = [&quot;abcd&quot;,&quot;dcba&quot;,&quot;lls&quot;,&quot;s&quot;,&quot;sssll&quot;]\n<strong>Output:</strong> [[0,1],[1,0],[3,2],[2,4]]\n<strong>Explanation:</strong> The palindromes are [&quot;abcddcba&quot;,&quot;dcbaabcd&quot;,&quot;slls&quot;,&quot;llssssll&quot;]\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> words = [&quot;bat&quot;,&quot;tab&quot;,&quot;cat&quot;]\n<strong>Output:</strong> [[0,1],[1,0]]\n<strong>Explanation:</strong> The palindromes are [&quot;battab&quot;,&quot;tabbat&quot;]\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> words = [&quot;a&quot;,&quot;&quot;]\n<strong>Output:</strong> [[0,1],[1,0]]\n<strong>Explanation:</strong> The palindromes are [&quot;a&quot;,&quot;a&quot;]\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= words.length &lt;= 5000</code></li>\n\t<li><code>0 &lt;= words[i].length &lt;= 300</code></li>\n\t<li><code>words[i]</code> consists of lowercase English letters.</li>\n</ul>\n",
      "lcSlug": "palindrome-pairs",
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
      "description": "Given a string `s` and a dictionary of strings `wordDict`, add spaces in `s` to construct a sentence where each word is a valid dictionary word. Return all such possible sentences in any order.\n\nNote that the same word in the dictionary may be reused multiple times in the segmentation.\n\n \n\nExample 1:\n\nInput: s = \"catsanddog\", wordDict = [\"cat\",\"cats\",\"and\",\"sand\",\"dog\"]\nOutput: [\"cats and dog\",\"cat sand dog\"]\n\nExample 2:\n\nInput: s = \"pineapplepenapple\", wordDict = [\"apple\",\"pen\",\"applepen\",\"pine\",\"pineapple\"]\nOutput: [\"pine apple pen apple\",\"pineapple pen apple\",\"pine applepen apple\"]\nExplanation: Note that you are allowed to reuse a dictionary word.\n\nExample 3:\n\nInput: s = \"catsandog\", wordDict = [\"cats\",\"dog\",\"sand\",\"and\",\"cat\"]\nOutput: []\n\n \n\nConstraints:\n\n\t• `1 5.",
      "descriptionHtml": "<p>Given a string <code>s</code> and a dictionary of strings <code>wordDict</code>, add spaces in <code>s</code> to construct a sentence where each word is a valid dictionary word. Return all such possible sentences in <strong>any order</strong>.</p>\n\n<p><strong>Note</strong> that the same word in the dictionary may be reused multiple times in the segmentation.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> s = &quot;catsanddog&quot;, wordDict = [&quot;cat&quot;,&quot;cats&quot;,&quot;and&quot;,&quot;sand&quot;,&quot;dog&quot;]\n<strong>Output:</strong> [&quot;cats and dog&quot;,&quot;cat sand dog&quot;]\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> s = &quot;pineapplepenapple&quot;, wordDict = [&quot;apple&quot;,&quot;pen&quot;,&quot;applepen&quot;,&quot;pine&quot;,&quot;pineapple&quot;]\n<strong>Output:</strong> [&quot;pine apple pen apple&quot;,&quot;pineapple pen apple&quot;,&quot;pine applepen apple&quot;]\n<strong>Explanation:</strong> Note that you are allowed to reuse a dictionary word.\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> s = &quot;catsandog&quot;, wordDict = [&quot;cats&quot;,&quot;dog&quot;,&quot;sand&quot;,&quot;and&quot;,&quot;cat&quot;]\n<strong>Output:</strong> []\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= s.length &lt;= 20</code></li>\n\t<li><code>1 &lt;= wordDict.length &lt;= 1000</code></li>\n\t<li><code>1 &lt;= wordDict[i].length &lt;= 10</code></li>\n\t<li><code>s</code> and <code>wordDict[i]</code> consist of only lowercase English letters.</li>\n\t<li>All the strings of <code>wordDict</code> are <strong>unique</strong>.</li>\n\t<li>Input is generated in a way that the length of the answer doesn&#39;t exceed&nbsp;10<sup>5</sup>.</li>\n</ul>\n",
      "lcSlug": "word-break-ii",
      "summary": "DP + backtrack — state invariant, then loop."
    },
    {
      "id": "try-12",
      "title": "Prefix and Suffix Search",
      "lc": 745,
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
      "description": "Design a special dictionary that searches the words in it by a prefix and a suffix.\n\nImplement the WordFilter class:\n\n\tWordFilter(string[] words) Initializes the object with the words in the dictionary.\n\tf(string pref, string suff) Returns the index of the word in the dictionary, which has the prefix pref and the suffix suff. If there is more than one valid index, return the largest of them. If there is no such word in the dictionary, return -1.\n\n&nbsp;\n\nExample 1:\n\nInput\n[&quot;WordFilter&quot;, &quot;f&quot;]\n[[[&quot;apple&quot;]], [&quot;a&quot;, &quot;e&quot;]]\nOutput\n[null, 0]\nExplanation\nWordFilter wordFilter = new WordFilter([&quot;apple&quot;]);\nwordFilter.f(&quot;a&quot;, &quot;e&quot;); // return 0, because the word at index 0 has prefix = &quot;a&quot; and suffix = &quot;e&quot;.\n\n&nbsp;\n\nConstraints:\n\n\t1 &lt;= words.length &lt;= 104\n\t1 &lt;= words[i].length &lt;= 7\n\t1 &lt;= pref.length, suff.length &lt;= 7\n\twords[i], pref and suff consist of lowercase English letters only.\n\tAt most 104 calls will be made to the function f.",
      "descriptionHtml": "<p>Design a special dictionary that searches the words in it by a prefix and a suffix.</p>\n\n<p>Implement the <code>WordFilter</code> class:</p>\n\n<ul>\n\t<li><code>WordFilter(string[] words)</code> Initializes the object with the <code>words</code> in the dictionary.</li>\n\t<li><code>f(string pref, string suff)</code> Returns <em>the index of the word in the dictionary,</em> which has the prefix <code>pref</code> and the suffix <code>suff</code>. If there is more than one valid index, return <strong>the largest</strong> of them. If there is no such word in the dictionary, return <code>-1</code>.</li>\n</ul>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input</strong>\n[&quot;WordFilter&quot;, &quot;f&quot;]\n[[[&quot;apple&quot;]], [&quot;a&quot;, &quot;e&quot;]]\n<strong>Output</strong>\n[null, 0]\n<strong>Explanation</strong>\nWordFilter wordFilter = new WordFilter([&quot;apple&quot;]);\nwordFilter.f(&quot;a&quot;, &quot;e&quot;); // return 0, because the word at index 0 has prefix = &quot;a&quot; and suffix = &quot;e&quot;.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= words.length &lt;= 10<sup>4</sup></code></li>\n\t<li><code>1 &lt;= words[i].length &lt;= 7</code></li>\n\t<li><code>1 &lt;= pref.length, suff.length &lt;= 7</code></li>\n\t<li><code>words[i]</code>, <code>pref</code> and <code>suff</code> consist of lowercase English letters only.</li>\n\t<li>At most <code>10<sup>4</sup></code> calls will be made to the function <code>f</code>.</li>\n</ul>\n",
      "lcSlug": "prefix-and-suffix-search",
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
      "description": "Design a search autocomplete system for a search engine. Users may input a sentence (at least one word and end with a special character `'#'`).\n\nYou are given a string array `sentences` and an integer array `times` both of length `n` where `sentences[i]` is a previously typed sentence and `times[i]` is the corresponding number of times the sentence was typed. For each input character except `'#'`, return the top `3` historical hot sentences that have the same prefix as the part of the sentence already typed.\n\nHere are the specific rules:\n\n\t• The hot degree for a sentence is defined as the number of times a user typed the exactly same sentence before.\n• The returned top `3` hot sentences should be sorted by hot degree (The first is the hottest one). If several sentences have the same hot degree, use ASCII-code order (smaller one appears first).\n• If less than `3` hot sentences exist, return as many as you can.\n• When the input is a special character, it means the sentence ends, and in this case, you need to return an empty list.\n\nImplement the `AutocompleteSystem` class:\n\n\t• `AutocompleteSystem(String[] sentences, int[] times)` Initializes the object with the `sentences` and `times` arrays.\n• `List input(char c)` This indicates that the user typed the character `c`.\n\t\n\t\t• Returns an empty array `[]` if `c == '#'` and stores the inputted sentence in the system.\n• Returns the top `3` historical hot sentences that have the same prefix as the part of the sentence already typed. If there are fewer than `3` matches, return them all.\n\n\t\n\n&nbsp;\n\nExample 1:\n\nInput\n[\"AutocompleteSystem\", \"input\", \"input\", \"input\", \"input\"]\n[[[\"i love you\", \"island\", \"iroman\", \"i love leetcode\"], [5, 3, 2, 2]], [\"i\"], [\" \"], [\"a\"], [\"#\"]]\nOutput\n[null, [\"i love you\", \"island\", \"i love leetcode\"], [\"i love you\", \"i love leetcode\"], [], []]\n\nExplanation\nAutocompleteSystem obj = new AutocompleteSystem([\"i love you\", \"island\", \"iroman\", \"i love leetcode\"], [5, 3, 2, 2]);\nobj.input(\"i\"); // return [\"i love you\", \"island\", \"i love leetcode\"]. There are four sentences that have prefix \"i\". Among them, \"ironman\" and \"i love leetcode\" have same hot degree. Since ' ' has ASCII code 32 and 'r' has ASCII code 114, \"i love leetcode\" should be in front of \"ironman\". Also we only need to output top 3 hot sentences, so \"ironman\" will be ignored.\nobj.input(\" \"); // return [\"i love you\", \"i love leetcode\"]. There are only two sentences that have prefix \"i \".\nobj.input(\"a\"); // return []. There are no sentences that have prefix \"i a\".\nobj.input(\"#\"); // return []. The user finished the input, the sentence \"i a\" should be saved as a historical sentence in system. And the following input will be counted as a new search.\n\n&nbsp;\n\nConstraints:\n\n\t• `n == sentences.length`\n• `n == times.length`\n• `1",
      "descriptionHtml": "<p>Design a search autocomplete system for a search engine. Users may input a sentence (at least one word and end with a special character <code>&#39;#&#39;</code>).</p>\n\n<p>You are given a string array <code>sentences</code> and an integer array <code>times</code> both of length <code>n</code> where <code>sentences[i]</code> is a previously typed sentence and <code>times[i]</code> is the corresponding number of times the sentence was typed. For each input character except <code>&#39;#&#39;</code>, return the top <code>3</code> historical hot sentences that have the same prefix as the part of the sentence already typed.</p>\n\n<p>Here are the specific rules:</p>\n\n<ul>\n\t<li>The hot degree for a sentence is defined as the number of times a user typed the exactly same sentence before.</li>\n\t<li>The returned top <code>3</code> hot sentences should be sorted by hot degree (The first is the hottest one). If several sentences have the same hot degree, use ASCII-code order (smaller one appears first).</li>\n\t<li>If less than <code>3</code> hot sentences exist, return as many as you can.</li>\n\t<li>When the input is a special character, it means the sentence ends, and in this case, you need to return an empty list.</li>\n</ul>\n\n<p>Implement the <code>AutocompleteSystem</code> class:</p>\n\n<ul>\n\t<li><code>AutocompleteSystem(String[] sentences, int[] times)</code> Initializes the object with the <code>sentences</code> and <code>times</code> arrays.</li>\n\t<li><code>List<String> input(char c)</code> This indicates that the user typed the character <code>c</code>.\n\t<ul>\n\t\t<li>Returns an empty array <code>[]</code> if <code>c == &#39;#&#39;</code> and stores the inputted sentence in the system.</li>\n\t\t<li>Returns the top <code>3</code> historical hot sentences that have the same prefix as the part of the sentence already typed. If there are fewer than <code>3</code> matches, return them all.</li>\n\t</ul>\n\t</li>\n</ul>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input</strong>\n[&quot;AutocompleteSystem&quot;, &quot;input&quot;, &quot;input&quot;, &quot;input&quot;, &quot;input&quot;]\n[[[&quot;i love you&quot;, &quot;island&quot;, &quot;iroman&quot;, &quot;i love leetcode&quot;], [5, 3, 2, 2]], [&quot;i&quot;], [&quot; &quot;], [&quot;a&quot;], [&quot;#&quot;]]\n<strong>Output</strong>\n[null, [&quot;i love you&quot;, &quot;island&quot;, &quot;i love leetcode&quot;], [&quot;i love you&quot;, &quot;i love leetcode&quot;], [], []]\n\n<strong>Explanation</strong>\nAutocompleteSystem obj = new AutocompleteSystem([&quot;i love you&quot;, &quot;island&quot;, &quot;iroman&quot;, &quot;i love leetcode&quot;], [5, 3, 2, 2]);\nobj.input(&quot;i&quot;); // return [&quot;i love you&quot;, &quot;island&quot;, &quot;i love leetcode&quot;]. There are four sentences that have prefix &quot;i&quot;. Among them, &quot;ironman&quot; and &quot;i love leetcode&quot; have same hot degree. Since &#39; &#39; has ASCII code 32 and &#39;r&#39; has ASCII code 114, &quot;i love leetcode&quot; should be in front of &quot;ironman&quot;. Also we only need to output top 3 hot sentences, so &quot;ironman&quot; will be ignored.\nobj.input(&quot; &quot;); // return [&quot;i love you&quot;, &quot;i love leetcode&quot;]. There are only two sentences that have prefix &quot;i &quot;.\nobj.input(&quot;a&quot;); // return []. There are no sentences that have prefix &quot;i a&quot;.\nobj.input(&quot;#&quot;); // return []. The user finished the input, the sentence &quot;i a&quot; should be saved as a historical sentence in system. And the following input will be counted as a new search.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>n == sentences.length</code></li>\n\t<li><code>n == times.length</code></li>\n\t<li><code>1 <= n <= 100</code></li>\n\t<li><code>1 <= sentences[i].length <= 100</code></li>\n\t<li><code>1 <= times[i] <= 50</code></li>\n\t<li><code>c</code> is a lowercase English letter, a hash <code>&#39;#&#39;</code>, or space <code>&#39; &#39;</code>.</li>\n\t<li>Each tested sentence will be a sequence of characters <code>c</code> that end with the character <code>&#39;#&#39;</code>.</li>\n\t<li>Each tested sentence will have a length in the range <code>[1, 200]</code>.</li>\n\t<li>The words in each input sentence are separated by single spaces.</li>\n\t<li>At most <code>5000</code> calls will be made to <code>input</code>.</li>\n</ul>",
      "lcSlug": "design-search-autocomplete-system",
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
      "description": "Design an algorithm that accepts a stream of characters and checks if a suffix of these characters is a string of a given array of strings `words`.\n\nFor example, if `words = [\"abc\", \"xyz\"]` and the stream added the four characters (one by one) `'a'`, `'x'`, `'y'`, and `'z'`, your algorithm should detect that the suffix `\"xyz\"` of the characters `\"axyz\"` matches `\"xyz\"` from `words`.\n\nImplement the `StreamChecker` class:\n\n\t• `StreamChecker(String[] words)` Initializes the object with the strings array `words`.\n• `boolean query(char letter)` Accepts a new character from the stream and returns `true` if any non-empty suffix from the stream forms a word that is in `words`.\n\n \n\nExample 1:\n\nInput\n[\"StreamChecker\", \"query\", \"query\", \"query\", \"query\", \"query\", \"query\", \"query\", \"query\", \"query\", \"query\", \"query\", \"query\"]\n[[[\"cd\", \"f\", \"kl\"]], [\"a\"], [\"b\"], [\"c\"], [\"d\"], [\"e\"], [\"f\"], [\"g\"], [\"h\"], [\"i\"], [\"j\"], [\"k\"], [\"l\"]]\nOutput\n[null, false, false, false, true, false, true, false, false, false, false, false, true]\n\nExplanation\nStreamChecker streamChecker = new StreamChecker([\"cd\", \"f\", \"kl\"]);\nstreamChecker.query(\"a\"); // return False\nstreamChecker.query(\"b\"); // return False\nstreamChecker.query(\"c\"); // return False\nstreamChecker.query(\"d\"); // return True, because 'cd' is in the wordlist\nstreamChecker.query(\"e\"); // return False\nstreamChecker.query(\"f\"); // return True, because 'f' is in the wordlist\nstreamChecker.query(\"g\"); // return False\nstreamChecker.query(\"h\"); // return False\nstreamChecker.query(\"i\"); // return False\nstreamChecker.query(\"j\"); // return False\nstreamChecker.query(\"k\"); // return False\nstreamChecker.query(\"l\"); // return True, because 'kl' is in the wordlist\n\n \n\nConstraints:\n\n\t• `1 4` calls will be made to query.",
      "descriptionHtml": "<p>Design an algorithm that accepts a stream of characters and checks if a suffix of these characters is a string of a given array of strings <code>words</code>.</p>\n\n<p>For example, if <code>words = [&quot;abc&quot;, &quot;xyz&quot;]</code>&nbsp;and the stream added the four characters (one by one) <code>&#39;a&#39;</code>, <code>&#39;x&#39;</code>, <code>&#39;y&#39;</code>, and <code>&#39;z&#39;</code>, your algorithm should detect that the suffix <code>&quot;xyz&quot;</code> of the characters <code>&quot;axyz&quot;</code> matches <code>&quot;xyz&quot;</code> from <code>words</code>.</p>\n\n<p>Implement the <code>StreamChecker</code> class:</p>\n\n<ul>\n\t<li><code>StreamChecker(String[] words)</code> Initializes the object with the strings array <code>words</code>.</li>\n\t<li><code>boolean query(char letter)</code> Accepts a new character from the stream and returns <code>true</code> if any non-empty suffix from the stream forms a word that is in <code>words</code>.</li>\n</ul>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input</strong>\n[&quot;StreamChecker&quot;, &quot;query&quot;, &quot;query&quot;, &quot;query&quot;, &quot;query&quot;, &quot;query&quot;, &quot;query&quot;, &quot;query&quot;, &quot;query&quot;, &quot;query&quot;, &quot;query&quot;, &quot;query&quot;, &quot;query&quot;]\n[[[&quot;cd&quot;, &quot;f&quot;, &quot;kl&quot;]], [&quot;a&quot;], [&quot;b&quot;], [&quot;c&quot;], [&quot;d&quot;], [&quot;e&quot;], [&quot;f&quot;], [&quot;g&quot;], [&quot;h&quot;], [&quot;i&quot;], [&quot;j&quot;], [&quot;k&quot;], [&quot;l&quot;]]\n<strong>Output</strong>\n[null, false, false, false, true, false, true, false, false, false, false, false, true]\n\n<strong>Explanation</strong>\nStreamChecker streamChecker = new StreamChecker([&quot;cd&quot;, &quot;f&quot;, &quot;kl&quot;]);\nstreamChecker.query(&quot;a&quot;); // return False\nstreamChecker.query(&quot;b&quot;); // return False\nstreamChecker.query(&quot;c&quot;); // return False\nstreamChecker.query(&quot;d&quot;); // return True, because &#39;cd&#39; is in the wordlist\nstreamChecker.query(&quot;e&quot;); // return False\nstreamChecker.query(&quot;f&quot;); // return True, because &#39;f&#39; is in the wordlist\nstreamChecker.query(&quot;g&quot;); // return False\nstreamChecker.query(&quot;h&quot;); // return False\nstreamChecker.query(&quot;i&quot;); // return False\nstreamChecker.query(&quot;j&quot;); // return False\nstreamChecker.query(&quot;k&quot;); // return False\nstreamChecker.query(&quot;l&quot;); // return True, because &#39;kl&#39; is in the wordlist\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= words.length &lt;= 2000</code></li>\n\t<li><code>1 &lt;= words[i].length &lt;= 200</code></li>\n\t<li><code>words[i]</code> consists of lowercase English letters.</li>\n\t<li><code>letter</code> is a lowercase English letter.</li>\n\t<li>At most <code>4 * 10<sup>4</sup></code> calls will be made to query.</li>\n</ul>\n",
      "lcSlug": "stream-of-characters",
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
      "description": "Given a string `text` and an array of strings `words`, return an array of all index pairs `[i, j]` so that the substring `text[i...j]` is in `words`.\n\nReturn the pairs `[i, j]` in sorted order (i.e., sort them by their first coordinate, and in case of ties sort them by their second coordinate).\n\n&nbsp;\n\nExample 1:\n\nInput: text = \"thestoryofleetcodeandme\", words = [\"story\",\"fleet\",\"leetcode\"]\nOutput: [[3,7],[9,13],[10,17]]\n\nExample 2:\n\nInput: text = \"ababa\", words = [\"aba\",\"ab\"]\nOutput: [[0,1],[0,2],[2,3],[2,4]]\nExplanation: Notice that matches can overlap, see \"aba\" is found in [0,2] and [2,4].\n\n&nbsp;\n\nConstraints:\n\n\t• `1",
      "descriptionHtml": "<p>Given a string <code>text</code> and an array of strings <code>words</code>, return <em>an array of all index pairs </em><code>[i, j]</code><em> so that the substring </em><code>text[i...j]</code><em> is in <code>words</code></em>.</p>\n\n<p>Return the pairs <code>[i, j]</code> in sorted order (i.e., sort them by their first coordinate, and in case of ties sort them by their second coordinate).</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> text = &quot;thestoryofleetcodeandme&quot;, words = [&quot;story&quot;,&quot;fleet&quot;,&quot;leetcode&quot;]\n<strong>Output:</strong> [[3,7],[9,13],[10,17]]\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> text = &quot;ababa&quot;, words = [&quot;aba&quot;,&quot;ab&quot;]\n<strong>Output:</strong> [[0,1],[0,2],[2,3],[2,4]]\n<strong>Explanation:</strong> Notice that matches can overlap, see &quot;aba&quot; is found in [0,2] and [2,4].\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 <= text.length <= 100</code></li>\n\t<li><code>1 <= words.length <= 20</code></li>\n\t<li><code>1 <= words[i].length <= 50</code></li>\n\t<li><code>text</code> and <code>words[i]</code> consist of lowercase English letters.</li>\n\t<li>All the strings of <code>words</code> are <strong>unique</strong>.</li>\n</ul>",
      "lcSlug": "index-pairs-of-a-string",
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
      "description": "Given an integer array `nums` and two integers `k` and `p`, return the number of distinct subarrays, which have at most `k` elements that are divisible by `p`.\n\nTwo arrays `nums1` and `nums2` are said to be distinct if:\n\n\t• They are of different lengths, or\n• There exists at least one index `i` where `nums1[i] != nums2[i]`.\n\nA subarray is defined as a non-empty contiguous sequence of elements in an array.\n\n \n\nExample 1:\n\nInput: nums = [2,3,3,2,2], k = 2, p = 2\nOutput: 11\nExplanation:\nThe elements at indices 0, 3, and 4 are divisible by p = 2.\nThe 11 distinct subarrays which have at most k = 2 elements divisible by 2 are:\n[2], [2,3], [2,3,3], [2,3,3,2], [3], [3,3], [3,3,2], [3,3,2,2], [3,2], [3,2,2], and [2,2].\nNote that the subarrays [2] and [3] occur more than once in nums, but they should each be counted only once.\nThe subarray [2,3,3,2,2] should not be counted because it has 3 elements that are divisible by 2.\n\nExample 2:\n\nInput: nums = [1,2,3,4], k = 4, p = 1\nOutput: 10\nExplanation:\nAll element of nums are divisible by p = 1.\nAlso, every subarray of nums will have at most 4 elements that are divisible by 1.\nSince all subarrays are distinct, the total number of subarrays satisfying all the constraints is 10.\n\n \n\nConstraints:\n\n\t• `1 \n\n \n\nFollow up:\n\nCan you solve this problem in O(n2) time complexity?",
      "descriptionHtml": "<p>Given an integer array <code>nums</code> and two integers <code>k</code> and <code>p</code>, return <em>the number of <strong>distinct subarrays,</strong> which have <strong>at most</strong></em> <code>k</code> <em>elements </em>that are <em>divisible by</em> <code>p</code>.</p>\n\n<p>Two arrays <code>nums1</code> and <code>nums2</code> are said to be <strong>distinct</strong> if:</p>\n\n<ul>\n\t<li>They are of <strong>different</strong> lengths, or</li>\n\t<li>There exists <strong>at least</strong> one index <code>i</code> where <code>nums1[i] != nums2[i]</code>.</li>\n</ul>\n\n<p>A <strong>subarray</strong> is defined as a <strong>non-empty</strong> contiguous sequence of elements in an array.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [<u><strong>2</strong></u>,3,3,<u><strong>2</strong></u>,<u><strong>2</strong></u>], k = 2, p = 2\n<strong>Output:</strong> 11\n<strong>Explanation:</strong>\nThe elements at indices 0, 3, and 4 are divisible by p = 2.\nThe 11 distinct subarrays which have at most k = 2 elements divisible by 2 are:\n[2], [2,3], [2,3,3], [2,3,3,2], [3], [3,3], [3,3,2], [3,3,2,2], [3,2], [3,2,2], and [2,2].\nNote that the subarrays [2] and [3] occur more than once in nums, but they should each be counted only once.\nThe subarray [2,3,3,2,2] should not be counted because it has 3 elements that are divisible by 2.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [1,2,3,4], k = 4, p = 1\n<strong>Output:</strong> 10\n<strong>Explanation:</strong>\nAll element of nums are divisible by p = 1.\nAlso, every subarray of nums will have at most 4 elements that are divisible by 1.\nSince all subarrays are distinct, the total number of subarrays satisfying all the constraints is 10.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= nums.length &lt;= 200</code></li>\n\t<li><code>1 &lt;= nums[i], p &lt;= 200</code></li>\n\t<li><code>1 &lt;= k &lt;= nums.length</code></li>\n</ul>\n\n<p>&nbsp;</p>\n<p><strong>Follow up:</strong></p>\n\n<p>Can you solve this problem in O(n<sup>2</sup>) time complexity?</p>\n",
      "lcSlug": "k-divisible-elements-subarrays",
      "summary": "Trie — Prefix tree for strings, autocomplete, or bitwise XOR walks."
    }
  ]
};
