# simplesearch - Complete Implementation

> Generated from `src/main/java/com/you/lld/problems/simplesearch/` on 2026-05-31. Re-run `python3 scripts/generate-code-md.py simplesearch`.

## Project Structure (13 files)

```
simplesearch/
├── SearchDemo.java
├── Document.java
├── InvertedIndex.java
├── SearchEngine.java
├── api/SearchEngine.java
├── model/Document.java
├── model/Index.java
├── model/Query.java
├── model/Ranking.java
├── model/SearchResult.java
├── impl/InvertedIndexSearchEngine.java
├── exceptions/DocumentNotFoundException.java
├── exceptions/IndexingException.java
```

## Source Code

### `SearchDemo.java`

<details>
<summary>Click to view SearchDemo.java</summary>

```java
package com.you.lld.problems.simplesearch;

import com.you.lld.problems.simplesearch.impl.InvertedIndexSearchEngine;
import com.you.lld.problems.simplesearch.model.Document;
import com.you.lld.problems.simplesearch.model.SearchResult;

import java.util.List;

/**
 * Demo: Search Engine with inverted index, relevance scoring, pagination.
 */
public class SearchDemo {

    public static void main(String[] args) {
        System.out.println("=== Simple Search Engine Demo ===\n");

        InvertedIndexSearchEngine engine = new InvertedIndexSearchEngine();

        // Index documents
        System.out.println("--- Indexing documents ---");
        engine.indexDocument(new Document("d1", "Java Design Patterns",
            "Design patterns in Java including singleton, factory, observer, strategy and decorator patterns"));
        engine.indexDocument(new Document("d2", "Data Structures in Java",
            "Arrays, linked lists, trees, graphs, hash maps and priority queues in Java"));
        engine.indexDocument(new Document("d3", "Spring Boot Tutorial",
            "Building REST APIs with Spring Boot framework including dependency injection"));
        engine.indexDocument(new Document("d4", "System Design Basics",
            "Load balancing, caching, database sharding and microservices architecture"));
        engine.indexDocument(new Document("d5", "Java Concurrency",
            "Threads, locks, concurrent collections, executors and CompletableFuture in Java"));
        System.out.println("Indexed " + engine.getDocumentCount() + " documents");

        // Search
        System.out.println("\n--- Search: 'java' ---");
        List<SearchResult> results = engine.search("java");
        for (SearchResult r : results) {
            System.out.printf("  [%.2f] %s%n", r.getScore(), r.getDocument().getTitle());
        }

        System.out.println("\n--- Search: 'design patterns' ---");
        results = engine.search("design patterns");
        for (SearchResult r : results) {
            System.out.printf("  [%.2f] %s%n", r.getScore(), r.getDocument().getTitle());
        }

        System.out.println("\n--- Search: 'spring' ---");
        results = engine.search("spring");
        for (SearchResult r : results) {
            System.out.printf("  [%.2f] %s%n", r.getScore(), r.getDocument().getTitle());
        }

        // Pagination
        System.out.println("\n--- Pagination: 'java', limit=2, offset=0 ---");
        results = engine.search("java", 2, 0);
        System.out.println("Page 1: " + results.size() + " results");
        for (SearchResult r : results) {
            System.out.printf("  [%.2f] %s%n", r.getScore(), r.getDocument().getTitle());
        }

        results = engine.search("java", 2, 2);
        System.out.println("Page 2: " + results.size() + " results");
        for (SearchResult r : results) {
            System.out.printf("  [%.2f] %s%n", r.getScore(), r.getDocument().getTitle());
        }

        // Update document
        System.out.println("\n--- Update document ---");
        engine.updateDocument(new Document("d3", "Spring Boot Advanced",
            "Advanced Spring Boot with Java microservices, security, and testing"));
        results = engine.search("spring java");
        for (SearchResult r : results) {
            System.out.printf("  [%.2f] %s%n", r.getScore(), r.getDocument().getTitle());
        }

        // Remove document
        System.out.println("\n--- Remove document ---");
        engine.removeDocument("d4");
        System.out.println("Documents: " + engine.getDocumentCount());

        // No results
        System.out.println("\n--- Search: 'kubernetes' (no match) ---");
        results = engine.search("kubernetes");
        System.out.println("Results: " + results.size());

        System.out.println("\n=== Demo complete ===");
    }
}
```

</details>

### `Document.java`

<details>
<summary>Click to view Document.java</summary>

```java
package com.you.lld.problems.simplesearch;

public class Document {
    private final String id;
    private final String title;
    private final String content;
    
    public Document(String id, String title, String content) {
        this.id = id;
        this.title = title;
        this.content = content;
    }
    
    public String getId() { return id; }
    public String getTitle() { return title; }
    public String getContent() { return content; }
}
```

</details>

### `InvertedIndex.java`

<details>
<summary>Click to view InvertedIndex.java</summary>

```java
package com.you.lld.problems.simplesearch;

import java.util.*;

public class InvertedIndex {
    private final Map<String, List<String>> index; // term -> list of docIds
    
    public InvertedIndex() {
        this.index = new HashMap<>();
    }
    
    public void addDocument(Document doc) {
        String[] words = tokenize(doc.getTitle() + " " + doc.getContent());
        for (String word : words) {
            index.computeIfAbsent(word.toLowerCase(), k -> new ArrayList<>()).add(doc.getId());
        }
    }
    
    public List<String> search(String query) {
        String[] terms = tokenize(query);
        Set<String> results = new HashSet<>();
        
        for (String term : terms) {
            List<String> docs = index.get(term.toLowerCase());
            if (docs != null) {
                results.addAll(docs);
            }
        }
        
        return new ArrayList<>(results);
    }
    
    private String[] tokenize(String text) {
        return text.toLowerCase().split("\\W+");
    }
}
```

</details>

### `SearchEngine.java`

<details>
<summary>Click to view SearchEngine.java</summary>

```java
package com.you.lld.problems.simplesearch;

import java.util.*;

public class SearchEngine {
    private final Map<String, Document> documents;
    private final InvertedIndex invertedIndex;
    
    public SearchEngine() {
        this.documents = new HashMap<>();
        this.invertedIndex = new InvertedIndex();
    }
    
    public void indexDocument(Document doc) {
        documents.put(doc.getId(), doc);
        invertedIndex.addDocument(doc);
    }
    
    public List<Document> search(String query) {
        List<String> docIds = invertedIndex.search(query);
        List<Document> results = new ArrayList<>();
        for (String docId : docIds) {
            Document doc = documents.get(docId);
            if (doc != null) {
                results.add(doc);
            }
        }
        return results;
    }
}
```

</details>

### `api/SearchEngine.java`

<details>
<summary>Click to view api/SearchEngine.java</summary>

```java
package com.you.lld.problems.simplesearch.api;

import com.you.lld.problems.simplesearch.model.Document;
import com.you.lld.problems.simplesearch.model.SearchResult;

import java.util.List;

/**
 * Service interface for a simple search engine.
 * Supports document indexing and full-text search.
 */
public interface SearchEngine {
    
    /**
     * Indexes a document for searching.
     * 
     * @param document Document to index
     * @return true if indexed successfully
     */
    boolean indexDocument(Document document);
    
    /**
     * Removes a document from the index.
     * 
     * @param documentId Document ID to remove
     * @return true if removed successfully
     */
    boolean removeDocument(String documentId);
    
    /**
     * Searches for documents matching the query.
     * 
     * @param query Search query
     * @return List of matching documents ranked by relevance
     */
    List<SearchResult> search(String query);
    
    /**
     * Searches with pagination support.
     * 
     * @param query Search query
     * @param limit Maximum number of results
     * @param offset Starting offset for results
     * @return List of matching documents
     */
    List<SearchResult> search(String query, int limit, int offset);
    
    /**
     * Updates an existing document in the index.
     * 
     * @param document Updated document
     * @return true if updated successfully
     */
    boolean updateDocument(Document document);
    
    /**
     * Gets total number of indexed documents.
     * 
     * @return Document count
     */
    int getDocumentCount();
}
```

</details>

### `model/Document.java`

<details>
<summary>Click to view model/Document.java</summary>

```java
package com.you.lld.problems.simplesearch.model;

import java.time.LocalDateTime;

/**
 * Represents a searchable document.
 */
public class Document {
    private final String id;
    private final String title;
    private final String content;
    private final LocalDateTime createdAt;
    
    public Document(String id, String title, String content) {
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
}
```

</details>

### `model/Index.java`

<details>
<summary>Click to view model/Index.java</summary>

```java
package com.you.lld.problems.simplesearch.model;
import java.util.*;
public
class Index  {
    private String indexId;
    public Index(String id)  {
        indexId=id;
    }
    public String getIndexId()  {
        return indexId;
    }
}
```

</details>

### `model/Query.java`

<details>
<summary>Click to view model/Query.java</summary>

```java
package com.you.lld.problems.simplesearch.model;
import java.util.*;
public
class Query  {
    private String queryId;
    public Query(String id)  {
        queryId=id;
    }
    public String getQueryId()  {
        return queryId;
    }
}
```

</details>

### `model/Ranking.java`

<details>
<summary>Click to view model/Ranking.java</summary>

```java
package com.you.lld.problems.simplesearch.model;
import java.util.*;
public
class Ranking  {
    private String rankingId;
    public Ranking(String id)  {
        rankingId=id;
    }
    public String getRankingId()  {
        return rankingId;
    }
}
```

</details>

### `model/SearchResult.java`

<details>
<summary>Click to view model/SearchResult.java</summary>

```java
package com.you.lld.problems.simplesearch.model;

/**
 * Represents a search result with relevance score.
 */
public class SearchResult {
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
}
```

</details>

### `impl/InvertedIndexSearchEngine.java`

<details>
<summary>Click to view impl/InvertedIndexSearchEngine.java</summary>

```java
package com.you.lld.problems.simplesearch.impl;

import com.you.lld.problems.simplesearch.api.SearchEngine;
import com.you.lld.problems.simplesearch.model.Document;
import com.you.lld.problems.simplesearch.model.SearchResult;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

/**
 * Search engine implementation using inverted index.
 * Thread-safe for concurrent operations.
 */
public class InvertedIndexSearchEngine implements SearchEngine {
    
    private final Map<String, Document> documents;
    private final Map<String, Set<String>> invertedIndex; // word -> document IDs
    private final Map<String, Integer> documentWordCount; // docId -> word count
    
    public InvertedIndexSearchEngine() {
        this.documents = new ConcurrentHashMap<>();
        this.invertedIndex = new ConcurrentHashMap<>();
        this.documentWordCount = new ConcurrentHashMap<>();
    }
    
    @Override
    public boolean indexDocument(Document document) {
        if (documents.containsKey(document.getId())) {
            return false;
        }
        
        documents.put(document.getId(), document);
        
        // Tokenize and index
        String[] words = tokenize(document.getContent());
        documentWordCount.put(document.getId(), words.length);
        
        for (String word : words) {
            invertedIndex.computeIfAbsent(word, k -> ConcurrentHashMap.newKeySet())
                         .add(document.getId());
        }
        
        return true;
    }
    
    @Override
    public boolean removeDocument(String documentId) {
        Document doc = documents.remove(documentId);
        if (doc == null) {
            return false;
        }
        
        // Remove from inverted index
        String[] words = tokenize(doc.getContent());
        for (String word : words) {
            Set<String> docIds = invertedIndex.get(word);
            if (docIds != null) {
                docIds.remove(documentId);
                if (docIds.isEmpty()) {
                    invertedIndex.remove(word);
                }
            }
        }
        
        documentWordCount.remove(documentId);
        return true;
    }
    
    @Override
    public List<SearchResult> search(String query) {
        return search(query, 100, 0);
    }
    
    @Override
    public List<SearchResult> search(String query, int limit, int offset) {
        String[] queryWords = tokenize(query);
        int totalDocs = documents.size();
        Map<String, Double> docScores = new HashMap<>();
        
        // Calculate TF-IDF scores for each document
        for (String word : queryWords) {
            Set<String> docIds = invertedIndex.get(word);
            if (docIds != null) {
                // IDF = log(N / df) where N = total docs, df = docs containing term
                double idf = Math.log((double) totalDocs / docIds.size());
                for (String docId : docIds) {
                    // TF = 1 / docLength (normalized term frequency)
                    double tf = 1.0 / documentWordCount.getOrDefault(docId, 1);
                    docScores.merge(docId, tf * idf, Double::sum);
                }
            }
        }
        
        // Convert to SearchResults and sort by relevance
        List<SearchResult> results = docScores.entrySet().stream()
            .map(entry -> new SearchResult(documents.get(entry.getKey()), entry.getValue()))
            .sorted((a, b) -> Double.compare(b.getScore(), a.getScore()))
            .skip(offset)
            .limit(limit)
            .collect(Collectors.toList());
        
        return results;
    }
    
    @Override
    public boolean updateDocument(Document document) {
        if (!documents.containsKey(document.getId())) {
            return false;
        }
        
        removeDocument(document.getId());
        indexDocument(document);
        return true;
    }
    
    @Override
    public int getDocumentCount() {
        return documents.size();
    }
    
    private String[] tokenize(String text) {
        return text.toLowerCase()
                   .replaceAll("[^a-z0-9\\s]", "")
                   .split("\\s+");
    }
    
    // scoring is now inline in search() using proper TF-IDF
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
mvn -q compile exec:java -Dexec.mainClass="com.you.lld.problems.simplesearch.SearchDemo"
```
