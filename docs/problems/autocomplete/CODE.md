# autocomplete - Complete Implementation

## 📁 Project Structure (10 files)

```
autocomplete/
├── AutocompleteDemo.java
├── AutocompleteSystem.java
├── Demo.java
├── TrieNode.java
├── api/AutocompleteService.java
├── cache/SuggestionCache.java
├── impl/TrieBasedAutocomplete.java
├── model/Suggestion.java
├── model/TrieNode.java
├── ranking/SuggestionRanker.java
```

## 📝 Source Code

### 📄 `AutocompleteDemo.java`

<details>
<summary>📄 Click to view AutocompleteDemo.java</summary>

```java
package com.you.lld.problems.autocomplete;

import com.you.lld.problems.autocomplete.impl.TrieBasedAutocomplete;
import com.you.lld.problems.autocomplete.model.Suggestion;
import java.util.List;

public class AutocompleteDemo {
    public static void main(String[] args) {
        System.out.println("🔍 Autocomplete System Demo");
        System.out.println(String.format("%70s", "").replace(" ", "="));
        System.out.println();
        
        TrieBasedAutocomplete autocomplete = new TrieBasedAutocomplete();
        
        autocomplete.addWord("apple", 100);
        autocomplete.addWord("application", 80);
        autocomplete.addWord("apply", 60);
        autocomplete.addWord("appreciate", 40);
        
        System.out.println("Suggestions for 'app':");
        List<Suggestion> suggestions = autocomplete.getSuggestions("app", 5);
        for (Suggestion suggestion : suggestions) {
            System.out.println("  " + suggestion);
        }
        
        System.out.println("\n✅ Demo complete!");
    }
}
```

</details>

### 📄 `AutocompleteSystem.java`

<details>
<summary>📄 Click to view AutocompleteSystem.java</summary>

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

</details>

### 📄 `Demo.java`

<details>
<summary>📄 Click to view Demo.java</summary>

```java
package com.you.lld.problems.autocomplete;
public class Demo { public static void main(String[] args) { System.out.println("Autocomplete"); } }```

</details>

### 📄 `TrieNode.java`

<details>
<summary>📄 Click to view TrieNode.java</summary>

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

</details>

### 📄 `api/AutocompleteService.java`

<details>
<summary>📄 Click to view api/AutocompleteService.java</summary>

```java
package com.you.lld.problems.autocomplete.api;

import com.you.lld.problems.autocomplete.model.Suggestion;
import java.util.List;

public interface AutocompleteService {
    void addWord(String word);
    void addWord(String word, int frequency);
    List<Suggestion> getSuggestions(String prefix, int limit);
    void removeWord(String word);
    boolean contains(String word);
}
```

</details>

### 📄 `cache/SuggestionCache.java`

<details>
<summary>📄 Click to view cache/SuggestionCache.java</summary>

```java
package com.you.lld.problems.autocomplete.cache;

import com.you.lld.problems.autocomplete.model.Suggestion;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

public class SuggestionCache {
    private final Map<String, List<Suggestion>> cache = new ConcurrentHashMap<>();
    private final int maxSize;
    
    public SuggestionCache(int maxSize) {
        this.maxSize = maxSize;
    }
    
    public void put(String prefix, List<Suggestion> suggestions) {
        if (cache.size() >= maxSize) {
            String firstKey = cache.keySet().iterator().next();
            cache.remove(firstKey);
        }
        cache.put(prefix, suggestions);
    }
    
    public List<Suggestion> get(String prefix) {
        return cache.get(prefix);
    }
    
    public void clear() {
        cache.clear();
    }
}
```

</details>

### 📄 `impl/TrieBasedAutocomplete.java`

<details>
<summary>📄 Click to view impl/TrieBasedAutocomplete.java</summary>

```java
package com.you.lld.problems.autocomplete.impl;

import com.you.lld.problems.autocomplete.api.AutocompleteService;
import com.you.lld.problems.autocomplete.model.*;
import java.util.*;

public class TrieBasedAutocomplete implements AutocompleteService {
    private final TrieNode root;
    
    public TrieBasedAutocomplete() {
        this.root = new TrieNode();
    }
    
    @Override
    public void addWord(String word) {
        addWord(word, 1);
    }
    
    @Override
    public void addWord(String word, int frequency) {
        if (word == null || word.isEmpty()) {
            return;
        }
        
        TrieNode current = root;
        word = word.toLowerCase();
        
        for (char ch : word.toCharArray()) {
            current.getChildren().putIfAbsent(ch, new TrieNode());
            current = current.getChildren().get(ch);
        }
        
        current.setEndOfWord(true);
        current.setWord(word);
        for (int i = 0; i < frequency; i++) {
            current.incrementFrequency();
        }
    }
    
    @Override
    public List<Suggestion> getSuggestions(String prefix, int limit) {
        if (prefix == null || prefix.isEmpty()) {
            return Collections.emptyList();
        }
        
        prefix = prefix.toLowerCase();
        TrieNode current = root;
        
        // Navigate to prefix node
        for (char ch : prefix.toCharArray()) {
            TrieNode next = current.getChildren().get(ch);
            if (next == null) {
                return Collections.emptyList();
            }
            current = next;
        }
        
        // Collect all words with this prefix
        List<Suggestion> suggestions = new ArrayList<>();
        collectSuggestions(current, suggestions);
        
        // Sort by frequency/score and limit
        Collections.sort(suggestions);
        return suggestions.subList(0, Math.min(limit, suggestions.size()));
    }
    
    private void collectSuggestions(TrieNode node, List<Suggestion> suggestions) {
        if (node.isEndOfWord()) {
            suggestions.add(new Suggestion(node.getWord(), node.getFrequency()));
        }
        
        for (TrieNode child : node.getChildren().values()) {
            collectSuggestions(child, suggestions);
        }
    }
    
    @Override
    public void removeWord(String word) {
        if (word == null || word.isEmpty()) {
            return;
        }
        
        word = word.toLowerCase();
        remove(root, word, 0);
    }
    
    private boolean remove(TrieNode current, String word, int index) {
        if (index == word.length()) {
            if (!current.isEndOfWord()) {
                return false;
            }
            current.setEndOfWord(false);
            return current.getChildren().isEmpty();
        }
        
        char ch = word.charAt(index);
        TrieNode node = current.getChildren().get(ch);
        if (node == null) {
            return false;
        }
        
        boolean shouldDeleteCurrentNode = remove(node, word, index + 1) && !node.isEndOfWord();
        
        if (shouldDeleteCurrentNode) {
            current.getChildren().remove(ch);
            return current.getChildren().isEmpty();
        }
        
        return false;
    }
    
    @Override
    public boolean contains(String word) {
        if (word == null || word.isEmpty()) {
            return false;
        }
        
        TrieNode current = root;
        word = word.toLowerCase();
        
        for (char ch : word.toCharArray()) {
            TrieNode next = current.getChildren().get(ch);
            if (next == null) {
                return false;
            }
            current = next;
        }
        
        return current.isEndOfWord();
    }
}
```

</details>

### 📄 `model/Suggestion.java`

<details>
<summary>📄 Click to view model/Suggestion.java</summary>

```java
package com.you.lld.problems.autocomplete.model;

public class Suggestion implements Comparable<Suggestion> {
    private final String word;
    private final int frequency;
    private final double score;
    
    public Suggestion(String word, int frequency) {
        this.word = word;
        this.frequency = frequency;
        this.score = calculateScore();
    }
    
    private double calculateScore() {
        return frequency * 1.0; // Can be enhanced with other factors
    }
    
    public String getWord() {
        return word;
    }
    
    public int getFrequency() {
        return frequency;
    }
    
    public double getScore() {
        return score;
    }
    
    @Override
    public int compareTo(Suggestion other) {
        return Double.compare(other.score, this.score); // Higher score first
    }
    
    @Override
    public String toString() {
        return word + " (freq: " + frequency + ")";
    }
}
```

</details>

### 📄 `model/TrieNode.java`

<details>
<summary>📄 Click to view model/TrieNode.java</summary>

```java
package com.you.lld.problems.autocomplete.model;

import java.util.*;

public class TrieNode {
    private final Map<Character, TrieNode> children;
    private boolean isEndOfWord;
    private int frequency;
    private String word;
    
    public TrieNode() {
        this.children = new HashMap<>();
        this.isEndOfWord = false;
        this.frequency = 0;
    }
    
    public Map<Character, TrieNode> getChildren() {
        return children;
    }
    
    public boolean isEndOfWord() {
        return isEndOfWord;
    }
    
    public void setEndOfWord(boolean endOfWord) {
        this.isEndOfWord = endOfWord;
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
}
```

</details>

### 📄 `ranking/SuggestionRanker.java`

<details>
<summary>📄 Click to view ranking/SuggestionRanker.java</summary>

```java
package com.you.lld.problems.autocomplete.ranking;

import com.you.lld.problems.autocomplete.model.Suggestion;
import java.util.*;

public class SuggestionRanker {
    public static List<Suggestion> rankByRelevance(List<Suggestion> suggestions, String query) {
        suggestions.sort((s1, s2) -> {
            boolean s1Starts = s1.getWord().startsWith(query);
            boolean s2Starts = s2.getWord().startsWith(query);
            
            if (s1Starts && !s2Starts) return -1;
            if (!s1Starts && s2Starts) return 1;
            
            return Integer.compare(s2.getFrequency(), s1.getFrequency());
        });
        
        return suggestions;
    }
}
```

</details>


