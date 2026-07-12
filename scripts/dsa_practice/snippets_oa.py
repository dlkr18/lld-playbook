# C++ snippets for OA / GFG classics (no LeetCode id).

CUSTOM_SNIPPETS = {
    "oa-01": ("Prefix diff pair", "O(n)", "O(n)", """
long long countEqual012(string s) {
    long long z = 0, o = 0, t = 0, ans = 0;
    const long long SHIFT = 1000003LL;
    unordered_map<long long, long long> freq;
    freq[0] = 1;
    for (char c : s) {
        if (c == '0') z++;
        else if (c == '1') o++;
        else t++;
        long long key = (z - o) * SHIFT + (z - t);
        ans += freq[key];
        freq[key]++;
    }
    return ans;
}"""),
    "oa-02": ("Prefix diff pair", "O(n)", "O(n)", """
long long countEqualABC(string s) {
    long long a = 0, b = 0, c = 0, ans = 0;
    const long long SHIFT = 1000003LL;
    unordered_map<long long, long long> freq;
    freq[0] = 1;
    for (char ch : s) {
        if (ch == 'a') a++;
        else if (ch == 'b') b++;
        else c++;
        long long key = (a - b) * SHIFT + (b - c);
        ans += freq[key];
        freq[key]++;
    }
    return ans;
}"""),
    "oa-03": ("Sliding window shrink", "O(n)", "O(1)", """
long long substringsAllThree(string s) {
    int n = s.size(), cnt[3] = {0}, l = 0;
    long long ans = 0;
    for (int r = 0; r < n; r++) {
        cnt[s[r] - 'a']++;
        while (cnt[0] > 0 && cnt[1] > 0 && cnt[2] > 0) {
            ans += n - r;
            cnt[s[l] - 'a']--;
            l++;
        }
    }
    return ans;
}"""),
    "oa-04": ("Prefix balance map", "O(n)", "O(n)", """
long long countEqual01(vector<int>& nums) {
    long long bal = 0, ans = 0;
    unordered_map<long long, long long> freq;
    freq[0] = 1;
    for (int x : nums) {
        bal += x ? 1 : -1;
        ans += freq[bal];
        freq[bal]++;
    }
    return ans;
}"""),
    "oa-05": ("Prefix sum earliest index", "O(n)", "O(n)", """
int maxLenZeroSum(vector<int>& nums) {
    unordered_map<long long, int> first;
    first[0] = -1;
    long long sum = 0;
    int ans = 0;
    for (int i = 0; i < (int)nums.size(); i++) {
        sum += nums[i];
        if (first.count(sum)) ans = max(ans, i - first[sum]);
        else first[sum] = i;
    }
    return ans;
}"""),
    "oa-06": ("Binary search on answer", "O(n log range)", "O(1)", """
bool canPlace(vector<int>& stalls, int cows, int dist) {
    int placed = 1, last = stalls[0];
    for (int i = 1; i < (int)stalls.size(); i++) {
        if (stalls[i] - last >= dist) {
            placed++;
            last = stalls[i];
        }
    }
    return placed >= cows;
}
int aggressiveCows(vector<int>& stalls, int cows) {
    sort(stalls.begin(), stalls.end());
    int lo = 1, hi = stalls.back() - stalls[0], ans = 0;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (canPlace(stalls, cows, mid)) { ans = mid; lo = mid + 1; }
        else hi = mid - 1;
    }
    return ans;
}"""),
    "oa-07": ("Sort by deadline + DSU", "O(n log n)", "O(n)", """
int jobSequencing(vector<pair<int,int>>& jobs) {
    sort(jobs.begin(), jobs.end(), [](auto& a, auto& b) {
        return a.second > b.second;
    });
    int maxDay = 0;
    for (auto& j : jobs) maxDay = max(maxDay, j.first);
    vector<int> slot(maxDay + 1, -1);
    int profit = 0;
    for (auto& j : jobs) {
        for (int d = min(j.first, maxDay); d >= 1; d--) {
            if (slot[d] == -1) { slot[d] = 1; profit += j.second; break; }
        }
    }
    return profit;
}"""),
    "oa-08": ("Sweep line events", "O(n log n)", "O(n)", """
int findPlatform(vector<int>& arr, vector<int>& dep) {
    vector<pair<int,int>> ev;
    for (int t : arr) ev.push_back({t, 1});
    for (int t : dep) ev.push_back({t, -1});
    sort(ev.begin(), ev.end());
    int cur = 0, ans = 0;
    for (auto& e : ev) {
        cur += e.second;
        ans = max(ans, cur);
    }
    return ans;
}"""),
    "oa-09": ("XOR + math", "O(n)", "O(1)", """
pair<int,int> missingRepeating(vector<int>& nums) {
    int n = nums.size();
    long long s = 0, s2 = 0;
    for (int x : nums) { s += x; s2 += 1LL * x * x; }
    long long sn = 1LL * n * (n + 1) / 2;
    long long sn2 = 1LL * n * (n + 1) * (2LL * n + 1) / 6;
    long long diff = s - sn;
    long long sumBoth = (s2 - sn2) / diff;
    int repeating = (int)((sumBoth + diff) / 2);
    int missing = (int)((sumBoth - diff) / 2);
    return {missing, repeating};
}"""),
    "oa-10": ("Kadane + wrap", "O(n)", "O(1)", """
int maxCircularSum(vector<int>& nums) {
    int total = 0, maxSum = nums[0], minSum = nums[0], curMax = 0, curMin = 0;
    for (int x : nums) {
        total += x;
        curMax = max(x, curMax + x);
        curMin = min(x, curMin + x);
        maxSum = max(maxSum, curMax);
        minSum = min(minSum, curMin);
    }
    return total == minSum ? maxSum : max(maxSum, total - minSum);
}"""),
    "oa-11": ("Min heap merge", "O(n log n)", "O(n)", """
int connectRopes(vector<int>& ropes) {
    priority_queue<int, vector<int>, greater<int>> pq(ropes.begin(), ropes.end());
    int cost = 0;
    while (pq.size() > 1) {
        int a = pq.top(); pq.pop();
        int b = pq.top(); pq.pop();
        cost += a + b;
        pq.push(a + b);
    }
    return cost;
}"""),
    "oa-12": ("Elimination", "O(n)", "O(n)", """
int celebrity(vector<vector<int>>& knows) {
    int n = knows.size(), cand = 0;
    for (int i = 1; i < n; i++)
        if (knows[cand][i]) cand = i;
    for (int i = 0; i < n; i++) {
        if (i == cand) continue;
        if (knows[cand][i] || !knows[i][cand]) return -1;
    }
    return cand;
}"""),
    "oa-13": ("Backtrack grid", "O(4^nm)", "O(nm)", """
bool dfsMaze(vector<vector<int>>& g, int r, int c) {
    int n = g.size(), m = g[0].size();
    if (r < 0 || c < 0 || r >= n || c >= m || g[r][c] == 0) return false;
    if (r == n - 1 && c == m - 1) return true;
    g[r][c] = 0;
    bool ok = dfsMaze(g, r + 1, c) || dfsMaze(g, r, c + 1);
    g[r][c] = 1;
    return ok;
}
bool ratInMaze(vector<vector<int>>& maze) {
    return dfsMaze(maze, 0, 0);
}"""),
    "oa-14": ("Recurrence", "O(n)", "O(1)", """
int josephus(int n, int k) {
    int ans = 0;
    for (int i = 2; i <= n; i++)
        ans = (ans + k) % i;
    return ans + 1;
}"""),
    "oa-15": ("Two pointers", "O(n)", "O(1)", """
int countPairsSum(vector<int>& arr, int target) {
    sort(arr.begin(), arr.end());
    int l = 0, r = arr.size() - 1, ans = 0;
    while (l < r) {
        int s = arr[l] + arr[r];
        if (s == target) {
            if (arr[l] == arr[r]) {
                long long c = r - l + 1;
                ans += (int)(c * (c - 1) / 2);
                break;
            }
            int lc = 1, rc = 1;
            while (l + 1 < r && arr[l] == arr[l + 1]) l++, lc++;
            while (r - 1 > l && arr[r] == arr[r - 1]) r--, rc++;
            ans += lc * rc;
            l++; r--;
        } else if (s < target) l++;
        else r--;
    }
    return ans;
}"""),
    "oa-16": ("Min heap BFS", "O(mn log mn)", "O(mn)", """
int trapRainWater2(vector<vector<int>>& h) {
    int n = h.size(), m = h[0].size();
    if (n == 0) return 0;
    priority_queue<array<int,3>, vector<array<int,3>>, greater<array<int,3>>> pq;
    vector<vector<bool>> vis(n, vector<bool>(m, false));
    for (int i = 0; i < n; i++)
        for (int j = 0; j < m; j++)
            if (i == 0 || j == 0 || i == n - 1 || j == m - 1) {
                pq.push({h[i][j], i, j});
                vis[i][j] = true;
            }
    int dr[4] = {1,-1,0,0}, dc[4] = {0,0,1,-1}, ans = 0, wall = 0;
    while (!pq.empty()) {
        auto cur = pq.top(); pq.pop();
        wall = max(wall, cur[0]);
        for (int k = 0; k < 4; k++) {
            int r = cur[1] + dr[k], c = cur[2] + dc[k];
            if (r < 0 || c < 0 || r >= n || c >= m || vis[r][c]) continue;
            vis[r][c] = true;
            if (h[r][c] < wall) ans += wall - h[r][c];
            pq.push({h[r][c], r, c});
        }
    }
    return ans;
}"""),
    "oa-17": ("Deque window max", "O(n)", "O(k)", """
vector<int> maxSlidingWindow(vector<int>& nums, int k) {
    deque<int> dq;
    vector<int> ans;
    for (int i = 0; i < (int)nums.size(); i++) {
        while (!dq.empty() && dq.front() <= i - k) dq.pop_front();
        while (!dq.empty() && nums[dq.back()] <= nums[i]) dq.pop_back();
        dq.push_back(i);
        if (i >= k - 1) ans.push_back(nums[dq.front()]);
    }
    return ans;
}"""),
    "oa-18": ("Prefix totals", "O(n)", "O(1)", """
int equilibriumIndex(vector<int>& nums) {
    long long total = 0;
    for (int x : nums) total += x;
    long long left = 0;
    for (int i = 0; i < (int)nums.size(); i++) {
        if (left == total - left - nums[i]) return i;
        left += nums[i];
    }
    return -1;
}"""),
    "oa-19": ("Right scan leaders", "O(n)", "O(1)", """
vector<int> leaders(vector<int>& nums) {
    vector<int> ans;
    int mx = INT_MIN;
    for (int i = nums.size() - 1; i >= 0; i--) {
        if (nums[i] >= mx) { ans.push_back(nums[i]); mx = nums[i]; }
    }
    reverse(ans.begin(), ans.end());
    return ans;
}"""),
    "oa-20": ("Greedy reach", "O(n)", "O(1)", """
int minJumps(vector<int>& arr) {
    int n = arr.size();
    if (n <= 1) return 0;
    int jumps = 0, curEnd = 0, farthest = 0;
    for (int i = 0; i < n - 1; i++) {
        farthest = max(farthest, i + arr[i]);
        if (i == curEnd) {
            jumps++;
            curEnd = farthest;
        }
    }
    return jumps;
}"""),
    "oa-21": ("Monotonic stack", "O(n)", "O(n)", """
vector<int> nextSmaller(vector<int>& nums) {
    int n = nums.size();
    vector<int> ans(n, -1);
    stack<int> st;
    for (int i = 0; i < n; i++) {
        while (!st.empty() && nums[st.top()] > nums[i]) {
            ans[st.top()] = nums[i];
            st.pop();
        }
        st.push(i);
    }
    return ans;
}"""),
    "oa-22": ("Merge intervals variant", "O(n log n)", "O(n)", """
int maxMeetings(vector<vector<int>>& intervals) {
    vector<pair<int,int>> v;
    for (auto& in : intervals) v.push_back({in[0], in[1]});
    sort(v.begin(), v.end(), [](auto& a, auto& b) { return a.second < b.second; });
    int end = INT_MIN, count = 0;
    for (auto& p : v)
        if (p.first >= end) { count++; end = p.second; }
    return count;
}"""),
    "oa-23": ("Kadence variant", "O(n)", "O(1)", """
int maxAbsoluteSum(vector<int>& nums) {
    int pos = 0, neg = 0, best = 0;
    for (int x : nums) {
        pos = max(x, pos + x);
        neg = min(x, neg + x);
        best = max(best, max(pos, -neg));
    }
    return best;
}"""),
    "oa-24": ("Stack decode", "O(n)", "O(n)", """
string decodeString(string s) {
    string cur;
    stack<int> cnt;
    stack<string> prev;
    int k = 0;
    for (char c : s) {
        if (isdigit(c)) k = k * 10 + (c - '0');
        else if (c == '[') {
            cnt.push(k); prev.push(cur); cur.clear(); k = 0;
        } else if (c == ']') {
            string rep = cur;
            cur = prev.top(); prev.pop();
            int times = cnt.top(); cnt.pop();
            while (times--) cur += rep;
        } else cur.push_back(c);
    }
    return cur;
}"""),
    "oa-25": ("Two pointers partition", "O(n)", "O(1)", """
void sort012(vector<int>& a) {
    int lo = 0, mid = 0, hi = (int)a.size() - 1;
    while (mid <= hi) {
        if (a[mid] == 0) swap(a[lo++], a[mid++]);
        else if (a[mid] == 1) mid++;
        else swap(a[mid], a[hi--]);
    }
}"""),
    "oa-26": ("Rotate reversal", "O(n)", "O(1)", """
void rotateArray(vector<int>& nums, int k) {
    int n = nums.size();
    k %= n;
    reverse(nums.begin(), nums.end());
    reverse(nums.begin(), nums.begin() + k);
    reverse(nums.begin() + k, nums.end());
}"""),
    "oa-27": ("KMP prefix", "O(n+m)", "O(n)", """
vector<int> buildLps(string p) {
    vector<int> lps(p.size(), 0);
    for (int i = 1, len = 0; i < (int)p.size(); ) {
        if (p[i] == p[len]) lps[i++] = ++len;
        else if (len) len = lps[len - 1];
        else lps[i++] = 0;
    }
    return lps;
}
int strStr(string hay, string needle) {
    if (needle.empty()) return 0;
    vector<int> lps = buildLps(needle);
    for (int i = 0, j = 0; i < (int)hay.size(); ) {
        if (hay[i] == needle[j]) { i++; j++; if (j == (int)needle.size()) return i - j; }
        else if (j) j = lps[j - 1];
        else i++;
    }
    return -1;
}"""),
    "oa-28": ("Merge two sorted", "O(n+m)", "O(1)", """
void mergeSorted(vector<int>& a, int m, vector<int>& b, int n) {
    int i = m - 1, j = n - 1, w = m + n - 1;
    while (j >= 0) {
        if (i >= 0 && a[i] > b[j]) a[w--] = a[i--];
        else a[w--] = b[j--];
    }
}"""),
    "oa-29": ("BFS layers", "O(mn)", "O(mn)", """
int orangesRotting(vector<vector<int>>& grid) {
    int n = grid.size(), m = grid[0].size(), fresh = 0, mins = 0;
    queue<pair<int,int>> q;
    for (int i = 0; i < n; i++)
        for (int j = 0; j < m; j++)
            if (grid[i][j] == 2) q.push({i,j});
            else if (grid[i][j] == 1) fresh++;
    int dr[4] = {1,-1,0,0}, dc[4] = {0,0,1,-1};
    while (!q.empty() && fresh > 0) {
        int sz = q.size();
        while (sz--) {
            auto p = q.front(); q.pop();
            for (int k = 0; k < 4; k++) {
                int r = p.first + dr[k], c = p.second + dc[k];
                if (r < 0 || c < 0 || r >= n || c >= m || grid[r][c] != 1) continue;
                grid[r][c] = 2; fresh--; q.push({r,c});
            }
        }
        mins++;
    }
    return fresh == 0 ? mins : -1;
}"""),
    "oa-30": ("Floyd cycle", "O(n)", "O(1)", """
int findDuplicate(vector<int>& nums) {
    int slow = nums[0], fast = nums[0];
    do { slow = nums[slow]; fast = nums[nums[fast]]; } while (slow != fast);
    slow = nums[0];
    while (slow != fast) { slow = nums[slow]; fast = nums[fast]; }
    return slow;
}"""),
    "oa-31": ("Merge sort count", "O(n log n)", "O(n)", """
long long mergeCount(vector<int>& a, int l, int r) {
    if (l >= r) return 0;
    int m = l + (r - l) / 2;
    long long inv = mergeCount(a, l, m) + mergeCount(a, m + 1, r);
    vector<int> tmp;
    int i = l, j = m + 1;
    while (i <= m && j <= r) {
        if (a[i] <= a[j]) tmp.push_back(a[i++]);
        else { inv += m - i + 1; tmp.push_back(a[j++]); }
    }
    while (i <= m) tmp.push_back(a[i++]);
    while (j <= r) tmp.push_back(a[j++]);
    for (int k = l; k <= r; k++) a[k] = tmp[k - l];
    return inv;
}
long long inversionCount(vector<int>& nums) {
    return mergeCount(nums, 0, (int)nums.size() - 1);
}"""),
    "oa-32": ("Expand centers", "O(n^2)", "O(1)", """
int longestPalindrome(string s) {
    int best = 0;
    auto expand = [&](int l, int r) {
        while (l >= 0 && r < (int)s.size() && s[l] == s[r]) l--, r++;
        best = max(best, r - l - 1);
    };
    for (int i = 0; i < (int)s.size(); i++) {
        expand(i, i);
        expand(i, i + 1);
    }
    return best;
}"""),
}
