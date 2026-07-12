"""Full C++ for nice-to-have questions previously on pattern skeletons."""
SNIPPETS_LC3 = {
    36: ("Row/col/box sets", "O(1)", "O(1)", """
bool isValidSudoku(vector<vector<char>>& b) {
    bool row[9][9]={}, col[9][9]={}, box[9][9]={};
    for (int r=0;r<9;r++) for (int c=0;c<9;c++) {
        if (b[r][c]=='.') continue;
        int d=b[r][c]-'1', k=(r/3)*3+c/3;
        if (row[r][d]||col[c][d]||box[k][d]) return false;
        row[r][d]=col[c][d]=box[k][d]=true;
    } return true;
}"""),
    974: ("Prefix mod counts", "O(n)", "O(k)", """
int subarraysDivByK(vector<int>& nums, int k) {
    unordered_map<int,int> cnt{{0,1}}; int sum=0, ans=0;
    for (int x: nums) { sum=((sum+x)%k+k)%k; ans+=cnt[sum]++; }
    return ans;
}"""),
    383: ("Freq count", "O(n)", "O(1)", """
bool canConstruct(string ransom, string magazine) {
    int c[26]={}; for (char ch: magazine) c[ch-'a']++;
    for (char ch: ransom) if (--c[ch-'a']<0) return false;
    return true;
}"""),
    350: ("HashMap counts", "O(n)", "O(n)", """
vector<int> intersect(vector<int>& a, vector<int>& b) {
    unordered_map<int,int> cnt; for (int x:a) cnt[x]++;
    vector<int> ans; for (int x:b) if (cnt[x]-->0) ans.push_back(x);
    return ans;
}"""),
    202: ("Floyd cycle on squares", "O(log n)", "O(1)", """
int sqSum(int n){ int s=0; while(n){ s+= (n%10)*(n%10); n/=10; } return s; }
bool isHappy(int n) {
    int slow=n, fast=n;
    do { slow=sqSum(slow); fast=sqSum(sqSum(fast)); } while (slow!=fast);
    return slow==1;
}"""),
    216: ("Backtrack k numbers sum n", "O(C(n,k))", "O(k)", """
void dfs(int start,int k,int rem,vector<int>& path,vector<vector<int>>& ans){
    if(!rem && !k){ ans.push_back(path); return; }
    if(k<=0||rem<=0||start>9) return;
    for(int i=start;i<=9;i++) if(i<=rem){ path.push_back(i); dfs(i+1,k-1,rem-i,path,ans); path.pop_back(); }
}
vector<vector<int>> combinationSum3(int k,int n){ vector<vector<int>> ans; vector<int> p; dfs(1,k,n,p,ans); return ans; }"""),
    52: ("N-Queens count", "O(n!)", "O(n)", """
int solveNQueens(int n) {
    int ans=0; vector<int> cols(n), d1(2*n), d2(2*n);
    function<void(int)> dfs=[&](int r){
        if(r==n){ ans++; return; }
        for(int c=0;c<n;c++) if(!cols[c]&&!d1[r-c+n]&&!d2[r+c]){
            cols[c]=d1[r-c+n]=d2[r+c]=1; dfs(r+1);
            cols[c]=d1[r-c+n]=d2[r+c]=0;
        }
    }; dfs(0); return ans;
}"""),
    301: ("BFS min removals", "O(2^n)", "O(n)", """
vector<string> removeInvalidParentheses(string s) {
    auto valid=[&](const string& t){
        int bal=0; for(char c:t){ if(c=='(') bal++; else if(c==')'&&--bal<0) return false; } return bal==0;
    };
    unordered_set<string> seen; queue<string> q; q.push(s); seen.insert(s);
    vector<string> ans; bool found=false;
    while(!q.empty()){
        int sz=q.size();
        while(sz--){
            string cur=q.front(); q.pop();
            if(valid(cur)){ ans.push_back(cur); found=true; continue; }
            if(found) continue;
            for(int i=0;i<(int)cur.size();i++) if(cur[i]=='('||cur[i]==')'){
                string nxt=cur.substr(0,i)+cur.substr(i+1);
                if(!seen.count(nxt)){ seen.insert(nxt); q.push(nxt); }
            }
        } if(found) break;
    } return ans;
}"""),
    473: ("Subset sum partition", "O(4^n)", "O(n)", """
bool canPartition(vector<int>& m){
    int sum=accumulate(m.begin(),m.end(),0); if(sum%4) return false;
    int side=sum/4; sort(m.rbegin(),m.rend());
    vector<int> sides(4);
    function<bool(int)> dfs=[&](int i){
        if(i==(int)m.size()) return true;
        for(int k=0;k<4;k++){
            if(sides[k]+m[i]>side) continue;
            sides[k]+=m[i]; if(dfs(i+1)) return true; sides[k]-=m[i];
            if(!sides[k]) break;
        } return false;
    }; return dfs(0);
}"""),
    254: ("Backtrack factors", "O(2^sqrt n)", "O(log n)", """
void dfs(int start,int n,vector<int>& path,vector<vector<int>>& ans){
    if(n==1 && !path.empty()){ ans.push_back(path); return; }
    for(int i=start;i*i<=n;i++) if(n%i==0){
        path.push_back(i); dfs(i,n/i,path,ans); path.pop_back();
        if(i==1) break;
    }
    if(n>=start){ path.push_back(n); ans.push_back(path); path.pop_back(); }
}
vector<vector<int>> getFactors(int n){ vector<vector<int>> ans; vector<int> p; dfs(2,n,p,ans); return ans; }"""),
    282: ("Backtrack ops", "O(4^n)", "O(n)", """
void dfs(string& num,int i,long long cur,long long prev,string& path,vector<string>& ans,int target){
    if(i==(int)num.size()){ if(cur==target) ans.push_back(path); return; }
    for(int j=i;j<(int)num.size();j++){
        if(j>i && num[i]=='0') break;
        long long v=stoll(num.substr(i,j-i+1));
        if(i==0){ path=to_string(v); dfs(num,j+1,v,v,path,ans,target); }
        else{
            path+='+'; path+=to_string(v); dfs(num,j+1,cur+v,v,path,ans,target); path.pop_back(); path.pop_back(); path.pop_back(); path.pop_back();
            path+='-'; path+=to_string(v); dfs(num,j+1,cur-v,-v,path,ans,target); path.pop_back(); path.pop_back(); path.pop_back(); path.pop_back();
            path+='*'; path+=to_string(v); dfs(num,j+1,cur-prev+prev*v,prev*v,path,ans,target); path.pop_back(); path.pop_back(); path.pop_back(); path.pop_back();
        }
    }
}
vector<string> addOperators(string num,int target){ vector<string> ans,path; dfs(num,0,0,0,path,ans,target); return ans; }"""),
    291: ("Backtrack pattern map", "O(n^m)", "O(n)", """
bool match(string& pattern, string& s, int i, int j, unordered_map<char,string>& p2s, unordered_map<string,char>& s2p){
    if(i==(int)pattern.size()) return j==(int)s.size();
    char pc=pattern[i];
    if(p2s.count(pc)){
        string w=p2s[pc]; if(s.compare(j,w.size())!=0) return false;
        return match(pattern,s,i+1,j+w.size(),p2s,s2p);
    }
    for(int k=j;k<(int)s.size();k++){
        string w=s.substr(j,k-j+1);
        if(s2p.count(w)) continue;
        p2s[pc]=w; s2p[w]=pc;
        if(match(pattern,s,i+1,k+1,p2s,s2p)) return true;
        p2s.erase(pc); s2p.erase(w);
    } return false;
}
bool wordPatternMatch(string pattern,string s){ unordered_map<char,string> a; unordered_map<string,char> b; return match(pattern,s,0,0,a,b); }"""),
    351: ("DFS + jump table", "O(9!)", "O(1)", """
int numberOfPatterns(int m, int n) {
    int jump[10][10]={};
    jump[1][3]=jump[3][1]=2; jump[1][7]=jump[7][1]=4; jump[3][9]=jump[9][3]=6;
    jump[7][9]=jump[9][7]=8; jump[1][9]=jump[9][1]=jump[3][7]=jump[7][3]=5;
    jump[2][8]=jump[8][2]=5; jump[4][6]=jump[6][4]=5;
    int ans=0;
    function<void(int,int,int)> dfs=[&](int len,int last,int mask){
        if(len>=m) ans++;
        if(len==n) return;
        for(int d=1;d<=9;d++){
            int j = last? jump[last][d] : 0;
            if((!last || (!j || (mask&(1<<j)))) && !(mask&(1<<d)))
                dfs(len+1,d,mask|(1<<d));
        }
    };
    dfs(0,0,0); return ans;
}"""),
    1539: ("Missing count BS", "O(log n)", "O(1)", """
int findKthPositive(vector<int>& arr, int k) {
    int lo=0, hi=arr.size();
    while(lo<hi){ int mid=lo+(hi-lo)/2; if(arr[mid]-mid-1<k) lo=mid+1; else hi=mid; }
    return lo+k;
}"""),
    81: ("BS with duplicates", "O(log n)", "O(1)", """
bool search(vector<int>& nums, int target) {
    int lo=0, hi=(int)nums.size()-1;
    while(lo<=hi){
        int mid=lo+(hi-lo)/2;
        if(nums[mid]==target) return true;
        if(nums[lo]==nums[mid]&&nums[mid]==nums[hi]){ lo++; hi--; continue; }
        if(nums[lo]<=nums[mid]){ if(nums[lo]<=target&&target<nums[mid]) hi=mid-1; else lo=mid+1; }
        else { if(nums[mid]<target&&target<=nums[hi]) lo=mid+1; else hi=mid-1; }
    } return false;
}"""),
    1818: ("Sort + BS", "O(n log n)", "O(n)", """
int minAbsoluteSumDiff(vector<int>& a, vector<int>& b) {
    const int MOD=1e9+7; vector<int> s=a; sort(s.begin(),s.end());
    long long sum=0, best=0;
    for(int i=0;i<(int)a.size();i++){
        sum=(sum+abs(a[i]-b[i]))%MOD;
        auto it=lower_bound(s.begin(),s.end(),b[i]);
        if(it!=s.end()) best=max(best, (long long)abs(a[i]-b[i])-abs(*it-b[i]));
        if(it!=s.begin()){ --it; best=max(best,(long long)abs(a[i]-b[i])-abs(*it-b[i])); }
    } return (int)((sum-best+MOD)%MOD);
}"""),
    260: ("XOR groups", "O(n)", "O(1)", """
vector<int> singleNumber(vector<int>& nums) {
    long long x=0; for(int v:nums) x^=v;
    long long bit = x & -x;
    int a=0,b=0;
    for(int v:nums) (v&bit)? a^=v : b^=v;
    return {a,b};
}"""),
    89: ("Gray code", "O(2^n)", "O(1)", """
vector<int> grayCode(int n) {
    vector<int> ans; for(int i=0;i<(1<<n);i++) ans.push_back(i^(i>>1)); return ans;
}"""),
    342: ("Bit check", "O(1)", "O(1)", """
bool isPowerOfFour(int n) {
    // power of 2: n & (n-1) == 0; power of 4: set bit at even index only
    return n > 0 && (n & (n - 1)) == 0 && (n & 0x55555555);
}"""),
    201: ("Shift common prefix", "O(1)", "O(1)", """
int rangeBitwiseAnd(int left, int right) {
    int shift=0; while(left<right){ left>>=1; right>>=1; shift++; }
    return left<<shift;
}"""),
    393: ("Bit scan UTF-8", "O(n)", "O(1)", """
bool validUtf8(vector<int>& data) {
    int i=0, n=data.size();
    while(i<n){
        int bytes=0;
        if((data[i]&0x80)==0) bytes=1;
        else if((data[i]&0xE0)==0xC0) bytes=2;
        else if((data[i]&0xF0)==0xE0) bytes=3;
        else if((data[i]&0xF8)==0xF0) bytes=4;
        else return false;
        if(i+bytes>n) return false;
        for(int j=1;j<bytes;j++) if((data[i+j]&0xC0)!=0x80) return false;
        i+=bytes;
    } return true;
}"""),
    389: ("XOR chars", "O(n)", "O(1)", """
char findTheDifference(string s, string t) {
    char x=0; for(char c:s) x^=c; for(char c:t) x^=c; return x;
}"""),
    318: ("Bitmask words", "O(n^2 * L)", "O(n)", """
int maxProduct(vector<string>& words) {
    vector<int> mask(words.size());
    for(int i=0;i<(int)words.size();i++) for(char c:words[i]) mask[i]|=1<<(c-'a');
    int ans=0;
    for(int i=0;i<(int)words.size();i++) for(int j=i+1;j<(int)words.size();j++)
        if(!(mask[i]&mask[j])) ans=max(ans,(int)(words[i].size()*words[j].size()));
    return ans;
}"""),
    477: ("Bit contribution", "O(32n)", "O(1)", """
int totalHammingDistance(vector<int>& nums) {
    int ans=0;
    for(int b=0;b<32;b++){
        int ones=0;
        for(int x:nums) if((x>>b)&1) ones++;
        ans += ones*((int)nums.size()-ones);
    } return ans;
}"""),
    187: ("Hash 10-mer", "O(n)", "O(n)", """
vector<string> findRepeatedDnaSequences(string s) {
    unordered_map<string,int> cnt; vector<string> ans;
    for(int i=0;i+10<=(int)s.size();i++){
        string sub=s.substr(i,10);
        if(++cnt[sub]==2) ans.push_back(sub);
    } return ans;
}"""),
    1318: ("Greedy bits", "O(1)", "O(1)", """
int minFlips(int a,int b,int c){
    int ans=0;
    for(int i=0;i<32;i++){
        int bitC=(c>>i)&1, bitA=(a>>i)&1, bitB=(b>>i)&1;
        if(bitC) ans += !(bitA||bitB);
        else ans += bitA+bitB;
    }     return ans;
}"""),
    241: ("Recursion + memo", "O(4^n)", "O(n)", """
vector<int> diffWaysToCompute(string exp) {
    vector<int> ans;
    for(int i=0;i<(int)exp.size();i++){
        if(exp[i]=='+'||exp[i]=='-'||exp[i]=='*'){
            auto L=diffWaysToCompute(exp.substr(0,i));
            auto R=diffWaysToCompute(exp.substr(i+1));
            for(int a:L) for(int b:R){
                if(exp[i]=='+') ans.push_back(a+b);
                else if(exp[i]=='-') ans.push_back(a-b);
                else ans.push_back(a*b);
            }
        }
    }
    if(ans.empty()) ans.push_back(stoi(exp));
    return ans;
}"""),
    218: ("Sweep line + multiset", "O(n log n)", "O(n)", """
vector<vector<int>> getSkyline(vector<vector<int>>& b) {
    vector<pair<long long,int>> ev;
    for(auto& x:b){ ev.push_back({x[0],-x[2]}); ev.push_back({x[1],x[2]}); }
    sort(ev.begin(), ev.end());
    multiset<int> hs={0}; map<int,int> cnt; vector<vector<int>> ans;
    auto add=[&](int h){ if(++cnt[h]==1) hs.insert(h); };
    auto rem=[&](int h){ if(--cnt[h]==0){ hs.erase(hs.find(h)); cnt.erase(h); } };
    long long prev=0;
    for(auto& e:ev){
        if(e.second<0) add(-e.second); else rem(e.second);
        long long cur=*hs.rbegin();
        if(cur!=prev){ ans.push_back({(int)e.first,(int)cur}); prev=cur; }
    } return ans;
}"""),
    427: ("Quadtree divide", "O(n)", "O(log n)", """
class Node{ public: bool val; bool isLeaf; Node* topLeft,*topRight,*bottomLeft,*bottomRight;
    Node(bool v,bool leaf):val(v),isLeaf(leaf),topLeft(nullptr),topRight(nullptr),bottomLeft(nullptr),bottomRight(nullptr){}
    Node(){}
};
Node* build(vector<vector<int>>& g,int x,int y,int len){
    if(len==1) return new Node(g[x][y],true);
    int h=len/2;
    auto tl=build(g,x,y,h), tr=build(g,x,y+h,h), bl=build(g,x+h,y,h), br=build(g,x+h,y+h,h);
    if(tl->isLeaf&&tr->isLeaf&&bl->isLeaf&&br->isLeaf && tl->val==tr->val&&tr->val==bl->val&&bl->val==br->val)
        return new Node(tl->val,true);
    Node* root=new Node(false,false);
    root->topLeft=tl; root->topRight=tr; root->bottomLeft=bl; root->bottomRight=br;
    return root;
}
Node* construct(vector<vector<int>>& grid){ if(grid.empty()) return nullptr; return build(grid,0,0,grid.size()); }"""),
    229: ("Boyer-Moore general", "O(n)", "O(1)", """
vector<int> majorityElement(vector<int>& nums) {
    int c1=0,c2=0,v1=0,v2=0;
    for(int x:nums){
        if(x==v1) c1++; else if(x==v2) c2++;
        else if(!c1){ v1=x; c1=1; }
        else if(!c2){ v2=x; c2=1; }
        else { c1--; c2--; }
    }
    c1=c2=0; for(int x:nums){ if(x==v1) c1++; else if(x==v2) c2++; }
    vector<int> ans; int n=nums.size();
    if(c1>n/3) ans.push_back(v1); if(c2>n/3) ans.push_back(v2);
    return ans;
}"""),
    932: ("Divide construct", "O(n)", "O(n)", """
vector<int> beautifulArray(int n) {
    vector<int> ans={1};
    while((int)ans.size()<n){
        vector<int> nxt;
        for(int x:ans){ if(2*x-1<=n) nxt.push_back(2*x-1); }
        for(int x:ans){ if(2*x<=n) nxt.push_back(2*x); }
        ans.swap(nxt);
    } return ans;
}"""),
    486: ("Minimax DP", "O(n^2)", "O(n)", """
bool PredictTheWinner(vector<int>& nums) {
    int n=nums.size(); vector<vector<int>> dp(n, vector<int>(n));
    for(int i=0;i<n;i++) dp[i][i]=nums[i];
    for(int len=2; len<=n; len++)
        for(int l=0; l+len-1<n; l++){
            int r=l+len-1;
            dp[l][r]=max(nums[l]-dp[l+1][r], nums[r]-dp[l][r-1]);
        }
    return dp[0][n-1]>=0;
}"""),
    846: ("Sort + greedy groups", "O(n log n)", "O(n)", """
bool isNStraightHand(vector<int>& hand, int gs) {
    if(hand.size()%gs) return false;
    map<int,int> cnt; for(int x:hand) cnt[x]++;
    while(!cnt.empty()){
        int start=cnt.begin()->first;
        for(int k=0;k<gs;k++){
            if(!cnt.count(start+k)) return false;
            if(--cnt[start+k]==0) cnt.erase(start+k);
        }
    } return true;
}"""),
    1899: ("Greedy triplet cover", "O(n)", "O(1)", """
bool mergeTriplets(vector<vector<int>>& t, vector<int>& target) {
    bool a=false,b=false,c=false;
    for(auto& x:t){
        if(x[0]<=target[0]&&x[1]<=target[1]&&x[2]<=target[2]){
            if(x[0]==target[0]) a=true;
            if(x[1]==target[1]) b=true;
            if(x[2]==target[2]) c=true;
        }
    } return a&&b&&c;
}"""),
    455: ("Sort + two pointers", "O(n log n)", "O(1)", """
int findContentChildren(vector<int>& g, vector<int>& s) {
    sort(g.begin(),g.end()); sort(s.begin(),s.end());
    int i=0,j=0,ans=0;
    while(i<(int)g.size()&&j<(int)s.size()){
        if(s[j]>=g[i]){ ans++; i++; } j++;
    } return ans;
}"""),
    738: ("Greedy digits", "O(log n)", "O(log n)", """
int monotoneIncreasingDigits(int n) {
    string s=to_string(n);
    int mark=s.size();
    for(int i=(int)s.size()-1;i>0;i--)
        if(s[i]<s[i-1]){ s[i-1]--; mark=i; }
    for(int i=mark;i<(int)s.size();i++) s[i]='9';
    return stoi(s);
}"""),
    807: ("Row/col max", "O(mn)", "O(m+n)", """
int maxIncreaseKeepingSkyline(vector<vector<int>>& g) {
    int m=g.size(), n=g[0].size();
    vector<int> row(m), col(n);
    for(int i=0;i<m;i++) row[i]=*max_element(g[i].begin(),g[i].end());
    for(int j=0;j<n;j++){ int mx=0; for(int i=0;i<m;i++) mx=max(mx,g[i][j]); col[j]=mx; }
    int ans=0;
    for(int i=0;i<m;i++) for(int j=0;j<n;j++) ans += min(row[i],col[j])-g[i][j];
    return ans;
}"""),
    948: ("Two pointers + sort", "O(n log n)", "O(1)", """
int bagOfTokensScore(vector<int>& tokens, int power) {
    sort(tokens.begin(), tokens.end());
    int l=0, r=(int)tokens.size()-1, score=0, ans=0;
    while(l<=r){
        if(power>=tokens[l]){ power-=tokens[l++]; ans=max(ans, ++score); }
        else if(score>0 && l<r){ power+=tokens[r--]; score--; }
        else break;
    } return ans;
}"""),
    871: ("DP + heap", "O(n log n)", "O(n)", """
int minRefuelStops(int target, int startFuel, vector<vector<int>>& stations) {
    priority_queue<int> pq; stations.push_back({target,0});
    int i=0, fuel=startFuel, stops=0;
    while(fuel<target){
        while(i<(int)stations.size() && stations[i][0]<=fuel) pq.push(stations[i++][1]);
        if(pq.empty()) return -1;
        fuel+=pq.top(); pq.pop(); stops++;
    } return stops;
}"""),
    723: ("Simulation", "O((mn)^2)", "O(mn)", """
vector<vector<int>> candyCrush(vector<vector<int>>& b) {
    int m=b.size(), n=b[0].size(); bool crushed=true;
    while(crushed){
        crushed=false;
        for(int i=0;i<m;i++) for(int j=0;j<n-2;j++)
            if(b[i][j]&&abs(b[i][j])==abs(b[i][j+1])&&abs(b[i][j])==abs(b[i][j+2]))
                b[i][j]=b[i][j+1]=b[i][j+2]=-abs(b[i][j]);
        for(int j=0;j<n;j++) for(int i=0;i<m-2;i++)
            if(b[i][j]&&abs(b[i][j])==abs(b[i+1][j])&&abs(b[i][j])==abs(b[i+2][j])
                b[i][j]=b[i+1][j]=b[i+2][j]=-abs(b[i][j]);
        for(int j=0;j<n;j++){
            int write=m-1;
            for(int i=m-1;i>=0;i--) if(b[i][j]>0) b[write--][j]=b[i][j];
            while(write>=0) b[write--][j]=0;
        }
        for(int i=0;i<m;i++) for(int j=0;j<n;j++) if(b[i][j]<0){ b[i][j]=0; crushed=true; }
    } return b;
}"""),
    502: ("Heap greedy", "O(n log n)", "O(n)", """
int findMaximizedCapital(int k, int w, vector<int>& profits, vector<int>& capital) {
    int n=profits.size(); vector<pair<int,int>> projects(n);
    for(int i=0;i<n;i++) projects[i]={capital[i],profits[i]};
    sort(projects.begin(), projects.end());
    priority_queue<int> pq; int i=0;
    while(k--){
        while(i<n && projects[i].first<=w) pq.push(projects[i++].second);
        if(pq.empty()) break;
        w+=pq.top(); pq.pop();
    } return w;
}"""),
    1046: ("Max heap simulation", "O(n log n)", "O(n)", """
int lastStoneWeight(vector<int>& stones) {
    priority_queue<int> pq(stones.begin(), stones.end());
    while(pq.size()>1){ int a=pq.top(); pq.pop(); int b=pq.top(); pq.pop(); if(a!=b) pq.push(a-b); }
    return pq.empty()? 0: pq.top();
}"""),
    355: ("Hash + heap per user", "O(log n) per op", "O(n)", """
class Twitter {
    struct Tweet{ int time,id; };
    int timer=0; unordered_map<int,vector<Tweet>> posts;
    unordered_map<int,unordered_set<int>> follows;
public:
    void postTweet(int userId,int tweetId){ posts[userId].push_back({timer++,tweetId}); }
    vector<int> getNewsFeed(int userId){
        priority_queue<pair<int,int>> pq;
        follows[userId].insert(userId);
        for(int uid:follows[userId]){
            auto& v=posts[uid];
            if(!v.empty()) pq.push({v.back().time, uid});
        }
        vector<int> ans;
        while(!pq.empty() && (int)ans.size()<10){
            auto [t,uid]=pq.top(); pq.pop();
            ans.push_back(posts[uid].back().id);
            posts[uid].pop_back();
            if(!posts[uid].empty()) pq.push({posts[uid].back().time, uid});
        } return ans;
    }
    void follow(int a,int b){ follows[a].insert(b); }
    void unfollow(int a,int b){ follows[a].erase(b); }
};"""),
    857: ("Sort ratio + heap", "O(n log n)", "O(n)", """
double mincostToHireWorkers(vector<int>& quality, vector<int>& wage, int k) {
    int n=quality.size(); vector<pair<double,int>> workers(n);
    for(int i=0;i<n;i++) workers[i]={(double)wage[i]/quality[i], quality[i]};
    sort(workers.begin(), workers.end());
    priority_queue<int> pq; int sumQ=0; double ans=1e18;
    for(auto& [ratio,q]: workers){
        pq.push(q); sumQ+=q;
        if((int)pq.size()>k){ sumQ-=pq.top(); pq.pop(); }
        if((int)pq.size()==k) ans=min(ans, ratio*sumQ);
    } return ans;
}"""),
    480: ("Two heaps window", "O(n log k)", "O(k)", """
vector<double> medianSlidingWindow(vector<int>& nums, int k) {
    multiset<int> lo, hi;
    auto rebalance=[&](){
        while((int)lo.size()>(k+1)/2){ hi.insert(*lo.rbegin()); lo.erase(prev(lo.end())); }
        while((int)lo.size()<(k+1)/2){ lo.insert(*hi.begin()); hi.erase(hi.begin()); }
    };
    vector<double> ans;
    for(int i=0;i<(int)nums.size();i++){
        if(i>=k){ int out=nums[i-k]; if(lo.count(out)) lo.erase(lo.find(out)); else hi.erase(hi.find(out)); }
        if(lo.empty()||nums[i]<=*lo.rbegin()) lo.insert(nums[i]); else hi.insert(nums[i]);
        rebalance();
        if(i>=k-1) ans.push_back(k%2? *lo.rbegin() : ((long long)*lo.rbegin()+*hi.begin())/2.0);
    } return ans;
}"""),
    1851: ("Sort + check query", "O(n log n + q log n)", "O(n)", """
vector<int> minInterval(vector<vector<int>>& iv, vector<int>& queries) {
    sort(iv.begin(), iv.end());
    vector<pair<int,int>> qs; for(int i=0;i<(int)queries.size();i++) qs.push_back({queries[i],i});
    sort(qs.begin(), qs.end());
    priority_queue<pair<int,int>, vector<pair<int,int>>, greater<>> pq;
    vector<int> ans(queries.size(), -1); int j=0;
    for(auto& [q,idx]: qs){
        while(j<(int)iv.size() && iv[j][0]<=q) pq.push({iv[j][1]-iv[j][0]+1, iv[j][1]});
        while(!pq.empty() && pq.top().second<q) pq.pop();
        if(!pq.empty()) ans[idx]=pq.top().first;
    } return ans;
}"""),
    731: ("Map overlap counts", "O(n log n)", "O(n)", """
class MyCalendarTwo {
    map<int,int> timeline;
    void add(int s,int e){ timeline[s]++; timeline[e]--; }
public:
    bool book(int start,int end){
        add(start,end);
        int cur=0;
        for(auto& [t,d]: timeline){
            cur+=d;
            if(cur>=3){ add(start,end); timeline[start]--; timeline[end]++; return false; }
        } return true;
    }
};"""),
    732: ("Segment tree max overlap", "O(n log n)", "O(n)", """
class MyCalendarThree {
    map<int,int> diff;
    void add(int s,int e){ diff[s]++; diff[e]--; }
public:
    int book(int start,int end){
        add(start,end); int cur=0, best=0;
        for(auto& [_,d]: diff){ cur+=d; best=max(best,cur); }
        return best;
    }
};"""),
    1288: ("Sort by end", "O(n log n)", "O(1)", """
int removeCoveredIntervals(vector<vector<int>>& iv) {
    sort(iv.begin(), iv.end(), [](auto& a, auto& b){ return a[0]==b[0]? a[1]>b[1]: a[0]<b[0]; });
    int ans=0, end=-1;
    for(auto& x: iv) if(x[1]>end){ ans++; end=x[1]; }
    return ans;
}"""),
    352: ("Ordered set intervals", "O(n log n)", "O(n)", """
class SummaryRanges {
    set<int> vals;
public:
    void addNum(int value){ vals.insert(value); }
    vector<vector<int>> getIntervals(){
        vector<vector<int>> ans; if(vals.empty()) return ans;
        int start=*vals.begin(), prev=start;
        for(int x: vals){
            if(x>prev+1){ ans.push_back({start,prev}); start=x; }
            prev=x;
        } ans.push_back({start,prev}); return ans;
    }
};"""),
    757: ("Greedy cover", "O(n log n)", "O(1)", """
int intersectionSizeTwo(vector<vector<int>>& intervals) {
    sort(intervals.begin(), intervals.end(), [](auto& a, auto& b){
        return a[1]==b[1]? a[0]>b[0]: a[1]<b[1];
    });
    int ans=0, a=-1, b=-1;
    for(auto& iv: intervals){
        if(iv[0]>a && iv[0]>b){ a=iv[1]-1; b=iv[1]; ans+=2; }
        else if(iv[0]>a){ a=b; b=iv[1]; ans++; }
    } return ans;
}"""),
    616: ("Interval merge bold", "O(n*m)", "O(n)", """
string addBoldTag(string s, vector<string>& dict) {
    vector<bool> bold(s.size());
    for(auto& w: dict) for(size_t i=s.find(w); i!=string::npos; i=s.find(w,i+1))
        fill(bold.begin()+i, bold.begin()+i+w.size(), true);
    string ans; bool open=false;
    for(int i=0;i<(int)s.size();i++){
        if(bold[i]&&!open){ ans+="<b>"; open=true; }
        if(!bold[i]&&open){ ans+="</b>"; open=false; }
        ans+=s[i];
    } if(open) ans+="</b>"; return ans;
}"""),
    61: ("Connect tail to head", "O(n)", "O(1)", """
ListNode* rotateRight(ListNode* head, int k) {
    if(!head||!head->next) return head;
    int n=1; ListNode* tail=head;
    while(tail->next){ tail=tail->next; n++; }
    k%=n; if(!k) return head;
    tail->next=head;
    for(int i=0;i<n-k-1;i++) tail=tail->next;
    head=tail->next; tail->next=nullptr; return head;
}"""),
    86: ("Two lists partition", "O(n)", "O(1)", """
ListNode* partition(ListNode* head, int x) {
    ListNode less(0), great(0), *l=&less, *g=&great;
    while(head){ if(head->val<x){ l->next=head; l=l->next; } else { g->next=head; g=g->next; } head=head->next; }
    l->next=great.next; g->next=nullptr; return less.next;
}"""),
    328: ("Odd even relink", "O(n)", "O(1)", """
ListNode* oddEvenList(ListNode* head) {
    if(!head) return head;
    ListNode *odd=head, *even=head->next, *evenHead=even;
    while(even && even->next){
        odd->next=even->next; odd=odd->next;
        even->next=odd->next; even=even->next;
    } odd->next=evenHead; return head;
}"""),
    445: ("Stack add", "O(m+n)", "O(m+n)", """
ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {
    stack<int> a,b; while(l1){ a.push(l1->val); l1=l1->next; } while(l2){ b.push(l2->val); l2=l2->next; }
    ListNode* head=nullptr; int carry=0;
    while(!a.empty()||!b.empty()||carry){
        int s=carry; if(!a.empty()){ s+=a.top(); a.pop(); } if(!b.empty()){ s+=b.top(); b.pop(); }
        ListNode* node=new ListNode(s%10); node->next=head; head=node; carry=s/10;
    } return head;
}"""),
    430: ("DFS flatten multilevel", "O(n)", "O(n)", """
Node* flatten(Node* head) {
    if(!head) return head;
    Node* cur=head;
    while(cur){
        if(cur->child){
            Node* child=cur->child;
            Node* tail=child;
            while(tail->next) tail=tail->next;
            tail->next=cur->next;
            if(cur->next) cur->next->prev=tail;
            cur->next=child; child->prev=cur; cur->child=nullptr;
        } cur=cur->next;
    } return head;
}"""),
    707: ("Array list design", "O(n)", "O(n)", """
class MyLinkedList {
    vector<int> a;
public:
    int get(int index){ return index>=0&&index<(int)a.size()? a[index]: -1; }
    void addAtHead(int val){ a.insert(a.begin(), val); }
    void addAtTail(int val){ a.push_back(val); }
    void addAtIndex(int index,int val){ if(index>=0&&index<=(int)a.size()) a.insert(a.begin()+index,val); }
    void deleteAtIndex(int index){ if(index>=0&&index<(int)a.size()) a.erase(a.begin()+index); }
};"""),
    109: ("Inorder + build BST", "O(n)", "O(n)", """
TreeNode* sortedListToBST(ListNode* head) {
    vector<int> vals; for(auto p=head;p;p=p->next) vals.push_back(p->val);
    function<TreeNode*(int,int)> build=[&](int l,int r){
        if(l>r) return (TreeNode*)nullptr;
        int m=l+(r-l)/2; TreeNode* root=new TreeNode(vals[m]);
        root->left=build(l,m-1); root->right=build(m+1,r); return root;
    }; return build(0,(int)vals.size()-1);
}"""),
    168: ("Base 26", "O(log n)", "O(1)", """
string convertToTitle(int n) {
    string ans;
    while(n){ n--; ans=char('A'+n%26)+ans; n/=26; }
    return ans;
}"""),
    60: ("Factorial + kth perm", "O(n^2)", "O(n)", """
string getPermutation(int n, int k) {
    string s; vector<int> fact(n+1,1);
    for(int i=1;i<=n;i++) fact[i]=fact[i-1]*i;
    for(int i=1;i<=n;i++) s.push_back('0'+i);
    k--; string ans;
    for(int i=n;i>=1;i--){
        int idx=k/fact[i-1]; ans.push_back(s[idx]); s.erase(s.begin()+idx);
        k%=fact[i-1];
    } return ans;
}"""),
    66: ("Carry propagate", "O(n)", "O(1)", """
vector<int> plusOne(vector<int>& digits) {
    for(int i=(int)digits.size()-1;i>=0;i--){
        if(++digits[i]<10) return digits;
        digits[i]=0;
    } digits.insert(digits.begin(),1); return digits;
}"""),
    166: ("Hash remainder", "O(d)", "O(d)", """
string fractionToDecimal(int num, int den) {
    if(!num) return "0"; string ans=to_string(num/den);
    int rem=abs(num%den); if(!rem) return ans;
    ans+='.'; unordered_map<int,int> seen;
    while(rem && !seen.count(rem)){
        seen[rem]=ans.size(); rem*=10; ans+=to_string(rem/den); rem%=den;
    } if(rem) ans.insert(seen[rem],"("), ans+=')';
    return ans;
}"""),
    593: ("Side lengths", "O(1)", "O(1)", """
bool validSquare(vector<int>& p1, vector<int>& p2, vector<int>& p3, vector<int>& p4) {
    vector<int> d;
    vector<vector<int>> pts={p1,p2,p3,p4};
    for(int i=0;i<4;i++) for(int j=i+1;j<4;j++){
        int dx=pts[i][0]-pts[j][0], dy=pts[i][1]-pts[j][1];
        d.push_back(dx*dx+dy*dy);
    } sort(d.begin(), d.end());
    return d[0]>0 && d[0]==d[1]&&d[1]==d[2]&&d[2]==d[3] && d[4]==d[5] && d[4]==2*d[0];
}"""),
    335: ("Geometry cross", "O(n)", "O(1)", """
bool isSelfCrossing(vector<int>& x) {
    int n=x.size();
    for(int i=3;i<n;i++){
        if(x[i]>=x[i-2] && x[i-1]<=x[i-3]) return true;
        if(i>=4 && x[i-1]==x[i-3] && x[i]+x[i-4]>=x[i-2]) return true;
        if(i>=5 && x[i-2]>=x[i-4] && x[i-1]<=x[i-3] && x[i]+x[i-4]>=x[i-2]) return true;
    } return false;
}"""),
    372: ("Binary exponent mod", "O(log b)", "O(1)", """
int superPow(int a, string b) {
    const int MOD=1337; int res=1; a%=MOD;
    for(char c: b){
        res=(res*10)%MOD;
        int pow=1, base=a;
        for(int k=c-'0';k;k>>=1){ if(k&1) pow=(pow*base)%MOD; base=(base*base)%MOD; }
        res=(res*pow)%MOD;
    } return res;
}"""),
    878: ("Binary search count", "O(log max)", "O(1)", """
int nthMagicalNumber(int n, int a, int b) {
    long long g=__gcd(a,b), lcm=a/g*b;
    auto cnt=[&](long long x){ return x/a + x/b - x/lcm; };
    long long lo=0, hi=1LL*n*min(a,b);
    while(lo<hi){ long long mid=lo+(hi-lo)/2; if(cnt(mid)>=n) hi=mid; else lo=mid+1; }
    return (int)(lo%1000000007);
}"""),
    598: ("Min dimension guess", "O(max(m,n))", "O(1)", """
int maxCount(int m, int n, vector<vector<int>>& ops) {
    int minM=m, minN=n;
    for(auto& o: ops){ minM=min(minM,o[0]); minN=min(minN,o[1]); }
    return minM*minN;
}"""),
    1109: ("Difference array", "O(n)", "O(n)", """
vector<int> corpFlightBookings(vector<vector<int>>& bookings, int n) {
    vector<int> diff(n+1);
    for(auto& b: bookings){ diff[b[0]-1]+=b[2]; diff[b[1]]-=b[2]; }
    vector<int> ans(n); int cur=0;
    for(int i=0;i<n;i++){ cur+=diff[i]; ans[i]=cur; }
    return ans;
}"""),
    1413: ("Prefix min", "O(n)", "O(1)", """
int minStartValue(vector<int>& nums) {
    int sum=0, minSum=0;
    for(int x: nums){ sum+=x; minSum=min(minSum,sum); }
    return 1-minSum;
}"""),
    1480: ("Prefix running", "O(n)", "O(1)", """
vector<int> runningSum(vector<int>& nums) {
    for(int i=1;i<(int)nums.size();i++) nums[i]+=nums[i-1];
    return nums;
}"""),
    1732: ("Prefix max altitude", "O(n)", "O(1)", """
int largestAltitude(vector<int>& gain) {
    int cur=0, best=0; for(int x: gain){ cur+=x; best=max(best,cur); } return best;
}"""),
    2270: ("Prefix split count", "O(n)", "O(1)", """
int waysToSplitArray(vector<int>& nums) {
    long long total=accumulate(nums.begin(), nums.end(), 0LL), left=0; int ans=0;
    for(int i=0;i<(int)nums.size()-1;i++){ left+=nums[i]; if(left>=total-left) ans++; }
    return ans;
}"""),
    862: ("Deque + prefix", "O(n)", "O(n)", """
int shortestSubarray(vector<int>& nums, int k) {
    int n=nums.size(); vector<long long> pre(n+1);
    for(int i=0;i<n;i++) pre[i+1]=pre[i]+nums[i];
    deque<int> dq; int ans=n+1;
    for(int i=0;i<=n;i++){
        while(!dq.empty() && pre[i]-pre[dq.front()]>=k){ ans=min(ans,i-dq.front()); dq.pop_front(); }
        while(!dq.empty() && pre[i]<=pre[dq.back()]) dq.pop_back();
        dq.push_back(i);
    } return ans<=n? ans: -1;
}"""),
    1031: ("Prefix + two windows", "O(n)", "O(n)", """
int maxSumTwoNoOverlap(vector<int>& nums, int firstLen, int secondLen) {
    int n=nums.size(); vector<int> pre(n+1);
    for(int i=0;i<n;i++) pre[i+1]=pre[i]+nums[i];
    auto best=[&](int L,int M){
        int ans=0, bestL=0;
        for(int i=L;i<=n-M;i++){
            bestL=max(bestL, pre[i]-pre[i-L]);
            ans=max(ans, bestL + pre[i+M]-pre[i]);
        } return ans;
    };
    return max(best(firstLen,secondLen), best(secondLen,firstLen));
}"""),
    308: ("2D Fenwick", "O(log mn)", "O(mn)", """
class NumMatrix {
    vector<vector<int>> bit, mat; int m,n;
    void add(int i,int j,int d){ for(int x=i+1;x<=m;x+=x&-x) for(int y=j+1;y<=n;y+=y&-y) bit[x][y]+=d; }
    int sum(int i,int j){ int s=0; for(int x=i+1;x>0;x-=x&-x) for(int y=j+1;y>0;y-=y&-y) s+=bit[x][y]; return s; }
public:
    NumMatrix(vector<vector<int>>& matrix): mat(matrix){
        m=matrix.size(); n=m?matrix[0].size():0; bit.assign(m+1, vector<int>(n+1));
        for(int i=0;i<m;i++) for(int j=0;j<n;j++) add(i,j,matrix[i][j]);
    }
    void update(int row,int col,int val){ add(row,col,val-mat[row][col]); mat[row][col]=val; }
    int sumRegion(int r1,int c1,int r2,int c2){ return sum(r2,c2)-sum(r1-1,c2)-sum(r2,c1-1)+sum(r1-1,c1-1); }
};"""),
    699: ("Sweep + map heights", "O(n log n)", "O(n)", """
vector<int> fallingSquares(vector<vector<int>>& positions) {
    map<int,int> height; height[0]=0; vector<int> ans; int cur=0;
    for(auto& p: positions){
        int l=p[0], r=p[0]+p[1];
        int mx=0; auto it=height.lower_bound(l);
        if(it!=height.begin()) mx=max(mx, prev(it)->second);
        for(; it!=height.end() && it->first<r; it=height.erase(it)) mx=max(mx,it->second);
        height[l]=height[r]=mx+p[1];
        cur=max(cur,mx+p[1]); ans.push_back(cur);
    } return ans;
}"""),
    715: ("Ordered map ranges", "O(n log n)", "O(n)", """
class RangeModule {
    map<int,int> ranges; // start -> end
public:
    void addRange(int left,int right){
        auto it=ranges.upper_bound(left);
        if(it!=ranges.begin()){ auto prev=prev(it); if(prev->second>=left){ left=prev->first; right=max(right,prev->second); ranges.erase(prev); } }
        while(it!=ranges.end() && it->first<=right){ right=max(right,it->second); it=ranges.erase(it); }
        ranges[left]=right;
    }
    bool queryRange(int left,int right){
        auto it=ranges.upper_bound(left); if(it==ranges.begin()) return false;
        return prev(it)->second>=right;
    }
    void removeRange(int left,int right){
        auto it=ranges.upper_bound(left);
        if(it!=ranges.begin()){ auto prevIt=prev(it); if(prevIt->second>left){ if(prevIt->second>right) ranges[right]=prevIt->second; ranges[prevIt->first]=left; } }
        while(it!=ranges.end() && it->first<right){ auto nxt=next(it); if(it->second>right) ranges[right]=it->second; it=ranges.erase(it); if(nxt==it) break; }
    }
};"""),
    274: ("Counting buckets", "O(n)", "O(n)", """
int hIndex(vector<int>& citations) {
    int n=citations.size(); vector<int> cnt(n+1);
    for(int c: citations) cnt[min(c,n)]++;
    int sum=0;
    for(int h=n;h>=0;h--){ sum+=cnt[h]; if(sum>=h) return h; }
    return 0;
}"""),
    324: ("Virtual indexing", "O(n)", "O(1)", """
void wiggleSort(vector<int>& nums) {
    int n=nums.size(); auto at=[&](int i){ return nums[(1+2*i)%(n|1)]; };
    for(int i=0;i<n;i++){
        int target=i;
        for(int j=i;j<n;j++) if(at(j)>at(target)) target=j;
        swap(nums[(1+2*i)%(n|1)], nums[(1+2*target)%(n|1)]);
    }
}"""),
    164: ("Bucket sort radix", "O(n)", "O(n)", """
int maximumGap(vector<int>& nums) {
    if(nums.size()<2) return 0;
    int mn=*min_element(nums.begin(), nums.end()), mx=*max_element(nums.begin(), nums.end());
    int bucketSize=max(1,(mx-mn)/((int)nums.size()-1));
    int bucketCount=(mx-mn)/bucketSize+1;
    vector<pair<int,int>> buckets(bucketCount,{INT_MAX,INT_MIN});
    for(int x: nums){
        int idx=(x-mn)/bucketSize;
        buckets[idx].first=min(buckets[idx].first,x);
        buckets[idx].second=max(buckets[idx].second,x);
    }
    int ans=0, prev=buckets[0].second;
    for(int i=1;i<bucketCount;i++){
        if(buckets[i].first==INT_MAX) continue;
        ans=max(ans, buckets[i].first-prev);
        prev=buckets[i].second;
    } return ans;
}"""),
    1122: ("Counting relative sort", "O(n+m)", "O(m)", """
vector<int> relativeSortArray(vector<int>& arr1, vector<int>& arr2) {
    map<int,int> order; for(int i=0;i<(int)arr2.size();i++) order[arr2[i]]=i;
    vector<int> cnt(1001), extra;
    for(int x: arr1) if(order.count(x)) cnt[x]++; else extra.push_back(x);
    sort(extra.begin(), extra.end());
    vector<int> ans; int ei=0;
    for(int x: arr2) while(cnt[x]--) ans.push_back(x);
    for(int x: extra) ans.push_back(x);
    return ans;
}"""),
    791: ("Order map", "O(n)", "O(1)", """
string customSortString(string order, string s) {
    int rank[26]={}; for(int i=0;i<(int)order.size();i++) rank[order[i]-'a']=i+1;
    sort(s.begin(), s.end(), [&](char a,char b){ return rank[a-'a']<rank[b-'a']; });
    return s;
}"""),
    611: ("Sort + two pointers", "O(n^2)", "O(1)", """
int triangleNumber(vector<int>& nums) {
    sort(nums.begin(), nums.end()); int ans=0;
    for(int i=0;i<(int)nums.size();i++){
        int l=0, r=i-1;
        while(l<r) if(nums[l]+nums[r]>nums[i]){ ans+=r-l; l++; } else r--;
    } return ans;
}"""),
    71: ("Stack path parse", "O(n)", "O(n)", """
string simplifyPath(string path) {
    stack<string> st; string cur;
    for(char c: path+='/'){
        if(c=='/'){ if(cur==".." && !st.empty()) st.pop(); else if(cur!="." && !cur.empty()) st.push(cur); cur.clear(); }
        else cur+=c;
    } string ans; if(st.empty()) return "/";
    while(!st.empty()){ ans="/"+st.top()+ans; st.pop(); } return ans;
}"""),
    1209: ("Stack remove k", "O(n)", "O(n)", """
string removeDuplicates(string s, int k) {
    vector<pair<char,int>> st;
    for(char c: s){
        if(!st.empty() && st.back().first==c){ if(++st.back().second==k) st.pop_back(); }
        else st.push_back({c,1});
    } string ans; for(auto& p: st) ans+=string(p.second,p.first); return ans;
}"""),
    946: ("Greedy match stack", "O(n)", "O(n)", """
bool validateStackSequences(vector<int>& pushed, vector<int>& popped) {
    stack<int> st; int j=0;
    for(int x: pushed){
        st.push(x);
        while(!st.empty() && st.top()==popped[j]){ st.pop(); j++; }
    } return j==(int)popped.size();
}"""),
    856: ("Stack score", "O(n)", "O(n)", """
int scoreOfParentheses(string s) {
    stack<int> st; st.push(0);
    for(char c: s){
        if(c=='(') st.push(0);
        else { int v=st.top(); st.pop(); st.top()+=max(1,2*v); }
    } return st.top();
}"""),
    459: ("KMP prefix", "O(n)", "O(n)", """
bool repeatedSubstringPattern(string s) {
    int n=s.size(); vector<int> lps(n);
    for(int i=1,len=0;i<n;){
        if(s[i]==s[len]) lps[i++]=++len;
        else if(len) len=lps[len-1]; else lps[i++]=0;
    } int len=lps[n-1]; return len>0 && n%(n-len)==0;
}"""),
    6: ("Simulate rows", "O(n)", "O(n)", """
string convert(string s, int numRows) {
    if(numRows==1) return s;
    vector<string> rows(numRows); int r=0, dir=-1;
    for(char c: s){ rows[r]+=c; if(r==0||r==numRows-1) dir*=-1; r+=dir; }
    string ans; for(auto& row: rows) ans+=row; return ans;
}"""),
    12: ("Greedy subtract", "O(1)", "O(1)", """
string intToRoman(int num) {
    vector<pair<int,string>> v={{1000,"M"},{900,"CM"},{500,"D"},{400,"CD"},{100,"C"},{90,"XC"},{50,"L"},{40,"XL"},{10,"X"},{9,"IX"},{5,"V"},{4,"IV"},{1,"I"}};
    string ans; for(auto& [val,sym]: v) while(num>=val){ ans+=sym; num-=val; } return ans;
}"""),
    8: ("Scan atoi", "O(n)", "O(1)", """
int myAtoi(string s) {
    int i=0,n=s.size(), sign=1; long long ans=0;
    while(i<n && isspace(s[i])) i++;
    if(i<n && (s[i]=='+'||s[i]=='-')) sign = s[i++]=='-'? -1: 1;
    while(i<n && isdigit(s[i])){
        ans=ans*10+(s[i++]-'0');
        if(sign*ans>INT_MAX) return INT_MAX;
        if(sign*ans<INT_MIN) return INT_MIN;
    } return (int)(sign*ans);
}"""),
    140: ("DP + backtrack", "O(2^n)", "O(n)", """
void bt(string& s,int i,vector<string>& path,vector<string>& ans,unordered_set<string>& dict,vector<bool>& ok){
    if(i==(int)s.size()){ ans.push_back(""); for(int j=0;j<(int)path.size();j++) ans.back()+=(j?" ":"")+path[j]; return; }
    for(int j=i;j<(int)s.size();j++) if(ok[j+1]&&dict.count(s.substr(i,j-i+1))){
        path.push_back(s.substr(i,j-i+1)); bt(s,j+1,path,ans,dict,ok); path.pop_back();
    }
}
vector<string> wordBreak(string s, vector<string>& wordDict){
    unordered_set<string> dict(wordDict.begin(),wordDict.end());
    int n=s.size(); vector<bool> ok(n+1); ok[n]=true;
    for(int i=n-1;i>=0;i--) for(int j=i;j<n;j++) if(dict.count(s.substr(i,j-i+1))&&ok[j+1]){ ok[i]=true; break; }
    vector<string> ans,path; if(ok[0]) bt(s,0,path,ans,dict,ok); return ans;
}"""),
    115: ("DP count", "O(mn)", "O(n)", """
int numDistinct(string s, string t) {
    int m=s.size(), n=t.size(); vector<unsigned long long> dp(n+1); dp[0]=1;
    for(int i=1;i<=m;i++) for(int j=n;j>=1;j--)
        if(s[i-1]==t[j-1]) dp[j]+=dp[j-1];
    return (int)dp[n];
}"""),
    1448: ("DFS count good", "O(n)", "O(h)", """
int goodNodes(TreeNode* root) {
    function<int(TreeNode*,int)> dfs=[&](TreeNode* u,int mx){
        if(!u) return 0;
        int ans = u->val>=mx;
        mx = max(mx, u->val);
        return ans + dfs(u->left,mx) + dfs(u->right,mx);
    };
    return dfs(root, INT_MIN);
}"""),
    1382: ("Inorder + rebuild", "O(n)", "O(n)", """
void inorder(TreeNode* u, vector<int>& vals){ if(!u) return; inorder(u->left,vals); vals.push_back(u->val); inorder(u->right,vals); }
TreeNode* build(vector<int>& v,int l,int r){
    if(l>r) return nullptr; int m=l+(r-l)/2; TreeNode* root=new TreeNode(v[m]);
    root->left=build(v,l,m-1); root->right=build(v,m+1,r); return root;
}
TreeNode* balanceBST(TreeNode* root){ vector<int> v; inorder(root,v); return build(v,0,(int)v.size()-1); }"""),
    129: ("DFS path sum", "O(n)", "O(h)", """
int sumNumbers(TreeNode* root) { return dfs(root,0); }
int dfs(TreeNode* u,int cur){
    if(!u) return 0;
    cur=cur*10+u->val;
    if(!u->left && !u->right) return cur;
    return dfs(u->left,cur)+dfs(u->right,cur);
}"""),
    1123: ("Postorder depth LCA", "O(n)", "O(h)", """
pair<TreeNode*,int> dfs(TreeNode* u){
    if(!u) return {nullptr,0};
    auto L=dfs(u->left), R=dfs(u->right);
    if(L.second==R.second) return {u,L.second+1};
    return L.second>R.second? make_pair(L.first,L.second+1): make_pair(R.first,R.second+1);
}
TreeNode* lcaDeepestLeaves(TreeNode* root){ return dfs(root).first; }"""),
    99: ("Inorder swap", "O(n)", "O(h)", """
void recoverTree(TreeNode* root) {
    TreeNode *first=nullptr,*second=nullptr,*prev=new TreeNode(INT_MIN);
    function<void(TreeNode*)> in=[&](TreeNode* u){
        if(!u) return; in(u->left);
        if(u->val < prev->val){ second=u; if(!first) first=prev; }
        prev=u; in(u->right);
    }; in(root); swap(first->val, second->val); delete prev;
}"""),
    18: ("Sort + two pointers", "O(n^3)", "O(1)", """
vector<vector<int>> fourSum(vector<int>& nums, int target) {
    sort(nums.begin(), nums.end()); vector<vector<int>> ans; int n=nums.size();
    for(int i=0;i<n;i++){
        if(i && nums[i]==nums[i-1]) continue;
        for(int j=i+1;j<n;j++){
            if(j>i+1 && nums[j]==nums[j-1]) continue;
            long long t=(long long)target-nums[i]-nums[j];
            int l=j+1, r=n-1;
            while(l<r){
                long long s=nums[l]+nums[r];
                if(s==t){ ans.push_back({nums[i],nums[j],nums[l],nums[r]}); while(l<r&&nums[l]==nums[l+1]) l++; while(l<r&&nums[r]==nums[r-1]) r--; l++; r--; }
                else if(s<t) l++; else r--;
            }
        }
    } return ans;
}"""),
    977: ("Two pointers merge", "O(n)", "O(n)", """
vector<int> sortedSquares(vector<int>& nums) {
    int n=nums.size(); vector<int> ans(n);
    int l=0, r=n-1, k=n-1;
    while(l<=r){ int a=nums[l]*nums[l], b=nums[r]*nums[r]; if(a>b){ ans[k--]=a; l++; } else { ans[k--]=b; r--; } }
    return ans;
}"""),
    344: ("Reverse inplace", "O(n)", "O(1)", """
void reverseString(vector<char>& s) {
    for(int l=0,r=(int)s.size()-1;l<r;l++,r--) swap(s[l],s[r]);
}"""),
    844: ("Two pointers backspace", "O(n)", "O(1)", """
bool backspaceCompare(string s, string t) {
    int i=(int)s.size()-1, j=(int)t.size()-1, skipS=0, skipT=0;
    while(i>=0||j>=0){
        while(i>=0){ if(s[i]=='#'){ skipS++; i--; } else if(skipS){ skipS--; i--; } else break; }
        while(j>=0){ if(t[j]=='#'){ skipT++; j--; } else if(skipT){ skipT--; j--; } else break; }
        if(i>=0 && j>=0 && s[i]!=t[j]) return false;
        if((i>=0)!=(j>=0)) return false;
        i--; j--;
    } return true;
}"""),
    845: ("Scan peak extend", "O(n)", "O(1)", """
int longestMountain(vector<int>& arr) {
    int n=arr.size(), ans=0;
    for(int i=1;i+1<n;i++){
        if(arr[i-1]<arr[i] && arr[i]>arr[i+1]){
            int l=i-1, r=i+1;
            while(l>0 && arr[l-1]<arr[l]) l--;
            while(r+1<n && arr[r+1]<arr[r]) r++;
            ans=max(ans, r-l+1);
        }
    } return ans;
}"""),
    2179: ("Map + BIT", "O(n log n)", "O(n)", """
long long goodTriplets(vector<int>& nums1, vector<int>& nums2) {
    int n=nums1.size(); vector<int> pos(n+1), bit(n+2);
    auto add=[&](int i){ for(++i;i<=n+1;i+=i&-i) bit[i]++; };
    auto sum=[&](int i){ int s=0; for(++i;i>0;i-=i&-i) s+=bit[i]; return s; };
    for(int i=0;i<n;i++) pos[nums2[i]]=i+1;
    long long ans=0, left=0;
    for(int x: nums1){
        int p=pos[x];
        long long less=sum(p-1), greater=left-less;
        ans += less*(n-p-(left-less));
        add(p); left++;
    } return ans;
}"""),
    1649: ("BIT inversion cost", "O(n log n)", "O(n)", """
int createSortedArray(vector<int>& instructions) {
    const int MOD=1e9+7; vector<int> bit(100002);
    auto add=[&](int i,int v){ for(++i;i<(int)bit.size();i+=i&-i) bit[i]+=v; };
    auto sum=[&](int i){ int s=0; for(++i;i>0;i-=i&-i) s+=bit[i]; return s; };
    long long cost=0;
    for(int x: instructions){
        long long less=sum(x-1), greater=sum(100000)-sum(x);
        cost=(cost+min(less,greater))%MOD; add(x,1);
    } return (int)cost;
}"""),
    2736: ("Sort + multiset", "O((n+q) log n)", "O(n)", """
vector<int> maximumSumQueries(vector<int>& nums1, vector<int>& nums2, vector<vector<int>>& queries) {
    int n=nums1.size(), m=queries.size();
    vector<tuple<int,int,int,int>> qs(m);
    for(int i=0;i<m;i++) qs[i]={queries[i][0],queries[i][1],i,0};
    sort(qs.begin(), qs.end(), greater<>());
    vector<pair<int,int>> pts(n);
    for(int i=0;i<n;i++) pts[i]={nums1[i],nums2[i]};
    sort(pts.begin(), pts.end(), greater<>());
    multiset<int> best; vector<int> ans(m,-1); int j=0;
    for(auto& [x,y,idx,_]: qs){
        while(j<n && pts[j].first>=x){ best.insert(pts[j].first+pts[j].second); j++; }
        auto it=best.lower_bound(y);
        if(it!=best.end()) ans[idx]=*it;
    } return ans;
}"""),
    2407: ("Segment tree DP", "O(n log V)", "O(V)", """
int lengthOfLIS(vector<int>& nums, int k) {
    int best=0; map<int,int> bit;
    auto update=[&](int key,int val){
        for(auto it=bit.lower_bound(key); it!=bit.end(); ++it){
            if(it->second>=val) break;
            it->second=val;
        }
        bit[key]=max(bit[key], val);
        best=max(best,val);
    };
    for(int x: nums){
        int cur=1;
        auto it=bit.upper_bound(x-k);
        if(it!=bit.begin()){ --it; cur=it->second+1; }
        update(x,cur);
    } return best;
}"""),
}
