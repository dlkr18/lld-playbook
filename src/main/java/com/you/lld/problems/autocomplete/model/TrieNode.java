package com.you.lld.problems.autocomplete.model;

import java.util.HashMap;
import java.util.Map;

/**
 * Trie node — children keyed by lowercase character.
 */
public final class TrieNode {

    private final Map<Character, TrieNode> children = new HashMap<Character, TrieNode>();
    private boolean endOfWord;
    private String word;
    private int frequency;

    public Map<Character, TrieNode> getChildren() {
        return children;
    }

    public boolean isEndOfWord() {
        return endOfWord;
    }

    public void setEndOfWord(boolean endOfWord) {
        this.endOfWord = endOfWord;
    }

    public String getWord() {
        return word;
    }

    public void setWord(String word) {
        this.word = word;
    }

    public int getFrequency() {
        return frequency;
    }

    public void setFrequency(int frequency) {
        this.frequency = frequency;
    }

    public void addFrequency(int delta) {
        this.frequency += delta;
    }
}
