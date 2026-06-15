package com.you.lld.problems.versioncontrol;

import com.you.lld.problems.versioncontrol.service.impl.InMemoryBranchManager;
import com.you.lld.problems.versioncontrol.service.impl.InMemoryCommitStore;
import com.you.lld.problems.versioncontrol.service.impl.SimpleMerge;
import com.you.lld.problems.versioncontrol.service.ObjectStore;

public final class VersionControl {

    private final Repository repository;

    public VersionControl(String name) {
        this.repository = new Repository(
                name,
                new ObjectStore(),
                new InMemoryCommitStore(),
                new InMemoryBranchManager(),
                new SimpleMerge());
    }

    public Repository getRepository() {
        return repository;
    }
}
