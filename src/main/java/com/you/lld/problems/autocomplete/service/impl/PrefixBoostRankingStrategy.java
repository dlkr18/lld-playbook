package com.you.lld.problems.autocomplete.service.impl;

import com.you.lld.problems.autocomplete.model.Suggestion;
import com.you.lld.problems.autocomplete.service.RankingStrategy;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

/**
 * Boosts words that exactly match the prefix length (shorter completions rank higher).
 */
public final class PrefixBoostRankingStrategy implements RankingStrategy {

    @Override
    public List<Suggestion> rank(String prefix, List<Suggestion> candidates, int limit) {
        final String normalized = prefix == null ? "" : prefix.toLowerCase();
        List<Suggestion> scored = new ArrayList<Suggestion>();
        for (Suggestion candidate : candidates) {
            double boost = candidate.getWord().length() == normalized.length() ? 2.0 : 1.0;
            double score = candidate.getFrequency() * boost;
            scored.add(new Suggestion(candidate.getWord(), candidate.getFrequency(), score));
        }
        Collections.sort(scored, new Comparator<Suggestion>() {
            @Override
            public int compare(Suggestion a, Suggestion b) {
                int byScore = Double.compare(b.getScore(), a.getScore());
                if (byScore != 0) {
                    return byScore;
                }
                return a.getWord().compareTo(b.getWord());
            }
        });
        return scored.subList(0, Math.min(limit, scored.size()));
    }
}
