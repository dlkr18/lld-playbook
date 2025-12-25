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
