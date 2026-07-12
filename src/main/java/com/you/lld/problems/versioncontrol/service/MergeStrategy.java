package com.you.lld.problems.versioncontrol.service;

import com.you.lld.problems.versioncontrol.model.Commit;

public interface MergeStrategy {

    Commit merge(Commit ourHead, Commit theirHead, CommitStore store, ObjectStore objectStore);
}
