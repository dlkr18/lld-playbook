"""LC-number -> (approach_name, time, space, cpp_code) lookup for catalog bootstrap."""
SNIPPETS = {
    1: ("HashMap complement", "O(n)", "O(n)", """
vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int,int> mp;
    for (int i = 0; i < (int)nums.size(); i++) {
        if (mp.count(target - nums[i])) return {mp[target-nums[i]], i};
        mp[nums[i]] = i;
    } return {};
}"""),
    49: ("Sort/freq key grouping", "O(nk log k)", "O(nk)", """
vector<vector<string>> groupAnagrams(vector<string>& strs) {
    unordered_map<string, vector<string>> mp;
    for (string& s : strs) {
        string k = s; sort(k.begin(), k.end());
        mp[k].push_back(s);
    }
    vector<vector<string>> ans;
    for (auto& p : mp) ans.push_back(p.second);
    return ans;
}"""),
    347: ("Bucket sort by freq", "O(n)", "O(n)", """
vector<int> topKFrequent(vector<int>& nums, int k) {
    unordered_map<int,int> freq;
    for (int x : nums) freq[x]++;
    vector<vector<int>> buckets(nums.size()+1);
    for (auto& p : freq) buckets[p.second].push_back(p.first);
    vector<int> ans;
    for (int i = (int)buckets.size()-1; i >= 0 && (int)ans.size() < k; i--)
        for (int x : buckets[i]) { ans.push_back(x); if ((int)ans.size()==k) break; }
    return ans;
}"""),
    128: ("HashSet sequence heads", "O(n)", "O(n)", """
int longestConsecutive(vector<int>& nums) {
    unordered_set<int> st(nums.begin(), nums.end());
    int best = 0;
    for (int x : st) {
        if (st.count(x-1)) continue;
        int len = 1;
        while (st.count(x+len)) len++;
        best = max(best, len);
    } return best;
}"""),
    242: ("Freq array", "O(n)", "O(1)", """
bool isAnagram(string s, string t) {
    if (s.size() != t.size()) return false;
    int c[26] = {};
    for (char ch : s) c[ch-'a']++;
    for (char ch : t) if (--c[ch-'a'] < 0) return false;
    return true;
}"""),
    217: ("HashSet", "O(n)", "O(n)", """
bool containsDuplicate(vector<int>& nums) {
    unordered_set<int> s;
    for (int x : nums) if (!s.insert(x).second) return true;
    return false;
}"""),
    238: ("Prefix/suffix product", "O(n)", "O(1) out", """
vector<int> productExceptSelf(vector<int>& nums) {
    int n = nums.size(); vector<int> ans(n, 1);
    int p = 1; for (int i = 0; i < n; i++) { ans[i] = p; p *= nums[i]; }
    p = 1; for (int i = n-1; i >= 0; i--) { ans[i] *= p; p *= nums[i]; }
    return ans;
}"""),
    560: ("Prefix + hashmap", "O(n)", "O(n)", """
int subarraySum(vector<int>& nums, int k) {
    unordered_map<int,int> cnt{{0,1}}; int sum = 0, ans = 0;
    for (int x : nums) {
        sum += x; ans += cnt[sum-k]; cnt[sum]++;
    } return ans;
}"""),
    41: ("Index marking", "O(n)", "O(1)", """
int firstMissingPositive(vector<int>& nums) {
    int n = nums.size();
    for (int i = 0; i < n; i++)
        while (nums[i] > 0 && nums[i] <= n && nums[nums[i]-1] != nums[i])
            swap(nums[i], nums[nums[i]-1]);
    for (int i = 0; i < n; i++) if (nums[i] != i+1) return i+1;
    return n+1;
}"""),
    15: ("Sort + two pointers", "O(n^2)", "O(1)", """
vector<vector<int>> threeSum(vector<int>& nums) {
    sort(nums.begin(), nums.end()); vector<vector<int>> ans;
    for (int i = 0; i < (int)nums.size(); i++) {
        if (i && nums[i]==nums[i-1]) continue;
        int l = i+1, r = (int)nums.size()-1;
        while (l < r) {
            int s = nums[i]+nums[l]+nums[r];
            if (!s) { ans.push_back({nums[i],nums[l],nums[r]});
                while (l<r && nums[l]==nums[l+1]) l++;
                while (l<r && nums[r]==nums[r-1]) r--;
                l++; r--;
            } else if (s < 0) l++; else r--;
        }
    } return ans;
}"""),
    11: ("Two pointers greedy", "O(n)", "O(1)", """
int maxArea(vector<int>& h) {
    int l = 0, r = (int)h.size()-1, ans = 0;
    while (l < r) {
        ans = max(ans, min(h[l], h[r]) * (r-l));
        if (h[l] < h[r]) l++; else r--;
    } return ans;
}"""),
    76: ("Variable window", "O(n)", "O(1)", """
string minWindow(string s, string t) {
    vector<int> need(128), have(128);
    for (char c : t) need[c]++;
    int req = (int)t.size(), formed = 0, bestL = 0, bestLen = INT_MAX;
    for (int l = 0, r = 0; r < (int)s.size(); r++) {
        if (++have[s[r]] <= need[s[r]]) formed++;
        while (formed == req) {
            if (r-l+1 < bestLen) { bestLen = r-l+1; bestL = l; }
            if (--have[s[l]] < need[s[l]]) formed--;
            l++;
        }
    } return bestLen == INT_MAX ? "" : s.substr(bestL, bestLen);
}"""),
    3: ("Window + last index", "O(n)", "O(1)", """
int lengthOfLongestSubstring(string s) {
    int last[128]; fill(last, last+128, -1);
    int l = 0, ans = 0;
    for (int r = 0; r < (int)s.size(); r++) {
        if (last[s[r]] >= l) l = last[s[r]] + 1;
        last[s[r]] = r; ans = max(ans, r-l+1);
    } return ans;
}"""),
    704: ("Classic binary search", "O(log n)", "O(1)", """
int search(vector<int>& nums, int target) {
    int lo = 0, hi = (int)nums.size()-1;
    while (lo <= hi) {
        int mid = lo + (hi-lo)/2;
        if (nums[mid] == target) return mid;
        if (nums[mid] < target) lo = mid+1; else hi = mid-1;
    } return -1;
}"""),
    33: ("BS on rotated half", "O(log n)", "O(1)", """
int search(vector<int>& nums, int target) {
    int lo = 0, hi = (int)nums.size()-1;
    while (lo <= hi) {
        int mid = lo + (hi-lo)/2;
        if (nums[mid] == target) return mid;
        if (nums[lo] <= nums[mid]) {
            if (nums[lo] <= target && target < nums[mid]) hi = mid-1; else lo = mid+1;
        } else {
            if (nums[mid] < target && target <= nums[hi]) lo = mid+1; else hi = mid-1;
        }
    } return -1;
}"""),
    875: ("BS on answer", "O(n log m)", "O(1)", """
bool ok(int speed, vector<int>& piles, int h) {
    long long t = 0;
    for (int p : piles) t += (p + speed - 1) / speed;
    return t <= h;
}
int minEatingSpeed(vector<int>& piles, int h) {
    int lo = 1, hi = 1e9, ans = hi;
    while (lo <= hi) {
        int mid = lo + (hi-lo)/2;
        if (ok(mid, piles, h)) { ans = mid; hi = mid-1; } else lo = mid+1;
    } return ans;
}"""),
    78: ("Backtrack subsets", "O(n*2^n)", "O(n)", """
void dfs(int i, vector<int>& nums, vector<int>& cur, vector<vector<int>>& ans) {
    if (i == (int)nums.size()) { ans.push_back(cur); return; }
    dfs(i+1, nums, cur, ans);
    cur.push_back(nums[i]); dfs(i+1, nums, cur, ans); cur.pop_back();
}
vector<vector<int>> subsets(vector<int>& nums) {
    vector<vector<int>> ans; vector<int> cur; dfs(0, nums, cur, ans); return ans;
}"""),
    46: ("Backtrack permutations", "O(n*n!)", "O(n)", """
void dfs(vector<int>& nums, vector<int>& path, vector<int>& used, vector<vector<int>>& ans) {
    if ((int)path.size() == (int)nums.size()) { ans.push_back(path); return; }
    for (int i = 0; i < (int)nums.size(); i++) if (!used[i]) {
        used[i]=1; path.push_back(nums[i]); dfs(nums, path, used, ans);
        path.pop_back(); used[i]=0;
    }
}
vector<vector<int>> permute(vector<int>& nums) {
    vector<vector<int>> ans; vector<int> path, used(nums.size());
    dfs(nums, path, used, ans); return ans;
}"""),
    104: ("DFS depth", "O(n)", "O(h)", """
int maxDepth(TreeNode* root) {
    if (!root) return 0;
    return 1 + max(maxDepth(root->left), maxDepth(root->right));
}"""),
    206: ("Iterative reverse", "O(n)", "O(1)", """
ListNode* reverseList(ListNode* head) {
    ListNode* prev = nullptr;
    while (head) { ListNode* nxt = head->next; head->next = prev; prev = head; head = nxt; }
    return prev;
}"""),
    20: ("Stack matching", "O(n)", "O(n)", """
bool isValid(string s) {
    stack<char> st;
    for (char c : s) {
        if (c=='('||c=='['||c=='{') st.push(c);
        else {
            if (st.empty()) return false;
            char o = st.top(); st.pop();
            if ((c==')'&&o!='(')||(c==']'&&o!='[')||(c=='}'&&o!='{')) return false;
        }
    } return st.empty();
}"""),
    215: ("Quickselect", "O(n) avg", "O(1)", """
int findKthLargest(vector<int>& nums, int k) {
    int n = nums.size(), need = n-k;
    int lo = 0, hi = n-1;
    while (true) {
        int p = lo + (hi-lo)/2, i = lo, j = hi;
        swap(nums[p], nums[hi]);
        int pivot = nums[hi], store = lo;
        for (int t = lo; t < hi; t++) if (nums[t] < pivot) swap(nums[t], nums[store++]);
        swap(nums[store], nums[hi]);
        if (store == need) return nums[store];
        if (store < need) lo = store+1; else hi = store-1;
    }
}"""),
    56: ("Sort + merge", "O(n log n)", "O(n)", """
vector<vector<int>> merge(vector<vector<int>>& intervals) {
    sort(intervals.begin(), intervals.end());
    vector<vector<int>> ans;
    for (auto& iv : intervals) {
        if (ans.empty() || ans.back()[1] < iv[0]) ans.push_back(iv);
        else ans.back()[1] = max(ans.back()[1], iv[1]);
    } return ans;
}"""),
    55: ("Greedy farthest", "O(n)", "O(1)", """
bool canJump(vector<int>& nums) {
    int far = 0;
    for (int i = 0; i < (int)nums.size(); i++) {
        if (i > far) return false;
        far = max(far, i + nums[i]);
    } return true;
}"""),
    136: ("XOR all", "O(n)", "O(1)", """
int singleNumber(vector<int>& nums) {
    int x = 0; for (int v : nums) x ^= v; return x;
}"""),
    50: ("Fast pow", "O(log n)", "O(1)", """
double myPow(double x, int n) {
    long long N = n; if (N < 0) { x = 1/x; N = -N; }
    double ans = 1, cur = x;
    while (N) { if (N&1) ans *= cur; cur *= cur; N >>= 1; }
    return ans;
}"""),
    208: ("Trie insert/search", "O(m)", "O(n*m)", """
class Trie {
    Trie* ch[26]{}; bool end = false;
public:
    void insert(string w) {
        Trie* node = this;
        for (char c : w) { int i = c-'a'; if (!node->ch[i]) node->ch[i] = new Trie(); node = node->ch[i]; }
        node->end = true;
    }
    bool search(string w) { return find(w, true); }
    bool startsWith(string p) { return find(p, false); }
    bool find(string& w, bool full) {
        Trie* node = this;
        for (char c : w) { int i = c-'a'; if (!node->ch[i]) return false; node = node->ch[i]; }
        return !full || node->end;
    }
};"""),
    295: ("Two heaps median", "O(log n)", "O(n)", """
class MedianFinder {
    priority_queue<int> lo;
    priority_queue<int, vector<int>, greater<int>> hi;
public:
    void addNum(int num) {
        lo.push(num); hi.push(lo.top()); lo.pop();
        if (hi.size() > lo.size()) { lo.push(hi.top()); hi.pop(); }
    }
    double findMedian() {
        return lo.size() > hi.size() ? lo.top() : (lo.top() + hi.top()) / 2.0;
    }
};"""),
    307: ("Fenwick tree", "O(log n)", "O(n)", """
class NumArray {
    vector<int> bit; int n;
    void add(int i, int d) { for (++i; i <= n; i += i&-i) bit[i] += d; }
    int sum(int i) { int s = 0; for (++i; i > 0; i -= i&-i) s += bit[i]; return s; }
public:
    NumArray(vector<int>& nums) : n(nums.size()), bit(n+1) {
        for (int i = 0; i < n; i++) add(i, nums[i]);
    }
    void update(int index, int val) { add(index, val - sum(index) + sum(index-1)); }
    int sumRange(int l, int r) { return sum(r) - sum(l-1); }
};"""),
}

# Merge extended LC library
try:
    from snippets_lc2 import SNIPPETS_LC2
    SNIPPETS.update(SNIPPETS_LC2)
except ImportError:
    pass

try:
    from snippets_lc3 import SNIPPETS_LC3
    SNIPPETS.update(SNIPPETS_LC3)
except ImportError:
    pass

try:
    from snippets_lc4 import SNIPPETS_LC4, CUSTOM_SNIPPETS
    SNIPPETS.update(SNIPPETS_LC4)
except ImportError:
    CUSTOM_SNIPPETS = {}

try:
    from snippets_oa import CUSTOM_SNIPPETS as _OA_SNIPPETS
    CUSTOM_SNIPPETS.update(_OA_SNIPPETS)
except ImportError:
    pass

PATTERN_CODE = {
    "hashmap": ("HashMap", "O(n)", "O(n)", "unordered_map<int,int> mp;\n// Single pass: check complement/key before insert"),
    "hashset": ("HashSet", "O(n)", "O(n)", "unordered_set<int> st;\nfor (int x : nums) st.insert(x);"),
    "opposite": ("Two pointers", "O(n)", "O(1)", "int l=0, r=n-1;\nwhile (l<r) { /* move l or r based on condition */ }"),
    "variable-window": ("Sliding window", "O(n)", "O(1)", "for (int l=0, r=0; r<n; r++) {\n  // expand r, shrink l while invalid\n}"),
    "first-true": ("Binary search first true", "O(log n)", "O(1)", "int lo=0, hi=n-1, ans=n;\nwhile (lo<=hi) { int mid=lo+(hi-lo)/2; if (ok(mid)) { ans=mid; hi=mid-1; } else lo=mid+1; }"),
    "answer-space": ("BS on answer", "O(n log A)", "O(1)", "int lo=minAns, hi=maxAns;\nwhile (lo<=hi) { int mid=lo+(hi-lo)/2; if (feasible(mid)) { ans=mid; hi=mid-1; } else lo=mid+1; }"),
    "subsets": ("Backtracking subsets", "O(n*2^n)", "O(n)", "void dfs(int i) {\n  if (i==n) { save; return; }\n  dfs(i+1); pick i; dfs(i+1); unpick;\n}"),
    "permutations": ("Backtracking perms", "O(n*n!)", "O(n)", "void dfs() {\n  if (path.size()==n) { save; return; }\n  for unused i: pick, dfs, unpick;\n}"),
    "dfs": ("Tree DFS", "O(n)", "O(h)", "void dfs(TreeNode* u) {\n  if (!u) return;\n  dfs(u->left); dfs(u->right);\n}"),
    "bfs": ("Tree BFS", "O(n)", "O(n)", "queue<TreeNode*> q; q.push(root);\nwhile (!q.empty()) { auto u=q.front(); q.pop(); /* process */ }"),
    "reverse": ("Reverse list", "O(n)", "O(1)", "ListNode* prev=nullptr;\nwhile (head) { auto nxt=head->next; head->next=prev; prev=head; head=nxt; }"),
    "fast-slow": ("Floyd cycle", "O(n)", "O(1)", "ListNode *slow=head, *fast=head;\nwhile (fast&&fast->next) { slow=slow->next; fast=fast->next->next; }"),
    "monotonic": ("Monotonic stack", "O(n)", "O(n)", "stack<int> st;\nfor (int i=0;i<n;i++) {\n  while (!st.empty() && cond(st.top(), i)) st.pop();\n  st.push(i);\n}"),
    "trie": ("Trie", "O(m)", "O(n*m)", "struct Node { Node* c[26]{}; bool end; };\n// insert/search by walking characters"),
    "fenwick": ("Fenwick BIT", "O(log n)", "O(n)", "void add(int i,int v){ for(++i;i<=n;i+=i&-i) bit[i]+=v; }\nint sum(int i){ int s=0; for(++i;i>0;i-=i&-i) s+=bit[i]; return s; }"),
    "xor": ("XOR trick", "O(n)", "O(1)", "int x=0; for (int v: nums) x^=v; return x;"),
    "merge": ("Merge sorted", "O(n)", "O(1)", "ListNode dummy; ListNode* tail=&dummy;\nwhile (a&&b) { attach smaller; move tail; }"),
    "kadane": ("Kadane", "O(n)", "O(1)", "int best=nums[0], cur=nums[0];\nfor (int i=1;i<n;i++) { cur=max(nums[i], cur+nums[i]); best=max(best,cur); }"),
}


def get_snippet(lc, sub=None, fallback_name="Optimal"):
    if lc and lc in SNIPPETS:
        name, t, s, code = SNIPPETS[lc]
        return name, t, s, code
    if sub and sub in PATTERN_CODE:
        return PATTERN_CODE[sub]
    label = "LC %s" % lc if lc else sub or "pattern"
    return fallback_name, "O(n)", "O(n)", "// Pattern: %s\n// Implement optimal C++ for %s" % (sub or "general", label)
