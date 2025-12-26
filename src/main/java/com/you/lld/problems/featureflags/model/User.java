package com.you.lld.problems.featureflags.model;

public class User {
    private final String id;
    private final String email;
    private final String group;
    
    public User(String id, String email, String group) {
        this.id = id;
        this.email = email;
        this.group = group;
    }
    
    public String getId() { return id; }
    public String getGroup() { return group; }
}
