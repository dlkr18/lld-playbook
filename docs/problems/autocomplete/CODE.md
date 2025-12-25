# Search Autocomplete System

## Problem Statement

Design a search autocomplete system that suggests search queries as users type.

**Difficulty**: Easy  
**Pattern**: Trie (Prefix Tree)  
**Time**: 30-45 minutes

---

## Key Classes

```java
// Trie Node
class TrieNode {
    Map<Character, TrieNode> children;
    List<String> suggestions; // Top k suggestions
    boolean isEndOfWord;
}

// Autocomplete System
class AutocompleteSystem {
    private TrieNode root;
    private Map<String, Integer> queryFrequency;
    
    public void addQuery(String query) {
        queryFrequency.put(query, queryFrequency.getOrDefault(query, 0) + 1);
        insertIntoTrie(query);
    }
    
    public List<String> getSuggestions(String prefix, int k) {
        TrieNode node = searchPrefix(prefix);
        if (node == null) return new ArrayList<>();
        
        // Return top k suggestions based on frequency
        return node.suggestions.stream()
            .limit(k)
            .collect(Collectors.toList());
    }
}
```

---

## Features

- **Real-time Suggestions**: As user types
- **Frequency-based Ranking**: Most popular first
- **Top-K Results**: Configurable result count
- **Fast Lookups**: O(p + k) where p = prefix length

---

## Design Patterns

- **Trie Data Structure**: For prefix matching
- **Strategy Pattern**: Different ranking strategies (frequency, recency, personalized)
- **Observer Pattern**: Notify UI on suggestion updates

---

## Interview Tips

1. Discuss Trie vs HashMap trade-offs
2. Handle typos and fuzzy matching
3. Scale to millions of queries (distributed tries, caching)
4. Personalization strategies

---

**Status**: ✅ Documented

