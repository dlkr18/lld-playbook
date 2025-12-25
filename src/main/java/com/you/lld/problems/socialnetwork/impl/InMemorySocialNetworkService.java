package com.you.lld.problems.socialnetwork.impl;

import com.you.lld.problems.socialnetwork.api.*;
import com.you.lld.problems.socialnetwork.model.*;
import com.you.lld.problems.socialnetwork.exceptions.*;
import java.util.*;
import java.util.stream.Collectors;

public class InMemorySocialNetworkService implements SocialNetworkService {
    private final Map<String, User> users;
    private final Map<String, Post> posts;
    private final Map<String, Comment> comments;
    private final Map<String, FriendRequest> friendRequests;
    private final Map<String, Notification> notifications;
    private final Map<String, List<Message>> conversations;
    private final FeedAlgorithm feedAlgorithm;
    private final NotificationService notificationService;
    
    public InMemorySocialNetworkService() {
        this.users = new HashMap<>();
        this.posts = new HashMap<>();
        this.comments = new HashMap<>();
        this.friendRequests = new HashMap<>();
        this.notifications = new HashMap<>();
        this.conversations = new HashMap<>();
        this.feedAlgorithm = new ChronologicalFeedAlgorithm();
        this.notificationService = new SimpleNotificationService(notifications);
    }
    
    @Override
    public User createUser(String name, String email) {
        String userId = UUID.randomUUID().toString();
        User user = new User(userId, name, email);
        users.put(userId, user);
        return user;
    }
    
    @Override
    public User getUser(String userId) {
        User user = users.get(userId);
        if (user == null) {
            throw new UserNotFoundException("User not found: " + userId);
        }
        return user;
    }
    
    @Override
    public void updateUser(String userId, User updatedUser) {
        if (!users.containsKey(userId)) {
            throw new UserNotFoundException("User not found: " + userId);
        }
        users.put(userId, updatedUser);
    }
    
    @Override
    public void deleteUser(String userId) {
        users.remove(userId);
        // Clean up user's posts, comments, etc.
        posts.values().removeIf(p -> p.getAuthorId().equals(userId));
    }
    
    @Override
    public FriendRequest sendFriendRequest(String senderId, String receiverId) {
        validateUser(senderId);
        validateUser(receiverId);
        
        String requestId = UUID.randomUUID().toString();
        FriendRequest request = new FriendRequest(requestId, senderId, receiverId);
        friendRequests.put(requestId, request);
        
        notificationService.notifyFriendRequest(senderId, receiverId);
        return request;
    }
    
    @Override
    public void acceptFriendRequest(String requestId) {
        FriendRequest request = friendRequests.get(requestId);
        if (request == null) {
            throw new InvalidRequestException("Friend request not found");
        }
        
        request.accept();
        
        // Make them friends
        User sender = users.get(request.getSenderId());
        User receiver = users.get(request.getReceiverId());
        sender.addFriend(receiver.getUserId());
        receiver.addFriend(sender.getUserId());
    }
    
    @Override
    public void rejectFriendRequest(String requestId) {
        FriendRequest request = friendRequests.get(requestId);
        if (request != null) {
            request.reject();
        }
    }
    
    @Override
    public void removeFriend(String userId1, String userId2) {
        User user1 = getUser(userId1);
        User user2 = getUser(userId2);
        user1.removeFriend(userId2);
        user2.removeFriend(userId1);
    }
    
    @Override
    public List<User> getFriends(String userId) {
        User user = getUser(userId);
        return user.getFriendIds().stream()
            .map(users::get)
            .filter(Objects::nonNull)
            .collect(Collectors.toList());
    }
    
    @Override
    public List<FriendRequest> getPendingFriendRequests(String userId) {
        return friendRequests.values().stream()
            .filter(r -> r.getReceiverId().equals(userId))
            .filter(r -> r.getStatus() == FriendRequestStatus.PENDING)
            .collect(Collectors.toList());
    }
    
    @Override
    public void follow(String followerId, String followingId) {
        User follower = getUser(followerId);
        User following = getUser(followingId);
        follower.follow(followingId);
        following.addFollower(followerId);
        notificationService.notifyFollow(followerId, followingId);
    }
    
    @Override
    public void unfollow(String followerId, String followingId) {
        User follower = getUser(followerId);
        User following = getUser(followingId);
        follower.unfollow(followingId);
        following.removeFollower(followerId);
    }
    
    @Override
    public List<User> getFollowers(String userId) {
        User user = getUser(userId);
        return user.getFollowerIds().stream()
            .map(users::get)
            .filter(Objects::nonNull)
            .collect(Collectors.toList());
    }
    
    @Override
    public List<User> getFollowing(String userId) {
        User user = getUser(userId);
        return user.getFollowingIds().stream()
            .map(users::get)
            .filter(Objects::nonNull)
            .collect(Collectors.toList());
    }
    
    @Override
    public void blockUser(String userId, String blockedUserId) {
        User user = getUser(userId);
        user.blockUser(blockedUserId);
        // Remove friendship if exists
        removeFriend(userId, blockedUserId);
    }
    
    @Override
    public void unblockUser(String userId, String unblockedUserId) {
        User user = getUser(userId);
        user.unblockUser(unblockedUserId);
    }
    
    @Override
    public Post createPost(String authorId, String content, PostVisibility visibility) {
        validateUser(authorId);
        String postId = UUID.randomUUID().toString();
        Post post = new Post(postId, authorId, content);
        post.setVisibility(visibility);
        posts.put(postId, post);
        return post;
    }
    
    @Override
    public Post getPost(String postId) {
        Post post = posts.get(postId);
        if (post == null) {
            throw new PostNotFoundException("Post not found: " + postId);
        }
        return post;
    }
    
    @Override
    public void updatePost(String postId, String newContent) {
        Post post = getPost(postId);
        post.updateContent(newContent);
    }
    
    @Override
    public void deletePost(String postId) {
        posts.remove(postId);
    }
    
    @Override
    public Post sharePost(String userId, String postId) {
        validateUser(userId);
        Post originalPost = getPost(postId);
        originalPost.incrementShareCount();
        
        // Create a new post that references the original
        String newPostId = UUID.randomUUID().toString();
        Post sharedPost = new Post(newPostId, userId, "Shared: " + originalPost.getContent());
        posts.put(newPostId, sharedPost);
        return sharedPost;
    }
    
    @Override
    public void likePost(String userId, String postId) {
        validateUser(userId);
        Post post = getPost(postId);
        post.like(userId);
        notificationService.notifyPostLike(userId, postId);
    }
    
    @Override
    public void unlikePost(String userId, String postId) {
        Post post = getPost(postId);
        post.unlike(userId);
    }
    
    @Override
    public Comment commentOnPost(String userId, String postId, String content) {
        validateUser(userId);
        Post post = getPost(postId);
        
        String commentId = UUID.randomUUID().toString();
        Comment comment = new Comment(commentId, postId, userId, content);
        comments.put(commentId, comment);
        post.addComment(comment);
        
        notificationService.notifyComment(userId, postId);
        return comment;
    }
    
    @Override
    public Comment replyToComment(String userId, String commentId, String content) {
        validateUser(userId);
        Comment parentComment = comments.get(commentId);
        if (parentComment == null) {
            throw new CommentNotFoundException("Comment not found");
        }
        
        String replyId = UUID.randomUUID().toString();
        Comment reply = new Comment(replyId, parentComment.getPostId(), userId, content);
        comments.put(replyId, reply);
        parentComment.addReply(reply);
        return reply;
    }
    
    @Override
    public void likeComment(String userId, String commentId) {
        Comment comment = comments.get(commentId);
        if (comment != null) {
            comment.like(userId);
        }
    }
    
    @Override
    public List<Post> getNewsfeed(String userId, int limit) {
        User user = getUser(userId);
        List<Post> allRelevantPosts = posts.values().stream()
            .filter(p -> isVisibleToUser(p, user))
            .collect(Collectors.toList());
        
        return feedAlgorithm.generateFeed(user, allRelevantPosts, limit);
    }
    
    @Override
    public List<Post> getUserPosts(String userId) {
        return posts.values().stream()
            .filter(p -> p.getAuthorId().equals(userId))
            .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
            .collect(Collectors.toList());
    }
    
    @Override
    public List<Notification> getNotifications(String userId, boolean unreadOnly) {
        return notifications.values().stream()
            .filter(n -> n.getUserId().equals(userId))
            .filter(n -> !unreadOnly || !n.isRead())
            .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
            .collect(Collectors.toList());
    }
    
    @Override
    public void markNotificationAsRead(String notificationId) {
        Notification notification = notifications.get(notificationId);
        if (notification != null) {
            notification.markAsRead();
        }
    }
    
    @Override
    public Message sendMessage(String senderId, String receiverId, String content) {
        validateUser(senderId);
        validateUser(receiverId);
        
        String messageId = UUID.randomUUID().toString();
        String conversationId = getConversationId(senderId, receiverId);
        Message message = new Message(messageId, conversationId, senderId, content);
        
        conversations.computeIfAbsent(conversationId, k -> new ArrayList<>()).add(message);
        return message;
    }
    
    @Override
    public List<Message> getConversation(String userId1, String userId2) {
        String conversationId = getConversationId(userId1, userId2);
        return conversations.getOrDefault(conversationId, new ArrayList<>());
    }
    
    @Override
    public List<User> searchUsers(String query) {
        return users.values().stream()
            .filter(u -> u.getName().toLowerCase().contains(query.toLowerCase()) ||
                        u.getEmail().toLowerCase().contains(query.toLowerCase()))
            .collect(Collectors.toList());
    }
    
    @Override
    public List<Post> searchPosts(String query) {
        return posts.values().stream()
            .filter(p -> p.getContent().toLowerCase().contains(query.toLowerCase()))
            .collect(Collectors.toList());
    }
    
    // Helper methods
    private void validateUser(String userId) {
        if (!users.containsKey(userId)) {
            throw new UserNotFoundException("User not found: " + userId);
        }
    }
    
    private boolean isVisibleToUser(Post post, User viewer) {
        if (post.getVisibility() == PostVisibility.PUBLIC) return true;
        if (post.getAuthorId().equals(viewer.getUserId())) return true;
        if (post.getVisibility() == PostVisibility.FRIENDS_ONLY) {
            return viewer.isFriend(post.getAuthorId());
        }
        return false;
    }
    
    private String getConversationId(String userId1, String userId2) {
        List<String> sorted = Arrays.asList(userId1, userId2);
        Collections.sort(sorted);
        return sorted.get(0) + "_" + sorted.get(1);
    }
}
