package com.you.lld.problems.whatsapp;

import com.you.lld.problems.whatsapp.model.Chat;
import com.you.lld.problems.whatsapp.model.ChatId;
import com.you.lld.problems.whatsapp.model.GroupId;
import com.you.lld.problems.whatsapp.model.Message;
import com.you.lld.problems.whatsapp.model.MessageContent;
import com.you.lld.problems.whatsapp.model.MessageId;
import com.you.lld.problems.whatsapp.model.PhoneNumber;
import com.you.lld.problems.whatsapp.model.User;
import com.you.lld.problems.whatsapp.model.UserId;
import com.you.lld.problems.whatsapp.model.UserStatus;
import com.you.lld.problems.whatsapp.service.ChatService;
import com.you.lld.problems.whatsapp.service.UserService;
import com.you.lld.problems.whatsapp.service.impl.InMemoryChatService;
import com.you.lld.problems.whatsapp.service.impl.InMemoryUserService;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

/** Facade for messaging — users, direct/group chats, delivery status. */
public class WhatsApp {
    private final UserService users;
    private final ChatService chats;

    public WhatsApp() {
        this.users = new InMemoryUserService();
        this.chats = new InMemoryChatService();
    }

    public WhatsApp(UserService users, ChatService chats) {
        this.users = users;
        this.chats = chats;
    }

    public UserId registerUser(String name, PhoneNumber phone) {
        return users.registerUser(name, phone);
    }

    public void goOnline(UserId userId) {
        users.goOnline(userId);
    }

    public UserStatus getUserStatus(UserId userId) {
        return users.getUserStatus(userId);
    }

    public ChatId createDirectChat(UserId user1, UserId user2) {
        return chats.createDirectChat(user1, user2);
    }

    public GroupId createGroup(String name, Set<UserId> members, UserId admin) {
        return chats.createGroup(name, members, admin);
    }

    public MessageId sendMessage(ChatId chatId, UserId sender, MessageContent content) {
        return chats.sendMessage(chatId, sender, content);
    }

    public void markRead(MessageId messageId, UserId reader) {
        chats.markRead(messageId, reader);
    }

    public List<Message> getMessages(ChatId chatId) {
        return chats.getMessages(chatId);
    }

    public List<Chat> getUserChats(UserId userId) {
        return chats.getUserChats(userId);
    }

    public LocalDateTime getLastSeen(UserId userId) {
        return users.getLastSeen(userId);
    }
}
