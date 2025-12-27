# Search Engine

## Overview
Full-text search engine with inverted index, ranking algorithms (TF-IDF, PageRank), and query processing.

## Key Algorithms
```java
// TF-IDF Ranking
public double calculateScore(String query, Document doc) {
    double score = 0;
    for (String term : query.split(" ")) {
        double tf = doc.getTermFrequency(term);
        double idf = Math.log(totalDocs / docsContaining(term));
        score += tf * idf;
    }
    return score;
}
```

## Source Code
📄 **[View Complete Source Code](/problems/search/CODE)**
