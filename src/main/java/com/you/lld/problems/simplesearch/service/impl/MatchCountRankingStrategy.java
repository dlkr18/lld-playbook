package com.you.lld.problems.simplesearch.service.impl;

import com.you.lld.problems.simplesearch.model.Document;
import com.you.lld.problems.simplesearch.model.SearchResult;
import com.you.lld.problems.simplesearch.service.InvertedIndex;
import com.you.lld.problems.simplesearch.service.RankingStrategy;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Set;

/**
 * Simple match-count ranking — useful to contrast with TF-IDF in demos.
 */
public final class MatchCountRankingStrategy implements RankingStrategy {

    @Override
    public List<SearchResult> rank(List<String> queryTerms, Set<String> candidateDocIds,
                                   InvertedIndex index, int offset, int limit) {
        List<SearchResult> results = new ArrayList<SearchResult>();
        for (String docId : candidateDocIds) {
            Document doc = index.getDocument(docId);
            if (doc == null) {
                continue;
            }
            int matches = 0;
            for (String term : queryTerms) {
                if (index.getTermFrequencies(docId).containsKey(term)) {
                    matches++;
                }
            }
            if (matches > 0) {
                results.add(new SearchResult(doc, matches));
            }
        }
        Collections.sort(results, new Comparator<SearchResult>() {
            @Override
            public int compare(SearchResult a, SearchResult b) {
                return Double.compare(b.getScore(), a.getScore());
            }
        });
        int from = Math.min(offset, results.size());
        int to = Math.min(from + limit, results.size());
        return results.subList(from, to);
    }
}
