package com.you.lld.problems.ridehailing.model;

/**
 * Immutable representation of a driver's vehicle.
 */
public class Vehicle {
    private final String vehicleId;
    private final String licensePlate;
    private final VehicleType type;
    private final String model;
    private final String color;

    public Vehicle(String vehicleId, String licensePlate, VehicleType type,
                   String model, String color) {
        this.vehicleId = vehicleId;
        this.licensePlate = licensePlate;
        this.type = type;
        this.model = model;
        this.color = color;
    }

    public String getVehicleId() { return vehicleId; }
    public String getLicensePlate() { return licensePlate; }
    public VehicleType getType() { return type; }
    public String getModel() { return model; }
    public String getColor() { return color; }

    @Override
    public String toString() {
        return color + " " + model + " (" + type + ") [" + licensePlate + "]";
    }
}
