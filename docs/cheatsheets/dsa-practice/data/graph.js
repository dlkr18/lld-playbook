window.PRACTICE_TOPIC = {
  "id": "graph",
  "title": "Graph",
  "expected_count": 45,
  "strategy": "<strong>Speed-run priority:</strong> BFS/DFS &rarr; Topo sort &rarr; Shortest path &rarr; Union-Find &rarr; MST &amp; advanced DFS. Those four cores cover ~80% of graph interviews. <ul><li>~10 min per question max</li><li>Blank after 3 min? peek pattern tag only, then recode</li><li>Filter <em>Must do</em> first (20 questions)</li></ul>",
  "subtopics": [
    {
      "id": "bfs-dfs",
      "label": "BFS / DFS"
    },
    {
      "id": "topo",
      "label": "Topo Sort"
    },
    {
      "id": "shortest-path",
      "label": "Shortest Path"
    },
    {
      "id": "union-find",
      "label": "Union-Find"
    },
    {
      "id": "mst",
      "label": "MST"
    },
    {
      "id": "dfs-advanced",
      "label": "Advanced DFS"
    }
  ],
  "questions": [
    {
      "id": "graph-001",
      "title": "Number of Islands",
      "lc": 200,
      "importance": "must",
      "subtopic": "bfs-dfs",
      "difficulty": "Medium",
      "constraints": [
        "m == grid.length",
        "n == grid[i].length",
        "grid[i][j] is '0' or '1'"
      ],
      "examples": [
        {
          "in": "grid = [[\"1\",\"1\",\"0\"],[\"0\",\"1\",\"0\"],[\"1\",\"0\",\"0\"]]",
          "out": "1"
        }
      ],
      "approaches": [
        {
          "name": "BFS flood fill",
          "time": "O(mn)",
          "space": "O(mn)",
          "code": "int numIslands(vector<vector<char>>& grid) {\n    int m = grid.size(), n = grid[0].size(), ans = 0;\n    int dr[4] = {1,-1,0,0}, dc[4] = {0,0,1,-1};\n    for (int i = 0; i < m; i++) for (int j = 0; j < n; j++) {\n        if (grid[i][j] != '1') continue;\n        ans++;\n        queue<pair<int,int>> qu;\n        qu.push({i,j}); grid[i][j] = '0';\n        while (!qu.empty()) {\n            auto p = qu.front(); qu.pop();\n            for (int k = 0; k < 4; k++) {\n                int r = p.first + dr[k], c = p.second + dc[k];\n                if (r>=0 && r<m && c>=0 && c<n && grid[r][c]=='1') {\n                    grid[r][c] = '0'; qu.push({r,c});\n                }\n            }\n        }\n    }\n    return ans;\n}"
        },
        {
          "name": "DFS flood fill",
          "time": "O(mn)",
          "space": "O(mn) stack/recursion",
          "code": "int dfs(vector<vector<char>>& g, int r, int c) {\n    if (r<0||c<0||r>=(int)g.size()||c>=(int)g[0].size()||g[r][c]!='1') return 0;\n    g[r][c] = '0';\n    return 1 + dfs(g,r+1,c)+dfs(g,r-1,c)+dfs(g,r,c+1)+dfs(g,r,c-1);\n}\nint numIslands(vector<vector<char>>& grid) {\n    int ans = 0;\n    for (int i = 0; i < (int)grid.size(); i++)\n        for (int j = 0; j < (int)grid[0].size(); j++)\n            if (grid[i][j]=='1') ans += dfs(grid,i,j)>0;\n    return ans;\n}"
        }
      ],
      "description": "Given a 2D grid of '0' and '1', count the number of islands (4-connected components of '1').",
      "summary": "Unvisited land? BFS/DFS sink entire component, count++."
    },
    {
      "id": "graph-002",
      "title": "Max Area of Island",
      "lc": 695,
      "importance": "must",
      "subtopic": "bfs-dfs",
      "difficulty": "Medium",
      "constraints": [
        "m, n <= 50",
        "grid[i][j] is 0 or 1"
      ],
      "examples": [
        {
          "in": "grid = [[0,0,1,0],[0,1,1,0],[0,1,0,0]]",
          "out": "4"
        }
      ],
      "approaches": [
        {
          "name": "BFS with area count",
          "time": "O(mn)",
          "space": "O(mn)",
          "code": "int maxAreaOfIsland(vector<vector<int>>& grid) {\n    int m=grid.size(), n=grid[0].size(), best=0, dr[4]={1,-1,0,0}, dc[4]={0,0,1,-1};\n    for (int i=0;i<m;i++) for (int j=0;j<n;j++) if (grid[i][j]) {\n        int area=0; queue<pair<int,int>> qu; qu.push({i,j}); grid[i][j]=0;\n        while(!qu.empty()){ auto p=qu.front(); qu.pop(); area++;\n            for(int k=0;k<4;k++){ int r=p.first+dr[k], c=p.second+dc[k];\n                if(r>=0&&r<m&&c>=0&&c<n&&grid[r][c]){ grid[r][c]=0; qu.push({r,c}); } }\n        } best=max(best,area);\n    } return best;\n}"
        }
      ],
      "description": "Given input per constraints, solve: Max Area of Island.",
      "summary": "BFS with area count — Graph/grid traversal: mark visited, queue or stack, process neighbors."
    },
    {
      "id": "graph-003",
      "title": "Flood Fill",
      "lc": 733,
      "importance": "should",
      "subtopic": "bfs-dfs",
      "difficulty": "Easy",
      "constraints": [
        "m, n <= 50",
        "0 <= sr < m",
        "0 <= sc < n"
      ],
      "examples": [
        {
          "in": "image=[[1,1,1],[1,1,0],[1,0,1]], sr=1, sc=1, color=2",
          "out": "[[2,2,2],[2,2,0],[2,0,1]]"
        }
      ],
      "approaches": [
        {
          "name": "DFS/BFS from seed",
          "time": "O(mn)",
          "space": "O(mn)",
          "code": "vector<vector<int>> floodFill(vector<vector<int>>& img, int sr, int sc, int color) {\n    int m=img.size(), n=img[0].size(), old=img[sr][sc];\n    if (old==color) return img;\n    function<void(int,int)> dfs = [&](int r,int c){\n        if(r<0||c<0||r>=m||c>=n||img[r][c]!=old) return;\n        img[r][c]=color; dfs(r+1,c); dfs(r-1,c); dfs(r,c+1); dfs(r,c-1);\n    };\n    dfs(sr,sc); return img;\n}"
        }
      ],
      "description": "Given input per constraints, solve: Flood Fill.",
      "summary": "DFS/BFS from seed — Graph/grid traversal: mark visited, queue or stack, process neighbors."
    },
    {
      "id": "graph-004",
      "title": "Rotting Oranges",
      "lc": 994,
      "importance": "must",
      "subtopic": "bfs-dfs",
      "difficulty": "Medium",
      "constraints": [
        "2 <= m, n <= 10",
        "grid[i][j] in {0,1,2}"
      ],
      "examples": [
        {
          "in": "grid=[[2,1,1],[1,1,0],[0,1,1]]",
          "out": "4"
        }
      ],
      "approaches": [
        {
          "name": "Multi-source BFS",
          "time": "O(mn)",
          "space": "O(mn)",
          "code": "int orangesRotting(vector<vector<int>>& grid) {\n    int m=grid.size(), n=grid[0].size(), fresh=0, ans=0;\n    queue<pair<int,int>> q;\n    for(int i=0;i<m;i++) for(int j=0;j<n;j++)\n        if(grid[i][j]==2) q.push({i,j}); else if(grid[i][j]==1) fresh++;\n    int dr[4]={1,-1,0,0}, dc[4]={0,0,1,-1};\n    while(!q.empty() && fresh){ int sz=q.size(); ans++;\n        while(sz--){ auto p=q.front(); q.pop();\n            for(int k=0;k<4;k++){ int r=p.first+dr[k], c=p.second+dc[k];\n                if(r>=0&&r<m&&c>=0&&c<n&&grid[r][c]==1){ grid[r][c]=2; fresh--; q.push({r,c}); }\n            }\n        }\n    } return fresh? -1: ans;\n}"
        }
      ],
      "description": "Minutes until no fresh orange remains; 4-direction spread from rotten.",
      "summary": "Multi-source BFS — Graph/grid traversal: mark visited, queue or stack, process neighbors."
    },
    {
      "id": "graph-005",
      "title": "01 Matrix",
      "lc": 542,
      "importance": "must",
      "subtopic": "bfs-dfs",
      "difficulty": "Medium",
      "constraints": [
        "m, n <= 10^4",
        "at least one 0 in mat"
      ],
      "examples": [
        {
          "in": "mat=[[0,0,0],[1,1,0],[1,1,0]]",
          "out": "[[0,0,0],[1,1,0],[2,2,1]]"
        }
      ],
      "approaches": [
        {
          "name": "Multi-source BFS from zeros",
          "time": "O(mn)",
          "space": "O(mn)",
          "code": "vector<vector<int>> updateMatrix(vector<vector<int>>& mat) {\n    int m=mat.size(), n=mat[0].size(); const int INF=1e9;\n    queue<pair<int,int>> q;\n    for(int i=0;i<m;i++) for(int j=0;j<n;j++)\n        if(mat[i][j]==0) q.push({i,j}); else mat[i][j]=INF;\n    int dr[4]={1,-1,0,0}, dc[4]={0,0,1,-1};\n    while(!q.empty()){ auto p=q.front(); q.pop();\n        for(int k=0;k<4;k++){ int r=p.first+dr[k], c=p.second+dc[k];\n            if(r>=0&&r<m&&c>=0&&c<n && mat[r][c]>mat[p.first][p.second]+1){\n                mat[r][c]=mat[p.first][p.second]+1; q.push({r,c});\n            }\n        }\n    } return mat;\n}"
        }
      ],
      "description": "Given input per constraints, solve: 01 Matrix.",
      "summary": "Multi-source BFS from zeros — Graph/grid traversal: mark visited, queue or stack, process neighbors."
    },
    {
      "id": "graph-006",
      "title": "Shortest Path in Binary Matrix",
      "lc": 1091,
      "importance": "must",
      "subtopic": "bfs-dfs",
      "difficulty": "Medium",
      "constraints": [
        "n == grid.length",
        "grid[0][0] == 0",
        "8-directional moves"
      ],
      "examples": [
        {
          "in": "grid=[[0,1],[1,0]]",
          "out": "2"
        }
      ],
      "approaches": [
        {
          "name": "BFS 8-neighbors",
          "time": "O(n^2)",
          "space": "O(n^2)",
          "code": "int shortestPathBinaryMatrix(vector<vector<int>>& grid) {\n    int n=grid.size(); if(!grid[0][0]||!grid[n-1][n-1]) return -1;\n    if(n==1) return 1;\n    queue<pair<int,int>> q; q.push({0,0}); grid[0][0]=1; int steps=1;\n    int dr[8]={-1,-1,-1,0,0,1,1,1}, dc[8]={-1,0,1,-1,1,-1,0,1};\n    while(!q.empty()){ int sz=q.size(); steps++;\n        while(sz--){ auto p=q.front(); q.pop();\n            for(int k=0;k<8;k++){ int r=p.first+dr[k], c=p.second+dc[k];\n                if(r>=0&&r<n&&c>=0&&c<n&&grid[r][c]==0){\n                    if(r==n-1&&c==n-1) return steps;\n                    grid[r][c]=1; q.push({r,c});\n                }\n            }\n        }\n    } return -1;\n}"
        }
      ],
      "description": "Compute the shortest path in binary matrix over the given input per constraints.",
      "summary": "BFS 8-neighbors — Graph/grid traversal: mark visited, queue or stack, process neighbors."
    },
    {
      "id": "graph-007",
      "title": "Word Ladder",
      "lc": 127,
      "importance": "must",
      "subtopic": "bfs-dfs",
      "difficulty": "Hard",
      "constraints": [
        "1 <= wordList.length <= 5000",
        "all words same length"
      ],
      "examples": [
        {
          "in": "beginWord=\"hit\", endWord=\"cog\", wordList=[\"hot\",\"dot\",\"dog\",\"lot\",\"log\",\"cog\"]",
          "out": "5",
          "note": "hit -> hot -> dot -> dog -> cog"
        }
      ],
      "approaches": [
        {
          "name": "BFS on implicit graph",
          "time": "O(N * L^2)",
          "space": "O(N)",
          "code": "int ladderLength(string begin, string end, vector<string>& words) {\n    unordered_set<string> dict(words.begin(), words.end());\n    if(!dict.count(end)) return 0;\n    queue<string> q; q.push(begin); int steps=1;\n    while(!q.empty()){ int sz=q.size(); steps++;\n        while(sz--){ string w=q.front(); q.pop();\n            for(int i=0;i<(int)w.size();i++){\n                char orig=w[i];\n                for(char c='a';c<='z';c++){ w[i]=c;\n                    if(w==end) return steps;\n                    if(dict.count(w)){ dict.erase(w); q.push(w); }\n                } w[i]=orig;\n            }\n        }\n    } return 0;\n}"
        }
      ],
      "description": "Given input per constraints, solve: Word Ladder.",
      "summary": "Queue states; mark visited; expand neighbors level by level."
    },
    {
      "id": "graph-008",
      "title": "Open the Lock",
      "lc": 752,
      "importance": "should",
      "subtopic": "bfs-dfs",
      "difficulty": "Medium",
      "constraints": [
        "deadends.length <= 500",
        "4-wheel lock, 0000 start"
      ],
      "examples": [
        {
          "in": "deadends=[\"0201\",\"0101\"], target=\"0202\"",
          "out": "6"
        }
      ],
      "approaches": [
        {
          "name": "BFS on state space",
          "time": "O(10^4)",
          "space": "O(10^4)",
          "code": "int openLock(vector<string>& dead, string target) {\n    unordered_set<string> bad(dead.begin(), dead.end());\n    if(bad.count(\"0000\")) return -1;\n    queue<string> q; q.push(\"0000\"); unordered_set<string> seen={\"0000\"}; int steps=0;\n    while(!q.empty()){ int sz=q.size();\n        while(sz--){ string s=q.front(); q.pop();\n            if(s==target) return steps;\n            for(int i=0;i<4;i++) for(int d:-1,1) if(d) {\n                string t=s; t[i]=((t[i]-'0'+d+10)%10)+'0';\n                if(!seen.count(t) && !bad.count(t)){ seen.insert(t); q.push(t); }\n            }\n        } steps++;\n    } return -1;\n}"
        }
      ],
      "description": "Given input per constraints, solve: Open the Lock.",
      "summary": "BFS on state space — Graph/grid traversal: mark visited, queue or stack, process neighbors."
    },
    {
      "id": "graph-009",
      "title": "Pacific Atlantic Water Flow",
      "lc": 417,
      "importance": "must",
      "subtopic": "bfs-dfs",
      "difficulty": "Medium",
      "constraints": [
        "m, n <= 200",
        "heights[i][j] >= 0"
      ],
      "examples": [
        {
          "in": "heights=[[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]",
          "out": "[[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]"
        }
      ],
      "approaches": [
        {
          "name": "DFS/BFS from both oceans",
          "time": "O(mn)",
          "space": "O(mn)",
          "code": "void dfs(vector<vector<int>>& h, vector<vector<int>>& vis, int r, int c, int prev) {\n    int m=h.size(), n=h[0].size();\n    if(r<0||c<0||r>=m||c>=n||vis[r][c]||h[r][c]<prev) return;\n    vis[r][c]=1;\n    dfs(h,vis,r+1,c,h[r][c]); dfs(h,vis,r-1,c,h[r][c]);\n    dfs(h,vis,r,c+1,h[r][c]); dfs(h,vis,r,c-1,h[r][c]);\n}\nvector<vector<int>> pacificAtlantic(vector<vector<int>>& heights) {\n    int m=heights.size(), n=heights[0].size();\n    vector<vector<int>> pac(m, vector<int>(n)), atl(m, vector<int>(n));\n    for(int i=0;i<m;i++){ dfs(heights,pac,i,0,0); dfs(heights,atl,i,n-1,0); }\n    for(int j=0;j<n;j++){ dfs(heights,pac,0,j,0); dfs(heights,atl,m-1,j,0); }\n    vector<vector<int>> ans;\n    for(int i=0;i<m;i++) for(int j=0;j<n;j++)\n        if(pac[i][j]&&atl[i][j]) ans.push_back({i,j});\n    return ans;\n}"
        }
      ],
      "description": "Cells from which water can reach both Pacific and Atlantic oceans.",
      "summary": "DFS/BFS from both oceans — Graph/grid traversal: mark visited, queue or stack, process neighbors."
    },
    {
      "id": "graph-010",
      "title": "Surrounded Regions",
      "lc": 130,
      "importance": "should",
      "subtopic": "bfs-dfs",
      "difficulty": "Medium",
      "constraints": [
        "m, n <= 200",
        "board[i][j] is 'X' or 'O'"
      ],
      "examples": [
        {
          "in": "board=[[\"X\",\"X\",\"X\"],[\"X\",\"O\",\"X\"],[\"X\",\"X\",\"X\"]]",
          "out": "[[\"X\",\"X\",\"X\"],[\"X\",\"X\",\"X\"],[\"X\",\"X\",\"X\"]]"
        }
      ],
      "approaches": [
        {
          "name": "DFS from border O's",
          "time": "O(mn)",
          "space": "O(mn)",
          "code": "void dfs(vector<vector<char>>& b, int r, int c) {\n    int m=b.size(), n=b[0].size();\n    if(r<0||c<0||r>=m||c>=n||b[r][c]!='O') return;\n    b[r][c]='T';\n    dfs(b,r+1,c); dfs(b,r-1,c); dfs(b,r,c+1); dfs(b,r,c-1);\n}\nvoid solve(vector<vector<char>>& board) {\n    int m=board.size(), n=board[0].size();\n    for(int i=0;i<m;i++){ dfs(board,i,0); dfs(board,i,n-1); }\n    for(int j=0;j<n;j++){ dfs(board,0,j); dfs(board,m-1,j); }\n    for(int i=0;i<m;i++) for(int j=0;j<n;j++)\n        board[i][j] = board[i][j]=='T' ? 'O' : 'X';\n}"
        }
      ],
      "description": "Given input per constraints, solve: Surrounded Regions.",
      "summary": "DFS from border O's — Graph/grid traversal: mark visited, queue or stack, process neighbors."
    },
    {
      "id": "graph-011",
      "title": "Number of Enclaves",
      "lc": 1020,
      "importance": "nice",
      "subtopic": "bfs-dfs",
      "difficulty": "Medium",
      "constraints": [
        "m, n <= 500",
        "grid[i][j] is 0 or 1"
      ],
      "examples": [
        {
          "in": "grid=[[0,0,0,0,0],[1,1,1,1,0],[0,1,0,0,0]]",
          "out": "3"
        }
      ],
      "approaches": [
        {
          "name": "Mark border-connected land",
          "time": "O(mn)",
          "space": "O(mn)",
          "code": "void dfs(vector<vector<int>>& g,int r,int c){ if(r<0||c<0||r>=(int)g.size()||c>=(int)g[0].size()||!g[r][c]) return; g[r][c]=0; dfs(g,r+1,c);dfs(g,r-1,c);dfs(g,r,c+1);dfs(g,r,c-1);}\nint numEnclaves(vector<vector<int>>& grid) {\n    int m=grid.size(), n=grid[0].size();\n    for(int i=0;i<m;i++){ dfs(grid,i,0); dfs(grid,i,n-1); }\n    for(int j=0;j<n;j++){ dfs(grid,0,j); dfs(grid,m-1,j); }\n    int ans=0; for(int i=0;i<m;i++) for(int j=0;j<n;j++) if(grid[i][j]) ans++;\n    return ans;\n}"
        }
      ],
      "description": "Given input per constraints, solve: Number of Enclaves.",
      "summary": "Mark border-connected land — Graph/grid traversal: mark visited, queue or stack, process neighbors."
    },
    {
      "id": "graph-012",
      "title": "Keys and Rooms",
      "lc": 841,
      "importance": "should",
      "subtopic": "bfs-dfs",
      "difficulty": "Medium",
      "constraints": [
        "n == rooms.length",
        "1 <= rooms[i].length <= 1000"
      ],
      "examples": [
        {
          "in": "rooms=[[1],[2],[3],[]]",
          "out": "true"
        }
      ],
      "approaches": [
        {
          "name": "DFS reachability",
          "time": "O(V+E)",
          "space": "O(V)",
          "code": "bool canVisitAllRooms(vector<vector<int>>& rooms) {\n    int n=rooms.size(); vector<int> vis(n);\n    function<void(int)> dfs=[&](int u){ vis[u]=1; for(int v:rooms[u]) if(!vis[v]) dfs(v); };\n    dfs(0); return count(vis.begin(),vis.end(),1)==n;\n}"
        }
      ],
      "description": "Given input per constraints, solve: Keys and Rooms.",
      "summary": "DFS reachability — Graph/grid traversal: mark visited, queue or stack, process neighbors."
    },
    {
      "id": "graph-013",
      "title": "Course Schedule",
      "lc": 207,
      "importance": "must",
      "subtopic": "topo",
      "difficulty": "Medium",
      "constraints": [
        "1 <= numCourses <= 2000",
        "0 <= prerequisites.length <= 5000"
      ],
      "examples": [
        {
          "in": "numCourses=2, prerequisites=[[1,0]]",
          "out": "true"
        }
      ],
      "approaches": [
        {
          "name": "Kahn's BFS topo",
          "time": "O(V+E)",
          "space": "O(V+E)",
          "code": "bool canFinish(int n, vector<vector<int>>& pre) {\n    vector<vector<int>> g(n); vector<int> indeg(n);\n    for(auto& e:pre){ g[e[1]].push_back(e[0]); indeg[e[0]]++; }\n    queue<int> q; for(int i=0;i<n;i++) if(!indeg[i]) q.push(i);\n    int seen=0;\n    while(!q.empty()){ int u=q.front(); q.pop(); seen++;\n        for(int v:g[u]) if(--indeg[v]==0) q.push(v);\n    } return seen==n;\n}"
        },
        {
          "name": "3-color DFS cycle detect",
          "time": "O(V+E)",
          "space": "O(V)",
          "code": "bool canFinish(int n, vector<vector<int>>& pre) {\n    vector<vector<int>> g(n); for(auto& e:pre) g[e[1]].push_back(e[0]);\n    vector<int> color(n);\n    function<bool(int)> dfs=[&](int u){\n        color[u]=1;\n        for(int v:g[u]){ if(color[v]==1) return false; if(!color[v]&&!dfs(v)) return false; }\n        color[u]=2; return true;\n    };\n    for(int i=0;i<n;i++) if(!color[i]&&!dfs(i)) return false;\n    return true;\n}"
        }
      ],
      "description": "Given prerequisites, return true if you can finish all courses (no cycle).",
      "summary": "In-degree queue: pop u, push neighbors when in-degree hits 0."
    },
    {
      "id": "graph-014",
      "title": "Course Schedule II",
      "lc": 210,
      "importance": "must",
      "subtopic": "topo",
      "difficulty": "Medium",
      "constraints": [
        "same as LC 207",
        "return any valid order or []"
      ],
      "examples": [
        {
          "in": "numCourses=4, prerequisites=[[1,0],[2,0],[3,1],[3,2]]",
          "out": "[0,1,2,3] or [0,2,1,3]"
        }
      ],
      "approaches": [
        {
          "name": "Kahn's topo order",
          "time": "O(V+E)",
          "space": "O(V+E)",
          "code": "vector<int> findOrder(int n, vector<vector<int>>& pre) {\n    vector<vector<int>> g(n); vector<int> indeg(n);\n    for(auto& e:pre){ g[e[1]].push_back(e[0]); indeg[e[0]]++; }\n    queue<int> q; for(int i=0;i<n;i++) if(!indeg[i]) q.push(i);\n    vector<int> order;\n    while(!q.empty()){ int u=q.front(); q.pop(); order.push_back(u);\n        for(int v:g[u]) if(--indeg[v]==0) q.push(v);\n    } return (int)order.size()==n ? order : vector<int>{};\n}"
        }
      ],
      "description": "Given input per constraints, solve: Course Schedule II.",
      "summary": "Kahn's topo order — Directed acyclic graph ordering — Kahn BFS or DFS postorder reverse."
    },
    {
      "id": "graph-015",
      "title": "Alien Dictionary",
      "lc": 269,
      "importance": "should",
      "subtopic": "topo",
      "difficulty": "Hard",
      "constraints": [
        "1 <= words.length <= 100",
        "words[i] lowercase English"
      ],
      "examples": [
        {
          "in": "words=[\"wrt\",\"wrf\",\"er\",\"ett\",\"rftt\"]",
          "out": "\"wertf\""
        }
      ],
      "approaches": [
        {
          "name": "Build graph + topo sort",
          "time": "O(C) chars total",
          "space": "O(1) alphabet",
          "code": "string alienOrder(vector<string>& words) {\n    unordered_map<char, unordered_set<char>> g;\n    unordered_map<char,int> indeg;\n    for(auto& w:words) for(char c:w) indeg[c]=0;\n    for(int i=0;i+1<(int)words.size();i++){\n        string& a=words[i], &b=words[i+1];\n        if(a.size()>b.size() && a.substr(0,b.size())==b) return \"\";\n        for(int j=0;j<(int)min(a.size(),b.size());j++)\n            if(a[j]!=b[j]){ g[b[j]].insert(a[j]); indeg[a[j]]++; break; }\n    }\n    queue<char> q; for(auto& p:indeg) if(!p.second) q.push(p.first);\n    string ans;\n    while(!q.empty()){ char u=q.front(); q.pop(); ans+=u;\n        for(char v:g[u]) if(--indeg[v]==0) q.push(v);\n    } return ans.size()==indeg.size()? ans : \"\";\n}"
        }
      ],
      "description": "Given input per constraints, solve: Alien Dictionary.",
      "summary": "Build graph + topo sort — Directed acyclic graph ordering — Kahn BFS or DFS postorder reverse."
    },
    {
      "id": "graph-016",
      "title": "Minimum Height Trees",
      "lc": 310,
      "importance": "should",
      "subtopic": "topo",
      "difficulty": "Medium",
      "constraints": [
        "1 <= n <= 2*10^4",
        "tree with n nodes"
      ],
      "examples": [
        {
          "in": "n=6, edges=[[3,0],[3,1],[3,2],[3,4],[5,2]]",
          "out": "[3] or [4]"
        }
      ],
      "approaches": [
        {
          "name": "Leaf pruning (topo)",
          "time": "O(n)",
          "space": "O(n)",
          "code": "vector<int> findMinHeightTrees(int n, vector<vector<int>>& edges) {\n    if(n<=2){ vector<int> ans(n); iota(ans.begin(),ans.end(),0); return ans; }\n    vector<int> deg(n); vector<vector<int>> g(n);\n    for(auto& e:edges){ g[e[0]].push_back(e[1]); g[e[1]].push_back(e[0]); deg[e[0]]++; deg[e[1]]++; }\n    queue<int> q; for(int i=0;i<n;i++) if(deg[i]==1) q.push(i);\n    int rem=n;\n    while(rem>2){ int sz=q.size(); rem-=sz;\n        while(sz--){ int u=q.front(); q.pop();\n            for(int v:g[u]) if(--deg[v]==1) q.push(v);\n        }\n    } vector<int> ans; while(!q.empty()) ans.push_back(q.front()), q.pop();\n    return ans;\n}"
        }
      ],
      "description": "Compute the minimum height trees over the given input per constraints.",
      "summary": "Leaf pruning (topo) — Directed acyclic graph ordering — Kahn BFS or DFS postorder reverse."
    },
    {
      "id": "graph-017",
      "title": "Course Schedule IV",
      "lc": 1462,
      "importance": "nice",
      "subtopic": "topo",
      "difficulty": "Medium",
      "constraints": [
        "1 <= numCourses <= 100",
        "transitive prerequisite queries"
      ],
      "examples": [
        {
          "in": "n=2, relations=[[1,0]], queries=[[0,1],[1,0]]",
          "out": "[false,true]"
        }
      ],
      "approaches": [
        {
          "name": "Floyd or DFS reachability",
          "time": "O(n^3) or O(n*(V+E))",
          "space": "O(n^2)",
          "code": "vector<bool> checkIfPrerequisite(int n, vector<vector<int>>& rel, vector<vector<int>>& q) {\n    vector<vector<int>> reach(n, vector<int>(n));\n    for(auto& e:rel) reach[e[0]][e[1]]=1;\n    for(int k=0;k<n;k++) for(int i=0;i<n;i++) for(int j=0;j<n;j++)\n        reach[i][j]|=reach[i][k]&reach[k][j];\n    vector<bool> ans; for(auto& qq:q) ans.push_back(reach[qq[0]][qq[1]]);\n    return ans;\n}"
        }
      ],
      "description": "Given input per constraints, solve: Course Schedule IV.",
      "summary": "Floyd or DFS reachability — Directed acyclic graph ordering — Kahn BFS or DFS postorder reverse."
    },
    {
      "id": "graph-018",
      "title": "Clone Graph",
      "lc": 133,
      "importance": "must",
      "subtopic": "dfs-advanced",
      "difficulty": "Medium",
      "constraints": [
        "Node val unique",
        "no self loops"
      ],
      "examples": [
        {
          "in": "adjList = [[2,4],[1,3],[2,4],[1,3]]",
          "out": "deep copy of graph"
        }
      ],
      "approaches": [
        {
          "name": "DFS + hash map",
          "time": "O(V+E)",
          "space": "O(V)",
          "code": "Node* cloneGraph(Node* node) {\n    if(!node) return nullptr;\n    unordered_map<Node*,Node*> mp;\n    function<Node*(Node*)> dfs=[&](Node* u){\n        if(mp.count(u)) return mp[u];\n        Node* copy=new Node(u->val);\n        mp[u]=copy;\n        for(Node* v:u->neighbors) copy->neighbors.push_back(dfs(v));\n        return copy;\n    };\n    return dfs(node);\n}"
        }
      ],
      "description": "Given input per constraints, solve: Clone Graph.",
      "summary": "DFS + hash map — state invariant, then loop."
    },
    {
      "id": "graph-019",
      "title": "Is Graph Bipartite?",
      "lc": 785,
      "importance": "must",
      "subtopic": "dfs-advanced",
      "difficulty": "Medium",
      "constraints": [
        "1 <= n <= 100",
        "undirected graph"
      ],
      "examples": [
        {
          "in": "graph=[[1,2,3],[0,2],[0,1,3],[0,2]]",
          "out": "false"
        }
      ],
      "approaches": [
        {
          "name": "BFS 2-coloring",
          "time": "O(V+E)",
          "space": "O(V)",
          "code": "bool isBipartite(vector<vector<int>>& graph) {\n    int n=graph.size(); vector<int> color(n,-1);\n    for(int s=0;s<n;s++) if(color[s]==-1){\n        queue<int> q; q.push(s); color[s]=0;\n        while(!q.empty()){ int u=q.front(); q.pop();\n            for(int v:graph[u]){\n                if(color[v]==-1){ color[v]=color[u]^1; q.push(v); }\n                else if(color[v]==color[u]) return false;\n            }\n        }\n    } return true;\n}"
        }
      ],
      "description": "Given input per constraints, solve: Is Graph Bipartite?.",
      "summary": "BFS 2-coloring — state invariant, then loop."
    },
    {
      "id": "graph-020",
      "title": "Critical Connections",
      "lc": 1192,
      "importance": "should",
      "subtopic": "dfs-advanced",
      "difficulty": "Hard",
      "constraints": [
        "2 <= n <= 10^5",
        "tree + one extra edge => one bridge"
      ],
      "examples": [
        {
          "in": "n=4, connections=[[0,1],[1,2],[2,0],[1,3]]",
          "out": "[[1,3]]"
        }
      ],
      "approaches": [
        {
          "name": "Tarjan bridges",
          "time": "O(V+E)",
          "space": "O(V+E)",
          "code": "void tarjan(int u, int p, vector<vector<int>>& g, vector<int>& disc, vector<int>& low, vector<vector<int>>& res, int& timer) {\n    disc[u]=low[u]=++timer;\n    for(int v:g[u]) if(v!=p){\n        if(!disc[v]){ tarjan(v,u,g,disc,low,res,timer); low[u]=min(low[u],low[v]);\n            if(low[v]>disc[u]) res.push_back({min(u,v),max(u,v)});\n        } else low[u]=min(low[u],disc[v]);\n    }\n}\nvector<vector<int>> criticalConnections(int n, vector<vector<int>>& con) {\n    vector<vector<int>> g(n); for(auto& e:con){ g[e[0]].push_back(e[1]); g[e[1]].push_back(e[0]); }\n    vector<int> disc(n), low(n); vector<vector<int>> res; int timer=0;\n    tarjan(0,-1,g,disc,low,res,timer); return res;\n}"
        }
      ],
      "description": "Given input per constraints, solve: Critical Connections.",
      "summary": "Tarjan bridges — state invariant, then loop."
    },
    {
      "id": "graph-021",
      "title": "All Paths From Source to Target",
      "lc": 797,
      "importance": "should",
      "subtopic": "dfs-advanced",
      "difficulty": "Medium",
      "constraints": [
        "n <= 15",
        "DAG"
      ],
      "examples": [
        {
          "in": "graph=[[1,2],[3],[3],[]]",
          "out": "[[0,1,3],[0,2,3]]"
        }
      ],
      "approaches": [
        {
          "name": "Backtracking DFS",
          "time": "O(2^n)",
          "space": "O(n)",
          "code": "void dfs(vector<vector<int>>& g, int u, int t, vector<int>& path, vector<vector<int>>& ans) {\n    if(u==t){ ans.push_back(path); return; }\n    for(int v:g[u]){ path.push_back(v); dfs(g,v,t,path,ans); path.pop_back(); }\n}\nvector<vector<int>> allPathsSourceTarget(vector<vector<int>>& graph) {\n    vector<vector<int>> ans; vector<int> path={0};\n    dfs(graph,0,(int)graph.size()-1,path,ans); return ans;\n}"
        }
      ],
      "description": "Given input per constraints, solve: All Paths From Source to Target.",
      "summary": "Backtracking DFS — state invariant, then loop."
    },
    {
      "id": "graph-022",
      "title": "Evaluate Division",
      "lc": 399,
      "importance": "must",
      "subtopic": "dfs-advanced",
      "difficulty": "Medium",
      "constraints": [
        "2 <= equations.length <= 20",
        "queries reference known pairs"
      ],
      "examples": [
        {
          "in": "equations=[[\"a\",\"b\"]], values=[2.0], queries=[[\"a\",\"b\"],[\"b\",\"a\"]]",
          "out": "[2.0,0.5]"
        }
      ],
      "approaches": [
        {
          "name": "Build weighted graph + DFS",
          "time": "O(Q*(V+E))",
          "space": "O(V+E)",
          "code": "double dfs(string cur, string target, unordered_map<string, vector<pair<string,double>>>& g, unordered_set<string>& vis) {\n    if(!g.count(cur)) return -1.0;\n    if(cur==target) return 1.0;\n    vis.insert(cur);\n    for(auto& p:g[cur]) if(!vis.count(p.first)){\n        double sub=dfs(p.first,target,g,vis);\n        if(sub>=0) return sub*p.second;\n    } return -1.0;\n}\nvector<double> calcEquation(vector<vector<string>>& eq, vector<double>& val, vector<vector<string>>& q) {\n    unordered_map<string, vector<pair<string,double>>> g;\n    for(int i=0;i<(int)eq.size();i++){ g[eq[i][0]].push_back({eq[i][1],val[i]}); g[eq[i][1]].push_back({eq[i][0],1.0/val[i]}); }\n    vector<double> ans;\n    for(auto& qq:q){ unordered_set<string> vis; ans.push_back(dfs(qq[0],qq[1],g,vis)); }\n    return ans;\n}"
        }
      ],
      "description": "Given input per constraints, solve: Evaluate Division.",
      "summary": "Build weighted graph + DFS — state invariant, then loop."
    },
    {
      "id": "graph-023",
      "title": "Reconstruct Itinerary",
      "lc": 332,
      "importance": "should",
      "subtopic": "dfs-advanced",
      "difficulty": "Hard",
      "constraints": [
        "1 <= tickets.length <= 300",
        "use all tickets once"
      ],
      "examples": [
        {
          "in": "tickets=[[\"MUC\",\"LHR\"],[\"JFK\",\"MUC\"]]",
          "out": "[\"JFK\",\"MUC\",\"LHR\"]"
        }
      ],
      "approaches": [
        {
          "name": "Hierholzer Eulerian path",
          "time": "O(E log E)",
          "space": "O(E)",
          "code": "vector<string> findItinerary(vector<vector<string>>& tickets) {\n    unordered_map<string, multiset<string>> g;\n    for(auto& t:tickets) g[t[0]].insert(t[1]);\n    vector<string> route;\n    function<void(string)> dfs=[&](string u){\n        while(g[u].size()){ string v=*g[u].begin(); g[u].erase(g[u].begin()); dfs(v); }\n        route.push_back(u);\n    };\n    dfs(\"JFK\"); reverse(route.begin(),route.end()); return route;\n}"
        }
      ],
      "description": "Given input per constraints, solve: Reconstruct Itinerary.",
      "summary": "Hierholzer Eulerian path — state invariant, then loop."
    },
    {
      "id": "graph-024",
      "title": "Possible Bipartition",
      "lc": 886,
      "importance": "should",
      "subtopic": "dfs-advanced",
      "difficulty": "Medium",
      "constraints": [
        "1 <= n <= 2000",
        "dislikes are undirected edges"
      ],
      "examples": [
        {
          "in": "n=4, dislikes=[[1,2],[1,3],[2,4]]",
          "out": "true"
        }
      ],
      "approaches": [
        {
          "name": "2-color each component",
          "time": "O(V+E)",
          "space": "O(V+E)",
          "code": "bool possibleBipartition(int n, vector<vector<int>>& dislikes) {\n    vector<vector<int>> g(n+1);\n    for(auto& e:dislikes){ g[e[0]].push_back(e[1]); g[e[1]].push_back(e[0]); }\n    vector<int> color(n+1,-1);\n    for(int s=1;s<=n;s++) if(color[s]==-1){\n        queue<int> q; q.push(s); color[s]=0;\n        while(!q.empty()){ int u=q.front(); q.pop();\n            for(int v:g[u]){ if(color[v]==-1){ color[v]=color[u]^1; q.push(v); }\n                else if(color[v]==color[u]) return false; }\n        }\n    } return true;\n}"
        }
      ],
      "description": "Given input per constraints, solve: Possible Bipartition.",
      "summary": "2-color each component — state invariant, then loop."
    },
    {
      "id": "graph-025",
      "title": "Network Delay Time",
      "lc": 743,
      "importance": "must",
      "subtopic": "shortest-path",
      "difficulty": "Medium",
      "constraints": [
        "1 <= n <= 100",
        "non-negative edge weights"
      ],
      "examples": [
        {
          "in": "times=[[2,1,1],[2,3,1],[3,4,1]], n=4, k=2",
          "out": "2"
        }
      ],
      "approaches": [
        {
          "name": "Dijkstra min-heap",
          "time": "O(E log V)",
          "space": "O(V+E)",
          "code": "int networkDelayTime(vector<vector<int>>& times, int n, int k) {\n    vector<vector<pair<int,int>>> g(n+1);\n    for(auto& t:times) g[t[0]].push_back({t[1],t[2]});\n    const int INF=1e9; vector<int> dist(n+1,INF); dist[k]=0;\n    priority_queue<pair<int,int>, vector<pair<int,int>>, greater<pair<int,int>>> pq;\n    pq.push({0,k});\n    while(!pq.empty()){ auto p=pq.top(); pq.pop();\n        if(p.first>dist[p.second]) continue;\n        for(auto& e:g[p.second]) if(dist[e.first]>p.first+e.second){\n            dist[e.first]=p.first+e.second; pq.push({dist[e.first],e.first});\n        }\n    } int ans=*max_element(dist.begin()+1,dist.end());\n    return ans>=INF? -1: ans;\n}"
        }
      ],
      "description": "Time for signal from node k to reach all nodes in weighted directed graph.",
      "summary": "Min-heap of (dist, node); relax edges; skip stale heap entries."
    },
    {
      "id": "graph-026",
      "title": "Cheapest Flights Within K Stops",
      "lc": 787,
      "importance": "must",
      "subtopic": "shortest-path",
      "difficulty": "Medium",
      "constraints": [
        "1 <= n <= 100",
        "at most k stops"
      ],
      "examples": [
        {
          "in": "n=3, flights=[[0,1,100],[1,2,100],[0,2,500]], src=0, dst=2, k=1",
          "out": "200"
        }
      ],
      "approaches": [
        {
          "name": "Bellman-Ford k+1 relaxations",
          "time": "O(k*E)",
          "space": "O(V)",
          "code": "int findCheapestPrice(int n, vector<vector<int>>& flights, int src, int dst, int k) {\n    const int INF=1e9; vector<int> dist(n,INF); dist[src]=0;\n    for(int i=0;i<=k;i++){\n        vector<int> tmp=dist;\n        for(auto& f:flights) if(dist[f[0]]<INF)\n            tmp[f[1]]=min(tmp[f[1]], dist[f[0]]+f[2]);\n        dist.swap(tmp);\n    } return dist[dst]>=INF? -1: dist[dst];\n}"
        },
        {
          "name": "Modified Dijkstra (stops state)",
          "time": "O(E log V)",
          "space": "O(V)",
          "code": "int findCheapestPrice(int n, vector<vector<int>>& flights, int src, int dst, int k) {\n    vector<vector<pair<int,int>>> g(n);\n    for(auto& f:flights) g[f[0]].push_back({f[1],f[2]});\n    vector<int> best(n,INT_MAX);\n    priority_queue<tuple<int,int,int>, vector<tuple<int,int,int>>, greater<>> pq;\n    pq.push({0,src,k+1});\n    while(!pq.empty()){ auto [cost,u,stops]=pq.top(); pq.pop();\n        if(u==dst) return cost; if(stops==0) continue;\n        for(auto& e:g[u]) if(cost+e.second<best[e.first]){\n            best[e.first]=cost+e.second; pq.push({cost+e.second,e.first,stops-1});\n        }\n    } return -1;\n}"
        }
      ],
      "description": "Cheapest price from src to dst with at most k stops.",
      "summary": "Bellman-Ford k+1 relaxations — Weighted graph: Dijkstra (non-neg), Bellman-Ford, or 0-1 BFS."
    },
    {
      "id": "graph-027",
      "title": "Path with Minimum Effort",
      "lc": 1631,
      "importance": "should",
      "subtopic": "shortest-path",
      "difficulty": "Medium",
      "constraints": [
        "m, n <= 200",
        "effort = max absolute diff on path"
      ],
      "examples": [
        {
          "in": "heights=[[1,2,2],[3,8,2],[5,3,5]]",
          "out": "2"
        }
      ],
      "approaches": [
        {
          "name": "Dijkstra on effort",
          "time": "O(mn log mn)",
          "space": "O(mn)",
          "code": "int minimumEffortPath(vector<vector<int>>& h) {\n    int m=h.size(), n=h[0].size(); vector<vector<int>> dist(m, vector<int>(n,INT_MAX));\n    priority_queue<tuple<int,int,int>, vector<tuple<int,int,int>>, greater<>> pq;\n    pq.push({0,0,0}); dist[0][0]=0;\n    int dr[4]={1,-1,0,0}, dc[4]={0,0,1,-1};\n    while(!pq.empty()){ auto [e,r,c]=pq.top(); pq.pop();\n        if(r==m-1&&c==n-1) return e;\n        for(int k=0;k<4;k++){ int nr=r+dr[k], nc=c+dc[k];\n            if(nr<0||nc<0||nr>=m||nc>=n) continue;\n            int ne=max(e, abs(h[nr][nc]-h[r][c]));\n            if(ne<dist[nr][nc]){ dist[nr][nc]=ne; pq.push({ne,nr,nc}); }\n        }\n    } return 0;\n}"
        }
      ],
      "description": "Given input per constraints, solve: Path with Minimum Effort.",
      "summary": "Dijkstra on effort — Weighted graph: Dijkstra (non-neg), Bellman-Ford, or 0-1 BFS."
    },
    {
      "id": "graph-028",
      "title": "Find the City With Smallest Reach",
      "lc": 1334,
      "importance": "should",
      "subtopic": "shortest-path",
      "difficulty": "Medium",
      "constraints": [
        "1 <= n <= 100",
        "threshold distance"
      ],
      "examples": [
        {
          "in": "n=4, edges=..., distanceThreshold=4",
          "out": "3"
        }
      ],
      "approaches": [
        {
          "name": "Floyd-Warshall",
          "time": "O(n^3)",
          "space": "O(n^2)",
          "code": "int findTheCity(int n, vector<vector<int>>& edges, int T) {\n    const int INF=1e9; vector<vector<int>> d(n, vector<int>(n,INF));\n    for(int i=0;i<n;i++) d[i][i]=0;\n    for(auto& e:edges){ d[e[0]][e[1]]=e[2]; d[e[1]][e[0]]=e[2]; }\n    for(int k=0;k<n;k++) for(int i=0;i<n;i++) for(int j=0;j<n;j++)\n        if(d[i][k]<INF && d[k][j]<INF) d[i][j]=min(d[i][j], d[i][k]+d[k][j]);\n    int bestCity=-1, bestCnt=INT_MAX;\n    for(int i=0;i<n;i++){ int cnt=0; for(int j=0;j<n;j++) if(d[i][j]<=T) cnt++;\n        if(cnt<=bestCnt){ bestCnt=cnt; bestCity=i; }\n    } return bestCity;\n}"
        }
      ],
      "description": "Find the City With Smallest Reach — return the required index, count, or boolean.",
      "summary": "Floyd-Warshall — Weighted graph: Dijkstra (non-neg), Bellman-Ford, or 0-1 BFS."
    },
    {
      "id": "graph-029",
      "title": "Swim in Rising Water",
      "lc": 778,
      "importance": "should",
      "subtopic": "shortest-path",
      "difficulty": "Hard",
      "constraints": [
        "n <= 50",
        "minimize max elevation on path"
      ],
      "examples": [
        {
          "in": "grid=[[0,2],[1,3]]",
          "out": "3"
        }
      ],
      "approaches": [
        {
          "name": "Dijkstra / binary search + BFS",
          "time": "O(n^2 log n)",
          "space": "O(n^2)",
          "code": "int swimInWater(vector<vector<int>>& grid) {\n    int n=grid.size(); vector<vector<int>> dist(n, vector<int>(n,INT_MAX));\n    priority_queue<tuple<int,int,int>, vector<tuple<int,int,int>>, greater<>> pq;\n    pq.push({grid[0][0],0,0}); dist[0][0]=grid[0][0];\n    int dr[4]={1,-1,0,0}, dc[4]={0,0,1,-1};\n    while(!pq.empty()){ auto [t,r,c]=pq.top(); pq.pop();\n        if(r==n-1&&c==n-1) return t;\n        for(int k=0;k<4;k++){ int nr=r+dr[k], nc=c+dc[k];\n            if(nr<0||nc<0||nr>=n||nc>=n) continue;\n            int nt=max(t, grid[nr][nc]);\n            if(nt<dist[nr][nc]){ dist[nr][nc]=nt; pq.push({nt,nr,nc}); }\n        }\n    } return -1;\n}"
        }
      ],
      "description": "Given input per constraints, solve: Swim in Rising Water.",
      "summary": "Dijkstra / binary search + BFS — Weighted graph: Dijkstra (non-neg), Bellman-Ford, or 0-1 BFS."
    },
    {
      "id": "graph-030",
      "title": "Minimum Obstacle Removal to Reach Corner",
      "lc": 2290,
      "importance": "nice",
      "subtopic": "shortest-path",
      "difficulty": "Hard",
      "constraints": [
        "m, n <= 10^3",
        "0-1 BFS on grid"
      ],
      "examples": [
        {
          "in": "grid with 0 free / 1 obstacle",
          "out": "minimum removals"
        }
      ],
      "approaches": [
        {
          "name": "0-1 BFS",
          "time": "O(mn)",
          "space": "O(mn)",
          "code": "int minimumObstacles(vector<vector<int>>& grid) {\n    int m=grid.size(), n=grid[0].size();\n    vector<vector<int>> dist(m, vector<int>(n,INT_MAX));\n    deque<pair<int,int>> dq; dq.push_front({0,0}); dist[0][0]=0;\n    int dr[4]={1,-1,0,0}, dc[4]={0,0,1,-1};\n    while(!dq.empty()){ auto p=dq.front(); dq.pop_front();\n        for(int k=0;k<4;k++){ int nr=p.first+dr[k], nc=p.second+dc[k];\n            if(nr<0||nc<0||nr>=m||nc>=n) continue;\n            int w=grid[nr][nc];\n            if(dist[p.first][p.second]+w<dist[nr][nc]){\n                dist[nr][nc]=dist[p.first][p.second]+w;\n                if(w) dq.push_back({nr,nc}); else dq.push_front({nr,nc});\n            }\n        }\n    } return dist[m-1][n-1];\n}"
        }
      ],
      "description": "Compute the minimum obstacle removal to reach corner over the given input per constraints.",
      "summary": "0-1 BFS — Weighted graph: Dijkstra (non-neg), Bellman-Ford, or 0-1 BFS."
    },
    {
      "id": "graph-031",
      "title": "Shortest Path With Alternating Colors",
      "lc": 1129,
      "importance": "nice",
      "subtopic": "shortest-path",
      "difficulty": "Medium",
      "constraints": [
        "0 <= n <= 10^4",
        "edges colored red or blue"
      ],
      "examples": [
        {
          "in": "n=3, redEdges, blueEdges",
          "out": "distance array per node"
        }
      ],
      "approaches": [
        {
          "name": "BFS with (node, lastColor) state",
          "time": "O(V+E)",
          "space": "O(V)",
          "code": "vector<int> shortestAlternatingPaths(int n, vector<vector<int>>& red, vector<vector<int>>& blue) {\n    vector<vector<pair<int,int>>> g(n);\n    for(auto& e:red) g[e[0]].push_back({e[1],0});\n    for(auto& e:blue) g[e[0]].push_back({e[1],1});\n    vector<int> ans(n,-1); vector<vector<int>> dist(n, vector<int>(2,INT_MAX));\n    queue<tuple<int,int,int>> q; q.push({0,0,-1}); q.push({0,1,-1});\n    dist[0][0]=dist[0][1]=0;\n    while(!q.empty()){ auto [u,c,pc]=q.front(); q.pop();\n        for(auto& e:g[u]) if(e.second!=pc && dist[e.first][e.second]>dist[u][c]+1){\n            dist[e.first][e.second]=dist[u][c]+1;\n            if(ans[e.first]==-1) ans[e.first]=dist[e.first][e.second];\n            q.push({e.first,e.second,e.second});\n        }\n    } return ans;\n}"
        }
      ],
      "description": "Compute the shortest path with alternating colors over the given input per constraints.",
      "summary": "BFS with (node, lastColor) state — Weighted graph: Dijkstra (non-neg), Bellman-Ford, or 0-1 BFS."
    },
    {
      "id": "graph-032",
      "title": "Number of Ways to Arrive at Destination",
      "lc": 1976,
      "importance": "nice",
      "subtopic": "shortest-path",
      "difficulty": "Medium",
      "constraints": [
        "1 <= n <= 200",
        "count paths with min time mod 1e9+7"
      ],
      "examples": [
        {
          "in": "n=7, roads, src=0, dst=6",
          "out": "4"
        }
      ],
      "approaches": [
        {
          "name": "Dijkstra + path counting",
          "time": "O(E log V)",
          "space": "O(V+E)",
          "code": "int countPaths(int n, vector<vector<int>>& roads) {\n    const int MOD=1e9+7;\n    vector<vector<pair<long long,int>>> g(n);\n    for(auto& r:roads){ g[r[0]].push_back({r[1],r[2]}); g[r[1]].push_back({r[0],r[2]}); }\n    vector<long long> dist(n,LLONG_MAX); vector<long long> ways(n);\n    priority_queue<pair<long long,int>, vector<pair<long long,int>>, greater<>> pq;\n    dist[0]=0; ways[0]=1; pq.push({0,0});\n    while(!pq.empty()){ auto [d,u]=pq.top(); pq.pop(); if(d>dist[u]) continue;\n        for(auto& e:g[u]) if(dist[e.first]>d+e.second){\n            dist[e.first]=d+e.second; ways[e.first]=ways[u]; pq.push({dist[e.first],e.first});\n        } else if(dist[e.first]==d+e.second) ways[e.first]=(ways[e.first]+ways[u])%MOD;\n    } return (int)ways[n-1];\n}"
        }
      ],
      "description": "Given input per constraints, solve: Number of Ways to Arrive at Destination.",
      "summary": "Dijkstra + path counting — Weighted graph: Dijkstra (non-neg), Bellman-Ford, or 0-1 BFS."
    },
    {
      "id": "graph-033",
      "title": "Redundant Connection",
      "lc": 684,
      "importance": "must",
      "subtopic": "union-find",
      "difficulty": "Medium",
      "constraints": [
        "n <= 1000",
        "tree + one extra edge"
      ],
      "examples": [
        {
          "in": "edges=[[1,2],[1,3],[2,3]]",
          "out": "[2,3]"
        }
      ],
      "approaches": [
        {
          "name": "Union-Find",
          "time": "O(n α(n))",
          "space": "O(n)",
          "code": "vector<int> par, rnk;\nint find(int x){ return par[x]==x? x: par[x]=find(par[x]); }\nbool unite(int a,int b){ a=find(a); b=find(b); if(a==b) return false;\n    if(rnk[a]<rnk[b]) swap(a,b); par[b]=a; if(rnk[a]==rnk[b]) rnk[a]++; return true; }\nvector<int> findRedundantConnection(vector<vector<int>>& edges) {\n    int n=edges.size(); par.resize(n+1); rnk.assign(n+1,0); iota(par.begin(),par.end(),0);\n    for(auto& e:edges) if(!unite(e[0],e[1])) return e;\n    return {};\n}"
        }
      ],
      "description": "Given input per constraints, solve: Redundant Connection.",
      "summary": "Find root with path compression; union by rank — components in near O(1)."
    },
    {
      "id": "graph-034",
      "title": "Number of Connected Components",
      "lc": 323,
      "importance": "must",
      "subtopic": "union-find",
      "difficulty": "Medium",
      "constraints": [
        "1 <= n <= 2000",
        "undirected edges"
      ],
      "examples": [
        {
          "in": "n=5, edges=[[0,1],[1,2],[3,4]]",
          "out": "2"
        }
      ],
      "approaches": [
        {
          "name": "Union-Find count roots",
          "time": "O(n α(n))",
          "space": "O(n)",
          "code": "int countComponents(int n, vector<vector<int>>& edges) {\n    vector<int> par(n); iota(par.begin(),par.end(),0);\n    function<int(int)> find=[&](int x){ return par[x]==x? x: par[x]=find(par[x]); };\n    int comps=n;\n    for(auto& e:edges){ int a=find(e[0]), b=find(e[1]); if(a!=b){ par[a]=b; comps--; } }\n    return comps;\n}"
        }
      ],
      "description": "Given input per constraints, solve: Number of Connected Components.",
      "summary": "Union-Find count roots — Disjoint set: find with path compression, union by rank/size."
    },
    {
      "id": "graph-035",
      "title": "Accounts Merge",
      "lc": 721,
      "importance": "must",
      "subtopic": "union-find",
      "difficulty": "Medium",
      "constraints": [
        "accounts[i] length <= 10",
        "merge by email connectivity"
      ],
      "examples": [
        {
          "in": "accounts with names and emails",
          "out": "merged account lists"
        }
      ],
      "approaches": [
        {
          "name": "Union-Find on emails",
          "time": "O(N log N)",
          "space": "O(N)",
          "code": "vector<vector<string>> accountsMerge(vector<vector<string>>& acc) {\n    unordered_map<string,string> owner; unordered_map<string,string> parent;\n    function<string(string)> find=[&](string x){ return parent[x]==x? x: parent[x]=find(parent[x]); };\n    for(auto& a:acc) for(int i=1;i<(int)a.size();i++){\n        owner[a[i]]=a[0]; if(!parent.count(a[i])) parent[a[i]]=a[i];\n        if(i>1){ string r1=find(a[1]), r2=find(a[i]); parent[r1]=r2; }\n    }\n    unordered_map<string,set<string>> groups;\n    for(auto& p:parent){ string r=find(p.first); groups[r].insert(p.first); }\n    vector<vector<string>> res;\n    for(auto& g:groups){ vector<string> row={owner[g.first]}; row.insert(row.end(),g.second.begin(),g.second.end()); res.push_back(row); }\n    return res;\n}"
        }
      ],
      "description": "Given input per constraints, solve: Accounts Merge.",
      "summary": "Union-Find on emails — Disjoint set: find with path compression, union by rank/size."
    },
    {
      "id": "graph-036",
      "title": "Graph Valid Tree",
      "lc": 261,
      "importance": "must",
      "subtopic": "union-find",
      "difficulty": "Medium",
      "constraints": [
        "1 <= n <= 2000",
        "n-1 edges required for tree"
      ],
      "examples": [
        {
          "in": "n=5, edges=[[0,1],[0,2],[0,3],[1,4]]",
          "out": "true"
        }
      ],
      "approaches": [
        {
          "name": "Union-Find + edge count",
          "time": "O(n α(n))",
          "space": "O(n)",
          "code": "bool validTree(int n, vector<vector<int>>& edges) {\n    if((int)edges.size()!=n-1) return false;\n    vector<int> par(n); iota(par.begin(),par.end(),0);\n    function<int(int)> find=[&](int x){ return par[x]==x? x: par[x]=find(par[x]); };\n    for(auto& e:edges){ int a=find(e[0]), b=find(e[1]); if(a==b) return false; par[a]=b; }\n    return true;\n}"
        }
      ],
      "description": "Given n nodes and edges, return true if edges form a valid tree.",
      "summary": "Union-Find + edge count — Disjoint set: find with path compression, union by rank/size."
    },
    {
      "id": "graph-037",
      "title": "Number of Provinces",
      "lc": 547,
      "importance": "must",
      "subtopic": "union-find",
      "difficulty": "Medium",
      "constraints": [
        "1 <= n <= 200",
        "adjacency matrix"
      ],
      "examples": [
        {
          "in": "isConnected = [[1,1,0],[1,1,0],[0,0,1]]",
          "out": "2"
        }
      ],
      "approaches": [
        {
          "name": "DFS or Union-Find",
          "time": "O(n^2)",
          "space": "O(n)",
          "code": "void dfs(vector<vector<int>>& m, vector<int>& vis, int i, int n){\n    vis[i]=1; for(int j=0;j<n;j++) if(m[i][j]&&!vis[j]) dfs(m,vis,j,n);\n}\nint findCircleNum(vector<vector<int>>& isConnected) {\n    int n=isConnected.size(), ans=0; vector<int> vis(n);\n    for(int i=0;i<n;i++) if(!vis[i]){ dfs(isConnected,vis,i,n); ans++; }\n    return ans;\n}"
        }
      ],
      "description": "Given input per constraints, solve: Number of Provinces.",
      "summary": "DFS or Union-Find — Disjoint set: find with path compression, union by rank/size."
    },
    {
      "id": "graph-038",
      "title": "Satisfiability of Equality Equations",
      "lc": 990,
      "importance": "should",
      "subtopic": "union-find",
      "difficulty": "Medium",
      "constraints": [
        "equations.length == 4",
        "lowercase letters"
      ],
      "examples": [
        {
          "in": "equations=[\"a==b\",\"b!=a\"]",
          "out": "false"
        }
      ],
      "approaches": [
        {
          "name": "Union-Find: unite == first, check !=",
          "time": "O(n α(n))",
          "space": "O(1)",
          "code": "bool equationsPossible(vector<string>& eq) {\n    vector<int> par(26); iota(par.begin(),par.end(),0);\n    function<int(int)> find=[&](int x){ return par[x]==x? x: par[x]=find(par[x]); };\n    for(auto& e:eq) if(e[1]=='='){ int a=e[0]-'a', b=e[3]-'a'; par[find(a)]=find(b); }\n    for(auto& e:eq) if(e[1]=='!'){ int a=e[0]-'a', b=e[3]-'a'; if(find(a)==find(b)) return false; }\n    return true;\n}"
        }
      ],
      "description": "Given input per constraints, solve: Satisfiability of Equality Equations.",
      "summary": "Union-Find: unite == first, check != — Disjoint set: find with path compression, union by rank/size."
    },
    {
      "id": "graph-039",
      "title": "Most Stones Removed",
      "lc": 947,
      "importance": "should",
      "subtopic": "union-find",
      "difficulty": "Medium",
      "constraints": [
        "1 <= stones.length <= 1000",
        "same row OR column => connected"
      ],
      "examples": [
        {
          "in": "stones=[[0,0],[0,1],[1,0],[1,2],[2,1],[2,2]]",
          "out": "5"
        }
      ],
      "approaches": [
        {
          "name": "Union-Find on row/col nodes",
          "time": "O(n α(n))",
          "space": "O(n)",
          "code": "int removeStones(vector<vector<int>>& stones) {\n    unordered_map<int,int> rowId, colId; int id=0;\n    vector<int> par(2000); iota(par.begin(),par.end(),0);\n    function<int(int)> find=[&](int x){ return par[x]==x? x: par[x]=find(par[x]); };\n    for(auto& s:stones){\n        if(!rowId.count(s[0])) rowId[s[0]]=id++;\n        if(!colId.count(s[1])) colId[s[1]]=id++;\n        par[find(rowId[s[0]])]=find(colId[s[1]]);\n    }\n    unordered_set<int> roots;\n    for(auto& p:rowId) roots.insert(find(p.second));\n    for(auto& p:colId) roots.insert(find(p.second));\n    return (int)stones.size()-(int)roots.size();\n}"
        }
      ],
      "description": "Given input per constraints, solve: Most Stones Removed.",
      "summary": "Union-Find on row/col nodes — Disjoint set: find with path compression, union by rank/size."
    },
    {
      "id": "graph-040",
      "title": "Min Cost to Connect All Points",
      "lc": 1584,
      "importance": "must",
      "subtopic": "mst",
      "difficulty": "Medium",
      "constraints": [
        "1 <= points.length <= 1000",
        "Manhattan distance"
      ],
      "examples": [
        {
          "in": "points=[[0,0],[2,2],[3,10]]",
          "out": "11"
        }
      ],
      "approaches": [
        {
          "name": "Kruskal + Union-Find",
          "time": "O(n^2 log n)",
          "space": "O(n)",
          "code": "int minCostConnectPoints(vector<vector<int>>& pts) {\n    int n=pts.size(); vector<tuple<int,int,int>> edges;\n    auto dist=[&](int i,int j){ return abs(pts[i][0]-pts[j][0])+abs(pts[i][1]-pts[j][1]); };\n    for(int i=0;i<n;i++) for(int j=i+1;j<n;j++) edges.push_back({dist(i,j),i,j});\n    sort(edges.begin(), edges.end());\n    vector<int> par(n); iota(par.begin(),par.end(),0);\n    function<int(int)> find=[&](int x){ return par[x]==x? x: par[x]=find(par[x]); };\n    int cost=0, used=0;\n    for(auto& e:edges){ int a=find(get<1>(e)), b=find(get<2>(e));\n        if(a!=b){ par[a]=b; cost+=get<0>(e); if(++used==n-1) break; }\n    } return cost;\n}"
        }
      ],
      "description": "Given input per constraints, solve: Min Cost to Connect All Points.",
      "summary": "Kruskal + Union-Find — Minimum spanning tree: Kruskal sort edges + UF, or Prim with heap."
    },
    {
      "id": "graph-041",
      "title": "Connecting Cities With Minimum Cost",
      "lc": 1135,
      "importance": "should",
      "subtopic": "mst",
      "difficulty": "Medium",
      "constraints": [
        "n <= 10^4",
        "n-1 edges needed"
      ],
      "examples": [
        {
          "in": "n=3, connections=[[1,2,5],[1,3,6],[2,3,1]]",
          "out": "6"
        }
      ],
      "approaches": [
        {
          "name": "Kruskal MST",
          "time": "O(E log E)",
          "space": "O(n)",
          "code": "int minimumCost(int n, vector<vector<int>>& con) {\n    sort(con.begin(), con.end(), [](auto& a, auto& b){ return a[2]<b[2]; });\n    vector<int> par(n+1); iota(par.begin(),par.end(),0);\n    function<int(int)> find=[&](int x){ return par[x]==x? x: par[x]=find(par[x]); };\n    int cost=0, edges=0;\n    for(auto& c:con){ int a=find(c[0]), b=find(c[1]); if(a!=b){ par[a]=b; cost+=c[2]; if(++edges==n-1) return cost; } }\n    return -1;\n}"
        }
      ],
      "description": "Given input per constraints, solve: Connecting Cities With Minimum Cost.",
      "summary": "Kruskal MST — Minimum spanning tree: Kruskal sort edges + UF, or Prim with heap."
    },
    {
      "id": "graph-042",
      "title": "Optimize Water Distribution",
      "lc": 1168,
      "importance": "nice",
      "subtopic": "mst",
      "difficulty": "Hard",
      "constraints": [
        "virtual node 0 to wells",
        "pipes + well costs"
      ],
      "examples": [
        {
          "in": "n=3, wells, pipes",
          "out": "minimum total cost"
        }
      ],
      "approaches": [
        {
          "name": "MST with super-source",
          "time": "O(E log E)",
          "space": "O(n)",
          "code": "int minCostToSupplyWater(int n, vector<int>& wells, vector<vector<int>>& pipes) {\n    vector<vector<int>> edges;\n    for(int i=0;i<n;i++) edges.push_back({0,i+1,wells[i]});\n    for(auto& p:pipes) edges.push_back(p);\n    sort(edges.begin(), edges.end(), [](auto& a, auto& b){ return a[2]<b[2]; });\n    vector<int> par(n+1); iota(par.begin(),par.end(),0);\n    function<int(int)> find=[&](int x){ return par[x]==x? x: par[x]=find(par[x]); };\n    int cost=0, cnt=0;\n    for(auto& e:edges){ int a=find(e[0]), b=find(e[1]); if(a!=b){ par[a]=b; cost+=e[2]; if(++cnt==n) break; } }\n    return cost;\n}"
        }
      ],
      "description": "Given input per constraints, solve: Optimize Water Distribution.",
      "summary": "MST with super-source — Minimum spanning tree: Kruskal sort edges + UF, or Prim with heap."
    },
    {
      "id": "graph-043",
      "title": "Number of Islands II",
      "lc": 305,
      "importance": "should",
      "subtopic": "union-find",
      "difficulty": "Hard",
      "constraints": [
        "m, n <= 200",
        "dynamic land additions"
      ],
      "examples": [
        {
          "in": "m=3,n=3, positions=[[0,0],[0,1],[1,2],[2,1]]",
          "out": "[1,1,2,3]"
        }
      ],
      "approaches": [
        {
          "name": "Union-Find per add",
          "time": "O(k α(mn))",
          "space": "O(mn)",
          "code": "vector<int> numIslands2(int m, int n, vector<vector<int>>& pos) {\n    vector<int> par(m*n,-1), rnk(m*n), ans; int islands=0;\n    function<int(int)> find=[&](int x){ return par[x]==x? x: par[x]=find(par[x]); };\n    int dr[4]={1,-1,0,0}, dc[4]={0,0,1,-1};\n    for(auto& p:pos){ int idx=p[0]*n+p[1]; if(par[idx]!=-1){ ans.push_back(islands); continue; }\n        par[idx]=idx; rnk[idx]=0; islands++;\n        for(int k=0;k<4;k++){ int nr=p[0]+dr[k], nc=p[1]+dc[k], nidx=nr*n+nc;\n            if(nr>=0&&nr<m&&nc>=0&&nc<n&&par[nidx]!=-1){\n                int a=find(idx), b=find(nidx); if(a!=b){ if(rnk[a]<rnk[b]) swap(a,b); par[b]=a; if(rnk[a]==rnk[b]) rnk[a]++; islands--; }\n            }\n        } ans.push_back(islands);\n    } return ans;\n}"
        }
      ],
      "description": "Given input per constraints, solve: Number of Islands II.",
      "summary": "Union-Find per add — Disjoint set: find with path compression, union by rank/size."
    },
    {
      "id": "graph-044",
      "title": "Regions Cut By Slashes",
      "lc": 959,
      "importance": "nice",
      "subtopic": "union-find",
      "difficulty": "Medium",
      "constraints": [
        "grid.length == n",
        " '/', '\\', ' ' cells"
      ],
      "examples": [
        {
          "in": "grid=[\"/\\\\\",\"\\\\/\"]",
          "out": "regions count"
        }
      ],
      "approaches": [
        {
          "name": "Expand to 4x4 cells + UF",
          "time": "O(n^2 α(n))",
          "space": "O(n^2)",
          "code": "int regionsBySlashes(vector<string>& grid) {\n    int n=grid.size(), N=3*n; vector<int> par(N*N); iota(par.begin(),par.end(),0);\n    function<int(int)> find=[&](int x){ return par[x]==x? x: par[x]=find(par[x]); };\n    auto unite=[&](int a,int b){ a=find(a); b=find(b); if(a!=b) par[a]=b; };\n    auto id=[&](int r,int c){ return r*N+c; };\n    for(int i=0;i<n;i++) for(int j=0;j<n;j++){\n        int r=3*i, c=3*j;\n        if(grid[i][j]==' '){ unite(id(r+1,c+1),id(r+1,c+2)); unite(id(r+1,c+1),id(r+2,c+1)); }\n        else if(grid[i][j]=='/'){ unite(id(r,c+2),id(r+1,c+1)); unite(id(r+1,c+1),id(r+2,c)); }\n        else { unite(id(r,c),id(r+1,c+1)); unite(id(r+1,c+1),id(r+2,c+2)); }\n        if(i) unite(id(r,c+1),id(r-1,c+1));\n        if(j) unite(id(r+1,c),id(r+1,c-1));\n    }\n    unordered_set<int> roots; for(int i=0;i<N*N;i++) roots.insert(find(i));\n    return (int)roots.size();\n}"
        }
      ],
      "description": "Given input per constraints, solve: Regions Cut By Slashes.",
      "summary": "Expand to 4x4 cells + UF — Disjoint set: find with path compression, union by rank/size."
    },
    {
      "id": "graph-045",
      "title": "Longest Increasing Path in a Matrix",
      "lc": 329,
      "importance": "must",
      "subtopic": "dfs-advanced",
      "difficulty": "Hard",
      "constraints": [
        "m, n <= 200",
        "strictly increasing paths"
      ],
      "examples": [
        {
          "in": "matrix=[[9,9,4],[6,6,8],[2,1,1]]",
          "out": "4"
        }
      ],
      "approaches": [
        {
          "name": "DFS + memoization",
          "time": "O(mn)",
          "space": "O(mn)",
          "code": "int dfs(vector<vector<int>>& m, vector<vector<int>>& dp, int r, int c) {\n    if(dp[r][c]) return dp[r][c];\n    int best=1, dr[4]={1,-1,0,0}, dc[4]={0,0,1,-1};\n    for(int k=0;k<4;k++){ int nr=r+dr[k], nc=c+dc[k];\n        if(nr>=0&&nc>=0&&nr<(int)m.size()&&nc<(int)m[0].size()&&m[nr][nc]>m[r][c])\n            best=max(best, 1+dfs(m,dp,nr,nc));\n    } return dp[r][c]=best;\n}\nint longestIncreasingPath(vector<vector<int>>& matrix) {\n    if(matrix.empty()) return 0;\n    int m=matrix.size(), n=matrix[0].size(), ans=0;\n    vector<vector<int>> dp(m, vector<int>(n));\n    for(int i=0;i<m;i++) for(int j=0;j<n;j++) ans=max(ans, dfs(matrix,dp,i,j));\n    return ans;\n}"
        }
      ],
      "description": "Compute the longest increasing path in a matrix over the given input per constraints.",
      "summary": "Return cached dfs(state) — top-down DP on graph/grid."
    }
  ]
};
