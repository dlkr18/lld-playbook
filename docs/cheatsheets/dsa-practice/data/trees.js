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
          "name": "Two DFS depths",
          "time": "O(n)",
          "space": "O(h)",
          "code": "int diameterOfBinaryTree(TreeNode* root) {\n    int ans = 0;\n    function<int(TreeNode*)> depth = [&](TreeNode* u) {\n        if (!u) return 0;\n        int L = depth(u->left), R = depth(u->right);\n        ans = max(ans, L + R);\n        return max(L, R) + 1;\n    };\n    depth(root); return ans;\n}"
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
          "name": "Preorder BST",
          "time": "O(n)",
          "space": "O(n)",
          "code": "class Codec {\n    void pre(TreeNode* u, string& s) {\n        if (!u) return;\n        s += to_string(u->val) + \",\";\n        pre(u->left, s); pre(u->right, s);\n    }\n    TreeNode* build(vector<int>& pre, int& i, long lo, long hi) {\n        if (i >= (int)pre.size() || pre[i] < lo || pre[i] > hi) return nullptr;\n        TreeNode* node = new TreeNode(pre[i++]);\n        node->left = build(pre, i, lo, node->val);\n        node->right = build(pre, i, node->val, hi);\n        return node;\n    }\npublic:\n    string serialize(TreeNode* root) { string s; pre(root, s); return s; }\n    TreeNode* deserialize(string data) {\n        vector<int> pre; string cur;\n        for (char ch : data) {\n            if (ch == ',') { if (!cur.empty()) { pre.push_back(stoi(cur)); cur.clear(); } }\n            else cur += ch;\n        }\n        if (!cur.empty()) pre.push_back(stoi(cur));\n        int i = 0; return build(pre, i, LONG_MIN, LONG_MAX);\n    }\n};"
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
          "name": "Preorder + markers",
          "time": "O(n)",
          "space": "O(n)",
          "code": "class Codec {\n    void pre(TreeNode* u, string& s) {\n        if (!u) { s += \"#,\"; return; }\n        s += to_string(u->val) + \",\";\n        pre(u->left, s); pre(u->right, s);\n    }\n    TreeNode* build(queue<string>& q) {\n        string t = q.front(); q.pop();\n        if (t == \"#\") return nullptr;\n        TreeNode* node = new TreeNode(stoi(t));\n        node->left = build(q); node->right = build(q);\n        return node;\n    }\npublic:\n    string serialize(TreeNode* root) { string s; pre(root, s); return s; }\n    TreeNode* deserialize(string data) {\n        queue<string> q; string cur;\n        for (char ch : data) {\n            if (ch == ',') { if (!cur.empty()) q.push(cur); cur.clear(); }\n            else cur += ch;\n        }\n        if (!cur.empty()) q.push(cur);\n        return build(q);\n    }\n};"
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
          "name": "DFS path",
          "time": "O(n)",
          "space": "O(h)",
          "code": "bool hasPathSum(TreeNode* root, int sum) {\n    if (!root) return false;\n    if (!root->left && !root->right) return root->val == sum;\n    return hasPathSum(root->left, sum - root->val) || hasPathSum(root->right, sum - root->val);\n}"
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
          "name": "Backtrack paths",
          "time": "O(n^2)",
          "space": "O(h)",
          "code": "vector<vector<int>> pathSum(TreeNode* root, int sum) {\n    vector<vector<int>> ans; vector<int> path;\n    function<void(TreeNode*,int)> dfs = [&](TreeNode* u, int rem) {\n        if (!u) return;\n        path.push_back(u->val);\n        if (!u->left && !u->right && rem == u->val) ans.push_back(path);\n        dfs(u->left, rem - u->val); dfs(u->right, rem - u->val);\n        path.pop_back();\n    };\n    dfs(root, sum); return ans;\n}"
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
          "name": "Recursive partition",
          "time": "O(n)",
          "space": "O(n)",
          "code": "TreeNode* buildTree(vector<int>& pre, vector<int>& in) {\n    unordered_map<int,int> idx; for (int i = 0; i < (int)in.size(); i++) idx[in[i]] = i;\n    int p = 0;\n    function<TreeNode*(int,int)> dfs = [&](int l, int r) {\n        if (l > r) return (TreeNode*)nullptr;\n        int v = pre[p++], m = idx[v];\n        TreeNode* node = new TreeNode(v);\n        node->left = dfs(l, m-1); node->right = dfs(m+1, r);\n        return node;\n    };\n    return dfs(0, (int)in.size()-1);\n}"
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
          "name": "Recursive partition",
          "time": "O(n)",
          "space": "O(n)",
          "code": "TreeNode* buildTree(vector<int>& in, vector<int>& post) {\n    unordered_map<int,int> idx; for (int i = 0; i < (int)in.size(); i++) idx[in[i]] = i;\n    int p = (int)post.size()-1;\n    function<TreeNode*(int,int)> dfs = [&](int l, int r) {\n        if (l > r) return (TreeNode*)nullptr;\n        int v = post[p--], m = idx[v];\n        TreeNode* node = new TreeNode(v);\n        node->right = dfs(m+1, r); node->left = dfs(l, m-1);\n        return node;\n    };\n    return dfs(0, (int)in.size()-1);\n}"
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
          "name": "Mirror DFS",
          "time": "O(n)",
          "space": "O(h)",
          "code": "bool isSymmetric(TreeNode* root) {\n    function<bool(TreeNode*,TreeNode*)> eq = [&](TreeNode* a, TreeNode* b) {\n        if (!a || !b) return a == b;\n        return a->val == b->val && eq(a->left, b->right) && eq(a->right, b->left);\n    };\n    return !root || eq(root->left, root->right);\n}"
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
          "name": "Morris / reverse",
          "time": "O(n)",
          "space": "O(1)",
          "code": "void flatten(TreeNode* root) {\n    TreeNode* cur = root;\n    while (cur) {\n        if (cur->left) {\n            TreeNode* pre = cur->left;\n            while (pre->right) pre = pre->right;\n            pre->right = cur->right; cur->right = cur->left; cur->left = nullptr;\n        }\n        cur = cur->right;\n    }\n}"
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
          "name": "DFS compare",
          "time": "O(n)",
          "space": "O(h)",
          "code": "bool isSameTree(TreeNode* p, TreeNode* q) {\n    if (!p || !q) return p == q;\n    return p->val == q->val && isSameTree(p->left, q) && isSameTree(p->right, q);\n}"
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
          "name": "Same tree check",
          "time": "O(mn)",
          "space": "O(h)",
          "code": "bool isSubtree(TreeNode* root, TreeNode* sub) {\n    function<bool(TreeNode*,TreeNode*)> same = [&](TreeNode* a, TreeNode* b) {\n        if (!a || !b) return a == b;\n        return a->val == b->val && same(a->left,b->left) && same(a->right,b->right);\n    };\n    if (!root) return false;\n    return same(root, sub) || isSubtree(root->left, sub) || isSubtree(root->right, sub);\n}"
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
          "name": "DFS range sum",
          "time": "O(n)",
          "space": "O(h)",
          "code": "int rangeSumBST(TreeNode* root, int low, int high) {\n    if (!root) return 0;\n    if (root->val < low) return rangeSumBST(root->right, low, high);\n    if (root->val > high) return rangeSumBST(root->left, low, high);\n    return root->val + rangeSumBST(root->left, low, high) + rangeSumBST(root->right, low, high);\n}"
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
          "name": "BST insert",
          "time": "O(h)",
          "space": "O(h)",
          "code": "TreeNode* insertIntoBST(TreeNode* root, int val) {\n    if (!root) return new TreeNode(val);\n    if (val < root->val) root->left = insertIntoBST(root->left, val);\n    else root->right = insertIntoBST(root->right, val);\n    return root;\n}"
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
          "name": "BST delete",
          "time": "O(h)",
          "space": "O(h)",
          "code": "TreeNode* deleteNode(TreeNode* root, int key) {\n    if (!root) return nullptr;\n    if (key < root->val) root->left = deleteNode(root->left, key);\n    else if (key > root->val) root->right = deleteNode(root->right, key);\n    else {\n        if (!root->left) return root->right;\n        if (!root->right) return root->left;\n        TreeNode* succ = root->right;\n        while (succ->left) succ = succ->left;\n        root->val = succ->val;\n        root->right = deleteNode(root->right, succ->val);\n    }\n    return root;\n}"
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
          "name": "Stack iterator",
          "time": "O(1) amortized",
          "space": "O(h)",
          "code": "class BSTIterator {\n    stack<TreeNode*> st;\n    void pushLeft(TreeNode* u) { while (u) { st.push(u); u = u->left; } }\npublic:\n    BSTIterator(TreeNode* root) { pushLeft(root); }\n    int next() { TreeNode* u = st.top(); st.pop(); pushLeft(u->right); return u->val; }\n    bool hasNext() { return !st.empty(); }\n};"
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
          "name": "Tree DP",
          "time": "O(n)",
          "space": "O(h)",
          "code": "int rob(TreeNode* root) {\n    function<pair<int,int>(TreeNode*)> dfs = [&](TreeNode* u) {\n        if (!u) return make_pair(0, 0);\n        auto L = dfs(u->left), R = dfs(u->right);\n        int take = u->val + L.second + R.second;\n        int skip = max(L.first, L.second) + max(R.first, R.second);\n        return make_pair(take, skip);\n    };\n    auto p = dfs(root); return max(p.first, p.second);\n}"
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
          "name": "Catalan DP",
          "time": "O(n^2)",
          "space": "O(n)",
          "code": "int numTrees(int n) {\n    vector<int> dp(n + 1, 0); dp[0] = dp[1] = 1;\n    for (int nodes = 2; nodes <= n; nodes++)\n        for (int root = 1; root <= nodes; root++)\n            dp[nodes] += dp[root-1] * dp[nodes-root];\n    return dp[n];\n}"
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
