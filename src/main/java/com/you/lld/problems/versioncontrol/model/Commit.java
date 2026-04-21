package com.you.lld.problems.versioncontrol.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Immutable snapshot of the repository at a point in time.
 *
 * Mirrors Git's commit object:
 *   - id        : unique identifier (short hash for readability)
 *   - parentIds : usually 1; merge commits have 2
 *   - files     : FULL snapshot of all files (not a delta)
 *
 * Storing full snapshots is simpler than deltas and is what Git actually
 * does internally (each commit points to a tree with the full state).
 */
public final class Commit {

    private final String id;
    private final String message;
    private final String author;
    private final LocalDateTime timestamp;
    private final List<String> parentIds;
    private final Map<String, String> files;

    public Commit(String id, String message, String author,
                  List<String> parentIds, Map<String, String> files) {
        this.id = id;
        this.message = message;
        this.author = author;
        this.timestamp = LocalDateTime.now();
        this.parentIds = Collections.unmodifiableList(new ArrayList<>(parentIds));
        this.files = Collections.unmodifiableMap(new HashMap<>(files));
    }

    public String getId()                { return id; }
    public String getMessage()           { return message; }
    public String getAuthor()            { return author; }
    public LocalDateTime getTimestamp()   { return timestamp; }
    public List<String> getParentIds()   { return parentIds; }
    public Map<String, String> getFiles(){ return files; }

    @Override
    public String toString() {
        String parents = parentIds.isEmpty() ? "" : " parent=" + parentIds;
        return id + " " + message + " (" + author + ")" + parents;
    }
}
