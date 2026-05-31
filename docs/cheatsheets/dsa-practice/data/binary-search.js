window.PRACTICE_TOPIC = {
  "id": "binary-search",
  "title": "Binary Search",
  "expected_count": 26,
  "strategy": "<strong>Speed-run:</strong> 90% are first-true on answer space — master the three templates. Filter <em>Must do</em> first.",
  "subtopics": [
    {
      "id": "exact",
      "label": "Exact"
    },
    {
      "id": "first-true",
      "label": "First True"
    },
    {
      "id": "last-true",
      "label": "Last True"
    },
    {
      "id": "rotated",
      "label": "Rotated"
    },
    {
      "id": "answer-space",
      "label": "Answer Space"
    },
    {
      "id": "2d",
      "label": "2D"
    }
  ],
  "questions": [
    {
      "id": "bs-01",
      "title": "Binary Search",
      "lc": 704,
      "importance": "must",
      "subtopic": "exact",
      "difficulty": "Easy",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums, target",
          "out": "index"
        }
      ],
      "approaches": [
        {
          "name": "Classic binary search",
          "time": "O(log n)",
          "space": "O(1)",
          "code": "int search(vector<int>& nums, int target) {\n    int lo = 0, hi = (int)nums.size()-1;\n    while (lo <= hi) {\n        int mid = lo + (hi-lo)/2;\n        if (nums[mid] == target) return mid;\n        if (nums[mid] < target) lo = mid+1; else hi = mid-1;\n    } return -1;\n}"
        }
      ]
    },
    {
      "id": "bs-02",
      "title": "Search Insert Position",
      "lc": 35,
      "importance": "must",
      "subtopic": "first-true",
      "difficulty": "Easy",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums, target",
          "out": "index"
        }
      ],
      "approaches": [
        {
          "name": "Lower bound",
          "time": "O(log n)",
          "space": "O(1)",
          "code": "int searchInsert(vector<int>& nums, int target) {\n    int lo=0, hi=(int)nums.size()-1;\n    while (lo <= hi) {\n        int mid = lo+(hi-lo)/2;\n        if (nums[mid] >= target) hi = mid-1; else lo = mid+1;\n    } return lo;\n}"
        }
      ]
    },
    {
      "id": "bs-03",
      "title": "Find First and Last Position",
      "lc": 34,
      "importance": "must",
      "subtopic": "first-true",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums, target",
          "out": "[l,r]"
        }
      ],
      "approaches": [
        {
          "name": "Two binary searches",
          "time": "O(log n)",
          "space": "O(1)",
          "code": "vector<int> searchRange(vector<int>& nums, int target) {\n    auto lb = [&](bool first){\n        int lo=0, hi=(int)nums.size()-1, ans=-1;\n        while (lo<=hi) {\n            int mid=lo+(hi-lo)/2;\n            if (nums[mid]==target) { ans=mid; if (first) hi=mid-1; else lo=mid+1; }\n            else if (nums[mid]<target) lo=mid+1; else hi=mid-1;\n        } return ans;\n    };\n    return {lb(true), lb(false)};\n}"
        }
      ]
    },
    {
      "id": "bs-04",
      "title": "Search in Rotated Sorted Array",
      "lc": 33,
      "importance": "must",
      "subtopic": "rotated",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums, target",
          "out": "index"
        }
      ],
      "approaches": [
        {
          "name": "BS on rotated half",
          "time": "O(log n)",
          "space": "O(1)",
          "code": "int search(vector<int>& nums, int target) {\n    int lo = 0, hi = (int)nums.size()-1;\n    while (lo <= hi) {\n        int mid = lo + (hi-lo)/2;\n        if (nums[mid] == target) return mid;\n        if (nums[lo] <= nums[mid]) {\n            if (nums[lo] <= target && target < nums[mid]) hi = mid-1; else lo = mid+1;\n        } else {\n            if (nums[mid] < target && target <= nums[hi]) lo = mid+1; else hi = mid-1;\n        }\n    } return -1;\n}"
        }
      ]
    },
    {
      "id": "bs-05",
      "title": "Find Minimum in Rotated Array",
      "lc": 153,
      "importance": "must",
      "subtopic": "rotated",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums",
          "out": "min"
        }
      ],
      "approaches": [
        {
          "name": "BS rotated min",
          "time": "O(log n)",
          "space": "O(1)",
          "code": "int findMin(vector<int>& nums) {\n    int lo=0, hi=(int)nums.size()-1;\n    while (lo < hi) {\n        int mid = lo+(hi-lo)/2;\n        if (nums[mid] > nums[hi]) lo = mid+1; else hi = mid;\n    } return nums[lo];\n}"
        }
      ]
    },
    {
      "id": "bs-06",
      "title": "Koko Eating Bananas",
      "lc": 875,
      "importance": "must",
      "subtopic": "answer-space",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "piles, h",
          "out": "min speed"
        }
      ],
      "approaches": [
        {
          "name": "BS on answer",
          "time": "O(n log m)",
          "space": "O(1)",
          "code": "bool ok(int speed, vector<int>& piles, int h) {\n    long long t = 0;\n    for (int p : piles) t += (p + speed - 1) / speed;\n    return t <= h;\n}\nint minEatingSpeed(vector<int>& piles, int h) {\n    int lo = 1, hi = 1e9, ans = hi;\n    while (lo <= hi) {\n        int mid = lo + (hi-lo)/2;\n        if (ok(mid, piles, h)) { ans = mid; hi = mid-1; } else lo = mid+1;\n    } return ans;\n}"
        }
      ]
    },
    {
      "id": "bs-07",
      "title": "Capacity To Ship Packages",
      "lc": 1011,
      "importance": "must",
      "subtopic": "answer-space",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "weights, days",
          "out": "capacity"
        }
      ],
      "approaches": [
        {
          "name": "BS capacity",
          "time": "O(n log S)",
          "space": "O(1)",
          "code": "bool ship(vector<int>& w, int days, int cap) {\n    int d=1, cur=0;\n    for (int x: w) { if (x>cap) return false; if (cur+x>cap) { d++; cur=0; } cur+=x; }\n    return d<=days;\n}\nint shipWithinDays(vector<int>& weights, int days) {\n    int lo=*max_element(weights.begin(), weights.end()), hi=accumulate(weights.begin(), weights.end(), 0);\n    while (lo<hi) { int mid=lo+(hi-lo)/2; if (ship(weights,days,mid)) hi=mid; else lo=mid+1; }\n    return lo;\n}"
        }
      ]
    },
    {
      "id": "bs-08",
      "title": "Split Array Largest Sum",
      "lc": 410,
      "importance": "should",
      "subtopic": "answer-space",
      "difficulty": "Hard",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums, k",
          "out": "min max sum"
        }
      ],
      "approaches": [
        {
          "name": "BS on answer",
          "time": "O(n log A)",
          "space": "O(1)",
          "code": "int lo=minAns, hi=maxAns;\nwhile (lo<=hi) { int mid=lo+(hi-lo)/2; if (feasible(mid)) { ans=mid; hi=mid-1; } else lo=mid+1; }"
        }
      ]
    },
    {
      "id": "bs-09",
      "title": "Sqrt(x)",
      "lc": 69,
      "importance": "should",
      "subtopic": "last-true",
      "difficulty": "Easy",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "x",
          "out": "sqrt"
        }
      ],
      "approaches": [
        {
          "name": "Optimal",
          "time": "O(n)",
          "space": "O(n)",
          "code": "// Pattern: last-true\n// Implement optimal C++ for LC 69"
        }
      ]
    },
    {
      "id": "bs-10",
      "title": "Find Peak Element",
      "lc": 162,
      "importance": "should",
      "subtopic": "peak",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums",
          "out": "peak index"
        }
      ],
      "approaches": [
        {
          "name": "Optimal",
          "time": "O(n)",
          "space": "O(n)",
          "code": "// Pattern: peak\n// Implement optimal C++ for LC 162"
        }
      ]
    },
    {
      "id": "bs-11",
      "title": "Search a 2D Matrix",
      "lc": 74,
      "importance": "must",
      "subtopic": "2d",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "matrix, target",
          "out": "found?"
        }
      ],
      "approaches": [
        {
          "name": "Search 2D matrix",
          "time": "O(log mn)",
          "space": "O(1)",
          "code": "bool searchMatrix(vector<vector<int>>& m, int t) {\n    int lo=0, hi=(int)m.size()*m[0].size()-1;\n    while (lo<=hi) {\n        int mid=lo+(hi-lo)/2, r=mid/m[0].size(), c=mid%m[0].size();\n        if (m[r][c]==t) return true;\n        if (m[r][c]<t) lo=mid+1; else hi=mid-1;\n    } return false;\n}"
        }
      ]
    },
    {
      "id": "bs-12",
      "title": "Search a 2D Matrix II",
      "lc": 240,
      "importance": "should",
      "subtopic": "2d",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "matrix, target",
          "out": "found?"
        }
      ],
      "approaches": [
        {
          "name": "Optimal",
          "time": "O(n)",
          "space": "O(n)",
          "code": "// Pattern: 2d\n// Implement optimal C++ for LC 240"
        }
      ]
    },
    {
      "id": "bs-13",
      "title": "Median of Two Sorted Arrays",
      "lc": 4,
      "importance": "must",
      "subtopic": "advanced",
      "difficulty": "Hard",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums1, nums2",
          "out": "median"
        }
      ],
      "approaches": [
        {
          "name": "Median two arrays",
          "time": "O(log min(m,n))",
          "space": "O(1)",
          "code": "double findMedianSortedArrays(vector<int>& A, vector<int>& B) {\n    if (A.size() > B.size()) swap(A,B);\n    int m=A.size(), n=B.size(), lo=0, hi=m;\n    while (lo <= hi) {\n        int i=lo+(hi-lo)/2, j=(m+n+1)/2-i;\n        int Aleft = i? A[i-1]: INT_MIN, Aright = i<m? A[i]: INT_MAX;\n        int Bleft = j? B[j-1]: INT_MIN, Bright = j<n? B[j]: INT_MAX;\n        if (Aleft <= Bright && Bleft <= Aright)\n            return (m+n)%2? max(Aleft,Bleft) : (max(Aleft,Bleft)+min(Aright,Bright))/2.0;\n        if (Aleft > Bright) hi=i-1; else lo=i+1;\n    } return 0;\n}"
        }
      ]
    },
    {
      "id": "bs-14",
      "title": "Find K Closest Elements",
      "lc": 658,
      "importance": "should",
      "subtopic": "window",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "arr, k, x",
          "out": "subarray"
        }
      ],
      "approaches": [
        {
          "name": "Optimal",
          "time": "O(n)",
          "space": "O(n)",
          "code": "// Pattern: window\n// Implement optimal C++ for LC 658"
        }
      ]
    },
    {
      "id": "bs-15",
      "title": "Kth Missing Positive Number",
      "lc": 1539,
      "importance": "nice",
      "subtopic": "exact",
      "difficulty": "Easy",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "arr, k",
          "out": "number"
        }
      ],
      "approaches": [
        {
          "name": "Missing count BS",
          "time": "O(log n)",
          "space": "O(1)",
          "code": "int findKthPositive(vector<int>& arr, int k) {\n    int lo=0, hi=arr.size();\n    while(lo<hi){ int mid=lo+(hi-lo)/2; if(arr[mid]-mid-1<k) lo=mid+1; else hi=mid; }\n    return lo+k;\n}"
        }
      ]
    },
    {
      "id": "bs-16",
      "title": "Single Element in Sorted Array",
      "lc": 540,
      "importance": "should",
      "subtopic": "exact",
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
          "name": "Optimal",
          "time": "O(n)",
          "space": "O(n)",
          "code": "// Pattern: exact\n// Implement optimal C++ for LC 540"
        }
      ]
    },
    {
      "id": "bs-17",
      "title": "Search in Rotated Sorted Array II",
      "lc": 81,
      "importance": "nice",
      "subtopic": "rotated",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "duplicates",
          "out": "found?"
        }
      ],
      "approaches": [
        {
          "name": "BS with duplicates",
          "time": "O(log n)",
          "space": "O(1)",
          "code": "bool search(vector<int>& nums, int target) {\n    int lo=0, hi=(int)nums.size()-1;\n    while(lo<=hi){\n        int mid=lo+(hi-lo)/2;\n        if(nums[mid]==target) return true;\n        if(nums[lo]==nums[mid]&&nums[mid]==nums[hi]){ lo++; hi--; continue; }\n        if(nums[lo]<=nums[mid]){ if(nums[lo]<=target&&target<nums[mid]) hi=mid-1; else lo=mid+1; }\n        else { if(nums[mid]<target&&target<=nums[hi]) lo=mid+1; else hi=mid-1; }\n    } return false;\n}"
        }
      ]
    },
    {
      "id": "bs-18",
      "title": "Minimum Limit of Balls in a Bag",
      "lc": 1760,
      "importance": "nice",
      "subtopic": "answer-space",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums, ops",
          "out": "min max"
        }
      ],
      "approaches": [
        {
          "name": "BS on answer",
          "time": "O(n log A)",
          "space": "O(1)",
          "code": "int lo=minAns, hi=maxAns;\nwhile (lo<=hi) { int mid=lo+(hi-lo)/2; if (feasible(mid)) { ans=mid; hi=mid-1; } else lo=mid+1; }"
        }
      ]
    },
    {
      "id": "bs-19",
      "title": "Maximum Running Time of Computers",
      "lc": 2141,
      "importance": "nice",
      "subtopic": "answer-space",
      "difficulty": "Hard",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "n, batteries",
          "out": "hours"
        }
      ],
      "approaches": [
        {
          "name": "BS on answer",
          "time": "O(n log A)",
          "space": "O(1)",
          "code": "int lo=minAns, hi=maxAns;\nwhile (lo<=hi) { int mid=lo+(hi-lo)/2; if (feasible(mid)) { ans=mid; hi=mid-1; } else lo=mid+1; }"
        }
      ]
    },
    {
      "id": "bs-20",
      "title": "Aggressive Cows",
      "lc": null,
      "importance": "should",
      "subtopic": "answer-space",
      "difficulty": "Hard",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "stalls, cows",
          "out": "max min dist"
        }
      ],
      "approaches": [
        {
          "name": "BS on answer",
          "time": "O(n log A)",
          "space": "O(1)",
          "code": "int lo=minAns, hi=maxAns;\nwhile (lo<=hi) { int mid=lo+(hi-lo)/2; if (feasible(mid)) { ans=mid; hi=mid-1; } else lo=mid+1; }"
        }
      ]
    },
    {
      "id": "bs-21",
      "title": "Minimum Speed to Arrive on Time",
      "lc": 1870,
      "importance": "nice",
      "subtopic": "answer-space",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "dist, speed, h",
          "out": "min speed"
        }
      ],
      "approaches": [
        {
          "name": "BS on answer",
          "time": "O(n log A)",
          "space": "O(1)",
          "code": "int lo=minAns, hi=maxAns;\nwhile (lo<=hi) { int mid=lo+(hi-lo)/2; if (feasible(mid)) { ans=mid; hi=mid-1; } else lo=mid+1; }"
        }
      ]
    },
    {
      "id": "bs-22",
      "title": "Maximum Value at Given Index",
      "lc": 1802,
      "importance": "nice",
      "subtopic": "answer-space",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "n,index,maxSum",
          "out": "max n"
        }
      ],
      "approaches": [
        {
          "name": "BS on answer",
          "time": "O(n log A)",
          "space": "O(1)",
          "code": "int lo=minAns, hi=maxAns;\nwhile (lo<=hi) { int mid=lo+(hi-lo)/2; if (feasible(mid)) { ans=mid; hi=mid-1; } else lo=mid+1; }"
        }
      ]
    },
    {
      "id": "bs-23",
      "title": "Minimum Absolute Sum Difference",
      "lc": 1818,
      "importance": "nice",
      "subtopic": "exact",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums1, nums2",
          "out": "min diff"
        }
      ],
      "approaches": [
        {
          "name": "Sort + BS",
          "time": "O(n log n)",
          "space": "O(n)",
          "code": "int minAbsoluteSumDiff(vector<int>& a, vector<int>& b) {\n    const int MOD=1e9+7; vector<int> s=a; sort(s.begin(),s.end());\n    long long sum=0, best=0;\n    for(int i=0;i<(int)a.size();i++){\n        sum=(sum+abs(a[i]-b[i]))%MOD;\n        auto it=lower_bound(s.begin(),s.end(),b[i]);\n        if(it!=s.end()) best=max(best, (long long)abs(a[i]-b[i])-abs(*it-b[i]));\n        if(it!=s.begin()){ --it; best=max(best,(long long)abs(a[i]-b[i])-abs(*it-b[i])); }\n    } return (int)((sum-best+MOD)%MOD);\n}"
        }
      ]
    },
    {
      "id": "bs-24",
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
          "name": "Optimal",
          "time": "O(n)",
          "space": "O(n)",
          "code": "// Pattern: prefix\n// Implement optimal C++ for LC 528"
        }
      ]
    },
    {
      "id": "bs-25",
      "title": "Find Right Interval",
      "lc": 436,
      "importance": "nice",
      "subtopic": "first-true",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "intervals",
          "out": "right intervals"
        }
      ],
      "approaches": [
        {
          "name": "Binary search first true",
          "time": "O(log n)",
          "space": "O(1)",
          "code": "int lo=0, hi=n-1, ans=n;\nwhile (lo<=hi) { int mid=lo+(hi-lo)/2; if (ok(mid)) { ans=mid; hi=mid-1; } else lo=mid+1; }"
        }
      ]
    },
    {
      "id": "bs-26",
      "title": "Maximum Candies Allocated to K Children",
      "lc": 2226,
      "importance": "nice",
      "subtopic": "answer-space",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "candies, k",
          "out": "max per child"
        }
      ],
      "approaches": [
        {
          "name": "BS on answer",
          "time": "O(n log A)",
          "space": "O(1)",
          "code": "int lo=minAns, hi=maxAns;\nwhile (lo<=hi) { int mid=lo+(hi-lo)/2; if (feasible(mid)) { ans=mid; hi=mid-1; } else lo=mid+1; }"
        }
      ]
    }
  ]
};
