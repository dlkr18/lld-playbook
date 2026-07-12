# Day 15: Search & Indexing 🔍

**Focus**: Implement search indexing strategies and understand E2EE considerations.

---

## 🎯 **Learning Objectives**

By the end of Day 15, you will:
- **Design** inverted index for text search
- **Implement** various indexing strategies
- **Understand** client-side vs server-side search
- **Handle** E2EE search challenges

---

## 📚 **Inverted Index**

### **Concept**
Map terms to documents containing them.

```
Document 1: "The quick brown fox"
Document 2: "The lazy brown dog"

Inverted Index:
  "the"   → [1, 2]
  "quick" → [1]
  "brown" → [1, 2]
  "fox"   → [1]
  "lazy"  → [2]
  "dog"   → [2]
```

### **Implementation**

```java
public class InvertedIndex<D> {
    
    private final Map<String, Set<D>> index;
    private final Analyzer analyzer;
    
    public InvertedIndex() {
        this.index = new ConcurrentHashMap<>();
        this.analyzer = new StandardAnalyzer();
    }
    
    public void add(D documentId, String content) {
        List<String> tokens = analyzer.analyze(content);
        
        for (String token : tokens) {
            index.computeIfAbsent(token, k -> ConcurrentHashMap.newKeySet())
                .add(documentId);
        }
    }
    
    public void remove(D documentId, String content) {
        List<String> tokens = analyzer.analyze(content);
        
        for (String token : tokens) {
            Set<D> docs = index.get(token);
            if (docs != null) {
                docs.remove(documentId);
                if (docs.isEmpty()) {
                    index.remove(token);
                }
            }
        }
    }
    
    public Set<D> search(String query) {
        List<String> queryTokens = analyzer.analyze(query);
        
        if (queryTokens.isEmpty()) {
            return Collections.emptySet();
        }
        
        // AND semantics - document must contain all terms
        Set<D> result = null;
        for (String token : queryTokens) {
            Set<D> docs = index.getOrDefault(token, Collections.emptySet());
            if (result == null) {
                result = new HashSet<>(docs);
            } else {
                result.retainAll(docs);
            }
        }
        
        return result != null ? result : Collections.emptySet();
    }
    
    public Set<D> searchAny(String query) {
        List<String> queryTokens = analyzer.analyze(query);
        
        // OR semantics - document contains any term
        Set<D> result = new HashSet<>();
        for (String token : queryTokens) {
            result.addAll(index.getOrDefault(token, Collections.emptySet()));
        }
        
        return result;
    }
}
```

---

## 📝 **Text Analyzer**

```java
public interface Analyzer {
    List<String> analyze(String text);
}

public class StandardAnalyzer implements Analyzer {
    
    private final List<TokenFilter> filters;
    
    public StandardAnalyzer() {
        this.filters = Arrays.asList(
            new LowercaseFilter(),
            new StopWordFilter(),
            new StemmingFilter()
        );
    }
    
    @Override
    public List<String> analyze(String text) {
        if (text == null || text.isEmpty()) {
            return Collections.emptyList();
        }
        
        // Tokenize
        List<String> tokens = tokenize(text);
        
        // Apply filters
        for (TokenFilter filter : filters) {
            tokens = filter.filter(tokens);
        }
        
        return tokens;
    }
    
    private List<String> tokenize(String text) {
        // Split on non-alphanumeric characters
        return Arrays.stream(text.split("[^a-zA-Z0-9]+"))
            .filter(s -> !s.isEmpty())
            .collect(Collectors.toList());
    }
}

public class LowercaseFilter implements TokenFilter {
    @Override
    public List<String> filter(List<String> tokens) {
        return tokens.stream()
            .map(String::toLowerCase)
            .collect(Collectors.toList());
    }
}

public class StopWordFilter implements TokenFilter {
    private static final Set<String> STOP_WORDS = Set.of(
        "a", "an", "the", "is", "are", "was", "were", 
        "in", "on", "at", "to", "for", "of", "and", "or"
    );
    
    @Override
    public List<String> filter(List<String> tokens) {
        return tokens.stream()
            .filter(t -> !STOP_WORDS.contains(t))
            .collect(Collectors.toList());
    }
}

public class StemmingFilter implements TokenFilter {
    @Override
    public List<String> filter(List<String> tokens) {
        return tokens.stream()
            .map(this::stem)
            .collect(Collectors.toList());
    }
    
    private String stem(String word) {
        // Simple suffix stripping (Porter Stemmer is more sophisticated)
        if (word.endsWith("ing")) {
            return word.substring(0, word.length() - 3);
        }
        if (word.endsWith("ed")) {
            return word.substring(0, word.length() - 2);
        }
        if (word.endsWith("s") && word.length() > 3) {
            return word.substring(0, word.length() - 1);
        }
        return word;
    }
}
```

---

## 📊 **TF-IDF Ranking**

```java
public class TFIDFRanker<D> {
    
    private final Map<D, Map<String, Integer>> documentTermFreqs;
    private final Map<String, Integer> documentFreqs;
    private int totalDocuments;
    
    public TFIDFRanker() {
        this.documentTermFreqs = new HashMap<>();
        this.documentFreqs = new HashMap<>();
        this.totalDocuments = 0;
    }
    
    public void addDocument(D docId, List<String> terms) {
        Map<String, Integer> termFreqs = new HashMap<>();
        Set<String> uniqueTerms = new HashSet<>();
        
        for (String term : terms) {
            termFreqs.merge(term, 1, Integer::sum);
            uniqueTerms.add(term);
        }
        
        documentTermFreqs.put(docId, termFreqs);
        
        for (String term : uniqueTerms) {
            documentFreqs.merge(term, 1, Integer::sum);
        }
        
        totalDocuments++;
    }
    
    public List<ScoredDocument<D>> search(List<String> queryTerms, Set<D> candidates) {
        List<ScoredDocument<D>> results = new ArrayList<>();
        
        for (D docId : candidates) {
            double score = calculateScore(docId, queryTerms);
            if (score > 0) {
                results.add(new ScoredDocument<>(docId, score));
            }
        }
        
        // Sort by score descending
        results.sort(Comparator.comparingDouble(ScoredDocument::getScore).reversed());
        
        return results;
    }
    
    private double calculateScore(D docId, List<String> queryTerms) {
        Map<String, Integer> docTermFreqs = documentTermFreqs.get(docId);
        if (docTermFreqs == null) {
            return 0;
        }
        
        double score = 0;
        
        for (String term : queryTerms) {
            int tf = docTermFreqs.getOrDefault(term, 0);
            if (tf > 0) {
                int df = documentFreqs.getOrDefault(term, 0);
                double idf = Math.log((double) totalDocuments / (df + 1)) + 1;
                score += tf * idf;
            }
        }
        
        return score;
    }
    
    public static class ScoredDocument<D> {
        private final D documentId;
        private final double score;
        
        public ScoredDocument(D documentId, double score) {
            this.documentId = documentId;
            this.score = score;
        }
        
        public D getDocumentId() { return documentId; }
        public double getScore() { return score; }
    }
}
```

---

## 🔐 **E2EE Search Considerations**

### **Challenge**
In E2E encrypted systems, server cannot read content to index it.

### **Approaches**

#### **1. Client-Side Search**
```java
public class ClientSideSearch {
    
    private final InvertedIndex<MessageId> localIndex;
    private final EncryptionService encryption;
    
    public void indexMessage(Message message) {
        // Decrypt locally
        String plaintext = encryption.decrypt(message.getEncryptedContent());
        
        // Index locally
        localIndex.add(message.getId(), plaintext);
    }
    
    public List<Message> search(String query) {
        // Search local index
        Set<MessageId> matches = localIndex.search(query);
        
        // Load matching messages
        return matches.stream()
            .map(messageRepository::findById)
            .collect(Collectors.toList());
    }
}
```

**Pros**: Full privacy, rich search
**Cons**: Requires all data locally, sync challenges

#### **2. Searchable Encryption**
```java
public class SearchableEncryption {
    
    private final byte[] key;
    
    public String encryptForSearch(String plaintext) {
        // Create deterministic encrypted token
        // Same plaintext always produces same ciphertext (for search)
        return hmac(key, plaintext.toLowerCase());
    }
    
    public void indexEncrypted(Document doc, String content) {
        List<String> tokens = analyzer.analyze(content);
        
        List<String> encryptedTokens = tokens.stream()
            .map(this::encryptForSearch)
            .collect(Collectors.toList());
        
        // Server stores encrypted tokens
        serverIndex.add(doc.getId(), encryptedTokens);
    }
    
    public List<Document> search(String query) {
        List<String> queryTokens = analyzer.analyze(query);
        
        List<String> encryptedQuery = queryTokens.stream()
            .map(this::encryptForSearch)
            .collect(Collectors.toList());
        
        // Search on encrypted tokens
        return serverIndex.search(encryptedQuery);
    }
}
```

**Trade-off**: Leaks search patterns, limited query types

#### **3. Metadata Search**
```java
public class MetadataSearch {
    
    // Index only unencrypted metadata
    public void index(Message message) {
        serverIndex.add(message.getId(), new MessageMetadata(
            message.getSenderId(),
            message.getTimestamp(),
            message.getConversationId(),
            message.getAttachmentCount()
        ));
    }
    
    public List<Message> searchByMetadata(MetadataQuery query) {
        return serverIndex.search(query);
    }
}
```

**Best for**: Date range, sender, conversation filters

---

## 🏗️ **Search Service**

```java
public interface SearchService<D> {
    
    void index(D documentId, String content);
    
    void update(D documentId, String oldContent, String newContent);
    
    void remove(D documentId, String content);
    
    SearchResults<D> search(SearchQuery query);
}

public class SearchQuery {
    private final String text;
    private final int limit;
    private final int offset;
    private final List<Filter> filters;
    private final SortOrder sortOrder;
    
    public static Builder builder() {
        return new Builder();
    }
}

public class SearchResults<D> {
    private final List<SearchResult<D>> results;
    private final int totalCount;
    private final long searchTimeMs;
    
    public static class SearchResult<D> {
        private final D documentId;
        private final double score;
        private final Map<String, List<String>> highlights;
    }
}
```

---

## 🎯 **Best Practices**

1. **Normalize text**: Consistent tokenization and stemming
2. **Handle typos**: Fuzzy matching, n-grams
3. **Pagination**: Don't return all results at once
4. **Caching**: Cache frequent queries
5. **Monitoring**: Track query latencies and popular terms

---

**Next**: [Weekend - BookMyShow](week3/weekend/README.md) →
