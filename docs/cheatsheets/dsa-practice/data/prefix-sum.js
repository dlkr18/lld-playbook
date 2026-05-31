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
          "name": "Prefix sum",
          "time": "O(1) query",
          "space": "O(n)",
          "code": "class NumArray {\n    vector<int> pre;\npublic:\n    NumArray(vector<int>& nums) {\n        pre.resize(nums.size()+1);\n        for (int i = 0; i < (int)nums.size(); i++) pre[i+1] = pre[i] + nums[i];\n    }\n    int sumRange(int l, int r) { return pre[r+1] - pre[l]; }\n};"
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
          "name": "2D prefix",
          "time": "O(1) query",
          "space": "O(mn)",
          "code": "class NumMatrix {\n    vector<vector<int>> pre;\npublic:\n    NumMatrix(vector<vector<int>>& matrix) {\n        int m = matrix.size(), n = m ? matrix[0].size() : 0;\n        pre.assign(m+1, vector<int>(n+1, 0));\n        for (int i = 0; i < m; i++)\n            for (int j = 0; j < n; j++)\n                pre[i+1][j+1] = matrix[i][j] + pre[i][j+1] + pre[i+1][j] - pre[i][j];\n    }\n    int sumRegion(int r1, int c1, int r2, int c2) {\n        return pre[r2+1][c2+1] - pre[r1][c2+1] - pre[r2+1][c1] + pre[r1][c1];\n    }\n};"
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
          "name": "Prefix balance",
          "time": "O(n)",
          "space": "O(1)",
          "code": "int pivotIndex(vector<int>& nums) {\n    int total = accumulate(nums.begin(), nums.end(), 0), left = 0;\n    for (int i = 0; i < (int)nums.size(); i++) {\n        if (left == total - left - nums[i]) return i;\n        left += nums[i];\n    }\n    return -1;\n}"
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
          "name": "Prefix mod map",
          "time": "O(n)",
          "space": "O(n)",
          "code": "bool checkSubarraySum(vector<int>& nums, int k) {\n    unordered_map<int,int> mp{{0,-1}}; int sum = 0;\n    for (int i = 0; i < (int)nums.size(); i++) {\n        sum += nums[i];\n        int rem = k ? sum % k : sum;\n        if (mp.count(rem)) { if (i - mp[rem] >= 2) return true; }\n        else mp[rem] = i;\n    }\n    return false;\n}"
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
          "name": "Prefix index map",
          "time": "O(n)",
          "space": "O(n)",
          "code": "int findMaxLength(vector<int>& nums) {\n    unordered_map<int,int> first{{0,-1}}; int sum = 0, ans = 0;\n    for (int i = 0; i < (int)nums.size(); i++) {\n        sum += nums[i] ? 1 : -1;\n        if (first.count(sum)) ans = max(ans, i - first[sum]);\n        else first[sum] = i;\n    }\n    return ans;\n}"
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
          "name": "Prefix + hashmap",
          "time": "O(n)",
          "space": "O(n)",
          "code": "int maxSubArrayLen(vector<int>& nums, int k) {\n    unordered_map<long long,int> first{{0,-1}};\n    long long sum = 0; int ans = 0;\n    for (int i = 0; i < (int)nums.size(); i++) {\n        sum += nums[i];\n        if (first.count(sum - k)) ans = max(ans, i - first[sum - k]);\n        if (!first.count(sum)) first[sum] = i;\n    }\n    return ans;\n}"
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
          "name": "Prefix mod counts",
          "time": "O(n)",
          "space": "O(n)",
          "code": "int numSubarraysWithSum(vector<int>& nums, int goal) {\n    auto atMost = [&](int g) {\n        if (g < 0) return 0;\n        long ans = 0; int l = 0, sum = 0;\n        for (int r = 0; r < (int)nums.size(); r++) {\n            sum += nums[r];\n            while (sum > g) sum -= nums[l++];\n            ans += r - l + 1;\n        }\n        return ans;\n    };\n    return (int)(atMost(goal) - atMost(goal - 1));\n}"
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
          "name": "Prefix mod parity",
          "time": "O(n)",
          "space": "O(n)",
          "code": "int numberOfSubarrays(vector<int>& nums, int k) {\n    unordered_map<int,int> cnt{{0,1}}; int pref = 0, ans = 0;\n    for (int x : nums) {\n        pref ^= x & 1;\n        ans += cnt[pref ^ (k & 1)];\n        cnt[pref]++;\n    }\n    return ans;\n}"
        }
      ]
    }
  ]
};
