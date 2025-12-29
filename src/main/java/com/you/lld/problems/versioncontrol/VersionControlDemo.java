package com.you.lld.problems.versioncontrol;

import com.you.lld.problems.versioncontrol.api.VersionControl;
import com.you.lld.problems.versioncontrol.impl.VersionControlImpl;
import com.you.lld.problems.versioncontrol.model.Commit;
import java.util.List;

/**
 * Comprehensive demo of Version Control System.
 * Demonstrates Git-like operations: repository, commits, branches, history.
 */
public class VersionControlDemo {
    
    private static final String SEPARATOR = "============================================================";
    private static final String LINE = "------------------------------------------------------------";
    
    public static void main(String[] args) {
        System.out.println("╔════════════════════════════════════════════════════════════╗");
        System.out.println("║       Version Control System (Git-like) Demo              ║");
        System.out.println("╚════════════════════════════════════════════════════════════╝\n");
        
        // Use interface for loose coupling
        VersionControl vcs = new VersionControlImpl();
        
        demonstrateBasicWorkflow(vcs);
        System.out.println("\n" + SEPARATOR + "\n");
        
        demonstrateFeatureBranches(vcs);
        System.out.println("\n" + SEPARATOR + "\n");
        
        demonstrateMultipleRepos(vcs);
        
        System.out.println("\n╔════════════════════════════════════════════════════════════╗");
        System.out.println("║                    ✅ Demo Complete!                      ║");
        System.out.println("╚════════════════════════════════════════════════════════════╝");
    }
    
    private static void demonstrateBasicWorkflow(VersionControl vcs) {
        System.out.println("📁 Scenario 1: Basic Git Workflow");
        System.out.println(LINE);
        
        vcs.createRepository("my-app");
        System.out.println();
        
        String c1 = vcs.commit("my-app", "Initial commit", "Alice");
        String c2 = vcs.commit("my-app", "Add README", "Alice");
        String c3 = vcs.commit("my-app", "Implement auth", "Bob");
        
        System.out.println("📜 Commit History:");
        List<Commit> history = vcs.getHistory("my-app");
        for (int i = 0; i < Math.min(3, history.size()); i++) {
            Commit c = history.get(i);
            System.out.println("   • " + c.getId().substring(0, 7) + 
                             " - " + c.getMessage());
        }
    }
    
    private static void demonstrateFeatureBranches(VersionControl vcs) {
        System.out.println("🌿 Scenario 2: Feature Branch Development");
        System.out.println(LINE);
        
        vcs.createRepository("web-app");
        System.out.println();
        
        String c1 = vcs.commit("web-app", "Initial commit", "Alice");
        String c2 = vcs.commit("web-app", "Setup server", "Alice");
        
        System.out.println("   [main] Created 2 commits");
        System.out.println();
        
        vcs.createBranch("web-app", "feature-payment");
        vcs.switchBranch("web-app", "feature-payment");
        
        vcs.commit("web-app", "Add Stripe", "Bob");
        vcs.commit("web-app", "Add webhooks", "Bob");
        System.out.println("   [feature-payment] Created 2 commits");
        
        System.out.println("\n   Total commits: " + 
                         vcs.getHistory("web-app").size());
    }
    
    private static void demonstrateMultipleRepos(VersionControl vcs) {
        System.out.println("📦 Scenario 3: Multiple Repositories");
        System.out.println(LINE);
        
        vcs.createRepository("frontend");
        vcs.createRepository("backend");
        vcs.createRepository("mobile");
        System.out.println();
        
        vcs.commit("frontend", "Setup React", "Alice");
        vcs.commit("frontend", "Add routing", "Alice");
        
        vcs.commit("backend", "Setup Node.js", "Bob");
        vcs.commit("backend", "Add API", "Bob");
        vcs.commit("backend", "Add DB", "Bob");
        
        vcs.commit("mobile", "Setup React Native", "Carol");
        
        System.out.println("📊 Summary:");
        System.out.println("   Frontend: " + 
                         vcs.getHistory("frontend").size() + " commits");
        System.out.println("   Backend: " + 
                         vcs.getHistory("backend").size() + " commits");
        System.out.println("   Mobile: " + 
                         vcs.getHistory("mobile").size() + " commits");
    }
}
