package com.you.lld.problems.versioncontrol.service;

import com.you.lld.problems.versioncontrol.model.Commit;

import java.util.List;
import java.util.Map;

/**
 * Object store for commits.
 *
 * SRP: only responsible for storing and retrieving commits.
 * DIP: Repository depends on this interface, not on a concrete HashMap.
 */
public interface CommitStore {

    void save(Commit commit);

    Commit get(String commitId);

    boolean contains(String commitId);

    /** Walk first-parent chain from the given commit back to root. */
    List<Commit> log(String fromCommitId);

    /** Check if ancestorId is reachable from descendantId by walking parents. */
    boolean isAncestor(String ancestorId, String descendantId);
}
