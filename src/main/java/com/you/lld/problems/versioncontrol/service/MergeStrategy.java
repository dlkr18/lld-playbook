package com.you.lld.problems.versioncontrol.service;

import com.you.lld.problems.versioncontrol.model.Commit;

import java.util.Map;

/**
 * Strategy for merging two branches.
 *
 * Implementations decide HOW to combine divergent histories:
 *   - SimpleMerge: fast-forward if possible, otherwise merge commit with conflict detection
 *   - (future) RebaseMerge: replay commits on top of target
 *   - (future) SquashMerge: collapse all source commits into one
 *
 * OCP: adding a new merge strategy = new class, no changes to Repository.
 */
public interface MergeStrategy {

    /**
     * Merge source commit into the current branch.
     *
     * @param ourHead    current branch's HEAD commit
     * @param theirHead  source branch's HEAD commit
     * @param commitStore read access to all commits (for ancestor checks)
     * @return the resulting commit (either theirHead for fast-forward, or a new merge commit)
     * @throws IllegalStateException if there are conflicts
     */
    Commit merge(Commit ourHead, Commit theirHead, CommitStore commitStore);
}
