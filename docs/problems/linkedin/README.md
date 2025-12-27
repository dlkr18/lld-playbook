# LinkedIn Professional Network

## Overview
Professional networking platform with connections, job postings, feed, messaging, and recommendations.

## Key Features
- Profile management
- Connection requests (1st, 2nd, 3rd degree)
- Job search and applications
- News feed with professional content
- Skills endorsements
- Recommendations

## Key Algorithms
```java
public List<User> get2ndDegreeConnections(String userId) {
    Set<String> firstDegree = getConnections(userId);
    Set<String> secondDegree = new HashSet<>();
    
    for (String friendId : firstDegree) {
        for (String friendOfFriend : getConnections(friendId)) {
            if (!friendOfFriend.equals(userId) && 
                !firstDegree.contains(friendOfFriend)) {
                secondDegree.add(friendOfFriend);
            }
        }
    }
    
    return getUsersByIds(secondDegree);
}
```

## Source Code
📄 **[View Complete Source Code](/problems/linkedin/CODE)**
