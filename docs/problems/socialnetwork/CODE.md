# Social Network - Complete Implementation

## 📂 Directory Structure

**Total: 27 Java files**

```
Social Network/
  📄 Post.java
  📄 SocialNetwork.java
  📄 SocialNetworkDemo.java
  📄 User.java
  📂 api/
    📄 FeedAlgorithm.java
    📄 NotificationService.java
    📄 SocialNetworkService.java
  📂 exceptions/
    📄 CommentNotFoundException.java
    📄 InvalidRequestException.java
    📄 PostNotFoundException.java
    📄 UnauthorizedException.java
    📄 UserNotFoundException.java
  📂 impl/
    📄 ChronologicalFeedAlgorithm.java
    📄 InMemorySocialNetworkService.java
    📄 SimpleNotificationService.java
  📂 model/
    📄 Comment.java
    📄 Feed.java
    📄 FriendRequest.java
    📄 FriendRequestStatus.java
    📄 Message.java
    📄 MessageStatus.java
    📄 Notification.java
    📄 NotificationType.java
    📄 Post.java
    📄 PostVisibility.java
    📄 User.java
    📄 UserStatus.java
```

---

## 🔗 Quick Navigation

- [api](#api)
- [exceptions](#exceptions)
- [impl](#impl)
- [model](#model)
- [📦 Root Files](#root-files)

---

## 📁 api {#api}

**Files in this directory: 3**

### FeedAlgorithm.java

<details>
<summary>📄 Click to view FeedAlgorithm.java</summary>

```java
package com.you.lld.problems.socialnetwork.api;

import com.you.lld.problems.socialnetwork.model.*;
import java.util.List;

public interface FeedAlgorithm {
    List<Post> generateFeed(User user, List<Post> allPosts, int limit);
}

```
</details>

---

### NotificationService.java

<details>
<summary>📄 Click to view NotificationService.java</summary>

```java
package com.you.lld.problems.socialnetwork.api;

import com.you.lld.problems.socialnetwork.model.*;

public interface NotificationService {
    void sendNotification(Notification notification);
    void notifyFriendRequest(String senderId, String receiverId);
    void notifyPostLike(String likerId, String postId);
    void notifyComment(String commenterId, String postId);
    void notifyFollow(String followerId, String followingId);
}

```
</details>

---

### SocialNetworkService.java

<details>
<summary>📄 Click to view SocialNetworkService.java</summary>

```java
package com.you.lld.problems.socialnetwork.api;

import com.you.lld.problems.socialnetwork.model.*;
import java.util.List;

public interface SocialNetworkService {
    // User management
    User createUser(String name, String email);
    User getUser(String userId);
    void updateUser(String userId, User updatedUser);
    void deleteUser(String userId);
    
    // Friend management
    FriendRequest sendFriendRequest(String senderId, String receiverId);
    void acceptFriendRequest(String requestId);
    void rejectFriendRequest(String requestId);
    void removeFriend(String userId1, String userId2);
    List<User> getFriends(String userId);
    List<FriendRequest> getPendingFriendRequests(String userId);
    
    // Follow management
    void follow(String followerId, String followingId);
    void unfollow(String followerId, String followingId);
    List<User> getFollowers(String userId);
    List<User> getFollowing(String userId);
    
    // Block management
    void blockUser(String userId, String blockedUserId);
    void unblockUser(String userId, String unblockedUserId);
    
    // Post management
    Post createPost(String authorId, String content, PostVisibility visibility);
    Post getPost(String postId);
    void updatePost(String postId, String newContent);
    void deletePost(String postId);
    Post sharePost(String userId, String postId);
    
    // Interaction management
    void likePost(String userId, String postId);
    void unlikePost(String userId, String postId);
    Comment commentOnPost(String userId, String postId, String content);
    Comment replyToComment(String userId, String commentId, String content);
    void likeComment(String userId, String commentId);
    
    // Feed management
    List<Post> getNewsfeed(String userId, int limit);
    List<Post> getUserPosts(String userId);
    
    // Notification management
    List<Notification> getNotifications(String userId, boolean unreadOnly);
    void markNotificationAsRead(String notificationId);
    
    // Messaging
    Message sendMessage(String senderId, String receiverId, String content);
    List<Message> getConversation(String userId1, String userId2);
    
    // Search
    List<User> searchUsers(String query);
    List<Post> searchPosts(String query);
}

```
</details>

---

## 📁 exceptions {#exceptions}

**Files in this directory: 5**

### CommentNotFoundException.java

<details>
<summary>📄 Click to view CommentNotFoundException.java</summary>

```java
package com.you.lld.problems.socialnetwork.exceptions;

public class CommentNotFoundException extends RuntimeException {
    public CommentNotFoundException(String message) {
        super(message);
    }
}

```
</details>

---

### InvalidRequestException.java

<details>
<summary>📄 Click to view InvalidRequestException.java</summary>

```java
package com.you.lld.problems.socialnetwork.exceptions;

public class InvalidRequestException extends RuntimeException {
    public InvalidRequestException(String message) {
        super(message);
    }
}

```
</details>

---

### PostNotFoundException.java

<details>
<summary>📄 Click to view PostNotFoundException.java</summary>

```java
package com.you.lld.problems.socialnetwork.exceptions;

public class PostNotFoundException extends RuntimeException {
    public PostNotFoundException(String message) {
        super(message);
    }
}

```
</details>

---

### UnauthorizedException.java

<details>
<summary>📄 Click to view UnauthorizedException.java</summary>

```java
package com.you.lld.problems.socialnetwork.exceptions;

public class UnauthorizedException extends RuntimeException {
    public UnauthorizedException(String message) {
        super(message);
    }
}

```
</details>

---

### UserNotFoundException.java

<details>
<summary>📄 Click to view UserNotFoundException.java</summary>

```java
package com.you.lld.problems.socialnetwork.exceptions;

public class UserNotFoundException extends RuntimeException {
    public UserNotFoundException(String message) {
        super(message);
    }
}

```
</details>

---

## 📁 impl {#impl}

**Files in this directory: 3**

### ChronologicalFeedAlgorithm.java

<details>
<summary>📄 Click to view ChronologicalFeedAlgorithm.java</summary>

```java
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

```
</details>

---

### InMemorySocialNetworkService.java

<details>
<summary>📄 Click to view InMemorySocialNetworkService.java</summary>

```java
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

```
</details>

---

### SimpleNotificationService.java

<details>
<summary>📄 Click to view SimpleNotificationService.java</summary>

```java
package com.you.lld.problems.socialnetwork.impl;

import com.you.lld.problems.socialnetwork.api.NotificationService;
import com.you.lld.problems.socialnetwork.model.*;
import java.util.*;

public class SimpleNotificationService implements NotificationService {
    private final Map<String, Notification> notifications;
    
    public SimpleNotificationService(Map<String, Notification> notifications) {
        this.notifications = notifications;
    }
    
    @Override
    public void sendNotification(Notification notification) {
        notifications.put(notification.getNotificationId(), notification);
    }
    
    @Override
    public void notifyFriendRequest(String senderId, String receiverId) {
        String notifId = UUID.randomUUID().toString();
        Notification notification = new Notification(
            notifId, receiverId, NotificationType.FRIEND_REQUEST,
            senderId, null, "sent you a friend request"
        );
        sendNotification(notification);
    }
    
    @Override
    public void notifyPostLike(String likerId, String postId) {
        String notifId = UUID.randomUUID().toString();
        // In real implementation, get post author and notify them
        // For now, simplified
    }
    
    @Override
    public void notifyComment(String commenterId, String postId) {
        String notifId = UUID.randomUUID().toString();
        // In real implementation, get post author and notify them
    }
    
    @Override
    public void notifyFollow(String followerId, String followingId) {
        String notifId = UUID.randomUUID().toString();
        Notification notification = new Notification(
            notifId, followingId, NotificationType.USER_FOLLOWED,
            followerId, null, "started following you"
        );
        sendNotification(notification);
    }
}

```
</details>

---

## 📁 model {#model}

**Files in this directory: 12**

### Comment.java

<details>
<summary>📄 Click to view Comment.java</summary>

```java
package com.you.lld.problems.socialnetwork.model;

import java.time.LocalDateTime;
import java.util.*;

public class Comment {
    private final String commentId;
    private final String postId;
    private final String authorId;
    private String content;
    private Set<String> likeUserIds;
    private List<Comment> replies;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private boolean edited;
    
    public Comment(String commentId, String postId, String authorId, String content) {
        this.commentId = commentId;
        this.postId = postId;
        this.authorId = authorId;
        this.content = content;
        this.likeUserIds = new HashSet<>();
        this.replies = new ArrayList<>();
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.edited = false;
    }
    
    public String getCommentId() { return commentId; }
    public String getPostId() { return postId; }
    public String getAuthorId() { return authorId; }
    public String getContent() { return content; }
    
    public void updateContent(String content) {
        this.content = content;
        this.updatedAt = LocalDateTime.now();
        this.edited = true;
    }
    
    public Set<String> getLikeUserIds() { return new HashSet<>(likeUserIds); }
    public void like(String userId) { likeUserIds.add(userId); }
    public void unlike(String userId) { likeUserIds.remove(userId); }
    public int getLikesCount() { return likeUserIds.size(); }
    
    public List<Comment> getReplies() { return new ArrayList<>(replies); }
    public void addReply(Comment reply) { replies.add(reply); }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public boolean isEdited() { return edited; }
}

```
</details>

---

### Feed.java

<details>
<summary>📄 Click to view Feed.java</summary>

```java
package com.you.lld.problems.socialnetwork.model;

import java.util.*;

public class Feed {
    private final String userId;
    private List<Post> posts;
    private LocalDateTime lastUpdated;
    
    public Feed(String userId) {
        this.userId = userId;
        this.posts = new ArrayList<>();
        this.lastUpdated = java.time.LocalDateTime.now();
    }
    
    public String getUserId() { return userId; }
    public List<Post> getPosts() { return new ArrayList<>(posts); }
    
    public void addPost(Post post) {
        posts.add(0, post); // Add to beginning
        updateTimestamp();
    }
    
    public void removePost(String postId) {
        posts.removeIf(p -> p.getPostId().equals(postId));
        updateTimestamp();
    }
    
    public void refresh(List<Post> newPosts) {
        this.posts = new ArrayList<>(newPosts);
        updateTimestamp();
    }
    
    private void updateTimestamp() {
        this.lastUpdated = java.time.LocalDateTime.now();
    }
    
    public java.time.LocalDateTime getLastUpdated() { return lastUpdated; }
}

```
</details>

---

### FriendRequest.java

<details>
<summary>📄 Click to view FriendRequest.java</summary>

```java
package com.you.lld.problems.socialnetwork.model;

import java.time.LocalDateTime;

public class FriendRequest {
    private final String requestId;
    private final String senderId;
    private final String receiverId;
    private FriendRequestStatus status;
    private LocalDateTime sentAt;
    private LocalDateTime respondedAt;
    
    public FriendRequest(String requestId, String senderId, String receiverId) {
        this.requestId = requestId;
        this.senderId = senderId;
        this.receiverId = receiverId;
        this.status = FriendRequestStatus.PENDING;
        this.sentAt = LocalDateTime.now();
    }
    
    public String getRequestId() { return requestId; }
    public String getSenderId() { return senderId; }
    public String getReceiverId() { return receiverId; }
    public FriendRequestStatus getStatus() { return status; }
    
    public void accept() {
        this.status = FriendRequestStatus.ACCEPTED;
        this.respondedAt = LocalDateTime.now();
    }
    
    public void reject() {
        this.status = FriendRequestStatus.REJECTED;
        this.respondedAt = LocalDateTime.now();
    }
    
    public LocalDateTime getSentAt() { return sentAt; }
    public LocalDateTime getRespondedAt() { return respondedAt; }
}

```
</details>

---

### FriendRequestStatus.java

<details>
<summary>📄 Click to view FriendRequestStatus.java</summary>

```java
package com.you.lld.problems.socialnetwork.model;

public enum FriendRequestStatus {
    PENDING,
    ACCEPTED,
    REJECTED,
    CANCELLED
}

```
</details>

---

### Message.java

<details>
<summary>📄 Click to view Message.java</summary>

```java
package com.you.lld.problems.socialnetwork.model;

import java.time.LocalDateTime;

public class Message {
    private final String messageId;
    private final String conversationId;
    private final String senderId;
    private String content;
    private MessageStatus status;
    private LocalDateTime sentAt;
    private LocalDateTime deliveredAt;
    private LocalDateTime readAt;
    
    public Message(String messageId, String conversationId, String senderId, String content) {
        this.messageId = messageId;
        this.conversationId = conversationId;
        this.senderId = senderId;
        this.content = content;
        this.status = MessageStatus.SENT;
        this.sentAt = LocalDateTime.now();
    }
    
    public String getMessageId() { return messageId; }
    public String getConversationId() { return conversationId; }
    public String getSenderId() { return senderId; }
    public String getContent() { return content; }
    public MessageStatus getStatus() { return status; }
    
    public void markAsDelivered() {
        this.status = MessageStatus.DELIVERED;
        this.deliveredAt = LocalDateTime.now();
    }
    
    public void markAsRead() {
        this.status = MessageStatus.READ;
        this.readAt = LocalDateTime.now();
    }
    
    public LocalDateTime getSentAt() { return sentAt; }
    public LocalDateTime getDeliveredAt() { return deliveredAt; }
    public LocalDateTime getReadAt() { return readAt; }
}

```
</details>

---

### MessageStatus.java

<details>
<summary>📄 Click to view MessageStatus.java</summary>

```java
package com.you.lld.problems.socialnetwork.model;

public enum MessageStatus {
    SENT,
    DELIVERED,
    READ
}

```
</details>

---

### Notification.java

<details>
<summary>📄 Click to view Notification.java</summary>

```java
package com.you.lld.problems.socialnetwork.model;

import java.time.LocalDateTime;

public class Notification {
    private final String notificationId;
    private final String userId;
    private final NotificationType type;
    private final String actorId;
    private final String targetId; // postId, commentId, etc.
    private String message;
    private boolean read;
    private LocalDateTime createdAt;
    
    public Notification(String notificationId, String userId, NotificationType type, 
                       String actorId, String targetId, String message) {
        this.notificationId = notificationId;
        this.userId = userId;
        this.type = type;
        this.actorId = actorId;
        this.targetId = targetId;
        this.message = message;
        this.read = false;
        this.createdAt = LocalDateTime.now();
    }
    
    public String getNotificationId() { return notificationId; }
    public String getUserId() { return userId; }
    public NotificationType getType() { return type; }
    public String getActorId() { return actorId; }
    public String getTargetId() { return targetId; }
    public String getMessage() { return message; }
    public boolean isRead() { return read; }
    public void markAsRead() { this.read = true; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}

```
</details>

---

### NotificationType.java

<details>
<summary>📄 Click to view NotificationType.java</summary>

```java
package com.you.lld.problems.socialnetwork.model;

public enum NotificationType {
    FRIEND_REQUEST,
    FRIEND_ACCEPTED,
    POST_LIKE,
    POST_COMMENT,
    COMMENT_REPLY,
    COMMENT_LIKE,
    POST_SHARE,
    USER_FOLLOWED,
    POST_TAG
}

```
</details>

---

### Post.java

<details>
<summary>📄 Click to view Post.java</summary>

```java
package com.you.lld.problems.socialnetwork.model;

import java.time.LocalDateTime;
import java.util.*;

public class Post {
    private final String postId;
    private final String authorId;
    private String content;
    private List<String> mediaUrls;
    private Set<String> likeUserIds;
    private List<Comment> comments;
    private PostVisibility visibility;
    private Set<String> taggedUserIds;
    private String location;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private boolean edited;
    private int shareCount;
    
    public Post(String postId, String authorId, String content) {
        this.postId = postId;
        this.authorId = authorId;
        this.content = content;
        this.mediaUrls = new ArrayList<>();
        this.likeUserIds = new HashSet<>();
        this.comments = new ArrayList<>();
        this.visibility = PostVisibility.PUBLIC;
        this.taggedUserIds = new HashSet<>();
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.edited = false;
        this.shareCount = 0;
    }
    
    public String getPostId() { return postId; }
    public String getAuthorId() { return authorId; }
    public String getContent() { return content; }
    
    public void updateContent(String content) {
        this.content = content;
        this.updatedAt = LocalDateTime.now();
        this.edited = true;
    }
    
    public List<String> getMediaUrls() { return new ArrayList<>(mediaUrls); }
    public void addMedia(String url) { mediaUrls.add(url); }
    
    public Set<String> getLikeUserIds() { return new HashSet<>(likeUserIds); }
    public void like(String userId) { likeUserIds.add(userId); }
    public void unlike(String userId) { likeUserIds.remove(userId); }
    public int getLikesCount() { return likeUserIds.size(); }
    public boolean isLikedBy(String userId) { return likeUserIds.contains(userId); }
    
    public List<Comment> getComments() { return new ArrayList<>(comments); }
    public void addComment(Comment comment) { comments.add(comment); }
    public void removeComment(String commentId) {
        comments.removeIf(c -> c.getCommentId().equals(commentId));
    }
    public int getCommentsCount() { return comments.size(); }
    
    public PostVisibility getVisibility() { return visibility; }
    public void setVisibility(PostVisibility visibility) { this.visibility = visibility; }
    
    public Set<String> getTaggedUserIds() { return new HashSet<>(taggedUserIds); }
    public void tagUser(String userId) { taggedUserIds.add(userId); }
    public void untagUser(String userId) { taggedUserIds.remove(userId); }
    
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public boolean isEdited() { return edited; }
    
    public int getShareCount() { return shareCount; }
    public void incrementShareCount() { shareCount++; }
}

```
</details>

---

### PostVisibility.java

<details>
<summary>📄 Click to view PostVisibility.java</summary>

```java
package com.you.lld.problems.socialnetwork.model;

public enum PostVisibility {
    PUBLIC,
    FRIENDS_ONLY,
    PRIVATE
}

```
</details>

---

### User.java

<details>
<summary>📄 Click to view User.java</summary>

```java
package com.you.lld.problems.socialnetwork.model;

import java.time.LocalDateTime;
import java.util.*;

public class User {
    private final String userId;
    private String name;
    private String email;
    private String bio;
    private String profilePicture;
    private Set<String> friendIds;
    private Set<String> followerIds;
    private Set<String> followingIds;
    private Set<String> blockedUserIds;
    private UserStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime lastActive;
    
    public User(String userId, String name, String email) {
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.friendIds = new HashSet<>();
        this.followerIds = new HashSet<>();
        this.followingIds = new HashSet<>();
        this.blockedUserIds = new HashSet<>();
        this.status = UserStatus.ACTIVE;
        this.createdAt = LocalDateTime.now();
        this.lastActive = LocalDateTime.now();
    }
    
    // Getters and setters
    public String getUserId() { return userId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
    public String getProfilePicture() { return profilePicture; }
    public void setProfilePicture(String profilePicture) { this.profilePicture = profilePicture; }
    
    // Friend management
    public Set<String> getFriendIds() { return new HashSet<>(friendIds); }
    public void addFriend(String friendId) { friendIds.add(friendId); }
    public void removeFriend(String friendId) { friendIds.remove(friendId); }
    public boolean isFriend(String userId) { return friendIds.contains(userId); }
    
    // Follower management
    public Set<String> getFollowerIds() { return new HashSet<>(followerIds); }
    public void addFollower(String followerId) { followerIds.add(followerId); }
    public void removeFollower(String followerId) { followerIds.remove(followerId); }
    
    // Following management
    public Set<String> getFollowingIds() { return new HashSet<>(followingIds); }
    public void follow(String userId) { followingIds.add(userId); }
    public void unfollow(String userId) { followingIds.remove(userId); }
    public boolean isFollowing(String userId) { return followingIds.contains(userId); }
    
    // Block management
    public Set<String> getBlockedUserIds() { return new HashSet<>(blockedUserIds); }
    public void blockUser(String userId) { blockedUserIds.add(userId); }
    public void unblockUser(String userId) { blockedUserIds.remove(userId); }
    public boolean isBlocked(String userId) { return blockedUserIds.contains(userId); }
    
    public UserStatus getStatus() { return status; }
    public void setStatus(UserStatus status) { this.status = status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getLastActive() { return lastActive; }
    public void updateLastActive() { this.lastActive = LocalDateTime.now(); }
}

```
</details>

---

### UserStatus.java

<details>
<summary>📄 Click to view UserStatus.java</summary>

```java
package com.you.lld.problems.socialnetwork.model;

public enum UserStatus {
    ACTIVE,
    INACTIVE,
    SUSPENDED,
    DELETED
}

```
</details>

---

## 📁 📦 Root Files {#root-files}

**Files in this directory: 4**

### Post.java

<details>
<summary>📄 Click to view Post.java</summary>

```java
package com.you.lld.problems.socialnetwork;
import java.time.LocalDateTime;
import java.util.*;

public class Post {
    private final String postId;
    private final String authorId;
    private String content;
    private Set<String> likes;
    private LocalDateTime timestamp;
    
    public Post(String postId, String authorId, String content) {
        this.postId = postId;
        this.authorId = authorId;
        this.content = content;
        this.likes = new HashSet<>();
        this.timestamp = LocalDateTime.now();
    }
    
    public String getPostId() { return postId; }
    public String getAuthorId() { return authorId; }
    public String getContent() { return content; }
    public void like(String userId) { likes.add(userId); }
    public int getLikesCount() { return likes.size(); }
}

```
</details>

---

### SocialNetwork.java

<details>
<summary>📄 Click to view SocialNetwork.java</summary>

```java
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

```
</details>

---

### SocialNetworkDemo.java

<details>
<summary>📄 Click to view SocialNetworkDemo.java</summary>

```java
package com.you.lld.problems.socialnetwork;

import com.you.lld.problems.socialnetwork.api.*;
import com.you.lld.problems.socialnetwork.impl.*;
import com.you.lld.problems.socialnetwork.model.*;
import java.util.List;

public class SocialNetworkDemo {
    public static void main(String[] args) {
        System.out.println("=== Social Network System Demo ===\n");
        
        SocialNetworkService network = new InMemorySocialNetworkService();
        
        // Create users
        User alice = network.createUser("Alice Johnson", "alice@example.com");
        User bob = network.createUser("Bob Smith", "bob@example.com");
        User charlie = network.createUser("Charlie Brown", "charlie@example.com");
        
        System.out.println("✅ Created 3 users");
        System.out.println("   - " + alice.getName());
        System.out.println("   - " + bob.getName());
        System.out.println("   - " + charlie.getName());
        
        // Send and accept friend requests
        System.out.println("\n📬 Sending friend requests...");
        FriendRequest request1 = network.sendFriendRequest(alice.getUserId(), bob.getUserId());
        network.acceptFriendRequest(request1.getRequestId());
        System.out.println("   ✅ Alice and Bob are now friends");
        
        // Follow
        network.follow(charlie.getUserId(), alice.getUserId());
        System.out.println("   ✅ Charlie is now following Alice");
        
        // Create posts
        System.out.println("\n📝 Creating posts...");
        Post post1 = network.createPost(alice.getUserId(), 
            "Hello everyone! This is my first post!", PostVisibility.PUBLIC);
        Post post2 = network.createPost(bob.getUserId(),
            "Having a great day!", PostVisibility.FRIENDS_ONLY);
        
        System.out.println("   ✅ Alice created a post");
        System.out.println("   ✅ Bob created a post");
        
        // Like and comment
        System.out.println("\n👍 Interactions...");
        network.likePost(bob.getUserId(), post1.getPostId());
        Comment comment = network.commentOnPost(charlie.getUserId(), post1.getPostId(), 
            "Great post, Alice!");
        
        System.out.println("   ✅ Bob liked Alice's post");
        System.out.println("   ✅ Charlie commented on Alice's post");
        
        // Get newsfeed
        System.out.println("\n📰 Alice's Newsfeed:");
        List<Post> feed = network.getNewsfeed(alice.getUserId(), 10);
        for (Post post : feed) {
            User author = network.getUser(post.getAuthorId());
            System.out.println("   - " + author.getName() + ": " + post.getContent());
            System.out.println("     Likes: " + post.getLikesCount() + 
                             ", Comments: " + post.getCommentsCount());
        }
        
        // Messaging
        System.out.println("\n💬 Messaging...");
        network.sendMessage(alice.getUserId(), bob.getUserId(), "Hi Bob!");
        network.sendMessage(bob.getUserId(), alice.getUserId(), "Hey Alice! How are you?");
        
        List<Message> conversation = network.getConversation(alice.getUserId(), bob.getUserId());
        System.out.println("   📨 Conversation between Alice and Bob:");
        for (Message msg : conversation) {
            User sender = network.getUser(msg.getSenderId());
            System.out.println("   - " + sender.getName() + ": " + msg.getContent());
        }
        
        // Search
        System.out.println("\n🔍 Searching for 'Alice'...");
        List<User> searchResults = network.searchUsers("Alice");
        System.out.println("   Found " + searchResults.size() + " user(s)");
        
        System.out.println("\n✅ Demo completed successfully!");
    }
}

```
</details>

---

### User.java

<details>
<summary>📄 Click to view User.java</summary>

```java
package com.you.lld.problems.socialnetwork;
import java.util.*;

public class User {
    private final String userId;
    private String name;
    private Set<String> friends;
    
    public User(String userId, String name) {
        this.userId = userId;
        this.name = name;
        this.friends = new HashSet<>();
    }
    
    public String getUserId() { return userId; }
    public String getName() { return name; }
    public Set<String> getFriends() { return new HashSet<>(friends); }
    public void addFriend(String friendId) { friends.add(friendId); }
    public void removeFriend(String friendId) { friends.remove(friendId); }
}

```
</details>

---

