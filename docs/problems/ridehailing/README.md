# Ride Hailing System (Uber / Lyft)

## Overview
A real-time ride-hailing platform matching riders with drivers based on location, optimizing routes, calculating fares, and handling payments. Supports surge pricing, ride-sharing, and real-time tracking for millions of concurrent users.

**Difficulty:** Hard  
**Domain:** Geospatial, Real-Time Systems  
**Interview Frequency:** Very High (Uber, Lyft, Ola, Grab)

## Requirements

### Functional Requirements
1. **Rider**: Request ride, track driver, pay, rate
2. **Driver**: Accept/reject rides, navigate, complete trip
3. **Matching**: Pair rider with nearest available driver
4. **Pricing**: Base fare + time + distance + surge
5. **Tracking**: Real-time location updates
6. **Payment**: Multiple methods, split payments

### Non-Functional Requirements
1. **Latency**: Matching < 5s, ETA < 1s
2. **Availability**: 99.99% uptime
3. **Scalability**: 1M concurrent rides
4. **Accuracy**: GPS accuracy < 10m

## System Design

### Key Algorithms

#### 1. Driver-Rider Matching
```java
public Driver findNearestDriver(Location riderLocation) {
    return drivers.stream()
        .filter(Driver::isAvailable)
        .min(Comparator.comparingDouble(d -> 
            distance(d.getLocation(), riderLocation)
        ))
        .orElseThrow(() -> new NoDriverAvailableException());
}
```

**Time Complexity:** O(D) where D=drivers  
**Optimization:** Geohash index O(log D)

#### 2. Fare Calculation
```java
public double calculateFare(Ride ride) {
    double baseFare = 2.50;
    double perKm = 1.50;
    double perMinute = 0.25;
    
    double distance = ride.getDistanceKm();
    double duration = ride.getDurationMinutes();
    
    double fare = baseFare + (distance * perKm) + (duration * perMinute);
    
    // Surge pricing
    if (isSurge()) {
        fare *= getSurgeMultiplier(); // 1.5x - 3x
    }
    
    return Math.round(fare * 100) / 100.0;
}
```

#### 3. ETA Calculation
```java
public int calculateETA(Location driver, Location rider) {
    double distance = haversineDistance(driver, rider);
    double avgSpeed = 30.0; // km/h in city
    
    int travelTime = (int)((distance / avgSpeed) * 60); // minutes
    
    // Add traffic factor
    if (isRushHour()) {
        travelTime *= 1.5;
    }
    
    return travelTime;
}
```

#### 4. Geohash for Spatial Indexing
```java
public List<Driver> findNearbyDrivers(Location location, double radiusKm) {
    String geohash = Geohash.encode(location, 6); // 6-char precision
    
    // Get drivers in same geohash cell and adjacent cells
    List<String> cells = Geohash.getNeighbors(geohash);
    
    return cells.stream()
        .flatMap(cell -> driversInCell.get(cell).stream())
        .filter(d -> distance(d.getLocation(), location) <= radiusKm)
        .collect(Collectors.toList());
}
```

## Design Patterns

### 1. State Pattern (Ride States)
```java
enum RideState {
    REQUESTED, ACCEPTED, DRIVER_ARRIVING, 
    IN_PROGRESS, COMPLETED, CANCELLED
}

interface RideStateHandler {
    void cancel();
    void start();
    void complete();
}
```

### 2. Strategy Pattern (Pricing)
```java
interface PricingStrategy {
    double calculate(Ride ride);
}

class SurgePricing implements PricingStrategy {
    public double calculate(Ride ride) {
        return baseFare * surgeMultiplier;
    }
}

class FlatRatePricing implements PricingStrategy {
    public double calculate(Ride ride) {
        return flatRate;
    }
}
```

### 3. Observer Pattern (Location Updates)
```java
interface LocationObserver {
    void onLocationUpdate(String driverId, Location location);
}

class RiderTracker implements LocationObserver {
    public void onLocationUpdate(String driverId, Location loc) {
        updateMap(driverId, loc);
        notifyRider(calculateETA(loc, riderLocation));
    }
}
```

## Source Code
📄 **[View Complete Source Code](/problems/ridehailing/CODE)**

## Usage Example
```java
RideHailingService service = new RideHailingServiceImpl();

// Rider requests ride
RideRequest request = RideRequest.builder()
    .riderId("rider123")
    .pickupLocation(new Location(40.7128, -74.0060))
    .dropLocation(new Location(40.7589, -73.9851))
    .rideType(RideType.UBER_X)
    .build();
    
Ride ride = service.requestRide(request);

// Match with driver
Driver driver = service.matchDriver(ride);

// Driver accepts
service.acceptRide(ride.getId(), driver.getId());

// Start ride
service.startRide(ride.getId());

// Complete ride
service.completeRide(ride.getId());

// Calculate fare
double fare = service.calculateFare(ride.getId());

// Process payment
service.processPayment(ride.getId(), PaymentMethod.CARD);
```

## Common Interview Questions

1. **How do you match riders with drivers at scale?**
   - Geospatial indexing (Geohash, S2)
   - In-memory index (Redis Geospatial)
   - Predictive matching (ML)
   - Parallel matching for multiple riders

2. **How do you handle surge pricing?**
   - Demand/supply ratio per geohash cell
   - Dynamic multiplier (1.5x - 3x)
   - Real-time adjustment (every 1 min)
   - Notify riders before confirmation

3. **How do you track real-time location?**
   - WebSocket connections
   - Location updates every 4 seconds
   - Geohash updates for indexing
   - Redis for fast read/write

4. **How do you calculate optimal route?**
   - Dijkstra's algorithm
   - Google Maps API
   - Traffic-aware routing
   - Alternative routes

## Key Takeaways

### What Interviewers Look For
1. ✅ Geospatial algorithms (Geohash, S2)
2. ✅ Real-time matching logic
3. ✅ Surge pricing calculation
4. ✅ ETA estimation
5. ✅ WebSocket for tracking
6. ✅ Payment processing

### Common Mistakes
1. ❌ Linear search for drivers (use geospatial index)
2. ❌ Not handling driver unavailability
3. ❌ Ignoring traffic in ETA
4. ❌ No surge pricing
5. ❌ Synchronous location updates
6. ❌ Single point of failure

---

## Related Problems
- 🍕 **Food Delivery** - Similar matching
- 🚗 **Parking Lot** - Space allocation
- 📍 **Location Services** - Geospatial queries
- 💰 **Payment Gateway** - Transaction processing

*Production-ready ride-hailing system with geospatial matching, real-time tracking, and dynamic pricing. Essential for marketplace platforms.*
