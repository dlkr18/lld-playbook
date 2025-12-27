# Social Network (Facebook / Twitter)

## Overview
A scalable social networking platform supporting user profiles, friendships/follows, posts, likes, comments, news feed generation, and notifications. Handles billions of users and interactions with optimized feed algorithms.

**Difficulty:** Hard  
**Domain:** Social Media, Distributed Systems  
**Interview Frequency:** Very High (Meta, Twitter, LinkedIn, Instagram)

## Requirements

### Functional Requirements
1. **User Management**: Register, login, profile, privacy
2. **Connections**: Friend requests, follow/unfollow
3. **Posts**: Create, edit, delete, multimedia
4. **Interactions**: Like, comment, share
5. **News Feed**: Personalized, chronological, ranked
6. **Search**: Users, posts, hashtags
7. **Notifications**: Likes, comments, mentions

### Non-Functional Requirements
1. **Scalability**: Billion users, trillion posts
2. **Performance**: Feed generation < 500ms
3. **Availability**: 99.99% uptime
4. **Consistency**: Eventual consistency acceptable

## System Design

### Key Algorithms

#### 1. News Feed Generation (Fan-Out on Write)
```java
public void publishPost(Post post) {
    // Get user's followers
    List<String> followers = getFollowers(post.getUserId());
    
    // Fan-out: Write to each follower's feed
    for (String followerId : followers) {
        feedCache.add(followerId, post);
    }
    
    // Store post
    postRepo.save(post);
}
```

**Time Complexity:** O(F) where F=followers  
**Space Complexity:** O(F)

**Alternative: Fan-Out on Read**
```java
public List<Post> getFeed(String userId) {
    List<String> following = getFollowing(userId);
    
    // Merge posts from all followed users
    List<Post> feed = new ArrayList<>();
    for (String followedId : following) {
        feed.addAll(getRecentPosts(followedId, 10));
    }
    
    // Sort by timestamp
    feed.sort((a, b) -> b.getTimestamp().compareTo(a.getTimestamp()));
    
    return feed.subList(0, Math.min(50, feed.size()));
}
```

**Trade-off:**
- Fan-out on write: Fast reads, slow writes (celebrities)
- Fan-out on read: Fast writes, slow reads

**Hybrid Approach:**
- Regular users: Fan-out on write
- Celebrities (>1M followers): Fan-out on read

#### 2. Ranked Feed (EdgeRank)
```java
public double calculateEdgeRank(Post post, User viewer) {
    // Affinity: How close is viewer to author?
    double affinity = getAffinity(viewer, post.getAuthor());
    
    // Weight: Type of interaction (like=1, comment=2, share=3)
    double weight = post.getInteractionWeight();
    
    // Time decay
    double decay = Math.exp(-0.1 * hoursSince(post.getTimestamp()));
    
    return affinity * weight * decay;
}
```

#### 3. Friend Recommendations
```java
public List<User> recommendFriends(String userId) {
    Set<String> friends = getFriends(userId);
    Map<String, Integer> mutualFriendCount = new HashMap<>();
    
    // Count mutual friends
    for (String friendId : friends) {
        for (String friendOfFriend : getFriends(friendId)) {
            if (!friendOfFriend.equals(userId) && !friends.contains(friendOfFriend)) {
                mutualFriendCount.merge(friendOfFriend, 1, Integer::sum);
            }
        }
    }
    
    // Sort by mutual friend count
    return mutualFriendCount.entrySet().stream()
        .sorted((a, b) -> b.getValue() - a.getValue())
        .limit(10)
        .map(e -> getUser(e.getKey()))
        .collect(Collectors.toList());
}
```

## Design Patterns

### 1. Observer Pattern (Notifications)
```java
interface PostObserver {
    void onPostCreated(Post post);
    void onPostLiked(Post post, User liker);
    void onPostCommented(Post post, Comment comment);
}

class NotificationService implements PostObserver {
    public void onPostLiked(Post post, User liker) {
        sendNotification(post.getAuthor(), 
            liker.getName() + " liked your post");
    }
}
```

### 2. Strategy Pattern (Feed Algorithm)
```java
interface FeedStrategy {
    List<Post> generateFeed(User user);
}

class ChronologicalFeed implements FeedStrategy {
    public List<Post> generateFeed(User user) {
        return getPostsByTimestamp(user);
    }
}

class RankedFeed implements FeedStrategy {
    public List<Post> generateFeed(User user) {
        return getPostsByEdgeRank(user);
    }
}
```

## Source Code
📄 **[View Complete Source Code](/problems/socialnetwork/CODE)**

## Usage Example
```java
SocialNetworkService service = new SocialNetworkServiceImpl();

// Register users
String userId1 = service.registerUser("Alice", "alice@example.com");
String userId2 = service.registerUser("Bob", "bob@example.com");

// Send friend request
service.sendFriendRequest(userId1, userId2);
service.acceptFriendRequest(userId2, userId1);

// Create post
Post post = service.createPost(userId1, "Hello World!", PostType.TEXT);

// Like and comment
service.likePost(userId2, post.getId());
service.commentOnPost(userId2, post.getId(), "Great post!");

// Get news feed
List<Post> feed = service.getNewsFeed(userId2, 20);

// Search
List<User> users = service.searchUsers("Alice");
List<Post> posts = service.searchPosts("#technology");
```

## Key Takeaways

### What Interviewers Look For
1. ✅ Feed generation algorithm (fan-out)
2. ✅ Ranking algorithm (EdgeRank)
3. ✅ Scalability (sharding, caching)
4. ✅ Friend recommendations
5. ✅ Real-time notifications
6. ✅ Search optimization

### Common Mistakes
1. ❌ Single feed generation strategy
2. ❌ Not handling celebrities (1M+ followers)
3. ❌ Linear feed generation
4. ❌ No caching
5. ❌ Synchronous notifications
6. ❌ Not considering privacy settings

---

## Related Problems
- 📧 **Notification System** - Real-time alerts
- 🔍 **Search Engine** - Content search
- 💬 **Chat System** - Messaging
- 📊 **Analytics** - User engagement

*Production-ready social network with optimized feed generation, ranking algorithms, and scalable architecture.*
