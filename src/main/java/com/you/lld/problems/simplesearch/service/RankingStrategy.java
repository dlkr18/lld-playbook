package com.you.lld.problems.simplesearch.service;

import com.you.lld.problems.simplesearch.model.Document;
import com.you.lld.problems.simplesearch.model.SearchResult;
import java.util.List;
import java.util.Map;
import java.util.Set;

public interface RankingStrategy {

    List<SearchResult> rank(List<String> queryTerms, Set<String> candidateDocIds,
                            InvertedIndex index, int offset, int limit);
}
