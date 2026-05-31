window.PRACTICE_TOPIC = {
  "id": "math",
  "title": "Math & Number Theory",
  "expected_count": 20,
  "strategy": "<strong>Speed-run:</strong> GCD, sieve, fast pow, modular arithmetic. Filter <em>Must do</em> first.",
  "subtopics": [
    {
      "id": "sieve",
      "label": "Sieve"
    },
    {
      "id": "gcd",
      "label": "GCD/LCM"
    },
    {
      "id": "fast-pow",
      "label": "Fast Pow"
    },
    {
      "id": "combinatorics",
      "label": "Combinatorics"
    },
    {
      "id": "geometry",
      "label": "Geometry"
    },
    {
      "id": "mod",
      "label": "Modular"
    }
  ],
  "questions": [
    {
      "id": "ma-01",
      "title": "Count Primes",
      "lc": 204,
      "importance": "must",
      "subtopic": "sieve",
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
          "name": "Sieve",
          "time": "O(n log log n)",
          "space": "O(n)",
          "code": "int countPrimes(int n) {\n    if (n<=2) return 0; vector<bool> prime(n,true); prime[0]=prime[1]=false;\n    for (int i=2;i*i<n;i++) if (prime[i]) for (int j=i*i;j<n;j+=i) prime[j]=false;\n    return count(prime.begin(), prime.end(), true);\n}"
        }
      ]
    },
    {
      "id": "ma-02",
      "title": "Pow(x, n)",
      "lc": 50,
      "importance": "must",
      "subtopic": "fast-pow",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "x,n",
          "out": "x^n"
        }
      ],
      "approaches": [
        {
          "name": "Fast pow",
          "time": "O(log n)",
          "space": "O(1)",
          "code": "double myPow(double x, int n) {\n    long long N = n; if (N < 0) { x = 1/x; N = -N; }\n    double ans = 1, cur = x;\n    while (N) { if (N&1) ans *= cur; cur *= cur; N >>= 1; }\n    return ans;\n}"
        }
      ]
    },
    {
      "id": "ma-03",
      "title": "GCD / LCM basics",
      "lc": null,
      "importance": "must",
      "subtopic": "gcd",
      "difficulty": "Easy",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "a,b",
          "out": "gcd"
        }
      ],
      "approaches": [
        {
          "name": "Optimal",
          "time": "O(n)",
          "space": "O(n)",
          "code": "// Pattern: gcd\n// Implement optimal C++ for gcd"
        }
      ]
    },
    {
      "id": "ma-04",
      "title": "Excel Sheet Column Title",
      "lc": 168,
      "importance": "nice",
      "subtopic": "base",
      "difficulty": "Easy",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "n",
          "out": "title"
        }
      ],
      "approaches": [
        {
          "name": "Base 26",
          "time": "O(log n)",
          "space": "O(1)",
          "code": "string convertToTitle(int n) {\n    string ans;\n    while(n){ n--; ans=char('A'+n%26)+ans; n/=26; }\n    return ans;\n}"
        }
      ]
    },
    {
      "id": "ma-05",
      "title": "Factorial Trailing Zeroes",
      "lc": 172,
      "importance": "should",
      "subtopic": "math",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "n",
          "out": "zeros"
        }
      ],
      "approaches": [
        {
          "name": "Optimal",
          "time": "O(n)",
          "space": "O(n)",
          "code": "// Pattern: math\n// Implement optimal C++ for LC 172"
        }
      ]
    },
    {
      "id": "ma-06",
      "title": "Happy Number",
      "lc": 202,
      "importance": "should",
      "subtopic": "cycle",
      "difficulty": "Easy",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "n",
          "out": "happy?"
        }
      ],
      "approaches": [
        {
          "name": "Floyd cycle on squares",
          "time": "O(log n)",
          "space": "O(1)",
          "code": "int sqSum(int n){ int s=0; while(n){ s+= (n%10)*(n%10); n/=10; } return s; }\nbool isHappy(int n) {\n    int slow=n, fast=n;\n    do { slow=sqSum(slow); fast=sqSum(sqSum(fast)); } while (slow!=fast);\n    return slow==1;\n}"
        }
      ]
    },
    {
      "id": "ma-07",
      "title": "Max Points on a Line",
      "lc": 149,
      "importance": "should",
      "subtopic": "geometry",
      "difficulty": "Hard",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "points",
          "out": "max"
        }
      ],
      "approaches": [
        {
          "name": "Optimal",
          "time": "O(n)",
          "space": "O(n)",
          "code": "// Pattern: geometry\n// Implement optimal C++ for LC 149"
        }
      ]
    },
    {
      "id": "ma-08",
      "title": "Pascal's Triangle",
      "lc": 118,
      "importance": "should",
      "subtopic": "combinatorics",
      "difficulty": "Easy",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "numRows",
          "out": "triangle"
        }
      ],
      "approaches": [
        {
          "name": "Optimal",
          "time": "O(n)",
          "space": "O(n)",
          "code": "// Pattern: combinatorics\n// Implement optimal C++ for LC 118"
        }
      ]
    },
    {
      "id": "ma-09",
      "title": "Permutation Sequence",
      "lc": 60,
      "importance": "nice",
      "subtopic": "combinatorics",
      "difficulty": "Hard",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "n,k",
          "out": "perm"
        }
      ],
      "approaches": [
        {
          "name": "Factorial + kth perm",
          "time": "O(n^2)",
          "space": "O(n)",
          "code": "string getPermutation(int n, int k) {\n    string s; vector<int> fact(n+1,1);\n    for(int i=1;i<=n;i++) fact[i]=fact[i-1]*i;\n    for(int i=1;i<=n;i++) s.push_back('0'+i);\n    k--; string ans;\n    for(int i=n;i>=1;i--){\n        int idx=k/fact[i-1]; ans.push_back(s[idx]); s.erase(s.begin()+idx);\n        k%=fact[i-1];\n    } return ans;\n}"
        }
      ]
    },
    {
      "id": "ma-10",
      "title": "Next Permutation",
      "lc": 31,
      "importance": "should",
      "subtopic": "array",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "nums",
          "out": "next"
        }
      ],
      "approaches": [
        {
          "name": "Next permutation",
          "time": "O(n)",
          "space": "O(1)",
          "code": "void nextPermutation(vector<int>& nums) {\n    int i=(int)nums.size()-2;\n    while (i>=0 && nums[i]>=nums[i+1]) i--;\n    if (i>=0) { int j=(int)nums.size()-1; while (nums[j]<=nums[i]) j--; swap(nums[i],nums[j]); }\n    reverse(nums.begin()+i+1, nums.end());\n}"
        }
      ]
    },
    {
      "id": "ma-11",
      "title": "Reverse Integer",
      "lc": 7,
      "importance": "should",
      "subtopic": "overflow",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "x",
          "out": "reversed"
        }
      ],
      "approaches": [
        {
          "name": "Optimal",
          "time": "O(n)",
          "space": "O(n)",
          "code": "// Pattern: overflow\n// Implement optimal C++ for LC 7"
        }
      ]
    },
    {
      "id": "ma-12",
      "title": "Plus One",
      "lc": 66,
      "importance": "nice",
      "subtopic": "array",
      "difficulty": "Easy",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "digits",
          "out": "plus one"
        }
      ],
      "approaches": [
        {
          "name": "Carry propagate",
          "time": "O(n)",
          "space": "O(1)",
          "code": "vector<int> plusOne(vector<int>& digits) {\n    for(int i=(int)digits.size()-1;i>=0;i--){\n        if(++digits[i]<10) return digits;\n        digits[i]=0;\n    } digits.insert(digits.begin(),1); return digits;\n}"
        }
      ]
    },
    {
      "id": "ma-13",
      "title": "Multiply Strings",
      "lc": 43,
      "importance": "should",
      "subtopic": "math",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "num1,num2",
          "out": "product"
        }
      ],
      "approaches": [
        {
          "name": "Optimal",
          "time": "O(n)",
          "space": "O(n)",
          "code": "// Pattern: math\n// Implement optimal C++ for LC 43"
        }
      ]
    },
    {
      "id": "ma-14",
      "title": "Fraction to Recurring Decimal",
      "lc": 166,
      "importance": "nice",
      "subtopic": "hashmap",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "numer,denom",
          "out": "string"
        }
      ],
      "approaches": [
        {
          "name": "Hash remainder",
          "time": "O(d)",
          "space": "O(d)",
          "code": "string fractionToDecimal(int num, int den) {\n    if(!num) return \"0\"; string ans=to_string(num/den);\n    int rem=abs(num%den); if(!rem) return ans;\n    ans+='.'; unordered_map<int,int> seen;\n    while(rem && !seen.count(rem)){\n        seen[rem]=ans.size(); rem*=10; ans+=to_string(rem/den); rem%=den;\n    } if(rem) ans.insert(seen[rem],\"(\"), ans+=')';\n    return ans;\n}"
        }
      ]
    },
    {
      "id": "ma-15",
      "title": "Valid Square",
      "lc": 593,
      "importance": "nice",
      "subtopic": "geometry",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "points",
          "out": "square?"
        }
      ],
      "approaches": [
        {
          "name": "Side lengths",
          "time": "O(1)",
          "space": "O(1)",
          "code": "bool validSquare(vector<int>& p1, vector<int>& p2, vector<int>& p3, vector<int>& p4) {\n    vector<int> d;\n    vector<vector<int>> pts={p1,p2,p3,p4};\n    for(int i=0;i<4;i++) for(int j=i+1;j<4;j++){\n        int dx=pts[i][0]-pts[j][0], dy=pts[i][1]-pts[j][1];\n        d.push_back(dx*dx+dy*dy);\n    } sort(d.begin(), d.end());\n    return d[0]>0 && d[0]==d[1]&&d[1]==d[2]&&d[2]==d[3] && d[4]==d[5] && d[4]==2*d[0];\n}"
        }
      ]
    },
    {
      "id": "ma-16",
      "title": "Self Crossing",
      "lc": 335,
      "importance": "nice",
      "subtopic": "geometry",
      "difficulty": "Hard",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "distance",
          "out": "cross?"
        }
      ],
      "approaches": [
        {
          "name": "Geometry cross",
          "time": "O(n)",
          "space": "O(1)",
          "code": "bool isSelfCrossing(vector<int>& x) {\n    int n=x.size();\n    for(int i=3;i<n;i++){\n        if(x[i]>=x[i-2] && x[i-1]<=x[i-3]) return true;\n        if(i>=4 && x[i-1]==x[i-3] && x[i]+x[i-4]>=x[i-2]) return true;\n        if(i>=5 && x[i-2]>=x[i-4] && x[i-1]<=x[i-3] && x[i]+x[i-4]>=x[i-2]) return true;\n    } return false;\n}"
        }
      ]
    },
    {
      "id": "ma-17",
      "title": "Perfect Squares",
      "lc": 279,
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
          "out": "min squares"
        }
      ],
      "approaches": [
        {
          "name": "Optimal",
          "time": "O(n)",
          "space": "O(n)",
          "code": "// Pattern: dp\n// Implement optimal C++ for LC 279"
        }
      ]
    },
    {
      "id": "ma-18",
      "title": "Super Pow",
      "lc": 372,
      "importance": "nice",
      "subtopic": "mod",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "a,b123",
          "out": "a^b mod"
        }
      ],
      "approaches": [
        {
          "name": "Binary exponent mod",
          "time": "O(log b)",
          "space": "O(1)",
          "code": "int superPow(int a, string b) {\n    const int MOD=1337; int res=1; a%=MOD;\n    for(char c: b){\n        res=(res*10)%MOD;\n        int pow=1, base=a;\n        for(int k=c-'0';k;k>>=1){ if(k&1) pow=(pow*base)%MOD; base=(base*base)%MOD; }\n        res=(res*pow)%MOD;\n    } return res;\n}"
        }
      ]
    },
    {
      "id": "ma-19",
      "title": "Random Pick with Weight",
      "lc": 528,
      "importance": "should",
      "subtopic": "prefix",
      "difficulty": "Medium",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "w",
          "out": "index"
        }
      ],
      "approaches": [
        {
          "name": "Optimal",
          "time": "O(n)",
          "space": "O(n)",
          "code": "// Pattern: prefix\n// Implement optimal C++ for LC 528"
        }
      ]
    },
    {
      "id": "ma-20",
      "title": "Nth Magical Number",
      "lc": 878,
      "importance": "nice",
      "subtopic": "binary-search",
      "difficulty": "Hard",
      "constraints": [
        "Standard LeetCode constraints apply",
        "Optimize for time and memory at interview scale"
      ],
      "examples": [
        {
          "in": "n,m",
          "out": "number"
        }
      ],
      "approaches": [
        {
          "name": "Binary search count",
          "time": "O(log max)",
          "space": "O(1)",
          "code": "int nthMagicalNumber(int n, int a, int b) {\n    long long g=__gcd(a,b), lcm=a/g*b;\n    auto cnt=[&](long long x){ return x/a + x/b - x/lcm; };\n    long long lo=0, hi=1LL*n*min(a,b);\n    while(lo<hi){ long long mid=lo+(hi-lo)/2; if(cnt(mid)>=n) hi=mid; else lo=mid+1; }\n    return (int)(lo%1000000007);\n}"
        }
      ]
    }
  ]
};
