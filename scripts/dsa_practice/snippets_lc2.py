"""Extended LC snippet library — merged into snippets.SNIPPETS."""
SNIPPETS_LC2 = {
    167: ("Two pointers", "O(n)", "O(1)", """
vector<int> twoSum(vector<int>& nums, int target) {
    int l = 0, r = (int)nums.size()-1;
    while (l < r) {
        int s = nums[l]+nums[r];
        if (s == target) return {l+1,r+1};
        if (s < target) l++; else r--;
    } return {};
}"""),
    209: ("Sliding window", "O(n)", "O(1)", """
int minSubArrayLen(int target, vector<int>& nums) {
    int l=0, sum=0, ans=INT_MAX;
    for (int r=0; r<(int)nums.size(); r++) {
        sum += nums[r];
        while (sum >= target) { ans=min(ans,r-l+1); sum -= nums[l++]; }
    } return ans==INT_MAX?0:ans;
}"""),
    1004: ("Sliding window", "O(n)", "O(1)", """
int longestOnes(vector<int>& nums, int k) {
    int l=0, zeros=0, ans=0;
    for (int r=0; r<(int)nums.size(); r++) {
        if (!nums[r]) zeros++;
        while (zeros > k) { if (!nums[l]) zeros--; l++; }
        ans = max(ans, r-l+1);
    } return ans;
}"""),
    424: ("Sliding window", "O(n)", "O(1)", """
int characterReplacement(string s, int k) {
    int cnt[26]={}, l=0, maxf=0, ans=0;
    for (int r=0; r<(int)s.size(); r++) {
        maxf = max(maxf, ++cnt[s[r]-'a']);
        while (r-l+1 - maxf > k) cnt[s[l++]-'a']--;
        ans = max(ans, r-l+1);
    } return ans;
}"""),
    75: ("Dutch flag", "O(n)", "O(1)", """
void sortColors(vector<int>& nums) {
    int lo=0, mid=0, hi=(int)nums.size()-1;
    while (mid <= hi) {
        if (!nums[mid]) swap(nums[lo++], nums[mid++]);
        else if (nums[mid]==2) swap(nums[mid], nums[hi--]);
        else mid++;
    }
}"""),
    125: ("Two pointers", "O(n)", "O(1)", """
bool isPalindrome(string s) {
    int l=0, r=(int)s.size()-1;
    while (l < r) {
        while (l<r && !isalnum(s[l])) l++;
        while (l<r && !isalnum(s[r])) r--;
        if (tolower(s[l]) != tolower(s[r])) return false;
        l++; r--;
    } return true;
}"""),
    26: ("Same direction", "O(n)", "O(1)", """
int removeDuplicates(vector<int>& nums) {
    if (nums.empty()) return 0;
    int w = 1;
    for (int i=1; i<(int)nums.size(); i++)
        if (nums[i] != nums[i-1]) nums[w++] = nums[i];
    return w;
}"""),
    35: ("Lower bound", "O(log n)", "O(1)", """
int searchInsert(vector<int>& nums, int target) {
    int lo=0, hi=(int)nums.size()-1;
    while (lo <= hi) {
        int mid = lo+(hi-lo)/2;
        if (nums[mid] >= target) hi = mid-1; else lo = mid+1;
    } return lo;
}"""),
    34: ("Two binary searches", "O(log n)", "O(1)", """
vector<int> searchRange(vector<int>& nums, int target) {
    auto lb = [&](bool first){
        int lo=0, hi=(int)nums.size()-1, ans=-1;
        while (lo<=hi) {
            int mid=lo+(hi-lo)/2;
            if (nums[mid]==target) { ans=mid; if (first) hi=mid-1; else lo=mid+1; }
            else if (nums[mid]<target) lo=mid+1; else hi=mid-1;
        } return ans;
    };
    return {lb(true), lb(false)};
}"""),
    153: ("BS rotated min", "O(log n)", "O(1)", """
int findMin(vector<int>& nums) {
    int lo=0, hi=(int)nums.size()-1;
    while (lo < hi) {
        int mid = lo+(hi-lo)/2;
        if (nums[mid] > nums[hi]) lo = mid+1; else hi = mid;
    } return nums[lo];
}"""),
    1011: ("BS capacity", "O(n log S)", "O(1)", """
bool ship(vector<int>& w, int days, int cap) {
    int d=1, cur=0;
    for (int x: w) { if (x>cap) return false; if (cur+x>cap) { d++; cur=0; } cur+=x; }
    return d<=days;
}
int shipWithinDays(vector<int>& weights, int days) {
    int lo=*max_element(weights.begin(), weights.end()), hi=accumulate(weights.begin(), weights.end(), 0);
    while (lo<hi) { int mid=lo+(hi-lo)/2; if (ship(weights,days,mid)) hi=mid; else lo=mid+1; }
    return lo;
}"""),
    39: ("Backtrack combo", "O(2^t)", "O(t)", """
void dfs(int i, int rem, vector<int>& cand, vector<int>& path, vector<vector<int>>& ans) {
    if (!rem) { ans.push_back(path); return; }
    if (i==(int)cand.size()) return;
    dfs(i+1, rem, cand, path, ans);
    if (cand[i] <= rem) { path.push_back(cand[i]); dfs(i, rem-cand[i], cand, path, ans); path.pop_back(); }
}
vector<vector<int>> combinationSum(vector<int>& candidates, int target) {
    vector<vector<int>> ans; vector<int> path; dfs(0,target,candidates,path,ans); return ans;
}"""),
    77: ("Backtrack nCk", "O(k*C(n,k))", "O(k)", """
void dfs(int start, int k, int n, vector<int>& path, vector<vector<int>>& ans) {
    if ((int)path.size()==k) { ans.push_back(path); return; }
    for (int i=start; i<=n; i++) { path.push_back(i); dfs(i+1,k,n,path,ans); path.pop_back(); }
}
vector<vector<int>> combine(int n, int k) {
    vector<vector<int>> ans; vector<int> path; dfs(1,k,n,path,ans); return ans;
}"""),
    22: ("Backtrack parens", "O(4^n/sqrt n)", "O(n)", """
void dfs(string& cur, int open, int close, int n, vector<string>& ans) {
    if ((int)cur.size()==2*n) { ans.push_back(cur); return; }
    if (open<n) { cur+='('; dfs(cur,open+1,close,n,ans); cur.pop_back(); }
    if (close<open) { cur+=')'; dfs(cur,open,close+1,n,ans); cur.pop_back(); }
}
vector<string> generateParenthesis(int n) {
    vector<string> ans; string cur; dfs(cur,0,0,n,ans); return ans;
}"""),
    79: ("Grid DFS backtrack", "O(mn*4^L)", "O(L)", """
bool dfs(vector<vector<char>>& b, string& w, int i, int j, int k) {
    if (k==(int)w.size()) return true;
    if (i<0||j<0||i>=(int)b.size()||j>=(int)b[0].size()||b[i][j]!=w[k]) return false;
    char tmp=b[i][j]; b[i][j]='#';
    bool ok = dfs(b,w,i+1,j,k+1)||dfs(b,w,i-1,j,k+1)||dfs(b,w,i,j+1,k+1)||dfs(b,w,i,j-1,k+1);
    b[i][j]=tmp; return ok;
}
bool exist(vector<vector<char>>& board, string word) {
    for (int i=0;i<(int)board.size();i++) for (int j=0;j<(int)board[0].size();j++)
        if (dfs(board,word,i,j,0)) return true;
    return false;
}"""),
    17: ("Phone backtrack", "O(4^n)", "O(n)", """
void dfs(string& digits, int i, string& path, vector<string>& ans, vector<string>& map) {
    if (i==(int)digits.size()) { ans.push_back(path); return; }
    for (char c : map[digits[i]-'2']) { path.push_back(c); dfs(digits,i+1,path,ans,map); path.pop_back(); }
}
vector<string> letterCombinations(string digits) {
    if (digits.empty()) return {};
    vector<string> map={"","","abc","def","ghi","jkl","mno","pqrs","tuv","wxyz"}, ans, path;
    dfs(digits,0,path,ans,map); return ans;
}"""),
    51: ("N-Queens", "O(n!)", "O(n)", """
bool ok(int r, int c, vector<int>& cols, vector<int>& diag1, vector<int>& diag2) {
    return !cols[c] && !diag1[r-c+n] && !diag2[r+c];
}
void dfs(int r, int n, vector<int>& cols, vector<int>& d1, vector<int>& d2, vector<string>& cur, vector<vector<string>>& ans) {
    if (r==n) { ans.push_back(cur); return; }
    for (int c=0;c<n;c++) if (ok(r,c,cols,d1,d2)) {
        cols[c]=d1[r-c+n]=d2[r+c]=1;
        cur[r][c]='Q'; dfs(r+1,n,cols,d1,d2,cur,ans); cur[r][c]='.';
        cols[c]=d1[r-c+n]=d2[r+c]=0;
    }
}
vector<vector<string>> solveNQueens(int n) {
    vector<vector<string>> ans; vector<string> cur(n,string(n,'.'));
    vector<int> cols(n), d1(2*n), d2(2*n); dfs(0,n,cols,d1,d2,cur,ans); return ans;
}"""),
    236: ("LCA DFS", "O(n)", "O(h)", """
TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
    if (!root || root==p || root==q) return root;
    auto L = lowestCommonAncestor(root->left,p,q);
    auto R = lowestCommonAncestor(root->right,p,q);
    if (L && R) return root;
    return L? L: R;
}"""),
    235: ("LCA BST", "O(h)", "O(1)", """
TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
    while (root) {
        if (p->val < root->val && q->val < root->val) root = root->left;
        else if (p->val > root->val && q->val > root->val) root = root->right;
        else return root;
    } return nullptr;
}"""),
    98: ("Validate BST", "O(n)", "O(h)", """
bool isValidBST(TreeNode* root, long long lo=LLONG_MIN, long long hi=LLONG_MAX) {
    if (!root) return true;
    if (root->val <= lo || root->val >= hi) return false;
    return isValidBST(root->left, lo, root->val) && isValidBST(root->right, root->val, hi);
}"""),
    230: ("Kth smallest BST", "O(h+k)", "O(h)", """
int kthSmallest(TreeNode* root, int k) {
    stack<TreeNode*> st; TreeNode* cur = root;
    while (cur || !st.empty()) {
        while (cur) { st.push(cur); cur = cur->left; }
        cur = st.top(); st.pop();
        if (--k == 0) return cur->val;
        cur = cur->right;
    } return -1;
}"""),
    102: ("Level order", "O(n)", "O(n)", """
vector<vector<int>> levelOrder(TreeNode* root) {
    vector<vector<int>> ans; if (!root) return ans;
    queue<TreeNode*> q; q.push(root);
    while (!q.empty()) {
        int sz=q.size(); vector<int> level;
        while (sz--) { auto u=q.front(); q.pop(); level.push_back(u->val);
            if (u->left) q.push(u->left); if (u->right) q.push(u->right); }
        ans.push_back(level);
    } return ans;
}"""),
    21: ("Merge lists", "O(n+m)", "O(1)", """
ListNode* mergeTwoLists(ListNode* a, ListNode* b) {
    ListNode dummy, *tail=&dummy;
    while (a && b) { if (a->val <= b->val) { tail->next=a; a=a->next; } else { tail->next=b; b=b->next; } tail=tail->next; }
    tail->next = a? a: b; return dummy.next;
}"""),
    141: ("Cycle detect", "O(n)", "O(1)", """
bool hasCycle(ListNode* head) {
    ListNode *slow=head, *fast=head;
    while (fast && fast->next) { slow=slow->next; fast=fast->next->next; if (slow==fast) return true; }
    return false;
}"""),
    142: ("Cycle start", "O(n)", "O(1)", """
ListNode* detectCycle(ListNode* head) {
    ListNode *slow=head, *fast=head;
    while (fast && fast->next) { slow=slow->next; fast=fast->next->next; if (slow==fast) break; }
    if (!fast || !fast->next) return nullptr;
    slow=head; while (slow!=fast) { slow=slow->next; fast=fast->next; } return slow;
}"""),
    19: ("Remove nth", "O(n)", "O(1)", """
ListNode* removeNthFromEnd(ListNode* head, int n) {
    ListNode dummy(0, head), *fast=&dummy, *slow=&dummy;
    for (int i=0;i<=n;i++) fast=fast->next;
    while (fast) { fast=fast->next; slow=slow->next; }
    slow->next = slow->next->next; return dummy.next;
}"""),
    143: ("Reorder list", "O(n)", "O(1)", """
ListNode* reorderList(ListNode* head) {
    if (!head) return head;
    ListNode *slow=head, *fast=head;
    while (fast->next && fast->next->next) { slow=slow->next; fast=fast->next->next; }
    ListNode* second = slow->next; slow->next=nullptr;
    ListNode *prev=nullptr, *cur=second;
    while (cur) { ListNode* nxt=cur->next; cur->next=prev; prev=cur; cur=nxt; }
    second=prev; ListNode* first=head;
    while (second) { ListNode *n1=first->next, *n2=second->next; first->next=second; second->next=n1; first=n1; second=n2; }
    return head;
}"""),
    138: ("Copy random list", "O(n)", "O(n)", """
Node* copyRandomList(Node* head) {
    if (!head) return nullptr;
    unordered_map<Node*,Node*> mp;
    for (Node* cur=head; cur; cur=cur->next) mp[cur]=new Node(cur->val);
    for (Node* cur=head; cur; cur=cur->next) { mp[cur]->next=mp[cur->next]; mp[cur]->random=mp[cur->random]; }
    return mp[head];
}"""),
    23: ("Merge k lists", "O(N log k)", "O(k)", """
ListNode* mergeKLists(vector<ListNode*>& lists) {
    auto cmp = [](ListNode* a, ListNode* b){ return a->val > b->val; };
    priority_queue<ListNode*, vector<ListNode*>, decltype(cmp)> pq(cmp);
    for (auto h: lists) if (h) pq.push(h);
    ListNode dummy, *tail=&dummy;
    while (!pq.empty()) { auto u=pq.top(); pq.pop(); tail->next=u; tail=u; if (u->next) pq.push(u->next); }
    return dummy.next;
}"""),
    155: ("Min stack", "O(1)", "O(n)", """
class MinStack {
    stack<pair<int,int>> st;
public:
    void push(int x) { int m=st.empty()? x: min(x,st.top().second); st.push({x,m}); }
    void pop() { st.pop(); }
    int top() { return st.top().first; }
    int getMin() { return st.top().second; }
};"""),
    739: ("Monotonic stack", "O(n)", "O(n)", """
vector<int> dailyTemperatures(vector<int>& T) {
    int n=T.size(); vector<int> ans(n); stack<int> st;
    for (int i=0;i<n;i++) {
        while (!st.empty() && T[i] > T[st.top()]) { ans[st.top()] = i-st.top(); st.pop(); }
        st.push(i);
    } return ans;
}"""),
    496: ("Next greater", "O(n)", "O(n)", """
vector<int> nextGreaterElement(vector<int>& nums1, vector<int>& nums2) {
    unordered_map<int,int> nge; stack<int> st;
    for (int x: nums2) { while (!st.empty() && x>st.top()) { nge[st.top()]=x; st.pop(); } st.push(x); }
    vector<int> ans; for (int x: nums1) ans.push_back(nge.count(x)? nge[x]: -1); return ans;
}"""),
    84: ("Histogram", "O(n)", "O(n)", """
int largestRectangleArea(vector<int>& h) {
    stack<int> st; int ans=0; h.push_back(0);
    for (int i=0;i<(int)h.size();i++) {
        while (!st.empty() && h[i]<h[st.top()]) {
            int height=h[st.top()]; st.pop();
            int width = st.empty()? i : i-st.top()-1;
            ans = max(ans, height*width);
        } st.push(i);
    } return ans;
}"""),
    253: ("Meeting rooms II", "O(n log n)", "O(n)", """
int minMeetingRooms(vector<vector<int>>& iv) {
    vector<int> start, end;
    for (auto& x: iv) { start.push_back(x[0]); end.push_back(x[1]); }
    sort(start.begin(), start.end()); sort(end.begin(), end.end());
    int rooms=0, e=0;
    for (int s: start) { if (s < end[e]) rooms++; else e++; }
    return rooms;
}"""),
    621: ("Task scheduler", "O(n)", "O(1)", """
int leastInterval(vector<char>& tasks, int n) {
    int cnt[26]={}; for (char c: tasks) cnt[c-'A']++;
    int mx=*max_element(cnt,cnt+26), same=0;
    for (int x: cnt) if (x==mx) same++;
    return max((int)tasks.size(), (mx-1)*(n+1)+same);
}"""),
    435: ("Non-overlapping", "O(n log n)", "O(1)", """
int eraseOverlapIntervals(vector<vector<int>>& iv) {
    sort(iv.begin(), iv.end(), [](auto& a, auto& b){ return a[1]<b[1]; });
    int end=INT_MIN, removed=0;
    for (auto& x: iv) if (x[0] < end) removed++; else end=x[1];
    return removed;
}"""),
    134: ("Gas station", "O(n)", "O(1)", """
int canCompleteCircuit(vector<int>& gas, vector<int>& cost) {
    int total=0, tank=0, start=0;
    for (int i=0;i<(int)gas.size();i++) {
        total += gas[i]-cost[i]; tank += gas[i]-cost[i];
        if (tank < 0) { start=i+1; tank=0; }
    } return total>=0? start: -1;
}"""),
    45: ("Jump game II", "O(n)", "O(1)", """
int jump(vector<int>& nums) {
    int jumps=0, curEnd=0, farthest=0;
    for (int i=0;i<(int)nums.size()-1;i++) {
        farthest=max(farthest, i+nums[i]);
        if (i==curEnd) { jumps++; curEnd=farthest; }
    } return jumps;
}"""),
    204: ("Sieve", "O(n log log n)", "O(n)", """
int countPrimes(int n) {
    if (n<=2) return 0; vector<bool> prime(n,true); prime[0]=prime[1]=false;
    for (int i=2;i*i<n;i++) if (prime[i]) for (int j=i*i;j<n;j+=i) prime[j]=false;
    return count(prime.begin(), prime.end(), true);
}"""),
    191: ("Popcount", "O(1)", "O(1)", """
int hammingWeight(uint32_t n) {
    int c=0; while (n) { n &= n-1; c++; } return c;
}"""),
    338: ("DP bits", "O(n)", "O(n)", """
vector<int> countBits(int n) {
    vector<int> dp(n+1);
    for (int i=1;i<=n;i++) dp[i]=dp[i>>1]+(i&1);
    return dp;
}"""),
    190: ("Reverse bits", "O(1)", "O(1)", """
uint32_t reverseBits(uint32_t n) {
    uint32_t ans=0;
    for (int i=0;i<32;i++) { ans=(ans<<1)|(n&1); n>>=1; }
    return ans;
}"""),
    268: ("XOR missing", "O(n)", "O(1)", """
int missingNumber(vector<int>& nums) {
    int x=nums.size(); for (int v: nums) x^=v; return x;
}"""),
    5: ("Expand center", "O(n^2)", "O(1)", """
string longestPalindrome(string s) {
    int bestL=0, bestLen=0;
    auto expand = [&](int l,int r){
        while (l>=0 && r<(int)s.size() && s[l]==s[r]) { l--; r++; }
        if (r-l-1 > bestLen) { bestLen=r-l-1; bestL=l+1; }
    };
    for (int i=0;i<(int)s.size();i++) { expand(i,i); expand(i,i+1); }
    return s.substr(bestL, bestLen);
}"""),
    139: ("Word break DP", "O(n^2)", "O(n)", """
bool wordBreak(string s, vector<string>& wordDict) {
    unordered_set<string> dict(wordDict.begin(), wordDict.end());
    int n=s.size(); vector<bool> dp(n+1); dp[0]=true;
    for (int i=1;i<=n;i++) for (int j=0;j<i;j++)
        if (dp[j] && dict.count(s.substr(j,i-j))) { dp[i]=true; break; }
    return dp[n];
}"""),
    72: ("Edit distance", "O(mn)", "O(n)", """
int minDistance(string a, string b) {
    int m=a.size(), n=b.size(); vector<int> prev(n+1), cur(n+1);
    iota(prev.begin(), prev.end(), 0);
    for (int i=1;i<=m;i++) {
        cur[0]=i;
        for (int j=1;j<=n;j++)
            cur[j]= a[i-1]==b[j-1]? prev[j-1] : 1+min({prev[j],cur[j-1],prev[j-1]});
        prev.swap(cur);
    } return prev[n];
}"""),
    211: ("Trie with dot", "O(m)", "O(n)", """
class WordDictionary {
    struct Node { Node* c[26]{}; bool end=false; } *root=new Node();
    bool dfs(string& w, int i, Node* node) {
        if (i==(int)w.size()) return node->end;
        if (w[i]=='.') { for (auto* ch: node->c) if (ch && dfs(w,i+1,ch)) return true; return false; }
        int k=w[i]-'a'; return node->c[k] && dfs(w,i+1,node->c[k]);
    }
public:
    void addWord(string word) { Node* n=root; for (char ch: word){ int k=ch-'a'; if(!n->c[k]) n->c[k]=new Node(); n=n->c[k]; } n->end=true; }
    bool search(string word) { return dfs(word,0,root); }
};"""),
    57: ("Insert interval", "O(n)", "O(n)", """
vector<vector<int>> insert(vector<vector<int>>& iv, vector<int>& nw) {
    vector<vector<int>> ans; int i=0, n=iv.size();
    while (i<n && iv[i][1]<nw[0]) ans.push_back(iv[i++]);
    while (i<n && iv[i][0]<=nw[1]) { nw[0]=min(nw[0],iv[i][0]); nw[1]=max(nw[1],iv[i][1]); i++; }
    ans.push_back(nw);
    while (i<n) ans.push_back(iv[i++]); return ans;
}"""),
    252: ("Meeting rooms I", "O(n log n)", "O(1)", """
bool canAttendMeetings(vector<vector<int>>& iv) {
    sort(iv.begin(), iv.end());
    for (int i=1;i<(int)iv.size();i++) if (iv[i][0]<iv[i-1][1]) return false;
    return true;
}"""),
    4: ("Median two arrays", "O(log min(m,n))", "O(1)", """
double findMedianSortedArrays(vector<int>& A, vector<int>& B) {
    if (A.size() > B.size()) swap(A,B);
    int m=A.size(), n=B.size(), lo=0, hi=m;
    while (lo <= hi) {
        int i=lo+(hi-lo)/2, j=(m+n+1)/2-i;
        int Aleft = i? A[i-1]: INT_MIN, Aright = i<m? A[i]: INT_MAX;
        int Bleft = j? B[j-1]: INT_MIN, Bright = j<n? B[j]: INT_MAX;
        if (Aleft <= Bright && Bleft <= Aright)
            return (m+n)%2? max(Aleft,Bleft) : (max(Aleft,Bleft)+min(Aright,Bright))/2.0;
        if (Aleft > Bright) hi=i-1; else lo=i+1;
    } return 0;
}"""),
    74: ("Search 2D matrix", "O(log mn)", "O(1)", """
bool searchMatrix(vector<vector<int>>& m, int t) {
    int lo=0, hi=(int)m.size()*m[0].size()-1;
    while (lo<=hi) {
        int mid=lo+(hi-lo)/2, r=mid/m[0].size(), c=mid%m[0].size();
        if (m[r][c]==t) return true;
        if (m[r][c]<t) lo=mid+1; else hi=mid-1;
    } return false;
}"""),
    53: ("Kadane", "O(n)", "O(1)", """
int maxSubArray(vector<int>& nums) {
    int best=nums[0], cur=nums[0];
    for (int i=1;i<(int)nums.size();i++) { cur=max(nums[i], cur+nums[i]); best=max(best,cur); }
    return best;
}"""),
    121: ("Stock I", "O(n)", "O(1)", """
int maxProfit(vector<int>& p) {
    int minP=INT_MAX, ans=0;
    for (int x: p) { minP=min(minP,x); ans=max(ans,x-minP); }
    return ans;
}"""),
    169: ("Boyer-Moore", "O(n)", "O(1)", """
int majorityElement(vector<int>& nums) {
    int cand=0, cnt=0;
    for (int x: nums) { if (!cnt) { cand=x; cnt=1; } else cnt += (x==cand? 1:-1); }
    return cand;
}"""),
    31: ("Next permutation", "O(n)", "O(1)", """
void nextPermutation(vector<int>& nums) {
    int i=(int)nums.size()-2;
    while (i>=0 && nums[i]>=nums[i+1]) i--;
    if (i>=0) { int j=(int)nums.size()-1; while (nums[j]<=nums[i]) j--; swap(nums[i],nums[j]); }
    reverse(nums.begin()+i+1, nums.end());
}"""),
    48: ("Rotate matrix", "O(n^2)", "O(1)", """
void rotate(vector<vector<int>>& m) {
    int n=m.size(); reverse(m.begin(), m.end());
    for (int i=0;i<n;i++) for (int j=i+1;j<n;j++) swap(m[i][j], m[j][i]);
}"""),
    73: ("Set matrix zeroes", "O(mn)", "O(1)", """
void setZeroes(vector<vector<int>>& m) {
    int m0=1, n0=1;
    for (int i=0;i<(int)m.size();i++) if (!m[i][0]) m0=0;
    for (int j=0;j<(int)m[0].size();j++) if (!m[0][j]) n0=0;
    for (int i=1;i<(int)m.size();i++) for (int j=1;j<(int)m[0].size();j++)
        if (!m[i][j]) { m[i][0]=0; m[0][j]=0; }
    for (int i=1;i<(int)m.size();i++) for (int j=1;j<(int)m[0].size();j++)
        if (!m[i][0] || !m[0][j]) m[i][j]=0;
    if (!m0) for (int i=0;i<(int)m.size();i++) m[i][0]=0;
    if (!n0) for (int j=0;j<(int)m[0].size();j++) m[0][j]=0;
}"""),
    124: ("Max path sum", "O(n)", "O(h)", """
int ans=INT_MIN;
int gain(TreeNode* u){ if(!u) return 0; int l=max(0,gain(u->left)), r=max(0,gain(u->right));
    ans=max(ans,u->val+l+r); return u->val+max(l,r); }
int maxPathSum(TreeNode* root){ gain(root); return ans; }"""),
    226: ("Invert tree", "O(n)", "O(h)", """
TreeNode* invertTree(TreeNode* root) {
    if (!root) return nullptr;
    swap(root->left, root->right);
    invertTree(root->left); invertTree(root->right);
    return root;
}"""),
    2: ("Add two numbers", "O(n)", "O(1)", """
ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {
    ListNode dummy(0), *tail=&dummy; int carry=0;
    while (l1||l2||carry) {
        int s=carry; if(l1){s+=l1->val; l1=l1->next;} if(l2){s+=l2->val; l2=l2->next;}
        tail->next=new ListNode(s%10); tail=tail->next; carry=s/10;
    } return dummy.next;
}"""),
    160: ("Intersection", "O(m+n)", "O(1)", """
ListNode* getIntersectionNode(ListNode* a, ListNode* b) {
    ListNode *p=a, *q=b;
    while (p!=q) { p=p? p->next: b; q=q? q->next: a; }
    return p;
}"""),
    152: ("Max product subarray", "O(n)", "O(1)", """
int maxProduct(vector<int>& nums) {
    int best=nums[0], curMax=nums[0], curMin=nums[0];
    for (int i=1;i<(int)nums.size();i++) {
        if (nums[i]<0) swap(curMax, curMin);
        curMax=max(nums[i], curMax*nums[i]); curMin=min(nums[i], curMin*nums[i]);
        best=max(best, curMax);
    } return best;
}"""),
    90: ("Subsets II", "O(n*2^n)", "O(n)", """
void dfs(int i, vector<int>& nums, vector<int>& path, vector<vector<int>>& ans) {
    if (i==(int)nums.size()) { ans.push_back(path); return; }
    dfs(i+1,nums,path,ans);
    path.push_back(nums[i]); dfs(i+1,nums,path,ans); path.pop_back();
    while (i+1<(int)nums.size() && nums[i+1]==nums[i]) i++;
}
vector<vector<int>> subsetsWithDup(vector<int>& nums) {
    sort(nums.begin(), nums.end()); vector<vector<int>> ans; vector<int> path;
    dfs(0,nums,path,ans); return ans;
}"""),
    47: ("Permutations II", "O(n*n!)", "O(n)", """
void dfs(vector<int>& nums, vector<int>& path, vector<int>& used, vector<vector<int>>& ans) {
    if ((int)path.size()==(int)nums.size()) { ans.push_back(path); return; }
    for (int i=0;i<(int)nums.size();i++) {
        if (used[i] || (i && nums[i]==nums[i-1] && !used[i-1])) continue;
        used[i]=1; path.push_back(nums[i]); dfs(nums,path,used,ans); path.pop_back(); used[i]=0;
    }
}
vector<vector<int>> permuteUnique(vector<int>& nums) {
    sort(nums.begin(), nums.end()); vector<vector<int>> ans; vector<int> path, used(nums.size());
    dfs(nums,path,used,ans); return ans;
}"""),
    763: ("Partition labels", "O(n)", "O(1)", """
vector<int> partitionLabels(string s) {
    int last[26]; for (int i=0;i<(int)s.size();i++) last[s[i]-'a']=i;
    vector<int> ans; int start=0, end=0;
    for (int i=0;i<(int)s.size();i++) {
        end=max(end, last[s[i]-'a']);
        if (i==end) { ans.push_back(end-start+1); start=i+1; }
    } return ans;
}"""),
    378: ("Kth in matrix", "O(k log n)", "O(n)", """
int kthSmallest(vector<vector<int>>& m, int k) {
    priority_queue<vector<int>, vector<vector<int>>, greater<>> pq;
    for (int i=0;i<(int)m.size();i++) pq.push({m[i][0],i,0});
    while (true) {
        auto t=pq.top(); pq.pop();
        if (--k==0) return t[0];
        if (t[2]+1<(int)m[t[1]].size()) pq.push({m[t[1]][t[2]+1], t[1], t[2]+1});
    }
}"""),
    973: ("K closest points", "O(n log k)", "O(k)", """
vector<vector<int>> kClosest(vector<vector<int>>& pts, int k) {
    priority_queue<vector<int>> pq;
    for (auto& p: pts) {
        int d=p[0]*p[0]+p[1]*p[1];
        pq.push({d,p[0],p[1]});
        if ((int)pq.size()>k) pq.pop();
    }
    vector<vector<int>> ans;
    while (!pq.empty()) { auto t=pq.top(); pq.pop(); ans.push_back({t[1],t[2]}); }
    return ans;
}"""),
    912: ("Merge sort", "O(n log n)", "O(n)", """
void ms(vector<int>& a, int l, int r, vector<int>& tmp) {
    if (l>=r) return; int mid=l+(r-l)/2; ms(a,l,mid,tmp); ms(a,mid+1,r,tmp);
    int i=l,j=mid+1,k=l; while(i<=mid&&j<=r) tmp[k++]= a[i]<=a[j]? a[i++]: a[j++];
    while(i<=mid) tmp[k++]=a[i++]; while(j<=r) tmp[k++]=a[j++];
    for (int t=l;t<=r;t++) a[t]=tmp[t];
}
vector<int> sortArray(vector<int>& nums) { vector<int> tmp(nums.size()); ms(nums,0,(int)nums.size()-1,tmp); return nums; }"""),
    148: ("Merge sort list", "O(n log n)", "O(log n)", """
ListNode* sortList(ListNode* head) {
    if (!head || !head->next) return head;
    ListNode *slow=head, *fast=head, *prev=nullptr;
    while (fast && fast->next) { prev=slow; slow=slow->next; fast=fast->next->next; }
    prev->next=nullptr;
    ListNode* a=sortList(head); ListNode* b=sortList(slow);
    ListNode dummy, *tail=&dummy;
    while (a&&b) { if (a->val<=b->val){tail->next=a;a=a->next;} else {tail->next=b;b=b->next;} tail=tail->next; }
    tail->next=a?a:b; return dummy.next;
}"""),
    179: ("Largest number", "O(n log n)", "O(n)", """
string largestNumber(vector<int>& nums) {
    vector<string> s; for (int x: nums) s.push_back(to_string(x));
    sort(s.begin(), s.end(), [](string& a, string& b){ return a+b > b+a; });
    if (s[0]=="0") return "0";
    string ans; for (auto& x: s) ans+=x; return ans;
}"""),
    315: ("Merge sort count", "O(n log n)", "O(n)", """
void mergeCount(vector<int>& nums, int l, int r, vector<int>& tmp, vector<int>& ans) {
    if (l>=r) return; int mid=l+(r-l)/2; mergeCount(nums,l,mid,tmp,ans); mergeCount(nums,mid+1,r,tmp,ans);
    int i=l,j=mid+1,k=l; while(i<=mid&&j<=r){ if(nums[i]<=nums[j]) tmp[k++]=nums[i++]; else { ans[i]+=r-j+1; tmp[k++]=nums[j++]; } }
    while(i<=mid) tmp[k++]=nums[i++]; while(j<=r) tmp[k++]=nums[j++];
    for(int t=l;t<=r;t++) nums[t]=tmp[t];
}
vector<int> countSmaller(vector<int>& nums) {
    vector<int> ans(nums.size()), tmp(nums.size()); mergeCount(nums,0,(int)nums.size()-1,tmp,ans); return ans;
}"""),
}
