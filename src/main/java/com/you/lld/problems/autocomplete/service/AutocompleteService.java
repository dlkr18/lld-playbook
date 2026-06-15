package com.you.lld.problems.autocomplete.service;

import com.you.lld.problems.autocomplete.model.Suggestion;
import java.util.List;

public interface AutocompleteService {

    void addWord(String word, int frequency);

    boolean removeWord(String word);

    boolean contains(String word);

    List<Suggestion> getSuggestions(String prefix, int limit);
}
