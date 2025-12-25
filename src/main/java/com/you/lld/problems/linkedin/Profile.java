package com.you.lld.problems.linkedin;
import java.util.*;

public class Profile {
    private final String userId;
    private String name;
    private String headline;
    private List<String> skills;
    private Set<String> connections;
    
    public Profile(String userId, String name) {
        this.userId = userId;
        this.name = name;
        this.skills = new ArrayList<>();
        this.connections = new HashSet<>();
    }
    
    public String getUserId() { return userId; }
    public String getName() { return name; }
    public void addSkill(String skill) { skills.add(skill); }
    public void addConnection(String profileId) { connections.add(profileId); }
    public Set<String> getConnections() { return new HashSet<>(connections); }
}
