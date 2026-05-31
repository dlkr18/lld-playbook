window.PRACTICE_TOPIC = {
  "id": "greedy",
  "title": "Greedy",
  "expected_count": 24,
  "strategy": "<strong>Speed-run:</strong> Prove greedy choice + optimal substructure — intervals and jumps first. Filter <em>Must do</em> first.",
  "subtopics": [
    {
      "id": "intervals",
      "label": "Intervals"
    },
    {
      "id": "jump",
      "label": "Jump Game"
    },
    {
      "id": "scheduling",
      "label": "Scheduling"
    },
    {
      "id": "scan",
      "label": "Linear Scan"
    },
    {
      "id": "heap",
      "label": "+ Heap"
    },
    {
      "id": "sort",
      "label": "Sort"
    }
  ],
  "questions": [
    {
      "id": "gr-01",
      "title": "Jump Game",
      "lc": 55,
      "importance": "must",
      "subtopic": "jump",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums",
          "out": "can reach end?"
        }
      ],
      "approaches": [
        {
          "name": "Greedy farthest",
          "time": "O(n)",
          "space": "O(1)",
          "code": "bool canJump(vector<int>& nums) {\n    int far = 0;\n    for (int i = 0; i < (int)nums.size(); i++) {\n        if (i > far) return false;\n        far = max(far, i + nums[i]);\n    } return true;\n}"
        }
      ],
      "description": "You are given an integer array `nums`. You are initially positioned at the array's first index, and each element in the array represents your maximum jump length at that position.\n\nReturn `true` if you can reach the last index, or `false` otherwise.\n\n \n\nExample 1:\n\nInput: nums = [2,3,1,1,4]\nOutput: true\nExplanation: Jump 1 step from index 0 to 1, then 3 steps to the last index.\n\nExample 2:\n\nInput: nums = [3,2,1,0,4]\nOutput: false\nExplanation: You will always arrive at index 3 no matter what. Its maximum jump length is 0, which makes it impossible to reach the last index.\n\n \n\nConstraints:\n\n\t• `1 4`\n• `0 5`",
      "descriptionHtml": "<p>You are given an integer array <code>nums</code>. You are initially positioned at the array&#39;s <strong>first index</strong>, and each element in the array represents your maximum jump length at that position.</p>\n\n<p>Return <code>true</code><em> if you can reach the last index, or </em><code>false</code><em> otherwise</em>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [2,3,1,1,4]\n<strong>Output:</strong> true\n<strong>Explanation:</strong> Jump 1 step from index 0 to 1, then 3 steps to the last index.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [3,2,1,0,4]\n<strong>Output:</strong> false\n<strong>Explanation:</strong> You will always arrive at index 3 no matter what. Its maximum jump length is 0, which makes it impossible to reach the last index.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= nums.length &lt;= 10<sup>4</sup></code></li>\n\t<li><code>0 &lt;= nums[i] &lt;= 10<sup>5</sup></code></li>\n</ul>\n",
      "lcSlug": "jump-game",
      "summary": "Track farthest reachable index; jump when i hits current end."
    },
    {
      "id": "gr-02",
      "title": "Jump Game II",
      "lc": 45,
      "importance": "must",
      "subtopic": "jump",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums",
          "out": "min jumps"
        }
      ],
      "approaches": [
        {
          "name": "Jump game II",
          "time": "O(n)",
          "space": "O(1)",
          "code": "int jump(vector<int>& nums) {\n    int jumps=0, curEnd=0, farthest=0;\n    for (int i=0;i<(int)nums.size()-1;i++) {\n        farthest=max(farthest, i+nums[i]);\n        if (i==curEnd) { jumps++; curEnd=farthest; }\n    } return jumps;\n}"
        }
      ],
      "description": "You are given a 0-indexed array of integers `nums` of length `n`. You are initially positioned at index 0.\n\nEach element `nums[i]` represents the maximum length of a forward jump from index `i`. In other words, if you are at index `i`, you can jump to any index `(i + j)` where:\n\n\t• `0 \n\nReturn the minimum number of jumps to reach index `n - 1`. The test cases are generated such that you can reach index `n - 1`.\n\n \n\nExample 1:\n\nInput: nums = [2,3,1,1,4]\nOutput: 2\nExplanation: The minimum number of jumps to reach the last index is 2. Jump 1 step from index 0 to 1, then 3 steps to the last index.\n\nExample 2:\n\nInput: nums = [2,3,0,1,4]\nOutput: 2\n\n \n\nConstraints:\n\n\t• `1 4`\n• `0",
      "descriptionHtml": "<p>You are given a <strong>0-indexed</strong> array of integers <code>nums</code> of length <code>n</code>. You are initially positioned at&nbsp;index 0.</p>\n\n<p>Each element <code>nums[i]</code> represents the maximum length of a forward jump from index <code>i</code>. In other words, if you are at index <code>i</code>, you can jump to any index <code>(i + j)</code>&nbsp;where:</p>\n\n<ul>\n\t<li><code>0 &lt;= j &lt;= nums[i]</code> and</li>\n\t<li><code>i + j &lt; n</code></li>\n</ul>\n\n<p>Return <em>the minimum number of jumps to reach index </em><code>n - 1</code>. The test cases are generated such that you can reach index&nbsp;<code>n - 1</code>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [2,3,1,1,4]\n<strong>Output:</strong> 2\n<strong>Explanation:</strong> The minimum number of jumps to reach the last index is 2. Jump 1 step from index 0 to 1, then 3 steps to the last index.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [2,3,0,1,4]\n<strong>Output:</strong> 2\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= nums.length &lt;= 10<sup>4</sup></code></li>\n\t<li><code>0 &lt;= nums[i] &lt;= 1000</code></li>\n\t<li>It&#39;s guaranteed that you can reach <code>nums[n - 1]</code>.</li>\n</ul>\n",
      "lcSlug": "jump-game-ii",
      "summary": "Jump game II — state invariant, then loop."
    },
    {
      "id": "gr-03",
      "title": "Gas Station",
      "lc": 134,
      "importance": "must",
      "subtopic": "circular",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "gas, cost",
          "out": "start index"
        }
      ],
      "approaches": [
        {
          "name": "Gas station",
          "time": "O(n)",
          "space": "O(1)",
          "code": "int canCompleteCircuit(vector<int>& gas, vector<int>& cost) {\n    int total=0, tank=0, start=0;\n    for (int i=0;i<(int)gas.size();i++) {\n        total += gas[i]-cost[i]; tank += gas[i]-cost[i];\n        if (tank < 0) { start=i+1; tank=0; }\n    } return total>=0? start: -1;\n}"
        }
      ],
      "description": "There are `n` gas stations along a circular route, where the amount of gas at the `ith` station is `gas[i]`.\n\nYou have a car with an unlimited gas tank and it costs `cost[i]` of gas to travel from the `ith` station to its next `(i + 1)th` station. You begin the journey with an empty tank at one of the gas stations.\n\nGiven two integer arrays `gas` and `cost`, return the starting gas station's index if you can travel around the circuit once in the clockwise direction, otherwise return `-1`. If there exists a solution, it is guaranteed to be unique.\n\n \n\nExample 1:\n\nInput: gas = [1,2,3,4,5], cost = [3,4,5,1,2]\nOutput: 3\nExplanation:\nStart at station 3 (index 3) and fill up with 4 unit of gas. Your tank = 0 + 4 = 4\nTravel to station 4. Your tank = 4 - 1 + 5 = 8\nTravel to station 0. Your tank = 8 - 2 + 1 = 7\nTravel to station 1. Your tank = 7 - 3 + 2 = 6\nTravel to station 2. Your tank = 6 - 4 + 3 = 5\nTravel to station 3. The cost is 5. Your gas is just enough to travel back to station 3.\nTherefore, return 3 as the starting index.\n\nExample 2:\n\nInput: gas = [2,3,4], cost = [3,4,3]\nOutput: -1\nExplanation:\nYou can't start at station 0 or 1, as there is not enough gas to travel to the next station.\nLet's start at station 2 and fill up with 4 unit of gas. Your tank = 0 + 4 = 4\nTravel to station 0. Your tank = 4 - 3 + 2 = 3\nTravel to station 1. Your tank = 3 - 3 + 3 = 3\nYou cannot travel back to station 2, as it requires 4 unit of gas but you only have 3.\nTherefore, you can't travel around the circuit once no matter where you start.\n\n \n\nConstraints:\n\n\t• `n == gas.length == cost.length`\n• `1 5`\n• `0 4`\n• The input is generated such that the answer is unique.",
      "descriptionHtml": "<p>There are <code>n</code> gas stations along a circular route, where the amount of gas at the <code>i<sup>th</sup></code> station is <code>gas[i]</code>.</p>\n\n<p>You have a car with an unlimited gas tank and it costs <code>cost[i]</code> of gas to travel from the <code>i<sup>th</sup></code> station to its next <code>(i + 1)<sup>th</sup></code> station. You begin the journey with an empty tank at one of the gas stations.</p>\n\n<p>Given two integer arrays <code>gas</code> and <code>cost</code>, return <em>the starting gas station&#39;s index if you can travel around the circuit once in the clockwise direction, otherwise return</em> <code>-1</code>. If there exists a solution, it is <strong>guaranteed</strong> to be <strong>unique</strong>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> gas = [1,2,3,4,5], cost = [3,4,5,1,2]\n<strong>Output:</strong> 3\n<strong>Explanation:</strong>\nStart at station 3 (index 3) and fill up with 4 unit of gas. Your tank = 0 + 4 = 4\nTravel to station 4. Your tank = 4 - 1 + 5 = 8\nTravel to station 0. Your tank = 8 - 2 + 1 = 7\nTravel to station 1. Your tank = 7 - 3 + 2 = 6\nTravel to station 2. Your tank = 6 - 4 + 3 = 5\nTravel to station 3. The cost is 5. Your gas is just enough to travel back to station 3.\nTherefore, return 3 as the starting index.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> gas = [2,3,4], cost = [3,4,3]\n<strong>Output:</strong> -1\n<strong>Explanation:</strong>\nYou can&#39;t start at station 0 or 1, as there is not enough gas to travel to the next station.\nLet&#39;s start at station 2 and fill up with 4 unit of gas. Your tank = 0 + 4 = 4\nTravel to station 0. Your tank = 4 - 3 + 2 = 3\nTravel to station 1. Your tank = 3 - 3 + 3 = 3\nYou cannot travel back to station 2, as it requires 4 unit of gas but you only have 3.\nTherefore, you can&#39;t travel around the circuit once no matter where you start.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>n == gas.length == cost.length</code></li>\n\t<li><code>1 &lt;= n &lt;= 10<sup>5</sup></code></li>\n\t<li><code>0 &lt;= gas[i], cost[i] &lt;= 10<sup>4</sup></code></li>\n\t<li>The input is generated such that the answer is unique.</li>\n</ul>\n",
      "lcSlug": "gas-station",
      "summary": "Gas station — state invariant, then loop."
    },
    {
      "id": "gr-04",
      "title": "Hand of Straights",
      "lc": 846,
      "importance": "nice",
      "subtopic": "scheduling",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "hand, groupSize",
          "out": "true/false"
        }
      ],
      "approaches": [
        {
          "name": "Sort + greedy groups",
          "time": "O(n log n)",
          "space": "O(n)",
          "code": "bool isNStraightHand(vector<int>& hand, int gs) {\n    if(hand.size()%gs) return false;\n    map<int,int> cnt; for(int x:hand) cnt[x]++;\n    while(!cnt.empty()){\n        int start=cnt.begin()->first;\n        for(int k=0;k<gs;k++){\n            if(!cnt.count(start+k)) return false;\n            if(--cnt[start+k]==0) cnt.erase(start+k);\n        }\n    } return true;\n}"
        }
      ],
      "description": "Alice has some number of cards and she wants to rearrange the cards into groups so that each group is of size `groupSize`, and consists of `groupSize` consecutive cards.\n\nGiven an integer array `hand` where `hand[i]` is the value written on the `ith` card and an integer `groupSize`, return `true` if she can rearrange the cards, or `false` otherwise.\n\n \n\nExample 1:\n\nInput: hand = [1,2,3,6,2,3,4,7,8], groupSize = 3\nOutput: true\nExplanation: Alice's hand can be rearranged as [1,2,3],[2,3,4],[6,7,8]\n\nExample 2:\n\nInput: hand = [1,2,3,4,5], groupSize = 4\nOutput: false\nExplanation: Alice's hand can not be rearranged into groups of 4.\n\n \n\nConstraints:\n\n\t• `1 4`\n• `0 9`\n• `1 \n\n \n\nNote: This question is the same as 1296: https://leetcode.com/problems/divide-array-in-sets-of-k-consecutive-numbers/",
      "descriptionHtml": "<p>Alice has some number of cards and she wants to rearrange the cards into groups so that each group is of size <code>groupSize</code>, and consists of <code>groupSize</code> consecutive cards.</p>\n\n<p>Given an integer array <code>hand</code> where <code>hand[i]</code> is the value written on the <code>i<sup>th</sup></code> card and an integer <code>groupSize</code>, return <code>true</code> if she can rearrange the cards, or <code>false</code> otherwise.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> hand = [1,2,3,6,2,3,4,7,8], groupSize = 3\n<strong>Output:</strong> true\n<strong>Explanation:</strong> Alice&#39;s hand can be rearranged as [1,2,3],[2,3,4],[6,7,8]\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> hand = [1,2,3,4,5], groupSize = 4\n<strong>Output:</strong> false\n<strong>Explanation:</strong> Alice&#39;s hand can not be rearranged into groups of 4.\n\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= hand.length &lt;= 10<sup>4</sup></code></li>\n\t<li><code>0 &lt;= hand[i] &lt;= 10<sup>9</sup></code></li>\n\t<li><code>1 &lt;= groupSize &lt;= hand.length</code></li>\n</ul>\n\n<p>&nbsp;</p>\n<p><strong>Note:</strong> This question is the same as 1296: <a href=\"https://leetcode.com/problems/divide-array-in-sets-of-k-consecutive-numbers/\" target=\"_blank\">https://leetcode.com/problems/divide-array-in-sets-of-k-consecutive-numbers/</a></p>\n",
      "lcSlug": "hand-of-straights",
      "summary": "Sort + greedy groups — state invariant, then loop."
    },
    {
      "id": "gr-05",
      "title": "Merge Triplets to Form Target",
      "lc": 1899,
      "importance": "nice",
      "subtopic": "intervals",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "triplets, target",
          "out": "possible?"
        }
      ],
      "approaches": [
        {
          "name": "Greedy triplet cover",
          "time": "O(n)",
          "space": "O(1)",
          "code": "bool mergeTriplets(vector<vector<int>>& t, vector<int>& target) {\n    bool a=false,b=false,c=false;\n    for(auto& x:t){\n        if(x[0]<=target[0]&&x[1]<=target[1]&&x[2]<=target[2]){\n            if(x[0]==target[0]) a=true;\n            if(x[1]==target[1]) b=true;\n            if(x[2]==target[2]) c=true;\n        }\n    } return a&&b&&c;\n}"
        }
      ],
      "description": "A triplet is an array of three integers. You are given a 2D integer array `triplets`, where `triplets[i] = [ai, bi, ci]` describes the `ith` triplet. You are also given an integer array `target = [x, y, z]` that describes the triplet you want to obtain.\n\nTo obtain `target`, you may apply the following operation on `triplets` any number of times (possibly zero):\n\n\t• Choose two indices (0-indexed) `i` and `j` (`i != j`) and update `triplets[j]` to become `[max(ai, aj), max(bi, bj), max(ci, cj)]`.\n\n\t\n\t\t• For example, if `triplets[i] = [2, 5, 3]` and `triplets[j] = [1, 7, 5]`, `triplets[j]` will be updated to `[max(2, 1), max(5, 7), max(3, 5)] = [2, 7, 5]`.\n\n\t\n\nReturn `true` if it is possible to obtain the `target` triplet `[x, y, z]` as an element of `triplets`, or `false` otherwise.\n\n \n\nExample 1:\n\nInput: triplets = [[2,5,3],[1,8,4],[1,7,5]], target = [2,7,5]\nOutput: true\nExplanation: Perform the following operations:\n- Choose the first and last triplets [[2,5,3],[1,8,4],[1,7,5]]. Update the last triplet to be [max(2,1), max(5,7), max(3,5)] = [2,7,5]. triplets = [[2,5,3],[1,8,4],[2,7,5]]\nThe target triplet [2,7,5] is now an element of triplets.\n\nExample 2:\n\nInput: triplets = [[3,4,5],[4,5,6]], target = [3,2,5]\nOutput: false\nExplanation: It is impossible to have [3,2,5] as an element because there is no 2 in any of the triplets.\n\nExample 3:\n\nInput: triplets = [[2,5,3],[2,3,4],[1,2,5],[5,2,3]], target = [5,5,5]\nOutput: true\nExplanation: Perform the following operations:\n- Choose the first and third triplets [[2,5,3],[2,3,4],[1,2,5],[5,2,3]]. Update the third triplet to be [max(2,1), max(5,2), max(3,5)] = [2,5,5]. triplets = [[2,5,3],[2,3,4],[2,5,5],[5,2,3]].\n- Choose the third and fourth triplets [[2,5,3],[2,3,4],[2,5,5],[5,2,3]]. Update the fourth triplet to be [max(2,5), max(5,2), max(5,3)] = [5,5,5]. triplets = [[2,5,3],[2,3,4],[2,5,5],[5,5,5]].\nThe target triplet [5,5,5] is now an element of triplets.\n\n \n\nConstraints:\n\n\t• `1 5`\n• `triplets[i].length == target.length == 3`\n• `1 i, bi, ci, x, y, z",
      "descriptionHtml": "<p>A <strong>triplet</strong> is an array of three integers. You are given a 2D integer array <code>triplets</code>, where <code>triplets[i] = [a<sub>i</sub>, b<sub>i</sub>, c<sub>i</sub>]</code> describes the <code>i<sup>th</sup></code> <strong>triplet</strong>. You are also given an integer array <code>target = [x, y, z]</code> that describes the <strong>triplet</strong> you want to obtain.</p>\n\n<p>To obtain <code>target</code>, you may apply the following operation on <code>triplets</code> <strong>any number</strong> of times (possibly <strong>zero</strong>):</p>\n\n<ul>\n\t<li>Choose two indices (<strong>0-indexed</strong>) <code>i</code> and <code>j</code> (<code>i != j</code>) and <strong>update</strong> <code>triplets[j]</code> to become <code>[max(a<sub>i</sub>, a<sub>j</sub>), max(b<sub>i</sub>, b<sub>j</sub>), max(c<sub>i</sub>, c<sub>j</sub>)]</code>.\n\n\t<ul>\n\t\t<li>For example, if <code>triplets[i] = [2, 5, 3]</code> and <code>triplets[j] = [1, 7, 5]</code>, <code>triplets[j]</code> will be updated to <code>[max(2, 1), max(5, 7), max(3, 5)] = [2, 7, 5]</code>.</li>\n\t</ul>\n\t</li>\n</ul>\n\n<p>Return <code>true</code> <em>if it is possible to obtain the </em><code>target</code><em> <strong>triplet</strong> </em><code>[x, y, z]</code><em> as an<strong> element</strong> of </em><code>triplets</code><em>, or </em><code>false</code><em> otherwise</em>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> triplets = [[2,5,3],[1,8,4],[1,7,5]], target = [2,7,5]\n<strong>Output:</strong> true\n<strong>Explanation:</strong> Perform the following operations:\n- Choose the first and last triplets [<u>[2,5,3]</u>,[1,8,4],<u>[1,7,5]</u>]. Update the last triplet to be [max(2,1), max(5,7), max(3,5)] = [2,7,5]. triplets = [[2,5,3],[1,8,4],<u>[2,7,5]</u>]\nThe target triplet [2,7,5] is now an element of triplets.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> triplets = [[3,4,5],[4,5,6]], target = [3,2,5]\n<strong>Output:</strong> false\n<strong>Explanation:</strong> It is impossible to have [3,2,5] as an element because there is no 2 in any of the triplets.\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> triplets = [[2,5,3],[2,3,4],[1,2,5],[5,2,3]], target = [5,5,5]\n<strong>Output:</strong> true\n<strong>Explanation: </strong>Perform the following operations:\n- Choose the first and third triplets [<u>[2,5,3]</u>,[2,3,4],<u>[1,2,5]</u>,[5,2,3]]. Update the third triplet to be [max(2,1), max(5,2), max(3,5)] = [2,5,5]. triplets = [[2,5,3],[2,3,4],<u>[2,5,5]</u>,[5,2,3]].\n- Choose the third and fourth triplets [[2,5,3],[2,3,4],<u>[2,5,5]</u>,<u>[5,2,3]</u>]. Update the fourth triplet to be [max(2,5), max(5,2), max(5,3)] = [5,5,5]. triplets = [[2,5,3],[2,3,4],[2,5,5],<u>[5,5,5]</u>].\nThe target triplet [5,5,5] is now an element of triplets.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= triplets.length &lt;= 10<sup>5</sup></code></li>\n\t<li><code>triplets[i].length == target.length == 3</code></li>\n\t<li><code>1 &lt;= a<sub>i</sub>, b<sub>i</sub>, c<sub>i</sub>, x, y, z &lt;= 1000</code></li>\n</ul>\n",
      "lcSlug": "merge-triplets-to-form-target-triplet",
      "summary": "Greedy triplet cover — Sort intervals; merge, sweep line, or greedy by end time."
    },
    {
      "id": "gr-06",
      "title": "Partition Labels",
      "lc": 763,
      "importance": "must",
      "subtopic": "intervals",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "s",
          "out": "partition sizes"
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
      "id": "gr-07",
      "title": "Valid Parenthesis String",
      "lc": 678,
      "importance": "should",
      "subtopic": "greedy",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "s with *",
          "out": "valid?"
        }
      ],
      "approaches": [
        {
          "name": "Two scans",
          "time": "O(n)",
          "space": "O(1)",
          "code": "bool checkValidString(string s) {\n    int lo = 0, hi = 0;\n    for (char ch : s) {\n        lo += (ch != ')'); hi += (ch != '(');\n        if (hi < 0) return false;\n        lo = max(lo, 0);\n    }\n    return lo == 0;\n}"
        }
      ],
      "description": "Given a string `s` containing only three types of characters: `'('`, `')'` and `'*'`, return `true` if `s` is valid.\n\nThe following rules define a valid string:\n\n\t• Any left parenthesis `'('` must have a corresponding right parenthesis `')'`.\n• Any right parenthesis `')'` must have a corresponding left parenthesis `'('`.\n• Left parenthesis `'('` must go before the corresponding right parenthesis `')'`.\n• `'*'` could be treated as a single right parenthesis `')'` or a single left parenthesis `'('` or an empty string `\"\"`.\n\n \n\nExample 1:\n\nInput: s = \"()\"\nOutput: true\n\nExample 2:\n\nInput: s = \"(*)\"\nOutput: true\n\nExample 3:\n\nInput: s = \"(*))\"\nOutput: true\n\n \n\nConstraints:\n\n\t• `1",
      "descriptionHtml": "<p>Given a string <code>s</code> containing only three types of characters: <code>&#39;(&#39;</code>, <code>&#39;)&#39;</code> and <code>&#39;*&#39;</code>, return <code>true</code> <em>if</em> <code>s</code> <em>is <strong>valid</strong></em>.</p>\n\n<p>The following rules define a <strong>valid</strong> string:</p>\n\n<ul>\n\t<li>Any left parenthesis <code>&#39;(&#39;</code> must have a corresponding right parenthesis <code>&#39;)&#39;</code>.</li>\n\t<li>Any right parenthesis <code>&#39;)&#39;</code> must have a corresponding left parenthesis <code>&#39;(&#39;</code>.</li>\n\t<li>Left parenthesis <code>&#39;(&#39;</code> must go before the corresponding right parenthesis <code>&#39;)&#39;</code>.</li>\n\t<li><code>&#39;*&#39;</code> could be treated as a single right parenthesis <code>&#39;)&#39;</code> or a single left parenthesis <code>&#39;(&#39;</code> or an empty string <code>&quot;&quot;</code>.</li>\n</ul>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<pre><strong>Input:</strong> s = \"()\"\n<strong>Output:</strong> true\n</pre><p><strong class=\"example\">Example 2:</strong></p>\n<pre><strong>Input:</strong> s = \"(*)\"\n<strong>Output:</strong> true\n</pre><p><strong class=\"example\">Example 3:</strong></p>\n<pre><strong>Input:</strong> s = \"(*))\"\n<strong>Output:</strong> true\n</pre>\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= s.length &lt;= 100</code></li>\n\t<li><code>s[i]</code> is <code>&#39;(&#39;</code>, <code>&#39;)&#39;</code> or <code>&#39;*&#39;</code>.</li>\n</ul>\n",
      "lcSlug": "valid-parenthesis-string",
      "summary": "Low/high balance for '(' — '*' can be +1, -1, or 0."
    },
    {
      "id": "gr-08",
      "title": "Candy",
      "lc": 135,
      "importance": "should",
      "subtopic": "scan",
      "difficulty": "Hard",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "ratings",
          "out": "min candies"
        }
      ],
      "approaches": [
        {
          "name": "Two pass",
          "time": "O(n)",
          "space": "O(1)",
          "code": "int candy(vector<int>& ratings) {\n    int n = ratings.size(); vector<int> c(n, 1);\n    for (int i = 1; i < n; i++) if (ratings[i] > ratings[i-1]) c[i] = c[i-1] + 1;\n    for (int i = n-2; i >= 0; i--) if (ratings[i] > ratings[i+1]) c[i] = max(c[i], c[i+1] + 1);\n    return accumulate(c.begin(), c.end(), 0);\n}"
        }
      ],
      "description": "There are `n` children standing in a line. Each child is assigned a rating value given in the integer array `ratings`.\n\nYou are giving candies to these children subjected to the following requirements:\n\n\t• Each child must have at least one candy.\n• Children with a higher rating get more candies than their neighbors.\n\nReturn the minimum number of candies you need to have to distribute the candies to the children.\n\n \n\nExample 1:\n\nInput: ratings = [1,0,2]\nOutput: 5\nExplanation: You can allocate to the first, second and third child with 2, 1, 2 candies respectively.\n\nExample 2:\n\nInput: ratings = [1,2,2]\nOutput: 4\nExplanation: You can allocate to the first, second and third child with 1, 2, 1 candies respectively.\nThe third child gets 1 candy because it satisfies the above two conditions.\n\n \n\nConstraints:\n\n\t• `n == ratings.length`\n• `1 4`\n• `0 4`",
      "descriptionHtml": "<p>There are <code>n</code> children standing in a line. Each child is assigned a rating value given in the integer array <code>ratings</code>.</p>\n\n<p>You are giving candies to these children subjected to the following requirements:</p>\n\n<ul>\n\t<li>Each child must have at least one candy.</li>\n\t<li>Children with a higher rating get more candies than their neighbors.</li>\n</ul>\n\n<p>Return <em>the minimum number of candies you need to have to distribute the candies to the children</em>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> ratings = [1,0,2]\n<strong>Output:</strong> 5\n<strong>Explanation:</strong> You can allocate to the first, second and third child with 2, 1, 2 candies respectively.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> ratings = [1,2,2]\n<strong>Output:</strong> 4\n<strong>Explanation:</strong> You can allocate to the first, second and third child with 1, 2, 1 candies respectively.\nThe third child gets 1 candy because it satisfies the above two conditions.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>n == ratings.length</code></li>\n\t<li><code>1 &lt;= n &lt;= 2 * 10<sup>4</sup></code></li>\n\t<li><code>0 &lt;= ratings[i] &lt;= 2 * 10<sup>4</sup></code></li>\n</ul>\n",
      "lcSlug": "candy",
      "summary": "Two pass — state invariant, then loop."
    },
    {
      "id": "gr-09",
      "title": "Queue Reconstruction by Height",
      "lc": 406,
      "importance": "should",
      "subtopic": "sort",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "people",
          "out": "reconstructed"
        }
      ],
      "approaches": [
        {
          "name": "Sort + insert",
          "time": "O(n^2)",
          "space": "O(n)",
          "code": "vector<vector<int>> reconstructQueue(vector<vector<int>>& people) {\n    sort(people.begin(), people.end(), [](auto& a, auto& b) {\n        return a[0] > b[0] || (a[0] == b[0] && a[1] < b[1]);\n    });\n    vector<vector<int>> ans;\n    for (auto& p : people) ans.insert(ans.begin() + p[1], p);\n    return ans;\n}"
        }
      ],
      "description": "You are given an array of people, `people`, which are the attributes of some people in a queue (not necessarily in order). Each `people[i] = [hi, ki]` represents the `ith` person of height `hi` with exactly `ki` other people in front who have a height greater than or equal to `hi`.\n\nReconstruct and return the queue that is represented by the input array `people`. The returned queue should be formatted as an array `queue`, where `queue[j] = [hj, kj]` is the attributes of the `jth` person in the queue (`queue[0]` is the person at the front of the queue).\n\n \n\nExample 1:\n\nInput: people = [[7,0],[4,4],[7,1],[5,0],[6,1],[5,2]]\nOutput: [[5,0],[7,0],[5,2],[6,1],[4,4],[7,1]]\nExplanation:\nPerson 0 has height 5 with no other people taller or the same height in front.\nPerson 1 has height 7 with no other people taller or the same height in front.\nPerson 2 has height 5 with two persons taller or the same height in front, which is person 0 and 1.\nPerson 3 has height 6 with one person taller or the same height in front, which is person 1.\nPerson 4 has height 4 with four people taller or the same height in front, which are people 0, 1, 2, and 3.\nPerson 5 has height 7 with one person taller or the same height in front, which is person 1.\nHence [[5,0],[7,0],[5,2],[6,1],[4,4],[7,1]] is the reconstructed queue.\n\nExample 2:\n\nInput: people = [[6,0],[5,0],[4,0],[3,2],[2,2],[1,4]]\nOutput: [[4,0],[5,0],[2,2],[3,2],[1,4],[6,0]]\n\n \n\nConstraints:\n\n\t• `1 i 6`\n• `0 i",
      "descriptionHtml": "<p>You are given an array of people, <code>people</code>, which are the attributes of some people in a queue (not necessarily in order). Each <code>people[i] = [h<sub>i</sub>, k<sub>i</sub>]</code> represents the <code>i<sup>th</sup></code> person of height <code>h<sub>i</sub></code> with <strong>exactly</strong> <code>k<sub>i</sub></code> other people in front who have a height greater than or equal to <code>h<sub>i</sub></code>.</p>\n\n<p>Reconstruct and return <em>the queue that is represented by the input array </em><code>people</code>. The returned queue should be formatted as an array <code>queue</code>, where <code>queue[j] = [h<sub>j</sub>, k<sub>j</sub>]</code> is the attributes of the <code>j<sup>th</sup></code> person in the queue (<code>queue[0]</code> is the person at the front of the queue).</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> people = [[7,0],[4,4],[7,1],[5,0],[6,1],[5,2]]\n<strong>Output:</strong> [[5,0],[7,0],[5,2],[6,1],[4,4],[7,1]]\n<strong>Explanation:</strong>\nPerson 0 has height 5 with no other people taller or the same height in front.\nPerson 1 has height 7 with no other people taller or the same height in front.\nPerson 2 has height 5 with two persons taller or the same height in front, which is person 0 and 1.\nPerson 3 has height 6 with one person taller or the same height in front, which is person 1.\nPerson 4 has height 4 with four people taller or the same height in front, which are people 0, 1, 2, and 3.\nPerson 5 has height 7 with one person taller or the same height in front, which is person 1.\nHence [[5,0],[7,0],[5,2],[6,1],[4,4],[7,1]] is the reconstructed queue.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> people = [[6,0],[5,0],[4,0],[3,2],[2,2],[1,4]]\n<strong>Output:</strong> [[4,0],[5,0],[2,2],[3,2],[1,4],[6,0]]\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= people.length &lt;= 2000</code></li>\n\t<li><code>0 &lt;= h<sub>i</sub> &lt;= 10<sup>6</sup></code></li>\n\t<li><code>0 &lt;= k<sub>i</sub> &lt; people.length</code></li>\n\t<li>It is guaranteed that the queue can be reconstructed.</li>\n</ul>\n",
      "lcSlug": "queue-reconstruction-by-height",
      "summary": "Sort by height desc, insert at index p[i] — reconstruct queue."
    },
    {
      "id": "gr-10",
      "title": "Task Scheduler",
      "lc": 621,
      "importance": "must",
      "subtopic": "scheduling",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "tasks, n",
          "out": "min intervals"
        }
      ],
      "approaches": [
        {
          "name": "Task scheduler",
          "time": "O(n)",
          "space": "O(1)",
          "code": "int leastInterval(vector<char>& tasks, int n) {\n    int cnt[26]={}; for (char c: tasks) cnt[c-'A']++;\n    int mx=*max_element(cnt,cnt+26), same=0;\n    for (int x: cnt) if (x==mx) same++;\n    return max((int)tasks.size(), (mx-1)*(n+1)+same);\n}"
        }
      ],
      "description": "You are given an array of CPU `tasks`, each labeled with a letter from A to Z, and a number `n`. Each CPU interval can be idle or allow the completion of one task. Tasks can be completed in any order, but there's a constraint: there has to be a gap of at least `n` intervals between two tasks with the same label.\n\nReturn the minimum number of CPU intervals required to complete all tasks.\n\n \n\nExample 1:\n\nInput: tasks = [\"A\",\"A\",\"A\",\"B\",\"B\",\"B\"], n = 2\n\nOutput: 8\n\nExplanation: A possible sequence is: A -> B -> idle -> A -> B -> idle -> A -> B.\n\nAfter completing task A, you must wait two intervals before doing A again. The same applies to task B. In the 3rd interval, neither A nor B can be done, so you idle. By the 4th interval, you can do A again as 2 intervals have passed.\n\nExample 2:\n\nInput: tasks = [\"A\",\"C\",\"A\",\"B\",\"D\",\"B\"], n = 1\n\nOutput: 6\n\nExplanation: A possible sequence is: A -> B -> C -> D -> A -> B.\n\nWith a cooling interval of 1, you can repeat a task after just one other task.\n\nExample 3:\n\nInput: tasks = [\"A\",\"A\",\"A\", \"B\",\"B\",\"B\"], n = 3\n\nOutput: 10\n\nExplanation: A possible sequence is: A -> B -> idle -> idle -> A -> B -> idle -> idle -> A -> B.\n\nThere are only two types of tasks, A and B, which need to be separated by 3 intervals. This leads to idling twice between repetitions of these tasks.\n\n \n\nConstraints:\n\n\t• `1 4`\n• `tasks[i]` is an uppercase English letter.\n• `0",
      "descriptionHtml": "<p>You are given an array of CPU <code>tasks</code>, each labeled with a letter from A to Z, and a number <code>n</code>. Each CPU interval can be idle or allow the completion of one task. Tasks can be completed in any order, but there&#39;s a constraint: there has to be a gap of <strong>at least</strong> <code>n</code> intervals between two tasks with the same label.</p>\n\n<p>Return the <strong>minimum</strong> number of CPU intervals required to complete all tasks.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<div class=\"example-block\" style=\"\n    border-color: var(--border-tertiary);\n    border-left-width: 2px;\n    color: var(--text-secondary);\n    font-size: .875rem;\n    margin-bottom: 1rem;\n    margin-top: 1rem;\n    overflow: visible;\n    padding-left: 1rem;\n\">\n<p><strong>Input:</strong> <span class=\"example-io\" style=\"\n    font-family: Menlo,sans-serif;\n    font-size: 0.85rem;\n\">tasks = [&quot;A&quot;,&quot;A&quot;,&quot;A&quot;,&quot;B&quot;,&quot;B&quot;,&quot;B&quot;], n = 2</span></p>\n\n<p><strong>Output:</strong> <span class=\"example-io\" style=\"\nfont-family: Menlo,sans-serif;\nfont-size: 0.85rem;\n\">8</span></p>\n\n<p><strong>Explanation:</strong> A possible sequence is: A -&gt; B -&gt; idle -&gt; A -&gt; B -&gt; idle -&gt; A -&gt; B.</p>\n\n<p>After completing task A, you must wait two intervals before doing A again. The same applies to task B. In the 3<sup>rd</sup> interval, neither A nor B can be done, so you idle. By the 4<sup>th</sup> interval, you can do A again as 2 intervals have passed.</p>\n</div>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<div class=\"example-block\" style=\"\n    border-color: var(--border-tertiary);\n    border-left-width: 2px;\n    color: var(--text-secondary);\n    font-size: .875rem;\n    margin-bottom: 1rem;\n    margin-top: 1rem;\n    overflow: visible;\n    padding-left: 1rem;\n\">\n<p><strong>Input:</strong> <span class=\"example-io\" style=\"\n    font-family: Menlo,sans-serif;\n    font-size: 0.85rem;\n\">tasks = [&quot;A&quot;,&quot;C&quot;,&quot;A&quot;,&quot;B&quot;,&quot;D&quot;,&quot;B&quot;], n = 1</span></p>\n\n<p><strong>Output:</strong> <span class=\"example-io\" style=\"\n    font-family: Menlo,sans-serif;\n    font-size: 0.85rem;\n\">6</span></p>\n\n<p><strong>Explanation:</strong> A possible sequence is: A -&gt; B -&gt; C -&gt; D -&gt; A -&gt; B.</p>\n\n<p>With a cooling interval of 1, you can repeat a task after just one other task.</p>\n</div>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<div class=\"example-block\" style=\"\n    border-color: var(--border-tertiary);\n    border-left-width: 2px;\n    color: var(--text-secondary);\n    font-size: .875rem;\n    margin-bottom: 1rem;\n    margin-top: 1rem;\n    overflow: visible;\n    padding-left: 1rem;\n\">\n<p><strong>Input:</strong> <span class=\"example-io\" style=\"\n    font-family: Menlo,sans-serif;\n    font-size: 0.85rem;\n\">tasks = [&quot;A&quot;,&quot;A&quot;,&quot;A&quot;, &quot;B&quot;,&quot;B&quot;,&quot;B&quot;], n = 3</span></p>\n\n<p><strong>Output:</strong> <span class=\"example-io\" style=\"\n    font-family: Menlo,sans-serif;\n    font-size: 0.85rem;\n\">10</span></p>\n\n<p><strong>Explanation:</strong> A possible sequence is: A -&gt; B -&gt; idle -&gt; idle -&gt; A -&gt; B -&gt; idle -&gt; idle -&gt; A -&gt; B.</p>\n\n<p>There are only two types of tasks, A and B, which need to be separated by 3 intervals. This leads to idling twice between repetitions of these tasks.</p>\n</div>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= tasks.length &lt;= 10<sup>4</sup></code></li>\n\t<li><code>tasks[i]</code> is an uppercase English letter.</li>\n\t<li><code>0 &lt;= n &lt;= 100</code></li>\n</ul>\n",
      "lcSlug": "task-scheduler",
      "summary": "Task scheduler — state invariant, then loop."
    },
    {
      "id": "gr-11",
      "title": "Minimum Number of Arrows",
      "lc": 452,
      "importance": "should",
      "subtopic": "intervals",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "balloons",
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
      "id": "gr-12",
      "title": "Non-overlapping Intervals",
      "lc": 435,
      "importance": "must",
      "subtopic": "intervals",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "intervals",
          "out": "min removals"
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
      "id": "gr-13",
      "title": "Largest Number",
      "lc": 179,
      "importance": "should",
      "subtopic": "sort",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums",
          "out": "largest concat"
        }
      ],
      "approaches": [
        {
          "name": "Largest number",
          "time": "O(n log n)",
          "space": "O(n)",
          "code": "string largestNumber(vector<int>& nums) {\n    vector<string> s; for (int x: nums) s.push_back(to_string(x));\n    sort(s.begin(), s.end(), [](string& a, string& b){ return a+b > b+a; });\n    if (s[0]==\"0\") return \"0\";\n    string ans; for (auto& x: s) ans+=x; return ans;\n}"
        }
      ],
      "description": "Given a list of non-negative integers `nums`, arrange them such that they form the largest number and return it.\n\nSince the result may be very large, so you need to return a string instead of an integer.\n\n \n\nExample 1:\n\nInput: nums = [10,2]\nOutput: \"210\"\n\nExample 2:\n\nInput: nums = [3,30,34,5,9]\nOutput: \"9534330\"\n\n \n\nConstraints:\n\n\t• `1 9`",
      "descriptionHtml": "<p>Given a list of non-negative integers <code>nums</code>, arrange them such that they form the largest number and return it.</p>\n\n<p>Since the result may be very large, so you need to return a string instead of an integer.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [10,2]\n<strong>Output:</strong> &quot;210&quot;\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> nums = [3,30,34,5,9]\n<strong>Output:</strong> &quot;9534330&quot;\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= nums.length &lt;= 100</code></li>\n\t<li><code>0 &lt;= nums[i] &lt;= 10<sup>9</sup></code></li>\n</ul>\n",
      "lcSlug": "largest-number",
      "summary": "Largest number — state invariant, then loop."
    },
    {
      "id": "gr-14",
      "title": "Assign Cookies",
      "lc": 455,
      "importance": "nice",
      "subtopic": "two-ptr",
      "difficulty": "Easy",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "g, s",
          "out": "max content"
        }
      ],
      "approaches": [
        {
          "name": "Sort + two pointers",
          "time": "O(n log n)",
          "space": "O(1)",
          "code": "int findContentChildren(vector<int>& g, vector<int>& s) {\n    sort(g.begin(),g.end()); sort(s.begin(),s.end());\n    int i=0,j=0,ans=0;\n    while(i<(int)g.size()&&j<(int)s.size()){\n        if(s[j]>=g[i]){ ans++; i++; } j++;\n    } return ans;\n}"
        }
      ],
      "description": "Assume you are an awesome parent and want to give your children some cookies. But, you should give each child at most one cookie.\n\nEach child `i` has a greed factor `g[i]`, which is the minimum size of a cookie that the child will be content with; and each cookie `j` has a size `s[j]`. If `s[j] >= g[i]`, we can assign the cookie `j` to the child `i`, and the child `i` will be content. Your goal is to maximize the number of your content children and output the maximum number.\n\n \n\nExample 1:\n\nInput: g = [1,2,3], s = [1,1]\nOutput: 1\nExplanation: You have 3 children and 2 cookies. The greed factors of 3 children are 1, 2, 3. \nAnd even though you have 2 cookies, since their size is both 1, you could only make the child whose greed factor is 1 content.\nYou need to output 1.\n\nExample 2:\n\nInput: g = [1,2], s = [1,2,3]\nOutput: 2\nExplanation: You have 2 children and 3 cookies. The greed factors of 2 children are 1, 2. \nYou have 3 cookies and their sizes are big enough to gratify all of the children, \nYou need to output 2.\n\n \n\nConstraints:\n\n\t• `1 4`\n• `0 4`\n• `1 31 - 1`\n\n \n\nNote: This question is the same as  2410: Maximum Matching of Players With Trainers.",
      "descriptionHtml": "<p>Assume you are an awesome parent and want to give your children some cookies. But, you should give each child at most one cookie.</p>\n\n<p>Each child <code>i</code> has a greed factor <code>g[i]</code>, which is the minimum size of a cookie that the child will be content with; and each cookie <code>j</code> has a size <code>s[j]</code>. If <code>s[j] &gt;= g[i]</code>, we can assign the cookie <code>j</code> to the child <code>i</code>, and the child <code>i</code> will be content. Your goal is to maximize the number of your content children and output the maximum number.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> g = [1,2,3], s = [1,1]\n<strong>Output:</strong> 1\n<strong>Explanation:</strong> You have 3 children and 2 cookies. The greed factors of 3 children are 1, 2, 3. \nAnd even though you have 2 cookies, since their size is both 1, you could only make the child whose greed factor is 1 content.\nYou need to output 1.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> g = [1,2], s = [1,2,3]\n<strong>Output:</strong> 2\n<strong>Explanation:</strong> You have 2 children and 3 cookies. The greed factors of 2 children are 1, 2. \nYou have 3 cookies and their sizes are big enough to gratify all of the children, \nYou need to output 2.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= g.length &lt;= 3 * 10<sup>4</sup></code></li>\n\t<li><code>0 &lt;= s.length &lt;= 3 * 10<sup>4</sup></code></li>\n\t<li><code>1 &lt;= g[i], s[j] &lt;= 2<sup>31</sup> - 1</code></li>\n</ul>\n\n<p>&nbsp;</p>\n<p><strong>Note:</strong> This question is the same as <a href=\"https://leetcode.com/problems/maximum-matching-of-players-with-trainers/description/\" target=\"_blank\"> 2410: Maximum Matching of Players With Trainers.</a></p>\n",
      "lcSlug": "assign-cookies",
      "summary": "Sort first; l/r or fixed i + two pointers on rest."
    },
    {
      "id": "gr-15",
      "title": "Boats to Save People",
      "lc": 881,
      "importance": "should",
      "subtopic": "two-ptr",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "people, limit",
          "out": "boats"
        }
      ],
      "approaches": [
        {
          "name": "Two pointers",
          "time": "O(n log n)",
          "space": "O(1)",
          "code": "int numRescueBoats(vector<int>& people, int limit) {\n    sort(people.begin(), people.end());\n    int l = 0, r = (int)people.size()-1, ans = 0;\n    while (l <= r) {\n        ans++;\n        if (people[l] + people[r] <= limit) l++;\n        r--;\n    }\n    return ans;\n}"
        }
      ],
      "description": "You are given an array `people` where `people[i]` is the weight of the `ith` person, and an infinite number of boats where each boat can carry a maximum weight of `limit`. Each boat carries at most two people at the same time, provided the sum of the weight of those people is at most `limit`.\n\nReturn the minimum number of boats to carry every given person.\n\n \n\nExample 1:\n\nInput: people = [1,2], limit = 3\nOutput: 1\nExplanation: 1 boat (1, 2)\n\nExample 2:\n\nInput: people = [3,2,2,1], limit = 3\nOutput: 3\nExplanation: 3 boats (1, 2), (2) and (3)\n\nExample 3:\n\nInput: people = [3,5,3,4], limit = 5\nOutput: 4\nExplanation: 4 boats (3), (3), (4), (5)\n\n \n\nConstraints:\n\n\t• `1 4`\n• `1 4`",
      "descriptionHtml": "<p>You are given an array <code>people</code> where <code>people[i]</code> is the weight of the <code>i<sup>th</sup></code> person, and an <strong>infinite number of boats</strong> where each boat can carry a maximum weight of <code>limit</code>. Each boat carries at most two people at the same time, provided the sum of the weight of those people is at most <code>limit</code>.</p>\n\n<p>Return <em>the minimum number of boats to carry every given person</em>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> people = [1,2], limit = 3\n<strong>Output:</strong> 1\n<strong>Explanation:</strong> 1 boat (1, 2)\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> people = [3,2,2,1], limit = 3\n<strong>Output:</strong> 3\n<strong>Explanation:</strong> 3 boats (1, 2), (2) and (3)\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> people = [3,5,3,4], limit = 5\n<strong>Output:</strong> 4\n<strong>Explanation:</strong> 4 boats (3), (3), (4), (5)\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= people.length &lt;= 5 * 10<sup>4</sup></code></li>\n\t<li><code>1 &lt;= people[i] &lt;= limit &lt;= 3 * 10<sup>4</sup></code></li>\n</ul>\n",
      "lcSlug": "boats-to-save-people",
      "summary": "Opposite ends or same direction — move based on comparison/invariant."
    },
    {
      "id": "gr-16",
      "title": "Minimum Add to Make Parentheses Valid",
      "lc": 921,
      "importance": "should",
      "subtopic": "scan",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "s",
          "out": "additions"
        }
      ],
      "approaches": [
        {
          "name": "Balance scan",
          "time": "O(n)",
          "space": "O(1)",
          "code": "int minAddToMakeValid(string s) {\n    int bal = 0, add = 0;\n    for (char ch : s) {\n        if (ch == '(') bal++;\n        else { if (!bal) add++; else bal--; }\n    }\n    return add + bal;\n}"
        }
      ],
      "description": "A parentheses string is valid if and only if:\n\n\t• It is the empty string,\n• It can be written as `AB` (`A` concatenated with `B`), where `A` and `B` are valid strings, or\n• It can be written as `(A)`, where `A` is a valid string.\n\nYou are given a parentheses string `s`. In one move, you can insert a parenthesis at any position of the string.\n\n\t• For example, if `s = \"()))\"`, you can insert an opening parenthesis to be `\"(()))\"` or a closing parenthesis to be `\"())))\"`.\n\nReturn the minimum number of moves required to make `s` valid.\n\n \n\nExample 1:\n\nInput: s = \"())\"\nOutput: 1\n\nExample 2:\n\nInput: s = \"(((\"\nOutput: 3\n\n \n\nConstraints:\n\n\t• `1",
      "descriptionHtml": "<p>A parentheses string is valid if and only if:</p>\n\n<ul>\n\t<li>It is the empty string,</li>\n\t<li>It can be written as <code>AB</code> (<code>A</code> concatenated with <code>B</code>), where <code>A</code> and <code>B</code> are valid strings, or</li>\n\t<li>It can be written as <code>(A)</code>, where <code>A</code> is a valid string.</li>\n</ul>\n\n<p>You are given a parentheses string <code>s</code>. In one move, you can insert a parenthesis at any position of the string.</p>\n\n<ul>\n\t<li>For example, if <code>s = &quot;()))&quot;</code>, you can insert an opening parenthesis to be <code>&quot;(<strong>(</strong>)))&quot;</code> or a closing parenthesis to be <code>&quot;())<strong>)</strong>)&quot;</code>.</li>\n</ul>\n\n<p>Return <em>the minimum number of moves required to make </em><code>s</code><em> valid</em>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> s = &quot;())&quot;\n<strong>Output:</strong> 1\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> s = &quot;(((&quot;\n<strong>Output:</strong> 3\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= s.length &lt;= 1000</code></li>\n\t<li><code>s[i]</code> is either <code>&#39;(&#39;</code> or <code>&#39;)&#39;</code>.</li>\n</ul>\n",
      "lcSlug": "minimum-add-to-make-parentheses-valid",
      "summary": "Track balance; extra ')' needed when balance would go negative."
    },
    {
      "id": "gr-17",
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
          "in": "num, k",
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
      "id": "gr-18",
      "title": "Monotone Increasing Digits",
      "lc": 738,
      "importance": "nice",
      "subtopic": "greedy",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "n",
          "out": "largest monotone"
        }
      ],
      "approaches": [
        {
          "name": "Greedy digits",
          "time": "O(log n)",
          "space": "O(log n)",
          "code": "int monotoneIncreasingDigits(int n) {\n    string s=to_string(n);\n    int mark=s.size();\n    for(int i=(int)s.size()-1;i>0;i--)\n        if(s[i]<s[i-1]){ s[i-1]--; mark=i; }\n    for(int i=mark;i<(int)s.size();i++) s[i]='9';\n    return stoi(s);\n}"
        }
      ],
      "description": "An integer has monotone increasing digits if and only if each pair of adjacent digits `x` and `y` satisfy `x Example 1:\n\nInput: n = 10\nOutput: 9\n\nExample 2:\n\nInput: n = 1234\nOutput: 1234\n\nExample 3:\n\nInput: n = 332\nOutput: 299\n\n \n\nConstraints:\n\n\t• `0 9`",
      "descriptionHtml": "<p>An integer has <strong>monotone increasing digits</strong> if and only if each pair of adjacent digits <code>x</code> and <code>y</code> satisfy <code>x &lt;= y</code>.</p>\n\n<p>Given an integer <code>n</code>, return <em>the largest number that is less than or equal to </em><code>n</code><em> with <strong>monotone increasing digits</strong></em>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> n = 10\n<strong>Output:</strong> 9\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> n = 1234\n<strong>Output:</strong> 1234\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> n = 332\n<strong>Output:</strong> 299\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>0 &lt;= n &lt;= 10<sup>9</sup></code></li>\n</ul>\n",
      "lcSlug": "monotone-increasing-digits",
      "summary": "Greedy digits — Local optimal choice leads global optimum — often after sorting."
    },
    {
      "id": "gr-19",
      "title": "Max Increase to Keep City Skyline",
      "lc": 807,
      "importance": "nice",
      "subtopic": "grid",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "grid",
          "out": "sum increases"
        }
      ],
      "approaches": [
        {
          "name": "Row/col max",
          "time": "O(mn)",
          "space": "O(m+n)",
          "code": "int maxIncreaseKeepingSkyline(vector<vector<int>>& g) {\n    int m=g.size(), n=g[0].size();\n    vector<int> row(m), col(n);\n    for(int i=0;i<m;i++) row[i]=*max_element(g[i].begin(),g[i].end());\n    for(int j=0;j<n;j++){ int mx=0; for(int i=0;i<m;i++) mx=max(mx,g[i][j]); col[j]=mx; }\n    int ans=0;\n    for(int i=0;i<m;i++) for(int j=0;j<n;j++) ans += min(row[i],col[j])-g[i][j];\n    return ans;\n}"
        }
      ],
      "description": "There is a city composed of `n x n` blocks, where each block contains a single building shaped like a vertical square prism. You are given a 0-indexed `n x n` integer matrix `grid` where `grid[r][c]` represents the height of the building located in the block at row `r` and column `c`.\n\nA city's skyline is the outer contour formed by all the building when viewing the side of the city from a distance. The skyline from each cardinal direction north, east, south, and west may be different.\n\nWe are allowed to increase the height of any number of buildings by any amount (the amount can be different per building). The height of a `0`-height building can also be increased. However, increasing the height of a building should not affect the city's skyline from any cardinal direction.\n\nReturn the maximum total sum that the height of the buildings can be increased by without changing the city's skyline from any cardinal direction.\n\n \n\nExample 1:\n\nInput: grid = [[3,0,8,4],[2,4,5,7],[9,2,6,3],[0,3,1,0]]\nOutput: 35\nExplanation: The building heights are shown in the center of the above image.\nThe skylines when viewed from each cardinal direction are drawn in red.\nThe grid after increasing the height of buildings without affecting skylines is:\ngridNew = [ [8, 4, 8, 7],\n            [7, 4, 7, 7],\n            [9, 4, 8, 7],\n            [3, 3, 3, 3] ]\n\nExample 2:\n\nInput: grid = [[0,0,0],[0,0,0],[0,0,0]]\nOutput: 0\nExplanation: Increasing the height of any building will result in the skyline changing.\n\n \n\nConstraints:\n\n\t• `n == grid.length`\n• `n == grid[r].length`\n• `2",
      "descriptionHtml": "<p>There is a city composed of <code>n x n</code> blocks, where each block contains a single building shaped like a vertical square prism. You are given a <strong>0-indexed</strong> <code>n x n</code> integer matrix <code>grid</code> where <code>grid[r][c]</code> represents the <strong>height</strong> of the building located in the block at row <code>r</code> and column <code>c</code>.</p>\n\n<p>A city&#39;s <strong>skyline</strong> is the&nbsp;outer contour formed by all the building when viewing the side of the city from a distance. The <strong>skyline</strong> from each cardinal direction north, east, south, and west may be different.</p>\n\n<p>We are allowed to increase the height of <strong>any number of buildings by any amount</strong> (the amount can be different per building). The height of a <code>0</code>-height building can also be increased. However, increasing the height of a building should <strong>not</strong> affect the city&#39;s <strong>skyline</strong> from any cardinal direction.</p>\n\n<p>Return <em>the <strong>maximum total sum</strong> that the height of the buildings can be increased by <strong>without</strong> changing the city&#39;s <strong>skyline</strong> from any cardinal direction</em>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2021/06/21/807-ex1.png\" style=\"width: 700px; height: 603px;\" />\n<pre>\n<strong>Input:</strong> grid = [[3,0,8,4],[2,4,5,7],[9,2,6,3],[0,3,1,0]]\n<strong>Output:</strong> 35\n<strong>Explanation:</strong> The building heights are shown in the center of the above image.\nThe skylines when viewed from each cardinal direction are drawn in red.\nThe grid after increasing the height of buildings without affecting skylines is:\ngridNew = [ [8, 4, 8, 7],\n            [7, 4, 7, 7],\n            [9, 4, 8, 7],\n            [3, 3, 3, 3] ]\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> grid = [[0,0,0],[0,0,0],[0,0,0]]\n<strong>Output:</strong> 0\n<strong>Explanation:</strong> Increasing the height of any building will result in the skyline changing.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>n == grid.length</code></li>\n\t<li><code>n == grid[r].length</code></li>\n\t<li><code>2 &lt;= n &lt;= 50</code></li>\n\t<li><code>0 &lt;= grid[r][c] &lt;= 100</code></li>\n</ul>\n",
      "lcSlug": "max-increase-to-keep-city-skyline",
      "summary": "Row/col max — 2D DP on grid — often row-by-row or with rolling array."
    },
    {
      "id": "gr-20",
      "title": "Bag of Tokens",
      "lc": 948,
      "importance": "nice",
      "subtopic": "two-ptr",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "tokens, power",
          "out": "max score"
        }
      ],
      "approaches": [
        {
          "name": "Two pointers + sort",
          "time": "O(n log n)",
          "space": "O(1)",
          "code": "int bagOfTokensScore(vector<int>& tokens, int power) {\n    sort(tokens.begin(), tokens.end());\n    int l=0, r=(int)tokens.size()-1, score=0, ans=0;\n    while(l<=r){\n        if(power>=tokens[l]){ power-=tokens[l++]; ans=max(ans, ++score); }\n        else if(score>0 && l<r){ power+=tokens[r--]; score--; }\n        else break;\n    } return ans;\n}"
        }
      ],
      "description": "You start with an initial power of `power`, an initial score of `0`, and a bag of tokens given as an integer array `tokens`, where each `tokens[i]` denotes the value of tokeni.\n\nYour goal is to maximize the total score by strategically playing these tokens. In one move, you can play an unplayed token in one of the two ways (but not both for the same token):\n\n\t• Face-up: If your current power is at least `tokens[i]`, you may play tokeni, losing `tokens[i]` power and gaining `1` score.\n• Face-down: If your current score is at least `1`, you may play tokeni, gaining `tokens[i]` power and losing `1` score.\n\nReturn the maximum possible score you can achieve after playing any number of tokens.\n\n \n\nExample 1:\n\nInput: tokens = [100], power = 50\n\nOutput: 0\n\nExplanation: Since your score is `0` initially, you cannot play the token face-down. You also cannot play it face-up since your power (`50`) is less than `tokens[0]` (`100`).\n\nExample 2:\n\nInput: tokens = [200,100], power = 150\n\nOutput: 1\n\nExplanation: Play token1 (`100`) face-up, reducing your power to `50` and increasing your score to `1`.\n\nThere is no need to play token0, since you cannot play it face-up to add to your score. The maximum score achievable is `1`.\n\nExample 3:\n\nInput: tokens = [100,200,300,400], power = 200\n\nOutput: 2\n\nExplanation: Play the tokens in this order to get a score of `2`:\n\n\t• Play token0 (`100`) face-up, reducing power to `100` and increasing score to `1`.\n• Play token3 (`400`) face-down, increasing power to `500` and reducing score to `0`.\n• Play token1 (`200`) face-up, reducing power to `300` and increasing score to `1`.\n• Play token2 (`300`) face-up, reducing power to `0` and increasing score to `2`.\n\nThe maximum score achievable is 2.\n\n \n\nConstraints:\n\n\t• `0 4`",
      "descriptionHtml": "<p>You start with an initial <strong>power</strong> of <code>power</code>, an initial <strong>score</strong> of <code>0</code>, and a bag of tokens given as an integer array <code>tokens</code>, where each&nbsp;<code>tokens[i]</code> denotes the value of token<em><sub>i</sub></em>.</p>\n\n<p>Your goal is to <strong>maximize</strong> the total <strong>score</strong> by strategically playing these tokens. In one move, you can play an <strong>unplayed</strong> token in one of the two ways (but not both for the same token):</p>\n\n<ul>\n\t<li><strong>Face-up</strong>: If your current power is <strong>at least</strong> <code>tokens[i]</code>, you may play token<em><sub>i</sub></em>, losing <code>tokens[i]</code> power and gaining <code>1</code> score.</li>\n\t<li><strong>Face-down</strong>: If your current score is <strong>at least</strong> <code>1</code>, you may play token<em><sub>i</sub></em>, gaining <code>tokens[i]</code> power and losing <code>1</code> score.</li>\n</ul>\n\n<p>Return <em>the <strong>maximum</strong> possible score you can achieve after playing <strong>any</strong> number of tokens</em>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<div class=\"example-block\" style=\"\n    border-color: var(--border-tertiary);\n    border-left-width: 2px;\n    color: var(--text-secondary);\n    font-size: .875rem;\n    margin-bottom: 1rem;\n    margin-top: 1rem;\n    overflow: visible;\n    padding-left: 1rem;\n\">\n<p><strong>Input:</strong> <span class=\"example-io\" style=\"\n    font-family: Menlo,sans-serif;\n    font-size: 0.85rem;\n\">tokens = [100], power = 50</span></p>\n\n<p><strong>Output:</strong> <span class=\"example-io\" style=\"\n    font-family: Menlo,sans-serif;\n    font-size: 0.85rem;\n\">0</span></p>\n\n<p><strong>Explanation</strong><strong>:</strong> Since your score is <code>0</code> initially, you cannot play the token face-down. You also cannot play it face-up since your power (<code>50</code>) is less than <code>tokens[0]</code>&nbsp;(<code>100</code>).</p>\n</div>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<div class=\"example-block\" style=\"\n    border-color: var(--border-tertiary);\n    border-left-width: 2px;\n    color: var(--text-secondary);\n    font-size: .875rem;\n    margin-bottom: 1rem;\n    margin-top: 1rem;\n    overflow: visible;\n    padding-left: 1rem;\n\">\n<p><strong>Input:</strong> <span class=\"example-io\" style=\"\n    font-family: Menlo,sans-serif;\n    font-size: 0.85rem;\n\">tokens = [200,100], power = 150</span></p>\n\n<p><strong>Output:</strong> <span class=\"example-io\" style=\"\n    font-family: Menlo,sans-serif;\n    font-size: 0.85rem;\n\">1</span></p>\n\n<p><strong>Explanation:</strong> Play token<em><sub>1</sub></em> (<code>100</code>) face-up, reducing your power to&nbsp;<code>50</code> and increasing your score to&nbsp;<code>1</code>.</p>\n\n<p>There is no need to play token<em><sub>0</sub></em>, since you cannot play it face-up to add to your score. The maximum score achievable is <code>1</code>.</p>\n</div>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<div class=\"example-block\" style=\"\n    border-color: var(--border-tertiary);\n    border-left-width: 2px;\n    color: var(--text-secondary);\n    font-size: .875rem;\n    margin-bottom: 1rem;\n    margin-top: 1rem;\n    overflow: visible;\n    padding-left: 1rem;\n\">\n<p><strong>Input:</strong> <span class=\"example-io\" style=\"\n    font-family: Menlo,sans-serif;\n    font-size: 0.85rem;\n\">tokens = [100,200,300,400], power = 200</span></p>\n\n<p><strong>Output:</strong> <span class=\"example-io\" style=\"\n    font-family: Menlo,sans-serif;\n    font-size: 0.85rem;\n\">2</span></p>\n\n<p><strong>Explanation:</strong> Play the tokens in this order to get a score of <code>2</code>:</p>\n\n<ol>\n\t<li>Play token<em><sub>0</sub></em> (<code>100</code>) face-up, reducing power to <code>100</code> and increasing score to <code>1</code>.</li>\n\t<li>Play token<em><sub>3</sub></em> (<code>400</code>) face-down, increasing power to <code>500</code> and reducing score to <code>0</code>.</li>\n\t<li>Play token<em><sub>1</sub></em> (<code>200</code>) face-up, reducing power to <code>300</code> and increasing score to <code>1</code>.</li>\n\t<li>Play token<em><sub>2</sub></em> (<code>300</code>) face-up, reducing power to <code>0</code> and increasing score to <code>2</code>.</li>\n</ol>\n\n<p><span style=\"color: var(--text-secondary); font-size: 0.875rem;\">The maximum score achievable is </span><code style=\"color: var(--text-secondary); font-size: 0.875rem;\">2</code><span style=\"color: var(--text-secondary); font-size: 0.875rem;\">.</span></p>\n</div>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>0 &lt;= tokens.length &lt;= 1000</code></li>\n\t<li><code>0 &lt;= tokens[i], power &lt; 10<sup>4</sup></code></li>\n</ul>\n",
      "lcSlug": "bag-of-tokens",
      "summary": "Two pointers + sort — state invariant, then loop."
    },
    {
      "id": "gr-21",
      "title": "Minimum Number of Refueling Stops",
      "lc": 871,
      "importance": "nice",
      "subtopic": "heap",
      "difficulty": "Hard",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "target, startFuel, stations",
          "out": "stops"
        }
      ],
      "approaches": [
        {
          "name": "DP + heap",
          "time": "O(n log n)",
          "space": "O(n)",
          "code": "int minRefuelStops(int target, int startFuel, vector<vector<int>>& stations) {\n    priority_queue<int> pq; stations.push_back({target,0});\n    int i=0, fuel=startFuel, stops=0;\n    while(fuel<target){\n        while(i<(int)stations.size() && stations[i][0]<=fuel) pq.push(stations[i++][1]);\n        if(pq.empty()) return -1;\n        fuel+=pq.top(); pq.pop(); stops++;\n    } return stops;\n}"
        }
      ],
      "description": "A car travels from a starting position to a destination which is `target` miles east of the starting position.\n\nThere are gas stations along the way. The gas stations are represented as an array `stations` where `stations[i] = [positioni, fueli]` indicates that the `ith` gas station is `positioni` miles east of the starting position and has `fueli` liters of gas.\n\nThe car starts with an infinite tank of gas, which initially has `startFuel` liters of fuel in it. It uses one liter of gas per one mile that it drives. When the car reaches a gas station, it may stop and refuel, transferring all the gas from the station into the car.\n\nReturn the minimum number of refueling stops the car must make in order to reach its destination. If it cannot reach the destination, return `-1`.\n\nNote that if the car reaches a gas station with `0` fuel left, the car can still refuel there. If the car reaches the destination with `0` fuel left, it is still considered to have arrived.\n\n \n\nExample 1:\n\nInput: target = 1, startFuel = 1, stations = []\nOutput: 0\nExplanation: We can reach the target without refueling.\n\nExample 2:\n\nInput: target = 100, startFuel = 1, stations = [[10,100]]\nOutput: -1\nExplanation: We can not reach the target (or even the first gas station).\n\nExample 3:\n\nInput: target = 100, startFuel = 10, stations = [[10,60],[20,30],[30,30],[60,40]]\nOutput: 2\nExplanation: We start with 10 liters of fuel.\nWe drive to position 10, expending 10 liters of fuel.  We refuel from 0 liters to 60 liters of gas.\nThen, we drive from position 10 to position 60 (expending 50 liters of fuel),\nand refuel from 10 liters to 50 liters of gas.  We then drive to and reach the target.\nWe made 2 refueling stops along the way, so we return 2.\n\n \n\nConstraints:\n\n\t• `1 9`\n• `0 i i+1 i 9`",
      "descriptionHtml": "<p>A car travels from a starting position to a destination which is <code>target</code> miles east of the starting position.</p>\n\n<p>There are gas stations along the way. The gas stations are represented as an array <code>stations</code> where <code>stations[i] = [position<sub>i</sub>, fuel<sub>i</sub>]</code> indicates that the <code>i<sup>th</sup></code> gas station is <code>position<sub>i</sub></code> miles east of the starting position and has <code>fuel<sub>i</sub></code> liters of gas.</p>\n\n<p>The car starts with an infinite tank of gas, which initially has <code>startFuel</code> liters of fuel in it. It uses one liter of gas per one mile that it drives. When the car reaches a gas station, it may stop and refuel, transferring all the gas from the station into the car.</p>\n\n<p>Return <em>the minimum number of refueling stops the car must make in order to reach its destination</em>. If it cannot reach the destination, return <code>-1</code>.</p>\n\n<p>Note that if the car reaches a gas station with <code>0</code> fuel left, the car can still refuel there. If the car reaches the destination with <code>0</code> fuel left, it is still considered to have arrived.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> target = 1, startFuel = 1, stations = []\n<strong>Output:</strong> 0\n<strong>Explanation:</strong> We can reach the target without refueling.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> target = 100, startFuel = 1, stations = [[10,100]]\n<strong>Output:</strong> -1\n<strong>Explanation:</strong> We can not reach the target (or even the first gas station).\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> target = 100, startFuel = 10, stations = [[10,60],[20,30],[30,30],[60,40]]\n<strong>Output:</strong> 2\n<strong>Explanation:</strong> We start with 10 liters of fuel.\nWe drive to position 10, expending 10 liters of fuel.  We refuel from 0 liters to 60 liters of gas.\nThen, we drive from position 10 to position 60 (expending 50 liters of fuel),\nand refuel from 10 liters to 50 liters of gas.  We then drive to and reach the target.\nWe made 2 refueling stops along the way, so we return 2.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= target, startFuel &lt;= 10<sup>9</sup></code></li>\n\t<li><code>0 &lt;= stations.length &lt;= 500</code></li>\n\t<li><code>1 &lt;= position<sub>i</sub> &lt; position<sub>i+1</sub> &lt; target</code></li>\n\t<li><code>1 &lt;= fuel<sub>i</sub> &lt; 10<sup>9</sup></code></li>\n</ul>\n",
      "lcSlug": "minimum-number-of-refueling-stops",
      "summary": "DP + heap — Priority queue for top-K, merging streams, or greedy scheduling."
    },
    {
      "id": "gr-22",
      "title": "Candy Crush",
      "lc": 723,
      "importance": "nice",
      "subtopic": "simulation",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "board",
          "out": "crushed"
        }
      ],
      "approaches": [
        {
          "name": "Simulation",
          "time": "O((mn)^2)",
          "space": "O(mn)",
          "code": "vector<vector<int>> candyCrush(vector<vector<int>>& b) {\n    int m=b.size(), n=b[0].size(); bool crushed=true;\n    while(crushed){\n        crushed=false;\n        for(int i=0;i<m;i++) for(int j=0;j<n-2;j++)\n            if(b[i][j]&&abs(b[i][j])==abs(b[i][j+1])&&abs(b[i][j])==abs(b[i][j+2]))\n                b[i][j]=b[i][j+1]=b[i][j+2]=-abs(b[i][j]);\n        for(int j=0;j<n;j++) for(int i=0;i<m-2;i++)\n            if(b[i][j]&&abs(b[i][j])==abs(b[i+1][j])&&abs(b[i][j])==abs(b[i+2][j])\n                b[i][j]=b[i+1][j]=b[i+2][j]=-abs(b[i][j]);\n        for(int j=0;j<n;j++){\n            int write=m-1;\n            for(int i=m-1;i>=0;i--) if(b[i][j]>0) b[write--][j]=b[i][j];\n            while(write>=0) b[write--][j]=0;\n        }\n        for(int i=0;i<m;i++) for(int j=0;j<n;j++) if(b[i][j]<0){ b[i][j]=0; crushed=true; }\n    } return b;\n}"
        }
      ],
      "description": "This question is about implementing a basic elimination algorithm for Candy Crush.\n\nGiven an `m x n` integer array `board` representing the grid of candy where `board[i][j]` represents the type of candy. A value of `board[i][j] == 0` represents that the cell is empty.\n\nThe given board represents the state of the game following the player's move. Now, you need to restore the board to a stable state by crushing candies according to the following rules:\n\n\t• If three or more candies of the same type are adjacent vertically or horizontally, crush them all at the same time - these positions become empty.\n• After crushing all candies simultaneously, if an empty space on the board has candies on top of itself, then these candies will drop until they hit a candy or bottom at the same time. No new candies will drop outside the top boundary.\n• After the above steps, there may exist more candies that can be crushed. If so, you need to repeat the above steps.\n• If there does not exist more candies that can be crushed (i.e., the board is stable), then return the current board.\n\nYou need to perform the above rules until the board becomes stable, then return the stable board.\n\n&nbsp;\n\nExample 1:\n\nInput: board = [[110,5,112,113,114],[210,211,5,213,214],[310,311,3,313,314],[410,411,412,5,414],[5,1,512,3,3],[610,4,1,613,614],[710,1,2,713,714],[810,1,2,1,1],[1,1,2,2,2],[4,1,4,4,1014]]\nOutput: [[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[110,0,0,0,114],[210,0,0,0,214],[310,0,0,113,314],[410,0,0,213,414],[610,211,112,313,614],[710,311,412,613,714],[810,411,512,713,1014]]\n\nExample 2:\n\nInput: board = [[1,3,5,5,2],[3,4,3,3,1],[3,2,4,5,2],[2,4,4,5,5],[1,4,4,1,1]]\nOutput: [[1,3,0,0,0],[3,4,0,5,2],[3,2,0,3,1],[2,4,0,5,2],[1,4,3,1,1]]\n\n&nbsp;\n\nConstraints:\n\n\t• `m == board.length`\n• `n == board[i].length`\n• `3",
      "descriptionHtml": "<p>This question is about implementing a basic elimination algorithm for Candy Crush.</p>\n\n<p>Given an <code>m x n</code> integer array <code>board</code> representing the grid of candy where <code>board[i][j]</code> represents the type of candy. A value of <code>board[i][j] == 0</code> represents that the cell is empty.</p>\n\n<p>The given board represents the state of the game following the player&#39;s move. Now, you need to restore the board to a stable state by crushing candies according to the following rules:</p>\n\n<ul>\n\t<li>If three or more candies of the same type are adjacent vertically or horizontally, crush them all at the same time - these positions become empty.</li>\n\t<li>After crushing all candies simultaneously, if an empty space on the board has candies on top of itself, then these candies will drop until they hit a candy or bottom at the same time. No new candies will drop outside the top boundary.</li>\n\t<li>After the above steps, there may exist more candies that can be crushed. If so, you need to repeat the above steps.</li>\n\t<li>If there does not exist more candies that can be crushed (i.e., the board is stable), then return the current board.</li>\n</ul>\n\n<p>You need to perform the above rules until the board becomes stable, then return <em>the stable board</em>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img src=\"https://fastly.jsdelivr.net/gh/doocs/leetcode@main/solution/0700-0799/0723.Candy%20Crush/images/candy_crush_example_2.png\" style=\"width: 600px; height: 411px;\" />\n<pre>\n<strong>Input:</strong> board = [[110,5,112,113,114],[210,211,5,213,214],[310,311,3,313,314],[410,411,412,5,414],[5,1,512,3,3],[610,4,1,613,614],[710,1,2,713,714],[810,1,2,1,1],[1,1,2,2,2],[4,1,4,4,1014]]\n<strong>Output:</strong> [[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[110,0,0,0,114],[210,0,0,0,214],[310,0,0,113,314],[410,0,0,213,414],[610,211,112,313,614],[710,311,412,613,714],[810,411,512,713,1014]]\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> board = [[1,3,5,5,2],[3,4,3,3,1],[3,2,4,5,2],[2,4,4,5,5],[1,4,4,1,1]]\n<strong>Output:</strong> [[1,3,0,0,0],[3,4,0,5,2],[3,2,0,3,1],[2,4,0,5,2],[1,4,3,1,1]]\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>m == board.length</code></li>\n\t<li><code>n == board[i].length</code></li>\n\t<li><code>3 <= m, n <= 50</code></li>\n\t<li><code>1 <= board[i][j] <= 2000</code></li>\n</ul>",
      "lcSlug": "candy-crush",
      "summary": "Simulation — state invariant, then loop."
    },
    {
      "id": "gr-23",
      "title": "IPO",
      "lc": 502,
      "importance": "nice",
      "subtopic": "heap",
      "difficulty": "Hard",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "k, w, profits, capital",
          "out": "max capital"
        }
      ],
      "approaches": [
        {
          "name": "Heap greedy",
          "time": "O(n log n)",
          "space": "O(n)",
          "code": "int findMaximizedCapital(int k, int w, vector<int>& profits, vector<int>& capital) {\n    int n=profits.size(); vector<pair<int,int>> projects(n);\n    for(int i=0;i<n;i++) projects[i]={capital[i],profits[i]};\n    sort(projects.begin(), projects.end());\n    priority_queue<int> pq; int i=0;\n    while(k--){\n        while(i<n && projects[i].first<=w) pq.push(projects[i++].second);\n        if(pq.empty()) break;\n        w+=pq.top(); pq.pop();\n    } return w;\n}"
        }
      ],
      "description": "Suppose LeetCode will start its IPO soon. In order to sell a good price of its shares to Venture Capital, LeetCode would like to work on some projects to increase its capital before the IPO. Since it has limited resources, it can only finish at most `k` distinct projects before the IPO. Help LeetCode design the best way to maximize its total capital after finishing at most `k` distinct projects.\n\nYou are given `n` projects where the `ith` project has a pure profit `profits[i]` and a minimum capital of `capital[i]` is needed to start it.\n\nInitially, you have `w` capital. When you finish a project, you will obtain its pure profit and the profit will be added to your total capital.\n\nPick a list of at most `k` distinct projects from given projects to maximize your final capital, and return the final maximized capital.\n\nThe answer is guaranteed to fit in a 32-bit signed integer.\n\n \n\nExample 1:\n\nInput: k = 2, w = 0, profits = [1,2,3], capital = [0,1,1]\nOutput: 4\nExplanation: Since your initial capital is 0, you can only start the project indexed 0.\nAfter finishing it you will obtain profit 1 and your capital becomes 1.\nWith capital 1, you can either start the project indexed 1 or the project indexed 2.\nSince you can choose at most 2 projects, you need to finish the project indexed 2 to get the maximum capital.\nTherefore, output the final maximized capital, which is 0 + 1 + 3 = 4.\n\nExample 2:\n\nInput: k = 3, w = 0, profits = [1,2,3], capital = [0,1,2]\nOutput: 6\n\n \n\nConstraints:\n\n\t• `1 5`\n• `0 9`\n• `n == profits.length`\n• `n == capital.length`\n• `1 5`\n• `0 4`\n• `0 9`",
      "descriptionHtml": "<p>Suppose LeetCode will start its <strong>IPO</strong> soon. In order to sell a good price of its shares to Venture Capital, LeetCode would like to work on some projects to increase its capital before the <strong>IPO</strong>. Since it has limited resources, it can only finish at most <code>k</code> distinct projects before the <strong>IPO</strong>. Help LeetCode design the best way to maximize its total capital after finishing at most <code>k</code> distinct projects.</p>\n\n<p>You are given <code>n</code> projects where the <code>i<sup>th</sup></code> project has a pure profit <code>profits[i]</code> and a minimum capital of <code>capital[i]</code> is needed to start it.</p>\n\n<p>Initially, you have <code>w</code> capital. When you finish a project, you will obtain its pure profit and the profit will be added to your total capital.</p>\n\n<p>Pick a list of <strong>at most</strong> <code>k</code> distinct projects from given projects to <strong>maximize your final capital</strong>, and return <em>the final maximized capital</em>.</p>\n\n<p>The answer is guaranteed to fit in a 32-bit signed integer.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> k = 2, w = 0, profits = [1,2,3], capital = [0,1,1]\n<strong>Output:</strong> 4\n<strong>Explanation:</strong> Since your initial capital is 0, you can only start the project indexed 0.\nAfter finishing it you will obtain profit 1 and your capital becomes 1.\nWith capital 1, you can either start the project indexed 1 or the project indexed 2.\nSince you can choose at most 2 projects, you need to finish the project indexed 2 to get the maximum capital.\nTherefore, output the final maximized capital, which is 0 + 1 + 3 = 4.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> k = 3, w = 0, profits = [1,2,3], capital = [0,1,2]\n<strong>Output:</strong> 6\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= k &lt;= 10<sup>5</sup></code></li>\n\t<li><code>0 &lt;= w &lt;= 10<sup>9</sup></code></li>\n\t<li><code>n == profits.length</code></li>\n\t<li><code>n == capital.length</code></li>\n\t<li><code>1 &lt;= n &lt;= 10<sup>5</sup></code></li>\n\t<li><code>0 &lt;= profits[i] &lt;= 10<sup>4</sup></code></li>\n\t<li><code>0 &lt;= capital[i] &lt;= 10<sup>9</sup></code></li>\n</ul>\n",
      "lcSlug": "ipo",
      "summary": "Heap greedy — Priority queue for top-K, merging streams, or greedy scheduling."
    },
    {
      "id": "gr-24",
      "title": "Reorganize String",
      "lc": 767,
      "importance": "should",
      "subtopic": "heap",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "s",
          "out": "reorganized"
        }
      ],
      "approaches": [
        {
          "name": "Max heap rearrange",
          "time": "O(n log k)",
          "space": "O(k)",
          "code": "string reorganizeString(string s) {\n    int cnt[26] = {}; for (char ch : s) cnt[ch-'a']++;\n    priority_queue<pair<int,char>> pq;\n    for (int i = 0; i < 26; i++) if (cnt[i]) pq.push({cnt[i], char('a'+i)});\n    string ans;\n    while (!pq.empty()) {\n        auto top = pq.top(); pq.pop();\n        int f = top.first; char ch = top.second;\n        if (!ans.empty() && ans.back() == ch) {\n            if (pq.empty()) return \"\";\n            auto top2 = pq.top(); pq.pop();\n            ans += top2.second;\n            if (--top2.first) pq.push(top2);\n            pq.push({f, ch});\n        } else { ans += ch; if (--f) pq.push({f, ch}); }\n    }\n    return ans;\n}"
        }
      ],
      "description": "Given a string `s`, rearrange the characters of `s` so that any two adjacent characters are not the same.\n\nReturn any possible rearrangement of `s` or return `\"\"` if not possible.\n\n \n\nExample 1:\n\nInput: s = \"aab\"\nOutput: \"aba\"\n\nExample 2:\n\nInput: s = \"aaab\"\nOutput: \"\"\n\n \n\nConstraints:\n\n\t• `1",
      "descriptionHtml": "<p>Given a string <code>s</code>, rearrange the characters of <code>s</code> so that any two adjacent characters are not the same.</p>\n\n<p>Return <em>any possible rearrangement of</em> <code>s</code> <em>or return</em> <code>&quot;&quot;</code> <em>if not possible</em>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<pre><strong>Input:</strong> s = \"aab\"\n<strong>Output:</strong> \"aba\"\n</pre><p><strong class=\"example\">Example 2:</strong></p>\n<pre><strong>Input:</strong> s = \"aaab\"\n<strong>Output:</strong> \"\"\n</pre>\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= s.length &lt;= 500</code></li>\n\t<li><code>s</code> consists of lowercase English letters.</li>\n</ul>\n",
      "lcSlug": "reorganize-string",
      "summary": "Always place most frequent char; swap if same as last or fail."
    }
  ]
};
