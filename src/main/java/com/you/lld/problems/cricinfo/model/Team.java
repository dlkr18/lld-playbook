package com.you.lld.problems.cricinfo.model;

import java.util.*;

public class Team {
    private final String id;
    private final String name;
    private final String country;
    private final List<Player> players;
    private int wins;
    private int losses;
    
    public Team(String id, String name, String country) {
        this.id = id;
        this.name = name;
        this.country = country;
        this.players = new ArrayList<>();
        this.wins = 0;
        this.losses = 0;
    }
    
    public void addPlayer(Player player) {
        if (players.size() < 11) {
            players.add(player);
        }
    }
    
    public void recordWin() { this.wins++; }
    public void recordLoss() { this.losses++; }
    
    public String getId() { return id; }
    public String getName() { return name; }
    public List<Player> getPlayers() { return new ArrayList<>(players); }
    public int getWins() { return wins; }
    public int getLosses() { return losses; }
    
    @Override
    public String toString() {
        return name + " (" + country + ")";
    }
}
