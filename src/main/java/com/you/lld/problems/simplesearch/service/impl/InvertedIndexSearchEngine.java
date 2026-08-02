package com.you.lld.problems.simplesearch.service.impl;

import com.you.lld.problems.simplesearch.exceptions.DocumentNotFoundException;
import com.you.lld.problems.simplesearch.model.Document;
import com.you.lld.problems.simplesearch.model.SearchResult;
import com.you.lld.problems.simplesearch.service.InvertedIndex;
import com.you.lld.problems.simplesearch.service.RankingStrategy;
import com.you.lld.problems.simplesearch.service.SearchEngine;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public final class InvertedIndexSearchEngine implements SearchEngine {

    private static final int DEFAULT_LIMIT = 100;

    private final InvertedIndex index;
    private volatile RankingStrategy rankingStrategy;

    public InvertedIndexSearchEngine(InvertedIndex index, RankingStrategy rankingStrategy) {
        this.index = index;
        this.rankingStrategy = rankingStrategy;
    }

    public synchronized void setRankingStrategy(RankingStrategy rankingStrategy) {
        this.rankingStrategy = rankingStrategy;
    }

    @Override
    public synchronized boolean indexDocument(Document document) {
        if (index.getDocument(document.getId()) != null) {
            return false;
        }
        index.indexDocument(document);
        return true;
    }

    @Override
    public synchronized boolean removeDocument(String documentId) {
        if (index.getDocument(documentId) == null) {
            return false;
        }
        index.removeDocument(documentId);
        return true;
    }

    @Override
    public synchronized boolean updateDocument(Document document) {
        if (index.getDocument(document.getId()) == null) {
            throw new DocumentNotFoundException(document.getId());
        }
        index.indexDocument(document);
        return true;
    }

    @Override
    public List<SearchResult> search(String query) {
        return search(query, 0, DEFAULT_LIMIT);
    }

    /**
     * Synchronized so the whole query sees ONE consistent view of the index.
     *
     * <p>Every individual index method is synchronized, so there was no data race —
     * but a query is a composite of many of them (lookup per term, then
     * getDocument/getTermFrequencies per candidate). Without the lock held across
     * the whole operation, a concurrent removeDocument could retire a document
     * between it being selected as a candidate and being scored, and getDocumentCount
     * could change mid-ranking, skewing every IDF computed after it.
     */
    @Override
    public synchronized List<SearchResult> search(String query, int offset, int limit) {
        List<String> terms = InMemoryInvertedIndex.tokenizeQuery(query);
        Set<String> candidates = new HashSet<String>();
        for (String term : terms) {
            candidates.addAll(index.lookup(term));
        }
        return rankingStrategy.rank(terms, candidates, index, offset, limit);
    }
}
