package com.you.lld.problems.versioncontrol.model;

/**
 * A branch is just a named, movable pointer to a commit.
 *
 * This is Git's core insight: branches are cheap because they're
 * just a 40-byte pointer, not a copy of the codebase.
 */
public final class Branch {

    private final String name;
    private String commitId;

    public Branch(String name, String commitId) {
        this.name = name;
        this.commitId = commitId;
    }

    public String getName()     { return name; }
    public String getCommitId() { return commitId; }

    public void advanceTo(String commitId) { this.commitId = commitId; }

    @Override
    public String toString() { return name + " → " + commitId; }
}
