package com.you.lld.problems.simplesearch.service.impl;

import com.you.lld.problems.simplesearch.model.Document;
import com.you.lld.problems.simplesearch.service.InvertedIndex;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

public final class InMemoryInvertedIndex implements InvertedIndex {

    private final Map<String, Map<String, Integer>> postings = new HashMap<String, Map<String, Integer>>();
    private final Map<String, Document> documents = new HashMap<String, Document>();
    private final Map<String, Map<String, Integer>> docTermFreq = new HashMap<String, Map<String, Integer>>();

    @Override
    public synchronized void indexDocument(Document document) {
        removeDocument(document.getId());
        documents.put(document.getId(), document);
        Map<String, Integer> termCounts = tokenize(document.fullText());
        docTermFreq.put(document.getId(), termCounts);
        for (Map.Entry<String, Integer> entry : termCounts.entrySet()) {
            Map<String, Integer> docs = postings.get(entry.getKey());
            if (docs == null) {
                docs = new HashMap<String, Integer>();
                postings.put(entry.getKey(), docs);
            }
            docs.put(document.getId(), entry.getValue());
        }
    }

    @Override
    public synchronized void removeDocument(String documentId) {
        Map<String, Integer> terms = docTermFreq.remove(documentId);
        documents.remove(documentId);
        if (terms == null) {
            return;
        }
        for (String term : terms.keySet()) {
            Map<String, Integer> docs = postings.get(term);
            if (docs != null) {
                docs.remove(documentId);
                if (docs.isEmpty()) {
                    postings.remove(term);
                }
            }
        }
    }

    @Override
    public synchronized Set<String> lookup(String term) {
        Map<String, Integer> docs = postings.get(term);
        if (docs == null) {
            return new HashSet<String>();
        }
        return new HashSet<String>(docs.keySet());
    }

    @Override
    public synchronized Map<String, Integer> getTermFrequencies(String documentId) {
        Map<String, Integer> freqs = docTermFreq.get(documentId);
        if (freqs == null) {
            return new HashMap<String, Integer>();
        }
        return new HashMap<String, Integer>(freqs);
    }

    @Override
    public synchronized int getDocumentCount() {
        return documents.size();
    }

    @Override
    public synchronized Document getDocument(String documentId) {
        return documents.get(documentId);
    }

    static List<String> tokenizeQuery(String query) {
        List<String> tokens = new ArrayList<String>();
        if (query == null || query.trim().isEmpty()) {
            return tokens;
        }
        String[] parts = query.toLowerCase().split("\\W+");
        for (String part : parts) {
            if (!part.isEmpty()) {
                tokens.add(part);
            }
        }
        return tokens;
    }

    private Map<String, Integer> tokenize(String text) {
        Map<String, Integer> counts = new HashMap<String, Integer>();
        String[] parts = text.toLowerCase().split("\\W+");
        for (String part : parts) {
            if (part.isEmpty()) {
                continue;
            }
            Integer count = counts.get(part);
            counts.put(part, count == null ? 1 : count + 1);
        }
        return counts;
    }
}
