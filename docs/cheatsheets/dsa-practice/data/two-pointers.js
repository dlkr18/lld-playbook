window.PRACTICE_TOPIC = {
  "id": "two-pointers",
  "title": "Two Pointers & Sliding Window",
  "expected_count": 28,
  "strategy": "<strong>Speed-run:</strong> Opposite pointers + variable window = most string/array hard problems. Filter <em>Must do</em> first.",
  "subtopics": [
    {
      "id": "opposite",
      "label": "Opposite"
    },
    {
      "id": "same-dir",
      "label": "Same Direction"
    },
    {
      "id": "fixed-window",
      "label": "Fixed Window"
    },
    {
      "id": "variable-window",
      "label": "Variable Window"
    }
  ],
  "questions": [
    {
      "id": "tp-01",
      "title": "Two Sum II",
      "lc": 167,
      "importance": "must",
      "subtopic": "opposite",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "sorted nums, target",
          "out": "indices"
        }
      ],
      "approaches": [
        {
          "name": "Two pointers",
          "time": "O(n)",
          "space": "O(1)",
          "code": "vector<int> twoSum(vector<int>& nums, int target) {\n    int l = 0, r = (int)nums.size()-1;\n    while (l < r) {\n        int s = nums[l]+nums[r];\n        if (s == target) return {l+1,r+1};\n        if (s < target) l++; else r--;\n    } return {};\n}"
        }
      ],
      "description": "Given input per constraints, solve: Two Sum II.",
      "summary": "Opposite ends or same direction — move based on comparison/invariant."
    },
    {
      "id": "tp-02",
      "title": "3Sum",
      "lc": 15,
      "importance": "must",
      "subtopic": "opposite",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums",
          "out": "triplets"
        }
      ],
      "approaches": [
        {
          "name": "Sort + two pointers",
          "time": "O(n^2)",
          "space": "O(1)",
          "code": "vector<vector<int>> threeSum(vector<int>& nums) {\n    sort(nums.begin(), nums.end()); vector<vector<int>> ans;\n    for (int i = 0; i < (int)nums.size(); i++) {\n        if (i && nums[i]==nums[i-1]) continue;\n        int l = i+1, r = (int)nums.size()-1;\n        while (l < r) {\n            int s = nums[i]+nums[l]+nums[r];\n            if (!s) { ans.push_back({nums[i],nums[l],nums[r]});\n                while (l<r && nums[l]==nums[l+1]) l++;\n                while (l<r && nums[r]==nums[r-1]) r--;\n                l++; r--;\n            } else if (s < 0) l++; else r--;\n        }\n    } return ans;\n}"
        }
      ],
      "description": "Return all unique triplets in nums that sum to zero.",
      "summary": "Sort first; l/r or fixed i + two pointers on rest."
    },
    {
      "id": "tp-03",
      "title": "Container With Most Water",
      "lc": 11,
      "importance": "must",
      "subtopic": "opposite",
      "difficulty": "Medium",
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
          "name": "Two pointers greedy",
          "time": "O(n)",
          "space": "O(1)",
          "code": "int maxArea(vector<int>& h) {\n    int l = 0, r = (int)h.size()-1, ans = 0;\n    while (l < r) {\n        ans = max(ans, min(h[l], h[r]) * (r-l));\n        if (h[l] < h[r]) l++; else r--;\n    } return ans;\n}"
        }
      ],
      "description": "Given heights, pick two lines forming a container with maximum area.",
      "summary": "Move the pointer at the shorter line inward — that's the only way to maybe increase area."
    },
    {
      "id": "tp-04",
      "title": "Trapping Rain Water",
      "lc": 42,
      "importance": "must",
      "subtopic": "opposite",
      "difficulty": "Hard",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "heights",
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
      "id": "tp-05",
      "title": "Valid Palindrome",
      "lc": 125,
      "importance": "should",
      "subtopic": "opposite",
      "difficulty": "Easy",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "s",
          "out": "true/false"
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
      "id": "tp-06",
      "title": "Remove Duplicates from Sorted Array",
      "lc": 26,
      "importance": "should",
      "subtopic": "same-dir",
      "difficulty": "Easy",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums",
          "out": "new length"
        }
      ],
      "approaches": [
        {
          "name": "Same direction",
          "time": "O(n)",
          "space": "O(1)",
          "code": "int removeDuplicates(vector<int>& nums) {\n    if (nums.empty()) return 0;\n    int w = 1;\n    for (int i=1; i<(int)nums.size(); i++)\n        if (nums[i] != nums[i-1]) nums[w++] = nums[i];\n    return w;\n}"
        }
      ],
      "description": "Given input per constraints, solve: Remove Duplicates from Sorted Array.",
      "summary": "Same direction — state invariant, then loop."
    },
    {
      "id": "tp-07",
      "title": "Remove Element",
      "lc": 27,
      "importance": "should",
      "subtopic": "same-dir",
      "difficulty": "Easy",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums, val",
          "out": "new length"
        }
      ],
      "approaches": [
        {
          "name": "Two pointers",
          "time": "O(n)",
          "space": "O(1)",
          "code": "int removeElement(vector<int>& nums, int val) {\n    int w = 0;\n    for (int x : nums) if (x != val) nums[w++] = x;\n    return w;\n}"
        }
      ],
      "description": "Remove all instances of val in-place, return new length.",
      "summary": "Opposite ends or same direction — move based on comparison/invariant."
    },
    {
      "id": "tp-08",
      "title": "Move Zeroes",
      "lc": 283,
      "importance": "should",
      "subtopic": "same-dir",
      "difficulty": "Easy",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums",
          "out": "in-place"
        }
      ],
      "approaches": [
        {
          "name": "Two pointers",
          "time": "O(n)",
          "space": "O(1)",
          "code": "void moveZeroes(vector<int>& nums) {\n    int w = 0;\n    for (int x : nums) if (x) nums[w++] = x;\n    while (w < (int)nums.size()) nums[w++] = 0;\n}"
        }
      ],
      "description": "Move all zeros to end while maintaining relative order of non-zeros.",
      "summary": "Opposite ends or same direction — move based on comparison/invariant."
    },
    {
      "id": "tp-09",
      "title": "Sort Colors",
      "lc": 75,
      "importance": "must",
      "subtopic": "same-dir",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums 0/1/2",
          "out": "sorted"
        }
      ],
      "approaches": [
        {
          "name": "Dutch flag",
          "time": "O(n)",
          "space": "O(1)",
          "code": "void sortColors(vector<int>& nums) {\n    int lo=0, mid=0, hi=(int)nums.size()-1;\n    while (mid <= hi) {\n        if (!nums[mid]) swap(nums[lo++], nums[mid++]);\n        else if (nums[mid]==2) swap(nums[mid], nums[hi--]);\n        else mid++;\n    }\n}"
        }
      ],
      "description": "Given input per constraints, solve: Sort Colors.",
      "summary": "Dutch flag — state invariant, then loop."
    },
    {
      "id": "tp-10",
      "title": "Minimum Window Substring",
      "lc": 76,
      "importance": "must",
      "subtopic": "variable-window",
      "difficulty": "Hard",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "s, t",
          "out": "min window"
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
      "id": "tp-11",
      "title": "Longest Substring Without Repeating",
      "lc": 3,
      "importance": "must",
      "subtopic": "variable-window",
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
          "name": "Window + last index",
          "time": "O(n)",
          "space": "O(1)",
          "code": "int lengthOfLongestSubstring(string s) {\n    int last[128]; fill(last, last+128, -1);\n    int l = 0, ans = 0;\n    for (int r = 0; r < (int)s.size(); r++) {\n        if (last[s[r]] >= l) l = last[s[r]] + 1;\n        last[s[r]] = r; ans = max(ans, r-l+1);\n    } return ans;\n}"
        }
      ],
      "description": "Compute the longest substring without repeating over the given input per constraints.",
      "summary": "Window + last index — Sliding window: expand right, shrink left while invalid."
    },
    {
      "id": "tp-12",
      "title": "Longest Repeating Character Replacement",
      "lc": 424,
      "importance": "should",
      "subtopic": "variable-window",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "s, k",
          "out": "length"
        }
      ],
      "approaches": [
        {
          "name": "Sliding window",
          "time": "O(n)",
          "space": "O(1)",
          "code": "int characterReplacement(string s, int k) {\n    int cnt[26]={}, l=0, maxf=0, ans=0;\n    for (int r=0; r<(int)s.size(); r++) {\n        maxf = max(maxf, ++cnt[s[r]-'a']);\n        while (r-l+1 - maxf > k) cnt[s[l++]-'a']--;\n        ans = max(ans, r-l+1);\n    } return ans;\n}"
        }
      ],
      "description": "Longest substring containing same letter after at most k replacements.",
      "summary": "Expand right; while invalid, shrink left — track best window length/sum."
    },
    {
      "id": "tp-13",
      "title": "Permutation in String",
      "lc": 567,
      "importance": "should",
      "subtopic": "fixed-window",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "s1, s2",
          "out": "true/false"
        }
      ],
      "approaches": [
        {
          "name": "Freq window",
          "time": "O(n)",
          "space": "O(1)",
          "code": "bool checkInclusion(string s1, string s2) {\n    if (s1.size() > s2.size()) return false;\n    vector<int> a(26), b(26);\n    for (int i = 0; i < (int)s1.size(); i++) { a[s1[i]-'a']++; b[s2[i]-'a']++; }\n    if (a == b) return true;\n    for (int i = s1.size(); i < (int)s2.size(); i++) {\n        b[s2[i]-'a']++; b[s2[i-s1.size()]-'a']--;\n        if (a == b) return true;\n    }\n    return false;\n}"
        }
      ],
      "description": "Return true if s2 contains permutation of s1.",
      "summary": "Fixed/window size — compare 26-count arrays or sliding counts."
    },
    {
      "id": "tp-14",
      "title": "Find All Anagrams in String",
      "lc": 438,
      "importance": "should",
      "subtopic": "fixed-window",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "s, p",
          "out": "indices"
        }
      ],
      "approaches": [
        {
          "name": "Freq window",
          "time": "O(n)",
          "space": "O(1)",
          "code": "vector<int> findAnagrams(string s, string p) {\n    if (p.size() > s.size()) return {};\n    vector<int> need(26), have(26), ans;\n    for (char ch : p) need[ch-'a']++;\n    for (int i = 0; i < (int)s.size(); i++) {\n        have[s[i]-'a']++;\n        if (i >= (int)p.size()) have[s[i-p.size()]-'a']--;\n        if (i >= (int)p.size()-1 && have == need) ans.push_back(i - (int)p.size() + 1);\n    }\n    return ans;\n}"
        }
      ],
      "description": "Find All Anagrams in String — return the required index, count, or boolean.",
      "summary": "Fixed/window size — compare 26-count arrays or sliding counts."
    },
    {
      "id": "tp-15",
      "title": "Max Consecutive Ones III",
      "lc": 1004,
      "importance": "must",
      "subtopic": "variable-window",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums, k",
          "out": "max len"
        }
      ],
      "approaches": [
        {
          "name": "Sliding window",
          "time": "O(n)",
          "space": "O(1)",
          "code": "int longestOnes(vector<int>& nums, int k) {\n    int l=0, zeros=0, ans=0;\n    for (int r=0; r<(int)nums.size(); r++) {\n        if (!nums[r]) zeros++;\n        while (zeros > k) { if (!nums[l]) zeros--; l++; }\n        ans = max(ans, r-l+1);\n    } return ans;\n}"
        }
      ],
      "description": "Given input per constraints, solve: Max Consecutive Ones III.",
      "summary": "Expand right; while invalid, shrink left — track best window length/sum."
    },
    {
      "id": "tp-16",
      "title": "Subarrays with K Different Integers",
      "lc": 992,
      "importance": "should",
      "subtopic": "variable-window",
      "difficulty": "Hard",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums, k",
          "out": "count"
        }
      ],
      "approaches": [
        {
          "name": "atMost trick",
          "time": "O(n)",
          "space": "O(k)",
          "code": "int subarraysWithKDistinct(vector<int>& nums, int k) {\n    auto atMost = [&](int x) {\n        unordered_map<int,int> cnt; int l = 0, ans = 0;\n        for (int r = 0; r < (int)nums.size(); r++) {\n            cnt[nums[r]]++;\n            while ((int)cnt.size() > x) { if (--cnt[nums[l]] == 0) cnt.erase(nums[l]); l++; }\n            ans += r - l + 1;\n        }\n        return ans;\n    };\n    return atMost(k) - atMost(k-1);\n}"
        }
      ],
      "description": "Count subarrays with exactly k distinct integers.",
      "summary": "Count subarrays with ≤K distinct = atMost(K) - atMost(K-1)."
    },
    {
      "id": "tp-17",
      "title": "Minimum Size Subarray Sum",
      "lc": 209,
      "importance": "must",
      "subtopic": "variable-window",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums, target",
          "out": "min len"
        }
      ],
      "approaches": [
        {
          "name": "Sliding window",
          "time": "O(n)",
          "space": "O(1)",
          "code": "int minSubArrayLen(int target, vector<int>& nums) {\n    int l=0, sum=0, ans=INT_MAX;\n    for (int r=0; r<(int)nums.size(); r++) {\n        sum += nums[r];\n        while (sum >= target) { ans=min(ans,r-l+1); sum -= nums[l++]; }\n    } return ans==INT_MAX?0:ans;\n}"
        }
      ],
      "description": "Compute the minimum size subarray sum over the given input per constraints.",
      "summary": "Expand right; while invalid, shrink left — track best window length/sum."
    },
    {
      "id": "tp-18",
      "title": "Maximum Average Subarray I",
      "lc": 643,
      "importance": "should",
      "subtopic": "fixed-window",
      "difficulty": "Easy",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums, k",
          "out": "max avg"
        }
      ],
      "approaches": [
        {
          "name": "Fixed window",
          "time": "O(n)",
          "space": "O(1)",
          "code": "double findMaxAverage(vector<int>& nums, int k) {\n    int sum = 0;\n    for (int i = 0; i < k; i++) sum += nums[i];\n    int best = sum;\n    for (int i = k; i < (int)nums.size(); i++) { sum += nums[i] - nums[i-k]; best = max(best, sum); }\n    return (double)best / k;\n}"
        }
      ],
      "description": "Compute the maximum average subarray i over the given input per constraints.",
      "summary": "Sum first k; slide: add nums[r], subtract nums[l]."
    },
    {
      "id": "tp-19",
      "title": "Fruit Into Baskets",
      "lc": 904,
      "importance": "should",
      "subtopic": "variable-window",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "fruits",
          "out": "max types"
        }
      ],
      "approaches": [
        {
          "name": "Sliding window",
          "time": "O(n)",
          "space": "O(1)",
          "code": "int totalFruit(vector<int>& fruits) {\n    unordered_map<int,int> cnt; int l = 0, ans = 0;\n    for (int r = 0; r < (int)fruits.size(); r++) {\n        cnt[fruits[r]]++;\n        while ((int)cnt.size() > 2) { cnt[fruits[l]]--; if (!cnt[fruits[l]]) cnt.erase(fruits[l]); l++; }\n        ans = max(ans, r - l + 1);\n    }\n    return ans;\n}"
        }
      ],
      "description": "Longest subarray containing at most two distinct values.",
      "summary": "Expand right; while invalid, shrink left — track best window length/sum."
    },
    {
      "id": "tp-20",
      "title": "3Sum Closest",
      "lc": 16,
      "importance": "should",
      "subtopic": "opposite",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums, target",
          "out": "closest sum"
        }
      ],
      "approaches": [
        {
          "name": "Sort + two pointers",
          "time": "O(n^2)",
          "space": "O(1)",
          "code": "int threeSumClosest(vector<int>& nums, int target) {\n    sort(nums.begin(), nums.end());\n    int ans = nums[0] + nums[1] + nums[2];\n    for (int i = 0; i < (int)nums.size(); i++) {\n        int l = i + 1, r = (int)nums.size() - 1;\n        while (l < r) {\n            int s = nums[i] + nums[l] + nums[r];\n            if (abs(s - target) < abs(ans - target)) ans = s;\n            if (s < target) l++; else r--;\n        }\n    }\n    return ans;\n}"
        }
      ],
      "description": "Given input per constraints, solve: 3Sum Closest.",
      "summary": "Sort first; l/r or fixed i + two pointers on rest."
    },
    {
      "id": "tp-21",
      "title": "4Sum",
      "lc": 18,
      "importance": "nice",
      "subtopic": "opposite",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums, target",
          "out": "quadruplets"
        }
      ],
      "approaches": [
        {
          "name": "Sort + two pointers",
          "time": "O(n^3)",
          "space": "O(1)",
          "code": "vector<vector<int>> fourSum(vector<int>& nums, int target) {\n    sort(nums.begin(), nums.end()); vector<vector<int>> ans; int n=nums.size();\n    for(int i=0;i<n;i++){\n        if(i && nums[i]==nums[i-1]) continue;\n        for(int j=i+1;j<n;j++){\n            if(j>i+1 && nums[j]==nums[j-1]) continue;\n            long long t=(long long)target-nums[i]-nums[j];\n            int l=j+1, r=n-1;\n            while(l<r){\n                long long s=nums[l]+nums[r];\n                if(s==t){ ans.push_back({nums[i],nums[j],nums[l],nums[r]}); while(l<r&&nums[l]==nums[l+1]) l++; while(l<r&&nums[r]==nums[r-1]) r--; l++; r--; }\n                else if(s<t) l++; else r--;\n            }\n        }\n    } return ans;\n}"
        }
      ],
      "description": "Given input per constraints, solve: 4Sum.",
      "summary": "Sort first; l/r or fixed i + two pointers on rest."
    },
    {
      "id": "tp-22",
      "title": "Boats to Save People",
      "lc": 881,
      "importance": "should",
      "subtopic": "opposite",
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
      "description": "Minimum boats to carry people with weight limit per boat.",
      "summary": "Opposite ends or same direction — move based on comparison/invariant."
    },
    {
      "id": "tp-23",
      "title": "Squares of a Sorted Array",
      "lc": 977,
      "importance": "nice",
      "subtopic": "opposite",
      "difficulty": "Easy",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums",
          "out": "sorted squares"
        }
      ],
      "approaches": [
        {
          "name": "Two pointers merge",
          "time": "O(n)",
          "space": "O(n)",
          "code": "vector<int> sortedSquares(vector<int>& nums) {\n    int n=nums.size(); vector<int> ans(n);\n    int l=0, r=n-1, k=n-1;\n    while(l<=r){ int a=nums[l]*nums[l], b=nums[r]*nums[r]; if(a>b){ ans[k--]=a; l++; } else { ans[k--]=b; r--; } }\n    return ans;\n}"
        }
      ],
      "description": "Given input per constraints, solve: Squares of a Sorted Array.",
      "summary": "Merge two sorted sequences by comparing fronts."
    },
    {
      "id": "tp-24",
      "title": "Reverse String",
      "lc": 344,
      "importance": "nice",
      "subtopic": "opposite",
      "difficulty": "Easy",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "s",
          "out": "reversed"
        }
      ],
      "approaches": [
        {
          "name": "Reverse inplace",
          "time": "O(n)",
          "space": "O(1)",
          "code": "void reverseString(vector<char>& s) {\n    for(int l=0,r=(int)s.size()-1;l<r;l++,r--) swap(s[l],s[r]);\n}"
        }
      ],
      "description": "Given input per constraints, solve: Reverse String.",
      "summary": "Reverse inplace — Two pointers from both ends moving inward based on sum/compare."
    },
    {
      "id": "tp-25",
      "title": "Is Subsequence",
      "lc": 392,
      "importance": "should",
      "subtopic": "same-dir",
      "difficulty": "Easy",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "s, t",
          "out": "true/false"
        }
      ],
      "approaches": [
        {
          "name": "Two pointers",
          "time": "O(n)",
          "space": "O(1)",
          "code": "bool isSubsequence(string s, string t) {\n    int i = 0;\n    for (char ch : t) if (i < (int)s.size() && s[i] == ch) i++;\n    return i == (int)s.size();\n}"
        }
      ],
      "description": "Given input per constraints, solve: Is Subsequence.",
      "summary": "Opposite ends or same direction — move based on comparison/invariant."
    },
    {
      "id": "tp-26",
      "title": "Merge Sorted Array",
      "lc": 88,
      "importance": "should",
      "subtopic": "opposite",
      "difficulty": "Easy",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums1, nums2",
          "out": "merged"
        }
      ],
      "approaches": [
        {
          "name": "Merge from end",
          "time": "O(m+n)",
          "space": "O(1)",
          "code": "void merge(vector<int>& nums1, int m, vector<int>& nums2, int n) {\n    int i = m - 1, j = n - 1, k = m + n - 1;\n    while (j >= 0) nums1[k--] = (i >= 0 && nums1[i] > nums2[j]) ? nums1[i--] : nums2[j--];\n}"
        }
      ],
      "description": "Merge nums2 into nums1 as one sorted array in-place.",
      "summary": "Fill nums1 from back with larger of nums1[i], nums2[j]."
    },
    {
      "id": "tp-27",
      "title": "Backspace String Compare",
      "lc": 844,
      "importance": "nice",
      "subtopic": "same-dir",
      "difficulty": "Easy",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "s, t",
          "out": "equal?"
        }
      ],
      "approaches": [
        {
          "name": "Two pointers backspace",
          "time": "O(n)",
          "space": "O(1)",
          "code": "bool backspaceCompare(string s, string t) {\n    int i=(int)s.size()-1, j=(int)t.size()-1, skipS=0, skipT=0;\n    while(i>=0||j>=0){\n        while(i>=0){ if(s[i]=='#'){ skipS++; i--; } else if(skipS){ skipS--; i--; } else break; }\n        while(j>=0){ if(t[j]=='#'){ skipT++; j--; } else if(skipT){ skipT--; j--; } else break; }\n        if(i>=0 && j>=0 && s[i]!=t[j]) return false;\n        if((i>=0)!=(j>=0)) return false;\n        i--; j--;\n    } return true;\n}"
        }
      ],
      "description": "Given input per constraints, solve: Backspace String Compare.",
      "summary": "Two pointers backspace — state invariant, then loop."
    },
    {
      "id": "tp-28",
      "title": "Longest Mountain in Array",
      "lc": 845,
      "importance": "nice",
      "subtopic": "same-dir",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "arr",
          "out": "peak length"
        }
      ],
      "approaches": [
        {
          "name": "Scan peak extend",
          "time": "O(n)",
          "space": "O(1)",
          "code": "int longestMountain(vector<int>& arr) {\n    int n=arr.size(), ans=0;\n    for(int i=1;i+1<n;i++){\n        if(arr[i-1]<arr[i] && arr[i]>arr[i+1]){\n            int l=i-1, r=i+1;\n            while(l>0 && arr[l-1]<arr[l]) l--;\n            while(r+1<n && arr[r+1]<arr[r]) r++;\n            ans=max(ans, r-l+1);\n        }\n    } return ans;\n}"
        }
      ],
      "description": "Compute the longest mountain in array over the given input per constraints.",
      "summary": "Scan peak extend — state invariant, then loop."
    }
  ]
};
