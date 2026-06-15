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
