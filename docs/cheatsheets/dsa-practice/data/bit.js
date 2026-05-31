window.PRACTICE_TOPIC = {
  "id": "bit",
  "title": "Bit Manipulation",
  "expected_count": 20,
  "strategy": "<strong>Speed-run:</strong> XOR for pairs; bitmask for subsets; Brian Kernighan for bit count. Filter <em>Must do</em> first.",
  "subtopics": [
    {
      "id": "xor",
      "label": "XOR"
    },
    {
      "id": "bits",
      "label": "Bit Ops"
    },
    {
      "id": "bitmask",
      "label": "Bitmask"
    },
    {
      "id": "dp-bits",
      "label": "DP + Bits"
    }
  ],
  "questions": [
    {
      "id": "bi-01",
      "title": "Single Number",
      "lc": 136,
      "importance": "must",
      "subtopic": "xor",
      "difficulty": "Easy",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums",
          "out": "single"
        }
      ],
      "approaches": [
        {
          "name": "XOR all",
          "time": "O(n)",
          "space": "O(1)",
          "code": "int singleNumber(vector<int>& nums) {\n    int x = 0; for (int v : nums) x ^= v; return x;\n}"
        }
      ],
      "description": "Given a non-empty array of integers `nums`, every element appears twice except for one. Find that single one.\n\nYou must implement a solution with a linear runtime complexity and use only constant extra space.\n\n \n\nExample 1:\n\nInput: nums = [2,2,1]\n\nOutput: 1\n\nExample 2:\n\nInput: nums = [4,1,2,1,2]\n\nOutput: 4\n\nExample 3:\n\nInput: nums = [1]\n\nOutput: 1\n\n \n\nConstraints:\n\n\t• `1 4`\n• `-3 * 104 4`\n• Each element in the array appears twice except for one element which appears only once.",
      "descriptionHtml": "<p>Given a <strong>non-empty</strong>&nbsp;array of integers <code>nums</code>, every element appears <em>twice</em> except for one. Find that single one.</p>\n\n<p>You must&nbsp;implement a solution with a linear runtime complexity and use&nbsp;only constant&nbsp;extra space.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<div class=\"example-block\">\n<p><strong>Input:</strong> <span class=\"example-io\">nums = [2,2,1]</span></p>\n\n<p><strong>Output:</strong> <span class=\"example-io\">1</span></p>\n</div>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<div class=\"example-block\">\n<p><strong>Input:</strong> <span class=\"example-io\">nums = [4,1,2,1,2]</span></p>\n\n<p><strong>Output:</strong> <span class=\"example-io\">4</span></p>\n</div>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<div class=\"example-block\">\n<p><strong>Input:</strong> <span class=\"example-io\">nums = [1]</span></p>\n\n<p><strong>Output:</strong> <span class=\"example-io\">1</span></p>\n</div>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= nums.length &lt;= 3 * 10<sup>4</sup></code></li>\n\t<li><code>-3 * 10<sup>4</sup> &lt;= nums[i] &lt;= 3 * 10<sup>4</sup></code></li>\n\t<li>Each element in the array appears twice except for one element which appears only once.</li>\n</ul>\n",
      "lcSlug": "single-number",
      "summary": "XOR all — state invariant, then loop."
    },
    {
      "id": "bi-02",
      "title": "Single Number II",
      "lc": 137,
      "importance": "should",
      "subtopic": "bits",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums",
          "out": "single"
        }
      ],
      "approaches": [
        {
          "name": "Bit count mod 3",
          "time": "O(n)",
          "space": "O(1)",
          "code": "int singleNumber(vector<int>& nums) {\n    int ones = 0, twos = 0;\n    for (int x : nums) { ones = (ones^x)&~twos; twos = (twos^x)&~ones; }\n    return ones;\n}"
        }
      ],
      "description": "Given an integer array `nums` where every element appears three times except for one, which appears exactly once. Find the single element and return it.\n\nYou must implement a solution with a linear runtime complexity and use only constant extra space.\n\n \n\nExample 1:\n\nInput: nums = [2,2,3,2]\nOutput: 3\n\nExample 2:\n\nInput: nums = [0,1,0,1,0,1,99]\nOutput: 99\n\n \n\nConstraints:\n\n\t• `1 4`\n• `-231 31 - 1`\n• Each element in `nums` appears exactly three times except for one element which appears once.",
      "descriptionHtml": "<p>Given an integer array <code>nums</code> where&nbsp;every element appears <strong>three times</strong> except for one, which appears <strong>exactly once</strong>. <em>Find the single element and return it</em>.</p>\n\n<p>You must&nbsp;implement a solution with a linear runtime complexity and use&nbsp;only constant&nbsp;extra space.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<pre><strong>Input:</strong> nums = [2,2,3,2]\n<strong>Output:</strong> 3\n</pre><p><strong class=\"example\">Example 2:</strong></p>\n<pre><strong>Input:</strong> nums = [0,1,0,1,0,1,99]\n<strong>Output:</strong> 99\n</pre>\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= nums.length &lt;= 3 * 10<sup>4</sup></code></li>\n\t<li><code>-2<sup>31</sup> &lt;= nums[i] &lt;= 2<sup>31</sup> - 1</code></li>\n\t<li>Each element in <code>nums</code> appears exactly <strong>three times</strong> except for one element which appears <strong>once</strong>.</li>\n</ul>\n",
      "lcSlug": "single-number-ii",
      "summary": "ones/twos bits track mod-3 count without division."
    },
    {
      "id": "bi-03",
      "title": "Single Number III",
      "lc": 260,
      "importance": "nice",
      "subtopic": "xor",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums",
          "out": "two singles"
        }
      ],
      "approaches": [
        {
          "name": "XOR groups",
          "time": "O(n)",
          "space": "O(1)",
          "code": "vector<int> singleNumber(vector<int>& nums) {\n    long long x=0; for(int v:nums) x^=v;\n    long long bit = x & -x;\n    int a=0,b=0;\n    for(int v:nums) (v&bit)? a^=v : b^=v;\n    return {a,b};\n}"
        }
      ],
      "description": "Given an integer array `nums`, in which exactly two elements appear only once and all the other elements appear exactly twice. Find the two elements that appear only once. You can return the answer in any order.\n\nYou must write an algorithm that runs in linear runtime complexity and uses only constant extra space.\n\n \n\nExample 1:\n\nInput: nums = [1,2,1,3,2,5]\nOutput: [3,5]\nExplanation:  [5, 3] is also a valid answer.\n\nExample 2:\n\nInput: nums = [-1,0]\nOutput: [-1,0]\n\nExample 3:\n\nInput: nums = [0,1]\nOutput: [1,0]\n\n \n\nConstraints:\n\n\t• `2 4`\n• `-231 31 - 1`\n• Each integer in `nums` will appear twice, only two integers will appear once.",
      "descriptionHtml": "<p>Given an integer array <code>nums</code>, in which exactly two elements appear only once and all the other elements appear exactly twice. Find the two elements that appear only once. You can return the answer in <strong>any order</strong>.</p>\n\n<p>You must write an&nbsp;algorithm that runs in linear runtime complexity and uses&nbsp;only constant extra space.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [1,2,1,3,2,5]\n<strong>Output:</strong> [3,5]\n<strong>Explanation: </strong> [5, 3] is also a valid answer.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [-1,0]\n<strong>Output:</strong> [-1,0]\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [0,1]\n<strong>Output:</strong> [1,0]\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>2 &lt;= nums.length &lt;= 3 * 10<sup>4</sup></code></li>\n\t<li><code>-2<sup>31</sup> &lt;= nums[i] &lt;= 2<sup>31</sup> - 1</code></li>\n\t<li>Each integer in <code>nums</code> will appear twice, only two integers will appear once.</li>\n</ul>\n",
      "lcSlug": "single-number-iii",
      "summary": "XOR groups — state invariant, then loop."
    },
    {
      "id": "bi-04",
      "title": "Number of 1 Bits",
      "lc": 191,
      "importance": "must",
      "subtopic": "bits",
      "difficulty": "Easy",
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
          "name": "Popcount",
          "time": "O(1)",
          "space": "O(1)",
          "code": "int hammingWeight(uint32_t n) {\n    int c=0; while (n) { n &= n-1; c++; } return c;\n}"
        }
      ],
      "description": "Given a positive integer `n`, write a function that returns the number of set bits in its binary representation (also known as the Hamming weight).\n\n \n\nExample 1:\n\nInput: n = 11\n\nOutput: 3\n\nExplanation:\n\nThe input binary string 1011 has a total of three set bits.\n\nExample 2:\n\nInput: n = 128\n\nOutput: 1\n\nExplanation:\n\nThe input binary string 10000000 has a total of one set bit.\n\nExample 3:\n\nInput: n = 2147483645\n\nOutput: 30\n\nExplanation:\n\nThe input binary string 1111111111111111111111111111101 has a total of thirty set bits.\n\n \n\nConstraints:\n\n\t• `1 31 - 1`\n\n \nFollow up: If this function is called many times, how would you optimize it?",
      "descriptionHtml": "<p>Given a positive integer <code>n</code>, write a function that returns the number of <span data-keyword=\"set-bit\">set bits</span> in its binary representation (also known as the <a href=\"http://en.wikipedia.org/wiki/Hamming_weight\" target=\"_blank\">Hamming weight</a>).</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<div class=\"example-block\">\n<p><strong>Input:</strong> <span class=\"example-io\">n = 11</span></p>\n\n<p><strong>Output:</strong> <span class=\"example-io\">3</span></p>\n\n<p><strong>Explanation:</strong></p>\n\n<p>The input binary string <strong>1011</strong> has a total of three set bits.</p>\n</div>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<div class=\"example-block\">\n<p><strong>Input:</strong> <span class=\"example-io\">n = 128</span></p>\n\n<p><strong>Output:</strong> <span class=\"example-io\">1</span></p>\n\n<p><strong>Explanation:</strong></p>\n\n<p>The input binary string <strong>10000000</strong> has a total of one set bit.</p>\n</div>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<div class=\"example-block\">\n<p><strong>Input:</strong> <span class=\"example-io\">n = 2147483645</span></p>\n\n<p><strong>Output:</strong> <span class=\"example-io\">30</span></p>\n\n<p><strong>Explanation:</strong></p>\n\n<p>The input binary string <strong>1111111111111111111111111111101</strong> has a total of thirty set bits.</p>\n</div>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= n &lt;= 2<sup>31</sup> - 1</code></li>\n</ul>\n\n<p>&nbsp;</p>\n<strong>Follow up:</strong> If this function is called many times, how would you optimize it?",
      "lcSlug": "number-of-1-bits",
      "summary": "Popcount — state invariant, then loop."
    },
    {
      "id": "bi-05",
      "title": "Counting Bits",
      "lc": 338,
      "importance": "must",
      "subtopic": "dp-bits",
      "difficulty": "Easy",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "n",
          "out": "array"
        }
      ],
      "approaches": [
        {
          "name": "DP bits",
          "time": "O(n)",
          "space": "O(n)",
          "code": "vector<int> countBits(int n) {\n    vector<int> dp(n+1);\n    for (int i=1;i<=n;i++) dp[i]=dp[i>>1]+(i&1);\n    return dp;\n}"
        }
      ],
      "description": "Given an integer `n`, return an array `ans` of length `n + 1` such that for each `i` (`0 Example 1:\n\nInput: n = 2\nOutput: [0,1,1]\nExplanation:\n0 --> 0\n1 --> 1\n2 --> 10\n\nExample 2:\n\nInput: n = 5\nOutput: [0,1,1,2,1,2]\nExplanation:\n0 --> 0\n1 --> 1\n2 --> 10\n3 --> 11\n4 --> 100\n5 --> 101\n\n \n\nConstraints:\n\n\t• `0 5`\n\n \n\nFollow up:\n\n\t• It is very easy to come up with a solution with a runtime of `O(n log n)`. Can you do it in linear time `O(n)` and possibly in a single pass?\n• Can you do it without using any built-in function (i.e., like `__builtin_popcount` in C++)?",
      "descriptionHtml": "<p>Given an integer <code>n</code>, return <em>an array </em><code>ans</code><em> of length </em><code>n + 1</code><em> such that for each </em><code>i</code><em> </em>(<code>0 &lt;= i &lt;= n</code>)<em>, </em><code>ans[i]</code><em> is the <strong>number of </strong></em><code>1</code><em><strong>&#39;s</strong> in the binary representation of </em><code>i</code>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> n = 2\n<strong>Output:</strong> [0,1,1]\n<strong>Explanation:</strong>\n0 --&gt; 0\n1 --&gt; 1\n2 --&gt; 10\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> n = 5\n<strong>Output:</strong> [0,1,1,2,1,2]\n<strong>Explanation:</strong>\n0 --&gt; 0\n1 --&gt; 1\n2 --&gt; 10\n3 --&gt; 11\n4 --&gt; 100\n5 --&gt; 101\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>0 &lt;= n &lt;= 10<sup>5</sup></code></li>\n</ul>\n\n<p>&nbsp;</p>\n<p><strong>Follow up:</strong></p>\n\n<ul>\n\t<li>It is very easy to come up with a solution with a runtime of <code>O(n log n)</code>. Can you do it in linear time <code>O(n)</code> and possibly in a single pass?</li>\n\t<li>Can you do it without using any built-in function (i.e., like <code>__builtin_popcount</code> in C++)?</li>\n</ul>\n",
      "lcSlug": "counting-bits",
      "summary": "DP bits — state invariant, then loop."
    },
    {
      "id": "bi-06",
      "title": "Reverse Bits",
      "lc": 190,
      "importance": "should",
      "subtopic": "bits",
      "difficulty": "Easy",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "n",
          "out": "reversed"
        }
      ],
      "approaches": [
        {
          "name": "Reverse bits",
          "time": "O(1)",
          "space": "O(1)",
          "code": "uint32_t reverseBits(uint32_t n) {\n    uint32_t ans=0;\n    for (int i=0;i<32;i++) { ans=(ans<<1)|(n&1); n>>=1; }\n    return ans;\n}"
        }
      ],
      "description": "Reverse bits of a given 32 bits signed integer.\n\n \n\nExample 1:\n\nInput: n = 43261596\n\nOutput: 964176192\n\nExplanation:\n\n\t\n\t\t\n\t\t\tInteger\n\t\t\tBinary\n\t\t\n\t\t\n\t\t\t43261596\n\t\t\t00000010100101000001111010011100\n\t\t\n\t\t\n\t\t\t964176192\n\t\t\t00111001011110000010100101000000\n\t\t\n\t\n\nExample 2:\n\nInput: n = 2147483644\n\nOutput: 1073741822\n\nExplanation:\n\n\t\n\t\t\n\t\t\tInteger\n\t\t\tBinary\n\t\t\n\t\t\n\t\t\t2147483644\n\t\t\t01111111111111111111111111111100\n\t\t\n\t\t\n\t\t\t1073741822\n\t\t\t00111111111111111111111111111110\n\t\t\n\t\n\n \n\nConstraints:\n\n\t• `0 31 - 2`\n• `n` is even.\n\n \n\nFollow up: If this function is called many times, how would you optimize it?",
      "descriptionHtml": "<p>Reverse bits of a given 32 bits signed integer.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<div class=\"example-block\">\n<p><strong>Input:</strong> <span class=\"example-io\">n = 43261596</span></p>\n\n<p><strong>Output:</strong> <span class=\"example-io\">964176192</span></p>\n\n<p><strong>Explanation:</strong></p>\n\n<table>\n\t<tbody>\n\t\t<tr>\n\t\t\t<th>Integer</th>\n\t\t\t<th>Binary</th>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<td>43261596</td>\n\t\t\t<td>00000010100101000001111010011100</td>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<td>964176192</td>\n\t\t\t<td>00111001011110000010100101000000</td>\n\t\t</tr>\n\t</tbody>\n</table>\n</div>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<div class=\"example-block\">\n<p><strong>Input:</strong> <span class=\"example-io\">n = 2147483644</span></p>\n\n<p><strong>Output:</strong> <span class=\"example-io\">1073741822</span></p>\n\n<p><strong>Explanation:</strong></p>\n\n<table>\n\t<tbody>\n\t\t<tr>\n\t\t\t<th>Integer</th>\n\t\t\t<th>Binary</th>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<td>2147483644</td>\n\t\t\t<td>01111111111111111111111111111100</td>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<td>1073741822</td>\n\t\t\t<td>00111111111111111111111111111110</td>\n\t\t</tr>\n\t</tbody>\n</table>\n</div>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>0 &lt;= n &lt;= 2<sup>31</sup> - 2</code></li>\n\t<li><code>n</code> is even.</li>\n</ul>\n\n<p>&nbsp;</p>\n<p><strong>Follow up:</strong> If this function is called many times, how would you optimize it?</p>\n",
      "lcSlug": "reverse-bits",
      "summary": "Reverse bits — state invariant, then loop."
    },
    {
      "id": "bi-07",
      "title": "Missing Number",
      "lc": 268,
      "importance": "must",
      "subtopic": "xor",
      "difficulty": "Easy",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums",
          "out": "missing"
        }
      ],
      "approaches": [
        {
          "name": "XOR missing",
          "time": "O(n)",
          "space": "O(1)",
          "code": "int missingNumber(vector<int>& nums) {\n    int x=nums.size(); for (int v: nums) x^=v; return x;\n}"
        }
      ],
      "description": "Given an array `nums` containing `n` distinct numbers in the range `[0, n]`, return the only number in the range that is missing from the array.\n\n \n\nExample 1:\n\nInput: nums = [3,0,1]\n\nOutput: 2\n\nExplanation:\n\n`n = 3` since there are 3 numbers, so all numbers are in the range `[0,3]`. 2 is the missing number in the range since it does not appear in `nums`.\n\nExample 2:\n\nInput: nums = [0,1]\n\nOutput: 2\n\nExplanation:\n\n`n = 2` since there are 2 numbers, so all numbers are in the range `[0,2]`. 2 is the missing number in the range since it does not appear in `nums`.\n\nExample 3:\n\nInput: nums = [9,6,4,2,3,5,7,0,1]\n\nOutput: 8\n\nExplanation:\n\n`n = 9` since there are 9 numbers, so all numbers are in the range `[0,9]`. 8 is the missing number in the range since it does not appear in `nums`.\n\n \n\n \n\n \n\n \n\n \n\nConstraints:\n\n\t• `n == nums.length`\n• `1 4`\n• `0 \n\n \n\nFollow up: Could you implement a solution using only `O(1)` extra space complexity and `O(n)` runtime complexity?",
      "descriptionHtml": "<p>Given an array <code>nums</code> containing <code>n</code> distinct numbers in the range <code>[0, n]</code>, return <em>the only number in the range that is missing from the array.</em></p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<div class=\"example-block\">\n<p><strong>Input:</strong> <span class=\"example-io\">nums = [3,0,1]</span></p>\n\n<p><strong>Output:</strong> <span class=\"example-io\">2</span></p>\n\n<p><strong>Explanation:</strong></p>\n\n<p><code>n = 3</code> since there are 3 numbers, so all numbers are in the range <code>[0,3]</code>. 2 is the missing number in the range since it does not appear in <code>nums</code>.</p>\n</div>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<div class=\"example-block\">\n<p><strong>Input:</strong> <span class=\"example-io\">nums = [0,1]</span></p>\n\n<p><strong>Output:</strong> <span class=\"example-io\">2</span></p>\n\n<p><strong>Explanation:</strong></p>\n\n<p><code>n = 2</code> since there are 2 numbers, so all numbers are in the range <code>[0,2]</code>. 2 is the missing number in the range since it does not appear in <code>nums</code>.</p>\n</div>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<div class=\"example-block\">\n<p><strong>Input:</strong> <span class=\"example-io\">nums = [9,6,4,2,3,5,7,0,1]</span></p>\n\n<p><strong>Output:</strong> <span class=\"example-io\">8</span></p>\n\n<p><strong>Explanation:</strong></p>\n\n<p><code>n = 9</code> since there are 9 numbers, so all numbers are in the range <code>[0,9]</code>. 8 is the missing number in the range since it does not appear in <code>nums</code>.</p>\n</div>\n\n<div class=\"simple-translate-system-theme\" id=\"simple-translate\">\n<div>\n<div class=\"simple-translate-button isShow\" style=\"background-image: url(&quot;moz-extension://8a9ffb6b-7e69-4e93-aae1-436a1448eff6/icons/512.png&quot;); height: 22px; width: 22px; top: 318px; left: 36px;\">&nbsp;</div>\n\n<div class=\"simple-translate-panel \" style=\"width: 300px; height: 200px; top: 0px; left: 0px; font-size: 13px;\">\n<div class=\"simple-translate-result-wrapper\" style=\"overflow: hidden;\">\n<div class=\"simple-translate-move\" draggable=\"true\">&nbsp;</div>\n\n<div class=\"simple-translate-result-contents\">\n<p class=\"simple-translate-result\" dir=\"auto\">&nbsp;</p>\n\n<p class=\"simple-translate-candidate\" dir=\"auto\">&nbsp;</p>\n</div>\n</div>\n</div>\n</div>\n</div>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>n == nums.length</code></li>\n\t<li><code>1 &lt;= n &lt;= 10<sup>4</sup></code></li>\n\t<li><code>0 &lt;= nums[i] &lt;= n</code></li>\n\t<li>All the numbers of <code>nums</code> are <strong>unique</strong>.</li>\n</ul>\n\n<p>&nbsp;</p>\n<p><strong>Follow up:</strong> Could you implement a solution using only <code>O(1)</code> extra space complexity and <code>O(n)</code> runtime complexity?</p>\n",
      "lcSlug": "missing-number",
      "summary": "XOR missing — state invariant, then loop."
    },
    {
      "id": "bi-08",
      "title": "Sum of Two Integers",
      "lc": 371,
      "importance": "should",
      "subtopic": "bits",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "a,b",
          "out": "sum no +/-"
        }
      ],
      "approaches": [
        {
          "name": "XOR add",
          "time": "O(1)",
          "space": "O(1)",
          "code": "int getSum(int a, int b) {\n    while (b) { unsigned carry = (unsigned)(a & b) << 1; a ^= b; b = (int)carry; }\n    return a;\n}"
        }
      ],
      "description": "Given two integers `a` and `b`, return the sum of the two integers without using the operators `+` and `-`.\n\n \n\nExample 1:\n\nInput: a = 1, b = 2\nOutput: 3\n\nExample 2:\n\nInput: a = 2, b = 3\nOutput: 5\n\n \n\nConstraints:\n\n\t• `-1000",
      "descriptionHtml": "<p>Given two integers <code>a</code> and <code>b</code>, return <em>the sum of the two integers without using the operators</em> <code>+</code> <em>and</em> <code>-</code>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<pre><strong>Input:</strong> a = 1, b = 2\n<strong>Output:</strong> 3\n</pre><p><strong class=\"example\">Example 2:</strong></p>\n<pre><strong>Input:</strong> a = 2, b = 3\n<strong>Output:</strong> 5\n</pre>\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>-1000 &lt;= a, b &lt;= 1000</code></li>\n</ul>\n",
      "lcSlug": "sum-of-two-integers",
      "summary": "Add without +: xor sum, carry = (a&b)<<1, repeat until carry 0."
    },
    {
      "id": "bi-09",
      "title": "Gray Code",
      "lc": 89,
      "importance": "nice",
      "subtopic": "bits",
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
      "description": "An n-bit gray code sequence is a sequence of `2n` integers where:\n\n\t• Every integer is in the inclusive range `[0, 2n - 1]`,\n• The first integer is `0`,\n• An integer appears no more than once in the sequence,\n• The binary representation of every pair of adjacent integers differs by exactly one bit, and\n• The binary representation of the first and last integers differs by exactly one bit.\n\nGiven an integer `n`, return any valid n-bit gray code sequence.\n\n \n\nExample 1:\n\nInput: n = 2\nOutput: [0,1,3,2]\nExplanation:\nThe binary representation of [0,1,3,2] is [00,01,11,10].\n- 00 and 01 differ by one bit\n- 01 and 11 differ by one bit\n- 11 and 10 differ by one bit\n- 10 and 00 differ by one bit\n[0,2,3,1] is also a valid gray code sequence, whose binary representation is [00,10,11,01].\n- 00 and 10 differ by one bit\n- 10 and 11 differ by one bit\n- 11 and 01 differ by one bit\n- 01 and 00 differ by one bit\n\nExample 2:\n\nInput: n = 1\nOutput: [0,1]\n\n \n\nConstraints:\n\n\t• `1",
      "descriptionHtml": "<p>An <strong>n-bit gray code sequence</strong> is a sequence of <code>2<sup>n</sup></code> integers where:</p>\n\n<ul>\n\t<li>Every integer is in the <strong>inclusive</strong> range <code>[0, 2<sup>n</sup> - 1]</code>,</li>\n\t<li>The first integer is <code>0</code>,</li>\n\t<li>An integer appears <strong>no more than once</strong> in the sequence,</li>\n\t<li>The binary representation of every pair of <strong>adjacent</strong> integers differs by <strong>exactly one bit</strong>, and</li>\n\t<li>The binary representation of the <strong>first</strong> and <strong>last</strong> integers differs by <strong>exactly one bit</strong>.</li>\n</ul>\n\n<p>Given an integer <code>n</code>, return <em>any valid <strong>n-bit gray code sequence</strong></em>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> n = 2\n<strong>Output:</strong> [0,1,3,2]\n<strong>Explanation:</strong>\nThe binary representation of [0,1,3,2] is [00,01,11,10].\n- 0<u>0</u> and 0<u>1</u> differ by one bit\n- <u>0</u>1 and <u>1</u>1 differ by one bit\n- 1<u>1</u> and 1<u>0</u> differ by one bit\n- <u>1</u>0 and <u>0</u>0 differ by one bit\n[0,2,3,1] is also a valid gray code sequence, whose binary representation is [00,10,11,01].\n- <u>0</u>0 and <u>1</u>0 differ by one bit\n- 1<u>0</u> and 1<u>1</u> differ by one bit\n- <u>1</u>1 and <u>0</u>1 differ by one bit\n- 0<u>1</u> and 0<u>0</u> differ by one bit\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> n = 1\n<strong>Output:</strong> [0,1]\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= n &lt;= 16</code></li>\n</ul>\n",
      "lcSlug": "gray-code",
      "summary": "Gray code — state invariant, then loop."
    },
    {
      "id": "bi-10",
      "title": "Maximum XOR of Two Numbers",
      "lc": 421,
      "importance": "should",
      "subtopic": "trie",
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
      "id": "bi-11",
      "title": "Subsets",
      "lc": 78,
      "importance": "should",
      "subtopic": "bitmask",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums",
          "out": "subsets"
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
      "description": "Given an integer array `nums` of unique elements, return all possible subsets (the power set).\n\nThe solution set must not contain duplicate subsets. Return the solution in any order.\n\n \n\nExample 1:\n\nInput: nums = [1,2,3]\nOutput: [[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]\n\nExample 2:\n\nInput: nums = [0]\nOutput: [[],[0]]\n\n \n\nConstraints:\n\n\t• `1",
      "descriptionHtml": "<p>Given an integer array <code>nums</code> of <strong>unique</strong> elements, return <em>all possible</em> <span data-keyword=\"subset\"><em>subsets</em></span> <em>(the power set)</em>.</p>\n\n<p>The solution set <strong>must not</strong> contain duplicate subsets. Return the solution in <strong>any order</strong>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [1,2,3]\n<strong>Output:</strong> [[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [0]\n<strong>Output:</strong> [[],[0]]\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= nums.length &lt;= 10</code></li>\n\t<li><code>-10 &lt;= nums[i] &lt;= 10</code></li>\n\t<li>All the numbers of&nbsp;<code>nums</code> are <strong>unique</strong>.</li>\n</ul>\n",
      "lcSlug": "subsets",
      "summary": "dfs(i): skip i or pick i — save when i==n."
    },
    {
      "id": "bi-12",
      "title": "Power of Two",
      "lc": 231,
      "importance": "should",
      "subtopic": "bits",
      "difficulty": "Easy",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "n",
          "out": "power?"
        }
      ],
      "approaches": [
        {
          "name": "Bit check",
          "time": "O(1)",
          "space": "O(1)",
          "code": "bool isPowerOfTwo(int n) {\n    // power of 2 iff exactly one bit set\n    return n > 0 && (n & (n - 1)) == 0;\n}"
        }
      ],
      "description": "Given an integer `n`, return `true` if it is a power of two. Otherwise, return `false`.\n\nAn integer `n` is a power of two, if there exists an integer `x` such that `n == 2x`.\n\n \n\nExample 1:\n\nInput: n = 1\nOutput: true\nExplanation: 20 = 1\n\nExample 2:\n\nInput: n = 16\nOutput: true\nExplanation: 24 = 16\n\nExample 3:\n\nInput: n = 3\nOutput: false\n\n \n\nConstraints:\n\n\t• `-231 31 - 1`\n\n \nFollow up: Could you solve it without loops/recursion?",
      "descriptionHtml": "<p>Given an integer <code>n</code>, return <em><code>true</code> if it is a power of two. Otherwise, return <code>false</code></em>.</p>\n\n<p>An integer <code>n</code> is a power of two, if there exists an integer <code>x</code> such that <code>n == 2<sup>x</sup></code>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> n = 1\n<strong>Output:</strong> true\n<strong>Explanation: </strong>2<sup>0</sup> = 1\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> n = 16\n<strong>Output:</strong> true\n<strong>Explanation: </strong>2<sup>4</sup> = 16\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> n = 3\n<strong>Output:</strong> false\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>-2<sup>31</sup> &lt;= n &lt;= 2<sup>31</sup> - 1</code></li>\n</ul>\n\n<p>&nbsp;</p>\n<strong>Follow up:</strong> Could you solve it without loops/recursion?",
      "lcSlug": "power-of-two",
      "summary": "Bit check — state invariant, then loop."
    },
    {
      "id": "bi-13",
      "title": "Power of Four",
      "lc": 342,
      "importance": "nice",
      "subtopic": "bits",
      "difficulty": "Easy",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "n",
          "out": "power?"
        }
      ],
      "approaches": [
        {
          "name": "Bit check",
          "time": "O(1)",
          "space": "O(1)",
          "code": "bool isPowerOfFour(int n) {\n    // power of 2: n & (n-1) == 0; power of 4: set bit at even index only\n    return n > 0 && (n & (n - 1)) == 0 && (n & 0x55555555);\n}"
        }
      ],
      "description": "Given an integer `n`, return `true` if it is a power of four. Otherwise, return `false`.\n\nAn integer `n` is a power of four, if there exists an integer `x` such that `n == 4x`.\n\n \n\nExample 1:\n\nInput: n = 16\nOutput: true\n\nExample 2:\n\nInput: n = 5\nOutput: false\n\nExample 3:\n\nInput: n = 1\nOutput: true\n\n \n\nConstraints:\n\n\t• `-231 31 - 1`\n\n \nFollow up: Could you solve it without loops/recursion?",
      "descriptionHtml": "<p>Given an integer <code>n</code>, return <em><code>true</code> if it is a power of four. Otherwise, return <code>false</code></em>.</p>\n\n<p>An integer <code>n</code> is a power of four, if there exists an integer <code>x</code> such that <code>n == 4<sup>x</sup></code>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<pre><strong>Input:</strong> n = 16\n<strong>Output:</strong> true\n</pre><p><strong class=\"example\">Example 2:</strong></p>\n<pre><strong>Input:</strong> n = 5\n<strong>Output:</strong> false\n</pre><p><strong class=\"example\">Example 3:</strong></p>\n<pre><strong>Input:</strong> n = 1\n<strong>Output:</strong> true\n</pre>\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>-2<sup>31</sup> &lt;= n &lt;= 2<sup>31</sup> - 1</code></li>\n</ul>\n\n<p>&nbsp;</p>\n<strong>Follow up:</strong> Could you solve it without loops/recursion?",
      "lcSlug": "power-of-four",
      "summary": "Bit check — state invariant, then loop."
    },
    {
      "id": "bi-14",
      "title": "Bitwise AND of Numbers Range",
      "lc": 201,
      "importance": "nice",
      "subtopic": "bits",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "left,right",
          "out": "and"
        }
      ],
      "approaches": [
        {
          "name": "Shift common prefix",
          "time": "O(1)",
          "space": "O(1)",
          "code": "int rangeBitwiseAnd(int left, int right) {\n    int shift=0; while(left<right){ left>>=1; right>>=1; shift++; }\n    return left<<shift;\n}"
        }
      ],
      "description": "Given two integers `left` and `right` that represent the range `[left, right]`, return the bitwise AND of all numbers in this range, inclusive.\n\n \n\nExample 1:\n\nInput: left = 5, right = 7\nOutput: 4\n\nExample 2:\n\nInput: left = 0, right = 0\nOutput: 0\n\nExample 3:\n\nInput: left = 1, right = 2147483647\nOutput: 0\n\n \n\nConstraints:\n\n\t• `0 31 - 1`",
      "descriptionHtml": "<p>Given two integers <code>left</code> and <code>right</code> that represent the range <code>[left, right]</code>, return <em>the bitwise AND of all numbers in this range, inclusive</em>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> left = 5, right = 7\n<strong>Output:</strong> 4\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> left = 0, right = 0\n<strong>Output:</strong> 0\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> left = 1, right = 2147483647\n<strong>Output:</strong> 0\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>0 &lt;= left &lt;= right &lt;= 2<sup>31</sup> - 1</code></li>\n</ul>\n",
      "lcSlug": "bitwise-and-of-numbers-range",
      "summary": "Shift common prefix — state invariant, then loop."
    },
    {
      "id": "bi-15",
      "title": "UTF-8 Validation",
      "lc": 393,
      "importance": "nice",
      "subtopic": "bits",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "data",
          "out": "valid?"
        }
      ],
      "approaches": [
        {
          "name": "Bit scan UTF-8",
          "time": "O(n)",
          "space": "O(1)",
          "code": "bool validUtf8(vector<int>& data) {\n    int i=0, n=data.size();\n    while(i<n){\n        int bytes=0;\n        if((data[i]&0x80)==0) bytes=1;\n        else if((data[i]&0xE0)==0xC0) bytes=2;\n        else if((data[i]&0xF0)==0xE0) bytes=3;\n        else if((data[i]&0xF8)==0xF0) bytes=4;\n        else return false;\n        if(i+bytes>n) return false;\n        for(int j=1;j<bytes;j++) if((data[i+j]&0xC0)!=0x80) return false;\n        i+=bytes;\n    } return true;\n}"
        }
      ],
      "description": "Given an integer array `data` representing the data, return whether it is a valid UTF-8 encoding (i.e. it translates to a sequence of valid UTF-8 encoded characters).\n\nA character in UTF8 can be from 1 to 4 bytes long, subjected to the following rules:\n\n\t• For a 1-byte character, the first bit is a `0`, followed by its Unicode code.\n• For an n-bytes character, the first `n` bits are all one's, the `n + 1` bit is `0`, followed by `n - 1` bytes with the most significant `2` bits being `10`.\n\nThis is how the UTF-8 encoding would work:\n\n     Number of Bytes   |        UTF-8 Octet Sequence\n                       |              (binary)\n   --------------------+-----------------------------------------\n            1          |   0xxxxxxx\n            2          |   110xxxxx 10xxxxxx\n            3          |   1110xxxx 10xxxxxx 10xxxxxx\n            4          |   11110xxx 10xxxxxx 10xxxxxx 10xxxxxx\n\n`x` denotes a bit in the binary form of a byte that may be either `0` or `1`.\n\nNote: The input is an array of integers. Only the least significant 8 bits of each integer is used to store the data. This means each integer represents only 1 byte of data.\n\n \n\nExample 1:\n\nInput: data = [197,130,1]\nOutput: true\nExplanation: data represents the octet sequence: 11000101 10000010 00000001.\nIt is a valid utf-8 encoding for a 2-bytes character followed by a 1-byte character.\n\nExample 2:\n\nInput: data = [235,140,4]\nOutput: false\nExplanation: data represented the octet sequence: 11101011 10001100 00000100.\nThe first 3 bits are all one's and the 4th bit is 0 means it is a 3-bytes character.\nThe next byte is a continuation byte which starts with 10 and that's correct.\nBut the second continuation byte does not start with 10, so it is invalid.\n\n \n\nConstraints:\n\n\t• `1 4`\n• `0",
      "descriptionHtml": "<p>Given an integer array <code>data</code> representing the data, return whether it is a valid <strong>UTF-8</strong> encoding (i.e. it translates to a sequence of valid UTF-8 encoded characters).</p>\n\n<p>A character in <strong>UTF8</strong> can be from <strong>1 to 4 bytes</strong> long, subjected to the following rules:</p>\n\n<ol>\n\t<li>For a <strong>1-byte</strong> character, the first bit is a <code>0</code>, followed by its Unicode code.</li>\n\t<li>For an <strong>n-bytes</strong> character, the first <code>n</code> bits are all one&#39;s, the <code>n + 1</code> bit is <code>0</code>, followed by <code>n - 1</code> bytes with the most significant <code>2</code> bits being <code>10</code>.</li>\n</ol>\n\n<p>This is how the UTF-8 encoding would work:</p>\n\n<pre>\n     Number of Bytes   |        UTF-8 Octet Sequence\n                       |              (binary)\n   --------------------+-----------------------------------------\n            1          |   0xxxxxxx\n            2          |   110xxxxx 10xxxxxx\n            3          |   1110xxxx 10xxxxxx 10xxxxxx\n            4          |   11110xxx 10xxxxxx 10xxxxxx 10xxxxxx\n</pre>\n\n<p><code>x</code> denotes a bit in the binary form of a byte that may be either <code>0</code> or <code>1</code>.</p>\n\n<p><strong>Note: </strong>The input is an array of integers. Only the <strong>least significant 8 bits</strong> of each integer is used to store the data. This means each integer represents only 1 byte of data.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> data = [197,130,1]\n<strong>Output:</strong> true\n<strong>Explanation:</strong> data represents the octet sequence: 11000101 10000010 00000001.\nIt is a valid utf-8 encoding for a 2-bytes character followed by a 1-byte character.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> data = [235,140,4]\n<strong>Output:</strong> false\n<strong>Explanation:</strong> data represented the octet sequence: 11101011 10001100 00000100.\nThe first 3 bits are all one&#39;s and the 4th bit is 0 means it is a 3-bytes character.\nThe next byte is a continuation byte which starts with 10 and that&#39;s correct.\nBut the second continuation byte does not start with 10, so it is invalid.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= data.length &lt;= 2 * 10<sup>4</sup></code></li>\n\t<li><code>0 &lt;= data[i] &lt;= 255</code></li>\n</ul>\n",
      "lcSlug": "utf-8-validation",
      "summary": "Bit scan UTF-8 — state invariant, then loop."
    },
    {
      "id": "bi-16",
      "title": "Find the Difference",
      "lc": 389,
      "importance": "nice",
      "subtopic": "xor",
      "difficulty": "Easy",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "s,t",
          "out": "char"
        }
      ],
      "approaches": [
        {
          "name": "XOR chars",
          "time": "O(n)",
          "space": "O(1)",
          "code": "char findTheDifference(string s, string t) {\n    char x=0; for(char c:s) x^=c; for(char c:t) x^=c; return x;\n}"
        }
      ],
      "description": "You are given two strings `s` and `t`.\n\nString `t` is generated by random shuffling string `s` and then add one more letter at a random position.\n\nReturn the letter that was added to `t`.\n\n \n\nExample 1:\n\nInput: s = \"abcd\", t = \"abcde\"\nOutput: \"e\"\nExplanation: 'e' is the letter that was added.\n\nExample 2:\n\nInput: s = \"\", t = \"y\"\nOutput: \"y\"\n\n \n\nConstraints:\n\n\t• `0",
      "descriptionHtml": "<p>You are given two strings <code>s</code> and <code>t</code>.</p>\n\n<p>String <code>t</code> is generated by random shuffling string <code>s</code> and then add one more letter at a random position.</p>\n\n<p>Return the letter that was added to <code>t</code>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> s = &quot;abcd&quot;, t = &quot;abcde&quot;\n<strong>Output:</strong> &quot;e&quot;\n<strong>Explanation:</strong> &#39;e&#39; is the letter that was added.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> s = &quot;&quot;, t = &quot;y&quot;\n<strong>Output:</strong> &quot;y&quot;\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>0 &lt;= s.length &lt;= 1000</code></li>\n\t<li><code>t.length == s.length + 1</code></li>\n\t<li><code>s</code> and <code>t</code> consist of lowercase English letters.</li>\n</ul>\n",
      "lcSlug": "find-the-difference",
      "summary": "XOR chars — state invariant, then loop."
    },
    {
      "id": "bi-17",
      "title": "Maximum Product of Word Lengths",
      "lc": 318,
      "importance": "nice",
      "subtopic": "bitmask",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "words",
          "out": "max product"
        }
      ],
      "approaches": [
        {
          "name": "Bitmask words",
          "time": "O(n^2 * L)",
          "space": "O(n)",
          "code": "int maxProduct(vector<string>& words) {\n    vector<int> mask(words.size());\n    for(int i=0;i<(int)words.size();i++) for(char c:words[i]) mask[i]|=1<<(c-'a');\n    int ans=0;\n    for(int i=0;i<(int)words.size();i++) for(int j=i+1;j<(int)words.size();j++)\n        if(!(mask[i]&mask[j])) ans=max(ans,(int)(words[i].size()*words[j].size()));\n    return ans;\n}"
        }
      ],
      "description": "Given a string array `words`, return the maximum value of `length(word[i]) * length(word[j])` where the two words do not share common letters. If no such two words exist, return `0`.\n\n \n\nExample 1:\n\nInput: words = [\"abcw\",\"baz\",\"foo\",\"bar\",\"xtfn\",\"abcdef\"]\nOutput: 16\nExplanation: The two words can be \"abcw\", \"xtfn\".\n\nExample 2:\n\nInput: words = [\"a\",\"ab\",\"abc\",\"d\",\"cd\",\"bcd\",\"abcd\"]\nOutput: 4\nExplanation: The two words can be \"ab\", \"cd\".\n\nExample 3:\n\nInput: words = [\"a\",\"aa\",\"aaa\",\"aaaa\"]\nOutput: 0\nExplanation: No such pair of words.\n\n \n\nConstraints:\n\n\t• `2",
      "descriptionHtml": "<p>Given a string array <code>words</code>, return <em>the maximum value of</em> <code>length(word[i]) * length(word[j])</code> <em>where the two words do not share common letters</em>. If no such two words exist, return <code>0</code>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> words = [&quot;abcw&quot;,&quot;baz&quot;,&quot;foo&quot;,&quot;bar&quot;,&quot;xtfn&quot;,&quot;abcdef&quot;]\n<strong>Output:</strong> 16\n<strong>Explanation:</strong> The two words can be &quot;abcw&quot;, &quot;xtfn&quot;.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> words = [&quot;a&quot;,&quot;ab&quot;,&quot;abc&quot;,&quot;d&quot;,&quot;cd&quot;,&quot;bcd&quot;,&quot;abcd&quot;]\n<strong>Output:</strong> 4\n<strong>Explanation:</strong> The two words can be &quot;ab&quot;, &quot;cd&quot;.\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> words = [&quot;a&quot;,&quot;aa&quot;,&quot;aaa&quot;,&quot;aaaa&quot;]\n<strong>Output:</strong> 0\n<strong>Explanation:</strong> No such pair of words.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>2 &lt;= words.length &lt;= 1000</code></li>\n\t<li><code>1 &lt;= words[i].length &lt;= 1000</code></li>\n\t<li><code>words[i]</code> consists only of lowercase English letters.</li>\n</ul>\n",
      "lcSlug": "maximum-product-of-word-lengths",
      "summary": "Bitmask words — state invariant, then loop."
    },
    {
      "id": "bi-18",
      "title": "Total Hamming Distance",
      "lc": 477,
      "importance": "nice",
      "subtopic": "bits",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums",
          "out": "distance"
        }
      ],
      "approaches": [
        {
          "name": "Bit contribution",
          "time": "O(32n)",
          "space": "O(1)",
          "code": "int totalHammingDistance(vector<int>& nums) {\n    int ans=0;\n    for(int b=0;b<32;b++){\n        int ones=0;\n        for(int x:nums) if((x>>b)&1) ones++;\n        ans += ones*((int)nums.size()-ones);\n    } return ans;\n}"
        }
      ],
      "description": "The Hamming distance between two integers is the number of positions at which the corresponding bits are different.\n\nGiven an integer array `nums`, return the sum of Hamming distances between all the pairs of the integers in `nums`.\n\n \n\nExample 1:\n\nInput: nums = [4,14,2]\nOutput: 6\nExplanation: In binary representation, the 4 is 0100, 14 is 1110, and 2 is 0010 (just\nshowing the four bits relevant in this case).\nThe answer will be:\nHammingDistance(4, 14) + HammingDistance(4, 2) + HammingDistance(14, 2) = 2 + 2 + 2 = 6.\n\nExample 2:\n\nInput: nums = [4,14,4]\nOutput: 4\n\n \n\nConstraints:\n\n\t• `1 4`\n• `0 9`\n• The answer for the given input will fit in a 32-bit integer.",
      "descriptionHtml": "<p>The <a href=\"https://en.wikipedia.org/wiki/Hamming_distance\" target=\"_blank\">Hamming distance</a> between two integers is the number of positions at which the corresponding bits are different.</p>\n\n<p>Given an integer array <code>nums</code>, return <em>the sum of <strong>Hamming distances</strong> between all the pairs of the integers in</em> <code>nums</code>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [4,14,2]\n<strong>Output:</strong> 6\n<strong>Explanation:</strong> In binary representation, the 4 is 0100, 14 is 1110, and 2 is 0010 (just\nshowing the four bits relevant in this case).\nThe answer will be:\nHammingDistance(4, 14) + HammingDistance(4, 2) + HammingDistance(14, 2) = 2 + 2 + 2 = 6.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [4,14,4]\n<strong>Output:</strong> 4\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= nums.length &lt;= 10<sup>4</sup></code></li>\n\t<li><code>0 &lt;= nums[i] &lt;= 10<sup>9</sup></code></li>\n\t<li>The answer for the given input will fit in a <strong>32-bit</strong> integer.</li>\n</ul>\n",
      "lcSlug": "total-hamming-distance",
      "summary": "Bit contribution — state invariant, then loop."
    },
    {
      "id": "bi-19",
      "title": "Repeated DNA Sequences",
      "lc": 187,
      "importance": "nice",
      "subtopic": "hash",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "s",
          "out": "repeated 10-mers"
        }
      ],
      "approaches": [
        {
          "name": "Hash 10-mer",
          "time": "O(n)",
          "space": "O(n)",
          "code": "vector<string> findRepeatedDnaSequences(string s) {\n    unordered_map<string,int> cnt; vector<string> ans;\n    for(int i=0;i+10<=(int)s.size();i++){\n        string sub=s.substr(i,10);\n        if(++cnt[sub]==2) ans.push_back(sub);\n    } return ans;\n}"
        }
      ],
      "description": "The DNA sequence is composed of a series of nucleotides abbreviated as `'A'`, `'C'`, `'G'`, and `'T'`.\n\n\t• For example, `\"ACGAATTCCG\"` is a DNA sequence.\n\nWhen studying DNA, it is useful to identify repeated sequences within the DNA.\n\nGiven a string `s` that represents a DNA sequence, return all the `10`-letter-long sequences (substrings) that occur more than once in a DNA molecule. You may return the answer in any order.\n\n \n\nExample 1:\n\nInput: s = \"AAAAACCCCCAAAAACCCCCCAAAAAGGGTTT\"\nOutput: [\"AAAAACCCCC\",\"CCCCCAAAAA\"]\n\nExample 2:\n\nInput: s = \"AAAAAAAAAAAAA\"\nOutput: [\"AAAAAAAAAA\"]\n\n \n\nConstraints:\n\n\t• `1 5`\n• `s[i]` is either `'A'`, `'C'`, `'G'`, or `'T'`.",
      "descriptionHtml": "<p>The <strong>DNA sequence</strong> is composed of a series of nucleotides abbreviated as <code>&#39;A&#39;</code>, <code>&#39;C&#39;</code>, <code>&#39;G&#39;</code>, and <code>&#39;T&#39;</code>.</p>\n\n<ul>\n\t<li>For example, <code>&quot;ACGAATTCCG&quot;</code> is a <strong>DNA sequence</strong>.</li>\n</ul>\n\n<p>When studying <strong>DNA</strong>, it is useful to identify repeated sequences within the DNA.</p>\n\n<p>Given a string <code>s</code> that represents a <strong>DNA sequence</strong>, return all the <strong><code>10</code>-letter-long</strong> sequences (substrings) that occur more than once in a DNA molecule. You may return the answer in <strong>any order</strong>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<pre><strong>Input:</strong> s = \"AAAAACCCCCAAAAACCCCCCAAAAAGGGTTT\"\n<strong>Output:</strong> [\"AAAAACCCCC\",\"CCCCCAAAAA\"]\n</pre><p><strong class=\"example\">Example 2:</strong></p>\n<pre><strong>Input:</strong> s = \"AAAAAAAAAAAAA\"\n<strong>Output:</strong> [\"AAAAAAAAAA\"]\n</pre>\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= s.length &lt;= 10<sup>5</sup></code></li>\n\t<li><code>s[i]</code> is either <code>&#39;A&#39;</code>, <code>&#39;C&#39;</code>, <code>&#39;G&#39;</code>, or <code>&#39;T&#39;</code>.</li>\n</ul>\n",
      "lcSlug": "repeated-dna-sequences",
      "summary": "Hash 10-mer — state invariant, then loop."
    },
    {
      "id": "bi-20",
      "title": "Minimum Flips to Make a OR b Equal to c",
      "lc": 1318,
      "importance": "nice",
      "subtopic": "bits",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "a,b,c",
          "out": "flips"
        }
      ],
      "approaches": [
        {
          "name": "Greedy bits",
          "time": "O(1)",
          "space": "O(1)",
          "code": "int minFlips(int a,int b,int c){\n    int ans=0;\n    for(int i=0;i<32;i++){\n        int bitC=(c>>i)&1, bitA=(a>>i)&1, bitB=(b>>i)&1;\n        if(bitC) ans += !(bitA||bitB);\n        else ans += bitA+bitB;\n    }     return ans;\n}"
        }
      ],
      "description": "Given 3 positives numbers `a`, `b` and `c`. Return the minimum flips required in some bits of `a` and `b` to make ( `a` OR `b` == `c` ). (bitwise OR operation).\n\r\nFlip operation consists of change any single bit 1 to 0 or change the bit 0 to 1 in their binary representation.\n\n \n\nExample 1:\n\n\r\n\r\n\n\r\nInput: a = 2, b = 6, c = 5\r\nOutput: 3\r\nExplanation: After flips a = 1 , b = 4 , c = 5 such that (a OR b == c)\n\r\n\r\nExample 2:\r\n\r\n\n\r\nInput: a = 4, b = 2, c = 7\r\nOutput: 1\r\n\n\r\n\r\nExample 3:\r\n\r\n\n\r\nInput: a = 1, b = 2, c = 3\r\nOutput: 0\r\n\n\r\n\r\n \n\nConstraints:\r\n\r\n\r\n\t• `1",
      "descriptionHtml": "<p>Given 3 positives numbers <code>a</code>, <code>b</code> and <code>c</code>. Return the minimum flips required in some bits of <code>a</code> and <code>b</code> to make (&nbsp;<code>a</code> OR <code>b</code> == <code>c</code>&nbsp;). (bitwise OR operation).<br />\r\nFlip operation&nbsp;consists of change&nbsp;<strong>any</strong>&nbsp;single bit 1 to 0 or change the bit 0 to 1&nbsp;in their binary representation.</p>\r\n\r\n<p>&nbsp;</p>\r\n<p><strong class=\"example\">Example 1:</strong></p>\r\n\r\n<p><img alt=\"\" src=\"https://assets.leetcode.com/uploads/2020/01/06/sample_3_1676.png\" style=\"width: 260px; height: 87px;\" /></p>\r\n\r\n<pre>\r\n<strong>Input:</strong> a = 2, b = 6, c = 5\r\n<strong>Output:</strong> 3\r\n<strong>Explanation: </strong>After flips a = 1 , b = 4 , c = 5 such that (<code>a</code> OR <code>b</code> == <code>c</code>)</pre>\r\n\r\n<p><strong class=\"example\">Example 2:</strong></p>\r\n\r\n<pre>\r\n<strong>Input:</strong> a = 4, b = 2, c = 7\r\n<strong>Output:</strong> 1\r\n</pre>\r\n\r\n<p><strong class=\"example\">Example 3:</strong></p>\r\n\r\n<pre>\r\n<strong>Input:</strong> a = 1, b = 2, c = 3\r\n<strong>Output:</strong> 0\r\n</pre>\r\n\r\n<p>&nbsp;</p>\r\n<p><strong>Constraints:</strong></p>\r\n\r\n<ul>\r\n\t<li><code>1 &lt;= a &lt;= 10^9</code></li>\r\n\t<li><code>1 &lt;= b&nbsp;&lt;= 10^9</code></li>\r\n\t<li><code>1 &lt;= c&nbsp;&lt;= 10^9</code></li>\r\n</ul>",
      "lcSlug": "minimum-flips-to-make-a-or-b-equal-to-c",
      "summary": "Greedy bits — state invariant, then loop."
    }
  ]
};
