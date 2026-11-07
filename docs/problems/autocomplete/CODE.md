# autocomplete - Complete Implementation

> Generated from `src/main/java/com/you/lld/problems/autocomplete/` on 2026-11-07. Re-run `python3 scripts/generate-code-md.py autocomplete`.

## Project Structure (9 files)

```
autocomplete/
├── AutocompleteDemo.java
├── Autocomplete.java
├── model/Suggestion.java
├── model/TrieNode.java
├── service/AutocompleteService.java
├── service/RankingStrategy.java
├── service/impl/FrequencyRankingStrategy.java
├── service/impl/PrefixBoostRankingStrategy.java
├── service/impl/TrieBasedAutocomplete.java
```

## Source Code

### `AutocompleteDemo.java`

<details>
<summary>Click to view AutocompleteDemo.java</summary>

```java
package com.you.lld.problems.autocomplete;

import com.you.lld.problems.autocomplete.model.Suggestion;
import com.you.lld.problems.autocomplete.service.impl.FrequencyRankingStrategy;
import com.you.lld.problems.autocomplete.service.impl.PrefixBoostRankingStrategy;
import java.util.List;

public class AutocompleteDemo {

    public static void main(String[] args) {
        System.out.println("=== Autocomplete Demo ===\n");
        demoFrequencyRanking();
        demoPrefixBoostStrategy();
        demoRemoveWord();
        demoCaseInsensitive();
        demoEmptyPrefix();
        System.out.println("\n=== Demo complete ===");
    }

    private static void demoFrequencyRanking() {
        System.out.println("--- 1. Prefix search with frequency ranking ---");
        Autocomplete ac = new Autocomplete(new FrequencyRankingStrategy());
        ac.addWord("java", 50);
        ac.addWord("javascript", 120);
        ac.addWord("jar", 30);
        ac.addWord("jargon", 10);
        printSuggestions(ac.suggest("ja", 3));
    }

    private static void demoPrefixBoostStrategy() {
        System.out.println("\n--- 2. Switch ranking strategy (prefix boost) ---");
        Autocomplete ac = new Autocomplete(new FrequencyRankingStrategy());
        ac.addWord("go", 200);
        ac.addWord("golang", 80);
        ac.addWord("google", 150);
        System.out.println("  Frequency ranking for 'go':");
        printSuggestions(ac.suggest("go", 3));
        ac.setRankingStrategy(new PrefixBoostRankingStrategy());
        System.out.println("  Prefix-boost ranking for 'go':");
        printSuggestions(ac.suggest("go", 3));
    }

    private static void demoRemoveWord() {
        System.out.println("\n--- 3. Remove word and verify trie ---");
        Autocomplete ac = new Autocomplete(new FrequencyRankingStrategy());
        ac.addWord("python", 90);
        ac.addWord("pytorch", 40);
        System.out.println("  Before remove: " + ac.suggest("py", 5));
        ac.removeWord("python");
        System.out.println("  After remove 'python': " + ac.suggest("py", 5));
        System.out.println("  contains('python')=" + ac.contains("python"));
    }

    private static void demoCaseInsensitive() {
        System.out.println("\n--- 4. Case-insensitive lookup ---");
        Autocomplete ac = new Autocomplete(new FrequencyRankingStrategy());
        ac.addWord("Spring", 60);
        ac.addWord("spring boot", 45);
        printSuggestions(ac.suggest("SPR", 3));
    }

    private static void demoEmptyPrefix() {
        System.out.println("\n--- 5. Empty prefix returns top-k by frequency ---");
        Autocomplete ac = new Autocomplete(new FrequencyRankingStrategy());
        ac.addWord("redis", 10);
        ac.addWord("kafka", 25);
        ac.addWord("rabbitmq", 15);
        printSuggestions(ac.suggest("", 2));
    }

    private static void printSuggestions(List<Suggestion> suggestions) {
        for (Suggestion s : suggestions) {
            System.out.println("  " + s);
        }
    }
}
```

</details>

### `Autocomplete.java`

<details>
<summary>Click to view Autocomplete.java</summary>

```java
package com.you.lld.problems.autocomplete;

import com.you.lld.problems.autocomplete.model.Suggestion;
import com.you.lld.problems.autocomplete.service.RankingStrategy;
import com.you.lld.problems.autocomplete.service.impl.TrieBasedAutocomplete;
import java.util.List;

/**
 * Facade over trie autocomplete with swappable ranking strategy.
 */
public final class Autocomplete {

    private final TrieBasedAutocomplete trie;

    public Autocomplete(RankingStrategy rankingStrategy) {
        this.trie = new TrieBasedAutocomplete(rankingStrategy);
    }

    public void addWord(String word, int frequency) {
        trie.addWord(word, frequency);
    }

    public boolean removeWord(String word) {
        return trie.removeWord(word);
    }

    public boolean contains(String word) {
        return trie.contains(word);
    }

    public List<Suggestion> suggest(String prefix, int limit) {
        return trie.getSuggestions(prefix, limit);
    }

    public void setRankingStrategy(RankingStrategy rankingStrategy) {
        trie.setRankingStrategy(rankingStrategy);
    }
}
```

</details>

### `model/Suggestion.java`

<details>
<summary>Click to view model/Suggestion.java</summary>

```java
package com.you.lld.problems.autocomplete.model;

/**
 * Immutable autocomplete suggestion with a ranking score.
 */
public final class Suggestion {

    private final String word;
    private final int frequency;
    private final double score;

    public Suggestion(String word, int frequency, double score) {
        this.word = word;
        this.frequency = frequency;
        this.score = score;
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
    public String toString() {
        return word + " (freq=" + frequency + ", score=" + String.format("%.2f", score) + ")";
    }
}
```

</details>

### `model/TrieNode.java`

<details>
<summary>Click to view model/TrieNode.java</summary>

```java
package com.you.lld.problems.autocomplete.model;

import java.util.HashMap;
import java.util.Map;

/**
 * Trie node — children keyed by lowercase character.
 */
public final class TrieNode {

    private final Map<Character, TrieNode> children = new HashMap<Character, TrieNode>();
    private boolean endOfWord;
    private String word;
    private int frequency;

    public Map<Character, TrieNode> getChildren() {
        return children;
    }

    public boolean isEndOfWord() {
        return endOfWord;
    }

    public void setEndOfWord(boolean endOfWord) {
        this.endOfWord = endOfWord;
    }

    public String getWord() {
        return word;
    }

    public void setWord(String word) {
        this.word = word;
    }

    public int getFrequency() {
        return frequency;
    }

    public void setFrequency(int frequency) {
        this.frequency = frequency;
    }

    public void addFrequency(int delta) {
        this.frequency += delta;
    }
}
```

</details>

### `service/AutocompleteService.java`

<details>
<summary>Click to view service/AutocompleteService.java</summary>

```java
package com.you.lld.problems.autocomplete.service;

import com.you.lld.problems.autocomplete.model.Suggestion;
import java.util.List;

public interface AutocompleteService {

    void addWord(String word, int frequency);

    boolean removeWord(String word);

    boolean contains(String word);

    List<Suggestion> getSuggestions(String prefix, int limit);
}
```

</details>

### `service/RankingStrategy.java`

<details>
<summary>Click to view service/RankingStrategy.java</summary>

```java
package com.you.lld.problems.autocomplete.service;

import com.you.lld.problems.autocomplete.model.Suggestion;
import java.util.List;

/**
 * Strategy for ordering autocomplete candidates.
 */
public interface RankingStrategy {

    List<Suggestion> rank(String prefix, List<Suggestion> candidates, int limit);
}
```

</details>

### `service/impl/FrequencyRankingStrategy.java`

<details>
<summary>Click to view service/impl/FrequencyRankingStrategy.java</summary>

```java
package com.you.lld.problems.autocomplete.service.impl;

import com.you.lld.problems.autocomplete.model.Suggestion;
import com.you.lld.problems.autocomplete.service.RankingStrategy;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

/**
 * Rank by frequency descending, then alphabetically.
 */
public final class FrequencyRankingStrategy implements RankingStrategy {

    private static final Comparator<Suggestion> COMPARATOR = new Comparator<Suggestion>() {
        @Override
        public int compare(Suggestion a, Suggestion b) {
            int freq = Integer.compare(b.getFrequency(), a.getFrequency());
            if (freq != 0) {
                return freq;
            }
            return a.getWord().compareTo(b.getWord());
        }
    };

    @Override
    public List<Suggestion> rank(String prefix, List<Suggestion> candidates, int limit) {
        List<Suggestion> ranked = new ArrayList<Suggestion>(candidates);
        Collections.sort(ranked, COMPARATOR);
        return ranked.subList(0, Math.min(limit, ranked.size()));
    }
}
```

</details>

### `service/impl/PrefixBoostRankingStrategy.java`

<details>
<summary>Click to view service/impl/PrefixBoostRankingStrategy.java</summary>

```java
package com.you.lld.problems.autocomplete.service.impl;

import com.you.lld.problems.autocomplete.model.Suggestion;
import com.you.lld.problems.autocomplete.service.RankingStrategy;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

/**
 * Boosts words that exactly match the prefix length (shorter completions rank higher).
 */
public final class PrefixBoostRankingStrategy implements RankingStrategy {

    @Override
    public List<Suggestion> rank(String prefix, List<Suggestion> candidates, int limit) {
        final String normalized = prefix == null ? "" : prefix.toLowerCase();
        List<Suggestion> scored = new ArrayList<Suggestion>();
        for (Suggestion candidate : candidates) {
            double boost = candidate.getWord().length() == normalized.length() ? 2.0 : 1.0;
            double score = candidate.getFrequency() * boost;
            scored.add(new Suggestion(candidate.getWord(), candidate.getFrequency(), score));
        }
        Collections.sort(scored, new Comparator<Suggestion>() {
            @Override
            public int compare(Suggestion a, Suggestion b) {
                int byScore = Double.compare(b.getScore(), a.getScore());
                if (byScore != 0) {
                    return byScore;
                }
                return a.getWord().compareTo(b.getWord());
            }
        });
        return scored.subList(0, Math.min(limit, scored.size()));
    }
}
```

</details>

### `service/impl/TrieBasedAutocomplete.java`

<details>
<summary>Click to view service/impl/TrieBasedAutocomplete.java</summary>

```java
package com.you.lld.problems.autocomplete.service.impl;

import com.you.lld.problems.autocomplete.model.Suggestion;
import com.you.lld.problems.autocomplete.model.TrieNode;
import com.you.lld.problems.autocomplete.service.AutocompleteService;
import com.you.lld.problems.autocomplete.service.RankingStrategy;
import java.util.ArrayList;
import java.util.List;

/**
 * Trie-backed autocomplete with pluggable ranking strategy.
 */
public final class TrieBasedAutocomplete implements AutocompleteService {

    private final TrieNode root = new TrieNode();
    private volatile RankingStrategy rankingStrategy;

    public TrieBasedAutocomplete(RankingStrategy rankingStrategy) {
        if (rankingStrategy == null) {
            throw new IllegalArgumentException("rankingStrategy required");
        }
        this.rankingStrategy = rankingStrategy;
    }

    public synchronized void setRankingStrategy(RankingStrategy rankingStrategy) {
        if (rankingStrategy == null) {
            throw new IllegalArgumentException("rankingStrategy required");
        }
        this.rankingStrategy = rankingStrategy;
    }

    @Override
    public synchronized void addWord(String word, int frequency) {
        validateWord(word);
        if (frequency <= 0) {
            throw new IllegalArgumentException("frequency must be positive");
        }
        TrieNode node = root;
        String normalized = word.toLowerCase();
        for (int i = 0; i < normalized.length(); i++) {
            char ch = normalized.charAt(i);
            TrieNode child = node.getChildren().get(ch);
            if (child == null) {
                child = new TrieNode();
                node.getChildren().put(ch, child);
            }
            node = child;
        }
        node.setEndOfWord(true);
        node.setWord(normalized);
        node.addFrequency(frequency);
    }

    @Override
    public synchronized boolean removeWord(String word) {
        validateWord(word);
        String normalized = word.toLowerCase();
        // remove() returns "may this node be pruned", which is not the same question.
        // Removing "car" while "cards" exists prunes nothing, yet the word is gone —
        // returning the prune signal reported false for a successful removal.
        TrieNode node = findNode(normalized);
        boolean existed = node != null && node.isEndOfWord();
        if (existed) {
            remove(root, normalized, 0);
        }
        return existed;
    }

    @Override
    public synchronized boolean contains(String word) {
        validateWord(word);
        TrieNode node = findNode(word.toLowerCase());
        return node != null && node.isEndOfWord();
    }

    @Override
    public synchronized List<Suggestion> getSuggestions(String prefix, int limit) {
        if (limit <= 0) {
            throw new IllegalArgumentException("limit must be positive");
        }
        String normalized = prefix == null ? "" : prefix.toLowerCase();
        TrieNode node = normalized.isEmpty() ? root : findNode(normalized);
        if (node == null) {
            return new ArrayList<Suggestion>();
        }

        // Collect the WHOLE subtree and let the strategy decide what wins.
        //
        // This previously kept only the top `limit` by raw frequency in a min-heap
        // before ranking, which silently defeated the Strategy: a word the strategy
        // would have boosted to first place was already evicted on frequency alone.
        // Pruning before scoring is only valid when the prune key IS the score.
        List<Suggestion> candidates = new ArrayList<Suggestion>();
        collectCandidates(node, candidates);
        return rankingStrategy.rank(normalized, candidates, limit);
    }

    private void collectCandidates(TrieNode node, List<Suggestion> out) {
        if (node.isEndOfWord()) {
            out.add(new Suggestion(node.getWord(), node.getFrequency(), node.getFrequency()));
        }
        for (TrieNode child : node.getChildren().values()) {
            collectCandidates(child, out);
        }
    }

    private TrieNode findNode(String word) {
        TrieNode node = root;
        for (int i = 0; i < word.length(); i++) {
            node = node.getChildren().get(word.charAt(i));
            if (node == null) {
                return null;
            }
        }
        return node;
    }

    private boolean remove(TrieNode node, String word, int index) {
        if (index == word.length()) {
            if (!node.isEndOfWord()) {
                return false;
            }
            node.setEndOfWord(false);
            node.setWord(null);
            node.setFrequency(0);
            return node.getChildren().isEmpty();
        }

        char ch = word.charAt(index);
        TrieNode child = node.getChildren().get(ch);
        if (child == null) {
            return false;
        }

        boolean shouldDeleteChild = remove(child, word, index + 1);
        if (shouldDeleteChild) {
            node.getChildren().remove(ch);
        }
        return !node.isEndOfWord() && node.getChildren().isEmpty();
    }

    private void validateWord(String word) {
        if (word == null || word.trim().isEmpty()) {
            throw new IllegalArgumentException("word required");
        }
    }
}
```

</details>

## Run Demo

```bash
mvn -q compile exec:java -Dexec.mainClass="com.you.lld.problems.autocomplete.AutocompleteDemo"
```
