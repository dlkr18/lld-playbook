# Ride Hailing - Complete Implementation

## 📂 22 Java Files

### Driver.java

<details><summary>📄 View</summary>

```java
package com.you.lld.problems.ridehailing;
public class Driver {
    public enum DriverStatus { AVAILABLE, BUSY, OFFLINE }
    
    private final String driverId;
    private String name;
    private String location;
    private DriverStatus status;
    
    public Driver(String driverId, String name, String location) {
        this.driverId = driverId;
        this.name = name;
        this.location = location;
        this.status = DriverStatus.AVAILABLE;
    }
    
    public String getDriverId() { return driverId; }
    public String getLocation() { return location; }
    public DriverStatus getStatus() { return status; }
    public void setStatus(DriverStatus status) { this.status = status; }
}

```
</details>

### RideHailingDemo.java

<details><summary>📄 View</summary>

```java
package com.you.lld.problems.ridehailing;
import com.you.lld.problems.ridehailing.api.*;
import com.you.lld.problems.ridehailing.impl.*;
import com.you.lld.problems.ridehailing.model.*;
public class RideHailingDemo { public static void main(String[] args) { System.out.println("Ride Hailing Demo"); RideHailingService service = new InMemoryRideHailingService(); Rider rider = service.registerRider("Alice","555-0100"); Driver driver = service.registerDriver("Bob","555-0200"); Trip trip = service.requestRide(rider.getRiderId(), new Location(40.7,-74.0), new Location(40.8,-74.1)); service.acceptRide(driver.getDriverId(), trip.getTripId()); service.startTrip(trip.getTripId()); service.completeTrip(trip.getTripId()); Payment payment = service.processPayment(trip.getTripId()); System.out.println("Trip completed! Fare: $" + payment.getAmount()); } }
```
</details>

### RideHailingSystem.java

<details><summary>📄 View</summary>

```java
package com.you.lld.problems.ridehailing;
import java.util.*;

public class RideHailingSystem {
    private final Map<String, Rider> riders;
    private final Map<String, Driver> drivers;
    private final Map<String, Trip> trips;
    
    public RideHailingSystem() {
        this.riders = new HashMap<>();
        this.drivers = new HashMap<>();
        this.trips = new HashMap<>();
    }
    
    public void registerRider(Rider rider) {
        riders.put(rider.getRiderId(), rider);
    }
    
    public void registerDriver(Driver driver) {
        drivers.put(driver.getDriverId(), driver);
    }
    
    public String requestRide(Trip trip) {
        trips.put(trip.getTripId(), trip);
        Driver nearestDriver = findNearestDriver(trip);
        if (nearestDriver != null) {
            trip.assignDriver(nearestDriver.getDriverId());
            trip.setStatus(Trip.TripStatus.ACCEPTED);
            nearestDriver.setStatus(Driver.DriverStatus.BUSY);
        }
        return trip.getTripId();
    }
    
    private Driver findNearestDriver(Trip trip) {
        for (Driver driver : drivers.values()) {
            if (driver.getStatus() == Driver.DriverStatus.AVAILABLE) {
                return driver; // Simplified - would use location matching
            }
        }
        return null;
    }
}

```
</details>

### Rider.java

<details><summary>📄 View</summary>

```java
package com.you.lld.problems.ridehailing;
public class Rider {
    private final String riderId;
    private String name;
    private String location;
    
    public Rider(String riderId, String name, String location) {
        this.riderId = riderId;
        this.name = name;
        this.location = location;
    }
    
    public String getRiderId() { return riderId; }
    public String getName() { return name; }
    public String getLocation() { return location; }
}

```
</details>

### Trip.java

<details><summary>📄 View</summary>

```java
package com.you.lld.problems.ridehailing;
import java.time.LocalDateTime;

public class Trip {
    public enum TripStatus { REQUESTED, ACCEPTED, IN_PROGRESS, COMPLETED, CANCELLED }
    
    private final String tripId;
    private final String riderId;
    private String driverId;
    private String pickupLocation;
    private String dropLocation;
    private TripStatus status;
    private LocalDateTime requestTime;
    
    public Trip(String tripId, String riderId, String pickup, String drop) {
        this.tripId = tripId;
        this.riderId = riderId;
        this.pickupLocation = pickup;
        this.dropLocation = drop;
        this.status = TripStatus.REQUESTED;
        this.requestTime = LocalDateTime.now();
    }
    
    public String getTripId() { return tripId; }
    public TripStatus getStatus() { return status; }
    public void setStatus(TripStatus status) { this.status = status; }
    public void assignDriver(String driverId) { this.driverId = driverId; }
}

```
</details>

### RideHailingService.java

<details><summary>📄 View</summary>

```java
package com.you.lld.problems.ridehailing.api;
import com.you.lld.problems.ridehailing.model.*;
import java.util.*;
public interface RideHailingService { Rider registerRider(String name, String phone); Driver registerDriver(String name, String phone); Trip requestRide(String riderId, Location pickup, Location dropoff); void acceptRide(String driverId, String tripId); void startTrip(String tripId); void completeTrip(String tripId); Payment processPayment(String tripId); }
```
</details>

### DriverNotFoundException.java

<details><summary>📄 View</summary>

```java
package com.you.lld.problems.ridehailing.exceptions;
public class DriverNotFoundException extends RuntimeException { public DriverNotFoundException(String m) { super(m); } }
```
</details>

### NoDriverAvailableException.java

<details><summary>📄 View</summary>

```java
package com.you.lld.problems.ridehailing.exceptions;
public class NoDriverAvailableException extends RuntimeException { public NoDriverAvailableException(String m) { super(m); } }
```
</details>

### RiderNotFoundException.java

<details><summary>📄 View</summary>

```java
package com.you.lld.problems.ridehailing.exceptions;
public class RiderNotFoundException extends RuntimeException { public RiderNotFoundException(String m) { super(m); } }
```
</details>

### TripNotFoundException.java

<details><summary>📄 View</summary>

```java
package com.you.lld.problems.ridehailing.exceptions;
public class TripNotFoundException extends RuntimeException { public TripNotFoundException(String m) { super(m); } }
```
</details>

### InMemoryRideHailingService.java

<details><summary>📄 View</summary>

```java
package com.you.lld.problems.ridehailing.impl;
import com.you.lld.problems.ridehailing.api.*;
import com.you.lld.problems.ridehailing.model.*;
import java.util.*;stream.Collectors;
public class InMemoryRideHailingService implements RideHailingService { private Map<String,Rider> riders = new HashMap<>(); private Map<String,Driver> drivers = new HashMap<>(); private Map<String,Trip> trips = new HashMap<>(); public Rider registerRider(String n, String p) { String id = UUID.randomUUID().toString(); Rider r = new Rider(id,n,p); riders.put(id,r); return r; } public Driver registerDriver(String n, String p) { String id = UUID.randomUUID().toString(); Driver d = new Driver(id,n,p); drivers.put(id,d); return d; } public Trip requestRide(String rid, Location pickup, Location dropoff) { String id = UUID.randomUUID().toString(); Trip t = new Trip(id,rid,""); trips.put(id,t); return t; } public void acceptRide(String did, String tid) { Trip t = trips.get(tid); t.setStatus(TripStatus.ACCEPTED); } public void startTrip(String tid) { trips.get(tid).setStatus(TripStatus.STARTED); } public void completeTrip(String tid) { trips.get(tid).setStatus(TripStatus.COMPLETED); } public Payment processPayment(String tid) { return new Payment("P1",tid,25.50); } }
```
</details>

### Driver.java

<details><summary>📄 View</summary>

```java
package com.you.lld.problems.ridehailing.model;
public class Driver { private String driverId, name, phone; private DriverStatus status; private Location location; public Driver(String id, String n, String p) { driverId=id; name=n; phone=p; status=DriverStatus.AVAILABLE; } public String getDriverId() { return driverId; } public DriverStatus getStatus() { return status; } public void setStatus(DriverStatus s) { status=s; } public Location getLocation() { return location; } public void setLocation(Location l) { location=l; } }
```
</details>

### DriverStatus.java

<details><summary>📄 View</summary>

```java
package com.you.lld.problems.ridehailing.model;
public enum DriverStatus { AVAILABLE, BUSY, OFFLINE }
```
</details>

### Fare.java

<details><summary>📄 View</summary>

```java
package com.you.lld.problems.ridehailing.model;
public class Fare { public static double calculate(double distance, VehicleType type) { double base = 5.0; double perKm = type==VehicleType.BIKE ? 2.0 : type==VehicleType.SEDAN ? 3.0 : 4.0; return base + (distance * perKm); } }
```
</details>

### Location.java

<details><summary>📄 View</summary>

```java
package com.you.lld.problems.ridehailing.model;
public class Location { private double latitude, longitude; public Location(double lat, double lon) { latitude=lat; longitude=lon; } public double getLatitude() { return latitude; } public double getLongitude() { return longitude; } public double distanceTo(Location other) { return Math.sqrt(Math.pow(latitude-other.latitude,2)+Math.pow(longitude-other.longitude,2)); } }
```
</details>

### Payment.java

<details><summary>📄 View</summary>

```java
package com.you.lld.problems.ridehailing.model;
public class Payment { private String paymentId, tripId; private double amount; public Payment(String id, String tid, double amt) { paymentId=id; tripId=tid; amount=amt; } public double getAmount() { return amount; } }
```
</details>

### Rating.java

<details><summary>📄 View</summary>

```java
package com.you.lld.problems.ridehailing.model;
public class Rating { private String tripId; private int stars; private String comment; public Rating(String tid, int s) { tripId=tid; stars=s; } public int getStars() { return stars; } }
```
</details>

### Rider.java

<details><summary>📄 View</summary>

```java
package com.you.lld.problems.ridehailing.model;
public class Rider { private String riderId, name, phone; public Rider(String id, String n, String p) { riderId=id; name=n; phone=p; } public String getRiderId() { return riderId; } public String getName() { return name; } }
```
</details>

### Trip.java

<details><summary>📄 View</summary>

```java
package com.you.lld.problems.ridehailing.model;
import java.time.*;
public class Trip { private String tripId, riderId, driverId; private Location pickup, dropoff; private TripStatus status; private LocalDateTime startTime, endTime; private double fare; public Trip(String id, String rid, String did) { tripId=id; riderId=rid; driverId=did; status=TripStatus.REQUESTED; } public String getTripId() { return tripId; } public TripStatus getStatus() { return status; } public void setStatus(TripStatus s) { status=s; } public void setFare(double f) { fare=f; } public double getFare() { return fare; } }
```
</details>

### TripStatus.java

<details><summary>📄 View</summary>

```java
package com.you.lld.problems.ridehailing.model;
public enum TripStatus { REQUESTED, ACCEPTED, STARTED, COMPLETED, CANCELLED }
```
</details>

### Vehicle.java

<details><summary>📄 View</summary>

```java
package com.you.lld.problems.ridehailing.model;
public class Vehicle { private String vehicleId, licensePlate; private VehicleType type; public Vehicle(String id, String plate, VehicleType t) { vehicleId=id; licensePlate=plate; type=t; } public VehicleType getType() { return type; } }
```
</details>

### VehicleType.java

<details><summary>📄 View</summary>

```java
package com.you.lld.problems.ridehailing.model;
public enum VehicleType { SEDAN, SUV, BIKE, AUTO }
```
</details>

