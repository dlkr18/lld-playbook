package com.you.lld.problems.autocomplete.service;

import com.you.lld.problems.autocomplete.model.Suggestion;
import java.util.List;

/**
 * Strategy for ordering autocomplete candidates.
 */
public interface RankingStrategy {

    List<Suggestion> rank(String prefix, List<Suggestion> candidates, int limit);
}
