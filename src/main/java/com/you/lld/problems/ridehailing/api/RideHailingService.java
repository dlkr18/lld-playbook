package com.you.lld.problems.ridehailing.api;
import com.you.lld.problems.ridehailing.model.*;
import java.util.*;
public interface RideHailingService { Rider registerRider(String name, String phone); Driver registerDriver(String name, String phone); Trip requestRide(String riderId, Location pickup, Location dropoff); void acceptRide(String driverId, String tripId); void startTrip(String tripId); void completeTrip(String tripId); Payment processPayment(String tripId); }