"""Full C++ for should-do / must-do questions still on pattern skeletons."""
SNIPPETS_LC4 = {
    7: ("Digit reverse", "O(log n)", "O(1)", """
int reverse(int x) {
    long r = 0;
    while (x) { r = r * 10 + x % 10; x /= 10; }
    return r < INT_MIN || r > INT_MAX ? 0 : (int)r;
}"""),
    13: ("Left-to-right", "O(n)", "O(1)", """
int romanToInt(string s) {
    unordered_map<char,int> m{{'I',1},{'V',5},{'X',10},{'L',50},{'C',100},{'D',500},{'M',1000}};
    int ans = 0;
    for (int i = 0; i < (int)s.size(); i++) {
        if (i + 1 < (int)s.size() && m[s[i]] < m[s[i+1]]) ans -= m[s[i]];
        else ans += m[s[i]];
    }
    return ans;
}"""),
    14: ("Vertical scan", "O(S)", "O(1)", """
string longestCommonPrefix(vector<string>& strs) {
    if (strs.empty()) return "";
    for (int i = 0; ; i++) {
        for (string& s : strs) {
            if (i == (int)s.size() || (i && s[i] != strs[0][i])) return strs[0].substr(0, i);
        }
    }
}"""),
    16: ("Sort + two pointers", "O(n^2)", "O(1)", """
int threeSumClosest(vector<int>& nums, int target) {
    sort(nums.begin(), nums.end());
    int ans = nums[0] + nums[1] + nums[2];
    for (int i = 0; i < (int)nums.size(); i++) {
        int l = i + 1, r = (int)nums.size() - 1;
        while (l < r) {
            int s = nums[i] + nums[l] + nums[r];
            if (abs(s - target) < abs(ans - target)) ans = s;
            if (s < target) l++; else r--;
        }
    }
    return ans;
}"""),
    27: ("Two pointers", "O(n)", "O(1)", """
int removeElement(vector<int>& nums, int val) {
    int w = 0;
    for (int x : nums) if (x != val) nums[w++] = x;
    return w;
}"""),
    28: ("KMP / brute", "O(n+m)", "O(m)", """
int strStr(string haystack, string needle) {
    if (needle.empty()) return 0;
    int n = haystack.size(), m = needle.size();
    vector<int> lps(m, 0);
    for (int i = 1, len = 0; i < m; ) {
        if (needle[i] == needle[len]) lps[i++] = ++len;
        else if (len) len = lps[len - 1];
        else lps[i++] = 0;
    }
    for (int i = 0, j = 0; i < n; ) {
        if (haystack[i] == needle[j]) { i++; j++; if (j == m) return i - m; }
        else if (j) j = lps[j - 1];
        else i++;
    }
    return -1;
}"""),
    37: ("Backtracking", "O(9^81)", "O(81)", """
bool sudokuSolve(vector<vector<char>>& b) {
    for (int r = 0; r < 9; r++) for (int c = 0; c < 9; c++) if (b[r][c] == '.') {
        for (char d = '1'; d <= '9'; d++) {
            if (ok(b, r, c, d)) { b[r][c] = d; if (sudokuSolve(b)) return true; b[r][c] = '.'; }
        }
        return false;
    }
    return true;
}
bool ok(vector<vector<char>>& b, int r, int c, char d) {
    for (int i = 0; i < 9; i++)
        if (b[r][i] == d || b[i][c] == d || b[r/3*3+i/3][c/3*3+i%3] == d) return false;
    return true;
}"""),
    40: ("Sort + backtrack", "O(2^n)", "O(n)", """
vector<vector<int>> combinationSum2(vector<int>& c, int target) {
    sort(c.begin(), c.end());
    vector<vector<int>> ans, cur;
    function<void(int,int)> dfs = [&](int i, int rem) {
        if (rem == 0) { ans.push_back(cur); return; }
        for (int j = i; j < (int)c.size(); j++) {
            if (j > i && c[j] == c[j-1]) continue;
            if (c[j] > rem) break;
            cur.push_back(c[j]); dfs(j+1, rem-c[j]); cur.pop_back();
        }
    };
    dfs(0, target); return ans;
}"""),
    42: ("Two pointers", "O(n)", "O(1)", """
int trap(vector<int>& h) {
    int l = 0, r = (int)h.size() - 1, lm = 0, rm = 0, ans = 0;
    while (l < r) {
        if (h[l] < h[r]) { lm = max(lm, h[l]); ans += lm - h[l]; l++; }
        else { rm = max(rm, h[r]); ans += rm - h[r]; r--; }
    }
    return ans;
}"""),
    43: ("Grade-school multiply", "O(mn)", "O(m+n)", """
string multiply(string num1, string num2) {
    if (num1 == "0" || num2 == "0") return "0";
    int m = num1.size(), n = num2.size();
    vector<int> prod(m + n, 0);
    for (int i = m - 1; i >= 0; i--)
        for (int j = n - 1; j >= 0; j--) {
            int sum = (num1[i]-'0')*(num2[j]-'0') + prod[i+j+1];
            prod[i+j+1] = sum % 10; prod[i+j] += sum / 10;
        }
    string ans; int k = 0; while (k < (int)prod.size() && !prod[k]) k++;
    for (; k < (int)prod.size(); k++) ans += char('0' + prod[k]);
    return ans.empty() ? "0" : ans;
}"""),
    54: ("Boundary walk", "O(mn)", "O(1)", """
vector<int> spiralOrder(vector<vector<int>>& m) {
    vector<int> ans;
    if (m.empty()) return ans;
    int t = 0, b = (int)m.size()-1, l = 0, r = (int)m[0].size()-1;
    while (t <= b && l <= r) {
        for (int c = l; c <= r; c++) ans.push_back(m[t][c]); t++;
        for (int row = t; row <= b; row++) ans.push_back(m[row][r]); r--;
        if (t <= b) { for (int c = r; c >= l; c--) ans.push_back(m[b][c]); b--; }
        if (l <= r) { for (int row = b; row >= t; row--) ans.push_back(m[row][l]); l++; }
    }
    return ans;
}"""),
    69: ("Binary search", "O(log x)", "O(1)", """
int mySqrt(int x) {
    if (x < 2) return x;
    long lo = 1, hi = x, ans = 0;
    while (lo <= hi) {
        long mid = lo + (hi - lo) / 2;
        if (mid * mid <= x) { ans = mid; lo = mid + 1; } else hi = mid - 1;
    }
    return (int)ans;
}"""),
    82: ("Skip dup runs", "O(n)", "O(1)", """
ListNode* deleteDuplicates(ListNode* head) {
    ListNode dummy(0, head), *prev = &dummy;
    while (head) {
        if (head->next && head->val == head->next->val) {
            int v = head->val;
            while (head && head->val == v) head = head->next;
            prev->next = head;
        } else { prev = head; head = head->next; }
    }
    return dummy.next;
}"""),
    83: ("Skip dup", "O(n)", "O(1)", """
ListNode* deleteDuplicates(ListNode* head) {
    ListNode* cur = head;
    while (cur && cur->next) {
        if (cur->val == cur->next->val) cur->next = cur->next->next;
        else cur = cur->next;
    }
    return head;
}"""),
    88: ("Merge from end", "O(m+n)", "O(1)", """
void merge(vector<int>& nums1, int m, vector<int>& nums2, int n) {
    int i = m - 1, j = n - 1, k = m + n - 1;
    while (j >= 0) nums1[k--] = (i >= 0 && nums1[i] > nums2[j]) ? nums1[i--] : nums2[j--];
}"""),
    93: ("Backtracking", "O(3^4)", "O(1)", """
vector<string> restoreIpAddresses(string s) {
    vector<string> ans;
    function<void(int,int,string)> dfs = [&](int i, int parts, string cur) {
        if (parts == 4 && i == (int)s.size()) { ans.push_back(cur); return; }
        if (parts == 4 || i >= (int)s.size()) return;
        for (int len = 1; len <= 3 && i + len <= (int)s.size(); len++) {
            string seg = s.substr(i, len);
            if ((seg.size() > 1 && seg[0] == '0') || stoi(seg) > 255) break;
            dfs(i + len, parts + 1, cur.empty() ? seg : cur + "." + seg);
        }
    };
    dfs(0, 0, ""); return ans;
}"""),
    96: ("Catalan DP", "O(n^2)", "O(n)", """
int numTrees(int n) {
    vector<int> dp(n + 1, 0); dp[0] = dp[1] = 1;
    for (int nodes = 2; nodes <= n; nodes++)
        for (int root = 1; root <= nodes; root++)
            dp[nodes] += dp[root-1] * dp[nodes-root];
    return dp[n];
}"""),
    100: ("DFS compare", "O(n)", "O(h)", """
bool isSameTree(TreeNode* p, TreeNode* q) {
    if (!p || !q) return p == q;
    return p->val == q->val && isSameTree(p->left, q) && isSameTree(p->right, q);
}"""),
    101: ("Mirror DFS", "O(n)", "O(h)", """
bool isSymmetric(TreeNode* root) {
    function<bool(TreeNode*,TreeNode*)> eq = [&](TreeNode* a, TreeNode* b) {
        if (!a || !b) return a == b;
        return a->val == b->val && eq(a->left, b->right) && eq(a->right, b->left);
    };
    return !root || eq(root->left, root->right);
}"""),
    105: ("Recursive partition", "O(n)", "O(n)", """
TreeNode* buildTree(vector<int>& pre, vector<int>& in) {
    unordered_map<int,int> idx; for (int i = 0; i < (int)in.size(); i++) idx[in[i]] = i;
    int p = 0;
    function<TreeNode*(int,int)> dfs = [&](int l, int r) {
        if (l > r) return (TreeNode*)nullptr;
        int v = pre[p++], m = idx[v];
        TreeNode* node = new TreeNode(v);
        node->left = dfs(l, m-1); node->right = dfs(m+1, r);
        return node;
    };
    return dfs(0, (int)in.size()-1);
}"""),
    106: ("Recursive partition", "O(n)", "O(n)", """
TreeNode* buildTree(vector<int>& in, vector<int>& post) {
    unordered_map<int,int> idx; for (int i = 0; i < (int)in.size(); i++) idx[in[i]] = i;
    int p = (int)post.size()-1;
    function<TreeNode*(int,int)> dfs = [&](int l, int r) {
        if (l > r) return (TreeNode*)nullptr;
        int v = post[p--], m = idx[v];
        TreeNode* node = new TreeNode(v);
        node->right = dfs(m+1, r); node->left = dfs(l, m-1);
        return node;
    };
    return dfs(0, (int)in.size()-1);
}"""),
    112: ("DFS path", "O(n)", "O(h)", """
bool hasPathSum(TreeNode* root, int sum) {
    if (!root) return false;
    if (!root->left && !root->right) return root->val == sum;
    return hasPathSum(root->left, sum - root->val) || hasPathSum(root->right, sum - root->val);
}"""),
    113: ("Backtrack paths", "O(n^2)", "O(h)", """
vector<vector<int>> pathSum(TreeNode* root, int sum) {
    vector<vector<int>> ans; vector<int> path;
    function<void(TreeNode*,int)> dfs = [&](TreeNode* u, int rem) {
        if (!u) return;
        path.push_back(u->val);
        if (!u->left && !u->right && rem == u->val) ans.push_back(path);
        dfs(u->left, rem - u->val); dfs(u->right, rem - u->val);
        path.pop_back();
    };
    dfs(root, sum); return ans;
}"""),
    114: ("Morris / reverse", "O(n)", "O(1)", """
void flatten(TreeNode* root) {
    TreeNode* cur = root;
    while (cur) {
        if (cur->left) {
            TreeNode* pre = cur->left;
            while (pre->right) pre = pre->right;
            pre->right = cur->right; cur->right = cur->left; cur->left = nullptr;
        }
        cur = cur->right;
    }
}"""),
    118: ("DP rows", "O(n^2)", "O(n)", """
vector<vector<int>> generate(int numRows) {
    vector<vector<int>> ans(numRows);
    for (int i = 0; i < numRows; i++) {
        ans[i].resize(i+1, 1);
        for (int j = 1; j < i; j++) ans[i][j] = ans[i-1][j-1] + ans[i-1][j];
    }
    return ans;
}"""),
    131: ("Backtrack + pal check", "O(n*2^n)", "O(n)", """
vector<vector<string>> partition(string s) {
    vector<vector<string>> ans; vector<string> path;
    function<bool(int,int)> pal = [&](int l, int r) {
        while (l < r) if (s[l++] != s[r--]) return false; return true;
    };
    function<void(int)> dfs = [&](int i) {
        if (i == (int)s.size()) { ans.push_back(path); return; }
        for (int j = i; j < (int)s.size(); j++)
            if (pal(i, j)) { path.push_back(s.substr(i, j-i+1)); dfs(j+1); path.pop_back(); }
    };
    dfs(0); return ans;
}"""),
    135: ("Two pass", "O(n)", "O(1)", """
int candy(vector<int>& ratings) {
    int n = ratings.size(); vector<int> c(n, 1);
    for (int i = 1; i < n; i++) if (ratings[i] > ratings[i-1]) c[i] = c[i-1] + 1;
    for (int i = n-2; i >= 0; i--) if (ratings[i] > ratings[i+1]) c[i] = max(c[i], c[i+1] + 1);
    return accumulate(c.begin(), c.end(), 0);
}"""),
    137: ("Bit count mod 3", "O(n)", "O(1)", """
int singleNumber(vector<int>& nums) {
    int ones = 0, twos = 0;
    for (int x : nums) { ones = (ones^x)&~twos; twos = (twos^x)&~ones; }
    return ones;
}"""),
    146: ("HashMap + DLL", "O(1)", "O(capacity)", """
class LRUCache {
    int cap; list<pair<int,int>> order; unordered_map<int, list<pair<int,int>>::iterator> mp;
public:
    LRUCache(int capacity) : cap(capacity) {}
    int get(int key) {
        if (!mp.count(key)) return -1;
        order.splice(order.begin(), order, mp[key]);
        return mp[key]->second;
    }
    void put(int key, int value) {
        if (mp.count(key)) { mp[key]->second = value; order.splice(order.begin(), order, mp[key]); return; }
        if ((int)order.size() == cap) { mp.erase(order.back().first); order.pop_back(); }
        order.push_front({key, value}); mp[key] = order.begin();
    }
};"""),
    149: ("GCD slope map", "O(n^2)", "O(n)", """
int maxPoints(vector<vector<int>>& points) {
    int n = points.size(), ans = 0;
    for (int i = 0; i < n; i++) {
        unordered_map<string,int> slope; int same = 1, local = 0;
        for (int j = i+1; j < n; j++) {
            int dx = points[j][0]-points[i][0], dy = points[j][1]-points[i][1];
            if (!dx && !dy) { same++; continue; }
            int g = __gcd(abs(dx), abs(dy)); dx/=g; dy/=g;
            if (dx < 0) { dx = -dx; dy = -dy; }
            string key = to_string(dx)+"/"+to_string(dy);
            local = max(local, ++slope[key]);
        }
        ans = max(ans, local + same);
    }
    return ans;
}"""),
    150: ("Stack eval", "O(n)", "O(n)", """
int evalRPN(vector<string>& tokens) {
    stack<long> st;
    for (string& t : tokens) {
        if (t.size() > 1 || isdigit(t[0])) st.push(stol(t));
        else {
            long b = st.top(); st.pop(); long a = st.top(); st.pop();
            if (t == "+") st.push(a+b); else if (t == "-") st.push(a-b);
            else if (t == "*") st.push(a*b); else st.push(a/b);
        }
    }
    return (int)st.top();
}"""),
    162: ("Binary search peak", "O(log n)", "O(1)", """
int findPeakElement(vector<int>& nums) {
    int lo = 0, hi = (int)nums.size() - 1;
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] < nums[mid+1]) lo = mid + 1; else hi = mid;
    }
    return lo;
}"""),
    172: ("Count factors of 5", "O(log n)", "O(1)", """
int trailingZeroes(int n) {
    int ans = 0;
    for (long p = 5; p <= n; p *= 5) ans += n / p;
    return ans;
}"""),
    173: ("Stack iterator", "O(1) amortized", "O(h)", """
class BSTIterator {
    stack<TreeNode*> st;
    void pushLeft(TreeNode* u) { while (u) { st.push(u); u = u->left; } }
public:
    BSTIterator(TreeNode* root) { pushLeft(root); }
    int next() { TreeNode* u = st.top(); st.pop(); pushLeft(u->right); return u->val; }
    bool hasNext() { return !st.empty(); }
};"""),
    205: ("Two maps", "O(n)", "O(1)", """
bool isIsomorphic(string s, string t) {
    if (s.size() != t.size()) return false;
    char ms[256]={}, mt[256]={};
    for (int i = 0; i < (int)s.size(); i++) {
        if (ms[(unsigned char)s[i]] != mt[(unsigned char)t[i]]) return false;
        ms[(unsigned char)s[i]] = t[i]; mt[(unsigned char)t[i]] = s[i];
    }
    return true;
}"""),
    212: ("Trie + backtrack", "O(mn*4^L)", "O(n)", """
struct TrieNode { TrieNode* c[26]{}; string w; };
class Solution {
    TrieNode* root = new TrieNode();
    void ins(string& w) {
        TrieNode* u = root;
        for (char ch : w) { int i = ch-'a'; if (!u->c[i]) u->c[i] = new TrieNode(); u = u->c[i]; }
        u->w = w;
    }
    void dfs(vector<vector<char>>& b, int r, int c, TrieNode* u, vector<string>& ans) {
        if (!u->w.empty()) { ans.push_back(u->w); u->w.clear(); }
        if (r < 0 || c < 0 || r >= (int)b.size() || c >= (int)b[0].size()) return;
        char ch = b[r][c]; if (ch == '#') return;
        int i = ch-'a'; if (!u->c[i]) return;
        b[r][c] = '#'; dfs(b, r+1, c, u->c[i], ans); dfs(b, r-1, c, u->c[i], ans);
        dfs(b, r, c+1, u->c[i], ans); dfs(b, r, c-1, u->c[i], ans); b[r][c] = ch;
    }
public:
    vector<string> findWords(vector<vector<char>>& board, vector<string>& words) {
        for (string& w : words) ins(w);
        vector<string> ans;
        for (int r = 0; r < (int)board.size(); r++)
            for (int c = 0; c < (int)board[0].size(); c++) dfs(board, r, c, root, ans);
        return ans;
    }
};"""),
    224: ("Stack + sign", "O(n)", "O(n)", """
int calculate(string s) {
    stack<int> st; int num = 0, sign = 1, ans = 0;
    for (char ch : s) {
        if (isdigit(ch)) num = num * 10 + (ch - '0');
        else if (ch == '+' || ch == '-') {
            ans += sign * num; num = 0;
            sign = (ch == '+') ? 1 : -1;
        } else if (ch == '(') { st.push(ans); st.push(sign); ans = 0; sign = 1; }
        else if (ch == ')') { ans += sign * num; num = 0; ans *= st.top(); st.pop(); ans += st.top(); st.pop(); }
    }
    return ans + sign * num;
}"""),
    227: ("Stack eval", "O(n)", "O(n)", """
int calculate(string s) {
    long cur = 0, prev = 0, ans = 0; char op = '+';
    for (int i = 0; i <= (int)s.size(); i++) {
        if (i < (int)s.size() && s[i] == ' ') continue;
        if (i == (int)s.size() || !isdigit(s[i])) {
            if (op == '+' || op == '-') { ans += prev; prev = (op == '+') ? cur : -cur; }
            else if (op == '*') prev *= cur; else prev /= cur;
            if (i < (int)s.size()) op = s[i]; cur = 0;
        } else cur = cur * 10 + (s[i] - '0');
    }
    return (int)(ans + prev);
}"""),
    231: ("Bit check", "O(1)", "O(1)", """
bool isPowerOfTwo(int n) {
    // power of 2 iff exactly one bit set
    return n > 0 && (n & (n - 1)) == 0;
}"""),
    240: ("Staircase search", "O(m+n)", "O(1)", """
bool searchMatrix(vector<vector<int>>& m, int target) {
    int r = 0, c = (int)m[0].size() - 1;
    while (r < (int)m.size() && c >= 0) {
        if (m[r][c] == target) return true;
        if (m[r][c] > target) c--; else r++;
    }
    return false;
}"""),
    271: ("Length prefix", "O(n)", "O(n)", """
class Codec {
public:
    string encode(vector<string>& strs) {
        string out;
        for (string& s : strs) { out += to_string(s.size()) + "#" + s; }
        return out;
    }
    vector<string> decode(string s) {
        vector<string> ans; int i = 0;
        while (i < (int)s.size()) {
            int j = s.find('#', i); int len = stoi(s.substr(i, j-i));
            ans.push_back(s.substr(j+1, len)); i = j + 1 + len;
        }
        return ans;
    }
};"""),
    279: ("BFS shortest", "O(n)", "O(n)", """
int numSquares(int n) {
    vector<int> dp(n+1, INT_MAX); dp[0] = 0; queue<int> q; q.push(0);
    while (!q.empty()) {
        int rem = q.front(); q.pop();
        for (int k = 1; k*k <= n - rem; k++) {
            int nxt = rem + k*k;
            if (dp[nxt] > dp[rem] + 1) { dp[nxt] = dp[rem] + 1; q.push(nxt); }
        }
    }
    return dp[n];
}"""),
    283: ("Two pointers", "O(n)", "O(1)", """
void moveZeroes(vector<int>& nums) {
    int w = 0;
    for (int x : nums) if (x) nums[w++] = x;
    while (w < (int)nums.size()) nums[w++] = 0;
}"""),
    297: ("Preorder + markers", "O(n)", "O(n)", """
class Codec {
    void pre(TreeNode* u, string& s) {
        if (!u) { s += "#,"; return; }
        s += to_string(u->val) + ",";
        pre(u->left, s); pre(u->right, s);
    }
    TreeNode* build(queue<string>& q) {
        string t = q.front(); q.pop();
        if (t == "#") return nullptr;
        TreeNode* node = new TreeNode(stoi(t));
        node->left = build(q); node->right = build(q);
        return node;
    }
public:
    string serialize(TreeNode* root) { string s; pre(root, s); return s; }
    TreeNode* deserialize(string data) {
        queue<string> q; string cur;
        for (char ch : data) {
            if (ch == ',') { if (!cur.empty()) q.push(cur); cur.clear(); }
            else cur += ch;
        }
        if (!cur.empty()) q.push(cur);
        return build(q);
    }
};"""),
    303: ("Prefix sum", "O(1) query", "O(n)", """
class NumArray {
    vector<int> pre;
public:
    NumArray(vector<int>& nums) {
        pre.resize(nums.size()+1);
        for (int i = 0; i < (int)nums.size(); i++) pre[i+1] = pre[i] + nums[i];
    }
    int sumRange(int l, int r) { return pre[r+1] - pre[l]; }
};"""),
    304: ("2D prefix", "O(1) query", "O(mn)", """
class NumMatrix {
    vector<vector<int>> pre;
public:
    NumMatrix(vector<vector<int>>& matrix) {
        int m = matrix.size(), n = m ? matrix[0].size() : 0;
        pre.assign(m+1, vector<int>(n+1, 0));
        for (int i = 0; i < m; i++)
            for (int j = 0; j < n; j++)
                pre[i+1][j+1] = matrix[i][j] + pre[i][j+1] + pre[i+1][j] - pre[i][j];
    }
    int sumRegion(int r1, int c1, int r2, int c2) {
        return pre[r2+1][c2+1] - pre[r1][c2+1] - pre[r2+1][c1] + pre[r1][c1];
    }
};"""),
    312: ("Interval DP", "O(n^3)", "O(n^2)", """
int maxCoins(vector<int>& nums) {
    nums.insert(nums.begin(), 1); nums.push_back(1);
    int n = nums.size(); vector<vector<int>> dp(n, vector<int>(n, 0));
    for (int len = 3; len <= n; len++)
        for (int l = 0; l + len - 1 < n; l++) {
            int r = l + len - 1;
            for (int k = l+1; k < r; k++)
                dp[l][r] = max(dp[l][r], dp[l][k] + dp[k][r] + nums[l]*nums[k]*nums[r]);
        }
    return dp[0][n-1];
}"""),
    327: ("Merge sort count", "O(n log n)", "O(n)", """
int countRangeSum(vector<int>& nums, int lower, int upper) {
    long ans = 0; vector<long> pre(nums.size()+1, 0);
    for (int i = 0; i < (int)nums.size(); i++) pre[i+1] = pre[i] + nums[i];
    function<void(int,int)> sortMerge = [&](int l, int r) {
        if (l >= r) return;
        int m = l + (r-l)/2; sortMerge(l,m); sortMerge(m+1,r);
        int j = m+1, k = m+1;
        for (int i = l; i <= m; i++) {
            while (j <= r && pre[j]-pre[i] < lower) j++;
            while (k <= r && pre[k]-pre[i] <= upper) k++;
            ans += k - j;
        }
        inplace_merge(pre.begin()+l, pre.begin()+m+1, pre.begin()+r+1);
    };
    sortMerge(0, (int)pre.size()-1); return (int)ans;
}"""),
    337: ("Tree DP", "O(n)", "O(h)", """
int rob(TreeNode* root) {
    function<pair<int,int>(TreeNode*)> dfs = [&](TreeNode* u) {
        if (!u) return make_pair(0, 0);
        auto L = dfs(u->left), R = dfs(u->right);
        int take = u->val + L.second + R.second;
        int skip = max(L.first, L.second) + max(R.first, R.second);
        return make_pair(take, skip);
    };
    auto p = dfs(root); return max(p.first, p.second);
}"""),
    371: ("XOR add", "O(1)", "O(1)", """
int getSum(int a, int b) {
    while (b) { unsigned carry = (unsigned)(a & b) << 1; a ^= b; b = (int)carry; }
    return a;
}"""),
    380: ("HashMap + vector", "O(1) avg", "O(n)", """
class RandomizedSet {
    vector<int> arr; unordered_map<int,int> idx;
public:
    bool insert(int val) {
        if (idx.count(val)) return false;
        idx[val] = arr.size(); arr.push_back(val); return true;
    }
    bool remove(int val) {
        if (!idx.count(val)) return false;
        int i = idx[val], last = arr.back();
        arr[i] = last; idx[last] = i; arr.pop_back(); idx.erase(val); return true;
    }
    int getRandom() { return arr[rand() % arr.size()]; }
};"""),
    392: ("Two pointers", "O(n)", "O(1)", """
bool isSubsequence(string s, string t) {
    int i = 0;
    for (char ch : t) if (i < (int)s.size() && s[i] == ch) i++;
    return i == (int)s.size();
}"""),
    394: ("Stack decode", "O(n)", "O(n)", """
string decodeString(string s) {
    stack<int> cnt; stack<string> st; string cur;
    for (int i = 0; i < (int)s.size(); i++) {
        if (isdigit(s[i])) {
            int k = 0; while (i < (int)s.size() && isdigit(s[i])) k = k*10 + (s[i++]-'0'); i--;
            cnt.push(k); st.push(cur); cur.clear();
        } else if (s[i] == '[') { /* noop */ }
        else if (s[i] == ']') {
            string prev = st.top(); st.pop(); int k = cnt.top(); cnt.pop();
            string rep; while (k--) rep += cur; cur = prev + rep;
        } else cur += s[i];
    }
    return cur;
}"""),
    406: ("Sort + insert", "O(n^2)", "O(n)", """
vector<vector<int>> reconstructQueue(vector<vector<int>>& people) {
    sort(people.begin(), people.end(), [](auto& a, auto& b) {
        return a[0] > b[0] || (a[0] == b[0] && a[1] < b[1]);
    });
    vector<vector<int>> ans;
    for (auto& p : people) ans.insert(ans.begin() + p[1], p);
    return ans;
}"""),
    421: ("Trie bits", "O(n*32)", "O(n)", """
class TrieNode { public: TrieNode* c[2]{}; };
class Solution {
    TrieNode* root = new TrieNode();
    void ins(int x) {
        TrieNode* u = root;
        for (int i = 31; i >= 0; i--) {
            int b = (x >> i) & 1;
            if (!u->c[b]) u->c[b] = new TrieNode();
            u = u->c[b];
        }
    }
    int best(int x) {
        TrieNode* u = root; int ans = 0;
        for (int i = 31; i >= 0; i--) {
            int b = (x >> i) & 1, want = 1 - b;
            if (u->c[want]) { ans |= 1 << i; u = u->c[want]; }
            else u = u->c[b];
        }
        return ans;
    }
public:
    int findMaximumXOR(vector<int>& nums) {
        int ans = 0; for (int x : nums) { ins(x); ans = max(ans, best(x)); }
        return ans;
    }
};"""),
    438: ("Freq window", "O(n)", "O(1)", """
vector<int> findAnagrams(string s, string p) {
    if (p.size() > s.size()) return {};
    vector<int> need(26), have(26), ans;
    for (char ch : p) need[ch-'a']++;
    for (int i = 0; i < (int)s.size(); i++) {
        have[s[i]-'a']++;
        if (i >= (int)p.size()) have[s[i-p.size()]-'a']--;
        if (i >= (int)p.size()-1 && have == need) ans.push_back(i - (int)p.size() + 1);
    }
    return ans;
}"""),
    449: ("Preorder BST", "O(n)", "O(n)", """
class Codec {
    void pre(TreeNode* u, string& s) {
        if (!u) return;
        s += to_string(u->val) + ",";
        pre(u->left, s); pre(u->right, s);
    }
    TreeNode* build(vector<int>& pre, int& i, long lo, long hi) {
        if (i >= (int)pre.size() || pre[i] < lo || pre[i] > hi) return nullptr;
        TreeNode* node = new TreeNode(pre[i++]);
        node->left = build(pre, i, lo, node->val);
        node->right = build(pre, i, node->val, hi);
        return node;
    }
public:
    string serialize(TreeNode* root) { string s; pre(root, s); return s; }
    TreeNode* deserialize(string data) {
        vector<int> pre; string cur;
        for (char ch : data) {
            if (ch == ',') { if (!cur.empty()) { pre.push_back(stoi(cur)); cur.clear(); } }
            else cur += ch;
        }
        if (!cur.empty()) pre.push_back(stoi(cur));
        int i = 0; return build(pre, i, LONG_MIN, LONG_MAX);
    }
};"""),
    450: ("BST delete", "O(h)", "O(h)", """
TreeNode* deleteNode(TreeNode* root, int key) {
    if (!root) return nullptr;
    if (key < root->val) root->left = deleteNode(root->left, key);
    else if (key > root->val) root->right = deleteNode(root->right, key);
    else {
        if (!root->left) return root->right;
        if (!root->right) return root->left;
        TreeNode* succ = root->right;
        while (succ->left) succ = succ->left;
        root->val = succ->val;
        root->right = deleteNode(root->right, succ->val);
    }
    return root;
}"""),
    451: ("Bucket sort freq", "O(n)", "O(n)", """
string frequencySort(string s) {
    int cnt[256] = {};
    for (char ch : s) cnt[(unsigned char)ch]++;
    vector<string> buckets(s.size()+1);
    for (int i = 0; i < 256; i++) if (cnt[i]) buckets[cnt[i]] += string(cnt[i], (char)i);
    string ans;
    for (int f = s.size(); f >= 1; f--) ans += buckets[f];
    return ans;
}"""),
    452: ("Greedy arrows", "O(n log n)", "O(1)", """
int findMinArrowShots(vector<vector<int>>& points) {
    sort(points.begin(), points.end(), [](auto& a, auto& b){ return a[1] < b[1]; });
    int ans = 0; long end = LLONG_MIN;
    for (auto& p : points) {
        if (p[0] > end) { ans++; end = p[1]; }
    }
    return ans;
}"""),
    472: ("Trie + DP", "O(n*L^2)", "O(n)", """
vector<string> findAllConcatenatedWordsInADict(vector<string>& words) {
    sort(words.begin(), words.end(), [](string& a, string& b){ return a.size() < b.size(); });
    unordered_set<string> dict; vector<string> ans;
    for (string& w : words) {
        if (w.empty()) continue;
        int n = w.size(); vector<char> dp(n+1, 0); dp[0] = 1;
        for (int i = 1; i <= n; i++)
            for (int j = max(0, i-20); j < i; j++)
                if (dp[j] && dict.count(w.substr(j, i-j))) { dp[i] = 1; break; }
        if (dp[n]) ans.push_back(w);
        dict.insert(w);
    }
    return ans;
}"""),
    493: ("Merge sort inv", "O(n log n)", "O(n)", """
int reversePairs(vector<int>& nums) {
    long ans = 0;
    function<void(int,int)> sortMerge = [&](int l, int r) {
        if (l >= r) return;
        int m = l + (r-l)/2; sortMerge(l,m); sortMerge(m+1,r);
        int j = m+1;
        for (int i = l; i <= m; i++) {
            while (j <= r && (long)nums[i] > 2LL*nums[j]) j++;
            ans += j - (m+1);
        }
        inplace_merge(nums.begin()+l, nums.begin()+m+1, nums.begin()+r+1);
    };
    sortMerge(0, (int)nums.size()-1); return (int)ans;
}"""),
    494: ("Subset sum DP", "O(n*sum)", "O(sum)", """
int findTargetSumWays(vector<int>& nums, int target) {
    int sum = accumulate(nums.begin(), nums.end(), 0);
    if ((target + sum) % 2 || abs(target) > sum) return 0;
    int need = (target + sum) / 2;
    vector<int> dp(need+1, 0); dp[0] = 1;
    for (int x : nums)
        for (int s = need; s >= x; s--) dp[s] += dp[s-x];
    return dp[need];
}"""),
    516: ("Interval DP", "O(n^2)", "O(n^2)", """
int longestPalindromeSubseq(string s) {
    int n = s.size(); vector<vector<int>> dp(n, vector<int>(n, 0));
    for (int i = 0; i < n; i++) dp[i][i] = 1;
    for (int len = 2; len <= n; len++)
        for (int l = 0; l + len - 1 < n; l++) {
            int r = l + len - 1;
            if (s[l] == s[r]) dp[l][r] = dp[l+1][r-1] + 2;
            else dp[l][r] = max(dp[l+1][r], dp[l][r-1]);
        }
    return dp[0][n-1];
}"""),
    523: ("Prefix mod map", "O(n)", "O(n)", """
bool checkSubarraySum(vector<int>& nums, int k) {
    unordered_map<int,int> mp{{0,-1}}; int sum = 0;
    for (int i = 0; i < (int)nums.size(); i++) {
        sum += nums[i];
        int rem = k ? sum % k : sum;
        if (mp.count(rem)) { if (i - mp[rem] >= 2) return true; }
        else mp[rem] = i;
    }
    return false;
}"""),
    525: ("Prefix index map", "O(n)", "O(n)", """
int findMaxLength(vector<int>& nums) {
    unordered_map<int,int> first{{0,-1}}; int sum = 0, ans = 0;
    for (int i = 0; i < (int)nums.size(); i++) {
        sum += nums[i] ? 1 : -1;
        if (first.count(sum)) ans = max(ans, i - first[sum]);
        else first[sum] = i;
    }
    return ans;
}"""),
    528: ("Prefix + binary search", "O(log n) pick", "O(n)", """
class Solution {
    vector<int> pre; int total;
public:
    Solution(vector<int>& w) {
        pre.resize(w.size()); total = 0;
        for (int i = 0; i < (int)w.size(); i++) total = pre[i] = total + w[i];
    }
    int pickIndex() {
        int r = rand() % total + 1;
        return lower_bound(pre.begin(), pre.end(), r) - pre.begin();
    }
};"""),
    540: ("Binary search single", "O(log n)", "O(1)", """
int singleNonDuplicate(vector<int>& nums) {
    int lo = 0, hi = (int)nums.size() - 1;
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (mid % 2 == 1) mid--;
        if (nums[mid] == nums[mid+1]) lo = mid + 2; else hi = mid;
    }
    return nums[lo];
}"""),
    543: ("Two DFS depths", "O(n)", "O(h)", """
int diameterOfBinaryTree(TreeNode* root) {
    int ans = 0;
    function<int(TreeNode*)> depth = [&](TreeNode* u) {
        if (!u) return 0;
        int L = depth(u->left), R = depth(u->right);
        ans = max(ans, L + R);
        return max(L, R) + 1;
    };
    depth(root); return ans;
}"""),
    567: ("Freq window", "O(n)", "O(1)", """
bool checkInclusion(string s1, string s2) {
    if (s1.size() > s2.size()) return false;
    vector<int> a(26), b(26);
    for (int i = 0; i < (int)s1.size(); i++) { a[s1[i]-'a']++; b[s2[i]-'a']++; }
    if (a == b) return true;
    for (int i = s1.size(); i < (int)s2.size(); i++) {
        b[s2[i]-'a']++; b[s2[i-s1.size()]-'a']--;
        if (a == b) return true;
    }
    return false;
}"""),
    572: ("Same tree check", "O(mn)", "O(h)", """
bool isSubtree(TreeNode* root, TreeNode* sub) {
    function<bool(TreeNode*,TreeNode*)> same = [&](TreeNode* a, TreeNode* b) {
        if (!a || !b) return a == b;
        return a->val == b->val && same(a->left,b->left) && same(a->right,b->right);
    };
    if (!root) return false;
    return same(root, sub) || isSubtree(root->left, sub) || isSubtree(root->right, sub);
}"""),
    643: ("Fixed window", "O(n)", "O(1)", """
double findMaxAverage(vector<int>& nums, int k) {
    int sum = 0;
    for (int i = 0; i < k; i++) sum += nums[i];
    int best = sum;
    for (int i = k; i < (int)nums.size(); i++) { sum += nums[i] - nums[i-k]; best = max(best, sum); }
    return (double)best / k;
}"""),
    647: ("Expand center", "O(n^2)", "O(1)", """
int countSubstrings(string s) {
    int n = s.size(), ans = 0;
    auto expand = [&](int l, int r) {
        while (l >= 0 && r < n && s[l] == s[r]) { ans++; l--; r++; }
    };
    for (int i = 0; i < n; i++) { expand(i,i); expand(i,i+1); }
    return ans;
}"""),
    658: ("Two pointers window", "O(log k + n)", "O(1)", """
vector<int> findClosestElements(vector<int>& arr, int k, int x) {
    int lo = 0, hi = (int)arr.size() - k;
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (x - arr[mid] > arr[mid + k] - x) lo = mid + 1; else hi = mid;
    }
    return vector<int>(arr.begin() + lo, arr.begin() + lo + k);
}"""),
    673: ("LIS count DP", "O(n^2)", "O(n)", """
int findNumberOfLIS(vector<int>& nums) {
    int n = nums.size(); vector<int> len(n,1), cnt(n,1);
    for (int i = 0; i < n; i++)
        for (int j = 0; j < i; j++)
            if (nums[j] < nums[i]) {
                if (len[j]+1 > len[i]) { len[i] = len[j]+1; cnt[i] = cnt[j]; }
                else if (len[j]+1 == len[i]) cnt[i] += cnt[j];
            }
    int best = *max_element(len.begin(), len.end()), ans = 0;
    for (int i = 0; i < n; i++) if (len[i] == best) ans += cnt[i];
    return ans;
}"""),
    678: ("Two scans", "O(n)", "O(1)", """
bool checkValidString(string s) {
    int lo = 0, hi = 0;
    for (char ch : s) {
        lo += (ch != ')'); hi += (ch != '(');
        if (hi < 0) return false;
        lo = max(lo, 0);
    }
    return lo == 0;
}"""),
    698: ("Backtrack + prune", "O(n*2^n)", "O(n)", """
bool canPartitionKSubsets(vector<int>& nums, int k) {
    int sum = accumulate(nums.begin(), nums.end(), 0);
    if (sum % k) return false;
    int target = sum / k;
    sort(nums.begin(), nums.end(), greater<int>());
    vector<int> buckets(k, 0);
    function<bool(int)> dfs = [&](int i) {
        if (i == (int)nums.size()) return true;
        for (int b = 0; b < k; b++) {
            if (b && buckets[b] == buckets[b-1]) continue;
            if (buckets[b] + nums[i] > target) continue;
            buckets[b] += nums[i];
            if (dfs(i+1)) return true;
            buckets[b] -= nums[i];
        }
        return false;
    };
    return dfs(0);
}"""),
    701: ("BST insert", "O(h)", "O(h)", """
TreeNode* insertIntoBST(TreeNode* root, int val) {
    if (!root) return new TreeNode(val);
    if (val < root->val) root->left = insertIntoBST(root->left, val);
    else root->right = insertIntoBST(root->right, val);
    return root;
}"""),
    724: ("Prefix balance", "O(n)", "O(1)", """
int pivotIndex(vector<int>& nums) {
    int total = accumulate(nums.begin(), nums.end(), 0), left = 0;
    for (int i = 0; i < (int)nums.size(); i++) {
        if (left == total - left - nums[i]) return i;
        left += nums[i];
    }
    return -1;
}"""),
    729: ("Sorted list overlap", "O(n^2)", "O(n)", """
class MyCalendar {
    vector<pair<int,int>> ev;
public:
    bool book(int start, int end) {
        for (auto& p : ev) if (max(p.first, start) < min(p.second, end)) return false;
        ev.push_back({start, end}); return true;
    }
};"""),
    767: ("Max heap rearrange", "O(n log k)", "O(k)", """
string reorganizeString(string s) {
    int cnt[26] = {}; for (char ch : s) cnt[ch-'a']++;
    priority_queue<pair<int,char>> pq;
    for (int i = 0; i < 26; i++) if (cnt[i]) pq.push({cnt[i], char('a'+i)});
    string ans;
    while (!pq.empty()) {
        auto top = pq.top(); pq.pop();
        int f = top.first; char ch = top.second;
        if (!ans.empty() && ans.back() == ch) {
            if (pq.empty()) return "";
            auto top2 = pq.top(); pq.pop();
            ans += top2.second;
            if (--top2.first) pq.push(top2);
            pq.push({f, ch});
        } else { ans += ch; if (--f) pq.push({f, ch}); }
    }
    return ans;
}"""),
    881: ("Two pointers", "O(n log n)", "O(1)", """
int numRescueBoats(vector<int>& people, int limit) {
    sort(people.begin(), people.end());
    int l = 0, r = (int)people.size()-1, ans = 0;
    while (l <= r) {
        ans++;
        if (people[l] + people[r] <= limit) l++;
        r--;
    }
    return ans;
}"""),
    904: ("Sliding window", "O(n)", "O(1)", """
int totalFruit(vector<int>& fruits) {
    unordered_map<int,int> cnt; int l = 0, ans = 0;
    for (int r = 0; r < (int)fruits.size(); r++) {
        cnt[fruits[r]]++;
        while ((int)cnt.size() > 2) { cnt[fruits[l]]--; if (!cnt[fruits[l]]) cnt.erase(fruits[l]); l++; }
        ans = max(ans, r - l + 1);
    }
    return ans;
}"""),
    921: ("Balance scan", "O(n)", "O(1)", """
int minAddToMakeValid(string s) {
    int bal = 0, add = 0;
    for (char ch : s) {
        if (ch == '(') bal++;
        else { if (!bal) add++; else bal--; }
    }
    return add + bal;
}"""),
    930: ("Prefix mod counts", "O(n)", "O(n)", """
int numSubarraysWithSum(vector<int>& nums, int goal) {
    auto atMost = [&](int g) {
        if (g < 0) return 0;
        long ans = 0; int l = 0, sum = 0;
        for (int r = 0; r < (int)nums.size(); r++) {
            sum += nums[r];
            while (sum > g) sum -= nums[l++];
            ans += r - l + 1;
        }
        return ans;
    };
    return (int)(atMost(goal) - atMost(goal - 1));
}"""),
    938: ("DFS range sum", "O(n)", "O(h)", """
int rangeSumBST(TreeNode* root, int low, int high) {
    if (!root) return 0;
    if (root->val < low) return rangeSumBST(root->right, low, high);
    if (root->val > high) return rangeSumBST(root->left, low, high);
    return root->val + rangeSumBST(root->left, low, high) + rangeSumBST(root->right, low, high);
}"""),
    986: ("Two pointers merge", "O(n+m)", "O(1)", """
vector<vector<int>> intervalIntersection(vector<vector<int>>& a, vector<vector<int>>& b) {
    vector<vector<int>> ans; int i = 0, j = 0;
    while (i < (int)a.size() && j < (int)b.size()) {
        int lo = max(a[i][0], b[j][0]), hi = min(a[i][1], b[j][1]);
        if (lo <= hi) ans.push_back({lo, hi});
        if (a[i][1] < b[j][1]) i++; else j++;
    }
    return ans;
}"""),
    992: ("atMost trick", "O(n)", "O(k)", """
int subarraysWithKDistinct(vector<int>& nums, int k) {
    auto atMost = [&](int x) {
        unordered_map<int,int> cnt; int l = 0, ans = 0;
        for (int r = 0; r < (int)nums.size(); r++) {
            cnt[nums[r]]++;
            while ((int)cnt.size() > x) { if (--cnt[nums[l]] == 0) cnt.erase(nums[l]); l++; }
            ans += r - l + 1;
        }
        return ans;
    };
    return atMost(k) - atMost(k-1);
}"""),
    1094: ("Diff array", "O(n)", "O(n)", """
bool carPooling(vector<vector<int>>& trips, int capacity) {
    vector<int> diff(1001, 0);
    for (auto& t : trips) { diff[t[1]] += t[0]; diff[t[2]] -= t[0]; }
    int cur = 0;
    for (int i = 0; i <= 1000; i++) { cur += diff[i]; if (cur > capacity) return false; }
    return true;
}"""),
    1248: ("Prefix mod parity", "O(n)", "O(n)", """
int numberOfSubarrays(vector<int>& nums, int k) {
    unordered_map<int,int> cnt{{0,1}}; int pref = 0, ans = 0;
    for (int x : nums) {
        pref ^= x & 1;
        ans += cnt[pref ^ (k & 1)];
        cnt[pref]++;
    }
    return ans;
}"""),
    1249: ("Stack remove", "O(n)", "O(n)", """
string minRemoveToMakeValid(string s) {
    string t; vector<int> st;
    for (int i = 0; i < (int)s.size(); i++) {
        if (s[i] == '(') { st.push_back(t.size()); t += s[i]; }
        else if (s[i] == ')') {
            if (!st.empty()) { st.pop_back(); t += s[i]; }
        } else t += s[i];
    }
    while (!st.empty()) { t.erase(st.back(), 1); st.pop_back(); }
    return t;
}"""),
    1353: ("Sort + heap", "O(n log n)", "O(n)", """
int maxEvents(vector<vector<int>>& events) {
    sort(events.begin(), events.end());
    priority_queue<int, vector<int>, greater<int>> pq;
    int i = 0, n = events.size(), day = 0, ans = 0;
    while (i < n || !pq.empty()) {
        if (pq.empty()) day = events[i][0];
        while (i < n && events[i][0] <= day) pq.push(events[i][1]), i++;
        pq.pop(); ans++;
        while (!pq.empty() && pq.top() < day) pq.pop();
        day++;
    }
    return ans;
}"""),
}

CUSTOM_SNIPPETS = {
    "ma-03": ("Euclidean GCD", "O(log min(a,b))", "O(1)", """
int gcd(int a, int b) {
    while (b) { int t = a % b; a = b; b = t; }
    return abs(a);
}
long long lcm(int a, int b) {
    return (long long)a / gcd(a, b) * b;
}"""),
    "pre-17": ("Prefix + hashmap", "O(n)", "O(n)", """
int maxSubArrayLen(vector<int>& nums, int k) {
    unordered_map<long long,int> first{{0,-1}};
    long long sum = 0; int ans = 0;
    for (int i = 0; i < (int)nums.size(); i++) {
        sum += nums[i];
        if (first.count(sum - k)) ans = max(ans, i - first[sum - k]);
        if (!first.count(sum)) first[sum] = i;
    }
    return ans;
}"""),
    "sg-15": ("Segment tree RMQ", "O(log n) query", "O(n)", """
class SegTree {
    int n; vector<int> tree;
    void build(vector<int>& a, int node, int l, int r) {
        if (l == r) { tree[node] = a[l]; return; }
        int m = (l + r) / 2;
        build(a, node*2, l, m); build(a, node*2+1, m+1, r);
        tree[node] = max(tree[node*2], tree[node*2+1]);
    }
    int query(int node, int l, int r, int ql, int qr) {
        if (qr < l || r < ql) return INT_MIN;
        if (ql <= l && r <= qr) return tree[node];
        int m = (l + r) / 2;
        return max(query(node*2, l, m, ql, qr), query(node*2+1, m+1, r, ql, qr));
    }
public:
    SegTree(vector<int>& a) {
        n = a.size(); tree.assign(4*n, INT_MIN);
        if (n) build(a, 1, 0, n-1);
    }
    int queryMax(int l, int r) { return query(1, 0, n-1, l, r); }
};"""),
    "sg-16": ("Lazy segtree", "O(log n)", "O(n)", """
class LazySeg {
    int n; vector<long long> sum, lazy;
    void push(int node, int l, int r) {
        if (!lazy[node]) return;
        sum[node] += lazy[node] * (r - l + 1);
        if (l != r) { lazy[node*2] += lazy[node]; lazy[node*2+1] += lazy[node]; }
        lazy[node] = 0;
    }
    void update(int node, int l, int r, int ql, int qr, long v) {
        push(node, l, r);
        if (qr < l || r < ql) return;
        if (ql <= l && r <= qr) { lazy[node] += v; push(node, l, r); return; }
        int m = (l + r) / 2;
        update(node*2, l, m, ql, qr, v); update(node*2+1, m+1, r, ql, qr, v);
        push(node*2, l, m); push(node*2+1, m+1, r);
        sum[node] = sum[node*2] + sum[node*2+1];
    }
    long query(int node, int l, int r, int ql, int qr) {
        push(node, l, r);
        if (qr < l || r < ql) return 0;
        if (ql <= l && r <= qr) return sum[node];
        int m = (l + r) / 2;
        return query(node*2, l, m, ql, qr) + query(node*2+1, m+1, r, ql, qr);
    }
public:
    LazySeg(vector<int>& a) {
        n = a.size(); sum.assign(4*n, 0); lazy.assign(4*n, 0);
        for (int i = 0; i < n; i++) update(1, 0, n-1, i, i, a[i]);
    }
    void rangeAdd(int l, int r, int v) { update(1, 0, n-1, l, r, v); }
    long rangeSum(int l, int r) { return query(1, 0, n-1, l, r); }
};"""),
}
