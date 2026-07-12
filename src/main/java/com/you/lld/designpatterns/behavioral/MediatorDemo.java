package com.you.lld.designpatterns.behavioral;

import java.util.ArrayList;
import java.util.List;

/**
 * Mediator — colleagues talk through a central hub instead of referencing each other directly.
 * Reduces M:N coupling to M:1 + 1:N.
 * Use cases: chat room, air traffic control, UI form (dialogs coordinating widgets), event bus.
 */
public class MediatorDemo {

    interface ChatMediator {
        void register(User u);
        void send(String from, String msg);
    }

    static class ChatRoom implements ChatMediator {
        private final List<User> users = new ArrayList<User>();
        public void register(User u) { users.add(u); u.setRoom(this); }
        public void send(String from, String msg) {
            for (User u : users) if (!u.name.equals(from)) u.receive(from, msg);
        }
    }

    static class User {
        final String name;
        private ChatMediator room;
        User(String name) { this.name = name; }
        void setRoom(ChatMediator r) { this.room = r; }
        void send(String msg) { room.send(name, msg); }
        void receive(String from, String msg) {
            System.out.println("[" + name + "] " + from + ": " + msg);
        }
    }

    public static void main(String[] args) {
        ChatRoom room = new ChatRoom();
        User a = new User("alice");
        User b = new User("bob");
        User c = new User("carol");
        room.register(a); room.register(b); room.register(c);
        a.send("hi everyone");
        b.send("hey alice");
    }
}
