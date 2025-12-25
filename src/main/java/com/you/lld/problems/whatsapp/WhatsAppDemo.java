package com.you.lld.problems.whatsapp;

import com.you.lld.problems.whatsapp.model.*;
import com.you.lld.problems.whatsapp.service.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

/**
 * Demo application showcasing WhatsApp chat functionality.
 */
public class WhatsAppDemo {
    private static final DateTimeFormatter TIME_FORMATTER = 
        DateTimeFormatter.ofPattern("HH:mm");
    
    public static void main(String[] args) {
        System.out.println("=== WhatsApp Chat Application Demo ===\n");
        
        // Initialize services
        UserService userService = new InMemoryUserService();
        ChatService chatService = new InMemoryChatService();
        
        // Demo 1: User Registration
        demonstrateUserRegistration(userService);
        
        // Demo 2: Direct Messaging
        demonstrateDirectMessaging(userService, chatService);
        
        // Demo 3: Group Chat
        demonstrateGroupChat(userService, chatService);
        
        // Demo 4: Message Features
        demonstrateMessageFeatures(userService, chatService);
        
        // Demo 5: Real-time Features
        demonstrateRealTimeFeatures(userService, chatService);
        
        System.out.println("\n=== Demo Complete ===");
    }
    
    private static void demonstrateUserRegistration(UserService userService) {
        System.out.println("--- Demo 1: User Registration ---");
        
        UserId alice = userService.registerUser("Alice", PhoneNumber.of("+1234567890"));
        UserId bob = userService.registerUser("Bob", PhoneNumber.of("+0987654321"));
        UserId charlie = userService.registerUser("Charlie", PhoneNumber.of("+1122334455"));
        UserId diana = userService.registerUser("Diana", PhoneNumber.of("+5544332211"));
        
        System.out.println("Registered 4 users: Alice, Bob, Charlie, Diana");
        
        // Update profiles
        userService.updateProfile(alice, "Alice Wonder", "Living my best life!");
        userService.updateProfilePicture(alice, "https://example.com/alice.jpg");
        
        User aliceUser = userService.getUser(alice).get();
        System.out.println("\nAlice's profile:");
        System.out.println("  Name: " + aliceUser.getName());
        System.out.println("  Phone: " + aliceUser.getPhoneNumber().getFormatted());
        System.out.println("  Status: " + aliceUser.getStatusMessage());
        System.out.println("  Picture: " + aliceUser.getProfilePicture());
        
        // Set online status
        userService.goOnline(alice);
        userService.goOnline(bob);
        System.out.println("\nAlice and Bob are now online");
        System.out.println();
    }
    
    private static void demonstrateDirectMessaging(UserService userService, 
                                                    ChatService chatService) {
        System.out.println("--- Demo 2: Direct Messaging ---");
        
        UserId alice = userService.getUserByPhoneNumber(PhoneNumber.of("+1234567890")).get().getId();
        UserId bob = userService.getUserByPhoneNumber(PhoneNumber.of("+0987654321")).get().getId();
        
        // Create direct chat
        ChatId chatId = chatService.createDirectChat(alice, bob);
        System.out.println("Created direct chat between Alice and Bob");
        
        // Send messages
        MessageId msg1 = chatService.sendMessage(chatId, alice, 
            new MessageContent("Hey Bob! How are you?"));
        System.out.println("\nAlice: Hey Bob! How are you? " + 
            MessageStatus.SENT.getSymbol());
        
        MessageId msg2 = chatService.sendMessage(chatId, bob,
            new MessageContent("Hi Alice! I'm good, thanks!"));
        System.out.println("Bob: Hi Alice! I'm good, thanks! " + 
            MessageStatus.SENT.getSymbol());
        
        // Mark as read
        chatService.markRead(msg1, bob);
        chatService.markRead(msg2, alice);
        
        Message message1 = chatService.getMessage(msg1).get();
        System.out.println("\nMessage status updated to: " + 
            message1.getStatus() + " " + message1.getStatus().getSymbol());
        
        // Check unread count
        int unreadCount = chatService.getUnreadCount(chatId, alice);
        System.out.println("Alice's unread count: " + unreadCount);
        
        // Get all messages
        List<Message> messages = chatService.getMessages(chatId);
        System.out.println("\nChat history (" + messages.size() + " messages):");
        for (Message msg : messages) {
            User sender = userService.getUser(msg.getSenderId()).get();
            String time = msg.getTimestamp().format(TIME_FORMATTER);
            String content = msg.getContent().getText().orElse("[Media]");
            String status = msg.getStatus().getSymbol();
            System.out.println("  [" + time + "] " + sender.getName() + ": " + 
                             content + " " + status);
        }
        System.out.println();
    }
    
    private static void demonstrateGroupChat(UserService userService, 
                                             ChatService chatService) {
        System.out.println("--- Demo 3: Group Chat ---");
        
        UserId alice = userService.getUserByPhoneNumber(PhoneNumber.of("+1234567890")).get().getId();
        UserId bob = userService.getUserByPhoneNumber(PhoneNumber.of("+0987654321")).get().getId();
        UserId charlie = userService.getUserByPhoneNumber(PhoneNumber.of("+1122334455")).get().getId();
        UserId diana = userService.getUserByPhoneNumber(PhoneNumber.of("+5544332211")).get().getId();
        
        // Create group
        Set<UserId> members = new HashSet<>();
        members.add(bob);
        members.add(charlie);
        members.add(diana);
        GroupId groupId = chatService.createGroup("Friends Forever", members, alice);
        System.out.println("Created group 'Friends Forever' with 4 members");
        
        GroupChat group = (GroupChat) chatService.getChat(groupId.toChatId()).get();
        System.out.println("  Admins: " + group.getAdmins().size());
        System.out.println("  Members: " + group.getParticipantCount());
        
        // Update group metadata
        chatService.updateGroupMetadata(groupId, "Friends Forever 🎉", 
            "Best friends group!", "https://example.com/group.jpg", alice);
        System.out.println("\nUpdated group name to: " + group.getName());
        
        // Send group messages
        ChatId groupChatId = groupId.toChatId();
        chatService.sendMessage(groupChatId, alice, 
            new MessageContent("Welcome to the group everyone!"));
        chatService.sendMessage(groupChatId, bob,
            new MessageContent("Thanks Alice! Excited to be here!"));
        chatService.sendMessage(groupChatId, charlie,
            new MessageContent("Hello everyone! 👋"));
        chatService.sendMessage(groupChatId, diana,
            new MessageContent("Hey team!"));
        
        System.out.println("\nGroup chat messages:");
        List<Message> groupMessages = chatService.getMessages(groupChatId);
        for (Message msg : groupMessages) {
            User sender = userService.getUser(msg.getSenderId()).get();
            String content = msg.getContent().getText().orElse("[Media]");
            String status = msg.getStatus().getSymbol();
            System.out.println("  " + sender.getName() + ": " + content + " " + status);
        }
        
        // Promote member to admin
        chatService.promoteToAdmin(groupId, bob, alice);
        System.out.println("\nBob promoted to admin");
        System.out.println("Current admins: " + group.getAdmins().size());
        
        // Add new participant
        UserId eve = userService.registerUser("Eve", PhoneNumber.of("+9876543210"));
        chatService.addParticipant(groupId, eve, alice);
        System.out.println("\nEve added to the group");
        System.out.println("Total members: " + group.getParticipantCount());
        
        // Charlie leaves group
        chatService.leaveGroup(groupId, charlie);
        System.out.println("\nCharlie left the group");
        System.out.println("Remaining members: " + group.getParticipantCount());
        System.out.println();
    }
    
    private static void demonstrateMessageFeatures(UserService userService, 
                                                    ChatService chatService) {
        System.out.println("--- Demo 4: Message Features ---");
        
        UserId alice = userService.getUserByPhoneNumber(PhoneNumber.of("+1234567890")).get().getId();
        UserId bob = userService.getUserByPhoneNumber(PhoneNumber.of("+0987654321")).get().getId();
        UserId diana = userService.getUserByPhoneNumber(PhoneNumber.of("+5544332211")).get().getId();
        
        ChatId aliceBobChat = chatService.createDirectChat(alice, bob);
        ChatId aliceDianaChat = chatService.createDirectChat(alice, diana);
        
        // Reply to message
        MessageId originalMsg = chatService.sendMessage(aliceBobChat, bob,
            new MessageContent("What time is the meeting?"));
        MessageId replyMsg = chatService.replyToMessage(aliceBobChat, alice,
            new MessageContent("It's at 3 PM"), originalMsg);
        
        Message reply = chatService.getMessage(replyMsg).get();
        System.out.println("Reply sent:");
        System.out.println("  Original: What time is the meeting?");
        System.out.println("  Reply: " + reply.getContent().getText().get());
        System.out.println("  Is reply: " + reply.isReply());
        
        // Forward message
        MessageId fwdMsg = chatService.forwardMessage(aliceDianaChat, originalMsg, alice);
        Message forwarded = chatService.getMessage(fwdMsg).get();
        System.out.println("\nMessage forwarded to Diana");
        System.out.println("  Is forwarded: " + forwarded.isForwarded());
        
        // Star message
        chatService.starMessage(originalMsg, alice);
        System.out.println("\nAlice starred a message");
        List<Message> starred = chatService.getStarredMessages(alice);
        System.out.println("Alice's starred messages: " + starred.size());
        
        // Send media message
        Attachment photo = new Attachment("vacation.jpg", "image/jpeg", 
            2048576, "https://example.com/photos/vacation.jpg");
        MessageId mediaMsg = chatService.sendMessage(aliceBobChat, alice,
            new MessageContent("Check out this photo!", photo));
        
        Message media = chatService.getMessage(mediaMsg).get();
        System.out.println("\nMedia message sent:");
        System.out.println("  Type: " + media.getType());
        System.out.println("  Has text: " + media.getContent().hasText());
        System.out.println("  Has attachment: " + media.getContent().hasAttachment());
        if (media.getContent().hasAttachment()) {
            Attachment att = media.getContent().getAttachment().get();
            System.out.println("  File: " + att.getFileName() + 
                             " (" + att.getFormattedSize() + ")");
        }
        
        // Search messages
        chatService.sendMessage(aliceBobChat, bob, 
            new MessageContent("Let's meet for coffee tomorrow"));
        chatService.sendMessage(aliceBobChat, alice,
            new MessageContent("Great! Coffee at the usual place?"));
        
        List<Message> searchResults = chatService.searchMessages(aliceBobChat, "coffee");
        System.out.println("\nSearch results for 'coffee': " + searchResults.size() + " messages");
        for (Message msg : searchResults) {
            User sender = userService.getUser(msg.getSenderId()).get();
            System.out.println("  " + sender.getName() + ": " + 
                             msg.getContent().getText().get());
        }
        
        // Delete message
        MessageId toDelete = chatService.sendMessage(aliceBobChat, alice,
            new MessageContent("Oops, typo!"));
        chatService.deleteMessage(toDelete, alice);
        Message deleted = chatService.getMessage(toDelete).get();
        System.out.println("\nMessage deleted:");
        System.out.println("  Is deleted: " + deleted.isDeleted());
        System.out.println("  Status: " + deleted.getStatus());
        System.out.println();
    }
    
    private static void demonstrateRealTimeFeatures(UserService userService,
                                                     ChatService chatService) {
        System.out.println("--- Demo 5: Real-time Features ---");
        
        UserId alice = userService.getUserByPhoneNumber(PhoneNumber.of("+1234567890")).get().getId();
        UserId bob = userService.getUserByPhoneNumber(PhoneNumber.of("+0987654321")).get().getId();
        
        // Online status
        System.out.println("User status:");
        System.out.println("  Alice: " + userService.getUserStatus(alice));
        System.out.println("  Bob: " + userService.getUserStatus(bob));
        
        userService.goOffline(alice);
        System.out.println("\nAlice went offline");
        System.out.println("  Alice status: " + userService.getUserStatus(alice));
        System.out.println("  Last seen: " + 
            userService.getLastSeen(alice).format(TIME_FORMATTER));
        
        // Typing indicators
        ChatId chatId = chatService.getUserChats(alice).get(0).getId();
        chatService.setTyping(chatId, bob, true);
        System.out.println("\nBob is typing...");
        
        Set<UserId> typingUsers = chatService.getTypingUsers(chatId);
        System.out.println("Typing users: " + typingUsers.size());
        for (UserId userId : typingUsers) {
            User user = userService.getUser(userId).get();
            System.out.println("  " + user.getName() + " is typing...");
        }
        
        chatService.setTyping(chatId, bob, false);
        System.out.println("\nBob stopped typing");
        System.out.println("Typing users: " + chatService.getTypingUsers(chatId).size());
        
        // Blocking
        UserId diana = userService.getUserByPhoneNumber(PhoneNumber.of("+5544332211")).get().getId();
        userService.blockUser(alice, diana);
        System.out.println("\nAlice blocked Diana");
        System.out.println("Is Diana blocked: " + userService.isBlocked(alice, diana));
        System.out.println("Alice's blocked users: " + 
            userService.getBlockedUsers(alice).size());
        
        userService.unblockUser(alice, diana);
        System.out.println("\nAlice unblocked Diana");
        System.out.println("Is Diana blocked: " + userService.isBlocked(alice, diana));
        
        // Chat list
        System.out.println("\nAlice's chats:");
        List<Chat> aliceChats = chatService.getUserChats(alice);
        for (Chat chat : aliceChats) {
            String displayName = chat.getDisplayName(alice);
            int unread = chat.getUnreadCount(alice);
            Message lastMsg = chat.getLastMessage();
            String lastMsgPreview = lastMsg != null ? 
                lastMsg.getContent().getText().orElse("[Media]") : "No messages";
            
            System.out.println("  " + chat.getType() + ": " + displayName);
            System.out.println("    Last message: " + lastMsgPreview);
            System.out.println("    Unread: " + unread);
        }
        System.out.println();
    }
}

