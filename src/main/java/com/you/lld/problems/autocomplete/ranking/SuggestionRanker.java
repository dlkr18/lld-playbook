package com.you.lld.problems.autocomplete.ranking;

import com.you.lld.problems.autocomplete.model.Suggestion;
import java.util.*;

public class SuggestionRanker {
    public static List<Suggestion> rankByRelevance(List<Suggestion> suggestions, String query) {
        suggestions.sort((s1, s2) -> {
            boolean s1Starts = s1.getWord().startsWith(query);
            boolean s2Starts = s2.getWord().startsWith(query);
            
            if (s1Starts && !s2Starts) return -1;
            if (!s1Starts && s2Starts) return 1;
            
            return Integer.compare(s2.getFrequency(), s1.getFrequency());
        });
        
        return suggestions;
    }
}
