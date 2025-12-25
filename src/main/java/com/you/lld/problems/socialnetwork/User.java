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
