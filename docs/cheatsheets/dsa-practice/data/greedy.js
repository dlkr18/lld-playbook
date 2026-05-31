window.PRACTICE_TOPIC = {
  "id": "greedy",
  "title": "Greedy",
  "expected_count": 24,
  "strategy": "<strong>Speed-run:</strong> Prove greedy choice + optimal substructure — intervals and jumps first. Filter <em>Must do</em> first.",
  "subtopics": [
    {
      "id": "intervals",
      "label": "Intervals"
    },
    {
      "id": "jump",
      "label": "Jump Game"
    },
    {
      "id": "scheduling",
      "label": "Scheduling"
    },
    {
      "id": "scan",
      "label": "Linear Scan"
    },
    {
      "id": "heap",
      "label": "+ Heap"
    },
    {
      "id": "sort",
      "label": "Sort"
    }
  ],
  "questions": [
    {
      "id": "gr-01",
      "title": "Jump Game",
      "lc": 55,
      "importance": "must",
      "subtopic": "jump",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums",
          "out": "can reach end?"
        }
      ],
      "approaches": [
        {
          "name": "Greedy farthest",
          "time": "O(n)",
          "space": "O(1)",
          "code": "bool canJump(vector<int>& nums) {\n    int far = 0;\n    for (int i = 0; i < (int)nums.size(); i++) {\n        if (i > far) return false;\n        far = max(far, i + nums[i]);\n    } return true;\n}"
        }
      ]
    },
    {
      "id": "gr-02",
      "title": "Jump Game II",
      "lc": 45,
      "importance": "must",
      "subtopic": "jump",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums",
          "out": "min jumps"
        }
      ],
      "approaches": [
        {
          "name": "Jump game II",
          "time": "O(n)",
          "space": "O(1)",
          "code": "int jump(vector<int>& nums) {\n    int jumps=0, curEnd=0, farthest=0;\n    for (int i=0;i<(int)nums.size()-1;i++) {\n        farthest=max(farthest, i+nums[i]);\n        if (i==curEnd) { jumps++; curEnd=farthest; }\n    } return jumps;\n}"
        }
      ]
    },
    {
      "id": "gr-03",
      "title": "Gas Station",
      "lc": 134,
      "importance": "must",
      "subtopic": "circular",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "gas, cost",
          "out": "start index"
        }
      ],
      "approaches": [
        {
          "name": "Gas station",
          "time": "O(n)",
          "space": "O(1)",
          "code": "int canCompleteCircuit(vector<int>& gas, vector<int>& cost) {\n    int total=0, tank=0, start=0;\n    for (int i=0;i<(int)gas.size();i++) {\n        total += gas[i]-cost[i]; tank += gas[i]-cost[i];\n        if (tank < 0) { start=i+1; tank=0; }\n    } return total>=0? start: -1;\n}"
        }
      ]
    },
    {
      "id": "gr-04",
      "title": "Hand of Straights",
      "lc": 846,
      "importance": "nice",
      "subtopic": "scheduling",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "hand, groupSize",
          "out": "true/false"
        }
      ],
      "approaches": [
        {
          "name": "Sort + greedy groups",
          "time": "O(n log n)",
          "space": "O(n)",
          "code": "bool isNStraightHand(vector<int>& hand, int gs) {\n    if(hand.size()%gs) return false;\n    map<int,int> cnt; for(int x:hand) cnt[x]++;\n    while(!cnt.empty()){\n        int start=cnt.begin()->first;\n        for(int k=0;k<gs;k++){\n            if(!cnt.count(start+k)) return false;\n            if(--cnt[start+k]==0) cnt.erase(start+k);\n        }\n    } return true;\n}"
        }
      ]
    },
    {
      "id": "gr-05",
      "title": "Merge Triplets to Form Target",
      "lc": 1899,
      "importance": "nice",
      "subtopic": "intervals",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "triplets, target",
          "out": "possible?"
        }
      ],
      "approaches": [
        {
          "name": "Greedy triplet cover",
          "time": "O(n)",
          "space": "O(1)",
          "code": "bool mergeTriplets(vector<vector<int>>& t, vector<int>& target) {\n    bool a=false,b=false,c=false;\n    for(auto& x:t){\n        if(x[0]<=target[0]&&x[1]<=target[1]&&x[2]<=target[2]){\n            if(x[0]==target[0]) a=true;\n            if(x[1]==target[1]) b=true;\n            if(x[2]==target[2]) c=true;\n        }\n    } return a&&b&&c;\n}"
        }
      ]
    },
    {
      "id": "gr-06",
      "title": "Partition Labels",
      "lc": 763,
      "importance": "must",
      "subtopic": "intervals",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "s",
          "out": "partition sizes"
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
      "id": "gr-07",
      "title": "Valid Parenthesis String",
      "lc": 678,
      "importance": "should",
      "subtopic": "greedy",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "s with *",
          "out": "valid?"
        }
      ],
      "approaches": [
        {
          "name": "Optimal",
          "time": "O(n)",
          "space": "O(n)",
          "code": "// Pattern: greedy\n// Implement optimal C++ for LC 678"
        }
      ]
    },
    {
      "id": "gr-08",
      "title": "Candy",
      "lc": 135,
      "importance": "should",
      "subtopic": "scan",
      "difficulty": "Hard",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "ratings",
          "out": "min candies"
        }
      ],
      "approaches": [
        {
          "name": "Optimal",
          "time": "O(n)",
          "space": "O(n)",
          "code": "// Pattern: scan\n// Implement optimal C++ for LC 135"
        }
      ]
    },
    {
      "id": "gr-09",
      "title": "Queue Reconstruction by Height",
      "lc": 406,
      "importance": "should",
      "subtopic": "sort",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "people",
          "out": "reconstructed"
        }
      ],
      "approaches": [
        {
          "name": "Optimal",
          "time": "O(n)",
          "space": "O(n)",
          "code": "// Pattern: sort\n// Implement optimal C++ for LC 406"
        }
      ]
    },
    {
      "id": "gr-10",
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
          "in": "tasks, n",
          "out": "min intervals"
        }
      ],
      "approaches": [
        {
          "name": "Task scheduler",
          "time": "O(n)",
          "space": "O(1)",
          "code": "int leastInterval(vector<char>& tasks, int n) {\n    int cnt[26]={}; for (char c: tasks) cnt[c-'A']++;\n    int mx=*max_element(cnt,cnt+26), same=0;\n    for (int x: cnt) if (x==mx) same++;\n    return max((int)tasks.size(), (mx-1)*(n+1)+same);\n}"
        }
      ]
    },
    {
      "id": "gr-11",
      "title": "Minimum Number of Arrows",
      "lc": 452,
      "importance": "should",
      "subtopic": "intervals",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "balloons",
          "out": "arrows"
        }
      ],
      "approaches": [
        {
          "name": "Optimal",
          "time": "O(n)",
          "space": "O(n)",
          "code": "// Pattern: intervals\n// Implement optimal C++ for LC 452"
        }
      ]
    },
    {
      "id": "gr-12",
      "title": "Non-overlapping Intervals",
      "lc": 435,
      "importance": "must",
      "subtopic": "intervals",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "intervals",
          "out": "min removals"
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
      "id": "gr-13",
      "title": "Largest Number",
      "lc": 179,
      "importance": "should",
      "subtopic": "sort",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums",
          "out": "largest concat"
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
      "id": "gr-14",
      "title": "Assign Cookies",
      "lc": 455,
      "importance": "nice",
      "subtopic": "two-ptr",
      "difficulty": "Easy",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "g, s",
          "out": "max content"
        }
      ],
      "approaches": [
        {
          "name": "Sort + two pointers",
          "time": "O(n log n)",
          "space": "O(1)",
          "code": "int findContentChildren(vector<int>& g, vector<int>& s) {\n    sort(g.begin(),g.end()); sort(s.begin(),s.end());\n    int i=0,j=0,ans=0;\n    while(i<(int)g.size()&&j<(int)s.size()){\n        if(s[j]>=g[i]){ ans++; i++; } j++;\n    } return ans;\n}"
        }
      ]
    },
    {
      "id": "gr-15",
      "title": "Boats to Save People",
      "lc": 881,
      "importance": "should",
      "subtopic": "two-ptr",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "people, limit",
          "out": "boats"
        }
      ],
      "approaches": [
        {
          "name": "Optimal",
          "time": "O(n)",
          "space": "O(n)",
          "code": "// Pattern: two-ptr\n// Implement optimal C++ for LC 881"
        }
      ]
    },
    {
      "id": "gr-16",
      "title": "Minimum Add to Make Parentheses Valid",
      "lc": 921,
      "importance": "should",
      "subtopic": "scan",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "s",
          "out": "additions"
        }
      ],
      "approaches": [
        {
          "name": "Optimal",
          "time": "O(n)",
          "space": "O(n)",
          "code": "// Pattern: scan\n// Implement optimal C++ for LC 921"
        }
      ]
    },
    {
      "id": "gr-17",
      "title": "Remove K Digits",
      "lc": 402,
      "importance": "should",
      "subtopic": "monotonic",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "num, k",
          "out": "smallest"
        }
      ],
      "approaches": [
        {
          "name": "Monotonic stack",
          "time": "O(n)",
          "space": "O(n)",
          "code": "stack<int> st;\nfor (int i=0;i<n;i++) {\n  while (!st.empty() && cond(st.top(), i)) st.pop();\n  st.push(i);\n}"
        }
      ]
    },
    {
      "id": "gr-18",
      "title": "Monotone Increasing Digits",
      "lc": 738,
      "importance": "nice",
      "subtopic": "greedy",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "n",
          "out": "largest monotone"
        }
      ],
      "approaches": [
        {
          "name": "Greedy digits",
          "time": "O(log n)",
          "space": "O(log n)",
          "code": "int monotoneIncreasingDigits(int n) {\n    string s=to_string(n);\n    int mark=s.size();\n    for(int i=(int)s.size()-1;i>0;i--)\n        if(s[i]<s[i-1]){ s[i-1]--; mark=i; }\n    for(int i=mark;i<(int)s.size();i++) s[i]='9';\n    return stoi(s);\n}"
        }
      ]
    },
    {
      "id": "gr-19",
      "title": "Max Increase to Keep City Skyline",
      "lc": 807,
      "importance": "nice",
      "subtopic": "grid",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "grid",
          "out": "sum increases"
        }
      ],
      "approaches": [
        {
          "name": "Row/col max",
          "time": "O(mn)",
          "space": "O(m+n)",
          "code": "int maxIncreaseKeepingSkyline(vector<vector<int>>& g) {\n    int m=g.size(), n=g[0].size();\n    vector<int> row(m), col(n);\n    for(int i=0;i<m;i++) row[i]=*max_element(g[i].begin(),g[i].end());\n    for(int j=0;j<n;j++){ int mx=0; for(int i=0;i<m;i++) mx=max(mx,g[i][j]); col[j]=mx; }\n    int ans=0;\n    for(int i=0;i<m;i++) for(int j=0;j<n;j++) ans += min(row[i],col[j])-g[i][j];\n    return ans;\n}"
        }
      ]
    },
    {
      "id": "gr-20",
      "title": "Bag of Tokens",
      "lc": 948,
      "importance": "nice",
      "subtopic": "two-ptr",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "tokens, power",
          "out": "max score"
        }
      ],
      "approaches": [
        {
          "name": "Two pointers + sort",
          "time": "O(n log n)",
          "space": "O(1)",
          "code": "int bagOfTokensScore(vector<int>& tokens, int power) {\n    sort(tokens.begin(), tokens.end());\n    int l=0, r=(int)tokens.size()-1, score=0, ans=0;\n    while(l<=r){\n        if(power>=tokens[l]){ power-=tokens[l++]; ans=max(ans, ++score); }\n        else if(score>0 && l<r){ power+=tokens[r--]; score--; }\n        else break;\n    } return ans;\n}"
        }
      ]
    },
    {
      "id": "gr-21",
      "title": "Minimum Number of Refueling Stops",
      "lc": 871,
      "importance": "nice",
      "subtopic": "heap",
      "difficulty": "Hard",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "target, startFuel, stations",
          "out": "stops"
        }
      ],
      "approaches": [
        {
          "name": "DP + heap",
          "time": "O(n log n)",
          "space": "O(n)",
          "code": "int minRefuelStops(int target, int startFuel, vector<vector<int>>& stations) {\n    priority_queue<int> pq; stations.push_back({target,0});\n    int i=0, fuel=startFuel, stops=0;\n    while(fuel<target){\n        while(i<(int)stations.size() && stations[i][0]<=fuel) pq.push(stations[i++][1]);\n        if(pq.empty()) return -1;\n        fuel+=pq.top(); pq.pop(); stops++;\n    } return stops;\n}"
        }
      ]
    },
    {
      "id": "gr-22",
      "title": "Candy Crush",
      "lc": 723,
      "importance": "nice",
      "subtopic": "simulation",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "board",
          "out": "crushed"
        }
      ],
      "approaches": [
        {
          "name": "Simulation",
          "time": "O((mn)^2)",
          "space": "O(mn)",
          "code": "vector<vector<int>> candyCrush(vector<vector<int>>& b) {\n    int m=b.size(), n=b[0].size(); bool crushed=true;\n    while(crushed){\n        crushed=false;\n        for(int i=0;i<m;i++) for(int j=0;j<n-2;j++)\n            if(b[i][j]&&abs(b[i][j])==abs(b[i][j+1])&&abs(b[i][j])==abs(b[i][j+2]))\n                b[i][j]=b[i][j+1]=b[i][j+2]=-abs(b[i][j]);\n        for(int j=0;j<n;j++) for(int i=0;i<m-2;i++)\n            if(b[i][j]&&abs(b[i][j])==abs(b[i+1][j])&&abs(b[i][j])==abs(b[i+2][j])\n                b[i][j]=b[i+1][j]=b[i+2][j]=-abs(b[i][j]);\n        for(int j=0;j<n;j++){\n            int write=m-1;\n            for(int i=m-1;i>=0;i--) if(b[i][j]>0) b[write--][j]=b[i][j];\n            while(write>=0) b[write--][j]=0;\n        }\n        for(int i=0;i<m;i++) for(int j=0;j<n;j++) if(b[i][j]<0){ b[i][j]=0; crushed=true; }\n    } return b;\n}"
        }
      ]
    },
    {
      "id": "gr-23",
      "title": "IPO",
      "lc": 502,
      "importance": "nice",
      "subtopic": "heap",
      "difficulty": "Hard",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "k, w, profits, capital",
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
      ]
    },
    {
      "id": "gr-24",
      "title": "Reorganize String",
      "lc": 767,
      "importance": "should",
      "subtopic": "heap",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "s",
          "out": "reorganized"
        }
      ],
      "approaches": [
        {
          "name": "Optimal",
          "time": "O(n)",
          "space": "O(n)",
          "code": "// Pattern: heap\n// Implement optimal C++ for LC 767"
        }
      ]
    }
  ]
};
