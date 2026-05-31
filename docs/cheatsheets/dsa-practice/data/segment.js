window.PRACTICE_TOPIC = {
  "id": "segment",
  "title": "Segment Tree & BIT",
  "expected_count": 16,
  "strategy": "<strong>Speed-run:</strong> Fenwick for point update + range sum; segment tree for range max/min. Filter <em>Must do</em> first.",
  "subtopics": [
    {
      "id": "fenwick",
      "label": "Fenwick BIT"
    },
    {
      "id": "segment",
      "label": "Segment Tree"
    },
    {
      "id": "lazy",
      "label": "Lazy Prop"
    },
    {
      "id": "bit",
      "label": "BIT Apps"
    }
  ],
  "questions": [
    {
      "id": "sg-01",
      "title": "Range Sum Query Mutable",
      "lc": 307,
      "importance": "must",
      "subtopic": "fenwick",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums, ops",
          "out": "sums"
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
      "id": "sg-02",
      "title": "Range Sum Query 2D Mutable",
      "lc": 308,
      "importance": "nice",
      "subtopic": "2d-bit",
      "difficulty": "Hard",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "matrix",
          "out": "sums"
        }
      ],
      "approaches": [
        {
          "name": "2D Fenwick",
          "time": "O(log mn)",
          "space": "O(mn)",
          "code": "class NumMatrix {\n    vector<vector<int>> bit, mat; int m,n;\n    void add(int i,int j,int d){ for(int x=i+1;x<=m;x+=x&-x) for(int y=j+1;y<=n;y+=y&-y) bit[x][y]+=d; }\n    int sum(int i,int j){ int s=0; for(int x=i+1;x>0;x-=x&-x) for(int y=j+1;y>0;y-=y&-y) s+=bit[x][y]; return s; }\npublic:\n    NumMatrix(vector<vector<int>>& matrix): mat(matrix){\n        m=matrix.size(); n=m?matrix[0].size():0; bit.assign(m+1, vector<int>(n+1));\n        for(int i=0;i<m;i++) for(int j=0;j<n;j++) add(i,j,matrix[i][j]);\n    }\n    void update(int row,int col,int val){ add(row,col,val-mat[row][col]); mat[row][col]=val; }\n    int sumRegion(int r1,int c1,int r2,int c2){ return sum(r2,c2)-sum(r1-1,c2)-sum(r2,c1-1)+sum(r1-1,c1-1); }\n};"
        }
      ]
    },
    {
      "id": "sg-03",
      "title": "Count of Smaller After Self",
      "lc": 315,
      "importance": "should",
      "subtopic": "bit",
      "difficulty": "Hard",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums",
          "out": "counts"
        }
      ],
      "approaches": [
        {
          "name": "Merge sort count",
          "time": "O(n log n)",
          "space": "O(n)",
          "code": "void mergeCount(vector<int>& nums, int l, int r, vector<int>& tmp, vector<int>& ans) {\n    if (l>=r) return; int mid=l+(r-l)/2; mergeCount(nums,l,mid,tmp,ans); mergeCount(nums,mid+1,r,tmp,ans);\n    int i=l,j=mid+1,k=l; while(i<=mid&&j<=r){ if(nums[i]<=nums[j]) tmp[k++]=nums[i++]; else { ans[i]+=r-j+1; tmp[k++]=nums[j++]; } }\n    while(i<=mid) tmp[k++]=nums[i++]; while(j<=r) tmp[k++]=nums[j++];\n    for(int t=l;t<=r;t++) nums[t]=tmp[t];\n}\nvector<int> countSmaller(vector<int>& nums) {\n    vector<int> ans(nums.size()), tmp(nums.size()); mergeCount(nums,0,(int)nums.size()-1,tmp,ans); return ans;\n}"
        }
      ]
    },
    {
      "id": "sg-04",
      "title": "Count of Range Sum",
      "lc": 327,
      "importance": "should",
      "subtopic": "merge-bit",
      "difficulty": "Hard",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums",
          "out": "count"
        }
      ],
      "approaches": [
        {
          "name": "Optimal",
          "time": "O(n)",
          "space": "O(n)",
          "code": "// Pattern: merge-bit\n// Implement optimal C++ for LC 327"
        }
      ]
    },
    {
      "id": "sg-05",
      "title": "Reverse Pairs",
      "lc": 493,
      "importance": "should",
      "subtopic": "merge-bit",
      "difficulty": "Hard",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums",
          "out": "count"
        }
      ],
      "approaches": [
        {
          "name": "Optimal",
          "time": "O(n)",
          "space": "O(n)",
          "code": "// Pattern: merge-bit\n// Implement optimal C++ for LC 493"
        }
      ]
    },
    {
      "id": "sg-06",
      "title": "Falling Squares",
      "lc": 699,
      "importance": "nice",
      "subtopic": "segment",
      "difficulty": "Hard",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "positions",
          "out": "heights"
        }
      ],
      "approaches": [
        {
          "name": "Sweep + map heights",
          "time": "O(n log n)",
          "space": "O(n)",
          "code": "vector<int> fallingSquares(vector<vector<int>>& positions) {\n    map<int,int> height; height[0]=0; vector<int> ans; int cur=0;\n    for(auto& p: positions){\n        int l=p[0], r=p[0]+p[1];\n        int mx=0; auto it=height.lower_bound(l);\n        if(it!=height.begin()) mx=max(mx, prev(it)->second);\n        for(; it!=height.end() && it->first<r; it=height.erase(it)) mx=max(mx,it->second);\n        height[l]=height[r]=mx+p[1];\n        cur=max(cur,mx+p[1]); ans.push_back(cur);\n    } return ans;\n}"
        }
      ]
    },
    {
      "id": "sg-07",
      "title": "My Calendar III",
      "lc": 732,
      "importance": "nice",
      "subtopic": "segment",
      "difficulty": "Hard",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "bookings",
          "out": "max overlap"
        }
      ],
      "approaches": [
        {
          "name": "Segment tree max overlap",
          "time": "O(n log n)",
          "space": "O(n)",
          "code": "class MyCalendarThree {\n    map<int,int> diff;\n    void add(int s,int e){ diff[s]++; diff[e]--; }\npublic:\n    int book(int start,int end){\n        add(start,end); int cur=0, best=0;\n        for(auto& [_,d]: diff){ cur+=d; best=max(best,cur); }\n        return best;\n    }\n};"
        }
      ]
    },
    {
      "id": "sg-08",
      "title": "The Skyline Problem",
      "lc": 218,
      "importance": "should",
      "subtopic": "sweep",
      "difficulty": "Hard",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "buildings",
          "out": "skyline"
        }
      ],
      "approaches": [
        {
          "name": "Sweep line + multiset",
          "time": "O(n log n)",
          "space": "O(n)",
          "code": "vector<vector<int>> getSkyline(vector<vector<int>>& b) {\n    vector<pair<long long,int>> ev;\n    for(auto& x:b){ ev.push_back({x[0],-x[2]}); ev.push_back({x[1],x[2]}); }\n    sort(ev.begin(), ev.end());\n    multiset<int> hs={0}; map<int,int> cnt; vector<vector<int>> ans;\n    auto add=[&](int h){ if(++cnt[h]==1) hs.insert(h); };\n    auto rem=[&](int h){ if(--cnt[h]==0){ hs.erase(hs.find(h)); cnt.erase(h); } };\n    long long prev=0;\n    for(auto& e:ev){\n        if(e.second<0) add(-e.second); else rem(e.second);\n        long long cur=*hs.rbegin();\n        if(cur!=prev){ ans.push_back({(int)e.first,(int)cur}); prev=cur; }\n    } return ans;\n}"
        }
      ]
    },
    {
      "id": "sg-09",
      "title": "Range Module",
      "lc": 715,
      "importance": "nice",
      "subtopic": "segment",
      "difficulty": "Hard",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "track range",
          "out": "module"
        }
      ],
      "approaches": [
        {
          "name": "Ordered map ranges",
          "time": "O(n log n)",
          "space": "O(n)",
          "code": "class RangeModule {\n    map<int,int> ranges; // start -> end\npublic:\n    void addRange(int left,int right){\n        auto it=ranges.upper_bound(left);\n        if(it!=ranges.begin()){ auto prev=prev(it); if(prev->second>=left){ left=prev->first; right=max(right,prev->second); ranges.erase(prev); } }\n        while(it!=ranges.end() && it->first<=right){ right=max(right,it->second); it=ranges.erase(it); }\n        ranges[left]=right;\n    }\n    bool queryRange(int left,int right){\n        auto it=ranges.upper_bound(left); if(it==ranges.begin()) return false;\n        return prev(it)->second>=right;\n    }\n    void removeRange(int left,int right){\n        auto it=ranges.upper_bound(left);\n        if(it!=ranges.begin()){ auto prevIt=prev(it); if(prevIt->second>left){ if(prevIt->second>right) ranges[right]=prevIt->second; ranges[prevIt->first]=left; } }\n        while(it!=ranges.end() && it->first<right){ auto nxt=next(it); if(it->second>right) ranges[right]=it->second; it=ranges.erase(it); if(nxt==it) break; }\n    }\n};"
        }
      ]
    },
    {
      "id": "sg-10",
      "title": "Count Good Triplets in Array",
      "lc": 2179,
      "importance": "nice",
      "subtopic": "bit",
      "difficulty": "Hard",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums1,nums2",
          "out": "count"
        }
      ],
      "approaches": [
        {
          "name": "Map + BIT",
          "time": "O(n log n)",
          "space": "O(n)",
          "code": "long long goodTriplets(vector<int>& nums1, vector<int>& nums2) {\n    int n=nums1.size(); vector<int> pos(n+1), bit(n+2);\n    auto add=[&](int i){ for(++i;i<=n+1;i+=i&-i) bit[i]++; };\n    auto sum=[&](int i){ int s=0; for(++i;i>0;i-=i&-i) s+=bit[i]; return s; };\n    for(int i=0;i<n;i++) pos[nums2[i]]=i+1;\n    long long ans=0, left=0;\n    for(int x: nums1){\n        int p=pos[x];\n        long long less=sum(p-1), greater=left-less;\n        ans += less*(n-p-(left-less));\n        add(p); left++;\n    } return ans;\n}"
        }
      ]
    },
    {
      "id": "sg-11",
      "title": "Create Sorted Array through Instructions",
      "lc": 1649,
      "importance": "nice",
      "subtopic": "bit",
      "difficulty": "Hard",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "instructions",
          "out": "cost"
        }
      ],
      "approaches": [
        {
          "name": "BIT inversion cost",
          "time": "O(n log n)",
          "space": "O(n)",
          "code": "int createSortedArray(vector<int>& instructions) {\n    const int MOD=1e9+7; vector<int> bit(100002);\n    auto add=[&](int i,int v){ for(++i;i<(int)bit.size();i+=i&-i) bit[i]+=v; };\n    auto sum=[&](int i){ int s=0; for(++i;i>0;i-=i&-i) s+=bit[i]; return s; };\n    long long cost=0;\n    for(int x: instructions){\n        long long less=sum(x-1), greater=sum(100000)-sum(x);\n        cost=(cost+min(less,greater))%MOD; add(x,1);\n    } return (int)cost;\n}"
        }
      ]
    },
    {
      "id": "sg-12",
      "title": "Maximum Sum Queries",
      "lc": 2736,
      "importance": "nice",
      "subtopic": "segment",
      "difficulty": "Hard",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums1,nums2,queries",
          "out": "answers"
        }
      ],
      "approaches": [
        {
          "name": "Sort + multiset",
          "time": "O((n+q) log n)",
          "space": "O(n)",
          "code": "vector<int> maximumSumQueries(vector<int>& nums1, vector<int>& nums2, vector<vector<int>>& queries) {\n    int n=nums1.size(), m=queries.size();\n    vector<tuple<int,int,int,int>> qs(m);\n    for(int i=0;i<m;i++) qs[i]={queries[i][0],queries[i][1],i,0};\n    sort(qs.begin(), qs.end(), greater<>());\n    vector<pair<int,int>> pts(n);\n    for(int i=0;i<n;i++) pts[i]={nums1[i],nums2[i]};\n    sort(pts.begin(), pts.end(), greater<>());\n    multiset<int> best; vector<int> ans(m,-1); int j=0;\n    for(auto& [x,y,idx,_]: qs){\n        while(j<n && pts[j].first>=x){ best.insert(pts[j].first+pts[j].second); j++; }\n        auto it=best.lower_bound(y);\n        if(it!=best.end()) ans[idx]=*it;\n    } return ans;\n}"
        }
      ]
    },
    {
      "id": "sg-13",
      "title": "Longest Increasing Subsequence II",
      "lc": 2407,
      "importance": "nice",
      "subtopic": "segment",
      "difficulty": "Hard",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums,k",
          "out": "LIS len"
        }
      ],
      "approaches": [
        {
          "name": "Segment tree DP",
          "time": "O(n log V)",
          "space": "O(V)",
          "code": "int lengthOfLIS(vector<int>& nums, int k) {\n    int best=0; map<int,int> bit;\n    auto update=[&](int key,int val){\n        for(auto it=bit.lower_bound(key); it!=bit.end(); ++it){\n            if(it->second>=val) break;\n            it->second=val;\n        }\n        bit[key]=max(bit[key], val);\n        best=max(best,val);\n    };\n    for(int x: nums){\n        int cur=1;\n        auto it=bit.upper_bound(x-k);\n        if(it!=bit.begin()){ --it; cur=it->second+1; }\n        update(x,cur);\n    } return best;\n}"
        }
      ]
    },
    {
      "id": "sg-14",
      "title": "Number of Longest Increasing Subsequence",
      "lc": 673,
      "importance": "should",
      "subtopic": "bit",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums",
          "out": "count"
        }
      ],
      "approaches": [
        {
          "name": "Optimal",
          "time": "O(n)",
          "space": "O(n)",
          "code": "// Pattern: bit\n// Implement optimal C++ for LC 673"
        }
      ]
    },
    {
      "id": "sg-15",
      "title": "Range Maximum Query (classic)",
      "lc": null,
      "importance": "must",
      "subtopic": "segment",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "arr, queries",
          "out": "max"
        }
      ],
      "approaches": [
        {
          "name": "Optimal",
          "time": "O(n)",
          "space": "O(n)",
          "code": "// Pattern: segment\n// Implement optimal C++ for segment"
        }
      ]
    },
    {
      "id": "sg-16",
      "title": "Lazy Propagation Range Update",
      "lc": null,
      "importance": "should",
      "subtopic": "lazy",
      "difficulty": "Hard",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "arr, updates",
          "out": "queries"
        }
      ],
      "approaches": [
        {
          "name": "Optimal",
          "time": "O(n)",
          "space": "O(n)",
          "code": "// Pattern: lazy\n// Implement optimal C++ for lazy"
        }
      ]
    }
  ]
};
