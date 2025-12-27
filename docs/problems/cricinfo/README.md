# Cricinfo Live Cricket Scoring System

## Overview
A real-time cricket match management and scoring system that tracks live matches, player statistics, team standings, and ball-by-ball commentary. Supports match scheduling, score updates, player management, and live scorecard generation for cricket enthusiasts worldwide.

**Difficulty:** Medium-Hard  
**Domain:** Sports, Real-Time Systems  
**Interview Frequency:** High (ESPN, Cricinfo, Dream11, sports apps)

## Requirements

### Functional Requirements
1. **Team Management**
   - Create and manage teams
   - Add players to teams
   - Track team statistics (wins, losses, draws)
   - Manage player roles (Batsman, Bowler, All-rounder, Wicketkeeper)

2. **Match Management**
   - Schedule matches with teams and venue
   - Support different formats (Test, ODI, T20)
   - Track match status (Scheduled, Live, Completed, Abandoned)
   - Determine and record winners

3. **Live Scoring**
   - Ball-by-ball score updates
   - Track runs, wickets, extras
   - Update batting and bowling statistics
   - Calculate run rate, required run rate
   - Track overs and balls

4. **Player Statistics**
   - Batting: runs, balls faced, strike rate, 4s, 6s
   - Bowling: overs, runs conceded, wickets, economy
   - Career statistics aggregation
   - Match performance tracking

5. **Commentary & Updates**
   - Ball-by-ball commentary
   - Key events (wickets, boundaries, milestones)
   - Match highlights
   - Real-time notifications

### Non-Functional Requirements
1. **Real-Time Performance**
   - Score updates propagate < 1 second
   - Support 1M+ concurrent viewers
   - Low latency commentary delivery

2. **Consistency**
   - Accurate score calculation
   - No data loss during updates
   - Atomic score updates

3. **Scalability**
   - Handle multiple simultaneous matches
   - Archive historical match data
   - Efficient querying of statistics

## Class Diagram
![Cricinfo Class Diagram](diagrams/class.png)

## Core Components

### 1. Match Scoring System

#### Score Tracking
```
Match: India vs Australia (ODI)
Venue: Melbourne Cricket Ground
Status: IN_PROGRESS

India: 287/5 (45.3 overs)
- Virat Kohli: 89 (76) - 8×4, 2×6, SR: 117.1
- MS Dhoni: 42* (38) - 3×4, 1×6, SR: 110.5

Australia: Target 288 in 50 overs
Required Run Rate: 5.76

Current Over: 45.3
Last Ball: Kohli hits a boundary! FOUR runs
```

#### Ball-by-Ball Updates
```
Over 45:
45.1 - Kohli defends, no run
45.2 - Kohli drives through covers, FOUR!
45.3 - Kohli pulls, caught at deep square leg, OUT!
45.4 - Dhoni blocks, no run
45.5 - Dhoni flicks for single
45.6 - Hardik hits over mid-on, SIX!
```

### 2. Key Algorithms

#### Update Score (Thread-Safe)
```java
public synchronized void updateScore(String matchId, Ball ball) {
    Match match = matches.get(matchId);
    
    // Update total score
    match.addRuns(ball.getRuns());
    
    // Update batsman stats
    Player batsman = ball.getBatsman();
    batsman.addRuns(ball.getRuns());
    batsman.incrementBalls();
    
    // Update bowler stats
    Player bowler = ball.getBowler();
    bowler.addRunsConceded(ball.getRuns());
    bowler.incrementBallsBowled();
    
    // Check for wicket
    if (ball.isWicket()) {
        match.addWicket();
        batsman.recordOut();
        bowler.addWicket();
    }
    
    // Notify observers
    notifyScoreUpdate(match);
}
```

**Time Complexity:** O(1)  
**Space Complexity:** O(1)

#### Calculate Strike Rate
```java
public double calculateStrikeRate(Player player) {
    int runs = player.getRuns();
    int balls = player.getBallsFaced();
    
    if (balls == 0) return 0.0;
    
    return (runs * 100.0) / balls;
}
```

#### Calculate Economy Rate
```java
public double calculateEconomy(Player bowler) {
    int runsConceded = bowler.getRunsConceded();
    int ballsBowled = bowler.getBallsBowled();
    
    if (ballsBowled == 0) return 0.0;
    
    double overs = ballsBowled / 6.0;
    return runsConceded / overs;
}
```

#### Required Run Rate
```java
public double calculateRequiredRunRate(Match match) {
    int target = match.getTarget();
    int currentScore = match.getCurrentScore();
    double oversRemaining = match.getOversRemaining();
    
    if (oversRemaining == 0) return 0.0;
    
    int runsRequired = target - currentScore;
    return runsRequired / oversRemaining;
}
```

### 3. Match State Management

```java
public class Match {
    private MatchStatus status;
    private Innings currentInnings;
    
    public void start() {
        this.status = MatchStatus.IN_PROGRESS;
        this.currentInnings = new Innings(team1);
    }
    
    public void switchInnings() {
        currentInnings.end();
        currentInnings = new Innings(team2);
    }
    
    public void end(Team winner) {
        this.status = MatchStatus.COMPLETED;
        this.winner = winner;
        winner.recordWin();
    }
}
```

## Design Patterns

### 1. Observer Pattern
**Purpose:** Real-time score updates to clients

```java
interface ScoreObserver {
    void onScoreUpdate(Match match);
    void onWicket(Match match, Player player);
    void onBoundary(Match match, int runs);
}

class CricinfoService {
    private List<ScoreObserver> observers;
    
    public void updateScore(Ball ball) {
        // Update score
        processScore(ball);
        
        // Notify all observers
        notifyObservers(match);
    }
    
    private void notifyObservers(Match match) {
        for (ScoreObserver observer : observers) {
            observer.onScoreUpdate(match);
        }
    }
}
```

### 2. State Pattern
**Purpose:** Manage match states

```java
interface MatchState {
    void startMatch();
    void endInnings();
    void endMatch();
}

class LiveState implements MatchState {
    public void endInnings() {
        // Valid: switch innings
    }
    
    public void endMatch() {
        // Valid: match completed
    }
}

class ScheduledState implements MatchState {
    public void startMatch() {
        // Valid: start match
    }
}
```

### 3. Factory Pattern
**Purpose:** Create different match types

```java
class MatchFactory {
    public static Match createMatch(MatchFormat format, 
                                   Team team1, Team team2) {
        switch (format) {
            case T20:
                return new T20Match(team1, team2, 20);
            case ODI:
                return new ODIMatch(team1, team2, 50);
            case TEST:
                return new TestMatch(team1, team2, 90);
            default:
                throw new IllegalArgumentException();
        }
    }
}
```

## Source Code

📄 **[View Complete Source Code](/problems/cricinfo/CODE)**

**Key Files:**
- [`CricinfoService.java`](/problems/cricinfo/CODE#cricinfoservicejava) - Main interface
- [`CricinfoServiceImpl.java`](/problems/cricinfo/CODE#cricinfoserviceimpljava) - Implementation
- [`Match.java`](/problems/cricinfo/CODE#matchjava) - Match model (57 lines)
- [`Player.java`](/problems/cricinfo/CODE#playerjava) - Player statistics (38 lines)
- [`Team.java`](/problems/cricinfo/CODE#teamjava) - Team model (41 lines)
- [`Ball.java`](/problems/cricinfo/CODE#balljava) - Ball tracking (36 lines)

**Total Lines of Code:** ~400 lines

## Usage Example

```java
// Initialize service
CricinfoService cricinfo = new CricinfoServiceImpl();

// Create teams
String indiaId = cricinfo.createTeam("India", "India");
String ausId = cricinfo.createTeam("Australia", "Australia");

// Add players
String kohliId = cricinfo.addPlayer(indiaId, "Virat Kohli", "India", PlayerRole.BATSMAN);
String dhoniId = cricinfo.addPlayer(indiaId, "MS Dhoni", "India", PlayerRole.WICKETKEEPER);
String smithId = cricinfo.addPlayer(ausId, "Steve Smith", "Australia", PlayerRole.BATSMAN);

// Schedule match
String matchId = cricinfo.scheduleMatch(indiaId, ausId, "Melbourne Cricket Ground");

// Start match
cricinfo.startMatch(matchId);

// Update scores (ball-by-ball)
Ball ball1 = new Ball(kohliId, "bowler1", 4, false); // Boundary
cricinfo.updateScore(matchId, ball1);

Ball ball2 = new Ball(kohliId, "bowler1", 0, true); // Wicket
cricinfo.updateScore(matchId, ball2);

// Get live score
Match match = cricinfo.getMatch(matchId);
System.out.println(match.getTeam1().getName() + ": " + match.getTeam1Score());

// End match
cricinfo.endMatch(matchId, indiaId);
```

## Common Interview Questions

### System Design Questions

1. **How do you handle real-time score updates for millions of users?**
   - WebSocket connections for active viewers
   - Server-Sent Events (SSE) for unidirectional updates
   - Redis Pub/Sub for distributing updates
   - CDN caching for static match data

2. **How do you ensure consistency when multiple scorers update simultaneously?**
   - Single scorer per match (logical constraint)
   - Optimistic locking with version numbers
   - Event sourcing for audit trail
   - CQRS (Command Query Responsibility Segregation)

3. **How would you design the database schema?**
   - Matches table (id, teams, venue, status, winner)
   - Balls table (matchId, over, ball, runs, wicket)
   - Players table (id, name, role, team)
   - Statistics table (playerId, matchId, runs, wickets)

4. **How do you calculate complex statistics efficiently?**
   - Materialized views for aggregations
   - Incremental updates during match
   - Background jobs for historical data
   - Cache frequently accessed stats

### Coding Questions

1. **Implement strike rate calculation**
   ```java
   public double strikeRate(int runs, int balls) {
       return balls == 0 ? 0.0 : (runs * 100.0) / balls;
   }
   ```

2. **Find top run scorers in a match**
   ```java
   public List<Player> topScorers(Match match, int n) {
       return match.getAllPlayers().stream()
           .sorted((a, b) -> b.getRuns() - a.getRuns())
           .limit(n)
           .collect(Collectors.toList());
   }
   ```

3. **Determine match result**
   ```java
   public String determineWinner(Match match) {
       int score1 = match.getTeam1Score();
       int score2 = match.getTeam2Score();
       
       if (score1 > score2) {
           return match.getTeam1().getName() + " won by " + 
                  (score1 - score2) + " runs";
       } else if (score2 > score1) {
           int wickets = 10 - match.getTeam2Wickets();
           return match.getTeam2().getName() + " won by " + 
                  wickets + " wickets";
       } else {
           return "Match tied";
       }
   }
   ```

### Design Pattern Questions
1. **Which pattern for real-time updates?** → Observer Pattern
2. **Which pattern for match states?** → State Pattern
3. **Which pattern for match types (T20, ODI, Test)?** → Factory Pattern

## Trade-offs & Design Decisions

### 1. Real-Time Updates
**WebSocket:** Bidirectional, high resource usage  
**SSE:** Unidirectional, efficient for read-only

**Decision:** SSE for score updates, WebSocket for interactive features

### 2. Data Storage
**NoSQL (MongoDB):** Fast writes, flexible schema  
**SQL (PostgreSQL):** ACID guarantees, complex queries

**Decision:** NoSQL for live data, SQL for historical analytics

### 3. Caching Strategy
**Redis:** In-memory, fast, volatile  
**CDN:** Geographic distribution, static content

**Decision:** Redis for live scores, CDN for match archives

## Key Takeaways

### What Interviewers Look For
1. ✅ **Real-time updates** architecture
2. ✅ **Consistency** in score calculation
3. ✅ **Scalability** for millions of viewers
4. ✅ **Statistics calculation** algorithms
5. ✅ **State management** for match lifecycle
6. ✅ **Observer pattern** for notifications

### Common Mistakes to Avoid
1. ❌ No thread-safety for score updates
2. ❌ Inefficient statistics calculation
3. ❌ Not handling tied matches
4. ❌ Missing validation for impossible scores
5. ❌ No support for extras (wides, no-balls)
6. ❌ Forgetting match abandonment scenarios

### Production-Ready Checklist
- [x] Match creation and scheduling
- [x] Ball-by-ball score tracking
- [x] Player and team statistics
- [x] Match winner determination
- [x] Thread-safe operations
- [ ] Real-time WebSocket updates
- [ ] Database persistence
- [ ] Commentary system
- [ ] Video highlights integration
- [ ] Mobile push notifications

---

## Related Problems
- ⚽ **Football Scoring** - Similar real-time updates
- 🏀 **Basketball Stats** - Player statistics tracking
- 🎮 **Gaming Leaderboard** - Real-time rankings
- 📊 **Stock Ticker** - Real-time data streams

## References
- Observer Pattern: Gang of Four Design Patterns
- Event Sourcing: Martin Fowler's architecture patterns
- Real-time Systems: WebSocket vs SSE comparison
- Cricket Rules: ICC official regulations

---

*This implementation demonstrates production-ready cricket scoring system with real-time updates, player statistics, and match management. Perfect for sports application interviews at ESPN, Dream11, and real-time systems companies.*
