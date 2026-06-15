package com.you.lld.problems.linkedin;

import com.you.lld.problems.linkedin.model.Experience;
import com.you.lld.problems.linkedin.model.JobType;
import com.you.lld.problems.linkedin.model.PostType;
import com.you.lld.problems.linkedin.model.PostVisibility;
import com.you.lld.problems.linkedin.model.Skill;
import com.you.lld.problems.linkedin.model.User;

/**
 * SDE3 demo: profiles, connections, feed, jobs.
 */
public class LinkedInDemo {

    public static void main(String[] args) {
        System.out.println("=== LinkedIn (SDE3) ===\n");
        LinkedIn linkedin = new LinkedIn();

        // 1. Registration + profile
        System.out.println("--- 1. Profiles ---");
        User alice = linkedin.registerUser("Alice Johnson", "alice@example.com");
        alice.setHeadline("SWE at Google");
        alice.addExperience(new Experience("Senior SWE", "Google"));
        alice.addSkill(new Skill("Java"));
        linkedin.updateProfile(alice.getUserId(), alice);
        User bob = linkedin.registerUser("Bob Smith", "bob@example.com");
        System.out.println(alice.getName() + ": " + alice.getHeadline());

        // 2. Connection flow
        System.out.println("\n--- 2. Connections ---");
        String reqId = linkedin.sendConnectionRequest(
                alice.getUserId(), bob.getUserId(), "Let's connect!").getRequestId();
        linkedin.acceptConnection(reqId);
        System.out.println("Alice <-> Bob connected");

        // 3. Feed interactions
        System.out.println("\n--- 3. Feed ---");
        String postId = linkedin.createPost(alice.getUserId(),
                "Excited about my new role!", PostType.STATUS_UPDATE, PostVisibility.PUBLIC).getPostId();
        linkedin.likePost(bob.getUserId(), postId);
        linkedin.commentOnPost(bob.getUserId(), postId, "Congrats!");
        System.out.println("Bob's feed: " + linkedin.getFeed(bob.getUserId(), 10).size() + " post(s)");

        // 4. Job board
        System.out.println("\n--- 4. Jobs ---");
        com.you.lld.problems.linkedin.model.Job job = linkedin.postJob("COMP1", "Senior Engineer", "Build distributed systems");
        job.setType(JobType.FULL_TIME);
        System.out.println("Search 'engineer': " + linkedin.searchJobs("engineer", null).size() + " job(s)");

        // 5. Duplicate connection guard
        System.out.println("\n--- 5. Idempotency ---");
        try {
            linkedin.sendConnectionRequest(alice.getUserId(), bob.getUserId(), "Again");
            System.out.println("Duplicate request allowed (service-dependent)");
        } catch (Exception e) {
            System.out.println("Duplicate blocked: " + e.getMessage());
        }

        System.out.println("\n=== Demo complete ===");
    }
}
