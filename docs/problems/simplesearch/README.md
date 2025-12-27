# Simple Search with Autocomplete

## Overview
A lightweight search system with autocomplete/typeahead functionality using Trie data structure for efficient prefix matching. Supports real-time suggestions, ranking by frequency, and fuzzy matching for typo tolerance. Essential for search boxes, command palettes, and form inputs.

**Difficulty:** Medium  
**Domain:** Search, Data Structures  
**Interview Frequency:** Very High (Google, Amazon, Yelp, Booking.com)

## Requirements

### Functional Requirements
1. **Word Addition**
   - Add words/phrases to dictionary
   - Track word frequency/popularity
   - Handle case-insensitive matching
   - Support special characters

2. **Autocomplete Search**
   - Return suggestions for any prefix
   - Limit results (typically 5-10)
   - Rank by frequency/relevance
   - Sub-second response time

3. **Search Operations**
   - Exact match search
   - Prefix search
   - Contains search
   - Fuzzy search (typo tolerance)

4. **Management**
   - Remove words
   - Update frequencies
   - Clear dictionary
   - Get word count

### Non-Functional Requirements
1. **Performance**
   - Autocomplete: < 50ms for 10 suggestions
   - Insert: < 10ms per word
   - Memory efficient for millions of words

2. **Scalability**
   - Support 10M+ words
   - Handle 1000+ queries/second
   - Horizontal scaling

3. **Accuracy**
   - Relevant suggestions
   - Typo tolerance (edit distance)
   - Context-aware ranking

## System Architecture

```
┌─────────────────────────────────────────┐
│          Search Input Box                │
│  User types: "appl"                      │
└──────────────┬──────────────────────────┘
               │
               ▼
    ┌──────────────────────┐
    │  Autocomplete API    │
    │  getSuggestions()    │
    └──────────┬───────────┘
               │
               ▼
    ┌──────────────────────┐
    │   Prefix Matcher     │
    │   (Trie Traversal)   │
    └──────────┬───────────┘
               │
               ▼
    ┌──────────────────────┐
    │   Trie Data Store    │
    │                      │
    │       root           │
    │        |             │
    │        a             │
    │        |             │
    │        p             │
    │        |             │
    │        p* (freq:50)  │
    │       / \            │
    │      l   r           │
    │      |   |           │
    │      e*  e*          │
    │   (apple) (appreciate)│
    └──────────────────────┘
               │
               ▼
    ┌──────────────────────┐
    │   Ranking Engine     │
    │  (Frequency-based)   │
    └──────────┬───────────┘
               │
               ▼
    ┌──────────────────────┐
    │  Top-K Selector      │
    │  (Return 5-10)       │
    └──────────┬───────────┘
               │
               ▼
        Suggestions List:
        1. apple (freq: 100)
        2. application (freq: 80)
        3. apply (freq: 60)
```

## Core Data Structure: Trie

### TrieNode Structure
```java
class TrieNode {
    private Map<Character, TrieNode> children;
    private boolean isEndOfWord;
    private String word;
    private int frequency;
    private List<String> topSuggestions; // Cached top-K
    
    public TrieNode() {
        this.children = new HashMap<>();
        this.isEndOfWord = false;
        this.frequency = 0;
        this.topSuggestions = new ArrayList<>();
    }
    
    public TrieNode getChild(char c) {
        return children.get(c);
    }
    
    public void addChild(char c, TrieNode node) {
        children.put(c, node);
    }
    
    public boolean hasChild(char c) {
        return children.containsKey(c);
    }
}
```

### Visual Example
```
Dictionary: ["apple", "app", "application", "appreciate", "apricot"]

Trie Structure:
        root
         |
         a
         |
         p
         |
         p* (word: "app", freq: 50)
        / \
       l   r
       |   |
       e*  e
      (apple)  |
          c   i
          |   |
          i   c
          |   |
          a   o
          |   |
          t*  t*
      (application) (apricot)
          |
          e*
      (appreciate)

* = end of word marker
```

## Key Algorithms

### 1. Insert Word
```java
public void insert(String word, int frequency) {
    word = word.toLowerCase();
    TrieNode current = root;
    
    // Traverse/create path
    for (char c : word.toCharArray()) {
        if (!current.hasChild(c)) {
            current.addChild(c, new TrieNode());
        }
        current = current.getChild(c);
    }
    
    // Mark end of word
    current.setEndOfWord(true);
    current.setWord(word);
    current.setFrequency(current.getFrequency() + frequency);
}
```

**Time Complexity:** O(L) where L = word length  
**Space Complexity:** O(L) for new words

### 2. Autocomplete Search
```java
public List<String> autocomplete(String prefix, int limit) {
    prefix = prefix.toLowerCase();
    TrieNode current = root;
    
    // Step 1: Navigate to prefix node - O(P)
    for (char c : prefix.toCharArray()) {
        if (!current.hasChild(c)) {
            return Collections.emptyList(); // No suggestions
        }
        current = current.getChild(c);
    }
    
    // Step 2: Collect all words with this prefix - O(N)
    List<WordFrequency> words = new ArrayList<>();
    collectWords(current, prefix, words);
    
    // Step 3: Sort by frequency - O(N log N)
    words.sort((a, b) -> b.frequency - a.frequency);
    
    // Step 4: Return top K - O(K)
    return words.stream()
        .limit(limit)
        .map(wf -> wf.word)
        .collect(Collectors.toList());
}

private void collectWords(TrieNode node, String prefix, List<WordFrequency> words) {
    if (node.isEndOfWord()) {
        words.add(new WordFrequency(node.getWord(), node.getFrequency()));
    }
    
    for (Map.Entry<Character, TrieNode> entry : node.getChildren().entrySet()) {
        collectWords(entry.getValue(), prefix + entry.getKey(), words);
    }
}
```

**Time Complexity:** O(P + N log N + K)
- P = prefix length
- N = words with prefix
- K = limit

**Space Complexity:** O(N) for collecting words

### 3. Optimized Top-K (Cached at Each Node)
```java
public class OptimizedTrie {
    private static final int CACHE_SIZE = 10;
    
    public void insert(String word, int frequency) {
        TrieNode current = root;
        
        for (char c : word.toCharArray()) {
            if (!current.hasChild(c)) {
                current.addChild(c, new TrieNode());
            }
            current = current.getChild(c);
            
            // Update top suggestions cache at each node
            updateTopSuggestions(current, word, frequency);
        }
        
        current.setEndOfWord(true);
        current.setWord(word);
        current.setFrequency(frequency);
    }
    
    private void updateTopSuggestions(TrieNode node, String word, int frequency) {
        List<WordFrequency> top = node.getTopSuggestions();
        
        // Add new word
        top.add(new WordFrequency(word, frequency));
        
        // Sort and keep only top K
        top.sort((a, b) -> b.frequency - a.frequency);
        if (top.size() > CACHE_SIZE) {
            top.remove(top.size() - 1);
        }
    }
    
    public List<String> autocompleteFast(String prefix, int limit) {
        TrieNode current = root;
        
        // Navigate to prefix
        for (char c : prefix.toCharArray()) {
            if (!current.hasChild(c)) {
                return Collections.emptyList();
            }
            current = current.getChild(c);
        }
        
        // Return cached top suggestions - O(1)!
        return current.getTopSuggestions().stream()
            .limit(limit)
            .map(wf -> wf.word)
            .collect(Collectors.toList());
    }
}
```

**Time Complexity:** O(P) - dramatically faster!  
**Space Complexity:** O(N * K) - extra cache storage

### 4. Fuzzy Search (Edit Distance)
```java
public List<String> fuzzySearch(String query, int maxDistance) {
    List<String> results = new ArrayList<>();
    fuzzySearchHelper(root, "", query, 0, maxDistance, results);
    return results;
}

private void fuzzySearchHelper(TrieNode node, String current, String query, 
                               int index, int maxDistance, List<String> results) {
    
    if (node.isEndOfWord()) {
        int distance = editDistance(current, query);
        if (distance <= maxDistance) {
            results.add(current);
        }
    }
    
    if (index >= query.length() && maxDistance == 0) {
        return;
    }
    
    for (Map.Entry<Character, TrieNode> entry : node.getChildren().entrySet()) {
        char c = entry.getKey();
        TrieNode child = entry.getValue();
        
        if (index < query.length() && c == query.charAt(index)) {
            // Exact match
            fuzzySearchHelper(child, current + c, query, index + 1, maxDistance, results);
        } else if (maxDistance > 0) {
            // Allow typo
            fuzzySearchHelper(child, current + c, query, index + 1, maxDistance - 1, results);
        }
    }
}

private int editDistance(String s1, String s2) {
    int[][] dp = new int[s1.length() + 1][s2.length() + 1];
    
    for (int i = 0; i <= s1.length(); i++) {
        for (int j = 0; j <= s2.length(); j++) {
            if (i == 0) {
                dp[i][j] = j;
            } else if (j == 0) {
                dp[i][j] = i;
            } else if (s1.charAt(i - 1) == s2.charAt(j - 1)) {
                dp[i][j] = dp[i - 1][j - 1];
            } else {
                dp[i][j] = 1 + Math.min(dp[i - 1][j - 1], 
                                 Math.min(dp[i - 1][j], dp[i][j - 1]));
            }
        }
    }
    
    return dp[s1.length()][s2.length()];
}
```

## Design Patterns

### 1. Flyweight Pattern (Memory Optimization)
```java
class TrieNodeFactory {
    private static final Map<String, TrieNode> nodeCache = new HashMap<>();
    
    public static TrieNode getNode(String key) {
        return nodeCache.computeIfAbsent(key, k -> new TrieNode());
    }
}
```

### 2. Strategy Pattern (Ranking)
```java
interface RankingStrategy {
    List<String> rank(List<WordFrequency> words, int limit);
}

class FrequencyRanking implements RankingStrategy {
    public List<String> rank(List<WordFrequency> words, int limit) {
        return words.stream()
            .sorted((a, b) -> b.frequency - a.frequency)
            .limit(limit)
            .map(wf -> wf.word)
            .collect(Collectors.toList());
    }
}

class RecencyRanking implements RankingStrategy {
    public List<String> rank(List<WordFrequency> words, int limit) {
        return words.stream()
            .sorted((a, b) -> b.lastAccessTime - a.lastAccessTime)
            .limit(limit)
            .map(wf -> wf.word)
            .collect(Collectors.toList());
    }
}
```

### 3. Builder Pattern (Configuration)
```java
Autocomplete ac = Autocomplete.builder()
    .caseSensitive(false)
    .maxSuggestions(10)
    .cacheTopK(true)
    .fuzzyMatching(true)
    .maxEditDistance(2)
    .build();
```

## Source Code

📄 **[View Complete Source Code](/problems/simplesearch/CODE)**

**Key Files:**
- [`Autocomplete.java`](/problems/simplesearch/CODE#autocompletejava) - Main implementation
- [`TrieNode.java`](/problems/simplesearch/CODE#trienodejava) - Trie node structure
- [`SearchService.java`](/problems/simplesearch/CODE#searchservicejava) - Service interface

**Total Lines of Code:** ~300 lines

## Usage Example

```java
// Initialize autocomplete
Autocomplete ac = new Autocomplete();

// Add words with frequencies
ac.insert("apple", 100);
ac.insert("application", 80);
ac.insert("apply", 60);
ac.insert("appreciate", 40);
ac.insert("apricot", 20);

// Get suggestions
List<String> suggestions = ac.autocomplete("app", 5);
System.out.println(suggestions);
// Output: [apple, application, apply]

// Fuzzy search (typo tolerance)
List<String> fuzzy = ac.fuzzySearch("aple", 1); // 1 edit distance
// Output: [apple]

// Contains search
List<String> contains = ac.search("plic"); // Contains "plic"
// Output: [application]

// Update frequency
ac.updateFrequency("apply", 150); // Now most popular

// Remove word
ac.remove("apricot");
```

## Common Interview Questions

### System Design Questions

1. **How do you handle millions of words efficiently?**
   - Use Trie for O(P) prefix search
   - Cache top-K at each node
   - Compress common prefixes
   - Use HashMap for children (vs array)

2. **How do you implement real-time suggestions as user types?**
   - Async search (non-blocking)
   - Debouncing (wait 200ms after last keystroke)
   - Cancel previous request if new input
   - Progressive results (show 3, then 10)

3. **How do you rank suggestions?**
   - Frequency-based (popularity)
   - Recency-based (recent searches)
   - Personalized (user history)
   - Context-aware (location, time)

4. **How do you scale for millions of users?**
   - Cache frequent prefixes (Redis)
   - CDN for static dictionaries
   - Sharding by prefix (a-m, n-z)
   - Read replicas

### Coding Questions

1. **Implement Trie insertion**
   ```java
   public void insert(String word) {
       TrieNode current = root;
       for (char c : word.toCharArray()) {
           current.children.putIfAbsent(c, new TrieNode());
           current = current.children.get(c);
       }
       current.isEndOfWord = true;
   }
   ```

2. **Find all words with prefix "app"**
   ```java
   public List<String> wordsWithPrefix(String prefix) {
       TrieNode node = searchPrefix(prefix);
       if (node == null) return Collections.emptyList();
       
       List<String> result = new ArrayList<>();
       dfs(node, prefix, result);
       return result;
   }
   ```

3. **Count words in Trie**
   ```java
   public int countWords(TrieNode node) {
       if (node == null) return 0;
       
       int count = node.isEndOfWord ? 1 : 0;
       for (TrieNode child : node.children.values()) {
           count += countWords(child);
       }
       return count;
   }
   ```

### Algorithm Questions
1. **Time complexity of autocomplete?** → O(P + N log N + K)
2. **Space complexity of Trie?** → O(ALPHABET_SIZE * N * L)
3. **How to optimize for top-K?** → Cache at each node: O(P + K)

## Trade-offs & Design Decisions

### 1. Array vs HashMap for Children
**Array[26]:** Fast O(1), wastes space for sparse  
**HashMap:** Compact, slightly slower

**Decision:** HashMap for flexibility (supports unicode)

### 2. Eager vs Lazy Computation
**Eager:** Pre-compute top-K at each node  
**Lazy:** Compute on-demand

**Decision:** Eager for hot prefixes, lazy for cold

### 3. Case Sensitivity
**Sensitive:** Separate "Apple" and "apple"  
**Insensitive:** Convert to lowercase

**Decision:** Insensitive (better UX)

### 4. Memory vs Speed
**More Memory:** Cache top-K at each node (fast)  
**Less Memory:** Compute on-demand (slower)

**Decision:** Cache for top 1000 prefixes only

## Performance Optimizations

### 1. Prefix Caching
```java
private LRUCache<String, List<String>> prefixCache;

public List<String> autocomplete(String prefix, int limit) {
    // Check cache first
    if (prefixCache.containsKey(prefix)) {
        return prefixCache.get(prefix);
    }
    
    // Compute
    List<String> results = computeAutocomplete(prefix, limit);
    
    // Cache
    prefixCache.put(prefix, results);
    
    return results;
}
```

**Cache Hit Ratio:** 80-90% for common prefixes

### 2. Incremental Search
```java
public class IncrementalSearch {
    private TrieNode currentNode = root;
    private String currentPrefix = "";
    
    public List<String> addChar(char c) {
        currentPrefix += c;
        
        if (currentNode != null && currentNode.hasChild(c)) {
            currentNode = currentNode.getChild(c);
            return currentNode.getTopSuggestions();
        }
        
        currentNode = null;
        return Collections.emptyList();
    }
    
    public void reset() {
        currentNode = root;
        currentPrefix = "";
    }
}
```

### 3. Compressed Trie (Radix Tree)
Merge single-child nodes to save space.

```
Before:          After:
  a                a
  |               "pple"
  p                END
  |
  p
  |
  l
  |
  e
  |
 END

Space savings: 40-60% for English words
```

## Key Takeaways

### What Interviewers Look For
1. ✅ **Trie implementation** for prefix search
2. ✅ **Top-K algorithm** for ranking
3. ✅ **Optimization** (caching, top-K at nodes)
4. ✅ **Fuzzy matching** for typo tolerance
5. ✅ **Scalability** considerations
6. ✅ **Trade-off discussions**

### Common Mistakes to Avoid
1. ❌ Using linear search (O(N) per query)
2. ❌ Sorting all words every time (use heap)
3. ❌ Not caching frequent prefixes
4. ❌ Storing full words at every node
5. ❌ Not handling case sensitivity
6. ❌ No limit on results returned

### Production-Ready Checklist
- [x] Trie data structure
- [x] Frequency-based ranking
- [x] Top-K suggestions
- [x] Case-insensitive matching
- [ ] Fuzzy search (edit distance)
- [ ] Prefix caching (LRU)
- [ ] Persistence to disk
- [ ] Distributed Trie
- [ ] Real-time updates
- [ ] Monitoring & metrics

---

## Related Problems
- 🔍 **Search Engine** - Full-text search
- 📝 **Autocomplete (Advanced)** - Context-aware
- 🎯 **Spell Checker** - Edit distance
- 📚 **Dictionary** - Word lookup

## References
- Trie Data Structure: Knuth's "The Art of Computer Programming"
- Google Suggest: Real-time autocomplete at scale
- Edit Distance: Levenshtein algorithm
- Top-K Problem: Heap-based solutions

---

*Production-ready autocomplete with Trie data structure, frequency ranking, and optimization techniques. Essential for search interfaces and user input suggestions.*
