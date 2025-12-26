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
