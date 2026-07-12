package com.you.lld.problems.socialnetwork;

import com.you.lld.problems.socialnetwork.model.PostVisibility;
import com.you.lld.problems.socialnetwork.model.User;

/**
 * SDE3 demo: friends, feed Strategy, posts, messaging.
 */
public class SocialNetworkDemo {

    public static void main(String[] args) {
        System.out.println("=== Social Network (SDE3) ===\n");
        SocialNetwork network = new SocialNetwork();

        // 1. Users
        System.out.println("--- 1. Users ---");
        User alice = network.createUser("Alice", "alice@example.com");
        User bob = network.createUser("Bob", "bob@example.com");
        User charlie = network.createUser("Charlie", "charlie@example.com");
        System.out.println("Created: " + alice.getName() + ", " + bob.getName() + ", " + charlie.getName());

        // 2. Friend graph
        System.out.println("\n--- 2. Friends + follow ---");
        String reqId = network.sendFriendRequest(alice.getUserId(), bob.getUserId()).getRequestId();
        network.acceptFriendRequest(reqId);
        network.follow(charlie.getUserId(), alice.getUserId());
        System.out.println("Alice-Bob friends; Charlie follows Alice");

        // 3. Posts + feed (ChronologicalFeedAlgorithm via Strategy)
        System.out.println("\n--- 3. Feed ---");
        String postId = network.createPost(alice.getUserId(),
                "Hello world!", PostVisibility.PUBLIC).getPostId();
        network.likePost(bob.getUserId(), postId);
        network.commentOnPost(charlie.getUserId(), postId, "Welcome!");
        System.out.println("Alice feed (" + network.getNewsfeed(alice.getUserId(), 10).size() + " posts)");

        // 4. Messaging
        System.out.println("\n--- 4. Messaging ---");
        network.sendMessage(alice.getUserId(), bob.getUserId(), "Hi Bob!");
        network.sendMessage(bob.getUserId(), alice.getUserId(), "Hey Alice!");
        System.out.println("Conversation: " + network.getConversation(
                alice.getUserId(), bob.getUserId()).size() + " messages");

        // 5. Search
        System.out.println("\n--- 5. Search ---");
        System.out.println("Search 'Alice': " + network.searchUsers("Alice").size() + " user(s)");

        System.out.println("\n=== Demo complete ===");
    }
}
