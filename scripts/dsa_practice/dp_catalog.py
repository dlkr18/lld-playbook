from _helpers import q, ex, approach

DP_QUESTIONS = [
    # ---- 1D DP (10) ----
    q("dp-001", "Climbing Stairs", 70, "must", "1d", "Easy",
      ["1 <= n <= 45"], [ex("n = 3", "3", "1+1+1, 1+2, 2+1")],
      [approach("Fibonacci tabulation", "O(n)", "O(1)", """
int climbStairs(int n) {
    if (n <= 2) return n;
    int a = 1, b = 2;
    for (int i = 3; i <= n; i++) { int c = a + b; a = b; b = c; }
    return b;
}""")]),

    q("dp-002", "Min Cost Climbing Stairs", 746, "must", "1d", "Easy",
      ["2 <= cost.length <= 1000"], [ex("cost = [10,15,20]", "15")],
      [approach("1D DP from end", "O(n)", "O(1)", """
int minCostClimbingStairs(vector<int>& cost) {
    int n = cost.size(), a = 0, b = 0;
    for (int i = 2; i <= n; i++) {
        int c = min(a + cost[i-2], b + cost[i-1]);
        a = b; b = c;
    } return b;
}""")]),

    q("dp-003", "House Robber", 198, "must", "1d", "Medium",
      ["1 <= nums.length <= 100"], [ex("nums = [2,7,9,3,1]", "12")],
      [approach("Take / skip adjacent", "O(n)", "O(1)", """
int rob(vector<int>& nums) {
    int prev2 = 0, prev1 = 0;
    for (int x : nums) {
        int cur = max(prev1, prev2 + x);
        prev2 = prev1; prev1 = cur;
    } return prev1;
}""")]),

    q("dp-004", "House Robber II", 213, "must", "1d", "Medium",
      ["circular street — first and last adjacent"], [ex("nums = [2,3,2]", "3")],
      [approach("Rob [0..n-2] and [1..n-1]", "O(n)", "O(1)", """
int robRange(vector<int>& nums, int l, int r) {
    int a = 0, b = 0;
    for (int i = l; i <= r; i++) { int c = max(b, a + nums[i]); a = b; b = c; }
    return b;
}
int rob(vector<int>& nums) {
    int n = nums.size();
    if (n == 1) return nums[0];
    return max(robRange(nums, 0, n-2), robRange(nums, 1, n-1));
}""")]),

    q("dp-005", "Decode Ways", 91, "must", "1d", "Medium",
      ["s contains digits only", "no leading zeros in pairs"],
      [ex("s = \"226\"", "3")],
      [approach("DP like climbing stairs", "O(n)", "O(1)", """
int numDecodings(string s) {
    if (s.empty() || s[0]=='0') return 0;
    int n = s.size(), prev2 = 1, prev1 = 1;
    for (int i = 1; i < n; i++) {
        int cur = 0;
        if (s[i] != '0') cur = prev1;
        int two = (s[i-1]-'0')*10 + (s[i]-'0');
        if (two >= 10 && two <= 26) cur += prev2;
        prev2 = prev1; prev1 = cur;
    } return prev1;
}""")]),

    q("dp-006", "Word Break", 139, "must", "1d", "Medium",
      ["1 <= s.length <= 300", "dictionary words reused"],
      [ex("s=\"leetcode\", wordDict=[\"leet\",\"code\"]", "true")],
      [approach("dp[i] = prefix breakable", "O(n^2 + nk)", "O(n)", """
bool wordBreak(string s, vector<string>& wordDict) {
    unordered_set<string> dict(wordDict.begin(), wordDict.end());
    int n = s.size(); vector<bool> dp(n+1); dp[0] = true;
    for (int i = 1; i <= n; i++)
        for (int j = 0; j < i; j++)
            if (dp[j] && dict.count(s.substr(j, i-j))) { dp[i] = true; break; }
    return dp[n];
}""")]),

    q("dp-007", "Coin Change", 322, "must", "1d", "Medium",
      ["unbounded coin supply"], [ex("coins=[1,2,5], amount=11", "3")],
      [approach("Unbounded knapsack 1D", "O(n*amount)", "O(amount)", """
int coinChange(vector<int>& coins, int amount) {
    vector<int> dp(amount+1, amount+1); dp[0] = 0;
    for (int a = 1; a <= amount; a++)
        for (int c : coins) if (c <= a) dp[a] = min(dp[a], dp[a-c]+1);
    return dp[amount] > amount ? -1 : dp[amount];
}""")]),

    q("dp-008", "Longest Increasing Subsequence", 300, "must", "1d", "Medium",
      ["O(n log n) expected in interviews"], [ex("nums = [10,9,2,5,3,7,101,18]", "4")],
      [approach("Patience sorting + lower_bound", "O(n log n)", "O(n)", """
int lengthOfLIS(vector<int>& nums) {
    vector<int> tails;
    for (int x : nums) {
        auto it = lower_bound(tails.begin(), tails.end(), x);
        if (it == tails.end()) tails.push_back(x);
        else *it = x;
    } return tails.size();
}"""),
       approach("O(n^2) DP", "O(n^2)", "O(n)", """
int lengthOfLIS(vector<int>& nums) {
    int n = nums.size(), ans = 1; vector<int> dp(n, 1);
    for (int i = 1; i < n; i++)
        for (int j = 0; j < i; j++)
            if (nums[j] < nums[i]) dp[i] = max(dp[i], dp[j]+1);
    for (int x : dp) ans = max(ans, x);
    return ans;
}""")]),

    q("dp-009", "Partition Equal Subset Sum", 416, "must", "1d", "Medium",
      ["0/1 knapsack to target sum/2"], [ex("nums = [1,5,11,5]", "true")],
      [approach("Subset sum DP", "O(n*sum)", "O(sum)", """
bool canPartition(vector<int>& nums) {
    int sum = accumulate(nums.begin(), nums.end(), 0);
    if (sum % 2) return false;
    int target = sum/2; vector<bool> dp(target+1); dp[0] = true;
    for (int x : nums)
        for (int j = target; j >= x; j--)
            dp[j] |= dp[j-x];
    return dp[target];
}""")]),

    q("dp-010", "Maximum Subarray (Kadane)", 53, "must", "1d", "Medium",
      ["at least one element"], [ex("nums = [-2,1,-3,4,-1,2,1,-5,4]", "6")],
      [approach("Kadane's algorithm", "O(n)", "O(1)", """
int maxSubArray(vector<int>& nums) {
    int best = nums[0], cur = nums[0];
    for (int i = 1; i < (int)nums.size(); i++) {
        cur = max(nums[i], cur + nums[i]);
        best = max(best, cur);
    } return best;
}""")]),

    # ---- Knapsack (8) ----
    q("dp-011", "0/1 Knapsack (classic)", None, "must", "knapsack", "Medium",
      ["n items, capacity W", "each item once"],
      [ex("weights=[1,3,4,5], values=[1,4,5,7], W=7", "9")],
      [approach("2D → 1D rolling", "O(nW)", "O(W)", """
int knapsack01(vector<int>& wt, vector<int>& val, int W) {
    vector<int> dp(W+1);
    for (int i = 0; i < (int)wt.size(); i++)
        for (int w = W; w >= wt[i]; w--)
            dp[w] = max(dp[w], dp[w-wt[i]] + val[i]);
    return dp[W];
}""")]),

    q("dp-012", "Target Sum", 494, "must", "knapsack", "Medium",
      ["assign +/- to reach target"], [ex("nums=[1,1,1,1,1], target=3", "5")],
      [approach("Subset sum count", "O(n*sum)", "O(sum)", """
int findTargetSumWays(vector<int>& nums, int target) {
    int sum = accumulate(nums.begin(), nums.end(), 0);
    if ((target + sum) % 2 || abs(target) > sum) return 0;
    int t = (target + sum)/2;
    vector<int> dp(t+1); dp[0] = 1;
    for (int x : nums)
        for (int j = t; j >= x; j--)
            dp[j] += dp[j-x];
    return dp[t];
}""")]),

    q("dp-013", "Ones and Zeroes", 474, "should", "knapsack", "Medium",
      ["2D knapsack: m zeros, n ones"], [ex("strs=[\"10\",\"0001\"], m=1, n=1", "2")],
      [approach("2D capacity DP", "O(Lmn)", "O(mn)", """
int findMaxForm(vector<string>& strs, int m, int n) {
    vector<vector<int>> dp(m+1, vector<int>(n+1));
    for (auto& s : strs) {
        int z = count(s.begin(), s.end(), '0'), o = s.size()-z;
        for (int i = m; i >= z; i--)
            for (int j = n; j >= o; j--)
                dp[i][j] = max(dp[i][j], dp[i-z][j-o]+1);
    } return dp[m][n];
}""")]),

    q("dp-014", "Last Stone Weight II", 1049, "should", "knapsack", "Medium",
      ["partition stones min diff"], [ex("stones = [2,7,4,1,8,1]", "1")],
      [approach("Subset sum closest to half", "O(n*sum)", "O(sum)", """
int lastStoneWeightII(vector<int>& stones) {
    int sum = accumulate(stones.begin(), stones.end(), 0);
    vector<bool> dp(sum/2+1); dp[0] = true;
    for (int x : stones)
        for (int j = sum/2; j >= x; j--) dp[j] |= dp[j-x];
    for (int s = sum/2; s >= 0; s--) if (dp[s]) return sum - 2*s;
    return 0;
}""")]),

    q("dp-015", "Coin Change II", 518, "must", "knapsack", "Medium",
      ["count combinations", "unbounded"], [ex("amount=5, coins=[1,2,5]", "4")],
      [approach("Unbounded count DP", "O(n*amount)", "O(amount)", """
int change(int amount, vector<int>& coins) {
    vector<long long> dp(amount+1); dp[0] = 1;
    for (int c : coins)
        for (int a = c; a <= amount; a++)
            dp[a] += dp[a-c];
    return (int)dp[amount];
}""")]),

    q("dp-016", "Perfect Squares", 279, "should", "knapsack", "Medium",
      ["min squares summing to n"], [ex("n = 12", "3 (4+4+4)")],
      [approach("Unbounded min DP", "O(n sqrt n)", "O(n)", """
int numSquares(int n) {
    vector<int> dp(n+1, n);
    dp[0] = 0;
    for (int i = 1; i <= n; i++)
        for (int j = 1; j*j <= i; j++)
            dp[i] = min(dp[i], dp[i-j*j]+1);
    return dp[n];
}""")]),

    q("dp-017", "Combination Sum IV", 377, "should", "knapsack", "Medium",
      ["order matters — permutations"], [ex("nums=[1,2,3], target=4", "7")],
      [approach("Permutation DP", "O(n*target)", "O(target)", """
int combinationSum4(vector<int>& nums, int target) {
    vector<unsigned> dp(target+1); dp[0] = 1;
    for (int t = 1; t <= target; t++)
        for (int x : nums) if (x <= t) dp[t] += dp[t-x];
    return dp[target];
}""")]),

    q("dp-018", "Partition to K Equal Sum Subsets", 698, "should", "knapsack", "Medium",
      ["k equal-sum groups"], [ex("nums=[4,3,2,3,5,2,1], k=4", "true")],
      [approach("Backtracking + bitmask/pruning", "O(k*2^n)", "O(n)", """
bool canPartitionKSubsets(vector<int>& nums, int k) {
    int sum = accumulate(nums.begin(), nums.end(), 0);
    if (sum % k) return false;
    int target = sum/k; sort(nums.rbegin(), nums.rend());
    vector<bool> used(nums.size());
    function<bool(int,int,int)> dfs = [&](int start, int groups, int cur) {
        if (groups == k-1) return true;
        if (cur == target) return dfs(0, groups+1, 0);
        for (int i = start; i < (int)nums.size(); i++) {
            if (used[i] || cur+nums[i] > target) continue;
            used[i] = true;
            if (dfs(i+1, groups, cur+nums[i])) return true;
            used[i] = false;
            if (!cur) break;
        } return false;
    };
    return dfs(0, 0, 0);
}""")]),

    # ---- LCS family (8) ----
    q("dp-019", "Longest Common Subsequence", 1143, "must", "lcs", "Medium",
      ["subsequence not substring"], [ex("text1=\"abcde\", text2=\"ace\"", "3")],
      [approach("2D tabulation", "O(mn)", "O(min(m,n))", """
int longestCommonSubsequence(string a, string b) {
    int m=a.size(), n=b.size();
    vector<int> prev(n+1), cur(n+1);
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++)
            cur[j] = (a[i-1]==b[j-1]) ? prev[j-1]+1 : max(prev[j], cur[j]);
        prev.swap(cur);
    } return prev[n];
}""")]),

    q("dp-020", "Edit Distance", 72, "must", "lcs", "Medium",
      ["insert, delete, replace cost 1"], [ex("word1=\"horse\", word2=\"ros\"", "3")],
      [approach("Levenshtein DP", "O(mn)", "O(min(m,n))", """
int minDistance(string s1, string s2) {
    int m=s1.size(), n=s2.size();
    vector<int> prev(n+1), cur(n+1);
    iota(prev.begin(), prev.end(), 0);
    for (int i = 1; i <= m; i++) {
        cur[0] = i;
        for (int j = 1; j <= n; j++)
            if (s1[i-1]==s2[j-1]) cur[j] = prev[j-1];
            else cur[j] = 1 + min({prev[j], cur[j-1], prev[j-1]});
        prev.swap(cur);
    } return prev[n];
}""")]),

    q("dp-021", "Longest Palindromic Subsequence", 516, "must", "lcs", "Medium",
      ["LCS(s, reverse(s))"], [ex("s = \"bbbab\"", "4")],
      [approach("Interval DP on string", "O(n^2)", "O(n^2)", """
int longestPalindromeSubseq(string s) {
    int n=s.size(); vector<vector<int>> dp(n, vector<int>(n));
    for (int i=n-1;i>=0;i--){
        dp[i][i]=1;
        for (int j=i+1;j<n;j++)
            dp[i][j] = (s[i]==s[j]) ? dp[i+1][j-1]+2 : max(dp[i+1][j], dp[i][j-1]);
    } return dp[0][n-1];
}""")]),

    q("dp-022", "Longest Common Substring", None, "should", "lcs", "Medium",
      ["contiguous match only"], [ex("s1=\"abcde\", s2=\"abfce\"", "3 (abc)")],
      [approach("Reset on mismatch", "O(mn)", "O(n)", """
int longestCommonSubstring(string a, string b) {
    int m=a.size(), n=b.size(), best=0;
    vector<int> prev(n+1), cur(n+1);
    for (int i=1;i<=m;i++){
        for (int j=1;j<=n;j++)
            cur[j] = (a[i-1]==b[j-1]) ? prev[j-1]+1 : 0;
        best = max(best, *max_element(cur.begin(), cur.end()));
        prev.swap(cur);
    } return best;
}""")]),

    q("dp-023", "Delete Operation for Two Strings", 583, "should", "lcs", "Medium",
      ["min deletions to equal"], [ex("s=\"sea\", t=\"eat\"", "2")],
      [approach("m + n - 2*LCS", "O(mn)", "O(n)", """
int minDistance(string s, string t) {
    int m=s.size(), n=t.size();
    vector<int> prev(n+1), cur(n+1);
    for (int i=1;i<=m;i++){
        for (int j=1;j<=n;j++)
            cur[j]=(s[i-1]==t[j-1])?prev[j-1]+1:max(prev[j],cur[j]);
        prev.swap(cur);
    } return m+n-2*prev[n];
}""")]),

    q("dp-024", "Minimum ASCII Delete Sum", 712, "nice", "lcs", "Medium",
      ["delete cost = ASCII"], [ex("s1=\"sea\", s2=\"eat\"", "231")],
      [approach("Edit distance with char costs", "O(mn)", "O(n)", """
int minimumDeleteSum(string s1, string s2) {
    int m=s1.size(), n=s2.size();
    vector<int> prev(n+1), cur(n+1);
    for (int j=1;j<=n;j++) prev[j]=prev[j-1]+s2[j-1];
    for (int i=1;i<=m;i++){
        cur[0]=prev[0]+s1[i-1];
        for (int j=1;j<=n;j++)
            if (s1[i-1]==s2[j-1]) cur[j]=prev[j-1];
            else cur[j]=min(prev[j]+s1[i-1], cur[j-1]+s2[j-1]);
        prev.swap(cur);
    } return prev[n];
}""")]),

    q("dp-025", "Shortest Common Supersequence", 1092, "should", "lcs", "Hard",
      ["shortest string containing both"], [ex("str1=\"abac\", str2=\"cab\"", "cabac")],
      [approach("Build from LCS", "O(mn)", "O(mn)", """
string shortestCommonSupersequence(string a, string b) {
    int m=a.size(), n=b.size();
    vector<vector<int>> dp(m+1, vector<int>(n+1));
    for(int i=1;i<=m;i++) for(int j=1;j<=n;j++)
        dp[i][j]=(a[i-1]==b[j-1])?dp[i-1][j-1]+1:max(dp[i-1][j],dp[i][j-1]);
    string ans; int i=m,j=n;
    while(i&&j){
        if(a[i-1]==b[j-1]){ ans+=a[i-1]; i--; j--; }
        else if(dp[i-1][j]>=dp[i][j-1]) i--; else j--;
    } while(i--) ans+=a[i]; while(j--) ans+=b[j];
    reverse(ans.begin(), ans.end()); return ans;
}""")]),

    q("dp-026", "Distinct Subsequences", 115, "should", "lcs", "Hard",
      ["count t subseqs in s"], [ex("s=\"rabbbit\", t=\"rabbit\"", "3")],
      [approach("2D count DP", "O(mn)", "O(n)", """
int numDistinct(string s, string t) {
    int m=s.size(), n=t.size();
    vector<unsigned long long> prev(n+1), cur(n+1); prev[0]=1;
    for(int i=1;i<=m;i++){
        cur[0]=1;
        for(int j=1;j<=n;j++)
            cur[j]=prev[j]+(s[i-1]==t[j-1]?prev[j-1]:0);
        prev.swap(cur);
    } return (int)prev[n];
}""")]),

    # ---- Grid DP (7) ----
    q("dp-027", "Unique Paths", 62, "must", "grid", "Medium",
      ["only right/down moves"], [ex("m=3, n=7", "28")],
      [approach("2D combinatorics DP", "O(mn)", "O(n)", """
int uniquePaths(int m, int n) {
    vector<int> dp(n, 1);
    for (int i = 1; i < m; i++)
        for (int j = 1; j < n; j++)
            dp[j] += dp[j-1];
    return dp[n-1];
}""")]),

    q("dp-028", "Unique Paths II", 63, "must", "grid", "Medium",
      ["obstacles block cells"], [ex("grid with 0/1", "2")],
      [approach("Grid DP skip obstacles", "O(mn)", "O(n)", """
int uniquePathsWithObstacles(vector<vector<int>>& g) {
    int m=g.size(), n=g[0].size();
    if (g[0][0]||g[m-1][n-1]) return 0;
    vector<long long> dp(n); dp[0]=1;
    for(int i=0;i<m;i++){
        for(int j=0;j<n;j++){
            if(g[i][j]) dp[j]=0;
            else if(j) dp[j]+=dp[j-1];
        }
    } return (int)dp[n-1];
}""")]),

    q("dp-029", "Minimum Path Sum", 64, "must", "grid", "Medium",
      ["non-negative grid"], [ex("grid=[[1,3,1],[1,5,1]]", "7")],
      [approach("In-place or rolling row", "O(mn)", "O(1) in-place", """
int minPathSum(vector<vector<int>>& grid) {
    int m=grid.size(), n=grid[0].size();
    for(int i=0;i<m;i++) for(int j=0;j<n;j++){
        if(i==0&&j==0) continue;
        int up=i?grid[i-1][j]:INT_MAX, left=j?grid[i][j-1]:INT_MAX;
        grid[i][j]+=min(up,left);
    } return grid[m-1][n-1];
}""")]),

    q("dp-030", "Maximal Square", 221, "must", "grid", "Medium",
      ["largest 1-square"], [ex("matrix of 0/1", "1")],
      [approach("dp[i][j] = side length", "O(mn)", "O(n)", """
int maximalSquare(vector<vector<char>>& matrix) {
    int m=matrix.size(), n=m?matrix[0].size():0, best=0;
    vector<int> prev(n+1), cur(n+1);
    for(int i=1;i<=m;i++){
        for(int j=1;j<=n;j++){
            if(matrix[i-1][j-1]=='1'){
                cur[j]=1+min({prev[j],cur[j-1],prev[j-1]});
                best=max(best,cur[j]);
            } else cur[j]=0;
        } prev.swap(cur);
    } return best*best;
}""")]),

    q("dp-031", "Triangle", 120, "should", "grid", "Medium",
      ["min path top to bottom"], [ex("triangle=[[2],[3,4]]", "5")],
      [approach("Bottom-up 1D", "O(n^2)", "O(n)", """
int minimumTotal(vector<vector<int>>& t) {
    vector<int> dp = t.back();
    for (int i = (int)t.size()-2; i >= 0; i--)
        for (int j = 0; j <= i; j++)
            dp[j] = t[i][j] + min(dp[j], dp[j+1]);
    return dp[0];
}""")]),

    q("dp-032", "Dungeon Game", 174, "should", "grid", "Hard",
      ["min initial health"], [ex("negative/positive rooms", "7")],
      [approach("Reverse grid DP", "O(mn)", "O(n)", """
int calculateMinimumHP(vector<vector<int>>& d) {
    int m=d.size(), n=d[0].size();
    vector<int> dp(n+1, INT_MAX); dp[n-1]=1;
    for(int i=m-1;i>=0;i--)
        for(int j=n-1;j>=0;j--){
            int need = min(dp[j], dp[j+1]) - d[i][j];
            dp[j] = max(1, need);
        }
    return dp[0];
}""")]),

    q("dp-033", "Cherry Pickup", 741, "nice", "grid", "Hard",
      ["two paths same grid"], [ex("grid with cherries/thorns", "max cherries")],
      [approach("DP on (r1,c1,r2,c2)", "O(n^4)", "O(n^4)", """
int cherryPickup(vector<vector<int>>& grid) {
    int n=grid.size(); if(grid[0][0]<0||grid[n-1][n-1]<0) return 0;
    vector<vector<vector<vector<int>>>> dp(n, vector<vector<vector<int>>>(n, vector<vector<int>>(n, vector<int>(n, INT_MIN))));
    dp[0][0][0][0]=grid[0][0];
    for(int r1=0;r1<n;r1++) for(int c1=0;c1<n;c1++)
    for(int r2=0;r2<n;r2++) for(int c2=0;c2<n;c2++){
        if(grid[r1][c1]<0||grid[r2][c2]<0) continue;
        if(r1==0&&c1==0&&r2==0&&c2==0) continue;
        int best=INT_MIN, gain=grid[r1][c1];
        if(r1!=r2||c1!=c2) gain+=grid[r2][c2];
        if(r1) best=max(best, dp[r1-1][c1][r2-1][c2]);
        if(c1) best=max(best, dp[r1][c1-1][r2][c2-1]);
        if(r1&&c1) best=max(best, dp[r1-1][c1-1][r2-1][c2-1]);
        if(r1&&c2) best=max(best, dp[r1-1][c1][r2-1][c2-1]);
        if(c1&&r2) best=max(best, dp[r1][c1-1][r2-1][c2]);
        if(c1&&c2) best=max(best, dp[r1][c1-1][r2][c2-1]);
        if(r2) best=max(best, dp[r1][c1][r2-1][c2]);
        if(c2) best=max(best, dp[r1][c1][r2][c2-1]);
        if(r2&&c2) best=max(best, dp[r1][c1][r2-1][c2-1]);
        if(best!=INT_MIN) dp[r1][c1][r2][c2]=best+gain;
    }
    return max(0, dp[n-1][n-1][n-1][n-1]);
}""")]),

    # ---- Tree DP (6) ----
    q("dp-034", "House Robber III", 337, "must", "tree", "Medium",
      ["binary tree, no adjacent"], [ex("tree [3,2,3,null,3,null,1]", "7")],
      [approach("Post-order (rob, skip)", "O(n)", "O(h)", """
pair<int,int> dfs(TreeNode* u) {
    if (!u) return {0,0};
    auto L = dfs(u->left), R = dfs(u->right);
    int rob = u->val + L.second + R.second;
    int skip = max(L.first,L.second) + max(R.first,R.second);
    return {rob, skip};
}
int rob(TreeNode* root) {
    auto p = dfs(root); return max(p.first, p.second);
}""")]),

    q("dp-035", "Binary Tree Maximum Path Sum", 124, "must", "tree", "Hard",
      ["path any nodes"], [ex("tree with negatives", "6")],
      [approach("Gain from each node", "O(n)", "O(h)", """
int ans = INT_MIN;
int gain(TreeNode* u) {
    if (!u) return 0;
    int l = max(0, gain(u->left)), r = max(0, gain(u->right));
    ans = max(ans, u->val + l + r);
    return u->val + max(l, r);
}
int maxPathSum(TreeNode* root) { gain(root); return ans; }""")]),

    q("dp-036", "Diameter of Binary Tree", 543, "should", "tree", "Easy",
      ["longest path edges"], [ex("root=[1,2,3,4,5]", "3")],
      [approach("Height DP", "O(n)", "O(h)", """
int diam = 0;
int height(TreeNode* u) {
    if (!u) return 0;
    int l = height(u->left), r = height(u->right);
    diam = max(diam, l + r);
    return 1 + max(l, r);
}
int diameterOfBinaryTree(TreeNode* root) { height(root); return diam; }""")]),

    q("dp-037", "Unique Binary Search Trees", 96, "should", "tree", "Medium",
      ["count BSTs with 1..n"], [ex("n = 3", "5")],
      [approach("Catalan DP", "O(n^2)", "O(n)", """
int numTrees(int n) {
    vector<int> dp(n+1); dp[0]=dp[1]=1;
    for(int nodes=2; nodes<=n; nodes++)
        for(int root=1; root<=nodes; root++)
            dp[nodes]+=dp[root-1]*dp[nodes-root];
    return dp[n];
}""")]),

    q("dp-038", "Validate BST (DP count)", 98, "nice", "tree", "Medium",
      ["inorder or min/max range"], [ex("root=[2,1,3]", "true")],
      [approach("Range validation DFS", "O(n)", "O(h)", """
bool isValidBST(TreeNode* root, long long lo=LLONG_MIN, long long hi=LLONG_MAX) {
    if (!root) return true;
    if (root->val <= lo || root->val >= hi) return false;
    return isValidBST(root->left, lo, root->val) &&
           isValidBST(root->right, root->val, hi);
}""")]),

    q("dp-039", "Binary Tree Cameras", 968, "nice", "tree", "Hard",
      ["min cameras cover all"], [ex("tree nodes", "1 camera min")],
      [approach("Greedy post-order states", "O(n)", "O(h)", """
enum State { UNWATCHED=0, WATCHED=1, HAS_CAMERA=2 };
pair<int,int> dfs(TreeNode* u) {
    if (!u) return {0, WATCHED};
    auto L=dfs(u->left), R=dfs(u->right);
    if (L.second==UNWATCHED || R.second==UNWATCHED)
        return {L.first+R.first+1, HAS_CAMERA};
    if (L.second==HAS_CAMERA || R.second==HAS_CAMERA)
        return {L.first+R.first, WATCHED};
    return {L.first+R.first, UNWATCHED};
}
int minCameraCover(TreeNode* root) {
    auto p=dfs(root); return p.first + (p.second==UNWATCHED);
}""")]),

    # ---- Stock (6) ----
    q("dp-040", "Best Time to Buy and Sell Stock", 121, "must", "stock", "Easy",
      ["one transaction"], [ex("prices=[7,1,5,3,6,4]", "5")],
      [approach("Track min price", "O(n)", "O(1)", """
int maxProfit(vector<int>& prices) {
    int minP=INT_MAX, ans=0;
    for (int p : prices) { minP=min(minP,p); ans=max(ans,p-minP); }
    return ans;
}""")]),

    q("dp-041", "Best Time II (unlimited)", 122, "must", "stock", "Medium",
      ["any number of trades"], [ex("prices=[7,1,5,3,6,4]", "7")],
      [approach("Sum all uphill", "O(n)", "O(1)", """
int maxProfit(vector<int>& prices) {
    int ans=0;
    for(int i=1;i<(int)prices.size();i++)
        if(prices[i]>prices[i-1]) ans+=prices[i]-prices[i-1];
    return ans;
}""")]),

    q("dp-042", "Best Time III (max 2 trades)", 123, "must", "stock", "Hard",
      ["at most 2 transactions"], [ex("prices array", "max profit")],
      [approach("State machine DP", "O(n)", "O(1)", """
int maxProfit(vector<int>& prices) {
    int buy1=INT_MIN, sell1=0, buy2=INT_MIN, sell2=0;
    for(int p:prices){
        buy1=max(buy1,-p);
        sell1=max(sell1,buy1+p);
        buy2=max(buy2,sell1-p);
        sell2=max(sell2,buy2+p);
    } return sell2;
}""")]),

    q("dp-043", "Best Time IV (max k trades)", 188, "must", "stock", "Hard",
      ["at most k transactions"], [ex("k=2, prices", "profit")],
      [approach("DP[k][n] or optimized", "O(nk)", "O(k)", """
int maxProfit(int k, vector<int>& prices) {
    int n=prices.size(); if(!n||!k) return 0;
    if(k>=n/2){ int ans=0; for(int i=1;i<n;i++) if(prices[i]>prices[i-1]) ans+=prices[i]-prices[i-1]; return ans; }
    vector<int> buy(k+1, INT_MIN), sell(k+1);
    for(int p:prices)
        for(int j=1;j<=k;j++){
            buy[j]=max(buy[j], sell[j-1]-p);
            sell[j]=max(sell[j], buy[j]+p);
        }
    return sell[k];
}""")]),

    q("dp-044", "Best Time with Cooldown", 309, "must", "stock", "Medium",
      ["sell then 1-day cooldown"], [ex("prices", "max profit")],
      [approach("3-state DP", "O(n)", "O(1)", """
int maxProfit(vector<int>& prices) {
    int hold=INT_MIN, sold=0, rest=0;
    for(int p:prices){
        int prevSold=sold;
        sold=hold+p;
        hold=max(hold, rest-p);
        rest=max(rest, prevSold);
    } return max(rest,sold);
}""")]),

    q("dp-045", "Best Time with Transaction Fee", 714, "should", "stock", "Medium",
      ["fee per transaction"], [ex("prices, fee=2", "profit")],
      [approach("Cash vs hold DP", "O(n)", "O(1)", """
int maxProfit(vector<int>& prices, int fee) {
    long cash=0, hold=INT_MIN;
    for(int p:prices){
        cash=max(cash, hold+p-fee);
        hold=max(hold, cash-p);
    } return (int)cash;
}""")]),

    # ---- Interval DP (4) ----
    q("dp-046", "Burst Balloons", 312, "must", "interval", "Hard",
      ["last balloon to burst"], [ex("nums=[3,1,5,8]", "167")],
      [approach("Interval DP", "O(n^3)", "O(n^2)", """
int maxCoins(vector<int>& nums) {
    nums.insert(nums.begin(),1); nums.push_back(1);
    int n=nums.size(); vector<vector<int>> dp(n, vector<int>(n));
    for(int len=3; len<=n; len++)
        for(int l=0; l+len-1<n; l++){
            int r=l+len-1;
            for(int k=l+1;k<r;k++)
                dp[l][r]=max(dp[l][r], dp[l][k]+dp[k][r]+nums[l]*nums[k]*nums[r]);
        }
    return dp[0][n-1];
}""")]),

    q("dp-047", "Palindrome Partitioning II", 132, "should", "interval", "Hard",
      ["min cuts for palindrome parts"], [ex("s=\"aab\"", "1")],
      [approach("DP + palindrome precompute", "O(n^2)", "O(n^2)", """
int minCut(string s) {
    int n=s.size(); vector<vector<bool>> pal(n, vector<bool>(n,true));
    for(int i=n-1;i>=0;i--)
        for(int j=i+1;j<n;j++)
            pal[i][j]=(s[i]==s[j])&&pal[i+1][j-1];
    vector<int> dp(n,n);
    for(int i=0;i<n;i++){
        if(pal[0][i]) dp[i]=0;
        else for(int j=1;j<=i;j++)
            if(pal[j][i]) dp[i]=min(dp[i], dp[j-1]+1);
    } return dp[n-1];
}""")]),

    q("dp-048", "Minimum Cost Tree From Leaf Values", 1130, "nice", "interval", "Medium",
      ["merge leaves bottom-up"], [ex("arr leaf values", "min non-leaf sum")],
      [approach("Interval DP", "O(n^3)", "O(n^2)", """
int mctFromLeafValues(vector<int>& arr) {
    int n=arr.size(); vector<vector<int>> dp(n, vector<int>(n)), mx(n, vector<int>(n));
    for(int i=0;i<n;i++){ mx[i][i]=arr[i]; dp[i][i]=0; }
    for(int len=2; len<=n; len++)
        for(int l=0; l+len-1<n; l++){
            int r=l+len-1; dp[l][r]=INT_MAX;
            for(int k=l;k<r;k++)
                dp[l][r]=min(dp[l][r], dp[l][k]+dp[k+1][r]+mx[l][k]*mx[k+1][r]);
            mx[l][r]=max(mx[l][r-1], arr[r]);
        }
    return dp[0][n-1];
}""")]),

    q("dp-049", "Stone Game VII", 1690, "nice", "interval", "Medium",
      ["two players optimal"], [ex("stones array", "score difference")],
      [approach("Interval DP game", "O(n^2)", "O(n^2)", """
int stoneGameVII(vector<int>& stones) {
    int n=stones.size(); vector<int> pre(n+1);
    for(int i=0;i<n;i++) pre[i+1]=pre[i]+stones[i];
    vector<vector<int>> dp(n, vector<int>(n));
    for(int len=2; len<=n; len++)
        for(int l=0; l+len-1<n; l++){
            int r=l+len-1;
            dp[l][r]=max(pre[r+1]-pre[l+1]-dp[l+1][r], pre[r]-pre[l]-dp[l][r-1]);
        }
    return dp[0][n-1];
}""")]),

    # ---- Bitmask (3) ----
    q("dp-050", "Traveling Salesman (TSP)", None, "should", "bitmask", "Hard",
      ["n <= 12 typical"], [ex("dist matrix", "min tour cost")],
      [approach("Held-Karp bitmask DP", "O(n^2 2^n)", "O(n 2^n)", """
int tsp(vector<vector<int>>& dist) {
    int n=dist.size(), ALL=(1<<n)-1;
    vector<vector<int>> dp(1<<n, vector<int>(n, INT_MAX/2));
    dp[1][0]=0;
    for(int mask=1; mask<=ALL; mask++)
        for(int u=0; u<n; u++) if(mask&(1<<u))
            for(int v=0; v<n; v++) if(!(mask&(1<<v)))
                dp[mask|(1<<v)][v]=min(dp[mask|(1<<v)][v], dp[mask][u]+dist[u][v]);
    int ans=INT_MAX;
    for(int v=1; v<n; v++) ans=min(ans, dp[ALL][v]+dist[v][0]);
    return ans;
}""")]),

    q("dp-051", "Can I Win", 464, "should", "bitmask", "Medium",
      ["pick 1..max, reach target"], [ex("maxChoosableInteger=10, desiredTotal=11", "false")],
      [approach("Memo on used bitmask", "O(2^n * n)", "O(2^n)", """
bool canIWin(int maxVal, int total) {
    if (total==0) return true;
    long long sum = (long long)maxVal*(maxVal+1)/2;
    if (sum < total) return false;
    vector<int> memo(1<<maxVal, -1);
    function<bool(int,int)> dfs=[&](int mask, int rem){
        if(memo[mask]!=-1) return memo[mask];
        for(int i=0;i<maxVal;i++) if(!(mask&(1<<i))){
            int pick=i+1;
            if(pick>=rem) return memo[mask]=1;
            if(!dfs(mask|(1<<i), rem-pick)) return memo[mask]=1;
        } return memo[mask]=0;
    };
    return dfs(0,total);
}""")]),

    q("dp-052", "Partition to K Equal Sum Subsets (bitmask)", 698, "nice", "bitmask", "Medium",
      ["alternative bitmask DFS"], [ex("same as knapsack variant", "true/false")],
      [approach("See dp-018 backtracking", "O(k*2^n)", "O(n)", """
// Same solution as dp-018 — bitmask optional for small n.
// Use used[] array + target-sum groups; prune when cur==0 and skip duplicates.
bool canPartitionKSubsets(vector<int>& nums, int k); // refer dp-018""")]),

    # ---- Misc hard (3) ----
    q("dp-053", "Word Break II", 140, "should", "misc", "Hard",
      ["return all sentences"], [ex("s=\"catsanddog\"", "list of splits")],
      [approach("DP reachability + backtrack", "O(2^n) output", "O(n)", """
void bt(const string& s, int i, vector<string>& path, vector<string>& ans, vector<bool>& ok, unordered_set<string>& dict) {
    if (i == (int)s.size()) { ans.push_back(""); for (int j=0;j<(int)path.size();j++) ans.back() += (j?" ":"")+path[j]; return; }
    for (int j=i; j<(int)s.size(); j++) {
        string w = s.substr(i, j-i+1);
        if (!dict.count(w) || !ok[j+1]) continue;
        path.push_back(w); bt(s, j+1, path, ans, ok, dict); path.pop_back();
    }
}
vector<string> wordBreak(string s, vector<string>& wordDict) {
    unordered_set<string> dict(wordDict.begin(), wordDict.end());
    int n=s.size(); vector<bool> ok(n+1); ok[n]=true;
    for(int i=n-1;i>=0;i--)
        for(int j=i;j<n;j++) if(dict.count(s.substr(i,j-i+1))&&ok[j+1]){ ok[i]=true; break; }
    vector<string> ans, path; if(ok[0]) bt(s,0,path,ans,ok,dict); return ans;
}""")]),

    q("dp-054", "Regular Expression Matching", 10, "must", "misc", "Hard",
      [". matches any, * repeats prev"], [ex("s=\"aa\", p=\"a*\"", "true")],
      [approach("2D DP", "O(mn)", "O(n)", """
bool isMatch(string s, string p) {
    int m=s.size(), n=p.size();
    vector<vector<bool>> dp(m+1, vector<bool>(n+1));
    dp[0][0]=true;
    for(int j=2;j<=n;j+=2) if(p[j-1]=='*') dp[0][j]=dp[0][j-2];
    for(int i=1;i<=m;i++)
        for(int j=1;j<=n;j++)
            if(p[j-1]=='*'){
                dp[i][j]=dp[i][j-2];
                if(p[j-2]=='.'||p[j-2]==s[i-1]) dp[i][j]|=dp[i-1][j];
            } else if(p[j-1]=='.'||p[j-1]==s[i-1])
                dp[i][j]=dp[i-1][j-1];
    return dp[m][n];
}""")]),

    q("dp-055", "Interleaving String", 97, "should", "misc", "Medium",
      ["s3 interleave of s1,s2"], [ex("s1=\"aabcc\", s2=\"dbbca\", s3=\"aadbbcbcac\"", "true")],
      [approach("2D boolean DP", "O(mn)", "O(n)", """
bool isInterleave(string s1, string s2, string s3) {
    int m=s1.size(), n=s2.size();
    if((int)s3.size()!=m+n) return false;
    vector<bool> prev(n+1), cur(n+1);
    prev[0]=true;
    for(int j=1;j<=n;j++) prev[j]=prev[j-1]&&s2[j-1]==s3[j-1];
    for(int i=1;i<=m;i++){
        cur[0]=prev[0]&&s1[i-1]==s3[i-1];
        for(int j=1;j<=n;j++)
            cur[j]=(prev[j]&&s1[i-1]==s3[i+j-1])||(cur[j-1]&&s2[j-1]==s3[i+j-1]);
        prev.swap(cur);
    } return prev[n];
}""")]),

    q("dp-056", "Jump Game", 55, "must", "1d", "Medium",
      ["can reach last index"], [ex("nums=[2,3,1,1,4]", "true")],
      [approach("Greedy farthest reach", "O(n)", "O(1)", """
bool canJump(vector<int>& nums) {
    int far = 0;
    for (int i = 0; i < (int)nums.size(); i++) {
        if (i > far) return false;
        far = max(far, i + nums[i]);
        if (far >= (int)nums.size()-1) return true;
    } return true;
}""")]),
]

# Remove duplicate jump game - we have 56 items, need exactly 55
# dp-056 Jump Game was added as bonus - replace dp-052 duplicate with Jump Game II
DP_QUESTIONS = [x for x in DP_QUESTIONS if x["id"] != "dp-052"]
DP_QUESTIONS.append(
    q("dp-052", "Jump Game II", 45, "must", "1d", "Medium",
      ["minimum jumps to end"], [ex("nums=[2,3,1,1,4]", "2")],
      [approach("Greedy BFS layers", "O(n)", "O(1)", """
int jump(vector<int>& nums) {
    int n=nums.size(), jumps=0, curEnd=0, farthest=0;
    for(int i=0;i<n-1;i++){
        farthest=max(farthest,i+nums[i]);
        if(i==curEnd){ jumps++; curEnd=farthest; }
    } return jumps;
}""")])
)
DP_QUESTIONS = [x for x in DP_QUESTIONS if x["id"] != "dp-056"]

assert len(DP_QUESTIONS) == 55, len(DP_QUESTIONS)

DP_TOPIC = {
    "id": "dp",
    "title": "Dynamic Programming",
    "expected_count": 55,
    "strategy": (
        "<strong>Speed-run priority:</strong> Filter <em>Must do</em> first — ~20 core questions covering 1D, knapsack, LCS, grid, tree, and stock. "
        "Those alone cover ~85% of DP interviews. "
        "<ul><li>~10 min per question max</li>"
        "<li>Identify pattern before coding (1D / knapsack / LCS / grid / interval / bitmask)</li>"
        "<li>Always state recurrence + base case out loud</li></ul>"
    ),
    "subtopics": [
        {"id": "1d", "label": "1D DP"},
        {"id": "knapsack", "label": "Knapsack"},
        {"id": "lcs", "label": "LCS / Strings"},
        {"id": "grid", "label": "Grid DP"},
        {"id": "tree", "label": "Tree DP"},
        {"id": "stock", "label": "Stock"},
        {"id": "interval", "label": "Interval DP"},
        {"id": "bitmask", "label": "Bitmask"},
        {"id": "misc", "label": "Misc Hard"},
    ],
    "questions": DP_QUESTIONS,
}
