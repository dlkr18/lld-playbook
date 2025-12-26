package com.you.lld.problems.cricinfo.model;

public class Player {
    private final String id;
    private final String name;
    private final String country;
    private final PlayerRole role;
    private int runs;
    private int wickets;
    private int matches;
    
    public Player(String id, String name, String country, PlayerRole role) {
        this.id = id;
        this.name = name;
        this.country = country;
        this.role = role;
        this.runs = 0;
        this.wickets = 0;
        this.matches = 0;
    }
    
    public void addRuns(int runs) { this.runs += runs; }
    public void addWicket() { this.wickets++; }
    public void incrementMatches() { this.matches++; }
    
    public String getId() { return id; }
    public String getName() { return name; }
    public String getCountry() { return country; }
    public PlayerRole getRole() { return role; }
    public int getRuns() { return runs; }
    public int getWickets() { return wickets; }
    public int getMatches() { return matches; }
    
    @Override
    public String toString() {
        return name + " (" + country + ") - " + role;
    }
}
