# simplesearch - Complete Implementation

> Generated from `src/main/java/com/you/lld/problems/simplesearch/` on 2026-11-07. Re-run `python3 scripts/generate-code-md.py simplesearch`.

## Project Structure (13 files)

```
simplesearch/
├── SimpleSearchDemo.java
├── SimpleSearch.java
├── model/Document.java
├── model/SearchResult.java
├── service/InvertedIndex.java
├── service/RankingStrategy.java
├── service/SearchEngine.java
├── service/impl/InMemoryInvertedIndex.java
├── service/impl/InvertedIndexSearchEngine.java
├── service/impl/MatchCountRankingStrategy.java
├── service/impl/TfIdfRankingStrategy.java
├── exceptions/DocumentNotFoundException.java
├── exceptions/IndexingException.java
```

## Source Code

### `SimpleSearchDemo.java`

<details>
<summary>Click to view SimpleSearchDemo.java</summary>

```java
package com.you.lld.problems.simplesearch;

import com.you.lld.problems.simplesearch.model.Document;
import com.you.lld.problems.simplesearch.model.SearchResult;
import com.you.lld.problems.simplesearch.service.impl.MatchCountRankingStrategy;
import com.you.lld.problems.simplesearch.service.impl.TfIdfRankingStrategy;
import java.util.List;

public class SimpleSearchDemo {

    public static void main(String[] args) {
        System.out.println("=== Simple Search Demo ===\n");
        SimpleSearch engine = new SimpleSearch();
        demoIndexAndTfIdf(engine);
        demoTitleMatch(engine);
        demoPagination(engine);
        demoUpdate(engine);
        demoRankingStrategySwap(engine);
        System.out.println("\n=== Demo complete ===");
    }

    private static void demoIndexAndTfIdf(SimpleSearch engine) {
        System.out.println("--- 1. Index documents and TF-IDF search ---");
        engine.index(new Document("d1", "Java Design Patterns", "explores strategy observer and factory patterns in Java"));
        engine.index(new Document("d2", "Spring Boot Tutorial", "build REST APIs with Spring Boot and Java"));
        engine.index(new Document("d3", "Python Data Science", "pandas numpy machine learning basics"));
        printResults(engine.search("java patterns"));
    }

    private static void demoTitleMatch(SimpleSearch engine) {
        System.out.println("\n--- 2. Title-only term match ---");
        printResults(engine.search("spring"));
    }

    private static void demoPagination(SimpleSearch engine) {
        System.out.println("\n--- 3. Pagination ---");
        printResults(engine.search("java", 0, 1));
        printResults(engine.search("java", 1, 1));
    }

    private static void demoUpdate(SimpleSearch engine) {
        System.out.println("\n--- 4. Update re-indexes document ---");
        engine.update(new Document("d3", "Python for LLD", "low level design interview prep with Python examples"));
        printResults(engine.search("lld interview"));
    }

    private static void demoRankingStrategySwap(SimpleSearch engine) {
        System.out.println("\n--- 5. Ranking strategy swap ---");
        System.out.println("  TF-IDF:");
        printResults(engine.search("java spring"));
        engine.setRankingStrategy(new MatchCountRankingStrategy());
        System.out.println("  Match-count:");
        printResults(engine.search("java spring"));
        engine.setRankingStrategy(new TfIdfRankingStrategy());
    }

    private static void printResults(List<SearchResult> results) {
        if (results.isEmpty()) {
            System.out.println("  (no results)");
            return;
        }
        for (SearchResult r : results) {
            System.out.println("  " + r);
        }
    }
}
```

</details>

### `SimpleSearch.java`

<details>
<summary>Click to view SimpleSearch.java</summary>

```java
package com.you.lld.problems.simplesearch;

import com.you.lld.problems.simplesearch.model.Document;
import com.you.lld.problems.simplesearch.model.SearchResult;
import com.you.lld.problems.simplesearch.service.RankingStrategy;
import com.you.lld.problems.simplesearch.service.impl.InMemoryInvertedIndex;
import com.you.lld.problems.simplesearch.service.impl.InvertedIndexSearchEngine;
import com.you.lld.problems.simplesearch.service.impl.TfIdfRankingStrategy;
import java.util.List;

public final class SimpleSearch {

    private final InvertedIndexSearchEngine engine;

    public SimpleSearch() {
        this(new TfIdfRankingStrategy());
    }

    public SimpleSearch(RankingStrategy rankingStrategy) {
        this.engine = new InvertedIndexSearchEngine(new InMemoryInvertedIndex(), rankingStrategy);
    }

    public boolean index(Document document) {
        return engine.indexDocument(document);
    }

    public boolean remove(String documentId) {
        return engine.removeDocument(documentId);
    }

    public boolean update(Document document) {
        return engine.updateDocument(document);
    }

    public List<SearchResult> search(String query) {
        return engine.search(query);
    }

    public List<SearchResult> search(String query, int offset, int limit) {
        return engine.search(query, offset, limit);
    }

    public void setRankingStrategy(RankingStrategy rankingStrategy) {
        engine.setRankingStrategy(rankingStrategy);
    }
}
```

</details>

### `model/Document.java`

<details>
<summary>Click to view model/Document.java</summary>

```java
package com.you.lld.problems.simplesearch.model;

import java.time.LocalDateTime;

public final class Document {

    private final String id;
    private final String title;
    private final String content;
    private final LocalDateTime createdAt;

    public Document(String id, String title, String content) {
        if (id == null || id.trim().isEmpty()) {
            throw new IllegalArgumentException("id required");
        }
        if (title == null || content == null) {
            throw new IllegalArgumentException("title and content required");
        }
        this.id = id;
        this.title = title;
        this.content = content;
        this.createdAt = LocalDateTime.now();
    }

    public String getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getContent() {
        return content;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public String fullText() {
        return title + " " + content;
    }

    @Override
    public String toString() {
        return id + ": " + title;
    }
}
```

</details>

### `model/SearchResult.java`

<details>
<summary>Click to view model/SearchResult.java</summary>

```java
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
```

</details>

### `service/InvertedIndex.java`

<details>
<summary>Click to view service/InvertedIndex.java</summary>

```java
package com.you.lld.problems.simplesearch.service;

import com.you.lld.problems.simplesearch.model.Document;
import com.you.lld.problems.simplesearch.model.SearchResult;
import java.util.List;
import java.util.Map;
import java.util.Set;

public interface InvertedIndex {

    void indexDocument(Document document);

    void removeDocument(String documentId);

    Set<String> lookup(String term);

    Map<String, Integer> getTermFrequencies(String documentId);

    int getDocumentCount();

    Document getDocument(String documentId);
}
```

</details>

### `service/RankingStrategy.java`

<details>
<summary>Click to view service/RankingStrategy.java</summary>

```java
package com.you.lld.problems.simplesearch.service;

import com.you.lld.problems.simplesearch.model.Document;
import com.you.lld.problems.simplesearch.model.SearchResult;
import java.util.List;
import java.util.Map;
import java.util.Set;

public interface RankingStrategy {

    List<SearchResult> rank(List<String> queryTerms, Set<String> candidateDocIds,
                            InvertedIndex index, int offset, int limit);
}
```

</details>

### `service/SearchEngine.java`

<details>
<summary>Click to view service/SearchEngine.java</summary>

```java
package com.you.lld.problems.simplesearch.service;

import com.you.lld.problems.simplesearch.model.Document;
import com.you.lld.problems.simplesearch.model.SearchResult;
import java.util.List;

public interface SearchEngine {

    boolean indexDocument(Document document);

    boolean removeDocument(String documentId);

    boolean updateDocument(Document document);

    List<SearchResult> search(String query);

    List<SearchResult> search(String query, int offset, int limit);
}
```

</details>

### `service/impl/InMemoryInvertedIndex.java`

<details>
<summary>Click to view service/impl/InMemoryInvertedIndex.java</summary>

```java
package com.you.lld.problems.simplesearch.service.impl;

import com.you.lld.problems.simplesearch.model.Document;
import com.you.lld.problems.simplesearch.service.InvertedIndex;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

public final class InMemoryInvertedIndex implements InvertedIndex {

    private final Map<String, Map<String, Integer>> postings = new HashMap<String, Map<String, Integer>>();
    private final Map<String, Document> documents = new HashMap<String, Document>();
    private final Map<String, Map<String, Integer>> docTermFreq = new HashMap<String, Map<String, Integer>>();

    @Override
    public synchronized void indexDocument(Document document) {
        removeDocument(document.getId());
        documents.put(document.getId(), document);
        Map<String, Integer> termCounts = termCounts(document.fullText());
        docTermFreq.put(document.getId(), termCounts);
        for (Map.Entry<String, Integer> entry : termCounts.entrySet()) {
            Map<String, Integer> docs = postings.get(entry.getKey());
            if (docs == null) {
                docs = new HashMap<String, Integer>();
                postings.put(entry.getKey(), docs);
            }
            docs.put(document.getId(), entry.getValue());
        }
    }

    @Override
    public synchronized void removeDocument(String documentId) {
        Map<String, Integer> terms = docTermFreq.remove(documentId);
        documents.remove(documentId);
        if (terms == null) {
            return;
        }
        for (String term : terms.keySet()) {
            Map<String, Integer> docs = postings.get(term);
            if (docs != null) {
                docs.remove(documentId);
                if (docs.isEmpty()) {
                    postings.remove(term);
                }
            }
        }
    }

    @Override
    public synchronized Set<String> lookup(String term) {
        Map<String, Integer> docs = postings.get(term);
        if (docs == null) {
            return new HashSet<String>();
        }
        return new HashSet<String>(docs.keySet());
    }

    @Override
    public synchronized Map<String, Integer> getTermFrequencies(String documentId) {
        Map<String, Integer> freqs = docTermFreq.get(documentId);
        if (freqs == null) {
            return new HashMap<String, Integer>();
        }
        return new HashMap<String, Integer>(freqs);
    }

    @Override
    public synchronized int getDocumentCount() {
        return documents.size();
    }

    @Override
    public synchronized Document getDocument(String documentId) {
        return documents.get(documentId);
    }

    /**
     * THE tokenizer. Indexing and querying must split text identically — if the two
     * ever disagree, queries silently stop matching documents that do contain the
     * word. This used to be two separate implementations of the same rule; they
     * agreed by luck, and nothing would have caught them drifting apart.
     */
    static List<String> tokenize(String text) {
        List<String> tokens = new ArrayList<String>();
        if (text == null || text.trim().isEmpty()) {
            return tokens;
        }
        for (String part : text.toLowerCase().split("\\W+")) {
            if (!part.isEmpty()) {
                tokens.add(part);
            }
        }
        return tokens;
    }

    static List<String> tokenizeQuery(String query) {
        return tokenize(query);
    }

    private Map<String, Integer> termCounts(String text) {
        Map<String, Integer> counts = new HashMap<String, Integer>();
        for (String token : tokenize(text)) {
            Integer count = counts.get(token);
            counts.put(token, count == null ? 1 : count + 1);
        }
        return counts;
    }
}
```

</details>

### `service/impl/InvertedIndexSearchEngine.java`

<details>
<summary>Click to view service/impl/InvertedIndexSearchEngine.java</summary>

```java
package com.you.lld.problems.simplesearch.service.impl;

import com.you.lld.problems.simplesearch.exceptions.DocumentNotFoundException;
import com.you.lld.problems.simplesearch.model.Document;
import com.you.lld.problems.simplesearch.model.SearchResult;
import com.you.lld.problems.simplesearch.service.InvertedIndex;
import com.you.lld.problems.simplesearch.service.RankingStrategy;
import com.you.lld.problems.simplesearch.service.SearchEngine;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public final class InvertedIndexSearchEngine implements SearchEngine {

    private static final int DEFAULT_LIMIT = 100;

    private final InvertedIndex index;
    private volatile RankingStrategy rankingStrategy;

    public InvertedIndexSearchEngine(InvertedIndex index, RankingStrategy rankingStrategy) {
        this.index = index;
        this.rankingStrategy = rankingStrategy;
    }

    public synchronized void setRankingStrategy(RankingStrategy rankingStrategy) {
        this.rankingStrategy = rankingStrategy;
    }

    @Override
    public synchronized boolean indexDocument(Document document) {
        if (index.getDocument(document.getId()) != null) {
            return false;
        }
        index.indexDocument(document);
        return true;
    }

    @Override
    public synchronized boolean removeDocument(String documentId) {
        if (index.getDocument(documentId) == null) {
            return false;
        }
        index.removeDocument(documentId);
        return true;
    }

    @Override
    public synchronized boolean updateDocument(Document document) {
        if (index.getDocument(document.getId()) == null) {
            throw new DocumentNotFoundException(document.getId());
        }
        index.indexDocument(document);
        return true;
    }

    @Override
    public List<SearchResult> search(String query) {
        return search(query, 0, DEFAULT_LIMIT);
    }

    /**
     * Synchronized so the whole query sees ONE consistent view of the index.
     *
     * <p>Every individual index method is synchronized, so there was no data race —
     * but a query is a composite of many of them (lookup per term, then
     * getDocument/getTermFrequencies per candidate). Without the lock held across
     * the whole operation, a concurrent removeDocument could retire a document
     * between it being selected as a candidate and being scored, and getDocumentCount
     * could change mid-ranking, skewing every IDF computed after it.
     */
    @Override
    public synchronized List<SearchResult> search(String query, int offset, int limit) {
        List<String> terms = InMemoryInvertedIndex.tokenizeQuery(query);
        Set<String> candidates = new HashSet<String>();
        for (String term : terms) {
            candidates.addAll(index.lookup(term));
        }
        return rankingStrategy.rank(terms, candidates, index, offset, limit);
    }
}
```

</details>

### `service/impl/MatchCountRankingStrategy.java`

<details>
<summary>Click to view service/impl/MatchCountRankingStrategy.java</summary>

```java
package com.you.lld.problems.simplesearch.service.impl;

import com.you.lld.problems.simplesearch.model.Document;
import com.you.lld.problems.simplesearch.model.SearchResult;
import com.you.lld.problems.simplesearch.service.InvertedIndex;
import com.you.lld.problems.simplesearch.service.RankingStrategy;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Simple match-count ranking — useful to contrast with TF-IDF in demos.
 */
public final class MatchCountRankingStrategy implements RankingStrategy {

    @Override
    public List<SearchResult> rank(List<String> queryTerms, Set<String> candidateDocIds,
                                   InvertedIndex index, int offset, int limit) {
        List<SearchResult> results = new ArrayList<SearchResult>();
        for (String docId : candidateDocIds) {
            Document doc = index.getDocument(docId);
            if (doc == null) {
                continue;
            }
            // Fetch the term map ONCE per document. getTermFrequencies copies the
            // whole map, so calling it inside the term loop copied it per query term.
            Map<String, Integer> termFreq = index.getTermFrequencies(docId);
            int matches = 0;
            for (String term : queryTerms) {
                if (termFreq.containsKey(term)) {
                    matches++;
                }
            }
            if (matches > 0) {
                results.add(new SearchResult(doc, matches));
            }
        }
        Collections.sort(results, new Comparator<SearchResult>() {
            @Override
            public int compare(SearchResult a, SearchResult b) {
                return Double.compare(b.getScore(), a.getScore());
            }
        });
        int from = Math.min(offset, results.size());
        int to = Math.min(from + limit, results.size());
        return new ArrayList<SearchResult>(results.subList(from, to));
    }
}
```

</details>

### `service/impl/TfIdfRankingStrategy.java`

<details>
<summary>Click to view service/impl/TfIdfRankingStrategy.java</summary>

```java
package com.you.lld.problems.simplesearch.service.impl;

import com.you.lld.problems.simplesearch.model.Document;
import com.you.lld.problems.simplesearch.model.SearchResult;
import com.you.lld.problems.simplesearch.service.InvertedIndex;
import com.you.lld.problems.simplesearch.service.RankingStrategy;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

public final class TfIdfRankingStrategy implements RankingStrategy {

    @Override
    public List<SearchResult> rank(List<String> queryTerms, Set<String> candidateDocIds,
                                   InvertedIndex index, int offset, int limit) {
        List<SearchResult> results = new ArrayList<SearchResult>();
        int totalDocs = index.getDocumentCount();
        if (totalDocs == 0 || queryTerms.isEmpty()) {
            return results;
        }

        // IDF depends only on the term and the corpus, so compute it ONCE per term.
        // It used to be recomputed inside the per-document loop via index.lookup(term),
        // which copies the term's entire posting set — making a single-term query
        // quadratic in corpus size (8000 docs took 862 ms before this hoist).
        Map<String, Double> idfByTerm = new HashMap<String, Double>();
        for (String term : queryTerms) {
            if (!idfByTerm.containsKey(term)) {
                int df = index.lookup(term).size();
                idfByTerm.put(term, Math.log((double) (totalDocs + 1) / (df + 1)) + 1.0);
            }
        }

        for (String docId : candidateDocIds) {
            Document doc = index.getDocument(docId);
            if (doc == null) {
                continue;
            }
            Map<String, Integer> termFreq = index.getTermFrequencies(docId);
            int docLength = 0;
            for (Integer tf : termFreq.values()) {
                docLength += tf;
            }
            double score = 0.0;
            for (String term : queryTerms) {
                Integer tf = termFreq.get(term);
                if (tf == null) {
                    continue;
                }
                double normalizedTf = (double) tf / Math.max(1, docLength);
                score += normalizedTf * idfByTerm.get(term);
            }
            if (score > 0.0) {
                results.add(new SearchResult(doc, score));
            }
        }

        Collections.sort(results, new Comparator<SearchResult>() {
            @Override
            public int compare(SearchResult a, SearchResult b) {
                return Double.compare(b.getScore(), a.getScore());
            }
        });

        int from = Math.min(offset, results.size());
        int to = Math.min(from + limit, results.size());
        // Copy: subList returns a view holding the whole backing list alive.
        return new ArrayList<SearchResult>(results.subList(from, to));
    }
}
```

</details>

### `exceptions/DocumentNotFoundException.java`

<details>
<summary>Click to view exceptions/DocumentNotFoundException.java</summary>

```java
package com.you.lld.problems.simplesearch.exceptions;
public class DocumentNotFoundException extends RuntimeException { public DocumentNotFoundException(String m) { super(m); } }
```

</details>

### `exceptions/IndexingException.java`

<details>
<summary>Click to view exceptions/IndexingException.java</summary>

```java
package com.you.lld.problems.simplesearch.exceptions;
public class IndexingException extends RuntimeException { public IndexingException(String m) { super(m); } }
```

</details>

## Run Demo

```bash
mvn -q compile exec:java -Dexec.mainClass="com.you.lld.problems.simplesearch.SimpleSearchDemo"
```
