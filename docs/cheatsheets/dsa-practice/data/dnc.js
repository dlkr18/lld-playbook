window.PRACTICE_TOPIC = {
  "id": "dnc",
  "title": "Divide & Conquer",
  "expected_count": 18,
  "strategy": "<strong>Speed-run:</strong> Merge sort side effects (inversions); binary search on answer. Filter <em>Must do</em> first.",
  "subtopics": [
    {
      "id": "divide",
      "label": "D&C"
    },
    {
      "id": "merge-sort",
      "label": "Merge Sort"
    },
    {
      "id": "quickselect",
      "label": "Quick Select"
    },
    {
      "id": "binary-divide",
      "label": "Binary D&C"
    }
  ],
  "questions": [
    {
      "id": "dc-01",
      "title": "Pow(x, n)",
      "lc": 50,
      "importance": "must",
      "subtopic": "divide",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "x,n",
          "out": "power"
        }
      ],
      "approaches": [
        {
          "name": "Fast pow",
          "time": "O(log n)",
          "space": "O(1)",
          "code": "double myPow(double x, int n) {\n    long long N = n; if (N < 0) { x = 1/x; N = -N; }\n    double ans = 1, cur = x;\n    while (N) { if (N&1) ans *= cur; cur *= cur; N >>= 1; }\n    return ans;\n}"
        }
      ]
    },
    {
      "id": "dc-02",
      "title": "Maximum Subarray",
      "lc": 53,
      "importance": "must",
      "subtopic": "divide",
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
      "id": "dc-03",
      "title": "Sort List",
      "lc": 148,
      "importance": "should",
      "subtopic": "merge-sort",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "head",
          "out": "sorted"
        }
      ],
      "approaches": [
        {
          "name": "Merge sort list",
          "time": "O(n log n)",
          "space": "O(log n)",
          "code": "ListNode* sortList(ListNode* head) {\n    if (!head || !head->next) return head;\n    ListNode *slow=head, *fast=head, *prev=nullptr;\n    while (fast && fast->next) { prev=slow; slow=slow->next; fast=fast->next->next; }\n    prev->next=nullptr;\n    ListNode* a=sortList(head); ListNode* b=sortList(slow);\n    ListNode dummy, *tail=&dummy;\n    while (a&&b) { if (a->val<=b->val){tail->next=a;a=a->next;} else {tail->next=b;b=b->next;} tail=tail->next; }\n    tail->next=a?a:b; return dummy.next;\n}"
        }
      ]
    },
    {
      "id": "dc-04",
      "title": "Count of Smaller After Self",
      "lc": 315,
      "importance": "must",
      "subtopic": "merge-sort",
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
      "id": "dc-05",
      "title": "Reverse Pairs",
      "lc": 493,
      "importance": "should",
      "subtopic": "merge-sort",
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
          "code": "// Pattern: merge-sort\n// Implement optimal C++ for LC 493"
        }
      ]
    },
    {
      "id": "dc-06",
      "title": "Count of Range Sum",
      "lc": 327,
      "importance": "should",
      "subtopic": "merge-sort",
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
          "code": "// Pattern: merge-sort\n// Implement optimal C++ for LC 327"
        }
      ]
    },
    {
      "id": "dc-07",
      "title": "Median of Two Sorted Arrays",
      "lc": 4,
      "importance": "must",
      "subtopic": "binary-divide",
      "difficulty": "Hard",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums1,nums2",
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
      "id": "dc-08",
      "title": "Search a 2D Matrix II",
      "lc": 240,
      "importance": "should",
      "subtopic": "divide",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "matrix,target",
          "out": "found?"
        }
      ],
      "approaches": [
        {
          "name": "Optimal",
          "time": "O(n)",
          "space": "O(n)",
          "code": "// Pattern: divide\n// Implement optimal C++ for LC 240"
        }
      ]
    },
    {
      "id": "dc-09",
      "title": "Different Ways to Add Parentheses",
      "lc": 241,
      "importance": "nice",
      "subtopic": "divide",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "expression",
          "out": "results"
        }
      ],
      "approaches": [
        {
          "name": "Recursion + memo",
          "time": "O(4^n)",
          "space": "O(n)",
          "code": "vector<int> diffWaysToCompute(string exp) {\n    vector<int> ans;\n    for(int i=0;i<(int)exp.size();i++){\n        if(exp[i]=='+'||exp[i]=='-'||exp[i]=='*'){\n            auto L=diffWaysToCompute(exp.substr(0,i));\n            auto R=diffWaysToCompute(exp.substr(i+1));\n            for(int a:L) for(int b:R){\n                if(exp[i]=='+') ans.push_back(a+b);\n                else if(exp[i]=='-') ans.push_back(a-b);\n                else ans.push_back(a*b);\n            }\n        }\n    }\n    if(ans.empty()) ans.push_back(stoi(exp));\n    return ans;\n}"
        }
      ]
    },
    {
      "id": "dc-10",
      "title": "The Skyline Problem",
      "lc": 218,
      "importance": "nice",
      "subtopic": "divide",
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
      "id": "dc-11",
      "title": "Construct Quad Tree",
      "lc": 427,
      "importance": "nice",
      "subtopic": "divide",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "grid",
          "out": "tree"
        }
      ],
      "approaches": [
        {
          "name": "Quadtree divide",
          "time": "O(n)",
          "space": "O(log n)",
          "code": "class Node{ public: bool val; bool isLeaf; Node* topLeft,*topRight,*bottomLeft,*bottomRight;\n    Node(bool v,bool leaf):val(v),isLeaf(leaf),topLeft(nullptr),topRight(nullptr),bottomLeft(nullptr),bottomRight(nullptr){}\n    Node(){}\n};\nNode* build(vector<vector<int>>& g,int x,int y,int len){\n    if(len==1) return new Node(g[x][y],true);\n    int h=len/2;\n    auto tl=build(g,x,y,h), tr=build(g,x,y+h,h), bl=build(g,x+h,y,h), br=build(g,x+h,y+h,h);\n    if(tl->isLeaf&&tr->isLeaf&&bl->isLeaf&&br->isLeaf && tl->val==tr->val&&tr->val==bl->val&&bl->val==br->val)\n        return new Node(tl->val,true);\n    Node* root=new Node(false,false);\n    root->topLeft=tl; root->topRight=tr; root->bottomLeft=bl; root->bottomRight=br;\n    return root;\n}\nNode* construct(vector<vector<int>>& grid){ if(grid.empty()) return nullptr; return build(grid,0,0,grid.size()); }"
        }
      ]
    },
    {
      "id": "dc-12",
      "title": "Merge k Sorted Lists",
      "lc": 23,
      "importance": "should",
      "subtopic": "divide",
      "difficulty": "Hard",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "lists",
          "out": "merged"
        }
      ],
      "approaches": [
        {
          "name": "Merge k lists",
          "time": "O(N log k)",
          "space": "O(k)",
          "code": "ListNode* mergeKLists(vector<ListNode*>& lists) {\n    auto cmp = [](ListNode* a, ListNode* b){ return a->val > b->val; };\n    priority_queue<ListNode*, vector<ListNode*>, decltype(cmp)> pq(cmp);\n    for (auto h: lists) if (h) pq.push(h);\n    ListNode dummy, *tail=&dummy;\n    while (!pq.empty()) { auto u=pq.top(); pq.pop(); tail->next=u; tail=u; if (u->next) pq.push(u->next); }\n    return dummy.next;\n}"
        }
      ]
    },
    {
      "id": "dc-13",
      "title": "Kth Largest in Array",
      "lc": 215,
      "importance": "should",
      "subtopic": "quickselect",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums,k",
          "out": "kth"
        }
      ],
      "approaches": [
        {
          "name": "Quickselect",
          "time": "O(n) avg",
          "space": "O(1)",
          "code": "int findKthLargest(vector<int>& nums, int k) {\n    int n = nums.size(), need = n-k;\n    int lo = 0, hi = n-1;\n    while (true) {\n        int p = lo + (hi-lo)/2, i = lo, j = hi;\n        swap(nums[p], nums[hi]);\n        int pivot = nums[hi], store = lo;\n        for (int t = lo; t < hi; t++) if (nums[t] < pivot) swap(nums[t], nums[store++]);\n        swap(nums[store], nums[hi]);\n        if (store == need) return nums[store];\n        if (store < need) lo = store+1; else hi = store-1;\n    }\n}"
        }
      ]
    },
    {
      "id": "dc-14",
      "title": "Majority Element",
      "lc": 169,
      "importance": "should",
      "subtopic": "divide",
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
      "id": "dc-15",
      "title": "Majority Element II",
      "lc": 229,
      "importance": "nice",
      "subtopic": "divide",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums",
          "out": "elements"
        }
      ],
      "approaches": [
        {
          "name": "Boyer-Moore general",
          "time": "O(n)",
          "space": "O(1)",
          "code": "vector<int> majorityElement(vector<int>& nums) {\n    int c1=0,c2=0,v1=0,v2=0;\n    for(int x:nums){\n        if(x==v1) c1++; else if(x==v2) c2++;\n        else if(!c1){ v1=x; c1=1; }\n        else if(!c2){ v2=x; c2=1; }\n        else { c1--; c2--; }\n    }\n    c1=c2=0; for(int x:nums){ if(x==v1) c1++; else if(x==v2) c2++; }\n    vector<int> ans; int n=nums.size();\n    if(c1>n/3) ans.push_back(v1); if(c2>n/3) ans.push_back(v2);\n    return ans;\n}"
        }
      ]
    },
    {
      "id": "dc-16",
      "title": "Beautiful Array",
      "lc": 932,
      "importance": "nice",
      "subtopic": "divide",
      "difficulty": "Medium",
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
          "name": "Divide construct",
          "time": "O(n)",
          "space": "O(n)",
          "code": "vector<int> beautifulArray(int n) {\n    vector<int> ans={1};\n    while((int)ans.size()<n){\n        vector<int> nxt;\n        for(int x:ans){ if(2*x-1<=n) nxt.push_back(2*x-1); }\n        for(int x:ans){ if(2*x<=n) nxt.push_back(2*x); }\n        ans.swap(nxt);\n    } return ans;\n}"
        }
      ]
    },
    {
      "id": "dc-17",
      "title": "Predict the Winner",
      "lc": 486,
      "importance": "nice",
      "subtopic": "divide",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums",
          "out": "predict?"
        }
      ],
      "approaches": [
        {
          "name": "Minimax DP",
          "time": "O(n^2)",
          "space": "O(n)",
          "code": "bool PredictTheWinner(vector<int>& nums) {\n    int n=nums.size(); vector<vector<int>> dp(n, vector<int>(n));\n    for(int i=0;i<n;i++) dp[i][i]=nums[i];\n    for(int len=2; len<=n; len++)\n        for(int l=0; l+len-1<n; l++){\n            int r=l+len-1;\n            dp[l][r]=max(nums[l]-dp[l+1][r], nums[r]-dp[l][r-1]);\n        }\n    return dp[0][n-1]>=0;\n}"
        }
      ]
    },
    {
      "id": "dc-18",
      "title": "Burst Balloons",
      "lc": 312,
      "importance": "should",
      "subtopic": "divide",
      "difficulty": "Hard",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums",
          "out": "max coins"
        }
      ],
      "approaches": [
        {
          "name": "Optimal",
          "time": "O(n)",
          "space": "O(n)",
          "code": "// Pattern: divide\n// Implement optimal C++ for LC 312"
        }
      ]
    }
  ]
};
