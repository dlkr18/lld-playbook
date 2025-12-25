package com.you.lld.problems.socialnetwork;
import java.util.*;

public class SocialNetwork {
    private final Map<String, User> users;
    private final Map<String, Post> posts;
    
    public SocialNetwork() {
        this.users = new HashMap<>();
        this.posts = new HashMap<>();
    }
    
    public void addUser(User user) {
        users.put(user.getUserId(), user);
    }
    
    public void addFriend(String userId1, String userId2) {
        User user1 = users.get(userId1);
        User user2 = users.get(userId2);
        if (user1 != null && user2 != null) {
            user1.addFriend(userId2);
            user2.addFriend(userId1);
        }
    }
    
    public void createPost(Post post) {
        posts.put(post.getPostId(), post);
    }
    
    public List<Post> getNewsfeed(String userId, int limit) {
        User user = users.get(userId);
        if (user == null) return new ArrayList<>();
        
        List<Post> feed = new ArrayList<>();
        for (Post post : posts.values()) {
            if (post.getAuthorId().equals(userId) || user.getFriends().contains(post.getAuthorId())) {
                feed.add(post);
            }
        }
        return feed.subList(0, Math.min(limit, feed.size()));
    }
}
