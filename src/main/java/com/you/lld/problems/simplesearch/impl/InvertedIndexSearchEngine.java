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
        Map<String, Integer> docScores = new HashMap<>();
        
        // Calculate scores for each document
        for (String word : queryWords) {
            Set<String> docIds = invertedIndex.get(word);
            if (docIds != null) {
                for (String docId : docIds) {
                    docScores.merge(docId, 1, Integer::sum);
                }
            }
        }
        
        // Convert to SearchResults and sort by relevance
        List<SearchResult> results = docScores.entrySet().stream()
            .map(entry -> {
                Document doc = documents.get(entry.getKey());
                double score = calculateScore(entry.getValue(), queryWords.length, 
                                             documentWordCount.get(entry.getKey()));
                return new SearchResult(doc, score);
            })
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
    
    private double calculateScore(int matchCount, int queryLength, int docLength) {
        // Simple TF-IDF-like scoring
        double termFrequency = (double) matchCount / docLength;
        double queryRelevance = (double) matchCount / queryLength;
        return termFrequency * queryRelevance;
    }
}


