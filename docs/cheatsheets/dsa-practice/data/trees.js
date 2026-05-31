window.PRACTICE_TOPIC = {
  "id": "trees",
  "title": "Binary Trees & BST",
  "expected_count": 35,
  "strategy": "<strong>Speed-run:</strong> DFS postorder for aggregates; BST inorder for sorted order. Filter <em>Must do</em> first.",
  "subtopics": [
    {
      "id": "dfs",
      "label": "DFS"
    },
    {
      "id": "bfs",
      "label": "BFS"
    },
    {
      "id": "bst",
      "label": "BST"
    },
    {
      "id": "path",
      "label": "Path"
    },
    {
      "id": "serialize",
      "label": "Serialize"
    },
    {
      "id": "build",
      "label": "Build"
    }
  ],
  "questions": [
    {
      "id": "tr-01",
      "title": "Maximum Depth of Binary Tree",
      "lc": 104,
      "importance": "must",
      "subtopic": "dfs",
      "difficulty": "Easy",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "root",
          "out": "depth"
        }
      ],
      "approaches": [
        {
          "name": "DFS depth",
          "time": "O(n)",
          "space": "O(h)",
          "code": "int maxDepth(TreeNode* root) {\n    if (!root) return 0;\n    return 1 + max(maxDepth(root->left), maxDepth(root->right));\n}"
        }
      ]
    },
    {
      "id": "tr-02",
      "title": "Diameter of Binary Tree",
      "lc": 543,
      "importance": "must",
      "subtopic": "dfs",
      "difficulty": "Easy",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "root",
          "out": "diameter"
        }
      ],
      "approaches": [
        {
          "name": "Tree DFS",
          "time": "O(n)",
          "space": "O(h)",
          "code": "void dfs(TreeNode* u) {\n  if (!u) return;\n  dfs(u->left); dfs(u->right);\n}"
        }
      ]
    },
    {
      "id": "tr-03",
      "title": "Binary Tree Maximum Path Sum",
      "lc": 124,
      "importance": "must",
      "subtopic": "dfs",
      "difficulty": "Hard",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "root",
          "out": "max sum"
        }
      ],
      "approaches": [
        {
          "name": "Max path sum",
          "time": "O(n)",
          "space": "O(h)",
          "code": "int ans=INT_MIN;\nint gain(TreeNode* u){ if(!u) return 0; int l=max(0,gain(u->left)), r=max(0,gain(u->right));\n    ans=max(ans,u->val+l+r); return u->val+max(l,r); }\nint maxPathSum(TreeNode* root){ gain(root); return ans; }"
        }
      ]
    },
    {
      "id": "tr-04",
      "title": "Lowest Common Ancestor",
      "lc": 236,
      "importance": "must",
      "subtopic": "dfs",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "root,p,q",
          "out": "LCA"
        }
      ],
      "approaches": [
        {
          "name": "LCA DFS",
          "time": "O(n)",
          "space": "O(h)",
          "code": "TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {\n    if (!root || root==p || root==q) return root;\n    auto L = lowestCommonAncestor(root->left,p,q);\n    auto R = lowestCommonAncestor(root->right,p,q);\n    if (L && R) return root;\n    return L? L: R;\n}"
        }
      ]
    },
    {
      "id": "tr-05",
      "title": "LCA of BST",
      "lc": 235,
      "importance": "must",
      "subtopic": "bst",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "root,p,q",
          "out": "LCA"
        }
      ],
      "approaches": [
        {
          "name": "LCA BST",
          "time": "O(h)",
          "space": "O(1)",
          "code": "TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {\n    while (root) {\n        if (p->val < root->val && q->val < root->val) root = root->left;\n        else if (p->val > root->val && q->val > root->val) root = root->right;\n        else return root;\n    } return nullptr;\n}"
        }
      ]
    },
    {
      "id": "tr-06",
      "title": "Validate Binary Search Tree",
      "lc": 98,
      "importance": "must",
      "subtopic": "bst",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "root",
          "out": "valid?"
        }
      ],
      "approaches": [
        {
          "name": "Validate BST",
          "time": "O(n)",
          "space": "O(h)",
          "code": "bool isValidBST(TreeNode* root, long long lo=LLONG_MIN, long long hi=LLONG_MAX) {\n    if (!root) return true;\n    if (root->val <= lo || root->val >= hi) return false;\n    return isValidBST(root->left, lo, root->val) && isValidBST(root->right, root->val, hi);\n}"
        }
      ]
    },
    {
      "id": "tr-07",
      "title": "Kth Smallest in BST",
      "lc": 230,
      "importance": "must",
      "subtopic": "bst",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "root,k",
          "out": "value"
        }
      ],
      "approaches": [
        {
          "name": "Kth smallest BST",
          "time": "O(h+k)",
          "space": "O(h)",
          "code": "int kthSmallest(TreeNode* root, int k) {\n    stack<TreeNode*> st; TreeNode* cur = root;\n    while (cur || !st.empty()) {\n        while (cur) { st.push(cur); cur = cur->left; }\n        cur = st.top(); st.pop();\n        if (--k == 0) return cur->val;\n        cur = cur->right;\n    } return -1;\n}"
        }
      ]
    },
    {
      "id": "tr-08",
      "title": "Serialize and Deserialize BST",
      "lc": 449,
      "importance": "should",
      "subtopic": "serialize",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "tree",
          "out": "round trip"
        }
      ],
      "approaches": [
        {
          "name": "Optimal",
          "time": "O(n)",
          "space": "O(n)",
          "code": "// Pattern: serialize\n// Implement optimal C++ for LC 449"
        }
      ]
    },
    {
      "id": "tr-09",
      "title": "Serialize and Deserialize Binary Tree",
      "lc": 297,
      "importance": "must",
      "subtopic": "serialize",
      "difficulty": "Hard",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "tree",
          "out": "round trip"
        }
      ],
      "approaches": [
        {
          "name": "Optimal",
          "time": "O(n)",
          "space": "O(n)",
          "code": "// Pattern: serialize\n// Implement optimal C++ for LC 297"
        }
      ]
    },
    {
      "id": "tr-10",
      "title": "Binary Tree Right Side View",
      "lc": 199,
      "importance": "should",
      "subtopic": "bfs",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "root",
          "out": "right view"
        }
      ],
      "approaches": [
        {
          "name": "Tree BFS",
          "time": "O(n)",
          "space": "O(n)",
          "code": "queue<TreeNode*> q; q.push(root);\nwhile (!q.empty()) { auto u=q.front(); q.pop(); /* process */ }"
        }
      ]
    },
    {
      "id": "tr-11",
      "title": "Invert Binary Tree",
      "lc": 226,
      "importance": "must",
      "subtopic": "dfs",
      "difficulty": "Easy",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "root",
          "out": "inverted"
        }
      ],
      "approaches": [
        {
          "name": "Invert tree",
          "time": "O(n)",
          "space": "O(h)",
          "code": "TreeNode* invertTree(TreeNode* root) {\n    if (!root) return nullptr;\n    swap(root->left, root->right);\n    invertTree(root->left); invertTree(root->right);\n    return root;\n}"
        }
      ]
    },
    {
      "id": "tr-12",
      "title": "Path Sum",
      "lc": 112,
      "importance": "should",
      "subtopic": "path",
      "difficulty": "Easy",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "root,target",
          "out": "exists?"
        }
      ],
      "approaches": [
        {
          "name": "Optimal",
          "time": "O(n)",
          "space": "O(n)",
          "code": "// Pattern: path\n// Implement optimal C++ for LC 112"
        }
      ]
    },
    {
      "id": "tr-13",
      "title": "Path Sum II",
      "lc": 113,
      "importance": "should",
      "subtopic": "path",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "root,target",
          "out": "all paths"
        }
      ],
      "approaches": [
        {
          "name": "Optimal",
          "time": "O(n)",
          "space": "O(n)",
          "code": "// Pattern: path\n// Implement optimal C++ for LC 113"
        }
      ]
    },
    {
      "id": "tr-14",
      "title": "Construct from Preorder and Inorder",
      "lc": 105,
      "importance": "must",
      "subtopic": "build",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "traversals",
          "out": "tree"
        }
      ],
      "approaches": [
        {
          "name": "Optimal",
          "time": "O(n)",
          "space": "O(n)",
          "code": "// Pattern: build\n// Implement optimal C++ for LC 105"
        }
      ]
    },
    {
      "id": "tr-15",
      "title": "Construct from Inorder and Postorder",
      "lc": 106,
      "importance": "should",
      "subtopic": "build",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "traversals",
          "out": "tree"
        }
      ],
      "approaches": [
        {
          "name": "Optimal",
          "time": "O(n)",
          "space": "O(n)",
          "code": "// Pattern: build\n// Implement optimal C++ for LC 106"
        }
      ]
    },
    {
      "id": "tr-16",
      "title": "Symmetric Tree",
      "lc": 101,
      "importance": "should",
      "subtopic": "dfs",
      "difficulty": "Easy",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "root",
          "out": "symmetric?"
        }
      ],
      "approaches": [
        {
          "name": "Tree DFS",
          "time": "O(n)",
          "space": "O(h)",
          "code": "void dfs(TreeNode* u) {\n  if (!u) return;\n  dfs(u->left); dfs(u->right);\n}"
        }
      ]
    },
    {
      "id": "tr-17",
      "title": "Flatten Binary Tree to Linked List",
      "lc": 114,
      "importance": "should",
      "subtopic": "dfs",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "root",
          "out": "flatten"
        }
      ],
      "approaches": [
        {
          "name": "Tree DFS",
          "time": "O(n)",
          "space": "O(h)",
          "code": "void dfs(TreeNode* u) {\n  if (!u) return;\n  dfs(u->left); dfs(u->right);\n}"
        }
      ]
    },
    {
      "id": "tr-18",
      "title": "Populating Next Right Pointers",
      "lc": 116,
      "importance": "nice",
      "subtopic": "bfs",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "perfect tree",
          "out": "connected"
        }
      ],
      "approaches": [
        {
          "name": "Tree BFS",
          "time": "O(n)",
          "space": "O(n)",
          "code": "queue<TreeNode*> q; q.push(root);\nwhile (!q.empty()) { auto u=q.front(); q.pop(); /* process */ }"
        }
      ]
    },
    {
      "id": "tr-19",
      "title": "Binary Tree Level Order Traversal",
      "lc": 102,
      "importance": "must",
      "subtopic": "bfs",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "root",
          "out": "levels"
        }
      ],
      "approaches": [
        {
          "name": "Level order",
          "time": "O(n)",
          "space": "O(n)",
          "code": "vector<vector<int>> levelOrder(TreeNode* root) {\n    vector<vector<int>> ans; if (!root) return ans;\n    queue<TreeNode*> q; q.push(root);\n    while (!q.empty()) {\n        int sz=q.size(); vector<int> level;\n        while (sz--) { auto u=q.front(); q.pop(); level.push_back(u->val);\n            if (u->left) q.push(u->left); if (u->right) q.push(u->right); }\n        ans.push_back(level);\n    } return ans;\n}"
        }
      ]
    },
    {
      "id": "tr-20",
      "title": "Binary Tree Zigzag Level Order",
      "lc": 103,
      "importance": "should",
      "subtopic": "bfs",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "root",
          "out": "zigzag"
        }
      ],
      "approaches": [
        {
          "name": "Tree BFS",
          "time": "O(n)",
          "space": "O(n)",
          "code": "queue<TreeNode*> q; q.push(root);\nwhile (!q.empty()) { auto u=q.front(); q.pop(); /* process */ }"
        }
      ]
    },
    {
      "id": "tr-21",
      "title": "Same Tree",
      "lc": 100,
      "importance": "should",
      "subtopic": "dfs",
      "difficulty": "Easy",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "p,q",
          "out": "same?"
        }
      ],
      "approaches": [
        {
          "name": "Tree DFS",
          "time": "O(n)",
          "space": "O(h)",
          "code": "void dfs(TreeNode* u) {\n  if (!u) return;\n  dfs(u->left); dfs(u->right);\n}"
        }
      ]
    },
    {
      "id": "tr-22",
      "title": "Subtree of Another Tree",
      "lc": 572,
      "importance": "should",
      "subtopic": "dfs",
      "difficulty": "Easy",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "root, subRoot",
          "out": "subtree?"
        }
      ],
      "approaches": [
        {
          "name": "Tree DFS",
          "time": "O(n)",
          "space": "O(h)",
          "code": "void dfs(TreeNode* u) {\n  if (!u) return;\n  dfs(u->left); dfs(u->right);\n}"
        }
      ]
    },
    {
      "id": "tr-23",
      "title": "Count Good Nodes in Binary Tree",
      "lc": 1448,
      "importance": "nice",
      "subtopic": "dfs",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "root",
          "out": "count"
        }
      ],
      "approaches": [
        {
          "name": "DFS count good",
          "time": "O(n)",
          "space": "O(h)",
          "code": "int goodNodes(TreeNode* root) {\n    function<int(TreeNode*,int)> dfs=[&](TreeNode* u,int mx){\n        if(!u) return 0;\n        int ans = u->val>=mx;\n        mx = max(mx, u->val);\n        return ans + dfs(u->left,mx) + dfs(u->right,mx);\n    };\n    return dfs(root, INT_MIN);\n}"
        }
      ]
    },
    {
      "id": "tr-24",
      "title": "Range Sum of BST",
      "lc": 938,
      "importance": "should",
      "subtopic": "bst",
      "difficulty": "Easy",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "root, L,R",
          "out": "sum"
        }
      ],
      "approaches": [
        {
          "name": "Optimal",
          "time": "O(n)",
          "space": "O(n)",
          "code": "// Pattern: bst\n// Implement optimal C++ for LC 938"
        }
      ]
    },
    {
      "id": "tr-25",
      "title": "Insert into a BST",
      "lc": 701,
      "importance": "should",
      "subtopic": "bst",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "root,val",
          "out": "root"
        }
      ],
      "approaches": [
        {
          "name": "Optimal",
          "time": "O(n)",
          "space": "O(n)",
          "code": "// Pattern: bst\n// Implement optimal C++ for LC 701"
        }
      ]
    },
    {
      "id": "tr-26",
      "title": "Delete Node in a BST",
      "lc": 450,
      "importance": "should",
      "subtopic": "bst",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "root,key",
          "out": "root"
        }
      ],
      "approaches": [
        {
          "name": "Optimal",
          "time": "O(n)",
          "space": "O(n)",
          "code": "// Pattern: bst\n// Implement optimal C++ for LC 450"
        }
      ]
    },
    {
      "id": "tr-27",
      "title": "Balance a Binary Search Tree",
      "lc": 1382,
      "importance": "nice",
      "subtopic": "bst",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "root",
          "out": "balanced"
        }
      ],
      "approaches": [
        {
          "name": "Inorder + rebuild",
          "time": "O(n)",
          "space": "O(n)",
          "code": "void inorder(TreeNode* u, vector<int>& vals){ if(!u) return; inorder(u->left,vals); vals.push_back(u->val); inorder(u->right,vals); }\nTreeNode* build(vector<int>& v,int l,int r){\n    if(l>r) return nullptr; int m=l+(r-l)/2; TreeNode* root=new TreeNode(v[m]);\n    root->left=build(v,l,m-1); root->right=build(v,m+1,r); return root;\n}\nTreeNode* balanceBST(TreeNode* root){ vector<int> v; inorder(root,v); return build(v,0,(int)v.size()-1); }"
        }
      ]
    },
    {
      "id": "tr-28",
      "title": "Binary Search Tree Iterator",
      "lc": 173,
      "importance": "should",
      "subtopic": "bst",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "root",
          "out": "iterator"
        }
      ],
      "approaches": [
        {
          "name": "Optimal",
          "time": "O(n)",
          "space": "O(n)",
          "code": "// Pattern: bst\n// Implement optimal C++ for LC 173"
        }
      ]
    },
    {
      "id": "tr-29",
      "title": "Sum Root to Leaf Numbers",
      "lc": 129,
      "importance": "nice",
      "subtopic": "path",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "root",
          "out": "sum"
        }
      ],
      "approaches": [
        {
          "name": "DFS path sum",
          "time": "O(n)",
          "space": "O(h)",
          "code": "int sumNumbers(TreeNode* root) { return dfs(root,0); }\nint dfs(TreeNode* u,int cur){\n    if(!u) return 0;\n    cur=cur*10+u->val;\n    if(!u->left && !u->right) return cur;\n    return dfs(u->left,cur)+dfs(u->right,cur);\n}"
        }
      ]
    },
    {
      "id": "tr-30",
      "title": "Lowest Common Ancestor of Deepest Leaves",
      "lc": 1123,
      "importance": "nice",
      "subtopic": "dfs",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "root",
          "out": "LCA deep"
        }
      ],
      "approaches": [
        {
          "name": "Postorder depth LCA",
          "time": "O(n)",
          "space": "O(h)",
          "code": "pair<TreeNode*,int> dfs(TreeNode* u){\n    if(!u) return {nullptr,0};\n    auto L=dfs(u->left), R=dfs(u->right);\n    if(L.second==R.second) return {u,L.second+1};\n    return L.second>R.second? make_pair(L.first,L.second+1): make_pair(R.first,R.second+1);\n}\nTreeNode* lcaDeepestLeaves(TreeNode* root){ return dfs(root).first; }"
        }
      ]
    },
    {
      "id": "tr-31",
      "title": "All Nodes Distance K in Binary Tree",
      "lc": 863,
      "importance": "should",
      "subtopic": "bfs",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "root,target,k",
          "out": "nodes"
        }
      ],
      "approaches": [
        {
          "name": "Tree BFS",
          "time": "O(n)",
          "space": "O(n)",
          "code": "queue<TreeNode*> q; q.push(root);\nwhile (!q.empty()) { auto u=q.front(); q.pop(); /* process */ }"
        }
      ]
    },
    {
      "id": "tr-32",
      "title": "House Robber III",
      "lc": 337,
      "importance": "must",
      "subtopic": "tree-dp",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "root",
          "out": "max rob"
        }
      ],
      "approaches": [
        {
          "name": "Optimal",
          "time": "O(n)",
          "space": "O(n)",
          "code": "// Pattern: tree-dp\n// Implement optimal C++ for LC 337"
        }
      ]
    },
    {
      "id": "tr-33",
      "title": "Unique Binary Search Trees",
      "lc": 96,
      "importance": "should",
      "subtopic": "dp",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "n",
          "out": "count"
        }
      ],
      "approaches": [
        {
          "name": "Optimal",
          "time": "O(n)",
          "space": "O(n)",
          "code": "// Pattern: dp\n// Implement optimal C++ for LC 96"
        }
      ]
    },
    {
      "id": "tr-34",
      "title": "Recover Binary Search Tree",
      "lc": 99,
      "importance": "nice",
      "subtopic": "bst",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "root",
          "out": "fix"
        }
      ],
      "approaches": [
        {
          "name": "Inorder swap",
          "time": "O(n)",
          "space": "O(h)",
          "code": "void recoverTree(TreeNode* root) {\n    TreeNode *first=nullptr,*second=nullptr,*prev=new TreeNode(INT_MIN);\n    function<void(TreeNode*)> in=[&](TreeNode* u){\n        if(!u) return; in(u->left);\n        if(u->val < prev->val){ second=u; if(!first) first=prev; }\n        prev=u; in(u->right);\n    }; in(root); swap(first->val, second->val); delete prev;\n}"
        }
      ]
    },
    {
      "id": "tr-35",
      "title": "Vertical Order Traversal",
      "lc": 987,
      "importance": "nice",
      "subtopic": "bfs",
      "difficulty": "Hard",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "root",
          "out": "columns"
        }
      ],
      "approaches": [
        {
          "name": "Tree BFS",
          "time": "O(n)",
          "space": "O(n)",
          "code": "queue<TreeNode*> q; q.push(root);\nwhile (!q.empty()) { auto u=q.front(); q.pop(); /* process */ }"
        }
      ]
    }
  ]
};
