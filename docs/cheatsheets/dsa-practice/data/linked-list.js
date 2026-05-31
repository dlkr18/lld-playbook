window.PRACTICE_TOPIC = {
  "id": "linked-list",
  "title": "Linked List",
  "expected_count": 24,
  "strategy": "<strong>Speed-run:</strong> Dummy head + fast/slow covers 80% of LL rounds. Filter <em>Must do</em> first.",
  "subtopics": [
    {
      "id": "reverse",
      "label": "Reverse"
    },
    {
      "id": "fast-slow",
      "label": "Fast/Slow"
    },
    {
      "id": "merge",
      "label": "Merge"
    },
    {
      "id": "design",
      "label": "Design"
    },
    {
      "id": "two-ptr",
      "label": "Two Ptr"
    }
  ],
  "questions": [
    {
      "id": "ll-01",
      "title": "Reverse Linked List",
      "lc": 206,
      "importance": "must",
      "subtopic": "reverse",
      "difficulty": "Easy",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "head",
          "out": "reversed"
        }
      ],
      "approaches": [
        {
          "name": "Iterative reverse",
          "time": "O(n)",
          "space": "O(1)",
          "code": "ListNode* reverseList(ListNode* head) {\n    ListNode* prev = nullptr;\n    while (head) { ListNode* nxt = head->next; head->next = prev; prev = head; head = nxt; }\n    return prev;\n}"
        }
      ],
      "description": "Given the `head` of a singly linked list, reverse the list, and return the reversed list.\n\n \n\nExample 1:\n\nInput: head = [1,2,3,4,5]\nOutput: [5,4,3,2,1]\n\nExample 2:\n\nInput: head = [1,2]\nOutput: [2,1]\n\nExample 3:\n\nInput: head = []\nOutput: []\n\n \n\nConstraints:\n\n\t• The number of nodes in the list is the range `[0, 5000]`.\n• `-5000 \n\n \n\nFollow up: A linked list can be reversed either iteratively or recursively. Could you implement both?",
      "descriptionHtml": "<p>Given the <code>head</code> of a singly linked list, reverse the list, and return <em>the reversed list</em>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2021/02/19/rev1ex1.jpg\" style=\"width: 542px; height: 222px;\" />\n<pre>\n<strong>Input:</strong> head = [1,2,3,4,5]\n<strong>Output:</strong> [5,4,3,2,1]\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2021/02/19/rev1ex2.jpg\" style=\"width: 182px; height: 222px;\" />\n<pre>\n<strong>Input:</strong> head = [1,2]\n<strong>Output:</strong> [2,1]\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> head = []\n<strong>Output:</strong> []\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li>The number of nodes in the list is the range <code>[0, 5000]</code>.</li>\n\t<li><code>-5000 &lt;= Node.val &lt;= 5000</code></li>\n</ul>\n\n<p>&nbsp;</p>\n<p><strong>Follow up:</strong> A linked list can be reversed either iteratively or recursively. Could you implement both?</p>\n",
      "lcSlug": "reverse-linked-list",
      "summary": "Iterative reverse — state invariant, then loop."
    },
    {
      "id": "ll-02",
      "title": "Linked List Cycle",
      "lc": 141,
      "importance": "must",
      "subtopic": "fast-slow",
      "difficulty": "Easy",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "head",
          "out": "has cycle?"
        }
      ],
      "approaches": [
        {
          "name": "Cycle detect",
          "time": "O(n)",
          "space": "O(1)",
          "code": "bool hasCycle(ListNode* head) {\n    ListNode *slow=head, *fast=head;\n    while (fast && fast->next) { slow=slow->next; fast=fast->next->next; if (slow==fast) return true; }\n    return false;\n}"
        }
      ],
      "description": "Given `head`, the head of a linked list, determine if the linked list has a cycle in it.\n\nThere is a cycle in a linked list if there is some node in the list that can be reached again by continuously following the `next` pointer. Internally, `pos` is used to denote the index of the node that tail's `next` pointer is connected to. Note that `pos` is not passed as a parameter.\n\nReturn `true` if there is a cycle in the linked list. Otherwise, return `false`.\n\n \n\nExample 1:\n\nInput: head = [3,2,0,-4], pos = 1\nOutput: true\nExplanation: There is a cycle in the linked list, where the tail connects to the 1st node (0-indexed).\n\nExample 2:\n\nInput: head = [1,2], pos = 0\nOutput: true\nExplanation: There is a cycle in the linked list, where the tail connects to the 0th node.\n\nExample 3:\n\nInput: head = [1], pos = -1\nOutput: false\nExplanation: There is no cycle in the linked list.\n\n \n\nConstraints:\n\n\t• The number of the nodes in the list is in the range `[0, 104]`.\n• `-105 5`\n• `pos` is `-1` or a valid index in the linked-list.\n\n \n\nFollow up: Can you solve it using `O(1)` (i.e. constant) memory?",
      "descriptionHtml": "<p>Given <code>head</code>, the head of a linked list, determine if the linked list has a cycle in it.</p>\n\n<p>There is a cycle in a linked list if there is some node in the list that can be reached again by continuously following the&nbsp;<code>next</code>&nbsp;pointer. Internally, <code>pos</code>&nbsp;is used to denote the index of the node that&nbsp;tail&#39;s&nbsp;<code>next</code>&nbsp;pointer is connected to.&nbsp;<strong>Note that&nbsp;<code>pos</code>&nbsp;is not passed as a parameter</strong>.</p>\n\n<p>Return&nbsp;<code>true</code><em> if there is a cycle in the linked list</em>. Otherwise, return <code>false</code>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2018/12/07/circularlinkedlist.png\" style=\"width: 300px; height: 97px; margin-top: 8px; margin-bottom: 8px;\" />\n<pre>\n<strong>Input:</strong> head = [3,2,0,-4], pos = 1\n<strong>Output:</strong> true\n<strong>Explanation:</strong> There is a cycle in the linked list, where the tail connects to the 1st node (0-indexed).\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2018/12/07/circularlinkedlist_test2.png\" style=\"width: 141px; height: 74px;\" />\n<pre>\n<strong>Input:</strong> head = [1,2], pos = 0\n<strong>Output:</strong> true\n<strong>Explanation:</strong> There is a cycle in the linked list, where the tail connects to the 0th node.\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2018/12/07/circularlinkedlist_test3.png\" style=\"width: 45px; height: 45px;\" />\n<pre>\n<strong>Input:</strong> head = [1], pos = -1\n<strong>Output:</strong> false\n<strong>Explanation:</strong> There is no cycle in the linked list.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li>The number of the nodes in the list is in the range <code>[0, 10<sup>4</sup>]</code>.</li>\n\t<li><code>-10<sup>5</sup> &lt;= Node.val &lt;= 10<sup>5</sup></code></li>\n\t<li><code>pos</code> is <code>-1</code> or a <strong>valid index</strong> in the linked-list.</li>\n</ul>\n\n<p>&nbsp;</p>\n<p><strong>Follow up:</strong> Can you solve it using <code>O(1)</code> (i.e. constant) memory?</p>\n",
      "lcSlug": "linked-list-cycle",
      "summary": "Cycle detect — state invariant, then loop."
    },
    {
      "id": "ll-03",
      "title": "Linked List Cycle II",
      "lc": 142,
      "importance": "must",
      "subtopic": "fast-slow",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "head",
          "out": "cycle start"
        }
      ],
      "approaches": [
        {
          "name": "Cycle start",
          "time": "O(n)",
          "space": "O(1)",
          "code": "ListNode* detectCycle(ListNode* head) {\n    ListNode *slow=head, *fast=head;\n    while (fast && fast->next) { slow=slow->next; fast=fast->next->next; if (slow==fast) break; }\n    if (!fast || !fast->next) return nullptr;\n    slow=head; while (slow!=fast) { slow=slow->next; fast=fast->next; } return slow;\n}"
        }
      ],
      "description": "Given the `head` of a linked list, return the node where the cycle begins. If there is no cycle, return `null`.\n\nThere is a cycle in a linked list if there is some node in the list that can be reached again by continuously following the `next` pointer. Internally, `pos` is used to denote the index of the node that tail's `next` pointer is connected to (0-indexed). It is `-1` if there is no cycle. Note that `pos` is not passed as a parameter.\n\nDo not modify the linked list.\n\n \n\nExample 1:\n\nInput: head = [3,2,0,-4], pos = 1\nOutput: tail connects to node index 1\nExplanation: There is a cycle in the linked list, where tail connects to the second node.\n\nExample 2:\n\nInput: head = [1,2], pos = 0\nOutput: tail connects to node index 0\nExplanation: There is a cycle in the linked list, where tail connects to the first node.\n\nExample 3:\n\nInput: head = [1], pos = -1\nOutput: no cycle\nExplanation: There is no cycle in the linked list.\n\n \n\nConstraints:\n\n\t• The number of the nodes in the list is in the range `[0, 104]`.\n• `-105 5`\n• `pos` is `-1` or a valid index in the linked-list.\n\n \n\nFollow up: Can you solve it using `O(1)` (i.e. constant) memory?",
      "descriptionHtml": "<p>Given the <code>head</code> of a linked list, return <em>the node where the cycle begins. If there is no cycle, return </em><code>null</code>.</p>\n\n<p>There is a cycle in a linked list if there is some node in the list that can be reached again by continuously following the <code>next</code> pointer. Internally, <code>pos</code> is used to denote the index of the node that tail&#39;s <code>next</code> pointer is connected to (<strong>0-indexed</strong>). It is <code>-1</code> if there is no cycle. <strong>Note that</strong> <code>pos</code> <strong>is not passed as a parameter</strong>.</p>\n\n<p><strong>Do not modify</strong> the linked list.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2018/12/07/circularlinkedlist.png\" style=\"height: 145px; width: 450px;\" />\n<pre>\n<strong>Input:</strong> head = [3,2,0,-4], pos = 1\n<strong>Output:</strong> tail connects to node index 1\n<strong>Explanation:</strong> There is a cycle in the linked list, where tail connects to the second node.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2018/12/07/circularlinkedlist_test2.png\" style=\"height: 105px; width: 201px;\" />\n<pre>\n<strong>Input:</strong> head = [1,2], pos = 0\n<strong>Output:</strong> tail connects to node index 0\n<strong>Explanation:</strong> There is a cycle in the linked list, where tail connects to the first node.\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2018/12/07/circularlinkedlist_test3.png\" style=\"height: 65px; width: 65px;\" />\n<pre>\n<strong>Input:</strong> head = [1], pos = -1\n<strong>Output:</strong> no cycle\n<strong>Explanation:</strong> There is no cycle in the linked list.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li>The number of the nodes in the list is in the range <code>[0, 10<sup>4</sup>]</code>.</li>\n\t<li><code>-10<sup>5</sup> &lt;= Node.val &lt;= 10<sup>5</sup></code></li>\n\t<li><code>pos</code> is <code>-1</code> or a <strong>valid index</strong> in the linked-list.</li>\n</ul>\n\n<p>&nbsp;</p>\n<p><strong>Follow up:</strong> Can you solve it using <code>O(1)</code> (i.e. constant) memory?</p>\n",
      "lcSlug": "linked-list-cycle-ii",
      "summary": "Cycle start — state invariant, then loop."
    },
    {
      "id": "ll-04",
      "title": "Merge Two Sorted Lists",
      "lc": 21,
      "importance": "must",
      "subtopic": "merge",
      "difficulty": "Easy",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "l1,l2",
          "out": "merged"
        }
      ],
      "approaches": [
        {
          "name": "Merge lists",
          "time": "O(n+m)",
          "space": "O(1)",
          "code": "ListNode* mergeTwoLists(ListNode* a, ListNode* b) {\n    ListNode dummy, *tail=&dummy;\n    while (a && b) { if (a->val <= b->val) { tail->next=a; a=a->next; } else { tail->next=b; b=b->next; } tail=tail->next; }\n    tail->next = a? a: b; return dummy.next;\n}"
        }
      ],
      "description": "You are given the heads of two sorted linked lists `list1` and `list2`.\n\nMerge the two lists into one sorted list. The list should be made by splicing together the nodes of the first two lists.\n\nReturn the head of the merged linked list.\n\n \n\nExample 1:\n\nInput: list1 = [1,2,4], list2 = [1,3,4]\nOutput: [1,1,2,3,4,4]\n\nExample 2:\n\nInput: list1 = [], list2 = []\nOutput: []\n\nExample 3:\n\nInput: list1 = [], list2 = [0]\nOutput: [0]\n\n \n\nConstraints:\n\n\t• The number of nodes in both lists is in the range `[0, 50]`.\n• `-100",
      "descriptionHtml": "<p>You are given the heads of two sorted linked lists <code>list1</code> and <code>list2</code>.</p>\n\n<p>Merge the two lists into one <strong>sorted</strong> list. The list should be made by splicing together the nodes of the first two lists.</p>\n\n<p>Return <em>the head of the merged linked list</em>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2020/10/03/merge_ex1.jpg\" style=\"width: 662px; height: 302px;\" />\n<pre>\n<strong>Input:</strong> list1 = [1,2,4], list2 = [1,3,4]\n<strong>Output:</strong> [1,1,2,3,4,4]\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> list1 = [], list2 = []\n<strong>Output:</strong> []\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> list1 = [], list2 = [0]\n<strong>Output:</strong> [0]\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li>The number of nodes in both lists is in the range <code>[0, 50]</code>.</li>\n\t<li><code>-100 &lt;= Node.val &lt;= 100</code></li>\n\t<li>Both <code>list1</code> and <code>list2</code> are sorted in <strong>non-decreasing</strong> order.</li>\n</ul>\n",
      "lcSlug": "merge-two-sorted-lists",
      "summary": "Dummy tail; attach smaller head; advance — O(n+m)."
    },
    {
      "id": "ll-05",
      "title": "Remove Nth Node From End",
      "lc": 19,
      "importance": "must",
      "subtopic": "two-ptr",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "head,n",
          "out": "head"
        }
      ],
      "approaches": [
        {
          "name": "Remove nth",
          "time": "O(n)",
          "space": "O(1)",
          "code": "ListNode* removeNthFromEnd(ListNode* head, int n) {\n    ListNode dummy(0, head), *fast=&dummy, *slow=&dummy;\n    for (int i=0;i<=n;i++) fast=fast->next;\n    while (fast) { fast=fast->next; slow=slow->next; }\n    slow->next = slow->next->next; return dummy.next;\n}"
        }
      ],
      "description": "Given the `head` of a linked list, remove the `nth` node from the end of the list and return its head.\n\n \n\nExample 1:\n\nInput: head = [1,2,3,4,5], n = 2\nOutput: [1,2,3,5]\n\nExample 2:\n\nInput: head = [1], n = 1\nOutput: []\n\nExample 3:\n\nInput: head = [1,2], n = 1\nOutput: [1]\n\n \n\nConstraints:\n\n\t• The number of nodes in the list is `sz`.\n• `1 \n\n \n\nFollow up: Could you do this in one pass?",
      "descriptionHtml": "<p>Given the <code>head</code> of a linked list, remove the <code>n<sup>th</sup></code> node from the end of the list and return its head.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2020/10/03/remove_ex1.jpg\" style=\"width: 542px; height: 222px;\" />\n<pre>\n<strong>Input:</strong> head = [1,2,3,4,5], n = 2\n<strong>Output:</strong> [1,2,3,5]\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> head = [1], n = 1\n<strong>Output:</strong> []\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> head = [1,2], n = 1\n<strong>Output:</strong> [1]\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li>The number of nodes in the list is <code>sz</code>.</li>\n\t<li><code>1 &lt;= sz &lt;= 30</code></li>\n\t<li><code>0 &lt;= Node.val &lt;= 100</code></li>\n\t<li><code>1 &lt;= n &lt;= sz</code></li>\n</ul>\n\n<p>&nbsp;</p>\n<p><strong>Follow up:</strong> Could you do this in one pass?</p>\n",
      "lcSlug": "remove-nth-node-from-end-of-list",
      "summary": "Remove nth — state invariant, then loop."
    },
    {
      "id": "ll-06",
      "title": "Reorder List",
      "lc": 143,
      "importance": "should",
      "subtopic": "reverse",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "head",
          "out": "reordered"
        }
      ],
      "approaches": [
        {
          "name": "Reorder list",
          "time": "O(n)",
          "space": "O(1)",
          "code": "ListNode* reorderList(ListNode* head) {\n    if (!head) return head;\n    ListNode *slow=head, *fast=head;\n    while (fast->next && fast->next->next) { slow=slow->next; fast=fast->next->next; }\n    ListNode* second = slow->next; slow->next=nullptr;\n    ListNode *prev=nullptr, *cur=second;\n    while (cur) { ListNode* nxt=cur->next; cur->next=prev; prev=cur; cur=nxt; }\n    second=prev; ListNode* first=head;\n    while (second) { ListNode *n1=first->next, *n2=second->next; first->next=second; second->next=n1; first=n1; second=n2; }\n    return head;\n}"
        }
      ],
      "description": "You are given the head of a singly linked-list. The list can be represented as:\n\nL0 &rarr; L1 &rarr; &hellip; &rarr; Ln - 1 &rarr; Ln\n\nReorder the list to be on the following form:\n\nL0 &rarr; Ln &rarr; L1 &rarr; Ln - 1 &rarr; L2 &rarr; Ln - 2 &rarr; &hellip;\n\nYou may not modify the values in the list's nodes. Only nodes themselves may be changed.\n\n \n\nExample 1:\n\nInput: head = [1,2,3,4]\nOutput: [1,4,2,3]\n\nExample 2:\n\nInput: head = [1,2,3,4,5]\nOutput: [1,5,2,4,3]\n\n \n\nConstraints:\n\n\t• The number of nodes in the list is in the range `[1, 5 * 104]`.\n• `1",
      "descriptionHtml": "<p>You are given the head of a singly linked-list. The list can be represented as:</p>\n\n<pre>\nL<sub>0</sub> &rarr; L<sub>1</sub> &rarr; &hellip; &rarr; L<sub>n - 1</sub> &rarr; L<sub>n</sub>\n</pre>\n\n<p><em>Reorder the list to be on the following form:</em></p>\n\n<pre>\nL<sub>0</sub> &rarr; L<sub>n</sub> &rarr; L<sub>1</sub> &rarr; L<sub>n - 1</sub> &rarr; L<sub>2</sub> &rarr; L<sub>n - 2</sub> &rarr; &hellip;\n</pre>\n\n<p>You may not modify the values in the list&#39;s nodes. Only nodes themselves may be changed.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2021/03/04/reorder1linked-list.jpg\" style=\"width: 422px; height: 222px;\" />\n<pre>\n<strong>Input:</strong> head = [1,2,3,4]\n<strong>Output:</strong> [1,4,2,3]\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2021/03/09/reorder2-linked-list.jpg\" style=\"width: 542px; height: 222px;\" />\n<pre>\n<strong>Input:</strong> head = [1,2,3,4,5]\n<strong>Output:</strong> [1,5,2,4,3]\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li>The number of nodes in the list is in the range <code>[1, 5 * 10<sup>4</sup>]</code>.</li>\n\t<li><code>1 &lt;= Node.val &lt;= 1000</code></li>\n</ul>\n",
      "lcSlug": "reorder-list",
      "summary": "Reorder list — state invariant, then loop."
    },
    {
      "id": "ll-07",
      "title": "Copy List with Random Pointer",
      "lc": 138,
      "importance": "must",
      "subtopic": "hashmap",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "head",
          "out": "deep copy"
        }
      ],
      "approaches": [
        {
          "name": "Copy random list",
          "time": "O(n)",
          "space": "O(n)",
          "code": "Node* copyRandomList(Node* head) {\n    if (!head) return nullptr;\n    unordered_map<Node*,Node*> mp;\n    for (Node* cur=head; cur; cur=cur->next) mp[cur]=new Node(cur->val);\n    for (Node* cur=head; cur; cur=cur->next) { mp[cur]->next=mp[cur->next]; mp[cur]->random=mp[cur->random]; }\n    return mp[head];\n}"
        }
      ],
      "description": "A linked list of length `n` is given such that each node contains an additional random pointer, which could point to any node in the list, or `null`.\n\nConstruct a deep copy of the list. The deep copy should consist of exactly `n` brand new nodes, where each new node has its value set to the value of its corresponding original node. Both the `next` and `random` pointer of the new nodes should point to new nodes in the copied list such that the pointers in the original list and copied list represent the same list state. None of the pointers in the new list should point to nodes in the original list.\n\nFor example, if there are two nodes `X` and `Y` in the original list, where `X.random --> Y`, then for the corresponding two nodes `x` and `y` in the copied list, `x.random --> y`.\n\nReturn the head of the copied linked list.\n\nThe linked list is represented in the input/output as a list of `n` nodes. Each node is represented as a pair of `[val, random_index]` where:\n\n\t• `val`: an integer representing `Node.val`\n• `random_index`: the index of the node (range from `0` to `n-1`) that the `random` pointer points to, or `null` if it does not point to any node.\n\nYour code will only be given the `head` of the original linked list.\n\n \n\nExample 1:\n\nInput: head = [[7,null],[13,0],[11,4],[10,2],[1,0]]\nOutput: [[7,null],[13,0],[11,4],[10,2],[1,0]]\n\nExample 2:\n\nInput: head = [[1,1],[2,1]]\nOutput: [[1,1],[2,1]]\n\nExample 3:\n\nInput: head = [[3,null],[3,0],[3,null]]\nOutput: [[3,null],[3,0],[3,null]]\n\n \n\nConstraints:\n\n\t• `0 4 4`\n• `Node.random` is `null` or is pointing to some node in the linked list.",
      "descriptionHtml": "<p>A linked list of length <code>n</code> is given such that each node contains an additional random pointer, which could point to any node in the list, or <code>null</code>.</p>\n\n<p>Construct a <a href=\"https://en.wikipedia.org/wiki/Object_copying#Deep_copy\" target=\"_blank\"><strong>deep copy</strong></a> of the list. The deep copy should consist of exactly <code>n</code> <strong>brand new</strong> nodes, where each new node has its value set to the value of its corresponding original node. Both the <code>next</code> and <code>random</code> pointer of the new nodes should point to new nodes in the copied list such that the pointers in the original list and copied list represent the same list state. <strong>None of the pointers in the new list should point to nodes in the original list</strong>.</p>\n\n<p>For example, if there are two nodes <code>X</code> and <code>Y</code> in the original list, where <code>X.random --&gt; Y</code>, then for the corresponding two nodes <code>x</code> and <code>y</code> in the copied list, <code>x.random --&gt; y</code>.</p>\n\n<p>Return <em>the head of the copied linked list</em>.</p>\n\n<p>The linked list is represented in the input/output as a list of <code>n</code> nodes. Each node is represented as a pair of <code>[val, random_index]</code> where:</p>\n\n<ul>\n\t<li><code>val</code>: an integer representing <code>Node.val</code></li>\n\t<li><code>random_index</code>: the index of the node (range from <code>0</code> to <code>n-1</code>) that the <code>random</code> pointer points to, or <code>null</code> if it does not point to any node.</li>\n</ul>\n\n<p>Your code will <strong>only</strong> be given the <code>head</code> of the original linked list.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2019/12/18/e1.png\" style=\"width: 700px; height: 142px;\" />\n<pre>\n<strong>Input:</strong> head = [[7,null],[13,0],[11,4],[10,2],[1,0]]\n<strong>Output:</strong> [[7,null],[13,0],[11,4],[10,2],[1,0]]\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2019/12/18/e2.png\" style=\"width: 700px; height: 114px;\" />\n<pre>\n<strong>Input:</strong> head = [[1,1],[2,1]]\n<strong>Output:</strong> [[1,1],[2,1]]\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<p><strong><img alt=\"\" src=\"https://assets.leetcode.com/uploads/2019/12/18/e3.png\" style=\"width: 700px; height: 122px;\" /></strong></p>\n\n<pre>\n<strong>Input:</strong> head = [[3,null],[3,0],[3,null]]\n<strong>Output:</strong> [[3,null],[3,0],[3,null]]\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>0 &lt;= n &lt;= 1000</code></li>\n\t<li><code>-10<sup>4</sup> &lt;= Node.val &lt;= 10<sup>4</sup></code></li>\n\t<li><code>Node.random</code> is <code>null</code> or is pointing to some node in the linked list.</li>\n</ul>\n",
      "lcSlug": "copy-list-with-random-pointer",
      "summary": "Copy random list — Hash map for O(1) lookup while scanning — complements, counts, or indices."
    },
    {
      "id": "ll-08",
      "title": "LRU Cache",
      "lc": 146,
      "importance": "must",
      "subtopic": "design",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "capacity",
          "out": "get/put"
        }
      ],
      "approaches": [
        {
          "name": "HashMap + DLL",
          "time": "O(1)",
          "space": "O(capacity)",
          "code": "class LRUCache {\n    int cap; list<pair<int,int>> order; unordered_map<int, list<pair<int,int>>::iterator> mp;\npublic:\n    LRUCache(int capacity) : cap(capacity) {}\n    int get(int key) {\n        if (!mp.count(key)) return -1;\n        order.splice(order.begin(), order, mp[key]);\n        return mp[key]->second;\n    }\n    void put(int key, int value) {\n        if (mp.count(key)) { mp[key]->second = value; order.splice(order.begin(), order, mp[key]); return; }\n        if ((int)order.size() == cap) { mp.erase(order.back().first); order.pop_back(); }\n        order.push_front({key, value}); mp[key] = order.begin();\n    }\n};"
        }
      ],
      "description": "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.\n\nImplement the `LRUCache` class:\n\n\t• `LRUCache(int capacity)` Initialize the LRU cache with positive size `capacity`.\n• `int get(int key)` Return the value of the `key` if the key exists, otherwise return `-1`.\n• `void put(int key, int value)` Update the value of the `key` if the `key` exists. Otherwise, add the `key-value` pair to the cache. If the number of keys exceeds the `capacity` from this operation, evict the least recently used key.\n\nThe functions `get` and `put` must each run in `O(1)` average time complexity.\n\n \n\nExample 1:\n\nInput\n[\"LRUCache\", \"put\", \"put\", \"get\", \"put\", \"get\", \"put\", \"get\", \"get\", \"get\"]\n[[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]\nOutput\n[null, null, null, 1, null, -1, null, -1, 3, 4]\n\nExplanation\nLRUCache lRUCache = new LRUCache(2);\nlRUCache.put(1, 1); // cache is {1=1}\nlRUCache.put(2, 2); // cache is {1=1, 2=2}\nlRUCache.get(1);    // return 1\nlRUCache.put(3, 3); // LRU key was 2, evicts key 2, cache is {1=1, 3=3}\nlRUCache.get(2);    // returns -1 (not found)\nlRUCache.put(4, 4); // LRU key was 1, evicts key 1, cache is {4=4, 3=3}\nlRUCache.get(1);    // return -1 (not found)\nlRUCache.get(3);    // return 3\nlRUCache.get(4);    // return 4\n\n \n\nConstraints:\n\n\t• `1 4`\n• `0 5`\n• At most `2 * 105` calls will be made to `get` and `put`.",
      "descriptionHtml": "<p>Design a data structure that follows the constraints of a <strong><a href=\"https://en.wikipedia.org/wiki/Cache_replacement_policies#LRU\" target=\"_blank\">Least Recently Used (LRU) cache</a></strong>.</p>\n\n<p>Implement the <code>LRUCache</code> class:</p>\n\n<ul>\n\t<li><code>LRUCache(int capacity)</code> Initialize the LRU cache with <strong>positive</strong> size <code>capacity</code>.</li>\n\t<li><code>int get(int key)</code> Return the value of the <code>key</code> if the key exists, otherwise return <code>-1</code>.</li>\n\t<li><code>void put(int key, int value)</code> Update the value of the <code>key</code> if the <code>key</code> exists. Otherwise, add the <code>key-value</code> pair to the cache. If the number of keys exceeds the <code>capacity</code> from this operation, <strong>evict</strong> the least recently used key.</li>\n</ul>\n\n<p>The functions <code>get</code> and <code>put</code> must each run in <code>O(1)</code> average time complexity.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input</strong>\n[&quot;LRUCache&quot;, &quot;put&quot;, &quot;put&quot;, &quot;get&quot;, &quot;put&quot;, &quot;get&quot;, &quot;put&quot;, &quot;get&quot;, &quot;get&quot;, &quot;get&quot;]\n[[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]\n<strong>Output</strong>\n[null, null, null, 1, null, -1, null, -1, 3, 4]\n\n<strong>Explanation</strong>\nLRUCache lRUCache = new LRUCache(2);\nlRUCache.put(1, 1); // cache is {1=1}\nlRUCache.put(2, 2); // cache is {1=1, 2=2}\nlRUCache.get(1);    // return 1\nlRUCache.put(3, 3); // LRU key was 2, evicts key 2, cache is {1=1, 3=3}\nlRUCache.get(2);    // returns -1 (not found)\nlRUCache.put(4, 4); // LRU key was 1, evicts key 1, cache is {4=4, 3=3}\nlRUCache.get(1);    // return -1 (not found)\nlRUCache.get(3);    // return 3\nlRUCache.get(4);    // return 4\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= capacity &lt;= 3000</code></li>\n\t<li><code>0 &lt;= key &lt;= 10<sup>4</sup></code></li>\n\t<li><code>0 &lt;= value &lt;= 10<sup>5</sup></code></li>\n\t<li>At most <code>2 * 10<sup>5</sup></code> calls will be made to <code>get</code> and <code>put</code>.</li>\n</ul>\n",
      "lcSlug": "lru-cache",
      "summary": "Map key→list iterator; splice to front on get/put; evict back."
    },
    {
      "id": "ll-09",
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
      "description": "You are given an array of `k` linked-lists `lists`, each linked-list is sorted in ascending order.\n\nMerge all the linked-lists into one sorted linked-list and return it.\n\n \n\nExample 1:\n\nInput: lists = [[1,4,5],[1,3,4],[2,6]]\nOutput: [1,1,2,3,4,4,5,6]\nExplanation: The linked-lists are:\n[\n  1->4->5,\n  1->3->4,\n  2->6\n]\nmerging them into one sorted linked list:\n1->1->2->3->4->4->5->6\n\nExample 2:\n\nInput: lists = []\nOutput: []\n\nExample 3:\n\nInput: lists = [[]]\nOutput: []\n\n \n\nConstraints:\n\n\t• `k == lists.length`\n• `0 4`\n• `0 4 4`\n• `lists[i]` is sorted in ascending order.\n• The sum of `lists[i].length` will not exceed `104`.",
      "descriptionHtml": "<p>You are given an array of <code>k</code> linked-lists <code>lists</code>, each linked-list is sorted in ascending order.</p>\n\n<p><em>Merge all the linked-lists into one sorted linked-list and return it.</em></p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input:</strong> lists = [[1,4,5],[1,3,4],[2,6]]\n<strong>Output:</strong> [1,1,2,3,4,4,5,6]\n<strong>Explanation:</strong> The linked-lists are:\n[\n  1-&gt;4-&gt;5,\n  1-&gt;3-&gt;4,\n  2-&gt;6\n]\nmerging them into one sorted linked list:\n1-&gt;1-&gt;2-&gt;3-&gt;4-&gt;4-&gt;5-&gt;6\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> lists = []\n<strong>Output:</strong> []\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> lists = [[]]\n<strong>Output:</strong> []\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>k == lists.length</code></li>\n\t<li><code>0 &lt;= k &lt;= 10<sup>4</sup></code></li>\n\t<li><code>0 &lt;= lists[i].length &lt;= 500</code></li>\n\t<li><code>-10<sup>4</sup> &lt;= lists[i][j] &lt;= 10<sup>4</sup></code></li>\n\t<li><code>lists[i]</code> is sorted in <strong>ascending order</strong>.</li>\n\t<li>The sum of <code>lists[i].length</code> will not exceed <code>10<sup>4</sup></code>.</li>\n</ul>\n",
      "lcSlug": "merge-k-sorted-lists",
      "summary": "Merge k lists — state invariant, then loop."
    },
    {
      "id": "ll-10",
      "title": "Add Two Numbers",
      "lc": 2,
      "importance": "must",
      "subtopic": "math",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "l1,l2",
          "out": "sum list"
        }
      ],
      "approaches": [
        {
          "name": "Add two numbers",
          "time": "O(n)",
          "space": "O(1)",
          "code": "ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {\n    ListNode dummy(0), *tail=&dummy; int carry=0;\n    while (l1||l2||carry) {\n        int s=carry; if(l1){s+=l1->val; l1=l1->next;} if(l2){s+=l2->val; l2=l2->next;}\n        tail->next=new ListNode(s%10); tail=tail->next; carry=s/10;\n    } return dummy.next;\n}"
        }
      ],
      "description": "You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.\n\nYou may assume the two numbers do not contain any leading zero, except the number 0 itself.\n\n \n\nExample 1:\n\nInput: l1 = [2,4,3], l2 = [5,6,4]\nOutput: [7,0,8]\nExplanation: 342 + 465 = 807.\n\nExample 2:\n\nInput: l1 = [0], l2 = [0]\nOutput: [0]\n\nExample 3:\n\nInput: l1 = [9,9,9,9,9,9,9], l2 = [9,9,9,9]\nOutput: [8,9,9,9,0,0,0,1]\n\n \n\nConstraints:\n\n\t• The number of nodes in each linked list is in the range `[1, 100]`.\n• `0",
      "descriptionHtml": "<p>You are given two <strong>non-empty</strong> linked lists representing two non-negative integers. The digits are stored in <strong>reverse order</strong>, and each of their nodes contains a single digit. Add the two numbers and return the sum&nbsp;as a linked list.</p>\n\n<p>You may assume the two numbers do not contain any leading zero, except the number 0 itself.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2020/10/02/addtwonumber1.jpg\" style=\"width: 483px; height: 342px;\" />\n<pre>\n<strong>Input:</strong> l1 = [2,4,3], l2 = [5,6,4]\n<strong>Output:</strong> [7,0,8]\n<strong>Explanation:</strong> 342 + 465 = 807.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> l1 = [0], l2 = [0]\n<strong>Output:</strong> [0]\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> l1 = [9,9,9,9,9,9,9], l2 = [9,9,9,9]\n<strong>Output:</strong> [8,9,9,9,0,0,0,1]\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li>The number of nodes in each linked list is in the range <code>[1, 100]</code>.</li>\n\t<li><code>0 &lt;= Node.val &lt;= 9</code></li>\n\t<li>It is guaranteed that the list represents a number that does not have leading zeros.</li>\n</ul>\n",
      "lcSlug": "add-two-numbers",
      "summary": "Add two numbers — Number theory, combinatorics, or arithmetic simulation."
    },
    {
      "id": "ll-11",
      "title": "Remove Duplicates from Sorted List",
      "lc": 83,
      "importance": "should",
      "subtopic": "scan",
      "difficulty": "Easy",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "head",
          "out": "deduped"
        }
      ],
      "approaches": [
        {
          "name": "Skip dup",
          "time": "O(n)",
          "space": "O(1)",
          "code": "ListNode* deleteDuplicates(ListNode* head) {\n    ListNode* cur = head;\n    while (cur && cur->next) {\n        if (cur->val == cur->next->val) cur->next = cur->next->next;\n        else cur = cur->next;\n    }\n    return head;\n}"
        }
      ],
      "description": "Given the `head` of a sorted linked list, delete all duplicates such that each element appears only once. Return the linked list sorted as well.\n\n \n\nExample 1:\n\nInput: head = [1,1,2]\nOutput: [1,2]\n\nExample 2:\n\nInput: head = [1,1,2,3,3]\nOutput: [1,2,3]\n\n \n\nConstraints:\n\n\t• The number of nodes in the list is in the range `[0, 300]`.\n• `-100",
      "descriptionHtml": "<p>Given the <code>head</code> of a sorted linked list, <em>delete all duplicates such that each element appears only once</em>. Return <em>the linked list <strong>sorted</strong> as well</em>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2021/01/04/list1.jpg\" style=\"width: 302px; height: 242px;\" />\n<pre>\n<strong>Input:</strong> head = [1,1,2]\n<strong>Output:</strong> [1,2]\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2021/01/04/list2.jpg\" style=\"width: 542px; height: 222px;\" />\n<pre>\n<strong>Input:</strong> head = [1,1,2,3,3]\n<strong>Output:</strong> [1,2,3]\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li>The number of nodes in the list is in the range <code>[0, 300]</code>.</li>\n\t<li><code>-100 &lt;= Node.val &lt;= 100</code></li>\n\t<li>The list is guaranteed to be <strong>sorted</strong> in ascending order.</li>\n</ul>\n",
      "lcSlug": "remove-duplicates-from-sorted-list",
      "summary": "Skip dup — state invariant, then loop."
    },
    {
      "id": "ll-12",
      "title": "Remove Duplicates from Sorted List II",
      "lc": 82,
      "importance": "should",
      "subtopic": "scan",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "head",
          "out": "deduped all dups"
        }
      ],
      "approaches": [
        {
          "name": "Skip dup runs",
          "time": "O(n)",
          "space": "O(1)",
          "code": "ListNode* deleteDuplicates(ListNode* head) {\n    ListNode dummy(0, head), *prev = &dummy;\n    while (head) {\n        if (head->next && head->val == head->next->val) {\n            int v = head->val;\n            while (head && head->val == v) head = head->next;\n            prev->next = head;\n        } else { prev = head; head = head->next; }\n    }\n    return dummy.next;\n}"
        }
      ],
      "description": "Given the `head` of a sorted linked list, delete all nodes that have duplicate numbers, leaving only distinct numbers from the original list. Return the linked list sorted as well.\n\n \n\nExample 1:\n\nInput: head = [1,2,3,3,4,4,5]\nOutput: [1,2,5]\n\nExample 2:\n\nInput: head = [1,1,1,2,3]\nOutput: [2,3]\n\n \n\nConstraints:\n\n\t• The number of nodes in the list is in the range `[0, 300]`.\n• `-100",
      "descriptionHtml": "<p>Given the <code>head</code> of a sorted linked list, <em>delete all nodes that have duplicate numbers, leaving only distinct numbers from the original list</em>. Return <em>the linked list <strong>sorted</strong> as well</em>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2021/01/04/linkedlist1.jpg\" style=\"width: 500px; height: 142px;\" />\n<pre>\n<strong>Input:</strong> head = [1,2,3,3,4,4,5]\n<strong>Output:</strong> [1,2,5]\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2021/01/04/linkedlist2.jpg\" style=\"width: 500px; height: 205px;\" />\n<pre>\n<strong>Input:</strong> head = [1,1,1,2,3]\n<strong>Output:</strong> [2,3]\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li>The number of nodes in the list is in the range <code>[0, 300]</code>.</li>\n\t<li><code>-100 &lt;= Node.val &lt;= 100</code></li>\n\t<li>The list is guaranteed to be <strong>sorted</strong> in ascending order.</li>\n</ul>\n",
      "lcSlug": "remove-duplicates-from-sorted-list-ii",
      "summary": "If head duplicates, skip whole run; else advance prev."
    },
    {
      "id": "ll-13",
      "title": "Palindrome Linked List",
      "lc": 234,
      "importance": "should",
      "subtopic": "reverse",
      "difficulty": "Easy",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "head",
          "out": "palindrome?"
        }
      ],
      "approaches": [
        {
          "name": "Reverse list",
          "time": "O(n)",
          "space": "O(1)",
          "code": "ListNode* prev=nullptr;\nwhile (head) { auto nxt=head->next; head->next=prev; prev=head; head=nxt; }"
        }
      ],
      "description": "Given the `head` of a singly linked list, return `true` if it is a palindrome or `false` otherwise.\n\n \n\nExample 1:\n\nInput: head = [1,2,2,1]\nOutput: true\n\nExample 2:\n\nInput: head = [1,2]\nOutput: false\n\n \n\nConstraints:\n\n\t• The number of nodes in the list is in the range `[1, 105]`.\n• `0 \n\n \nFollow up: Could you do it in `O(n)` time and `O(1)` space?",
      "descriptionHtml": "<p>Given the <code>head</code> of a singly linked list, return <code>true</code><em> if it is a </em><span data-keyword=\"palindrome-sequence\"><em>palindrome</em></span><em> or </em><code>false</code><em> otherwise</em>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2021/03/03/pal1linked-list.jpg\" style=\"width: 422px; height: 62px;\" />\n<pre>\n<strong>Input:</strong> head = [1,2,2,1]\n<strong>Output:</strong> true\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2021/03/03/pal2linked-list.jpg\" style=\"width: 182px; height: 62px;\" />\n<pre>\n<strong>Input:</strong> head = [1,2]\n<strong>Output:</strong> false\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li>The number of nodes in the list is in the range <code>[1, 10<sup>5</sup>]</code>.</li>\n\t<li><code>0 &lt;= Node.val &lt;= 9</code></li>\n</ul>\n\n<p>&nbsp;</p>\n<strong>Follow up:</strong> Could you do it in <code>O(n)</code> time and <code>O(1)</code> space?",
      "lcSlug": "palindrome-linked-list",
      "summary": "Reverse list — state invariant, then loop."
    },
    {
      "id": "ll-14",
      "title": "Intersection of Two Linked Lists",
      "lc": 160,
      "importance": "must",
      "subtopic": "two-ptr",
      "difficulty": "Easy",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "a,b",
          "out": "intersection"
        }
      ],
      "approaches": [
        {
          "name": "Intersection",
          "time": "O(m+n)",
          "space": "O(1)",
          "code": "ListNode* getIntersectionNode(ListNode* a, ListNode* b) {\n    ListNode *p=a, *q=b;\n    while (p!=q) { p=p? p->next: b; q=q? q->next: a; }\n    return p;\n}"
        }
      ],
      "description": "Given the heads of two singly linked-lists `headA` and `headB`, return the node at which the two lists intersect. If the two linked lists have no intersection at all, return `null`.\n\nFor example, the following two linked lists begin to intersect at node `c1`:\n\nThe test cases are generated such that there are no cycles anywhere in the entire linked structure.\n\nNote that the linked lists must retain their original structure after the function returns.\n\nCustom Judge:\n\nThe inputs to the judge are given as follows (your program is not given these inputs):\n\n\t• `intersectVal` - The value of the node where the intersection occurs. This is `0` if there is no intersected node.\n• `listA` - The first linked list.\n• `listB` - The second linked list.\n• `skipA` - The number of nodes to skip ahead in `listA` (starting from the head) to get to the intersected node.\n• `skipB` - The number of nodes to skip ahead in `listB` (starting from the head) to get to the intersected node.\n\nThe judge will then create the linked structure based on these inputs and pass the two heads, `headA` and `headB` to your program. If you correctly return the intersected node, then your solution will be accepted.\n\n \n\nExample 1:\n\nInput: intersectVal = 8, listA = [4,1,8,4,5], listB = [5,6,1,8,4,5], skipA = 2, skipB = 3\nOutput: Intersected at '8'\nExplanation: The intersected node's value is 8 (note that this must not be 0 if the two lists intersect).\nFrom the head of A, it reads as [4,1,8,4,5]. From the head of B, it reads as [5,6,1,8,4,5]. There are 2 nodes before the intersected node in A; There are 3 nodes before the intersected node in B.\n- Note that the intersected node's value is not 1 because the nodes with value 1 in A and B (2nd node in A and 3rd node in B) are different node references. In other words, they point to two different locations in memory, while the nodes with value 8 in A and B (3rd node in A and 4th node in B) point to the same location in memory.\n\nExample 2:\n\nInput: intersectVal = 2, listA = [1,9,1,2,4], listB = [3,2,4], skipA = 3, skipB = 1\nOutput: Intersected at '2'\nExplanation: The intersected node's value is 2 (note that this must not be 0 if the two lists intersect).\nFrom the head of A, it reads as [1,9,1,2,4]. From the head of B, it reads as [3,2,4]. There are 3 nodes before the intersected node in A; There are 1 node before the intersected node in B.\n\nExample 3:\n\nInput: intersectVal = 0, listA = [2,6,4], listB = [1,5], skipA = 3, skipB = 2\nOutput: No intersection\nExplanation: From the head of A, it reads as [2,6,4]. From the head of B, it reads as [1,5]. Since the two lists do not intersect, intersectVal must be 0, while skipA and skipB can be arbitrary values.\nExplanation: The two lists do not intersect, so return null.\n\n \n\nConstraints:\n\n\t• The number of nodes of `listA` is in the `m`.\n• The number of nodes of `listB` is in the `n`.\n• `1 4`\n• `1 5`\n• `0 \n\n \nFollow up: Could you write a solution that runs in `O(m + n)` time and use only `O(1)` memory?",
      "descriptionHtml": "<p>Given the heads of two singly linked-lists <code>headA</code> and <code>headB</code>, return <em>the node at which the two lists intersect</em>. If the two linked lists have no intersection at all, return <code>null</code>.</p>\n\n<p>For example, the following two linked lists begin to intersect at node <code>c1</code>:</p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2021/03/05/160_statement.png\" style=\"width: 500px; height: 162px;\" />\n<p>The test cases are generated such that there are no cycles anywhere in the entire linked structure.</p>\n\n<p><strong>Note</strong> that the linked lists must <strong>retain their original structure</strong> after the function returns.</p>\n\n<p><strong>Custom Judge:</strong></p>\n\n<p>The inputs to the <strong>judge</strong> are given as follows (your program is <strong>not</strong> given these inputs):</p>\n\n<ul>\n\t<li><code>intersectVal</code> - The value of the node where the intersection occurs. This is <code>0</code> if there is no intersected node.</li>\n\t<li><code>listA</code> - The first linked list.</li>\n\t<li><code>listB</code> - The second linked list.</li>\n\t<li><code>skipA</code> - The number of nodes to skip ahead in <code>listA</code> (starting from the head) to get to the intersected node.</li>\n\t<li><code>skipB</code> - The number of nodes to skip ahead in <code>listB</code> (starting from the head) to get to the intersected node.</li>\n</ul>\n\n<p>The judge will then create the linked structure based on these inputs and pass the two heads, <code>headA</code> and <code>headB</code> to your program. If you correctly return the intersected node, then your solution will be <strong>accepted</strong>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2021/03/05/160_example_1_1.png\" style=\"width: 500px; height: 162px;\" />\n<pre>\n<strong>Input:</strong> intersectVal = 8, listA = [4,1,8,4,5], listB = [5,6,1,8,4,5], skipA = 2, skipB = 3\n<strong>Output:</strong> Intersected at &#39;8&#39;\n<strong>Explanation:</strong> The intersected node&#39;s value is 8 (note that this must not be 0 if the two lists intersect).\nFrom the head of A, it reads as [4,1,8,4,5]. From the head of B, it reads as [5,6,1,8,4,5]. There are 2 nodes before the intersected node in A; There are 3 nodes before the intersected node in B.\n- Note that the intersected node&#39;s value is not 1 because the nodes with value 1 in A and B (2<sup>nd</sup> node in A and 3<sup>rd</sup> node in B) are different node references. In other words, they point to two different locations in memory, while the nodes with value 8 in A and B (3<sup>rd</sup> node in A and 4<sup>th</sup> node in B) point to the same location in memory.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2021/03/05/160_example_2.png\" style=\"width: 500px; height: 194px;\" />\n<pre>\n<strong>Input:</strong> intersectVal = 2, listA = [1,9,1,2,4], listB = [3,2,4], skipA = 3, skipB = 1\n<strong>Output:</strong> Intersected at &#39;2&#39;\n<strong>Explanation:</strong> The intersected node&#39;s value is 2 (note that this must not be 0 if the two lists intersect).\nFrom the head of A, it reads as [1,9,1,2,4]. From the head of B, it reads as [3,2,4]. There are 3 nodes before the intersected node in A; There are 1 node before the intersected node in B.\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2021/03/05/160_example_3.png\" style=\"width: 300px; height: 189px;\" />\n<pre>\n<strong>Input:</strong> intersectVal = 0, listA = [2,6,4], listB = [1,5], skipA = 3, skipB = 2\n<strong>Output:</strong> No intersection\n<strong>Explanation:</strong> From the head of A, it reads as [2,6,4]. From the head of B, it reads as [1,5]. Since the two lists do not intersect, intersectVal must be 0, while skipA and skipB can be arbitrary values.\nExplanation: The two lists do not intersect, so return null.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li>The number of nodes of <code>listA</code> is in the <code>m</code>.</li>\n\t<li>The number of nodes of <code>listB</code> is in the <code>n</code>.</li>\n\t<li><code>1 &lt;= m, n &lt;= 3 * 10<sup>4</sup></code></li>\n\t<li><code>1 &lt;= Node.val &lt;= 10<sup>5</sup></code></li>\n\t<li><code>0 &lt;= skipA &lt;= m</code></li>\n\t<li><code>0 &lt;= skipB &lt;= n</code></li>\n\t<li><code>intersectVal</code> is <code>0</code> if <code>listA</code> and <code>listB</code> do not intersect.</li>\n\t<li><code>intersectVal == listA[skipA] == listB[skipB]</code> if <code>listA</code> and <code>listB</code> intersect.</li>\n</ul>\n\n<p>&nbsp;</p>\n<strong>Follow up:</strong> Could you write a solution that runs in <code>O(m + n)</code> time and use only <code>O(1)</code> memory?",
      "lcSlug": "intersection-of-two-linked-lists",
      "summary": "Intersection — state invariant, then loop."
    },
    {
      "id": "ll-15",
      "title": "Swap Nodes in Pairs",
      "lc": 24,
      "importance": "should",
      "subtopic": "reverse",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "head",
          "out": "swapped"
        }
      ],
      "approaches": [
        {
          "name": "Reverse list",
          "time": "O(n)",
          "space": "O(1)",
          "code": "ListNode* prev=nullptr;\nwhile (head) { auto nxt=head->next; head->next=prev; prev=head; head=nxt; }"
        }
      ],
      "description": "Given a linked list, swap every two adjacent nodes and return its head. You must solve the problem without modifying the values in the list's nodes (i.e., only nodes themselves may be changed.)\n\n \n\nExample 1:\n\nInput: head = [1,2,3,4]\n\nOutput: [2,1,4,3]\n\nExplanation:\n\nExample 2:\n\nInput: head = []\n\nOutput: []\n\nExample 3:\n\nInput: head = [1]\n\nOutput: [1]\n\nExample 4:\n\nInput: head = [1,2,3]\n\nOutput: [2,1,3]\n\n \n\nConstraints:\n\n\t• The number of nodes in the list is in the range `[0, 100]`.\n• `0",
      "descriptionHtml": "<p>Given a&nbsp;linked list, swap every two adjacent nodes and return its head. You must solve the problem without&nbsp;modifying the values in the list&#39;s nodes (i.e., only nodes themselves may be changed.)</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<div class=\"example-block\">\n<p><strong>Input:</strong> <span class=\"example-io\">head = [1,2,3,4]</span></p>\n\n<p><strong>Output:</strong> <span class=\"example-io\">[2,1,4,3]</span></p>\n\n<p><strong>Explanation:</strong></p>\n\n<p><img alt=\"\" src=\"https://assets.leetcode.com/uploads/2020/10/03/swap_ex1.jpg\" style=\"width: 422px; height: 222px;\" /></p>\n</div>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<div class=\"example-block\">\n<p><strong>Input:</strong> <span class=\"example-io\">head = []</span></p>\n\n<p><strong>Output:</strong> <span class=\"example-io\">[]</span></p>\n</div>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<div class=\"example-block\">\n<p><strong>Input:</strong> <span class=\"example-io\">head = [1]</span></p>\n\n<p><strong>Output:</strong> <span class=\"example-io\">[1]</span></p>\n</div>\n\n<p><strong class=\"example\">Example 4:</strong></p>\n\n<div class=\"example-block\">\n<p><strong>Input:</strong> <span class=\"example-io\">head = [1,2,3]</span></p>\n\n<p><strong>Output:</strong> <span class=\"example-io\">[2,1,3]</span></p>\n</div>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li>The number of nodes in the&nbsp;list&nbsp;is in the range <code>[0, 100]</code>.</li>\n\t<li><code>0 &lt;= Node.val &lt;= 100</code></li>\n</ul>\n",
      "lcSlug": "swap-nodes-in-pairs",
      "summary": "Reverse list — state invariant, then loop."
    },
    {
      "id": "ll-16",
      "title": "Reverse Nodes in k-Group",
      "lc": 25,
      "importance": "should",
      "subtopic": "reverse",
      "difficulty": "Hard",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "head,k",
          "out": "reversed groups"
        }
      ],
      "approaches": [
        {
          "name": "Reverse list",
          "time": "O(n)",
          "space": "O(1)",
          "code": "ListNode* prev=nullptr;\nwhile (head) { auto nxt=head->next; head->next=prev; prev=head; head=nxt; }"
        }
      ],
      "description": "Given the `head` of a linked list, reverse the nodes of the list `k` at a time, and return the modified list.\n\n`k` is a positive integer and is less than or equal to the length of the linked list. If the number of nodes is not a multiple of `k` then left-out nodes, in the end, should remain as it is.\n\nYou may not alter the values in the list's nodes, only nodes themselves may be changed.\n\n \n\nExample 1:\n\nInput: head = [1,2,3,4,5], k = 2\nOutput: [2,1,4,3,5]\n\nExample 2:\n\nInput: head = [1,2,3,4,5], k = 3\nOutput: [3,2,1,4,5]\n\n \n\nConstraints:\n\n\t• The number of nodes in the list is `n`.\n• `1 \n\n \n\nFollow-up: Can you solve the problem in `O(1)` extra memory space?",
      "descriptionHtml": "<p>Given the <code>head</code> of a linked list, reverse the nodes of the list <code>k</code> at a time, and return <em>the modified list</em>.</p>\n\n<p><code>k</code> is a positive integer and is less than or equal to the length of the linked list. If the number of nodes is not a multiple of <code>k</code> then left-out nodes, in the end, should remain as it is.</p>\n\n<p>You may not alter the values in the list&#39;s nodes, only nodes themselves may be changed.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2020/10/03/reverse_ex1.jpg\" style=\"width: 542px; height: 222px;\" />\n<pre>\n<strong>Input:</strong> head = [1,2,3,4,5], k = 2\n<strong>Output:</strong> [2,1,4,3,5]\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2020/10/03/reverse_ex2.jpg\" style=\"width: 542px; height: 222px;\" />\n<pre>\n<strong>Input:</strong> head = [1,2,3,4,5], k = 3\n<strong>Output:</strong> [3,2,1,4,5]\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li>The number of nodes in the list is <code>n</code>.</li>\n\t<li><code>1 &lt;= k &lt;= n &lt;= 5000</code></li>\n\t<li><code>0 &lt;= Node.val &lt;= 1000</code></li>\n</ul>\n\n<p>&nbsp;</p>\n<p><strong>Follow-up:</strong> Can you solve the problem in <code>O(1)</code> extra memory space?</p>\n",
      "lcSlug": "reverse-nodes-in-k-group",
      "summary": "Reverse list — state invariant, then loop."
    },
    {
      "id": "ll-17",
      "title": "Rotate List",
      "lc": 61,
      "importance": "nice",
      "subtopic": "two-ptr",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "head,k",
          "out": "rotated"
        }
      ],
      "approaches": [
        {
          "name": "Connect tail to head",
          "time": "O(n)",
          "space": "O(1)",
          "code": "ListNode* rotateRight(ListNode* head, int k) {\n    if(!head||!head->next) return head;\n    int n=1; ListNode* tail=head;\n    while(tail->next){ tail=tail->next; n++; }\n    k%=n; if(!k) return head;\n    tail->next=head;\n    for(int i=0;i<n-k-1;i++) tail=tail->next;\n    head=tail->next; tail->next=nullptr; return head;\n}"
        }
      ],
      "description": "Given the `head` of a linked list, rotate the list to the right by `k` places.\n\n \n\nExample 1:\n\nInput: head = [1,2,3,4,5], k = 2\nOutput: [4,5,1,2,3]\n\nExample 2:\n\nInput: head = [0,1,2], k = 4\nOutput: [2,0,1]\n\n \n\nConstraints:\n\n\t• The number of nodes in the list is in the range `[0, 500]`.\n• `-100 9`",
      "descriptionHtml": "<p>Given the <code>head</code> of a linked&nbsp;list, rotate the list to the right by <code>k</code> places.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2020/11/13/rotate1.jpg\" style=\"width: 450px; height: 191px;\" />\n<pre>\n<strong>Input:</strong> head = [1,2,3,4,5], k = 2\n<strong>Output:</strong> [4,5,1,2,3]\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2020/11/13/roate2.jpg\" style=\"width: 305px; height: 350px;\" />\n<pre>\n<strong>Input:</strong> head = [0,1,2], k = 4\n<strong>Output:</strong> [2,0,1]\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li>The number of nodes in the list is in the range <code>[0, 500]</code>.</li>\n\t<li><code>-100 &lt;= Node.val &lt;= 100</code></li>\n\t<li><code>0 &lt;= k &lt;= 2 * 10<sup>9</sup></code></li>\n</ul>\n",
      "lcSlug": "rotate-list",
      "summary": "Connect tail to head — state invariant, then loop."
    },
    {
      "id": "ll-18",
      "title": "Partition List",
      "lc": 86,
      "importance": "nice",
      "subtopic": "two-ptr",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "head,x",
          "out": "partitioned"
        }
      ],
      "approaches": [
        {
          "name": "Two lists partition",
          "time": "O(n)",
          "space": "O(1)",
          "code": "ListNode* partition(ListNode* head, int x) {\n    ListNode less(0), great(0), *l=&less, *g=&great;\n    while(head){ if(head->val<x){ l->next=head; l=l->next; } else { g->next=head; g=g->next; } head=head->next; }\n    l->next=great.next; g->next=nullptr; return less.next;\n}"
        }
      ],
      "description": "Given the `head` of a linked list and a value `x`, partition it such that all nodes less than `x` come before nodes greater than or equal to `x`.\n\nYou should preserve the original relative order of the nodes in each of the two partitions.\n\n \n\nExample 1:\n\nInput: head = [1,4,3,2,5,2], x = 3\nOutput: [1,2,2,4,3,5]\n\nExample 2:\n\nInput: head = [2,1], x = 2\nOutput: [1,2]\n\n \n\nConstraints:\n\n\t• The number of nodes in the list is in the range `[0, 200]`.\n• `-100",
      "descriptionHtml": "<p>Given the <code>head</code> of a linked list and a value <code>x</code>, partition it such that all nodes <strong>less than</strong> <code>x</code> come before nodes <strong>greater than or equal</strong> to <code>x</code>.</p>\n\n<p>You should <strong>preserve</strong> the original relative order of the nodes in each of the two partitions.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2021/01/04/partition.jpg\" style=\"width: 662px; height: 222px;\" />\n<pre>\n<strong>Input:</strong> head = [1,4,3,2,5,2], x = 3\n<strong>Output:</strong> [1,2,2,4,3,5]\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> head = [2,1], x = 2\n<strong>Output:</strong> [1,2]\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li>The number of nodes in the list is in the range <code>[0, 200]</code>.</li>\n\t<li><code>-100 &lt;= Node.val &lt;= 100</code></li>\n\t<li><code>-200 &lt;= x &lt;= 200</code></li>\n</ul>\n",
      "lcSlug": "partition-list",
      "summary": "Two lists partition — state invariant, then loop."
    },
    {
      "id": "ll-19",
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
      ],
      "description": "Given the `head` of a linked list, return the list after sorting it in ascending order.\n\n \n\nExample 1:\n\nInput: head = [4,2,1,3]\nOutput: [1,2,3,4]\n\nExample 2:\n\nInput: head = [-1,5,3,4,0]\nOutput: [-1,0,3,4,5]\n\nExample 3:\n\nInput: head = []\nOutput: []\n\n \n\nConstraints:\n\n\t• The number of nodes in the list is in the range `[0, 5 * 104]`.\n• `-105 5`\n\n \n\nFollow up: Can you sort the linked list in `O(n logn)` time and `O(1)` memory (i.e. constant space)?",
      "descriptionHtml": "<p>Given the <code>head</code> of a linked list, return <em>the list after sorting it in <strong>ascending order</strong></em>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2020/09/14/sort_list_1.jpg\" style=\"width: 450px; height: 194px;\" />\n<pre>\n<strong>Input:</strong> head = [4,2,1,3]\n<strong>Output:</strong> [1,2,3,4]\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2020/09/14/sort_list_2.jpg\" style=\"width: 550px; height: 184px;\" />\n<pre>\n<strong>Input:</strong> head = [-1,5,3,4,0]\n<strong>Output:</strong> [-1,0,3,4,5]\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> head = []\n<strong>Output:</strong> []\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li>The number of nodes in the list is in the range <code>[0, 5 * 10<sup>4</sup>]</code>.</li>\n\t<li><code>-10<sup>5</sup> &lt;= Node.val &lt;= 10<sup>5</sup></code></li>\n</ul>\n\n<p>&nbsp;</p>\n<p><strong>Follow up:</strong> Can you sort the linked list in <code>O(n logn)</code> time and <code>O(1)</code> memory (i.e. constant space)?</p>\n",
      "lcSlug": "sort-list",
      "summary": "Merge sort list — state invariant, then loop."
    },
    {
      "id": "ll-20",
      "title": "Odd Even Linked List",
      "lc": 328,
      "importance": "nice",
      "subtopic": "two-ptr",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "head",
          "out": "reordered"
        }
      ],
      "approaches": [
        {
          "name": "Odd even relink",
          "time": "O(n)",
          "space": "O(1)",
          "code": "ListNode* oddEvenList(ListNode* head) {\n    if(!head) return head;\n    ListNode *odd=head, *even=head->next, *evenHead=even;\n    while(even && even->next){\n        odd->next=even->next; odd=odd->next;\n        even->next=odd->next; even=even->next;\n    } odd->next=evenHead; return head;\n}"
        }
      ],
      "description": "Given the `head` of a singly linked list, group all the nodes with odd indices together followed by the nodes with even indices, and return the reordered list.\n\nThe first node is considered odd, and the second node is even, and so on.\n\nNote that the relative order inside both the even and odd groups should remain as it was in the input.\n\nYou must solve the problem in `O(1)` extra space complexity and `O(n)` time complexity.\n\n \n\nExample 1:\n\nInput: head = [1,2,3,4,5]\nOutput: [1,3,5,2,4]\n\nExample 2:\n\nInput: head = [2,1,3,5,6,4,7]\nOutput: [2,3,6,7,1,5,4]\n\n \n\nConstraints:\n\n\t• The number of nodes in the linked list is in the range `[0, 104]`.\n• `-106 6`",
      "descriptionHtml": "<p>Given the <code>head</code> of a singly linked list, group all the nodes with odd indices together followed by the nodes with even indices, and return <em>the reordered list</em>.</p>\n\n<p>The <strong>first</strong> node is considered <strong>odd</strong>, and the <strong>second</strong> node is <strong>even</strong>, and so on.</p>\n\n<p>Note that the relative order inside both the even and odd groups should remain as it was in the input.</p>\n\n<p>You must solve the problem&nbsp;in <code>O(1)</code>&nbsp;extra space complexity and <code>O(n)</code> time complexity.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2021/03/10/oddeven-linked-list.jpg\" style=\"width: 300px; height: 123px;\" />\n<pre>\n<strong>Input:</strong> head = [1,2,3,4,5]\n<strong>Output:</strong> [1,3,5,2,4]\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2021/03/10/oddeven2-linked-list.jpg\" style=\"width: 500px; height: 142px;\" />\n<pre>\n<strong>Input:</strong> head = [2,1,3,5,6,4,7]\n<strong>Output:</strong> [2,3,6,7,1,5,4]\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li>The number of nodes in the linked list is in the range <code>[0, 10<sup>4</sup>]</code>.</li>\n\t<li><code>-10<sup>6</sup> &lt;= Node.val &lt;= 10<sup>6</sup></code></li>\n</ul>\n",
      "lcSlug": "odd-even-linked-list",
      "summary": "Odd even relink — state invariant, then loop."
    },
    {
      "id": "ll-21",
      "title": "Add Two Numbers II",
      "lc": 445,
      "importance": "nice",
      "subtopic": "stack",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "l1,l2",
          "out": "sum"
        }
      ],
      "approaches": [
        {
          "name": "Stack add",
          "time": "O(m+n)",
          "space": "O(m+n)",
          "code": "ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {\n    stack<int> a,b; while(l1){ a.push(l1->val); l1=l1->next; } while(l2){ b.push(l2->val); l2=l2->next; }\n    ListNode* head=nullptr; int carry=0;\n    while(!a.empty()||!b.empty()||carry){\n        int s=carry; if(!a.empty()){ s+=a.top(); a.pop(); } if(!b.empty()){ s+=b.top(); b.pop(); }\n        ListNode* node=new ListNode(s%10); node->next=head; head=node; carry=s/10;\n    } return head;\n}"
        }
      ],
      "description": "You are given two non-empty linked lists representing two non-negative integers. The most significant digit comes first and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.\n\nYou may assume the two numbers do not contain any leading zero, except the number 0 itself.\n\n \n\nExample 1:\n\nInput: l1 = [7,2,4,3], l2 = [5,6,4]\nOutput: [7,8,0,7]\n\nExample 2:\n\nInput: l1 = [2,4,3], l2 = [5,6,4]\nOutput: [8,0,7]\n\nExample 3:\n\nInput: l1 = [0], l2 = [0]\nOutput: [0]\n\n \n\nConstraints:\n\n\t• The number of nodes in each linked list is in the range `[1, 100]`.\n• `0 \n\n \n\nFollow up: Could you solve it without reversing the input lists?",
      "descriptionHtml": "<p>You are given two <strong>non-empty</strong> linked lists representing two non-negative integers. The most significant digit comes first and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.</p>\n\n<p>You may assume the two numbers do not contain any leading zero, except the number 0 itself.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2021/04/09/sumii-linked-list.jpg\" style=\"width: 523px; height: 342px;\" />\n<pre>\n<strong>Input:</strong> l1 = [7,2,4,3], l2 = [5,6,4]\n<strong>Output:</strong> [7,8,0,7]\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> l1 = [2,4,3], l2 = [5,6,4]\n<strong>Output:</strong> [8,0,7]\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> l1 = [0], l2 = [0]\n<strong>Output:</strong> [0]\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li>The number of nodes in each linked list is in the range <code>[1, 100]</code>.</li>\n\t<li><code>0 &lt;= Node.val &lt;= 9</code></li>\n\t<li>It is guaranteed that the list represents a number that does not have leading zeros.</li>\n</ul>\n\n<p>&nbsp;</p>\n<p><strong>Follow up:</strong>&nbsp;Could you solve it without reversing the input lists?</p>\n",
      "lcSlug": "add-two-numbers-ii",
      "summary": "Stack add — LIFO for parsing, matching, or monotonic next-greater patterns."
    },
    {
      "id": "ll-22",
      "title": "Flatten a Multilevel Doubly Linked List",
      "lc": 430,
      "importance": "nice",
      "subtopic": "dfs",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "head",
          "out": "flattened"
        }
      ],
      "approaches": [
        {
          "name": "DFS flatten multilevel",
          "time": "O(n)",
          "space": "O(n)",
          "code": "Node* flatten(Node* head) {\n    if(!head) return head;\n    Node* cur=head;\n    while(cur){\n        if(cur->child){\n            Node* child=cur->child;\n            Node* tail=child;\n            while(tail->next) tail=tail->next;\n            tail->next=cur->next;\n            if(cur->next) cur->next->prev=tail;\n            cur->next=child; child->prev=cur; cur->child=nullptr;\n        } cur=cur->next;\n    } return head;\n}"
        }
      ],
      "description": "You are given a doubly linked list, which contains nodes that have a next pointer, a previous pointer, and an additional child pointer. This child pointer may or may not point to a separate doubly linked list, also containing these special nodes. These child lists may have one or more children of their own, and so on, to produce a multilevel data structure as shown in the example below.\n\nGiven the `head` of the first level of the list, flatten the list so that all the nodes appear in a single-level, doubly linked list. Let `curr` be a node with a child list. The nodes in the child list should appear after `curr` and before `curr.next` in the flattened list.\n\nReturn the `head` of the flattened list. The nodes in the list must have all of their child pointers set to `null`.\n\n \n\nExample 1:\n\nInput: head = [1,2,3,4,5,6,null,null,null,7,8,9,10,null,null,11,12]\nOutput: [1,2,3,7,8,11,12,9,10,4,5,6]\nExplanation: The multilevel linked list in the input is shown.\nAfter flattening the multilevel linked list it becomes:\n\nExample 2:\n\nInput: head = [1,2,null,3]\nOutput: [1,3,2]\nExplanation: The multilevel linked list in the input is shown.\nAfter flattening the multilevel linked list it becomes:\n\nExample 3:\n\nInput: head = []\nOutput: []\nExplanation: There could be empty list in the input.\n\n \n\nConstraints:\n\n\t• The number of Nodes will not exceed `1000`.\n• `1 5`\n\n \n\nHow the multilevel linked list is represented in test cases:\n\nWe use the multilevel linked list from Example 1 above:\n\n 1---2---3---4---5---6--NULL\n         |\n         7---8---9---10--NULL\n             |\n             11--12--NULL\n\nThe serialization of each level is as follows:\n\n[1,2,3,4,5,6,null]\n[7,8,9,10,null]\n[11,12,null]\n\nTo serialize all levels together, we will add nulls in each level to signify no node connects to the upper node of the previous level. The serialization becomes:\n\n[1,    2,    3, 4, 5, 6, null]\n             |\n[null, null, 7,    8, 9, 10, null]\n                   |\n[            null, 11, 12, null]\n\nMerging the serialization of each level and removing trailing nulls we obtain:\n\n[1,2,3,4,5,6,null,null,null,7,8,9,10,null,null,11,12]",
      "descriptionHtml": "<p>You are given a doubly linked list, which contains nodes that have a next pointer, a previous pointer, and an additional <strong>child pointer</strong>. This child pointer may or may not point to a separate doubly linked list, also containing these special nodes. These child lists may have one or more children of their own, and so on, to produce a <strong>multilevel data structure</strong> as shown in the example below.</p>\n\n<p>Given the <code>head</code> of the first level of the list, <strong>flatten</strong> the list so that all the nodes appear in a single-level, doubly linked list. Let <code>curr</code> be a node with a child list. The nodes in the child list should appear <strong>after</strong> <code>curr</code> and <strong>before</strong> <code>curr.next</code> in the flattened list.</p>\n\n<p>Return <em>the </em><code>head</code><em> of the flattened list. The nodes in the list must have <strong>all</strong> of their child pointers set to </em><code>null</code>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2021/11/09/flatten11.jpg\" style=\"width: 700px; height: 339px;\" />\n<pre>\n<strong>Input:</strong> head = [1,2,3,4,5,6,null,null,null,7,8,9,10,null,null,11,12]\n<strong>Output:</strong> [1,2,3,7,8,11,12,9,10,4,5,6]\n<strong>Explanation:</strong> The multilevel linked list in the input is shown.\nAfter flattening the multilevel linked list it becomes:\n<img src=\"https://assets.leetcode.com/uploads/2021/11/09/flatten12.jpg\" style=\"width: 1000px; height: 69px;\" />\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2021/11/09/flatten2.1jpg\" style=\"width: 200px; height: 200px;\" />\n<pre>\n<strong>Input:</strong> head = [1,2,null,3]\n<strong>Output:</strong> [1,3,2]\n<strong>Explanation:</strong> The multilevel linked list in the input is shown.\nAfter flattening the multilevel linked list it becomes:\n<img src=\"https://assets.leetcode.com/uploads/2021/11/24/list.jpg\" style=\"width: 300px; height: 87px;\" />\n</pre>\n\n<p><strong class=\"example\">Example 3:</strong></p>\n\n<pre>\n<strong>Input:</strong> head = []\n<strong>Output:</strong> []\n<strong>Explanation:</strong> There could be empty list in the input.\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li>The number of Nodes will not exceed <code>1000</code>.</li>\n\t<li><code>1 &lt;= Node.val &lt;= 10<sup>5</sup></code></li>\n</ul>\n\n<p>&nbsp;</p>\n<p><strong>How the multilevel linked list is represented in test cases:</strong></p>\n\n<p>We use the multilevel linked list from <strong>Example 1</strong> above:</p>\n\n<pre>\n 1---2---3---4---5---6--NULL\n         |\n         7---8---9---10--NULL\n             |\n             11--12--NULL</pre>\n\n<p>The serialization of each level is as follows:</p>\n\n<pre>\n[1,2,3,4,5,6,null]\n[7,8,9,10,null]\n[11,12,null]\n</pre>\n\n<p>To serialize all levels together, we will add nulls in each level to signify no node connects to the upper node of the previous level. The serialization becomes:</p>\n\n<pre>\n[1,    2,    3, 4, 5, 6, null]\n             |\n[null, null, 7,    8, 9, 10, null]\n                   |\n[            null, 11, 12, null]\n</pre>\n\n<p>Merging the serialization of each level and removing trailing nulls we obtain:</p>\n\n<pre>\n[1,2,3,4,5,6,null,null,null,7,8,9,10,null,null,11,12]\n</pre>\n",
      "lcSlug": "flatten-a-multilevel-doubly-linked-list",
      "summary": "DFS flatten multilevel — state invariant, then loop."
    },
    {
      "id": "ll-23",
      "title": "Design Linked List",
      "lc": 707,
      "importance": "nice",
      "subtopic": "design",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "ops",
          "out": "list"
        }
      ],
      "approaches": [
        {
          "name": "Array list design",
          "time": "O(n)",
          "space": "O(n)",
          "code": "class MyLinkedList {\n    vector<int> a;\npublic:\n    int get(int index){ return index>=0&&index<(int)a.size()? a[index]: -1; }\n    void addAtHead(int val){ a.insert(a.begin(), val); }\n    void addAtTail(int val){ a.push_back(val); }\n    void addAtIndex(int index,int val){ if(index>=0&&index<=(int)a.size()) a.insert(a.begin()+index,val); }\n    void deleteAtIndex(int index){ if(index>=0&&index<(int)a.size()) a.erase(a.begin()+index); }\n};"
        }
      ],
      "description": "Design your implementation of the linked list. You can choose to use a singly or doubly linked list.\n\nA node in a singly linked list should have two attributes: `val` and `next`. `val` is the value of the current node, and `next` is a pointer/reference to the next node.\n\nIf you want to use the doubly linked list, you will need one more attribute `prev` to indicate the previous node in the linked list. Assume all nodes in the linked list are 0-indexed.\n\nImplement the `MyLinkedList` class:\n\n\t• `MyLinkedList()` Initializes the `MyLinkedList` object.\n• `int get(int index)` Get the value of the `indexth` node in the linked list. If the index is invalid, return `-1`.\n• `void addAtHead(int val)` Add a node of value `val` before the first element of the linked list. After the insertion, the new node will be the first node of the linked list.\n• `void addAtTail(int val)` Append a node of value `val` as the last element of the linked list.\n• `void addAtIndex(int index, int val)` Add a node of value `val` before the `indexth` node in the linked list. If `index` equals the length of the linked list, the node will be appended to the end of the linked list. If `index` is greater than the length, the node will not be inserted.\n• `void deleteAtIndex(int index)` Delete the `indexth` node in the linked list, if the index is valid.\n\n \n\nExample 1:\n\nInput\n[\"MyLinkedList\", \"addAtHead\", \"addAtTail\", \"addAtIndex\", \"get\", \"deleteAtIndex\", \"get\"]\n[[], [1], [3], [1, 2], [1], [1], [1]]\nOutput\n[null, null, null, null, 2, null, 3]\n\nExplanation\nMyLinkedList myLinkedList = new MyLinkedList();\nmyLinkedList.addAtHead(1);\nmyLinkedList.addAtTail(3);\nmyLinkedList.addAtIndex(1, 2);    // linked list becomes 1->2->3\nmyLinkedList.get(1);              // return 2\nmyLinkedList.deleteAtIndex(1);    // now the linked list is 1->3\nmyLinkedList.get(1);              // return 3\n\n \n\nConstraints:\n\n\t• `0",
      "descriptionHtml": "<p>Design your implementation of the linked list. You can choose to use a singly or doubly linked list.<br />\nA node in a singly linked list should have two attributes: <code>val</code> and <code>next</code>. <code>val</code> is the value of the current node, and <code>next</code> is a pointer/reference to the next node.<br />\nIf you want to use the doubly linked list, you will need one more attribute <code>prev</code> to indicate the previous node in the linked list. Assume all nodes in the linked list are <strong>0-indexed</strong>.</p>\n\n<p>Implement the <code>MyLinkedList</code> class:</p>\n\n<ul>\n\t<li><code>MyLinkedList()</code> Initializes the <code>MyLinkedList</code> object.</li>\n\t<li><code>int get(int index)</code> Get the value of the <code>index<sup>th</sup></code> node in the linked list. If the index is invalid, return <code>-1</code>.</li>\n\t<li><code>void addAtHead(int val)</code> Add a node of value <code>val</code> before the first element of the linked list. After the insertion, the new node will be the first node of the linked list.</li>\n\t<li><code>void addAtTail(int val)</code> Append a node of value <code>val</code> as the last element of the linked list.</li>\n\t<li><code>void addAtIndex(int index, int val)</code> Add a node of value <code>val</code> before the <code>index<sup>th</sup></code> node in the linked list. If <code>index</code> equals the length of the linked list, the node will be appended to the end of the linked list. If <code>index</code> is greater than the length, the node <strong>will not be inserted</strong>.</li>\n\t<li><code>void deleteAtIndex(int index)</code> Delete the <code>index<sup>th</sup></code> node in the linked list, if the index is valid.</li>\n</ul>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n\n<pre>\n<strong>Input</strong>\n[&quot;MyLinkedList&quot;, &quot;addAtHead&quot;, &quot;addAtTail&quot;, &quot;addAtIndex&quot;, &quot;get&quot;, &quot;deleteAtIndex&quot;, &quot;get&quot;]\n[[], [1], [3], [1, 2], [1], [1], [1]]\n<strong>Output</strong>\n[null, null, null, null, 2, null, 3]\n\n<strong>Explanation</strong>\nMyLinkedList myLinkedList = new MyLinkedList();\nmyLinkedList.addAtHead(1);\nmyLinkedList.addAtTail(3);\nmyLinkedList.addAtIndex(1, 2);    // linked list becomes 1-&gt;2-&gt;3\nmyLinkedList.get(1);              // return 2\nmyLinkedList.deleteAtIndex(1);    // now the linked list is 1-&gt;3\nmyLinkedList.get(1);              // return 3\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>0 &lt;= index, val &lt;= 1000</code></li>\n\t<li>Please do not use the built-in LinkedList library.</li>\n\t<li>At most <code>2000</code> calls will be made to <code>get</code>, <code>addAtHead</code>, <code>addAtTail</code>, <code>addAtIndex</code> and <code>deleteAtIndex</code>.</li>\n</ul>\n",
      "lcSlug": "design-linked-list",
      "summary": "Array list design — Class design with required operation complexities — map + structure."
    },
    {
      "id": "ll-24",
      "title": "Convert Sorted List to BST",
      "lc": 109,
      "importance": "nice",
      "subtopic": "divide",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "head",
          "out": "root"
        }
      ],
      "approaches": [
        {
          "name": "Inorder + build BST",
          "time": "O(n)",
          "space": "O(n)",
          "code": "TreeNode* sortedListToBST(ListNode* head) {\n    vector<int> vals; for(auto p=head;p;p=p->next) vals.push_back(p->val);\n    function<TreeNode*(int,int)> build=[&](int l,int r){\n        if(l>r) return (TreeNode*)nullptr;\n        int m=l+(r-l)/2; TreeNode* root=new TreeNode(vals[m]);\n        root->left=build(l,m-1); root->right=build(m+1,r); return root;\n    }; return build(0,(int)vals.size()-1);\n}"
        }
      ],
      "description": "Given the `head` of a singly linked list where elements are sorted in ascending order, convert it to a height-balanced binary search tree.\n\n \n\nExample 1:\n\nInput: head = [-10,-3,0,5,9]\nOutput: [0,-3,9,-10,null,5]\nExplanation: One possible answer is [0,-3,9,-10,null,5], which represents the shown height balanced BST.\n\nExample 2:\n\nInput: head = []\nOutput: []\n\n \n\nConstraints:\n\n\t• The number of nodes in `head` is in the range `[0, 2 * 104]`.\n• `-105 5`",
      "descriptionHtml": "<p>Given the <code>head</code> of a singly linked list where elements are sorted in <strong>ascending order</strong>, convert <em>it to a </em><span data-keyword=\"height-balanced\"><strong><em>height-balanced</em></strong></span> <em>binary search tree</em>.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2020/08/17/linked.jpg\" style=\"width: 500px; height: 388px;\" />\n<pre>\n<strong>Input:</strong> head = [-10,-3,0,5,9]\n<strong>Output:</strong> [0,-3,9,-10,null,5]\n<strong>Explanation:</strong> One possible answer is [0,-3,9,-10,null,5], which represents the shown height balanced BST.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n\n<pre>\n<strong>Input:</strong> head = []\n<strong>Output:</strong> []\n</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li>The number of nodes in <code>head</code> is in the range <code>[0, 2 * 10<sup>4</sup>]</code>.</li>\n\t<li><code>-10<sup>5</sup> &lt;= Node.val &lt;= 10<sup>5</sup></code></li>\n</ul>\n",
      "lcSlug": "convert-sorted-list-to-binary-search-tree",
      "summary": "Inorder + build BST — state invariant, then loop."
    }
  ]
};
