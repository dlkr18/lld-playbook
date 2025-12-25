package com.you.lld.problems.linkedin;
import com.you.lld.problems.linkedin.api.*;
import com.you.lld.problems.linkedin.impl.*;
import com.you.lld.problems.linkedin.model.*;
import java.util.*;

public class LinkedInDemo {
    public static void main(String[] args) {
        System.out.println("=== LinkedIn Professional Network Demo ===\n");
        
        LinkedInService linkedin = new InMemoryLinkedInService();
        
        // Register users
        User alice = linkedin.registerUser("Alice Johnson", "alice@example.com");
        alice.setHeadline("Software Engineer at Google");
        linkedin.updateProfile(alice.getUserId(), alice);
        
        User bob = linkedin.registerUser("Bob Smith", "bob@example.com");
        bob.setHeadline("Product Manager at Microsoft");
        linkedin.updateProfile(bob.getUserId(), bob);
        
        System.out.println("✅ Registered 2 users");
        System.out.println("   - " + alice.getName() + ": " + alice.getHeadline());
        System.out.println("   - " + bob.getName() + ": " + bob.getHeadline());
        
        // Add experience
        Experience aliceExp = new Experience("Senior Software Engineer", "Google");
        aliceExp.setLocation("Mountain View, CA");
        alice.addExperience(aliceExp);
        System.out.println("\n✅ Added experience for Alice");
        
        // Add skills
        alice.addSkill(new Skill("Java"));
        alice.addSkill(new Skill("System Design"));
        System.out.println("✅ Added skills for Alice");
        
        // Send connection request
        ConnectionRequest request = linkedin.sendConnectionRequest(
            alice.getUserId(), bob.getUserId(), "Let's connect!");
        System.out.println("\n📨 Alice sent connection request to Bob");
        
        // Accept connection
        linkedin.acceptConnection(request.getRequestId());
        System.out.println("✅ Bob accepted connection");
        
        // Create post
        Post post = linkedin.createPost(alice.getUserId(), 
            "Excited to share my new role at Google!", 
            PostType.STATUS_UPDATE, 
            PostVisibility.PUBLIC);
        System.out.println("\n📝 Alice created a post");
        
        // Like and comment
        linkedin.likePost(bob.getUserId(), post.getPostId());
        linkedin.commentOnPost(bob.getUserId(), post.getPostId(), "Congratulations!");
        System.out.println("✅ Bob liked and commented on Alice's post");
        
        // Post job
        Job job = linkedin.postJob("COMP001", "Senior Software Engineer", 
            "Looking for talented engineers");
        job.setLocation("Remote");
        job.setType(JobType.FULL_TIME);
        job.addRequiredSkill("Java");
        System.out.println("\n💼 Posted job: " + job.getTitle());
        
        // Search jobs
        List<Job> jobs = linkedin.searchJobs("engineer", null);
        System.out.println("🔍 Found " + jobs.size() + " job(s)");
        
        // Get feed
        List<Post> feed = linkedin.getFeed(bob.getUserId(), 10);
        System.out.println("\n📰 Bob's feed has " + feed.size() + " post(s)");
        
        System.out.println("\n✅ Demo completed successfully!");
    }
}