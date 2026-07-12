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
