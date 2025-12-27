package com.you.lld.problems.autocomplete.api;

import com.you.lld.problems.autocomplete.model.Suggestion;
import java.util.List;

public interface AutocompleteService {
    void addWord(String word);
    void addWord(String word, int frequency);
    List<Suggestion> getSuggestions(String prefix, int limit);
    void removeWord(String word);
    boolean contains(String word);
}
