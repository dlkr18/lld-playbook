package com.you.lld.problems.linkedin.model;
public class Skill {
    private final String name;
    private int endorsements;
    
    public Skill(String name) {
        this.name = name;
        this.endorsements = 0;
    }
    
    public String getName() { return name; }
    public int getEndorsements() { return endorsements; }
    public void endorse() { endorsements++; }
}