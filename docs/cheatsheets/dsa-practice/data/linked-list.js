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
      ]
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
      ]
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
      ]
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
      ]
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
      ]
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
      ]
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
      ]
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
          "name": "Optimal",
          "time": "O(n)",
          "space": "O(n)",
          "code": "// Pattern: design\n// Implement optimal C++ for LC 146"
        }
      ]
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
      ]
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
      ]
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
          "name": "Optimal",
          "time": "O(n)",
          "space": "O(n)",
          "code": "// Pattern: scan\n// Implement optimal C++ for LC 83"
        }
      ]
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
          "name": "Optimal",
          "time": "O(n)",
          "space": "O(n)",
          "code": "// Pattern: scan\n// Implement optimal C++ for LC 82"
        }
      ]
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
      ]
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
      ]
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
      ]
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
      ]
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
      ]
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
      ]
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
      ]
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
      ]
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
      ]
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
      ]
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
      ]
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
      ]
    }
  ]
};
