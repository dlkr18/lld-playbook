package com.you.lld.problems.autocomplete.model;

/**
 * Immutable autocomplete suggestion with a ranking score.
 */
public final class Suggestion {

    private final String word;
    private final int frequency;
    private final double score;

    public Suggestion(String word, int frequency, double score) {
        this.word = word;
        this.frequency = frequency;
        this.score = score;
    }

    public String getWord() {
        return word;
    }

    public int getFrequency() {
        return frequency;
    }

    public double getScore() {
        return score;
    }

    @Override
    public String toString() {
        return word + " (freq=" + frequency + ", score=" + String.format("%.2f", score) + ")";
    }
}
