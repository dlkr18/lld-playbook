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
        Map<String, Integer> termCounts = termCounts(document.fullText());
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

    /**
     * THE tokenizer. Indexing and querying must split text identically — if the two
     * ever disagree, queries silently stop matching documents that do contain the
     * word. This used to be two separate implementations of the same rule; they
     * agreed by luck, and nothing would have caught them drifting apart.
     */
    static List<String> tokenize(String text) {
        List<String> tokens = new ArrayList<String>();
        if (text == null || text.trim().isEmpty()) {
            return tokens;
        }
        for (String part : text.toLowerCase().split("\\W+")) {
            if (!part.isEmpty()) {
                tokens.add(part);
            }
        }
        return tokens;
    }

    static List<String> tokenizeQuery(String query) {
        return tokenize(query);
    }

    private Map<String, Integer> termCounts(String text) {
        Map<String, Integer> counts = new HashMap<String, Integer>();
        for (String token : tokenize(text)) {
            Integer count = counts.get(token);
            counts.put(token, count == null ? 1 : count + 1);
        }
        return counts;
    }
}
