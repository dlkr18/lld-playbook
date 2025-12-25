# Simple Search Engine

## Problem: Design a Simple Search Engine with Inverted Index

**Difficulty**: Medium  
**Pattern**: Inverted Index, Trie  
**Time**: 45-60 min

---

## Key Classes

```java
class SearchEngine {
    private Map<String, PostingList> invertedIndex;
    private Map<String, Document> documents;
    
    void indexDocument(Document doc);
    List<SearchResult> search(String query);
    List<SearchResult> searchPhrase(String phrase);
}

class PostingList {
    String term;
    List<Posting> postings;
}

class Posting {
    String documentId;
    int frequency;
    List<Integer> positions;
}
```

---

**Status**: ✅ Documented
