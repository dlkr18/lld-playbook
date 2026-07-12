# ridehailing - Complete Implementation

## 📁 Project Structure (18 files)

```
ridehailing/
├── RideHailingDemo.java
├── api/RideHailingService.java
├── exceptions/DriverNotFoundException.java
├── exceptions/NoDriverAvailableException.java
├── exceptions/RiderNotFoundException.java
├── exceptions/TripNotFoundException.java
├── impl/InMemoryRideHailingService.java
├── model/Driver.java
├── model/DriverStatus.java
├── model/Fare.java
├── model/Location.java
├── model/Payment.java
├── model/Rating.java
├── model/Rider.java
├── model/Trip.java
├── model/TripStatus.java
├── model/Vehicle.java
├── model/VehicleType.java
```

## 📝 Source Code

### 📄 `RideHailingDemo.java`

<details>
<summary>📄 Click to view RideHailingDemo.java</summary>

```java
package com.you.lld.problems.ridehailing;

import com.you.lld.problems.ridehailing.api.*;
import com.you.lld.problems.ridehailing.impl.*;
import com.you.lld.problems.ridehailing.model.*;

public class RideHailingDemo {
    public static void main(String[] args) {
        System.out.println("=== Ride Hailing System Demo ===\n");
        
        RideHailingService service = new InMemoryRideHailingService();
        
        // Register rider and driver
        Rider rider = service.registerRider("Alice", "555-0100");
        Driver driver = service.registerDriver("Bob", "555-0200");
        
        System.out.println("✅ Registered rider: " + rider.getName());
        System.out.println("✅ Registered driver: " + driver.getName());
        
        // Request a ride
        Location pickup = new Location(40.7, -74.0);
        Location dropoff = new Location(40.8, -74.1);
        Trip trip = service.requestRide(rider.getRiderId(), pickup, dropoff);
        
        System.out.println("\n📱 Ride requested");
        System.out.println("   Pickup: " + pickup);
        System.out.println("   Dropoff: " + dropoff);
        
        // Driver accepts and starts trip
        service.acceptRide(driver.getDriverId(), trip.getTripId());
        System.out.println("\n✅ Driver accepted the ride");
        
        service.startTrip(trip.getTripId());
        System.out.println("🚗 Trip started");
        
        service.completeTrip(trip.getTripId());
        System.out.println("🏁 Trip completed");
        
        // Process payment
        Payment payment = service.processPayment(trip.getTripId());
        System.out.println("\n💳 Payment processed");
        System.out.println("   Fare: $" + payment.getAmount());
        
        System.out.println("\n✅ Demo completed successfully!");
    }
}```

</details>

### 📄 `api/RideHailingService.java`

<details>
<summary>📄 Click to view api/RideHailingService.java</summary>

```java
package com.you.lld.problems.ridehailing.api;

import com.you.lld.problems.ridehailing.model.*;
import java.util.*;

public interface RideHailingService {
    Rider registerRider(String name, String phone);
    Driver registerDriver(String name, String phone);
    Trip requestRide(String riderId, Location pickup, Location dropoff);
    void acceptRide(String driverId, String tripId);
    void startTrip(String tripId);
    void completeTrip(String tripId);
    Payment processPayment(String tripId);
    List<Driver> getAvailableDrivers(Location location);
    List<Trip> getRiderTrips(String riderId);
    List<Trip> getDriverTrips(String driverId);
}```

</details>

### 📄 `exceptions/DriverNotFoundException.java`

<details>
<summary>📄 Click to view exceptions/DriverNotFoundException.java</summary>

```java
package com.you.lld.problems.ridehailing.exceptions;
public class DriverNotFoundException extends RuntimeException { public DriverNotFoundException(String m) { super(m); } }```

</details>

### 📄 `exceptions/NoDriverAvailableException.java`

<details>
<summary>📄 Click to view exceptions/NoDriverAvailableException.java</summary>

```java
package com.you.lld.problems.ridehailing.exceptions;
public class NoDriverAvailableException extends RuntimeException { public NoDriverAvailableException(String m) { super(m); } }```

</details>

### 📄 `exceptions/RiderNotFoundException.java`

<details>
<summary>📄 Click to view exceptions/RiderNotFoundException.java</summary>

```java
package com.you.lld.problems.ridehailing.exceptions;
public class RiderNotFoundException extends RuntimeException { public RiderNotFoundException(String m) { super(m); } }```

</details>

### 📄 `exceptions/TripNotFoundException.java`

<details>
<summary>📄 Click to view exceptions/TripNotFoundException.java</summary>

```java
package com.you.lld.problems.ridehailing.exceptions;
public class TripNotFoundException extends RuntimeException { public TripNotFoundException(String m) { super(m); } }```

</details>

### 📄 `impl/InMemoryRideHailingService.java`

<details>
<summary>📄 Click to view impl/InMemoryRideHailingService.java</summary>

```java
package com.you.lld.problems.ridehailing.impl;

import com.you.lld.problems.ridehailing.api.*;
import com.you.lld.problems.ridehailing.model.*;
import java.util.*;
import java.util.stream.Collectors;

public class InMemoryRideHailingService implements RideHailingService {
    private Map<String, Rider> riders = new HashMap<>();
    private Map<String, Driver> drivers = new HashMap<>();
    private Map<String, Trip> trips = new HashMap<>();
    
    @Override
    public Rider registerRider(String name, String phone) {
        String id = UUID.randomUUID().toString();
        Rider rider = new Rider(id, name, phone);
        riders.put(id, rider);
        return rider;
    }
    
    @Override
    public Driver registerDriver(String name, String phone) {
        String id = UUID.randomUUID().toString();
        Driver driver = new Driver(id, name, phone);
        drivers.put(id, driver);
        return driver;
    }
    
    @Override
    public Trip requestRide(String riderId, Location pickup, Location dropoff) {
        String tripId = UUID.randomUUID().toString();
        Trip trip = new Trip(tripId, riderId, "");
        trip.setPickupLocation(pickup);
        trip.setDropoffLocation(dropoff);
        trip.setStatus(TripStatus.REQUESTED);
        trips.put(tripId, trip);
        return trip;
    }
    
    @Override
    public void acceptRide(String driverId, String tripId) {
        Trip trip = trips.get(tripId);
        if (trip != null) {
            trip.setDriverId(driverId);
            trip.setStatus(TripStatus.ACCEPTED);
        }
    }
    
    @Override
    public void startTrip(String tripId) {
        Trip trip = trips.get(tripId);
        if (trip != null) {
            trip.setStatus(TripStatus.STARTED);
        }
    }
    
    @Override
    public void completeTrip(String tripId) {
        Trip trip = trips.get(tripId);
        if (trip != null) {
            trip.setStatus(TripStatus.COMPLETED);
        }
    }
    
    @Override
    public Payment processPayment(String tripId) {
        String paymentId = UUID.randomUUID().toString();
        return new Payment(paymentId, tripId, 25.50);
    }
    
    @Override
    public List<Driver> getAvailableDrivers(Location location) {
        return drivers.values().stream()
            .filter(d -> d.getStatus() == DriverStatus.AVAILABLE)
            .collect(Collectors.toList());
    }
    
    @Override
    public List<Trip> getRiderTrips(String riderId) {
        return trips.values().stream()
            .filter(t -> t.getRiderId().equals(riderId))
            .collect(Collectors.toList());
    }
    
    @Override
    public List<Trip> getDriverTrips(String driverId) {
        return trips.values().stream()
            .filter(t -> t.getDriverId() != null && t.getDriverId().equals(driverId))
            .collect(Collectors.toList());
    }
}```

</details>

### 📄 `model/Driver.java`

<details>
<summary>📄 Click to view model/Driver.java</summary>

```java
package com.you.lld.problems.ridehailing.model;

public class Driver {
    private String driverId;
    private String name;
    private String phone;
    private DriverStatus status;
    private Location location;
    
    public Driver(String id, String name, String phone) {
        this.driverId = id;
        this.name = name;
        this.phone = phone;
        this.status = DriverStatus.AVAILABLE;
    }
    
    public String getDriverId() {
        return driverId;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getPhone() {
        return phone;
    }
    
    public void setPhone(String phone) {
        this.phone = phone;
    }
    
    public DriverStatus getStatus() {
        return status;
    }
    
    public void setStatus(DriverStatus status) {
        this.status = status;
    }
    
    public Location getLocation() {
        return location;
    }
    
    public void setLocation(Location location) {
        this.location = location;
    }
}
```

</details>

### 📄 `model/DriverStatus.java`

<details>
<summary>📄 Click to view model/DriverStatus.java</summary>

```java
package com.you.lld.problems.ridehailing.model;

import com.you.lld.problems.ridehailing.serv.VehicleType;

public enum DriverStatus {AVAILABLE, BUSY, OFFLINE}```

</details>

        ### 📄 `model/Fare.java`

<details>
<summary>📄
Click to
view model/Fare.java</summary>

        ```java
package com.you.lld.problems.ridehailing.model;

public
class Fare {
    public static double calculate(double distance, VehicleType type) {
        double base = 5.0;
        double perKm = type == VehicleType.BIKE ? 2.0 : type == VehicleType.SEDAN ? 3.0 : 4.0;
        return base + (distance * perKm);
    }
}
```

</details>

### 📄 `model/Location.java`

<details>
<summary>📄 Click to view model/Location.java</summary>

```java
package com.you.lld.problems.ridehailing.model;
public
class Location  {
    private double latitude, longitude;
    public Location(double lat, double lon)  {
        latitude=lat;
        longitude=lon;
    }
    public double getLatitude()  {
        return latitude;
    }
    public double getLongitude()  {
        return longitude;
    }
    public double distanceTo(Location other)  {
        return Math.sqrt(Math.pow(latitude-other.latitude,2)+Math.pow(longitude-other.longitude,2));
    }
}
```

</details>

### 📄 `model/Payment.java`

<details>
<summary>📄 Click to view model/Payment.java</summary>

```java
package com.you.lld.problems.ridehailing.model;
public
class Payment  {
    private String paymentId, tripId;
    private double amount;
    public Payment(String id, String tid, double amt)  {
        paymentId=id;
        tripId=tid;
        amount=amt;
    }
    public double getAmount()  {
        return amount;
    }
}
```

</details>

### 📄 `model/Rating.java`

<details>
<summary>📄 Click to view model/Rating.java</summary>

```java
package com.you.lld.problems.ridehailing.model;
public
class Rating  {
    private String tripId;
    private int stars;
    private String comment;
    public Rating(String tid, int s)  {
        tripId=tid;
        stars=s;
    }
    public int getStars()  {
        return stars;
    }
}
```

</details>

### 📄 `model/Rider.java`

<details>
<summary>📄 Click to view model/Rider.java</summary>

```java
package com.you.lld.problems.ridehailing.model;

public class Rider {
    private String riderId;
    private String name;
    private String phone;
    
    public Rider(String id, String name, String phone) {
        this.riderId = id;
        this.name = name;
        this.phone = phone;
    }
    
    public String getRiderId() {
        return riderId;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getPhone() {
        return phone;
    }
    
    public void setPhone(String phone) {
        this.phone = phone;
    }
}
```

</details>

### 📄 `model/Trip.java`

<details>
<summary>📄 Click to view model/Trip.java</summary>

```java
package com.you.lld.problems.ridehailing.model;

import java.time.*;

public class Trip {
    private String tripId;
    private String riderId;
    private String driverId;
    private Location pickup;
    private Location dropoff;
    private TripStatus status;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private double fare;
    
    public Trip(String id, String riderId, String driverId) {
        this.tripId = id;
        this.riderId = riderId;
        this.driverId = driverId;
        this.status = TripStatus.REQUESTED;
    }
    
    public String getTripId() {
        return tripId;
    }
    
    public String getRiderId() {
        return riderId;
    }
    
    public String getDriverId() {
        return driverId;
    }
    
    public void setDriverId(String driverId) {
        this.driverId = driverId;
    }
    
    public Location getPickupLocation() {
        return pickup;
    }
    
    public void setPickupLocation(Location pickup) {
        this.pickup = pickup;
    }
    
    public Location getDropoffLocation() {
        return dropoff;
    }
    
    public void setDropoffLocation(Location dropoff) {
        this.dropoff = dropoff;
    }
    
    public TripStatus getStatus() {
        return status;
    }
    
    public void setStatus(TripStatus status) {
        this.status = status;
    }
    
    public LocalDateTime getStartTime() {
        return startTime;
    }
    
    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }
    
    public LocalDateTime getEndTime() {
        return endTime;
    }
    
    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }
    
    public double getFare() {
        return fare;
    }
    
    public void setFare(double fare) {
        this.fare = fare;
    }
}
```

</details>

### 📄 `model/TripStatus.java`

<details>
<summary>📄 Click to view model/TripStatus.java</summary>

```java
package com.you.lld.problems.ridehailing.model;

import com.you.lld.problems.ridehailing.serv.VehicleType;

public enum TripStatus {REQUESTED, ACCEPTED, STARTED, COMPLETED, CANCELLED}```

</details>

        ### 📄 `model/Vehicle.java`

<details>
<summary>📄
Click to
view model/Vehicle.java</summary>

        ```java
package com.you.lld.problems.ridehailing.model;

public
class Vehicle {
    private String vehicleId, licensePlate;
    private VehicleType type;

    public Vehicle(String id, String plate, VehicleType t) {
        vehicleId = id;
        licensePlate = plate;
        type = t;
    }

    public VehicleType getType() {
        return type;
    }
}
```

</details>

### 📄 `model/VehicleType.java`

<details>
<summary>📄 Click to view model/VehicleType.java</summary>

```java
package com.you.lld.problems.ridehailing.model;
public enum VehicleType { SEDAN, SUV, BIKE, AUTO }```

</details>

