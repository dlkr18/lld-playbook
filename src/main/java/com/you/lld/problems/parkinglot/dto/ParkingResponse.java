package com.you.lld.problems.parkinglot.dto;

import com.you.lld.problems.parkinglot.model.VehicleType;

import java.time.LocalDateTime;

/**
 * DTO for parking ticket response.
 */
public class ParkingResponse {
    
    private String ticketId;
    private String licensePlate;
    private VehicleType vehicleType;
    private String spaceId;
    private int floor;
    private LocalDateTime entryTime;
    private LocalDateTime exitTime;
    private Double parkingFee;
    private String currency;
    private String status; // ACTIVE, COMPLETED, CANCELLED
    
    // Getters and Setters
    public String getTicketId() { return ticketId; }
    public void setTicketId(String ticketId) { this.ticketId = ticketId; }
    
    public String getLicensePlate() { return licensePlate; }
    public void setLicensePlate(String licensePlate) { this.licensePlate = licensePlate; }
    
    public VehicleType getVehicleType() { return vehicleType; }
    public void setVehicleType(VehicleType vehicleType) { this.vehicleType = vehicleType; }
    
    public String getSpaceId() { return spaceId; }
    public void setSpaceId(String spaceId) { this.spaceId = spaceId; }
    
    public int getFloor() { return floor; }
    public void setFloor(int floor) { this.floor = floor; }
    
    public LocalDateTime getEntryTime() { return entryTime; }
    public void setEntryTime(LocalDateTime entryTime) { this.entryTime = entryTime; }
    
    public LocalDateTime getExitTime() { return exitTime; }
    public void setExitTime(LocalDateTime exitTime) { this.exitTime = exitTime; }
    
    public Double getParkingFee() { return parkingFee; }
    public void setParkingFee(Double parkingFee) { this.parkingFee = parkingFee; }
    
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    @Override
    public String toString() {
        return "ParkingResponse{" +
                "ticketId='" + ticketId + '\'' +
                ", licensePlate='" + licensePlate + '\'' +
                ", spaceId='" + spaceId + '\'' +
                ", floor=" + floor +
                ", status='" + status + '\'' +
                '}';
    }
}
