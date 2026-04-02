# Search & Index - Full-Text Search

Production-ready **search and indexing system** with **inverted index**, **ranking**, **fuzzy matching**, and **real-time updates**. Foundation for search engines.

---

## **Core Features**

- **Inverted Index** - Fast keyword lookup
- **TF-IDF Ranking** - Relevance scoring
- **Fuzzy Search** - Typo tolerance
- **Filtering** - By fields, ranges
- **Real-Time Indexing** - Immediate updates

---

## **Implementation**

```java
public class SearchIndex {

    // Inverted index: term → list of document IDs
    private final Map<String, Set<String>> invertedIndex = new ConcurrentHashMap<>();

    // Document storage
    private final Map<String, Document> documents = new ConcurrentHashMap<>();

    public void indexDocument(Document doc) {
        documents.put(doc.getId(), doc);

        // Tokenize and index each term
        List<String> terms = tokenize(doc.getContent());
        for (String term : terms) {
            invertedIndex
                .computeIfAbsent(term, k -> ConcurrentHashMap.newKeySet())
                .add(doc.getId());
        }
    }

    public List<Document> search(String query) {
        List<String> queryTerms = tokenize(query);

        // Find documents containing any query term
        Set<String> candidateIds = new HashSet<>();
        for (String term : queryTerms) {
            Set<String> docIds = invertedIndex.get(term);
            if (docIds != null) {
                candidateIds.addAll(docIds);
            }
        }

        // Score and rank results
        return candidateIds.stream()
            .map(documents::get)
            .sorted(Comparator.comparingDouble(doc ->
                calculateRelevance(doc, queryTerms)).reversed())
            .collect(Collectors.toList());
    }

    private double calculateRelevance(Document doc, List<String> queryTerms) {
        // TF-IDF scoring
        double score = 0.0;
        for (String term : queryTerms) {
            double tf = termFrequency(doc, term);
            double idf = inverseDocumentFrequency(term);
            score += tf * idf;
        }
        return score;
    }
}
```

---

## **Related Resources**

- [Day 15: Search/Index](week3/day15/README.md)

---

- **Fast full-text search with relevance ranking!**

