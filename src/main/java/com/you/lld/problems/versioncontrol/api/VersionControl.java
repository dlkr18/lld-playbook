package com.you.lld.problems.versioncontrol.api;

import com.you.lld.problems.versioncontrol.model.*;
import java.util.List;

public interface VersionControl {
    void createRepository(String name);
    String commit(String repoName, String message, String author);
    void createBranch(String repoName, String branchName);
    void switchBranch(String repoName, String branchName);
    List<Commit> getHistory(String repoName);
    Commit getCommit(String repoName, String commitId);
}
