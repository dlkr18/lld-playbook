package com.you.lld.problems.versioncontrol;

import com.you.lld.problems.versioncontrol.model.Commit;
import com.you.lld.problems.versioncontrol.model.Diff;

/**
 * Interview walkthrough — one scenario per design point.
 *
 *  1. Basic flow       — addFile → commit → log (parent chain walk)
 *  2. Branching        — create branch, diverge, checkout restores working dir
 *  3. Fast-forward     — merge when main hasn't moved since branch point
 *  4. Diff + status    — compare commits, working dir vs HEAD
 *  5. Merge conflict   — same file changed differently in two branches
 */
public class VersionControlDemo {

    public static void main(String[] args) {
        Repository repo = new Repository("my-project");

        basicFlow(repo);
        branching(repo);
        fastForwardMerge(repo);
        diffAndStatus(repo);
        mergeConflict();

        System.out.println("\n=== done ===");
    }

    private static void basicFlow(Repository repo) {
        System.out.println("\n── 1. Basic flow: addFile → commit → log ──");
        repo.addFile("README.md", "# My Project");
        Commit c1 = repo.commit("add readme", "alice");
        System.out.println("  committed: " + c1);

        repo.addFile("src/Main.java", "public class Main {}");
        Commit c2 = repo.commit("add main class", "alice");
        System.out.println("  committed: " + c2);

        System.out.println("  log:");
        for (Commit c : repo.log()) System.out.println("    " + c);
    }

    private static void branching(Repository repo) {
        System.out.println("\n── 2. Branching — branch = pointer to a commit ──");
        repo.createBranch("feature");
        repo.checkout("feature");
        System.out.println("  on branch: " + repo.getCurrentBranch());

        repo.addFile("feature.txt", "new feature");
        Commit c3 = repo.commit("add feature", "bob");
        System.out.println("  committed on feature: " + c3);

        repo.checkout("main");
        System.out.println("  back on main, files: " + repo.getWorkingDirectory().keySet());
        System.out.println("  feature.txt is gone — it only exists on the feature branch");
    }

    private static void fastForwardMerge(Repository repo) {
        System.out.println("\n── 3. Fast-forward merge ──");
        System.out.println("  main HEAD: " + repo.head().getId() + "  feature HEAD: " + repo.getBranches().get("feature"));
        System.out.println("  main hasn't moved since branch point → fast-forward");

        Commit merged = repo.merge("feature");
        System.out.println("  after merge, main HEAD: " + repo.head().getId());
        System.out.println("  files: " + repo.getWorkingDirectory().keySet());
    }

    private static void diffAndStatus(Repository repo) {
        System.out.println("\n── 4. Diff + status ──");

        Diff d = repo.diff("c001", repo.head().getId());
        System.out.println("  diff(initial → HEAD):");
        System.out.println("  " + d);

        repo.addFile("notes.txt", "some notes");
        System.out.println("  status (uncommitted):");
        System.out.println("  " + repo.status());
        repo.commit("add notes", "alice");
    }

    private static void mergeConflict() {
        System.out.println("\n── 5. Merge conflict ──");
        Repository repo = new Repository("conflict-demo");

        repo.addFile("shared.txt", "original content");
        repo.commit("add shared file", "alice");

        repo.createBranch("branch-a");
        repo.checkout("branch-a");
        repo.addFile("shared.txt", "alice's version");
        repo.commit("alice edits shared", "alice");

        repo.checkout("main");
        repo.addFile("shared.txt", "bob's version");
        repo.commit("bob edits shared", "bob");

        try {
            repo.merge("branch-a");
        } catch (IllegalStateException e) {
            System.out.println("  " + e.getMessage());
        }
    }
}
