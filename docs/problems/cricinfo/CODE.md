# cricinfo - Complete Implementation

> Generated from `src/main/java/com/you/lld/problems/cricinfo/` on 2026-11-07. Re-run `python3 scripts/generate-code-md.py cricinfo`.

## Project Structure (12 files)

```
cricinfo/
├── CricinfoDemo.java
├── Cricinfo.java
├── model/Ball.java
├── model/DeliveryType.java
├── model/Innings.java
├── model/Match.java
├── model/MatchStatus.java
├── model/Player.java
├── model/PlayerRole.java
├── model/Team.java
├── service/CricinfoService.java
├── service/impl/CricinfoServiceImpl.java
```

## Source Code

### `CricinfoDemo.java`

<details>
<summary>Click to view CricinfoDemo.java</summary>

```java
package com.you.lld.problems.cricinfo;

import com.you.lld.problems.cricinfo.model.DeliveryType;
import com.you.lld.problems.cricinfo.model.Innings;
import com.you.lld.problems.cricinfo.model.Match;
import com.you.lld.problems.cricinfo.model.PlayerRole;

/**
 * SDE3 demo: teams, match lifecycle, ball-by-ball scoring, derived scorecard.
 */
public class CricinfoDemo {

    public static void main(String[] args) {
        System.out.println("=== Cricinfo (SDE3) ===\n");
        Cricinfo cricinfo = new Cricinfo();

        // 1. Teams + squads
        System.out.println("--- 1. Teams ---");
        String india = cricinfo.createTeam("India", "India");
        String aus = cricinfo.createTeam("Australia", "Australia");
        String kohli = cricinfo.addPlayer(india, "Virat Kohli", "India", PlayerRole.BATSMAN);
        String smith = cricinfo.addPlayer(aus, "Steve Smith", "Australia", PlayerRole.BATSMAN);
        String starc = cricinfo.addPlayer(aus, "Mitchell Starc", "Australia", PlayerRole.BOWLER);
        String bumrah = cricinfo.addPlayer(india, "Jasprit Bumrah", "India", PlayerRole.BOWLER);
        System.out.println("Squads registered");

        // 2. Schedule + start
        System.out.println("\n--- 2. Match lifecycle ---");
        String matchId = cricinfo.scheduleMatch(india, aus, "MCG");
        cricinfo.startMatch(matchId);
        Match match = cricinfo.getMatch(matchId);
        System.out.println("Status after start: " + match.getStatus());

        // 3. Ball-by-ball — the score is DERIVED from these, never set directly
        System.out.println("\n--- 3. First innings, ball by ball ---");
        cricinfo.startInnings(matchId, india);
        cricinfo.recordBall(matchId, starc, kohli, 4, false);
        cricinfo.recordBall(matchId, starc, kohli, 1, false);
        cricinfo.recordBall(matchId, starc, kohli, 0, false);
        cricinfo.recordBall(matchId, starc, kohli, 2, false, DeliveryType.WIDE);
        cricinfo.recordBall(matchId, starc, kohli, 6, false);
        cricinfo.recordBall(matchId, starc, kohli, 0, true);
        Innings first = match.currentInnings();
        System.out.println("  " + first);
        System.out.println("  legal balls bowled: " + first.getLegalBalls()
                + "  (the wide did not advance the over)");
        System.out.println("  Kohli off the bat: " + first.runsFor(first.getBalls().get(0).getBatsman())
                + ", extras: " + first.getExtras()
                + ", Starc wickets: " + first.wicketsFor(first.getBalls().get(0).getBowler()));
        System.out.println("  team total " + first.getRuns() + " = 11 off the bat + 3 extras"
                + "  (individual scores never sum to the team total)");

        // 4. Guards
        System.out.println("\n--- 4. Guards ---");
        try {
            cricinfo.endMatch(matchId, cricinfo.createTeam("England", "England"));
        } catch (IllegalArgumentException e) {
            System.out.println("  Third-team win blocked: " + e.getMessage());
        }
        try {
            cricinfo.recordBall(matchId, starc, kohli, 0, true, DeliveryType.WIDE);
        } catch (IllegalArgumentException e) {
            System.out.println("  Wicket off a wide blocked: " + e.getMessage());
        }

        // 5. Result
        System.out.println("\n--- 5. Result ---");
        cricinfo.endMatch(matchId, india);
        System.out.println("  Winner: India, status=" + cricinfo.getMatch(matchId).getStatus()
                + ", India " + match.getTeam1Score() + " (derived from " + first.getBalls().size() + " balls)");

        System.out.println("\n--- 6. State guards ---");
        try {
            cricinfo.startMatch(matchId);
        } catch (IllegalStateException e) {
            System.out.println("  Re-start blocked: " + e.getMessage());
        }

        System.out.println("\n=== Demo complete ===");
    }
}
```

</details>

### `Cricinfo.java`

<details>
<summary>Click to view Cricinfo.java</summary>

```java
package com.you.lld.problems.cricinfo;

import com.you.lld.problems.cricinfo.model.Ball;
import com.you.lld.problems.cricinfo.model.DeliveryType;
import com.you.lld.problems.cricinfo.model.Innings;
import com.you.lld.problems.cricinfo.model.Match;
import com.you.lld.problems.cricinfo.model.PlayerRole;
import com.you.lld.problems.cricinfo.service.CricinfoService;
import com.you.lld.problems.cricinfo.service.impl.CricinfoServiceImpl;

import java.util.List;

/** Facade for cricket scores — teams, matches, live score updates (Observer-ready). */
public class Cricinfo {
    private final CricinfoService service;

    public Cricinfo() {
        this(new CricinfoServiceImpl());
    }

    public Cricinfo(CricinfoService service) {
        this.service = service;
    }

    public String createTeam(String name, String country) {
        return service.createTeam(name, country);
    }

    public String addPlayer(String teamId, String name, String country, PlayerRole role) {
        return service.addPlayer(teamId, name, country, role);
    }

    public String scheduleMatch(String team1Id, String team2Id, String venue) {
        return service.scheduleMatch(team1Id, team2Id, venue);
    }

    public void startMatch(String matchId) {
        service.startMatch(matchId);
    }

    public Innings startInnings(String matchId, String battingTeamId) {
        return service.startInnings(matchId, battingTeamId);
    }

    /** An ordinary legal delivery. */
    public Ball recordBall(String matchId, String bowlerId, String batsmanId, int runs, boolean wicket) {
        return service.recordBall(matchId, bowlerId, batsmanId, runs, wicket, DeliveryType.LEGAL);
    }

    public Ball recordBall(String matchId, String bowlerId, String batsmanId,
                           int runs, boolean wicket, DeliveryType type) {
        return service.recordBall(matchId, bowlerId, batsmanId, runs, wicket, type);
    }

    public void endMatch(String matchId, String winnerId) {
        service.endMatch(matchId, winnerId);
    }

    public Match getMatch(String matchId) {
        return service.getMatch(matchId);
    }

    public List<Match> getAllMatches() {
        return service.getAllMatches();
    }
}
```

</details>

### `model/Ball.java`

<details>
<summary>Click to view model/Ball.java</summary>

```java
package com.you.lld.problems.cricinfo.model;

/**
 * One delivery — the atomic scoring event.
 *
 * <p>Immutable: a ball that has been bowled cannot change. Everything above it
 * ({@link Innings} runs, wickets, overs; player statistics) is <b>derived</b> from
 * the sequence of balls rather than stored alongside it, so the two can never
 * disagree.
 */
public final class Ball {

    private final int overNumber;
    private final int ballNumber;
    private final Player bowler;
    private final Player batsman;
    private final int runs;
    private final boolean wicket;
    private final DeliveryType type;

    public Ball(int overNumber, int ballNumber, Player bowler, Player batsman,
                int runs, boolean wicket, DeliveryType type) {
        if (runs < 0) {
            throw new IllegalArgumentException("Runs cannot be negative");
        }
        if (type == null) {
            throw new IllegalArgumentException("Delivery type required");
        }
        if (wicket && !type.canTakeWicket()) {
            throw new IllegalArgumentException("A batsman cannot be dismissed off a " + type);
        }
        this.overNumber = overNumber;
        this.ballNumber = ballNumber;
        this.bowler = bowler;
        this.batsman = batsman;
        this.runs = runs;
        this.wicket = wicket;
        this.type = type;
    }

    /** Convenience for an ordinary legal delivery. */
    public static Ball legal(int overNumber, int ballNumber, Player bowler, Player batsman,
                             int runs, boolean wicket) {
        return new Ball(overNumber, ballNumber, bowler, batsman, runs, wicket, DeliveryType.LEGAL);
    }

    /** Runs credited to the batting side, including the penalty run for an extra. */
    public int totalRuns() {
        return runs + type.penaltyRuns();
    }

    public boolean countsTowardOver() {
        return type.countsTowardOver();
    }

    public int getOverNumber() {
        return overNumber;
    }

    public int getBallNumber() {
        return ballNumber;
    }

    public Player getBowler() {
        return bowler;
    }

    public Player getBatsman() {
        return batsman;
    }

    public int getRuns() {
        return runs;
    }

    public boolean isWicket() {
        return wicket;
    }

    public DeliveryType getType() {
        return type;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder()
                .append(overNumber).append('.').append(ballNumber)
                .append(": ").append(batsman.getName())
                .append(" scored ").append(totalRuns());
        if (type != DeliveryType.LEGAL) {
            sb.append(" (").append(type).append(')');
        }
        if (wicket) {
            sb.append(" (OUT!)");
        }
        return sb.toString();
    }
}
```

</details>

### `model/DeliveryType.java`

<details>
<summary>Click to view model/DeliveryType.java</summary>

```java
package com.you.lld.problems.cricinfo.model;

/**
 * Delivery kinds, and the two cricket rules that follow from them.
 *
 * <p>Encoding "does this count toward the over" and "does it concede a penalty
 * run" on the enum keeps those rules in one place instead of scattering
 * {@code if (type == WIDE)} through the scoring code.
 */
public enum DeliveryType {
    /** An ordinary delivery: counts toward the over, no penalty. */
    LEGAL(true, 0, true),
    /** Wide: does not count toward the over, concedes one run, no dismissal off it. */
    WIDE(false, 1, false),
    /** No-ball: does not count toward the over, concedes one run, batsman not out. */
    NO_BALL(false, 1, false),
    /** Bye/leg-bye: a legal delivery; runs are recorded but not credited to the batsman. */
    BYE(true, 0, true);

    private final boolean countsTowardOver;
    private final int penaltyRuns;
    private final boolean canTakeWicket;

    DeliveryType(boolean countsTowardOver, int penaltyRuns, boolean canTakeWicket) {
        this.countsTowardOver = countsTowardOver;
        this.penaltyRuns = penaltyRuns;
        this.canTakeWicket = canTakeWicket;
    }

    public boolean countsTowardOver() {
        return countsTowardOver;
    }

    public int penaltyRuns() {
        return penaltyRuns;
    }

    public boolean canTakeWicket() {
        return canTakeWicket;
    }
}
```

</details>

### `model/Innings.java`

<details>
<summary>Click to view model/Innings.java</summary>

```java
package com.you.lld.problems.cricinfo.model;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * One team's batting innings, as an append-only sequence of {@link Ball}s.
 *
 * <p><b>Every statistic here is derived, never stored.</b> Runs, wickets and overs
 * are computed from the ball list, so there is no possibility of the scoreboard
 * disagreeing with the ball-by-ball record — which is exactly the bug that a
 * mutable {@code setScore(team, runs)} invites.
 *
 * <p>Not thread-safe on its own: mutation goes through {@link Match}, which holds
 * the monitor.
 */
public final class Innings {

    public static final int ALL_OUT_WICKETS = 10;
    private static final int BALLS_PER_OVER = 6;

    private final Team battingTeam;
    private final Team bowlingTeam;
    private final int maxOvers;
    private final List<Ball> balls = new ArrayList<Ball>();

    public Innings(Team battingTeam, Team bowlingTeam, int maxOvers) {
        if (battingTeam == null || bowlingTeam == null) {
            throw new IllegalArgumentException("Both teams required");
        }
        if (battingTeam.equals(bowlingTeam)) {
            throw new IllegalArgumentException("A team cannot bowl to itself");
        }
        if (maxOvers <= 0) {
            throw new IllegalArgumentException("maxOvers must be positive");
        }
        this.battingTeam = battingTeam;
        this.bowlingTeam = bowlingTeam;
        this.maxOvers = maxOvers;
    }

    public void record(Ball ball) {
        if (isComplete()) {
            throw new IllegalStateException("Innings is already complete ("
                    + getWickets() + " wickets, " + oversText() + " overs)");
        }
        balls.add(ball);
    }

    /** Total runs off the bat plus extras. */
    public int getRuns() {
        int total = 0;
        for (Ball b : balls) {
            total += b.totalRuns();
        }
        return total;
    }

    public int getWickets() {
        int total = 0;
        for (Ball b : balls) {
            if (b.isWicket()) {
                total++;
            }
        }
        return total;
    }

    /** Wides and no-balls are re-bowled, so they do not advance the over. */
    public int getLegalBalls() {
        int total = 0;
        for (Ball b : balls) {
            if (b.countsTowardOver()) {
                total++;
            }
        }
        return total;
    }

    public int getCompletedOvers() {
        return getLegalBalls() / BALLS_PER_OVER;
    }

    public int getBallsIntoCurrentOver() {
        return getLegalBalls() % BALLS_PER_OVER;
    }

    /** Cricket's "12.4" notation: completed overs, then balls into the current one. */
    public String oversText() {
        return getCompletedOvers() + "." + getBallsIntoCurrentOver();
    }

    public boolean isComplete() {
        return getWickets() >= ALL_OUT_WICKETS || getCompletedOvers() >= maxOvers;
    }

    /** Runs per over — the number every commentator quotes. */
    public double getRunRate() {
        int legal = getLegalBalls();
        return legal == 0 ? 0.0 : (getRuns() * (double) BALLS_PER_OVER) / legal;
    }

    /**
     * Runs credited to the batsman personally.
     *
     * <p>Extras are runs to the <em>team</em>, not to the batsman: byes/leg-byes
     * were never hit, and runs off a wide are by definition not off the bat. Only
     * a legal delivery or a no-ball (which can be hit) scores for the batsman —
     * which is why a team total and the sum of individual scores differ.
     */
    public int runsFor(Player batsman) {
        int total = 0;
        for (Ball b : balls) {
            boolean offTheBat = b.getType() == DeliveryType.LEGAL || b.getType() == DeliveryType.NO_BALL;
            if (offTheBat && b.getBatsman().equals(batsman)) {
                total += b.getRuns();
            }
        }
        return total;
    }

    /** Runs that went to the team but not to any batsman — wides, no-ball penalties, byes. */
    public int getExtras() {
        int total = 0;
        for (Ball b : balls) {
            total += b.getType().penaltyRuns();
            if (b.getType() == DeliveryType.BYE || b.getType() == DeliveryType.WIDE) {
                total += b.getRuns();
            }
        }
        return total;
    }

    public int wicketsFor(Player bowler) {
        int total = 0;
        for (Ball b : balls) {
            if (b.isWicket() && b.getBowler().equals(bowler)) {
                total++;
            }
        }
        return total;
    }

    public Team getBattingTeam() {
        return battingTeam;
    }

    public Team getBowlingTeam() {
        return bowlingTeam;
    }

    public int getMaxOvers() {
        return maxOvers;
    }

    public List<Ball> getBalls() {
        return Collections.unmodifiableList(balls);
    }

    @Override
    public String toString() {
        return battingTeam.getName() + " " + getRuns() + "/" + getWickets()
                + " (" + oversText() + " ov, RR " + String.format("%.2f", getRunRate()) + ")";
    }
}
```

</details>

### `model/Match.java`

<details>
<summary>Click to view model/Match.java</summary>

```java
package com.you.lld.problems.cricinfo.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * A limited-overs match: two innings, each an append-only sequence of balls.
 *
 * <p>Scores are <b>derived from the innings</b>, not stored. The previous version
 * kept {@code team1Score} / {@code team2Score} as bare ints with a
 * {@code setScore(team, runs)} setter, which meant the "score" was whatever the
 * last caller happened to pass and had no relationship to the balls bowled.
 *
 * <p>Mutating methods are {@code synchronized}: live scoring arrives from a feed
 * while readers render the scorecard.
 */
public class Match {

    public static final int DEFAULT_OVERS = 20;

    private final String id;
    private final Team team1;
    private final Team team2;
    private final String venue;
    private final LocalDateTime startTime;
    private final int oversPerInnings;
    private final List<Innings> innings = new ArrayList<Innings>();

    private MatchStatus status;
    private Team winner;

    public Match(String id, Team team1, Team team2, String venue, LocalDateTime startTime) {
        this(id, team1, team2, venue, startTime, DEFAULT_OVERS);
    }

    public Match(String id, Team team1, Team team2, String venue,
                 LocalDateTime startTime, int oversPerInnings) {
        if (team1 == null || team2 == null) {
            throw new IllegalArgumentException("Both teams required");
        }
        if (team1.equals(team2)) {
            throw new IllegalArgumentException("A team cannot play itself");
        }
        this.id = id;
        this.team1 = team1;
        this.team2 = team2;
        this.venue = venue;
        this.startTime = startTime;
        this.oversPerInnings = oversPerInnings;
        this.status = MatchStatus.SCHEDULED;
    }

    public synchronized void start() {
        this.status = MatchStatus.IN_PROGRESS;
    }

    /** Opens an innings with {@code battingTeam} at the crease. */
    public synchronized Innings startInnings(Team battingTeam) {
        requireParticipant(battingTeam, "bat");
        if (status != MatchStatus.IN_PROGRESS) {
            throw new IllegalStateException("Match is not in progress: " + status);
        }
        if (innings.size() >= 2) {
            throw new IllegalStateException("Both innings have already been played");
        }
        if (!innings.isEmpty() && !currentInnings().isComplete()) {
            throw new IllegalStateException("Current innings is not complete: " + currentInnings());
        }
        Innings next = new Innings(battingTeam, other(battingTeam), oversPerInnings);
        innings.add(next);
        return next;
    }

    public synchronized void recordBall(Ball ball) {
        if (status != MatchStatus.IN_PROGRESS) {
            throw new IllegalStateException("Match is not in progress: " + status);
        }
        if (innings.isEmpty()) {
            throw new IllegalStateException("No innings has been started");
        }
        currentInnings().record(ball);
    }

    public synchronized Innings currentInnings() {
        if (innings.isEmpty()) {
            throw new IllegalStateException("No innings has been started");
        }
        return innings.get(innings.size() - 1);
    }

    /**
     * Ends the match.
     *
     * <p>{@code winner} must be one of the two participants. Previously any team
     * could be passed, and the loser was computed as
     * {@code winner == team1 ? team2 : team1} — so a third team could "win" while
     * team1 was recorded as having lost a match it did not lose.
     */
    public synchronized void end(Team winner) {
        requireParticipant(winner, "win");
        this.status = MatchStatus.COMPLETED;
        this.winner = winner;
        winner.recordWin();
        other(winner).recordLoss();
    }

    /** Ends with no winner — rain, bad light, abandonment. */
    public synchronized void endWithoutResult() {
        this.status = MatchStatus.COMPLETED;
        this.winner = null;
    }

    private void requireParticipant(Team team, String action) {
        if (team == null || (!team.equals(team1) && !team.equals(team2))) {
            throw new IllegalArgumentException(
                    (team == null ? "null" : team.getName()) + " is not playing in this match, so cannot "
                            + action + " it (" + team1.getName() + " v " + team2.getName() + ")");
        }
    }

    private Team other(Team team) {
        return team.equals(team1) ? team2 : team1;
    }

    public synchronized int scoreOf(Team team) {
        requireParticipant(team, "score in");
        int total = 0;
        for (Innings i : innings) {
            if (i.getBattingTeam().equals(team)) {
                total += i.getRuns();
            }
        }
        return total;
    }

    public String getId() {
        return id;
    }

    public Team getTeam1() {
        return team1;
    }

    public Team getTeam2() {
        return team2;
    }

    public String getVenue() {
        return venue;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public int getOversPerInnings() {
        return oversPerInnings;
    }

    public synchronized MatchStatus getStatus() {
        return status;
    }

    public synchronized Team getWinner() {
        return winner;
    }

    public synchronized int getTeam1Score() {
        return scoreOf(team1);
    }

    public synchronized int getTeam2Score() {
        return scoreOf(team2);
    }

    public synchronized List<Innings> getInnings() {
        return Collections.unmodifiableList(new ArrayList<Innings>(innings));
    }

    @Override
    public synchronized String toString() {
        return team1.getName() + " vs " + team2.getName() + " at " + venue + " - " + status;
    }
}
```

</details>

### `model/MatchStatus.java`

<details>
<summary>Click to view model/MatchStatus.java</summary>

```java
package com.you.lld.problems.cricinfo.model;

public enum MatchStatus {
    SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED
}
```

</details>

### `model/Player.java`

<details>
<summary>Click to view model/Player.java</summary>

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

</details>

### `model/PlayerRole.java`

<details>
<summary>Click to view model/PlayerRole.java</summary>

```java
package com.you.lld.problems.cricinfo.model;

public enum PlayerRole {
    BATSMAN, BOWLER, ALL_ROUNDER, WICKET_KEEPER
}
```

</details>

### `model/Team.java`

<details>
<summary>Click to view model/Team.java</summary>

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

</details>

### `service/CricinfoService.java`

<details>
<summary>Click to view service/CricinfoService.java</summary>

```java
package com.you.lld.problems.cricinfo.service;

import com.you.lld.problems.cricinfo.model.*;
import java.util.List;

public interface CricinfoService {
    String createTeam(String name, String country);
    String addPlayer(String teamId, String name, String country, PlayerRole role);
    String scheduleMatch(String team1Id, String team2Id, String venue);
    void startMatch(String matchId);
    void endMatch(String matchId, String winnerId);

    /** Opens an innings with the given team batting. */
    Innings startInnings(String matchId, String battingTeamId);

    /**
     * Records one delivery. This is the ONLY way runs enter the system — the
     * scoreboard is derived from the balls, so the two cannot disagree.
     */
    Ball recordBall(String matchId, String bowlerId, String batsmanId,
                    int runs, boolean wicket, DeliveryType type);
    Match getMatch(String matchId);
    List<Match> getAllMatches();
}
```

</details>

### `service/impl/CricinfoServiceImpl.java`

<details>
<summary>Click to view service/impl/CricinfoServiceImpl.java</summary>

```java
package com.you.lld.problems.cricinfo.service.impl;

import com.you.lld.problems.cricinfo.service.CricinfoService;
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
        return matchId;
    }
    
    @Override
    public void startMatch(String matchId) {
        Match match = matches.get(matchId);
        if (match == null) {
            throw new IllegalArgumentException("Match not found: " + matchId);
        }
        if (match.getStatus() != MatchStatus.SCHEDULED) {
            throw new IllegalStateException("Cannot start match -- current status: " + match.getStatus());
        }
        match.start();
    }
    
    @Override
    public void endMatch(String matchId, String winnerId) {
        Match match = matches.get(matchId);
        if (match == null) {
            throw new IllegalArgumentException("Match not found: " + matchId);
        }
        if (match.getStatus() != MatchStatus.IN_PROGRESS) {
            throw new IllegalStateException("Cannot end match -- current status: " + match.getStatus());
        }
        Team winner = teams.get(winnerId);
        if (winner == null) {
            throw new IllegalArgumentException("Team not found: " + winnerId);
        }
        match.end(winner);
    }
    
    @Override
    public Innings startInnings(String matchId, String battingTeamId) {
        Match match = requireMatch(matchId);
        Team batting = requireTeam(battingTeamId);
        return match.startInnings(batting);
    }

    @Override
    public Ball recordBall(String matchId, String bowlerId, String batsmanId,
                           int runs, boolean wicket, DeliveryType type) {
        Match match = requireMatch(matchId);
        Player bowler = requirePlayer(bowlerId);
        Player batsman = requirePlayer(batsmanId);

        // Ball numbering is derived from the innings so far, not passed in by the
        // caller — otherwise the over count is whatever the client claims it is.
        Innings innings = match.currentInnings();
        int over = innings.getCompletedOvers();
        int ballInOver = innings.getBallsIntoCurrentOver() + 1;

        Ball ball = new Ball(over, ballInOver, bowler, batsman, runs, wicket, type);
        match.recordBall(ball);
        return ball;
    }

    private Match requireMatch(String matchId) {
        Match match = matches.get(matchId);
        if (match == null) {
            throw new IllegalArgumentException("Match not found: " + matchId);
        }
        return match;
    }

    private Team requireTeam(String teamId) {
        Team team = teams.get(teamId);
        if (team == null) {
            throw new IllegalArgumentException("Team not found: " + teamId);
        }
        return team;
    }

    private Player requirePlayer(String playerId) {
        Player player = players.get(playerId);
        if (player == null) {
            throw new IllegalArgumentException("Player not found: " + playerId);
        }
        return player;
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

</details>

## Run Demo

```bash
mvn -q compile exec:java -Dexec.mainClass="com.you.lld.problems.cricinfo.CricinfoDemo"
```
