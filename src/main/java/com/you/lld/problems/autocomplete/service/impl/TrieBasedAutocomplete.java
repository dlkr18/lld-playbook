package com.you.lld.problems.autocomplete.service.impl;

import com.you.lld.problems.autocomplete.model.Suggestion;
import com.you.lld.problems.autocomplete.model.TrieNode;
import com.you.lld.problems.autocomplete.service.AutocompleteService;
import com.you.lld.problems.autocomplete.service.RankingStrategy;
import java.util.ArrayList;
import java.util.List;

/**
 * Trie-backed autocomplete with pluggable ranking strategy.
 */
public final class TrieBasedAutocomplete implements AutocompleteService {

    private final TrieNode root = new TrieNode();
    private volatile RankingStrategy rankingStrategy;

    public TrieBasedAutocomplete(RankingStrategy rankingStrategy) {
        if (rankingStrategy == null) {
            throw new IllegalArgumentException("rankingStrategy required");
        }
        this.rankingStrategy = rankingStrategy;
    }

    public synchronized void setRankingStrategy(RankingStrategy rankingStrategy) {
        if (rankingStrategy == null) {
            throw new IllegalArgumentException("rankingStrategy required");
        }
        this.rankingStrategy = rankingStrategy;
    }

    @Override
    public synchronized void addWord(String word, int frequency) {
        validateWord(word);
        if (frequency <= 0) {
            throw new IllegalArgumentException("frequency must be positive");
        }
        TrieNode node = root;
        String normalized = word.toLowerCase();
        for (int i = 0; i < normalized.length(); i++) {
            char ch = normalized.charAt(i);
            TrieNode child = node.getChildren().get(ch);
            if (child == null) {
                child = new TrieNode();
                node.getChildren().put(ch, child);
            }
            node = child;
        }
        node.setEndOfWord(true);
        node.setWord(normalized);
        node.addFrequency(frequency);
    }

    @Override
    public synchronized boolean removeWord(String word) {
        validateWord(word);
        String normalized = word.toLowerCase();
        // remove() returns "may this node be pruned", which is not the same question.
        // Removing "car" while "cards" exists prunes nothing, yet the word is gone —
        // returning the prune signal reported false for a successful removal.
        TrieNode node = findNode(normalized);
        boolean existed = node != null && node.isEndOfWord();
        if (existed) {
            remove(root, normalized, 0);
        }
        return existed;
    }

    @Override
    public synchronized boolean contains(String word) {
        validateWord(word);
        TrieNode node = findNode(word.toLowerCase());
        return node != null && node.isEndOfWord();
    }

    @Override
    public synchronized List<Suggestion> getSuggestions(String prefix, int limit) {
        if (limit <= 0) {
            throw new IllegalArgumentException("limit must be positive");
        }
        String normalized = prefix == null ? "" : prefix.toLowerCase();
        TrieNode node = normalized.isEmpty() ? root : findNode(normalized);
        if (node == null) {
            return new ArrayList<Suggestion>();
        }

        // Collect the WHOLE subtree and let the strategy decide what wins.
        //
        // This previously kept only the top `limit` by raw frequency in a min-heap
        // before ranking, which silently defeated the Strategy: a word the strategy
        // would have boosted to first place was already evicted on frequency alone.
        // Pruning before scoring is only valid when the prune key IS the score.
        List<Suggestion> candidates = new ArrayList<Suggestion>();
        collectCandidates(node, candidates);
        return rankingStrategy.rank(normalized, candidates, limit);
    }

    private void collectCandidates(TrieNode node, List<Suggestion> out) {
        if (node.isEndOfWord()) {
            out.add(new Suggestion(node.getWord(), node.getFrequency(), node.getFrequency()));
        }
        for (TrieNode child : node.getChildren().values()) {
            collectCandidates(child, out);
        }
    }

    private TrieNode findNode(String word) {
        TrieNode node = root;
        for (int i = 0; i < word.length(); i++) {
            node = node.getChildren().get(word.charAt(i));
            if (node == null) {
                return null;
            }
        }
        return node;
    }

    private boolean remove(TrieNode node, String word, int index) {
        if (index == word.length()) {
            if (!node.isEndOfWord()) {
                return false;
            }
            node.setEndOfWord(false);
            node.setWord(null);
            node.setFrequency(0);
            return node.getChildren().isEmpty();
        }

        char ch = word.charAt(index);
        TrieNode child = node.getChildren().get(ch);
        if (child == null) {
            return false;
        }

        boolean shouldDeleteChild = remove(child, word, index + 1);
        if (shouldDeleteChild) {
            node.getChildren().remove(ch);
        }
        return !node.isEndOfWord() && node.getChildren().isEmpty();
    }

    private void validateWord(String word) {
        if (word == null || word.trim().isEmpty()) {
            throw new IllegalArgumentException("word required");
        }
    }
}
