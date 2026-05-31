window.PRACTICE_TOPIC = {
  "id": "arrays",
  "title": "Arrays & Hashing",
  "expected_count": 28,
  "strategy": "<strong>Speed-run:</strong> hashmap,hashset,prefix — filter Must do first. Filter <em>Must do</em> first.",
  "subtopics": [
    {
      "id": "hashmap",
      "label": "HashMap"
    },
    {
      "id": "hashset",
      "label": "HashSet"
    },
    {
      "id": "prefix",
      "label": "Prefix"
    },
    {
      "id": "counting",
      "label": "Counting"
    },
    {
      "id": "design",
      "label": "Design"
    },
    {
      "id": "matrix",
      "label": "Matrix"
    },
    {
      "id": "indexing",
      "label": "Indexing"
    },
    {
      "id": "kadane",
      "label": "Kadane"
    }
  ],
  "questions": [
    {
      "id": "arr-01",
      "title": "Two Sum",
      "lc": 1,
      "importance": "must",
      "subtopic": "hashmap",
      "difficulty": "Easy",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums=[2,7], target=9",
          "out": "9"
        }
      ],
      "approaches": [
        {
          "name": "HashMap complement",
          "time": "O(n)",
          "space": "O(n)",
          "code": "vector<int> twoSum(vector<int>& nums, int target) {\n    unordered_map<int,int> mp;\n    for (int i = 0; i < (int)nums.size(); i++) {\n        if (mp.count(target - nums[i])) return {mp[target-nums[i]], i};\n        mp[nums[i]] = i;\n    } return {};\n}"
        }
      ]
    },
    {
      "id": "arr-02",
      "title": "Group Anagrams",
      "lc": 49,
      "importance": "must",
      "subtopic": "hashmap",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "strs=[\"eat\",\"tea\",\"tan\"]",
          "out": "grouped lists"
        }
      ],
      "approaches": [
        {
          "name": "Sort/freq key grouping",
          "time": "O(nk log k)",
          "space": "O(nk)",
          "code": "vector<vector<string>> groupAnagrams(vector<string>& strs) {\n    unordered_map<string, vector<string>> mp;\n    for (string& s : strs) {\n        string k = s; sort(k.begin(), k.end());\n        mp[k].push_back(s);\n    }\n    vector<vector<string>> ans;\n    for (auto& p : mp) ans.push_back(p.second);\n    return ans;\n}"
        }
      ]
    },
    {
      "id": "arr-03",
      "title": "Top K Frequent Elements",
      "lc": 347,
      "importance": "must",
      "subtopic": "hashmap",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums=[1,1,1,2,2,3], k=2",
          "out": "[1,2]"
        }
      ],
      "approaches": [
        {
          "name": "Bucket sort by freq",
          "time": "O(n)",
          "space": "O(n)",
          "code": "vector<int> topKFrequent(vector<int>& nums, int k) {\n    unordered_map<int,int> freq;\n    for (int x : nums) freq[x]++;\n    vector<vector<int>> buckets(nums.size()+1);\n    for (auto& p : freq) buckets[p.second].push_back(p.first);\n    vector<int> ans;\n    for (int i = (int)buckets.size()-1; i >= 0 && (int)ans.size() < k; i--)\n        for (int x : buckets[i]) { ans.push_back(x); if ((int)ans.size()==k) break; }\n    return ans;\n}"
        }
      ]
    },
    {
      "id": "arr-04",
      "title": "Longest Consecutive Sequence",
      "lc": 128,
      "importance": "must",
      "subtopic": "hashset",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums=[100,4,200,1,3,2]",
          "out": "4"
        }
      ],
      "approaches": [
        {
          "name": "HashSet sequence heads",
          "time": "O(n)",
          "space": "O(n)",
          "code": "int longestConsecutive(vector<int>& nums) {\n    unordered_set<int> st(nums.begin(), nums.end());\n    int best = 0;\n    for (int x : st) {\n        if (st.count(x-1)) continue;\n        int len = 1;\n        while (st.count(x+len)) len++;\n        best = max(best, len);\n    } return best;\n}"
        }
      ]
    },
    {
      "id": "arr-05",
      "title": "Valid Anagram",
      "lc": 242,
      "importance": "must",
      "subtopic": "counting",
      "difficulty": "Easy",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "s=\"anagram\", t=\"nagaram\"",
          "out": "true"
        }
      ],
      "approaches": [
        {
          "name": "Freq array",
          "time": "O(n)",
          "space": "O(1)",
          "code": "bool isAnagram(string s, string t) {\n    if (s.size() != t.size()) return false;\n    int c[26] = {};\n    for (char ch : s) c[ch-'a']++;\n    for (char ch : t) if (--c[ch-'a'] < 0) return false;\n    return true;\n}"
        }
      ]
    },
    {
      "id": "arr-06",
      "title": "Contains Duplicate",
      "lc": 217,
      "importance": "should",
      "subtopic": "hashset",
      "difficulty": "Easy",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums=[1,2,3,1]",
          "out": "true"
        }
      ],
      "approaches": [
        {
          "name": "HashSet",
          "time": "O(n)",
          "space": "O(n)",
          "code": "bool containsDuplicate(vector<int>& nums) {\n    unordered_set<int> s;\n    for (int x : nums) if (!s.insert(x).second) return true;\n    return false;\n}"
        }
      ]
    },
    {
      "id": "arr-07",
      "title": "Product of Array Except Self",
      "lc": 238,
      "importance": "must",
      "subtopic": "prefix",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums=[1,2,3,4]",
          "out": "[24,12,8,6]"
        }
      ],
      "approaches": [
        {
          "name": "Prefix/suffix product",
          "time": "O(n)",
          "space": "O(1) out",
          "code": "vector<int> productExceptSelf(vector<int>& nums) {\n    int n = nums.size(); vector<int> ans(n, 1);\n    int p = 1; for (int i = 0; i < n; i++) { ans[i] = p; p *= nums[i]; }\n    p = 1; for (int i = n-1; i >= 0; i--) { ans[i] *= p; p *= nums[i]; }\n    return ans;\n}"
        }
      ]
    },
    {
      "id": "arr-08",
      "title": "Encode and Decode Strings",
      "lc": 271,
      "importance": "should",
      "subtopic": "design",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "list of strings",
          "out": "round-trip"
        }
      ],
      "approaches": [
        {
          "name": "Length prefix",
          "time": "O(n)",
          "space": "O(n)",
          "code": "class Codec {\npublic:\n    string encode(vector<string>& strs) {\n        string out;\n        for (string& s : strs) { out += to_string(s.size()) + \"#\" + s; }\n        return out;\n    }\n    vector<string> decode(string s) {\n        vector<string> ans; int i = 0;\n        while (i < (int)s.size()) {\n            int j = s.find('#', i); int len = stoi(s.substr(i, j-i));\n            ans.push_back(s.substr(j+1, len)); i = j + 1 + len;\n        }\n        return ans;\n    }\n};"
        }
      ]
    },
    {
      "id": "arr-09",
      "title": "Subarray Sum Equals K",
      "lc": 560,
      "importance": "must",
      "subtopic": "prefix",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums=[1,1,1], k=2",
          "out": "2"
        }
      ],
      "approaches": [
        {
          "name": "Prefix + hashmap",
          "time": "O(n)",
          "space": "O(n)",
          "code": "int subarraySum(vector<int>& nums, int k) {\n    unordered_map<int,int> cnt{{0,1}}; int sum = 0, ans = 0;\n    for (int x : nums) {\n        sum += x; ans += cnt[sum-k]; cnt[sum]++;\n    } return ans;\n}"
        }
      ]
    },
    {
      "id": "arr-10",
      "title": "First Missing Positive",
      "lc": 41,
      "importance": "must",
      "subtopic": "indexing",
      "difficulty": "Hard",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums=[3,4,-1,1]",
          "out": "2"
        }
      ],
      "approaches": [
        {
          "name": "Index marking",
          "time": "O(n)",
          "space": "O(1)",
          "code": "int firstMissingPositive(vector<int>& nums) {\n    int n = nums.size();\n    for (int i = 0; i < n; i++)\n        while (nums[i] > 0 && nums[i] <= n && nums[nums[i]-1] != nums[i])\n            swap(nums[i], nums[nums[i]-1]);\n    for (int i = 0; i < n; i++) if (nums[i] != i+1) return i+1;\n    return n+1;\n}"
        }
      ]
    },
    {
      "id": "arr-11",
      "title": "Set Matrix Zeroes",
      "lc": 73,
      "importance": "should",
      "subtopic": "matrix",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "matrix with 0",
          "out": "zero rows/cols"
        }
      ],
      "approaches": [
        {
          "name": "Set matrix zeroes",
          "time": "O(mn)",
          "space": "O(1)",
          "code": "void setZeroes(vector<vector<int>>& m) {\n    int m0=1, n0=1;\n    for (int i=0;i<(int)m.size();i++) if (!m[i][0]) m0=0;\n    for (int j=0;j<(int)m[0].size();j++) if (!m[0][j]) n0=0;\n    for (int i=1;i<(int)m.size();i++) for (int j=1;j<(int)m[0].size();j++)\n        if (!m[i][j]) { m[i][0]=0; m[0][j]=0; }\n    for (int i=1;i<(int)m.size();i++) for (int j=1;j<(int)m[0].size();j++)\n        if (!m[i][0] || !m[0][j]) m[i][j]=0;\n    if (!m0) for (int i=0;i<(int)m.size();i++) m[i][0]=0;\n    if (!n0) for (int j=0;j<(int)m[0].size();j++) m[0][j]=0;\n}"
        }
      ]
    },
    {
      "id": "arr-12",
      "title": "Rotate Image",
      "lc": 48,
      "importance": "should",
      "subtopic": "matrix",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "90° clockwise",
          "out": "in-place"
        }
      ],
      "approaches": [
        {
          "name": "Rotate matrix",
          "time": "O(n^2)",
          "space": "O(1)",
          "code": "void rotate(vector<vector<int>>& m) {\n    int n=m.size(); reverse(m.begin(), m.end());\n    for (int i=0;i<n;i++) for (int j=i+1;j<n;j++) swap(m[i][j], m[j][i]);\n}"
        }
      ]
    },
    {
      "id": "arr-13",
      "title": "Spiral Matrix",
      "lc": 54,
      "importance": "should",
      "subtopic": "matrix",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "m x n matrix",
          "out": "spiral order"
        }
      ],
      "approaches": [
        {
          "name": "Boundary walk",
          "time": "O(mn)",
          "space": "O(1)",
          "code": "vector<int> spiralOrder(vector<vector<int>>& m) {\n    vector<int> ans;\n    if (m.empty()) return ans;\n    int t = 0, b = (int)m.size()-1, l = 0, r = (int)m[0].size()-1;\n    while (t <= b && l <= r) {\n        for (int c = l; c <= r; c++) ans.push_back(m[t][c]); t++;\n        for (int row = t; row <= b; row++) ans.push_back(m[row][r]); r--;\n        if (t <= b) { for (int c = r; c >= l; c--) ans.push_back(m[b][c]); b--; }\n        if (l <= r) { for (int row = b; row >= t; row--) ans.push_back(m[row][l]); l++; }\n    }\n    return ans;\n}"
        }
      ]
    },
    {
      "id": "arr-14",
      "title": "Valid Sudoku",
      "lc": 36,
      "importance": "nice",
      "subtopic": "hashset",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "9x9 board",
          "out": "true/false"
        }
      ],
      "approaches": [
        {
          "name": "Row/col/box sets",
          "time": "O(1)",
          "space": "O(1)",
          "code": "bool isValidSudoku(vector<vector<char>>& b) {\n    bool row[9][9]={}, col[9][9]={}, box[9][9]={};\n    for (int r=0;r<9;r++) for (int c=0;c<9;c++) {\n        if (b[r][c]=='.') continue;\n        int d=b[r][c]-'1', k=(r/3)*3+c/3;\n        if (row[r][d]||col[c][d]||box[k][d]) return false;\n        row[r][d]=col[c][d]=box[k][d]=true;\n    } return true;\n}"
        }
      ]
    },
    {
      "id": "arr-15",
      "title": "Insert Delete GetRandom O(1)",
      "lc": 380,
      "importance": "should",
      "subtopic": "design",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "randomized set ops",
          "out": "O(1) avg"
        }
      ],
      "approaches": [
        {
          "name": "HashMap + vector",
          "time": "O(1) avg",
          "space": "O(n)",
          "code": "class RandomizedSet {\n    vector<int> arr; unordered_map<int,int> idx;\npublic:\n    bool insert(int val) {\n        if (idx.count(val)) return false;\n        idx[val] = arr.size(); arr.push_back(val); return true;\n    }\n    bool remove(int val) {\n        if (!idx.count(val)) return false;\n        int i = idx[val], last = arr.back();\n        arr[i] = last; idx[last] = i; arr.pop_back(); idx.erase(val); return true;\n    }\n    int getRandom() { return arr[rand() % arr.size()]; }\n};"
        }
      ]
    },
    {
      "id": "arr-16",
      "title": "Contiguous Array",
      "lc": 525,
      "importance": "should",
      "subtopic": "prefix",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "0/1 max equal count",
          "out": "length"
        }
      ],
      "approaches": [
        {
          "name": "Prefix index map",
          "time": "O(n)",
          "space": "O(n)",
          "code": "int findMaxLength(vector<int>& nums) {\n    unordered_map<int,int> first{{0,-1}}; int sum = 0, ans = 0;\n    for (int i = 0; i < (int)nums.size(); i++) {\n        sum += nums[i] ? 1 : -1;\n        if (first.count(sum)) ans = max(ans, i - first[sum]);\n        else first[sum] = i;\n    }\n    return ans;\n}"
        }
      ]
    },
    {
      "id": "arr-17",
      "title": "Subarray Sum Divisible by K",
      "lc": 974,
      "importance": "nice",
      "subtopic": "prefix",
      "difficulty": "Medium",
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
          "name": "Prefix mod counts",
          "time": "O(n)",
          "space": "O(k)",
          "code": "int subarraysDivByK(vector<int>& nums, int k) {\n    unordered_map<int,int> cnt{{0,1}}; int sum=0, ans=0;\n    for (int x: nums) { sum=((sum+x)%k+k)%k; ans+=cnt[sum]++; }\n    return ans;\n}"
        }
      ]
    },
    {
      "id": "arr-18",
      "title": "Find All Anagrams in String",
      "lc": 438,
      "importance": "should",
      "subtopic": "counting",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "s, p",
          "out": "start indices"
        }
      ],
      "approaches": [
        {
          "name": "Freq window",
          "time": "O(n)",
          "space": "O(1)",
          "code": "vector<int> findAnagrams(string s, string p) {\n    if (p.size() > s.size()) return {};\n    vector<int> need(26), have(26), ans;\n    for (char ch : p) need[ch-'a']++;\n    for (int i = 0; i < (int)s.size(); i++) {\n        have[s[i]-'a']++;\n        if (i >= (int)p.size()) have[s[i-p.size()]-'a']--;\n        if (i >= (int)p.size()-1 && have == need) ans.push_back(i - (int)p.size() + 1);\n    }\n    return ans;\n}"
        }
      ]
    },
    {
      "id": "arr-19",
      "title": "Ransom Note",
      "lc": 383,
      "importance": "nice",
      "subtopic": "counting",
      "difficulty": "Easy",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "ransomNote, magazine",
          "out": "true/false"
        }
      ],
      "approaches": [
        {
          "name": "Freq count",
          "time": "O(n)",
          "space": "O(1)",
          "code": "bool canConstruct(string ransom, string magazine) {\n    int c[26]={}; for (char ch: magazine) c[ch-'a']++;\n    for (char ch: ransom) if (--c[ch-'a']<0) return false;\n    return true;\n}"
        }
      ]
    },
    {
      "id": "arr-20",
      "title": "Intersection of Two Arrays II",
      "lc": 350,
      "importance": "nice",
      "subtopic": "hashmap",
      "difficulty": "Easy",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums1, nums2",
          "out": "intersection"
        }
      ],
      "approaches": [
        {
          "name": "HashMap counts",
          "time": "O(n)",
          "space": "O(n)",
          "code": "vector<int> intersect(vector<int>& a, vector<int>& b) {\n    unordered_map<int,int> cnt; for (int x:a) cnt[x]++;\n    vector<int> ans; for (int x:b) if (cnt[x]-->0) ans.push_back(x);\n    return ans;\n}"
        }
      ]
    },
    {
      "id": "arr-21",
      "title": "Happy Number",
      "lc": 202,
      "importance": "nice",
      "subtopic": "hashset",
      "difficulty": "Easy",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "n=19",
          "out": "true"
        }
      ],
      "approaches": [
        {
          "name": "Floyd cycle on squares",
          "time": "O(log n)",
          "space": "O(1)",
          "code": "int sqSum(int n){ int s=0; while(n){ s+= (n%10)*(n%10); n/=10; } return s; }\nbool isHappy(int n) {\n    int slow=n, fast=n;\n    do { slow=sqSum(slow); fast=sqSum(sqSum(fast)); } while (slow!=fast);\n    return slow==1;\n}"
        }
      ]
    },
    {
      "id": "arr-22",
      "title": "Isomorphic Strings",
      "lc": 205,
      "importance": "should",
      "subtopic": "hashmap",
      "difficulty": "Easy",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "s=\"egg\", t=\"add\"",
          "out": "true"
        }
      ],
      "approaches": [
        {
          "name": "Two maps",
          "time": "O(n)",
          "space": "O(1)",
          "code": "bool isIsomorphic(string s, string t) {\n    if (s.size() != t.size()) return false;\n    char ms[256]={}, mt[256]={};\n    for (int i = 0; i < (int)s.size(); i++) {\n        if (ms[(unsigned char)s[i]] != mt[(unsigned char)t[i]]) return false;\n        ms[(unsigned char)s[i]] = t[i]; mt[(unsigned char)t[i]] = s[i];\n    }\n    return true;\n}"
        }
      ]
    },
    {
      "id": "arr-23",
      "title": "Majority Element",
      "lc": 169,
      "importance": "should",
      "subtopic": "counting",
      "difficulty": "Easy",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums",
          "out": "majority"
        }
      ],
      "approaches": [
        {
          "name": "Boyer-Moore",
          "time": "O(n)",
          "space": "O(1)",
          "code": "int majorityElement(vector<int>& nums) {\n    int cand=0, cnt=0;\n    for (int x: nums) { if (!cnt) { cand=x; cnt=1; } else cnt += (x==cand? 1:-1); }\n    return cand;\n}"
        }
      ]
    },
    {
      "id": "arr-24",
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
          "out": "shift zeros"
        }
      ],
      "approaches": [
        {
          "name": "Two pointers",
          "time": "O(n)",
          "space": "O(1)",
          "code": "void moveZeroes(vector<int>& nums) {\n    int w = 0;\n    for (int x : nums) if (x) nums[w++] = x;\n    while (w < (int)nums.size()) nums[w++] = 0;\n}"
        }
      ]
    },
    {
      "id": "arr-25",
      "title": "Best Time to Buy and Sell Stock",
      "lc": 121,
      "importance": "must",
      "subtopic": "scan",
      "difficulty": "Easy",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "prices",
          "out": "max profit"
        }
      ],
      "approaches": [
        {
          "name": "Stock I",
          "time": "O(n)",
          "space": "O(1)",
          "code": "int maxProfit(vector<int>& p) {\n    int minP=INT_MAX, ans=0;\n    for (int x: p) { minP=min(minP,x); ans=max(ans,x-minP); }\n    return ans;\n}"
        }
      ]
    },
    {
      "id": "arr-26",
      "title": "Maximum Subarray",
      "lc": 53,
      "importance": "must",
      "subtopic": "kadane",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums",
          "out": "max sum"
        }
      ],
      "approaches": [
        {
          "name": "Kadane",
          "time": "O(n)",
          "space": "O(1)",
          "code": "int maxSubArray(vector<int>& nums) {\n    int best=nums[0], cur=nums[0];\n    for (int i=1;i<(int)nums.size();i++) { cur=max(nums[i], cur+nums[i]); best=max(best,cur); }\n    return best;\n}"
        }
      ]
    },
    {
      "id": "arr-27",
      "title": "Merge Sorted Array",
      "lc": 88,
      "importance": "should",
      "subtopic": "two-ptr",
      "difficulty": "Easy",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums1, m, nums2, n",
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
      ]
    },
    {
      "id": "arr-28",
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
          "out": "next lexicographic"
        }
      ],
      "approaches": [
        {
          "name": "Next permutation",
          "time": "O(n)",
          "space": "O(1)",
          "code": "void nextPermutation(vector<int>& nums) {\n    int i=(int)nums.size()-2;\n    while (i>=0 && nums[i]>=nums[i+1]) i--;\n    if (i>=0) { int j=(int)nums.size()-1; while (nums[j]<=nums[i]) j--; swap(nums[i],nums[j]); }\n    reverse(nums.begin()+i+1, nums.end());\n}"
        }
      ]
    }
  ]
};
