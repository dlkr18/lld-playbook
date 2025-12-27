# Search Engine (Full-Text Search)

## Overview
A full-text search engine supporting document indexing, relevance ranking (TF-IDF, BM25), query processing, and result ranking. Implements inverted index for fast lookups, supports boolean queries, phrase search, and faceted filtering for millions of documents.

**Difficulty:** Hard  
**Domain:** Information Retrieval, Search  
**Interview Frequency:** Very High (Google, Elasticsearch, Algolia, Yelp)

## Requirements

### Functional Requirements
1. **Document Indexing**
   - Add/update/delete documents
   - Extract and tokenize text
   - Build inverted index
   - Support structured fields

2. **Search Operations**
   - Keyword search
   - Phrase search ("exact phrase")
   - Boolean queries (AND, OR, NOT)
   - Wildcard search (prefix*, *suffix)
   - Fuzzy search (typo tolerance)

3. **Ranking**
   - Relevance scoring (TF-IDF, BM25)
   - Boost by field importance
   - Recency boosting
   - Custom scoring functions

4. **Filtering & Faceting**
   - Filter by field values
   - Date range filtering
   - Numeric range filtering
   - Faceted navigation

5. **Analytics**
   - Search analytics
   - Popular queries
   - Click-through rate
   - Zero-result queries

### Non-Functional Requirements
1. **Performance**
   - Indexing: 1000+ docs/sec
   - Search: < 100ms response time
   - Support 100M+ documents

2. **Scalability**
   - Distributed indexing
   - Shard across nodes
   - Horizontal scaling

3. **Availability**
   - 99.9% uptime
   - Replication for failover
   - Real-time updates

## System Architecture

```
┌────────────────────────────────────────────────────────┐
│                  Document Sources                       │
│   (Web pages, PDFs, DBs, APIs, Files)                  │
└──────────────────┬─────────────────────────────────────┘
                   │
         ┌─────────▼──────────┐
         │   Document Parser  │
         │  (Extract content) │
         └─────────┬──────────┘
                   │
         ┌─────────▼──────────┐
         │    Tokenizer       │
         │ (Split into terms) │
         └─────────┬──────────┘
                   │
         ┌─────────▼──────────┐
         │  Text Processor    │
         │ (Lowercase, stem)  │
         └─────────┬──────────┘
                   │
         ┌─────────▼──────────┐
         │  Inverted Index    │
         │                    │
         │ term → [doc1, doc3]│
         │ word → [doc2, doc5]│
         └─────────┬──────────┘
                   │
         ┌─────────▼──────────┐
         │   Index Storage    │
         │  (Disk/Memory)     │
         └────────────────────┘
                   
    User Query: "machine learning"
                   │
         ┌─────────▼──────────┐
         │  Query Parser      │
         │ (Parse + analyze)  │
         └─────────┬──────────┘
                   │
         ┌─────────▼──────────┐
         │  Query Executor    │
         │ (Lookup in index)  │
         └─────────┬──────────┘
                   │
         ┌─────────▼──────────┐
         │  Scoring Engine    │
         │   (TF-IDF/BM25)    │
         └─────────┬──────────┘
                   │
         ┌─────────▼──────────┐
         │  Result Ranker     │
         │ (Sort by score)    │
         └─────────┬──────────┘
                   │
                   ▼
          Ranked Results:
          1. Doc#42 (score: 8.5)
          2. Doc#17 (score: 7.2)
          3. Doc#99 (score: 6.8)
```

## Core Data Structures

### 1. Inverted Index
Maps terms to document IDs containing them.

```java
public class InvertedIndex {
    // term → list of (docId, positions, frequency)
    private Map<String, List<Posting>> index;
    
    public void addDocument(int docId, String content) {
        String[] terms = tokenize(content);
        
        for (int pos = 0; pos < terms.length; pos++) {
            String term = normalize(terms[pos]);
            
            // Add to inverted index
            Posting posting = new Posting(docId, pos);
            index.computeIfAbsent(term, k -> new ArrayList<>())
                 .add(posting);
        }
    }
    
    public List<Integer> search(String term) {
        term = normalize(term);
        List<Posting> postings = index.get(term);
        
        if (postings == null) {
            return Collections.emptyList();
        }
        
        return postings.stream()
            .map(Posting::getDocId)
            .distinct()
            .collect(Collectors.toList());
    }
}

class Posting {
    private int docId;
    private int position;
    private int frequency;
    
    // Constructor, getters
}
```

**Example:**
```
Documents:
Doc1: "machine learning is awesome"
Doc2: "deep learning and machine learning"

Inverted Index:
"machine"  → [Doc1: [0], Doc2: [2, 4]]
"learning" → [Doc1: [1], Doc2: [1, 5]]
"deep"     → [Doc2: [0]]
"awesome"  → [Doc1: [3]]
```

### 2. Document Store
```java
public class DocumentStore {
    private Map<Integer, Document> documents;
    
    public void addDocument(Document doc) {
        documents.put(doc.getId(), doc);
    }
    
    public Document getDocument(int docId) {
        return documents.get(docId);
    }
}

class Document {
    private int id;
    private String title;
    private String content;
    private Map<String, Object> fields;
    private long timestamp;
}
```

## Key Algorithms

### 1. TF-IDF Scoring
```java
public class TFIDFScorer {
    private int totalDocs;
    private Map<String, Integer> docFrequency; // term → doc count
    
    public double score(String term, int docId) {
        // Term Frequency: how often term appears in doc
        int termFreq = getTermFrequency(term, docId);
        double tf = termFreq / (double) getDocLength(docId);
        
        // Inverse Document Frequency: rarity of term
        int df = docFrequency.getOrDefault(term, 0);
        double idf = Math.log((double) totalDocs / (df + 1));
        
        return tf * idf;
    }
    
    public double scoreQuery(List<String> queryTerms, int docId) {
        double totalScore = 0.0;
        
        for (String term : queryTerms) {
            totalScore += score(term, docId);
        }
        
        return totalScore;
    }
}
```

**TF-IDF Explained:**
- **TF (Term Frequency):** How often does term appear in document?
  - High TF = term is important to this document
- **IDF (Inverse Document Frequency):** How rare is the term across all documents?
  - High IDF = term is unique/distinctive
- **TF-IDF = TF × IDF:** Balances frequency and rarity

**Example:**
```
Query: "machine learning"
Doc1: "machine learning is awesome" (4 words)
  - TF("machine") = 1/4 = 0.25
  - IDF("machine") = log(2/2) = 0
  - TF-IDF("machine") = 0.25 * 0 = 0
  
  - TF("learning") = 1/4 = 0.25
  - IDF("learning") = log(2/2) = 0
  - TF-IDF("learning") = 0.25 * 0 = 0
  
  Total Score = 0 (common terms)

Doc2: "deep learning" (2 words)
  - TF("learning") = 1/2 = 0.5
  - IDF("learning") = log(2/2) = 0
  - Total Score = 0.5 * 0 = 0
```

### 2. BM25 Scoring (Better than TF-IDF)
```java
public class BM25Scorer {
    private static final double K1 = 1.2; // Term frequency saturation
    private static final double B = 0.75; // Length normalization
    
    private double avgDocLength;
    private int totalDocs;
    
    public double score(String term, int docId) {
        int termFreq = getTermFrequency(term, docId);
        int docLength = getDocLength(docId);
        int docFreq = getDocumentFrequency(term);
        
        // IDF component
        double idf = Math.log((totalDocs - docFreq + 0.5) / (docFreq + 0.5));
        
        // TF component with length normalization
        double lengthNorm = 1 - B + B * (docLength / avgDocLength);
        double tf = (termFreq * (K1 + 1)) / (termFreq + K1 * lengthNorm);
        
        return idf * tf;
    }
}
```

**BM25 Advantages:**
- Non-linear term frequency (diminishing returns)
- Document length normalization
- Better handles short vs long documents

### 3. Boolean Query Processing
```java
public List<Integer> booleanQuery(String query) {
    // Parse: "machine AND learning OR deep"
    QueryNode ast = parseQuery(query);
    return executeQuery(ast);
}

private List<Integer> executeQuery(QueryNode node) {
    if (node.getType() == NodeType.TERM) {
        return search(node.getTerm());
    }
    
    List<Integer> left = executeQuery(node.getLeft());
    List<Integer> right = executeQuery(node.getRight());
    
    switch (node.getOperator()) {
        case AND:
            return intersect(left, right);
        case OR:
            return union(left, right);
        case NOT:
            return difference(left, right);
        default:
            throw new IllegalArgumentException();
    }
}

private List<Integer> intersect(List<Integer> a, List<Integer> b) {
    Set<Integer> setA = new HashSet<>(a);
    return b.stream()
        .filter(setA::contains)
        .collect(Collectors.toList());
}
```

**Time Complexity:**
- AND: O(min(N, M))
- OR: O(N + M)
- NOT: O(N)

### 4. Phrase Search
```java
public List<Integer> phraseSearch(String phrase) {
    String[] terms = tokenize(phrase);
    
    if (terms.length == 0) {
        return Collections.emptyList();
    }
    
    // Get docs containing first term
    List<Integer> candidateDocs = search(terms[0]);
    List<Integer> results = new ArrayList<>();
    
    // Check if phrase appears in order
    for (int docId : candidateDocs) {
        if (containsPhrase(docId, terms)) {
            results.add(docId);
        }
    }
    
    return results;
}

private boolean containsPhrase(int docId, String[] terms) {
    // Get positions of first term
    List<Integer> positions = getTermPositions(docId, terms[0]);
    
    // Check if subsequent terms follow
    for (int pos : positions) {
        boolean found = true;
        
        for (int i = 1; i < terms.length; i++) {
            List<Integer> nextPositions = getTermPositions(docId, terms[i]);
            if (!nextPositions.contains(pos + i)) {
                found = false;
                break;
            }
        }
        
        if (found) {
            return true;
        }
    }
    
    return false;
}
```

### 5. Faceted Search
```java
public class FacetedSearch {
    public SearchResults searchWithFacets(String query, List<String> facetFields) {
        // Execute main search
        List<Integer> matchingDocs = search(query);
        
        // Calculate facets
        Map<String, Map<String, Integer>> facets = new HashMap<>();
        
        for (String field : facetFields) {
            Map<String, Integer> facetCounts = new HashMap<>();
            
            for (int docId : matchingDocs) {
                Document doc = getDocument(docId);
                String value = doc.getField(field);
                
                facetCounts.merge(value, 1, Integer::sum);
            }
            
            facets.put(field, facetCounts);
        }
        
        return new SearchResults(matchingDocs, facets);
    }
}
```

**Example:**
```
Query: "laptop"
Results: 100 documents

Facets:
  Brand:
    - Dell (30)
    - HP (25)
    - Lenovo (20)
    - Apple (15)
    - Asus (10)
  
  Price Range:
    - $0-500 (20)
    - $500-1000 (40)
    - $1000-1500 (25)
    - $1500+ (15)
  
  Rating:
    - 5 stars (35)
    - 4 stars (40)
    - 3 stars (20)
    - 2 stars (5)
```

## Design Patterns

### 1. Builder Pattern (Query)
```java
SearchQuery query = SearchQuery.builder()
    .query("machine learning")
    .filters(Map.of("category", "AI", "year", "2024"))
    .sortBy("relevance")
    .limit(10)
    .offset(0)
    .build();
```

### 2. Strategy Pattern (Scoring)
```java
interface ScoringStrategy {
    double score(String term, int docId);
}

class TFIDFScoring implements ScoringStrategy {
    public double score(String term, int docId) {
        // TF-IDF implementation
    }
}

class BM25Scoring implements ScoringStrategy {
    public double score(String term, int docId) {
        // BM25 implementation
    }
}
```

### 3. Chain of Responsibility (Query Processing)
```java
interface QueryProcessor {
    SearchResults process(SearchQuery query);
}

class TokenizationProcessor implements QueryProcessor {
    public SearchResults process(SearchQuery query) {
        query.setTokens(tokenize(query.getText()));
        return next.process(query);
    }
}

class SpellCheckProcessor implements QueryProcessor {
    public SearchResults process(SearchQuery query) {
        query.setText(spellCheck(query.getText()));
        return next.process(query);
    }
}
```

## Source Code

📄 **[View Complete Source Code](/problems/search/CODE)**

**Key Files:**
- [`SearchEngine.java`](/problems/search/CODE#searchenginejava) - Main implementation
- [`InvertedIndex.java`](/problems/search/CODE#invertedindexjava) - Index structure
- [`TFIDFScorer.java`](/problems/search/CODE#tfidfscorerjava) - Scoring algorithm
- [`QueryParser.java`](/problems/search/CODE#queryparserjava) - Query processing

**Total Lines of Code:** ~1000 lines

## Usage Example

```java
// Initialize search engine
SearchEngine engine = new SearchEngine();

// Index documents
engine.indexDocument(new Document(1, "Machine Learning Basics", 
    "Introduction to machine learning algorithms"));
engine.indexDocument(new Document(2, "Deep Learning Tutorial", 
    "Learn about neural networks and deep learning"));
engine.indexDocument(new Document(3, "Machine Learning in Python", 
    "Practical machine learning with Python"));

// Search
SearchResults results = engine.search("machine learning", 10);

for (SearchResult result : results) {
    System.out.println(result.getDocument().getTitle() + 
        " (score: " + result.getScore() + ")");
}

// Boolean query
results = engine.search("machine AND learning NOT deep");

// Phrase search
results = engine.search("\"machine learning\"");

// Faceted search
results = engine.searchWithFacets("laptop", List.of("brand", "price"));

// Get facets
Map<String, Map<String, Integer>> facets = results.getFacets();
System.out.println("Brands: " + facets.get("brand"));
```

## Common Interview Questions

### System Design Questions

1. **How do you build an inverted index efficiently?**
   - Batch processing (index in chunks)
   - Map-Reduce for distributed indexing
   - Incremental updates for real-time
   - Merge indices periodically

2. **How do you handle millions of documents?**
   - Shard index across multiple nodes
   - Distribute by document ID or term
   - Replicate for availability
   - Use SSD for fast disk access

3. **How do you make search fast?**
   - Inverted index (O(1) term lookup)
   - Skip lists for intersection
   - Early termination (WAND algorithm)
   - Cache hot queries

4. **How do you handle typos in queries?**
   - Edit distance (Levenshtein)
   - Phonetic matching (Soundex)
   - Fuzzy matching (n-grams)
   - Query expansion with synonyms

### Coding Questions

1. **Implement inverted index**
   ```java
   Map<String, List<Integer>> index = new HashMap<>();
   
   for (Document doc : documents) {
       for (String term : tokenize(doc.content)) {
           index.computeIfAbsent(term, k -> new ArrayList<>())
                .add(doc.id);
       }
   }
   ```

2. **Calculate TF-IDF score**
   ```java
   double tf = termFreq / docLength;
   double idf = Math.log(totalDocs / docsWithTerm);
   double tfidf = tf * idf;
   ```

3. **Merge two sorted posting lists (AND)**
   ```java
   List<Integer> intersect(List<Integer> a, List<Integer> b) {
       List<Integer> result = new ArrayList<>();
       int i = 0, j = 0;
       
       while (i < a.size() && j < b.size()) {
           if (a.get(i).equals(b.get(j))) {
               result.add(a.get(i));
               i++; j++;
           } else if (a.get(i) < b.get(j)) {
               i++;
           } else {
               j++;
           }
       }
       
       return result;
   }
   ```

### Algorithm Questions
1. **Time complexity of search?** → O(P + K log K) where P=postings, K=results
2. **Space complexity of index?** → O(N*M) where N=docs, M=unique terms
3. **How to optimize AND queries?** → Start with rarest term

## Trade-offs & Design Decisions

### 1. Indexing Speed vs Search Speed
**Fast Indexing:** Simple structure, slower search  
**Fast Search:** Complex index, slower indexing

**Decision:** Optimize for search (queries >> updates)

### 2. TF-IDF vs BM25
**TF-IDF:** Simple, linear term frequency  
**BM25:** Better, non-linear with length normalization

**Decision:** BM25 for production

### 3. In-Memory vs Disk-Based
**In-Memory:** Fast, limited scale  
**Disk-Based:** Scalable, slower

**Decision:** Hybrid (hot data in memory, rest on disk)

### 4. Real-Time vs Batch Indexing
**Real-Time:** Immediate, complex  
**Batch:** Delayed, efficient

**Decision:** Batch with near-real-time refresh (1-60s)

## Key Takeaways

### What Interviewers Look For
1. ✅ **Inverted index** implementation
2. ✅ **TF-IDF/BM25** scoring
3. ✅ **Boolean query** processing
4. ✅ **Scaling strategy** (sharding)
5. ✅ **Performance optimization**
6. ✅ **Trade-off discussions**

### Common Mistakes to Avoid
1. ❌ Linear scan through documents
2. ❌ Not normalizing text (case, stemming)
3. ❌ Ignoring document length in scoring
4. ❌ Not handling common words (stop words)
5. ❌ No caching for frequent queries
6. ❌ Poor tokenization strategy

### Production-Ready Checklist
- [x] Inverted index
- [x] TF-IDF/BM25 scoring
- [x] Boolean queries
- [x] Phrase search
- [ ] Distributed indexing
- [ ] Real-time updates
- [ ] Query caching
- [ ] Fuzzy matching
- [ ] Faceted search
- [ ] Analytics

---

## Related Problems
- 🔍 **Autocomplete** - Prefix search
- 📊 **Recommendation System** - Similarity scoring
- 📈 **Analytics** - Aggregations
- 🗂️ **Database Indexing** - B-tree, hash index

## References
- Information Retrieval: Manning, Raghavan, Schütze
- Lucene/Elasticsearch: Production search engines
- TF-IDF: Term weighting in IR
- BM25: Robertson & Zaragoza (2009)

---

*Production-ready search engine with inverted index, TF-IDF/BM25 scoring, and boolean queries. Essential for information retrieval and search system interviews.*
