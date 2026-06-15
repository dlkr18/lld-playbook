package com.you.lld.problems.socialnetwork;

import com.you.lld.problems.socialnetwork.model.Comment;
import com.you.lld.problems.socialnetwork.model.FriendRequest;
import com.you.lld.problems.socialnetwork.model.Message;
import com.you.lld.problems.socialnetwork.model.Post;
import com.you.lld.problems.socialnetwork.model.PostVisibility;
import com.you.lld.problems.socialnetwork.model.User;
import com.you.lld.problems.socialnetwork.service.SocialNetworkService;
import com.you.lld.problems.socialnetwork.service.impl.InMemorySocialNetworkService;

import java.util.List;

/** Facade for social network — friends, feed (Strategy), posts, messaging. */
public class SocialNetwork {
    private final SocialNetworkService service;

    public SocialNetwork() {
        this(new InMemorySocialNetworkService());
    }

    public SocialNetwork(SocialNetworkService service) {
        this.service = service;
    }

    public User createUser(String name, String email) {
        return service.createUser(name, email);
    }

    public FriendRequest sendFriendRequest(String fromId, String toId) {
        return service.sendFriendRequest(fromId, toId);
    }

    public void acceptFriendRequest(String requestId) {
        service.acceptFriendRequest(requestId);
    }

    public void follow(String followerId, String followeeId) {
        service.follow(followerId, followeeId);
    }

    public Post createPost(String authorId, String content, PostVisibility visibility) {
        return service.createPost(authorId, content, visibility);
    }

    public void likePost(String userId, String postId) {
        service.likePost(userId, postId);
    }

    public Comment commentOnPost(String userId, String postId, String content) {
        return service.commentOnPost(userId, postId, content);
    }

    public List<Post> getNewsfeed(String userId, int limit) {
        return service.getNewsfeed(userId, limit);
    }

    public void sendMessage(String fromId, String toId, String content) {
        service.sendMessage(fromId, toId, content);
    }

    public List<Message> getConversation(String user1Id, String user2Id) {
        return service.getConversation(user1Id, user2Id);
    }

    public List<User> searchUsers(String query) {
        return service.searchUsers(query);
    }
}
