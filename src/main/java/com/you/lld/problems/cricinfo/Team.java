package com.you.lld.problems.cricinfo;
import java.util.*;

public class Team {
    private final String teamId;
    private String name;
    private List<String> players;
    
    public Team(String teamId, String name) {
        this.teamId = teamId;
        this.name = name;
        this.players = new ArrayList<>();
    }
    
    public String getTeamId() { return teamId; }
    public String getName() { return name; }
    public void addPlayer(String playerId) { players.add(playerId); }
}
