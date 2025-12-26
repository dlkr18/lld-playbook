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
