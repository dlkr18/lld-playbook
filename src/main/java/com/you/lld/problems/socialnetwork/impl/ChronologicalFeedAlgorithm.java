package com.you.lld.problems.socialnetwork.impl;

import com.you.lld.problems.socialnetwork.api.FeedAlgorithm;
import com.you.lld.problems.socialnetwork.model.*;
import java.util.*;
import java.util.stream.Collectors;

public class ChronologicalFeedAlgorithm implements FeedAlgorithm {
    @Override
    public List<Post> generateFeed(User user, List<Post> allPosts, int limit) {
        return allPosts.stream()
            .filter(p -> shouldShowInFeed(user, p))
            .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
            .limit(limit)
            .collect(Collectors.toList());
    }
    
    private boolean shouldShowInFeed(User user, Post post) {
        // Show posts from friends, following, or own posts
        return user.getUserId().equals(post.getAuthorId()) ||
               user.isFriend(post.getAuthorId()) ||
               user.isFollowing(post.getAuthorId());
    }
}
