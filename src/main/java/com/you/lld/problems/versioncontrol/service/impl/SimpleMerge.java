package com.you.lld.problems.versioncontrol.service.impl;

import com.you.lld.problems.versioncontrol.model.Commit;
import com.you.lld.problems.versioncontrol.service.CommitStore;
import com.you.lld.problems.versioncontrol.service.MergeStrategy;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Default merge strategy: fast-forward when possible, otherwise
 * create a merge commit with conflict detection.
 *
 * Fast-forward: our HEAD is an ancestor of theirs → just return their commit
 *               (caller advances the branch pointer).
 *
 * Merge commit: combine both file snapshots. If the same file was changed
 *               differently in both branches → conflict (throw with paths).
 */
public final class SimpleMerge implements MergeStrategy {

    private int mergeCounter;

    @Override
    public Commit merge(Commit ourHead, Commit theirHead, CommitStore store) {
        String ourId = ourHead.getId();
        String theirId = theirHead.getId();

        if (ourId.equals(theirId)) {
            throw new IllegalStateException("already up to date");
        }

        // Fast-forward
        if (store.isAncestor(ourId, theirId)) {
            return theirHead;
        }

        // Merge commit
        Map<String, String> ourFiles = ourHead.getFiles();
        Map<String, String> theirFiles = theirHead.getFiles();
        Map<String, String> merged = new HashMap<>(ourFiles);

        List<String> conflicts = new ArrayList<>();
        for (Map.Entry<String, String> e : theirFiles.entrySet()) {
            String path = e.getKey();
            String theirContent = e.getValue();
            if (ourFiles.containsKey(path) && !ourFiles.get(path).equals(theirContent)) {
                conflicts.add(path);
            } else {
                merged.put(path, theirContent);
            }
        }

        if (!conflicts.isEmpty()) {
            throw new IllegalStateException("merge conflict in: " + conflicts);
        }

        List<String> parents = new ArrayList<>();
        parents.add(ourId);
        parents.add(theirId);

        return new Commit(nextMergeId(), "merge", "system", parents, merged);
    }

    private String nextMergeId() {
        return String.format("m%03d", ++mergeCounter);
    }
}
