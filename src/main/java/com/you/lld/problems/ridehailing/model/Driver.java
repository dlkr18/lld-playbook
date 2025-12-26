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
