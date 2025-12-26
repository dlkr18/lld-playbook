package com.you.lld.problems.versioncontrol;

import com.you.lld.problems.versioncontrol.impl.VersionControlImpl;

public class VersionControlDemo {
    public static void main(String[] args) {
        System.out.println("📚 Version Control System Demo");
        System.out.println("==================================================================");
        System.out.println();
        
        VersionControlImpl vcs = new VersionControlImpl();
        
        vcs.createRepository("my-project");
        
        System.out.println();
        vcs.commit("my-project", "Initial commit", "Alice");
        vcs.commit("my-project", "Add feature", "Bob");
        
        System.out.println();
        vcs.createBranch("my-project", "feature-branch");
        vcs.switchBranch("my-project", "feature-branch");
        vcs.commit("my-project", "Work on feature", "Alice");
        
        System.out.println();
        System.out.println("Commit history:");
        vcs.getHistory("my-project").forEach(System.out::println);
        
        System.out.println("\n✅ Demo complete!");
    }
}
