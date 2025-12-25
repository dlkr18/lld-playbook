package com.you.lld.problems.simplesearch;

import java.util.*;

public class InvertedIndex {
    private final Map<String, List<String>> index; // term -> list of docIds
    
    public InvertedIndex() {
        this.index = new HashMap<>();
    }
    
    public void addDocument(Document doc) {
        String[] words = tokenize(doc.getTitle() + " " + doc.getContent());
        for (String word : words) {
            index.computeIfAbsent(word.toLowerCase(), k -> new ArrayList<>()).add(doc.getId());
        }
    }
    
    public List<String> search(String query) {
        String[] terms = tokenize(query);
        Set<String> results = new HashSet<>();
        
        for (String term : terms) {
            List<String> docs = index.get(term.toLowerCase());
            if (docs != null) {
                results.addAll(docs);
            }
        }
        
        return new ArrayList<>(results);
    }
    
    private String[] tokenize(String text) {
        return text.toLowerCase().split("\\W+");
    }
}
