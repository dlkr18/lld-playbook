package com.you.lld.problems.autocomplete.model;

public class Suggestion implements Comparable<Suggestion> {
    private final String word;
    private final int frequency;
    private final double score;
    
    public Suggestion(String word, int frequency) {
        this.word = word;
        this.frequency = frequency;
        this.score = calculateScore();
    }
    
    private double calculateScore() {
        return frequency * 1.0; // Can be enhanced with other factors
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
    public int compareTo(Suggestion other) {
        return Double.compare(other.score, this.score); // Higher score first
    }
    
    @Override
    public String toString() {
        return word + " (freq: " + frequency + ")";
    }
}
