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

