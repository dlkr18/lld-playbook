package com.you.lld.problems.versioncontrol.service.impl;

import com.you.lld.problems.versioncontrol.model.Commit;
import com.you.lld.problems.versioncontrol.service.CommitStore;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

/** HashMap-backed commit store. */
public final class InMemoryCommitStore implements CommitStore {

    private final Map<String, Commit> commits = new HashMap<>();

    @Override
    public void save(Commit commit) {
        commits.put(commit.getId(), commit);
    }

    @Override
    public Commit get(String commitId) {
        Commit c = commits.get(commitId);
        if (c == null) throw new IllegalArgumentException("unknown commit: " + commitId);
        return c;
    }

    @Override
    public boolean contains(String commitId) {
        return commits.containsKey(commitId);
    }

    @Override
    public List<Commit> log(String fromCommitId) {
        List<Commit> history = new ArrayList<>();
        Commit cur = commits.get(fromCommitId);
        while (cur != null) {
            history.add(cur);
            List<String> parents = cur.getParentIds();
            cur = parents.isEmpty() ? null : commits.get(parents.get(0));
        }
        return history;
    }

    @Override
    public boolean isAncestor(String ancestorId, String descendantId) {
        Set<String> visited = new HashSet<>();
        List<String> stack = new ArrayList<>();
        stack.add(descendantId);

        while (!stack.isEmpty()) {
            String id = stack.remove(stack.size() - 1);
            if (id.equals(ancestorId)) return true;
            if (!visited.add(id)) continue;
            Commit c = commits.get(id);
            if (c != null) stack.addAll(c.getParentIds());
        }
        return false;
    }
}
