package com.you.lld.problems.versioncontrol.service;

import com.you.lld.problems.versioncontrol.model.Commit;
import java.util.ArrayDeque;
import java.util.HashSet;
import java.util.Queue;
import java.util.Set;

/**
 * Finds lowest common ancestor (merge base) on the commit DAG.
 */
public final class MergeBaseFinder {

    private MergeBaseFinder() {
    }

    public static String findMergeBase(CommitStore store, String commitA, String commitB) {
        Set<String> ancestorsOfA = collectAncestors(store, commitA);
        Queue<String> queue = new ArrayDeque<String>();
        Set<String> visited = new HashSet<String>();
        queue.add(commitB);
        while (!queue.isEmpty()) {
            String id = queue.remove();
            if (ancestorsOfA.contains(id)) {
                return id;
            }
            if (!visited.add(id)) {
                continue;
            }
            Commit commit = store.get(id);
            for (String parent : commit.getParentIds()) {
                queue.add(parent);
            }
        }
        return null;
    }

    private static Set<String> collectAncestors(CommitStore store, String startId) {
        Set<String> ancestors = new HashSet<String>();
        Queue<String> queue = new ArrayDeque<String>();
        queue.add(startId);
        while (!queue.isEmpty()) {
            String id = queue.remove();
            if (!ancestors.add(id)) {
                continue;
            }
            for (String parent : store.get(id).getParentIds()) {
                queue.add(parent);
            }
        }
        return ancestors;
    }
}
