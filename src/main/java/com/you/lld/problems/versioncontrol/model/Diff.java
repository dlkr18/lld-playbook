package com.you.lld.problems.versioncontrol.model;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

/**
 * Difference between two file snapshots.
 * <p>
 * Computed by comparing the file maps of two commits. Each entry
 * describes one file that was added, modified, or deleted.
 */
public final class Diff {

    public enum ChangeType {ADD, MODIFY, DELETE}

    public static final class Change {
        private final String path;
        private final ChangeType type;

        public Change(String path, ChangeType type) {
            this.path = path;
            this.type = type;
        }

        public String getPath() {
            return path;
        }

        public ChangeType getType() {
            return type;
        }

        @Override
        public String toString() {
            return type + " " + path;
        }
    }

    private final List<Change> changes;

    private Diff(List<Change> changes) {
        this.changes = Collections.unmodifiableList(changes);
    }

    public List<Change> getChanges() {
        return changes;
    }

    public boolean isEmpty() {
        return changes.isEmpty();
    }

    /**
     * Compare two file snapshots and produce a Diff.
     */
    public static Diff between(Map<String, String> from, Map<String, String> to) {
        List<Change> changes = new ArrayList<>();

        for (Map.Entry<String, String> e : to.entrySet()) {
            String path = e.getKey();
            if (!from.containsKey(path)) {
                changes.add(new Change(path, ChangeType.ADD));
            } else if (!from.get(path).equals(e.getValue())) {
                changes.add(new Change(path, ChangeType.MODIFY));
            }
        }

        for (String path : from.keySet()) {
            if (!to.containsKey(path)) {
                changes.add(new Change(path, ChangeType.DELETE));
            }
        }

        return new Diff(changes);
    }

    @Override
    public String toString() {
        if (changes.isEmpty()) return "(no changes)";
        StringBuilder sb = new StringBuilder();
        for (Change c : changes) {
            sb.append("  ").append(c).append("\n");
        }
        return sb.toString().trim();
    }
}
