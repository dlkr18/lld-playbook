package com.you.lld.problems.simplesearch.impl;

import com.you.lld.problems.simplesearch.api.SearchEngine;
import com.you.lld.problems.simplesearch.model.Document;
import com.you.lld.problems.simplesearch.model.SearchResult;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

/**
 * Search engine implementation using inverted index.
 * Thread-safe for concurrent operations.
 */
public class InvertedIndexSearchEngine implements SearchEngine {
    
    private final Map<String, Document> documents;
    private final Map<String, Set<String>> invertedIndex; // word -> document IDs
    private final Map<String, Integer> documentWordCount; // docId -> word count
    
    public InvertedIndexSearchEngine() {
        this.documents = new ConcurrentHashMap<>();
        this.invertedIndex = new ConcurrentHashMap<>();
        this.documentWordCount = new ConcurrentHashMap<>();
    }
    
    @Override
    public boolean indexDocument(Document document) {
        if (documents.containsKey(document.getId())) {
            return false;
        }
        
        documents.put(document.getId(), document);
        
        // Tokenize and index
        String[] words = tokenize(document.getContent());
        documentWordCount.put(document.getId(), words.length);
        
        for (String word : words) {
            invertedIndex.computeIfAbsent(word, k -> ConcurrentHashMap.newKeySet())
                         .add(document.getId());
        }
        
        return true;
    }
    
    @Override
    public boolean removeDocument(String documentId) {
        Document doc = documents.remove(documentId);
        if (doc == null) {
            return false;
        }
        
        // Remove from inverted index
        String[] words = tokenize(doc.getContent());
        for (String word : words) {
            Set<String> docIds = invertedIndex.get(word);
            if (docIds != null) {
                docIds.remove(documentId);
                if (docIds.isEmpty()) {
                    invertedIndex.remove(word);
                }
            }
        }
        
        documentWordCount.remove(documentId);
        return true;
    }
    
    @Override
    public List<SearchResult> search(String query) {
        return search(query, 100, 0);
    }
    
    @Override
    public List<SearchResult> search(String query, int limit, int offset) {
        String[] queryWords = tokenize(query);
        int totalDocs = documents.size();
        Map<String, Double> docScores = new HashMap<>();
        
        // Calculate TF-IDF scores for each document
        for (String word : queryWords) {
            Set<String> docIds = invertedIndex.get(word);
            if (docIds != null) {
                // IDF = log(N / df) where N = total docs, df = docs containing term
                double idf = Math.log((double) totalDocs / docIds.size());
                for (String docId : docIds) {
                    // TF = 1 / docLength (normalized term frequency)
                    double tf = 1.0 / documentWordCount.getOrDefault(docId, 1);
                    docScores.merge(docId, tf * idf, Double::sum);
                }
            }
        }
        
        // Convert to SearchResults and sort by relevance
        List<SearchResult> results = docScores.entrySet().stream()
            .map(entry -> new SearchResult(documents.get(entry.getKey()), entry.getValue()))
            .sorted((a, b) -> Double.compare(b.getScore(), a.getScore()))
            .skip(offset)
            .limit(limit)
            .collect(Collectors.toList());
        
        return results;
    }
    
    @Override
    public boolean updateDocument(Document document) {
        if (!documents.containsKey(document.getId())) {
            return false;
        }
        
        removeDocument(document.getId());
        indexDocument(document);
        return true;
    }
    
    @Override
    public int getDocumentCount() {
        return documents.size();
    }
    
    private String[] tokenize(String text) {
        return text.toLowerCase()
                   .replaceAll("[^a-z0-9\\s]", "")
                   .split("\\s+");
    }
    
    // scoring is now inline in search() using proper TF-IDF
}

