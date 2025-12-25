# Cricinfo

## 19 Files

### Cricinfo.java
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

### Demo.java
```java
package com.you.lld.problems.cricinfo;
public class Demo { public static void main(String[] args) { System.out.println("Cricinfo"); } }
```

### Match.java
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

### Team.java
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

### Service.java
```java
package com.you.lld.problems.cricinfo.api;
public interface Service { }
```

### Exception0.java
```java
package com.you.lld.problems.cricinfo.exceptions;
public class Exception0 extends RuntimeException { public Exception0(String m) { super(m); } }
```

### Exception1.java
```java
package com.you.lld.problems.cricinfo.exceptions;
public class Exception1 extends RuntimeException { public Exception1(String m) { super(m); } }
```

### Exception2.java
```java
package com.you.lld.problems.cricinfo.exceptions;
public class Exception2 extends RuntimeException { public Exception2(String m) { super(m); } }
```

### ServiceImpl.java
```java
package com.you.lld.problems.cricinfo.impl;
import com.you.lld.problems.cricinfo.api.*;
public class ServiceImpl implements Service { }
```

### Model0.java
```java
package com.you.lld.problems.cricinfo.model;
public class Model0 { private String id; public Model0(String id) { this.id=id; } }
```

### Model1.java
```java
package com.you.lld.problems.cricinfo.model;
public class Model1 { private String id; public Model1(String id) { this.id=id; } }
```

### Model2.java
```java
package com.you.lld.problems.cricinfo.model;
public class Model2 { private String id; public Model2(String id) { this.id=id; } }
```

### Model3.java
```java
package com.you.lld.problems.cricinfo.model;
public class Model3 { private String id; public Model3(String id) { this.id=id; } }
```

### Model4.java
```java
package com.you.lld.problems.cricinfo.model;
public class Model4 { private String id; public Model4(String id) { this.id=id; } }
```

### Model5.java
```java
package com.you.lld.problems.cricinfo.model;
public class Model5 { private String id; public Model5(String id) { this.id=id; } }
```

### Model6.java
```java
package com.you.lld.problems.cricinfo.model;
public class Model6 { private String id; public Model6(String id) { this.id=id; } }
```

### Model7.java
```java
package com.you.lld.problems.cricinfo.model;
public class Model7 { private String id; public Model7(String id) { this.id=id; } }
```

### Model8.java
```java
package com.you.lld.problems.cricinfo.model;
public class Model8 { private String id; public Model8(String id) { this.id=id; } }
```

### Model9.java
```java
package com.you.lld.problems.cricinfo.model;
public class Model9 { private String id; public Model9(String id) { this.id=id; } }
```

