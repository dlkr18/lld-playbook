package com.you.lld.problems.autocomplete.service.impl;

import com.you.lld.problems.autocomplete.model.Suggestion;
import com.you.lld.problems.autocomplete.service.RankingStrategy;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

/**
 * Rank by frequency descending, then alphabetically.
 */
public final class FrequencyRankingStrategy implements RankingStrategy {

    private static final Comparator<Suggestion> COMPARATOR = new Comparator<Suggestion>() {
        @Override
        public int compare(Suggestion a, Suggestion b) {
            int freq = Integer.compare(b.getFrequency(), a.getFrequency());
            if (freq != 0) {
                return freq;
            }
            return a.getWord().compareTo(b.getWord());
        }
    };

    @Override
    public List<Suggestion> rank(String prefix, List<Suggestion> candidates, int limit) {
        List<Suggestion> ranked = new ArrayList<Suggestion>(candidates);
        Collections.sort(ranked, COMPARATOR);
        return ranked.subList(0, Math.min(limit, ranked.size()));
    }
}
