package com.you.lld.problems.simplesearch;

import com.you.lld.problems.simplesearch.model.Document;
import com.you.lld.problems.simplesearch.model.SearchResult;
import com.you.lld.problems.simplesearch.service.RankingStrategy;
import com.you.lld.problems.simplesearch.service.impl.InMemoryInvertedIndex;
import com.you.lld.problems.simplesearch.service.impl.InvertedIndexSearchEngine;
import com.you.lld.problems.simplesearch.service.impl.TfIdfRankingStrategy;
import java.util.List;

public final class SimpleSearch {

    private final InvertedIndexSearchEngine engine;

    public SimpleSearch() {
        this(new TfIdfRankingStrategy());
    }

    public SimpleSearch(RankingStrategy rankingStrategy) {
        this.engine = new InvertedIndexSearchEngine(new InMemoryInvertedIndex(), rankingStrategy);
    }

    public boolean index(Document document) {
        return engine.indexDocument(document);
    }

    public boolean remove(String documentId) {
        return engine.removeDocument(documentId);
    }

    public boolean update(Document document) {
        return engine.updateDocument(document);
    }

    public List<SearchResult> search(String query) {
        return engine.search(query);
    }

    public List<SearchResult> search(String query, int offset, int limit) {
        return engine.search(query, offset, limit);
    }

    public void setRankingStrategy(RankingStrategy rankingStrategy) {
        engine.setRankingStrategy(rankingStrategy);
    }
}
