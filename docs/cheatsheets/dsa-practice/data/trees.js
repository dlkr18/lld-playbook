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
      ],
      "description": "Given the `root` of a binary tree, return its maximum depth.\n\nA binary tree's maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.\n\n \n\nExample 1:\n\nInput: root = [3,9,20,null,null,15,7]\nOutput: 3\n\nExample 2:\n\nInput: root = [1,null,2]\nOutput: 2\n\n \n\nConstraints:\n\n\t• The number of nodes in the tree is in the range `[0, 104]`.\n• `-100",
      "descriptionHtml": "<p>Given the <code>root</code> of a binary tree, return <em>its maximum depth</em>.</p>\n\n<p>A binary tree&#39;s <strong>maximum depth</strong>&nbsp;is the number of nodes along the longest path from the root node down to the farthest leaf node.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2020/11/26/tmp-tree.jpg\" style=\"width: 400px; height: 277px;\" />\n<pre>\n<strong>Input:</strong> root = [3,9,20,null,null,15,7]\n<strong>Output:</strong> 3\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> root = [1,null,2]\n<strong>Output:</strong> 2\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li>The number of nodes in the tree is in the range <code>[0, 10<sup>4</sup>]</code>.</li>\n\t<li><code>-100 &lt;= Node.val &lt;= 100</code></li>\n</ul>\n",
      "lcSlug": "maximum-depth-of-binary-tree",
      "summary": "DFS depth — state invariant, then loop."
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
      ],
      "description": "Given the `root` of a binary tree, return the length of the diameter of the tree.\n\nThe diameter of a binary tree is the length of the longest path between any two nodes in a tree. This path may or may not pass through the `root`.\n\nThe length of a path between two nodes is represented by the number of edges between them.\n\n \n\nExample 1:\n\nInput: root = [1,2,3,4,5]\nOutput: 3\nExplanation: 3 is the length of the path [4,2,1,3] or [5,2,1,3].\n\nExample 2:\n\nInput: root = [1,2]\nOutput: 1\n\n \n\nConstraints:\n\n\t• The number of nodes in the tree is in the range `[1, 104]`.\n• `-100",
      "descriptionHtml": "<p>Given the <code>root</code> of a binary tree, return <em>the length of the <strong>diameter</strong> of the tree</em>.</p>\n\n<p>The <strong>diameter</strong> of a binary tree is the <strong>length</strong> of the longest path between any two nodes in a tree. This path may or may not pass through the <code>root</code>.</p>\n\n<p>The <strong>length</strong> of a path between two nodes is represented by the number of edges between them.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2021/03/06/diamtree.jpg\" style=\"width: 292px; height: 302px;\" />\n<pre>\n<strong>Input:</strong> root = [1,2,3,4,5]\n<strong>Output:</strong> 3\n<strong>Explanation:</strong> 3 is the length of the path [4,2,1,3] or [5,2,1,3].\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> root = [1,2]\n<strong>Output:</strong> 1\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li>The number of nodes in the tree is in the range <code>[1, 10<sup>4</sup>]</code>.</li>\n\t<li><code>-100 &lt;= Node.val &lt;= 100</code></li>\n</ul>\n",
      "lcSlug": "diameter-of-binary-tree",
      "summary": "Two DFS depths — state invariant, then loop."
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
      ],
      "description": "A path in a binary tree is a sequence of nodes where each pair of adjacent nodes in the sequence has an edge connecting them. A node can only appear in the sequence at most once. Note that the path does not need to pass through the root.\n\nThe path sum of a path is the sum of the node's values in the path.\n\nGiven the `root` of a binary tree, return the maximum path sum of any non-empty path.\n\n \n\nExample 1:\n\nInput: root = [1,2,3]\nOutput: 6\nExplanation: The optimal path is 2 -> 1 -> 3 with a path sum of 2 + 1 + 3 = 6.\n\nExample 2:\n\nInput: root = [-10,9,20,null,null,15,7]\nOutput: 42\nExplanation: The optimal path is 15 -> 20 -> 7 with a path sum of 15 + 20 + 7 = 42.\n\n \n\nConstraints:\n\n\t• The number of nodes in the tree is in the range `[1, 3 * 104]`.\n• `-1000",
      "descriptionHtml": "<p>A <strong>path</strong> in a binary tree is a sequence of nodes where each pair of adjacent nodes in the sequence has an edge connecting them. A node can only appear in the sequence <strong>at most once</strong>. Note that the path does not need to pass through the root.</p>\n\n<p>The <strong>path sum</strong> of a path is the sum of the node&#39;s values in the path.</p>\n\n<p>Given the <code>root</code> of a binary tree, return <em>the maximum <strong>path sum</strong> of any <strong>non-empty</strong> path</em>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2020/10/13/exx1.jpg\" style=\"width: 322px; height: 182px;\" />\n<pre>\n<strong>Input:</strong> root = [1,2,3]\n<strong>Output:</strong> 6\n<strong>Explanation:</strong> The optimal path is 2 -&gt; 1 -&gt; 3 with a path sum of 2 + 1 + 3 = 6.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2020/10/13/exx2.jpg\" />\n<pre>\n<strong>Input:</strong> root = [-10,9,20,null,null,15,7]\n<strong>Output:</strong> 42\n<strong>Explanation:</strong> The optimal path is 15 -&gt; 20 -&gt; 7 with a path sum of 15 + 20 + 7 = 42.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li>The number of nodes in the tree is in the range <code>[1, 3 * 10<sup>4</sup>]</code>.</li>\n\t<li><code>-1000 &lt;= Node.val &lt;= 1000</code></li>\n</ul>\n",
      "lcSlug": "binary-tree-maximum-path-sum",
      "summary": "Max path sum — state invariant, then loop."
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
      ],
      "description": "Given a binary tree, find the lowest common ancestor (LCA) of two given nodes in the tree.\n\nAccording to the definition of LCA on Wikipedia: &ldquo;The lowest common ancestor is defined between two nodes `p` and `q` as the lowest node in `T` that has both `p` and `q` as descendants (where we allow a node to be a descendant of itself).&rdquo;\n\n \n\nExample 1:\n\nInput: root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 1\nOutput: 3\nExplanation: The LCA of nodes 5 and 1 is 3.\n\nExample 2:\n\nInput: root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 4\nOutput: 5\nExplanation: The LCA of nodes 5 and 4 is 5, since a node can be a descendant of itself according to the LCA definition.\n\nExample 3:\n\nInput: root = [1,2], p = 1, q = 2\nOutput: 1\n\n \n\nConstraints:\n\n\t• The number of nodes in the tree is in the range `[2, 105]`.\n• `-109 9`\n• All `Node.val` are unique.\n• `p != q`\n• `p` and `q` will exist in the tree.",
      "descriptionHtml": "<p>Given a binary tree, find the lowest common ancestor (LCA) of two given nodes in the tree.</p>\n\n<p>According to the <a href=\"https://en.wikipedia.org/wiki/Lowest_common_ancestor\" target=\"_blank\">definition of LCA on Wikipedia</a>: &ldquo;The lowest common ancestor is defined between two nodes <code>p</code> and <code>q</code> as the lowest node in <code>T</code> that has both <code>p</code> and <code>q</code> as descendants (where we allow <b>a node to be a descendant of itself</b>).&rdquo;</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2018/12/14/binarytree.png\" style=\"width: 200px; height: 190px;\" />\n<pre>\n<strong>Input:</strong> root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 1\n<strong>Output:</strong> 3\n<strong>Explanation:</strong> The LCA of nodes 5 and 1 is 3.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2018/12/14/binarytree.png\" style=\"width: 200px; height: 190px;\" />\n<pre>\n<strong>Input:</strong> root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 4\n<strong>Output:</strong> 5\n<strong>Explanation:</strong> The LCA of nodes 5 and 4 is 5, since a node can be a descendant of itself according to the LCA definition.\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> root = [1,2], p = 1, q = 2\n<strong>Output:</strong> 1\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li>The number of nodes in the tree is in the range <code>[2, 10<sup>5</sup>]</code>.</li>\n\t<li><code>-10<sup>9</sup> &lt;= Node.val &lt;= 10<sup>9</sup></code></li>\n\t<li>All <code>Node.val</code> are <strong>unique</strong>.</li>\n\t<li><code>p != q</code></li>\n\t<li><code>p</code> and <code>q</code> will exist in the tree.</li>\n</ul>\n",
      "lcSlug": "lowest-common-ancestor-of-a-binary-tree",
      "summary": "If u==p or q or null return u; merge left/right — if both non-null, u is LCA."
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
      ],
      "description": "Given a binary search tree (BST), find the lowest common ancestor (LCA) node of two given nodes in the BST.\n\nAccording to the definition of LCA on Wikipedia: &ldquo;The lowest common ancestor is defined between two nodes `p` and `q` as the lowest node in `T` that has both `p` and `q` as descendants (where we allow a node to be a descendant of itself).&rdquo;\n\n \n\nExample 1:\n\nInput: root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 8\nOutput: 6\nExplanation: The LCA of nodes 2 and 8 is 6.\n\nExample 2:\n\nInput: root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 4\nOutput: 2\nExplanation: The LCA of nodes 2 and 4 is 2, since a node can be a descendant of itself according to the LCA definition.\n\nExample 3:\n\nInput: root = [2,1], p = 2, q = 1\nOutput: 2\n\n \n\nConstraints:\n\n\t• The number of nodes in the tree is in the range `[2, 105]`.\n• `-109 9`\n• All `Node.val` are unique.\n• `p != q`\n• `p` and `q` will exist in the BST.",
      "descriptionHtml": "<p>Given a binary search tree (BST), find the lowest common ancestor (LCA) node of two given nodes in the BST.</p>\n\n<p>According to the <a href=\"https://en.wikipedia.org/wiki/Lowest_common_ancestor\" target=\"_blank\">definition of LCA on Wikipedia</a>: &ldquo;The lowest common ancestor is defined between two nodes <code>p</code> and <code>q</code> as the lowest node in <code>T</code> that has both <code>p</code> and <code>q</code> as descendants (where we allow <strong>a node to be a descendant of itself</strong>).&rdquo;</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2018/12/14/binarysearchtree_improved.png\" style=\"width: 200px; height: 190px;\" />\n<pre>\n<strong>Input:</strong> root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 8\n<strong>Output:</strong> 6\n<strong>Explanation:</strong> The LCA of nodes 2 and 8 is 6.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2018/12/14/binarysearchtree_improved.png\" style=\"width: 200px; height: 190px;\" />\n<pre>\n<strong>Input:</strong> root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 4\n<strong>Output:</strong> 2\n<strong>Explanation:</strong> The LCA of nodes 2 and 4 is 2, since a node can be a descendant of itself according to the LCA definition.\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> root = [2,1], p = 2, q = 1\n<strong>Output:</strong> 2\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li>The number of nodes in the tree is in the range <code>[2, 10<sup>5</sup>]</code>.</li>\n\t<li><code>-10<sup>9</sup> &lt;= Node.val &lt;= 10<sup>9</sup></code></li>\n\t<li>All <code>Node.val</code> are <strong>unique</strong>.</li>\n\t<li><code>p != q</code></li>\n\t<li><code>p</code> and <code>q</code> will exist in the BST.</li>\n</ul>\n",
      "lcSlug": "lowest-common-ancestor-of-a-binary-search-tree",
      "summary": "LCA BST — state invariant, then loop."
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
      ],
      "description": "Given the `root` of a binary tree, determine if it is a valid binary search tree (BST).\n\nA valid BST is defined as follows:\n\n\t• The left subtree of a node contains only nodes with keys strictly less than the node's key.\n• The right subtree of a node contains only nodes with keys strictly greater than the node's key.\n• Both the left and right subtrees must also be binary search trees.\n\n \n\nExample 1:\n\nInput: root = [2,1,3]\nOutput: true\n\nExample 2:\n\nInput: root = [5,1,4,null,null,3,6]\nOutput: false\nExplanation: The root node's value is 5 but its right child's value is 4.\n\n \n\nConstraints:\n\n\t• The number of nodes in the tree is in the range `[1, 104]`.\n• `-231 31 - 1`",
      "descriptionHtml": "<p>Given the <code>root</code> of a binary tree, <em>determine if it is a valid binary search tree (BST)</em>.</p>\n\n<p>A <strong>valid BST</strong> is defined as follows:</p>\n\n<ul>\n\t<li>The left <span data-keyword=\"subtree\">subtree</span> of a node contains only nodes with keys&nbsp;<strong>strictly less than</strong> the node&#39;s key.</li>\n\t<li>The right subtree of a node contains only nodes with keys <strong>strictly greater than</strong> the node&#39;s key.</li>\n\t<li>Both the left and right subtrees must also be binary search trees.</li>\n</ul>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2020/12/01/tree1.jpg\" style=\"width: 302px; height: 182px;\" />\n<pre>\n<strong>Input:</strong> root = [2,1,3]\n<strong>Output:</strong> true\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2020/12/01/tree2.jpg\" style=\"width: 422px; height: 292px;\" />\n<pre>\n<strong>Input:</strong> root = [5,1,4,null,null,3,6]\n<strong>Output:</strong> false\n<strong>Explanation:</strong> The root node&#39;s value is 5 but its right child&#39;s value is 4.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li>The number of nodes in the tree is in the range <code>[1, 10<sup>4</sup>]</code>.</li>\n\t<li><code>-2<sup>31</sup> &lt;= Node.val &lt;= 2<sup>31</sup> - 1</code></li>\n</ul>\n",
      "lcSlug": "validate-binary-search-tree",
      "summary": "Validate BST — state invariant, then loop."
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
      ],
      "description": "Given the `root` of a binary search tree, and an integer `k`, return the `kth` smallest value (1-indexed) of all the values of the nodes in the tree.\n\n \n\nExample 1:\n\nInput: root = [3,1,4,null,2], k = 1\nOutput: 1\n\nExample 2:\n\nInput: root = [5,3,6,2,4,null,null,1], k = 3\nOutput: 3\n\n \n\nConstraints:\n\n\t• The number of nodes in the tree is `n`.\n• `1 4`\n• `0 4`\n\n \n\nFollow up: If the BST is modified often (i.e., we can do insert and delete operations) and you need to find the kth smallest frequently, how would you optimize?",
      "descriptionHtml": "<p>Given the <code>root</code> of a binary search tree, and an integer <code>k</code>, return <em>the</em> <code>k<sup>th</sup></code> <em>smallest value (<strong>1-indexed</strong>) of all the values of the nodes in the tree</em>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2021/01/28/kthtree1.jpg\" style=\"width: 212px; height: 301px;\" />\n<pre>\n<strong>Input:</strong> root = [3,1,4,null,2], k = 1\n<strong>Output:</strong> 1\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2021/01/28/kthtree2.jpg\" style=\"width: 382px; height: 302px;\" />\n<pre>\n<strong>Input:</strong> root = [5,3,6,2,4,null,null,1], k = 3\n<strong>Output:</strong> 3\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li>The number of nodes in the tree is <code>n</code>.</li>\n\t<li><code>1 &lt;= k &lt;= n &lt;= 10<sup>4</sup></code></li>\n\t<li><code>0 &lt;= Node.val &lt;= 10<sup>4</sup></code></li>\n</ul>\n\n<p>&nbsp;</p>\n<p><strong>Follow up:</strong> If the BST is modified often (i.e., we can do insert and delete operations) and you need to find the kth smallest frequently, how would you optimize?</p>\n",
      "lcSlug": "kth-smallest-element-in-a-bst",
      "summary": "Kth smallest BST — state invariant, then loop."
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
      ],
      "description": "Serialization is converting a data structure or object into a sequence of bits so that it can be stored in a file or memory buffer, or transmitted across a network connection link to be reconstructed later in the same or another computer environment.\n\nDesign an algorithm to serialize and deserialize a binary search tree. There is no restriction on how your serialization/deserialization algorithm should work. You need to ensure that a binary search tree can be serialized to a string, and this string can be deserialized to the original tree structure.\n\nThe encoded string should be as compact as possible.\n\n \n\nExample 1:\n\nInput: root = [2,1,3]\nOutput: [2,1,3]\n\nExample 2:\n\nInput: root = []\nOutput: []\n\n \n\nConstraints:\n\n\t• The number of nodes in the tree is in the range `[0, 104]`.\n• `0 4`\n• The input tree is guaranteed to be a binary search tree.",
      "descriptionHtml": "<p>Serialization is converting a data structure or object into a sequence of bits so that it can be stored in a file or memory buffer, or transmitted across a network connection link to be reconstructed later in the same or another computer environment.</p>\n\n<p>Design an algorithm to serialize and deserialize a <b>binary search tree</b>. There is no restriction on how your serialization/deserialization algorithm should work. You need to ensure that a binary search tree can be serialized to a string, and this string can be deserialized to the original tree structure.</p>\n\n<p><b>The encoded string should be as compact as possible.</b></p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<pre><strong>Input:</strong> root = [2,1,3]\n<strong>Output:</strong> [2,1,3]\n</pre><p><strong class=\"example\">Example 2:</strong></p>\n<pre><strong>Input:</strong> root = []\n<strong>Output:</strong> []\n</pre>\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li>The number of nodes in the tree is in the range <code>[0, 10<sup>4</sup>]</code>.</li>\n\t<li><code>0 &lt;= Node.val &lt;= 10<sup>4</sup></code></li>\n\t<li>The input tree is <strong>guaranteed</strong> to be a binary search tree.</li>\n</ul>\n",
      "lcSlug": "serialize-and-deserialize-bst",
      "summary": "Preorder BST — state invariant, then loop."
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
      ],
      "description": "Serialization is the process of converting a data structure or object into a sequence of bits so that it can be stored in a file or memory buffer, or transmitted across a network connection link to be reconstructed later in the same or another computer environment.\n\nDesign an algorithm to serialize and deserialize a binary tree. There is no restriction on how your serialization/deserialization algorithm should work. You just need to ensure that a binary tree can be serialized to a string and this string can be deserialized to the original tree structure.\n\nClarification: The input/output format is the same as how LeetCode serializes a binary tree. You do not necessarily need to follow this format, so please be creative and come up with different approaches yourself.\n\n \n\nExample 1:\n\nInput: root = [1,2,3,null,null,4,5]\nOutput: [1,2,3,null,null,4,5]\n\nExample 2:\n\nInput: root = []\nOutput: []\n\n \n\nConstraints:\n\n\t• The number of nodes in the tree is in the range `[0, 104]`.\n• `-1000",
      "descriptionHtml": "<p>Serialization is the process of converting a data structure or object into a sequence of bits so that it can be stored in a file or memory buffer, or transmitted across a network connection link to be reconstructed later in the same or another computer environment.</p>\n\n<p>Design an algorithm to serialize and deserialize a binary tree. There is no restriction on how your serialization/deserialization algorithm should work. You just need to ensure that a binary tree can be serialized to a string and this string can be deserialized to the original tree structure.</p>\n\n<p><strong>Clarification:</strong> The input/output format is the same as <a href=\"https://support.leetcode.com/hc/en-us/articles/32442719377939-How-to-create-test-cases-on-LeetCode#h_01J5EGREAW3NAEJ14XC07GRW1A\" target=\"_blank\">how LeetCode serializes a binary tree</a>. You do not necessarily need to follow this format, so please be creative and come up with different approaches yourself.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2020/09/15/serdeser.jpg\" style=\"width: 442px; height: 324px;\" />\n<pre>\n<strong>Input:</strong> root = [1,2,3,null,null,4,5]\n<strong>Output:</strong> [1,2,3,null,null,4,5]\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> root = []\n<strong>Output:</strong> []\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li>The number of nodes in the tree is in the range <code>[0, 10<sup>4</sup>]</code>.</li>\n\t<li><code>-1000 &lt;= Node.val &lt;= 1000</code></li>\n</ul>\n",
      "lcSlug": "serialize-and-deserialize-binary-tree",
      "summary": "Serialize with null markers; queue rebuild recursively."
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
      ],
      "description": "Given the `root` of a binary tree, imagine yourself standing on the right side of it, return the values of the nodes you can see ordered from top to bottom.\n\n \n\nExample 1:\n\nInput: root = [1,2,3,null,5,null,4]\n\nOutput: [1,3,4]\n\nExplanation:\n\nExample 2:\n\nInput: root = [1,2,3,4,null,null,null,5]\n\nOutput: [1,3,4,5]\n\nExplanation:\n\nExample 3:\n\nInput: root = [1,null,3]\n\nOutput: [1,3]\n\nExample 4:\n\nInput: root = []\n\nOutput: []\n\n \n\nConstraints:\n\n\t• The number of nodes in the tree is in the range `[0, 100]`.\n• `-100",
      "descriptionHtml": "<p>Given the <code>root</code> of a binary tree, imagine yourself standing on the <strong>right side</strong> of it, return <em>the values of the nodes you can see ordered from top to bottom</em>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<div class=\"example-block\">\n<p><strong>Input:</strong> <span class=\"example-io\">root = [1,2,3,null,5,null,4]</span></p>\n\n<p><strong>Output:</strong> <span class=\"example-io\">[1,3,4]</span></p>\n\n<p><strong>Explanation:</strong></p>\n\n<p><img alt=\"\" src=\"https://assets.leetcode.com/uploads/2024/11/24/tmpd5jn43fs-1.png\" style=\"width: 400px; height: 207px;\" /></p>\n</div>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<div class=\"example-block\">\n<p><strong>Input:</strong> <span class=\"example-io\">root = [1,2,3,4,null,null,null,5]</span></p>\n\n<p><strong>Output:</strong> <span class=\"example-io\">[1,3,4,5]</span></p>\n\n<p><strong>Explanation:</strong></p>\n\n<p><img alt=\"\" src=\"https://assets.leetcode.com/uploads/2024/11/24/tmpkpe40xeh-1.png\" style=\"width: 400px; height: 214px;\" /></p>\n</div>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<div class=\"example-block\">\n<p><strong>Input:</strong> <span class=\"example-io\">root = [1,null,3]</span></p>\n\n<p><strong>Output:</strong> <span class=\"example-io\">[1,3]</span></p>\n</div>\n\n<p><strong class=\"example\">Example 4:</strong></p>\n\n<div class=\"example-block\">\n<p><strong>Input:</strong> <span class=\"example-io\">root = []</span></p>\n\n<p><strong>Output:</strong> <span class=\"example-io\">[]</span></p>\n</div>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li>The number of nodes in the tree is in the range <code>[0, 100]</code>.</li>\n\t<li><code>-100 &lt;= Node.val &lt;= 100</code></li>\n</ul>\n",
      "lcSlug": "binary-tree-right-side-view",
      "summary": "Tree BFS — state invariant, then loop."
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
      ],
      "description": "Given the `root` of a binary tree, invert the tree, and return its root.\n\n \n\nExample 1:\n\nInput: root = [4,2,7,1,3,6,9]\nOutput: [4,7,2,9,6,3,1]\n\nExample 2:\n\nInput: root = [2,1,3]\nOutput: [2,3,1]\n\nExample 3:\n\nInput: root = []\nOutput: []\n\n \n\nConstraints:\n\n\t• The number of nodes in the tree is in the range `[0, 100]`.\n• `-100",
      "descriptionHtml": "<p>Given the <code>root</code> of a binary tree, invert the tree, and return <em>its root</em>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2021/03/14/invert1-tree.jpg\" style=\"width: 500px; height: 165px;\" />\n<pre>\n<strong>Input:</strong> root = [4,2,7,1,3,6,9]\n<strong>Output:</strong> [4,7,2,9,6,3,1]\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2021/03/14/invert2-tree.jpg\" style=\"width: 500px; height: 120px;\" />\n<pre>\n<strong>Input:</strong> root = [2,1,3]\n<strong>Output:</strong> [2,3,1]\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> root = []\n<strong>Output:</strong> []\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li>The number of nodes in the tree is in the range <code>[0, 100]</code>.</li>\n\t<li><code>-100 &lt;= Node.val &lt;= 100</code></li>\n</ul>\n",
      "lcSlug": "invert-binary-tree",
      "summary": "Invert tree — state invariant, then loop."
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
      ],
      "description": "Given the `root` of a binary tree and an integer `targetSum`, return `true` if the tree has a root-to-leaf path such that adding up all the values along the path equals `targetSum`.\n\nA leaf is a node with no children.\n\n \n\nExample 1:\n\nInput: root = [5,4,8,11,null,13,4,7,2,null,null,null,1], targetSum = 22\nOutput: true\nExplanation: The root-to-leaf path with the target sum is shown.\n\nExample 2:\n\nInput: root = [1,2,3], targetSum = 5\nOutput: false\nExplanation: There are two root-to-leaf paths in the tree:\n(1 --> 2): The sum is 3.\n(1 --> 3): The sum is 4.\nThere is no root-to-leaf path with sum = 5.\n\nExample 3:\n\nInput: root = [], targetSum = 0\nOutput: false\nExplanation: Since the tree is empty, there are no root-to-leaf paths.\n\n \n\nConstraints:\n\n\t• The number of nodes in the tree is in the range `[0, 5000]`.\n• `-1000",
      "descriptionHtml": "<p>Given the <code>root</code> of a binary tree and an integer <code>targetSum</code>, return <code>true</code> if the tree has a <strong>root-to-leaf</strong> path such that adding up all the values along the path equals <code>targetSum</code>.</p>\n\n<p>A <strong>leaf</strong> is a node with no children.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2021/01/18/pathsum1.jpg\" style=\"width: 500px; height: 356px;\" />\n<pre>\n<strong>Input:</strong> root = [5,4,8,11,null,13,4,7,2,null,null,null,1], targetSum = 22\n<strong>Output:</strong> true\n<strong>Explanation:</strong> The root-to-leaf path with the target sum is shown.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2021/01/18/pathsum2.jpg\" />\n<pre>\n<strong>Input:</strong> root = [1,2,3], targetSum = 5\n<strong>Output:</strong> false\n<strong>Explanation:</strong> There are two root-to-leaf paths in the tree:\n(1 --&gt; 2): The sum is 3.\n(1 --&gt; 3): The sum is 4.\nThere is no root-to-leaf path with sum = 5.\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> root = [], targetSum = 0\n<strong>Output:</strong> false\n<strong>Explanation:</strong> Since the tree is empty, there are no root-to-leaf paths.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li>The number of nodes in the tree is in the range <code>[0, 5000]</code>.</li>\n\t<li><code>-1000 &lt;= Node.val &lt;= 1000</code></li>\n\t<li><code>-1000 &lt;= targetSum &lt;= 1000</code></li>\n</ul>\n",
      "lcSlug": "path-sum",
      "summary": "DFS path — state invariant, then loop."
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
      ],
      "description": "Given the `root` of a binary tree and an integer `targetSum`, return all root-to-leaf paths where the sum of the node values in the path equals `targetSum`. Each path should be returned as a list of the node values, not node references.\n\nA root-to-leaf path is a path starting from the root and ending at any leaf node. A leaf is a node with no children.\n\n \n\nExample 1:\n\nInput: root = [5,4,8,11,null,13,4,7,2,null,null,5,1], targetSum = 22\nOutput: [[5,4,11,2],[5,8,4,5]]\nExplanation: There are two paths whose sum equals targetSum:\n5 + 4 + 11 + 2 = 22\n5 + 8 + 4 + 5 = 22\n\nExample 2:\n\nInput: root = [1,2,3], targetSum = 5\nOutput: []\n\nExample 3:\n\nInput: root = [1,2], targetSum = 0\nOutput: []\n\n \n\nConstraints:\n\n\t• The number of nodes in the tree is in the range `[0, 5000]`.\n• `-1000",
      "descriptionHtml": "<p>Given the <code>root</code> of a binary tree and an integer <code>targetSum</code>, return <em>all <strong>root-to-leaf</strong> paths where the sum of the node values in the path equals </em><code>targetSum</code><em>. Each path should be returned as a list of the node <strong>values</strong>, not node references</em>.</p>\n\n<p>A <strong>root-to-leaf</strong> path is a path starting from the root and ending at any leaf node. A <strong>leaf</strong> is a node with no children.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2021/01/18/pathsumii1.jpg\" style=\"width: 500px; height: 356px;\" />\n<pre>\n<strong>Input:</strong> root = [5,4,8,11,null,13,4,7,2,null,null,5,1], targetSum = 22\n<strong>Output:</strong> [[5,4,11,2],[5,8,4,5]]\n<strong>Explanation:</strong> There are two paths whose sum equals targetSum:\n5 + 4 + 11 + 2 = 22\n5 + 8 + 4 + 5 = 22\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2021/01/18/pathsum2.jpg\" style=\"width: 212px; height: 181px;\" />\n<pre>\n<strong>Input:</strong> root = [1,2,3], targetSum = 5\n<strong>Output:</strong> []\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> root = [1,2], targetSum = 0\n<strong>Output:</strong> []\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li>The number of nodes in the tree is in the range <code>[0, 5000]</code>.</li>\n\t<li><code>-1000 &lt;= Node.val &lt;= 1000</code></li>\n\t<li><code>-1000 &lt;= targetSum &lt;= 1000</code></li>\n</ul>\n",
      "lcSlug": "path-sum-ii",
      "summary": "Backtrack paths — state invariant, then loop."
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
      ],
      "description": "Given two integer arrays `preorder` and `inorder` where `preorder` is the preorder traversal of a binary tree and `inorder` is the inorder traversal of the same tree, construct and return the binary tree.\n\n \n\nExample 1:\n\nInput: preorder = [3,9,20,15,7], inorder = [9,3,15,20,7]\nOutput: [3,9,20,null,null,15,7]\n\nExample 2:\n\nInput: preorder = [-1], inorder = [-1]\nOutput: [-1]\n\n \n\nConstraints:\n\n\t• `1",
      "descriptionHtml": "<p>Given two integer arrays <code>preorder</code> and <code>inorder</code> where <code>preorder</code> is the preorder traversal of a binary tree and <code>inorder</code> is the inorder traversal of the same tree, construct and return <em>the binary tree</em>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2021/02/19/tree.jpg\" style=\"width: 277px; height: 302px;\" />\n<pre>\n<strong>Input:</strong> preorder = [3,9,20,15,7], inorder = [9,3,15,20,7]\n<strong>Output:</strong> [3,9,20,null,null,15,7]\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> preorder = [-1], inorder = [-1]\n<strong>Output:</strong> [-1]\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= preorder.length &lt;= 3000</code></li>\n\t<li><code>inorder.length == preorder.length</code></li>\n\t<li><code>-3000 &lt;= preorder[i], inorder[i] &lt;= 3000</code></li>\n\t<li><code>preorder</code> and <code>inorder</code> consist of <strong>unique</strong> values.</li>\n\t<li>Each value of <code>inorder</code> also appears in <code>preorder</code>.</li>\n\t<li><code>preorder</code> is <strong>guaranteed</strong> to be the preorder traversal of the tree.</li>\n\t<li><code>inorder</code> is <strong>guaranteed</strong> to be the inorder traversal of the tree.</li>\n</ul>\n",
      "lcSlug": "construct-binary-tree-from-preorder-and-inorder-traversal",
      "summary": "Pick root from preorder; split inorder into left/right ranges."
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
      ],
      "description": "Given two integer arrays `inorder` and `postorder` where `inorder` is the inorder traversal of a binary tree and `postorder` is the postorder traversal of the same tree, construct and return the binary tree.\n\n \n\nExample 1:\n\nInput: inorder = [9,3,15,20,7], postorder = [9,15,7,20,3]\nOutput: [3,9,20,null,null,15,7]\n\nExample 2:\n\nInput: inorder = [-1], postorder = [-1]\nOutput: [-1]\n\n \n\nConstraints:\n\n\t• `1",
      "descriptionHtml": "<p>Given two integer arrays <code>inorder</code> and <code>postorder</code> where <code>inorder</code> is the inorder traversal of a binary tree and <code>postorder</code> is the postorder traversal of the same tree, construct and return <em>the binary tree</em>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2021/02/19/tree.jpg\" style=\"width: 277px; height: 302px;\" />\n<pre>\n<strong>Input:</strong> inorder = [9,3,15,20,7], postorder = [9,15,7,20,3]\n<strong>Output:</strong> [3,9,20,null,null,15,7]\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> inorder = [-1], postorder = [-1]\n<strong>Output:</strong> [-1]\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= inorder.length &lt;= 3000</code></li>\n\t<li><code>postorder.length == inorder.length</code></li>\n\t<li><code>-3000 &lt;= inorder[i], postorder[i] &lt;= 3000</code></li>\n\t<li><code>inorder</code> and <code>postorder</code> consist of <strong>unique</strong> values.</li>\n\t<li>Each value of <code>postorder</code> also appears in <code>inorder</code>.</li>\n\t<li><code>inorder</code> is <strong>guaranteed</strong> to be the inorder traversal of the tree.</li>\n\t<li><code>postorder</code> is <strong>guaranteed</strong> to be the postorder traversal of the tree.</li>\n</ul>\n",
      "lcSlug": "construct-binary-tree-from-inorder-and-postorder-traversal",
      "summary": "Pick root from preorder; split inorder into left/right ranges."
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
      ],
      "description": "Given the `root` of a binary tree, check whether it is a mirror of itself (i.e., symmetric around its center).\n\n \n\nExample 1:\n\nInput: root = [1,2,2,3,4,4,3]\nOutput: true\n\nExample 2:\n\nInput: root = [1,2,2,null,3,null,3]\nOutput: false\n\n \n\nConstraints:\n\n\t• The number of nodes in the tree is in the range `[1, 1000]`.\n• `-100 \n\n \nFollow up: Could you solve it both recursively and iteratively?",
      "descriptionHtml": "<p>Given the <code>root</code> of a binary tree, <em>check whether it is a mirror of itself</em> (i.e., symmetric around its center).</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2021/02/19/symtree1.jpg\" style=\"width: 354px; height: 291px;\" />\n<pre>\n<strong>Input:</strong> root = [1,2,2,3,4,4,3]\n<strong>Output:</strong> true\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2021/02/19/symtree2.jpg\" style=\"width: 308px; height: 258px;\" />\n<pre>\n<strong>Input:</strong> root = [1,2,2,null,3,null,3]\n<strong>Output:</strong> false\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li>The number of nodes in the tree is in the range <code>[1, 1000]</code>.</li>\n\t<li><code>-100 &lt;= Node.val &lt;= 100</code></li>\n</ul>\n\n<p>&nbsp;</p>\n<strong>Follow up:</strong> Could you solve it both recursively and iteratively?",
      "lcSlug": "symmetric-tree",
      "summary": "Left subtree must mirror right — compare (a.left, b.right) pairs."
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
      ],
      "description": "Given the `root` of a binary tree, flatten the tree into a \"linked list\":\n\n\t• The \"linked list\" should use the same `TreeNode` class where the `right` child pointer points to the next node in the list and the `left` child pointer is always `null`.\n• The \"linked list\" should be in the same order as a pre-order traversal of the binary tree.\n\n \n\nExample 1:\n\nInput: root = [1,2,5,3,4,null,6]\nOutput: [1,null,2,null,3,null,4,null,5,null,6]\n\nExample 2:\n\nInput: root = []\nOutput: []\n\nExample 3:\n\nInput: root = [0]\nOutput: [0]\n\n \n\nConstraints:\n\n\t• The number of nodes in the tree is in the range `[0, 2000]`.\n• `-100 \n\n \nFollow up: Can you flatten the tree in-place (with `O(1)` extra space)?",
      "descriptionHtml": "<p>Given the <code>root</code> of a binary tree, flatten the tree into a &quot;linked list&quot;:</p>\n\n<ul>\n\t<li>The &quot;linked list&quot; should use the same <code>TreeNode</code> class where the <code>right</code> child pointer points to the next node in the list and the <code>left</code> child pointer is always <code>null</code>.</li>\n\t<li>The &quot;linked list&quot; should be in the same order as a <a href=\"https://en.wikipedia.org/wiki/Tree_traversal#Pre-order,_NLR\" target=\"_blank\"><strong>pre-order</strong><strong> traversal</strong></a> of the binary tree.</li>\n</ul>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2021/01/14/flaten.jpg\" style=\"width: 500px; height: 226px;\" />\n<pre>\n<strong>Input:</strong> root = [1,2,5,3,4,null,6]\n<strong>Output:</strong> [1,null,2,null,3,null,4,null,5,null,6]\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> root = []\n<strong>Output:</strong> []\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> root = [0]\n<strong>Output:</strong> [0]\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li>The number of nodes in the tree is in the range <code>[0, 2000]</code>.</li>\n\t<li><code>-100 &lt;= Node.val &lt;= 100</code></li>\n</ul>\n\n<p>&nbsp;</p>\n<strong>Follow up:</strong> Can you flatten the tree in-place (with <code>O(1)</code> extra space)?",
      "lcSlug": "flatten-binary-tree-to-linked-list",
      "summary": "Rightmost of left subtree links to current; flatten to right skew."
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
      ],
      "description": "You are given a perfect binary tree where all leaves are on the same level, and every parent has two children. The binary tree has the following definition:\n\nstruct Node {\n  int val;\n  Node *left;\n  Node *right;\n  Node *next;\n}\n\nPopulate each next pointer to point to its next right node. If there is no next right node, the next pointer should be set to `NULL`.\n\nInitially, all next pointers are set to `NULL`.\n\n \n\nExample 1:\n\nInput: root = [1,2,3,4,5,6,7]\nOutput: [1,#,2,3,#,4,5,6,7,#]\nExplanation: Given the above perfect binary tree (Figure A), your function should populate each next pointer to point to its next right node, just like in Figure B. The serialized output is in level order as connected by the next pointers, with '#' signifying the end of each level.\n\nExample 2:\n\nInput: root = []\nOutput: []\n\n \n\nConstraints:\n\n\t• The number of nodes in the tree is in the range `[0, 212 - 1]`.\n• `-1000 \n\n \n\nFollow-up:\n\n\t• You may only use constant extra space.\n• The recursive approach is fine. You may assume implicit stack space does not count as extra space for this problem.",
      "descriptionHtml": "<p>You are given a <strong>perfect binary tree</strong> where all leaves are on the same level, and every parent has two children. The binary tree has the following definition:</p>\n\n<pre>\nstruct Node {\n  int val;\n  Node *left;\n  Node *right;\n  Node *next;\n}\n</pre>\n\n<p>Populate each next pointer to point to its next right node. If there is no next right node, the next pointer should be set to <code>NULL</code>.</p>\n\n<p>Initially, all next pointers are set to <code>NULL</code>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2019/02/14/116_sample.png\" style=\"width: 500px; height: 171px;\" />\n<pre>\n<strong>Input:</strong> root = [1,2,3,4,5,6,7]\n<strong>Output:</strong> [1,#,2,3,#,4,5,6,7,#]\n<strong>Explanation: </strong>Given the above perfect binary tree (Figure A), your function should populate each next pointer to point to its next right node, just like in Figure B. The serialized output is in level order as connected by the next pointers, with &#39;#&#39; signifying the end of each level.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> root = []\n<strong>Output:</strong> []\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li>The number of nodes in the tree is in the range <code>[0, 2<sup>12</sup> - 1]</code>.</li>\n\t<li><code>-1000 &lt;= Node.val &lt;= 1000</code></li>\n</ul>\n\n<p>&nbsp;</p>\n<p><strong>Follow-up:</strong></p>\n\n<ul>\n\t<li>You may only use constant extra space.</li>\n\t<li>The recursive approach is fine. You may assume implicit stack space does not count as extra space for this problem.</li>\n</ul>\n",
      "lcSlug": "populating-next-right-pointers-in-each-node",
      "summary": "Tree BFS — state invariant, then loop."
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
      ],
      "description": "Given the `root` of a binary tree, return the level order traversal of its nodes' values. (i.e., from left to right, level by level).\n\n \n\nExample 1:\n\nInput: root = [3,9,20,null,null,15,7]\nOutput: [[3],[9,20],[15,7]]\n\nExample 2:\n\nInput: root = [1]\nOutput: [[1]]\n\nExample 3:\n\nInput: root = []\nOutput: []\n\n \n\nConstraints:\n\n\t• The number of nodes in the tree is in the range `[0, 2000]`.\n• `-1000",
      "descriptionHtml": "<p>Given the <code>root</code> of a binary tree, return <em>the level order traversal of its nodes&#39; values</em>. (i.e., from left to right, level by level).</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2021/02/19/tree1.jpg\" style=\"width: 277px; height: 302px;\" />\n<pre>\n<strong>Input:</strong> root = [3,9,20,null,null,15,7]\n<strong>Output:</strong> [[3],[9,20],[15,7]]\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> root = [1]\n<strong>Output:</strong> [[1]]\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> root = []\n<strong>Output:</strong> []\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li>The number of nodes in the tree is in the range <code>[0, 2000]</code>.</li>\n\t<li><code>-1000 &lt;= Node.val &lt;= 1000</code></li>\n</ul>\n",
      "lcSlug": "binary-tree-level-order-traversal",
      "summary": "Level order — state invariant, then loop."
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
      ],
      "description": "Given the `root` of a binary tree, return the zigzag level order traversal of its nodes' values. (i.e., from left to right, then right to left for the next level and alternate between).\n\n \n\nExample 1:\n\nInput: root = [3,9,20,null,null,15,7]\nOutput: [[3],[20,9],[15,7]]\n\nExample 2:\n\nInput: root = [1]\nOutput: [[1]]\n\nExample 3:\n\nInput: root = []\nOutput: []\n\n \n\nConstraints:\n\n\t• The number of nodes in the tree is in the range `[0, 2000]`.\n• `-100",
      "descriptionHtml": "<p>Given the <code>root</code> of a binary tree, return <em>the zigzag level order traversal of its nodes&#39; values</em>. (i.e., from left to right, then right to left for the next level and alternate between).</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2021/02/19/tree1.jpg\" style=\"width: 277px; height: 302px;\" />\n<pre>\n<strong>Input:</strong> root = [3,9,20,null,null,15,7]\n<strong>Output:</strong> [[3],[20,9],[15,7]]\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> root = [1]\n<strong>Output:</strong> [[1]]\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> root = []\n<strong>Output:</strong> []\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li>The number of nodes in the tree is in the range <code>[0, 2000]</code>.</li>\n\t<li><code>-100 &lt;= Node.val &lt;= 100</code></li>\n</ul>\n",
      "lcSlug": "binary-tree-zigzag-level-order-traversal",
      "summary": "Tree BFS — state invariant, then loop."
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
      ],
      "description": "Given the roots of two binary trees `p` and `q`, write a function to check if they are the same or not.\n\nTwo binary trees are considered the same if they are structurally identical, and the nodes have the same value.\n\n \n\nExample 1:\n\nInput: p = [1,2,3], q = [1,2,3]\nOutput: true\n\nExample 2:\n\nInput: p = [1,2], q = [1,null,2]\nOutput: false\n\nExample 3:\n\nInput: p = [1,2,1], q = [1,1,2]\nOutput: false\n\n \n\nConstraints:\n\n\t• The number of nodes in both trees is in the range `[0, 100]`.\n• `-104 4`",
      "descriptionHtml": "<p>Given the roots of two binary trees <code>p</code> and <code>q</code>, write a function to check if they are the same or not.</p>\n\n<p>Two binary trees are considered the same if they are structurally identical, and the nodes have the same value.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2020/12/20/ex1.jpg\" style=\"width: 622px; height: 182px;\" />\n<pre>\n<strong>Input:</strong> p = [1,2,3], q = [1,2,3]\n<strong>Output:</strong> true\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2020/12/20/ex2.jpg\" style=\"width: 382px; height: 182px;\" />\n<pre>\n<strong>Input:</strong> p = [1,2], q = [1,null,2]\n<strong>Output:</strong> false\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2020/12/20/ex3.jpg\" style=\"width: 622px; height: 182px;\" />\n<pre>\n<strong>Input:</strong> p = [1,2,1], q = [1,1,2]\n<strong>Output:</strong> false\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li>The number of nodes in both trees is in the range <code>[0, 100]</code>.</li>\n\t<li><code>-10<sup>4</sup> &lt;= Node.val &lt;= 10<sup>4</sup></code></li>\n</ul>\n",
      "lcSlug": "same-tree",
      "summary": "DFS compare — state invariant, then loop."
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
      ],
      "description": "Given the roots of two binary trees `root` and `subRoot`, return `true` if there is a subtree of `root` with the same structure and node values of` subRoot` and `false` otherwise.\n\nA subtree of a binary tree `tree` is a tree that consists of a node in `tree` and all of this node's descendants. The tree `tree` could also be considered as a subtree of itself.\n\n \n\nExample 1:\n\nInput: root = [3,4,5,1,2], subRoot = [4,1,2]\nOutput: true\n\nExample 2:\n\nInput: root = [3,4,5,1,2,null,null,null,null,0], subRoot = [4,1,2]\nOutput: false\n\n \n\nConstraints:\n\n\t• The number of nodes in the `root` tree is in the range `[1, 2000]`.\n• The number of nodes in the `subRoot` tree is in the range `[1, 1000]`.\n• `-104 4`\n• `-104 4`",
      "descriptionHtml": "<p>Given the roots of two binary trees <code>root</code> and <code>subRoot</code>, return <code>true</code> if there is a subtree of <code>root</code> with the same structure and node values of<code> subRoot</code> and <code>false</code> otherwise.</p>\n\n<p>A subtree of a binary tree <code>tree</code> is a tree that consists of a node in <code>tree</code> and all of this node&#39;s descendants. The tree <code>tree</code> could also be considered as a subtree of itself.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2021/04/28/subtree1-tree.jpg\" style=\"width: 532px; height: 400px;\" />\n<pre>\n<strong>Input:</strong> root = [3,4,5,1,2], subRoot = [4,1,2]\n<strong>Output:</strong> true\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2021/04/28/subtree2-tree.jpg\" style=\"width: 502px; height: 458px;\" />\n<pre>\n<strong>Input:</strong> root = [3,4,5,1,2,null,null,null,null,0], subRoot = [4,1,2]\n<strong>Output:</strong> false\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li>The number of nodes in the <code>root</code> tree is in the range <code>[1, 2000]</code>.</li>\n\t<li>The number of nodes in the <code>subRoot</code> tree is in the range <code>[1, 1000]</code>.</li>\n\t<li><code>-10<sup>4</sup> &lt;= root.val &lt;= 10<sup>4</sup></code></li>\n\t<li><code>-10<sup>4</sup> &lt;= subRoot.val &lt;= 10<sup>4</sup></code></li>\n</ul>\n",
      "lcSlug": "subtree-of-another-tree",
      "summary": "Same structure and values — DFS compare or serialize compare."
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
      ],
      "description": "Given a binary tree `root`, a node X in the tree is named good if in the path from root to X there are no nodes with a value greater than X.\n\nReturn the number of good nodes in the binary tree.\n\n \n\nExample 1:\n\n\r\n\r\n\n\r\nInput: root = [3,1,4,3,null,1,5]\r\nOutput: 4\r\nExplanation: Nodes in blue are good.\r\nRoot Node (3) is always a good node.\r\nNode 4 -> (3,4) is the maximum value in the path starting from the root.\r\nNode 5 -> (3,4,5) is the maximum value in the path\r\nNode 3 -> (3,1,3) is the maximum value in the path.\n\r\n\r\nExample 2:\n\n\r\n\r\n\n\r\nInput: root = [3,3,null,4,2]\r\nOutput: 3\r\nExplanation: Node 2 -> (3, 3, 2) is not good, because \"3\" is higher than it.\n\r\n\r\nExample 3:\r\n\r\n\n\r\nInput: root = [1]\r\nOutput: 1\r\nExplanation: Root is considered as good.\n\r\n\r\n \n\nConstraints:\r\n\r\n\r\n\t• The number of nodes in the binary tree is in the range `[1, 10^5]`.\n• Each node's value is between `[-10^4, 10^4]`.",
      "descriptionHtml": "<p>Given a binary tree <code>root</code>, a node <em>X</em> in the tree is named&nbsp;<strong>good</strong> if in the path from root to <em>X</em> there are no nodes with a value <em>greater than</em> X.</p>\r\n\r\n<p>Return the number of <strong>good</strong> nodes in the binary tree.</p>\r\n\r\n<p>&nbsp;</p>\r\n<p><strong class=\"example\">Example 1:</strong></p>\r\n\r\n<p><strong><img alt=\"\" src=\"https://assets.leetcode.com/uploads/2020/04/02/test_sample_1.png\" style=\"width: 263px; height: 156px;\" /></strong></p>\r\n\r\n<pre>\r\n<strong>Input:</strong> root = [3,1,4,3,null,1,5]\r\n<strong>Output:</strong> 4\r\n<strong>Explanation:</strong> Nodes in blue are <strong>good</strong>.\r\nRoot Node (3) is always a good node.\r\nNode 4 -&gt; (3,4) is the maximum value in the path starting from the root.\r\nNode 5 -&gt; (3,4,5) is the maximum value in the path\r\nNode 3 -&gt; (3,1,3) is the maximum value in the path.</pre>\r\n\r\n<p><strong class=\"example\">Example 2:</strong></p>\r\n\r\n<p><strong><img alt=\"\" src=\"https://assets.leetcode.com/uploads/2020/04/02/test_sample_2.png\" style=\"width: 157px; height: 161px;\" /></strong></p>\r\n\r\n<pre>\r\n<strong>Input:</strong> root = [3,3,null,4,2]\r\n<strong>Output:</strong> 3\r\n<strong>Explanation:</strong> Node 2 -&gt; (3, 3, 2) is not good, because &quot;3&quot; is higher than it.</pre>\r\n\r\n<p><strong class=\"example\">Example 3:</strong></p>\r\n\r\n<pre>\r\n<strong>Input:</strong> root = [1]\r\n<strong>Output:</strong> 1\r\n<strong>Explanation:</strong> Root is considered as <strong>good</strong>.</pre>\r\n\r\n<p>&nbsp;</p>\r\n<p><strong>Constraints:</strong></p>\r\n\r\n<ul>\r\n\t<li>The number of nodes in the binary tree is in the range&nbsp;<code>[1, 10^5]</code>.</li>\r\n\t<li>Each node&#39;s value is between <code>[-10^4, 10^4]</code>.</li>\r\n</ul>",
      "lcSlug": "count-good-nodes-in-binary-tree",
      "summary": "DFS count good — state invariant, then loop."
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
      ],
      "description": "Given the `root` node of a binary search tree and two integers `low` and `high`, return the sum of values of all nodes with a value in the inclusive range `[low, high]`.\n\n \n\nExample 1:\n\nInput: root = [10,5,15,3,7,null,18], low = 7, high = 15\nOutput: 32\nExplanation: Nodes 7, 10, and 15 are in the range [7, 15]. 7 + 10 + 15 = 32.\n\nExample 2:\n\nInput: root = [10,5,15,3,7,13,18,1,null,6], low = 6, high = 10\nOutput: 23\nExplanation: Nodes 6, 7, and 10 are in the range [6, 10]. 6 + 7 + 10 = 23.\n\n \n\nConstraints:\n\n\t• The number of nodes in the tree is in the range `[1, 2 * 104]`.\n• `1 5`\n• `1 5`\n• All `Node.val` are unique.",
      "descriptionHtml": "<p>Given the <code>root</code> node of a binary search tree and two integers <code>low</code> and <code>high</code>, return <em>the sum of values of all nodes with a value in the <strong>inclusive</strong> range </em><code>[low, high]</code>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2020/11/05/bst1.jpg\" style=\"width: 400px; height: 222px;\" />\n<pre>\n<strong>Input:</strong> root = [10,5,15,3,7,null,18], low = 7, high = 15\n<strong>Output:</strong> 32\n<strong>Explanation:</strong> Nodes 7, 10, and 15 are in the range [7, 15]. 7 + 10 + 15 = 32.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2020/11/05/bst2.jpg\" style=\"width: 400px; height: 335px;\" />\n<pre>\n<strong>Input:</strong> root = [10,5,15,3,7,13,18,1,null,6], low = 6, high = 10\n<strong>Output:</strong> 23\n<strong>Explanation:</strong> Nodes 6, 7, and 10 are in the range [6, 10]. 6 + 7 + 10 = 23.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li>The number of nodes in the tree is in the range <code>[1, 2 * 10<sup>4</sup>]</code>.</li>\n\t<li><code>1 &lt;= Node.val &lt;= 10<sup>5</sup></code></li>\n\t<li><code>1 &lt;= low &lt;= high &lt;= 10<sup>5</sup></code></li>\n\t<li>All <code>Node.val</code> are <strong>unique</strong>.</li>\n</ul>\n",
      "lcSlug": "range-sum-of-bst",
      "summary": "DFS range sum — state invariant, then loop."
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
      ],
      "description": "You are given the `root` node of a binary search tree (BST) and a `value` to insert into the tree. Return the root node of the BST after the insertion. It is guaranteed that the new value does not exist in the original BST.\n\nNotice that there may exist multiple valid ways for the insertion, as long as the tree remains a BST after insertion. You can return any of them.\n\n \n\nExample 1:\n\nInput: root = [4,2,7,1,3], val = 5\nOutput: [4,2,7,1,3,5]\nExplanation: Another accepted tree is:\n\nExample 2:\n\nInput: root = [40,20,60,10,30,50,70], val = 25\nOutput: [40,20,60,10,30,50,70,null,null,25]\n\nExample 3:\n\nInput: root = [4,2,7,1,3,null,null,null,null,null,null], val = 5\nOutput: [4,2,7,1,3,5]\n\n \n\nConstraints:\n\n\t• The number of nodes in the tree will be in the range `[0, 104]`.\n• `-108 8`\n• All the values `Node.val` are unique.\n• `-108 8`\n• It's guaranteed that `val` does not exist in the original BST.",
      "descriptionHtml": "<p>You are given the <code>root</code> node of a binary search tree (BST) and a <code>value</code> to insert into the tree. Return <em>the root node of the BST after the insertion</em>. It is <strong>guaranteed</strong> that the new value does not exist in the original BST.</p>\n\n<p><strong>Notice</strong>&nbsp;that there may exist&nbsp;multiple valid ways for the&nbsp;insertion, as long as the tree remains a BST after insertion. You can return <strong>any of them</strong>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2020/10/05/insertbst.jpg\" style=\"width: 752px; height: 221px;\" />\n<pre>\n<strong>Input:</strong> root = [4,2,7,1,3], val = 5\n<strong>Output:</strong> [4,2,7,1,3,5]\n<strong>Explanation:</strong> Another accepted tree is:\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2020/10/05/bst.jpg\" style=\"width: 352px; height: 301px;\" />\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> root = [40,20,60,10,30,50,70], val = 25\n<strong>Output:</strong> [40,20,60,10,30,50,70,null,null,25]\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> root = [4,2,7,1,3,null,null,null,null,null,null], val = 5\n<strong>Output:</strong> [4,2,7,1,3,5]\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li>The number of nodes in&nbsp;the tree will be in the range <code>[0,&nbsp;10<sup>4</sup>]</code>.</li>\n\t<li><code>-10<sup>8</sup> &lt;= Node.val &lt;= 10<sup>8</sup></code></li>\n\t<li>All the values <code>Node.val</code> are <strong>unique</strong>.</li>\n\t<li><code>-10<sup>8</sup> &lt;= val &lt;= 10<sup>8</sup></code></li>\n\t<li>It&#39;s <strong>guaranteed</strong> that <code>val</code> does not exist in the original BST.</li>\n</ul>\n",
      "lcSlug": "insert-into-a-binary-search-tree",
      "summary": "BST insert — state invariant, then loop."
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
      ],
      "description": "Given a root node reference of a BST and a key, delete the node with the given key in the BST. Return the root node reference (possibly updated) of the BST.\n\nBasically, the deletion can be divided into two stages:\n\n\t• Search for a node to remove.\n• If the node is found, delete the node.\n\n \n\nExample 1:\n\nInput: root = [5,3,6,2,4,null,7], key = 3\nOutput: [5,4,6,2,null,null,7]\nExplanation: Given key to delete is 3. So we find the node with value 3 and delete it.\nOne valid answer is [5,4,6,2,null,null,7], shown in the above BST.\nPlease notice that another valid answer is [5,2,6,null,4,null,7] and it's also accepted.\n\nExample 2:\n\nInput: root = [5,3,6,2,4,null,7], key = 0\nOutput: [5,3,6,2,4,null,7]\nExplanation: The tree does not contain a node with value = 0.\n\nExample 3:\n\nInput: root = [], key = 0\nOutput: []\n\n \n\nConstraints:\n\n\t• The number of nodes in the tree is in the range `[0, 104]`.\n• `-105 5`\n• Each node has a unique value.\n• `root` is a valid binary search tree.\n• `-105 5`\n\n \n\nFollow up: Could you solve it with time complexity `O(height of tree)`?",
      "descriptionHtml": "<p>Given a root node reference of a BST and a key, delete the node with the given key in the BST. Return <em>the <strong>root node reference</strong> (possibly updated) of the BST</em>.</p>\n\n<p>Basically, the deletion can be divided into two stages:</p>\n\n<ol>\n\t<li>Search for a node to remove.</li>\n\t<li>If the node is found, delete the node.</li>\n</ol>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2020/09/04/del_node_1.jpg\" style=\"width: 800px; height: 214px;\" />\n<pre>\n<strong>Input:</strong> root = [5,3,6,2,4,null,7], key = 3\n<strong>Output:</strong> [5,4,6,2,null,null,7]\n<strong>Explanation:</strong> Given key to delete is 3. So we find the node with value 3 and delete it.\nOne valid answer is [5,4,6,2,null,null,7], shown in the above BST.\nPlease notice that another valid answer is [5,2,6,null,4,null,7] and it&#39;s also accepted.\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2020/09/04/del_node_supp.jpg\" style=\"width: 350px; height: 255px;\" />\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> root = [5,3,6,2,4,null,7], key = 0\n<strong>Output:</strong> [5,3,6,2,4,null,7]\n<strong>Explanation:</strong> The tree does not contain a node with value = 0.\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> root = [], key = 0\n<strong>Output:</strong> []\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li>The number of nodes in the tree is in the range <code>[0, 10<sup>4</sup>]</code>.</li>\n\t<li><code>-10<sup>5</sup> &lt;= Node.val &lt;= 10<sup>5</sup></code></li>\n\t<li>Each node has a <strong>unique</strong> value.</li>\n\t<li><code>root</code> is a valid binary search tree.</li>\n\t<li><code>-10<sup>5</sup> &lt;= key &lt;= 10<sup>5</sup></code></li>\n</ul>\n\n<p>&nbsp;</p>\n<p><strong>Follow up:</strong> Could you solve it with time complexity <code>O(height of tree)</code>?</p>\n",
      "lcSlug": "delete-node-in-a-bst",
      "summary": "Find node; replace with inorder succ or move left subtree up."
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
      ],
      "description": "Given the `root` of a binary search tree, return a balanced binary search tree with the same node values. If there is more than one answer, return any of them.\n\nA binary search tree is balanced if the depth of the two subtrees of every node never differs by more than `1`.\n\n \n\nExample 1:\n\nInput: root = [1,null,2,null,3,null,4,null,null]\nOutput: [2,1,3,null,null,null,4]\nExplanation: This is not the only correct answer, [3,1,4,null,2] is also correct.\n\nExample 2:\n\nInput: root = [2,1,3]\nOutput: [2,1,3]\n\n \n\nConstraints:\n\n\t• The number of nodes in the tree is in the range `[1, 104]`.\n• `1 5`",
      "descriptionHtml": "<p>Given the <code>root</code> of a binary search tree, return <em>a <strong>balanced</strong> binary search tree with the same node values</em>. If there is more than one answer, return <strong>any of them</strong>.</p>\n\n<p>A binary search tree is <strong>balanced</strong> if the depth of the two subtrees of every node never differs by more than <code>1</code>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2021/08/10/balance1-tree.jpg\" style=\"width: 500px; height: 319px;\" />\n<pre>\n<strong>Input:</strong> root = [1,null,2,null,3,null,4,null,null]\n<strong>Output:</strong> [2,1,3,null,null,null,4]\n<b>Explanation:</b> This is not the only correct answer, [3,1,4,null,2] is also correct.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2021/08/10/balanced2-tree.jpg\" style=\"width: 224px; height: 145px;\" />\n<pre>\n<strong>Input:</strong> root = [2,1,3]\n<strong>Output:</strong> [2,1,3]\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li>The number of nodes in the tree is in the range <code>[1, 10<sup>4</sup>]</code>.</li>\n\t<li><code>1 &lt;= Node.val &lt;= 10<sup>5</sup></code></li>\n</ul>\n",
      "lcSlug": "balance-a-binary-search-tree",
      "summary": "Inorder + rebuild — state invariant, then loop."
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
      ],
      "description": "Implement the `BSTIterator` class that represents an iterator over the in-order traversal of a binary search tree (BST):\n\n\t• `BSTIterator(TreeNode root)` Initializes an object of the `BSTIterator` class. The `root` of the BST is given as part of the constructor. The pointer should be initialized to a non-existent number smaller than any element in the BST.\n• `boolean hasNext()` Returns `true` if there exists a number in the traversal to the right of the pointer, otherwise returns `false`.\n• `int next()` Moves the pointer to the right, then returns the number at the pointer.\n\nNotice that by initializing the pointer to a non-existent smallest number, the first call to `next()` will return the smallest element in the BST.\n\nYou may assume that `next()` calls will always be valid. That is, there will be at least a next number in the in-order traversal when `next()` is called.\n\n \n\nExample 1:\n\nInput\n[\"BSTIterator\", \"next\", \"next\", \"hasNext\", \"next\", \"hasNext\", \"next\", \"hasNext\", \"next\", \"hasNext\"]\n[[[7, 3, 15, null, null, 9, 20]], [], [], [], [], [], [], [], [], []]\nOutput\n[null, 3, 7, true, 9, true, 15, true, 20, false]\n\nExplanation\nBSTIterator bSTIterator = new BSTIterator([7, 3, 15, null, null, 9, 20]);\nbSTIterator.next();    // return 3\nbSTIterator.next();    // return 7\nbSTIterator.hasNext(); // return True\nbSTIterator.next();    // return 9\nbSTIterator.hasNext(); // return True\nbSTIterator.next();    // return 15\nbSTIterator.hasNext(); // return True\nbSTIterator.next();    // return 20\nbSTIterator.hasNext(); // return False\n\n \n\nConstraints:\n\n\t• The number of nodes in the tree is in the range `[1, 105]`.\n• `0 6`\n• At most `105` calls will be made to `hasNext`, and `next`.\n\n \n\nFollow up:\n\n\t• Could you implement `next()` and `hasNext()` to run in average `O(1)` time and use `O(h)` memory, where `h` is the height of the tree?",
      "descriptionHtml": "<p>Implement the <code>BSTIterator</code> class that represents an iterator over the <strong><a href=\"https://en.wikipedia.org/wiki/Tree_traversal#In-order_(LNR)\" target=\"_blank\">in-order traversal</a></strong> of a binary search tree (BST):</p>\n\n<ul>\n\t<li><code>BSTIterator(TreeNode root)</code> Initializes an object of the <code>BSTIterator</code> class. The <code>root</code> of the BST is given as part of the constructor. The pointer should be initialized to a non-existent number smaller than any element in the BST.</li>\n\t<li><code>boolean hasNext()</code> Returns <code>true</code> if there exists a number in the traversal to the right of the pointer, otherwise returns <code>false</code>.</li>\n\t<li><code>int next()</code> Moves the pointer to the right, then returns the number at the pointer.</li>\n</ul>\n\n<p>Notice that by initializing the pointer to a non-existent smallest number, the first call to <code>next()</code> will return the smallest element in the BST.</p>\n\n<p>You may assume that <code>next()</code> calls will always be valid. That is, there will be at least a next number in the in-order traversal when <code>next()</code> is called.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2018/12/25/bst-tree.png\" style=\"width: 189px; height: 178px;\" />\n<pre>\n<strong>Input</strong>\n[&quot;BSTIterator&quot;, &quot;next&quot;, &quot;next&quot;, &quot;hasNext&quot;, &quot;next&quot;, &quot;hasNext&quot;, &quot;next&quot;, &quot;hasNext&quot;, &quot;next&quot;, &quot;hasNext&quot;]\n[[[7, 3, 15, null, null, 9, 20]], [], [], [], [], [], [], [], [], []]\n<strong>Output</strong>\n[null, 3, 7, true, 9, true, 15, true, 20, false]\n\n<strong>Explanation</strong>\nBSTIterator bSTIterator = new BSTIterator([7, 3, 15, null, null, 9, 20]);\nbSTIterator.next();    // return 3\nbSTIterator.next();    // return 7\nbSTIterator.hasNext(); // return True\nbSTIterator.next();    // return 9\nbSTIterator.hasNext(); // return True\nbSTIterator.next();    // return 15\nbSTIterator.hasNext(); // return True\nbSTIterator.next();    // return 20\nbSTIterator.hasNext(); // return False\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li>The number of nodes in the tree is in the range <code>[1, 10<sup>5</sup>]</code>.</li>\n\t<li><code>0 &lt;= Node.val &lt;= 10<sup>6</sup></code></li>\n\t<li>At most <code>10<sup>5</sup></code> calls will be made to <code>hasNext</code>, and <code>next</code>.</li>\n</ul>\n\n<p>&nbsp;</p>\n<p><strong>Follow up:</strong></p>\n\n<ul>\n\t<li>Could you implement <code>next()</code> and <code>hasNext()</code> to run in average <code>O(1)</code> time and use&nbsp;<code>O(h)</code> memory, where <code>h</code> is the height of the tree?</li>\n</ul>\n",
      "lcSlug": "binary-search-tree-iterator",
      "summary": "Stack iterator — state invariant, then loop."
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
      ],
      "description": "You are given the `root` of a binary tree containing digits from `0` to `9` only.\n\nEach root-to-leaf path in the tree represents a number.\n\n\t• For example, the root-to-leaf path `1 -> 2 -> 3` represents the number `123`.\n\nReturn the total sum of all root-to-leaf numbers. Test cases are generated so that the answer will fit in a 32-bit integer.\n\nA leaf node is a node with no children.\n\n \n\nExample 1:\n\nInput: root = [1,2,3]\nOutput: 25\nExplanation:\nThe root-to-leaf path 1->2 represents the number 12.\nThe root-to-leaf path 1->3 represents the number 13.\nTherefore, sum = 12 + 13 = 25.\n\nExample 2:\n\nInput: root = [4,9,0,5,1]\nOutput: 1026\nExplanation:\nThe root-to-leaf path 4->9->5 represents the number 495.\nThe root-to-leaf path 4->9->1 represents the number 491.\nThe root-to-leaf path 4->0 represents the number 40.\nTherefore, sum = 495 + 491 + 40 = 1026.\n\n \n\nConstraints:\n\n\t• The number of nodes in the tree is in the range `[1, 1000]`.\n• `0",
      "descriptionHtml": "<p>You are given the <code>root</code> of a binary tree containing digits from <code>0</code> to <code>9</code> only.</p>\n\n<p>Each root-to-leaf path in the tree represents a number.</p>\n\n<ul>\n\t<li>For example, the root-to-leaf path <code>1 -&gt; 2 -&gt; 3</code> represents the number <code>123</code>.</li>\n</ul>\n\n<p>Return <em>the total sum of all root-to-leaf numbers</em>. Test cases are generated so that the answer will fit in a <strong>32-bit</strong> integer.</p>\n\n<p>A <strong>leaf</strong> node is a node with no children.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2021/02/19/num1tree.jpg\" style=\"width: 212px; height: 182px;\" />\n<pre>\n<strong>Input:</strong> root = [1,2,3]\n<strong>Output:</strong> 25\n<strong>Explanation:</strong>\nThe root-to-leaf path <code>1-&gt;2</code> represents the number <code>12</code>.\nThe root-to-leaf path <code>1-&gt;3</code> represents the number <code>13</code>.\nTherefore, sum = 12 + 13 = <code>25</code>.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2021/02/19/num2tree.jpg\" style=\"width: 292px; height: 302px;\" />\n<pre>\n<strong>Input:</strong> root = [4,9,0,5,1]\n<strong>Output:</strong> 1026\n<strong>Explanation:</strong>\nThe root-to-leaf path <code>4-&gt;9-&gt;5</code> represents the number 495.\nThe root-to-leaf path <code>4-&gt;9-&gt;1</code> represents the number 491.\nThe root-to-leaf path <code>4-&gt;0</code> represents the number 40.\nTherefore, sum = 495 + 491 + 40 = <code>1026</code>.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li>The number of nodes in the tree is in the range <code>[1, 1000]</code>.</li>\n\t<li><code>0 &lt;= Node.val &lt;= 9</code></li>\n\t<li>The depth of the tree will not exceed <code>10</code>.</li>\n</ul>\n",
      "lcSlug": "sum-root-to-leaf-numbers",
      "summary": "DFS path sum — state invariant, then loop."
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
      ],
      "description": "Given the `root` of a binary tree, return the lowest common ancestor of its deepest leaves.\n\nRecall that:\n\n\t• The node of a binary tree is a leaf if and only if it has no children\n• The depth of the root of the tree is `0`. if the depth of a node is `d`, the depth of each of its children is `d + 1`.\n• The lowest common ancestor of a set `S` of nodes, is the node `A` with the largest depth such that every node in `S` is in the subtree with root `A`.\n\n \n\nExample 1:\n\nInput: root = [3,5,1,6,2,0,8,null,null,7,4]\nOutput: [2,7,4]\nExplanation: We return the node with value 2, colored in yellow in the diagram.\nThe nodes coloured in blue are the deepest leaf-nodes of the tree.\nNote that nodes 6, 0, and 8 are also leaf nodes, but the depth of them is 2, but the depth of nodes 7 and 4 is 3.\n\nExample 2:\n\nInput: root = [1]\nOutput: [1]\nExplanation: The root is the deepest node in the tree, and it's the lca of itself.\n\nExample 3:\n\nInput: root = [0,1,3,null,2]\nOutput: [2]\nExplanation: The deepest leaf node in the tree is 2, the lca of one node is itself.\n\n \n\nConstraints:\n\n\t• The number of nodes in the tree will be in the range `[1, 1000]`.\n• `0 \n\n \n\nNote: This question is the same as 865: https://leetcode.com/problems/smallest-subtree-with-all-the-deepest-nodes/",
      "descriptionHtml": "<p>Given the <code>root</code> of a binary tree, return <em>the lowest common ancestor of its deepest leaves</em>.</p>\n\n<p>Recall that:</p>\n\n<ul>\n\t<li>The node of a binary tree is a leaf if and only if it has no children</li>\n\t<li>The depth of the root of the tree is <code>0</code>. if the depth of a node is <code>d</code>, the depth of each of its children is <code>d + 1</code>.</li>\n\t<li>The lowest common ancestor of a set <code>S</code> of nodes, is the node <code>A</code> with the largest depth such that every node in <code>S</code> is in the subtree with root <code>A</code>.</li>\n</ul>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://s3-lc-upload.s3.amazonaws.com/uploads/2018/07/01/sketch1.png\" style=\"width: 600px; height: 510px;\" />\n<pre>\n<strong>Input:</strong> root = [3,5,1,6,2,0,8,null,null,7,4]\n<strong>Output:</strong> [2,7,4]\n<strong>Explanation:</strong> We return the node with value 2, colored in yellow in the diagram.\nThe nodes coloured in blue are the deepest leaf-nodes of the tree.\nNote that nodes 6, 0, and 8 are also leaf nodes, but the depth of them is 2, but the depth of nodes 7 and 4 is 3.</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> root = [1]\n<strong>Output:</strong> [1]\n<strong>Explanation:</strong> The root is the deepest node in the tree, and it&#39;s the lca of itself.\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> root = [0,1,3,null,2]\n<strong>Output:</strong> [2]\n<strong>Explanation:</strong> The deepest leaf node in the tree is 2, the lca of one node is itself.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li>The number of nodes in the tree will be in the range <code>[1, 1000]</code>.</li>\n\t<li><code>0 &lt;= Node.val &lt;= 1000</code></li>\n\t<li>The values of the nodes in the tree are <strong>unique</strong>.</li>\n</ul>\n\n<p>&nbsp;</p>\n<p><strong>Note:</strong> This question is the same as 865: <a href=\"https://leetcode.com/problems/smallest-subtree-with-all-the-deepest-nodes/\" target=\"_blank\">https://leetcode.com/problems/smallest-subtree-with-all-the-deepest-nodes/</a></p>\n",
      "lcSlug": "lowest-common-ancestor-of-deepest-leaves",
      "summary": "Postorder depth LCA — state invariant, then loop."
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
      ],
      "description": "Given the `root` of a binary tree, the value of a target node `target`, and an integer `k`, return an array of the values of all nodes that have a distance `k` from the target node.\n\nYou can return the answer in any order.\n\n \n\nExample 1:\n\nInput: root = [3,5,1,6,2,0,8,null,null,7,4], target = 5, k = 2\nOutput: [7,4,1]\nExplanation: The nodes that are a distance 2 from the target node (with value 5) have values 7, 4, and 1.\n\nExample 2:\n\nInput: root = [1], target = 1, k = 3\nOutput: []\n\n \n\nConstraints:\n\n\t• The number of nodes in the tree is in the range `[1, 500]`.\n• `0",
      "descriptionHtml": "<p>Given the <code>root</code> of a binary tree, the value of a target node <code>target</code>, and an integer <code>k</code>, return <em>an array of the values of all nodes that have a distance </em><code>k</code><em> from the target node.</em></p>\n\n<p>You can return the answer in <strong>any order</strong>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://s3-lc-upload.s3.amazonaws.com/uploads/2018/06/28/sketch0.png\" style=\"width: 500px; height: 429px;\" />\n<pre>\n<strong>Input:</strong> root = [3,5,1,6,2,0,8,null,null,7,4], target = 5, k = 2\n<strong>Output:</strong> [7,4,1]\nExplanation: The nodes that are a distance 2 from the target node (with value 5) have values 7, 4, and 1.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> root = [1], target = 1, k = 3\n<strong>Output:</strong> []\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li>The number of nodes in the tree is in the range <code>[1, 500]</code>.</li>\n\t<li><code>0 &lt;= Node.val &lt;= 500</code></li>\n\t<li>All the values <code>Node.val</code> are <strong>unique</strong>.</li>\n\t<li><code>target</code> is the value of one of the nodes in the tree.</li>\n\t<li><code>0 &lt;= k &lt;= 1000</code></li>\n</ul>\n",
      "lcSlug": "all-nodes-distance-k-in-binary-tree",
      "summary": "Tree BFS — state invariant, then loop."
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
      ],
      "description": "The thief has found himself a new place for his thievery again. There is only one entrance to this area, called `root`.\n\nBesides the `root`, each house has one and only one parent house. After a tour, the smart thief realized that all houses in this place form a binary tree. It will automatically contact the police if two directly-linked houses were broken into on the same night.\n\nGiven the `root` of the binary tree, return the maximum amount of money the thief can rob without alerting the police.\n\n \n\nExample 1:\n\nInput: root = [3,2,3,null,3,null,1]\nOutput: 7\nExplanation: Maximum amount of money the thief can rob = 3 + 3 + 1 = 7.\n\nExample 2:\n\nInput: root = [3,4,5,1,3,null,1]\nOutput: 9\nExplanation: Maximum amount of money the thief can rob = 4 + 5 = 9.\n\n \n\nConstraints:\n\n\t• The number of nodes in the tree is in the range `[1, 104]`.\n• `0 4`",
      "descriptionHtml": "<p>The thief has found himself a new place for his thievery again. There is only one entrance to this area, called <code>root</code>.</p>\n\n<p>Besides the <code>root</code>, each house has one and only one parent house. After a tour, the smart thief realized that all houses in this place form a binary tree. It will automatically contact the police if <strong>two directly-linked houses were broken into on the same night</strong>.</p>\n\n<p>Given the <code>root</code> of the binary tree, return <em>the maximum amount of money the thief can rob <strong>without alerting the police</strong></em>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2021/03/10/rob1-tree.jpg\" style=\"width: 277px; height: 293px;\" />\n<pre>\n<strong>Input:</strong> root = [3,2,3,null,3,null,1]\n<strong>Output:</strong> 7\n<strong>Explanation:</strong> Maximum amount of money the thief can rob = 3 + 3 + 1 = 7.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2021/03/10/rob2-tree.jpg\" style=\"width: 357px; height: 293px;\" />\n<pre>\n<strong>Input:</strong> root = [3,4,5,1,3,null,1]\n<strong>Output:</strong> 9\n<strong>Explanation:</strong> Maximum amount of money the thief can rob = 4 + 5 = 9.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li>The number of nodes in the tree is in the range <code>[1, 10<sup>4</sup>]</code>.</li>\n\t<li><code>0 &lt;= Node.val &lt;= 10<sup>4</sup></code></li>\n</ul>\n",
      "lcSlug": "house-robber-iii",
      "summary": "Tree DP — state invariant, then loop."
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
      ],
      "description": "Given an integer `n`, return the number of structurally unique BST's (binary search trees) which has exactly `n` nodes of unique values from `1` to `n`.\n\n \n\nExample 1:\n\nInput: n = 3\nOutput: 5\n\nExample 2:\n\nInput: n = 1\nOutput: 1\n\n \n\nConstraints:\n\n\t• `1",
      "descriptionHtml": "<p>Given an integer <code>n</code>, return <em>the number of structurally unique <strong>BST&#39;</strong>s (binary search trees) which has exactly </em><code>n</code><em> nodes of unique values from</em> <code>1</code> <em>to</em> <code>n</code>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2021/01/18/uniquebstn3.jpg\" style=\"width: 600px; height: 148px;\" />\n<pre>\n<strong>Input:</strong> n = 3\n<strong>Output:</strong> 5\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> n = 1\n<strong>Output:</strong> 1\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= n &lt;= 19</code></li>\n</ul>\n",
      "lcSlug": "unique-binary-search-trees",
      "summary": "dp[n] += dp[i-1]*dp[n-i] for each root i — count BST structures."
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
      ],
      "description": "You are given the `root` of a binary search tree (BST), where the values of exactly two nodes of the tree were swapped by mistake. Recover the tree without changing its structure.\n\n \n\nExample 1:\n\nInput: root = [1,3,null,null,2]\nOutput: [3,1,null,null,2]\nExplanation: 3 cannot be a left child of 1 because 3 > 1. Swapping 1 and 3 makes the BST valid.\n\nExample 2:\n\nInput: root = [3,1,4,null,null,2]\nOutput: [2,1,4,null,null,3]\nExplanation: 2 cannot be in the right subtree of 3 because 2  \n\nConstraints:\n\n\t• The number of nodes in the tree is in the range `[2, 1000]`.\n• `-231 31 - 1`\n\n \nFollow up: A solution using `O(n)` space is pretty straight-forward. Could you devise a constant `O(1)` space solution?",
      "descriptionHtml": "<p>You are given the <code>root</code> of a binary search tree (BST), where the values of <strong>exactly</strong> two nodes of the tree were swapped by mistake. <em>Recover the tree without changing its structure</em>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2020/10/28/recover1.jpg\" style=\"width: 422px; height: 302px;\" />\n<pre>\n<strong>Input:</strong> root = [1,3,null,null,2]\n<strong>Output:</strong> [3,1,null,null,2]\n<strong>Explanation:</strong> 3 cannot be a left child of 1 because 3 &gt; 1. Swapping 1 and 3 makes the BST valid.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2020/10/28/recover2.jpg\" style=\"width: 581px; height: 302px;\" />\n<pre>\n<strong>Input:</strong> root = [3,1,4,null,null,2]\n<strong>Output:</strong> [2,1,4,null,null,3]\n<strong>Explanation:</strong> 2 cannot be in the right subtree of 3 because 2 &lt; 3. Swapping 2 and 3 makes the BST valid.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li>The number of nodes in the tree is in the range <code>[2, 1000]</code>.</li>\n\t<li><code>-2<sup>31</sup> &lt;= Node.val &lt;= 2<sup>31</sup> - 1</code></li>\n</ul>\n\n<p>&nbsp;</p>\n<strong>Follow up:</strong> A solution using <code>O(n)</code> space is pretty straight-forward. Could you devise a constant <code>O(1)</code> space solution?",
      "lcSlug": "recover-binary-search-tree",
      "summary": "Inorder swap — state invariant, then loop."
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
      ],
      "description": "Given the `root` of a binary tree, calculate the vertical order traversal of the binary tree.\n\nFor each node at position `(row, col)`, its left and right children will be at positions `(row + 1, col - 1)` and `(row + 1, col + 1)` respectively. The root of the tree is at `(0, 0)`.\n\nThe vertical order traversal of a binary tree is a list of top-to-bottom orderings for each column index starting from the leftmost column and ending on the rightmost column. There may be multiple nodes in the same row and same column. In such a case, sort these nodes by their values.\n\nReturn the vertical order traversal of the binary tree.\n\n \n\nExample 1:\n\nInput: root = [3,9,20,null,null,15,7]\nOutput: [[9],[3,15],[20],[7]]\nExplanation:\nColumn -1: Only node 9 is in this column.\nColumn 0: Nodes 3 and 15 are in this column in that order from top to bottom.\nColumn 1: Only node 20 is in this column.\nColumn 2: Only node 7 is in this column.\n\nExample 2:\n\nInput: root = [1,2,3,4,5,6,7]\nOutput: [[4],[2],[1,5,6],[3],[7]]\nExplanation:\nColumn -2: Only node 4 is in this column.\nColumn -1: Only node 2 is in this column.\nColumn 0: Nodes 1, 5, and 6 are in this column.\n          1 is at the top, so it comes first.\n          5 and 6 are at the same position (2, 0), so we order them by their value, 5 before 6.\nColumn 1: Only node 3 is in this column.\nColumn 2: Only node 7 is in this column.\n\nExample 3:\n\nInput: root = [1,2,3,4,6,5,7]\nOutput: [[4],[2],[1,5,6],[3],[7]]\nExplanation:\nThis case is the exact same as example 2, but with nodes 5 and 6 swapped.\nNote that the solution remains the same since 5 and 6 are in the same location and should be ordered by their values.\n\n \n\nConstraints:\n\n\t• The number of nodes in the tree is in the range `[1, 1000]`.\n• `0",
      "descriptionHtml": "<p>Given the <code>root</code> of a binary tree, calculate the <strong>vertical order traversal</strong> of the binary tree.</p>\n\n<p>For each node at position <code>(row, col)</code>, its left and right children will be at positions <code>(row + 1, col - 1)</code> and <code>(row + 1, col + 1)</code> respectively. The root of the tree is at <code>(0, 0)</code>.</p>\n\n<p>The <strong>vertical order traversal</strong> of a binary tree is a list of top-to-bottom orderings for each column index starting from the leftmost column and ending on the rightmost column. There may be multiple nodes in the same row and same column. In such a case, sort these nodes by their values.</p>\n\n<p>Return <em>the <strong>vertical order traversal</strong> of the binary tree</em>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2021/01/29/vtree1.jpg\" style=\"width: 431px; height: 304px;\" />\n<pre>\n<strong>Input:</strong> root = [3,9,20,null,null,15,7]\n<strong>Output:</strong> [[9],[3,15],[20],[7]]\n<strong>Explanation:</strong>\nColumn -1: Only node 9 is in this column.\nColumn 0: Nodes 3 and 15 are in this column in that order from top to bottom.\nColumn 1: Only node 20 is in this column.\nColumn 2: Only node 7 is in this column.</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2021/01/29/vtree2.jpg\" style=\"width: 512px; height: 304px;\" />\n<pre>\n<strong>Input:</strong> root = [1,2,3,4,5,6,7]\n<strong>Output:</strong> [[4],[2],[1,5,6],[3],[7]]\n<strong>Explanation:</strong>\nColumn -2: Only node 4 is in this column.\nColumn -1: Only node 2 is in this column.\nColumn 0: Nodes 1, 5, and 6 are in this column.\n          1 is at the top, so it comes first.\n          5 and 6 are at the same position (2, 0), so we order them by their value, 5 before 6.\nColumn 1: Only node 3 is in this column.\nColumn 2: Only node 7 is in this column.\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2021/01/29/vtree3.jpg\" style=\"width: 512px; height: 304px;\" />\n<pre>\n<strong>Input:</strong> root = [1,2,3,4,6,5,7]\n<strong>Output:</strong> [[4],[2],[1,5,6],[3],[7]]\n<strong>Explanation:</strong>\nThis case is the exact same as example 2, but with nodes 5 and 6 swapped.\nNote that the solution remains the same since 5 and 6 are in the same location and should be ordered by their values.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li>The number of nodes in the tree is in the range <code>[1, 1000]</code>.</li>\n\t<li><code>0 &lt;= Node.val &lt;= 1000</code></li>\n</ul>\n",
      "lcSlug": "vertical-order-traversal-of-a-binary-tree",
      "summary": "Tree BFS — state invariant, then loop."
    }
  ]
};
