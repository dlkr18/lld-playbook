package com.you.lld.problems.parkinglot.dto;

import com.you.lld.problems.parkinglot.model.VehicleType;

/**
 * DTO for parking entry request.
 */
public class ParkingRequest {
    
    private String licensePlate;
    private VehicleType vehicleType;
    private int preferredFloor;  // Optional: -1 for any floor
    
    public ParkingRequest() {
        this.preferredFloor = -1;
    }
    
    public ParkingRequest(String licensePlate, VehicleType vehicleType) {
        this.licensePlate = licensePlate;
        this.vehicleType = vehicleType;
        this.preferredFloor = -1;
    }
    
    // Getters and Setters
    public String getLicensePlate() { return licensePlate; }
    public void setLicensePlate(String licensePlate) { this.licensePlate = licensePlate; }
    
    public VehicleType getVehicleType() { return vehicleType; }
    public void setVehicleType(VehicleType vehicleType) { this.vehicleType = vehicleType; }
    
    public int getPreferredFloor() { return preferredFloor; }
    public void setPreferredFloor(int preferredFloor) { this.preferredFloor = preferredFloor; }
    
    @Override
    public String toString() {
        return "ParkingRequest{" +
                "licensePlate='" + licensePlate + '\'' +
                ", vehicleType=" + vehicleType +
                ", preferredFloor=" + preferredFloor +
                '}';
    }
}
