window.PRACTICE_TOPIC = {
  "id": "intervals",
  "title": "Intervals",
  "expected_count": 20,
  "strategy": "<strong>Speed-run:</strong> Sort by start/end then merge or sweep — meeting rooms is the template. Filter <em>Must do</em> first.",
  "subtopics": [
    {
      "id": "merge",
      "label": "Merge"
    },
    {
      "id": "greedy",
      "label": "Greedy"
    },
    {
      "id": "heap",
      "label": "Heap"
    },
    {
      "id": "design",
      "label": "Design"
    },
    {
      "id": "sweep",
      "label": "Sweep Line"
    }
  ],
  "questions": [
    {
      "id": "iv-01",
      "title": "Merge Intervals",
      "lc": 56,
      "importance": "must",
      "subtopic": "merge",
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
      "id": "iv-02",
      "title": "Insert Interval",
      "lc": 57,
      "importance": "must",
      "subtopic": "merge",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "intervals,new",
          "out": "result"
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
      "id": "iv-03",
      "title": "Non-overlapping Intervals",
      "lc": 435,
      "importance": "must",
      "subtopic": "greedy",
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
      "id": "iv-04",
      "title": "Meeting Rooms",
      "lc": 252,
      "importance": "must",
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
      "id": "iv-05",
      "title": "Meeting Rooms II",
      "lc": 253,
      "importance": "must",
      "subtopic": "heap",
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
      "id": "iv-06",
      "title": "Minimum Interval to Include Each Query",
      "lc": 1851,
      "importance": "nice",
      "subtopic": "sort",
      "difficulty": "Hard",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "intervals,queries",
          "out": "answers"
        }
      ],
      "approaches": [
        {
          "name": "Sort + check query",
          "time": "O(n log n + q log n)",
          "space": "O(n)",
          "code": "vector<int> minInterval(vector<vector<int>>& iv, vector<int>& queries) {\n    sort(iv.begin(), iv.end());\n    vector<pair<int,int>> qs; for(int i=0;i<(int)queries.size();i++) qs.push_back({queries[i],i});\n    sort(qs.begin(), qs.end());\n    priority_queue<pair<int,int>, vector<pair<int,int>>, greater<>> pq;\n    vector<int> ans(queries.size(), -1); int j=0;\n    for(auto& [q,idx]: qs){\n        while(j<(int)iv.size() && iv[j][0]<=q) pq.push({iv[j][1]-iv[j][0]+1, iv[j][1]});\n        while(!pq.empty() && pq.top().second<q) pq.pop();\n        if(!pq.empty()) ans[idx]=pq.top().first;\n    } return ans;\n}"
        }
      ]
    },
    {
      "id": "iv-07",
      "title": "Employee Free Time",
      "lc": 759,
      "importance": "should",
      "subtopic": "merge",
      "difficulty": "Hard",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "schedules",
          "out": "free slots"
        }
      ],
      "approaches": [
        {
          "name": "Merge sorted",
          "time": "O(n)",
          "space": "O(1)",
          "code": "ListNode dummy; ListNode* tail=&dummy;\nwhile (a&&b) { attach smaller; move tail; }"
        }
      ]
    },
    {
      "id": "iv-08",
      "title": "Interval List Intersections",
      "lc": 986,
      "importance": "should",
      "subtopic": "two-ptr",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "A,B",
          "out": "intersections"
        }
      ],
      "approaches": [
        {
          "name": "Two pointers merge",
          "time": "O(n+m)",
          "space": "O(1)",
          "code": "vector<vector<int>> intervalIntersection(vector<vector<int>>& a, vector<vector<int>>& b) {\n    vector<vector<int>> ans; int i = 0, j = 0;\n    while (i < (int)a.size() && j < (int)b.size()) {\n        int lo = max(a[i][0], b[j][0]), hi = min(a[i][1], b[j][1]);\n        if (lo <= hi) ans.push_back({lo, hi});\n        if (a[i][1] < b[j][1]) i++; else j++;\n    }\n    return ans;\n}"
        }
      ]
    },
    {
      "id": "iv-09",
      "title": "My Calendar I",
      "lc": 729,
      "importance": "should",
      "subtopic": "design",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "bookings",
          "out": "true/false"
        }
      ],
      "approaches": [
        {
          "name": "Sorted list overlap",
          "time": "O(n^2)",
          "space": "O(n)",
          "code": "class MyCalendar {\n    vector<pair<int,int>> ev;\npublic:\n    bool book(int start, int end) {\n        for (auto& p : ev) if (max(p.first, start) < min(p.second, end)) return false;\n        ev.push_back({start, end}); return true;\n    }\n};"
        }
      ]
    },
    {
      "id": "iv-10",
      "title": "My Calendar II",
      "lc": 731,
      "importance": "nice",
      "subtopic": "design",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "bookings",
          "out": "true/false"
        }
      ],
      "approaches": [
        {
          "name": "Map overlap counts",
          "time": "O(n log n)",
          "space": "O(n)",
          "code": "class MyCalendarTwo {\n    map<int,int> timeline;\n    void add(int s,int e){ timeline[s]++; timeline[e]--; }\npublic:\n    bool book(int start,int end){\n        add(start,end);\n        int cur=0;\n        for(auto& [t,d]: timeline){\n            cur+=d;\n            if(cur>=3){ add(start,end); timeline[start]--; timeline[end]++; return false; }\n        } return true;\n    }\n};"
        }
      ]
    },
    {
      "id": "iv-11",
      "title": "My Calendar III",
      "lc": 732,
      "importance": "nice",
      "subtopic": "sweep",
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
      "id": "iv-12",
      "title": "Remove Covered Intervals",
      "lc": 1288,
      "importance": "nice",
      "subtopic": "sort",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "intervals",
          "out": "count"
        }
      ],
      "approaches": [
        {
          "name": "Sort by end",
          "time": "O(n log n)",
          "space": "O(1)",
          "code": "int removeCoveredIntervals(vector<vector<int>>& iv) {\n    sort(iv.begin(), iv.end(), [](auto& a, auto& b){ return a[0]==b[0]? a[1]>b[1]: a[0]<b[0]; });\n    int ans=0, end=-1;\n    for(auto& x: iv) if(x[1]>end){ ans++; end=x[1]; }\n    return ans;\n}"
        }
      ]
    },
    {
      "id": "iv-13",
      "title": "Data Stream as Disjoint Intervals",
      "lc": 352,
      "importance": "nice",
      "subtopic": "design",
      "difficulty": "Hard",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "values",
          "out": "intervals"
        }
      ],
      "approaches": [
        {
          "name": "Ordered set intervals",
          "time": "O(n log n)",
          "space": "O(n)",
          "code": "class SummaryRanges {\n    set<int> vals;\npublic:\n    void addNum(int value){ vals.insert(value); }\n    vector<vector<int>> getIntervals(){\n        vector<vector<int>> ans; if(vals.empty()) return ans;\n        int start=*vals.begin(), prev=start;\n        for(int x: vals){\n            if(x>prev+1){ ans.push_back({start,prev}); start=x; }\n            prev=x;\n        } ans.push_back({start,prev}); return ans;\n    }\n};"
        }
      ]
    },
    {
      "id": "iv-14",
      "title": "Partition Labels",
      "lc": 763,
      "importance": "should",
      "subtopic": "greedy",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "s",
          "out": "sizes"
        }
      ],
      "approaches": [
        {
          "name": "Partition labels",
          "time": "O(n)",
          "space": "O(1)",
          "code": "vector<int> partitionLabels(string s) {\n    int last[26]; for (int i=0;i<(int)s.size();i++) last[s[i]-'a']=i;\n    vector<int> ans; int start=0, end=0;\n    for (int i=0;i<(int)s.size();i++) {\n        end=max(end, last[s[i]-'a']);\n        if (i==end) { ans.push_back(end-start+1); start=i+1; }\n    } return ans;\n}"
        }
      ]
    },
    {
      "id": "iv-15",
      "title": "Set Intersection Size At Least Two",
      "lc": 757,
      "importance": "nice",
      "subtopic": "greedy",
      "difficulty": "Hard",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "intervals",
          "out": "set size"
        }
      ],
      "approaches": [
        {
          "name": "Greedy cover",
          "time": "O(n log n)",
          "space": "O(1)",
          "code": "int intersectionSizeTwo(vector<vector<int>>& intervals) {\n    sort(intervals.begin(), intervals.end(), [](auto& a, auto& b){\n        return a[1]==b[1]? a[0]>b[0]: a[1]<b[1];\n    });\n    int ans=0, a=-1, b=-1;\n    for(auto& iv: intervals){\n        if(iv[0]>a && iv[0]>b){ a=iv[1]-1; b=iv[1]; ans+=2; }\n        else if(iv[0]>a){ a=b; b=iv[1]; ans++; }\n    } return ans;\n}"
        }
      ]
    },
    {
      "id": "iv-16",
      "title": "Maximum Number of Events",
      "lc": 1353,
      "importance": "should",
      "subtopic": "greedy",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "events",
          "out": "max attended"
        }
      ],
      "approaches": [
        {
          "name": "Sort + heap",
          "time": "O(n log n)",
          "space": "O(n)",
          "code": "int maxEvents(vector<vector<int>>& events) {\n    sort(events.begin(), events.end());\n    priority_queue<int, vector<int>, greater<int>> pq;\n    int i = 0, n = events.size(), day = 0, ans = 0;\n    while (i < n || !pq.empty()) {\n        if (pq.empty()) day = events[i][0];\n        while (i < n && events[i][0] <= day) pq.push(events[i][1]), i++;\n        pq.pop(); ans++;\n        while (!pq.empty() && pq.top() < day) pq.pop();\n        day++;\n    }\n    return ans;\n}"
        }
      ]
    },
    {
      "id": "iv-17",
      "title": "Car Pooling",
      "lc": 1094,
      "importance": "should",
      "subtopic": "sweep",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "trips,capacity",
          "out": "possible?"
        }
      ],
      "approaches": [
        {
          "name": "Diff array",
          "time": "O(n)",
          "space": "O(n)",
          "code": "bool carPooling(vector<vector<int>>& trips, int capacity) {\n    vector<int> diff(1001, 0);\n    for (auto& t : trips) { diff[t[1]] += t[0]; diff[t[2]] -= t[0]; }\n    int cur = 0;\n    for (int i = 0; i <= 1000; i++) { cur += diff[i]; if (cur > capacity) return false; }\n    return true;\n}"
        }
      ]
    },
    {
      "id": "iv-18",
      "title": "Minimum Number of Arrows",
      "lc": 452,
      "importance": "should",
      "subtopic": "greedy",
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
          "name": "Greedy arrows",
          "time": "O(n log n)",
          "space": "O(1)",
          "code": "int findMinArrowShots(vector<vector<int>>& points) {\n    sort(points.begin(), points.end(), [](auto& a, auto& b){ return a[1] < b[1]; });\n    int ans = 0; long end = LLONG_MIN;\n    for (auto& p : points) {\n        if (p[0] > end) { ans++; end = p[1]; }\n    }\n    return ans;\n}"
        }
      ]
    },
    {
      "id": "iv-19",
      "title": "Teemo Attacking",
      "lc": 495,
      "importance": "nice",
      "subtopic": "merge",
      "difficulty": "Easy",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "timeSeries,duration",
          "out": "total poison"
        }
      ],
      "approaches": [
        {
          "name": "Merge sorted",
          "time": "O(n)",
          "space": "O(1)",
          "code": "ListNode dummy; ListNode* tail=&dummy;\nwhile (a&&b) { attach smaller; move tail; }"
        }
      ]
    },
    {
      "id": "iv-20",
      "title": "Add Bold Tag in String",
      "lc": 616,
      "importance": "nice",
      "subtopic": "intervals",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "s, dict",
          "out": "bold string"
        }
      ],
      "approaches": [
        {
          "name": "Interval merge bold",
          "time": "O(n*m)",
          "space": "O(n)",
          "code": "string addBoldTag(string s, vector<string>& dict) {\n    vector<bool> bold(s.size());\n    for(auto& w: dict) for(size_t i=s.find(w); i!=string::npos; i=s.find(w,i+1))\n        fill(bold.begin()+i, bold.begin()+i+w.size(), true);\n    string ans; bool open=false;\n    for(int i=0;i<(int)s.size();i++){\n        if(bold[i]&&!open){ ans+=\"<b>\"; open=true; }\n        if(!bold[i]&&open){ ans+=\"</b>\"; open=false; }\n        ans+=s[i];\n    } if(open) ans+=\"</b>\"; return ans;\n}"
        }
      ]
    }
  ]
};
