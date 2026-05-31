window.PRACTICE_TOPIC = {
  "id": "sorting",
  "title": "Sorting & Selection",
  "expected_count": 20,
  "strategy": "<strong>Speed-run:</strong> Quickselect for Kth; merge sort for inversions; Dutch flag for 3-way. Filter <em>Must do</em> first.",
  "subtopics": [
    {
      "id": "merge-sort",
      "label": "Merge Sort"
    },
    {
      "id": "quick-select",
      "label": "Quick Select"
    },
    {
      "id": "dutch-flag",
      "label": "Dutch Flag"
    },
    {
      "id": "custom-sort",
      "label": "Custom Sort"
    },
    {
      "id": "counting",
      "label": "Counting Sort"
    },
    {
      "id": "sort",
      "label": "Sort Apps"
    }
  ],
  "questions": [
    {
      "id": "so-01",
      "title": "Sort an Array",
      "lc": 912,
      "importance": "must",
      "subtopic": "merge-sort",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums",
          "out": "sorted"
        }
      ],
      "approaches": [
        {
          "name": "Merge sort",
          "time": "O(n log n)",
          "space": "O(n)",
          "code": "void ms(vector<int>& a, int l, int r, vector<int>& tmp) {\n    if (l>=r) return; int mid=l+(r-l)/2; ms(a,l,mid,tmp); ms(a,mid+1,r,tmp);\n    int i=l,j=mid+1,k=l; while(i<=mid&&j<=r) tmp[k++]= a[i]<=a[j]? a[i++]: a[j++];\n    while(i<=mid) tmp[k++]=a[i++]; while(j<=r) tmp[k++]=a[j++];\n    for (int t=l;t<=r;t++) a[t]=tmp[t];\n}\nvector<int> sortArray(vector<int>& nums) { vector<int> tmp(nums.size()); ms(nums,0,(int)nums.size()-1,tmp); return nums; }"
        }
      ]
    },
    {
      "id": "so-02",
      "title": "Kth Largest Element",
      "lc": 215,
      "importance": "must",
      "subtopic": "quick-select",
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
      "id": "so-03",
      "title": "Sort Colors",
      "lc": 75,
      "importance": "must",
      "subtopic": "dutch-flag",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums",
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
      ]
    },
    {
      "id": "so-04",
      "title": "Merge Intervals",
      "lc": 56,
      "importance": "should",
      "subtopic": "sort",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "intervals",
          "out": "merged"
        }
      ],
      "approaches": [
        {
          "name": "Sort + merge",
          "time": "O(n log n)",
          "space": "O(n)",
          "code": "vector<vector<int>> merge(vector<vector<int>>& intervals) {\n    sort(intervals.begin(), intervals.end());\n    vector<vector<int>> ans;\n    for (auto& iv : intervals) {\n        if (ans.empty() || ans.back()[1] < iv[0]) ans.push_back(iv);\n        else ans.back()[1] = max(ans.back()[1], iv[1]);\n    } return ans;\n}"
        }
      ]
    },
    {
      "id": "so-05",
      "title": "Count of Smaller Numbers After Self",
      "lc": 315,
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
      "id": "so-06",
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
      "id": "so-07",
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
      "id": "so-08",
      "title": "Largest Number",
      "lc": 179,
      "importance": "should",
      "subtopic": "custom-sort",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums",
          "out": "string"
        }
      ],
      "approaches": [
        {
          "name": "Largest number",
          "time": "O(n log n)",
          "space": "O(n)",
          "code": "string largestNumber(vector<int>& nums) {\n    vector<string> s; for (int x: nums) s.push_back(to_string(x));\n    sort(s.begin(), s.end(), [](string& a, string& b){ return a+b > b+a; });\n    if (s[0]==\"0\") return \"0\";\n    string ans; for (auto& x: s) ans+=x; return ans;\n}"
        }
      ]
    },
    {
      "id": "so-09",
      "title": "H-Index",
      "lc": 274,
      "importance": "nice",
      "subtopic": "counting",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "citations",
          "out": "h-index"
        }
      ],
      "approaches": [
        {
          "name": "Counting buckets",
          "time": "O(n)",
          "space": "O(n)",
          "code": "int hIndex(vector<int>& citations) {\n    int n=citations.size(); vector<int> cnt(n+1);\n    for(int c: citations) cnt[min(c,n)]++;\n    int sum=0;\n    for(int h=n;h>=0;h--){ sum+=cnt[h]; if(sum>=h) return h; }\n    return 0;\n}"
        }
      ]
    },
    {
      "id": "so-10",
      "title": "Wiggle Sort II",
      "lc": 324,
      "importance": "nice",
      "subtopic": "partition",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums",
          "out": "wiggle"
        }
      ],
      "approaches": [
        {
          "name": "Virtual indexing",
          "time": "O(n)",
          "space": "O(1)",
          "code": "void wiggleSort(vector<int>& nums) {\n    int n=nums.size(); auto at=[&](int i){ return nums[(1+2*i)%(n|1)]; };\n    for(int i=0;i<n;i++){\n        int target=i;\n        for(int j=i;j<n;j++) if(at(j)>at(target)) target=j;\n        swap(nums[(1+2*i)%(n|1)], nums[(1+2*target)%(n|1)]);\n    }\n}"
        }
      ]
    },
    {
      "id": "so-11",
      "title": "Maximum Gap",
      "lc": 164,
      "importance": "nice",
      "subtopic": "bucket",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums",
          "out": "max gap"
        }
      ],
      "approaches": [
        {
          "name": "Bucket sort radix",
          "time": "O(n)",
          "space": "O(n)",
          "code": "int maximumGap(vector<int>& nums) {\n    if(nums.size()<2) return 0;\n    int mn=*min_element(nums.begin(), nums.end()), mx=*max_element(nums.begin(), nums.end());\n    int bucketSize=max(1,(mx-mn)/((int)nums.size()-1));\n    int bucketCount=(mx-mn)/bucketSize+1;\n    vector<pair<int,int>> buckets(bucketCount,{INT_MAX,INT_MIN});\n    for(int x: nums){\n        int idx=(x-mn)/bucketSize;\n        buckets[idx].first=min(buckets[idx].first,x);\n        buckets[idx].second=max(buckets[idx].second,x);\n    }\n    int ans=0, prev=buckets[0].second;\n    for(int i=1;i<bucketCount;i++){\n        if(buckets[i].first==INT_MAX) continue;\n        ans=max(ans, buckets[i].first-prev);\n        prev=buckets[i].second;\n    } return ans;\n}"
        }
      ]
    },
    {
      "id": "so-12",
      "title": "Meeting Rooms",
      "lc": 252,
      "importance": "should",
      "subtopic": "sort",
      "difficulty": "Easy",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "intervals",
          "out": "can attend?"
        }
      ],
      "approaches": [
        {
          "name": "Meeting rooms I",
          "time": "O(n log n)",
          "space": "O(1)",
          "code": "bool canAttendMeetings(vector<vector<int>>& iv) {\n    sort(iv.begin(), iv.end());\n    for (int i=1;i<(int)iv.size();i++) if (iv[i][0]<iv[i-1][1]) return false;\n    return true;\n}"
        }
      ]
    },
    {
      "id": "so-13",
      "title": "Meeting Rooms II",
      "lc": 253,
      "importance": "should",
      "subtopic": "sort",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "intervals",
          "out": "rooms"
        }
      ],
      "approaches": [
        {
          "name": "Meeting rooms II",
          "time": "O(n log n)",
          "space": "O(n)",
          "code": "int minMeetingRooms(vector<vector<int>>& iv) {\n    vector<int> start, end;\n    for (auto& x: iv) { start.push_back(x[0]); end.push_back(x[1]); }\n    sort(start.begin(), start.end()); sort(end.begin(), end.end());\n    int rooms=0, e=0;\n    for (int s: start) { if (s < end[e]) rooms++; else e++; }\n    return rooms;\n}"
        }
      ]
    },
    {
      "id": "so-14",
      "title": "Non-overlapping Intervals",
      "lc": 435,
      "importance": "should",
      "subtopic": "sort",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "intervals",
          "out": "removals"
        }
      ],
      "approaches": [
        {
          "name": "Non-overlapping",
          "time": "O(n log n)",
          "space": "O(1)",
          "code": "int eraseOverlapIntervals(vector<vector<int>>& iv) {\n    sort(iv.begin(), iv.end(), [](auto& a, auto& b){ return a[1]<b[1]; });\n    int end=INT_MIN, removed=0;\n    for (auto& x: iv) if (x[0] < end) removed++; else end=x[1];\n    return removed;\n}"
        }
      ]
    },
    {
      "id": "so-15",
      "title": "Insert Interval",
      "lc": 57,
      "importance": "should",
      "subtopic": "sort",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "intervals,new",
          "out": "merged"
        }
      ],
      "approaches": [
        {
          "name": "Insert interval",
          "time": "O(n)",
          "space": "O(n)",
          "code": "vector<vector<int>> insert(vector<vector<int>>& iv, vector<int>& nw) {\n    vector<vector<int>> ans; int i=0, n=iv.size();\n    while (i<n && iv[i][1]<nw[0]) ans.push_back(iv[i++]);\n    while (i<n && iv[i][0]<=nw[1]) { nw[0]=min(nw[0],iv[i][0]); nw[1]=max(nw[1],iv[i][1]); i++; }\n    ans.push_back(nw);\n    while (i<n) ans.push_back(iv[i++]); return ans;\n}"
        }
      ]
    },
    {
      "id": "so-16",
      "title": "Relative Sort Array",
      "lc": 1122,
      "importance": "nice",
      "subtopic": "counting",
      "difficulty": "Easy",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "arr1,arr2",
          "out": "relative sort"
        }
      ],
      "approaches": [
        {
          "name": "Counting relative sort",
          "time": "O(n+m)",
          "space": "O(m)",
          "code": "vector<int> relativeSortArray(vector<int>& arr1, vector<int>& arr2) {\n    map<int,int> order; for(int i=0;i<(int)arr2.size();i++) order[arr2[i]]=i;\n    vector<int> cnt(1001), extra;\n    for(int x: arr1) if(order.count(x)) cnt[x]++; else extra.push_back(x);\n    sort(extra.begin(), extra.end());\n    vector<int> ans; int ei=0;\n    for(int x: arr2) while(cnt[x]--) ans.push_back(x);\n    for(int x: extra) ans.push_back(x);\n    return ans;\n}"
        }
      ]
    },
    {
      "id": "so-17",
      "title": "Sort Characters By Frequency",
      "lc": 451,
      "importance": "should",
      "subtopic": "bucket",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "s",
          "out": "sorted string"
        }
      ],
      "approaches": [
        {
          "name": "Optimal",
          "time": "O(n)",
          "space": "O(n)",
          "code": "// Pattern: bucket\n// Implement optimal C++ for LC 451"
        }
      ]
    },
    {
      "id": "so-18",
      "title": "Custom Sort String",
      "lc": 791,
      "importance": "nice",
      "subtopic": "counting",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "order,str",
          "out": "permutation"
        }
      ],
      "approaches": [
        {
          "name": "Order map",
          "time": "O(n)",
          "space": "O(1)",
          "code": "string customSortString(string order, string s) {\n    int rank[26]={}; for(int i=0;i<(int)order.size();i++) rank[order[i]-'a']=i+1;\n    sort(s.begin(), s.end(), [&](char a,char b){ return rank[a-'a']<rank[b-'a']; });\n    return s;\n}"
        }
      ]
    },
    {
      "id": "so-19",
      "title": "Minimum Number of Arrows",
      "lc": 452,
      "importance": "should",
      "subtopic": "sort",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "points",
          "out": "arrows"
        }
      ],
      "approaches": [
        {
          "name": "Optimal",
          "time": "O(n)",
          "space": "O(n)",
          "code": "// Pattern: sort\n// Implement optimal C++ for LC 452"
        }
      ]
    },
    {
      "id": "so-20",
      "title": "Valid Triangle Number",
      "lc": 611,
      "importance": "nice",
      "subtopic": "sort",
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
          "name": "Sort + two pointers",
          "time": "O(n^2)",
          "space": "O(1)",
          "code": "int triangleNumber(vector<int>& nums) {\n    sort(nums.begin(), nums.end()); int ans=0;\n    for(int i=0;i<(int)nums.size();i++){\n        int l=0, r=i-1;\n        while(l<r) if(nums[l]+nums[r]>nums[i]){ ans+=r-l; l++; } else r--;\n    } return ans;\n}"
        }
      ]
    }
  ]
};
