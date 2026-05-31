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
      "description": "Given an `m x n` 2D binary grid `grid` which represents a map of `'1'`s (land) and `'0'`s (water), return the number of islands.\n\nAn island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.\n\n \n\nExample 1:\n\nInput: grid = [\n  [\"1\",\"1\",\"1\",\"1\",\"0\"],\n  [\"1\",\"1\",\"0\",\"1\",\"0\"],\n  [\"1\",\"1\",\"0\",\"0\",\"0\"],\n  [\"0\",\"0\",\"0\",\"0\",\"0\"]\n]\nOutput: 1\n\nExample 2:\n\nInput: grid = [\n  [\"1\",\"1\",\"0\",\"0\",\"0\"],\n  [\"1\",\"1\",\"0\",\"0\",\"0\"],\n  [\"0\",\"0\",\"1\",\"0\",\"0\"],\n  [\"0\",\"0\",\"0\",\"1\",\"1\"]\n]\nOutput: 3\n\n \n\nConstraints:\n\n\t• `m == grid.length`\n• `n == grid[i].length`\n• `1",
      "descriptionHtml": "<p>Given an <code>m x n</code> 2D binary grid <code>grid</code> which represents a map of <code>&#39;1&#39;</code>s (land) and <code>&#39;0&#39;</code>s (water), return <em>the number of islands</em>.</p>\n\n<p>An <strong>island</strong> is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> grid = [\n  [&quot;1&quot;,&quot;1&quot;,&quot;1&quot;,&quot;1&quot;,&quot;0&quot;],\n  [&quot;1&quot;,&quot;1&quot;,&quot;0&quot;,&quot;1&quot;,&quot;0&quot;],\n  [&quot;1&quot;,&quot;1&quot;,&quot;0&quot;,&quot;0&quot;,&quot;0&quot;],\n  [&quot;0&quot;,&quot;0&quot;,&quot;0&quot;,&quot;0&quot;,&quot;0&quot;]\n]\n<strong>Output:</strong> 1\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> grid = [\n  [&quot;1&quot;,&quot;1&quot;,&quot;0&quot;,&quot;0&quot;,&quot;0&quot;],\n  [&quot;1&quot;,&quot;1&quot;,&quot;0&quot;,&quot;0&quot;,&quot;0&quot;],\n  [&quot;0&quot;,&quot;0&quot;,&quot;1&quot;,&quot;0&quot;,&quot;0&quot;],\n  [&quot;0&quot;,&quot;0&quot;,&quot;0&quot;,&quot;1&quot;,&quot;1&quot;]\n]\n<strong>Output:</strong> 3\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>m == grid.length</code></li>\n\t<li><code>n == grid[i].length</code></li>\n\t<li><code>1 &lt;= m, n &lt;= 300</code></li>\n\t<li><code>grid[i][j]</code> is <code>&#39;0&#39;</code> or <code>&#39;1&#39;</code>.</li>\n</ul>\n",
      "lcSlug": "number-of-islands",
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
      "description": "You are given an `m x n` binary matrix `grid`. An island is a group of `1`'s (representing land) connected 4-directionally (horizontal or vertical.) You may assume all four edges of the grid are surrounded by water.\n\nThe area of an island is the number of cells with a value `1` in the island.\n\nReturn the maximum area of an island in `grid`. If there is no island, return `0`.\n\n \n\nExample 1:\n\nInput: grid = [[0,0,1,0,0,0,0,1,0,0,0,0,0],[0,0,0,0,0,0,0,1,1,1,0,0,0],[0,1,1,0,1,0,0,0,0,0,0,0,0],[0,1,0,0,1,1,0,0,1,0,1,0,0],[0,1,0,0,1,1,0,0,1,1,1,0,0],[0,0,0,0,0,0,0,0,0,0,1,0,0],[0,0,0,0,0,0,0,1,1,1,0,0,0],[0,0,0,0,0,0,0,1,1,0,0,0,0]]\nOutput: 6\nExplanation: The answer is not 11, because the island must be connected 4-directionally.\n\nExample 2:\n\nInput: grid = [[0,0,0,0,0,0,0,0]]\nOutput: 0\n\n \n\nConstraints:\n\n\t• `m == grid.length`\n• `n == grid[i].length`\n• `1",
      "descriptionHtml": "<p>You are given an <code>m x n</code> binary matrix <code>grid</code>. An island is a group of <code>1</code>&#39;s (representing land) connected <strong>4-directionally</strong> (horizontal or vertical.) You may assume all four edges of the grid are surrounded by water.</p>\n\n<p>The <strong>area</strong> of an island is the number of cells with a value <code>1</code> in the island.</p>\n\n<p>Return <em>the maximum <strong>area</strong> of an island in </em><code>grid</code>. If there is no island, return <code>0</code>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2021/05/01/maxarea1-grid.jpg\" style=\"width: 500px; height: 310px;\" />\n<pre>\n<strong>Input:</strong> grid = [[0,0,1,0,0,0,0,1,0,0,0,0,0],[0,0,0,0,0,0,0,1,1,1,0,0,0],[0,1,1,0,1,0,0,0,0,0,0,0,0],[0,1,0,0,1,1,0,0,1,0,1,0,0],[0,1,0,0,1,1,0,0,1,1,1,0,0],[0,0,0,0,0,0,0,0,0,0,1,0,0],[0,0,0,0,0,0,0,1,1,1,0,0,0],[0,0,0,0,0,0,0,1,1,0,0,0,0]]\n<strong>Output:</strong> 6\n<strong>Explanation:</strong> The answer is not 11, because the island must be connected 4-directionally.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> grid = [[0,0,0,0,0,0,0,0]]\n<strong>Output:</strong> 0\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>m == grid.length</code></li>\n\t<li><code>n == grid[i].length</code></li>\n\t<li><code>1 &lt;= m, n &lt;= 50</code></li>\n\t<li><code>grid[i][j]</code> is either <code>0</code> or <code>1</code>.</li>\n</ul>\n",
      "lcSlug": "max-area-of-island",
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
      "description": "You are given an image represented by an `m x n` grid of integers `image`, where `image[i][j]` represents the pixel value of the image. You are also given three integers `sr`, `sc`, and `color`. Your task is to perform a flood fill on the image starting from the pixel `image[sr][sc]`.\n\nTo perform a flood fill:\n\n\t• Begin with the starting pixel and change its color to `color`.\n• Perform the same process for each pixel that is directly adjacent (pixels that share a side with the original pixel, either horizontally or vertically) and shares the same color as the starting pixel.\n• Keep repeating this process by checking neighboring pixels of the updated pixels and modifying their color if it matches the original color of the starting pixel.\n• The process stops when there are no more adjacent pixels of the original color to update.\n\nReturn the modified image after performing the flood fill.\n\n \n\nExample 1:\n\nInput: image = [[1,1,1],[1,1,0],[1,0,1]], sr = 1, sc = 1, color = 2\n\nOutput: [[2,2,2],[2,2,0],[2,0,1]]\n\nExplanation:\n\nFrom the center of the image with position `(sr, sc) = (1, 1)` (i.e., the red pixel), all pixels connected by a path of the same color as the starting pixel (i.e., the blue pixels) are colored with the new color.\n\nNote the bottom corner is not colored 2, because it is not horizontally or vertically connected to the starting pixel.\n\nExample 2:\n\nInput: image = [[0,0,0],[0,0,0]], sr = 0, sc = 0, color = 0\n\nOutput: [[0,0,0],[0,0,0]]\n\nExplanation:\n\nThe starting pixel is already colored with 0, which is the same as the target color. Therefore, no changes are made to the image.\n\n \n\nConstraints:\n\n\t• `m == image.length`\n• `n == image[i].length`\n• `1 16`\n• `0",
      "descriptionHtml": "<p>You are given an image represented by an <code>m x n</code> grid of integers <code>image</code>, where <code>image[i][j]</code> represents the pixel value of the image. You are also given three integers <code>sr</code>, <code>sc</code>, and <code>color</code>. Your task is to perform a <strong>flood fill</strong> on the image starting from the pixel <code>image[sr][sc]</code>.</p>\n\n<p>To perform a <strong>flood fill</strong>:</p>\n\n<ol>\n\t<li>Begin with the starting pixel and change its color to <code>color</code>.</li>\n\t<li>Perform the same process for each pixel that is <strong>directly adjacent</strong> (pixels that share a side with the original pixel, either horizontally or vertically) and shares the <strong>same color</strong> as the starting pixel.</li>\n\t<li>Keep <strong>repeating</strong> this process by checking neighboring pixels of the <em>updated</em> pixels&nbsp;and modifying their color if it matches the original color of the starting pixel.</li>\n\t<li>The process <strong>stops</strong> when there are <strong>no more</strong> adjacent pixels of the original color to update.</li>\n</ol>\n\n<p>Return the <strong>modified</strong> image after performing the flood fill.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<div class=\"example-block\">\n<p><strong>Input:</strong> <span class=\"example-io\">image = [[1,1,1],[1,1,0],[1,0,1]], sr = 1, sc = 1, color = 2</span></p>\n\n<p><strong>Output:</strong> <span class=\"example-io\">[[2,2,2],[2,2,0],[2,0,1]]</span></p>\n\n<p><strong>Explanation:</strong></p>\n\n<p><img alt=\"\" src=\"https://assets.leetcode.com/uploads/2021/06/01/flood1-grid.jpg\" style=\"width: 613px; height: 253px;\" /></p>\n\n<p>From the center of the image with position <code>(sr, sc) = (1, 1)</code> (i.e., the red pixel), all pixels connected by a path of the same color as the starting pixel (i.e., the blue pixels) are colored with the new color.</p>\n\n<p>Note the bottom corner is <strong>not</strong> colored 2, because it is not horizontally or vertically connected to the starting pixel.</p>\n</div>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<div class=\"example-block\">\n<p><strong>Input:</strong> <span class=\"example-io\">image = [[0,0,0],[0,0,0]], sr = 0, sc = 0, color = 0</span></p>\n\n<p><strong>Output:</strong> <span class=\"example-io\">[[0,0,0],[0,0,0]]</span></p>\n\n<p><strong>Explanation:</strong></p>\n\n<p>The starting pixel is already colored with 0, which is the same as the target color. Therefore, no changes are made to the image.</p>\n</div>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>m == image.length</code></li>\n\t<li><code>n == image[i].length</code></li>\n\t<li><code>1 &lt;= m, n &lt;= 50</code></li>\n\t<li><code>0 &lt;= image[i][j], color &lt; 2<sup>16</sup></code></li>\n\t<li><code>0 &lt;= sr &lt; m</code></li>\n\t<li><code>0 &lt;= sc &lt; n</code></li>\n</ul>\n",
      "lcSlug": "flood-fill",
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
      "description": "You are given an `m x n` `grid` where each cell can have one of three values:\n\n\t• `0` representing an empty cell,\n• `1` representing a fresh orange, or\n• `2` representing a rotten orange.\n\nEvery minute, any fresh orange that is 4-directionally adjacent to a rotten orange becomes rotten.\n\nReturn the minimum number of minutes that must elapse until no cell has a fresh orange. If this is impossible, return `-1`.\n\n \n\nExample 1:\n\nInput: grid = [[2,1,1],[1,1,0],[0,1,1]]\nOutput: 4\n\nExample 2:\n\nInput: grid = [[2,1,1],[0,1,1],[1,0,1]]\nOutput: -1\nExplanation: The orange in the bottom left corner (row 2, column 0) is never rotten, because rotting only happens 4-directionally.\n\nExample 3:\n\nInput: grid = [[0,2]]\nOutput: 0\nExplanation: Since there are already no fresh oranges at minute 0, the answer is just 0.\n\n \n\nConstraints:\n\n\t• `m == grid.length`\n• `n == grid[i].length`\n• `1",
      "descriptionHtml": "<p>You are given an <code>m x n</code> <code>grid</code> where each cell can have one of three values:</p>\n\n<ul>\n\t<li><code>0</code> representing an empty cell,</li>\n\t<li><code>1</code> representing a fresh orange, or</li>\n\t<li><code>2</code> representing a rotten orange.</li>\n</ul>\n\n<p>Every minute, any fresh orange that is <strong>4-directionally adjacent</strong> to a rotten orange becomes rotten.</p>\n\n<p>Return <em>the minimum number of minutes that must elapse until no cell has a fresh orange</em>. If <em>this is impossible, return</em> <code>-1</code>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2019/02/16/oranges.png\" style=\"width: 650px; height: 137px;\" />\n<pre>\n<strong>Input:</strong> grid = [[2,1,1],[1,1,0],[0,1,1]]\n<strong>Output:</strong> 4\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> grid = [[2,1,1],[0,1,1],[1,0,1]]\n<strong>Output:</strong> -1\n<strong>Explanation:</strong> The orange in the bottom left corner (row 2, column 0) is never rotten, because rotting only happens 4-directionally.\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> grid = [[0,2]]\n<strong>Output:</strong> 0\n<strong>Explanation:</strong> Since there are already no fresh oranges at minute 0, the answer is just 0.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>m == grid.length</code></li>\n\t<li><code>n == grid[i].length</code></li>\n\t<li><code>1 &lt;= m, n &lt;= 10</code></li>\n\t<li><code>grid[i][j]</code> is <code>0</code>, <code>1</code>, or <code>2</code>.</li>\n</ul>\n",
      "lcSlug": "rotting-oranges",
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
      "description": "Given an `m x n` binary matrix `mat`, return the distance of the nearest `0` for each cell.\n\nThe distance between two cells sharing a common edge is `1`.\n\n \n\nExample 1:\n\nInput: mat = [[0,0,0],[0,1,0],[0,0,0]]\nOutput: [[0,0,0],[0,1,0],[0,0,0]]\n\nExample 2:\n\nInput: mat = [[0,0,0],[0,1,0],[1,1,1]]\nOutput: [[0,0,0],[0,1,0],[1,2,1]]\n\n \n\nConstraints:\n\n\t• `m == mat.length`\n• `n == mat[i].length`\n• `1 4`\n• `1 4`\n• `mat[i][j]` is either `0` or `1`.\n• There is at least one `0` in `mat`.\n\n \n\nNote: This question is the same as 1765: https://leetcode.com/problems/map-of-highest-peak/",
      "descriptionHtml": "<p>Given an <code>m x n</code> binary matrix <code>mat</code>, return <em>the distance of the nearest </em><code>0</code><em> for each cell</em>.</p>\n\n<p>The distance between two cells sharing a common edge is <code>1</code>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2021/04/24/01-1-grid.jpg\" style=\"width: 253px; height: 253px;\" />\n<pre>\n<strong>Input:</strong> mat = [[0,0,0],[0,1,0],[0,0,0]]\n<strong>Output:</strong> [[0,0,0],[0,1,0],[0,0,0]]\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2021/04/24/01-2-grid.jpg\" style=\"width: 253px; height: 253px;\" />\n<pre>\n<strong>Input:</strong> mat = [[0,0,0],[0,1,0],[1,1,1]]\n<strong>Output:</strong> [[0,0,0],[0,1,0],[1,2,1]]\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>m == mat.length</code></li>\n\t<li><code>n == mat[i].length</code></li>\n\t<li><code>1 &lt;= m, n &lt;= 10<sup>4</sup></code></li>\n\t<li><code>1 &lt;= m * n &lt;= 10<sup>4</sup></code></li>\n\t<li><code>mat[i][j]</code> is either <code>0</code> or <code>1</code>.</li>\n\t<li>There is at least one <code>0</code> in <code>mat</code>.</li>\n</ul>\n\n<p>&nbsp;</p>\n<p><strong>Note:</strong> This question is the same as 1765: <a href=\"https://leetcode.com/problems/map-of-highest-peak/description/\" target=\"_blank\">https://leetcode.com/problems/map-of-highest-peak/</a></p>\n",
      "lcSlug": "01-matrix",
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
      "description": "Given an `n x n` binary matrix `grid`, return the length of the shortest clear path in the matrix. If there is no clear path, return `-1`.\n\nA clear path in a binary matrix is a path from the top-left cell (i.e., `(0, 0)`) to the bottom-right cell (i.e., `(n - 1, n - 1)`) such that:\n\n\t• All the visited cells of the path are `0`.\n• All the adjacent cells of the path are 8-directionally connected (i.e., they are different and they share an edge or a corner).\n\nThe length of a clear path is the number of visited cells of this path.\n\n \n\nExample 1:\n\nInput: grid = [[0,1],[1,0]]\nOutput: 2\n\nExample 2:\n\nInput: grid = [[0,0,0],[1,1,0],[1,1,0]]\nOutput: 4\n\nExample 3:\n\nInput: grid = [[1,0,0],[1,1,0],[1,1,0]]\nOutput: -1\n\n \n\nConstraints:\n\n\t• `n == grid.length`\n• `n == grid[i].length`\n• `1",
      "descriptionHtml": "<p>Given an <code>n x n</code> binary matrix <code>grid</code>, return <em>the length of the shortest <strong>clear path</strong> in the matrix</em>. If there is no clear path, return <code>-1</code>.</p>\n\n<p>A <strong>clear path</strong> in a binary matrix is a path from the <strong>top-left</strong> cell (i.e., <code>(0, 0)</code>) to the <strong>bottom-right</strong> cell (i.e., <code>(n - 1, n - 1)</code>) such that:</p>\n\n<ul>\n\t<li>All the visited cells of the path are <code>0</code>.</li>\n\t<li>All the adjacent cells of the path are <strong>8-directionally</strong> connected (i.e., they are different and they share an edge or a corner).</li>\n</ul>\n\n<p>The <strong>length of a clear path</strong> is the number of visited cells of this path.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2021/02/18/example1_1.png\" style=\"width: 500px; height: 234px;\" />\n<pre>\n<strong>Input:</strong> grid = [[0,1],[1,0]]\n<strong>Output:</strong> 2\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2021/02/18/example2_1.png\" style=\"height: 216px; width: 500px;\" />\n<pre>\n<strong>Input:</strong> grid = [[0,0,0],[1,1,0],[1,1,0]]\n<strong>Output:</strong> 4\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> grid = [[1,0,0],[1,1,0],[1,1,0]]\n<strong>Output:</strong> -1\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>n == grid.length</code></li>\n\t<li><code>n == grid[i].length</code></li>\n\t<li><code>1 &lt;= n &lt;= 100</code></li>\n\t<li><code>grid[i][j] is 0 or 1</code></li>\n</ul>\n",
      "lcSlug": "shortest-path-in-binary-matrix",
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
      "description": "A transformation sequence from word `beginWord` to word `endWord` using a dictionary `wordList` is a sequence of words `beginWord -> s1 -> s2 -> ... -> sk` such that:\n\n\t• Every adjacent pair of words differs by a single letter.\n• Every `si` for `1 k == endWord`\n\nGiven two words, `beginWord` and `endWord`, and a dictionary `wordList`, return the number of words in the shortest transformation sequence from `beginWord` to `endWord`, or `0` if no such sequence exists.\n\n \n\nExample 1:\n\nInput: beginWord = \"hit\", endWord = \"cog\", wordList = [\"hot\",\"dot\",\"dog\",\"lot\",\"log\",\"cog\"]\nOutput: 5\nExplanation: One shortest transformation sequence is \"hit\" -> \"hot\" -> \"dot\" -> \"dog\" -> cog\", which is 5 words long.\n\nExample 2:\n\nInput: beginWord = \"hit\", endWord = \"cog\", wordList = [\"hot\",\"dot\",\"dog\",\"lot\",\"log\"]\nOutput: 0\nExplanation: The endWord \"cog\" is not in wordList, therefore there is no valid transformation sequence.\n\n \n\nConstraints:\n\n\t• `1",
      "descriptionHtml": "<p>A <strong>transformation sequence</strong> from word <code>beginWord</code> to word <code>endWord</code> using a dictionary <code>wordList</code> is a sequence of words <code>beginWord -&gt; s<sub>1</sub> -&gt; s<sub>2</sub> -&gt; ... -&gt; s<sub>k</sub></code> such that:</p>\n\n<ul>\n\t<li>Every adjacent pair of words differs by a single letter.</li>\n\t<li>Every <code>s<sub>i</sub></code> for <code>1 &lt;= i &lt;= k</code> is in <code>wordList</code>. Note that <code>beginWord</code> does not need to be in <code>wordList</code>.</li>\n\t<li><code>s<sub>k</sub> == endWord</code></li>\n</ul>\n\n<p>Given two words, <code>beginWord</code> and <code>endWord</code>, and a dictionary <code>wordList</code>, return <em>the <strong>number of words</strong> in the <strong>shortest transformation sequence</strong> from</em> <code>beginWord</code> <em>to</em> <code>endWord</code><em>, or </em><code>0</code><em> if no such sequence exists.</em></p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> beginWord = &quot;hit&quot;, endWord = &quot;cog&quot;, wordList = [&quot;hot&quot;,&quot;dot&quot;,&quot;dog&quot;,&quot;lot&quot;,&quot;log&quot;,&quot;cog&quot;]\n<strong>Output:</strong> 5\n<strong>Explanation:</strong> One shortest transformation sequence is &quot;hit&quot; -&gt; &quot;hot&quot; -&gt; &quot;dot&quot; -&gt; &quot;dog&quot; -&gt; cog&quot;, which is 5 words long.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> beginWord = &quot;hit&quot;, endWord = &quot;cog&quot;, wordList = [&quot;hot&quot;,&quot;dot&quot;,&quot;dog&quot;,&quot;lot&quot;,&quot;log&quot;]\n<strong>Output:</strong> 0\n<strong>Explanation:</strong> The endWord &quot;cog&quot; is not in wordList, therefore there is no valid transformation sequence.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= beginWord.length &lt;= 10</code></li>\n\t<li><code>endWord.length == beginWord.length</code></li>\n\t<li><code>1 &lt;= wordList.length &lt;= 5000</code></li>\n\t<li><code>wordList[i].length == beginWord.length</code></li>\n\t<li><code>beginWord</code>, <code>endWord</code>, and <code>wordList[i]</code> consist of lowercase English letters.</li>\n\t<li><code>beginWord != endWord</code></li>\n\t<li>All the words in <code>wordList</code> are <strong>unique</strong>.</li>\n</ul>\n",
      "lcSlug": "word-ladder",
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
      "description": "You have a lock in front of you with 4 circular wheels. Each wheel has 10 slots: `'0', '1', '2', '3', '4', '5', '6', '7', '8', '9'`. The wheels can rotate freely and wrap around: for example we can turn `'9'` to be `'0'`, or `'0'` to be `'9'`. Each move consists of turning one wheel one slot.\n\nThe lock initially starts at `'0000'`, a string representing the state of the 4 wheels.\n\nYou are given a list of `deadends` dead ends, meaning if the lock displays any of these codes, the wheels of the lock will stop turning and you will be unable to open it.\n\nGiven a `target` representing the value of the wheels that will unlock the lock, return the minimum total number of turns required to open the lock, or -1 if it is impossible.\n\n \n\nExample 1:\n\nInput: deadends = [\"0201\",\"0101\",\"0102\",\"1212\",\"2002\"], target = \"0202\"\nOutput: 6\nExplanation: \nA sequence of valid moves would be \"0000\" -> \"1000\" -> \"1100\" -> \"1200\" -> \"1201\" -> \"1202\" -> \"0202\".\nNote that a sequence like \"0000\" -> \"0001\" -> \"0002\" -> \"0102\" -> \"0202\" would be invalid,\nbecause the wheels of the lock become stuck after the display becomes the dead end \"0102\".\n\nExample 2:\n\nInput: deadends = [\"8888\"], target = \"0009\"\nOutput: 1\nExplanation: We can turn the last wheel in reverse to move from \"0000\" -> \"0009\".\n\nExample 3:\n\nInput: deadends = [\"8887\",\"8889\",\"8878\",\"8898\",\"8788\",\"8988\",\"7888\",\"9888\"], target = \"8888\"\nOutput: -1\nExplanation: We cannot reach the target without getting stuck.\n\n \n\nConstraints:\n\n\t• `1",
      "descriptionHtml": "<p>You have a lock in front of you with 4 circular wheels. Each wheel has 10 slots: <code>&#39;0&#39;, &#39;1&#39;, &#39;2&#39;, &#39;3&#39;, &#39;4&#39;, &#39;5&#39;, &#39;6&#39;, &#39;7&#39;, &#39;8&#39;, &#39;9&#39;</code>. The wheels can rotate freely and wrap around: for example we can turn <code>&#39;9&#39;</code> to be <code>&#39;0&#39;</code>, or <code>&#39;0&#39;</code> to be <code>&#39;9&#39;</code>. Each move consists of turning one wheel one slot.</p>\n\n<p>The lock initially starts at <code>&#39;0000&#39;</code>, a string representing the state of the 4 wheels.</p>\n\n<p>You are given a list of <code>deadends</code> dead ends, meaning if the lock displays any of these codes, the wheels of the lock will stop turning and you will be unable to open it.</p>\n\n<p>Given a <code>target</code> representing the value of the wheels that will unlock the lock, return the minimum total number of turns required to open the lock, or -1 if it is impossible.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> deadends = [&quot;0201&quot;,&quot;0101&quot;,&quot;0102&quot;,&quot;1212&quot;,&quot;2002&quot;], target = &quot;0202&quot;\n<strong>Output:</strong> 6\n<strong>Explanation:</strong> \nA sequence of valid moves would be &quot;0000&quot; -&gt; &quot;1000&quot; -&gt; &quot;1100&quot; -&gt; &quot;1200&quot; -&gt; &quot;1201&quot; -&gt; &quot;1202&quot; -&gt; &quot;0202&quot;.\nNote that a sequence like &quot;0000&quot; -&gt; &quot;0001&quot; -&gt; &quot;0002&quot; -&gt; &quot;0102&quot; -&gt; &quot;0202&quot; would be invalid,\nbecause the wheels of the lock become stuck after the display becomes the dead end &quot;0102&quot;.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> deadends = [&quot;8888&quot;], target = &quot;0009&quot;\n<strong>Output:</strong> 1\n<strong>Explanation:</strong> We can turn the last wheel in reverse to move from &quot;0000&quot; -&gt; &quot;0009&quot;.\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> deadends = [&quot;8887&quot;,&quot;8889&quot;,&quot;8878&quot;,&quot;8898&quot;,&quot;8788&quot;,&quot;8988&quot;,&quot;7888&quot;,&quot;9888&quot;], target = &quot;8888&quot;\n<strong>Output:</strong> -1\n<strong>Explanation:</strong> We cannot reach the target without getting stuck.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= deadends.length &lt;= 500</code></li>\n\t<li><code>deadends[i].length == 4</code></li>\n\t<li><code>target.length == 4</code></li>\n\t<li>target <strong>will not be</strong> in the list <code>deadends</code>.</li>\n\t<li><code>target</code> and <code>deadends[i]</code> consist of digits only.</li>\n</ul>\n",
      "lcSlug": "open-the-lock",
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
      "description": "There is an `m x n` rectangular island that borders both the Pacific Ocean and Atlantic Ocean. The Pacific Ocean touches the island's left and top edges, and the Atlantic Ocean touches the island's right and bottom edges.\n\nThe island is partitioned into a grid of square cells. You are given an `m x n` integer matrix `heights` where `heights[r][c]` represents the height above sea level of the cell at coordinate `(r, c)`.\n\nThe island receives a lot of rain, and the rain water can flow to neighboring cells directly north, south, east, and west if the neighboring cell's height is less than or equal to the current cell's height. Water can flow from any cell adjacent to an ocean into the ocean.\n\nReturn a 2D list of grid coordinates `result` where `result[i] = [ri, ci]` denotes that rain water can flow from cell `(ri, ci)` to both the Pacific and Atlantic oceans.\n\n \n\nExample 1:\n\nInput: heights = [[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]\nOutput: [[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]\nExplanation: The following cells can flow to the Pacific and Atlantic oceans, as shown below:\n[0,4]: [0,4] -> Pacific Ocean \n       [0,4] -> Atlantic Ocean\n[1,3]: [1,3] -> [0,3] -> Pacific Ocean \n       [1,3] -> [1,4] -> Atlantic Ocean\n[1,4]: [1,4] -> [1,3] -> [0,3] -> Pacific Ocean \n       [1,4] -> Atlantic Ocean\n[2,2]: [2,2] -> [1,2] -> [0,2] -> Pacific Ocean \n       [2,2] -> [2,3] -> [2,4] -> Atlantic Ocean\n[3,0]: [3,0] -> Pacific Ocean \n       [3,0] -> [4,0] -> Atlantic Ocean\n[3,1]: [3,1] -> [3,0] -> Pacific Ocean \n       [3,1] -> [4,1] -> Atlantic Ocean\n[4,0]: [4,0] -> Pacific Ocean \n       [4,0] -> Atlantic Ocean\nNote that there are other possible paths for these cells to flow to the Pacific and Atlantic oceans.\n\nExample 2:\n\nInput: heights = [[1]]\nOutput: [[0,0]]\nExplanation: The water can flow from the only cell to the Pacific and Atlantic oceans.\n\n \n\nConstraints:\n\n\t• `m == heights.length`\n• `n == heights[r].length`\n• `1 5`",
      "descriptionHtml": "<p>There is an <code>m x n</code> rectangular island that borders both the <strong>Pacific Ocean</strong> and <strong>Atlantic Ocean</strong>. The <strong>Pacific Ocean</strong> touches the island&#39;s left and top edges, and the <strong>Atlantic Ocean</strong> touches the island&#39;s right and bottom edges.</p>\n\n<p>The island is partitioned into a grid of square cells. You are given an <code>m x n</code> integer matrix <code>heights</code> where <code>heights[r][c]</code> represents the <strong>height above sea level</strong> of the cell at coordinate <code>(r, c)</code>.</p>\n\n<p>The island receives a lot of rain, and the rain water can flow to neighboring cells directly north, south, east, and west if the neighboring cell&#39;s height is <strong>less than or equal to</strong> the current cell&#39;s height. Water can flow from any cell adjacent to an ocean into the ocean.</p>\n\n<p>Return <em>a <strong>2D list</strong> of grid coordinates </em><code>result</code><em> where </em><code>result[i] = [r<sub>i</sub>, c<sub>i</sub>]</code><em> denotes that rain water can flow from cell </em><code>(r<sub>i</sub>, c<sub>i</sub>)</code><em> to <strong>both</strong> the Pacific and Atlantic oceans</em>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2021/06/08/waterflow-grid.jpg\" style=\"width: 400px; height: 400px;\" />\n<pre>\n<strong>Input:</strong> heights = [[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]\n<strong>Output:</strong> [[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]\n<strong>Explanation:</strong> The following cells can flow to the Pacific and Atlantic oceans, as shown below:\n[0,4]: [0,4] -&gt; Pacific Ocean \n&nbsp;      [0,4] -&gt; Atlantic Ocean\n[1,3]: [1,3] -&gt; [0,3] -&gt; Pacific Ocean \n&nbsp;      [1,3] -&gt; [1,4] -&gt; Atlantic Ocean\n[1,4]: [1,4] -&gt; [1,3] -&gt; [0,3] -&gt; Pacific Ocean \n&nbsp;      [1,4] -&gt; Atlantic Ocean\n[2,2]: [2,2] -&gt; [1,2] -&gt; [0,2] -&gt; Pacific Ocean \n&nbsp;      [2,2] -&gt; [2,3] -&gt; [2,4] -&gt; Atlantic Ocean\n[3,0]: [3,0] -&gt; Pacific Ocean \n&nbsp;      [3,0] -&gt; [4,0] -&gt; Atlantic Ocean\n[3,1]: [3,1] -&gt; [3,0] -&gt; Pacific Ocean \n&nbsp;      [3,1] -&gt; [4,1] -&gt; Atlantic Ocean\n[4,0]: [4,0] -&gt; Pacific Ocean \n       [4,0] -&gt; Atlantic Ocean\nNote that there are other possible paths for these cells to flow to the Pacific and Atlantic oceans.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> heights = [[1]]\n<strong>Output:</strong> [[0,0]]\n<strong>Explanation:</strong> The water can flow from the only cell to the Pacific and Atlantic oceans.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>m == heights.length</code></li>\n\t<li><code>n == heights[r].length</code></li>\n\t<li><code>1 &lt;= m, n &lt;= 200</code></li>\n\t<li><code>0 &lt;= heights[r][c] &lt;= 10<sup>5</sup></code></li>\n</ul>\n",
      "lcSlug": "pacific-atlantic-water-flow",
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
      "description": "You are given an `m x n` matrix `board` containing letters `'X'` and `'O'`, capture regions that are surrounded:\n\n\t• Connect: A cell is connected to adjacent cells horizontally or vertically.\n• Region: To form a region connect every `'O'` cell.\n• Surround: A region is surrounded if none of the `'O'` cells in that region are on the edge of the board. Such regions are completely enclosed by `'X'` cells.\n\nTo capture a surrounded region, replace all `'O'`s with `'X'`s in-place within the original board. You do not need to return anything.\n\n \n\nExample 1:\n\nInput: board = [[\"X\",\"X\",\"X\",\"X\"],[\"X\",\"O\",\"O\",\"X\"],[\"X\",\"X\",\"O\",\"X\"],[\"X\",\"O\",\"X\",\"X\"]]\n\nOutput: [[\"X\",\"X\",\"X\",\"X\"],[\"X\",\"X\",\"X\",\"X\"],[\"X\",\"X\",\"X\",\"X\"],[\"X\",\"O\",\"X\",\"X\"]]\n\nExplanation:\n\nIn the above diagram, the bottom region is not captured because it is on the edge of the board and cannot be surrounded.\n\nExample 2:\n\nInput: board = [[\"X\"]]\n\nOutput: [[\"X\"]]\n\n \n\nConstraints:\n\n\t• `m == board.length`\n• `n == board[i].length`\n• `1",
      "descriptionHtml": "<p>You are given an <code>m x n</code> matrix <code>board</code> containing <strong>letters</strong> <code>&#39;X&#39;</code> and <code>&#39;O&#39;</code>, <strong>capture regions</strong> that are <strong>surrounded</strong>:</p>\n\n<ul>\n\t<li><strong>Connect</strong>: A cell is connected to adjacent cells horizontally or vertically.</li>\n\t<li><strong>Region</strong>: To form a region <strong>connect every</strong> <code>&#39;O&#39;</code> cell.</li>\n\t<li><strong>Surround</strong>: A region is surrounded if none of the <code>&#39;O&#39;</code> cells in that region are on the edge of the board. Such regions are <strong>completely enclosed </strong>by <code>&#39;X&#39;</code> cells.</li>\n</ul>\n\n<p>To capture a <strong>surrounded region</strong>, replace all <code>&#39;O&#39;</code>s with <code>&#39;X&#39;</code>s <strong>in-place</strong> within the original board. You do not need to return anything.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<div class=\"example-block\">\n<p><strong>Input:</strong> <span class=\"example-io\">board = [[&quot;X&quot;,&quot;X&quot;,&quot;X&quot;,&quot;X&quot;],[&quot;X&quot;,&quot;O&quot;,&quot;O&quot;,&quot;X&quot;],[&quot;X&quot;,&quot;X&quot;,&quot;O&quot;,&quot;X&quot;],[&quot;X&quot;,&quot;O&quot;,&quot;X&quot;,&quot;X&quot;]]</span></p>\n\n<p><strong>Output:</strong> <span class=\"example-io\">[[&quot;X&quot;,&quot;X&quot;,&quot;X&quot;,&quot;X&quot;],[&quot;X&quot;,&quot;X&quot;,&quot;X&quot;,&quot;X&quot;],[&quot;X&quot;,&quot;X&quot;,&quot;X&quot;,&quot;X&quot;],[&quot;X&quot;,&quot;O&quot;,&quot;X&quot;,&quot;X&quot;]]</span></p>\n\n<p><strong>Explanation:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2021/02/19/xogrid.jpg\" style=\"width: 367px; height: 158px;\" />\n<p>In the above diagram, the bottom region is not captured because it is on the edge of the board and cannot be surrounded.</p>\n</div>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<div class=\"example-block\">\n<p><strong>Input:</strong> <span class=\"example-io\">board = [[&quot;X&quot;]]</span></p>\n\n<p><strong>Output:</strong> <span class=\"example-io\">[[&quot;X&quot;]]</span></p>\n</div>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>m == board.length</code></li>\n\t<li><code>n == board[i].length</code></li>\n\t<li><code>1 &lt;= m, n &lt;= 200</code></li>\n\t<li><code>board[i][j]</code> is <code>&#39;X&#39;</code> or <code>&#39;O&#39;</code>.</li>\n</ul>\n",
      "lcSlug": "surrounded-regions",
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
      "description": "You are given an `m x n` binary matrix `grid`, where `0` represents a sea cell and `1` represents a land cell.\n\nA move consists of walking from one land cell to another adjacent (4-directionally) land cell or walking off the boundary of the `grid`.\n\nReturn the number of land cells in `grid` for which we cannot walk off the boundary of the grid in any number of moves.\n\n \n\nExample 1:\n\nInput: grid = [[0,0,0,0],[1,0,1,0],[0,1,1,0],[0,0,0,0]]\nOutput: 3\nExplanation: There are three 1s that are enclosed by 0s, and one 1 that is not enclosed because its on the boundary.\n\nExample 2:\n\nInput: grid = [[0,1,1,0],[0,0,1,0],[0,0,1,0],[0,0,0,0]]\nOutput: 0\nExplanation: All 1s are either on the boundary or can reach the boundary.\n\n \n\nConstraints:\n\n\t• `m == grid.length`\n• `n == grid[i].length`\n• `1",
      "descriptionHtml": "<p>You are given an <code>m x n</code> binary matrix <code>grid</code>, where <code>0</code> represents a sea cell and <code>1</code> represents a land cell.</p>\n\n<p>A <strong>move</strong> consists of walking from one land cell to another adjacent (<strong>4-directionally</strong>) land cell or walking off the boundary of the <code>grid</code>.</p>\n\n<p>Return <em>the number of land cells in</em> <code>grid</code> <em>for which we cannot walk off the boundary of the grid in any number of <strong>moves</strong></em>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2021/02/18/enclaves1.jpg\" style=\"width: 333px; height: 333px;\" />\n<pre>\n<strong>Input:</strong> grid = [[0,0,0,0],[1,0,1,0],[0,1,1,0],[0,0,0,0]]\n<strong>Output:</strong> 3\n<strong>Explanation:</strong> There are three 1s that are enclosed by 0s, and one 1 that is not enclosed because its on the boundary.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2021/02/18/enclaves2.jpg\" style=\"width: 333px; height: 333px;\" />\n<pre>\n<strong>Input:</strong> grid = [[0,1,1,0],[0,0,1,0],[0,0,1,0],[0,0,0,0]]\n<strong>Output:</strong> 0\n<strong>Explanation:</strong> All 1s are either on the boundary or can reach the boundary.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>m == grid.length</code></li>\n\t<li><code>n == grid[i].length</code></li>\n\t<li><code>1 &lt;= m, n &lt;= 500</code></li>\n\t<li><code>grid[i][j]</code> is either <code>0</code> or <code>1</code>.</li>\n</ul>\n",
      "lcSlug": "number-of-enclaves",
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
      "description": "There are `n` rooms labeled from `0` to `n - 1` and all the rooms are locked except for room `0`. Your goal is to visit all the rooms. However, you cannot enter a locked room without having its key.\n\nWhen you visit a room, you may find a set of distinct keys in it. Each key has a number on it, denoting which room it unlocks, and you can take all of them with you to unlock the other rooms.\n\nGiven an array `rooms` where `rooms[i]` is the set of keys that you can obtain if you visited room `i`, return `true` if you can visit all the rooms, or `false` otherwise.\n\n \n\nExample 1:\n\nInput: rooms = [[1],[2],[3],[]]\nOutput: true\nExplanation: \nWe visit room 0 and pick up key 1.\nWe then visit room 1 and pick up key 2.\nWe then visit room 2 and pick up key 3.\nWe then visit room 3.\nSince we were able to visit every room, we return true.\n\nExample 2:\n\nInput: rooms = [[1,3],[3,0,1],[2],[0]]\nOutput: false\nExplanation: We can not enter room number 2 since the only key that unlocks it is in that room.\n\n \n\nConstraints:\n\n\t• `n == rooms.length`\n• `2",
      "descriptionHtml": "<p>There are <code>n</code> rooms labeled from <code>0</code> to <code>n - 1</code>&nbsp;and all the rooms are locked except for room <code>0</code>. Your goal is to visit all the rooms. However, you cannot enter a locked room without having its key.</p>\n\n<p>When you visit a room, you may find a set of <strong>distinct keys</strong> in it. Each key has a number on it, denoting which room it unlocks, and you can take all of them with you to unlock the other rooms.</p>\n\n<p>Given an array <code>rooms</code> where <code>rooms[i]</code> is the set of keys that you can obtain if you visited room <code>i</code>, return <code>true</code> <em>if you can visit <strong>all</strong> the rooms, or</em> <code>false</code> <em>otherwise</em>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> rooms = [[1],[2],[3],[]]\n<strong>Output:</strong> true\n<strong>Explanation:</strong> \nWe visit room 0 and pick up key 1.\nWe then visit room 1 and pick up key 2.\nWe then visit room 2 and pick up key 3.\nWe then visit room 3.\nSince we were able to visit every room, we return true.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> rooms = [[1,3],[3,0,1],[2],[0]]\n<strong>Output:</strong> false\n<strong>Explanation:</strong> We can not enter room number 2 since the only key that unlocks it is in that room.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>n == rooms.length</code></li>\n\t<li><code>2 &lt;= n &lt;= 1000</code></li>\n\t<li><code>0 &lt;= rooms[i].length &lt;= 1000</code></li>\n\t<li><code>1 &lt;= sum(rooms[i].length) &lt;= 3000</code></li>\n\t<li><code>0 &lt;= rooms[i][j] &lt; n</code></li>\n\t<li>All the values of <code>rooms[i]</code> are <strong>unique</strong>.</li>\n</ul>\n",
      "lcSlug": "keys-and-rooms",
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
      "description": "There are a total of `numCourses` courses you have to take, labeled from `0` to `numCourses - 1`. You are given an array `prerequisites` where `prerequisites[i] = [ai, bi]` indicates that you must take course `bi` first if you want to take course `ai`.\n\n\t• For example, the pair `[0, 1]`, indicates that to take course `0` you have to first take course `1`.\n\nReturn `true` if you can finish all courses. Otherwise, return `false`.\n\n \n\nExample 1:\n\nInput: numCourses = 2, prerequisites = [[1,0]]\nOutput: true\nExplanation: There are a total of 2 courses to take. \nTo take course 1 you should have finished course 0. So it is possible.\n\nExample 2:\n\nInput: numCourses = 2, prerequisites = [[1,0],[0,1]]\nOutput: false\nExplanation: There are a total of 2 courses to take. \nTo take course 1 you should have finished course 0, and to take course 0 you should also have finished course 1. So it is impossible.\n\n \n\nConstraints:\n\n\t• `1 i, bi",
      "descriptionHtml": "<p>There are a total of <code>numCourses</code> courses you have to take, labeled from <code>0</code> to <code>numCourses - 1</code>. You are given an array <code>prerequisites</code> where <code>prerequisites[i] = [a<sub>i</sub>, b<sub>i</sub>]</code> indicates that you <strong>must</strong> take course <code>b<sub>i</sub></code> first if you want to take course <code>a<sub>i</sub></code>.</p>\n\n<ul>\n\t<li>For example, the pair <code>[0, 1]</code>, indicates that to take course <code>0</code> you have to first take course <code>1</code>.</li>\n</ul>\n\n<p>Return <code>true</code> if you can finish all courses. Otherwise, return <code>false</code>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> numCourses = 2, prerequisites = [[1,0]]\n<strong>Output:</strong> true\n<strong>Explanation:</strong> There are a total of 2 courses to take. \nTo take course 1 you should have finished course 0. So it is possible.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> numCourses = 2, prerequisites = [[1,0],[0,1]]\n<strong>Output:</strong> false\n<strong>Explanation:</strong> There are a total of 2 courses to take. \nTo take course 1 you should have finished course 0, and to take course 0 you should also have finished course 1. So it is impossible.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= numCourses &lt;= 2000</code></li>\n\t<li><code>0 &lt;= prerequisites.length &lt;= 5000</code></li>\n\t<li><code>prerequisites[i].length == 2</code></li>\n\t<li><code>0 &lt;= a<sub>i</sub>, b<sub>i</sub> &lt; numCourses</code></li>\n\t<li>All the pairs prerequisites[i] are <strong>unique</strong>.</li>\n</ul>\n",
      "lcSlug": "course-schedule",
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
      "description": "There are a total of `numCourses` courses you have to take, labeled from `0` to `numCourses - 1`. You are given an array `prerequisites` where `prerequisites[i] = [ai, bi]` indicates that you must take course `bi` first if you want to take course `ai`.\n\n\t• For example, the pair `[0, 1]`, indicates that to take course `0` you have to first take course `1`.\n\nReturn the ordering of courses you should take to finish all courses. If there are many valid answers, return any of them. If it is impossible to finish all courses, return an empty array.\n\n \n\nExample 1:\n\nInput: numCourses = 2, prerequisites = [[1,0]]\nOutput: [0,1]\nExplanation: There are a total of 2 courses to take. To take course 1 you should have finished course 0. So the correct course order is [0,1].\n\nExample 2:\n\nInput: numCourses = 4, prerequisites = [[1,0],[2,0],[3,1],[3,2]]\nOutput: [0,2,1,3]\nExplanation: There are a total of 4 courses to take. To take course 3 you should have finished both courses 1 and 2. Both courses 1 and 2 should be taken after you finished course 0.\nSo one correct course order is [0,1,2,3]. Another correct ordering is [0,2,1,3].\n\nExample 3:\n\nInput: numCourses = 1, prerequisites = []\nOutput: [0]\n\n \n\nConstraints:\n\n\t• `1 i, bi i != bi`\n• All the pairs `[ai, bi]` are distinct.",
      "descriptionHtml": "<p>There are a total of <code>numCourses</code> courses you have to take, labeled from <code>0</code> to <code>numCourses - 1</code>. You are given an array <code>prerequisites</code> where <code>prerequisites[i] = [a<sub>i</sub>, b<sub>i</sub>]</code> indicates that you <strong>must</strong> take course <code>b<sub>i</sub></code> first if you want to take course <code>a<sub>i</sub></code>.</p>\n\n<ul>\n\t<li>For example, the pair <code>[0, 1]</code>, indicates that to take course <code>0</code> you have to first take course <code>1</code>.</li>\n</ul>\n\n<p>Return <em>the ordering of courses you should take to finish all courses</em>. If there are many valid answers, return <strong>any</strong> of them. If it is impossible to finish all courses, return <strong>an empty array</strong>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> numCourses = 2, prerequisites = [[1,0]]\n<strong>Output:</strong> [0,1]\n<strong>Explanation:</strong> There are a total of 2 courses to take. To take course 1 you should have finished course 0. So the correct course order is [0,1].\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> numCourses = 4, prerequisites = [[1,0],[2,0],[3,1],[3,2]]\n<strong>Output:</strong> [0,2,1,3]\n<strong>Explanation:</strong> There are a total of 4 courses to take. To take course 3 you should have finished both courses 1 and 2. Both courses 1 and 2 should be taken after you finished course 0.\nSo one correct course order is [0,1,2,3]. Another correct ordering is [0,2,1,3].\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> numCourses = 1, prerequisites = []\n<strong>Output:</strong> [0]\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= numCourses &lt;= 2000</code></li>\n\t<li><code>0 &lt;= prerequisites.length &lt;= numCourses * (numCourses - 1)</code></li>\n\t<li><code>prerequisites[i].length == 2</code></li>\n\t<li><code>0 &lt;= a<sub>i</sub>, b<sub>i</sub> &lt; numCourses</code></li>\n\t<li><code>a<sub>i</sub> != b<sub>i</sub></code></li>\n\t<li>All the pairs <code>[a<sub>i</sub>, b<sub>i</sub>]</code> are <strong>distinct</strong>.</li>\n</ul>\n",
      "lcSlug": "course-schedule-ii",
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
      "description": "There is a new alien language that uses the English alphabet. However, the order of the letters is unknown to you.\n\nYou are given a list of strings `words` from the alien language's dictionary. Now it is claimed that the strings in `words` are sorted lexicographically by the rules of this new language.\n\nIf this claim is incorrect, and the given arrangement of string in&nbsp;`words`&nbsp;cannot correspond to any order of letters,&nbsp;return&nbsp;`\"\".`\n\nOtherwise, return a string of the unique letters in the new alien language sorted in lexicographically increasing order by the new language's rules. If there are multiple solutions, return any of them.\n\n&nbsp;\n\nExample 1:\n\nInput: words = [\"wrt\",\"wrf\",\"er\",\"ett\",\"rftt\"]\nOutput: \"wertf\"\n\nExample 2:\n\nInput: words = [\"z\",\"x\"]\nOutput: \"zx\"\n\nExample 3:\n\nInput: words = [\"z\",\"x\",\"z\"]\nOutput: \"\"\nExplanation: The order is invalid, so return \"\".\n\n&nbsp;\n\nConstraints:\n\n\t• `1",
      "descriptionHtml": "<p>There is a new alien language that uses the English alphabet. However, the order of the letters is unknown to you.</p>\n\n<p>You are given a list of strings <code>words</code> from the alien language&#39;s dictionary. Now it is claimed that the strings in <code>words</code> are <span data-keyword=\"lexicographically-smaller-string-alien\"><strong>sorted lexicographically</strong></span> by the rules of this new language.</p>\n\n<p>If this claim is incorrect, and the given arrangement of string in&nbsp;<code>words</code>&nbsp;cannot correspond to any order of letters,&nbsp;return&nbsp;<code>&quot;&quot;.</code></p>\n\n<p>Otherwise, return <em>a string of the unique letters in the new alien language sorted in <strong>lexicographically increasing order</strong> by the new language&#39;s rules</em><em>. </em>If there are multiple solutions, return<em> <strong>any of them</strong></em>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> words = [&quot;wrt&quot;,&quot;wrf&quot;,&quot;er&quot;,&quot;ett&quot;,&quot;rftt&quot;]\n<strong>Output:</strong> &quot;wertf&quot;\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> words = [&quot;z&quot;,&quot;x&quot;]\n<strong>Output:</strong> &quot;zx&quot;\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> words = [&quot;z&quot;,&quot;x&quot;,&quot;z&quot;]\n<strong>Output:</strong> &quot;&quot;\n<strong>Explanation:</strong> The order is invalid, so return <code>&quot;&quot;</code>.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 <= words.length <= 100</code></li>\n\t<li><code>1 <= words[i].length <= 100</code></li>\n\t<li><code>words[i]</code> consists of only lowercase English letters.</li>\n</ul>",
      "lcSlug": "alien-dictionary",
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
      "description": "A tree is an undirected graph in which any two vertices are connected by exactly one path. In other words, any connected graph without simple cycles is a tree.\n\nGiven a tree of `n` nodes labelled from `0` to `n - 1`, and an array of `n - 1` `edges` where `edges[i] = [ai, bi]` indicates that there is an undirected edge between the two nodes `ai` and `bi` in the tree, you can choose any node of the tree as the root. When you select a node `x` as the root, the result tree has height `h`. Among all possible rooted trees, those with minimum height (i.e. `min(h)`)  are called minimum height trees (MHTs).\n\nReturn a list of all MHTs' root labels. You can return the answer in any order.\n\nThe height of a rooted tree is the number of edges on the longest downward path between the root and a leaf.\n\n \n\nExample 1:\n\nInput: n = 4, edges = [[1,0],[1,2],[1,3]]\nOutput: [1]\nExplanation: As shown, the height of the tree is 1 when the root is the node with label 1 which is the only MHT.\n\nExample 2:\n\nInput: n = 6, edges = [[3,0],[3,1],[3,2],[3,4],[5,4]]\nOutput: [3,4]\n\n \n\nConstraints:\n\n\t• `1 4`\n• `edges.length == n - 1`\n• `0 i, bi i != bi`\n• All the pairs `(ai, bi)` are distinct.\n• The given input is guaranteed to be a tree and there will be no repeated edges.",
      "descriptionHtml": "<p>A tree is an undirected graph in which any two vertices are connected by&nbsp;<i>exactly</i>&nbsp;one path. In other words, any connected graph without simple cycles is a tree.</p>\n\n<p>Given a tree of <code>n</code> nodes&nbsp;labelled from <code>0</code> to <code>n - 1</code>, and an array of&nbsp;<code>n - 1</code>&nbsp;<code>edges</code> where <code>edges[i] = [a<sub>i</sub>, b<sub>i</sub>]</code> indicates that there is an undirected edge between the two nodes&nbsp;<code>a<sub>i</sub></code> and&nbsp;<code>b<sub>i</sub></code> in the tree,&nbsp;you can choose any node of the tree as the root. When you select a node <code>x</code> as the root, the result tree has height <code>h</code>. Among all possible rooted trees, those with minimum height (i.e. <code>min(h)</code>)&nbsp; are called <strong>minimum height trees</strong> (MHTs).</p>\n\n<p>Return <em>a list of all <strong>MHTs&#39;</strong> root labels</em>.&nbsp;You can return the answer in <strong>any order</strong>.</p>\n\n<p>The <strong>height</strong> of a rooted tree is the number of edges on the longest downward path between the root and a leaf.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2020/09/01/e1.jpg\" style=\"width: 800px; height: 213px;\" />\n<pre>\n<strong>Input:</strong> n = 4, edges = [[1,0],[1,2],[1,3]]\n<strong>Output:</strong> [1]\n<strong>Explanation:</strong> As shown, the height of the tree is 1 when the root is the node with label 1 which is the only MHT.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2020/09/01/e2.jpg\" style=\"width: 800px; height: 321px;\" />\n<pre>\n<strong>Input:</strong> n = 6, edges = [[3,0],[3,1],[3,2],[3,4],[5,4]]\n<strong>Output:</strong> [3,4]\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= n &lt;= 2 * 10<sup>4</sup></code></li>\n\t<li><code>edges.length == n - 1</code></li>\n\t<li><code>0 &lt;= a<sub>i</sub>, b<sub>i</sub> &lt; n</code></li>\n\t<li><code>a<sub>i</sub> != b<sub>i</sub></code></li>\n\t<li>All the pairs <code>(a<sub>i</sub>, b<sub>i</sub>)</code> are distinct.</li>\n\t<li>The given input is <strong>guaranteed</strong> to be a tree and there will be <strong>no repeated</strong> edges.</li>\n</ul>\n",
      "lcSlug": "minimum-height-trees",
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
      "description": "There are a total of `numCourses` courses you have to take, labeled from `0` to `numCourses - 1`. You are given an array `prerequisites` where `prerequisites[i] = [ai, bi]` indicates that you must take course `ai` first if you want to take course `bi`.\n\n\t• For example, the pair `[0, 1]` indicates that you have to take course `0` before you can take course `1`.\n\nPrerequisites can also be indirect. If course `a` is a prerequisite of course `b`, and course `b` is a prerequisite of course `c`, then course `a` is a prerequisite of course `c`.\n\nYou are also given an array `queries` where `queries[j] = [uj, vj]`. For the `jth` query, you should answer whether course `uj` is a prerequisite of course `vj` or not.\n\nReturn a boolean array `answer`, where `answer[j]` is the answer to the `jth` query.\n\n \n\nExample 1:\n\nInput: numCourses = 2, prerequisites = [[1,0]], queries = [[0,1],[1,0]]\nOutput: [false,true]\nExplanation: The pair [1, 0] indicates that you have to take course 1 before you can take course 0.\nCourse 0 is not a prerequisite of course 1, but the opposite is true.\n\nExample 2:\n\nInput: numCourses = 2, prerequisites = [], queries = [[1,0],[0,1]]\nOutput: [false,false]\nExplanation: There are no prerequisites, and each course is independent.\n\nExample 3:\n\nInput: numCourses = 3, prerequisites = [[1,2],[1,0],[2,0]], queries = [[1,0],[1,2]]\nOutput: [true,true]\n\n \n\nConstraints:\n\n\t• `2 i, bi i != bi`\n• All the pairs `[ai, bi]` are unique.\n• The prerequisites graph has no cycles.\n• `1 4`\n• `0 i, vi i != vi`",
      "descriptionHtml": "<p>There are a total of <code>numCourses</code> courses you have to take, labeled from <code>0</code> to <code>numCourses - 1</code>. You are given an array <code>prerequisites</code> where <code>prerequisites[i] = [a<sub>i</sub>, b<sub>i</sub>]</code> indicates that you <strong>must</strong> take course <code>a<sub>i</sub></code> first if you want to take course <code>b<sub>i</sub></code>.</p>\n\n<ul>\n\t<li>For example, the pair <code>[0, 1]</code> indicates that you have to take course <code>0</code> before you can take course <code>1</code>.</li>\n</ul>\n\n<p>Prerequisites can also be <strong>indirect</strong>. If course <code>a</code> is a prerequisite of course <code>b</code>, and course <code>b</code> is a prerequisite of course <code>c</code>, then course <code>a</code> is a prerequisite of course <code>c</code>.</p>\n\n<p>You are also given an array <code>queries</code> where <code>queries[j] = [u<sub>j</sub>, v<sub>j</sub>]</code>. For the <code>j<sup>th</sup></code> query, you should answer whether course <code>u<sub>j</sub></code> is a prerequisite of course <code>v<sub>j</sub></code> or not.</p>\n\n<p>Return <i>a boolean array </i><code>answer</code><i>, where </i><code>answer[j]</code><i> is the answer to the </i><code>j<sup>th</sup></code><i> query.</i></p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2021/05/01/courses4-1-graph.jpg\" style=\"width: 222px; height: 62px;\" />\n<pre>\n<strong>Input:</strong> numCourses = 2, prerequisites = [[1,0]], queries = [[0,1],[1,0]]\n<strong>Output:</strong> [false,true]\n<strong>Explanation:</strong> The pair [1, 0] indicates that you have to take course 1 before you can take course 0.\nCourse 0 is not a prerequisite of course 1, but the opposite is true.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> numCourses = 2, prerequisites = [], queries = [[1,0],[0,1]]\n<strong>Output:</strong> [false,false]\n<strong>Explanation:</strong> There are no prerequisites, and each course is independent.\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2021/05/01/courses4-3-graph.jpg\" style=\"width: 222px; height: 222px;\" />\n<pre>\n<strong>Input:</strong> numCourses = 3, prerequisites = [[1,2],[1,0],[2,0]], queries = [[1,0],[1,2]]\n<strong>Output:</strong> [true,true]\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>2 &lt;= numCourses &lt;= 100</code></li>\n\t<li><code>0 &lt;= prerequisites.length &lt;= (numCourses * (numCourses - 1) / 2)</code></li>\n\t<li><code>prerequisites[i].length == 2</code></li>\n\t<li><code>0 &lt;= a<sub>i</sub>, b<sub>i</sub> &lt;= numCourses - 1</code></li>\n\t<li><code>a<sub>i</sub> != b<sub>i</sub></code></li>\n\t<li>All the pairs <code>[a<sub>i</sub>, b<sub>i</sub>]</code> are <strong>unique</strong>.</li>\n\t<li>The prerequisites graph has no cycles.</li>\n\t<li><code>1 &lt;= queries.length &lt;= 10<sup>4</sup></code></li>\n\t<li><code>0 &lt;= u<sub>i</sub>, v<sub>i</sub> &lt;= numCourses - 1</code></li>\n\t<li><code>u<sub>i</sub> != v<sub>i</sub></code></li>\n</ul>\n",
      "lcSlug": "course-schedule-iv",
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
      "description": "Given a reference of a node in a connected undirected graph.\n\nReturn a deep copy (clone) of the graph.\n\nEach node in the graph contains a value (`int`) and a list (`List[Node]`) of its neighbors.\n\nclass Node {\n    public int val;\n    public List neighbors;\n}\n\n \n\nTest case format:\n\nFor simplicity, each node's value is the same as the node's index (1-indexed). For example, the first node with `val == 1`, the second node with `val == 2`, and so on. The graph is represented in the test case using an adjacency list.\n\nAn adjacency list is a collection of unordered lists used to represent a finite graph. Each list describes the set of neighbors of a node in the graph.\n\nThe given node will always be the first node with `val = 1`. You must return the copy of the given node as a reference to the cloned graph.\n\n \n\nExample 1:\n\nInput: adjList = [[2,4],[1,3],[2,4],[1,3]]\nOutput: [[2,4],[1,3],[2,4],[1,3]]\nExplanation: There are 4 nodes in the graph.\n1st node (val = 1)'s neighbors are 2nd node (val = 2) and 4th node (val = 4).\n2nd node (val = 2)'s neighbors are 1st node (val = 1) and 3rd node (val = 3).\n3rd node (val = 3)'s neighbors are 2nd node (val = 2) and 4th node (val = 4).\n4th node (val = 4)'s neighbors are 1st node (val = 1) and 3rd node (val = 3).\n\nExample 2:\n\nInput: adjList = [[]]\nOutput: [[]]\nExplanation: Note that the input contains one empty list. The graph consists of only one node with val = 1 and it does not have any neighbors.\n\nExample 3:\n\nInput: adjList = []\nOutput: []\nExplanation: This an empty graph, it does not have any nodes.\n\n \n\nConstraints:\n\n\t• The number of nodes in the graph is in the range `[0, 100]`.\n• `1",
      "descriptionHtml": "<p>Given a reference of a node in a <strong><a href=\"https://en.wikipedia.org/wiki/Connectivity_(graph_theory)#Connected_graph\" target=\"_blank\">connected</a></strong> undirected graph.</p>\n\n<p>Return a <a href=\"https://en.wikipedia.org/wiki/Object_copying#Deep_copy\" target=\"_blank\"><strong>deep copy</strong></a> (clone) of the graph.</p>\n\n<p>Each node in the graph contains a value (<code>int</code>) and a list (<code>List[Node]</code>) of its neighbors.</p>\n\n<pre>\nclass Node {\n    public int val;\n    public List&lt;Node&gt; neighbors;\n}\n</pre>\n\n<p>&nbsp;</p>\n\n<p><strong>Test case format:</strong></p>\n\n<p>For simplicity, each node&#39;s value is the same as the node&#39;s index (1-indexed). For example, the first node with <code>val == 1</code>, the second node with <code>val == 2</code>, and so on. The graph is represented in the test case using an adjacency list.</p>\n\n<p><b>An adjacency list</b> is a collection of unordered <b>lists</b> used to represent a finite graph. Each list describes the set of neighbors of a node in the graph.</p>\n\n<p>The given node will always be the first node with <code>val = 1</code>. You must return the <strong>copy of the given node</strong> as a reference to the cloned graph.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2019/11/04/133_clone_graph_question.png\" style=\"width: 454px; height: 500px;\" />\n<pre>\n<strong>Input:</strong> adjList = [[2,4],[1,3],[2,4],[1,3]]\n<strong>Output:</strong> [[2,4],[1,3],[2,4],[1,3]]\n<strong>Explanation:</strong> There are 4 nodes in the graph.\n1st node (val = 1)&#39;s neighbors are 2nd node (val = 2) and 4th node (val = 4).\n2nd node (val = 2)&#39;s neighbors are 1st node (val = 1) and 3rd node (val = 3).\n3rd node (val = 3)&#39;s neighbors are 2nd node (val = 2) and 4th node (val = 4).\n4th node (val = 4)&#39;s neighbors are 1st node (val = 1) and 3rd node (val = 3).\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2020/01/07/graph.png\" style=\"width: 163px; height: 148px;\" />\n<pre>\n<strong>Input:</strong> adjList = [[]]\n<strong>Output:</strong> [[]]\n<strong>Explanation:</strong> Note that the input contains one empty list. The graph consists of only one node with val = 1 and it does not have any neighbors.\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> adjList = []\n<strong>Output:</strong> []\n<strong>Explanation:</strong> This an empty graph, it does not have any nodes.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li>The number of nodes in the graph is in the range <code>[0, 100]</code>.</li>\n\t<li><code>1 &lt;= Node.val &lt;= 100</code></li>\n\t<li><code>Node.val</code> is unique for each node.</li>\n\t<li>There are no repeated edges and no self-loops in the graph.</li>\n\t<li>The Graph is connected and all nodes can be visited starting from the given node.</li>\n</ul>\n",
      "lcSlug": "clone-graph",
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
      "description": "There is an undirected graph with `n` nodes, where each node is numbered between `0` and `n - 1`. You are given a 2D array `graph`, where `graph[u]` is an array of nodes that node `u` is adjacent to. More formally, for each `v` in `graph[u]`, there is an undirected edge between node `u` and node `v`. The graph has the following properties:\n\n\t• There are no self-edges (`graph[u]` does not contain `u`).\n• There are no parallel edges (`graph[u]` does not contain duplicate values).\n• If `v` is in `graph[u]`, then `u` is in `graph[v]` (the graph is undirected).\n• The graph may not be connected, meaning there may be two nodes `u` and `v` such that there is no path between them.\n\nA graph is bipartite if the nodes can be partitioned into two independent sets `A` and `B` such that every edge in the graph connects a node in set `A` and a node in set `B`.\n\nReturn `true` if and only if it is bipartite.\n\n \n\nExample 1:\n\nInput: graph = [[1,2,3],[0,2],[0,1,3],[0,2]]\nOutput: false\nExplanation: There is no way to partition the nodes into two independent sets such that every edge connects a node in one and a node in the other.\n\nExample 2:\n\nInput: graph = [[1,3],[0,2],[1,3],[0,2]]\nOutput: true\nExplanation: We can partition the nodes into two sets: {0, 2} and {1, 3}.\n\n \n\nConstraints:\n\n\t• `graph.length == n`\n• `1",
      "descriptionHtml": "<p>There is an <strong>undirected</strong> graph with <code>n</code> nodes, where each node is numbered between <code>0</code> and <code>n - 1</code>. You are given a 2D array <code>graph</code>, where <code>graph[u]</code> is an array of nodes that node <code>u</code> is adjacent to. More formally, for each <code>v</code> in <code>graph[u]</code>, there is an undirected edge between node <code>u</code> and node <code>v</code>. The graph has the following properties:</p>\n\n<ul>\n\t<li>There are no self-edges (<code>graph[u]</code> does not contain <code>u</code>).</li>\n\t<li>There are no parallel edges (<code>graph[u]</code> does not contain duplicate values).</li>\n\t<li>If <code>v</code> is in <code>graph[u]</code>, then <code>u</code> is in <code>graph[v]</code> (the graph is undirected).</li>\n\t<li>The graph may not be connected, meaning there may be two nodes <code>u</code> and <code>v</code> such that there is no path between them.</li>\n</ul>\n\n<p>A graph is <strong>bipartite</strong> if the nodes can be partitioned into two independent sets <code>A</code> and <code>B</code> such that <strong>every</strong> edge in the graph connects a node in set <code>A</code> and a node in set <code>B</code>.</p>\n\n<p>Return <code>true</code><em> if and only if it is <strong>bipartite</strong></em>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2020/10/21/bi2.jpg\" style=\"width: 222px; height: 222px;\" />\n<pre>\n<strong>Input:</strong> graph = [[1,2,3],[0,2],[0,1,3],[0,2]]\n<strong>Output:</strong> false\n<strong>Explanation:</strong> There is no way to partition the nodes into two independent sets such that every edge connects a node in one and a node in the other.</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2020/10/21/bi1.jpg\" style=\"width: 222px; height: 222px;\" />\n<pre>\n<strong>Input:</strong> graph = [[1,3],[0,2],[1,3],[0,2]]\n<strong>Output:</strong> true\n<strong>Explanation:</strong> We can partition the nodes into two sets: {0, 2} and {1, 3}.</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>graph.length == n</code></li>\n\t<li><code>1 &lt;= n &lt;= 100</code></li>\n\t<li><code>0 &lt;= graph[u].length &lt; n</code></li>\n\t<li><code>0 &lt;= graph[u][i] &lt;= n - 1</code></li>\n\t<li><code>graph[u]</code>&nbsp;does not contain&nbsp;<code>u</code>.</li>\n\t<li>All the values of <code>graph[u]</code> are <strong>unique</strong>.</li>\n\t<li>If <code>graph[u]</code> contains <code>v</code>, then <code>graph[v]</code> contains <code>u</code>.</li>\n</ul>\n",
      "lcSlug": "is-graph-bipartite",
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
      "description": "There are `n` servers numbered from `0` to `n - 1` connected by undirected server-to-server `connections` forming a network where `connections[i] = [ai, bi]` represents a connection between servers `ai` and `bi`. Any server can reach other servers directly or indirectly through the network.\n\nA critical connection is a connection that, if removed, will make some servers unable to reach some other server.\n\nReturn all critical connections in the network in any order.\n\n \n\nExample 1:\n\nInput: n = 4, connections = [[0,1],[1,2],[2,0],[1,3]]\nOutput: [[1,3]]\nExplanation: [[3,1]] is also accepted.\n\nExample 2:\n\nInput: n = 2, connections = [[0,1]]\nOutput: [[0,1]]\n\n \n\nConstraints:\n\n\t• `2 5`\n• `n - 1 5`\n• `0 i, bi i != bi`\n• There are no repeated connections.",
      "descriptionHtml": "<p>There are <code>n</code> servers numbered from <code>0</code> to <code>n - 1</code> connected by undirected server-to-server <code>connections</code> forming a network where <code>connections[i] = [a<sub>i</sub>, b<sub>i</sub>]</code> represents a connection between servers <code>a<sub>i</sub></code> and <code>b<sub>i</sub></code>. Any server can reach other servers directly or indirectly through the network.</p>\n\n<p>A <em>critical connection</em> is a connection that, if removed, will make some servers unable to reach some other server.</p>\n\n<p>Return all critical connections in the network in any order.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2019/09/03/1537_ex1_2.png\" style=\"width: 198px; height: 248px;\" />\n<pre>\n<strong>Input:</strong> n = 4, connections = [[0,1],[1,2],[2,0],[1,3]]\n<strong>Output:</strong> [[1,3]]\n<strong>Explanation:</strong> [[3,1]] is also accepted.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> n = 2, connections = [[0,1]]\n<strong>Output:</strong> [[0,1]]\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>2 &lt;= n &lt;= 10<sup>5</sup></code></li>\n\t<li><code>n - 1 &lt;= connections.length &lt;= 10<sup>5</sup></code></li>\n\t<li><code>0 &lt;= a<sub>i</sub>, b<sub>i</sub> &lt;= n - 1</code></li>\n\t<li><code>a<sub>i</sub> != b<sub>i</sub></code></li>\n\t<li>There are no repeated connections.</li>\n</ul>\n",
      "lcSlug": "critical-connections-in-a-network",
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
      "description": "Given a directed acyclic graph (DAG) of `n` nodes labeled from `0` to `n - 1`, find all possible paths from node `0` to node `n - 1` and return them in any order.\n\nThe graph is given as follows: `graph[i]` is a list of all nodes you can visit from node `i` (i.e., there is a directed edge from node `i` to node `graph[i][j]`).\n\n \n\nExample 1:\n\nInput: graph = [[1,2],[3],[3],[]]\nOutput: [[0,1,3],[0,2,3]]\nExplanation: There are two paths: 0 -> 1 -> 3 and 0 -> 2 -> 3.\n\nExample 2:\n\nInput: graph = [[4,3,1],[3,2,4],[3],[4],[]]\nOutput: [[0,4],[0,3,4],[0,1,3,4],[0,1,2,3,4],[0,1,4]]\n\n \n\nConstraints:\n\n\t• `n == graph.length`\n• `2",
      "descriptionHtml": "<p>Given a directed acyclic graph (<strong>DAG</strong>) of <code>n</code> nodes labeled from <code>0</code> to <code>n - 1</code>, find all possible paths from node <code>0</code> to node <code>n - 1</code> and return them in <strong>any order</strong>.</p>\n\n<p>The graph is given as follows: <code>graph[i]</code> is a list of all nodes you can visit from node <code>i</code> (i.e., there is a directed edge from node <code>i</code> to node <code>graph[i][j]</code>).</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2020/09/28/all_1.jpg\" style=\"width: 242px; height: 242px;\" />\n<pre>\n<strong>Input:</strong> graph = [[1,2],[3],[3],[]]\n<strong>Output:</strong> [[0,1,3],[0,2,3]]\n<strong>Explanation:</strong> There are two paths: 0 -&gt; 1 -&gt; 3 and 0 -&gt; 2 -&gt; 3.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2020/09/28/all_2.jpg\" style=\"width: 423px; height: 301px;\" />\n<pre>\n<strong>Input:</strong> graph = [[4,3,1],[3,2,4],[3],[4],[]]\n<strong>Output:</strong> [[0,4],[0,3,4],[0,1,3,4],[0,1,2,3,4],[0,1,4]]\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>n == graph.length</code></li>\n\t<li><code>2 &lt;= n &lt;= 15</code></li>\n\t<li><code>0 &lt;= graph[i][j] &lt; n</code></li>\n\t<li><code>graph[i][j] != i</code> (i.e., there will be no self-loops).</li>\n\t<li>All the elements of <code>graph[i]</code> are <strong>unique</strong>.</li>\n\t<li>The input graph is <strong>guaranteed</strong> to be a <strong>DAG</strong>.</li>\n</ul>\n",
      "lcSlug": "all-paths-from-source-to-target",
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
      "description": "You are given an array of variable pairs `equations` and an array of real numbers `values`, where `equations[i] = [Ai, Bi]` and `values[i]` represent the equation `Ai / Bi = values[i]`. Each `Ai` or `Bi` is a string that represents a single variable.\n\nYou are also given some `queries`, where `queries[j] = [Cj, Dj]` represents the `jth` query where you must find the answer for `Cj / Dj = ?`.\n\nReturn the answers to all queries. If a single answer cannot be determined, return `-1.0`.\n\nNote: The input is always valid. You may assume that evaluating the queries will not result in division by zero and that there is no contradiction.\n\nNote: The variables that do not occur in the list of equations are undefined, so the answer cannot be determined for them.\n\n \n\nExample 1:\n\nInput: equations = [[\"a\",\"b\"],[\"b\",\"c\"]], values = [2.0,3.0], queries = [[\"a\",\"c\"],[\"b\",\"a\"],[\"a\",\"e\"],[\"a\",\"a\"],[\"x\",\"x\"]]\nOutput: [6.00000,0.50000,-1.00000,1.00000,-1.00000]\nExplanation: \nGiven: a / b = 2.0, b / c = 3.0\nqueries are: a / c = ?, b / a = ?, a / e = ?, a / a = ?, x / x = ? \nreturn: [6.0, 0.5, -1.0, 1.0, -1.0 ]\nnote: x is undefined => -1.0\n\nExample 2:\n\nInput: equations = [[\"a\",\"b\"],[\"b\",\"c\"],[\"bc\",\"cd\"]], values = [1.5,2.5,5.0], queries = [[\"a\",\"c\"],[\"c\",\"b\"],[\"bc\",\"cd\"],[\"cd\",\"bc\"]]\nOutput: [3.75000,0.40000,5.00000,0.20000]\n\nExample 3:\n\nInput: equations = [[\"a\",\"b\"]], values = [0.5], queries = [[\"a\",\"b\"],[\"b\",\"a\"],[\"a\",\"c\"],[\"x\",\"y\"]]\nOutput: [0.50000,2.00000,-1.00000,-1.00000]\n\n \n\nConstraints:\n\n\t• `1 i.length, Bi.length j.length, Dj.length i, Bi, Cj, Dj` consist of lower case English letters and digits.",
      "descriptionHtml": "<p>You are given an array of variable pairs <code>equations</code> and an array of real numbers <code>values</code>, where <code>equations[i] = [A<sub>i</sub>, B<sub>i</sub>]</code> and <code>values[i]</code> represent the equation <code>A<sub>i</sub> / B<sub>i</sub> = values[i]</code>. Each <code>A<sub>i</sub></code> or <code>B<sub>i</sub></code> is a string that represents a single variable.</p>\n\n<p>You are also given some <code>queries</code>, where <code>queries[j] = [C<sub>j</sub>, D<sub>j</sub>]</code> represents the <code>j<sup>th</sup></code> query where you must find the answer for <code>C<sub>j</sub> / D<sub>j</sub> = ?</code>.</p>\n\n<p>Return <em>the answers to all queries</em>. If a single answer cannot be determined, return <code>-1.0</code>.</p>\n\n<p><strong>Note:</strong> The input is always valid. You may assume that evaluating the queries will not result in division by zero and that there is no contradiction.</p>\n\n<p><strong>Note:&nbsp;</strong>The variables that do not occur in the list of equations are undefined, so the answer cannot be determined for them.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> equations = [[&quot;a&quot;,&quot;b&quot;],[&quot;b&quot;,&quot;c&quot;]], values = [2.0,3.0], queries = [[&quot;a&quot;,&quot;c&quot;],[&quot;b&quot;,&quot;a&quot;],[&quot;a&quot;,&quot;e&quot;],[&quot;a&quot;,&quot;a&quot;],[&quot;x&quot;,&quot;x&quot;]]\n<strong>Output:</strong> [6.00000,0.50000,-1.00000,1.00000,-1.00000]\n<strong>Explanation:</strong> \nGiven: <em>a / b = 2.0</em>, <em>b / c = 3.0</em>\nqueries are: <em>a / c = ?</em>, <em>b / a = ?</em>, <em>a / e = ?</em>, <em>a / a = ?</em>, <em>x / x = ? </em>\nreturn: [6.0, 0.5, -1.0, 1.0, -1.0 ]\nnote: x is undefined =&gt; -1.0</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> equations = [[&quot;a&quot;,&quot;b&quot;],[&quot;b&quot;,&quot;c&quot;],[&quot;bc&quot;,&quot;cd&quot;]], values = [1.5,2.5,5.0], queries = [[&quot;a&quot;,&quot;c&quot;],[&quot;c&quot;,&quot;b&quot;],[&quot;bc&quot;,&quot;cd&quot;],[&quot;cd&quot;,&quot;bc&quot;]]\n<strong>Output:</strong> [3.75000,0.40000,5.00000,0.20000]\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> equations = [[&quot;a&quot;,&quot;b&quot;]], values = [0.5], queries = [[&quot;a&quot;,&quot;b&quot;],[&quot;b&quot;,&quot;a&quot;],[&quot;a&quot;,&quot;c&quot;],[&quot;x&quot;,&quot;y&quot;]]\n<strong>Output:</strong> [0.50000,2.00000,-1.00000,-1.00000]\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= equations.length &lt;= 20</code></li>\n\t<li><code>equations[i].length == 2</code></li>\n\t<li><code>1 &lt;= A<sub>i</sub>.length, B<sub>i</sub>.length &lt;= 5</code></li>\n\t<li><code>values.length == equations.length</code></li>\n\t<li><code>0.0 &lt; values[i] &lt;= 20.0</code></li>\n\t<li><code>1 &lt;= queries.length &lt;= 20</code></li>\n\t<li><code>queries[i].length == 2</code></li>\n\t<li><code>1 &lt;= C<sub>j</sub>.length, D<sub>j</sub>.length &lt;= 5</code></li>\n\t<li><code>A<sub>i</sub>, B<sub>i</sub>, C<sub>j</sub>, D<sub>j</sub></code> consist of lower case English letters and digits.</li>\n</ul>\n",
      "lcSlug": "evaluate-division",
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
      "description": "You are given a list of airline `tickets` where `tickets[i] = [fromi, toi]` represent the departure and the arrival airports of one flight. Reconstruct the itinerary in order and return it.\n\nAll of the tickets belong to a man who departs from `\"JFK\"`, thus, the itinerary must begin with `\"JFK\"`. If there are multiple valid itineraries, you should return the itinerary that has the smallest lexical order when read as a single string.\n\n\t• For example, the itinerary `[\"JFK\", \"LGA\"]` has a smaller lexical order than `[\"JFK\", \"LGB\"]`.\n\nYou may assume all tickets form at least one valid itinerary. You must use all the tickets once and only once.\n\n \n\nExample 1:\n\nInput: tickets = [[\"MUC\",\"LHR\"],[\"JFK\",\"MUC\"],[\"SFO\",\"SJC\"],[\"LHR\",\"SFO\"]]\nOutput: [\"JFK\",\"MUC\",\"LHR\",\"SFO\",\"SJC\"]\n\nExample 2:\n\nInput: tickets = [[\"JFK\",\"SFO\"],[\"JFK\",\"ATL\"],[\"SFO\",\"ATL\"],[\"ATL\",\"JFK\"],[\"ATL\",\"SFO\"]]\nOutput: [\"JFK\",\"ATL\",\"JFK\",\"SFO\",\"ATL\",\"SFO\"]\nExplanation: Another possible reconstruction is [\"JFK\",\"SFO\",\"ATL\",\"JFK\",\"ATL\",\"SFO\"] but it is larger in lexical order.\n\n \n\nConstraints:\n\n\t• `1 i.length == 3`\n• `toi.length == 3`\n• `fromi` and `toi` consist of uppercase English letters.\n• `fromi != toi`",
      "descriptionHtml": "<p>You are given a list of airline <code>tickets</code> where <code>tickets[i] = [from<sub>i</sub>, to<sub>i</sub>]</code> represent the departure and the arrival airports of one flight. Reconstruct the itinerary in order and return it.</p>\n\n<p>All of the tickets belong to a man who departs from <code>&quot;JFK&quot;</code>, thus, the itinerary must begin with <code>&quot;JFK&quot;</code>. If there are multiple valid itineraries, you should return the itinerary that has the smallest lexical order when read as a single string.</p>\n\n<ul>\n\t<li>For example, the itinerary <code>[&quot;JFK&quot;, &quot;LGA&quot;]</code> has a smaller lexical order than <code>[&quot;JFK&quot;, &quot;LGB&quot;]</code>.</li>\n</ul>\n\n<p>You may assume all tickets form at least one valid itinerary. You must use all the tickets once and only once.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2021/03/14/itinerary1-graph.jpg\" style=\"width: 382px; height: 222px;\" />\n<pre>\n<strong>Input:</strong> tickets = [[&quot;MUC&quot;,&quot;LHR&quot;],[&quot;JFK&quot;,&quot;MUC&quot;],[&quot;SFO&quot;,&quot;SJC&quot;],[&quot;LHR&quot;,&quot;SFO&quot;]]\n<strong>Output:</strong> [&quot;JFK&quot;,&quot;MUC&quot;,&quot;LHR&quot;,&quot;SFO&quot;,&quot;SJC&quot;]\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2021/03/14/itinerary2-graph.jpg\" style=\"width: 222px; height: 230px;\" />\n<pre>\n<strong>Input:</strong> tickets = [[&quot;JFK&quot;,&quot;SFO&quot;],[&quot;JFK&quot;,&quot;ATL&quot;],[&quot;SFO&quot;,&quot;ATL&quot;],[&quot;ATL&quot;,&quot;JFK&quot;],[&quot;ATL&quot;,&quot;SFO&quot;]]\n<strong>Output:</strong> [&quot;JFK&quot;,&quot;ATL&quot;,&quot;JFK&quot;,&quot;SFO&quot;,&quot;ATL&quot;,&quot;SFO&quot;]\n<strong>Explanation:</strong> Another possible reconstruction is [&quot;JFK&quot;,&quot;SFO&quot;,&quot;ATL&quot;,&quot;JFK&quot;,&quot;ATL&quot;,&quot;SFO&quot;] but it is larger in lexical order.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= tickets.length &lt;= 300</code></li>\n\t<li><code>tickets[i].length == 2</code></li>\n\t<li><code>from<sub>i</sub>.length == 3</code></li>\n\t<li><code>to<sub>i</sub>.length == 3</code></li>\n\t<li><code>from<sub>i</sub></code> and <code>to<sub>i</sub></code> consist of uppercase English letters.</li>\n\t<li><code>from<sub>i</sub> != to<sub>i</sub></code></li>\n</ul>\n",
      "lcSlug": "reconstruct-itinerary",
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
      "description": "We want to split a group of `n` people (labeled from `1` to `n`) into two groups of any size. Each person may dislike some other people, and they should not go into the same group.\n\nGiven the integer `n` and the array `dislikes` where `dislikes[i] = [ai, bi]` indicates that the person labeled `ai` does not like the person labeled `bi`, return `true` if it is possible to split everyone into two groups in this way.\n\n \n\nExample 1:\n\nInput: n = 4, dislikes = [[1,2],[1,3],[2,4]]\nOutput: true\nExplanation: The first group has [1,4], and the second group has [2,3].\n\nExample 2:\n\nInput: n = 3, dislikes = [[1,2],[1,3],[2,3]]\nOutput: false\nExplanation: We need at least 3 groups to divide them. We cannot put them in two groups.\n\n \n\nConstraints:\n\n\t• `1 4`\n• `dislikes[i].length == 2`\n• `1 i i",
      "descriptionHtml": "<p>We want to split a group of <code>n</code> people (labeled from <code>1</code> to <code>n</code>) into two groups of <strong>any size</strong>. Each person may dislike some other people, and they should not go into the same group.</p>\n\n<p>Given the integer <code>n</code> and the array <code>dislikes</code> where <code>dislikes[i] = [a<sub>i</sub>, b<sub>i</sub>]</code> indicates that the person labeled <code>a<sub>i</sub></code> does not like the person labeled <code>b<sub>i</sub></code>, return <code>true</code> <em>if it is possible to split everyone into two groups in this way</em>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> n = 4, dislikes = [[1,2],[1,3],[2,4]]\n<strong>Output:</strong> true\n<strong>Explanation:</strong> The first group has [1,4], and the second group has [2,3].\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> n = 3, dislikes = [[1,2],[1,3],[2,3]]\n<strong>Output:</strong> false\n<strong>Explanation:</strong> We need at least 3 groups to divide them. We cannot put them in two groups.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= n &lt;= 2000</code></li>\n\t<li><code>0 &lt;= dislikes.length &lt;= 10<sup>4</sup></code></li>\n\t<li><code>dislikes[i].length == 2</code></li>\n\t<li><code>1 &lt;= a<sub>i</sub> &lt; b<sub>i</sub> &lt;= n</code></li>\n\t<li>All the pairs of <code>dislikes</code> are <strong>unique</strong>.</li>\n</ul>\n",
      "lcSlug": "possible-bipartition",
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
      "description": "You are given a network of `n` nodes, labeled from `1` to `n`. You are also given `times`, a list of travel times as directed edges `times[i] = (ui, vi, wi)`, where `ui` is the source node, `vi` is the target node, and `wi` is the time it takes for a signal to travel from source to target.\n\nWe will send a signal from a given node `k`. Return the minimum time it takes for all the `n` nodes to receive the signal. If it is impossible for all the `n` nodes to receive the signal, return `-1`.\n\n \n\nExample 1:\n\nInput: times = [[2,1,1],[2,3,1],[3,4,1]], n = 4, k = 2\nOutput: 2\n\nExample 2:\n\nInput: times = [[1,2,1]], n = 2, k = 1\nOutput: 1\n\nExample 3:\n\nInput: times = [[1,2,1]], n = 2, k = 2\nOutput: -1\n\n \n\nConstraints:\n\n\t• `1 i, vi i != vi`\n• `0 i i, vi)` are unique. (i.e., no multiple edges.)",
      "descriptionHtml": "<p>You are given a network of <code>n</code> nodes, labeled from <code>1</code> to <code>n</code>. You are also given <code>times</code>, a list of travel times as directed edges <code>times[i] = (u<sub>i</sub>, v<sub>i</sub>, w<sub>i</sub>)</code>, where <code>u<sub>i</sub></code> is the source node, <code>v<sub>i</sub></code> is the target node, and <code>w<sub>i</sub></code> is the time it takes for a signal to travel from source to target.</p>\n\n<p>We will send a signal from a given node <code>k</code>. Return <em>the <strong>minimum</strong> time it takes for all the</em> <code>n</code> <em>nodes to receive the signal</em>. If it is impossible for all the <code>n</code> nodes to receive the signal, return <code>-1</code>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2019/05/23/931_example_1.png\" style=\"width: 217px; height: 239px;\" />\n<pre>\n<strong>Input:</strong> times = [[2,1,1],[2,3,1],[3,4,1]], n = 4, k = 2\n<strong>Output:</strong> 2\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> times = [[1,2,1]], n = 2, k = 1\n<strong>Output:</strong> 1\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> times = [[1,2,1]], n = 2, k = 2\n<strong>Output:</strong> -1\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= k &lt;= n &lt;= 100</code></li>\n\t<li><code>1 &lt;= times.length &lt;= 6000</code></li>\n\t<li><code>times[i].length == 3</code></li>\n\t<li><code>1 &lt;= u<sub>i</sub>, v<sub>i</sub> &lt;= n</code></li>\n\t<li><code>u<sub>i</sub> != v<sub>i</sub></code></li>\n\t<li><code>0 &lt;= w<sub>i</sub> &lt;= 100</code></li>\n\t<li>All the pairs <code>(u<sub>i</sub>, v<sub>i</sub>)</code> are <strong>unique</strong>. (i.e., no multiple edges.)</li>\n</ul>\n",
      "lcSlug": "network-delay-time",
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
      "description": "There are `n` cities connected by some number of flights. You are given an array `flights` where `flights[i] = [fromi, toi, pricei]` indicates that there is a flight from city `fromi` to city `toi` with cost `pricei`.\n\nYou are also given three integers `src`, `dst`, and `k`, return the cheapest price from `src` to `dst` with at most `k` stops. If there is no such route, return `-1`.\n\n \n\nExample 1:\n\nInput: n = 4, flights = [[0,1,100],[1,2,100],[2,0,100],[1,3,600],[2,3,200]], src = 0, dst = 3, k = 1\nOutput: 700\nExplanation:\nThe graph is shown above.\nThe optimal path with at most 1 stop from city 0 to 3 is marked in red and has cost 100 + 600 = 700.\nNote that the path through cities [0,1,2,3] is cheaper but is invalid because it uses 2 stops.\n\nExample 2:\n\nInput: n = 3, flights = [[0,1,100],[1,2,100],[0,2,500]], src = 0, dst = 2, k = 1\nOutput: 200\nExplanation:\nThe graph is shown above.\nThe optimal path with at most 1 stop from city 0 to 2 is marked in red and has cost 100 + 100 = 200.\n\nExample 3:\n\nInput: n = 3, flights = [[0,1,100],[1,2,100],[0,2,500]], src = 0, dst = 2, k = 0\nOutput: 500\nExplanation:\nThe graph is shown above.\nThe optimal path with no stops from city 0 to 2 is marked in red and has cost 500.\n\n \n\nConstraints:\n\n\t• `2 i, toi i != toi`\n• `1 i 4`\n• There will not be any multiple flights between two cities.\n• `0",
      "descriptionHtml": "<p>There are <code>n</code> cities connected by some number of flights. You are given an array <code>flights</code> where <code>flights[i] = [from<sub>i</sub>, to<sub>i</sub>, price<sub>i</sub>]</code> indicates that there is a flight from city <code>from<sub>i</sub></code> to city <code>to<sub>i</sub></code> with cost <code>price<sub>i</sub></code>.</p>\n\n<p>You are also given three integers <code>src</code>, <code>dst</code>, and <code>k</code>, return <em><strong>the cheapest price</strong> from </em><code>src</code><em> to </em><code>dst</code><em> with at most </em><code>k</code><em> stops. </em>If there is no such route, return<em> </em><code>-1</code>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2022/03/18/cheapest-flights-within-k-stops-3drawio.png\" style=\"width: 332px; height: 392px;\" />\n<pre>\n<strong>Input:</strong> n = 4, flights = [[0,1,100],[1,2,100],[2,0,100],[1,3,600],[2,3,200]], src = 0, dst = 3, k = 1\n<strong>Output:</strong> 700\n<strong>Explanation:</strong>\nThe graph is shown above.\nThe optimal path with at most 1 stop from city 0 to 3 is marked in red and has cost 100 + 600 = 700.\nNote that the path through cities [0,1,2,3] is cheaper but is invalid because it uses 2 stops.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2022/03/18/cheapest-flights-within-k-stops-1drawio.png\" style=\"width: 332px; height: 242px;\" />\n<pre>\n<strong>Input:</strong> n = 3, flights = [[0,1,100],[1,2,100],[0,2,500]], src = 0, dst = 2, k = 1\n<strong>Output:</strong> 200\n<strong>Explanation:</strong>\nThe graph is shown above.\nThe optimal path with at most 1 stop from city 0 to 2 is marked in red and has cost 100 + 100 = 200.\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2022/03/18/cheapest-flights-within-k-stops-2drawio.png\" style=\"width: 332px; height: 242px;\" />\n<pre>\n<strong>Input:</strong> n = 3, flights = [[0,1,100],[1,2,100],[0,2,500]], src = 0, dst = 2, k = 0\n<strong>Output:</strong> 500\n<strong>Explanation:</strong>\nThe graph is shown above.\nThe optimal path with no stops from city 0 to 2 is marked in red and has cost 500.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>2 &lt;= n &lt;= 100</code></li>\n\t<li><code>0 &lt;= flights.length &lt;= (n * (n - 1) / 2)</code></li>\n\t<li><code>flights[i].length == 3</code></li>\n\t<li><code>0 &lt;= from<sub>i</sub>, to<sub>i</sub> &lt; n</code></li>\n\t<li><code>from<sub>i</sub> != to<sub>i</sub></code></li>\n\t<li><code>1 &lt;= price<sub>i</sub> &lt;= 10<sup>4</sup></code></li>\n\t<li>There will not be any multiple flights between two cities.</li>\n\t<li><code>0 &lt;= src, dst, k &lt; n</code></li>\n\t<li><code>src != dst</code></li>\n</ul>\n",
      "lcSlug": "cheapest-flights-within-k-stops",
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
      "description": "You are a hiker preparing for an upcoming hike. You are given `heights`, a 2D array of size `rows x columns`, where `heights[row][col]` represents the height of cell `(row, col)`. You are situated in the top-left cell, `(0, 0)`, and you hope to travel to the bottom-right cell, `(rows-1, columns-1)` (i.e., 0-indexed). You can move up, down, left, or right, and you wish to find a route that requires the minimum effort.\n\nA route's effort is the maximum absolute difference in heights between two consecutive cells of the route.\n\nReturn the minimum effort required to travel from the top-left cell to the bottom-right cell.\n\n \n\nExample 1:\n\nInput: heights = [[1,2,2],[3,8,2],[5,3,5]]\nOutput: 2\nExplanation: The route of [1,3,5,3,5] has a maximum absolute difference of 2 in consecutive cells.\nThis is better than the route of [1,2,2,2,5], where the maximum absolute difference is 3.\n\nExample 2:\n\nInput: heights = [[1,2,3],[3,8,4],[5,3,5]]\nOutput: 1\nExplanation: The route of [1,2,3,4,5] has a maximum absolute difference of 1 in consecutive cells, which is better than route [1,3,5,3,5].\n\nExample 3:\n\nInput: heights = [[1,2,1,1,1],[1,2,1,2,1],[1,2,1,2,1],[1,2,1,2,1],[1,1,1,2,1]]\nOutput: 0\nExplanation: This route does not require any effort.\n\n \n\nConstraints:\n\n\t• `rows == heights.length`\n• `columns == heights[i].length`\n• `1 6`",
      "descriptionHtml": "<p>You are a hiker preparing for an upcoming hike. You are given <code>heights</code>, a 2D array of size <code>rows x columns</code>, where <code>heights[row][col]</code> represents the height of cell <code>(row, col)</code>. You are situated in the top-left cell, <code>(0, 0)</code>, and you hope to travel to the bottom-right cell, <code>(rows-1, columns-1)</code> (i.e.,&nbsp;<strong>0-indexed</strong>). You can move <strong>up</strong>, <strong>down</strong>, <strong>left</strong>, or <strong>right</strong>, and you wish to find a route that requires the minimum <strong>effort</strong>.</p>\n\n<p>A route&#39;s <strong>effort</strong> is the <strong>maximum absolute difference</strong><strong> </strong>in heights between two consecutive cells of the route.</p>\n\n<p>Return <em>the minimum <strong>effort</strong> required to travel from the top-left cell to the bottom-right cell.</em></p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<p><img alt=\"\" src=\"https://assets.leetcode.com/uploads/2020/10/04/ex1.png\" style=\"width: 300px; height: 300px;\" /></p>\n\n<pre>\n<strong>Input:</strong> heights = [[1,2,2],[3,8,2],[5,3,5]]\n<strong>Output:</strong> 2\n<strong>Explanation:</strong> The route of [1,3,5,3,5] has a maximum absolute difference of 2 in consecutive cells.\nThis is better than the route of [1,2,2,2,5], where the maximum absolute difference is 3.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<p><img alt=\"\" src=\"https://assets.leetcode.com/uploads/2020/10/04/ex2.png\" style=\"width: 300px; height: 300px;\" /></p>\n\n<pre>\n<strong>Input:</strong> heights = [[1,2,3],[3,8,4],[5,3,5]]\n<strong>Output:</strong> 1\n<strong>Explanation:</strong> The route of [1,2,3,4,5] has a maximum absolute difference of 1 in consecutive cells, which is better than route [1,3,5,3,5].\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2020/10/04/ex3.png\" style=\"width: 300px; height: 300px;\" />\n<pre>\n<strong>Input:</strong> heights = [[1,2,1,1,1],[1,2,1,2,1],[1,2,1,2,1],[1,2,1,2,1],[1,1,1,2,1]]\n<strong>Output:</strong> 0\n<strong>Explanation:</strong> This route does not require any effort.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>rows == heights.length</code></li>\n\t<li><code>columns == heights[i].length</code></li>\n\t<li><code>1 &lt;= rows, columns &lt;= 100</code></li>\n\t<li><code>1 &lt;= heights[i][j] &lt;= 10<sup>6</sup></code></li>\n</ul>\n",
      "lcSlug": "path-with-minimum-effort",
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
      "description": "There are `n` cities numbered from `0` to `n-1`. Given the array `edges` where `edges[i] = [fromi, toi, weighti]` represents a bidirectional and weighted edge between cities `fromi` and `toi`, and given the integer `distanceThreshold`.\n\nReturn the city with the smallest number of cities that are reachable through some path and whose distance is at most `distanceThreshold`, If there are multiple such cities, return the city with the greatest number.\n\nNotice that the distance of a path connecting cities i and j is equal to the sum of the edges' weights along that path.\n\n \n\nExample 1:\n\nInput: n = 4, edges = [[0,1,3],[1,2,1],[1,3,4],[2,3,1]], distanceThreshold = 4\nOutput: 3\nExplanation: The figure above describes the graph. \nThe neighboring cities at a distanceThreshold = 4 for each city are:\nCity 0 -> [City 1, City 2] \nCity 1 -> [City 0, City 2, City 3] \nCity 2 -> [City 0, City 1, City 3] \nCity 3 -> [City 1, City 2] \nCities 0 and 3 have 2 neighboring cities at a distanceThreshold = 4, but we have to return city 3 since it has the greatest number.\n\nExample 2:\n\nInput: n = 5, edges = [[0,1,2],[0,4,8],[1,2,3],[1,4,2],[2,3,1],[3,4,1]], distanceThreshold = 2\nOutput: 0\nExplanation: The figure above describes the graph. \nThe neighboring cities at a distanceThreshold = 2 for each city are:\nCity 0 -> [City 1] \nCity 1 -> [City 0, City 4] \nCity 2 -> [City 3, City 4] \nCity 3 -> [City 2, City 4]\nCity 4 -> [City 1, City 2, City 3] \nThe city 0 has 1 neighboring city at a distanceThreshold = 2.\n\n \n\nConstraints:\n\n\t• `2 i i i, distanceThreshold i, toi)` are distinct.",
      "descriptionHtml": "<p>There are <code>n</code> cities numbered from <code>0</code> to <code>n-1</code>. Given the array <code>edges</code> where <code>edges[i] = [from<sub>i</sub>, to<sub>i</sub>, weight<sub>i</sub>]</code> represents a bidirectional and weighted edge between cities <code>from<sub>i</sub></code> and <code>to<sub>i</sub></code>, and given the integer <code>distanceThreshold</code>.</p>\n\n<p>Return the city with the smallest number of cities that are reachable through some path and whose distance is <strong>at most</strong> <code>distanceThreshold</code>, If there are multiple such cities, return the city with the greatest number.</p>\n\n<p>Notice that the distance of a path connecting cities <em><strong>i</strong></em> and <em><strong>j</strong></em> is equal to the sum of the edges&#39; weights along that path.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<p><img alt=\"\" src=\"https://assets.leetcode.com/uploads/2024/08/23/problem1334example1.png\" style=\"width: 300px; height: 224px;\" /></p>\n\n<pre>\n<strong>Input:</strong> n = 4, edges = [[0,1,3],[1,2,1],[1,3,4],[2,3,1]], distanceThreshold = 4\n<strong>Output:</strong> 3\n<strong>Explanation: </strong>The figure above describes the graph.&nbsp;\nThe neighboring cities at a distanceThreshold = 4 for each city are:\nCity 0 -&gt; [City 1, City 2]&nbsp;\nCity 1 -&gt; [City 0, City 2, City 3]&nbsp;\nCity 2 -&gt; [City 0, City 1, City 3]&nbsp;\nCity 3 -&gt; [City 1, City 2]&nbsp;\nCities 0 and 3 have 2 neighboring cities at a distanceThreshold = 4, but we have to return city 3 since it has the greatest number.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<p><img alt=\"\" src=\"https://assets.leetcode.com/uploads/2024/08/23/problem1334example0.png\" style=\"width: 300px; height: 224px;\" /></p>\n\n<pre>\n<strong>Input:</strong> n = 5, edges = [[0,1,2],[0,4,8],[1,2,3],[1,4,2],[2,3,1],[3,4,1]], distanceThreshold = 2\n<strong>Output:</strong> 0\n<strong>Explanation: </strong>The figure above describes the graph.&nbsp;\nThe neighboring cities at a distanceThreshold = 2 for each city are:\nCity 0 -&gt; [City 1]&nbsp;\nCity 1 -&gt; [City 0, City 4]&nbsp;\nCity 2 -&gt; [City 3, City 4]&nbsp;\nCity 3 -&gt; [City 2, City 4]\nCity 4 -&gt; [City 1, City 2, City 3]&nbsp;\nThe city 0 has 1 neighboring city at a distanceThreshold = 2.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>2 &lt;= n &lt;= 100</code></li>\n\t<li><code>1 &lt;= edges.length &lt;= n * (n - 1) / 2</code></li>\n\t<li><code>edges[i].length == 3</code></li>\n\t<li><code>0 &lt;= from<sub>i</sub> &lt; to<sub>i</sub> &lt; n</code></li>\n\t<li><code>1 &lt;= weight<sub>i</sub>,&nbsp;distanceThreshold &lt;= 10^4</code></li>\n\t<li>All pairs <code>(from<sub>i</sub>, to<sub>i</sub>)</code> are distinct.</li>\n</ul>\n",
      "lcSlug": "find-the-city-with-the-smallest-number-of-neighbors-at-a-threshold-distance",
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
      "description": "You are given an `n x n` integer matrix `grid` where each value `grid[i][j]` represents the elevation at that point `(i, j)`.\n\nIt starts raining, and water gradually rises over time. At time `t`, the water level is `t`, meaning any cell with elevation less than equal to `t` is submerged or reachable.\n\nYou can swim from a square to another 4-directionally adjacent square if and only if the elevation of both squares individually are at most `t`. You can swim infinite distances in zero time. Of course, you must stay within the boundaries of the grid during your swim.\n\nReturn the minimum time until you can reach the bottom right square `(n - 1, n - 1)` if you start at the top left square `(0, 0)`.\n\n \n\nExample 1:\n\nInput: grid = [[0,2],[1,3]]\nOutput: 3\nExplanation:\nAt time 0, you are in grid location (0, 0).\nYou cannot go anywhere else because 4-directionally adjacent neighbors have a higher elevation than t = 0.\nYou cannot reach point (1, 1) until time 3.\nWhen the depth of water is 3, we can swim anywhere inside the grid.\n\nExample 2:\n\nInput: grid = [[0,1,2,3,4],[24,23,22,21,5],[12,13,14,15,16],[11,17,18,19,20],[10,9,8,7,6]]\nOutput: 16\nExplanation: The final route is shown.\nWe need to wait until time 16 so that (0, 0) and (4, 4) are connected.\n\n \n\nConstraints:\n\n\t• `n == grid.length`\n• `n == grid[i].length`\n• `1 2`\n• Each value `grid[i][j]` is unique.",
      "descriptionHtml": "<p>You are given an <code>n x n</code> integer matrix <code>grid</code> where each value <code>grid[i][j]</code> represents the elevation at that point <code>(i, j)</code>.</p>\n\n<p>It starts raining, and water gradually rises over time. At time <code>t</code>, the water level is <code>t</code>, meaning <strong>any</strong> cell with elevation less than equal to <code>t</code> is submerged or reachable.</p>\n\n<p>You can swim from a square to another 4-directionally adjacent square if and only if the elevation of both squares individually are at most <code>t</code>. You can swim infinite distances in zero time. Of course, you must stay within the boundaries of the grid during your swim.</p>\n\n<p>Return <em>the minimum time until you can reach the bottom right square </em><code>(n - 1, n - 1)</code><em> if you start at the top left square </em><code>(0, 0)</code>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2021/06/29/swim1-grid.jpg\" style=\"width: 164px; height: 165px;\" />\n<pre>\n<strong>Input:</strong> grid = [[0,2],[1,3]]\n<strong>Output:</strong> 3\nExplanation:\nAt time 0, you are in grid location (0, 0).\nYou cannot go anywhere else because 4-directionally adjacent neighbors have a higher elevation than t = 0.\nYou cannot reach point (1, 1) until time 3.\nWhen the depth of water is 3, we can swim anywhere inside the grid.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2021/06/29/swim2-grid-1.jpg\" style=\"width: 404px; height: 405px;\" />\n<pre>\n<strong>Input:</strong> grid = [[0,1,2,3,4],[24,23,22,21,5],[12,13,14,15,16],[11,17,18,19,20],[10,9,8,7,6]]\n<strong>Output:</strong> 16\n<strong>Explanation:</strong> The final route is shown.\nWe need to wait until time 16 so that (0, 0) and (4, 4) are connected.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>n == grid.length</code></li>\n\t<li><code>n == grid[i].length</code></li>\n\t<li><code>1 &lt;= n &lt;= 50</code></li>\n\t<li><code>0 &lt;= grid[i][j] &lt;&nbsp;n<sup>2</sup></code></li>\n\t<li>Each value <code>grid[i][j]</code> is <strong>unique</strong>.</li>\n</ul>\n",
      "lcSlug": "swim-in-rising-water",
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
      "description": "You are given a 0-indexed 2D integer array `grid` of size `m x n`. Each cell has one of two values:\n\n\t• `0` represents an empty cell,\n• `1` represents an obstacle that may be removed.\n\nYou can move up, down, left, or right from and to an empty cell.\n\nReturn the minimum number of obstacles to remove so you can move from the upper left corner `(0, 0)` to the lower right corner `(m - 1, n - 1)`.\n\n \n\nExample 1:\n\nInput: grid = [[0,1,1],[1,1,0],[1,1,0]]\nOutput: 2\nExplanation: We can remove the obstacles at (0, 1) and (0, 2) to create a path from (0, 0) to (2, 2).\nIt can be shown that we need to remove at least 2 obstacles, so we return 2.\nNote that there may be other ways to remove 2 obstacles to create a path.\n\nExample 2:\n\nInput: grid = [[0,1,0,0,0],[0,1,0,1,0],[0,0,0,1,0]]\nOutput: 0\nExplanation: We can move from (0, 0) to (2, 4) without removing any obstacles, so we return 0.\n\n \n\nConstraints:\n\n\t• `m == grid.length`\n• `n == grid[i].length`\n• `1 5`\n• `2 5`\n• `grid[i][j]` is either `0` or `1`.\n• `grid[0][0] == grid[m - 1][n - 1] == 0`",
      "descriptionHtml": "<p>You are given a <strong>0-indexed</strong> 2D integer array <code>grid</code> of size <code>m x n</code>. Each cell has one of two values:</p>\n\n<ul>\n\t<li><code>0</code> represents an <strong>empty</strong> cell,</li>\n\t<li><code>1</code> represents an <strong>obstacle</strong> that may be removed.</li>\n</ul>\n\n<p>You can move up, down, left, or right from and to an empty cell.</p>\n\n<p>Return <em>the <strong>minimum</strong> number of <strong>obstacles</strong> to <strong>remove</strong> so you can move from the upper left corner </em><code>(0, 0)</code><em> to the lower right corner </em><code>(m - 1, n - 1)</code>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2022/04/06/example1drawio-1.png\" style=\"width: 605px; height: 246px;\" />\n<pre>\n<strong>Input:</strong> grid = [[0,1,1],[1,1,0],[1,1,0]]\n<strong>Output:</strong> 2\n<strong>Explanation:</strong> We can remove the obstacles at (0, 1) and (0, 2) to create a path from (0, 0) to (2, 2).\nIt can be shown that we need to remove at least 2 obstacles, so we return 2.\nNote that there may be other ways to remove 2 obstacles to create a path.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2022/04/06/example1drawio.png\" style=\"width: 405px; height: 246px;\" />\n<pre>\n<strong>Input:</strong> grid = [[0,1,0,0,0],[0,1,0,1,0],[0,0,0,1,0]]\n<strong>Output:</strong> 0\n<strong>Explanation:</strong> We can move from (0, 0) to (2, 4) without removing any obstacles, so we return 0.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>m == grid.length</code></li>\n\t<li><code>n == grid[i].length</code></li>\n\t<li><code>1 &lt;= m, n &lt;= 10<sup>5</sup></code></li>\n\t<li><code>2 &lt;= m * n &lt;= 10<sup>5</sup></code></li>\n\t<li><code>grid[i][j]</code> is either <code>0</code> <strong>or</strong> <code>1</code>.</li>\n\t<li><code>grid[0][0] == grid[m - 1][n - 1] == 0</code></li>\n</ul>\n",
      "lcSlug": "minimum-obstacle-removal-to-reach-corner",
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
      "description": "You are given an integer `n`, the number of nodes in a directed graph where the nodes are labeled from `0` to `n - 1`. Each edge is red or blue in this graph, and there could be self-edges and parallel edges.\n\nYou are given two arrays `redEdges` and `blueEdges` where:\n\n\t• `redEdges[i] = [ai, bi]` indicates that there is a directed red edge from node `ai` to node `bi` in the graph, and\n• `blueEdges[j] = [uj, vj]` indicates that there is a directed blue edge from node `uj` to node `vj` in the graph.\n\nReturn an array `answer` of length `n`, where each `answer[x]` is the length of the shortest path from node `0` to node `x` such that the edge colors alternate along the path, or `-1` if such a path does not exist.\n\n \n\nExample 1:\n\nInput: n = 3, redEdges = [[0,1],[1,2]], blueEdges = []\nOutput: [0,1,-1]\n\nExample 2:\n\nInput: n = 3, redEdges = [[0,1]], blueEdges = [[2,1]]\nOutput: [0,1,-1]\n\n \n\nConstraints:\n\n\t• `1 i, bi, uj, vj",
      "descriptionHtml": "<p>You are given an integer <code>n</code>, the number of nodes in a directed graph where the nodes are labeled from <code>0</code> to <code>n - 1</code>. Each edge is red or blue in this graph, and there could be self-edges and parallel edges.</p>\n\n<p>You are given two arrays <code>redEdges</code> and <code>blueEdges</code> where:</p>\n\n<ul>\n\t<li><code>redEdges[i] = [a<sub>i</sub>, b<sub>i</sub>]</code> indicates that there is a directed red edge from node <code>a<sub>i</sub></code> to node <code>b<sub>i</sub></code> in the graph, and</li>\n\t<li><code>blueEdges[j] = [u<sub>j</sub>, v<sub>j</sub>]</code> indicates that there is a directed blue edge from node <code>u<sub>j</sub></code> to node <code>v<sub>j</sub></code> in the graph.</li>\n</ul>\n\n<p>Return an array <code>answer</code> of length <code>n</code>, where each <code>answer[x]</code> is the length of the shortest path from node <code>0</code> to node <code>x</code> such that the edge colors alternate along the path, or <code>-1</code> if such a path does not exist.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> n = 3, redEdges = [[0,1],[1,2]], blueEdges = []\n<strong>Output:</strong> [0,1,-1]\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> n = 3, redEdges = [[0,1]], blueEdges = [[2,1]]\n<strong>Output:</strong> [0,1,-1]\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= n &lt;= 100</code></li>\n\t<li><code>0 &lt;= redEdges.length,&nbsp;blueEdges.length &lt;= 400</code></li>\n\t<li><code>redEdges[i].length == blueEdges[j].length == 2</code></li>\n\t<li><code>0 &lt;= a<sub>i</sub>, b<sub>i</sub>, u<sub>j</sub>, v<sub>j</sub> &lt; n</code></li>\n</ul>\n",
      "lcSlug": "shortest-path-with-alternating-colors",
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
      "description": "You are in a city that consists of `n` intersections numbered from `0` to `n - 1` with bi-directional roads between some intersections. The inputs are generated such that you can reach any intersection from any other intersection and that there is at most one road between any two intersections.\n\nYou are given an integer `n` and a 2D integer array `roads` where `roads[i] = [ui, vi, timei]` means that there is a road between intersections `ui` and `vi` that takes `timei` minutes to travel. You want to know in how many ways you can travel from intersection `0` to intersection `n - 1` in the shortest amount of time.\n\nReturn the number of ways you can arrive at your destination in the shortest amount of time. Since the answer may be large, return it modulo `109 + 7`.\n\n \n\nExample 1:\n\nInput: n = 7, roads = [[0,6,7],[0,1,2],[1,2,3],[1,3,3],[6,3,3],[3,5,1],[6,5,1],[2,5,1],[0,4,5],[4,6,2]]\nOutput: 4\nExplanation: The shortest amount of time it takes to go from intersection 0 to intersection 6 is 7 minutes.\nThe four ways to get there in 7 minutes are:\n- 0 ➝ 6\n- 0 ➝ 4 ➝ 6\n- 0 ➝ 1 ➝ 2 ➝ 5 ➝ 6\n- 0 ➝ 1 ➝ 3 ➝ 5 ➝ 6\n\nExample 2:\n\nInput: n = 2, roads = [[1,0,10]]\nOutput: 1\nExplanation: There is only one way to go from intersection 0 to intersection 1, and it takes 10 minutes.\n\n \n\nConstraints:\n\n\t• `1 i, vi i 9`\n• `ui != vi`\n• There is at most one road connecting any two intersections.\n• You can reach any intersection from any other intersection.",
      "descriptionHtml": "<p>You are in a city that consists of <code>n</code> intersections numbered from <code>0</code> to <code>n - 1</code> with <strong>bi-directional</strong> roads between some intersections. The inputs are generated such that you can reach any intersection from any other intersection and that there is at most one road between any two intersections.</p>\n\n<p>You are given an integer <code>n</code> and a 2D integer array <code>roads</code> where <code>roads[i] = [u<sub>i</sub>, v<sub>i</sub>, time<sub>i</sub>]</code> means that there is a road between intersections <code>u<sub>i</sub></code> and <code>v<sub>i</sub></code> that takes <code>time<sub>i</sub></code> minutes to travel. You want to know in how many ways you can travel from intersection <code>0</code> to intersection <code>n - 1</code> in the <strong>shortest amount of time</strong>.</p>\n\n<p>Return <em>the <strong>number of ways</strong> you can arrive at your destination in the <strong>shortest amount of time</strong></em>. Since the answer may be large, return it <strong>modulo</strong> <code>10<sup>9</sup> + 7</code>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2025/02/14/1976_corrected.png\" style=\"width: 255px; height: 400px;\" />\n<pre>\n<strong>Input:</strong> n = 7, roads = [[0,6,7],[0,1,2],[1,2,3],[1,3,3],[6,3,3],[3,5,1],[6,5,1],[2,5,1],[0,4,5],[4,6,2]]\n<strong>Output:</strong> 4\n<strong>Explanation:</strong> The shortest amount of time it takes to go from intersection 0 to intersection 6 is 7 minutes.\nThe four ways to get there in 7 minutes are:\n- 0 ➝ 6\n- 0 ➝ 4 ➝ 6\n- 0 ➝ 1 ➝ 2 ➝ 5 ➝ 6\n- 0 ➝ 1 ➝ 3 ➝ 5 ➝ 6\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> n = 2, roads = [[1,0,10]]\n<strong>Output:</strong> 1\n<strong>Explanation:</strong> There is only one way to go from intersection 0 to intersection 1, and it takes 10 minutes.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= n &lt;= 200</code></li>\n\t<li><code>n - 1 &lt;= roads.length &lt;= n * (n - 1) / 2</code></li>\n\t<li><code>roads[i].length == 3</code></li>\n\t<li><code>0 &lt;= u<sub>i</sub>, v<sub>i</sub> &lt;= n - 1</code></li>\n\t<li><code>1 &lt;= time<sub>i</sub> &lt;= 10<sup>9</sup></code></li>\n\t<li><code>u<sub>i </sub>!= v<sub>i</sub></code></li>\n\t<li>There is at most one road connecting any two intersections.</li>\n\t<li>You can reach any intersection from any other intersection.</li>\n</ul>\n",
      "lcSlug": "number-of-ways-to-arrive-at-destination",
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
      "description": "In this problem, a tree is an undirected graph that is connected and has no cycles.\n\nYou are given a graph that started as a tree with `n` nodes labeled from `1` to `n`, with one additional edge added. The added edge has two different vertices chosen from `1` to `n`, and was not an edge that already existed. The graph is represented as an array `edges` of length `n` where `edges[i] = [ai, bi]` indicates that there is an edge between nodes `ai` and `bi` in the graph.\n\nReturn an edge that can be removed so that the resulting graph is a tree of `n` nodes. If there are multiple answers, return the answer that occurs last in the input.\n\n \n\nExample 1:\n\nInput: edges = [[1,2],[1,3],[2,3]]\nOutput: [2,3]\n\nExample 2:\n\nInput: edges = [[1,2],[2,3],[3,4],[1,4],[1,5]]\nOutput: [1,4]\n\n \n\nConstraints:\n\n\t• `n == edges.length`\n• `3 i i i != bi`\n• There are no repeated edges.\n• The given graph is connected.",
      "descriptionHtml": "<p>In this problem, a tree is an <strong>undirected graph</strong> that is connected and has no cycles.</p>\n\n<p>You are given a graph that started as a tree with <code>n</code> nodes labeled from <code>1</code> to <code>n</code>, with one additional edge added. The added edge has two <strong>different</strong> vertices chosen from <code>1</code> to <code>n</code>, and was not an edge that already existed. The graph is represented as an array <code>edges</code> of length <code>n</code> where <code>edges[i] = [a<sub>i</sub>, b<sub>i</sub>]</code> indicates that there is an edge between nodes <code>a<sub>i</sub></code> and <code>b<sub>i</sub></code> in the graph.</p>\n\n<p>Return <em>an edge that can be removed so that the resulting graph is a tree of </em><code>n</code><em> nodes</em>. If there are multiple answers, return the answer that occurs last in the input.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2021/05/02/reduntant1-1-graph.jpg\" style=\"width: 222px; height: 222px;\" />\n<pre>\n<strong>Input:</strong> edges = [[1,2],[1,3],[2,3]]\n<strong>Output:</strong> [2,3]\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2021/05/02/reduntant1-2-graph.jpg\" style=\"width: 382px; height: 222px;\" />\n<pre>\n<strong>Input:</strong> edges = [[1,2],[2,3],[3,4],[1,4],[1,5]]\n<strong>Output:</strong> [1,4]\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>n == edges.length</code></li>\n\t<li><code>3 &lt;= n &lt;= 1000</code></li>\n\t<li><code>edges[i].length == 2</code></li>\n\t<li><code>1 &lt;= a<sub>i</sub> &lt; b<sub>i</sub> &lt;= edges.length</code></li>\n\t<li><code>a<sub>i</sub> != b<sub>i</sub></code></li>\n\t<li>There are no repeated edges.</li>\n\t<li>The given graph is connected.</li>\n</ul>\n",
      "lcSlug": "redundant-connection",
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
      "description": "You have a graph of `n` nodes. You are given an integer `n` and an array `edges` where `edges[i] = [ai, bi]` indicates that there is an edge between `ai` and `bi` in the graph.\n\nReturn the number of connected components in the graph.\n\n&nbsp;\n\nExample 1:\n\nInput: n = 5, edges = [[0,1],[1,2],[3,4]]\nOutput: 2\n\nExample 2:\n\nInput: n = 5, edges = [[0,1],[1,2],[2,3],[3,4]]\nOutput: 1\n\n&nbsp;\n\nConstraints:\n\n\t• `1 i i i != bi`\n• There are no repeated edges.",
      "descriptionHtml": "<p>You have a graph of <code>n</code> nodes. You are given an integer <code>n</code> and an array <code>edges</code> where <code>edges[i] = [a<sub>i</sub>, b<sub>i</sub>]</code> indicates that there is an edge between <code>a<sub>i</sub></code> and <code>b<sub>i</sub></code> in the graph.</p>\n\n<p>Return <em>the number of connected components in the graph</em>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://fastly.jsdelivr.net/gh/doocs/leetcode@main/solution/0300-0399/0323.Number%20of%20Connected%20Components%20in%20an%20Undirected%20Graph/images/conn1-graph.jpg\" style=\"width: 382px; height: 222px;\" />\n<pre>\n<strong>Input:</strong> n = 5, edges = [[0,1],[1,2],[3,4]]\n<strong>Output:</strong> 2\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n<img alt=\"\" src=\"https://fastly.jsdelivr.net/gh/doocs/leetcode@main/solution/0300-0399/0323.Number%20of%20Connected%20Components%20in%20an%20Undirected%20Graph/images/conn2-graph.jpg\" style=\"width: 382px; height: 222px;\" />\n<pre>\n<strong>Input:</strong> n = 5, edges = [[0,1],[1,2],[2,3],[3,4]]\n<strong>Output:</strong> 1\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 <= n <= 2000</code></li>\n\t<li><code>1 <= edges.length <= 5000</code></li>\n\t<li><code>edges[i].length == 2</code></li>\n\t<li><code>0 <= a<sub>i</sub> <= b<sub>i</sub> < n</code></li>\n\t<li><code>a<sub>i</sub> != b<sub>i</sub></code></li>\n\t<li>There are no repeated edges.</li>\n</ul>",
      "lcSlug": "number-of-connected-components-in-an-undirected-graph",
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
      "description": "Given a list of `accounts` where each element `accounts[i]` is a list of strings, where the first element `accounts[i][0]` is a name, and the rest of the elements are emails representing emails of the account.\n\nNow, we would like to merge these accounts. Two accounts definitely belong to the same person if there is some common email to both accounts. Note that even if two accounts have the same name, they may belong to different people as people could have the same name. A person can have any number of accounts initially, but all of their accounts definitely have the same name.\n\nAfter merging the accounts, return the accounts in the following format: the first element of each account is the name, and the rest of the elements are emails in sorted order. The accounts themselves can be returned in any order.\n\n \n\nExample 1:\n\nInput: accounts = [[\"John\",\"johnsmith@mail.com\",\"john_newyork@mail.com\"],[\"John\",\"johnsmith@mail.com\",\"john00@mail.com\"],[\"Mary\",\"mary@mail.com\"],[\"John\",\"johnnybravo@mail.com\"]]\nOutput: [[\"John\",\"john00@mail.com\",\"john_newyork@mail.com\",\"johnsmith@mail.com\"],[\"Mary\",\"mary@mail.com\"],[\"John\",\"johnnybravo@mail.com\"]]\nExplanation:\nThe first and second John's are the same person as they have the common email \"johnsmith@mail.com\".\nThe third John and Mary are different people as none of their email addresses are used by other accounts.\nWe could return these lists in any order, for example the answer [['Mary', 'mary@mail.com'], ['John', 'johnnybravo@mail.com'], \n['John', 'john00@mail.com', 'john_newyork@mail.com', 'johnsmith@mail.com']] would still be accepted.\n\nExample 2:\n\nInput: accounts = [[\"Gabe\",\"Gabe0@m.co\",\"Gabe3@m.co\",\"Gabe1@m.co\"],[\"Kevin\",\"Kevin3@m.co\",\"Kevin5@m.co\",\"Kevin0@m.co\"],[\"Ethan\",\"Ethan5@m.co\",\"Ethan4@m.co\",\"Ethan0@m.co\"],[\"Hanzo\",\"Hanzo3@m.co\",\"Hanzo1@m.co\",\"Hanzo0@m.co\"],[\"Fern\",\"Fern5@m.co\",\"Fern1@m.co\",\"Fern0@m.co\"]]\nOutput: [[\"Ethan\",\"Ethan0@m.co\",\"Ethan4@m.co\",\"Ethan5@m.co\"],[\"Gabe\",\"Gabe0@m.co\",\"Gabe1@m.co\",\"Gabe3@m.co\"],[\"Hanzo\",\"Hanzo0@m.co\",\"Hanzo1@m.co\",\"Hanzo3@m.co\"],[\"Kevin\",\"Kevin0@m.co\",\"Kevin3@m.co\",\"Kevin5@m.co\"],[\"Fern\",\"Fern0@m.co\",\"Fern1@m.co\",\"Fern5@m.co\"]]\n\n \n\nConstraints:\n\n\t• `1  0)` is a valid email.",
      "descriptionHtml": "<p>Given a list of <code>accounts</code> where each element <code>accounts[i]</code> is a list of strings, where the first element <code>accounts[i][0]</code> is a name, and the rest of the elements are <strong>emails</strong> representing emails of the account.</p>\n\n<p>Now, we would like to merge these accounts. Two accounts definitely belong to the same person if there is some common email to both accounts. Note that even if two accounts have the same name, they may belong to different people as people could have the same name. A person can have any number of accounts initially, but all of their accounts definitely have the same name.</p>\n\n<p>After merging the accounts, return the accounts in the following format: the first element of each account is the name, and the rest of the elements are emails <strong>in sorted order</strong>. The accounts themselves can be returned in <strong>any order</strong>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> accounts = [[&quot;John&quot;,&quot;johnsmith@mail.com&quot;,&quot;john_newyork@mail.com&quot;],[&quot;John&quot;,&quot;johnsmith@mail.com&quot;,&quot;john00@mail.com&quot;],[&quot;Mary&quot;,&quot;mary@mail.com&quot;],[&quot;John&quot;,&quot;johnnybravo@mail.com&quot;]]\n<strong>Output:</strong> [[&quot;John&quot;,&quot;john00@mail.com&quot;,&quot;john_newyork@mail.com&quot;,&quot;johnsmith@mail.com&quot;],[&quot;Mary&quot;,&quot;mary@mail.com&quot;],[&quot;John&quot;,&quot;johnnybravo@mail.com&quot;]]\n<strong>Explanation:</strong>\nThe first and second John&#39;s are the same person as they have the common email &quot;johnsmith@mail.com&quot;.\nThe third John and Mary are different people as none of their email addresses are used by other accounts.\nWe could return these lists in any order, for example the answer [[&#39;Mary&#39;, &#39;mary@mail.com&#39;], [&#39;John&#39;, &#39;johnnybravo@mail.com&#39;], \n[&#39;John&#39;, &#39;john00@mail.com&#39;, &#39;john_newyork@mail.com&#39;, &#39;johnsmith@mail.com&#39;]] would still be accepted.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> accounts = [[&quot;Gabe&quot;,&quot;Gabe0@m.co&quot;,&quot;Gabe3@m.co&quot;,&quot;Gabe1@m.co&quot;],[&quot;Kevin&quot;,&quot;Kevin3@m.co&quot;,&quot;Kevin5@m.co&quot;,&quot;Kevin0@m.co&quot;],[&quot;Ethan&quot;,&quot;Ethan5@m.co&quot;,&quot;Ethan4@m.co&quot;,&quot;Ethan0@m.co&quot;],[&quot;Hanzo&quot;,&quot;Hanzo3@m.co&quot;,&quot;Hanzo1@m.co&quot;,&quot;Hanzo0@m.co&quot;],[&quot;Fern&quot;,&quot;Fern5@m.co&quot;,&quot;Fern1@m.co&quot;,&quot;Fern0@m.co&quot;]]\n<strong>Output:</strong> [[&quot;Ethan&quot;,&quot;Ethan0@m.co&quot;,&quot;Ethan4@m.co&quot;,&quot;Ethan5@m.co&quot;],[&quot;Gabe&quot;,&quot;Gabe0@m.co&quot;,&quot;Gabe1@m.co&quot;,&quot;Gabe3@m.co&quot;],[&quot;Hanzo&quot;,&quot;Hanzo0@m.co&quot;,&quot;Hanzo1@m.co&quot;,&quot;Hanzo3@m.co&quot;],[&quot;Kevin&quot;,&quot;Kevin0@m.co&quot;,&quot;Kevin3@m.co&quot;,&quot;Kevin5@m.co&quot;],[&quot;Fern&quot;,&quot;Fern0@m.co&quot;,&quot;Fern1@m.co&quot;,&quot;Fern5@m.co&quot;]]\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= accounts.length &lt;= 1000</code></li>\n\t<li><code>2 &lt;= accounts[i].length &lt;= 10</code></li>\n\t<li><code>1 &lt;= accounts[i][j].length &lt;= 30</code></li>\n\t<li><code>accounts[i][0]</code> consists of English letters.</li>\n\t<li><code>accounts[i][j] (for j &gt; 0)</code> is a valid email.</li>\n</ul>\n",
      "lcSlug": "accounts-merge",
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
      "description": "You have a graph of `n` nodes labeled from `0` to `n - 1`. You are given an integer n and a list of `edges` where `edges[i] = [ai, bi]` indicates that there is an undirected edge between nodes `ai` and `bi` in the graph.\n\nReturn `true` if the edges of the given graph make up a valid tree, and `false` otherwise.\n\n&nbsp;\n\nExample 1:\n\nInput: n = 5, edges = [[0,1],[0,2],[0,3],[1,4]]\nOutput: true\n\nExample 2:\n\nInput: n = 5, edges = [[0,1],[1,2],[2,3],[1,3],[1,4]]\nOutput: false\n\n&nbsp;\n\nConstraints:\n\n\t• `1 i, bi i != bi`\n• There are no self-loops or repeated edges.",
      "descriptionHtml": "<p>You have a graph of <code>n</code> nodes labeled from <code>0</code> to <code>n - 1</code>. You are given an integer n and a list of <code>edges</code> where <code>edges[i] = [a<sub>i</sub>, b<sub>i</sub>]</code> indicates that there is an undirected edge between nodes <code>a<sub>i</sub></code> and <code>b<sub>i</sub></code> in the graph.</p>\n\n<p>Return <code>true</code> <em>if the edges of the given graph make up a valid tree, and</em> <code>false</code> <em>otherwise</em>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://fastly.jsdelivr.net/gh/doocs/leetcode@main/solution/0200-0299/0261.Graph%20Valid%20Tree/images/tree1-graph.jpg\" style=\"width: 222px; height: 302px;\" />\n<pre>\n<strong>Input:</strong> n = 5, edges = [[0,1],[0,2],[0,3],[1,4]]\n<strong>Output:</strong> true\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n<img alt=\"\" src=\"https://fastly.jsdelivr.net/gh/doocs/leetcode@main/solution/0200-0299/0261.Graph%20Valid%20Tree/images/tree2-graph.jpg\" style=\"width: 382px; height: 222px;\" />\n<pre>\n<strong>Input:</strong> n = 5, edges = [[0,1],[1,2],[2,3],[1,3],[1,4]]\n<strong>Output:</strong> false\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 <= n <= 2000</code></li>\n\t<li><code>0 <= edges.length <= 5000</code></li>\n\t<li><code>edges[i].length == 2</code></li>\n\t<li><code>0 <= a<sub>i</sub>, b<sub>i</sub> < n</code></li>\n\t<li><code>a<sub>i</sub> != b<sub>i</sub></code></li>\n\t<li>There are no self-loops or repeated edges.</li>\n</ul>",
      "lcSlug": "graph-valid-tree",
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
      "description": "There are `n` cities. Some of them are connected, while some are not. If city `a` is connected directly with city `b`, and city `b` is connected directly with city `c`, then city `a` is connected indirectly with city `c`.\n\nA province is a group of directly or indirectly connected cities and no other cities outside of the group.\n\nYou are given an `n x n` matrix `isConnected` where `isConnected[i][j] = 1` if the `ith` city and the `jth` city are directly connected, and `isConnected[i][j] = 0` otherwise.\n\nReturn the total number of provinces.\n\n \n\nExample 1:\n\nInput: isConnected = [[1,1,0],[1,1,0],[0,0,1]]\nOutput: 2\n\nExample 2:\n\nInput: isConnected = [[1,0,0],[0,1,0],[0,0,1]]\nOutput: 3\n\n \n\nConstraints:\n\n\t• `1",
      "descriptionHtml": "<p>There are <code>n</code> cities. Some of them are connected, while some are not. If city <code>a</code> is connected directly with city <code>b</code>, and city <code>b</code> is connected directly with city <code>c</code>, then city <code>a</code> is connected indirectly with city <code>c</code>.</p>\n\n<p>A <strong>province</strong> is a group of directly or indirectly connected cities and no other cities outside of the group.</p>\n\n<p>You are given an <code>n x n</code> matrix <code>isConnected</code> where <code>isConnected[i][j] = 1</code> if the <code>i<sup>th</sup></code> city and the <code>j<sup>th</sup></code> city are directly connected, and <code>isConnected[i][j] = 0</code> otherwise.</p>\n\n<p>Return <em>the total number of <strong>provinces</strong></em>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2020/12/24/graph1.jpg\" style=\"width: 222px; height: 142px;\" />\n<pre>\n<strong>Input:</strong> isConnected = [[1,1,0],[1,1,0],[0,0,1]]\n<strong>Output:</strong> 2\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2020/12/24/graph2.jpg\" style=\"width: 222px; height: 142px;\" />\n<pre>\n<strong>Input:</strong> isConnected = [[1,0,0],[0,1,0],[0,0,1]]\n<strong>Output:</strong> 3\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= n &lt;= 200</code></li>\n\t<li><code>n == isConnected.length</code></li>\n\t<li><code>n == isConnected[i].length</code></li>\n\t<li><code>isConnected[i][j]</code> is <code>1</code> or <code>0</code>.</li>\n\t<li><code>isConnected[i][i] == 1</code></li>\n\t<li><code>isConnected[i][j] == isConnected[j][i]</code></li>\n</ul>\n",
      "lcSlug": "number-of-provinces",
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
      "description": "You are given an array of strings `equations` that represent relationships between variables where each string `equations[i]` is of length `4` and takes one of two different forms: `\"xi==yi\"` or `\"xi!=yi\"`.Here, `xi` and `yi` are lowercase letters (not necessarily different) that represent one-letter variable names.\n\nReturn `true` if it is possible to assign integers to variable names so as to satisfy all the given equations, or `false` otherwise.\n\n \n\nExample 1:\n\nInput: equations = [\"a==b\",\"b!=a\"]\nOutput: false\nExplanation: If we assign say, a = 1 and b = 1, then the first equation is satisfied, but not the second.\nThere is no way to assign the variables to satisfy both equations.\n\nExample 2:\n\nInput: equations = [\"b==a\",\"a==b\"]\nOutput: true\nExplanation: We could assign a = 1 and b = 1 to satisfy both equations.\n\n \n\nConstraints:\n\n\t• `1",
      "descriptionHtml": "<p>You are given an array of strings <code>equations</code> that represent relationships between variables where each string <code>equations[i]</code> is of length <code>4</code> and takes one of two different forms: <code>&quot;x<sub>i</sub>==y<sub>i</sub>&quot;</code> or <code>&quot;x<sub>i</sub>!=y<sub>i</sub>&quot;</code>.Here, <code>x<sub>i</sub></code> and <code>y<sub>i</sub></code> are lowercase letters (not necessarily different) that represent one-letter variable names.</p>\n\n<p>Return <code>true</code><em> if it is possible to assign integers to variable names so as to satisfy all the given equations, or </em><code>false</code><em> otherwise</em>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> equations = [&quot;a==b&quot;,&quot;b!=a&quot;]\n<strong>Output:</strong> false\n<strong>Explanation:</strong> If we assign say, a = 1 and b = 1, then the first equation is satisfied, but not the second.\nThere is no way to assign the variables to satisfy both equations.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> equations = [&quot;b==a&quot;,&quot;a==b&quot;]\n<strong>Output:</strong> true\n<strong>Explanation:</strong> We could assign a = 1 and b = 1 to satisfy both equations.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= equations.length &lt;= 500</code></li>\n\t<li><code>equations[i].length == 4</code></li>\n\t<li><code>equations[i][0]</code> is a lowercase letter.</li>\n\t<li><code>equations[i][1]</code> is either <code>&#39;=&#39;</code> or <code>&#39;!&#39;</code>.</li>\n\t<li><code>equations[i][2]</code> is <code>&#39;=&#39;</code>.</li>\n\t<li><code>equations[i][3]</code> is a lowercase letter.</li>\n</ul>\n",
      "lcSlug": "satisfiability-of-equality-equations",
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
      "description": "On a 2D plane, we place `n` stones at some integer coordinate points. Each coordinate point may have at most one stone.\n\nA stone can be removed if it shares either the same row or the same column as another stone that has not been removed.\n\nGiven an array `stones` of length `n` where `stones[i] = [xi, yi]` represents the location of the `ith` stone, return the largest possible number of stones that can be removed.\n\n \n\nExample 1:\n\nInput: stones = [[0,0],[0,1],[1,0],[1,2],[2,1],[2,2]]\nOutput: 5\nExplanation: One way to remove 5 stones is as follows:\n1. Remove stone [2,2] because it shares the same row as [2,1].\n2. Remove stone [2,1] because it shares the same column as [0,1].\n3. Remove stone [1,2] because it shares the same row as [1,0].\n4. Remove stone [1,0] because it shares the same column as [0,0].\n5. Remove stone [0,1] because it shares the same row as [0,0].\nStone [0,0] cannot be removed since it does not share a row/column with another stone still on the plane.\n\nExample 2:\n\nInput: stones = [[0,0],[0,2],[1,1],[2,0],[2,2]]\nOutput: 3\nExplanation: One way to make 3 moves is as follows:\n1. Remove stone [2,2] because it shares the same row as [2,0].\n2. Remove stone [2,0] because it shares the same column as [0,0].\n3. Remove stone [0,2] because it shares the same row as [0,0].\nStones [0,0] and [1,1] cannot be removed since they do not share a row/column with another stone still on the plane.\n\nExample 3:\n\nInput: stones = [[0,0]]\nOutput: 0\nExplanation: [0,0] is the only stone on the plane, so you cannot remove it.\n\n \n\nConstraints:\n\n\t• `1 i, yi 4`\n• No two stones are at the same coordinate point.",
      "descriptionHtml": "<p>On a 2D plane, we place <code>n</code> stones at some integer coordinate points. Each coordinate point may have at most one stone.</p>\n\n<p>A stone can be removed if it shares either <strong>the same row or the same column</strong> as another stone that has not been removed.</p>\n\n<p>Given an array <code>stones</code> of length <code>n</code> where <code>stones[i] = [x<sub>i</sub>, y<sub>i</sub>]</code> represents the location of the <code>i<sup>th</sup></code> stone, return <em>the largest possible number of stones that can be removed</em>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> stones = [[0,0],[0,1],[1,0],[1,2],[2,1],[2,2]]\n<strong>Output:</strong> 5\n<strong>Explanation:</strong> One way to remove 5 stones is as follows:\n1. Remove stone [2,2] because it shares the same row as [2,1].\n2. Remove stone [2,1] because it shares the same column as [0,1].\n3. Remove stone [1,2] because it shares the same row as [1,0].\n4. Remove stone [1,0] because it shares the same column as [0,0].\n5. Remove stone [0,1] because it shares the same row as [0,0].\nStone [0,0] cannot be removed since it does not share a row/column with another stone still on the plane.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> stones = [[0,0],[0,2],[1,1],[2,0],[2,2]]\n<strong>Output:</strong> 3\n<strong>Explanation:</strong> One way to make 3 moves is as follows:\n1. Remove stone [2,2] because it shares the same row as [2,0].\n2. Remove stone [2,0] because it shares the same column as [0,0].\n3. Remove stone [0,2] because it shares the same row as [0,0].\nStones [0,0] and [1,1] cannot be removed since they do not share a row/column with another stone still on the plane.\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> stones = [[0,0]]\n<strong>Output:</strong> 0\n<strong>Explanation:</strong> [0,0] is the only stone on the plane, so you cannot remove it.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= stones.length &lt;= 1000</code></li>\n\t<li><code>0 &lt;= x<sub>i</sub>, y<sub>i</sub> &lt;= 10<sup>4</sup></code></li>\n\t<li>No two stones are at the same coordinate point.</li>\n</ul>\n",
      "lcSlug": "most-stones-removed-with-same-row-or-column",
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
      "description": "You are given an array `points` representing integer coordinates of some points on a 2D-plane, where `points[i] = [xi, yi]`.\n\nThe cost of connecting two points `[xi, yi]` and `[xj, yj]` is the manhattan distance between them: `|xi - xj| + |yi - yj|`, where `|val|` denotes the absolute value of `val`.\n\nReturn the minimum cost to make all points connected. All points are connected if there is exactly one simple path between any two points.\n\n \n\nExample 1:\n\nInput: points = [[0,0],[2,2],[3,10],[5,2],[7,0]]\nOutput: 20\nExplanation: \n\nWe can connect the points as shown above to get the minimum cost of 20.\nNotice that there is a unique path between every pair of points.\n\nExample 2:\n\nInput: points = [[3,12],[-2,5],[-4,1]]\nOutput: 18\n\n \n\nConstraints:\n\n\t• `1 6 i, yi 6`\n• All pairs `(xi, yi)` are distinct.",
      "descriptionHtml": "<p>You are given an array <code>points</code> representing integer coordinates of some points on a 2D-plane, where <code>points[i] = [x<sub>i</sub>, y<sub>i</sub>]</code>.</p>\n\n<p>The cost of connecting two points <code>[x<sub>i</sub>, y<sub>i</sub>]</code> and <code>[x<sub>j</sub>, y<sub>j</sub>]</code> is the <strong>manhattan distance</strong> between them: <code>|x<sub>i</sub> - x<sub>j</sub>| + |y<sub>i</sub> - y<sub>j</sub>|</code>, where <code>|val|</code> denotes the absolute value of <code>val</code>.</p>\n\n<p>Return <em>the minimum cost to make all points connected.</em> All points are connected if there is <strong>exactly one</strong> simple path between any two points.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2020/08/26/d.png\" style=\"width: 214px; height: 268px;\" />\n<pre>\n<strong>Input:</strong> points = [[0,0],[2,2],[3,10],[5,2],[7,0]]\n<strong>Output:</strong> 20\n<strong>Explanation:</strong> \n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2020/08/26/c.png\" style=\"width: 214px; height: 268px;\" />\nWe can connect the points as shown above to get the minimum cost of 20.\nNotice that there is a unique path between every pair of points.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> points = [[3,12],[-2,5],[-4,1]]\n<strong>Output:</strong> 18\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= points.length &lt;= 1000</code></li>\n\t<li><code>-10<sup>6</sup> &lt;= x<sub>i</sub>, y<sub>i</sub> &lt;= 10<sup>6</sup></code></li>\n\t<li>All pairs <code>(x<sub>i</sub>, y<sub>i</sub>)</code> are distinct.</li>\n</ul>\n",
      "lcSlug": "min-cost-to-connect-all-points",
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
      "description": "There are `n` cities labeled from `1` to `n`. You are given the integer `n` and an array `connections` where `connections[i] = [xi, yi, costi]` indicates that the cost of connecting city `xi` and city `yi` (bidirectional connection) is `costi`.\n\nReturn the minimum cost to connect all the `n` cities such that there is at least one path between each pair of cities. If it is impossible to connect all the `n` cities, return `-1`,\n\nThe cost is the sum of the connections' costs used.\n\n&nbsp;\n\nExample 1:\n\nInput: n = 3, connections = [[1,2,5],[1,3,6],[2,3,1]]\nOutput: 6\nExplanation: Choosing any 2 edges will connect all cities so we choose the minimum 2.\n\nExample 2:\n\nInput: n = 4, connections = [[1,2,3],[3,4,4]]\nOutput: -1\nExplanation: There is no way to connect all cities even if all edges are used.\n\n&nbsp;\n\nConstraints:\n\n\t• `1 4`\n• `1 4`\n• `connections[i].length == 3`\n• `1 i, yi i != yi`\n• `0 i 5`",
      "descriptionHtml": "<p>There are <code>n</code> cities labeled from <code>1</code> to <code>n</code>. You are given the integer <code>n</code> and an array <code>connections</code> where <code>connections[i] = [x<sub>i</sub>, y<sub>i</sub>, cost<sub>i</sub>]</code> indicates that the cost of connecting city <code>x<sub>i</sub></code> and city <code>y<sub>i</sub></code> (bidirectional connection) is <code>cost<sub>i</sub></code>.</p>\n\n<p>Return <em>the minimum <strong>cost</strong> to connect all the </em><code>n</code><em> cities such that there is at least one path between each pair of cities</em>. If it is impossible to connect all the <code>n</code> cities, return <code>-1</code>,</p>\n\n<p>The <strong>cost</strong> is the sum of the connections&#39; costs used.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://fastly.jsdelivr.net/gh/doocs/leetcode@main/solution/1100-1199/1135.Connecting%20Cities%20With%20Minimum%20Cost/images/1314_ex2.png\" style=\"width: 161px; height: 141px;\" />\n<pre>\n<strong>Input:</strong> n = 3, connections = [[1,2,5],[1,3,6],[2,3,1]]\n<strong>Output:</strong> 6\n<strong>Explanation:</strong> Choosing any 2 edges will connect all cities so we choose the minimum 2.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n<img alt=\"\" src=\"https://fastly.jsdelivr.net/gh/doocs/leetcode@main/solution/1100-1199/1135.Connecting%20Cities%20With%20Minimum%20Cost/images/1314_ex1.png\" style=\"width: 136px; height: 91px;\" />\n<pre>\n<strong>Input:</strong> n = 4, connections = [[1,2,3],[3,4,4]]\n<strong>Output:</strong> -1\n<strong>Explanation:</strong> There is no way to connect all cities even if all edges are used.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 <= n <= 10<sup>4</sup></code></li>\n\t<li><code>1 <= connections.length <= 10<sup>4</sup></code></li>\n\t<li><code>connections[i].length == 3</code></li>\n\t<li><code>1 <= x<sub>i</sub>, y<sub>i</sub> <= n</code></li>\n\t<li><code>x<sub>i</sub> != y<sub>i</sub></code></li>\n\t<li><code>0 <= cost<sub>i</sub> <= 10<sup>5</sup></code></li>\n</ul>",
      "lcSlug": "connecting-cities-with-minimum-cost",
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
      "description": "There are `n` houses in a village. We want to supply water for all the houses by building wells and laying pipes.\n\nFor each house `i`, we can either build a well inside it directly with cost `wells[i - 1]` (note the `-1` due to 0-indexing), or pipe in water from another well to it. The costs to lay pipes between houses are given by the array `pipes` where each `pipes[j] = [house1j, house2j, costj]` represents the cost to connect `house1j` and `house2j` together using a pipe. Connections are bidirectional, and there could be multiple valid connections between the same two houses with different costs.\n\nReturn the minimum total cost to supply water to all houses.\n\n&nbsp;\n\nExample 1:\n\nInput: n = 3, wells = [1,2,2], pipes = [[1,2,1],[2,3,1]]\nOutput: 3\nExplanation: The image shows the costs of connecting houses using pipes.\nThe best strategy is to build a well in the first house with cost 1 and connect the other houses to it with cost 2 so the total cost is 3.\n\nExample 2:\n\nInput: n = 2, wells = [1,1], pipes = [[1,2,1],[1,2,2]]\nOutput: 2\nExplanation: We can supply water with cost two using one of the three options:\nOption 1:\n  - Build a well inside house 1 with cost 1.\n  - Build a well inside house 2 with cost 1.\nThe total cost will be 2.\nOption 2:\n  - Build a well inside house 1 with cost 1.\n  - Connect house 2 with house 1 with cost 1.\nThe total cost will be 2.\nOption 3:\n  - Build a well inside house 2 with cost 1.\n  - Connect house 1 with house 2 with cost 1.\nThe total cost will be 2.\nNote that we can connect houses 1 and 2 with cost 1 or with cost 2 but we will always choose the cheapest option. \n\n&nbsp;\n\nConstraints:\n\n\t• `2 4`\n• `wells.length == n`\n• `0 5`\n• `1 4`\n• `pipes[j].length == 3`\n• `1 j, house2j j 5`\n• `house1j != house2j`",
      "descriptionHtml": "<p>There are <code>n</code> houses in a village. We want to supply water for all the houses by building wells and laying pipes.</p>\n\n<p>For each house <code>i</code>, we can either build a well inside it directly with cost <code>wells[i - 1]</code> (note the <code>-1</code> due to <strong>0-indexing</strong>), or pipe in water from another well to it. The costs to lay pipes between houses are given by the array <code>pipes</code> where each <code>pipes[j] = [house1<sub>j</sub>, house2<sub>j</sub>, cost<sub>j</sub>]</code> represents the cost to connect <code>house1<sub>j</sub></code> and <code>house2<sub>j</sub></code> together using a pipe. Connections are bidirectional, and there could be multiple valid connections between the same two houses with different costs.</p>\n\n<p>Return <em>the minimum total cost to supply water to all houses</em>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://fastly.jsdelivr.net/gh/doocs/leetcode@main/solution/1100-1199/1168.Optimize%20Water%20Distribution%20in%20a%20Village/images/1359_ex1.png\" style=\"width: 189px; height: 196px;\" />\n<pre>\n<strong>Input:</strong> n = 3, wells = [1,2,2], pipes = [[1,2,1],[2,3,1]]\n<strong>Output:</strong> 3\n<strong>Explanation:</strong> The image shows the costs of connecting houses using pipes.\nThe best strategy is to build a well in the first house with cost 1 and connect the other houses to it with cost 2 so the total cost is 3.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> n = 2, wells = [1,1], pipes = [[1,2,1],[1,2,2]]\n<strong>Output:</strong> 2\n<strong>Explanation:</strong> We can supply water with cost two using one of the three options:\nOption 1:\n  - Build a well inside house 1 with cost 1.\n  - Build a well inside house 2 with cost 1.\nThe total cost will be 2.\nOption 2:\n  - Build a well inside house 1 with cost 1.\n  - Connect house 2 with house 1 with cost 1.\nThe total cost will be 2.\nOption 3:\n  - Build a well inside house 2 with cost 1.\n  - Connect house 1 with house 2 with cost 1.\nThe total cost will be 2.\nNote that we can connect houses 1 and 2 with cost 1 or with cost 2 but we will always choose <strong>the cheapest option</strong>. \n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>2 <= n <= 10<sup>4</sup></code></li>\n\t<li><code>wells.length == n</code></li>\n\t<li><code>0 <= wells[i] <= 10<sup>5</sup></code></li>\n\t<li><code>1 <= pipes.length <= 10<sup>4</sup></code></li>\n\t<li><code>pipes[j].length == 3</code></li>\n\t<li><code>1 <= house1<sub>j</sub>, house2<sub>j</sub> <= n</code></li>\n\t<li><code>0 <= cost<sub>j</sub> <= 10<sup>5</sup></code></li>\n\t<li><code>house1<sub>j</sub> != house2<sub>j</sub></code></li>\n</ul>",
      "lcSlug": "optimize-water-distribution-in-a-village",
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
      "description": "You are given an empty 2D binary grid `grid` of size `m x n`. The grid represents a map where `0`'s represent water and `1`'s represent land. Initially, all the cells of `grid` are water cells (i.e., all the cells are `0`'s).\n\nWe may perform an add land operation which turns the water at position into a land. You are given an array `positions` where `positions[i] = [ri, ci]` is the position `(ri, ci)` at which we should operate the `ith` operation.\n\nReturn an array of integers `answer` where `answer[i]` is the number of islands after turning the cell `(ri, ci)` into a land.\n\nAn island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.\n\n&nbsp;\n\nExample 1:\n\nInput: m = 3, n = 3, positions = [[0,0],[0,1],[1,2],[2,1]]\nOutput: [1,1,2,3]\nExplanation:\nInitially, the 2d grid is filled with water.\n- Operation #1: addLand(0, 0) turns the water at grid[0][0] into a land. We have 1 island.\n- Operation #2: addLand(0, 1) turns the water at grid[0][1] into a land. We still have 1 island.\n- Operation #3: addLand(1, 2) turns the water at grid[1][2] into a land. We have 2 islands.\n- Operation #4: addLand(2, 1) turns the water at grid[2][1] into a land. We have 3 islands.\n\nExample 2:\n\nInput: m = 1, n = 1, positions = [[0,0]]\nOutput: [1]\n\n&nbsp;\n\nConstraints:\n\n\t• `1 4`\n• `1 4`\n• `positions[i].length == 2`\n• `0 i i \n\n&nbsp;\n\nFollow up: Could you solve it in time complexity `O(k log(mn))`, where `k == positions.length`?",
      "descriptionHtml": "<p>You are given an empty 2D binary grid <code>grid</code> of size <code>m x n</code>. The grid represents a map where <code>0</code>&#39;s represent water and <code>1</code>&#39;s represent land. Initially, all the cells of <code>grid</code> are water cells (i.e., all the cells are <code>0</code>&#39;s).</p>\n\n<p>We may perform an add land operation which turns the water at position into a land. You are given an array <code>positions</code> where <code>positions[i] = [r<sub>i</sub>, c<sub>i</sub>]</code> is the position <code>(r<sub>i</sub>, c<sub>i</sub>)</code> at which we should operate the <code>i<sup>th</sup></code> operation.</p>\n\n<p>Return <em>an array of integers</em> <code>answer</code> <em>where</em> <code>answer[i]</code> <em>is the number of islands after turning the cell</em> <code>(r<sub>i</sub>, c<sub>i</sub>)</code> <em>into a land</em>.</p>\n\n<p>An <strong>island</strong> is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://fastly.jsdelivr.net/gh/doocs/leetcode@main/solution/0300-0399/0305.Number%20of%20Islands%20II/images/tmp-grid.jpg\" style=\"width: 500px; height: 294px;\" />\n<pre>\n<strong>Input:</strong> m = 3, n = 3, positions = [[0,0],[0,1],[1,2],[2,1]]\n<strong>Output:</strong> [1,1,2,3]\n<strong>Explanation:</strong>\nInitially, the 2d grid is filled with water.\n- Operation #1: addLand(0, 0) turns the water at grid[0][0] into a land. We have 1 island.\n- Operation #2: addLand(0, 1) turns the water at grid[0][1] into a land. We still have 1 island.\n- Operation #3: addLand(1, 2) turns the water at grid[1][2] into a land. We have 2 islands.\n- Operation #4: addLand(2, 1) turns the water at grid[2][1] into a land. We have 3 islands.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> m = 1, n = 1, positions = [[0,0]]\n<strong>Output:</strong> [1]\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 <= m, n, positions.length <= 10<sup>4</sup></code></li>\n\t<li><code>1 <= m * n <= 10<sup>4</sup></code></li>\n\t<li><code>positions[i].length == 2</code></li>\n\t<li><code>0 <= r<sub>i</sub> < m</code></li>\n\t<li><code>0 <= c<sub>i</sub> < n</code></li>\n</ul>\n\n<p>&nbsp;</p>\n<p><strong>Follow up:</strong> Could you solve it in time complexity <code>O(k log(mn))</code>, where <code>k == positions.length</code>?</p>",
      "lcSlug": "number-of-islands-ii",
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
      "description": "An `n x n` grid is composed of `1 x 1` squares where each `1 x 1` square consists of a `'/'`, `'\\'`, or blank space `' '`. These characters divide the square into contiguous regions.\n\nGiven the grid `grid` represented as a string array, return the number of regions.\n\nNote that backslash characters are escaped, so a `'\\'` is represented as `'\\\\'`.\n\n \n\nExample 1:\n\nInput: grid = [\" /\",\"/ \"]\nOutput: 2\n\nExample 2:\n\nInput: grid = [\" /\",\"  \"]\nOutput: 1\n\nExample 3:\n\nInput: grid = [\"/\\\\\",\"\\\\/\"]\nOutput: 5\nExplanation: Recall that because \\ characters are escaped, \"\\\\/\" refers to \\/, and \"/\\\\\" refers to /\\.\n\n \n\nConstraints:\n\n\t• `n == grid.length == grid[i].length`\n• `1",
      "descriptionHtml": "<p>An <code>n x n</code> grid is composed of <code>1 x 1</code> squares where each <code>1 x 1</code> square consists of a <code>&#39;/&#39;</code>, <code>&#39;\\&#39;</code>, or blank space <code>&#39; &#39;</code>. These characters divide the square into contiguous regions.</p>\n\n<p>Given the grid <code>grid</code> represented as a string array, return <em>the number of regions</em>.</p>\n\n<p>Note that backslash characters are escaped, so a <code>&#39;\\&#39;</code> is represented as <code>&#39;\\\\&#39;</code>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2018/12/15/1.png\" style=\"width: 200px; height: 200px;\" />\n<pre>\n<strong>Input:</strong> grid = [&quot; /&quot;,&quot;/ &quot;]\n<strong>Output:</strong> 2\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2018/12/15/2.png\" style=\"width: 200px; height: 198px;\" />\n<pre>\n<strong>Input:</strong> grid = [&quot; /&quot;,&quot;  &quot;]\n<strong>Output:</strong> 1\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2018/12/15/4.png\" style=\"width: 200px; height: 200px;\" />\n<pre>\n<strong>Input:</strong> grid = [&quot;/\\\\&quot;,&quot;\\\\/&quot;]\n<strong>Output:</strong> 5\n<strong>Explanation: </strong>Recall that because \\ characters are escaped, &quot;\\\\/&quot; refers to \\/, and &quot;/\\\\&quot; refers to /\\.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>n == grid.length == grid[i].length</code></li>\n\t<li><code>1 &lt;= n &lt;= 30</code></li>\n\t<li><code>grid[i][j]</code> is either <code>&#39;/&#39;</code>, <code>&#39;\\&#39;</code>, or <code>&#39; &#39;</code>.</li>\n</ul>\n",
      "lcSlug": "regions-cut-by-slashes",
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
      "description": "Given an `m x n` integers `matrix`, return the length of the longest increasing path in `matrix`.\n\nFrom each cell, you can either move in four directions: left, right, up, or down. You may not move diagonally or move outside the boundary (i.e., wrap-around is not allowed).\n\n \n\nExample 1:\n\nInput: matrix = [[9,9,4],[6,6,8],[2,1,1]]\nOutput: 4\nExplanation: The longest increasing path is [1, 2, 6, 9].\n\nExample 2:\n\nInput: matrix = [[3,4,5],[3,2,6],[2,2,1]]\nOutput: 4\nExplanation: The longest increasing path is [3, 4, 5, 6]. Moving diagonally is not allowed.\n\nExample 3:\n\nInput: matrix = [[1]]\nOutput: 1\n\n \n\nConstraints:\n\n\t• `m == matrix.length`\n• `n == matrix[i].length`\n• `1 31 - 1`",
      "descriptionHtml": "<p>Given an <code>m x n</code> integers <code>matrix</code>, return <em>the length of the longest increasing path in </em><code>matrix</code>.</p>\n\n<p>From each cell, you can either move in four directions: left, right, up, or down. You <strong>may not</strong> move <strong>diagonally</strong> or move <strong>outside the boundary</strong> (i.e., wrap-around is not allowed).</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2021/01/05/grid1.jpg\" style=\"width: 242px; height: 242px;\" />\n<pre>\n<strong>Input:</strong> matrix = [[9,9,4],[6,6,8],[2,1,1]]\n<strong>Output:</strong> 4\n<strong>Explanation:</strong> The longest increasing path is <code>[1, 2, 6, 9]</code>.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2021/01/27/tmp-grid.jpg\" style=\"width: 253px; height: 253px;\" />\n<pre>\n<strong>Input:</strong> matrix = [[3,4,5],[3,2,6],[2,2,1]]\n<strong>Output:</strong> 4\n<strong>Explanation: </strong>The longest increasing path is <code>[3, 4, 5, 6]</code>. Moving diagonally is not allowed.\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> matrix = [[1]]\n<strong>Output:</strong> 1\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>m == matrix.length</code></li>\n\t<li><code>n == matrix[i].length</code></li>\n\t<li><code>1 &lt;= m, n &lt;= 200</code></li>\n\t<li><code>0 &lt;= matrix[i][j] &lt;= 2<sup>31</sup> - 1</code></li>\n</ul>\n",
      "lcSlug": "longest-increasing-path-in-a-matrix",
      "summary": "Return cached dfs(state) — top-down DP on graph/grid."
    }
  ]
};
