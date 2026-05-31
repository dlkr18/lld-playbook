window.PRACTICE_TOPIC = {
  "id": "math",
  "title": "Math & Number Theory",
  "expected_count": 20,
  "strategy": "<strong>Speed-run:</strong> GCD, sieve, fast pow, modular arithmetic. Filter <em>Must do</em> first.",
  "subtopics": [
    {
      "id": "sieve",
      "label": "Sieve"
    },
    {
      "id": "gcd",
      "label": "GCD/LCM"
    },
    {
      "id": "fast-pow",
      "label": "Fast Pow"
    },
    {
      "id": "combinatorics",
      "label": "Combinatorics"
    },
    {
      "id": "geometry",
      "label": "Geometry"
    },
    {
      "id": "mod",
      "label": "Modular"
    }
  ],
  "questions": [
    {
      "id": "ma-01",
      "title": "Count Primes",
      "lc": 204,
      "importance": "must",
      "subtopic": "sieve",
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
          "name": "Sieve",
          "time": "O(n log log n)",
          "space": "O(n)",
          "code": "int countPrimes(int n) {\n    if (n<=2) return 0; vector<bool> prime(n,true); prime[0]=prime[1]=false;\n    for (int i=2;i*i<n;i++) if (prime[i]) for (int j=i*i;j<n;j+=i) prime[j]=false;\n    return count(prime.begin(), prime.end(), true);\n}"
        }
      ],
      "description": "Given an integer `n`, return the number of prime numbers that are strictly less than `n`.\n\n \n\nExample 1:\n\nInput: n = 10\nOutput: 4\nExplanation: There are 4 prime numbers less than 10, they are 2, 3, 5, 7.\n\nExample 2:\n\nInput: n = 0\nOutput: 0\n\nExample 3:\n\nInput: n = 1\nOutput: 0\n\n \n\nConstraints:\n\n\t• `0 6`",
      "descriptionHtml": "<p>Given an integer <code>n</code>, return <em>the number of prime numbers that are strictly less than</em> <code>n</code>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> n = 10\n<strong>Output:</strong> 4\n<strong>Explanation:</strong> There are 4 prime numbers less than 10, they are 2, 3, 5, 7.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> n = 0\n<strong>Output:</strong> 0\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> n = 1\n<strong>Output:</strong> 0\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>0 &lt;= n &lt;= 5 * 10<sup>6</sup></code></li>\n</ul>\n",
      "lcSlug": "count-primes",
      "summary": "Sieve — state invariant, then loop."
    },
    {
      "id": "ma-02",
      "title": "Pow(x, n)",
      "lc": 50,
      "importance": "must",
      "subtopic": "fast-pow",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "x,n",
          "out": "x^n"
        }
      ],
      "approaches": [
        {
          "name": "Fast pow",
          "time": "O(log n)",
          "space": "O(1)",
          "code": "double myPow(double x, int n) {\n    long long N = n; if (N < 0) { x = 1/x; N = -N; }\n    double ans = 1, cur = x;\n    while (N) { if (N&1) ans *= cur; cur *= cur; N >>= 1; }\n    return ans;\n}"
        }
      ],
      "description": "Implement pow(x, n), which calculates `x` raised to the power `n` (i.e., `xn`).\n\n \n\nExample 1:\n\nInput: x = 2.00000, n = 10\nOutput: 1024.00000\n\nExample 2:\n\nInput: x = 2.10000, n = 3\nOutput: 9.26100\n\nExample 3:\n\nInput: x = 2.00000, n = -2\nOutput: 0.25000\nExplanation: 2-2 = 1/22 = 1/4 = 0.25\n\n \n\nConstraints:\n\n\t• `-100.0 31 31-1`\n• `n` is an integer.\n• Either `x` is not zero or `n > 0`.\n• `-104 n 4`",
      "descriptionHtml": "<p>Implement <a href=\"http://www.cplusplus.com/reference/valarray/pow/\" target=\"_blank\">pow(x, n)</a>, which calculates <code>x</code> raised to the power <code>n</code> (i.e., <code>x<sup>n</sup></code>).</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> x = 2.00000, n = 10\n<strong>Output:</strong> 1024.00000\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> x = 2.10000, n = 3\n<strong>Output:</strong> 9.26100\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> x = 2.00000, n = -2\n<strong>Output:</strong> 0.25000\n<strong>Explanation:</strong> 2<sup>-2</sup> = 1/2<sup>2</sup> = 1/4 = 0.25\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>-100.0 &lt; x &lt; 100.0</code></li>\n\t<li><code>-2<sup>31</sup> &lt;= n &lt;= 2<sup>31</sup>-1</code></li>\n\t<li><code>n</code> is an integer.</li>\n\t<li>Either <code>x</code> is not zero or <code>n &gt; 0</code>.</li>\n\t<li><code>-10<sup>4</sup> &lt;= x<sup>n</sup> &lt;= 10<sup>4</sup></code></li>\n</ul>\n",
      "lcSlug": "powx-n",
      "summary": "Fast pow — state invariant, then loop."
    },
    {
      "id": "ma-03",
      "title": "GCD / LCM basics",
      "lc": null,
      "importance": "must",
      "subtopic": "gcd",
      "difficulty": "Easy",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "a,b",
          "out": "gcd"
        }
      ],
      "approaches": [
        {
          "name": "Euclidean GCD",
          "time": "O(log min(a,b))",
          "space": "O(1)",
          "code": "int gcd(int a, int b) {\n    while (b) { int t = a % b; a = b; b = t; }\n    return abs(a);\n}\nlong long lcm(int a, int b) {\n    return (long long)a / gcd(a, b) * b;\n}"
        }
      ],
      "description": "Given two integers a and b, compute gcd(a,b) and lcm(a,b).",
      "summary": "Euclidean gcd: while(b) a%=b swap; lcm = a/gcd * b."
    },
    {
      "id": "ma-04",
      "title": "Excel Sheet Column Title",
      "lc": 168,
      "importance": "nice",
      "subtopic": "base",
      "difficulty": "Easy",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "n",
          "out": "title"
        }
      ],
      "approaches": [
        {
          "name": "Base 26",
          "time": "O(log n)",
          "space": "O(1)",
          "code": "string convertToTitle(int n) {\n    string ans;\n    while(n){ n--; ans=char('A'+n%26)+ans; n/=26; }\n    return ans;\n}"
        }
      ],
      "description": "Given an integer `columnNumber`, return its corresponding column title as it appears in an Excel sheet.\n\nFor example:\n\nA -> 1\nB -> 2\nC -> 3\n...\nZ -> 26\nAA -> 27\nAB -> 28 \n...\n\n \n\nExample 1:\n\nInput: columnNumber = 1\nOutput: \"A\"\n\nExample 2:\n\nInput: columnNumber = 28\nOutput: \"AB\"\n\nExample 3:\n\nInput: columnNumber = 701\nOutput: \"ZY\"\n\n \n\nConstraints:\n\n\t• `1 31 - 1`",
      "descriptionHtml": "<p>Given an integer <code>columnNumber</code>, return <em>its corresponding column title as it appears in an Excel sheet</em>.</p>\n\n<p>For example:</p>\n\n<pre>\nA -&gt; 1\nB -&gt; 2\nC -&gt; 3\n...\nZ -&gt; 26\nAA -&gt; 27\nAB -&gt; 28 \n...\n</pre>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> columnNumber = 1\n<strong>Output:</strong> &quot;A&quot;\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> columnNumber = 28\n<strong>Output:</strong> &quot;AB&quot;\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> columnNumber = 701\n<strong>Output:</strong> &quot;ZY&quot;\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= columnNumber &lt;= 2<sup>31</sup> - 1</code></li>\n</ul>\n",
      "lcSlug": "excel-sheet-column-title",
      "summary": "Base 26 — state invariant, then loop."
    },
    {
      "id": "ma-05",
      "title": "Factorial Trailing Zeroes",
      "lc": 172,
      "importance": "should",
      "subtopic": "math",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "n",
          "out": "zeros"
        }
      ],
      "approaches": [
        {
          "name": "Count factors of 5",
          "time": "O(log n)",
          "space": "O(1)",
          "code": "int trailingZeroes(int n) {\n    int ans = 0;\n    for (long p = 5; p <= n; p *= 5) ans += n / p;\n    return ans;\n}"
        }
      ],
      "description": "Given an integer `n`, return the number of trailing zeroes in `n!`.\n\nNote that `n! = n * (n - 1) * (n - 2) * ... * 3 * 2 * 1`.\n\n \n\nExample 1:\n\nInput: n = 3\nOutput: 0\nExplanation: 3! = 6, no trailing zero.\n\nExample 2:\n\nInput: n = 5\nOutput: 1\nExplanation: 5! = 120, one trailing zero.\n\nExample 3:\n\nInput: n = 0\nOutput: 0\n\n \n\nConstraints:\n\n\t• `0 4`\n\n \n\nFollow up: Could you write a solution that works in logarithmic time complexity?",
      "descriptionHtml": "<p>Given an integer <code>n</code>, return <em>the number of trailing zeroes in </em><code>n!</code>.</p>\n\n<p>Note that <code>n! = n * (n - 1) * (n - 2) * ... * 3 * 2 * 1</code>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> n = 3\n<strong>Output:</strong> 0\n<strong>Explanation:</strong> 3! = 6, no trailing zero.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> n = 5\n<strong>Output:</strong> 1\n<strong>Explanation:</strong> 5! = 120, one trailing zero.\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> n = 0\n<strong>Output:</strong> 0\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>0 &lt;= n &lt;= 10<sup>4</sup></code></li>\n</ul>\n\n<p>&nbsp;</p>\n<p><strong>Follow up:</strong> Could you write a solution that works in logarithmic time complexity?</p>\n",
      "lcSlug": "factorial-trailing-zeroes",
      "summary": "Count factors of 5 — Number theory, combinatorics, or arithmetic simulation."
    },
    {
      "id": "ma-06",
      "title": "Happy Number",
      "lc": 202,
      "importance": "should",
      "subtopic": "cycle",
      "difficulty": "Easy",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "n",
          "out": "happy?"
        }
      ],
      "approaches": [
        {
          "name": "Floyd cycle on squares",
          "time": "O(log n)",
          "space": "O(1)",
          "code": "int sqSum(int n){ int s=0; while(n){ s+= (n%10)*(n%10); n/=10; } return s; }\nbool isHappy(int n) {\n    int slow=n, fast=n;\n    do { slow=sqSum(slow); fast=sqSum(sqSum(fast)); } while (slow!=fast);\n    return slow==1;\n}"
        }
      ],
      "description": "Write an algorithm to determine if a number `n` is happy.\n\nA happy number is a number defined by the following process:\n\n\t• Starting with any positive integer, replace the number by the sum of the squares of its digits.\n• Repeat the process until the number equals 1 (where it will stay), or it loops endlessly in a cycle which does not include 1.\n• Those numbers for which this process ends in 1 are happy.\n\nReturn `true` if `n` is a happy number, and `false` if not.\n\n \n\nExample 1:\n\nInput: n = 19\nOutput: true\nExplanation:\n12 + 92 = 82\n82 + 22 = 68\n62 + 82 = 100\n12 + 02 + 02 = 1\n\nExample 2:\n\nInput: n = 2\nOutput: false\n\n \n\nConstraints:\n\n\t• `1 31 - 1`",
      "descriptionHtml": "<p>Write an algorithm to determine if a number <code>n</code> is happy.</p>\n\n<p>A <strong>happy number</strong> is a number defined by the following process:</p>\n\n<ul>\n\t<li>Starting with any positive integer, replace the number by the sum of the squares of its digits.</li>\n\t<li>Repeat the process until the number equals 1 (where it will stay), or it <strong>loops endlessly in a cycle</strong> which does not include 1.</li>\n\t<li>Those numbers for which this process <strong>ends in 1</strong> are happy.</li>\n</ul>\n\n<p>Return <code>true</code> <em>if</em> <code>n</code> <em>is a happy number, and</em> <code>false</code> <em>if not</em>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> n = 19\n<strong>Output:</strong> true\n<strong>Explanation:</strong>\n1<sup>2</sup> + 9<sup>2</sup> = 82\n8<sup>2</sup> + 2<sup>2</sup> = 68\n6<sup>2</sup> + 8<sup>2</sup> = 100\n1<sup>2</sup> + 0<sup>2</sup> + 0<sup>2</sup> = 1\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> n = 2\n<strong>Output:</strong> false\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= n &lt;= 2<sup>31</sup> - 1</code></li>\n</ul>\n",
      "lcSlug": "happy-number",
      "summary": "Floyd cycle on squares — Hash set for O(1) existence — dedupe, cycle detection, or sequence starts."
    },
    {
      "id": "ma-07",
      "title": "Max Points on a Line",
      "lc": 149,
      "importance": "should",
      "subtopic": "geometry",
      "difficulty": "Hard",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "points",
          "out": "max"
        }
      ],
      "approaches": [
        {
          "name": "GCD slope map",
          "time": "O(n^2)",
          "space": "O(n)",
          "code": "int maxPoints(vector<vector<int>>& points) {\n    int n = points.size(), ans = 0;\n    for (int i = 0; i < n; i++) {\n        unordered_map<string,int> slope; int same = 1, local = 0;\n        for (int j = i+1; j < n; j++) {\n            int dx = points[j][0]-points[i][0], dy = points[j][1]-points[i][1];\n            if (!dx && !dy) { same++; continue; }\n            int g = __gcd(abs(dx), abs(dy)); dx/=g; dy/=g;\n            if (dx < 0) { dx = -dx; dy = -dy; }\n            string key = to_string(dx)+\"/\"+to_string(dy);\n            local = max(local, ++slope[key]);\n        }\n        ans = max(ans, local + same);\n    }\n    return ans;\n}"
        }
      ],
      "description": "Given an array of `points` where `points[i] = [xi, yi]` represents a point on the X-Y plane, return the maximum number of points that lie on the same straight line.\n\n \n\nExample 1:\n\nInput: points = [[1,1],[2,2],[3,3]]\nOutput: 3\n\nExample 2:\n\nInput: points = [[1,1],[3,2],[5,3],[4,1],[2,3],[1,4]]\nOutput: 4\n\n \n\nConstraints:\n\n\t• `1 4 i, yi 4`\n• All the `points` are unique.",
      "descriptionHtml": "<p>Given an array of <code>points</code> where <code>points[i] = [x<sub>i</sub>, y<sub>i</sub>]</code> represents a point on the <strong>X-Y</strong> plane, return <em>the maximum number of points that lie on the same straight line</em>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2021/02/25/plane1.jpg\" style=\"width: 300px; height: 294px;\" />\n<pre>\n<strong>Input:</strong> points = [[1,1],[2,2],[3,3]]\n<strong>Output:</strong> 3\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2021/02/25/plane2.jpg\" style=\"width: 300px; height: 294px;\" />\n<pre>\n<strong>Input:</strong> points = [[1,1],[3,2],[5,3],[4,1],[2,3],[1,4]]\n<strong>Output:</strong> 4\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= points.length &lt;= 300</code></li>\n\t<li><code>points[i].length == 2</code></li>\n\t<li><code>-10<sup>4</sup> &lt;= x<sub>i</sub>, y<sub>i</sub> &lt;= 10<sup>4</sup></code></li>\n\t<li>All the <code>points</code> are <strong>unique</strong>.</li>\n</ul>\n",
      "lcSlug": "max-points-on-a-line",
      "summary": "Normalize dx,dy by gcd; count points per slope + duplicates."
    },
    {
      "id": "ma-08",
      "title": "Pascal's Triangle",
      "lc": 118,
      "importance": "should",
      "subtopic": "combinatorics",
      "difficulty": "Easy",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "numRows",
          "out": "triangle"
        }
      ],
      "approaches": [
        {
          "name": "DP rows",
          "time": "O(n^2)",
          "space": "O(n)",
          "code": "vector<vector<int>> generate(int numRows) {\n    vector<vector<int>> ans(numRows);\n    for (int i = 0; i < numRows; i++) {\n        ans[i].resize(i+1, 1);\n        for (int j = 1; j < i; j++) ans[i][j] = ans[i-1][j-1] + ans[i-1][j];\n    }\n    return ans;\n}"
        }
      ],
      "description": "Given an integer `numRows`, return the first numRows of Pascal's triangle.\n\nIn Pascal's triangle, each number is the sum of the two numbers directly above it as shown:\n\n \n\nExample 1:\n\nInput: numRows = 5\nOutput: [[1],[1,1],[1,2,1],[1,3,3,1],[1,4,6,4,1]]\n\nExample 2:\n\nInput: numRows = 1\nOutput: [[1]]\n\n \n\nConstraints:\n\n\t• `1",
      "descriptionHtml": "<p>Given an integer <code>numRows</code>, return the first numRows of <strong>Pascal&#39;s triangle</strong>.</p>\n\n<p>In <strong>Pascal&#39;s triangle</strong>, each number is the sum of the two numbers directly above it as shown:</p>\n<img alt=\"\" src=\"https://upload.wikimedia.org/wikipedia/commons/0/0d/PascalTriangleAnimated2.gif\" style=\"height:240px; width:260px\" />\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<pre><strong>Input:</strong> numRows = 5\n<strong>Output:</strong> [[1],[1,1],[1,2,1],[1,3,3,1],[1,4,6,4,1]]\n</pre><p><strong class=\"example\">Example 2:</strong></p>\n<pre><strong>Input:</strong> numRows = 1\n<strong>Output:</strong> [[1]]\n</pre>\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= numRows &lt;= 30</code></li>\n</ul>\n",
      "lcSlug": "pascals-triangle",
      "summary": "DP rows — state invariant, then loop."
    },
    {
      "id": "ma-09",
      "title": "Permutation Sequence",
      "lc": 60,
      "importance": "nice",
      "subtopic": "combinatorics",
      "difficulty": "Hard",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "n,k",
          "out": "perm"
        }
      ],
      "approaches": [
        {
          "name": "Factorial + kth perm",
          "time": "O(n^2)",
          "space": "O(n)",
          "code": "string getPermutation(int n, int k) {\n    string s; vector<int> fact(n+1,1);\n    for(int i=1;i<=n;i++) fact[i]=fact[i-1]*i;\n    for(int i=1;i<=n;i++) s.push_back('0'+i);\n    k--; string ans;\n    for(int i=n;i>=1;i--){\n        int idx=k/fact[i-1]; ans.push_back(s[idx]); s.erase(s.begin()+idx);\n        k%=fact[i-1];\n    } return ans;\n}"
        }
      ],
      "description": "The set `[1, 2, 3, ..., n]` contains a total of `n!` unique permutations.\n\nBy listing and labeling all of the permutations in order, we get the following sequence for `n = 3`:\n\n\t• `\"123\"`\n• `\"132\"`\n• `\"213\"`\n• `\"231\"`\n• `\"312\"`\n• `\"321\"`\n\nGiven `n` and `k`, return the `kth` permutation sequence.\n\n \n\nExample 1:\n\nInput: n = 3, k = 3\nOutput: \"213\"\n\nExample 2:\n\nInput: n = 4, k = 9\nOutput: \"2314\"\n\nExample 3:\n\nInput: n = 3, k = 1\nOutput: \"123\"\n\n \n\nConstraints:\n\n\t• `1",
      "descriptionHtml": "<p>The set <code>[1, 2, 3, ...,&nbsp;n]</code> contains a total of <code>n!</code> unique permutations.</p>\n\n<p>By listing and labeling all of the permutations in order, we get the following sequence for <code>n = 3</code>:</p>\n\n<ol>\n\t<li><code>&quot;123&quot;</code></li>\n\t<li><code>&quot;132&quot;</code></li>\n\t<li><code>&quot;213&quot;</code></li>\n\t<li><code>&quot;231&quot;</code></li>\n\t<li><code>&quot;312&quot;</code></li>\n\t<li><code>&quot;321&quot;</code></li>\n</ol>\n\n<p>Given <code>n</code> and <code>k</code>, return the <code>k<sup>th</sup></code> permutation sequence.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<pre><strong>Input:</strong> n = 3, k = 3\n<strong>Output:</strong> \"213\"\n</pre><p><strong class=\"example\">Example 2:</strong></p>\n<pre><strong>Input:</strong> n = 4, k = 9\n<strong>Output:</strong> \"2314\"\n</pre><p><strong class=\"example\">Example 3:</strong></p>\n<pre><strong>Input:</strong> n = 3, k = 1\n<strong>Output:</strong> \"123\"\n</pre>\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= n &lt;= 9</code></li>\n\t<li><code>1 &lt;= k &lt;= n!</code></li>\n</ul>\n",
      "lcSlug": "permutation-sequence",
      "summary": "Factorial + kth perm — state invariant, then loop."
    },
    {
      "id": "ma-10",
      "title": "Next Permutation",
      "lc": 31,
      "importance": "should",
      "subtopic": "array",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums",
          "out": "next"
        }
      ],
      "approaches": [
        {
          "name": "Next permutation",
          "time": "O(n)",
          "space": "O(1)",
          "code": "void nextPermutation(vector<int>& nums) {\n    int i=(int)nums.size()-2;\n    while (i>=0 && nums[i]>=nums[i+1]) i--;\n    if (i>=0) { int j=(int)nums.size()-1; while (nums[j]<=nums[i]) j--; swap(nums[i],nums[j]); }\n    reverse(nums.begin()+i+1, nums.end());\n}"
        }
      ],
      "description": "A permutation of an array of integers is an arrangement of its members into a sequence or linear order.\n\n\t• For example, for `arr = [1,2,3]`, the following are all the permutations of `arr`: `[1,2,3], [1,3,2], [2, 1, 3], [2, 3, 1], [3,1,2], [3,2,1]`.\n\nThe next permutation of an array of integers is the next lexicographically greater permutation of its integer. More formally, if all the permutations of the array are sorted in one container according to their lexicographical order, then the next permutation of that array is the permutation that follows it in the sorted container. If such arrangement is not possible, the array must be rearranged as the lowest possible order (i.e., sorted in ascending order).\n\n\t• For example, the next permutation of `arr = [1,2,3]` is `[1,3,2]`.\n• Similarly, the next permutation of `arr = [2,3,1]` is `[3,1,2]`.\n• While the next permutation of `arr = [3,2,1]` is `[1,2,3]` because `[3,2,1]` does not have a lexicographical larger rearrangement.\n\nGiven an array of integers `nums`, find the next permutation of `nums`.\n\nThe replacement must be in place and use only constant extra memory.\n\n \n\nExample 1:\n\nInput: nums = [1,2,3]\nOutput: [1,3,2]\n\nExample 2:\n\nInput: nums = [3,2,1]\nOutput: [1,2,3]\n\nExample 3:\n\nInput: nums = [1,1,5]\nOutput: [1,5,1]\n\n \n\nConstraints:\n\n\t• `1",
      "descriptionHtml": "<p>A <strong>permutation</strong> of an array of integers is an arrangement of its members into a sequence or linear order.</p>\n\n<ul>\n\t<li>For example, for <code>arr = [1,2,3]</code>, the following are all the permutations of <code>arr</code>: <code>[1,2,3], [1,3,2], [2, 1, 3], [2, 3, 1], [3,1,2], [3,2,1]</code>.</li>\n</ul>\n\n<p>The <strong>next permutation</strong> of an array of integers is the next lexicographically greater permutation of its integer. More formally, if all the permutations of the array are sorted in one container according to their lexicographical order, then the <strong>next permutation</strong> of that array is the permutation that follows it in the sorted container. If such arrangement is not possible, the array must be rearranged as the lowest possible order (i.e., sorted in ascending order).</p>\n\n<ul>\n\t<li>For example, the next permutation of <code>arr = [1,2,3]</code> is <code>[1,3,2]</code>.</li>\n\t<li>Similarly, the next permutation of <code>arr = [2,3,1]</code> is <code>[3,1,2]</code>.</li>\n\t<li>While the next permutation of <code>arr = [3,2,1]</code> is <code>[1,2,3]</code> because <code>[3,2,1]</code> does not have a lexicographical larger rearrangement.</li>\n</ul>\n\n<p>Given an array of integers <code>nums</code>, <em>find the next permutation of</em> <code>nums</code>.</p>\n\n<p>The replacement must be <strong><a href=\"http://en.wikipedia.org/wiki/In-place_algorithm\" target=\"_blank\">in place</a></strong> and use only constant extra memory.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [1,2,3]\n<strong>Output:</strong> [1,3,2]\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [3,2,1]\n<strong>Output:</strong> [1,2,3]\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [1,1,5]\n<strong>Output:</strong> [1,5,1]\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= nums.length &lt;= 100</code></li>\n\t<li><code>0 &lt;= nums[i] &lt;= 100</code></li>\n</ul>\n",
      "lcSlug": "next-permutation",
      "summary": "Next permutation — state invariant, then loop."
    },
    {
      "id": "ma-11",
      "title": "Reverse Integer",
      "lc": 7,
      "importance": "should",
      "subtopic": "overflow",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "x",
          "out": "reversed"
        }
      ],
      "approaches": [
        {
          "name": "Digit reverse",
          "time": "O(log n)",
          "space": "O(1)",
          "code": "int reverse(int x) {\n    long r = 0;\n    while (x) { r = r * 10 + x % 10; x /= 10; }\n    return r < INT_MIN || r > INT_MAX ? 0 : (int)r;\n}"
        }
      ],
      "description": "Given a signed 32-bit integer `x`, return `x` with its digits reversed. If reversing `x` causes the value to go outside the signed 32-bit integer range `[-231, 231 - 1]`, then return `0`.\n\nAssume the environment does not allow you to store 64-bit integers (signed or unsigned).\n\n \n\nExample 1:\n\nInput: x = 123\nOutput: 321\n\nExample 2:\n\nInput: x = -123\nOutput: -321\n\nExample 3:\n\nInput: x = 120\nOutput: 21\n\n \n\nConstraints:\n\n\t• `-231 31 - 1`",
      "descriptionHtml": "<p>Given a signed 32-bit integer <code>x</code>, return <code>x</code><em> with its digits reversed</em>. If reversing <code>x</code> causes the value to go outside the signed 32-bit integer range <code>[-2<sup>31</sup>, 2<sup>31</sup> - 1]</code>, then return <code>0</code>.</p>\n\n<p><strong>Assume the environment does not allow you to store 64-bit integers (signed or unsigned).</strong></p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> x = 123\n<strong>Output:</strong> 321\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> x = -123\n<strong>Output:</strong> -321\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> x = 120\n<strong>Output:</strong> 21\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>-2<sup>31</sup> &lt;= x &lt;= 2<sup>31</sup> - 1</code></li>\n</ul>\n",
      "lcSlug": "reverse-integer",
      "summary": "Digit reverse — state invariant, then loop."
    },
    {
      "id": "ma-12",
      "title": "Plus One",
      "lc": 66,
      "importance": "nice",
      "subtopic": "array",
      "difficulty": "Easy",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "digits",
          "out": "plus one"
        }
      ],
      "approaches": [
        {
          "name": "Carry propagate",
          "time": "O(n)",
          "space": "O(1)",
          "code": "vector<int> plusOne(vector<int>& digits) {\n    for(int i=(int)digits.size()-1;i>=0;i--){\n        if(++digits[i]<10) return digits;\n        digits[i]=0;\n    } digits.insert(digits.begin(),1); return digits;\n}"
        }
      ],
      "description": "You are given a large integer represented as an integer array `digits`, where each `digits[i]` is the `ith` digit of the integer. The digits are ordered from most significant to least significant in left-to-right order. The large integer does not contain any leading `0`'s.\n\nIncrement the large integer by one and return the resulting array of digits.\n\n \n\nExample 1:\n\nInput: digits = [1,2,3]\nOutput: [1,2,4]\nExplanation: The array represents the integer 123.\nIncrementing by one gives 123 + 1 = 124.\nThus, the result should be [1,2,4].\n\nExample 2:\n\nInput: digits = [4,3,2,1]\nOutput: [4,3,2,2]\nExplanation: The array represents the integer 4321.\nIncrementing by one gives 4321 + 1 = 4322.\nThus, the result should be [4,3,2,2].\n\nExample 3:\n\nInput: digits = [9]\nOutput: [1,0]\nExplanation: The array represents the integer 9.\nIncrementing by one gives 9 + 1 = 10.\nThus, the result should be [1,0].\n\n \n\nConstraints:\n\n\t• `1",
      "descriptionHtml": "<p>You are given a <strong>large integer</strong> represented as an integer array <code>digits</code>, where each <code>digits[i]</code> is the <code>i<sup>th</sup></code> digit of the integer. The digits are ordered from most significant to least significant in left-to-right order. The large integer does not contain any leading <code>0</code>&#39;s.</p>\n\n<p>Increment the large integer by one and return <em>the resulting array of digits</em>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> digits = [1,2,3]\n<strong>Output:</strong> [1,2,4]\n<strong>Explanation:</strong> The array represents the integer 123.\nIncrementing by one gives 123 + 1 = 124.\nThus, the result should be [1,2,4].\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> digits = [4,3,2,1]\n<strong>Output:</strong> [4,3,2,2]\n<strong>Explanation:</strong> The array represents the integer 4321.\nIncrementing by one gives 4321 + 1 = 4322.\nThus, the result should be [4,3,2,2].\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> digits = [9]\n<strong>Output:</strong> [1,0]\n<strong>Explanation:</strong> The array represents the integer 9.\nIncrementing by one gives 9 + 1 = 10.\nThus, the result should be [1,0].\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= digits.length &lt;= 100</code></li>\n\t<li><code>0 &lt;= digits[i] &lt;= 9</code></li>\n\t<li><code>digits</code> does not contain any leading <code>0</code>&#39;s.</li>\n</ul>\n",
      "lcSlug": "plus-one",
      "summary": "Carry propagate — state invariant, then loop."
    },
    {
      "id": "ma-13",
      "title": "Multiply Strings",
      "lc": 43,
      "importance": "should",
      "subtopic": "math",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "num1,num2",
          "out": "product"
        }
      ],
      "approaches": [
        {
          "name": "Grade-school multiply",
          "time": "O(mn)",
          "space": "O(m+n)",
          "code": "string multiply(string num1, string num2) {\n    if (num1 == \"0\" || num2 == \"0\") return \"0\";\n    int m = num1.size(), n = num2.size();\n    vector<int> prod(m + n, 0);\n    for (int i = m - 1; i >= 0; i--)\n        for (int j = n - 1; j >= 0; j--) {\n            int sum = (num1[i]-'0')*(num2[j]-'0') + prod[i+j+1];\n            prod[i+j+1] = sum % 10; prod[i+j] += sum / 10;\n        }\n    string ans; int k = 0; while (k < (int)prod.size() && !prod[k]) k++;\n    for (; k < (int)prod.size(); k++) ans += char('0' + prod[k]);\n    return ans.empty() ? \"0\" : ans;\n}"
        }
      ],
      "description": "Given two non-negative integers `num1` and `num2` represented as strings, return the product of `num1` and `num2`, also represented as a string.\n\nNote: You must not use any built-in BigInteger library or convert the inputs to integer directly.\n\n \n\nExample 1:\n\nInput: num1 = \"2\", num2 = \"3\"\nOutput: \"6\"\n\nExample 2:\n\nInput: num1 = \"123\", num2 = \"456\"\nOutput: \"56088\"\n\n \n\nConstraints:\n\n\t• `1",
      "descriptionHtml": "<p>Given two non-negative integers <code>num1</code> and <code>num2</code> represented as strings, return the product of <code>num1</code> and <code>num2</code>, also represented as a string.</p>\n\n<p><strong>Note:</strong>&nbsp;You must not use any built-in BigInteger library or convert the inputs to integer directly.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<pre><strong>Input:</strong> num1 = \"2\", num2 = \"3\"\n<strong>Output:</strong> \"6\"\n</pre><p><strong class=\"example\">Example 2:</strong></p>\n<pre><strong>Input:</strong> num1 = \"123\", num2 = \"456\"\n<strong>Output:</strong> \"56088\"\n</pre>\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= num1.length, num2.length &lt;= 200</code></li>\n\t<li><code>num1</code> and <code>num2</code> consist of digits only.</li>\n\t<li>Both <code>num1</code> and <code>num2</code>&nbsp;do not contain any leading zero, except the number <code>0</code> itself.</li>\n</ul>\n",
      "lcSlug": "multiply-strings",
      "summary": "Multiply digit-by-digit into int array; handle carry."
    },
    {
      "id": "ma-14",
      "title": "Fraction to Recurring Decimal",
      "lc": 166,
      "importance": "nice",
      "subtopic": "hashmap",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "numer,denom",
          "out": "string"
        }
      ],
      "approaches": [
        {
          "name": "Hash remainder",
          "time": "O(d)",
          "space": "O(d)",
          "code": "string fractionToDecimal(int num, int den) {\n    if(!num) return \"0\"; string ans=to_string(num/den);\n    int rem=abs(num%den); if(!rem) return ans;\n    ans+='.'; unordered_map<int,int> seen;\n    while(rem && !seen.count(rem)){\n        seen[rem]=ans.size(); rem*=10; ans+=to_string(rem/den); rem%=den;\n    } if(rem) ans.insert(seen[rem],\"(\"), ans+=')';\n    return ans;\n}"
        }
      ],
      "description": "Given two integers representing the `numerator` and `denominator` of a fraction, return the fraction in string format.\n\nIf the fractional part is repeating, enclose the repeating part in parentheses\n\nIf multiple answers are possible, return any of them.\n\nIt is guaranteed that the length of the answer string is less than `104` for all the given inputs.\n\nNote that if the fraction can be represented as a finite length string, you must return it.\n\n \n\nExample 1:\n\nInput: numerator = 1, denominator = 2\nOutput: \"0.5\"\n\nExample 2:\n\nInput: numerator = 2, denominator = 1\nOutput: \"2\"\n\nExample 3:\n\nInput: numerator = 4, denominator = 333\nOutput: \"0.(012)\"\n\n \n\nConstraints:\n\n\t• `-231 31 - 1`\n• `denominator != 0`",
      "descriptionHtml": "<p>Given two integers representing the <code>numerator</code> and <code>denominator</code> of a fraction, return <em>the fraction in string format</em>.</p>\n\n<p>If the fractional part is repeating, enclose the repeating part in parentheses</p>\n\n<p>If multiple answers are possible, return <strong>any of them</strong>.</p>\n\n<p>It is <strong>guaranteed</strong> that the length of the answer string is less than <code>10<sup>4</sup></code> for all the given inputs.</p>\n\n<p><strong>Note</strong> that if the fraction can be represented as a <em>finite length string</em>, you <strong>must</strong> return it.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> numerator = 1, denominator = 2\n<strong>Output:</strong> &quot;0.5&quot;\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> numerator = 2, denominator = 1\n<strong>Output:</strong> &quot;2&quot;\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> numerator = 4, denominator = 333\n<strong>Output:</strong> &quot;0.(012)&quot;\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>-2<sup>31</sup> &lt;=&nbsp;numerator, denominator &lt;= 2<sup>31</sup> - 1</code></li>\n\t<li><code>denominator != 0</code></li>\n</ul>\n",
      "lcSlug": "fraction-to-recurring-decimal",
      "summary": "Hash remainder — Hash map for O(1) lookup while scanning — complements, counts, or indices."
    },
    {
      "id": "ma-15",
      "title": "Valid Square",
      "lc": 593,
      "importance": "nice",
      "subtopic": "geometry",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "points",
          "out": "square?"
        }
      ],
      "approaches": [
        {
          "name": "Side lengths",
          "time": "O(1)",
          "space": "O(1)",
          "code": "bool validSquare(vector<int>& p1, vector<int>& p2, vector<int>& p3, vector<int>& p4) {\n    vector<int> d;\n    vector<vector<int>> pts={p1,p2,p3,p4};\n    for(int i=0;i<4;i++) for(int j=i+1;j<4;j++){\n        int dx=pts[i][0]-pts[j][0], dy=pts[i][1]-pts[j][1];\n        d.push_back(dx*dx+dy*dy);\n    } sort(d.begin(), d.end());\n    return d[0]>0 && d[0]==d[1]&&d[1]==d[2]&&d[2]==d[3] && d[4]==d[5] && d[4]==2*d[0];\n}"
        }
      ],
      "description": "Given the coordinates of four points in 2D space `p1`, `p2`, `p3` and `p4`, return `true` if the four points construct a square.\n\nThe coordinate of a point `pi` is represented as `[xi, yi]`. The input is not given in any order.\n\nA valid square has four equal sides with positive length and four equal angles (90-degree angles).\n\n \n\nExample 1:\n\nInput: p1 = [0,0], p2 = [1,1], p3 = [1,0], p4 = [0,1]\nOutput: true\n\nExample 2:\n\nInput: p1 = [0,0], p2 = [1,1], p3 = [1,0], p4 = [0,12]\nOutput: false\n\nExample 3:\n\nInput: p1 = [1,0], p2 = [-1,0], p3 = [0,1], p4 = [0,-1]\nOutput: true\n\n \n\nConstraints:\n\n\t• `p1.length == p2.length == p3.length == p4.length == 2`\n• `-104 i, yi 4`",
      "descriptionHtml": "<p>Given the coordinates of four points in 2D space <code>p1</code>, <code>p2</code>, <code>p3</code> and <code>p4</code>, return <code>true</code> <em>if the four points construct a square</em>.</p>\n\n<p>The coordinate of a point <code>p<sub>i</sub></code> is represented as <code>[x<sub>i</sub>, y<sub>i</sub>]</code>. The input is <strong>not</strong> given in any order.</p>\n\n<p>A <strong>valid square</strong> has four equal sides with positive length and four equal angles (90-degree angles).</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> p1 = [0,0], p2 = [1,1], p3 = [1,0], p4 = [0,1]\n<strong>Output:</strong> true\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> p1 = [0,0], p2 = [1,1], p3 = [1,0], p4 = [0,12]\n<strong>Output:</strong> false\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> p1 = [1,0], p2 = [-1,0], p3 = [0,1], p4 = [0,-1]\n<strong>Output:</strong> true\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>p1.length == p2.length == p3.length == p4.length == 2</code></li>\n\t<li><code>-10<sup>4</sup> &lt;= x<sub>i</sub>, y<sub>i</sub> &lt;= 10<sup>4</sup></code></li>\n</ul>\n",
      "lcSlug": "valid-square",
      "summary": "Side lengths — state invariant, then loop."
    },
    {
      "id": "ma-16",
      "title": "Self Crossing",
      "lc": 335,
      "importance": "nice",
      "subtopic": "geometry",
      "difficulty": "Hard",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "distance",
          "out": "cross?"
        }
      ],
      "approaches": [
        {
          "name": "Geometry cross",
          "time": "O(n)",
          "space": "O(1)",
          "code": "bool isSelfCrossing(vector<int>& x) {\n    int n=x.size();\n    for(int i=3;i<n;i++){\n        if(x[i]>=x[i-2] && x[i-1]<=x[i-3]) return true;\n        if(i>=4 && x[i-1]==x[i-3] && x[i]+x[i-4]>=x[i-2]) return true;\n        if(i>=5 && x[i-2]>=x[i-4] && x[i-1]<=x[i-3] && x[i]+x[i-4]>=x[i-2]) return true;\n    } return false;\n}"
        }
      ],
      "description": "You are given an array of integers `distance`.\n\nYou start at the point `(0, 0)` on an X-Y plane, and you move `distance[0]` meters to the north, then `distance[1]` meters to the west, `distance[2]` meters to the south, `distance[3]` meters to the east, and so on. In other words, after each move, your direction changes counter-clockwise.\n\nReturn `true` if your path crosses itself or `false` if it does not.\n\n \n\nExample 1:\n\nInput: distance = [2,1,1,2]\nOutput: true\nExplanation: The path crosses itself at the point (0, 1).\n\nExample 2:\n\nInput: distance = [1,2,3,4]\nOutput: false\nExplanation: The path does not cross itself at any point.\n\nExample 3:\n\nInput: distance = [1,1,1,2,1]\nOutput: true\nExplanation: The path crosses itself at the point (0, 0).\n\n \n\nConstraints:\n\n\t• `1 5`\n• `1 5`",
      "descriptionHtml": "<p>You are given an array of integers <code>distance</code>.</p>\n\n<p>You start at the point <code>(0, 0)</code> on an <strong>X-Y plane,</strong> and you move <code>distance[0]</code> meters to the north, then <code>distance[1]</code> meters to the west, <code>distance[2]</code> meters to the south, <code>distance[3]</code> meters to the east, and so on. In other words, after each move, your direction changes counter-clockwise.</p>\n\n<p>Return <code>true</code> <em>if your path crosses itself or </em><code>false</code><em> if it does not</em>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2022/12/21/11.jpg\" style=\"width: 400px; height: 413px;\" />\n<pre>\n<strong>Input:</strong> distance = [2,1,1,2]\n<strong>Output:</strong> true\n<strong>Explanation:</strong> The path crosses itself at the point (0, 1).\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2022/12/21/22.jpg\" style=\"width: 400px; height: 413px;\" />\n<pre>\n<strong>Input:</strong> distance = [1,2,3,4]\n<strong>Output:</strong> false\n<strong>Explanation:</strong> The path does not cross itself at any point.\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2022/12/21/33.jpg\" style=\"width: 400px; height: 413px;\" />\n<pre>\n<strong>Input:</strong> distance = [1,1,1,2,1]\n<strong>Output:</strong> true\n<strong>Explanation:</strong> The path crosses itself at the point (0, 0).\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;=&nbsp;distance.length &lt;= 10<sup>5</sup></code></li>\n\t<li><code>1 &lt;=&nbsp;distance[i] &lt;= 10<sup>5</sup></code></li>\n</ul>\n",
      "lcSlug": "self-crossing",
      "summary": "Geometry cross — state invariant, then loop."
    },
    {
      "id": "ma-17",
      "title": "Perfect Squares",
      "lc": 279,
      "importance": "should",
      "subtopic": "dp",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "n",
          "out": "min squares"
        }
      ],
      "approaches": [
        {
          "name": "BFS shortest",
          "time": "O(n)",
          "space": "O(n)",
          "code": "int numSquares(int n) {\n    vector<int> dp(n+1, INT_MAX); dp[0] = 0; queue<int> q; q.push(0);\n    while (!q.empty()) {\n        int rem = q.front(); q.pop();\n        for (int k = 1; k*k <= n - rem; k++) {\n            int nxt = rem + k*k;\n            if (dp[nxt] > dp[rem] + 1) { dp[nxt] = dp[rem] + 1; q.push(nxt); }\n        }\n    }\n    return dp[n];\n}"
        }
      ],
      "description": "Given an integer `n`, return the least number of perfect square numbers that sum to `n`.\n\nA perfect square is an integer that is the square of an integer; in other words, it is the product of some integer with itself. For example, `1`, `4`, `9`, and `16` are perfect squares while `3` and `11` are not.\n\n \n\nExample 1:\n\nInput: n = 12\nOutput: 3\nExplanation: 12 = 4 + 4 + 4.\n\nExample 2:\n\nInput: n = 13\nOutput: 2\nExplanation: 13 = 4 + 9.\n\n \n\nConstraints:\n\n\t• `1 4`",
      "descriptionHtml": "<p>Given an integer <code>n</code>, return <em>the least number of perfect square numbers that sum to</em> <code>n</code>.</p>\n\n<p>A <strong>perfect square</strong> is an integer that is the square of an integer; in other words, it is the product of some integer with itself. For example, <code>1</code>, <code>4</code>, <code>9</code>, and <code>16</code> are perfect squares while <code>3</code> and <code>11</code> are not.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> n = 12\n<strong>Output:</strong> 3\n<strong>Explanation:</strong> 12 = 4 + 4 + 4.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> n = 13\n<strong>Output:</strong> 2\n<strong>Explanation:</strong> 13 = 4 + 9.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= n &lt;= 10<sup>4</sup></code></li>\n</ul>\n",
      "lcSlug": "perfect-squares",
      "summary": "BFS shortest — state invariant, then loop."
    },
    {
      "id": "ma-18",
      "title": "Super Pow",
      "lc": 372,
      "importance": "nice",
      "subtopic": "mod",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "a,b123",
          "out": "a^b mod"
        }
      ],
      "approaches": [
        {
          "name": "Binary exponent mod",
          "time": "O(log b)",
          "space": "O(1)",
          "code": "int superPow(int a, string b) {\n    const int MOD=1337; int res=1; a%=MOD;\n    for(char c: b){\n        res=(res*10)%MOD;\n        int pow=1, base=a;\n        for(int k=c-'0';k;k>>=1){ if(k&1) pow=(pow*base)%MOD; base=(base*base)%MOD; }\n        res=(res*pow)%MOD;\n    } return res;\n}"
        }
      ],
      "description": "Your task is to calculate `ab` mod `1337` where `a` is a positive integer and `b` is an extremely large positive integer given in the form of an array.\n\n \n\nExample 1:\n\nInput: a = 2, b = [3]\nOutput: 8\n\nExample 2:\n\nInput: a = 2, b = [1,0]\nOutput: 1024\n\nExample 3:\n\nInput: a = 1, b = [4,3,3,8,5,2]\nOutput: 1\n\n \n\nConstraints:\n\n\t• `1 31 - 1`\n• `1",
      "descriptionHtml": "<p>Your task is to calculate <code>a<sup>b</sup></code> mod <code>1337</code> where <code>a</code> is a positive integer and <code>b</code> is an extremely large positive integer given in the form of an array.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> a = 2, b = [3]\n<strong>Output:</strong> 8\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> a = 2, b = [1,0]\n<strong>Output:</strong> 1024\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> a = 1, b = [4,3,3,8,5,2]\n<strong>Output:</strong> 1\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= a &lt;= 2<sup>31</sup> - 1</code></li>\n\t<li><code>1 &lt;= b.length &lt;= 2000</code></li>\n\t<li><code>0 &lt;= b[i] &lt;= 9</code></li>\n\t<li><code>b</code> does not contain leading zeros.</li>\n</ul>\n",
      "lcSlug": "super-pow",
      "summary": "Binary exponent mod — state invariant, then loop."
    },
    {
      "id": "ma-19",
      "title": "Random Pick with Weight",
      "lc": 528,
      "importance": "should",
      "subtopic": "prefix",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "w",
          "out": "index"
        }
      ],
      "approaches": [
        {
          "name": "Prefix + binary search",
          "time": "O(log n) pick",
          "space": "O(n)",
          "code": "class Solution {\n    vector<int> pre; int total;\npublic:\n    Solution(vector<int>& w) {\n        pre.resize(w.size()); total = 0;\n        for (int i = 0; i < (int)w.size(); i++) total = pre[i] = total + w[i];\n    }\n    int pickIndex() {\n        int r = rand() % total + 1;\n        return lower_bound(pre.begin(), pre.end(), r) - pre.begin();\n    }\n};"
        }
      ],
      "description": "You are given a 0-indexed array of positive integers `w` where `w[i]` describes the weight of the `ith` index.\n\nYou need to implement the function `pickIndex()`, which randomly picks an index in the range `[0, w.length - 1]` (inclusive) and returns it. The probability of picking an index `i` is `w[i] / sum(w)`.\n\n\t• For example, if `w = [1, 3]`, the probability of picking index `0` is `1 / (1 + 3) = 0.25` (i.e., `25%`), and the probability of picking index `1` is `3 / (1 + 3) = 0.75` (i.e., `75%`).\n\n \n\nExample 1:\n\nInput\n[\"Solution\",\"pickIndex\"]\n[[[1]],[]]\nOutput\n[null,0]\n\nExplanation\nSolution solution = new Solution([1]);\nsolution.pickIndex(); // return 0. The only option is to return 0 since there is only one element in w.\n\nExample 2:\n\nInput\n[\"Solution\",\"pickIndex\",\"pickIndex\",\"pickIndex\",\"pickIndex\",\"pickIndex\"]\n[[[1,3]],[],[],[],[],[]]\nOutput\n[null,1,1,1,1,0]\n\nExplanation\nSolution solution = new Solution([1, 3]);\nsolution.pickIndex(); // return 1. It is returning the second element (index = 1) that has a probability of 3/4.\nsolution.pickIndex(); // return 1\nsolution.pickIndex(); // return 1\nsolution.pickIndex(); // return 1\nsolution.pickIndex(); // return 0. It is returning the first element (index = 0) that has a probability of 1/4.\n\nSince this is a randomization problem, multiple answers are allowed.\nAll of the following outputs can be considered correct:\n[null,1,1,1,1,0]\n[null,1,1,1,1,1]\n[null,1,1,1,0,0]\n[null,1,1,1,0,1]\n[null,1,0,1,0,0]\n......\nand so on.\n\n \n\nConstraints:\n\n\t• `1 4`\n• `1 5`\n• `pickIndex` will be called at most `104` times.",
      "descriptionHtml": "<p>You are given a <strong>0-indexed</strong> array of positive integers <code>w</code> where <code>w[i]</code> describes the <strong>weight</strong> of the <code>i<sup>th</sup></code> index.</p>\n\n<p>You need to implement the function <code>pickIndex()</code>, which <strong>randomly</strong> picks an index in the range <code>[0, w.length - 1]</code> (<strong>inclusive</strong>) and returns it. The <strong>probability</strong> of picking an index <code>i</code> is <code>w[i] / sum(w)</code>.</p>\n\n<ul>\n\t<li>For example, if <code>w = [1, 3]</code>, the probability of picking index <code>0</code> is <code>1 / (1 + 3) = 0.25</code> (i.e., <code>25%</code>), and the probability of picking index <code>1</code> is <code>3 / (1 + 3) = 0.75</code> (i.e., <code>75%</code>).</li>\n</ul>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input</strong>\n[&quot;Solution&quot;,&quot;pickIndex&quot;]\n[[[1]],[]]\n<strong>Output</strong>\n[null,0]\n\n<strong>Explanation</strong>\nSolution solution = new Solution([1]);\nsolution.pickIndex(); // return 0. The only option is to return 0 since there is only one element in w.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input</strong>\n[&quot;Solution&quot;,&quot;pickIndex&quot;,&quot;pickIndex&quot;,&quot;pickIndex&quot;,&quot;pickIndex&quot;,&quot;pickIndex&quot;]\n[[[1,3]],[],[],[],[],[]]\n<strong>Output</strong>\n[null,1,1,1,1,0]\n\n<strong>Explanation</strong>\nSolution solution = new Solution([1, 3]);\nsolution.pickIndex(); // return 1. It is returning the second element (index = 1) that has a probability of 3/4.\nsolution.pickIndex(); // return 1\nsolution.pickIndex(); // return 1\nsolution.pickIndex(); // return 1\nsolution.pickIndex(); // return 0. It is returning the first element (index = 0) that has a probability of 1/4.\n\nSince this is a randomization problem, multiple answers are allowed.\nAll of the following outputs can be considered correct:\n[null,1,1,1,1,0]\n[null,1,1,1,1,1]\n[null,1,1,1,0,0]\n[null,1,1,1,0,1]\n[null,1,0,1,0,0]\n......\nand so on.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= w.length &lt;= 10<sup>4</sup></code></li>\n\t<li><code>1 &lt;= w[i] &lt;= 10<sup>5</sup></code></li>\n\t<li><code>pickIndex</code> will be called at most <code>10<sup>4</sup></code> times.</li>\n</ul>\n",
      "lcSlug": "random-pick-with-weight",
      "summary": "Prefix + binary search — Prefix sums + hash map or difference array for range/subarray queries."
    },
    {
      "id": "ma-20",
      "title": "Nth Magical Number",
      "lc": 878,
      "importance": "nice",
      "subtopic": "binary-search",
      "difficulty": "Hard",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "n,m",
          "out": "number"
        }
      ],
      "approaches": [
        {
          "name": "Binary search count",
          "time": "O(log max)",
          "space": "O(1)",
          "code": "int nthMagicalNumber(int n, int a, int b) {\n    long long g=__gcd(a,b), lcm=a/g*b;\n    auto cnt=[&](long long x){ return x/a + x/b - x/lcm; };\n    long long lo=0, hi=1LL*n*min(a,b);\n    while(lo<hi){ long long mid=lo+(hi-lo)/2; if(cnt(mid)>=n) hi=mid; else lo=mid+1; }\n    return (int)(lo%1000000007);\n}"
        }
      ],
      "description": "A positive integer is magical if it is divisible by either `a` or `b`.\n\nGiven the three integers `n`, `a`, and `b`, return the `nth` magical number. Since the answer may be very large, return it modulo `109 + 7`.\n\n \n\nExample 1:\n\nInput: n = 1, a = 2, b = 3\nOutput: 2\n\nExample 2:\n\nInput: n = 4, a = 2, b = 3\nOutput: 6\n\n \n\nConstraints:\n\n\t• `1 9`\n• `2 4`",
      "descriptionHtml": "<p>A positive integer is <em>magical</em> if it is divisible by either <code>a</code> or <code>b</code>.</p>\n\n<p>Given the three integers <code>n</code>, <code>a</code>, and <code>b</code>, return the <code>n<sup>th</sup></code> magical number. Since the answer may be very large, <strong>return it modulo </strong><code>10<sup>9</sup> + 7</code>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> n = 1, a = 2, b = 3\n<strong>Output:</strong> 2\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> n = 4, a = 2, b = 3\n<strong>Output:</strong> 6\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= n &lt;= 10<sup>9</sup></code></li>\n\t<li><code>2 &lt;= a, b &lt;= 4 * 10<sup>4</sup></code></li>\n</ul>\n",
      "lcSlug": "nth-magical-number",
      "summary": "Binary search count — Halve search space on sorted data or monotonic feasibility."
    }
  ]
};
