# cricinfo - Complete Implementation

## 📁 Project Structure (12 files)

```
cricinfo/
├── Cricinfo.java
├── Demo.java
├── Match.java
├── Team.java
├── api/CricinfoService.java
├── impl/CricinfoServiceImpl.java
├── model/Ball.java
├── model/Match.java
├── model/MatchStatus.java
├── model/Player.java
├── model/PlayerRole.java
├── model/Team.java
```

## 📝 Source Code

### 📄 `Cricinfo.java`

```java
package com.you.lld.problems.cricinfo;
import java.util.*;

public class Cricinfo {
    private final Map<String, Match> matches;
    private final Map<String, Team> teams;
    
    public Cricinfo() {
        this.matches = new HashMap<>();
        this.teams = new HashMap<>();
    }
    
    public void addTeam(Team team) {
        teams.put(team.getTeamId(), team);
    }
    
    public void scheduleMatch(Match match) {
        matches.put(match.getMatchId(), match);
    }
    
    public void updateScore(String matchId, String teamId, int runs) {
        Match match = matches.get(matchId);
        if (match != null) {
            match.updateScore(teamId, runs);
        }
    }
    
    public Match getLiveScore(String matchId) {
        return matches.get(matchId);
    }
}
```

### 📄 `Demo.java`

```java
package com.you.lld.problems.cricinfo;
public class Demo { public static void main(String[] args) { System.out.println("Cricinfo"); } }```

### 📄 `Match.java`

```java
package com.you.lld.problems.cricinfo;
import java.time.LocalDateTime;

public class Match {
    public enum MatchStatus { SCHEDULED, LIVE, COMPLETED, ABANDONED }
    
    private final String matchId;
    private final String team1Id;
    private final String team2Id;
    private MatchStatus status;
    private int team1Score;
    private int team2Score;
    private LocalDateTime startTime;
    
    public Match(String matchId, String team1Id, String team2Id) {
        this.matchId = matchId;
        this.team1Id = team1Id;
        this.team2Id = team2Id;
        this.status = MatchStatus.SCHEDULED;
        this.team1Score = 0;
        this.team2Score = 0;
    }
    
    public String getMatchId() { return matchId; }
    public MatchStatus getStatus() { return status; }
    public void setStatus(MatchStatus status) { this.status = status; }
    public void updateScore(String teamId, int runs) {
        if (teamId.equals(team1Id)) team1Score += runs;
        else if (teamId.equals(team2Id)) team2Score += runs;
    }
    public int getTeam1Score() { return team1Score; }
    public int getTeam2Score() { return team2Score; }
}
```

### 📄 `Team.java`

```java
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
```

### 📄 `api/CricinfoService.java`

```java
package com.you.lld.problems.cricinfo.api;

import com.you.lld.problems.cricinfo.model.*;
import java.util.List;

public interface CricinfoService {
    String createTeam(String name, String country);
    String addPlayer(String teamId, String name, String country, PlayerRole role);
    String scheduleMatch(String team1Id, String team2Id, String venue);
    void startMatch(String matchId);
    void endMatch(String matchId, String winnerId);
    Match getMatch(String matchId);
    List<Match> getAllMatches();
}
```

### 📄 `impl/CricinfoServiceImpl.java`

```java
package com.you.lld.problems.cricinfo.impl;

import com.you.lld.problems.cricinfo.api.CricinfoService;
import com.you.lld.problems.cricinfo.model.*;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

public class CricinfoServiceImpl implements CricinfoService {
    private final Map<String, Team> teams = new ConcurrentHashMap<>();
    private final Map<String, Player> players = new ConcurrentHashMap<>();
    private final Map<String, Match> matches = new ConcurrentHashMap<>();
    
    @Override
    public String createTeam(String name, String country) {
        String teamId = UUID.randomUUID().toString();
        Team team = new Team(teamId, name, country);
        teams.put(teamId, team);
        System.out.println("Team created: " + name);
        return teamId;
    }
    
    @Override
    public String addPlayer(String teamId, String name, String country, PlayerRole role) {
        Team team = teams.get(teamId);
        if (team == null) {
            throw new IllegalArgumentException("Team not found");
        }
        
        String playerId = UUID.randomUUID().toString();
        Player player = new Player(playerId, name, country, role);
        players.put(playerId, player);
        team.addPlayer(player);
        System.out.println("Player added: " + name + " to " + team.getName());
        return playerId;
    }
    
    @Override
    public String scheduleMatch(String team1Id, String team2Id, String venue) {
        Team team1 = teams.get(team1Id);
        Team team2 = teams.get(team2Id);
        
        if (team1 == null || team2 == null) {
            throw new IllegalArgumentException("Team not found");
        }
        
        String matchId = UUID.randomUUID().toString();
        Match match = new Match(matchId, team1, team2, venue, LocalDateTime.now().plusDays(1));
        matches.put(matchId, match);
        System.out.println("Match scheduled: " + team1.getName() + " vs " + team2.getName());
        return matchId;
    }
    
    @Override
    public void startMatch(String matchId) {
        Match match = matches.get(matchId);
        if (match != null) {
            match.start();
            System.out.println("Match started: " + match);
        }
    }
    
    @Override
    public void endMatch(String matchId, String winnerId) {
        Match match = matches.get(matchId);
        Team winner = teams.get(winnerId);
        
        if (match != null && winner != null) {
            match.end(winner);
            System.out.println("Match ended. Winner: " + winner.getName());
        }
    }
    
    @Override
    public Match getMatch(String matchId) {
        return matches.get(matchId);
    }
    
    @Override
    public List<Match> getAllMatches() {
        return new ArrayList<>(matches.values());
    }
}
```

### 📄 `model/Ball.java`

```java
package com.you.lld.problems.cricinfo.model;

public class Ball {
    private final int overNumber;
    private final int ballNumber;
    private final Player bowler;
    private final Player batsman;
    private int runs;
    private boolean isWicket;
    
    public Ball(int overNumber, int ballNumber, Player bowler, Player batsman) {
        this.overNumber = overNumber;
        this.ballNumber = ballNumber;
        this.bowler = bowler;
        this.batsman = batsman;
        this.runs = 0;
        this.isWicket = false;
    }
    
    public void setRuns(int runs) { this.runs = runs; }
    public void setWicket(boolean wicket) { this.isWicket = wicket; }
    
    public int getRuns() { return runs; }
    public boolean isWicket() { return isWicket; }
    public Player getBowler() { return bowler; }
    public Player getBatsman() { return batsman; }
    
    @Override
    public String toString() {
        String result = overNumber + "." + ballNumber + ": " + batsman.getName() + " scored " + runs;
        if (isWicket) {
            result += " (OUT!)";
        }
        return result;
    }
}
```

### 📄 `model/Match.java`

```java
package com.you.lld.problems.cricinfo.model;

import java.time.LocalDateTime;

public class Match {
    private final String id;
    private final Team team1;
    private final Team team2;
    private final String venue;
    private final LocalDateTime startTime;
    private MatchStatus status;
    private Team winner;
    private int team1Score;
    private int team2Score;
    
    public Match(String id, Team team1, Team team2, String venue, LocalDateTime startTime) {
        this.id = id;
        this.team1 = team1;
        this.team2 = team2;
        this.venue = venue;
        this.startTime = startTime;
        this.status = MatchStatus.SCHEDULED;
        this.team1Score = 0;
        this.team2Score = 0;
    }
    
    public void start() { this.status = MatchStatus.IN_PROGRESS; }
    
    public void end(Team winner) {
        this.status = MatchStatus.COMPLETED;
        this.winner = winner;
        winner.recordWin();
        Team loser = (winner == team1) ? team2 : team1;
        loser.recordLoss();
    }
    
    public void setScore(Team team, int score) {
        if (team == team1) {
            this.team1Score = score;
        } else if (team == team2) {
            this.team2Score = score;
        }
    }
    
    public String getId() { return id; }
    public Team getTeam1() { return team1; }
    public Team getTeam2() { return team2; }
    public MatchStatus getStatus() { return status; }
    public Team getWinner() { return winner; }
    public int getTeam1Score() { return team1Score; }
    public int getTeam2Score() { return team2Score; }
    
    @Override
    public String toString() {
        return team1.getName() + " vs " + team2.getName() + " at " + venue + " - " + status;
    }
}
```

### 📄 `model/MatchStatus.java`

```java
package com.you.lld.problems.cricinfo.model;

public enum MatchStatus {
    SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED
}
```

### 📄 `model/Player.java`

```java
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
```

### 📄 `model/PlayerRole.java`

```java
package com.you.lld.problems.cricinfo.model;

public enum PlayerRole {
    BATSMAN, BOWLER, ALL_ROUNDER, WICKET_KEEPER
}
```

### 📄 `model/Team.java`

```java
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
```

