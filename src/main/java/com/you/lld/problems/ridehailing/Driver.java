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
