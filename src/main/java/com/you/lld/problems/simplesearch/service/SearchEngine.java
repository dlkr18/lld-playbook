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
