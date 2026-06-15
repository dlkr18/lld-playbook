package com.you.lld.problems.autocomplete;

import com.you.lld.problems.autocomplete.model.Suggestion;
import com.you.lld.problems.autocomplete.service.RankingStrategy;
import com.you.lld.problems.autocomplete.service.impl.TrieBasedAutocomplete;
import java.util.List;

/**
 * Facade over trie autocomplete with swappable ranking strategy.
 */
public final class Autocomplete {

    private final TrieBasedAutocomplete trie;

    public Autocomplete(RankingStrategy rankingStrategy) {
        this.trie = new TrieBasedAutocomplete(rankingStrategy);
    }

    public void addWord(String word, int frequency) {
        trie.addWord(word, frequency);
    }

    public boolean removeWord(String word) {
        return trie.removeWord(word);
    }

    public boolean contains(String word) {
        return trie.contains(word);
    }

    public List<Suggestion> suggest(String prefix, int limit) {
        return trie.getSuggestions(prefix, limit);
    }

    public void setRankingStrategy(RankingStrategy rankingStrategy) {
        trie.setRankingStrategy(rankingStrategy);
    }
}
