from _helpers import q, ex, approach

# ---- reusable C++ snippets ----
BFS_ISLANDS = """
int numIslands(vector<vector<char>>& grid) {
    int m = grid.size(), n = grid[0].size(), ans = 0;
    int dr[4] = {1,-1,0,0}, dc[4] = {0,0,1,-1};
    for (int i = 0; i < m; i++) for (int j = 0; j < n; j++) {
        if (grid[i][j] != '1') continue;
        ans++;
        queue<pair<int,int>> qu;
        qu.push({i,j}); grid[i][j] = '0';
        while (!qu.empty()) {
            auto p = qu.front(); qu.pop();
            for (int k = 0; k < 4; k++) {
                int r = p.first + dr[k], c = p.second + dc[k];
                if (r>=0 && r<m && c>=0 && c<n && grid[r][c]=='1') {
                    grid[r][c] = '0'; qu.push({r,c});
                }
            }
        }
    }
    return ans;
}"""

DFS_ISLANDS = """
int dfs(vector<vector<char>>& g, int r, int c) {
    if (r<0||c<0||r>=(int)g.size()||c>=(int)g[0].size()||g[r][c]!='1') return 0;
    g[r][c] = '0';
    return 1 + dfs(g,r+1,c)+dfs(g,r-1,c)+dfs(g,r,c+1)+dfs(g,r,c-1);
}
int numIslands(vector<vector<char>>& grid) {
    int ans = 0;
    for (int i = 0; i < (int)grid.size(); i++)
        for (int j = 0; j < (int)grid[0].size(); j++)
            if (grid[i][j]=='1') ans += dfs(grid,i,j)>0;
    return ans;
}"""

GRAPH_QUESTIONS = [
    q("graph-001", "Number of Islands", 200, "must", "bfs-dfs", "Medium",
      ["m == grid.length", "n == grid[i].length", "grid[i][j] is '0' or '1'"],
      [ex("grid = [[\"1\",\"1\",\"0\"],[\"0\",\"1\",\"0\"],[\"1\",\"0\",\"0\"]]", "1")],
      [approach("BFS flood fill", "O(mn)", "O(mn)", BFS_ISLANDS),
       approach("DFS flood fill", "O(mn)", "O(mn) stack/recursion", DFS_ISLANDS)]),

    q("graph-002", "Max Area of Island", 695, "must", "bfs-dfs", "Medium",
      ["m, n <= 50", "grid[i][j] is 0 or 1"],
      [ex("grid = [[0,0,1,0],[0,1,1,0],[0,1,0,0]]", "4")],
      [approach("BFS with area count", "O(mn)", "O(mn)", """
int maxAreaOfIsland(vector<vector<int>>& grid) {
    int m=grid.size(), n=grid[0].size(), best=0, dr[4]={1,-1,0,0}, dc[4]={0,0,1,-1};
    for (int i=0;i<m;i++) for (int j=0;j<n;j++) if (grid[i][j]) {
        int area=0; queue<pair<int,int>> qu; qu.push({i,j}); grid[i][j]=0;
        while(!qu.empty()){ auto p=qu.front(); qu.pop(); area++;
            for(int k=0;k<4;k++){ int r=p.first+dr[k], c=p.second+dc[k];
                if(r>=0&&r<m&&c>=0&&c<n&&grid[r][c]){ grid[r][c]=0; qu.push({r,c}); } }
        } best=max(best,area);
    } return best;
}""")]),

    q("graph-003", "Flood Fill", 733, "should", "bfs-dfs", "Easy",
      ["m, n <= 50", "0 <= sr < m", "0 <= sc < n"],
      [ex("image=[[1,1,1],[1,1,0],[1,0,1]], sr=1, sc=1, color=2", "[[2,2,2],[2,2,0],[2,0,1]]")],
      [approach("DFS/BFS from seed", "O(mn)", "O(mn)", """
vector<vector<int>> floodFill(vector<vector<int>>& img, int sr, int sc, int color) {
    int m=img.size(), n=img[0].size(), old=img[sr][sc];
    if (old==color) return img;
    function<void(int,int)> dfs = [&](int r,int c){
        if(r<0||c<0||r>=m||c>=n||img[r][c]!=old) return;
        img[r][c]=color; dfs(r+1,c); dfs(r-1,c); dfs(r,c+1); dfs(r,c-1);
    };
    dfs(sr,sc); return img;
}""")]),

    q("graph-004", "Rotting Oranges", 994, "must", "bfs-dfs", "Medium",
      ["2 <= m, n <= 10", "grid[i][j] in {0,1,2}"],
      [ex("grid=[[2,1,1],[1,1,0],[0,1,1]]", "4")],
      [approach("Multi-source BFS", "O(mn)", "O(mn)", """
int orangesRotting(vector<vector<int>>& grid) {
    int m=grid.size(), n=grid[0].size(), fresh=0, ans=0;
    queue<pair<int,int>> q;
    for(int i=0;i<m;i++) for(int j=0;j<n;j++)
        if(grid[i][j]==2) q.push({i,j}); else if(grid[i][j]==1) fresh++;
    int dr[4]={1,-1,0,0}, dc[4]={0,0,1,-1};
    while(!q.empty() && fresh){ int sz=q.size(); ans++;
        while(sz--){ auto p=q.front(); q.pop();
            for(int k=0;k<4;k++){ int r=p.first+dr[k], c=p.second+dc[k];
                if(r>=0&&r<m&&c>=0&&c<n&&grid[r][c]==1){ grid[r][c]=2; fresh--; q.push({r,c}); }
            }
        }
    } return fresh? -1: ans;
}""")]),

    q("graph-005", "01 Matrix", 542, "must", "bfs-dfs", "Medium",
      ["m, n <= 10^4", "at least one 0 in mat"],
      [ex("mat=[[0,0,0],[1,1,0],[1,1,0]]", "[[0,0,0],[1,1,0],[2,2,1]]")],
      [approach("Multi-source BFS from zeros", "O(mn)", "O(mn)", """
vector<vector<int>> updateMatrix(vector<vector<int>>& mat) {
    int m=mat.size(), n=mat[0].size(); const int INF=1e9;
    queue<pair<int,int>> q;
    for(int i=0;i<m;i++) for(int j=0;j<n;j++)
        if(mat[i][j]==0) q.push({i,j}); else mat[i][j]=INF;
    int dr[4]={1,-1,0,0}, dc[4]={0,0,1,-1};
    while(!q.empty()){ auto p=q.front(); q.pop();
        for(int k=0;k<4;k++){ int r=p.first+dr[k], c=p.second+dc[k];
            if(r>=0&&r<m&&c>=0&&c<n && mat[r][c]>mat[p.first][p.second]+1){
                mat[r][c]=mat[p.first][p.second]+1; q.push({r,c});
            }
        }
    } return mat;
}""")]),

    q("graph-006", "Shortest Path in Binary Matrix", 1091, "must", "bfs-dfs", "Medium",
      ["n == grid.length", "grid[0][0] == 0", "8-directional moves"],
      [ex("grid=[[0,1],[1,0]]", "2")],
      [approach("BFS 8-neighbors", "O(n^2)", "O(n^2)", """
int shortestPathBinaryMatrix(vector<vector<int>>& grid) {
    int n=grid.size(); if(!grid[0][0]||!grid[n-1][n-1]) return -1;
    if(n==1) return 1;
    queue<pair<int,int>> q; q.push({0,0}); grid[0][0]=1; int steps=1;
    int dr[8]={-1,-1,-1,0,0,1,1,1}, dc[8]={-1,0,1,-1,1,-1,0,1};
    while(!q.empty()){ int sz=q.size(); steps++;
        while(sz--){ auto p=q.front(); q.pop();
            for(int k=0;k<8;k++){ int r=p.first+dr[k], c=p.second+dc[k];
                if(r>=0&&r<n&&c>=0&&c<n&&grid[r][c]==0){
                    if(r==n-1&&c==n-1) return steps;
                    grid[r][c]=1; q.push({r,c});
                }
            }
        }
    } return -1;
}""")]),

    q("graph-007", "Word Ladder", 127, "must", "bfs-dfs", "Hard",
      ["1 <= wordList.length <= 5000", "all words same length"],
      [ex("beginWord=\"hit\", endWord=\"cog\", wordList=[\"hot\",\"dot\",\"dog\",\"lot\",\"log\",\"cog\"]", "5",
         "hit -> hot -> dot -> dog -> cog")],
      [approach("BFS on implicit graph", "O(N * L^2)", "O(N)", """
int ladderLength(string begin, string end, vector<string>& words) {
    unordered_set<string> dict(words.begin(), words.end());
    if(!dict.count(end)) return 0;
    queue<string> q; q.push(begin); int steps=1;
    while(!q.empty()){ int sz=q.size(); steps++;
        while(sz--){ string w=q.front(); q.pop();
            for(int i=0;i<(int)w.size();i++){
                char orig=w[i];
                for(char c='a';c<='z';c++){ w[i]=c;
                    if(w==end) return steps;
                    if(dict.count(w)){ dict.erase(w); q.push(w); }
                } w[i]=orig;
            }
        }
    } return 0;
}""")]),

    q("graph-008", "Open the Lock", 752, "should", "bfs-dfs", "Medium",
      ["deadends.length <= 500", "4-wheel lock, 0000 start"],
      [ex("deadends=[\"0201\",\"0101\"], target=\"0202\"", "6")],
      [approach("BFS on state space", "O(10^4)", "O(10^4)", """
int openLock(vector<string>& dead, string target) {
    unordered_set<string> bad(dead.begin(), dead.end());
    if(bad.count("0000")) return -1;
    queue<string> q; q.push("0000"); unordered_set<string> seen={"0000"}; int steps=0;
    while(!q.empty()){ int sz=q.size();
        while(sz--){ string s=q.front(); q.pop();
            if(s==target) return steps;
            for(int i=0;i<4;i++) for(int d:-1,1) if(d) {
                string t=s; t[i]=((t[i]-'0'+d+10)%10)+'0';
                if(!seen.count(t) && !bad.count(t)){ seen.insert(t); q.push(t); }
            }
        } steps++;
    } return -1;
}""")]),

    q("graph-009", "Pacific Atlantic Water Flow", 417, "must", "bfs-dfs", "Medium",
      ["m, n <= 200", "heights[i][j] >= 0"],
      [ex("heights=[[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]",
         "[[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]")],
      [approach("DFS/BFS from both oceans", "O(mn)", "O(mn)", """
void dfs(vector<vector<int>>& h, vector<vector<int>>& vis, int r, int c, int prev) {
    int m=h.size(), n=h[0].size();
    if(r<0||c<0||r>=m||c>=n||vis[r][c]||h[r][c]<prev) return;
    vis[r][c]=1;
    dfs(h,vis,r+1,c,h[r][c]); dfs(h,vis,r-1,c,h[r][c]);
    dfs(h,vis,r,c+1,h[r][c]); dfs(h,vis,r,c-1,h[r][c]);
}
vector<vector<int>> pacificAtlantic(vector<vector<int>>& heights) {
    int m=heights.size(), n=heights[0].size();
    vector<vector<int>> pac(m, vector<int>(n)), atl(m, vector<int>(n));
    for(int i=0;i<m;i++){ dfs(heights,pac,i,0,0); dfs(heights,atl,i,n-1,0); }
    for(int j=0;j<n;j++){ dfs(heights,pac,0,j,0); dfs(heights,atl,m-1,j,0); }
    vector<vector<int>> ans;
    for(int i=0;i<m;i++) for(int j=0;j<n;j++)
        if(pac[i][j]&&atl[i][j]) ans.push_back({i,j});
    return ans;
}""")]),

    q("graph-010", "Surrounded Regions", 130, "should", "bfs-dfs", "Medium",
      ["m, n <= 200", "board[i][j] is 'X' or 'O'"],
      [ex("board=[[\"X\",\"X\",\"X\"],[\"X\",\"O\",\"X\"],[\"X\",\"X\",\"X\"]]",
         "[[\"X\",\"X\",\"X\"],[\"X\",\"X\",\"X\"],[\"X\",\"X\",\"X\"]]")],
      [approach("DFS from border O's", "O(mn)", "O(mn)", """
void dfs(vector<vector<char>>& b, int r, int c) {
    int m=b.size(), n=b[0].size();
    if(r<0||c<0||r>=m||c>=n||b[r][c]!='O') return;
    b[r][c]='T';
    dfs(b,r+1,c); dfs(b,r-1,c); dfs(b,r,c+1); dfs(b,r,c-1);
}
void solve(vector<vector<char>>& board) {
    int m=board.size(), n=board[0].size();
    for(int i=0;i<m;i++){ dfs(board,i,0); dfs(board,i,n-1); }
    for(int j=0;j<n;j++){ dfs(board,0,j); dfs(board,m-1,j); }
    for(int i=0;i<m;i++) for(int j=0;j<n;j++)
        board[i][j] = board[i][j]=='T' ? 'O' : 'X';
}""")]),

    q("graph-011", "Number of Enclaves", 1020, "nice", "bfs-dfs", "Medium",
      ["m, n <= 500", "grid[i][j] is 0 or 1"],
      [ex("grid=[[0,0,0,0,0],[1,1,1,1,0],[0,1,0,0,0]]", "3")],
      [approach("Mark border-connected land", "O(mn)", "O(mn)", """
void dfs(vector<vector<int>>& g,int r,int c){ if(r<0||c<0||r>=(int)g.size()||c>=(int)g[0].size()||!g[r][c]) return; g[r][c]=0; dfs(g,r+1,c);dfs(g,r-1,c);dfs(g,r,c+1);dfs(g,r,c-1);}
int numEnclaves(vector<vector<int>>& grid) {
    int m=grid.size(), n=grid[0].size();
    for(int i=0;i<m;i++){ dfs(grid,i,0); dfs(grid,i,n-1); }
    for(int j=0;j<n;j++){ dfs(grid,0,j); dfs(grid,m-1,j); }
    int ans=0; for(int i=0;i<m;i++) for(int j=0;j<n;j++) if(grid[i][j]) ans++;
    return ans;
}""")]),

    q("graph-012", "Keys and Rooms", 841, "should", "bfs-dfs", "Medium",
      ["n == rooms.length", "1 <= rooms[i].length <= 1000"],
      [ex("rooms=[[1],[2],[3],[]]", "true")],
      [approach("DFS reachability", "O(V+E)", "O(V)", """
bool canVisitAllRooms(vector<vector<int>>& rooms) {
    int n=rooms.size(); vector<int> vis(n);
    function<void(int)> dfs=[&](int u){ vis[u]=1; for(int v:rooms[u]) if(!vis[v]) dfs(v); };
    dfs(0); return count(vis.begin(),vis.end(),1)==n;
}""")]),

    q("graph-013", "Course Schedule", 207, "must", "topo", "Medium",
      ["1 <= numCourses <= 2000", "0 <= prerequisites.length <= 5000"],
      [ex("numCourses=2, prerequisites=[[1,0]]", "true")],
      [approach("Kahn's BFS topo", "O(V+E)", "O(V+E)", """
bool canFinish(int n, vector<vector<int>>& pre) {
    vector<vector<int>> g(n); vector<int> indeg(n);
    for(auto& e:pre){ g[e[1]].push_back(e[0]); indeg[e[0]]++; }
    queue<int> q; for(int i=0;i<n;i++) if(!indeg[i]) q.push(i);
    int seen=0;
    while(!q.empty()){ int u=q.front(); q.pop(); seen++;
        for(int v:g[u]) if(--indeg[v]==0) q.push(v);
    } return seen==n;
}"""),
       approach("3-color DFS cycle detect", "O(V+E)", "O(V)", """
bool canFinish(int n, vector<vector<int>>& pre) {
    vector<vector<int>> g(n); for(auto& e:pre) g[e[1]].push_back(e[0]);
    vector<int> color(n);
    function<bool(int)> dfs=[&](int u){
        color[u]=1;
        for(int v:g[u]){ if(color[v]==1) return false; if(!color[v]&&!dfs(v)) return false; }
        color[u]=2; return true;
    };
    for(int i=0;i<n;i++) if(!color[i]&&!dfs(i)) return false;
    return true;
}""")]),

    q("graph-014", "Course Schedule II", 210, "must", "topo", "Medium",
      ["same as LC 207", "return any valid order or []"],
      [ex("numCourses=4, prerequisites=[[1,0],[2,0],[3,1],[3,2]]", "[0,1,2,3] or [0,2,1,3]")],
      [approach("Kahn's topo order", "O(V+E)", "O(V+E)", """
vector<int> findOrder(int n, vector<vector<int>>& pre) {
    vector<vector<int>> g(n); vector<int> indeg(n);
    for(auto& e:pre){ g[e[1]].push_back(e[0]); indeg[e[0]]++; }
    queue<int> q; for(int i=0;i<n;i++) if(!indeg[i]) q.push(i);
    vector<int> order;
    while(!q.empty()){ int u=q.front(); q.pop(); order.push_back(u);
        for(int v:g[u]) if(--indeg[v]==0) q.push(v);
    } return (int)order.size()==n ? order : vector<int>{};
}""")]),

    q("graph-015", "Alien Dictionary", 269, "should", "topo", "Hard",
      ["1 <= words.length <= 100", "words[i] lowercase English"],
      [ex("words=[\"wrt\",\"wrf\",\"er\",\"ett\",\"rftt\"]", "\"wertf\"")],
      [approach("Build graph + topo sort", "O(C) chars total", "O(1) alphabet", """
string alienOrder(vector<string>& words) {
    unordered_map<char, unordered_set<char>> g;
    unordered_map<char,int> indeg;
    for(auto& w:words) for(char c:w) indeg[c]=0;
    for(int i=0;i+1<(int)words.size();i++){
        string& a=words[i], &b=words[i+1];
        if(a.size()>b.size() && a.substr(0,b.size())==b) return "";
        for(int j=0;j<(int)min(a.size(),b.size());j++)
            if(a[j]!=b[j]){ g[b[j]].insert(a[j]); indeg[a[j]]++; break; }
    }
    queue<char> q; for(auto& p:indeg) if(!p.second) q.push(p.first);
    string ans;
    while(!q.empty()){ char u=q.front(); q.pop(); ans+=u;
        for(char v:g[u]) if(--indeg[v]==0) q.push(v);
    } return ans.size()==indeg.size()? ans : "";
}""")]),

    q("graph-016", "Minimum Height Trees", 310, "should", "topo", "Medium",
      ["1 <= n <= 2*10^4", "tree with n nodes"],
      [ex("n=6, edges=[[3,0],[3,1],[3,2],[3,4],[5,2]]", "[3] or [4]")],
      [approach("Leaf pruning (topo)", "O(n)", "O(n)", """
vector<int> findMinHeightTrees(int n, vector<vector<int>>& edges) {
    if(n<=2){ vector<int> ans(n); iota(ans.begin(),ans.end(),0); return ans; }
    vector<int> deg(n); vector<vector<int>> g(n);
    for(auto& e:edges){ g[e[0]].push_back(e[1]); g[e[1]].push_back(e[0]); deg[e[0]]++; deg[e[1]]++; }
    queue<int> q; for(int i=0;i<n;i++) if(deg[i]==1) q.push(i);
    int rem=n;
    while(rem>2){ int sz=q.size(); rem-=sz;
        while(sz--){ int u=q.front(); q.pop();
            for(int v:g[u]) if(--deg[v]==1) q.push(v);
        }
    } vector<int> ans; while(!q.empty()) ans.push_back(q.front()), q.pop();
    return ans;
}""")]),

    q("graph-017", "Course Schedule IV", 1462, "nice", "topo", "Medium",
      ["1 <= numCourses <= 100", "transitive prerequisite queries"],
      [ex("n=2, relations=[[1,0]], queries=[[0,1],[1,0]]", "[false,true]")],
      [approach("Floyd or DFS reachability", "O(n^3) or O(n*(V+E))", "O(n^2)", """
vector<bool> checkIfPrerequisite(int n, vector<vector<int>>& rel, vector<vector<int>>& q) {
    vector<vector<int>> reach(n, vector<int>(n));
    for(auto& e:rel) reach[e[0]][e[1]]=1;
    for(int k=0;k<n;k++) for(int i=0;i<n;i++) for(int j=0;j<n;j++)
        reach[i][j]|=reach[i][k]&reach[k][j];
    vector<bool> ans; for(auto& qq:q) ans.push_back(reach[qq[0]][qq[1]]);
    return ans;
}""")]),

    q("graph-018", "Clone Graph", 133, "must", "dfs-advanced", "Medium",
      ["Node val unique", "no self loops"],
      [ex("adjList = [[2,4],[1,3],[2,4],[1,3]]", "deep copy of graph")],
      [approach("DFS + hash map", "O(V+E)", "O(V)", """
Node* cloneGraph(Node* node) {
    if(!node) return nullptr;
    unordered_map<Node*,Node*> mp;
    function<Node*(Node*)> dfs=[&](Node* u){
        if(mp.count(u)) return mp[u];
        Node* copy=new Node(u->val);
        mp[u]=copy;
        for(Node* v:u->neighbors) copy->neighbors.push_back(dfs(v));
        return copy;
    };
    return dfs(node);
}""")]),

    q("graph-019", "Is Graph Bipartite?", 785, "must", "dfs-advanced", "Medium",
      ["1 <= n <= 100", "undirected graph"],
      [ex("graph=[[1,2,3],[0,2],[0,1,3],[0,2]]", "false")],
      [approach("BFS 2-coloring", "O(V+E)", "O(V)", """
bool isBipartite(vector<vector<int>>& graph) {
    int n=graph.size(); vector<int> color(n,-1);
    for(int s=0;s<n;s++) if(color[s]==-1){
        queue<int> q; q.push(s); color[s]=0;
        while(!q.empty()){ int u=q.front(); q.pop();
            for(int v:graph[u]){
                if(color[v]==-1){ color[v]=color[u]^1; q.push(v); }
                else if(color[v]==color[u]) return false;
            }
        }
    } return true;
}""")]),

    q("graph-020", "Critical Connections", 1192, "should", "dfs-advanced", "Hard",
      ["2 <= n <= 10^5", "tree + one extra edge => one bridge"],
      [ex("n=4, connections=[[0,1],[1,2],[2,0],[1,3]]", "[[1,3]]")],
      [approach("Tarjan bridges", "O(V+E)", "O(V+E)", """
void tarjan(int u, int p, vector<vector<int>>& g, vector<int>& disc, vector<int>& low, vector<vector<int>>& res, int& timer) {
    disc[u]=low[u]=++timer;
    for(int v:g[u]) if(v!=p){
        if(!disc[v]){ tarjan(v,u,g,disc,low,res,timer); low[u]=min(low[u],low[v]);
            if(low[v]>disc[u]) res.push_back({min(u,v),max(u,v)});
        } else low[u]=min(low[u],disc[v]);
    }
}
vector<vector<int>> criticalConnections(int n, vector<vector<int>>& con) {
    vector<vector<int>> g(n); for(auto& e:con){ g[e[0]].push_back(e[1]); g[e[1]].push_back(e[0]); }
    vector<int> disc(n), low(n); vector<vector<int>> res; int timer=0;
    tarjan(0,-1,g,disc,low,res,timer); return res;
}""")]),

    q("graph-021", "All Paths From Source to Target", 797, "should", "dfs-advanced", "Medium",
      ["n <= 15", "DAG"],
      [ex("graph=[[1,2],[3],[3],[]]", "[[0,1,3],[0,2,3]]")],
      [approach("Backtracking DFS", "O(2^n)", "O(n)", """
void dfs(vector<vector<int>>& g, int u, int t, vector<int>& path, vector<vector<int>>& ans) {
    if(u==t){ ans.push_back(path); return; }
    for(int v:g[u]){ path.push_back(v); dfs(g,v,t,path,ans); path.pop_back(); }
}
vector<vector<int>> allPathsSourceTarget(vector<vector<int>>& graph) {
    vector<vector<int>> ans; vector<int> path={0};
    dfs(graph,0,(int)graph.size()-1,path,ans); return ans;
}""")]),

    q("graph-022", "Evaluate Division", 399, "must", "dfs-advanced", "Medium",
      ["2 <= equations.length <= 20", "queries reference known pairs"],
      [ex("equations=[[\"a\",\"b\"]], values=[2.0], queries=[[\"a\",\"b\"],[\"b\",\"a\"]]", "[2.0,0.5]")],
      [approach("Build weighted graph + DFS", "O(Q*(V+E))", "O(V+E)", """
double dfs(string cur, string target, unordered_map<string, vector<pair<string,double>>>& g, unordered_set<string>& vis) {
    if(!g.count(cur)) return -1.0;
    if(cur==target) return 1.0;
    vis.insert(cur);
    for(auto& p:g[cur]) if(!vis.count(p.first)){
        double sub=dfs(p.first,target,g,vis);
        if(sub>=0) return sub*p.second;
    } return -1.0;
}
vector<double> calcEquation(vector<vector<string>>& eq, vector<double>& val, vector<vector<string>>& q) {
    unordered_map<string, vector<pair<string,double>>> g;
    for(int i=0;i<(int)eq.size();i++){ g[eq[i][0]].push_back({eq[i][1],val[i]}); g[eq[i][1]].push_back({eq[i][0],1.0/val[i]}); }
    vector<double> ans;
    for(auto& qq:q){ unordered_set<string> vis; ans.push_back(dfs(qq[0],qq[1],g,vis)); }
    return ans;
}""")]),

    q("graph-023", "Reconstruct Itinerary", 332, "should", "dfs-advanced", "Hard",
      ["1 <= tickets.length <= 300", "use all tickets once"],
      [ex("tickets=[[\"MUC\",\"LHR\"],[\"JFK\",\"MUC\"]]", "[\"JFK\",\"MUC\",\"LHR\"]")],
      [approach("Hierholzer Eulerian path", "O(E log E)", "O(E)", """
vector<string> findItinerary(vector<vector<string>>& tickets) {
    unordered_map<string, multiset<string>> g;
    for(auto& t:tickets) g[t[0]].insert(t[1]);
    vector<string> route;
    function<void(string)> dfs=[&](string u){
        while(g[u].size()){ string v=*g[u].begin(); g[u].erase(g[u].begin()); dfs(v); }
        route.push_back(u);
    };
    dfs("JFK"); reverse(route.begin(),route.end()); return route;
}""")]),

    q("graph-024", "Possible Bipartition", 886, "should", "dfs-advanced", "Medium",
      ["1 <= n <= 2000", "dislikes are undirected edges"],
      [ex("n=4, dislikes=[[1,2],[1,3],[2,4]]", "true")],
      [approach("2-color each component", "O(V+E)", "O(V+E)", """
bool possibleBipartition(int n, vector<vector<int>>& dislikes) {
    vector<vector<int>> g(n+1);
    for(auto& e:dislikes){ g[e[0]].push_back(e[1]); g[e[1]].push_back(e[0]); }
    vector<int> color(n+1,-1);
    for(int s=1;s<=n;s++) if(color[s]==-1){
        queue<int> q; q.push(s); color[s]=0;
        while(!q.empty()){ int u=q.front(); q.pop();
            for(int v:g[u]){ if(color[v]==-1){ color[v]=color[u]^1; q.push(v); }
                else if(color[v]==color[u]) return false; }
        }
    } return true;
}""")]),

    q("graph-025", "Network Delay Time", 743, "must", "shortest-path", "Medium",
      ["1 <= n <= 100", "non-negative edge weights"],
      [ex("times=[[2,1,1],[2,3,1],[3,4,1]], n=4, k=2", "2")],
      [approach("Dijkstra min-heap", "O(E log V)", "O(V+E)", """
int networkDelayTime(vector<vector<int>>& times, int n, int k) {
    vector<vector<pair<int,int>>> g(n+1);
    for(auto& t:times) g[t[0]].push_back({t[1],t[2]});
    const int INF=1e9; vector<int> dist(n+1,INF); dist[k]=0;
    priority_queue<pair<int,int>, vector<pair<int,int>>, greater<pair<int,int>>> pq;
    pq.push({0,k});
    while(!pq.empty()){ auto p=pq.top(); pq.pop();
        if(p.first>dist[p.second]) continue;
        for(auto& e:g[p.second]) if(dist[e.first]>p.first+e.second){
            dist[e.first]=p.first+e.second; pq.push({dist[e.first],e.first});
        }
    } int ans=*max_element(dist.begin()+1,dist.end());
    return ans>=INF? -1: ans;
}""")]),

    q("graph-026", "Cheapest Flights Within K Stops", 787, "must", "shortest-path", "Medium",
      ["1 <= n <= 100", "at most k stops"],
      [ex("n=3, flights=[[0,1,100],[1,2,100],[0,2,500]], src=0, dst=2, k=1", "200")],
      [approach("Bellman-Ford k+1 relaxations", "O(k*E)", "O(V)", """
int findCheapestPrice(int n, vector<vector<int>>& flights, int src, int dst, int k) {
    const int INF=1e9; vector<int> dist(n,INF); dist[src]=0;
    for(int i=0;i<=k;i++){
        vector<int> tmp=dist;
        for(auto& f:flights) if(dist[f[0]]<INF)
            tmp[f[1]]=min(tmp[f[1]], dist[f[0]]+f[2]);
        dist.swap(tmp);
    } return dist[dst]>=INF? -1: dist[dst];
}"""),
       approach("Modified Dijkstra (stops state)", "O(E log V)", "O(V)", """
int findCheapestPrice(int n, vector<vector<int>>& flights, int src, int dst, int k) {
    vector<vector<pair<int,int>>> g(n);
    for(auto& f:flights) g[f[0]].push_back({f[1],f[2]});
    vector<int> best(n,INT_MAX);
    priority_queue<tuple<int,int,int>, vector<tuple<int,int,int>>, greater<>> pq;
    pq.push({0,src,k+1});
    while(!pq.empty()){ auto [cost,u,stops]=pq.top(); pq.pop();
        if(u==dst) return cost; if(stops==0) continue;
        for(auto& e:g[u]) if(cost+e.second<best[e.first]){
            best[e.first]=cost+e.second; pq.push({cost+e.second,e.first,stops-1});
        }
    } return -1;
}""")]),

    q("graph-027", "Path with Minimum Effort", 1631, "should", "shortest-path", "Medium",
      ["m, n <= 200", "effort = max absolute diff on path"],
      [ex("heights=[[1,2,2],[3,8,2],[5,3,5]]", "2")],
      [approach("Dijkstra on effort", "O(mn log mn)", "O(mn)", """
int minimumEffortPath(vector<vector<int>>& h) {
    int m=h.size(), n=h[0].size(); vector<vector<int>> dist(m, vector<int>(n,INT_MAX));
    priority_queue<tuple<int,int,int>, vector<tuple<int,int,int>>, greater<>> pq;
    pq.push({0,0,0}); dist[0][0]=0;
    int dr[4]={1,-1,0,0}, dc[4]={0,0,1,-1};
    while(!pq.empty()){ auto [e,r,c]=pq.top(); pq.pop();
        if(r==m-1&&c==n-1) return e;
        for(int k=0;k<4;k++){ int nr=r+dr[k], nc=c+dc[k];
            if(nr<0||nc<0||nr>=m||nc>=n) continue;
            int ne=max(e, abs(h[nr][nc]-h[r][c]));
            if(ne<dist[nr][nc]){ dist[nr][nc]=ne; pq.push({ne,nr,nc}); }
        }
    } return 0;
}""")]),

    q("graph-028", "Find the City With Smallest Reach", 1334, "should", "shortest-path", "Medium",
      ["1 <= n <= 100", "threshold distance"],
      [ex("n=4, edges=..., distanceThreshold=4", "3")],
      [approach("Floyd-Warshall", "O(n^3)", "O(n^2)", """
int findTheCity(int n, vector<vector<int>>& edges, int T) {
    const int INF=1e9; vector<vector<int>> d(n, vector<int>(n,INF));
    for(int i=0;i<n;i++) d[i][i]=0;
    for(auto& e:edges){ d[e[0]][e[1]]=e[2]; d[e[1]][e[0]]=e[2]; }
    for(int k=0;k<n;k++) for(int i=0;i<n;i++) for(int j=0;j<n;j++)
        if(d[i][k]<INF && d[k][j]<INF) d[i][j]=min(d[i][j], d[i][k]+d[k][j]);
    int bestCity=-1, bestCnt=INT_MAX;
    for(int i=0;i<n;i++){ int cnt=0; for(int j=0;j<n;j++) if(d[i][j]<=T) cnt++;
        if(cnt<=bestCnt){ bestCnt=cnt; bestCity=i; }
    } return bestCity;
}""")]),

    q("graph-029", "Swim in Rising Water", 778, "should", "shortest-path", "Hard",
      ["n <= 50", "minimize max elevation on path"],
      [ex("grid=[[0,2],[1,3]]", "3")],
      [approach("Dijkstra / binary search + BFS", "O(n^2 log n)", "O(n^2)", """
int swimInWater(vector<vector<int>>& grid) {
    int n=grid.size(); vector<vector<int>> dist(n, vector<int>(n,INT_MAX));
    priority_queue<tuple<int,int,int>, vector<tuple<int,int,int>>, greater<>> pq;
    pq.push({grid[0][0],0,0}); dist[0][0]=grid[0][0];
    int dr[4]={1,-1,0,0}, dc[4]={0,0,1,-1};
    while(!pq.empty()){ auto [t,r,c]=pq.top(); pq.pop();
        if(r==n-1&&c==n-1) return t;
        for(int k=0;k<4;k++){ int nr=r+dr[k], nc=c+dc[k];
            if(nr<0||nc<0||nr>=n||nc>=n) continue;
            int nt=max(t, grid[nr][nc]);
            if(nt<dist[nr][nc]){ dist[nr][nc]=nt; pq.push({nt,nr,nc}); }
        }
    } return -1;
}""")]),

    q("graph-030", "Minimum Obstacle Removal to Reach Corner", 2290, "nice", "shortest-path", "Hard",
      ["m, n <= 10^3", "0-1 BFS on grid"],
      [ex("grid with 0 free / 1 obstacle", "minimum removals")],
      [approach("0-1 BFS", "O(mn)", "O(mn)", """
int minimumObstacles(vector<vector<int>>& grid) {
    int m=grid.size(), n=grid[0].size();
    vector<vector<int>> dist(m, vector<int>(n,INT_MAX));
    deque<pair<int,int>> dq; dq.push_front({0,0}); dist[0][0]=0;
    int dr[4]={1,-1,0,0}, dc[4]={0,0,1,-1};
    while(!dq.empty()){ auto p=dq.front(); dq.pop_front();
        for(int k=0;k<4;k++){ int nr=p.first+dr[k], nc=p.second+dc[k];
            if(nr<0||nc<0||nr>=m||nc>=n) continue;
            int w=grid[nr][nc];
            if(dist[p.first][p.second]+w<dist[nr][nc]){
                dist[nr][nc]=dist[p.first][p.second]+w;
                if(w) dq.push_back({nr,nc}); else dq.push_front({nr,nc});
            }
        }
    } return dist[m-1][n-1];
}""")]),

    q("graph-031", "Shortest Path With Alternating Colors", 1129, "nice", "shortest-path", "Medium",
      ["0 <= n <= 10^4", "edges colored red or blue"],
      [ex("n=3, redEdges, blueEdges", "distance array per node")],
      [approach("BFS with (node, lastColor) state", "O(V+E)", "O(V)", """
vector<int> shortestAlternatingPaths(int n, vector<vector<int>>& red, vector<vector<int>>& blue) {
    vector<vector<pair<int,int>>> g(n);
    for(auto& e:red) g[e[0]].push_back({e[1],0});
    for(auto& e:blue) g[e[0]].push_back({e[1],1});
    vector<int> ans(n,-1); vector<vector<int>> dist(n, vector<int>(2,INT_MAX));
    queue<tuple<int,int,int>> q; q.push({0,0,-1}); q.push({0,1,-1});
    dist[0][0]=dist[0][1]=0;
    while(!q.empty()){ auto [u,c,pc]=q.front(); q.pop();
        for(auto& e:g[u]) if(e.second!=pc && dist[e.first][e.second]>dist[u][c]+1){
            dist[e.first][e.second]=dist[u][c]+1;
            if(ans[e.first]==-1) ans[e.first]=dist[e.first][e.second];
            q.push({e.first,e.second,e.second});
        }
    } return ans;
}""")]),

    q("graph-032", "Number of Ways to Arrive at Destination", 1976, "nice", "shortest-path", "Medium",
      ["1 <= n <= 200", "count paths with min time mod 1e9+7"],
      [ex("n=7, roads, src=0, dst=6", "4")],
      [approach("Dijkstra + path counting", "O(E log V)", "O(V+E)", """
int countPaths(int n, vector<vector<int>>& roads) {
    const int MOD=1e9+7;
    vector<vector<pair<long long,int>>> g(n);
    for(auto& r:roads){ g[r[0]].push_back({r[1],r[2]}); g[r[1]].push_back({r[0],r[2]}); }
    vector<long long> dist(n,LLONG_MAX); vector<long long> ways(n);
    priority_queue<pair<long long,int>, vector<pair<long long,int>>, greater<>> pq;
    dist[0]=0; ways[0]=1; pq.push({0,0});
    while(!pq.empty()){ auto [d,u]=pq.top(); pq.pop(); if(d>dist[u]) continue;
        for(auto& e:g[u]) if(dist[e.first]>d+e.second){
            dist[e.first]=d+e.second; ways[e.first]=ways[u]; pq.push({dist[e.first],e.first});
        } else if(dist[e.first]==d+e.second) ways[e.first]=(ways[e.first]+ways[u])%MOD;
    } return (int)ways[n-1];
}""")]),

    q("graph-033", "Redundant Connection", 684, "must", "union-find", "Medium",
      ["n <= 1000", "tree + one extra edge"],
      [ex("edges=[[1,2],[1,3],[2,3]]", "[2,3]")],
      [approach("Union-Find", "O(n α(n))", "O(n)", """
vector<int> par, rnk;
int find(int x){ return par[x]==x? x: par[x]=find(par[x]); }
bool unite(int a,int b){ a=find(a); b=find(b); if(a==b) return false;
    if(rnk[a]<rnk[b]) swap(a,b); par[b]=a; if(rnk[a]==rnk[b]) rnk[a]++; return true; }
vector<int> findRedundantConnection(vector<vector<int>>& edges) {
    int n=edges.size(); par.resize(n+1); rnk.assign(n+1,0); iota(par.begin(),par.end(),0);
    for(auto& e:edges) if(!unite(e[0],e[1])) return e;
    return {};
}""")]),

    q("graph-034", "Number of Connected Components", 323, "must", "union-find", "Medium",
      ["1 <= n <= 2000", "undirected edges"],
      [ex("n=5, edges=[[0,1],[1,2],[3,4]]", "2")],
      [approach("Union-Find count roots", "O(n α(n))", "O(n)", """
int countComponents(int n, vector<vector<int>>& edges) {
    vector<int> par(n); iota(par.begin(),par.end(),0);
    function<int(int)> find=[&](int x){ return par[x]==x? x: par[x]=find(par[x]); };
    int comps=n;
    for(auto& e:edges){ int a=find(e[0]), b=find(e[1]); if(a!=b){ par[a]=b; comps--; } }
    return comps;
}""")]),

    q("graph-035", "Accounts Merge", 721, "must", "union-find", "Medium",
      ["accounts[i] length <= 10", "merge by email connectivity"],
      [ex("accounts with names and emails", "merged account lists")],
      [approach("Union-Find on emails", "O(N log N)", "O(N)", """
vector<vector<string>> accountsMerge(vector<vector<string>>& acc) {
    unordered_map<string,string> owner; unordered_map<string,string> parent;
    function<string(string)> find=[&](string x){ return parent[x]==x? x: parent[x]=find(parent[x]); };
    for(auto& a:acc) for(int i=1;i<(int)a.size();i++){
        owner[a[i]]=a[0]; if(!parent.count(a[i])) parent[a[i]]=a[i];
        if(i>1){ string r1=find(a[1]), r2=find(a[i]); parent[r1]=r2; }
    }
    unordered_map<string,set<string>> groups;
    for(auto& p:parent){ string r=find(p.first); groups[r].insert(p.first); }
    vector<vector<string>> res;
    for(auto& g:groups){ vector<string> row={owner[g.first]}; row.insert(row.end(),g.second.begin(),g.second.end()); res.push_back(row); }
    return res;
}""")]),

    q("graph-036", "Graph Valid Tree", 261, "must", "union-find", "Medium",
      ["1 <= n <= 2000", "n-1 edges required for tree"],
      [ex("n=5, edges=[[0,1],[0,2],[0,3],[1,4]]", "true")],
      [approach("Union-Find + edge count", "O(n α(n))", "O(n)", """
bool validTree(int n, vector<vector<int>>& edges) {
    if((int)edges.size()!=n-1) return false;
    vector<int> par(n); iota(par.begin(),par.end(),0);
    function<int(int)> find=[&](int x){ return par[x]==x? x: par[x]=find(par[x]); };
    for(auto& e:edges){ int a=find(e[0]), b=find(e[1]); if(a==b) return false; par[a]=b; }
    return true;
}""")]),

    q("graph-037", "Number of Provinces", 547, "must", "union-find", "Medium",
      ["1 <= n <= 200", "adjacency matrix"],
      [ex("isConnected = [[1,1,0],[1,1,0],[0,0,1]]", "2")],
      [approach("DFS or Union-Find", "O(n^2)", "O(n)", """
void dfs(vector<vector<int>>& m, vector<int>& vis, int i, int n){
    vis[i]=1; for(int j=0;j<n;j++) if(m[i][j]&&!vis[j]) dfs(m,vis,j,n);
}
int findCircleNum(vector<vector<int>>& isConnected) {
    int n=isConnected.size(), ans=0; vector<int> vis(n);
    for(int i=0;i<n;i++) if(!vis[i]){ dfs(isConnected,vis,i,n); ans++; }
    return ans;
}""")]),

    q("graph-038", "Satisfiability of Equality Equations", 990, "should", "union-find", "Medium",
      ["equations.length == 4", "lowercase letters"],
      [ex("equations=[\"a==b\",\"b!=a\"]", "false")],
      [approach("Union-Find: unite == first, check !=" , "O(n α(n))", "O(1)", """
bool equationsPossible(vector<string>& eq) {
    vector<int> par(26); iota(par.begin(),par.end(),0);
    function<int(int)> find=[&](int x){ return par[x]==x? x: par[x]=find(par[x]); };
    for(auto& e:eq) if(e[1]=='='){ int a=e[0]-'a', b=e[3]-'a'; par[find(a)]=find(b); }
    for(auto& e:eq) if(e[1]=='!'){ int a=e[0]-'a', b=e[3]-'a'; if(find(a)==find(b)) return false; }
    return true;
}""")]),

    q("graph-039", "Most Stones Removed", 947, "should", "union-find", "Medium",
      ["1 <= stones.length <= 1000", "same row OR column => connected"],
      [ex("stones=[[0,0],[0,1],[1,0],[1,2],[2,1],[2,2]]", "5")],
      [approach("Union-Find on row/col nodes", "O(n α(n))", "O(n)", """
int removeStones(vector<vector<int>>& stones) {
    unordered_map<int,int> rowId, colId; int id=0;
    vector<int> par(2000); iota(par.begin(),par.end(),0);
    function<int(int)> find=[&](int x){ return par[x]==x? x: par[x]=find(par[x]); };
    for(auto& s:stones){
        if(!rowId.count(s[0])) rowId[s[0]]=id++;
        if(!colId.count(s[1])) colId[s[1]]=id++;
        par[find(rowId[s[0]])]=find(colId[s[1]]);
    }
    unordered_set<int> roots;
    for(auto& p:rowId) roots.insert(find(p.second));
    for(auto& p:colId) roots.insert(find(p.second));
    return (int)stones.size()-(int)roots.size();
}""")]),

    q("graph-040", "Min Cost to Connect All Points", 1584, "must", "mst", "Medium",
      ["1 <= points.length <= 1000", "Manhattan distance"],
      [ex("points=[[0,0],[2,2],[3,10]]", "11")],
      [approach("Kruskal + Union-Find", "O(n^2 log n)", "O(n)", """
int minCostConnectPoints(vector<vector<int>>& pts) {
    int n=pts.size(); vector<tuple<int,int,int>> edges;
    auto dist=[&](int i,int j){ return abs(pts[i][0]-pts[j][0])+abs(pts[i][1]-pts[j][1]); };
    for(int i=0;i<n;i++) for(int j=i+1;j<n;j++) edges.push_back({dist(i,j),i,j});
    sort(edges.begin(), edges.end());
    vector<int> par(n); iota(par.begin(),par.end(),0);
    function<int(int)> find=[&](int x){ return par[x]==x? x: par[x]=find(par[x]); };
    int cost=0, used=0;
    for(auto& e:edges){ int a=find(get<1>(e)), b=find(get<2>(e));
        if(a!=b){ par[a]=b; cost+=get<0>(e); if(++used==n-1) break; }
    } return cost;
}""")]),

    q("graph-041", "Connecting Cities With Minimum Cost", 1135, "should", "mst", "Medium",
      ["n <= 10^4", "n-1 edges needed"],
      [ex("n=3, connections=[[1,2,5],[1,3,6],[2,3,1]]", "6")],
      [approach("Kruskal MST", "O(E log E)", "O(n)", """
int minimumCost(int n, vector<vector<int>>& con) {
    sort(con.begin(), con.end(), [](auto& a, auto& b){ return a[2]<b[2]; });
    vector<int> par(n+1); iota(par.begin(),par.end(),0);
    function<int(int)> find=[&](int x){ return par[x]==x? x: par[x]=find(par[x]); };
    int cost=0, edges=0;
    for(auto& c:con){ int a=find(c[0]), b=find(c[1]); if(a!=b){ par[a]=b; cost+=c[2]; if(++edges==n-1) return cost; } }
    return -1;
}""")]),

    q("graph-042", "Optimize Water Distribution", 1168, "nice", "mst", "Hard",
      ["virtual node 0 to wells", "pipes + well costs"],
      [ex("n=3, wells, pipes", "minimum total cost")],
      [approach("MST with super-source", "O(E log E)", "O(n)", """
int minCostToSupplyWater(int n, vector<int>& wells, vector<vector<int>>& pipes) {
    vector<vector<int>> edges;
    for(int i=0;i<n;i++) edges.push_back({0,i+1,wells[i]});
    for(auto& p:pipes) edges.push_back(p);
    sort(edges.begin(), edges.end(), [](auto& a, auto& b){ return a[2]<b[2]; });
    vector<int> par(n+1); iota(par.begin(),par.end(),0);
    function<int(int)> find=[&](int x){ return par[x]==x? x: par[x]=find(par[x]); };
    int cost=0, cnt=0;
    for(auto& e:edges){ int a=find(e[0]), b=find(e[1]); if(a!=b){ par[a]=b; cost+=e[2]; if(++cnt==n) break; } }
    return cost;
}""")]),

    q("graph-043", "Number of Islands II", 305, "should", "union-find", "Hard",
      ["m, n <= 200", "dynamic land additions"],
      [ex("m=3,n=3, positions=[[0,0],[0,1],[1,2],[2,1]]", "[1,1,2,3]")],
      [approach("Union-Find per add", "O(k α(mn))", "O(mn)", """
vector<int> numIslands2(int m, int n, vector<vector<int>>& pos) {
    vector<int> par(m*n,-1), rnk(m*n), ans; int islands=0;
    function<int(int)> find=[&](int x){ return par[x]==x? x: par[x]=find(par[x]); };
    int dr[4]={1,-1,0,0}, dc[4]={0,0,1,-1};
    for(auto& p:pos){ int idx=p[0]*n+p[1]; if(par[idx]!=-1){ ans.push_back(islands); continue; }
        par[idx]=idx; rnk[idx]=0; islands++;
        for(int k=0;k<4;k++){ int nr=p[0]+dr[k], nc=p[1]+dc[k], nidx=nr*n+nc;
            if(nr>=0&&nr<m&&nc>=0&&nc<n&&par[nidx]!=-1){
                int a=find(idx), b=find(nidx); if(a!=b){ if(rnk[a]<rnk[b]) swap(a,b); par[b]=a; if(rnk[a]==rnk[b]) rnk[a]++; islands--; }
            }
        } ans.push_back(islands);
    } return ans;
}""")]),

    q("graph-044", "Regions Cut By Slashes", 959, "nice", "union-find", "Medium",
      ["grid.length == n", " '/', '\\', ' ' cells"],
      [ex("grid=[\"/\\\\\",\"\\\\/\"]", "regions count")],
      [approach("Expand to 4x4 cells + UF", "O(n^2 α(n))", "O(n^2)", """
int regionsBySlashes(vector<string>& grid) {
    int n=grid.size(), N=3*n; vector<int> par(N*N); iota(par.begin(),par.end(),0);
    function<int(int)> find=[&](int x){ return par[x]==x? x: par[x]=find(par[x]); };
    auto unite=[&](int a,int b){ a=find(a); b=find(b); if(a!=b) par[a]=b; };
    auto id=[&](int r,int c){ return r*N+c; };
    for(int i=0;i<n;i++) for(int j=0;j<n;j++){
        int r=3*i, c=3*j;
        if(grid[i][j]==' '){ unite(id(r+1,c+1),id(r+1,c+2)); unite(id(r+1,c+1),id(r+2,c+1)); }
        else if(grid[i][j]=='/'){ unite(id(r,c+2),id(r+1,c+1)); unite(id(r+1,c+1),id(r+2,c)); }
        else { unite(id(r,c),id(r+1,c+1)); unite(id(r+1,c+1),id(r+2,c+2)); }
        if(i) unite(id(r,c+1),id(r-1,c+1));
        if(j) unite(id(r+1,c),id(r+1,c-1));
    }
    unordered_set<int> roots; for(int i=0;i<N*N;i++) roots.insert(find(i));
    return (int)roots.size();
}""")]),

    q("graph-045", "Longest Increasing Path in a Matrix", 329, "must", "dfs-advanced", "Hard",
      ["m, n <= 200", "strictly increasing paths"],
      [ex("matrix=[[9,9,4],[6,6,8],[2,1,1]]", "4")],
      [approach("DFS + memoization", "O(mn)", "O(mn)", """
int dfs(vector<vector<int>>& m, vector<vector<int>>& dp, int r, int c) {
    if(dp[r][c]) return dp[r][c];
    int best=1, dr[4]={1,-1,0,0}, dc[4]={0,0,1,-1};
    for(int k=0;k<4;k++){ int nr=r+dr[k], nc=c+dc[k];
        if(nr>=0&&nc>=0&&nr<(int)m.size()&&nc<(int)m[0].size()&&m[nr][nc]>m[r][c])
            best=max(best, 1+dfs(m,dp,nr,nc));
    } return dp[r][c]=best;
}
int longestIncreasingPath(vector<vector<int>>& matrix) {
    if(matrix.empty()) return 0;
    int m=matrix.size(), n=matrix[0].size(), ans=0;
    vector<vector<int>> dp(m, vector<int>(n));
    for(int i=0;i<m;i++) for(int j=0;j<n;j++) ans=max(ans, dfs(matrix,dp,i,j));
    return ans;
}""")]),
]

assert len(GRAPH_QUESTIONS) == 45, len(GRAPH_QUESTIONS)

GRAPH_TOPIC = {
    "id": "graph",
    "title": "Graph",
    "expected_count": 45,
    "strategy": (
        "<strong>Speed-run priority:</strong> BFS/DFS &rarr; Topo sort &rarr; Shortest path &rarr; Union-Find &rarr; MST &amp; advanced DFS. "
        "Those four cores cover ~80% of graph interviews. "
        "<ul><li>~10 min per question max</li>"
        "<li>Blank after 3 min? peek pattern tag only, then recode</li>"
        "<li>Filter <em>Must do</em> first (20 questions)</li></ul>"
    ),
    "subtopics": [
        {"id": "bfs-dfs", "label": "BFS / DFS"},
        {"id": "topo", "label": "Topo Sort"},
        {"id": "shortest-path", "label": "Shortest Path"},
        {"id": "union-find", "label": "Union-Find"},
        {"id": "mst", "label": "MST"},
        {"id": "dfs-advanced", "label": "Advanced DFS"},
    ],
    "questions": GRAPH_QUESTIONS,
}
