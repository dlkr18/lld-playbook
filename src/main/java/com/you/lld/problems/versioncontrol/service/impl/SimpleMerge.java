package com.you.lld.problems.versioncontrol.service.impl;

import com.you.lld.problems.versioncontrol.model.Commit;
import com.you.lld.problems.versioncontrol.service.CommitStore;
import com.you.lld.problems.versioncontrol.service.MergeBaseFinder;
import com.you.lld.problems.versioncontrol.service.MergeStrategy;
import com.you.lld.problems.versioncontrol.service.ObjectStore;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Fast-forward when possible; otherwise 3-way merge using merge-base (LCA).
 */
public final class SimpleMerge implements MergeStrategy {

    private int mergeCounter;

    @Override
    public Commit merge(Commit ourHead, Commit theirHead, CommitStore store, ObjectStore objectStore) {
        String ourId = ourHead.getId();
        String theirId = theirHead.getId();

        if (ourId.equals(theirId)) {
            throw new IllegalStateException("already up to date");
        }

        if (store.isAncestor(ourId, theirId)) {
            return theirHead;
        }

        String baseId = MergeBaseFinder.findMergeBase(store, ourId, theirId);
        Map<String, String> baseFiles = baseId == null
                ? new HashMap<String, String>()
                : store.get(baseId).getFiles(objectStore);
        Map<String, String> ourFiles = ourHead.getFiles(objectStore);
        Map<String, String> theirFiles = theirHead.getFiles(objectStore);

        Set<String> allPaths = new HashSet<String>();
        allPaths.addAll(baseFiles.keySet());
        allPaths.addAll(ourFiles.keySet());
        allPaths.addAll(theirFiles.keySet());

        Map<String, String> merged = new HashMap<String, String>();
        List<String> conflicts = new ArrayList<String>();

        for (String path : allPaths) {
            String base = baseFiles.get(path);
            String ours = ourFiles.get(path);
            String theirs = theirFiles.get(path);

            if (equals(ours, theirs)) {
                if (ours != null) {
                    merged.put(path, ours);
                }
            } else if (equals(ours, base)) {
                if (theirs != null) {
                    merged.put(path, theirs);
                }
            } else if (equals(theirs, base)) {
                if (ours != null) {
                    merged.put(path, ours);
                }
            } else {
                conflicts.add(path);
            }
        }

        if (!conflicts.isEmpty()) {
            throw new IllegalStateException("merge conflict in: " + conflicts);
        }

        List<String> parents = new ArrayList<String>();
        parents.add(ourId);
        parents.add(theirId);
        String treeHash = objectStore.storeTree(merged);
        return new Commit(nextMergeId(), "merge", "system", parents, treeHash);
    }

    private boolean equals(String a, String b) {
        if (a == null && b == null) {
            return true;
        }
        if (a == null || b == null) {
            return false;
        }
        return a.equals(b);
    }

    private String nextMergeId() {
        return String.format("m%03d", ++mergeCounter);
    }
}
