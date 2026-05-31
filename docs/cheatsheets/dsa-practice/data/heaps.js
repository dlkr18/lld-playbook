window.PRACTICE_TOPIC = {
  "id": "heaps",
  "title": "Heaps & Priority Queues",
  "expected_count": 18,
  "strategy": "<strong>Speed-run:</strong> Top-K and two-heaps median — know when heap beats sort. Filter <em>Must do</em> first.",
  "subtopics": [
    {
      "id": "two-heaps",
      "label": "Two Heaps"
    },
    {
      "id": "top-k",
      "label": "Top K"
    },
    {
      "id": "scheduling",
      "label": "Scheduling"
    },
    {
      "id": "merge",
      "label": "K-Way Merge"
    }
  ],
  "questions": [
    {
      "id": "hp-01",
      "title": "Find Median from Data Stream",
      "lc": 295,
      "importance": "must",
      "subtopic": "two-heaps",
      "difficulty": "Hard",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "addNum/findMedian",
          "out": "median"
        }
      ],
      "approaches": [
        {
          "name": "Two heaps median",
          "time": "O(log n)",
          "space": "O(n)",
          "code": "class MedianFinder {\n    priority_queue<int> lo;\n    priority_queue<int, vector<int>, greater<int>> hi;\npublic:\n    void addNum(int num) {\n        lo.push(num); hi.push(lo.top()); lo.pop();\n        if (hi.size() > lo.size()) { lo.push(hi.top()); hi.pop(); }\n    }\n    double findMedian() {\n        return lo.size() > hi.size() ? lo.top() : (lo.top() + hi.top()) / 2.0;\n    }\n};"
        }
      ],
      "description": "Design structure supporting addNum and findMedian.",
      "summary": "Two heaps median — state invariant, then loop."
    },
    {
      "id": "hp-02",
      "title": "Top K Frequent Elements",
      "lc": 347,
      "importance": "must",
      "subtopic": "top-k",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums,k",
          "out": "top k"
        }
      ],
      "approaches": [
        {
          "name": "Bucket sort by freq",
          "time": "O(n)",
          "space": "O(n)",
          "code": "vector<int> topKFrequent(vector<int>& nums, int k) {\n    unordered_map<int,int> freq;\n    for (int x : nums) freq[x]++;\n    vector<vector<int>> buckets(nums.size()+1);\n    for (auto& p : freq) buckets[p.second].push_back(p.first);\n    vector<int> ans;\n    for (int i = (int)buckets.size()-1; i >= 0 && (int)ans.size() < k; i--)\n        for (int x : buckets[i]) { ans.push_back(x); if ((int)ans.size()==k) break; }\n    return ans;\n}"
        }
      ],
      "description": "Return k most frequent elements.",
      "summary": "Freq → bucket index; collect from highest freq buckets."
    },
    {
      "id": "hp-03",
      "title": "Kth Largest Element in Array",
      "lc": 215,
      "importance": "must",
      "subtopic": "top-k",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums,k",
          "out": "kth largest"
        }
      ],
      "approaches": [
        {
          "name": "Quickselect",
          "time": "O(n) avg",
          "space": "O(1)",
          "code": "int findKthLargest(vector<int>& nums, int k) {\n    int n = nums.size(), need = n-k;\n    int lo = 0, hi = n-1;\n    while (true) {\n        int p = lo + (hi-lo)/2, i = lo, j = hi;\n        swap(nums[p], nums[hi]);\n        int pivot = nums[hi], store = lo;\n        for (int t = lo; t < hi; t++) if (nums[t] < pivot) swap(nums[t], nums[store++]);\n        swap(nums[store], nums[hi]);\n        if (store == need) return nums[store];\n        if (store < need) lo = store+1; else hi = store-1;\n    }\n}"
        }
      ],
      "description": "Given input per constraints, solve: Kth Largest Element in Array.",
      "summary": "Quickselect — state invariant, then loop."
    },
    {
      "id": "hp-04",
      "title": "K Closest Points to Origin",
      "lc": 973,
      "importance": "should",
      "subtopic": "top-k",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "points,k",
          "out": "closest"
        }
      ],
      "approaches": [
        {
          "name": "K closest points",
          "time": "O(n log k)",
          "space": "O(k)",
          "code": "vector<vector<int>> kClosest(vector<vector<int>>& pts, int k) {\n    priority_queue<vector<int>> pq;\n    for (auto& p: pts) {\n        int d=p[0]*p[0]+p[1]*p[1];\n        pq.push({d,p[0],p[1]});\n        if ((int)pq.size()>k) pq.pop();\n    }\n    vector<vector<int>> ans;\n    while (!pq.empty()) { auto t=pq.top(); pq.pop(); ans.push_back({t[1],t[2]}); }\n    return ans;\n}"
        }
      ],
      "description": "Given input per constraints, solve: K Closest Points to Origin.",
      "summary": "K closest points — state invariant, then loop."
    },
    {
      "id": "hp-05",
      "title": "Merge k Sorted Lists",
      "lc": 23,
      "importance": "must",
      "subtopic": "merge",
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
      ],
      "description": "Merge k sorted linked lists into one sorted list.",
      "summary": "Merge k lists — state invariant, then loop."
    },
    {
      "id": "hp-06",
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
          "in": "tasks,n",
          "out": "min time"
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
      "description": "Minimum time to finish tasks with cooldown n between same task.",
      "summary": "Task scheduler — state invariant, then loop."
    },
    {
      "id": "hp-07",
      "title": "Meeting Rooms II",
      "lc": 253,
      "importance": "must",
      "subtopic": "scheduling",
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
      ],
      "description": "Minimum conference rooms required for all meetings.",
      "summary": "Meeting rooms II — state invariant, then loop."
    },
    {
      "id": "hp-08",
      "title": "Reorganize String",
      "lc": 767,
      "importance": "should",
      "subtopic": "scheduling",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "s",
          "out": "reorg"
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
      "description": "Rearrange string so no two adjacent chars are same, or return empty.",
      "summary": "Always place most frequent char; swap if same as last or fail."
    },
    {
      "id": "hp-09",
      "title": "Last Stone Weight",
      "lc": 1046,
      "importance": "nice",
      "subtopic": "heap",
      "difficulty": "Easy",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "stones",
          "out": "weight"
        }
      ],
      "approaches": [
        {
          "name": "Max heap simulation",
          "time": "O(n log n)",
          "space": "O(n)",
          "code": "int lastStoneWeight(vector<int>& stones) {\n    priority_queue<int> pq(stones.begin(), stones.end());\n    while(pq.size()>1){ int a=pq.top(); pq.pop(); int b=pq.top(); pq.pop(); if(a!=b) pq.push(a-b); }\n    return pq.empty()? 0: pq.top();\n}"
        }
      ],
      "description": "Given input per constraints, solve: Last Stone Weight.",
      "summary": "Max heap simulation — Priority queue for top-K, merging streams, or greedy scheduling."
    },
    {
      "id": "hp-10",
      "title": "Kth Smallest Element in Sorted Matrix",
      "lc": 378,
      "importance": "should",
      "subtopic": "top-k",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "matrix,k",
          "out": "value"
        }
      ],
      "approaches": [
        {
          "name": "Kth in matrix",
          "time": "O(k log n)",
          "space": "O(n)",
          "code": "int kthSmallest(vector<vector<int>>& m, int k) {\n    priority_queue<vector<int>, vector<vector<int>>, greater<>> pq;\n    for (int i=0;i<(int)m.size();i++) pq.push({m[i][0],i,0});\n    while (true) {\n        auto t=pq.top(); pq.pop();\n        if (--k==0) return t[0];\n        if (t[2]+1<(int)m[t[1]].size()) pq.push({m[t[1]][t[2]+1], t[1], t[2]+1});\n    }\n}"
        }
      ],
      "description": "Given input per constraints, solve: Kth Smallest Element in Sorted Matrix.",
      "summary": "Kth in matrix — state invariant, then loop."
    },
    {
      "id": "hp-11",
      "title": "Find K Pairs with Smallest Sums",
      "lc": 373,
      "importance": "nice",
      "subtopic": "merge",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums1,nums2,k",
          "out": "pairs"
        }
      ],
      "approaches": [
        {
          "name": "Merge sorted",
          "time": "O(n)",
          "space": "O(1)",
          "code": "ListNode dummy; ListNode* tail=&dummy;\nwhile (a&&b) { attach smaller; move tail; }"
        }
      ],
      "description": "Find K Pairs with Smallest Sums — return the required index, count, or boolean.",
      "summary": "Merge sorted — state invariant, then loop."
    },
    {
      "id": "hp-12",
      "title": "Smallest Range Covering K Lists",
      "lc": 632,
      "importance": "nice",
      "subtopic": "merge",
      "difficulty": "Hard",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "lists",
          "out": "range"
        }
      ],
      "approaches": [
        {
          "name": "Merge sorted",
          "time": "O(n)",
          "space": "O(1)",
          "code": "ListNode dummy; ListNode* tail=&dummy;\nwhile (a&&b) { attach smaller; move tail; }"
        }
      ],
      "description": "Given input per constraints, solve: Smallest Range Covering K Lists.",
      "summary": "Merge sorted — state invariant, then loop."
    },
    {
      "id": "hp-13",
      "title": "Design Twitter",
      "lc": 355,
      "importance": "nice",
      "subtopic": "design",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "follow/tweet/newsfeed",
          "out": "feed"
        }
      ],
      "approaches": [
        {
          "name": "Hash + heap per user",
          "time": "O(log n) per op",
          "space": "O(n)",
          "code": "class Twitter {\n    struct Tweet{ int time,id; };\n    int timer=0; unordered_map<int,vector<Tweet>> posts;\n    unordered_map<int,unordered_set<int>> follows;\npublic:\n    void postTweet(int userId,int tweetId){ posts[userId].push_back({timer++,tweetId}); }\n    vector<int> getNewsFeed(int userId){\n        priority_queue<pair<int,int>> pq;\n        follows[userId].insert(userId);\n        for(int uid:follows[userId]){\n            auto& v=posts[uid];\n            if(!v.empty()) pq.push({v.back().time, uid});\n        }\n        vector<int> ans;\n        while(!pq.empty() && (int)ans.size()<10){\n            auto [t,uid]=pq.top(); pq.pop();\n            ans.push_back(posts[uid].back().id);\n            posts[uid].pop_back();\n            if(!posts[uid].empty()) pq.push({posts[uid].back().time, uid});\n        } return ans;\n    }\n    void follow(int a,int b){ follows[a].insert(b); }\n    void unfollow(int a,int b){ follows[a].erase(b); }\n};"
        }
      ],
      "description": "Design Twitter — meet required time/space for each operation.",
      "summary": "Hash + heap per user — Class design with required operation complexities — map + structure."
    },
    {
      "id": "hp-14",
      "title": "Ugly Number II",
      "lc": 264,
      "importance": "should",
      "subtopic": "merge",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "n",
          "out": "nth ugly"
        }
      ],
      "approaches": [
        {
          "name": "Merge sorted",
          "time": "O(n)",
          "space": "O(1)",
          "code": "ListNode dummy; ListNode* tail=&dummy;\nwhile (a&&b) { attach smaller; move tail; }"
        }
      ],
      "description": "Given input per constraints, solve: Ugly Number II.",
      "summary": "Merge sorted — state invariant, then loop."
    },
    {
      "id": "hp-15",
      "title": "Super Ugly Number",
      "lc": 313,
      "importance": "nice",
      "subtopic": "merge",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "n, primes",
          "out": "number"
        }
      ],
      "approaches": [
        {
          "name": "Merge sorted",
          "time": "O(n)",
          "space": "O(1)",
          "code": "ListNode dummy; ListNode* tail=&dummy;\nwhile (a&&b) { attach smaller; move tail; }"
        }
      ],
      "description": "Given input per constraints, solve: Super Ugly Number.",
      "summary": "Merge sorted — state invariant, then loop."
    },
    {
      "id": "hp-16",
      "title": "IPO",
      "lc": 502,
      "importance": "nice",
      "subtopic": "scheduling",
      "difficulty": "Hard",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "k,w,...",
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
      "description": "Given input per constraints, solve: IPO.",
      "summary": "Heap greedy — Priority queue for top-K, merging streams, or greedy scheduling."
    },
    {
      "id": "hp-17",
      "title": "Minimum Cost to Hire K Workers",
      "lc": 857,
      "importance": "nice",
      "subtopic": "top-k",
      "difficulty": "Hard",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "quality,wage,k",
          "out": "min cost"
        }
      ],
      "approaches": [
        {
          "name": "Sort ratio + heap",
          "time": "O(n log n)",
          "space": "O(n)",
          "code": "double mincostToHireWorkers(vector<int>& quality, vector<int>& wage, int k) {\n    int n=quality.size(); vector<pair<double,int>> workers(n);\n    for(int i=0;i<n;i++) workers[i]={(double)wage[i]/quality[i], quality[i]};\n    sort(workers.begin(), workers.end());\n    priority_queue<int> pq; int sumQ=0; double ans=1e18;\n    for(auto& [ratio,q]: workers){\n        pq.push(q); sumQ+=q;\n        if((int)pq.size()>k){ sumQ-=pq.top(); pq.pop(); }\n        if((int)pq.size()==k) ans=min(ans, ratio*sumQ);\n    } return ans;\n}"
        }
      ],
      "description": "Compute the minimum cost to hire k workers over the given input per constraints.",
      "summary": "Sort ratio + heap — state invariant, then loop."
    },
    {
      "id": "hp-18",
      "title": "Sliding Window Median",
      "lc": 480,
      "importance": "nice",
      "subtopic": "two-heaps",
      "difficulty": "Hard",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums,k",
          "out": "medians"
        }
      ],
      "approaches": [
        {
          "name": "Two heaps window",
          "time": "O(n log k)",
          "space": "O(k)",
          "code": "vector<double> medianSlidingWindow(vector<int>& nums, int k) {\n    multiset<int> lo, hi;\n    auto rebalance=[&](){\n        while((int)lo.size()>(k+1)/2){ hi.insert(*lo.rbegin()); lo.erase(prev(lo.end())); }\n        while((int)lo.size()<(k+1)/2){ lo.insert(*hi.begin()); hi.erase(hi.begin()); }\n    };\n    vector<double> ans;\n    for(int i=0;i<(int)nums.size();i++){\n        if(i>=k){ int out=nums[i-k]; if(lo.count(out)) lo.erase(lo.find(out)); else hi.erase(hi.find(out)); }\n        if(lo.empty()||nums[i]<=*lo.rbegin()) lo.insert(nums[i]); else hi.insert(nums[i]);\n        rebalance();\n        if(i>=k-1) ans.push_back(k%2? *lo.rbegin() : ((long long)*lo.rbegin()+*hi.begin())/2.0);\n    } return ans;\n}"
        }
      ],
      "description": "Given input per constraints, solve: Sliding Window Median.",
      "summary": "Two heaps window — state invariant, then loop."
    }
  ]
};
