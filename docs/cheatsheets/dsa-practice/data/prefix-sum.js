window.PRACTICE_TOPIC = {
  "id": "prefix-sum",
  "title": "Prefix Sum & Difference Array",
  "expected_count": 22,
  "strategy": "<strong>Speed-run:</strong> Subarray sum K and range queries — core for arrays. Filter <em>Must do</em> first.",
  "subtopics": [
    {
      "id": "1d-prefix",
      "label": "1D Prefix"
    },
    {
      "id": "2d-prefix",
      "label": "2D Prefix"
    },
    {
      "id": "diff-array",
      "label": "Diff Array"
    },
    {
      "id": "hashmap",
      "label": "+ HashMap"
    },
    {
      "id": "kadane",
      "label": "Kadane"
    },
    {
      "id": "bit",
      "label": "BIT"
    }
  ],
  "questions": [
    {
      "id": "pre-01",
      "title": "Subarray Sum Equals K",
      "lc": 560,
      "importance": "must",
      "subtopic": "1d-prefix",
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
          "name": "Prefix + hashmap",
          "time": "O(n)",
          "space": "O(n)",
          "code": "int subarraySum(vector<int>& nums, int k) {\n    unordered_map<int,int> cnt{{0,1}}; int sum = 0, ans = 0;\n    for (int x : nums) {\n        sum += x; ans += cnt[sum-k]; cnt[sum]++;\n    } return ans;\n}"
        }
      ]
    },
    {
      "id": "pre-02",
      "title": "Range Sum Query Immutable",
      "lc": 303,
      "importance": "must",
      "subtopic": "1d-prefix",
      "difficulty": "Easy",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums, queries",
          "out": "sums"
        }
      ],
      "approaches": [
        {
          "name": "Optimal",
          "time": "O(n)",
          "space": "O(n)",
          "code": "// Pattern: 1d-prefix\n// Implement optimal C++ for LC 303"
        }
      ]
    },
    {
      "id": "pre-03",
      "title": "Range Sum Query 2D",
      "lc": 304,
      "importance": "should",
      "subtopic": "2d-prefix",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "matrix queries",
          "out": "sums"
        }
      ],
      "approaches": [
        {
          "name": "Optimal",
          "time": "O(n)",
          "space": "O(n)",
          "code": "// Pattern: 2d-prefix\n// Implement optimal C++ for LC 304"
        }
      ]
    },
    {
      "id": "pre-04",
      "title": "Product Except Self",
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
          "in": "nums",
          "out": "products"
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
      "id": "pre-05",
      "title": "Find Pivot Index",
      "lc": 724,
      "importance": "should",
      "subtopic": "prefix",
      "difficulty": "Easy",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums",
          "out": "pivot index"
        }
      ],
      "approaches": [
        {
          "name": "Optimal",
          "time": "O(n)",
          "space": "O(n)",
          "code": "// Pattern: prefix\n// Implement optimal C++ for LC 724"
        }
      ]
    },
    {
      "id": "pre-06",
      "title": "Continuous Subarray Sum",
      "lc": 523,
      "importance": "should",
      "subtopic": "prefix",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums, k",
          "out": "true/false"
        }
      ],
      "approaches": [
        {
          "name": "Optimal",
          "time": "O(n)",
          "space": "O(n)",
          "code": "// Pattern: prefix\n// Implement optimal C++ for LC 523"
        }
      ]
    },
    {
      "id": "pre-07",
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
      "id": "pre-08",
      "title": "Maximum Product Subarray",
      "lc": 152,
      "importance": "must",
      "subtopic": "prefix",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums",
          "out": "max product"
        }
      ],
      "approaches": [
        {
          "name": "Max product subarray",
          "time": "O(n)",
          "space": "O(1)",
          "code": "int maxProduct(vector<int>& nums) {\n    int best=nums[0], curMax=nums[0], curMin=nums[0];\n    for (int i=1;i<(int)nums.size();i++) {\n        if (nums[i]<0) swap(curMax, curMin);\n        curMax=max(nums[i], curMax*nums[i]); curMin=min(nums[i], curMin*nums[i]);\n        best=max(best, curMax);\n    } return best;\n}"
        }
      ]
    },
    {
      "id": "pre-09",
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
          "in": "0/1 array",
          "out": "max len"
        }
      ],
      "approaches": [
        {
          "name": "Optimal",
          "time": "O(n)",
          "space": "O(n)",
          "code": "// Pattern: prefix\n// Implement optimal C++ for LC 525"
        }
      ]
    },
    {
      "id": "pre-10",
      "title": "Subarray Sums Divisible by K",
      "lc": 974,
      "importance": "should",
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
      "id": "pre-11",
      "title": "Range Addition II",
      "lc": 598,
      "importance": "nice",
      "subtopic": "2d-diff",
      "difficulty": "Easy",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "m,n, ops",
          "out": "max integer"
        }
      ],
      "approaches": [
        {
          "name": "Min dimension guess",
          "time": "O(max(m,n))",
          "space": "O(1)",
          "code": "int maxCount(int m, int n, vector<vector<int>>& ops) {\n    int minM=m, minN=n;\n    for(auto& o: ops){ minM=min(minM,o[0]); minN=min(minN,o[1]); }\n    return minM*minN;\n}"
        }
      ]
    },
    {
      "id": "pre-12",
      "title": "Corporate Flight Bookings",
      "lc": 1109,
      "importance": "nice",
      "subtopic": "diff-array",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "bookings, n",
          "out": "seats used"
        }
      ],
      "approaches": [
        {
          "name": "Difference array",
          "time": "O(n)",
          "space": "O(n)",
          "code": "vector<int> corpFlightBookings(vector<vector<int>>& bookings, int n) {\n    vector<int> diff(n+1);\n    for(auto& b: bookings){ diff[b[0]-1]+=b[2]; diff[b[1]]-=b[2]; }\n    vector<int> ans(n); int cur=0;\n    for(int i=0;i<n;i++){ cur+=diff[i]; ans[i]=cur; }\n    return ans;\n}"
        }
      ]
    },
    {
      "id": "pre-13",
      "title": "Minimum Value to Get Positive Step by Step Sum",
      "lc": 1413,
      "importance": "nice",
      "subtopic": "prefix",
      "difficulty": "Easy",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums",
          "out": "min start"
        }
      ],
      "approaches": [
        {
          "name": "Prefix min",
          "time": "O(n)",
          "space": "O(1)",
          "code": "int minStartValue(vector<int>& nums) {\n    int sum=0, minSum=0;\n    for(int x: nums){ sum+=x; minSum=min(minSum,sum); }\n    return 1-minSum;\n}"
        }
      ]
    },
    {
      "id": "pre-14",
      "title": "Running Sum of 1d Array",
      "lc": 1480,
      "importance": "nice",
      "subtopic": "prefix",
      "difficulty": "Easy",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums",
          "out": "running sums"
        }
      ],
      "approaches": [
        {
          "name": "Prefix running",
          "time": "O(n)",
          "space": "O(1)",
          "code": "vector<int> runningSum(vector<int>& nums) {\n    for(int i=1;i<(int)nums.size();i++) nums[i]+=nums[i-1];\n    return nums;\n}"
        }
      ]
    },
    {
      "id": "pre-15",
      "title": "Find the Highest Altitude",
      "lc": 1732,
      "importance": "nice",
      "subtopic": "prefix",
      "difficulty": "Easy",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "gain",
          "out": "max altitude"
        }
      ],
      "approaches": [
        {
          "name": "Prefix max altitude",
          "time": "O(n)",
          "space": "O(1)",
          "code": "int largestAltitude(vector<int>& gain) {\n    int cur=0, best=0; for(int x: gain){ cur+=x; best=max(best,cur); } return best;\n}"
        }
      ]
    },
    {
      "id": "pre-16",
      "title": "Number of Ways to Split Array",
      "lc": 2270,
      "importance": "nice",
      "subtopic": "prefix",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums",
          "out": "valid splits"
        }
      ],
      "approaches": [
        {
          "name": "Prefix split count",
          "time": "O(n)",
          "space": "O(1)",
          "code": "int waysToSplitArray(vector<int>& nums) {\n    long long total=accumulate(nums.begin(), nums.end(), 0LL), left=0; int ans=0;\n    for(int i=0;i<(int)nums.size()-1;i++){ left+=nums[i]; if(left>=total-left) ans++; }\n    return ans;\n}"
        }
      ]
    },
    {
      "id": "pre-17",
      "title": "Maximum Size Subarray Sum Equals k",
      "lc": null,
      "importance": "should",
      "subtopic": "hashmap",
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
          "name": "HashMap",
          "time": "O(n)",
          "space": "O(n)",
          "code": "unordered_map<int,int> mp;\n// Single pass: check complement/key before insert"
        }
      ]
    },
    {
      "id": "pre-18",
      "title": "Binary Subarrays With Sum",
      "lc": 930,
      "importance": "should",
      "subtopic": "prefix",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums, goal",
          "out": "count"
        }
      ],
      "approaches": [
        {
          "name": "Optimal",
          "time": "O(n)",
          "space": "O(n)",
          "code": "// Pattern: prefix\n// Implement optimal C++ for LC 930"
        }
      ]
    },
    {
      "id": "pre-19",
      "title": "Shortest Subarray With Sum at Least K",
      "lc": 862,
      "importance": "nice",
      "subtopic": "prefix",
      "difficulty": "Hard",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums, k",
          "out": "min len"
        }
      ],
      "approaches": [
        {
          "name": "Deque + prefix",
          "time": "O(n)",
          "space": "O(n)",
          "code": "int shortestSubarray(vector<int>& nums, int k) {\n    int n=nums.size(); vector<long long> pre(n+1);\n    for(int i=0;i<n;i++) pre[i+1]=pre[i]+nums[i];\n    deque<int> dq; int ans=n+1;\n    for(int i=0;i<=n;i++){\n        while(!dq.empty() && pre[i]-pre[dq.front()]>=k){ ans=min(ans,i-dq.front()); dq.pop_front(); }\n        while(!dq.empty() && pre[i]<=pre[dq.back()]) dq.pop_back();\n        dq.push_back(i);\n    } return ans<=n? ans: -1;\n}"
        }
      ]
    },
    {
      "id": "pre-20",
      "title": "Maximum Sum of Two Non-Overlapping Subarrays",
      "lc": 1031,
      "importance": "nice",
      "subtopic": "prefix",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums, L,M",
          "out": "max sum"
        }
      ],
      "approaches": [
        {
          "name": "Prefix + two windows",
          "time": "O(n)",
          "space": "O(n)",
          "code": "int maxSumTwoNoOverlap(vector<int>& nums, int firstLen, int secondLen) {\n    int n=nums.size(); vector<int> pre(n+1);\n    for(int i=0;i<n;i++) pre[i+1]=pre[i]+nums[i];\n    auto best=[&](int L,int M){\n        int ans=0, bestL=0;\n        for(int i=L;i<=n-M;i++){\n            bestL=max(bestL, pre[i]-pre[i-L]);\n            ans=max(ans, bestL + pre[i+M]-pre[i]);\n        } return ans;\n    };\n    return max(best(firstLen,secondLen), best(secondLen,firstLen));\n}"
        }
      ]
    },
    {
      "id": "pre-21",
      "title": "Range Sum Query Mutable",
      "lc": 307,
      "importance": "should",
      "subtopic": "bit",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums, updates",
          "out": "range sums"
        }
      ],
      "approaches": [
        {
          "name": "Fenwick tree",
          "time": "O(log n)",
          "space": "O(n)",
          "code": "class NumArray {\n    vector<int> bit; int n;\n    void add(int i, int d) { for (++i; i <= n; i += i&-i) bit[i] += d; }\n    int sum(int i) { int s = 0; for (++i; i > 0; i -= i&-i) s += bit[i]; return s; }\npublic:\n    NumArray(vector<int>& nums) : n(nums.size()), bit(n+1) {\n        for (int i = 0; i < n; i++) add(i, nums[i]);\n    }\n    void update(int index, int val) { add(index, val - sum(index) + sum(index-1)); }\n    int sumRange(int l, int r) { return sum(r) - sum(l-1); }\n};"
        }
      ]
    },
    {
      "id": "pre-22",
      "title": "Count Number of Nice Subarrays",
      "lc": 1248,
      "importance": "should",
      "subtopic": "prefix",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums, k odd",
          "out": "count"
        }
      ],
      "approaches": [
        {
          "name": "Optimal",
          "time": "O(n)",
          "space": "O(n)",
          "code": "// Pattern: prefix\n// Implement optimal C++ for LC 1248"
        }
      ]
    }
  ]
};
