package com.you.lld.problems.versioncontrol.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Immutable commit pointing to a tree hash in the object store (Git-like DAG node).
 */
public final class Commit {

    private final String id;
    private final String message;
    private final String author;
    private final LocalDateTime timestamp;
    private final List<String> parentIds;
    private final String treeHash;

    public Commit(String id, String message, String author,
                  List<String> parentIds, String treeHash) {
        this.id = id;
        this.message = message;
        this.author = author;
        this.timestamp = LocalDateTime.now();
        this.parentIds = Collections.unmodifiableList(new ArrayList<String>(parentIds));
        this.treeHash = treeHash;
    }

    public String getId() {
        return id;
    }

    public String getMessage() {
        return message;
    }

    public String getAuthor() {
        return author;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public List<String> getParentIds() {
        return parentIds;
    }

    public String getTreeHash() {
        return treeHash;
    }

    /**
     * Resolved file snapshot via object store (blob/tree indirection).
     */
    public Map<String, String> getFiles(com.you.lld.problems.versioncontrol.service.ObjectStore store) {
        return new HashMap<String, String>(store.resolveFiles(treeHash));
    }

    @Override
    public String toString() {
        String parents = parentIds.isEmpty() ? "" : " parent=" + parentIds;
        return id + " " + message + " (" + author + ")" + parents + " tree=" + treeHash.substring(0, 8);
    }
}
