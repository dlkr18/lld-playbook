# Source Code

This page contains the complete source code for this problem.

## 📁 Directory Structure

```
├── Document.java
├── InvertedIndex.java
├── SearchEngine.java
├── api/SearchEngine.java
├── exceptions/DocumentNotFoundException.java
├── exceptions/IndexingException.java
├── impl/InvertedIndexSearchEngine.java
├── model/Document.java
├── model/Index.java
├── model/Query.java
├── model/Ranking.java
├── model/SearchResult.java
```

## Document.java

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

## InvertedIndex.java

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

## SearchEngine.java

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

## SearchEngine.java

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

## DocumentNotFoundException.java

```java
package com.you.lld.problems.simplesearch.exceptions;
public class DocumentNotFoundException extends RuntimeException { public DocumentNotFoundException(String m) { super(m); } }```

## IndexingException.java

```java
package com.you.lld.problems.simplesearch.exceptions;
public class IndexingException extends RuntimeException { public IndexingException(String m) { super(m); } }```

## InvertedIndexSearchEngine.java

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
        Map<String, Integer> docScores = new HashMap<>();
        
        // Calculate scores for each document
        for (String word : queryWords) {
            Set<String> docIds = invertedIndex.get(word);
            if (docIds != null) {
                for (String docId : docIds) {
                    docScores.merge(docId, 1, Integer::sum);
                }
            }
        }
        
        // Convert to SearchResults and sort by relevance
        List<SearchResult> results = docScores.entrySet().stream()
            .map(entry -> {
                Document doc = documents.get(entry.getKey());
                double score = calculateScore(entry.getValue(), queryWords.length, 
                                             documentWordCount.get(entry.getKey()));
                return new SearchResult(doc, score);
            })
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
    
    private double calculateScore(int matchCount, int queryLength, int docLength) {
        // Simple TF-IDF-like scoring
        double termFrequency = (double) matchCount / docLength;
        double queryRelevance = (double) matchCount / queryLength;
        return termFrequency * queryRelevance;
    }
}

```

## Document.java

```java
package com.you.lld.problems.simplesearch.model;
import java.util.*;
public
class Document  {
    private String documentId;
    public Document(String id)  {
        documentId=id;
    }
    public String getDocumentId()  {
        return documentId;
    }
}
```

## Index.java

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

## Query.java

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

## Ranking.java

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

## SearchResult.java

```java
package com.you.lld.problems.simplesearch.model;
import java.util.*;
public
class SearchResult  {
    private String searchresultId;
    public SearchResult(String id)  {
        searchresultId=id;
    }
    public String getSearchResultId()  {
        return searchresultId;
    }
}
```

