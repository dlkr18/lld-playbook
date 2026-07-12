package com.you.lld.problems.linkedin;

import com.you.lld.problems.linkedin.model.ConnectionRequest;
import com.you.lld.problems.linkedin.model.Job;
import com.you.lld.problems.linkedin.model.Post;
import com.you.lld.problems.linkedin.model.PostType;
import com.you.lld.problems.linkedin.model.PostVisibility;
import com.you.lld.problems.linkedin.model.User;
import com.you.lld.problems.linkedin.service.LinkedInService;
import com.you.lld.problems.linkedin.service.impl.InMemoryLinkedInService;

import java.util.List;

/** Facade for professional network — profiles, connections, feed, jobs. */
public class LinkedIn {
    private final LinkedInService service;

    public LinkedIn() {
        this(new InMemoryLinkedInService());
    }

    public LinkedIn(LinkedInService service) {
        this.service = service;
    }

    public User registerUser(String name, String email) {
        return service.registerUser(name, email);
    }

    public void updateProfile(String userId, User profile) {
        service.updateProfile(userId, profile);
    }

    public ConnectionRequest sendConnectionRequest(String fromId, String toId, String message) {
        return service.sendConnectionRequest(fromId, toId, message);
    }

    public void acceptConnection(String requestId) {
        service.acceptConnection(requestId);
    }

    public Post createPost(String userId, String content, PostType type, PostVisibility visibility) {
        return service.createPost(userId, content, type, visibility);
    }

    public void likePost(String userId, String postId) {
        service.likePost(userId, postId);
    }

    public void commentOnPost(String userId, String postId, String content) {
        service.commentOnPost(userId, postId, content);
    }

    public Job postJob(String companyId, String title, String description) {
        return service.postJob(companyId, title, description);
    }

    public List<Job> searchJobs(String keyword, String location) {
        return service.searchJobs(keyword, location);
    }

    public List<Post> getFeed(String userId, int limit) {
        return service.getFeed(userId, limit);
    }
}
