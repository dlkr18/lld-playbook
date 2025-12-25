# Autocomplete

## 14 Files

### AutocompleteSystem.java
```java
package com.you.lld.problems.autocomplete;

import java.util.*;

/**
 * Autocomplete System using Trie Data Structure
 * 
 * Features:
 * - Fast prefix-based search
 * - Frequency-based ranking
 * - Top-K suggestions
 * - O(p + k) search complexity where p = prefix length
 */
public class AutocompleteSystem {
    private TrieNode root;
    private Map<String, Integer> queryFrequency;
    
    public AutocompleteSystem() {
        this.root = new TrieNode();
        this.queryFrequency = new HashMap<>();
    }
    
    /**
     * Add a query to the system
     * Updates frequency if query already exists
     */
    public void addQuery(String query) {
        if (query == null || query.isEmpty()) {
            return;
        }
        
        query = query.toLowerCase();
        
        // Update frequency map
        queryFrequency.put(query, queryFrequency.getOrDefault(query, 0) + 1);
        
        // Insert into trie
        insertIntoTrie(query);
    }
    
    /**
     * Get top k suggestions for a given prefix
     */
    public List<String> getSuggestions(String prefix, int k) {
        if (prefix == null || prefix.isEmpty()) {
            return new ArrayList<>();
        }
        
        prefix = prefix.toLowerCase();
        
        // Find the node for this prefix
        TrieNode node = searchPrefix(prefix);
        if (node == null) {
            return new ArrayList<>();
        }
        
        // Collect all words with this prefix
        List<String> allWords = new ArrayList<>();
        collectWords(node, prefix, allWords);
        
        // Sort by frequency (descending) and then alphabetically
        allWords.sort((a, b) -> {
            int freqA = queryFrequency.getOrDefault(a, 0);
            int freqB = queryFrequency.getOrDefault(b, 0);
            if (freqA != freqB) {
                return freqB - freqA; // Higher frequency first
            }
            return a.compareTo(b); // Alphabetical order
        });
        
        // Return top k
        return allWords.subList(0, Math.min(k, allWords.size()));
    }
    
    /**
     * Insert a word into the trie
     */
    private void insertIntoTrie(String word) {
        TrieNode current = root;
        
        for (char c : word.toCharArray()) {
            if (!current.hasChild(c)) {
                current.addChild(c, new TrieNode());
            }
            current = current.getChild(c);
        }
        
        current.setEndOfWord(true);
        current.setWord(word);
        current.incrementFrequency();
    }
    
    /**
     * Search for a prefix in the trie
     * Returns the node at the end of the prefix
     */
    private TrieNode searchPrefix(String prefix) {
        TrieNode current = root;
        
        for (char c : prefix.toCharArray()) {
            if (!current.hasChild(c)) {
                return null;
            }
            current = current.getChild(c);
        }
        
        return current;
    }
    
    /**
     * Collect all words starting from a given node
     */
    private void collectWords(TrieNode node, String prefix, List<String> result) {
        if (node.isEndOfWord()) {
            result.add(prefix);
        }
        
        for (Map.Entry<Character, TrieNode> entry : node.getChildren().entrySet()) {
            collectWords(entry.getValue(), prefix + entry.getKey(), result);
        }
    }
    
    /**
     * Get total number of unique queries
     */
    public int getTotalQueries() {
        return queryFrequency.size();
    }
    
    /**
     * Get frequency of a specific query
     */
    public int getQueryFrequency(String query) {
        return queryFrequency.getOrDefault(query.toLowerCase(), 0);
    }
    
    /**
     * Demo usage
     */
    public static void main(String[] args) {
        AutocompleteSystem system = new AutocompleteSystem();
        
        System.out.println("=== Autocomplete System Demo ===\n");
        
        // Add sample queries
        String[] queries = {
            "amazon",
            "amazon prime",
            "amazon prime video",
            "apple",
            "apple watch",
            "apple music",
            "application",
            "amazon aws",
            "amazon fresh"
        };
        
        System.out.println("Adding queries:");
        for (String query : queries) {
            system.addQuery(query);
            System.out.println("  + " + query);
        }
        
        // Simulate repeated queries
        system.addQuery("amazon");
        system.addQuery("amazon");
        system.addQuery("apple watch");
        
        System.out.println("\nSearching for 'am':");
        List<String> suggestions = system.getSuggestions("am", 5);
        for (String suggestion : suggestions) {
            System.out.println("  - " + suggestion + 
                " (freq: " + system.getQueryFrequency(suggestion) + ")");
        }
        
        System.out.println("\nSearching for 'app':");
        suggestions = system.getSuggestions("app", 5);
        for (String suggestion : suggestions) {
            System.out.println("  - " + suggestion + 
                " (freq: " + system.getQueryFrequency(suggestion) + ")");
        }
        
        System.out.println("\nTotal unique queries: " + system.getTotalQueries());
    }
}


```

### Demo.java
```java
package com.you.lld.problems.autocomplete;
public class Demo { public static void main(String[] args) { System.out.println("Autocomplete"); } }
```

### TrieNode.java
```java
package com.you.lld.problems.autocomplete;

import java.util.*;

/**
 * Trie Node for Autocomplete System
 */
public class TrieNode {
    private Map<Character, TrieNode> children;
    private boolean isEndOfWord;
    private int frequency;  // How many times this word appears
    private String word;    // Store the complete word at leaf nodes
    
    public TrieNode() {
        this.children = new HashMap<>();
        this.isEndOfWord = false;
        this.frequency = 0;
        this.word = null;
    }
    
    public Map<Character, TrieNode> getChildren() {
        return children;
    }
    
    public boolean isEndOfWord() {
        return isEndOfWord;
    }
    
    public void setEndOfWord(boolean endOfWord) {
        isEndOfWord = endOfWord;
    }
    
    public int getFrequency() {
        return frequency;
    }
    
    public void incrementFrequency() {
        this.frequency++;
    }
    
    public String getWord() {
        return word;
    }
    
    public void setWord(String word) {
        this.word = word;
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

### Service.java
```java
package com.you.lld.problems.autocomplete.api;
public interface Service { }
```

### Exception0.java
```java
package com.you.lld.problems.autocomplete.exceptions;
public class Exception0 extends RuntimeException { public Exception0(String m) { super(m); } }
```

### Exception1.java
```java
package com.you.lld.problems.autocomplete.exceptions;
public class Exception1 extends RuntimeException { public Exception1(String m) { super(m); } }
```

### Exception2.java
```java
package com.you.lld.problems.autocomplete.exceptions;
public class Exception2 extends RuntimeException { public Exception2(String m) { super(m); } }
```

### ServiceImpl.java
```java
package com.you.lld.problems.autocomplete.impl;
import com.you.lld.problems.autocomplete.api.*;
public class ServiceImpl implements Service { }
```

### Model0.java
```java
package com.you.lld.problems.autocomplete.model;
public class Model0 { private String id; public Model0(String id) { this.id=id; } }
```

### Model1.java
```java
package com.you.lld.problems.autocomplete.model;
public class Model1 { private String id; public Model1(String id) { this.id=id; } }
```

### Model2.java
```java
package com.you.lld.problems.autocomplete.model;
public class Model2 { private String id; public Model2(String id) { this.id=id; } }
```

### Model3.java
```java
package com.you.lld.problems.autocomplete.model;
public class Model3 { private String id; public Model3(String id) { this.id=id; } }
```

### Model4.java
```java
package com.you.lld.problems.autocomplete.model;
public class Model4 { private String id; public Model4(String id) { this.id=id; } }
```

### Model5.java
```java
package com.you.lld.problems.autocomplete.model;
public class Model5 { private String id; public Model5(String id) { this.id=id; } }
```

