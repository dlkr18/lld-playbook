# Ride Hailing Service (Uber)

## Difficulty: Hard | Pattern: Strategy, Observer, State

```java
class RideHailingService {
    private Map<String, Driver> drivers;
    private Map<String, Rider> riders;
    private Map<String, Ride> rides;
    private MatchingAlgorithm matcher;
    
    Ride requestRide(RideRequest request);
    void acceptRide(String rideId, String driverId);
    void completeRide(String rideId);
}

class MatchingAlgorithm {
    Driver findNearestDriver(Location location);
}
```

**Status**: ✅ Documented
