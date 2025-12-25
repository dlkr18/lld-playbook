# LinkedIn

## Problem: Design LinkedIn Professional Network

**Difficulty**: Hard  
**Pattern**: Graph, Recommendation Engine, Messaging  
**Time**: 90-120 min

---

## Key Classes

```java
class LinkedIn {
    private Map<String, Profile> profiles;
    private ConnectionGraph connectionGraph;
    private JobPostingService jobService;
    private MessagingService messaging;
    private RecommendationEngine recommendations;
}

class Profile {
    String userId;
    PersonalInfo info;
    List<Experience> experiences;
    List<Education> education;
    List<Skill> skills;
    List<Endorsement> endorsements;
}

class ConnectionGraph {
    void addConnection(String userId1, String userId2);
    int getConnectionDegree(String userId1, String userId2);
    List<Profile> suggestConnections(String userId);
}
```

---

**Status**: ✅ Documented
