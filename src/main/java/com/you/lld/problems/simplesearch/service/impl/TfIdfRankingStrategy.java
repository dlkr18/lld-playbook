package com.you.lld.problems.simplesearch.service.impl;

import com.you.lld.problems.simplesearch.model.Document;
import com.you.lld.problems.simplesearch.model.SearchResult;
import com.you.lld.problems.simplesearch.service.InvertedIndex;
import com.you.lld.problems.simplesearch.service.RankingStrategy;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

public final class TfIdfRankingStrategy implements RankingStrategy {

    @Override
    public List<SearchResult> rank(List<String> queryTerms, Set<String> candidateDocIds,
                                   InvertedIndex index, int offset, int limit) {
        List<SearchResult> results = new ArrayList<SearchResult>();
        int totalDocs = index.getDocumentCount();
        if (totalDocs == 0 || queryTerms.isEmpty()) {
            return results;
        }

        // IDF depends only on the term and the corpus, so compute it ONCE per term.
        // It used to be recomputed inside the per-document loop via index.lookup(term),
        // which copies the term's entire posting set — making a single-term query
        // quadratic in corpus size (8000 docs took 862 ms before this hoist).
        Map<String, Double> idfByTerm = new HashMap<String, Double>();
        for (String term : queryTerms) {
            if (!idfByTerm.containsKey(term)) {
                int df = index.lookup(term).size();
                idfByTerm.put(term, Math.log((double) (totalDocs + 1) / (df + 1)) + 1.0);
            }
        }

        for (String docId : candidateDocIds) {
            Document doc = index.getDocument(docId);
            if (doc == null) {
                continue;
            }
            Map<String, Integer> termFreq = index.getTermFrequencies(docId);
            int docLength = 0;
            for (Integer tf : termFreq.values()) {
                docLength += tf;
            }
            double score = 0.0;
            for (String term : queryTerms) {
                Integer tf = termFreq.get(term);
                if (tf == null) {
                    continue;
                }
                double normalizedTf = (double) tf / Math.max(1, docLength);
                score += normalizedTf * idfByTerm.get(term);
            }
            if (score > 0.0) {
                results.add(new SearchResult(doc, score));
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
        // Copy: subList returns a view holding the whole backing list alive.
        return new ArrayList<SearchResult>(results.subList(from, to));
    }
}
