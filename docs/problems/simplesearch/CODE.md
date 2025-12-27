# simplesearch - Complete Implementation

## 📁 Project Structure (10 files)

```
simplesearch/
├── Document.java
├── InvertedIndex.java
├── SearchEngine.java
├── exceptions/DocumentNotFoundException.java
├── exceptions/IndexingException.java
├── model/Document.java
├── model/Index.java
├── model/Query.java
├── model/Ranking.java
├── model/SearchResult.java
```

## 📝 Source Code

### 📄 `Document.java`

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

### 📄 `InvertedIndex.java`

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

### 📄 `SearchEngine.java`

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

### 📄 `exceptions/DocumentNotFoundException.java`

```java
package com.you.lld.problems.simplesearch.exceptions;
public class DocumentNotFoundException extends RuntimeException { public DocumentNotFoundException(String m) { super(m); } }```

### 📄 `exceptions/IndexingException.java`

```java
package com.you.lld.problems.simplesearch.exceptions;
public class IndexingException extends RuntimeException { public IndexingException(String m) { super(m); } }```

### 📄 `model/Document.java`

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

### 📄 `model/Index.java`

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

### 📄 `model/Query.java`

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

### 📄 `model/Ranking.java`

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

### 📄 `model/SearchResult.java`

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

