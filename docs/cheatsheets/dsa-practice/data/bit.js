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
      ]
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
      ]
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
      ]
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
      ]
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
      ]
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
      ]
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
      ]
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
      ]
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
      ]
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
      ]
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
      ]
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
      ]
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
      ]
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
      ]
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
      ]
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
      ]
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
      ]
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
      ]
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
      ]
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
      ]
    }
  ]
};
