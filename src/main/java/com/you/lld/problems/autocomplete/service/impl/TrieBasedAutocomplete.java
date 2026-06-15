package com.you.lld.problems.autocomplete.service.impl;

import com.you.lld.problems.autocomplete.model.Suggestion;
import com.you.lld.problems.autocomplete.model.TrieNode;
import com.you.lld.problems.autocomplete.service.AutocompleteService;
import com.you.lld.problems.autocomplete.service.RankingStrategy;
import java.util.ArrayList;
import java.util.List;
import java.util.PriorityQueue;

/**
 * Trie-backed autocomplete with pluggable ranking strategy.
 */
public final class TrieBasedAutocomplete implements AutocompleteService {

    private final TrieNode root = new TrieNode();
    private RankingStrategy rankingStrategy;

    public TrieBasedAutocomplete(RankingStrategy rankingStrategy) {
        if (rankingStrategy == null) {
            throw new IllegalArgumentException("rankingStrategy required");
        }
        this.rankingStrategy = rankingStrategy;
    }

    public void setRankingStrategy(RankingStrategy rankingStrategy) {
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
        return remove(root, word.toLowerCase(), 0);
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

        PriorityQueue<Suggestion> topK = new PriorityQueue<Suggestion>(new java.util.Comparator<Suggestion>() {
            @Override
            public int compare(Suggestion a, Suggestion b) {
                return Integer.compare(a.getFrequency(), b.getFrequency());
            }
        });
        collectCandidates(node, topK, limit);
        List<Suggestion> candidates = new ArrayList<Suggestion>(topK);
        return rankingStrategy.rank(normalized, candidates, limit);
    }

    private void collectCandidates(TrieNode node, PriorityQueue<Suggestion> topK, int limit) {
        if (node.isEndOfWord()) {
            Suggestion suggestion = new Suggestion(node.getWord(), node.getFrequency(), node.getFrequency());
            topK.offer(suggestion);
            if (topK.size() > limit) {
                topK.poll();
            }
        }
        for (TrieNode child : node.getChildren().values()) {
            collectCandidates(child, topK, limit);
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
