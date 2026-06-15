package com.you.lld.problems.simplesearch.model;

public final class SearchResult {

    private final Document document;
    private final double score;

    public SearchResult(Document document, double score) {
        this.document = document;
        this.score = score;
    }

    public Document getDocument() {
        return document;
    }

    public double getScore() {
        return score;
    }

    @Override
    public String toString() {
        return document.getTitle() + " (score=" + String.format("%.3f", score) + ")";
    }
}
